// e13 — the roster: five role cards, each revealed on its name, with a live prop showing the job
SCENES.e13 = (root, ctx, H) => {
  const { put, h, set, enter, A, SP, E, P, lerp, cl, COL, bot, BOTS, BOT_ORDER, IC } = H;
  const css = (e, s) => (e.style.cssText += s, e);
  const T = {
    roster: ctx.at('roster'), dir: ctx.at('Director'), req: ctx.at('request'), brief: ctx.at('brief'), sb: ctx.at('storyboard'), owns: ctx.at('owns'), deliv: ctx.at('delivery'),
    ani: ctx.at('Animator'), code: ctx.at('code'), ren: ctx.at('Render'), only: ctx.at('only'), cri: ctx.at('Critic'), score: ctx.at('scores'), never: ctx.at('never'),
    del: ctx.at('Delivery'), hands: ctx.at('hands'), file: ctx.at('finishedfile'),
  };
  const NAME_T = [T.dir, T.ani, T.ren, T.cri, T.del];
  const DESC = ['Owns it from request to delivery', 'Writes the film as code', 'The only one allowed to render', 'Scores. Never writes code.', 'Hands you the finished file'];
  const ROLE = ['PLAN', 'BUILD', 'RENDER', 'JUDGE', 'SHIP'];
  const CW = 324, GAP = (1744 - 5 * CW) / 4, CY = 316, CH = 594;
  const cx = i => 88 + i * (CW + GAP);
  // ---- pipeline track
  const TY = 252;
  const pIn = put(root, h('div', '', 'Request'), 88, TY - 20, 116, 40), pOut = put(root, h('div', '', 'Delivered'), 1832 - 128, TY - 20, 128, 40);
  [pIn, pOut].forEach(p => css(p, 'border-radius:999px;background:#15161c;color:#fff;font:700 18px Geist;display:flex;align-items:center;justify-content:center'));
  const L0 = 216, L1 = 1692;
  const line = put(root, h('div', ''), L0, TY - 2, L1 - L0, 4); css(line, 'border-radius:2px;background:rgba(21,22,28,.12);transform-origin:left');
  const span = put(root, h('div', ''), L0, TY - 4, L1 - L0, 8); css(span, `border-radius:4px;background:${BOTS.director.c};transform-origin:left`);
  const owns = put(root, h('div', '', 'Director owns the whole path'), 0, TY - 54); css(owns, `left:50%;margin-left:-150px;width:300px;text-align:center;font:600 17px Geist;color:${BOTS.director.c};white-space:nowrap`);
  const nodes = BOT_ORDER.map((k, i) => { const n = put(root, h('div', ''), cx(i) + CW / 2 - 11, TY - 11, 22, 22); css(n, `border-radius:50%;background:#fff;box-shadow:0 0 0 4px ${BOTS[k].c}`); return n; });
  const runner = put(root, h('div', ''), 0, TY - 9, 18, 18); css(runner, 'border-radius:50%;background:#15161c;box-shadow:0 0 0 4px #fff');
  // ---- cards
  const cards = BOT_ORDER.map((k, i) => {
    const c = put(root, H.card({ w: CW, h: CH }), cx(i), CY);
    const band = put(c, h('div', ''), 0, 0, CW, 170); band.style.background = `color-mix(in srgb,${BOTS[k].c} 13%,#fff)`;
    const b = bot(k, 112); const bw = put(c, h('div', ''), CW / 2 - 56, 32, 112, 112); bw.appendChild(b.el);
    const nm = put(c, h('div', '', BOTS[k].name), 26, 190); css(nm, 'font:800 34px Geist;letter-spacing:-.02em');
    const rl = put(c, h('div', '', ROLE[i]), 0, 198); css(rl, `left:auto;right:24px;display:inline-flex;align-items:center;height:30px;padding:0 12px;border-radius:999px;background:color-mix(in srgb,${BOTS[k].c} 14%,#fff);color:${BOTS[k].c};font:800 14px Geist;letter-spacing:.1em`);
    const desc = put(c, h('div', '', DESC[i]), 26, 246, CW - 52); css(desc, 'font:700 24px/1.28 Geist;letter-spacing:-.01em;color:#15161c');
    const prop = put(c, h('div', ''), 20, 340, CW - 40, 232); css(prop, 'border-radius:16px;background:#f6f7fb;overflow:hidden;box-shadow:inset 0 0 0 1px rgba(21,22,28,.05)');
    const ph = put(c, h('div', ''), 20, 340, CW - 40, 232); css(ph, 'border-radius:16px;border:2.5px dashed rgba(21,22,28,.1)');
    const dl = [0, 1].map(j => { const e = put(c, h('div', ''), 26, 254 + j * 30, j ? 150 : 230, 14); css(e, 'border-radius:7px;background:#eef0f5'); return e; });
    return { k, c, b, bw, nm, rl, desc, prop, ph, dl, i };
  });
  const P_ = cards.map(c => c.prop), PW = CW - 40;
  // Director: brief → storyboard → … → delivery
  const STEP = ['Brief', 'Storyboard', 'Code · Render', 'Review', 'Delivery'];
  const STEP_T = [T.brief, T.sb, T.sb + .45, T.sb + .9, T.deliv];
  const steps = STEP.map((s, j) => {
    const r = put(P_[0], h('div', ''), 22, 18 + j * 41, PW - 44, 34); css(r, 'display:flex;align-items:center;gap:12px;font:600 19px Geist;white-space:nowrap');
    const d = r.appendChild(h('span', '')); d.style.cssText = `width:16px;height:16px;border-radius:50%;flex:none;box-shadow:0 0 0 3px ${BOTS.director.c};background:#fff`;
    r.appendChild(h('span', '', s)); return { r, d };
  });
  const vline = put(P_[0], h('div', ''), 29, 34, 3, 164); css(vline, `background:${BOTS.director.c};transform-origin:top;border-radius:2px`);
  P_[0].insertBefore(vline, P_[0].firstChild);
  // Animator: code
  P_[1].style.background = '#16171f';
  const codeEl = put(P_[1], h('div', 'term', ''), 18, 14); css(codeEl, 'font-size:18px;line-height:1.6');
  const CODE = 'frame(t) {\n  x = spring(t)\n  draw(x)\n}';
  const aPrev = put(P_[1], h('div', ''), 18, 178, PW - 36, 36); css(aPrev, 'border-radius:8px;background:rgba(255,255,255,.06)');
  const aDot = put(aPrev, h('div', ''), 0, 6, 24, 24); css(aDot, `border-radius:7px;background:${BOTS.animator.c}`);
  // Render: single queue with lock
  const lockB = put(P_[2], h('div', '', `<span style="width:22px;height:22px;display:block">${IC.lock()}</span>One render queue`), 18, 16); css(lockB, 'display:flex;align-items:center;gap:8px;font:700 18px Geist;white-space:nowrap');
  const jobs = [0, 1, 2].map(j => {
    const r = put(P_[2], h('div', ''), 18, 58 + j * 56, PW - 36, 46); css(r, 'border-radius:10px;background:#fff;box-shadow:0 0 0 1px rgba(21,22,28,.07);display:flex;align-items:center;gap:10px;padding:0 12px');
    r.innerHTML = `<span class="mono" style="font:600 16px Maple;width:52px;flex:none">job ${j + 1}</span>`;
    const tr = r.appendChild(h('span', '')); tr.style.cssText = 'flex:1;height:8px;border-radius:4px;background:#eceef4;overflow:hidden;display:block';
    const f = tr.appendChild(h('i', '')); f.style.cssText = `display:block;height:100%;width:0;background:${BOTS.render.c};border-radius:4px`;
    const st = r.appendChild(h('span', 'mono', '')); st.style.cssText = 'width:64px;flex:none;text-align:right;font:600 15px Maple;white-space:nowrap';
    return { r, f, st };
  });
  // Critic: score, no code
  const scoreN = put(P_[3], h('div', '', ''), 0, 50, PW, 70); css(scoreN, `text-align:center;font:800 64px/1 Geist;color:${BOTS.critic.c};letter-spacing:-.03em`);
  const scoreBars = ['Pacing', 'Type', 'Motion'].map((s, j) => {
    const r = put(P_[3], h('div', ''), 22, 128 + j * 32, PW - 44, 24); css(r, 'display:flex;align-items:center;gap:10px;font:600 16px Geist');
    r.innerHTML = `<span style="width:58px">${s}</span>`;
    const tr = r.appendChild(h('span', '')); tr.style.cssText = 'flex:1;height:8px;border-radius:4px;background:#eceef4;overflow:hidden;display:block';
    const f = tr.appendChild(h('i', '')); f.style.cssText = `display:block;height:100%;width:0;background:${BOTS.critic.c};border-radius:4px`; return f;
  });
  const noCode = put(P_[3], h('div', '', '<span class="strike nc">&lt;/&gt; writes code</span>'), 14, 12); css(noCode, `display:inline-flex;align-items:center;height:30px;padding:0 10px;border-radius:999px;background:#fff;box-shadow:0 0 0 1px rgba(21,22,28,.08);font:600 15px Geist;color:${COL.sub};white-space:nowrap`);
  const ncS = noCode.querySelector('.nc');
  // Delivery: file → you
  const film = put(P_[4], h('div', '', `<span style="width:30px;height:30px;display:block">${IC.file('#cfe0ff')}</span><span class="mono" style="font:700 17px Maple">film.mp4</span>`), 18, 28); css(film, 'display:flex;align-items:center;gap:8px;height:52px;padding:0 14px;border-radius:12px;background:#fff;box-shadow:0 0 0 1px rgba(21,22,28,.07),0 8px 16px -10px rgba(30,34,70,.3);white-space:nowrap');
  const you = put(P_[4], h('div', '', 'You'), PW / 2 - 40, 122, 80, 80); css(you, `border-radius:50%;background:${BOTS.delivery.c};color:#fff;font:800 24px Geist;display:flex;align-items:center;justify-content:center;box-shadow:0 12px 24px -10px ${BOTS.delivery.c}`);
  const youOk = put(P_[4], h('div', '', IC.check()), PW / 2 + 22, 114, 34, 34);
  const arrived = put(P_[4], h('div', '', `<span class="mono" style="font:700 17px Maple">film.mp4</span><span style="font:600 16px Geist;color:${COL.green}">Delivered · 08:00</span>`), 18, 28); css(arrived, 'display:flex;flex-direction:column;gap:2px;white-space:nowrap');
  const sun = put(P_[4], h('div', '', IC.sun()), PW - 62, 140, 46, 46);

  ctx.cue(T.roster, 'swoosh', .4); BOT_ORDER.forEach((_, i) => ctx.cue(T.roster + .3 + i * .08, 'pop', .35));
  NAME_T.forEach(n => ctx.cue(n, 'tick', .5)); ctx.cue(T.owns, 'whoosh', .4); ctx.cue(T.never, 'error', .35); ctx.cue(T.file, 'ding', .6);

  return (t) => {
    // track
    set(pIn, { o: A(t, .1, .3), x: -14 * (1 - A(t, .1, .5)) }); set(pOut, { o: A(t, .2, .3), x: 14 * (1 - A(t, .2, .5)) });
    set(line, { sx: A(t, .15, .8, E.io) });
    const sp = E.io(P(t, T.owns - .1, T.deliv + .4));
    set(span, { sx: Math.max(.0001, sp), o: (t > T.owns - .1 ? 1 : 0) * lerp(1, .35, A(t, T.ani - .2, .5)) });
    set(owns, { o: A(t, T.owns, .35) * (1 - A(t, T.ani - .2, .4)), y: 8 * (1 - A(t, T.owns, .5)) });
    nodes.forEach((n, i) => { const s = T.roster + i * .08, k = SP(t, s, .6); set(n, { s: lerp(.3, 1, k) * (1 + .3 * Math.max(0, 1 - Math.abs(t - NAME_T[i] - .1) / .2)), o: A(t, s, .15) }); n.style.background = t >= NAME_T[i] ? BOTS[BOT_ORDER[i]].c : '#fff'; });
    let rx = L0; for (let i = 0; i < 5; i++) { const k = E.io(P(t, NAME_T[i] - .25, NAME_T[i] + .2)); rx = lerp(rx, cx(i) + CW / 2 - 9, k); }
    rx = lerp(rx, L1 - 9, E.io(P(t, T.file, T.file + .5)));
    set(runner, { x: rx, o: A(t, T.dir - .3, .2) });
    // cards
    let active = -1; NAME_T.forEach((n, i) => { if (t >= n - .15) active = i; });
    cards.forEach(({ k, c, b, bw, nm, rl, desc, prop, ph, dl, i }) => {
      const s = T.roster - .15 + i * .08; enter(c, t, s, { dy: 70, rx: 14 });
      const bs = T.roster + .3 + i * .08, bk = SP(t, bs, .9); set(bw, { y: -60 * (1 - bk), s: lerp(.5, 1, bk), o: A(t, bs, .15) });
      b.update(t, { lookX: active === i ? 0 : (active > i ? .6 : -.6), bob: active === i ? 3.2 : 2 });
      const nt = NAME_T[i], on = A(t, nt - .1, .35);
      set(nm, { o: lerp(.3, 1, on) }); set(rl, { o: lerp(.3, 1, on) });
      const dk = SP(t, nt + .15, .8); set(desc, { y: 14 * (1 - dk), o: A(t, nt + .15, .25) }); dl.forEach(e => set(e, { o: 1 - A(t, nt + .1, .25) }));
      const pk = SP(t, nt + .3, .9); set(prop, { y: 20 * (1 - pk), s: lerp(.95, 1, pk), o: A(t, nt + .3, .25) }); set(ph, { o: 1 - A(t, nt + .3, .25) });
      const lift = (active === i ? 1 : 0) * A(t, nt - .15, .4, E.quart);
      c.style.boxShadow = `0 0 0 ${(3 * lift).toFixed(2)}px ${BOTS[k].c},0 ${18 + 20 * lift}px ${50 + 30 * lift}px -12px rgba(30,34,70,${(.18 + .12 * lift).toFixed(3)}),0 4px 12px rgba(30,34,70,.06)`;
      c.style.translate = `0 ${(-12 * lift).toFixed(2)}px`;
    });
    // Director steps
    steps.forEach(({ r, d }, j) => { const k = A(t, STEP_T[j] - .05, .25); d.style.background = k > .5 ? BOTS.director.c : '#fff'; set(r, { o: lerp(.4, 1, k) }); });
    set(vline, { sy: Math.max(.0001, E.io(P(t, T.brief, T.deliv + .1))) });
    // Animator code
    H.type(codeEl, CODE, t, T.code - .25, 40, t < T.ren);
    codeEl.innerHTML = codeEl.innerHTML.replace(/(frame|spring|draw)/g, '<span class="y">$1</span>');
    set(aDot, { x: (PW - 36 - 24) * (.5 + .5 * Math.sin((t - T.code) * 2.4)), o: A(t, T.code + .6, .3) });
    // Render queue: strictly one at a time
    jobs.forEach(({ r, f, st }, j) => {
      const s = T.only - .2 + j * .8, k = cl((t - s) / .8);
      f.style.width = (k * 100).toFixed(1) + '%';
      st.textContent = k >= 1 ? 'done' : k > 0 ? `${Math.round(k * 100)}%` : 'queued';
      st.style.color = k >= 1 ? COL.green : k > 0 ? BOTS.render.c : COL.sub;
      r.style.boxShadow = k > 0 && k < 1 ? `0 0 0 2px ${BOTS.render.c}` : '0 0 0 1px rgba(21,22,28,.07)';
    });
    // Critic
    H.count(scoreN, 0, 8.6, E.out(P(t, T.score - .1, T.score + .8)), 1);
    scoreBars.forEach((f, j) => f.style.width = (E.io(P(t, T.score + j * .12, T.score + .6 + j * .12)) * [88, 80, 92][j]).toFixed(1) + '%');
    set(noCode, { o: A(t, T.never - .3, .3) }); H.strike(ncS, A(t, T.never + .1, .35, E.io));
    // Delivery
    const fk = E.io(P(t, T.hands, T.file + .1));
    set(film, { x: lerp(0, (PW - 36) / 2 - 80, fk), y: lerp(0, 94, fk), s: lerp(1, .5, fk), o: 1 - A(t, T.file + .05, .2) });
    const yk = SP(t, T.file + .1, .7); set(you, { s: 1 + .12 * Math.max(0, 1 - Math.abs(t - T.file - .15) / .25) });
    set(youOk, { s: lerp(.2, 1, yk), o: A(t, T.file + .1, .12) });
    set(arrived, { o: A(t, T.file + .3, .3), y: 8 * (1 - A(t, T.file + .3, .4)) });
    set(sun, { r: t * 20, o: A(t, T.del + .4, .4) });
  };
};
