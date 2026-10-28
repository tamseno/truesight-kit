# Changelog

## 2026-10-28: open source
- MIT license; README in English and Chinese; architecture guide, contributing guide, docs index.
- Encoding falls back to x264/x265 when there is no NVIDIA GPU. Finals use the edge-tts voice when no voice clone is configured,
  so a fresh checkout goes from script to MP4 with no extra setup.

## 2026-10-28: agent-neutral workflow
- `AGENTS.md` (read by Codex, Cursor, Copilot, Gemini and others). `CLAUDE.md`, `GEMINI.md`, Cursor rules and Copilot instructions point to it.
- `docs/PLAYBOOK.md`: topic → published video, with a check at every step.
- `tools/ts.py` front door: `next` (state, issues, exact next command), `new`, `status`, `guide`, `doctor`, `install-skill`.
- The `truesight-video` Agent Skill in `.agents/skills/`, mirrored to `.claude/skills/`.
- Machine paths moved into `kit.config.json`.

## 2026-10-28: production at volume
- `make.py` (draft · preview · voice · final · all) and `batch.py` (queue, voice and render overlapped, `--quiet`).
- Generated, license-free music library (10 moods × 3 tracks).
- 108 icons; 11 new elements: person, product, rating, pie, share, ranking, funnel, KPI, milestones, map, clip.
- Real footage (`ingest.py` → `clip`), web screenshots (`shot.mjs`), image `pan`.
- `cutdown.py` (long → Short), `thumb.py` (three thumbnails or covers), `publish.py` (publish sheet + SRT captions), `review.py`.
- Quality: scenes never open empty, background follows the transition, continuous wipe reveal, whole-word cue matching,
  dead-air lint, contrast QA, on-colour tokens, many layout fixes.

## 2026-10-28: every format
- `meta.format`: landscape 16:9, vertical 9:16 (Shorts/TikTok/Reels), square 1:1, portrait 4:5.
- Layouts reflow on tall canvases, elements scale up for phones, pop captions, platform safe zones checked by QA.

## 2026-10-27: v3, a library rather than a template
- Compose scenes from elements, motions and layouts; 7 looks; variety checks; catalog and gallery.

## 2026-10-27: v2
- Top-tier polish of the original templates; the Grok Bot developer episode.

## 2026-10-27: v1
- Deterministic DOM renderer, word-timed narration, 1080p60 output.
