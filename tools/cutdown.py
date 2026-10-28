# Long video -> Short: scaffold a vertical (or square/portrait) episode from the strongest scenes of a long one.
#   python tools/cutdown.py episodes/<long> episodes/<long>-short                 pick ~6 punchy scenes automatically
#   python tools/cutdown.py episodes/<long> episodes/<new> --scenes s02,s07,s25    choose them yourself
#   options: --n 6 · --format vertical|square|portrait · --look brutal · --keep-titles · --max-lines 2
# What it does: copies the chosen scenes (compose and the recipes that work in every format), drops long-form headers,
# turns hand-placed landscape boxes into a stacked layout (slots reflow; boxes don't), keeps each scene's first lines,
# adds a closing call-to-action scene, and writes meta for short-form (format, music, faster voice).
# What it doesn't do: write a hook. The output is a draft for an agent to finish — rewrite the narration to 30–45 s with a
# first line of ≤ 8 words, then: python tools/make.py <new> draft   (lint, QA and variety will point at what still needs work)
import sys as _s; _s.stdout.reconfigure(encoding="utf-8", errors="replace")
import os, sys, json, re, argparse, copy, shutil
KIT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ANY = {'compose', 'statement', 'chat'}  # recipes that adapt to every format (chapter/endcard are long-form furniture)
PUNCH = {'number': 3, 'stat': 3, 'kpi': 3, 'tiles': 3, 'stamp': 2, 'pr': 1, 'bars': 2, 'pie': 2, 'ranking': 2, 'phone': 1, 'browser': 1, 'clip': 3, 'image': 2, 'map': 2, 'quote': 2, 'person': 1, 'bubble': 1}
def words(s): return len(re.findall(r"[\w']+", ' '.join(s.get('lines', []))))
def els(sc):
    out = []
    def walk(l):
        for e in l: out.append(e); walk(e.get('kids', []))
    walk(sc.get('data', {}).get('els', [])); return out
def score(sc):
    if sc.get('type') == 'statement': return 5
    if sc.get('type') != 'compose': return 1
    s = sum(PUNCH.get(e.get('el'), 0) for e in els(sc)) + (2 if any(e.get('el') == 'text' and e.get('style') in ('display', 'huge') for e in els(sc)) else 0)
    return s - max(0, words(sc) - 45) / 15
norm = lambda z: re.sub(r'[^a-z0-9]', '', str(z).lower())
def retime(sc):
    """after trimming lines, any '@phrase' that is no longer spoken would fire at a fallback time: entrances go automatic,
    emphasis/beats/item cues that lost their words are dropped"""
    spoken = norm(' '.join(sc.get('lines', []))); lost = []
    def ok(spec):
        if isinstance(spec, dict): ph = spec.get('at')
        elif isinstance(spec, str) and '@' in spec: ph = re.sub(r'[+-][\d.]+$', '', spec.split('@', 1)[1])
        else: return True
        return not isinstance(ph, str) or re.fullmatch(r'[\d.]+', ph) or norm(ph) in spoken
    def fix(e):
        if 'in' in e and not ok(e['in']): lost.append(str(e['in'])); e['in'] = e['in'].split('@')[0] if isinstance(e['in'], str) else e['in'].get('m', 'rise')
        for k in ('do', 'loop'):
            if k in e: keep = [m for m in ([e[k]] if not isinstance(e[k], list) else e[k]) if ok(m)]; lost.extend(str(m) for m in ([e[k]] if not isinstance(e[k], list) else e[k]) if not ok(m)); e[k] = keep
        if 'out' in e and not ok(e['out']): e.pop('out')
        for it in e.get('items', []) + e.get('steps', []) + e.get('pins', []) + e.get('arcs', []):
            if isinstance(it, dict) and 'at' in it and not ok({'at': it['at']}): it.pop('at')
        if 'at' in e and not ok({'at': e['at']}): e.pop('at')
        for k in e.get('kids', []): fix(k)
    d = sc.get('data', {})
    for e in d.get('els', []): fix(e)
    if 'beats' in d: d['beats'] = [b for b in d['beats'] if ok({'at': b.get('at')})]
    return lost
def to_stack(sc):
    """hand-placed boxes -> a stacked 'rows' layout in reading order (arrows/cursors keep their ids; source drops)"""
    d = sc.get('data', {}); E = d.get('els', [])
    placed = [e for e in E if e.get('box') and e.get('el') not in ('arrow', 'cursor', 'source')]
    if not placed: return []
    if d.get('layout') and any(e.get('slot') is not None for e in E):  # slots reflow on their own; landscape boxes beside them can't
        d['els'] = [e for e in E if e not in placed]; return [e.get('el') for e in placed]
    placed.sort(key=lambda e: (round(e['box'][1] / 120), e['box'][0]))
    rest = [e for e in E if e not in placed and e.get('el') != 'source']
    for i, e in enumerate(placed): e.pop('box', None); e['slot'] = i
    d['els'] = placed + rest; d['layout'] = {'type': 'rows', 'n': len(placed), 'gap': 36}; return []
