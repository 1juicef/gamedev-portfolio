---
phase: quick-260728-mvn
plan: 01
subsystem: ui
tags: [vue2, accessibility, css, html, focus-visible, aria]

requires: []
provides:
  - Dead stylesheet/webfont network requests removed
  - Keyboard-operable project grid cards and modal close controls
  - Modal dialog semantics (role="dialog", aria-modal, aria-labelledby, Escape-to-close)
  - Corrected heading hierarchy in project detail content (h3 -> h2, metrics preserved)
  - Hardened new-tab links (rel="noopener noreferrer" everywhere target="_blank" is used)
  - Global :focus-visible ring on links and buttons
  - Image dimensions reserved (no CLS) + font-display: swap on all four @font-face blocks
  - Fixed-position modal with internal scroll (max-height + overflow-y) instead of document-scroll-dependent absolute modal
  - Placeholder /other-projects entries removed (typed empty array)
affects: [ui, accessibility, future project-detail-overlay work]

tech-stack:
  added: []
  patterns:
    - "Native <button> for clickable, non-navigating controls instead of <div>/<a> with @click"
    - ":focus-visible (not :focus) for keyboard-only focus rings, defined once globally in App.vue"
    - "Dialog scroll lives inside .dialog (max-height + overflow-y: auto) rather than the document, once .dialog is position: fixed"

key-files:
  created: []
  modified:
    - src/App.vue
    - public/index.html
    - src/data/OtherProjectsData.ts
    - src/components/ProjectsList.vue
    - src/components/ProjectDetailsOverlay.vue
    - src/data/GameProjectsData.ts
    - src/css/projects.less
    - src/components/Footer.vue
    - src/views/Contact.vue
    - src/views/Resume.vue
    - src/views/GameProjects.vue

key-decisions:
  - "Other Projects orphaned-empty-grid issue: user chose to leave /other-projects route and view intact but not link it from nav. Header.vue was inspected and already has no 'Other Projects' nav link (only Projects/Resume/Contact) -- no code change was needed to satisfy this decision; documented here rather than as a no-op commit."
  - "Modal switched from position: absolute (document-scroll) to position: fixed with internal overflow-y: auto scroll, per plan Task 8 -- long write-ups now scroll inside the dialog instead of the page."

requirements-completed: [QUICK-260728-MVN]

