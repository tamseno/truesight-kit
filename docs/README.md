# Documentation

| Document | Read it when | |
|---|---|---|
| [PLAYBOOK.md](PLAYBOOK.md) | you're making a video, from topic to upload (every step has a check) | agents + people |
| [AGENT.md](AGENT.md) | you're writing scenes: planning, compose, motion and pacing, variety rules, formats and Shorts, QA | agents + people |
| [CATALOG.md](CATALOG.md) · [catalog.json](catalog.json) | you need to know what exists: looks, formats, elements (with working examples), motions, layouts, transitions, scene types, icons | generated |
| [gallery/](gallery/) | you'd rather see it: looks, formats, elements, motions (5-frame strips), layouts, icons | generated |
| [ARCHITECTURE.md](ARCHITECTURE.md) | you're changing the engine or adding an element, motion, layout, look or format | contributors |
| [DESIGN.md](DESIGN.md) | 中文概览：这套库是什么、一期怎么做、风格与画幅、通用规范 | 中文 |

Generated files are rebuilt with `node tools/render.mjs ep=episodes/_gallery catalog=1` and `python tools/gallery.py`.
The rules every agent follows are in [`../AGENTS.md`](../AGENTS.md).
