# The front door for any agent (Claude, Codex, Cursor, Gemini, Copilot …) or person: one command that knows the workflow.
#   python tools/ts.py guide                    the whole workflow (docs/PLAYBOOK.md)
#   python tools/ts.py new <name> [--format vertical|landscape|square|portrait] [--title "…"]   start an episode from a template
#   python tools/ts.py next <episode>           where this episode stands and the exact next command (run it, fix what it lists, repeat)
#   python tools/ts.py status                   every episode and its stage
#   python tools/ts.py doctor                   is this machine ready (node, Chrome, ffmpeg, voice envs, config, skill copies)
#   python tools/ts.py install-skill            copy the agent skill to ~/.agents/skills and ~/.claude/skills (use it from any folder)
# The heavy lifting stays in make.py / batch.py / cutdown.py; ts only reads state and says what to do.
import sys as _s; _s.stdout.reconfigure(encoding="utf-8", errors="replace")
import os, sys, json, glob, re, shutil, subprocess, argparse
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from kitcfg import KIT, cfg
PY = sys.executable; EPS = os.path.join(KIT, 'episodes')
rel = lambda p: os.path.relpath(p, KIT).replace('\\', '/')
mt = lambda p: os.path.getmtime(p) if os.path.exists(p) else 0
def load(p, d=None):
    try: return json.load(open(p, encoding='utf8'))
    except Exception: return d
def has_voice(ep): d = os.path.join(ep, 'tts'); return os.path.isdir(d) and any(f.endswith('.json') and not f.endswith('.edge.json') for f in os.listdir(d))
def resolve(name):
    for c in (name, os.path.join(EPS, name), os.path.join(KIT, name)):
        if os.path.isdir(c) and os.path.exists(os.path.join(c, 'script.json')): return os.path.abspath(c)
    sys.exit(f'no episode "{name}" (looked for episodes/{name}/script.json)')

def state(ep):
    """-> (stage, next_command, [issues], [advice]) — the first unmet gate wins"""
    S = load(os.path.join(ep, 'script.json'), {}); M = S.get('meta', {}); r = rel(ep); issues, advice = [], []
    script, sheet = os.path.join(ep, 'script.json'), os.path.join(ep, 'sheet.jpg')
    if not S.get('scenes'): return 'empty', f'write the scenes in {r}/script.json (docs/AGENT.md §2-§4)', [], []
    if mt(script) > mt(sheet) or not os.path.exists(os.path.join(ep, 'lint.json')):
        return 'draft', f'python tools/make.py {r} draft', [], ['script changed since the last draft' if os.path.exists(sheet) else 'no draft yet']
    lint = load(os.path.join(ep, 'lint.json'), []) or []
    issues += [f'lint {x.get("scene")} {x.get("kind")}: {x.get("what")}' for x in lint]
    issues += [f'QA {x.get("scene")} {x.get("kind")}: "{x.get("txt", x.get("what", ""))}"' + (f' (contrast {x["cr"]})' if 'cr' in x else '') for x in (load(os.path.join(ep, 'qa.json'), []) or []) if x.get('kind') != 'landscape-only' or M.get('format', 'landscape') == 'vertical']
    v = subprocess.run([PY, os.path.join(KIT, 'tools', 'variety.py'), ep], capture_output=True, text=True, encoding='utf8', errors='replace').stdout
    issues += [l for l in v.splitlines() if l.startswith('FAIL')]; advice += [l for l in v.splitlines() if l.startswith('WARN')]
    if issues: return 'fix-draft', f'fix {r}/script.json, then: python tools/make.py {r} draft', issues, advice + [f'look at {r}/sheet.jpg (two stills per scene) for what checks cannot see: crowding, empty halves, weak hierarchy']
    pb = M.get('publish', {})
    if not pb.get('title') or not pb.get('description'):
        return 'publish-copy', f'add "publish": {{"title", "description", "tags", "hashtags"}} to meta in {r}/script.json', [], [f'look at {r}/sheet.jpg once more before spending voice time']
    if not has_voice(ep): return 'voice', f'python tools/make.py {r} voice   (or "all" for voice + final)', [], []
    mp4 = (sorted(glob.glob(os.path.join(ep, '*_final.mp4'))) or [None])[-1]; F = load(os.path.join(ep, 'final.json'), {}) or {}
    from make import video_hash
    fresh = bool(mp4) and (F.get('video_hash') == video_hash(ep) if F.get('video_hash') else mt(mp4) >= mt(script))  # copy-only edits don't count
    if not fresh: return 'final', f'python tools/make.py {r} final' + (' --fresh' if os.path.isdir(os.path.join(ep, 'frames_final')) else ''), [], ['the final MP4 is older than the script' if mp4 else 'no final MP4 yet']
    rep = open(os.path.join(ep, 'review', 'report.txt'), encoding='utf8').read() if os.path.exists(os.path.join(ep, 'review', 'report.txt')) else ''
    if not rep: return 'review', f'python tools/review.py {r}', [], []
    m = re.search(r'held frames >= 4 s \(nothing moves\): (\d+)', rep); b = re.search(r'blank frames: (\d+)', rep); lu = re.search(r'integrated (-?[\d.]+) LUFS', rep); pk = re.search(r'true peak (-?[\d.]+) dBFS', rep); si = re.search(r'silences > 1.2 s: (\d+)', rep)
    if m and int(m.group(1)): issues.append(f'review: {m.group(1)} stretch(es) of ≥ 4 s where nothing moves — add beats (see {r}/review/report.txt)')
    if b and int(b.group(1)): issues.append(f'review: {b.group(1)} blank frame(s)')
    if lu and abs(float(lu.group(1)) + 14) > 1: issues.append(f'review: loudness {lu.group(1)} LUFS (target -14)')
    if pk and float(pk.group(1)) > -1: issues.append(f'review: true peak {pk.group(1)} dBFS (keep ≤ -1)')
    if si and int(si.group(1)): issues.append(f'review: {si.group(1)} silence(s) over 1.2 s')
    if issues: return 'fix-final', f'fix {r}/script.json, then: python tools/make.py {r} final --fresh', issues, [f'frames around every cut: {r}/review/cuts-*.jpg']
    P = load(os.path.join(ep, 'publish.json'), {}) or {}
    if P.get('warnings'): return 'publish', f'python tools/publish.py {r}   (after fixing meta.publish)', P['warnings'], []
    thumbs = P.get('thumbnails') or []
    return 'done', 'upload', [], [f'video: {r}/{P.get("video")}', f'pick a thumbnail: {", ".join(thumbs)} (side by side: {r}/thumbs.jpg)', f'captions: {r}/captions.srt', f'copy: {r}/publish.md', 'commit or push only if the user asks']

