---
quick_id: 260801-exk
status: complete
date: 2026-08-01
---

# Quick Task 260801-exk: Move View Details cue off the thumbnail into the copy column

## What was built

Relocated the "View Details" cue in `src/views/GameProjects.vue` out of the video
thumbnail overlay (shipped in quick task 260801-cp6) and into `.project-copy`, as
its own clickable `<button class="project-cue">` placed after the summary
paragraph — in both the timeline row and the (currently hidden) WIP row.

- **Markup**: removed the `<span class="project-cue" aria-hidden="true">` from
  inside each `.project-image-button` (which now contains only its
  `LazyVideoThumbnail`); added `<button class="project-cue">` as the last child of
  `.project-copy`, wired to the same `showDetails(project)` / `showDetails(wipProject)`
  handler the title and thumbnail already use.
- **Accessibility**: the cue is now its own focusable control rather than a
  decorative overlay riding on the image button's accessible name, so `aria-hidden`
  was dropped and each cue gets a real, project-specific
  `aria-label="View details for {name}"`.
- **Font fix**: added `font-family: inherit` — `<button>` doesn't inherit
  `font-family` by default, and without this it would silently render in the
  browser's UA-stylesheet Arial instead of the site's Lekton.
- **Style cleanup**: dropped the overlay-only machinery that no longer applies —
  absolute positioning, bottom/right offsets, the `calc()` max-width fence,
  `pointer-events: none` (which would have made the relocated button unclickable),
  and the ellipsis-truncation rule on `.project-cue-label` (no longer constrained
  by the thumbnail's width). `.project-image-button` no longer needs
  `position: relative` since nothing anchors to it anymore.
- **Restyled as a standalone tap target**: kept the pill identity (dark
  translucent fill, white label, accent border/glow/arrow via
  `--project-accent`), sized as a genuine 44px-minimum tap target
  (`padding: 10px 16px`, `min-height: 44px`, `box-sizing: border-box`), spaced
  `20px` below the summary paragraph, with `cursor: pointer`,
  `touch-action: manipulation`, and `-webkit-tap-highlight-color: transparent`
  matching `.project-title-link`.
- **State rules replaced, not just moved**: the old `.project-image-button:active
  .project-cue` and `.project-image-button:hover .project-cue` descendant rules
  can no longer match (the cue isn't nested in the image button anymore) — replaced
  with `.project-cue:active { filter: brightness(1.4); }` and, inside the existing
  `@media (hover: hover) and (pointer: fine)` block,
  `.project-cue:hover { filter: brightness(1.15); box-shadow: ...stronger glow... }`.
  No focus ring was added on the cue — `App.vue`'s global `button:focus-visible`
  rule already covers it.

## Commits

- `e1409fd` feat(quick-260801-exk): relocate View Details cue from thumbnail overlay to copy column

## Deviations from Plan

None — plan executed exactly as written. All automated verification checks in the
plan's `<verify>` block passed (lint, cue-after-summary structural check,
`showDetails` wiring count, accessible-name count, font-family/arrow presence,
zero remaining overlay positioning, zero remaining stale descendant rules).

## Outstanding: human-verify checkpoint (Task 2 of the plan)

This needs a real browser/device check before calling the visual result done — no
code changes are pending on it, it's a design judgement call:

1. `npm run serve`, open `/game-projects`.
2. Desktop: confirm the pill now sits beneath each project's summary text, with
   nothing overlaying the video. Confirm the label renders in the site's Lekton
   font at a sensible size (not small Arial). Hover it: should brighten and its
   glow should strengthen. Click it: details overlay opens, same as the title or
   thumbnail.
3. Check both alternating row orientations (cards alternate which side the image
   sits on), including the narrower SwingSpace card.
4. Narrow to ~375px (or a real phone on the LAN address): rows stack image-then-text,
   so the pill should land at the bottom of each card, comfortably tappable, and
   brighten on press before the overlay opens.
5. Tab through with the keyboard: pill should be reachable with a visible focus
   outline. Note each card now exposes three controls in tab order (thumbnail,
   title, pill) — flag if that feels like too much.
6. Judgement call: under the text, does it still read as an obvious
   "this card is clickable" signal, or has it lost the pull it had sitting on the
   video? Size, spacing, wording, and placement within the copy block are all
   cheap to change.
