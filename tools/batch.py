# Many videos, one command: runs tools/make.py over a list of episodes and keeps going when one fails.
#   python tools/batch.py final episodes/a episodes/b ...      the stage for each episode, in order
#   python tools/batch.py all --ready                           every episode whose script says "meta": {"status": "ready"}
#   python tools/batch.py all --ready --pipeline                voice of the next episode runs while the current one renders
#                                                               (GPU voice + CPU render overlap: ~1.5x throughput on long queues)
# Options are passed on to make.py: --quiet --fresh --force --codec ...
# Each finished episode gets <ep>/status.json ({stage, ok, output, minutes, at}); --ready skips episodes already done
# (status.json ok for that stage) unless --redo. A log of the whole run goes to queue/batch-<time>.log.
import sys as _s; _s.stdout.reconfigure(encoding="utf-8", errors="replace")
import os, sys, json, time, glob, subprocess, threading, argparse, datetime
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from kitcfg import KIT
PY = sys.executable
def status(ep):
    p = os.path.join(ep, 'status.json')
    try: return json.load(open(p, encoding='utf8'))
    except Exception: return {}
def ready_eps(stage, redo):
    out = []
    for d in sorted(glob.glob(os.path.join(KIT, 'episodes', '*', 'script.json'))):
        ep = os.path.dirname(d)
        if os.path.basename(ep).startswith('_'): continue
        meta = json.load(open(d, encoding='utf8')).get('meta', {})
        if meta.get('status') != 'ready': continue
        st = status(ep)
        if not redo and st.get('ok') and st.get('stage') in (stage, 'all'): continue
        out.append(ep)
    return out
LOCK = threading.Lock()
def make(ep, stage, extra, log):
    t = time.time(); cmd = [PY, os.path.join(KIT, 'tools', 'make.py'), ep, stage, *extra]
    with LOCK: print(f'[{datetime.datetime.now():%H:%M:%S}] start {stage:7} {os.path.basename(ep)}', flush=True)
    r = subprocess.run(cmd, cwd=KIT, capture_output=True, text=True, encoding='utf8', errors='replace')
    tail = (r.stdout + r.stderr).strip().splitlines(); out = next((l.split('-> ', 1)[1] for l in reversed(tail) if l.startswith('DONE') and '-> ' in l), None)
    ok = r.returncode == 0; mins = round((time.time() - t) / 60, 1)
    with LOCK:
        log.write(f'\n===== {stage} {ep} ({"ok" if ok else "FAILED"}, {mins} min)\n' + (r.stdout + r.stderr)); log.flush()
        print(f'[{datetime.datetime.now():%H:%M:%S}] {"done" if ok else "FAIL"}  {stage:7} {os.path.basename(ep)}  {mins} min' + ('' if ok else '  -> ' + (tail[-1] if tail else '?')), flush=True)
    if stage != 'voice': json.dump({'stage': stage, 'ok': ok, 'output': out, 'minutes': mins, 'at': datetime.datetime.now().isoformat(timespec='seconds')}, open(os.path.join(ep, 'status.json'), 'w', encoding='utf8'), indent=1)
    return ok, mins, out
def main():
    p = argparse.ArgumentParser(); p.add_argument('stage', choices=['draft', 'preview', 'voice', 'final', 'all']); p.add_argument('eps', nargs='*')
    p.add_argument('--ready', action='store_true'); p.add_argument('--redo', action='store_true'); p.add_argument('--pipeline', action='store_true')
    a, extra = p.parse_known_args()
    eps = [os.path.abspath(e) for e in a.eps] + (ready_eps(a.stage, a.redo) if a.ready else [])
    if not eps: print('nothing to do (list episodes, or mark scripts "meta": {"status": "ready"} and use --ready)'); return 0
    os.makedirs(os.path.join(KIT, 'queue'), exist_ok=True)
    log = open(os.path.join(KIT, 'queue', f'batch-{datetime.datetime.now():%Y%m%d-%H%M%S}.log'), 'w', encoding='utf8')
    print(f'{len(eps)} episode(s), stage {a.stage}' + (' (pipelined)' if a.pipeline and a.stage == 'all' else '')); res = {}
    if a.pipeline and a.stage == 'all':
        voiced = {ep: threading.Event() for ep in eps}; vok = {}
        def voice_lane():
            for ep in eps: vok[ep] = make(ep, 'voice', extra, log)[0]; voiced[ep].set()
        th = threading.Thread(target=voice_lane); th.start()
        for ep in eps:
            voiced[ep].wait(); res[ep] = make(ep, 'final', extra, log) if vok[ep] else (False, 0, None)
        th.join()
    else:
        for ep in eps: res[ep] = make(ep, a.stage, extra, log)
    print('\nepisode'.ljust(34) + 'result  minutes  output')
    for ep, (ok, mins, out) in res.items(): print(f'{os.path.basename(ep):33} {"ok  " if ok else "FAIL"}   {mins:6}  {out or ""}')
    print('log:', log.name); return 0 if all(r[0] for r in res.values()) else 1
if __name__ == '__main__': sys.exit(main())
