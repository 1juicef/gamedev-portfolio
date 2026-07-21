---
phase: 01-media-performance-optimization
plan: 01
subsystem: infra
tags: [ffmpeg, sharp, webp, h264, media-conversion, node-cli]

# Dependency graph
requires: []
provides:
  - "scripts/convert-media.js — reusable Node CLI (gifToMp4, extractPoster, toWebp) for future re-encodes"
  - "4 MP4 video thumbnails (H.264, muted, faststart) with matching WebP posters"
  - "16 WebP screenshots (quality 82, resized to max width 1000, withoutEnlargement)"
  - "sharp@^0.34.0 devDependency, ffmpeg (Gyan.FFmpeg) system tool"
affects: [01-media-performance-optimization plan 02, 01-media-performance-optimization plan 03]

# Tech tracking
tech-stack:
  added: ["sharp@^0.34.0 (devDependency)", "ffmpeg 8.1.2 (Gyan.FFmpeg, Windows system binary via winget)"]
  patterns: ["Node child_process.execFile with argument arrays for shelling out to ffmpeg (never exec/string concat)", "fail-loud fs.existsSync guard before every conversion (no silent skips)"]

key-files:
  created:
    - scripts/convert-media.js
    - public/img/projects/drag-rush/DragRushGif.mp4
    - public/img/projects/drag-rush/DragRushGif-poster.webp
    - public/img/projects/drag-rush/DragrushSC1.webp
    - public/img/projects/drag-rush/DragrushSC2.webp
    - public/img/projects/drag-rush/DragrushSC3.webp
    - public/img/projects/drag-rush/DragrushSC4.webp
    - public/img/projects/drag-rush/DragrushSC5.webp
    - public/img/projects/dispater/DispaterGif2.mp4
    - public/img/projects/dispater/DispaterGif2-poster.webp
    - public/img/projects/dispater/DispaterSC1.webp
    - public/img/projects/dispater/DispaterSC2.webp
    - public/img/projects/dispater/DispaterSC3.webp
    - public/img/projects/dispater/DispaterSC4.webp
    - public/img/projects/dispater/DispaterSC5.webp
    - public/img/projects/floor-0/Floor0gif1.mp4
    - public/img/projects/floor-0/Floor0gif1-poster.webp
    - public/img/projects/floor-0/Floor0SC1.webp
    - public/img/projects/floor-0/Floor0SC2.webp
    - public/img/projects/floor-0/Floor0SC3.webp
    - public/img/projects/floor-0/Floor0SC4.webp
    - public/img/projects/swing-space/SwingSpaceGIF3.mp4
    - public/img/projects/swing-space/SwingSpaceGIF3-poster.webp
    - public/img/projects/swing-space/SwingSpaceSC1.webp
    - public/img/projects/swing-space/SwingSpaceSC2.webp
  modified:
    - package.json
    - package-lock.json

key-decisions:
  - "sharp pinned to ^0.34.0 (not latest/0.35.x) — 0.35.x requires Node >=20.9, this machine runs 18.20.4"
  - "ffmpeg installed as Windows system binary via winget Gyan.FFmpeg, not an npm package"
  - "SwingSpace source GIF is SwingSpaceGIF3.gif per D-15 (overriding RESEARCH.md's Pitfall-5 default of SwingSpaceGIF.gif)"
  - "Screenshots resized to max width 1000 (withoutEnlargement) in addition to quality-82 WebP re-encode, per Claude's Discretion / Open Question 3"

patterns-established:
  - "Pattern: dev-time-only Node conversion scripts live in scripts/ (not src/), run manually via `node scripts/convert-media.js`, never bundled/shipped to the browser"
  - "Pattern: every conversion function starts with an fs.existsSync guard and throws (fails loud) rather than silently skipping a missing source"

requirements-completed: [MEDIA-01, MEDIA-02]

