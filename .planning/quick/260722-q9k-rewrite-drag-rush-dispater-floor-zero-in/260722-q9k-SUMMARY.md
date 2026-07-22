---
phase: quick-260722-q9k
plan: 01
subsystem: content
tags: [copywriting, vue2]

requires: []
provides:
  - New intro hook+description text for Drag Rush, Dispater, and Floor Zero
affects: []

tech-stack:
  added: []
  patterns: []

key-files:
  created: []
  modified:
    - src/data/GameProjectsData.ts

key-decisions:
  - "Dispater keeps its existing 'Good morning rookie!' hook; only the description paragraph was replaced, per Josef's confirmation."
  - "Floor Zero got a new Claude-drafted hook ('You're not alone.') to match the bold-hook + description structure used by Dispater and the new Drag Rush copy, per Josef's confirmed preference for consistency."
  - "SwingSpace's intro was intentionally left unchanged — Josef confirmed no update was needed there."
  - "Minor grammar corrections applied while transcribing Josef's dictated copy: 'stick to beat'->'stick to the beat', 'a unexplored'->'an unexplored', \"it's walls\"->'its walls', 'horrors...finds'->'horrors...find' (subject-verb agreement)."

requirements-completed: [QT-260722-q9k-rewrite-drag-rush-dispater-floor-zero-intro]

coverage:
  - id: D1
    description: "Drag Rush intro reads: hook 'Are you dragging or are you rushing!?' + new description"
    verification:
      - kind: unit
        ref: "grep -Fc 'Are you dragging or are you rushing' src/data/GameProjectsData.ts == 1"
        status: pass
    human_judgment: false
  - id: D2
    description: "Dispater keeps its hook, description replaced with 'Dig for your salvation...'"
    verification:
      - kind: unit
        ref: "grep -Fc 'Dig for your salvation' src/data/GameProjectsData.ts == 1"
        status: pass
    human_judgment: false
  - id: D3
    description: "Floor Zero gets new hook 'You're not alone.' + new description"
    verification:
      - kind: unit
        ref: "grep -Fc \"You're not alone.\" src/data/GameProjectsData.ts == 1"
        status: pass
    human_judgment: false
  - id: D4
    description: "SwingSpace intro unchanged"
    verification:
      - kind: unit
        ref: "grep -Fc 'Swing yourself up through space' src/data/GameProjectsData.ts == 1"
        status: pass
    human_judgment: false

duration: 10min
completed: 2026-07-22
status: complete
---

# Quick Task 260722-q9k: Rewrite Drag Rush/Dispater/Floor Zero Intros Summary

**Replaced the intro hook+description copy for Drag Rush, Dispater, and Floor Zero per Josef's dictated text (post personality read-through), keeping SwingSpace and all other entry content untouched.**

## Performance
- **Duration:** ~10 min
- **Completed:** 2026-07-22
- **Tasks:** 1
- **Files modified:** 1

## Accomplishments
- Drag Rush: new hook + description emphasizing the racing/rhythm hybrid and the "beat the first-place holder" goal
- Dispater: existing hook preserved, new description emphasizing the narrative/mystery angle
- Floor Zero: new Claude-drafted hook ("You're not alone.") + Josef's horror-themed description
- SwingSpace confirmed unchanged
- `npm run lint` and `npm run build` both pass clean

## Files Created/Modified
- `src/data/GameProjectsData.ts` — 3 of 4 project intro blocks rewritten

## Decisions Made
- See `key-decisions` in frontmatter.

## Deviations from Plan
None — applied directly per Josef's dictated copy and the two clarifying answers, with minor grammar corrections called out above.

## Issues Encountered
None.

## User Setup Required
None.

## Next Phase Readiness
- All 4 game entries now have finalized intro copy consistent with the site's warm-but-substantive tone established in Phase 2.
- Recommend Josef take a final look at the 3 new intros in the running site alongside the rest of the read-through he already did.

---
*Completed: 2026-07-22*
