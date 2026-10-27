// versus — the wrong way gets struck out, the right way gets checked. Leave out "right" for a ban list.
// data: { left: { title: "One prompt", tag: "DEMO", items: [{ text, sub?, at? }] },
//         right?: { title: "A studio", tag: "SYSTEM", items: [{ text, sub?, at? }] },
//         verdict?: { text: "Ban each cliché *by name*", at? } }
ARCH.versus = (root, ctx, H, d) => {
  const { set, enter, A, SP, E, P, lerp, D, IC } = H;
  const L = d.left || { items: [] }, R = d.right;
  const all = [...L.items.map(x => ({ ...x, side: 0 })), ...(R ? R.items.map(x => ({ ...x, side: 1 })) : [])];
  const TT = H.times(ctx, all, .12, .8); let q = 0; L.items.forEach(x => x._t = TT[q++]); if (R) R.items.forEach(x => x._t = TT[q++]);
  const twoCol = !!R, CW = twoCol ? 856 : 1744, mxN = Math.max(L.items.length, R ? R.items.length : 0), perC = !twoCol && mxN > 5 ? Math.ceil(mxN / 2) : mxN;
  const hasSub = all.some(x => x.sub), RHmax = hasSub ? 124 : 112;
  const CH = Math.min(d.verdict ? 524 : 632, 136 + perC * RHmax), Y = H.vc(CH, d.verdict ? 110 : 0);
  const RED = '#f0443a', GRN = '#1fbf75';
  const col = (side, spec, x) => {
    const c = H.put(root, H.card({ w: CW, h: CH }), x, Y);
    D(c, 0, 0, CW, 8, `background:${side ? GRN : RED};opacity:.9`);
    const head = D(c, 38, 34, CW - 76, 56, 'display:flex;align-items:center;gap:18px;font:var(--fwd) 40px var(--fd);letter-spacing:calc(-.025em * var(--trk));white-space:nowrap', `${H.md(spec.title || '')}${spec.tag ? H.tag(spec.tag, side ? GRN : RED) : ''}`);
    D(c, 38, 108, CW - 76, 2, 'background:var(--line)');
    const n = spec.items.length, cols = !twoCol && n > 5 ? 2 : 1, perCol = Math.ceil(n / cols), RH = Math.min(RHmax, (CH - 132) / perCol);
    const rows = spec.items.map((it, i) => {
      const cc = Math.floor(i / perCol), rr = i % perCol, w = (CW - 76) / cols;
      const r = D(c, 38 + cc * w, 124 + rr * RH, w - 20, RH - 8, 'display:flex;align-items:center;gap:22px');
      const ic = D(r, 0, 0, 46, 46, 'position:relative;flex:none', side ? IC.check(GRN) : IC.x(RED)); ic.style.position = 'relative'; ic.style.left = ic.style.top = '';
      const tx = r.appendChild(H.h('div', '', `<div class="strike" style="display:inline-block;font:700 ${twoCol ? 38 : 40}px/1.15 Geist,Noto;letter-spacing:calc(-.015em * var(--trk));white-space:nowrap">${H.md(it.text)}</div>${it.sub ? `<div style="font:600 24px var(--fb);color:var(--sub);margin-top:5px;white-space:nowrap">${H.md(it.sub)}</div>` : ''}`));
      tx.style.minWidth = '0'; H.fit(tx.firstChild, w - 100, 26);
      return { r, ic, st: tx.querySelector('.strike'), t0: it._t };
    });
    return { c, head, rows, side };
  };
  const cols = [col(0, L, 88)]; if (R) cols.push(col(1, R, 88 + CW + 32));
  const vd = d.verdict ? D(root, 88, Y + CH + 28, 1744, 84, 'border-radius:22px;background:var(--inv);color:var(--inv-ink);display:flex;align-items:center;justify-content:center;font:var(--fwd) 38px var(--fd);letter-spacing:calc(-.02em * var(--trk));box-shadow:0 24px 50px -20px rgba(20,22,40,.5)', `<span>${H.md(d.verdict.text || d.verdict)}</span>`) : null;
  const tV = vd ? H.when(ctx, d.verdict.at, TT[TT.length - 1] + .8) : 0;
  TT.forEach((x, i) => ctx.cue(x, all[i].side ? 'pop' : 'tick', .4)); if (vd) ctx.cue(tV, 'whoosh', .35);
  // camera: lean into the column being talked about
  if (R && R.items.length) { ctx.focus(L.items.length ? L.items[0]._t - .3 : .5, { x: 88, y: Y, w: CW, h: CH }, { z: 1.03, k: .2, d: 1.4 }); ctx.focus(R.items[0]._t - .3, { x: 88 + CW + 32, y: Y, w: CW, h: CH }, { z: 1.035, k: .22, d: 1.4 }); }
  if (vd) ctx.reset(tV - .3, 1.1);
  return t => {
    cols.forEach(({ c, rows, side }, ci) => {
      enter(c, t, .1 + ci * .12, { dy: 60 });
      rows.forEach(({ r, ic, st, t0 }, i) => {
        if (side === 0) { // visible early, struck at its moment
          set(r, { o: A(t, .35 + i * .06, .3) * lerp(1, .5, A(t, t0 + .35, .4)), y: 12 * (1 - A(t, .35 + i * .06, .4)) });
          H.strike(st, A(t, t0, .35, E.io)); H.pop(ic, t, t0, { r: -30 });
        } else { set(r, { o: A(t, t0 - .05, .25), y: 16 * (1 - SP(t, t0 - .05, .7)) }); H.pop(ic, t, t0, { r: -30 }); }
      });
    });
    if (vd) { const k = SP(t, tV, .8); set(vd, { y: 30 * (1 - k), o: A(t, tV, .2) }); vd.querySelectorAll('.hl').forEach(e => H.hl(e, E.io(P(t, tV + .25, tV + .7)))); }
  };
};
