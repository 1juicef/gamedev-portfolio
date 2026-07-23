# Phase 3: Visual Polish, Resume & Site Metadata - Context

**Gathered:** 2026-07-22
**Status:** Ready for planning

<domain>
## Phase Boundary

The timeline layout reads more restrained and premium (POLISH-01), the Resume page shows a single polished image (RESUME-01), and shared links render accurate site metadata instead of placeholder values (META-01). Includes two folded todos: timeline title click affordance, and swapping Dispater's timeline/project-page gif assignment.

</domain>

<decisions>
## Implementation Decisions

### Timeline layout polish (POLISH-01)
- **D-01:** No specific complaint about the current layout — general restraint/premium polish pass, Claude's discretion on exact spacing/title-weight/image-sizing changes.
- **D-02:** Keep the alternating left/right row layout (`project-row--reverse`) — it's the site's signature timeline feel. Do not restructure to a uniform single-side layout.
- **D-03 (folded todo):** Timeline project titles (`.project-title-link` in `GameProjects.vue`) currently only signal clickability via a hover color change (`:hover { color: #f4cde6; }`) — no persistent visual cue. Add a more visible click affordance (e.g. underline, icon, or a stronger persistent style) so visitors recognize titles are clickable without needing to hover first.
- **D-04 (folded todo):** Swap Dispater's timeline-thumbnail and project-overlay gif assignment — currently timeline uses `DispaterGif2.mp4` (converted from `DispaterGif2.gif`) per Phase 1's D-10. Josef wants the other gif (`DispaterGif.gif`) on the timeline, and `DispaterGif2.gif`'s content moved to the overlay instead. Planner/executor should check current wiring in `GameProjectsData.ts`/`GameProjects.vue`'s `thumbVideos` map before implementing — this may require converting `DispaterGif.gif` to MP4 (the media pipeline `scripts/convert-media.js` from Phase 1 already exists for this) since only `DispaterGif2.gif` was converted to video in Phase 1.

### Resume presentation (RESUME-01)
- **D-05:** Static display only — no click-to-enlarge, no download link, no PDF/accessibility mitigation (explicit accepted tradeoff already logged in PROJECT.md).
- **D-06 (already implemented — verify, don't rebuild):** `src/views/Resume.vue` in the current working tree ALREADY shows `actualResume.png` as a centered, full-width-capped static image (`display: flex; justify-content: center`, `.resume-image { width: 100%; max-width: 1100px }`, responsive `max-width: 1200px` at 620px+). This matches Josef's chosen treatment exactly. The planner/executor should verify this is correct/final and commit it rather than re-implementing from scratch — likely just needs the RESUME-01 requirement marked satisfied once confirmed.

### Site metadata (META-01)
- **D-07:** Title: "Josef — Game Developer Portfolio". Description: something like "Game dev portfolio showcasing Drag Rush, Dispater, Floor Zero, and SwingSpace." (exact final wording is Claude's discretion, keep it simple/direct per this pattern).
- **D-08:** Real site URL for `og:url` (and as the base for `og:image`'s absolute path): **`https://1juicef.github.io/gamedev-portfolio/`** — confirmed via `git remote -v` (GitHub username `1juicef`, repo `gamedev-portfolio`). This is a GitHub Pages *project* page URL (repo name in the path), not a root user-page domain — that would require a separately-named `1juicef.github.io` repo, which doesn't exist. Not yet deployed as of this writing; use this URL now since it's the correct one once Pages is enabled for this exact repo.
- **D-09:** `og:image` should use Josef's avatar photo (`img/avatar.png`, already used in the hero section) rather than a game screenshot/collage — needs to become an absolute URL (`https://1juicef.github.io/gamedev-portfolio/img/avatar.png`) since OG image tags require absolute paths, not relative ones.
- **Note:** `public/index.html` currently hardcodes metadata directly (title, og:title, og:description, og:url, og:image) rather than templating from `.env` (per CLAUDE.md's architecture note) — edit `index.html` directly; `.env` is not read at runtime for this.

### Claude's Discretion
- Exact spacing/title-weight/image-sizing values for the timeline restraint pass (D-01).
- Exact final wording of the meta description (D-07) — keep it in the simple/direct style already given.
- Exact click-affordance treatment for timeline titles (D-03) — underline vs. icon vs. persistent style change.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Roadmap & Requirements
- `.planning/ROADMAP.md` — Phase 3 goal, success criteria
- `.planning/REQUIREMENTS.md` — POLISH-01, RESUME-01, META-01
- `.planning/PROJECT.md` — Resume accessibility tradeoff already logged in Key Decisions

### Codebase
- `src/views/GameProjects.vue` — timeline layout, `.project-title-link` styling (D-01/D-03)
- `src/views/Resume.vue` — already-implemented resume image treatment (D-06)
- `public/index.html` — hardcoded metadata to replace (D-07/D-08/D-09)
- `scripts/convert-media.js` (Phase 1) — reusable pipeline if Dispater's gif swap (D-04) needs a new MP4 conversion
- `src/data/GameProjectsData.ts` / `GameProjects.vue`'s `thumbVideos` map — current Dispater timeline/overlay asset wiring (D-04)

No other external specs/ADRs — requirements fully captured in decisions above.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- Phase 1's `scripts/convert-media.js` (`gifToMp4`, `extractPoster`, `toWebp` exports) — directly reusable if D-04's Dispater gif swap needs a fresh MP4 conversion for `DispaterGif.gif`.
- `.project-title-link`'s existing `transition: color 0.18s ease, opacity 0.18s ease` and `:hover` rule — a base to extend for D-03's stronger affordance, not necessarily replace.

### Established Patterns
- `GameProjects.vue`'s `thumbVideos`/`thumbPosters` id-keyed maps (Phase 1 pattern) are the single source of truth for which converted asset plays on the timeline per project — D-04's swap is a map-value change plus (if needed) a new conversion, not a template change.
- `Resume.vue`'s current implementation (D-06) already follows this project's simple single-purpose-component convention — no changes needed there beyond verification.

### Integration Points
- `public/index.html` — all of META-01's changes are isolated to this one file's `<head>` block.
- `src/views/GameProjects.vue` — POLISH-01 (layout) and D-03 (title affordance) both isolated to this one file's template/style block.

</code_context>

<specifics>
## Specific Ideas

- Site title: "Josef — Game Developer Portfolio"
- Real deployment URL confirmed: `https://1juicef.github.io/gamedev-portfolio/`
- og:image should be the existing avatar photo, not a new asset

</specifics>

<deferred>
## Deferred Ideas

None new this session — the two folded todos (D-03, D-04) are now in scope, not deferred.

### Reviewed Todos (not folded)
- **Add two Game Jam games to timeline** — still explicitly deferred to a future phase (e.g. Phase 4) after this 3-phase redesign completes, per the standing decision from Phase 2's discussion. Not re-reviewed this session (out of Phase 3's domain).

</deferred>

---

*Phase: 3-Visual Polish, Resume & Site Metadata*
*Context gathered: 2026-07-22*
