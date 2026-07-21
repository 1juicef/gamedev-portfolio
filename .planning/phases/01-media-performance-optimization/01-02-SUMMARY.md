---
phase: 01-media-performance-optimization
plan: 02
subsystem: ui
tags: [vue2, intersectionobserver, video, lazy-loading, performance]

# Dependency graph
requires:
  - phase: 01-media-performance-optimization (plan 01-01)
    provides: converted MP4 clips + WebP posters for all four projects (drag-rush, dispater, floor-0, swing-space)
provides:
  - Reusable LazyVideoThumbnail.vue component (viewport-gated muted/looping video with poster fallback)
  - GameProjects.vue timeline rewired so all four project thumbnails use one uniform component binding
  - Removal of the always-loaded YouTube trailer iframe from the timeline (drag-rush/dispater special case)
affects: [01-03 (overlay/htmlDescription media work), any future timeline UI polish]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "IntersectionObserver-gated video autoplay in a Vue 2 Options API component (mounted/beforeDestroy lifecycle, rootMargin 200px)"
    - "id-keyed lookup-object convention (thumbVideos/thumbPosters) mirroring existing projectRows/summaries pattern in GameProjects.vue"

key-files:
  created:
    - src/components/LazyVideoThumbnail.vue
  modified:
    - src/views/GameProjects.vue

key-decisions:
  - "Applied the project-image--swing-space modifier class to the wrapping <button> rather than the LazyVideoThumbnail component root, avoiding reliance on Vue's scoped-CSS root-element class merging behavior."
  - "Removed .project-image-wrap-video/iframe and the now-unused .project-image scoped rules from GameProjects.vue since the aspect/border styling moved into LazyVideoThumbnail.vue's own scoped styles."

patterns-established:
  - "LazyVideoThumbnail.vue: reusable viewport-gated video thumbnail (props src/poster, IntersectionObserver lifecycle, graceful no-IntersectionObserver fallback)"

requirements-completed: [MEDIA-01, MEDIA-03]

coverage:
  - id: D1
    description: "Reusable LazyVideoThumbnail.vue component: poster shown until near-viewport, then mounts a muted/looping/playsinline video (preload=none) that autoplays only in-viewport"
    requirement: "MEDIA-03"
    verification:
      - kind: unit
        ref: "npm run lint (src/components/LazyVideoThumbnail.vue)"
        status: pass
      - kind: other
        ref: "grep-based structural checks: IntersectionObserver, beforeDestroy, preload=\"none\", muted/loop/playsinline, loading=\"lazy\" before :src on poster img"
        status: pass
    human_judgment: true
    rationale: "Automated checks confirm structure/markup only; actual in-browser autoplay-on-scroll behavior and absence of a black-flash before the poster loads require a visual scroll-through smoke test."
  - id: D2
    description: "All four GameProjects.vue timeline thumbnails (drag-rush, dispater, floor-0, swing-space) render through LazyVideoThumbnail via one uniform binding; drag-rush/dispater YouTube iframe special case removed; click-to-overlay unchanged for all four"
    requirement: "MEDIA-01"
    verification:
      - kind: unit
        ref: "npm run lint (src/views/GameProjects.vue)"
        status: pass
      - kind: other
        ref: "grep checks: embed 0 occurrences outside comments, LazyVideoThumbnail present, single thumbVideos[project.id] binding, swing-space/SwingSpaceGIF3.mp4 wired, showDetails(project) intact"
        status: pass
    human_judgment: true
    rationale: "Structural/lint checks confirm the iframe branch is gone and all four ids are wired to real converted assets, but visual confirmation that SwingSpace keeps its narrower centered presentation and that clicking each of the four thumbnails opens the correct overlay content is a UI judgment call, not something the grep checks prove."

duration: ~20min
completed: 2026-07-21
status: complete
---

# Phase 1 Plan 2: Lazy Video Timeline Thumbnails Summary

**Built LazyVideoThumbnail.vue (IntersectionObserver-gated muted/looping video with poster fallback) and rewired all four GameProjects.vue timeline thumbnails onto it, removing the drag-rush/dispater always-loaded YouTube iframe special case.**

## Performance

- **Duration:** ~20 min
- **Completed:** 2026-07-21T19:41:08Z
- **Tasks:** 2 completed
- **Files modified:** 2 (1 created, 1 modified)

