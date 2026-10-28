# Visual reference of the whole library, for agents and people:  python tools/gallery.py
# Writes episodes/_gallery (a narration-free timeline built here), renders it, and saves labelled sheets to docs/gallery/:
#   looks.jpg            one scene in every look
#   elements-N.jpg       every element with its catalog example
#   motions-<kind>.jpg   every motion as a 5-frame strip (how it moves, not just where it ends)
#   layouts.jpg          every layout's slots
#   formats.jpg          the same scenes in every format (landscape, vertical, square, portrait)   — only this one: python tools/gallery.py formats
#   icons-N.jpg          every icon with its name                                                  — only these: python tools/gallery.py icons
# Also refreshes docs/catalog.json + docs/CATALOG.md.
import json, os, subprocess, sys, shutil, math
from PIL import Image, ImageDraw, ImageFont
KIT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); EP = os.path.join(KIT, 'episodes', '_gallery'); OUT = os.path.join(KIT, 'docs', 'gallery')
os.makedirs(EP, exist_ok=True); os.makedirs(OUT, exist_ok=True)
def node(*args):
    r = subprocess.run(['node', os.path.join(KIT, 'tools', 'render.mjs'), f'ep={EP}', *args], cwd=KIT, capture_output=True, text=True, encoding='utf8', errors='replace')
    bad = [l for l in (r.stdout + r.stderr).splitlines() if l.startswith(('PAGEERR', 'ERR', 'WARN ')) or 'Error' in l]
    if bad: print('\n'.join(bad[:20]))
    return r
def write_tl(scenes, meta=None):
    t = 0
    for s in scenes: s.setdefault('lines', []); s['start'] = round(t, 3); s.setdefault('chapter', 'gallery'); s['push'] = False; s['trans'] = 'cut'; t += s['dur']
    json.dump({'fps': 60, 'w': 1920, 'h': 1080, 'total': round(t, 3), 'meta': meta or {'look': 'clean'}, 'scenes': scenes}, open(os.path.join(EP, 'timeline.json'), 'w', encoding='utf8'), ensure_ascii=False, indent=1)
    return scenes
def font(sz):
    for f in ['C:/Windows/Fonts/consolab.ttf', 'C:/Windows/Fonts/arialbd.ttf']:
        if os.path.exists(f): return ImageFont.truetype(f, sz)
    return ImageFont.load_default()
