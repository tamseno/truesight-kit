// e11 — write the studio rules once as a skill (private library shared by all bots), then the house style: pure f(t), fonts from files, something new every 2–4 s
SCENES.e11 = (root, ctx, H) => {
  const { put, h, set, enter, A, SP, E, P, lerp, cl, COL, bot, BOTS, BOT_ORDER, IC, rnd } = H;
  const T = {
    next: ctx.at('Next'), write: ctx.at('write'), rules: ctx.at('rules'), once: ctx.at('once'), skill: ctx.at('skill'), priv: ctx.at('Private'), lib: ctx.at('library'),
    shared: ctx.at('shared'), all: ctx.at('all your bots'), house: ctx.at('house'), r1: ctx.at('every frame'), pure: ctx.at('pure'), r2: ctx.at('fonts'), files: ctx.at('files'),
    r3: ctx.at('something'), sec: ctx.at('two'),
  };
  const V = COL.violet;
  const tM = T.house - .45, MD = .85; // morph
  // ================= phase 1
  const CX = 960, CY = 548, CW = 560, CH = 300, cx0 = CX - CW / 2, cy0 = CY - CH / 2;
  const glow = put(root, h('div', ''), CX - 420, CY - 300, 840, 600); glow.style.cssText += 'border-radius:50%;background:radial-gradient(closest-side,rgba(139,92,246,.22),rgba(139,92,246,0))';
  const svg = put(root, document.createElementNS('http://www.w3.org/2000/svg', 'svg'), 0, 0, 1920, 1080);
  svg.setAttribute('viewBox', '0 0 1920 1080'); svg.style.overflow = 'visible';
  // library: ghost skill cards behind
  const ghosts = ['critic-rubric', 'render-pipeline'].map((nm, i) => {
    const g = put(root, H.card({ w: CW - 40, h: CH - 30 }), cx0 + 20, cy0 + 15);
    g.innerHTML = `<div style="position:absolute;left:28px;top:24px;display:flex;align-items:center;gap:12px"><span style="width:44px;height:44px;border-radius:13px;background:${i ? '#5a5cf0' : '#b9a3f7'};display:block"></span><span class="mono" style="font:600 21px Maple;color:${COL.sub}">${nm} / SKILL.md</span></div>`;
    return g;
  });
  const card = put(root, H.card({ w: CW, h: CH }), cx0, cy0);
  const P1 = put(card, h('div', ''), 0, 0, CW, CH);
  const tile = put(P1, h('div', '', `<svg width="34" height="34" viewBox="0 0 24 24"><path d="M6 2.5h8l5 5v14H6z" fill="#fff"/><path d="M14 2.5v5h5" fill="rgba(0,0,0,.15)"/><path d="M9 12h7M9 15.5h7M9 19h4" stroke="${V}" stroke-width="1.8" stroke-linecap="round"/></svg>`), 30, 28, 64, 64);
  tile.style.cssText += `border-radius:18px;background:${V};display:flex;align-items:center;justify-content:center;box-shadow:0 10px 20px -8px rgba(139,92,246,.7)`;
  const ttl = put(P1, h('div', '', 'Studio rules'), 112, 24); ttl.style.cssText += 'font:800 38px Geist;letter-spacing:-.02em;white-space:nowrap';
  const fname = put(P1, h('div', 'mono', 'house-style / SKILL.md'), 114, 74); fname.style.cssText += `font:500 19px Maple;color:${COL.sub}`;
  const stamp = put(P1, h('div', '', 'SKILL'), 0, 34); stamp.style.cssText += `left:auto;right:28px;display:inline-flex;align-items:center;height:36px;padding:0 14px;border-radius:10px;background:rgba(139,92,246,.12);color:${V};font:800 18px Geist;letter-spacing:.12em;box-shadow:inset 0 0 0 2px rgba(139,92,246,.5)`;
  const chipRow = put(P1, h('div', ''), 30, 120); chipRow.style.cssText += 'display:flex;gap:10px';
  const cPriv = chipRow.appendChild(h('span', '', `<span style="width:22px;height:22px;display:block">${IC.lock()}</span>Private`)); cPriv.style.cssText = 'display:inline-flex;align-items:center;gap:8px;height:38px;padding:0 16px 0 9px;border-radius:999px;background:#15161c;color:#fff;font:700 19px Geist';
  const cLib = chipRow.appendChild(h('span', '', 'one library · every bot')); cLib.style.cssText = `display:inline-flex;align-items:center;height:38px;padding:0 16px;border-radius:999px;background:rgba(139,92,246,.12);color:${V};font:700 19px Geist`;
  const pre = ['every frame = f(t)', 'fonts load from files', 'something new every 2–4 s'].map((tx, i) => {
    const e = put(P1, h('div', '', `<i style="display:inline-block;width:8px;height:8px;border-radius:2px;background:${V};margin-right:14px;vertical-align:4px"></i>${tx}`), 34, 184 + i * 36);
    e.style.cssText += 'font:600 21px Geist;color:#2a2c36;white-space:nowrap'; return e;
  });
  // bots around
  const POS = { director: [390, 350, 'L'], animator: [390, 750, 'L'], render: [1530, 350, 'R'], critic: [1530, 750, 'R'], delivery: [960, 826, 'B'] };
  const BS = 108;
  // phase-2 avatar targets (doc header, top-right)
  const DX = 88, DY = 222, DW = 1744, DH = 690;
  const AV = BOT_ORDER.map((k, i) => [DX + DW - 52 - (4 - i) * 50, DY + 54]);
  const nodes = BOT_ORDER.map((k, i) => {
    const [x, y, side] = POS[k], b = bot(k, BS);
    const wrap = put(root, h('div', ''), x - BS / 2, y - BS / 2, BS, BS); wrap.appendChild(b.el); wrap.style.zIndex = 4;
    const ring = put(root, h('div', ''), x - BS / 2 - 12, y - BS / 2 - 10, BS + 24, BS + 24); ring.style.cssText += `border-radius:50%;box-shadow:0 0 0 3px ${BOTS[k].c}`;
    const lab = put(root, h('div', '', `<div style="font:800 28px Geist">${BOTS[k].name}</div>`), 0, 0, 200);
    if (side === 'L') { lab.style.left = (x - BS / 2 - 222) + 'px'; lab.style.top = (y - 18) + 'px'; lab.style.textAlign = 'right'; }
    else { lab.style.left = (x + BS / 2 + 22) + 'px'; lab.style.top = (y - 18) + 'px'; }
    const sk = put(root, h('div', '', `<span style="display:inline-block;width:8px;height:8px;border-radius:2px;background:#fff;margin-right:8px"></span>house-style`), 0, 0);
    sk.style.cssText += `display:inline-flex;align-items:center;height:32px;padding:0 13px;border-radius:999px;background:${V};color:#fff;font:700 17px Geist;white-space:nowrap;box-shadow:0 8px 16px -8px rgba(139,92,246,.8)`;
    sk.style.left = (x - 64) + 'px'; sk.style.top = (y + BS / 2 + 8) + 'px';
    if (side === 'B') { sk.style.left = (x - BS / 2 - 160) + 'px'; sk.style.top = (y - 16) + 'px'; }
    let p0, p3, c1, c2;
    if (side === 'L') { p0 = [cx0, CY + (y < CY ? -70 : 70)]; p3 = [x + BS / 2 + 14, y]; c1 = [p0[0] - 160, p0[1]]; c2 = [p3[0] + 160, p3[1]]; }
    else if (side === 'R') { p0 = [cx0 + CW, CY + (y < CY ? -70 : 70)]; p3 = [x - BS / 2 - 14, y]; c1 = [p0[0] + 160, p0[1]]; c2 = [p3[0] - 160, p3[1]]; }
    else { p0 = [CX, cy0 + CH]; p3 = [x, y - BS / 2 - 12]; c1 = [CX, p0[1] + 30]; c2 = [x, p3[1] - 30]; }
    const base = document.createElementNS('http://www.w3.org/2000/svg', 'path'); base.setAttribute('d', `M${p0} C${c1} ${c2} ${p3}`); base.setAttribute('fill', 'none'); base.setAttribute('stroke', BOTS[k].c); base.setAttribute('stroke-width', '3.5'); base.setAttribute('stroke-linecap', 'round'); base.setAttribute('pathLength', '1'); base.setAttribute('stroke-dasharray', '1 1');
    svg.appendChild(base);
    const end = document.createElementNS('http://www.w3.org/2000/svg', 'circle'); end.setAttribute('r', '7'); end.setAttribute('fill', '#fff'); end.setAttribute('stroke', BOTS[k].c); end.setAttribute('stroke-width', '3.5'); end.setAttribute('cx', p0[0]); end.setAttribute('cy', p0[1]); svg.appendChild(end);
    const pulses = [0, 1].map(() => { const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle'); c.setAttribute('r', '6.5'); c.setAttribute('fill', BOTS[k].c); svg.appendChild(c); return c; });
    const bz = (u) => { const m = 1 - u; return [0, 1].map(j => m * m * m * p0[j] + 3 * m * m * u * c1[j] + 3 * m * u * u * c2[j] + u * u * u * p3[j]); };
    return { k, b, wrap, ring, lab, sk, base, end, pulses, bz, i, side, x, y, av: AV[i] };
  });
  // ================= phase 2 (inside the morphed card, doc coordinates)
  const P2 = put(card, h('div', ''), 0, 0, DW, DH);
  const dh = put(P2, h('div', ''), 34, 28, 1200, 60); dh.style.cssText += 'display:flex;align-items:center;gap:16px;white-space:nowrap';
  dh.innerHTML = `<span style="width:56px;height:56px;border-radius:16px;background:${V};display:flex;align-items:center;justify-content:center"><svg width="30" height="30" viewBox="0 0 24 24"><path d="M6 2.5h8l5 5v14H6z" fill="#fff"/><path d="M9 12h7M9 15.5h7M9 19h4" stroke="${V}" stroke-width="1.8" stroke-linecap="round"/></svg></span><span style="font:700 32px Maple">house-style</span><span style="display:inline-flex;align-items:center;height:32px;padding:0 12px;border-radius:9px;background:rgba(139,92,246,.12);color:${V};font:800 16px Geist;letter-spacing:.12em">SKILL</span><span style="font:600 21px Geist;color:${COL.sub};margin-left:10px">the house style says…</span>`;
  const shr = put(P2, h('div', '', 'Private · shared by all 5 bots'), 0, 40); shr.style.cssText += `left:auto;right:${52 + 4 * 50 + 46}px;font:700 20px Geist;color:${COL.sub};white-space:nowrap`;
  put(P2, h('div', ''), 34, 112, DW - 68, 1).style.background = 'rgba(21,22,28,.08)';
  const RULES = [
    ['Every frame is a pure function of time', 'render(t) → same pixels, in any order', T.r1],
    ['Fonts load from files', 'web/fonts/*.woff2 · never a CDN', T.r2],
    ['Something new every 2–4 seconds', 'no frame just sits there', T.r3],
  ];
  const RW = DW - 44, DEMX = 1060, DEMW = 620;
  const rules = RULES.map(([tx, sub, at], i) => {
    const r = put(P2, h('div', ''), 22, 130 + i * 184, RW, 168); r.style.cssText += 'border-radius:18px';
    const bar = put(r, h('div', ''), 0, 28, 6, 112); bar.style.cssText += `border-radius:3px;background:${V};transform-origin:center top`;
    put(r, h('div', 'mono', `0${i + 1}`), 28, 34).style.cssText += `font:700 30px Maple;color:${V}`;
    const z = put(r, h('div', '', tx), 96, 30); z.style.cssText += 'font:800 38px Geist;letter-spacing:-.02em;white-space:nowrap;background:linear-gradient(transparent 64%,rgba(139,92,246,.22) 64%) no-repeat;background-size:0% 100%';
    put(r, h('div', 'mono', sub), 98, 94).style.cssText += `font:500 21px Maple;color:${COL.sub};white-space:nowrap`;
    const demo = put(r, h('div', ''), DEMX, 14, DEMW, 140); demo.style.cssText += 'border-radius:16px;background:#f6f7fb;box-shadow:inset 0 0 0 1px rgba(21,22,28,.06);overflow:hidden';
    return { r, bar, z, demo, at, i };
  });
  // demo 1: scrubber jumping to shuffled times; ball = f(t)
  const D1 = rules[0].demo;
  const tr1 = put(D1, h('div', ''), 26, 96, 330, 6); tr1.style.cssText += 'border-radius:3px;background:#e3e5ee';
  const kn1 = put(D1, h('div', ''), 0, 87, 24, 24); kn1.style.cssText += `border-radius:50%;background:#fff;box-shadow:0 0 0 4px ${V},0 6px 12px rgba(30,34,70,.25)`;
  const tl1 = put(D1, h('div', 'mono', ''), 26, 26); tl1.style.cssText += 'font:700 28px Maple';
  const st1 = put(D1, h('div', ''), 390, 18, 210, 104); st1.style.cssText += 'border-radius:12px;background:#fff;box-shadow:0 0 0 1px rgba(21,22,28,.07)';
  const ball = put(st1, h('div', ''), 0, 0, 34, 34); ball.style.cssText += `border-radius:50%;background:${COL.blue}`;
  const fchip = put(st1, h('div', 'mono', ''), 8, 74); fchip.style.cssText += `font:600 16px Maple;color:${COL.sub}`;
  const ck1 = put(st1, h('div', '', IC.check()), 176, 72, 24, 24);
  const SEEK = [3.2, .85, 7.4, 1.95, 5.6, .3, 6.8, 2.7, 4.4];
  // demo 2: fonts
  const D2 = rules[1].demo;
  const gl2 = put(D2, h('div', '', `<span style="font:800 64px Geist;letter-spacing:-.04em">Aa</span><span style="font:700 56px Maple;color:${V};margin-left:14px">Aa</span>`), 26, 26); gl2.style.cssText += 'white-space:nowrap';
  const fOk = put(D2, h('div', ''), 250, 20, 350, 46); fOk.style.cssText += 'border-radius:12px;background:rgba(31,191,117,.1);display:flex;align-items:center;gap:10px;padding:0 14px;white-space:nowrap';
  fOk.innerHTML = `<span style="width:24px;height:24px;display:block">${IC.check()}</span><span class="mono" style="font:600 19px Maple">fonts/Geist.woff2</span><span style="margin-left:auto;font:800 17px Geist;color:${COL.green}">local</span>`;
  const fNo = put(D2, h('div', ''), 250, 76, 350, 46); fNo.style.cssText += 'border-radius:12px;background:rgba(240,68,58,.07);display:flex;align-items:center;gap:10px;padding:0 14px;white-space:nowrap';
  fNo.innerHTML = `<span style="width:24px;height:24px;display:block">${IC.x()}</span><span class="mono strike" style="font:600 19px Maple;color:${COL.sub}">fonts.googleapis.com</span>`;
  const fNoS = fNo.querySelector('.strike');
  // demo 3: beat timeline
  const D3 = rules[2].demo;
  const MK = [0, 2.6, 5.4, 8.2, 10.8], MC = [V, COL.amber, COL.mint, COL.blue, '#ff7a9a'];
  const TLX = 30, TLW = 560;
  const ax = put(D3, h('div', ''), TLX, 84, TLW, 4); ax.style.cssText += 'border-radius:2px;background:#e3e5ee';
  const things = MK.map((m, i) => { const e = put(D3, h('div', ''), TLX + m / 12 * TLW - 18, 16, 36, 36); e.style.cssText += `border-radius:${i % 2 ? 10 : 18}px;background:${MC[i]};box-shadow:0 8px 14px -8px ${MC[i]}`; return e; });
  const marks = MK.map((m, i) => { const e = put(D3, h('div', ''), TLX + m / 12 * TLW - 8, 78, 16, 16); e.style.cssText += `border-radius:50%;background:#fff;box-shadow:0 0 0 4px ${MC[i]}`; return e; });
  const head3 = put(D3, h('div', ''), 0, 60, 3, 52); head3.style.cssText += `background:${COL.ink};border-radius:2px`;
  const brk = put(D3, h('div', ''), TLX + MK[1] / 12 * TLW, 98, (MK[2] - MK[1]) / 12 * TLW, 12); brk.style.cssText += `border:3px solid ${V};border-top:none;border-radius:0 0 8px 8px`;
  const brkL = put(D3, h('div', '', '2–4 s'), TLX + (MK[1] + MK[2]) / 24 * TLW - 40, 112, 80); brkL.style.cssText += `text-align:center;font:800 19px Geist;color:${V};white-space:nowrap`;

  // cues
  ctx.cue(.1, 'whoosh', .45); ctx.cue(T.skill, 'pop', .6); ctx.cue(T.priv, 'tick', .4); ctx.cue(T.lib, 'swoosh', .4);
  nodes.forEach((n, i) => ctx.cue(T.shared + .2 + i * .12, 'tick', .3));
  ctx.cue(tM, 'whoosh', .5); rules.forEach(r => ctx.cue(r.at - .05, 'pop', .5));

  return (t) => {
    const mk = E.io(P(t, tM, tM + MD));
    // ---- card / morph
    const ek = SP(t, .1, 1); const k2 = A(t, .1, .35, E.quart);
    const L = lerp(cx0, DX, mk), Tp = lerp(cy0, DY, mk), Wd = lerp(CW, DW, mk), Ht = lerp(CH, DH, mk);
    card.style.left = L.toFixed(1) + 'px'; card.style.top = Tp.toFixed(1) + 'px'; card.style.width = Wd.toFixed(1) + 'px'; card.style.height = Ht.toFixed(1) + 'px';
    set(card, { y: 60 * (1 - ek), s: lerp(.9, 1, ek), rx: 16 * (1 - ek), o: k2, b: 6 * (1 - k2) });
    set(P1, { o: 1 - A(t, tM - .05, .25) });
    set(P2, { o: A(t, tM + .45, .35) });
    set(glow, { o: A(t, .1, .8) * (.75 + .25 * Math.sin(t * 2.4)) * (1 - mk), s: .9 + .1 * A(t, .1, 1) });
    set(tile, { s: lerp(.4, 1, SP(t, .25, .8)), r: -20 * (1 - SP(t, .25, .8)) });
    ttl.style.clipPath = `inset(0 ${(100 - 100 * A(t, T.write - .2, .6, E.io)).toFixed(1)}% 0 0)`;
    set(fname, { o: A(t, T.rules - .1, .4) });
    const sk = SP(t, T.skill - .05, .7); set(stamp, { s: lerp(1.8, 1, sk), r: -10 * (1 - sk), o: A(t, T.skill - .05, .1) });
    pre.forEach((e, i) => { const s = T.rules + i * .2; set(e, { x: -16 * (1 - A(t, s, .5)), o: A(t, s, .3) }); });
    { const k = SP(t, T.priv, .7); set(cPriv, { s: lerp(.6, 1, k), o: A(t, T.priv, .12) }); }
    { const k = SP(t, T.lib - .1, .7); set(cLib, { s: lerp(.6, 1, k), o: A(t, T.lib - .1, .12) }); }
    ghosts.forEach((g, i) => {
      const k = SP(t, T.lib, .9), sgn = i ? 1 : -1;
      set(g, { x: sgn * 120 * k, y: -34 * k, r: sgn * 7 * k, s: lerp(.92, .94, k), o: A(t, T.lib, .2) * .9 * (1 - A(t, tM - .1, .3)) });
    });
    // ---- bots
    nodes.forEach(({ b, wrap, ring, lab, sk: chipEl, base, end, pulses, bz, i, side, x, y, av }) => {
      const s = .2 + i * .08, k = SP(t, s, .9);
      const ox = side === 'L' ? -60 : side === 'R' ? 60 : 0, oy = side === 'B' ? 50 : 0;
      const cs = T.shared + .2 + i * .12, con = A(t, cs, .3);
      const mi = E.io(P(t, tM + i * .05, tM + MD + i * .05));
      const tx = lerp(ox * (1 - k), av[0] - x, mi), ty = lerp(oy * (1 - k), av[1] - y, mi);
      const sc = lerp(lerp(.6, 1, k) * (1 + .08 * Math.max(0, 1 - Math.abs(t - cs - .05) / .2)), 44 / BS, mi);
      set(wrap, { x: tx, y: ty, s: sc, o: A(t, s, .2) * lerp(lerp(.55, 1, con), 1, mi) });
      b.update(t, { lookX: mi > .5 ? -.5 : side === 'L' ? .7 : side === 'R' ? -.7 : 0, lookY: mi > .5 ? .4 : side === 'B' ? -.6 : 0, bob: lerp(2.2, 1, mi) });
      const fade = 1 - A(t, tM - .1, .3);
      set(lab, { o: A(t, s + .1, .3) * lerp(.6, 1, con) * fade });
      set(ring, { s: lerp(.8, 1, con), o: con * .9 * fade });
      const ls = T.shared - .1 + i * .12, lk = E.io(P(t, ls, ls + .5));
      base.setAttribute('stroke-dashoffset', (1 - lk).toFixed(4)); base.style.opacity = lk > 0 ? fade : 0;
      end.style.opacity = (A(t, ls, .15) * fade).toFixed(3);
      pulses.forEach((c, j) => {
        const ps = ls + .55 + j * .55; const u = ((t - ps) / 1.1) % 1;
        if (t < ps) { c.style.opacity = 0; return; }
        const [px, py] = bz(u); c.setAttribute('cx', px.toFixed(1)); c.setAttribute('cy', py.toFixed(1)); c.style.opacity = (Math.sin(Math.PI * u) * fade).toFixed(3);
      });
      const ck = SP(t, cs + .05, .7); set(chipEl, { y: 10 * (1 - ck), s: lerp(.6, 1, ck), o: A(t, cs + .05, .12) * fade });
    });
    // ---- phase 2 rules
    set(shr, { o: A(t, tM + .8, .4) });
    rules.forEach(({ r, bar, z, demo, at, i }) => {
      const s = tM + MD - .2 + i * .12;
      enter(r, t, s, { dy: 26, rx: 0, blur: 4, o: lerp(.35, 1, A(t, at - .15, .3)) });
      const act = A(t, at - .1, .4) * (i < 2 ? 1 - .6 * A(t, rules[i + 1].at - .2, .4) : 1);
      r.style.background = `rgba(139,92,246,${(.07 * act).toFixed(3)})`;
      bar.style.transform = `scaleY(${A(t, at - .1, .5, E.io).toFixed(3)})`;
      z.style.backgroundSize = `${(A(t, at, .7, E.io) * 100).toFixed(1)}% 100%`;
      enter(demo, t, at + .05, { dx: 30, dy: 0, rx: 0, blur: 3 });
    });
    // demo 1
    { const s0 = T.r1 + .3, idx = Math.max(0, Math.floor((t - s0) / .55)), sv = SEEK[idx % SEEK.length], pv = SEEK[Math.max(0, idx - 1) % SEEK.length];
      const kk = idx === 0 ? 1 : SP(t, s0 + idx * .55, .4); const v = t < s0 ? 0 : lerp(idx === 0 ? 0 : pv, sv, kk);
      set(kn1, { x: 26 + v / 8 * 330 - 12 });
      tl1.textContent = `t = ${sv.toFixed(2)}s`;
      const bx = 10 + (Math.sin(sv * 1.3) * .5 + .5) * 160, by = 10 + (Math.cos(sv * 2.1) * .5 + .5) * 26;
      set(ball, { x: bx, y: by });
      fchip.textContent = `frame ${String(Math.round(sv * 60)).padStart(4, '0')}`;
      set(ck1, { s: lerp(.4, 1, SP(t, s0 + idx * .55 + .15, .4)), o: t > s0 ? 1 : 0 }); }
    // demo 2
    set(fOk, { o: A(t, T.files - .1, .3), x: 14 * (1 - A(t, T.files - .1, .4)) });
    set(fNo, { o: A(t, T.files + .2, .3), x: 14 * (1 - A(t, T.files + .2, .4)) });
    H.strike(fNoS, A(t, T.files + .55, .4, E.io));
    // demo 3
    { const s0 = T.r3 + .15, pt = cl((t - s0) * 3.4, 0, 12);
      set(head3, { x: TLX + pt / 12 * TLW, o: t > s0 ? 1 : 0 });
      things.forEach((e, i) => { const ts = s0 + MK[i] / 3.4, k = SP(t, ts, .5); set(e, { s: lerp(.2, 1, k), y: 10 * (1 - k), o: A(t, ts, .1) }); });
      marks.forEach((e, i) => { const ts = s0 + MK[i] / 3.4; set(e, { s: 1 + .4 * Math.max(0, 1 - Math.abs(t - ts) / .15) }); });
      const bk = A(t, T.sec - .1, .4, E.io); brk.style.clipPath = `inset(0 ${(100 - 100 * bk).toFixed(1)}% 0 0)`; set(brkL, { o: A(t, T.sec + .1, .3) }); }
  };
};
