# Review a finished video the way a critical viewer would — from the MP4 itself, not the renderer.
#   python tools/review.py episodes/<name> [mp4]        (default: the newest *_final.mp4, else *_preview.mp4)
# Writes episodes/<name>/review/:
#   cuts-N.jpg     every scene change as a strip (-0.30 … +0.60 s): double exposure, flashes, late or empty entrances
#   scenes-N.jpg   every scene at 3 %, 35 %, 70 %, 97 %: dead air, crowding, things that never arrive or never leave
#   report.txt     numbers a person can't see in a sheet: near-identical frames held too long (dead air),
#                  black/blank frames, audio loudness, true peak, and silence gaps longer than 1.2 s
import json, os, sys, glob, subprocess, re
from PIL import Image, ImageDraw, ImageFont, ImageChops, ImageStat
KIT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
EP = os.path.abspath(sys.argv[1]); TL = json.load(open(os.path.join(EP, 'timeline.json'), encoding='utf8'))
mp4 = sys.argv[2] if len(sys.argv) > 2 else (sorted(glob.glob(os.path.join(EP, '*_final.mp4'))) or sorted(glob.glob(os.path.join(EP, '*_preview.mp4'))) or [None])[-1]
if not mp4: sys.exit('no mp4 in ' + EP)
FF = subprocess.run([os.path.join(KIT, '.venv', 'Scripts', 'python.exe'), '-c', 'import imageio_ffmpeg as i;print(i.get_ffmpeg_exe())'], capture_output=True, text=True).stdout.strip() or 'ffmpeg'
OUT = os.path.join(EP, 'review'); os.makedirs(OUT, exist_ok=True)
for f in glob.glob(os.path.join(OUT, '*')): os.remove(f)
W, H = TL['w'], TL['h']; tall = H > W; TW = 216 if tall else 384; TH = round(TW * H / W)
def font(sz):
    for f in ['C:/Windows/Fonts/consolab.ttf', 'C:/Windows/Fonts/arialbd.ttf']:
        if os.path.exists(f): return ImageFont.truetype(f, sz)
    return ImageFont.load_default()
F = font(18)
def grab(times):
    # one ffmpeg pass per batch: select the exact frames (60 fps) and scale them down
    n = sorted(set(max(0, round(t * 60)) for t in times)); tmp = os.path.join(OUT, '_f'); os.makedirs(tmp, exist_ok=True)
    for f in glob.glob(os.path.join(tmp, '*')): os.remove(f)
    sel = '+'.join(f'eq(n\\,{k})' for k in n)
    subprocess.run([FF, '-v', 'error', '-i', mp4, '-vf', f"select='{sel}',scale={TW}:{TH}", '-vsync', '0', os.path.join(tmp, '%05d.jpg')], check=True)
    fs = sorted(glob.glob(os.path.join(tmp, '*.jpg'))); got = {k: Image.open(f).copy() for k, f in zip(n, fs)}
    for f in fs: os.remove(f)
    os.rmdir(tmp); return lambda t: got.get(max(0, round(t * 60)))
