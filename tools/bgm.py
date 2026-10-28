# Background music library, generated: original, license-free beds for narration, one family per mood.
#   python tools/bgm.py                 build every mood x variant into assets/bgm/gen/ (deterministic; ~1 min)
#   python tools/bgm.py focus 2         one track
#   python tools/bgm.py --list          moods and what they're for
# Scripts pick music with "meta": { "music": "focus" } (a mood; the variant is chosen from the episode name so neighbours
# differ) or "music": "focus-2" / "my_track.wav" (a file in assets/bgm/). Your own licensed tracks can sit in assets/bgm/
# and be named in assets/bgm/library.json: { "focus": ["my_calm_track.wav", ...] } — they join the generated ones.
# Music sits ~18-27 dB under the voice, so these are written as beds: steady, no lead melody fighting the narration.
import os, sys, json, hashlib, numpy as np
from scipy.signal import butter, sosfilt, fftconvolve
SR = 48000
KIT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); GEN = os.path.join(KIT, 'assets', 'bgm', 'gen')
# mood: tempo, key (midi root), mode chords (scale degree, quality), layers, swing, about
MOODS = {
    'focus':    dict(bpm=92,  root=57, prog=[(0, 'm9'), (5, 'maj7'), (3, 'maj9'), (4, 'm7')], layers='pad bass pluck hats', about='calm, thoughtful tech explainer (default)'),
    'upbeat':   dict(bpm=112, root=60, prog=[(0, 'add9'), (4, 'add9'), (5, 'm7'), (3, 'maj7')], layers='pad bass pluck kick clap hats', pump=1, about='bright, positive, product news'),
    'curious':  dict(bpm=100, root=62, prog=[(0, 'maj7'), (2, 'm7'), (3, 'maj7'), (4, 'sus2')], layers='bass mallet hats tick', about='playful, "how does this work?"'),
    'tense':    dict(bpm=84,  root=50, prog=[(0, 'm'), (0, 'm'), (5, 'maj'), (6, 'maj')], layers='drone pulse tick lowhit', about='risk, security, problems, stakes'),
    'epic':     dict(bpm=76,  root=48, prog=[(0, 'm'), (5, 'maj'), (2, 'maj'), (6, 'maj')], layers='pad bass toms swell', about='launches, big reveals, chapter openers'),
    'lofi':     dict(bpm=80,  root=55, prog=[(1, 'm9'), (4, '9'), (0, 'maj9'), (5, 'm9')], layers='keys bass kick snare hats vinyl', swing=.18, about='chill, relaxed walkthroughs'),
    'night':    dict(bpm=70,  root=53, prog=[(0, 'maj9'), (3, 'maj7'), (5, 'm9'), (4, 'sus2')], layers='pad bell drone', about='ambient, late-night, reflective'),
    'drive':    dict(bpm=124, root=57, prog=[(0, 'm'), (5, 'maj'), (3, 'maj'), (4, 'maj')], layers='pad arpbass kick clap hats', pump=1, about='energetic, fast — Shorts and TikTok'),
    'warm':     dict(bpm=96,  root=60, prog=[(0, 'maj'), (4, 'maj'), (5, 'm'), (3, 'maj')], layers='keys pad bass shaker', about='hopeful, human, stories'),
    'minimal':  dict(bpm=106, root=59, prog=[(0, 'm7'), (3, 'maj7'), (5, 'maj7'), (4, 'm7')], layers='pluck bass kick hats', about='clean corporate / tutorial'),
}
SCALE = {'minor': [0, 2, 3, 5, 7, 8, 10], 'major': [0, 2, 4, 5, 7, 9, 11]}
QUAL = {'maj': [0, 4, 7], 'm': [0, 3, 7], 'maj7': [0, 4, 7, 11], 'm7': [0, 3, 7, 10], '7': [0, 4, 7, 10], '9': [0, 4, 7, 10, 14], 'm9': [0, 3, 7, 10, 14],
        'maj9': [0, 4, 7, 11, 14], 'add9': [0, 4, 7, 14], 'sus2': [0, 2, 7], 'sus4': [0, 5, 7]}
