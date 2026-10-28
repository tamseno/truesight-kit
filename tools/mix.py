# narration + BGM (looped with crossfades, ducked to ~27 dB under the voice while speaking) + subtle SFX from cues.json -> <ep>/mix.wav
#   python tools/mix.py episodes/<name> [bgm.wav]
# Music: argv, else meta.music (a mood from tools/bgm.py, "mood-N", or a file in assets/bgm), else the look's mood
# (vertical formats default to "drive"). The variant is picked from the episode name, so consecutive videos differ.
import json, wave, subprocess, sys, os, numpy as np, imageio_ffmpeg
from scipy.signal import lfilter
EP = os.path.abspath(sys.argv[1]); KIT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FF = imageio_ffmpeg.get_ffmpeg_exe(); SR = 48000
TL = json.load(open(os.path.join(EP, 'timeline.json'), encoding='utf8')); TOT = TL['total'] + 1.0; N = int(TOT * SR)
LOOK_MOOD = {'clean': 'focus', 'editorial': 'minimal', 'blueprint': 'focus', 'neon': 'upbeat', 'brutal': 'curious', 'glass': 'warm', 'terminal': 'lofi'}
if len(sys.argv) > 2: BGM = sys.argv[2]
else:
    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__))); import bgm as BG
    meta = TL.get('meta', {}); spec = meta.get('music') or ('drive' if meta.get('format') in ('vertical', 'short') else LOOK_MOOD.get(meta.get('look', 'clean'), 'focus'))
    BGM = BG.pick(spec, os.path.basename(EP))
print('music', os.path.relpath(BGM, KIT))
def load(p, ch=2):
    raw = subprocess.run([FF, '-v', 'error', '-i', p, '-f', 'f32le', '-ac', str(ch), '-ar', str(SR), '-'], capture_output=True).stdout
    return np.frombuffer(raw, np.float32).reshape(-1, ch).copy()
m = load(BGM); e = np.abs(m).max(1); nz = np.where(e > 0.003)[0]; m = m[nz[0]:nz[-1]]
XF = int(4.0 * SR); body = m[:len(m) - int(1.5 * SR)]
out = np.zeros((N, 2), np.float32); pos = 0; first = True; w_in = np.linspace(0, 1, XF)[:, None]; w_out = 1 - w_in
while pos < N:
    seg = body.copy()
    if not first: seg[:XF] *= w_in
    seg[-XF:] *= w_out; n = min(len(seg), N - pos); out[pos:pos + n] += seg[:n]; pos += len(seg) - XF; first = False
t = np.arange(N) / SR
with wave.open(os.path.join(EP, 'narration.wav')) as w: nar = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32768
nar = np.pad(nar, (0, max(0, N - len(nar))))[:N]
def rms(x): return float(np.sqrt(np.mean(np.square(x)) + 1e-12))
act = np.abs(lfilter([.01], [1, -.99], np.abs(nar))) > 0.01
base = rms(nar[act]) / rms(out.mean(1))
env = lfilter([.02], [1, -.98], act.astype(np.float32))
env = np.maximum(env, lfilter([.00025], [1, -.99975], act.astype(np.float32)) * 1.6).clip(0, 1)
gain_db = -18 + (-27 + 18) * env
music = out * (base * 10 ** (gain_db / 20))[:, None]
music *= np.interp(t, [0, 1.0, TOT - 4.5, TOT - .5], [0, 1, 1, 0])[:, None]
rng = np.random.default_rng(7)
# ---- synthesized SFX (v2): band-passed noise sweeps, pitched pops, inharmonic bells; 3 variants per type so repeats don't sound looped
from scipy.signal import butter, sosfilt
def lp(x, a): return lfilter([a], [1, -(1 - a)], x)
def envf(n, a, d): x = np.arange(n) / SR; return np.minimum(1, x / max(a, 1e-4)) * np.exp(-x / d)
def bp(x, lo, hi, o=2): return sosfilt(butter(o, [lo / (SR / 2), hi / (SR / 2)], 'band', output='sos'), x)
def sweep(n, f0, f1, q=.35, r=None):
    """noise through a band-pass whose centre glides f0 -> f1 (state-variable filter, per sample)"""
    r = r or rng; x = r.standard_normal(n); y = np.zeros(n); lo = bd = 0.0; fc = np.geomspace(f0, f1, n)
    for i in range(n):
        f = 2 * np.sin(np.pi * fc[i] / SR); hi_ = x[i] - lo - q * bd; bd += f * hi_; lo += f * bd; y[i] = bd
    return y / (np.abs(y).max() + 1e-9)
def bell(n, f, parts=((1, 1, .9), (2.76, .45, .35), (5.4, .2, .18), (8.9, .08, .1))):
    x = np.arange(n) / SR; return sum(a * np.sin(2 * np.pi * f * m * x) * np.exp(-x / d) for m, a, d in parts) * np.minimum(1, x / .002)
