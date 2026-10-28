# Thumbnails (YouTube, 1280x720) and covers (Shorts/TikTok/Reels, 1080x1920) rendered by the same engine as the video,
# so they match its look. Three variants per episode to pick from (or A/B test): thumb-A/B/C.jpg + thumbs.jpg (side by side).
#   python tools/thumb.py episodes/<name>
# Spec in the script (all optional — without it the title and the script's biggest number are used):
#   "meta": { "thumb": { "text": "Grok Bot is your *manager*",   2-5 words; *word* gets the highlighter
#                         "kicker": "STOP USING IT WRONG",          small pill above the text
#                         "image": "media/face.png",                right-hand visual (photo, product, screenshot) …
#                         "number": "200+",                         … or a giant number …
#                         "el": { "el": "pr", ... },                … or any element spec
#                         "looks": ["blueprint", "brutal", "neon"] } }   one look per variant (default: the episode's + 2 contrasting)
# Vertical episodes get cover-A/B/C.jpg (1080x1920) instead: the hook text big in the upper half, clear of the platform UI.
import sys as _s; _s.stdout.reconfigure(encoding="utf-8", errors="replace")
import os, sys, json, re, glob, shutil, subprocess
from PIL import Image
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from kitcfg import KIT
EP = os.path.abspath(sys.argv[1]); S = json.load(open(os.path.join(EP, 'script.json'), encoding='utf8')); M = S.get('meta', {})
T = M.get('thumb', {}); fmt = M.get('format', 'landscape'); tall = fmt in ('vertical', 'short')
CONTRAST = {'clean': ['brutal', 'neon'], 'editorial': ['brutal', 'blueprint'], 'blueprint': ['brutal', 'neon'], 'neon': ['brutal', 'clean'], 'brutal': ['neon', 'blueprint'], 'glass': ['brutal', 'neon'], 'terminal': ['brutal', 'neon']}
look0 = M.get('look', 'clean'); looks = (T.get('looks') or [look0] + CONTRAST.get(look0, ['brutal', 'neon']))[:3]
def short_title(t):
    t = re.split(r'[:(.!?]', t)[0].strip(); w = t.split()
    return ' '.join(w[:6])
text = T.get('text') or short_title(M.get('title', 'New video'))
if '*' not in text:  # highlight the last word by default — thumbnails need one hot spot
    w = text.split(); w[-1] = f'*{w[-1]}*'; text = ' '.join(w)
def biggest_number():
    best = None
    def walk(l):
        nonlocal best
        for e in l:
            if e.get('el') in ('number', 'stat', 'kpi') and e.get('value') is not None:
                v = float(e['value']); lab = (e.get('prefix') or '') + (f'{int(v):,}' if v == int(v) else str(v)) + (e.get('suffix') or '')
                if not best or v > best[0]: best = (v, lab)
            walk(e.get('kids', []))
    for s in S['scenes']: walk((s.get('data') or {}).get('els', []))
    return best[1] if best else None
num = T.get('number') or (None if (T.get('image') or T.get('el')) else biggest_number())
W, H = (1080, 1920) if tall else (1920, 1080)
def num_els(box, size):
    v = float(re.sub(r'[^\d.]', '', num) or 0); x, y, w, h = box; d = min(w, h)
    return [{'el': 'shape', 'kind': 'circle', 'fill': 'accent', 'box': [x + (w - d) / 2, y + (h - d) / 2, d, d], 'in': 'none'},
            {'el': 'number', 'value': v, 'suffix': re.sub(r'^[\d,.$]+', '', num), 'prefix': '$' if num.startswith('$') else '', 'count': False, 'size': size, 'align': 'center', 'color': 'var(--on-accent)', 'box': [x + (w - d) / 2 + d * .08, y + (h - d) / 2 + d * .2, d * .84, d * .6], 'in': 'none'}]
