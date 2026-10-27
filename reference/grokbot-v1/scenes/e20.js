// e20 — test box: 2 cores, Linux, no GPU; 15 s test: draft 48 s, final (60 fps + blur) ~6 min; preflight: one still per beat catches problems early
SCENES.e20 = (root, ctx, H) => {
  const { put, h, set, enter, A, SP, E, P, lerp, cl, bot, IC } = H;
  const D = (p, x, y, w, hh, css = '', html = '') => { const e = put(p, h('div', '', html), x, y, w, hh); if (css) e.style.cssText += ';' + css; return e; };
  const T = {
    cpu: ctx.at('two-core'), os: ctx.at('Linux'), gpu: ctx.at('GPU'), clip: ctx.at('fifteen-second'), draft: ctx.at('draft'), n48: ctx.at('forty-eight'),
    fin: ctx.at('The final'), fps: ctx.at('sixty'), blur: ctx.at('motion blur'), six: ctx.at('six minutes'),
    before: ctx.at('Before any'), tpl: ctx.at('template renders'), still: ctx.at('one still'), beat: ctx.at('per beat'), catch: ctx.at('catch problems'),
  };

  // ---------- machine card
  const mc = put(root, H.card({ w: 500, h: 668 }), 104, 228);
  D(mc, 34, 30, 420, 28, 'font:700 18px Geist;color:#6b6e7b;letter-spacing:.12em;display:flex;align-items:center;gap:10px', '<span style="width:10px;height:10px;border-radius:3px;background:#3a6cf4"></span>TEST MACHINE');
  const cpuSvg = `<svg viewBox="0 0 60 60" width="54" height="54"><rect x="10" y="10" width="40" height="40" rx="8" fill="#3a6cf4"/>${[16, 26, 36].map(v => `<rect x="${v}" y="3" width="4" height="8" rx="2" fill="#3a6cf4"/><rect x="${v}" y="49" width="4" height="8" rx="2" fill="#3a6cf4"/><rect x="3" y="${v}" width="8" height="4" rx="2" fill="#3a6cf4"/><rect x="49" y="${v}" width="8" height="4" rx="2" fill="#3a6cf4"/>`).join('')}<rect class="c0" x="17" y="20" width="11" height="20" rx="3" fill="#fff"/><rect class="c1" x="32" y="20" width="11" height="20" rx="3" fill="#fff"/></svg>`;
  const gpuSvg = `<svg viewBox="0 0 60 60" width="54" height="54"><rect x="6" y="16" width="44" height="26" rx="5" fill="#c9ccd6"/><circle cx="22" cy="29" r="7" fill="#eef0f4"/><circle cx="38" cy="29" r="7" fill="#eef0f4"/><rect x="12" y="42" width="20" height="5" rx="1.5" fill="#c9ccd6"/><path class="slash" d="M8 52 L52 8" stroke="#f0443a" stroke-width="5" stroke-linecap="round" stroke-dasharray="63" stroke-dashoffset="63"/></svg>`;
  const rowDefs = [
    ['#e8eefe', cpuSvg, 'CPU', '2 <span style="font-size:38px">cores</span>'],
    ['#15161c', '<span style="font:700 30px Maple;color:#7ee0b8">&gt;_</span>', 'SYSTEM', 'Linux'],
    ['#f0f1f4', gpuSvg, 'GPU', 'None'],
  ];
  const rows = rowDefs.map(([bg, ic, lab, val], i) => {
    const r = D(mc, 34, 80 + i * 160, 432, 150);
    const tile = D(r, 0, 26, 92, 92, `border-radius:26px;background:${bg};display:flex;align-items:center;justify-content:center`, ic);
    D(r, 118, 30, 200, 24, 'font:600 18px Geist;color:#8a8d99;letter-spacing:.1em', lab);
    D(r, 118, 54, 300, 70, 'font:800 58px/1.1 Geist;white-space:nowrap;letter-spacing:-.02em', val);
    if (i < 2) D(r, 0, 149, 432, 1, 'background:rgba(21,22,28,.07)');
    return { r, tile };
  });
  const loads = [0, 1].map(k => { const tr = D(rows[0].r, 372 + k * 30, 36, 16, 76, 'border-radius:8px;background:#eef0f5;overflow:hidden'); return D(tr, 0, 0, 16, 76, 'border-radius:8px;background:#3a6cf4;transform-origin:bottom'); });
  const noGpu = D(rows[2].r, 268, 66, 164, 38, 'border-radius:999px;background:#f3f4f7;font:700 17px Geist;color:#6b6e7b;display:flex;align-items:center;justify-content:center', 'CPU rendering');
  const foot = D(mc, 34, 588, 432, 52, 'border-radius:14px;background:#f3f4f7;font:600 18px Geist;color:#6b6e7b;display:flex;align-items:center;padding:0 18px;gap:10px;white-space:nowrap', '<span style="width:14px;height:14px;border-radius:50%;border:2.5px solid #9a9daa"></span>A small sandbox, the worst case');

  // ---------- clip card (phase 1: 15 s test, phase 2: one still per beat)
  const cc = put(root, H.card({ w: 1196, h: 300 }), 636, 228);
  const ring = D(cc, 0, 0, 1196, 300, 'border-radius:22px;box-shadow:inset 0 0 0 3px #3a6cf4;pointer-events:none');
  const ph1 = D(cc, 0, 0, 1196, 300);
  const th = D(ph1, 26, 26, 440, 248, 'border-radius:16px;background:linear-gradient(135deg,#f1f3f9,#e2e7f3);overflow:hidden');
  const shp = D(th, 0, 0, 10, 10, 'background:#15161c;box-shadow:0 14px 26px -10px rgba(0,0,0,.5)');
  const shadow = D(th, 0, 186, 10, 8, 'border-radius:50%;background:rgba(20,22,40,.12)');
  const scrub = D(th, 16, 226, 408, 4, 'border-radius:2px;background:rgba(21,22,28,.12)');
  const scrubF = D(scrub, 0, 0, 0, 4, 'border-radius:2px;background:#15161c');
  const tc = D(th, 358, 190, 66, 26, 'border-radius:8px;background:#15161c;color:#fff;font:700 15px Maple;display:flex;align-items:center;justify-content:center', '0:00');
  const ttl = D(ph1, 500, 34, 680, 120, 'white-space:nowrap', '<span style="font:800 112px/1 Geist;letter-spacing:-.05em">15</span><span style="font:800 46px Geist;margin-left:14px;letter-spacing:-.02em">second test</span>');
  const desc = D(ph1, 502, 162, 680, 34, 'font:600 23px Geist;color:#6b6e7b;white-space:nowrap', 'Smoke test: card rises, morphs to a circle, lands');
  const chips = D(ph1, 502, 216, 680, 40, 'display:flex;gap:10px');
  ['1920 × 1080', '60 fps', 'motion blur'].forEach((s, i) => { const c = H.chip(s, ['#3a6cf4', '#5a5cf0', '#8b5cf6'][i]); c.style.font = '700 17px Geist'; chips.appendChild(c); });
  // phase 2
  const ph2 = D(cc, 0, 0, 1196, 300);
  D(ph2, 34, 26, 800, 40, 'font:800 32px Geist;white-space:nowrap;letter-spacing:-.01em', 'Preflight <span style="color:#b4b7c3;font-weight:600">·</span> one still per beat');
  const pfTag = D(ph2, 0, 30, null, null, 'font:600 19px Maple;color:#6b6e7b;white-space:nowrap', 'before any full render'); pfTag.style.left = 'auto'; pfTag.style.right = '34px';
  const NS = 6, SW = 172, SG = 18, SY = 88;
  const stills = [...Array(NS)].map((_, i) => {
    const x = 34 + i * (SW + SG);
    const slot = D(ph2, x, SY, SW, 110, 'border-radius:12px;border:2px dashed #e1e3ea');
    const f = D(ph2, x, SY, SW, 110, 'border-radius:12px;background:linear-gradient(135deg,#f1f3f9,#e2e7f3);overflow:hidden;box-shadow:inset 0 0 0 1.5px #e3e6ee');
    // a static pose of the smoke test at this beat
    const fr = (i + .5) / NS, rise = E.io(P(fr, .05, .3)), morph = E.io(P(fr, .32, .58)), fall = E.out(P(fr, .62, .8));
    const c = 44, w0 = 84, h0 = 32, ww = lerp(w0, c, morph), hh = lerp(h0, c, morph), rr = lerp(7, c / 2, morph);
    const yy = 86 - hh - 24 * rise + 24 * fall;
    D(f, (SW - ww) / 2, yy, ww, hh, `background:#15161c;border-radius:${rr}px`);
    if (i === 3) D(f, 114, 8, 110, 24, 'font:800 17px Geist;color:#15161c;white-space:nowrap', 'Overnight studio'); // text running off the edge
    const lb = D(ph2, x, SY + 120, SW, 26, 'font:700 18px Geist;color:#15161c;white-space:nowrap', `Beat ${i + 1}<span style="font:500 16px Maple;color:#9a9db0;margin-left:8px">0:${String(Math.round(i * 2.5)).padStart(2, '0')}</span>`);
    const ck = D(ph2, x + SW - 36, SY + 74, 28, 28, '', i === 3 ? IC.x() : IC.check());
    return { f, lb, ck, x, slot };
  });
  const issue = D(ph2, stills[3].x - 10, SY + 160, null, null, 'border-radius:10px;background:#fdecea;color:#c8322a;font:700 18px Geist;padding:6px 12px;white-space:nowrap', 'Title clipped at the edge');
  const issueOK = D(ph2, 34, SY + 166, null, null, 'font:600 19px Geist;color:#6b6e7b;white-space:nowrap', 'Caught in seconds, not after a 6-minute render');

  // ---------- render time card
  const rc = put(root, H.card({ w: 1196, h: 336 }), 636, 560);
  D(rc, 34, 28, 400, 28, 'font:700 18px Geist;color:#6b6e7b;letter-spacing:.12em;display:flex;align-items:center;gap:10px', '<span style="width:16px;height:16px;border-radius:50%;border:2.5px solid #6b6e7b;display:inline-block"></span>RENDER TIME');
  const rb = bot('render', 62); put(rc, rb.el, 1104, 12);
  const BW = 640;
  const mkBar = (i, lab, sub, c) => {
    const y = 84 + i * 104;
    const l = D(rc, 34, y - 4, 200, 48, 'font:800 38px Geist;white-space:nowrap;letter-spacing:-.01em', lab);
    const s = D(rc, 34, y + 44, 220, 24, 'font:600 17px Geist;color:#8a8d99;white-space:nowrap', sub);
    const tr = D(rc, 250, y + 14, BW, 26, 'border-radius:13px;background:#eef0f5;overflow:hidden');
    const f = D(tr, 0, 0, 0, 26, `border-radius:13px;background:${c};overflow:hidden`);
    const st = D(f, 0, 0, BW + 60, 26, 'background:repeating-linear-gradient(110deg,rgba(255,255,255,0) 0 18px,rgba(255,255,255,.28) 18px 30px)');
    const v = D(rc, 910, y - 10, 252, 68, 'font:800 56px/1.1 Geist;text-align:right;white-space:nowrap;font-variant-numeric:tabular-nums;letter-spacing:-.02em');
    return { l, s, f, st, v };
  };
  const bd = mkBar(0, 'Draft', 'preview quality', 'linear-gradient(90deg,#6f95ff,#3a6cf4)');
  const bf = mkBar(1, 'Final', '60 fps + motion blur', 'linear-gradient(90deg,#5a5cf0,#8b5cf6)');
  const note = D(rc, 250, 274, 640, 40, 'border-radius:12px;background:#eef0ff;color:#5a5cf0;font:700 19px Geist;display:flex;align-items:center;padding:0 16px;white-space:nowrap', '≈ 7.5× the draft · iterate on drafts, render the final once');

  ctx.cue(.2, 'swoosh', .5); ctx.cue(T.cpu, 'pop', .4); ctx.cue(T.os, 'pop', .4); ctx.cue(T.gpu + .25, 'tick', .5);
  ctx.cue(T.clip - .15, 'whoosh', .5); ctx.cue(T.draft - .2, 'swoosh', .4); ctx.cue(T.n48 + .45, 'ding', .45); ctx.cue(T.six + .25, 'ding', .5);
  ctx.cue(T.before, 'whoosh', .45); for (let i = 0; i < NS; i++) ctx.cue(T.tpl + i * .17, 'tick', .3); ctx.cue(T.catch, 'error', .45);

  const clipStart = T.clip - .25, SWAP = T.before - .1;
  return (t) => {
    enter(mc, t, .1, { dy: 60, rx: 12 });
    const rt = [T.cpu - .1, T.os - .1, T.gpu - .15];
    rows.forEach((r, i) => { enter(r.r, t, rt[i], { dy: 26, rx: 0 }); const k = SP(t, rt[i] + .05, .9); set(r.tile, { s: lerp(.6, 1, k), r: -12 * (1 - k) }); });
    mc.querySelector('.c0').setAttribute('opacity', (.35 + .65 * A(t, T.cpu + .2, .4) * (.75 + .25 * Math.sin(t * 7))).toFixed(2));
    mc.querySelector('.c1').setAttribute('opacity', (.35 + .65 * A(t, T.cpu + .35, .4) * (.75 + .25 * Math.sin(t * 6 + 1))).toFixed(2));
    loads.forEach((f, k) => { const busy = A(t, T.draft, .5); set(f, { sy: cl(.25 + .2 * Math.abs(Math.sin(t * 3.1 + k * 2)) + busy * (.45 + .1 * Math.sin(t * 9 + k))), o: A(t, T.cpu + .2, .4) }); });
    mc.querySelector('.slash').setAttribute('stroke-dashoffset', (63 * (1 - A(t, T.gpu + .25, .45, E.io))).toFixed(1));
    set(noGpu, { x: 12 * (1 - A(t, T.gpu + .45, .4)), o: A(t, T.gpu + .45, .4) });
    set(foot, { o: A(t, T.gpu + .8, .5), y: 10 * (1 - A(t, T.gpu + .8, .5)) });

    // clip card
    enter(cc, t, clipStart, { dy: 50, rx: 12 });
    const sw = A(t, SWAP, .5, E.io);
    set(ring, { o: A(t, T.clip, .3) * (1 - A(t, T.draft, .5)) + A(t, T.catch, .3) * 0 });
    set(ph1, { o: 1 - sw, y: -24 * sw, b: 6 * sw });
    set(ph2, { o: A(t, SWAP + .15, .4), y: 24 * (1 - A(t, SWAP + .15, .6)) });
    const tk = SP(t, clipStart + .1, .9); set(ttl, { y: 30 * (1 - tk), o: A(t, clipStart + .1, .3) });
    set(desc, { o: A(t, clipStart + .35, .4) }); set(chips, { o: A(t, clipStart + .5, .4), x: 16 * (1 - A(t, clipStart + .5, .5)) });
    const f = ((Math.max(0, t - clipStart) / 3) % 1);
    const rise = E.io(P(f, .05, .3)), morph = E.io(P(f, .32, .58)), fall = E.out(P(f, .62, .8));
    const c = 100, w0 = 184, h0 = 70; const ww = lerp(w0, c, morph), hh = lerp(h0, c, morph), rr = lerp(14, c / 2, morph);
    const yy = 178 - hh - 56 * rise + 56 * fall - 8 * Math.sin(P(f, .8, .9) * Math.PI);
    Object.assign(shp.style, { width: ww + 'px', height: hh + 'px', borderRadius: rr + 'px', left: (220 - ww / 2) + 'px', top: yy + 'px' });
    const sww = lerp(160, 76, rise - fall); Object.assign(shadow.style, { width: sww + 'px', left: (220 - sww / 2) + 'px', opacity: (.5 + .5 * (1 - rise + fall)).toFixed(2) });
    scrubF.style.width = (408 * f).toFixed(1) + 'px';
    tc.textContent = '0:' + String(Math.floor(f * 15)).padStart(2, '0');
    set(pfTag, { o: A(t, SWAP + .4, .4) });
    stills.forEach((s, i) => {
      set(s.slot, { o: A(t, SWAP + .3 + i * .05, .3) });
      const st = T.tpl + i * .17, k = SP(t, st, .7);
      set(s.f, { y: 30 * (1 - k), s: lerp(.85, 1, k), o: A(t, st, .2) }); set(s.lb, { o: A(t, st + .1, .3) });
      const ct = i === 3 ? T.catch : T.tpl + .45 + i * .17;
      set(s.ck, { s: lerp(.3, 1, SP(t, ct, .6)), o: A(t, ct, .12) });
      if (i === 3) s.f.style.boxShadow = t >= T.catch ? 'inset 0 0 0 3px #f0443a' : 'inset 0 0 0 1.5px #e3e6ee';
    });
    set(issue, { o: A(t, T.catch + .15, .3), y: -8 * (1 - A(t, T.catch + .15, .4)) });
    set(issueOK, { o: A(t, T.catch + .5, .4) });
    issueOK.style.left = '34px'; issueOK.style.top = (SY + 166) + 'px';
    // render card
    enter(rc, t, T.draft - .35, { dy: 50, rx: 12 }); rb.update(t, { lookX: -.6 });
    const kd = A(t, T.n48 - .1, .75, E.io);
    bd.f.style.width = (BW * 48 / 360 * kd).toFixed(1) + 'px';
    bd.v.innerHTML = `${Math.round(48 * kd)}<span style="font-size:30px;margin-left:6px">s</span>`;
    set(bd.v, { o: A(t, T.n48 - .1, .2), s: 1 + .08 * Math.sin(Math.PI * P(t, T.n48 + .6, T.n48 + .95)) });
    const lf = A(t, T.fin - .2, .4); set(bf.l, { o: lerp(.25, 1, lf) }); set(bf.s, { o: lerp(.25, 1, lf) });
    const kf = E.sine(P(t, T.fps, T.six + .25));
    bf.f.style.width = (BW * kf).toFixed(1) + 'px';
    bd.st.style.transform = `translateX(${(-(t * 40) % 30).toFixed(1)}px)`;
    bf.st.style.transform = `translateX(${(-(t * 60) % 30).toFixed(1)}px)`;
    if (kf < 1) { const s = Math.floor(360 * kf); bf.v.innerHTML = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; set(bf.v, { o: A(t, T.fps, .2) }); }
    else { bf.v.innerHTML = `<span style="font-size:28px;color:#6b6e7b;margin-right:8px">~</span>6<span style="font-size:30px;margin-left:6px">min</span>`; set(bf.v, { o: 1, s: 1 + .1 * Math.sin(Math.PI * P(t, T.six + .25, T.six + .6)) }); }
    set(note, { o: A(t, T.six + .4, .4), x: 18 * (1 - A(t, T.six + .4, .5)) });
  };
};
