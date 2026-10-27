// table — a comparison grid. Column heads first, then each row lands on its word; cells are ✓ / ✕ / – or short text.
// A column can be spotlighted at the end (the answer).
// data: { cols: [{ title: "Grok Bot", sub?: "outer loop", cast?, tone? }], rows: [{ label, sub?, cells: [true, false, "text"], at? }],
//         highlight?: { col: 0, at?, text?: "Use both" }, labelW?: 560 }
ARCH.table = (root, ctx, H, d, sc) => {
  const { set, enter, A, SP, E, P, lerp, D, IC } = H;
  const cols = d.cols || [], rows = d.rows || [], nc = cols.length, nr = rows.length;
  const T = H.times(ctx, rows, .1, .78);
  const vH = d.highlight && d.highlight.text ? 100 : 0, X = 88, Y = 244, W = 1744, HH = 624 - vH, LW = d.labelW || 560, CWc = (W - LW) / nc, HD = 118, RH = Math.min(104, (HH - HD - 16) / nr);
  const card = H.put(root, H.card({ w: W, h: HD + RH * nr + 16 }), X, Y + Math.max(0, (HH - HD - RH * nr - 16) / 2) - 4);
  const cy = parseFloat(card.style.top);
  const hi = d.highlight, hiT = hi ? H.when(ctx, hi.at, T[nr - 1] + 1) : 1e9;
  const spot = hi ? D(card, LW + hi.col * CWc + 8, 10, CWc - 16, HD + RH * nr - 4, 'border-radius:20px;background:color-mix(in srgb,var(--accent) 9%,transparent);box-shadow:inset 0 0 0 3px var(--accent)') : null;
  const heads = cols.map((c, i) => {
    const e = D(card, LW + i * CWc, 0, CWc, HD, 'display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;text-align:center');
    let av = null; if (c.cast && H.BOTS[c.cast]) { av = H.avatar(c.cast, 44); e.appendChild(av.el); av.el.style.position = 'relative'; }
    e.insertAdjacentHTML('beforeend', `<div class="ct" style="font:var(--fwd) 30px var(--fd);letter-spacing:calc(-.02em * var(--trk));white-space:nowrap;color:${c.tone || 'var(--ink)'}">${H.md(c.title)}</div>${c.sub ? `<div style="font:700 20px var(--fb);letter-spacing:.1em;text-transform:uppercase;color:var(--sub);white-space:nowrap">${H.esc(c.sub)}</div>` : ''}`);
    H.fit(e.querySelector('.ct'), CWc - 24, 20);
    return { e, av };
  });
  D(card, 28, HD - 1, W - 56, 2, 'background:var(--line)');
  const R = rows.map((r, i) => {
    const y = HD + 8 + i * RH;
    const bg = D(card, 14, y, W - 28, RH - 6, `border-radius:16px;${i % 2 ? '' : 'background:rgba(21,22,28,.025)'}`);
    const lb = D(card, 40, y, LW - 60, RH - 6, 'display:flex;flex-direction:column;justify-content:center', `<div class="rl" style="font:700 29px/1.15 var(--fb);letter-spacing:calc(-.01em * var(--trk));white-space:nowrap">${H.md(r.label)}</div>${r.sub ? `<div style="font:600 21px var(--fb);color:var(--sub);white-space:nowrap;margin-top:3px">${H.md(r.sub)}</div>` : ''}`);
    H.fit(lb.querySelector('.rl'), LW - 70, 22);
    const cells = (r.cells || []).map((v, j) => {
      const c = D(card, LW + j * CWc, y, CWc, RH - 6, 'display:flex;align-items:center;justify-content:center;text-align:center');
      if (v === true) c.innerHTML = `<span style="width:44px;height:44px">${IC.check()}</span>`;
      else if (v === false || v === 'x') c.innerHTML = `<span style="width:40px;height:40px;opacity:.9">${IC.x('#e4e6ee').replace('stroke="#fff"', 'stroke="#9a9daa"')}</span>`;
      else if (v == null || v === '-' || v === '–') c.innerHTML = '<span style="font:700 30px var(--fb);color:var(--sub)">–</span>';
      else { c.innerHTML = `<span class="cv" style="font:700 25px/1.2 var(--fb);white-space:nowrap">${H.md(String(v))}</span>`; H.fit(c.firstChild, CWc - 30, 18); }
      return c;
    });
    return { bg, lb, cells };
  });
  const verdict = hi && hi.text ? D(root, 88, cy + HD + RH * nr + 16 + 26, 1744, 70, 'display:flex;justify-content:center') : null;
  if (verdict) { verdict.innerHTML = `<span style="height:70px;padding:0 34px;border-radius:20px;background:var(--inv);color:var(--inv-ink);font:var(--fwd) 32px var(--fd);display:flex;align-items:center;white-space:nowrap">${H.md(hi.text)}</span>`; }
  T.forEach(x => ctx.cue(x, 'tick', .45)); if (hi) ctx.cue(hiT, 'swoosh', .35);
  if (hi) ctx.focus(hiT - .1, { x: X + LW + hi.col * CWc, y: cy, w: CWc, h: HD + RH * nr }, { z: 1.035, k: .25, d: 1.3 });
  return t => {
    enter(card, t, .05, { dy: 50 });
    heads.forEach(({ e, av }, i) => { set(e, { o: A(t, .25 + i * .1, .3), y: 14 * (1 - A(t, .25 + i * .1, .5)) }); if (av) av.update(t); });
    let cur = -1; T.forEach((x, i) => { if (t >= x - .1) cur = i; });
    R.forEach(({ bg, lb, cells }, i) => {
      const k = A(t, T[i] - .1, .3, E.quart);
      set(lb, { o: lerp(.28, 1, k), x: 16 * (1 - SP(t, T[i] - .1, .7)) * (k > 0 ? 1 : 0) });
      cells.forEach((c, j) => H.pop(c, t, T[i] + .12 + j * .1, { s0: .5 }));
      bg.style.boxShadow = i === cur && t < hiT ? 'inset 0 0 0 2px color-mix(in srgb,var(--accent) 45%,transparent)' : 'none';
    });
    if (spot) { const k = SP(t, hiT, .8); set(spot, { o: A(t, hiT, .25), s: lerp(1.04, 1, k) }); }
    if (verdict) { const k = SP(t, hiT + .3, .8); set(verdict, { o: A(t, hiT + .3, .25), y: 20 * (1 - k) }); }
  };
};
