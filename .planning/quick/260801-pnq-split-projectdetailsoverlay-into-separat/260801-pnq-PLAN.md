---
phase: quick-260801-pnq
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - src/router/index.ts
  - src/views/ProjectDetails.vue
  - src/views/GameProjects.vue
  - src/components/ProjectsList.vue
  - src/components/ProjectDetailsOverlay.vue
  - src/views/Resume.vue
  - src/components/Header.vue
  - src/App.vue
  - src/css/variables.less
autonomous: false
requirements: [QUICK-260801-PNQ]

must_haves:
  truths:
    - "Clicking a project card (thumbnail, title, or View Details cue) on the Projects timeline navigates to a dedicated project page at #/project/<id> that starts scrolled to the top"
    - "The project page renders the same htmlDescription content with identical src/css/projects.less styling as the old modal did"
    - "Going back from a project page returns the visitor to the list page at the scroll position they left"
    - "Resume 'Selected Projects' links open the same dedicated project page"
    - "An unknown project id redirects to the 404 page instead of rendering a blank page"
    - "The header stays pinned to the top of the viewport while scrolling, with an opaque background so page content is not visible through it"
  artifacts:
    - src/views/ProjectDetails.vue
    - src/router/index.ts
    - src/css/variables.less
  key_links:
    - "ProjectDetails.vue v-html wrapper must carry class `dialog-content` — every project-content style in src/css/projects.less is nested under `.dialog-content`, so dropping that class silently unstyles all project HTML"
    - "Route param `:id` resolves against ProjectData.id values in GameProjectsData.ts and OtherProjectsData.ts (ids are unique kebab-case strings across both arrays)"
    - "Header centering moves from the shared `.main, .header, .footer` rule in App.vue to `.nav-bar` inside Header.vue — the header element itself must go full-bleed for the sticky bar to cover content at viewports wider than 1600px"
---

<objective>
Turn the project details modal into a real routed page, point every entry point (timeline cards, ProjectsList grid, Resume links) at it, and make the site header a sticky opaque bar.

Purpose: Today a project click opens `ProjectDetailsOverlay.vue` stacked over whatever the visitor was looking at — a fixed-position dialog glued to the current scroll position. It should be its own page with its own URL, so it starts at the top, is linkable/shareable, and browser back returns the visitor to where they were. Separately, the header is see-through while scrolling, which reads as unfinished.

Output: New `src/views/ProjectDetails.vue` routed view at `/project/:id`, router scroll behavior, all call sites navigating instead of toggling popup state, `ProjectDetailsOverlay.vue` removed, and a sticky opaque header.
</objective>

<execution_context>
@$HOME/.claude/gsd-core/workflows/execute-plan.md
@$HOME/.claude/gsd-core/templates/summary.md
</execution_context>

<context>
@.planning/STATE.md
@CLAUDE.md

@src/components/ProjectDetailsOverlay.vue
@src/router/index.ts
@src/css/projects.less
@src/data/ProjectData.ts
</context>

<key_facts>
Established by reading the current tree — treat as given, do not re-derive:

