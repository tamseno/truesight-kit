# TrueSight Motion Kit — one command from script.json to MP4.
#   .\tools\make.ps1 -Ep episodes\my-ep -Stage draft     # edge voice, stills sheet + QA (fast, for layout work)
#   .\tools\make.ps1 -Ep episodes\my-ep -Stage preview   # edge voice, full render sub=1, NVENC preview mp4
#   .\tools\make.ps1 -Ep episodes\my-ep -Stage voice     # final voice: IndexTTS-2.5 per line (cached) + faster-whisper word timings
#   .\tools\make.ps1 -Ep episodes\my-ep -Stage final     # IndexTTS voice (tts\*.wav + .json already made), sub=4 motion blur, final mp4
#   add -Fresh to throw away frames from an earlier render of the same stage (otherwise rendering resumes)
#   -Codec auto|hevc|h264: auto = HEVC for landscape (YouTube), H.264 for vertical/square/portrait (TikTok, Reels and feeds want H.264)
param([Parameter(Mandatory)][string]$Ep, [ValidateSet('draft','preview','voice','final')][string]$Stage = 'draft', [int]$Workers = 24, [switch]$Fresh, [ValidateSet('auto','hevc','h264')][string]$Codec = 'auto',
  [string]$TtsPy = 'D:\hark\indextts\.venv\Scripts\python.exe', [string]$AlignPy = 'D:\hark\_sys\work\mainchat-bili-ref\.venv\Scripts\python.exe')
$ErrorActionPreference = 'Stop'
$K = Split-Path $PSScriptRoot -Parent; Set-Location $K
$EpAbs = (Resolve-Path $Ep).Path; $py = "$K\.venv\Scripts\python.exe"
$ff = & $py -c "import imageio_ffmpeg as i;print(i.get_ffmpeg_exe())"
if ($Stage -eq 'voice') {
  & $TtsPy tools\voice_index.py $EpAbs; if ($LASTEXITCODE) { throw 'voice failed' }
  & $AlignPy tools\align.py $EpAbs; if ($LASTEXITCODE) { throw 'align failed' }
  & $py tools\timeline.py $EpAbs index; return
}
$voice = if ($Stage -eq 'final') { 'index' } else { 'edge' }
if ($voice -eq 'edge') { $env:HTTPS_PROXY = 'http://127.0.0.1:10808' }
& $py tools\timeline.py $EpAbs $voice; if ($LASTEXITCODE) { throw 'timeline failed' }
if ($Stage -eq 'draft') {
  Remove-Item "$EpAbs\stills\*" -ErrorAction SilentlyContinue
  node tools\render.mjs ep=$EpAbs scenes=all at=.5,.95 out=stills workers=12 qa=1
  & $py tools\sheet.py "$EpAbs\stills" "$EpAbs\sheet.jpg"; "sheet: $EpAbs\sheet.jpg"; return
}
$sub = if ($Stage -eq 'final') { 4 } else { 1 }
$frames = "$EpAbs\frames_$Stage"
if ($Fresh -and (Test-Path $frames)) { Remove-Item -Recurse -Force $frames }
node tools\render.mjs ep=$EpAbs out=$frames workers=$Workers sub=$sub q=93 resume=1 tag=$Stage; if ($LASTEXITCODE) { throw 'render failed' }
& $py tools\mix.py $EpAbs
$out = "$EpAbs\$((Split-Path $EpAbs -Leaf))_$Stage.mp4"
$tl = Get-Content "$EpAbs	imeline.json" -Raw | ConvertFrom-Json
if ($Codec -eq 'auto') { $Codec = if ($tl.w -gt $tl.h) { 'hevc' } else { 'h264' } }
$venc = if ($Codec -eq 'hevc') { @('-c:v','hevc_nvenc','-tag:v','hvc1') } else { @('-c:v','h264_nvenc','-profile:v','high') }
$vf = if ($sub -gt 1) { "tmix=frames=${sub},select='eq(mod(n\,${sub})\,$($sub-1))',setpts=N/(60*TB),scale=in_range=full:out_range=tv,format=yuv420p" } else { "scale=in_range=full:out_range=tv,format=yuv420p" }
& $ff -y -v error -stats -framerate (60*$sub) -i "$frames\f%06d.jpg" -i "$EpAbs\mix.wav" -vf $vf -r 60 @venc -preset p7 -tune hq -rc vbr -cq $(if ($sub -gt 1) {17} else {22}) -b:v 0 -maxrate 40M -bufsize 80M -spatial-aq 1 -temporal-aq 1 -bf 3 -g 120 -color_range tv -color_primaries bt709 -color_trc bt709 -colorspace bt709 -af "loudnorm=I=-14:TP=-1:LRA=11" -c:a aac -b:a 256k -ar 48000 -movflags +faststart -shortest $out
"video: $out ($Codec, $($tl.w)x$($tl.h) 60 fps)"
if ($tl.w -gt $tl.h) { & $py tools\chapters.py $EpAbs }
