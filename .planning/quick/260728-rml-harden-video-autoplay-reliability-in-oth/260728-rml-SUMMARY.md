---
phase: quick-260728-rml
plan: 01
subsystem: ui
tags: [vue2, typescript, video, autoplay, defensive-fix]

requires: []
provides:
  - Other Stuff gallery videos preload full media data, force a source re-scan via load() before play(), and get a one-shot loadedmetadata retry if the first play() is rejected for buffering reasons
affects: []

tech-stack:
  added: []
  patterns:
    - "Defensive autoplay hardening: preload=\"auto\" + explicit load() before play() + a { once: true } loadedmetadata retry listener, layered on top of the existing play().catch(() => {}) no-op pattern, without changing what a genuine autoplay-policy rejection does (still silent)."

key-files:
  created: []
  modified:
    - src/views/OtherStuff.vue

key-decisions:
  - "Treated this as defensive/best-effort hardening, not a confirmed root-cause fix: the reported intermittent gray-box failure could not be reproduced this session because the available browser-automation sandbox stalled every video network fetch, including a known-good external control video, making it non-diagnostic. Independent checks (git blob byte-match, ffprobe validity, dev-server 200/206 + Range support) ruled out the obvious file/server-level causes, so the fix targets the one remaining unverified factor: buffering state at the moment play() first fires."
  - "Used { once: true } on the loadedmetadata retry listener (not manual removeEventListener) per the plan's stated preference, satisfying the DoS-mitigation grep gate (T-RML-02) that bounds the listener to fire at most once regardless of loop/seek cycles."

requirements-completed: [QUICK-260728-RML]

coverage:
  - id: D1
    description: "All three looping clips in the Other Stuff gallery start playing on page load in a real browser, with no clip left as an empty gray box"
    requirement: "QUICK-260728-RML"
    verification:
      - kind: manual_procedural
        ref: "npm run serve, visit /other-stuff in the real browser where the bug was seen, hard-reload with cache disabled 3-5 times, confirm all three clips play"
        status: unknown
    human_judgment: true
    rationale: "The original failure was only ever observed in a real browser and is intermittent; it cannot be automated-verified in this session's tooling (video fetches stalled even for a known-good control clip). This is the one item still owed to the user — see 'Owed to the User' below."
  - id: D2
    description: "A play() rejection caused by insufficient buffered data gets a second automatic play() attempt once metadata is available"
    requirement: "QUICK-260728-RML"
    verification:
      - kind: other
        ref: "grep -v '^\\s*//' src/views/OtherStuff.vue | grep -c 'loadedmetadata' -> 1; retry play() call site confirmed by reading the file"
        status: pass
    human_judgment: false
  - id: D3
    description: "A play() rejection caused by genuine autoplay policy blocking is still swallowed silently"
    requirement: "QUICK-260728-RML"
    verification:
      - kind: other
        ref: "Both play() call sites (initial and retry) end in .catch(() => { /* no-op */ }); no console.error or UI error state added"
        status: pass
    human_judgment: false
  - id: D4
    description: "The retry listener fires at most once per video element and never re-fires on loop or seek"
    requirement: "QUICK-260728-RML"
    verification:
      - kind: other
        ref: "grep -v '^\\s*//' src/views/OtherStuff.vue | grep -cE 'once: true|removeEventListener' -> 1 (attached with { once: true })"
        status: pass
    human_judgment: false

duration: 15min
completed: 2026-07-28
status: complete
---

# Quick Task 260728-rml: Harden Video Autoplay Reliability in Other Stuff Summary

**Defensive hardening of the Other Stuff gallery's video autoplay path — eager `preload="auto"`, `load()` before `play()`, and a one-shot `loadedmetadata` retry — reasoned from the codebase's own known-unreliable autoplay pattern, NOT a confirmed fix for a root cause that could not be reproduced this session.**

## Performance

- **Duration:** ~15 min
- **Tasks:** 1 completed
- **Files modified:** 1

## Accomplishments