- `src/css/projects.less` nests **every** project-content style inside a single `.dialog-content { … }` block (plus one `.dialog-content h2` rule). That stylesheet is imported globally by `App.vue`, unscoped. The new view must keep a `.dialog-content` wrapper around the `v-html` output or all project HTML loses its styling.
- Router is default (hash) mode, `new VueRouter({ routes })`. STATE.md flags hash mode and `publicPath` as must-not-touch. Adding `scrollBehavior` does not change mode — that is the only router option being added.
- `OtherProjectsData.ts` currently exports an **empty array**, and `/other-projects` is no longer linked from the nav (nav goes to `/other-stuff`). `ProjectsList.vue` still needs rewiring for correctness, but it renders nothing today — do not expand its scope.
- Project ids in `GameProjectsData.ts`: `cpp-sokoban`, `drag-rush`, `dispater`, `floor-0`, `swing-space`. Unique kebab-case, no collision risk with the (empty) other-projects array — a single `/project/:id` route searching both arrays is correct.
- `Resume.vue` already links projects via `router-link :to="/game-projects?project=<id>"`, and `GameProjects.vue` `mounted()` reads `$route.query.project` to auto-open the modal. That query mechanism is what this change replaces.
- `App.vue` paints a **fixed-attachment** gradient on `html, body`: `linear-gradient(180deg, #2b123f 0%, #120818 45%, #000000 100%)`. Because it is viewport-fixed, the top of the viewport is always the `0%` stop — `#2b123f`. That is the correct opaque header color; `@bodyBgColor` (`#000000`) would render as a black bar that does not match.
- `App.vue` has a shared rule `.main, .header, .footer { max-width: 1600px; margin: 0 auto; }` inside the `min-width: 620px` media query. `.header` has no padding of its own; `.nav-bar` supplies `padding: 20px`. Moving the max-width/centering from `.header` to `.nav-bar` therefore preserves nav geometry exactly while letting the sticky bar span the full viewport.
- `Header.vue` already has a `.header--one-page` rule providing sticky + translucent background for `/one-page` only; once `.header` itself is sticky and opaque, that rule is redundant.
- `OnePage.vue` renders `GameProjects` and `Resume` as embedded sections. Their project links will navigate away from `/one-page` to the project page — that is expected and matches today's behavior (the Resume links already navigate away).
- No test suite exists. Verification = `npm run build`, `npm run lint`, targeted greps, and the human-verify checkpoint.
- Working tree already carries unrelated uncommitted edits in `src/data/GameProjectsData.ts` and `src/views/GameProjects.vue`. Build on top of that state; revert nothing.
</key_facts>

<tasks>

<task type="tracer">
  <name>Task 1: End-to-end project page — route, view, scroll behavior</name>
  <files>src/views/ProjectDetails.vue, src/router/index.ts</files>
  <read_first>src/components/ProjectDetailsOverlay.vue, src/css/projects.less, src/data/ProjectData.ts, src/router/index.ts</read_first>
  <action>
Create `src/views/ProjectDetails.vue` as a Vue 2 Options-API component via `Vue.extend()` with `name: "ProjectDetails"`, `<script lang="ts">`, matching the file conventions of the existing views.

Data/lookup:
- Import `gameProjectsData` from `@/data/GameProjectsData.ts`, `otherProjectsData` from `@/data/OtherProjectsData.ts`, and the `ProjectData` type from `@/data/ProjectData.ts`.
- Expose a computed `project(): ProjectData | undefined` that concatenates both arrays and finds the entry whose `id` equals `this.$route.params.id`.
- In `created`, if `project` is undefined call `this.$router.replace("/404")`. Guard the template with `v-if="project"` so nothing renders during that redirect.

Template — this is a page, not a dialog. Render, in order:
- An `<h2 class="dialog-title">` bound to `project.name`.
- A wrapper `<div class="dialog-content">` containing a child `<div v-html="project.htmlDescription">` and, after it, a `<div class="dialog-bottom">` holding a `<button type="button" class="dialog-close-button">` labelled Back.
- The `dialog-content` class name is load-bearing: it is the selector every project-content style in `src/css/projects.less` is nested under. Keep the same element nesting the overlay used (wrapper div, then an inner div holding the raw HTML).
- No backdrop element, no `role="dialog"`, no `aria-modal`, no corner close icon — it is no longer a modal.

Behavior:
- Method `goBack()`: if `window.history.length > 1` call `this.$router.back()`, otherwise `this.$router.push("/game-projects")`. Wire it to the Back button.
- Preserve the familiar Escape-to-dismiss affordance: add the `keydown` listener in `mounted` and remove it in `beforeDestroy`, calling `goBack()` on the Escape key. Follow the same handler shape the overlay used.

