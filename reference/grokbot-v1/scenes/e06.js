// e06 — the fix: don't chase a magic prompt; replace the missing dial with structure — spec · gates · an independent critic
SCENES.e06 = (root, ctx, H) => {
  const { put, h, set, enter, A, SP, E, P, lerp, cl, card, IC, strike, type, bot, cursor, BOTS } = H;
  const T = {
    chase: ctx.at('chase'), magic: ctx.at('magic prompt'), pEnd: ctx.end('magic prompt'), replace: ctx.at('replace'), missing: ctx.at('missing dial'), struct: ctx.at('structure'),
    spec: ctx.at('written spec'), gates: ctx.at('gates'), stages: ctx.at('stages'), critic: ctx.at('critic'), never: ctx.at('never wrote'), code: ctx.at('the code'), grading: ctx.at('grading'),
  };
  const css = (el, s) => { el.style.cssText += s; return el; };
  // ---------- prompt card
  const pc = put(root, card({ w: 560, h: 300 }), 110, 240);
  css(put(pc, h('div', '', '<span style="color:#8b5cf6">✦</span> Prompt'), 36, 30), 'font:700 24px Geist;color:#6b6e7b');
  const ph = css(put(pc, h('div', '', ''), 36, 96, 500), 'font:800 42px Geist;white-space:nowrap;color:#15161c;letter-spacing:-.015em');
  const phHint = css(put(pc, h('div', '', '<span class="caret" style="color:#15161c"></span><span style="color:#b4b7c3;margin-left:6px">type a spell…</span>'), 36, 96), 'font:700 42px Geist;white-space:nowrap');
  const sk = put(pc, h('div', 'strike', ''), 30, 92, 440, 60);
  css(put(pc, h('div', '', 'luck, not a process'), 36, 196), 'font:600 24px Geist;color:#a8abb7');
  const tries = [0, 1, 2, 3, 4].map(i => css(put(pc, h('div', ''), 36 + i * 40, 244, 30, 30), 'border-radius:8px;background:#f1f2f6'));
  const px = css(put(root, h('div', '', IC.x()), 110 + 560 - 40, 240 - 24, 64, 64), 'z-index:3;filter:drop-shadow(0 8px 14px rgba(240,68,58,.45))');
  // ---------- knob card
  const kc = put(root, card({ w: 560, h: 320 }), 110, 568);
  const knob = put(kc, h('div', '', `<svg viewBox="0 0 200 200" width="196" height="196"><defs><radialGradient id="e06k" cx="40%" cy="35%" r="70%"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#e2e4ec"/></radialGradient></defs>${[...Array(11)].map((_, i) => `<rect x="98.5" y="8" width="3" height="${i % 5 ? 10 : 16}" rx="1.5" fill="${i > 7 ? '#f0a49e' : '#c4c7d2'}" transform="rotate(${-135 + i * 27} 100 100)"/>`).join('')}<circle cx="100" cy="104" r="66" fill="rgba(30,34,70,.12)"/><circle cx="100" cy="100" r="64" fill="url(#e06k)" stroke="#d6d9e3" stroke-width="2"/><g class="pt"><rect x="96" y="44" width="8" height="34" rx="4" fill="#15161c"/></g></svg>`), 30, 62, 196, 196);
  const kpt = knob.querySelector('.pt');
  const lock = put(kc, h('div', '', IC.lock()), 172, 202, 56, 56); lock.style.filter = 'drop-shadow(0 6px 10px rgba(0,0,0,.3))';
  css(put(kc, h('div', 'mono', 'effort'), 262, 76), 'font:500 24px Maple;color:#8d93ab');
  css(put(kc, h('div', '', 'The missing<br>dial'), 262, 114), 'font:800 48px/1.15 Geist;letter-spacing:-.02em');
  const kNote = css(put(kc, h('div', '', '→ replaced by structure'), 262, 246), 'font:700 22px Geist;color:#1f9f80;white-space:nowrap');
  const kRing = css(put(kc, h('div', ''), 0, 0, 560, 320), 'border-radius:22px;box-shadow:inset 0 0 0 3px #1fbf75');
  const kOk = css(put(root, h('div', '', IC.check()), 110 + 560 - 40, 568 - 24, 64, 64), 'z-index:3;filter:drop-shadow(0 8px 14px rgba(31,191,117,.45))');
  const cur = cursor(root);
  // ---------- structure card
  const sc = put(root, card({ w: 1130, h: 648 }), 700, 240);
  const sh = css(put(sc, h('div', '', `Structure <span style="font:500 24px Maple;color:#8d93ab;margin-left:14px">spec · gates · critic</span>`), 44, 34), 'font:800 42px Geist;white-space:nowrap;letter-spacing:-.02em');
  const DOC = `<svg viewBox="0 0 24 24" width="38" height="38"><path d="M6 2.5h8l4.5 4.5v14.5H6z" fill="#fff"/><path d="M9 11h6.5M9 14.5h6.5M9 18h4" stroke="#1fbf75" stroke-width="1.8" stroke-linecap="round"/></svg>`;
  const GATE = `<svg viewBox="0 0 24 24" width="38" height="38"><path d="M4 21V9a8 8 0 0116 0v12" stroke="#fff" stroke-width="2.4" fill="none"/><path d="M4 21h16M9 21v-6h6v6" stroke="#fff" stroke-width="2.4" fill="none" stroke-linejoin="round"/></svg>`;
  const items = [
    { t1: 'Written spec', t2: 'spec', c: '#1fbf75', d: 'what “done” means, in writing', ic: DOC, t: T.spec },
    { t1: 'Gates', t2: 'gate', c: '#f5a524', d: 'no pass, no next stage', ic: GATE, t: T.gates },
    { t1: 'Critic', t2: 'critic', c: '#8b5cf6', d: 'a separate bot grades', ic: '', t: T.critic },
  ];
  const slots = items.map((it, i) => {
    const x = 44 + i * 356;
    const em = css(put(sc, h('div', '', String(i + 1)), x, 116, 330, 290), 'border-radius:20px;border:3px dashed #dfe2ea;display:flex;align-items:center;justify-content:center;font:800 64px Geist;color:#e6e8ee');
    const c = css(put(sc, h('div', ''), x, 116, 330, 290), `border-radius:20px;background:linear-gradient(180deg,color-mix(in srgb,${it.c} 10%,#fff),#fff 70%);box-shadow:inset 0 0 0 2.5px ${it.c},0 18px 34px -16px color-mix(in srgb,${it.c} 60%,transparent)`);
    const tile = css(put(c, h('div', '', it.ic), 127, 30, 76, 76), `border-radius:22px;background:${it.c};display:flex;align-items:center;justify-content:center;box-shadow:0 10px 20px -8px ${it.c}`);
    let b = null; if (i === 2) { b = bot('critic', 62); put(tile, b.el, 7, 5); tile.style.background = '#efe7ff'; }
    css(put(c, h('div', '', it.t1), 0, 128, 330), 'font:800 38px Geist;text-align:center;letter-spacing:-.015em');
    css(put(c, h('div', 'mono', it.t2), 0, 180, 330), `font:700 21px Maple;text-align:center;color:${it.c}`);
    css(put(c, h('div', '', it.d), 0, 224, 330), 'font:500 22px Geist;text-align:center;color:#6b6e7b');
    let ar = null; if (i < 2) ar = put(sc, h('div', '', `<svg viewBox="0 0 26 26" width="26" height="26"><path d="M3 13h18M15 7l6 6-6 6" stroke="#b4b7c3" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`), x + 330, 248, 26, 26);
    return { em, c, tile, b, ar, t: it.t, i };
  });
  // bottom band: the critic never wrote the code it grades
  const bandEm = css(put(sc, h('div', 'mono', 'who grades the work?'), 44, 436, 1042, 172), 'border-radius:20px;border:3px dashed #dfe2ea;display:flex;align-items:center;justify-content:center;font:600 24px Maple;color:#c4c7d2');
  const band = css(put(sc, h('div', ''), 44, 436, 1042, 172), 'border-radius:20px;background:#f6f4fd');
  const aB = bot('animator', 92), cB = bot('critic', 92);
  put(band, aB.el, 40, 40); put(band, cB.el, 620, 40);
  const aT = css(put(band, h('div', '', `<div style="font:800 28px Geist">Animator</div><div style="font:500 21px Geist;color:#6b6e7b;margin-top:4px">wrote the code</div>`), 150, 52), 'white-space:nowrap');
  const cT = css(put(band, h('div', '', `<div style="font:800 28px Geist">Critic</div><div style="font:500 21px Geist;color:#6b6e7b;margin-top:4px">grades it, cold</div>`), 730, 52), 'white-space:nowrap');
  const neq = css(put(band, h('div', '', '≠'), 452, 38, 100, 90), 'font:800 76px Geist;color:#8b5cf6;text-align:center');
  const fileC = css(put(band, h('div', 'mono', 'scene.js'), 0, 0, null, 40), 'display:flex;align-items:center;gap:8px;padding:0 14px;border-radius:10px;background:#fff;box-shadow:0 0 0 1px rgba(21,22,28,.08),0 8px 18px -8px rgba(30,34,70,.35);font:600 19px Maple;z-index:2');
  const score = css(put(band, h('div', '', 'graded'), 940, 66, null, 44), 'display:flex;align-items:center;padding:0 16px;border-radius:999px;background:#8b5cf6;color:#fff;font:700 20px Geist;white-space:nowrap');
  const sRing = css(put(sc, h('div', ''), 0, 0, 1130, 648), 'border-radius:22px;box-shadow:inset 0 0 0 3px #1fbf75');
  const link = put(root, h('div', '', `<svg viewBox="0 0 80 160" width="80" height="160"><path class="p" d="M78 6 C 30 6, 40 140, 2 140" stroke="#1fbf75" stroke-width="4" fill="none" stroke-dasharray="1 1" pathLength="1" stroke-linecap="round"/></svg>`), 664, 440, 80, 160);
  const lp = link.querySelector('.p');

  ctx.cue(.2, 'swoosh', .5); ctx.cue(T.magic, 'type', .5); ctx.cue(T.pEnd + .05, 'error', .6); ctx.cue(T.missing + .3, 'error', .35); ctx.cue(T.struct, 'whoosh', .5);
  slots.forEach(s => ctx.cue(s.t, 'pop', .55)); ctx.cue(T.never, 'swoosh', .4); ctx.cue(T.grading, 'ding', .6);
  const KX = 110 + 30 + 98, KY = 568 + 62 + 98;
  return (t) => {
    enter(pc, t, .1, { dy: 50, rx: 12 }); enter(kc, t, .22, { dy: 50, rx: 12 });
    enter(sc, t, .34, { dy: 60, rx: 12 });
    const hk = A(t, T.struct, .3); set(sh, { x: 10 * Math.exp(-6 * Math.max(0, t - T.struct)) * Math.sin(Math.max(0, t - T.struct) * 20), o: .3 + .7 * hk }); sh.style.color = hk > .5 ? '#15161c' : '#9aa0b4';
    // prompt
    const typing = t >= T.chase; phHint.style.display = typing ? 'none' : ''; set(phHint, { o: A(t, .4, .3) });
    type(ph, 'a magic prompt…', t, T.chase, 18, t < T.pEnd + .1);
    tries.forEach((e, i) => { const k = A(t, T.chase + .1 + i * .15, .2); e.style.background = k > .5 ? (i === 4 ? '#ffd9d6' : '#e8e9ef') : '#f1f2f6'; });
    strike(sk, A(t, T.pEnd, .4, E.io));
    const fk = A(t, T.pEnd + .2, .6, E.io); pc.style.filter = fk > 0 ? `grayscale(${fk.toFixed(2)})` : 'none';
    if (t > 1.2) set(pc, { r: -2.5 * fk, y: 6 * fk, o: lerp(1, .55, fk) });
    set(px, { s: lerp(.2, 1, SP(t, T.pEnd + .1, .6)), r: -90 * (1 - SP(t, T.pEnd + .1, .6)), o: A(t, T.pEnd + .1, .15) });
    // knob: the drag fails on "missing dial"
    const dragS = T.missing - .1, dragE = T.missing + .5, dk = P(t, dragS, dragE);
    const ang = -40 + (t < dragS ? Math.sin(t * 1.2) * 2 : t < dragE ? Math.sin(dk * Math.PI) * 18 * (1 - dk * .6) : 0);
    kpt.setAttribute('transform', `rotate(${ang.toFixed(2)} 100 100)`);
    const ls = t > dragS + .25 ? Math.exp(-6 * (t - dragS - .25)) * Math.sin((t - dragS) * 46) : 0; set(lock, { r: ls * 14, s: 1 + .15 * Math.abs(ls) });
    cur.update(t, [[T.replace, KX + 140, KY + 120], [dragS, KX + 20, KY - 62], [dragE, KX + 58, KY - 40], [dragE + .6, KX + 200, KY + 110, T.struct + .2]], [dragS + .02]);
    // replaced by structure
    lp.style.strokeDashoffset = (1 - A(t, T.struct + .2, .6, E.io)).toFixed(3);
    const gk = A(t, T.struct + .5, .4); kRing.style.opacity = gk; set(kNote, { x: -12 * (1 - gk), o: gk });
    set(kOk, { s: lerp(.2, 1, SP(t, T.struct + .55, .6)), o: A(t, T.struct + .55, .15) });
    // slots
    slots.forEach(s => {
      s.em.style.opacity = A(t, .6 + s.i * .1, .4) * (1 - A(t, s.t, .3));
      const k = SP(t, s.t - .1, .8); set(s.c, { y: 40 * (1 - k), s: lerp(.9, 1, k), rx: 16 * (1 - k), o: A(t, s.t - .1, .25) });
      set(s.tile, { y: Math.sin(t * 2 + s.i) * 3 }); if (s.b) s.b.update(t, { bob: 1.5 });
      if (s.ar) { const ak = A(t, slots[s.i + 1].t - .2, .4); set(s.ar, { x: -10 * (1 - ak) + Math.sin(t * 4) * 2 * ak, o: ak }); }
    });
    // band
    const bk = A(t, T.critic + .2, .5); set(band, { o: bk, y: 20 * (1 - bk) }); bandEm.style.opacity = A(t, 1.0, .4) * (1 - bk);
    aB.update(t, { lookX: .6 }); cB.update(t, { lookX: -.6 });
    set(aT, { o: A(t, T.never - .1, .4) }); set(cT, { o: A(t, T.critic + .4, .4) });
    set(neq, { s: lerp(.4, 1, SP(t, T.never + .1, .7)), o: A(t, T.never + .1, .2) });
    // the file travels from author to critic
    const fm = E.io(P(t, T.code - .1, T.grading - .05));
    set(fileC, { x: lerp(28, 598, fm), y: 128 + (-60 * Math.sin(fm * Math.PI)), o: A(t, T.never + .3, .3) });
    set(score, { s: lerp(.5, 1, SP(t, T.grading + .1, .6)), o: A(t, T.grading + .1, .2) });
    sRing.style.opacity = A(t, T.grading + .2, .4) * (.7 + .3 * Math.sin(t * 4));
  };
};
