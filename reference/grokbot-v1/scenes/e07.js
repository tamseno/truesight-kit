// e07 — one persistent cloud computer shared by every bot: same files / logins / terminal, a screen per bot, laptop closed → work continues
SCENES.e07 = (root, ctx, H) => {
  const { put, h, set, enter, A, SP, E, P, lerp, cl, COL, win, bot, BOTS, BOT_ORDER, IC } = H;
  const T = {
    every: ctx.at('Every'), acc: ctx.at('account'), shares: ctx.at('shares'), pers: ctx.at('persistent'), cloud: ctx.at('cloud'),
    files: ctx.at('the same files'), log: ctx.at('browser'), term: ctx.at('terminal'), each: ctx.at('Each'), screen: ctx.at('screen'),
    par: ctx.at('parallel'), close: ctx.at('closing'), lap: ctx.at('laptop'), stop: ctx.at("doesn't"),
  };
  const badge = (c0) => {
    const el = h('div', '', `<svg viewBox="0 0 24 24" width="100%" height="100%" style="overflow:visible"><circle cx="12" cy="12" r="12" fill="${c0 || COL.green}"/><path d="M7 12.5l3.2 3.2L17 9" stroke="#fff" stroke-width="2.8" fill="none" stroke-linecap="round" stroke-linejoin="round" pathLength="1" stroke-dasharray="1 1" stroke-dashoffset="1"/></svg>`);
    const p = el.querySelector('path');
    return { el, upd(t, s) { const k = SP(t, s, .7); set(el, { s: lerp(.2, 1, k), o: A(t, s, .12) }); p.setAttribute('stroke-dashoffset', (1 - A(t, s + .08, .25, E.io)).toFixed(3)); } };
  };
  // ================= left: account group with five bots
  const grp = put(root, h('div', ''), 100, 236, 410, 672); grp.style.cssText += 'border-radius:26px;border:2.5px dashed rgba(90,92,240,.35);background:rgba(255,255,255,.38)';
  const gl = put(root, h('div', '', 'Your account · 5 bots'), 130, 220); gl.style.cssText += 'padding:5px 16px;border-radius:999px;background:#5a5cf0;color:#fff;font:700 20px Geist;white-space:nowrap;box-shadow:0 8px 18px -8px rgba(90,92,240,.8)';
  const ROLE = { director: 'plans the film', animator: 'writes the code', render: 'captures frames', critic: 'grades the cut', delivery: 'ships the file' };
  const PY = 568;
  const rows = BOT_ORDER.map((k, i) => {
    const y = 268 + i * 124;
    const r = put(root, h('div', ''), 128, y, 354, 104);
    r.style.cssText += 'border-radius:20px;background:#fff;box-shadow:0 0 0 1px rgba(21,22,28,.05),0 12px 26px -14px rgba(30,34,70,.25)';
    const b = bot(k, 72); put(r, b.el, 18, 15);
    put(r, h('div', '', `<div style="font:800 29px Geist;letter-spacing:-.01em">${BOTS[k].name}</div><div style="font:600 20px Geist;color:${COL.sub};margin-top:1px">${ROLE[k]}</div>`), 108, 18);
    const dot = put(r, h('div', ''), 328, 46, 12, 12); dot.style.cssText += `border-radius:50%;background:${BOTS[k].c}`;
    return { r, b, k, y: y + 52, i, dot };
  });
  // curves into one port
  const cv = put(root, h('div', ''), 482, 236, 360, 672);
  const PX0 = 482, PY0 = 236;
  cv.innerHTML = `<svg viewBox="0 0 360 672" width="360" height="672" fill="none" style="overflow:visible">${rows.map(r => `<path class="c" d="M0 ${r.y - PY0} C 180 ${r.y - PY0}, 170 ${PY - PY0}, 352 ${PY - PY0}" stroke="${BOTS[r.k].c}" stroke-width="4" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1"/>`).join('')}${rows.map(r => `<circle class="pk" r="7" fill="${BOTS[r.k].c}"/>`).join('')}</svg>`;
  const paths = [...cv.querySelectorAll('.c')], pks = [...cv.querySelectorAll('.pk')];
  const plen = paths.map(p => p.getTotalLength());
  const port = put(root, h('div', ''), 834 - 13, PY - 13, 26, 26); port.style.cssText += 'border-radius:50%;background:#fff;border:5px solid #5a5cf0;z-index:3';

  // ================= right: the cloud computer
  const WX = 842, WY = 228, WW = 990, WH = 680;
  const cw = put(root, win({ title: '<span style="color:#5a5cf0">☁</span>&nbsp; Cloud Computer', tag: ' ' }), WX, WY, WW, WH);
  cw.querySelector('.wt').style.cssText += ';font:700 20px Geist';
  const tag = cw.querySelector('.wtag'); tag.style.cssText = 'margin-left:auto;display:inline-flex;align-items:center;gap:8px;height:32px;padding:0 14px;border-radius:999px;background:rgba(90,92,240,.1);color:#5a5cf0;font:700 17px Geist;white-space:nowrap';
  const B = cw.body; B.style.cssText += 'position:absolute;left:0;top:46px;right:0;bottom:0;padding:0';
  // ---- three shared resources
  const TW = 302, TX = i => 24 + i * (TW + 18), TH0 = 384, TH1 = 124;
  const mkTile = (i, o) => {
    const e = put(B, h('div', ''), TX(i), 22, TW, TH0);
    e.style.cssText += `border-radius:18px;overflow:hidden;background:${o.dark ? '#16171f' : '#f6f7fa'};box-shadow:inset 0 0 0 1px ${o.dark ? 'rgba(255,255,255,.06)' : 'rgba(21,22,28,.07)'}`;
    const ic = put(e, h('div', '', o.icon), 20, 20, 52, 52); ic.style.cssText += `border-radius:15px;background:${o.c};display:flex;align-items:center;justify-content:center;box-shadow:0 8px 16px -8px ${o.c}`;
    put(e, h('div', '', `<div style="font:800 26px Geist;letter-spacing:-.01em;color:${o.dark ? '#fff' : COL.ink}">${o.title}</div><div class="mono" style="font:500 18px Maple;color:${o.dark ? '#8d93ab' : COL.sub};margin-top:2px">${o.sub}</div>`), 86, 18);
    const av = put(e, h('div', ''), 20, 86); av.style.cssText += 'display:flex;align-items:center';
    const avs = BOT_ORDER.map((k, j) => { const d = av.appendChild(h('i', '')); d.style.cssText = `display:block;width:20px;height:20px;border-radius:50%;background:${BOTS[k].c};margin-left:${j ? -5 : 0}px;box-shadow:0 0 0 3px ${o.dark ? '#16171f' : '#f6f7fa'}`; return d; });
    const avl = av.appendChild(h('span', '', 'all 5 bots')); avl.style.cssText = `margin-left:12px;font:600 18px Geist;color:${o.dark ? '#8d93ab' : COL.sub}`;
    const bd = badge(); put(e, bd.el, TW - 50, 82, 30, 30);
    const det = put(e, h('div', ''), 20, 134, TW - 40, 230);
    const ring = put(e, h('div', ''), 0, 0, TW, TH0); ring.style.cssText += `border-radius:18px;box-shadow:inset 0 0 0 2.5px ${o.c}`;
    return { e, ic, avs, avl, bd, det, ring, at: o.at, c: o.c, i };
  };
  const tiles = [
    mkTile(0, { title: 'Same files', sub: '/workspace', c: COL.amber, at: T.files, icon: `<span style="width:30px;height:30px;display:block">${IC.folder('#fff')}</span>` }),
    mkTile(1, { title: 'Same logins', sub: 'browser sessions', c: COL.blue, at: T.log, icon: `<svg width="28" height="28" viewBox="0 0 24 24"><rect x="5" y="10.5" width="14" height="10" rx="2.5" fill="#fff"/><path d="M8.2 10.5V8a3.8 3.8 0 017.6 0v2.5" stroke="#fff" stroke-width="2.2" fill="none"/></svg>` }),
    mkTile(2, { title: 'Same terminal', sub: 'bash · Linux', c: '#2fc7a4', at: T.term, dark: true, icon: `<svg width="30" height="30" viewBox="0 0 24 24"><path d="M5 7l5 5-5 5" stroke="#fff" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 18h7" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/></svg>` }),
  ];
  // details: files
  const FL = [['folder', 'studio/', '#f5c451'], ['file', 'spec.md', '#dfe3ee'], ['folder', 'frames/', '#7cc4ff'], ['file', 'film_017.mp4', '#ffd2c4']];
  const fRows = FL.map(([ic, nm, c], j) => { const e = put(tiles[0].det, h('div', '', `<span style="width:24px;height:24px;display:block">${IC[ic](c)}</span><span class="mono" style="font:500 20px Maple">${nm}</span>`), 0, j * 52, TW - 40, 44); e.style.cssText += 'display:flex;align-items:center;gap:12px;padding:0 12px;border-radius:10px;background:#fff;box-shadow:0 0 0 1px rgba(21,22,28,.05)'; return e; });
  // details: logins
  const SITES = ['x.com', 'github.com', 'gmail.com', 'notion.so'];
  const sRows = SITES.map((nm, j) => { const e = put(tiles[1].det, h('div', '', `<span class="mono" style="font:500 20px Maple;flex:1">${nm}</span><span style="display:inline-flex;align-items:center;gap:6px;font:700 16px Geist;color:${COL.green}"><i style="width:8px;height:8px;border-radius:50%;background:${COL.green};display:block"></i>signed in</span>`), 0, j * 52, TW - 40, 44); e.style.cssText += 'display:flex;align-items:center;gap:10px;padding:0 14px;border-radius:10px;background:#fff;box-shadow:0 0 0 1px rgba(21,22,28,.05)'; return e; });
  // details: terminal
  const TL = [['$ ', 'ls /workspace', 'p'], ['', 'studio  frames  out', 'd'], ['$ ', 'ffmpeg -version', 'p'], ['', 'ffmpeg 7.1  ✓', 'g']];
  const tRows = TL.map((l, j) => { const e = put(tiles[2].det, h('div', 'term', ''), 2, j * 46); e.style.cssText += 'font-size:20px;line-height:1.5'; return e; });
  // ---- per-bot screens
  const SW = 177, SG = (942 - 5 * SW) / 4, SY = 166, SH = 228;
  const screens = BOT_ORDER.map((k, i) => {
    const e = put(B, h('div', ''), 24 + i * (SW + SG), SY, SW, SH);
    e.style.cssText += `border-radius:16px;background:#fff;overflow:hidden;box-shadow:0 0 0 1px rgba(21,22,28,.07),0 14px 26px -14px rgba(30,34,70,.35)`;
    const top = put(e, h('div', ''), 0, 0, SW, 46); top.style.cssText += `display:flex;align-items:center;gap:8px;padding:0 10px;background:color-mix(in srgb,${BOTS[k].c} 14%,#fff)`;
    const b = bot(k, 30); b.el.style.position = 'relative'; top.appendChild(b.el);
    top.appendChild(h('span', '', BOTS[k].name)).style.cssText = 'font:800 20px Geist;letter-spacing:-.01em';
    const disp = put(e, h('div', ''), 12, 58, SW - 24, 118);
    const pr = put(e, h('div', ''), 12, 190, SW - 24, 22); pr.style.cssText += 'display:flex;align-items:center;gap:8px';
    const tr = pr.appendChild(h('span', '')); tr.style.cssText = 'flex:1;height:8px;border-radius:4px;background:#eef0f5;overflow:hidden;display:block';
    const fill = tr.appendChild(h('i', '')); fill.style.cssText = `display:block;height:100%;border-radius:4px;background:${BOTS[k].c}`;
    const pct = pr.appendChild(h('span', 'mono', '')); pct.style.cssText = 'font:700 16px Maple;color:#6b6e7b;width:40px;text-align:right';
    return { e, b, disp, fill, pct, k, i, c: BOTS[k].c, off: [.18, .42, .3, .12, .06][i], rate: [.9, .7, 1.1, .8, .6][i] };
  });
  // screen contents
  const [sD, sA, sR, sC, sV] = screens;
  const dLines = [0, 1, 2].map(j => { const e = put(sD.disp, h('div', ''), 0, j * 38, SW - 24, 30); e.style.cssText += 'display:flex;align-items:center;gap:8px'; const c = e.appendChild(h('span', '', IC.check(BOTS.director.c))); c.style.cssText = 'width:20px;height:20px;display:block;flex:none'; const bb = e.appendChild(h('i', '')); bb.style.cssText = `display:block;height:9px;border-radius:5px;background:#e3e6ee;width:${[90, 110, 70][j]}px`; return { e, c }; });
  const aLines = [0, 1, 2, 3, 4].map(j => { const e = put(sA.disp, h('div', ''), (j % 3 ? 14 : 0), j * 24, 0, 9); e.style.cssText += `border-radius:5px;background:${['#f5a524', '#c9d6fb', '#e3e6ee', '#ffd9a8', '#c9d6fb'][j]}`; return e; });
  const rCells = [...Array(24)].map((_, j) => { const e = put(sR.disp, h('div', ''), (j % 6) * 25.5, Math.floor(j / 6) * 29, 21, 24); e.style.cssText += 'border-radius:5px;background:#eef0f5'; return e; });
  const cBars = [0, 1, 2].map(j => { put(sC.disp, h('div', 'mono', ['MOT', 'TYP', 'PAC'][j]), 0, j * 34 + 2).style.cssText += 'font:600 14px Maple;color:#6b6e7b'; const tr = put(sC.disp, h('div', ''), 42, j * 34 + 8, 80, 8); tr.style.cssText += 'border-radius:4px;background:#eef0f5;overflow:hidden'; const f = put(tr, h('div', ''), 0, 0, 0, 8); f.style.cssText += `border-radius:4px;background:${BOTS.critic.c}`; return f; });
  const cScore = put(sC.disp, h('div', 'mono', ''), 0, 98); cScore.style.cssText += 'font:700 18px Maple;color:#15161c';
  const vRing = put(sV.disp, h('div', '', `<svg viewBox="0 0 80 80" width="84" height="84"><circle cx="40" cy="40" r="32" fill="none" stroke="#eef0f5" stroke-width="8"/><circle class="rg" cx="40" cy="40" r="32" fill="none" stroke="${BOTS.delivery.c}" stroke-width="8" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1" transform="rotate(-90 40 40)"/><path d="M40 28v22M31 37l9-9 9 9" stroke="${BOTS.delivery.c}" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`), 34, 6, 84, 84);
  const vRg = vRing.querySelector('.rg');
  const vLab = put(sV.disp, h('div', 'mono', 'film_016.mp4'), 0, 98, SW - 24); vLab.style.cssText += 'text-align:center;font:600 15px Maple;color:#6b6e7b';
  // parallel bracket
  const brk = put(B, h('div', ''), 24, 402, 942, 18); brk.style.cssText += 'border:3px solid #5a5cf0;border-top:none;border-radius:0 0 12px 12px;opacity:.6';
  const brkL = put(B, h('div', '', '5 screens · running in parallel'), 0, 404); brkL.style.cssText += 'left:50%;transform:translateX(-50%);padding:4px 16px;border-radius:999px;background:#5a5cf0;color:#fff;font:700 19px Geist;white-space:nowrap';
  // ---- bottom status strip: laptop vs cloud
  const st = put(B, h('div', ''), 24, 446, 942, 164); st.style.cssText += 'border-radius:18px;background:#f6f7fa;box-shadow:inset 0 0 0 1px rgba(21,22,28,.07)';
  const lap = put(st, h('div', ''), 28, 16, 200, 132);
  const scrW = put(lap, h('div', ''), 16, 0, 168, 106); scrW.style.transformOrigin = '50% 100%';
  const scr = put(scrW, h('div', ''), 0, 0, 168, 106); scr.style.cssText += 'border-radius:12px 12px 3px 3px;background:#15161c;padding:7px';
  const desk = put(scr, h('div', ''), 7, 7, 154, 92); desk.style.cssText += 'border-radius:6px;background:linear-gradient(140deg,#d5efe6,#e6e9fb)';
  const lg = put(desk, H.grok(30), 12, 12); const lb = put(desk, h('div', ''), 50, 18, 86, 18); lb.style.cssText += 'border-radius:9px;background:#fff';
  const lb2 = put(desk, h('div', ''), 12, 54, 110, 14); lb2.style.cssText += 'border-radius:7px;background:rgba(255,255,255,.75)';
  const lid = put(lap, h('div', ''), 16, 92, 168, 14); lid.style.cssText += 'border-radius:5px 5px 2px 2px;background:linear-gradient(#cfd2dd,#b9bdca)';
  const base = put(lap, h('div', ''), 0, 104, 200, 14); base.style.cssText += 'border-radius:3px 3px 12px 12px;background:linear-gradient(#e6e8ef,#c6c9d6);box-shadow:0 14px 20px -12px rgba(0,0,0,.4)';
  const zz = ['Z', 'z', 'z'].map((c, i) => { const e = put(lap, h('div', '', c), 120 + i * 22, 60, 30); e.style.cssText += `font:800 ${30 - i * 6}px Geist;color:#3a6cf4`; return e; });
  const lt = put(st, h('div', ''), 252, 30, 300); lt.innerHTML = `<div style="font:700 18px Geist;color:${COL.sub};letter-spacing:.1em">YOUR LAPTOP</div><div class="ls" style="font:800 32px Geist;letter-spacing:-.015em;margin-top:6px;display:flex;align-items:center;gap:10px;white-space:nowrap"></div><div class="ls2" style="font:600 20px Geist;color:${COL.sub};margin-top:6px"></div>`;
  const ls = lt.querySelector('.ls'), ls2 = lt.querySelector('.ls2');
  const vsep = put(st, h('div', ''), 556, 26, 1, 112); vsep.style.background = 'rgba(21,22,28,.1)';
  const ct = put(st, h('div', ''), 586, 30, 340); ct.innerHTML = `<div style="font:700 18px Geist;color:${COL.sub};letter-spacing:.1em">CLOUD COMPUTER · UPTIME</div><div class="up mono" style="font:700 34px Maple;margin-top:4px;white-space:nowrap"></div>`;
  const up = ct.querySelector('.up');
  const run = put(st, h('div', '', '<i></i><span></span>'), 586, 110); run.style.cssText += 'display:inline-flex;align-items:center;gap:10px;height:36px;padding:0 16px;border-radius:999px;font:800 19px Geist;white-space:nowrap';
  const runDot = run.firstChild, runTx = run.lastChild; runDot.style.cssText = 'width:10px;height:10px;border-radius:50%;background:#1fbf75;display:block';
  const glow = put(cw, h('div', ''), 0, 0, WW, WH); glow.style.cssText += 'border-radius:20px;box-shadow:inset 0 0 0 3px #1fbf75;pointer-events:none';

  // cues
  ctx.cue(.15, 'swoosh', .45); ctx.cue(T.shares, 'whoosh', .4);
  tiles.forEach(tl => ctx.cue(tl.at + .05, 'pop', .5));
  ctx.cue(T.each, 'whoosh', .4); ctx.cue(T.par, 'tick', .45); ctx.cue(T.close + .45, 'click', .6); ctx.cue(T.stop + .05, 'ding', .6);

  const tCmp = T.each - .4, tLid = T.close + .1;
  return (t) => {
    // ---- left group
    const gk = A(t, T.acc - .25, .6); set(grp, { o: gk, s: lerp(.97, 1, gk) }); set(gl, { o: A(t, T.acc - .1, .3), y: 10 * (1 - A(t, T.acc - .1, .5)) });
    rows.forEach(r => {
      enter(r.r, t, T.every - .2 + r.i * .08, { dx: -40, dy: 0, rx: 0, s0: .9 });
      r.b.update(t, { lookX: .8 });
      const lit = tiles.some(tl => t > tl.at && t < tl.at + .5);
      set(r.dot, { s: 1 + .4 * Math.max(0, Math.sin((t - T.shares) * 6 - r.i * .7)) * (t > T.shares ? .5 : 0) });
    });
    // curves + packets
    paths.forEach((p, i) => { const k = A(t, T.shares - .05 + i * .07, .7, E.io); p.style.strokeDashoffset = (1 - k).toFixed(3); });
    pks.forEach((c, i) => {
      const s = T.shares + .8 + i * .07; if (t < s) { c.style.opacity = 0; return; }
      const ph = ((t - s) * .8 + i * .21) % 1, pt = paths[i].getPointAtLength(ph * plen[i]);
      c.setAttribute('cx', pt.x.toFixed(1)); c.setAttribute('cy', pt.y.toFixed(1)); c.style.opacity = Math.sin(ph * Math.PI).toFixed(2);
    });
    const pp = (t * 1.3) % 1; port.style.boxShadow = t > T.shares + .6 ? `0 0 0 ${(pp * 16).toFixed(1)}px rgba(90,92,240,${(.3 * (1 - pp)).toFixed(2)})` : 'none';
    set(port, { s: lerp(0, 1, SP(t, T.shares + .5, .6)), o: A(t, T.shares + .5, .2) });
    // ---- window
    enter(cw, t, .2, { dx: 80, dy: 0, rx: 0, s0: .95 });
    // tag text by phase
    const tg = t < T.pers ? '' : t < T.each ? '● persistent' : t < T.stop + .2 ? '5 screens' : '● still running';
    if (tag.textContent !== tg) tag.textContent = tg;
    set(tag, { o: A(t, T.pers, .25), s: 1 + .12 * Math.exp(-6 * Math.max(0, t - T.pers)) * (t > T.pers ? 1 : 0) });
    tag.style.background = t > T.stop + .2 ? 'rgba(31,191,117,.14)' : 'rgba(90,92,240,.1)'; tag.style.color = t > T.stop + .2 ? '#14855f' : '#5a5cf0';
    // tiles
    const ck = A(t, tCmp, .7, E.io), th = lerp(TH0, TH1, ck);
    tiles.forEach(tl => {
      tl.e.style.height = th.toFixed(1) + 'px';
      const ek = SP(t, .45 + tl.i * .1, .9);
      const lk = A(t, tl.at - .1, .45, E.quart);
      set(tl.e, { y: 30 * (1 - ek), o: A(t, .45 + tl.i * .1, .3) * lerp(tl.i === 2 ? .8 : .5, 1, lk) });
      tl.e.style.filter = lk < 1 ? `saturate(${lerp(.1, 1, lk).toFixed(2)})` : 'none';
      set(tl.ic, { s: 1 + .16 * Math.max(0, 1 - Math.abs(t - tl.at - .15) / .25) });
      tl.avs.forEach((d, j) => { const s = tl.at + .15 + j * .06, k = SP(t, s, .6); set(d, { s: lerp(.2, 1, k), o: A(t, s, .1) }); });
      set(tl.avl, { o: A(t, tl.at + .5, .3) });
      tl.bd.upd(t, tl.at + .35);
      const flash = Math.max(0, 1 - Math.abs(t - tl.at - .3) / .5);
      tl.ring.style.opacity = (flash * .9).toFixed(3); tl.ring.style.height = th.toFixed(1) + 'px';
      set(tl.det, { o: 1 - A(t, tCmp - .1, .3) });
    });
    fRows.forEach((e, j) => { const s = T.files + .3 + j * .1; set(e, { x: -14 * (1 - A(t, s, .4)), o: A(t, s, .25) }); });
    sRows.forEach((e, j) => { const s = T.log + .25 + j * .1; set(e, { x: -14 * (1 - A(t, s, .4)), o: A(t, s, .25) }); });
    tRows.forEach((e, j) => {
      const s = T.term + .15 + j * .22, [pp2, tx, cls] = TL[j];
      const n = Math.max(0, Math.floor((t - s) * 40)); const shown = tx.slice(0, n);
      e.innerHTML = t < s ? '' : `<span class="p">${pp2}</span><span class="${cls === 'p' ? '' : cls}">${shown}</span>`;
    });
    // screens
    screens.forEach(sc => {
      const s = T.each - .05 + sc.i * .09, k = SP(t, s, .8);
      set(sc.e, { y: 40 * (1 - k), s: lerp(.7, 1, k), rx: 12 * (1 - k), o: A(t, s, .18) });
      sc.b.update(t, { bob: 1.2 });
      const p = sc.off + (1 - sc.off) * .82 * cl((t - s) / (ctx.dur - s + .5)) * sc.rate;
      sc.fill.style.width = (p * 100).toFixed(1) + '%'; sc.pct.textContent = t > s ? Math.floor(p * 100) + '%' : '';
      sc.p = p;
      sc.e.style.boxShadow = `0 0 0 ${(2.5 * Math.max(0, 1 - Math.abs(t - T.par - .1 - sc.i * .06) / .3)).toFixed(2)}px ${sc.c},0 14px 26px -14px rgba(30,34,70,.35)`;
    });
    const lt0 = T.each + .3;
    dLines.forEach((d, j) => { const s = lt0 + j * 1.1; set(d.c, { s: lerp(.2, 1, SP(t, s, .6)), o: A(t, s, .1) }); });
    aLines.forEach((e, j) => { const s = lt0 + j * .55; e.style.width = (lerp(0, [120, 96, 110, 70, 104][j], A(t, s, .6, E.io))).toFixed(1) + 'px'; });
    const rn = cl((t - lt0) * 3.2, 0, 24); rCells.forEach((e, j) => { const kk = cl(rn - j); e.style.background = kk > 0 ? `rgba(90,92,240,${(.25 + .75 * kk).toFixed(2)})` : '#eef0f5'; });
    cBars.forEach((f, j) => f.style.width = (lerp(0, [72, 64, 58][j], A(t, lt0 + .4 + j * .5, 1.2, E.io))).toFixed(1) + 'px');
    cScore.textContent = t > lt0 + 1.5 ? `score ${(8.1 + .7 * A(t, lt0 + 1.5, 2)).toFixed(1)}` : '';
    vRg.setAttribute('stroke-dashoffset', (1 - sV.p).toFixed(3));
    // bracket
    const bk = A(t, T.par - .1, .5, E.io); brk.style.clipPath = `inset(0 ${(50 - 50 * bk).toFixed(1)}% 0 ${(50 - 50 * bk).toFixed(1)}%)`; brk.style.opacity = (.6 * bk).toFixed(2);
    const bl = SP(t, T.par + .1, .7); brkL.style.opacity = A(t, T.par + .1, .15).toFixed(3); brkL.style.transform = `translateX(-50%) scale(${lerp(.6, 1, bl).toFixed(3)})`;
    // status strip
    enter(st, t, T.pers - .05, { dy: 30, rx: 8 });
    const lk = A(t, tLid, .75, E.io);
    scrW.style.transform = `perspective(700px) rotateX(${(-88 * lk).toFixed(2)}deg)`;
    scr.style.filter = lk > 0 ? `brightness(${(1 - .5 * lk).toFixed(2)})` : 'none';
    lid.style.opacity = lk > .93 ? 1 : 0; scrW.style.opacity = lk > .97 ? 0 : 1;
    zz.forEach((z, i) => { const ph = ((t - tLid - .8) * .55 + i * .33) % 1; const v = t > tLid + .8; set(z, { x: 26 * ph, y: -70 * ph, o: v ? Math.sin(ph * Math.PI) : 0 }); });
    const closed = t > tLid + .6;
    const lsT = closed ? `<span style="width:30px;height:30px;display:block">${IC.lock()}</span>Lid closed` : 'Open';
    if (ls.dataset.k !== String(closed)) { ls.innerHTML = lsT; ls.dataset.k = String(closed); ls2.textContent = closed ? 'nothing runs here' : 'just a window into it'; }
    set(ls, { x: closed ? 12 * (1 - A(t, tLid + .6, .4)) : 0, o: closed ? A(t, tLid + .6, .3) : 1 });
    set(lt, { o: A(t, T.pers + .2, .4) });
    const secs = 41 * 86400 + 6 * 3600 + 12 * 60 + 8 + Math.floor(t);
    up.textContent = `${Math.floor(secs / 86400)}d ${String(Math.floor(secs / 3600) % 24).padStart(2, '0')}:${String(Math.floor(secs / 60) % 60).padStart(2, '0')}:${String(secs % 60).padStart(2, '0')}`;
    set(ct, { o: A(t, T.pers + .3, .4) });
    const still = t > T.stop;
    const rt = still ? 'Still running · 5 bots' : t > T.each ? 'Running · 5 bots' : 'Running';
    if (runTx.textContent !== rt) runTx.textContent = rt;
    run.style.background = still ? '#1fbf75' : 'rgba(31,191,117,.14)'; run.style.color = still ? '#fff' : '#14855f'; runDot.style.background = still ? '#fff' : '#1fbf75';
    set(run, { o: A(t, T.pers + .4, .3), s: 1 + .1 * Math.exp(-6 * Math.max(0, t - T.stop)) * (still ? 1 : 0) });
    const pl = (t * 1.2) % 1; runDot.style.boxShadow = `0 0 0 ${(pl * 8).toFixed(1)}px rgba(${still ? '255,255,255' : '31,191,117'},${(.45 * (1 - pl)).toFixed(2)})`;
    glow.style.opacity = (A(t, T.stop, .4) * (.7 + .3 * Math.sin(t * 4))).toFixed(3);
  };
};
