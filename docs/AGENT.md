# Making a TrueSight video — guide for the agent

**The kit is a library, not a template.** Every episode must look like it was designed for its topic. You build scenes
from elements, motions and layouts (`compose`), choose a look for the whole video, and use the ready-made recipe
archetypes only where they genuinely fit. Two episodes made with this kit should not be mistakable for each other.

Reference while you work:
- `docs/CATALOG.md` — every look, element (with props + a working example), motion, layout, transition, recipe.
- `docs/gallery/*.jpg` — what they look like: `looks.jpg`, `elements-*.jpg`, `motions-<kind>.jpg` (5-frame strips), `layouts.jpg`, `formats.jpg` (the same scenes in all four formats).
- `episodes/compose-demo/script.json` — seven composed scenes to copy patterns from.
- Output spec: 60 fps always, at the format's full size — 1920×1080 long-form; 1080×1920 Shorts/TikTok/Reels; 1080×1080 and 1080×1350 feed (§8).

## 1. Pipeline

| step | command | done when |
|---|---|---|
| plan | write `episodes/<name>/script.json` (see §2–§4) | narration reads well aloud; every scene has a picture idea |
| draft voice + timeline | `.\tools\make.ps1 -Ep episodes\<name> -Stage draft` | `sheet.jpg` + `qa.json` exist |
| lint | `node tools/render.mjs ep=episodes/<name> lint=1` | `WARN 0` (bad `at` phrases, unknown names, build errors) |
| variety | `python tools/variety.py episodes/<name>` | no `FAIL` |
| look at it | open `episodes/<name>/sheet.jpg` (two stills per scene) and fix | nothing cropped, overlapping, empty or tiny |
| preview | `-Stage preview` | watch it; fix pacing |
| final voice | `-Stage voice` | `align.py` reports no LOW MATCH lines (re-synthesize those) |
| final | `-Stage final -Fresh` | MP4 + chapter list printed |

Compare looks without editing: `node tools/render.mjs ep=… scenes=s03,s07 at=.9 out=probe look=neon`.
Check one moment: `frames=<t*60>,…`. Scrub by hand: `serve=1`.

## 2. Plan before you build

1. **Pick the look** from the catalog by the topic's mood, and rotate: `variety.py` warns if the last two episodes used it.
   clean (friendly product) · editorial (analysis, essays, news) · blueprint (systems, architecture, how it works) ·
   neon (launches, AI, energy) · brutal (opinion, hot takes, playful) · glass (consumer tech, premium) · terminal (hacking, CLI, dev tools).
   Set `"meta": { "look": "…" }`. You may override tokens (`meta.tokens`, e.g. `--accent`) and motion feel (`meta.feel`).
2. **Chapters and themes.** One theme per chapter (paper, mint, lavender, lilac, sky, sand, ice, peach, night, ink, dusk);
   change theme when the chapter changes. Long videos (> 4 min): a `chapter` card with `"trans": "wipe"` opens each chapter.
3. **Narration first.** One sentence per line, ≤ 18 words. Prefer concrete nouns you can show (a PR, a number, a screen)
   over abstractions. Anything you will animate on must be a word that is actually spoken — `at` matches narration text.
4. **Shot list.** For every scene write one line: what the viewer sees, which elements, what moves on which word.
   If two consecutive shots read the same, change one.

## 3. Building scenes

### Recipes (archetypes)
`hero chapter statement endcard chat code terminal board compare post flow loop table versus cards roster stepper rules checklist stats swarm scorecard clock timeline grid`.
They follow the look. Use one when its structure matches the content exactly. Limits: never the same recipe in two
consecutive scenes, at most 3 uses of any recipe per video, recipes ≤ 60% of scenes.

### Compose (default)
```json
{ "id": "s07", "type": "compose", "theme": "mint", "chapter": "2 · Proof", "label": "Pushing back", "title": "The bot actually looks",
  "lines": ["It opens the preview, finds the clipped button, and sends it back."],
  "data": {
    "layout": { "type": "hero-r", "ratio": 0.55 },
    "els": [
      { "id": "shot", "el": "browser", "slot": "visual", "url": "preview.app", "title": "Welcome", "in": "tilt@opens" },
      { "el": "text", "slot": "text", "style": "title", "text": "Clipped at *320pt*", "h": 180, "in": "words@clipped", "do": ["hl@clipped+0.4"] },
      { "id": "btn", "el": "tag", "box": [1180, 700, 300, 60], "text": "SENT BACK", "color": "bad", "in": "stamp@sends" }
    ],
    "beats": [ { "at": "clipped", "cam": { "focus": "shot", "z": 1.06 } }, { "at": "sends", "focus": "btn" } ]
  } }
```
- **Placement**: `slot` (name or index from the layout) · `box: [x, y, w, h]` · or `x/y/w/h` (w/h alone = centred in the slot).
  The content area is x 88–1832, y 240–872 with a title, y 110–910 without. Keep text above y 900 (subtitles live at 968+).
