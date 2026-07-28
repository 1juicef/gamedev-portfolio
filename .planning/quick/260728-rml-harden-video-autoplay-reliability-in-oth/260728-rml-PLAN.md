---
phase: quick-260728-rml
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - src/views/OtherStuff.vue
autonomous: true
requirements: [QUICK-260728-RML]

must_haves:
  truths:
    - "All three looping clips in the Other Stuff gallery start playing on page load in a real browser, with no clip left as an empty gray box."
    - "A clip whose first play() attempt is rejected because the browser had not buffered enough data gets a second automatic play() attempt once metadata is available."
    - "A play() rejection caused by genuine autoplay policy blocking is still swallowed silently — no console error, no UI error state."
    - "The retry listener fires at most once per video element and never re-fires on loop or seek."
  artifacts:
    - "src/views/OtherStuff.vue — video element preloads full media data; mounted() calls load() before play() and registers a one-shot loadedmetadata retry."
  key_links:
    - "video ref array (populated by ref inside v-for) -> load() -> play() ordering in mounted()"
    - "loadedmetadata event -> retry play() -> same swallow-rejection handler"
    - "preload attribute value -> browser buffer state at the moment play() is first called"
---

<objective>
Harden the autoplay path for the three looping background videos in the Other Stuff gallery so a clip cannot be left showing an empty gray box.

Purpose: The user reported, in a real browser, that one of the three clips in `/other-stuff` intermittently renders as an empty gray box instead of playing. Root cause could NOT be conclusively reproduced: the browser-automation sandbox available this session stalled every video network fetch — including a known-good external control video — so it is not diagnostic. Independent checks ruled out the obvious causes: the media files are byte-identical to their git blobs, valid per ffprobe (correct duration, h264/aac and mpeg4, all yuv420p, broadly supported), and the dev server serves them with 200/206 plus working Range requests.

This is therefore a **defensive, best-effort fix reasoned from the codebase's own autoplay pattern — not a confirmed root-cause fix.** The file's existing comment already flags that the declarative `autoplay` attribute "isn't reliably honored on every browser"; this plan strengthens the imperative fallback around that known-unreliable mechanism. The user must re-check in their real browser after this change; if the gray box persists, this plan did not fix it and a fresh diagnosis on real hardware is required.

Output: One hardened `src/views/OtherStuff.vue` (template attribute + `mounted()` logic), passing lint and build.
</objective>

<execution_context>
@$HOME/.claude/gsd-core/workflows/execute-plan.md
@$HOME/.claude/gsd-core/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/STATE.md
@src/views/OtherStuff.vue

Relevant existing shape of `src/views/OtherStuff.vue` (do not re-derive — this is already known):
- Template has exactly ONE `<video>` element, rendered per-item by the `v-for` over `media`, carrying `autoplay muted loop playsinline` plus a `preload` attribute, with a `<source :src="item.src" type="video/mp4" />` child.
- `media` holds 7 entries; 3 are `type: "video"` (`110001-0265.mp4`, `Crouch%20walking1.mp4`, `natiDraken.mp4`), sizes 1.1–4.5 MB.
- `mounted()` reads `this.$refs.video` as `HTMLVideoElement[] | undefined`, early-returns when absent/empty, then `forEach`s calling `video.play().catch(() => {})` with an explanatory no-op comment.
- Project has NO test suite (see CLAUDE.md). Verification is lint + build + static greps + human browser check.
</context>

<tasks>

<task type="auto">
  <name>Task 1: Harden the gallery video autoplay path in OtherStuff.vue</name>
  <files>src/views/OtherStuff.vue</files>
  <action>
Apply three defensive changes to the existing video autoplay path. Do not restructure the component, do not touch the `media` array, the styles, or the `<img>` branch.

(1) Template — eager buffering. On the single `<video>` element inside the `v-for`, change the value of the `preload` attribute from its current metadata-only setting to `auto`, so the browser eagerly fetches full media data rather than headers alone. Rationale to keep in mind while editing: the three clips are only 1.1–4.5 MB, so full preload is a cheap cost, and it removes the failure mode where the element is still under-buffered at the moment `play()` is first called. Leave `autoplay`, `muted`, `loop`, `playsinline`, `:aria-label`, the `class`, the `ref`, and the `<source>` child exactly as they are.

(2) `mounted()` — force a source re-scan before playing. Inside the existing `videos.forEach` callback, call `video.load()` on the element BEFORE the existing `video.play()` call. This makes the element re-scan its `<source>` child, guarding against any timing edge case where the ref was populated before the source URL had been picked up. Keep the existing early-return guard (`if (!videos || videos.length === 0) return;`) untouched.

(3) `mounted()` — one-shot retry safety net. Also register a `loadedmetadata` listener on each video that calls `video.play()` again, using the same swallow-the-rejection handler as the initial call. This covers the case where the first `play()` was rejected because the browser had not buffered enough yet and does not retry on its own once more data arrives. The listener MUST NOT be able to fire repeatedly: attach it with the `{ once: true }` options object (preferred, and supported by the ES5 build target since it is a runtime DOM API, not a language feature), or otherwise explicitly `removeEventListener` from inside the handler. Note that `load()` resets the element and re-fires `loadedmetadata`, so the retry will still get its chance after step (2).

Preserve the existing rejection behaviour verbatim in spirit: BOTH the initial `play()` and the retry `play()` end in `.catch(() => { /* no-op */ })`. A rejection here is the expected outcome when a real user agent's autoplay policy blocks playback — it is not an error and must not be logged or surfaced.

