# Phase 1: Media & Performance Optimization - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-07-21
**Phase:** 1-Media & Performance Optimization
**Areas discussed:** Conversion tooling & workflow, Video thumbnail behavior, Asset folder reorganization, Drag Rush & Dispater thumbnail scope, Floor 0 thumbnail — phase boundary, Compression target & fallback

---

## Conversion tooling & workflow

| Option | Description | Selected |
|--------|-------------|----------|
| Install ffmpeg + sharp, convert now | Install ffmpeg via winget + add sharp devDependency; Claude converts this session | ✓ |
| npm-only (sharp for images, skip video) | Add sharp now, hold off on video conversion (needs ffmpeg) | |
| User converts externally | User provides final .mp4/.webp files, Claude only wires them up | |

**User's choice:** Install ffmpeg + sharp, Claude converts and commits.

| Option | Description | Selected |
|--------|-------------|----------|
| MP4 (H.264) only | Universal support, one file per thumbnail | ✓ |
| MP4 + WebM | Smaller (WebM) with MP4 fallback, two files + passes | |

**User's choice:** MP4 (H.264) only.

| Option | Description | Selected |
|--------|-------------|----------|
| Delete after conversion | Remove multi-MB originals from repo/git once replaced | |
| Keep originals, untrack from build output | Keep source GIFs/PNGs in repo, just unreferenced | ✓ |

**User's choice:** Keep originals, untrack from build output.

---

## Video thumbnail behavior

| Option | Description | Selected |
|--------|-------------|----------|
| Autoplay, muted, loop, playsinline (always) | Matches current GIF always-animating behavior | |
| Autoplay only when in viewport (lazy-mounted) | Doesn't start until scrolled into view; pairs with lazy-loading | ✓ |

**User's choice:** Autoplay only when in viewport (lazy-mounted).

| Option | Description | Selected |
|--------|-------------|----------|
| Yes — use a poster frame | Avoids blank/black flash before video loads | ✓ |
| No poster needed | Simpler, no extra asset | |

**User's choice:** Yes — use a poster frame.

---

## Asset folder reorganization

**Not originally a planned gray area** — user interjected mid-discussion (during the Floor 0 phase-boundary question) with new information: they're actively producing new GIFs for Drag Rush/Dispater thumbnails, and asked to reorganize `public/img/projects/` into per-project folders "in the meantime."

**Action taken:** Created `public/img/projects/{drag-rush,dispater,floor-0,swing-space}/`. Moved each project's exclusive screenshots/gifs/video into its folder (`git mv` for tracked `DragrushSC*.png`/`DispaterSC*.png`, plain `mv` for untracked `Floor0*`/`SwingSpace*`/`DragRushGif*`/`DispaterGif*`). Left shared placeholder assets (`project-N-icon.png`, `Guy*.gif`, store badges) at root since they're used by `OtherProjectsData.ts` template placeholders and `Header.vue`/`Footer.vue`, not exclusive to one game. Updated all path references in `GameProjectsData.ts`.

**Notes:** A `DispaterGif2.gif` appeared directly inside the new `dispater/` folder shortly after the reorg — confirms the user is actively dropping new assets in during this same session.

---

## Drag Rush & Dispater thumbnail scope

| Option | Description | Selected |
|--------|-------------|----------|
| Yes — fold into Phase 1 | Same video-thumbnail treatment as SwingSpace/Floor 0, removes always-loaded iframes | ✓ |
| No — keep Phase 1 to SwingSpace/Floor 0 only | Defer to a later phase | |

**User's choice:** Yes — fold into Phase 1.

**Follow-up clarification (user corrected an assumption in Claude's next question):** Claude initially assumed clicking the new thumbnail should link to or embed the trailer directly. User clarified: the trailer stays on the project detail page (`ProjectDetailsOverlay`/`htmlDescription`), exactly like Drag Rush's existing embedded YouTube iframe — not tied to the thumbnail click at all. No autoplay; click-to-play only; leaves the page only if the visitor explicitly clicks the YouTube logo inside the embedded player. Dispater needs the same trailer embed added to its `htmlDescription` (currently missing — its video id `ihPEcIQ_PwI` only exists in the timeline iframe hack being removed).

**Follow-up:** User specified exact source GIFs — Drag Rush uses `DragRushGif.gif` (not `DragRushGif2.gif`); Dispater uses `DispaterGif2.gif` (not `DispaterGif.gif`).

---

## Floor 0 thumbnail — phase boundary

| Option | Description | Selected |
|--------|-------------|----------|
| Phase 1 fully wires it in | Converts + wires Floor0gif1.gif as video by end of Phase 1; Phase 2/CONT-07 shrinks to screenshots + itch.io link | ✓ |
| Phase 1 only converts the file | Leaves thumbnail wiring to Phase 2 | |

**User's choice:** Phase 1 fully wires it in.

---

## Compression target & fallback

| Option | Description | Selected |
|--------|-------------|----------|
| High quality, moderate savings (~80-85% quality) | Prioritize crisp/professional screenshots | ✓ |
| Aggressive (~60-70% quality) | Prioritize load speed, possible visible artifacts | |

**User's choice:** High quality, moderate savings (~80-85% quality).

| Option | Description | Selected |
|--------|-------------|----------|
| Plain WebP only, no fallback | Near-universal browser support, simpler markup | ✓ |
| `<picture>` with PNG fallback | Safer for old browsers, doubles markup + assets | |

**User's choice:** Plain WebP only, no fallback.

---

## Claude's Discretion

- Exact IntersectionObserver/lazy-mount implementation for viewport-triggered video autoplay.
- Exact sharp/ffmpeg CLI parameters (resolution, bitrate) within the agreed quality targets.
- Script vs. inline one-off commands for running the conversions.

## Deferred Ideas

None — all new scope surfaced during discussion (Drag Rush/Dispater thumbnail conversion, Floor 0 full wiring) was folded into Phase 1 by explicit user agreement rather than deferred.
