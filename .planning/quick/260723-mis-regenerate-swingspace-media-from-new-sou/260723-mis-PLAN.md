---
phase: quick
plan: 260723-mis
type: execute
wave: 1
depends_on: []
files_modified:
  - src/css/projects.less
  - src/data/GameProjectsData.ts
  - public/img/projects/swing-space/SwingSpaceGIF3.mp4
  - public/img/projects/swing-space/SwingSpaceGIF3-poster.webp
  - public/img/projects/swing-space/SwingSpaceVid.mp4
  - public/img/projects/swing-space/SwingSpaceSC1.webp
  - public/img/projects/swing-space/SwingSpaceSC2.webp
  - public/img/projects/swing-space/SwingSpaceSC1.png
  - public/img/projects/swing-space/SwingSpaceSC2.png
  - public/img/projects/floor-0/Floor0vid2-web.mp4
autonomous: true
requirements: []
---

<objective>
Three related media/content jobs for the game-dev portfolio, each shipped as its own revertable commit:

1. Regenerate all SwingSpace overlay/timeline media from the user's new source files (`NEWSwingSpaceVid.mp4`, `NEWSwingSpaceSC.png`, `NEWSwingSpaceSC1.png`) using the existing `scripts/convert-media.js` helpers — overwriting the already-referenced named assets in place (no code changes needed).
2. Commit the already-present uncommitted `src/css/projects.less` fix that supplies the missing `.pc-video` / `.swing-space-*` layout CSS referenced (but never styled) since Phase 1 commit `78090d8` — a genuine completeness bug.
3. Compress the raw 53.9MB `Floor0vid2.mp4` to a web-served `Floor0vid2-web.mp4` (source master preserved per D-03) and add a `<video class="pc-video">` block to the Floor Zero overlay, above its screenshots.

Purpose: Refresh SwingSpace media from better sources, fix a broken/unstyled SwingSpace overlay, and give Floor Zero its first gameplay video.
Output: 7 regenerated SwingSpace binaries + 1 CSS fix + 1 new compressed Floor Zero video + 1 `GameProjectsData.ts` edit, across 3 separate commits.

CRITICAL SCOPE GUARD: `src/App.vue` and `src/components/ProjectDetailsOverlay.vue` have UNRELATED uncommitted redesign work. NEVER edit, stage, revert, or commit those two files. Stage only the explicit file list in each task's `git add` — never `git add -A` / `git add .`. Also leave `.env`, `.planning/config.json`, and the modified `03-VERIFICATION.md` untouched.
</objective>

<execution_context>
@$HOME/.claude/gsd-core/workflows/execute-plan.md
@$HOME/.claude/gsd-core/templates/summary.md
</execution_context>

<context>
@.planning/STATE.md
@scripts/convert-media.js
@src/data/GameProjectsData.ts
@src/css/projects.less
</context>

<tasks>

<task type="auto">
  <name>Task 1: Commit the projects.less CSS completeness fix (standalone)</name>
  <files>src/css/projects.less</files>
  <action>The working-tree diff of `src/css/projects.less` is already exactly the missing layout CSS (verified: base + `@media (min-width: 620px)` rules for `.pc-video`, `.swing-space-video`, `.swing-space-shots`, `.swing-space-shot`; no font/gradient redesign content mixed in). Do NOT rewrite or re-derive it — it is correct as-is. Stage ONLY this one file with `git add src/css/projects.less` (never `git add -A`), then commit with a clearly-labeled standalone message such as `fix: add missing .pc-video/.swing-space-* CSS from Phase 1 (01-03)`. This must be its own commit, separate from the media commits in Tasks 2 and 3. Confirm `src/App.vue` and `src/components/ProjectDetailsOverlay.vue` remain modified-but-unstaged afterward (their unrelated redesign edits must stay out of this commit).</action>
  <verify>
    <automated>git show --stat --name-only HEAD | grep -E '^\s*src/' # expect ONLY src/css/projects.less listed; then: git status --porcelain src/App.vue src/components/ProjectDetailsOverlay.vue # expect both still show as modified (leading M/space M), proving they were NOT committed</automated>
  </verify>
  <done>A standalone commit exists touching only `src/css/projects.less`, containing the 4 missing class rules (base + media). `App.vue` and `ProjectDetailsOverlay.vue` are unchanged and still uncommitted.</done>
