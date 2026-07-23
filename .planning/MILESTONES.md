# Milestones

## v1.1 Game Jams Section (Shipped: 2026-07-23)

**Phases completed:** 1 phases, 1 plans, 1 tasks

**Key accomplishments:**

- Added a "Game Jams" subheading with two plain-text itch.io hyperlinks (The Eldritch Keeper, Mas-Q) below the project timeline on /game-projects, each opening in a new tab with noopener/noreferrer.

---

## v1.0 v1.0 MVP (Shipped: 2026-07-23)

**Phases completed:** 3 phases, 11 plans, 24 tasks

**Known verification overrides:** 2 (see STATE.md Deferred Items — Game Jams section and custom-domain deploy, both blocked on external inputs, not code quality)

**Key accomplishments:**

- Built scripts/convert-media.js (ffmpeg + sharp) and produced all 24 compressed media assets — 4 muted H.264 MP4 thumbnails with WebP posters and 16 WebP screenshots — with every source GIF/PNG master preserved untouched.
- Built LazyVideoThumbnail.vue (IntersectionObserver-gated muted/looping video with poster fallback) and rewired all four GameProjects.vue timeline thumbnails onto it, removing the drag-rush/dispater always-loaded YouTube iframe special case.
- Repointed all 16 GameProjects overlay screenshots to lazy-loaded WebP, fixed Floor 0's broken image references, added Dispater's missing YouTube trailer, deferred SwingSpace's overlay video, and pruned App.vue's dead eager-preload call.
- Added an optional `durationSeconds` trim to `gifToMp4()` (ffmpeg `-t` flag) and regenerated only `Floor0gif1.mp4` at ~12.5s, closing UAT gap G-01-5 without touching the other 3 video thumbnails, any screenshot, or the pipeline's CLI surface.
- Added team-attribution bullets to Drag Rush/Dispater, fixed 4 known typos across all projects, added Floor 0's itch.io link, and fixed one grammar slip in the hero bio — all via in-place string edits to `GameProjectsData.ts` and `GameProjects.vue`, no new markup structure.
- Josef gave a provisional, phone-based approval of the personality boundary (mascot confined to header/footer, warm-but-short hero tone) without having done the visual read-through himself yet — this procedurally closes POLISH-02 and Phase 2, but a real visual confirmation from Josef is still outstanding and may surface follow-up issues later.
- Closed all 5 outstanding UAT gaps (3 copy fixes + 2 scoped CSS specificity fixes) from 02-UAT.md, converting the phase-2 personality-boundary read-through from 3 pass / 5 issue toward a full pass.
- Snapped GameProjects timeline spacing/typography to the UI-SPEC 4px scale, added a persistent underline click affordance on project titles, and swapped Dispater's timeline/overlay assets (DispaterGif.gif now drives the thumbnail, DispaterGif2 relocated into the overlay as a video) via the existing ffmpeg/sharp pipeline.
- Replaced placeholder OG/social-preview metadata with Josef's locked real values in `public/index.html`, and confirmed `Resume.vue` already ships the single static resume-image treatment with no code changes needed.
- Two single-property CSS fixes: resume page gains 48px top padding (scoped), sitewide content column widened from 1280px to 1600px at the desktop breakpoint.
- Removed a stray 10px bottom-padding rule that broke the overlay's black-to-purple gradient, and deleted Dispater's redundant standalone gameplay `<video>` block now that its YouTube trailer covers the same footage

---
