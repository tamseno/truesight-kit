# One command from script.json to a finished, checked video — the kit's pipeline (cross-platform; replaces make.ps1).
#   python tools/make.py episodes/<name> draft      voice timing (final if made, else edge) -> timeline -> lint -> stills + QA -> sheet.jpg -> variety
#   python tools/make.py episodes/<name> preview    edge voice -> full render (no motion blur) -> mix -> <name>_preview.mp4 -> review
#   python tools/make.py episodes/<name> voice      final voice: IndexTTS per line (cached) -> whisper word timings -> timeline
#   python tools/make.py episodes/<name> final      lint gate -> render with motion blur -> mix -> <name>_final.mp4 -> chapters,
#                                                   review, thumbnail and publish sheet
#   python tools/make.py episodes/<name> all        voice + final
# Options: --fresh (drop frames from an earlier render of this stage) · --quiet (fewer workers: for nights, less fan noise)
#          --codec auto|hevc|h264 (auto: HEVC for landscape, H.264 for vertical/square/portrait) · --force (render despite lint)
# Machine paths come from kit.config.json (tools/kitcfg.py). Exit code != 0 on any failure, so batch.py can move on.
import sys as _s; _s.stdout.reconfigure(encoding="utf-8", errors="replace")
import json, os, sys, subprocess, shutil, time, argparse
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from kitcfg import cfg, KIT
import imageio_ffmpeg
FF = imageio_ffmpeg.get_ffmpeg_exe(); PY = sys.executable
TAGS = 'colour_primaries=1:transfer_characteristics=1:matrix_coefficients=1:video_full_range_flag=0'  # BT.709 limited, written into the stream

class Fail(Exception): pass
def run(cmd, label, env=None, quiet_out=False):
    t = time.time(); print(f'> {label}', flush=True)
    r = subprocess.run([str(c) for c in cmd], cwd=KIT, env={**os.environ, **(env or {})}, text=True, encoding='utf8', errors='replace',
                       stdout=subprocess.PIPE if quiet_out else None, stderr=subprocess.STDOUT if quiet_out else None)
    if r.returncode: raise Fail(f'{label} failed (exit {r.returncode})' + (('\n' + r.stdout[-2000:]) if quiet_out and r.stdout else ''))
    print(f'  {label} ok ({time.time() - t:.0f} s)', flush=True); return r.stdout if quiet_out else ''
def node(ep, *args, quiet_out=True): return run(['node', 'tools/render.mjs', f'ep={ep}', *args], 'render ' + ' '.join(a.split('=')[0] + '=' + a.split('=')[1][:20] for a in args), quiet_out=quiet_out)
def has_voice(ep): d = os.path.join(ep, 'tts'); return os.path.isdir(d) and any(f.endswith('.json') and not f.endswith('.edge.json') for f in os.listdir(d))
def timeline(ep, voice):
    if voice == 'auto': voice = 'index' if has_voice(ep) else 'edge'  # drafts use the final voice's timing once it exists
    run([PY, 'tools/timeline.py', ep, voice], f'timeline ({voice})', quiet_out=True)
def lint(ep, force):
    r = subprocess.run(['node', 'tools/render.mjs', f'ep={ep}', 'lint=1'], cwd=KIT, capture_output=True, text=True, encoding='utf8', errors='replace')
    if r.returncode not in (0, 1): raise Fail('lint crashed:\n' + (r.stdout + r.stderr)[-1500:])
    print('> lint'); out = r.stdout; warns = [l.strip() for l in out.splitlines() if l.startswith('  ')]
    n = next((l for l in out.splitlines() if l.startswith('WARN')), 'WARN ?'); print('  ' + n); [print('   ', w) for w in warns[:20]]
    if not n.endswith(' 0') and not force: raise Fail('lint warnings — fix them, or pass --force')
_NV = None
def nvenc_ok():
    """NVIDIA hardware encoding if this machine has it (one tiny test encode), else the software encoders — same tags, same loudness"""
    global _NV
    if _NV is None:
        r = subprocess.run([FF, '-v', 'error', '-f', 'lavfi', '-i', 'color=c=black:s=256x256:d=0.1', '-c:v', 'h264_nvenc', '-f', 'null', '-'], capture_output=True)
        _NV = r.returncode == 0
    return _NV
def encode(ep, name, sub, codec, tl):
    frames = os.path.join(ep, f'frames_{name}'); out = os.path.join(ep, f'{os.path.basename(ep)}_{name}.mp4')
    if codec == 'auto': codec = 'hevc' if tl['w'] > tl['h'] else 'h264'
    hw = nvenc_ok(); q = 17 if sub > 1 else 22
    if hw:
        venc = (['-c:v', 'hevc_nvenc', '-tag:v', 'hvc1', '-bsf:v', f'hevc_metadata={TAGS}'] if codec == 'hevc' else ['-c:v', 'h264_nvenc', '-profile:v', 'high', '-bsf:v', f'h264_metadata={TAGS}']) + [
            '-preset', 'p7' if sub > 1 else 'p5', '-tune', 'hq', '-rc', 'vbr', '-cq', q, '-b:v', 0, '-maxrate', '40M', '-bufsize', '80M', '-spatial-aq', 1, '-temporal-aq', 1]
    else:  # software: x265 / x264 at a visually matching quality
        venc = (['-c:v', 'libx265', '-tag:v', 'hvc1', '-crf', q + 1, '-x265-params', 'log-level=error:colorprim=bt709:transfer=bt709:colormatrix=bt709'] if codec == 'hevc' else ['-c:v', 'libx264', '-profile:v', 'high', '-crf', q - 1]) + ['-preset', 'slow' if sub > 1 else 'medium']
    vf = (f"tmix=frames={sub},select='eq(mod(n\\,{sub})\\,{sub - 1})',setpts=N/(60*TB)," if sub > 1 else '') + 'scale=in_range=full:out_range=tv,format=yuv420p'
    run([FF, '-y', '-v', 'error', '-stats', '-framerate', 60 * sub, '-i', os.path.join(frames, 'f%06d.jpg'), '-i', os.path.join(ep, 'mix.wav'), '-vf', vf, '-r', 60, *venc,
         '-bf', 3, '-g', 120, '-color_range', 'tv', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-colorspace', 'bt709',
         '-af', 'loudnorm=I=-14:TP=-1:LRA=11', '-c:a', 'aac', '-b:a', '256k', '-ar', 48000, '-movflags', '+faststart', '-shortest', out], f'encode {codec} ({"NVENC" if hw else "software"}) {tl["w"]}x{tl["h"]} 60 fps')
    return out
