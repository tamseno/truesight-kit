# TrueSight motion kit

JSON script -> 60 fps explainer videos in any format: 1920x1080 long-form, 1080x1920 Shorts/TikTok/Reels, 1080x1080 and 1080x1350 feed
(`meta.format`; deterministic DOM renderer, Chrome + ffmpeg).

When you make or edit a video here, follow `docs/AGENT.md` (pipeline, planning, compose scenes, variety rules, QA).
Everything the kit offers is listed in `docs/CATALOG.md`; pictures of it are in `docs/gallery/`.
Human overview (Chinese): `docs/DESIGN.md`.

- Never deliver below 1080p 60 fps (the format's full canvas: 1920x1080, 1080x1920, 1080x1080, 1080x1350).
- Short-form (Shorts, TikTok, Reels): `"format": "vertical"`, compose scenes only, hook in the first second, keep the safe zones — `docs/AGENT.md` §8.
- The kit is a library, not a template: each episode picks its own look and builds most scenes with `compose`.
- Backgrounds are soft color only. Never grids, dot screens, scanlines, radar beams or ruled paper.
- Before calling a script done: `node tools/render.mjs ep=<ep> lint=1` (WARN 0) and `python tools/variety.py <ep>` (no FAIL).
