---
phase: quick-260801-qi1
plan: 01
subsystem: ui
tags: [vue2, vue-router, modal-overlay, css]

requires:
  - phase: quick-260801-pnq
    provides: "The routed /project/:id page and sticky opaque header this plan partially reverts (header work kept, routing reverted)"
provides:
  - "Project details restored to a stacked modal overlay (ProjectDetailsOverlay.vue) opened in place, no route/URL change, no scroll jump"
  - "/project/:id route, ProjectDetails.vue view, and router scrollBehavior option removed"
  - "Resume page left-aligned 'Resume' h1 heading matching site convention"
  - "Other Stuff page heading renamed to 'Other Projects' (nav label/route/section id unchanged)"
affects: [game-projects, resume, other-stuff, one-page]

tech-stack:
  added: []
  patterns:
    - "Popup/overlay state (showPopup, popupTitle, popupColor, popupContent) owned by the entry-point component (GameProjects.vue, ProjectsList.vue) rather than a shared route or store"
    - "Legacy ?project= query deep link handled in GameProjects.vue mounted(), the one place a one-time window.scrollTo(0,0) is intentionally kept (route entry, not an in-page click)"

key-files:
  created: []
  modified:
    - src/components/ProjectDetailsOverlay.vue
    - src/views/GameProjects.vue
    - src/components/ProjectsList.vue
    - src/views/Resume.vue
    - src/router/index.ts
    - src/views/OtherStuff.vue

key-decisions:
  - "Restored ProjectDetailsOverlay.vue via `git checkout f4b6e2b^ -- <file>` rather than hand-retyping, per plan instruction"
  - "Raised overlay/dialog z-index from 10/11 to 20/21 to explicitly clear the sticky header's z-index:10, since the header didn't exist when the overlay was originally authored"
  - "Added `overscroll-behavior: contain` to `.dialog` so wheel-scrolling to the end of a long write-up doesn't chain into the page behind it"
  - "Resume keeps zero popup state of its own — it links to /game-projects?project=<id> and defers to GameProjects.vue's mounted() handler, keeping OnePage.vue's embedded sections free of duplicated overlay state"

requirements-completed: [QUICK-260801-QI1]

coverage:
  - id: D1
    description: "Clicking a project entry point (thumbnail, title, or View Details cue) opens the write-up as an in-place modal overlay — no URL change, no scroll jump, closes back to the same scroll position"
    requirement: QUICK-260801-QI1
    verification:
      - kind: automated_ui
        ref: "grep verification of showPopup wiring across GameProjects.vue/ProjectsList.vue + absence of /project/ router.push calls (see Task 1 verify block)"
        status: pass
      - kind: manual_procedural
        ref: "Plan Task 5 checkpoint: click SwingSpace thumbnail, confirm no scroll/URL change, close via X/Close/Escape"
        status: unknown
    human_judgment: true
    rationale: "Visual/behavioral scroll-position and stacking-order confirmation requires a running browser session; automated greps confirm the code path but not the rendered outcome"
  - id: D2
    description: "The /project/:id route, ProjectDetails.vue, and router scrollBehavior option are fully removed with no dangling references"
    requirement: QUICK-260801-QI1
    verification:
      - kind: unit
        ref: "Task 2 automated verify: test ! -f src/views/ProjectDetails.vue, grep for scrollBehavior/ProjectDetails in router/index.ts and src/, npm run build, npm run lint"
        status: pass
    human_judgment: false
  - id: D3
    description: "Resume page has a left-aligned 'Resume' h1 heading matching Contact/Other Stuff convention; name demoted to h2.resume-name"
    requirement: QUICK-260801-QI1
    verification:
      - kind: unit
        ref: "Task 3 automated verify: grep for <h1>Resume</h1>, resume-name class/rule, absence of resume-heading h1 and text-align: center, npm run build, npm run lint"
        status: pass
      - kind: manual_procedural
        ref: "Plan Task 5 checkpoint item 8: visual confirmation at #/resume, including narrow viewport"
        status: unknown
    human_judgment: true
    rationale: "Visual alignment/typography match against Contact page requires human eyeballing in a running browser"
  - id: D4
    description: "Other Stuff page heading reads 'Other Projects'; nav label, route path, section id, and legacy OtherProjects.vue all unchanged"
    requirement: QUICK-260801-QI1
    verification:
      - kind: unit
        ref: "Task 4 automated verify: grep for new/old h1 text, other-stuff-grid, Header.vue nav label count, router path, OnePage.vue section id, OtherProjects.vue untouched h1, npm run lint"
        status: pass
    human_judgment: false

duration: ~25min
completed: 2026-08-01
status: complete
---

# Quick Task 260801-qi1: Revert Project Details Route Back to Overlay Summary

**Restored the stacked ProjectDetailsOverlay modal (from git history at f4b6e2b^, with raised z-index and scroll-chain containment) as the project-details UI, deleted the /project/:id routed-page experiment and its scrollBehavior option, and added a "Resume" page heading plus renamed the Other Stuff heading to "Other Projects".**

## Performance

- **Duration:** ~25 min
- **Completed:** 2026-08-01
- **Tasks:** 4 of 5 (Tasks 1-4 complete; Task 5 is a `checkpoint:human-verify` gate, pending)
- **Files modified:** 6 (`ProjectDetailsOverlay.vue` restored+edited, `GameProjects.vue`, `ProjectsList.vue`, `Resume.vue`, `router/index.ts`, `OtherStuff.vue`) + 1 deleted (`ProjectDetails.vue`)

