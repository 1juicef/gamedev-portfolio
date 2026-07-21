# Project Research Summary

**Project:** Josef's Game Dev Portfolio
**Domain:** Recruiter-facing game developer portfolio (redesign/polish pass of an existing Vue 2 static site)
**Researched:** 2026-07-21
**Confidence:** MEDIUM

## Executive Summary

This is a content-and-polish redesign of an already-working 4-project Vue 2 game-dev portfolio, not a rebuild. Research across stack, features, architecture, and pitfalls converges on the same conclusion: the site's structure (timeline scroll + click-through overlay) is already correct, but two things actively undermine the "10-second credible scan" goal in PROJECT.md — unoptimized media (an 18MB GIF thumbnail, plus 0.7-2.3MB PNG screenshots) and missing "my role" attribution on team-built projects (Drag Rush, Dispater). Both are cheap, high-leverage fixes that should be folded into this redesign pass even though neither was explicitly named in PROJECT.md's Active requirements.

The recommended approach layers lightweight, dependency-free techniques onto the existing stack: convert gameplay GIFs to muted/looping MP4+WebM video (a pattern the repo already partially uses via SwingSpaceVid.mp4), manually pre-compress PNG screenshots to WebP, hand-author loading="lazy" into the raw HTML strings in the data files, and pair the new resume image with a real text-layer PDF. No new npm dependencies are required. Content-wise: keep scroll-layer hooks short, put technical substance only in the overlay, order projects best-first rather than chronologically, and add explicit team/role attribution to the two team projects — the single most-cited fix across all portfolio research sources.

The main risk is regression through incompleteness: swapping SwingSpaceGIF.gif for SwingSpaceGIF3.gif (both ~18MB) fixes nothing unless the file itself is re-encoded, and shipping the resume as a flat image with no downloadable text/PDF equivalent trades away accessibility and searchability. A secondary risk is "personality creep" — the mascot and warmer hero copy are validated differentiators, but personality elements evaluated in isolation can compound into an overall "quirky hobby project" impression that undermines the site's professional-credibility goal.

## Key Findings

### Recommended Stack

The stack (Vue 2.6, vue-router 3, TypeScript, Less, vue-cli-service 4/webpack 4) is fixed and correctly not up for re-evaluation. All recommendations are supporting techniques layered on top, none requiring a new npm dependency for the core work.

**Core technologies (unchanged, for reference):**
- Vue 2.6.11 — UI framework — fixed by project constraint
- vue-router 3.4.3 — routing — fixed by project constraint
- vue-cli-service 4.5.x (webpack 4) — build — fixed by project constraint