def sheet(rows, name, cols_label):
    per = 6 if tall else 10; files = []
    for b in range(0, len(rows), per):
        chunk = rows[b:b + per]; nc = max(len(r[1]) for r in chunk); lw = 150
        S = Image.new('RGB', (lw + nc * (TW + 6), 34 + len(chunk) * (TH + 8)), (245, 245, 247)); d = ImageDraw.Draw(S)
        for j, lab in enumerate(cols_label[:nc]): d.text((lw + j * (TW + 6) + 4, 8), lab, font=F, fill=(80, 80, 90))
        for i, (lab, ims) in enumerate(chunk):
            y = 34 + i * (TH + 8); d.text((8, y + TH // 2 - 20), lab, font=F, fill=(20, 20, 28))
            for j, im in enumerate(ims):
                if im: S.paste(im, (lw + j * (TW + 6), y))
        p = os.path.join(OUT, f'{name}-{b // per + 1}.jpg'); S.save(p, quality=85); files.append(p)
    return files
sc = TL['scenes']; ends = [s['start'] for s in sc[1:]] + [TL['total']]
CUT = [-.30, -.12, -.03, 0, .03, .07, .12, .2, .3, .45, .6]
cut_t = [s['start'] + o for s in sc[1:] for o in CUT]
SC = [.03, .35, .70, .97]
sc_t = [s['start'] + p * (e - s['start']) for s, e in zip(sc, ends) for p in SC]
g = grab(cut_t + sc_t)
files = sheet([(f"{s['id']} {s.get('trans', 'look')}\n{s['type']}", [g(s['start'] + o) for o in CUT]) for s in sc[1:]], 'cuts', [f'{o:+.2f}s' for o in CUT])
files += sheet([(f"{s['id']} {s['type']}\n{e - s['start']:.1f}s", [g(s['start'] + p * (e - s['start'])) for p in SC]) for s, e in zip(sc, ends)], 'scenes', [f'{int(p * 100)}%' for p in SC])
# numbers: frame-difference scan at 4 fps for held frames, blank frames; audio loudness and gaps
rep = [f'video {os.path.basename(mp4)}  {W}x{H}  {TL["total"]:.1f} s  {len(sc)} scenes']
probe = subprocess.run([FF, '-hide_banner', '-i', mp4], capture_output=True, text=True, encoding='utf8', errors='replace').stderr
for ln in probe.splitlines():
    if 'Stream' in ln: rep.append('  ' + ln.strip())
tmp = os.path.join(OUT, '_s'); os.makedirs(tmp, exist_ok=True)
subprocess.run([FF, '-v', 'error', '-i', mp4, '-vf', 'fps=4,scale=160:-2', os.path.join(tmp, '%05d.png')], check=True)
fs = sorted(glob.glob(os.path.join(tmp, '*.png'))); prev = None; still = 0; holds = []; blanks = []
for i, f in enumerate(fs):
    im = Image.open(f).convert('L'); t = i / 4
    if ImageStat.Stat(im).stddev[0] < 3: blanks.append(t)
    if prev is not None:
        dmean = ImageStat.Stat(ImageChops.difference(im, prev)).mean[0]
        if dmean < .35: still += 1
        else:
            if still >= 16: holds.append((t - still / 4, t))
            still = 0
    prev = im
if still >= 16: holds.append((len(fs) / 4 - still / 4, len(fs) / 4))
for f in fs: os.remove(f)
os.rmdir(tmp)
sid = lambda t: next((s['id'] for s, e in zip(sc, ends) if s['start'] <= t < e), sc[-1]['id'])
rep.append(f'held frames >= 4 s (nothing moves): {len(holds)}'); rep += [f'  {a:6.1f}-{b:6.1f} s  ({sid(a)})' for a, b in holds]
rep.append(f'blank frames: {len(blanks)}' + (f'  first at {blanks[0]:.2f} s ({sid(blanks[0])})' if blanks else ''))
au = subprocess.run([FF, '-hide_banner', '-i', mp4, '-af', 'ebur128=peak=true,silencedetect=noise=-45dB:d=1.2', '-f', 'null', '-'], capture_output=True, text=True, encoding='utf8', errors='replace').stderr
m = re.findall(r'I:\s+(-?[\d.]+) LUFS', au); p = re.findall(r'Peak:\s+(-?[\d.]+) dBFS', au)
rep.append(f'audio: integrated {m[-1] if m else "?"} LUFS (target -14), true peak {p[-1] if p else "?"} dBFS (keep <= -1)')
gaps = re.findall(r'silence_start: ([\d.]+)[\s\S]*?silence_end: ([\d.]+)', au)
rep.append(f'silences > 1.2 s: {len(gaps)}'); rep += [f'  {float(a):6.1f}-{float(b):6.1f} s ({sid(float(a))})' for a, b in gaps]
open(os.path.join(OUT, 'report.txt'), 'w', encoding='utf8').write('\n'.join(rep) + '\n')
print('\n'.join(rep)); print('sheets:', ', '.join(os.path.basename(f) for f in files))
