# Everything you paste into YouTube / TikTok, generated next to the video, plus caption files.
#   python tools/publish.py episodes/<name>
# Writes <ep>/publish.md (read and paste), publish.json (for upload scripts) and captions.srt (word-timed, from the voice).
# Fill it from the script — the agent writes the words, this tool assembles, formats and checks them:
#   "meta": { "publish": { "title": "…", "titles": ["alt 1", "alt 2"], "description": "…",
#                          "tags": ["grok bot", "ai agents"], "hashtags": ["#AI", "#coding"], "comment": "pinned comment" } }
# Chapters come from the timeline (landscape), sources from every "source" element and recipe source in the script.
import sys as _s; _s.stdout.reconfigure(encoding="utf-8", errors="replace")
import os, sys, json, re, glob, subprocess
EP = os.path.abspath(sys.argv[1]); KIT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
S = json.load(open(os.path.join(EP, 'script.json'), encoding='utf8')); M = S.get('meta', {}); PB = M.get('publish', {})
TL = json.load(open(os.path.join(EP, 'timeline.json'), encoding='utf8'))
fmt = M.get('format', 'landscape'); short = fmt in ('vertical', 'short'); name = os.path.basename(EP); warn = []
# ---- captions (SRT): cues of <= 2 x 42 chars, cut at sentence ends and pauses, timed by the real word timings
def ts(t): t = max(0, t); h, r = divmod(t, 3600); m, s = divmod(r, 60); return f'{int(h):02d}:{int(m):02d}:{int(s):02d},{int(round((s % 1) * 1000)) % 1000:03d}'
cues = []
for sc in TL['scenes']:
    for ln in sc.get('lines', []):
        ws = ln.get('w') or []; cur = []
        for k, w in enumerate(ws):
            cur.append(w); txt = ' '.join(x[2] for x in cur); nxt = ws[k + 1] if k + 1 < len(ws) else None
            gap = (nxt[0] - w[1]) if nxt and len(w) > 1 and w[1] is not None else 0
            if not nxt or len(txt) > 70 or (re.search(r'[.?!]$', w[2]) and len(txt) > 18) or gap > .6:
                cues.append([sc['start'] + cur[0][0], sc['start'] + (w[1] if len(w) > 1 and w[1] else w[0] + .4) + .2, txt]); cur = []
for i in range(len(cues) - 1): cues[i][1] = min(cues[i][1], cues[i + 1][0] - .02)
def wrap(t):
    if len(t) <= 42: return t
    w = t.split(); best = min(range(1, len(w)), key=lambda k: abs(len(' '.join(w[:k])) - len(t) / 2)); return ' '.join(w[:best]) + '\n' + ' '.join(w[best:])
open(os.path.join(EP, 'captions.srt'), 'w', encoding='utf8').write('\n'.join(f'{i + 1}\n{ts(a)} --> {ts(b)}\n{wrap(t)}\n' for i, (a, b, t) in enumerate(cues)))
# ---- chapters (YouTube needs >= 3, each >= 10 s, first at 0:00)
chapters = []
if not short:
    r = subprocess.run([sys.executable, os.path.join(KIT, 'tools', 'chapters.py'), EP], capture_output=True, text=True, encoding='utf8')
    chapters = [l for l in r.stdout.splitlines() if re.match(r'^\d+:\d\d ', l)]
    if len(chapters) < 3: warn.append(f'only {len(chapters)} chapters — YouTube shows chapters from 3 up')
    if r.stderr.strip(): warn.append(r.stderr.strip())
# ---- sources
srcs = []
def walk(o):
    if isinstance(o, dict):
        if o.get('el') == 'source' and o.get('text'): srcs.append(o['text'])
        for k, v in o.items():
            if k == 'source' and isinstance(v, str): srcs.append(v)
            else: walk(v)
    elif isinstance(o, list): [walk(x) for x in o]