## Accomplishments
- New `src/components/LazyVideoThumbnail.vue`: props `src`/`poster`, IntersectionObserver-driven `hasIntersected` gating (rootMargin `200px 0px`), muted/looping/playsinline `<video preload="none">` with a lazy poster `<img>` fallback, graceful degradation when `IntersectionObserver` is unavailable, and observer cleanup in `beforeDestroy`.
- `GameProjects.vue` timeline now uses one identical `<button @click="showDetails(project)"><LazyVideoThumbnail ... /></button>` markup for all four projects — the `v-if`/`v-else` branch that special-cased drag-rush/dispater with a hard-coded, always-loaded YouTube trailer `<iframe>` is gone entirely.
- Added `thumbVideos` and `thumbPosters` id-keyed lookup maps (mirroring the existing `projectRows`/`summaries` convention) wiring in the four MP4/WebP-poster pairs produced by plan 01-01, including SwingSpace's `SwingSpaceGIF3.mp4` per D-15.
- SwingSpace's narrower centered presentation preserved via the `project-image--swing-space` modifier class (moved onto the wrapping button) and its existing `max-width: 46%`/`40%` scoped rules.
- Removed the now-dead `.project-image-wrap-video`/`iframe` and `.project-image` scoped CSS rules from `GameProjects.vue` (the aspect/border styling technique relocated into `LazyVideoThumbnail.vue`'s own scoped styles).

## Task Commits

Each task was committed atomically:

1. **Task 1: Build the reusable LazyVideoThumbnail.vue component** - `8fb85ef` (feat)
2. **Task 2: Rewire GameProjects.vue so all four thumbnails use LazyVideoThumbnail** - `ef424ee` (feat)

_Note: Task 2's commit also carries pre-existing uncommitted mid-redesign edits already present in the working tree for `GameProjects.vue` (hero copy "Hello there!", swing-space row/summary entries, spacing changes) — these predate this plan's execution (see PROJECT.md Context: "Currently mid-redesign in the working tree (uncommitted)") and were not introduced by this task; git's file-level staging couldn't separate them from this task's own edits without hunk-splitting, which was judged unnecessary risk for a solo-dev working tree already documented as mid-redesign._

## Files Created/Modified
- `src/components/LazyVideoThumbnail.vue` - New reusable viewport-gated video thumbnail component (props `src`/`poster`; data `hasIntersected`/`observer`; lifecycle `mounted`/`beforeDestroy`)
- `src/views/GameProjects.vue` - Rewired timeline thumbnail markup to use `LazyVideoThumbnail` uniformly for all four projects; added `thumbVideos`/`thumbPosters` lookup maps; removed the drag-rush/dispater iframe branch and its now-unused scoped CSS

## Decisions Made
- Applied the `project-image--swing-space` modifier class to the wrapping `<button>` element rather than passing it through to `LazyVideoThumbnail`'s component root — simpler, avoids depending on Vue 2's parent-scoped-CSS-attribute-on-child-root-element behavior, and matches the plan's "thumbnail wrapper/button" wording literally.
- Removed `.project-image` and `.project-image-wrap-video`/`iframe` scoped rules from `GameProjects.vue` entirely (rather than leaving them as dead code) since the plan explicitly called for relocating the aspect/border technique into the new component, and nothing in the rewired template references those classes anymore.

## Deviations from Plan

None - plan executed exactly as written. All four converted MP4/poster assets from plan 01-01 were already present on disk and verified to exist before wiring them in; no additional conversion work was needed in this plan.

## Issues Encountered
None.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- All four timeline thumbnails are lazy, viewport-gated, muted-looping video clips with posters; `npm run lint` passes with no errors.
- The always-loaded YouTube iframe special case is fully removed from the timeline (trailers remain available inside `ProjectDetailsOverlay` per D-09, which is out of scope for this plan).
- Plan 01-03 (overlay/screenshot lazy-loading work) is unblocked and can proceed independently — no shared files with this plan beyond the already-wired asset paths.
- Recommended manual smoke check before considering the phase fully done: `npm run serve` and scroll through the timeline to visually confirm poster-to-video transitions and that autoplay only starts near-viewport for all four projects (flagged as `human_judgment: true` in the coverage block above).

---
*Phase: 01-media-performance-optimization*
*Completed: 2026-07-21*
