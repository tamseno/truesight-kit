// chat — an agent-app conversation. Sidebar of bots, a thread where each message lands on its word (bots "type" first),
// tool-run rows (spinner → check), skill chips, proof thumbnails, an approval card, a summary report. The thread scrolls itself.
// data: { bot: "quill", sidebar?: ["quill", "jenny"], status?: "Working · cloud computer", composer?: "Message Quill…", app?: "Grok Bot",
//   messages: [ { from: "you" | "<cast key>", text?, at?, time?: "07:58", typing?: true,
//                 chips?: ["/react-native-best-practices"], tool?: { text: "Started Cursor cloud agent", detail?: "fix/…", icon?: "bolt", doneAt?, done?: "Agent finished" },
//                 shots?: [{ label: "Before", bad?: true, title? }], approval?: { title, sub?, button?: "Approve", at? },
//                 report?: [{ k: "PRs ready", v: "14", tone?: "good"|"bad" }] } ] }
ARCH.chat = (root, ctx, H, d, sc) => {
  const { h, set, A, SP, E, P, lerp, D, IC } = H;
  const full = !sc.title, AR = H.AREA(sc), WX = AR.x, WY = AR.y, WW = AR.w, WH = AR.h, NARROW = H.W < 1400;
  const me = d.bot || H.BOT_ORDER[0];
  const wnd = H.put(root, H.card({ w: WW, h: WH }), WX, WY); wnd.style.borderRadius = '26px';
  // sidebar
  const SW = NARROW ? 0 : 340, side = D(wnd, 0, 0, SW, WH, 'background:var(--code-bg);color:#fff'); if (NARROW) side.style.display = 'none';
  D(side, 28, 28, SW - 56, 40, 'display:flex;align-items:center;gap:12px;font:800 25px var(--fb);white-space:nowrap', `${H.grok(34).innerHTML}<span>${H.esc(d.app || 'Grok Bot')}</span>`);
  D(side, 28, 92, SW - 56, 26, 'font:800 20px var(--fb);letter-spacing:.14em;color:rgba(255,255,255,.4)', 'BOTS');
  const sb = (d.sidebar || H.BOT_ORDER.slice(0, 6)).map((k, i) => {
    const r = D(side, 14, 128 + i * 74, SW - 28, 64, `border-radius:16px;display:flex;align-items:center;gap:14px;padding:0 14px;${k === me ? 'background:rgba(255,255,255,.09)' : ''}`);
    const av = H.avatar(k, 42); r.appendChild(av.el);
    r.insertAdjacentHTML('beforeend', `<div style="min-width:0"><div style="font:700 23px var(--fb);white-space:nowrap">${H.esc(H.nameOf(k))}</div>${H.BOTS[k] && H.BOTS[k].role ? `<div style="font:600 20px var(--fb);color:rgba(255,255,255,.45);white-space:nowrap">${H.esc(H.BOTS[k].role)}</div>` : ''}</div>`);
    return { r, av, k };
  });
  // main pane
  const MX = SW, MW = WW - SW;
  const top = D(wnd, MX, 0, MW, 86, 'border-bottom:1px solid var(--line);display:flex;align-items:center;gap:16px;padding:0 30px');
  const tav = H.avatar(me, 50); top.appendChild(tav.el);
  top.insertAdjacentHTML('beforeend', `<div><div style="font:800 27px var(--fb);white-space:nowrap">${H.esc(H.nameOf(me))}</div><div style="display:flex;align-items:center;gap:8px;font:600 21px var(--fb);color:var(--sub);white-space:nowrap"><i style="width:9px;height:9px;border-radius:50%;background:var(--good);display:inline-block"></i>${H.esc(d.status || 'Working · cloud computer')}</div></div>`);
  const CH = 104, VH = WH - 86 - CH; // visible thread height
  const view = D(wnd, MX, 86, MW, VH, 'overflow:hidden;-webkit-mask-image:linear-gradient(180deg,transparent 0,#000 34px,#000 100%);mask-image:linear-gradient(180deg,transparent 0,#000 34px,#000 100%)');
  const list = D(view, 0, 0, MW, 10);
  const comp = D(wnd, MX + 28, WH - CH + 18, MW - 56, 68, 'border-radius:18px;background:var(--fill);box-shadow:inset 0 0 0 1px var(--line);display:flex;align-items:center;gap:14px;padding:0 22px;font:600 23px var(--fb);color:var(--sub);white-space:nowrap',
    `<span style="font:700 22px var(--fm);color:var(--sub);background:var(--surface);border-radius:8px;padding:2px 9px;box-shadow:0 0 0 1px var(--line)">/</span><span style="font:700 22px var(--fm);color:var(--sub);background:var(--surface);border-radius:8px;padding:2px 9px;box-shadow:0 0 0 1px var(--line)">@</span><span>${H.esc(d.composer || `Message ${H.nameOf(me)}…`)}</span>`);
  // messages
  const msgs = d.messages || [], T = H.times(ctx, msgs, .04, .84);
  const PAD = NARROW ? 22 : 30, GAP = 22, BW = Math.min(900, MW - (NARROW ? 90 : 200));
  let y = 26;
  const rows = msgs.map((m, i) => {
    const you = !m.from || m.from === 'you' || m.from === 'user';
    const r = D(list, PAD, y, MW - PAD * 2, null, `display:flex;gap:16px;${you ? 'flex-direction:row-reverse' : ''}`);
    r.style.height = 'auto';
    let av = null;
    if (!you) { av = H.avatar(m.from, 52); r.appendChild(av.el); }
    const col = r.appendChild(h('div', '')); col.style.cssText = `display:flex;flex-direction:column;gap:12px;${you ? 'align-items:flex-end' : 'align-items:flex-start'};max-width:${BW}px`;
    if (!you) col.insertAdjacentHTML('beforeend', `<div style="font:700 21px var(--fb);color:var(--ink);display:flex;gap:10px;align-items:baseline;white-space:nowrap">${H.esc(H.nameOf(m.from))}<span style="font:600 20px var(--fm);color:var(--sub)">${H.esc(m.time || '')}</span></div>`);
    const parts = {};
    if (m.text) parts.text = col.appendChild(h('div', '', H.md(m.text))), parts.text.style.cssText = `font:600 28px/1.38 var(--fb);letter-spacing:calc(-.01em * var(--trk));padding:16px 24px;border-radius:24px;${you ? 'background:var(--inv);color:var(--inv-ink);border-bottom-right-radius:8px' : 'background:var(--fill);color:var(--ink);border-top-left-radius:8px'}`;
    if (m.chips) { const c = col.appendChild(h('div', '')); c.style.cssText = 'display:flex;flex-wrap:wrap;gap:10px'; c.innerHTML = m.chips.map(x => `<span style="font:700 21px var(--fm);color:var(--accent);background:color-mix(in srgb,var(--accent) 12%,transparent);border-radius:10px;padding:6px 12px;white-space:nowrap">${H.esc(x)}</span>`).join(''); parts.chips = c; }
    if (m.tool) {
      const tl = col.appendChild(h('div', '')); tl.style.cssText = 'display:flex;align-items:center;gap:16px;padding:14px 22px 14px 16px;border-radius:18px;background:var(--surface);box-shadow:0 0 0 1.5px var(--line),0 10px 24px -14px rgba(30,34,80,.3)';
      tl.innerHTML = `<span class="ti" style="position:relative;width:40px;height:40px;flex:none"><span class="sp" style="position:absolute;inset:3px;border-radius:50%;border:4px solid var(--track);border-top-color:var(--accent)"></span><span class="ok" style="position:absolute;inset:0;opacity:0">${IC.check()}</span></span><div style="min-width:0"><div class="tt" style="font:700 24px var(--fb);white-space:nowrap">${H.md(m.tool.text)}</div>${m.tool.detail ? `<div style="font:600 21px var(--fm);color:var(--sub);white-space:nowrap">${H.esc(m.tool.detail)}</div>` : ''}</div>`;
      parts.tool = tl;
    }
    if (m.shots) { const s = col.appendChild(h('div', '')); s.style.cssText = 'display:flex;gap:18px'; m.shots.forEach(x => { const w = s.appendChild(h('div', '')); w.style.cssText = 'display:flex;flex-direction:column;align-items:center;gap:8px'; const box = w.appendChild(h('div', '')); box.style.cssText = 'position:relative;width:150px;height:290px'; const ph = H.phone({ w: 300, h: 580, title: x.title || 'Welcome', bad: x.bad }); ph.style.cssText += ';position:absolute;left:0;top:0;transform:scale(.5);transform-origin:0 0'; box.appendChild(ph); w.insertAdjacentHTML('beforeend', `<span style="font:700 20px var(--fb);color:${x.bad ? '#f0443a' : '#13a463'}">${H.esc(x.label || '')}</span>`); }); parts.shots = s; }
    if (m.approval) {
      const ap = col.appendChild(h('div', '')); ap.style.cssText = 'width:640px;padding:22px 24px;border-radius:20px;background:var(--surface);box-shadow:0 0 0 2px rgba(245,165,36,.5),0 14px 30px -16px rgba(30,34,80,.35)';
      ap.innerHTML = `<div style="display:flex;align-items:center;gap:12px;font:800 20px var(--fb);letter-spacing:.12em;color:#c27c0e">${IC.warn().replace('width="100%" height="100%"', 'width="24" height="24"')}NEEDS YOUR APPROVAL</div><div style="font:var(--fwd) 28px/1.25 var(--fd);margin-top:10px">${H.md(m.approval.title)}</div>${m.approval.sub ? `<div style="font:600 22px var(--fb);color:var(--sub);margin-top:4px">${H.md(m.approval.sub)}</div>` : ''}<div style="display:flex;gap:12px;margin-top:18px"><span style="height:52px;padding:0 24px;border-radius:14px;background:var(--fill);font:800 22px var(--fb);display:flex;align-items:center">Deny</span><span class="ab" style="height:52px;padding:0 26px;border-radius:14px;background:var(--inv);color:var(--inv-ink);font:800 22px var(--fb);display:flex;align-items:center">${H.esc(m.approval.button || 'Approve')}</span></div>`;
      parts.approval = ap;
    }
    if (m.report) {
      const rp = col.appendChild(h('div', '')); rp.style.cssText = `display:grid;grid-template-columns:repeat(${m.report.length},1fr);gap:14px;width:${Math.min(BW, m.report.length * 230)}px`;
      rp.innerHTML = m.report.map(x => `<div style="padding:18px 20px;border-radius:18px;background:${x.tone === 'bad' ? 'var(--bad-fill)' : x.tone === 'good' ? 'var(--good-fill)' : 'var(--fill)'}"><div class="rv" data-v="${H.esc(x.v)}" style="font:var(--fwd) 54px/1 var(--fd);letter-spacing:calc(-.03em * var(--trk));color:${x.tone === 'bad' ? 'var(--bad-ink)' : x.tone === 'good' ? 'var(--good-ink)' : 'var(--ink)'}">${H.esc(x.v)}</div><div style="font:700 21px/1.2 var(--fb);color:var(--sub);margin-top:8px">${H.esc(x.k)}</div></div>`).join('');
      parts.report = rp;
    }
    const hh = r.offsetHeight; const row = { r, av, you, m, parts, y, hh, t: T[i], typing: !you && m.typing !== false && !!(m.text || m.report) };
    y += hh + GAP; return row;
  });
  // typing bubbles + scroll targets
  rows.forEach(rw => {
    if (!rw.typing) return;
    const tb = D(list, PAD + 68, rw.y + 34, 104, 54, 'border-radius:24px;border-top-left-radius:8px;background:var(--fill);display:flex;align-items:center;justify-content:center;gap:9px', '<i></i><i></i><i></i>');
    [...tb.children].forEach(i => { i.style.cssText = 'width:12px;height:12px;border-radius:50%;background:var(--track);display:block'; }); rw.tb = tb;
    const tav = H.avatar(rw.m.from, 52); const tw = D(list, PAD, rw.y, 52, 52); tw.appendChild(tav.el); rw.tav = tw;
  });
  const appearT = rw => rw.typing ? rw.t - .85 : rw.t;
  const scrollAt = rows.map(rw => ({ t: appearT(rw), s: Math.max(0, rw.y + rw.hh + 24 - VH) }));
  const toolDone = rows.map(rw => rw.m.tool ? H.when(ctx, rw.m.tool.doneAt, rw.t + 1.4) : 1e9);
  const apT = rows.map(rw => rw.m.approval ? H.when(ctx, rw.m.approval.at, rw.t + 1.6) : 1e9);
  rows.forEach((rw, i) => {
    ctx.cue(rw.t, rw.you ? 'swish' : 'notify', rw.you ? .45 : .4);
    if (rw.m.tool) ctx.cue(toolDone[i], 'tick', .5);
    if (rw.m.approval) ctx.cue(apT[i], 'click', .6);
    if (rw.m.report) ctx.cue(rw.t + .3, 'pop', .3);
  });
  // camera: settle in on the thread, then lean toward the newest message as the thread fills
  ctx.cam(.1, { x: 960, y: 540, z: 1, d: .1 });
  rows.forEach((rw, i) => { if (i > 0 && (rw.m.report || rw.m.approval || rw.m.shots)) ctx.focus(rw.t - .2, { x: WX + MX + PAD, y: WY + 86 + Math.min(VH - rw.hh, rw.y), w: BW, h: rw.hh }, { z: 1.045, k: .3, d: 1.2 }); });
  if (full && !NARROW) ctx.cam(T[0], { x: H.W / 2 + 70, y: H.H / 2 + 20, z: 1.035, d: 2.4 });
  return t => {
    enter(wnd, t, .05, { dy: 46, rx: 6 });
    tav.update(t); sb.forEach(({ av, k }) => av.update(t, { bob: k === me ? 2.6 : 1.4 }));
    let sc_ = 0; scrollAt.forEach(s => { sc_ = lerp(sc_, Math.max(sc_, s.s), E.out(P(t, s.t, s.t + .7))); });
    set(list, { y: -sc_ });
    rows.forEach((rw, i) => {
      const k = SP(t, rw.t, .8);
      set(rw.r, { y: 22 * (1 - k), x: rw.you ? 26 * (1 - k) : 0, o: A(t, rw.t, .22) });
      if (rw.av) rw.av.update(t);
      if (rw.tb) { const on = t >= rw.t - .85 && t < rw.t; set(rw.tb, { o: on ? A(t, rw.t - .85, .2) : 0 }); set(rw.tav, { o: on ? A(t, rw.t - .85, .2) : 0 }); [...rw.tb.children].forEach((d_, j) => { d_.style.transform = `translateY(${(-5 * Math.max(0, Math.sin(t * 9 - j * .8))).toFixed(2)}px)`; }); }
      const P_ = rw.parts;
      if (P_.chips) [...P_.chips.children].forEach((c, j) => H.pop(c, t, rw.t + .25 + j * .12, { s0: .7 }));
      if (P_.tool) {
        const done = t >= toolDone[i], sp = P_.tool.querySelector('.sp'), ok = P_.tool.querySelector('.ok');
        sp.style.transform = `rotate(${(t * 400).toFixed(1)}deg)`; sp.style.opacity = done ? 0 : 1; H.pop(ok, t, toolDone[i], { s0: .3, r: -30 });
        if (done && rw.m.tool.done) { const tt = P_.tool.querySelector('.tt'); if (tt.dataset.d !== '1') { tt.innerHTML = H.md(rw.m.tool.done); tt.dataset.d = '1'; } }
        P_.tool.style.boxShadow = done ? '0 0 0 2px rgba(31,191,117,.45),0 10px 24px -14px rgba(30,34,80,.3)' : '0 0 0 1.5px var(--line),0 10px 24px -14px rgba(30,34,80,.3)';
      }
      if (P_.shots) [...P_.shots.children].forEach((c, j) => H.pop(c, t, rw.t + .15 + j * .2, { s0: .8, dy: 16 }));
      if (P_.approval) { const ab = P_.approval.querySelector('.ab'), pr = Math.max(0, 1 - Math.abs(t - apT[i]) / .12); set(ab, { s: 1 - .07 * pr }); const okd = t >= apT[i]; ab.style.background = okd ? 'var(--good)' : 'var(--inv)'; ab.style.color = okd ? '#fff' : 'var(--inv-ink)'; ab.textContent = okd ? 'Approved ✓' : (rw.m.approval.button || 'Approve'); }
      if (P_.report) P_.report.querySelectorAll('.rv').forEach((v, j) => { const raw = v.dataset.v, num = parseFloat(raw.replace(/[^\d.]/g, '')), kk = E.out(P(t, rw.t + .2 + j * .12, rw.t + 1.2 + j * .12)); v.textContent = isNaN(num) ? raw : raw.replace(/[\d.]+/, String(Math.round(num * kk))); });
    });
  };
  function enter(el, t, s, o) { return H.enter(el, t, s, o); }
};
ARCH.chat.formats = ['*'];
