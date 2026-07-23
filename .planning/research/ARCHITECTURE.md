# Architecture Research

**Domain:** Static Vue 2 portfolio — per-project content extension (Technical Overview collapsible), theme redesign integration, custom-domain deploy
**Researched:** 2026-07-23
**Confidence:** HIGH (small, fully-read codebase; decision is a direct extension of an existing, well-established convention — no external ecosystem uncertainty)

## Standard Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────┐
│  GameProjectsData.ts (per-project ProjectData instances)    │
│  htmlDescription: raw HTML string — video/img/iframe/badge  │
│  already mixed inline; Technical Overview extends this only │
├───────────────────────────┬───────────────────────────────┤
│  GameProjects.vue          │  ProjectDetailsOverlay.vue    │
│  (opens overlay, passes    │  (v-html renders string,      │
│  accentColor/htmlDescription│  <details> native toggle      │
│  through as props)          │  needs zero new script logic) │
├───────────────────────────┴───────────────────────────────┤
│  src/css/projects.less (global, non-scoped)                  │
│  new classes: .tech-overview, .code-snippet, .tech-caption   │
├───────────────────────────────────────────────────────────┤
│  public/ (verbatim-copied by Vue CLI to dist/ root)          │
│  index.html (og:url/og:image, hand-edited) + new CNAME file │
└─────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| `GameProjectsData.ts` | Owns all per-project content, including the new Technical Overview markup | Existing `ProjectData` instances — **no new fields added** |
| `ProjectDetailsOverlay.vue` | Renders `htmlDescription` via `v-html`; hosts dark-theme gradient styling | **Unchanged** by the Technical Overview feature — already touched by the redesign, which must land first |
| `projects.less` | Styles for all dynamic HTML content (existing convention) | Add ~4 new class blocks for the collapsible + code/caption styling |
| `public/index.html` | Site metadata (`og:url`, `og:image`) | Hand-edited once domain is live, same convention as v1.0 META-01 |
| `public/CNAME` | GitHub Pages custom domain binding | New static file, copied verbatim by Vue CLI's default `public/` → `dist/` behavior |

## Recommended Project Structure

No new folders or files in `src/`. This feature is content, not code:

```
src/
├── data/
│   └── GameProjectsData.ts    # unchanged shape — 4 htmlDescription strings grow,
│                               # each gets a <details> block appended
├── css/
│   └── projects.less          # + .tech-overview / .code-snippet / .tech-caption rules
public/
├── CNAME                       # NEW — contains exactly: www.josefubaka.com
├── index.html                  # og:url / og:image hand-edited post-DNS-cutover
└── img/projects/<project>/tech/  # NEW subfolder per project, for Blueprint
                                   # screenshots (Dispater/Floor Zero) — same
                                   # convention as existing SCn.webp screenshots
```

### Structure Rationale

- **No `techSnippets` field on `ProjectData`, no new Vue subcomponent.** Every other rich-content type in this codebase (YouTube embeds, screenshot galleries, itch.io badges, `<video>` players) already lives as raw HTML inside `htmlDescription`. Code snippets are `<pre><code>` and Blueprint graphs are `<img>` — both are already first-class citizens of the raw-HTML pattern. Introducing a structured field + subcomponent for one new content type, used by exactly 4 projects each with different content shapes (2 have code, 2 have images), duplicates an abstraction the codebase already has and that CLAUDE.md documents as the intended convention ("edit the relevant data file only — no component changes needed").
- **`public/img/projects/<project>/tech/`** mirrors the existing `public/img/projects/<project>/` layout — no new asset pipeline, same manual placement as current screenshots.

## Architectural Patterns

### Pattern 1: Native `<details>`/`<summary>` collapsible (chosen)

**What:** Wrap the Technical Overview content in `<details class="tech-overview"><summary>Technical Overview</summary>...</details>` directly inside the `htmlDescription` template literal.
**When to use:** Any collapsible UI where the trigger is a simple click-to-expand with no animation requirement beyond CSS — which is exactly this case (recruiters skip it, technical reviewers click it).
**Trade-offs:** Zero JS, zero Vue reactivity, works even if `v-html` is rendered non-reactively (it is). No open/close animation without extra CSS (`details[open] summary ~ *` transition trick) — acceptable, not requested. Native `<details>` also gives free keyboard/AT support (focusable, `Enter`/`Space` toggle, exposed as expanded/collapsed to screen readers) that a hand-rolled `v-if` toggle would have to reimplement.

