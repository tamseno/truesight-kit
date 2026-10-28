# Architecture

How a `script.json` becomes an MP4, where each piece lives, and how to extend it without breaking determinism.

```text
script.json ──timeline.py──▶ timeline.json ──render.mjs──▶ frames/*.jpg ──ffmpeg──▶ MP4
     │            │ voice + word timings          │ headless Chrome, N pages        ▲
     │            ▼                               ▼                                 │
     │      tts/*.wav · *.json             core/ engine + library          mix.wav (mix.py)
     └──────────────▶ lint · QA · variety (before)        review · thumbnails · publish (after)
```

## 1. Timeline — `tools/timeline.py`
Reads the script, makes or loads the voice for every line (edge-tts for drafts; IndexTTS + faster-whisper word timings for
finals), and lays scenes end to end: `lead` before the first word, `gap` between lines, `tail` after the last, `min_dur` where a
scene needs room. Output: `timeline.json` (canvas size from `meta.format`, every scene with `start`, `dur`, and its lines with
per-word times) and `narration.wav`.

## 2. The page — `tools/render.mjs`
A tiny HTTP server serves the episode folder plus `core/`. The page loads `core/engine.js`, `looks.js`, `formats.js`, every
`core/lib/*.js` and `core/archetypes/*.js` (alphabetical), then the episode's own `scenes/*.js` if any. Puppeteer opens N
pages (`workers=`), each renders a slice of frames: `await renderAt(t)` → CDP `Page.captureScreenshot` → JPEG. Other modes:
`lint=1` (build only, print warnings), `qa=1` (run `window.QA()` on stills), `catalog=1` (export the library), `serve=1` (scrub
in a browser), `look=` (preview another look without editing).

## 3. The engine — `core/engine.js`
- **Boot**: pick the format (canvas, content area, captions, safe zones) and the look (CSS custom properties, palettes, motion
  feel), preload fonts and images, then build every scene once. Each scene type is an archetype
  `ARCH.<type> = (root, ctx, H, data, scene) => update(t)`; `ctx` gives word timing (`ctx.at(phrase)`), camera keyframes
  (`ctx.cam`, `ctx.focus`) and sound cues (`ctx.cue`).
- **`renderAt(T)`** is a pure function of time: background (theme colours blended in OKLab), the current scene's `update(t)`,
  the transition (cut, lift, slide, push, zoom, whip, wipe — the wipe clips both scenes along a moving band), camera, header,
  captions (karaoke pill or short-form pop), progress. Work that can't finish synchronously (a video frame decoding) goes into
  `H.PENDING`; `renderAt` returns a promise and the renderer waits, so every frame is complete.
- **Checks** collected at build time land in `WARN` (lint). `window.QA()` measures the live DOM: text under 20 px, off-frame,
  inside a platform's UI zone, clipped by its box, or low-contrast against its own card.

## 4. The library — `core/lib/`
| file | what | shape |
|---|---|---|
| `elements.js`, `elements2.js` | 51 elements | `def(name, about, props, size, make(p, api))` → `{ el, tick?, hug? }`; `api.box` is the slot, `api.t0` the entrance time, `api.when(at)` resolves a cue |
| `motion.js` | 66 motions | `def(name, kind, about, fn(pose, t, t0, spec, el, rig))`, kinds `in · text · emph · loop · move · out`; motions compose as poses on one rig per element |
| `layout.js` | 17 layouts | `def(name, about, params, fn(area, opts))` → named slots; tall areas use the stacked variant with the same slot names |
| `icons.js` | 108 icons | 24-unit line icons, colour = argument or `currentColor` |
| `catalog.js` | the catalog | `KIT_CATALOG()` → `docs/catalog.json` + `docs/CATALOG.md`; `EL_DEMO` holds a working example per element |

`core/archetypes/compose.js` is the default scene: it places elements by slot or box, parses the motion grammar
(`"rise@phrase+0.3"`), runs beats (camera, focus, extra motions), pulls the first substantial element in with the transition so a
scene never opens empty, and warns about dead air. The other 25 archetypes are ready-made scenes.

## 5. After the render
`tools/mix.py` (narration + music ducked under the voice + synthesized SFX from `cues.json`) → ffmpeg (4 sub-frames per frame
blended for motion blur, BT.709 tags, loudnorm −14 LUFS; NVENC when available, else x264/x265) → `tools/review.py` (frames
around every cut, held/blank frames, loudness, silences) → `tools/thumb.py` (three thumbnails or covers) →
`tools/publish.py` (publish sheet + `captions.srt`). `tools/make.py` runs the chain; `tools/batch.py` runs many.

## Determinism rules (for anything you add)
- Everything on screen is a function of `t`. No `Date.now()`, no `Math.random()` (use `H.rnd(i)`), no CSS animations or transitions.
- Build once, update per frame: create DOM in the archetype/element factory, only change styles in `update(t)` / `tick(t)`.
- Async work (image decode, media) must be preloaded (`H.img`) or pushed to `H.PENDING`.
- Use design tokens (`var(--ink)`, `var(--surface)`, `var(--accent)`, `var(--on-accent)` …), never hard-coded colours, so all looks and dark themes work.
- Backgrounds are soft colour only — no grids, dot screens, scanlines, beams or ruled paper.

## Extending
| add | where | then |
|---|---|---|
| an element | `def()` in `core/lib/elements2.js` (+ an `EL_DEMO` entry) | `node tools/render.mjs ep=episodes/_gallery catalog=1` · `python tools/gallery.py` |
| a motion | `def(name, kind, …)` in `core/lib/motion.js` | same |
| a layout | `def()` in `core/lib/layout.js` (+ a tall variant if it is side by side) | same |
| a look | `core/looks.js` (tokens, theme palette, motion feel, default transition) | `python tools/gallery.py` (looks.jpg) |
| a format | `core/formats.js` + the size map in `tools/timeline.py` | render `episodes/_template` in it |
| a scene type | `core/archetypes/<name>.js`, header comment = its catalog entry; `ARCH.<name>.formats = ['*']` if it adapts to every canvas | catalog |

Before a pull request: `python tools/make.py episodes/<ep> draft` stays clean for every episode in `episodes/` (lint 0, QA 0).
