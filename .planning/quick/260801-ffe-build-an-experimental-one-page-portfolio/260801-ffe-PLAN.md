---
phase: quick-260801-ffe
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - src/router/index.ts
  - src/views/OnePage.vue
  - src/components/Header.vue
autonomous: false
requirements: [QUICK-260801-ffe]

must_haves:
  truths:
    - Visiting `#/one-page` renders GameProjects, OtherStuff, Resume and Contact stacked in that order in a single scrollable page
    - Each of the four stacked sections carries a stable `id` usable as a scroll target (`projects`, `other-stuff`, `resume`, `contact`)
    - A thin divider separates each section from the one above it, and no section gains a duplicate heading on top of the one its own component already renders
    - On `/one-page` the four header nav items smooth-scroll to their section instead of navigating away
    - The nav item matching the section currently in view is visually marked active, and the mascot gif swaps to that section's gif
    - On every other route the header still renders four real `<router-link>` elements with the route-driven mascot and no observer running
    - The four existing view components are byte-for-byte unchanged and their five existing routes still render exactly as before
    - The IntersectionObserver is disconnected when leaving `/one-page` and on header teardown, leaving no live observer behind
  artifacts:
    - src/views/OnePage.vue (new — section wrappers, dividers, readiness emit)
    - src/router/index.ts (one added route entry, existing entries untouched)
    - src/components/Header.vue (conditional nav branch, scroll-jump, observer, section mascot map, styles)
  key_links:
    - "route `/one-page` -> lazy `OnePage.vue` import sharing the existing `about` webpack chunk"
    - "OnePage `mounted` -> `$root.$emit('one-page-sections-ready')` -> Header `setupSectionObserver()` (required because Header mounts before the lazily-loaded view exists in the DOM)"
    - "section `id` attributes -> `document.getElementById` in both `scrollToSection` and the observer's observe list"
    - "IntersectionObserver callback -> `activeSection` -> drives both the `.nav-link--active` class and `mascotSrc`"
    - "`$route.path === '/one-page'` -> `isOnePage` -> nav branch, sticky class, and which mascot source is used"
    - "sticky header `z-index: 5` sits under `ProjectDetailsOverlay`'s fixed overlay/dialog layers so the project modal still covers the nav"
    - "`.one-page-section { scroll-margin-top }` -> the sticky bar does not cover the top of a jumped-to section"
---

<objective>
Add an experimental one-page portfolio at a new `/one-page` route that stacks the four existing view components — GameProjects, OtherStuff, Resume, Contact — and teach the shared `Header` to behave as a scroll-nav on that route only.

Purpose: the user wants to try a single-scroll version of the portfolio without committing to it ("don't know if I will like it, want to try"). The whole design is therefore additive and isolated: nothing about the existing multi-page experience may change, and the experiment must be cheap to delete.
Output: new `src/views/OnePage.vue`, one added route in `src/router/index.ts`, and a route-conditional branch inside `src/components/Header.vue`. No data-file changes, no new dependencies, no edits to any existing view component.
</objective>

<execution_context>
@$HOME/.claude/gsd-core/workflows/execute-plan.md
@$HOME/.claude/gsd-core/templates/summary.md
</execution_context>

<context>
@.planning/STATE.md
@CLAUDE.md
@.claude/CLAUDE.md
@src/router/index.ts
@src/components/Header.vue
@src/App.vue
@src/views/GameProjects.vue
@src/views/OtherStuff.vue
@src/views/Resume.vue
@src/views/Contact.vue
</context>

<key_facts>
Established and verified before planning — do not re-derive:

