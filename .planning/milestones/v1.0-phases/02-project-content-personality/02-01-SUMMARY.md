---
phase: 02-project-content-personality
plan: 01
subsystem: content
tags: [vue, typescript, copywriting, portfolio-content]

# Dependency graph
requires:
  - phase: 01-media-performance-optimization
    provides: Floor 0 screenshot fixes and timeline thumbnail fix (CONT-01/CONT-07), already-complete media pipeline that this plan's copy edits render on top of
provides:
  - Drag Rush and Dispater "About this game" blocks carry natural team-size + personal-contribution attribution lines
  - All 4 projects' About blocks free of known typos (rythmgame, enviroment, intergration) and Floor 0's awkward closing line tightened
  - Floor 0 has a working "Play on itch.io" link to juice-f.itch.io/floorzero matching the sibling pattern
  - Hero copy confirmed warm + personal + short + professional, with one grammar slip fixed
affects: [02-02, uat, phase-3-visual-polish]

# Tech tracking
tech-stack:
  added: []
  patterns: []

key-files:
  created: []
  modified:
    - src/data/GameProjectsData.ts
    - src/views/GameProjects.vue

key-decisions:
  - "Attribution lines for Drag Rush and Dispater added as new <br/>-terminated bullet lines inside the existing About this game div, immediately after the engine/timeframe line, matching sibling bullet style (no new heading or wrapper)"
  - "Floor 0's awkward closing line replaced with 'Unsettling enough to keep you up at night.' as the tightened default (subject to Josef's UAT review)"
  - "Hero copy kept structurally and stylistically unchanged; only a single grammar slip fixed (have previously ran -> have previously run)"

patterns-established: []

requirements-completed: [CONT-02, CONT-03, CONT-04, CONT-05]

coverage:
  - id: D1
    description: "Drag Rush About block states team of 6 (3 programmers, 3 artists) and names Josef's vehicle animation trees + Beat Conductor contribution"
    requirement: "CONT-02"
    verification:
      - kind: other
        ref: "grep -Fq 'A team of 6 — 3 programmers, 3 artists.' src/data/GameProjectsData.ts && grep -Fq 'vehicle animation trees' src/data/GameProjectsData.ts"
        status: pass
    human_judgment: true
    rationale: "Wording is Claude's draft per D-03 and Claude's Discretion, explicitly flagged as subject to Josef's UAT review for tone/phrasing fit."
  - id: D2
    description: "Dispater About block states team of 7 (3 programmers, 4 artists) and names Josef's dialogue/task/interaction systems + audio engineering contribution"
    requirement: "CONT-02"
    verification:
      - kind: other
        ref: "grep -Fq 'A team of 7 — 3 programmers, 4 artists.' src/data/GameProjectsData.ts && grep -Fq 'audio engineering' src/data/GameProjectsData.ts"
        status: pass
    human_judgment: true
    rationale: "Wording is Claude's draft per D-03 and Claude's Discretion, explicitly flagged as subject to Josef's UAT review for tone/phrasing fit."
  - id: D3
    description: "All 4 projects' About blocks free of known misspellings (rythmgame, enviroment, intergration, sleep less for days) and Floor 0's line tightened"
    requirement: "CONT-04"
    verification:
      - kind: other
        ref: "grep -Fc 'rythmgame|enviroment|intergration|sleep less for days' src/data/GameProjectsData.ts returns 0 for each"
        status: pass
    human_judgment: false
  - id: D4
    description: "Floor 0 has a working 'Play on itch.io' link to juice-f.itch.io/floorzero using the same paragraph-center + target=_blank pattern as sibling projects"
    requirement: "CONT-05"
    verification:
      - kind: other
        ref: "grep -Fq '<a href=\"https://juice-f.itch.io/floorzero\" target=\"_blank\">Play on itch.io</a>' src/data/GameProjectsData.ts"
        status: pass
    human_judgment: false
  - id: D5
    description: "Hero section reads warm and personal ('Hello there!') while staying short and professional; structure/styles unchanged; one grammar slip fixed"
    requirement: "CONT-03"
    verification:
      - kind: other
        ref: "grep -Fq 'Hello there!' src/views/GameProjects.vue && grep -Fq 'Game Developer student residing in Gothenburg' src/views/GameProjects.vue"
        status: pass
    human_judgment: true
    rationale: "Tone-bar assessment (warm + personal yet short + professional) is a subjective judgment call; the plan explicitly calls for confirmation, not just automated grep, and any wording change is subject to Josef's UAT review."

