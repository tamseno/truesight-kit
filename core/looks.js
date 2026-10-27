// Looks — the whole-episode visual identity. Pick one per video with "meta.look" (or brand.json "look").
// A look sets: fonts, color tokens (CSS variables used by every archetype and element), card material,
// background texture, per-theme palettes, motion feel (spring + entrance), default transition, subtitle style.
// Scene "theme" names (paper, mint, lavender, lilac, sky, sand, ice, peach, night, ink, dusk) stay valid in every look:
// each look re-colors them in its own way, so scripts move between looks without edits.
(() => {
  const HUE = { paper: 32, mint: 158, lavender: 232, lilac: 268, sky: 208, sand: 38, ice: 196, peach: 14, night: 230, ink: 224, dusk: 318 };
  const hsl = (h, s, l) => { s /= 100; l /= 100; const k = n => (n + h / 30) % 12, a = s * Math.min(l, 1 - l), f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1))); return '#' + [f(0), f(8), f(4)].map(x => Math.round(x * 255).toString(16).padStart(2, '0')).join(''); };
  // palette builders: theme name -> { base: [edge, centre], blobs: [[hex, alpha] x3], dark }
  const lightPal = (sat = 70, l1 = 94, l2 = 99, bl = 80, ba = .5) => n => { const h = HUE[n] ?? 220, dk = n === 'night' || n === 'ink' || n === 'dusk'; return dk ? darkPal()(n) : { base: [hsl(h, 30, l1), hsl(h, 45, l2)], blobs: [[hsl(h + 18, sat, bl), ba], [hsl(h + 200, sat - 10, bl + 4), ba * .9], [hsl(h - 40, sat, bl + 6), ba * .8]] }; };
  const darkPal = (sat = 70, l1 = 6, l2 = 12, bl = 46, ba = .32) => n => { const h = HUE[n] ?? 228; return { base: [hsl(h, 38, l1), hsl(h, 40, l2)], blobs: [[hsl(h, sat, bl), ba], [hsl(h + 150, sat - 10, bl - 6), ba * .8], [hsl(h - 50, sat, bl), ba * .75]], dark: true }; };
  const SYS = {
    serif: "Georgia,'Book Antiqua',Cambria,Noto,serif",
    din: "Bahnschrift,'Arial Narrow',Geist,Noto,sans-serif",
    geo: "'Century Gothic',Corbel,Geist,Noto,sans-serif",
    black: "'Arial Black','Franklin Gothic Medium',Geist,Noto,sans-serif",
    jb: "'JetBrainsMono Nerd Font','JetBrains Mono','Cascadia Code',Maple,monospace",
    geist: 'Geist,Noto,sans-serif', maple: 'Maple,monospace',
  };
  const base = {
    '--fd': SYS.geist, '--fb': SYS.geist, '--fm': SYS.maple, '--fwd': '800', '--trk': '1', '--tt': 'uppercase',
    '--ink': '#15161c', '--sub': '#6b6e7b', '--line': 'rgba(21,22,28,.08)', '--fill': '#f4f5f8', '--track': '#e7e9f0',
    '--surface': '#ffffff', '--surface2': '#fbfbfd', '--inv': '#15161c', '--inv-ink': '#ffffff',
    '--accent': '#5a5cf0', '--accent2': '#2fc7a4', '--good': '#1fbf75', '--bad': '#f0443a', '--warn': '#f5a524',
    '--good-fill': '#e9f9f1', '--good-ink': '#13a463', '--good-ink2': '#0d5c39', '--bad-fill': '#fff1f0', '--bad-ink': '#e2382e', '--hlc': '#ffd66b', '--hl-ink': 'inherit',
    '--radius': '24px', '--card-border': '0 0 0 1px rgba(21,22,28,.06)', '--card-shadow': '0 30px 70px -24px rgba(30,34,80,.28),0 8px 18px -8px rgba(30,34,80,.10)', '--card-blur': 'none',
    '--code-bg': '#14151d', '--code-bar': '#191a24', '--code-ink': '#d8dbe7',
    '--bg-ink': '#15161c', '--bg-sub': '#6b6e7b',
    '--sub-bg': 'rgba(18,19,26,.88)', '--sub-ink': '#ffffff', '--sub-off': 'rgba(255,255,255,.42)', '--sub-radius': '14px', '--sub-font': SYS.geist,
  };
  window.LOOKS = {
    clean: { name: 'Clean', about: 'Soft white cards on drifting pastel light. Friendly, product-launch feel.',
      tokens: {}, bg: 'mesh', themes: null /* engine's hand-tuned table */, feel: { w: 9.5, z: .62, dur: 1, dy: 36, blur: 6, tilt: 10 }, trans: 'lift', grain: .05, vig: .09, dots: true },
    editorial: { name: 'Editorial', about: 'Magazine layout: serif headlines, hairline rules, paper, one red accent. Calm, authoritative.',
      tokens: { '--fd': SYS.serif, '--fwd': '700', '--trk': '.35', '--ink': '#141414', '--sub': '#5f5b54', '--line': 'rgba(20,20,20,.14)', '--fill': '#f3efe6', '--track': '#e4ded2',
        '--surface': '#fffdf8', '--surface2': '#faf6ee', '--inv': '#141414', '--accent': '#c8321e', '--accent2': '#1d4ed8', '--hlc': 'rgba(200,50,30,.22)',
        '--radius': '6px', '--card-border': '0 0 0 1.5px rgba(20,20,20,.85)', '--card-shadow': '0 2px 0 rgba(20,20,20,.85)', '--bg-ink': '#141414', '--bg-sub': '#5f5b54',
        '--sub-bg': '#141414', '--sub-radius': '4px', '--code-bg': '#1b1a17', '--code-bar': '#23211d' },
      bg: 'paper', themes: lightPal(18, 93, 97, 88, .25), feel: { w: 7.5, z: .86, dur: 1.25, dy: 24, blur: 3, tilt: 0 }, trans: 'slide', grain: .07, vig: .05, dots: false },
    blueprint: { name: 'Blueprint', about: 'Engineering drawing: navy grid, cyan line work, condensed DIN type, mono labels. Precise, technical.',
      tokens: { '--fd': SYS.din, '--fb': SYS.din, '--fm': SYS.jb, '--fwd': '700', '--trk': '.2', '--ink': '#e6f0ff', '--sub': '#8fb0d8', '--line': 'rgba(140,190,255,.22)', '--fill': 'rgba(140,190,255,.08)', '--track': 'rgba(140,190,255,.18)',
        '--surface': 'rgba(9,28,58,.72)', '--surface2': 'rgba(9,28,58,.55)', '--inv': '#ffd166', '--inv-ink': '#0b1f3a', '--accent': '#5ec8ff', '--accent2': '#ffd166', '--hlc': 'rgba(255,209,102,.35)',
        '--good-fill': 'rgba(46,204,113,.14)', '--good-ink': '#6ff0a8', '--good-ink2': '#b8ffd6', '--bad-fill': 'rgba(255,107,94,.14)', '--bad-ink': '#ff8a80',
        '--radius': '6px', '--card-border': '0 0 0 1.5px rgba(140,190,255,.55)', '--card-shadow': '0 0 0 6px rgba(94,200,255,.04)', '--card-blur': 'blur(6px)',
        '--code-bg': '#06152c', '--code-bar': '#0a1d3a', '--bg-ink': '#e6f0ff', '--bg-sub': '#8fb0d8', '--sub-bg': 'rgba(6,21,44,.92)', '--sub-radius': '4px', '--sub-font': SYS.din },
      bg: 'grid', themes: n => { const h = (HUE[n] ?? 215) * .15 + 205; return { base: [hsl(h, 70, 10), hsl(h, 60, 18)], blobs: [[hsl(h, 80, 40), .25], [hsl(h + 20, 70, 35), .2], [hsl(h - 20, 60, 30), .2]], dark: true }; },
      feel: { w: 12, z: .78, dur: .8, dy: 20, blur: 0, tilt: 0 }, trans: 'push', grain: .04, vig: .3, dots: false, dark: true },
    neon: { name: 'Neon', about: 'Night-mode product film: near-black, glowing edges, electric violet and cyan. Energetic.',
      tokens: { '--fm': SYS.jb, '--ink': '#f1f2ff', '--sub': '#9095b4', '--line': 'rgba(255,255,255,.09)', '--fill': 'rgba(255,255,255,.05)', '--track': 'rgba(255,255,255,.1)',
        '--surface': '#0f111a', '--surface2': '#141726', '--inv': '#f1f2ff', '--inv-ink': '#07080d', '--accent': '#8b6bff', '--accent2': '#2de2e6', '--hlc': 'rgba(255,61,242,.45)',
        '--good-fill': 'rgba(45,226,140,.12)', '--good-ink': '#5df2a8', '--good-ink2': '#c4ffe2', '--bad-fill': 'rgba(255,80,110,.12)', '--bad-ink': '#ff6b8a',
        '--radius': '20px', '--card-border': '0 0 0 1px rgba(255,255,255,.09)', '--card-shadow': '0 0 0 1px rgba(139,107,255,.12),0 30px 80px -30px rgba(139,107,255,.45)',
        '--code-bg': '#0a0b12', '--code-bar': '#10121c', '--bg-ink': '#f1f2ff', '--bg-sub': '#9095b4', '--sub-bg': 'rgba(10,11,18,.9)' },
      bg: 'beams', themes: darkPal(85, 4, 9, 50, .3), feel: { w: 11.5, z: .55, dur: .9, dy: 40, blur: 10, tilt: 12 }, trans: 'zoom', grain: .05, vig: .45, dots: false, dark: true },
    brutal: { name: 'Brutal', about: 'Neo-brutalist: flat saturated color, thick black outlines, hard offset shadows, heavy type. Loud, playful, confident.',
      tokens: { '--fd': SYS.black, '--fwd': '900', '--trk': '.4', '--fm': "'Cascadia Code',Maple,monospace", '--ink': '#0a0a0a', '--sub': '#3d3d3d', '--line': 'rgba(10,10,10,.9)', '--fill': '#f2f2f2', '--track': '#dcdcdc',
        '--surface': '#ffffff', '--surface2': '#fffbea', '--inv': '#0a0a0a', '--accent': '#3b5bff', '--accent2': '#ff5ca8', '--hlc': '#ffe14d',
        '--radius': '14px', '--card-border': '0 0 0 4px #0a0a0a', '--card-shadow': '10px 10px 0 #0a0a0a', '--bg-ink': '#0a0a0a', '--bg-sub': '#2b2b2b',
        '--sub-bg': '#0a0a0a', '--sub-radius': '6px', '--sub-off': 'rgba(255,255,255,.5)' },
      bg: 'dots', themes: n => { const h = HUE[n] ?? 50, dk = n === 'night' || n === 'ink' || n === 'dusk'; const c = { paper: '#ffe14d', mint: '#7ae7c7', lavender: '#a8b4ff', lilac: '#d7a8ff', sky: '#8fd3ff', sand: '#ffc56b', ice: '#bdf3ff', peach: '#ff9f8a' }[n]; return dk ? { base: ['#0a0a0a', '#1c1c1c'], blobs: [['#3b5bff', .25], ['#ff5ca8', .2], ['#ffe14d', .12]], dark: true } : { base: [c || hsl(h, 90, 70), c || hsl(h, 90, 74)], blobs: [['#ffffff', .0], ['#ffffff', .0], ['#ffffff', .0]] }; },
      feel: { w: 13, z: .6, dur: .75, dy: 60, blur: 0, tilt: 0 }, trans: 'slide', grain: .03, vig: 0, dots: false },
    glass: { name: 'Glass', about: 'Frosted panels over saturated color fields, geometric type. Premium, consumer-tech.',
      tokens: { '--fd': SYS.geo, '--fwd': '700', '--trk': '.3', '--ink': '#ffffff', '--sub': 'rgba(255,255,255,.72)', '--line': 'rgba(255,255,255,.18)', '--fill': 'rgba(255,255,255,.1)', '--track': 'rgba(255,255,255,.18)',
        '--surface': 'rgba(255,255,255,.13)', '--surface2': 'rgba(255,255,255,.08)', '--inv': '#ffffff', '--inv-ink': '#1a1033', '--accent': '#ffd36b', '--accent2': '#7df9ff', '--hlc': 'rgba(255,211,107,.55)',
        '--good-fill': 'rgba(80,255,170,.16)', '--good-ink': '#9dffcf', '--good-ink2': '#e2fff1', '--bad-fill': 'rgba(255,100,120,.18)', '--bad-ink': '#ffb3bf',
        '--radius': '30px', '--card-border': '0 0 0 1.5px rgba(255,255,255,.32)', '--card-shadow': '0 30px 80px -30px rgba(10,0,40,.55)', '--card-blur': 'blur(26px) saturate(1.5)',
        '--code-bg': 'rgba(10,6,30,.72)', '--code-bar': 'rgba(255,255,255,.06)', '--bg-ink': '#ffffff', '--bg-sub': 'rgba(255,255,255,.75)', '--sub-bg': 'rgba(20,10,50,.55)', '--sub-radius': '20px' },
      bg: 'mesh', themes: n => { const h = HUE[n] ?? 260; return { base: [hsl(h + 20, 60, 22), hsl(h, 70, 40)], blobs: [[hsl(h + 40, 95, 58), .75], [hsl(h - 60, 95, 55), .65], [hsl(h + 160, 90, 55), .55]], dark: true }; },
      feel: { w: 8.5, z: .72, dur: 1.15, dy: 30, blur: 10, tilt: 6 }, trans: 'zoom', grain: .04, vig: .2, dots: false, dark: true },
    terminal: { name: 'Terminal', about: 'Phosphor terminal: black-green, monospace everywhere, scanlines, hard cuts. Hacker, raw.',
      tokens: { '--fd': SYS.jb, '--fb': SYS.jb, '--fm': SYS.jb, '--fwd': '800', '--trk': '0', '--ink': '#c8ffd8', '--sub': '#5f9c74', '--line': 'rgba(120,255,170,.16)', '--fill': 'rgba(120,255,170,.06)', '--track': 'rgba(120,255,170,.14)',
        '--surface': '#07100a', '--surface2': '#0a160e', '--inv': '#39ff88', '--inv-ink': '#031006', '--accent': '#39ff88', '--accent2': '#ffcc33', '--hlc': 'rgba(57,255,136,.3)',
        '--good-fill': 'rgba(57,255,136,.1)', '--good-ink': '#39ff88', '--good-ink2': '#c8ffd8', '--bad-fill': 'rgba(255,90,90,.12)', '--bad-ink': '#ff7a7a',
        '--radius': '4px', '--card-border': '0 0 0 1px rgba(57,255,136,.45)', '--card-shadow': '0 0 30px -6px rgba(57,255,136,.25)',
        '--code-bg': '#030805', '--code-bar': '#07100a', '--bg-ink': '#c8ffd8', '--bg-sub': '#5f9c74', '--sub-bg': 'rgba(3,8,5,.92)', '--sub-ink': '#39ff88', '--sub-off': 'rgba(57,255,136,.4)', '--sub-radius': '2px', '--sub-font': SYS.jb },
      bg: 'scan', themes: n => ({ base: ['#020503', '#06110a'], blobs: [['#0f6e3a', .28], ['#0a4f2a', .2], ['#145c3a', .18]], dark: true }),
      feel: { w: 14, z: .9, dur: .6, dy: 0, blur: 0, tilt: 0 }, trans: 'cut', grain: .08, vig: .5, dots: false, dark: true },
  };
  window.LOOK_BASE = base;
  window.LOOK_HUE = HUE;
})();
