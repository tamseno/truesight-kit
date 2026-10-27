// e23 — Critic rubric: six scores, all >= 8 to pass; worst three go back to Animator; 3 failed rounds -> stop and ask
SCENES.e23 = (root, ctx, H) => {
  const { put, h, set, enter, A, SP, E, P, lerp, cl, bot, BOTS, IC, strike } = H;
  const D = (p, x, y, w, hh, css = '', html = '') => { const e = put(p, h('div', '', html), x, y, w, hh); if (css) e.style.cssText += ';' + css; return e; };
  const LABS = [['Hook', 'first 2 s'], ['Readability', 'on a phone'], ['Motion', ''], ['Variety', ''], ['Composition', ''], ['Brand', '']];
  const tR = [ctx.at('hook'), ctx.at('readability'), ctx.at('motion'), ctx.at('variety'), ctx.at('composition'), ctx.at('brand')];
  const T = { six: ctx.at('six'), every: ctx.at('Everything'), eight: ctx.at('eight'), no: ctx.at('Ifnot'), worst: ctx.at('threeworst'), go: ctx.at('goback'), anim: ctx.at('Animator'), fixes: ctx.at('fixes'), focus: ctx.at('focused'), three: ctx.at('Three'), failed: ctx.at('failed'), rounds: ctx.at('rounds'), stops: ctx.at('stops'), asks: ctx.at('asks'), burn: ctx.at('burning'), am: ctx.at('morning') };
  const R1 = [5, 6, 8, 7, 9, 8], R2 = [8, 8, 9, 8, 9, 9], WORST = [0, 1, 3];
  const ISSUE = ['Hook is flat', 'Text too small', 'Shots repeat'];

  // ---------- scorecard
  const SX = 100, SY = 230;
  const sc = put(root, H.card({ w: 1040, h: 680 }), SX, SY);
  const cbot = bot('critic', 54); put(sc, cbot.el, 30, 17);
  D(sc, 98, 26, 560, 40, 'font:800 28px Geist;white-space:nowrap;display:flex;align-items:baseline;gap:14px;letter-spacing:-.01em', 'Critic scorecard<span style="font:500 17px Maple;color:#a3a6b3;letter-spacing:0">review_log.md</span>');
  const round = D(sc, 862, 24, 148, 42, 'border-radius:999px;background:#f0eafe;color:#7c4ff0;font:800 20px Geist;display:flex;align-items:center;justify-content:center;white-space:nowrap');
  D(sc, 30, 86, 980, 1, 'background:rgba(21,22,28,.08)');
  const BX = 390, BW = 470, RY = 110, RH = 78;
  const rows = LABS.map(([l, s], i) => {
    const y = RY + i * RH;
    const hl = D(sc, 22, y + 6, 996, RH - 12, 'border-radius:14px;background:rgba(240,68,58,.07);box-shadow:inset 0 0 0 2px rgba(240,68,58,.45)');
    const lb = D(sc, 44, y + 18, 340, 42, 'font:700 29px Geist;white-space:nowrap;letter-spacing:-.01em;display:flex;align-items:baseline;gap:10px', `${l}${s ? `<span style="font:600 19px Geist;color:#8a8d99;letter-spacing:0">${s}</span>` : ''}`);
    const tr = D(sc, BX, y + 30, BW, 18, 'border-radius:9px;background:#eef0f5;overflow:hidden');
    const f = D(tr, 0, 0, 0, 18, 'border-radius:9px');
    const v = D(sc, 900, y + 10, 100, 60, 'font:800 46px Geist;text-align:right;font-variant-numeric:tabular-nums');
    return { hl, lb, tr, f, v };
  });
  const thr = D(sc, BX + BW * .8 - 1.5, RY - 2, 3, RH * 6, 'background:repeating-linear-gradient(180deg,#1fbf75 0 8px,transparent 8px 14px);transform-origin:top');
  const thrB = D(sc, BX + BW * .8 - 22, RY - 22, 44, 26, 'border-radius:8px;background:#1fbf75;color:#fff;font:800 17px Geist;display:flex;align-items:center;justify-content:center', '≥ 8');
  D(sc, 30, 590, 980, 1, 'background:rgba(21,22,28,.08)');
  const footL = D(sc, 44, 612, 260, 44, 'font:700 22px Geist;color:#6b6e7b;display:flex;align-items:center;white-space:nowrap', 'All six ≥ 8 →');
  const stamp = D(sc, 212, 608, 190, 50, 'border-radius:12px;border:2.5px dashed #c9ccd6;color:#b4b7c3;font:800 24px Geist;display:flex;align-items:center;justify-content:center;gap:8px;letter-spacing:.06em', 'PASSED');
  const stampOn = D(sc, 212, 608, 190, 50, 'border-radius:12px;background:#1fbf75;color:#fff;font:800 24px Geist;display:flex;align-items:center;justify-content:center;gap:8px;letter-spacing:.06em;box-shadow:0 12px 26px -10px rgba(31,191,117,.8)', '<svg width="24" height="24" viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" stroke="#fff" stroke-width="3.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>PASSED');
  const footR = D(sc, 610, 616, 400, 36, 'font:700 21px Geist;color:#f0443a;text-align:right;white-space:nowrap', 'Only the 3 worst go back');

  // ---------- loop card
  const LX = 1170, LY = 230;
  const lc = put(root, H.card({ w: 660, h: 680 }), LX, LY);
  D(lc, 30, 26, 400, 36, 'font:800 25px Geist;display:flex;align-items:center;gap:10px', '<svg width="24" height="24" viewBox="0 0 24 24"><path d="M20 12a8 8 0 11-2.3-5.6M20 4v4.5h-4.5" stroke="#15161c" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>Review loop');
  const CX = 330, CY = 222, RR = 122;
  const pos = (a, r = RR) => [CX + r * Math.cos(a * Math.PI / 180), CY + r * Math.sin(a * Math.PI / 180)];
  const arc = (a0, a1) => { const [x0, y0] = pos(a0), [x1, y1] = pos(a1); return `M${x0.toFixed(1)} ${y0.toFixed(1)} A${RR} ${RR} 0 0 1 ${x1.toFixed(1)} ${y1.toFixed(1)}`; };
  const ARCS = [[-90 + 26, 30 - 26, '#8b5cf6'], [30 + 26, 150 - 26, '#f5a524'], [150 + 26, 270 - 26, '#5a5cf0']];
  const svg = D(lc, 0, 0, 660, 420); svg.innerHTML = `<svg width="660" height="420" style="overflow:visible"><defs>${ARCS.map((a, i) => `<marker id="ah23${i}" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10z" fill="${a[2]}"/></marker>`).join('')}</defs><circle cx="${CX}" cy="${CY}" r="${RR}" fill="none" stroke="#eceef4" stroke-width="10"/>${ARCS.map((a, i) => `<path class="arc" d="${arc(a[0], a[1])}" fill="none" stroke="${a[2]}" stroke-width="5" stroke-linecap="round" marker-end="url(#ah23${i})" pathLength="100" stroke-dasharray="100" stroke-dashoffset="100"/>`).join('')}</svg>`;
  const arcs = [...svg.querySelectorAll('.arc')];
  const nodes = [['critic', -90], ['animator', 30], ['render', 150]].map(([k, a]) => {
    const [x, y] = pos(a); const b = bot(k, 76); put(lc, b.el, x - 38, y - 44);
    const nm = D(lc, x - 56, y + 34, 112, 28, `border-radius:999px;background:#fff;box-shadow:0 0 0 1px rgba(21,22,28,.06);font:800 18px Geist;display:flex;align-items:center;justify-content:center;color:${BOTS[k].c}`, BOTS[k].name);
    return { b, nm, x, y };
  });
  const arcLab = [['3 issues', -16, 18], ['Fix + re-render', 90, 40], ['3 new stills', 196, 18]].map(([s, a, off]) => { const [x, y] = pos(a, RR + off); return D(lc, x - 80, y - 16, 160, 32, 'border-radius:999px;background:#fff;box-shadow:0 0 0 1px rgba(21,22,28,.08),0 6px 14px -6px rgba(30,34,70,.25);font:700 17px Geist;display:flex;align-items:center;justify-content:center;white-space:nowrap', s); });
  const center = D(lc, CX - 110, CY - 42, 220, 80, 'display:flex;flex-direction:column;align-items:center;justify-content:center;white-space:nowrap');
  const dot = D(lc, 0, 0, 22, 22, 'border-radius:50%;background:#15161c;box-shadow:0 0 0 5px rgba(21,22,28,.12)');
  // ---------- rule panel: max 3 rounds -> stop and ask
  const rule = D(lc, 24, 432, 612, 224, 'border-radius:18px;background:#fbf8f1;box-shadow:inset 0 0 0 1.5px rgba(245,165,36,.35)');
  D(rule, 22, 20, 200, 34, 'font:800 23px Geist;color:#15161c;display:flex;align-items:center;white-space:nowrap', 'Max 3 rounds');
  const pips = [0, 1, 2].map(i => { const p = D(rule, 196 + i * 54, 15, 44, 44, 'border-radius:50%;box-shadow:inset 0 0 0 2.5px #d5d8e0;font:800 19px Geist;color:#a3a6b3;display:flex;align-items:center;justify-content:center', String(i + 1)); const x = D(p, 0, 0, 44, 44, '', IC.x()); return { p, x }; });
  const arr = D(rule, 368, 22, 40, 30, 'font:800 26px Geist;color:#c27a00;display:flex;align-items:center', '→');
  const stopB = D(rule, 404, 14, 190, 46, 'border-radius:12px;background:#f5a524;color:#fff;font:800 21px Geist;display:flex;align-items:center;justify-content:center;gap:10px;white-space:nowrap;box-shadow:0 10px 22px -10px rgba(245,165,36,.9)', '<span style="display:flex;gap:4px"><i style="width:6px;height:18px;border-radius:2px;background:#fff"></i><i style="width:6px;height:18px;border-radius:2px;background:#fff"></i></span>Studio stops');
  // notification to you
  const note = D(rule, 22, 76, 568, 74, 'border-radius:14px;background:#fff;box-shadow:0 0 0 1px rgba(21,22,28,.06),0 10px 22px -12px rgba(30,34,70,.3);display:flex;align-items:center;gap:14px;padding:0 16px');
  const ng = H.grok(42); ng.style.position = 'relative'; note.appendChild(ng);
  note.appendChild(h('div', '', '<div style="font:800 19px Geist;color:#15161c;white-space:nowrap">Hook still at 7 after 3 rounds.</div><div style="font:600 17px Geist;color:#6b6e7b;white-space:nowrap;margin-top:2px">Want me to keep going, or change the brief?</div>'));
  const askChip = D(rule, 456, 98, 120, 30, 'border-radius:999px;background:#ffd66b;color:#15161c;font:800 16px Geist;display:flex;align-items:center;justify-content:center;white-space:nowrap;box-shadow:0 6px 14px -6px rgba(0,0,0,.3)', 'Asks you');
  // the thing it avoids
  const avoid = D(rule, 22, 164, 568, 44, 'display:flex;align-items:center;gap:12px;white-space:nowrap');
  avoid.innerHTML = `<span style="width:30px;height:30px;flex:none">${IC.moon()}</span>`;
  const avT = avoid.appendChild(h('span', 'strike', 'Round 4, 5, 6… at 3:00 a.m.')); avT.style.cssText += ';font:700 21px Geist;color:#6b6e7b';
  const burnChip = avoid.appendChild(h('span', '', '')); burnChip.style.cssText = 'margin-left:auto;display:flex;align-items:center;gap:8px;font:700 17px Geist;color:#f0443a';
  burnChip.innerHTML = '<span>usage</span><span style="position:relative;width:110px;height:12px;border-radius:6px;background:#f0e3e1;overflow:hidden;display:block"><i class="bf" style="position:absolute;left:0;top:0;bottom:0;border-radius:6px;background:#f0443a"></i></span>';
  const bf = burnChip.querySelector('.bf');

  // flying issue tags (root layer, crosses both cards)
  const fly = put(root, h('div', ''), 0, 0, 1920, 1080);
  const tags = WORST.map((r, k) => { const e = put(fly, h('div', '', `<span style="width:20px;height:20px">${IC.x()}</span>${ISSUE[k]}`), SX + BX + 250, SY + RY + r * RH + 18, null, 42); e.style.cssText += ';border-radius:999px;background:#fff;box-shadow:0 0 0 2px #f0443a,0 12px 24px -10px rgba(240,68,58,.6);font:800 19px Geist;color:#f0443a;display:flex;align-items:center;gap:8px;padding:0 16px;white-space:nowrap'; return { e, r }; });
  const ax = LX + nodes[1].x, ay = LY + nodes[1].y;

  // loop timing: send on "go back", arrive on "Animator", render, back, round 2, pass on "focused"
  const tSend = T.go - .1, tArr = T.anim + .15, tRen = tArr + .45, tBack = tRen + .45, tR2 = tBack + .05, tPass = Math.max(tR2 + .5, T.focus - .1);
  const tFail = [T.failed - .05, T.failed + .25, T.rounds + .15];
  ctx.cue(.15, 'swoosh', .5); tR.forEach(s => ctx.cue(s + .05, 'tick', .35)); ctx.cue(T.eight, 'swoosh', .4); ctx.cue(T.no + .1, 'error', .5);
  ctx.cue(tSend, 'whoosh', .5); ctx.cue(tR2, 'tick', .5); ctx.cue(tPass, 'ding', .6); ctx.cue(T.three - .1, 'swoosh', .4);
  tFail.forEach(s => ctx.cue(s, 'error', .3)); ctx.cue(T.stops, 'pop', .5); ctx.cue(T.asks, 'pop', .45);

  return (t) => {
    enter(sc, t, .1, { dy: 60, rx: 10 }); enter(lc, t, .35, { dy: 60, rx: 10 });
    cbot.update(t, { lookX: .4 });
    const r2 = A(t, tR2, .55, E.io);
    round.textContent = t < tR2 ? 'Round 1' : 'Round 2';
    set(round, { s: 1 + .12 * Math.sin(Math.PI * P(t, tR2 - .05, tR2 + .3)) });
    const judged = i => A(t, T.eight + .25 + i * .05, .3);
    rows.forEach((r, i) => {
      const s = tR[i] - .05; set(r.lb, { o: lerp(.22, 1, A(t, s, .3)), x: 10 * (1 - A(t, s, .4)) });
      const k = A(t, s + .1, .7, E.io); const val = lerp(R1[i] * k, R2[i], r2);
      r.f.style.width = (BW * val / 10).toFixed(1) + 'px';
      const j = judged(i), bad = val < 7.95;
      r.f.style.background = j < .01 ? '#b9a7f7' : bad ? `color-mix(in srgb,#f0443a ${Math.round(j * 100)}%,#b9a7f7)` : `color-mix(in srgb,#1fbf75 ${Math.round(j * 100)}%,#b9a7f7)`;
      r.v.textContent = k > 0 ? Math.round(val) : '–';
      r.v.style.color = j < .5 || k <= 0 ? (k > 0 ? '#15161c' : '#c9ccd6') : bad ? '#f0443a' : '#1fbf75';
      const hk = WORST.includes(i) ? A(t, T.no + WORST.indexOf(i) * .12, .3) * (1 - A(t, tR2 + .1, .4)) : 0; set(r.hl, { o: hk });
    });
    set(thr, { sy: A(t, T.eight - .05, .5, E.quart), o: A(t, T.eight - .05, .2) }); set(thrB, { s: lerp(.4, 1, SP(t, T.eight + .2, .6)), o: A(t, T.eight + .2, .2) });
    set(footL, { o: A(t, T.every - .1, .4) }); set(stamp, { o: A(t, T.every, .4) * (1 - A(t, tPass, .2)) });
    set(stampOn, { s: lerp(1.6, 1, SP(t, tPass, .6)), r: -6 * (1 - SP(t, tPass, .6)), o: A(t, tPass, .15) });
    set(footR, { o: A(t, T.worst - .1, .3) * (1 - A(t, tPass, .3)), x: 12 * (1 - A(t, T.worst - .1, .4)) });
    // loop
    arcs.forEach((a, i) => a.setAttribute('stroke-dashoffset', (100 * (1 - A(t, .9 + i * .3, .6, E.io))).toFixed(1)));
    nodes.forEach((n, i) => {
      const s = .7 + i * .25, k = SP(t, s, .8); set(n.b.el, { s: lerp(.4, 1, k), o: A(t, s, .2) }); set(n.nm, { o: A(t, s + .2, .3) });
      const busy = i === 1 ? (t > tArr && t < tRen + .1) : i === 2 ? (t > tRen && t < tBack + .1) : (t > tBack && t < tPass);
      n.b.update(t, { bob: busy ? 5 : 2, lookX: i === 0 ? -.4 : 0 });
    });
    arcLab.forEach((l, i) => set(l, { o: A(t, 1.4 + i * .3, .4), s: lerp(.8, 1, A(t, 1.4 + i * .3, .4)) }));
    const rr = t < tR2 ? 1 : 2, rk = 1 - SP(t, tR2, .6);
    center.innerHTML = `<span style="font:700 16px Geist;color:#8a8d99;letter-spacing:.14em">ROUND</span><span style="font:800 56px/1 Geist;display:inline-block;transform:translateY(${(12 * rk * (rr - 1)).toFixed(1)}px)">${rr}</span>`;
    set(center, { o: A(t, 1.2, .4) });
    let ang = -90, dO = 0;
    if (t >= tSend && t < tPass) { dO = 1; ang = t < tArr ? lerp(-90, 30, E.io(P(t, tSend, tArr))) : t < tRen ? lerp(30, 150, E.io(P(t, tArr + .05, tRen))) : lerp(150, 270, E.io(P(t, tRen + .05, tBack))); }
    const [dx, dy] = pos(ang); set(dot, { x: dx - 11, y: dy - 11, o: dO * A(t, tSend, .1) * (1 - A(t, tBack, .2)) });
    tags.forEach(({ e, r }, k) => {
      const s0 = T.worst + k * .14, k1 = SP(t, s0, .6), fk = A(t, tSend + k * .08, .6, E.io);
      const x0 = SX + BX + 250, y0 = SY + RY + r * RH + 18;
      set(e, { x: (ax - 90 - x0) * fk + 30 * (1 - k1), y: (ay - 20 - y0) * fk - 120 * Math.sin(fk * Math.PI), s: lerp(.6, 1, k1) * lerp(1, .4, fk), o: A(t, s0, .2) * (1 - A(t, tArr - .05, .2)) });
    });
    // rule panel
    enter(rule, t, T.three - .25, { dy: 30, rx: 8 });
    pips.forEach((p, i) => {
      const f = A(t, tFail[i], .2); set(p.x, { s: lerp(.3, 1, SP(t, tFail[i], .5)), o: f });
      set(p.p, { s: 1 + .15 * Math.sin(Math.PI * P(t, tFail[i], tFail[i] + .3)) });
    });
    set(arr, { o: A(t, T.stops - .2, .3), x: -10 * (1 - A(t, T.stops - .2, .4)) });
    set(stopB, { s: lerp(.6, 1, SP(t, T.stops - .05, .6)), o: A(t, T.stops - .05, .2) });
    set(note, { y: 16 * (1 - SP(t, T.asks - .15, .7)), o: A(t, T.asks - .15, .25) });
    set(askChip, { s: lerp(.4, 1, SP(t, T.asks + .2, .6)), r: lerp(-10, 3, SP(t, T.asks + .2, .6)), o: A(t, T.asks + .2, .15) });
    set(avoid, { o: A(t, T.burn - .3, .3), x: 12 * (1 - A(t, T.burn - .3, .4)) });
    bf.style.width = (110 * (1 - .85 * A(t, T.burn - .2, 1.4, E.io))).toFixed(1) + 'px';
    strike(avT, A(t, T.am - .2, .5, E.io));
    set(burnChip, { o: 1 - .55 * A(t, T.am - .1, .4) });
  };
};