coverage:
  - id: D1
    description: "sharp@^0.34.0 installed and loadable on Node 18.20.4; ffmpeg installed and invokable"
    requirement: "MEDIA-01"
    verification:
      - kind: other
        ref: "node -e \"require('sharp')\" exit 0; ffmpeg -version exit 0 (banner printed, version 8.1.2-full_build)"
        status: pass
    human_judgment: false
  - id: D2
    description: "4 GIF thumbnails converted to muted H.264 MP4 + WebP poster, each MP4 smaller than its source GIF, no audio stream, source GIFs untouched"
    requirement: "MEDIA-01"
    verification:
      - kind: other
        ref: "node inline size-comparison script (see PLAN.md Task 2 <verify>) — printed videos-ok"
        status: pass
      - kind: other
        ref: "ffprobe ... | grep -ci audio → 0 (no audio stream) on DragRushGif.mp4"
        status: pass
    human_judgment: false
  - id: D3
    description: "16 project screenshots converted from PNG to WebP, each output no larger than its source, source PNGs untouched"
    requirement: "MEDIA-02"
    verification:
      - kind: other
        ref: "node inline size-comparison script (see PLAN.md Task 3 <verify>) — printed count 16, exit 0"
        status: pass
    human_judgment: false
  - id: D4
    description: "Re-running convert-media.js on unchanged sources reproduces equivalent outputs (deterministic CRF 28 / quality 82)"
    verification:
      - kind: other
        ref: "manual re-run comparison: mp4/poster byte sizes identical across the Task 2 run and the Task 3 re-run (drag-rush mp4=663340, dispater mp4=357815, floor-0 mp4=595225, swing-space mp4=796989 — unchanged both times)"
        status: pass
    human_judgment: false

duration: 20min
completed: 2026-07-21
status: complete
---

# Phase 1 Plan 1: Media Conversion Pipeline Summary

**Built scripts/convert-media.js (ffmpeg + sharp) and produced all 24 compressed media assets — 4 muted H.264 MP4 thumbnails with WebP posters and 16 WebP screenshots — with every source GIF/PNG master preserved untouched.**

## Performance

- **Duration:** ~20 min
- **Started:** 2026-07-21T19:27:00Z (approx, per STATE.md session continuity)
- **Completed:** 2026-07-21T21:32:44+02:00
- **Tasks:** 3 completed
- **Files modified:** 26 (2 modified: package.json, package-lock.json; 24 created: 1 script + 24 media assets)

## Accomplishments
- Installed and pinned `sharp@^0.34.0` as a devDependency (Node 18.20.4-compatible) and installed `ffmpeg 8.1.2` (Gyan.FFmpeg via winget) as a Windows system binary
- Wrote `scripts/convert-media.js` — a plain Node CLI with `gifToMp4`, `extractPoster`, `toWebp` functions, safe `child_process.execFile` invocation (argument arrays, never string-concatenated shell commands), and a fail-loud `fs.existsSync` guard before every conversion
- Converted 4 source GIFs to muted, faststart H.264 MP4s (each 5-25x smaller than its source GIF: e.g. SwingSpace 17.9MB GIF → 797KB MP4) plus a compressed WebP poster extracted from each GIF's first frame
- Converted 16 project screenshots from PNG to WebP at quality 82 with a max-width-1000 resize (`withoutEnlargement: true`), each 10-30x smaller than its source PNG
- Confirmed idempotency: re-running the script produced byte-identical MP4/poster sizes on the second pass

## Task Commits

Each task was committed atomically:

1. **Task 1: Install and verify ffmpeg + sharp tooling** - `792d2a0` (chore)
2. **Task 2: Write convert-media.js and convert the four GIF thumbnails to MP4 + poster** - `a6dcb20` (feat)
3. **Task 3: Convert the sixteen project screenshots PNG -> WebP** - `452bc34` (feat)

_No TDD tasks in this plan — single commit per task._

