---
phase: 03-visual-polish-resume-site-metadata
reviewed: 2026-07-22T19:49:33Z
depth: standard
files_reviewed: 5
files_reviewed_list:
  - public/index.html
  - scripts/convert-media.js
  - src/data/GameProjectsData.ts
  - src/views/GameProjects.vue
  - src/views/Resume.vue
findings:
  critical: 0
  warning: 2
  info: 3
  total: 5
status: issues_found
---

# Phase 3: Code Review Report

**Reviewed:** 2026-07-22T19:49:33Z
**Depth:** standard
**Files Reviewed:** 5
**Status:** issues_found

## Summary

Reviewed the CSS/spacing + title-click affordance changes in `GameProjects.vue`, the video-conversion manifest/asset-map swap across `scripts/convert-media.js` and `GameProjectsData.ts`, the OG/meta tag replacement in `public/index.html`, and confirmed `Resume.vue` is unchanged and free of issues.

No critical/security-severity defects were found. `scripts/convert-media.js` correctly uses `execFile` with an argument array (not a shell string), so it isn't vulnerable to command injection even though it shells out to `ffmpeg`. The `v-html` usage in `ProjectDetailsOverlay.vue` (consumer of `GameProjectsData.ts` strings) only ever renders developer-authored, hardcoded HTML — there is no untrusted input flowing into it today, so it's not an active XSS vector; flagged as informational only in case that ever changes.

I traced every asset path referenced from `GameProjectsData.ts` and `GameProjects.vue`'s `thumbVideos`/`thumbPosters` maps against the actual files on disk (including case) to check for the classic "webp reference vs. png-cased-differently 404 on a case-sensitive host" bug — all paths resolve correctly. I also checked the `og:image` value against the project's locked decision doc (`03-PATTERNS.md` D-09) rather than assuming it was a mistake — it is a deliberate, documented choice, not a bug.

Two real gaps found: a generated poster asset that the pipeline builds but the data file never wires up (leaves the Dispater in-overlay video with no `poster`, so it can show a blank frame before playback), and a missing `try/finally` around temp-file cleanup in the conversion script's poster extraction path.

## Warnings

### WR-01: Dispater overlay video is missing the `poster` attribute the pipeline already generates for it

**File:** `src/data/GameProjectsData.ts:57-61`
**Issue:** `scripts/convert-media.js`'s `videoAssets` manifest has an explicit `["dispater", "DispaterGif2"]` entry (`scripts/convert-media.js:92`) whose sole purpose is to produce `DispaterGif2.mp4` *and* `DispaterGif2-poster.webp` via `extractPoster`. The `.mp4` is used in the Dispater overlay's `<video>` tag, but the `<video>` element has no `poster` attribute, so `DispaterGif2-poster.webp` is generated on disk and never referenced anywhere in `src/`. With `preload="metadata"` and no `poster`, some browsers render a blank/black frame until the user presses play, instead of the intended optimized poster frame — the exact problem the pipeline was built to solve for the timeline thumbnails.
**Fix:**
```html
<video class="pc-video" controls preload="metadata" poster="img/projects/dispater/DispaterGif2-poster.webp">
    <source src="img/projects/dispater/DispaterGif2.mp4" type="video/mp4" />
    Your browser does not support the video tag.
</video>
```

### WR-02: Temp PNG leaks on failure in `extractPoster`

**File:** `scripts/convert-media.js:56-68`
**Issue:** `extractPoster` writes `tempPng`, then calls `await toWebp(tempPng, outputPosterWebp)`, and only calls `fs.unlinkSync(tempPng)` on the next line. If `toWebp` throws (e.g. `sharp` fails on a malformed frame, output path unwritable, disk full), the `.tmp.png` file is left behind permanently and the script exits via `main().catch()` without ever cleaning it up. Since this is a manifest loop over multiple assets, a partial failure mid-run litters `public/img/projects/**` with orphaned `*.tmp.png` files that could get accidentally committed.
**Fix:**
```javascript
async function extractPoster(inputGif, outputPosterWebp) {
    assertSourceExists(inputGif);
    const tempPng = outputPosterWebp.replace(/\.webp$/, ".tmp.png");
    await execFileAsync("ffmpeg", ["-y", "-i", inputGif, "-vframes", "1", tempPng]);
    try {
        await toWebp(tempPng, outputPosterWebp);
    } finally {
        fs.unlinkSync(tempPng);
    }
    console.log(`extractPoster: ${outputPosterWebp}`);
}
```

## Info

### IN-01: `iconUrl` values in `GameProjectsData.ts` are dead for this view

**File:** `src/data/GameProjectsData.ts:4,39,76,97`
**Issue:** `ProjectData.iconUrl` (3rd constructor arg) is only consumed by `ProjectsList.vue:10` (`:style="{ 'background-image': 'url(' + project.iconUrl + ')' }"`), which is used by `OtherProjects.vue`. `GameProjects.vue` renders its timeline thumbnails from the separate `thumbVideos`/`thumbPosters` maps and never reads `project.iconUrl`. This means the `iconUrl` values passed into every `GameProjectsData.ts` entry are unused dead data — most notably `swing-space`'s `iconUrl` still points at the raw, un-converted `img/projects/swing-space/SwingSpaceGIF.gif` (the exact kind of heavy asset the conversion pipeline exists to avoid shipping), which reads as a leftover from before the video-thumbnail pipeline existed. Pre-existing (not introduced by this phase's diff), but worth cleaning up since it's confusing to a future editor of this file.
**Fix:** Either remove/no-op the unused `iconUrl` argument for game-project entries (e.g. point it at the poster webp for consistency) or add a code comment noting it's vestigial for this data file.

### IN-02: `durationSeconds: 0` would silently be ignored

**File:** `scripts/convert-media.js:37-39`
**Issue:** `if (options.durationSeconds) { args.push("-t", String(options.durationSeconds)); }` treats `0` as falsy, so a manifest entry with `durationSeconds: 0` would silently skip trimming rather than trim to zero length. Not currently triggered (only `12.5` is used), but it's a latent footgun for the next person editing the manifest.
**Fix:** `if (options.durationSeconds !== undefined) { ... }`

### IN-03: `v-html` renders developer-authored content only — flag if that ever changes

**File:** `src/data/GameProjectsData.ts` (rendered via `v-html` in `ProjectDetailsOverlay.vue:10`)
**Issue:** All `htmlDescription` strings are hardcoded literals authored by the developer, so there's no live XSS vector today. Noting this so the assumption gets re-checked if project descriptions are ever sourced from a CMS, form, or other non-static input — at that point `v-html` on unsanitized input would become a real stored-XSS risk.
**Fix:** No action needed now; revisit if `htmlDescription` ever stops being a compile-time constant.

---

_Reviewed: 2026-07-22T19:49:33Z_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