def make(kind, v):
    r = np.random.default_rng(100 + v * 17 + sum(map(ord, kind)) % 997); j = 1 + (v - 1) * .04  # small pitch jitter per variant
    if kind == 'tick':
        n = int(.05 * SR); return (bp(r.standard_normal(n), 2600 * j, 6000) * envf(n, .0004, .006) * .5 + np.sin(2 * np.pi * 3100 * j * np.arange(n) / SR) * envf(n, .0005, .01) * .18) * .9
    if kind == 'click':
        n = int(.06 * SR); s = np.zeros(n); k = bp(r.standard_normal(int(.012 * SR)), 1500 * j, 5200) * envf(int(.012 * SR), .0003, .003)
        s[:len(k)] += k; o = int(.034 * SR); s[o:o + len(k)] += k * .55; return s * .8
    if kind == 'pop':
        n = int(.12 * SR); x = np.arange(n) / SR; f = 780 * j * np.exp(-x / .03) + 330 * j; ph = 2 * np.pi * np.cumsum(f) / SR
        return (np.sin(ph) * envf(n, .001, .04) * .55 + bp(r.standard_normal(n), 1800, 7000) * envf(n, .0003, .004) * .25) * .8
    if kind in ('swoosh', 'whoosh', 'swish'):
        d = {'swoosh': .34, 'whoosh': .62, 'swish': .22}[kind]; n = int(d * SR); x = np.arange(n) / SR
        f0, f1 = {'swoosh': (700, 3800), 'whoosh': (280, 2400), 'swish': (1800, 7000)}[kind]
        e = np.sin(np.pi * np.clip(x / d, 0, 1)) ** 2 * np.exp(-x / (d * .9))
        return sweep(n, f0 * j, f1 * j, .45, r) * e * {'swoosh': .2, 'whoosh': .34, 'swish': .14}[kind]
    if kind == 'ding': n = int(1.1 * SR); return bell(n, 1318.5 * j) * .16
    if kind == 'success': n = int(1.2 * SR); a = bell(n, 1046.5); b = np.zeros(n); o = int(.09 * SR); b[o:] = bell(n - o, 1568); return (a * .7 + b) * .12
    if kind == 'notify': n = int(.7 * SR); a = bell(n, 1318.5, ((1, 1, .25), (2, .3, .12))); b = np.zeros(n); o = int(.085 * SR); b[o:] = bell(n - o, 1975.5, ((1, 1, .3), (2, .25, .12))); return (a * .8 + b) * .13
    if kind == 'error':
        n = int(.32 * SR); x = np.arange(n) / SR; f = np.where(x < .13, 330, 247); s = np.tanh(2.2 * np.sin(2 * np.pi * np.cumsum(f) / SR)) * envf(n, .004, .12)
        return lp(s, .25) * .22
    if kind == 'type':
        n = int(.9 * SR); s = np.zeros(n); t0 = 0.0
        while t0 < .8:
            k = make('tick', 1 + int(r.integers(0, 3))) * (.5 + .5 * r.random()); i = int(t0 * SR); m = min(len(k), n - i); s[i:i + m] += k[:m]; t0 += .055 + r.random() * .06
        return s * .55
    if kind == 'impact':
        n = int(.9 * SR); x = np.arange(n) / SR; f = 95 * np.exp(-x / .08) + 46; sub = np.sin(2 * np.pi * np.cumsum(f) / SR) * envf(n, .002, .28)
        return (sub * .8 + lp(r.standard_normal(n), .05) * envf(n, .001, .05) * .5) * .5
    if kind == 'riser':
        n = int(1.1 * SR); x = np.arange(n) / SR; e = (x / x[-1]) ** 2.2 * np.minimum(1, (x[-1] - x) / .03)
        return (sweep(n, 400, 5200, .5, r) * .7 + np.sin(2 * np.pi * np.cumsum(220 + 660 * (x / x[-1]) ** 2) / SR) * .12) * e * .22
    return np.zeros(10)
CACHE = {}
def sfx(kind, v):
    if (kind, v) not in CACHE: CACHE[(kind, v)] = make(kind, v)
    return CACHE[(kind, v)]
S = np.zeros(N, np.float32)
try: cues = json.load(open(os.path.join(EP, 'cues.json')))
except Exception: cues = []
cues = sorted(cues, key=lambda c: c['t']); last = {}; placed = []
for ci, c in enumerate(cues):
    kind = c['type']
    if kind in ('tick', 'pop', 'click') and c['t'] - last.get(kind, -9) < .07: continue  # de-flam near-duplicates
    near = [x for x in placed if c['t'] - x < .15] if kind != 'riser' else []
    if len(near) >= 2: continue  # a cut with three things landing at once: two sounds are plenty
    duck = .45 if near else 1; placed.append(c['t'])
    last[kind] = c['t']; s = sfx(kind, 1 + ci % 3)
    if kind == 'riser': i = int((c['t'] - len(s) / SR) * SR)  # risers END on their cue
    else: i = int(c['t'] * SR)
    if i < 0: s = s[-i:]; i = 0
    n = min(len(s), N - i)
    if n > 0: S[i:i + n] += s[:n] * min(1, c.get('gain', 1)) * duck
mix = music + nar[:, None] + S[:, None] * .35
print('voice/music dB during speech', round(20 * np.log10(rms(nar[act]) / (rms(music.mean(1)[act]) + 1e-12)), 1))
mix = mix / np.abs(mix).max() * .95
with wave.open(os.path.join(EP, 'mix.wav'), 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix * 32767).astype('<i2').tobytes())
print('mix ok', round(TOT, 2))
