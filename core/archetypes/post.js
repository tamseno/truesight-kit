// post — a real post / quote / article as proof, with phrases highlighted as they are spoken, plus a source tag.
// data: { author: "Elon Musk", handle: "@elonmusk", date: "Oct 7, 2026", avatar?: "EM", verified?: true,
//         text: "Going forward ... *best back end model for any given task* ...", hlAt?: ["best back end", ...],
//         side?: { title: "What it means", items: [{ text, sub?, at? }] }  |  stats?: [{ label, value, suffix?, dec?, at? }],
//         source: "x.com/elonmusk/status/2107724314451878104" }
ARCH.post = (root, ctx, H, d) => {
  const { set, enter, A, SP, E, P, lerp, D } = H;
  const hasSide = !!(d.side || d.stats), PW = hasSide ? 1000 : 1300, PX = hasSide ? 88 : (1920 - PW) / 2, Y = 250;
  const c = H.put(root, H.card({ w: PW }), PX, Y);
  const av = D(c, 40, 38, 76, 76, 'border-radius:50%;background:#15161c;color:#fff;font:800 28px Geist;display:flex;align-items:center;justify-content:center', H.esc(d.avatar || (d.author || '?').split(' ').map(x => x[0]).join('').slice(0, 2)));
  D(c, 136, 40, PW - 180, 40, 'font:800 32px Geist;display:flex;align-items:center;gap:10px;white-space:nowrap', `${H.esc(d.author || '')}${d.verified !== false ? '<svg width="28" height="28" viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" fill="#1d9bf0"/><path d="M7 12.5l3.2 3.2L17 9" stroke="#fff" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>' : ''}`);
  D(c, 136, 82, PW - 180, 30, 'font:600 23px Geist;color:#8a8d99;white-space:nowrap', H.esc([d.handle, d.date].filter(Boolean).join(' · ')));
  const body = D(c, 40, 140, PW - 80, null, 'position:relative;font:600 36px/1.42 Geist,Noto;letter-spacing:-.012em;padding-bottom:40px', H.md(d.text || ''));
  body.style.position = 'relative'; body.style.left = '40px'; body.style.top = '0'; body.style.marginTop = '140px';
  const hls = [...body.querySelectorAll('.hl')];
  const hlT = hls.map((e, i) => H.when(ctx, (d.hlAt || [])[i] || e.textContent.split(' ').slice(0, 2).join(' '), H.spread(ctx, i, hls.length, .3, .7)));
  let side = null, rows = [], ST = [];
  if (d.side) {
    side = H.put(root, H.card({ w: 1744 - PW - 32, h: 560 }), PX + PW + 32, Y);
    D(side, 34, 32, 600, 44, 'font:800 34px Geist,Noto;letter-spacing:-.02em', H.md(d.side.title || 'What it means'));
    ST = H.times(ctx, d.side.items, .3, .85);
    rows = d.side.items.map((it, i) => D(side, 34, 108 + i * 146, 1744 - PW - 32 - 68, 130, 'display:flex;gap:18px', `<span style="flex:none;width:44px;height:44px;border-radius:13px;background:var(--accent);color:#fff;font:800 23px Geist;display:flex;align-items:center;justify-content:center">${i + 1}</span><div><div style="font:800 33px/1.15 Geist,Noto;letter-spacing:-.02em">${H.md(it.text)}</div>${it.sub ? `<div style="font:600 25px/1.3 Geist,Noto;color:#8a8d99;margin-top:6px">${H.md(it.sub)}</div>` : ''}</div>`));
  } else if (d.stats) {
    ST = H.times(ctx, d.stats, .2, .7);
    rows = d.stats.map((s, i) => { const k = H.put(root, H.card({ w: 1744 - PW - 32, h: 170 }), PX + PW + 32, Y + i * 192); D(k, 30, 26, 600, 30, 'font:700 22px Geist;color:#8a8d99;letter-spacing:.06em;text-transform:uppercase', H.esc(s.label)); const v = D(k, 30, 62, 600, 90, 'font:800 76px/1 Geist;letter-spacing:-.03em'); k.v = v; k.s = s; return k; });
  }
  const src = d.source ? H.source(root, d.source) : null;
  ctx.cue(.15, 'swoosh', .3); hlT.forEach(x => ctx.cue(x, 'tick', .3));
  if (hlT.length) ctx.focus(hlT[0] - .3, { x: PX, y: Y, w: PW, h: 400 }, { z: 1.035, k: .2, d: 1.3 }); if (ST.length) ctx.focus(ST[0] - .3, { x: PX + PW + 32, y: Y, w: 1744 - PW - 32, h: 500 }, { z: 1.035, k: .2, d: 1.3 });
  return t => {
    enter(c, t, .1, { dy: 60, rx: 8 });
    hls.forEach((e, i) => H.hl(e, E.io(P(t, hlT[i], hlT[i] + .6))));
    if (side) enter(side, t, .3, { dy: 50 });
    rows.forEach((r, i) => {
      if (d.side) { set(r, { o: A(t, ST[i], .3), y: 14 * (1 - SP(t, ST[i], .7)) }); }
      else { enter(r, t, ST[i] - .2, { dy: 40 }); H.count(r.v, 0, parseFloat(r.s.value), E.out(P(t, ST[i], ST[i] + 1)), r.s.dec || 0, r.s.suffix || ''); }
    });
    if (src) set(src, { o: A(t, .6, .4) });
  };
};
