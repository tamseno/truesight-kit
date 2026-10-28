// Elements, part 2 — for any topic, not just software: people, products, ratings, shares, rankings, milestones, a world map,
// funnels and KPI tiles. Same conventions as elements.js: make(p, api) lays out inside api.box, animates from api.t0
// (or its own "at"), text on the background carries .onbg so dark themes flip it.
(() => {
  const H = window.H, { esc, md, A, SP, E, P, lerp, cl, IC } = H, { def, div, fill, cardShell, TEXT, col } = H.ELK;
  const SERIES = ['var(--accent)', 'var(--accent2)', 'var(--warn)', 'var(--good)', 'color-mix(in srgb,var(--accent) 50%,var(--ink))', 'var(--bad)', 'color-mix(in srgb,var(--accent2) 55%,var(--ink))'];
  const sc = (x, i) => x && x.color ? col(x.color) : SERIES[i % SERIES.length];
  const initials = n => String(n || '?').split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase();
  let SID = 0;
  const star = (pct, s) => { const id = 'st' + (SID++); return `<svg viewBox="0 0 24 24" width="${s}" height="${s}"><defs><linearGradient id="${id}"><stop offset="${pct}%" stop-color="var(--warn)"/><stop offset="${pct}%" stop-color="color-mix(in srgb,currentColor 18%,transparent)"/></linearGradient></defs><path d="M12 2.6l2.8 5.8 6.4.9-4.6 4.5 1.1 6.3L12 17.1l-5.7 3 1.1-6.3L2.8 9.3l6.4-.9z" fill="url(#${id})"/></svg>`; };
  const fmtN = (v, dec = 0) => Number(v).toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec });

  // ---------------------------------------------------------------- people & products
  def('person', 'A person: photo (src) or initials, name, role, optional quote. Wide box = photo left; tall box = photo on top.', { name: 'string', role: 'string', src: 'photo path', quote: 'md', color: 'initials bg' }, [760, 220],
    (p, api) => {
      const wide = api.box.w > api.box.h * 1.6, ph = Math.round(Math.min(wide ? api.box.h - 48 : api.box.w * .45, 200));
      const c = cardShell(`padding:24px 28px;display:flex;${wide ? 'align-items:center' : 'flex-direction:column;align-items:center;text-align:center;justify-content:center'};gap:${wide ? 26 : 16}px`);
      const av = div(`flex:none;width:${ph}px;height:${ph}px;border-radius:50%;overflow:hidden;background:${p.color ? col(p.color) : 'var(--accent)'};display:flex;align-items:center;justify-content:center;color:${p.color ? '#fff' : 'var(--on-accent)'};font:var(--fwd) ${Math.round(ph * .38)}px var(--fd);box-shadow:0 0 0 4px var(--surface),0 0 0 6px color-mix(in srgb,var(--accent) 35%,transparent)`, p.src ? '' : esc(initials(p.name)));
      if (p.src) { const im = H.img(p.src); im.style.cssText = 'width:100%;height:100%;object-fit:cover'; av.appendChild(im); }
      const tx = div('min-width:0;display:flex;flex-direction:column;gap:6px', `<div style="font:var(--fwd) 40px/1.1 var(--fd);letter-spacing:calc(-.02em * var(--trk));white-space:nowrap">${esc(p.name || '')}</div>${p.role ? `<div style="${TEXT.caption}">${md(p.role)}</div>` : ''}${p.quote ? `<div style="font:600 27px/1.35 var(--fb);margin-top:8px">“${md(p.quote)}”</div>` : ''}`);
      c.append(av, tx); H.fit(tx.firstChild, wide ? api.box.w - ph - 90 : api.box.w - 56, 24);
      const t0 = api.when(p.at, api.t0 + .1);
      return { el: c, tick: t => H.set(av, { s: lerp(.6, 1, SP(t, t0, .8)), o: A(t, t0, .25) }) };
    });
  def('product', 'A product card: image (or a placeholder), name, price + old price, rating, badge.', { src: 'image', name: 'string', price: 'string', was: 'old price', rating: '0..5', reviews: 'string', badge: 'string' }, [520, 640],
    (p, api) => {
      const wide = api.box.w > api.box.h * 1.2, c = cardShell(`padding:0;display:flex;${wide ? '' : 'flex-direction:column;'}overflow:hidden`), ih = Math.round(wide ? api.box.h * .62 : api.box.h * .54);
      const pic = div(`flex:none;${wide ? `width:${Math.round(api.box.w * .38)}px` : `height:${ih}px`};background:color-mix(in srgb,var(--accent) 8%,var(--surface2));display:flex;align-items:center;justify-content:center;position:relative`);
      if (p.src) { const im = H.img(p.src); im.style.cssText = 'width:100%;height:100%;object-fit:contain;padding:18px'; pic.appendChild(im); } else pic.innerHTML = `<span style="width:${Math.round(ih * .4)}px;height:${Math.round(ih * .4)}px;color:var(--accent);opacity:.55">${IC.bag()}</span>`;
      if (p.badge) pic.appendChild(div('position:absolute;left:18px;top:18px;padding:6px 14px;border-radius:999px;background:var(--bad);color:#fff;font:800 20px var(--fb);letter-spacing:.06em', esc(p.badge)));
      const r = p.rating ?? null, stars = r == null ? '' : `<div style="display:flex;align-items:center;gap:4px">${[0, 1, 2, 3, 4].map(i => star(Math.round(cl(r - i) * 100), 26)).join('')}<span style="${TEXT.caption};margin-left:8px">${esc(String(r))}${p.reviews ? ' · ' + esc(p.reviews) : ''}</span></div>`;
      const body = div('flex:1;padding:18px 26px;display:flex;flex-direction:column;gap:10px;justify-content:center', `<div style="font:var(--fwd) 34px/1.15 var(--fd);white-space:nowrap">${esc(p.name || '')}</div>${stars}${p.price ? `<div style="display:flex;align-items:baseline;gap:14px"><span style="font:var(--fwd) 44px var(--fd);color:var(--accent)">${esc(p.price)}</span>${p.was ? `<span style="font:600 26px var(--fb);color:var(--sub);text-decoration:line-through">${esc(p.was)}</span>` : ''}</div>` : ''}`);
      c.append(pic, body); H.fit(body.firstChild, (wide ? api.box.w * .62 : api.box.w) - 52, 22);
      return { el: c };
    });
  def('rating', 'Stars filling to a score, with the number and review count.', { value: '0..5', max: 'n (5)', reviews: 'string', size: 'px' }, [560, 80],
    (p, api) => {
      const mx = p.max || 5, s = Math.round(p.size || Math.min(64, api.box.h * .9)), e = div(`${fill};display:flex;align-items:center;gap:${Math.round(s * .1)}px`); e.classList.add('onbg');
      const st = [...Array(mx)].map(() => e.appendChild(div(`width:${s}px;height:${s}px;flex:none`)));
      const lab = e.appendChild(div(`margin-left:${Math.round(s * .3)}px;font:var(--fwd) ${Math.round(s * .62)}px var(--fd);white-space:nowrap`));
      const t0 = api.when(p.at, api.t0 + .2), v = Number(p.value) || 0, txt = k => `${k.toFixed(1)}${p.reviews ? `<span style="font:600 .62em var(--fb);opacity:.6;margin-left:.4em">${esc(p.reviews)}</span>` : ''}`;
      lab.innerHTML = txt(v); H.fit(lab, api.box.w - mx * s * 1.1 - s * .3, 20); // the score + review count must fit beside the stars
      return { el: e, tick: t => { const k = E.out(P(t, t0, t0 + 1.2)) * v; st.forEach((x, i) => { const f = Math.round(cl(k - i) * 100); if (x.dataset.f !== String(f)) { x.dataset.f = f; x.innerHTML = star(f, s); } }); lab.innerHTML = txt(k); } };
    });

  // ---------------------------------------------------------------- shares, rankings, funnels, KPIs
  def('pie', 'Pie or donut of shares that sweeps in, with a legend. items: [{label, value, color?}].', { items: '[{label, value, color}]', donut: 'bool (true)', unit: '"%" (default) | "" | suffix', legend: 'right | bottom | none' }, [960, 460],
    (p, api) => {
      const its = p.items || [], tot = its.reduce((a, x) => a + (+x.value || 0), 0) || 1, lg = p.legend || (api.box.w > api.box.h * 1.3 ? 'right' : 'bottom');
      const S_ = Math.round(Math.min(lg === 'right' ? api.box.h : api.box.h * .62, lg === 'right' ? api.box.w * .5 : api.box.w)), r = S_ / 2 - 8, donut = p.donut !== false, sw = donut ? Math.round(r * .42) : r, rr = donut ? r - sw / 2 : r / 2, C_ = 2 * Math.PI * rr;
      const e = div(`${fill};display:flex;${lg === 'right' ? 'align-items:center;gap:48px' : 'flex-direction:column;align-items:center;gap:24px'}`);
      let acc = 0; const segs = its.map((x, i) => { const f = (+x.value || 0) / tot, s = { f, a0: acc, color: sc(x, i) }; acc += f; return s; });
      const svg = `<svg width="${S_}" height="${S_}" style="flex:none;transform:rotate(-90deg)">${segs.map((s, i) => `<circle class="sg" cx="${S_ / 2}" cy="${S_ / 2}" r="${rr}" fill="none" stroke="${s.color}" stroke-width="${sw}" stroke-dasharray="0 ${C_}" stroke-dashoffset="${-s.a0 * C_}"/>`).join('')}</svg>`;
      const pie = div(`position:relative;width:${S_}px;height:${S_}px;flex:none`, svg); e.appendChild(pie);
      const unit = p.unit ?? '%';
      const leg = lg === 'none' ? null : e.appendChild(div(`display:flex;${lg === 'right' ? 'flex-direction:column;gap:16px' : 'flex-wrap:wrap;justify-content:center;gap:12px 28px'}`, its.map((x, i) => `<div class="lgi" style="display:flex;align-items:center;gap:14px;font:700 28px var(--fb);white-space:nowrap"><i style="width:22px;height:22px;border-radius:6px;background:${segs[i].color}"></i><span>${md(x.label)}</span><b style="font:var(--fwd) 28px var(--fd);opacity:.75">${unit === '%' ? Math.round(segs[i].f * 100) + '%' : esc(fmtN(x.value)) + esc(unit)}</b></div>`).join('')));
      if (leg) leg.classList.add('onbg');
      const cs = [...pie.querySelectorAll('.sg')], li = leg ? [...leg.children] : [], t0 = api.when(p.at, api.t0 + .2);
      return { el: e, tick: t => { const k = E.io(P(t, t0, t0 + 1.4)); cs.forEach((c, i) => { const s = segs[i], vis = cl((k - s.a0) / (s.f || 1e-6)) * s.f; c.setAttribute('stroke-dasharray', `${(vis * C_).toFixed(1)} ${C_.toFixed(1)}`); }); li.forEach((l, i) => H.set(l, { o: A(t, t0 + .2 + segs[i].a0 * 1.4, .3), x: -12 * (1 - A(t, t0 + .2 + segs[i].a0 * 1.4, .4)) })); } };
    });
  def('share', 'One 100% bar split into shares (market share, budget, time). items: [{label, value, color?}].', { items: '[{label, value, color}]', unit: '"%" | suffix' }, [1400, 200],
    (p, api) => {
      const its = p.items || [], tot = its.reduce((a, x) => a + (+x.value || 0), 0) || 1, BH = Math.min(90, api.box.h * .45);
      const e = div(fill), bar = e.appendChild(div(`position:absolute;left:0;right:0;top:0;height:${BH}px;border-radius:${BH / 2.6}px;overflow:hidden;display:flex;background:var(--track)`));
      const segs = its.map((x, i) => bar.appendChild(div(`height:100%;width:0;background:${sc(x, i)};border-right:3px solid var(--surface)`)));
      const labs = e.appendChild(div(`position:absolute;left:0;right:0;top:${BH + 18}px;display:flex`)); labs.classList.add('onbg');
      const L = its.map((x, i) => labs.appendChild(div(`flex:${(+x.value || 0) / tot};min-width:0;padding-right:10px;font:700 26px/1.25 var(--fb);overflow:hidden;white-space:nowrap;text-overflow:ellipsis`, `<b style="font:var(--fwd) 34px var(--fd);color:${sc(x, i)}">${p.unit && p.unit !== '%' ? esc(fmtN(x.value)) + esc(p.unit) : Math.round((+x.value || 0) / tot * 100) + '%'}</b><br>${md(x.label)}`)));
      const t0 = api.when(p.at, api.t0 + .2);
      return { el: e, tick: t => { let acc = 0; its.forEach((x, i) => { const f = (+x.value || 0) / tot, k = E.io(P(t, t0 + acc * 1.2, t0 + (acc + f) * 1.2 + .2)); segs[i].style.width = (f * k * 100).toFixed(2) + '%'; H.set(L[i], { o: A(t, t0 + acc * 1.2 + .1, .3) }); acc += f; }); } };
    });
  def('ranking', 'A leaderboard: rank numbers, labels and bars, sorted high to low; highlight one row. items: [{label, value, icon?}].', { items: '[{label, value, icon, color}]', unit: 'suffix', highlight: 'index or label', order: 'up (reveal from last) | down' }, [1100, 520],
    (p, api) => {
      const its = [...(p.items || [])].sort((a, b) => b.value - a.value), mx = Math.max(...its.map(x => +x.value || 0), 1), n = its.length, RH = api.box.h / Math.max(1, n), LW = Math.min(360, api.box.w * .32);
      const hi = typeof p.highlight === 'number' ? p.highlight : its.findIndex(x => x.label === p.highlight);
      const e = div(fill);
      const rows = its.map((x, i) => { const on = i === hi, r = e.appendChild(div(`position:absolute;left:0;right:0;top:${i * RH}px;height:${RH - 10}px;display:flex;align-items:center;gap:18px`)); r.classList.add('onbg');
        r.innerHTML = `<div style="width:56px;flex:none;font:var(--fwd) 34px var(--fd);opacity:${on ? 1 : .45};text-align:right">${i + 1}</div>${x.icon ? `<span style="width:40px;height:40px;flex:none">${(IC[x.icon] || IC.spark)()}</span>` : ''}<div style="width:${LW}px;flex:none;font:${on ? 800 : 700} 28px var(--fb);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${md(x.label)}</div><div style="flex:1;height:${Math.min(40, RH * .5)}px;position:relative"><div class="b" style="position:absolute;left:0;top:0;bottom:0;width:0;border-radius:10px;background:${on ? 'var(--accent)' : x.color ? col(x.color) : 'color-mix(in srgb,var(--accent) 32%,transparent)'}"></div></div><div class="v" style="width:150px;flex:none;font:var(--fwd) 32px var(--fd);text-align:right;white-space:nowrap"></div>`;
        return { r, b: r.querySelector('.b'), v: r.querySelector('.v'), x }; });
      const t0 = api.when(p.at, api.t0 + .2), up = p.order !== 'down';
      return { el: e, tick: t => rows.forEach(({ r, b, v, x }, i) => { const s = t0 + (up ? n - 1 - i : i) * .22, k = E.io(P(t, s, s + .8)); H.set(r, { o: A(t, s, .25), x: -20 * (1 - A(t, s, .5)) }); b.style.width = (k * (+x.value || 0) / mx * 100).toFixed(2) + '%'; v.textContent = fmtN((+x.value || 0) * k, x.dec || 0) + (p.unit || ''); }) };
    });
  def('funnel', 'A conversion funnel: stages narrowing with values and step-to-step rates. items: [{label, value}].', { items: '[{label, value}]', unit: 'suffix', rates: 'bool (true)' }, [1000, 560],
    (p, api) => {
      const its = p.items || [], n = its.length, mx = Math.max(...its.map(x => +x.value || 0), 1), RH = api.box.h / Math.max(1, n), BW = api.box.w * .62;
      const e = div(fill);
      const rows = its.map((x, i) => { const w = (.25 + .75 * (+x.value || 0) / mx) * BW, r = e.appendChild(div(`position:absolute;left:0;right:0;top:${i * RH}px;height:${RH - 10}px`));
        const bar = r.appendChild(div(`position:absolute;left:${(BW - w) / 2}px;width:${w}px;top:0;bottom:0;border-radius:16px;background:${sc(x, 0)};opacity:${1 - i * (.5 / Math.max(1, n - 1))};display:flex;align-items:center;justify-content:center;color:${x.color ? '#fff' : 'var(--on-accent)'};font:var(--fwd) ${Math.min(40, RH * .4)}px var(--fd);white-space:nowrap`, esc(fmtN(x.value)) + esc(p.unit || '')));
        const fs = Math.max(20, Math.min(30, RH * .34)), fr = Math.max(20, Math.min(24, RH * .26)), two = RH >= fs * 1.25 + fr * 1.3 + 10; // small boxes: one line, rate after the label
        const rate = i > 0 && p.rates !== false ? `${Math.round((+x.value || 0) / (+its[i - 1].value || 1) * 100)}%` : '';
        const lab = r.appendChild(div(`position:absolute;left:${BW + 28}px;right:0;top:0;bottom:0;display:flex;${two ? 'flex-direction:column;justify-content:center;gap:2px' : 'align-items:center;gap:12px'};white-space:nowrap;overflow:hidden`, `<div style="font:700 ${fs}px/1.15 var(--fb)">${md(x.label)}</div>${rate ? `<div style="font:600 ${fr}px/1.2 var(--fb);color:var(--sub)">${rate}${two ? ' of previous' : ''}</div>` : ''}`)); lab.classList.add('onbg');
        return { bar, lab }; });
      const t0 = api.when(p.at, api.t0 + .2);
      return { el: e, tick: t => rows.forEach(({ bar, lab }, i) => { const s = t0 + i * .25; H.set(bar, { sx: lerp(.2, 1, E.out(P(t, s, s + .6))), o: A(t, s, .2) }); H.set(lab, { o: A(t, s + .2, .3) }); }) };
    });
  def('kpi', 'A KPI tile: label, counted value, change badge (▲/▼, coloured by whether up is good), optional sparkline.', { label: 'string', value: 'number', prefix: 'string', suffix: 'string', dec: 'n', delta: '"+12%" | number', good: '"up" (default) | "down"', spark: 'number[]' }, [440, 260],
    (p, api) => {
      const c = cardShell('padding:26px 30px;display:flex;flex-direction:column;gap:10px;justify-content:center');
      c.appendChild(div(TEXT.label, esc(p.label || '')));
      const v = Number(p.value) || 0, n = c.appendChild(div(`font:var(--fwd) 84px/1 var(--fd);letter-spacing:calc(-.04em * var(--trk));white-space:nowrap`, ''));
      const d = p.delta, dn = typeof d === 'number' ? d : parseFloat(String(d || '').replace(/[^\d.+-]/g, '')), up = dn >= 0, good = (p.good || 'up') === 'up' ? up : !up;
      const row = c.appendChild(div('display:flex;align-items:center;gap:16px'));
      if (d != null) row.appendChild(div(`padding:4px 12px;border-radius:999px;font:800 22px var(--fb);background:color-mix(in srgb,${good ? 'var(--good)' : 'var(--bad)'} 16%,transparent);color:${good ? 'var(--good-ink)' : 'var(--bad-ink)'};white-space:nowrap`, `${up ? '▲' : '▼'} ${esc(typeof d === 'number' ? (d > 0 ? '+' : '') + d + '%' : String(d).replace(/^[+-]?/, m => m === '-' ? '−' : '+'))}`));
      let path = null;
      if (p.spark && p.spark.length > 1) { const pts = p.spark, mn = Math.min(...pts), mxv = Math.max(...pts), W_ = 150, H_ = 44; const sv = row.appendChild(div(`width:${W_}px;height:${H_}px;flex:none`, `<svg width="${W_}" height="${H_}"><path d="${pts.map((y, i) => `${i ? 'L' : 'M'}${(i / (pts.length - 1) * (W_ - 4) + 2).toFixed(1)} ${(H_ - 4 - (y - mn) / ((mxv - mn) || 1) * (H_ - 8)).toFixed(1)}`).join(' ')}" fill="none" stroke="${good ? 'var(--good)' : 'var(--bad)'}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/></svg>`)); path = sv.querySelector('path'); }
      H.fit(n, api.box.w - 60, 36);
      const t0 = api.when(p.at, api.t0 + .1);
      return { el: c, tick: t => { const k = E.out(P(t, t0, t0 + 1)); n.textContent = (p.prefix || '') + fmtN(v * k, p.dec || 0) + (p.suffix || ''); if (path) path.setAttribute('stroke-dashoffset', (1 - E.io(P(t, t0 + .3, t0 + 1.3))).toFixed(3)); } };
    });

  // ---------------------------------------------------------------- time & place
  def('milestones', 'A timeline of dated milestones; each lights up on its words. Horizontal in wide boxes, vertical in tall ones. items: [{date, text, at}].', { items: '[{date, text, sub, at}]', axis: 'auto | across | down' }, [1500, 300],
    (p, api) => {
      const its = p.items || [], n = its.length, down = p.axis === 'down' || (p.axis !== 'across' && api.box.h > api.box.w * .9), e = div(fill);
      const span = down ? api.box.h : api.box.w, inset = down ? 20 : Math.min(150, span / (2 * Math.max(1, n))), step = (span - 2 * inset) / Math.max(1, n - 1);
      const line = e.appendChild(div(down ? `position:absolute;left:28px;top:20px;bottom:20px;width:4px;border-radius:2px;background:var(--track)` : `position:absolute;left:${inset}px;right:${inset}px;top:28px;height:4px;border-radius:2px;background:var(--track)`));
      const prog = e.appendChild(div(down ? `position:absolute;left:28px;top:20px;width:4px;height:0;border-radius:2px;background:var(--accent)` : `position:absolute;left:${inset}px;top:28px;height:4px;width:0;border-radius:2px;background:var(--accent)`));
      const LW = Math.min(n > 1 ? step - 16 : span, 380);
      const nodes = its.map((x, i) => { const pos = inset + (n === 1 ? (span - 2 * inset) / 2 : i * step), lx = cl(pos - LW / 2, 0, span - LW), al = lx <= 0 && pos - LW / 2 < 0 ? 'left' : lx >= span - LW && pos + LW / 2 > span ? 'right' : 'center';
        const dot = e.appendChild(div(`position:absolute;${down ? `left:16px;top:${pos - 14}px` : `left:${pos - 14}px;top:16px`};width:28px;height:28px;border-radius:50%;background:var(--surface);box-shadow:inset 0 0 0 5px var(--accent)`));
        const lab = e.appendChild(div(down ? `position:absolute;left:72px;right:0;top:${pos - 22}px` : `position:absolute;left:${lx}px;width:${LW}px;top:64px;text-align:${al}`, `<div style="font:var(--fwd) 30px var(--fd);color:var(--accent);white-space:nowrap">${esc(x.date || '')}</div><div style="font:700 26px/1.25 var(--fb);margin-top:6px">${md(x.text || '')}</div>${x.sub ? `<div style="${TEXT.caption};font-size:22px">${md(x.sub)}</div>` : ''}`)); lab.classList.add('onbg');
        return { dot, lab, pos }; });
      const T = its.map((x, i) => api.when(x.at, api.t0 + .3 + i * .6));
      return { el: e, tick: t => { let reach = 0; nodes.forEach(({ dot, lab, pos }, i) => { const k = A(t, T[i], .35); if (t >= T[i] - .3) reach = Math.max(reach, lerp(i ? nodes[i - 1].pos : inset, pos, E.io(P(t, T[i] - .3, T[i])))); H.set(dot, { s: lerp(.3, 1, SP(t, T[i], .6)), o: A(t, T[i] - .1, .2) }); H.set(lab, { o: lerp(.0, 1, k), y: 14 * (1 - k) }); dot.style.background = t >= T[i] ? 'var(--accent)' : 'var(--surface)'; }); prog.style[down ? 'height' : 'width'] = Math.max(0, reach - (down ? 20 : inset)) + 'px'; } };
    });
  // world map: coarse continent outlines (lon, lat) — recognisable at video scale; pins by city name or lon/lat; arcs between pins
  const LAND = [
    [[-168, 66], [-162, 70], [-150, 71], [-140, 70], [-128, 70], [-115, 68], [-100, 69], [-90, 68], [-82, 69], [-80, 63], [-90, 58], [-94, 59], [-82, 52], [-78, 57], [-76, 62], [-70, 60], [-64, 60], [-60, 55], [-56, 52], [-60, 47], [-66, 44], [-70, 42], [-74, 40], [-76, 35], [-80, 32], [-81, 27], [-80, 25], [-83, 29], [-89, 30], [-94, 29], [-97, 26], [-97, 22], [-95, 18], [-91, 18], [-87, 21], [-88, 16], [-84, 15], [-83, 10], [-79, 9], [-81, 8], [-86, 12], [-92, 14], [-96, 16], [-105, 20], [-106, 24], [-110, 24], [-112, 29], [-114, 31], [-117, 32], [-121, 35], [-124, 40], [-124, 46], [-123, 49], [-128, 52], [-133, 56], [-137, 58], [-146, 61], [-152, 59], [-158, 57], [-164, 55], [-158, 58], [-162, 60], [-165, 62]],
    [[-80, 9], [-75, 11], [-72, 12], [-65, 10], [-60, 8], [-55, 6], [-51, 4], [-50, 0], [-44, -2], [-38, -4], [-35, -8], [-37, -12], [-39, -17], [-41, -22], [-45, -24], [-48, -26], [-50, -30], [-53, -34], [-57, -36], [-58, -39], [-62, -40], [-65, -42], [-66, -46], [-68, -50], [-69, -53], [-72, -54], [-75, -50], [-74, -44], [-73, -38], [-72, -30], [-71, -22], [-70, -18], [-75, -15], [-77, -12], [-79, -8], [-81, -5], [-80, -1], [-80, 2], [-78, 4], [-77, 7]],
    [[-9, 36], [-9, 39], [-9, 43], [-2, 43.5], [-1, 46], [-4, 48], [2, 51], [5, 53], [8, 54], [9, 57], [11, 57], [12, 55], [10, 54], [14, 54], [20, 55], [21, 57], [24, 59], [28, 60], [22, 61], [21, 64], [25, 66], [22, 66], [17, 62], [18, 60], [16, 56], [12, 56], [11, 59], [8, 58], [5, 59], [5, 62], [11, 65], [15, 68], [19, 70], [25, 71], [30, 70], [33, 69], [40, 67], [44, 66], [52, 68], [60, 69], [70, 73], [80, 73], [90, 75], [100, 77], [110, 76], [120, 73], [130, 71], [140, 72], [150, 71], [160, 70], [170, 70], [180, 68], [180, 65], [175, 64], [170, 60], [163, 58], [160, 54], [156, 51], [156, 57], [150, 59], [142, 59], [136, 54], [140, 48], [135, 43], [130, 42], [129, 38], [126, 35], [125, 40], [122, 40], [121, 38], [119, 35], [122, 31], [120, 27], [117, 23], [110, 21], [108, 22], [106, 18], [109, 12], [106, 10], [104, 9], [100, 13], [99, 9], [103, 2], [101, 3], [98, 8], [98, 16], [94, 17], [92, 22], [90, 22], [87, 21], [80, 15], [80, 10], [77, 8], [73, 16], [72, 21], [69, 23], [66, 25], [57, 26], [56, 27], [52, 28], [48, 30], [50, 26], [55, 26], [59, 23], [57, 19], [52, 16], [45, 13], [43, 13], [39, 21], [35, 28], [33, 31], [35, 36], [30, 36], [27, 37], [26, 40], [23, 37], [21, 38], [19, 41], [16, 41], [18, 40], [16, 38], [15, 40], [12, 42], [10, 44], [7, 44], [3, 43], [3, 42], [0, 40], [-1, 37], [-5, 36]],
    [[-17, 21], [-16, 27], [-13, 28], [-10, 30], [-9, 33], [-6, 35.8], [-2, 35], [3, 37], [10, 37], [11, 33], [15, 32], [20, 31], [25, 32], [32, 31], [34, 28], [37, 22], [39, 16], [43, 12], [51, 12], [49, 6], [44, 1], [40, -3], [39, -7], [40, -11], [40, -15], [35, -20], [35, -24], [33, -27], [30, -31], [26, -34], [20, -35], [18, -32], [16, -28], [14, -23], [12, -17], [13, -12], [12, -5], [9, -1], [9, 4], [6, 4], [2, 6], [-4, 5], [-8, 4], [-12, 7], [-15, 11], [-17, 15]],
    [[114, -22], [114, -26], [115, -34], [118, -35], [124, -34], [129, -32], [135, -35], [138, -35], [140, -38], [146, -39], [150, -37], [153, -31], [153, -26], [150, -22], [146, -19], [145, -15], [142, -11], [141, -17], [136, -15], [137, -12], [132, -11], [129, -15], [125, -14], [122, -18]],
    [[-73, 78], [-60, 82], [-40, 83], [-22, 82], [-19, 76], [-22, 70], [-30, 68], [-40, 65], [-43, 60], [-48, 61], [-52, 65], [-55, 70], [-60, 76]],
    [[-5, 50], [1, 51], [2, 52.5], [0, 54], [-2, 56], [-2, 58], [-5, 58.6], [-6, 56], [-5, 55], [-3, 54], [-4, 53], [-5, 52]], [[-10, 52], [-6, 52], [-6, 55], [-8, 55], [-10, 54]],
    [[130, 31], [132, 34], [135, 34], [140, 35], [141, 38], [142, 40], [141, 42], [143, 43], [145, 44], [142, 45], [140, 42], [139, 38], [137, 37], [133, 35], [130, 33]],
    [[95, 5], [98, 4], [104, -2], [106, -6], [102, -4], [96, 2]], [[109, 2], [111, -3], [116, -4], [119, 1], [117, 7], [113, 4]], [[105, -6], [114, -8], [110, -8]], [[131, -1], [141, -3], [148, -8], [146, -9], [141, -9], [137, -5]],
    [[120, 18], [122, 18], [124, 12], [126, 7], [122, 8], [120, 14]], [[172, -35], [175, -37], [178, -38], [175, -41], [171, -44], [167, -46], [169, -43], [173, -40]],
    [[-24, 65], [-14, 64], [-14, 66], [-22, 66.5]], [[-85, 22], [-79, 22.5], [-74, 20], [-78, 20]], [[44, -25], [47, -25], [50, -15], [49, -12], [44, -17]], [[-90, 70], [-80, 74], [-70, 72], [-62, 66], [-68, 62], [-78, 64]], [[80, 6], [82, 7.5], [81, 9.5], [79.8, 8]], [[120, 22], [121.5, 25], [122, 23]],
  ];
  const CITY = { 'san francisco': [-122.4, 37.8], 'los angeles': [-118.2, 34], 'seattle': [-122.3, 47.6], 'new york': [-74, 40.7], 'washington': [-77, 38.9], 'boston': [-71.1, 42.4], 'chicago': [-87.6, 41.9], 'austin': [-97.7, 30.3], 'toronto': [-79.4, 43.7], 'vancouver': [-123.1, 49.3], 'mexico city': [-99.1, 19.4], 'sao paulo': [-46.6, -23.5], 'buenos aires': [-58.4, -34.6], 'bogota': [-74.1, 4.7], 'lima': [-77, -12], 'london': [-0.1, 51.5], 'paris': [2.35, 48.86], 'berlin': [13.4, 52.5], 'amsterdam': [4.9, 52.4], 'madrid': [-3.7, 40.4], 'rome': [12.5, 41.9], 'zurich': [8.5, 47.4], 'stockholm': [18.1, 59.3], 'moscow': [37.6, 55.8], 'istanbul': [29, 41], 'dubai': [55.3, 25.2], 'riyadh': [46.7, 24.7], 'tel aviv': [34.8, 32.1], 'cairo': [31.2, 30], 'lagos': [3.4, 6.5], 'nairobi': [36.8, -1.3], 'johannesburg': [28, -26.2], 'mumbai': [72.9, 19.1], 'delhi': [77.2, 28.6], 'bangalore': [77.6, 13], 'singapore': [103.8, 1.35], 'kuala lumpur': [101.7, 3.1], 'jakarta': [106.8, -6.2], 'bangkok': [100.5, 13.8], 'hanoi': [105.8, 21], 'manila': [121, 14.6], 'hong kong': [114.2, 22.3], 'shenzhen': [114.1, 22.5], 'shanghai': [121.5, 31.2], 'beijing': [116.4, 39.9], 'taipei': [121.5, 25], 'seoul': [127, 37.6], 'tokyo': [139.7, 35.7], 'sydney': [151.2, -33.9], 'melbourne': [145, -37.8], 'auckland': [174.8, -36.8] };
  const REGION = { world: [-170, 80, 190, -56], 'north-america': [-170, 75, -50, 8], 'south-america': [-90, 15, -30, -56], europe: [-25, 72, 45, 34], africa: [-20, 38, 55, -36], asia: [40, 60, 150, -10], 'east-asia': [95, 50, 150, 15], oceania: [105, 0, 180, -48], 'middle-east': [25, 42, 65, 12], 'us': [-127, 50, -65, 23] };
  def('map', 'A world (or region) map with pins and travel arcs. pins: [{place: "tokyo" | lon, lat, label, at, color}]; arcs: [{from, to, at}] (pin indexes). region: world | europe | asia | east-asia | north-america | us | south-america | africa | middle-east | oceania | [lonW, latN, lonE, latS].', { region: 'name | [w, n, e, s]', pins: '[{place | lon, lat, label, at, color}]', arcs: '[{from, to, at}]', land: 'colour' }, [1600, 760],
    (p, api) => {
      const R = Array.isArray(p.region) ? p.region : REGION[p.region || 'world'] || REGION.world, [w0, n0, e0, s0] = R, Wb = api.box.w, Hb = api.box.h;
      const sx = Wb / (e0 - w0), sy = Hb / (n0 - s0), s = Math.min(sx, sy), ox = (Wb - (e0 - w0) * s) / 2, oy = (Hb - (n0 - s0) * s) / 2;
      const X = lon => ox + (lon - w0) * s, Y = lat => oy + (n0 - lat) * s;
      const land = LAND.map(poly => 'M' + poly.map(([lo, la]) => `${X(lo).toFixed(1)} ${Y(la).toFixed(1)}`).join('L') + 'Z').join('');
      const pins = (p.pins || []).map(x => { const c = x.place ? CITY[String(x.place).toLowerCase()] : null; if (x.place && !c) H.WARN.push({ scene: api.scene.id, kind: 'map', what: `unknown place "${x.place}" — give lon/lat` }); const [lo, la] = c || [x.lon || 0, x.lat || 0]; return { ...x, px: X(lo), py: Y(la) }; });
      const e = div(`${fill};overflow:hidden${p.region && p.region !== 'world' ? ';-webkit-mask-image:radial-gradient(ellipse 72% 70% at 50% 50%,#000 60%,transparent 100%);mask-image:radial-gradient(ellipse 72% 70% at 50% 50%,#000 60%,transparent 100%)' : ''}`);
      e.innerHTML = `<svg width="${Wb}" height="${Hb}" style="position:absolute;inset:0;overflow:visible"><path d="${land}" fill="${p.land ? col(p.land) : 'color-mix(in srgb,currentColor 14%,transparent)'}" stroke="color-mix(in srgb,currentColor 22%,transparent)" stroke-width="1.5" stroke-linejoin="round"/>${(p.arcs || []).map(a => { const A_ = pins[a.from], B_ = pins[a.to]; if (!A_ || !B_) return ''; const mx = (A_.px + B_.px) / 2, my = (A_.py + B_.py) / 2 - Math.hypot(B_.px - A_.px, B_.py - A_.py) * .28; return `<path class="arc" d="M${A_.px.toFixed(1)} ${A_.py.toFixed(1)} Q${mx.toFixed(1)} ${my.toFixed(1)} ${B_.px.toFixed(1)} ${B_.py.toFixed(1)}" fill="none" stroke="var(--accent)" stroke-width="4" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/>`; }).join('')}</svg>`;
      e.classList.add('onbg');
      const PN = pins.map((x, i) => { const g = e.appendChild(div(`position:absolute;left:${x.px}px;top:${x.py}px;width:0;height:0`));
        const ring = g.appendChild(div(`position:absolute;left:-26px;top:-26px;width:52px;height:52px;border-radius:50%;border:3px solid ${x.color ? col(x.color) : 'var(--accent)'}`));
        const dot = g.appendChild(div(`position:absolute;left:-11px;top:-11px;width:22px;height:22px;border-radius:50%;background:${x.color ? col(x.color) : 'var(--accent)'};box-shadow:0 0 0 4px var(--surface)`));
        const lab = x.label ? g.appendChild(div(`position:absolute;left:20px;top:-50px;padding:6px 14px;border-radius:12px;background:var(--surface);color:var(--ink);font:800 24px var(--fb);white-space:nowrap;box-shadow:var(--card-shadow)`, md(x.label))) : null;
        return { ring, dot, lab, t: api.when(x.at, api.t0 + .4 + i * .35) }; });
      const AR = [...e.querySelectorAll('.arc')], AT = (p.arcs || []).map((a, i) => api.when(a.at, Math.max(PN[a.from] ? PN[a.from].t : 0, PN[a.to] ? PN[a.to].t : 0) + .2));
      return { el: e, tick: t => { PN.forEach(({ ring, dot, lab, t: t0 }) => { H.set(dot, { s: lerp(.2, 1, SP(t, t0, .6)), o: A(t, t0, .15) }); const ph = ((t - t0) % 1.6) / 1.6; H.set(ring, { s: t < t0 ? .3 : lerp(.4, 1.6, ph), o: t < t0 ? 0 : (1 - ph) * .8 }); if (lab) H.set(lab, { o: A(t, t0 + .15, .3), y: 10 * (1 - A(t, t0 + .15, .4)) }); });
        AR.forEach((a, i) => a.setAttribute('stroke-dashoffset', (1 - E.io(P(t, AT[i], AT[i] + 1))).toFixed(3))); } };
    });

  Object.assign(H.EL_DEMO || (H.EL_DEMO = {}), {
    person: { name: 'Lauren Reeve', role: 'Engineer, *Grok Bot team*', quote: '2,000 PRs in a month.' },
    product: { name: 'Studio Headphones', price: '$249', was: '$299', rating: 4.6, reviews: '2,140 reviews', badge: 'SALE' },
    rating: { value: 4.6, reviews: '2,140 reviews' },
    pie: { items: [{ label: 'Search', value: 46 }, { label: 'Social', value: 27 }, { label: 'Direct', value: 18 }, { label: 'Other', value: 9 }] },
    share: { items: [{ label: 'Apple', value: 52 }, { label: 'Samsung', value: 31 }, { label: 'Others', value: 17 }] },
    ranking: { items: [{ label: 'Python', value: 31 }, { label: 'JavaScript', value: 27 }, { label: 'Go', value: 14 }, { label: 'Rust', value: 9 }], unit: '%', highlight: 3 },
    funnel: { items: [{ label: 'Visited', value: 12000 }, { label: 'Signed up', value: 3400 }, { label: 'Activated', value: 1900 }, { label: 'Paid', value: 420 }] },
    kpi: { label: 'Monthly revenue', value: 84200, prefix: '$', delta: '+12%', spark: [3, 4, 3.5, 5, 6, 5.5, 7] },
    milestones: { items: [{ date: '2019', text: 'First prototype' }, { date: '2021', text: 'Public launch' }, { date: '2023', text: '1M users' }, { date: '2026', text: 'Global' }] },
    map: { region: 'world', pins: [{ place: 'san francisco', label: 'HQ' }, { place: 'london' }, { place: 'singapore', label: 'APAC' }], arcs: [{ from: 0, to: 1 }, { from: 1, to: 2 }] },
  });
})();
