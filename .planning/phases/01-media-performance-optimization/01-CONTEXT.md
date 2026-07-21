# Phase 1: Media & Performance Optimization - Context

**Gathered:** 2026-07-21
**Status:** Ready for planning

<domain>
## Phase Boundary

The site loads fast and lean — all four project timeline thumbnails (Drag Rush, Dispater, Floor 0, SwingSpace) play as muted, looping, video-converted clips instead of shipping multi-MB GIFs or always-loaded YouTube iframes; every project screenshot is compressed to WebP; and every project image — including images inside hand-authored `htmlDescription` HTML and below-fold timeline thumbnails — loads lazily.

</domain>

<decisions>
## Implementation Decisions

### Conversion tooling & workflow
- **D-01:** No ffmpeg, cwebp, or imagemagick is installed on this machine, and `package.json` has no image/video processing libraries. Install ffmpeg (via winget) for GIF→MP4 conversion, and add `sharp` as a devDependency for PNG→WebP conversion (pure npm, no system binary needed). Claude performs the actual conversions during plan execution and commits the output files.
- **D-02:** Converted video thumbnails ship as **MP4 (H.264) only** — no WebM. Universal browser support, simplest markup, one file per thumbnail.
- **D-03:** Original oversized GIFs/PNGs are **kept in the repo** as source masters (available for future re-encodes) but become unreferenced by any component once their replacements are wired in. Do not delete them.

### Video thumbnail behavior
- **D-04:** Converted timeline thumbnails autoplay **only when scrolled into the viewport** (lazy-mounted — e.g. IntersectionObserver), then loop, muted, `playsinline`. This pairs naturally with lazy-loading below-fold thumbnails (MEDIA-03) — thumbnails never scrolled to never start playing.
- **D-05:** Each video thumbnail shows a **poster/first-frame image** while the video file itself is still loading, to avoid a blank/black flash.

### Asset folder reorganization (done during this discussion)
- **D-06:** `public/img/projects/` is reorganized into per-project subfolders: `drag-rush/`, `dispater/`, `floor-0/`, `swing-space/` (folder names match `ProjectData.id`). Each project's own screenshots/gifs/video now live in its folder. Already executed — `git mv` used for tracked files (`DragrushSC*.png`, `DispaterSC*.png`), plain `mv` for untracked files (`Floor0*`, `SwingSpace*`, `DragRushGif*.gif`, `DispaterGif*.gif`). All path references in `GameProjectsData.ts` were updated to match.
- **D-07:** Shared/placeholder assets stay at `public/img/projects/` root — they are NOT project-exclusive: `project-1-icon.png` through `project-9-icon.png` (used by `OtherProjectsData.ts` template placeholders, and coincidentally reused as stale icons for `drag-rush`/`floor-0` in `GameProjectsData.ts` today), the mascot `Guy.gif`/`Guy1-4.gif` (used by `Header.vue`/`Footer.vue`), and `ms-store-logo.png`/`play-store-logo.png`.
- **Note for planner/executor:** the old `img/projects/floor-0-1.png` .. `floor-0-4.png` paths referenced in Floor 0's current `htmlDescription` do not exist on disk (already missing/broken) — this is expected to be fixed by CONT-01 in Phase 2 (screenshot swap to `Floor0SC1-4.png`, now living in `img/projects/floor-0/`), not by this phase.

