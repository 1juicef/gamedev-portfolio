# Requirements: Josef's Game Dev Portfolio — v1.2

**Defined:** 2026-07-23
**Core Value:** The portfolio must read as aesthetically polished and professional within a 10-second scan, while still carrying a distinct sense of personality — without ever needing to show a line of code to prove the work is real.

## v1 Requirements

Requirements for milestone v1.2. Each maps to roadmap phases.

### Redesign

- [ ] **REDESIGN-01**: The dark-gradient background, Lekton/Russo One custom fonts, and reworked overlay dialog styling (currently uncommitted in `App.vue`/`ProjectDetailsOverlay.vue`) are committed as-is

### Technical Overview

- [ ] **TECH-01**: User can click a "Technical Overview" heading in any project's detail overlay to expand a collapsed-by-default section (collapsed by default on all 4 projects)
- [ ] **TECH-02**: Drag Rush's Technical Overview shows 2-3 curated Unity/C# code snippets, each with a short rationale caption explaining the decision behind it
- [ ] **TECH-03**: SwingSpace's Technical Overview shows 2-3 curated Unity/C# code snippets, each with a short rationale caption explaining the decision behind it
- [ ] **TECH-04**: Dispater's Technical Overview shows 2-3 curated Unreal Blueprint graph screenshots, each with a short rationale caption explaining the decision behind it
- [ ] **TECH-05**: Floor Zero's Technical Overview shows 2-3 curated Unreal Blueprint graph screenshots, each with a short rationale caption explaining the decision behind it

### Domain

- [ ] **DOMAIN-01**: The portfolio is live and reachable at `www.josefubaka.com` via GitHub Pages (`gh-pages` deploy + committed `public/CNAME`)
- [ ] **DOMAIN-02**: Namecheap DNS is correctly configured for the custom domain (default parking records removed, `www` CNAME added) with HTTPS enforced
- [ ] **DOMAIN-03**: `og:url`/`og:image` in `public/index.html` are updated to the live custom domain and the social-preview card is re-verified (closes the long-deferred Phase 3 (v1.0) UAT gap)

## v2 Requirements

None deferred from this milestone's scoping conversation.

## Out of Scope

| Feature | Reason |
|---------|--------|
| Full-site contrast/readability QA pass across every route against the new dark theme | Josef chose "commit as-is" for the redesign rather than an added QA pass this milestone |
| Explicit deep-link/router-mode regression check | Router mode isn't being touched by the redesign; flagged as a research pitfall to avoid, not a requirement to verify |
| Syntax-highlighting library (Prism.js/highlight.js) for Technical Overview code snippets | Unjustified weight for ~2-3 static snippets per project — plain `<pre><code>` is sufficient (research finding) |
| More than 3 code/blueprint snippets per project, or full file dumps | Breaks the curated, scannable intent of the feature (research finding) |
| Accessible "(opens in a new tab)" cue for the Game Jams links (WR-01) | Pre-existing carried-over item from v1.1, unrelated to this milestone's scope — tracked separately in PROJECT.md Active |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| REDESIGN-01 | Phase 5 | Pending |
| TECH-01 | Phase 6 | Pending |
| TECH-02 | Phase 6 | Pending |
| TECH-03 | Phase 6 | Pending |
| TECH-04 | Phase 6 | Pending |
| TECH-05 | Phase 6 | Pending |
| DOMAIN-01 | Phase 7 | Pending |
| DOMAIN-02 | Phase 7 | Pending |
| DOMAIN-03 | Phase 7 | Pending |

**Coverage:**
- v1 requirements: 9 total
- Mapped to phases: 9 ✓
- Unmapped: 0

---
*Requirements defined: 2026-07-23*
*Last updated: 2026-07-23 — roadmap created, all 9 requirements mapped to Phases 5-7*