def scene(i, variant):
    els = []; vis = bool(num or T.get('image') or T.get('el'))
    if tall:
        if T.get('kicker'): els.append({'el': 'tag', 'text': T['kicker'], 'color': 'bad', 'filled': True, 'size': 34, 'box': [72, 300, 760, 84], 'in': 'none'})
        els.append({'el': 'text', 'style': 'huge', 'size': 150, 'text': text, 'lines': 4, 'box': [72, 400, 900, 680], 'in': 'none', 'do': ['hl@0']})
        if num: els += num_els([250, 1050, 580, 400], 170)
        elif T.get('image'): els.append({'el': 'image', 'src': T['image'], 'box': [72, 1100, 900, 340], 'in': 'none'})
    else:
        tw = 1060 if vis else 1720
        if T.get('kicker'): els.append({'el': 'tag', 'text': T['kicker'], 'color': 'bad', 'filled': True, 'size': 34, 'box': [90, 96, 900, 84], 'in': 'none'})
        els.append({'el': 'text', 'style': 'huge', 'text': text, 'lines': 3, 'size': 186 if vis else 210, 'box': [90, 190 if T.get('kicker') else 140, tw, 800], 'in': 'none', 'do': ['hl@0']})
        if T.get('el'): els.append({**T['el'], 'box': [1210, 170, 650, 740], 'in': 'none'})
        elif T.get('image'): els.append({'el': 'image', 'src': T['image'], 'box': [1210, 140, 650, 800], 'in': 'none', 'css': 'transform:rotate(2deg)'})
        elif num: els += num_els([1180, 150, 700, 780], 240)
    if os.path.exists(os.path.join(KIT, 'assets', 'brand', 'logo.png')): els.append({'el': 'image', 'src': 'assets/brand/logo.png', 'fit': 'contain', 'radius': 999, 'box': [W - 190, H - 190, 120, 120] if not tall else [W - 210, 230, 120, 120], 'in': 'none'})
    if tall:
        for e in els: e['ui'] = 1  # a cover is laid out at its final size (no phone-first scale-up)
    theme = M.get('thumb_theme') or ['ink', 'paper', 'night'][variant % 3]
    return {'id': f't{i}', 'type': 'compose', 'theme': theme, 'start': i * 2, 'dur': 2, 'lines': [], 'chapter': 'thumb', 'push': False, 'trans': 'cut', 'nosub': True, 'data': {'els': els, 'open': 'late'}}
out = []
for i, lk in enumerate(looks):
    d = os.path.join(EP, f'_thumb{i}'); shutil.rmtree(d, ignore_errors=True); os.makedirs(d)
    for sub in ('media',):
        if os.path.isdir(os.path.join(EP, sub)): shutil.copytree(os.path.join(EP, sub), os.path.join(d, sub))
    json.dump({'fps': 60, 'w': W, 'h': H, 'total': 2, 'meta': {**M, 'look': lk, 'format': fmt}, 'scenes': [{**scene(0, i), 'start': 0}]}, open(os.path.join(d, 'timeline.json'), 'w', encoding='utf8'))
    r = subprocess.run(['node', os.path.join(KIT, 'tools', 'render.mjs'), f'ep={d}', 'frames=90', 'out=f', 'workers=1', 'q=95'], cwd=KIT, capture_output=True, text=True)
    f = os.path.join(d, 'f', 'f00090.jpg')
    if not os.path.exists(f): print('render failed', lk, r.stdout[-500:], r.stderr[-500:]); continue
    im = Image.open(f).convert('RGB'); name = ('cover' if tall else 'thumb') + f'-{"ABC"[i]}.jpg'
    (im if tall else im.resize((1280, 720), Image.LANCZOS)).save(os.path.join(EP, name), quality=92); out.append((name, lk)); shutil.rmtree(d, ignore_errors=True)
if out:
    ims = [Image.open(os.path.join(EP, n)) for n, _ in out]; tw = 480 if not tall else 300; th = round(tw * ims[0].height / ims[0].width)
    sheet = Image.new('RGB', (len(ims) * (tw + 12) + 12, th + 24), 'white')
    for k, im in enumerate(ims): sheet.paste(im.resize((tw, th)), (12 + k * (tw + 12), 12))
    sheet.save(os.path.join(EP, 'thumbs.jpg'), quality=88)
for n, lk in out: print(f'{n}  ({lk})')
print('text:', text, '| visual:', T.get('image') or (T.get('el') or {}).get('el') or num or 'none')
