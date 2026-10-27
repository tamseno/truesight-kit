// cards — 2–4 columns of "problem → fix". The problem lands first; the fix rises into the card when spoken.
// data: { items: [{ title: "Usage runs out", sub?, icon?: "key"|"shield"|..., tag?: "RISK", fix: "Keep checks cheap, cap runs", at?, fixAt? }],
//         fixLabel?: "THE FIX", source? }
ARCH.cards = (root, ctx, H, d) => {
  const { set, enter, A, SP, E, P, lerp, D, IC } = H;
  const it = d.items || [], n = it.length, T = H.times(ctx, it, .08, .8);
  const FT = it.map((x, i) => H.when(ctx, x.fixAt, T[i] + Math.min(1.4, ((T[i + 1] ?? ctx.dur - .6) - T[i]) * .5)));
  const GAP = 28, CW = (1744 - GAP * (n - 1)) / n, HH = 540, Y = H.vc(HH, d.source ? 40 : 0);
  const TOP = 300; // problem area height; the fix panel sits right under it
  const C = it.map((x, i) => {
    const c = H.put(root, H.card({ w: CW, h: HH }), 88 + i * (CW + GAP), Y);
    const ic = D(c, 30, 30, 64, 64, 'border-radius:18px;background:#fff1f0;display:flex;align-items:center;justify-content:center', `<span style="width:36px;height:36px">${(IC[x.icon] || IC.warn)('#f0443a')}</span>`);
    D(c, 108, 44, CW - 140, 36, '', H.tag(x.tag || 'RISK', '#f0443a'));
    const tt = D(c, 30, 116, CW - 60, 100, 'font:800 38px/1.15 Geist,Noto;letter-spacing:-.025em', H.md(x.title)); H.fit(tt, CW - 60, 26, 100);
    if (x.sub) { const s = D(c, 30, 222, CW - 60, 66, 'font:600 25px/1.3 Geist,Noto;color:#8a8d99', H.md(x.sub)); H.fit(s, CW - 60, 20, 66); }
    const fx = D(c, 16, TOP, CW - 32, HH - TOP - 16, 'border-radius:18px;background:#e9f9f1;box-shadow:inset 0 0 0 2px rgba(31,191,117,.35)');
    D(fx, 24, 22, CW - 80, 30, 'display:flex;align-items:center;gap:10px;font:800 22px Geist;letter-spacing:.14em;color:#13a463', `<span style="width:28px;height:28px">${IC.check()}</span>${H.esc(d.fixLabel || 'THE FIX')}`);
    const ft = D(fx, 24, 66, CW - 80, HH - TOP - 16 - 84, 'font:800 33px/1.2 Geist,Noto;letter-spacing:-.015em;color:#0d5c39', H.md(x.fix || '')); H.fit(ft, CW - 80, 22, HH - TOP - 16 - 84);
    return { c, fx, ic };
  });
  const src = d.source ? H.source(root, d.source, Math.min(892, Y + HH + 22)) : null;
  T.forEach(x => ctx.cue(x, 'tick', .4)); FT.forEach(x => ctx.cue(x, 'pop', .4));
  C.forEach((_, i) => ctx.focus(T[i] - .2, { x: 88 + i * (CW + GAP), y: Y, w: CW, h: HH }, { z: 1.03, k: .14, d: 1.2 }));
  if (n) ctx.reset(FT[n - 1] + 1.2, 1.4);
  return t => {
    let cur = -1; T.forEach((x, i) => { if (t >= x - .2) cur = i; });
    C.forEach(({ c, fx, ic }, i) => {
      enter(c, t, Math.min(T[i] - .25, .1 + i * .1), { dy: 50 });
      H.dof(c, cur < 0 || t >= FT[n - 1] + .8 ? 1 : i === cur ? 1 : i < cur ? .85 : .6, { o: .55, b: 1.6 });
      H.pop(ic, t, T[i] - .1, { s0: .5, r: -20 });
      const k = SP(t, FT[i], .8); set(fx, { y: 50 * (1 - k), o: A(t, FT[i], .2) });
    });
    if (src) set(src, { o: A(t, .6, .4) });
  };
};
