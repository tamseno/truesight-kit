// e05 — the catch: no model picker, no visible model per request, no effort dial · viral one-shots used Claude Code at xhigh / max
SCENES.e05 = (root, ctx, H) => {
  const { put, h, set, enter, A, SP, E, P, lerp, cl, win, grok, IC, chip, cursor, strike, type } = H;
  const T = {
    catch: ctx.at('catch'), no: ctx.at('no model picker'), picker: ctx.at('picker'), cant: ctx.at("can't even"), see: ctx.at('see which'), req: ctx.at('request'),
    viral: ctx.at('viral'), one: ctx.at('one-shot'), clips: ctx.at('clips'), cc: ctx.at('Claude Code'), high: ctx.at('highest'), eff: ctx.at('effort settings'), set: ctx.at('settings'),
    dont: ctx.at("You don't get"), dial: ctx.at('dial'),
  };
  const css = (el, s) => { el.style.cssText += s; return el; };
  const OR = '#d9643a';
  // ================= Grok Bot settings
  const gs = put(root, win({ title: 'Grok Bot · Settings', w: 800, h: 614 }), 110, 240);
  const b = gs.body;
  const lab = (txt, y) => css(put(b, h('div', '', `<span>${txt}</span>`), 28, y), 'display:flex;align-items:center;gap:14px;font:800 28px Geist;white-space:nowrap');
  const l1 = lab('Model picker', 10), l2 = lab('Which model answered?', 170), l3 = lab('Effort', 398);
  const c1 = l1.appendChild(chip('none', '#f0443a')), c2 = l2.appendChild(chip('hidden', '#f0443a')), c3 = l3.appendChild(chip('no dial', '#f0443a'));
  [c1, c2, c3].forEach(c => c.style.cssText += 'font:800 19px Geist;height:34px');
  const dd = put(b, h('div', 'strike', `<span style="color:#8b5cf6">✦</span><span style="flex:1">Choose a model</span><svg viewBox="0 0 24 24" width="22" height="22"><path d="M6 9l6 6 6-6" stroke="#6b6e7b" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`), 28, 60, 690, 72);
  css(dd, 'display:flex;align-items:center;gap:14px;padding:0 24px;border-radius:16px;background:#fff;box-shadow:inset 0 0 0 2px #e3e5ec;font:600 26px Geist');
  // response bubble with hidden model
  const bub = put(b, h('div', ''), 28, 218, 690, 150); css(bub, 'border-radius:18px;background:#f4f5f8');
  const bg = put(bub, grok(44), 22, 22);
  const btx = css(put(bub, h('div', ''), 82, 26, 590), 'font:600 24px Geist;color:#15161c;white-space:nowrap');
  const meta = put(bub, h('div', '', `<svg viewBox="0 0 24 24" width="24" height="24"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" fill="none" stroke="#9aa0b4" stroke-width="2"/><circle cx="12" cy="12" r="3" fill="#9aa0b4"/><path d="M4 20 20 4" stroke="#9aa0b4" stroke-width="2.2" stroke-linecap="round"/></svg><span>answered by</span>`), 82, 88);
  css(meta, 'display:flex;align-items:center;gap:10px;font:600 20px Maple;color:#9aa0b4;white-space:nowrap');
  const red = put(bub, h('div', '', 'Claude Opus 5.5'), 300, 82, 250, 40); css(red, 'display:flex;align-items:center;justify-content:center;border-radius:10px;font:700 21px Maple;color:#15161c;background:#e3e5ec;overflow:hidden');
  const redBar = put(red, h('div', ''), 0, 0, 250, 40); css(redBar, 'background:repeating-linear-gradient(45deg,#2b2d36 0 10px,#3a3d48 10px 20px)');
  const q = put(red, h('div', '', '?'), 0, 0, 250, 40); css(q, 'display:flex;align-items:center;justify-content:center;font:800 24px Geist;color:#fff');
  const seg = put(b, h('div', 'strike', ''), 28, 448, 690, 72); css(seg, 'display:flex;gap:6px;padding:7px;border-radius:16px;background:#f1f2f6');
  ['low', 'medium', 'high', 'xhigh', 'max'].forEach(s => { const e = seg.appendChild(h('div', '', s)); e.style.cssText = `flex:1;display:flex;align-items:center;justify-content:center;border-radius:11px;font:600 23px Geist;${s === 'high' ? 'background:#15161c;color:#fff' : 'color:#6b6e7b'}`; });
  const xs = [52, 210, 430].map(y => { const x = put(b, h('div', '', IC.x()), 698, y, 48, 48); x.style.filter = 'drop-shadow(0 6px 10px rgba(240,68,58,.4))'; return x; });
  const cur = cursor(root);

  // ================= Claude Code
  const cc = put(root, win({ title: `<span style="color:${OR}">✻</span>&nbsp; Claude Code`, dark: true, tag: '~/studio', w: 890, h: 614 }), 942, 240);
  const cb = cc.body;
  const pr = css(put(cb, h('div', 'term', ''), 30, 12), 'font-size:22px;color:#9aa0b4');
  const ttl = css(put(cb, h('div', '', 'The viral one-shot clips'), 30, 64), 'font:800 38px Geist;color:#fff;white-space:nowrap;letter-spacing:-.015em');
  const thC = ['#dbe6ff', '#d6f5e9', '#ece3ff'], shC = ['#3a6cf4', '#1fbf75', '#8b5cf6'];
  const th = [0, 1, 2].map(i => {
    const e = css(put(cb, h('div', ''), 30 + i * 276, 136, 256, 156), `border-radius:14px;background:${thC[i]};overflow:visible`);
    const s = css(put(e, h('div', ''), 98, 46, 60, 60), `background:${shC[i]};border-radius:${['18%', '50%', '30%'][i]}`);
    const br = css(put(e, h('div', ''), 18, 132, 220, 6), 'border-radius:3px;background:rgba(255,255,255,.7);overflow:hidden');
    const bf = br.appendChild(h('div', '')); bf.style.cssText = `height:100%;background:${shC[i]}`;
    const ck = put(e, h('div', '', IC.check()), 222, 122, 44, 44); ck.style.filter = 'drop-shadow(0 4px 8px rgba(0,0,0,.4))';
    return { e, s, bf, ck, t: [T.viral, T.one, T.clips][i] };
  });
  const el = css(put(cb, h('div', 'mono', 'effort'), 30, 324), 'font:500 22px Maple;color:#8d93ab');
  const cseg = css(put(cb, h('div', ''), 30, 362, 826, 70), 'display:flex;gap:8px;padding:7px;border-radius:14px;background:#22242e');
  const cs = ['low', 'medium', 'high', 'xhigh', 'max'].map(s => { const e = cseg.appendChild(h('div', '', s)); e.style.cssText = 'flex:1;display:flex;align-items:center;justify-content:center;border-radius:10px;font:700 23px Maple;color:#6f7590;position:relative'; return e; });
  const fin = css(put(cb, h('div', '', `made on the <span style="font-family:Maple;color:#ff9a6b">highest</span> effort settings`), 30, 462), 'font:800 32px Geist;color:#fff;white-space:nowrap');
  const dim = css(put(cc, h('div', ''), 0, 46, 890, 568), 'background:rgba(22,23,31,.72)');
  const dimL = css(put(cc, h('div', '', 'meanwhile, in Claude Code…'), 0, 290, 890), 'font:600 26px Geist;color:rgba(255,255,255,.45);text-align:center');

  ctx.cue(.2, 'swoosh', .5); ctx.cue(T.picker, 'error', .6); ctx.cue(T.see + .2, 'error', .5); ctx.cue(T.viral - .1, 'whoosh', .4);
  th.forEach(o => ctx.cue(o.t + .25, 'ding', .3)); ctx.cue(T.high, 'click', .6); ctx.cue(T.eff, 'click', .6); ctx.cue(T.dial, 'error', .6);
  const OX = 110 + 22, OY = 240 + 46 + 22;
  const path = [[1.2, 900, 860], [T.no, OX + 420, OY + 100], [T.cant, OX + 420, OY + 100], [T.see - .1, OX + 440, OY + 320], [T.req + .4, OX + 440, OY + 320], [T.req + 1, 900, 860], [T.dont, 900, 860], [T.dial - .1, OX + 470, OY + 486], [T.dial + .7, OX + 560, OY + 540, ctx.dur + 1]];
  return (t) => {
    enter(gs, t, .15, { dy: 60, rx: 12 }); enter(cc, t, .3, { dy: 60, rx: 12 });
    const k1 = A(t, T.picker, .45, E.io), k3 = A(t, T.dial, .45, E.io);
    strike(dd, k1); strike(seg, k3);
    const sh = tt => t > tt ? Math.exp(-7 * (t - tt)) * Math.sin((t - tt) * 42) * 8 : 0;
    set(dd, { x: sh(T.picker), o: lerp(1, .5, k1) }); set(seg, { x: sh(T.dial), o: lerp(1, .5, k3) });
    // bubble
    enter(bub, t, T.cant - .5, { dy: 20, rx: 0, s0: .96 });
    type(btx, "Here's your 15-shot plan and spec.", t, T.cant - .3, 40, false);
    set(meta, { o: A(t, T.see - .2, .3) });
    const rk = A(t, T.see, .5, E.io); set(red, { o: A(t, T.see - .2, .3), x: sh(T.see + .3) });
    redBar.style.clipPath = `inset(0 ${((1 - rk) * 100).toFixed(1)}% 0 0)`; q.style.opacity = A(t, T.see + .35, .3);
    [[l1, k1], [l2, A(t, T.see, .4)], [l3, k3]].forEach(([l, k]) => l.firstChild.style.color = k > .5 ? '#a8abb7' : '#15161c');
    [[c1, T.picker + .1], [c2, T.see + .3], [c3, T.dial + .1]].forEach(([c, s]) => set(c, { s: lerp(.4, 1, SP(t, s, .6)), o: A(t, s, .2) }));
    [T.picker + .15, T.see + .35, T.dial + .15].forEach((s, i) => set(xs[i], { s: lerp(.2, 1, SP(t, s, .6)), r: -90 * (1 - SP(t, s, .6)), o: A(t, s, .15) }));
    set(bg, { r: Math.sin(t * 2) * 6 });
    cur.update(t, path, [T.no + .05, T.see, T.dial]);
    // claude code
    const dk = 1 - A(t, T.viral - .15, .6, E.io); dim.style.opacity = dk; dimL.style.opacity = dk * A(t, .8, .4);
    type(pr, '> make a 15-second product film', t, 1.0, 18, t < T.viral + 1);
    enter(ttl, t, T.viral - .05, { dy: 20, rx: 0 });
    th.forEach((o, i) => {
      enter(o.e, t, o.t - .15, { dy: 30, rx: 16, s0: .9 });
      set(o.s, { r: t * (40 + i * 25), y: Math.sin(t * 3 + i) * 8, s: 1 + .1 * Math.sin(t * 2.4 + i * 2) });
      o.bf.style.width = (cl((t - o.t + .15) / .6) * 100).toFixed(1) + '%';
      const ck = SP(t, o.t + .25, .6); set(o.ck, { s: lerp(.2, 1, ck), o: A(t, o.t + .25, .15) });
    });
    const ek = A(t, T.cc - .1, .5); set(el, { o: ek }); set(cseg, { o: ek, y: 16 * (1 - ek) });
    [[3, T.high], [4, T.eff]].forEach(([i, ts]) => {
      const k = A(t, ts, .3, E.quart), p = SP(t, ts, .6);
      cs[i].style.background = k > 0 ? `rgba(217,100,58,${k.toFixed(3)})` : 'transparent'; cs[i].style.color = k > .5 ? '#fff' : '#6f7590';
      cs[i].style.boxShadow = k > 0 ? `0 0 ${(26 * k * (.75 + .25 * Math.sin(t * 5 + i))).toFixed(1)}px rgba(255,120,70,.55), inset 0 0 0 2px rgba(255,180,140,${(.6 * k).toFixed(2)})` : 'none';
      set(cs[i], { s: k > 0 ? lerp(.9, 1, p) * (1 + .06 * Math.max(0, 1 - (t - ts) / .3) * (t > ts ? 1 : 0)) : 1 });
    });
    enter(fin, t, T.set + .1, { dy: 20, rx: 0 });
    // the dial you don't get: pulse a link from CC effort to Grok effort
  };
};