- **The router runs in default hash mode** (`new VueRouter({ routes })`, no `mode` option). The new page's real URL is therefore `#/one-page`, and a literal `href="#projects"` anchor would rewrite the router hash and land on the catch-all `/404`. That is why the scroll-nav items are `<button>` elements rather than in-page anchors.
- **`<button>` does not inherit the site font.** `App.vue` names `.nav-bar a` explicitly in its Russo One rule (lines 93-99); a button inside `.nav-bar` does not match that selector and will fall back to the UA's ~13.3px Arial unless the font family, size and line-height are set on it. Same trap that bit quick task 260801-exk.
- `App.vue` line 114 already defines `a:focus-visible, button:focus-visible { outline: 2px solid ...; outline-offset: 3px; }` globally, so the new nav buttons get a keyboard focus ring for free — do not suppress it.
- `App.vue`'s global `a:hover, .router-link-exact-active { opacity: 1; }` is keyed on the router's own class name. The scroll-nav's active state uses a different class, so it needs its own `opacity: 1` declaration in Header's scoped block.
- `ProjectDetailsOverlay` is `position: fixed` with `z-index: 10` on its scrim and `11` on the dialog. Any sticky header must stay below those or the modal will render behind the nav bar.
- **Header mounts before the routed view exists.** `Header` lives outside `<router-view>` in `App.vue` and all routes are lazily imported, so on a cold load of `#/one-page` the section elements are not in the DOM when Header's `mounted` runs, and `$nextTick` is not enough on a first SPA navigation either (the chunk is still downloading). Hence the explicit readiness event from `OnePage`.
- The existing divider treatment in `GameProjects.vue` is `border-top: 1px solid rgba(255, 255, 255, 0.14)` with `padding-top: 32px` (see `.game-jams`, `.project-row`). `Resume.vue` uses the same rgba value for its own rules. Reuse it verbatim.
- Each embedded component already renders its own top heading — `OtherStuff.vue` an `<h1>Other Stuff</h1>`, `Contact.vue` an `<h1>Contact</h1>`, `Resume.vue` an `<h1>Josef Ubaka</h1>`, and `GameProjects.vue` its hero block. Adding section labels on top of those would duplicate them.
- `src/router/index.ts` currently contains exactly 8 `path:` entries, ending with the `*` catch-all which must remain last.
- `src/views/GameProjects.vue` and `src/data/GameProjectsData.ts` are **already modified in the working tree** before this task starts. A plain `git diff` check therefore cannot prove the view components were left alone — the regression gate hashes them at the start instead.
- There is no test suite in this repo. `npm run lint`, `npm run build` (the only real TypeScript gate — ESLint here does not type-check) and structural greps are the available automated checks.
- Two behaviours of the embedded components are known and deliberately **not** changed: `GameProjects.showDetails` calls `window.scrollTo(0, 0)` when opening a project overlay, and `Resume.vue`'s project links are real `<router-link>`s to `/game-projects?project=…` that navigate away from the one-page. Both are raised in the checkpoint for the user to judge, not silently patched.
</key_facts>

<tasks>

<task type="tracer">
  <name>Task 1: Route and OnePage view — the four sections stacked and scroll-targetable</name>
  <files>src/router/index.ts, src/views/OnePage.vue, .planning/quick/260801-ffe-build-an-experimental-one-page-portfolio/four-view-baseline.txt</files>
  <action>
**Do this first, before writing any file.** Record the regression baseline: run `git hash-object` over `src/views/GameProjects.vue`, `src/views/OtherStuff.vue`, `src/views/Resume.vue` and `src/views/Contact.vue`, in that order, and write the four hashes to `.planning/quick/260801-ffe-build-an-experimental-one-page-portfolio/four-view-baseline.txt`. Task 4 replays the same command and diffs the result — this is the only reliable proof that the embedded components were left untouched, because two tracked files already carry uncommitted edits from earlier work (see key_facts). Capturing it before any edit is what makes the check meaningful.

**Route.** Add one entry to the `routes` array in `src/router/index.ts` with `path: '/one-page'`, `name: 'One Page'`, and a lazy component import of `../views/OnePage.vue`. Insert it after the `/contact` entry and before the `/404` entry so the `*` catch-all stays last. Use the same `/* webpackChunkName: "about" */` magic comment every other route uses — all views already share that one chunk, so this keeps the four embedded components from being duplicated into a second bundle. Change nothing else in this file: all existing entries, their order, and the `new VueRouter({ routes })` construction stay exactly as they are — in particular do not introduce a `mode` or a `scrollBehavior` option, since the live site depends on the current hash-mode deep links.

