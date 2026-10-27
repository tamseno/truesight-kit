// Motion library — named animations any element can wear, several at once.
// Each frame a rig resets a "pose" {x, y, s, sx, sy, r, rx, ry, o, b, bright, clip, glow} and every active motion adds to it
// (enter + emphasis + loop + exit + move stack). Motions are pure functions of time, so any frame renders on its own.
//   H.rig(el)            -> { add(spec), update(t) }       spec = { m: 'rise', t: 1.2, d?: .8, ...params }
//   H.MOTIONS[name]      -> { kind: in|emph|out|loop|move|text, about, params, fn(pose, t, t0, spec, el, rig), prep?(el, spec, rig) }
// Kinds: in (enter, element hidden before t0) · emph (one-shot or persistent accent) · out (leaves at t0) · loop (runs from t0)
//        move (persistent change of place/scale/turn) · text (per-word / per-char / typing / counting; needs a text-ish element)
(() => {
  const H = window.H, { A, SP, E, P, lerp, cl } = H;
  const M = H.MOTIONS = {};
  const def = (name, kind, about, fn, extra = {}) => { M[name] = { name, kind, about, fn, params: extra.params || {}, prep: extra.prep, dur: extra.dur || .8 }; };
  const MF = H.MF, sp = (t, t0, d) => SP(t, t0, d * MF.dur), bump = (t, t0, d) => Math.sin(Math.PI * P(t, t0, t0 + d));
  const ACC = 'var(--accent)';
  const C = el => el.__content || el; // text motions act on the element's content; overlays and pose act on its wrapper

  // ---------------------------------------------------------------- enter
  def('fade', 'in', 'Opacity only.', (p, t, t0, o) => { p.o *= A(t, t0, o.d || .5, E.quart); });
  def('rise', 'in', 'Rises into place with a slight forward tilt and focus pull (the house entrance).', (p, t, t0, o) => { const k = sp(t, t0, o.d || 1), k2 = A(t, t0, .35, E.quart); p.o *= k2; p.y += (o.dist ?? MF.dy) * (1 - k); p.s *= lerp(.965, 1, k); p.rx += MF.tilt * (1 - k); p.b += MF.blur * (1 - k2); }, { params: { dist: 'px' } });
  def('drop', 'in', 'Falls into place from above.', (p, t, t0, o) => { const k = sp(t, t0, o.d || 1); p.o *= A(t, t0, .3); p.y -= (o.dist ?? 60) * (1 - k); p.b += MF.blur * (1 - A(t, t0, .35)); });
  def('left', 'in', 'Slides in from the left.', (p, t, t0, o) => { const k = sp(t, t0, o.d || 1); p.o *= A(t, t0, .3); p.x -= (o.dist ?? 140) * (1 - k); p.b += MF.blur * (1 - A(t, t0, .35)); });
  def('right', 'in', 'Slides in from the right.', (p, t, t0, o) => { const k = sp(t, t0, o.d || 1); p.o *= A(t, t0, .3); p.x += (o.dist ?? 140) * (1 - k); p.b += MF.blur * (1 - A(t, t0, .35)); });
  def('pop', 'in', 'Scales up from small with a little overshoot. Good for badges, icons, stamps.', (p, t, t0, o) => { const k = sp(t, t0, o.d || .75); p.o *= A(t, t0, .14); p.s *= lerp(o.from ?? .5, 1, k); p.r += (o.turn ?? 0) * (1 - k); });
  def('zoom', 'in', 'Arrives from big and blurry, settles sharp. Dramatic reveals.', (p, t, t0, o) => { const k = E.out(P(t, t0, t0 + (o.d || .7))); p.o *= A(t, t0, .25); p.s *= lerp(o.from ?? 1.35, 1, k); p.b += 14 * (1 - k); });
  def('shrink', 'in', 'Arrives from slightly larger (camera settle feel).', (p, t, t0, o) => { const k = sp(t, t0, o.d || 1); p.o *= A(t, t0, .3); p.s *= lerp(1.08, 1, k); p.b += 4 * (1 - k); });
  def('blur', 'in', 'Focus pull from heavy blur.', (p, t, t0, o) => { const k = E.out(P(t, t0, t0 + (o.d || .7))); p.o *= k; p.b += 20 * (1 - k); });
  def('mask', 'in', 'Revealed upward inside its own box (like type rising from behind a line).', (p, t, t0, o) => { const k = E.out(P(t, t0, t0 + (o.d || .7))); p.clip = `inset(${((1 - k) * 100).toFixed(2)}% -20% -20% -20%)`; p.y += 40 * (1 - k); p.o *= A(t, t0, .1); });
  def('wipe', 'in', 'Wiped on left to right.', (p, t, t0, o) => { const k = E.io(P(t, t0, t0 + (o.d || .6))); p.clip = `inset(-20% ${((1 - k) * 100).toFixed(2)}% -20% -20%)`; p.o *= A(t, t0, .05); });
  def('wipe-down', 'in', 'Wiped on top to bottom.', (p, t, t0, o) => { const k = E.io(P(t, t0, t0 + (o.d || .6))); p.clip = `inset(-20% -20% ${((1 - k) * 100).toFixed(2)}% -20%)`; p.o *= A(t, t0, .05); });
  def('iris', 'in', 'Circle reveal from the centre.', (p, t, t0, o) => { const k = E.io(P(t, t0, t0 + (o.d || .7))); p.clip = `circle(${(k * 75).toFixed(2)}% at 50% 50%)`; p.o *= A(t, t0, .05); });
  def('flip', 'in', 'Flips down into view around its top edge.', (p, t, t0, o) => { const k = sp(t, t0, o.d || 1); p.o *= A(t, t0, .25); p.rx += -80 * (1 - k); }, { prep: el => { el.style.transformOrigin = '50% 0'; } });
  def('swing', 'in', 'Swings open like a door from its left edge.', (p, t, t0, o) => { const k = sp(t, t0, o.d || 1); p.o *= A(t, t0, .25); p.ry += 70 * (1 - k); }, { prep: el => { el.style.transformOrigin = '0 50%'; } });
  def('unfold', 'in', 'Unfolds vertically from its top edge.', (p, t, t0, o) => { const k = E.out(P(t, t0, t0 + (o.d || .6))); p.sy *= Math.max(.001, k); p.o *= A(t, t0, .1); }, { prep: el => { el.style.transformOrigin = '50% 0'; } });
  def('grow', 'in', 'Grows horizontally from its left edge (bars, rules, progress).', (p, t, t0, o) => { const k = E.out(P(t, t0, t0 + (o.d || .7))); p.sx *= Math.max(.001, k); p.o *= A(t, t0, .1); }, { prep: el => { el.style.transformOrigin = '0 50%'; } });
  def('stamp', 'in', 'Slams down from large with a small turn. Verdicts, approvals.', (p, t, t0, o) => { const k = E.out(P(t, t0, t0 + (o.d || .32))); p.o *= A(t, t0, .08); p.s *= lerp(1.9, 1, k); p.r += (o.turn ?? -8) * (k > 0 ? 1 : 0); });
  def('spin', 'in', 'Spins and scales in.', (p, t, t0, o) => { const k = sp(t, t0, o.d || 1); p.o *= A(t, t0, .2); p.s *= lerp(.3, 1, k); p.r += -160 * (1 - k); });
  def('tilt', 'in', 'Swings in from a 3D angle (product-shot feel).', (p, t, t0, o) => { const k = sp(t, t0, o.d || 1.2); p.o *= A(t, t0, .3); p.ry += -28 * (1 - k); p.rx += 10 * (1 - k); p.x += 90 * (1 - k); p.b += MF.blur * (1 - A(t, t0, .4)); });
  def('none', 'in', 'Visible from the start, no entrance.', () => { });

  // ---------------------------------------------------------------- text (need words/chars: the rig splits the element's text)
  const splitWords = el => { if (el.__wds) return el.__wds; const out = []; const walk = n => { [...n.childNodes].forEach(c => { if (c.nodeType === 3) { const parts = c.textContent.split(/(\s+)/); const frag = document.createDocumentFragment(); parts.forEach(w => { if (!w) return; if (/^\s+$/.test(w)) frag.appendChild(document.createTextNode(w)); else { const s = document.createElement('span'); s.className = 'wd'; s.style.display = 'inline-block'; s.textContent = w; frag.appendChild(s); out.push(s); } }); c.replaceWith(frag); } else if (c.nodeType === 1 && (c.classList.contains('hl') || c.tagName === 'CODE' || c.tagName === 'B')) { const s = document.createElement('span'); s.className = 'wd'; s.style.display = 'inline-block'; c.replaceWith(s); s.appendChild(c); out.push(s); } else if (c.nodeType === 1) walk(c); }); }; walk(el); return (el.__wds = out); };
  const splitChars = el => { if (el.__chs) return el.__chs; const out = []; const walk = n => { [...n.childNodes].forEach(c => { if (c.nodeType === 3) { const frag = document.createDocumentFragment(); c.textContent.split(/(\s+)/).forEach(w => { if (!w) return; if (/^\s+$/.test(w)) { frag.appendChild(document.createTextNode(w)); return; } const wd = document.createElement('span'); wd.style.cssText = 'display:inline-block;white-space:nowrap'; [...w].forEach(ch => { const s = document.createElement('span'); s.textContent = ch; s.style.display = 'inline-block'; wd.appendChild(s); out.push(s); }); frag.appendChild(wd); }); c.replaceWith(frag); } else if (c.nodeType === 1) walk(c); }); }; walk(el); return (el.__chs = out); };
  H.splitWords = splitWords;
  def('words', 'text', 'Words spring up one after another (kinetic type).', (p, t, t0, o, el) => { const w = C(el).__wds, g = o.gap ?? .055; w.forEach((s, j) => { const k = SP(t, t0 + j * g, .8 * MF.dur); H.set(s, { y: 54 * (1 - k), o: A(t, t0 + j * g, .22), b: 8 * (MF.blur / 6) * (1 - A(t, t0 + j * g, .3)) }); }); p.o *= t >= t0 - .01 ? 1 : 0; }, { prep: el => splitWords(C(el)), params: { gap: 's between words' } });
  def('chars', 'text', 'Characters drop in one by one.', (p, t, t0, o, el) => { const c = C(el).__chs, g = o.gap ?? .022; c.forEach((s, j) => { const k = SP(t, t0 + j * g, .8 * MF.dur); H.set(s, { y: 40 * (1 - k), o: A(t, t0 + j * g, .2) }); }); p.o *= t >= t0 - .01 ? 1 : 0; }, { prep: el => splitChars(C(el)) });
  def('type', 'text', 'Typewriter with a caret; cps = characters per second.', (p, t, t0, o, el) => { el = C(el); const c = el.__chs, n = Math.floor((t - t0) * (o.cps || 30)); c.forEach((s, j) => { s.style.visibility = j < n ? '' : 'hidden'; }); if (el.__caret) { const idx = Math.min(c.length, Math.max(0, n)); const ref = c[idx - 1]; el.__caret.style.display = t >= t0 && (n < c.length || Math.floor(t * 2.2) % 2 === 0) ? '' : 'none'; if (ref) ref.after(el.__caret); } p.o *= t >= t0 - .01 ? 1 : 0; }, { prep: el => { el = C(el); splitChars(el); const k = document.createElement('span'); k.className = 'caret'; el.__caret = k; el.appendChild(k); }, params: { cps: 'chars/s' } });
  def('scramble', 'text', 'Characters resolve from random glyphs (decoder feel).', (p, t, t0, o, el) => { const c = C(el).__chs, d = o.d || 1; c.forEach((s, j) => { const r = s.__r ?? (s.__r = s.textContent); if (r === ' ') return; const done = t >= t0 + d * (j / c.length); s.textContent = done ? r : '#%&*+=<>?/01'[Math.floor((t * 30 + j * 7) % 12)]; s.style.opacity = t < t0 ? 0 : done ? 1 : .55; }); }, { prep: el => splitChars(C(el)) });
  def('count', 'text', 'Counts the number in the element up from 0 (keeps prefix/suffix, thousands separators).', (p, t, t0, o, el) => { el = C(el); el = el.__num || el; const raw = el.__raw ?? (el.__raw = el.textContent), m = raw.match(/-?[\d,]*\.?\d+/); if (!m) return; const v = parseFloat(m[0].replace(/,/g, '')), dec = (m[0].split('.')[1] || '').length, k = E.out(P(t, t0, t0 + (o.d || 1))); const n = (v * k).toFixed(dec); el.textContent = raw.replace(m[0], m[0].includes(',') ? Number(n).toLocaleString('en-US', { minimumFractionDigits: dec }) : n); p.o *= A(t, t0, .15); });
  def('hl', 'emph', 'Sweeps the highlighter across *marked* words inside the element.', (p, t, t0, o, el) => { C(el).querySelectorAll('.hl').forEach((e, j) => H.hl(e, E.io(P(t, t0 + j * .25, t0 + j * .25 + (o.d || .5))))); }, { prep: el => C(el).querySelectorAll('.hl').forEach(e => H.hl(e, 0)) });
  def('draw', 'in', 'Draws the strokes of an SVG element (arrows, lines, outlines, charts).', (p, t, t0, o, el) => { const k = E.io(P(t, t0, t0 + (o.d || .8))); (el.__paths || []).forEach(([q, L]) => { q.style.strokeDashoffset = (L * (1 - k)).toFixed(1); }); p.o *= t >= t0 ? 1 : 0; }, { prep: el => { el.__paths = [...C(el).querySelectorAll('path,line,polyline,circle,ellipse,rect')].filter(q => q.getAttribute('stroke') || q.style.stroke).map(q => { let L = 1000; try { L = q.getTotalLength(); } catch (e) { } q.style.strokeDasharray = L; q.style.strokeDashoffset = L; return [q, L]; }); } });
  def('cascade', 'in', 'Children enter one after another (lists, rows of chips).', (p, t, t0, o, el) => { const kids = C(el).__kids || [...C(el).children]; kids.forEach((c, j) => { const s = t0 + j * (o.gap ?? .12), k = SP(t, s, .8 * MF.dur); H.set(c, { y: 26 * (MF.dy / 36) * (1 - k), o: A(t, s, .25) }); }); p.o *= t >= t0 - .01 ? 1 : 0; }, { params: { gap: 's between children' } });

  // ---------------------------------------------------------------- emphasis
  def('pulse', 'emph', 'Quick scale beat (1 → 1.06 → 1).', (p, t, t0, o) => { p.s *= 1 + (o.amt ?? .06) * bump(t, t0, o.d || .45); });
  def('beat', 'emph', 'Bigger double beat for a punchline.', (p, t, t0, o) => { const u = P(t, t0, t0 + (o.d || .7)); p.s *= 1 + .1 * Math.abs(Math.sin(u * Math.PI * 2)) * (1 - u); });
  def('nod', 'emph', 'Small hop up and back.', (p, t, t0, o) => { p.y -= 14 * bump(t, t0, o.d || .4); });
  def('shake', 'emph', 'Short horizontal shake — "no", errors.', (p, t, t0, o) => { const u = P(t, t0, t0 + (o.d || .45)); if (u > 0 && u < 1) p.x += Math.sin(u * Math.PI * 7) * 10 * (1 - u); });
  def('wiggle', 'emph', 'Small rotation wiggle — "look here".', (p, t, t0, o) => { const u = P(t, t0, t0 + (o.d || .6)); if (u > 0 && u < 1) p.r += Math.sin(u * Math.PI * 5) * 3 * (1 - u); });
  def('glow', 'emph', 'Accent ring glows around the element, then fades (keep: true to hold).', (p, t, t0, o) => { const k = o.keep ? A(t, t0, .3) : bump(t, t0, o.d || .9); if (k > .01) p.glow = `0 0 0 ${(5 * k).toFixed(1)}px color-mix(in srgb,${o.color || ACC} 55%,transparent),0 0 ${(50 * k).toFixed(0)}px color-mix(in srgb,${o.color || ACC} ${Math.round(45 * k)}%,transparent)`; });
  def('flash', 'emph', 'Brief brightness flash.', (p, t, t0, o) => { p.bright *= 1 + .5 * bump(t, t0, o.d || .35); });
  def('lift', 'emph', 'Rises a little and stays raised (selected state).', (p, t, t0, o) => { const k = sp(t, t0, .8); p.y -= (o.dist ?? 14) * k; p.s *= 1 + .02 * k; });
  def('settle', 'emph', 'Returns a lifted element to rest.', (p, t, t0, o) => { const k = sp(t, t0, .8); p.y += (o.dist ?? 14) * k; p.s /= 1 + .02 * k; });
  def('dim', 'emph', 'Steps back (dim + soft) and stays back until "undim".', (p, t, t0, o) => { const k = A(t, t0, .35, E.quart); p.o *= lerp(1, o.to ?? .35, k); p.b += (o.blur ?? 1.5) * k; });
  def('undim', 'emph', 'Comes forward again after "dim".', (p, t, t0, o) => { const k = A(t, t0, .35, E.quart); p.o /= lerp(1, o.to ?? .35, k) || 1; p.b -= (o.blur ?? 1.5) * k; });
  def('ping', 'emph', 'A ripple ring expands from the element (notification, click).', (p, t, t0, o, el) => { const r = el.__ping, u = P(t, t0, t0 + (o.d || .8)); r.style.opacity = u > 0 && u < 1 ? ((1 - u) * .8).toFixed(2) : 0; r.style.transform = `scale(${(1 + u * .5).toFixed(3)})`; }, { prep: el => { const r = document.createElement('i'); r.style.cssText = `position:absolute;inset:-6px;border-radius:inherit;box-shadow:0 0 0 4px ${ACC};opacity:0;pointer-events:none`; el.appendChild(r); el.__ping = r; } });
  const overlay = (el, key, css, svg) => { if (el[key]) return el[key]; const w = document.createElement('div'); w.style.cssText = 'position:absolute;pointer-events:none;overflow:visible;' + css; if (svg) w.innerHTML = svg; el.appendChild(w); return (el[key] = w); };
  def('underline', 'emph', 'An accent bar draws under the element and stays.', (p, t, t0, o, el) => { el.__ul.style.transform = `scaleX(${E.io(P(t, t0, t0 + (o.d || .45))).toFixed(3)})`; }, { prep: (el, o) => { overlay(el, '__ul', `left:0;right:0;bottom:-12px;height:${o.weight || 7}px;border-radius:4px;background:${o.color || ACC};transform-origin:left;transform:scaleX(0)`); } });
  def('strike', 'emph', 'A red line strikes through the element and it fades back.', (p, t, t0, o, el) => { const k = E.io(P(t, t0, t0 + (o.d || .35))); el.__st.style.transform = `scaleX(${k.toFixed(3)})`; p.o *= lerp(1, .5, A(t, t0 + .3, .4)); }, { prep: (el, o) => { overlay(el, '__st', `left:-8px;right:-8px;top:50%;height:5px;margin-top:-2px;border-radius:3px;background:${o.color || 'var(--bad)'};transform-origin:left;transform:scaleX(0)`); } });
  def('circle', 'emph', 'A hand-drawn ring is drawn around the element and stays.', (p, t, t0, o, el) => { const q = el.__cr, k = E.io(P(t, t0, t0 + (o.d || .6))); q.style.strokeDashoffset = (q.__L * (1 - k)).toFixed(1); q.style.opacity = k > 0 ? 1 : 0; }, { prep: (el, o) => { const w = overlay(el, '__crw', 'inset:-18px -26px', `<svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style="overflow:visible"><path d="M8 52 C 6 18, 60 6, 88 22 C 104 34, 98 78, 62 90 C 30 98, 2 84, 6 50 C 8 34, 30 18, 52 16" fill="none" vector-effect="non-scaling-stroke" style="stroke:${o.color || 'var(--bad)'};stroke-width:5;stroke-linecap:round"/></svg>`); const q = w.querySelector('path'); q.__L = 2600; q.style.strokeDasharray = q.__L; q.style.strokeDashoffset = q.__L; el.__cr = q; } });
  def('box', 'emph', 'A dashed accent outline traces the element and stays.', (p, t, t0, o, el) => { const k = E.io(P(t, t0, t0 + (o.d || .6))); el.__bx.style.clipPath = `inset(0 ${((1 - k) * 100).toFixed(1)}% 0 0)`; el.__bx.style.opacity = k > 0 ? 1 : 0; }, { prep: (el, o) => { overlay(el, '__bx', `inset:-12px;border-radius:calc(var(--radius) + 10px);border:4px dashed ${o.color || ACC}`); } });
  def('tint', 'emph', 'Washes the element with a color and holds (good / bad / accent).', (p, t, t0, o, el) => { el.__tn.style.opacity = (A(t, t0, .35) * (o.amt ?? .16)).toFixed(3); }, { prep: (el, o) => { overlay(el, '__tn', `inset:0;border-radius:inherit;background:${o.color === 'good' ? 'var(--good)' : o.color === 'bad' ? 'var(--bad)' : o.color || ACC};opacity:0`); } });

  // ---------------------------------------------------------------- loops
  def('float', 'loop', 'Gentle vertical drift (alive at rest).', (p, t, t0, o) => { if (t >= t0) p.y += Math.sin((t - t0) * (o.speed ?? 1.1) + (o.phase ?? 0)) * (o.amt ?? 6); });
  def('breathe', 'loop', 'Slow scale breathing.', (p, t, t0, o) => { if (t >= t0) p.s *= 1 + Math.sin((t - t0) * (o.speed ?? 1.6)) * (o.amt ?? .015); });
  def('sway', 'loop', 'Slow rotation back and forth.', (p, t, t0, o) => { if (t >= t0) p.r += Math.sin((t - t0) * (o.speed ?? 1.2)) * (o.amt ?? 2); });
  def('spinning', 'loop', 'Continuous rotation (loaders, gears).', (p, t, t0, o) => { if (t >= t0) p.r += (t - t0) * (o.speed ?? 240); });
  def('orbit', 'loop', 'Circles around its place.', (p, t, t0, o) => { if (t >= t0) { const a = (t - t0) * (o.speed ?? 1) + (o.phase ?? 0); p.x += Math.cos(a) * (o.r ?? 18); p.y += Math.sin(a) * (o.r ?? 18); } });
  def('blink', 'loop', 'Opacity blinks (cursor, live dot).', (p, t, t0, o) => { if (t >= t0) p.o *= Math.floor((t - t0) * (o.speed ?? 2.2)) % 2 ? .25 : 1; });
  def('bob', 'loop', 'Quick small bounce (waiting, typing).', (p, t, t0, o) => { if (t >= t0) p.y -= Math.max(0, Math.sin((t - t0) * (o.speed ?? 6))) * (o.amt ?? 5); });
  def('shimmer', 'loop', 'A soft sheen passes across the element every few seconds.', (p, t, t0, o, el) => { const per = o.every ?? 2.6, u = ((t - t0) % per) / .9; el.__sh.style.transform = `translateX(${(-120 + u * 340).toFixed(1)}%) skewX(-18deg)`; el.__sh.style.opacity = t >= t0 && u < 1 ? .9 : 0; }, { prep: el => { const w = overlay(el, '__shw', 'inset:0;border-radius:var(--radius);overflow:hidden', '<i style="position:absolute;top:-10%;bottom:-10%;width:30%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.35),transparent)"></i>'); el.__sh = w.firstChild; } });
  def('drift', 'loop', 'Slow sideways drift (parallax backdrop items).', (p, t, t0, o) => { if (t >= t0) p.x += (t - t0) * (o.speed ?? 8); });

  // ---------------------------------------------------------------- move (persistent)
  def('move', 'move', 'Moves to a new place: to: [x, y] (absolute, top-left) or by: [dx, dy]; optional s (scale), r (turn).', (p, t, t0, o, el, rig) => { const k = E.io(P(t, t0, t0 + (o.d || .9))); const dx = o.by ? o.by[0] : o.to ? o.to[0] - rig.x : 0, dy = o.by ? o.by[1] : o.to ? o.to[1] - rig.y : 0; p.x += dx * k; p.y += dy * k; if (o.s) p.s *= lerp(1, o.s, k); if (o.r) p.r += o.r * k; }, { params: { to: '[x,y]', by: '[dx,dy]', s: 'scale', r: 'deg' } });
  def('scale', 'move', 'Scales to s and stays.', (p, t, t0, o) => { p.s *= lerp(1, o.s ?? 1.15, E.io(P(t, t0, t0 + (o.d || .7)))); }, { params: { s: 'scale' } });
  def('turn', 'move', 'Rotates by r degrees and stays.', (p, t, t0, o) => { p.r += (o.r ?? 90) * E.io(P(t, t0, t0 + (o.d || .7))); });
  def('path', 'move', 'Follows points: pts: [[dx,dy],...] relative to its place, over d seconds.', (p, t, t0, o) => { const pts = [[0, 0], ...(o.pts || [])], u = P(t, t0, t0 + (o.d || 2)) * (pts.length - 1), i = Math.min(pts.length - 2, Math.floor(u)), f = E.io(u - i); if (pts.length > 1) { p.x += lerp(pts[i][0], pts[i + 1][0], f); p.y += lerp(pts[i][1], pts[i + 1][1], f); } });

  // ---------------------------------------------------------------- exit
  def('out', 'out', 'Fades away.', (p, t, t0, o) => { p.o *= 1 - A(t, t0, o.d || .35, E.quart); });
  def('sink', 'out', 'Drops and fades.', (p, t, t0, o) => { const k = A(t, t0, o.d || .4, E.in); p.y += 40 * k; p.o *= 1 - k; p.b += 6 * k; });
  def('fly-up', 'out', 'Lifts away upward.', (p, t, t0, o) => { const k = A(t, t0, o.d || .4, E.in); p.y -= 60 * k; p.o *= 1 - k; p.b += 6 * k; });
  def('fly-left', 'out', 'Exits to the left.', (p, t, t0, o) => { const k = A(t, t0, o.d || .45, E.in); p.x -= 300 * k; p.o *= 1 - k; p.b += 8 * k; });
  def('fly-right', 'out', 'Exits to the right.', (p, t, t0, o) => { const k = A(t, t0, o.d || .45, E.in); p.x += 300 * k; p.o *= 1 - k; p.b += 8 * k; });
  def('blow', 'out', 'Scales up, blurs and vanishes (dismissed).', (p, t, t0, o) => { const k = A(t, t0, o.d || .4, E.quart); p.s *= 1 + .25 * k; p.o *= 1 - k; p.b += 14 * k; });
  def('collapse', 'out', 'Squashes to a line and disappears.', (p, t, t0, o) => { const k = A(t, t0, o.d || .35, E.in); p.sy *= Math.max(.001, 1 - k); p.o *= 1 - k * k; });

  // ---------------------------------------------------------------- rig
  H.rig = (el, base = {}) => {
    const R = { el, x: base.x || 0, y: base.y || 0, list: [], shadow0: el.style.boxShadow || '' };
    R.add = spec => { const m = M[spec.m]; if (!m) { H.WARN.push({ scene: base.scene || '?', kind: 'unknown-motion', what: spec.m }); return R; } if (m.prep && !(el.__prepped || (el.__prepped = {}))[spec.m]) { m.prep(el, spec, R); el.__prepped[spec.m] = 1; } R.list.push({ m, spec }); return R; };
    R.hasIn = () => R.list.some(x => x.m.kind === 'in' || x.m.kind === 'text');
    R.update = t => {
      const p = { x: 0, y: 0, s: 1, sx: 1, sy: 1, r: 0, rx: 0, ry: 0, o: 1, b: 0, bright: 1, clip: null, glow: null };
      for (const { m, spec } of R.list) m.fn(p, t, spec.t, spec, el, R);
      const tr = [];
      if (p.x || p.y) tr.push(`translate3d(${p.x.toFixed(2)}px,${p.y.toFixed(2)}px,0)`);
      if (p.rx || p.ry) tr.push(`perspective(1400px) rotateX(${p.rx.toFixed(2)}deg) rotateY(${p.ry.toFixed(2)}deg)`);
      if (p.r) tr.push(`rotate(${p.r.toFixed(2)}deg)`);
      if (p.s !== 1 || p.sx !== 1 || p.sy !== 1) tr.push(`scale(${(p.s * p.sx).toFixed(4)},${(p.s * p.sy).toFixed(4)})`);
      el.style.transform = tr.join(' ');
      const o = cl(p.o); el.style.opacity = o.toFixed(3); el.style.visibility = o <= .001 ? 'hidden' : '';
      const f = []; if (p.b > .05) f.push(`blur(${p.b.toFixed(2)}px)`); if (Math.abs(p.bright - 1) > .005) f.push(`brightness(${p.bright.toFixed(3)})`); el.style.filter = f.length ? f.join(' ') : 'none';
      el.style.clipPath = p.clip || '';
      if (p.glow || el.__glowed) { el.style.boxShadow = p.glow ? (R.shadow0 ? R.shadow0 + ',' : '') + p.glow : R.shadow0; el.__glowed = !!p.glow; }
    };
    return R;
  };
  // "rise@phrase+0.3" | "pulse@2.5" | {m, at, off, d, ...} -> spec with absolute scene time t
  H.motionSpec = (ctx, x, fb) => {
    if (!x) return null; if (typeof x === 'string') { const m = x.match(/^([\w-]+)(?:@(.+?))?(?:([+-]\d*\.?\d+))?$/); if (!m) return null; x = { m: m[1], at: m[2], off: m[3] ? parseFloat(m[3]) : 0 }; if (x.at && /^\d*\.?\d+$/.test(x.at)) x.at = parseFloat(x.at); }
    const t = H.when(ctx, x.at, fb) + (x.off || 0); return { ...x, t };
  };
})();
