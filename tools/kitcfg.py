# Machine settings for the kit, in one place: kit.config.json at the repo root (not committed; copy kit.config.example.json).
# Every tool reads it through cfg(); an environment variable TS_<KEY> (upper case) overrides the file. Keys a stage needs but
# nobody set (the voice and alignment envs) make that stage stop with a message naming the key — nothing machine-specific
# lives in the code, so the repo works on any machine once its own kit.config.json exists.
import json, os, sys, shutil
KIT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
_win = sys.platform.startswith('win')
DEFAULTS = {
    'python': os.path.join(KIT, '.venv', 'Scripts' if _win else 'bin', 'python.exe' if _win else 'python'),  # kit venv (numpy, scipy, PIL, edge-tts, imageio-ffmpeg)
    'tts_python': '',      # IndexTTS-2.5 venv python (final voice)
    'tts_repo': '',        # IndexTTS checkout (checkpoints/ inside)
    'voice_ref': '',       # the channel voice to clone (wav)
    'align_python': '',    # python with faster-whisper + CUDA (word timings)
    'whisper_model': 'large-v3',  # local model folder or a faster-whisper model name
    'proxy': '',           # edge-tts drafts go through it if set, e.g. http://127.0.0.1:10808
    'workers': 12,         # parallel Chrome pages when rendering
    'bgm_dir': os.path.join(KIT, 'assets', 'bgm'),
    'chrome': (r'C:\Program Files\Google\Chrome\Application\chrome.exe' if _win else shutil.which('google-chrome') or shutil.which('chromium') or '/usr/bin/google-chrome'),
}
NEEDED = {'tts_python': 'final voice', 'tts_repo': 'final voice', 'voice_ref': 'final voice', 'align_python': 'word timings'}
_cache = None
def cfg(key=None):
    global _cache
    if _cache is None:
        c = dict(DEFAULTS); p = os.path.join(KIT, 'kit.config.json')
        if os.path.exists(p): c.update({k: v for k, v in json.load(open(p, encoding='utf8')).items() if not k.startswith('_')})
        for k in list(c): c[k] = os.environ.get('TS_' + k.upper(), c[k])
        _cache = c
    if key is None: return _cache
    v = _cache[key]
    if key in NEEDED and not v: raise SystemExit(f'kit.config.json: set "{key}" ({NEEDED[key]}) — see kit.config.example.json')
    return v
if __name__ == '__main__':  # python tools/kitcfg.py  -> the effective settings and whether each path exists
    for k, v in cfg().items():
        ok = '' if not isinstance(v, str) or not v or not (v[1:3] == ':\\' or v.startswith('/')) else ('ok' if os.path.exists(v) else 'MISSING')
        print(f'{k:14} {v or "(not set)"}  {ok}')
