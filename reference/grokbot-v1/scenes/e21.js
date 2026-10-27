// e21 — licensed track; Python script measures the beat grid; every scene change snaps to it; click track lets you check sync by ear in 5 s
SCENES.e21 = (root, ctx, H) => {
  const { put, h, set, enter, A, SP, E, P, lerp, cl, rnd } = H;
  const D = (p, x, y, w, hh, css = '', html = '') => { const e = put(p, h('div', '', html), x, y, w, hh); if (css) e.style.cssText += ';' + css; return e; };
  const T = {
    use: ctx.at('Use a'), lic: ctx.at('licensed'), script: ctx.at('Python'), grid: ctx.at('beat grid'), change: ctx.at('every scene'), land: ctx.at('snaps'),
    click: ctx.at('click track'), check: ctx.at('check the sync'), ear: ctx.at('by ear'), five: ctx.at('five seconds'), squint: ctx.at('squinting'),
  };
  const CHK = 'M5 12.5l4.5 4.5L19 7.5';

  // ---------- timeline window
  const tw = put(root, H.win({ title: 'Beat grid · Director', w: 1720, h: 384 }), 100, 228);
  const X0 = 250, TW = 1440, NB = 16, BP = TW / NB;
  const lab = (y, html, css = '') => D(tw, 30, y, 210, 60, 'font:700 22px Maple;white-space:nowrap;' + css, html);
  lab(78, 'track.wav');
  const lic = D(tw, 30, 112, 150, 32, 'border-radius:999px;background:#e5f8ee;color:#119a5a;font:700 16px Geist;display:flex;align-items:center;justify-content:center;gap:6px', `<svg width="14" height="14" viewBox="0 0 24 24"><path d="${CHK}" stroke="#119a5a" stroke-width="3.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>Licensed`);
  lab(214, 'Scenes', 'font:800 24px Geist');
  const clkLab = lab(292, 'clicks.wav', 'color:#b4b7c3');
  const wvWrap = D(tw, X0, 64, TW, 110, 'overflow:hidden');
  let bars = ''; const NBAR = 240, bw = TW / NBAR;
  for (let i = 0; i < NBAR; i++) { const x = i * bw, ph = (x % BP) / BP; const a = cl(.18 + .32 * rnd(i + 3) + .55 * Math.exp(-ph * 6) * (Math.floor(x / BP) % 4 === 0 ? 1 : .75)); const hh = 8 + a * 92; bars += `<rect x="${(x + 1).toFixed(1)}" y="${(55 - hh / 2).toFixed(1)}" width="${(bw - 2.2).toFixed(1)}" height="${hh.toFixed(1)}" rx="1.6" fill="${Math.floor(x / BP) % 4 === 0 && ph < .12 ? '#3a6cf4' : '#9db4f7'}"/>`; }
  wvWrap.innerHTML = `<svg width="${TW}" height="110">${bars}</svg>`;
  const grid = [...Array(NB + 1)].map((_, i) => {
    const down = i % 4 === 0;
    const l = D(tw, X0 + i * BP - (down ? 1.5 : 1), 60, down ? 3 : 2, 290, `background:${down ? 'rgba(58,108,244,.55)' : 'rgba(58,108,244,.22)'};transform-origin:top;border-radius:2px`);
    const n = down && i < NB ? D(tw, X0 + i * BP + 6, 54, 30, 20, 'font:700 15px Maple;color:#3a6cf4', String(i / 4 + 1)) : null;
    return { l, n };
  });
  const LEN = [2, 1, 2, 1, 3, 2, 1, 2, 2], COLS = ['#d8f5ec', '#ffe9c7', '#e6e3ff', '#efe2ff', '#dbeaff', '#ffe0d6', '#d8f5ec', '#e6e3ff', '#ffe9c7'], INK = ['#2fc7a4', '#f5a524', '#5a5cf0', '#8b5cf6', '#3a6cf4', '#f07a5a', '#2fc7a4', '#5a5cf0', '#f5a524'];
  let acc = 0;
  const blocks = LEN.map((n, i) => {
    const x = acc * BP; acc += n;
    const off = (rnd(i + 11) - .5) * 56, woff = (rnd(i + 23) - .5) * 44;
    const b = D(tw, X0, 196, 10, 64, `border-radius:12px;background:${COLS[i]};box-shadow:inset 0 0 0 2px ${INK[i]}33;overflow:hidden`);
    D(b, 14, 18, 40, 8, `border-radius:4px;background:${INK[i]}`);
    D(b, 14, 34, 22, 8, `border-radius:4px;background:${INK[i]}66`);
    const fl = D(tw, X0 + x - 3, 186, 6, 84, 'border-radius:3px;background:#3a6cf4;box-shadow:0 0 14px #3a6cf4');
    return { b, fl, x, w: n * BP, off, woff };
  });
  const snapTag = D(tw, 0, 0, null, null, 'font:800 16px Geist;color:#fff;background:#3a6cf4;border-radius:8px;padding:4px 10px;white-space:nowrap', 'snap to beat');
  const ticks = [...Array(NB)].map((_, i) => D(tw, X0 + i * BP - 3, i % 4 === 0 ? 280 : 290, 6, i % 4 === 0 ? 50 : 34, 'border-radius:3px;background:#15161c;transform-origin:bottom'));
  const ph = D(tw, X0 - 2, 56, 4, 300, 'background:#15161c;border-radius:2px');
  D(ph, -8, -6, 20, 14, 'background:#15161c;border-radius:4px 4px 10px 10px');

  // ---------- terminal
  const tm = put(root, H.win({ title: 'terminal', dark: true, w: 1000, h: 268 }), 100, 642);
  const l1 = D(tm.body, 24, 18, 950, 36); l1.className = 'term';
  const l1p = l1.appendChild(h('span', 'p', '$ ')); const l1t = l1.appendChild(h('span', '', ''));
  const l2 = D(tm.body, 24, 56, 950, 36, '', '<span class="d">{</span><span class="y">"bpm"</span>: <span class="g">120</span>, <span class="y">"beats"</span>: <span class="g">64</span>, <span class="y">"downbeats"</span>: beats[::4]<span class="d">}</span>'); l2.className = 'term';
  const l3 = D(tm.body, 24, 94, 950, 36, '', '<span class="d"># clicks.wav = track + a click on every beat</span>'); l3.className = 'term';
  const l4 = D(tm.body, 24, 132, 950, 36, '', '<span class="g">✓</span> beats.json · clicks.wav written'); l4.className = 'term';
  const CMD = 'python beats.py track.wav > beats.json';

  // ---------- by-ear card
  const hc = put(root, H.card({ w: 700, h: 268 }), 1120, 642);
  const hp = D(hc, 32, 34, 112, 112, 'border-radius:30px;background:#15161c;display:flex;align-items:center;justify-content:center', '<svg width="66" height="66" viewBox="0 0 48 48"><path d="M8 28v-4a16 16 0 0132 0v4" stroke="#fff" stroke-width="4.5" fill="none" stroke-linecap="round"/><rect x="5" y="26" width="10" height="15" rx="4" fill="#fff"/><rect x="33" y="26" width="10" height="15" rx="4" fill="#fff"/></svg>');
  const hring = D(hc, 32, 34, 112, 112, 'border-radius:30px;box-shadow:0 0 0 3px #3a6cf4');
  D(hc, 172, 34, 500, 52, 'font:800 42px Geist;white-space:nowrap;letter-spacing:-.02em', 'Check it by ear');
  const sub = D(hc, 174, 96, 500, 60, 'font:600 21px/1.4 Geist;color:#6b6e7b', '<b style="color:#15161c">5 seconds</b> of listening, not<br><span class="sq strike" style="display:inline-block">squinting at waveforms</span>');
  const sq = sub.querySelector('.sq');
  const viz = D(hc, 32, 182, 430, 60);
  const vb = [...Array(16)].map((_, i) => D(viz, i * 27, 0, 12, 60, `border-radius:6px;background:${i % 4 === 0 ? '#3a6cf4' : '#9db4f7'};transform-origin:center`));
  const ok = D(hc, 486, 190, 186, 46, 'border-radius:999px;background:#1fbf75;color:#fff;font:800 21px Geist;display:flex;align-items:center;justify-content:center;gap:8px;box-shadow:0 10px 24px -10px rgba(31,191,117,.7)', `<svg width="22" height="22" viewBox="0 0 24 24"><path d="${CHK}" stroke="#fff" stroke-width="3.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>In sync`);

  ctx.cue(.15, 'swoosh', .5); ctx.cue(T.lic, 'pop', .4); ctx.cue(T.script, 'type', .5); ctx.cue(T.grid, 'tick', .5);
  [0, 3, 6].forEach(i => ctx.cue(T.land - .3 + i * .07, 'tick', .45)); ctx.cue(T.click, 'pop', .4);
  ctx.cue(T.ear - .2, 'pop', .45); ctx.cue(T.squint + .2, 'error', .3); ctx.cue(T.five + 1, 'ding', .55);

  const PH0 = T.click + .35, PH1 = T.five + .9;
  return (t) => {
    enter(tw, t, .08, { dy: 60, rx: 10 });
    wvWrap.style.clipPath = `inset(0 ${(100 - A(t, T.use + .1, 1.4, E.io) * 100).toFixed(2)}% 0 0)`;
    set(lic, { s: lerp(.6, 1, SP(t, T.lic, .8)), o: A(t, T.lic, .25) });
    grid.forEach((g, i) => { const k = A(t, T.grid - .1 + i * .035, .5, E.quart); set(g.l, { sy: k, o: k }); if (g.n) set(g.n, { o: A(t, T.grid + i * .035 + .2, .3) }); });
    blocks.forEach((bk, i) => {
      const s = T.land - .35 + i * .07, k = SP(t, s, .7);
      const x = bk.x + bk.off * (1 - k), w = bk.w + bk.woff * (1 - k) - 6;
      Object.assign(bk.b.style, { left: (X0 + x + 3).toFixed(1) + 'px', width: w.toFixed(1) + 'px' });
      set(bk.b, { o: A(t, T.change - .4 + i * .05, .4), y: 12 * (1 - A(t, T.change - .4 + i * .05, .5)) });
      const f = P(t, s + .12, s + .55); set(bk.fl, { o: f > 0 && f < 1 ? Math.sin(f * Math.PI) * .9 : 0, sy: lerp(.6, 1, f) });
    });
    snapTag.style.left = (X0 + blocks[4].x + 20) + 'px'; snapTag.style.top = '160px';
    set(snapTag, { o: A(t, T.land, .25) * (1 - A(t, T.click - .2, .3)), y: 6 * (1 - A(t, T.land, .4)) });
    const clkOn = A(t, T.click - .1, .4); clkLab.style.color = `rgba(21,22,28,${lerp(.3, 1, clkOn).toFixed(2)})`;
    const pk = E.sine(P(t, PH0, PH1)), phx = pk * TW;
    ticks.forEach((tk, i) => {
      const k = SP(t, T.click + i * .04, .6);
      const d = phx - i * BP, hit = t > PH0 && d >= 0 ? Math.exp(-d / 30) : 0;
      set(tk, { sy: k * (1 + .35 * hit), o: A(t, T.click + i * .04, .2) });
      tk.style.background = hit > .2 ? '#3a6cf4' : '#15161c';
    });
    set(ph, { x: phx, o: A(t, PH0 - .2, .25) });
    // terminal
    enter(tm, t, T.script - .5, { dy: 50, rx: 10 });
    l1p.style.opacity = t >= T.script - .15 ? 1 : 0;
    H.type(l1t, CMD, t, T.script - .05, 40, t < T.grid + .4);
    set(l2, { o: A(t, T.grid + .4, .3), x: 10 * (1 - A(t, T.grid + .4, .4)) });
    set(l3, { o: A(t, T.click, .3), x: 10 * (1 - A(t, T.click, .4)) });
    set(l4, { o: A(t, T.click + .5, .3), x: 10 * (1 - A(t, T.click + .5, .4)) });
    // by ear
    enter(hc, t, T.click - .4, { dy: 50, rx: 10 });
    let beatHit = 0; for (let i = 0; i < NB; i++) { const d = phx - i * BP; if (t > PH0 && d >= 0) beatHit = Math.max(beatHit, Math.exp(-d / 40)); }
    if (t > PH1) beatHit = Math.max(0, Math.sin(((t - PH1) * 4) % 1 * Math.PI)) ** 6 * .7; // keeps pulsing on the beat after the sweep
    set(hp, { s: 1 + .06 * beatHit });
    set(hring, { s: 1 + .25 * (1 - beatHit), o: beatHit * .8 });
    vb.forEach((b, i) => { const d = phx - i * BP; const hit = t > PH0 && d >= 0 ? Math.exp(-d / 50) : 0; set(b, { sy: .25 + .15 * Math.abs(Math.sin(t * 4 + i)) + .6 * hit, o: lerp(.35, 1, A(t, T.ear, .4)) }); });
    set(sub, { o: A(t, T.five - .2, .35), y: 8 * (1 - A(t, T.five - .2, .4)) });
    H.strike(sq, A(t, T.squint + .2, .45, E.io)); sq.style.color = t > T.squint + .4 ? '#a6a9b5' : '#6b6e7b';
    set(ok, { s: lerp(.5, 1, SP(t, T.five + 1, .7)), o: A(t, T.five + 1, .2) });
  };
};