Styles (`<style scoped>`): port the overlay's `.dialog-title`, `.dialog-content`, `.dialog-bottom`, `.dialog-close-button` rules and the `iframe { width: 100% }` rule verbatim so the panel looks unchanged, and port the `min-width: 620px` media query for title size and content padding. Apply the old `.dialog` panel styles (black background, white text, `max-width: 1000px`, centered with `margin: 0 auto`) to the page root instead — but drop `position: fixed`, the `top`/`left`/`right` offsets, `max-height`, and `overflow-y`, since the page scrolls in the document flow now. Keep the black title bar and the `linear-gradient(180deg, #000000 0%, #120818 45%, #2b123f 100%)` content background exactly as they are.

Router (`src/router/index.ts`):
- Register a route `path: "/project/:id"`, `name: "Project Details"`, lazily loaded with a dynamic `import()` and a `webpackChunkName` comment, matching the style of the neighboring route entries. Place it above the `/404` and `*` entries.
- Add a `scrollBehavior(to, from, savedPosition)` option to the `new VueRouter({ … })` call, alongside `routes`. When `savedPosition` is truthy, return a Promise that resolves it after roughly 250ms so the 0.2s fade transition in `App.vue` has finished and the restored page has its full height; otherwise return `{ x: 0, y: 0 }`. Leave the router in default hash mode — add no `mode` or `base` option.
  </action>
  <verify>
    <automated>cd "D:/Kodning/Portfolio/gamedev-portfolio" && npm run build && npm run lint && test -f src/views/ProjectDetails.vue && grep -c 'dialog-content' src/views/ProjectDetails.vue && grep -c '/project/:id' src/router/index.ts && grep -c 'scrollBehavior' src/router/index.ts && grep -c "params.id" src/views/ProjectDetails.vue</automated>
    <human-check>Load `#/project/drag-rush` directly in the browser: the Drag Rush write-up renders top-of-page with its usual styling (paragraphs, screenshots, collapsible Technical Overview / Postmortem sections). Load `#/project/does-not-exist`: lands on the 404 page.</human-check>
  </verify>
  <done>Visiting `#/project/<id>` for any id in GameProjectsData renders the full project write-up as its own page, scrolled to top and styled identically to the old modal; an unknown id redirects to /404; build and lint pass.</done>
</task>

<task type="auto">
  <name>Task 2: Point every entry point at the route, retire the overlay component</name>
  <files>src/views/GameProjects.vue, src/components/ProjectsList.vue, src/views/Resume.vue, src/components/ProjectDetailsOverlay.vue</files>
  <read_first>src/views/GameProjects.vue, src/components/ProjectsList.vue, src/views/Resume.vue</read_first>
  <action>
`src/views/GameProjects.vue`:
- Keep the method name `showDetails(item: ProjectData)` so the six existing template call sites stay untouched; replace its body with `this.$router.push("/project/" + item.id)`. Drop the manual `window.scrollTo(0, 0)` — the router's scroll behavior from Task 1 handles it now.
- Delete the overlay element from the template, the overlay import, its entry in `components`, and the `showPopup` / `popupTitle` / `popupColor` / `popupContent` data properties. Leave every other data property (`projects`, `projectRows`, `thumbVideos`, `thumbPosters`, `summaries`) and the `wipProject` / `timelineProjects` computed properties exactly as they are — including the uncommitted local edits already in the file.
- Replace the `mounted()` body so the retired `?project=` deep link still resolves: if `this.$route.query.project` is a string that matches a known project id, call `this.$router.replace("/project/" + id)`; otherwise do nothing. This keeps any previously shared link working.

`src/components/ProjectsList.vue`:
- Same treatment: `showDetails` becomes a router push to `/project/<id>`; remove the overlay element, import, `components` entry, and the four popup data properties; remove the `window.scrollTo(0, 0)` call. Also delete the commented-out `if (event)` block sitting inside `showDetails` while you are editing that method. Leave the grid markup and styles alone.

