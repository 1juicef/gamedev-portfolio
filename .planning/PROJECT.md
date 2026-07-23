# Josef's Game Dev Portfolio

## What This Is

A static Vue 2 + TypeScript portfolio site showcasing Josef's shipped game projects (Drag Rush, Dispater, Floor 0, SwingSpace) for game-industry job applications. Visitors scroll a timeline of project cards, click through to media-rich overlays, and can view a resume — no code is shown anywhere on the site. As of v1.0, project media loads fast and lean (compressed video thumbnails + WebP screenshots, all lazy-loaded), copy carries a warm-but-professional personality within a validated boundary, the timeline/resume/overlay layouts are visually polished, and shared links render correct social-preview metadata.

## Core Value

The portfolio must read as aesthetically polished and professional within a 10-second scan, while still carrying a distinct sense of personality — without ever needing to show a line of code to prove the work is real.

*(Confirmed still the right priority after shipping v1.0 — no change.)*

## Business Context

- **Customer**: Game studio recruiters/HR (fast scan) and technical leads/devs (closer look) — roughly equal priority
- **Revenue model**: N/A — personal job-search tool, not monetized
- **Success metric**: A recruiter or technical lead comes away with a clear, credible, memorable impression of shipped work in well under a minute

## Requirements

### Validated

- ✓ Data-driven project timeline (`GameProjects.vue` + `GameProjectsData.ts`) rendering 4 shipped games with screenshots/video/gifs — existing
- ✓ Click-through project detail overlay (`ProjectDetailsOverlay.vue`, `v-html` descriptions) — existing
- ✓ Static Resume, Contact, 404 pages routed via vue-router — existing
- ✓ Header/Footer running-character mascot animation (`Guy.gif` family, route-aware swap) — existing, extended in v1.0
- ✓ Oversized GIF/PNG thumbnails converted to compressed, lazy-loaded video + WebP — v1.0 (MEDIA-01/02/03)
- ✓ Every project image lazy-loaded, including hand-authored `v-html` description images — v1.0 (MEDIA-03)
- ✓ Floor 0 screenshots/timeline thumbnail repointed to new assets — v1.0 (CONT-01/CONT-07, satisfied early by Phase 1)
- ✓ Drag Rush/Dispater team-attribution lines (team size + personal contribution) — v1.0 (CONT-02)
- ✓ Hero section rewritten warmer while staying short/professional — v1.0 (CONT-03)
- ✓ "About this game" blurb (engine, timeframe, one technical challenge) finalized on all 4 projects — v1.0 (CONT-04)
- ✓ Floor 0 "Play on itch.io" link — v1.0 (CONT-05)
- ✓ Timeline layout polish pass (spacing, title styling, image sizing, restraint over decoration) — v1.0 (POLISH-01)
- ✓ Personality boundary (mascot confined to header/footer, warm-but-short copy) validated via full read-through — v1.0 (POLISH-02)
- ✓ Resume page shows single `actualResume.png` image, no extra chrome — v1.0 (RESUME-01, explicit accessibility/PDF tradeoff accepted)
- ✓ Real OG/social-preview metadata replacing placeholder `mywebsite.com` values — v1.0 (META-01)

### Active

- [ ] Add a "Game Jams" section to the timeline — two additional games, one clickable screenshot each, linking to itch.io — blocked on Josef supplying game titles/itch.io URLs/screenshots (deferred from v1.0 close, see STATE.md Deferred Items)
- [ ] Deploy the portfolio to the custom domain `www.josefubaka.com` (already purchased) — update `public/index.html` `og:url`/`og:image` off the current GitHub Pages URL once live, and re-verify the social-preview card render (Phase 3 UAT Test 3, currently blocked on having a live URL)
- [ ] Decide the fate of the in-progress visual redesign sitting uncommitted in the working tree (`App.vue`/`ProjectDetailsOverlay.vue`: dark gradient background, Lekton/Russo One custom fonts, reworked overlay styling) — deliberately excluded from v1.0 at Josef's request; needs a real decision (adopt as v1.1, rework, or discard) rather than sitting uncommitted indefinitely

### Out of Scope

- Code snippets or embedded code samples on the page — replaced by short tech blurbs (and optionally a repo link) since the site stays visual-first — why: recruiters don't read code, and technical reviewers want stack + challenge, not raw snippets
- New/additional game projects beyond the current 4 (Drag Rush, Dispater, Floor 0, SwingSpace) — why: deferred; the only near-term addition planned is the separate "Game Jams" section above, not a 5th full project entry
- `SwingSpaceVid2.mp4` — why: leftover/unused source file; superseded by the v1.0 SwingSpace media refresh (new video/screenshots sourced from `NEWSwingSpaceVid.mp4` etc., since deleted after conversion)
- SwingSpace play/build link (itch.io or otherwise) — why: game is mobile-only with no web/PC-playable build; itch.io isn't a good fit without one
- SwingSpace GitHub repo link — why: repo needs cleanup first; separate work from this redesign pass
- Resume accessibility mitigation (downloadable PDF companion, `alt` text overhaul) — why: explicitly accepted tradeoff for v1.0; image-only resume was intentional
- Hard deadline-driven scope cuts — why: open-ended polish pass, no external deadline forcing corners

## Context

