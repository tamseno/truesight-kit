// TrueSight Motion Kit v2 engine — deterministic DOM timeline. window.renderAt(T) paints the frame at T seconds.
// Scenes come from (1) episode scenes/<id>.js  (custom)  or  (2) core/archetypes/<type>.js  (data-driven, sc.type + sc.data).
// v2: mesh-gradient themes + vignette, narration-following camera (ctx.cam / ctx.focus / sc.cam), whip/wipe/push transitions,
//     per-episode cast (meta.cast), scenes are laid out visibly at build time so archetypes can measure and auto-fit text.
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
  // expo in-out: camera moves (slow start, decisive middle, long settle)
  xio: t => (t <= 0 ? 0 : t >= 1 ? 1 : t < .5 ? Math.pow(2, 20 * t - 10) / 2 : (2 - Math.pow(2, -20 * t + 10)) / 2),
  // critically-damped-ish spring with slight overshoot (no bouncy cartoon)
  spring: t => { if (t <= 0) return 0; if (t >= 1.6) return 1; const w = MF.w, z = MF.z; return 1 - Math.exp(-z * w * t) * (Math.cos(w * Math.sqrt(1 - z * z) * t) + (z / Math.sqrt(1 - z * z)) * Math.sin(w * Math.sqrt(1 - z * z) * t)); },
};
// motion feel (set by the look): spring stiffness w, damping z, entrance duration / rise / blur / tilt
const MF = { w: 9.5, z: .62, dur: 1, dy: 36, blur: 6, tilt: 10 };
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
  const k = SP(t, s, (o.d || 1) * MF.dur), k2 = A(t, s, .35 * Math.min(1, MF.dur), E.quart), f = MF.dy / 36;
  const dy = (o.dy ?? 36) * f, dx = (o.dx ?? 0) * f;
  set(el, { x: dx * (1 - k), y: dy * (1 - k), s: lerp(o.s0 ?? .965, 1, k) * (o.s ?? 1), rx: (o.rx ?? 10) * (MF.tilt / 10) * (1 - k), o: k2 * (o.o ?? 1), b: (o.blur ?? 6) * (MF.blur / 6) * (1 - k2) + (o.b ?? 0) });
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
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;');
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
// "*word*" -> highlighter span, "`code`" -> inline code
const md = s => esc(String(s ?? '')).replace(/\*(.+?)\*/g, '<span class="hl">$1</span>').replace(/`(.+?)`/g, '<code class="ic">$1</code>');

