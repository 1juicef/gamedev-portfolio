---
phase: 03-visual-polish-resume-site-metadata
reviewed: 2026-07-22T00:00:00Z
depth: quick
files_reviewed: 2
files_reviewed_list:
  - src/App.vue
  - src/views/Resume.vue
findings:
  critical: 0
  warning: 1
  info: 1
  total: 2
status: issues_found
---

# Phase 3: Code Review Report

**Reviewed:** 2026-07-22T00:00:00Z
**Depth:** quick
**Files Reviewed:** 2
**Status:** issues_found

## Summary

This is a gap-closure pass consisting of exactly two CSS value edits: `src/views/Resume.vue` gained `padding-top: 48px` on `.resume-page` (unconditional, no media query), and `src/App.vue`'s shared `.main, .header, .footer { max-width: ... }` rule (inside the `min-width: 620px` breakpoint) changed from `1280px` to `1600px`.

Checked every consumer of `.main`'s width cascade (`GameProjects.vue`, `ProjectsList.vue`, `Header.vue`, `Footer.vue`, `ProjectDetailsOverlay.vue`) for hardcoded assumptions about the old 1280px ceiling. No other file in the codebase references the literal `1280` value, and the modal overlay (`ProjectDetailsOverlay.vue`) uses `position: fixed`, so it's unaffected by `.main`'s width entirely. `ProjectsList.vue`'s grid has its own internal `max-width: 900px` cap, and `Resume.vue`'s image has its own `max-width: 1200px` cap — both are independently bounded and unaffected by the container widening. The one area with real exposure is `GameProjects.vue`'s bespoke timeline layout, which has no internal max-width cap of its own and will scale directly with the new 1600px ceiling.

## Warnings

### WR-01: GameProjects timeline has no independent width cap, so it now scales ~27% wider on large viewports

**File:** `src/App.vue:135-138` (interacts with `src/views/GameProjects.vue:250-265`)
**Issue:** `.project-image-wrap` / `.project-copy` in `GameProjects.vue` use `flex: 1 1 0` with `flex-basis: 58%` / `42%` and no `max-width` of their own — they simply fill whatever width `.main` gives them. Raising `.main`'s cap from 1280px to 1600px means on viewports ≥ ~1696px (1600px content + 96px horizontal padding), the project thumbnail column grows from ~687px (58% of the old 1184px effective content width) to ~872px (58% of 1504px) — a ~27% increase. The thumbnail sources are pre-rendered GIFs/MP4s at fixed resolution; displaying them ~27% larger than before risks visible upscale blur/pixelation on ultra-wide monitors that wasn't present at the old cap. `ProjectsList.vue` and `Resume.vue` are safe because they each have their own internal max-width, but the timeline row has none.
**Fix:** Either confirm the source thumbnail assets are high enough resolution to look sharp at ~872px display width, or add an explicit cap to the timeline itself so it doesn't silently ride the shared container width all the way to 1600px, e.g.:
```css
/* src/views/GameProjects.vue */
.project-timeline {
  max-width: 1280px; /* keep timeline row width independent of the shared .main cap */
}
```

## Info

### IN-01: New Resume padding-top stacks inconsistently with `.main`'s own padding across breakpoints

**File:** `src/views/Resume.vue:16-22` (interacts with `src/App.vue:114-133`)
**Issue:** `.resume-page`'s new `padding-top: 48px` is unconditional (not inside a media query), while `.main`'s own top padding differs by breakpoint: `16px` below 620px, `0px` at/above 620px. That means the total top gap above the resume image is `64px` on mobile (`16 + 48`) but `48px` on desktop (`0 + 48`) — a real, possibly-unintended difference in visual spacing between the two breakpoints, even though the same `48px` value was added in both cases.
**Fix:** If a consistent visual gap across breakpoints was the goal, scope the mobile value down (e.g. `padding-top: 32px` below 620px, `48px` at/above) to normalize the combined total; if the current asymmetry is intentional, no action needed — flagging for confirmation only.

---

_Reviewed: 2026-07-22T00:00:00Z_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: quick_
