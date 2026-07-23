---
phase: quick
plan: 260723-glj
subsystem: project-overlay-content
tags: [itch.io, badge, css, game-projects-data]
requires: []
provides: [itch-badge-link-treatment]
affects: [src/data/GameProjectsData.ts, src/css/projects.less]
tech-stack:
  added: []
  patterns: [itch.io badge image replaces bland text link, wrapped in existing anchor]
key-files:
  created: []
  modified:
    - src/data/GameProjectsData.ts
    - src/css/projects.less
decisions:
  - Isolated the .itch-badge CSS addition from Josef's uncommitted swing-space/pc-video CSS rules in the same file via hand-built git blob + update-index --cacheinfo (mirrors prior Phase 3 precedent), leaving his pending edits untouched and uncommitted in the working tree
metrics:
  duration: 8min
  completed: 2026-07-23
status: complete
---

# Quick Task 260723-glj: Replace itch.io Badge Image Summary

Replaced the three plain-text "Play on itch.io" links (Drag Rush, Dispater, Floor Zero) with the itch.io badge image (`public/img/projects/itchBadge.png`), each still wrapped in its original clickable `<a href target="_blank">` link, and added a `.itch-badge` sizing rule to `projects.less` capping the badge at 60%/200px on mobile and 200px on desktop with `height: auto` to preserve the ~3.25:1 aspect ratio.

## Tasks Completed

### Task 1: Replace the 3 itch.io text links with badge images
- **Commit:** `8c8a0b0`
- Changed inner content of the three itch.io `<a>` links in `src/data/GameProjectsData.ts` from `Play on itch.io` text to `<img class="itch-badge" src="img/projects/itchBadge.png" alt="Play on itch.io" loading="lazy" />`.
- Original URLs and `target="_blank"` preserved for all three (Drag Rush, Dispater, Floor Zero).
- SwingSpace entry left untouched (it has no itch.io link).

### Task 2: Add .itch-badge sizing CSS
- **Commit:** `23bbd16`
- Added `.itch-badge` rule to `src/css/projects.less` inside `.dialog-content`: base rule (`width: 60%; max-width: 200px; height: auto; display: inline-block;`) plus a `@media (min-width: 620px)` override (`width: 200px; max-width: 200px;`), following the existing `.pc-screenshot` pattern.
- **Note:** `src/css/projects.less` already had Josef's uncommitted swing-space/pc-video CSS additions in the working tree at task start. To keep this quick task's commit scoped to only the `.itch-badge` rule, the addition was isolated into its own git blob (built from the last committed version of the file + only the new lines) and staged via `git update-index --cacheinfo`, rather than `git add` on the whole file. Josef's other pending CSS edits remain uncommitted and untouched in the working tree exactly as they were before this task ran.

## Verification

- `grep -c 'class="itch-badge"' src/data/GameProjectsData.ts` → 3 (pass)
- `grep -c 'Play on itch.io</a>' src/data/GameProjectsData.ts` → 0 (pass)
- `grep -c 'itch-badge' src/css/projects.less` → 2 (pass)
- SwingSpace entry in `GameProjectsData.ts`: unchanged (verified via diff — no itch.io link added, only the other three entries touched)
- Visual check (badge renders correctly, links open the right itch.io pages, sizing looks right on mobile/desktop) not run in this session — optional per plan, recommend Josef spot-check via `npm run serve`.

## Deviations from Plan

None — plan executed exactly as written, aside from the git-isolation mechanic noted above (which was necessary process, not a deviation in delivered functionality).

## Self-Check: PASSED

- FOUND: src/data/GameProjectsData.ts (3 `itch-badge` occurrences confirmed via grep)
- FOUND: src/css/projects.less (2 `itch-badge` occurrences confirmed via grep)
- FOUND commit 8c8a0b0 in `git log --oneline`
- FOUND commit 23bbd16 in `git log --oneline`