def main():
    p = argparse.ArgumentParser(); p.add_argument('src'); p.add_argument('dst'); p.add_argument('--scenes'); p.add_argument('--n', type=int, default=6)
    p.add_argument('--format', default='vertical'); p.add_argument('--look'); p.add_argument('--keep-titles', action='store_true'); p.add_argument('--max-lines', type=int, default=2)
    a = p.parse_args()
    S = json.load(open(os.path.join(a.src, 'script.json'), encoding='utf8')); sc = S['scenes']
    if os.path.exists(os.path.join(a.dst, 'script.json')): sys.exit(f'{a.dst} already has a script.json — pick a new folder')
    if a.scenes: pick = [s for s in sc if s['id'] in a.scenes.split(',')]
    else:
        cand = [s for s in sc if s.get('type', 'compose') in ANY and s.get('lines')]
        top = sorted(cand, key=score, reverse=True)[:a.n]; pick = [s for s in sc if s in top]
    skipped = [s['id'] for s in pick if s.get('type', 'compose') not in ANY]
    pick = [copy.deepcopy(s) for s in pick if s.get('type', 'compose') in ANY]
    if not pick: sys.exit('no usable scenes (compose / statement / chat)')
    trans = ['cut', 'whip', 'zoom', 'cut', 'whip']; notes = []
    for i, s in enumerate(pick):
        s['id'] = f'h{i + 1}'; s['lines'] = s['lines'][:a.max_lines]; s['chapter'] = 'short'
        for k in ('min_dur', 'step'): s.pop(k, None)
        if not a.keep_titles: s.pop('title', None); s.pop('label', None)
        if i: s['trans'] = trans[(i - 1) % len(trans)]
        else: s.pop('trans', None)
        if s.get('type', 'compose') == 'compose':
            dropped = to_stack(s); lost = retime(s)
            if dropped: notes.append(f'{s["id"]}: dropped hand-placed {", ".join(dropped)} (re-add them for the tall frame)')
            if lost: notes.append(f'{s["id"]}: {len(lost)} cue(s) lost their words with the trimmed lines -> automatic timing')
    pick.append({'id': f'h{len(pick) + 1}', 'type': 'compose', 'theme': pick[0].get('theme', 'paper'), 'chapter': 'short', 'trans': 'zoom',
                 'lines': ['Full breakdown on the channel.'],
                 'data': {'els': [{'el': 'text', 'style': 'title', 'lines': 3, 'text': re.split(r'[:(.!?]', S['meta'].get('title', 'The full story'))[0].strip(), 'align': 'center', 'box': [72, 420, 876, 300], 'in': 'words@0'},
                                  {'el': 'tag', 'icon': 'play', 'text': 'FULL VIDEO ON THE CHANNEL', 'color': 'accent', 'filled': True, 'size': 28, 'align': 'center', 'box': [110, 820, 800, 76], 'in': 'pop@breakdown'}]}})
    meta = copy.deepcopy(S['meta']); meta.update({'title': meta.get('title', '') + ' (Short)', 'format': a.format, 'status': 'draft', 'music': 'drive', 'edge_rate': '+8%',
        'lead': .15, 'gap': .18, 'tail': .35, 'source': os.path.basename(os.path.abspath(a.src)),
        'todo': 'Rewrite the narration to 30-45 s; first line <= 8 words (the hook). Check every scene in the draft sheet; replace stacked rows with a real composition where needed.'})
    meta.pop('music', None) if a.format != 'vertical' else None
    if a.look: meta['look'] = a.look
    os.makedirs(a.dst, exist_ok=True)
    if os.path.isdir(os.path.join(a.src, 'media')): shutil.copytree(os.path.join(a.src, 'media'), os.path.join(a.dst, 'media'), dirs_exist_ok=True)
    json.dump({'meta': meta, 'scenes': pick}, open(os.path.join(a.dst, 'script.json'), 'w', encoding='utf8'), ensure_ascii=False, indent=1)
    n = sum(words(s) for s in pick); print(f'{len(pick)} scenes -> {a.dst}/script.json  (~{n / 2.7:.0f} s of narration at short-form pace)')
    for s in pick: print(f'  {s["id"]} {s.get("type", "compose"):9} {" / ".join(s["lines"])[:90]}')
    if skipped: print('  skipped (landscape-only recipes, rebuild with compose if you want them):', ', '.join(skipped))
    for n_ in notes: print('  note', n_)
    print(f'next: rewrite the hook + narration, then  python tools/make.py {a.dst} draft')
if __name__ == '__main__': main()
