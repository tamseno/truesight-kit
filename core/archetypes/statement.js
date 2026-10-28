// statement — full-bleed kinetic type. For hooks, turns and one-line verdicts ("That's a demo.").
// data: { eyebrow?, lines: [{ text: "That's a *demo*.", at? }], sub?: {text, at?}, align?: 'left'|'center', size?: 112, color? }
//   *word* = highlighter sweep. Each line enters word by word at its moment (at = phrase or seconds).
ARCH.statement = (root, ctx, H, d) => {
  const { h, put, set, A, SP, E, lerp, D } = H;
  const lines = d.lines || [{ text: d.text || '', at: d.at }];
  const FW = H.W, FH = H.H, AB = H.AREA({}), PAD = AB.x, LW = AB.w, MID = FH === 1080 ? 540 : FH * .44;
  const size = d.size || (FW < 1400 ? 96 : 112), LH = size * 1.08, center = d.align !== 'left';
  const T = H.times(ctx, lines, .03, .6); T[0] = Math.min(T[0], .3);
  const parse = txt => String(txt).match(/\*[^*]+\*\S*|\S+/g) || [];
  const html = parts => parts.map(p => p.startsWith('*') ? (m => `<span class="wd"><span class="hl">${H.esc(m[1])}</span>${H.esc(m[2])}</span>`)(p.match(/^\*([^*]+)\*(.*)$/)) : `<span class="wd">${H.esc(p)}</span>`).join(' ');
  const natW = parts => { const el = put(root, h('div', 'kin'), 0, 0); el.style.cssText += `;font-size:${size}px;white-space:nowrap`; el.innerHTML = html(parts); const w = el.scrollWidth; el.remove(); return w; };
  // lines -> rows: a narrow canvas wraps an over-long line into two balanced rows (shrinking it would make it the smallest line on screen)
  const spec = [], nWords = [];
  lines.forEach((ln, li) => {
    const parts = parse(ln.text); nWords[li] = parts.length;
    if (FW < 1400 && parts.length > 1 && natW(parts) > LW * 1.06) {
      const tot = parts.join(' ').length; let best = 1, bd = 1e9, acc = 0;
      for (let k = 1; k < parts.length; k++) { acc += parts[k - 1].length + 1; const dd = Math.abs(acc - tot / 2); if (dd < bd) { bd = dd; best = k; } }
      spec.push({ li, parts: parts.slice(0, best), j0: 0 }, { li, parts: parts.slice(best), j0: best });
    } else spec.push({ li, parts, j0: 0 });
  });
  const total = spec.length * LH, y0 = MID - total / 2 - (d.sub ? 40 : 0) - 30;
  const eb = d.eyebrow ? D(root, center ? 0 : PAD, y0 - 64, center ? FW : LW, 30, `text-align:${center ? 'center' : 'left'}`, `<span class="eyebrow">${H.esc(d.eyebrow)}</span>`) : null;
  const rows = spec.map((sp, i) => {
    const el = put(root, h('div', 'kin'), PAD, y0 + i * LH, LW);
    el.style.cssText += `;font-size:${size}px;text-align:${center ? 'center' : 'left'};white-space:nowrap${d.color ? ';color:' + d.color : ''}`;
    el.innerHTML = html(sp.parts); // words, with *hl* spans kept whole
    H.fit(el, LW, 40);
    return { el, li: sp.li, j0: sp.j0, wds: [...el.querySelectorAll('.wd')], hls: [...el.querySelectorAll('.hl')] };
  });
  const sub = d.sub ? D(root, PAD, y0 + total + 34, LW, 50, `text-align:${center ? 'center' : 'left'};font:600 34px var(--fb);color:var(--sub)`, H.md(d.sub.text || d.sub)) : null;
  const tSub = d.sub ? H.when(ctx, d.sub.at, T[T.length - 1] + .8) : 0;
  T.forEach(t0 => ctx.cue(t0, 'swoosh', .25));
  return t => {
    if (eb) set(eb, { o: A(t, .05, .4), y: 10 * (1 - A(t, .05, .5)) });
    rows.forEach(r => {
      const s = T[r.li] - .08, n = nWords[r.li];
      r.wds.forEach((w, j) => { const s1 = s + (r.j0 + j) * .055, k = SP(t, s1, .8); set(w, { y: 60 * (1 - k), o: A(t, s1, .22), b: 8 * (1 - A(t, s1, .3)) }); });
      r.hls.forEach(e => H.hl(e, E.io(H.P(t, s + n * .055 + .1, s + n * .055 + .55))));
      // older lines step back a little when a new one lands
      const nx = T[r.li + 1]; if (nx != null) set(r.el, { o: lerp(1, .32, A(t, nx - .1, .4)) });
    });
    if (sub) set(sub, { o: A(t, tSub, .35), y: 12 * (1 - A(t, tSub, .5)) });
  };
};
ARCH.statement.noHeader = true;
ARCH.statement.formats = ['*'];