def render_video(ep, name, sub, a, tl):
    frames = os.path.join(ep, f'frames_{name}')
    if a.fresh and os.path.isdir(frames): shutil.rmtree(frames)
    workers = 6 if a.quiet else int(cfg('workers'))
    node(ep, f'out={frames}', f'workers={workers}', f'sub={sub}', 'q=93', 'resume=1', f'tag={name}')
    run([PY, 'tools/mix.py', ep], 'mix', quiet_out=True)
    return encode(ep, name, sub, a.codec, tl)
def stage_draft(ep, a):
    timeline(ep, 'auto'); lint(ep, True)
    st = os.path.join(ep, 'stills'); shutil.rmtree(st, ignore_errors=True)
    out = node(ep, 'scenes=all', 'at=.5,.95', 'out=stills', f'workers={6 if a.quiet else 12}', 'qa=1'); [print('  ' + l) for l in out.splitlines() if l.startswith(('QA', '  '))][:30]
    run([PY, 'tools/sheet.py', st, os.path.join(ep, 'sheet.jpg')], 'sheet'); run([PY, 'tools/variety.py', ep], 'variety')
def stage_voice(ep, a):
    run([cfg('tts_python'), 'tools/voice_index.py', ep], 'voice (IndexTTS)')
    run([cfg('align_python'), 'tools/align.py', ep], 'align (whisper)'); timeline(ep, 'index')
def stage_preview(ep, a):
    timeline(ep, 'auto'); lint(ep, True); tl = json.load(open(os.path.join(ep, 'timeline.json'), encoding='utf8'))
    out = render_video(ep, 'preview', 1, a, tl); run([PY, 'tools/review.py', ep, out], 'review'); return out
def video_hash(ep):
    """what the picture and sound depend on: the script minus publishing copy and bookkeeping (editing the description must not force a re-render)"""
    import hashlib; S = json.load(open(os.path.join(ep, 'script.json'), encoding='utf8')); M = dict(S.get('meta', {}))
    for k in ('publish', 'thumb', 'thumb_theme', 'status', 'todo', 'source'): M.pop(k, None)
    return hashlib.md5(json.dumps({**S, 'meta': M}, sort_keys=True, ensure_ascii=False).encode()).hexdigest()[:12]
def stage_final(ep, a):
    voice = 'index'
    if not has_voice(ep):
        if cfg()['tts_python']: raise Fail('no final voice yet — run the voice stage first (or "all")')
        voice = 'edge'; print('  no IndexTTS configured (kit.config.json "tts_python") — the final uses the edge-tts voice')
    timeline(ep, voice); lint(ep, a.force); tl = json.load(open(os.path.join(ep, 'timeline.json'), encoding='utf8'))
    out = render_video(ep, 'final', 4, a, tl)
    json.dump({'mp4': os.path.basename(out), 'video_hash': video_hash(ep), 'at': time.strftime('%Y-%m-%dT%H:%M:%S')}, open(os.path.join(ep, 'final.json'), 'w', encoding='utf8'), indent=1)
    if tl['w'] > tl['h']: run([PY, 'tools/chapters.py', ep], 'chapters')
    run([PY, 'tools/review.py', ep, out], 'review')
    for tool, label in (('tools/thumb.py', 'thumbnail'), ('tools/publish.py', 'publish sheet')):
        if os.path.exists(os.path.join(KIT, tool)): run([PY, tool, ep], label)
    return out
def stage_all_voice(ep, a):
    if cfg()['tts_python']: stage_voice(ep, a)
    else: print('  voice stage skipped: no IndexTTS configured — the final uses the edge-tts voice')
STAGES = {'draft': [stage_draft], 'preview': [stage_preview], 'voice': [stage_voice], 'final': [stage_final], 'all': [stage_all_voice, stage_final]}
def main(argv=None):
    p = argparse.ArgumentParser(description='script.json -> checked MP4'); p.add_argument('ep'); p.add_argument('stage', choices=list(STAGES))
    p.add_argument('--fresh', action='store_true'); p.add_argument('--quiet', action='store_true'); p.add_argument('--force', action='store_true')
    p.add_argument('--codec', default='auto', choices=['auto', 'hevc', 'h264']); a = p.parse_args(argv)
    ep = os.path.abspath(a.ep); t0 = time.time()
    if not os.path.exists(os.path.join(ep, 'script.json')): print('no script.json in', ep); return 2
    try:
        out = None
        for st in STAGES[a.stage]: out = st(ep, a) or out
        print(f'DONE {a.stage} {os.path.basename(ep)} in {(time.time() - t0) / 60:.1f} min' + (f' -> {out}' if out else '')); return 0
    except Fail as e: print('FAILED', e); return 1
if __name__ == '__main__': sys.exit(main())
