# TrueSight playbook — from a topic to a published video

For any agent or person. Every step ends with a check you can run; don't move on until it passes.
`python tools/ts.py next <episode>` reads the episode's state and prints exactly this: where it stands, what's wrong, and the
next command. When in doubt, run it.

## 0. Ground rules (always)
- Output is 60 fps at the format's full canvas: 1920×1080 long-form · 1080×1920 Shorts/TikTok/Reels · 1080×1080 / 1080×1350 feed.
- Backgrounds are soft colour only — never grids, dot screens, scanlines, radar beams or ruled paper.
- Every number and quote on screen has a source; facts come from research you can cite.
- Rendering and encoding are loud and heavy: if the user is asleep or wants quiet, don't render (or use `--quiet`).
- Commit and push only when the user asks. Repos go under the `ravflow` organisation.
- Narration is English unless the user says otherwise; talk to the user in their language.

## 1. Start
| what | how |
|---|---|
| new long video | `python tools/ts.py new <name> --title "…"` (landscape, from `episodes/_template`) |
| new Short / TikTok / Reel | `python tools/ts.py new <name> --format vertical` (from `episodes/_template-short`) |
| Short from a long video | `python tools/cutdown.py episodes/<long> episodes/<new>` — then rewrite the hook and narration |
| feed post | `--format square` or `--format portrait` |

## 2. Research and plan (before touching the script)
1. Research the topic from primary sources (official docs, announcements, the people involved). Keep the URLs — they become
   on-screen `source` tags and the description's Sources list.
2. Decide the **look** by mood and rotate it against the last two episodes (`docs/CATALOG.md` → Looks; `docs/gallery/looks.jpg`).
3. Decide **music** (`python tools/bgm.py --list`) — or leave it to the look's default.
4. Long-form: chapters, one theme per chapter, a `chapter` card (`"trans": "wipe"`) to open each. Short: 20–60 s, 5–9 scenes,
   hook in the first second (the first frame is the cover), no chapters, end with a loop-back line or one call to action.
5. Write the narration first: one sentence per line, ≤ 18 words (Shorts: first line ≤ 8 words). Then a one-line shot list:
   what the viewer sees on each line. Two consecutive shots must not read the same.

## 3. Build the script — `episodes/<name>/script.json`
- Rules and patterns: `docs/AGENT.md` §2–§8. Everything available: `docs/CATALOG.md` (51 elements, 66 motions, 17 layouts,
  26 recipes, 7 looks, 4 formats, 108 icons); pictures in `docs/gallery/`.
- Default to `compose` scenes; use a recipe only when its structure matches exactly. Elements arrive on the word that names them
  (`"in": "rise@phrase"`). Use slots (layouts) rather than hand-placed boxes when the scene might be reused in another format.
- Real material: screenshots `node tools/shot.mjs url=… out=episodes/<name>/media/x.png [full=1]` (then `image` + `pan`),
  recordings `python tools/ingest.py rec.mp4 episodes/<name> demo` (then the `clip` element).
- Fill `meta.publish` (title, description, tags, hashtags, pinned comment) and optionally `meta.thumb` (text, kicker, number/image).

## 4. Draft loop — repeat until clean
```
python tools/make.py episodes/<name> draft
python tools/ts.py next episodes/<name>
```
Draft = voice timing → lint → stills + QA → `sheet.jpg` → variety. Clean means **lint WARN 0, QA 0, variety no FAIL** — and then
look at `sheet.jpg` yourself (two stills per scene) for what checks can't see: crowding, empty halves, weak hierarchy, a shot that
repeats the previous one. Typical fixes: an `at` phrase that isn't spoken verbatim, text too small for a phone, a box past the
safe zone, dead air (add a `focus`/`cam`/`do` beat), low contrast.

## 5. Voice and final
```
python tools/make.py episodes/<name> voice      # IndexTTS per line (cached) + whisper word timings
python tools/make.py episodes/<name> final      # render (motion blur) → mix → MP4 → chapters → review → thumbnails → publish sheet
```
(`all` does both.) If alignment reports LOW MATCH for a line, re-synthesise it. Final stops if lint isn't clean.

## 6. Check the finished video
- `episodes/<name>/review/report.txt`: no stretches ≥ 4 s where nothing moves, no blank frames, −14 LUFS, true peak ≤ −1 dBFS,
  no silence > 1.2 s. `review/cuts-*.jpg`: no empty or double-exposed frames around any cut.
- `publish.md` has nothing under "Check before posting". Pick one of `thumb-A/B/C.jpg` (or `cover-A/B/C.jpg`).
- `ts next` says **done**. Deliver: the MP4, the chosen thumbnail, `captions.srt`, the text in `publish.md`.

## 7. Many at once
Set `"meta": {"status": "ready"}` on every finished script, then `python tools/batch.py all --ready --pipeline` (voice of the
next episode runs while the current one renders; failures don't stop the queue; logs in `queue/`). `python tools/ts.py status`
shows every episode's stage. At night: add `--quiet`, or don't run it.

## 8. When something breaks
`python tools/ts.py doctor` checks node, Chrome, ffmpeg, the voice environments and `kit.config.json`. Machine paths live only in
`kit.config.json` (copy `kit.config.example.json`). Drafts need just node, Chrome and the kit's Python; the voice stage needs the
IndexTTS and whisper environments.
