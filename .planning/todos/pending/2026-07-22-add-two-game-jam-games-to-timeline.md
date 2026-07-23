---
created: 2026-07-22T09:01:07.468Z
title: Add two Game Jam games to timeline
area: content
resolves_phase: 4
files:
  - src/data/GameProjectsData.ts
  - src/views/GameProjects.vue
---

## Problem

Josef wants to add two Game Jam games at the bottom of the existing game projects timeline (currently 4 projects: Drag Rush, Dispater, Floor 0, SwingSpace). PROJECT.md's "Out of Scope" section explicitly defers "New/additional game projects beyond the current 4" for the current v1.0 redesign milestone (Phases 1-3: Media & Performance, Content & Personality, Visual Polish/Resume/Metadata).

Decision made during Phase 1 resume session (2026-07-22): don't fold this into the in-progress redesign. Phase 2 (content) and Phase 3 (visual polish) both depend on the current 4-project content/layout being settled first — inserting new project entries mid-stream risks rework of both. Defer to a new phase (e.g. Phase 4) after Phase 3 closes.

## Solution

Clarified 2026-07-22: NOT full overlay-style project cards like the existing 4. Instead:
- Add a new labeled section below the main timeline, titled "Game Jams", visually separated from the 4 main projects
- Each game jam game shown as a single clickable screenshot (no overlay, no blurb) — clicking it goes straight to that game's itch.io page in a new tab
- No `ProjectDetailsOverlay` involvement for these entries — simpler than the main `ProjectData`/timeline-row pattern

TBD — once Phases 1-3 are complete, plan a new phase to:
- Decide data representation (likely a small separate array/type rather than reusing full `ProjectData`, since there's no overlay content)
- Add the "Game Jams" section header + screenshot-link grid/row to `GameProjects.vue` below the existing timeline
- Source screenshots + itch.io URLs for both game jam games (not yet provided — still needed from Josef)

Needs follow-up: game titles, itch.io URLs, and one screenshot per game (not yet gathered).
