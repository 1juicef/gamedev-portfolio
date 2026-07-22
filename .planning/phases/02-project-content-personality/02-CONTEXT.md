# Phase 2: Project Content & Personality - Context

**Gathered:** 2026-07-22
**Status:** Ready for planning

<domain>
## Phase Boundary

Visitors get accurate, warm, technically substantive project information — team attribution (Drag Rush, Dispater), a finalized "About this game" blurb per project, warm hero copy, and Floor 0's itch.io link — without ever seeing code, and personality (mascot, tone) stays inside a deliberate boundary. Covers CONT-02, CONT-03, CONT-04, CONT-05, POLISH-02. (CONT-01 and CONT-07 were satisfied early by Phase 1 — see Decisions below.)

</domain>

<decisions>
## Implementation Decisions

### Team attribution (CONT-02)
- **D-01:** Drag Rush was built by a team of **6**. Josef touched a bit of everything, but mainly programmed the vehicle animation trees for all vehicles, and helped finalize the beat conductor.
- **D-02:** Dispater was built by a team of **7**. Josef built the dialogue, task, and interaction systems, plus did the audio engineering.
- **D-03:** Attribution lines should read naturally inside each project's existing "About this game" block (`src/data/GameProjectsData.ts`) — matching the terse, punchy bullet style already used there (see `<code_context>`), not a separate formal credits section.

