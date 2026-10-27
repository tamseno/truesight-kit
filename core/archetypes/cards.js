// cards — 2–4 columns of "problem → fix". The problem shows first; the fix slides up underneath when spoken.
// data: { items: [{ title: "Usage runs out", tag?: "RISK", fix: "Keep checks cheap, cap runs", at?, fixAt? }], fixLabel?: "THE FIX" }
ARCH.cards = (root, ctx, H, d) => {
  const { set, enter, A, SP, E, lerp, D } = H;
  const it = d.items || [], n = it.length, T = H.times(ctx, it, .08, .8);
  const FT = it.map((x, i) => H.when(ctx, x.fixAt, T[i] + Math.min(1.4, ((T[i + 1] ?? ctx.dur - .6) - T[i]) * .5)));
  const GAP = 28, CW = (1744 - GAP * (n - 1)) / n, Y = 250, HH = 612;
  const C = it.map((x, i) => {
    const c = H.put(root, H.card({ w: CW, h: HH }), 88 + i * (CW + GAP), Y);
    D(c, 30, 30, CW - 60, 34, '', H.tag(x.tag || 'RISK', '#f0443a'));
    D(c, 30, 84, CW - 60, 130, 'font:800 38px/1.15 Geist,Noto;letter-spacing:-.02em', H.md(x.title));
    if (x.sub) D(c, 30, 220, CW - 60, 80, 'font:600 23px/1.3 Geist,Noto;color:#8a8d99', H.md(x.sub));
    const fx = D(c, 16, HH - 266, CW - 32, 250, 'border-radius:18px;background:#e9f9f1;box-shadow:inset 0 0 0 2px rgba(31,191,117,.35)');
    D(fx, 24, 22, CW - 80, 30, 'font:800 22px Geist;letter-spacing:.14em;color:#13a463', H.esc(d.fixLabel || 'THE FIX'));
    D(fx, 24, 62, CW - 80, 170, 'font:800 32px/1.2 Geist,Noto;letter-spacing:-.015em;color:#0d5c39', H.md(x.fix || ''));
    return { c, fx };
  });
  T.forEach(x => ctx.cue(x, 'tick', .4)); FT.forEach(x => ctx.cue(x, 'pop', .4));
  return t => C.forEach(({ c, fx }, i) => {
    enter(c, t, T[i] - .25, { dy: 50 });
    const k = SP(t, FT[i], .8); set(fx, { y: 40 * (1 - k), o: A(t, FT[i], .2) });
    set(c, { o: lerp(1, 1, 0) }); // keep card visible
  });
};
