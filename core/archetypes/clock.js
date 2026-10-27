// clock — a night (or day) on a timeline. A playhead sweeps between events; the big clock follows it.
// data: { from: "21:00", to: "08:00", events: [{ time: "21:00", label: "Director picks up requests", cast?, at? }], day?: false }
ARCH.clock = (root, ctx, H, d) => {
  const { set, enter, A, SP, E, P, lerp, D, BOTS, bot, IC } = H;
  const ev = d.events || [], T = H.times(ctx, ev, .1, .8);
  const mins = s => { const [h, m] = s.split(':').map(Number); return h * 60 + m; };
  const m0 = mins(d.from || ev[0].time), m1r = mins(d.to || ev[ev.length - 1].time), m1 = m1r <= m0 ? m1r + 1440 : m1r;
  const norm = s => { let m = mins(s); if (m < m0) m += 1440; return m; };
  const X0 = 170, X1 = 1750, LY = 640, xOf = m => X0 + (X1 - X0) * (m - m0) / (m1 - m0);
  const clockC = D(root, 88, 236, 520, 170, 'border-radius:26px;background:color-mix(in srgb,currentColor 8%,transparent);box-shadow:inset 0 0 0 1px color-mix(in srgb,currentColor 14%,transparent);display:flex;align-items:center;gap:22px;padding:0 34px');
  clockC.innerHTML = `<span style="width:64px;height:64px;flex:none">${d.day ? IC.sun() : IC.moon()}</span><span class="ck" style="font:var(--fwd) 100px/1 var(--fd);letter-spacing:calc(-.03em * var(--trk));font-variant-numeric:tabular-nums">00:00</span>`;
  clockC.classList.add('onbg'); const ck = clockC.querySelector('.ck');
  const line = D(root, X0, LY - 3, X1 - X0, 6, 'border-radius:3px;background:currentColor;opacity:.16'); line.classList.add('onbg');
  const prog = D(root, X0, LY - 3, X1 - X0, 6, 'border-radius:3px;background:#ffd66b;transform-origin:left');
  const hours = []; for (let m = Math.ceil(m0 / 60) * 60; m <= m1; m += 60) hours.push(D(root, xOf(m) - 40, LY + 26, 80, 30, 'text-align:center;font:600 22px var(--fm);opacity:.55', String(Math.floor(m / 60) % 24).padStart(2, '0') + ':00')); hours.forEach(e => e.classList.add('onbg'));
  const head = D(root, 0, LY - 16, 32, 32, 'border-radius:50%;background:#ffd66b;box-shadow:0 0 0 8px rgba(255,214,107,.25)');
  const cards = ev.map((e, i) => {
    const x = xOf(norm(e.time)), up = i % 2 === 0, cw = 400;
    const k = D(root, Math.min(1832 - cw, Math.max(88, x - cw / 2)), up ? 440 : 720, cw, 150, 'border-radius:22px;background:var(--surface);box-shadow:var(--card-border),0 20px 50px -14px rgba(0,0,0,.45);display:flex;align-items:center;gap:18px;padding:0 24px');
    if (BOTS[e.cast]) { const b = bot(e.cast, 76); const w = k.appendChild(H.h('div', '')); w.style.cssText = 'position:relative;width:76px;height:76px;flex:none'; w.appendChild(b.el); k.b = b; }
    k.insertAdjacentHTML('beforeend', `<div><div style="font:800 30px var(--fm);color:var(--accent)">${H.esc(e.time)}</div><div style="font:700 26px/1.2 var(--fb);color:var(--ink)">${H.md(e.label)}</div></div>`);
    const pin = D(root, x - 2, up ? 590 : LY, 4, up ? LY - 590 : 720 - LY, 'background:currentColor;opacity:.35'); pin.classList.add('onbg');
    return { k, pin, m: norm(e.time) };
  });
  T.forEach(x => ctx.cue(x, 'pop', .4));
  cards.forEach((c, i) => ctx.cam(T[i] - .3, { x: lerp(960, xOf(c.m), .16), y: 560, z: 1.03, d: 1.2 }));
  return t => {
    let m = m0; cards.forEach((c, i) => { m = lerp(m, c.m, E.io(P(t, T[i] - .4, T[i] + .2))); });
    const hh = Math.floor(m / 60) % 24, mm = Math.floor(m % 60); ck.textContent = `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
    enter(clockC, t, .1, { dy: 30 }); set(line, { sx: A(t, .1, .8, E.io) });
    set(prog, { sx: Math.max(.0001, (m - m0) / (m1 - m0)) }); set(head, { x: xOf(m), o: A(t, .3, .3) });
    hours.forEach((h_, i) => set(h_, { o: A(t, .3 + i * .03, .3) * .55 }));
    cards.forEach(({ k, pin }, i) => { enter(k, t, T[i] - .1, { dy: i % 2 ? -30 : 30 }); set(pin, { o: A(t, T[i], .3) * .35 }); if (k.b) k.b.update(t); });
  };
};
