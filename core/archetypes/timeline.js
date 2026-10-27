// timeline — dated events on a horizontal track. The track fills to each event as it is named; cards alternate above
// and below; an optional "now" marker closes it.
// data: { events: [{ date: "Aug 11", label: "Grok Bot beta launches", sub?, at?, tone? }], now?: { label: "Today", at? } }
ARCH.timeline = (root, ctx, H, d, sc) => {
  const { set, enter, A, SP, E, P, lerp, D } = H;
  const ev = d.events || [], n = ev.length, T = H.times(ctx, ev, .08, .8);
  const X0 = 200, X1 = d.now ? 1640 : 1720, LY = 560, xs = ev.map((_, i) => n === 1 ? (X0 + X1) / 2 : lerp(X0, X1, i / (n - 1)));
  const base = D(root, 110, LY - 3, 1700, 6, 'border-radius:3px;background:currentColor;opacity:.12'); base.classList.add('onbg');
  const fill = D(root, 110, LY - 3, 1700, 6, 'border-radius:3px;background:var(--accent);transform-origin:left');
  const head = D(root, 0, LY - 15, 30, 30, 'border-radius:50%;background:var(--accent);box-shadow:0 0 0 8px color-mix(in srgb,var(--accent) 25%,transparent)');
  const CW = Math.min(420, 1640 / Math.max(1, n) + 60);
  const E_ = ev.map((e, i) => {
    const up = i % 2 === 0, x = xs[i], tone = e.tone === 'good' ? '#1fbf75' : e.tone === 'bad' ? '#f0443a' : null;
    const dot = D(root, x - 13, LY - 13, 26, 26, `border-radius:50%;background:var(--surface);box-shadow:inset 0 0 0 6px ${tone || 'var(--accent)'}`);
    const date = D(root, x - 150, up ? LY + 26 : LY - 62, 300, 36, `text-align:center;font:800 26px var(--fm);white-space:nowrap;color:${tone || 'var(--accent)'}`, H.esc(e.date || ''));
    const c = H.put(root, H.card({ w: CW }), Math.min(1832 - CW, Math.max(88, x - CW / 2)), 0); c.style.padding = '22px 26px';
    c.innerHTML = `<div class="el" style="font:var(--fwd) 29px/1.2 var(--fd);letter-spacing:calc(-.015em * var(--trk))">${H.md(e.label || '')}</div>${e.sub ? `<div style="font:600 22px/1.3 var(--fb);color:var(--sub);margin-top:6px">${H.md(e.sub)}</div>` : ''}`;
    const hh = c.offsetHeight; c.style.top = (up ? LY - 50 - hh : LY + 80) + 'px';
    const pin = D(root, x - 1.5, up ? LY - 50 : LY + 13, 3, up ? 37 : 67, 'background:currentColor;opacity:.2'); pin.classList.add('onbg');
    return { dot, date, c, pin, x };
  });
  let now = null, tNow = 1e9;
  if (d.now) { tNow = H.when(ctx, d.now.at, T[n - 1] + .9); now = D(root, 1700, LY - 22, 150, 44, 'border-radius:999px;background:var(--inv);color:var(--inv-ink);font:800 20px var(--fb);display:flex;align-items:center;justify-content:center;letter-spacing:.08em', H.esc(d.now.label || 'TODAY')); }
  T.forEach(x => ctx.cue(x, 'pop', .4)); if (now) ctx.cue(tNow, 'tick', .5);
  E_.forEach((e, i) => ctx.focus(T[i] - .2, { x: e.x - 200, y: LY - 120, w: 400, h: 240 }, { z: 1.03, k: .22, d: 1.2 }));
  if (n) ctx.reset(T[n - 1] + 1.4, 1.2);
  return t => {
    set(base, { sx: A(t, .1, .8, E.io), o: .12 });
    let x = X0 - 90; E_.forEach((e, i) => { x = lerp(x, e.x, E.io(P(t, T[i] - .35, T[i] + .15))); }); if (now) x = lerp(x, 1700, E.io(P(t, tNow - .3, tNow + .2)));
    set(fill, { sx: Math.max(.0001, (x - 110) / 1700) }); set(head, { x: x - 15, o: A(t, .3, .3) });
    E_.forEach(({ dot, date, c, pin }, i) => { H.pop(dot, t, T[i] - .05, { s0: .3 }); set(date, { o: A(t, T[i], .3), y: 10 * (1 - A(t, T[i], .5)) }); enter(c, t, T[i] + .05, { dy: i % 2 ? -26 : 26 }); set(pin, { o: .2 * A(t, T[i], .3) }); });
    if (now) H.pop(now, t, tNow, { s0: .6 });
  };
};
