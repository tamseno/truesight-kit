// e24 — night shift on routines: studio cross-section, 21:00 Director, overnight Render queue, 08:00 Delivery, night -> dawn
SCENES.e24 = (root, ctx, H) => {
  const { put, h, set, enter, A, SP, E, P, lerp, cl, bot, BOTS, BOT_ORDER, IC, rnd } = H;
  const D = (p, x, y, w, hh, css = '', html = '') => { const e = put(p, h('div', '', html), x, y, w, hh); if (css) e.style.cssText += ';' + css; return e; };
  const T = { rout: ctx.at('Routines'), nine: ctx.at('nine'), dir: ctx.at('Director'), req: ctx.at('requests'), through: ctx.at('Through'), ren: ctx.at('Render'), queue: ctx.at('queue'), eight: ctx.at('eight'), del: ctx.at('Delivery'), give: ctx.at('sends'), passed: ctx.at('passed'), ok: ctx.at('approve'), bed: ctx.at('storyboards'), wake: ctx.at('wake'), get: ctx.at('finished') };
  const dur = ctx.dur;
  // clock: hours after 21:00
  const C = t => {
    if (t < T.nine - .3) return lerp(-1 / 4, -1 / 12, P(t, 0, T.nine - .3));
    if (t < T.nine + .2) return lerp(-1 / 12, 0, E.io(P(t, T.nine - .3, T.nine + .2)));
    if (t < T.through) return lerp(0, .6, P(t, T.nine + .2, T.through));
    if (t < T.eight - .1) return lerp(.6, 10.85, E.io(P(t, T.through, T.eight - .1)));
    if (t < T.eight + .5) return lerp(10.85, 11, E.out(P(t, T.eight - .1, T.eight + .5)));
    return 11 + .3 * P(t, T.eight + .5, dur);
  };
  const fmt = c => { const m = ((Math.floor(21 * 60 + c * 60) % 1440) + 1440) % 1440; return String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0'); };

  // ---------- sky
  const dawn = D(root, 0, 0, 1920, 1080, 'background:linear-gradient(180deg,#34488a 0%,#6d74b8 42%,#e8a08e 72%,#ffd9a3 100%)');
  const moon = D(root, 1736, 222, 64, 64, '', IC.moon());
  const sunG = D(root, 1650, 260, 240, 240, 'border-radius:50%;background:radial-gradient(circle,rgba(255,214,120,.65),rgba(255,214,120,0) 65%)');
  const sun = D(root, 1730, 340, 80, 80, '', IC.sun());

  // ---------- top row: clock + active routine
  const clk = D(root, 160, 212, 330, 78, 'border-radius:20px;background:rgba(255,255,255,.09);box-shadow:inset 0 0 0 1.5px rgba(255,255,255,.16),0 20px 40px -20px rgba(0,0,0,.5);backdrop-filter:blur(6px);display:flex;align-items:center;gap:16px;padding:0 22px;color:#fff');
  const clkIc = clk.appendChild(h('span', '', '')); clkIc.style.cssText = 'width:40px;height:40px;flex:none';
  const clkT = clk.appendChild(h('span', '', '')); clkT.style.cssText = 'font:800 46px Geist;letter-spacing:.02em;font-variant-numeric:tabular-nums;width:140px';
  const clkD = clk.appendChild(h('span', '', '')); clkD.style.cssText = 'font:700 17px Geist;color:rgba(255,255,255,.6);letter-spacing:.1em';
  const rpill = D(root, 516, 226, 1000, 50, 'display:flex;align-items:center');
  const rin = rpill.appendChild(h('div', '', '')); rin.style.cssText = 'display:inline-flex;align-items:center;gap:12px;height:50px;padding:0 22px;border-radius:999px;background:rgba(255,255,255,.95);font:800 23px Geist;color:#15161c;white-space:nowrap;box-shadow:0 14px 30px -12px rgba(0,0,0,.45)';

  // ---------- building
  const BX = 160, RW = 272, RY = 346, RH = 344;
  const shell = D(root, BX - 12, 290, RW * 5 + 24, 430, 'border-radius:18px 18px 6px 6px;background:#262e63;box-shadow:0 40px 80px -30px rgba(0,0,0,.6),inset 0 2px 0 rgba(255,255,255,.12)');
  const roof = D(root, BX - 24, 286, RW * 5 + 48, 56, 'border-radius:14px;background:linear-gradient(180deg,#323b7a,#232a5c);box-shadow:inset 0 1.5px 0 rgba(255,255,255,.18)');
  const ground = D(root, 100, 712, 1730, 4, 'border-radius:2px;background:rgba(255,255,255,.18)');
  const PROPS = {};
  const rooms = BOT_ORDER.map((k, i) => {
    const x = BX + i * RW + 10, rm = D(root, x, RY + 8, RW - 20, RH - 24, 'border-radius:12px;overflow:hidden;background:#141a40');
    const light = D(rm, 0, 0, RW - 20, RH - 24, 'background:radial-gradient(130% 95% at 50% 0%,rgba(255,212,140,.62),rgba(255,212,140,.1) 72%)');
    D(rm, (RW - 20) / 2 - 22, 0, 44, 8, 'border-radius:0 0 8px 8px;background:#ffe3a3');
    const floor = D(rm, 0, RH - 24 - 34, RW - 20, 34, 'background:rgba(0,0,0,.22)');
    const b = bot(k, 96); put(rm, b.el, (RW - 20) / 2 - 48, 168);
    const nm = D(rm, 0, RH - 24 - 32, RW - 20, 32, 'display:flex;align-items:center;justify-content:center;gap:8px;font:800 18px Geist;color:#fff', `<i style="width:9px;height:9px;border-radius:50%;background:${BOTS[k].c}"></i>${BOTS[k].name}`);
    return { k, rm, light, b, nm, x };
  });
  const RWI = RW - 20;
  // Director: storyboard board
  const board = D(rooms[0].rm, 26, 34, RWI - 52, 100, 'border-radius:10px;background:#f4f1ea;box-shadow:0 8px 18px -8px rgba(0,0,0,.6)');
  const sb = [0, 1, 2].map(j => { const f = D(board, 12 + j * 64, 18, 56, 40, 'border-radius:6px;background:#dfe7f7'); D(f, 14, 14, 28, 12, 'border-radius:4px;background:#15161c'); D(board, 12 + j * 64, 66, 40, 6, 'border-radius:3px;background:#c9ccd6'); return f; });
  const sbCk = D(board, RWI - 52 - 34, -10, 30, 30, '', IC.check());
  // Animator: monitor with code
  const mon = D(rooms[1].rm, 40, 32, RWI - 80, 104, 'border-radius:10px;background:#0b0e22;box-shadow:inset 0 0 0 3px #3a4280;overflow:hidden');
  const code = D(mon, 12, 0, RWI - 104, 300);
  for (let j = 0; j < 18; j++) D(code, (rnd(j) * 3 | 0) * 14, j * 16, 30 + rnd(j + 5) * 90, 6, `border-radius:3px;background:${['#7ee0b8', '#ffd66b', '#9db4f7', '#ff9f8a'][j % 4]};opacity:.85`);
  // Render: queue panel
  const q = D(rooms[2].rm, 22, 26, RWI - 44, 124, 'border-radius:10px;background:#f4f5fb;box-shadow:0 8px 18px -8px rgba(0,0,0,.6);padding:10px 12px');
  D(q, 12, 8, 160, 22, 'font:800 15px Geist;color:#15161c', 'Render queue');
  const qCnt = D(q, RWI - 44 - 52, 8, 40, 22, 'font:800 15px Geist;color:#5a5cf0;text-align:right');
  const qRows = [0, 1, 2].map(j => { const r = D(q, 12, 36 + j * 28, RWI - 68, 22, 'display:flex;align-items:center;gap:8px;font:600 14px Maple;color:#15161c'); r.innerHTML = `<span style="flex:1">clip_0${j + 1}.mp4</span>`; const st = r.appendChild(h('span', '', '')); st.style.cssText = 'width:20px;height:20px;border-radius:50%;flex:none'; return st; });
  const scan = D(rooms[2].rm, 22, 26, RWI - 44, 124, 'border-radius:10px;box-shadow:0 0 0 3px #ffd66b,0 0 24px rgba(255,214,107,.8)');
  // Critic: score tiles
  const crit = D(rooms[3].rm, 30, 40, RWI - 60, 90, 'display:flex;gap:10px;justify-content:center;align-items:center');
  const ctiles = [8, 9, 8].map(v => { const e = crit.appendChild(h('div', '', String(v))); e.style.cssText = 'width:56px;height:70px;border-radius:12px;background:#2a3266;color:#fff;font:800 34px Geist;display:flex;align-items:center;justify-content:center'; return e; });
  // Delivery: film on shelf
  const shelf = D(rooms[4].rm, 40, 128, RWI - 80, 8, 'border-radius:4px;background:#3a4280');
  const filmAbs = D(root, 0, 0, 104, 72, 'border-radius:12px;background:#fff;box-shadow:0 12px 24px -8px rgba(0,0,0,.6);z-index:3');
  D(filmAbs, 8, 8, 88, 40, 'border-radius:7px;background:#dfe7f7'); D(filmAbs, 38, 18, 28, 20, 'border-radius:10px;background:#15161c');
  D(filmAbs, 8, 52, 60, 12, 'font:700 10px Maple;color:#6b6e7b', 'final.mp4');
  const filmCk = D(filmAbs, 80, -10, 30, 30, '', IC.check());
  // roof schedule plates
  const plate = (i, txt) => D(root, BX + i * RW + RW / 2 - 80, 297, 160, 34, 'border-radius:999px;display:flex;align-items:center;justify-content:center;gap:8px;font:800 17px Geist;white-space:nowrap', `<svg width="18" height="18" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2.6"/><path d="M12 7v5l3 2" stroke="currentColor" stroke-width="2.6" fill="none" stroke-linecap="round"/></svg>${txt}`);
  const plates = [plate(0, 'Nightly 21:00'), plate(2, 'All night'), plate(4, 'Daily 08:00')];
  // house (you)
  const house = D(root, 1574, 400, 240, 312);
  const hroof = D(house, 0, 20, 240, 96, 'clip-path:polygon(50% 0,100% 100%,0 100%);background:#e0645a');
  const hbody = D(house, 18, 112, 204, 200, 'background:#3c4378;border-radius:0 0 6px 6px');
  const hwin = D(hbody, 52, 44, 100, 84, 'border-radius:10px;background:#1a2048;box-shadow:inset 0 0 0 4px #565e9c;overflow:hidden');
  const zz = D(hwin, 30, 14, 60, 50, 'font:800 22px Geist;color:#9db4f7', 'z<sup>z</sup>');
  const hdoor = D(hbody, 82, 142, 40, 58, 'border-radius:8px 8px 0 0;background:#262c5a');
  const you = D(root, 1650, 356, 88, 40, 'border-radius:12px;background:#fff;color:#15161c;font:800 21px Geist;display:flex;align-items:center;justify-content:center;box-shadow:0 10px 22px -10px rgba(0,0,0,.5)', 'You');
  // request paper flying you -> Director
  const paper = D(root, 0, 0, 80, 58, 'border-radius:8px;background:#fff;box-shadow:0 12px 24px -8px rgba(0,0,0,.6);z-index:3;padding:8px', '<div style="font:800 14px Geist;color:#15161c">Request</div><div style="margin-top:6px;height:5px;width:52px;border-radius:3px;background:#c9ccd6"></div><div style="margin-top:5px;height:5px;width:38px;border-radius:3px;background:#c9ccd6"></div>');

  // ---------- timeline strip
  const TX0 = 200, TX1 = 1720, TY = 772, xc = c => TX0 + cl(c / 11) * (TX1 - TX0);
  const track = D(root, TX0, TY, TX1 - TX0, 8, 'border-radius:4px;background:rgba(255,255,255,.14)');
  const fill = D(root, TX0, TY, 0, 8, 'border-radius:4px;background:linear-gradient(90deg,#33c9a6,#5a5cf0 50%,#ffd66b)');
  const hrs = [...Array(12)].map((_, i) => { const x = xc(i); const tk = D(root, x - 1, TY + 14, 2, 10, 'background:rgba(255,255,255,.35)'); const lb = D(root, x - 34, TY + 26, 68, 22, 'font:700 16px Maple;color:rgba(255,255,255,.65);text-align:center', fmt(i)); return { tk, lb }; });
  const diam = [...Array(10)].map((_, i) => D(root, xc(i + 1) - 8, TY - 26, 16, 16, 'border-radius:4px;background:#5a5cf0;transform:rotate(45deg);box-shadow:0 0 0 3px rgba(90,92,240,.25)'));
  const evD = D(root, xc(0) - 13, TY - 32, 26, 26, 'border-radius:50%;background:#33c9a6;box-shadow:0 0 0 4px rgba(51,201,166,.25)');
  const evL = D(root, xc(11) - 13, TY - 32, 26, 26, 'border-radius:50%;background:#3a86f4;box-shadow:0 0 0 4px rgba(58,134,244,.25)');
  const needle = D(root, 0, TY - 40, 4, 58, 'border-radius:2px;background:#fff;box-shadow:0 0 10px rgba(255,255,255,.7)');
  const knob = D(needle, -6, -8, 16, 16, 'border-radius:50%;background:#fff');
  // bottom message pills
  const pillCss = 'display:inline-flex;align-items:center;gap:12px;height:58px;padding:0 24px;border-radius:999px;background:#fff;color:#15161c;font:800 24px Geist;white-space:nowrap;box-shadow:0 16px 34px -14px rgba(0,0,0,.5)';
  const pL = D(root, TX0 - 20, 852, 600, 58); pL.innerHTML = `<div style="${pillCss}"><span style="width:30px;height:30px">${IC.moon()}</span>Before bed · approve storyboards<span style="width:28px;height:28px">${IC.check()}</span></div>`;
  const pR = D(root, TX1 - 580, 852, 600, 58, 'display:flex;justify-content:flex-end'); pR.innerHTML = `<div style="${pillCss}"><span style="width:32px;height:32px">${IC.sun()}</span>Wake up · finished films<span style="width:28px;height:28px">${IC.check()}</span></div>`;
  const mid = D(root, 700, 878, 520, 6, 'background:repeating-linear-gradient(90deg,rgba(255,255,255,.5) 0 12px,transparent 12px 22px);border-radius:3px;transform-origin:left');
  const midL = D(root, 800, 846, 320, 26, 'font:700 18px Geist;color:rgba(255,255,255,.8);text-align:center', 'The studio works all night');

  // phases for routine pill
  const PH = [[0, '#ffd66b', 'Routines run the clock'], [T.nine - .1, BOTS.director.c, 'Director · 21:00 · picks up new requests'], [T.through - .1, BOTS.render.c, 'Render · works the queue through the night'], [T.eight - .1, BOTS.delivery.c, 'Delivery · 08:00 · sends you what passed'], [T.ok - .1, '#1fbf75', 'Approve before bed, wake up to finished films']];
  ctx.cue(.15, 'swoosh', .5); ctx.cue(T.nine, 'pop', .5); ctx.cue(T.req, 'whoosh', .4); ctx.cue(T.through, 'whoosh', .4);
  [1, 3, 5, 7, 9].forEach(i => ctx.cue(T.through + .3 + i * .25, 'tick', .3)); ctx.cue(T.eight, 'ding', .5); ctx.cue(T.give, 'whoosh', .45); ctx.cue(T.give + .7, 'ding', .5);
  ctx.cue(T.ok, 'pop', .45); ctx.cue(T.wake, 'ding', .5);

  return (t) => {
    const c = C(t), dk = A(t, T.eight - 1.4, 1.8, E.io);
    set(dawn, { o: dk * .95 });
    set(moon, { y: 90 * dk, o: A(t, .2, .5) * (1 - dk) }); set(sun, { y: -110 * dk, r: t * 10, o: dk }); set(sunG, { y: -110 * dk, o: dk });
    // clock
    set(clk, { o: A(t, .1, .4), x: -16 * (1 - A(t, .1, .5)) });
    clkT.textContent = fmt(c); clkD.textContent = c >= 3 ? 'DAY 2' : 'DAY 1'; clkIc.innerHTML = c >= 10.5 ? IC.sun() : IC.moon();
    let pi = 0; for (let i = 0; i < PH.length; i++) if (t >= PH[i][0]) pi = i;
    const [p0, pc, ptx] = PH[pi]; rin.innerHTML = `<i style="width:12px;height:12px;border-radius:50%;background:${pc};flex:none"></i>${ptx}`;
    const rk = SP(t, Math.max(.2, p0), .6); set(rpill, { y: 14 * (1 - rk), o: A(t, Math.max(.2, p0), .25) });
    // building
    enter(shell, t, .1, { dy: 50, rx: 0, blur: 0 }); enter(roof, t, .15, { dy: 50, rx: 0, blur: 0 }); set(ground, { o: A(t, .1, .5) });
    const lights = [
      t < T.nine - .1 ? .12 : t < T.through ? 1 : .35,
      c > .8 && c < 9 ? .65 : .18,
      t < T.through - .1 ? .15 : t < T.eight ? 1 : .35,
      c > 4 && c < 9.5 ? .65 : .18,
      t < T.eight - .1 ? .12 : 1,
    ];
    rooms.forEach((r, i) => {
      enter(r.rm, t, .25 + i * .07, { dy: 40, rx: 0 });
      const L = Math.max(lights[i], .3 * dk + .2 * (dk > 0 ? 1 : 0) * dk);
      set(r.light, { o: L });
      r.b.update(t, { bob: L > .6 ? 3.5 : 1.2, lookY: L > .6 ? -.6 : .5, lookX: L > .6 ? Math.sin(t * 1.3 + i) * .5 : 0 });
      set(r.nm, { o: lerp(.55, 1, L) });
    });
    // Director: storyboard frames fill at 21:00
    sb.forEach((f, j) => { const s = T.nine + j * .2, k = SP(t, s, .6); set(f, { s: lerp(.5, 1, k), o: .25 + .75 * A(t, s, .2) }); });
    set(sbCk, { s: lerp(.3, 1, SP(t, T.nine + .8, .6)), o: A(t, T.nine + .8, .15) });
    // Animator code scroll
    code.style.transform = `translateY(${(-((Math.max(0, c - .8) * 60) % 160)).toFixed(1)}px)`; set(mon, { o: lerp(.5, 1, lights[1]) });
    // Render: hourly checks
    let fl = 0; for (let k = 1; k <= 10; k++) if (c >= k) fl = Math.max(fl, Math.exp(-(c - k) * 5));
    const renOn = t > T.through - .1;
    set(scan, { o: renOn ? fl : 0 });
    const done = [3, 6, 9].filter(v => c > v).length; qCnt.textContent = `${3 - done}`;
    qRows.forEach((st, j) => { const ok = c > 3 + j * 3; st.innerHTML = ok ? IC.check() : ''; st.style.boxShadow = ok ? 'none' : 'inset 0 0 0 2.5px #c9ccd6'; set(st, { s: ok ? lerp(.4, 1, SP(t, 0, 1) * cl((c - (3 + j * 3)) * 4)) : 1 }); });
    diam.forEach((d, k) => { const hit = c >= k + 1; d.style.background = hit ? '#ffd66b' : '#5a5cf0'; d.style.transform = `rotate(45deg) scale(${(hit ? 1 + .6 * Math.exp(-(c - k - 1) * 4) : .8).toFixed(3)})`; d.style.opacity = A(t, T.through - .3 + k * .03, .3).toFixed(3); });
    // Critic tiles light
    ctiles.forEach((e, j) => { const on = c > 5 + j * 1.2; e.style.background = on ? '#1fbf75' : '#2a3266'; set(e, { s: on ? 1 + .15 * Math.exp(-(c - 5 - j * 1.2) * 4) : 1 }); });
    // plates
    const fire = [t > T.nine - .1 && t < T.through, t > T.through - .1 && t < T.eight, t > T.eight - .1];
    plates.forEach((p, i) => { set(p, { o: A(t, .5 + i * .1, .4) }); p.style.background = fire[i] ? '#ffd66b' : 'rgba(255,255,255,.12)'; p.style.color = fire[i] ? '#15161c' : 'rgba(255,255,255,.75)'; set(p, { o: A(t, .5 + i * .1, .4), s: fire[i] ? 1.06 : 1 }); });
    // house
    set(house, { o: A(t, .4, .5), y: 30 * (1 - SP(t, .4, .9)) }); set(you, { o: A(t, .6, .4), y: 10 * (1 - SP(t, .6, .8)) });
    const morning = A(t, T.eight + .2, .6);
    hwin.style.background = morning > 0 ? `color-mix(in srgb,#ffe3a3 ${Math.round(morning * 100)}%,#1a2048)` : '#1a2048';
    set(zz, { o: (1 - morning) * A(t, .6, .4), y: -4 * Math.sin(t * 2) });
    hbody.style.background = `color-mix(in srgb,#8a90c9 ${Math.round(dk * 60)}%,#3c4378)`;
    // paper: you -> Director
    const pk = A(t, T.dir, 1.0, E.io), px0 = 1694, py0 = 520, px1 = BX + RW / 2 - 40, py1 = 400;
    set(paper, { x: lerp(px0, px1, pk), y: lerp(py0, py1, pk) - 210 * Math.sin(pk * Math.PI), r: 10 * Math.sin(pk * Math.PI * 2), s: lerp(.8, 1, Math.sin(pk * Math.PI)), o: A(t, T.dir - .05, .15) * (1 - A(t, T.dir + 1.0, .2)) });
    // film: Delivery shelf -> house window
    const fx0 = BX + 4 * RW + RW / 2 - 52, fy0 = RY + 8 + 128 - 72, fx1 = 1574 + 18 + 52 - 2, fy1 = 400 + 112 + 50;
    const fk = A(t, T.give - .1, .9, E.io);
    set(filmAbs, { x: lerp(fx0, fx1, fk), y: lerp(fy0, fy1, fk) - 160 * Math.sin(fk * Math.PI), r: -8 * Math.sin(fk * Math.PI), s: lerp(1, .92, fk), o: A(t, T.del - .2, .3) });
    set(filmCk, { s: lerp(.3, 1, SP(t, T.give + .7, .6)), o: A(t, T.give + .7, .15) });
    // timeline
    const tl = A(t, .5, .5); [track, fill].forEach(e => set(e, { o: tl }));
    fill.style.width = (xc(c) - TX0).toFixed(1) + 'px';
    hrs.forEach((r, i) => { set(r.tk, { o: tl }); set(r.lb, { o: tl * (c >= i - .02 ? 1 : .55) }); r.lb.style.color = c >= i - .02 ? '#fff' : 'rgba(255,255,255,.6)'; });
    set(evD, { s: lerp(.3, 1, SP(t, T.nine, .6)) * (1 + .3 * Math.exp(-Math.abs(t - T.nine - .3) * 3)), o: A(t, T.nine, .2) });
    set(evL, { s: lerp(.3, 1, SP(t, T.eight, .6)), o: A(t, T.eight, .2) });
    set(needle, { x: xc(c) - 2, o: tl });
    set(pL, { y: 16 * (1 - SP(t, T.ok - .1, .7)), o: A(t, T.ok - .1, .25) });
    set(pR, { y: 16 * (1 - SP(t, T.wake - .1, .7)), o: A(t, T.wake - .1, .25) });
    set(mid, { sx: A(t, T.bed + .2, 1.2, E.io), o: A(t, T.bed + .2, .2) }); set(midL, { o: A(t, T.bed + .6, .4) });
  };
};
