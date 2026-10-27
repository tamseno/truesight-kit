# TrueSight Motion Kit — narration + timeline builder
#   python tools/timeline.py episodes/<name> edge     # draft voice (edge-tts, word timings), fast, for layout/timing work
#   python tools/timeline.py episodes/<name> index    # final voice: uses <ep>/tts/<key>.wav + .json made by synth_index.py + align.py
# Writes <ep>/narration.wav and <ep>/timeline.json. Scene fields other than "lines" pass straight through to the engine.
import asyncio, json, os, re, sys, wave, subprocess, difflib, numpy as np, imageio_ffmpeg
EP = os.path.abspath(sys.argv[1]); MODE = sys.argv[2] if len(sys.argv) > 2 else 'edge'
FF = imageio_ffmpeg.get_ffmpeg_exe(); SR = 48000
S = json.load(open(os.path.join(EP, 'script.json'), encoding='utf8'))
META = S.get('meta', {}); SCENES = S['scenes']
VOICE, RATE = META.get('edge_voice', 'en-US-AndrewMultilingualNeural'), META.get('edge_rate', '+2%')
LEAD, GAP, TAIL = META.get('lead', .35), META.get('gap', .3), META.get('tail', .6)
SAY = META.get('say', {})  # pronunciation map for TTS only: {"Grok": "Grock"}; subtitles keep the written word
TD = os.path.join(EP, 'tts'); os.makedirs(TD, exist_ok=True)
def spoken(text):
    for k, v in SAY.items(): text = re.sub(r'\b' + re.escape(k) + r'\b', v, text)
    return text
async def one(key, text):
    mp3, js = f'{TD}/{key}.mp3', f'{TD}/{key}.edge.json'; k = spoken(text) + VOICE + RATE
    if os.path.exists(js) and os.path.exists(mp3) and json.load(open(js, encoding='utf8')).get('k') == k: return
    import edge_tts
    c = edge_tts.Communicate(spoken(text), VOICE, rate=RATE, boundary='WordBoundary'); wb = []
    with open(mp3, 'wb') as f:
        async for ch in c.stream():
            if ch['type'] == 'audio': f.write(ch['data'])
            elif ch['type'] == 'WordBoundary': wb.append([round(ch['offset'] / 1e7, 3), round((ch['offset'] + ch['duration']) / 1e7, 3), ch['text']])
    json.dump({'text': text, 'k': k, 'words': wb}, open(js, 'w', encoding='utf8'), ensure_ascii=False)
if MODE == 'edge':
    async def main():
        jobs = [one(f"{s['id']}_{i}", t) for s in SCENES for i, t in enumerate(s['lines'])]
        for k in range(0, len(jobs), 8): await asyncio.gather(*jobs[k:k + 8])
    asyncio.run(main())
def pcm(key):
    src = f'{TD}/{key}.wav' if MODE == 'index' else f'{TD}/{key}.mp3'
    out = subprocess.run([FF, '-v', 'error', '-i', src, '-f', 's16le', '-ac', '1', '-ar', str(SR), '-'], capture_output=True).stdout
    return np.frombuffer(out, np.int16).astype(np.float32) / 32768
def remap(text, ww):
    """script words get times from recognised/boundary words (fuzzy); unmatched words are interpolated"""
    norm = lambda z: re.sub(r'[^a-z0-9]', '', z.lower())
    st = text.split(); a = [norm(x) for x in st]; b = [norm(w[2]) for w in ww]; T = [None] * len(st)
    for blk in difflib.SequenceMatcher(None, a, b, autojunk=False).get_matching_blocks():
        for k in range(blk.size): T[blk.a + k] = (ww[blk.b + k][0], ww[blk.b + k][1])
    end = ww[-1][1] if ww else 1.0; known = [i for i, v in enumerate(T) if v]
    for i in range(len(st)):
        if T[i]: continue
        prv = max([k for k in known if k < i], default=None); nxt = min([k for k in known if k > i], default=None)
        t0 = T[prv][1] if prv is not None else 0.0; t1 = T[nxt][0] if nxt is not None else end
        span = (nxt if nxt is not None else len(st)) - (prv if prv is not None else -1); pos = i - (prv if prv is not None else -1)
        T[i] = (t0 + (t1 - t0) * (pos - 1) / span, t0 + (t1 - t0) * pos / span)
    return [[round(T[i][0], 3), round(T[i][1], 3), st[i]] for i in range(len(st))]
def act_rms(x):
    fr = x[: len(x) // 480 * 480].reshape(-1, 480); r = np.sqrt((fr ** 2).mean(1)); a = r[r > 0.02]
    return float(np.sqrt((a ** 2).mean())) if len(a) else 0.05
t = 0.0; chunks = []; TL = []
for s in SCENES:
    sc = {k: v for k, v in s.items() if k != 'lines'}; sc['start'] = round(t, 3); sc['lines'] = []
    cur = s.get('lead', LEAD)
    for i, text in enumerate(s['lines']):
        key = f"{s['id']}_{i}"; a = pcm(key)
        nz = np.where(np.abs(a) > 0.004)[0]; a0 = nz[0] if len(nz) else 0; a1 = nz[-1] + 1 if len(nz) else len(a)
        off = a0 / SR; a = a[a0:a1]; a = a * (0.11 / act_rms(a))  # every line at the same speaking level
        jp = f'{TD}/{key}.json' if MODE == 'index' else f'{TD}/{key}.edge.json'
        if os.path.exists(jp): words = remap(text, json.load(open(jp, encoding='utf8'))['words'])
        else:  # no aligner output: spread words over the voiced span, weighted by length, pauses after punctuation
            tw = text.split(); wt = [len(x) + 2 + (4 if x[-1] in ',.;:?!' else 0) for x in tw]; tot = sum(wt); dur = len(a) / SR; acc = 0; words = []
            for x, k in zip(tw, wt): words.append([round(off + dur * acc / tot, 3), round(off + dur * (acc + k) / tot, 3), x]); acc += k
        sc['lines'].append({'text': text, 's': round(cur, 3), 'e': round(cur + len(a) / SR, 3), 'w': [[round(cur + w0 - off, 3), round(cur + w1 - off, 3), tx] for w0, w1, tx in words]})
        chunks.append((t + cur, a)); cur += len(a) / SR + (s.get('gap', GAP) if i < len(s['lines']) - 1 else 0)
    sc['dur'] = round(max(cur + s.get('tail', TAIL), s.get('min_dur', 0)), 3); t += sc['dur']; TL.append(sc)
N = int((t + 0.5) * SR); mix = np.zeros(N, np.float32)
for st, a in chunks: i = int(st * SR); mix[i:i + len(a)] += a
mix = np.tanh(mix * 1.2) / 1.2; mix = mix / max(1e-6, np.abs(mix).max()) * 0.9
with wave.open(os.path.join(EP, 'narration.wav'), 'wb') as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix * 32767).astype('<i2').tobytes())
json.dump({'fps': 60, 'w': 1920, 'h': 1080, 'total': round(t, 3), 'meta': META, 'scenes': TL}, open(os.path.join(EP, 'timeline.json'), 'w', encoding='utf8'), ensure_ascii=False, indent=1)
print('total', round(t, 2), 's', len(TL), 'scenes')
for s in TL: print(f"  {s['id']:<5} {s.get('type', 'custom'):<10} {s['start']:7.2f} {s['dur']:6.2f}")
