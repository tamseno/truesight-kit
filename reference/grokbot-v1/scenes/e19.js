// e19 — motion blur: 4 moments per frame blended by ffmpeg, like a camera shutter staying open; no GPU: slow frames take longer, nothing drops
SCENES.e19 = (root, ctx, H) => {
  const { put, h, set, enter, A, SP, E, P, lerp, cl, IC } = H;
  const D = (p, x, y, w, hh, css = '', html = '') => { const e = put(p, h('div', '', html), x, y, w, hh); if (css) e.style.cssText += ';' + css; return e; };
  const T = {
    blur: ctx.at('motion blur'), four: ctx.at('four moments'), inside: ctx.at('inside each'), ff: ctx.at('ffmpeg'), blend: ctx.at('blend'),
    idea: ctx.at('same idea'), camera: ctx.at('camera shutter'), open: ctx.at('staying open'),
    with: ctx.at('With no'), gpu: ctx.at('GPU'), slow: ctx.at('slow frames'), longer: ctx.at('take longer'), nothing: ctx.at('Nothing drops'), real: ctx.at('real time'),
  };

  // ---------------- top: 4 moments -> one blended frame
  const TC = put(root, H.card({ w: 1744, h: 340 }), 88, 228);
  const tt = D(TC, 40, 26, null, null, 'font:800 32px Geist;white-space:nowrap;letter-spacing:-.01em', '1 frame <span style="color:#b4b7c3">=</span> 4 moments');
  const subc = put(TC, H.chip('4 samples / frame', '#3a6cf4'), 360, 28); subc.style.font = '700 17px Maple';
  const BX = i => 22 + i * 30;
  const tiles = [0, 1, 2, 3].map(i => {
    const c = D(TC, 40 + i * 196, 92, 180, 150, 'border-radius:16px;background:#f1f0ec;box-shadow:inset 0 0 0 2px #e6e8ef;overflow:hidden');
    D(c, BX(i), 50, 48, 48, 'border-radius:50%;background:#15161c');
    const lb = D(TC, 44 + i * 196, 256, null, null, 'font:700 20px Geist;white-space:nowrap', `Moment ${i + 1}<span style="font:500 16px Maple;color:#9a9db0;margin-left:8px">t+${i}/4</span>`);
    return { c, lb };
  });
  const arr = D(TC, 830, 168, 150, 24, '', '<svg width="150" height="24" viewBox="0 0 150 24"><path d="M2 12h138M130 4l10 8-10 8" stroke="#3a6cf4" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>');
  const tmix = D(TC, 836, 120, null, null, 'font:700 18px Maple;color:#fff;background:#15161c;border-radius:10px;padding:5px 12px;white-space:nowrap', 'ffmpeg tmix');
  const tavg = D(TC, 850, 202, null, null, 'font:600 16px Maple;color:#9a9db0;white-space:nowrap', 'average of 4');
  const RX = 1000, RW = 420, RY = 72;
  const res = D(TC, RX, RY, RW, 200, 'border-radius:20px;background:#f1f0ec;overflow:hidden');
  const streak = D(res, 118, 66, 196, 68, 'border-radius:34px;background:linear-gradient(90deg,rgba(21,22,28,.06),rgba(21,22,28,.32) 70%,rgba(21,22,28,.55));filter:blur(6px)');
  const ghosts = [0, 1, 2, 3].map(() => D(TC, 0, 0, 48, 48, 'border-radius:50%;background:#15161c'));
  const resL = D(TC, RX, RY + 214, RW, 30, 'display:flex;align-items:center;gap:10px;font:800 22px Geist;white-space:nowrap', `<span style="width:26px;height:26px;display:inline-block">${IC.check()}</span>Motion blur, one frame`);
  // camera shutter analogy
  const SX = 1452;
  const sh = D(TC, SX, 64, 262, 250);
  const R0 = 74;
  sh.innerHTML = `<svg width="168" height="168" viewBox="-84 -84 168 168" style="position:absolute;left:47px;top:0"><circle r="82" fill="#15161c"/><circle r="${R0}" fill="#f1f0ec"/><circle class="seen" r="12" cx="-24" fill="rgba(21,22,28,.6)" style="filter:blur(3px)"/><circle class="iris" r="40" fill="none" stroke="#262834" stroke-width="68"/><g class="bl">${[...Array(6)].map((_, i) => `<path d="M0 0 L0 -80" stroke="#3d4050" stroke-width="2.5" transform="rotate(${i * 60})"/>`).join('')}</g><circle r="${R0}" fill="none" stroke="#3a3d4c" stroke-width="3"/></svg>`;
  const iris = sh.querySelector('.iris'), blG = sh.querySelector('.bl');
  const shL = D(sh, 0, 180, 262, 30, 'font:800 22px Geist;text-align:center;white-space:nowrap', 'Shutter stays open');
  const ticksW = D(sh, 51, 220, 160, 22, 'display:flex;gap:8px;justify-content:center');
  const stk = [0, 1, 2, 3].map(() => { const e = h('span', '', '', { width: '32px', height: '8px', borderRadius: '4px', background: '#e1e3ea', display: 'inline-block', marginTop: '7px' }); ticksW.appendChild(e); return e; });

  // ---------------- bottom: no GPU, nothing drops
  const BC = put(root, H.card({ w: 1744, h: 312 }), 88, 600);
  const bt = D(BC, 40, 28, null, null, 'font:800 30px Geist;white-space:nowrap;letter-spacing:-.01em', 'No GPU? Frames just wait.');
  const gpu = D(BC, 40, 88, null, null, 'font:800 21px Geist;color:#9a9db0;padding:4px 0', 'GPU'); gpu.classList.add('strike');
  const cpu = put(BC, H.chip('CPU only · 2 cores', '#15161c', true), 104, 86); cpu.style.font = '700 17px Geist';
  const wait = D(BC, 40, 150, null, null, 'display:flex;align-items:center;gap:10px;font:700 21px Geist;color:#b97a0c;white-space:nowrap', `<svg viewBox="0 0 24 24" width="24" height="24"><circle cx="12" cy="12" r="10" fill="none" stroke="#f5a524" stroke-width="2.5"/><path class="hand" d="M12 12V6" stroke="#f5a524" stroke-width="2.5" stroke-linecap="round"/></svg>Slow frame? It takes longer.`);
  const hand = wait.querySelector('.hand');
  const nrt = D(BC, 40, 204, null, null, 'display:flex;align-items:center;gap:10px;font:700 21px Geist;color:#6b6e7b;white-space:nowrap', '<span style="font:700 18px Maple;color:#fff;background:#6b6e7b;border-radius:8px;padding:3px 9px">no clock</span>Nothing is real time');
  const lab1 = D(BC, 0, 120, 120, null, 'font:700 17px Geist;color:#8b90a6;text-align:right', 'Capture'); lab1.style.left = '344px';
  const lab2 = D(BC, 0, 210, 120, null, 'font:700 17px Geist;color:#8b90a6;text-align:right', 'Output'); lab2.style.left = '344px';
  const N = 10, CX = i => 480 + i * 96;
  const DUR = [...Array(N)].map((_, i) => (i === 4 ? 1.25 : i < 4 ? .18 : .12));
  const T0 = T.gpu + .2; const ST = []; { let a = T0; for (let i = 0; i < N; i++) { ST.push(a); a += DUR[i]; } }
  const cells = [...Array(N)].map((_, i) => {
    const c = D(BC, CX(i), 108, 86, 50, 'border-radius:10px;background:#eef0f5;overflow:hidden');
    const f = D(c, 0, 0, 0, 50, 'background:#3a6cf4');
    const g = D(BC, CX(i), 196, 86, 50, 'border-radius:10px;box-shadow:inset 0 0 0 2px #e6e8ef');
    const o = D(BC, CX(i), 196, 86, 50, 'border-radius:10px;background:#15161c;color:#fff;font:800 20px Maple;display:flex;align-items:center;justify-content:center', String(i + 1).padStart(3, '0'));
    return { c, f, o, g };
  });
  const spin = D(BC, CX(4) + 29, 120, 28, 28, '', '<svg viewBox="0 0 24 24" width="28" height="28"><circle cx="12" cy="12" r="9" fill="none" stroke="rgba(255,255,255,.45)" stroke-width="3"/><path d="M12 3a9 9 0 0 1 9 9" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/></svg>');
  const sum = D(BC, 1470, 96, 244, 170, 'border-radius:18px;background:#f6f7fa;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px', '<div style="font:700 17px Geist;color:#8b90a6;letter-spacing:.08em">DROPPED FRAMES</div><div style="font:900 72px/1 Geist">0</div><div class="ok" style="font:800 19px Geist;color:#1fbf75;display:flex;gap:6px;align-items:center;height:24px"></div>');
  const okL = sum.querySelector('.ok');

  ctx.cue(.1, 'swoosh', .45); [0, 1, 2, 3].forEach(i => ctx.cue(T.four + i * .12, 'pop', .3)); ctx.cue(T.ff, 'tick', .4); ctx.cue(T.blend, 'whoosh', .45); ctx.cue(T.blend + .9, 'ding', .4);
  ctx.cue(T.camera, 'click', .5); ctx.cue(T.with - .3, 'swoosh', .45); ctx.cue(T.gpu + .1, 'error', .35); ctx.cue(T.slow, 'tick', .45); ctx.cue(T.nothing, 'ding', .55);

  return (t) => {
    const lift = 172 * (1 - A(t, T.with - .7, .9, E.io));
    const kTC = SP(t, .05, 1); set(TC, { y: lift + 50 * (1 - kTC), rx: 10 * (1 - kTC), s: lerp(.965, 1, kTC), o: A(t, .05, .35, E.quart) });
    enter(tt, t, .15, { dy: 16, rx: 0 });
    set(subc, { o: A(t, T.inside, .3), s: lerp(.6, 1, SP(t, T.inside, .6)) });
    const mk = A(t, T.blend, .7, E.io);
    tiles.forEach(({ c, lb }, i) => {
      const s = T.four - .1 + i * .12; enter(c, t, s, { dy: 26, rx: 10, blur: 3 });
      c.style.opacity = (A(t, s, .3) * (1 - .35 * mk)).toFixed(3); set(lb, { o: A(t, s + .1, .3) * (1 - .4 * mk) });
    });
    ghosts.forEach((g, i) => {
      const s = T.blend + i * .07, k = A(t, s, .6, E.io);
      const x0 = 40 + i * 196 + BX(i), y0 = 92 + 50, x1 = RX + 128 + i * 36, y1 = RY + 76;
      set(g, { x: lerp(x0, x1, k), y: lerp(y0, y1, k) - Math.sin(k * Math.PI) * 50, s: lerp(1, 1.42, k), o: t >= s ? lerp(1, .3, A(t, s + .4, .3)) : 0 });
    });
    set(arr, { o: A(t, T.ff - .1, .3) }); arr.style.clipPath = `inset(0 ${(100 - A(t, T.ff - .1, .5, E.io) * 100).toFixed(1)}% 0 0)`;
    set(tmix, { o: A(t, T.ff, .3), y: 8 * (1 - A(t, T.ff, .4)) });
    set(tavg, { o: A(t, T.blend, .3) });
    enter(res, t, T.ff - .2, { dx: 30, dy: 0, rx: 0 });
    set(streak, { o: A(t, T.blend + .55, .6) });
    res.style.boxShadow = `inset 0 0 0 ${t >= T.blend + .9 ? 3 : 2}px ${t >= T.blend + .9 ? '#1fbf75' : '#e6e8ef'}`;
    set(resL, { o: A(t, T.blend + .9, .3), x: -14 * (1 - A(t, T.blend + .9, .5)) });
    // shutter: appears at "camera shutter", iris opens on "staying open", stays open across 4 samples, closes, loops
    enter(sh, t, T.camera - .3, { dx: 30, dy: 0, rx: 0 });
    const cyc = 2.2, u = t >= T.open ? ((t - T.open) % cyc) / cyc : -1;
    let op = t < T.open ? .04 * A(t, T.camera, .4) : (u < .16 ? E.io(u / .16) : u < .7 ? 1 : u < .86 ? 1 - E.io((u - .7) / .16) : 0);
    const hole = lerp(3, R0 - 2, op); iris.setAttribute('r', ((R0 + hole) / 2 + 1).toFixed(1)); iris.setAttribute('stroke-width', (R0 - hole + 2).toFixed(1));
    blG.setAttribute('transform', `rotate(${(op * 40).toFixed(1)})`);
    blG.querySelectorAll('path').forEach(pth => pth.setAttribute('d', `M0 ${(-hole).toFixed(1)} L${(hole * .25).toFixed(1)} -82`));
    const seen = sh.querySelector('.seen'); seen.setAttribute('cx', (-30 + 60 * (u < 0 ? 0 : cl((u - .12) / .6))).toFixed(1)); seen.setAttribute('opacity', (op).toFixed(2));
    stk.forEach((e, i) => { const lit = u >= .16 + i * .135 && u < .9; e.style.background = lit ? '#3a6cf4' : '#e1e3ea'; });
    set(shL, { o: A(t, T.open - .1, .3) });
    set(ticksW, { o: A(t, T.open, .3) });

    // bottom
    enter(BC, t, T.with - .4, { dy: 50, rx: 10 });
    set(bt, { o: A(t, T.with - .2, .3) });
    set(gpu, { o: A(t, T.with, .3) }); H.strike(gpu, A(t, T.gpu, .35, E.io));
    enter(cpu, t, T.gpu + .15, { dx: -10, dy: 0, rx: 0 });
    set(lab1, { o: A(t, T.gpu, .3) }); set(lab2, { o: A(t, T.gpu, .3) });
    cells.forEach(({ c, f, o, g }, i) => {
      const s = ST[i], d = DUR[i], k = P(t, s, s + d), ap = A(t, T.gpu - .2 + i * .03, .25);
      set(c, { o: ap }); set(g, { o: ap * (t >= s + d ? 0 : 1) });
      f.style.width = (k * 86).toFixed(1) + 'px';
      const slow = i === 4, busy = slow && t >= s && k < 1;
      f.style.background = busy ? '#f5a524' : '#3a6cf4';
      c.style.background = busy ? '#fde7bd' : '#eef0f5';
      c.style.boxShadow = busy ? '0 0 0 3px rgba(245,165,36,.45)' : 'none';
      const ok = SP(t, s + d, .6); set(o, { s: lerp(.5, 1, ok), y: -20 * (1 - ok), o: A(t, s + d, .12) });
    });
    set(spin, { r: (t - ST[4]) * 360, o: t >= ST[4] && t < ST[4] + DUR[4] ? 1 : 0 });
    set(wait, { o: A(t, T.slow - .1, .3), x: -12 * (1 - A(t, T.slow - .1, .4)) });
    hand.setAttribute('transform', `rotate(${((t - T.slow) * 300).toFixed(1)} 12 12)`);
    set(nrt, { o: A(t, T.real - .5, .3), x: -12 * (1 - A(t, T.real - .5, .4)) });
    enter(sum, t, T.gpu + .3, { dy: 16, rx: 0 });
    okL.innerHTML = t >= T.nothing ? `<span style="width:22px;height:22px;display:inline-block">${IC.check()}</span>Nothing drops` : '';
    set(okL, { s: lerp(.6, 1, SP(t, T.nothing, .6)) });
    sum.style.boxShadow = t >= T.nothing ? 'inset 0 0 0 3px #1fbf75' : 'none';
  };
};
