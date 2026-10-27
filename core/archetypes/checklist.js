// checklist — the call to action. Steps tick off; a gate unlocks at the end; resources point to the description.
// data: { title?: "Start tonight", items: [{ text, sub?, at? }], gate?: { text: "Then turn on the routine", at? },
//         resources?: { title?: "In the description", items: ["house-style SKILL.md", "bootstrap.sh"] } }
ARCH.checklist = (root, ctx, H, d) => {
  const { set, enter, A, SP, E, lerp, D, IC } = H;
  const it = d.items || [], T = H.times(ctx, it, .1, .7), RS = d.resources, Y = 250, HH = 612;
  const W1 = RS ? 1100 : 1744;
  const c = H.put(root, H.card({ w: W1, h: HH }), 88, Y);
  D(c, 38, 32, W1 - 200, 48, 'font:var(--fwd) 40px var(--fd);letter-spacing:calc(-.025em * var(--trk))', H.md(d.title || 'Start tonight'));
  const cnt = D(c, W1 - 38 - 140, 38, 140, 40, 'text-align:right;font:700 28px var(--fm);color:var(--sub)');
  const RH = Math.min(122, (HH - 116 - (d.gate ? 100 : 0)) / it.length);
  const rows = it.map((x, i) => {
    const r = D(c, 24, 104 + i * RH, W1 - 48, RH - 12, 'border-radius:16px;display:flex;align-items:center;gap:22px;padding:0 20px');
    r.innerHTML = `<span class="bx" style="flex:none;width:48px;height:48px;border-radius:50%;box-shadow:inset 0 0 0 3px var(--track);display:flex;align-items:center;justify-content:center;font:800 23px var(--fb);color:var(--sub)">${i + 1}</span><div><div style="font:var(--fwd) 36px/1.15 var(--fd);letter-spacing:calc(-.02em * var(--trk))">${H.md(x.text)}</div>${x.sub ? `<div style="font:600 24px var(--fb);color:var(--sub);margin-top:4px">${H.md(x.sub)}</div>` : ''}</div>`;
    const ck = D(r, 20, (RH - 12) / 2 - 24, 48, 48, '', IC.check());
    return { r, ck };
  });
  let gate = null, tG = 0;
  if (d.gate) { gate = D(c, 24, HH - 104, W1 - 48, 80, 'border-radius:18px;background:var(--inv);color:var(--inv-ink);display:flex;align-items:center;gap:18px;padding:0 26px;font:var(--fwd) 32px var(--fd)', `<span class="lk" style="width:40px;height:40px;flex:none">${IC.lock()}</span><span>${H.md(d.gate.text || d.gate)}</span>`); tG = H.when(ctx, d.gate.at, T[T.length - 1] + .8); }
  let rc = null, rItems = [];
  if (RS) {
    rc = H.put(root, H.card({ w: 1744 - W1 - 32, h: HH }), 88 + W1 + 32, Y);
    D(rc, 34, 28, 560, 40, 'font:var(--fwd) 30px var(--fd)', H.md(RS.title || 'In the description'));
    rItems = (RS.items || []).map((s, i) => D(rc, 24, 100 + i * 96, 1744 - W1 - 32 - 48, 80, 'border-radius:14px;background:var(--fill);display:flex;align-items:center;gap:16px;padding:0 20px;font:700 25px var(--fm);white-space:nowrap', `<span style="width:36px;height:36px;flex:none">${IC.file('#cfe0ff')}</span>${H.esc(s)}`));
  }
  T.forEach(x => ctx.cue(x, 'tick', .5)); if (gate) ctx.cue(tG, 'success', .5);
  T.forEach((x, i) => ctx.focus(x - .25, { x: 88, y: Y + 104 + i * RH, w: W1, h: RH }, { z: 1.03, k: .16, d: 1.1 })); if (gate) ctx.focus(tG - .3, { x: 88, y: Y + HH - 104, w: W1, h: 80 }, { z: 1.035, k: .2, d: 1.1 });
  return t => {
    enter(c, t, .1, { dy: 50 });
    let done = 0; T.forEach(x => { if (t >= x) done++; }); cnt.textContent = `${done} / ${it.length}`;
    rows.forEach(({ r, ck }, i) => { const k = A(t, T[i] - .1, .3); set(r, { o: lerp(.45, 1, k) }); r.style.background = (t >= T[i] - .1 && (i === it.length - 1 || t < T[i + 1] - .1)) ? 'color-mix(in srgb,var(--accent) 9%,transparent)' : 'transparent'; H.pop(ck, t, T[i] + .4, { r: -40 }); });
    if (gate) { set(gate, { o: A(t, .4, .3) * lerp(.5, 1, A(t, tG, .3)) }); gate.style.background = t >= tG ? 'var(--good)' : 'var(--inv)'; gate.style.color = t >= tG ? '#fff' : 'var(--inv-ink)'; }
    if (rc) { enter(rc, t, .3, { dy: 50 }); rItems.forEach((e, i) => set(e, { o: A(t, .6 + i * .12, .3), x: 14 * (1 - A(t, .6 + i * .12, .4)) })); }
  };
};
