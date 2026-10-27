// e17 — the state list is the storyboard: fixing a line = one message, fixing a finished scene = a rewrite → nothing is built until you click Approve
SCENES.e17 = (root, ctx, H) => {
  const { put, h, set, enter, A, SP, E, P, lerp, cl, IC, COL, bot } = H;
  const css = (e, s) => (e.style.cssText += s, e);
  const T = {
    list: ctx.at('list'), sb: ctx.at('storyboard'), fixL: ctx.at('Fixingaline'), msg: ctx.at('onemessage'), fixS: ctx.at('Fixingafinished'), rw: ctx.at('rewrite'),
    nothing: ctx.at('nothing'), built: ctx.at('built'), approve: ctx.at('approve'),
  };
  const tClick = T.approve + .18;

  // ================= left top: fix a line
  const CA = put(root, H.card({ w: 620, h: 300 }), 88, 232);
  const ah = put(CA, h('div', '', 'Fix a line'), 32, 26); css(ah, 'font:800 30px Geist;letter-spacing:-.02em');
  const aCost = put(CA, h('div', '', '1 message'), 0, 28); css(aCost, `left:auto;right:30px;display:inline-flex;align-items:center;height:38px;padding:0 16px;border-radius:999px;background:rgba(58,108,244,.1);color:${COL.blue};font:800 20px Geist;white-space:nowrap`);
  const you = put(CA, h('div', '', 'B3: make the spinner turn slower'), 0, 92); css(you, 'left:auto;right:30px;max-width:440px;padding:12px 18px;border-radius:18px 18px 6px 18px;background:#15161c;color:#fff;font:600 20px Geist;white-space:nowrap');
  const db = bot('director', 48); put(CA, db.el, 30, 156);
  const rep = put(CA, h('div', '', `<span style="width:22px;height:22px;display:inline-block">${IC.check()}</span>Updated line B3 in shotlist.md`), 92, 160); css(rep, 'display:inline-flex;align-items:center;gap:10px;padding:10px 16px;border-radius:18px 18px 18px 6px;background:#f1f2f6;font:600 19px Geist;white-space:nowrap');
  const aTr = put(CA, h('div', ''), 32, 246, 556, 12); css(aTr, 'border-radius:6px;background:#eef0f5;overflow:hidden');
  const aF = aTr.appendChild(h('div', '')); css(aF, `height:100%;width:0;border-radius:6px;background:${COL.blue}`);
  const aLab = put(CA, h('div', '', 'effort'), 32, 266); css(aLab, `font:600 14px Geist;color:${COL.sub};letter-spacing:.1em;text-transform:uppercase`);
  const aSec = put(CA, h('div', 'mono', '~10 seconds'), 0, 264); css(aSec, `left:auto;right:32px;font:600 15px Maple;color:${COL.sub}`);

  // ================= left bottom: fix a finished scene
  const CB = put(root, H.card({ w: 620, h: 352 }), 88, 556);
  const bh = put(CB, h('div', '', 'Fix a finished scene'), 32, 26); css(bh, 'font:800 30px Geist;letter-spacing:-.02em;white-space:nowrap');
  const bCost = put(CB, h('div', '', 'a rewrite'), 0, 28); css(bCost, `left:auto;right:30px;display:inline-flex;align-items:center;height:38px;padding:0 16px;border-radius:999px;background:rgba(245,165,36,.16);color:#b97a0a;font:800 20px Geist;white-space:nowrap`);
  const code = put(CB, h('div', ''), 32, 88, 556, 150); css(code, 'border-radius:14px;background:#16171f;overflow:hidden');
  const CL = [[60, '#c792ea'], [220, '#d8dbe7'], [170, '#ffd66b'], [250, '#d8dbe7'], [130, '#7ee0b8']];
  const cls = CL.map(([w, c], i) => { const l = put(code, h('div', ''), 22 + (i && i < 4 ? 26 : 0), 20 + i * 24, w, 10); css(l, `border-radius:5px;background:${c};opacity:.85`); return l; });
  const steps = ['rewrite code', 're-render', 're-review'].map((s, i) => { const e = put(code, h('div', '', s), 330, 22 + i * 40); css(e, 'display:inline-flex;align-items:center;height:30px;padding:0 12px;border-radius:8px;background:rgba(255,255,255,.08);color:#e8e9f0;font:600 16px Maple;white-space:nowrap'); return e; });
  const bTr = put(CB, h('div', ''), 32, 266, 556, 12); css(bTr, 'border-radius:6px;background:#eef0f5;overflow:hidden');
  const bF = bTr.appendChild(h('div', '')); css(bF, `height:100%;width:0;border-radius:6px;background:${COL.amber}`);
  put(CB, h('div', '', 'effort'), 32, 288).style.cssText += `font:600 14px Geist;color:${COL.sub};letter-spacing:.1em;text-transform:uppercase`;
  const bSec = put(CB, h('div', 'mono', '~an hour of usage'), 0, 286); css(bSec, `left:auto;right:32px;font:600 15px Maple;color:${COL.sub}`);

  // ================= right: storyboard
  const SW = put(root, H.win({ title: 'shotlist.md', w: 1092, h: 676 }), 740, 232);
  const sbChip = put(SW, h('div', '', '= your storyboard'), 196, 8); css(sbChip, `display:inline-flex;align-items:center;height:30px;padding:0 14px;border-radius:15px;background:${COL.blue};color:#fff;font:700 16px Geist;white-space:nowrap`);
  const bpm = put(SW, h('div', 'mono', '120 BPM · 8 beats'), 0, 13); bpm.style.left = 'auto'; bpm.style.right = '20px'; css(bpm, 'font:600 16px Maple;color:#8b90a6');
  const sb = SW.body;
  const ruler = put(sb, h('div', ''), 22, 14, 1048, 54);
  const ticks = [...Array(33)].map((_, i) => { const big = i % 4 === 0; const tk = put(ruler, h('div', ''), i * (1048 / 32) - 1, big ? 22 : 34, 3, big ? 30 : 18); css(tk, `border-radius:2px;background:${big ? '#9a9db0' : '#d5d8e2'}`); if (big && i < 32) put(ruler, h('div', '', String(i / 4 + 1)), i * (1048 / 32) + 6, 0).style.cssText += 'font:700 16px Geist;color:#8b90a6'; return tk; });
  const rhead = put(ruler, h('div', ''), 0, 16, 4, 40); css(rhead, `border-radius:2px;background:${COL.blue}`);
  const TH = [
    '<rect x="40" y="38" width="120" height="40" rx="20" fill="#15161c"/><rect x="86" y="54" width="56" height="8" rx="4" fill="#fff"/><circle cx="62" cy="58" r="7" fill="#2fc7a4"/>',
    '<circle cx="100" cy="58" r="22" fill="#15161c"/>',
    '<circle cx="100" cy="58" r="24" stroke="#e1e3ea" stroke-width="8" fill="none"/><path d="M100 34 A24 24 0 0 1 124 58" stroke="#15161c" stroke-width="8" fill="none" stroke-linecap="round"/>',
    '<circle cx="100" cy="58" r="28" fill="#1fbf75"/><path d="M87 59l9 9 17-18" stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
    '<rect x="50" y="34" width="100" height="44" rx="22" fill="#15161c"/><circle cx="130" cy="56" r="7" fill="#ffd66b"/>',
    '<rect x="36" y="22" width="128" height="72" rx="12" fill="#15161c"/><path d="M92 46v24l20-12z" fill="#fff"/>',
    '<rect x="36" y="50" width="128" height="16" rx="8" fill="#e1e3ea"/><rect x="36" y="50" width="84" height="16" rx="8" fill="#3a6cf4"/><circle cx="120" cy="58" r="12" fill="#fff" stroke="#3a6cf4" stroke-width="4"/>',
    '<rect x="44" y="34" width="112" height="48" rx="24" fill="#15161c"/><text x="100" y="66" text-anchor="middle" font-family="Geist" font-weight="800" font-size="22" fill="#fff">Done</text>',
  ];
  const NM = ['Pill idle', 'Shrink', 'Spinner', 'Check', 'Island', 'Player', 'Progress', 'Done'];
  const cards = NM.map((n, i) => {
    const x = 22 + (i % 4) * 268, y = 88 + Math.floor(i / 4) * 222;
    const c = put(sb, h('div', ''), x, y, 244, 204); css(c, 'border-radius:18px;background:#fff');
    const th = put(c, h('div', '', `<svg viewBox="0 0 200 116" width="212" height="123">${TH[i]}</svg>`), 16, 14, 212, 123); css(th, 'border-radius:12px;background:#f4f4f1;overflow:hidden');
    put(c, h('div', '', `B${i + 1}`), 16, 152).style.cssText += 'font:800 17px Geist;color:#fff;background:#15161c;border-radius:8px;padding:3px 9px';
    const nm = put(c, h('div', '', n), 68, 148); css(nm, 'font:700 23px Geist;white-space:nowrap');
    return { c, nm };
  });
  const editTag = put(cards[2].c, h('div', '', 'slower'), 0, 152); css(editTag, `left:auto;right:14px;display:inline-flex;align-items:center;height:28px;padding:0 10px;border-radius:8px;background:rgba(58,108,244,.12);color:${COL.blue};font:700 15px Geist`);
  const foot = put(sb, h('div', ''), 22, 540, 1048, 68); css(foot, 'border-radius:16px;background:#f6f7fa');
  const lockS = put(foot, h('div', '', IC.lock()), 22, 16, 36, 36);
  const fst = put(foot, h('div', '', ''), 74, 20); css(fst, 'font:600 22px Geist;white-space:nowrap');
  const btn = put(foot, h('div', '', 'Approve'), 0, 11, 180, 46); btn.style.left = 'auto'; btn.style.right = '12px';
  css(btn, 'border-radius:23px;background:#15161c;color:#fff;font:700 21px Geist;display:flex;align-items:center;justify-content:center;gap:8px');
  const cur = H.cursor(root);
  const BX = 740 + 22 + 22 + 1048 - 12 - 90, BY = 232 + 46 + 22 + 540 + 34;

  ctx.cue(.1, 'swoosh', .45); NM.forEach((_, i) => ctx.cue(.35 + i * .13, 'pop', .25)); ctx.cue(T.sb, 'tick', .45);
  ctx.cue(T.fixL, 'pop', .45); ctx.cue(T.msg, 'ding', .4); ctx.cue(T.fixS, 'pop', .45); ctx.cue(T.rw, 'error', .5);
  ctx.cue(T.nothing, 'tick', .4); ctx.cue(tClick, 'click', .7); ctx.cue(tClick + .1, 'ding', .55);

  return (t) => {
    // storyboard
    enter(SW, t, .05, { dy: 40, rx: 8 }); SW.style.translate = `${(-326 * (1 - E.io(P(t, T.fixL - .75, T.fixL - .05)))).toFixed(1)}px 0`;
    set(sbChip, { s: lerp(.4, 1, SP(t, T.sb - .1, .7)), o: A(t, T.sb - .1, .15) });
    set(bpm, { o: A(t, .4, .3) });
    const play = P(t, .3, 1.75);
    rhead.style.left = (play * 1048).toFixed(1) + 'px'; set(rhead, { o: A(t, .2, .2) * (1 - A(t, 1.9, .3)) });
    ticks.forEach((tk, i) => { const on = play > 0 && i / 32 <= play; tk.style.background = on ? (i % 4 === 0 ? COL.blue : '#a9bdf9') : (i % 4 === 0 ? '#9a9db0' : '#d5d8e2'); });
    const ap = t >= tClick + .1;
    cards.forEach(({ c }, i) => {
      enter(c, t, .3 + i * .13, { dy: 30, rx: 14, blur: 4 });
      const ed = i === 2 ? A(t, T.fixL + .1, .3) * (1 - A(t, T.fixS - .1, .4)) : 0;
      const g = ap ? 1 - A(t, tClick + .1 + i * .04, .6) : 0;
      c.style.boxShadow = ap ? `0 0 0 ${(2 + 2 * g).toFixed(1)}px rgba(31,191,117,${(.3 + .6 * g).toFixed(2)}),0 12px 28px -14px rgba(30,34,70,.3)`
        : `0 0 0 ${(1 + 2 * ed).toFixed(1)}px ${ed > .05 ? COL.blue : 'rgba(21,22,28,.08)'},0 12px 28px -14px rgba(30,34,70,.3)`;
    });
    set(editTag, { s: lerp(.5, 1, SP(t, T.msg, .6)), o: A(t, T.msg, .15) });
    enter(foot, t, .9, { dy: 16, rx: 0 });
    const done = t >= tClick;
    fst.innerHTML = done ? `<span style="color:${COL.green}">Approved · the Animator starts building</span>` : t >= T.nothing - .1 ? '<span style="color:#15161c">Nothing gets built until you approve</span>' : `<span style="color:${COL.sub}">Waiting for your review</span>`;
    set(fst, { o: 1, y: t >= T.nothing - .1 && t < T.nothing + .3 ? 8 * (1 - A(t, T.nothing - .1, .3)) : 0 });
    lockS.innerHTML = done ? IC.check() : IC.lock();
    set(lockS, { s: done ? lerp(.4, 1, SP(t, tClick, .6)) : 1 + .15 * Math.max(0, 1 - Math.abs(t - T.built) / .25) });
    btn.innerHTML = done ? '✓ Approved' : 'Approve'; btn.style.background = done ? COL.green : '#15161c';
    const press = t > tClick - .05 && t < tClick + .12 ? .94 : 1;
    set(btn, { s: press * (done ? lerp(.9, 1, SP(t, tClick, .6)) : 1 + .04 * Math.sin(t * 6) * A(t, T.nothing, .3)) });
    cur.update(t, [[T.nothing - .1, 1560, 640], [T.approve - .2, BX - 8, BY - 6], [tClick, BX - 6, BY - 4], [tClick + .9, BX - 200, BY - 160]], [tClick]);
    // fix a line
    enter(CA, t, T.fixL - .3, { dx: -40, dy: 20, rx: 0 });
    const yk = SP(t, T.fixL + .1, .7); set(you, { y: 10 * (1 - yk), s: lerp(.9, 1, yk), o: A(t, T.fixL + .1, .15) });
    db.update(t, { lookX: .6 }); set(db.el, { o: A(t, T.msg - .2, .2) });
    const rk = SP(t, T.msg - .1, .7); set(rep, { y: 10 * (1 - rk), o: A(t, T.msg - .1, .15) });
    set(aCost, { s: lerp(.5, 1, SP(t, T.msg, .6)), o: A(t, T.msg, .15) });
    aF.style.width = (4 * A(t, T.msg, .4)).toFixed(1) + '%'; set(aSec, { o: A(t, T.msg + .2, .3) });
    // fix a finished scene
    enter(CB, t, T.fixS - .3, { dx: -40, dy: 20, rx: 0 });
    const red = A(t, T.rw, .3);
    cls.forEach((l, i) => { const k = A(t, T.rw + i * .07, .2); l.style.background = k > .5 ? COL.red : CL[i][1]; set(l, { sx: 1 - .6 * A(t, T.rw + .2 + i * .07, .3) }); l.style.transformOrigin = 'left'; });
    steps.forEach((e, i) => { const s = T.rw + .1 + i * .22, k = SP(t, s, .6); set(e, { x: 16 * (1 - k), o: A(t, s, .15) }); e.style.background = t >= s ? 'rgba(245,165,36,.22)' : 'rgba(255,255,255,.08)'; });
    set(bCost, { s: lerp(.5, 1, SP(t, T.rw, .6)), o: A(t, T.rw, .15) });
    bF.style.width = (100 * A(t, T.rw + .1, 1.1, E.io)).toFixed(1) + '%'; set(bSec, { o: A(t, T.rw + .6, .3) });
    // after the click: left cards settle back
    const dimL = A(t, T.nothing, .5) * .3; CA.style.opacity = (A(t, T.fixL - .3, .35) * (1 - dimL)).toFixed(3); CB.style.opacity = (A(t, T.fixS - .3, .35) * (1 - dimL)).toFixed(3);
  };
};