MINORISH = {'focus', 'tense', 'epic', 'drive', 'minimal'}
hz = lambda m: 440 * 2 ** ((m - 69) / 12)
def lp(x, f, o=2): return sosfilt(butter(o, min(f, SR * .45) / (SR / 2), 'low', output='sos'), x)
def hp(x, f, o=2): return sosfilt(butter(o, f / (SR / 2), 'high', output='sos'), x)
def bp(x, lo, hi, o=2): return sosfilt(butter(o, [lo / (SR / 2), min(hi, SR * .45) / (SR / 2)], 'band', output='sos'), x)
def adsr(n, a, d, s, r, hold):
    t = np.arange(n) / SR; e = np.where(t < a, t / max(a, 1e-4), s + (1 - s) * np.exp(-(t - a) / max(d, 1e-4)))
    return e * np.clip((hold + r - t) / max(r, 1e-4), 0, 1)
def harm(f, n, amps, det=0.0, phase=None, decay=None):
    t = np.arange(n) / SR; y = np.zeros(n)
    for k, a in enumerate(amps, 1):
        if a == 0 or f * k > SR * .45: continue
        w = np.sin(2 * np.pi * f * k * (1 + det) * t + (phase or 0) * k)
        y += a * w * (np.exp(-t * decay[k - 1]) if decay is not None else 1)
    return y
# ---- instruments: each returns a mono note (numpy) of `dur` seconds (+ tail)
def v_pad(f, dur, r):
    n = int((dur + 1.6) * SR); amps = [1 / k ** 1.5 for k in range(1, 14)]
    y = sum(harm(f, n, amps, det=d, phase=r.random() * 6) for d in (-.004, 0, .0045)) / 3
    return lp(y, 2400) * adsr(n, .9, 1.2, .8, 1.5, dur)
def v_drone(f, dur, r):
    n = int((dur + 2) * SR); t = np.arange(n) / SR
    y = harm(f, n, [1, .5, .3, .12, .08], det=.002) * (1 + .25 * np.sin(2 * np.pi * .13 * t))
    return lp(y, 900) * adsr(n, 1.5, 1, .9, 2, dur)
def v_pluck(f, dur, r):
    n = int((dur + .8) * SR); k = np.arange(1, 11); dec = 3 + 2.2 * k
    return harm(f, n, list(.9 / k ** 1.1), decay=dec) * adsr(n, .003, .3, .0, .3, dur)
def v_mallet(f, dur, r):
    n = int(.9 * SR); return harm(f, n, [1, 0, .35, 0, .12, 0, 0, 0, 0, .05], decay=[9, 9, 14, 9, 22, 9, 9, 9, 9, 30])
def v_bell(f, dur, r):
    n = int(3.5 * SR); t = np.arange(n) / SR; I = 2.2 * np.exp(-t * 2.5)
    return np.sin(2 * np.pi * f * t + I * np.sin(2 * np.pi * f * 3.5 * t)) * np.exp(-t * 1.3) * np.minimum(1, t / .004)
def v_keys(f, dur, r):
    n = int((dur + 1.2) * SR); k = np.arange(1, 9)
    return harm(f, n, list(1 / k ** 1.8), decay=1.2 + .9 * k) * adsr(n, .004, .4, .55, .5, dur)
def v_bass(f, dur, r):
    n = int((dur + .3) * SR); return lp(harm(f, n, [1, .35, .12]), 600) * adsr(n, .008, .25, .7, .12, dur)
def v_kick(r):
    n = int(.45 * SR); t = np.arange(n) / SR; fq = 48 + 95 * np.exp(-t / .045)
    return np.sin(2 * np.pi * np.cumsum(fq) / SR) * np.exp(-t / .16) + .3 * np.exp(-t / .004) * r.standard_normal(n) * .2
def v_snare(r):
    n = int(.3 * SR); t = np.arange(n) / SR
    return bp(r.standard_normal(n), 1400, 7000) * np.exp(-t / .07) * .7 + np.sin(2 * np.pi * 185 * t) * np.exp(-t / .05) * .4