## Files Created/Modified
- `scripts/convert-media.js` - Node CLI conversion pipeline (gifToMp4, extractPoster, toWebp + video/screenshot manifests)
- `package.json` - added `sharp: ^0.34.0` devDependency
- `package-lock.json` - lockfile update from `npm install`
- `public/img/projects/{drag-rush,dispater,floor-0,swing-space}/*.mp4` (4) - converted video thumbnails
- `public/img/projects/{drag-rush,dispater,floor-0,swing-space}/*-poster.webp` (4) - poster frames
- `public/img/projects/{drag-rush,dispater,floor-0,swing-space}/*SC*.webp` (16) - converted screenshots

## Decisions Made
- Pinned `sharp@^0.34.0` explicitly rather than `latest`, per D-01/Pitfall 1 (0.35.x requires Node >=20.9; this machine runs 18.20.4) — verified `require('sharp')` loads cleanly.
- Used `winget install Gyan.FFmpeg` per the plan's documented path; PATH registration was not live in the current shell session (matches RESEARCH.md Pitfall 2 exactly) — worked around within this execution session by resolving and prepending the winget-installed `bin` directory to `PATH` for each conversion-running Bash call. Verified via the Windows user-registry `PATH` (`[Environment]::GetEnvironmentVariable('PATH','User')`) that `...\Gyan.FFmpeg_.../ffmpeg-8.1.2-full_build\bin` is correctly registered there, so a genuinely fresh terminal/session (opened by the user, not this agent's persistent shell) will have `ffmpeg` on PATH with no further action needed.
- SwingSpace source GIF used was `SwingSpaceGIF3.gif` per D-15 (explicit override of RESEARCH.md's Pitfall-5 default of `SwingSpaceGIF.gif`) — confirmed correct by cross-referencing PROJECT.md's existing Key Decisions entry.
- Screenshots resized to max width 1000px (`withoutEnlargement: true`) in the same `toWebp` pass as the quality-82 compression, per Claude's Discretion (CONTEXT.md leaves resolution open) and RESEARCH.md's Open Question 3 rationale (CSS display cap ~400px desktop, retina 2x ~800px).

## Deviations from Plan

None — plan executed exactly as written. The ffmpeg PATH timing issue encountered was explicitly anticipated by the plan itself (Pitfall 2 / Task 1 action text) as an expected, documented condition to work around, not an unplanned deviation.

## Issues Encountered
- `ffmpeg -version` was not recognized in the current agent's persistent Bash shell session immediately after `winget install Gyan.FFmpeg` completed (winget PATH-registration-not-live-in-current-session issue, exactly as documented in 01-RESEARCH.md Pitfall 2). Resolved by locating the installed `ffmpeg.exe` under `%LOCALAPPDATA%\Microsoft\WinGet\Packages\Gyan.FFmpeg_...\ffmpeg-8.1.2-full_build\bin`, confirming it runs correctly directly, and confirming via the Windows user-registry PATH variable that the correct `bin` directory (containing `ffmpeg.exe` directly, not a wrapper folder) is registered — meaning any genuinely fresh terminal session picks it up with no manual intervention. Within this execution session, the resolved `bin` path was prepended to `PATH` per Bash invocation that needed to run `ffmpeg`/`node scripts/convert-media.js`.

## Next Phase Readiness
- All 24 converted media assets exist on disk and are committed, ready for plans 01-02 (timeline video thumbnails) and 01-03 (overlay screenshots) to wire in.
- `scripts/convert-media.js` is reusable for any future re-encode of these same sources (or extension to new projects) without re-deriving the ffmpeg/sharp invocation parameters.
- No blockers. Downstream plans should reference file paths exactly as produced (e.g. `public/img/projects/drag-rush/DragRushGif.mp4`, `public/img/projects/drag-rush/DragRushGif-poster.webp`, `public/img/projects/drag-rush/DragrushSC1.webp` etc.).

---
*Phase: 01-media-performance-optimization*
*Completed: 2026-07-21*
