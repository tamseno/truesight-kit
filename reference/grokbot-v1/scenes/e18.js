// e18 — rendering is seek(t) + screenshot, never real time; frames land on disk as numbered PNGs; the folder is the progress bar; restart resumes at the first missing frame
SCENES.e18 = (root, ctx, H) => {
  const { put, h, set, enter, A, SP, E, P, lerp, cl, IC } = H;
  const D = (p, x, y, w, hh, css = '', html = '') => { const e = put(p, h('div', '', html), x, y, w, hh); if (css) e.style.cssText += ';' + css; return e; };
  const T = {
    never: ctx.at('never'), real: ctx.at('real time'), script: ctx.at('A script'), any: ctx.at('any moment'), seek: ctx.at('seek'), seekT: ctx.at('seek t') + .3,
    shot: ctx.at('screenshots'), moves: ctx.at('moves on'), frames: ctx.at('Frames land'), num: ctx.at('numbered'), folder: ctx.at('That folder'), bar: ctx.at('progress bar'),
    restart: ctx.at('restart'), picks: ctx.at('picks up'), first: ctx.at('first missing'),
  };
  // ball loop used by the little film
  const pos = tt => { const u = ((tt % 2.4) + 2.4) % 2.4 / 2.4; return E.io(u < .5 ? u * 2 : 2 - u * 2); };
  const JUMPS = [[T.any + .05, 2.10], [T.any + .45, 0.40], [T.seek, 1.60], [T.seekT, 0.95]];
  // capture counter: idx = 400 + n ; pauses at the restart, resumes at the first missing frame
  const RATE = 3.2, C0 = T.frames - .2, KILL = T.restart + .1, RES = T.first + .45, BASE = 400, TOTAL = 900, NG = 20;
  const nAt = t => {
    if (t < KILL) return Math.floor((t - C0) * RATE);
    const frozen = Math.floor((KILL - C0) * RATE);
    if (t < RES) return frozen;
    return Math.min(NG, frozen + Math.floor((t - RES) * RATE) + 1);
  };
  const NFROZ = Math.floor((KILL - C0) * RATE);

  // ---------------- preview window (headless page)
  const PW = put(root, H.win({ title: 'Headless Chrome · index.html', w: 700, h: 368, tag: 'headless' }), 88, 232);
  const stg = D(PW.body, 22, 18, 656, 196, 'border-radius:14px;background:#f1f0ec;overflow:hidden');
  const ball = D(stg, 0, 62, 72, 72, 'border-radius:50%;background:#15161c;box-shadow:0 14px 24px -10px rgba(0,0,0,.5)');
  const shadow = D(stg, 0, 170, 72, 10, 'border-radius:50%;background:rgba(21,22,28,.12)');
  const flash = D(stg, 0, 0, 656, 196, 'background:#fff');
  const live = D(stg, 16, 14, null, null, 'font:700 20px Geist;color:#15161c;background:#fff;border-radius:12px;padding:6px 14px;box-shadow:0 6px 14px -8px rgba(0,0,0,.3);white-space:nowrap', '<span style="font-size:14px">▶</span>&nbsp; Real-time playback');
  live.classList.add('strike');
  const liveX = D(stg, 278, 6, 30, 30, '', IC.x());
  const png = D(stg, 16, 14, null, null, 'font:800 16px Geist;color:#fff;background:#3a6cf4;border-radius:8px;padding:5px 11px;letter-spacing:.04em', 'PNG');
  const dead = D(stg, 0, 0, 656, 196, 'background:rgba(21,22,28,.82);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;color:#fff');
  const deadT = D(dead, 0, 0, null, null, 'position:relative;font:800 28px Geist;white-space:nowrap', '');
  const deadS = D(dead, 0, 0, null, null, 'position:relative;font:600 19px Maple;color:rgba(255,255,255,.65);white-space:nowrap', '');
  [deadT, deadS].forEach(e => { e.style.position = 'relative'; e.style.left = e.style.top = '0'; });
  const seekL = D(PW.body, 22, 234, null, null, 'font:600 21px Maple;color:#15161c;white-space:nowrap');
  const iL = D(PW.body, 0, 234, null, null, 'font:700 21px Maple;color:#3a6cf4;white-space:nowrap'); iL.style.left = 'auto'; iL.style.right = '22px';
  const trk = D(PW.body, 22, 276, 656, 20);
  D(trk, 0, 8, 656, 4, 'border-radius:2px;background:#e1e3ea');
  const tfill = D(trk, 0, 8, 0, 4, 'border-radius:2px;background:#15161c');
  const knob = D(trk, 0, 0, 20, 20, 'border-radius:50%;background:#15161c;box-shadow:0 0 0 4px #fff,0 2px 8px rgba(0,0,0,.3)');

  // ---------------- pure-function card
  const FC = put(root, H.card({ w: 1004, h: 368 }), 828, 232);
  D(FC, 40, 28, null, null, 'font:700 40px Maple;white-space:nowrap', '<span style="color:#3a6cf4">frame</span>(<span style="color:#f5a524">t</span>) <span style="color:#b4b7c3">→</span> pixels');
  const fsub = D(FC, 42, 98, null, null, 'font:600 22px Geist;color:#6b6e7b;white-space:nowrap', 'Same t, same frame. Any order.');
  const STEPS = ['seek(t)', 'screenshot', 'next t'];
  const steps = STEPS.map((s, i) => {
    const c = D(FC, 474 + i * 172, 34, 150, 42, 'border-radius:12px;background:#f3f4f8;color:#9a9db0;font:700 19px Maple;display:flex;align-items:center;justify-content:center;white-space:nowrap', s);
    const ar = i < 2 ? D(FC, 474 + i * 172 + 152, 44, 20, 20, '', '<svg width="20" height="20" viewBox="0 0 20 20"><path d="M4 10h11M11 5l5 5-5 5" stroke="#c3c6d1" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>') : null;
    return { c, ar };
  });
  const loopA = D(FC, 474, 82, 494, 26, '', '<svg width="494" height="26" viewBox="0 0 494 26"><path d="M419 2 V12 Q419 20 411 20 H83 Q75 20 75 12 V6" stroke="#3a6cf4" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-dasharray="4 6"/><path d="M69 10 L75 3 L81 10" stroke="#3a6cf4" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>');
  const slots = JUMPS.map(([, tv], i) => {
    const s = D(FC, 40 + i * 236, 150, 216, 186, 'border-radius:16px;background:#f6f7fa;box-shadow:inset 0 0 0 2px #e6e8ef');
    const th = D(s, 12, 12, 192, 110, 'border-radius:10px;background:#f1f0ec;overflow:hidden');
    D(th, 14 + pos(tv) * 128, 30, 44, 44, 'border-radius:50%;background:#15161c');
    const lb = D(s, 14, 136, null, null, 'font:700 22px Maple;color:#15161c;white-space:nowrap', `t = ${tv.toFixed(2)}s`);
    return { s, th, lb };
  });

  // ---------------- frames/ folder card
  const BC = put(root, H.card({ w: 1744, h: 276 }), 88, 632);
  const fh = D(BC, 28, 20, 900, 36, 'display:flex;align-items:center;gap:12px;white-space:nowrap');
  fh.appendChild(H.icon('folder', 32));
  fh.appendChild(h('span', '', 'frames/', { font: '800 24px Maple' }));
  fh.appendChild(h('span', '', '/workspace/film/frames', { font: '500 18px Maple', color: '#9a9db0' }));
  const earlier = D(BC, 0, 26, null, null, 'font:600 18px Geist;color:#9a9db0;white-space:nowrap', '··· 0000–0399 above');
  earlier.style.left = 'auto'; earlier.style.right = '576px';
  const GX = 28, GY = 70, TWd = 104, THt = 90, GAP = 10;
  const tiles = [...Array(NG)].map((_, i) => {
    const x = GX + (i % 10) * (TWd + GAP), y = GY + Math.floor(i / 10) * (THt + GAP);
    const slot = D(BC, x, y, TWd, THt, 'border-radius:12px;border:2px dashed #e1e3ea');
    const f = D(BC, x, y, TWd, THt, 'border-radius:12px;background:#f6f7fa;box-shadow:inset 0 0 0 1.5px #e6e8ef;overflow:hidden');
    const th = D(f, 6, 6, TWd - 12, 52, 'border-radius:8px;background:#f1f0ec;overflow:hidden');
    D(th, 6 + pos((BASE + i) / 60) * (TWd - 12 - 36), 12, 26, 26, 'border-radius:50%;background:#15161c');
    D(f, 0, 62, TWd, 24, 'font:700 16px Maple;color:#15161c;text-align:center', `${String(BASE + i).padStart(4, '0')}.png`);
    return { slot, f, x, y };
  });
  const idle = D(BC, GX, GY + 70, 1140, 40, 'font:600 22px Geist;color:#b4b7c3;text-align:center', 'waiting for the first frame…');
  // first-missing marker
  const mx = tiles[NFROZ] || tiles[NG - 1];
  const miss = D(BC, mx.x - 4, mx.y - 4, TWd + 8, THt + 8, 'border-radius:15px;box-shadow:0 0 0 3px #3a6cf4,0 0 24px rgba(58,108,244,.35)');
  const missTag = D(BC, mx.x, mx.y, TWd, THt, 'border-radius:12px;background:#eef3ff;color:#2b56d6;font:800 17px/1.2 Geist;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center', `first<br>missing<span style="font:700 14px Maple;margin-top:4px">${String(BASE + NFROZ).padStart(4, '0')}</span>`);
  // divider + progress panel
  D(BC, 1190, 24, 1, 228, 'background:rgba(21,22,28,.08)');
  const pl = D(BC, 1218, 22, null, null, 'font:700 16px Geist;color:#8a8d99;letter-spacing:.1em;white-space:nowrap', 'PROGRESS = FILES ON DISK');
  const cnt = D(BC, 1216, 50, 500, 76, 'font:800 64px/1.15 Geist;letter-spacing:-.03em;white-space:nowrap;font-variant-numeric:tabular-nums');
  const btr = D(BC, 1218, 140, 498, 18, 'border-radius:9px;background:#eef0f5;overflow:hidden');
  const bfl = D(btr, 0, 0, 0, 18, 'border-radius:9px;background:linear-gradient(90deg,#6f95ff,#3a6cf4);overflow:hidden');
  const bst = D(bfl, 0, 0, 560, 18, 'background:repeating-linear-gradient(110deg,rgba(255,255,255,0) 0 14px,rgba(255,255,255,.3) 14px 24px)');
  const cmd = D(BC, 1218, 172, null, null, 'font:500 17px Maple;color:#9a9db0;white-space:nowrap', '$ ls frames | wc -l');
  const st = D(BC, 1218, 206, 498, 44, 'border-radius:12px;display:flex;align-items:center;gap:10px;padding:0 16px;font:700 19px Geist;white-space:nowrap');

  ctx.cue(.1, 'swoosh', .45); ctx.cue(T.real + .2, 'error', .45);
  JUMPS.forEach(([s]) => ctx.cue(s, 'tick', .45)); ctx.cue(T.script - .2, 'swoosh', .35); ctx.cue(T.shot, 'click', .5);
  ctx.cue(T.frames - .3, 'whoosh', .45); ctx.cue(T.bar, 'tick', .45); ctx.cue(KILL, 'error', .5); ctx.cue(T.first, 'pop', .45); ctx.cue(RES, 'ding', .5);

  return (t) => {
    enter(PW, t, .05, { dy: 50, rx: 10 });
    // which t does the page show?
    let tv = t, mode = 'live', idx = 0;
    if (t >= JUMPS[0][0] - .02) { mode = 'jump'; for (const [s, v] of JUMPS) if (t >= s) tv = v; }
    if (t >= T.moves) { mode = 'cap'; idx = BASE + nAt(t); tv = idx / 60; }
    const p = pos(tv);
    ball.style.left = (20 + p * 564).toFixed(1) + 'px'; shadow.style.left = ball.style.left;
    const sq = mode === 'live' ? 1 + .1 * Math.abs(Math.cos(tv / 2.4 * Math.PI * 2)) : 1;
    set(ball, { sx: sq, sy: 1 / sq });
    let fl = 0;
    if (mode === 'jump') for (const [s] of JUMPS) if (t >= s && t < s + .25) fl = Math.max(fl, 1 - (t - s) / .25);
    if (t >= T.shot && t < T.shot + .35) fl = Math.max(fl, 1 - (t - T.shot) / .35);
    const running = mode === 'cap' && (t < KILL || t >= RES);
    if (running) { const q = (t - C0) * RATE; const ph = q - Math.floor(q); fl = Math.max(fl, Math.max(0, 1 - ph * 4) * .75); }
    set(flash, { o: fl * .72 });
    set(live, { o: A(t, .3, .3) * (1 - A(t, T.any - .15, .3)) }); H.strike(live, A(t, T.real, .45, E.io));
    set(liveX, { s: SP(t, T.real + .2, .6), o: A(t, T.real + .2, .1) * (1 - A(t, T.any - .15, .3)) });
    set(png, { o: A(t, T.shot, .25), s: 1 + .18 * fl });
    // crash overlay on the page
    const dk = A(t, KILL, .2) * (1 - A(t, RES + .25, .35));
    set(dead, { o: dk });
    deadT.textContent = t < T.first ? 'Render killed' : `Resuming at ${String(BASE + NFROZ).padStart(4, '0')}`;
    deadS.textContent = t < T.first ? 'process restarted' : `${BASE + NFROZ} frames already on disk`;
    deadT.style.color = t < T.first ? '#ff7a70' : '#7ea2ff';
    const tvd = mode === 'live' ? (tv % 2.4) : tv;
    seekL.innerHTML = `seek(<span style="color:#f5a524">${tvd.toFixed(2)}</span>)`;
    iL.textContent = mode === 'cap' ? `frame ${String(idx).padStart(4, '0')}` : (mode === 'jump' ? 'any t' : '');
    const kx = mode === 'cap' ? cl(idx / TOTAL) : cl(tvd / 2.4);
    knob.style.left = (kx * 636).toFixed(1) + 'px'; tfill.style.width = (kx * 646).toFixed(1) + 'px';

    // function card
    enter(FC, t, T.script - .25, { dx: 50, dy: 20, rx: 0 });
    set(fsub, { o: A(t, T.any, .4) });
    const act = [T.seek, T.shot, T.moves];
    steps.forEach(({ c, ar }, i) => {
      const on = t >= act[i];
      c.style.color = on ? '#fff' : '#9a9db0'; c.style.background = on ? (i === 1 ? '#15161c' : '#3a6cf4') : '#f3f4f8';
      set(c, { s: on ? lerp(.88, 1, SP(t, act[i], .6)) : 1, o: A(t, T.script + .1 + i * .08, .3) });
      if (ar) set(ar, { o: A(t, T.script + .2 + i * .08, .3) });
    });
    loopA.style.clipPath = `inset(0 0 0 ${(100 - A(t, T.moves, .6, E.io) * 100).toFixed(1)}%)`;
    set(loopA, { o: A(t, T.moves, .2) });
    slots.forEach(({ s, th, lb }, i) => {
      const s0 = JUMPS[i][0]; const k = SP(t, s0, .7);
      set(th, { o: A(t, s0, .12), s: lerp(.8, 1, k) }); set(lb, { o: A(t, s0, .2) });
      s.style.boxShadow = t >= s0 && t < s0 + .5 ? 'inset 0 0 0 3px #f5a524' : 'inset 0 0 0 2px #e6e8ef';
    });

    // frames folder
    enter(BC, t, T.script + .5, { dy: 50, rx: 10 });
    set(earlier, { o: A(t, T.num, .4) });
    const n = mode === 'cap' ? nAt(t) : 0;
    tiles.forEach((tl, i) => {
      set(tl.slot, { o: A(t, T.script + .7 + i * .02, .3) });
      // time this tile landed
      const landT = i < NFROZ ? C0 + (i + 1) / RATE : RES + (i - NFROZ) / RATE;
      const k = SP(t, landT, .55);
      set(tl.f, { y: -26 * (1 - k), s: lerp(.7, 1, k), o: i < n ? A(t, landT, .12) : 0 });
    });
    set(idle, { o: A(t, T.script + .9, .4) * (1 - A(t, C0, .3)) });
    const mk = A(t, T.first, .3) * (1 - A(t, RES + .6, .4));
    set(miss, { o: mk, s: 1 + .04 * Math.sin(t * 8) * mk });
    set(missTag, { o: mk * (t < RES ? 1 : 0), s: lerp(.85, 1, SP(t, T.first, .5)) });
    set(pl, { o: A(t, T.folder - .1, .4) });
    const done = BASE + Math.max(0, n);
    cnt.innerHTML = `${done}<span style="font:700 26px Geist;color:#9a9db0;margin-left:10px;letter-spacing:0">/ ${TOTAL} frames</span>`;
    set(cnt, { o: A(t, T.folder - .1, .4), s: 1 + .05 * Math.sin(Math.PI * P(t, T.bar, T.bar + .4)) });
    set(btr, { o: A(t, T.folder, .4) });
    bfl.style.width = (498 * done / TOTAL * A(t, T.folder, .6, E.io)).toFixed(1) + 'px';
    const paused = t >= KILL && t < RES;
    bfl.style.background = paused ? 'linear-gradient(90deg,#f7b955,#f5a524)' : 'linear-gradient(90deg,#6f95ff,#3a6cf4)';
    bst.style.transform = `translateX(${(paused ? 0 : -(t * 40) % 24).toFixed(1)}px)`;
    set(cmd, { o: A(t, T.bar, .4) });
    let sc, sh, sb;
    if (t < KILL) { sc = '#3a6cf4'; sb = '#eef3ff'; sh = `<span style="width:10px;height:10px;border-radius:50%;background:#3a6cf4;opacity:${(.5 + .5 * Math.sin(t * 6)).toFixed(2)}"></span>Rendering · ${RATE.toFixed(1)} frames/s`; }
    else if (t < T.first) { sc = '#d1352b'; sb = '#fdecea'; sh = `<span style="width:22px;height:22px">${IC.x()}</span>Restart · process died at ${done}`; }
    else if (t < RES) { sc = '#2b56d6'; sb = '#eef3ff'; sh = `<span style="font:800 20px Maple">→</span>First missing: ${String(BASE + NFROZ).padStart(4, '0')}.png`; }
    else { sc = '#13995c'; sb = '#e7f8ef'; sh = `<span style="width:22px;height:22px">${IC.check()}</span>Resumed · nothing re-rendered`; }
    st.innerHTML = sh; st.style.color = sc; st.style.background = sb;
    set(st, { o: A(t, T.folder + .3, .4), s: t >= KILL ? lerp(.92, 1, SP(t, [KILL, T.first, RES].filter(v => t >= v).pop(), .5)) : 1 });
  };
};