def v_clap(r):
    n = int(.35 * SR); t = np.arange(n) / SR; e = sum(np.exp(-np.clip(t - o, 0, None) / .012) * (t >= o) for o in (0, .011, .022)) + np.exp(-np.clip(t - .03, 0, None) / .12) * (t >= .03)
    return bp(r.standard_normal(n), 900, 5000) * e * .45
def v_hat(r, open_=False):
    n = int((.35 if open_ else .06) * SR); t = np.arange(n) / SR
    return hp(r.standard_normal(n), 7000, 4) * np.exp(-t / (.12 if open_ else .018)) * .35
def v_shaker(r):
    n = int(.09 * SR); t = np.arange(n) / SR; return bp(r.standard_normal(n), 4000, 11000) * np.sin(np.pi * np.clip(t / .09, 0, 1)) ** 2 * .22
def v_tick(r):
    n = int(.03 * SR); t = np.arange(n) / SR; return np.sin(2 * np.pi * 2600 * t) * np.exp(-t / .006) * .25
def v_tom(f, r):
    n = int(.8 * SR); t = np.arange(n) / SR; fq = f * (1 + .6 * np.exp(-t / .05)); return np.sin(2 * np.pi * np.cumsum(fq) / SR) * np.exp(-t / .3)
def place(buf, x, at, g=1.0):
    i = int(at * SR)
    if i >= len(buf): return
    m = min(len(x), len(buf) - i); buf[i:i + m] += x[:m] * g
def reverb(x, secs=2.6, seed=3):
    r = np.random.default_rng(seed); n = int(secs * SR); t = np.arange(n) / SR
    ir = r.standard_normal(n) * np.exp(-t / (secs / 5)); ir = lp(ir, 5000); ir[: int(.012 * SR)] = 0; ir /= np.sqrt(np.sum(ir ** 2))
    return fftconvolve(x, ir)[: len(x)]
