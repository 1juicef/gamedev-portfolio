# Phase 5: Dark Theme Redesign - Context

**Gathered:** 2026-07-23
**Status:** Ready for planning

<domain>
## Phase Boundary

Commit and finalize the dark-gradient background, Lekton/Russo One custom fonts, and reworked overlay dialog styling — currently sitting uncommitted in the working tree (`src/App.vue`, `src/components/ProjectDetailsOverlay.vue`) since v1.0 — as the site's new visual baseline. This establishes the final dark palette that Phase 6's Technical Overview styling depends on. Josef explicitly chose "commit as-is" over an added full-site contrast QA pass or an explicit deep-link regression check — this phase is about landing the existing work cleanly, not re-designing or auditing every route.

</domain>

<decisions>
## Implementation Decisions

### Overlay link color (projects.less)
- **D-01:** `projects.less`'s `a { color: #696969; }` rule (inside `.dialog-content`) was tuned for the old white/`#fcfcfc` overlay card and is not touched by the existing redesign diff. Since the dialog background is changing to a dark gradient, this must be updated to a **light color** so links stay legible — not left as dim gray-on-near-black, and not switched to the accent purple (`@accentColor`/`#6C3BAA`). Exact shade (pure white vs. off-white) is Claude's discretion.

### Color token strategy
- **D-02:** The existing uncommitted diff hardcodes the new dark-theme colors as literals (gradient stops, `#000000`) directly in `App.vue`/`ProjectDetailsOverlay.vue`, rather than updating `variables.less`'s existing `@bodyBgColor`/`@textColor`/`@accentColor` tokens. **Formalize the new palette as named Less variables** in `variables.less` (e.g. gradient start/end stops, the dark dialog background) and update both files to reference them instead of literals. This gives Phase 6 a clean, named reference for code-block backgrounds instead of copy-pasting hex values by eye.

### Scope boundary (explicit)
- **D-03:** No full-site contrast/readability QA pass across every route (Resume, Contact, 404, OtherProjects) — Josef explicitly declined this option. Land the redesign, apply D-01/D-02, and move on.
- **D-04:** No explicit deep-link/router-mode regression check as a phase task — router mode isn't being touched by this redesign. (Still worth a sanity glance during execution since it's a known research pitfall, but not a formal requirement or blocking check.)

### Claude's Discretion
- Exact light shade chosen for the overlay link color (D-01).
- Exact Less variable names for the new palette tokens (D-02).
- Whether `Header.vue`/`Footer.vue` need any touch-up — scanned during discussion and found to already use `background-color: transparent` / no hardcoded colors, so no clash expected; no action needed unless something looks wrong during execution.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Roadmap & Requirements
- `.planning/ROADMAP.md` — Phase 5 goal, success criteria
- `.planning/REQUIREMENTS.md` — REDESIGN-01
- `.planning/PROJECT.md` — v1.2 Current Milestone section, Context (redesign adoption decision), Key Decisions
- `.planning/research/SUMMARY.md` / `ARCHITECTURE.md` / `PITFALLS.md` — build-order rationale (redesign before Technical Overview), router-mode incidental-edit pitfall

### Codebase
- `src/App.vue` — uncommitted redesign diff (dark gradient, fonts, `.main` padding)
- `src/components/ProjectDetailsOverlay.vue` — uncommitted redesign diff (dialog background/title styling)
- `src/css/variables.less` — existing color tokens (`@bodyBgColor: #000000`, `@contentBgColor: #434348`, `@textColor: #ffffff`, `@accentColor: #6C3BAA`) to extend per D-02
- `src/css/projects.less` — `.dialog-content a { color: #696969; }` link-color fix per D-01

No other external specs/ADRs — requirements fully captured in decisions above.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `variables.less` already establishes the project's Less-variable convention (`@bodyBgColor`, `@textColor`, `@accentColor`) — D-02 extends this existing pattern rather than introducing a new one.
- Self-hosted TTF fonts (Lekton, Russo One) already added under `public/fonts/Lekton,Russo_One/` as part of the uncommitted diff — no new asset work needed.

### Established Patterns
- `ProjectDetailsOverlay.vue` renders project `htmlDescription` via `v-html`; custom classes used inside that raw HTML are styled in the globally-loaded, unscoped `src/css/projects.less` — this is why the link-color fix (D-01) lives there, not in the component's own `<style>` block.
- `Header.vue`/`Footer.vue` currently have no hardcoded light-theme colors (`Footer.vue` already uses `background-color: transparent`) — confirmed via grep during this discussion, so the mascot/personality boundary from Phase 2 (mascot confined to header/footer) should carry over visually without extra work.

### Integration Points
- `src/App.vue` — global styles (`html, body`, `#app`, `.main`, font-face declarations) — where the gradient/font literals currently live, to be replaced with variable references per D-02
- `src/components/ProjectDetailsOverlay.vue` — dialog/dialog-content/dialog-title styling — same literal-to-variable change
- `src/css/variables.less` — new tokens added here per D-02
- `src/css/projects.less` — link-color fix per D-01, isolated to this one file

</code_context>

<specifics>
## Specific Ideas

- Link color should read as "light" (white/off-white family), not the accent purple — matches the redesign's white body text rather than introducing a second link treatment.
- New palette variables should live in `variables.less` alongside the existing `@bodyBgColor`/`@textColor`/`@accentColor` tokens, following that file's existing naming convention.

</specifics>

<deferred>
## Deferred Ideas

None new this session — the untracked new media assets (additional gifs/screenshots for all 4 projects sitting in `public/img/projects/`) were explicitly out of this milestone's scope per the original `/gsd-new-milestone` scoping conversation (Josef selected "Decide the visual redesign's fate," "Deploy to custom domain," and "Add technical information," not "Add new media to existing projects"). Not re-raised this session; still available in the working tree for a future milestone.

### Reviewed Todos (not folded)
- **Deploy portfolio to custom domain www.josefubaka.com** — matched Phase 5 by the todo-matcher's keyword scoring (0.6, weak overlap on "custom"/"phase"), but this todo is already correctly tagged `resolves_phase: 7` and belongs to Phase 7 (Custom Domain Deploy), not this phase. Confirmed as a false-positive match; not folded here.

</deferred>

---

*Phase: 5-Dark Theme Redesign*
*Context gathered: 2026-07-23*
