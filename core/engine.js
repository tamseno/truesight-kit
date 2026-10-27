// TrueSight Motion Kit engine — deterministic DOM timeline. window.renderAt(T) paints the frame at T seconds.
// Scenes come from (1) episode scenes/<id>.js  (custom)  or  (2) core/archetypes/<type>.js  (data-driven, sc.type + sc.data).
(() => {
const W = 1920, H = 1080;
// ---------------------------------------------------------------- math
const cl = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const P = (t, a, b) => cl((t - a) / (b - a));
const lerp = (a, b, t) => a + (b - a) * t;
const E = {
  out: t => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t)),            // expo out
  in: t => (t <= 0 ? 0 : Math.pow(2, 10 * t - 10)),
  io: t => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  sine: t => -(Math.cos(Math.PI * t) - 1) / 2,
  quart: t => 1 - Math.pow(1 - t, 4),
  // critically-damped-ish spring with slight overshoot (no bouncy cartoon)
  spring: t => { if (t <= 0) return 0; if (t >= 1.6) return 1; const w = 9.5, z = .62; return 1 - Math.exp(-z * w * t) * (Math.cos(w * Math.sqrt(1 - z * z) * t) + (z / Math.sqrt(1 - z * z)) * Math.sin(w * Math.sqrt(1 - z * z) * t)); },
};
// timed helpers: a(t, start, dur, ease) -> 0..1
const A = (t, s, d = .6, e = E.out) => e(P(t, s, s + d));
const SP = (t, s, d = 1) => E.spring((t - s) / d);
function rnd(i) { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); }

// ---------------------------------------------------------------- DOM helpers
function h(tag, cls, html, style) { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; if (style) Object.assign(e.style, style); return e; }
function put(parent, el, x, y, w, hgt) { el.style.position = 'absolute'; el.style.left = x + 'px'; el.style.top = y + 'px'; if (w != null) el.style.width = w + 'px'; if (hgt != null) el.style.height = hgt + 'px'; parent.appendChild(el); return el; }
// set(el, {x,y,s,sx,sy,r,rx,ry,o,b(blur px)}) — transform about transform-origin
function set(el, o) {
  const tr = [];
  if (o.x || o.y) tr.push(`translate3d(${(o.x || 0).toFixed(2)}px,${(o.y || 0).toFixed(2)}px,0)`);
  if (o.rx || o.ry) tr.push(`perspective(1400px) rotateX(${(o.rx || 0).toFixed(2)}deg) rotateY(${(o.ry || 0).toFixed(2)}deg)`);
  if (o.r) tr.push(`rotate(${o.r.toFixed(2)}deg)`);
  if (o.s != null && o.s !== 1) tr.push(`scale(${o.s.toFixed(4)})`);
  if (o.sx != null || o.sy != null) tr.push(`scale(${(o.sx ?? 1).toFixed(4)},${(o.sy ?? 1).toFixed(4)})`);
  el.style.transform = tr.join(' ');
  if (o.o != null) { el.style.opacity = cl(o.o).toFixed(3); el.style.visibility = o.o <= 0.001 ? 'hidden' : ''; }
  if (o.b != null) el.style.filter = o.b > .05 ? `blur(${o.b.toFixed(2)}px)` : 'none';
}
// standard entrance: rise + fade + slight 3D tilt settling, spring
function enter(el, t, s, o = {}) {
  const k = SP(t, s, o.d || 1), k2 = A(t, s, .35, E.quart);
  const dy = o.dy ?? 36, dx = o.dx ?? 0;
  set(el, { x: dx * (1 - k), y: dy * (1 - k), s: lerp(o.s0 ?? .965, 1, k), rx: (o.rx ?? 10) * (1 - k), o: k2 * (o.o ?? 1), b: (o.blur ?? 6) * (1 - k2) });
  return k;
}
// exit (inverse)
function leave(el, t, s, o = {}) { const k = A(t, s, o.d || .35, E.in); set(el, { y: -(o.dy ?? 24) * k, s: 1 - .03 * k, o: 1 - k, b: 6 * k }); return k; }
// typewriter: reveals text by char count, cursor block
function type(el, text, t, s, cps = 28, cursor = true) {
  const n = Math.max(0, Math.floor((t - s) * cps)); const shown = [...text].slice(0, n).join('');
  const done = n >= [...text].length;
  el.innerHTML = esc(shown) + (cursor && (t >= s) && (!done || Math.floor(t * 2.2) % 2 === 0) ? '<span class="caret"></span>' : '');
  return done;
}
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
// strike-through bar that draws left→right
function strike(el, k) { el.style.setProperty('--strike', cl(k).toFixed(3)); }
function count(el, from, to, k, dec = 0, suffix = '') { el.textContent = (lerp(from, to, cl(k))).toFixed(dec) + suffix; }