def cmd_next(a):
    ep = resolve(a.episode); st, nxt, issues, advice = state(ep)
    print(f'{rel(ep)}: {st}')
    for i in issues: print('  ✗', i)
    for x in advice: print('  ·', x)
    print('NEXT:', nxt)
def cmd_status(a):
    rows = []
    for d in sorted(glob.glob(os.path.join(EPS, '*', 'script.json'))):
        ep = os.path.dirname(d)
        if os.path.basename(ep).startswith('_') and not a.all: continue
        M = (load(d, {}) or {}).get('meta', {}); st, nxt, iss, _ = state(ep)
        rows.append((os.path.basename(ep), M.get('format', 'landscape'), M.get('look', '-'), M.get('status', '-'), st + (f' ({len(iss)})' if iss else ''), nxt))
    w = [max(len(str(r[i])) for r in rows + [('episode', 'format', 'look', 'status', 'stage', '')]) for i in range(5)]
    print('  '.join(h.ljust(w[i]) for i, h in enumerate(('episode', 'format', 'look', 'status', 'stage'))) + '  next')
    for r in rows: print('  '.join(str(r[i]).ljust(w[i]) for i in range(5)) + '  ' + r[5])
def cmd_new(a):
    name = re.sub(r'[^a-z0-9-]+', '-', a.name.lower()).strip('-'); ep = os.path.join(EPS, name)
    if os.path.exists(os.path.join(ep, 'script.json')): sys.exit(f'episodes/{name} already exists')
    tall = a.format in ('vertical', 'short'); src = os.path.join(EPS, '_template-short' if tall else '_template')
    shutil.copytree(src, ep, dirs_exist_ok=True)
    p = os.path.join(ep, 'script.json'); s = open(p, encoding='utf8').read()
    S = json.loads(s); S['meta']['title'] = a.title or name.replace('-', ' ').title(); S['meta']['format'] = 'vertical' if tall else a.format; S['meta']['status'] = 'draft'
    json.dump(S, open(p, 'w', encoding='utf8'), ensure_ascii=False, indent=1)
    print(f'episodes/{name}: {S["meta"]["format"]} episode from {os.path.basename(src)} — the placeholders [in brackets] are yours to replace')
    print(f'NEXT: research the topic, then rewrite episodes/{name}/script.json (docs/AGENT.md), then: python tools/ts.py next {name}')