walk(S['scenes']); srcs += M.get('sources', []); srcs = list(dict.fromkeys(s.strip() for s in srcs if s.strip()))
# ---- title, description, tags
title = PB.get('title') or re.sub(r'\s*\((Short|v\d[^)]*)\)\s*', ' ', M.get('title', name)).strip()
titles = [title] + [t for t in PB.get('titles', []) if t != title]
for t in titles:
    if len(t) > 100: warn.append(f'title over 100 characters: {t[:60]}…')
    elif len(t) > 70 and not short: warn.append(f'title over 70 characters gets cut in search: {t}')
tags = PB.get('tags', []); hashtags = PB.get('hashtags', [])
if short and '#shorts' not in [h.lower() for h in hashtags]: hashtags = hashtags + ['#Shorts']
if len(','.join(tags)) > 500: warn.append('tags exceed 500 characters')
if len(hashtags) > 5: warn.append('more than 5 hashtags look spammy; YouTube ignores all of them past 60')
desc = PB.get('description') or ''
if not desc: warn.append('no publish.description in the script — write 2-4 sentences: the promise, what they will learn, who it is for')
body = desc.strip()
if chapters: body += '\n\nChapters\n' + '\n'.join(chapters)
if srcs: body += '\n\nSources\n' + '\n'.join(f'- {s}' for s in srcs)
if hashtags: body += '\n\n' + ' '.join(hashtags)
if len(body) > 5000: warn.append('description over 5000 characters')
def first_sentences(t, n=150):  # a caption ends on a full sentence, never mid-word
    out = ''
    for s_ in re.split(r'(?<=[.!?])\s+', t.split('\n')[0]):
        if len(out) + len(s_) + 1 > n: break
        out = (out + ' ' + s_).strip()
    return out or t[:n].rsplit(' ', 1)[0]
tiktok = (first_sentences(desc) + ' ' + ' '.join(h for h in hashtags if h.lower() != '#shorts')).strip()
video = (sorted(glob.glob(os.path.join(EP, '*_final.mp4'))) or [None])[-1]
thumbs = sorted(os.path.basename(f) for f in glob.glob(os.path.join(EP, 'thumb-*.jpg')) + glob.glob(os.path.join(EP, 'cover-*.jpg')))
if not video: warn.append('no *_final.mp4 yet')
if not thumbs: warn.append('no thumbnails yet — python tools/thumb.py ' + os.path.relpath(EP, KIT))
P = {'platforms': ['YouTube Shorts', 'TikTok', 'Reels'] if short else ['YouTube'], 'title': title, 'titles': titles, 'description': body, 'tags': tags, 'hashtags': hashtags,
     'pinned_comment': PB.get('comment', ''), 'tiktok_caption': tiktok if short else '', 'video': video and os.path.basename(video), 'thumbnails': thumbs,
     'captions': 'captions.srt', 'chapters': chapters, 'sources': srcs, 'duration_s': round(TL['total'], 1), 'warnings': warn}
json.dump(P, open(os.path.join(EP, 'publish.json'), 'w', encoding='utf8'), ensure_ascii=False, indent=1)
md = [f'# Publish · {name}', '', f'Video: `{P["video"]}` ({P["duration_s"]} s, {fmt}) · captions: `captions.srt` ({len(cues)} cues) · thumbnails: {", ".join(f"`{t}`" for t in thumbs) or "—"}', '',
      '## Title' + (' options' if len(titles) > 1 else ''), *[f'{i + 1}. {t}  ({len(t)} chars)' for i, t in enumerate(titles)], '', '## Description', '', body, '']
if tags: md += ['## Tags', '', ', '.join(tags), '']
if P['pinned_comment']: md += ['## Pinned comment', '', P['pinned_comment'], '']
if short: md += ['## TikTok / Reels caption', '', tiktok, '']
if warn: md += ['## Check before posting', '', *[f'- {w}' for w in warn], '']
open(os.path.join(EP, 'publish.md'), 'w', encoding='utf8').write('\n'.join(md))
print(f'publish.md, publish.json, captions.srt ({len(cues)} cues)' + (f' — {len(warn)} to check:' if warn else ''))
for w in warn: print('  -', w)
