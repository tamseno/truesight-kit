// TrueSight Motion Kit renderer — deterministic seek(t) -> screenshot -> numbered JPG.
// node tools/render.mjs ep=episodes/<name> [workers=24] [sub=1] [out=<ep>/frames] [q=92] [from=0] [to=T] [resume=1]
//   stills:  scenes=s01,s02 [at=.3,.6,.92]      every scene:  scenes=all
//   frames:  frames=0,60,120
//   qa:      qa=1  (with scenes=...) prints text < 22px or off-frame per still
//   serve:   serve=1  -> open http://127.0.0.1:<port>/?t=12.5 in Chrome to scrub by hand
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path'; import puppeteer from 'puppeteer-core';
const A = Object.fromEntries(process.argv.slice(2).map(a => a.split('=')));
const KIT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const EP = path.resolve(KIT, A.ep || 'episodes/_template'), CORE = path.join(KIT, 'core');
const FPS = 60, WK = +(A.workers || 24), SUB = +(A.sub || 1), OUT = path.resolve(EP, A.out || 'frames'), Q = +(A.q || 92), PORT = +(A.port || 8940 + Math.floor(Math.random() * 50));
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.mp4': 'video/mp4' };
const ls = d => fs.existsSync(d) ? fs.readdirSync(d).filter(f => f.endsWith('.js')).sort() : [];
const srv = http.createServer((q, r) => {
  const u = decodeURIComponent(q.url.split('?')[0]);
  if (u === '/') {
    const ar = ls(path.join(CORE, 'archetypes')), sc = ls(path.join(EP, 'scenes'));
    r.writeHead(200, { 'content-type': 'text/html', 'cache-control': 'no-store' });
    return r.end(`<!doctype html><meta charset="utf-8"><link rel="icon" href="data:,"><link rel="stylesheet" href="core/style.css"><div id="stage"></div><script src="core/engine.js"></script>`
      + ar.map(f => `<script src="core/archetypes/${f}"></script>`).join('') + sc.map(f => `<script src="scenes/${f}"></script>`).join('')
      + `<script>addEventListener('load',()=>{const q=new URLSearchParams(location.search);if(q.has('t')){const t=+q.get('t');{const go=()=>window.READY?renderAt(t):setTimeout(go,100);go();}}})</script>`);
  }
  const cands = u.startsWith('/core/') ? [path.join(KIT, u)] : [path.join(EP, u), path.join(KIT, u)]; // brand.json falls back to kit root
  const f = cands.find(p => fs.existsSync(p) && fs.statSync(p).isFile());
  if (!f) { r.writeHead(404); return r.end(); }
  r.writeHead(200, { 'content-type': MIME[path.extname(f)] || 'application/octet-stream', 'cache-control': 'no-store' }); fs.createReadStream(f).pipe(r);
});
await new Promise(r => srv.listen(PORT, '127.0.0.1', r));
if (A.serve) { console.log(`serving ${EP} at http://127.0.0.1:${PORT}/?t=0`); await new Promise(() => { }); }
const TL = JSON.parse(fs.readFileSync(path.join(EP, 'timeline.json'), 'utf8'));
let jobs = [];
if (A.scenes) {
  const ids = A.scenes === 'all' ? TL.scenes.map(s => s.id) : A.scenes.split(',');
  for (const id of ids) { const s = TL.scenes.find(x => x.id === id); if (!s) { console.log('no scene', id); continue; } for (const k of (A.at ? A.at.split(',').map(Number) : [.3, .6, .92])) jobs.push([`${id}_${String(Math.round(k * 100)).padStart(2, '0')}`, s.start + s.dur * k]); }
} else if (A.frames) jobs = A.frames.split(',').map(Number).map(f => [`f${String(f).padStart(5, '0')}`, f / FPS]);
else { const f0 = Math.round((+A.from || 0) * FPS), f1 = Math.round((A.to ? +A.to : TL.total) * FPS); for (let f = f0; f < f1; f++) for (let k = 0; k < SUB; k++) jobs.push([`f${String(f * SUB + k).padStart(6, '0')}`, f / FPS + (SUB > 1 ? k / (FPS * SUB) * .5 : 0)]); }
fs.mkdirSync(OUT, { recursive: true });
const per = Math.ceil(jobs.length / WK), chunks = [...Array(WK)].map((_, i) => jobs.slice(i * per, (i + 1) * per)).filter(c => c.length);
const exe = A.chrome || 'C:/Program Files/Google/Chrome/Application/chrome.exe'; let done = 0; const t0 = Date.now(); let cues = null; const QA = [];
await Promise.all(chunks.map(async (list, w) => {
  const b = await puppeteer.launch({ executablePath: exe, headless: true, defaultViewport: { width: 1920, height: 1080, deviceScaleFactor: 1 }, args: ['--force-device-scale-factor=1', '--enable-gpu-rasterization', '--ignore-gpu-blocklist', '--use-angle=d3d11', '--disable-background-timer-throttling', '--disable-renderer-backgrounding', '--hide-scrollbars', '--mute-audio', '--font-render-hinting=none', `--user-data-dir=D:/hark/_sys/tmp/a07f-kit-chrome-${A.tag || 'main'}-${w}`] });
  const pg = await b.newPage(); pg.on('pageerror', e => console.log('PAGEERR', e.message)); pg.on('console', m => { if (['error', 'warning', 'warn'].includes(m.type())) console.log('CONSOLE', m.text()); });
  await pg.goto(`http://127.0.0.1:${PORT}/`); await pg.waitForFunction('window.READY===true||window.ERR', { timeout: 120000 });
  const err = await pg.evaluate('window.ERR'); if (err) { console.log('ERR', err); process.exit(3); }
  await pg.evaluate('document.fonts.ready'); if (w === 0) cues = await pg.evaluate('window.CUES');
  const cdp = await pg.createCDPSession();
  for (const [name, T] of list) {
    const fp = path.join(OUT, `${name}.jpg`);
    if (A.resume && fs.existsSync(fp) && fs.statSync(fp).size > 20000) { done++; continue; }
    await pg.evaluate(t => window.renderAt(t), T);
    if (A.qa) for (const x of await pg.evaluate('window.QA()')) QA.push({ still: name, ...x });
    const { data } = await cdp.send('Page.captureScreenshot', { format: 'jpeg', quality: Q, clip: { x: 0, y: 0, width: 1920, height: 1080, scale: 1 }, optimizeForSpeed: true });
    fs.writeFileSync(fp, Buffer.from(data, 'base64'));
    if (++done % 1200 === 0) console.log(`${done}/${jobs.length} ${((Date.now() - t0) / 1000).toFixed(1)}s`);
  }
  await b.close();
}));
if (cues && !A.scenes && !A.frames) fs.writeFileSync(path.join(EP, 'cues.json'), JSON.stringify(cues));
if (A.qa) { const by = {}; for (const x of QA) { const k = `${x.scene} ${x.kind} ${x.txt}`; by[k] = by[k] || x; } const L = Object.values(by); fs.writeFileSync(path.join(EP, 'qa.json'), JSON.stringify(L, null, 1)); console.log(`QA ${L.length} issues (qa.json)`); for (const x of L.slice(0, 60)) console.log(' ', x.scene, x.kind, x.fs ? x.fs + 'px' : '', JSON.stringify(x.txt)); }
console.log(`DONE ${done} in ${((Date.now() - t0) / 1000).toFixed(1)}s`); srv.close(); process.exit(0);
