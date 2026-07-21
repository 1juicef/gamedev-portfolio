# Phase 1: Media & Performance Optimization - Research

**Researched:** 2026-07-21
**Domain:** Windows-local media conversion tooling (ffmpeg + sharp) and Vue 2 lazy-loading/viewport-autoplay patterns for a static portfolio site
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Conversion tooling & workflow**
- **D-01:** No ffmpeg, cwebp, or imagemagick is installed on this machine, and `package.json` has no image/video processing libraries. Install ffmpeg (via winget) for GIF→MP4 conversion, and add `sharp` as a devDependency for PNG→WebP conversion (pure npm, no system binary needed). Claude performs the actual conversions during plan execution and commits the output files.
- **D-02:** Converted video thumbnails ship as **MP4 (H.264) only** — no WebM. Universal browser support, simplest markup, one file per thumbnail.
- **D-03:** Original oversized GIFs/PNGs are **kept in the repo** as source masters (available for future re-encodes) but become unreferenced by any component once their replacements are wired in. Do not delete them.

**Video thumbnail behavior**
- **D-04:** Converted timeline thumbnails autoplay **only when scrolled into the viewport** (lazy-mounted — e.g. IntersectionObserver), then loop, muted, `playsinline`. This pairs naturally with lazy-loading below-fold thumbnails (MEDIA-03) — thumbnails never scrolled to never start playing.
- **D-05:** Each video thumbnail shows a **poster/first-frame image** while the video file itself is still loading, to avoid a blank/black flash.

**Asset folder reorganization (already done)**
- **D-06:** `public/img/projects/` is reorganized into per-project subfolders: `drag-rush/`, `dispater/`, `floor-0/`, `swing-space/` (folder names match `ProjectData.id`). Already executed and confirmed on disk this session.
- **D-07:** Shared/placeholder assets stay at `public/img/projects/` root — NOT project-exclusive: `project-1-icon.png` through `project-9-icon.png`, the mascot `Guy.gif`/`Guy1-4.gif` (used by `Header.vue`/`Footer.vue`), and `ms-store-logo.png`/`play-store-logo.png`.
- **Note for planner/executor:** the old `img/projects/floor-0-1.png` .. `floor-0-4.png` paths referenced in Floor 0's current `htmlDescription` do not exist on disk (already missing/broken) — this is expected to be fixed by CONT-01 in Phase 2 (screenshot swap to `Floor0SC1-4.png`), not by this phase. *(Research finding: this conflicts with Success Criterion #2 — see Common Pitfalls / Pitfall 4.)*