- `src/views/OtherStuff.vue` gallery `<video>` element's `preload` attribute changed from `"metadata"` to `"auto"`, so the browser eagerly fetches full media data for all three clips (1.1-4.5 MB each) rather than headers alone
- `mounted()` now calls `video.load()` immediately before the existing `video.play()` call, forcing a re-scan of the `<source>` child to guard against any timing edge case where the ref was populated before the source URL was picked up
- `mounted()` registers a one-shot `loadedmetadata` listener (`{ once: true }`) on each video that retries `play()` once more data is available, using the identical `.catch(() => {})` no-op rejection handler as the first attempt
- Existing rejection-swallowing behavior preserved verbatim in spirit at both call sites — a `play()` rejection from genuine autoplay-policy blocking still produces no console error and no UI error state
- Extended the existing explanatory comment above the `$refs.video` lookup to record that this hardening is defensive/best-effort, not a confirmed root-cause fix

## Task Commits

Each task was committed atomically:

1. **Task 1: Harden the gallery video autoplay path in OtherStuff.vue** - `eabf583` (fix)

_Docs/state commit handled separately by the orchestrator._

## Files Created/Modified

- `src/views/OtherStuff.vue` - `preload="metadata"` → `preload="auto"` on the gallery `<video>` element; `mounted()` gained `video.load()` before `video.play()` and a `{ once: true }` `loadedmetadata` retry listener calling `play()` again with the same no-op catch; comment block extended to note the defensive/best-effort nature of the change

## Decisions Made

- Treated this as a defensive, best-effort fix reasoned from the codebase's existing autoplay pattern rather than a confirmed root-cause fix. The reported intermittent gray-box failure on `/other-stuff` could not be reproduced in this session's tooling: the available browser-automation sandbox stalled every video network fetch, including a known-good external control video, making it non-diagnostic for this specific bug. Independent checks ruled out the obvious causes before this plan was written: the media files are byte-identical to their git blobs, valid per ffprobe (correct duration, h264/aac and mpeg4, all yuv420p, broadly supported), and the dev server serves them with 200/206 plus working Range requests. This plan therefore strengthens the one remaining unverified factor — whether the browser had buffered enough data at the moment `play()` was first called — by widening `preload`, forcing a `load()` before the first `play()`, and adding a bounded one-shot retry once metadata becomes available.
- Used `{ once: true }` (not manual `removeEventListener`) for the retry listener, matching the plan's stated preference and satisfying the DoS-mitigation requirement (threat T-RML-02) that the listener cannot spawn an unbounded retry storm across `loop`/`seek`/`load()` cycles.

## Deviations from Plan

None - plan executed exactly as written. All three defensive changes (template `preload` attribute, `load()` before `play()`, one-shot `loadedmetadata` retry) match the `<action>` and `<done>` criteria, and all grep verification gates pass.

## Issues Encountered

None during implementation. `npm run lint` and `npm run build` both exited 0 on the first attempt after the change; all six automated grep gates specified in the plan passed on the first check.

## User Setup Required

None - no external service configuration required.

## Owed to the User (Important)

**This is a defensive/best-effort fix, not a confirmed root-cause fix.** The failure this plan targets — one of the three Other Stuff gallery clips intermittently rendering as an empty gray box — could not be reproduced in this session's tooling, because the browser-automation sandbox available stalled every video network fetch attempted, including a known-good external control video used specifically to check whether the sandbox itself was the problem. That means the human `<human-check>` verification step specified in the plan is still owed and was NOT performed as part of this execution:

> Run `npm run serve`, open `/other-stuff` in the REAL browser where the bug was seen (not automation), hard-reload with cache disabled, and confirm all three clips are playing rather than showing an empty gray box. Repeat the reload 3-5 times, since the original report was intermittent. If a gray box still appears, this defensive fix did NOT address the real cause — report that back rather than accepting the change as a fix.

Only automated verification was run in this session: `npm run lint`, `npm run build`, and the six static grep gates defined in the plan (`preload="auto"` count, absence of the old `preload="metadata"` value, `.load()` preceding `.play(`, presence of `loadedmetadata`, presence of `once: true`/`removeEventListener`). All passed. The real-browser confirmation across several hard reloads remains the user's to do, and if the gray box still appears after this change, a fresh diagnosis on real hardware (not this session's automation sandbox) will be required.

## Next Phase Readiness

- `npm run lint` clean, `npm run build` succeeds (dist writes successfully)
- All six automated grep verification gates from the plan pass
- `git diff --stat` confirms exactly one file changed: `src/views/OtherStuff.vue`
- Remaining item for the user: the real-browser hard-reload check described above under "Owed to the User"

## Self-Check: PASSED

- FOUND: src/views/OtherStuff.vue
- FOUND: commit eabf583

---
*Phase: quick-260728-rml*
*Completed: 2026-07-28*
