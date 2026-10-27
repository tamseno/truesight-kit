# TrueSight Motion Kit — one command from script.json to MP4.
#   .\tools\make.ps1 -Ep episodes\my-ep -Stage draft     # edge voice, stills sheet + QA (fast, for layout work)
#   .\tools\make.ps1 -Ep episodes\my-ep -Stage preview   # edge voice, full render sub=1, NVENC preview mp4
#   .\tools\make.ps1 -Ep episodes\my-ep -Stage final     # IndexTTS voice (tts\*.wav + .json already made), sub=4 motion blur, final mp4
param([Parameter(Mandatory)][string]$Ep, [ValidateSet('draft','preview','final')][string]$Stage = 'draft', [int]$Workers = 24)
$ErrorActionPreference = 'Stop'
$K = Split-Path $PSScriptRoot -Parent; Set-Location $K
$EpAbs = (Resolve-Path $Ep).Path; $py = "$K\.venv\Scripts\python.exe"
$ff = & $py -c "import imageio_ffmpeg as i;print(i.get_ffmpeg_exe())"
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
node tools\render.mjs ep=$EpAbs out=$frames workers=$Workers sub=$sub q=93 resume=1 tag=$Stage; if ($LASTEXITCODE) { throw 'render failed' }
& $py tools\mix.py $EpAbs
$out = "$EpAbs\$((Split-Path $EpAbs -Leaf))_$Stage.mp4"
$vf = if ($sub -gt 1) { "tmix=frames=${sub},select='eq(mod(n\,${sub})\,$($sub-1))',setpts=N/(60*TB),scale=in_range=full:out_range=tv,format=yuv420p" } else { "scale=in_range=full:out_range=tv,format=yuv420p" }
& $ff -y -v error -stats -framerate (60*$sub) -i "$frames\f%06d.jpg" -i "$EpAbs\mix.wav" -vf $vf -r 60 -c:v hevc_nvenc -preset p7 -tune hq -rc vbr -cq $(if ($sub -gt 1) {17} else {22}) -b:v 0 -maxrate 40M -bufsize 80M -spatial-aq 1 -temporal-aq 1 -bf 3 -g 120 -tag:v hvc1 -color_range tv -color_primaries bt709 -color_trc bt709 -colorspace bt709 -af "loudnorm=I=-14:TP=-1:LRA=11" -c:a aac -b:a 256k -ar 48000 -movflags +faststart -shortest $out
"video: $out"