def build(mood, variant=1):
    M = MOODS[mood]; seed = int(hashlib.md5(f'{mood}-{variant}'.encode()).hexdigest()[:8], 16); r = np.random.default_rng(seed)
    bpm = M['bpm'] * (1 + (variant - 1) * .04); beat = 60 / bpm; bar = 4 * beat
    root = M['root'] + [0, -2, 3, -3, 5][(variant - 1) % 5]
    mode = SCALE['minor' if mood in MINORISH else 'major']
    prog = M['prog'][(variant - 1) % len(M['prog']):] + M['prog'][:(variant - 1) % len(M['prog'])]
    L = set(M['layers'].split()); swing = M.get('swing', 0)
    # arrangement: intro / A / B / breakdown / B / outro (bars); the track loops cleanly in mix.py
    secs = [('intro', 4, {'pad', 'drone', 'keys', 'bell', 'vinyl'}), ('a', 8, None), ('b', 8, 'all'), ('break', 4, {'pad', 'drone', 'keys', 'bell', 'mallet', 'pluck', 'vinyl', 'swell'}), ('b', 8, 'all'), ('a', 8, None), ('outro', 4, {'pad', 'drone', 'bell', 'vinyl'})]
    total_bars = sum(s[1] for s in secs); N = int((total_bars * bar + 4) * SR)
    T = {k: np.zeros(N) for k in ('pad', 'bass', 'mel', 'drums', 'tex')}
    b0 = 0
    for name, nb, keep in secs:
        on = (lambda x: x in L) if keep == 'all' else (lambda x, keep=keep: x in L and (keep is None and x not in ('kick', 'snare', 'clap', 'toms', 'arpbass') or keep is not None and x in keep))
        for bi in range(nb):
            t0 = (b0 + bi) * bar; deg, q = prog[((b0 + bi) // 2) % len(prog)]
            cr = root + mode[deg % 7] + 12 * (deg // 7); notes = [cr + iv for iv in QUAL[q]]
            if bi % 2 == 0:  # chords change every two bars
                if on('pad'):
                    for m in notes: place(T['pad'], v_pad(hz(m + 12), 2 * bar, r), t0, .16)
                if on('drone'): place(T['pad'], v_drone(hz(cr - 12), 2 * bar, r), t0, .3)
                if on('swell'): place(T['pad'], v_pad(hz(cr + 24), 2 * bar, r) * np.linspace(0, 1, int((2 * bar + 1.6) * SR)) ** 2, t0, .25)
            if on('bass'):
                for k, (o, d) in enumerate([(0, 1.5), (2, .5), (2.5, 1.5)] if mood in ('upbeat', 'drive', 'minimal', 'lofi', 'warm') else [(0, 3.5)]):
                    place(T['bass'], v_bass(hz(cr - 12), d * beat, r), t0 + o * beat, .3)
            if on('arpbass'):
                for s16 in range(16): place(T['bass'], v_pluck(hz(cr - 12 + (12 if s16 % 4 == 2 else 0)), beat / 4, r), t0 + s16 * beat / 4, .32)
            if on('pluck'):
                pat = [0, 2, 1, 3, 2, 1, 3, 2] if variant % 2 else [0, 1, 2, 3, 2, 3, 1, 2]
                for s8 in range(8):
                    if r.random() < .12: continue
                    sw = swing * beat / 2 if s8 % 2 else 0; place(T['mel'], v_pluck(hz(notes[pat[s8] % len(notes)] + 12), beat / 2, r), t0 + s8 * beat / 2 + sw, .17)
            if on('mallet'):
                for s8 in range(8):
                    if r.random() < .45: continue
                    place(T['mel'], v_mallet(hz(notes[r.integers(len(notes))] + 24), .3, r), t0 + s8 * beat / 2, .16)
            if on('keys'):
                for o in ([0, 1.5, 2.5] if mood == 'lofi' else [0, 2]):
                    for m in notes: place(T['mel'], v_keys(hz(m + 12), 1.2 * beat, r), t0 + o * beat + (swing * beat if o % 1 else 0) + r.random() * .012, .08)
            if on('bell') and bi % 2 == 0:
                for j in range(2):
                    if r.random() < .6: place(T['mel'], v_bell(hz(notes[r.integers(len(notes))] + 24), 2, r), t0 + (j * 2 + r.integers(2)) * beat, .07)
            if on('kick'):
                for b in (range(4) if mood in ('upbeat', 'drive', 'minimal') else (0, 2.5) if mood == 'lofi' else (0,)): place(T['drums'], v_kick(r), t0 + b * beat, .55)
            if on('snare'):
                for b in (1, 3): place(T['drums'], v_snare(r), t0 + b * beat + swing * beat * .3, .3)
            if on('clap'):
                for b in (1, 3): place(T['drums'], v_clap(r), t0 + b * beat, .32)
            if on('hats'):
                for s8 in range(8):
                    sw = swing * beat / 2 if s8 % 2 else 0; place(T['drums'], v_hat(r, open_=(s8 == 7 and bi % 2 == 1)), t0 + s8 * beat / 2 + sw, .25 if s8 % 2 else .38)
            if on('shaker'):
                for s16 in range(16): place(T['drums'], v_shaker(r), t0 + s16 * beat / 4, .6 if s16 % 2 else 1)
            if on('tick'):
                for s8 in range(8): place(T['drums'], v_tick(r), t0 + s8 * beat / 2, .5 if s8 % 2 else .8)
            if on('pulse'):
                for s8 in range(8): place(T['bass'], v_bass(hz(cr - 12), beat / 3, r), t0 + s8 * beat / 2, .35)
            if on('lowhit') and bi % 4 == 0: place(T['drums'], v_tom(48, r), t0, .5)
            if on('toms') and bi % 2 == 1:
                for j, f in enumerate((110, 98, 82, 73)): place(T['drums'], v_tom(f, r), t0 + (2 + j * .5) * beat, .3)
        if 'vinyl' in L:
            n0, n1 = int(b0 * bar * SR), int((b0 + nb) * bar * SR); cr_ = (r.random(n1 - n0) < .0004) * r.standard_normal(n1 - n0) * .5
            T['tex'][n0:n1] += lp(r.standard_normal(n1 - n0), 3000) * .006 + hp(cr_, 2000)
        b0 += nb
    # sidechain pump on four-on-the-floor moods
    if M.get('pump'):
        t = np.arange(N) / SR; ph = (t % beat) / beat; duck = 1 - .45 * np.exp(-ph * 9); T['pad'] *= duck; T['mel'] *= .4 + .6 * duck
    wet = reverb(T['pad'] * .5 + T['mel'] * .7, 3.0 if mood in ('night', 'epic', 'focus') else 2.0)
    dry = T['pad'] * .7 + T['bass'] + T['mel'] * .8 + T['drums'] + T['tex']
    # stereo: reverb decorrelated, plucks/mallets slightly offset
    wl, wr = wet, np.roll(wet, int(.011 * SR))
    L_ = dry + wl * .55; R_ = dry + wr * .55 + np.roll(T['mel'], int(.007 * SR)) * .08
    st = np.stack([L_, R_], 1); st = hp(st.T, 30).T
    # leveler: a bed must sit at one height under the voice — sections may breathe ~±3 dB, not 9
    e = np.sqrt(lp(np.mean(st ** 2, 1), .35, 1) + 1e-10); tgt = np.median(e[int(4 * bar * SR):int((total_bars - 4) * bar * SR)])
    g = np.clip((tgt / e) ** .75, .6, 2.2); g = lp(g, .25, 1); st = st * g[:, None]
    st = np.tanh(st / (np.abs(st).max() + 1e-9) * 1.4) / np.tanh(1.4)
    return (st / (np.abs(st).max() + 1e-9) * .85).astype(np.float32)
def write(path, st):
    import wave
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with wave.open(path, 'wb') as w: w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((st * 32767).astype('<i2').tobytes())
def track(mood, variant=1):
    p = os.path.join(GEN, f'{mood}-{variant}.wav')
    if not os.path.exists(p): write(p, build(mood, variant))
    return p
VARIANTS = 3
def pick(spec, episode=''):
    """meta.music -> wav path. spec: mood | mood-N | file in assets/bgm | None (focus)."""
    bgm = os.path.join(KIT, 'assets', 'bgm'); spec = spec or 'focus'
    if os.path.exists(os.path.join(bgm, spec)): return os.path.join(bgm, spec)
    if '-' in spec and spec.rsplit('-', 1)[1].isdigit(): m, v = spec.rsplit('-', 1); return track(m, int(v))
    if spec not in MOODS and not os.path.exists(os.path.join(bgm, 'library.json')): raise SystemExit(f'unknown music "{spec}" — moods: {", ".join(MOODS)}')
    lib = {}
    try: lib = json.load(open(os.path.join(bgm, 'library.json'), encoding='utf8'))
    except Exception: pass
    own = [os.path.join(bgm, f) for f in lib.get(spec, []) if os.path.exists(os.path.join(bgm, f))]
    pool = own + ([f'{spec}-{v}' for v in range(1, VARIANTS + 1)] if spec in MOODS else [])
    k = int(hashlib.md5(episode.encode()).hexdigest()[:6], 16) % len(pool); ch = pool[k]
    return ch if os.path.isabs(ch) else track(*ch.rsplit('-', 1)[:1], int(ch.rsplit('-', 1)[1]))
if __name__ == '__main__':
    a = sys.argv[1:]
    if a and a[0] == '--list':
        for k, v in MOODS.items(): print(f'{k:9} {v["bpm"]:4} bpm  {v["about"]}')
    elif a:
        p = os.path.join(GEN, f'{a[0]}-{int(a[1]) if len(a) > 1 else 1}.wav'); write(p, build(a[0], int(a[1]) if len(a) > 1 else 1)); print(p)
    else:
        import time; t = time.time()
        for m in MOODS:
            for v in range(1, VARIANTS + 1): write(os.path.join(GEN, f'{m}-{v}.wav'), build(m, v)); print(m, v, f'{time.time() - t:.0f}s', flush=True)
