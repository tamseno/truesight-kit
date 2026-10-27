// e15 — bots forget, chats scroll, files stay → a project folder is a state machine (six state files) → after a rebuild or lost context, one look at the folders says where every project stands
SCENES.e15 = (root, ctx, H) => {
  const { put, h, set, enter, A, SP, E, P, bot, BOTS, lerp, cl, IC, COL } = H;
  const css = (e, s) => (e.style.cssText += s, e);
  const tForget = ctx.at('forget'), tChat = ctx.at('Chats'), tFile = ctx.at('Files'), tSo = ctx.at('Soevery'), tFolder = ctx.at('folder');
  const tEach = ctx.at('everyfile'), tState = ctx.at('state');
  const TS = [ctx.at('brief'), ctx.at('beats'), ctx.at('storyboard'), ctx.at('code'), ctx.at('final'), ctx.at('delivered')];
  const TB = [null, null, ctx.at('approved'), ctx.at('ready'), ctx.at('passed'), ctx.at('delivered')];
  const tRe = ctx.at('rebuilt'), tCtx = ctx.at('loses'), tLook = ctx.at('onelook'), tKnow = ctx.at('exactly'), tStands = ctx.at('stands');
  const OUTB = ctx.at('Ifthe') - .05;

  // ================= phase A: three tiles
  const tile = (x, label, good) => {
    const c = put(root, H.card({ w: 480, h: 440 }), x, 300);
    const band = put(c, h('div', '', `<span>${label}</span>`), 0, 330, 480, 110);
    css(band, `background:${good ? '#15161c' : '#1b1c25'};color:#fff;font:800 36px Geist;letter-spacing:-.02em;display:flex;align-items:center;justify-content:center;gap:16px;white-space:nowrap`);
    const mk = band.appendChild(h('span', 'icon')); mk.style.cssText = 'width:36px;height:36px;display:inline-block';
    mk.innerHTML = good ? IC.check() : IC.x();
    return { c, band, mk };
  };
  const T1 = tile(150, 'Bots forget'), T2 = tile(720, 'Chats scroll away'), T3 = tile(1290, 'Files don’t', true);
  const b1 = bot('director', 130); put(T1.c, b1.el, 70, 170);
  const bub = put(T1.c, h('div', ''), 220, 50, 200, 120); css(bub, 'border-radius:28px;background:#fff;box-shadow:0 0 0 3px #e3e5ee');
  const bubDots = [0, 1].map(i => { const d = put(T1.c, h('div', ''), 206 - i * 22, 172 + i * 18, 22 - i * 8, 22 - i * 8); css(d, 'border-radius:50%;background:#fff;box-shadow:0 0 0 3px #e3e5ee'); return d; });
  const memo = [120, 90, 140].map((w, i) => { const l = put(bub, h('div', ''), 30, 28 + i * 24, w, 12); css(l, `border-radius:6px;background:${['#5a5cf0', '#c9ccd8', '#c9ccd8'][i]}`); return l; });
  const qm = put(bub, h('div', '', '?'), 0, 4, 200, 112); css(qm, 'font:900 76px Geist;color:#b8bbc8;text-align:center');
  const chatClip = put(T2.c, h('div', ''), 40, 30, 400, 280); css(chatClip, 'overflow:hidden;-webkit-mask-image:linear-gradient(transparent,#000 30%,#000)');
  const chat = put(chatClip, h('div', ''), 0, 0, 400, 2000);
  [...Array(16)].forEach((_, i) => { const me = i % 3 === 1, w = 150 + H.rnd(i + 4) * 140; const b = put(chat, h('div', ''), me ? 400 - w : 0, i * 62, w, 46); css(b, `border-radius:16px;background:${me ? '#1b1c25' : '#eef0f5'}`); put(b, h('div', ''), 18, 18, w - 60, 10).style.cssText += `border-radius:5px;background:${me ? 'rgba(255,255,255,.5)' : '#c9ccd8'}`; });
  const f3 = put(T3.c, h('div', '', IC.file('#fff')), 160, 40, 160, 200); f3.querySelector('svg').style.filter = 'drop-shadow(0 10px 20px rgba(30,34,70,.18))';
  const f3l = [70, 90, 60, 84].map((w, i) => { const l = put(T3.c, h('div', ''), 196, 120 + i * 24, w, 10); css(l, `border-radius:5px;background:${i === 0 ? '#1fbf75' : '#d5d8e2'};transform-origin:left`); return l; });
  const ring3 = put(T3.c, h('div', ''), 0, 0, 480, 440); css(ring3, 'border-radius:22px;box-shadow:inset 0 0 0 5px #1fbf75');

  // ================= phase B: folder + state machine
  const B_ = put(root, h('div', ''), 0, 0, 1920, 1080);
  const FW = put(B_, H.win({ title: 'projects/night-promo/', w: 740, h: 680, tag: 'STATE' }), 88, 232);
  const fb = FW.body;
  const fh = put(fb, h('div', '', 'One project <span style="color:#b4b7c3">=</span> <span class="hl">one folder</span>'), 26, 16); css(fh, 'font:800 34px Geist;letter-spacing:-.02em;white-space:nowrap');
  const fhl = fh.querySelector('.hl'); css(fhl, 'background:linear-gradient(#ffd66b,#ffd66b) no-repeat 0 85%/0% 38%');
  const files = [
    ['brief.md', 'Brief', '#33c9a6', ''], ['beats.json', 'Beats', '#33c9a6', ''], ['storyboard.APPROVED', 'Storyboard', '#33c9a6', 'APPROVED'],
    ['code.READY', 'Code', '#f5a524', 'READY'], ['final.PASSED', 'Final cut', '#8b5cf6', 'PASSED'], ['DELIVERED', 'Delivered', '#3a86f4', 'DELIVERED'],
  ];
  const rows = files.map(([n, lab, c, st], i) => {
    const r = put(fb, h('div', ''), 22, 88 + i * 86, 696, 74); css(r, 'border-radius:16px;background:#f6f7fa');
    put(r, h('div', '', IC.file(c)), 18, 14, 40, 48);
    put(r, h('div', '', n), 74, 10).style.cssText += 'font:700 24px Maple;white-space:nowrap';
    put(r, h('div', '', lab), 76, 44).style.cssText += `font:500 17px Geist;color:${COL.sub}`;
    let chp = null; if (st) { chp = put(r, H.chip(st, c, true), 0, 21); chp.style.left = 'auto'; chp.style.right = '20px'; chp.style.font = '700 15px Geist'; chp.style.letterSpacing = '.06em'; }
    const ck = put(r, h('div', '', IC.check(c)), 0, 22, 32, 32); ck.style.left = 'auto'; ck.style.right = st ? (st.length * 11 + 64) + 'px' : '20px';
    return { r, chp, ck };
  });
  const empty = put(fb, h('div', '', `<div style="width:120px;height:120px;margin:0 auto 18px;opacity:.35">${IC.folder('#c9ccd8')}</div>Empty folder · waiting for a brief`), 22, 200, 696); css(empty, 'font:600 25px Geist;color:#a4a8b6;text-align:center');
  const SM = put(B_, H.card({ w: 960, h: 680 }), 872, 232);
  const sh = put(SM, h('div', '', 'Every file <span style="color:#b4b7c3">=</span> <span class="hl">a state</span>'), 44, 36); css(sh, 'font:800 34px Geist;letter-spacing:-.02em;white-space:nowrap');
  const shl = sh.querySelector('.hl'); css(shl, 'background:linear-gradient(#ffd66b,#ffd66b) no-repeat 0 85%/0% 38%');
  const NX = i => 96 + i * 154, NY = 196;
  const rail = put(SM, h('div', ''), NX(0), NY - 3, NX(5) - NX(0), 6); css(rail, 'border-radius:3px;background:#e6e8ef');
  const railF = put(SM, h('div', ''), NX(0), NY - 3, 0, 6); css(railF, 'border-radius:3px;background:linear-gradient(90deg,#33c9a6,#f5a524 60%,#8b5cf6 80%,#3a86f4)');
  const owners = ['director', 'director', 'director', 'animator', 'critic', 'delivery'];
  const nodes = files.map(([n, lab, c, st], i) => {
    const d = put(SM, h('div', '', `<span>${i + 1}</span>`), NX(i) - 34, NY - 34, 68, 68);
    css(d, 'border-radius:50%;background:#fff;box-shadow:inset 0 0 0 4px #e1e3ea;display:flex;align-items:center;justify-content:center;font:800 26px Geist;color:#b4b7c3');
    const lb = put(SM, h('div', '', `<div style="font:700 22px Geist;letter-spacing:-.01em">${lab}</div><div style="font:700 13px Maple;color:${c};margin-top:3px">${st || n}</div>`), NX(i) - 75, NY + 50, 150);
    css(lb, 'text-align:center;white-space:nowrap');
    const ob = bot(owners[i], 52); put(SM, ob.el, NX(i) - 26, NY + 136);
    return { d, lb, ob, c };
  });
  const tok = put(SM, h('div', ''), 0, NY - 48, 96, 96); css(tok, 'border-radius:50%;box-shadow:0 0 0 3px rgba(58,108,244,.35),0 0 30px rgba(58,108,244,.35)');
  const rd = put(SM, h('div', ''), 44, 440, 872, 196); css(rd, 'border-radius:20px;background:#1b1c25;color:#fff');
  put(rd, h('div', '', 'CURRENT STATE'), 36, 28).style.cssText += 'font:600 17px Geist;color:#8b90a6;letter-spacing:.12em';
  const rdName = put(rd, h('div', '', ''), 36, 62); css(rdName, 'font:700 42px Maple;white-space:nowrap;color:#ffd66b');
  const rdNext = put(rd, h('div', '', ''), 36, 136); css(rdNext, 'font:500 22px Geist;color:#c9ccd8;white-space:nowrap');
  const RD = [['brief.md', 'brief written', 'next → Director lays out the beats'], ['beats.json', 'beats set', 'next → Director draws the storyboard'], ['storyboard.APPROVED', 'you approved', 'next → Animator writes the code'],
    ['code.READY', 'renderable', 'next → Render renders · Critic scores'], ['final.PASSED', 'passed review', 'next → Delivery ships it'], ['DELIVERED', 'in your hands', 'project complete ✓']];

  // ================= phase C: incidents + project list
  const C_ = put(root, h('div', ''), 0, 0, 1920, 1080);
  const IA = put(C_, H.card({ w: 530, h: 300 }), 88, 232);
  put(IA, h('div', '', 'Computer rebuilt'), 36, 28).style.cssText += 'font:800 30px Geist;letter-spacing:-.02em';
  const scr = put(IA, h('div', ''), 36, 92, 458, 186); css(scr, 'border-radius:18px;background:#1b1c25');
  const ref = put(scr, h('div', '', '<svg viewBox="0 0 40 40" width="64" height="64"><path d="M32 20a12 12 0 1 1-4-9" stroke="#ffd66b" stroke-width="4.5" fill="none" stroke-linecap="round"/><path d="M29 4v8h-8" stroke="#ffd66b" stroke-width="4.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>'), 30, 34, 64, 64);
  const rt = put(scr, h('div', '', ''), 118, 36); css(rt, 'font:600 22px Geist;color:#fff;white-space:nowrap');
  const rtr = put(scr, h('div', ''), 118, 82, 300, 14); css(rtr, 'border-radius:7px;background:rgba(255,255,255,.1);overflow:hidden');
  const rf = rtr.appendChild(h('div', '')); css(rf, 'height:100%;width:0;border-radius:7px;background:#ffd66b');
  const rlog = put(scr, h('div', '', ''), 30, 128, 410); css(rlog, 'font:500 18px Maple;color:#8b90a6;white-space:nowrap');
  const IB = put(C_, H.card({ w: 530, h: 316 }), 88, 590);
  put(IB, h('div', '', 'Bot lost its context'), 36, 28).style.cssText += 'font:800 30px Geist;letter-spacing:-.02em';
  const b2 = bot('director', 116); put(IB, b2.el, 50, 150);
  const bubC = put(IB, h('div', ''), 200, 96, 290, 150); css(bubC, 'border-radius:30px;background:#f3f4f8;box-shadow:inset 0 0 0 3px #e3e5ee');
  const mem = put(bubC, h('div', '', 'Where was I?'), 0, 54, 290); css(mem, 'font:800 28px Geist;color:#8b90a6;text-align:center');
  const memL = [170, 120].map((w, i) => { const l = put(bubC, h('div', ''), 40, 50 + i * 30, w, 14); css(l, 'border-radius:7px;background:#c9ccd8;transform-origin:left'); return l; });
  const WN = put(C_, H.win({ title: 'projects/', w: 1172, h: 680, tag: '5 projects' }), 660, 232);
  const wb = WN.body;
  const hdr = put(wb, h('div', '', '<span style="position:absolute;left:96px">PROJECT</span><span style="position:absolute;left:488px">HOW FAR ALONG</span><span style="position:absolute;left:870px">STATE FILE</span>'), 22, 14, 1128, 26);
  css(hdr, 'font:600 15px Geist;color:#8b90a6;letter-spacing:.1em');
  const SC = ['#33c9a6', '#33c9a6', '#33c9a6', '#f5a524', '#8b5cf6', '#3a86f4'];
  const P5 = [['Night promo', 'night-promo', 6, 'DELIVERED'], ['UI morph demo', 'ui-morph-demo', 5, 'final.PASSED'], ['Launch teaser', 'launch-teaser', 4, 'code.READY'], ['Pricing explainer', 'pricing-explainer', 3, 'storyboard.APPROVED'], ['Holiday loop', 'holiday-loop', 2, 'beats.json']];
  const prow = P5.map(([nm, slug, n, st], i) => {
    const r = put(wb, h('div', ''), 22, 52 + i * 112, 1128, 98); css(r, 'border-radius:18px;background:#f6f7fa');
    put(r, h('div', '', IC.folder(SC[n - 1])), 24, 24, 50, 50);
    put(r, h('div', '', `<div style="font:700 26px Geist;letter-spacing:-.01em">${nm}</div><div style="font:500 16px Maple;color:#8b90a6;margin-top:3px">${slug}/</div>`), 96, 18).style.whiteSpace = 'nowrap';
    const pips = [...Array(6)].map((_, j) => { const p = put(r, h('div', ''), 466 + j * 50, 41, 40, 16); css(p, 'border-radius:8px;background:#e3e5ec'); return p; });
    const cnt = put(r, h('div', '', `${n}/6`), 774, 33); css(cnt, 'font:700 22px Geist;color:#6b6e7b');
    const badge = put(r, H.chip(st, SC[n - 1], n === 6), 848, 30); css(badge, 'font:700 17px Maple;height:38px');
    if (n === 6) badge.insertAdjacentHTML('afterbegin', '✓ ');
    return { r, pips, badge, n, cnt };
  });
  const scan = put(wb, h('div', ''), 14, 0, 1144, 110); css(scan, 'border-radius:22px;box-shadow:0 0 0 3px #3a6cf4,0 18px 40px -16px rgba(58,108,244,.45)');
  const link = put(C_, h('div', '', `<span style="width:26px;height:26px;display:inline-block">${IC.folder()}</span>State lives in the folder`), 0, 0); link.className = 'pill'; css(link, 'font:600 20px Geist;z-index:4');
  const glance = put(C_, h('div', '', `<span style="width:26px;height:26px;display:inline-block">${IC.check()}</span>One look · every project`), 0, 0); glance.className = 'pill'; css(glance, 'font:700 21px Geist;z-index:4');

  ctx.cue(.15, 'pop', .5); ctx.cue(tForget + .2, 'error', .4); ctx.cue(tChat, 'pop', .45); ctx.cue(tChat + .5, 'error', .4); ctx.cue(tFile - .1, 'pop', .45); ctx.cue(tFile + .35, 'ding', .45);
  ctx.cue(tSo, 'whoosh', .55); TS.forEach((s, i) => ctx.cue(s, i === 5 ? 'ding' : 'tick', i === 5 ? .6 : .45));
  ctx.cue(OUTB, 'whoosh', .5); ctx.cue(tCtx - .1, 'pop', .45); ctx.cue(tLook - .1, 'swoosh', .5);
  P5.forEach((_, i) => ctx.cue(tKnow - .05 + i * .24, 'tick', .35)); ctx.cue(tStands + .1, 'ding', .45);

  return (t) => {
    // ---------- phase A
    const out = tSo - .1;
    const AV = t < out + .9;
    [T1, T2, T3].forEach(T => T.c.style.display = AV ? 'block' : 'none');
    if (AV) {
      [[T1, .15], [T2, tChat - .3]].forEach(([T, s], i) => {
        if (t < out + i * .05) enter(T.c, t, s, { dy: 50, rx: 12 });
        else { const k = A(t, out + i * .05, .35, E.in); set(T.c, { y: 60 * k, s: 1 - .06 * k, o: 1 - k, b: 8 * k }); }
      });
      if (t < out + .1) enter(T3.c, t, tFile - .3, { dy: 50, rx: 12 });
      else { const k = A(t, out + .1, .45, E.io); set(T3.c, { x: lerp(0, 88 + 370 - 1290 - 240, k), y: lerp(0, 232 + 340 - 300 - 220, k), s: lerp(1, 1.2, k), o: 1 - A(t, out + .3, .25), b: 6 * A(t, out + .3, .25) }); }
      b1.update(t, { lookX: .6, lookY: -.5 });
      set(bub, { s: lerp(.6, 1, SP(t, .35, .8)), o: A(t, .35, .2) }); bubDots.forEach((d, i) => set(d, { o: A(t, .3 - i * .05, .2) }));
      const fk = A(t, tForget + .1, .5, E.io);
      memo.forEach((l, i) => set(l, { x: -10 * fk + i * 3 * fk, o: 1 - A(t, tForget + i * .1, .35) }));
      set(qm, { s: lerp(.5, 1, SP(t, tForget + .4, .7)), o: A(t, tForget + .35, .2) });
      chat.style.transform = `translateY(${(-Math.max(0, t - tChat + .3) * 150).toFixed(1)}px)`;
      [[T1, tForget + .2], [T2, tChat + .5], [T3, tFile + .35]].forEach(([T, s]) => { const k = SP(t, s, .7); set(T.mk, { s: k, r: (1 - k) * -60, o: A(t, s, .1) }); });
      set(ring3, { o: A(t, tFile + .35, .3) });
      f3l.forEach((l, i) => set(l, { sx: A(t, tFile - .1 + i * .08, .4) }));
      set(f3, { y: Math.sin(t * 2) * 3 });
    }

    // ---------- phase B
    const bOut = A(t, OUTB, .4, E.in);
    B_.style.display = t >= tSo && bOut < 1 ? 'block' : 'none';
    if (t >= tSo && bOut < 1) {
      set(B_, { y: -50 * bOut, o: 1 - bOut, b: 8 * bOut });
      const bIn = tSo + .15;
      enter(FW, t, bIn, { dy: 60, rx: 10 });
      fhl.style.backgroundSize = `${(A(t, tFolder, .5, E.io) * 100).toFixed(1)}% 38%`;
      set(empty, { o: A(t, bIn + .4, .3) * (1 - A(t, TS[0] - .2, .2)) });
      enter(SM, t, tEach - .5, { dx: 50, dy: 30, rx: 0 });
      shl.style.backgroundSize = `${(A(t, tState, .5, E.io) * 100).toFixed(1)}% 38%`;
      let cur = -1; TS.forEach((s, i) => { if (t >= s - .05) cur = i; });
      rows.forEach(({ r, chp, ck }, i) => {
        const s = TS[i], k = SP(t, s - .1, .8); set(r, { x: -40 * (1 - k), o: A(t, s - .1, .2) });
        const active = i === cur;
        r.style.background = active ? '#fff' : '#f6f7fa';
        r.style.boxShadow = active ? `0 0 0 3px ${files[i][2]},0 16px 34px -14px rgba(30,34,70,.35)` : 'none';
        if (chp) { const kb = SP(t, TB[i], .7); set(chp, { s: lerp(.5, 1, kb), o: A(t, TB[i], .12) }); }
        const kc = SP(t, (TB[i] ?? s) + .15, .6); set(ck, { s: kc, o: A(t, (TB[i] ?? s) + .15, .1) });
      });
      nodes.forEach(({ d, lb, ob, c }, i) => {
        const nk = A(t, tEach - .3 + i * .06, .4), lit = t >= TS[i] - .05, lk = SP(t, TS[i] - .05, .7);
        set(d, { s: lit ? lerp(.7, 1, lk) : lerp(.6, 1, SP(t, tEach - .3 + i * .06, .8)), o: nk });
        d.style.background = lit ? c : '#fff'; d.style.color = lit ? '#fff' : '#b4b7c3';
        d.style.boxShadow = lit ? `0 10px 24px -8px ${c}` : 'inset 0 0 0 4px #e1e3ea';
        d.firstChild.textContent = lit && i < cur ? '✓' : String(i + 1);
        set(lb, { o: nk * (lit ? 1 : .45), y: 8 * (1 - nk) });
        set(ob.el, { o: nk * (i === cur ? 1 : lit ? .6 : .25), s: i === cur ? 1.12 : 1, y: i === cur ? -6 : 0 }); ob.update(t, { lookY: -.6 });
      });
      let pos = 0; TS.forEach((s, i) => { if (i > 0) pos += E.io(P(t, s - .35, s - .05)); });
      railF.style.width = ((NX(5) - NX(0)) * pos / 5).toFixed(1) + 'px';
      set(rail, { o: A(t, tEach - .3, .4) });
      set(tok, { x: NX(0) - 48 + 154 * pos, s: 1 + .06 * Math.sin(t * 6), o: A(t, TS[0] - .1, .3) * (1 - A(t, TS[5] + .3, .3)) });
      enter(rd, t, tEach + .2, { dy: 30, rx: 6 });
      if (cur < 0) { rdName.textContent = '—'; rdName.style.color = '#6b6e7b'; rdNext.textContent = 'waiting for the first file'; }
      else { const [a, b, c] = RD[cur]; rdName.innerHTML = `${a} <span style="font:600 24px Geist;color:#fff;margin-left:12px">${b}</span>`; rdName.style.color = files[cur][2] === '#33c9a6' ? '#7ee0b8' : files[cur][2]; rdNext.textContent = c; }
      const sw = A(t, cur >= 0 ? TS[cur] - .05 : 0, .3, E.quart); set(rdName, { y: 14 * (1 - sw), o: sw }); set(rdNext, { o: sw });
    }

    // ---------- phase C
    const cIn = t >= OUTB + .1;
    C_.style.display = cIn ? 'block' : 'none';
    if (!cIn) return;
    const s0 = OUTB + .15;
    enter(IA, t, s0, { dx: -30, dy: 30, rx: 8 });
    set(ref, { r: (Math.min(t, tRe + 1.3) * 420) % 360 });
    const rk = A(t, tRe, 1.2, E.io); rf.style.width = (rk * 100).toFixed(1) + '%'; rf.style.background = rk >= 1 ? '#5ee39b' : '#ffd66b';
    rt.textContent = rk >= 1 ? 'Rebuilt · memory wiped' : `Rebuilding ${Math.round(rk * 100)}%`;
    rlog.innerHTML = rk >= 1 ? '$ ls projects/  <span style="color:#5ee39b"># files still here</span>' : '$ restoring system…';
    enter(IB, t, tCtx - .3, { dx: -30, dy: 30, rx: 8 });
    b2.update(t, { lookX: .7, lookY: -.4 });
    const fk = A(t, tCtx + .3, .4);
    memL.forEach(l => set(l, { sx: Math.max(.0001, 1 - fk), o: 1 - fk }));
    set(mem, { o: A(t, tCtx + .55, .3), y: 8 * (1 - A(t, tCtx + .55, .4)) });
    set(bubC, { s: lerp(.7, 1, SP(t, tCtx, .8)), o: A(t, tCtx, .2) });
    const dim = A(t, tKnow, .6);
    IA.style.opacity = (A(t, s0, .35) * (1 - .35 * dim)).toFixed(3); IB.style.opacity = (A(t, tCtx - .3, .35) * (1 - .35 * dim)).toFixed(3);
    const lk = SP(t, tLook - .25, .8); set(link, { x: 456 + 40 * (1 - lk), y: 539, o: A(t, tLook - .25, .2) * (1 - A(t, tStands, .3)) });
    const gk = SP(t, tStands, .8); set(glance, { x: 456 + 40 * (1 - gk), y: 539, o: A(t, tStands, .2) });
    enter(WN, t, tLook - .4, { dx: 60, dy: 20, rx: 0 });
    prow.forEach(({ r, pips, badge, n, cnt }, i) => {
      enter(r, t, tLook - .15 + i * .08, { dy: 24, rx: 0, blur: 3 });
      const ks = tKnow - .05 + i * .24;
      pips.forEach((p, j) => { const on = j < n && t >= ks + j * .04; p.style.background = on ? SC[j] : '#e3e5ec'; });
      const kb = SP(t, ks + .15, .7); set(badge, { s: lerp(.5, 1, kb), o: A(t, ks + .15, .12) });
      set(cnt, { o: A(t, ks + .1, .2) });
    });
    const sp = P(t, tKnow - .1, tKnow - .1 + 1.2);
    const row = cl(Math.floor(sp * 5), 0, 4), within = sp * 5 - Math.floor(sp * 5);
    const yy = row === 0 ? 46 : lerp(52 + (row - 1) * 112, 52 + row * 112, E.io(cl(within * 2.2))) - 6;
    set(scan, { y: sp >= 1 ? 52 + 4 * 112 - 6 : yy, o: A(t, tKnow - .1, .2) * (1 - A(t, tKnow + 1.4, .3)) });
  };
};
