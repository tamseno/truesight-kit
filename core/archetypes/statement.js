// statement — full-bleed kinetic type. For hooks, turns and one-line verdicts ("That's a demo.").
// data: { eyebrow?, lines: [{ text: "That's a *demo*.", at? }], sub?: {text, at?}, align?: 'left'|'center', size?: 112, color? }
//   *word* = highlighter sweep. Each line enters word by word at its moment (at = phrase or seconds).
ARCH.statement = (root, ctx, H, d) => {
  const { h, put, set, A, SP, E, lerp, D } = H;
  const lines = d.lines || [{ text: d.text || '', at: d.at }];
  const size = d.size || 112, LH = size * 1.08, center = d.align !== 'left';
  const T = H.times(ctx, lines, .03, .6); T[0] = Math.min(T[0], .3);
  const total = lines.length * LH, y0 = 540 - total / 2 - (d.sub ? 40 : 0) - 30;
  const eb = d.eyebrow ? D(root, center ? 0 : 140, y0 - 64, center ? 1920 : 1600, 30, `text-align:${center ? 'center' : 'left'}`, `<span class="eyebrow">${H.esc(d.eyebrow)}</span>`) : null;
  const rows = lines.map((ln, i) => {
    const el = put(root, h('div', 'kin'), center ? 0 : 140, y0 + i * LH, center ? 1920 : 1640);
    el.style.cssText += `;font-size:${size}px;text-align:${center ? 'center' : 'left'};white-space:nowrap${d.color ? ';color:' + d.color : ''}`;
    // split into words, keep *hl* spans whole
    const parts = String(ln.text).match(/\*[^*]+\*\S*|\S+/g) || [];
    el.innerHTML = parts.map(p => p.startsWith('*') ? (m => `<span class="wd"><span class="hl">${H.esc(m[1])}</span>${H.esc(m[2])}</span>`)(p.match(/^\*([^*]+)\*(.*)$/)) : `<span class="wd">${H.esc(p)}</span>`).join(' ');
    return { el, wds: [...el.querySelectorAll('.wd')], hls: [...el.querySelectorAll('.hl')] };
  });
  const sub = d.sub ? D(root, center ? 0 : 140, y0 + total + 34, center ? 1920 : 1600, 50, `text-align:${center ? 'center' : 'left'};font:600 34px Geist,Noto;color:#6b6e7b`, H.md(d.sub.text || d.sub)) : null;
  const tSub = d.sub ? H.when(ctx, d.sub.at, T[T.length - 1] + .8) : 0;
  T.forEach(t0 => ctx.cue(t0, 'swoosh', .25));
  return t => {
    if (eb) set(eb, { o: A(t, .05, .4), y: 10 * (1 - A(t, .05, .5)) });
    rows.forEach((r, i) => {
      const s = T[i] - .08;
      r.wds.forEach((w, j) => { const k = SP(t, s + j * .055, .8); set(w, { y: 60 * (1 - k), o: A(t, s + j * .055, .22), b: 8 * (1 - A(t, s + j * .055, .3)) }); });
      r.hls.forEach(e => H.hl(e, E.io(H.P(t, s + r.wds.length * .055 + .1, s + r.wds.length * .055 + .55))));
      // older lines step back a little when a new one lands
      const nx = T[i + 1]; if (nx != null) set(r.el, { o: lerp(1, .32, A(t, nx - .1, .4)) });
    });
    if (sub) set(sub, { o: A(t, tSub, .35), y: 12 * (1 - A(t, tSub, .5)) });
  };
};
ARCH.statement.noHeader = true;
