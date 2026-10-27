// hero — episode opener. Proof first: the finished result fills the frame, then shrinks beside the title.
// data: {
//   proof?: { image: "media/proof.jpg" } | { frames: "media/proof/%04d.jpg", count: 90, fps: 30 },  label?: "Made overnight · No After Effects", until?: phrase|sec (default 2.6s)
//   logos?: [{ name: "Grok Bot", mark: "grok"|"dot", color }], title: "An *overnight*\nmotion design studio", meta?: "five bots · one cloud computer", cast?: true }
ARCH.hero = (root, ctx, H, d) => {
  const { h, put, set, A, SP, E, P, lerp, D, BOTS, BOT_ORDER, bot } = H;
  const pf = d.proof;
  const tShrink = pf ? H.when(ctx, pf.until, 2.6) : 0;
  // ---- proof media on a canvas (deterministic: frames are pre-decoded)
  let cv, cx, imgs = [], plabel, prec;
  if (pf) {
    if (pf.frames) { for (let i = 1; i <= (pf.count || 1); i++) imgs.push(H.img(pf.frames.replace(/%0(\d)d/, (_, n) => String(i).padStart(+n, '0')))); }
    else if (pf.image) imgs.push(H.img(pf.image));
    cv = put(root, h('canvas', ''), 0, 0, 1920, 1080); cv.width = 1920; cv.height = 1080; cx = cv.getContext('2d');
    cv.style.cssText += ';border-radius:0;transform-origin:0 0;box-shadow:0 30px 80px -20px rgba(20,24,60,.35)';
    plabel = D(root, 88, 900, 900, 60, 'display:flex;align-items:center;gap:14px;font:800 30px Geist;color:#fff;white-space:nowrap;text-shadow:0 2px 18px rgba(0,0,0,.45)', `<span style="width:14px;height:14px;border-radius:50%;background:#ff4d4f;box-shadow:0 0 0 6px rgba(255,77,79,.25)"></span>${H.esc(pf.label || 'Final render')}`);
    prec = D(root, 1832 - 300, 72, 300, 44, 'text-align:right;font:700 24px Maple;color:#fff;text-shadow:0 2px 14px rgba(0,0,0,.5)');
  }
  // ---- title side
  const X = 120, Y = pf ? 300 : 330;
  const logoRow = (d.logos || []).length ? D(root, X, Y - 92, 1600, 48, 'display:flex;align-items:center;gap:40px;white-space:nowrap', d.logos.map(l => {
    const mk = l.mark === 'grok' ? H.grok(40).innerHTML : `<span style="width:30px;height:30px;border-radius:9px;background:${l.color || '#d97757'};display:inline-block"></span>`;
    return `<span class="lg" style="display:inline-flex;align-items:center;gap:12px;font:800 30px Geist">${mk}${H.esc(l.name)}</span>`; }).join('')) : null;
  const lw = logoRow ? [...logoRow.querySelectorAll('.lg')] : [];
  const titleLines = String(d.title || '').split('\n');
  const tw = pf ? 880 : 1600;
  const title = D(root, X, Y, tw, null, `font:800 ${pf ? 80 : 120}px/1.04 Geist,Noto;letter-spacing:-.04em;color:#15161c;white-space:nowrap`, titleLines.map(l => `<div class="tl">${H.md(l)}</div>`).join(''));
  const tls = [...title.querySelectorAll('.tl')], hls = [...title.querySelectorAll('.hl')];
  const castRow = d.cast !== false ? BOT_ORDER.map((k, i) => { const b = bot(k, 74); const w = put(root, h('div', ''), X + i * 92, Y + titleLines.length * (pf ? 84 : 125) + 56, 74, 74); w.appendChild(b.el); return { w, b }; }) : [];
  const meta = d.meta ? D(root, pf ? X : X + (castRow.length ? castRow.length * 92 + 24 : 0), Y + titleLines.length * (pf ? 84 : 125) + (pf ? 160 : 80), pf ? 860 : 900, 34, 'font:600 24px Maple;color:#6b6e7b;white-space:nowrap', H.esc(d.meta)) : null;
  const t0 = pf ? tShrink + .15 : .1;
  if (pf) ctx.cue(tShrink, 'whoosh', .4);
  ctx.cue(t0 + .1, 'swoosh', .3);
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
  };
};
ARCH.hero.noHeader = true;