F, FS = font(26), font(20)
# ---- 0. catalog (needs any timeline)
write_tl([{'id': 'stub', 'type': 'compose', 'theme': 'paper', 'dur': 2, 'data': {'els': []}}])
node('catalog=1'); CAT = json.load(open(os.path.join(KIT, 'docs', 'catalog.json'), encoding='utf8'))
GRID_AREA = (88, 240, 1744, 632)
def grid_rects(cols, rows, gap=24, area=GRID_AREA):
    x0, y0, w, h = area; cw = (w - gap * (cols - 1)) / cols; ch = (h - gap * (rows - 1)) / rows
    return [(x0 + (i % cols) * (cw + gap), y0 + (i // cols) * (ch + gap), cw, ch) for i in range(cols * rows)]
scenes = []
# ---- 1. looks: one composed scene
look_scene = {'id': 'look', 'type': 'compose', 'theme': 'lavender', 'label': 'The look', 'title': 'Same scene, every look', 'dur': 4, 'data': {'layout': {'type': 'bento', 'ratio': .56}, 'els': [
    {'el': 'card', 'slot': 'main', 'icon': 'shield', 'kicker': 'Rule one', 'title': 'Every task ships with *proof*', 'body': 'Screenshots before and after, tests green, or it goes back to the agent.', 'tone': 'accent', 'in': 'none'},
    {'el': 'stat', 'slot': 'side0', 'label': 'Agents at once', 'value': 200, 'suffix': '+', 'tone': 'good', 'in': 'none'},
    {'el': 'pr', 'slot': 'side1', 'num': '#4821', 'title': 'Small-screen onboarding', 'state': 'READY', 'checks': [{'text': 'CI'}, {'text': 'Proof'}], 'in': 'none'}]}}
# ---- 2. elements
els = [k for k in CAT['elements'] if k not in ('html', 'clip')] + ['html']  # clip needs ingested footage
PER = 9; el_scenes = []
for pi in range(math.ceil(len(els) / PER)):
    chunk = els[pi * PER:(pi + 1) * PER]; R = grid_rects(3, 3, 30, (88, 70, 1744, 880)); E = []
    for name, (x, y, w, h) in zip(chunk, R):
        ex = dict(CAT['elements'][name]['example']); box = [round(x + 14), round(y + 8), round(w - 28), round(h - 64)]
        if name == 'arrow': ex = {'from': [box[0] + 30, box[1] + box[3] - 30], 'to': [box[0] + box[2] - 30, box[1] + 30], 'bend': .3}
        if name == 'cursor': ex = {'path': [[0.1, box[0] + 40, box[1] + 40], [0.8, box[0] + box[2] // 2, box[1] + box[3] // 2]], 'clicks': [1.0]}
        E.append({'el': name, 'box': box, 'in': 'none', **ex})
        E.append({'el': 'text', 'style': 'mono', 'text': name, 'box': [round(x + 14), round(y + h - 48), round(w - 28), 40], 'in': 'none', 'color': 'sub', 'size': 26})
        E.append({'el': 'shape', 'kind': 'rect', 'fill': 'transparent', 'box': [round(x), round(y), round(w), round(h)], 'in': 'none', 'css': 'box-shadow:inset 0 0 0 2px var(--line);border-radius:18px', 'z': -1})
    el_scenes.append({'id': f'el{pi + 1}', 'type': 'compose', 'theme': 'paper', 'dur': 4, 'data': {'els': E}})
# ---- 3. motions (2 rows x 4 tiles per scene; triggered at T0)
T0 = 1.0; STRIP = [0.0, .12, .3, .6, 1.4]
KIND_ORDER = ['in', 'text', 'emph', 'loop', 'move', 'out']
mot = {k: [n for n, m in CAT['motions'].items() if m['kind'] == k and n != 'none'] for k in KIND_ORDER}
mo_scenes = []; mo_index = []  # (scene id, cell index, motion name, kind)
for kind in KIND_ORDER:
    names = mot[kind]
    for pi in range(math.ceil(len(names) / 8)):
        chunk = names[pi * 8:(pi + 1) * 8]; R = grid_rects(4, 2, 30); E = []; sid = f'mo_{kind}{pi + 1}'
        for ci, (name, (x, y, w, h)) in enumerate(zip(chunk, R)):
            box = [round(x + 40), round(y + 40), round(w - 80), round(h - 80)]
            spec = f'{name}@{T0}'
            if kind in ('in',):
                e = {'el': 'card', 'icon': 'bolt', 'title': name, 'box': box, 'in': spec}
                if name == 'draw': e = {'el': 'html', 'box': box, 'in': spec, 'html': '<svg width="100%" height="100%" viewBox="0 0 100 60"><path d="M10 34 L40 52 L92 8" fill="none" stroke="#5a5cf0" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/></svg>'}
                if name == 'cascade': e = {'el': 'list', 'items': ['First', 'Second', 'Third'], 'box': box, 'in': spec, 'size': 30}
            elif kind == 'text':
                e = {'el': 'text', 'style': 'heading', 'text': '2,000+ PRs' if name == 'count' else 'Ship the *loop* now', 'box': box, 'in': spec, 'hug': False}
                if name == 'hl': e = {'el': 'text', 'style': 'heading', 'text': 'Ship the *loop*', 'box': box, 'in': 'none', 'do': [spec], 'hug': False}
                if name == 'cascade': e = {'el': 'list', 'items': ['First', 'Second', 'Third'], 'box': box, 'in': spec, 'size': 30}
                if name == 'draw': e = {'el': 'html', 'box': box, 'in': spec, 'html': '<svg width="100%" height="100%" viewBox="0 0 100 60"><path d="M10 34 L40 52 L92 8" fill="none" stroke="#5a5cf0" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/></svg>'}
            elif kind == 'out':
                e = {'el': 'card', 'icon': 'x', 'title': name, 'box': box, 'in': 'none', 'out': spec}
            elif kind == 'loop':
                e = {'el': 'card', 'icon': 'spark', 'title': name, 'box': box, 'in': 'none', 'loop': {'m': name, 'at': T0}}
            elif kind == 'move':
                p = {'m': name, 'at': T0}
                if name == 'move': p['by'] = [70, -40]
                if name == 'path': p['pts'] = [[60, -30], [120, 20]]; p['d'] = 1.2
                e = {'el': 'card', 'icon': 'branch', 'title': name, 'box': box, 'in': 'none', 'do': [p]}
            else:
                e = {'el': 'card', 'icon': 'eye', 'title': name, 'box': box, 'in': 'none', 'do': [spec]}
                if name == 'undim': e['do'] = [f'dim@{T0 - .8}', spec]
                if name == 'settle': e['do'] = [f'lift@{T0 - .8}', spec]
                if name in ('hl',): e = {'el': 'text', 'style': 'heading', 'text': 'Ship the *loop*', 'box': box, 'in': 'none', 'do': [spec], 'hug': False}
            E.append(e); mo_index.append((sid, ci, name, kind, (x, y, w, h)))
        mo_scenes.append({'id': sid, 'type': 'compose', 'theme': 'paper', 'label': f'motions · {kind}', 'title': f'{kind} motions', 'dur': 3.2, 'data': {'els': E}})
# ---- 4. layouts
la_scenes = []
for name in CAT['layouts']:
    la_scenes.append({'id': f'la_{name}', 'type': 'compose', 'theme': 'ice', 'label': 'layout', 'title': name, 'dur': 2, 'data': {'layout': {'type': name}, 'showSlots': True, 'els': []}})
all_scenes = write_tl([look_scene] + el_scenes + mo_scenes + la_scenes)
S = {s['id']: s for s in all_scenes}
def frames(pairs, out, look=None):
    shutil.rmtree(os.path.join(EP, out), ignore_errors=True)
    fr = sorted(set(round((S[sid]['start'] + t) * 60) for sid, t in pairs))
    node(f'frames={",".join(map(str, fr))}', f'out={out}', 'workers=12', *( [f'look={look}', f'tag={look}'] if look else []))
    return {(sid, t): os.path.join(EP, out, f'f{round((S[sid]["start"] + t) * 60):05d}.jpg') for sid, t in pairs}
def label(im, text, xy=(14, 10), size=F):
    d = ImageDraw.Draw(im); x, y = xy; bb = d.textbbox((x, y), text, font=size); d.rectangle((bb[0] - 8, bb[1] - 6, bb[2] + 8, bb[3] + 6), fill=(18, 19, 26)); d.text((x, y), text, font=size, fill=(255, 255, 255))
# formats: the same scenes rendered at every canvas — slot layouts reflow, the chapter card restacks
def formats_sheet():
    import copy
    SIZES = {'landscape': (1920, 1080), 'vertical': (1080, 1920), 'square': (1080, 1080), 'portrait': (1080, 1350)}
    base = [
        {'id': 'f_split', 'type': 'compose', 'theme': 'mint', 'label': 'The trap', 'title': 'Wrong way vs right way', 'dur': 3, 'data': {'layout': {'type': 'split', 'gap': 90}, 'els': [
            {'id': 'a', 'el': 'card', 'slot': 'left', 'tone': 'bad', 'icon': 'x', 'kicker': 'The trap', 'title': 'Ask it to write code', 'body': 'You get code. Nobody checks it.', 'in': 'none'},
            {'id': 'b', 'el': 'card', 'slot': 'right', 'tone': 'good', 'icon': 'check', 'kicker': 'The playbook', 'title': 'Ask it to run the loop', 'body': 'Brief, delegate, demand proof.', 'in': 'none'},
            {'el': 'arrow', 'from': 'a', 'to': 'b', 'bend': 0, 'in': 'none'}]}},
        {'id': 'f_row', 'type': 'compose', 'theme': 'lilac', 'dur': 3, 'data': {'layout': {'type': 'row', 'n': 3, 'h': 340, 'gap': 90}, 'els': [
            {'id': 'p1', 'el': 'card', 'slot': 0, 'icon': 'chat', 'title': 'Brief', 'in': 'none'}, {'id': 'p2', 'el': 'card', 'slot': 1, 'icon': 'term', 'title': 'Delegate', 'in': 'none'},
            {'id': 'p3', 'el': 'card', 'slot': 2, 'icon': 'check', 'title': 'Verify', 'in': 'none'},
            {'el': 'arrow', 'from': 'p1', 'to': 'p2', 'bend': 0, 'in': 'none'}, {'el': 'arrow', 'from': 'p2', 'to': 'p3', 'bend': 0, 'in': 'none'}]}},
        {'id': 'f_num', 'type': 'compose', 'theme': 'sky', 'dur': 3, 'data': {'layout': {'type': 'hero-r', 'ratio': .5}, 'els': [
            {'el': 'tiles', 'slot': 'visual', 'count': 120, 'steps': [{'n': 120}], 'in': 'none'},
            {'el': 'number', 'slot': 'text', 'value': 200, 'suffix': '+', 'label': 'agents at once', 'in': 'none'}]}},
        {'id': 'f_chap', 'type': 'chapter', 'theme': 'ink', 'dur': 3, 'data': {'title': 'The handoff', 'sub': 'What a good brief contains', 'short': 'Handoff'}},
    ]
    root = os.path.join(EP, 'g_fmt'); shutil.rmtree(root, ignore_errors=True); shots = {}
    for fmt, (w, h) in SIZES.items():
        d = os.path.join(root, fmt); os.makedirs(d, exist_ok=True); sc = copy.deepcopy(base); t = 0
        for x in sc: x['lines'] = []; x['start'] = t; x['chapter'] = 'formats'; x['push'] = False; x['trans'] = 'cut'; t += x['dur']
        json.dump({'fps': 60, 'w': w, 'h': h, 'total': t, 'meta': {'look': 'clean', 'format': fmt}, 'scenes': sc}, open(os.path.join(d, 'timeline.json'), 'w', encoding='utf8'), ensure_ascii=False)
        fr = [round((x['start'] + 2.6) * 60) for x in sc]
        subprocess.run(['node', os.path.join(KIT, 'tools', 'render.mjs'), f'ep={d}', f'frames={",".join(map(str, fr))}', 'out=f', 'workers=4'], cwd=KIT, capture_output=True)
        for x, f in zip(sc, fr): shots[(fmt, x['id'])] = os.path.join(d, 'f', f'f{f:05d}.jpg')
    TH = 520; ws = {f: round(TH * w / h) for f, (w, h) in SIZES.items()}; W_ = sum(ws.values()) + 10 * len(ws) + 10
    sheet = Image.new('RGB', (W_, len(base) * (TH + 10) + 54), 'white'); d = ImageDraw.Draw(sheet); x = 10
    for f in SIZES: d.text((x + 4, 14), f'{f}  {SIZES[f][0]}x{SIZES[f][1]}', font=F, fill=(20, 20, 28)); x += ws[f] + 10
    for r, b in enumerate(base):
        x = 10
        for f in SIZES:
            p_ = shots[(f, b['id'])]
            if os.path.exists(p_): sheet.paste(Image.open(p_).resize((ws[f], TH)), (x, 54 + r * (TH + 10)))
            x += ws[f] + 10
    sheet.save(os.path.join(OUT, 'formats.jpg'), quality=84); shutil.rmtree(root, ignore_errors=True)
def icons_sheet():
    names = CAT['icons']; per = 60; root = os.path.join(EP, 'g_icons'); shutil.rmtree(root, ignore_errors=True); os.makedirs(root)
    sc = []
    for p in range(0, len(names), per):
        els = []
        for i, n in enumerate(names[p:p + per]):
            cx, cy = 90 + (i % 10) * 175, 70 + (i // 10) * 165
            els.append({'el': 'icon', 'name': n, 'box': [cx + 45, cy, 64, 64], 'in': 'none'})
            els.append({'el': 'text', 'style': 'caption', 'text': n, 'box': [cx, cy + 78, 154, 34], 'align': 'center', 'in': 'none'})
        sc.append({'id': f'ic{p // per + 1}', 'type': 'compose', 'theme': 'paper', 'dur': 2, 'data': {'els': els}})
    t = 0
    for x in sc: x['lines'] = []; x['start'] = t; x['chapter'] = 'icons'; x['push'] = False; x['trans'] = 'cut'; t += x['dur']
    json.dump({'fps': 60, 'w': 1920, 'h': 1080, 'total': t, 'meta': {'look': 'clean'}, 'scenes': sc}, open(os.path.join(root, 'timeline.json'), 'w', encoding='utf8'))
    fr = [round((x['start'] + 1.5) * 60) for x in sc]
    subprocess.run(['node', os.path.join(KIT, 'tools', 'render.mjs'), f'ep={root}', f'frames={",".join(map(str, fr))}', 'out=f', 'workers=2'], cwd=KIT, capture_output=True)
    for i, f in enumerate(fr): Image.open(os.path.join(root, 'f', f'f{f:05d}.jpg')).save(os.path.join(OUT, f'icons-{i + 1}.jpg'), quality=85)
    shutil.rmtree(root, ignore_errors=True)
if sys.argv[1:] == ['formats']: formats_sheet(); print('gallery: formats.jpg'); sys.exit(0)
if sys.argv[1:] == ['icons']: icons_sheet(); print('gallery: icons'); sys.exit(0)
# looks
looks = list(CAT['looks']); tiles = []
for lk in looks:
    f = frames([('look', 3.0)], f'g_look_{lk}', lk)[('look', 3.0)]; im = Image.open(f).resize((800, 450)); label(im, lk); tiles.append(im)
cols = 3; sheet = Image.new('RGB', (cols * 810, math.ceil(len(tiles) / cols) * 460), 'white')
for i, im in enumerate(tiles): sheet.paste(im, ((i % cols) * 810, (i // cols) * 460))
sheet.save(os.path.join(OUT, 'looks.jpg'), quality=84)
# elements
fx = frames([(s['id'], 3.6) for s in el_scenes], 'g_el')
for i, s in enumerate(el_scenes): Image.open(fx[(s['id'], 3.6)]).resize((1600, 900)).save(os.path.join(OUT, f'elements-{i + 1}.jpg'), quality=84)
# motions: crop each tile at 5 moments
fx = frames([(s['id'], T0 + dt) for s in mo_scenes for dt in STRIP], 'g_mo')
for kind in KIND_ORDER:
    rows = [m for m in mo_index if m[3] == kind]
    if not rows: continue
    CW, CH = 300, 180; sheet = Image.new('RGB', (230 + len(STRIP) * (CW + 8), len(rows) * (CH + 8) + 40), (245, 245, 247)); d = ImageDraw.Draw(sheet)
    for j, dt in enumerate(STRIP): d.text((230 + j * (CW + 8) + 6, 8), f'+{dt:.2f}s', font=FS, fill=(90, 90, 100))
    for i, (sid, ci, name, k, (x, y, w, h)) in enumerate(rows):
        yy = 40 + i * (CH + 8); d.text((12, yy + CH // 2 - 14), name, font=F, fill=(20, 20, 28))
        for j, dt in enumerate(STRIP):
            im = Image.open(fx[(sid, T0 + dt)]).crop((int(x), int(y), int(x + w), int(y + h))).resize((CW, CH)); sheet.paste(im, (230 + j * (CW + 8), yy))
    sheet.save(os.path.join(OUT, f'motions-{kind}.jpg'), quality=84)
# layouts
fx = frames([(s['id'], 1.5) for s in la_scenes], 'g_la'); tiles = []
for s in la_scenes:
    im = Image.open(fx[(s['id'], 1.5)]).resize((640, 360)); tiles.append(im)
cols = 4; sheet = Image.new('RGB', (cols * 650, math.ceil(len(tiles) / cols) * 370), 'white')
for i, im in enumerate(tiles): sheet.paste(im, ((i % cols) * 650, (i // cols) * 370))
sheet.save(os.path.join(OUT, 'layouts.jpg'), quality=84)
formats_sheet(); icons_sheet()
for d_ in os.listdir(EP):
    if d_.startswith('g_'): shutil.rmtree(os.path.join(EP, d_), ignore_errors=True)
print('gallery:', ', '.join(sorted(os.listdir(OUT))))
