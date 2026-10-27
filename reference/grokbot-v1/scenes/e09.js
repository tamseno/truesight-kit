// e09 — design for a computer that naps: no daemons, one bootstrap command, resumable renders (frames on disk)
SCENES.e09 = (root, ctx, H) => {
  const { put, h, set, enter, A, SP, E, P, lerp, cl, COL, IC, win } = H;
  const T = {
    shapes: ctx.at('shapes'), no: ctx.at('No'), daemon: ctx.at('daemons'), boot: ctx.at('bootstrap'), re: ctx.at('reinstalls'), ff: ctx.at('ffmpeg'), py: ctx.at('Python'),
    hl: ctx.at('headless'), br: ctx.at('browser'), one: ctx.at('one command'), render: ctx.at('every render'), resum: ctx.at('resumable'), nap: ctx.at('nap'),
    night: ctx.at('night'), min: ctx.at('minutes'), whole: ctx.at('whole job'),
  };
  const badge = (kind) => {
    const c = kind === 'ok' ? COL.green : COL.red;
    const d = kind === 'ok' ? ['M7 12.5l3.2 3.2L17 9'] : ['M8.2 8.2l7.6 7.6', 'M15.8 8.2l-7.6 7.6'];
    const el = h('div', '', `<svg viewBox="0 0 24 24" width="100%" height="100%" style="overflow:visible"><circle cx="12" cy="12" r="12" fill="${c}"/>${d.map(p => `<path d="${p}" stroke="#fff" stroke-width="2.8" fill="none" stroke-linecap="round" stroke-linejoin="round" pathLength="1" stroke-dasharray="1 1" stroke-dashoffset="1"/>`).join('')}</svg>`);
    const ps = [...el.querySelectorAll('path')];
    return { el, upd(t, s) { const k = SP(t, s, .7); set(el, { s: lerp(.2, 1, k), o: A(t, s, .12) }); ps.forEach((p, i) => p.setAttribute('stroke-dashoffset', (1 - A(t, s + .08 + i * .08, .25, E.io)).toFixed(3))); } };
  };
  // ================= left: no daemons
  const dc = put(root, H.card({ w: 620, h: 238 }), 88, 222);
  const dh = put(dc, h('div', ''), 28, 26); dh.style.cssText += 'display:flex;align-items:center;gap:14px;white-space:nowrap';
  dh.innerHTML = `<span style="width:52px;height:52px;border-radius:15px;background:${COL.red};display:flex;align-items:center;justify-content:center"><svg width="30" height="30" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5" fill="none" stroke="#fff" stroke-width="2.4"/><path d="M6 6l12 12" stroke="#fff" stroke-width="2.4"/></svg></span><span style="font:800 31px Geist;letter-spacing:-.015em">No long-running daemons</span>`;
  const proc = put(dc, h('div', ''), 28, 98, 564, 60); proc.style.cssText += 'display:flex;align-items:center;gap:14px;padding:0 18px;border-radius:14px;background:#f5f6f9;box-shadow:inset 0 0 0 1px rgba(21,22,28,.07)';
  proc.innerHTML = `<span class="pd" style="width:11px;height:11px;border-radius:50%;background:${COL.green};display:block;flex:none"></span><span class="mono strike" style="font:600 21px Maple;white-space:nowrap">render-daemon · up 6h 12m</span>`;
  const pdot = proc.querySelector('.pd'), pst = proc.querySelector('.strike');
  const px = badge('x'); put(dc, px.el, 554, 112, 32, 32);
  const cap = put(dc, h('div', '', 'A nap or an update would kill it anyway.'), 30, 180); cap.style.cssText += `font:600 21px Geist;color:${COL.sub};white-space:nowrap`;
  // ================= left: what bootstrap installs
  const ITEMS = [['ffmpeg', 'encode · extract · mix', '#e8553c', 'ff'], ['Python', 'beat analysis · librosa', COL.amber, 'Py'], ['Headless browser', 'Chromium · puppeteer', COL.blue, '◎']];
  const items = ITEMS.map(([nm, sub, col, ab], i) => {
    const e = put(root, H.card({ w: 620, h: 126 }), 88, 484 + i * 149);
    const tl = put(e, h('div', '', ab), 24, 27, 72, 72); tl.style.cssText += `border-radius:20px;background:color-mix(in srgb,${col} 14%,#fff);display:flex;align-items:center;justify-content:center;font:800 28px Geist;color:${col}`;
    put(e, h('div', '', `<div style="font:800 29px Geist;letter-spacing:-.01em">${nm}</div><div style="font:600 20px Geist;color:${COL.sub};margin-top:4px">${sub}</div>`), 118, 30);
    const spin = put(e, h('div', ''), 548, 45, 36, 36); spin.style.cssText += `border-radius:50%;border:3.5px solid #e6e8ef;border-top-color:${col}`;
    const bd = badge('ok'); put(e, bd.el, 544, 41, 44, 44);
    const done = put(e, h('div', '', 'installed'), 436, 50); done.style.cssText += `font:700 20px Geist;color:${COL.green}`;
    return { e, tl, spin, bd, done, i };
  });
  // ================= right: terminal
  const term = put(root, win({ title: '/workspace/studio', dark: true, tag: 'bash · Cloud Computer' }), 740, 222, 1092, 686);
  term.querySelector('.wt').style.cssText += ';font:600 19px Maple';
  const tb = term.body; tb.style.cssText += 'position:absolute;left:0;top:46px;right:0;bottom:0;padding:0';
  const cmd = put(tb, h('div', 'term', ''), 32, 22); cmd.style.cssText += 'font-size:23px';
  const one = put(tb, h('div', '', '1 command'), 0, 22); one.style.cssText += 'left:auto;right:32px;display:inline-flex;align-items:center;height:38px;padding:0 16px;border-radius:999px;background:#7ee0b8;color:#0f2a20;font:800 19px Geist';
  const CMD = '$ bash /workspace/studio/bootstrap.sh';
  const pre = put(tb, h('div', ''), 32, 22, 1028, 200);
  const preC = put(pre, h('div', 'term', ''), 0, 0); preC.style.cssText += 'font-size:23px';
  const preO = put(pre, h('div', ''), 0, 56, 1028, 62); preO.style.cssText += 'display:flex;align-items:center;gap:18px;padding:0 18px;border-radius:12px;background:rgba(255,255,255,.05);font:600 22px Maple;color:#e8e9f0;white-space:nowrap';
  preO.innerHTML = '<span class="dt" style="width:11px;height:11px;border-radius:50%;display:block"></span><span>render-daemon</span><span style="color:#6f7590">pid 4121</span><span style="color:#6f7590">up 6h 12m</span><span class="st" style="margin-left:auto;font:800 19px Geist"></span>';
  const preDt = preO.querySelector('.dt'), preSt = preO.querySelector('.st');
  const rows = [
    ['[1/3]', 'ffmpeg', '7.1', T.re - .2, T.ff + .4],
    ['[2/3]', 'python · librosa', '3.12', T.ff + .3, T.py + .45],
    ['[3/3]', 'chromium · headless', '131', T.py + .35, T.br + .4],
  ].map(([n, label, ver, s, e], i) => {
    const r = put(tb, h('div', ''), 32, 86 + i * 76, 1028, 62);
    r.style.cssText += 'display:flex;align-items:center;gap:18px;border-radius:12px;padding:0 18px;background:rgba(255,255,255,.04)';
    r.innerHTML = `<span style="font:500 20px Maple;color:#6f7590">${n}</span><span style="font:600 22px Maple;color:#e8e9f0;flex:1">${label}</span>`;
    const track = r.appendChild(h('span', '')); track.style.cssText = 'display:block;width:300px;height:8px;border-radius:4px;background:rgba(255,255,255,.1);overflow:hidden';
    const fill = track.appendChild(h('i', '')); fill.style.cssText = 'display:block;height:100%;border-radius:4px;background:linear-gradient(90deg,#5a5cf0,#7ee0b8)';
    const pct = r.appendChild(h('span', 'mono', '')); pct.style.cssText = 'width:110px;text-align:right;font:600 20px Maple;color:#9aa0b4';
    return { r, fill, pct, s, e, ver, i };
  });
  const ready = put(tb, h('div', 'term', ''), 32, 316); ready.style.cssText += 'font-size:22px;color:#5ee39b';
  const tReady = T.br + .55;
  const div = put(tb, h('div', ''), 32, 372, 1028, 1); div.style.background = 'rgba(255,255,255,.08)';
  // render section
  const rcmd = put(tb, h('div', 'term', ''), 32, 390); rcmd.style.cssText += 'font-size:23px';
  const RCMD = '$ node render.mjs film_017 --resume';
  const rinfo = put(tb, h('div', 'mono', ''), 32, 440); rinfo.style.cssText += 'font:500 19px Maple;color:#8d93ab;white-space:nowrap';
  rinfo.innerHTML = `3,600 frames · each one saved to <span style="color:#ffd66b">frames/</span> the moment it's captured`;
  const COLS = 60, ROWS = 4, GX = 32, GY = 482, CWd = 1028 / COLS;
  const grid = put(tb, h('div', ''), GX, GY, 1028, ROWS * 20);
  const cells = [...Array(COLS * ROWS)].map((_, j) => { const e = put(grid, h('div', ''), (j % COLS) * CWd, Math.floor(j / COLS) * 20, CWd - 3, 16); e.style.cssText += 'border-radius:3px;background:rgba(255,255,255,.07)'; return e; });
  const nap = put(tb, h('div', ''), GX - 8, GY - 8, 1044, ROWS * 20 + 12); nap.style.cssText += 'border-radius:10px;background:rgba(18,24,56,.82);display:flex;align-items:center;justify-content:center;gap:14px;font:800 24px Geist;color:#ffd66b;white-space:nowrap';
  nap.innerHTML = `<span style="width:34px;height:34px;display:block">${IC.moon()}</span><span>Computer asleep · frames kept on disk</span>`;
  const stat = put(tb, h('div', ''), 32, 584, 1028, 40); stat.style.cssText += 'display:flex;align-items:center;gap:16px;white-space:nowrap';
  const cnt = stat.appendChild(h('span', 'mono', '')); cnt.style.cssText = 'font:700 22px Maple;color:#e8e9f0';
  const pill = stat.appendChild(h('span', '', '')); pill.style.cssText = 'display:inline-flex;align-items:center;gap:8px;height:36px;padding:0 16px;border-radius:999px;font:800 19px Geist';
  const lose = stat.appendChild(h('span', '', '<span class="strike">restart from frame 0</span>')); lose.style.cssText = 'margin-left:auto;display:inline-flex;align-items:center;height:36px;padding:0 16px;border-radius:999px;background:rgba(240,68,58,.14);color:#ff7a70;font:700 19px Geist';
  const loseS = lose.firstChild;

  // render progress model (frames out of 3600)
  const tR0 = T.resum - .2, tNap = T.nap, tWake = T.min - .15;
  const frameAt = (t) => {
    if (t < tR0) return 0;
    const a = Math.min(t, tNap) - tR0; let f = a * 530;
    if (t > tWake) f += (t - tWake) * 560;
    return Math.min(3600, f);
  };
  const tPause = frameAt(tNap);

  ctx.cue(.1, 'whoosh', .45); ctx.cue(T.daemon + .15, 'error', .5); ctx.cue(T.boot, 'type', .45);
  rows.forEach(r => ctx.cue(r.e, 'ding', .35)); ctx.cue(T.one, 'pop', .55); ctx.cue(T.render, 'type', .4);
  ctx.cue(tNap, 'swoosh', .45); ctx.cue(tWake, 'click', .5); ctx.cue(T.whole + .2, 'error', .35);

  return (t) => {
    // daemon card
    enter(dc, t, .1, { dy: 50, rx: 10 });
    set(dh, { o: lerp(.35, 1, A(t, T.no - .15, .3)), x: 0 });
    const killed = A(t, T.daemon + .15, .35);
    H.strike(pst, A(t, T.daemon + .15, .4, E.io)); pst.style.color = killed > .5 ? COL.sub : COL.ink;
    pdot.style.background = killed > .5 ? COL.red : COL.green;
    const pp = (t * 1.3) % 1; pdot.style.boxShadow = killed > .5 ? 'none' : `0 0 0 ${(pp * 7).toFixed(1)}px rgba(31,191,117,${(.4 * (1 - pp)).toFixed(2)})`;
    px.upd(t, T.daemon + .2);
    proc.style.background = `color-mix(in srgb,#f0443a ${(8 * killed).toFixed(1)}%,#f5f6f9)`;
    set(cap, { o: A(t, T.daemon + .5, .4), x: -10 * (1 - A(t, T.daemon + .5, .5)) });
    set(proc, { o: A(t, .5, .3), x: 0 });
    // terminal
    enter(term, t, .2, { dx: 80, dy: 0, rx: 0, s0: .95 });
    H.type(preC, '$ ps -ef | grep render', t, .55, 40, t < 1.3);
    preC.innerHTML = preC.innerHTML.replace(/^\$/, '<span class="p">$</span>');
    const dead = t > T.daemon + .15;
    set(preO, { o: A(t, 1.25, .25), y: 8 * (1 - A(t, 1.25, .4)) });
    preDt.style.background = dead ? '#ff7a70' : '#5ee39b'; preSt.textContent = dead ? '✗ dies on sleep' : '● running'; preSt.style.color = dead ? '#ff7a70' : '#5ee39b';
    preO.style.background = dead ? 'rgba(240,68,58,.12)' : 'rgba(255,255,255,.05)';
    set(pre, { o: 1 - A(t, T.boot - .45, .3), y: -20 * A(t, T.boot - .45, .4) });
    H.type(cmd, CMD, t, T.boot - .1, 60, t < T.ff);
    cmd.innerHTML = cmd.innerHTML.replace(/^\$/, '<span class="p">$</span>');
    const ok1 = SP(t, T.one, .7); set(one, { s: lerp(.5, 1, ok1), o: A(t, T.one, .15) });
    rows.forEach(({ r, fill, pct, s, e, ver }) => {
      enter(r, t, s - .15, { dy: 16, rx: 0, blur: 3 });
      const k = E.io(P(t, s, e)); fill.style.width = (k * 100).toFixed(1) + '%';
      pct.innerHTML = t >= e ? `<span style="color:#5ee39b">✓ ${ver}</span>` : `${Math.round(k * 100)}%`;
      r.style.background = t >= e ? `rgba(31,191,117,${(.1 * (1 - A(t, e + .3, .6)) + .05).toFixed(3)})` : 'rgba(255,255,255,.04)';
    });
    H.type(ready, '✓ studio ready  ·  re-run any time', t, tReady, 50, false);
    set(div, { o: A(t, T.render - .3, .4) });
    H.type(rcmd, RCMD, t, T.render - .1, 60, t < T.resum + .4);
    rcmd.innerHTML = rcmd.innerHTML.replace(/^\$/, '<span class="p">$</span>');
    set(rinfo, { o: A(t, T.resum - .1, .3) });
    const f = frameAt(t), per = 3600 / cells.length;
    const asleep = t >= tNap && t < tWake;
    cells.forEach((c, j) => {
      const k = cl(f / per - j);
      const resumed = t >= tWake && j * per >= tPause;
      c.style.background = k <= 0 ? 'rgba(255,255,255,.07)' : (resumed ? `rgba(126,224,184,${(.3 + .7 * k).toFixed(2)})` : `rgba(90,92,240,${(.35 + .65 * k).toFixed(2)})`);
    });
    set(grid, { o: A(t, T.resum - .2, .3) });
    set(nap, { o: A(t, tNap, .25) * (1 - A(t, tWake - .05, .25)), s: lerp(.96, 1, A(t, tNap, .3)) });
    cnt.textContent = t > tR0 ? `${Math.floor(f).toLocaleString('en-US')} / 3,600 on disk` : '';
    let pt = '', pb = 'transparent', pc = '#fff';
    if (t > tR0 && t < tNap) { pt = '● rendering'; pb = 'rgba(90,92,240,.3)'; pc = '#c9cbff'; }
    else if (asleep) { pt = '☾ asleep'; pb = '#1d2552'; pc = '#ffd66b'; }
    else if (t >= tWake) { pt = `▶ resumed at frame ${(Math.floor(tPause) + 1).toLocaleString('en-US')}`; pb = 'rgba(126,224,184,.2)'; pc = '#7ee0b8'; }
    if (pill.textContent !== pt) pill.textContent = pt; pill.style.background = pb; pill.style.color = pc; pill.style.opacity = pt ? 1 : 0;
    set(pill, { s: t >= tWake ? 1 + .12 * Math.exp(-6 * (t - tWake)) : 1 });
    set(lose, { o: A(t, T.whole - .1, .25), x: 14 * (1 - A(t, T.whole - .1, .4)) }); H.strike(loseS, A(t, T.whole + .2, .4, E.io));
    // installed list
    items.forEach(({ e, tl, spin, bd, done, i }) => {
      enter(e, t, T.boot - .3 + i * .1, { dy: 30, rx: 8 });
      const fin = rows[i].e;
      set(spin, { r: t * 400, o: (1 - A(t, fin, .15)) * A(t, rows[i].s - .2, .2) });
      bd.upd(t, fin); set(done, { x: 10 * (1 - A(t, fin + .1, .4)), o: A(t, fin + .1, .3) });
      e.style.boxShadow = `0 0 0 ${(2.5 * A(t, fin, .3)).toFixed(2)}px rgba(31,191,117,.55),0 18px 50px -12px rgba(30,34,70,.18),0 4px 12px rgba(30,34,70,.06)`;
      set(tl, { s: 1 + .12 * Math.max(0, 1 - Math.abs(t - fin - .1) / .2) });
    });
  };
};