// ---------------------------------------------------------------- kit helpers (archetypes use these)
// when(ctx, at, fb): at = seconds | phrase in narration | missing -> fb
function when(ctx, at, fb) { if (typeof at === 'number') return at; if (typeof at === 'string' && at) { const v = ctx.at(at, 0, NaN); if (!Number.isNaN(v)) return v; } return fb; }
// spread(ctx, i, n): evenly spaced moments across the narration of the scene
function spread(ctx, i, n, a = .12, b = .82) { const s = ctx.lines[0] ? ctx.lines[0].s : 0, e = ctx.lines.length ? ctx.lines[ctx.lines.length - 1].e : ctx.dur; return s + (e - s) * (n <= 1 ? a : lerp(a, b, i / (n - 1))); }
function times(ctx, items, a, b) { return items.map((it, i) => when(ctx, it && it.at, spread(ctx, i, items.length, a, b))); }
// source tag: bottom-left pill. Every number / quote on screen gets one.
function source(parent, text, y = 892) { return put(parent, h('div', 'srctag', `<b>Source</b><span>${esc(text)}</span>`), 88, y); }
// highlighter sweep on <span class="hl">: k 0..1
function hl(el, k) { el.style.setProperty('--hl', cl(k).toFixed(3)); }
// "*word*" -> highlighter span
const md = s => esc(String(s ?? '')).replace(/\*(.+?)\*/g, '<span class="hl">$1</span>');

