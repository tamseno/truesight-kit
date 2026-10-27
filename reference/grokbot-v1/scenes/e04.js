// e04 — Musk's post: Grok Bot uses the best back-end model per task (incl. Claude Opus 5.5) · the routing follow-up · per-token price unchanged
SCENES.e04 = (root, ctx, H) => {
  const { put, h, set, enter, A, SP, E, P, lerp, cl, card, grok, IC } = H;
  const T = {
    oct: ctx.at('October'), musk: ctx.at('Elon Musk'), grok: ctx.at('Grok Bot'), best: ctx.at('best back end'), claude: ctx.at('Claude Opus'), v55: ctx.at('5.5'),
    simple: ctx.at('Simple questions'), small: ctx.at('small'), fast: ctx.at('fast models'), hard: ctx.at('Hard ones'), large: ctx.at('large models'),
    and: ctx.at('And routing'), opus2: ctx.at('Opus', 1), change: ctx.at("doesn't change"), pay: ctx.at('pay per token'),
  };
  const css = (el, s) => { el.style.cssText += s; return el; };
  const OR = '#d9643a';
  const VER = `<svg viewBox="0 0 24 24" width="26" height="26"><path d="M12 1.5l2.6 2 3.2-.3 1 3.1 2.8 1.6-.9 3.1.9 3.1-2.8 1.6-1 3.1-3.2-.3-2.6 2-2.6-2-3.2.3-1-3.1-2.8-1.6.9-3.1-.9-3.1 2.8-1.6 1-3.1 3.2.3z" fill="#1d9bf0"/><path d="M7.8 12.2l2.8 2.8 5.6-5.8" stroke="#fff" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const AV = s => `<svg viewBox="0 0 64 64" width="${s}" height="${s}"><circle cx="32" cy="32" r="32" fill="#2b2d36"/><circle cx="32" cy="25" r="11" fill="#c9ccd8"/><path d="M12 54c3-10 11-15 20-15s17 5 20 15" fill="#c9ccd8"/></svg>`;
  const XL = `<svg viewBox="0 0 24 24" width="32" height="32"><path d="M17.8 3h3.1l-6.8 7.7L22 21h-6.2l-4.9-6.4L5.3 21H2.2l7.2-8.3L2 3h6.4l4.4 5.8zM16.7 19.2h1.7L7.4 4.7H5.5z" fill="#15161c"/></svg>`;
  const OPUS = s => `<svg viewBox="0 0 40 40" width="${s}" height="${s}">${[...Array(8)].map((_, i) => `<rect x="17.6" y="2" width="4.8" height="16" rx="2.4" fill="${OR}" transform="rotate(${i * 45} 20 20)"/>`).join('')}<circle cx="20" cy="20" r="5" fill="${OR}"/></svg>`;
  const W = (s, cls = '') => s.split(' ').map(w => `<span class="tw ${cls}" style="display:inline-block">${w}</span>`).join(' ');
  const HL = 'background:linear-gradient(#ffe48f,#ffe48f) no-repeat 0 88%/0% 42%;border-radius:4px;padding:0 2px;-webkit-box-decoration-break:clone';

  // ================================ ACT 1
  const G1 = put(root, h('div', ''), 0, 0, 1920, 1080);
  const tw = put(G1, card({ w: 1010, h: 430 }), 110, 270);
  put(tw, h('div', '', AV(64)), 44, 40, 64, 64);
  const hd = put(tw, h('div', '', `<div style="display:flex;align-items:center;gap:8px;font:800 28px Geist">Elon Musk ${VER}</div><div style="font:500 21px Geist;color:#6b6e7b;margin-top:4px">@elonmusk · <span class="dt" style="border-radius:6px;padding:0 4px">Oct 7</span></div>`), 126, 40);
  const dt = hd.querySelector('.dt');
  put(tw, h('div', '', XL), 930, 46, 32, 32);
  const body = css(put(tw, h('div', ''), 44, 140, 922), 'font:500 33px/1.55 Geist;color:#15161c');
  body.innerHTML = `${W('Important note regarding Grok')} ${W('@Bot:', 'lk')} ${W('Going forward,')} ${W('@SpaceX', 'lk')} ${W('will use')} <span class="m1">${W('the best back end model for any given task')}</span>, ${W('including')} <span class="m2">${W('Claude Opus 5.5', 'cl')}</span>${W(', MidJourney, Suno and other leading APIs. Whatever is most likely to give you the best outcome.')}`;
  body.querySelectorAll('.lk').forEach(e => e.style.color = '#1d9bf0'); body.querySelectorAll('.cl').forEach(e => e.style.fontWeight = 800);
  const words = [...body.querySelectorAll('.tw')], m1 = body.querySelector('.m1'), m2 = body.querySelector('.m2');
  [m1, m2].forEach(m => m.style.cssText = HL); m2.style.backgroundImage = 'linear-gradient(rgba(217,100,58,.22),rgba(217,100,58,.22))';
  const clw = [...m2.querySelectorAll('.tw')];
  // grok + arrow + slot
  const gw = put(G1, h('div', ''), 1460, 232, 220, 260);
  const halo = css(put(gw, h('div', ''), -30, -30, 280, 280), 'border-radius:50%;background:radial-gradient(closest-side,rgba(47,199,164,.35),rgba(47,199,164,0))');
  const lg = put(gw, grok(180), 20, 0); lg.style.filter = 'drop-shadow(0 20px 26px rgba(10,12,20,.32))';
  css(put(gw, h('div', '', 'Grok Bot'), 0, 196, 220), 'font:800 36px Geist;text-align:center;letter-spacing:-.01em');
  const ar = put(G1, h('div', '', `<svg viewBox="0 0 330 260" width="330" height="260" fill="none"><path class="p" d="M10 240 C 140 236, 230 180, 320 60" stroke="#2fc7a4" stroke-width="5" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1"/><path class="hd" d="M302 70 L322 52 L332 80" stroke="#2fc7a4" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>`), 1126, 300, 340, 260);
  const arp = ar.querySelector('.p'), arh = ar.querySelector('.hd');
  const sl = put(G1, card({ w: 600, h: 250 }), 1230, 600);
  css(put(sl, h('div', '', `<svg viewBox="0 0 24 24" width="24" height="24"><path d="M4 7h16M4 12h16M4 17h10" stroke="#6b6e7b" stroke-width="2.4" stroke-linecap="round"/></svg><span>Back-end model</span>`), 32, 28), 'display:flex;align-items:center;gap:10px;font:700 24px Geist;color:#6b6e7b;white-space:nowrap');
  const stat = css(put(sl, h('div', ''), 310, 28, 260), 'display:flex;justify-content:flex-end;align-items:center;gap:10px;font:700 21px Geist;color:#1fbf75;white-space:nowrap');
  const spn = stat.appendChild(h('span', '')); spn.style.cssText = 'width:22px;height:22px;border-radius:50%;border:3px solid rgba(31,191,117,.2);border-top-color:#1fbf75;display:inline-block';
  const ok = stat.appendChild(h('span', '', IC.check())); ok.style.cssText = 'width:26px;height:26px;display:inline-block';
  const stx = stat.appendChild(h('span', '', 'picking per task'));
  const rw = css(put(sl, h('div', ''), 32, 88, 536, 126), 'border-radius:16px;background:#f3f4f8;overflow:hidden');
  const reelItems = ['?', 'MidJourney', 'Suno', 'Leading APIs', 'MidJourney', 'Suno', 'Leading APIs', 'Claude Opus 5.5'];
  const reel = put(rw, h('div', ''), 0, 0, 536);
  reelItems.forEach((s, i) => { const e = reel.appendChild(h('div', '', s)); e.style.cssText = `height:126px;display:flex;align-items:center;justify-content:center;font:800 ${s === '?' ? 56 : 46}px Geist;letter-spacing:-.01em;color:${i === reelItems.length - 1 ? OR : s === '?' ? '#b4b7c3' : '#15161c'};white-space:nowrap`; });
  css(put(rw, h('div', ''), 0, 0, 536, 126), 'background:linear-gradient(#f3f4f8,rgba(243,244,248,0) 28%,rgba(243,244,248,0) 72%,#f3f4f8)');
  const slRing = css(put(sl, h('div', ''), 0, 0, 600, 250), `border-radius:22px;box-shadow:inset 0 0 0 3px ${OR}`);

  // ================================ ACT 2
  const G2 = put(root, h('div', ''), 0, 0, 1920, 1080);
  // reply card with the follow-up quote
  const rp = put(G2, card({ w: 640, h: 268 }), 110, 236);
  put(rp, h('div', '', AV(48)), 32, 30, 48, 48);
  css(put(rp, h('div', '', `<span style="font:800 23px Geist">Elon Musk</span>${VER.replace(/26/g, '22')}<span style="font:500 19px Geist;color:#6b6e7b">· follow-up</span>`), 94, 40), 'display:flex;align-items:center;gap:8px;white-space:nowrap');
  const q = css(put(rp, h('div', ''), 32, 104, 580), 'font:500 28px/1.5 Geist;color:#15161c');
  q.innerHTML = `“<span class="q1">${W('Simple questions will route to small, fast models.')}</span> <span class="q2">${W('Questions with complex answers will route to large models.')}</span>”`;
  const q1 = q.querySelector('.q1'), q2 = q.querySelector('.q2'); [q1, q2].forEach(m => m.style.cssText = HL);
  q2.style.backgroundImage = 'linear-gradient(rgba(217,100,58,.22),rgba(217,100,58,.22))';
  q1.style.backgroundImage = 'linear-gradient(rgba(47,199,164,.28),rgba(47,199,164,.28))';
  // price card
  const pc = put(G2, card({ w: 640, h: 360 }), 110, 534);
  css(put(pc, h('div', '', 'What you pay per token'), 32, 28), 'font:700 24px Geist;color:#6b6e7b;white-space:nowrap');
  const pv = css(put(pc, h('div', '', 'unchanged'), 32, 70), 'font:800 50px Geist;letter-spacing:-.025em;white-space:nowrap');
  const pOk = put(pc, h('div', '', IC.check()), 312, 84, 40, 40);
  const graph = put(pc, h('div', '', `<svg viewBox="0 0 576 120" width="576" height="120"><path d="M0 60 H576" stroke="#eef0f5" stroke-width="2" stroke-dasharray="6 8"/><path class="a" d="M0 60 H300" stroke="#2fc7a4" stroke-width="6" stroke-linecap="round" fill="none"/><path class="b" d="M300 60 H576" stroke="${OR}" stroke-width="6" stroke-linecap="round" fill="none" pathLength="1" stroke-dasharray="1 1"/><circle class="d" cx="300" cy="60" r="8" fill="#fff" stroke="${OR}" stroke-width="4"/></svg>`), 32, 170, 576, 120);
  const gA = graph.querySelector('.a'), gB = graph.querySelector('.b'), gD = graph.querySelector('.d');
  const gL1 = css(put(pc, h('div', 'mono', 'small model'), 32, 290), 'font:600 18px Maple;color:#1f9f80;white-space:nowrap');
  const gL2 = css(put(pc, h('div', 'mono', '→ routed to Opus'), 336, 290), `font:600 18px Maple;color:${OR};white-space:nowrap`);
  // router diagram
  const HX = 1010, HY = 566;
  const svg = put(G2, h('div', '', `<svg viewBox="0 0 1100 700" width="1100" height="700" fill="none">
    <path class="i1" d="M250 96 V250" stroke="#2fc7a4" stroke-width="4" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1"/>
    <path class="i2" d="M250 570 V410" stroke="${OR}" stroke-width="4" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1"/>
    <path class="o1" d="M330 330 C 430 330, 430 150, 540 150" stroke="#2fc7a4" stroke-width="5" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1"/>
    <path class="o2" d="M330 330 C 430 330, 430 518, 540 518" stroke="${OR}" stroke-width="5" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1"/></svg>`), 760, 236, 1100, 700);
  const P_ = n => svg.querySelector('.' + n);
  const i1 = P_('i1'), i2 = P_('i2'), o1 = P_('o1'), o2 = P_('o2');
  const hub = put(G2, h('div', ''), HX - 80, HY - 80, 160, 160);
  css(put(hub, h('div', ''), -20, -20, 200, 200), 'border-radius:50%;background:radial-gradient(closest-side,rgba(47,199,164,.28),rgba(47,199,164,0))');
  const hg = put(hub, grok(160), 0, 0); hg.style.filter = 'drop-shadow(0 18px 24px rgba(10,12,20,.3))';
  const hubL = css(put(G2, h('div', 'mono', 'router'), HX + 70, HY + 60), 'font:600 19px Maple;color:#6b6e7b');
  const qS = put(G2, h('div', '', `<span class="tg" style="background:#2fc7a4">simple</span>“What's 15 s at 60 fps?”`), 790, 262, 440, 70);
  const qH = put(G2, h('div', '', `<span class="tg" style="background:${OR}">hard</span>“Plan a 15-shot launch film”`), 790, 806, 440, 70);
  [qS, qH].forEach(e => { css(e, 'display:flex;align-items:center;gap:14px;padding:0 22px 0 14px;border-radius:18px;background:#fff;box-shadow:0 0 0 1px rgba(21,22,28,.07),0 14px 30px -14px rgba(30,34,70,.3);font:600 23px Geist;white-space:nowrap'); e.querySelector('.tg').style.cssText += 'padding:6px 12px;border-radius:10px;color:#fff;font:700 18px Maple'; });
  const bS = put(G2, card({ w: 530, h: 236 }), 1300, 268);
  const bH = put(G2, card({ w: 530, h: 260 }), 1300, 624);
  const bolt = `<svg viewBox="0 0 24 24" width="30" height="30"><path d="M13.5 2 5 13.2h5.6L9.8 22 18.6 10.4H13z" fill="#fff"/></svg>`;
  put(bS, h('div', '', bolt), 32, 32, 60, 60).style.cssText += 'border-radius:16px;background:#2fc7a4;display:flex;align-items:center;justify-content:center';
  css(put(bS, h('div', '', 'Small, fast models'), 112, 38), 'font:800 34px Geist;letter-spacing:-.015em;white-space:nowrap');
  css(put(bS, h('div', '', 'quick answers · low latency'), 112, 84), 'font:500 21px Geist;color:#6b6e7b;white-space:nowrap');
  const sDots = [...Array(10)].map((_, i) => css(put(bS, h('div', ''), 32 + i * 47, 156, 38, 38), 'border-radius:10px;background:#eef8f5'));
  put(bH, h('div', '', OPUS(36)), 32, 32, 60, 60).style.cssText += 'border-radius:16px;background:#fbe9e1;display:flex;align-items:center;justify-content:center';
  css(put(bH, h('div', '', 'Large models'), 112, 38), 'font:800 34px Geist;letter-spacing:-.015em;white-space:nowrap');
  css(put(bH, h('div', '', 'deep reasoning · long code'), 112, 84), 'font:500 21px Geist;color:#6b6e7b;white-space:nowrap');
  const opChip = css(put(bH, h('div', '', `${OPUS(26)}<span>Claude Opus 5.5</span>`), 32, 160, null, 64), `display:inline-flex;align-items:center;gap:12px;padding:0 24px 0 18px;border-radius:999px;background:#fbe9e1;color:${OR};font:800 28px Geist;white-space:nowrap`);
  const bSr = css(put(bS, h('div', ''), 0, 0, 530, 236), 'border-radius:22px;box-shadow:inset 0 0 0 3px #2fc7a4');
  const bHr = css(put(bH, h('div', ''), 0, 0, 530, 260), `border-radius:22px;box-shadow:inset 0 0 0 3px ${OR}`);
  const pk = [...Array(6)].map((_, i) => css(put(G2, h('div', ''), 0, 0, 18, 18), `border-radius:50%;background:${i < 3 ? '#2fc7a4' : OR};box-shadow:0 0 0 6px ${i < 3 ? 'rgba(47,199,164,.2)' : 'rgba(217,100,58,.2)'}`));

  // cues
  ctx.cue(.2, 'swoosh', .5); ctx.cue(T.oct, 'tick', .4); ctx.cue(T.grok, 'pop', .6); ctx.cue(T.best, 'tick', .4); ctx.cue(T.claude + .3, 'ding', .7);
  ctx.cue(T.simple - .4, 'whoosh', .5); ctx.cue(T.small, 'pop', .5); ctx.cue(T.hard, 'pop', .5); ctx.cue(T.large, 'pop', .5); ctx.cue(T.and, 'swoosh', .4); ctx.cue(T.change + .2, 'ding', .6);
  const N = reelItems.length - 1, out1 = T.simple - .55, sIn = out1 + .15;
  const pathPt = (p, k) => { const L = p.getTotalLength(), q = p.getPointAtLength(cl(k) * L); return [760 + q.x, 236 + q.y]; };
  return (t) => {
    // ===== act 1
    const ko = A(t, out1, .45, E.in); set(G1, { o: 1 - ko, y: -30 * ko, s: 1 - .03 * ko, b: 8 * ko });
    if (ko < 1) {
      enter(tw, t, .15, { dy: 60, rx: 12 });
      const dk = A(t, T.oct, .4); dt.style.background = `rgba(255,228,143,${dk.toFixed(2)})`; dt.style.color = dk > .5 ? '#15161c' : '';
      words.forEach((w, i) => { const s = T.musk - .2 + i * .03; const k = A(t, s, .35, E.quart); set(w, { y: 14 * (1 - k), o: k, b: 3 * (1 - k) }); });
      m1.style.backgroundSize = `${(A(t, T.best, 1.2, E.io) * 100).toFixed(1)}% 42%`;
      const hk2 = A(t, T.claude, .5, E.io); m2.style.backgroundSize = `${(hk2 * 100).toFixed(1)}% 100%`; clw.forEach(w => w.style.color = hk2 > .5 ? OR : '#15161c');
      const gk = SP(t, T.grok - .2, 1); set(gw, { s: lerp(.6, 1, gk), y: 30 * (1 - gk) + Math.sin(t * 1.6) * 5, o: A(t, T.grok - .2, .3) });
      set(halo, { s: 1 + .06 * Math.sin(t * 3), o: .6 + .4 * A(t, T.claude, .5) });
      const ak = A(t, T.grok + .1, .7, E.io); arp.style.strokeDashoffset = (1 - ak).toFixed(3); arh.style.opacity = A(t, T.grok + .65, .2);
      enter(sl, t, T.grok + .4, { dy: 50, rx: 14 });
      const rk = E.io(P(t, T.best, T.claude + .1)); reel.style.transform = `translateY(${(-rk * N * 126).toFixed(1)}px)`;
      const vel = rk > 0 && rk < 1 ? (E.io(P(t + .02, T.best, T.claude + .1)) - E.io(P(t - .02, T.best, T.claude + .1))) / .04 * N : 0;
      reel.style.filter = vel > .5 ? `blur(${Math.min(6, vel * .6).toFixed(1)}px)` : 'none';
      const done = t >= T.claude + .1; spn.style.display = done ? 'none' : ''; ok.style.display = done ? '' : 'none'; set(spn, { r: t * 420 });
      stx.textContent = done ? 'picked for this task' : 'picking per task'; set(ok, { s: done ? lerp(.3, 1, SP(t, T.claude + .1, .6)) : 1 });
      slRing.style.opacity = A(t, T.claude + .1, .3);
      if (t > T.claude) set(sl, { s: 1 + .04 * Math.sin(Math.PI * cl((t - T.claude - .1) / .5)) });
    }
    // ===== act 2
    set(G2, { o: A(t, sIn, .2) });
    if (t > sIn) {
      enter(rp, t, sIn + .05, { dy: 50, rx: 12 }); enter(pc, t, T.and - .3, { dy: 50, rx: 12 });
      q1.style.backgroundSize = `${(A(t, T.simple, 1.6, E.io) * 100).toFixed(1)}% 100%`; q2.style.backgroundSize = `${(A(t, T.hard, 1.8, E.io) * 100).toFixed(1)}% 100%`;
      const hk = SP(t, sIn + .2, 1); set(hub, { s: lerp(.6, 1, hk), o: A(t, sIn + .2, .3) }); set(hg, { r: Math.sin(t * 1.4) * 4 }); set(hubL, { o: A(t, sIn + .6, .3) });
      // simple lane
      set(qS, { x: -20 * (1 - SP(t, T.simple, .8)), o: A(t, T.simple, .3) });
      i1.style.strokeDashoffset = (1 - A(t, T.simple + .2, .5, E.io)).toFixed(3);
      o1.style.strokeDashoffset = (1 - A(t, T.small - .2, .6, E.io)).toFixed(3);
      enter(bS, t, T.small - .1, { dy: 0, dx: 40, rx: 0, s0: .95 });
      bSr.style.opacity = A(t, T.fast, .3) * (t < T.hard ? 1 : .35);
      // hard lane
      set(qH, { x: -20 * (1 - SP(t, T.hard, .8)), o: A(t, T.hard, .3) });
      i2.style.strokeDashoffset = (1 - A(t, T.hard + .2, .5, E.io)).toFixed(3);
      o2.style.strokeDashoffset = (1 - A(t, T.large - .3, .6, E.io)).toFixed(3);
      enter(bH, t, T.large - .2, { dy: 0, dx: 40, rx: 0, s0: .95 });
      const ck = SP(t, T.large + .3, .7); set(opChip, { s: lerp(.7, 1, ck), o: A(t, T.large + .3, .2) });
      bHr.style.opacity = A(t, T.large + .3, .3) * (t > T.opus2 ? .7 + .3 * Math.sin(t * 5) : 1);
      // packets: simple loop then hard loop
      pk.forEach((e, i) => {
        const hard = i >= 3, s0 = hard ? T.large + .3 : T.small + .3, ph = (t - s0) * .55 + (i % 3) / 3;
        if (t < s0 || ph < 0) { set(e, { o: 0 }); return; }
        const f = ph % 1, inP = hard ? i2 : i1, outP = hard ? o2 : o1;
        const [x, y] = f < .4 ? pathPt(inP, f / .4) : pathPt(outP, (f - .4) / .6);
        set(e, { x: x - 9, y: y - 9, o: Math.min(1, Math.sin(f * Math.PI) * 2.5) });
      });
      // small-model "done" tiles fill
      sDots.forEach((d, i) => { const k = A(t, T.fast + i * .25, .2); d.style.background = k > .5 ? '#2fc7a4' : '#eef8f5'; set(d, { s: 1 + .15 * Math.exp(-8 * Math.max(0, t - T.fast - i * .25)) * (k > 0 ? 1 : 0) }); });
      // price
      const lk = A(t, T.and, .9, E.io), rk = A(t, T.opus2 - .1, .8, E.io);
      gA.setAttribute('d', `M0 60 H${(300 * lk).toFixed(1)}`); gB.style.strokeDashoffset = (1 - rk).toFixed(3);
      gD.style.opacity = A(t, T.opus2 - .1, .2); gD.setAttribute('r', (8 + 3 * Math.exp(-6 * Math.max(0, t - T.opus2)) * (t > T.opus2 ? 1 : 0)).toFixed(1));
      set(gL1, { o: A(t, T.and + .3, .3) }); set(gL2, { o: A(t, T.opus2, .3) });
      set(pv, { o: A(t, T.change, .35), y: 10 * (1 - A(t, T.change, .5)) });
      set(pOk, { s: lerp(.2, 1, SP(t, T.change + .3, .6)), o: A(t, T.change + .3, .15) });
    }
  };
};
