// flow — nodes in columns, connectors draw in, pulses travel along them. Routers, pipelines, "who talks to whom".
// data: { cols: [[{ id, label, sub?, cast?, color?, at? }], ...], edges: [["a","b"], ...], pulse?: true, note?: { text, at? } }
ARCH.flow = (root, ctx, H, d) => {
  const { h, put, set, enter, A, SP, E, P, lerp, D, BOTS, bot } = H;
  const cols = d.cols || [], nodes = {}, flat = cols.flat();
  const T = H.times(ctx, flat, .1, .75); flat.forEach((n, i) => n._t = T[i]);
  const X0 = 88, X1 = 1832, Y0 = 250, Y1 = d.note ? 780 : 860, nc = cols.length;
  const NW = Math.min(470, (X1 - X0 - (nc - 1) * 130) / nc);
  const svg = put(root, h('div', ''), 0, 0, 1920, 1080); svg.innerHTML = '<svg width="1920" height="1080" style="position:absolute;left:0;top:0;overflow:visible"></svg>'; const S = svg.firstChild;
  cols.forEach((col, ci) => {
    const x = nc === 1 ? (1920 - NW) / 2 : X0 + ci * (X1 - X0 - NW) / (nc - 1);
    const NH = Math.min(140, (Y1 - Y0 - (col.length - 1) * 24) / col.length), tot = col.length * NH + (col.length - 1) * 24, y0 = (Y0 + Y1) / 2 - tot / 2;
    col.forEach((n, ri) => {
      const c = BOTS[n.cast], color = n.color || (c && c.c) || '#15161c';
      const el = put(root, H.card({ w: NW, h: NH }), x, y0 + ri * (NH + 24)); el.style.borderRadius = '24px';
      let b = null; const bs = Math.min(70, NH - 28); if (c) { b = bot(n.cast, bs); D(el, 22, (NH - bs) / 2, bs, bs).appendChild(b.el); }
      else D(el, 22, NH / 2 - 26, 52, 52, `border-radius:15px;background:${color};box-shadow:0 8px 18px -8px ${color}`);
      const lb = D(el, 98, NH / 2 - (n.sub ? 38 : 21), NW - 116, 44, 'font:800 33px Geist,Noto;letter-spacing:-.02em;white-space:nowrap', H.md(n.label || (c && c.name) || n.id)); H.fit(lb, NW - 116, 22);
      if (n.sub) { const sb = D(el, 98, NH / 2 + 8, NW - 116, 32, 'font:600 24px Geist,Noto;color:#8a8d99;white-space:nowrap', H.md(n.sub)); H.fit(sb, NW - 116, 20); }
      nodes[n.id] = { n, el, b, color, x, y: y0 + ri * (NH + 24), w: NW, h: NH };
    });
  });
  const edges = (d.edges || []).map(([a, b2], i) => {
    const A_ = nodes[a], B = nodes[b2]; if (!A_ || !B) return null;
    const x1 = A_.x + A_.w, y1 = A_.y + A_.h / 2, x2 = B.x, y2 = B.y + B.h / 2, mx = (x1 + x2) / 2;
    const p = document.createElementNS('http://www.w3.org/2000/svg', 'path'); p.setAttribute('d', `M${x1} ${y1} C${mx} ${y1} ${mx} ${y2} ${x2} ${y2}`);
    p.setAttribute('fill', 'none'); p.setAttribute('stroke', A_.color); p.setAttribute('stroke-width', '4'); p.setAttribute('stroke-linecap', 'round'); S.appendChild(p);
    const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle'); dot.setAttribute('r', '8'); dot.setAttribute('fill', A_.color); S.appendChild(dot);
    // bezier sampler (no layout needed)
    const at = u => { const q = 1 - u; return [q * q * q * x1 + 3 * q * q * u * mx + 3 * q * u * u * mx + u * u * u * x2, q * q * q * y1 + 3 * q * q * u * y1 + 3 * q * u * u * y2 + u * u * u * y2]; };
    let len = 0, pr = at(0); for (let k = 1; k <= 40; k++) { const c = at(k / 40); len += Math.hypot(c[0] - pr[0], c[1] - pr[1]); pr = c; }
    p.setAttribute('stroke-dasharray', String(len));
    return { p, dot, at, len, t0: Math.max(A_.n._t, B.n._t) + .1, i };
  }).filter(Boolean);
  const note = d.note ? D(root, 88, 806, 1744, 64, 'display:flex;align-items:center;justify-content:center;font:800 36px Geist,Noto;letter-spacing:-.015em', H.md(d.note.text || d.note)) : null; if (note) note.classList.add('onbg');
  const tN = note ? H.when(ctx, d.note.at, T[T.length - 1] + .8) : 0;
  flat.forEach(n => ctx.cue(n._t, 'pop', .3));
  ctx.cam(.3, { x: 960, y: (Y0 + Y1) / 2 + 20, z: 1.02, d: 1.5 }); if (note) ctx.cam(tN - .3, { x: 960, y: (Y0 + Y1) / 2 + 60, z: 1.04, d: 1.4 });
  return t => {
    Object.values(nodes).forEach(({ n, el, b }) => { enter(el, t, n._t - .15, { dy: 30, rx: 8 }); if (b) b.update(t); });
    edges.forEach(e => {
      const k = E.io(P(t, e.t0, e.t0 + .6)); e.p.setAttribute('stroke-dashoffset', (e.len * (1 - k)).toFixed(1)); e.p.style.opacity = k > 0 ? .55 : 0;
      if (d.pulse !== false && t > e.t0 + .6) { const u = ((t - e.t0 - .6) * .55 + e.i * .17) % 1; const [x, y] = e.at(u); e.dot.setAttribute('cx', x.toFixed(1)); e.dot.setAttribute('cy', y.toFixed(1)); e.dot.style.opacity = Math.sin(u * Math.PI).toFixed(2); }
      else e.dot.style.opacity = 0;
    });
    if (note) set(note, { o: A(t, tN, .35), y: 12 * (1 - A(t, tN, .5)) });
  };
};
