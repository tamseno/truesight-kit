// e14 — two whys: one renderer (shared machine: two renders crawl, sleep cuts both off) and a separate critic (self-grading goes easy)
SCENES.e14 = (root, ctx, H) => {
  const { put, h, set, enter, A, SP, E, P, bot, BOTS, BOT_ORDER, lerp, cl, IC, COL } = H;
  const css = (e, s) => (e.style.cssText += s, e);
  const tQ1 = ctx.at('Whyonly'), tShare = ctx.at('share'), tTwo = ctx.at('Two'), tCrawl = ctx.at('crawl'), tCut = ctx.at('cutoff'), tSleep = ctx.at('sleep');
  const tQ2 = ctx.at('Whyaseparate'), tSep = ctx.at('separate'), tGrad = ctx.at('grading'), tEasy = ctx.at('easy'), tModels = ctx.at('Models');
  const tResolve = tQ2 - .55;

  // ---------------- left card: one renderer
  const L = put(root, H.card({ w: 850, h: 690 }), 88, 222);
  const num = n => `<span style="display:inline-flex;width:40px;height:40px;border-radius:12px;background:#15161c;color:#fff;font:800 22px Geist;align-items:center;justify-content:center;margin-right:16px;flex:none">${n}</span>`;
  const lq = put(L, h('div', '', `${num(1)}Why only <span style="color:${BOTS.render.c};margin-left:.28em">one renderer</span>?`), 40, 34); css(lq, 'font:800 36px Geist;letter-spacing:-.02em;display:flex;align-items:center;white-space:nowrap');
  const bx = i => 150 + i * 132;
  const bots = BOT_ORDER.map((k, i) => { const b = bot(k, 70); put(L, b.el, bx(i), 112); return b; });
  const svg = put(L, h('div', '', `<svg width="850" height="280" viewBox="0 0 850 280" style="overflow:visible">${BOT_ORDER.map((k, i) => `<path class="cab" d="M${bx(i) + 35} 184 C ${bx(i) + 35} 226, ${425 + (i - 2) * 30} 200, ${425 + (i - 2) * 30} 262" stroke="${BOTS[k].c}" stroke-width="4" fill="none" stroke-linecap="round" opacity=".55" stroke-dasharray="1 1" pathLength="1"/>`).join('')}</svg>`), 0, 0, 850, 280);
  const cabs = [...svg.querySelectorAll('.cab')];
  const mon = put(L, h('div', ''), 170, 262, 510, 300); css(mon, 'border-radius:22px;background:#191a23;box-shadow:0 30px 60px -24px rgba(20,24,60,.55),inset 0 0 0 6px #252733;overflow:hidden');
  const stand = put(L, h('div', ''), 385, 562, 80, 26); css(stand, 'background:linear-gradient(#2a2c38,#1d1e27);clip-path:polygon(18% 0,82% 0,100% 100%,0 100%)');
  const foot = put(L, h('div', ''), 335, 586, 180, 10); css(foot, 'border-radius:5px;background:#1d1e27');
  const share = put(L, h('div', '', 'five bots · one shared machine'), 0, 616); share.className = 'pill'; css(share, 'left:50%;margin-left:-160px;font:600 20px Geist');
  const cpuLab = put(mon, h('div', '', 'CPU · 8 vCPU'), 30, 26); css(cpuLab, 'font:600 16px Geist;color:#8b90a6;letter-spacing:.1em');
  const cpuPct = put(mon, h('div', '', '12%'), 360, 18, 120); css(cpuPct, 'font:700 26px Geist;color:#fff;text-align:right;font-variant-numeric:tabular-nums');
  const bars = [...Array(16)].map((_, i) => { const b = put(mon, h('div', ''), 30 + i * 28, 66, 20, 70); css(b, 'border-radius:5px;background:rgba(255,255,255,.07);overflow:hidden'); const f = b.appendChild(h('div', '')); css(f, 'position:absolute;left:0;right:0;bottom:0;border-radius:5px'); return f; });
  const rows = [0, 1].map(i => {
    const r = put(mon, h('div', ''), 30, 164 + i * 56, 450, 44);
    const lab = put(r, h('div', '', `render ${i + 1}`), 0, 8); css(lab, 'font:600 19px Maple;color:#e8e9f0;white-space:nowrap');
    const tr = put(r, h('div', ''), 112, 14, 250, 16); css(tr, 'border-radius:8px;background:rgba(255,255,255,.08);overflow:hidden');
    const f = tr.appendChild(h('div', '')); css(f, 'height:100%;width:0;border-radius:8px;background:#5a5cf0');
    const sp = put(r, h('div', '', ''), 368, 6, 82); css(sp, 'font:600 18px Maple;color:#ffd66b;text-align:right;white-space:nowrap');
    return { r, f, sp };
  });
  // sleep overlay on the screen
  const sleepO = put(mon, h('div', ''), 0, 0, 510, 300); css(sleepO, 'background:rgba(10,12,28,.84);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px');
  sleepO.innerHTML = `<div style="width:64px;height:64px">${IC.moon()}</div><div style="font:700 28px Geist;color:#fff">Computer went to sleep</div><div class="mono" style="font:500 18px Maple;color:#ff7a70">render 1 ✕ cut off · render 2 ✕ cut off</div>`;
  const moonEl = sleepO.firstChild;
  const zs = [0, 1, 2].map(i => { const z = put(mon, h('div', '', 'z'), 300 + i * 22, 60 - i * 18); css(z, `font:800 ${20 + i * 6}px Geist;color:#ffd66b`); return z; });
  const stamp = put(L, h('div', '', 'BOTH CRAWL'), 520, 410); css(stamp, `font:800 34px Geist;letter-spacing:.06em;color:${COL.red};border:5px solid ${COL.red};border-radius:14px;padding:4px 18px;background:rgba(255,255,255,.93);white-space:nowrap`);
  const ok = put(L, h('div', '', `<span style="width:28px;height:28px;display:inline-block">${IC.check()}</span>One Render bot · one queue`), 0, 616); ok.className = 'pill'; css(ok, 'left:50%;margin-left:-190px;font:700 23px Geist;color:#15161c');

  // ---------------- right card: separate critic
  const R = put(root, H.card({ w: 850, h: 690 }), 982, 222);
  const rq = put(R, h('div', '', `${num(2)}Why a <span style="color:${COL.violet};margin:0 .28em">separate</span> critic?`), 40, 34); css(rq, 'font:800 36px Geist;letter-spacing:-.02em;display:flex;align-items:center;white-space:nowrap');
  const div = put(R, h('div', ''), 424, 120, 2, 470); css(div, 'background:repeating-linear-gradient(#c9ccd8 0 10px,transparent 10px 20px);transform-origin:top');
  const mkSide = (x, kind, title) => {
    const g = put(R, h('div', ''), x, 112, 390, 500);
    const b = bot(kind, 88); put(g, b.el, 30, 392);
    const nm = put(g, h('div', '', `<b style="font:800 24px Geist">${BOTS[kind].name}</b><div style="font:500 18px Geist;color:${COL.sub};margin-top:2px">${title}</div>`), 134, 404); css(nm, 'white-space:nowrap');
    return { g, b };
  };
  const sa = mkSide(20, 'animator', 'grades its own work'), sc = mkSide(450, 'critic', 'separate judge · no code');
  const doc = put(sa.g, h('div', '', '<div style="font:600 15px Maple;color:#8b90a6;margin-bottom:12px">scene.js</div>'), 30, 20, 330, 230);
  css(doc, 'border-radius:16px;background:#16171f;padding:16px 20px;box-shadow:0 18px 40px -18px rgba(20,24,60,.5)');
  const codeLines = [[70, '#7ee0b8'], [180, '#d8dbe7'], [130, '#ffd66b'], [210, '#d8dbe7'], [100, '#ff9a8f'], [160, '#d8dbe7'], [90, '#7ee0b8']].map(([w, c], i) => { const l = put(doc, h('div', ''), 20 + (i % 3 === 1 ? 24 : 0), 48 + i * 24, 0, 9); css(l, `border-radius:5px;background:${c};opacity:.85`); l.dataset.w = w; return l; });
  const selfScore = put(sa.g, h('div', '', '<span class="n strike">10</span><span style="font:700 18px Geist;color:#b08a3a">/10</span>'), 30, 270, 170, 96);
  css(selfScore, 'display:flex;align-items:baseline;justify-content:center;gap:4px;border-radius:24px;background:#fff6e2;box-shadow:inset 0 0 0 3px #f5a524;padding-top:12px');
  const selfN = selfScore.querySelector('.n'); css(selfN, 'font:900 56px Geist;color:#15161c');
  const sparks = [...Array(5)].map(() => put(sa.g, h('div', '', '<svg viewBox="0 0 20 20" width="22" height="22"><path d="M10 0 L12 8 L20 10 L12 12 L10 20 L8 12 L0 10 L8 8Z" fill="#f5a524"/></svg>'), 0, 0, 22, 22));
  const soft = put(R, h('div', '', 'GOES EASY'), 236, 398); css(soft, `font:800 32px Geist;letter-spacing:.06em;color:${COL.red};border:5px solid ${COL.red};border-radius:14px;padding:2px 18px;background:rgba(255,255,255,.93);white-space:nowrap;z-index:3`);
  const grid = put(sc.g, h('div', '', '<div style="font:600 15px Geist;color:#8b90a6;margin-bottom:12px;letter-spacing:.06em">SCORECARD</div>'), 20, 20, 340, 230);
  css(grid, 'border-radius:16px;background:#fff;padding:16px 20px;box-shadow:0 0 0 1px rgba(21,22,28,.08),0 18px 40px -18px rgba(20,24,60,.35)');
  const crit = ['Pacing', 'Type', 'Motion', 'Sync'], cv = [3, 1, 2, 1];
  const cells = crit.map((n, i) => {
    put(grid, h('div', '', n), 20, 48 + i * 42).style.cssText += 'font:600 18px Geist;color:#15161c';
    return [...Array(5)].map((_, j) => { const c = put(grid, h('div', ''), 100 + j * 44, 50 + i * 42, 36, 26); css(c, 'border-radius:7px;background:#eef0f5'); return c; });
  });
  const critScore = put(sc.g, h('div', '', '<span class="n">6</span><span style="font:700 18px Geist;color:#7a5fd0">/10</span>'), 20, 270, 170, 96);
  css(critScore, 'display:flex;align-items:baseline;justify-content:center;gap:4px;border-radius:24px;background:#f3eeff;box-shadow:inset 0 0 0 3px #8b5cf6;padding-top:12px');
  const critN = critScore.querySelector('.n'); css(critN, 'font:900 56px Geist;color:#15161c;font-variant-numeric:tabular-nums');
  const hard = put(sc.g, h('div', '', 'no mercy'), 210, 296); css(hard, `font:700 24px Geist;color:#fff;background:${COL.violet};border-radius:12px;padding:8px 18px;white-space:nowrap`);
  const models = put(R, h('div', '', `<span class="mono" style="font:600 17px Maple;color:#8b90a6;margin-right:12px">incl.</span>Models included`), 0, 616); models.className = 'pill'; css(models, 'left:50%;margin-left:-150px;font:700 23px Geist;background:#15161c;color:#fff');

  ctx.cue(.1, 'swoosh', .5); BOT_ORDER.forEach((_, i) => ctx.cue(tShare - .4 + i * .07, 'pop', .35));
  ctx.cue(tTwo, 'tick', .5); ctx.cue(tCrawl, 'error', .55); ctx.cue(tCut, 'whoosh', .4); ctx.cue(tResolve + .1, 'ding', .45);
  ctx.cue(tQ2 - .1, 'whoosh', .5); ctx.cue(tGrad, 'pop', .5); ctx.cue(tEasy, 'error', .55); ctx.cue(tModels, 'pop', .5);

  return (t) => {
    // left
    enter(L, t, .05, { dy: 60, rx: 12 }); L.style.translate = `${(447 * (1 - E.io(P(t, tQ2 - .7, tQ2 + .1)))).toFixed(1)}px 0`;
    const dimL = A(t, tQ2 + .5, .7, E.io);
    L.style.opacity = (A(t, .05, .35, E.quart) * (1 - .4 * dimL)).toFixed(3);
    L.style.filter = dimL > .02 ? `saturate(${(1 - .5 * dimL).toFixed(2)})` : 'none';
    enter(lq, t, .15, { dy: 20, rx: 0 });
    bots.forEach((b, i) => { const s = tShare - .45 + i * .07, k = SP(t, s, .8); set(b.el, { y: -40 * (1 - k), s: lerp(.5, 1, k), o: A(t, s, .2) }); b.update(t, { lookY: .6, lookX: (2 - i) * .25 }); });
    cabs.forEach((p, i) => p.setAttribute('stroke-dashoffset', (1 - A(t, tShare - .1 + i * .06, .6, E.io)).toFixed(3)));
    enter(mon, t, .35, { dy: 40, rx: 8 }); set(stand, { o: A(t, .4, .3) }); set(foot, { o: A(t, .4, .3) });
    if (t < tResolve) enter(share, t, tShare + .4, { dy: 16, rx: 0 }); else set(share, { o: 1 - A(t, tResolve, .2), y: -14 * A(t, tResolve, .3) });
    const asleep = A(t, tCut + .1, .5, E.io);
    const both = A(t, tTwo, .5, E.io) * (1 - asleep);
    let tot = 0;
    bars.forEach((f, i) => {
      const idle = .1 + .06 * Math.sin(t * 3 + i * 1.7), hi = .93 + .06 * Math.sin(t * 9 + i * 2.3);
      const v = cl((idle + (hi - idle) * both) * (1 - .9 * asleep)); tot += v;
      f.style.height = (v * 100).toFixed(1) + '%'; f.style.background = v > .85 ? '#f5a524' : '#5a5cf0';
    });
    cpuPct.textContent = Math.round(tot / bars.length * 100) + '%'; cpuPct.style.color = tot / bars.length > .85 ? '#ffd66b' : '#fff';
    const tStop = tCut + .1;
    rows.forEach(({ r, f, sp }, i) => {
      const rk = A(t, tTwo + i * .12, .3, E.quart);
      const p = Math.max(0, Math.min(t, tStop) - tTwo) * (.085 - i * .012);
      f.style.width = (cl(p) * 100).toFixed(1) + '%';
      const cut = t >= tStop;
      f.style.background = cut ? COL.red : both > .5 ? '#f5a524' : '#5a5cf0';
      sp.textContent = cut ? `✕ ${Math.round(p * 100)}%` : '×0.4'; sp.style.color = cut ? '#ff7a70' : '#ffd66b';
      set(r, { x: -20 * (1 - rk), o: rk });
    });
    set(sleepO, { o: asleep });
    set(moonEl, { r: -10 + 10 * SP(t, tCut + .1, .9), s: lerp(.6, 1, SP(t, tCut + .1, .8)) });
    zs.forEach((z, i) => { const c = ((t - tSleep) * .7 + i * .33) % 1; set(z, { y: -30 * c, o: t > tSleep ? Math.sin(c * Math.PI) : 0 }); });
    const sk = SP(t, tCrawl, .7); set(stamp, { s: lerp(1.8, 1, sk), r: -8, o: A(t, tCrawl, .12) * (1 - A(t, tCut, .3)) });
    enter(ok, t, tResolve, { dy: 20, rx: 0 });

    // right
    enter(R, t, tQ2 - .25, { dx: 60, dy: 20, rx: 0 });
    enter(rq, t, tQ2 - .1, { dy: 20, rx: 0 });
    const dk = A(t, tSep, .5, E.io); set(div, { sy: Math.max(.0001, dk), o: dk > 0 ? 1 : 0 });
    const ak = SP(t, tSep - .05, .9), ck = SP(t, tSep + .1, .9);
    set(sa.g, { x: -30 * (1 - ak), o: A(t, tSep - .05, .3) }); set(sc.g, { x: 30 * (1 - ck), o: A(t, tSep + .1, .3) });
    sa.b.update(t, { lookX: .4, lookY: -.6 }); sc.b.update(t, { lookX: -.3, lookY: -.6 });
    enter(doc, t, tSep + .1, { dy: 20, rx: 6 });
    codeLines.forEach((l, i) => { const k = A(t, tSep + .3 + i * .1, .35); l.style.width = (+l.dataset.w * k).toFixed(1) + 'px'; });
    const s1 = SP(t, tGrad, .8); set(selfScore, { s: lerp(.4, 1, s1), o: A(t, tGrad, .15) });
    sparks.forEach((s, i) => { const k = A(t, tGrad + .05, .6), ang = -2.6 + i * .55, rr = 30 + 70 * k; set(s, { x: 115 + Math.cos(ang) * rr * 1.3, y: 318 + Math.sin(ang) * rr, r: k * 90, s: 1 - .5 * A(t, tGrad + .4, .4), o: A(t, tGrad, .1) * (1 - A(t, tGrad + .5, .3)) }); });
    H.strike(selfN, A(t, tEasy + .25, .35, E.io));
    const so = SP(t, tEasy, .7); set(soft, { s: lerp(1.9, 1, so), r: -9, o: A(t, tEasy, .12) });
    enter(grid, t, tSep + .35, { dy: 20, rx: 6 });
    const fillAt = tEasy + .1;
    cells.forEach((row, i) => row.forEach((c, j) => { const on = j < 5 - cv[i], k = A(t, fillAt + (i * 5 + j) * .025, .2); c.style.background = on && k > .5 ? (j < 2 ? '#8b5cf6' : '#c4b0fb') : '#eef0f5'; }));
    const s2 = SP(t, fillAt + .2, .8); set(critScore, { s: lerp(.4, 1, s2), o: A(t, fillAt + .2, .15) });
    critN.textContent = Math.round(lerp(10, 6, A(t, fillAt + .25, .6)));
    const hk = SP(t, fillAt + .55, .8); set(hard, { r: 4, s: lerp(.6, 1, hk), o: A(t, fillAt + .55, .15) });
    enter(models, t, tModels - .05, { dy: 20, rx: 0 });
  };
};
