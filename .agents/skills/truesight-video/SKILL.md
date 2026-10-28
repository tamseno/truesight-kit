---
name: truesight-video
description: Make videos for the TrueSight AI channel with the TrueSight motion kit — YouTube long-form, Shorts/TikTok/Reels, square and 4:5 feed posts — from topic research to a finished 60 fps MP4 with thumbnails, captions and publish copy. Also cuts a long video into a Short and runs batches of episodes. Use when asked to make, script, render, fix, cut down or publish a TrueSight video, Short or TikTok, or to work on episodes/*/script.json in the truesight-kit repo.
---

# TrueSight video

The kit lives at `{{KIT}}` (if this still reads `{{KIT}}`, you are inside the repo — use its root). Work from that folder.
Everything below is a command any agent can run; the kit's own checks decide when a step is done.

## The loop

1. **Find the state.** `python tools/ts.py next <episode>` prints the stage, what is wrong, and `NEXT: <command>`.
   No episode yet: `python tools/ts.py new <name> --title "…"` (add `--format vertical` for a Short/TikTok/Reel).
   A Short from an existing long video: `python tools/cutdown.py episodes/<long> episodes/<new>`.
2. **Do what NEXT says**, fix what it lists, run `ts next` again. Repeat until it says `done`.
3. **Deliver** what `done` lists: the MP4, one thumbnail (A/B/C), `captions.srt`, the text in `publish.md`.

`python tools/ts.py status` shows every episode; `python tools/ts.py guide` prints the full playbook (`docs/PLAYBOOK.md`).

## Writing the script (the part only you can do)

Before editing `episodes/<name>/script.json`, read `docs/AGENT.md` (how to build scenes that don't look alike) and skim
`docs/CATALOG.md` / `docs/gallery/` (what exists). Then:
- Research from primary sources and keep the URLs — they become `source` tags and the description's sources.
- Pick a look by mood, different from the last two episodes; music by mood (`python tools/bgm.py --list`) or the look's default.
- Narration first: one sentence per line, ≤ 18 words; Shorts: 20–60 s, first line ≤ 8 words, the hook is on screen at frame 0.
- Mostly `compose` scenes; every element enters on the word that names it (`"in": "rise@phrase"`, phrase spoken verbatim).
- Fill `meta.publish` (title, description, tags, hashtags) and optionally `meta.thumb` before the voice stage.

## Done means

- Draft: lint `WARN 0`, `QA 0`, variety without `FAIL` — and you looked at `sheet.jpg` (crowding, empty halves, repeated shots).
- Final: `review/report.txt` clean (nothing frozen ≥ 4 s, no blank frames, −14 LUFS, peak ≤ −1 dBFS), `publish.md` has nothing to check.

## Rules

- 60 fps at the format's full canvas (1920×1080, 1080×1920, 1080×1080, 1080×1350). Never lower.
- Backgrounds are soft colour only — never grids, dot screens, scanlines, radar beams or ruled paper.
- Rendering and encoding are loud and long: if the user is asleep or wants quiet, use `--quiet` or don't render; run long renders in the background.
- Many episodes: set `"meta": {"status": "ready"}` and run `python tools/batch.py all --ready --pipeline`.
- Machine paths live in `kit.config.json`; `python tools/ts.py doctor` checks the machine.
- Commit and push only when the user asks. Talk to the user in their language; narration is English unless told otherwise.
