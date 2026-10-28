# Machine settings for the kit, in one place: kit.config.json at the repo root (not committed; copy kit.config.example.json).
# Every tool reads it through cfg(); a missing file or key falls back to this machine's defaults below, and an environment
# variable TS_<KEY> (upper case) overrides both — so a second machine or a cloud box only needs its own kit.config.json.
import json, os
KIT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DEFAULTS = {
    'python': os.path.join(KIT, '.venv', 'Scripts', 'python.exe'),          # kit venv (numpy, scipy, PIL, edge-tts, imageio-ffmpeg)
    'tts_python': r'D:\hark\indextts\.venv\Scripts\python.exe',            # IndexTTS-2.5 venv
    'tts_repo': r'D:\hark\indextts',                                        # IndexTTS checkout (checkpoints/ inside)
    'voice_ref': r'D:\backup\TrueSight_Voice_master_v2.wav',               # the channel voice to clone
    'align_python': r'D:\hark\_sys\work\mainchat-bili-ref\.venv\Scripts\python.exe',  # faster-whisper + CUDA venv
    'whisper_model': r'D:\hark\_sys\tmp\cache\models\faster-whisper-large-v3',
    'proxy': 'http://127.0.0.1:10808',                                      # edge-tts drafts go through it ('' = direct)
    'workers': 24,                                                          # parallel Chrome pages when rendering
    'bgm_dir': os.path.join(KIT, 'assets', 'bgm'),
    'chrome': r'C:\Program Files\Google\Chrome\Application\chrome.exe',
}
_cache = None
def cfg(key=None):
    global _cache
    if _cache is None:
        c = dict(DEFAULTS); p = os.path.join(KIT, 'kit.config.json')
        if os.path.exists(p): c.update({k: v for k, v in json.load(open(p, encoding='utf8')).items() if not k.startswith('_')})
        for k in list(c): c[k] = os.environ.get('TS_' + k.upper(), c[k])
        _cache = c
    return _cache if key is None else _cache[key]
if __name__ == '__main__':  # python tools/kitcfg.py  -> print the effective settings and whether each path exists
    for k, v in cfg().items():
        ok = '' if not isinstance(v, str) or not (v[1:3] == ':\\' or v.startswith('/')) else ('ok' if os.path.exists(v) else 'MISSING')
        print(f'{k:14} {v}  {ok}')