- Forked from the `gamedev-portfolio-template`, already shipped with 4 real student/solo game projects before this redesign began.
- **v1.0 shipped 2026-07-23** (3-day pass, 121 commits, 13/13 requirements complete): media pipeline (ffmpeg + sharp) built and live, all project content/personality finalized and UAT-validated, timeline/resume/overlay visual polish complete, real social-preview metadata in place.
- Post-requirements polish landed via quick tasks after Phase 3 closed: itch.io badge images (replacing text links), a Phase-1 CSS completeness gap fixed (`.pc-video`/`.swing-space-*` classes were referenced but never styled since `78090d8`), SwingSpace's video/screenshots refreshed from newer source media, and a new gameplay video added to Floor Zero's overlay.
- Two items were deliberately deferred at v1.0 close rather than blocking ship (see STATE.md Deferred Items): the Game Jams timeline section (needs assets from Josef) and the custom-domain deploy (needs the domain live).
- Josef has a separate, unrelated visual redesign (dark gradient theme + custom fonts) sitting uncommitted in the working tree throughout v1.0 — intentionally excluded from this milestone at his request; still needs a decision for v1.1.
- Audience is mixed: non-technical recruiters doing a fast scan, and technical leads/devs who want a bit more substance (stack + one technical highlight) without reading code.
- Personality is expressed visually (running character mascot, tone of copy) with a deliberately held line toward still reading as professional — not casual/quirky at the expense of credibility.

## Constraints

- **Tech stack**: Vue 2 + TypeScript + Less, vue-cli-service build — fixed; this is a content/design polish pass, not a re-platform
- **Assets**: Screenshots/gifs/videos are already produced by the user and live in `public/img/projects/`; work here is data-file, component, and style edits — not new asset production
- **Timeline**: No firm deadline — quality prioritized over speed

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Keep code fully off the page; add a short tech blurb + optional link per project instead | Recruiters don't read code; technical reviewers want stack + challenge, not raw snippets | ✓ Shipped — v1.0 |
| Resume page shows a single resume image rather than hand-coded HTML resume | Simpler, matches "short and to the point" | ✓ Shipped — v1.0 (no code change needed, Josef's pre-existing work already matched) |
| Running-character mascot (`Guy.gif` family) in header/footer for personality | Adds personality while keeping the site otherwise clean and professional | ✓ Shipped — v1.0, extended to a route-aware swap |
| Media pipeline (ffmpeg + sharp, `scripts/convert-media.js`) converts oversized GIF/PNG masters to muted MP4 thumbnails + WebP screenshots, never bundled into the browser build | Multi-MB GIFs/PNGs were the single biggest thing undermining a "loads fast and lean" first impression — fixing this first unblocked every later content/visual pass | ✓ Shipped — Phase 1 |
| Floor 0's broken screenshot references and timeline thumbnail length fixed as part of Phase 1 rather than deferred to Phase 2's CONT-01 | Both were direct consequences of the media-conversion work already in flight; fixing them in the same pass avoided touching the same files twice | ✓ Shipped — Phase 1 |
| Personality boundary (POLISH-02) given provisional/phone-based approval by Josef rather than blocking Phase 2 close on an in-person read-through | Kept the phase moving; risk was explicitly logged as an open blocker | ✓ Good — no follow-up issues surfaced |
| Sitewide content column widened 1280px → 1600px (G-03-5) | User-reported excessive dead space at common desktop viewports; 1280px was an inherited template default, not a deliberate choice | ✓ Good |
| Resume top spacing fixed via scoped `padding-top: 48px` on `.resume-page`, not a global `.main` padding change | Avoids affecting every other route's layout for a resume-only spacing issue | ✓ Good |
| Overlay gradient black-bar bug (G-03-8) fixed by removing `.dialog`'s stray `padding-bottom: 10px` | The gradient lived on `.dialog-content` only; the extra padding on `.dialog` painted a solid strip below it | ✓ Good |
| itch.io links upgraded from text to a clickable badge image across Drag Rush/Dispater/Floor Zero (quick task) | Visual consistency with itch.io's own branding conventions | ✓ Good |
| SwingSpace media (video + 2 screenshots) refreshed from newer source files Josef provided after Phase 3 closed, converted via the same ffmpeg/sharp pipeline | Better-quality captures became available; reused existing conversion tooling rather than one-off scripts | ✓ Shipped — post-close quick task |
| Floor Zero given a new gameplay video (compressed 53.9MB → 3.5MB), placed above its screenshots | Floor Zero was the only project with no video/trailer at all | ✓ Shipped — post-close quick task |
| Missing `.pc-video`/`.swing-space-*` CSS (referenced by `GameProjectsData.ts` since Phase 1's `78090d8` but never styled) committed as a standalone fix | Genuine completeness bug independent of Josef's unrelated uncommitted redesign — needed regardless of that redesign's fate | ✓ Shipped — post-close quick task |
| Josef's dark-gradient/custom-font redesign of `App.vue`/`ProjectDetailsOverlay.vue` deliberately left uncommitted and out of v1.0 scope | Not tied to any phase plan or requirement; user's explicit call to decide its fate separately | — Pending v1.1 decision |
| Game Jams section and custom-domain deploy acknowledged as open at v1.0 close rather than blocking ship | Both are blocked on external inputs (assets from Josef, domain going live) unrelated to code quality | — Deferred to v1.1 |

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
*Last updated: 2026-07-23 after v1.0 milestone*
