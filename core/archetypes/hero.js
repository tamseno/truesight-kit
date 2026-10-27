// hero — episode opener. Proof first: the finished result fills the frame, then shrinks beside the title.
// No footage? Give it a "stack": floating UI cards on the right that tell the story in three beats.
// data: {
//   proof?: { image: "media/proof.jpg" } | { frames: "media/proof/%04d.jpg", count: 90, fps: 30 },  label?: "Made overnight · No After Effects", until?: phrase|sec (default 2.6s)
//   stack?: [{ kind: "msg", text } | { kind: "tool", text, sub?, who? } | { kind: "pr", id, title, ok? } | { kind: "note", text }],
//   logos?: [{ name: "Grok Bot", mark: "grok"|"dot", color }], title: "An *overnight*\nmotion design studio", meta?: "five bots · one cloud computer", cast?: true }
ARCH.hero = (root, ctx, H, d) => {
  const { h, put, set, A, SP, E, P, lerp, D, BOTS, BOT_ORDER, bot, IC } = H;
  const pf = d.proof, side = !!(pf || d.stack);
  const tShrink = pf ? H.when(ctx, pf.until, 2.6) : 0;
  // ---- proof media on a canvas (deterministic: frames are pre-decoded)
  let cv, cx, imgs = [], plabel, prec;
  if (pf) {
    if (pf.frames) { for (let i = 1; i <= (pf.count || 1); i++) imgs.push(H.img(pf.frames.replace(/%0(\d)d/, (_, n) => String(i).padStart(+n, '0')))); }
    else if (pf.image) imgs.push(H.img(pf.image));
    cv = put(root, h('canvas', ''), 0, 0, 1920, 1080); cv.width = 1920; cv.height = 1080; cx = cv.getContext('2d');
    cv.style.cssText += ';border-radius:0;transform-origin:0 0;box-shadow:0 30px 80px -20px rgba(20,24,60,.35)';
    plabel = D(root, 88, 900, 900, 60, 'display:flex;align-items:center;gap:14px;font:var(--fwd) 30px var(--fd);color:#fff;white-space:nowrap;text-shadow:0 2px 18px rgba(0,0,0,.45)', `<span style="width:14px;height:14px;border-radius:50%;background:#ff4d4f;box-shadow:0 0 0 6px rgba(255,77,79,.25)"></span>${H.esc(pf.label || 'Final render')}`);
    prec = D(root, 1832 - 300, 72, 300, 44, 'text-align:right;font:700 24px var(--fm);color:#fff;text-shadow:0 2px 14px rgba(0,0,0,.5)');
  }
  // ---- title side
  const titleLines = String(d.title || '').split('\n');
  const FS = pf ? 80 : d.stack ? 96 : 120, LH = Math.round(FS * 1.04), X = 120;
  const blockH = 92 + titleLines.length * LH + 150, Y = side ? Math.max(300, 560 - blockH / 2 + 92) : 330;
  const logoRow = (d.logos || []).length ? D(root, X, Y - 92, 1600, 48, 'display:flex;align-items:center;gap:40px;white-space:nowrap', d.logos.map(l => {
    const mk = l.mark === 'grok' ? H.grok(40).innerHTML : `<span style="width:30px;height:30px;border-radius:9px;background:${l.color || '#d97757'};display:inline-block"></span>`;
    return `<span class="lg onbg" style="display:inline-flex;align-items:center;gap:12px;font:var(--fwd) 30px var(--fd)">${mk}${H.esc(l.name)}</span>`; }).join('')) : null;
  const lw = logoRow ? [...logoRow.querySelectorAll('.lg')] : [];
  const tw = side ? 900 : 1600;
  const title = D(root, X, Y, tw, null, `font:800 ${FS}px/1.04 Geist,Noto;letter-spacing:calc(-.045em * var(--trk));white-space:nowrap`, titleLines.map(l => `<div class="tl">${H.md(l)}</div>`).join(''));
  title.classList.add('onbg'); H.fit(title, tw, 56);
  const tls = [...title.querySelectorAll('.tl')], hls = [...title.querySelectorAll('.hl')];
  const rowY = Y + titleLines.length * LH + 50;
  const castRow = d.cast !== false ? BOT_ORDER.map((k, i) => { const b = bot(k, 74); const w = put(root, h('div', ''), X + i * 92, rowY, 74, 74); w.appendChild(b.el); return { w, b }; }) : [];
  const meta = d.meta ? D(root, X, rowY + (castRow.length ? 104 : 0), tw, 34, 'font:600 26px var(--fm);white-space:nowrap', H.esc(d.meta)) : null;
  if (meta) meta.classList.add('onbg-sub');
  const t0 = pf ? tShrink + .15 : .1;
  if (pf) ctx.cue(tShrink, 'whoosh', .4);
  ctx.cue(t0 + .1, 'swoosh', .3);
  // ---- floating stack (right side)
  const ST = (d.stack || []).map((s, i) => {
    const w = s.kind === 'pr' ? 620 : 600, x = 1110 + [40, 0, 110, 60][i % 4], y = 250 + i * 190;
    const c = H.put(root, H.card({ w }), x, y); c.style.padding = '24px 28px'; c.style.borderRadius = '26px';
    if (s.kind === 'msg') { c.style.background = 'var(--inv)'; c.style.color = 'var(--inv-ink)'; c.innerHTML = `<div style="display:flex;gap:14px;align-items:center;margin-bottom:10px">${IC.user('#3b3d4a').replace('width="100%" height="100%"', 'width="34" height="34"')}<span style="font:700 21px var(--fb);color:inherit;opacity:.6">You</span></div><div style="font:700 30px/1.3 var(--fb)">${H.md(s.text)}</div>`; }
    else if (s.kind === 'tool') { const av = H.avatar(s.who || BOT_ORDER[0], 50); c.innerHTML = `<div style="display:flex;align-items:center;gap:18px"><span class="avw"></span><div style="min-width:0;flex:1"><div style="font:var(--fwd) 28px var(--fd);white-space:nowrap">${H.md(s.text)}</div>${s.sub ? `<div style="font:600 22px var(--fm);color:var(--sub);white-space:nowrap">${H.esc(s.sub)}</div>` : ''}</div><span class="sp" style="width:40px;height:40px;flex:none;border-radius:50%;border:5px solid var(--track);border-top-color:var(--accent)"></span></div>`; c.querySelector('.avw').replaceWith(av.el); av.el.style.position = 'relative'; c.av = av; }
    else if (s.kind === 'pr') c.innerHTML = `<div style="display:flex;align-items:center;gap:14px"><span style="width:40px;height:40px">${IC.pr('#1fbf75')}</span><span style="font:700 23px var(--fm);color:var(--sub)">${H.esc(s.id || '')}</span><span style="margin-left:auto">${H.tag(s.state || 'READY', '#3a6cf4')}</span></div><div style="font:var(--fwd) 30px/1.2 var(--fd);margin-top:12px;white-space:nowrap">${H.md(s.title || '')}</div>${s.ok ? `<div style="display:flex;gap:10px;margin-top:14px">${s.ok.map(o => `<span style="display:inline-flex;align-items:center;gap:8px;height:36px;padding:0 14px;border-radius:999px;background:var(--good-fill);color:var(--good-ink);font:800 21px var(--fb);white-space:nowrap">✓ ${H.esc(o)}</span>`).join('')}</div>` : ''}`;
    else c.innerHTML = `<div style="font:700 28px/1.3 var(--fb)">${H.md(s.text || '')}</div>`;
    return { c, s, i, t: t0 + .9 + i * .55 };
  });
  ST.forEach(s => ctx.cue(s.t, s.s.kind === 'msg' ? 'swish' : 'pop', .35));
  if (ST.length) ctx.cam(t0 + .5, { x: 1000, y: 545, z: 1.03, d: Math.max(2, ctx.dur - t0 - .5) });
  // proof target rect when docked
  const R = { x: 1010, y: 236, w: 822, h: 462 };
  return t => {
    if (pf) {
      const k = E.io(P(t, tShrink, tShrink + .75));
      const x = lerp(0, R.x, k), y = lerp(0, R.y, k), w = lerp(1920, R.w, k);
      const sc = w / 1920; cv.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0) scale(${sc.toFixed(4)})`;
      cv.style.borderRadius = (22 / sc * k).toFixed(1) + 'px';
      // draw current frame with a slow push-in
      const n = imgs.length, fi = n > 1 ? Math.min(n - 1, Math.floor(t * (pf.fps || 30)) % n) : 0, im = imgs[fi];
      cx.fillStyle = '#111'; cx.fillRect(0, 0, 1920, 1080);
      if (im && im.naturalWidth) { const z = 1.06 - .06 * E.sine(P(t, 0, ctx.dur)); const iw = 1920 * z, ih = 1080 * z; cx.drawImage(im, (1920 - iw) / 2, (1080 - ih) / 2, iw, ih); }
      set(plabel, { o: A(t, .2, .3) * (1 - A(t, tShrink - .2, .3)) });
      prec.textContent = `00:${String(Math.floor(t)).padStart(2, '0')}:${String(Math.floor((t % 1) * 60)).padStart(2, '0')} · 60 fps`;
      set(prec, { o: A(t, .2, .3) * (1 - A(t, tShrink - .2, .3)) });
    }
    lw.forEach((l, i) => set(l, { o: A(t, t0 + i * .1, .3), y: 14 * (1 - A(t, t0 + i * .1, .5)) }));
    tls.forEach((l, i) => { const s = t0 + .15 + i * .12, k = SP(t, s, .9); set(l, { y: 70 * (1 - k), o: A(t, s, .25), b: 10 * (1 - A(t, s, .35)) }); });
    hls.forEach(e => H.hl(e, E.io(P(t, t0 + .7, t0 + 1.2))));
    castRow.forEach(({ w, b }, i) => { H.pop(w, t, t0 + .9 + i * .08, { dy: 30 }); b.update(t); });
    if (meta) set(meta, { o: A(t, t0 + 1.4, .4) });
    ST.forEach(({ c, i, t: ts }) => {
      const k = SP(t, ts, 1.1), fl = Math.sin(t * 1.1 + i * 1.7) * 6;
      set(c, { x: 80 * (1 - k), y: fl + 30 * (1 - k), ry: -14 * (1 - k) - 4, rx: 3, o: A(t, ts, .3), b: 8 * (1 - A(t, ts, .4)) });
      if (c.av) c.av.update(t); const sp = c.querySelector('.sp'); if (sp) sp.style.transform = `rotate(${(t * 380).toFixed(1)}deg)`;
    });
  };
};
ARCH.hero.noHeader = true;
