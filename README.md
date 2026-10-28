# TrueSight motion kit

Script-to-video for the TrueSight AI channel: a JSON script becomes a 60 fps explainer video — YouTube long-form (1920×1080),
Shorts / TikTok / Reels (1080×1920) or feed posts (1080×1080, 1080×1350) — with voice, music, captions, thumbnails and publish copy.
Rendering is deterministic: a DOM scene engine driven frame by frame in headless Chrome, encoded with ffmpeg.

It is a library, not a template: 7 looks, 51 elements (UI mocks, charts, people, products, maps, real footage…), 66 motions,
17 layouts that reflow across formats, 26 ready-made recipes, 108 icons and a generated mood music library. Each episode
composes its own scenes, and automated checks (lint, QA, variety, finished-video review) keep the output clean.

## Quick start
```bash
npm install                                   # puppeteer-core (uses your installed Chrome)
python -m venv .venv && .venv/Scripts/pip install -r requirements.txt     # Linux/macOS: .venv/bin/pip
cp kit.config.example.json kit.config.json    # set Chrome and (for the final voice) the IndexTTS / whisper environments
python tools/ts.py doctor                     # is this machine ready?
python tools/ts.py new my-first-short --format vertical
python tools/ts.py next my-first-short        # where it stands + the next command; repeat until "done"
```

## For agents
Any coding agent (Claude Code, Codex, Cursor, Gemini, Copilot …) reads `AGENTS.md`. The workflow is `docs/PLAYBOOK.md`;
the skill `truesight-video` (`.agents/skills/`, mirrored in `.claude/skills/`) wraps it. `python tools/ts.py install-skill`
copies the skill into `~/.agents/skills` and `~/.claude/skills` so it works from any folder.

## Docs
- `docs/PLAYBOOK.md` — topic → published video, step by step with checks
- `docs/AGENT.md` — how to build scenes that don't look alike (planning, compose, motion, formats, QA)
- `docs/CATALOG.md` + `docs/gallery/` — everything the kit offers, with pictures
- `docs/DESIGN.md` — overview in Chinese

## Pipeline
`python tools/make.py <episode> draft | preview | voice | final | all` · many at once: `python tools/batch.py all --ready --pipeline`
· a Short from a long video: `python tools/cutdown.py episodes/<long> episodes/<new>`.