**Key supporting techniques:**
- ffmpeg GIF-to-MP4/WebM conversion (offline, no dependency) — cuts the ~18MB SwingSpace GIFs to a realistic 0.5-1.5MB; the single highest-leverage change identified across all four research files
- Manual PNG pre-compression (Squoosh/TinyPNG) — brings 0.7-2.3MB screenshots down to 150-400KB with no visible quality loss
- Native loading="lazy" on img elements — zero dependency, sufficient for this site's scale
- Real text-layer PDF resume alongside actualResume.png — mitigates the ATS/accessibility tradeoff
- Fix placeholder OG tags in public/index.html (currently mywebsite.com with a missing image) before the link is shared externally
- Explicitly avoid: vue-meta (unmaintained, no Vue 3 path), image-minimizer-webpack-plugin (solves a problem this project doesn't have), Google Analytics (heavy, GDPR overhead)

### Expected Features

Research treats this as a redesign against documented game-dev-portfolio conventions. The dominant, independently-repeated finding: recruiters give a portfolio well under 30 seconds, and the single most common complaint is inability to tell what the applicant personally did on team projects.

**Must have (table stakes):**
- Strongest project shown first (best-first ordering, not chronological)
- Explicit "my role"/team-attribution line on team projects (Drag Rush, Dispater currently lack this)
- "About this game" blurb per project: engine/tools, timeframe, one technical challenge (already active/in progress)
- No unmuted autoplay audio/video (currently compliant)
- Scannable short-block copy, no walls of text (currently compliant)
- Fast-loading media (currently the biggest table-stakes gap)

**Should have (competitive differentiators):**
- Consistent "Problem -> Decision -> Outcome" phrasing in technical blurbs
- Distinct personality (mascot + warm tone) carried consistently but restrained
- Timeline/bespoke layout instead of a generic grid (already built)
- Optional outbound link (itch.io/repo) only where a real build/repo exists

**Defer (v2+, explicitly out of scope per PROJECT.md):**
- Additional shipped projects beyond the current 4
- Deeper case-study format (diagrams, playtest notes, iteration history)
- Play/build links for Floor 0 and SwingSpace (no public build currently exists)

### Architecture Approach

This is an information-architecture problem, not a software-architecture problem — the existing GameProjects.vue (scroll layer) + ProjectDetailsOverlay.vue (click layer) split is structurally correct and needs no new components. The work is about what content belongs at each layer and in what order.

**Major content layers:**
1. Hero — identity + tone in under 5 seconds; no project detail here
2. Scroll/timeline cards — best asset + title + 1-2 sentence hook per project, ordered best-first
3. Detail overlay — full media gallery + "About this game" blurb + optional outbound link, no code ever
4. Resume/Contact — self-contained credential artifacts reached via nav, not woven into the project narrative

Clearest anti-pattern to avoid: front-loading technical detail into the scroll-layer summary text, which slows the majority-audience scan to serve a minority audience who would have clicked into the overlay anyway.

### Critical Pitfalls

1. Oversized thumbnail GIF is the single biggest load-time risk, and the in-flight swap doesn't fix it — SwingSpaceGIF.gif (18.5MB) is being swapped for SwingSpaceGIF3.gif (17.98MB); both are unlazy, always-visible thumbnails. Convert to muted/looping video (WebM+MP4) as part of the same task.
2. Screenshot PNGs shipped at 0.7-2.3MB each — opening one overlay can pull 5-10MB+ of images at once. Re-encode as WebP and hand-author loading="lazy" into the v-html strings.
3. Resume-as-image trades away searchability/accessibility — no screen-reader support, no copy/paste, unparseable by ATS. Pair with a genuine text-layer PDF download and meaningful alt text.
4. Personality creep past the professional line — mascot + warm copy + gif thumbnails can compound into an overall "quirky hobby" impression. Do a full-page top-to-bottom read-through after each personality-adjacent change.
5. Missing team-project attribution — Drag Rush and Dispater currently read as ambiguous team-vs-solo work; the most-cited recruiter complaint in the entire research set.

## Implications for Roadmap

### Phase 1: Asset & Media Optimization
**Rationale:** Highest-leverage, most time-sensitive fix — the current ~18MB GIF thumbnail and unoptimized PNGs directly undermine the "10-second scan" success metric, and the in-flight SwingSpace GIF swap will regress nothing if not paired with re-encoding.
**Delivers:** GIF-to-WebM/MP4 conversion for thumbnails, WebP re-encoding of all project screenshots, loading="lazy" hand-authored into every v-html image tag and timeline thumbnail, audit of Helpers.preloadImages() eager-load list.
**Addresses:** Fast/low-friction media (table stakes), no-autoplay-with-sound verification.
**Avoids:** Oversized GIF and uncompressed screenshot pitfalls, plus the "swap GIF-for-GIF" technical-debt trap.

### Phase 2: Project Content & Attribution
**Rationale:** Content-architecture work should land before the visual polish pass — polishing spacing/typography on copy that's about to be rewritten wastes effort.
**Delivers:** Explicit "my role"/team-attribution lines added to Drag Rush and Dispater; "About this game" blurbs finalized across all 4 projects using Problem-Decision-Outcome phrasing; project ordering reviewed for best-first.
**Addresses:** The #1 most-cited recruiter complaint (missing role attribution); "About this game" technical-substance requirement.
**Avoids:** Chronological-ordering anti-pattern and the vague-team-attribution anti-feature.

### Phase 3: Hero Copy & Personality Pass
**Rationale:** Second-highest leverage per architecture research (sets tone for everything after); needs an explicit boundary defined since nothing in the code currently enforces where "personality" stops.
**Delivers:** Rewritten hero copy ("Hello there!" tone, kept short); explicit acceptance criteria for personality placement (mascot confined to header/footer, warm-but-factual hero); full-page read-through check.
**Addresses:** Personality/differentiation goal from PROJECT.md Core Value.
**Avoids:** Personality creep past the professional line.

### Phase 4: Resume Page & Visual Polish
**Rationale:** Lowest-risk, most mechanical work — no information-architecture decisions involved, safe to sequence last.
**Delivers:** Resume swapped to actualResume.png with meaningful alt text, paired with a real downloadable text-layer PDF; Floor 0 screenshot reference swap; timeline visual polish (spacing, title styling, image sizing) applied after copy is finalized; OG tag fixes in public/index.html.
**Addresses:** Resume table-stakes requirement; premium-feel visual polish.
**Avoids:** Resume-as-image accessibility/searchability loss.

### Phase Ordering Rationale

- Asset optimization comes first because it's the most measurable, time-sensitive fix and is orthogonal to content decisions.
- Content/attribution comes before visual polish because polishing a layout whose copy is about to change wastes effort.
- Personality/hero pass is isolated because it needs an explicit, checkable acceptance boundary rather than being folded silently into general content work.
- Resume and remaining mechanical asset swaps are last because they are self-contained, low-risk, and don't depend on or block anything else.

### Research Flags

Phases likely needing deeper research during planning:
- Phase 1 (Asset Optimization): ffmpeg conversion settings/quality tradeoffs and WebP browser-support edge cases may warrant a quick research pass if unfamiliar territory for whoever executes it.

Phases with standard patterns (skip research-phase):
- Phase 2 (Content & Attribution): Well-covered by converging, repeated guidance — straightforward copy/data-file edits.
- Phase 3 (Hero/Personality): Pattern and acceptance criteria already well-defined.
- Phase 4 (Resume/Polish): Mechanical, low-risk, no novel technical questions.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | MEDIUM | Web-search-derived, cross-checked against multiple independent sources and directly verified against this repo's actual files/asset sizes |
| Features | MEDIUM | Community-consensus career-advice sources; recurring/independently-repeated claims are most reliable |
| Architecture | MEDIUM | Cross-checked across multiple portfolio/hiring guides; one key source could only be verified via search snippet, not direct fetch |
| Pitfalls | MEDIUM-HIGH | Web guidance is MEDIUM, but all project-specific findings (file sizes, current code patterns) were verified directly against files in this repo — HIGH confidence |

**Overall confidence:** MEDIUM

### Gaps to Address

- PRDO/case-study source (gamedesignskills.com) could not be directly fetched (403) — treated as LOW-confidence/directional; validate structure against how the actual rewritten blurbs read, not as a rigid template.
- Contact page form backend status unverified — confirm current implementation before adding Web3Forms/Formspree.
- Floor 0 and SwingSpace lack outbound play links — flagged as a follow-up, not blocking this redesign.
- Hosting/CDN choice unresolved — only relevant if hosting is undecided or media weight becomes a bandwidth issue; not a blocker for this redesign pass.

## Sources

### Primary (HIGH confidence)
- Direct repo inspection: public/img/projects/ file sizes, src/App.vue, src/data/GameProjectsData.ts, src/components/ProjectDetailsOverlay.vue, src/views/GameProjects.vue, public/index.html, .planning/PROJECT.md

### Secondary (MEDIUM confidence)
- Chrome for Developers/Lighthouse — GIF-to-video size-reduction figures
- web.dev — Replace animated GIFs with video
- MY.GAMES/Medium — portfolios for gamedev artists, recruiter attention
- Generalist Programmer — game developer portfolio guide
- Cirkled In — documenting group projects for a portfolio
- Smallpdf — ATS and PDF resume parsing
- npm registry direct queries (v-lazy-image, vue-lazyload, vue-meta)

### Tertiary (LOW confidence)
- gamedesignskills.com — PRDO case-study structure, only available via search snippet (direct fetch blocked)
- Alexia Mandeville/Medium — single-source general framing
- Portfoliobox — itch.io embed guidance, single third-party source

---
*Research completed: 2026-07-21*
*Ready for roadmap: yes*
