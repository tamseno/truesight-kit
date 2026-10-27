// rules — a numbered rule file. Each rule lights up when it is spoken; earlier ones stay, later ones wait dimmed.
// data: { file: "house-style · SKILL.md", tag?: "SHARED BY ALL BOTS", items: [{ text, sub?, code?, at? }] }
ARCH.rules = (root, ctx, H, d) => {
  const { set, enter, A, SP, E, lerp, D } = H;
  const items = d.items || [], T = H.times(ctx, items, .12, .8), HH = Math.min(612, 130 + items.length * 120), Y = H.vc(HH);
  const c = H.put(root, H.card({ w: 1744, h: HH }), 88, Y);
  D(c, 36, 28, 1300, 44, 'display:flex;align-items:center;gap:16px;font:800 30px Maple;white-space:nowrap', `${H.esc(d.file || 'rules.md')}${d.tag ? H.tag(d.tag, '#8b5cf6') : ''}`);
  D(c, 36, 92, 1672, 2, 'background:rgba(21,22,28,.07)');
  const RH = Math.min(120, (HH - 120) / items.length);
  const rows = items.map((it, i) => {
    const r = D(c, 24, 110 + i * RH, 1696, RH - 10, 'border-radius:16px;display:flex;align-items:center;gap:26px;padding:0 24px');
    r.innerHTML = `<span style="flex:none;font:800 30px Maple;color:#8b5cf6;width:52px">${String(i + 1).padStart(2, '0')}</span><div style="flex:1;min-width:0"><div style="font:800 34px/1.15 Geist,Noto;letter-spacing:-.02em;white-space:nowrap">${H.md(it.text)}</div>${it.sub ? `<div style="font:600 23px Geist,Noto;color:#8a8d99;margin-top:4px;white-space:nowrap">${H.md(it.sub)}</div>` : ''}</div>${it.code ? `<span style="flex:none;font:600 22px Maple;color:#5a5cf0;background:#f0f1fe;border-radius:10px;padding:8px 14px;white-space:nowrap">${H.esc(it.code)}</span>` : ''}`;
    return r;
  });
  T.forEach(x => ctx.cue(x, 'tick', .4));
  return t => {
    enter(c, t, .1, { dy: 50 });
    let cur = -1; T.forEach((x, i) => { if (t >= x - .1) cur = i; });
    rows.forEach((r, i) => {
      const k = A(t, T[i] - .1, .3, E.quart);
      set(r, { o: lerp(.3, 1, k), x: 18 * (1 - SP(t, T[i] - .1, .7)) * (k > 0 ? 1 : 0) });
      r.style.background = i === cur ? 'rgba(139,92,246,.08)' : 'transparent';
      r.style.boxShadow = i === cur ? 'inset 0 0 0 2px rgba(139,92,246,.35)' : 'none';
    });
  };
};
