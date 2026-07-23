---
phase: quick
plan: 260723-mis
subsystem: project-overlay-media
tags: [css, ffmpeg, sharp, convert-media, swing-space, floor-0, game-projects-data]
requires: []
provides: [swing-space-css-fix, swing-space-media-refresh, floor-0-gameplay-video]
affects: [src/css/projects.less, src/data/GameProjectsData.ts, public/img/projects/swing-space, public/img/projects/floor-0]
tech-stack:
  added: []
  patterns: [reused scripts/convert-media.js exported gifToMp4/extractPoster/toWebp via throwaway node -e scripts rather than editing the manifest pipeline]
key-files:
  created:
    - public/img/projects/floor-0/Floor0vid2-web.mp4
  modified:
    - src/css/projects.less
    - src/data/GameProjectsData.ts
    - public/img/projects/swing-space/SwingSpaceVid.mp4
    - public/img/projects/swing-space/SwingSpaceGIF3.mp4
    - public/img/projects/swing-space/SwingSpaceGIF3-poster.webp
    - public/img/projects/swing-space/SwingSpaceSC1.webp
    - public/img/projects/swing-space/SwingSpaceSC2.webp
    - public/img/projects/swing-space/SwingSpaceSC1.png
    - public/img/projects/swing-space/SwingSpaceSC2.png
decisions:
  - SwingSpaceGIF3.mp4 (timeline thumbnail) produced via fs.copyFileSync from the freshly-encoded SwingSpaceVid.mp4 rather than a second veryslow ffmpeg pass, since both use the identical NEWSwingSpaceVid.mp4 source and identical gifToMp4 settings (byte-identical output confirmed via cmp)
  - NEWSwingSpaceVid.mp4 / NEWSwingSpaceSC.png / NEWSwingSpaceSC1.png left in place, untracked — deletion deferred to user decision (see Open Question below)
metrics:
  duration: 25min
  completed: 2026-07-23
status: complete
---

# Quick Task 260723-mis: Regenerate SwingSpace Media, Fix Missing CSS, Add Floor Zero Video Summary

Three independently-revertable commits: committed the already-present `.pc-video`/`.swing-space-*` CSS fix, regenerated all 7 SwingSpace overlay/timeline assets from the user's new source files via `scripts/convert-media.js`'s exported functions, and added a compressed 3.5MB gameplay video to the Floor Zero overlay (raw 53.9MB master preserved).

## Performance

- **Tasks:** 4
- **Files modified:** 10 (1 CSS, 7 SwingSpace media, 1 Floor Zero video, 1 data file edit)

## Accomplishments
- Committed the missing `.pc-video`/`.swing-space-video`/`.swing-space-shots`/`.swing-space-shot` CSS rules (base + `@media (min-width: 620px)`) that had been referenced but unstyled since Phase 1 (01-03)
- Regenerated `SwingSpaceVid.mp4`, `SwingSpaceGIF3.mp4` (byte-identical, avoided redundant veryslow encode), `SwingSpaceGIF3-poster.webp`, `SwingSpaceSC1/SC2.webp`, and `SwingSpaceSC1/SC2.png` from the new `NEWSwingSpaceVid.mp4`/`NEWSwingSpaceSC.png`/`NEWSwingSpaceSC1.png` sources
- Compressed `Floor0vid2.mp4` (53.9MB raw master) to `Floor0vid2-web.mp4` (3.5MB) and wired a `<video class="pc-video">` block into the Floor Zero overlay, positioned above the existing screenshots

## Task Commits

1. **Task 1: Commit the projects.less CSS completeness fix** - `11a5b38` (fix)
2. **Task 2: Regenerate SwingSpace media from new sources** - `855e7ba` (chore)
3. **Task 3: Compress Floor0vid2 + wire pc-video block** - `f13289a` (feat)
4. **Task 4: Final sanity check** - this SUMMARY.md (no code changes)

