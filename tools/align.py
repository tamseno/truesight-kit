# Word timings for the final voice: faster-whisper (large-v3, CUDA) over every <ep>/tts/<key>.wav -> <key>.json
# timeline.py (index mode) maps these onto the script words, so subtitles and "at" cues land on the real voice.
#   <python with faster-whisper> tools\align.py episodes\<name> [--force]
# Env used on this machine: D:\hark\_sys\work\mainchat-bili-ref\.venv\Scripts\python.exe
import os, sys, json, re, difflib, subprocess, numpy as np
try:
    import nvidia.cublas, nvidia.cudnn  # CUDA DLLs shipped as pip wheels
    for m in (nvidia.cublas, nvidia.cudnn):
        for p in m.__path__:
            b = os.path.join(p, 'bin')
            if os.path.isdir(b): os.add_dll_directory(b); os.environ['PATH'] = b + os.pathsep + os.environ['PATH']
except Exception: pass
import imageio_ffmpeg
from faster_whisper import WhisperModel
EP = os.path.abspath(sys.argv[1]); FORCE = '--force' in sys.argv
MODEL = os.environ.get('WHISPER_MODEL', r'D:\hark\_sys\tmp\cache\models\faster-whisper-large-v3')
FF = imageio_ffmpeg.get_ffmpeg_exe(); TD = os.path.join(EP, 'tts')
S = json.load(open(os.path.join(EP, 'script.json'), encoding='utf8'))
def load16(p): return np.frombuffer(subprocess.run([FF, '-v', 'error', '-i', p, '-f', 'f32le', '-ac', '1', '-ar', '16000', '-'], capture_output=True).stdout, np.float32).copy()
norm = lambda z: re.sub(r'[^a-z0-9]', '', z.lower())
m = WhisperModel(MODEL, device='cuda', compute_type='float16'); n = 0; low = []
for s in S['scenes']:
    for i, text in enumerate(s['lines']):
        key = f"{s['id']}_{i}"; wav = os.path.join(TD, key + '.wav'); js = os.path.join(TD, key + '.json')
        if not os.path.exists(wav): print('missing', key); continue
        if not FORCE and os.path.exists(js) and os.path.getmtime(js) > os.path.getmtime(wav) and json.load(open(js, encoding='utf8')).get('src') == 'whisper': continue
        a = load16(wav); best = None
        for prompt in (None, text):  # plain pass first; the script as a prompt helps names but can make whisper skip a sentence
            segs, _ = m.transcribe(a, language='en', word_timestamps=True, beam_size=5, vad_filter=False, condition_on_previous_text=False, initial_prompt=prompt)
            ws = [[round(w.start, 3), round(w.end, 3), w.word.strip()] for sg in segs for w in (sg.words or [])]
            r = difflib.SequenceMatcher(None, norm(' '.join(w[2] for w in ws)), norm(text)).ratio()
            if best is None or r > best[0]: best = (r, ws)
            if r >= .9: break
        ratio, words = best
        if ratio < .8: low.append((key, round(ratio, 2)))
        json.dump({'text': text, 'src': 'whisper', 'match': round(ratio, 3), 'words': words}, open(js, 'w', encoding='utf8'), ensure_ascii=False); n += 1
        print(key, 'match', round(ratio, 2), flush=True)
print('aligned', n, 'lines'); print('LOW MATCH (re-synthesize these):', low) if low else None
