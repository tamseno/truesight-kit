// stats — big honest numbers. Up to 4 counters on top, optional comparison bars below, and a source tag.
// data: { items: [{ label: "CPU", value: 8, prefix?: "~", suffix?: " cores", dec?: 0, sub?, tone?: "bad"|"good", at? }],
//         bars?: [{ label: "Draft", value: 48, max?: 360, suffix?: " s", at? }], source? }
ARCH.stats = (root, ctx, H, d) => {
  const { set, enter, A, SP, E, P, lerp, D } = H;
  const items = d.items || [], bars = d.bars || [], n = items.length;
  const T = H.times(ctx, items, .1, bars.length ? .45 : .75), BT = H.times(ctx, bars, .55, .85);
  const GAP = 32, CW = (1744 - GAP * (n - 1)) / n, CH = bars.length ? 270 : 400, Y = bars.length ? 252 : H.vc(CH, d.source ? 40 : 0);
  const TONE = { bad: '#f0443a', good: '#1fbf75' };
  const cards = items.map((it, i) => {
    const c = H.put(root, H.card({ w: CW, h: CH }), 88 + i * (CW + GAP), Y);
    if (it.tone) D(c, 0, 0, CW, 8, `background:${TONE[it.tone]}`);
    const big = !bars.length;
    D(c, 36, 34, CW - 72, 30, 'font:800 23px Geist;letter-spacing:.12em;text-transform:uppercase;color:#8a8d99;white-space:nowrap', H.esc(it.label));
    const v = D(c, 34, big ? 96 : 74, CW - 68, big ? 150 : 120, `font:800 ${n > 3 ? 92 : big ? 136 : 110}px/1 Geist;letter-spacing:-.05em;white-space:nowrap;color:${it.tone ? TONE[it.tone] : '#15161c'}`);
    { const fv = parseFloat(it.value), fin = isNaN(fv) ? String(it.value) : (it.prefix || '') + (it.fmt ? fv.toLocaleString('en-US') : fv.toFixed(it.dec || 0)) + (it.suffix || ''); v.textContent = fin; H.fit(v, CW - 68, 48); v.textContent = ''; }
    if (big) D(c, 36, 262, 64, 6, `border-radius:3px;background:${it.tone ? TONE[it.tone] : 'var(--accent)'}`);
    const s = it.sub ? D(c, 36, CH - (big ? 92 : 70), CW - 72, 40, `font:600 ${big ? 28 : 24}px Geist,Noto;color:#6b6e7b;white-space:nowrap`, H.md(it.sub)) : null;
    return { c, v, s, it };
  });
  let bc = null, brs = [];
  if (bars.length) {
    bc = H.put(root, H.card({ w: 1744, h: 40 + bars.length * 96 }), 88, Y + CH + 28);
    const mx = Math.max(...bars.map(b => b.max || b.value));
    brs = bars.map((b, i) => {
      const y = 36 + i * 96;
      D(bc, 36, y + 6, 260, 40, 'font:800 30px Geist,Noto;white-space:nowrap', H.md(b.label));
      const tr = D(bc, 300, y + 14, 1180, 26, 'border-radius:13px;background:#eef0f5;overflow:hidden');
      const f = D(tr, 0, 0, 0, 26, `border-radius:13px;background:${b.color || '#5a5cf0'}`);
      const v = D(bc, 1500, y, 210, 56, 'text-align:right;font:800 46px Geist;letter-spacing:-.02em;white-space:nowrap');
      return { f, v, b, w: 1180 * (b.value / mx) };
    });
  }
  const src = d.source ? H.source(root, d.source) : null;
  T.forEach(x => ctx.cue(x, 'pop', .35));
  cards.forEach(({ c }, i) => ctx.focus(T[i] - .2, { x: 88 + i * (CW + GAP), y: Y, w: CW, h: CH }, { z: 1.03, k: .15, d: 1.1 })); if (n > 1) ctx.reset(T[n - 1] + 1.4, 1.4); BT.forEach(x => ctx.cue(x, 'swoosh', .25));
  return t => {
    cards.forEach(({ c, v, s, it }, i) => {
      enter(c, t, Math.min(T[i] - .25, .1 + i * .1), { dy: 50 });
      const k = E.out(P(t, T[i], T[i] + .9)), val = parseFloat(it.value);
      const num = (val * k).toFixed(it.dec || 0); v.textContent = isNaN(val) ? it.value : (it.prefix || '') + (it.fmt ? Number(num).toLocaleString('en-US') : num) + (k > .995 || !it.fmt ? (it.suffix || '') : '');
      set(v, { o: A(t, T[i] - .05, .2) }); if (s) set(s, { o: A(t, T[i] + .3, .3) });
    });
    if (bc) enter(bc, t, BT[0] - .4, { dy: 40 });
    brs.forEach(({ f, v, b, w }, i) => { const k = E.io(P(t, BT[i], BT[i] + .9)); f.style.width = (w * k).toFixed(1) + 'px'; v.textContent = (b.prefix || '') + (b.value * k).toFixed(b.dec || 0) + (b.suffix || ''); set(v, { o: A(t, BT[i], .2) }); });
    if (src) set(src, { o: A(t, .6, .4) });
  };
};