</task>

<task type="auto">
  <name>Task 2: Regenerate SwingSpace media from new sources + commit</name>
  <files>public/img/projects/swing-space/SwingSpaceVid.mp4, public/img/projects/swing-space/SwingSpaceGIF3.mp4, public/img/projects/swing-space/SwingSpaceGIF3-poster.webp, public/img/projects/swing-space/SwingSpaceSC1.webp, public/img/projects/swing-space/SwingSpaceSC2.webp, public/img/projects/swing-space/SwingSpaceSC1.png, public/img/projects/swing-space/SwingSpaceSC2.png</files>
  <action>Using a throwaway `node -e` invocation (or a scratch script you delete afterward — leave nothing behind in the repo) run from the repo root, `require('./scripts/convert-media.js')` to reuse its exported `gifToMp4`, `extractPoster`, and `toWebp` functions directly (matching the STATE.md precedent "Ran gifToMp4/extractPoster directly on the new DispaterGif asset"). Do NOT edit `scripts/convert-media.js`'s manifest arrays. All paths are under `public/img/projects/swing-space/`. Perform, in order:
- `gifToMp4('NEWSwingSpaceVid.mp4', 'SwingSpaceVid.mp4')` — the overlay video (source is an mp4, which ffmpeg reads fine despite the helper name); uses the exact settings baked into `gifToMp4` (`-movflags +faststart -pix_fmt yuv420p -vf scale=trunc(iw/2)*2:trunc(ih/2)*2 -c:v libx264 -crf 28 -preset veryslow -an`).
- Copy the just-encoded `SwingSpaceVid.mp4` to `SwingSpaceGIF3.mp4` (the timeline thumbnail) via `fs.copyFileSync`. The thumbnail uses the identical source and identical `gifToMp4` settings as the overlay video, so the encode is byte-identical — copying avoids a second wasted `veryslow` pass. (# ponytail: skip redundant encode, they are the same bytes.)
- `extractPoster('NEWSwingSpaceVid.mp4', 'SwingSpaceGIF3-poster.webp')` — first-frame WebP poster.
- `toWebp('NEWSwingSpaceSC.png', 'SwingSpaceSC1.webp')` and `toWebp('NEWSwingSpaceSC1.png', 'SwingSpaceSC2.webp')` — the two overlay screenshots.
- `fs.copyFileSync('NEWSwingSpaceSC.png', 'SwingSpaceSC1.png')` and `fs.copyFileSync('NEWSwingSpaceSC1.png', 'SwingSpaceSC2.png')` — overwrite the PNG masters so the tracked source masters reflect the new content (this is an intentional, user-requested replacement, not a D-03 violation).
Then verify the mp4 outputs are single-digit MB (see verify). Stage ONLY these 7 files explicitly by name with `git add public/img/projects/swing-space/SwingSpaceVid.mp4 SwingSpaceGIF3.mp4 SwingSpaceGIF3-poster.webp SwingSpaceSC1.webp SwingSpaceSC2.webp SwingSpaceSC1.png SwingSpaceSC2.png` (paths relative to that folder or full paths — never `git add -A`, and do NOT stage the `NEWSwingSpace*` raw sources). Commit as its own message, e.g. `chore(media): regenerate SwingSpace video/poster/screenshots from new sources`. These filenames are already referenced by committed `src/App.vue`, `src/views/GameProjects.vue`, and `src/data/GameProjectsData.ts` — no code edits.</action>
  <verify>
    <automated>cd public/img/projects/swing-space && for f in SwingSpaceVid.mp4 SwingSpaceGIF3.mp4 SwingSpaceGIF3-poster.webp SwingSpaceSC1.webp SwingSpaceSC2.webp SwingSpaceSC1.png SwingSpaceSC2.png; do test -f "$f" || { echo "MISSING $f"; exit 1; }; done && test "$(wc -c < SwingSpaceVid.mp4)" -lt 10000000 && test "$(wc -c < SwingSpaceGIF3.mp4)" -lt 10000000 && cmp -s SwingSpaceVid.mp4 SwingSpaceGIF3.mp4 && echo OK # all 7 exist, both mp4s single-digit MB, thumbnail == overlay bytes</automated>
  </verify>
  <done>All 7 SwingSpace assets regenerated from the new sources and committed in a single media commit; both mp4 outputs are <10MB and byte-identical to each other; PNG masters overwritten with new content; `NEWSwingSpace*` raw sources NOT staged/committed; no throwaway script left in the repo.</done>
</task>

<task type="auto">
  <name>Task 3: Compress Floor0vid2 + add pc-video block to Floor Zero overlay + commit</name>
  <files>public/img/projects/floor-0/Floor0vid2-web.mp4, src/data/GameProjectsData.ts</files>
  <action>Two steps, then one commit.
Step A — Compress: using the same throwaway `node -e`/scratch-script approach as Task 2 (require `./scripts/convert-media.js`, delete any scratch file after), run `gifToMp4('public/img/projects/floor-0/Floor0vid2.mp4', 'public/img/projects/floor-0/Floor0vid2-web.mp4')` to compress the raw 53.9MB source to a distinctly-named web output. Do NOT reference the raw 53.9MB `Floor0vid2.mp4` anywhere in the data file, and do NOT overwrite or delete it — the source master stays untouched per D-03. Confirm `Floor0vid2-web.mp4` came out single-digit MB (see verify); if it is >=10MB, do NOT silently ship it — flag it in SUMMARY.md as an oversized-output open item (a trim or higher CRF may be needed) before deciding.
Step B — Wire: in `src/data/GameProjectsData.ts`, in the Floor Zero entry (`new ProjectData("floor-0", ...)`), insert a new video block BETWEEN the intro paragraph (the `<div class="paragraph"><strong>Floor Zero</strong> ... happened here.</div>` block, ~lines 70-72) and the existing screenshots block (the `<div class="paragraph center">` that starts with `<img ... Floor0SC1.webp ...>`, ~line 73). The inserted block matches SwingSpace's overlay-video HTML pattern but WITHOUT the `swing-space-video` modifier (that class is SwingSpace-specific sizing) — use the base `.pc-video` class only: a `<div class="paragraph center">` wrapping `<video class="pc-video" controls preload="metadata">` with a `<source src="img/projects/floor-0/Floor0vid2-web.mp4" type="video/mp4" />` and the `Your browser does not support the video tag.` fallback text, closing `</video></div>`. The `.pc-video` styling this relies on is the one committed in Task 1. Match the existing 4-space indentation of the surrounding template literal. Then stage ONLY `public/img/projects/floor-0/Floor0vid2-web.mp4` and `src/data/GameProjectsData.ts` by name and commit, e.g. `feat(floor-0): add compressed gameplay video above screenshots in overlay`.</action>
  <verify>
    <automated>test -f public/img/projects/floor-0/Floor0vid2-web.mp4 && test -f public/img/projects/floor-0/Floor0vid2.mp4 && test "$(wc -c < public/img/projects/floor-0/Floor0vid2-web.mp4)" -lt 10000000 && node -e "const s=require('fs').readFileSync('src/data/GameProjectsData.ts','utf8');const v=s.indexOf('Floor0vid2-web.mp4'),sc=s.indexOf('Floor0SC1.webp');if(!(v>=0&&sc>=0&&v<sc))process.exit(1);if(s.indexOf('Floor0vid2.mp4\"')!==-1)process.exit(1);" && echo OK # compressed output exists <10MB, raw master still present, video ref precedes screenshots, and raw 53.9MB file is NOT referenced (only *-web.mp4)</automated>
  </verify>
  <done>`Floor0vid2-web.mp4` exists at single-digit MB with the 53.9MB `Floor0vid2.mp4` master preserved; Floor Zero overlay `htmlDescription` has a `<video class="pc-video">` block (no `swing-space-video` modifier) positioned above the screenshots; only the two intended files committed; if output was >=10MB it is flagged in SUMMARY rather than shipped silently.</done>
</task>

<task type="auto">
  <name>Task 4: Final media size sanity + surface the NEWSwingSpace* deletion question</name>
  <files>.planning/quick/260723-mis-regenerate-swingspace-media-from-new-sou/260723-mis-SUMMARY.md</files>
  <action>No code changes. First, re-confirm every regenerated/compressed video output is a reasonable web size (single-digit MB): `SwingSpaceVid.mp4`, `SwingSpaceGIF3.mp4`, and `Floor0vid2-web.mp4`. Then handle the raw-source open question WITHOUT acting on it: the content of `NEWSwingSpaceVid.mp4`, `NEWSwingSpaceSC.png`, and `NEWSwingSpaceSC1.png` has now been folded into the named SwingSpace assets. Do NOT delete them and do NOT block — leave all three in place as untracked files and record an explicit OPEN QUESTION for the user in SUMMARY.md: "The NEWSwingSpace* raw sources under public/img/projects/swing-space/ have been folded into the committed named assets — delete them now, or keep them as masters? Awaiting your call; left in place, unstaged." Also note in SUMMARY whether the Floor Zero compressed output landed under 10MB (and if not, that it was flagged). Confirm no throwaway conversion scripts remain in the repo.</action>
  <verify>
    <automated>cd public/img/projects && test "$(wc -c < swing-space/SwingSpaceVid.mp4)" -lt 10000000 && test "$(wc -c < swing-space/SwingSpaceGIF3.mp4)" -lt 10000000 && test "$(wc -c < floor-0/Floor0vid2-web.mp4)" -lt 10000000 && test -f swing-space/NEWSwingSpaceVid.mp4 && test -f swing-space/NEWSwingSpaceSC.png && test -f swing-space/NEWSwingSpaceSC1.png && echo OK # all compressed outputs <10MB and the 3 raw NEW sources still present (not deleted)</automated>
  </verify>
  <done>All video outputs confirmed single-digit MB; the three `NEWSwingSpace*` raw sources are still present and untracked (not deleted); SUMMARY.md records the explicit user question about deleting-vs-keeping them plus any oversized-output flag; no throwaway scripts remain.</done>
</task>

</tasks>

<verification>
- `git log --oneline -3` shows three distinct, independently-revertable commits: (1) projects.less CSS fix, (2) SwingSpace media regen, (3) Floor Zero video add.
- `git show --stat` on the CSS commit lists only `src/css/projects.less`.
- `src/App.vue` and `src/components/ProjectDetailsOverlay.vue` remain modified-and-uncommitted throughout (`git status --porcelain` shows them unstaged) — the unrelated redesign was never touched.
- SwingSpace: `SwingSpaceVid.mp4`, `SwingSpaceGIF3.mp4`, `SwingSpaceGIF3-poster.webp`, `SwingSpaceSC1.webp`, `SwingSpaceSC2.webp`, `SwingSpaceSC1.png`, `SwingSpaceSC2.png` all committed; both mp4s <10MB and byte-identical.
- Floor Zero: `Floor0vid2-web.mp4` committed at <10MB, raw `Floor0vid2.mp4` master still present; `GameProjectsData.ts` has a base `.pc-video` video block above the screenshots; raw 53.9MB file is not referenced.
- Optional visual check: `npm run serve`, open the SwingSpace overlay (video constrained + screenshots side-by-side, proving Task 1 CSS applied) and the Floor Zero overlay (gameplay video appears above screenshots).
- `NEWSwingSpaceVid.mp4` / `NEWSwingSpaceSC.png` / `NEWSwingSpaceSC1.png` still present, untracked; SUMMARY flags the delete-or-keep question.
</verification>

<success_criteria>
SwingSpace media is refreshed from the new sources, the SwingSpace overlay is now correctly styled (missing Phase-1 CSS committed), and Floor Zero has a compressed gameplay video above its screenshots — delivered as three clean, independently-revertable commits with the unrelated App.vue/ProjectDetailsOverlay.vue redesign left completely untouched. The raw NEWSwingSpace* sources are preserved with an explicit deletion question surfaced to the user.
</success_criteria>

<output>
Create `.planning/quick/260723-mis-regenerate-swingspace-media-from-new-sou/260723-mis-SUMMARY.md` when done.
</output>
