---
quick_id: 261019-hjj
status: complete
commit: ccc5764
---

# Summary: reorder game projects page

- `timelineProjects` now maps over `projectRows` keys, so reordering the timeline is a one-line change there. New order: Dispater (normal), Drag Rush (reverse), Floor Zero (normal), SwingSpace (reverse).
- Work In Progress (Sokoban) section moved below Game Jams as the last block on the page; `.wip-section` uses top margin/padding/border now.
- Verified: lint clean, type-check clean, DOM order and visuals checked in Chrome.