Keep the existing explanatory comment block above the `$refs.video` lookup (it documents why `$refs.video` is an array and why the imperative `play()` exists). Extend it, or add a short adjacent comment, to record that this hardening is defensive/best-effort — the reported gray-box failure was never reproduced in tooling. Write that note in your own words; do NOT paste any HTML attribute string into a comment.

TypeScript is in strict mode: the `videos` local is already typed `HTMLVideoElement[] | undefined` and narrowed by the early return, so `load()`, `play()`, and `addEventListener` all type-check without casts. Do not add `any`.
  </action>
  <verify>
    <automated>cd "D:/Kodning/Portfolio/gamedev-portfolio" && npm run lint</automated>
    <automated>cd "D:/Kodning/Portfolio/gamedev-portfolio" && npm run build</automated>
    <automated>cd "D:/Kodning/Portfolio/gamedev-portfolio" && grep -v '^\s*//' src/views/OtherStuff.vue | grep -c 'preload="auto"'</automated>
    <automated>cd "D:/Kodning/Portfolio/gamedev-portfolio" && test "$(grep -v '^\s*//' src/views/OtherStuff.vue | grep -c 'preload=.metadata.')" = "0"</automated>
    <automated>cd "D:/Kodning/Portfolio/gamedev-portfolio" && test "$(grep -v '^\s*//' src/views/OtherStuff.vue | grep -oE '\.load\(\)|\.play\(' | head -1)" = ".load()"</automated>
    <automated>cd "D:/Kodning/Portfolio/gamedev-portfolio" && grep -v '^\s*//' src/views/OtherStuff.vue | grep -c 'loadedmetadata'</automated>
    <automated>cd "D:/Kodning/Portfolio/gamedev-portfolio" && grep -v '^\s*//' src/views/OtherStuff.vue | grep -cE 'once: true|removeEventListener'</automated>
    <human-check>Run `npm run serve`, open `/other-stuff` in the REAL browser where the bug was seen (not automation), hard-reload with cache disabled, and confirm all three clips are playing rather than showing an empty gray box. Repeat the reload 3-5 times, since the original report was intermittent. If a gray box still appears, this defensive fix did NOT address the real cause — report that back rather than accepting the change as a fix.</human-check>
  </verify>
  <done>
`npm run lint` and `npm run build` both exit 0. In `src/views/OtherStuff.vue`, ignoring `//` comment lines: `preload="auto"` appears exactly once; the previous metadata-level preload value appears zero times; the first occurrence of a `.load()`/`.play(` call in the file is `.load()`; `loadedmetadata` appears at least once; at least one of `once: true` / `removeEventListener` appears. Both `play()` call sites still swallow rejection with a no-op catch. No `any` introduced, no other component behaviour changed.
  </done>
</task>

</tasks>

<threat_model>
## Trust Boundaries

| Boundary | Description |
|----------|-------------|
| browser -> same-origin static assets (`public/img/other-stuff/*.mp4`) | Media fetched by the page; files are repo-committed, not user-supplied |
| browser autoplay policy -> page JS | User-agent policy decides whether `play()` resolves; page must degrade gracefully |

## STRIDE Threat Register

| Threat ID | Category | Component | Severity | Disposition | Mitigation Plan |
|-----------|----------|-----------|----------|-------------|-----------------|
| T-RML-01 | Denial of Service | eager `preload="auto"` on 3 clips (1.1-4.5 MB) | low | accept | Bounded, static, same-origin payload totalling well under 10 MB on a single gallery route; no user-controlled URLs, no amplification vector. Cost accepted in exchange for autoplay reliability. |
| T-RML-02 | Denial of Service | `loadedmetadata` retry listener | low | mitigate | Listener attached with `{ once: true }` (or explicitly removed in-handler) so `loop`/`seek`/`load()` cycles cannot spawn an unbounded `play()` retry storm. Enforced by the `once: true \| removeEventListener` grep gate. |
| T-RML-03 | Information Disclosure | swallowed `play()` rejection | low | accept | The `.catch(() => {})` no-op is deliberate: autoplay-blocked is an expected user-agent outcome, and surfacing it would leak nothing useful while adding console noise. |

No package-manager installs in this plan, so the supply-chain (`T-*-SC`) legitimacy gate does not apply.
</threat_model>

<verification>
1. `npm run lint` exits 0 (no new ESLint or TypeScript strict-mode violations).
2. `npm run build` exits 0 (component still compiles against the ES5 target).
3. All static grep gates in Task 1 pass.
4. Human browser re-check on `/other-stuff` across several hard reloads (see `<human-check>`).
</verification>

<success_criteria>
- `src/views/OtherStuff.vue` preloads full media data, calls `load()` before `play()` in `mounted()`, and carries a one-shot `loadedmetadata` retry.
- Rejection handling is unchanged: both play attempts fail silently when autoplay is blocked.
- Lint and build pass; no other files touched.
- The SUMMARY explicitly records that this is a defensive/best-effort hardening reasoned from the codebase's own autoplay pattern — NOT a confirmed root-cause fix — because the reported gray-box failure could not be reproduced in this session's tooling (the sandbox stalled all video fetches, including a known-good control), and that the user must confirm in their real browser.
</success_criteria>

<output>
Create `.planning/quick/260728-rml-harden-video-autoplay-reliability-in-oth/260728-rml-SUMMARY.md` when done.
</output>
