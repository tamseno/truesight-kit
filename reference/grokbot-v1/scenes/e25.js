// e25 — routine small print: time zone from Settings, a new routine waits for its next slot, Test is a real run, hourly check = 24 runs/day
SCENES.e25 = (root, ctx, H) => {
  const { put, h, set, enter, A, SP, E, P, lerp, cl, IC } = H;
  const D = (p, x, y, w, hh, css = '', html = '') => { const e = put(p, h('div', '', html), x, y, w, hh); if (css) e.style.cssText += ';' + css; return e; };
  const T = { few: ctx.at('few'), sched: ctx.at('Schedules'), zone: ctx.at('timezone'), settings: ctx.at('settings'), nw: ctx.at('Anewroutine'), waits: ctx.at('waits'), next: ctx.at('next'), slot: ctx.at('slot'), test: ctx.at('Test'), real: ctx.at('realwork'), every: ctx.at('everyrun'), spends: ctx.at('spends'), hourly: ctx.at('hourly'), costs: ctx.at('costs'), tf: ctx.at('twenty-four'), day: ctx.at('aday'), whether: ctx.at('whether'), not: ctx.at('ornot') };
  const CW = 556, CHt = 380, CY = 226, XS = [100, 684, 1268];
  const mkCard = (i, title, accent) => {
    const c = put(root, H.card({ w: CW, h: CHt }), XS[i], CY);
    const n = D(c, 28, 26, 40, 40, `border-radius:12px;background:${accent};color:#fff;font:800 21px Geist;display:flex;align-items:center;justify-content:center`, String(i + 1));
    D(c, 82, 28, 450, 36, 'font:800 26px Geist;letter-spacing:-.01em;white-space:nowrap;display:flex;align-items:center', title);
    D(c, 28, 84, CW - 56, 1, 'background:rgba(21,22,28,.08)');
    return { c, n };
  };
  // ---------- card 1: time zone
  const c1 = mkCard(0, 'Follows your time zone', '#33c9a6');
  D(c1.c, 30, 104, 300, 24, 'font:700 18px Geist;color:#8a8d99;letter-spacing:.06em', 'SETTINGS · TIME ZONE');
  const sel = D(c1.c, 28, 136, 500, 58, 'border-radius:14px;background:#f6f7f9;box-shadow:inset 0 0 0 1.5px #e3e5eb;display:flex;align-items:center;padding:0 18px;gap:12px');
  sel.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke="#6b6e7b" stroke-width="2"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" fill="none" stroke="#6b6e7b" stroke-width="1.6"/></svg>';
  const selV = sel.appendChild(h('span', '', '')); selV.style.cssText = 'font:700 23px Geist;color:#15161c;white-space:nowrap';
  const chev = sel.appendChild(h('span', '', '<svg width="20" height="20" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6" stroke="#6b6e7b" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>')); chev.style.cssText = 'margin-left:auto;display:flex';
  const rrow = D(c1.c, 28, 276, 500, 76, 'border-radius:16px;background:#fff;box-shadow:0 0 0 1px rgba(21,22,28,.07),0 10px 22px -14px rgba(30,34,70,.35);display:flex;align-items:center;gap:14px;padding:0 18px');
  rrow.innerHTML = '<span style="width:40px;height:40px;border-radius:12px;background:#33c9a6;display:flex;align-items:center;justify-content:center"><svg width="22" height="22" viewBox="0 0 24 24"><path d="M20 12a8 8 0 11-2.3-5.6M20 4v4.5h-4.5" stroke="#fff" stroke-width="2.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg></span><span style="display:flex;flex-direction:column"><b style="font:800 21px Geist">Director</b><span style="font:600 16px Geist;color:#8a8d99">Daily routine</span></span>';
  const tChip = rrow.appendChild(h('span', '', '')); tChip.style.cssText = 'margin-left:auto;height:44px;padding:0 16px;border-radius:12px;background:#15161c;color:#fff;font:800 22px Geist;display:flex;align-items:center;gap:8px;white-space:nowrap;font-variant-numeric:tabular-nums';
  const drop = D(c1.c, 28, 200, 500, 150, 'border-radius:14px;background:#fff;box-shadow:0 0 0 1px rgba(21,22,28,.08),0 24px 40px -14px rgba(30,34,70,.45);overflow:hidden;transform-origin:top');
  const OPTS = ['UTC', 'Eastern Time (ET)', 'Pacific Time (PT)'];
  const opts = OPTS.map((o, i) => D(drop, 0, i * 50, 500, 50, 'display:flex;align-items:center;padding:0 20px;font:700 20px Geist;color:#15161c', o));
  const cur1 = H.cursor(c1.c);
  // ---------- card 2: next slot
  const c2 = mkCard(1, 'Waits for its next slot', '#f5a524');
  const nrow = D(c2.c, 28, 104, 500, 72, 'border-radius:16px;background:#fff;box-shadow:0 0 0 1px rgba(21,22,28,.07),0 10px 22px -14px rgba(30,34,70,.35);display:flex;align-items:center;gap:14px;padding:0 18px');
  nrow.innerHTML = '<span style="height:30px;padding:0 10px;border-radius:8px;background:#ecebfe;color:#5a5cf0;font:800 15px Geist;display:flex;align-items:center;letter-spacing:.06em">NEW</span><b style="font:800 21px Geist">Render routine</b><span style="margin-left:auto;font:600 17px Maple;color:#8a8d99">created 15:40</span>';
  const TLX0 = 58, TLX1 = 470, TLY = 254;
  D(c2.c, TLX0, TLY - 2, TLX1 - TLX0, 4, 'border-radius:2px;background:#eef0f5');
  const dash = D(c2.c, TLX0, TLY - 2, TLX1 - TLX0, 4, 'background:repeating-linear-gradient(90deg,#f5a524 0 10px,transparent 10px 18px);transform-origin:left');
  const nowD = D(c2.c, TLX0 - 10, TLY - 10, 20, 20, 'border-radius:50%;background:#15161c;box-shadow:0 0 0 5px rgba(21,22,28,.12)');
  const nowL = D(c2.c, TLX0 - 40, TLY + 18, 120, 40, 'font:700 16px Geist;color:#6b6e7b;line-height:1.25', '<b style="font:800 19px Maple;color:#15161c">15:40</b><br>now');
  const slotD = D(c2.c, TLX1 - 16, TLY - 16, 32, 32, 'border-radius:10px;background:#f5a524;box-shadow:0 0 0 6px rgba(245,165,36,.2);display:flex;align-items:center;justify-content:center', '<svg width="18" height="18" viewBox="0 0 24 24"><path d="M8 5l11 7-11 7z" fill="#fff"/></svg>');
  const slotL = D(c2.c, TLX1 - 90, TLY + 22, 140, 40, 'font:700 16px Geist;color:#6b6e7b;text-align:right;line-height:1.25', '<b style="font:800 19px Maple;color:#15161c">21:00</b><br>first run');
  const ghost = D(c2.c, 150, TLY - 58, 170, 36, 'border-radius:999px;background:#fdeceb;color:#f0443a;font:800 16px Geist;display:flex;align-items:center;justify-content:center;gap:6px;white-space:nowrap', `<span style="width:18px;height:18px">${IC.x()}</span>Doesn't run now`);
  const wait = D(c2.c, 28, 318, 500, 40, 'display:flex;align-items:center;gap:10px;font:700 19px Geist;color:#6b6e7b;white-space:nowrap');
  const hg = wait.appendChild(h('span', '', '<svg width="26" height="26" viewBox="0 0 24 24"><path d="M6 3h12M6 21h12M7 3c0 5 10 5 10 9s-10 4-10 9M17 3c0 5-10 5-10 9s10 4 10 9" stroke="#c27a00" stroke-width="2" fill="none" stroke-linecap="round"/></svg>')); hg.style.cssText = 'display:flex';
  const waitT = wait.appendChild(h('span', '', '')); waitT.style.cssText = 'font-variant-numeric:tabular-nums';
  // ---------- card 3: test is real
  const c3 = mkCard(2, 'Test is a real run', '#5a5cf0');
  const btn = D(c3.c, 28, 104, 156, 56, 'border-radius:14px;background:#15161c;color:#fff;font:800 22px Geist;display:flex;align-items:center;justify-content:center;gap:10px', '<svg width="18" height="18" viewBox="0 0 24 24"><path d="M7 4l13 8-13 8z" fill="#fff"/></svg>Test');
  D(c3.c, 200, 112, 330, 40, 'font:600 18px Geist;color:#8a8d99;display:flex;align-items:center;white-space:nowrap', 'Render · nightly queue');
  const term = D(c3.c, 28, 178, 500, 118, 'border-radius:14px;background:#16171f;padding:14px 18px');
  const tl1 = D(term, 18, 12, 470, 28, 'font:500 18px Maple;color:#d8dbe7;white-space:nowrap', '<span style="color:#7ee0b8">›</span> rendering frames/ …');
  const ptr = D(term, 18, 52, 340, 12, 'border-radius:6px;background:#2a2c38;overflow:hidden'); const pf = D(ptr, 0, 0, 0, 12, 'border-radius:6px;background:#5ee39b');
  const pv = D(term, 368, 42, 116, 30, 'font:700 18px Maple;color:#d8dbe7;text-align:right;font-variant-numeric:tabular-nums');
  const tl2 = D(term, 18, 80, 470, 28, 'font:500 18px Maple;color:#ffd66b;white-space:nowrap', '<span style="color:#7ee0b8">›</span> real ffmpeg, real minutes');
  const chips = D(c3.c, 28, 314, 500, 44, 'display:flex;gap:12px;align-items:center');
  const ch1 = chips.appendChild(h('span', '', 'Real render')); ch1.style.cssText = 'height:42px;padding:0 18px;border-radius:999px;background:#e8eefe;color:#3a6cf4;font:800 19px Geist;display:flex;align-items:center;white-space:nowrap';
  const ch2 = chips.appendChild(h('span', '', 'Real usage · −1 run')); ch2.style.cssText = 'height:42px;padding:0 18px;border-radius:999px;background:#fff1d6;color:#c27a00;font:800 19px Geist;display:flex;align-items:center;white-space:nowrap';
  const cur3 = H.cursor(c3.c);
  // ---------- bottom: usage meter + 24 runs a day
  const bc = put(root, H.card({ w: 1724, h: 262 }), 100, 640);
  D(bc, 36, 30, 300, 32, 'font:800 24px Geist;display:flex;align-items:center;gap:10px', '<svg width="24" height="24" viewBox="0 0 24 24"><path d="M13 2L4 14h7l-1 8 9-12h-7z" fill="#f5a524"/></svg>Usage this week');
  const every = D(bc, 36, 70, 420, 28, 'font:700 19px Geist;color:#c27a00;white-space:nowrap', 'Every run spends usage');
  const pct = D(bc, 356, 22, 180, 64, 'font:800 52px Geist;text-align:right;font-variant-numeric:tabular-nums;letter-spacing:-.02em');
  const mtr = D(bc, 36, 124, 500, 22, 'border-radius:11px;background:#eef0f5;overflow:hidden');
  const mf = D(mtr, 0, 0, 0, 22, 'border-radius:11px;background:linear-gradient(90deg,#f5a524,#ffc94d)');
  const tick = D(bc, 0, 160, 90, 32, 'border-radius:999px;background:#15161c;color:#fff;font:800 16px Geist;display:flex;align-items:center;justify-content:center;white-space:nowrap', '−1 run');
  D(bc, 36, 206, 500, 30, 'font:600 17px Geist;color:#8a8d99;white-space:nowrap', 'Checks, tests and renders all count');
  D(bc, 588, 28, 1, 206, 'background:rgba(21,22,28,.08)');
  const RX = 632;
  const hTitle = D(bc, RX, 30, 600, 32, 'font:800 24px Geist;display:flex;align-items:center;gap:10px;white-space:nowrap', '<svg width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke="#15161c" stroke-width="2.4"/><path d="M12 7v5l3 2" stroke="#15161c" stroke-width="2.4" fill="none" stroke-linecap="round"/></svg>An hourly check');
  const cnt = D(bc, 1300, 20, 390, 70, 'display:flex;align-items:baseline;justify-content:flex-end;gap:10px;white-space:nowrap');
  const cntN = cnt.appendChild(h('span', '', '0')); cntN.style.cssText = 'font:800 60px Geist;letter-spacing:-.02em;font-variant-numeric:tabular-nums';
  const cntL = cnt.appendChild(h('span', '', 'runs / day')); cntL.style.cssText = 'font:700 22px Geist;color:#6b6e7b';
  const WORK = [2, 3, 22], PW = 38, PG = 6.5;
  const pips = [...Array(24)].map((_, i) => { const x = RX + i * (PW + PG); const p = D(bc, x, 108, PW, 46, 'border-radius:10px;box-shadow:inset 0 0 0 2px #e3e5eb'); const f = D(p, 0, 0, PW, 46, 'border-radius:10px'); return { p, f, x }; });
  [0, 6, 12, 18, 23].forEach(hh => D(bc, RX + hh * (PW + PG) - 11, 162, 60, 22, 'font:700 15px Maple;color:#a3a6b3;text-align:center;width:60px;margin-left:-0px', String(hh).padStart(2, '0') + ':00'));
  const legend = D(bc, RX, 200, 1060, 36, 'display:flex;align-items:center;gap:22px;font:700 19px Geist;color:#6b6e7b;white-space:nowrap');
  legend.innerHTML = '<span style="display:flex;align-items:center;gap:8px"><i style="width:18px;height:18px;border-radius:5px;background:#5a5cf0"></i>3 with work</span><span style="display:flex;align-items:center;gap:8px"><i style="width:18px;height:18px;border-radius:5px;background:#c9ccd6"></i>21 with nothing to do</span>';
  const billed = legend.appendChild(h('span', '', 'All 24 spend usage')); billed.style.cssText = 'margin-left:auto;height:36px;padding:0 16px;border-radius:999px;background:#15161c;color:#fff;font:800 18px Geist;display:flex;align-items:center';

  // timing
  const tOpen = T.zone - .05, tPick = T.settings + .05, tClick3 = T.test + .05;
  const tPip = i => T.hourly + .1 + i * ((T.day - T.hourly) / 24);
  const tTestTick = T.real + .1;
  ctx.cue(.2, 'swoosh', .5); ctx.cue(tOpen, 'click', .5); ctx.cue(tPick, 'click', .5); ctx.cue(T.waits, 'pop', .4); ctx.cue(T.slot, 'tick', .5);
  ctx.cue(tClick3, 'click', .5); ctx.cue(T.real, 'pop', .4); ctx.cue(T.every, 'swoosh', .4); [0, 6, 12, 18].forEach(i => ctx.cue(tPip(i), 'tick', .3)); ctx.cue(T.tf, 'pop', .45); ctx.cue(T.whether, 'swoosh', .35);

  return (t) => {
    [c1, c2, c3].forEach((c, i) => { enter(c.c, t, .2 + i * .1, { dy: 50, rx: 10 }); });
    const act = [A(t, T.sched - .2, .3) * (1 - A(t, T.nw - .3, .3)), A(t, T.nw - .2, .3) * (1 - A(t, T.test - .4, .3)), A(t, T.test - .3, .3) * (1 - A(t, T.every - .1, .4))];
    [c1, c2, c3].forEach((c, i) => { set(c.n, { s: 1 + .2 * Math.sin(Math.PI * P(t, [T.sched, T.nw, T.test][i] - .2, [T.sched, T.nw, T.test][i] + .2)) }); c.c.style.boxShadow = act[i] > 0 ? `0 0 0 ${(3 * act[i]).toFixed(1)}px ${['#33c9a6', '#f5a524', '#8b8cf6'][i]},0 24px 60px -14px rgba(0,0,0,.45)` : ''; });
    enter(bc, t, .5, { dy: 50, rx: 8 });
    // card 1
    const picked = t >= tPick + .05;
    selV.textContent = picked ? 'Pacific Time (PT)' : 'UTC';
    set(selV, { x: picked ? 8 * (1 - A(t, tPick + .05, .3)) : 0 });
    sel.style.boxShadow = t > tOpen && t < tPick + .3 ? 'inset 0 0 0 2.5px #33c9a6' : 'inset 0 0 0 1.5px #e3e5eb';
    const dk = A(t, tOpen + .05, .25, E.quart) * (1 - A(t, tPick + .05, .2));
    set(drop, { sy: lerp(.85, 1, dk), o: dk });
    const hov = t > tOpen + .4 ? 2 : 0; opts.forEach((o, i) => { o.style.background = i === hov ? '#e3f6f0' : '#fff'; o.style.color = i === hov ? '#0f8f73' : '#15161c'; });
    tChip.innerHTML = picked ? '21:00 <span style="color:#7ee0b8">PT</span>' : '21:00 <span style="color:#9aa0b4">UTC</span>';
    set(tChip, { s: 1 + .14 * Math.sin(Math.PI * P(t, tPick + .1, tPick + .45)) });
    cur1.update(t, [[tOpen - .6, 430, 340], [tOpen, 452, 160], [tPick - .25, 330, 302], [tPick + .6, 360, 318, tPick + .6]], [tOpen, tPick]);
    // card 2
    set(nrow, { y: 14 * (1 - SP(t, T.nw - .1, .6)), o: lerp(.25, 1, A(t, T.nw - .1, .3)) });
    set(nowD, { o: A(t, T.nw + .1, .3), s: lerp(.3, 1, SP(t, T.nw + .1, .6)) }); set(nowL, { o: A(t, T.nw + .2, .3) });
    set(dash, { sx: A(t, T.waits, T.slot - T.waits + .1, E.io), o: A(t, T.waits, .1) });
    set(slotD, { s: lerp(.3, 1, SP(t, T.slot - .05, .6)), o: A(t, T.slot - .05, .15) }); set(slotL, { o: A(t, T.slot + .05, .3) });
    set(ghost, { o: A(t, T.waits - .05, .25) * (1 - A(t, T.slot + .6, .4)), y: 10 * (1 - SP(t, T.waits - .05, .6)) });
    const rem = Math.round(lerp(320, 318, P(t, T.waits, ctx.dur)));
    waitT.innerHTML = `Waiting <b style="color:#15161c">${Math.floor(rem / 60)} h ${String(rem % 60).padStart(2, '0')} m</b> for the first run`;
    set(wait, { o: A(t, T.slot + .2, .35), x: 10 * (1 - A(t, T.slot + .2, .45)) }); set(hg, { r: 180 * E.io(P(t % 2, 1.4, 2)) });
    // card 3
    set(btn, { s: 1 - .06 * Math.max(0, 1 - Math.abs(t - tClick3) / .1) });
    btn.style.background = t > tClick3 ? '#5a5cf0' : '#15161c';
    const run = P(t, tClick3 + .1, ctx.dur - .2); const fr = Math.round(lerp(0, 900, run * .9));
    pf.style.width = (340 * run * .9).toFixed(1) + 'px'; pv.textContent = `${String(fr).padStart(4, '0')}/900`;
    set(term, { o: lerp(.35, 1, A(t, tClick3 + .05, .3)) }); set(tl2, { o: A(t, T.real - .1, .3) });
    set(ch1, { o: A(t, T.real - .2, .25), s: lerp(.6, 1, SP(t, T.real - .2, .6)) }); set(ch2, { o: A(t, T.real + .1, .25), s: lerp(.6, 1, SP(t, T.real + .1, .6)) });
    cur3.update(t, [[tClick3 - .7, 330, 250], [tClick3 - .05, 120, 136], [tClick3 + .7, 150, 170, tClick3 + .7]], [tClick3]);
    // bottom: usage
    let u = 84 - (t > tTestTick ? 1 : 0); let lastTick = t > tTestTick ? tTestTick : -9;
    pips.forEach((p, i) => { const s = tPip(i); if (t > s) { u -= .8; lastTick = s; } });
    pct.textContent = Math.round(u) + '%'; mf.style.width = (500 * u / 100).toFixed(1) + 'px';
    const tk = t - lastTick; set(tick, { x: 36 + 500 * u / 100 - 45, y: -14 * A(t, lastTick, .6), o: lastTick > 0 ? (tk < .5 ? A(t, lastTick, .1) : 1 - A(t, lastTick + .5, .25)) : 0 });
    set(every, { o: A(t, T.every - .1, .3), x: 10 * (1 - A(t, T.every - .1, .4)) });
    set(pct, { s: 1 + .08 * Math.sin(Math.PI * P(t, T.spends, T.spends + .4)) });
    // bottom: 24 runs
    set(hTitle, { o: lerp(.35, 1, A(t, T.hourly - .2, .3)) }); set(cnt, { o: lerp(.3, 1, A(t, T.hourly - .1, .3)) });
    let n = 0; pips.forEach((p, i) => {
      const s = tPip(i), on = A(t, s, .18); if (t >= s) n++;
      const sort = A(t, T.whether + i * .015, .35), work = WORK.includes(i);
      const c = work ? '#5a5cf0' : `color-mix(in srgb,#c9ccd6 ${Math.round(sort * 100)}%,#8b8cf6)`;
      p.f.style.background = c; set(p.f, { o: on, s: lerp(.4, 1, SP(t, s, .5)) });
      set(p.p, { y: work ? -6 * sort : 0 });
    });
    cntN.textContent = n; set(cntN, { s: 1 + .18 * Math.sin(Math.PI * P(t, T.tf, T.tf + .4)) });
    cntN.style.color = t > T.tf ? '#c27a00' : '#15161c';
    set(legend, { o: A(t, T.whether, .35), y: 10 * (1 - A(t, T.whether, .45)) });
    set(billed, { s: lerp(.6, 1, SP(t, T.not - .1, .6)), o: A(t, T.not - .1, .2) });
  };
};
