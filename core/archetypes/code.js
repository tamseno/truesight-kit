// code — an editor window. Lines reveal early (or type out), focus bands light the lines being discussed while the rest
// dims, diff lines (+/-) get green/red gutters, and notes pin to lines from a side column with a connector.
// data: { file: "handoff-brief.md", lang?: "md"|"js"|"ts"|"py"|"sh"|"yaml", code: "line\nline", tabs?: ["role.md"],
//         reveal?: "lines"|"type"|"all", typeBy?: phrase|sec, focus?: [{ lines: [3, 5], at }],
//         notes?: [{ line: 4, text: "Proof is required", at, tone?: "good"|"bad"|"warn" }], diff?: true, w? }
ARCH.code = (root, ctx, H, d, sc) => {
  const { h, set, enter, A, SP, E, P, lerp, cl, D } = H;
  const src = String(d.code || '').replace(/\t/g, '  ').split('\n'), n = src.length, lang = d.lang || (/\.md$/.test(d.file || '') ? 'md' : /\.ya?ml$/.test(d.file || '') ? 'yaml' : /\.py$/.test(d.file || '') ? 'py' : /\.sh$/.test(d.file || '') ? 'sh' : 'js');
  const notes = d.notes || [], hasN = notes.length > 0;
  const full = !sc.title, EY = full ? 120 : 244, EH = full ? 780 : 624;
  const EW = d.w || (hasN ? 1160 : 1500), EX = hasN ? 88 : (1920 - EW) / 2;
  const wnd = H.put(root, H.win({ dark: true, w: EW, h: EH }), EX, EY);
  const bar = wnd.querySelector('.bar'); bar.querySelector('.wt').remove();
  const tabs = [d.file || 'untitled', ...(d.tabs || [])];
  bar.insertAdjacentHTML('beforeend', tabs.map((f, i) => `<span style="margin-left:${i ? 4 : 14}px;height:52px;display:flex;align-items:center;gap:10px;padding:0 20px;font:700 20px Maple;${i ? 'color:#6f7590' : 'color:#e8e9f0;background:#14151d;box-shadow:inset 0 2px 0 var(--accent)'}">${H.esc(f)}</span>`).join(''));
  const BH = EH - 52, body = D(wnd.body, 0, 0, EW, BH, 'position:absolute;left:0;top:0;overflow:hidden');
  wnd.body.style.padding = '0'; wnd.body.style.height = BH + 'px';
  const fs = cl(Math.floor((BH - 48) / (n * 1.55)), 26, 30), LH = Math.round(fs * 1.55), GW = 78;
  const sheet = D(body, 0, 0, EW, n * LH + 60);
  const band = D(sheet, 0, 0, EW, LH, 'background:color-mix(in srgb,var(--accent) 20%,transparent);box-shadow:inset 4px 0 0 var(--accent)');
  const rows = src.map((ln, i) => {
    const sign = d.diff && /^[+-]/.test(ln) ? ln[0] : '';
    const bg = sign === '+' ? 'background:rgba(46,204,113,.13)' : sign === '-' ? 'background:rgba(240,68,58,.14)' : '';
    const r = D(sheet, 0, 24 + i * LH, EW, LH, `display:flex;align-items:center;${bg}`);
    r.innerHTML = `<span data-noqa style="flex:none;width:${GW}px;padding-right:22px;text-align:right;font:500 ${Math.round(fs * .8)}px Maple;color:${sign === '+' ? '#5ee39b' : sign === '-' ? '#ff7a70' : '#4b4f63'}">${sign || i + 1}</span><span class="cx" style="font-size:${fs}px;line-height:${LH}px">${H.syntax(sign ? ' ' + ln.slice(1) : ln, lang)}</span>`;
    if (sign === '-') r.querySelector('.cx').style.textDecoration = 'line-through rgba(255,122,112,.6)';
    return r;
  });
  // reveal timing
  const nar0 = ctx.lines[0] ? ctx.lines[0].s : .3, nar1 = ctx.lines.length ? ctx.lines.at(-1).e : ctx.dur;
  const mode = d.reveal || 'lines', tEnd = H.when(ctx, d.typeBy, lerp(nar0, nar1, mode === 'type' ? .55 : .3));
  const LT = src.map((_, i) => mode === 'all' ? .2 : lerp(.35, Math.max(.6, tEnd), n > 1 ? i / (n - 1) : 0));
  const chars = src.map(s => [...s].length), totC = chars.reduce((a, b) => a + b, 0) || 1;
  const typed = mode === 'type' ? rows.map(r => r.querySelector('.cx').innerHTML) : null;
  // focus bands + scroll
  const FO = (d.focus || []).map((f, i) => ({ a: f.lines[0], b: f.lines[1] ?? f.lines[0], t: H.when(ctx, f.at, H.spread(ctx, i, (d.focus || []).length, .3, .85)) }));
  const maxScroll = Math.max(0, n * LH + 48 - BH);
  const scrollFor = f => cl(24 + ((f.a - 1 + f.b) / 2) * LH - BH / 2, 0, maxScroll);
  // notes (side column)
  const NX = EX + EW + 40, NW = 1832 - NX;
  let lastB = EY - 10;
  const NT = H.times(ctx, notes, .35, .85);
  const svgW = D(root, 0, 0, 1920, 1080, 'pointer-events:none'); svgW.innerHTML = '<svg width="1920" height="1080" style="position:absolute;left:0;top:0;overflow:visible"></svg>'; const S = svgW.firstChild;
  const NOTE = { good: '#1fbf75', bad: '#f0443a', warn: '#f5a524' };
  const nEls = notes.map((nt, i) => {
    const c = NOTE[nt.tone] || 'var(--accent)';
    const el = H.put(root, H.card({ w: NW }), NX, 0); el.style.padding = '22px 26px 22px 30px'; el.style.boxShadow += `,inset 5px 0 0 ${c}`;
    el.innerHTML = `<div style="font:800 20px Maple;letter-spacing:.06em;color:${c};margin-bottom:8px">LINE ${nt.line}</div><div style="font:700 27px/1.3 Geist,Noto;letter-spacing:-.01em">${H.md(nt.text)}</div>`;
    const hh = el.offsetHeight, ly = EY + 52 + 24 + (nt.line - .5) * LH;
    const y = Math.max(lastB + 18, Math.min(ly - hh / 2, 872 - hh)); el.style.top = y + 'px'; lastB = y + hh;
    const p = document.createElementNS('http://www.w3.org/2000/svg', 'path'); p.setAttribute('fill', 'none'); p.setAttribute('stroke', c === 'var(--accent)' ? getComputedStyle(document.documentElement).getPropertyValue('--accent') || '#5a5cf0' : c); p.setAttribute('stroke-width', '3'); p.setAttribute('stroke-dasharray', '6 7'); S.appendChild(p);
    const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle'); dot.setAttribute('r', '7'); dot.setAttribute('fill', p.getAttribute('stroke')); S.appendChild(dot);
    return { el, p, dot, ly, y: y + hh / 2, t: NT[i] };
  });
  // sounds + camera
  if (mode === 'type') ctx.cue(.4, 'type', .5); else src.forEach((_, i) => { if (i % 3 === 0 && mode !== 'all') ctx.cue(LT[i], 'tick', .18); });
  FO.forEach(f => ctx.cue(f.t, 'swish', .35)); NT.forEach(x => ctx.cue(x, 'pop', .35));
  FO.forEach(f => { const sy = scrollFor(f); ctx.focus(f.t - .15, { x: EX + 40, y: EY + 52 + 24 + (f.a - 1) * LH - sy, w: Math.min(EW, 1100) - 80, h: (f.b - f.a + 1) * LH }, { z: hasN ? 1.04 : 1.07, k: .32, d: 1.2 }); });
  if (FO.length) ctx.reset(FO.at(-1).t + Math.max(2.4, (nar1 - FO.at(-1).t) * .7), 1.4);
  return t => {
    enter(wnd, t, .05, { dy: 50, rx: 8 });
    // reveal
    if (mode === 'type') {
      let c = Math.floor(cl((t - .35) / Math.max(.5, tEnd - .35)) * totC);
      rows.forEach((r, i) => { const cx = r.querySelector('.cx'), k = Math.min(chars[i], Math.max(0, c)); c -= chars[i]; const key = k + ''; if (cx.dataset.k !== key) { cx.dataset.k = key; cx.innerHTML = k >= chars[i] ? typed[i] : H.syntax([...src[i]].slice(0, k).join(''), lang) + (k > 0 || (c > -chars[i] && c <= 0) ? '<span class="caret" style="color:#8fb3ff"></span>' : ''); } set(r, { o: k > 0 || i === 0 ? 1 : 0 }); });
    } else rows.forEach((r, i) => { set(r, { o: A(t, LT[i], .25), x: -14 * (1 - A(t, LT[i], .4)) }); });
    // focus
    let cur = null; FO.forEach(f => { if (t >= f.t - .1) cur = f; });
    let by = 0, bh = 0, bo = 0, sy = 0;
    FO.forEach((f, i) => { const k = E.io(P(t, f.t - .1, f.t + .35)); if (k <= 0) return; const yy = 24 + (f.a - 1) * LH, hh = (f.b - f.a + 1) * LH; if (i === 0 || bo === 0) { by = yy; bh = hh; } else { by = lerp(by, yy, k); bh = lerp(bh, hh, k); } bo = Math.max(bo, k); sy = lerp(sy, scrollFor(f), k); });
    band.style.top = by + 'px'; band.style.height = bh + 'px'; band.style.opacity = bo.toFixed(3);
    set(sheet, { y: -sy });
    if (cur) rows.forEach((r, i) => { const on = i + 1 >= cur.a && i + 1 <= cur.b; const base = mode === 'type' ? 1 : A(t, LT[i], .25); r.style.opacity = (base * (on ? 1 : lerp(1, .36, A(t, cur.t - .1, .3)))).toFixed(3); });
    // notes
    nEls.forEach(({ el, p, dot, ly, y, t: tn }, i) => {
      const k = SP(t, tn, .8); set(el, { x: 30 * (1 - k), o: A(t, tn, .25) });
      const cy = ly - sy, x1 = EX + EW - 24, x2 = NX - 6, mx = (x1 + x2) / 2, kk = E.io(P(t, tn, tn + .45));
      p.setAttribute('d', `M${x1} ${cy.toFixed(1)} C${mx} ${cy.toFixed(1)} ${mx} ${y.toFixed(1)} ${lerp(x1, x2, kk).toFixed(1)} ${lerp(cy, y, kk).toFixed(1)}`);
      p.style.opacity = kk > 0 ? .9 : 0; dot.setAttribute('cx', x1); dot.setAttribute('cy', cy.toFixed(1)); dot.style.opacity = A(t, tn, .2);
    });
  };
};
