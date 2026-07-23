# Project Research Summary

**Project:** Josef's Game Dev Portfolio — v1.2 Redesign, Technical Deep-Dive & Launch
**Domain:** Recruiter-facing game developer portfolio (feature addition to an existing Vue 2 static site)
**Researched:** 2026-07-23
**Confidence:** HIGH

## Executive Summary

v1.2 spans three features: adopting an already-written dark-theme redesign, adding a collapsed-by-default "Technical Overview" section per project (curated code snippets for Unity projects, Blueprint-graph screenshots for Unreal projects, plus decision-framed rationale text), and deploying to the custom domain `www.josefubaka.com` via GitHub Pages. This is a content-and-CSS milestone, not an architecture change: every recommendation extends patterns the codebase already uses rather than introducing new ones.

The Technical Overview slots directly into the existing `htmlDescription` raw-HTML-string pattern (`ProjectData.ts` / `GameProjectsData.ts`, rendered via `v-html` in `ProjectDetailsOverlay.vue`) using native `<details>`/`<summary>` — zero new Vue props, state, or dependencies. The domain deploy needs exactly one new dev dependency (`gh-pages`) and one committed `public/CNAME` file; no `vue.config.js` change since the default `publicPath: '/'` is already correct for a custom-domain root deploy.

The main risk is build-order and invisibility, not technology choice. The dark-theme redesign already rewrites `.dialog-content`'s background, so Technical Overview CSS must be authored against the *final* dark palette — doing it in the other order means restyling twice. Separately, the repo has no `vue.config.js`/GitHub Actions documenting *why* the current setup works, making it easy to silently break the live site (e.g. adding a `publicPath` override, or switching router mode without a 404-fallback) while working on something else.

## Key Findings

### Recommended Stack

The stack (Vue 2.6, vue-router 3, TypeScript, Less, vue-cli-service 4) is fixed and correctly not up for re-evaluation. Both new features are supported without any new runtime dependency.

**Core technologies:**
- `gh-pages` (npm, dev dependency, latest 6.x) — one-command build+deploy to a `gh-pages` branch — chosen over GitHub Actions because the site updates infrequently and a CI workflow is unrequested infrastructure for a personal project
- Native HTML5 `<details>`/`<summary>` — zero-JS collapsible disclosure, free keyboard/AT support — chosen over any accordion library or custom Vue component
- Plain `<pre><code>` + a few `projects.less` rules — chosen over Prism.js/highlight.js, which is unjustified weight for ~2-3 static snippets per project

### Expected Features

**Must have (table stakes):**
- Technical Overview collapsed by default — preserves the core "10-second scan, no code visible by default" value
- Clearly clickable/visibly-affordant `<summary>` heading
- 2-3 curated snippets/screenshots per project, each with a short rationale caption
- Legible monospace code, explicit foreground/background pair (not inherited/inline colors) so it reads against the new dark gradient

**Should have (differentiators):**
- Presentation matched to engine reality: real C# text for Drag Rush/SwingSpace (Unity), Blueprint graph screenshots (not pseudo-code) for Dispater/Floor Zero (Unreal)
- Rationale captions framed as engineering decisions/tradeoffs, not just "here's some code"

**Defer / explicitly reject:**
- Full file dumps or >3 snippets per project
- Any syntax-highlighting library
- A custom JS accordion (native element already does this)
- Auto-expanded-by-default sections (breaks the core scan value)
- Interactive/embedded code sandboxes

### Architecture Approach

Extend the existing raw-HTML-string convention rather than introduce a structured data field or subcomponent — every other rich-content type in `htmlDescription` (video, iframe, images, badges) already lives this way, and a `techSnippets: {...}[]` field + dedicated subcomponent would duplicate an abstraction for one-time content on 4 projects.

**Major components (all existing, none new):**
1. `GameProjectsData.ts` — gains `<details>` blocks appended to each project's `htmlDescription` string; no schema change
2. `projects.less` — gains ~4 new class rules (snippet/code-block styling, screenshot caption styling); globally loaded, unscoped, per existing convention
3. `public/CNAME` — new file (not a component, but the only new "architecture" piece), committed to source so Vue CLI copies it into every build and `gh-pages` doesn't wipe it
4. `public/index.html` — `og:url`/`og:image` hand-edited once, after DNS cutover; no build-time templating needed (`.env` already has zero runtime wiring into the build, confirmed by grep)

**Build order (critical, cuts across all 3 features):**
1. Redesign first — establishes the final dark palette (`.dialog-content` gradient, fonts)
2. Technical Overview second — styled against that final palette, avoiding a re-style
3. Domain deploy — fully independent of 1 and 2 (touches zero `src/` files), but its last internal step (updating `og:url`/`og:image`) depends on DNS actually being live

### Critical Pitfalls

1. **`publicPath` override "fix"** — the default `/` is already correct for a custom-domain root deploy; don't add a `vue.config.js` publicPath change while doing unrelated redesign work, or it silently breaks the live github.io URL until the domain cuts over.
2. **CNAME wiped on deploy** — `public/CNAME` must be committed to the repo (so `gh-pages` republishes it every deploy), not added by hand to the `gh-pages` branch or only set in GitHub Settings UI.
3. **Vue directives are inert inside `v-html`** — the Technical Overview must use plain native `<details>`/`<summary>` HTML, not `v-if`/`v-model`/event bindings, since nothing inside a `v-html` string is compiled by Vue.
4. **Unescaped code breaks the template literal and the render** — raw `<`, `>`, `&` in pasted code snippets must be hand-escaped to HTML entities, or they'll either vanish from the rendered output or break the TS template literal in `GameProjectsData.ts`.
5. **Router-mode changes are a common incidental-edit trap** — `router/index.ts` has no explicit `mode`, defaulting to hash mode, which is *why* deep links already survive GitHub Pages with zero server config; switching to `history` mode as part of the redesign pass would 404 direct-loaded routes without an added `404.html` SPA-redirect shim.

