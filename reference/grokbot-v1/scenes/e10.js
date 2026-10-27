// e10 — ~8 CPU cores, 16 GB RAM, no GPU → animate with HTML/CSS/SVG ✓, Blender out of the default path ✗, the real bottleneck is frame capture (not the model)
SCENES.e10 = (root, ctx, H) => {
  const { put, h, set, enter, A, SP, E, P, lerp, cl, COL, rnd } = H;
  const T = {
    users: ctx.at('Users'), eight: ctx.at('eight'), sixteen: ctx.at('sixteen'), no: ctx.at('no GPU'), gpu: ctx.at('GPU'), so: ctx.at('So you'),
    html: ctx.at('HTML'), css: ctx.at('CSS'), svg: ctx.at('SVG'), leave: ctx.at('leave'), blender: ctx.at('Blender'), def: ctx.at('default'),
    neck: ctx.at('bottleneck'), isnt: ctx.at("isn't"), model: ctx.at('model'), cap: ctx.at('capturing'), frames: ctx.at('frames'),
  };
  const badge = (kind) => {
    const c = kind === 'ok' ? COL.green : COL.red;
    const d = kind === 'ok' ? ['M7 12.5l3.2 3.2L17 9'] : ['M8.2 8.2l7.6 7.6', 'M15.8 8.2l-7.6 7.6'];
    const el = h('div', '', `<svg viewBox="0 0 24 24" width="100%" height="100%" style="overflow:visible"><circle cx="12" cy="12" r="12" fill="${c}"/>${d.map(p => `<path d="${p}" stroke="#fff" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-linejoin="round" pathLength="1" stroke-dasharray="1 1" stroke-dashoffset="1"/>`).join('')}</svg>`);
    const ps = [...el.querySelectorAll('path')];
    return { el, upd(t, s) { const k = SP(t, s, .7); set(el, { s: lerp(.2, 1, k), r: -25 * (1 - k), o: A(t, s, .12) }); ps.forEach((p, i) => p.setAttribute('stroke-dashoffset', (1 - A(t, s + .08 + i * .1, .3, E.io)).toFixed(3))); } };
  };
  const tile = (bg, svg) => { const e = h('div', '', svg); e.style.cssText += `width:64px;height:64px;border-radius:18px;background:${bg};display:flex;align-items:center;justify-content:center;box-shadow:0 8px 18px -8px ${bg}`; return e; };
  const SHADOW = '0 1px 0 rgba(255,255,255,.9) inset,0 0 0 1px rgba(21,22,28,.06),0 18px 50px -12px rgba(30,34,70,.18),0 4px 12px rgba(30,34,70,.06)';

  // ================= spec strip
  const STW = (1744 - 2 * 22) / 3, STY = 216, STH = 118;
  const SPECS = [
    ['CPU', 8, ' cores', '~', T.eight, '#5a5cf0'],
    ['RAM', 16, ' GB', '~', T.sixteen, COL.blue],
    ['GPU', 0, '', '', T.no, COL.red],
  ];
  const specs = SPECS.map(([k, v, suf, pre, at, c], i) => {
    const e = put(root, H.card({ w: STW, h: STH }), 88 + i * (STW + 22), STY);
    const kk = put(e, h('div', 'mono', k), 30, 24); kk.style.cssText += `font:700 20px Maple;color:${COL.sub};letter-spacing:.12em`;
    const val = put(e, h('div', '', ''), 30, 50); val.style.cssText += `font:800 46px Geist;letter-spacing:-.025em;white-space:nowrap;color:${i === 2 ? COL.red : COL.ink}`;
    const bar = put(e, h('div', ''), 0, STH - 6, STW, 6); bar.style.cssText += `background:${c};transform-origin:left center`;
    return { e, kk, val, bar, v, suf, pre, at, c, i };
  });
  const note = put(specs[0].e, h('div', '', 'user reports · not official'), 0, 26); note.style.cssText += `left:auto;right:26px;display:inline-flex;align-items:center;height:32px;padding:0 14px;border-radius:999px;background:#f1f2f6;color:${COL.sub};font:700 17px Geist;white-space:nowrap`;
  const gx = badge('x'); put(specs[2].e, gx.el, STW - 84, 34, 52, 52);

  // ================= three cards
  const CW = 566, CH = 546, Y = 360, xs = [88, 88 + CW + 23, 88 + 2 * (CW + 23)];
  const mk = (i) => { const wrap = put(root, h('div', ''), xs[i], Y, CW, CH); const c = put(wrap, H.card({ w: CW, h: CH }), 0, 0); return { wrap, c }; };
  const PVW = CW - 60, PVH = 262, PVY = 162;
  // card 1: code animation
  const C1 = mk(0);
  put(C1.c, tile(COL.green, `<svg width="34" height="34" viewBox="0 0 24 24"><path d="M8 7l-5 5 5 5M16 7l5 5-5 5" stroke="#fff" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`), 30, 30);
  put(C1.c, h('div', '', `<div style="font:800 34px Geist;line-height:1.1;letter-spacing:-.02em">Code animation</div><div style="font:600 20px Geist;color:${COL.sub};margin-top:6px">rendered in a browser</div>`), 112, 30);
  const b1 = badge('ok'); put(C1.c, b1.el, CW - 82, 36, 50, 50);
  const chipRow = put(C1.c, h('div', ''), 30, 110); chipRow.style.cssText += 'display:flex;gap:10px';
  const chips1 = [['HTML', '#e8553c', T.html], ['CSS', COL.blue, T.css], ['SVG', COL.amber, T.svg]].map(([tx, col, at]) => { const e = chipRow.appendChild(h('span', 'chip filled', tx)); e.style.setProperty('--c', col); e.style.cssText += 'height:40px;padding:0 20px;font:700 20px Geist;display:inline-flex'; return { e, at }; });
  const pv1 = put(C1.c, h('div', ''), 30, PVY, PVW, PVH);
  pv1.style.cssText += 'border-radius:16px;overflow:hidden;background:#f5f7fc;background-image:linear-gradient(rgba(58,108,244,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(58,108,244,.06) 1px,transparent 1px);background-size:31px 30px;box-shadow:inset 0 0 0 1px rgba(21,22,28,.05)';
  const orb = put(pv1, h('div', ''), 0, 0, 58, 58); orb.style.cssText += `border-radius:50%;background:${COL.blue};box-shadow:0 12px 22px -8px rgba(58,108,244,.6)`;
  const sq = put(pv1, h('div', ''), 0, 0, 44, 44); sq.style.cssText += `border-radius:12px;background:${COL.violet};box-shadow:0 10px 20px -8px rgba(139,92,246,.6)`;
  const barG = put(pv1, h('div', ''), 0, 0, 140, 36); barG.style.cssText += `border-radius:11px;background:${COL.green};transform-origin:left center;box-shadow:0 10px 20px -8px rgba(31,191,117,.6)`;
  const fps = put(pv1, h('div', 'mono', ''), PVW - 146, 16, 130, 34); fps.style.cssText += 'border-radius:10px;background:#fff;box-shadow:0 2px 8px rgba(30,34,70,.08);font:700 18px Maple;display:flex;align-items:center;justify-content:center;gap:8px';
  const spark = put(pv1, h('div', ''), 18, 200, 220, 44); spark.style.cssText += 'display:flex;align-items:flex-end;gap:5px';
  const sparkBars = [...Array(18)].map(() => { const b = spark.appendChild(h('i', '')); b.style.cssText = `display:block;width:7px;border-radius:2px;background:${COL.green};opacity:.75`; return b; });
  put(pv1, h('div', 'mono', '16.7 ms / frame'), 250, 218).style.cssText += `font:500 18px Maple;color:${COL.sub}`;
  const v1 = put(C1.c, h('div', '', 'The default'), 30, 452); v1.style.cssText += `font:800 34px Geist;letter-spacing:-.02em;color:${COL.green}`;
  const v1s = put(C1.c, h('div', 'mono', 'live · 60 fps'), 250, 466); v1s.style.cssText += `font:500 19px Maple;color:${COL.sub}`;

  // card 2: Blender
  const C2 = mk(1);
  put(C2.c, tile('#f08a2a', `<svg width="38" height="38" viewBox="0 0 24 24"><circle cx="13" cy="13" r="7" fill="none" stroke="#fff" stroke-width="2.6"/><circle cx="13" cy="13" r="2.6" fill="#fff"/><path d="M3 9h7M5 5.5h8" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/></svg>`), 30, 30);
  put(C2.c, h('div', '', `<div style="font:800 34px Geist;line-height:1.1;letter-spacing:-.02em">Blender</div><div style="font:600 20px Geist;color:${COL.sub};margin-top:6px">3D rendering · wants a GPU</div>`), 112, 30);
  const b2 = badge('x'); put(C2.c, b2.el, CW - 82, 36, 50, 50);
  const info2 = put(C2.c, h('div', '', `<span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#f08a2a;margin-right:10px;vertical-align:2px"></span>Crawls on CPU only`), 30, 116); info2.style.cssText += 'font:700 22px Geist';
  const pv2 = put(C2.c, h('div', ''), 30, PVY, PVW, PVH); pv2.style.cssText += 'border-radius:16px;overflow:hidden;background:#1c1e26';
  const TWc = PVW / 8, THc = 52;
  const floor2 = put(pv2, h('div', ''), PVW / 2 - 100, 196, 200, 24); floor2.style.cssText += 'border-radius:50%;background:radial-gradient(closest-side,rgba(0,0,0,.55),rgba(0,0,0,0))';
  const sphere = put(pv2, h('div', ''), PVW / 2 - 84, 34, 168, 168); sphere.style.cssText += 'border-radius:50%;background:radial-gradient(circle at 34% 30%,#ffd2a8 0%,#ff9a4d 22%,#e2561c 55%,#5e1d0a 92%)';
  const tiles = [];
  const ord = [...Array(40)].map((_, i) => i).sort((a, b) => { const d = k => Math.hypot((k % 8) - 3.5, Math.floor(k / 8) - 2); return d(a) - d(b) || a - b; });
  for (let k = 0; k < 40; k++) { const tl = put(pv2, h('div', ''), (k % 8) * TWc, Math.floor(k / 8) * THc, TWc + .5, THc + .5); tl.style.cssText += 'background:#2a2d37;box-shadow:inset 0 0 0 1px rgba(255,255,255,.035)'; tiles.push(tl); }
  const bucket = put(pv2, h('div', ''), 0, 0, TWc, THc); bucket.style.cssText += 'border:2px solid #ffb35c;border-radius:3px;box-shadow:0 0 12px rgba(255,160,70,.6)';
  const hud2 = put(pv2, h('div', 'mono', ''), 12, 214, PVW - 24, 36); hud2.style.cssText += 'border-radius:10px;background:rgba(10,11,16,.8);color:#e6e7ee;font:500 17px Maple;display:flex;align-items:center;gap:12px;padding:0 12px;white-space:nowrap';
  const hudTxt = hud2.appendChild(h('span', '', '')); const hudTrack = hud2.appendChild(h('span', '', '')); hudTrack.style.cssText = 'flex:1;height:6px;border-radius:3px;background:rgba(255,255,255,.12);overflow:hidden;display:block';
  const hudFill = hudTrack.appendChild(h('i', '')); hudFill.style.cssText = 'display:block;height:100%;background:#ffb35c;border-radius:3px';
  const hudEta = hud2.appendChild(h('span', '', ''));
  const v2 = put(C2.c, h('div', '', 'Not the default'), 30, 452); v2.style.cssText += `font:800 34px Geist;letter-spacing:-.02em;color:${COL.red}`;
  const v2s = put(C2.c, h('div', 'mono', 'minutes / frame'), 316, 466); v2s.style.cssText += `font:500 19px Maple;color:${COL.sub}`;

  // card 3: frame capture
  const C3 = mk(2);
  put(C3.c, tile(COL.blue, `<svg width="36" height="36" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="3" fill="#fff"/><path d="M8.5 7l1.6-2.5h3.8L15.5 7" fill="#fff"/><circle cx="12" cy="13.5" r="3.6" fill="${COL.blue}"/><circle cx="12" cy="13.5" r="1.8" fill="#fff"/></svg>`), 30, 30);
  put(C3.c, h('div', '', `<div style="font:800 34px Geist;line-height:1.1;letter-spacing:-.02em">Frame capture</div><div style="font:600 20px Geist;color:${COL.sub};margin-top:6px">headless browser · one shot per frame</div>`), 112, 30);
  const info3 = put(C3.c, h('div', '', `<span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${COL.blue};margin-right:10px;vertical-align:2px"></span>Every frame waits for a screenshot`), 30, 116); info3.style.cssText += 'font:700 22px Geist;white-space:nowrap';
  const pv3 = put(C3.c, h('div', ''), 30, PVY, PVW, PVH); pv3.style.cssText += 'border-radius:16px;overflow:hidden;background:#f3f5fa;box-shadow:inset 0 0 0 1px rgba(21,22,28,.05)';
  const bw = put(pv3, h('div', ''), 18, 18, 300, 166); bw.style.cssText += 'border-radius:12px;background:#fff;box-shadow:0 0 0 1px rgba(21,22,28,.07),0 8px 20px -10px rgba(30,34,70,.25);overflow:hidden';
  put(bw, h('div', '', '<i></i><i></i><i></i>'), 0, 0, 300, 28).style.cssText += 'background:#f1f2f6;display:flex;gap:6px;align-items:center;padding-left:12px';
  [...bw.firstChild.children].forEach((d, k) => d.style.cssText = `display:block;width:9px;height:9px;border-radius:50%;background:${['#ff5f57', '#febc2e', '#28c840'][k]}`);
  const url = put(bw, h('div', 'mono', ''), 62, 5, 230, 18); url.style.cssText += `font:500 13px Maple;color:${COL.sub}`;
  const dot3 = put(bw, h('div', ''), 0, 0, 40, 40); dot3.style.cssText += `border-radius:50%;background:${COL.blue}`;
  const flash = put(bw, h('div', ''), 0, 0, 300, 166); flash.style.cssText += 'background:#fff';
  const fc = put(pv3, h('div', '', ''), PVW - 170, 24, 150, 100); fc.style.cssText += 'text-align:right';
  fc.innerHTML = `<div class="mono" style="font:500 16px Maple;color:${COL.sub};letter-spacing:.08em">FRAME</div><div class="mono fcn" style="font:700 40px Maple;line-height:1.15">0000</div><div class="mono" style="font:500 16px Maple;color:${COL.sub}">/ 3600</div>`;
  const fcn = fc.querySelector('.fcn');
  const strip = put(pv3, h('div', ''), 18, 200, PVW - 36, 44); strip.style.cssText += 'display:flex;gap:6px';
  const cells = [...Array(10)].map(() => { const c = strip.appendChild(h('i', '')); c.style.cssText = 'display:block;flex:1;border-radius:7px;background:#e3e7f1'; return c; });
  const v3 = put(C3.c, h('div', '', 'The bottleneck'), 30, 448); v3.style.cssText += `display:inline-flex;align-items:center;height:52px;padding:0 18px;border-radius:14px;background:${COL.red};color:#fff;font:800 27px Geist;letter-spacing:-.01em;white-space:nowrap;box-shadow:0 12px 24px -10px rgba(240,68,58,.7);transform-origin:left center`;
  const v3b = put(C3.c, h('div', '', ''), 0, 455); v3b.style.cssText += `left:auto;right:30px;display:inline-flex;align-items:center;gap:10px;height:40px;padding:0 16px;border-radius:999px;background:#15161c;color:#fff;font:700 19px Geist;white-space:nowrap`;
  v3b.innerHTML = `<span style="font:600 17px Geist;color:#9aa0b4" class="strike sm">Opus 5.5</span><span>not the model</span>`;
  const smStrike = v3b.querySelector('.sm');

  // sound
  [.45, .57, .69].forEach((s, i) => ctx.cue(s, i ? 'swoosh' : 'whoosh', .4));
  ctx.cue(T.eight, 'tick', .4); ctx.cue(T.sixteen, 'tick', .4); ctx.cue(T.gpu, 'error', .5);
  chips1.forEach(({ at }) => ctx.cue(at, 'tick', .4)); ctx.cue(T.svg + .6, 'ding', .55);
  ctx.cue(T.blender, 'swoosh', .4); ctx.cue(T.def, 'error', .5); ctx.cue(T.neck, 'pop', .6); ctx.cue(T.isnt, 'tick', .45);

  const focus = (t, s, e) => { let v = lerp(.5, 1, A(t, s - .2, .45, E.quart)); if (e != null) v = lerp(v, .86, A(t, e - .2, .45, E.quart)); return v; };
  const style = (C, f, ring, ringK) => {
    const lift = cl((f - .86) / .14);
    set(C.c, { y: -10 * lift, s: lerp(.965, 1, cl((f - .5) / .5)) });
    C.c.style.filter = `saturate(${lerp(.25, 1, cl((f - .5) / .36)).toFixed(3)})`;
    C.c.style.opacity = lerp(.62, 1, cl((f - .5) / .36)).toFixed(3);
    C.c.style.boxShadow = `0 0 0 ${(3 * ringK).toFixed(2)}px ${ring}, 0 ${30 + 20 * lift}px ${60 + 30 * lift}px -16px rgba(30,34,70,${(.18 + .14 * lift).toFixed(3)}), ` + SHADOW;
  };

  return (t) => {
    // spec strip
    specs.forEach(s => {
      enter(s.e, t, .1 + s.i * .08, { dy: 30, rx: 8 });
      const k = A(t, s.at - .1, .6, E.out);
      if (s.i < 2) s.val.textContent = t < s.at - .1 ? '—' : `${s.pre}${Math.round(lerp(0, s.v, k))}${s.suf}`;
      else s.val.textContent = t < s.at ? '—' : 'none';
      set(s.val, { s: 1 + .08 * Math.max(0, 1 - Math.abs(t - s.at - .25) / .25) }); s.val.style.transformOrigin = 'left center';
      s.bar.style.transform = `scaleX(${A(t, s.at - .1, .7, E.io).toFixed(3)})`;
      if (s.i === 2 && t > T.gpu) { const sh = Math.exp(-7 * (t - T.gpu)) * Math.sin((t - T.gpu) * 44) * 6; set(s.val, { x: sh }); }
      // dim once the cards take over
      s.e.style.opacity = (A(t, .1 + s.i * .08, .35) * lerp(1, .8, A(t, T.so, .6))).toFixed(3);
    });
    set(note, { o: A(t, T.users + .1, .3) });
    gx.upd(t, T.gpu);
    // cards
    [C1, C2, C3].forEach((C, i) => enter(C.wrap, t, .45 + i * .12, { dy: 70, rx: 14 }));
    const f1 = focus(t, T.html, T.blender), f2 = focus(t, T.blender, T.neck), f3 = focus(t, T.neck);
    style(C1, f1, COL.green, A(t, T.svg + .6, .4));
    style(C2, f2, COL.red, A(t, T.def, .4) * (1 - .5 * A(t, T.neck, .4)));
    style(C3, f3, COL.red, A(t, T.neck, .4));
    // card 1
    chips1.forEach(({ e, at }) => { const k = SP(t, at - .05, .7); set(e, { y: 14 * (1 - k), s: lerp(.7, 1, k), o: A(t, at - .05, .15) }); });
    const ph = t * 1.6;
    set(orb, { x: 200 + Math.cos(ph) * 115, y: 82 + Math.sin(ph) * 42 - 29 });
    set(sq, { x: 400, y: 120 + Math.sin(t * 2.1) * 14, r: t * 90 });
    set(barG, { x: 36, y: 146, sx: .55 + .45 * (.5 + .5 * Math.sin(t * 2.4)) });
    fps.innerHTML = `<i style="width:9px;height:9px;border-radius:50%;background:${COL.green};display:inline-block"></i>${(59.6 + .4 * Math.sin(t * 7)).toFixed(0)} fps`;
    sparkBars.forEach((b, k) => b.style.height = (20 + 4 * rnd(k + Math.floor(t * 12))).toFixed(1) + 'px');
    b1.upd(t, T.svg + .6);
    const vk1 = SP(t, T.svg + .6, .8); set(v1, { y: 18 * (1 - vk1), o: A(t, T.svg + .6, .2) }); set(v1s, { o: A(t, T.svg + .8, .4) });
    // card 2: bucket render crawl
    const rt = Math.max(0, t - .8), n = Math.min(39, Math.floor(rt / .55));
    tiles.forEach((tl, k) => {
      const r = ord.indexOf(k);
      if (r < n) tl.style.opacity = 0;
      else if (r === n) { const fr = (rt / .55) % 1; tl.style.opacity = (.92 - .5 * fr + .1 * rnd(k * 7 + Math.floor(t * 14))).toFixed(3); }
      else tl.style.opacity = (.96 + .04 * rnd(k + Math.floor(t * 9))).toFixed(3);
    });
    const ckk = ord[n]; set(bucket, { x: (ckk % 8) * TWc, y: Math.floor(ckk / 8) * THc, o: A(t, .8, .3) });
    const pct = 1 + rt * .42; hudTxt.textContent = `CPU render ${pct.toFixed(1)}%`; hudFill.style.width = pct.toFixed(2) + '%';
    const eta = 4 * 3600 + 12 * 60 + 7 - Math.floor(t); hudEta.textContent = `ETA ${Math.floor(eta / 3600)}:${String(Math.floor(eta / 60) % 60).padStart(2, '0')}:${String(eta % 60).padStart(2, '0')}`;
    set(info2, { o: lerp(.45, 1, A(t, T.blender, .4)) });
    b2.upd(t, T.def);
    const vk2 = SP(t, T.def, .8); set(v2, { y: 18 * (1 - vk2), o: A(t, T.def, .2) }); set(v2s, { o: A(t, T.def + .2, .4) });
    // card 3: stepped frame capture (5 fps)
    const ft = Math.max(0, t - .9), f = Math.floor(ft * 5) + 1, fr = (ft * 5) % 1;
    fcn.textContent = String(f).padStart(4, '0');
    url.textContent = `scene.html?t=${(f / 60).toFixed(3)}`;
    set(dot3, { x: 26 + ((f * 17) % 220), y: 58 + Math.sin(f * .5) * 30 });
    set(flash, { o: t > .9 ? .7 * Math.max(0, 1 - fr * 4) : 0 });
    cells.forEach((c, k) => { const cur = (f - 1) % 10; c.style.background = k < cur ? '#c9d6fb' : k === cur ? COL.blue : '#e3e7f1'; });
    set(info3, { o: lerp(.45, 1, A(t, T.cap - .3, .4)) });
    info3.style.background = `linear-gradient(transparent 60%,rgba(58,108,244,.2) 60%) no-repeat 0 0/${(A(t, T.cap, .6, E.io) * 100).toFixed(1)}% 100%`;
    const vk3 = SP(t, T.neck, .8); set(v3, { s: lerp(.6, 1, vk3), o: A(t, T.neck, .15) });
    const vb = SP(t, T.isnt, .8); set(v3b, { x: 20 * (1 - vb), o: A(t, T.isnt, .2) }); H.strike(smStrike, A(t, T.model, .35, E.io));
  };
};