# Metrics
duration: 10min
completed: 2026-07-22
status: complete
---

# Phase 2 Plan 1: Finalize Project Copy (Attribution, Typos, itch.io Link, Hero) Summary

**Added team-attribution bullets to Drag Rush/Dispater, fixed 4 known typos across all projects, added Floor 0's itch.io link, and fixed one grammar slip in the hero bio — all via in-place string edits to `GameProjectsData.ts` and `GameProjects.vue`, no new markup structure.**

## Performance

- **Duration:** 10 min
- **Started:** 2026-07-22T14:07:57Z
- **Completed:** 2026-07-22T14:17:49Z
- **Tasks:** 3
- **Files modified:** 2

## Accomplishments
- Drag Rush and Dispater About blocks now carry natural team-size + personal-contribution attribution lines (CONT-02), sourced from D-01/D-02
- Fixed 4 known typos across all 4 projects' About blocks: "rythmgame" -> "rhythm game", "enviroment" -> "environment", "intergration" -> "integration", and tightened Floor 0's awkward closing line (CONT-04/D-06)
- Added Floor 0's "Play on itch.io" link to `https://juice-f.itch.io/floorzero`, matching the exact sibling pattern (CONT-05/D-07)
- Confirmed hero copy meets the warm+personal / short+professional bar (D-05); fixed one grammar slip ("have previously ran" -> "have previously run") without altering structure or styles

## Task Commits

Each task was committed atomically:

1. **Task 1: Add Drag Rush + Dispater team attribution and fix their blurb typos** - `f5bec8f` (feat)
2. **Task 2: Finalize Floor 0 + SwingSpace blurbs and add Floor 0 itch.io link** - `7c50e54` (feat)
3. **Task 3: Confirm/finalize warm hero copy** - `1ad254a` (fix)

**Plan metadata:** (pending — final docs commit below)

## Files Created/Modified
- `src/data/GameProjectsData.ts` - Added attribution bullets (Drag Rush, Dispater), fixed 3 typos (rythmgame, enviroment, intergration), tightened Floor 0's closing line, added Floor 0 itch.io link block
- `src/views/GameProjects.vue` - Fixed one grammar slip in hero bio copy ("ran" -> "run"); no structural changes

## Decisions Made
- Attribution lines placed as new bullet lines directly after the engine/timeframe line in each project's existing About block, matching the terse `<br/>`-terminated single-sentence style (per D-03) — no new heading, wrapper div, or credits section introduced.
- Floor 0's closing line finalized as "Unsettling enough to keep you up at night." (Claude's draft per D-06, subject to Josef's UAT review).
- Hero copy structure and styles left completely untouched per D-05's "strong existing draft" guidance; only a single grammar-slip micro-edit was made ("have previously ran" -> "have previously run"), which does not lengthen the copy.

## Deviations from Plan

None from the planned task actions — all edits followed the plan's drafted copy verbatim. One documentation-level observation (not a code deviation):

- The plan's Task 3 acceptance criteria describes `grep -c 'class="intro"' src/views/GameProjects.vue` returning `>= 3` to confirm the three intro paragraphs are preserved. The literal grep pattern only matches 2 of the 3 divs because the third div is `class="intro secondary"` (the closing quote in the pattern doesn't match a class list with a second token). Verified structurally instead: `grep -n 'class="intro'` (no closing quote) confirms all 3 `intro`-class divs are present and unchanged. No code change was needed — this is a grep-pattern quirk in the plan's acceptance criteria text, not a defect in the implementation.

## Issues Encountered
None.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- All CONT-02, CONT-03, CONT-04, CONT-05 requirements for this plan are satisfied and grep-verified.
- `npm run lint` passes with no errors on the two edited files.
- `npm run build` succeeds (pre-existing console-statement warning in `ProjectDetailsOverlay.vue` and asset-size warnings are unrelated to this plan's edits, out of scope per SCOPE BOUNDARY).
- All attribution wording, Floor 0's tightened closing line, and the hero grammar fix are flagged as Claude's draft / subject to Josef's UAT review — ready for the 02-02 read-through checkpoint and full-phase UAT.

---
*Phase: 02-project-content-personality*
*Completed: 2026-07-22*

## Self-Check: PASSED
- FOUND: src/data/GameProjectsData.ts
- FOUND: src/views/GameProjects.vue
- FOUND: .planning/phases/02-project-content-personality/02-01-SUMMARY.md
- FOUND: commit f5bec8f
- FOUND: commit 7c50e54
- FOUND: commit 1ad254a
