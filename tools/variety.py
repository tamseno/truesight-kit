# Variety check: is this episode built from the library, or is it the same video again?
#   python tools/variety.py episodes/<name>
# Reports scene-type mix, repeats in a row, layouts and entrances used, transitions, and the look against recent episodes.
# Exit code 1 when a hard rule fails (so an agent's loop can stop on it). Rules live in docs/AGENT.md ("Variety rules").
import json, os, sys, collections, re
EP = os.path.abspath(sys.argv[1]); KIT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
S = json.load(open(os.path.join(EP, 'script.json'), encoding='utf8')); sc = S['scenes']; meta = S.get('meta', {})
types = [s.get('type', 'custom') for s in sc]; n = len(sc)
compose = [s for s in sc if s.get('type') == 'compose']
recipes = [t for t in types if t not in ('compose', 'chapter', 'endcard', 'custom')]
ins, layouts, els = collections.Counter(), collections.Counter(), collections.Counter()
def walk(lst):
    for e in lst:
        els[e.get('el', '?')] += 1
        m = e.get('in'); m = m.get('m') if isinstance(m, dict) else (m.split('@')[0] if isinstance(m, str) else 'default')
        ins[m] += 1; walk(e.get('kids', []))
for s in compose:
    lay = s.get('data', {}).get('layout', 'free'); layouts[lay if isinstance(lay, str) else lay.get('type', '?')] += 1; walk(s.get('data', {}).get('els', []))
trans = collections.Counter(s.get('trans', '(look default)') for s in sc)
runs = [(i, types[i]) for i in range(1, n) if types[i] == types[i - 1] and types[i] not in ('chapter', 'compose')]
lay_of = lambda s: (lambda l: l if isinstance(l, str) else (l or {}).get('type', 'full'))(s.get('data', {}).get('layout', 'free'))  # no layout = hand-placed boxes
same_lay = [(sc[i - 1]['id'], sc[i]['id'], lay_of(sc[i])) for i in range(1, n) if types[i] == types[i - 1] == 'compose' and lay_of(sc[i]) == lay_of(sc[i - 1]) != 'free']
fails, warns = [], []
fmt = {'short': 'vertical'}.get(meta.get('format', 'landscape'), meta.get('format', 'landscape'))
share = len(compose) / max(1, n)
if share < .4: fails.append(f'only {len(compose)}/{n} scenes are compose ({share:.0%}); aim for >= 40% custom scenes')
over = [t for t, c in collections.Counter(recipes).items() if c > 3]
if over: fails.append(f'recipe used more than 3 times: {over}')
if runs: fails.append('same scene type twice in a row: ' + ', '.join(f'{sc[i - 1]["id"]}->{sc[i]["id"]} ({t})' for i, t in runs))
# (shorts are hand-stacked, so the layout count means little there)
if compose and fmt != 'vertical' and len(layouts) < min(4, len(compose)): warns.append(f'compose scenes use only {len(layouts)} layouts {dict(layouts)}; vary them')
if compose and len([k for k in ins if k != 'none']) < 4: warns.append(f'only {len(ins)} entrance motions {dict(ins)}; use at least 4 kinds')
if same_lay: warns.append('back-to-back compose scenes with the same layout: ' + ', '.join(f'{a}->{b} ({l})' for a, b, l in same_lay))
if len(trans) < 3: warns.append(f'transitions barely vary: {dict(trans)}')
# formats: recipes that only exist in landscape render scaled down elsewhere; short-form has its own shape
if fmt != 'landscape':
    AR = os.path.join(KIT, 'core', 'archetypes'); anyfmt = {'compose'}
    for f in os.listdir(AR):
        if f.endswith('.js') and re.search(r"\.formats\s*=\s*\[\s*'\*'", open(os.path.join(AR, f), encoding='utf8').read()): anyfmt.add(f[:-3])
    land = [f'{s["id"]} ({s.get("type")})' for s in sc if s.get('type', 'compose') not in anyfmt]
    if land: (fails if fmt == 'vertical' else warns).append(f'landscape-only recipes in a {fmt} video (they render scaled down): {land}; rebuild them with compose')
if fmt == 'vertical':
    tl = os.path.join(EP, 'timeline.json'); total = json.load(open(tl, encoding='utf8')).get('total') if os.path.exists(tl) else None
    if total and not 12 <= total <= 75: warns.append(f'short runs {total:.0f} s; Shorts/TikTok work best at 20-60 s')
    if n > 12: warns.append(f'{n} scenes is a lot for a short; aim for 5-9')
    if any(t == 'chapter' for t in types): warns.append('chapter cards in a short; cut them (no chapters on Shorts/TikTok)')
    if sc and sc[0].get('title'): warns.append(f'{sc[0]["id"]} opens with a title header; the hook frame should be the visual itself')
# look rotation across recent episodes
look = meta.get('look', 'clean'); recent = []
for d in sorted(os.listdir(os.path.join(KIT, 'episodes'))):
    p = os.path.join(KIT, 'episodes', d, 'script.json')
    if d.startswith('_') or os.path.abspath(os.path.join(KIT, 'episodes', d)) == EP or not os.path.exists(p): continue
    recent.append((os.path.getmtime(p), d, json.load(open(p, encoding='utf8')).get('meta', {}).get('look', 'clean')))
recent = sorted(recent)[-3:]
if any(l == look for _, _, l in recent[-2:]): warns.append(f'look "{look}" was used by a recent episode ({[x[1] for x in recent if x[2] == look]}); rotate looks')
print(f'{os.path.basename(EP)} | {meta.get("format", "landscape")} | look {look} | {n} scenes | compose {len(compose)} ({share:.0%}) | recipes {dict(collections.Counter(recipes))}')
print(f'  layouts {dict(layouts)}')
print(f'  entrances {dict(ins)}')
print(f'  elements {dict(els.most_common(12))}')
print(f'  transitions {dict(trans)}')
print(f'  recent looks {[(d, l) for _, d, l in recent]}')
for f in fails: print('FAIL', f)
for w in warns: print('WARN', w)
if not fails and not warns: print('OK varied')
sys.exit(1 if fails else 0)
