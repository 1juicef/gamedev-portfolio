---
phase: 03-visual-polish-resume-site-metadata
plan: 01
subsystem: ui
tags: [vue, less, timeline, video-embed, ffmpeg, sharp]

# Dependency graph
requires:
  - phase: 01-media-performance-optimization
    provides: scripts/convert-media.js gifToMp4/extractPoster pipeline reused for the Dispater asset swap
provides:
  - Restrained GameProjects timeline spacing/typography snapped to the UI-SPEC 4px scale
  - Persistent underline click affordance on timeline project titles
  - DispaterGif.mp4/-poster.webp converted assets, timeline repointed to them
  - DispaterGif2 content relocated into the Dispater overlay as a playable video
affects: [03-02]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Direct gifToMp4()/extractPoster() calls scoped to the single new asset instead of running the full convert-media.js pipeline, avoiding unrelated re-conversion of already-generated assets"

key-files:
  created:
    - public/img/projects/dispater/DispaterGif.mp4
    - public/img/projects/dispater/DispaterGif-poster.webp
  modified:
    - src/views/GameProjects.vue
    - src/data/GameProjectsData.ts
    - scripts/convert-media.js

key-decisions:
  - "Ran gifToMp4/extractPoster directly for the new DispaterGif entry rather than the full convert-media.js pipeline, to avoid re-touching the other 3 already-converted video assets and all screenshots"

patterns-established:
  - "Scoped direct pipeline-function calls for single-asset conversions (mirrors the Phase 1 Floor0gif1 precedent)"

requirements-completed: [POLISH-01]

coverage:
  - id: D1
    description: "Timeline spacing/typography snapped to the UI-SPEC 4px scale (48px row gap/padding desktop, 32px mobile padding, 2.1em/1.1 title, 1.7 summary line-height)"
    requirement: "POLISH-01"
    verification:
      - kind: unit
        ref: "grep '2.1em' src/views/GameProjects.vue"
        status: pass
      - kind: unit
        ref: "npm run lint"
        status: pass
    human_judgment: true
    rationale: "Visual restraint/premium feel is a subjective read; per human_verify_mode=end-of-phase this is confirmed at end-of-phase read-through, not per-plan"
  - id: D2
    description: "Persistent underline click affordance on .project-title-link, accenting to #f4cde6 on hover/focus-visible, no new color token introduced"
    requirement: "POLISH-01"
    verification:
      - kind: unit
        ref: "grep 'border-bottom-color' src/views/GameProjects.vue && grep 'focus-visible' src/views/GameProjects.vue"
        status: pass
    human_judgment: false
  - id: D3
    description: "Alternating left/right timeline row layout (project-row--reverse) preserved, not restructured"
    requirement: "POLISH-01"
    verification:
      - kind: unit
        ref: "grep 'project-row--reverse' src/views/GameProjects.vue"
        status: pass
    human_judgment: false
  - id: D4
    description: "DispaterGif.gif converted to DispaterGif.mp4 + DispaterGif-poster.webp via the existing media pipeline; Dispater timeline thumbnail repointed to them"
    requirement: "POLISH-01"
    verification:
      - kind: unit
        ref: "test -f public/img/projects/dispater/DispaterGif.mp4 && test -f public/img/projects/dispater/DispaterGif-poster.webp && grep 'DispaterGif.mp4' src/views/GameProjects.vue"
        status: pass
    human_judgment: false
  - id: D5
    description: "DispaterGif2's content moved into the Dispater overlay as a playable video (reusing .pc-video), screenshots/trailer/link intact"
    requirement: "POLISH-01"
    verification:
      - kind: unit
        ref: "grep 'DispaterGif2.mp4' src/data/GameProjectsData.ts && grep 'pc-video' src/data/GameProjectsData.ts"
        status: pass
    human_judgment: true
    rationale: "Confirming the overlay video actually plays and looks correct alongside existing screenshots/trailer requires a human open the overlay in-browser; per human_verify_mode=end-of-phase"

duration: 15min
completed: 2026-07-22
status: complete
---

