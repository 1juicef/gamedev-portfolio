---
phase: quick-260801-pnq
plan: 01
subsystem: ui
tags: [vue-router, vue2, routing, header]

requires: []
provides:
  - "Routed project details page at /project/:id, replacing the stacked ProjectDetailsOverlay modal"
  - "Router scrollBehavior: top-of-page on new navigations, restored position on back"
  - "Sticky opaque site header on every route"
affects: []

tech-stack:
  added: []
  patterns:
    - "Project detail content rendered as its own routed view instead of a modal toggled by popup state"
    - "@headerBgColor variable matches the fixed-attachment page gradient's viewport-top stop, keeping the sticky header seamless against scroll"

key-files:
  created:
    - src/views/ProjectDetails.vue
  modified:
    - src/router/index.ts
    - src/views/GameProjects.vue
    - src/components/ProjectsList.vue
    - src/views/Resume.vue
    - src/css/variables.less
    - src/App.vue
    - src/components/Header.vue

key-decisions:
  - "Kept the dialog-content wrapper class verbatim on the new page since every project-content style in src/css/projects.less nests under that selector"
  - "Single /project/:id route searches both GameProjectsData and OtherProjectsData (OtherProjectsData is currently empty, no id collision risk)"
  - "Legacy #/game-projects?project=<id> deep link now redirects (router.replace) to the new /project/<id> route instead of opening the retired modal"

patterns-established:
  - "Header centering moved from a shared App.vue selector to .nav-bar inside Header.vue, so .header itself can go full-bleed sticky"

requirements-completed: [QUICK-260801-PNQ]

coverage:
  - id: D1
    description: "Project details render as a routed page at #/project/<id>, styled identically to the old modal, scrolled to top on navigation"
    requirement: "QUICK-260801-PNQ"
    verification:
      - kind: manual_procedural
        ref: "checkpoint:human-verify — Task 4 in 260801-pnq-PLAN.md"
        status: unknown
    human_judgment: true
    rationale: "Visual/interactive correctness (styling parity, scroll-to-top, back-button restore) requires a human browser check per the plan's checkpoint gate; automated build/lint/grep checks passed but cannot confirm visual fidelity."
  - id: D2
    description: "Timeline cards, ProjectsList grid items, and Resume project links navigate to /project/<id>; legacy ?project= query redirects"
    requirement: "QUICK-260801-PNQ"
    verification:
      - kind: manual_procedural
        ref: "checkpoint:human-verify — Task 4 in 260801-pnq-PLAN.md"
        status: unknown
    human_judgment: true
    rationale: "Click-target and redirect behavior confirmed by code review and grep checks, but end-to-end click-through verification is reserved for the human-verify checkpoint per the plan."
  - id: D3
    description: "Header is sticky and opaque on every route, nav placement unchanged, /one-page scroll nav still works"
    requirement: "QUICK-260801-PNQ"
    verification:
      - kind: manual_procedural
        ref: "checkpoint:human-verify — Task 4 in 260801-pnq-PLAN.md"
        status: unknown
    human_judgment: true
    rationale: "Visual seamlessness of the sticky bar against the fixed-attachment gradient background requires a human browser check; not verifiable via build/lint alone."

duration: 25min
completed: 2026-08-01
status: complete
---

# Quick Task 260801-pnq: Split ProjectDetailsOverlay into a routed page Summary

**Retired the stacked ProjectDetailsOverlay modal in favor of a routed `/project/:id` page with scroll-to-top/back-restore behavior, and made the site header sticky and opaque on every route.**

## Performance

- **Duration:** ~25 min
- **Started:** 2026-08-01T18:34:00Z
- **Completed:** 2026-08-01T18:37:30Z
- **Tasks:** 3 of 4 (code tasks complete; Task 4 is a `checkpoint:human-verify` gate, intentionally left pending — see below)
- **Files modified:** 8 (1 created, 6 modified, 1 deleted)

## Accomplishments
- New `src/views/ProjectDetails.vue` renders project write-ups as a full page at `/project/:id`, reusing the `.dialog-content` styling contract from `src/css/projects.less` verbatim, with an unknown-id redirect to `/404`
- Router gained a `scrollBehavior`: fresh navigations start at the top, back navigation restores the saved scroll position after the 0.2s fade transition
- All three entry points (timeline cards in `GameProjects.vue`, grid items in `ProjectsList.vue`, and Resume "Selected Projects" links) now push/link to `/project/<id>` instead of toggling popup state; the legacy `?project=<id>` query on `/game-projects` redirects to the new route
- `ProjectDetailsOverlay.vue` deleted; no remaining references anywhere in `src/`
- Header is now `position: sticky` with an opaque `@headerBgColor` (`#2b123f`, matching the fixed-gradient viewport-top color) on every route; the now-redundant `/one-page`-only translucent sticky rule was removed since the base header covers that case

