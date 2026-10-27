// roster — the cast, one card per role, each lighting up when it is named. A runner travels the rail.
// data: { from?: "Request", to?: "Delivered", items: [{ cast: "director", role: "PLAN", desc: "Owns it end to end", at?: "Director",
//          lines?: ["Brief", "Storyboard"] | code?: "frame(t) {...}" | big?: "8.6" }] }
ARCH.roster = (root, ctx, H, d) => {
  const { h, put, set, enter, A, SP, E, P, lerp, cl, D, BOTS, bot } = H;
  const items = d.items || [], n = items.length;
  const T = H.times(ctx, items, .1, .78);
  const GAP = 28, CW = (1744 - GAP * (n - 1)) / n, CY = 330, CH = 540;
  const cx = i => 88 + i * (CW + GAP);
  const TY = 266, L0 = 88 + 150, L1 = 1832 - 150;
  const pIn = D(root, 88, TY - 22, 136, 44, 'border-radius:999px;background:#15161c;color:#fff;font:800 22px Geist;display:flex;align-items:center;justify-content:center', H.esc(d.from || 'Request'));
  const pOut = D(root, 1832 - 136, TY - 22, 136, 44, 'border-radius:999px;background:#15161c;color:#fff;font:800 22px Geist;display:flex;align-items:center;justify-content:center', H.esc(d.to || 'Delivered'));
  const line = D(root, L0, TY - 2, L1 - L0, 4, 'border-radius:2px;background:rgba(21,22,28,.12);transform-origin:left');
  const runner = D(root, 0, TY - 10, 20, 20, 'border-radius:50%;background:#15161c;box-shadow:0 0 0 5px #fff');
  const cards = items.map((it, i) => {
    const c = BOTS[it.cast] || { c: it.color || '#3a6cf4', name: it.name || it.cast };
    const k = put(root, H.card({ w: CW, h: CH }), cx(i), CY);
    const band = D(k, 0, 0, CW, 160, `background:color-mix(in srgb,${c.c} 13%,#fff)`);
    let b = null; if (BOTS[it.cast]) { b = bot(it.cast, 104); D(k, CW / 2 - 52, 28, 104, 104).appendChild(b.el); }
    const nm = D(k, 26, 182, CW - 52, 44, 'font:800 34px Geist;letter-spacing:-.02em;white-space:nowrap', H.esc(it.name || c.name));
    const rl = it.role ? D(k, 26, 232, CW - 52, 34, '', H.tag(it.role, c.c)) : null;
    const desc = D(k, 26, 280, CW - 52, 110, 'font:700 26px/1.28 Geist,Noto;letter-spacing:-.01em', H.md(it.desc || ''));
    const prop = D(k, 18, 392, CW - 36, CH - 410, `border-radius:16px;background:${it.code ? '#16171f' : '#f6f7fb'};overflow:hidden`);
    let upProp = () => { };
    if (it.code) { const el = D(prop, 18, 14, CW - 72, null, 'font:600 22px/1.5 Maple;color:#d8dbe7;white-space:pre'); upProp = t => H.type(el, it.code, t, T[i] + .3, 38, false); }
    else if (it.big) { const el = D(prop, 0, 20, CW - 36, 90, `text-align:center;font:800 76px/1 Geist;color:${c.c};letter-spacing:-.03em`); const v = parseFloat(it.big); upProp = t => H.count(el, 0, v, E.out(P(t, T[i] + .2, T[i] + 1)), (String(it.big).split('.')[1] || '').length); }
    else if (it.lines) {
      const rows = it.lines.map((s, j) => D(prop, 22, 16 + j * 38, CW - 80, 34, 'display:flex;align-items:center;gap:12px;font:600 22px Geist;white-space:nowrap', `<span style="width:14px;height:14px;border-radius:50%;flex:none;box-shadow:0 0 0 3px ${c.c};background:#fff" class="dt"></span>${H.esc(s)}`));
      upProp = t => rows.forEach((r, j) => { const kk = A(t, T[i] + .3 + j * .18, .2); set(r, { o: lerp(.35, 1, kk) }); r.querySelector('.dt').style.background = kk > .5 ? c.c : '#fff'; });
    }
    return { it, c, k, b, nm, rl, desc, prop, upProp };
  });
  ctx.cue(T[0] - .3, 'swoosh', .35); T.forEach(x => ctx.cue(x, 'tick', .45));
  T.forEach((x, i) => ctx.focus(x - .2, { x: cx(i), y: CY, w: CW, h: CH }, { z: 1.03, k: .14, d: 1 })); ctx.reset(T[n - 1] + 1.6, 1.4);
  return t => {
    set(pIn, { o: A(t, .1, .3) }); set(pOut, { o: A(t, .2, .3) }); set(line, { sx: A(t, .15, .8, E.io) });
    let rx = L0; T.forEach((x, i) => { rx = lerp(rx, cx(i) + CW / 2 - 10, E.io(P(t, x - .25, x + .2))); });
    rx = lerp(rx, L1 - 10, E.io(P(t, T[n - 1] + 1.2, T[n - 1] + 1.8)));
    set(runner, { x: rx, o: A(t, T[0] - .4, .2) });
    let active = -1; T.forEach((x, i) => { if (t >= x - .15) active = i; });
    cards.forEach(({ c, k, b, nm, rl, desc, prop, upProp }, i) => {
      enter(k, t, .1 + i * .07, { dy: 70, rx: 14 });
      if (b) b.update(t, { lookX: active === i ? 0 : (active > i ? .6 : -.6), bob: active === i ? 3.2 : 2 });
      const on = A(t, T[i] - .1, .35); set(nm, { o: lerp(.35, 1, on) }); if (rl) set(rl, { o: lerp(.35, 1, on) });
      const dk = SP(t, T[i] + .1, .8); set(desc, { y: 14 * (1 - dk), o: A(t, T[i] + .1, .25) });
      const pk = SP(t, T[i] + .25, .9); set(prop, { y: 20 * (1 - pk), o: A(t, T[i] + .25, .25) }); upProp(t);
      const lift = (active === i ? 1 : 0) * A(t, T[i] - .15, .4, E.quart);
      k.style.boxShadow = `0 0 0 ${(3 * lift).toFixed(2)}px ${c.c},0 ${18 + 20 * lift}px ${50 + 30 * lift}px -12px rgba(30,34,70,${(.18 + .12 * lift).toFixed(3)})`;
      k.style.translate = `0 ${(-12 * lift).toFixed(2)}px`;
      if (active >= 0 && t < T[n - 1] + 1.6) H.dof(k, i === active ? 1 : i < active ? .8 : .55, { o: .6, b: 1.4 });
    });
  };
};
