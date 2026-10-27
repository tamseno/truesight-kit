// e22 — the Critic can't watch an MP4, so the Render bot turns the film into images: 30-frame contact sheet, 15 frames at phone width, first & last side by side
SCENES.e22 = (root, ctx, H) => {
  const { put, h, set, enter, A, SP, E, P, lerp, cl, bot } = H;
  const D = (p, x, y, w, hh, css = '', html = '') => { const e = put(p, h('div', '', html), x, y, w, hh); if (css) e.style.cssText += ';' + css; return e; };
  const T = { critic: ctx.at('Critic'), cant: ctx.at('MP4'), rb: ctx.at('Render bot'), split: ctx.at('turns the film'), img: ctx.at('images'), sheet: ctx.at('thirty-frame'), phone: ctx.at('fifteen frames'), cmp: ctx.at('first and last'), side: ctx.at('side by side') };
  // a static frame of the smoke-test film at progress f (0..1)
  const HUES = ['#eef1f8', '#e9f6f1', '#f3eefc', '#fdf3e6'];
  function frame(w, hh, f, r = 8) {
    const el = h('div', ''); el.style.cssText = `position:absolute;width:${w}px;height:${hh}px;border-radius:${r}px;overflow:hidden;background:linear-gradient(135deg,#f4f6fb,${HUES[Math.floor(f * 3.99)]})`;
    const rise = E.io(P(f, .05, .3)), morph = E.io(P(f, .32, .58)), fall = E.out(P(f, .62, .8));
    const c = hh * .42, w0 = Math.min(w * .5, hh * .9), h0 = hh * .28;
    const ww = lerp(w0, c, morph), sh = lerp(h0, c, morph), rr = lerp(hh * .07, c / 2, morph);
    const y = hh * .8 - sh - hh * .25 * rise + hh * .25 * fall;
    const s = h('div', ''); s.style.cssText = `position:absolute;left:${(w - ww) / 2}px;top:${y}px;width:${ww}px;height:${sh}px;border-radius:${rr}px;background:#15161c`;
    el.appendChild(s); return el;
  }
  const PY = 296, PH = 604;
  // ---------- final.mp4 card
  const vc = put(root, H.card({ w: 440, h: PH }), 100, PY);
  D(vc, 26, 22, 300, 30, 'font:700 20px Maple;display:flex;align-items:center;gap:10px', '<span style="width:24px;height:24px;border-radius:6px;background:#15161c;display:inline-flex;align-items:center;justify-content:center"><svg width="10" height="12" viewBox="0 0 10 12"><path d="M1 1l8 5-8 5z" fill="#fff"/></svg></span>final.mp4');
  const qa = D(vc, 316, 18, 98, 34, 'border-radius:999px;background:#eceeff;color:#5a5cf0;font:700 17px Maple;display:flex;align-items:center;justify-content:center', 'qa.sh');
  const pl = D(vc, 24, 66, 392, 220, 'border-radius:14px;overflow:hidden;background:#eef1f8');
  const plF = []; for (let i = 0; i < 12; i++) { const f = frame(392, 220, i / 11, 0); pl.appendChild(f); plF.push(f); }
  const gridL = D(pl, 0, 0, 392, 220, `background-image:linear-gradient(90deg,rgba(90,92,240,.75) 2px,transparent 2px),linear-gradient(rgba(90,92,240,.75) 2px,transparent 2px);background-size:${392 / 5}px ${220 / 6}px;background-position:-1px -1px`);
  const nope = D(pl, 66, 74, 260, 72, 'border-radius:999px;background:rgba(21,22,28,.88);display:flex;align-items:center;justify-content:center;gap:12px;color:#fff;font:800 25px Geist;white-space:nowrap', `<span style="width:38px;height:38px">${H.IC.x()}</span>Can't watch MP4`);
  const prog = D(vc, 24, 302, 392, 6, 'border-radius:3px;background:#eef0f5');
  const progF = D(prog, 0, 0, 0, 6, 'border-radius:3px;background:#15161c');
  D(vc, 24, 318, 392, 24, 'font:600 17px Maple;color:#8a8d99', '0:15 · 1920×1080 · 60fps');
  D(vc, 24, 370, 392, 1, 'background:rgba(21,22,28,.08)');
  const rbW = D(vc, 24, 384, 392, 40, 'display:flex;align-items:center;gap:10px;font:700 17px Geist;color:#8a8d99;letter-spacing:.08em;white-space:nowrap');
  const rbot = bot('render', 36); rbot.el.style.position = 'relative'; rbW.appendChild(rbot.el); rbW.appendChild(h('span', '', 'RENDER BOT → IMAGES'));
  const outs = ['contact.png', 'phone.png', 'first-last.png'].map((n, i) => {
    const r = D(vc, 24, 432 + i * 54, 392, 46, 'border-radius:12px;background:#f3f3fd;display:flex;align-items:center;gap:12px;padding:0 14px;font:700 19px Maple');
    r.innerHTML = `<span style="width:22px;height:22px">${H.IC.file('#cfd0fa')}</span><span style="flex:1">${n}</span>`;
    const ck = r.appendChild(H.icon('check', 24)); return { r, ck };
  });
  const cb = bot('critic', 86); put(root, cb.el, 600, 212);
  const cbTag = D(root, 696, 236, null, null, 'font:700 19px Geist;color:#8b5cf6;background:#f3edff;border-radius:10px;padding:6px 12px;white-space:nowrap', 'Critic reads images only');

  // ---------- panels
  const mkPanel = (x, w, file, title, tag) => {
    const c = put(root, H.card({ w, h: PH }), x, PY);
    D(c, 22, 20, w - 44, 22, 'font:600 16px Maple;color:#a3a6b3', file);
    if (tag) D(c, w - 86, 16, 64, 28, 'border-radius:8px;background:#f3f4f7;font:700 16px Maple;color:#6b6e7b;display:flex;align-items:center;justify-content:center', tag);
    D(c, 22, 46, w - 44, 40, 'font:800 28px Geist;white-space:nowrap;letter-spacing:-.01em', title);
    const ring = D(c, 0, 0, w, PH, 'border-radius:22px;box-shadow:inset 0 0 0 3px #8b5cf6');
    return { c, ring };
  };
  const cs = mkPanel(570, 560, 'contact.png', '30-frame contact sheet', '5 × 6');
  const pp = mkPanel(1160, 300, 'phone.png', 'Phone width', '× 15');
  const cp = mkPanel(1490, 340, 'first-last.png', 'First vs last');
  const TWd = 92, THt = 52, GX = 10, GY = 10, CX0 = 570 + 24, CY0 = PY + 108;
  const tiles = [];
  for (let i = 0; i < 30; i++) {
    const cxx = i % 5, ry = Math.floor(i / 5), x = 24 + cxx * (TWd + GX), y = 108 + ry * (THt + GY);
    D(cs.c, x, y, TWd, THt, 'border-radius:8px;border:2px dashed #e3e4ea');
    const tl = frame(TWd, THt, i / 29, 8); tl.style.left = (CX0 + cxx * (TWd + GX)) + 'px'; tl.style.top = (CY0 + ry * (THt + GY)) + 'px'; tl.style.boxShadow = '0 0 0 1px rgba(21,22,28,.06)';
    tiles.push({ el: tl, dx: 320 - (CX0 + cxx * (TWd + GX) + TWd / 2), dy: (PY + 176) - (CY0 + ry * (THt + GY) + THt / 2) });
  }
  const look = D(cs.c, 24, 500, 512, 70, 'display:flex;align-items:center;gap:10px;font:700 19px Geist;color:#8a8d99;white-space:nowrap', 'Checks');
  ['pacing', 'change', 'dead frames'].forEach(s => { const c = H.chip(s, '#8b5cf6'); c.style.font = '700 17px Geist'; look.appendChild(c); });
  const phone = D(pp.c, 46, 106, 208, 400, 'border-radius:30px;border:4px solid #15161c;background:#fbfbfd');
  D(phone, 74, 10, 52, 8, 'border-radius:4px;background:#15161c');
  const ptiles = []; for (let i = 0; i < 15; i++) { const cxx = i % 3, ry = Math.floor(i / 3); D(phone, 14 + cxx * 60, 34 + ry * 70, 52, 60, 'border-radius:7px;border:2px dashed #e3e4ea'); const f = frame(52, 60, i / 14, 7); put(phone, f, 14 + cxx * 60, 34 + ry * 70); ptiles.push(f); }
  const pnote = D(pp.c, 22, 522, 256, 56, 'display:flex;align-items:center;justify-content:center'); { const c = H.chip('390 px · readable?', '#8b5cf6'); c.style.font = '700 17px Geist'; pnote.appendChild(c); }
  const cmp = [0, 1].map(k => {
    const y = 106 + k * 222;
    D(cp.c, 24, y, 292, 164, 'border-radius:12px;border:2px dashed #e3e4ea');
    const f = frame(292, 164, k ? 1 : 0, 12); put(cp.c, f, 24, y);
    const lb = D(cp.c, 36, y + 12, 70, 30, 'border-radius:8px;background:rgba(255,255,255,.92);font:800 17px Geist;display:flex;align-items:center;justify-content:center', k ? 'Last' : 'First');
    return { f, lb };
  });
  const sw = D(cp.c, 146, 276, 48, 48, 'border-radius:50%;background:#8b5cf6;display:flex;align-items:center;justify-content:center;box-shadow:0 8px 20px -8px rgba(139,92,246,.8)', '<svg width="26" height="26" viewBox="0 0 24 24"><path d="M8 4v14m0 0l-3.5-3.5M8 18l3.5-3.5M16 20V6m0 0l-3.5 3.5M16 6l3.5 3.5" stroke="#fff" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>');
  const cnote = D(cp.c, 22, 522, 296, 56, 'display:flex;align-items:center;justify-content:center'); { const c = H.chip('Does the loop close?', '#8b5cf6'); c.style.font = '700 17px Geist'; cnote.appendChild(c); }
  const fly = put(root, h('div', ''), 0, 0, 1920, 1080); fly.style.pointerEvents = 'none'; tiles.forEach(o => fly.appendChild(o.el));

  ctx.cue(.15, 'swoosh', .5); ctx.cue(T.critic - .1, 'pop', .45); ctx.cue(T.cant + .2, 'error', .5); ctx.cue(T.rb, 'pop', .35); ctx.cue(T.split + .4, 'whoosh', .5);
  ctx.cue(T.sheet, 'swoosh', .45); ctx.cue(T.phone, 'pop', .4); ctx.cue(T.cmp, 'pop', .4); ctx.cue(T.side + .2, 'ding', .45);
  const actAt = [T.sheet - .1, T.phone - .1, T.cmp - .1];
  return (t) => {
    enter(vc, t, .1, { dy: 60, rx: 12 });
    const bk = SP(t, T.critic - .2, .9); set(cb.el, { y: 40 * (1 - bk), s: lerp(.5, 1, bk), o: A(t, T.critic - .2, .2) });
    set(cbTag, { o: A(t, T.cant + .4, .3), x: -14 * (1 - A(t, T.cant + .4, .5)) });
    const act = t < actAt[0] ? -1 : t < actAt[1] ? 0 : t < actAt[2] ? 1 : 2;
    cb.update(t, { lookX: act < 0 ? -.8 : [.3, .8, 1][act], lookY: act < 0 ? .5 : .2 });
    const playing = t < T.cant + .2; const pf = playing ? ((t / 2.4) % 1) : ((T.cant + .2) / 2.4) % 1;
    const fi = Math.floor(pf * 11.99); plF.forEach((f, i) => f.style.opacity = i === fi ? 1 : 0);
    progF.style.width = (392 * pf).toFixed(1) + 'px';
    pl.style.filter = !playing ? `grayscale(${A(t, T.cant + .2, .3).toFixed(2)})` : 'none';
    const nk = SP(t, T.cant + .2, .7); set(nope, { s: lerp(.6, 1, nk), o: A(t, T.cant + .2, .2) * (1 - A(t, T.split + .2, .3)) });
    set(rbW, { o: A(t, T.rb - .1, .3), x: -12 * (1 - A(t, T.rb - .1, .4)) }); rbot.update(t, { lookX: .6 });
    const gk = A(t, T.split + .3, .5, E.quart); gridL.style.clipPath = `inset(0 ${(100 - gk * 100).toFixed(1)}% 0 0)`; set(gridL, { o: gk * (1 - .6 * A(t, T.sheet + .8, .5)) });
    set(qa, { s: lerp(.6, 1, SP(t, T.rb, .7)), o: A(t, T.rb, .2) });
    [cs, pp, cp].forEach((p, i) => { enter(p.c, t, .3 + i * .1, { dy: 60, rx: 12 }); set(p.ring, { o: A(t, actAt[i], .3) * (i < 2 ? 1 - A(t, actAt[i + 1], .4) : 1) }); });
    outs.forEach((o, i) => { const s = actAt[i] + .6; set(o.r, { o: .4 * A(t, T.img + i * .1, .4) + .6 * A(t, s - .2, .3), x: 14 * (1 - A(t, T.img + i * .1, .5)) }); set(o.ck, { s: lerp(.3, 1, SP(t, s + .2, .6)), o: A(t, s + .2, .15) }); });
    tiles.forEach((o, i) => {
      const s = T.sheet - .15 + i * .025, k = A(t, s, .55, E.quart);
      set(o.el, { x: o.dx * (1 - k), y: o.dy * (1 - k) - 40 * Math.sin(k * Math.PI), s: lerp(.35, 1, k), o: A(t, s, .12), r: 8 * (1 - k) * (i % 2 ? 1 : -1) });
    });
    set(look, { o: A(t, T.sheet + .9, .4) });
    ptiles.forEach((f, i) => { const s = T.phone - .05 + i * .035, k = SP(t, s, .6); set(f, { s: lerp(.5, 1, k), o: A(t, s, .15) }); });
    set(pnote, { o: A(t, T.phone + .7, .4) });
    cmp.forEach((c, k) => { const s = T.cmp - .05 + k * .25, q = SP(t, s, .8); set(c.f, { y: 20 * (1 - q), s: lerp(.9, 1, q), o: A(t, s, .2) }); set(c.lb, { o: A(t, s + .2, .3) }); });
    set(sw, { s: lerp(.4, 1, SP(t, T.side - .1, .7)), r: 180 * (1 - A(t, T.side - .1, .7)), o: A(t, T.side - .1, .2) });
    set(cnote, { o: A(t, T.side + .2, .4) });
  };
};