## Implications for Roadmap

### Phase 1: Dark Theme Redesign
**Rationale:** Already written (uncommitted), needs committing + polish; must land first since Phase 2's CSS depends on its final palette
**Delivers:** Committed, QA'd dark-gradient background + Lekton/Russo One fonts + reworked overlay dialog styling, verified against all 4 project overlays and other routes (Resume, Contact, 404)
**Addresses:** Adopting the redesign (milestone target feature 1)
**Avoids:** Router-mode incidental-edit trap (pitfall 5); verify deep links still work after touching `App.vue`/router-adjacent files

### Phase 2: Technical Overview
**Rationale:** Pure content + CSS addition, styled against Phase 1's final dark palette; needs source-mining as a lead-time dependency, not a code dependency
**Delivers:** Collapsed-by-default "Technical Overview" `<details>` section on all 4 project overlays, 2-3 curated code snippets (Drag Rush, SwingSpace) or Blueprint screenshots (Dispater, Floor Zero) each with a decision-framed rationale caption
**Uses:** Native `<details>`/`<summary>`, plain `<pre><code>`, new `projects.less` rules
**Implements:** Extension of the existing `htmlDescription` raw-HTML convention (no component/data-model changes)
**Avoids:** Entity-escaping failures, inert-Vue-directives mistake, code-vs-dark-background contrast, mobile code overflow

### Phase 3: Custom Domain Deploy
**Rationale:** Fully independent of Phases 1-2 (touches zero `src/` files); can run in parallel, but its final step (metadata update) depends on DNS being live, so schedule the DNS/propagation wait early rather than last
**Delivers:** `www.josefubaka.com` live via `gh-pages` + committed `public/CNAME`, HTTPS enforced, Namecheap DNS configured (parking records removed, `www` CNAME → `1juicef.github.io.` added), `og:url`/`og:image` updated in `public/index.html`, Phase 3 (v1.0) UAT social-preview test re-verified

### Phase Ordering Rationale

- Phase 1 before Phase 2 avoids restyling the Technical Overview CSS twice against two different dialog backgrounds
- Phase 3 is independent and DNS propagation (up to 24-48h) is an external wait — start it early or run it in parallel with Phase 1/2, not as the last step before calling the milestone done
- Grouping matches the architecture finding that all `src/` code changes cluster in Phases 1-2 (same two files: `App.vue`, `ProjectDetailsOverlay.vue`, plus data/CSS files), while Phase 3 is infrastructure-only

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 2:** Snippet/screenshot curation itself (mining Drag Rush/SwingSpace Unity source and Dispater/Floor Zero Unreal Blueprint graphs for the actual 2-3 highlights per project) is content-authoring work, not covered by this research pass — needs to happen as part of phase planning/execution using the source directories already added as working directories

Phases with standard patterns (skip research-phase):
- **Phase 1:** Redesign code already exists uncommitted; work is commit + QA, not design
- **Phase 3:** GitHub Pages + Namecheap custom-domain deploy is a well-documented, standard mechanism

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Verified against official GitHub Docs + npm registry, and direct inspection of this repo's actual files |
| Features | MEDIUM | Multiple independent web sources converge on the same UX conclusions, but no single canonical spec exists for "portfolio technical fold-outs" |
| Architecture | HIGH | Small, fully-read codebase; decision is a direct extension of an existing, established convention |
| Pitfalls | MEDIUM-HIGH | Deployment/DNS mechanics cross-checked against official docs (no live dry-run yet); `v-html`/router/publicPath findings are HIGH — read directly from this repo's source |

**Overall confidence:** HIGH

### Gaps to Address

- Exact code snippets and Blueprint screenshots haven't been picked yet — the source directories (SwingSpace, Drag Rush, Floor Zero, Dispater/"C9") are available as working directories but need to be gone through during Phase 2 planning/execution
- Whether the apex domain (`josefubaka.com` without `www`) should redirect to `www` wasn't confirmed — a DNS-side decision for Namecheap configuration, not a repo concern
- Live HTTPS certificate issuance timing after DNS cutover needs a real dry-run; research covers the standard mechanism but not this specific domain's propagation behavior

## Sources

### Primary (HIGH confidence)
- Official GitHub Pages documentation — custom domain configuration, CNAME file mechanics, HTTPS enforcement timing
- Direct repo inspection — `src/router/index.ts`, `public/index.html`, `src/components/ProjectDetailsOverlay.vue`, `src/data/ProjectData.ts`, `src/css/projects.less`, absence of `vue.config.js`
- npm registry — `gh-pages` package current version and mechanics

### Secondary (MEDIUM confidence)
- Namecheap Advanced DNS knowledge base — CNAME/A-record configuration for GitHub Pages
- Game-dev portfolio hiring advice and accordion/disclosure accessibility guidance — table-stakes vs. differentiator feature framing

### Tertiary (LOW confidence)
- None — no single-source, low-confidence claims were load-bearing for roadmap decisions

---
*Research completed: 2026-07-23*
*Ready for roadmap: yes*
