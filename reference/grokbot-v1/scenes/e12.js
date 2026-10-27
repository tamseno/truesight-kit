// e12 — the banned list (five live mini-examples get stamped), then why: "avoid generic" just swaps defaults → ban by name, Critic adds a line
SCENES.e12 = (root, ctx, H) => {
  const { put, h, set, enter, A, SP, E, P, lerp, cl, COL, rnd, bot } = H;
  const css = (e, s) => (e.style.cssText += s, e);
  const T = {
    list: ctx.at('banned'), b1: ctx.at('centered'), b2: ctx.at('everything'), b3: ctx.at('particle'), b4: ctx.at('bouncy'), b5: ctx.at('deadair'),
    anth: ctx.at('Anthropic'), even: ctx.at('evenwhen'), avoid: ctx.at('avoid'), tends: ctx.at('ittends'), swap: ctx.at('swap'), one: ctx.at('onedefault'), another: ctx.at('another'),
    ban: ctx.at('youban'), name: ctx.at('byname'), sneaks: ctx.at('sneaks'), critic: ctx.at('Critic'), line: ctx.at('addsaline'),
  };
  const BT = [T.b1, T.b2, T.b3, T.b4, T.b5];
  const OUT = T.anth - .32;
  const banIcon = (s, c = COL.red) => `<svg viewBox="0 0 24 24" width="${s}" height="${s}"><circle cx="12" cy="12" r="10" fill="none" stroke="${c}" stroke-width="2.6"/><path d="M5 5l14 14" stroke="${c}" stroke-width="2.6"/></svg>`;

  // =============== phase A: five banned cards
  const A_ = put(root, h('div', ''), 0, 0, 1920, 1080);
  const bh = put(A_, h('div', ''), 88, 220); css(bh, 'display:flex;align-items:center;gap:16px;white-space:nowrap');
  bh.innerHTML = `<span style="width:44px;height:44px;display:block">${banIcon(44)}</span><span style="font:800 36px Geist">The banned list</span><span class="mono" style="display:inline-flex;align-items:center;height:32px;padding:0 12px;border-radius:8px;background:rgba(139,92,246,.12);color:${COL.violet};font:700 17px Maple">house-style.md</span>`;
  const bcount = put(A_, h('div', ''), 0, 222); css(bcount, 'left:auto;right:88px;display:inline-flex;align-items:center;gap:10px;height:44px;padding:0 18px;border-radius:999px;background:#15161c;color:#fff;font:700 20px Geist;white-space:nowrap');
  const NAMES = [['Centered title', 'on a gradient'], ['Everything fading', 'in at once'], ['Particle bursts'], ['Bouncy easing'], ['Dead air']];
  const WHY = ['The number-one tell of an AI-made intro', 'No order, so the eye has nowhere to go', 'Loud, but it says nothing', 'Reads as cartoonish, not crafted', 'A frozen frame loses the viewer'];
  const CW = 330, GAP = (1744 - 5 * CW) / 4, CY = 290;
  const cards = NAMES.map((nm, i) => {
    const c = put(A_, H.card({ w: CW, h: 444 }), 88 + i * (CW + GAP), CY);
    const th = put(c, h('div', ''), 18, 18, CW - 36, 214); css(th, 'border-radius:14px;overflow:hidden');
    put(c, h('div', 'mono', `0${i + 1}`), 22, 250).style.cssText += `font:700 18px Maple;color:${COL.sub}`;
    const names = nm.map((ln, j) => { const e = put(c, h('div', ''), 22, 278 + j * 36); e.innerHTML = `<span class="strike">${ln}</span>`; css(e, 'font:800 28px/1.2 Geist;letter-spacing:-.01em;white-space:nowrap'); return e.firstChild; });
    const why = put(c, h('div', '', WHY[i]), 22, 278 + nm.length * 36 + 14, CW - 44); css(why, `font:500 19px/1.4 Geist;color:${COL.sub}`);
    const stamp = put(c, h('div', '', `${banIcon(24)}<span>BANNED</span>`), 0, 0); css(stamp, `left:50%;top:98px;margin-left:-96px;width:192px;height:56px;display:flex;align-items:center;justify-content:center;gap:8px;border:4px solid ${COL.red};border-radius:12px;background:rgba(255,255,255,.93);color:${COL.red};font:800 25px Geist;letter-spacing:.08em`);
    return { c, th, names, stamp, i, at: BT[i] };
  });
  const [t1, t2, t3, t4, t5] = cards.map(c => c.th);
  t1.style.background = 'linear-gradient(135deg,#7b5cff,#d94fd6 60%,#ff7aa8)';
  const g1 = put(t1, h('div', ''), 72, 86, 150, 18); css(g1, 'border-radius:9px;background:#fff');
  put(t1, h('div', ''), 102, 118, 90, 10).style.cssText += 'border-radius:5px;background:rgba(255,255,255,.7)';
  t2.style.background = '#f4f5f9';
  const g2 = [...Array(6)].map((_, k) => { const e = put(t2, h('div', ''), 22 + (k % 3) * 86, 28 + Math.floor(k / 3) * 86, 72, 72); css(e, `border-radius:14px;background:${['#c9d6fb', '#ffd9c9', '#cdeee2', '#e6dcfb', '#fff0bf', '#d6ecff'][k]}`); return e; });
  t3.style.background = '#141a33';
  const g3 = [...Array(22)].map((_, k) => { const e = put(t3, h('div', ''), 0, 0, 8, 8); css(e, `border-radius:50%;background:${['#ffd66b', '#ff7aa8', '#7ee0b8', '#8fb0ff'][k % 4]}`); return e; });
  t4.style.background = '#fff7ec';
  put(t4, h('div', ''), 30, 184, 234, 3).style.background = 'rgba(21,22,28,.15)';
  const g4 = put(t4, h('div', ''), 124, 0, 46, 46); css(g4, `border-radius:12px;background:${COL.amber};transform-origin:center bottom`);
  t5.style.background = '#eef0f4';
  const g5 = put(t5, h('div', 'mono', ''), 0, 88, 294, 30); css(g5, 'text-align:center;font:600 21px Maple;color:#b4b8c6;white-space:nowrap');
  const g5b = put(t5, h('div', ''), 30, 186, 234, 4); css(g5b, 'border-radius:2px;background:#dde0e8;overflow:hidden');
  const g5f = put(g5b, h('div', ''), 0, 0, 0, 4); g5f.style.background = '#b4b8c6';
  // name-by-name config strip
  const strip = put(A_, H.card({ w: 1744, h: 142 }), 88, 760); css(strip, 'background:#16171f');
  put(strip, h('div', 'mono', '# house-style.md  ·  banned by name'), 34, 26).style.cssText += 'font:500 19px Maple;color:#6f7590;white-space:nowrap';
  const IDS = ['centered-title-on-gradient', 'fade-everything-at-once', 'particle-bursts', 'bouncy-easing', 'dead-air'];
  const cfg = put(strip, h('div', 'mono', ''), 34, 70); css(cfg, 'font:600 23px Maple;color:#d8dbe7;white-space:nowrap');

  // =============== phase B: the swap, and the living list
  const B_ = put(root, h('div', ''), 0, 0, 1920, 1080);
  const q = put(B_, H.card({ w: 1022, h: 330 }), 88, 222);
  const qtag = put(q, h('div', '', `<i style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#d97757;margin-right:10px"></i>Anthropic · prompting guidance`), 34, 28);
  css(qtag, 'display:inline-flex;align-items:center;height:36px;padding:0 16px;border-radius:999px;background:#15161c;color:#fff;font:600 17px Geist;white-space:nowrap');
  const qmark = put(q, h('div', '', '“'), 30, 58); css(qmark, 'font:800 120px/1 Georgia,serif;color:rgba(139,92,246,.2)');
  const qt = put(q, h('div', ''), 86, 90, 900); css(qt, 'font:700 37px/1.42 Geist;letter-spacing:-.015em;color:#15161c');
  const QS = [['Even when you tell the model ', 0], ['to avoid generic choices,', 1], [' it tends to ', 0], ['swap one default', 2], [' for ', 0], ['another.', 2]];
  qt.innerHTML = QS.map(([s, k]) => `<span class="seg" data-k="${k}" style="background:linear-gradient(transparent 62%,${k === 1 ? 'rgba(139,92,246,.24)' : 'rgba(245,165,36,.36)'} 62%) no-repeat;background-size:0% 100%">${s}</span>`).join('');
  const segs = [...qt.querySelectorAll('.seg')];
  const qsrc = put(q, h('div', 'mono', 'paraphrased from Anthropic’s prompt-engineering docs'), 88, 280); css(qsrc, `font:400 17px Maple;color:${COL.sub};white-space:nowrap`);
  // swap demo
  const DY = 596;
  const thumbA = put(B_, h('div', ''), 120, DY + 50, 300, 190); css(thumbA, 'border-radius:18px;background:linear-gradient(135deg,#7b5cff,#d94fd6 60%,#ff7aa8);box-shadow:0 20px 40px -18px rgba(123,92,255,.7);overflow:hidden');
  put(thumbA, h('div', ''), 70, 78, 160, 18).style.cssText += 'border-radius:9px;background:#fff';
  put(thumbA, h('div', ''), 105, 110, 90, 10).style.cssText += 'border-radius:5px;background:rgba(255,255,255,.7)';
  const labA = put(B_, h('div', '', 'One default'), 120, DY + 258, 300); css(labA, 'text-align:center;font:700 25px Geist');
  const ghostB = put(B_, h('div', '', '?'), 700, DY + 50, 300, 190); css(ghostB, 'border-radius:18px;border:3px dashed rgba(21,22,28,.18);display:flex;align-items:center;justify-content:center;font:800 64px Geist;color:rgba(21,22,28,.2)');
  const thumbB = put(B_, h('div', ''), 700, DY + 50, 300, 190); css(thumbB, 'border-radius:18px;background:#0d1020;box-shadow:0 20px 40px -18px rgba(13,16,32,.8);overflow:hidden');
  const nb = put(thumbB, h('div', ''), 60, 44, 180, 102); css(nb, 'border-radius:14px;box-shadow:0 0 0 2px #42f5d7,0 0 22px rgba(66,245,215,.55),inset 0 0 18px rgba(66,245,215,.25)');
  put(nb, h('div', ''), 30, 32, 120, 14).style.cssText += 'border-radius:7px;background:#e8fffb';
  const nbar = put(nb, h('div', ''), 50, 58, 80, 12); css(nbar, 'border-radius:6px;background:#42f5d7;box-shadow:0 0 12px #42f5d7');
  const labB = put(B_, h('div', '', 'Another default'), 700, DY + 258, 300); css(labB, 'text-align:center;font:700 25px Geist');
  const arrow = put(B_, h('div', '', `<svg viewBox="0 0 240 30" width="240" height="30"><path d="M4 15H226" stroke="${COL.violet}" stroke-width="4" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1" class="ln"/><path d="M212 4l16 11-16 11" stroke="${COL.violet}" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round" class="hd"/></svg>`), 440, DY + 130, 240, 30);
  const aLn = arrow.querySelector('.ln'), aHd = arrow.querySelector('.hd');
  const pchip = put(B_, h('div', '', 'avoid generic choices'), 0, DY - 4); css(pchip, 'display:inline-flex;align-items:center;height:40px;padding:0 16px;border-radius:999px;background:#15161c;color:#fff;font:600 17px Maple;white-space:nowrap;box-shadow:0 10px 20px -10px rgba(0,0,0,.5)');
  const samePill = put(B_, h('div', '', '≈ still generic'), 466, DY + 70); css(samePill, 'display:inline-flex;align-items:center;height:40px;padding:0 16px;border-radius:999px;background:#fff;box-shadow:0 0 0 1px rgba(21,22,28,.08),0 8px 18px -8px rgba(30,34,70,.25);font:700 19px Geist;color:#15161c;white-space:nowrap');
  const tropeTag = put(B_, h('div', '', 'New cliché!'), 900, DY + 28); css(tropeTag, `display:inline-flex;align-items:center;height:40px;padding:0 14px;border-radius:12px;background:${COL.red};color:#fff;font:800 20px Geist;white-space:nowrap;box-shadow:0 10px 20px -8px rgba(240,68,58,.7)`);
  // living list
  const LX = 1150, LW = 682;
  const L = put(B_, H.card({ w: LW, h: 690 }), LX, 222);
  const lh = put(L, h('div', ''), 30, 28, LW - 60, 46); css(lh, 'display:flex;align-items:center;gap:14px;white-space:nowrap');
  lh.innerHTML = `<span style="width:36px;height:36px;display:block">${banIcon(36)}</span><span style="font:800 30px Geist">Banned, by name</span>`;
  const cnt = put(L, h('div', ''), 0, 30); css(cnt, 'left:auto;right:30px;display:flex;align-items:baseline;gap:8px;height:44px;overflow:hidden;white-space:nowrap');
  const cntN = cnt.appendChild(h('span', '', '5')); cntN.style.cssText = 'display:inline-block;font:800 34px Geist;width:24px;text-align:right';
  cnt.appendChild(h('span', '', 'rules')).style.cssText = `font:600 20px Geist;color:${COL.sub}`;
  const ROWS = [['Centered title on a gradient', 'gradient-title'], ['Everything fading in at once', 'fade-all'], ['Particle bursts', 'particles'], ['Bouncy easing', 'bounce'], ['Dead air', 'dead-air'], ['Neon glow on dark cards', '']];
  const xb = (c) => { const el = h('div', '', `<svg viewBox="0 0 24 24" width="100%" height="100%" style="overflow:visible"><circle cx="12" cy="12" r="12" fill="${c}"/><path d="M8.3 8.3l7.4 7.4" stroke="#fff" stroke-width="2.6" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1" stroke-dashoffset="1"/><path d="M15.7 8.3l-7.4 7.4" stroke="#fff" stroke-width="2.6" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1" stroke-dashoffset="1"/></svg>`); const ps = [...el.querySelectorAll('path')]; return { el, upd(t, s) { const k = SP(t, s, .6); set(el, { s: lerp(.2, 1, k), o: A(t, s, .1) }); ps.forEach((p, i) => p.setAttribute('stroke-dashoffset', (1 - A(t, s + .06 + i * .08, .22, E.io)).toFixed(3))); } }; };
  const rows = ROWS.map(([z, id], i) => {
    const r = put(L, h('div', ''), 24, 94 + i * 70, LW - 48, 60); css(r, 'border-radius:14px;display:flex;align-items:center;gap:16px;padding:0 18px;white-space:nowrap');
    const box = r.appendChild(h('span', '')); box.style.cssText = 'position:relative;width:30px;height:30px;flex:none;border-radius:50%;box-shadow:inset 0 0 0 2.5px #e1e3ea';
    const x = xb(i === 5 ? COL.violet : COL.red); x.el.style.cssText += 'position:absolute;left:0;top:0;width:30px;height:30px'; box.appendChild(x.el);
    const nm = r.appendChild(h('span', '', z)); nm.style.cssText = 'font:700 24px Geist;letter-spacing:-.01em';
    let plus = null;
    if (id) r.appendChild(h('span', 'mono', id)).style.cssText = `margin-left:auto;font:500 16px Maple;color:${COL.sub}`;
    else { plus = r.appendChild(h('span', '', '+1 line')); plus.style.cssText = `margin-left:auto;display:inline-flex;align-items:center;height:32px;padding:0 12px;border-radius:999px;background:${COL.violet};color:#fff;font:700 16px Geist`; }
    return { r, x, plus, i };
  });
  const next = put(L, h('div', ''), 24, 94 + 5 * 70, LW - 48, 60); css(next, `border-radius:14px;border:2.5px dashed rgba(139,92,246,.4);display:flex;align-items:center;padding:0 18px;font:600 21px Maple;color:${COL.violet};white-space:nowrap`);
  const nextT = next.appendChild(h('span', ''));
  const capRow = put(L, h('div', ''), 30, 600, LW - 60, 64); css(capRow, 'display:flex;align-items:center;gap:16px;white-space:nowrap');
  const cb = bot('critic', 60); const cbw = capRow.appendChild(h('span', '')); cbw.style.cssText = 'position:relative;width:60px;height:60px;flex:none'; cb.el.style.left = '0'; cb.el.style.top = '0'; cbw.appendChild(cb.el);
  capRow.appendChild(h('span', '', `<b style="font:800 26px Geist">The Critic adds a line</b><div style="font:500 18px Geist;color:${COL.sub};margin-top:2px">every time a new cliché sneaks in</div>`));
  const fly = put(B_, h('div', ''), 0, 0, 120, 76); css(fly, 'border-radius:10px;background:#0d1020;box-shadow:0 0 0 2px #42f5d7,0 12px 24px -8px rgba(0,0,0,.5)');

  const tRowIn = T.critic - .05;
  ctx.cue(.1, 'whoosh', .4); BT.forEach(b => ctx.cue(b, 'error', .42));
  ctx.cue(OUT, 'whoosh', .5); ctx.cue(T.avoid, 'tick', .4); ctx.cue(T.swap, 'swoosh', .5); ctx.cue(T.another, 'pop', .45);
  ROWS.slice(0, 5).forEach((_, i) => ctx.cue(T.ban + .1 + i * .13, 'tick', .3));
  ctx.cue(T.sneaks, 'error', .45); ctx.cue(tRowIn, 'pop', .6); ctx.cue(T.line, 'ding', .45);

  return (t) => {
    // ---------------- phase A
    const out = A(t, OUT, .45, E.in);
    set(A_, { y: -60 * out, o: 1 - out, b: 8 * out });
    A_.style.display = out >= 1 ? 'none' : 'block';
    if (out < 1) {
      enter(bh, t, .05, { dy: 20, rx: 0, blur: 4 });
      const nB = BT.filter(b => t >= b).length;
      bcount.innerHTML = `<span style="width:22px;height:22px;display:block">${banIcon(22, '#ff7a70')}</span>${nB} / 5 banned`;
      enter(bcount, t, T.list, { dy: 16, rx: 0 });
      cards.forEach(({ c, th, names, stamp, i, at }) => {
        enter(c, t, T.list - .2 + i * .09, { dy: 60, rx: 14 });
        const bk = A(t, at, .3);
        th.style.filter = `grayscale(${(.75 * bk).toFixed(2)})`; th.style.opacity = (1 - .45 * bk).toFixed(3);
        names.forEach((n, j) => { H.strike(n, A(t, at + .1 + j * .2, .35, E.io)); n.style.color = bk > .5 ? COL.red : COL.ink; });
        const sk = SP(t, at, .55); set(stamp, { s: lerp(1.9, 1, sk), r: -8, o: A(t, at, .08) });
        c.style.boxShadow = `0 0 0 ${(3 * bk).toFixed(2)}px ${COL.red},0 18px 50px -12px rgba(30,34,70,.18),0 4px 12px rgba(30,34,70,.06)`;
        c.style.translate = bk > 0 ? `${(5 * Math.max(0, 1 - (t - at) / .25) * Math.sin((t - at) * 70)).toFixed(2)}px 0` : '0 0';
      });
      const lt = (i) => Math.min(t, BT[i]);
      { const v = lt(0); set(g1, { s: 1 + .04 * Math.sin(v * 3) }); }
      { const v = lt(1), cyc = (v % 1.8) / 1.8, o = cl(cyc / .35); g2.forEach(e => set(e, { o, s: lerp(.9, 1, o) })); }
      { const v = lt(2), cyc = (v % 1.5) / 1.5; g3.forEach((e, k) => { const a = k / 22 * Math.PI * 2 + rnd(k) * .4, d = E.out(cyc) * (60 + rnd(k + 3) * 50); set(e, { x: 143 + Math.cos(a) * d, y: 103 + Math.sin(a) * d, o: 1 - cyc, s: 1 - .5 * cyc }); }); }
      { const v = lt(3), cyc = (v % 1.7) / 1.7, k = cyc * 3.2, bounce = Math.abs(Math.cos(k * Math.PI)) * Math.exp(-k * 1.1), sq = Math.max(0, 1 - bounce * 6); set(g4, { y: 138 - bounce * 126, sy: 1 - .15 * sq, sx: 1 + .1 * sq }); }
      { const v = lt(4), s = Math.floor(Math.max(0, v - T.list) + 1); g5.textContent = `00:${String(s).padStart(2, '0')} · nothing happens`; g5f.style.width = (cl((v - T.list) / 8) * 234).toFixed(1) + 'px'; }
      enter(strip, t, T.list + .35, { dy: 30, rx: 0, blur: 4 });
      let html = '<span style="color:#7ee0b8">banned</span><span style="color:#6f7590">: [</span>';
      IDS.forEach((id, i) => {
        if (t < BT[i] + .05) return;
        const n = Math.floor((t - BT[i] - .05) * 60), s = id.slice(0, n), fresh = t - BT[i] < .9;
        html += (i ? '<span style="color:#6f7590">, </span>' : '') + `<span style="color:${fresh ? '#ffd66b' : '#ff9a8f'}">${s}</span>`;
      });
      html += t >= BT[4] + .5 ? '<span style="color:#6f7590">]</span>' : '<span class="caret" style="color:#ffd66b"></span>';
      cfg.innerHTML = html;
    }

    // ---------------- phase B
    const bin = t >= OUT;
    B_.style.display = bin ? 'block' : 'none';
    if (!bin) return;
    enter(q, t, OUT + .15, { dy: 50, rx: 10 });
    set(qtag, { o: A(t, T.anth - .05, .3), x: -10 * (1 - A(t, T.anth - .05, .5)) });
    set(qmark, { o: A(t, T.anth + .3, .5) });
    const SEGT = [T.even - .15, T.avoid - .15, T.tends - .15, T.swap - .1, T.another - .25, T.another - .1];
    segs.forEach((s, i) => { const k = A(t, SEGT[i], .35); s.style.opacity = lerp(.13, 1, k).toFixed(3); const kk = +s.dataset.k; s.style.backgroundSize = kk ? (A(t, SEGT[i] + .25, .5, E.io) * 100).toFixed(1) + '% 100%' : '0% 100%'; });
    set(qsrc, { o: A(t, T.another + .4, .5) });
    // swap demo
    enter(thumbA, t, T.even - .2, { dy: 40, rx: 14 }); set(labA, { o: A(t, T.even + .1, .4) });
    set(ghostB, { o: A(t, T.avoid + .2, .4) * (1 - A(t, T.swap + .1, .25)) });
    aLn.setAttribute('stroke-dashoffset', (1 - A(t, T.avoid + .1, .6, E.io)).toFixed(3)); aHd.style.opacity = A(t, T.avoid + .55, .2).toFixed(3);
    const ride = E.io(P(t, T.tends, T.swap + .15)), ck = SP(t, T.avoid - .05, .7);
    set(pchip, { x: lerp(150, 610, ride), y: -18 * (1 - ck) - Math.sin(ride * Math.PI) * 18, s: lerp(.6, 1, ck) * (1 - .25 * A(t, T.swap + .15, .3)), o: A(t, T.avoid - .05, .15) * (1 - A(t, T.swap + .2, .3)) });
    const bk = SP(t, T.swap + .15, .8); set(thumbB, { s: lerp(.7, 1, bk), r: 6 * (1 - bk), o: A(t, T.swap + .15, .15) * (1 - .45 * A(t, T.sneaks + .5, .3)), y: Math.sin(t * 1.8) * 3 * A(t, T.swap + 1, .5) });
    nbar.style.opacity = (.7 + .3 * Math.sin(t * 6)).toFixed(3);
    set(labB, { o: A(t, T.another, .4) });
    const sp = SP(t, T.another + .4, .7); set(samePill, { s: lerp(.6, 1, sp), o: A(t, T.another + .4, .15) * (1 - A(t, T.sneaks - .3, .3)) });
    const tk = SP(t, T.sneaks, .6); set(tropeTag, { s: lerp(1.8, 1, tk), r: 8, o: A(t, T.sneaks, .08) * (1 - A(t, tRowIn + .5, .3)) });
    // a copy of B flies into the list
    const fs = T.sneaks + .5, fk = E.io(P(t, fs, tRowIn));
    const fx = lerp(790, LX + 24 + 24, fk), fy = lerp(DY + 107, 222 + 94 + 5 * 70 - 8, fk) - Math.sin(fk * Math.PI) * 130;
    set(fly, { x: fx, y: fy, s: lerp(1, .38, fk), o: t > fs && t < tRowIn + .05 ? 1 : 0 });
    // list
    enter(L, t, OUT + .3, { dx: 80, dy: 0, rx: 0, s0: .95 });
    const roll = A(t, tRowIn, .35, E.quart);
    cntN.textContent = t >= tRowIn ? '6' : '5'; set(cntN, { y: t >= tRowIn ? 30 * (1 - roll) : 0 });
    rows.forEach(({ r, x, plus, i }) => {
      if (i < 5) {
        enter(r, t, OUT + .6 + i * .08, { dy: 16, rx: 0, blur: 3 });
        const on = T.ban + .1 + i * .13; x.upd(t, on);
        const flash = Math.max(0, 1 - Math.abs(t - on - .1) / .25);
        r.style.background = `rgba(240,68,58,${(.035 * A(t, on, .3) + .07 * flash).toFixed(3)})`;
      } else {
        const k = SP(t, tRowIn, .8); set(r, { x: 40 * (1 - k), s: lerp(.9, 1, k), o: A(t, tRowIn, .15) }); x.upd(t, tRowIn + .15);
        r.style.background = `rgba(139,92,246,${(.06 + .1 * Math.max(0, 1 - (t - tRowIn) / .8)).toFixed(3)})`;
        const pk = SP(t, T.line - .1, .6); set(plus, { s: lerp(.4, 1, pk), o: A(t, T.line - .1, .1) });
      }
    });
    enter(next, t, T.name - .2, { dy: 16, rx: 0, blur: 3 }); next.style.translate = `0 ${(70 * roll).toFixed(1)}px`;
    H.type(nextT, '+ next cliché…', t, T.name, 22, true);
    enter(capRow, t, T.critic - .3, { dy: 18, rx: 0, blur: 3 });
    cb.update(t, { lookX: -.5, lookY: -.4 });
  };
};
