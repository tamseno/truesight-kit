// e01 — cold open: bed → wake to a finished, reviewed 60fps film · no AE / no timeline · five bots on one cloud computer · title lockup
(SCENES.e01 = (root, ctx, H) => {
  const { put, h, set, enter, A, SP, E, P, lerp, cl, bot, grok, BOTS, BOT_ORDER, IC, win, rnd, strike } = H;
  const T = {
    bed: ctx.at('bed'), idea: ctx.at('idea'), wake: ctx.at('wake'), fin: ctx.at('finished'), rev: ctx.at('reviewed'), fps: ctx.at('sixty'), mg: ctx.at('motion graphic'),
    noAE: ctx.at('No After'), noTL: ctx.at('No timeline'), five: ctx.at('Five bots'), cloud: ctx.at('cloud computer'), night: ctx.at('night shift'), work: ctx.at('working'),
    build: ctx.at('build that studio'), grok: ctx.at('Grok Bot'), opus: ctx.at('Claude Opus'), parts: ctx.at('parts most'), skip: ctx.at('skip'),
  };
  const css = (el, s) => { el.style.cssText += s; return el; };
  const pad = n => String(n).padStart(2, '0');
  const OPUS = s => `<svg viewBox="0 0 40 40" width="${s}" height="${s}">${[...Array(8)].map((_, i) => `<rect x="17.6" y="2" width="4.8" height="16" rx="2.4" fill="#d9643a" transform="rotate(${i * 45} 20 20)"/>`).join('')}<circle cx="20" cy="20" r="5" fill="#d9643a"/></svg>`;

  // =============================================================== ACT 1 — bed → finished film
  const A1 = put(root, h('div', ''), 0, 0, 1920, 1080);
  // ---- left: the bedroom sky card
  const L = put(A1, H.card({ w: 790, h: 640 }), 110, 170);
  const skyN = put(L, h('div', ''), 0, 0, 790, 640); css(skyN, 'background:radial-gradient(120% 100% at 80% 0%,#2c3672,#141a3c 72%)');
  const skyD = put(L, h('div', ''), 0, 0, 790, 640); css(skyD, 'background:radial-gradient(120% 100% at 85% 10%,#fff6e4,#ffe1cf 55%,#fbd2c4)');
  const stars = [...Array(30)].map((_, i) => { const z = 2 + rnd(i + 5) * 3; return css(put(L, h('div', ''), 30 + rnd(i + 3) * 730, 130 + rnd(i + 11) * 260, z, z), 'border-radius:50%;background:#fff;box-shadow:0 0 6px #fff'); });
  const moon = put(L, h('div', '', IC.moon()), 650, 38, 96, 96);
  const sun = put(L, h('div', '', IC.sun()), 640, 30, 120, 120);
  const clock = put(L, h('div', '', `<svg viewBox="0 0 100 100" width="118" height="118"><circle cx="50" cy="50" r="46" fill="#fff" stroke="#e3e5ec" stroke-width="3"/>${[...Array(12)].map((_, i) => `<rect x="49" y="9" width="2" height="${i % 3 ? 5 : 9}" rx="1" fill="#9aa0b4" transform="rotate(${i * 30} 50 50)"/>`).join('')}<rect class="hh" x="47.5" y="27" width="5" height="26" rx="2.5" fill="#15161c"/><rect class="mm" x="48.5" y="15" width="3" height="38" rx="1.5" fill="#15161c"/><circle cx="50" cy="50" r="4.5" fill="#f0443a"/></svg>`), 40, 36, 118, 118);
  clock.style.filter = 'drop-shadow(0 10px 16px rgba(10,14,40,.28))';
  const hh = clock.querySelector('.hh'), mm = clock.querySelector('.mm');
  const clLab = put(L, h('div', '', ''), 184, 44); css(clLab, 'font:700 20px Geist;letter-spacing:.14em;text-transform:uppercase;white-space:nowrap');
  const clTxt = put(L, h('div', 'mono', '21:00'), 182, 72); css(clTxt, 'font:700 64px Maple;letter-spacing:.01em;white-space:nowrap');
  const bed = put(L, h('div', '', `<svg viewBox="0 0 640 260" width="640" height="260">
    <ellipse cx="330" cy="246" rx="300" ry="12" fill="rgba(0,0,0,.18)"/>
    <rect x="34" y="40" width="46" height="206" rx="16" fill="#cdb79a"/><rect x="560" y="120" width="40" height="126" rx="14" fill="#cdb79a"/>
    <rect x="70" y="150" width="510" height="64" rx="16" fill="#efe6d8"/>
    <rect x="96" y="104" width="150" height="58" rx="26" fill="#ffffff"/>
    <circle class="head" cx="186" cy="112" r="40" fill="#f3c7a6"/><path d="M146 104 Q160 66 196 72 Q226 78 224 106 Q206 90 182 92 Q160 94 146 104Z" fill="#3b2f2a"/>
    <path class="e1" d="M172 120 q6 5 12 0" stroke="#3b2f2a" stroke-width="3.5" fill="none" stroke-linecap="round"/><path class="e2" d="M196 120 q6 5 12 0" stroke="#3b2f2a" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    <path d="M220 136 Q236 104 300 106 L560 112 Q586 114 584 150 L582 196 Q580 214 556 214 L236 214 Q214 214 216 190Z" fill="#7d93ff"/>
    <path d="M300 106 Q380 98 440 116 Q500 132 560 112" stroke="rgba(255,255,255,.35)" stroke-width="4" fill="none"/>
    <path d="M236 170 L578 170" stroke="rgba(255,255,255,.22)" stroke-width="3"/></svg>`), 70, 360, 640, 260);
  const eyesC = [bed.querySelector('.e1'), bed.querySelector('.e2')];
  const zz = [0, 1, 2].map(i => css(put(L, h('div', '', 'z'), 250, 410, 40, 40), `font:800 ${28 + i * 8}px Geist;color:#cfd6ff`));
  const note = put(L, h('div', '', `<div style="display:flex;align-items:center;gap:10px;font:700 18px Geist;letter-spacing:.12em;color:#9a7a1e;text-transform:uppercase"><svg viewBox="0 0 24 24" width="26" height="26"><path d="M12 2.5a6.5 6.5 0 0 0-3.8 11.8c.6.5.8 1.1.8 1.8V17h6v-.9c0-.7.3-1.3.8-1.8A6.5 6.5 0 0 0 12 2.5z" fill="#f5a524"/><rect x="9" y="18.4" width="6" height="2.2" rx="1.1" fill="#c98a12"/></svg>The idea</div><div style="font:800 30px/1.2 Geist;color:#15161c;margin-top:10px">A 15-second<br>launch film</div>`), 420, 196, 300, 150);
  css(note, 'padding:20px 24px;border-radius:16px;background:#fff3c4;box-shadow:0 18px 30px -14px rgba(0,0,0,.45);transform-origin:20% 0');

  // ---- right: the film card
  const R = put(A1, win({ title: 'launch_film.mp4', tag: '1920×1080 · 60 fps', w: 880, h: 640 }), 930, 170);
  const pv = put(R.body, h('div', ''), 0, 0, 836, 470); css(pv, 'border-radius:18px;overflow:hidden;background:linear-gradient(150deg,#ffe9df,#ffd3c3 60%,#ffc2b4)');
  const g1 = css(put(pv, h('div', ''), 0, 0, 520, 520), 'border-radius:50%;background:radial-gradient(closest-side,rgba(255,255,255,.7),rgba(255,255,255,0))');
  const uiC = put(pv, h('div', ''), 250, 112, 336, 220); css(uiC, 'border-radius:22px;background:#fff;box-shadow:0 30px 50px -20px rgba(150,50,30,.45)');
  const uiDot = css(put(uiC, h('div', ''), 26, 26, 54, 54), 'border-radius:16px;background:#f0603a');
  const uiB = [0, 1, 2].map(i => css(put(uiC, h('div', ''), 96, 32 + i * 0, 0, 14), 'border-radius:7px;background:#15161c'));
  uiB[1].style.top = '58px'; uiB[1].style.background = '#e7e8ee'; uiB[2].style.top = '0px'; uiB[2].style.display = 'none';
  const uiBars = [0, 1, 2, 3].map(i => css(put(uiC, h('div', ''), 26 + i * 76, 170, 58, 0), `border-radius:8px 8px 3px 3px;background:${['#ffb08f', '#f0603a', '#ff8a5c', '#ffd2bf'][i]}`));
  const orb = css(put(pv, h('div', ''), 0, 0, 64, 64), 'border-radius:50%;background:#fff;box-shadow:0 12px 24px -8px rgba(150,50,30,.5)');
  const ring = css(put(pv, h('div', ''), 0, 0, 120, 120), 'border-radius:50%;border:6px solid rgba(240,96,58,.55)');
  const ptrack = css(put(pv, h('div', ''), 28, 436, 780, 8), 'border-radius:4px;background:rgba(255,255,255,.6);overflow:hidden');
  const pfill = ptrack.appendChild(h('div', '')); pfill.style.cssText = 'height:100%;background:#f0603a;border-radius:4px';
  const tcode = css(put(pv, h('div', 'mono', '0:00'), 28, 394), 'font:700 22px Maple;color:#b4472a');
  // rendering overlay (overnight)
  const ov = put(pv, h('div', ''), 0, 0, 836, 470); css(ov, 'background:radial-gradient(120% 100% at 50% 0%,#232a5a,#12162e 75%)');
  const ovSpin = css(put(ov, h('div', ''), 60, 64, 34, 34), 'border-radius:50%;border:4px solid rgba(255,255,255,.18);border-top-color:#fff');
  css(put(ov, h('div', '', 'Rendering overnight'), 112, 62), 'font:700 30px Geist;color:#fff;white-space:nowrap');
  const ovFr = css(put(ov, h('div', 'mono', ''), 60, 140), 'font:700 46px Maple;color:#ffd66b;white-space:nowrap');
  css(put(ov, h('div', '', 'frames written to disk'), 60, 204), 'font:500 22px Geist;color:#8d93ab');
  const ovTr = css(put(ov, h('div', ''), 60, 270, 716, 14), 'border-radius:7px;background:#2a2f4a;overflow:hidden');
  const ovTf = ovTr.appendChild(h('div', '')); ovTf.style.cssText = 'height:100%;border-radius:7px;background:linear-gradient(90deg,#5a7cff,#9db1ff)';
  const ovThumbs = [...Array(10)].map((_, i) => css(put(ov, h('div', ''), 60 + i * 72, 318, 62, 40), 'border-radius:7px;border:1px solid #2c3150;background:#1a1f3a'));
  // chips row
  const chipRow = put(R.body, h('div', ''), 0, 496, 836, 60); css(chipRow, 'display:flex;gap:14px;align-items:center');
  const mkChip = (txt, c, ic) => { const e = chipRow.appendChild(h('div', '', `${ic ? `<span style="width:26px;height:26px;display:inline-block">${ic}</span>` : ''}<span>${txt}</span>`)); e.style.cssText = `display:inline-flex;align-items:center;gap:10px;height:52px;padding:0 20px 0 ${ic ? 14 : 20}px;border-radius:999px;font:700 23px Geist;white-space:nowrap;background:color-mix(in srgb,${c} 12%,#fff);color:${c};box-shadow:inset 0 0 0 1.5px color-mix(in srgb,${c} 30%,transparent)`; return e; };
  const cFin = mkChip('Finished', '#1fbf75', IC.check()), cRev = mkChip('Reviewed by Critic', '#8b5cf6', IC.check('#8b5cf6')), cFps = mkChip('60 fps', '#3a6cf4'), cHd = mkChip('1080p', '#6b6e7b');
  cFps.style.font = cHd.style.font = '700 23px Maple';
  const stamp = put(R, h('div', '', `<div style="font:900 74px/1 Geist;letter-spacing:.08em">PASSED</div><div style="font:700 22px Maple;letter-spacing:.12em;margin-top:8px;text-align:center">60 FPS · CRITIC ✓</div>`), 300, 190);
  css(stamp, 'padding:16px 26px 14px;border:6px solid #1fbf75;border-radius:16px;color:#1fbf75;background:rgba(255,255,255,.86);box-shadow:0 20px 40px -16px rgba(20,120,70,.5);z-index:4');

  // =============================================================== ACT 2 — no After Effects, no timeline
  const A2 = put(root, h('div', ''), 0, 0, 1920, 1080);
  const ae = put(A2, win({ title: 'After Effects', dark: true, w: 700, h: 520 }), 170, 230);
  const aeTile = put(ae.body, h('div', '', 'Ae'), 40, 40, 150, 150); css(aeTile, 'border-radius:34px;background:#00005b;box-shadow:inset 0 0 0 4px #9999ff,0 18px 30px -12px rgba(0,0,60,.8);display:flex;align-items:center;justify-content:center;font:800 76px Geist;color:#9999ff;letter-spacing:-.02em');
  const aeName = put(ae.body, h('div', 'strike', 'After Effects'), 230, 62); css(aeName, 'font:800 52px Geist;color:#fff;white-space:nowrap;letter-spacing:-.02em');
  css(put(ae.body, h('div', '', 'the usual motion design tool'), 232, 134), 'font:500 23px Geist;color:#8d93ab;white-space:nowrap');
  const aeRows = ['Composition', 'Render queue', 'Keyframes', 'Plug-ins'].map((s, i) => { const e = put(ae.body, h('div', '', `<span style="width:12px;height:12px;border-radius:4px;background:#3a3f5c;display:inline-block"></span>${s}`), 40 + (i % 2) * 300, 236 + Math.floor(i / 2) * 76, 280, 60); css(e, 'display:flex;align-items:center;gap:14px;padding:0 20px;border-radius:14px;background:#20222d;font:600 23px Geist;color:#b9bdd0'); return e; });
  const aeX = css(put(A2, h('div', '', IC.x()), 170 + 700 - 52, 230 - 28, 80, 80), 'z-index:3;filter:drop-shadow(0 10px 16px rgba(240,68,58,.45))');
  const tl = put(A2, win({ title: 'Timeline', tag: '00:00:04:12', w: 800, h: 520 }), 950, 230);
  const layers = [['Logo', '#3a6cf4', 30, 300, [40, 210]], ['Title', '#8b5cf6', 120, 520, [130, 300, 470]], ['Card', '#f5a524', 60, 420, [70, 250, 400]], ['Background', '#2fc7a4', 0, 600, [10, 590]]];
  const ruler = put(tl.body, h('div', ''), 170, 0, 590, 30); ruler.innerHTML = [...Array(7)].map((_, i) => `<span style="position:absolute;left:${i * 96}px;top:0;font:500 16px Maple;color:#9aa0b4">${i}s</span>`).join('');
  layers.forEach(([n, c, a, b, ks], i) => {
    const y = 48 + i * 88;
    css(put(tl.body, h('div', '', n), 0, y + 16, 160), 'font:700 22px Geist;color:#3c3f4c');
    css(put(tl.body, h('div', ''), 170, y, 590, 64), 'border-radius:12px;background:#f3f4f8');
    css(put(tl.body, h('div', ''), 170 + a, y + 10, b - a, 44), `border-radius:9px;background:color-mix(in srgb,${c} 22%,#fff);box-shadow:inset 0 0 0 2px color-mix(in srgb,${c} 55%,transparent)`);
    ks.forEach(k => css(put(tl.body, h('div', ''), 170 + k - 9, y + 23, 18, 18), `transform:rotate(45deg);border-radius:3px;background:${c}`));
  });
  const ph = css(put(tl.body, h('div', ''), 170, 34, 3, 360), 'background:#f0443a;border-radius:2px');
  const tlStrike = put(tl.body, h('div', 'strike', ''), 0, 200, 760, 10);
  const tlX = css(put(A2, h('div', '', IC.x()), 950 + 800 - 52, 230 - 28, 80, 80), 'z-index:3;filter:drop-shadow(0 10px 16px rgba(240,68,58,.45))');
  const aeVeil = css(put(ae, h('div', ''), 0, 0, 700, 520), 'background:rgba(22,23,31,.5)');
  const tlVeil = css(put(tl, h('div', ''), 0, 0, 800, 520), 'background:rgba(240,240,244,.55)');

  // =============================================================== ACT 3 — five bots on one cloud computer, night shift
  const A3 = put(root, h('div', ''), 0, 0, 1920, 1080);
  const sky = put(A3, h('div', ''), 110, 150, 1700, 760); css(sky, 'border-radius:34px;background:radial-gradient(110% 100% at 80% 0%,#2c3672,#141a3c 70%);box-shadow:0 40px 80px -30px rgba(10,14,40,.55)');
  const sStars = [...Array(40)].map((_, i) => { const z = 2 + rnd(i + 51) * 3; return css(put(sky, h('div', ''), 40 + rnd(i + 53) * 1620, 30 + rnd(i + 57) * 260, z, z), 'border-radius:50%;background:#fff;box-shadow:0 0 6px #fff'); });
  const sMoon = put(sky, h('div', '', IC.moon()), 1560, 44, 90, 90);
  const sLab = put(sky, h('div', '', `<span class="mono" style="color:#ffd66b">21:00 → 07:00</span><span style="color:rgba(255,255,255,.45)">·</span><span>the night shift</span>`), 56, 48); css(sLab, 'display:flex;gap:16px;font:700 28px Geist;color:#fff;white-space:nowrap');
  const pc = put(A3, h('div', ''), 300, 548, 1320, 300); css(pc, 'border-radius:28px;background:linear-gradient(180deg,#ffffff,#f1f2f7);box-shadow:0 0 0 1px rgba(21,22,28,.06),0 36px 70px -24px rgba(10,14,40,.5)');
  const pcTop = put(pc, h('div', '', `<svg viewBox="0 0 40 28" width="46" height="32"><path d="M11 26a9 9 0 0 1-1.2-17.9A11 11 0 0 1 31 8.5 8.8 8.8 0 0 1 30 26z" fill="#3a6cf4"/></svg><span style="font:800 30px Geist">One cloud computer</span><span class="mono" style="margin-left:auto;font:600 20px Maple;color:#6b6e7b">shared by every bot · always on</span><span class="dot" style="width:12px;height:12px;border-radius:50%;background:#1fbf75;display:inline-block"></span>`), 36, 26, 1248); css(pcTop, 'display:flex;align-items:center;gap:16px;white-space:nowrap');
  const pcDot = pcTop.querySelector('.dot');
  const jobs = ['Plans shots', 'Writes code', 'Renders frames', 'Grades', 'Ships'];
  const screens = BOT_ORDER.map((k, i) => {
    const s = put(pc, h('div', ''), 36 + i * 252, 96, 228, 170); css(s, 'border-radius:18px;background:#16171f;overflow:hidden');
    css(put(s, h('div', '', BOTS[k].name), 20, 18), `font:800 24px Geist;color:${BOTS[k].c};white-space:nowrap`);
    const jl = css(put(s, h('div', '', jobs[i]), 20, 54), 'font:500 20px Geist;color:#9aa0b4;white-space:nowrap');
    const lines = [0, 1, 2].map(j => css(put(s, h('div', ''), 20, 92 + j * 16, 0, 7), `border-radius:4px;background:${j === 0 ? BOTS[k].c : '#2e3140'}`));
    const tr = css(put(s, h('div', ''), 20, 144, 188, 8), 'border-radius:4px;background:#2a2c38;overflow:hidden');
    const tf = tr.appendChild(h('div', '')); tf.style.cssText = `height:100%;border-radius:4px;background:${BOTS[k].c}`;
    return { s, lines, tf, jl };
  });
  // bots (shared by acts 3 & 4)
  const BS = 150, bots = BOT_ORDER.map((k, i) => { const b = bot(k, BS); const el = put(root, b.el, 300 + 36 + i * 252 + 114 - BS / 2, 548 - BS + 8); el.style.transformOrigin = '50% 100%'; return { b, el, i, k, x0: 300 + 36 + i * 252 + 114 - BS / 2, y0: 548 - BS + 8 }; });

  // =============================================================== ACT 4 — title lockup
  const A4 = put(root, h('div', ''), 0, 0, 1920, 1080);
  const lock = put(A4, h('div', ''), 112, 168, 1300, 84); css(lock, 'display:flex;align-items:center;gap:22px;white-space:nowrap');
  const lkG = lock.appendChild(h('div', '')); lkG.style.cssText = 'display:flex;align-items:center;gap:16px;font:800 46px Geist;letter-spacing:-.02em'; const gl = grok(72); gl.style.position = 'relative'; lkG.appendChild(gl); lkG.appendChild(h('span', '', 'Grok Bot'));
  const lkX = lock.appendChild(h('div', '', '×')); lkX.style.cssText = 'font:500 46px Geist;color:#b4b7c3;margin:0 6px';
  const lkO = lock.appendChild(h('div', '', `<span style="display:inline-flex;width:72px;height:72px;border-radius:50%;background:#fbe9e1;align-items:center;justify-content:center">${OPUS(44)}</span><span>Claude Opus 5.5</span>`)); lkO.style.cssText = 'display:flex;align-items:center;gap:16px;font:800 46px Geist;letter-spacing:-.02em';
  const ttl = put(A4, h('div', ''), 104, 290); css(ttl, 'font:800 132px/1.04 Geist;letter-spacing:-.045em;white-space:nowrap');
  const tLines = [['An ', 'overnight'], ['motion design studio']];
  ttl.innerHTML = tLines.map((ln, li) => `<div style="position:relative">${ln.map((seg, si) => `<span class="${li === 0 && si === 1 ? 'hl' : ''}" style="position:relative;display:inline-block">${[...seg].map(c => `<span class="c" style="display:inline-block">${c === ' ' ? '&nbsp;' : c}</span>`).join('')}</span>`).join('')}</div>`).join('');
  const tc = [...ttl.querySelectorAll('.c')];
  const hl = ttl.querySelector('.hl'); const mark = hl.insertBefore(h('div', ''), hl.firstChild); mark.style.cssText = 'position:absolute;left:-8px;right:-8px;bottom:14px;height:40px;border-radius:10px;background:#ffd66b;transform-origin:left;z-index:-1';
  hl.style.zIndex = 0; hl.style.isolation = 'isolate';
  const crew = put(A4, h('div', '', `<span class="mono" style="color:#6b6e7b">five bots · one cloud computer · 21:00 → 07:00</span>`), 790, 676); css(crew, 'font:600 24px Maple;white-space:nowrap');
  const crewLine = css(put(A4, h('div', ''), 112, 740, 640, 3), 'border-radius:2px;background:rgba(21,22,28,.1)');
  const skipLab = put(A4, h('div', '', '+ the parts most tutorials skip'), 112, 790); css(skipLab, 'font:700 26px Geist;color:#6b6e7b;white-space:nowrap');
  const skipRow = put(A4, h('div', ''), 520, 780, 1300, 50); css(skipRow, 'display:flex;gap:14px');
  const skipChips = ['usage limits', 'sleep & restarts', 'resumable renders', 'routines', 'gates & critics'].map((s, i) => { const e = skipRow.appendChild(h('div', '', s)); e.style.cssText = 'display:flex;align-items:center;height:50px;padding:0 22px;border-radius:999px;background:#fff;box-shadow:0 0 0 1px rgba(21,22,28,.08),0 10px 22px -12px rgba(30,34,70,.35);font:700 22px Geist;white-space:nowrap'; return e; });

  // ---------------------------------------------------------------- cues
  ctx.cue(.15, 'swoosh', .5); ctx.cue(T.idea, 'pop', .5); ctx.cue(T.wake - .05, 'whoosh', .6); ctx.cue(T.fin + .05, 'ding', .55); ctx.cue(T.rev + .2, 'pop', .8); ctx.cue(T.fps, 'tick', .5);
  ctx.cue(T.noAE - .25, 'whoosh', .5); ctx.cue(T.noAE + .3, 'error', .6); ctx.cue(T.noTL + .3, 'error', .6);
  BOT_ORDER.forEach((_, i) => ctx.cue(T.five + i * .1, 'pop', .4)); ctx.cue(T.cloud, 'swoosh', .5); ctx.cue(T.build - .2, 'whoosh', .6); ctx.cue(T.grok, 'pop', .5); ctx.cue(T.opus, 'pop', .5); ctx.cue(T.parts, 'tick', .5);

  const out1 = T.noAE - .3, out2 = T.five - .35, out3 = T.build - .25;
  const actFade = (el, t, a, b) => { const ki = A(t, a, .5, E.quart), ko = A(t, b, .4, E.in); set(el, { o: ki * (1 - ko), y: -30 * ko, s: 1 - .03 * ko, b: 8 * ko }); return ko; };
  return (t) => {
    // ============ act 1
    const k1o = A(t, out1, .4, E.in); set(A1, { o: 1 - k1o, y: -30 * k1o, s: 1 - .03 * k1o, b: 8 * k1o });
    if (k1o < 1) {
      enter(L, t, .05, { dy: 60, rx: 12 }); enter(R, t, .3, { dy: 60, rx: 12 });
      const dk = A(t, T.wake - .05, 1.0, E.io); // night → day
      skyD.style.opacity = dk; stars.forEach((s, i) => s.style.opacity = ((1 - dk) * (.35 + .65 * Math.abs(Math.sin(t * (1 + rnd(i) * 2) + i)))).toFixed(2));
      set(moon, { y: 60 * dk + Math.sin(t) * 3, r: Math.sin(t * .8) * 6, o: 1 - dk });
      set(sun, { y: 140 * (1 - E.out(dk)), r: t * 12, o: dk });
      const mins = 21 * 60 + 2 * t + 600 * E.io(P(t, T.wake - .05, T.fin + .1));
      hh.setAttribute('transform', `rotate(${((mins / 720) * 360) % 360} 50 50)`); mm.setAttribute('transform', `rotate(${(mins % 60) * 6} 50 50)`);
      clTxt.textContent = `${pad(Math.floor(mins / 60) % 24)}:${pad(Math.floor(mins % 60))}`;
      clTxt.style.color = dk > .5 ? '#15161c' : '#ffffff'; clLab.style.color = dk > .5 ? '#b4472a' : '#ffd66b';
      clLab.textContent = dk > .5 ? 'Good morning' : 'Lights out';
      const eo = A(t, T.fin, .25); eyesC.forEach(e => e.setAttribute('d', e.getAttribute('d').replace(/q6 -?\d+ 12 0/, eo > .5 ? 'q6 -5 12 0' : 'q6 5 12 0')));
      zz.forEach((z, i) => { const ph = ((t * .55 + i * .33) % 1); set(z, { x: 30 * ph + i * 6, y: -110 * ph, o: (1 - dk) * Math.sin(ph * Math.PI) * A(t, .6, .5) }); });
      const nk = SP(t, T.idea - .1, .8); set(note, { s: lerp(.6, 1, nk), r: lerp(-14, 4, nk) + Math.sin(t * 1.3) * .8, y: 20 * (1 - nk), o: A(t, T.idea - .1, .2) });
      // film: overnight render, then plays
      const rk = cl(.04 + .06 * P(t, .3, T.wake) + .9 * E.io(P(t, T.wake, T.fin)));
      ovTf.style.width = (rk * 100).toFixed(1) + '%'; ovFr.textContent = `${String(Math.floor(rk * 900)).padStart(3, '0')} / 900`;
      ovThumbs.forEach((e, i) => e.style.background = rk * 10 > i + .5 ? '#3a4a8a' : '#1a1f3a'); set(ovSpin, { r: t * 420 });
      const fk = A(t, T.fin - .05, .5, E.io); ov.style.opacity = 1 - fk;
      const lt = Math.max(0, t - T.fin) * .22, lp = lt % 1;
      pfill.style.width = (lp * 100).toFixed(1) + '%'; tcode.textContent = `0:${pad(Math.floor(lp * 15))}`;
      const m = (Math.sin(t * 2.2) + 1) / 2;
      set(g1, { x: 160 + Math.cos(t * .7) * 120, y: -120 + Math.sin(t * .9) * 60 });
      set(uiC, { y: Math.sin(t * 1.6) * 8, r: Math.sin(t * 1.1) * 2.5, rx: Math.sin(t * 1.3) * 6, ry: Math.cos(t * 1.1) * 8 });
      uiDot.style.borderRadius = lerp(50, 22, m) + '%'; set(uiDot, { r: t * 60 });
      uiB[0].style.width = (90 + 110 * E.io((Math.sin(t * 1.8) + 1) / 2)) + 'px'; uiB[1].style.width = (60 + 90 * E.io((Math.sin(t * 1.8 + 1.4) + 1) / 2)) + 'px';
      uiBars.forEach((b, i) => { const v = 30 + 50 * (Math.sin(t * 2.4 + i * 1.3) + 1) / 2; b.style.height = v.toFixed(1) + 'px'; b.style.top = (196 - v).toFixed(1) + 'px'; });
      set(orb, { x: 418 + Math.cos(t * 1.7) * 330 - 32, y: 220 + Math.sin(t * 1.7) * 140 - 32, s: .8 + .3 * m });
      set(ring, { x: 120 - 60, y: 110 - 60, s: .6 + .5 * ((t * .8) % 1), o: (1 - ((t * .8) % 1)) * .9 });
      [[cFin, T.fin + .1], [cRev, T.rev], [cFps, T.fps], [cHd, T.fps + .25]].forEach(([c, s]) => { const k = SP(t, s, .7); set(c, { y: 18 * (1 - k), s: lerp(.8, 1, k), o: A(t, s, .2) }); });
      const sk = A(t, T.rev + .15, .28, E.quart); set(stamp, { s: lerp(1.9, 1, sk) * (1 + .03 * Math.exp(-8 * Math.max(0, t - T.rev - .43)) * (t > T.rev + .43 ? 1 : 0)), r: lerp(-22, -11, sk), o: sk, b: 4 * (1 - sk) });
      if (t > T.rev + .43) { const d = t - T.rev - .43, sh = Math.exp(-9 * d) * Math.sin(d * 50) * 5; set(R, { x: sh * .6, y: sh * .4 }); }
    }
    // ============ act 2
    const k2o = actFade(A2, t, out1 + .1, out2);
    if (A(t, out1 + .1, .1) > 0 && k2o < 1) {
      enter(ae, t, out1 + .15, { dy: 60, rx: 14 }); enter(tl, t, out1 + .3, { dy: 60, rx: 14 });
      const a1 = A(t, T.noAE + .25, .45, E.io), a2 = A(t, T.noTL + .25, .45, E.io);
      strike(aeName, a1); strike(tlStrike, a2);
      aeVeil.style.opacity = a1; tlVeil.style.opacity = a2;
      ae.style.filter = a1 > 0 ? `grayscale(${a1.toFixed(2)})` : 'none';
      const sh1 = t > T.noAE + .3 ? Math.exp(-7 * (t - T.noAE - .3)) * Math.sin((t - T.noAE) * 42) * 7 : 0, sh2 = t > T.noTL + .3 ? Math.exp(-7 * (t - T.noTL - .3)) * Math.sin((t - T.noTL) * 42) * 7 : 0;
      if (t > out1 + 1.4) { set(ae, { x: sh1, r: -1.5 * a1, y: 8 * a1 }); set(tl, { x: sh2, r: 1.5 * a2, y: 8 * a2 }); }
      [[aeX, T.noAE + .35], [tlX, T.noTL + .35]].forEach(([x, s]) => { const k = SP(t, s, .6); set(x, { s: lerp(.2, 1, k), r: -90 * (1 - k), o: A(t, s, .15) }); });
      ph.style.left = (170 + ((t * 120) % 590) * (1 - a2) + 300 * a2).toFixed(1) + 'px';
      aeRows.forEach((r, i) => set(r, { o: A(t, out1 + .5 + i * .08, .3) }));
    }
    // ============ act 3
    const k3o = A(t, out3, .5, E.in);
    const sk3 = A(t, out2 + .05, .6, E.quart);
    set(sky, { o: A(t, T.night - .4, .8, E.io) * (1 - k3o), s: lerp(.97, 1, A(t, T.night - .4, 1)) });
    sStars.forEach((s, i) => s.style.opacity = (.35 + .65 * Math.abs(Math.sin(t * (1 + rnd(i) * 2) + i))).toFixed(2));
    set(sMoon, { r: Math.sin(t) * 5, y: 20 * (1 - A(t, T.night, .8)) }); set(sLab, { x: -16 * (1 - A(t, T.night, .6)), o: A(t, T.night, .5) });
    if (t > out2 - .2 && k3o < 1) {
      const pk = SP(t, T.cloud - .2, 1); set(pc, { y: 90 * (1 - pk) + 30 * k3o, rx: 14 * (1 - pk), o: A(t, T.cloud - .2, .3) * (1 - k3o), b: 6 * k3o });
      pcDot.style.opacity = .5 + .5 * Math.abs(Math.sin(t * 3));
      screens.forEach((o, i) => {
        const w = P(t, T.work + i * .12, T.work + 1.6 + i * .2);
        o.tf.style.width = (cl(w * (.4 + .12 * i) + .06 * Math.sin(t * 2 + i) * w) * 100).toFixed(1) + '%';
        o.lines.forEach((l, j) => l.style.width = (w > 0 ? (40 + 120 * rnd(i * 7 + j + Math.floor(t * 3))) * cl(w * 3 - j) : 0).toFixed(1) + 'px');
      });
    } else set(pc, { o: 0 });
    // ============ bots (act 3 → act 4)
    const mv = E.io(P(t, out3, out3 + 1.0));
    bots.forEach(({ b, el, i, x0, y0 }) => {
      const s = T.five - .05 + i * .1, k = SP(t, s, .9);
      const xA = 0, yA = -160 * (1 - k);
      const x1 = 120 + i * 122 - x0 + (BS * .62) / 2 - BS / 2, y1 = 640 + 96 - (y0 + BS);
      const sc = lerp(1, .62, mv);
      set(el, { x: lerp(xA, x1, mv), y: lerp(yA, y1, mv), s: lerp(.6, 1, k) * sc, o: A(t, s, .15) });
      b.update(t, { lookX: mv > .5 ? .6 : Math.sin(t * .8 + i) * .5, lookY: mv > .5 ? -.3 : 0 });
    });
    // ============ act 4
    set(A4, { o: A(t, out3 + .2, .3) });
    if (t > out3) {
      const gk = SP(t, out3 + .35, .9); set(lkG, { x: -30 * (1 - gk), o: A(t, out3 + .35, .25) }); set(gl, { r: -60 * (1 - gk) });
      set(lkX, { o: A(t, T.opus - .4, .3) });
      const ok = SP(t, T.opus - .25, .9); set(lkO, { x: -30 * (1 - ok), o: A(t, T.opus - .25, .25) });
      tc.forEach((c, i) => { const s = out3 + .45 + i * .028, k = SP(t, s, .9); set(c, { y: 90 * (1 - k), o: A(t, s, .25), b: 8 * (1 - A(t, s, .3)) }); });
      mark.style.transform = `scaleX(${A(t, out3 + 1.2, .6, E.io).toFixed(3)})`;
      set(crew, { x: -14 * (1 - A(t, out3 + 1.3, .5)), o: A(t, out3 + 1.3, .4) });
      crewLine.style.transform = `scaleX(${A(t, out3 + .9, .7, E.io).toFixed(3)})`; crewLine.style.transformOrigin = 'left';
      set(skipLab, { x: -14 * (1 - A(t, T.parts - .1, .5)), o: A(t, T.parts - .1, .4) });
      skipChips.forEach((c, i) => { const s = T.parts + .25 + i * .16, k = SP(t, s, .8); set(c, { y: 22 * (1 - k) + Math.sin(t * 1.6 + i) * 2 * k, s: lerp(.85, 1, k), o: A(t, s, .2) }); });
    }
  };
}).noHeader = true;