**View.** Create `src/views/OnePage.vue` following the repo's Options API conventions (`Vue.extend`, `name: "OnePage"`, `<script lang="ts">`, `<style scoped lang="less">`).

Its template is a single root `div.one-page` containing exactly four `<section>` wrappers in this order: `id="projects"` wrapping `<GameProjects />`, `id="other-stuff"` wrapping `<OtherStuff />`, `id="resume"` wrapping `<Resume />`, `id="contact"` wrapping `<Contact />`. Every wrapper also carries `class="one-page-section"`. Import those four components from `@/views/…` and register them in `components`. Reuse the real components — do not copy any of their markup here, and pass no props: each one keeps pulling its own data exactly as it does on its own route. Add no headings or labels of your own; each embedded component already renders its own top heading, so a section label would read as a duplicate.

**Readiness signal.** In `mounted`, emit `one-page-sections-ready` on `this.$root`. Header cannot observe the sections from its own `mounted` hook — it is outside `<router-view>` and mounts before this lazily-loaded chunk resolves — so this event is what tells it the scroll targets now exist. Keep it to that one line; Header owns all observer logic.

**Styles (scoped).** Give the dividers to the adjacent-sibling selector `.one-page-section + .one-page-section` so the first section (Projects, whose hero opens the page) gets none: `margin-top: 56px`, `padding-top: 32px`, and `border-top: 1px solid rgba(255, 255, 255, 0.14)` — the same 1px/0.14 rule `GameProjects.vue` already uses for `.game-jams` and its project rows, so the seam reads as part of the existing system rather than a new device.

Also set `scroll-margin-top: 88px` on `.one-page-section`. Task 2 makes the header sticky on this route only, and without that offset a jumped-to section's first line lands underneath the bar. Setting it here, on the element that owns the scroll target, keeps the scroll behaviour correct no matter how the jump is triggered.
  </action>
  <verify>
    <automated>cd "$(git rev-parse --show-toplevel)" &amp;&amp; test "$(wc -l &lt; .planning/quick/260801-ffe-build-an-experimental-one-page-portfolio/four-view-baseline.txt)" -eq 4 &amp;&amp; npm run lint &amp;&amp; test "$(grep -c "path: '" src/router/index.ts)" -eq 9 &amp;&amp; grep -q "path: '/one-page'" src/router/index.ts &amp;&amp; grep -q "views/OnePage.vue" src/router/index.ts &amp;&amp; test "$(grep -n "path: '\*'" src/router/index.ts | cut -d: -f1)" -gt "$(grep -n "path: '/one-page'" src/router/index.ts | cut -d: -f1)" &amp;&amp; for id in projects other-stuff resume contact; do grep -q "id=\"$id\"" src/views/OnePage.vue || exit 1; done &amp;&amp; test "$(grep -c 'class="one-page-section"' src/views/OnePage.vue)" -eq 4 &amp;&amp; grep -q 'one-page-sections-ready' src/views/OnePage.vue &amp;&amp; grep -q 'scroll-margin-top' src/views/OnePage.vue &amp;&amp; grep -q 'rgba(255, 255, 255, 0.14)' src/views/OnePage.vue</automated>
  </verify>
  <done>The baseline hash file holds four hashes captured before any edit. `/one-page` is registered ahead of the catch-all and lazily loads `OnePage.vue` from the shared chunk; the eight pre-existing route entries are unchanged. `OnePage.vue` renders the four real view components in order inside four id-bearing section wrappers, with a divider above every section except the first and no added headings. Lint passes.</done>
</task>

<task type="auto">
  <name>Task 2: Header scroll-nav branch on /one-page only</name>
  <files>src/components/Header.vue</files>
  <action>
Give `Header` a second rendering mode that only exists on `/one-page`, leaving the multi-page mode it has today completely intact.

