// e08 — the fine print: /workspace files + logins survive updates & recovery; packages, apps, background services don't; sleeps when idle, may self-update first
SCENES.e08 = (root, ctx, H) => {
  const { put, h, set, enter, A, SP, E, P, lerp, cl, COL, IC, win } = H;
  const T = {
    fine: ctx.at('fine print'), files: ctx.at('Files'), ws: ctx.at('workspace'), log: ctx.at('logins'), surv: ctx.at('survive'), upd: ctx.at('updates'), rec: ctx.at('recovery'),
    inst: ctx.at('Installed'), pk: ctx.at('packages'), apps: ctx.at('apps'), svc: ctx.at('background'), dont: ctx.at("don't"),
    comp: ctx.at('The computer'), sleep: ctx.at('sleeps'), idle: ctx.at('idle'), self: ctx.at('update itself'), before: ctx.at('before'), does: ctx.at('does'),
  };
  const badge = (kind) => {
    const c = kind === 'ok' ? COL.green : COL.red;
    const d = kind === 'ok' ? ['M7 12.5l3.2 3.2L17 9'] : ['M8.2 8.2l7.6 7.6', 'M15.8 8.2l-7.6 7.6'];
    const el = h('div', '', `<svg viewBox="0 0 24 24" width="100%" height="100%" style="overflow:visible"><circle cx="12" cy="12" r="12" fill="${c}"/>${d.map(p => `<path d="${p}" stroke="#fff" stroke-width="2.8" fill="none" stroke-linecap="round" stroke-linejoin="round" pathLength="1" stroke-dasharray="1 1" stroke-dashoffset="1"/>`).join('')}</svg>`);
    const ps = [...el.querySelectorAll('path')];
    return { el, ps, upd(t, s) { const k = SP(t, s, .7); set(el, { s: lerp(.2, 1, k), o: A(t, s, .12) }); ps.forEach((p, i) => p.setAttribute('stroke-dashoffset', (1 - A(t, s + .08 + i * .08, .25, E.io)).toFixed(3))); } };
  };
  // ================= window
  const X0 = 88, Y0 = 222, WFULL = 1744, WCOMP = 1110, WH = 690;
  const wnd = put(root, win({ title: 'Cloud Computer · the fine print', tag: ' ' }), X0, Y0, WFULL, WH);
  wnd.querySelector('.wt').style.cssText += ';font:700 20px Geist';
  const tag = wnd.querySelector('.wtag'); tag.style.cssText = 'margin-left:auto;display:inline-flex;align-items:center;gap:8px;height:32px;padding:0 14px;border-radius:999px;font:700 17px Geist;white-space:nowrap';
  const B = wnd.body; B.style.cssText += 'position:absolute;left:0;top:46px;right:0;bottom:0;padding:0';
  // ---- green: survives
  const gp = put(B, h('div', ''), 26, 22, 0, 296); gp.style.cssText += 'border-radius:18px;background:#effaf5;box-shadow:inset 0 0 0 2px rgba(31,191,117,.45)';
  const gpHead = put(gp, h('div', ''), 26, 22); gpHead.style.cssText += 'display:flex;align-items:baseline;gap:16px;white-space:nowrap';
  gpHead.innerHTML = `<span style="font:800 30px Geist;letter-spacing:-.01em">Your data</span><span style="font:600 20px Geist;color:${COL.sub}">files in <b class="mono" style="font:700 20px Maple;color:#15161c">/workspace</b> + browser logins</span>`;
  const keep = put(gp, h('div', ''), 0, 18); keep.style.cssText += `display:flex;align-items:center;gap:10px;height:46px;padding:0 20px 0 8px;border-radius:999px;background:${COL.green};color:#fff;font:800 21px Geist;white-space:nowrap;box-shadow:0 10px 20px -10px rgba(31,191,117,.8)`;
  const kb = badge('ok'); kb.el.style.cssText += 'width:32px;height:32px;position:relative'; keep.appendChild(kb.el); keep.appendChild(h('span', '', 'Survives'));
  kb.el.querySelector('circle').setAttribute('fill', '#fff'); kb.ps.forEach(p => p.setAttribute('stroke', COL.green));
  const FOL = [['folder', 'studio/', '#f5c451'], ['folder', 'frames/', '#7cc4ff'], ['file', 'spec.md', '#dfe3ee'], ['file', 'bootstrap.sh', '#d9e3ff']];
  const folders = FOL.map(([ic, nm, c], i) => {
    const e = put(gp, h('div', ''), 26 + i * 174, 92, 160, 176);
    e.style.cssText += 'border-radius:16px;background:#fff;box-shadow:0 0 0 1px rgba(21,22,28,.06),0 10px 22px -12px rgba(30,34,70,.3);display:flex;flex-direction:column;justify-content:center;gap:14px;padding:0 18px';
    e.innerHTML = `<span style="width:50px;height:50px;display:block">${IC[ic](c)}</span><span class="mono" style="font:700 20px Maple;white-space:nowrap">${nm}</span>`;
    return e;
  });
  const lg = put(gp, h('div', ''), 26 + 4 * 174, 92, 300, 176);
  lg.style.cssText += 'border-radius:16px;background:#fff;box-shadow:0 0 0 1px rgba(21,22,28,.06),0 10px 22px -12px rgba(30,34,70,.3);padding:20px 20px';
  lg.innerHTML = `<div style="display:flex;align-items:center;gap:12px"><span style="width:44px;height:44px;border-radius:13px;background:${COL.blue};display:flex;align-items:center;justify-content:center"><svg width="26" height="26" viewBox="0 0 24 24"><rect x="5" y="10.5" width="14" height="10" rx="2.5" fill="#fff"/><path d="M8.2 10.5V8a3.8 3.8 0 017.6 0v2.5" stroke="#fff" stroke-width="2.2" fill="none"/></svg></span><span style="font:800 24px Geist">Browser logins</span></div>` +
    ['x.com', 'github.com', 'gmail.com'].map(s => `<div class="st" style="display:flex;align-items:center;gap:8px;margin-top:9px;font:500 20px Maple"><i style="width:9px;height:9px;border-radius:50%;background:${COL.green};display:block"></i>${s}</div>`).join('');
  const lgRows = [...lg.querySelectorAll('.st')];
  // ---- grey: doesn't survive
  const sp = put(B, h('div', ''), 26, 344, 0, 214); sp.style.cssText += 'border-radius:18px;background:#f7f8fb;box-shadow:inset 0 0 0 1px rgba(21,22,28,.08)';
  const spHead = put(sp, h('div', ''), 26, 22); spHead.style.cssText += 'display:flex;align-items:baseline;gap:16px;white-space:nowrap';
  spHead.innerHTML = `<span style="font:800 30px Geist;letter-spacing:-.01em">Installed software</span><span style="font:600 20px Geist;color:${COL.sub}">outside /workspace</span>`;
  const lost = put(sp, h('div', ''), 0, 18); lost.style.cssText += `display:flex;align-items:center;gap:10px;height:46px;padding:0 20px 0 8px;border-radius:999px;background:rgba(240,68,58,.1);color:${COL.red};font:800 21px Geist;white-space:nowrap`;
  const lb = badge('x'); lb.el.style.cssText += 'width:32px;height:32px;position:relative'; lost.appendChild(lb.el); lost.appendChild(h('span', '', "Doesn't survive"));
  const SOFT = [['Packages', 'apt · pip · npm', T.pk], ['Apps', 'Chromium · Blender', T.apps], ['Background services', 'render-daemon', T.svc]];
  const softs = SOFT.map(([nm, sub, at], i) => {
    const e = put(sp, h('div', ''), 26, 96, 0, 92);
    e.style.cssText += 'border-radius:14px;background:#fff;display:flex;flex-direction:column;justify-content:center;gap:4px;padding:0 22px;box-shadow:0 0 0 1px rgba(21,22,28,.08),0 8px 18px -10px rgba(30,34,70,.25)';
    e.innerHTML = `<span style="font:800 24px Geist;white-space:nowrap">${nm}</span><span class="mono" style="font:500 19px Maple;color:${COL.sub};white-space:nowrap">${sub}</span>`;
    const g = put(sp, h('div', ''), 26, 96, 0, 92); g.style.cssText += 'border-radius:14px;border:2.5px dashed rgba(240,68,58,.6)';
    const x = badge('x'); put(sp, x.el, 0, 80, 36, 36);
    return { e, g, x, at, i };
  });
  // ---- bottom rule-of-thumb bar
  const rule = put(B, h('div', ''), 26, 574, 0, 62); rule.style.cssText += 'display:flex;align-items:center;gap:16px;padding:0 24px;border-radius:16px;background:#15161c;color:#fff;font:700 23px Geist;white-space:nowrap;overflow:hidden';
  rule.innerHTML = `<span style="font:800 16px Geist;letter-spacing:.14em;color:#ffd66b">RULE</span><span>If it lives in <b class="mono" style="font:700 22px Maple;color:#7ee0b8">/workspace</b>, it stays. Anything you install, script it.</span>`;
  // opening: a page of fine print under a magnifier
  const fp = put(B, h('div', ''), 0, 0, WFULL, 640);
  const fpLines = [...Array(9)].map((_, i) => { const e = put(fp, h('div', ''), 120, 70 + i * 54, [1180, 1320, 980, 1260, 1100, 1340, 900, 1220, 760][i], 12); e.style.cssText += 'border-radius:6px;background:#e8eaf0'; return e; });
  const lens = put(fp, h('div', ''), 0, 0, 230, 230); lens.style.cssText += 'border-radius:50%;background:rgba(255,255,255,.75);box-shadow:inset 0 0 0 7px #15161c,0 18px 40px -12px rgba(20,24,60,.35);display:flex;align-items:center;justify-content:center;font:800 30px Geist;white-space:nowrap';
  lens.innerHTML = '<span>fine print</span>';
  const handle = put(lens, h('div', ''), 196, 190, 90, 22); handle.style.cssText += 'border-radius:11px;background:#15161c;transform:rotate(45deg);transform-origin:0 50%';
  // update sweep + sleep tint
  const sweep = put(B, h('div', ''), 0, 0, 0, 140); sweep.style.cssText += 'background:linear-gradient(180deg,rgba(58,108,244,0),rgba(58,108,244,.14) 70%,rgba(58,108,244,.5) 100%);pointer-events:none';
  const tint = put(wnd, h('div', ''), 0, 0, WFULL, WH); tint.style.cssText += 'background:rgba(24,30,72,.22);pointer-events:none;border-radius:20px';

  // ================= right: power card
  const RX = 1230, RW = 602;
  const pc = put(root, H.card({ w: RW, h: WH }), RX, Y0);
  const ph = put(pc, h('div', ''), 30, 28); ph.style.cssText += 'display:flex;align-items:center;gap:16px;white-space:nowrap';
  ph.innerHTML = `<span style="width:60px;height:60px;border-radius:18px;background:#1d2552;display:flex;align-items:center;justify-content:center"><span style="width:36px;height:36px;display:block">${IC.moon()}</span></span><span><div style="font:800 32px Geist;letter-spacing:-.015em">Sleeps when idle</div><div style="font:600 20px Geist;color:${COL.sub};margin-top:2px">and may update itself first</div></span>`;
  put(pc, h('div', ''), 30, 118, RW - 60, 1).style.background = 'rgba(21,22,28,.08)';
  const STEPS = [
    ['Working', 'bots busy · render running', COL.green, T.comp + .2],
    ['Idle', 'nothing queued', '#9aa0b4', T.idle],
    ['Self-update', 'may install updates', COL.amber, T.self],
    ['Asleep', 'until something wakes it', '#5a5cf0', T.does - .1],
  ];
  const SY0 = 150, SDY = 118;
  const rail = put(pc, h('div', ''), 59, SY0 + 22, 4, SDY * 3); rail.style.cssText += 'border-radius:2px;background:#eceef4';
  const railF = put(rail, h('div', ''), 0, 0, 4, 0); railF.style.cssText += 'border-radius:2px;background:#5a5cf0';
  const steps = STEPS.map(([nm, sub, c, at], i) => {
    const y = SY0 + i * SDY;
    const row = put(pc, h('div', ''), 92, y - 8, RW - 122, 74); row.style.cssText += 'border-radius:16px';
    const dot = put(pc, h('div', ''), 61 - 16, y + 6, 32, 32); dot.style.cssText += `border-radius:50%;background:#fff;box-shadow:0 0 0 3px #e3e5ec`;
    const core = put(dot, h('div', ''), 8, 8, 16, 16); core.style.cssText += `border-radius:50%;background:${c}`;
    const tx = put(pc, h('div', '', `<div style="font:800 27px Geist;letter-spacing:-.01em">${nm}</div><div style="font:600 20px Geist;color:${COL.sub};margin-top:2px">${sub}</div>`), 112, y);
    const ic = put(pc, h('div', ''), RW - 92, y + 2, 44, 44);
    return { row, dot, core, tx, ic, c, at, i };
  });
  // step icons: spinner / clock / update arrows / moon
  steps[0].ic.innerHTML = `<div style="width:30px;height:30px;margin:7px;border-radius:50%;border:3.5px solid rgba(31,191,117,.2);border-top-color:#1fbf75"></div>`;
  steps[1].ic.innerHTML = `<svg viewBox="0 0 24 24" width="44" height="44"><circle cx="12" cy="12" r="9" fill="none" stroke="#9aa0b4" stroke-width="2"/><path class="hd" d="M12 12V6.5" stroke="#9aa0b4" stroke-width="2" stroke-linecap="round"/></svg>`;
  steps[2].ic.innerHTML = `<svg viewBox="0 0 24 24" width="44" height="44"><path d="M17.5 8.5A6.5 6.5 0 0 0 6 9.5M6.5 15.5A6.5 6.5 0 0 0 18 14.5" stroke="${COL.amber}" stroke-width="2.2" fill="none" stroke-linecap="round"/><path d="M18 4.5v4h-4M6 19.5v-4h4" stroke="${COL.amber}" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  steps[3].ic.innerHTML = `<span style="width:40px;height:40px;display:block;margin:2px">${IC.moon()}</span>`;
  const spin0 = steps[0].ic.firstChild, hand = steps[1].ic.querySelector('.hd'), upIc = steps[2].ic.firstChild;
  // consequence chips
  const cons = put(pc, h('div', ''), 30, 616, RW - 60, 46); cons.style.cssText += 'display:flex;gap:12px';
  const cc = ['installs can vanish', 'renders get cut off'].map(s => { const e = cons.appendChild(h('span', '', s)); e.style.cssText = `display:inline-flex;align-items:center;height:44px;padding:0 18px;border-radius:999px;background:rgba(240,68,58,.1);color:${COL.red};font:800 20px Geist;white-space:nowrap`; return e; });

  // cues
  ctx.cue(.1, 'whoosh', .45); ctx.cue(T.files, 'pop', .45); ctx.cue(T.log, 'pop', .4); ctx.cue(T.surv + .1, 'ding', .5); ctx.cue(T.upd, 'swoosh', .4);
  softs.forEach(s => ctx.cue(s.at, 'tick', .4)); softs.forEach((s, i) => ctx.cue(T.dont + .05 + i * .12, 'error', .3));
  ctx.cue(T.comp - .1, 'whoosh', .45); steps.forEach((s, i) => i && ctx.cue(s.at, 'tick', .45));

  const tCmp = T.comp - .3;
  return (t) => {
    enter(wnd, t, .08, { dy: 60, rx: 10 });
    const ck = A(t, tCmp, .7, E.io), Wd = lerp(WFULL, WCOMP, ck);
    wnd.style.width = Wd.toFixed(1) + 'px'; tint.style.width = Wd.toFixed(1) + 'px';
    const inner = Wd - 52;
    gp.style.width = sp.style.width = rule.style.width = inner.toFixed(1) + 'px'; sweep.style.width = Wd.toFixed(1) + 'px';
    keep.style.left = (inner - 26 - 166).toFixed(1) + 'px'; lost.style.left = (inner - 26 - 228).toFixed(1) + 'px';
    // tag
    let tg = 'Docs', tb = '#f1f2f6', tc = COL.sub;
    if (t >= T.upd && t < T.rec) { tg = '↻ Updating…'; tb = 'rgba(58,108,244,.12)'; tc = COL.blue; }
    else if (t >= T.rec && t < T.rec + .9) { tg = '↻ Recovering…'; tb = 'rgba(58,108,244,.12)'; tc = COL.blue; }
    else if (t >= T.rec + .9 && t < T.comp) { tg = '✓ Recovered'; tb = 'rgba(31,191,117,.14)'; tc = '#14855f'; }
    else if (t >= T.comp && t < T.does) { tg = '● Running'; tb = 'rgba(31,191,117,.14)'; tc = '#14855f'; }
    else if (t >= T.does) { tg = '☾ Asleep'; tb = '#1d2552'; tc = '#ffd66b'; }
    if (tag.textContent !== tg) tag.textContent = tg; tag.style.background = tb; tag.style.color = tc;
    { const out = A(t, T.files - .6, .4); set(fp, { o: A(t, .3, .4) * (1 - out) }); fpLines.forEach((e, i) => { e.style.transform = `scaleX(${A(t, .25 + i * .05, .6, E.io).toFixed(3)})`; e.style.transformOrigin = 'left'; });
      const lp = E.io(P(t, .4, T.files - .4)); set(lens, { x: lerp(260, 1140, lp), y: 120 + 60 * Math.sin(lp * Math.PI), s: lerp(.7, 1, SP(t, .35, .8)), o: A(t, .35, .2) }); }
    // green panel
    enter(gp, t, T.files - .45, { dy: 30, rx: 0, blur: 4 });
    set(gpHead, { o: A(t, T.files - .2, .3), x: -12 * (1 - A(t, T.files - .2, .5)) });
    folders.forEach((f, i) => { const s = T.ws - .35 + i * .09, k = SP(t, s, .8); set(f, { y: 30 * (1 - k), s: lerp(.85, 1, k), o: A(t, s, .15) }); });
    { const s = T.log - .1, k = SP(t, s, .8); set(lg, { y: 30 * (1 - k), s: lerp(.85, 1, k), o: A(t, s, .15) }); lgRows.forEach((r, j) => set(r, { o: A(t, s + .25 + j * .1, .2), x: -8 * (1 - A(t, s + .25 + j * .1, .3)) })); }
    const kk = SP(t, T.surv, .8); set(keep, { s: lerp(.6, 1, kk), o: A(t, T.surv, .15) }); kb.upd(t, T.surv + .05);
    // sweep (update then recovery)
    const sw = (s) => lerp(-140, WH, E.io(P(t, s, s + .8)));
    const inA = t > T.upd && t < T.upd + .85, inB = t > T.rec + .05 && t < T.rec + .9;
    set(sweep, { y: inA ? sw(T.upd) : inB ? sw(T.rec + .05) : 0, o: inA || inB ? 1 : 0 });
    const pulse = Math.max(0, 1 - Math.abs(t - (T.upd + .25)) / .25) + Math.max(0, 1 - Math.abs(t - (T.rec + .3)) / .25);
    gp.style.boxShadow = `inset 0 0 0 2px rgba(31,191,117,.45), 0 0 0 ${(7 * pulse).toFixed(2)}px rgba(31,191,117,${(.25 * pulse).toFixed(3)})`;
    // grey panel
    enter(sp, t, T.inst - .35, { dy: 30, rx: 0, blur: 4 });
    set(spHead, { o: A(t, T.inst - .15, .3), x: -12 * (1 - A(t, T.inst - .15, .5)) });
    const iw = (inner - 52 - 2 * 16) / 3;
    softs.forEach(({ e, g, x, at, i }) => {
      const lx = 26 + i * (iw + 16);
      e.style.left = g.style.left = lx.toFixed(1) + 'px'; e.style.width = g.style.width = iw.toFixed(1) + 'px'; x.el.style.left = (lx + iw - 22).toFixed(1) + 'px';
      const s = at - .1, k = SP(t, s, .8), gone = A(t, T.dont + .05 + i * .12, .35);
      set(e, { y: 16 * (1 - k) + 5 * gone, s: lerp(.9, 1, k) * (1 - .03 * gone), o: A(t, s, .15) * (1 - .6 * gone) });
      e.style.filter = gone > 0 ? `grayscale(${gone.toFixed(2)})` : 'none';
      set(g, { o: gone }); x.upd(t, T.dont + .1 + i * .12);
    });
    const lk = SP(t, T.dont, .7); set(lost, { s: lerp(.7, 1, lk), o: A(t, T.dont, .15) }); lb.upd(t, T.dont + .05);
    enter(rule, t, T.dont + .6, { dy: 20, rx: 0, blur: 3 });
    tint.style.opacity = (A(t, T.does - .1, .6) * .9).toFixed(3);
    // power card
    enter(pc, t, T.comp - .15, { dx: 100, dy: 0, rx: 0, s0: .95 });
    let cur = -1; steps.forEach((s, i) => { if (t >= s.at) cur = i; });
    railF.style.height = (SDY * 3 * cl(steps.reduce((a, s, i) => i ? a + A(t, s.at - .35, .4, E.io) / 3 : a, 0))).toFixed(1) + 'px';
    steps.forEach((s, i) => {
      const on = A(t, s.at - .1, .35), act = i === cur ? 1 : 0;
      set(s.tx, { o: lerp(.3, 1, on), x: 10 * (1 - A(t, s.at - .1, .5)) });
      set(s.ic, { o: lerp(.15, 1, on) * (i === cur ? 1 : .55) });
      s.dot.style.boxShadow = `0 0 0 3px ${on > .5 ? s.c : '#e3e5ec'}${act ? `,0 0 0 ${(6 + 4 * Math.sin(t * 5)).toFixed(1)}px color-mix(in srgb,${s.c} 22%,transparent)` : ''}`;
      set(s.core, { s: lerp(.2, 1, SP(t, s.at, .6)), o: on });
      s.row.style.background = act ? `color-mix(in srgb,${s.c} 9%,#fff)` : 'transparent';
    });
    set(spin0, { r: t * 420 * (cur === 0 ? 1 : .15) });
    hand.setAttribute('transform', `rotate(${(t * 90).toFixed(1)} 12 12)`);
    set(upIc, { r: cur === 2 ? (t - T.self) * 260 : 0 });
    cc.forEach((e, i) => { const s = [T.self + .35, T.does][i], k = SP(t, s, .7); set(e, { s: lerp(.6, 1, k), y: 10 * (1 - k), o: A(t, s, .15) }); });
  };
};