# Phase 3 Plan 1: GameProjects Timeline Restraint + Dispater Asset Swap Summary

**Snapped GameProjects timeline spacing/typography to the UI-SPEC 4px scale, added a persistent underline click affordance on project titles, and swapped Dispater's timeline/overlay assets (DispaterGif.gif now drives the thumbnail, DispaterGif2 relocated into the overlay as a video) via the existing ffmpeg/sharp pipeline.**

## Performance

- **Duration:** ~15 min
- **Started:** 2026-07-22T19:23:53Z (approx, first commit 21:23:53+02:00)
- **Completed:** 2026-07-22T19:25:05Z (approx, last commit 21:25:05+02:00)
- **Tasks:** 3
- **Files modified:** 5 (2 code files + 1 script + 2 generated assets)

## Accomplishments
- Tightened `.project-timeline`/`.project-row` spacing to the 4px scale (48px gap/desktop row padding, 32px mobile row padding), title to 2.1em/line-height 1.1, summary line-height to 1.7
- Added a persistent `border-bottom` underline affordance on `.project-title-link` that accents to `#f4cde6` on hover and `:focus-visible`, with no new color token introduced
- Preserved the alternating `project-row--reverse` timeline layout unchanged
- Added a `DispaterGif` manifest entry to `scripts/convert-media.js` and generated `DispaterGif.mp4` + `DispaterGif-poster.webp` via a scoped direct call to the existing `gifToMp4`/`extractPoster` pipeline functions
- Repointed the Dispater timeline thumbnail (`thumbVideos`/`thumbPosters`) to the new `DispaterGif` assets, and embedded `DispaterGif2.mp4` as a `.pc-video` element inside the Dispater overlay (after screenshots, before "About this game"), alongside the existing screenshots/trailer/itch.io link

## Task Commits

Each task was committed atomically:

1. **Task 1: Timeline restraint pass + persistent title click affordance** - `7a3d2dd` (feat)
2. **Task 2: Convert DispaterGif.gif to timeline mp4 + poster via the existing pipeline** - `795c92d` (feat)
3. **Task 3: Swap Dispater timeline map values + embed DispaterGif2 in the overlay** - `57916a6` (feat)

_Note: No TDD tasks in this plan — all three are `type="auto"`._

## Files Created/Modified
- `src/views/GameProjects.vue` - Restrained spacing/typography, title underline affordance, Dispater thumbVideos/thumbPosters repointed to DispaterGif assets
- `src/data/GameProjectsData.ts` - Dispater overlay gains a `.pc-video` block sourcing DispaterGif2.mp4
- `scripts/convert-media.js` - New `["dispater", "DispaterGif"]` entry in `videoAssets` manifest (DispaterGif2 entry retained)
- `public/img/projects/dispater/DispaterGif.mp4` - Generated timeline video (new)
- `public/img/projects/dispater/DispaterGif-poster.webp` - Generated poster frame (new)

## Decisions Made
- Ran `gifToMp4`/`extractPoster` directly on the single new `DispaterGif` asset (via a one-off `node -e` invocation requiring `scripts/convert-media.js`) instead of running the full `node scripts/convert-media.js` pipeline, which would have needlessly re-encoded the other 3 already-converted video assets and re-compressed all screenshots. Mirrors the Phase 1 precedent for the Floor0gif1 trim regeneration (see STATE.md decisions).

## Deviations from Plan

None - plan executed exactly as written, aside from the scoped-conversion decision noted above (which stays within Task 2's stated acceptance criteria: manifest entry present, both output files exist).

## Issues Encountered
None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Timeline restraint pass and Dispater asset swap complete; ready for plan 03-02 (remaining visual-polish/resume/site-metadata work in this phase)
- End-of-phase human read-through (per `human_verify_mode=end-of-phase`) still pending to confirm the restrained timeline reads premium and the Dispater swap looks correct in-browser — flagged as `human_judgment: true` on D1 and D5 above

---
*Phase: 03-visual-polish-resume-site-metadata*
*Completed: 2026-07-22*

## Self-Check: PASSED

All created files found on disk, all task commit hashes found in git log.