// ---------------------------------------------------------------- SVG components
const COL = { ink: '#15161c', sub: '#6b6e7b', line: 'rgba(21,22,28,.09)', red: '#f0443a', green: '#1fbf75', blue: '#3a6cf4', amber: '#f5a524', violet: '#8b5cf6', mint: '#2fc7a4', indigo: '#5a5cf0', white: '#fff' };
const BOTS = {
  director: { name: 'Director', zh: '导演', c: '#33c9a6', shape: 'circle' },
  animator: { name: 'Animator', zh: '写片', c: '#f5a524', shape: 'circle' },
  render: { name: 'Render', zh: '渲染', c: '#5a5cf0', shape: 'tri' },
  critic: { name: 'Critic', zh: '评审', c: '#8b5cf6', shape: 'hex' },
  delivery: { name: 'Delivery', zh: '交付', c: '#3a86f4', shape: 'circle' },
};
const BOT_ORDER = ['director', 'animator', 'render', 'critic', 'delivery'];
// mascot: returns {el, update(t, opts)} — blink, bob, look direction
function bot(kind, size = 72) {
  const b = BOTS[kind], s = size;
  let body;
  if (b.shape === 'circle') body = `<circle cx="50" cy="52" r="40" fill="${b.c}"/>`;
  else if (b.shape === 'tri') body = `<path d="M50 10 Q54 10 57 15 L92 80 Q95 88 86 88 L14 88 Q5 88 8 80 L43 15 Q46 10 50 10Z" fill="${b.c}"/>`;
  else body = `<path d="M50 9 L86 30 L86 72 L50 93 L14 72 L14 30Z" fill="${b.c}" stroke="${b.c}" stroke-width="8" stroke-linejoin="round"/>`;
  const el = h('div', 'bot', `<svg viewBox="0 0 100 100" width="${s}" height="${s}"><ellipse class="shadow" cx="50" cy="97" rx="30" ry="4" fill="rgba(20,20,40,.14)"/><g class="body">${body}<ellipse cx="38" cy="38" rx="14" ry="9" fill="rgba(255,255,255,.22)"/><g class="eyes"><rect class="eye" x="36" y="${b.shape === 'tri' ? 52 : 44}" width="9" height="15" rx="4.5" fill="#fff"/><rect class="eye" x="55" y="${b.shape === 'tri' ? 52 : 44}" width="9" height="15" rx="4.5" fill="#fff"/></g></g></svg>`);
  el.style.width = el.style.height = s + 'px';
  const g = el.querySelector('.body'), eyes = el.querySelector('.eyes'), ey = el.querySelectorAll('.eye');
  const seed = BOT_ORDER.indexOf(kind) * 3.7 + 1;
  return {
    el, update(t, o = {}) {
      const bob = Math.sin(t * 2.2 + seed) * (o.bob ?? 2.2);
      g.setAttribute('transform', `translate(0 ${bob.toFixed(2)})`);
      const per = 3.1 + (seed % 1.3), ph = ((t + seed) % per) / per, bl = ph > .955 ? Math.abs(Math.sin((ph - .955) / .045 * Math.PI)) : 0;
      const lx = (o.lookX ?? Math.sin(t * .7 + seed) * .4) * 5, ly = (o.lookY ?? 0) * 4;
      eyes.setAttribute('transform', `translate(${lx.toFixed(2)} ${ly.toFixed(2)})`);
      ey.forEach(e => { e.setAttribute('transform', `translate(0 ${(7.5 * bl).toFixed(2)}) scale(1 ${(1 - .85 * bl).toFixed(3)})`); e.style.transformBox = 'fill-box'; e.style.transformOrigin = 'center'; });
    }
  };
}
// GrokBot logo
function grok(size = 64) { return h('div', 'grok', `<svg viewBox="0 0 100 100" width="${size}" height="${size}"><circle cx="50" cy="50" r="48" fill="#121214"/><path d="M36 33 Q41 31 41 37 L37 58 Q36 63 31 62 Q28 61 29 57 Z M58 33 Q63 31 63 37 L59 58 Q58 63 53 62 Q50 61 51 57 Z" fill="#fff"/></svg>`); }
// icons
const IC = {
  check: c => `<svg viewBox="0 0 24 24" width="100%" height="100%"><circle cx="12" cy="12" r="12" fill="${c || COL.green}"/><path d="M7 12.5l3.2 3.2L17 9" stroke="#fff" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  x: c => `<svg viewBox="0 0 24 24" width="100%" height="100%"><circle cx="12" cy="12" r="12" fill="${c || COL.red}"/><path d="M8 8l8 8M16 8l-8 8" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/></svg>`,
  cursor: () => `<svg viewBox="0 0 28 28" width="100%" height="100%"><path d="M5 3 L5 22 L10 17.5 L13.5 25 L17 23.5 L13.6 16.2 L20.5 16 Z" fill="#15161c" stroke="#fff" stroke-width="2" stroke-linejoin="round"/></svg>`,
  lock: () => `<svg viewBox="0 0 24 24" width="100%" height="100%"><circle cx="12" cy="12" r="12" fill="#15161c"/><rect x="7.5" y="11" width="9" height="7" rx="1.5" fill="#fff"/><path d="M9.3 11V9a2.7 2.7 0 015.4 0v2" stroke="#fff" stroke-width="1.8" fill="none"/></svg>`,
  moon: () => `<svg viewBox="0 0 40 40" width="100%" height="100%"><path d="M27 6a15 15 0 1 0 8 22A12 12 0 0 1 27 6z" fill="#ffd66b"/></svg>`,
  sun: () => `<svg viewBox="0 0 40 40" width="100%" height="100%"><circle cx="20" cy="20" r="9" fill="#ffc53d"/>${[...Array(8)].map((_, i) => `<rect x="19" y="2" width="2" height="6" rx="1" fill="#ffc53d" transform="rotate(${i * 45} 20 20)"/>`).join('')}</svg>`,
  file: c => `<svg viewBox="0 0 24 24" width="100%" height="100%"><path d="M6 2h8l5 5v15H6z" fill="${c || '#e9ebf3'}"/><path d="M14 2v5h5" fill="rgba(0,0,0,.08)"/></svg>`,
  folder: c => `<svg viewBox="0 0 24 24" width="100%" height="100%"><path d="M2 6a2 2 0 012-2h5l2 2h9a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2z" fill="${c || '#f5c451'}"/></svg>`,
};
function icon(name, size = 28, c) { const e = h('span', 'icon', IC[name](c)); e.style.width = e.style.height = size + 'px'; return e; }
// window chrome card. opts: {title, dark, w, h, tag}
function win(o = {}) {
  const e = h('div', 'win' + (o.dark ? ' dark' : ''), `<div class="bar"><i></i><i></i><i></i><span class="wt">${o.title || ''}</span>${o.tag ? `<span class="wtag">${o.tag}</span>` : ''}</div><div class="wb"></div>`);
  if (o.w) e.style.width = o.w + 'px'; if (o.h) e.style.height = o.h + 'px';
  e.body = e.querySelector('.wb'); return e;
}
function card(o = {}) { const e = h('div', 'card' + (o.cls ? ' ' + o.cls : ''), o.html || ''); if (o.w) e.style.width = o.w + 'px'; if (o.h) e.style.height = o.h + 'px'; return e; }
function chip(text, color, filled) { const e = h('span', 'chip' + (filled ? ' filled' : ''), text); if (color) e.style.setProperty('--c', color); return e; }
// animated cursor with click ripple. path: [[t,x,y],...], clicks:[t...]
function cursor(parent) {
  const c = put(parent, h('div', 'cursor', IC.cursor() + '<i class="ripple"></i>'), 0, 0, 34, 34);
  return {
    el: c, update(t, path, clicks = []) {
      if (!path.length || t < path[0][0] - .4) { set(c, { o: 0 }); return; }
      let x = path[0][1], y = path[0][2];
      for (let i = 1; i < path.length; i++) { const [t0, x0, y0] = path[i - 1], [t1, x1, y1] = path[i]; if (t >= t0) { const k = E.io(P(t, t0, t1)); x = lerp(x0, x1, k); y = lerp(y0, y1, k); } }
      const ap = A(t, path[0][0] - .4, .35, E.quart), dp = path.at(-1)[3] ? 1 - A(t, path.at(-1)[3], .3) : 1;
      let press = 0, rip = 0; for (const ck of clicks) { const d = t - ck; if (d > -0.08 && d < .12) press = 1 - Math.abs(d - .02) / .1; if (d >= 0 && d < .6) rip = d / .6; }
      set(c, { x, y, s: 1 - .12 * cl(press), o: ap * dp });
      const r = c.querySelector('.ripple'); r.style.opacity = rip > 0 ? (1 - rip) * .55 : 0; r.style.transform = `translate(-50%,-50%) scale(${.3 + rip * 1.6})`;
    }
  };
}
// a narration-synced timing lookup: ctx.at('导演') -> scene-local seconds when that phrase starts
function mkCtx(sc) {
  const words = sc.lines.flatMap(l => l.w).map(w => [w[0], w[1], w[2].replace(/\s+/g, '').toLowerCase()]); const full = words.map(w => w[2]).join('');
  const idx = []; let p = 0; for (const w of words) { idx.push(p); p += w[2].length; }
  return {
    dur: sc.dur, lines: sc.lines, id: sc.id,
    at(phrase, nth = 0, fallback = 0) {
      phrase = phrase.replace(/\s+/g, '').toLowerCase();
      let from = 0, pos = -1; for (let i = 0; i <= nth; i++) { pos = full.indexOf(phrase, from); if (pos < 0) break; from = pos + 1; }
      if (pos < 0) { console.warn('at(): not found', sc.id, phrase); return fallback; }
      let k = 0; while (k + 1 < idx.length && idx[k + 1] <= pos) k++; return words[k][0];
    },
    end(phrase, nth = 0) { phrase = phrase.replace(/\s+/g, '').toLowerCase(); const pos = full.indexOf(phrase); let k = 0; while (k + 1 < idx.length && idx[k + 1] < pos + phrase.length) k++; return words[k][1]; },
    line(i) { return sc.lines[i] || { s: 0, e: sc.dur }; },
  };
}
// sound cues registered by scenes (absolute seconds) — exported for the mixer
const CUES = [];
window.H = { W, H, cl, P, lerp, E, A, SP, rnd, h, put, set, enter, leave, type, esc, strike, count, COL, BOTS, BOT_ORDER, bot, grok, icon, IC, win, card, chip, cursor, when, spread, times, source, hl, md };
window.SCENES = window.SCENES || {};
window.ARCH = window.ARCH || {};

// ---------------------------------------------------------------- stage
const THEME = {
  paper: ['#f5f4f1', '#ffffff'], mint: ['#e2f4ed', '#f6fcf9'], lavender: ['#e5e8fb', '#f6f7ff'], lilac: ['#eee6fb', '#faf7ff'], sky: ['#e2eefb', '#f5f9ff'],
  sand: ['#f6eee0', '#fffaf2'], ice: ['#e7edf7', '#f7f9fd'], peach: ['#fbe7df', '#fff8f5'], night: ['#121838', '#1d2552'],
};
let TL, stage, bgA, bgB, dots, header, hLabel, hTitle, subEl, built = [], chap, chapSegs = [], stepB, lastStep = -2;
function hex2rgb(x) { return [1, 3, 5].map(i => parseInt(x.slice(i, i + 2), 16)); }
function mix(c1, c2, k) { const a = hex2rgb(c1), b = hex2rgb(c2); return `rgb(${a.map((v, i) => Math.round(lerp(v, b[i], k))).join(',')})`; }

async function boot() {
  TL = await (await fetch('timeline.json')).json();
  try { window.BRAND = await (await fetch('brand.json')).json(); } catch (e) { window.BRAND = {}; }
  const BR = window.BRAND;
  if (BR.cast) { for (const k in BOTS) delete BOTS[k]; Object.assign(BOTS, BR.cast); BOT_ORDER.splice(0, BOT_ORDER.length, ...Object.keys(BR.cast)); }
  if (BR.themes) Object.assign(THEME, BR.themes);
  if (BR.colors) Object.assign(COL, BR.colors);
  // preload every face/weight used anywhere (hidden scenes don't trigger loads)
  const FACES = ['400','500','600','700','800','900'].flatMap(w => [`${w} 20px Noto`, `${w} 20px Geist`]).concat(['400 20px Maple', '700 20px Maple']);
  await Promise.all(FACES.map(f => document.fonts.load(f, '中文Ab1')));
  stage = document.getElementById('stage');
  bgA = put(stage, h('div', 'bg'), 0, 0, W, H);
  dots = put(stage, h('div', 'dots'), -60, -60, W + 120, H + 120);
  for (let i = 0; i < 46; i++) { const d = h('i'); const s = 6 + rnd(i) * 26; Object.assign(d.style, { left: rnd(i + 9) * (W + 120) + 'px', top: rnd(i + 19) * (H + 120) + 'px', width: s + 'px', height: s + 'px', opacity: .25 + rnd(i + 29) * .5 }); d.dataset.z = (.3 + rnd(i + 39)).toFixed(2); dots.appendChild(d); }
  stars = put(stage, h('div', 'stars'), 0, 0, W, H);
  for (let i = 0; i < 90; i++) { const d = h('i'); const s = 1.5 + rnd(i + 3) * 2.5; Object.assign(d.style, { left: rnd(i + 5) * W + 'px', top: rnd(i + 7) * H * .8 + 'px', width: s + 'px', height: s + 'px' }); stars.appendChild(d); }
  const content = put(stage, h('div', 'content'), 0, 0, W, H);
  for (const sc of TL.scenes) {
    const root = put(content, h('div', 'scene'), 0, 0, W, H); root.dataset.id = sc.id;
    const ctx = mkCtx(sc); ctx.cue = (t, type, gain = 1) => CUES.push({ t: +(sc.start + t).toFixed(3), type, gain });
    const def = window.SCENES[sc.id] || (sc.type && window.ARCH[sc.type] ? ((r, c, HH) => window.ARCH[sc.type](r, c, HH, sc.data || {}, sc)) : null);
    let upd = () => { };
    if (def) { try { upd = def(root, ctx, window.H) || upd; } catch (e) { console.error('scene build failed', sc.id, e); root.innerHTML = `<div class="todo">${sc.id} build error: ${esc(String(e.message))}</div>`; } }
    else root.appendChild(h('div', 'todo', `TODO ${sc.id}${sc.type ? ' (unknown type ' + esc(sc.type) + ')' : ''}`));
    built.push({ sc, root, upd, ctx });
  }
  header = put(stage, h('div', 'header'), 88, 64);
  hLabel = header.appendChild(h('div', 'hlabel')); hTitle = header.appendChild(h('div', 'htitle'));
  subEl = put(stage, h('div', 'sub'), 0, 968); subEl.style.top = '968px';
  // chapter bar (top edge, one segment per chapter) + step badge (top-right)
  chap = put(stage, h('div', 'chap'), 0, 0, W, 6);
  const CHS = []; TL.scenes.forEach(s => { const nm = s.chapter || ''; if (!CHS.length || CHS[CHS.length - 1].name !== nm) CHS.push({ name: nm, start: s.start, end: s.start + s.dur }); else CHS[CHS.length - 1].end = s.start + s.dur; });
  if (CHS.length > 1) CHS.forEach(c => { const sg = chap.appendChild(h('div', 'seg')); sg.style.flex = String(c.end - c.start); const f = sg.appendChild(h('i')); chapSegs.push({ ...c, f }); });
  else chap.style.display = 'none';
  stepB = put(stage, h('div', 'stepb'), 0, 70); stepB.style.left = 'auto'; stepB.style.right = '88px';
  window.MAXSTEP = Math.max(0, ...TL.scenes.map(s => +s.step || 0));
  // map word timings onto the original line text (edge-tts boundaries drop spaces/punctuation)
  for (const sc of TL.scenes) for (const ln of sc.lines) {
    const ch = [...ln.text], tm = new Array(ch.length).fill(null); let p = 0;
    for (const [w0, , tx] of ln.w) { const at = ln.text.indexOf(tx, p); if (at < 0) continue; const ci = [...ln.text.slice(0, at)].length; for (let k = 0; k < [...tx].length; k++) tm[ci + k] = w0; p = at + tx.length; }
    let last = ln.s; ln.ct = tm.map(v => (v == null ? last : (last = v)));
    ln.ch = ch;
    // split into subtitle segments (<= ~26 chars), breaking after punctuation
    const PUN = '，。；：？！、,;:?!.'; const EN = /[A-Za-z]/.test(ln.text) && !/[\u4e00-\u9fff]/.test(ln.text);
    const MAX = EN ? 54 : 26, MIN = EN ? 22 : 8; ln.segs = []; let a = 0;
    while (a < ch.length) {
      let b = Math.min(ch.length, a + MAX);
      if (b < ch.length) {
        let best = -1; for (let k = a + MIN; k < b; k++) if (PUN.includes(ch[k]) && (!EN || ch[k + 1] === ' ')) best = k + 1;
        if (best < 0 && EN) { for (let k = b; k > a + MIN; k--) if (ch[k] === ' ') { best = k; break; } }
        if (best > 0) b = best;
      }
      if (ch.length - b > 0 && ch.length - b < (EN ? 14 : 6)) b = ch.length;
      let e = b; while (e > a && ((!EN && PUN.includes(ch[e - 1])) || (EN && ',;:'.includes(ch[e - 1])) || ch[e - 1] === ' ')) e--; let s0 = a; while (s0 < e && ch[s0] === ' ') s0++;
      ln.segs.push({ a: s0, b: e, t0: ln.ct[s0] ?? ln.s }); a = b;
    }
  }
  grain = put(stage, h('div', 'grain'), 0, 0, W, H);
  await Promise.all(window.PRELOAD || []);
  window.CUES = CUES; window.TOTAL = TL.total; window.READY = true;
}
let stars, grain, lastHeader = -1;
function chars(text, cls) { return [...text].map(c => `<span class="${cls}">${c === ' ' ? '&nbsp;' : esc(c)}</span>`).join(''); }
const TR = .5; // transition overlap (s)
window.renderAt = function (T) {
  T = Math.max(0, Math.min(T, TL.total - 1e-3));
  let i = TL.scenes.findIndex(s => T >= s.start && T < s.start + s.dur); if (i < 0) i = TL.scenes.length - 1;
  const cur = built[i], prev = built[i - 1], t = T - cur.sc.start;
  // background crossfade
  const th = THEME[cur.sc.theme], thp = prev ? THEME[prev.sc.theme] : th, bk = prev ? E.io(P(t, 0, .7)) : 1;
  const c0 = mix(thp[0], th[0], bk), c1 = mix(thp[1], th[1], bk);
  bgA.style.background = `radial-gradient(120% 90% at 70% 10%, ${c1} 0%, ${c0} 62%)`;
  const night = (cur.sc.theme === 'night' ? bk : 0) + (prev && prev.sc.theme === 'night' ? 1 - bk : 0);
  stars.style.opacity = night; dots.style.opacity = .9 * (1 - night) + .15 * night;
  [...dots.children].forEach(d => { const z = +d.dataset.z; d.style.transform = `translate3d(${(-T * 6 * z).toFixed(1)}px, ${(Math.sin(T * .3 + z * 9) * 10 * z).toFixed(1)}px,0)`; });
  [...stars.children].forEach((d, k) => { d.style.opacity = (.35 + .65 * Math.abs(Math.sin(T * (.6 + rnd(k) * 1.4) + k))).toFixed(2); });
  // scenes
  for (const b of built) { if (b !== cur && b !== prev) b.root.style.display = 'none'; }
  cur.root.style.display = 'block';
  // camera: slow push-in per scene
  const cam = 1 + .018 * E.sine(P(t, 0, cur.sc.dur));
  cur.root.style.transformOrigin = '50% 55%';
  const ek = prev ? E.quart(P(t, .08, TR + .15)) : 1;
  cur.root.style.transform = `scale(${cam.toFixed(4)})`;
  try { cur.upd(t, cur.ctx); } catch (e) { console.error('scene update failed', cur.sc.id, t, e.message); }
  const trn = cur.sc.trans || 'lift';
  { let cx = 0, cs = 1; if (prev && trn === 'slide') cx = 180 * (1 - ek); if (prev && trn === 'zoom') cs = lerp(.93, 1, ek);
    if (cx || cs !== 1) cur.root.style.transform = `translate3d(${cx.toFixed(1)}px,0,0) scale(${(cam * cs).toFixed(4)})`; }
  if (prev && t < TR && trn !== 'cut') {
    prev.root.style.display = 'block';
    const pt = prev.sc.dur + t; try { prev.upd(pt, prev.ctx); } catch (e) { }
    const k = E.in(P(t, 0, TR * .8));
    prev.root.style.transform = trn === 'slide' ? `translate3d(${(-180 * k).toFixed(1)}px,0,0) scale(1.018)` : trn === 'zoom' ? `scale(${(1.018 + .09 * k).toFixed(4)})` : `translateY(${(-40 * k).toFixed(1)}px) scale(${(1.018 - .04 * k).toFixed(4)})`;
    prev.root.style.opacity = (1 - k).toFixed(3); prev.root.style.filter = k > .02 ? `blur(${(10 * k).toFixed(1)}px)` : 'none';
  } else if (prev) { prev.root.style.display = 'none'; }
  cur.root.style.opacity = 1; cur.root.style.filter = 'none';
  // header: per-char swap
  if (lastHeader !== i) { hLabel.innerHTML = `<b></b><span>${esc(cur.sc.label || '')}</span>`; hTitle.innerHTML = chars(cur.sc.title || '', 'c'); lastHeader = i; }
  const hc = hTitle.children, lk = A(t, .05, .5, E.quart);
  set(hLabel, { x: -14 * (1 - lk), o: lk });
  for (let k = 0; k < hc.length; k++) { const a = SP(t, .08 + k * .022, .9); set(hc[k], { y: 46 * (1 - a), o: A(t, .08 + k * .022, .3), b: 5 * (1 - A(t, .08 + k * .022, .35)) }); }
  header.classList.toggle('dark', cur.sc.theme === 'night');
  const AR = cur.sc.type && window.ARCH[cur.sc.type];
  const nh = (window.SCENES[cur.sc.id] && window.SCENES[cur.sc.id].noHeader) || (AR && AR.noHeader) || cur.sc.noHeader || !cur.sc.title; header.style.display = nh ? 'none' : 'block';
  // chapter bar + step badge
  const dk = cur.sc.theme === 'night'; chap.classList.toggle('dark', dk);
  for (const c of chapSegs) c.f.style.transform = `scaleX(${cl((T - c.start) / (c.end - c.start)).toFixed(4)})`;
  const st = +cur.sc.step || 0;
  if (st !== lastStep) { stepB.innerHTML = st ? `<b>STEP ${st}</b><span>/ ${window.MAXSTEP}</span>` : ''; lastStep = st; }
  stepB.classList.toggle('dark', dk);
  const sameStep = prev && (+prev.sc.step || 0) === st;
  set(stepB, { o: st ? (sameStep ? 1 : A(t, .15, .4, E.quart)) : 0, y: st && !sameStep ? -10 * (1 - A(t, .15, .5)) : 0 });
  // subtitle: active line, karaoke
  const L = cur.sc.lines; let li = -1;
  for (let k = 0; k < L.length; k++) if (t >= L[k].s - .12 && t <= L[k].e + (k < L.length - 1 ? (L[k + 1].s - L[k].e) : .5)) li = k;
  if (li >= 0) {
    const ln = L[li];
    let si = 0; for (let k = 0; k < ln.segs.length; k++) if (t >= ln.segs[k].t0 - .05) si = k;
    const sg = ln.segs[si];
    if (subEl.dataset.key !== cur.sc.id + li + '_' + si) {
      subEl.innerHTML = ln.ch.slice(sg.a, sg.b).map(c => `<span class="w">${c === ' ' ? '&nbsp;' : esc(c)}</span>`).join('');
      subEl.dataset.key = cur.sc.id + li + '_' + si;
      subEl.style.left = '0px'; const ww = subEl.offsetWidth; subEl.style.left = ((W - ww) / 2) + 'px'; subEl.style.top = (1036 - subEl.offsetHeight) + 'px';
    }
    const ws = subEl.children; for (let k = 0; k < ws.length; k++) ws[k].classList.toggle('on', t >= ln.ct[sg.a + k] - .02);
    const sa = A(t, ln.s - .12, .25, E.quart), so = li === L.length - 1 ? 1 - A(t, ln.e + .3, .25) : 1;
    set(subEl, { y: 10 * (1 - sa), o: sa * so });
  } else set(subEl, { o: 0 });
  // grain offset
  const f = Math.floor(T * 60); grain.style.backgroundPosition = `${(rnd(f) * 200) | 0}px ${(rnd(f + 3) * 200) | 0}px`;
};

// QA: visible text that is too small for a phone (< 22px at 1080p) or off-frame, in the current frame
window.QA = function (minPx = 20) {
  const out = [];
  for (const b of built) {
    if (b.root.style.display !== 'block' || b.root.style.opacity === '0') continue;
    b.root.querySelectorAll('*').forEach(e => {
      const txt = [...e.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent).join('').trim(); if (!txt) return;
      const cs = getComputedStyle(e); if (cs.visibility === 'hidden') return;
      const r = e.getBoundingClientRect(); if (r.width < 1) return;
      let o = 1, p = e; while (p && p !== b.root) { o *= +getComputedStyle(p).opacity; p = p.parentElement; } if (o < .6) return;
      const fs = parseFloat(cs.fontSize);
      if (fs < minPx) out.push({ scene: b.sc.id, kind: 'small', fs, txt: txt.slice(0, 40) });
      if (r.right > W + 2 || r.bottom > H + 2 || r.left < -2 || r.top < -2) out.push({ scene: b.sc.id, kind: 'offframe', txt: txt.slice(0, 40) });
    });
  }
  return out;
};
boot().catch(e => { window.ERR = String(e.stack || e); });
})();
