# narration + BGM (looped with crossfades, ducked to ~27 dB under the voice while speaking) + subtle SFX from cues.json -> <ep>/mix.wav
#   python tools/mix.py episodes/<name> [bgm.wav]
import json, wave, subprocess, sys, os, numpy as np, imageio_ffmpeg
from scipy.signal import lfilter
EP = os.path.abspath(sys.argv[1]); KIT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BGM = sys.argv[2] if len(sys.argv) > 2 else os.path.join(KIT, 'assets', 'bgm', 'digital_clouds.wav')
FF = imageio_ffmpeg.get_ffmpeg_exe(); SR = 48000
TL = json.load(open(os.path.join(EP, 'timeline.json'), encoding='utf8')); TOT = TL['total'] + 1.0; N = int(TOT * SR)
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
def lp(x, a): return lfilter([a], [1, -(1 - a)], x)
def envf(n, a, d): x = np.arange(n) / SR; return np.minimum(1, x / max(a, 1e-4)) * np.exp(-x / d)
def sfx(kind):
    if kind in ('pop', 'tick', 'click'):
        n = int(.06 * SR); x = np.arange(n) / SR; f = {'pop': 900, 'tick': 2200, 'click': 1600}[kind]; return np.sin(2 * np.pi * f * x) * envf(n, .0008, .012) * .25
    if kind in ('whoosh', 'swoosh'):
        d = .5 if kind == 'whoosh' else .32; n = int(d * SR); x = np.arange(n) / SR; s = lp(rng.standard_normal(n), .08); return s * np.sin(np.pi * x / d) ** 2 * (.22 if kind == 'whoosh' else .12)
    if kind == 'ding':
        n = int(.6 * SR); x = np.arange(n) / SR; return np.sin(2 * np.pi * 1318.5 * x) * envf(n, .002, .18) * .12
    return np.zeros(10)
S = np.zeros(N, np.float32)
try: cues = json.load(open(os.path.join(EP, 'cues.json')))
except Exception: cues = []
for c in cues:
    s = sfx(c['type']); i = int(c['t'] * SR); n = min(len(s), N - i)
    if n > 0: S[i:i + n] += s[:n] * min(1, c.get('gain', 1))
mix = music + nar[:, None] + S[:, None] * .35
print('voice/music dB during speech', round(20 * np.log10(rms(nar[act]) / (rms(music.mean(1)[act]) + 1e-12)), 1))
mix = mix / np.abs(mix).max() * .95
with wave.open(os.path.join(EP, 'mix.wav'), 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix * 32767).astype('<i2').tobytes())
print('mix ok', round(TOT, 2))
