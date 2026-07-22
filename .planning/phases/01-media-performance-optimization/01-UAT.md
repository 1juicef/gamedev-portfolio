---
status: complete
phase: 01-media-performance-optimization
source: [01-01-SUMMARY.md, 01-02-SUMMARY.md, 01-03-SUMMARY.md]
started: 2026-07-22T09:28:54.000Z
updated: 2026-07-22T09:40:00.000Z
---

## Current Test

[testing complete]

## Tests

### 1. Open the game-projects timeline
expected: Run `npm run serve`, open the site, navigate to /game-projects. Page loads without a noticeable stall from oversized assets.
result: pass

### 2. Scroll the timeline top to bottom slowly
expected: Each of the 4 project thumbnails (Drag Rush, Dispater, Floor 0, SwingSpace) shows a static poster image until it nears the viewport, then swaps to a playing, muted, looping video clip with no audio and no page navigation. SwingSpace's clip stays visibly narrower/centered compared to the other three.
result: pass

### 3. Scroll a thumbnail back out of view
expected: Its video pauses once scrolled away (it doesn't keep playing off-screen).
result: pass

### 4. Click each of the 4 project titles/thumbnails
expected: Each opens its detail overlay showing that project's own screenshots (and video/trailer where applicable) — Dispater's overlay includes its YouTube trailer embed. Works identically for all four.
result: pass

### 5. Screenshot visual quality check
expected: Looking at a few of the overlay screenshots (ideally at 2x/retina), they read as crisp and professional — no visible blockiness, banding, or over-compression artifacts.
result: issue
reported: "The floor 0 thumbnail is a little bit to long, 1.5 seconds should be cut of at the end. Otherwise, all good."
severity: minor

### 6. sharp/ffmpeg conversion pipeline installed and invokable
expected: sharp@^0.34.0 installed and loadable on Node 18.20.4; ffmpeg installed and invokable
result: pass
source: automated
coverage_id: 01-01/D1

### 7. GIF thumbnails converted to MP4 + poster
expected: 4 GIF thumbnails converted to muted H.264 MP4 + WebP poster, each MP4 smaller than its source GIF, no audio stream, source GIFs untouched
result: pass
source: automated
coverage_id: 01-01/D2

### 8. Screenshots converted to WebP
expected: 16 project screenshots converted from PNG to WebP, each output no larger than its source, source PNGs untouched
result: pass
source: automated
coverage_id: 01-01/D3

### 9. Conversion pipeline determinism
expected: Re-running convert-media.js on unchanged sources reproduces equivalent outputs (deterministic CRF 28 / quality 82)
result: pass
source: automated
coverage_id: 01-01/D4

### 10. Overlay screenshots lazy-loaded WebP
expected: All 16 overlay screenshots load as lazy WebP with loading before src
result: pass
source: automated
coverage_id: 01-03/D1

### 11. Floor 0 broken references fixed
expected: Floor 0's overlay shows real Floor0SC1-4.webp screenshots instead of broken flat-directory references
result: pass
source: automated
coverage_id: 01-03/D2

### 12. Dispater YouTube trailer embed present
expected: Dispater's overlay has a plain, non-autoplay YouTube trailer embed (video id ihPEcIQ_PwI) with loading="lazy"
result: pass
source: automated
coverage_id: 01-03/D3

### 13. Drag Rush trailer lazy-loaded
expected: Drag Rush's existing trailer iframe carries loading="lazy"
result: pass
source: automated
coverage_id: 01-03/D4

### 14. SwingSpace video deferred
expected: SwingSpace's overlay video uses preload="metadata" so the multi-MB clip is not fully fetched on overlay open
result: pass
source: automated
coverage_id: 01-03/D5

### 15. App.vue preload cleanup
expected: App.vue no longer eager-preloads stale placeholder-icon paths and carries no unused Helpers import
result: pass
source: automated
coverage_id: 01-03/D6

## Summary

total: 15
passed: 14
issues: 1
pending: 0
skipped: 0

## Gaps

- gap_id: G-01-5
  truth: "Floor 0's timeline video thumbnail (Floor0gif1.mp4) plays a tight, well-trimmed loop"
  status: resolved
  resolved_by: 01-04-PLAN.md
  resolved_at: 2026-07-22
  reason: "User reported: The floor 0 thumbnail is a little bit to long, 1.5 seconds should be cut of at the end. Otherwise, all good."
  severity: minor
  test: 5
  root_cause: "Floor0gif1.mp4 (and its source Floor0gif1.gif) both run 14.0s per ffprobe — the source GIF's final ~1.5s is dead/trailing content the user wants trimmed. gifToMp4() in scripts/convert-media.js has no trim/duration flag, so the full source length is always encoded 1:1."
  artifacts:
    - path: "scripts/convert-media.js"
      issue: "gifToMp4() encodes full source duration; needs a per-asset trim (output ~12.5s for Floor 0) via an ffmpeg -t/-to flag"
    - path: "public/img/projects/floor-0/Floor0gif1.mp4"
      issue: "Committed output needs to be re-generated at ~12.5s instead of 14.0s"
  missing:
    - "Add a trim duration (or -ss/-t window) for the floor-0 entry in convert-media.js's videoAssets pipeline, targeting ~12.5s output"
    - "Re-run conversion for Floor0gif1 only and re-commit the shorter Floor0gif1.mp4 (source Floor0gif1.gif untouched per D-03)"
  debug_session: ""
