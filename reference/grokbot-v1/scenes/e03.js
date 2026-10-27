// e03 — the plan: five bots, one job each, handing work along a belt while you sleep
SCENES.e03 = (root, ctx, H) => {
  const { put, h, set, enter, A, SP, E, P, bot, BOTS, BOT_ORDER, lerp, cl, IC } = H;
  const tFive = ctx.at('five bots'), tJob = ctx.at('one job'), tHand = ctx.at('handing'), tSleep = ctx.at('while you sleep');
  const css = (el, s) => { el.style.cssText += s; return el; };
  const moon = put(root, h('div', '', IC.moon()), 1680, 76, 110, 110);
  const glow = css(put(root, h('div', ''), 1580, -24, 310, 310), 'border-radius:50%;background:radial-gradient(circle,rgba(255,214,107,.32),rgba(255,214,107,0) 65%)');
  const roles = { director: ['Plans', 'shot list + spec'], animator: ['Builds', 'writes the code'], render: ['Renders', 'the only render queue'], critic: ['Judges', 'grades, never writes'], delivery: ['Ships', 'ready by morning'] };
  const cards = BOT_ORDER.map((k, i) => {
    const x = 112 + i * 344;
    const c = css(put(root, h('div', ''), x, 262, 320, 400), 'border-radius:28px;background:linear-gradient(180deg,rgba(255,255,255,.13),rgba(255,255,255,.04));box-shadow:inset 0 0 0 1px rgba(255,255,255,.15),0 30px 60px -20px rgba(0,0,0,.55);backdrop-filter:blur(8px)');
    const halo = css(put(c, h('div', ''), 60, 10, 200, 200), `border-radius:50%;background:radial-gradient(closest-side,color-mix(in srgb,${BOTS[k].c} 45%,transparent),transparent)`);
    const b = bot(k, 124); put(c, b.el, 98, 44);
    css(put(c, h('div', '', BOTS[k].name), 0, 196, 320), 'font:800 36px Geist;color:#fff;text-align:center;letter-spacing:-.01em');
    const job = put(c, h('div', '', `<div style="font:700 26px Geist;color:${BOTS[k].c}">${roles[k][0]}</div><div style="font:500 21px Geist;color:rgba(255,255,255,.62);margin-top:4px">${roles[k][1]}</div>`), 0, 252, 320); job.style.textAlign = 'center';
    const one = css(put(c, h('div', 'mono', '1 job'), 24, 22, null, 30), 'display:flex;align-items:center;padding:0 12px;border-radius:999px;background:rgba(255,255,255,.1);font:600 17px Maple;color:rgba(255,255,255,.75)');
    const st = css(put(c, h('div', ''), 28, 352, 264, 8), 'border-radius:4px;background:rgba(255,255,255,.1);overflow:hidden');
    const fill = st.appendChild(h('div', '')); fill.style.cssText = `height:100%;width:0;border-radius:4px;background:${BOTS[k].c}`;
    return { c, b, fill, job, one, halo, i, k };
  });
  // handoff arrows between cards
  const arrows = [0, 1, 2, 3].map(i => put(root, h('div', '', `<svg viewBox="0 0 26 26" width="26" height="26"><path d="M4 13h16M14 7l6 6-6 6" stroke="rgba(255,255,255,.7)" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`), 112 + i * 344 + 320 - 1, 449, 26, 26));
  // belt + clips
  const belt = css(put(root, h('div', ''), 100, 752, 1720, 6), 'border-radius:3px;background:repeating-linear-gradient(90deg,rgba(255,255,255,.22) 0 20px,transparent 20px 34px)');
  const clips = [...Array(7)].map((_, i) => { const c = css(put(root, h('div', ''), 0, 704, 100, 66), 'border-radius:13px;background:#fff;box-shadow:0 14px 28px -10px rgba(0,0,0,.6)'); const th = c.appendChild(h('div', '')); th.style.cssText = 'margin:9px;height:48px;border-radius:7px'; return { c, th, i }; });
  const zz = put(root, h('div', '', `<span class="mono" style="color:#ffd66b">21:00 → 07:00</span><span>while you sleep</span><span class="z">z</span><span class="z" style="font-size:.8em">z</span>`), 112, 832);
  css(zz, 'display:flex;align-items:baseline;gap:14px;font:700 28px Geist;color:#fff;white-space:nowrap');
  const zs = [...zz.querySelectorAll('.z')];
  BOT_ORDER.forEach((_, i) => ctx.cue(tFive - .2 + i * .08, 'pop', .45)); ctx.cue(tHand, 'swoosh', .5); ctx.cue(tJob, 'tick', .4);
  return (t) => {
    set(moon, { y: 30 * (1 - SP(t, .1, 1.2)), r: -20 * (1 - SP(t, .1, 1.2)) + Math.sin(t * .8) * 3, o: A(t, .1, .4) }); set(glow, { o: A(t, .2, .8) * (.8 + .2 * Math.sin(t * 2)) });
    cards.forEach(({ c, b, fill, job, one, halo, i }) => {
      enter(c, t, tFive - .3 + i * .08, { dy: 90, rx: 18 }); b.update(t, { lookX: -.6 + i * .3 });
      const jk = A(t, tJob + i * .1, .4); set(job, { y: 12 * (1 - jk), o: jk }); set(one, { s: lerp(.6, 1, SP(t, tJob + i * .1, .6)), o: jk });
      const work = P(t, tHand + i * .3, tHand + i * .3 + 1.1); fill.style.width = (E.io(work) * 100).toFixed(1) + '%';
      halo.style.opacity = (.35 + .65 * work) * (.8 + .2 * Math.sin(t * 3 + i));
    });
    arrows.forEach((a, i) => { const k = A(t, tHand + i * .2, .35); set(a, { x: -8 * (1 - k) + 3 * Math.sin(t * 5 + i) * k, o: k }); });
    const bk = A(t, tJob - .4, .6);
    set(belt, { o: bk }); belt.style.backgroundPosition = `${(t * 90) % 34}px 0`;
    clips.forEach(({ c, th, i }) => {
      const x = ((t * 180 + i * 270) % 1900) - 120; const stg = cl(Math.floor((x - 112) / 344), -1, 4);
      th.style.background = stg < 0 ? 'repeating-linear-gradient(45deg,#eceef4 0 6px,#f6f7fa 6px 12px)' : ['#dff6ee', '#ffe9c7', '#e3e4ff', '#efe4ff', '#dbeaff'][stg];
      set(c, { x, y: -8 * Math.max(0, Math.sin((x - 112) / 344 * Math.PI * 2)), o: bk * cl((x + 80) / 200) * cl((1880 - x) / 200) });
    });
    set(zz, { x: -16 * (1 - A(t, tSleep - .1, .5)), o: A(t, tSleep - .1, .4) });
    zs.forEach((z, i) => { const ph = (t * .8 + i * .4) % 1; set(z, { y: -14 * ph, o: Math.sin(ph * Math.PI) }); });
  };
};
