---
phase: 03-visual-polish-resume-site-metadata
reviewed: 2026-07-23T00:00:00Z
depth: standard
files_reviewed: 9
files_reviewed_list:
  - public/img/projects/dispater/DispaterGif-poster.webp
  - public/img/projects/dispater/DispaterGif.mp4
  - public/index.html
  - scripts/convert-media.js
  - src/App.vue
  - src/components/ProjectDetailsOverlay.vue
  - src/data/GameProjectsData.ts
  - src/views/GameProjects.vue
  - src/views/Resume.vue
findings:
  critical: 0
  warning: 3
  info: 3
  total: 6
status: issues_found
---

# Phase 3: Code Review Report

**Reviewed:** 2026-07-23T00:00:00Z
**Depth:** standard
**Files Reviewed:** 9
**Status:** issues_found

## Summary

Reviewed the full phase-3 diff against `792d2a0f`: the new dev-only `scripts/convert-media.js` media pipeline, locked OG/social metadata in `public/index.html`, the `Resume.vue` rewrite to a single static image, the `GameProjects.vue` timeline restraint pass + `LazyVideoThumbnail` integration, the new/expanded per-project HTML in `GameProjectsData.ts` (including the fully-new SwingSpace entry), and the two small `App.vue`/`ProjectDetailsOverlay.vue` gap-closure edits. Verified `npm run lint` and `npm run build` both succeed cleanly against the current working tree, and spot-checked every asset path referenced by the touched files (screenshots, thumbnail videos/posters, `actualResume.png`, `avatar.png`) actually exists on disk with matching case and non-zero size — no broken references or missing media found. `public/img/projects/dispater/DispaterGif-poster.webp` and `DispaterGif.mp4` are both present and non-zero-sized.

No critical/security issues found. Findings below are dead code left behind by this phase's own refactors (a dropped image-preload feature, now-unused `iconUrl` data, and a stale build-manifest entry for an asset this phase's own gap-closure plan (03-04) stopped using), one accessibility regression in the timeline's restructured thumbnail button, one missing-cleanup edge case in the new conversion script, and a few copy typos in the newly-added project descriptions.

## Warnings

### WR-01: Project timeline thumbnail button lost its accessible name

**File:** `src/views/GameProjects.vue:32-38`
**Issue:** Before this phase, the timeline's clickable project thumbnail was `<img :alt="project.name + ' image'" />` directly inside the `<button>`, so the button's accessible name (via the standard accname-from-content algorithm) was `"<name> image"`. Plan 03-01 replaced this with `<LazyVideoThumbnail :src="..." :poster="..." />`, which renders either a bare `<video>` (no text alternative) or `<img alt="" />` (deliberately empty/decorative). The wrapping `<button class="project-image-button">` now has no accessible name at all for screen-reader/assistive-tech users — tabbing to it announces only "button" with no indication of which project it opens.
**Fix:** Give the button an explicit label since the contained media can no longer supply one:
```html
<button
  class="project-image-button"
  :class="{ 'project-image--swing-space': project.id === 'swing-space' }"
  :aria-label="project.name + ' details'"
  @click="showDetails(project)"
>
  <LazyVideoThumbnail :src="thumbVideos[project.id]" :poster="thumbPosters[project.id]" />
</button>
```

### WR-02: `src/helpers.ts`'s image-preload feature was dropped entirely, not replaced

**File:** `src/App.vue:17-26` (orphans `src/helpers.ts`)
**Issue:** This phase removed `App.vue`'s only import/usage of `Helpers.preloadImages(...)` (previously preloading `project-1-icon.png`/`project-2-icon.png`/`project-3-icon.png`) with no replacement call for any of the new heavy media this same phase introduced (e.g. `DispaterGif.mp4`, `DispaterGif-poster.webp`, `actualResume.png`). `src/helpers.ts` is now dead code — nothing in `src/` calls `Helpers` or `preloadImages` anymore. `CLAUDE.md` still documents this as an active pattern ("`Helpers.preloadImages` is called in `App.vue` to eagerly preload specific heavy images/gifs... when adding large new media referenced by a data file, consider adding it to that preload list"), so the docs and code have now drifted apart.
**Fix:** Either delete `src/helpers.ts` (and update the `CLAUDE.md` line describing it) if eager preloading is no longer wanted, or reinstate a call with the current heavy-asset list (e.g. the thumbnail posters) if the preload behavior was still intended:
```ts
// src/App.vue
import Helpers from './helpers';
Helpers.preloadImages([
  "img/projects/drag-rush/DragRushGif-poster.webp",
  "img/projects/dispater/DispaterGif-poster.webp",
  "img/projects/floor-0/Floor0gif1-poster.webp",
  "img/projects/swing-space/SwingSpaceGIF3-poster.webp",
]);
```

