// rules — a numbered rule file. Each rule lights up when it is spoken; earlier ones stay, later ones wait dimmed.
// data: { file: "house-style · SKILL.md", tag?: "SHARED BY ALL BOTS", items: [{ text, sub?, code?, at? }] }
ARCH.rules = (root, ctx, H, d) => {
  const { set, enter, A, SP, E, lerp, D } = H;
  const items = d.items || [], T = H.times(ctx, items, .12, .8), HH = Math.min(612, 130 + items.length * 120), Y = H.vc(HH);
  const c = H.put(root, H.card({ w: 1744, h: HH }), 88, Y);
  D(c, 36, 28, 1300, 44, 'display:flex;align-items:center;gap:16px;font:800 30px var(--fm);white-space:nowrap', `${H.esc(d.file || 'rules.md')}${d.tag ? H.tag(d.tag, 'var(--accent)') : ''}`);
  D(c, 36, 92, 1672, 2, 'background:var(--line)');
  const RH = Math.min(120, (HH - 120) / items.length);
  const rows = items.map((it, i) => {
    const r = D(c, 24, 110 + i * RH, 1696, RH - 10, 'border-radius:16px;display:flex;align-items:center;gap:26px;padding:0 24px');
    r.innerHTML = `<span style="flex:none;font:800 30px var(--fm);color:var(--accent);width:52px">${String(i + 1).padStart(2, '0')}</span><div style="flex:1;min-width:0"><div style="font:var(--fwd) 34px/1.15 var(--fd);letter-spacing:calc(-.02em * var(--trk));white-space:nowrap">${H.md(it.text)}</div>${it.sub ? `<div style="font:600 23px var(--fb);color:var(--sub);margin-top:4px;white-space:nowrap">${H.md(it.sub)}</div>` : ''}</div>${it.code ? `<span style="flex:none;font:600 22px var(--fm);color:var(--accent);background:color-mix(in srgb,var(--accent) 10%,transparent);border-radius:10px;padding:8px 14px;white-space:nowrap">${H.esc(it.code)}</span>` : ''}`;
    return r;
  });
  T.forEach(x => ctx.cue(x, 'tick', .4));
  T.forEach((x, i) => ctx.focus(x - .25, { x: 88, y: Y + 110 + i * RH, w: 1744, h: RH }, { z: 1.03, k: .22, d: 1.1 })); if (items.length > 1) ctx.reset(T.at(-1) + 1.6, 1.3);
  return t => {
    enter(c, t, .1, { dy: 50 });
    let cur = -1; T.forEach((x, i) => { if (t >= x - .1) cur = i; });
    rows.forEach((r, i) => {
      const k = A(t, T[i] - .1, .3, E.quart);
      set(r, { o: lerp(.3, 1, k), x: 18 * (1 - SP(t, T[i] - .1, .7)) * (k > 0 ? 1 : 0) });
      r.style.background = i === cur ? 'color-mix(in srgb,var(--accent) 9%,transparent)' : 'transparent';
      r.style.boxShadow = i === cur ? 'inset 0 0 0 2px color-mix(in srgb,var(--accent) 40%,transparent)' : 'none';
    });
  };
};