def cmd_guide(a): print(open(os.path.join(KIT, 'docs', 'PLAYBOOK.md'), encoding='utf8').read())
def cmd_doctor(a):
    ok = True
    def chk(label, good, hint=''):
        nonlocal ok; ok &= bool(good); print(('  ok  ' if good else '  ✗   ') + label + ('' if good else f'  -> {hint}'))
    chk('node', shutil.which('node'), 'install Node.js 20+'); chk('node_modules/puppeteer-core', os.path.isdir(os.path.join(KIT, 'node_modules', 'puppeteer-core')), 'npm install')
    chk(f'chrome {cfg("chrome")}', os.path.exists(cfg('chrome') or ''), 'set "chrome" in kit.config.json')
    try: import imageio_ffmpeg, numpy, scipy, PIL; chk('python deps (imageio-ffmpeg, numpy, scipy, Pillow)', True)
    except Exception as e: chk('python deps', False, f'pip install -r requirements: {e}')
    chk('kit.config.json', os.path.exists(os.path.join(KIT, 'kit.config.json')), 'copy kit.config.example.json and fill it in')
    C = cfg()
    for k in ('tts_python', 'tts_repo', 'voice_ref', 'align_python'): chk(f'{k} = {C[k] or "(not set)"}', C[k] and os.path.exists(C[k]), 'needed for the final voice; drafts work without it')
    chk('music library (assets/bgm/gen)', glob.glob(os.path.join(KIT, 'assets', 'bgm', 'gen', '*.wav')), 'python tools/bgm.py  (built on demand otherwise)')
    a_, c_ = os.path.join(KIT, '.agents', 'skills', 'truesight-video', 'SKILL.md'), os.path.join(KIT, '.claude', 'skills', 'truesight-video', 'SKILL.md')
    chk('skill copies identical (.agents / .claude)', os.path.exists(a_) and os.path.exists(c_) and open(a_, 'rb').read() == open(c_, 'rb').read(), 'python tools/ts.py sync-skill')
    print('ready' if ok else 'fix the ✗ lines (drafts need only node, Chrome and the python deps)')
def cmd_sync(a):
    src = os.path.join(KIT, '.agents', 'skills', 'truesight-video'); dst = os.path.join(KIT, '.claude', 'skills', 'truesight-video')
    shutil.copytree(src, dst, dirs_exist_ok=True); print('copied', rel(src), '->', rel(dst))
def cmd_install(a):
    src = os.path.join(KIT, '.agents', 'skills', 'truesight-video'); home = os.path.expanduser('~')
    for base in ('.agents', '.claude'):
        dst = os.path.join(home, base, 'skills', 'truesight-video'); os.makedirs(os.path.dirname(dst), exist_ok=True)
        shutil.copytree(src, dst, dirs_exist_ok=True)
        p = os.path.join(dst, 'SKILL.md'); s = open(p, encoding='utf8').read()
        s = s.replace('{{KIT}}', KIT); open(p, 'w', encoding='utf8').write(s); print('installed', dst)
def main():
    p = argparse.ArgumentParser(description='TrueSight kit front door'); sp = p.add_subparsers(dest='cmd', required=True)
    sp.add_parser('guide'); sp.add_parser('status').add_argument('--all', action='store_true')
    n = sp.add_parser('next'); n.add_argument('episode')
    w = sp.add_parser('new'); w.add_argument('name'); w.add_argument('--format', default='landscape', choices=['landscape', 'vertical', 'short', 'square', 'portrait']); w.add_argument('--title')
    sp.add_parser('doctor'); sp.add_parser('sync-skill'); sp.add_parser('install-skill')
    a = p.parse_args()
    {'guide': cmd_guide, 'status': cmd_status, 'next': cmd_next, 'new': cmd_new, 'doctor': cmd_doctor, 'sync-skill': cmd_sync, 'install-skill': cmd_install}[a.cmd](a)
if __name__ == '__main__': main()
