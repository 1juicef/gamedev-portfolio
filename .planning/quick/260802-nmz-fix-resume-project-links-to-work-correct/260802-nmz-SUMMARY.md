---
phase: quick-260802-nmz
plan: 01
subsystem: ui
tags: [vue2, typescript, overlay, resume, one-page]

requires:
  - phase: quick-260801-qi1
    provides: ProjectDetailsOverlay restored to in-place modal pattern (no routing, no scrollTo reset)
provides:
  - Resume.vue owns its own popup state and ProjectDetailsOverlay instance
  - Selected Projects entries open the project write-up in place on both #/resume and the resume section of #/one-page
affects: [resume, one-page, game-projects]

tech-stack:
  added: []
  patterns:
    - "Entry-point-owned overlay state: any view/component that offers a project write-up imports ProjectDetailsOverlay directly and holds its own showPopup/popupTitle/popupColor/popupContent — no shared store. Now used identically in GameProjects.vue, ProjectsList.vue, and Resume.vue."

key-files:
  created: []
  modified:
    - src/views/Resume.vue

key-decisions:
  - "Resume no longer navigates to /game-projects to show a project; it renders its own ProjectDetailsOverlay bound to GameProjectsData lookups, matching the pattern GameProjects.vue and ProjectsList.vue already use."
  - "Selected Projects entries changed from router-link anchors to plain buttons; the scoped .project-entry-link rule was extended with a full button reset (margin/padding/border/background/color/opacity/cursor/text-align/touch handling) so the global anchor-dimming behavior App.vue used to supply for free is now explicit in the component."

requirements-completed: [QUICK-260802-NMZ]

coverage:
  - id: D1
    description: "Resume's Selected Projects entries open the project overlay in place (no route change) on both #/resume and the resume section of #/one-page"
    requirement: QUICK-260802-NMZ
    verification:
      - kind: manual_procedural
        ref: "checkpoint:human-verify — see plan's how-to-verify steps 1-3"
        status: unknown
    human_judgment: true
    rationale: "Requires visually confirming no route change occurs and scroll position is preserved across two live routing contexts; not automatable from a static build/lint check."
  - id: D2
    description: "Standalone #/resume still opens each of the four project write-ups correctly, with visuals unchanged"
    requirement: QUICK-260802-NMZ
    verification:
      - kind: manual_procedural
        ref: "checkpoint:human-verify — see plan's how-to-verify steps 4-8"
        status: unknown
    human_judgment: true
    rationale: "Visual/interactive parity (hover, focus ring, dimmed rest state, content correctness) requires human eyes in a browser."
  - id: D3
    description: "An id with no matching project in GameProjectsData opens nothing instead of an empty dialog"
    requirement: QUICK-260802-NMZ
    verification:
      - kind: other
        ref: "showDetails(id) early-returns via Array.find() miss before any popup state is mutated — confirmed by code inspection, no test suite exists in this project"
        status: pass
    human_judgment: false

duration: ~20min
completed: 2026-08-02
status: complete
---

# Quick Task 260802-nmz: Fix Resume Project Links Summary

**Resume.vue now owns its own popup state and ProjectDetailsOverlay instance instead of deep-linking into `/game-projects?project=`, so project write-ups open in place on both standalone `#/resume` and the embedded resume section of `#/one-page`.**

## Performance

- **Duration:** ~20 min
- **Tasks:** 1 of 2 (Task 1 executed and committed; Task 2 is a `checkpoint:human-verify` and is intentionally left pending per constraints)
- **Files modified:** 1

## Accomplishments

- `Resume.vue` imports `ProjectDetailsOverlay` and `GameProjectsData`, adds `showPopup`/`popupTitle`/`popupColor`/`popupContent` to `data()`, and a `showDetails(id)` method that looks the id up against `GameProjectsData` via `find()` and no-ops on a miss.
- The Selected Projects entries changed from `<router-link :to="/game-projects?project=...">` to `<button type="button" class="project-entry-link" @click="showDetails(project.id)">`, removing the only in-app producer of the legacy query-param deep link.
- One `ProjectDetailsOverlay` instance added as the last child of `.resume-page`, bound the same way `GameProjects.vue` and `ProjectsList.vue` bind theirs (`:visible`, `:title`, `:color`, `:html-content`, `@close`).
- The scoped `.project-entry-link` rule was extended (not duplicated) with a button reset — `margin/padding/border: 0`, re-declared `border-bottom`, `background: transparent`, `color: inherit`, `opacity: 0.5`, `cursor: pointer`, `text-align: left`, `line-height: 1.2`, touch-target hygiene — so the entries look and behave identically to before now that the global anchor rule no longer applies to them.
- `GameProjects.vue`'s legacy `mounted()` query-param handler was left completely untouched for backwards compatibility with any previously shared/bookmarked link.

