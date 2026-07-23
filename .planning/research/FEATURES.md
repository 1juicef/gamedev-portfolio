# Feature Research

**Domain:** Developer/game-dev portfolio — "Technical Overview" collapsible deep-dive section
**Researched:** 2026-07-23
**Confidence:** MEDIUM (cross-referenced across multiple independent web searches converging on consistent UX conclusions; no single authoritative spec exists for "portfolio technical fold-outs" as a named pattern — this is synthesized from case-study UX writing, accordion/disclosure accessibility guidance, and game-dev portfolio hiring advice)

## Feature Landscape

### Table Stakes (Users Expect These)

Features a "Technical Overview" fold-out needs, or it reads as broken/half-built.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Collapsed by default | Core value is a 10-second scan; recruiters must never see code unless they opt in | LOW | Native `<details>` element defaults to closed with no JS — matches existing `v-html` pipeline exactly |
| Click-to-expand heading with clear affordance (chevron/"+" icon, hover state) | Standard disclosure-widget convention; users won't find a fold-out they can't recognize as interactive | LOW | Style the native `<summary>` marker or a custom triangle via CSS `::marker`/`list-style` |
| 2-3 curated snippets max, not a full file | Case-study research: skim-friendly summary + optional deeper detail, not an exhaustive dump. Recruiters/leads want proof-of-competence, not a code review | LOW–MEDIUM | Matches Josef's own plan (2-3 snippets/screenshots per project) — validated by research, not just assumption |
| Short caption/rationale per snippet (1-3 sentences: what it does + why it mattered) | "Annotated" pattern consistently favored over long prose — captions next to visuals convey decision-making fast | LOW | Reuses existing "About this game" blurb tone/length already established per project |
| Syntax legibility for code (monospace font, adequate contrast, no wrapping issues) | Baseline expectation once code is shown at all — illegible code reads worse than no code | LOW | Can be plain `<pre><code>` + CSS in `projects.less`; no syntax-highlighter dependency needed for 2-3 short static snippets |
| Independent, not mutually exclusive, expand/collapse per project | Overlay only shows one project at a time already; within that, if screenshots + rationale are separate items, letting more than one be open avoids extra clicking | LOW | Only relevant if the "Technical Overview" is broken into multiple sub-toggles; for a single heading/single fold-out this doesn't apply |

### Differentiators (Competitive Advantage)

Not required, but this is exactly where Josef's stated goal ("real code/blueprint snippets with rationale, without cluttering the scan") wins credibility with technical leads.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Engine-appropriate presentation (real C# snippets for Unity games Drag Rush/SwingSpace; Blueprint graph screenshots, not pasted pseudo-code, for Unreal games Dispater/Floor 0) | Matches how technical reviewers actually expect each engine's work to look; pasting "translated" Blueprint-as-text reads as fake or confused | LOW–MEDIUM | Confirmed pattern: Unity portfolios show clean C# script snippets; Unreal/AAA-facing portfolios show Blueprint screenshots, C++ where relevant. Already the plan per PROJECT.md — validates rather than changes it |
| Rationale text framed as a decision/tradeoff ("chose X approach because Y constraint"), not just a code caption | This is what separates "I can paste code" from "I can explain engineering judgement" — the single highest-leverage differentiator for a technical-lead audience | LOW (writing effort, not code effort) | No component work — this is a content-authoring quality bar for the htmlDescription text, not a UI feature |
| Reused visual language between snippet callouts and the existing "About this game" blurb | Keeps the fold-out feeling like a natural extension of the overlay rather than a bolted-on widget | LOW | Style via `projects.less` classes, consistent with how all other project-specific HTML is already styled |

### Anti-Features (Commonly Requested, Often Problematic)

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|------------------|-------------|
| Full file dumps / pasting entire scripts | Feels "more honest" or "more impressive" | Nobody reads it; undermines the whole point of curation; for Blueprint work there's no clean textual equivalent anyway | 2-3 short, purposeful excerpts (10-30 lines each) with a caption |
| More than ~3 snippets per project | "Why not show everything I built" | Turns a fold-out into a second full page; dilutes which pieces actually matter; increases maintenance burden (4 projects × N snippets to keep in sync with source repos) | Cap at 2-3 per project, matching PROJECT.md's stated target |
| Syntax-highlighting library/dependency (Prism.js, highlight.js, etc.) for a handful of static snippets | "Real code should have real highlighting" | New dependency + bundle weight + build-step complexity for content that's static and small; conflicts with "content/design polish pass, not a re-platform" constraint | Plain `<pre><code>` styled with a monospace font and a couple of manual `<span>` color classes in `projects.less` if any emphasis is truly needed — or none at all |
| JS-driven accordion component (new Vue sub-component, `data()` state, click handlers) for the expand/collapse itself | Feels like "the proper way" to build an accordion | Adds a new component + prop wiring for behavior the browser already provides for free; the existing overlay content is already raw HTML via `v-html`, so JS state can't easily reach into it anyway | Native HTML `<details>`/`<summary>` embedded directly in the `htmlDescription` string — zero JS, keyboard-accessible, and works inside the existing `v-html` pipeline unmodified |
| Auto-expanding the Technical Overview on overlay open, or expanding all projects' sections by default | "Make sure technical reviewers see it" | Directly violates the core value (10-second scan); accordion/disclosure best practice is explicit: don't force-open unless it's the single most critical content, and this isn't — it's supplementary depth | Always collapsed by default; a short static label like "Technical Overview" is enough to signal it exists |
| Live embedded code sandboxes / interactive Blueprint graph viewers | "Let recruiters actually explore the code" | Massive scope/complexity jump for a static portfolio with no backend; nobody asked for interactivity, only credibility | Static curated screenshots/snippets; if more depth is ever wanted, link out to the GitHub repo instead (already a deferred idea for SwingSpace) |

