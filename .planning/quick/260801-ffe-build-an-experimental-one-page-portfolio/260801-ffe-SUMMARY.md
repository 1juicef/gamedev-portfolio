---
phase: quick-260801-ffe
plan: 01
subsystem: ui
tags: [vue2, vue-router, intersection-observer, less, scroll-nav]

requires: []
provides:
  - "/one-page route stacking GameProjects, OtherStuff, Resume, Contact into one scroll"
  - "Header scroll-nav branch active only on /one-page (smooth-scroll buttons, sticky bar, active-underline, section-driven mascot)"
affects: [dark-theme-redesign]

tech-stack:
  added: []
  patterns:
    - "Route-conditional component branch via a single boolean computed (isOnePage) gating a v-if/v-else template split, keeping the default render path byte-identical to before"
    - "Cross-component readiness handshake via $root.$emit/$on ('one-page-sections-ready') to cover the lazy-chunk-not-yet-mounted race between a parent-of-router-view component and a lazily-routed child"
    - "IntersectionObserver with a narrow -45% rootMargin band, idempotent setup (always teardown-then-create), paired teardown on route-leave watcher and beforeDestroy"

key-files:
  created:
    - src/views/OnePage.vue
  modified:
    - src/router/index.ts
    - src/components/Header.vue

key-decisions:
  - "Sticky header on /one-page is a planner inference, not a locked decision — flagged explicitly in the Task 5 checkpoint for the user to accept or reject"
  - "Nav items on /one-page are <button> elements, not in-page <a href=\"#...\"> anchors, because the router runs in hash mode and a literal hash anchor would rewrite the route and land on /404"
  - "Two known GameProjects/Resume quirks (scroll-to-top on modal open, Resume project links navigating away instead of scrolling) were deliberately left unpatched and raised in the checkpoint rather than silently fixed, since fixing either means touching a shared view component outside this task's stated scope"

requirements-completed: [QUICK-260801-ffe]

coverage:
  - id: D1
    description: "/one-page renders the four existing views stacked in order behind id-bearing scroll-target sections, with a divider between each and no duplicated headings"
    requirement: "QUICK-260801-ffe"
    verification:
      - kind: other
        ref: "Task 1 automated <verify> (grep/wc structural checks) + npm run lint"
        status: pass
    human_judgment: false
  - id: D2
    description: "Header renders a route-conditional scroll-nav (buttons, sticky bar, active underline, section-driven mascot) on /one-page while leaving the four router-link elements and mascot switch untouched on every other route"
    requirement: "QUICK-260801-ffe"
    verification:
      - kind: other
        ref: "Task 2 + Task 3 automated <verify> (structural greps) + npm run lint"
        status: pass
    human_judgment: false
  - id: D3
    description: "The four embedded view components are byte-for-byte unchanged (hash-identical) and npm run build compiles clean under strict TypeScript"
    requirement: "QUICK-260801-ffe"
    verification:
      - kind: other
        ref: "Task 4 automated <verify> (git hash-object diff + npm run build)"
        status: pass
    human_judgment: false
  - id: D4
    description: "The one-page experiment reads well in the browser (section flow, nav behavior, sticky-header decision, and the four regression routes still behave as before)"
    verification: []
    human_judgment: true
    rationale: "Aesthetic/UX judgment (does one continuous scroll read better than four pages, is the sticky header wanted) and live-browser regression behavior cannot be determined by static checks — this is exactly Task 5's blocking checkpoint, not yet executed."

duration: ~7min
completed: 2026-08-01
status: complete
---

# Quick Task 260801-ffe: Experimental One-Page Portfolio Summary

**New `/one-page` route stacks the four existing GameProjects/OtherStuff/Resume/Contact views into one scroll, with a route-conditional Header scroll-nav (IntersectionObserver-driven active state and mascot) — unlinked, additive, and cheap to delete if the experiment doesn't land.**

## Performance

- **Duration:** ~7 min (Task 1 commit to Task 3 commit, plus Task 4 build/verify)
- **Started:** 2026-08-01T09:15:31Z (approx, plan-checker commit)
- **Completed:** 2026-08-01T09:22:22Z (Task 4 verification)
- **Tasks:** 4 of 5 (Task 5 is a blocking human-verify checkpoint, not executed by design)
- **Files modified:** 3 (1 created, 2 modified)

## Accomplishments

