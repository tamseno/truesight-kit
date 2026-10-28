// Screenshot a web page for a video (real product pages, docs, dashboards) with the kit's Chrome.
//   node tools/shot.mjs url=https://example.com out=episodes/<name>/media/page.png
//     w=1440 h=900       viewport (CSS px); scale=2 for crisp text (default 2)
//     full=1             the whole scrolling page (pair with the image element's "pan" to scroll through it)
//     phone=1            390x844 mobile viewport with a mobile user agent
//     dark=1             prefers-color-scheme: dark
//     wait=1500          extra ms after load (animations, lazy images)
//     hide=".cookie,#banner"   CSS selectors to hide before the shot (cookie bars, chat widgets)
//     el="main article"  crop to one element
// Only capture pages you are allowed to show; logged-in pages use a fresh profile (you are not signed in).
import fs from 'node:fs'; import path from 'node:path'; import puppeteer from 'puppeteer-core';
const A = Object.fromEntries(process.argv.slice(2).map(a => { const i = a.indexOf('='); return i < 0 ? [a, '1'] : [a.slice(0, i), a.slice(i + 1)]; }));
if (!A.url || !A.out) { console.log('usage: node tools/shot.mjs url=<https://…> out=<file.png> [w= h= scale= full=1 phone=1 dark=1 wait= hide= el=]'); process.exit(2); }
const KIT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const KC = (() => { try { return JSON.parse(fs.readFileSync(path.join(KIT, 'kit.config.json'), 'utf8')); } catch { return {}; } })();
const exe = A.chrome || process.env.TS_CHROME || KC.chrome || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const phone = A.phone === '1', W = +(A.w || (phone ? 390 : 1440)), H = +(A.h || (phone ? 844 : 900)), S = +(A.scale || (phone ? 3 : 2));
const b = await puppeteer.launch({ executablePath: exe, headless: true, args: ['--hide-scrollbars', '--no-first-run', '--no-default-browser-check'] });
try {
  const pg = await b.newPage();
  await pg.setViewport({ width: W, height: H, deviceScaleFactor: S, isMobile: phone, hasTouch: phone });
  if (phone) await pg.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1');
  if (A.dark === '1') await pg.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'dark' }]);
  await pg.goto(A.url, { waitUntil: 'networkidle2', timeout: 60000 });
  if (A.hide) await pg.addStyleTag({ content: `${A.hide}{display:none!important}` });
  if (A.full === '1') await pg.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 120)); } window.scrollTo(0, 0); });
  await new Promise(r => setTimeout(r, +(A.wait || 1200)));
  fs.mkdirSync(path.dirname(path.resolve(A.out)), { recursive: true });
  if (A.el) { const h = await pg.$(A.el); if (!h) throw new Error(`no element matches ${A.el}`); await h.screenshot({ path: A.out }); }
  else await pg.screenshot({ path: A.out, fullPage: A.full === '1' });
  const st = fs.statSync(A.out); console.log(`saved ${A.out} (${(st.size / 1024).toFixed(0)} KB, viewport ${W}x${H} @${S}x${A.full === '1' ? ', full page' : ''})`);
} finally { await b.close(); }
