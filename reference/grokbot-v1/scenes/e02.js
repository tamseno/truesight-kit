// e02 — the one-prompt era: a viral template (1.2M views, 21K saves) · thousands tried · one clip + a laptop rendering all night · a demo vs a studio
SCENES.e02 = (root, ctx, H) => {
  const { put, h, set, enter, A, SP, E, P, lerp, cl, card, win, IC, bot, BOTS, BOT_ORDER, rnd, type } = H;
  const T = {
    sep: ctx.at('September'), tpl: ctx.at('prompt template'), code: ctx.at('code-only'), pulled: ctx.at('pulled'), mil: ctx.at('1.2'), tw: ctx.at('twenty-one'), saves: ctx.at('saves'),
    thou: ctx.at('Thousands'), most: ctx.at('Most of them'), great: ctx.at('great clip'), laptop: ctx.at('laptop'), rend: ctx.at('rendering'), night: ctx.at('all night'),
    demo: ctx.at("That's a demo"), studio: ctx.at('A studio'), diff: ctx.at('different'),
    verbs: [ctx.at('plans'), ctx.at('builds'), ctx.at('renders'), ctx.at('judges'), ctx.at('ships')],
  };
  const css = (el, s) => { el.style.cssText += s; return el; };
  const pad = n => String(n).padStart(2, '0');
  const G = put(root, h('div', ''), 0, 0, 1920, 1080); // acts 1-2 group

  // ================= left: the viral post + stats
  const L = put(G, card({ w: 640, h: 680 }), 110, 228);
  const av = css(put(L, h('div', '', 'TC'), 32, 30, 60, 60), 'border-radius:50%;background:linear-gradient(135deg,#ff8a5c,#f0443a);color:#fff;display:flex;align-items:center;justify-content:center;font:800 22px Geist');
  css(put(L, h('div', '', '<div style="font:800 26px Geist">@twoclipping</div><div style="font:500 19px Geist;color:#6b6e7b;margin-top:2px">prompt template</div>'), 108, 30), 'white-space:nowrap');
  const sepC = css(put(L, h('div', '', 'Sep'), 520, 42, 88, 38), 'display:flex;align-items:center;justify-content:center;border-radius:999px;background:#f1f2f6;font:700 19px Geist;color:#3c3f4c');
  const ttl = css(put(L, h('div', '', 'One prompt, one UI animation'), 32, 116), 'font:800 32px Geist;letter-spacing:-.015em;white-space:nowrap');
  const codeC = css(put(L, h('div', '', '&lt;/&gt; code-only'), 32, 166, null, 36), 'display:inline-flex;align-items:center;padding:0 14px;border-radius:999px;background:#eef2ff;color:#3a6cf4;font:700 18px Maple;white-space:nowrap');
  const pv = css(put(L, h('div', ''), 32, 222, 576, 236), 'border-radius:18px;background:linear-gradient(160deg,#ffe8de,#ffd6c7);overflow:hidden');
  const blob = css(put(pv, h('div', ''), 238, 68, 100, 100), 'background:#f0603a;box-shadow:0 18px 30px -12px rgba(240,96,58,.7)');
  const blob2 = css(put(pv, h('div', ''), 0, 0, 44, 44), 'border-radius:50%;background:#ffb08f');
  const ptr = css(put(pv, h('div', ''), 24, 208, 528, 7), 'border-radius:4px;background:rgba(255,255,255,.65);overflow:hidden');
  const pf = ptr.appendChild(h('div', '')); pf.style.cssText = 'height:100%;background:#f0603a';
  const tcd = css(put(pv, h('div', 'mono', '0:00'), 24, 172), 'font:700 19px Maple;color:#b4472a');
  // stats
  const st1 = put(L, h('div', ''), 32, 482, 276, 166), st2 = put(L, h('div', ''), 332, 482, 276, 166);
  [st1, st2].forEach(s => css(s, 'border-radius:18px;background:#f6f7fa'));
  css(put(st1, h('div', '', 'views'), 22, 18), 'font:600 20px Geist;color:#6b6e7b');
  const vN = css(put(st1, h('div', '', '0'), 22, 46), 'font:800 52px Geist;letter-spacing:-.03em;white-space:nowrap');
  const spk = put(st1, h('div', '', `<svg viewBox="0 0 232 50" width="232" height="50"><defs><linearGradient id="e02g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f0443a" stop-opacity=".25"/><stop offset="1" stop-color="#f0443a" stop-opacity="0"/></linearGradient></defs><path class="ar" fill="url(#e02g)"/><path class="ln" fill="none" stroke="#f0443a" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/><circle class="dt" r="5" fill="#f0443a"/></svg>`), 22, 108, 232, 50);
  const spLn = spk.querySelector('.ln'), spAr = spk.querySelector('.ar'), spDt = spk.querySelector('.dt');
  css(put(st2, h('div', '', 'saves'), 22, 18), 'font:600 20px Geist;color:#6b6e7b');
  const sN = css(put(st2, h('div', '', '0'), 22, 46), 'font:800 52px Geist;letter-spacing:-.03em;white-space:nowrap');
  const bm = put(st2, h('div', '', `<svg viewBox="0 0 24 24" width="40" height="40"><path d="M6 3h12v18l-6-4.5L6 21z" fill="#f5a524"/></svg>`), 214, 20, 40, 40);
  const sBar = css(put(st2, h('div', ''), 22, 128, 232, 8), 'border-radius:4px;background:#e8e9ef;overflow:hidden');
  const sF = sBar.appendChild(h('div', '')); sF.style.cssText = 'height:100%;background:#f5a524;border-radius:4px';

  // ================= right A: the template itself
  const RW = 1040, RH = 680, RX = 790, RY = 228;
  const tw = put(G, win({ title: 'ui-animation-template.md', tag: 'prompt', w: RW, h: RH }), RX, RY);
  const tLines = ['<direction>', 'Dribbble-level UI motion. One shape,', 'never cut. Springs everywhere.', 'Banned: bouncy easing, particle bursts', '<build> 4 subframes · tmix · 60 fps', '<start> state list on the beat grid'];
  const tEls = tLines.map((s, i) => css(put(tw.body, h('div', 'mono', ''), 40, 26 + i * 72), `font:${i === 0 ? '700 36px' : '500 30px'} Maple;color:${i === 0 ? '#15161c' : '#3c3f4c'};white-space:nowrap`));
  const tStart = tLines.map((_, i) => T.tpl - .2 + i * .8);
  const copyB = css(put(tw.body, h('div', '', `<svg viewBox="0 0 24 24" width="24" height="24"><rect x="8" y="8" width="12" height="13" rx="2.5" fill="none" stroke="#fff" stroke-width="2.2"/><path d="M5 15V5.5A2.5 2.5 0 0 1 7.5 3H15" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/></svg><span>Copy prompt</span>`), 40, 520, null, 64), 'display:inline-flex;align-items:center;gap:12px;padding:0 26px;border-radius:16px;background:#15161c;color:#fff;font:700 24px Geist');
  tw.style.zIndex = 1; const copyN = css(put(tw.body, h('div', '', ''), 290, 538), 'font:600 24px Geist;color:#6b6e7b;white-space:nowrap');

  // ================= right B: thousands tried it
  const gr = put(G, card({ w: RW, h: RH }), RX, RY);
  gr.style.zIndex = 2; const grH = css(put(gr, h('div', '', 'Thousands tried it'), 40, 34), 'font:800 36px Geist;letter-spacing:-.02em;white-space:nowrap');
  const grSub = css(put(gr, h('div', 'mono', ''), 40, 86), 'font:600 22px Maple;color:#6b6e7b;white-space:nowrap');
  const COLS = 9, ROWS = 4, TW = 100, TH = 100, GX = 40, GY = 140;
  const tiles = [];
  for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
    const i = r * COLS + c, e = put(gr, h('div', ''), GX + c * (TW + 10), GY + r * (TH + 10), TW, TH);
    const hue = ['#ffe2d6', '#dff6ee', '#e5e8fb', '#fff1cc', '#e3efff', '#efe4ff'][i % 6];
    css(e, `border-radius:14px;background:${hue};overflow:hidden`);
    const s = css(put(e, h('div', ''), 34, 30, 32, 32), `border-radius:${['30%', '50%', '20%'][i % 3]};background:${['#f0603a', '#2fc7a4', '#5a5cf0', '#f5a524', '#3a86f4', '#8b5cf6'][i % 6]};opacity:.75`);
    tiles.push({ e, s, i, d: rnd(i + 77) });
  }
  const HERO = 13; const hero = tiles[HERO];
  const heroRing = css(put(gr, h('div', ''), GX + 4 * (TW + 10) - 8, GY + 1 * (TH + 10) - 8, TW + 16, TH + 16), 'border-radius:20px;box-shadow:0 0 0 4px #1fbf75,0 18px 34px -10px rgba(31,191,117,.55)');
  const heroCk = put(gr, h('div', '', IC.check()), GX + 5 * (TW + 10) - 30, GY + (TH + 10) - 24, 44, 44);
  const heroLab = css(put(gr, h('div', '', 'one great clip'), GX + 5 * (TW + 10) + 26, GY + (TH + 10) - 18, null, 40), 'display:flex;align-items:center;padding:0 16px;border-radius:999px;background:#1fbf75;color:#fff;font:700 21px Geist;white-space:nowrap;z-index:3');

  // ================= right C: laptop rendering all night
  const lp = put(G, card({ w: RW, h: RH }), RX, RY);
  lp.style.zIndex = 3; const lpN = css(put(lp, h('div', ''), 0, 0, RW, RH), 'background:radial-gradient(120% 100% at 80% 0%,#2a3470,#141a3c 70%)');
  const lStars = [...Array(30)].map((_, i) => { const z = 2 + rnd(i + 5) * 3; return css(put(lp, h('div', ''), 30 + rnd(i + 3) * 980, 20 + rnd(i + 11) * 340, z, z), 'border-radius:50%;background:#fff;box-shadow:0 0 6px #fff'); });
  const lMoon = put(lp, h('div', '', IC.moon()), 910, 34, 86, 86);
  const clock = put(lp, h('div', '', `<svg viewBox="0 0 100 100" width="100" height="100"><circle cx="50" cy="50" r="46" fill="#fff" stroke="#e3e5ec" stroke-width="3"/>${[...Array(12)].map((_, i) => `<rect x="49" y="9" width="2" height="${i % 3 ? 5 : 9}" rx="1" fill="#9aa0b4" transform="rotate(${i * 30} 50 50)"/>`).join('')}<rect class="hh" x="47.5" y="27" width="5" height="26" rx="2.5" fill="#15161c"/><rect class="mm" x="48.5" y="15" width="3" height="38" rx="1.5" fill="#15161c"/><circle cx="50" cy="50" r="4" fill="#f0443a"/></svg>`), 40, 34, 100, 100);
  const hh = clock.querySelector('.hh'), mm = clock.querySelector('.mm');
  css(put(lp, h('div', '', `<div style="font:800 34px Geist;color:#fff">One laptop, all night</div><div style="font:500 22px Geist;color:rgba(255,255,255,.6);margin-top:6px">lid open · fans on · can't close it</div>`), 164, 42), 'white-space:nowrap');
  const clk = css(put(lp, h('div', 'mono', '21:00'), 164, 140), 'font:700 30px Maple;color:#ffd66b');
  const lap = put(lp, h('div', ''), 230, 218, 580, 420);
  const scr = css(put(lap, h('div', ''), 50, 0, 480, 296), 'border-radius:16px 16px 4px 4px;background:#101116;border:10px solid #2a2c35;box-shadow:0 20px 40px -18px rgba(0,0,0,.5)');
  const glow = css(put(lap, h('div', ''), -40, -50, 660, 400), 'border-radius:50%;background:radial-gradient(closest-side,rgba(110,140,255,.32),rgba(110,140,255,0));z-index:-1');
  const spin = css(put(scr, h('div', ''), 26, 28, 26, 26), 'border-radius:50%;border:3px solid rgba(255,255,255,.18);border-top-color:#fff');
  css(put(scr, h('div', '', 'Rendering…'), 64, 24), 'font:700 26px Geist;color:#fff;white-space:nowrap');
  const fr = css(put(scr, h('div', 'mono', ''), 26, 84), 'font:500 21px Maple;color:#8d93ab;white-space:nowrap');
  const pc = css(put(scr, h('div', 'mono', ''), 330, 84, 100), 'font:700 21px Maple;color:#ffd66b;text-align:right');
  const tr = css(put(scr, h('div', ''), 26, 128, 408, 12), 'border-radius:6px;background:#2a2c38;overflow:hidden');
  const tf = tr.appendChild(h('div', '')); tf.style.cssText = 'height:100%;border-radius:6px;background:#5a7cff';
  css(put(scr, h('div', '', 'the bar barely moves'), 26, 160), 'font:500 20px Geist;color:#8d93ab');
  const thumbs = [...Array(6)].map((_, i) => css(put(scr, h('div', ''), 26 + i * 69, 206, 60, 40), `border-radius:6px;border:1px solid #2c2f3c;background:${i < 1 ? '#3a4a8a' : '#1d1f29'}`));
  const base = css(put(lap, h('div', ''), 0, 294, 580, 22), 'border-radius:4px 4px 14px 14px;background:linear-gradient(#e4e6ee,#c9ccd8);box-shadow:0 16px 30px -14px rgba(0,0,0,.45)');
  const fan = put(lp, h('div', '', `<svg viewBox="0 0 40 40" width="70" height="70"><circle cx="20" cy="20" r="19" fill="#eef0f5" stroke="#d6d9e3"/><g class="bl">${[0, 120, 240].map(a => `<path d="M20 20 C 20 10, 27 8, 29 12 C 30 15, 25 18, 20 20Z" fill="#9aa0b4" transform="rotate(${a} 20 20)"/>`).join('')}</g><circle cx="20" cy="20" r="3" fill="#6b6e7b"/></svg>`), 900, 540, 70, 70);
  const bl = fan.querySelector('.bl');
  const heat = [0, 1, 2].map(i => put(lp, h('div', '', `<svg viewBox="0 0 12 40" width="12" height="40"><path d="M6 38 C 0 30, 12 24, 6 16 C 0 9, 10 5, 6 1" stroke="#ff8a5c" stroke-width="2.6" fill="none" stroke-linecap="round"/></svg>`), 910 + i * 20, 488, 12, 40));

  // ================= "that's a demo"
  const veilL = css(put(L, h('div', ''), 0, 0, 640, 680), 'background:rgba(236,236,240,.6)');
  const veilR = css(put(lp, h('div', ''), 0, 0, RW, RH), 'background:rgba(236,236,240,.5)');
  const demo = put(G, h('div', '', `<span style="font:600 22px Geist;color:rgba(255,255,255,.6);letter-spacing:.14em;text-transform:uppercase">one prompt → one clip</span><span>That's a demo.</span>`), 660, 520);
  demo.style.zIndex = 5; css(demo, 'display:flex;flex-direction:column;align-items:center;gap:6px;padding:22px 46px 24px;border-radius:28px;background:#15161c;color:#fff;font:800 54px Geist;letter-spacing:-.02em;white-space:nowrap;box-shadow:0 30px 60px -16px rgba(10,10,30,.55);z-index:4');

  // ================= act 3: a studio
  const S = put(root, h('div', ''), 0, 0, 1920, 1080);
  const sH = put(S, h('div', '', `A studio is <span style="color:#3a6cf4">different</span>`), 112, 238); css(sH, 'font:800 52px Geist;letter-spacing:-.025em;white-space:nowrap');
  const sSub = put(S, h('div', 'mono', 'five roles · five bots · each hands off to the next'), 114, 312); css(sSub, 'font:600 23px Maple;color:#6b6e7b;white-space:nowrap');
  const VERB = ['plans', 'builds', 'renders', 'judges', 'ships'], DESC = ['shot list + spec', 'code for every scene', 'frames → mp4', 'scores against the spec', 'the finished film'];
  const rail = css(put(S, h('div', ''), 270, 860, 1400, 6), 'border-radius:3px;background:#e3e5ec;overflow:hidden');
  const railF = rail.appendChild(h('div', '')); railF.style.cssText = 'height:100%;border-radius:3px;background:linear-gradient(90deg,#33c9a6,#f5a524,#5a5cf0,#8b5cf6,#3a86f4)';
  const pkt = css(put(S, h('div', ''), 0, 846, 54, 34), 'border-radius:9px;background:#fff;box-shadow:0 0 0 1px rgba(21,22,28,.08),0 8px 18px -6px rgba(30,34,70,.35)');
  pkt.innerHTML = '<div style="margin:6px;height:22px;border-radius:5px;background:linear-gradient(90deg,#ffd6c7,#e5e8fb)"></div>';
  const st = BOT_ORDER.map((k, i) => {
    const x = 112 + i * 344, c = put(S, card({ w: 320, h: 440 }), x, 380);
    const tint = css(put(c, h('div', ''), 0, 0, 320, 440), `background:linear-gradient(180deg,color-mix(in srgb,${BOTS[k].c} 14%,#fff),#fff 65%)`);
    const ring = css(put(c, h('div', ''), 0, 0, 320, 440), `border-radius:22px;box-shadow:inset 0 0 0 3px ${BOTS[k].c}`);
    const b = bot(k, 120); put(c, b.el, 100, 40);
    css(put(c, h('div', '', 'someone'), 0, 192, 320), 'font:600 22px Geist;color:#9aa0b4;text-align:center');
    const vb = css(put(c, h('div', '', VERB[i]), 0, 222, 320), 'font:800 52px Geist;letter-spacing:-.025em;text-align:center');
    css(put(c, h('div', '', DESC[i]), 0, 296, 320), 'font:500 21px Geist;color:#6b6e7b;text-align:center');
    const nm = css(put(c, h('div', '', `● ${BOTS[k].name}`), 0, 372, 320), `font:700 22px Geist;color:${BOTS[k].c};text-align:center`);
    const node = css(put(S, h('div', ''), x + 160 - 11, 852, 22, 22), `border-radius:50%;background:#fff;box-shadow:inset 0 0 0 4px #d6d9e3`);
    return { c, b, tint, ring, vb, nm, node, t: T.verbs[i], i, k };
  });

  // cues
  ctx.cue(.15, 'swoosh', .5); ctx.cue(T.sep, 'tick', .4); ctx.cue(T.tpl - .2, 'type', .5); ctx.cue(T.mil, 'pop', .6); ctx.cue(T.tw, 'pop', .5);
  ctx.cue(T.thou - .1, 'whoosh', .5); ctx.cue(T.great, 'ding', .6); ctx.cue(T.laptop - .15, 'swoosh', .5); ctx.cue(T.demo, 'tick', .8);
  ctx.cue(T.studio - .25, 'whoosh', .6); st.forEach(s => ctx.cue(s.t, 'pop', .5)); ctx.cue(T.verbs[4] + .4, 'ding', .6);
  const f = k => 46 - 40 * Math.pow(k, 2.4) + Math.sin(k * 17) * 3 * (1 - k);
  const gOut = T.studio - .3;
  return (t) => {
    const go = A(t, gOut, .45, E.in); set(G, { o: 1 - go, y: -36 * go, s: 1 - .03 * go, b: 8 * go });
    if (go < 1) {
      enter(L, t, .1, { dy: 60, rx: 12 });
      set(sepC, { s: lerp(.6, 1, SP(t, T.sep, .6)), o: A(t, T.sep, .2) });
      set(codeC, { x: -16 * (1 - A(t, T.code, .5)), o: A(t, T.code, .3) });
      const lpp = (t * .14) % 1; pf.style.width = (lpp * 100).toFixed(1) + '%'; tcd.textContent = `0:${pad(Math.floor(lpp * 15))}`;
      const m = (Math.sin(t * 2.4) + 1) / 2; blob.style.borderRadius = `${lerp(50, 26, m)}%`; set(blob, { r: t * 70, s: 1 + .08 * Math.sin(t * 4.8) });
      set(blob2, { x: 288 + Math.cos(t * 1.9) * 170 - 22, y: 118 + Math.sin(t * 1.9) * 66 - 22, s: .8 + .2 * m });
      const vk = A(t, T.pulled, 1.6, E.io);
      vN.textContent = vk <= 0 ? '0' : vk < 1 ? (vk * 1200 < 1000 ? Math.round(vk * 1200) + 'K' : (vk * 1.2).toFixed(2) + 'M') : '1.2M';
      const pts = []; for (let i = 0; i <= 36; i++) { const k = i / 36 * vk; pts.push([4 + k * 222, f(k)]); }
      const d = 'M' + pts.map(p => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' L');
      spLn.setAttribute('d', vk > 0 ? d : ''); spAr.setAttribute('d', vk > 0 ? d + ` L${pts.at(-1)[0].toFixed(1)} 50 L4 50Z` : '');
      spDt.setAttribute('cx', pts.at(-1)[0]); spDt.setAttribute('cy', pts.at(-1)[1]); spDt.style.opacity = vk > 0 ? 1 : 0;
      const sk = A(t, T.tw - .1, 1.0, E.io); sN.textContent = sk <= 0 ? '0' : Math.round(sk * 21) + 'K'; sF.style.width = (sk * 72).toFixed(1) + '%';
      set(bm, { s: 1 + .25 * Math.exp(-6 * Math.max(0, t - T.saves)) * (t > T.saves ? 1 : 0), y: -6 * sk });
      set(st1, { o: .45 + .55 * A(t, T.pulled - .2, .4) }); set(st2, { o: .45 + .55 * A(t, T.tw - .2, .4) });
      // A: template
      enter(tw, t, .3, { dy: 60, rx: 12 });
      tEls.forEach((e, i) => type(e, tLines[i], t, tStart[i], 40, t < (tStart[i + 1] ?? T.thou)));
      set(copyB, { o: A(t, T.mil, .4), y: 14 * (1 - A(t, T.mil, .5)) });
      set(copyN, { o: A(t, T.mil + .2, .4) }); copyN.textContent = t < T.mil ? '' : `copied ${Math.round(lerp(12, 21, A(t, T.tw - .1, 1, E.io)))}K times`;
      // B: grid
      const gk = enter(gr, t, T.thou - .25, { dy: 70, rx: 10, s0: .97 });
      const nT = A(t, T.thou, 1.5, E.io);
      grSub.textContent = `remix #${String(Math.floor(lerp(1, 4096, nT))).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
      const hk = A(t, T.great - .1, .5, E.io);
      tiles.forEach(o => {
        const s = T.thou + o.d * 1.3, k = SP(t, s, .5);
        const isH = o.i === HERO;
        set(o.e, { s: lerp(.4, 1, k) * (isH ? 1 + .12 * hk : 1), o: A(t, s, .15) * (isH ? 1 : 1 - .65 * hk) });
        o.e.style.filter = !isH && hk > 0 ? `grayscale(${hk.toFixed(2)})` : 'none';
        o.e.style.zIndex = isH ? 2 : 1;
        set(o.s, { r: t * (30 + o.d * 60), y: Math.sin(t * 2 + o.i) * 6 });
      });
      set(heroRing, { o: hk, s: lerp(1.15, 1.12, hk) }); heroRing.style.zIndex = 2;
      set(heroCk, { s: lerp(.2, 1, SP(t, T.great + .15, .6)), o: A(t, T.great + .15, .15) }); heroCk.style.zIndex = 3;
      set(heroLab, { x: -14 * (1 - A(t, T.great + .25, .4)), o: A(t, T.great + .25, .3) });
      // C: laptop
      const lk = SP(t, T.laptop - .2, .9);
      set(lp, { x: 140 * (1 - lk), ry: -14 * (1 - lk), o: A(t, T.laptop - .2, .25) });
      const nk = A(t, T.night - .3, .9, E.io);
      lStars.forEach((s, i) => s.style.opacity = ((.35 + .65 * Math.abs(Math.sin(t * (1 + rnd(i) * 2) + i)))).toFixed(2));
      set(lMoon, { r: Math.sin(t * .9) * 5 });
      const mins = 1260 + 6 * Math.max(0, t - T.laptop) + 400 * E.io(P(t, T.night - .3, T.night + 1.4));
      hh.setAttribute('transform', `rotate(${(mins / 720 * 360) % 360} 50 50)`); mm.setAttribute('transform', `rotate(${(mins % 60) * 6} 50 50)`);
      clk.textContent = `${pad(Math.floor(mins / 60) % 24)}:${pad(Math.floor(mins % 60))}`;
      const rk = (mins - 1260) / 420; tf.style.width = (1.2 + rk * 2.4).toFixed(2) + '%'; pc.textContent = (1.2 + rk * 2.4).toFixed(1) + '%';
      fr.textContent = `frame ${String(Math.floor(22 + rk * 44)).padStart(4, '0')} / 1800`;
      set(spin, { r: t * 400 }); bl.setAttribute('transform', `rotate(${(t * (300 + 1400 * nk)) % 360} 20 20)`);
      thumbs.forEach((e, i) => { if (i === 1) e.style.background = `rgba(58,74,138,${cl(rk * 3).toFixed(2)})`; });
      glow.style.opacity = .6 + .4 * nk * (.8 + .2 * Math.sin(t * 3));
      heat.forEach((e, i) => { const ph = (t * .9 + i * .33) % 1; set(e, { y: -30 * ph, o: (.4 + .6 * nk) * Math.sin(ph * Math.PI) }); });
      // demo
      const dk = SP(t, T.demo, .8); set(demo, { s: lerp(.5, 1, dk), y: 24 * (1 - dk), o: A(t, T.demo, .2) });
      const vv = A(t, T.demo, .6); veilL.style.opacity = vv; veilR.style.opacity = vv;
      L.style.filter = vv > 0 ? `grayscale(${vv.toFixed(2)})` : 'none';
    }
    // act 3
    const s0 = gOut + .2;
    set(S, { o: A(t, s0, .2) });
    if (t > s0) {
      set(sH, { x: -20 * (1 - SP(t, s0 + .1, .8)), o: A(t, s0 + .1, .3) });
      const dk2 = A(t, T.diff, .5); sH.lastChild.style.color = `rgba(58,108,244,${(.25 + .75 * dk2).toFixed(2)})`;
      set(sSub, { o: A(t, T.diff + .3, .4) });
      set(rail, { o: A(t, s0 + .3, .4) });
      st.forEach(o => {
        enter(o.c, t, s0 + .25 + o.i * .09, { dy: 70, rx: 14 });
        const on = A(t, o.t - .05, .35, E.quart);
        o.tint.style.opacity = on; o.ring.style.opacity = on * (o.i === 4 && t > T.verbs[4] + .4 ? .6 + .4 * Math.sin(t * 5) : 1);
        o.vb.style.color = on > .5 ? BOTS[o.k].c : '#c4c7d2'; o.nm.style.opacity = .3 + .7 * on;
        set(o.vb, { s: 1 + .08 * Math.exp(-6 * Math.max(0, t - o.t)) * (t > o.t ? 1 : 0) });
        o.b.update(t, { lookX: on > .5 ? .7 : -.3, bob: on > .5 ? 3 : 1.2 });
        set(o.b.el, { y: -14 * on * (1 - A(t, o.t + .5, .5)) });
        o.node.style.boxShadow = `inset 0 0 0 4px ${on > .5 ? BOTS[o.k].c : '#d6d9e3'}`; o.node.style.background = on > .5 ? BOTS[o.k].c : '#fff';
        set(o.node, { s: 1 + .4 * Math.exp(-6 * Math.max(0, t - o.t)) * (t > o.t ? 1 : 0), o: A(t, s0 + .4, .3) });
      });
      // packet travels station to station on each verb
      let px = 112 + 160 - 27; for (let i = 0; i < 5; i++) px = lerp(px, 112 + i * 344 + 160 - 27, E.io(P(t, T.verbs[i] - .45, T.verbs[i] - .02)));
      const shipK = A(t, T.verbs[4] + .2, .6, E.io); px += 160 * shipK;
      set(pkt, { x: px, o: A(t, T.verbs[0] - .5, .3) * (1 - shipK) });
      railF.style.width = (cl((px - 270 + 27) / 1400) * 100).toFixed(1) + '%';
    }
  };
};
