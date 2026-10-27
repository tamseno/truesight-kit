# TrueSight motion kit

JSON script -> 1920x1080 60 fps explainer videos (deterministic DOM renderer, Chrome + ffmpeg).

When you make or edit a video here, follow `docs/AGENT.md` (pipeline, planning, compose scenes, variety rules, QA).
Everything the kit offers is listed in `docs/CATALOG.md`; pictures of it are in `docs/gallery/`.
Human overview (Chinese): `docs/DESIGN.md`.

- Never deliver below 1080p 60 fps.
- The kit is a library, not a template: each episode picks its own look and builds most scenes with `compose`.
- Before calling a script done: `node tools/render.mjs ep=<ep> lint=1` (WARN 0) and `python tools/variety.py <ep>` (no FAIL).
