// grid — a storyboard / shot list / gallery of tiles that pop in on their beat, with an optional approve bar.
// data: { cols?: 4, items: [{ label: "Pill idle", glyph?: "pill"|"dot"|"spinner"|"check"|"play"|"bar"|"done"|"text:Aa", image?, at? }],
//         footer?: { text: "Nothing gets built until you approve it", button?: "Approve", at? } }
ARCH.grid = (root, ctx, H, d) => {
  const { set, enter, A, SP, E, P, lerp, D, IC } = H;
  const it = d.items || [], cols = d.cols || Math.min(4, it.length), rowsN = Math.ceil(it.length / cols);
  const T = H.times(ctx, it, .1, .7), Y = 250, FH = d.footer ? 96 : 0, GH = 612 - FH - (FH ? 24 : 0), GAP = 24;
  const TW = (1744 - GAP * (cols - 1)) / cols, TH = (GH - GAP * (rowsN - 1)) / rowsN;
  const tiles = it.map((x, i) => {
    const c = H.put(root, H.card({ w: TW, h: TH }), 88 + (i % cols) * (TW + GAP), Y + Math.floor(i / cols) * (TH + GAP));
    const stage = D(c, 16, 16, TW - 32, TH - 80, 'border-radius:14px;background:var(--fill);overflow:hidden;display:flex;align-items:center;justify-content:center');
    let g = null; const gl = x.glyph || 'dot';
    if (x.image) { const im = H.img(x.image); im.style.cssText = 'width:100%;height:100%;object-fit:cover'; stage.appendChild(im); }
    else if (gl.startsWith('text:')) { g = stage.appendChild(H.h('div', '', H.esc(gl.slice(5)))); g.style.cssText = 'font:var(--fwd) 64px var(--fd)'; }
    else {
      const G = { pill: '<div style="width:150px;height:56px;border-radius:28px;background:var(--inv)"></div>', dot: '<div style="width:64px;height:64px;border-radius:50%;background:var(--inv)"></div>',
        spinner: '<div class="sp" style="width:70px;height:70px;border-radius:50%;border:7px solid var(--track);border-top-color:var(--ink)"></div>', check: `<div style="width:76px;height:76px">${IC.check()}</div>`,
        play: '<div style="width:96px;height:72px;border-radius:16px;background:var(--inv);display:flex;align-items:center;justify-content:center"><div style="width:0;height:0;border-left:26px solid #fff;border-top:16px solid transparent;border-bottom:16px solid transparent;margin-left:6px"></div></div>',
        bar: '<div style="width:70%;height:16px;border-radius:8px;background:var(--track);overflow:hidden"><i class="bf" style="display:block;height:100%;width:30%;background:var(--accent)"></i></div>',
        done: '<div style="padding:16px 34px;border-radius:999px;background:var(--inv);color:var(--inv-ink);font:var(--fwd) 30px var(--fd)">Done</div>' };
      stage.innerHTML = G[gl] || G.dot; g = stage.firstChild;
    }
    D(c, 20, TH - 54, TW - 40, 36, 'display:flex;align-items:center;gap:12px;font:700 25px var(--fb);white-space:nowrap', `<span style="font:800 20px var(--fm);background:var(--inv);color:var(--inv-ink);border-radius:7px;padding:3px 8px">${String(i + 1).padStart(2, '0')}</span>${H.md(x.label || '')}`);
    return { c, g, gl, x };
  });
  const F = d.footer; let fb = null, btn = null;
  if (F) {
    fb = H.put(root, H.card({ w: 1744, h: FH }), 88, Y + GH + 24);
    D(fb, 36, 0, 1300, FH, 'display:flex;align-items:center;font:700 30px var(--fb)', `<span>${H.md(F.text || '')}</span>`);
    if (F.button) btn = D(fb, 1744 - 36 - 220, FH / 2 - 30, 220, 60, 'border-radius:999px;background:var(--inv);color:var(--inv-ink);font:800 26px var(--fb);display:flex;align-items:center;justify-content:center', H.esc(F.button));
  }
  const tF = F ? H.when(ctx, F.at, T[T.length - 1] + .6) : 0;
  T.forEach(x => ctx.cue(x, 'pop', .3)); if (btn) ctx.cue(tF + .5, 'click', .5);
  ctx.cam(T[0], { x: 960, y: 560, z: 1.025, d: 2 }); if (F) ctx.focus(tF - .3, { x: 88, y: Y + GH + 24, w: 1744, h: FH }, { z: 1.04, k: .25, d: 1.2 });
  return t => {
    tiles.forEach(({ c, g, gl }, i) => {
      enter(c, t, T[i] - .2, { dy: 40, s0: .92 });
      if (!g) return; const lt = t - T[i];
      if (gl === 'spinner') g.style.transform = `rotate(${(lt * 360).toFixed(1)}deg)`;
      else if (gl === 'pill') g.style.transform = `scaleX(${(1 + .08 * Math.sin(lt * 3)).toFixed(3)})`;
      else if (gl === 'dot') g.style.transform = `scale(${(.85 + .15 * Math.sin(lt * 2.4)).toFixed(3)})`;
      else if (gl === 'bar') g.querySelector('.bf').style.width = (30 + 60 * (.5 + .5 * Math.sin(lt * 1.6))).toFixed(1) + '%';
    });
    if (fb) { enter(fb, t, tF - .2, { dy: 30 }); if (btn) { const pr = Math.max(0, 1 - Math.abs(t - tF - .5) / .12); set(btn, { s: 1 - .06 * pr }); btn.style.background = t > tF + .5 ? 'var(--good)' : 'var(--inv)'; btn.style.color = t > tF + .5 ? '#fff' : 'var(--inv-ink)'; btn.textContent = t > tF + .5 ? 'Approved ✓' : F.button; } }
  };
};