## Feature Dependencies

```
Technical Overview fold-out (per project)
    └──requires──> ProjectData.htmlDescription content addition (new HTML block per project)
                       └──requires──> curated snippet/screenshot selection from each game's source repo (already added as working dirs)
                       └──requires──> new asset files (Blueprint screenshots) placed in public/img/projects/<project>/ for Dispater + Floor 0
                       └──requires──> projects.less styling for new classes (code block, caption, details/summary marker)

Technical Overview fold-out ──enhances──> existing "About this game" blurb (extends the same technical-credibility thread, doesn't replace it)

Native <details>/<summary> disclosure ──conflicts-with──> any plan to build a custom Vue accordion component (redundant; pick one)
```

### Dependency Notes

- **Technical Overview requires htmlDescription content addition:** No `ProjectDetailsOverlay.vue` prop/logic changes are needed — the fold-out is just more raw HTML appended to each project's existing `htmlDescription` string in `GameProjectsData.ts`, rendered by the same `v-html` that already handles screenshots/video/"About this game." This is the single most important dependency finding: the feature is a **content + CSS** change, not a component change.
- **Technical Overview requires new asset files for Blueprint screenshots:** Dispater ("C9") and Floor 0 are Unreal/Blueprints — their "snippets" are screenshots, not text, so this feature has an asset-production dependency (capturing/exporting Blueprint graph screenshots from the Unreal source projects) that Drag Rush/SwingSpace (Unity/C#, pasted as text) don't have. Sequence accordingly: Blueprint screenshot capture is extra lead time versus copy-pasting C# text.
- **Technical Overview enhances "About this game":** the existing blurb already establishes engine/timeframe/one challenge — the fold-out is the natural "click for more" extension of that same paragraph, not a new unrelated section. Keep tone/voice consistent with that existing copy.
- **Native disclosure conflicts with a custom accordion component:** don't build both. The native `<details>`/`<summary>` element gets collapse/expand, keyboard support, and default-closed state for free and fits the `v-html` pipeline; a Vue-component accordion would require restructuring how project content is authored (moving from raw-HTML-string data to structured props) — out of scope for a "content/design polish pass."

## MVP Definition

### Launch With (v1 of this feature)

- [ ] Per-project "Technical Overview" heading using native `<details>`/`<summary>`, collapsed by default — essential to the core value (scan stays fast, depth is opt-in)
- [ ] 2-3 curated snippets/screenshots per project (C# text for Drag Rush/SwingSpace, Blueprint screenshots for Dispater/Floor 0) — essential; this is the feature's entire content
- [ ] 1-3 sentence rationale caption per snippet — essential; without it, snippets are just decoration with no proof of judgement
- [ ] `projects.less` styling for the new markup (monospace code block, caption text, styled disclosure marker consistent with the dark-theme redesign) — essential for it not to look broken/unstyled

### Add After Validation (v1.x)

- [ ] Minor syntax emphasis (a couple of manual `<span>` classes for keywords) if plain monospace reads too flat — only if the shipped version actually looks under-designed after a real look
- [ ] Link-out to source repo (e.g., SwingSpace GitHub) if repo cleanup happens later — deferred per PROJECT.md's existing Out of Scope note

### Future Consideration (v2+, likely never for this project)

- [ ] Syntax-highlighting library — defer indefinitely; only reconsider if snippet volume grows far beyond the 2-3/project cap (it won't, per the anti-feature above)
- [ ] Interactive/expandable code (e.g., "show full function") — defer indefinitely; conflicts with core value

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Collapsed-by-default disclosure via native `<details>` | HIGH | LOW | P1 |
| 2-3 curated code/Blueprint snippets per project | HIGH | MEDIUM (asset/content curation, not code) | P1 |
| Rationale captions per snippet | HIGH | LOW (writing effort) | P1 |
| Dark-theme-consistent styling for the new block | MEDIUM | LOW | P1 |
| Syntax-highlighting library | LOW | MEDIUM (new dependency) | P3 (skip) |
| Custom Vue accordion component | LOW (native element already covers it) | MEDIUM | P3 (skip) |
| Link-out to source repos | LOW-MEDIUM | LOW | P2 (deferred, blocked on repo cleanup per PROJECT.md) |

**Priority key:**
- P1: Must have for this milestone's Technical Overview requirement
- P2: Should have, add when the blocking dependency (repo cleanup) clears
- P3: Skip — anti-feature/over-engineering for this project's scope

## Competitor Feature Analysis

| Feature | Typical UX/design-portfolio case study | Typical game-dev / engineering portfolio | Our Approach |
|---------|------------------------------------------------|-------------------------------------------|--------------|
| Depth layering | Skim summary up top, detail sections below (sometimes via in-page anchors, not always collapsible) | Screenshots/video primary, code usually a secondary "more info" link or none at all | Collapsed-by-default fold-out per project card, keeping the primary scan visual-only |
| Annotation style | Callouts/pointers directly on screenshots with brief captions | Comments/READMEs explaining implementation decisions, when shown at all | Short captions per snippet framed as a decision/tradeoff, matching existing "About this game" tone |
| Engine-specific handling | N/A | Unity → C# snippets; Unreal/AAA → Blueprint screenshots + C++ where relevant | Same split: Drag Rush/SwingSpace get real C# text, Dispater/Floor 0 get Blueprint graph screenshots |
| Volume | Varies widely; better examples are curated, not exhaustive | Best portfolios show 1-3 highlights per project, not full repos | Cap at 2-3 snippets per project across all 4 games |

## Sources

- [25 UX case study examples to inspire your next design project — LogRocket Blog](https://blog.logrocket.com/ux-design/ux-design-case-study-examples/)
- [UX Case Study Deep Dive: Analyzing 5 Award-Winning Design Solutions — Medium/Bootcamp](https://medium.com/design-bootcamp/ux-case-study-deep-dive-analyzing-5-award-winning-design-solutions-67c8af689a66)
- [UX Portfolio Case Study template (plus examples from successful hires) — UX Planet](https://uxplanet.org/ux-portfolio-case-study-template-plus-examples-from-successful-hires-86d5b0faa2d6)
- [Tips on Building a Portfolio for Game Developers — Springboard](https://www.springboard.com/blog/career-advice/game-developer-portfolios/)
- [Building a Game Dev Portfolio That Gets You Hired — Wayline](https://www.wayline.io/blog/building-a-game-dev-portfolio)
- [How to Build a Game Developer Portfolio That Gets You Hired (2026) — Generalist Programmer](https://generalistprogrammer.com/tutorials/game-developer-portfolio-and-resume-guide)
- [How to build a game programming portfolio that impresses employers — Vancouver Film School](https://vfs.edu/news/2025/06/20/game-programming-portfolio-tips)
- [Accessible Accordion vs Disclosure: Dev Best Practices — 216digital](https://216digital.com/accessible-accordion-vs-disclosure-dev-best-practices/)
- [Accessible Accordion — examples and best practices — Aditus](https://www.aditus.io/patterns/accordion/)
- [Designing Perfect Accordion — 10 Best practices for UI designers — UX Planet](https://uxplanet.org/designing-perfect-accordion-0a0d1f49c585)
- [Accordion Pattern — UX Patterns for Developers](https://uxpatterns.dev/patterns/content-management/accordion)
- Existing codebase review: `src/components/ProjectDetailsOverlay.vue` and `src/data/GameProjectsData.ts` (confirmed `v-html`-based rendering path, no component change needed for a native disclosure element) — HIGH confidence (primary source, own codebase)
- Prior milestone research (2026-07-21, this project) covering table-stakes/anti-patterns for the base portfolio (role attribution, no-autoplay, scan speed) — superseded by this file for the v1.2 milestone's Technical Overview question specifically; those findings remain valid and shipped in v1.0/v1.1

**Confidence note:** All web-sourced claims are MEDIUM confidence (cross-checked across independent articles per the `classify-confidence --verified` seam) rather than HIGH, because this domain has no single authoritative/official spec — "technical fold-out" and "accordion/disclosure" best practices are aggregated community/accessibility consensus, not a standards body ruling. The one HIGH-confidence claim in this file (native `<details>`/`<summary>` requires no `ProjectDetailsOverlay.vue` changes) comes directly from reading the actual component/data source, not from web search.

---
*Feature research for: developer/game-dev portfolio Technical Overview fold-out (v1.2 milestone)*
*Researched: 2026-07-23*
