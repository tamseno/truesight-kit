// compare — before / after proof. Two screens (mock phones or images), and a review log on the right where a bot checks
// the proof: a failing check rings the problem on the "after" screen and sends it back; a later check swaps in the fixed
// screen and stamps it.
// data: { left: { label: "Before", phone?: { title, bad: true } | image? }, right: { label: "After", phone?: {...} | image? },
//         who?: "<cast>", log?: "Proof review",
//         checks: [{ text: "Button still clipped at 320pt", verdict: "fail"|"pass", at?, swap?: { phone: {...} } }],
//         stamp?: { text: "VERIFIED", at? } }
ARCH.compare = (root, ctx, H, d, sc) => {
  const { set, enter, A, SP, E, P, lerp, D, IC } = H;
  const Y = 262, PW = 300, PH = 590;
  const mk = (spec, x) => {
    const wrap = D(root, x, Y - 8, PW, PH + 40);
    const lab = D(root, x, Y - 46, PW, 36, 'text-align:center', H.tag(spec.label || '', spec.tone === 'good' ? '#1fbf75' : spec.tone === 'bad' ? '#f0443a' : '#6b6e7b', false)); lab.classList.add('onbg');
    let scr;
    if (spec.image) { scr = D(wrap, 0, 0, PW, PH, 'border-radius:40px;overflow:hidden;box-shadow:0 30px 70px -24px rgba(20,24,60,.45)'); const im = H.img(spec.image); im.style.cssText = 'width:100%;height:100%;object-fit:cover'; scr.appendChild(im); }
    else { scr = H.phone({ w: PW, h: PH, ...(spec.phone || {}) }); wrap.appendChild(scr); scr.style.position = 'absolute'; scr.style.left = scr.style.top = '0'; }
    return { wrap, lab, scr };
  };
  const L = mk(d.left || { label: 'Before' }, 240), R = mk(d.right || { label: 'After' }, 690);
  const arrow = D(root, 240 + PW + 26, Y + PH / 2 - 30, 100, 60, '', '<svg viewBox="0 0 100 60" width="100" height="60"><path d="M8 30 H84 M66 12 L88 30 L66 48" fill="none" stroke="currentColor" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>'); arrow.classList.add('onbg'); arrow.style.opacity = .35;
  // swapped "after" screens
  const checks = d.checks || [], CT = H.times(ctx, checks, .25, .8);
  const swaps = checks.map((c, i) => { if (!c.swap) return null; const s = H.phone({ w: PW, h: PH, ...(c.swap.phone || {}) }); R.wrap.appendChild(s); s.style.position = 'absolute'; s.style.left = s.style.top = '0'; return { s, t: CT[i] }; });
  // ring on the after screen (problem area: bottom of the phone)
  const ring = D(root, 690 - 22, Y + PH - 150, PW + 44, 150, 'border-radius:28px;border:5px solid #f0443a;box-shadow:0 0 0 10px rgba(240,68,58,.14)');
  const ringOk = D(root, 690 - 22, Y - 22, PW + 44, PH + 44, 'border-radius:56px;border:5px solid #1fbf75;box-shadow:0 0 0 12px rgba(31,191,117,.15)');
  // review log
  const LX = 1150, LW = 682;
  const log = H.put(root, H.card({ w: LW, h: 610 }), LX, Y - 12);
  const who = d.who || H.BOT_ORDER[0], av = H.avatar(who, 54);
  const hd = D(log, 30, 26, LW - 60, 60, 'display:flex;align-items:center;gap:16px'); hd.appendChild(av.el);
  hd.insertAdjacentHTML('beforeend', `<div><div style="font:var(--fwd) 28px var(--fd)">${H.esc(H.nameOf(who))}</div><div style="font:600 20px var(--fb);color:var(--sub)">${H.esc(d.log || 'Reviewing the proof')}</div></div>`);
  D(log, 30, 104, LW - 60, 2, 'background:var(--line)');
  const rows = checks.map((c, i) => {
    const pass = c.verdict === 'pass';
    const r = D(log, 24, 124 + i * 118, LW - 48, 104, `border-radius:18px;display:flex;align-items:center;gap:18px;padding:0 22px;background:${pass ? 'var(--good-fill)' : 'var(--bad-fill)'};color:var(--ink)`);
    const ic = r.appendChild(H.h('span', 'icon', pass ? IC.check() : IC.x())); ic.style.cssText += ';width:42px;height:42px';
    r.insertAdjacentHTML('beforeend', `<div style="min-width:0"><div style="font:800 20px var(--fb);letter-spacing:.12em;color:${pass ? 'var(--good-ink)' : 'var(--bad-ink)'}">${pass ? 'VERIFIED' : 'SENT BACK'} · ROUND ${i + 1}</div><div style="font:700 26px/1.25 var(--fb);margin-top:4px">${H.md(c.text)}</div></div>`);
    return { r, ic, pass };
  });
  const ST = d.stamp ? H.when(ctx, d.stamp.at, CT[CT.length - 1] + .7) : 1e9;
  const stamp = d.stamp ? D(root, 690 + PW / 2 - 170, Y + PH / 2 - 60, 340, 120, 'border-radius:22px;border:7px solid #1fbf75;color:var(--good);background:rgba(255,255,255,.92);font:var(--fwd) 50px var(--fd);letter-spacing:.1em;display:flex;align-items:center;justify-content:center;white-space:nowrap', H.esc(d.stamp.text || 'VERIFIED')) : null;
  CT.forEach((x, i) => ctx.cue(x, rows[i].pass ? 'success' : 'error', .5)); if (stamp) ctx.cue(ST, 'impact', .4);
  const fail = checks.findIndex(c => c.verdict !== 'pass');
  if (fail >= 0) ctx.focus(CT[fail] - .3, { x: 690, y: Y + PH - 200, w: PW, h: 200 }, { z: 1.08, k: .38, d: 1.1 });
  const pi = checks.findIndex(c => c.verdict === 'pass'); if (pi >= 0) ctx.reset(CT[pi] - .3, 1.2);
  return t => {
    enter(L.wrap, t, .1, { dy: 50 }); enter(R.wrap, t, .25, { dy: 50 }); set(L.lab, { o: A(t, .3, .3) }); set(R.lab, { o: A(t, .45, .3) });
    set(arrow, { o: .35 * A(t, .5, .3), x: -14 * (1 - A(t, .5, .5)) });
    enter(log, t, .35, { dy: 40 }); av.update(t);
    swaps.forEach(sw => { if (sw) set(sw.s, { o: A(t, sw.t - .1, .35) }); });
    let fr = 0; checks.forEach((c, i) => { if (c.verdict !== 'pass') fr = Math.max(fr, A(t, CT[i], .3) * (1 - A(t, (CT[i + 1] ?? 1e9) - .2, .3))); });
    set(ring, { o: fr, s: lerp(1.08, 1, SP(t, CT[fail] ?? 0, .6)) });
    const okT = pi >= 0 ? CT[pi] : 1e9; set(ringOk, { o: A(t, okT, .3), s: lerp(1.06, 1, SP(t, okT, .7)) });
    rows.forEach(({ r, ic }, i) => { const k = SP(t, CT[i], .8); set(r, { y: 20 * (1 - k), o: A(t, CT[i], .25) }); H.pop(ic, t, CT[i] + .1, { r: -30 }); });
    if (stamp) set(stamp, { s: lerp(1.6, 1, E.out(P(t, ST, ST + .35))), o: A(t, ST, .12), r: -8 });
  };
};
