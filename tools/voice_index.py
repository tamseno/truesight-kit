# Final voice: IndexTTS-2.5 clone, one wav per narration line -> <ep>/tts/<key>.wav  (cached by text hash)
#   <tts_python> tools\voice_index.py episodes\<name> [ref.wav] [s03 s04_1 ...]     (paths: kit.config.json, see tools/kitcfg.py)
# Then: tools\make.ps1 -Ep episodes\<name> -Stage final   (word timings: <key>.json if an aligner wrote one, else length-weighted)
import json, os, sys, hashlib, time, re
from kitcfg import cfg
EP = os.path.abspath(sys.argv[1]); REF = sys.argv[2] if len(sys.argv) > 2 and sys.argv[2].endswith('.wav') else cfg('voice_ref')
only = set(a for a in sys.argv[2:] if not a.endswith('.wav'))
S = json.load(open(os.path.join(EP, 'script.json'), encoding='utf8')); SAY = S.get('meta', {}).get('say', {})
out = os.path.join(EP, 'tts'); os.makedirs(out, exist_ok=True)
sys.path.insert(0, cfg('tts_repo')); os.chdir(cfg('tts_repo'))
from indextts.infer_v2_5 import IndexTTS2
tts = IndexTTS2(cfg_path='checkpoints/config.yaml', model_dir='checkpoints', use_bf16=True)
t0 = time.time(); n = 0
for s in S['scenes']:
    for i, text in enumerate(s['lines']):
        key = f"{s['id']}_{i}"
        if only and s['id'] not in only and key not in only: continue
        spoken = text
        for k, v in SAY.items(): spoken = re.sub(r'\b' + re.escape(k) + r'\b', v, spoken)
        h = hashlib.md5((spoken + '|' + REF).encode()).hexdigest()[:10]; wav = os.path.join(out, key + '.wav'); tag = os.path.join(out, key + '.hash')
        if os.path.exists(wav) and os.path.exists(tag) and open(tag).read() == h: continue
        tts.infer(spk_audio_prompt=REF, text=spoken, lang='EN', output_path=wav, verbose=False, interval_silence=180, max_text_tokens_per_segment=120)
        open(tag, 'w').write(h); jp = os.path.join(out, key + '.json')
        if os.path.exists(jp): os.remove(jp)  # stale edge timings
        n += 1; print(key, round(time.time() - t0, 1), flush=True)
print('voice done', n, 'lines', round(time.time() - t0, 1), 's')