**Example:**
```typescript
// Inside a ProjectData htmlDescription template literal (GameProjectsData.ts)
`
<details class="tech-overview">
    <summary>Technical Overview</summary>
    <div class="paragraph">
        The Beat Conductor synced enemy spawns to the music's BPM via a
        lightweight tick-based scheduler:
    </div>
    <pre class="code-snippet"><code>void OnBeat(float bpm) {
    float interval = 60f / bpm;
    if (Time.time - lastTick &gt;= interval) {
        SpawnObstacle();
        lastTick = Time.time;
    }
}</code></pre>
    <div class="tech-caption">Beat-synced obstacle spawner (Drag Rush, C#)</div>
</details>
`
```

### Pattern 2: Manually HTML-escaped code, no highlighter

**What:** Paste real source snippets directly into the template literal, hand-escaping `<`, `>`, `&` to entities (`&lt;`, `&gt;`, `&amp;`). No syntax-highlighting library, no markdown-to-HTML step.
**When to use:** 2-3 short (5-15 line) curated snippets per project, hand-picked and hand-pasted once — not user-generated or frequently-updated content.
**Trade-offs:** No color-coded syntax highlighting (acceptable — plain monospace on dark background reads fine for 2-3 illustrative snippets; adding Prism/highlight.js is a new dependency for a cosmetic want nobody asked for). Backticks inside the snippet must be escaped (`` \` ``) since the whole block lives inside a TS template literal — same constraint the file already lives under for any string content; just be aware of it when pasting C# that might contain `` ` `` (rare) or Blueprint captions with none.

### Pattern 3: Blueprint screenshots reuse the existing `.pc-screenshot` convention

**What:** For Dispater ("C9") and Floor Zero (Unreal/Blueprint), Technical Overview content is `<img>` tags pointing at new files in `public/img/projects/<project>/tech/`, styled with a dedicated `.blueprint-screenshot` class (can simply alias `.pc-screenshot` sizing, no new layout logic).
**When to use:** Whenever the "technical" content is visual rather than text (this is the Unreal-side symmetric case to Pattern 2's Unity/C# code case).
**Trade-offs:** None — this is literally the same `<img loading="lazy">` pattern already used for every other screenshot in the file, just placed inside the `<details>` block instead of the main body.

## Data Flow

### Request Flow

```
User clicks project card (GameProjects.vue)
    ↓
popupContent = item.htmlDescription (already includes <details class="tech-overview">...)
    ↓
ProjectDetailsOverlay renders via v-html (unchanged prop/binding contract)
    ↓
Browser-native <details> toggle — no Vue involvement, no re-render
```

### Key Data Flows

1. **Content authoring → render:** Adding/editing Technical Overview content is a pure `GameProjectsData.ts` string edit, identical in kind to adding a new screenshot or itch.io badge today. No prop, no component, no `ProjectData.ts` field changes.
2. **Style resolution:** New classes (`.tech-overview`, `.code-snippet`, `.tech-caption`, `.blueprint-screenshot`) go in `projects.less` under the existing `.dialog-content { ... }` block, same as every other content class today — they must land there for v-html content to pick them up (global, non-scoped stylesheet).

## Scaling Considerations

Not applicable in the traditional sense (4 static projects, no runtime scaling concerns). The only "scale" axis here is *maintainability if a 5th project is added later* — the raw-HTML convention holds fine at this size (4-6 projects); if the portfolio ever grew to 15-20 projects with heavy per-project technical content, the calculus would flip toward a structured field + subcomponent (better editability, testability). That threshold is far above current/planned scope (Out of Scope explicitly excludes new projects) — no action needed now.

## Anti-Patterns

### Anti-Pattern 1: New `techSnippets: {code, language, caption}[]` field + dedicated Vue subcomponent

**What people do:** Reach for a "properly typed" structured data model + component whenever a new content shape appears, on the theory that it's more "correct."
**Why it's wrong here:** It contradicts the codebase's one deliberate, working convention (raw HTML string = single source of truth for arbitrary per-project content), forces `ProjectDetailsOverlay.vue` to grow new props/conditional rendering logic it doesn't currently have, and buys type safety for content that is hand-authored once by one person, not runtime/user data needing validation. It also means two different rendering paths for "screenshot" content (existing inline `<img>` vs. new structured Blueprint-image entries) for no reason — Dispater/Floor Zero's Blueprint screenshots are literally the same kind of asset as their existing gameplay screenshots.
**Do this instead:** Extend the existing string with `<details>` + a few CSS classes (Pattern 1-3 above).

### Anti-Pattern 2: Templating `public/index.html`'s `og:url`/`og:image` via build-time env interpolation

**What people do:** Wire `VUE_APP_SITE_URL` from `.env` into `index.html` via `<%= VUE_APP_SITE_URL %>` EJS interpolation, "to avoid hardcoding."
**Why it's wrong here:** `.env` is already documented (CLAUDE.md) as *not* read at runtime and disconnected from the build (confirmed: zero `process.env.VUE_APP_*` references anywhere in `src/`). The domain changes exactly once (this launch). Adding webpack HTML-interpolation wiring for a value that's set once and never touched again is speculative infrastructure for a problem that doesn't recur.
**Do this instead:** Hand-edit `public/index.html` directly once DNS/Pages is confirmed live — same convention already used for META-01 in v1.0. Update `og:url` → `https://www.josefubaka.com/` and `og:image` → `https://www.josefubaka.com/img/avatar.png`, and update `.env`'s equivalent metadata values too for documentation consistency (it's not read at runtime, but it's the canonical "what should this say" reference per existing convention).

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| GitHub Pages | Custom domain via `public/CNAME` (verbatim-copied to `dist/CNAME` by Vue CLI's default static-asset handling — no `vue.config.js` change needed) | File must contain exactly `www.josefubaka.com`, no protocol, no trailing slash, no newline issues (plain single line) |
| Namecheap DNS | `CNAME` record for `www` → `1juicef.github.io`, plus apex `@` A-records or ALIAS to GitHub Pages IPs if `josefubaka.com` (no `www`) should also resolve | Outside this codebase's scope — DNS-side config, not a repo change. GitHub Pages settings must have "Enforce HTTPS" re-checked after DNS propagates (cert reissue takes a few minutes-hours) |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| Redesign ↔ Technical Overview (both touch `ProjectDetailsOverlay.vue` / `projects.less`) | Sequential, not parallel | **Commit the redesign first.** It already changes `.dialog-content`'s background from per-project `accentColor` gradient to a fixed dark gradient — the new `.tech-overview`/`.code-snippet` styles need to be authored against that final dark palette, not the old accent-color one. Building Technical Overview CSS before the redesign lands means re-styling it once the redesign commits, or conflicting uncommitted diffs in the same two files. |
| Domain deploy ↔ everything else | None — fully independent files (`public/CNAME`, `public/index.html`, DNS/Pages settings) | Can happen in any order relative to the redesign/Technical Overview work; it touches zero `src/` files. The one internal ordering constraint is self-contained: DNS+Pages must go live *before* hand-editing `og:url`/`og:image`, since those values need the real, working domain to be worth verifying via a social-preview re-check (closing the deferred Phase 3 UAT gap). |
| `GameProjectsData.ts` ↔ `projects.less` | Class name contract, no type checking | Same as today — a class used in a `htmlDescription` string with no matching `projects.less` rule silently renders unstyled (this already happened once, per Key Decisions: the `.pc-video`/`.swing-space-*` gap). Add the new Technical Overview classes to `projects.less` in the *same commit* as the first project's content edit to avoid repeating that gap. |

## Recommended Build Order

1. **Commit the redesign** (`App.vue`, `ProjectDetailsOverlay.vue` dark gradient + fonts) — establishes the final visual language everything else styles against.
2. **Technical Overview** — content edits to `GameProjectsData.ts` (4 projects) + new CSS block in `projects.less`, styled against the now-committed dark theme. No `ProjectData.ts` or `ProjectDetailsOverlay.vue` changes required.
3. **Domain deploy** — independent of 1-2; can run before, during, or after. Sequence internally: DNS + GitHub Pages settings → add `public/CNAME` → verify site resolves on custom domain → hand-edit `og:url`/`og:image` in `public/index.html` (and `.env` for documentation parity) → re-check social-preview card (closes deferred Phase 3 UAT gap).

## Sources

- Direct codebase read: `src/data/ProjectData.ts`, `src/data/GameProjectsData.ts`, `src/components/ProjectDetailsOverlay.vue`, `src/css/projects.less`, `public/index.html`, `.planning/PROJECT.md`
- Repo inspection: no `vue.config.js`, no `.github/workflows`, no `gh-pages` script present — confirmed Vue CLI defaults govern `public/` → `dist/` copying and no existing CI/CD deploy automation to account for
- `grep` confirmed zero `process.env.VUE_APP_*` / `VUE_APP` references in `src/` — confirms CLAUDE.md's note that `.env` is not build-time-wired into `index.html`

---
*Architecture research for: Vue 2 static portfolio — Technical Overview feature, redesign integration, custom-domain deploy*
*Researched: 2026-07-23*
