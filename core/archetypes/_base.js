// Shared helpers for archetypes. Loaded first (underscore sorts before letters).
// Layout grid (1920x1080): header 64–200 · content 240–872 · source tag 892 · subtitle 968–1036 · side margins 88.
(() => {
  const H = window.H;
  H.D = (p, x, y, w, hh, css = '', html = '') => { const e = H.put(p, H.h('div', '', html), x, y, w, hh); if (css) e.style.cssText += ';' + css; return e; };
  H.BOX = { x: 88, y: 240, w: 1744, h: 632, r: 1832, b: 872 };
  // pop-in for small things (badges, dots, stamps)
  H.pop = (el, t, s, o = {}) => { const k = H.SP(t, s, o.d || .75); H.set(el, { s: H.lerp(o.s0 ?? .55, 1, k), o: H.A(t, s, .14) * (o.o ?? 1), y: (o.dy || 0) * (1 - k), x: (o.dx || 0) * (1 - k), r: (o.r || 0) * (1 - k) }); return k; };
  // fade-in only
  H.fade = (el, t, s, d = .3) => { const k = H.A(t, s, d, H.E.quart); H.set(el, { o: k }); return k; };
  // a row "dim until its moment, then full": returns k
  H.focus = (el, t, s, base = .38) => { const k = H.A(t, s - .05, .3, H.E.quart); H.set(el, { o: H.lerp(base, 1, k) }); return k; };
  // depth of field: on = 1 -> sharp & full; on = 0 -> pushed back (dim, soft, slightly smaller)
  //   call it AFTER enter()/set() in the same frame: it multiplies the opacity and adds to the blur they wrote
  H.dof = (el, on, o = {}) => {
    const k = H.cl(on), op = parseFloat(el.style.opacity || '1'), m = /blur\(([\d.]+)px\)/.exec(el.style.filter || ''), b0 = m ? +m[1] : 0;
    el.style.opacity = (op * H.lerp(o.o ?? .42, 1, k)).toFixed(3); const b = b0 + (o.b ?? 2.2) * (1 - k);
    el.style.filter = b > .05 ? `blur(${b.toFixed(2)}px)` : 'none'; el.style.scale = H.lerp(o.s ?? .985, 1, k).toFixed(4);
  };
  // badge pill html
  H.tag = (text, c = '#3a6cf4', filled = false) => `<span style="display:inline-flex;align-items:center;height:36px;padding:0 15px;border-radius:999px;font:800 20px var(--fb);letter-spacing:.08em;white-space:nowrap;${filled ? `background:${c};color:#fff` : `background:color-mix(in srgb,${c} 15%,transparent);color:color-mix(in srgb,${c} 62%,var(--ink))`}">${H.esc(text)}</span>`;
  // preload an image (engine waits for window.PRELOAD before READY)
  H.img = src => { const im = new Image(); im.src = src; (window.PRELOAD = window.PRELOAD || []).push(im.decode().catch(() => console.warn('image failed', src))); return im; };
  H.vc = (hh, extra = 0) => 240 + Math.max(0, (632 - hh - extra) / 2);
  H.castOf = k => (k && H.BOTS[k]) ? H.BOTS[k] : null;
  // the viewer / user as a token-colored glyph
  H.youSvg = `<svg viewBox="0 0 24 24" width="100%" height="100%"><circle cx="12" cy="12" r="12" style="fill:var(--ink)"/><circle cx="12" cy="9.5" r="3.6" style="fill:var(--surface)"/><path d="M5.5 19.5c1.3-3.2 3.7-4.6 6.5-4.6s5.2 1.4 6.5 4.6" style="fill:var(--surface)"/></svg>`;
  // avatar: cast mascot, "you" (person), or a colored initial. returns {el, update(t)}
  H.avatar = (who, size = 56) => {
    const w = H.h('div', ''); w.style.cssText = `position:relative;width:${size}px;height:${size}px;flex:none`;
    if (H.BOTS[who]) { const b = H.bot(who, size); w.appendChild(b.el); return { el: w, update: (t, o) => b.update(t, o) }; }
    if (!who || who === 'you' || who === 'user') { w.innerHTML = H.youSvg; return { el: w, update: () => { } }; }
    w.innerHTML = `<div style="width:100%;height:100%;border-radius:50%;background:var(--inv);color:var(--inv-ink);font:800 ${Math.round(size * .42)}px Geist;display:flex;align-items:center;justify-content:center">${H.esc(String(who)[0].toUpperCase())}</div>`;
    return { el: w, update: () => { } };
  };
  H.nameOf = who => (H.BOTS[who] && H.BOTS[who].name) || (who === 'you' || !who ? 'You' : who);
  H.colorOf = (who, fb = 'var(--ink)') => (H.BOTS[who] && H.BOTS[who].c) || fb;

  // ---- syntax highlighting for the code archetype (md | js | ts | py | sh | yaml | json | diff-aware)
  const KW = {
    js: 'const let var function return if else for while await async import from export new class extends try catch throw of in default',
    py: 'def class return if elif else for while in import from as with not and or None True False try except raise yield lambda pass',
    sh: 'if then fi for do done in export sudo',
  };
  const kwRe = l => new RegExp(`\\b(${(KW[l] || KW.js).split(' ').join('|')})\\b`, 'g');
  H.syntax = (line, lang = 'js') => {
    const e = H.esc;
    if (lang === 'md') {
      if (/^\s*#/.test(line)) return `<span class="h">${e(line)}</span>`;
      if (/^\s*<!--/.test(line)) return `<span class="c">${e(line)}</span>`;
      let s = e(line).replace(/`([^`]+)`/g, '<span class="t">`$1`</span>').replace(/\*\*([^*]+)\*\*/g, '<span class="n">**$1**</span>').replace(/(^|\s)(\/[a-z0-9-]+)/g, '$1<span class="f">$2</span>');
      return s.replace(/^(\s*)([-*]|\d+\.)(\s)/, '$1<span class="p">$2</span>$3');
    }
    if (lang === 'yaml') { const m = line.match(/^(\s*-?\s*)([\w.-]+)(:)(.*)$/); if (/^\s*#/.test(line)) return `<span class="c">${e(line)}</span>`; if (m) return `${e(m[1])}<span class="f">${e(m[2])}</span>${m[3]}<span class="s">${e(m[4])}</span>`; return e(line); }
    // generic C-like / py / sh tokenizer
    const cm = lang === 'py' || lang === 'sh' ? '#' : '//';
    const ci = line.indexOf(cm); let code = line, com = '';
    if (ci >= 0 && !/["'`]/.test(line.slice(0, ci))) { code = line.slice(0, ci); com = line.slice(ci); }
    const parts = code.split(/("[^"]*"|'[^']*'|`[^`]*`)/g).map((p, i) => {
      if (i % 2) return `<span class="s">${e(p)}</span>`;
      let s = e(p).replace(kwRe(lang), '<span class="k">$1</span>').replace(/\b(\d[\d_.]*)\b/g, '<span class="n">$1</span>').replace(/([A-Za-z_$][\w$]*)(?=\()/g, '<span class="f">$1</span>');
      if (lang === 'sh') s = s.replace(/(^|\s)(--?[\w-]+)/g, '$1<span class="t">$2</span>');
      return s;
    });
    return parts.join('') + (com ? `<span class="c">${e(com)}</span>` : '');
  };

  // ---- mock phone screen (proof screenshots without real assets). o: {title, rows, button, bad, w, h, accent}
  H.phone = (o = {}) => {
    const w = o.w || 300, hh = o.h || 600, acc = o.accent || '#5a5cf0';
    const el = H.h('div', ''); el.style.cssText = `position:relative;width:${w}px;height:${hh}px;border-radius:44px;background:#0f1016;padding:12px;box-shadow:0 30px 70px -24px rgba(20,24,60,.45)`;
    const scr = el.appendChild(H.h('div', '')); scr.style.cssText = `position:relative;width:100%;height:100%;border-radius:34px;background:var(--fill);overflow:hidden`;
    scr.innerHTML = `<div data-noqa style="height:44px;display:flex;align-items:center;justify-content:space-between;padding:0 26px;font:700 15px var(--fb);color:var(--ink)"><span>9:41</span><span style="width:70px;height:20px;border-radius:12px;background:#0f1016"></span><span>●●●</span></div>
      <div style="padding:10px 22px 0;font:800 26px var(--fb);letter-spacing:calc(-.02em * var(--trk));color:var(--ink)">${H.esc(o.title || 'Welcome')}</div>
      ${(o.rows || [72, 88, 60]).map((r, i) => `<div style="margin:${i ? 12 : 22}px 22px 0;height:${i ? 14 : 120}px;width:${i ? r : 100}%;border-radius:${i ? 7 : 18}px;background:${i ? '#e7e8ef' : `linear-gradient(135deg,${acc}33,${acc}14)`}"></div>`).join('')}`;
    const btn = scr.appendChild(H.h('div', '', H.esc(o.button || 'Continue')));
    btn.style.cssText = `position:absolute;left:${o.bad ? 60 : 22}px;width:${o.bad ? w - 24 - 22 : w - 24 - 44}px;bottom:${o.bad ? 18 : 30}px;height:58px;border-radius:16px;background:${acc};color:#fff;font:800 21px var(--fb);display:flex;align-items:center;justify-content:center;white-space:nowrap`;
    if (o.bad) { const m = scr.appendChild(H.h('div', '')); m.style.cssText = `position:absolute;right:-4px;bottom:8px;width:${w * .55}px;height:80px;border-radius:14px;border:3px dashed #f0443a;background:rgba(240,68,58,.08)`; }
    el.btn = btn; return el;
  };
})();
