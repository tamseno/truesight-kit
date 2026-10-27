// Catalog — one place an agent (or a person) can read everything the kit offers. Exported by
//   node tools/render.mjs ep=episodes/_gallery catalog=1   -> docs/catalog.json + docs/CATALOG.md
// DEMO holds a working example for every element (the gallery renders them; the catalog prints them as snippets).
(() => {
  const H = window.H;
  H.EL_DEMO = {
    text: { style: 'title', text: 'Ship the *loop*' }, number: { value: 2000, suffix: '+', fmt: true, label: 'PRs in a month' }, tag: { text: 'NEW', color: 'accent' },
    kbd: { keys: ['⌘', 'K'] }, quote: { text: 'Treat it like a *talented intern*.', by: 'Grok Bot guide' },
    card: { icon: 'shield', kicker: 'Rule 1', title: 'Never push to main', body: 'Every change goes through a PR with proof.' }, panel: { tint: 'accent' },
    window: { title: 'notes.md', lines: ['Brief the agent', 'Demand proof', 'Merge low-risk'] }, browser: { url: 'preview.app', title: 'Welcome aboard' },
    phone: { title: 'Welcome', bad: true }, terminal: { title: 'agent', cmd: 'pnpm test', output: [{ text: '✓ 42 passed', cls: 'g' }] },
    code: { file: 'brief.md', lang: 'md', code: '## Task\nFix the crash\n## Proof\nBefore/after shots' },
    bubble: { from: 'you', text: 'This is *P0*.' }, toast: { app: 'Grok Bot', title: 'PR #4821 is ready', body: 'checks pass · proof attached', icon: 'pr' },
    post: { author: 'Grok Bot', handle: '@bot', text: 'Bots can *hand off coding tasks* to Cursor.' }, pr: { num: '#4821', title: 'Small-screen onboarding', state: 'READY', checks: [{ text: 'CI' }, { text: 'Proof' }] },
    tree: { items: ['src/', '  app.ts', '  onboarding/', '    Welcome.tsx'], hl: [3] }, list: { items: ['Brief', 'Proof', 'Merge'], marker: 'check' },
    table: { cols: ['', 'Bot', 'Agent'], rows: [['Brief', true, false], ['Code', false, true]] }, stat: { label: 'Agents', value: 200, suffix: '+', tone: 'accent' },
    progress: { value: .7, label: '{n} / 900 frames', max: 900 }, bars: { items: [{ label: 'Before', value: 10.4, dec: 1, color: 'bad' }, { label: 'After', value: 8.4, dec: 1, color: 'good' }], unit: ' MB' },
    linechart: { points: [3, 5, 4, 7, 9], labels: ['M', 'T', 'W', 'T', 'F'] }, donut: { value: .82, label: 'pass rate' }, tiles: { count: 60, steps: [{ n: 8, color: 'ink' }, { n: 60 }] },
    icon: { name: 'bolt', tile: true }, avatar: { who: 'you', label: true }, logo: { name: 'Grok Bot', mark: 'grok' }, image: { src: 'assets/brand/logo.png', fit: 'contain' },
    shape: { kind: 'ring', stroke: 'accent' }, stamp: { text: 'VERIFIED', tone: 'good' }, note: { text: 'Clipped at 320pt', side: 'left', tone: 'bad' },
    source: { text: 'x.ai/bot/guides' }, divider: {}, check: {}, spinner: {}, glyph: { text: '10×' }, html: { html: '<div style="font:800 40px var(--fd)">raw html</div>' },
    arrow: { from: [0, 0], to: [1, 1] }, cursor: {},
  };
  window.KIT_CATALOG = () => {
    const pick = (o, f) => Object.fromEntries(Object.entries(o).map(([k, v]) => [k, f(v, k)]));
    return {
      looks: pick(window.LOOKS || {}, (l, k) => ({ name: l.name || k, about: l.about || '', dark: !!l.dark, background: l.bg, transition: l.trans, feel: l.feel })),
      elements: pick(H.EL, e => ({ about: e.about, props: e.props, size: e.size, example: H.EL_DEMO[e.name] || {} })),
      motions: pick(H.MOTIONS, m => ({ kind: m.kind, about: m.about, params: m.params })),
      layouts: pick(H.LAYOUTS, l => ({ about: l.about, params: l.params })),
      transitions: { lift: 'default: rise + soft fade', slide: 'push sideways (same chapter)', zoom: 'scale settle (statements)', push: 'vertical push', whip: 'both frames flung sideways with motion blur (topic jump)', wipe: 'accent panel sweeps across (chapter start)', cut: 'hard cut (contrast, turn)' },
      themes: Object.keys(window.LOOK_HUE || {}),
      sfx: ['tick', 'pop', 'click', 'swoosh', 'swish', 'whoosh', 'notify', 'type', 'ding', 'success', 'error', 'impact', 'riser'],
      icons: Object.keys(H.IC),
    };
  };
})();
