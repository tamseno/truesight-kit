# Making a TrueSight video — guide for the agent

**The kit is a library, not a template.** Every episode must look like it was designed for its topic. You build scenes
from elements, motions and layouts (`compose`), choose a look for the whole video, and use the ready-made recipe
archetypes only where they genuinely fit. Two episodes made with this kit should not be mistakable for each other.

Reference while you work:
- `docs/CATALOG.md` — every look, element (with props + a working example), motion, layout, transition, recipe.
- `docs/gallery/*.jpg` — what they look like: `looks.jpg`, `elements-*.jpg`, `motions-<kind>.jpg` (5-frame strips), `layouts.jpg`.
- `episodes/compose-demo/script.json` — seven composed scenes to copy patterns from.
- Output spec: 1920×1080, 60 fps, always.

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
- Keep `box` coordinates inside 0–1920 × 0–1080; the camera may push in by up to 8%.
- A scene with `"push": false` has no ambient push-in (useful for diagrams that must stay pixel-aligned).
