// stepper — a state machine. Dots along a line fill as each state is reached; a big card names the current state.
// data: { steps: [{ label: "Brief", file?: "brief.md", at? }], caption?: "One look at the folder tells you where it stands" }
ARCH.stepper = (root, ctx, H, d) => {
  const { set, enter, A, SP, E, P, lerp, D, IC } = H;
  const st = d.steps || [], n = st.length, T = H.times(ctx, st, .12, .78);
  const c = H.put(root, H.card({ w: 1744, h: 300 }), 88, 250);
  const X0 = 150, X1 = 1744 - 150, dx = (X1 - X0) / Math.max(1, n - 1), LY = 120;
  const base = D(c, X0, LY - 3, X1 - X0, 6, 'border-radius:3px;background:#eef0f5');
  const fill = D(c, X0, LY - 3, X1 - X0, 6, 'border-radius:3px;background:#1fbf75;transform-origin:left');
  const dots = st.map((s, i) => {
    const x = X0 + i * dx;
    const dt = D(c, x - 26, LY - 26, 52, 52, 'border-radius:50%;background:#fff;box-shadow:inset 0 0 0 4px #d7dae3;display:flex;align-items:center;justify-content:center;font:800 22px Geist;color:#8a8d99', String(i + 1));
    const ck = D(c, x - 26, LY - 26, 52, 52, '', IC.check());
    const lb = D(c, x - 140, LY + 44, 280, 40, 'text-align:center;font:800 28px Geist,Noto;white-space:nowrap', H.md(s.label));
    const fl = s.file ? D(c, x - 160, LY + 86, 320, 30, 'text-align:center;font:600 22px Maple;color:#8a8d99;white-space:nowrap', H.esc(s.file)) : null;
    return { dt, ck, lb, fl };
  });
  const big = D(root, 88, 580, 1744, 200, 'border-radius:24px;background:#15161c;color:#fff;overflow:hidden');
  D(big, 40, 34, 600, 30, 'font:800 22px Geist;letter-spacing:.14em;color:rgba(255,255,255,.55)', 'CURRENT STATE');
  const name = D(big, 40, 76, 1660, 90, 'font:800 64px Maple;letter-spacing:-.02em;white-space:nowrap');
  const cap = d.caption ? D(root, 88, 806, 1744, 50, 'text-align:center;font:700 30px Geist,Noto', H.md(d.caption.text || d.caption)) : null;
  const tCap = cap ? H.when(ctx, d.caption.at, T[n - 1] + .8) : 0;
  T.forEach(x => ctx.cue(x, 'tick', .45));
  return t => {
    enter(c, t, .1, { dy: 50 }); enter(big, t, .3, { dy: 40 });
    let cur = 0; T.forEach((x, i) => { if (t >= x - .1) cur = i; });
    const fk = n > 1 ? (cur + E.io(P(t, T[cur], T[cur] + .4)) * 0) / (n - 1) : 1;
    let target = 0; T.forEach((x, i) => { target = lerp(target, i / Math.max(1, n - 1), E.io(P(t, x - .3, x + .1))); });
    set(fill, { sx: Math.max(.0001, target) });
    dots.forEach(({ dt, ck, lb, fl }, i) => {
      const on = t >= T[i] - .1; H.pop(ck, t, T[i] - .1, { s0: .3 });
      set(lb, { o: lerp(.35, 1, A(t, T[i] - .15, .3)) }); if (fl) set(fl, { o: lerp(.35, 1, A(t, T[i] - .15, .3)) });
      dt.style.boxShadow = i === cur + 1 ? 'inset 0 0 0 4px #1fbf75' : 'inset 0 0 0 4px #d7dae3';
    });
    const s = st[cur], label = s.file || s.label; const k = A(t, T[cur] - .1, .3);
    if (name.dataset.k !== String(cur)) { name.textContent = label; name.dataset.k = cur; }
    set(name, { o: k, y: 20 * (1 - SP(t, T[cur] - .1, .7)) });
    if (cap) set(cap, { o: A(t, tCap, .35) });
  };
};
