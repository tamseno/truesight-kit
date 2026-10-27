// chapter — full-screen chapter opener for long videos: a huge index numeral, the title, a one-line promise,
// and the chapter rail (every chapter scene in the episode) with a marker sliding to this one. Pair with "trans": "wipe".
// data: { n?: 2, title: "The handoff", sub?: "What a good brief contains", kicker?: "Chapter", short?: "Handoff" (rail label) }
ARCH.chapter = (root, ctx, H, d, sc) => {
  const { set, A, SP, E, P, lerp, D } = H;
  const all = (window.TLDATA ? window.TLDATA.scenes : [sc]).filter(s => s.type === 'chapter');
  const idx = Math.max(0, all.findIndex(s => s.id === sc.id)), n = d.n ?? idx + 1;
  const t0 = sc.trans === 'wipe' ? .42 : .12;
  // numeral (masked rise)
  const mask = D(root, 110, 236, 560, 330, 'overflow:hidden');
  const num = D(mask, 0, 0, 560, 330, `font:var(--fwd) 330px/1 var(--fd);letter-spacing:calc(-.07em * var(--trk));background:linear-gradient(160deg,var(--accent) 10%,color-mix(in srgb,var(--accent) 45%,var(--accent2)) 60%,var(--accent2) 110%);-webkit-background-clip:text;background-clip:text;color:transparent;white-space:nowrap`, String(n).padStart(2, '0'));
  // title block
  const X = 690;
  const kick = D(root, X, 300, 1100, 34, '', `<span class="eyebrow">${H.esc(d.kicker || 'Chapter')} ${n}</span>`);
  const title = D(root, X, 344, 1150, 130, 'font:var(--fwd) 112px/1.05 var(--fd);letter-spacing:calc(-.045em * var(--trk));white-space:nowrap', String(d.title || '').split(' ').map(w => `<span class="wd" style="display:inline-block">${H.md(w)}</span>`).join(' '));
  title.classList.add('onbg'); H.fit(title, 1140, 64);
  const wds = [...title.querySelectorAll('.wd')], hls = [...title.querySelectorAll('.hl')];
  const sub = d.sub ? D(root, X + 4, 488, 1100, 50, 'font:600 36px/1.3 var(--fb);letter-spacing:calc(-.01em * var(--trk));white-space:nowrap', H.md(d.sub)) : null;
  if (sub) { sub.classList.add('onbg-sub'); H.fit(sub, 1100, 26); }
  // chapter rail
  const RX0 = 150, RX1 = 1770, RY = 760, m = all.length;
  const xs = all.map((_, i) => m === 1 ? (RX0 + RX1) / 2 : lerp(RX0, RX1, i / (m - 1)));
  const line = D(root, RX0, RY - 2, RX1 - RX0, 4, 'border-radius:2px;background:currentColor;opacity:.16;transform-origin:left'); line.classList.add('onbg');
  const fill = D(root, RX0, RY - 2, RX1 - RX0, 4, 'border-radius:2px;background:var(--accent);transform-origin:left');
  const showLbl = m <= 9;
  const nodes = all.map((s, i) => {
    const on = i === idx, past = i < idx;
    const dot = D(root, xs[i] - (on ? 17 : 11), RY - (on ? 17 : 11), on ? 34 : 22, on ? 34 : 22, `border-radius:50%;${past ? 'background:var(--accent)' : on ? 'background:var(--surface);box-shadow:0 0 0 7px color-mix(in srgb,var(--accent) 40%,transparent),0 0 0 3px var(--accent) inset' : 'background:transparent;box-shadow:inset 0 0 0 3px currentColor;opacity:.4'}`);
    dot.classList.add('onbg');
    const lb = showLbl ? D(root, xs[i] - 120, RY + 30, 240, 60, `text-align:center;font:${on ? 800 : 700} 23px/1.2 Geist,Noto;white-space:nowrap;opacity:${on ? 1 : past ? .62 : .42}`, `<span style="font:700 21px var(--fm);opacity:.7">${String((s.data && s.data.n) ?? i + 1).padStart(2, '0')}</span><br>${H.esc((s.data && (s.data.short || s.data.title)) || '')}`) : null;
    if (lb) { lb.classList.add('onbg'); H.fit(lb, 236, 20); }
    return { dot, lb };
  });
  const tm = t0 + 1.1;
  ctx.cue(t0 + .02, 'impact', .55); ctx.cue(tm + .1, 'tick', .4);
  ctx.cam(t0, { x: 990, y: 520, z: 1.035, d: Math.max(2, ctx.dur - t0) });
  return t => {
    const k = SP(t, t0, 1.1); set(num, { y: 300 * (1 - k), s: lerp(1.08, 1, k), o: A(t, t0, .2) });
    set(kick, { o: A(t, t0 + .15, .3), x: -18 * (1 - A(t, t0 + .15, .5)) });
    wds.forEach((w, j) => { const s = t0 + .22 + j * .07, kk = SP(t, s, .9); set(w, { y: 70 * (1 - kk), o: A(t, s, .25), b: 8 * (1 - A(t, s, .35)) }); });
    hls.forEach(e => H.hl(e, E.io(P(t, t0 + .9, t0 + 1.4))));
    if (sub) set(sub, { o: A(t, t0 + .7, .4), y: 14 * (1 - A(t, t0 + .7, .6)) });
    set(line, { sx: Math.max(.0001, A(t, t0 + .3, .9, E.io)), o: .16 });
    const from = idx > 0 ? (xs[idx - 1] - RX0) / (RX1 - RX0) : 0, to = (xs[idx] - RX0) / (RX1 - RX0);
    set(fill, { sx: Math.max(.0001, lerp(from, to, E.io(P(t, tm, tm + .8))) * A(t, t0 + .3, .5)) });
    nodes.forEach(({ dot, lb }, i) => { const s = t0 + .35 + i * .05; H.pop(dot, t, i === idx ? tm + .4 : s, { s0: .2, o: i > idx ? .4 : 1 }); if (lb) set(lb, { o: A(t, s + .1, .3) * (i === idx ? 1 : i < idx ? .62 : .42), y: 10 * (1 - A(t, s + .1, .5)) }); });
  };
};
ARCH.chapter.noHeader = true;
