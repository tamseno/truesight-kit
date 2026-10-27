// loop — a cycle. Nodes sit on an ellipse, arcs draw in as each node is named, then a glowing token keeps circling;
// the centre states the exit condition and can count rounds.
// data: { nodes: [{ label: "Brief", sub?: "what + proof", icon?: "chat"|"bolt"|..., cast?, at? }],
//         center?: { text: "Until the goal is met", sub?, at? }, rounds?: [{ at, label: "Round 2" }], speed?: .16 }
ARCH.loop = (root, ctx, H, d, sc) => {
  const { set, enter, A, SP, E, P, lerp, D, IC } = H;
  const ns = d.nodes || [], n = ns.length, T = H.times(ctx, ns, .08, .62);
  const CX = 960, CY = sc.title ? 580 : 540, RX = n > 4 ? 640 : 600, RY = sc.title ? 238 : 300;
  const ang = i => -Math.PI / 2 + i * 2 * Math.PI / n, pt = a => [CX + RX * Math.cos(a), CY + RY * Math.sin(a)];
  const svgW = D(root, 0, 0, 1920, 1080); svgW.innerHTML = '<svg width="1920" height="1080" style="position:absolute;left:0;top:0;overflow:visible"><defs><filter id="lg" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="7"/></filter></defs></svg>'; const S = svgW.firstChild;
  const NS = 'http://www.w3.org/2000/svg';
  const acc = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#5a5cf0';
  const trim = .22;
  const arcs = ns.map((_, i) => {
    const a0 = ang(i) + trim, a1 = ang(i + 1) - trim, steps = 40; let dd = '';
    for (let k = 0; k <= steps; k++) { const [x, y] = pt(lerp(a0, a1, k / steps)); dd += (k ? 'L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1); }
    const p = document.createElementNS(NS, 'path'); p.setAttribute('d', dd); p.setAttribute('fill', 'none'); p.setAttribute('stroke', acc); p.setAttribute('stroke-width', '5'); p.setAttribute('stroke-linecap', 'round'); S.appendChild(p);
    const len = p.getTotalLength(); p.setAttribute('stroke-dasharray', len);
    const [ex, ey] = pt(a1), [bx, by] = pt(a1 - .02), rot = Math.atan2(ey - by, ex - bx) * 180 / Math.PI;
    const hd = document.createElementNS(NS, 'path'); hd.setAttribute('d', 'M-14 -11 L4 0 L-14 11'); hd.setAttribute('fill', 'none'); hd.setAttribute('stroke', acc); hd.setAttribute('stroke-width', '5'); hd.setAttribute('stroke-linecap', 'round'); hd.setAttribute('stroke-linejoin', 'round'); hd.setAttribute('transform', `translate(${ex.toFixed(1)} ${ey.toFixed(1)}) rotate(${rot.toFixed(1)})`); S.appendChild(hd);
    return { p, hd, len, t: (T[i + 1] ?? (T[n - 1] + .9)) - .5 };
  });
  const glow = document.createElementNS(NS, 'circle'); glow.setAttribute('r', '18'); glow.setAttribute('fill', acc); glow.setAttribute('filter', 'url(#lg)'); S.appendChild(glow);
  const tok = document.createElementNS(NS, 'circle'); tok.setAttribute('r', '10'); tok.setAttribute('fill', '#fff'); tok.setAttribute('stroke', acc); tok.setAttribute('stroke-width', '5'); S.appendChild(tok);
  const NW = 380, NH = 112;
  const nodes = ns.map((nd, i) => {
    const [x, y] = pt(ang(i));
    const c = H.put(root, H.card({ w: NW, h: NH }), x - NW / 2, y - NH / 2); c.style.borderRadius = '26px';
    const row = D(c, 0, 0, NW, NH, 'display:flex;align-items:center;gap:18px;padding:0 24px');
    let b = null;
    if (nd.cast && H.BOTS[nd.cast]) { const av = H.avatar(nd.cast, 60); row.appendChild(av.el); b = av; }
    else row.insertAdjacentHTML('beforeend', `<span style="flex:none;width:58px;height:58px;border-radius:18px;background:color-mix(in srgb,${nd.color || acc} 15%,transparent);display:flex;align-items:center;justify-content:center"><span style="width:34px;height:34px">${(IC[nd.icon] || IC.spark)(nd.color || acc)}</span></span>`);
    row.insertAdjacentHTML('beforeend', `<div style="min-width:0"><div class="nl" style="font:var(--fwd) 30px/1.1 var(--fd);letter-spacing:calc(-.02em * var(--trk));white-space:nowrap">${H.md(nd.label)}</div>${nd.sub ? `<div class="ns" style="font:600 21px var(--fb);color:var(--sub);white-space:nowrap;margin-top:4px">${H.md(nd.sub)}</div>` : ''}</div>`);
    H.fit(row.querySelector('.nl'), NW - 130, 22); if (nd.sub) H.fit(row.querySelector('.ns'), NW - 130, 18);
    return { c, b, i };
  });
  const C = d.center || {};
  const ctr = D(root, CX - 420, CY - 70, 840, 140, 'text-align:center');
  ctr.innerHTML = `<div class="cr" style="font:800 22px var(--fb);letter-spacing:.14em;color:${acc};height:30px"></div><div style="font:var(--fwd) 50px/1.1 var(--fd);letter-spacing:calc(-.03em * var(--trk))">${H.md(C.text || '')}</div>${C.sub ? `<div style="font:600 26px var(--fb);margin-top:8px" class="onbg-sub">${H.md(C.sub)}</div>` : ''}`;
  ctr.classList.add('onbg');
  const cr = ctr.querySelector('.cr'), tC = H.when(ctx, C.at, T[n - 1] + 1);
  const RD = (d.rounds || []).map(r => ({ t: H.when(ctx, r.at, 0), label: r.label }));
  const tLoop = T[n - 1] + .4, sp = d.speed || .16;
  T.forEach(x => ctx.cue(x, 'pop', .4)); ctx.cue(tC, 'swoosh', .3); RD.forEach(r => ctx.cue(r.t, 'tick', .5));
  ctx.cam(T[0], { x: 960, y: CY - 10, z: 1.025, d: 2 }); ctx.cam(tC - .2, { x: 960, y: CY, z: 1.06, d: 1.6 });
  return t => {
    nodes.forEach(({ c, b, i }) => { enter(c, t, T[i] - .2, { dy: 30, s0: .9 }); if (b) b.update(t); const act = tokenNode(t) === i; c.style.boxShadow = act ? `0 0 0 3px ${acc},0 26px 50px -18px rgba(30,34,80,.35)` : ''; c.style.scale = act ? '1.04' : '1'; });
    arcs.forEach(a => { const k = E.io(P(t, a.t, a.t + .55)); a.p.setAttribute('stroke-dashoffset', (a.len * (1 - k)).toFixed(1)); a.p.style.opacity = k > 0 ? .75 : 0; a.hd.style.opacity = k > .95 ? .75 : 0; });
    const on = A(t, tLoop, .4), u = t > tLoop ? (t - tLoop) * sp : 0, [x, y] = pt(ang(0) + u * 2 * Math.PI);
    [glow, tok].forEach(e => { e.setAttribute('cx', x.toFixed(1)); e.setAttribute('cy', y.toFixed(1)); e.style.opacity = on; });
    set(ctr, { o: A(t, tC, .4), y: 16 * (1 - A(t, tC, .6)), s: lerp(.96, 1, A(t, tC, .6)) });
    let rl = ''; RD.forEach(r => { if (t >= r.t) rl = r.label; }); if (cr.textContent !== rl) cr.textContent = rl;
    function tokenNode(tt) { if (tt <= tLoop) { let a = -1; T.forEach((x_, j) => { if (tt >= x_ - .1) a = j; }); return a; } const uu = ((tt - tLoop) * sp * n + .12) % n; return Math.floor(uu) === Math.floor(uu + .0) && (uu % 1) < .3 ? Math.floor(uu) % n : -1; }
  };
};
