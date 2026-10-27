// scorecard — a rubric. Round 1 fills, failing rows flag red, the worst ones go back; round 2 fills and passes.
// data: { title?: "Critic scorecard", file?: "review_log.md", threshold?: 8, max?: 10,
//         rows: [{ label: "Hook", sub?: "first 2 s", r1: 5, r2?: 8, issue?: "Hook is flat" }],
//         r1At?, flagAt?, r2At?, side?: [{ text, sub?, at? }] }
ARCH.scorecard = (root, ctx, H, d) => {
  const { set, enter, A, SP, E, P, lerp, D } = H;
  const rows = d.rows || [], thr = d.threshold || 8, MX = d.max || 10, two = rows.some(r => r.r2 != null);
  const t1 = H.when(ctx, d.r1At, H.spread(ctx, 0, 3, .12, .8)), tF = H.when(ctx, d.flagAt, H.spread(ctx, 1, 3, .12, .8)), t2 = two ? H.when(ctx, d.r2At, H.spread(ctx, 2, 3, .12, .8)) : 1e9;
  const side = d.side || [], SW = side.length ? 560 : 0, CW = 1744 - SW - (SW ? 32 : 0), Y = 250, HH = 612;
  const c = H.put(root, H.card({ w: CW, h: HH }), 88, Y);
  D(c, 36, 28, CW - 300, 44, 'font:800 32px Geist;display:flex;align-items:baseline;gap:14px;white-space:nowrap', `${H.esc(d.title || 'Scorecard')}${d.file ? `<span style="font:600 22px Maple;color:#a3a6b3">${H.esc(d.file)}</span>` : ''}`);
  const round = D(c, CW - 36 - 180, 26, 180, 46, 'border-radius:999px;background:#f0eafe;color:#7c4ff0;font:800 22px Geist;display:flex;align-items:center;justify-content:center');
  const RY = 104, RH = Math.min(80, (HH - 200) / rows.length), BX = 360, BW = CW - BX - 190;
  const R = rows.map((r, i) => {
    const y = RY + i * RH;
    const hl = D(c, 20, y + 4, CW - 40, RH - 8, 'border-radius:14px;background:rgba(240,68,58,.07);box-shadow:inset 0 0 0 2px rgba(240,68,58,.45)');
    D(c, 40, y + RH / 2 - 21, 320, 42, 'font:700 30px Geist,Noto;white-space:nowrap;display:flex;align-items:baseline;gap:10px', `${H.esc(r.label)}${r.sub ? `<span style="font:600 22px Geist;color:#8a8d99">${H.esc(r.sub)}</span>` : ''}`);
    const tr = D(c, BX, y + RH / 2 - 9, BW, 18, 'border-radius:9px;background:#eef0f5;overflow:hidden');
    const f = D(tr, 0, 0, 0, 18, 'border-radius:9px');
    const v = D(c, CW - 150, y + RH / 2 - 30, 110, 60, 'font:800 48px Geist;text-align:right;font-variant-numeric:tabular-nums');
    const is = r.issue ? D(c, BX + 20, y + RH / 2 - 17, 340, 34, 'border-radius:999px;background:#f0443a;color:#fff;font:700 20px Geist;display:flex;align-items:center;justify-content:center;white-space:nowrap', H.esc(r.issue)) : null;
    return { r, hl, f, v, is };
  });
  D(c, BX + BW * thr / MX - 1.5, RY, 3, RH * rows.length, 'background:repeating-linear-gradient(180deg,#1fbf75 0 8px,transparent 8px 14px)');
  D(c, BX + BW * thr / MX - 30, RY - 32, 60, 30, 'border-radius:8px;background:#1fbf75;color:#fff;font:800 20px Geist;display:flex;align-items:center;justify-content:center', `≥ ${thr}`);
  const pass = D(c, 36, HH - 76, 340, 52, 'border-radius:12px;background:#1fbf75;color:#fff;font:800 26px Geist;display:flex;align-items:center;justify-content:center;gap:10px;letter-spacing:.06em', '✓ PASSED');
  const ST = H.times(ctx, side, .45, .9);
  const sc = side.map((s, i) => { const k = H.put(root, H.card({ w: SW, h: (HH - 24 * (side.length - 1)) / side.length }), 88 + CW + 32, Y + i * ((HH - 24 * (side.length - 1)) / side.length + 24)); D(k, 32, 28, SW - 64, 120, 'font:800 32px/1.2 Geist,Noto;letter-spacing:-.02em', H.md(s.text)); if (s.sub) D(k, 32, 150, SW - 64, 80, 'font:600 23px/1.3 Geist,Noto;color:#6b6e7b', H.md(s.sub)); return k; });
  ctx.cue(t1, 'swoosh', .3); ctx.cue(tF, 'error', .3); if (two) ctx.cue(t2, 'swoosh', .3), ctx.cue(t2 + 1.1, 'ding', .6);
  return t => {
    enter(c, t, .1, { dy: 50 });
    const inR2 = t >= t2; round.textContent = inR2 ? 'Round 2' : 'Round 1';
    R.forEach(({ r, hl, f, v, is }, i) => {
      const s1 = t1 + i * .1, s2 = t2 + i * .1;
      const val = inR2 ? lerp(r.r1, r.r2 ?? r.r1, E.io(P(t, s2, s2 + .7))) : r.r1 * E.io(P(t, s1, s1 + .7));
      f.style.width = (BW * val / MX).toFixed(1) + 'px'; const bad = val < thr - .01;
      f.style.background = bad ? '#f0443a' : '#1fbf75'; v.textContent = t < s1 ? '–' : Math.round(val); v.style.color = bad ? '#f0443a' : '#15161c';
      const flag = r.r1 < thr && t >= tF && !(inR2 && val >= thr); set(hl, { o: flag ? A(t, tF + i * .08, .3) : 0 });
      if (is) set(is, { o: flag ? A(t, tF + .2 + i * .08, .3) : 0, x: 0 });
    });
    set(pass, { o: two ? A(t, t2 + 1.1, .3) : 0, s: two ? lerp(.8, 1, SP(t, t2 + 1.1, .6)) : 1 });
    sc.forEach((k, i) => enter(k, t, ST[i] - .2, { dy: 40 }));
  };
};