## Task Commits

1. **Task 1: Give Resume its own in-place project overlay** - `097ecb3` (feat)

_Task 2 (`checkpoint:human-verify`) was not executed — see "User Setup Required" / pending checkpoint below._

## Files Created/Modified

- `src/views/Resume.vue` - Added overlay import/state/method, converted Selected Projects entries from routed links to buttons, extended `.project-entry-link` styling to restore prior visual appearance as a button

## Decisions Made

None beyond what the plan specified — plan executed as written. Task 1's `<action>` steps were followed exactly (component registration order, property names, early-return no-op behavior, no scroll manipulation, no router usage).

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

**Pending checkpoint (per task instructions, intentionally not attempted by the executor):**

Task 2 in the plan is `type="checkpoint:human-verify" gate="blocking"`. Per the constraints for this execution, it was left for the human rather than attempted. The plan's `<how-to-verify>` section lists 8 manual browser checks the human should run via `npm run serve`:

1. On `#/one-page`, scroll to Resume, click a project name — must open in place, URL stays `#/one-page`.
2. Close via X, bottom Close, and Escape — each should preserve exact scroll position.
3. Header nav on one-page should still correctly track the Resume section after open/close.
4. Standalone `#/resume` — all four project names open the correct write-up, URL stays `#/resume`.
5. Content correctness — Drag Rush and Floor Zero open their own (not a neighbor's) full write-up with all sections/media intact.
6. Visual parity — same font/size/underline/dim-at-rest/hover-brighten/focus-ring/Enter-Space activation as before.
7. Projects timeline's own "View Details" buttons on `#/game-projects` and inside `#/one-page` still work (regression check — unmodified files).
8. Narrow window (<620px) — button still sits correctly in the entry header row.

Automated verification for this plan (grep-based structural checks, `npm run build`, `npm run lint`) all passed — see below.

## Self-Check Evidence

- `grep -c 'ProjectDetailsOverlay' src/views/Resume.vue` → 3 (import, components registration, template usage)
- `grep -c 'GameProjectsData' src/views/Resume.vue` → 1
- `grep -c 'showPopup' src/views/Resume.vue` → 4
- `grep -c 'popupContent' src/views/Resume.vue` → 3
- `grep -c 'class="project-entry-link"' src/views/Resume.vue` → 1
- `grep -c '@click="showDetails(project.id)"' src/views/Resume.vue` → 1
- `grep -c 'opacity: 0.5' src/views/Resume.vue` → 1
- `grep -c 'color: inherit' src/views/Resume.vue` → 1
- `grep -c 'Selected Projects' src/views/Resume.vue` → 1
- `grep -c 'Beyond the Code' src/views/Resume.vue` → 1
- `grep -c '<h1>Resume</h1>' src/views/Resume.vue` → 1
- `grep -c 'game-projects?project=' src/views/Resume.vue` → 0 (confirmed via passing `test ... -eq 0`)
- `grep -c '\$route' src/views/Resume.vue` → 0 (confirmed via passing `test ... -eq 0`)
- `git diff --name-only -- src/views/GameProjects.vue src/components/ProjectDetailsOverlay.vue src/components/ProjectsList.vue src/router/index.ts src/views/OnePage.vue` → empty (confirmed via passing `test ... -eq 0`) — none of the five out-of-scope files were touched
- `grep -c 'query.project' src/views/GameProjects.vue` → 1 (legacy deep-link handler survived byte-identical)
- `npm run build` → completed successfully, no errors
- `npm run lint` → "No lint errors found!"
- `git diff --diff-filter=D --name-only HEAD~1 HEAD` → empty (no unexpected file deletions in the commit)
- Commit `097ecb3` verified present via `git rev-parse --short HEAD`
- `src/views/Resume.vue` verified present on disk

## Next Phase Readiness

- Task 1 is fully implemented, committed, and passes all automated verification.
- Task 2 (`checkpoint:human-verify`) remains outstanding — the human should run `npm run serve` and walk through the 8-step manual verification listed above before considering this quick task fully closed. This mirrors how several prior quick tasks in this repo (e.g. `260801-qi1`, `260801-ffe`, `260801-cp6`) have left their checkpoints for a later manual pass.

## Self-Check: PASSED

- FOUND: src/views/Resume.vue
- FOUND: 097ecb3 (commit exists in git log)
- FOUND: .planning/quick/260802-nmz-fix-resume-project-links-to-work-correct/260802-nmz-SUMMARY.md

---
*Quick task: 260802-nmz*
*Completed: 2026-08-02*