### WR-03: `extractPoster()` leaks the temp PNG if `toWebp()` throws

**File:** `scripts/convert-media.js:56-68`
**Issue:** `extractPoster` creates `tempPng`, awaits `toWebp(tempPng, outputPosterWebp)`, and only then calls `fs.unlinkSync(tempPng)`. If `toWebp` throws (e.g. `sharp` fails on a malformed frame, or the output path isn't writable), the function throws before reaching the `unlinkSync` line, leaving a stray `*.tmp.png` file next to the source GIF. Since `main()` catches at the top level and simply `process.exit(1)`s, nothing ever cleans up the leftover temp file, and a re-run of the script would silently coexist with (not overwrite) the stale `.tmp.png` — a papercut for whoever re-runs the dev-only pipeline after a failure.
**Fix:** Wrap the cleanup in `try/finally`:
```js
async function extractPoster(inputGif, outputPosterWebp) {
    assertSourceExists(inputGif);
    const tempPng = outputPosterWebp.replace(/\.webp$/, ".tmp.png");
    try {
        await execFileAsync("ffmpeg", ["-y", "-i", inputGif, "-vframes", "1", tempPng]);
        await toWebp(tempPng, outputPosterWebp);
    } finally {
        if (fs.existsSync(tempPng)) fs.unlinkSync(tempPng);
    }
    console.log(`extractPoster: ${outputPosterWebp}`);
}
```

## Info

### IN-01: `GameProjectsData.ts`'s `iconUrl` field is now dead for every game project

**File:** `src/data/GameProjectsData.ts:4,39,70,91`
**Issue:** Plan 03-01 switched `GameProjects.vue`'s timeline thumbnail from `<img :src="project.iconUrl">` to `<LazyVideoThumbnail :src="thumbVideos[project.id]" :poster="thumbPosters[project.id]" />` (see `src/views/GameProjects.vue:37`), which never reads `project.iconUrl`. All four `iconUrl` constructor args in `GameProjectsData.ts` (`project-8-icon.png`, `DispaterSC4.png`, `project-7-icon.png`, `SwingSpaceGIF.gif`) are consequently unused dead data for this view (the field is still legitimately used by `ProjectsList.vue` for `OtherProjectsData`, so `ProjectData` itself isn't dead — only these four call sites' second constructor arg is).
**Fix:** No functional fix needed; consider a short comment on the `ProjectData` constructor noting `iconUrl` is unused by the `GameProjects` timeline (only by `ProjectsList`), so future editors don't waste time keeping these values in sync with real thumbnails.

### IN-02: `convert-media.js` still converts an asset no longer used anywhere

**File:** `scripts/convert-media.js:92`
**Issue:** `videoAssets` still lists `["dispater", "DispaterGif2"]`. Plan 03-04 (gap closure G-03-9) removed the only consumer of `DispaterGif2.mp4` — the standalone `<video class="pc-video">` block in the Dispater overlay in `GameProjectsData.ts`. Re-running `node scripts/convert-media.js` today would re-encode `DispaterGif2.mp4`/`DispaterGif2-poster.webp` for an asset pair nothing in `src/` references anymore.
**Fix:** Remove the `["dispater", "DispaterGif2"]` entry from `videoAssets` (and optionally delete the now-orphaned `public/img/projects/dispater/DispaterGif2.mp4` / `DispaterGif2-poster.webp` / `.gif` if they're confirmed unused elsewhere).

### IN-03: Typos/grammar in newly-added project copy

**File:** `src/data/GameProjectsData.ts:33,44,111`
**Issue:** Content newly added by this phase has a few rough edges: line 111 (SwingSpace) reads "Get as far as you possible can" (should be "possibly"); line 33 (Drag Rush) reads `a "ok, one more try!" hook` (should be "an" before the vowel sound); line 44 (Dispater) phrases "Are you ready for your first day... station." as a statement ending in a period despite being written as a question.
**Fix:** 
```
"Get as far as you possibly can and beat the highscore!"
...an "ok, one more try!" hook.
"Are you ready for your first day as the elevator operator at the D.I mining station?"
```

---

_Reviewed: 2026-07-23T00:00:00Z_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
