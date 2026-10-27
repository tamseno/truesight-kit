// e26 — failure modes: four "what breaks -> the fix" cards (usage, sleep mid-render, paused routines, rebuild)
SCENES.e26 = (root, ctx, H) => {
  const { put, h, set, enter, A, SP, E, P, lerp, cl, IC } = H;
  const D = (p, x, y, w, hh, css = '', html = '') => { const e = put(p, h('div', '', html), x, y, w, hh); if (css) e.style.cssText += ';' + css; return e; };
  const T = { plan: ctx.at('Plan'), breaks: ctx.at('breaks'), use: ctx.at('Usage'), out: ctx.at('runsout'), keep: ctx.at('keep'), cap: ctx.at('cap'), sleeps: ctx.at('sleeps'), resume: ctx.at('resume'), frames: ctx.at('frames'), paused: ctx.at('paused'), away: ctx.at('away'), check: ctx.at('checkin'), copy: ctx.at('copy'), film: ctx.at('film'), rebuild: ctx.at('rebuild'), never: ctx.at('never'), deliv: ctx.at('delivery') };
  const tIssue = [T.out, T.sleeps, T.paused + .05, T.rebuild], tFix = [T.keep, T.resume, T.check, T.copy];
  const CW = 412, CH = 664, CY = 232, GX = 436;
  const ICONS = [
    '<svg width="26" height="26" viewBox="0 0 24 24"><path d="M13 2L4 14h7l-1 8 9-12h-7z" fill="#fff"/></svg>',
    '<svg width="26" height="26" viewBox="0 0 40 40"><path d="M27 6a15 15 0 1 0 8 22A12 12 0 0 1 27 6z" fill="#fff"/></svg>',
    '<svg width="24" height="24" viewBox="0 0 24 24"><rect x="6" y="5" width="4" height="14" rx="1.5" fill="#fff"/><rect x="14" y="5" width="4" height="14" rx="1.5" fill="#fff"/></svg>',
    '<svg width="26" height="26" viewBox="0 0 24 24"><path d="M4 12a8 8 0 0113.7-5.6M20 4v4.5h-4.5M20 12a8 8 0 01-13.7 5.6M4 20v-4.5h4.5" stroke="#fff" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>'];
  const TITLES = ['Usage runs out', 'Sleep mid-render', 'Routines paused', 'Rebuild or restore'];
  const FIX = ['Keep checks cheap,<br>cap review rounds', 'Resume from the<br>frames on disk', 'Check in<br>once a day', 'Copy every film<br>out of the computer'];
  const toggle = (p, x, y) => { const tg = D(p, x, y, 58, 32, 'border-radius:16px;background:#d5d8e0'); const kn = D(tg, 3, 3, 26, 26, 'border-radius:50%;background:#fff;box-shadow:0 2px 6px rgba(0,0,0,.2)'); return { set(on) { tg.style.background = `color-mix(in srgb,#1fbf75 ${Math.round(on * 100)}%,#d5d8e0)`; kn.style.left = (3 + 26 * on).toFixed(1) + 'px'; } }; };
  const cards = TITLES.map((ti, i) => {
    const x = 100 + i * GX, c = put(root, H.card({ w: CW, h: CH }), x, CY);
    const ring = D(c, 0, 0, CW, CH, 'border-radius:22px;pointer-events:none;z-index:2');
    const icT = D(c, 24, 26, 54, 54, 'border-radius:16px;display:flex;align-items:center;justify-content:center', ICONS[i]);
    const tt = D(c, 94, 24, 300, 32, 'font:800 26px Geist;letter-spacing:-.01em;white-space:nowrap', ti);
    const st = D(c, 94, 60, 110, 26, 'border-radius:999px;font:800 14px Geist;letter-spacing:.08em;display:flex;align-items:center;justify-content:center;white-space:nowrap');
    const vis = D(c, 24, 106, CW - 48, 300, `border-radius:16px;background:${i === 1 ? '#16171f' : '#f6f7f9'};overflow:hidden`);
    const fixBox = D(c, 24, 428, CW - 48, 210, 'border-radius:16px;border:2.5px dashed #e3e4ea');
    D(fixBox, 20, 18, 300, 30, 'font:700 18px Geist;color:#c9ccd6;letter-spacing:.08em', 'THE FIX');
    const fixOn = D(c, 24, 428, CW - 48, 210, 'border-radius:16px;background:#effaf4;box-shadow:inset 0 0 0 2px #1fbf7544');
    D(fixOn, 20, 18, 300, 30, 'font:800 18px Geist;color:#119a5a;letter-spacing:.08em;display:flex;align-items:center;gap:8px', `<span style="width:24px;height:24px">${IC.check()}</span>THE FIX`);
    const ft = D(fixOn, 20, 60, CW - 88, 84, 'font:800 27px/1.32 Geist;color:#15161c;letter-spacing:-.01em', FIX[i]);
    const fx = D(fixOn, 20, 152, CW - 88, 40, 'display:flex;gap:8px;align-items:center');
    return { c, ring, icT, tt, st, vis, fixBox, fixOn, ft, fx };
  });
  const fchip = (p, txt, col = '#119a5a', bg = '#fff') => { const e = p.appendChild(h('span', '', txt)); e.style.cssText = `height:34px;padding:0 13px;border-radius:999px;background:${bg};color:${col};font:800 16px Geist;display:flex;align-items:center;white-space:nowrap;box-shadow:0 0 0 1.5px ${col}33`; return e; };
  const fx1 = [fchip(cards[0].fx, 'Cheap checks'), fchip(cards[0].fx, 'Max 3 rounds')];
  const fx2 = [fchip(cards[1].fx, 'frames/ = progress')];
  const fx3 = [fchip(cards[2].fx, 'Daily reply keeps them on')];
  const fx4 = [fchip(cards[3].fx, 'Off-box backup')];
  const VW = CW - 48;
  // ---------- card 1: usage meter
  const v1 = cards[0].vis;
  D(v1, 22, 22, 200, 30, 'font:800 21px Geist', 'Usage this week');
  const pct = D(v1, 200, 12, 142, 50, 'font:800 40px Geist;text-align:right;font-variant-numeric:tabular-nums');
  const mtr = D(v1, 22, 70, VW - 44, 20, 'border-radius:10px;background:#e6e8ee;overflow:hidden');
  const mf = D(mtr, 0, 0, 0, 20, 'border-radius:10px');
  // run log: many expensive checks
  const logs = [...Array(5)].map((_, j) => { const r = D(v1, 22, 112 + j * 34, VW - 44, 28, 'display:flex;align-items:center;gap:10px;font:600 16px Maple;color:#6b6e7b;white-space:nowrap'); r.innerHTML = `<i style="width:10px;height:10px;border-radius:50%;background:#f5a524;flex:none"></i>${['review round 4', 'review round 5', 'hourly check', 'review round 6', 'hourly check'][j]}<span style="margin-left:auto;color:#c27a00">−run</span>`; return r; });
  const stopP = D(v1, 22, 112, VW - 44, 166, 'border-radius:14px;background:rgba(246,247,249,.92);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px');
  const g1 = H.grok(48); g1.style.position = 'relative'; stopP.appendChild(g1);
  stopP.appendChild(h('span', '', '<span style="height:38px;padding:0 16px;border-radius:999px;background:#f0443a;color:#fff;font:800 19px Geist;display:inline-flex;align-items:center">Out of usage · studio stalls</span>'));
  // ---------- card 2: terminal, sleep, resume
  const v2 = cards[1].vis;
  D(v2, 0, 0, VW, 36, 'background:#20212b;display:flex;align-items:center;gap:7px;padding:0 14px', '<i style="width:11px;height:11px;border-radius:50%;background:#ff5f57"></i><i style="width:11px;height:11px;border-radius:50%;background:#febc2e"></i><i style="width:11px;height:11px;border-radius:50%;background:#28c840"></i><span style="margin-left:10px;font:600 14px Maple;color:#8a90a8">render · terminal</span>');
  const tl = (y, html) => { const e = D(v2, 18, y, VW - 36, 28, 'font:500 17px/1.6 Maple;color:#d8dbe7;white-space:nowrap', html); return e; };
  tl(50, '<span style="color:#7ee0b8">$</span> node render.mjs');
  const ptr = D(v2, 18, 96, 210, 12, 'border-radius:6px;background:#2a2c38;overflow:hidden'); const pf = D(ptr, 0, 0, 0, 12, 'border-radius:6px;background:#5ee39b');
  const pv = D(v2, 236, 86, 110, 28, 'font:700 17px Maple;color:#d8dbe7;text-align:right;font-variant-numeric:tabular-nums');
  const err = tl(126, '<span style="color:#ff7a70">✕ computer slept · killed</span>');
  const r1 = tl(170, '<span style="color:#7ee0b8">$</span> node render.mjs --resume');
  const r2 = tl(202, '<span style="color:#5ee39b">↻ first missing frame: 0413</span>');
  const r3 = tl(234, '<span style="color:#6f7590">skipping 0001–0412 on disk</span>');
  const sleepO = D(v2, 0, 36, VW, 264, 'background:rgba(14,16,40,.78);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px');
  sleepO.innerHTML = `<span style="width:58px;height:58px">${IC.moon()}</span><span style="font:800 22px Geist;color:#fff">Computer asleep</span><span style="font:600 16px Maple;color:#9aa0b4">frame 0412 / 0900</span>`;
  // ---------- card 3: routine + check-in
  const v3 = cards[2].vis;
  const rrow = D(v3, 16, 16, VW - 32, 56, 'border-radius:14px;background:#fff;box-shadow:0 0 0 1px rgba(21,22,28,.06);display:flex;align-items:center;gap:10px;padding:0 14px;font:800 19px Geist;white-space:nowrap', '<span style="width:28px;height:28px;border-radius:9px;background:#33c9a6;display:inline-flex;align-items:center;justify-content:center"><svg width="16" height="16" viewBox="0 0 24 24"><path d="M20 12a8 8 0 11-2.3-5.6M20 4v4.5h-4.5" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/></svg></span>Nightly 21:00');
  const rt = toggle(rrow, VW - 32 - 74, 12);
  const away = D(v3, 16, 86, VW - 32, 30, 'display:flex;align-items:center;gap:8px;font:700 16px Geist;color:#8a8d99;white-space:nowrap');
  const awayN = away.appendChild(h('span', '', '')); awayN.style.cssText = 'font-variant-numeric:tabular-nums';
  const g3 = H.grok(40); put(v3, g3, 16, 128);
  const bub = D(v3, 64, 124, 270, 64, 'border-radius:16px 16px 16px 4px;background:#fff;box-shadow:0 0 0 1px rgba(21,22,28,.06);font:700 18px/1.35 Geist;padding:9px 14px', 'Been a while. Keep these routines running?');
  const paused = D(v3, 64, 200, 120, 32, 'border-radius:999px;background:#fff1d6;color:#c27a00;font:800 16px Geist;display:flex;align-items:center;justify-content:center', 'Paused');
  const reply = D(v3, 186, 238, 150, 46, 'border-radius:16px 16px 4px 16px;background:#3a6cf4;color:#fff;font:800 19px Geist;display:flex;align-items:center;justify-content:center', 'Yes, keep going');
  const days = D(v3, 16, 248, 160, 40, 'display:flex;gap:6px;align-items:center');
  const dPips = [...Array(5)].map(() => { const e = days.appendChild(h('i', '', '')); e.style.cssText = 'width:22px;height:22px;border-radius:6px;background:#e3e5eb;display:block'; return e; });
  // ---------- card 4: copy films out, then rebuild
  const v4 = cards[3].vis;
  const box = (x, label, dark) => { const b = D(v4, x, 16, 150, 268, `border-radius:14px;background:${dark ? '#1d2552' : '#fff'};box-shadow:0 0 0 1px rgba(21,22,28,.07)`); D(b, 0, 12, 150, 22, `font:800 16px Geist;text-align:center;color:${dark ? '#fff' : '#15161c'}`, label); return b; };
  const bA = box(10, 'Cloud computer', true), bB = box(VW - 160, 'Your drive', false);
  D(bB, 51, 38, 48, 32, '', IC.folder());
  const film = (p, j, y) => { const f = D(p, 9, y, 132, 50, 'border-radius:10px;background:#f4f5f9;box-shadow:0 0 0 1px rgba(21,22,28,.06);display:flex;align-items:center;gap:8px;padding:0 8px'); f.innerHTML = `<span style="width:34px;height:34px;border-radius:8px;background:${['#dff6ee', '#ffe9c7', '#e3e4ff'][j]};display:flex;align-items:center;justify-content:center"><i style="width:14px;height:10px;border-radius:5px;background:#15161c;display:block"></i></span><span style="font:700 15px Maple;color:#15161c">film_0${j + 1}</span>`; return f; };
  const fA = [0, 1, 2].map(j => film(bA, j, 48 + j * 62)), fB = [0, 1, 2].map(j => film(bB, j, 78 + j * 62));
  const ckB = fB.map(f => { const c = D(f, 110, -8, 26, 26, '', IC.check()); return c; });
  const wipe = D(bA, 9, 44, 132, 210, 'border-radius:10px;box-shadow:inset 0 0 0 2px #f0443a;background:rgba(240,68,58,.12);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;font:800 17px Geist;color:#ff8f86;text-align:center', '<span style="font:800 30px Geist">∅</span>Rebuilt<br>empty');
  const arrow = D(v4, VW / 2 - 18, 128, 36, 36, 'border-radius:50%;background:#15161c;display:flex;align-items:center;justify-content:center', '<svg width="20" height="20" viewBox="0 0 24 24"><path d="M5 12h13m-5-5l5 5-5 5" stroke="#fff" stroke-width="2.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>');
  const flyers = [0, 1, 2].map(j => film(v4, j, 0));

  ctx.cue(.2, 'swoosh', .5); [0, 1, 2, 3].forEach(i => ctx.cue(T.breaks + i * .08, 'tick', .3));
  tIssue.forEach((s, i) => ctx.cue(s + .25, 'error', i === 3 ? .35 : .45)); tFix.forEach((s, i) => ctx.cue(s, 'ding', .45));
  ctx.cue(T.copy + .2, 'whoosh', .4); ctx.cue(T.deliv, 'ding', .5);

  return (t) => {
    cards.forEach((c, i) => {
      enter(c.c, t, .2 + i * .09, { dy: 60, rx: 12 });
      const iss = A(t, tIssue[i], .3), fx = A(t, tFix[i], .35);
      const fixed = i === 3 ? fx : fx * (t > tFix[i] ? 1 : 0);
      const broken = i === 3 ? iss * (1 - fx) : iss * (1 - fx);
      const col = fixed > .5 ? '#1fbf75' : broken > .5 ? '#f0443a' : t > T.breaks ? '#f5a524' : '#c9ccd6';
      c.icT.style.background = col;
      const pulseIss = Math.sin(Math.PI * P(t, tIssue[i], tIssue[i] + .35)), pulseFix = Math.sin(Math.PI * P(t, tFix[i], tFix[i] + .35)), pulseDel = i === 3 ? Math.sin(Math.PI * P(t, T.deliv, T.deliv + .4)) : 0;
      c.ring.style.boxShadow = `inset 0 0 0 3px ${fixed > .5 ? '#1fbf75' : '#f0443a'}`;
      set(c.ring, { o: Math.max(broken, fixed * (.55 + .45 * Math.max(pulseFix, pulseDel))) });
      set(c.icT, { s: 1 + .18 * pulseIss + .18 * pulseFix });
      let lab = ['RISK', '#fff1d6', '#c27a00'];
      if (broken > .5) lab = ['BROKEN', '#fde7e5', '#f0443a'];
      if (fixed > .5) lab = i === 3 ? (t > T.deliv ? ['DELIVERED', '#e5f8ee', '#119a5a'] : ['BACKED UP', '#e5f8ee', '#119a5a']) : ['FIXED', '#e5f8ee', '#119a5a'];
      c.st.textContent = lab[0]; c.st.style.background = lab[1]; c.st.style.color = lab[2]; c.st.style.width = lab[0].length > 7 ? '124px' : '96px';
      set(c.st, { o: A(t, T.breaks + i * .08, .25), s: lerp(.6, 1, SP(t, T.breaks + i * .08, .6)) * (1 + .12 * pulseIss + .12 * pulseFix) });
      const lit = i === 3 ? A(t, T.copy - .4, .4) : A(t, tIssue[i] - .4, .4);
      set(c.vis, { o: lerp(.5, 1, Math.max(lit, A(t, .6, .5) * .2)) });
      c.tt.style.color = lit > 0 ? '#15161c' : '#9a9daa';
      set(c.fixBox, { o: 1 - fx }); enter(c.fixOn, t, tFix[i], { dy: 20, rx: 0, d: .8 });
      set(c.ft, { o: A(t, tFix[i] + .1, .35), x: 12 * (1 - A(t, tFix[i] + .1, .45)) });
    });
    // card 1
    const drain = A(t, T.use, T.out + .5 - T.use, E.io), u = lerp(lerp(38, 0, drain), 54, A(t, T.cap + .4, 1.2, E.io));
    pct.textContent = Math.round(u) + '%'; pct.style.color = u < 10 ? '#f0443a' : '#15161c';
    mf.style.width = ((VW - 44) * u / 100).toFixed(1) + 'px'; mf.style.background = u < 10 ? '#f0443a' : u < 25 ? '#f5a524' : '#1fbf75';
    logs.forEach((r, j) => set(r, { o: A(t, T.use - .3 + j * .12, .2), x: 10 * (1 - A(t, T.use - .3 + j * .12, .3)) }));
    set(stopP, { o: A(t, T.out + .35, .3) * (1 - A(t, T.keep + .3, .3)) });
    set(g1, { r: Math.sin(t * 3) * 3 });
    // fix: log rows thin out (expensive rows removed)
    logs.forEach((r, j) => { const cut = [0, 1, 3].includes(j) ? A(t, T.cap + j * .06, .3) : 0; r.style.textDecoration = cut > .5 ? 'line-through' : 'none'; if (cut > 0) set(r, { o: 1 - .65 * cut }); });
    fx1.forEach((e, j) => set(e, { o: A(t, [T.keep + .3, T.cap][j], .25), s: lerp(.7, 1, SP(t, [T.keep + .3, T.cap][j], .6)) }));
    // card 2
    const tS = T.sleeps + .1, tR = T.resume + .25;
    const pr = t < tS ? lerp(180, 412, P(t, .6, tS)) : t < tR ? 412 : lerp(412, 560, P(t, tR, ctx.dur));
    pf.style.width = (210 * pr / 900).toFixed(1) + 'px'; pv.textContent = String(Math.floor(pr)).padStart(4, '0') + '/900';
    const frozen = t > tS && t < tR; pf.style.background = frozen ? '#ff7a70' : '#5ee39b';
    set(sleepO, { o: A(t, tS, .3) * (1 - A(t, T.resume - .15, .3)) });
    set(err, { o: A(t, T.resume - .15, .2) });
    set(r1, { o: A(t, T.resume, .2), x: 8 * (1 - A(t, T.resume, .3)) }); set(r2, { o: A(t, T.frames - .1, .2), x: 8 * (1 - A(t, T.frames - .1, .3)) }); set(r3, { o: A(t, T.frames + .4, .2) });
    fx2.forEach(e => set(e, { o: A(t, T.frames + .2, .25), s: lerp(.7, 1, SP(t, T.frames + .2, .6)) }));
    // card 3
    const offK = A(t, T.paused + .3, .3, E.io), onK = A(t, T.check + .6, .3, E.io);
    rt.set(cl(1 - offK + onK));
    const dd = Math.round(lerp(1, 14, A(t, T.paused - .5, 1.6, E.io)));
    awayN.innerHTML = `No reply for <b style="color:#15161c">${dd} days</b>`;
    set(away, { o: A(t, T.paused - .6, .3) });
    set(g3, { o: A(t, T.paused - .55, .25) }); set(bub, { o: A(t, T.paused - .5, .25), y: 10 * (1 - SP(t, T.paused - .5, .6)) });
    set(paused, { s: lerp(.6, 1, SP(t, T.paused + .3, .6)), o: A(t, T.paused + .3, .2) * (1 - A(t, T.check + .6, .3)) });
    set(reply, { o: A(t, T.check + .1, .2), y: 12 * (1 - SP(t, T.check + .1, .6)), s: lerp(.85, 1, SP(t, T.check + .1, .6)) });
    set(days, { o: A(t, T.check + .1, .3) });
    dPips.forEach((e, j) => { const s = T.check + .3 + j * .12; e.style.background = t > s ? '#1fbf75' : '#e3e5eb'; set(e, { s: 1 + .25 * Math.sin(Math.PI * P(t, s, s + .25)) }); });
    awayN.style.opacity = 1; if (t > T.check + .1) awayN.innerHTML = '<b style="color:#119a5a">Daily check-in · routines stay on</b>';
    fx3.forEach(e => set(e, { o: A(t, T.check + .8, .25), s: lerp(.7, 1, SP(t, T.check + .8, .6)) }));
    // card 4
    const wk = A(t, T.rebuild + .1, .35);
    fA.forEach((f, j) => set(f, { o: 1 - wk, s: 1 - .2 * wk }));
    set(wipe, { o: wk, s: lerp(.9, 1, wk) });
    bA.style.boxShadow = `0 0 0 ${(3 * Math.sin(Math.PI * P(t, T.rebuild, T.rebuild + .6))).toFixed(1)}px #f0443a`;
    flyers.forEach((f, j) => {
      const s = T.copy + .1 + j * .3, k = A(t, s, .7, E.io);
      const x0 = 10 + 9, y0 = 16 + 48 + j * 62, x1 = VW - 160 + 9, y1 = 16 + 78 + j * 62;
      set(f, { x: lerp(x0, x1, k) - 9, y: lerp(y0, y1, k) - 60 * Math.sin(Math.PI * k), r: 6 * Math.sin(Math.PI * k), o: k > 0 && k < 1 ? 1 : 0 });
      set(fB[j], { o: A(t, s + .65, .1) });
      set(ckB[j], { s: lerp(.3, 1, SP(t, T.deliv + j * .1, .6)), o: A(t, T.deliv + j * .1, .15) });
    });
    set(arrow, { o: A(t, T.copy - .2, .3), s: 1 + .15 * Math.sin(Math.PI * P(t, T.copy, T.copy + .4)) });
    fx4.forEach(e => set(e, { o: A(t, T.never, .25), s: lerp(.7, 1, SP(t, T.never, .6)) }));
  };
};
