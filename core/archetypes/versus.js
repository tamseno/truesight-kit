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
  const CH = Math.min(d.verdict ? 520 : 632, 140 + perC * 100), Y = H.vc(CH, d.verdict ? 106 : 0);
  const RED = '#f0443a', GRN = '#1fbf75';
  const col = (side, spec, x) => {
    const c = H.put(root, H.card({ w: CW, h: CH }), x, Y);
    const head = D(c, 34, 28, CW - 68, 50, 'display:flex;align-items:center;gap:16px;font:800 34px Geist,Noto;letter-spacing:-.02em;white-space:nowrap', `${H.md(spec.title || '')}${spec.tag ? H.tag(spec.tag, side ? GRN : RED) : ''}`);
    D(c, 34, 96, CW - 68, 2, 'background:rgba(21,22,28,.07)');
    const n = spec.items.length, cols = !twoCol && n > 5 ? 2 : 1, perCol = Math.ceil(n / cols), RH = Math.min(100, (CH - 130) / perCol);
    const rows = spec.items.map((it, i) => {
      const cc = Math.floor(i / perCol), rr = i % perCol, w = (CW - 68) / cols;
      const r = D(c, 34 + cc * w, 118 + rr * RH, w - 20, RH - 10, 'display:flex;align-items:center;gap:18px');
      const ic = D(r, 0, 0, 40, 40, 'position:relative;flex:none', side ? IC.check(GRN) : IC.x(RED)); ic.style.position = 'relative'; ic.style.left = ic.style.top = '';
      const tx = r.appendChild(H.h('div', '', `<div class="strike" style="display:inline-block;font:700 34px/1.15 Geist,Noto;letter-spacing:-.01em">${H.md(it.text)}</div>${it.sub ? `<div style="font:600 22px Geist,Noto;color:#8a8d99;margin-top:4px">${H.md(it.sub)}</div>` : ''}`));
      return { r, ic, st: tx.querySelector('.strike'), t0: it._t };
    });
    return { c, head, rows, side };
  };
  const cols = [col(0, L, 88)]; if (R) cols.push(col(1, R, 88 + CW + 32));
  const vd = d.verdict ? D(root, 88, Y + CH + 26, 1744, 80, 'border-radius:20px;background:#15161c;color:#fff;display:flex;align-items:center;justify-content:center;font:800 36px Geist,Noto;letter-spacing:-.02em', `<span>${H.md(d.verdict.text || d.verdict)}</span>`) : null;
  const tV = vd ? H.when(ctx, d.verdict.at, TT[TT.length - 1] + .8) : 0;
  TT.forEach((x, i) => ctx.cue(x, all[i].side ? 'pop' : 'tick', .4)); if (vd) ctx.cue(tV, 'whoosh', .35);
  return t => {
    cols.forEach(({ c, rows, side }, ci) => {
      enter(c, t, .1 + ci * .12, { dy: 60 });
      rows.forEach(({ r, ic, st, t0 }, i) => {
        if (side === 0) { // visible early, struck at its moment
          set(r, { o: A(t, .35 + i * .06, .3) * lerp(1, .55, A(t, t0 + .35, .4)), y: 12 * (1 - A(t, .35 + i * .06, .4)) });
          H.strike(st, A(t, t0, .35, E.io)); H.pop(ic, t, t0, { r: -30 });
        } else { set(r, { o: A(t, t0 - .05, .25), y: 16 * (1 - SP(t, t0 - .05, .7)) }); H.pop(ic, t, t0, { r: -30 }); }
      });
    });
    if (vd) { const k = SP(t, tV, .8); set(vd, { y: 30 * (1 - k), o: A(t, tV, .2) }); vd.querySelectorAll('.hl').forEach(e => H.hl(e, E.io(P(t, tV + .25, tV + .7)))); }
  };
};
