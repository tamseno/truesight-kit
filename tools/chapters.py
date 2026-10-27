# YouTube chapter list from timeline.json: one line per chapter change, first at 0:00.
#   python tools/chapters.py episodes/<name>            -> prints "0:00 Intro" lines
# Chapter titles come from the first scene of each chapter: its chapter-card title if it is one, else its "chapter" field
# (a leading "3 · " number is dropped). YouTube needs >= 3 chapters, each >= 10 s, the first at 0:00.
import json, os, re, sys
EP = os.path.abspath(sys.argv[1]); TL = json.load(open(os.path.join(EP, 'timeline.json'), encoding='utf8'))
out, last = [], None
for s in TL['scenes']:
    ch = s.get('chapter') or ''
    if ch == last: continue
    last = ch; name = (s.get('data') or {}).get('title') if s.get('type') == 'chapter' else None
    name = name or re.sub(r'^\s*\d+\s*·\s*', '', ch) or s.get('title') or s['id']
    t = int(s['start']); out.append((t, name))
out[0] = (0, out[0][1])
for t, n in out: print(f"{t // 60}:{t % 60:02d} {n}")
short = [n for (t, n), (t2, _) in zip(out, out[1:] + [(int(TL['total']), '')]) if t2 - t < 10]
if short: print('WARNING: chapters shorter than 10 s:', short, file=sys.stderr)