**Drag Rush & Dispater thumbnail scope (folded into Phase 1)**
- **D-08:** Converting Drag Rush's and Dispater's new GIFs to video-thumbnails (same pipeline as SwingSpace/Floor 0) IS in scope for Phase 1. This replaces `GameProjects.vue`'s special-cased always-loaded YouTube iframe branch for these two projects — after this change, all four projects use the identical thumbnail treatment and identical click behavior (opens `ProjectDetailsOverlay`).
- **D-09:** The trailer is NOT tied to the thumbnail click. It lives on the project's detail page (inside `ProjectDetailsOverlay`, i.e. `ProjectData.htmlDescription`) — exactly like Drag Rush's existing embedded YouTube iframe (`https://www.youtube.com/embed/L5YWz2i434E`, plain, non-autoplay). **Dispater needs the same trailer embed ADDED to its `htmlDescription`** (it doesn't have one yet) using its existing video id `ihPEcIQ_PwI`. No autoplay on either embed.
- **D-10:** Source GIF for each project's converted timeline video: **Drag Rush** → `img/projects/drag-rush/DragRushGif.gif` (not `DragRushGif2.gif`). **Dispater** → `img/projects/dispater/DispaterGif2.gif` (not `DispaterGif.gif`).

**Floor 0 thumbnail — phase boundary**
- **D-11:** Phase 1 **fully wires in** Floor 0's new video thumbnail — converts `img/projects/floor-0/Floor0gif1.gif` to video and updates `GameProjectsData.ts` so Floor 0's timeline thumbnail plays it by the end of Phase 1. This means Phase 2's CONT-07 requirement is already satisfied by Phase 1 — Phase 2 only needs to cover Floor 0's screenshots (CONT-01) and itch.io link (CONT-05), not the thumbnail. Flag this for the roadmap/requirements traceability update at Phase 1 completion.

**Compression target & fallback**
- **D-12:** WebP compression target is **high quality, moderate savings (~80-85% quality)** — prioritize screenshots still looking crisp/professional over maximal file-size reduction.
- **D-13:** **No `<picture>`/PNG fallback** — plain WebP only. WebP has near-universal support in current browsers; simpler markup, just swap the file extension.

### Claude's Discretion
- Exact IntersectionObserver / lazy-mount implementation approach for video autoplay-in-viewport (D-04).
- Exact sharp/ffmpeg CLI invocation parameters (resolution, bitrate) within the quality targets set by D-02/D-12.
- Whether to use a small standalone script (e.g. `scripts/convert-media.js`) or inline one-off conversion commands, given this is a one-time asset pass, not an ongoing build step.

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within Phase 1 scope (with D-08/D-11 explicitly expanding Phase 1's scope to absorb work originally filed under Phase 2, by mutual agreement).
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-------------------|
| MEDIA-01 | SwingSpace and Floor 0 timeline thumbnails delivered as compressed video instead of multi-MB GIFs | Standard Stack (ffmpeg GIF→MP4), Code Examples (ffmpeg command + poster extraction), Common Pitfalls #2/#5 (winget PATH gotcha, ambiguous SwingSpace source GIF) |
| MEDIA-02 | All project screenshots (Drag Rush, Dispater, Floor 0, SwingSpace) compressed/re-encoded to WebP | Standard Stack (sharp), Code Examples (sharp webp() pipeline), Common Pitfalls #1 (sharp/Node version pin), #4 (Floor 0 phase-boundary conflict), Open Question #3 (resize recommendation) |
| MEDIA-03 | `loading="lazy"` applied to every project image, including images inside `v-html` description strings and below-fold timeline thumbnails | Architecture Patterns / Pattern 2 (attribute-order requirement), Common Pitfalls #3, Don't Hand-Roll (native attribute vs. polyfill) |
</phase_requirements>

## Summary

This phase has two independent technical halves: (1) a **one-time, dev-machine media conversion pass** (GIF→MP4 via ffmpeg, PNG→WebP via sharp) whose outputs get committed as static assets, and (2) **Vue 2 component/template changes** to consume those assets lazily (IntersectionObserver-gated video autoplay, `loading="lazy"` on images, removal of the drag-rush/dispater YouTube-iframe special case). Neither half is architecturally risky — this is a static, client-only, no-backend site — but there are three concrete gotchas worth planning around: sharp's newest major version (0.35.x) requires Node ≥20.9, which is **incompatible** with this machine's installed Node 18.20.4 (pin to `^0.34.0` instead); the winget ffmpeg package has a well-documented PATH-registration bug requiring a terminal restart (and occasionally a reboot) before `ffmpeg` is recognized; and `loading="lazy"` has a known cross-browser attribute-order sensitivity — it must appear before `src` in the tag markup to reliably engage, which matters directly for the hand-authored `v-html` image strings in `GameProjectsData.ts`.

A fourth finding is a **phase-boundary conflict** the planner must resolve explicitly: Success Criterion #2 requires all 4 projects' overlay screenshots to load as WebP by end of Phase 1, but Floor 0's `htmlDescription` currently references broken, non-existent `floor-0-1..4.png` paths, and CONTEXT.md's D-11 states the *file-reference swap* to `Floor0SC1-4.png` is Phase 2's CONT-01 responsibility. Converting Floor0SC1-4.png→.webp without also repointing the `<img>` tags leaves Success Criterion #2 unmet for Floor 0. Recommendation below.

**Primary recommendation:** Install ffmpeg via `winget install Gyan.FFmpeg` (restart the terminal after, verify with `ffmpeg -version` before proceeding — do not assume PATH is live), add `sharp@^0.34.0` as a devDependency (not `latest`, which needs Node ≥20.9), write a small reusable `scripts/convert-media.js` (not one-off inline commands — repetition across ~4 videos + ~16 screenshots + 4 posters justifies it), and build one reusable `LazyVideoThumbnail.vue` component using IntersectionObserver + `preload="none"` + programmatic `.play()`/`.pause()` for all four project thumbnails (replacing both the current `<img>` icon pattern and the drag-rush/dispater iframe special case).

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| GIF→MP4 / PNG→WebP conversion | Build-time / dev tooling (Node script, not shipped) | — | Runs once on the dev machine via `node scripts/convert-media.js`; output files are static assets checked into `public/`. Never runs in the browser or at `npm run build` time. |
| Video thumbnail autoplay-in-viewport | Browser / Client | — | IntersectionObserver and `<video>` playback are pure client-side DOM/JS APIs; no server or build-time involvement. |
| Lazy image loading (`loading="lazy"`) | Browser / Client | — | Native browser attribute; engine (Chromium/Firefox/Safari) decides fetch timing based on scroll position. |
| Static asset serving | CDN / Static | — | `public/` files are served as-is by whatever static host is used (GitHub Pages/Netlify/Vercel per CLAUDE.md); no image-optimization CDN in this stack. |
| `htmlDescription` `v-html` rendering | Browser / Client | — | Pre-existing pattern; this phase only edits the string content and adds attributes, doesn't change the rendering mechanism. |

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| sharp | `^0.34.0` (verified latest patch `0.34.5`, published on npm) | PNG→WebP re-encoding at ~80-85% quality | De-facto standard Node.js image processing library — libvips-based, no ImageMagick/cwebp binary needed, pure npm install [VERIFIED: npm registry] |
| ffmpeg (Gyan.FFmpeg via winget) | `8.1.2` (winget package version, current at research time) | GIF→MP4 (H.264) conversion, poster-frame extraction | Standard, most-commonly-recommended full-build Windows ffmpeg winget package (`Gyan.FFmpeg`); bundles `ffmpeg`/`ffprobe`/`ffplay` [VERIFIED: winget search] |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Node.js `child_process` (built-in) | N/A (Node 18.20.4 already installed) | Shelling out to `ffmpeg` from a conversion script | Use `execFile`/`spawn` with an argument array, never `exec` with a concatenated string — avoids shell-injection risk even though inputs are currently fixed/trusted filenames [ASSUMED — general Node.js best practice, not phase-specific] |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| sharp for WebP | `cwebp` CLI (libwebp) | Would require a separate binary install (not currently present); CONTEXT.md D-01 already locked sharp specifically for "pure npm, no system binary needed" — not re-litigated here |
| ffmpeg via winget | Manual download from gyan.dev + manual PATH edit | More reliable PATH setup (per known winget bug below) but manual, not scriptable/reproducible; winget remains the plan default with a documented fallback |

**Installation:**
```bash
# Node dependency (run from project root)
npm install --save-dev sharp@^0.34.0

# System tool (run once, then RESTART the terminal before using ffmpeg)
winget install Gyan.FFmpeg
```

**Version verification performed this session:**
- `npm view sharp version` → `0.35.3` (latest tag), but `npm view sharp@0.35.3 engines` → `{ node: '>=20.9.0' }` — **incompatible** with this machine's Node `v18.20.4` (confirmed via `node -v`).
- `npm view sharp@0.34.5 engines` → `{ node: '^18.17.0 || ^20.3.0 || >=21.0.0' }` — **compatible**. Recommend pinning `sharp@^0.34.0`, not `latest`.
- `winget search ffmpeg` → confirmed `Gyan.FFmpeg` (v8.1.2) exists in the winget default source, alongside several `BtbN.FFmpeg.*` GPL/LGPL static/shared variants. `Gyan.FFmpeg` is the conventional single-package recommendation for a full build (ffmpeg + ffprobe + ffplay) and is what most Windows guides point to.

## Package Legitimacy Audit

| Package | Registry | Age | Downloads | Source Repo | Verdict | Disposition |
|---------|----------|-----|-----------|-------------|---------|-------------|
| sharp | npm | ~12 years (first published 2013-08-20) | 74M/week | github.com/lovell/sharp (32.5k stars, not archived) | OK | Approved — pin `^0.34.0`, not `latest` (Node engine mismatch, see above) |

**Packages removed due to [SLOP] verdict:** none
**Packages flagged as suspicious [SUS]:** none

`ffmpeg` is not an npm package (installed as a Windows system binary via winget) — the npm package-legitimacy gate doesn't apply. Verified directly via `winget search ffmpeg`: `Gyan.FFmpeg` is a real, actively-maintained winget package (current version 8.1.2 at research time) [VERIFIED: winget search].

sharp's `install` script (`node install/check.js || npm run build`) only downloads prebuilt libvips binaries matching the current platform/arch from sharp's own release infrastructure, or builds from source if no prebuilt is available — this is sharp's well-known, expected install behavior, not a suspicious postinstall pattern [CITED: npm view sharp scripts].

## Architecture Patterns

### System Architecture Diagram

```
Dev machine (one-time, this phase only)
  Source GIF/PNG in public/img/projects/<project>/
        │
        ▼
  scripts/convert-media.js
   ├─ ffmpeg (child_process.execFile) ──► <name>.mp4 (H.264, muted, no audio track)
   │                                  └─► <name>-poster.jpg (first frame, extracted from source GIF)
   └─ sharp (webp({quality:82}))       ──► <name>.webp (screenshots + poster, compressed)
        │
        ▼
  Committed into public/img/projects/<project>/  (source .gif/.png files kept, unreferenced — D-03)
        │
        ▼
Browser (runtime, every page load)
  GameProjects.vue timeline
   ├─ project-row (v-for, 4 projects)
   │     └─ LazyVideoThumbnail.vue (new, reusable)
   │           ├─ IntersectionObserver watches wrapper div
   │           ├─ on first intersect → mount <video preload="none" poster=".../poster.webp" muted loop playsinline>
   │           │                        → call videoEl.play() (catch promise rejection)
   │           └─ on leave viewport (optional) → videoEl.pause()
   │     └─ click → showDetails(project) → opens ProjectDetailsOverlay (same for all 4 — D-08 removes special case)
   │
   └─ ProjectDetailsOverlay.vue (v-html htmlContent)
         └─ img tags with loading="lazy" written BEFORE src in the raw HTML string (GameProjectsData.ts)
         └─ YouTube trailer <iframe loading="lazy"> (Drag Rush existing + Dispater newly added per D-09)
```

### Recommended Project Structure
```
scripts/
└── convert-media.js       # one-time conversion driver: shells out to ffmpeg + calls sharp
src/
├── components/
│   ├── LazyVideoThumbnail.vue   # NEW — reusable viewport-gated video thumbnail
│   ├── GameProjects.vue          # MODIFIED — uses LazyVideoThumbnail for all 4 projects, iframe branch removed
│   └── ProjectDetailsOverlay.vue # MODIFIED — no structural change, only htmlContent strings change upstream
└── data/
    └── GameProjectsData.ts       # MODIFIED — iconUrl → video path convention, loading="lazy" added to all <img> in htmlDescription
public/img/projects/<project>/
├── <Name>Gif.gif           # kept, source master (D-03)
├── <Name>.mp4              # NEW — converted output
├── <Name>-poster.webp      # NEW — poster frame, compressed
├── <Name>SC*.png           # kept, source master (D-03)
└── <Name>SC*.webp          # NEW — converted output
```

### Pattern 1: Viewport-gated video autoplay (Vue 2 Options API)
**What:** A reusable component that watches its own root element with IntersectionObserver, mounts the `<video>` element (or toggles playback) only once the thumbnail scrolls into view, shows a poster image until then, and cleans up the observer on destroy.
**When to use:** All 4 project timeline thumbnails in `GameProjects.vue`.
**Example:**
```vue
<!-- src/components/LazyVideoThumbnail.vue -->
<template>
  <div ref="wrap" class="lazy-video-thumb">
    <video
      v-if="hasIntersected"
      ref="video"
      :poster="poster"
      preload="none"
      muted
      loop
      playsinline
      @loadeddata="onLoaded"
    >
      <source :src="src" type="video/mp4" />
    </video>
    <img
      v-else
      :src="poster"
      loading="lazy"
      class="lazy-video-thumb-poster"
      alt=""
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "LazyVideoThumbnail",
  props: {
    src: { type: String, required: true },
    poster: { type: String, required: true },
  },
  data: function () {
    return {
      hasIntersected: false,
      observer: null as IntersectionObserver | null,
    };
  },
  mounted: function () {
    // Fallback for environments without IntersectionObserver: show video immediately.
    if (typeof IntersectionObserver === "undefined") {
      this.hasIntersected = true;
      return;
    }
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.hasIntersected = true;
            this.$nextTick(() => {
              const video = this.$refs.video as HTMLVideoElement | undefined;
              // play() returns a Promise that can reject (autoplay policy); ignore rejection.
              video?.play().catch(() => {});
            });
          } else if (this.$refs.video) {
            (this.$refs.video as HTMLVideoElement).pause();
          }
        });
      },
      { rootMargin: "200px 0px" }
    );
    this.observer.observe(this.$refs.wrap as Element);
  },
  beforeDestroy: function () {
    this.observer?.disconnect();
  },
  methods: {
    onLoaded: function () {
      // hook available if a loading-spinner state is added later; no-op for now
    },
  },
});
</script>
```
*Rationale for `rootMargin: "200px 0px"`: starts loading/playing slightly before the thumbnail is fully on-screen, avoiding a visible pop-in delay while still deferring network cost until near-viewport.* [ASSUMED — reasonable default, not verified against a specific UX benchmark]

### Pattern 2: `loading="lazy"` attribute ordering in hand-authored HTML strings
**What:** Write `loading="lazy"` **before** the `src` attribute in every `<img>` tag inside `GameProjectsData.ts`'s `htmlDescription` strings.
**When to use:** Every screenshot `<img>` tag (16 across all 4 projects) and any new poster `<img>` markup.
**Example:**
```html
<!-- Correct — loading before src -->
<img class="pc-screenshot" loading="lazy" src="img/projects/drag-rush/DragrushSC1.webp" alt="Drag Rush Screenshot" />

<!-- Risky — src before loading has a documented cross-browser quirk -->
<img class="pc-screenshot" src="img/projects/drag-rush/DragrushSC1.webp" loading="lazy" alt="Drag Rush Screenshot" />
```
**Why:** A Firefox bug (Bugzilla #1647077, duplicate of #1076583) documents that when `src` is set/parsed before `loading`, the image can begin loading synchronously before the `loading="lazy"` value is applied, defeating lazy-loading. Putting `loading` first in the tag's attribute list is the documented, zero-cost mitigation and works identically whether the tag is parsed as part of the initial document or via `innerHTML`/`v-html` (both use the same HTML fragment-parsing algorithm, so attributes on a given tag are all known before the element is instantiated — this differs from imperative `document.createElement + el.src = ...` construction, which is the scenario most auto-lazy-loading tooling warns about). [CITED: bugzilla.mozilla.org/show_bug.cgi?id=1647077]

### Anti-Patterns to Avoid
- **Baking loop repetition into the encoded video file** (e.g. `-stream_loop N` at encode time): inflates file size N-fold for no benefit — looping should be done with the native HTML5 `<video loop>` attribute at zero file-size cost, not baked into the media.
- **Setting `.src` imperatively before `loading="lazy"` on a `document.createElement('img')`-built element:** this is the specific pattern the Firefox bug targets; not used in this codebase's `v-html` approach, but would be a regression risk if a future refactor moves to imperative DOM construction.
- **Using `latest` for sharp in `package.json`:** silently installs 0.35.x which hard-requires Node ≥20.9 and will fail to install/run on this machine's Node 18.20.4.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| WebP encoding | A custom PNG-to-WebP pixel loop or shelling out to a hand-downloaded `cwebp.exe` | `sharp().webp({quality, effort})` | sharp bundles libvips + libwebp prebuilt binaries per-platform via npm install — no manual binary management, and D-01 already locked this choice |
| Cross-browser lazy-loading fallback/polyfill | A custom scroll-listener-based lazy-load library | Native `loading="lazy"` (Chrome/Edge/Firefox/Safari 16.4+ all support it) with IntersectionObserver only for the video-autoplay case (which native lazy-loading doesn't cover) | The site already has no other lazy-load tooling; native attribute is zero-JS and sufficient for the image half of MEDIA-03 |
| Viewport detection for video autoplay | Manual `scroll` event + `getBoundingClientRect()` polling | `IntersectionObserver` | Native, batched, doesn't run on every scroll tick — standard modern pattern, well-supported in target browsers |

**Key insight:** Every capability this phase needs (WebP encoding, lazy image loading, viewport-based autoplay) has a native or near-native, zero-extra-runtime-dependency solution. The only new runtime cost is the ~single-digit-KB IntersectionObserver logic in `LazyVideoThumbnail.vue`; sharp and ffmpeg are dev-time-only and never ship to the browser.

## Common Pitfalls

### Pitfall 1: sharp `latest` fails on this machine's Node version
**What goes wrong:** `npm install --save-dev sharp` (no version pin) installs `0.35.3`, whose `engines.node` is `>=20.9.0`. This machine runs Node `18.20.4`.
**Why it happens:** sharp 0.35 dropped Node 18 support entirely (its 0.33.x/0.34.x lines supported `^18.17.0`).
**How to avoid:** Explicitly install `sharp@^0.34.0` (or pin exact `0.34.5`).
**Warning signs:** `npm install` prints an `EBADENGINE` warning, or `require('sharp')` throws at runtime inside the conversion script.

### Pitfall 2: winget ffmpeg PATH not live immediately after install
**What goes wrong:** Running `ffmpeg -version` in the same terminal session right after `winget install Gyan.FFmpeg` returns "not recognized," even though the install succeeded.
**Why it happens:** A documented winget/Gyan.FFmpeg packaging issue sometimes registers the package's root directory in PATH instead of its `bin` subdirectory, and even when correct, the current shell process doesn't pick up updated `PATH` until restarted.
**How to avoid:** After install, close and reopen the terminal (PowerShell) before invoking `ffmpeg`. If it's still not recognized, check `where ffmpeg` — if PATH points to a folder without `ffmpeg.exe` directly inside it, the fallback is manually downloading a full build from gyan.dev and adding its `bin` folder to PATH by hand.
**Warning signs:** `ffmpeg` "not recognized as an internal or external command" persists after a fresh terminal restart.

### Pitfall 3: `loading="lazy"` attribute order in `v-html` strings
**What goes wrong:** Screenshots inside `ProjectDetailsOverlay` still load eagerly despite adding `loading="lazy"`.
**Why it happens:** Attribute order sensitivity documented in Firefox (see Pattern 2 above); some tooling/linters may reformat/reorder attributes.
**How to avoid:** Always write `loading="lazy"` immediately after the tag name, before `src`, in the raw HTML template strings in `GameProjectsData.ts`.
**Warning signs:** Network tab shows all overlay screenshots requested immediately on overlay open, regardless of scroll position within the dialog.

### Pitfall 4: Floor 0's WebP screenshots convert but don't get referenced (Success Criterion #2 gap)
**What goes wrong:** Phase 1 converts `Floor0SC1-4.png` → `.webp` (satisfying the letter of MEDIA-02's "compress all 4 projects' screenshots"), but `GameProjectsData.ts`'s Floor 0 `htmlDescription` still references the broken, non-existent `floor-0-1..4.png` paths — because CONTEXT.md's D-11 explicitly assigns the *reference swap* (CONT-01) to Phase 2.
**Why it happens:** Two different requirements (MEDIA-02 "compress" vs. CONT-01 "swap to correct files") both touch the same 4 Floor 0 image tags, and CONTEXT.md split them across phases without accounting for the fact that Floor 0's current references are already broken (there is no valid pre-existing PNG reference to simply "compress in place").
**How to avoid:** The planner should treat this the same way D-11 already treated the Floor 0 thumbnail/CONT-07 overlap: convert `Floor0SC1-4.png` → `.webp` **and** update the 4 `<img>` tags in Floor 0's `htmlDescription` to point at the new `.webp` files, as part of Phase 1 — this is required for Success Criterion #2 to be literally true ("Project screenshots across all 4 projects ... load as compressed WebP images in the overlay"). This will fully satisfy CONT-01 early, exactly as D-11 did for CONT-07; flag this for the same roadmap/requirements traceability update at Phase 1 completion.
**Warning signs:** UAT/verification for Success Criterion #2 fails for Floor 0 specifically (broken image icons in the overlay) while the other 3 projects pass.

### Pitfall 5: Ambiguous SwingSpace source GIF for the timeline thumbnail
**What goes wrong:** `public/img/projects/swing-space/` contains three GIFs — `SwingSpaceGIF.gif` (18.5MB, currently referenced as `iconUrl`), `SwingSpaceGIF2.gif` (16KB — too small/likely a placeholder or unrelated asset), and `SwingSpaceGIF3.gif` (18.0MB, unreferenced anywhere in code). CONTEXT.md's D-10 explicitly locks the source GIF for Drag Rush and Dispater, but says nothing about which SwingSpace GIF to convert.
**Why it happens:** The per-project source-GIF decision (D-10) covers Drag Rush/Dispater only; SwingSpace and Floor 0's sources were either already obvious from existing code (SwingSpace's current `iconUrl`) or covered by a separate decision (Floor 0's D-11).
**How to avoid:** Default to `SwingSpaceGIF.gif` (the file already referenced as `iconUrl` today — path of least surprise, no behavior change in which asset is "the thumbnail," only its encoding). Flag this default explicitly to the user/planner in case `SwingSpaceGIF3.gif` was actually intended as a newer replacement.
**Warning signs:** None automatic — this is a silent content-correctness risk, not a technical failure. Worth one clarifying line in the plan or a `checkpoint:human-verify` before finalizing.

## Code Examples

### ffmpeg: GIF → MP4 (H.264, muted, web-optimized)
```bash
# Source: gvoze32/95f96992a443e73c4794c342a44e0811 gist pattern + Cloudinary/ffmpeg.media guides,
# cross-checked with libx264 CRF guidance (slhck.info CRF guide, ffmpeg-micro.com)
ffmpeg -i public/img/projects/drag-rush/DragRushGif.gif \
  -movflags +faststart \
  -pix_fmt yuv420p \
  -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" \
  -c:v libx264 -crf 28 -preset veryslow \
  -an \
  public/img/projects/drag-rush/DragRushGif.mp4
```
- `-movflags +faststart` — moves the MP4 metadata (moov atom) to the front so the browser can start playback before the full file downloads. [CITED: general ffmpeg web-encoding guidance]
- `-pix_fmt yuv420p` — required for maximum browser/decoder compatibility (some GIF-sourced streams default to formats not universally supported). [CITED]
- `scale=trunc(iw/2)*2:trunc(ih/2)*2` — guarantees even width/height, a hard H.264 requirement; GIF dimensions are not always even. [CITED]
- `-crf 28` — a reasonable "smaller file over pixel-perfect" starting point for looping background-style thumbnails (CRF 23 is the libx264 default/general-purpose value; +5 roughly halves size again per every +6). Tune per-file after visual inspection — CONTEXT.md leaves exact CRF/bitrate to Claude's discretion within the D-02 (MP4-only) constraint. [CITED: slhck.info CRF guide, ffmpeg-micro.com]
- `-an` — explicitly strips any audio stream (GIFs have none, but explicit is safer/clearer than relying on absence).
- `-preset veryslow` — since this is a one-time offline batch job (not real-time), trade encode time for smaller output at the same CRF; fine for ~4 short clips.

### ffmpeg: poster frame extraction
```bash
# Extract the first frame directly from the source GIF (before/independent of MP4 encoding)
ffmpeg -i public/img/projects/drag-rush/DragRushGif.gif -vframes 1 public/img/projects/drag-rush/DragRushGif-poster.png
```
Then run the resulting PNG through the same sharp WebP pipeline as screenshots (see below) for a `-poster.webp`, keeping the poster on the same compressed-format story as MEDIA-02.

### sharp: PNG → WebP screenshot compression
```js
// scripts/convert-media.js (excerpt)
// Source: sharp official docs (sharp.pixelplumbing.com) — quality/effort options
const sharp = require("sharp");

async function toWebp(inputPath, outputPath) {
  await sharp(inputPath)
    .webp({ quality: 82, effort: 4 })
    .toFile(outputPath);
}

// Example call for one screenshot:
toWebp(
  "public/img/projects/drag-rush/DragrushSC1.png",
  "public/img/projects/drag-rush/DragrushSC1.webp"
);
```
- `quality: 82` — sits inside CONTEXT.md's D-12 target range (~80-85%), biased toward "still looks crisp" per the locked decision.
- `effort: 4` — sharp's default-ish middle ground (range 0-6); higher effort yields marginally smaller files at meaningfully higher encode time — not worth pushing to 6 for a one-time batch of ~16 screenshots. [CITED: sharp.pixelplumbing.com]
- No `resize()` call by design-default (D-12 is a quality/compression decision, not a resize decision) — but see Open Questions below for a resize recommendation worth surfacing to the planner, since screenshots display at a CSS-capped 400px desktop width (`src/css/projects.less` `.pc-screenshot { width: 400px }` in the ≥620px media query) while several source PNGs are 1700KB-2.3MB, suggesting they're much larger than 400px in native resolution.

### Node: safe ffmpeg invocation from the conversion script (avoids shell injection)
```js
// scripts/convert-media.js (excerpt)
const { execFile } = require("child_process");
const { promisify } = require("util");
const execFileAsync = promisify(execFile);

async function gifToMp4(inputGif, outputMp4) {
  await execFileAsync("ffmpeg", [
    "-i", inputGif,
    "-movflags", "+faststart",
    "-pix_fmt", "yuv420p",
    "-vf", "scale=trunc(iw/2)*2:trunc(ih/2)*2",
    "-c:v", "libx264", "-crf", "28", "-preset", "veryslow",
    "-an",
    outputMp4,
  ]);
}
```
Uses `execFile` with an argument array (not `exec` with a concatenated string) — avoids shell interpretation of filenames entirely. Low-risk here since all filenames are fixed/known, but zero-cost to do correctly. [ASSUMED — general Node.js security best practice, not phase-specific research]

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|---------------|--------|
| Animated GIF as always-loaded thumbnail | Muted/looping H.264 `<video>` with poster + lazy autoplay | Long-standard web-perf practice, not a recent shift | GIFs are typically 5-10x larger than an equivalent-quality H.264 clip for the same visual content |
| Always-loaded YouTube iframe in a timeline (current drag-rush/dispater special case) | Same video-thumbnail treatment as other projects; trailer lives inside the click-through overlay instead | This phase (D-08) | Removes an always-loaded third-party iframe (YouTube's own JS/analytics payload) from the initial page load entirely |

**Deprecated/outdated:**
- Baking `<img>` lazy-loading via scroll-listener libraries (e.g. lazysizes): superseded by the native `loading="lazy"` attribute for all target browsers this portfolio needs to support (recruiters on current Chrome/Edge/Firefox/Safari) — no polyfill library needed.

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | `rootMargin: "200px 0px"` is a reasonable IntersectionObserver default for the video thumbnails | Architecture Patterns / Pattern 1 | Low — cosmetic only; too small a margin causes a brief pop-in, too large starts fetching earlier than ideal. Easy to tune post-hoc. |
| A2 | `execFile`/`spawn` over `exec` is worth calling out even though inputs are currently fixed filenames | Code Examples | Very low — no functional risk today; only matters if the script is later extended to take user-supplied paths. |
| A3 | Screenshots should additionally be resized (not just re-encoded) given the ~400px CSS display cap vs. multi-MB source PNGs | Code Examples / Open Questions | Low-medium — if source PNGs are already close to display resolution, resizing recommendation could be a no-op; if sources are e.g. 4K screenshots, skipping resize leaves easy additional savings on the table. Verify actual source dimensions before committing to a resize step. |
| A4 | Default SwingSpace source GIF should be `SwingSpaceGIF.gif` (matching existing `iconUrl`) rather than `SwingSpaceGIF3.gif` | Common Pitfalls / Pitfall 5 | Medium — wrong pick means shipping an unintended/outdated clip as the permanent thumbnail; cheap to verify with the user before executing. |

**If empty:** N/A — see table above; all four items should be either verified or explicitly confirmed with the user before/during planning.

## Open Questions

1. **Should Phase 1 also update Floor 0's `htmlDescription` image references (not just convert the files)?**
   - What we know: MEDIA-02 + Success Criterion #2 require all 4 projects' overlay screenshots to be live WebP by end of Phase 1; Floor 0's current references are broken/non-existent; D-11 nominally assigns the reference-swap (CONT-01) to Phase 2.
   - What's unclear: Whether CONTEXT.md's author intended Floor 0 to be a partial exception to Success Criterion #2, or simply didn't notice the overlap when writing D-11.
   - Recommendation: Resolve this the same way D-11 resolved the CONT-07/thumbnail overlap — do the Floor 0 screenshot reference swap in Phase 1 too, and update the requirements traceability table to mark CONT-01 satisfied early. See Pitfall 4 above.

2. **Which SwingSpace GIF is the intended thumbnail source?**
   - What we know: `iconUrl` currently points to `SwingSpaceGIF.gif`; `SwingSpaceGIF3.gif` is same-size but unreferenced; `SwingSpaceGIF2.gif` is tiny (16KB) and likely unrelated.
   - What's unclear: Whether `SwingSpaceGIF3.gif` was dropped in as an intended replacement during the mid-session asset reorg (CONTEXT.md notes the user was "actively producing new GIFs mid-session").
   - Recommendation: Default to `SwingSpaceGIF.gif` per path-of-least-surprise; confirm with the user in the plan or via a lightweight checkpoint before finalizing.

3. **Should screenshots be resized in addition to re-encoded, given the CSS display cap of ~400px desktop?**
   - What we know: `.pc-screenshot` CSS caps display width at 400px (desktop); several source PNGs are 1.7-2.3MB, implying resolutions likely well above what's ever displayed.
   - What's unclear: Actual pixel dimensions of the source PNGs (not measured this session — would need an image-metadata check, e.g. `sharp(path).metadata()`, during plan execution).
   - Recommendation: During execution, check source dimensions with `sharp().metadata()` before converting; if width is significantly above ~1000-1200px (accounting for retina 2x of the 400-500px display size), resize during the same sharp pipeline call for additional, "free" savings beyond the quality-82 setting. This doesn't contradict D-12 (a quality-parameter decision) — it's a complementary optimization within Claude's Discretion (CONTEXT.md explicitly leaves "resolution" open under discretion, alongside bitrate).

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| ffmpeg | GIF→MP4 conversion, poster extraction | ✗ (confirmed absent via `where ffmpeg`) | — | Install via `winget install Gyan.FFmpeg`; if winget PATH registration fails, manual download from gyan.dev + manual PATH edit |
| cwebp / ImageMagick | Not needed — sharp replaces this need entirely | ✗ (confirmed absent) | — | N/A — sharp (npm) is the locked replacement (D-01), no system binary required |
| sharp (npm) | PNG→WebP conversion | ✗ (not in package.json yet) | Install `^0.34.0` | N/A — must be installed; no viable fallback within D-01's constraints |
| winget | Installing ffmpeg | ✓ (confirmed via `winget --version`) | 1.29.280 | N/A |
| Node.js | Running the conversion script, sharp | ✓ (confirmed via `node -v`) | 18.20.4 | Must pin sharp to a version supporting Node 18 (see Pitfall 1) |

**Missing dependencies with no fallback:**
- ffmpeg and sharp both must be installed before execution can proceed — no working fallback exists within the CONTEXT.md-locked tooling choice (D-01). The plan must include explicit install steps as its first tasks, with a verification step (`ffmpeg -version`, `node -e "console.log(require('sharp').format)"`) before any conversion work begins.

**Missing dependencies with fallback:**
- None beyond the ffmpeg manual-install fallback noted above (still ffmpeg itself, just a different install path).

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-------------------|
| V2 Authentication | No | Static site, no auth |
| V3 Session Management | No | Static site, no sessions |
| V4 Access Control | No | Static site, no access control boundaries |
| V5 Input Validation | Marginal — pre-existing `v-html` usage, not introduced by this phase | `htmlDescription` strings are developer-authored constants in `GameProjectsData.ts`, never derived from user input or an external API response — no new XSS surface is introduced by this phase's edits (only new `<img>`/`<video>`/`<iframe>` markup within already-trusted strings) |
| V6 Cryptography | No | No cryptographic operations in this phase |

### Known Threat Patterns for this stack

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|----------------------|
| Command injection via the new `scripts/convert-media.js` shelling out to `ffmpeg` | Tampering | Use `child_process.execFile`/`spawn` with an argument array, not `exec` with string concatenation — even though all inputs are currently fixed, known filenames (no user input reaches this script), this is a zero-cost hygiene practice for a script that touches the shell (see Code Examples above) |
| Committing overly large media into git history | (not STRIDE, but a real project-health risk) | D-03 already addresses the "keep source masters" side; the plan should ensure only the *converted, compressed* outputs are the ones referenced/loaded by the app — the large originals remain in the repo but are excluded from any preload/eager-fetch path |

This phase introduces no server, no auth, no data storage, and no new user-input handling — its security surface is limited to the dev-time conversion script's shell invocation hygiene, noted above.

## Sources

### Primary (HIGH confidence)
- `npm view sharp`, `npm view sharp@0.34.5 engines`, `npm view sharp@0.35.3 engines` — direct registry queries, this session
- `winget search ffmpeg`, `winget --version` — direct CLI queries, this session
- `where ffmpeg`, `where cwebp`, `where magick`, `node -v` — direct environment probes, this session confirming absence/versions
- `curl https://api.github.com/repos/lovell/sharp` — repo star count / archived status, this session
- `curl https://api.npmjs.org/downloads/point/last-week/sharp` — download count, this session

### Secondary (MEDIUM confidence)
- sharp.pixelplumbing.com (official docs, via WebSearch) — `.webp({quality, effort})` API
- bugzilla.mozilla.org/show_bug.cgi?id=1647077 — `loading="lazy"` attribute-order bug (via WebFetch)
- GitHub issue microsoft/winget-pkgs#95349, GyanD/codexffmpeg#95 — winget ffmpeg PATH bug (via WebSearch)
- slhck.info CRF guide, ffmpeg-micro.com — libx264 CRF value guidance (via WebSearch)

### Tertiary (LOW confidence)
- General ffmpeg GIF→MP4 command-pattern blog posts (Cloudinary, RenderIO, gvoze32 gist) — cross-checked against each other and against known ffmpeg flag semantics, but not an official ffmpeg doc page specifically for this exact use case
- IntersectionObserver Vue 2 pattern — synthesized from vue-visual library description and general web.dev/Cloudinary autoplay-on-scroll articles, not copied from an official Vue docs example (Vue 2 core docs don't cover this pattern)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — sharp/ffmpeg versions and compatibility directly verified via `npm view`/`winget search`/`node -v` this session, not assumed from training data
- Architecture: HIGH — Vue 2 Options API patterns (IntersectionObserver in `mounted()`/`beforeDestroy()`) are standard, well-established framework usage; no exotic APIs involved
- Pitfalls: HIGH for sharp/ffmpeg version and PATH issues (directly verified/cited); MEDIUM for the `loading="lazy"` attribute-order pitfall (cited from a real bug report, cross-browser nuance not exhaustively tested this session); MEDIUM for the phase-boundary/Floor-0 and SwingSpace-source-GIF findings (these are reasoning/analysis conclusions from reading CONTEXT.md + the actual file tree, not externally verifiable facts)

**Research date:** 2026-07-21
**Valid until:** 2026-08-20 (30 days — package versions/winget package IDs can shift; re-verify `npm view sharp version` and `winget search ffmpeg` if planning is delayed significantly past this window)
