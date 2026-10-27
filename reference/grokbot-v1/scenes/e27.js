// e27 — "Start tonight": four-step checklist; a 15-second test film runs the whole pipeline; routines unlock and switch on only after it passes
SCENES.e27 = (root, ctx, H) => {
  const { put, h, set, enter, A, SP, E, P, lerp, cl, bot, BOTS, BOT_ORDER, IC } = H;
  const D = (p, x, y, w, hh, css = '', html = '') => { const e = put(p, h('div', '', html), x, y, w, hh); if (css) e.style.cssText += ';' + css; return e; };
  const T = { start: ctx.at('start'), write: ctx.at('write'), skill: ctx.at('skill'), create: ctx.at('create'), bots: ctx.at('bots'), add: ctx.at('add'), script: ctx.at('script'), run: ctx.at('run'), test: ctx.at('test'), e2e: ctx.at('endtoend'), only: ctx.at('Only'), survives: ctx.at('survives'), pipe: ctx.at('pipeline'), turn: ctx.at('turnon'), routines: ctx.at('routines') };
  const tRun0 = T.run + .25, tArrive = T.pipe - .25, stT = k => lerp(tRun0, tArrive, k / 4), tPass = T.pipe + .1;
  const tTick = [T.skill + .25, T.bots + .25, T.script + .25, tPass + .15];
  const tStep = [T.write - .15, T.create - .15, T.add - .15, T.run - .15];
  // ---------- left: checklist
  const LC = put(root, H.card({ w: 790, h: 664 }), 100, 232);
  D(LC, 40, 34, 500, 40, 'font:800 32px Geist;letter-spacing:-.015em;display:flex;align-items:center;gap:14px', `<span style="width:36px;height:36px">${IC.moon()}</span>Start tonight`);
  const prog = D(LC, 560, 38, 190, 32, 'font:800 20px Geist;color:#6b6e7b;text-align:right;font-variant-numeric:tabular-nums');
  const ptr = D(LC, 40, 96, 710, 8, 'border-radius:4px;background:#eef0f5;overflow:hidden'); const pf = D(ptr, 0, 0, 0, 8, 'border-radius:4px;background:#1fbf75');
  const STEPS = [['Write the house style skill', 'One rulebook every bot reads'], ['Create the five bots', 'Director · Animator · Render · Critic · Delivery'], ['Add the bootstrap script', 'Reinstalls tools after any reset'], ['Run one 15-second test', 'End to end, through every bot']];
  const steps = STEPS.map(([ti, sub], i) => {
    const y = 132 + i * 128;
    const row = D(LC, 24, y, 742, 112, 'border-radius:18px');
    const box = D(row, 18, 32, 48, 48, 'border-radius:50%;box-shadow:inset 0 0 0 3px #d5d8e0;font:800 20px Geist;color:#a3a6b3;display:flex;align-items:center;justify-content:center', String(i + 1));
    const ck = D(row, 18, 32, 48, 48, '', IC.check());
    const tt = D(row, 88, 22, 600, 40, 'font:800 29px Geist;letter-spacing:-.01em;white-space:nowrap', ti);
    const sb = D(row, 88, 64, 640, 28, 'font:600 19px Geist;color:#8a8d99;white-space:nowrap', sub);
    return { row, box, ck, tt, sb };
  });
  // artifacts on the right of each row
  const art1 = D(steps[0].row, 470, 22, 250, 40, 'border-radius:10px;background:#f4f5f9;box-shadow:0 0 0 1px rgba(21,22,28,.06);display:flex;align-items:center;gap:8px;padding:0 12px;font:600 17px Maple;color:#15161c;white-space:nowrap', `<span style="width:20px;height:20px">${IC.file('#d8ccff')}</span>skills/house-style.md`);
  steps[0].tt.style.width = '370px';
  const art3 = D(steps[2].row, 520, 22, 200, 40, 'border-radius:10px;background:#16171f;display:flex;align-items:center;gap:8px;padding:0 12px;font:600 17px Maple;color:#d8dbe7;white-space:nowrap', '<span style="color:#7ee0b8">$</span> bootstrap.sh');
  const art4 = D(steps[3].row, 560, 24, 160, 38, 'border-radius:999px;display:flex;align-items:center;justify-content:center;gap:8px;font:800 17px Geist;white-space:nowrap');
  // ---------- right: test run + routines
  const RC = put(root, H.card({ w: 910, h: 664 }), 920, 232);
  D(RC, 36, 30, 500, 36, 'font:800 26px Geist;display:flex;align-items:center;gap:12px;white-space:nowrap', '<svg width="26" height="26" viewBox="0 0 24 24"><rect x="3" y="6" width="18" height="12" rx="3" fill="#15161c"/><path d="M10 9.5l5 2.5-5 2.5z" fill="#fff"/></svg>Test film<span style="font:600 18px Maple;color:#8a8d99">test.mp4 · 15 s</span>');
  const stamp = D(RC, 700, 24, 170, 48, 'border-radius:12px;background:#1fbf75;color:#fff;font:800 22px Geist;letter-spacing:.06em;display:flex;align-items:center;justify-content:center;gap:8px;box-shadow:0 12px 26px -10px rgba(31,191,117,.8)', '<svg width="22" height="22" viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" stroke="#fff" stroke-width="3.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>PASSED');
  const PX0 = 105, PX1 = 805, sx = k => lerp(PX0, PX1, k / 4), TRY = 296;
  D(RC, PX0, TRY - 3, PX1 - PX0, 6, 'border-radius:3px;background:#eef0f5');
  const trF = D(RC, PX0, TRY - 3, 0, 6, 'border-radius:3px;background:linear-gradient(90deg,#33c9a6,#f5a524,#5a5cf0,#8b5cf6,#3a86f4)');
  const pBots = BOT_ORDER.map((k, i) => {
    const x = sx(i);
    const slot = D(RC, x - 40, 108, 80, 80, 'border-radius:50%;border:2.5px dashed #e3e4ea');
    const b = bot(k, 84); put(RC, b.el, x - 42, 104);
    const nm = D(RC, x - 70, 198, 140, 26, `font:800 19px Geist;text-align:center;color:${BOTS[k].c}`, BOTS[k].name);
    const dot = D(RC, x - 9, TRY - 9, 18, 18, 'border-radius:50%;background:#fff;box-shadow:inset 0 0 0 3px #d5d8e0');
    const ck = D(RC, x - 14, TRY - 14, 28, 28, '', IC.check());
    return { slot, b, nm, dot, ck };
  });
  const tok = D(RC, 0, TRY - 70, 104, 46, 'border-radius:12px;background:#15161c;color:#fff;font:700 16px Maple;display:flex;align-items:center;justify-content:center;gap:8px;box-shadow:0 14px 26px -12px rgba(0,0,0,.6);z-index:3', '<svg width="16" height="16" viewBox="0 0 24 24"><path d="M7 4l13 8-13 8z" fill="#ffd66b"/></svg>15 s');
  D(RC, 36, 346, 838, 1, 'background:rgba(21,22,28,.08)');
  // routines panel
  D(RC, 36, 366, 400, 34, 'font:800 24px Geist;display:flex;align-items:center;gap:10px;white-space:nowrap', '<svg width="24" height="24" viewBox="0 0 24 24"><path d="M20 12a8 8 0 11-2.3-5.6M20 4v4.5h-4.5" stroke="#15161c" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>Routines');
  const lockB = D(RC, 534, 362, 340, 40, 'border-radius:999px;display:flex;align-items:center;justify-content:center;gap:10px;font:800 17px Geist;white-space:nowrap');
  const RT = [['director', 'Director', 'Nightly 21:00'], ['render', 'Render', 'Works the queue overnight'], ['delivery', 'Delivery', 'Daily 08:00']];
  const rrows = RT.map(([k, n, w], i) => {
    const y = 418 + i * 78;
    const r = D(RC, 36, y, 838, 66, 'border-radius:16px;background:#f6f7f9;display:flex;align-items:center;gap:14px;padding:0 18px');
    r.innerHTML = `<i style="width:14px;height:14px;border-radius:50%;background:${BOTS[k].c};flex:none"></i><b style="font:800 21px Geist;width:110px">${n}</b><span style="font:600 19px Geist;color:#6b6e7b;white-space:nowrap">${w}</span>`;
    const tg = D(r, 838 - 18 - 64, 15, 64, 36, 'border-radius:18px;background:#d5d8e0');
    const kn = D(tg, 4, 4, 28, 28, 'border-radius:50%;background:#fff;box-shadow:0 2px 6px rgba(0,0,0,.2)');
    const st = D(r, 838 - 18 - 64 - 120, 18, 110, 30, 'font:800 16px Geist;letter-spacing:.06em;text-align:right;display:flex;align-items:center;justify-content:flex-end');
    return { r, tg, kn, st, y };
  });
  const cur = H.cursor(RC);
  const tOn = [T.turn + .05, T.turn + .35, T.turn + .65].map(v => Math.min(v, ctx.dur - .5));

  ctx.cue(.15, 'swoosh', .5); tTick.slice(0, 3).forEach(s => ctx.cue(s, 'tick', .5)); [0, 1, 2, 3, 4].forEach(i => ctx.cue(T.create + i * .12, 'pop', .25));
  ctx.cue(tRun0, 'whoosh', .4); [1, 2, 3, 4].forEach(k => ctx.cue(stT(k), 'tick', .3)); ctx.cue(tPass, 'ding', .6); tOn.forEach(s => ctx.cue(s, 'click', .45));

  return (t) => {
    enter(LC, t, .1, { dy: 60, rx: 10 }); enter(RC, t, .35, { dy: 60, rx: 10 });
    let done = 0;
    steps.forEach((s, i) => {
      const a = A(t, tStep[i], .35), d = A(t, tTick[i], .2); if (t >= tTick[i]) done++;
      const active = t >= tStep[i] && t < tTick[i];
      s.row.style.background = active ? '#f3f6ff' : 'transparent';
      s.row.style.boxShadow = active ? 'inset 0 0 0 2px rgba(58,108,244,.25)' : 'none';
      set(s.tt, { o: lerp(.3, 1, a), x: 10 * (1 - a) }); set(s.sb, { o: lerp(.25, 1, a) });
      s.box.style.boxShadow = `inset 0 0 0 3px ${active ? '#3a6cf4' : '#d5d8e0'}`; s.box.style.color = active ? '#3a6cf4' : '#a3a6b3';
      set(s.ck, { s: lerp(.3, 1, SP(t, tTick[i], .6)), o: d });
      s.tt.style.color = t > tTick[i] ? '#15161c' : '#15161c';
    });
    prog.textContent = `${done} / 4 done`;
    pf.style.width = (710 * lerp(Math.max(0, done - 1), done, A(t, tTick[Math.max(0, done - 1)], .5, E.io)) / 4).toFixed(1) + 'px';
    set(art1, { o: A(t, T.skill - .1, .3), x: 14 * (1 - A(t, T.skill - .1, .4)) });
    set(art3, { o: A(t, T.script - .1, .3), x: 14 * (1 - A(t, T.script - .1, .4)) });
    const passed = t >= tPass + .15;
    art4.innerHTML = passed ? `<span style="width:20px;height:20px">${IC.check()}</span>Passed` : `<svg width="18" height="18" viewBox="0 0 24 24" style="transform:rotate(${(t * 360) % 360}deg)"><circle cx="12" cy="12" r="9" stroke="#3a6cf4" stroke-width="3" fill="none" stroke-dasharray="40 100" stroke-linecap="round"/></svg>Running…`;
    art4.style.background = passed ? '#e5f8ee' : '#e8eefe'; art4.style.color = passed ? '#119a5a' : '#3a6cf4';
    set(art4, { o: A(t, T.run, .3), s: passed ? lerp(.8, 1, SP(t, tPass + .15, .6)) : 1 });
    // pipeline
    const tk = cl(P(t, tRun0, tArrive));
    // dwell at each station: piecewise ease between stations
    const seg = Math.min(3, Math.floor(tk * 4)), local = E.io(cl(tk * 4 - seg)), kpos = tk >= 1 ? 4 : seg + local;
    trF.style.width = ((PX1 - PX0) * kpos / 4).toFixed(1) + 'px';
    pBots.forEach((o, i) => {
      const s = T.create + i * .12, k = SP(t, s, .8);
      set(o.b.el, { s: lerp(.4, 1, k), y: 20 * (1 - k), o: A(t, s, .15) }); set(o.slot, { o: 1 - A(t, s, .2) });
      set(o.nm, { o: lerp(.3, 1, A(t, s + .1, .3)) }); o.nm.style.color = t > s ? BOTS[BOT_ORDER[i]].c : '#c9ccd6';
      const here = t > tRun0 - .1 && Math.abs(kpos - i) < .35 && t < tPass + .3;
      o.b.update(t, { bob: here ? 5 : 2, lookY: here ? .6 : 0, lookX: here ? 0 : undefined });
      const reached = t >= stT(i) + (i === 0 ? 0 : 0);
      set(o.dot, { o: A(t, .8, .3) * (reached ? 0 : 1) });
      set(o.ck, { s: lerp(.3, 1, SP(t, stT(i) + .05, .5)), o: reached && t > tRun0 ? A(t, stT(i) + .05, .12) : 0 });
    });
    set(tok, { x: sx(kpos) - 52, y: -8 * Math.abs(Math.sin(Math.PI * (kpos % 1))), o: A(t, tRun0 - .2, .2) * (1 - A(t, tPass + .4, .3)) });
    set(stamp, { s: lerp(1.6, 1, SP(t, tPass, .6)), r: -6 * (1 - SP(t, tPass, .6)), o: A(t, tPass, .15) });
    // routines
    const unlocked = t >= tPass + .1, uk = A(t, tPass + .1, .3);
    lockB.innerHTML = unlocked ? `<span style="width:22px;height:22px">${IC.check()}</span>Unlocked · test passed` : `<span style="width:22px;height:22px">${IC.lock()}</span>Locked until the test passes`;
    lockB.style.background = unlocked ? '#e5f8ee' : '#f1f2f5'; lockB.style.color = unlocked ? '#119a5a' : '#6b6e7b';
    set(lockB, { o: A(t, .9, .3), s: 1 + .1 * Math.sin(Math.PI * P(t, tPass + .1, tPass + .45)) });
    rrows.forEach((o, i) => {
      set(o.r, { o: A(t, 1 + i * .1, .3) * lerp(.55, 1, uk), y: 10 * (1 - A(t, 1 + i * .1, .4)) });
      const on = A(t, tOn[i], .25, E.io);
      o.tg.style.background = `color-mix(in srgb,#1fbf75 ${Math.round(on * 100)}%,#d5d8e0)`; o.kn.style.left = (4 + 28 * on).toFixed(1) + 'px';
      o.r.style.background = on > .5 ? '#effaf4' : '#f6f7f9'; o.r.style.boxShadow = on > .5 ? 'inset 0 0 0 2px rgba(31,191,117,.3)' : 'none';
      o.st.textContent = on > .5 ? 'ON' : 'OFF'; o.st.style.color = on > .5 ? '#119a5a' : '#a3a6b3';
    });
    const tx = 838 + 36 - 18 - 32, ty = i => 418 + i * 78 + 33;
    cur.update(t, [[tOn[0] - .6, 700, 330], [tOn[0] - .05, tx, ty(0)], [tOn[1] - .05, tx, ty(1)], [tOn[2] - .05, tx, ty(2)], [tOn[2] + .5, tx + 30, ty(2) + 40]], tOn);
  };
};