`src/views/Resume.vue`:
- Change the `router-link` in the Selected Projects section from the query-string target to `` :to="`/project/${project.id}`" ``. Nothing else in the file changes — no new UI, no copy changes.

Finally delete `src/components/ProjectDetailsOverlay.vue`. Its rendering logic now lives in `ProjectDetails.vue` and git history preserves the original. Leave no commented-out or stubbed references to the deleted component behind in any file.
  </action>
  <verify>
    <!-- planner-discipline-allow: ProjectDetailsOverlay -->
    <automated>cd "D:/Kodning/Portfolio/gamedev-portfolio" && test ! -f src/components/ProjectDetailsOverlay.vue && test $(grep -rl "components/ProjectDetailsOverlay.vue" src/ | wc -l) -eq 0 && test $(grep -rc "showPopup" src/views/GameProjects.vue src/components/ProjectsList.vue | grep -cv ':0$') -eq 0 && grep -c '/project/' src/views/GameProjects.vue && grep -c '/project/' src/components/ProjectsList.vue && grep -c 'project/\${project.id}' src/views/Resume.vue && npm run build && npm run lint</automated>
  </verify>
  <done>No component imports the deleted overlay and the file is gone; clicking a timeline thumbnail, title, or View Details cue pushes `/project/<id>`; Resume project links target `/project/<id>`; an old `#/game-projects?project=<id>` URL redirects to the new page; build and lint pass.</done>
</task>

<task type="auto">
  <name>Task 3: Sticky opaque header bar</name>
  <files>src/css/variables.less, src/components/Header.vue, src/App.vue</files>
  <read_first>src/components/Header.vue, src/App.vue, src/css/variables.less</read_first>
  <action>
`src/css/variables.less`: add a variable `@headerBgColor` set to `#2b123f`, the `0%` stop of the fixed-attachment page gradient in `App.vue`. Because that gradient is viewport-fixed, this value is exactly what the top of the viewport paints at every scroll position, so the bar blends seamlessly. Leave the existing variables unchanged.

`src/App.vue`: in the `min-width: 620px` media query, narrow the shared max-width rule so it applies to `.main` and `.footer` only. The header's centering moves into the component in the next step; leave the 1600px value and `margin: 0 auto` for the two remaining selectors as they are.

`src/components/Header.vue`:
- Give the base `.header` rule `position: sticky`, `top: 0`, `z-index: 10`, and `background: @headerBgColor`, keeping its existing `width: 100%`. The bar must span the full viewport width so nothing scrolls past it in the side gutters on displays wider than 1600px.
- Inside a new `min-width: 620px` media query, give `.nav-bar` `max-width: 1600px` and `margin: 0 auto` — this restores the exact horizontal placement the removed App.vue selector provided (`.header` had no padding of its own, `.nav-bar` supplies the 20px).
- Remove the now-redundant `.header--one-page` style rule and the `:class` binding that applies it on the root element, since the base header now provides sticky positioning and an opaque background on every route. Keep the `isOnePage` computed property and the `v-if`/`v-else` nav branch it drives — those are still in use.
- Do not touch the mascot logic, the section-observer methods, or the `max-width: 620px` media query.
  </action>
  <verify>
    <!-- planner-discipline-allow: header--one-page -->
    <automated>cd "D:/Kodning/Portfolio/gamedev-portfolio" && grep -c '@headerBgColor' src/css/variables.less && grep -c 'position: sticky' src/components/Header.vue && grep -c 'background: @headerBgColor' src/components/Header.vue && test $(grep -c 'header--one-page' src/components/Header.vue) -eq 0 && test $(grep -c 'header--one-page' src/App.vue) -eq 0 && npm run build && npm run lint</automated>
    <human-check>Scroll the Projects page: the nav bar stays pinned at the top and no project imagery or text is visible through it. The bar's color matches the background at the top of the page (no visible seam when scrolled to the very top). Check `#/one-page` too — its nav still shows the four scroll buttons with active-state underline.</human-check>
  </verify>
  <done>The header is sticky on every route with a solid `@headerBgColor` background that fully hides content passing beneath it, nav item placement is unchanged, the /one-page scroll nav still works, and build and lint pass.</done>
