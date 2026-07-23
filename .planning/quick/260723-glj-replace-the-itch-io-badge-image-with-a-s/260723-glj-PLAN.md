---
phase: quick
plan: 260723-glj
type: execute
wave: 1
depends_on: []
files_modified:
  - src/data/GameProjectsData.ts
  - src/css/projects.less
autonomous: true
requirements: []
---

<objective>
Replace the three plain-text "Play on itch.io" links with the new itch.io badge image (`public/img/projects/itchBadge.png`, already in the repo), each still wrapped in its existing clickable `<a>` link. Add a sizing CSS rule so the badge (1198x369px, ~3.25:1) renders at a sensible cap inside the overlay dialog.

Purpose: Swap the bland text link for the recognizable itch.io badge for a more polished project overlay.
Output: Edited `GameProjectsData.ts` (3 links) + new `.itch-badge` rule in `projects.less`.

Scope guard: SwingSpace has NO itch.io link and must stay untouched.
</objective>

<execution_context>
@$HOME/.claude/gsd-core/workflows/execute-plan.md
@$HOME/.claude/gsd-core/templates/summary.md
</execution_context>

<context>
@.planning/STATE.md
@src/data/GameProjectsData.ts
@src/css/projects.less
</context>

<tasks>

<task type="auto">
  <name>Task 1: Replace the 3 itch.io text links with badge images</name>
  <files>src/data/GameProjectsData.ts</files>
  <action>In `src/data/GameProjectsData.ts`, replace each of the three occurrences of `Play on itch.io` text links — Drag Rush (line ~36, `https://yrgo.itch.io/drag-rush`), Dispater (line ~67, `https://yrgo.itch.io/dispater`), and Floor Zero (line ~88, `https://juice-f.itch.io/floorzero`). Each currently reads `<a href="{url}" target="_blank">Play on itch.io</a>` inside a `<div class="paragraph center">`. Change the inner text to a badge image, keeping the same `<a href>` and `target="_blank"`: `<a href="{url}" target="_blank"><img class="itch-badge" src="img/projects/itchBadge.png" alt="Play on itch.io" loading="lazy" /></a>`. Keep each project's original URL. Do NOT modify the SwingSpace entry — it has no itch.io link and must remain as-is.</action>
  <verify>
    <automated>grep -c 'class="itch-badge"' src/data/GameProjectsData.ts # expect 3; and: grep -c 'Play on itch.io</a>' src/data/GameProjectsData.ts # expect 0</automated>
  </verify>
  <done>All three itch.io links wrap an `<img class="itch-badge" ... loading="lazy">` with `alt="Play on itch.io"`, original URLs and `target="_blank"` preserved; no bare "Play on itch.io" text link remains; SwingSpace entry unchanged.</done>
</task>

<task type="auto">
  <name>Task 2: Add .itch-badge sizing CSS</name>
  <files>src/css/projects.less</files>
  <action>In `src/css/projects.less`, inside the `.dialog-content` block, add an `.itch-badge` rule following the existing pattern (base rule + `@media only screen and (min-width: 620px)` override, like `.pc-screenshot`). Base rule: cap the width so the ~3.25:1 badge is not oversized on mobile — set `width: 60%; max-width: 200px; height: auto;` and keep it inline-block or block-centered (the parent `.center` already text-aligns center, so `display: inline-block;` works). In the `@media (min-width: 620px)` block add an override sizing it for desktop, e.g. `width: 200px; max-width: 200px;`. Keep `height: auto` so aspect ratio is preserved. Do not touch the existing `a { text-decoration: underline }` rule — it only affects text links, not the image.</action>
  <verify>
    <automated>grep -c 'itch-badge' src/css/projects.less # expect 2 (base + media override)</automated>
  </verify>
  <done>`.itch-badge` rule exists in the base `.dialog-content` scope with a capped width and `height: auto`, plus a `@media (min-width: 620px)` override; badge renders at ~200px max, aspect ratio intact.</done>
</task>

</tasks>

<verification>
- `grep -c 'class="itch-badge"' src/data/GameProjectsData.ts` returns 3
- `grep -c 'Play on itch.io</a>' src/data/GameProjectsData.ts` returns 0
- `grep -c 'itch-badge' src/css/projects.less` returns 2
- SwingSpace entry in GameProjectsData.ts is byte-for-byte unchanged (no itch.io link added)
- Optional visual check: `npm run serve`, open a project overlay (Drag Rush / Dispater / Floor Zero), confirm the itch.io badge shows, is clickable, opens the correct itch.io URL in a new tab, and is not oversized.
</verification>

<success_criteria>
Three project overlays (Drag Rush, Dispater, Floor Zero) show the itch.io badge as a clickable link to their respective itch.io pages, sized sensibly on both mobile and desktop. SwingSpace remains untouched.
</success_criteria>

<output>
Create `.planning/quick/260723-glj-replace-the-itch-io-badge-image-with-a-s/260723-glj-SUMMARY.md` when done.
</output>
