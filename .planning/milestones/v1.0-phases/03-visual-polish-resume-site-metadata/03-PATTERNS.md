# Phase 3: Visual Polish, Resume & Site Metadata - Pattern Map

**Mapped:** 2026-07-22
**Files analyzed:** 5
**Analogs found:** 5 / 5 (all files are edited-in-place; each file's existing code is its own pattern to extend, not a foreign analog)

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `src/views/GameProjects.vue` | component (view) | transform (static data → template) | itself (existing template/style block) | exact — edit in place |
| `src/views/Resume.vue` | component (view) | request-response (static render) | itself | exact — verify only, no code change expected |
| `public/index.html` | config | request-response (static head metadata) | itself | exact — edit in place |
| `src/data/GameProjectsData.ts` / `GameProjects.vue`'s `thumbVideos`/`thumbPosters` maps | model/config | CRUD (id-keyed map value swap) | `GameProjects.vue` `data()` maps (lines 84-95) | exact — same file, same pattern |
| new MP4 for `DispaterGif.gif` (if D-04 swap needs it) | file-I/O (build-time asset conversion) | batch | `scripts/convert-media.js` `videoAssets` manifest (lines 89-94) + `convertVideos()` (lines 96-104) | exact — established Phase 1 pipeline |

No new files/components are created this phase — all work is targeted edits to 3 existing files plus one possible asset-pipeline invocation.

---

## Pattern Assignments

### `src/views/GameProjects.vue` (component, transform) — POLISH-01, D-03

**This file IS its own analog.** Apply UI-SPEC.md's token changes directly to the existing `<style scoped>` block (lines 120-264). No external pattern needed — these are value edits, not structural ones.

**Current style block to edit** (`src/views/GameProjects.vue:155-263`):
```css
.project-timeline {
  display: grid;
  gap: 40px;               /* → 48px (2xl) per UI-SPEC spacing scale */
}

.project-row {
  display: flex;
  flex-direction: column;
  gap: 24px;                /* already on-scale (lg), unchanged mobile */
  align-items: stretch;
  padding: 28px 0;          /* → 32px (xl) mobile per UI-SPEC */
  border-top: 1px solid rgba(255, 255, 255, 0.14);
}

.project-title-link {
  margin: 0;
  padding: 0;
  border: 0;
  background: transparent;
  color: inherit;
  font-size: 2.35em;        /* → 2.1em per UI-SPEC */
  font-weight: 100;
  cursor: pointer;
  text-align: left;
  line-height: 1.05;        /* → 1.1 per UI-SPEC */
  transition: color 0.18s ease, opacity 0.18s ease;
}

.project-title-link:hover {
  color: #f4cde6;
  opacity: 1;
}

.project-summary {
  margin: 14px 0 0;         /* → 16px (md) top margin per UI-SPEC */
  max-width: 760px;
  font-size: 1.08em;
  line-height: 1.95em;      /* → 1.7 per UI-SPEC */
}

@media only screen and (min-width: 620px) {
  .project-row {
    flex-direction: row;
    align-items: center;
    gap: 48px;               /* already 2xl, unchanged */
    padding: 40px 0;         /* → 48px (2xl) per UI-SPEC */
  }
  /* ... */
}
```

**D-03 click affordance** — extend `.project-title-link` and its `:hover` rule (do not replace):
```css
.project-title-link {
  /* ...existing properties... */
  border-bottom: 1px solid rgba(255, 255, 255, 0.35); /* persistent affordance */
}

.project-title-link:hover,
.project-title-link:focus-visible {
  color: #f4cde6;
  border-bottom-color: #f4cde6; /* reuses existing accent, no new token */
  opacity: 1;
}
```
Per UI-SPEC D-03 resolution: reuse existing `#f4cde6` accent and the existing `transition: color 0.18s ease, opacity 0.18s ease` — just add `border-bottom-color` to that same transition list so the underline color animates too:
```css
transition: color 0.18s ease, opacity 0.18s ease, border-bottom-color 0.18s ease;
```

**D-04 Dispater asset swap** — `data()` id-keyed maps (`src/views/GameProjects.vue:84-95`):
```js
thumbVideos: {
  "drag-rush": "img/projects/drag-rush/DragRushGif.mp4",
  dispater: "img/projects/dispater/DispaterGif2.mp4",   // → swap to DispaterGif.mp4 (needs new conversion, see below)
  "floor-0": "img/projects/floor-0/Floor0gif1.mp4",
  "swing-space": "img/projects/swing-space/SwingSpaceGIF3.mp4",
},
thumbPosters: {
  "drag-rush": "img/projects/drag-rush/DragRushGif-poster.webp",
  dispater: "img/projects/dispater/DispaterGif2-poster.webp", // → swap to DispaterGif-poster.webp
  "floor-0": "img/projects/floor-0/Floor0gif1-poster.webp",
  "swing-space": "img/projects/swing-space/SwingSpaceGIF3-poster.webp",
},
```
This is a value swap only — the map keys/shape/template usage (`GameProjects.vue:37`, `<LazyVideoThumbnail :src="thumbVideos[project.id]" :poster="thumbPosters[project.id]" />`) do not change.

Note: `src/data/GameProjectsData.ts`'s Dispater `htmlDescription` (overlay content) currently has no embedded gif/video at all — only static screenshots (`DispaterSC1.webp`...`DispaterSC5.webp`, lines `src/data/GameProjectsData.ts:50-55`). If D-04 requires `DispaterGif2.gif`'s content to appear in the overlay, follow SwingSpace's overlay video embed pattern (`src/data/GameProjectsData.ts:95-100`):
```html
<div class="paragraph center">
    <video class="pc-video swing-space-video" controls preload="metadata">
        <source src="img/projects/swing-space/SwingSpaceVid.mp4" type="video/mp4" />
        Your browser does not support the video tag.
    </video>
</div>
```
(swap class name and src to a Dispater-specific equivalent; check `src/css/projects.less` for `.swing-space-video` styling to mirror or generalize).

---

### Asset conversion (if D-04 needs a fresh `DispaterGif.gif` → mp4/poster)

**Analog:** `scripts/convert-media.js` `videoAssets` manifest (lines 89-94) + `convertVideos()` (lines 96-104)

```js
const videoAssets = [
    ["drag-rush", "DragRushGif"],
    ["dispater", "DispaterGif2"],   // existing entry
    ["floor-0", "Floor0gif1", { durationSeconds: 12.5 }],
    ["swing-space", "SwingSpaceGIF3"],
];
```

To convert `DispaterGif.gif` (the timeline-bound gif per D-04), add a second Dispater entry:
```js
["dispater", "DispaterGif"],
```
Then run `node scripts/convert-media.js` (requires ffmpeg/sharp on PATH — dev-machine only, not part of the Vue build). This produces `DispaterGif.mp4` and `DispaterGif-poster.webp` in `public/img/projects/dispater/`, following the exact same `gifToMp4`/`extractPoster` calls already used for all other timeline assets. No new function needed — this is purely a manifest-entry addition.

---

### `src/views/Resume.vue` (component, request-response) — RESUME-01

**No pattern extraction needed.** Per D-06, this file is already fully implemented and matches spec exactly:
```html
<template>
  <div class="resume-page">
    <img class="resume-image" src="img/actualResume.png" alt="Josef Ubaka resume" />
  </div>
</template>
```
```css
.resume-page {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
}
.resume-image {
  width: 100%;
  height: auto;
  display: block;
  max-width: 1100px;
}
@media only screen and (min-width: 620px) {
  .resume-image {
    max-width: 1200px;
  }
}
```
UI-SPEC.md confirms: "no spacing changes in scope." Planner should mark RESUME-01 satisfied via verification, not re-implementation.

---

### `public/index.html` (config, request-response) — META-01

**This file IS its own analog.** Current hardcoded `<head>` block to edit (`public/index.html:14-19`):
```html
<title>Portfolio</title>
<meta name="description" content="Josef's game development portfolio." />
<meta property="og:title" content="Portfolio" />
<meta property="og:description" content="Josef's game development portfolio." />
<meta property="og:url" content="https://mywebsite.com" />
<meta property="og:image" content="https://mywebsite.com/img/avatar-og.png" />
```

Replace values per UI-SPEC.md's locked copywriting contract (do not touch tag structure, only content attribute values and `<title>` text):
```html
<title>Josef — Game Developer Portfolio</title>
<meta name="description" content="Game dev portfolio showcasing Drag Rush, Dispater, Floor Zero, and SwingSpace." />
<meta property="og:title" content="Josef — Game Developer Portfolio" />
<meta property="og:description" content="Game dev portfolio showcasing Drag Rush, Dispater, Floor Zero, and SwingSpace." />
<meta property="og:url" content="https://1juicef.github.io/gamedev-portfolio/" />
<meta property="og:image" content="https://1juicef.github.io/gamedev-portfolio/img/avatar.png" />
```
Note: `og:image` reuses the existing hero avatar asset at `public/img/avatar.png` (already referenced relatively in `GameProjects.vue:20`, `<img src="img/avatar.png" alt="Avatar of Josef" />`) — no new image asset needed, only the absolute URL form for the meta tag.

---

## Shared Patterns

### Static id-keyed data maps (source of truth for per-project asset wiring)
**Source:** `src/views/GameProjects.vue:78-95` (`projectRows`, `thumbVideos`, `thumbPosters`, `summaries`)
**Apply to:** D-04's Dispater swap — same pattern, value-only edit, no new keys/shape.

### Media conversion pipeline (dev-machine only, not part of app runtime)
**Source:** `scripts/convert-media.js` (`gifToMp4`, `extractPoster`, `toWebp` exports; `videoAssets`/`screenshotAssets` manifests)
**Apply to:** D-04 if a fresh MP4/poster is needed for `DispaterGif.gif`. Just add a manifest entry — do not write new conversion functions.

### `<em>`-based sizing convention
**Source:** UI-SPEC.md Typography section, confirmed against `GameProjects.vue`'s existing `font-size: 2.35em` / `1.08em` values.
**Apply to:** All typography edits in `GameProjects.vue` — keep `em` units, do not introduce `px`.

### 4px-multiple spacing scale
**Source:** UI-SPEC.md Spacing Scale table.
**Apply to:** All spacing edits in `GameProjects.vue`'s `.project-timeline`, `.project-row`, `.project-copy`/`.project-summary` gaps.

---

## No Analog Found

None — every file in scope is edited in place; the file itself is the pattern base. No cross-codebase search for a foreign analog was necessary since Phase 3 introduces zero new files/components.

## Metadata

**Analog search scope:** `src/views/`, `src/data/`, `src/components/`, `public/index.html`, `scripts/convert-media.js`
**Files scanned:** 5 (all read in full — none exceed 300 lines)
**Pattern extraction date:** 2026-07-22
</content>