</task>

<task type="checkpoint:human-verify" gate="blocking">
  <what-built>
Project details moved out of the stacked modal into a real page at `#/project/<id>`, reachable from the Projects timeline, the ProjectsList grid, and the Resume "Selected Projects" links. Router now scrolls new navigations to the top and restores the saved position on back. Header is a sticky opaque bar on all routes.
  </what-built>
  <how-to-verify>
Run `npm run serve` and check:

1. **Timeline → page:** On `#/game-projects`, scroll down to SwingSpace and click its thumbnail. You should land on a fresh page at `#/project/swing-space` showing the full write-up from the top — not a dialog over the timeline. Confirm the title bar, screenshots, videos, and the collapsible Technical Overview / Postmortem sections look the same as they did in the old popup.
2. **Back restores position:** Press the browser Back button (and separately, the Back button at the bottom of the project page). You should return to `#/game-projects` at the SwingSpace row, not at the top.
3. **All three click targets:** On a timeline row, the thumbnail, the project title, and the "View Details" cue should all reach the same project page.
4. **Resume links:** On `#/resume`, click a project name under Selected Projects — it should open that project's page directly.
5. **Old link still works:** Paste `#/game-projects?project=dispater` into the address bar; it should land on the Dispater project page.
6. **Bad id:** Paste `#/project/nope` — it should land on the 404 page, not a blank one.
7. **Header:** Scroll any long page. The nav bar stays pinned to the top and content passing under it is fully hidden. At the very top of the page the bar should be indistinguishable from the background (no color seam). Check on a narrow window too.
8. **One-page route:** `#/one-page` still shows the scroll-button nav with the active underline and swapping mascot.
  </how-to-verify>
  <resume-signal>Type "approved" or describe what looks wrong</resume-signal>
</task>

</tasks>

<threat_model>
## Trust Boundaries

| Boundary | Description |
|----------|-------------|
| URL → app | Visitor-controlled `:id` route param and `?project=` query value enter the app |
| Static data → DOM | Author-written `htmlDescription` strings are injected with `v-html` |

## STRIDE Threat Register

| Threat ID | Category | Component | Severity | Disposition | Mitigation Plan |
|-----------|----------|-----------|----------|-------------|-----------------|
| T-PNQ-01 | Tampering | `ProjectDetails.vue` `v-html` | low | accept | Content is author-written static markup compiled into the bundle, not visitor input. Unchanged from the existing overlay — this change moves the same render, it does not widen the boundary. |
| T-PNQ-02 | Information disclosure | `/project/:id` param handling | low | mitigate | The param is only used as an array `find` key; unmatched ids `replace()` to `/404`. It is never used to build a URL, evaluated, or written to the DOM. |
| T-PNQ-03 | Tampering | Dependency supply chain | low | accept | No package installs in this plan — no new dependencies added. |
</threat_model>

<verification>
- `npm run build` completes without errors after each task
- `npm run lint` reports no new errors
- Manual browser pass per the checkpoint above
</verification>

<success_criteria>
- Project details render as a routed page at `#/project/<id>`, starting at the top, with content and styling identical to the retired modal
- Timeline cards, ProjectsList grid items, and Resume project links all navigate to that page; the legacy `?project=` link redirects to it
- `ProjectDetailsOverlay.vue` is deleted and unreferenced
- Header is sticky and opaque on every route, with unchanged nav placement and a working `/one-page` scroll nav
- Human-verify checkpoint approved
</success_criteria>

<output>
Create `.planning/quick/260801-pnq-split-projectdetailsoverlay-into-separat/260801-pnq-SUMMARY.md` when done
</output>