// ---------------------------------------------------------------- SVG components
const COL = { ink: '#15161c', sub: '#6b6e7b', line: 'rgba(21,22,28,.09)', red: '#f0443a', green: '#1fbf75', blue: '#3a6cf4', amber: '#f5a524', violet: '#8b5cf6', mint: '#2fc7a4', indigo: '#5a5cf0', white: '#fff', accent: '#5a5cf0' };
const BOTS = {
  director: { name: 'Director', zh: '导演', c: '#33c9a6', shape: 'circle' },
  animator: { name: 'Animator', zh: '写片', c: '#f5a524', shape: 'circle' },
  render: { name: 'Render', zh: '渲染', c: '#5a5cf0', shape: 'tri' },
  critic: { name: 'Critic', zh: '评审', c: '#8b5cf6', shape: 'hex' },
  delivery: { name: 'Delivery', zh: '交付', c: '#3a86f4', shape: 'circle' },
};
const BOT_ORDER = ['director', 'animator', 'render', 'critic', 'delivery'];
// mascot: returns {el, update(t, opts)} — blink, bob, look direction. shapes: circle | tri | hex | square | diamond
function bot(kind, size = 72) {
  const b = BOTS[kind] || { c: '#15161c', shape: 'circle' }, s = size;
  let body, eyeY = 44;
  if (b.shape === 'tri') { body = `<path d="M50 10 Q54 10 57 15 L92 80 Q95 88 86 88 L14 88 Q5 88 8 80 L43 15 Q46 10 50 10Z" fill="${b.c}"/>`; eyeY = 52; }
  else if (b.shape === 'hex') body = `<path d="M50 9 L86 30 L86 72 L50 93 L14 72 L14 30Z" fill="${b.c}" stroke="${b.c}" stroke-width="8" stroke-linejoin="round"/>`;
  else if (b.shape === 'square') body = `<rect x="12" y="14" width="76" height="76" rx="22" fill="${b.c}"/>`;
  else if (b.shape === 'diamond') { body = `<path d="M50 6 L90 50 L50 94 L10 50Z" fill="${b.c}" stroke="${b.c}" stroke-width="10" stroke-linejoin="round"/>`; eyeY = 42; }
  else body = `<circle cx="50" cy="52" r="40" fill="${b.c}"/>`;
  const el = h('div', 'bot', `<svg viewBox="0 0 100 100" width="${s}" height="${s}"><ellipse class="shadow" cx="50" cy="97" rx="30" ry="4" fill="rgba(20,20,40,.14)"/><g class="body">${body}<ellipse cx="38" cy="36" rx="14" ry="9" fill="rgba(255,255,255,.22)"/><g class="eyes"><rect class="eye" x="36" y="${eyeY}" width="9" height="15" rx="4.5" fill="#fff"/><rect class="eye" x="55" y="${eyeY}" width="9" height="15" rx="4.5" fill="#fff"/></g></g></svg>`);
  el.style.width = el.style.height = s + 'px';
  const g = el.querySelector('.body'), eyes = el.querySelector('.eyes'), ey = el.querySelectorAll('.eye');
  const seed = (Math.max(0, BOT_ORDER.indexOf(kind)) + 1) * 3.7 + 1;
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
// icons (simple, brand-neutral glyphs; c = fill color)
const IC = {
  check: c => `<svg viewBox="0 0 24 24" width="100%" height="100%"><circle cx="12" cy="12" r="12" fill="${c || COL.green}"/><path d="M7 12.5l3.2 3.2L17 9" stroke="#fff" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  x: c => `<svg viewBox="0 0 24 24" width="100%" height="100%"><circle cx="12" cy="12" r="12" fill="${c || COL.red}"/><path d="M8 8l8 8M16 8l-8 8" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/></svg>`,
  cursor: () => `<svg viewBox="0 0 28 28" width="100%" height="100%"><path d="M5 3 L5 22 L10 17.5 L13.5 25 L17 23.5 L13.6 16.2 L20.5 16 Z" fill="#15161c" stroke="#fff" stroke-width="2" stroke-linejoin="round"/></svg>`,
  lock: () => `<svg viewBox="0 0 24 24" width="100%" height="100%"><circle cx="12" cy="12" r="12" fill="#15161c"/><rect x="7.5" y="11" width="9" height="7" rx="1.5" fill="#fff"/><path d="M9.3 11V9a2.7 2.7 0 015.4 0v2" stroke="#fff" stroke-width="1.8" fill="none"/></svg>`,
  moon: () => `<svg viewBox="0 0 40 40" width="100%" height="100%"><path d="M27 6a15 15 0 1 0 8 22A12 12 0 0 1 27 6z" fill="#ffd66b"/></svg>`,
  sun: () => `<svg viewBox="0 0 40 40" width="100%" height="100%"><circle cx="20" cy="20" r="9" fill="#ffc53d"/>${[...Array(8)].map((_, i) => `<rect x="19" y="2" width="2" height="6" rx="1" fill="#ffc53d" transform="rotate(${i * 45} 20 20)"/>`).join('')}</svg>`,
  file: c => `<svg viewBox="0 0 24 24" width="100%" height="100%"><path d="M6 2h8l5 5v15H6z" fill="${c || '#e9ebf3'}"/><path d="M14 2v5h5" fill="rgba(0,0,0,.08)"/></svg>`,
  folder: c => `<svg viewBox="0 0 24 24" width="100%" height="100%"><path d="M2 6a2 2 0 012-2h5l2 2h9a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2z" fill="${c || '#f5c451'}"/></svg>`,
  branch: c => `<svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="${c || '#15161c'}" stroke-width="2.2" stroke-linecap="round"><circle cx="6" cy="5" r="2.4"/><circle cx="6" cy="19" r="2.4"/><circle cx="18" cy="7" r="2.4"/><path d="M6 7.4v9.2M18 9.4c0 5-6 4-11 7.6"/></svg>`,
  pr: c => `<svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="${c || '#1fbf75'}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="5" r="2.4"/><circle cx="6" cy="19" r="2.4"/><circle cx="18" cy="19" r="2.4"/><path d="M6 7.4v9.2M18 16.6V9a3 3 0 00-3-3h-4M13 3.5L10.5 6 13 8.5"/></svg>`,
  merge: c => `<svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="${c || '#8b5cf6'}" stroke-width="2.2" stroke-linecap="round"><circle cx="6" cy="5" r="2.4"/><circle cx="6" cy="19" r="2.4"/><circle cx="18" cy="12" r="2.4"/><path d="M6 7.4v9.2M6 7.4c0 4 4 4.6 9.6 4.6"/></svg>`,
  bolt: c => `<svg viewBox="0 0 24 24" width="100%" height="100%"><path d="M13.5 2L4 13.5h6.5L9.5 22 20 9.5h-6.6z" fill="${c || '#f5a524'}"/></svg>`,
  eye: c => `<svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="${c || '#15161c'}" stroke-width="2.2"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3.2" fill="${c || '#15161c'}"/></svg>`,
  shield: c => `<svg viewBox="0 0 24 24" width="100%" height="100%"><path d="M12 2l8 3v6c0 5-3.4 9.4-8 11-4.6-1.6-8-6-8-11V5z" fill="${c || '#3a6cf4'}"/><path d="M8.5 12l2.4 2.4L15.8 9.5" stroke="#fff" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  key: c => `<svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="${c || '#f5a524'}" stroke-width="2.4" stroke-linecap="round"><circle cx="8" cy="12" r="4.2"/><path d="M12.2 12H21M17.5 12v3.5M20.5 12v2.5"/></svg>`,
  bug: c => `<svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="${c || '#f0443a'}" stroke-width="2.2" stroke-linecap="round"><rect x="7" y="7" width="10" height="13" rx="5" fill="${c || '#f0443a'}"/><path d="M12 4v3M4 10h3M17 10h3M4 16h3M17 16h3M8 4.5l1.6 2.2M16 4.5l-1.6 2.2"/></svg>`,
  clock: c => `<svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="${c || '#15161c'}" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="12" r="9.5"/><path d="M12 6.5V12l3.6 2.4"/></svg>`,
  chat: c => `<svg viewBox="0 0 24 24" width="100%" height="100%"><path d="M4 4h16a2 2 0 012 2v10a2 2 0 01-2 2H10l-5 4v-4H4a2 2 0 01-2-2V6a2 2 0 012-2z" fill="${c || '#3a6cf4'}"/></svg>`,
  term: c => `<svg viewBox="0 0 24 24" width="100%" height="100%"><rect x="2" y="3.5" width="20" height="17" rx="3.5" fill="${c || '#15161c'}"/><path d="M6.5 9l3 3-3 3M12 15.5h5" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  play: c => `<svg viewBox="0 0 24 24" width="100%" height="100%"><circle cx="12" cy="12" r="12" fill="${c || '#15161c'}"/><path d="M9.5 7.5v9l7.5-4.5z" fill="#fff"/></svg>`,
  spark: c => `<svg viewBox="0 0 24 24" width="100%" height="100%"><path d="M12 1.5l2.4 7.1 7.1 2.4-7.1 2.4L12 20.5l-2.4-7.1L2.5 11l7.1-2.4z" fill="${c || '#8b5cf6'}"/></svg>`,
  user: c => `<svg viewBox="0 0 24 24" width="100%" height="100%"><circle cx="12" cy="12" r="12" fill="${c || '#15161c'}"/><circle cx="12" cy="9.5" r="3.6" fill="#fff"/><path d="M5.5 19.5c1.3-3.2 3.7-4.6 6.5-4.6s5.2 1.4 6.5 4.6" fill="#fff"/></svg>`,
  warn: c => `<svg viewBox="0 0 24 24" width="100%" height="100%"><path d="M12 2.5l10.5 18.5H1.5z" fill="${c || '#f5a524'}" stroke="${c || '#f5a524'}" stroke-width="1.5" stroke-linejoin="round"/><path d="M12 9v5.5" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/><circle cx="12" cy="17.6" r="1.4" fill="#fff"/></svg>`,
};
function icon(name, size = 28, c) { const e = h('span', 'icon', (IC[name] || IC.spark)(c)); e.style.width = e.style.height = size + 'px'; return e; }
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
// auto-fit: shrink font-size until the element's content fits width (and height if given). Works at build time (scenes are laid out visibly).
// measure(el, fn): run fn with el laid out. Detached elements (built but not yet placed) are mounted for the moment in a hidden box
// of H.MB size (compose sets it to the element's slot), so fit / offsetWidth work inside element factories too.
function measure(el, fn) {
  if (el.isConnected) return fn();
  let top = el; while (top.parentNode) top = top.parentNode;
  const host = document.createElement('div'), mb = window.H.MB || { w: W, h: H };
  host.style.cssText = `position:absolute;left:-30000px;top:0;width:${mb.w}px;height:${mb.h}px;visibility:hidden`; document.body.appendChild(host); host.appendChild(top);
  try { return fn(); } finally { host.remove(); top.remove(); }
}
function fit(el, w, minPx = 20, hgt) {
  return measure(el, () => {
    let fs = parseFloat(getComputedStyle(el).fontSize) || 30; let n = 0;
    while (n++ < 60 && fs > minPx && (el.scrollWidth > w + 1 || (hgt && el.scrollHeight > hgt + 1))) { fs -= 1; el.style.fontSize = fs + 'px'; }
    return fs;
  });
}
// rect of an element relative to its scene root (build time only)
function rectOf(el, root) { const a = el.getBoundingClientRect(), b = root.getBoundingClientRect(); return { x: a.left - b.left, y: a.top - b.top, w: a.width, h: a.height }; }
// a narration-synced timing lookup: ctx.at('导演') -> scene-local seconds when that phrase starts
function mkCtx(sc) {
  const words = sc.lines.flatMap(l => l.w).map(w => [w[0], w[1], w[2].replace(/\s+/g, '').toLowerCase()]); const full = words.map(w => w[2]).join('');
  const idx = []; let p = 0; for (const w of words) { idx.push(p); p += w[2].length; }
  return {
    dur: sc.dur, lines: sc.lines, id: sc.id, sc,
    at(phrase, nth = 0, fallback = 0) {
      phrase = String(phrase).replace(/\s+/g, '').toLowerCase();
      let from = 0, pos = -1; for (let i = 0; i <= nth; i++) { pos = full.indexOf(phrase, from); if (pos < 0) break; from = pos + 1; }
      if (pos < 0) { WARN.push({ scene: sc.id, kind: 'at-not-found', what: phrase }); return fallback; }
      let k = 0; while (k + 1 < idx.length && idx[k + 1] <= pos) k++; return words[k][0];
    },
    end(phrase, nth = 0) { phrase = phrase.replace(/\s+/g, '').toLowerCase(); const pos = full.indexOf(phrase); let k = 0; while (k + 1 < idx.length && idx[k + 1] < pos + phrase.length) k++; return words[k][1]; },
    line(i) { return sc.lines[i] || { s: 0, e: sc.dur }; },
    cams: [],
    // camera keyframe: at time t ease to look at (x,y) with zoom z over d seconds
    cam(t, o) { if (t == null || Number.isNaN(t)) return; this.cams.push({ t, x: o.x, y: o.y, z: o.z, d: o.d || 1.1 }); },
    // camera focus on a rect {x,y,w,h} (or element): k = how far toward it (0..1), z = zoom
    focus(t, r, o = {}) {
      if (r && r.nodeType) r = rectOf(r, this.root);
      const z = o.z ?? 1.05, k = o.k ?? .4;
      this.cam(t, { x: lerp(960, r.x + r.w / 2, k), y: lerp(560, r.y + r.h / 2, k), z, d: o.d });
    },
    // camera back to neutral
    reset(t, d = 1.1) { this.cam(t, { x: 960, y: 540, z: 1, d }); },
  };
}
// sound cues registered by scenes (absolute seconds) — exported for the mixer
const CUES = [], WARN = []; window.WARN = WARN;
window.H = { W, H, MF, WARN, cl, P, lerp, E, A, SP, rnd, h, put, set, enter, leave, type, esc, strike, count, COL, BOTS, BOT_ORDER, bot, grok, icon, IC, win, card, chip, cursor, when, spread, times, source, hl, md, fit, measure, rectOf };
window.SCENES = window.SCENES || {};
window.ARCH = window.ARCH || {};

// ---------------------------------------------------------------- stage
// theme = base gradient [c0 (edge), c1 (light center)] + 3 drifting light blobs [hex, alpha] + dark flag
const THEME = {
  paper: { base: ['#f2f0eb', '#fdfcfa'], blobs: [['#ffd6b0', .5], ['#cfdcff', .5], ['#fff0bf', .45]] },
  mint: { base: ['#dcf2e8', '#f6fcf9'], blobs: [['#9fe8cc', .5], ['#cdeeff', .5], ['#fbf3cb', .4]] },
  lavender: { base: ['#e1e4fb', '#f7f8ff'], blobs: [['#c2c7fb', .55], ['#f1d3fb', .45], ['#cdeeff', .45]] },
  lilac: { base: ['#ebe1fb', '#fbf8ff'], blobs: [['#d6c1fb', .55], ['#ffd3e9', .45], ['#d0ddff', .4]] },
  sky: { base: ['#dbe8fb', '#f5f9ff'], blobs: [['#b5d3ff', .55], ['#c2eee8', .45], ['#ecdcff', .4]] },
  sand: { base: ['#f3e9d8', '#fffaf2'], blobs: [['#ffd19c', .5], ['#ffe6b8', .5], ['#e6d6ff', .35]] },
  ice: { base: ['#e3ebf6', '#f7f9fd'], blobs: [['#c8dbf6', .55], ['#d2f1f6', .45], ['#e6dffb', .4]] },
  peach: { base: ['#f9e1d8', '#fff8f5'], blobs: [['#ffc2aa', .5], ['#ffdbec', .45], ['#ffeec2', .4]] },
  night: { base: ['#0f1436', '#1d2552'], blobs: [['#3b3fb0', .45], ['#1e6b8f', .32], ['#6b3fa8', .3]], dark: true, stars: true },
  ink: { base: ['#0b0d14', '#171b29'], blobs: [['#2f43b8', .42], ['#0f7d6e', .3], ['#6a2fa8', .32]], dark: true },
  dusk: { base: ['#170f1d', '#2a1a2e'], blobs: [['#a03e66', .36], ['#3d2fa8', .38], ['#c0702e', .24]], dark: true },
};
const BLOBPOS = [[18, 22, 62, 70], [86, 18, 58, 64], [62, 96, 70, 60]]; // x%, y%, rx%, ry%
let LK = null; // active look
const themeOf = n => { if (LK && typeof LK.themes === 'function' && !(META_THEMES && META_THEMES[n])) return LK.themes(n); const t = THEME[n] || THEME.paper; return Array.isArray(t) ? { base: t, blobs: [[t[1], .4], [t[0], .4], [t[1], .3]] } : t; };
const isDark = n => !!(LK && LK.dark) || !!themeOf(n).dark;
let META_THEMES = null;
let TL, stage, bgA, bgP, vig, dots, header, hLabel, hTitle, subEl, built = [], chap, chapSegs = [], stepB, lastStep = -2, wipeP;
function hex2rgb(x) { return [1, 3, 5].map(i => parseInt(x.slice(i, i + 2), 16)); }
function mixRGB(c1, c2, k) { const a = hex2rgb(c1), b = hex2rgb(c2); return a.map((v, i) => Math.round(lerp(v, b[i], k))); }
function mix(c1, c2, k) { return `rgb(${mixRGB(c1, c2, k).join(',')})`; }

async function boot() {
  if (document.readyState === 'loading') await new Promise(r => addEventListener('DOMContentLoaded', r));
  TL = await (await fetch('timeline.json')).json(); window.TLDATA = TL;
  try { window.BRAND = await (await fetch('brand.json')).json(); } catch (e) { window.BRAND = {}; }
  const BR = window.BRAND, META = TL.meta || {};
  const cast = META.cast || BR.cast;
  if (cast) { for (const k in BOTS) delete BOTS[k]; Object.assign(BOTS, cast); BOT_ORDER.splice(0, BOT_ORDER.length, ...Object.keys(cast)); }
  // look: tokens -> CSS variables, palettes, motion feel, background texture
  const LOOKS = window.LOOKS || {}, lookName = META.look || BR.look || 'clean';
  LK = LOOKS[lookName] || LOOKS.clean || { tokens: {}, bg: 'mesh', feel: {}, trans: 'lift', grain: .05, vig: .09, dots: true };
  if (!LOOKS[lookName]) WARN.push({ scene: '-', kind: 'unknown-look', what: lookName });
  window.LOOK = LK; window.LOOK_NAME = lookName;
  const rootS = document.documentElement.style;
  for (const [k, v] of Object.entries({ ...(window.LOOK_BASE || {}), ...(LK.tokens || {}), ...(META.tokens || {}) })) rootS.setProperty(k, v);
  Object.assign(MF, LK.feel || {}, META.feel || {});
  if (BR.themes) Object.assign(THEME, BR.themes); if (META.themes) { Object.assign(THEME, META.themes); META_THEMES = META.themes; }
  if (BR.colors) Object.assign(COL, BR.colors); if (META.colors) Object.assign(COL, META.colors);
  if (META.colors && META.colors.accent) rootS.setProperty('--accent', META.colors.accent);
  COL.accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || COL.accent;
  document.body.dataset.look = lookName; document.body.classList.toggle('look-dark', !!LK.dark);
  // preload every face/weight used anywhere (hidden scenes don't trigger loads)
  const FACES = ['400','500','600','700','800','900'].flatMap(w => [`${w} 20px Noto`, `${w} 20px Geist`]).concat(['400 20px Maple', '700 20px Maple']);
  await Promise.all(FACES.map(f => document.fonts.load(f, '中文Ab1')));
  stage = document.getElementById('stage');
  bgA = put(stage, h('div', 'bg'), 0, 0, W, H); bgP = put(stage, h('div', 'bgp'), 0, 0, W, H);
  dots = put(stage, h('div', 'dots'), -60, -60, W + 120, H + 120);
  for (let i = 0; i < 46; i++) { const d = h('i'); const s = 6 + rnd(i) * 26; Object.assign(d.style, { left: rnd(i + 9) * (W + 120) + 'px', top: rnd(i + 19) * (H + 120) + 'px', width: s + 'px', height: s + 'px', opacity: .25 + rnd(i + 29) * .5 }); d.dataset.z = (.3 + rnd(i + 39)).toFixed(2); dots.appendChild(d); }
  stars = put(stage, h('div', 'stars'), 0, 0, W, H);
  for (let i = 0; i < 90; i++) { const d = h('i'); const s = 1.5 + rnd(i + 3) * 2.5; Object.assign(d.style, { left: rnd(i + 5) * W + 'px', top: rnd(i + 7) * H * .8 + 'px', width: s + 'px', height: s + 'px' }); stars.appendChild(d); }
  const content = put(stage, h('div', 'content'), 0, 0, W, H);
  for (const sc of TL.scenes) {
    const root = put(content, h('div', 'scene'), 0, 0, W, H); root.dataset.id = sc.id;
    if (isDark(sc.theme)) root.classList.add('dk');
    const ctx = mkCtx(sc); ctx.root = root; ctx.cue = (t, type, gain = 1) => { if (t != null && !Number.isNaN(t)) CUES.push({ t: +(sc.start + t).toFixed(3), type, gain }); };
    const def = window.SCENES[sc.id] || (sc.type && window.ARCH[sc.type] ? ((r, c, HH) => window.ARCH[sc.type](r, c, HH, sc.data || {}, sc)) : null);
    if (!def) WARN.push({ scene: sc.id, kind: 'unknown-type', what: sc.type || '(none)' });
    let upd = () => { };
    root.style.display = 'block'; // lay out visibly so archetypes can measure (fit / rectOf / focus)
    if (def) { try { upd = def(root, ctx, window.H) || upd; } catch (e) { console.error('scene build failed', sc.id, e); WARN.push({ scene: sc.id, kind: 'build-error', what: String(e.message) }); root.innerHTML = `<div class="todo">${sc.id} build error: ${esc(String(e.message))}</div>`; } }
    else root.appendChild(h('div', 'todo', `TODO ${sc.id}${sc.type ? ' (unknown type ' + esc(sc.type) + ')' : ''}`));
    root.style.display = 'none';
    // script camera keys: "cam": [{at, x, y, z, d}] (added on top of archetype keys) · "cam": false disables the camera
    if (sc.cam === false) ctx.cams = [];
    else if (Array.isArray(sc.cam)) for (const k of sc.cam) ctx.cam(when(ctx, k.at, 0), k);
    ctx.cams.sort((a, b) => a.t - b.t);
    // transition sounds
    const tr = sc.trans || LK.trans; if (TL.scenes.indexOf(sc) > 0) { if (tr === 'whip' || tr === 'wipe') CUES.push({ t: +(sc.start - .05).toFixed(3), type: 'whoosh', gain: .5 }); else if (tr === 'slide' || tr === 'push') CUES.push({ t: +sc.start.toFixed(3), type: 'swoosh', gain: .35 }); }
    const AR0 = sc.type && window.ARCH[sc.type];
    const hasHeader = !!sc.title && !sc.noHeader && !(window.SCENES[sc.id] && window.SCENES[sc.id].noHeader) && !(AR0 && AR0.noHeader);
    built.push({ sc, root, upd, ctx, hasHeader });
  }
  vig = put(stage, h('div', 'vig'), 0, 0, W, H);
  ghost = put(stage, h('div', 'header'), 88, 64); ghost.style.display = 'none';
  header = put(stage, h('div', 'header'), 88, 64);
  hLabel = header.appendChild(h('div', 'hlabel')); hTitle = header.appendChild(h('div', 'htitle'));
  wipeP = put(stage, h('div', 'wipe'), 0, 0, W + 240, H); wipeP.style.display = 'none';
  subEl = put(stage, h('div', 'sub'), 0, 968); subEl.style.top = '968px';
  // chapter bar (top edge, one segment per chapter) + step badge (top-right)
  chap = put(stage, h('div', 'chap'), 0, 0, W, 6);
  const CHS = []; TL.scenes.forEach(s => { const nm = s.chapter || ''; if (!CHS.length || CHS[CHS.length - 1].name !== nm) CHS.push({ name: nm, start: s.start, end: s.start + s.dur }); else CHS[CHS.length - 1].end = s.start + s.dur; });
  if (CHS.length > 1) CHS.forEach(c => { const sg = chap.appendChild(h('div', 'seg')); sg.style.flex = String(c.end - c.start); const f = sg.appendChild(h('i')); chapSegs.push({ ...c, f }); });
  else chap.style.display = 'none';
  window.CHAPTERS = CHS;
  stepB = put(stage, h('div', 'stepb'), 0, 70); stepB.style.left = 'auto'; stepB.style.right = '88px';
  window.MAXSTEP = Math.max(0, ...TL.scenes.map(s => +s.step || 0));
  // map word timings onto the original line text (edge-tts boundaries drop spaces/punctuation)
  for (const sc of TL.scenes) for (const ln of sc.lines) {
    const ch = [...ln.text], tm = new Array(ch.length).fill(null); let p = 0;
    for (const [w0, , tx] of ln.w) { const at = ln.text.indexOf(tx, p); if (at < 0) continue; const ci = [...ln.text.slice(0, at)].length; for (let k = 0; k < [...tx].length; k++) tm[ci + k] = w0; p = at + tx.length; }
    let last = ln.s; ln.ct = tm.map(v => (v == null ? last : (last = v)));
    ln.ch = ch;
    // split into subtitle segments (<= ~26 chars), breaking after punctuation
    const PUN = '，。；：？！、,;:?!.'; const EN = /[A-Za-z]/.test(ln.text) && !/[一-鿿]/.test(ln.text);
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
  grain = put(stage, h('div', 'grain'), 0, 0, W, H); grain.style.opacity = LK.grain ?? .05;
  if (LK.dots === false) dots.style.display = 'none';
  await Promise.all(window.PRELOAD || []);
  window.CUES = CUES; window.TOTAL = TL.total; window.READY = true;
}
let stars, grain, ghost, lastHeader = -1;
function chars(text, cls) { return [...text].map(c => `<span class="${cls}">${c === ' ' ? '&nbsp;' : esc(c)}</span>`).join(''); }
const TR = .5; // transition overlap (s)
// background texture layer of the look: paper rules, blueprint grid, dot screen, light beams, CRT scanlines
function rgbOf(v, fb) { v = (v || '').trim(); if (/^#[0-9a-f]{6}$/i.test(v)) return hex2rgb(v).join(','); return fb; }
let bgMode = null, ACC = '90,92,240', ACC2 = '47,199,164', LINE = '21,22,28';
function bgPattern(T) {
  const mode = (LK && LK.bg) || 'mesh';
  if (bgMode !== mode) { bgMode = mode; const cs = getComputedStyle(document.documentElement); ACC = rgbOf(cs.getPropertyValue('--accent'), ACC); ACC2 = rgbOf(cs.getPropertyValue('--accent2'), ACC2); LINE = rgbOf(cs.getPropertyValue('--bg-ink'), LINE); bgP.style.mixBlendMode = mode === 'beams' ? 'screen' : 'normal'; }
  const S = bgP.style;
  if (mode === 'paper') { S.backgroundImage = `repeating-linear-gradient(0deg, rgba(${LINE},.045) 0 1px, transparent 1px 46px), linear-gradient(90deg, transparent 0 118px, rgba(200,50,30,.10) 118px 120px, transparent 120px)`; S.backgroundSize = ''; S.backgroundPosition = `0 ${(T * 2) % 46}px, 0 0`; }
  else if (mode === 'grid') { const o = (-T * 5) % 200; S.backgroundImage = `linear-gradient(rgba(${LINE},.07) 1px, transparent 1px), linear-gradient(90deg, rgba(${LINE},.07) 1px, transparent 1px), linear-gradient(rgba(${LINE},.16) 1.5px, transparent 1.5px), linear-gradient(90deg, rgba(${LINE},.16) 1.5px, transparent 1.5px)`; S.backgroundSize = '40px 40px, 40px 40px, 200px 200px, 200px 200px'; S.backgroundPosition = `${o}px ${o * .5}px, ${o}px ${o * .5}px, ${o}px ${o * .5}px, ${o}px ${o * .5}px`; }
  else if (mode === 'dots') { const o = (-T * 6) % 36; S.backgroundImage = `radial-gradient(circle at 3px 3px, rgba(${LINE},.2) 2.2px, transparent 2.8px)`; S.backgroundSize = '36px 36px'; S.backgroundPosition = `${o}px ${o}px`; }
  else if (mode === 'beams') { const a = Math.sin(T * .12) * 14; S.backgroundImage = `conic-gradient(from ${(160 + a).toFixed(2)}deg at 50% -20%, transparent 0deg, rgba(${ACC},.16) 8deg, transparent 18deg, rgba(${ACC2},.10) 30deg, transparent 44deg, rgba(${ACC},.12) 52deg, transparent 64deg), radial-gradient(70% 40% at 50% 110%, rgba(${ACC},.18), transparent 70%)`; S.backgroundSize = ''; S.backgroundPosition = ''; }
  else if (mode === 'scan') { const y = (T * 140) % 1300 - 200; S.backgroundImage = `repeating-linear-gradient(0deg, rgba(0,0,0,.28) 0 2px, transparent 2px 4px), linear-gradient(180deg, transparent ${y}px, rgba(${ACC},.06) ${y + 60}px, transparent ${y + 140}px)`; S.backgroundSize = ''; S.backgroundPosition = ''; }
  else if (S.backgroundImage) S.backgroundImage = '';
}
// camera state of a scene at local time t -> css transform (origin 0 0) + zoom
function camOf(b, t) {
  let x = 960, y = 540, z = 1;
  for (const k of b.ctx.cams) { const e = E.xio(P(t, k.t, k.t + k.d)); if (e <= 0) break; x = lerp(x, k.x ?? x, e); y = lerp(y, k.y ?? y, e); z = lerp(z, k.z ?? z, e); }
  const Z = z * (b.sc.push === false ? 1 : 1 + .018 * E.sine(P(t, 0, b.sc.dur)));
  if (Z >= 1) { x = cl(x, 960 / Z, W - 960 / Z); y = cl(y, 540 / Z, H - 540 / Z); }
  // gentle push-ins (<= 1.04) never crop the content box (x 88–1832, y ≤ 872 above the subtitles); deliberate close-ups (>= 1.07) may
  const safe = 1 - P(z, 1.04, 1.07); // judged on the shot's zoom, not the ambient push-in
  if (safe > 0 && Z > 1) {
    const lo = 1832 - 912 / Z, hi = 88 + 912 / Z; x = lerp(x, lo <= hi ? cl(x, lo, hi) : 960, safe);
    y = lerp(y, Math.max(y, 872 - 420 / Z), safe);
  }
  if (b.hasHeader) y = Math.min(y, 236 + 330 / Z); // keep the content top (236) below the fixed header
  return { tx: 960 - x * Z, ty: 540 - y * Z, Z };
}
const camCss = (c, dx = 0, dy = 0, ds = 1) => `translate3d(${(c.tx * ds + dx + 960 * (1 - ds)).toFixed(2)}px,${(c.ty * ds + dy + 540 * (1 - ds)).toFixed(2)}px,0) scale(${(c.Z * ds).toFixed(4)})`;
window.renderAt = function (T) {
  T = Math.max(0, Math.min(T, TL.total - 1e-3));
  let i = TL.scenes.findIndex(s => T >= s.start && T < s.start + s.dur); if (i < 0) i = TL.scenes.length - 1;
  const cur = built[i], prev = built[i - 1], t = T - cur.sc.start;
  // background: mesh gradient crossfade
  const th = themeOf(cur.sc.theme), thp = prev ? themeOf(prev.sc.theme) : th, bk = prev ? E.io(P(t, 0, .7)) : 1;
  const c0 = mix(thp.base[0], th.base[0], bk), c1 = mix(thp.base[1], th.base[1], bk);
  const layers = th.blobs.map((bb, k) => {
    const pb = thp.blobs[k] || bb, rgb = mixRGB(pb[0], bb[0], bk), al = lerp(pb[1], bb[1], bk), [px, py, rx, ry] = BLOBPOS[k];
    const x = px + Math.sin(T * .07 * (k + 1) + k * 2) * 7, y = py + Math.cos(T * .055 * (k + 1.3) + k) * 6;
    return `radial-gradient(${rx}% ${ry}% at ${x.toFixed(2)}% ${y.toFixed(2)}%, rgba(${rgb.join(',')},${al.toFixed(3)}) 0%, rgba(${rgb.join(',')},0) 100%)`;
  });
  bgA.style.background = layers.join(',') + `,radial-gradient(120% 90% at 70% 10%, ${c1} 0%, ${c0} 62%)`;
  bgPattern(T);
  const dk = (th.dark ? bk : 0) + (thp.dark && prev ? 1 - bk : 0);
  const night = (th.stars ? bk : 0) + (prev && thp.stars ? 1 - bk : 0);
  stars.style.opacity = night; dots.style.opacity = (.9 * (1 - dk) + .12 * dk).toFixed(3);
  const vg = LK.vig ?? .09, vs = LK.dark ? vg : lerp(vg, Math.max(vg, .42), dk);
  vig.style.background = vs > .005 ? `radial-gradient(130% 120% at 50% 45%, rgba(0,0,0,0) 52%, rgba(${dk > .5 ? '0,0,8' : '20,22,50'},${vs.toFixed(3)}) 100%)` : 'none';
  [...dots.children].forEach(d => { const z = +d.dataset.z; d.style.transform = `translate3d(${(-T * 6 * z).toFixed(1)}px, ${(Math.sin(T * .3 + z * 9) * 10 * z).toFixed(1)}px,0)`; });
  if (night > 0) [...stars.children].forEach((d, k) => { d.style.opacity = (.35 + .65 * Math.abs(Math.sin(T * (.6 + rnd(k) * 1.4) + k))).toFixed(2); });
  // scenes
  for (const b of built) { if (b !== cur && b !== prev) b.root.style.display = 'none'; }
  cur.root.style.display = 'block';
  try { cur.upd(t, cur.ctx); } catch (e) { console.error('scene update failed', cur.sc.id, t, e.message); }
  const trn = prev ? (cur.sc.trans || (LK && LK.trans) || 'lift') : 'none';
  const cc = camOf(cur, t);
  // entering offsets
  let ex = 0, ey = 0, es = 1, eb = 0;
  const ek = E.quart(P(t, .05, TR + .1));
  const wk = E.out(P(t, 0, .45)); // whip: both frames are flung together
  if (trn === 'slide') ex = 160 * (1 - ek);
  else if (trn === 'zoom') es = lerp(.94, 1, ek);
  else if (trn === 'whip') { ex = W * (1 - wk); eb = 28 * (1 - E.quart(P(t, .05, .4))); }
  else if (trn === 'push') ey = 200 * (1 - E.out(P(t, 0, .6)));
  else if (trn === 'lift') ey = 26 * (1 - ek);
  cur.root.style.transformOrigin = '0 0';
  cur.root.style.transform = camCss(cc, ex, ey, es);
  cur.root.style.opacity = trn === 'whip' || trn === 'wipe' || trn === 'cut' || !prev ? 1 : A(t, .04, .28, E.quart).toFixed(3);
  cur.root.style.filter = eb > .1 ? `blur(${eb.toFixed(1)}px)` : 'none';
  // exiting scene: gets out of the way fast (no double exposure of two text layouts)
  const pDur = trn === 'wipe' ? .3 : trn === 'whip' ? .45 : .34;
  if (prev && t < pDur && trn !== 'cut') {
    prev.root.style.display = 'block';
    const pt = prev.sc.dur + t; try { prev.upd(pt, prev.ctx); } catch (e) { }
    const pc = camOf(prev, prev.sc.dur), k = E.io(P(t, 0, .3));
    prev.root.style.transformOrigin = '0 0';
    if (trn === 'wipe') { prev.root.style.transform = camCss(pc, -60 * E.in(P(t, 0, .3))); prev.root.style.opacity = 1; prev.root.style.filter = 'none'; }
    else if (trn === 'whip') { prev.root.style.transform = camCss(pc, -W * wk); prev.root.style.opacity = 1; prev.root.style.filter = `blur(${(28 * Math.min(1, wk * 3) * (1 - wk * .5)).toFixed(1)}px)`; }
    else {
      prev.root.style.transform = trn === 'slide' ? camCss(pc, -160 * k) : trn === 'zoom' ? camCss(pc, 0, 0, 1 + .08 * k) : trn === 'push' ? camCss(pc, 0, -160 * k) : camCss(pc, 0, -30 * k, 1 - .03 * k);
      prev.root.style.opacity = (1 - k).toFixed(3); prev.root.style.filter = k > .02 ? `blur(${(8 * k).toFixed(1)}px)` : 'none';
    }
  } else if (prev) { prev.root.style.display = 'none'; }
  // the previous header leaves with its scene (rebuilt from the scene data, so any frame renders the same)
  const pH = prev && prev.hasHeader && trn !== 'cut' && t < pDur;
  if (pH) {
    const key = prev.sc.id; if (ghost.dataset.k !== key) { ghost.innerHTML = `<div class="hlabel"><b></b><span>${esc(prev.sc.label || '')}</span></div><div class="htitle">${esc(prev.sc.title || '')}</div>`; ghost.dataset.k = key; }
    ghost.classList.toggle('dark', isDark(prev.sc.theme)); ghost.style.display = 'block';
    const gk = trn === 'whip' ? wk : E.io(P(t, 0, .26)); set(ghost, { x: trn === 'whip' ? -W * gk : trn === 'slide' ? -120 * gk : 0, y: trn === 'whip' || trn === 'slide' ? 0 : -16 * gk, o: trn === 'whip' || trn === 'wipe' ? 1 : 1 - gk });
  } else ghost.style.display = 'none';
  // wipe panel (chapter changes): covers by t=.3, uncovers by .66
  if (trn === 'wipe' && t < .7) {
    wipeP.style.display = 'block';
    const x = t < .3 ? lerp(-W - 240, -120, E.io(P(t, 0, .3))) : lerp(-120, W + 20, E.io(P(t, .3, .68)));
    wipeP.style.transform = `translate3d(${x.toFixed(1)}px,0,0) skewX(-8deg)`;
  } else wipeP.style.display = 'none';
  // header: per-char swap, rides the scene camera
  if (lastHeader !== i) { hLabel.innerHTML = `<b></b><span>${esc(cur.sc.label || '')}</span>`; hTitle.innerHTML = chars(cur.sc.title || '', 'c'); lastHeader = i; }
  const hd = trn === 'wipe' ? .32 : 0; // under a wipe the new title waits for the panel to cover the old one
  const hc = hTitle.children, lk = A(t, .05 + hd, .5, E.quart);
  set(hLabel, { x: -14 * (1 - lk), o: lk });
  for (let k = 0; k < hc.length; k++) { const s0 = .08 + hd + k * .022, a = SP(t, s0, .9); set(hc[k], { y: 46 * (1 - a), o: A(t, s0, .3), b: 5 * (1 - A(t, s0, .35)) }); }
  const sdk = isDark(cur.sc.theme);
  header.classList.toggle('dark', sdk);
  const hf = trn === 'whip' ? 1 : .6; header.style.transform = ex || ey ? `translate3d(${(ex * hf).toFixed(1)}px,${(ey * hf).toFixed(1)}px,0)` : ''; header.style.filter = eb > .1 ? `blur(${eb.toFixed(1)}px)` : 'none';
  const AR = cur.sc.type && window.ARCH[cur.sc.type];
  const nh = (window.SCENES[cur.sc.id] && window.SCENES[cur.sc.id].noHeader) || (AR && AR.noHeader) || cur.sc.noHeader || !cur.sc.title; header.style.display = nh ? 'none' : 'block';
  // chapter bar + step badge
  chap.classList.toggle('dark', sdk);
  for (const c of chapSegs) c.f.style.transform = `scaleX(${cl((T - c.start) / (c.end - c.start)).toFixed(4)})`;
  const st = +cur.sc.step || 0;
  if (st !== lastStep) { stepB.innerHTML = st ? `<b>STEP ${st}</b><span>/ ${window.MAXSTEP}</span>` : ''; lastStep = st; }
  stepB.classList.toggle('dark', sdk);
  const sameStep = prev && (+prev.sc.step || 0) === st;
  set(stepB, { o: st ? (sameStep ? 1 : A(t, .15, .4, E.quart)) : 0, y: st && !sameStep ? -10 * (1 - A(t, .15, .5)) : 0 });
  // subtitle: active line, karaoke
  const L = cur.sc.lines; let li = -1;
  for (let k = 0; k < L.length; k++) if (t >= L[k].s - .12 && t <= L[k].e + (k < L.length - 1 ? (L[k + 1].s - L[k].e) : .5)) li = k;
  if (li >= 0 && !cur.sc.nosub) {
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

// QA: visible text that is too small for a phone (< 20px at 1080p) or off-frame, measured with the camera neutral
window.QA = function (minPx = 20) {
  const out = [];
  for (const b of built) {
    if (b.root.style.display !== 'block' || b.root.style.opacity === '0') continue;
    const tf = b.root.style.transform; b.root.style.transform = 'none';
    b.root.querySelectorAll('*').forEach(e => {
      const txt = [...e.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent).join('').trim(); if (!txt) return;
      if (e.closest('[data-noqa]')) return; // decorative text (phone status bars, gutters)
      const cs = getComputedStyle(e); if (cs.visibility === 'hidden') return;
      const r = e.getBoundingClientRect(); if (r.width < 1) return;
      let o = 1, p = e; while (p && p !== b.root) { o *= +getComputedStyle(p).opacity; p = p.parentElement; } if (o < .6) return;
      const fs = parseFloat(cs.fontSize);
      if (fs < minPx) out.push({ scene: b.sc.id, kind: 'small', fs, txt: txt.slice(0, 40) });
      if (r.right > W + 2 || r.bottom > H + 2 || r.left < -2 || r.top < -2) out.push({ scene: b.sc.id, kind: 'offframe', txt: txt.slice(0, 40) });
      // text clipped by its own box (overflow)
      if (e.scrollWidth > e.clientWidth + 4 && cs.overflow === 'hidden' && e.clientWidth > 0) out.push({ scene: b.sc.id, kind: 'clipped', txt: txt.slice(0, 40) });
    });
    b.root.style.transform = tf;
  }
  return out;
};
boot().catch(e => { window.ERR = String(e.stack || e); });
})();
