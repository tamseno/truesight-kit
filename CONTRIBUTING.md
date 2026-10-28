# Contributing

Thanks for helping. The kit is easiest to extend at its edges: elements, motions, layouts, looks and icons.

## Setup
```bash
npm install
python -m venv .venv && .venv/Scripts/pip install -r requirements.txt   # macOS/Linux: .venv/bin/pip
cp kit.config.example.json kit.config.json
python tools/ts.py doctor
```
Drafts need only Node, Chrome and the kit's Python. The voice clone and aligner are optional.

## Making a change
1. Read [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md), especially the determinism rules.
2. Match the surrounding code: same naming, same density of comments, design tokens instead of colours.
3. Check it on real episodes. For every folder in `episodes/`, `python tools/make.py episodes/<ep> draft` must stay at
   **lint WARN 0** and **QA 0**. Look at the `sheet.jpg` it writes.
4. If you added or changed something in the library, regenerate the catalog and gallery:
   `node tools/render.mjs ep=episodes/_gallery catalog=1` and `python tools/gallery.py`.
5. Open a pull request with a before/after still (or a short clip) of what changed on screen.

## Good first contributions
- A new element in `core/lib/elements2.js`, with an `EL_DEMO` example so it shows up in the gallery
- A new look in `core/looks.js`
- Icons in `core/lib/icons.js` (24-unit grid, 2 px rounded strokes, `currentColor`)
- A tall-format variant for a layout that doesn't have one yet

## House rules
- Output never drops below 1080p 60 fps.
- Backgrounds are soft colour only: no grids, dot screens, scanlines, radar beams or ruled paper.
- No machine-specific paths in code; they belong in `kit.config.json`.

By contributing you agree that your contribution is licensed under the [MIT License](LICENSE).
