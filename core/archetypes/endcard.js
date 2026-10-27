// endcard — the last 15–20 s: YouTube end-screen slots (place the real elements in YouTube Studio over these frames),
// channel mark + subscribe, and one closing line. Use "lines": [] and "min_dur": 18 for a music-only outro.
// data: { title?: "Watch next", line?: "New breakdowns every week", slots?: [{ label: "Best for you" }, { label: "Latest" }],
//         channel?: "TrueSight AI", logo?: "assets/brand/logo.png" }
ARCH.endcard = (root, ctx, H, d, sc) => {
  const { set, enter, A, SP, E, P, lerp, D } = H;
  const ttl = D(root, 120, 150, 1200, 80, 'font:var(--fwd) 72px var(--fd);letter-spacing:calc(-.04em * var(--trk));white-space:nowrap', H.md(d.title || 'Watch next')); ttl.classList.add('onbg');
  const slots = (d.slots || [{ label: 'Best for you' }, { label: 'Latest video' }]).slice(0, 2).map((s, i) => {
    const x = 120 + i * 560, w = 520, hh = 293;
    const e = D(root, x, 300, w, hh, 'border-radius:22px;background:rgba(255,255,255,.06);box-shadow:inset 0 0 0 2px rgba(255,255,255,.18);overflow:hidden');
    const sh = D(e, -w, 0, w, hh, 'background:linear-gradient(100deg,transparent,rgba(255,255,255,.12),transparent)');
    const lb = D(root, x, 300 + hh + 18, w, 34, 'font:700 26px var(--fb);white-space:nowrap', H.esc(s.label || '')); lb.classList.add('onbg-sub');
    return { e, sh, lb, w };
  });
  // channel block
  const CX = 1500, CY = 446;
  const ring = D(root, CX - 150, CY - 150, 300, 300, 'border-radius:50%;box-shadow:inset 0 0 0 3px rgba(255,255,255,.22)');
  const logo = D(root, CX - 120, CY - 120, 240, 240, 'border-radius:50%;overflow:hidden;background:var(--surface);box-shadow:0 20px 60px -10px rgba(0,0,0,.5)');
  if (d.logo) { const im = H.img(d.logo); im.style.cssText = 'width:100%;height:100%;object-fit:contain;padding:22px'; logo.appendChild(im); }
  else logo.innerHTML = `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font:var(--fwd) 90px var(--fd);color:var(--ink)">${H.esc((d.channel || 'TS').split(' ').map(x => x[0]).join('').slice(0, 2))}</div>`;
  const nm = D(root, CX - 300, CY + 170, 600, 50, 'text-align:center;font:var(--fwd) 38px var(--fd);white-space:nowrap', H.esc(d.channel || '')); nm.classList.add('onbg');
  const sub = D(root, CX - 130, CY + 236, 260, 66, 'border-radius:999px;background:#ff2d2d;color:#fff;font:var(--fwd) 28px var(--fd);display:flex;align-items:center;justify-content:center;letter-spacing:.02em;box-shadow:0 14px 34px -10px rgba(255,45,45,.6)', 'Subscribe');
  const line = d.line ? D(root, 120, 760, 1680, 50, 'font:600 34px var(--fb);white-space:nowrap', H.md(d.line)) : null; if (line) line.classList.add('onbg-sub');
  ctx.cue(.2, 'swoosh', .3); ctx.cue(1.6, 'pop', .4); ctx.cue(2.4, 'click', .5);
  return t => {
    const tk = SP(t, .15, .9); set(ttl, { o: A(t, .15, .3), y: 40 * (1 - tk) });
    slots.forEach(({ e, sh, lb, w }, i) => { enter(e, t, .4 + i * .15, { dy: 40 }); set(lb, { o: A(t, .7 + i * .15, .3) }); set(sh, { x: ((t * .35 + i * .5) % 1.6) * w * 1.6 }); });
    H.pop(ring, t, .9, { s0: .7 }); ring.style.scale = (1 + .03 * Math.sin(t * 2)).toFixed(4);
    H.pop(logo, t, 1, { s0: .6 }); set(nm, { o: A(t, 1.3, .3), y: 14 * (1 - A(t, 1.3, .5)) });
    const pr = Math.max(0, 1 - Math.abs(t - 2.4) / .12); H.pop(sub, t, 1.6, { s0: .6 }); if (t > 1.6 + .8) set(sub, { s: 1 - .07 * pr, o: 1 });
    sub.textContent = t > 2.42 ? 'Subscribed ✓' : 'Subscribe'; sub.style.background = t > 2.42 ? '#3b3d4a' : '#ff2d2d';
    if (line) set(line, { o: A(t, 1.8, .4) });
  };
};
ARCH.endcard.noHeader = true;