## Accomplishments

- Project write-ups open as an in-page modal overlay again instead of navigating to `/project/:id` — no URL change, and `showDetails()` no longer calls `window.scrollTo`, so the timeline never jumps when a card is clicked
- Overlay is explicitly layered above the sticky header (`z-index: 20`/`21` vs. the header's `z-index: 10`) and scroll containment (`overscroll-behavior: contain`) stops wheel-chaining into the page behind a long write-up
- Routed-page experiment fully retired: `/project/:id` route gone, `ProjectDetails.vue` deleted, router `scrollBehavior` removed, no dangling references anywhere in `src/`
- Resume page gained a left-aligned "Resume" `h1` matching the Contact/Other Stuff convention (zero new CSS needed — inherits from `App.vue`'s global heading rules); the name is now a styled `h2.resume-name` below it
- Other Stuff page heading renamed to "Other Projects" — nav label, route path (`/other-stuff`), section id, and the legacy `OtherProjects.vue` view are all untouched

## Task Commits

Each task was committed atomically:

1. **Task 1: Restore the overlay and rewire every entry point** - `6985ec6` (feat)
2. **Task 2: Retire the routed project page and router plumbing** - `a38f187` (fix)
3. **Task 3: Add a left-aligned "Resume" page heading** - `0ea9360` (feat)
4. **Task 4: Rename the Other Stuff page heading to "Other Projects"** - `2696f08` (docs)

**Plan metadata:** commit pending (orchestrator handles docs commit)

_Task 5 (checkpoint:human-verify) intentionally not attempted by the executor — see "Next Phase Readiness" below._

## Files Created/Modified

- `src/components/ProjectDetailsOverlay.vue` - Restored from git history (`f4b6e2b^`); z-index raised to 20/21, `overscroll-behavior: contain` added to `.dialog`
- `src/views/GameProjects.vue` - Overlay registered and mounted; `showPopup`/`popupTitle`/`popupColor`/`popupContent` state added; `showDetails()` sets popup state only (no navigation, no scroll); `mounted()` legacy `?project=` branch now calls `showDetails()` after a one-time `window.scrollTo(0, 0)` instead of `$router.replace`
- `src/components/ProjectsList.vue` - Same overlay wiring mirrored; `data()` added (component previously had none); `showDetails()` sets popup state only
- `src/views/Resume.vue` - Selected Projects `router-link` retargeted to `/game-projects?project=<id>`; added `<h1>Resume</h1>`; name demoted to `<h2 class="resume-name">`; `.resume-heading h1` style replaced with `.resume-name`
- `src/router/index.ts` - Removed the `/project/:id` route entry and the `scrollBehavior` option from the `VueRouter` constructor
- `src/views/ProjectDetails.vue` - Deleted (`git rm`); markup/styling now lives in the restored overlay
- `src/views/OtherStuff.vue` - `<h1>Other Stuff</h1>` → `<h1>Other Projects</h1>`

## Decisions Made

- Restored `ProjectDetailsOverlay.vue` via `git checkout f4b6e2b^ -- src/components/ProjectDetailsOverlay.vue` rather than hand-retyping, per the plan's explicit instruction, then applied only the two forced style edits (z-index, overscroll-behavior)
- Kept the one-time `window.scrollTo(0, 0)` exclusively inside the `mounted()` deep-link branch (route entry from Resume), never inside `showDetails()` (in-page click) — this is the exact distinction the plan draws as the root-cause fix
- Left `src/data/GameProjectsData.ts`'s pre-existing unrelated uncommitted edits untouched and unstaged throughout all four commits, per the working-tree constraint

## Deviations from Plan

None - plan executed exactly as written for Tasks 1-4.

## Issues Encountered

None. All four `<verify><automated>` blocks (grep checks, `npm run build`, `npm run lint`) passed on first attempt for every task.

## Next Phase Readiness

Task 5 is a `checkpoint:human-verify` gate (`gate="blocking"`) and was deliberately **not** attempted by this executor run — only a human running `npm run serve` in a browser can confirm the 10-point manual verification list in the plan (scroll-position preservation, overlay-vs-header stacking, all three click targets, Resume deep link, heading placement on narrow viewports, etc.).

**Status: pending human verification.** Run `npm run serve`, walk through the 10 checks in the plan's Task 5 `<how-to-verify>` block, and report "approved" or describe what looks wrong to resume.

Verified via `git diff --name-only`: `src/components/Header.vue`, `src/css/variables.less`, and `src/App.vue` show zero changes across all four commits — the sticky opaque header work from the prior quick task is bit-for-bit intact.

## Self-Check: PASSED

- FOUND: src/components/ProjectDetailsOverlay.vue
- CONFIRMED DELETED: src/views/ProjectDetails.vue
- FOUND: .planning/quick/260801-qi1-revert-project-details-route-back-to-ove/260801-qi1-SUMMARY.md
- FOUND commit: 6985ec6
- FOUND commit: a38f187
- FOUND commit: 0ea9360
- FOUND commit: 2696f08

---
*Phase: quick-260801-qi1*
*Completed: 2026-08-01*
