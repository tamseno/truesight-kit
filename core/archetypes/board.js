// board — a work board (PR tracker / kanban). Cards land in lanes, then move between lanes on their words; a sweep
// line passes over the board ("every 30 minutes") and cards pick up red flags or green checks as it checks them.
// data: { cols: ["Working", "Ready for review", "Merged"], colTone?: [null, "#3a6cf4", "#8b5cf6"],
//         items: [{ id: "#4821", title: "Fix onboarding crash", col: 0, at?, who?: "<cast>",
//                   moves?: [{ col: 1, at, flag?: "CI failing", ok?: "Checks pass" }] }],
//         sweeps?: [{ at, label?: "every 30 min" }], title? }
ARCH.board = (root, ctx, H, d, sc) => {
  const { set, enter, A, SP, E, P, lerp, D, IC } = H;
  const cols = d.cols || ['Working', 'Review', 'Done'], nc = cols.length, items = d.items || [];
  const TONE = d.colTone || [null, '#3a6cf4', '#8b5cf6', '#1fbf75'];
  const GAP = 26, CW = (1744 - GAP * (nc - 1)) / nc, CardH = 132, CG = 16, CY0 = 92;
  // lane height fits the busiest lane over the whole scene; the board is centred in the content area
  const maxN = (() => { const col = {}; let mx = 1; const es = []; items.forEach((it, i) => { es.push([0, i, it.col ?? 0]); (it.moves || []).forEach(m => es.push([1, i, m.col])); }); items.forEach((it, i) => { col[i] = it.col ?? 0; const per = {}; Object.values(col).forEach(c => { per[c] = (per[c] || 0) + 1; mx = Math.max(mx, per[c]); }); }); items.forEach((it, i) => (it.moves || []).forEach(m => { col[i] = m.col; const per = {}; Object.values(col).forEach(c => { per[c] = (per[c] || 0) + 1; mx = Math.max(mx, per[c]); }); })); return mx; })();
  const HH = Math.max(420, Math.min(632, CY0 + maxN * (CardH + CG) + 34)), Y = H.vc(HH);
  const lanes = cols.map((c, i) => {
    const l = H.put(root, H.card({ w: CW, h: HH }), 88 + i * (CW + GAP), Y); l.style.background = 'rgba(255,255,255,.72)'; l.style.backdropFilter = 'blur(6px)';
    const tone = TONE[i] || '#6b6e7b';
    D(l, 28, 28, CW - 56, 40, `display:flex;align-items:center;gap:12px;font:800 30px Geist,Noto;letter-spacing:-.01em;white-space:nowrap`, `<i style="width:14px;height:14px;border-radius:5px;background:${tone};display:inline-block"></i>${H.esc(c)}`);
    const cnt = D(l, CW - 28 - 60, 26, 60, 44, `border-radius:12px;background:color-mix(in srgb,${tone} 12%,#fff);color:${tone};font:800 22px Geist;display:flex;align-items:center;justify-content:center`);
    return { l, cnt, x: 88 + i * (CW + GAP) };
  });
  // event model: every card's lane over time; layout = order of arrival per lane
  const TT = H.times(ctx, items, .06, .4);
  const ev = [];
  items.forEach((it, i) => { ev.push({ t: TT[i], i, col: it.col ?? 0, kind: 'in' }); (it.moves || []).forEach(m => ev.push({ t: H.when(ctx, m.at, TT[i] + 2), i, col: m.col, kind: 'mv', m })); });
  ev.sort((a, b) => a.t - b.t);
  const stateAfter = []; { const col = {}, arr = {}; ev.forEach((e, k) => { col[e.i] = e.col; arr[e.i] = k; const lay = {}; const per = {}; Object.keys(col).sort((a, b) => arr[a] - arr[b]).forEach(i => { const c = col[i]; per[c] = (per[c] || 0); lay[i] = { c, r: per[c]++ }; }); stateAfter.push({ t: e.t, lay, per }); }); }
  const posOf = s => ({ x: lanes[s.c].x + 18, y: Y + CY0 + s.r * (CardH + CG) });
  const cards = items.map((it, i) => {
    const c = H.put(root, H.card({ w: CW - 36, h: CardH }), 0, 0); c.style.borderRadius = '18px';
    D(c, 24, 18, 140, 30, 'font:700 22px Maple;color:#6b6e7b', H.esc(it.id || ''));
    D(c, 24, 50, CW - 36 - 48 - (it.who ? 60 : 0), 42, 'font:800 30px/1.2 Geist,Noto;letter-spacing:-.015em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis', H.md(it.title || ''));
    if (it.who) { const av = H.avatar(it.who, 44); D(c, CW - 36 - 22 - 44, 18, 44, 44).appendChild(av.el); c.av = av; }
    const pill = D(c, 24, 92, CW - 80, 32, 'display:flex;gap:8px');
    return { c, pill, it };
  });
  const flagsOf = (i, t) => { let f = null; ev.forEach(e => { if (e.i === i && e.kind === 'mv' && t >= e.t - .9 && (e.m.flag || e.m.ok)) f = e; }); return f; };
  // sweeps
  const SW = (d.sweeps || []).map(s => ({ t: H.when(ctx, s.at, 0), label: s.label }));
  const sweep = D(root, 70, Y - 14, 6, HH + 28, 'border-radius:3px;background:linear-gradient(180deg,transparent,var(--accent),transparent);box-shadow:0 0 30px 8px color-mix(in srgb,var(--accent) 40%,transparent)');
  const swl = D(root, 0, Y - 58, 300, 40, 'display:flex;align-items:center;gap:10px;padding:0 16px;border-radius:999px;background:#15161c;color:#fff;font:800 22px Geist;white-space:nowrap');
  swl.innerHTML = `<span style="width:22px;height:22px">${IC.clock('#ffd66b')}</span><span class="tx"></span>`;
  // sounds + camera
  ctx.cue(TT[0] - .2, 'swoosh', .3); TT.forEach(x => ctx.cue(x, 'pop', .25));
  ev.filter(e => e.kind === 'mv').forEach(e => { ctx.cue(e.t, 'swish', .4); if (e.m.flag) ctx.cue(e.t - .8, 'error', .45); else if (e.m.ok) ctx.cue(e.t - .8, 'tick', .5); if (e.col === nc - 1) ctx.cue(e.t + .5, 'success', .45); });
  SW.forEach(s => ctx.cue(s.t, 'whoosh', .3));
  ev.filter(e => e.kind === 'mv').forEach(e => { const st = stateAfter.find(s => s.t >= e.t); if (!st) return; const p = posOf(st.lay[e.i]); ctx.focus(e.t - .4, { x: p.x, y: p.y, w: CW - 36, h: CardH }, { z: 1.045, k: .28, d: 1.1 }); });
  if (ev.some(e => e.kind === 'mv')) ctx.reset(ev.at(-1).t + 1.6, 1.4);
  return t => {
    lanes.forEach(({ l, cnt }, i) => { enter(l, t, .05 + i * .08, { dy: 40 }); });
    // counts
    let st = null; stateAfter.forEach(s => { if (t >= s.t) st = s; });
    lanes.forEach(({ cnt }, i) => { cnt.textContent = st ? (st.per[i] || 0) : 0; });
    cards.forEach(({ c, pill, it }, i) => {
      // telescoped position across events
      let p0 = null, x = 0, y = 0; stateAfter.forEach(s => { const L = s.lay[i]; if (!L) return; const p = posOf(L); if (!p0) { p0 = p; x = p.x; y = p.y; return; } const k = E.io(P(t, s.t, s.t + .65)); x += (p.x - p0.x) * k; y += (p.y - p0.y) * k; p0 = p; });
      c.style.left = x.toFixed(1) + 'px'; c.style.top = y.toFixed(1) + 'px';
      const k = SP(t, TT[i] - .1, .8); const mv = ev.find(e => e.i === i && e.kind === 'mv' && t >= e.t - .05 && t < e.t + .65);
      set(c, { y: 26 * (1 - k), o: A(t, TT[i] - .1, .25), s: mv ? 1 + .04 * Math.sin(Math.PI * P(t, mv.t - .05, mv.t + .65)) : 1, r: mv ? 1.6 * Math.sin(Math.PI * P(t, mv.t - .05, mv.t + .65)) : 0 });
      c.style.zIndex = mv ? 3 : 1;
      if (c.av) c.av.update(t);
      const f = flagsOf(i, t), key = f ? (f.m.flag ? 'f' : 'o') + f.t : '';
      if (pill.dataset.k !== key) { pill.dataset.k = key; pill.innerHTML = f ? (f.m.flag ? `<span style="display:inline-flex;align-items:center;gap:6px;height:32px;padding:0 13px;border-radius:999px;background:#fff0ef;color:#e2382e;font:800 21px Geist;white-space:nowrap">✕ ${H.esc(f.m.flag)}</span>` : `<span style="display:inline-flex;align-items:center;gap:6px;height:32px;padding:0 13px;border-radius:999px;background:#e9f9f1;color:#13a463;font:800 21px Geist;white-space:nowrap">✓ ${H.esc(f.m.ok)}</span>`) : ''; }
      if (f) H.pop(pill.firstChild || pill, t, f.t - .9, { s0: .6 });
      c.style.boxShadow = f && f.m.flag && t < f.t + .65 ? '0 0 0 3px #f0443a,0 20px 40px -18px rgba(240,68,58,.5)' : '';
    });
    // sweep
    let sw = null; SW.forEach(s => { if (t >= s.t - .1 && t < s.t + 2.2) sw = s; });
    if (sw) { const k = E.io(P(t, sw.t, sw.t + 1.9)); const x = lerp(70, 1840, k); set(sweep, { x: x - 70, o: Math.sin(Math.PI * k) }); swl.querySelector('.tx').textContent = sw.label || 'sweep'; set(swl, { x: Math.min(1540, x - 40), o: Math.min(1, Math.sin(Math.PI * k) * 2) }); }
    else { set(sweep, { o: 0 }); set(swl, { o: 0 }); }
  };
};