## Task Commits

Each task was committed atomically:

1. **Task 1: End-to-end project page — route, view, scroll behavior** - `f8be049` (feat)
2. **Task 2: Point every entry point at the route, retire the overlay component** - `f4b6e2b` (feat)
3. **Task 3: Sticky opaque header bar** - `15f8ff9` (feat)

Task 4 (`checkpoint:human-verify`, gate="blocking") was intentionally not executed by this run — see "Pending Checkpoint" below.

## Files Created/Modified
- `src/views/ProjectDetails.vue` - New routed view rendering a project's `htmlDescription` as a full page, with Escape/back-button dismissal
- `src/router/index.ts` - Added `/project/:id` route and `scrollBehavior` option
- `src/views/GameProjects.vue` - `showDetails` now pushes `/project/<id>`; overlay import/element/popup data removed; `mounted()` redirects legacy `?project=` links
- `src/components/ProjectsList.vue` - Same treatment as GameProjects.vue; also removed a stray commented-out block inside `showDetails`
- `src/views/Resume.vue` - Selected Projects `router-link` now targets `/project/<id>` directly
- `src/components/ProjectDetailsOverlay.vue` - Deleted (superseded by `ProjectDetails.vue`)
- `src/css/variables.less` - Added `@headerBgColor: #2b123f`
- `src/App.vue` - Narrowed the shared `.main, .header, .footer` max-width rule to `.main, .footer` only
- `src/components/Header.vue` - `.header` is sticky/opaque full-bleed; `.nav-bar` carries the 1600px centering in a new `min-width: 620px` query; removed `.header--one-page` rule and its class binding

## Decisions Made
- Kept the `.dialog-content` wrapper class exactly as the overlay used it — that class is the sole selector every project-content style in `projects.less` nests under, so dropping it would silently unstyle all project write-ups
- Concatenated `GameProjectsData` and `OtherProjectsData` for the single `/project/:id` lookup rather than two separate routes, since ids are unique kebab-case strings and `OtherProjectsData` is currently empty (no collision risk)
- Used `router.replace` (not `push`) for both the unknown-id → `/404` redirect and the legacy `?project=` → `/project/<id>` redirect, so neither adds an extra back-button stop

## Deviations from Plan

None - plan executed exactly as written for Tasks 1-3.

## Issues Encountered

None. Build and lint passed cleanly after each of the three tasks with no auto-fixes needed.

## Pending Checkpoint

**Task 4 (`checkpoint:human-verify`, `gate="blocking"`) is outstanding.** Per this run's constraints, only the human running `npm run serve` in a browser can approve the visual/interactive verification described in the plan:

1. Timeline → page navigation (SwingSpace thumbnail → `#/project/swing-space`, top-of-page, styling parity)
2. Back button restores prior scroll position (both browser Back and the in-page Back button)
3. All three click targets (thumbnail, title, View Details cue) reach the same project page
4. Resume "Selected Projects" links open the project page directly
5. Legacy `#/game-projects?project=dispater` still lands on the Dispater project page
6. `#/project/nope` lands on the 404 page
7. Sticky header stays pinned, fully opaque, seamless at the very top of the page, on both wide and narrow viewports
8. `/one-page` route still shows its scroll-button nav with active underline and swapping mascot

Run `npm run serve` and walk through the above to close out this quick task. This SUMMARY is marked `status: complete` because all 3 code tasks passed verification (build + lint + targeted greps after each task); the human-verify checkpoint is the only remaining item.

## Self-Check: PASSED

- FOUND: src/views/ProjectDetails.vue
- FOUND: src/router/index.ts (contains `/project/:id` and `scrollBehavior`)
- FOUND: commit f8be049
- FOUND: commit f4b6e2b
- FOUND: commit 15f8ff9
- CONFIRMED: `src/components/ProjectDetailsOverlay.vue` no longer exists and has zero references in `src/`

## Next Phase Readiness
No blockers. Once the human-verify checkpoint is approved (or issues from it are addressed in a follow-up quick task), this quick task can be considered fully closed. `src/data/GameProjectsData.ts` retains unrelated pre-existing uncommitted edits from prior work, intentionally left untouched and unstaged by this run.

---
*Phase: quick-260801-pnq*
*Completed: 2026-08-01*
