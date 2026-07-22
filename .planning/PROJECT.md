# Josef's Game Dev Portfolio

## What This Is

A static Vue 2 + TypeScript portfolio site showcasing Josef's shipped game projects (Drag Rush, Dispater, Floor 0, SwingSpace) for game-industry job applications. Visitors scroll a timeline of project cards, click through to media-rich overlays, and can view a resume — no code is shown anywhere on the site.

## Core Value

The portfolio must read as aesthetically polished and professional within a 10-second scan, while still carrying a distinct sense of personality — without ever needing to show a line of code to prove the work is real.

## Business Context

- **Customer**: Game studio recruiters/HR (fast scan) and technical leads/devs (closer look) — roughly equal priority
- **Revenue model**: N/A — personal job-search tool, not monetized
- **Success metric**: A recruiter or technical lead comes away with a clear, credible, memorable impression of shipped work in well under a minute

## Requirements

### Validated

- ✓ Data-driven project timeline (`GameProjects.vue` + `GameProjectsData.ts`) rendering 4 shipped games with screenshots/video/gifs — existing
- ✓ Click-through project detail overlay (`ProjectDetailsOverlay.vue`, `v-html` descriptions) — existing
- ✓ Static Resume, Contact, 404 pages routed via vue-router — existing
- ✓ Header/Footer running-character mascot animation (`Guy.gif` / `Guy2.gif`) — existing

### Active

- [ ] Each project shows a short "About this game" blurb: engine/tools used, dev timeframe, and one interesting technical challenge — the deliberate middle ground between showing zero technical detail and pasting code
- [ ] Hero section rewritten with warmer, more personal copy ("Hello there!") while staying professional
- [ ] Floor 0 screenshots swapped from old `floor-0-1..4.png` references to the new `Floor0SC1-4.png` files
- [ ] SwingSpace timeline thumbnail swapped from `SwingSpaceGIF.gif` to `SwingSpaceGIF3.gif`
- [ ] Resume page replaced with a single resume image (`actualResume.png`) instead of hand-coded resume markup
- [ ] Visual polish pass on the GameProjects timeline layout (spacing, title styling, image sizing) for a more premium feel
- [ ] Personality maintained via the running-character mascot and copy tone, deliberately balanced against looking professional

### Out of Scope

- Code snippets or embedded code samples on the page — replaced by short tech blurbs (and optionally a repo link) since the site stays visual-first — why: recruiters don't read code, and technical reviewers want stack + challenge, not raw snippets
- New/additional game projects beyond the current 4 (Drag Rush, Dispater, Floor 0, SwingSpace) — why: deferred, not part of this redesign pass
- `Guy3.gif` / `Guy4.gif` — why: leftover assets, not being wired in; candidates for later cleanup
- `SwingSpaceVid2.mp4` — why: superseded by the `SwingSpaceGIF3.gif` thumbnail swap decision; not currently wired into any project
- Hard deadline-driven scope cuts — why: open-ended polish pass, no external deadline forcing corners

## Context

- Forked from the `gamedev-portfolio-template`, already shipped with 4 real student/solo game projects before this redesign began.
- Currently mid-redesign in the working tree (uncommitted): hero copy, per-project "About this game" blurbs, resume-as-image, and several asset swaps are already underway.
- Audience is mixed: non-technical recruiters doing a fast scan, and technical leads/devs who want a bit more substance (stack + one technical highlight) without reading code.
- Personality is expressed visually (running character mascot, tone of copy) with a deliberately held line toward still reading as professional — not casual/quirky at the expense of credibility.

## Constraints

- **Tech stack**: Vue 2 + TypeScript + Less, vue-cli-service build — fixed; this is a content/design polish pass, not a re-platform
- **Assets**: Screenshots/gifs/videos are already produced by the user and live in `public/img/projects/`; work here is data-file, component, and style edits — not new asset production
- **Timeline**: No firm deadline — quality prioritized over speed

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Keep code fully off the page; add a short tech blurb + optional link per project instead | Recruiters don't read code; technical reviewers want stack + challenge, not raw snippets | — Pending |
| Resume page shows a single resume image rather than hand-coded HTML resume | Simpler, matches "short and to the point" | — Pending |
| Running-character mascot (`Guy.gif` / `Guy2.gif`) in header/footer for personality | Adds personality while keeping the site otherwise clean and professional | — Pending |
| Media pipeline (ffmpeg + sharp, `scripts/convert-media.js`) converts oversized GIF/PNG masters to muted MP4 thumbnails + WebP screenshots, never bundled into the browser build | Multi-MB GIFs/PNGs were the single biggest thing undermining a "loads fast and lean" first impression — fixing this first unblocks every later content/visual pass | ✓ Shipped — Phase 1 |
| Floor 0's broken screenshot references and its timeline thumbnail length (UAT-flagged, trimmed to ~12.5s) fixed as part of Phase 1 rather than deferred to Phase 2's CONT-01 | Both were direct consequences of the media-conversion work already in flight; fixing them in the same pass avoided touching the same files twice | ✓ Shipped — Phase 1 (flag for Phase 2 REQUIREMENTS.md traceability: CONT-01 satisfied early) |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-07-22 after Phase 1*