- Added `/one-page` route (`src/router/index.ts`), lazily loaded from the same shared `about` webpack chunk every other view already uses, positioned before the `*` catch-all with all eight pre-existing route entries untouched
- Created `src/views/OnePage.vue`: a single root stacking the four real view components (`GameProjects`, `OtherStuff`, `Resume`, `Contact`) inside four id-bearing `<section class="one-page-section">` wrappers (`projects`, `other-stuff`, `resume`, `contact`), each carrying the existing `rgba(255,255,255,0.14)` divider treatment except the first, plus `scroll-margin-top: 88px` so a jumped-to section clears the sticky bar
- Taught `Header.vue` a route-conditional scroll-nav branch: on `/one-page` it renders four `<button class="nav-link">` elements that `scrollIntoView` (smooth, or `auto` under `prefers-reduced-motion`) instead of the four `<router-link>` elements it renders everywhere else; a `header--one-page` rule makes the bar `position: sticky` at `z-index: 5` (below `ProjectDetailsOverlay`'s `10`/`11`)
- Wired an `IntersectionObserver` (threshold `0`, `-45% 0px -45% 0px` rootMargin) that drives `activeSection`, which in turn drives both the `.nav-link--active` underline and the mascot gif via a small section-id-to-gif map; the observer is created off the `one-page-sections-ready` event (emitted by `OnePage.vue`'s `mounted`, covering the lazy-chunk-not-yet-mounted race) and a `$route.path` watcher, and torn down on route-leave and `beforeDestroy`
- Verified with a byte-level `git hash-object` diff that the four embedded view components are unchanged before and after the whole change, and that `npm run build` compiles clean under strict TypeScript

## Task Commits

Each task was committed atomically:

1. **Task 1: Route and OnePage view** - `d03df57` (feat)
2. **Task 2: Header scroll-nav branch on /one-page only** - `6e0e409` (feat)
3. **Task 3: IntersectionObserver drives the active nav item and the mascot** - `fbfaf07` (feat)
4. **Task 4: Prove the four existing routes and their components did not regress** - verification-only, no code changes to commit (temporary hash files created and deleted per plan, never committed)

_Task 5 (checkpoint:human-verify, gate="blocking") was not executed — see "Checkpoint Outstanding" below._

## Files Created/Modified

- `src/views/OnePage.vue` (new) - stacks the four real views into id-bearing scroll-target sections with dividers, emits `one-page-sections-ready`
- `src/router/index.ts` - one added route entry (`/one-page` -> lazy `OnePage.vue`, shared `about` chunk), inserted before the `*` catch-all
- `src/components/Header.vue` - `isOnePage` computed gating a v-if/v-else nav template split; `scrollToSection`, `setupSectionObserver`/`teardownSectionObserver` methods; `activeSection`/`sectionLinks`/`observer` data; `$route.path` watcher and `created`/`beforeDestroy` observer lifecycle hooks; `header--one-page` sticky styles and `.nav-link`/`.nav-link--active` styles

## Decisions Made

- Nav items on `/one-page` are `<button>` elements rather than in-page `href="#id"` anchors, because the router runs in default hash mode and a real hash anchor would overwrite the route hash and redirect through the `*` catch-all to `/404` (established in the plan's `key_facts`, not re-derived here)
- The sticky header on `/one-page` is called out explicitly as a planner inference in both the plan and this summary — it is proposed, not confirmed, and Task 5's checkpoint asks the user to accept or reject it
- Left two known behavioral quirks alone rather than patching them: `GameProjects.showDetails` still calls `window.scrollTo(0, 0)` when opening a project overlay (affects `/one-page` too), and `Resume.vue`'s project links still navigate to `/game-projects?project=…` instead of scrolling up to the embedded Projects section. Both are raised for the user in the Task 5 checkpoint since fixing either means editing a shared view component, which is out of this task's stated scope (no edits to existing view components)

## Deviations from Plan

None - plan executed exactly as written for Tasks 1-4. All automated `<verify>` blocks passed without needing any Rule 1-4 fixes.

## Issues Encountered

None. The pre-existing uncommitted WIP in `src/data/GameProjectsData.ts` and `src/views/GameProjects.vue` (unrelated to this task, per the dispatch context) was left untouched throughout — confirmed by the Task 4 `git hash-object` diff showing all four embedded view components identical to their Task 1 baseline, and by `git status --short` after the final commit still showing only those same two files as pre-existing modifications, unchanged by this task's edits.

## User Setup Required

None - no external service configuration required.

## Checkpoint Outstanding

**Task 5 (checkpoint:human-verify, gate="blocking") was not executed and requires the user to judge the result in a browser.** Per the plan's `<how-to-verify>`:

1. Run `npm run serve` (a dev server was already running in the background per the dispatch context; if it needs restarting, the standard `npm run serve` command applies) and open `http://localhost:8080/#/one-page`
2. **Judge the experiment itself:** scroll top to bottom — does one continuous page read better than four separate ones, especially at the Projects-into-Other-Stuff and Other-Stuff-into-Resume seams? The dividers are deliberately thin/quiet
3. **Nav behavior:** click each of the four nav items (should smooth-scroll, not navigate); scroll by hand and watch the underline move and the mascot swap per section
4. **Sticky header decision:** explicitly the planner's call, not agreed — say whether to keep it or drop it (single scoped CSS rule either way)
5. **Two known quirks to accept or flag:** project-overlay scroll-to-top on open/close, and Resume's project links navigating away instead of scrolling to the embedded Projects section above them
6. **Regression pass:** visit `/`, `#/game-projects`, `#/other-stuff`, `#/resume`, `#/contact` and confirm the header still behaves exactly as before (real links, no sticky, mascot per page, Other Stuff autoplay, Resume download button)
7. **Mobile:** narrow to ~375px or use the LAN address; confirm nav items still fit and the sticky bar doesn't eat too much of a small screen

**Resume signal:** "approved", or specific change requests (sticky header keep/drop, divider weight/spacing, section order, either of the two known quirks) — all cheap to adjust per the plan.

## Next Phase Readiness

- All four automated tasks complete and committed; the experimental route is fully additive (no existing route, component, or nav link was touched) and easy to delete wholesale if the user rejects the experiment after Task 5
- Blocked on the Task 5 human-verify checkpoint before this experiment can be considered accepted or linked into the main nav

---
*Phase: quick-260801-ffe*
*Completed: 2026-08-01*

## Self-Check: PASSED

All created files found on disk (`src/views/OnePage.vue`, modified `src/router/index.ts` and `src/components/Header.vue`, this SUMMARY.md). All three task commit hashes (`d03df57`, `6e0e409`, `fbfaf07`) confirmed present in git log.