**Route flag.** Add a computed `isOnePage` returning `this.$route.path === '/one-page'`. Everything in this task keys off it, so that on every other route the component evaluates to exactly what it renders today.

**Template.** Bind `:class="{ 'header--one-page': isOnePage }"` on the root `.header` div and keep the mascot `<img>` where it is. Split the four nav items into two sibling `<template>` blocks — a `v-if="isOnePage"` block and a `v-else` block. The `v-else` block holds the four existing `<router-link>` elements verbatim, same order, same targets, same labels; `<template>` wrappers render no extra element, so the non-one-page DOM output stays identical to today's.

The `v-if` block renders one `<button type="button" class="nav-link">` per entry of a new `sectionLinks` data array — `{ id: 'projects', label: 'Projects' }`, `{ id: 'other-stuff', label: 'Other Stuff' }`, `{ id: 'resume', label: 'Resume' }`, `{ id: 'contact', label: 'Contact' }` — in that order, keyed by `id`, with `@click="scrollToSection(link.id)"`. Buttons rather than in-page anchors: this router runs in hash mode, so a real `href="#projects"` would overwrite the route hash and a middle-click or new-tab would land on the 404 page (see key_facts). A button also gets the global `button:focus-visible` ring for free.

**Scroll method.** Add `scrollToSection(id: string)`: look the element up with `document.getElementById(id)`, return early if it is missing rather than throwing, then call `scrollIntoView` with `block: 'start'` and `behavior` set to `'smooth'` — except when `window.matchMedia('(prefers-reduced-motion: reduce)').matches`, in which case pass `'auto'`, matching the reduced-motion respect `GameProjects.vue` already shows. Guard the `matchMedia` call itself so an absent API degrades to smooth rather than crashing. Finally set `this.activeSection = id` so the active state responds to the click immediately instead of waiting for the scroll to settle. Add `activeSection` to `data` with the initial value `'projects'` — the top of the page — so the header is correct before anything has scrolled.

**Styles.** The existing `a` rule owns the shared nav-item geometry (uppercase, side margins, bottom padding, `white-space: nowrap`, `display: inline-block`). Extend that selector to `a, .nav-link` instead of duplicating it, and do the same for the `a` rule inside the `max-width: 620px` media query so the buttons pick up the mobile margins too.

