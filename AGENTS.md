# TrueSight motion kit — instructions for any coding agent

JSON script → 60 fps explainer videos for the TrueSight AI channel, in every format: 1920×1080 long-form, 1080×1920
Shorts/TikTok/Reels, 1080×1080 and 1080×1350 feed (deterministic DOM renderer, headless Chrome + ffmpeg).

**Start here:** `python tools/ts.py next <episode>` tells you where an episode stands and the next command.
The workflow, step by step with checks: `docs/PLAYBOOK.md` (`python tools/ts.py guide`).
How to build good scenes: `docs/AGENT.md`. Everything the kit offers: `docs/CATALOG.md`; pictures: `docs/gallery/`.
Human overview (Chinese): `docs/DESIGN.md`.

Rules:
- Never deliver below 1080p 60 fps (the format's full canvas).
- The kit is a library, not a template: each episode picks its own look and builds most scenes with `compose`.
- Backgrounds are soft colour only. Never grids, dot screens, scanlines, radar beams or ruled paper.
- Short-form: `"format": "vertical"`, compose scenes, hook in the first second, safe zones — `docs/AGENT.md` §8.
- A script is done when `python tools/make.py <ep> draft` shows lint WARN 0, QA 0 and variety without FAIL, and the sheet looks right.
- Pipeline: `python tools/make.py <ep> draft|preview|voice|final|all`; many: `python tools/batch.py all --ready --pipeline`.
- Machine paths live only in `kit.config.json` (copy `kit.config.example.json`); never hard-code them in tools.
- Rendering is loud: if the user is asleep or wants quiet, use `--quiet` or don't render.
- Commit and push only when asked. Talk to the user in their language; narration is English unless they say otherwise.
