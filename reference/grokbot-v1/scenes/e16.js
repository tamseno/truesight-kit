// e16 — the engine: the open template's build rules; closed-form springs (many targets = a sum of springs, still pure in t); the last line: state list on the beat grid before any code
SCENES.e16 = (root, ctx, H) => {
  const { put, h, set, enter, A, SP, E, P, lerp, cl, IC, COL } = H;
  const css = (e, s) => (e.style.cssText += s, e);
  const T = {
    engine: ctx.at('engine'), tmpl: ctx.at('template'), rules: ctx.at('buildrules'), trick: ctx.at('wholetrick'),
    springs: ctx.at('Springs'), closed: ctx.at('closed-form'), target: ctx.at('changestarget'), many: ctx.at('manytimes'), sum: ctx.at('sumof'), pure: ctx.at('stillapure'),
    last: ctx.at('lastline'), most: ctx.at('mattersmost'), show: ctx.at('showthe'), grid: ctx.at('beatgrid'), before: ctx.at('before'), code: ctx.at('anycode'),
  };
  const RIN = T.springs - .3, ROUT = T.last - .2;

  // ================= left: the template
  const TW = put(root, H.win({ title: 'ui-morph-spec.md', w: 800, h: 676 }), 88, 232);
  const by = put(TW, h('div', '', '<span style="width:8px;height:8px;border-radius:50%;background:#5ee39b;display:inline-block"></span>open template · @twoclipping'), 0, 8);
  css(by, 'left:auto;right:16px;display:inline-flex;align-items:center;gap:8px;height:30px;padding:0 12px;border-radius:15px;background:#15161c;color:#fff;font:600 15px Geist;white-space:nowrap');
  const wb = TW.body;
  const LN = [['Input', 'Ask length, aspect, style first'], ['Direction', 'Pick rhythm, palette, type'], ['Structure', 'One state per beat'], ['Build', 'frame(t): a pure function of time'], ['Motion', 'Closed-form springs, no physics loop'], ['Avoid', 'No real-time playback, no Math.random']];
  const lines = LN.map(([k, v], i) => {
    const r = put(wb, h('div', ''), 14, 12 + i * 70, 772, 62); css(r, 'border-radius:14px');
    put(r, h('div', 'mono', String(i + 1).padStart(2, '0')), 18, 19).style.cssText += 'font:700 18px Maple;color:#b4b7c3';
    const kk = put(r, h('div', '', k), 64, 17); css(kk, 'font:700 22px Geist;color:#15161c');
    const vv = put(r, h('div', 'mono', v), 196, 18); css(vv, 'font:500 20px Maple;color:#3a3d4a;white-space:nowrap');
    return { r, kk, vv };
  });
  const brk = put(wb, h('div', ''), 0, 12 + 3 * 70 + 4, 8, 3 * 70 - 14); css(brk, `border-radius:4px;background:${COL.violet};transform-origin:top`);
  const trick = put(wb, h('div', '', 'build rules = the whole trick'), 0, 0); css(trick, `left:auto;right:18px;top:${12 + 3 * 70 - 26}px;display:inline-flex;align-items:center;height:32px;padding:0 14px;border-radius:999px;background:${COL.violet};color:#fff;font:700 16px Geist;white-space:nowrap;box-shadow:0 8px 18px -8px rgba(139,92,246,.7)`);
  const last = put(wb, h('div', ''), 14, 12 + 6 * 70 + 6, 772, 160); css(last, 'border-radius:16px;background:#f3eeff');
  put(last, h('div', 'mono', '07'), 18, 20).style.cssText += `font:700 18px Maple;color:${COL.violet}`;
  put(last, h('div', '', 'Start'), 64, 17).style.cssText += `font:700 22px Geist;color:${COL.violet}`;
  const lastTag = put(last, h('div', '', 'last line · matters most'), 0, 16); css(lastTag, `left:auto;right:16px;display:inline-flex;align-items:center;height:30px;padding:0 12px;border-radius:999px;background:${COL.violet};color:#fff;font:700 15px Geist;white-space:nowrap`);
  const lastT = put(last, h('div', ''), 64, 60, 690); css(lastT, 'font:700 28px/1.35 Geist;letter-spacing:-.015em;color:#15161c');
  const LAST = 'Show the state list on the beat grid before you write any code.';

  // ================= right: springs card
  const R = put(root, H.card({ w: 912, h: 676 }), 920, 232);
  const R1 = put(R, h('div', ''), 0, 0, 912, 676);
  const rh = put(R1, h('div', '', 'Closed-form springs'), 40, 32); css(rh, 'font:800 32px Geist;letter-spacing:-.02em;white-space:nowrap');
  const nochip = put(R1, h('div', '', 'no simulation · no state'), 0, 36); css(nochip, `left:auto;right:40px;display:inline-flex;align-items:center;height:32px;padding:0 14px;border-radius:999px;background:rgba(58,108,244,.1);color:${COL.blue};font:700 16px Geist;white-space:nowrap`);
  const GX = 40, GY = 94, GW = 832, GH = 380;
  const g = put(R1, h('div', ''), GX, GY, GW, GH); css(g, 'border-radius:18px;background:#f7f8fb;box-shadow:inset 0 0 0 1px rgba(21,22,28,.05)');
  const X = tt => 56 + tt / 6 * 744, Y = v => 250 - v * 175;
  const svgNS = 'http://www.w3.org/2000/svg';
  g.innerHTML = `<svg width="${GW}" height="${GH}" viewBox="0 0 ${GW} ${GH}" style="position:absolute;left:0;top:0;overflow:visible">
    <line x1="56" x2="800" y1="${Y(0)}" y2="${Y(0)}" stroke="rgba(21,22,28,.18)" stroke-width="2"/>
    ${[0, 1, 2, 3, 4, 5, 6].map(s => `<text x="${X(s)}" y="${GH - 14}" text-anchor="middle" font-family="Maple" font-size="15" fill="#9a9db0">${s}s</text>`).join('')}
    <text x="40" y="${Y(1) + 5}" text-anchor="end" font-family="Maple" font-size="15" fill="#9a9db0">1</text><text x="40" y="${Y(0) + 5}" text-anchor="end" font-family="Maple" font-size="15" fill="#9a9db0">0</text>
    <path class="tg" fill="none" stroke="#9a9db0" stroke-width="2.5" stroke-dasharray="7 7"/>
    <path class="c0" fill="none" stroke="${COL.amber}" stroke-width="3" stroke-linecap="round"/>
    <path class="c1" fill="none" stroke="${COL.mint}" stroke-width="3" stroke-linecap="round"/>
    <path class="c2" fill="none" stroke="${COL.violet}" stroke-width="3" stroke-linecap="round"/>
    <path class="sm" fill="none" stroke="#15161c" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
    <line class="ph" y1="20" y2="${GH - 40}" stroke="${COL.blue}" stroke-width="2.5"/>
    <circle class="pd" r="9" fill="#fff" stroke="${COL.blue}" stroke-width="4"/>
  </svg>`;
  const tg = g.querySelector('.tg'), comps = ['.c0', '.c1', '.c2'].map(s => g.querySelector(s)), sm = g.querySelector('.sm'), phL = g.querySelector('.ph'), phD = g.querySelector('.pd');
  const TG = [[.4, 1], [2.4, -.55], [4, .4]], TGC = [COL.amber, COL.mint, COL.violet];
  const spr = u => E.spring(u / .8);
  const comp = (i, tt) => TG[i][1] * spr(tt - TG[i][0]);
  const sumAt = (tt, n = 3) => { let v = 0; for (let i = 0; i < n; i++) v += comp(i, tt); return v; };
  const path = (f, t0, t1) => { if (t1 <= t0) return ''; let d = ''; const N = Math.max(2, Math.ceil((t1 - t0) * 40)); for (let k = 0; k <= N; k++) { const tt = t0 + (t1 - t0) * k / N; d += (k ? 'L' : 'M') + X(tt).toFixed(1) + ' ' + Y(f(tt)).toFixed(1); } return d; };
  const tLabs = TG.map(([tt, dv], i) => { const e = put(g, h('div', 'mono', `t${'₁₂₃'[i]}`), X(tt) - 14, 14, 28); css(e, `text-align:center;font:700 16px Maple;color:${TGC[i]}`); return e; });
  const read = put(g, h('div', 'mono', ''), 0, 18); css(read, `left:auto;right:22px;display:inline-flex;align-items:center;height:36px;padding:0 14px;border-radius:10px;background:#15161c;color:#fff;font:600 18px Maple;white-space:nowrap`);
  // formula strip
  const F = put(R1, h('div', ''), 40, 498, 832, 142); css(F, 'border-radius:18px;background:#16171f');
  const f1 = put(F, h('div', 'mono', `<span style="color:#ffd66b">spring</span>(t) = 1 − e<sup style="font-size:.6em">−ζωt</sup>(cos ω<sub style="font-size:.6em">d</sub>t + …)`), 30, 26); css(f1, 'font:600 28px Maple;color:#e8e9f0;white-space:nowrap');
  const f1s = put(F, h('div', '', 'one formula · any t, directly'), 30, 84); css(f1s, 'font:500 20px Geist;color:#8b90a6;white-space:nowrap');
  const f2 = put(F, h('div', 'mono', `x(t) = <span style="color:#ffd66b">Σ</span> Δ<sub style="font-size:.6em">i</sub> · spring(t − t<sub style="font-size:.6em">i</sub>)`), 30, 22); css(f2, 'font:700 30px Maple;color:#fff;white-space:nowrap');
  const terms = TG.map(([tt, dv], i) => { const e = put(F, h('div', 'mono', `${dv > 0 ? '+' : '−'}${Math.abs(dv).toFixed(2)}·spring(t−${tt})`), 30 + i * 262, 84); css(e, `display:inline-flex;align-items:center;height:36px;padding:0 12px;border-radius:10px;background:color-mix(in srgb,${TGC[i]} 22%,#16171f);color:${TGC[i]};font:600 16px Maple;white-space:nowrap`); return e; });
  const pureChip = put(F, h('div', '', 'still pure in t'), 0, 24); css(pureChip, `left:auto;right:26px;display:inline-flex;align-items:center;height:36px;padding:0 14px;border-radius:999px;background:#fff;color:#15161c;font:700 18px Geist;white-space:nowrap`);

  // ================= right, phase 2: state list on the beat grid
  const R2 = put(R, h('div', ''), 0, 0, 912, 676);
  const r2h = put(R2, h('div', '', 'shotlist.md'), 40, 32); css(r2h, 'font:700 30px Maple;white-space:nowrap');
  const r2s = put(R2, h('div', '', 'state list · 120 BPM · 8 beats'), 0, 38); css(r2s, `left:auto;right:40px;font:600 18px Geist;color:${COL.sub};white-space:nowrap`);
  const RL = put(R2, h('div', ''), 40, 92, 832, 1); css(RL, 'background:rgba(21,22,28,.08)');
  const BEATS = [['0.0s', 'Pill button, idle'], ['0.5s', 'Press: pill shrinks to a circle'], ['1.0s', 'Spinner turns'], ['1.5s', 'Check mark draws'], ['2.0s', 'Circle grows into an island'], ['2.5s', 'Player controls slide in'], ['3.0s', 'Progress bar fills'], ['3.5s', 'Everything settles · Done']];
  const brows = BEATS.map(([tm, d], i) => {
    const r = put(R2, h('div', ''), 40, 108 + i * 52, 832, 46); css(r, 'display:flex;align-items:center;gap:16px;border-radius:12px;padding:0 14px;white-space:nowrap');
    r.innerHTML = `<span style="flex:none;display:inline-flex;align-items:center;justify-content:center;width:44px;height:30px;border-radius:8px;background:#15161c;color:#fff;font:800 16px Geist">B${i + 1}</span><span class="mono" style="flex:none;width:62px;font:600 18px Maple;color:${COL.blue}">${tm}</span><span style="font:600 21px Geist">${d}</span>`;
    const tick = r.appendChild(h('span', '')); tick.style.cssText = `margin-left:auto;width:${18 + i * 22}px;height:8px;border-radius:4px;background:color-mix(in srgb,${COL.blue} 30%,#fff)`;
    return r;
  });
  const lockRow = put(R2, h('div', ''), 40, 536 + 14, 832, 88); css(lockRow, 'display:flex;align-items:center;gap:18px;border-radius:16px;background:#16171f;padding:0 24px;color:#fff;white-space:nowrap');
  lockRow.innerHTML = `<span style="width:40px;height:40px;display:block;flex:none;background:#fff;border-radius:50%">${IC.lock()}</span><span class="mono" style="font:600 22px Maple">frame(t) { … }</span><span style="margin-left:auto;font:600 20px Geist;color:#8b90a6">code waits for this list</span>`;
  const lockIc = lockRow.firstChild;

  ctx.cue(.1, 'swoosh', .45); LN.forEach((_, i) => ctx.cue(T.tmpl - .2 + i * .14, 'tick', .25)); ctx.cue(T.rules, 'pop', .5);
  ctx.cue(RIN, 'whoosh', .45); ctx.cue(T.target, 'tick', .4); ctx.cue(T.sum, 'pop', .5); ctx.cue(T.pure, 'swoosh', .4);
  ctx.cue(T.last, 'pop', .55); ctx.cue(T.show, 'type', .45); BEATS.forEach((_, i) => ctx.cue(T.show + .1 + i * .19, 'tick', .22)); ctx.cue(T.code - .05, 'click', .5);

  return (t) => {
    // ---- template
    enter(TW, t, .05, { dy: 50, rx: 10 }); TW.style.translate = `${(472 * (1 - E.io(P(t, RIN - .45, RIN + .35)))).toFixed(1)}px 0`;
    set(by, { o: A(t, T.tmpl - .1, .3), x: 12 * (1 - A(t, T.tmpl - .1, .5)) });
    const focus = t >= T.springs - .1 && t < T.last - .3 ? 4 : -1;
    lines.forEach(({ r, kk, vv }, i) => {
      const s = T.engine + .1 + i * .14; enter(r, t, s, { dy: 18, rx: 0, blur: 3 });
      const rule = i >= 3 && i <= 5, rk = rule ? A(t, T.rules, .4) : 0;
      const fk = focus === i ? A(t, T.springs - .1, .3) : 0;
      const dim = A(t, T.last - .2, .4) * .55 + (focus >= 0 && focus !== i ? .35 * A(t, T.springs - .1, .3) * (1 - A(t, T.last - .3, .3)) : 0);
      r.style.background = `rgba(139,92,246,${(.06 * rk + .1 * fk).toFixed(3)})`;
      r.style.boxShadow = fk > .01 ? `inset 0 0 0 ${(2.5 * fk).toFixed(2)}px rgba(139,92,246,.55)` : 'none';
      r.style.opacity = (A(t, s, .3) * (1 - dim)).toFixed(3);
      kk.style.color = rule && rk > .5 ? COL.violet : '#15161c';
    });
    set(brk, { sy: Math.max(.0001, A(t, T.rules, .5, E.io)), o: A(t, T.rules, .1) });
    const tk = SP(t, T.trick - .15, .7); set(trick, { s: lerp(.6, 1, tk), o: A(t, T.trick - .15, .15) * (1 - A(t, T.springs - .3, .3)) });
    enter(last, t, T.engine + .1 + 6 * .14, { dy: 18, rx: 0, blur: 3 });
    const lk = A(t, T.last - .1, .4);
    last.style.boxShadow = `inset 0 0 0 ${(2 + lk).toFixed(1)}px ${lk > .5 ? COL.violet : '#d9ccff'},0 ${(18 * lk).toFixed(1)}px 36px -16px rgba(139,92,246,.6)`;
    set(lastTag, { s: lerp(.5, 1, SP(t, T.last, .7)), o: A(t, T.last, .15) });
    if (t < T.show - .05) lastT.innerHTML = `<span style="color:#c9c1e6">${LAST.replace(/\S/g, '·').replace(/·+/g, m => '<span style="display:inline-block;width:' + (m.length * .5) + 'em;height:.32em;border-radius:.16em;background:#e2dbf7;vertical-align:middle"></span>')}</span>`;
    else { H.type(lastT, LAST, t, T.show - .05, 36, true); }
    // ---- right card
    enter(R, t, RIN, { dx: 60, dy: 20, rx: 0 });
    const sw = A(t, ROUT, .45, E.io);
    set(R1, { x: -40 * sw, o: 1 - sw, b: 6 * sw }); R1.style.display = sw >= 1 ? 'none' : 'block';
    set(R2, { x: 40 * (1 - A(t, ROUT + .15, .5, E.quart)), o: A(t, ROUT + .15, .35) }); R2.style.display = t >= ROUT + .1 ? 'block' : 'none';
    if (sw < 1) {
      set(rh, { o: A(t, RIN + .1, .3) }); set(nochip, { o: A(t, T.closed, .3), x: 10 * (1 - A(t, T.closed, .5)) });
      const n = t >= T.many + .2 ? 3 : t >= T.target + .1 ? 2 : 1;
      // target line (dashed step)
      let td = `M${X(0)} ${Y(0)} L${X(TG[0][0])} ${Y(0)}`, lev = 0;
      for (let i = 0; i < n; i++) { lev += TG[i][1]; td += ` L${X(TG[i][0])} ${Y(lev)} L${X(i + 1 < n ? TG[i + 1][0] : 6)} ${Y(lev)}`; }
      tg.setAttribute('d', td); tg.style.opacity = A(t, T.closed - .2, .4).toFixed(3);
      tLabs.forEach((e, i) => set(e, { o: i < n ? A(t, [T.closed - .2, T.target + .1, T.many + .2][i], .3) : 0 }));
      // ink: the summed curve drawn up to a reveal point
      const d1 = lerp(0, 2.4, A(t, T.closed, 1.2, E.io)), d2 = lerp(2.4, 4, A(t, T.target + .2, .9, E.io)), d3 = lerp(4, 6, A(t, T.many + .3, .9, E.io));
      const reach = t >= T.many + .3 ? d3 : t >= T.target + .2 ? d2 : d1;
      sm.setAttribute('d', path(tt => sumAt(tt), 0, reach));
      // components fade in on "sum of springs"
      comps.forEach((c, i) => { const k = A(t, T.sum - .1 + i * .18, .5, E.io); c.setAttribute('d', path(tt => comp(i, tt), TG[i][0], lerp(TG[i][0], 6, k))); c.style.opacity = (.85 * A(t, T.sum - .1 + i * .18, .2)).toFixed(3); c.setAttribute('stroke-dasharray', '2 7'); });
      // scrub on "pure function of time"
      const pk = A(t, T.pure - .1, .3), u = 3 + 2.6 * Math.sin((t - T.pure) * 1.5), vv = sumAt(u);
      phL.setAttribute('x1', X(u).toFixed(1)); phL.setAttribute('x2', X(u).toFixed(1)); phD.setAttribute('cx', X(u).toFixed(1)); phD.setAttribute('cy', Y(vv).toFixed(1));
      phL.style.opacity = phD.style.opacity = pk.toFixed(3);
      read.textContent = `x(${u.toFixed(2)}) = ${vv.toFixed(3)}`; set(read, { o: pk });
      enter(F, t, T.closed - .2, { dy: 24, rx: 0, blur: 3 });
      const fs = A(t, T.sum - .15, .35);
      set(f1, { o: 1 - fs, y: -10 * fs }); set(f1s, { o: (1 - fs) * A(t, T.closed + .3, .4) });
      set(f2, { o: fs, y: 10 * (1 - fs) });
      terms.forEach((e, i) => { const k = SP(t, T.sum + .1 + i * .18, .6); set(e, { y: 10 * (1 - k), o: A(t, T.sum + .1 + i * .18, .15) }); });
      const pc = SP(t, T.pure, .7); set(pureChip, { s: lerp(.6, 1, pc), o: A(t, T.pure, .15) });
    }
    if (t >= ROUT + .1) {
      set(r2h, { o: A(t, ROUT + .2, .3) }); set(r2s, { o: A(t, ROUT + .35, .3) }); set(RL, { o: A(t, ROUT + .3, .3) });
      brows.forEach((r, i) => { const s = T.show + .1 + i * .19; enter(r, t, ROUT + .35 + i * .05, { dx: 24, dy: 0, rx: 0, blur: 3 }); r.style.opacity = (A(t, ROUT + .35 + i * .05, .3) * lerp(.22, 1, A(t, s, .25))).toFixed(3); r.style.filter = `grayscale(${(1 - A(t, s, .25)).toFixed(2)})`; const on = Math.max(0, 1 - Math.abs(t - s - .15) / .3); r.style.background = `rgba(58,108,244,${(.09 * on + (t >= T.grid ? .03 : 0)).toFixed(3)})`; });
      enter(lockRow, t, T.before - .1, { dy: 20, rx: 0 });
      const sh = t > T.code - .05 && t < T.code + .45 ? Math.sin((t - T.code) * 40) * 6 * (1 - (t - T.code + .05) / .5) : 0;
      set(lockIc, { r: sh, s: 1 + .12 * Math.max(0, 1 - Math.abs(t - T.code) / .25) });
    }
  };
};
