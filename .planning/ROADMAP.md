# Roadmap: Josef's Game Dev Portfolio

## Milestones

- ✅ **v1.0 MVP** — Phases 1-3 (shipped 2026-07-23) — see [milestones/v1.0-ROADMAP.md](./milestones/v1.0-ROADMAP.md)
- ✅ **v1.1 Game Jams Section** — Phase 4 (shipped 2026-07-23) — see [milestones/v1.1-ROADMAP.md](./milestones/v1.1-ROADMAP.md)
- 🔨 **v1.2 Redesign, Technical Deep-Dive & Launch** — Phases 5-7 (in progress)

## Phases

<details>
<summary>✅ v1.0 MVP (Phases 1-3) — SHIPPED 2026-07-23</summary>

- [x] Phase 1: Media & Performance Optimization (4/4 plans) — completed 2026-07-22
- [x] Phase 2: Project Content & Personality (3/3 plans) — completed 2026-07-23
- [x] Phase 3: Visual Polish, Resume & Site Metadata (4/4 plans) — completed 2026-07-23

Full phase details archived in [milestones/v1.0-ROADMAP.md](./milestones/v1.0-ROADMAP.md).

</details>

<details>
<summary>✅ v1.1 Game Jams Section (Phase 4) — SHIPPED 2026-07-23</summary>

- [x] Phase 4: Game Jams Section (1/1 plans) — completed 2026-07-23

Full phase details archived in [milestones/v1.1-ROADMAP.md](./milestones/v1.1-ROADMAP.md).

</details>

**v1.2 Redesign, Technical Deep-Dive & Launch**

- [ ] **Phase 5: Dark Theme Redesign** - Commit and QA the uncommitted dark-gradient + Lekton/Russo One reskin as the final palette baseline
- [ ] **Phase 6: Technical Overview Fold-Out** - Collapsed-by-default per-project section revealing real curated code/Blueprint evidence with decision rationale
- [ ] **Phase 7: Custom Domain Deploy** - Portfolio live at `www.josefubaka.com` over HTTPS with re-verified social-preview metadata

## Phase Details

### Phase 5: Dark Theme Redesign

**Goal**: The portfolio's finalized dark-theme visual identity — dark-gradient background, Lekton/Russo One custom fonts, and the reworked overlay dialog styling currently uncommitted in `App.vue`/`ProjectDetailsOverlay.vue` — is committed and rendering everywhere, establishing the palette baseline that Phase 6 will be styled against.
**Depends on**: Nothing new (first phase of v1.2; builds on the existing v1.1 site)
**Requirements**: REDESIGN-01
**Success Criteria** (what must be TRUE):

  1. Across every route, the site displays the dark-gradient background and Lekton/Russo One custom fonts instead of the previous light theme
  2. Opening any of the four project overlays shows the reworked dialog styling rendered against the dark palette
  3. Resume, Contact, and 404 pages remain legible and correctly laid out under the new theme
  4. Deep-linking directly to a route (e.g. loading `/game-projects` fresh) still resolves — router mode untouched — and a production build (`npm run build`) reflects the dark theme, i.e. the redesign is committed rather than a local-only working-tree change

**Plans**: 1 plan
- [ ] 05-01-PLAN.md — Commit the dark-theme redesign as baseline: formalize palette as Less variables (D-02), fix overlay link color (D-01), verify production build
**UI hint**: yes

### Phase 6: Technical Overview Fold-Out

**Goal**: Technical reviewers can open a per-project "Technical Overview" fold-out to see real, curated code/Blueprint evidence with decision-framed rationale — without the default 10-second scan ever showing a line of code.
**Depends on**: Phase 5 (the Technical Overview CSS must be authored against Phase 5's final dark palette to avoid restyling twice)
**Requirements**: TECH-01, TECH-02, TECH-03, TECH-04, TECH-05
**Success Criteria** (what must be TRUE):

  1. Each of the four project overlays shows a "Technical Overview" heading that is collapsed by default — no snippets or screenshots are visible when the overlay first opens
  2. Clicking (or keyboard-activating) the heading expands the section, and activating it again collapses it
  3. When expanded, Drag Rush and SwingSpace each reveal 2-3 legible Unity/C# code snippets, while Dispater and Floor Zero each reveal 2-3 Unreal Blueprint graph screenshots
  4. Every snippet and screenshot carries a short rationale caption framed as an engineering decision, and code/screenshots read clearly against the dark background on both desktop and mobile

**Plans**: TBD
**UI hint**: yes

### Phase 7: Custom Domain Deploy

**Goal**: The portfolio is publicly live at `www.josefubaka.com` over HTTPS with correct, re-verified social-preview metadata — closing the long-deferred v1.0 domain/UAT gap.
**Depends on**: Independent of Phases 5-6 (touches zero `src/` files) — can run in parallel. Start the DNS/deploy work early since propagation can take 24-48h; only the final `og:` metadata step depends on DNS actually being live.
**Requirements**: DOMAIN-01, DOMAIN-02, DOMAIN-03
**Success Criteria** (what must be TRUE):

  1. Visiting `https://www.josefubaka.com` loads the live portfolio over HTTPS (GitHub Pages `gh-pages` deploy + committed `public/CNAME`)
  2. Namecheap DNS is correctly configured for the custom domain — default parking records removed, `www` CNAME added — and the committed `public/CNAME` survives redeploys
  3. `og:url` and `og:image` in `public/index.html` point to the live domain, and a shared link renders the correct social-preview card (re-verifying the deferred v1.0 Phase 3 UAT test)

**Plans**: TBD

## Progress

**Execution Order:** Phases 5 → 6 in sequence (6 depends on 5's palette); Phase 7 is independent and should start early / run in parallel.

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|-----------------|--------|-----------|
| 1. Media & Performance Optimization | v1.0 | 4/4 | Complete | 2026-07-22 |
| 2. Project Content & Personality | v1.0 | 3/3 | Complete | 2026-07-23 |
| 3. Visual Polish, Resume & Site Metadata | v1.0 | 4/4 | Complete | 2026-07-23 |
| 4. Game Jams Section | v1.1 | 1/1 | Complete | 2026-07-23 |
| 5. Dark Theme Redesign | v1.2 | 0/TBD | Not started | - |
| 6. Technical Overview Fold-Out | v1.2 | 0/TBD | Not started | - |
| 7. Custom Domain Deploy | v1.2 | 0/TBD | Not started | - |