### Already satisfied — do not redo (traceability)
- **D-04:** CONT-01 (Floor 0 screenshots swapped off broken `floor-0-1..4.png` refs) and CONT-07 (Floor 0 timeline thumbnail switched off the placeholder icon) were both satisfied early by Phase 1 (per Phase 1's D-11/D-14) and are marked complete in `REQUIREMENTS.md`. This phase does not touch either.
- **D-05:** Hero copy (CONT-03) already reads warm and personal in the current working tree (`src/views/GameProjects.vue`: "Hello there!", Josef's bio — game dev student in Gothenburg, fashion/retail background, Resident Evil/dogs/gym). Not discussed further this session — treat as a strong existing draft; the planner/executor should confirm with Josef only if wording needs polish, not restructuring.
- **D-06:** "About this game" blurbs for all 4 projects (CONT-04) already have engine + dev timeframe + at least one technical highlight in `GameProjectsData.ts`. Not fully re-discussed this session. Known copy-quality issues to fix as part of finalizing (typos, not new content): "rythmgame" → "rhythm game" (Drag Rush), "enviroment" → "environment" (Floor 0), "intergration" → "integration" (SwingSpace), "Will leave you sleep less for days" (Floor 0) reads awkward — tighten wording. Drag Rush and Dispater's blurbs should also incorporate the new team-attribution facts from D-01/D-02.

### Floor 0 itch.io link (CONT-05)
- **D-07:** URL is already known and locked: `https://juice-f.itch.io/floorzero`. Add a `<div class="paragraph center"><a href="https://juice-f.itch.io/floorzero" target="_blank">Play on itch.io</a></div>` block to Floor 0's `htmlDescription` in `GameProjectsData.ts`, matching Drag Rush/Dispater's existing pattern exactly (same classes, same `target="_blank"`).

### Personality boundary (POLISH-02)
- **Not discussed this session** — user chose to focus discussion on team attribution only and was ready to proceed. Planner/executor should treat the existing hero bio and mascot placement (header/footer only, per Phase 1 context) as the current boundary; a full top-to-bottom read-through checkpoint (per ROADMAP Success Criterion 5) should happen at UAT time with Josef, not be pre-decided here.

### Claude's Discretion
- Exact phrasing/placement of the Drag Rush and Dispater attribution lines within their existing "About this game" blocks (D-03 sets the constraint; wording is Claude's to draft, subject to Josef's review at UAT).
- Whether typo fixes (D-06) are folded into this phase's plan tasks directly or handled as a trivial pre-pass — planner's call, not a separate discussion topic.

### Reviewed Todos (not folded)
Four pending todos matched this phase's scope by keyword but were explicitly kept deferred by Josef — see `<deferred>` below for details.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Roadmap & Requirements
- `.planning/ROADMAP.md` — Phase 2 goal, success criteria, relationship to Phase 1 (done) and Phase 3
- `.planning/REQUIREMENTS.md` — CONT-02, CONT-03, CONT-04, CONT-05, POLISH-02 (this phase); CONT-01 and CONT-07 already marked Complete (satisfied early by Phase 1, D-04 above)
- `.planning/PROJECT.md` — Core value, constraints, Key Decisions log (mascot personality decision already logged there)
- `.planning/phases/01-media-performance-optimization/01-CONTEXT.md` — D-11/D-14 (why CONT-01/CONT-07 are already done)

### Codebase maps
- `.planning/codebase/ARCHITECTURE.md` — component responsibilities, data flow
- `.planning/codebase/CONVENTIONS.md` — naming/style conventions

No other external specs/ADRs — requirements fully captured in decisions above.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/data/GameProjectsData.ts` — single file holding every project's `htmlDescription` string; all 4 projects' "About this game" blocks already follow an identical `<h3>About this game</h3>` + `<br/>`-separated bullet-line pattern — new attribution lines should match this exact style, not introduce a new format.
- Drag Rush's and Dispater's existing `<a href="..." target="_blank">Play on itch.io</a>` blocks (already in the same style CONT-05 needs to replicate for Floor 0).

### Established Patterns
- `src/views/GameProjects.vue`'s hero section (`<div class="hero">` / `.hero-copy` / `.hero-photo`) already holds the full warm-tone copy (D-05) — any hero edits are scoped to this one template block plus its adjacent `<style>` rules, no component restructuring needed.
- `iconUrl` field on each `ProjectData` entry (e.g. `"img/projects/project-8-icon.png"` for Drag Rush, `"img/projects/project-7-icon.png"` for Floor 0) is **dead/unused** for the GameProjects timeline since Phase 1's refactor — only `ProjectsList.vue` (used by `OtherProjects.vue`) reads `iconUrl`. Not in scope to fix this phase; flagged for awareness only so nobody mistakes it for a live asset reference.

### Integration Points
- `src/data/GameProjectsData.ts` — every decision in this phase (attribution, blurb polish, itch.io link) is a `htmlDescription` string edit in this one file; no other file needs to change for CONT-02/04/05.
- `src/views/GameProjects.vue` — hero copy lives here if CONT-03 polish is needed.

</code_context>

<specifics>
## Specific Ideas

- Drag Rush attribution: team of 6, Josef mainly on vehicle animation trees + helped finalize the beat conductor, touched "a little bit of everything" otherwise.
- Dispater attribution: team of 7, Josef built dialogue/task/interaction systems + audio engineering.

</specifics>

<deferred>
## Deferred Ideas

### Reviewed Todos (not folded)
- **Add two Game Jam games to timeline** (`.planning/todos/pending/2026-07-22-add-two-game-jam-games-to-timeline.md`) — explicitly deferred to a future phase (e.g. Phase 4) after the current 3-phase redesign completes, per the standing decision recorded in that todo. Reviewed again this session; stays deferred.
- **Swap Dispater timeline gif and project page gif** (`.planning/todos/pending/2026-07-22-swap-dispater-timeline-gif-and-project-page-gif.md`) — matched Phase 2 by keyword (content-ish), but Josef chose to keep it deferred rather than fold in, to stay tightly scoped to attribution/blurb/hero/itch.io work.
- **Fix footer text spacing** (`.planning/todos/pending/2026-07-22-fix-footer-text-spacing-portfoliobyjuicef.md`) — trivial CSS fix, no content/personality tie-in; kept deferred, likely better fit for Phase 3 (Visual Polish).
- **Make timeline title click affordance more visible** (`.planning/todos/pending/2026-07-22-make-timeline-title-click-affordance-more-visible.md`) — UI/visual signal, not content; kept deferred, likely better fit for Phase 3 (Visual Polish).

</deferred>

---

*Phase: 2-Project Content & Personality*
*Context gathered: 2026-07-22*