Then add a `.nav-link` rule for what a button does not inherit and an anchor does: the `'Russo One', 'Lekton', Helvetica, Arial, sans-serif` stack (`App.vue`'s Russo One rule names `.nav-bar a` and cannot match a button — without this the labels render in small Arial), `font-size: inherit`, `line-height: inherit`, `vertical-align: baseline` so they sit on the same line as the mascot and the anchors, `color: @textColor`, `opacity: 0.5` to match the global anchor treatment, `background: none`, `border: 0`, `appearance: none` with its `-webkit-` prefix so Safari does not re-skin them, `cursor: pointer`, `touch-action: manipulation` and `-webkit-tap-highlight-color: transparent` as used elsewhere in this repo. Do not add an outline override — the global focus ring must survive.

Add `.nav-link:hover { opacity: 1; }` to mirror the global anchor hover, and extend the existing `.router-link-exact-active` rule's selector to also cover `.nav-link--active` so the active item gets the same 2px bottom border; give `.nav-link--active` its own `opacity: 1` as well, because the global rule that brightens the active router link is keyed on the router's class name and will not match this one. Task 3 is what sets the class.

**Sticky bar.** Add a `.header--one-page` rule making the header `position: sticky` at `top: 0` with `z-index: 5`, a `rgba(18, 8, 24, 0.92)` background matching the page gradient's upper range, and a 6px `backdrop-filter` blur with its `-webkit-` prefix. Note in a code comment that this rule is scoped to the one-page route. This is a deliberate planner inference rather than a locked decision — a scroll-driven nav whose active state and mascot both track the current section is pointless if the nav scrolls out of view on the first swipe — and the checkpoint asks the user to accept or reject it. The `z-index: 5` is not arbitrary: `ProjectDetailsOverlay` pins its scrim and dialog above that value, so the project modal keeps covering the nav bar. Do not raise it.
  </action>
  <verify>
    <automated>cd "$(git rev-parse --show-toplevel)" &amp;&amp; npm run lint &amp;&amp; test "$(grep -c '&lt;router-link' src/components/Header.vue)" -eq 4 &amp;&amp; grep -q "to=\"/other-stuff\"" src/components/Header.vue &amp;&amp; grep -q "to=\"/resume\"" src/components/Header.vue &amp;&amp; grep -q "to=\"/contact\"" src/components/Header.vue &amp;&amp; grep -q "'/one-page'" src/components/Header.vue &amp;&amp; grep -q 'isOnePage' src/components/Header.vue &amp;&amp; grep -q 'header--one-page' src/components/Header.vue &amp;&amp; grep -q 'scrollToSection' src/components/Header.vue &amp;&amp; grep -q 'scrollIntoView' src/components/Header.vue &amp;&amp; grep -q 'prefers-reduced-motion' src/components/Header.vue &amp;&amp; grep -q 'z-index: 5' src/components/Header.vue &amp;&amp; grep -q 'position: sticky' src/components/Header.vue &amp;&amp; test "$(grep -c 'nav-link--active' src/components/Header.vue)" -ge 2 &amp;&amp; grep -q 'a, .nav-link' src/components/Header.vue &amp;&amp; grep -q "font-family: 'Russo One'" src/components/Header.vue &amp;&amp; for id in "'projects'" "'other-stuff'" "'resume'" "'contact'"; do grep -q "id: $id" src/components/Header.vue || exit 1; done</automated>
  </verify>
  <done>On `/one-page` the header renders four labelled buttons that smooth-scroll (or jump, under reduced motion) to the matching section, and the bar stays visible while scrolling without covering the project modal. On every other route the four original `<router-link>` elements render unchanged. The buttons carry the site's nav font, size, spacing and opacity treatment and keep the global keyboard focus ring. Lint passes.</done>
</task>

<task type="auto">
  <name>Task 3: IntersectionObserver drives the active nav item and the mascot</name>
  <files>src/components/Header.vue</files>
  <action>
Make the scroll position, not the route, decide which nav item is highlighted and which mascot plays — on `/one-page` only.

**Observer state.** Add an `observer` field to `data`, initialised to `null` and typed as `IntersectionObserver | null` so strict TypeScript accepts the later assignment.

**Setup.** Add `setupSectionObserver()`. It always tears down first (call `teardownSectionObserver()`), so it is safe to invoke repeatedly from more than one trigger. Then bail out early if `isOnePage` is false, or if `IntersectionObserver` is undefined in this environment. Otherwise construct one observer with `threshold: 0` and a `rootMargin` of `-45% 0px -45% 0px`, which shrinks the detection band to a thin strip across the middle of the viewport so that exactly the section crossing the centre counts as current — full-height sections would otherwise all report as intersecting at once. In the callback, assign `entry.target.id` to `this.activeSection` for each entry whose `isIntersecting` is true, and deliberately do not clear the value when an entry stops intersecting: keeping the last known section prevents the highlight from flickering off in the gap between two sections. Then walk `sectionLinks`, resolve each `id` through `document.getElementById`, and observe the ones that exist.

**Teardown.** Add `teardownSectionObserver()`: if an observer exists, call `disconnect()` on it and set the field back to `null`.

**Triggers.** Subscribe in `created` with `this.$root.$on('one-page-sections-ready', this.setupSectionObserver)` — that event, emitted by `OnePage.vue` in Task 1, is the only reliable signal that the sections are in the DOM, because Header mounts before the lazily-loaded route chunk resolves. Add a watcher on `'$route.path'`: when the new path is `/one-page`, reset `activeSection` to `'projects'` and call `setupSectionObserver` inside `$nextTick`; on any other path call `teardownSectionObserver` so no observer keeps running once the sections are gone. The two triggers overlap harmlessly because setup is idempotent — whichever fires later wins, and the first SPA navigation to the route (where `$nextTick` fires while the chunk is still downloading) is covered by the event. In `beforeDestroy`, `$off` the same handler and tear the observer down; Header never actually unmounts in this app, but leaving a live observer and a root listener behind on a component that could be unmounted later is exactly the kind of leak that is invisible until it is not.

**Active class.** Bind `:class="{ 'nav-link--active': activeSection === link.id }"` on the nav buttons, reusing the class Task 2 already styled to match the router's active look.

**Mascot.** Add a module-scope constant map from section id to gif, reusing the exact images the route switch already uses so nothing new is introduced: `projects` to `img/projects/Guy.gif` (what `/game-projects` shows), `other-stuff` to `img/projects/Guy7.gif`, `resume` to `img/projects/Guy1.gif`, `contact` to `img/projects/Guy4.gif`. Then have `mascotSrc` return the map's entry for `activeSection` when `isOnePage` is true, falling back to `img/projects/Guy.gif` for an unrecognised value. When `isOnePage` is false it must fall through to the existing `switch` on `this.$route.path` completely unchanged — same cases, same returns, same default. Do not fold the two lookups into one table: the route switch still has to serve `/other-projects`, which has no counterpart section on the one-page.
  </action>
  <verify>
    <automated>cd "$(git rev-parse --show-toplevel)" &amp;&amp; npm run lint &amp;&amp; grep -q 'new IntersectionObserver' src/components/Header.vue &amp;&amp; grep -q 'rootMargin' src/components/Header.vue &amp;&amp; grep -q 'isIntersecting' src/components/Header.vue &amp;&amp; grep -q 'disconnect()' src/components/Header.vue &amp;&amp; grep -q 'beforeDestroy' src/components/Header.vue &amp;&amp; grep -q '\$off' src/components/Header.vue &amp;&amp; grep -q "\$on('one-page-sections-ready'" src/components/Header.vue &amp;&amp; grep -q "'\$route.path'" src/components/Header.vue &amp;&amp; grep -q "nav-link--active': activeSection" src/components/Header.vue &amp;&amp; test "$(grep -c 'Guy7.gif' src/components/Header.vue)" -eq 2 &amp;&amp; test "$(grep -c 'Guy1.gif' src/components/Header.vue)" -eq 2 &amp;&amp; test "$(grep -c 'Guy4.gif' src/components/Header.vue)" -eq 2 &amp;&amp; test "$(grep -c 'Guy6.gif' src/components/Header.vue)" -eq 1 &amp;&amp; test "$(grep -c 'case "/other-projects"' src/components/Header.vue)" -eq 1</automated>
  </verify>
  <done>On `/one-page`, scrolling moves the active underline across the four nav buttons and swaps the mascot gif to match the section in view, with no flicker between sections. The observer is created only on that route, torn down when leaving it or when the header is destroyed, and the root event listener is removed alongside it. `/other-projects` still resolves its mascot through the untouched route switch. Lint passes.</done>
</task>

<task type="auto">
  <name>Task 4: Prove the four existing routes and their components did not regress</name>
  <files>.planning/quick/260801-ffe-build-an-experimental-one-page-portfolio/four-view-baseline.txt</files>
  <action>
`Header.vue` renders on every page in the app, so it is the one file in this change that can break routes nobody touched. Close that out with evidence rather than inspection.

Re-run `git hash-object` over the same four view files in the same order as Task 1, write the result beside the baseline as `four-view-after.txt`, and `diff` the two. They must be identical — a byte-level proof that `GameProjects.vue`, `OtherStuff.vue`, `Resume.vue` and `Contact.vue` were embedded rather than edited. This check exists because two of those files already carried uncommitted edits before this task began, so an ordinary `git diff` would report noise and prove nothing.

Run `npm run build`. This is the only step in the plan that type-checks: ESLint here parses TypeScript but does not run the compiler, so a strict-mode error in the new observer or mascot code surfaces here and nowhere earlier. A clean production build also proves the four embedded components still compile inside their new parent and that the new route's chunk resolves.

Confirm the change stayed in its lane: `package.json` and `package-lock.json` must be untouched (no dependency was needed — `IntersectionObserver`, `scrollIntoView` and `matchMedia` are all platform APIs), and `src/router/index.ts` must still list every pre-existing path.

Then delete both hash files — they are scaffolding for this check, not artifacts worth committing.

If the diff or the build fails, fix the cause in the file that introduced it and re-run; do not adjust the check itself, and do not resolve a hash mismatch by reverting the wrong file — a mismatch means one of the four embedded components was edited, which the design forbids outright.
  </action>
  <verify>
    <automated>cd "$(git rev-parse --show-toplevel)" &amp;&amp; Q=.planning/quick/260801-ffe-build-an-experimental-one-page-portfolio &amp;&amp; git hash-object src/views/GameProjects.vue src/views/OtherStuff.vue src/views/Resume.vue src/views/Contact.vue &gt; "$Q/four-view-after.txt" &amp;&amp; diff "$Q/four-view-baseline.txt" "$Q/four-view-after.txt" &amp;&amp; test "$(git status --porcelain package.json package-lock.json | wc -l)" -eq 0 &amp;&amp; for p in "/" "/resume" "/game-projects" "/other-projects" "/other-stuff" "/contact" "/404" "/one-page"; do grep -q "path: '$p'" src/router/index.ts || exit 1; done &amp;&amp; npm run build &amp;&amp; rm -f "$Q/four-view-baseline.txt" "$Q/four-view-after.txt"</automated>
  </verify>
  <done>The four embedded view components hash identically to their pre-task baseline. `npm run build` completes clean, proving the new TypeScript compiles under strict mode and the new chunk resolves. `package.json` and `package-lock.json` are untouched and all eight pre-existing route paths are still registered. The temporary hash files are removed.</done>
</task>

<task type="checkpoint:human-verify" gate="blocking">
  <name>Task 5: Judge the one-page experiment in the browser</name>
  <what-built>A one-page version of the portfolio at `#/one-page` that stacks the real Projects, Other Stuff, Resume and Contact pages into a single scroll, separated by the same thin divider the Projects page already uses. On that route only, the four header nav items scroll to their section instead of navigating, the bar sticks to the top of the viewport, and the underline plus the mascot gif follow whichever section is in view. The four existing pages are untouched and `/one-page` is not linked from anywhere yet.</what-built>
  <how-to-verify>
Run `npm run serve` and open `http://localhost:8080/#/one-page` (the router is in hash mode, so the `#/` is required).

**The experiment itself — the part only you can answer.** Scroll the whole thing top to bottom. Does one continuous page read better than four separate ones, or does it feel long and repetitive? Watch the seams in particular: the jump from the Projects timeline into the Other Stuff gallery, and from the gallery into the Resume. The dividers are deliberately thin and quiet; say the word if the sections need a stronger break, more breathing room, or a different order.

**Nav.** Click each of the four nav items — each should smooth-scroll to its section rather than change the page. Then scroll by hand and watch the header: the underline should move across the four items as sections pass the middle of the screen, and the mascot should swap to that section's gif (Projects and Other Stuff and Resume and Contact each have their own).

**Sticky header — an explicit decision for you.** Making the bar stick to the top on this route was my call, not something we agreed: without it the nav scrolls away on the first swipe and the whole active-underline-plus-mascot behaviour becomes invisible. If you would rather the header scroll away like it does on the normal pages, say so and it comes out — it is a single CSS rule scoped to this route, and the nav buttons keep working either way.

**Two known quirks I deliberately left alone** — tell me if either bothers you, both are fixable but both would mean touching a shared view component:
1. Opening a project's "View Details" overlay jumps the page to the top before the modal appears (`GameProjects.vue` does that on every route today). Closing it leaves you at the top rather than back at the card you clicked.
2. The project links inside the Resume section navigate away to the normal `/game-projects` page instead of scrolling up to the Projects section above them.

**Regression pass — the important one.** `Header.vue` is shared by every page, so check the originals still behave: visit `/`, `#/game-projects`, `#/other-stuff`, `#/resume` and `#/contact`. On each, the nav should be normal links that change the page, the header should scroll away with the content as before, the mascot should still change per page, and nothing should look sticky or shifted. The Other Stuff videos should still autoplay and the Resume download button should still work.

**Mobile.** Narrow the browser to roughly 375px, or open the LAN address the dev server prints on a phone. Check the nav items still fit on their line at the tighter mobile spacing, that tapping one still scrolls, and that the sticky bar does not eat too much of a small screen.
  </how-to-verify>
  <resume-signal>Type "approved", or tell me what to change — keep or drop the sticky header, divider weight and spacing, section order, and either of the two known quirks are all cheap to adjust</resume-signal>
</task>

</tasks>

<threat_model>
## Trust Boundaries

| Boundary | Description |
|----------|-------------|
| URL -> router | The visitor controls the location hash; the router resolves it against a fixed route table with a catch-all |
| component state -> DOM lookup | `activeSection` and `sectionLinks[].id` reach `document.getElementById` |
| none other | Static site: no user input, no network calls, no auth, no storage, no new dependencies |

## STRIDE Threat Register

| Threat ID | Category | Component | Severity | Disposition | Mitigation Plan |
|-----------|----------|-----------|----------|-------------|-----------------|
| T-ffe-01 | Tampering | `scrollToSection` / observer element lookup | low | accept | The ids come from a hardcoded four-entry `sectionLinks` array in the component, never from the URL or any user-supplied value. `getElementById` performs no evaluation and the missing-element path returns early. |
| T-ffe-02 | Denial of Service | `IntersectionObserver` lifecycle in `Header.vue` | medium | mitigate | `setupSectionObserver` disconnects any existing observer before creating one, the `$route.path` watcher disconnects on leaving `/one-page`, and `beforeDestroy` disconnects and `$off`s the root listener — so repeated navigation in and out cannot accumulate observers or listeners against a detached DOM. |
| T-ffe-03 | Spoofing | sticky header stacking against `ProjectDetailsOverlay` | low | mitigate | The sticky bar is pinned at `z-index: 5`, below the overlay scrim (`10`) and dialog (`11`), so the modal always covers the nav rather than the nav floating over a dialog and offering clickable controls on top of it. |
| T-ffe-04 | Information disclosure | new `/one-page` route | low | accept | The route composes four components that are already publicly reachable on their own routes and renders the same public portfolio content. It exposes nothing new; it is simply unlinked from the nav for now. |
| T-ffe-SC | Tampering | npm installs | low | accept | No package installs in this task — `IntersectionObserver`, `scrollIntoView` and `matchMedia` are platform APIs. `package.json` and `package-lock.json` are asserted unmodified in Task 4. |
</threat_model>

<verification>
- `npm run lint` passes after each code task; `npm run build` completes clean in Task 4
- The four embedded view components hash identically before and after the change
- `src/router/index.ts` still registers all eight pre-existing paths, with the `*` catch-all last
- `src/components/Header.vue` still contains four `<router-link>` elements for the non-one-page branch
- `package.json`, `package-lock.json` and every file under `src/data/` are untouched
- No fifth nav link to `/one-page` is added anywhere
- Human checkpoint approved
</verification>

<success_criteria>
- `#/one-page` renders GameProjects, OtherStuff, Resume and Contact stacked in that order, reusing the real components with no duplicated markup and no added headings
- Each section is a scroll target with a stable id, separated from the previous one by the existing thin divider treatment
- On `/one-page` the four nav items scroll to their section, the active item is underlined, and the mascot tracks the section in view
- On every other route the header behaves exactly as it does today, with no observer running
- All five existing routes and their view components are unchanged and still render as before
- Only `src/router/index.ts`, `src/views/OnePage.vue` and `src/components/Header.vue` are modified or created
</success_criteria>

<output>
Create `.planning/quick/260801-ffe-build-an-experimental-one-page-portfolio/260801-ffe-SUMMARY.md` when done
</output>