- **Props** go inline (`"text"`, `"style"`, `"title"` …) or under `"p"`. Reserved keys: `id el slot box x y w h z in do out loop kids layout sfx css pad p`.
- **Motions**: `"name@phrase"`, `"name@phrase+0.3"`, `"name@2.5"` (seconds), or `{ "m": "move", "at": "word", "to": [x, y] }`.
  `in` = entrance (default: a fitting one, spread over the narration) · `do` = list of emphasis/move · `out` = exit · `loop` = continuous.
  Several motions stack on one element. Text motions (`words chars type scramble count`) act on the element's text.
- **Beats**: `{ "at", "cam": { "focus": "id", "z", "k" } | "reset" | { "x", "y", "z" } }` · `{ "at", "focus": "id" | ["a","b"] | "all" }`
  (everything else dims — depth of field) · `{ "at", "do": { "id": "pulse" } }` · `{ "at", "sfx": "impact" }`.
- **Groups**: `{ "el": "group", "layout": { "type": "row", "n": 3 }, "box": [...], "kids": [ … ] }`.
- **Arrows / cursors** reference element ids: `{ "el": "arrow", "from": "a", "to": "b", "bend": 0.3, "in": "fade@then" }`.
- Colors: use tokens (`accent`, `good`, `bad`, `ink`, `sub`, or `var(--…)`) so the look stays coherent. `*word*` = highlighter.
- Planning help: `"showSlots": true` draws the layout's slots.

### Patterns that work (mix them; don't reuse one pattern back to back)
- **Claim + proof**: `hero` layout — `text` title left, a `post` / `browser` / `image` right; `hl` on the key phrase.
- **Number reveal**: `split` — `number` with `zoom` on the spoken number, a `tiles` field or `bars` on the other side.
- **Before → after**: two `phone`/`image` + `glyph` "→" + `stamp` at the verdict; `circle` or `box` on the flaw.
- **UI walk-through**: `window` or `browser` + `cursor` path + `ping` on clicks + `note` callouts; camera focus per step.
- **Conversation**: `bubble`s alternating sides (`left` / `right` entrances), a `toast` dropping in, `ping` on arrival.
- **Pipeline**: three or four `card`s in `cols`, `arrow`s between them drawn on the words, the active card `glow`s.
- **Kinetic statement** (no title): `text` style `display` with `chars`/`mask`, a second line, `strike` the old idea, `underline` the new one.
- **Data story**: `linechart` drawn on its word, `stat` cards counting, `donut` for a rate; `focus` beats walk through them.
- **Bento summary**: `bento` layout mixing a `quote`, a `stat` and a `list` — good for chapter recaps.
- **Code focus**: `code` element with `focus` on the spoken lines + a `note` pointing at a line.

## 4. Variety rules (checked by `tools/variety.py`)
Hard (FAIL): ≥ 40% of scenes are `compose` · no recipe more than 3 times · never the same recipe twice in a row.
Soft (WARN): ≥ 4 layouts across compose scenes · ≥ 4 different entrance motions · no back-to-back compose scenes with
the same layout · ≥ 3 transition kinds · don't reuse the previous two episodes' look.
Also: vary composition (centred vs left-weighted vs full-bleed), vary density (one big thing vs a busy bento), and give
each chapter at least one shot that only makes sense for this topic.

