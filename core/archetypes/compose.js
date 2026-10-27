// compose — a free scene assembled from the element, motion and layout libraries. This is the default way to build
// a scene that doesn't match a recipe archetype: every video gets its own pictures.
// data: {
//   layout?: "split" | { type: "grid", cols: 3, rows: 2 },        (slots; see LAYOUTS in docs/CATALOG.md)
//   els: [ { id?, el: "card", slot?: "left" | 0, box?: [x, y, w, h], x?, y?, w?, h?, z?,   (placement: slot, box, or x/y/w/h)
//            ...props of the element (text, style, title, ...),
//            in?: "rise@phrase" | { m, at, off, d, ...params } | "none",   (default: a fitting entrance, spread over the narration)
//            do?: ["pulse@phrase", "glow@phrase+0.4", { m: "move", at: "x", to: [x, y] }],
//            out?: "sink@phrase", loop?: "float" | ["float", "shimmer"],
//            kids?: [...elements], layout?: ...   (el: "group" lays its kids out inside its box) } ],
//   beats?: [ { at, cam: { focus: "id", z: 1.06, k: .35 } | "reset" | { x, y, z } },
//             { at, focus: "id" | ["id", ...] | "all" },          (others dim back — depth of field)
//             { at, do: { id: "pulse", other: "shake" } } ],
//   autocam?: true    (gentle push toward each element as it enters), showSlots?: true (draw the layout's slots, for planning) }
ARCH.compose = (root, ctx, H, d, sc) => {
  const area = d.area ? { x: d.area[0], y: d.area[1], w: d.area[2], h: d.area[3] } : sc.title ? { x: 88, y: 240, w: 1744, h: 632 } : { x: 88, y: 110, w: 1744, h: 800 };
  const RES = new Set(['id', 'el', 'slot', 'box', 'x', 'y', 'w', 'h', 'z', 'in', 'do', 'out', 'loop', 'kids', 'layout', 'sfx', 'css', 'pad', 'p']);
  const SMALL = new Set(['icon', 'tag', 'check', 'avatar', 'glyph', 'stamp', 'kbd', 'spinner', 'logo']);
  const items = [], byId = {};
  const W = msg => H.WARN.push({ scene: sc.id, kind: 'compose', what: msg });
  // default entrance per element type
  const defIn = e => e.el === 'stamp' ? 'stamp' : SMALL.has(e.el) ? 'pop' : e.el === 'text' && /^(display|title|huge|quote)$/.test(e.style || 'title') ? 'words' : e.el === 'arrow' || e.el === 'cursor' ? 'fade' : e.el === 'list' || e.el === 'tree' || e.el === 'table' ? 'cascade' : e.el === 'divider' ? 'grow' : 'rise';
  const sfxOf = (e, m) => e.sfx === false ? null : e.sfx || (m === 'stamp' ? 'impact' : e.el === 'bubble' ? 'notify' : m === 'words' || m === 'chars' ? 'swoosh' : m === 'type' ? 'type' : m === 'cascade' ? 'tick' : SMALL.has(e.el) ? 'pop' : m === 'none' || m === 'fade' ? null : 'swish');
  const n0 = ctx.lines[0] ? ctx.lines[0].s : .3, n1 = ctx.lines.length ? ctx.lines.at(-1).e : ctx.dur;
  let autoI = 0; const all = []; (function count(list) { list.forEach(e => { all.push(e); if (e.kids) count(e.kids); }); })(d.els || []);
  const autoN = all.filter(e => !e.in && e.el !== 'group').length;
  const autoT = () => H.lerp(n0 + .05, n0 + (n1 - n0) * .55, autoN > 1 ? autoI++ / (autoN - 1) : 0);
  function rectOf(e, slots, box) {
    if (Array.isArray(e.box)) return { x: e.box[0], y: e.box[1], w: e.box[2], h: e.box[3] };
    let r = null;
    if (e.slot != null) { r = typeof e.slot === 'number' ? slots.list[e.slot] : slots[e.slot]; if (!r) W(`slot "${e.slot}" not in layout`); }
    if (!r && e.x == null && e.y == null) r = box;
    r = r ? { ...r } : { x: 0, y: 0, w: 0, h: 0 };
    const def = (H.EL[e.el] && H.EL[e.el].size) || [400, 200];
    if (e.x != null) r.x = e.x; if (e.y != null) r.y = e.y;
    if (e.w != null) { if (e.x == null && r.w) r.x += (r.w - e.w) / 2; r.w = e.w; } else if (!r.w) r.w = def[0];
    if (e.h != null) { if (e.y == null && r.h) r.y += (r.h - e.h) / 2; r.h = e.h; } else if (!r.h) r.h = def[1];
    if (e.pad) { r.x += e.pad; r.y += e.pad; r.w -= 2 * e.pad; r.h -= 2 * e.pad; }
    return r;
  }
  function build(list, slots, box, parent) {
    for (const e of list) {
      if (e.el === 'arrow' || e.el === 'cursor') { items.push({ e, late: true, parent }); continue; }
      const r = e.el === 'source' && !e.box && e.slot == null && e.x == null ? { x: 88, y: 892, w: 1200, h: 44 } : rectOf(e, slots, box);
      const wrap = H.put(parent, H.h('div', 'cmp'), r.x - (parent === root ? 0 : parent.__x || 0), r.y - (parent === root ? 0 : parent.__y || 0), r.w, r.h); wrap.__x = r.x; wrap.__y = r.y;
      if (e.z != null) wrap.style.zIndex = e.z; if (e.css) wrap.style.cssText += ';' + e.css;
      const it = { e, r, wrap }; items.push(it); if (e.id) byId[e.id] = it;
      const inSpec = H.motionSpec(ctx, e.in === undefined ? defIn(e) : e.in, NaN); const tIn = inSpec && !Number.isNaN(inSpec.t) ? inSpec.t : (e.el === 'group' ? n0 : autoT()); if (inSpec) inSpec.t = tIn;
      it.tIn = tIn;
      if (e.el === 'group') {
        const sub = H.layout(e.layout || { type: 'row', n: (e.kids || []).length }, { x: r.x, y: r.y, w: r.w, h: r.h });
        build((e.kids || []).map((k, i) => (k.slot == null && !k.box && k.x == null ? { ...k, slot: i } : k)), sub, r, wrap);
        it.rig = H.rig(wrap, { x: r.x, y: r.y, scene: sc.id }); if (e.in) it.rig.add(inSpec);
      } else {
        const E_ = H.EL[e.el]; if (!E_) { W(`unknown element "${e.el}"`); continue; }
        const props = { ...(e.p || {}) }; for (const k in e) if (!RES.has(k)) props[k] = e[k];
        const api = { ctx, scene: sc, t0: tIn, box: { w: r.w, h: r.h }, when: (at, fb) => { const s = H.motionSpec(ctx, typeof at === 'number' || typeof at === 'string' ? { m: 'x', at } : null, fb); return s ? s.t : fb; } };
        let made; H.MB = { w: r.w, h: r.h }; try { made = E_.make(props, api); } catch (er) { W(`${e.el}: ${er.message}`); continue; }
        wrap.appendChild(made.el); wrap.__content = made.el; it.tick = made.tick;
        if (made.hug && made.hug < r.w) { const al = props.align || 'left', dx = al === 'center' ? (r.w - made.hug) / 2 : al === 'right' ? r.w - made.hug : 0; r.x += dx; r.w = made.hug; wrap.style.left = (parseFloat(wrap.style.left) + dx) + 'px'; wrap.style.width = made.hug + 'px'; wrap.__x = r.x; }
        it.rig = H.rig(wrap, { x: r.x, y: r.y, scene: sc.id });
        if (inSpec) it.rig.add(inSpec);
        const fx = sfxOf(e, inSpec && inSpec.m); if (fx && inSpec) ctx.cue(tIn, fx, .35);
      }
      for (const m of [].concat(e.do || [])) { const s = H.motionSpec(ctx, m, tIn + 1); if (s) it.rig.add(s); }
      if (e.out) { const s = H.motionSpec(ctx, e.out, ctx.dur - .4); if (s) it.rig.add(s); }
      for (const m of [].concat(e.loop || [])) { const s = H.motionSpec(ctx, typeof m === 'string' && !m.includes('@') ? { m, at: tIn + .6 } : m, tIn + .6); if (s) it.rig.add(s); }
    }
  }
  const slots = H.layout(d.layout || 'full', area);
  if (d.showSlots) Object.keys(slots).filter(k => k !== 'list').forEach(k => { const r = slots[k]; H.D(root, r.x, r.y, r.w, r.h, 'border-radius:18px;background:color-mix(in srgb,var(--accent) 12%,transparent);box-shadow:inset 0 0 0 2px color-mix(in srgb,var(--accent) 45%,transparent);display:flex;align-items:center;justify-content:center;font:700 30px var(--fm);color:var(--accent)', k); });
  build(d.els || [], slots, area, root);
  // late elements: arrows / cursors need the others' rects
  const anchor = (ref, other, side) => {
    if (Array.isArray(ref)) return ref; const it = byId[ref]; if (!it) { W(`arrow end "${ref}" not found`); return [960, 540]; }
    const r = it.r, cx = r.x + r.w / 2, cy = r.y + r.h / 2; let s = side;
    if (!s || s === 'auto') { const o = Array.isArray(other) ? other : byId[other] ? [byId[other].r.x + byId[other].r.w / 2, byId[other].r.y + byId[other].r.h / 2] : [960, 540]; const dx = o[0] - cx, dy = o[1] - cy; s = Math.abs(dx) / r.w > Math.abs(dy) / r.h ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'bottom' : 'top'); }
    const pad = 14; return s === 'right' ? [r.x + r.w + pad, cy] : s === 'left' ? [r.x - pad, cy] : s === 'top' ? [cx, r.y - pad] : [cx, r.y + r.h + pad];
  };
  items.filter(it => it.late).forEach(it => {
    const e = it.e, props = { ...(e.p || {}) }; for (const k in e) if (!RES.has(k)) props[k] = e[k];
    if (e.el === 'arrow') { props.__p1 = anchor(e.from, e.to, e.fromSide); props.__p2 = anchor(e.to, e.from, e.toSide); }
    const inSpec = H.motionSpec(ctx, e.in === undefined ? 'fade' : e.in, NaN); const tIn = inSpec && !Number.isNaN(inSpec.t) ? inSpec.t : autoT(); if (inSpec) inSpec.t = tIn;
    const wrap = H.put(it.parent, H.h('div', 'cmp'), 0, 0, 1920, 1080); wrap.style.pointerEvents = 'none'; if (e.z != null) wrap.style.zIndex = e.z;
    const made = H.EL[e.el].make(props, { ctx, scene: sc, t0: tIn, box: { w: 1920, h: 1080 }, when: (at, fb) => H.when(ctx, at, fb) });
    wrap.appendChild(made.el); wrap.__content = made.el; it.wrap = wrap; it.tick = made.tick; it.tIn = tIn; it.rig = H.rig(wrap, { scene: sc.id }); if (inSpec) it.rig.add(inSpec);
    for (const m of [].concat(e.do || [])) { const s = H.motionSpec(ctx, m, tIn + 1); if (s) it.rig.add(s); }
    if (e.out) { const s = H.motionSpec(ctx, e.out, ctx.dur - .4); if (s) it.rig.add(s); }
    if (e.el === 'arrow' && e.sfx !== false) ctx.cue(tIn, 'swish', .3);
    if (e.id) byId[e.id] = it;
  });
  // beats: camera, focus (depth of field), extra motions
  const focusKeys = []; // [{t, ids:Set|null}]
  for (const b of d.beats || []) {
    const t = H.motionSpec(ctx, { m: 'x', at: b.at, off: b.off || 0 }, 0).t;
    if (b.cam === 'reset') ctx.reset(t, b.d || 1.2);
    else if (b.cam && b.cam.focus) { const it = byId[b.cam.focus]; if (it) ctx.focus(t, it.r, { z: b.cam.z ?? 1.06, k: b.cam.k ?? .35, d: b.cam.d }); else W(`cam focus "${b.cam.focus}" not found`); }
    else if (b.cam) ctx.cam(t, { x: b.cam.x, y: b.cam.y, z: b.cam.z, d: b.cam.d });
    if (b.focus) focusKeys.push({ t, ids: b.focus === 'all' ? null : new Set([].concat(b.focus)) });
    if (b.do) for (const [id, m] of Object.entries(b.do)) { const it = byId[id]; if (!it) { W(`beat target "${id}" not found`); continue; } for (const mm of [].concat(m)) { const s = H.motionSpec(ctx, typeof mm === 'string' ? { m: mm.split('@')[0], at: t } : { ...mm, at: t }, t); if (s) it.rig.add(s); } }
    if (b.sfx) ctx.cue(t, b.sfx, .45);
  }
  focusKeys.sort((a, b) => a.t - b.t);
  if (focusKeys.length) items.forEach(it => { const id = it.e.id; if (!it.rig) return; it.rig.list.push({ m: { fn: (p, t) => { let v = 0; for (const k of focusKeys) { const e = H.E.quart(H.P(t, k.t, k.t + .35)); if (e <= 0) break; const target = k.ids && !(id && k.ids.has(id)) ? 1 : 0; v = H.lerp(v, target, e); } if (v > 0) { p.o *= H.lerp(1, .32, v); p.b += 1.8 * v; p.s *= H.lerp(1, .985, v); } } }, spec: { t: 0 } }); });
  if (d.autocam) items.filter(it => it.r && !it.late && it.e.el !== 'group' && it.r.w * it.r.h > 60000).forEach(it => ctx.focus(it.tIn - .2, it.r, { z: 1.03, k: .18, d: 1.2 }));
  const live = items.filter(it => it.rig);
  return t => { for (const it of live) { it.rig.update(t); if (it.tick) it.tick(t); } };
};