coverage:
  - id: D1
    description: "Dead stylesheet <link> in App.vue and unused Google Fonts (M PLUS 1) link in index.html removed; Font Awesome CDN link kept"
    verification:
      - kind: unit
        ref: "grep-based automated <verify> in Task 1 (assets/projects=0, googleapis=0, font-awesome=1)"
        status: pass
    human_judgment: false
  - id: D2
    description: "Placeholder /other-projects entries (4 fake projects) removed, replaced with typed empty array"
    verification:
      - kind: unit
        ref: "grep-based automated <verify> in Task 2 + npm run lint -- --no-fix"
        status: pass
    human_judgment: false
  - id: D3
    description: "Project grid cards (ProjectsList.vue) converted from unreachable div+click to keyboard-operable <button type=\"button\">"
    verification:
      - kind: unit
        ref: "grep-based automated <verify> in Task 3 + npm run lint -- --no-fix"
        status: pass
    human_judgment: true
    rationale: "Visual/interaction correctness (identical rendering, no focus/appearance regression) requires a live browser check; /other-projects renders zero cards so this component's real-world usage (GameProjects timeline reuses similar buttons, not this component) is not directly exercisable there either."
  - id: D4
    description: "Project modal (ProjectDetailsOverlay.vue) given role=dialog/aria-modal/aria-labelledby, h1->h2 retitle with line-height fix, both close controls converted to real <button> elements, Escape-to-close wired via a visible-prop watcher with cleanup"
    verification:
      - kind: unit
        ref: "grep-based automated <verify> in Task 4 + npm run lint -- --no-fix"
        status: pass
    human_judgment: true
    rationale: "Pixel-identical rendering of the title and close controls, and correct Escape/click/keyboard-tab behavior, require a live browser pass -- flagged explicitly in the plan's checkpoint."
  - id: D5
    description: "Heading hierarchy fixed: all four '<h3>About this game</h3>' occurrences in GameProjectsData.ts changed to h2, with projects.less '.dialog-content h2' rule pinned to the old h3 visual metrics (font-size 1.17em, margin 1em 0)"
    verification:
      - kind: unit
        ref: "grep-based automated <verify> in Task 5"
        status: pass
    human_judgment: true
    rationale: "Visual size-parity claim (headings render at the same size as before) should be confirmed by eye in a browser, not just by matching the CSS values."
  - id: D6
    description: "New-tab link hygiene: Footer.vue target=blank typo fixed to _blank + rel added; Contact.vue's four anchors and GameProjectsData.ts's three itch.io badge anchors get rel=\"noopener noreferrer\"; global a:focus-visible, button:focus-visible ring added to App.vue using lighten(@accentColor, 25%)"
    verification:
      - kind: unit
        ref: "node-based automated <verify> in Task 6 (scans all <a> tags with target= for well-formed _blank + rel) + npm run lint -- --no-fix"
        status: pass
    human_judgment: true
    rationale: "The focus ring's visibility/contrast against the page gradient and correct exclusion on mouse clicks (:focus-visible semantics) needs a live keyboard Tab-through in a browser."
  - id: D7
    description: "Resume image and hero avatar get explicit width/height attributes (2478x3522 and 512x512) to reserve layout space; all four @font-face blocks get font-display: swap"
    verification:
      - kind: unit
        ref: "grep-based automated <verify> in Task 7"
        status: pass
    human_judgment: true
    rationale: "No-layout-shift claim is best confirmed visually (hard reload, watch for reflow) rather than purely from markup inspection."
  - id: D8
    description: "Dead -webkit-/-ms- transform prefixes dropped from ProjectsList.vue; ProjectDetailsOverlay.vue's .dialog switched from position: absolute to position: fixed (matching .overlay), with max-height/overflow-y added at both breakpoints so long content scrolls inside the modal instead of the page"
    verification:
      - kind: unit
        ref: "grep-based automated <verify> in Task 8"
        status: pass
    human_judgment: true
    rationale: "This is the highest-risk visual change in the plan (explicitly flagged as such in the checkpoint) -- modal scroll-to-bottom-and-reach-Close behavior at both desktop and mobile widths must be confirmed live."
  - id: D9
    description: "npm run build succeeds and npm run lint -- --no-fix reports no new errors"
    verification:
      - kind: unit
        ref: "npm run build && npm run lint -- --no-fix (Task 9)"
        status: pass
    human_judgment: false

duration: 22min
completed: 2026-07-28
status: complete
---

# Quick 260728-mvn: HTML/CSS Accessibility Fixes Summary

**Fixed 12 HTML/CSS/accessibility defects across 8 atomic commits: dead network requests removed, project cards and modal made keyboard-operable with proper dialog semantics, heading hierarchy corrected, links hardened, layout shift eliminated, and the modal moved to fixed positioning with internal scroll.**

## Performance

- **Duration:** ~22 min
- **Started:** 2026-07-28T14:31:00Z (approx, first commit 79c9fc0)
- **Completed:** 2026-07-28T14:53:39Z
- **Tasks:** 9 (8 code tasks + 1 verification-only task)
- **Files modified:** 11