## Files Created/Modified
- `src/css/projects.less` - Added `.pc-video`/`.swing-space-*` base + media rules (Task 1)
- `public/img/projects/swing-space/SwingSpaceVid.mp4` - Re-encoded from NEWSwingSpaceVid.mp4 (2.24MB)
- `public/img/projects/swing-space/SwingSpaceGIF3.mp4` - Byte-identical copy of SwingSpaceVid.mp4 (timeline thumbnail)
- `public/img/projects/swing-space/SwingSpaceGIF3-poster.webp` - First-frame poster extracted from new video
- `public/img/projects/swing-space/SwingSpaceSC1.webp` / `SwingSpaceSC2.webp` - Re-converted from NEWSwingSpaceSC/NEWSwingSpaceSC1
- `public/img/projects/swing-space/SwingSpaceSC1.png` / `SwingSpaceSC2.png` - PNG masters overwritten with new content
- `public/img/projects/floor-0/Floor0vid2-web.mp4` - New compressed gameplay video (3.5MB, from 53.9MB raw master)
- `src/data/GameProjectsData.ts` - Added `<video class="pc-video">` block to Floor Zero overlay, above screenshots

## Decisions Made
- SwingSpaceGIF3.mp4 built via `fs.copyFileSync` from SwingSpaceVid.mp4 instead of a second identical `veryslow` ffmpeg encode (same source, same settings) — confirmed byte-identical via `cmp`
- Floor Zero video block uses base `.pc-video` class only (no `swing-space-video` modifier, which is SwingSpace-specific sizing), matching the plan's instruction
- Both throwaway `node -e`-equivalent conversion scripts were written to the session scratchpad (outside the repo) and deleted immediately after each run — no scratch files left in the repo

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## Open Question for Josef

The three raw source files (`NEWSwingSpaceVid.mp4`, `NEWSwingSpaceSC.png`, `NEWSwingSpaceSC1.png`) under `public/img/projects/swing-space/` have now been folded into the committed named assets (`SwingSpaceVid.mp4`, `SwingSpaceGIF3.mp4`, `SwingSpaceSC1.png`/`.webp`, `SwingSpaceSC2.png`/`.webp`). **Delete them now, or keep them as masters?** Left in place, untracked, awaiting your call.

Floor Zero compressed video landed at 3.5MB — well under the 10MB flag threshold, so no oversized-output concern to raise.

## Self-Check: PASSED

- FOUND: src/css/projects.less (37 insertions confirmed in commit 11a5b38)
- FOUND: public/img/projects/swing-space/SwingSpaceVid.mp4, SwingSpaceGIF3.mp4, SwingSpaceGIF3-poster.webp, SwingSpaceSC1.webp, SwingSpaceSC2.webp, SwingSpaceSC1.png, SwingSpaceSC2.png (all present, both mp4s <10MB and byte-identical)
- FOUND: public/img/projects/floor-0/Floor0vid2-web.mp4 (3.5MB, <10MB) and public/img/projects/floor-0/Floor0vid2.mp4 (53.9MB master preserved)
- FOUND: commit 11a5b38 in `git log --oneline`
- FOUND: commit 855e7ba in `git log --oneline`
- FOUND: commit f13289a in `git log --oneline`
- FOUND: src/App.vue and src/components/ProjectDetailsOverlay.vue still show as modified-but-unstaged (`git status --porcelain`) — unrelated redesign work untouched throughout
- FOUND: no throwaway conversion scripts remaining in the repo (scratchpad checked, empty)

## Next Phase Readiness

- SwingSpace overlay now correctly styled and refreshed from new sources; Floor Zero has its first gameplay video
- Open item: user decision needed on deleting vs. keeping the three `NEWSwingSpace*` raw source files (see Open Question above)
- Josef's unrelated App.vue/ProjectDetailsOverlay.vue redesign work remains uncommitted and untouched, ready for him to continue separately

---
*Phase: quick*
*Completed: 2026-07-23*
