// Shared helpers for archetypes. Loaded first (underscore sorts before letters).
// Layout grid (1920x1080): header 64–200 · content 240–872 · source tag 892 · subtitle 968–1036 · side margins 88.
(() => {
  const H = window.H;
  H.D = (p, x, y, w, hh, css = '', html = '') => { const e = H.put(p, H.h('div', '', html), x, y, w, hh); if (css) e.style.cssText += ';' + css; return e; };
  H.BOX = { x: 88, y: 240, w: 1744, h: 632, r: 1832, b: 872 };
  // pop-in for small things (badges, dots, stamps)
  H.pop = (el, t, s, o = {}) => { const k = H.SP(t, s, o.d || .75); H.set(el, { s: H.lerp(o.s0 ?? .55, 1, k), o: H.A(t, s, .14), y: (o.dy || 0) * (1 - k), r: (o.r || 0) * (1 - k) }); return k; };
  // fade-in only
  H.fade = (el, t, s, d = .3) => { const k = H.A(t, s, d, H.E.quart); H.set(el, { o: k }); return k; };
  // a row "dim until its moment, then full": returns k
  H.focus = (el, t, s, base = .38) => { const k = H.A(t, s - .05, .3, H.E.quart); H.set(el, { o: H.lerp(base, 1, k) }); return k; };
  // badge pill html
  H.tag = (text, c = '#3a6cf4', filled = false) => `<span style="display:inline-flex;align-items:center;height:34px;padding:0 14px;border-radius:999px;font:800 20px Geist;letter-spacing:.08em;white-space:nowrap;${filled ? `background:${c};color:#fff` : `background:color-mix(in srgb,${c} 13%,#fff);color:${c}`}">${H.esc(text)}</span>`;
  // preload an image (engine waits for window.PRELOAD before READY)
  H.img = src => { const im = new Image(); im.src = src; (window.PRELOAD = window.PRELOAD || []).push(im.decode().catch(() => console.warn('image failed', src))); return im; };
  H.vc = (hh, extra = 0) => 240 + Math.max(0, (632 - hh - extra) / 2);
  H.castOf = k => (k && H.BOTS[k]) ? H.BOTS[k] : null;
})();
