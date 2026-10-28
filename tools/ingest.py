# Bring real footage into an episode: a screen recording / video becomes a frame folder the "clip" element plays in sync.
#   python tools/ingest.py recording.mp4 episodes/<name> demo [--start 3.5] [--end 18] [--fps 30] [--width 1600] [--crop x,y,w,h]
#   -> episodes/<name>/media/demo/f00000.jpg … + clip.json {fps, n, w, h, dur, source}
#   then: { "el": "clip", "src": "media/demo", "frame": "browser", "url": "app.example.com", "in": "rise@demo" }
# Still images need no ingest: copy them to episodes/<name>/media/ and use { "el": "image", "src": "media/x.png" }.
# Web pages: node tools/shot.mjs url=… out=episodes/<name>/media/page.png  (screenshots, incl. full-page for a scrolling "pan").
import os, sys, json, glob, argparse, subprocess, imageio_ffmpeg
FF = imageio_ffmpeg.get_ffmpeg_exe()
p = argparse.ArgumentParser(); p.add_argument('video'); p.add_argument('ep'); p.add_argument('name')
p.add_argument('--start', type=float, default=0); p.add_argument('--end', type=float); p.add_argument('--fps', type=int, default=30)
p.add_argument('--width', type=int, default=1600); p.add_argument('--crop', help='x,y,w,h in source pixels')
a = p.parse_args()
out = os.path.join(os.path.abspath(a.ep), 'media', a.name); os.makedirs(out, exist_ok=True)
for f in glob.glob(os.path.join(out, 'f*.jpg')): os.remove(f)
vf = ([f'crop={a.crop.split(",")[2]}:{a.crop.split(",")[3]}:{a.crop.split(",")[0]}:{a.crop.split(",")[1]}'] if a.crop else []) + [f'fps={a.fps}', f"scale='min({a.width},iw)':-2:flags=lanczos"]
cmd = [FF, '-v', 'error', '-ss', str(a.start)] + (['-to', str(a.end)] if a.end else []) + ['-i', a.video, '-vf', ','.join(vf), '-q:v', '3', '-start_number', '0', os.path.join(out, 'f%05d.jpg')]
subprocess.run(cmd, check=True)
fs = sorted(glob.glob(os.path.join(out, 'f*.jpg')))
if not fs: sys.exit('no frames written — check the input and --start/--end')
from PIL import Image
w, h = Image.open(fs[0]).size
meta = {'fps': a.fps, 'n': len(fs), 'w': w, 'h': h, 'dur': round(len(fs) / a.fps, 3), 'source': os.path.basename(a.video), 'start': a.start}
json.dump(meta, open(os.path.join(out, 'clip.json'), 'w'), indent=1)
mb = sum(os.path.getsize(f) for f in fs) / 1e6
print(f'{len(fs)} frames {w}x{h} @ {a.fps} fps ({meta["dur"]} s, {mb:.0f} MB) -> {os.path.relpath(out)}')
print(f'use: {{ "el": "clip", "src": "media/{a.name}", "frame": "browser" }}')