### Drag Rush & Dispater thumbnail scope (folded into Phase 1)
- **D-08:** Converting Drag Rush's and Dispater's new GIFs to video-thumbnails (same pipeline as SwingSpace/Floor 0) IS in scope for Phase 1. This replaces `GameProjects.vue`'s special-cased always-loaded YouTube iframe branch for these two projects (the `v-if="project.id !== 'drag-rush' && project.id !== 'dispater'"` / `v-else` split, ~lines 31-42) — removing an always-loaded iframe from the timeline is itself a performance win in this phase's spirit (MEDIA-03 territory). After this change, all four projects use the identical thumbnail treatment (video with poster, lazy-mounted per D-04/D-05) and identical click behavior (opens `ProjectDetailsOverlay`, same as every other project — no special-cased click behavior remains).
- **D-09:** The trailer is NOT tied to the thumbnail click. It lives on the project's detail page (inside `ProjectDetailsOverlay`, i.e. `ProjectData.htmlDescription`) — exactly like Drag Rush's existing embedded YouTube iframe (`https://www.youtube.com/embed/L5YWz2i434E`, plain, non-autoplay). **Dispater needs the same trailer embed ADDED to its `htmlDescription`** (it doesn't have one yet) using its existing video id `ihPEcIQ_PwI` (currently only used in the timeline iframe hack being removed per D-08). No autoplay on either embed — visitor must click play in the embedded player; it only navigates to youtube.com if they explicitly click the YouTube logo inside the player (default iframe embed behavior — nothing custom to build).
- **D-10:** Source GIF for each project's converted timeline video: **Drag Rush** → `img/projects/drag-rush/DragRushGif.gif` (not `DragRushGif2.gif`). **Dispater** → `img/projects/dispater/DispaterGif2.gif` (not `DispaterGif.gif`).

### Floor 0 thumbnail — phase boundary
- **D-11:** Phase 1 **fully wires in** Floor 0's new video thumbnail — converts `img/projects/floor-0/Floor0gif1.gif` to video and updates `GameProjectsData.ts` so Floor 0's timeline thumbnail plays it by the end of Phase 1 (matching Phase 1's literal success criteria). This means **Phase 2's CONT-07 requirement is already satisfied by Phase 1** — Phase 2 only needs to cover Floor 0's screenshots (CONT-01) and itch.io link (CONT-05), not the thumbnail. Flag this for the roadmap/requirements traceability update at Phase 1 completion.

### Compression target & fallback
- **D-12:** WebP compression target is **high quality, moderate savings (~80-85% quality)** — prioritize screenshots still looking crisp/professional (recruiters/leads are judging visual polish) over maximal file-size reduction.
- **D-13:** **No `<picture>`/PNG fallback** — plain WebP only. WebP has near-universal support in current browsers (Chrome, Firefox, Safari 14+, Edge); simpler markup, just swap the file extension.

### Claude's Discretion
- Exact IntersectionObserver / lazy-mount implementation approach for video autoplay-in-viewport (D-04).
- Exact sharp/ffmpeg CLI invocation parameters (resolution, bitrate) within the quality targets set by D-02/D-12.
- Whether to use a small standalone script (e.g. `scripts/convert-media.js`) or inline one-off conversion commands, given this is a one-time asset pass, not an ongoing build step.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Roadmap & Requirements
- `.planning/ROADMAP.md` — Phase 1 goal, success criteria, and how it relates to Phase 2/3
- `.planning/REQUIREMENTS.md` — MEDIA-01, MEDIA-02, MEDIA-03 (this phase); CONT-01, CONT-05, CONT-07 (Phase 2, note D-11 changes CONT-07 status)
- `.planning/PROJECT.md` — Core value, constraints (tech stack fixed, assets already produced by user), key decisions log

### Codebase maps
- `.planning/codebase/STACK.md` — confirms no image/video tooling currently in `package.json`
- `.planning/codebase/ARCHITECTURE.md` — component responsibilities, data flow (`ProjectData` → `GameProjects.vue`/`ProjectDetailsOverlay.vue`)
- `.planning/codebase/CONVENTIONS.md` — naming/style conventions to follow when adding new code (e.g. a conversion script)

No other external specs/ADRs — requirements fully captured in decisions above.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/helpers.ts` (`Helpers.preloadImages`) — currently eager-preloads 3 hardcoded, unused-elsewhere icon paths (`project-1/2/3-icon.png`) in `src/App.vue`. Worth revisiting as dead weight during this phase's performance pass, though not an explicit requirement.
- `src/data/ProjectData.ts` — typed model already carries `iconUrl`; no schema change needed to point it at a video path for the thumbnail, but a per-project "is this a video thumbnail" convention will be needed since `iconUrl` today is used generically for `<img>` src.

### Established Patterns
- `GameProjects.vue`'s current drag-rush/dispater special case (always-loaded YouTube iframe instead of `iconUrl` image) is being removed per D-08 — all 4 projects converge on one thumbnail pattern.
- `ProjectDetailsOverlay.vue` renders `htmlDescription` via `v-html`; custom classes used inside it must be styled in `src/css/projects.less` (globally loaded, not scoped) — relevant for any new video-thumbnail wrapper classes added to the overlay markup.

### Integration Points
- `src/data/GameProjectsData.ts` — central place where all iconUrl/htmlDescription asset paths are declared; this phase touches every project's entry.
- `src/App.vue` — `Helpers.preloadImages()` call site; may need updating if preload list should include (or explicitly exclude) new video posters.

</code_context>

<specifics>
## Specific Ideas

- Per-project image folders were reorganized live during this discussion: `public/img/projects/{drag-rush,dispater,floor-0,swing-space}/`. This is already done in the working tree (not yet committed).
- User is actively producing new GIFs mid-session and dropping them directly into the new per-project folders (e.g. `DispaterGif2.gif` appeared in `dispater/` after the reorg) — expect more assets to show up before/during plan execution.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within Phase 1 scope (with D-08/D-11 explicitly expanding Phase 1's scope to absorb work originally filed under Phase 2, by mutual agreement).

</deferred>

---

*Phase: 1-Media & Performance Optimization*
*Context gathered: 2026-07-21*