## 5. Motion and pacing (house style)
- Something new every 2–4 s; the first visual change within 0.5 s of a scene starting.
- Elements arrive on the word that names them, not all at once. Stagger related items 0.1–0.2 s.
- One emphasis per beat (`pulse`, `glow`, `circle`, `underline` …); don't stack three on the same word.
- Camera: 0–3 beats per scene, zoom ≤ 1.08; `reset` before the scene's last line if you pushed in.
- No bouncy cartoon easing, no particle bursts, no centered-title-on-gradient as a default, no dead air.
- **Backgrounds are soft color only** (the look's gradients and drifting light). Never grids, dot screens, scanlines,
  radar-style beams or ruled paper — not as a background, not as a full-frame `shape`/`html` overlay.
- Transitions: `cut` for contrast, `whip` for a topic jump, `wipe` into chapter cards, `slide`/`push` within a chapter.

## 6. QA — what to check in the stills
- Nothing important cut by the frame edge or the subtitle band (y > 900).
- No text under 20 px (qa.json lists it), no overlapping elements unless intended, no empty half-frames.
- Every number and quote has a `source` (recipes have it; in compose add a `text` with style `caption` or use `post`/`stat` subtitles).
- The two stills per scene differ (if they don't, the scene has dead air).
- Read `lint.json`: an `at-not-found` means an animation fires at the fallback time instead of on its word.

## 7. Gotchas
- `at` is matched against the spoken words with spaces and case ignored; numbers are spoken as written ("thirty" vs "30").
- Element `id` is reserved for references — the PR card number is `num`, the terminal output is `output`.
- `text` hugs its content (so underline/circle wrap the words); set `"hug": false` to keep the full box (e.g. for alignment).
- Elements inside `card`/`window` clip; annotations (`circle`, `box`, `ping`) live on the element's wrapper and may extend past it.
- Keep `box` coordinates inside the canvas (1920×1080 landscape, 1080×1920 vertical …); the camera may push in by up to 8%.
- In vertical, a `box` is laid out at its size ÷ 1.5 and scaled up (`ui`); give text elements the final on-screen box and they size themselves. Set `"ui": 1` on an element to opt out.
- A scene with `"push": false` has no ambient push-in (useful for diagrams that must stay pixel-aligned).

## 8. Formats — Shorts, TikTok, Reels, feed posts
One kit, every platform. Set `"meta": { "format": "…" }` (default `landscape`):

| format | canvas | for | captions |
|---|---|---|---|
| `landscape` | 1920×1080 | YouTube long-form | pill karaoke subtitle |
| `vertical` (alias `short`) | 1080×1920 | YouTube Shorts, TikTok, Instagram Reels | pop captions: 1–3 big words, the spoken word lit |
| `square` | 1080×1080 | Instagram / LinkedIn / X feed | pill |
| `portrait` | 1080×1350 | Instagram / Facebook feed (4:5) | pill |

Always 60 fps. What the format changes for you: canvas, header position (it wraps on narrow canvases), the content
area every layout divides, element scale (`ui`: compose elements lay out at slot ÷ ui and scale up, so a phone gets
bigger type — vertical 1.5×), caption style, progress bar, safe zones, and the codec (`make.ps1 -Codec auto`:
HEVC for landscape, H.264 for the rest). Layouts follow the area's shape: on a tall area `split`, `hero`, `row`,
`thirds`, `cols`, `bento`, `grid`, `cascade`, `columns-hero` stack top-to-bottom and keep their slot names — so a
scene built with slots reflows into any format. `box` coordinates are canvas pixels and do not reflow (lint warns
when a box runs past the canvas). Recipes marked "landscape only" in the catalog render scaled into the content
area with a `landscape-only` warning; in short and feed formats build those scenes with `compose`
(`code`, `list`, `terminal`, `table`, `pr`, `phone` elements cover them). `chapter`, `endcard`, `statement`, `chat`
and `compose` adapt.

**Vertical (Shorts / TikTok / Reels) — how a good one is built**
- **Length 20–60 s**, 5–9 scenes of 2.5–6 s. Every scene `compose`. One idea and one big thing per frame.
- **Hook in the first second.** The first frame already shows the claim (a contrarian line or a number) — no fade
  from empty, no logo sting, no title card. First line ≤ 8 words.
- **Safe zones** (`qa=1` checks them): platform UI covers the top 200 px, the bottom 470 px (caption, description,
  buttons) and the right 132 px below mid-height (like/comment/share rail). The content area (x 72–948,
  y 236–1290 bare, 500–1290 under a title) is already safe; pop captions sit at y ≈ 1372.
- **Usually no title header** — the bare area gives the visual the room. Big type: `display`/`huge` text, 1–4 words per line.
- **Pace**: `meta.edge_rate` "+5%"–"+10%", `gap` 0.18, `lead` 0.15. Something changes every 1.5–3 s. Transitions
  `cut`, `whip`, `zoom` — no `wipe` chapter cards.
- **Ending**: no end screen (Shorts have none). End on a line that loops back into the first (the viewer rewatches)
  or one call-to-action tag ("Full breakdown on the channel"). An `endcard` in vertical becomes a centred follow card.
- **Looks** that read best on a phone: high contrast — `brutal`, `neon`, `clean`, `terminal`.
- **Cut-down from a long video**: copy its 5–8 strongest compose scenes into a new episode with `format: "vertical"`,
  rewrite the narration for 30–45 s, keep slot-based scenes as they are (they reflow) and re-place any `box`.
- Example: `episodes/grokbot-short` (brutal, 7 scenes, ~29 s). Template: `episodes/_template-short`.

**Square / portrait (feed)**: viewers often watch muted — keep the pill captions on, put the claim in the first frame,
15–60 s. Side-by-side layouts still fit (the areas are wider than tall).
