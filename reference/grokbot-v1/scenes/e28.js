// e28 — the point: one beautiful video (the viral clip) -> the studio makes the next hundred while you sleep. Calm end hold.
SCENES.e28 = (root, ctx, H) => {
  const { put, h, set, enter, A, SP, E, P, lerp, cl, bot, BOTS, BOT_ORDER, IC, rnd } = H;
  const D = (p, x, y, w, hh, css = '', html = '') => { const e = put(p, h('div', '', html), x, y, w, hh); if (css) e.style.cssText += ';' + css; return e; };
  const T = { viral: ctx.at('viral'), proved: ctx.at('proved'), one: ctx.at('onebeautiful'), beaut: ctx.at('beautiful'), studio: ctx.at('studio'), next: ctx.at('next'), hund: ctx.at('hundred'), sleep: ctx.at('sleep'), whl: ctx.at('while') };
  const PAL = ['#dff6ee', '#ffe9c7', '#e3e4ff', '#efe4ff', '#dbeaff', '#ffe0d6'];
  // ---------- left: the one viral video
  const LC = put(root, H.card({ w: 580, h: 560 }), 110, 290);
  const th = D(LC, 24, 24, 532, 300, 'border-radius:16px;overflow:hidden;background:linear-gradient(135deg,#e9e4ff,#dff3ff 55%,#fff1df)');
  const s1 = D(th, 70, 70, 150, 150, 'border-radius:50%;background:#8b5cf6;box-shadow:0 20px 40px -14px rgba(139,92,246,.7)');
  const s2 = D(th, 250, 120, 210, 64, 'border-radius:32px;background:#15161c');
  const s3 = D(th, 300, 60, 46, 46, 'border-radius:14px;background:#f5a524');
  const play = D(th, 236, 120, 60, 60, 'border-radius:50%;background:rgba(255,255,255,.92);display:flex;align-items:center;justify-content:center;box-shadow:0 10px 24px -8px rgba(0,0,0,.35)', '<svg width="24" height="24" viewBox="0 0 24 24"><path d="M8 5l11 7-11 7z" fill="#15161c"/></svg>');
  const scrub = D(th, 20, 278, 492, 6, 'border-radius:3px;background:rgba(21,22,28,.12);overflow:hidden'); const sf = D(scrub, 0, 0, 0, 6, 'border-radius:3px;background:#15161c');
  D(LC, 30, 348, 520, 38, 'font:800 30px Geist;letter-spacing:-.015em;white-space:nowrap', 'One beautiful video');
  D(LC, 30, 392, 520, 28, 'font:600 20px Geist;color:#8a8d99;white-space:nowrap', 'One prompt · one session · one clip');
  const stats = D(LC, 30, 446, 520, 44, 'display:flex;gap:12px;align-items:center');
  const st1 = stats.appendChild(h('span', '', '1.2M views')); const st2 = stats.appendChild(h('span', '', '21K saves'));
  [st1, st2].forEach(e => e.style.cssText = 'height:42px;padding:0 18px;border-radius:999px;background:#f3f4f7;font:800 19px Geist;color:#15161c;display:flex;align-items:center;white-space:nowrap');
  const proof = D(LC, 30, 500, 520, 36, 'display:flex;align-items:center;gap:10px;font:800 19px Geist;color:#119a5a;white-space:nowrap', `<span style="width:24px;height:24px">${IC.check()}</span>Proof a model can do it`);
  // ---------- arrow
  const arrow = D(root, 716, 534, 72, 72, 'border-radius:50%;background:#15161c;display:flex;align-items:center;justify-content:center;box-shadow:0 14px 30px -12px rgba(0,0,0,.5)', '<svg width="34" height="34" viewBox="0 0 24 24"><path d="M5 12h13m-5-5l5 5-5 5" stroke="#fff" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>');
  // ---------- right: the studio, a hundred films
  const RX = 818, RY = 232, RW = 1012, RH = 680;
  const RC = put(root, H.card({ w: RW, h: RH }), RX, RY);
  const head = D(RC, 0, 0, RW, 92, 'background:linear-gradient(180deg,#f8f8fb,#fff)');
  D(head, 32, 26, 300, 40, 'font:800 28px Geist;letter-spacing:-.015em;white-space:nowrap', 'The studio');
  const minis = BOT_ORDER.map((k, i) => { const b = bot(k, 40); put(head, b.el, 196 + i * 44, 24); return b; });
  const sleepC = D(head, 440, 26, 230, 40, 'border-radius:999px;background:#1d2552;color:#fff;font:800 18px Geist;display:flex;align-items:center;justify-content:center;gap:8px;white-space:nowrap', `<span style="width:24px;height:24px">${IC.moon()}</span>while you sleep`);
  const cnt = D(head, 690, 10, 292, 72, 'display:flex;align-items:baseline;justify-content:flex-end;gap:10px;white-space:nowrap');
  const cntN = cnt.appendChild(h('span', '', '0')); cntN.style.cssText = 'font:800 58px Geist;letter-spacing:-.03em;font-variant-numeric:tabular-nums';
  const cntL = cnt.appendChild(h('span', '', 'films')); cntL.style.cssText = 'font:700 22px Geist;color:#6b6e7b';
  D(RC, 32, 92, RW - 64, 1, 'background:rgba(21,22,28,.08)');
  const COLS = 10, TW = 88, TH = 48, GX = 6.4, GY = 6, GX0 = (RW - (COLS * TW + (COLS - 1) * GX)) / 2, GY0 = 110;
  const tStart = T.studio + .5, tEnd = T.sleep + .1;
  const tiles = [...Array(100)].map((_, i) => {
    const c = i % COLS, r = Math.floor(i / COLS), x = GX0 + c * (TW + GX), y = GY0 + r * (TH + GY);
    const sk = D(RC, x, y, TW, TH, 'border-radius:9px;box-shadow:inset 0 0 0 1.5px #eceef3');
    const f = D(RC, x, y, TW, TH, `border-radius:9px;background:${PAL[(i * 7 + r) % 6]};box-shadow:0 0 0 1px rgba(21,22,28,.05)`);
    const sw = 14 + rnd(i + 3) * 30, shp = D(f, TW / 2 - sw / 2 + (rnd(i + 8) - .5) * 20, TH / 2 - 7, sw, 14, `border-radius:7px;background:${rnd(i + 11) > .7 ? '#8b5cf6' : '#15161c'}`);
    const ck = D(f, TW - 20, 5, 15, 15, '', IC.check());
    // diagonal wave order with slight jitter
    const order = (c + r) / 18 + rnd(i + 21) * .06;
    return { sk, f, ck, s: lerp(tStart, tEnd - .25, cl(order)), r, c };
  });

  ctx.cue(.2, 'swoosh', .5); ctx.cue(T.beaut, 'ding', .4); ctx.cue(T.studio - .1, 'whoosh', .5); ctx.cue(T.next, 'pop', .4); ctx.cue(T.sleep, 'swoosh', .35);

  return (t) => {
    enter(LC, t, T.viral - .2, { dy: 60, rx: 10 });
    set(s1, { y: Math.sin(t * 1.4) * 8, s: 1 + .04 * Math.sin(t * 1.1) }); set(s2, { x: Math.sin(t * .9 + 1) * 10 }); set(s3, { r: t * 30, y: Math.cos(t * 1.2) * 6 });
    set(play, { o: 1 - A(t, T.proved, .3) });
    sf.style.width = (492 * ((t * .14) % 1)).toFixed(1) + 'px';
    [st1, st2].forEach((e, i) => set(e, { o: A(t, T.proved - .1 + i * .15, .3), y: 10 * (1 - SP(t, T.proved - .1 + i * .15, .6)) }));
    const bk = SP(t, T.beaut - .05, .8);
    set(th, { s: 1 + .025 * Math.sin(Math.PI * cl((t - T.beaut + .05) / .7)) });
    th.style.boxShadow = `0 0 0 ${(4 * A(t, T.beaut - .05, .3)).toFixed(1)}px rgba(139,92,246,.35)`;
    set(proof, { o: A(t, T.beaut + .1, .3), x: 12 * (1 - A(t, T.beaut + .1, .4)) });
    set(arrow, { s: lerp(.4, 1, SP(t, T.studio - .25, .7)), x: -20 * (1 - A(t, T.studio - .25, .5)), o: A(t, T.studio - .25, .2) });
    enter(RC, t, T.studio - .15, { dy: 60, rx: 10 });
    minis.forEach((b, i) => { b.update(t); set(b.el, { s: lerp(.4, 1, SP(t, T.studio + .1 + i * .07, .7)), o: A(t, T.studio + .1 + i * .07, .2) }); });
    let n = 0;
    tiles.forEach(o => {
      const k = SP(t, o.s, .6), on = A(t, o.s, .15); if (t >= o.s + .05) n++;
      const glow = .92 + .08 * Math.sin(t * 1.6 - (o.c + o.r) * .5);
      set(o.f, { s: lerp(.5, 1, k), o: on * (t > tEnd + .4 ? glow : 1) });
      set(o.sk, { o: 1 - on });
      set(o.ck, { s: lerp(.2, 1, SP(t, o.s + .25, .5)), o: A(t, o.s + .25, .1) });
    });
    cntN.textContent = n; set(cntN, { s: 1 + .12 * Math.sin(Math.PI * P(t, tEnd, tEnd + .4)) });
    set(cnt, { o: A(t, T.next - .2, .3) });
    set(sleepC, { o: A(t, T.whl - .05, .3), s: lerp(.7, 1, SP(t, T.whl - .05, .7)) });
  };
};
