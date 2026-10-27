// swarm — scale you can see. A big counter on the left; on the right a field of agent tiles. First only "from" tiles light
// (by hand), then manager bots appear and the rest of the field lights in a wave while the counter climbs to "to".
// data: { from: 15, to: 200, suffix?: "+", label: "cloud agents at once", fromLabel?: "By hand", toLabel?: "Managed by bots",
//         at?: phrase (first state), toAt?: phrase (scale-up), cast?: ["quill", ...], source? }
ARCH.swarm = (root, ctx, H, d, sc) => {
  const { set, enter, A, SP, E, P, lerp, D, rnd } = H;
  const from = d.from || 10, to = d.to || 100, t1 = H.when(ctx, d.at, H.spread(ctx, 0, 2, .05, .5)), t2 = H.when(ctx, d.toAt, H.spread(ctx, 1, 2, .05, .5));
  const Y0 = sc.title ? 250 : 170, GH = sc.title ? 600 : 700;
  // counter column
  const lbl = D(root, 120, Y0 + 40, 640, 34, '', `<span class="eyebrow">${H.esc(d.label || '')}</span>`);
  const big = D(root, 110, Y0 + 90, 700, 250, 'font:var(--fwd) 230px/1 var(--fd);letter-spacing:calc(-.06em * var(--trk));white-space:nowrap;font-variant-numeric:tabular-nums'); big.classList.add('onbg');
  const st1 = D(root, 120, Y0 + 370, 640, 60, 'display:flex;align-items:center;gap:14px;font:700 32px var(--fb);white-space:nowrap', `<span style="width:44px;height:44px">${H.youSvg}</span><span>${H.esc(d.fromLabel || 'By hand')}</span><span style="font:800 32px var(--fm);color:var(--sub)">${from}</span>`); st1.classList.add('onbg');
  const st2 = D(root, 120, Y0 + 440, 680, 60, 'display:flex;align-items:center;gap:14px;font:700 32px var(--fb);white-space:nowrap', `<span class="cs" style="display:flex;gap:4px"></span><span>${H.esc(d.toLabel || 'Managed by bots')}</span><span style="font:800 32px var(--fm);color:var(--accent)">${to}${H.esc(d.suffix || '')}</span>`); st2.classList.add('onbg');
  const castK = d.cast || H.BOT_ORDER.slice(0, 5);
  const mini = castK.map(k => { const a = H.avatar(k, 40); st2.querySelector('.cs').appendChild(a.el); return a; });
  // tile field
  const FX = 880, FW = 920, cols = to > 120 ? 20 : 12, rowsN = Math.ceil(to / cols), gap = 8, ts = Math.min((FW - gap * (cols - 1)) / cols, (GH - 130 - gap * (rowsN - 1)) / rowsN);
  const fw = cols * ts + (cols - 1) * gap, fh = rowsN * ts + (rowsN - 1) * gap, fx = FX + (FW - fw) / 2, fy = Y0 + (GH - fh) / 2 + 40;
  const field = D(root, fx, fy, fw, fh);
  const tiles = []; for (let i = 0; i < to; i++) { const c = i % cols, r = Math.floor(i / cols); const e = D(field, c * (ts + gap), r * (ts + gap), ts, ts, `border-radius:${Math.round(ts * .28)}px;background:currentColor;opacity:.1`); e.classList.add('onbg'); tiles.push({ e, c, r, d: Math.hypot(c - cols / 2, r - rowsN / 2) }); }
  const maxD = Math.max(...tiles.map(x => x.d));
  // the first "from" tiles sit at the centre (manual cluster)
  const order = tiles.map((x, i) => i).sort((a, b) => tiles[a].d - tiles[b].d);
  const manual = new Set(order.slice(0, from));
  const managers = castK.map((k, i) => { const a = H.avatar(k, 70); const w = D(root, fx + fw / 2 - 35 + (i - (castK.length - 1) / 2) * 96, fy - 96, 70, 70); w.appendChild(a.el); return { w, a }; });
  const src = d.source ? H.source(root, d.source) : null;
  ctx.cue(t1, 'pop', .4); ctx.cue(t2 - .9, 'riser', .45); ctx.cue(t2, 'impact', .45);
  ctx.cam(t1, { x: 930, y: 560, z: 1.02, d: 1.5 }); ctx.cam(t2, { x: 1010, y: 560, z: 1.035, d: 2.2 });
  return t => {
    set(lbl, { o: A(t, .1, .4) });
    const k1 = E.out(P(t, t1, t1 + .9)), k2 = E.out(P(t, t2, t2 + 1.8));
    const v = Math.round(t < t2 ? from * k1 : lerp(from, to, k2)); big.textContent = v + (t >= t2 + 1.6 ? (d.suffix || '') : '');
    set(big, { o: A(t, .15, .3), s: 1 + .04 * Math.sin(Math.PI * P(t, t2, t2 + .5)) });
    set(st1, { o: A(t, t1, .3) * lerp(1, .45, A(t, t2, .4)), x: -16 * (1 - A(t, t1, .5)) });
    set(st2, { o: A(t, t2 + .3, .3), x: -16 * (1 - A(t, t2 + .3, .5)) }); mini.forEach(a => a.update(t));
    tiles.forEach((x, i) => {
      const man = manual.has(i), ts_ = man ? t1 + order.indexOf(i) * .03 : t2 + .15 + (x.d / maxD) * 1.4 + rnd(i) * .2;
      const on = A(t, ts_, .25), pulse = on > .99 ? .82 + .18 * Math.sin(t * (1.5 + rnd(i + 7) * 2.5) + i) : 1;
      x.e.style.opacity = lerp(.1, man ? 1 : .92, on * pulse).toFixed(3);
      x.e.style.color = on > .02 ? (man ? 'var(--bg-ink)' : 'var(--accent)') : '';
      x.e.classList.toggle('onbg', on <= .02);
      x.e.style.scale = (on > 0 && on < 1 ? lerp(.4, 1, E.spring(on)) : 1).toFixed(3);
    });
    managers.forEach(({ w, a }, i) => { H.pop(w, t, t2 - .2 + i * .08, { dy: 20 }); a.update(t); });
    if (src) set(src, { o: A(t, .6, .4) });
  };
};
ARCH.swarm.noHeader = false;