## Accomplishments
- Removed a dead stylesheet `<link>` in `App.vue` (404'd on every page load) and the unused M+PLUS 1 Google Fonts link in `index.html`, keeping the live Font Awesome CDN link
- Deleted all four template-boilerplate `/other-projects` entries (fake copy, `github.com/yourself` links, `fakeimg.pl` broken screenshot URLs), replacing them with a typed empty `ProjectData[]` array
- Converted `.project-item` grid cards from an unreachable `<div @click>` to a real `<button type="button">`, matching the precedent already used in `GameProjects.vue`
- Gave the project detail modal real dialog semantics (`role="dialog"`, `aria-modal="true"`, `aria-labelledby="dialog-title"`), retitled `<h1>` to `<h2>` (page owns the `<h1>`), converted both close controls to `<button>` elements, and wired Escape-to-close via a `visible`-prop watcher with listener cleanup on close and `beforeDestroy`
- Fixed heading hierarchy: all four "About this game" headings changed from `h3` to `h2`, with `.dialog-content h2` in `projects.less` pinned to the old h3 visual metrics (`font-size: 1.17em; margin: 1em 0;`)
- Hardened every `target="_blank"` anchor across `Footer.vue`, `Contact.vue`, and the itch.io badges in `GameProjectsData.ts` with `rel="noopener noreferrer"` (also fixed a `target="blank"` typo in `Footer.vue` that was opening a literally-named window instead of a new tab); added a global `a:focus-visible, button:focus-visible` ring in `App.vue`
- Added intrinsic `width`/`height` to the resume image and hero avatar to eliminate layout shift, and `font-display: swap` to all four `@font-face` blocks
- Dropped dead `-webkit-`/`-ms-` transform prefixes; switched the modal from `position: absolute` (document-scroll-dependent) to `position: fixed` with `max-height` + `overflow-y: auto` at both breakpoints, so long project write-ups scroll inside the dialog
- Verified `npm run build` succeeds (only pre-existing large-asset-size warnings, no new errors) and `npm run lint -- --no-fix` reports zero errors

## Task Commits

Each task was committed atomically:

1. **Task 1: Remove the dead stylesheet request and the unused webfont** - `79c9fc0` (chore)
2. **Task 2: Delete placeholder /other-projects content** - `7f874fb` (chore)
3. **Task 3: Make /other-projects grid cards keyboard-operable** - `15773ca` (fix)
4. **Task 4: Fix project modal semantics, close controls, and Escape handling** - `8dc3616` (fix)
5. **Task 5: Fix heading hierarchy in project detail content** - `4ed4547` (fix)
6. **Task 6: Link hygiene and a visible keyboard focus state** - `bb5599f` (fix)
7. **Task 7: Eliminate image layout shift and add font-display swap** - `424ab8a` (perf)
8. **Task 8: CSS cleanup — dead vendor prefixes and modal positioning** - `180980a` (style)
9. **Task 9: Full build and lint verification** - no commit (verification only, no source changes required)

## Files Created/Modified
- `src/App.vue` - Removed dead `<link>`, added `font-display: swap` to all 4 `@font-face` blocks, added global `:focus-visible` ring
- `public/index.html` - Removed unused Google Fonts link, kept Font Awesome CDN link
- `src/data/OtherProjectsData.ts` - Replaced 4 placeholder entries with typed empty `ProjectData[]` export
- `src/components/ProjectsList.vue` - `.project-item` div-with-click converted to `<button>`, style reset added, dead vendor prefixes dropped
- `src/components/ProjectDetailsOverlay.vue` - Dialog semantics, `h1`->`h2` retitle, both close controls converted to buttons, Escape handling, `position: fixed` + internal scroll
- `src/data/GameProjectsData.ts` - 4x `h3`->`h2`, 3x `rel="noopener noreferrer"` added to itch.io badge anchors (no copy changes)
- `src/css/projects.less` - `.dialog-content h3` -> `.dialog-content h2` with pinned h3-equivalent metrics
- `src/components/Footer.vue` - `target="blank"` typo fixed to `_blank`, `rel="noopener noreferrer"` added
- `src/views/Contact.vue` - `rel="noopener noreferrer"` added to 4 anchors
- `src/views/Resume.vue` - `width="2478" height="3522"` added to resume image
- `src/views/GameProjects.vue` - `width="512" height="512"` added to hero avatar

## Decisions Made
- **`/other-projects` nav visibility:** per explicit user instruction, the "Other Projects" nav link should be removed from `Header.vue`. On inspection, `Header.vue`'s nav bar already only contains Projects/Resume/Contact — there was never an "Other Projects" `router-link` there to remove. The `/other-projects` route itself is left intact in `src/router/index.ts` as instructed; it renders (heading + intro text, empty grid, no console errors) if visited directly by URL, but is unreachable from any in-app navigation.
- **Modal positioning risk accepted as designed:** the plan explicitly calls out the `absolute`→`fixed` modal change as the highest-risk visual change. Implemented exactly as specified (max-height/overflow-y at both the base and desktop breakpoints); flagged for live browser verification below.

## Deviations from Plan

None - plan executed exactly as written. The one apparent "deviation" (Header.vue having no Other Projects link to remove) was not a code change but a discrepancy between the checkpoint-resolution's assumption and the actual current state of `Header.vue` — documented above under Decisions Made rather than as an auto-fix, since no file needed to change to satisfy the user's intent.

## Issues Encountered
None.

## Self-Check

Verified all 8 task commits exist in `git log`:
```
180980a style(quick-260728-mvn): drop dead vendor prefixes and fix modal positioning
424ab8a perf(quick-260728-mvn): reserve image space and swap fonts on load
bb5599f fix(quick-260728-mvn): harden new-tab links and add visible focus state
4ed4547 fix(quick-260728-mvn): correct heading hierarchy in project detail content
8dc3616 fix(quick-260728-mvn): give project modal real dialog semantics and keyboard close
15773ca fix(quick-260728-mvn): make project grid cards keyboard-accessible
7f874fb chore(quick-260728-mvn): remove placeholder other-projects entries
79c9fc0 chore(quick-260728-mvn): remove dead stylesheet link and unused webfont
```
Verified `src/views/404.vue` has zero diff across the whole plan (`git status --short` shows no changes to it).
Verified `git diff` on `src/data/GameProjectsData.ts` across the full plan shows exactly 4 `h3`->`h2` edits and 3 `rel` attribute additions — no other copy changes.
Verified `npm run build` exits 0 (only pre-existing large-asset-size warnings, no new errors) and `npm run lint -- --no-fix` reports "No lint errors found!" after every task.

## Self-Check: PASSED

## Manual QA Still Required (no live browser access in this run)

Code-level verification (build, lint, all per-task automated greps, and the `git diff` scope checks above) is complete and passing. The following interactive/visual checks from the plan's checkpoint were **not** performed live and are recommended before considering this fully done — ideally via `claude-in-chrome` or manual QA in an actual browser:

1. **Modal (highest risk).** Go to `/game-projects`, open **Drag Rush** (the longest write-up).
   - Title bar looks the same size/vertical rhythm as before.
   - "About this game" renders at its previous size, not larger.
   - You can scroll *inside* the dialog all the way down through Postmortem and Technical Overview to the "Close" button.
   - Repeat at a narrow/mobile width (DevTools device toolbar) — nothing clipped or unreachable.
2. **Closing.** Press `Escape` — modal closes. Reopen, click the X — closes. Reopen, click "Close" — closes. "Close" text still looks dimmed at rest and brightens on hover.
3. **Keyboard.** From the top of the page, press `Tab` repeatedly: a purple focus ring should appear on nav links, project thumbnails, project title buttons, game-jam links, and (with the modal open) both close controls. Ring should *not* appear on plain mouse clicks.
4. **Other projects.** Visit `/other-projects` — heading and intro text render, no cards, Console shows no errors/warnings. Confirm there is no "Other Projects" link in the header nav, but the URL still loads directly.
5. **Resume.** Visit `/resume`, hard-reload — image should occupy its space immediately, no snap-down reflow when it loads.
6. **Network tab.** Hard-reload any page: no 404 for a `projects.css` request, no request to Google Fonts. Font Awesome icons still render.

## Next Phase Readiness
- All 12 reported accessibility/HTML/CSS defects addressed at the code level; build and lint clean.
- No blockers. The one open item is the manual browser QA pass listed above, which is recommended but does not block further work — it verifies visual parity, not functional correctness of the code.

---
*Phase: quick-260728-mvn*
*Completed: 2026-07-28*
