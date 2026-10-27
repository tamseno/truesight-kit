// terminal — a checklist on the left ticks off while a real-looking terminal types on the right.
// data: { list?: { title, items: [{ text, sub?, at? }] }, term: { title: "/workspace/studio", cmd: "bash bootstrap.sh", at?,
//          out: [{ text: "✓ ffmpeg", cls?: "g"|"d"|"y"|"r"|"p", at? }], progress?: { label: "576 / 3,600 frames", at?, to? } } }
ARCH.terminal = (root, ctx, H, d) => {
  const { set, enter, A, SP, E, P, lerp, D, IC } = H;
  const L = d.list, TM = d.term || {}, Y = 250, HH = 612;
  const LW = L ? 620 : 0, TX = L ? 88 + LW + 32 : 240, TW = L ? 1744 - LW - 32 : 1440;
  let rows = [], LT = [];
  if (L) {
    const c = H.put(root, H.card({ w: LW, h: HH }), 88, Y); L.c = c;
    D(c, 32, 28, LW - 64, 44, 'font:var(--fwd) 32px var(--fd);letter-spacing:calc(-.02em * var(--trk));white-space:nowrap', H.md(L.title || ''));
    LT = H.times(ctx, L.items, .15, .8);
    const RH = Math.min(118, (HH - 100) / L.items.length);
    rows = L.items.map((it, i) => {
      const r = D(c, 24, 92 + i * RH, LW - 48, RH - 12, 'border-radius:16px;background:var(--fill);display:flex;align-items:center;gap:18px;padding:0 20px');
      r.innerHTML = `<div style="flex:1;min-width:0"><div style="font:700 28px/1.2 var(--fb);white-space:nowrap">${H.md(it.text)}</div>${it.sub ? `<div style="font:600 22px var(--fb);color:var(--sub);margin-top:2px;white-space:nowrap">${H.md(it.sub)}</div>` : ''}</div>`;
      const ck = r.appendChild(H.h('span', 'icon', IC.check())); ck.style.cssText += ';width:40px;height:40px;flex:none';
      return { r, ck };
    });
  }
  const w = H.put(root, H.win({ title: TM.title || 'terminal', dark: true, w: TW, h: HH }), TX, Y);
  const term = D(w.body, 28, 22, TW - 56, HH - 120, 'position:absolute;font:500 26px/1.62 var(--fm);color:var(--code-ink);white-space:pre');
  const tCmd = H.when(ctx, TM.at, .5);
  const out = TM.out || [], OT = H.times(ctx, out, .3, .85).map((x, i) => Math.max(x, tCmd + .6 + i * .15));
  let bar = null, barF, barL; const PG = TM.progress;
  if (PG) {
    bar = D(w.body, 28, HH - 130, TW - 56, 56, 'position:absolute;display:flex;align-items:center;gap:18px');
    bar.innerHTML = `<div style="flex:1;height:14px;border-radius:7px;background:rgba(255,255,255,.08);overflow:hidden"><i style="display:block;height:100%;width:0;border-radius:7px;background:linear-gradient(90deg,#5a5cf0,#8b8df8)"></i></div><span class="mono" style="font:700 24px var(--fm);color:#ffd66b;white-space:nowrap"></span>`;
    barF = bar.querySelector('i'); barL = bar.querySelector('span');
  }
  const tP0 = PG ? H.when(ctx, PG.at, OT[OT.length - 1] || tCmd + 1) : 0, tP1 = PG ? H.when(ctx, PG.to, ctx.dur - .4) : 0;
  LT.forEach(x => ctx.cue(x, 'tick', .4)); OT.forEach(x => ctx.cue(x, 'click', .25)); if (TM.cmd) ctx.cue(tCmd, 'type', .35);
  ctx.focus(tCmd - .2, { x: TX, y: Y, w: TW, h: HH * .6 }, { z: 1.035, k: .25, d: 1.4 }); if (L) LT.forEach((x, i) => ctx.focus(x - .3, { x: 88, y: Y + 92 + i * Math.min(118, (HH - 100) / L.items.length), w: LW, h: 100 }, { z: 1.03, k: .14, d: 1.1 }));
  const esc = H.esc;
  return t => {
    if (L) enter(L.c, t, .1, { dy: 50 });
    rows.forEach(({ r, ck }, i) => { set(r, { o: lerp(.45, 1, A(t, LT[i] - .1, .3)) }); H.pop(ck, t, LT[i] + .1, { r: -40 }); });
    enter(w, t, .2, { dy: 50 });
    // type the command, then reveal output lines at their times
    const n = Math.max(0, Math.floor((t - tCmd) * 34)), cmd = [...(TM.cmd || '')].slice(0, n).join(''), typing = n < [...(TM.cmd || '')].length;
    let html = `<span class="p">$</span> ${esc(cmd)}${typing && t >= tCmd ? '<span class="caret"></span>' : ''}`;
    out.forEach((o, i) => { if (t >= OT[i]) html += `\n<span class="${o.cls || ''}">${esc(o.text)}</span>`; });
    if (!typing && (t * 2.2 | 0) % 2 === 0 && (!out.length || t >= OT[OT.length - 1])) html += `\n<span class="p">$</span> <span class="caret"></span>`;
    term.innerHTML = html; term.className = 'term'; term.style.fontSize = '26px';
    if (bar) { const k = E.io(P(t, tP0, tP1)); barF.style.width = (k * 100).toFixed(1) + '%'; set(bar, { o: A(t, tP0 - .2, .3) }); barL.textContent = PG.label ? PG.label.replace(/\{(\d[\d,]*)\}/g, (_, v) => Math.round(k * +v.replace(/,/g, '')).toLocaleString('en-US')) : Math.round(k * 100) + '%'; }
  };
};
