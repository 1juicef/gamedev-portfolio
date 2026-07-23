---
phase: 04-game-jams-section
plan: 01
subsystem: ui
tags: [vue, less, scoped-styles]

# Dependency graph
requires: []
provides:
  - "Game Jams subheading + two itch.io text links rendered at the bottom of /game-projects"
affects: []

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Plain <a target=\"_blank\" rel=\"noopener noreferrer\"> text links for lightweight external references (vs. the full ProjectData/overlay card treatment used elsewhere on the page)"

key-files:
  created: []
  modified:
    - "src/views/GameProjects.vue"

key-decisions:
  - "Kept new links as plain hardcoded anchors in the template rather than adding a ProjectData-style entry, per the plan's explicit scope boundary"
  - "Added rel=\"noopener noreferrer\" to both new links even though the four existing itch.io badge links elsewhere in the app omit it (T-04-01 mitigation applies only to this plan's new surface)"

patterns-established: []

requirements-completed: [GAMEJAMS-01, GAMEJAMS-02, GAMEJAMS-03]

coverage:
  - id: D1
    description: "Game Jams subheading renders below the four project rows on /game-projects"
    requirement: "GAMEJAMS-01"
    verification:
      - kind: automated_ui
        ref: "grep -Fq 'Game Jams' src/views/GameProjects.vue (source-order placement after .project-timeline, before ProjectDetailsOverlay)"
        status: pass
    human_judgment: false
  - id: D2
    description: "Two text hyperlinks reading exactly 'The Eldritch Keeper' and 'Mas-Q' appear under the subheading"
    requirement: "GAMEJAMS-02"
    verification:
      - kind: automated_ui
        ref: "grep -Fq 'The Eldritch Keeper' src/views/GameProjects.vue && grep -Fq 'Mas-Q' src/views/GameProjects.vue"
        status: pass
    human_judgment: false
  - id: D3
    description: "Each link opens its itch.io page in a new tab with noopener/noreferrer"
    requirement: "GAMEJAMS-03"
    verification:
      - kind: automated_ui
        ref: "grep -Fc 'target=\"_blank\"' >=2 and grep -Fc 'rel=\"noopener noreferrer\"' >=2 in src/views/GameProjects.vue"
        status: pass
    human_judgment: true
    rationale: "Automated checks confirm the markup attributes are present, but actually clicking each link and confirming it navigates to the correct live itch.io URL in a new tab is a manual/UAT step deferred to phase verification per the plan's <verification> section."

# Metrics
duration: 5min
completed: 2026-07-23
status: complete
---

# Phase 4 Plan 01: Game Jams Section Summary

**Added a "Game Jams" subheading with two plain-text itch.io hyperlinks (The Eldritch Keeper, Mas-Q) below the project timeline on /game-projects, each opening in a new tab with noopener/noreferrer.**

## Performance

- **Duration:** 5 min
- **Started:** 2026-07-23T15:47:46Z
- **Completed:** 2026-07-23T15:49:16Z
- **Tasks:** 1
- **Files modified:** 1

## Accomplishments
- New `<section class="game-jams">` added after `.project-timeline` and before `<ProjectDetailsOverlay>`, containing an `<h2>` subheading and two `<a>` links
- Both links use `target="_blank"` + `rel="noopener noreferrer"` (T-04-01 reverse-tabnabbing mitigation)
- Scoped styles added reusing the existing `#f4cde6` hover accent from `.project-title-link` for visual consistency, with a responsive row layout at the 620px breakpoint matching the rest of the page

## Task Commits

Each task was committed atomically:

1. **Task 1: Add the Game Jams subheading + two itch.io text links to the timeline** - `0cd14af` (feat)

_Note: single-task plan, no TDD cycle required._

## Files Created/Modified
- `src/views/GameProjects.vue` - Added `<section class="game-jams">` template block (h2 subheading + two anchors) and four new scoped CSS classes (`.game-jams`, `.game-jams-title`, `.game-jam-links`, `.game-jam-link`)

## Decisions Made
- Plain hardcoded `<a>` links (matching the `Contact.vue` link style) rather than ProjectData cards, per the plan's explicit scope boundary
- New links carry `rel="noopener noreferrer"` even though the four existing itch.io badge links elsewhere in the app don't — this plan's threat model calls it out as a required mitigation for new surface, not a retrofit of old links

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

Phase 4 (single-plan phase) is complete. No blockers. Manual UAT spot check (clicking both links to confirm they open the correct itch.io pages in a new tab) is deferred to phase verification per the plan's `<verification>` section — automated markup checks all pass.

---
*Phase: 04-game-jams-section*
*Completed: 2026-07-23*

## Self-Check: PASSED
