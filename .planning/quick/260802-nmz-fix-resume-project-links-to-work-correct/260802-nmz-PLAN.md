---
phase: quick-260802-nmz
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - src/views/Resume.vue
autonomous: false
requirements: [QUICK-260802-NMZ]

must_haves:
  truths:
    - "On standalone `#/resume`, clicking a project name under Selected Projects opens that project's write-up as a modal overlay layered over the resume — the URL stays `#/resume` and the page behind does not move"
    - "On `#/one-page`, clicking a project name in the embedded resume section opens the same overlay in place — the visitor is never navigated away from `#/one-page`, the stacked scroll position is preserved, and the section scroll-nav in the header stays intact"
    - "Closing the overlay (corner X, bottom Close button, or Escape) leaves the visitor at the exact scroll position they clicked from, in both contexts"
    - "The overlay shows the same title, accent colour, and HTML write-up as the equivalent card on the Projects timeline, because both read the same `GameProjectsData` entry — no project copy is duplicated into Resume"
    - "The Selected Projects entries look and behave visually identical to before: same Russo One face, same size, same underline, dimmed at rest and brightened on hover and keyboard focus, with a visible focus ring"
    - "A Selected Projects entry whose id has no match in the project data opens nothing at all, rather than an empty black dialog"
    - "`GameProjects.vue` is not modified, so its legacy query-param deep-link handler still opens the overlay for any previously shared link"
  artifacts:
    - src/views/Resume.vue
  key_links:
    - "Resume's local `projects` array ids must match the first argument of the `new ProjectData(...)` calls in `src/data/GameProjectsData.ts` — `drag-rush`, `dispater`, `floor-0`, `swing-space`. These match today; a silent drift makes a link a dead click with no error"
    - "`App.vue` styles every anchor globally with `color: @textColor; opacity: 0.5;`, and the existing `.project-entry-link:hover` rule is what returns it to `opacity: 1`. A `<button>` inherits none of that, so unless the scoped rule restores `color: inherit` and `opacity: 0.5` the entries render brighter and in the browser's default button colour — a visible regression that no grep will catch"
    - "The write-up markup must stay wrapped in the overlay component's `.dialog-content` element — every project-content style in `src/css/projects.less` is nested under `.dialog-content`. Reuse `ProjectDetailsOverlay.vue`; do not hand-roll a second dialog inside Resume"
    - "A `position: fixed` overlay only pins to the viewport if no ancestor creates a containing block. `App.vue`'s page transition animates `opacity` alone (no `transform`/`filter`) and `OnePage.vue`'s section wrapper sets only margins, padding, border, and `scroll-margin-top` — and `GameProjects.vue`'s overlay already proves this works at the same DOM depth inside OnePage"
---

<objective>
Make the Resume page's Selected Projects links open the project write-up in place, so they work identically whether Resume is visited standalone at `#/resume` or embedded as the resume section of `#/one-page`.

Purpose: Resume currently links each project as a query-string deep link into the projects route, and relies on `GameProjects.vue`'s `mounted()` hook to notice the parameter and open the overlay. That works standalone. It breaks the one-page experience: `OnePage.vue` embeds Resume as its `#resume` section, so clicking a project there performs a full route navigation off `#/one-page` to `#/game-projects` — the visitor is thrown out of the stacked page they were scrolling. Owning the overlay locally removes the navigation entirely, which is correct in both contexts rather than only one.

Output: `src/views/Resume.vue` holding its own popup state and its own `ProjectDetailsOverlay` instance, exactly the way `GameProjects.vue` and `ProjectsList.vue` already do, with the Selected Projects entries visually unchanged.
</objective>

<execution_context>
@$HOME/.claude/gsd-core/workflows/execute-plan.md
@$HOME/.claude/gsd-core/templates/summary.md
</execution_context>

<context>
@.planning/STATE.md
@CLAUDE.md

@src/views/Resume.vue
@src/views/GameProjects.vue
@src/components/ProjectsList.vue
@src/components/ProjectDetailsOverlay.vue
@src/views/OnePage.vue
</context>

<key_facts>
Established by reading the current tree — treat as given, do not re-derive:

- **The pattern to copy already exists twice.** `ProjectsList.vue` is the cleanest reference: it imports `ProjectDetailsOverlay`, keeps four popup properties in `data()` (`showPopup` / `popupTitle` / `popupColor` / `popupContent`), sets them in a `showDetails(item)` method, and renders one overlay element bound with `@close="showPopup = false"`. `GameProjects.vue` does the same. Overlay state living in the entry-point component is the house pattern here — there is no store, and this plan must not introduce one.
- **This deliberately reverses a decision from the previous quick task.** `260801-qi1`'s plan states "Resume needs no overlay of its own… Resume stays a pure static page with zero popup state," and explicitly reasoned that a Resume link inside OnePage navigating away to the projects page was acceptable "exactly as it did before 260801-pnq." The user has since decided it is not acceptable — the one-page nav is the experience being built. The new constraint (Resume is embedded, not just routed to) is what invalidates the old reasoning.
- **`Resume.vue` currently holds no `components`, no `methods`, and no router usage.** Its `<script>` is a bare `Vue.extend` with `name` and `data`. All three of those options need to be added; only `data` is being extended.
- **Resume's project ids already match the data file.** `Resume.vue`'s local `projects` array uses `drag-rush`, `dispater`, `floor-0`, `swing-space`. `src/data/GameProjectsData.ts` defines `cpp-sokoban`, `drag-rush`, `dispater`, `floor-0`, `swing-space`. All four resolve. `cpp-sokoban` is intentionally absent from the resume list — do not add it.
- **Resume's local project copy is hand-written and stays.** The `meta` ("Unity · C# · 8wk · team of 6") and `summary` strings in Resume are resume-voice, deliberately different from the timeline summaries in `GameProjects.vue`. Only the overlay content is sourced from `GameProjectsData`. Do not "dedupe" the arrays.
- **The link is an anchor today, and anchors are globally dimmed.** `App.vue` declares `a { color: @textColor; text-decoration: none; opacity: 0.5; }` plus `a:hover, .router-link-exact-active { opacity: 1 }`. The scoped `.project-entry-link` rule in Resume adds only font, size, border-bottom, and transition — it never sets colour or resting opacity, because the global anchor rule supplies both. Converting the element to a `<button>` silently drops both. `GameProjects.vue`'s `.project-title-link` is the worked example of a button styled back into a link.
- **Focus rings are already handled globally.** `App.vue` has `a:focus-visible, button:focus-visible { opacity: 1; outline: 2px solid lighten(@accentColor, 25%); outline-offset: 3px; }` — buttons are covered. Do not add a bespoke focus style.
- **`.project-entry-link` is not in `App.vue`'s Russo One selector list** (that list carries `h1`–`h5`, `.header`, `.footer`, `.project-title-link`, `.nav-bar a`). Resume's own scoped rule sets the font face, so it survives the element change as long as that rule is kept.
- **The overlay needs no changes.** `ProjectDetailsOverlay.vue` is already `position: fixed` at `z-index: 20/21` (above the sticky header's `z-index: 10`), already closes on X / Close / Escape, and already wraps the `v-html` in `.dialog-content`. Two instances existing on the page at once (GameProjects' and Resume's, inside OnePage) is fine — each is driven by its own `visible` prop and only renders anything when true.
- **`GameProjects.vue`'s legacy deep-link handler is staying.** Its `mounted()` reads the project query parameter and opens the overlay. After this change nothing in `src/` generates such a link any more, but bookmarked or shared ones may exist, so the handler is kept for backwards compatibility. `GameProjects.vue` must come out of this task byte-identical.
- **Working tree state.** `src/data/GameProjectsData.ts` carries unrelated uncommitted edits (a `cpp-sokoban` entry). Do not stage or revert them. `src/views/GameProjects.vue` is committed clean — that is what the untouched-file gate asserts against.
- No test suite exists. Verification = `npm run build`, `npm run lint`, targeted greps, and the human-verify checkpoint.
</key_facts>

<tasks>

<task type="tracer" tdd="false">
  <name>Task 1: Give Resume its own in-place project overlay</name>
  <files>src/views/Resume.vue</files>
  <read_first>src/views/Resume.vue, src/components/ProjectsList.vue, src/views/GameProjects.vue, src/components/ProjectDetailsOverlay.vue, src/App.vue</read_first>
  <reversibility rating="reversible">Single-file, additive change to one view; reverting is a one-commit revert and the shared overlay component is untouched.</reversibility>
  <behavior>
    - Clicking "Drag Rush" on `#/resume` sets `showPopup` true and renders the Drag Rush write-up in the dialog; the URL is unchanged.
    - Clicking "Drag Rush" in the resume section of `#/one-page` does the same, and the route stays `#/one-page`.
    - `showDetails("not-a-real-id")` leaves `showPopup` false and mutates no popup content.
    - Pressing Escape while the dialog is open emits `close` and sets `showPopup` back to false.
  </behavior>
  <action>
**Step 1 — script block.**

- Import `ProjectDetailsOverlay` from `@/components/ProjectDetailsOverlay.vue`, the default-exported project array from `@/data/GameProjectsData.ts`, and the `ProjectData` type from `@/data/ProjectData.ts`. Register the overlay in a `components` option — this component has none today, so add one between `name` and `data`, matching how `ProjectsList.vue` orders its options.
- Extend the object returned by `data()` with the same four popup properties the other two entry points use: a boolean visibility flag defaulting to `false`, and title / colour / content strings. Use the established names `showPopup`, `popupTitle`, `popupColor`, `popupContent`, and keep `popupColor`'s house default of `"#000000"`. Leave the existing `projects`, `experience`, `education`, `techStack`, and `personal` arrays byte-identical — their copy is resume-voice and is not being merged with the project data.
- Add a `methods` option (also absent today) containing `showDetails(id: string)`. It looks the id up in the imported project array with `find`, **returns early and changes nothing when there is no match**, and otherwise assigns `popupTitle` from the entry's `name`, `popupColor` from its `accentColor`, and `popupContent` from its `htmlDescription` before flipping the visibility flag to `true`. The early return is load-bearing: without it a drifted id opens a black dialog with an empty title and no content, which looks like a site bug rather than a dead link.
- This component must not read, write, or push any router state — no navigation, no programmatic redirect, no reading of URL parameters. Removing that navigation is the entire point of the task.
- Do not perform any scroll manipulation in `showDetails`. The overlay is `position: fixed` and pins itself to the viewport; the visitor's place on the page is what must be preserved, and `260801-qi1` removed a scroll reset for exactly this reason.

**Step 2 — template.**

- In the Selected Projects loop, the project name is currently a routed link element carrying a deep link into the projects route (around line 42). Replace that whole element with a plain button that calls the new method:
  `<button type="button" class="project-entry-link" @click="showDetails(project.id)">{{ project.name }}</button>`
  Keep the `class="project-entry-link"` and the `{{ project.name }}` interpolation exactly as shown, and drop the `:to` binding entirely. The enclosing `.project-entry-header` div, the `.project-meta` span, and the `.project-entry-summary` paragraph are untouched.
- Add one overlay element as the last child of the `.resume-page` root div, immediately after the closing tag of `<footer class="resume-footer">`. Bind it exactly the way `GameProjects.vue` binds its instance: `:visible`, `:title`, `:color`, and `:html-content` fed from the four popup properties, plus `@close` setting the visibility flag back to `false`.
- Change nothing else in the template. The download button, contact row, summary blockquote, experience / education / tech columns, Beyond the Code section, and footer all stay as they are.

**Step 3 — scoped styles: keep the entry looking identical.**

The entries are anchors today, so `App.vue`'s global `a { color: @textColor; opacity: 0.5; }` has been doing invisible work — it supplies both their colour and their dimmed resting state, and the existing `.project-entry-link:hover, .project-entry-link:focus-visible { opacity: 1; }` rule is what brightens them. A button inherits none of that and would render at full opacity in the browser's default button colour and font. Extend the **existing** `.project-entry-link` rule in the scoped block (do not add a second rule for the same selector) so it carries the button reset that `GameProjects.vue`'s `.project-title-link` already demonstrates:

- `margin: 0; padding: 0; border: 0;` — and then re-declare `border-bottom: 1px solid rgba(255, 255, 255, 0.35);` **after** the `border: 0` shorthand, or the underline is wiped out.
- `background: transparent;` and `color: inherit;` so it picks up `@textColor` from `#app` instead of the UA button colour.
- `opacity: 0.5;` to restore the resting dim the global anchor rule used to supply.
- `cursor: pointer; text-align: left; line-height: 1.2; touch-action: manipulation; -webkit-tap-highlight-color: transparent;` — the text-align matters because `#app` sets `text-align: justify`.
- Keep the rule's current `font-family`, `font-size: 1.3em`, and `transition` declarations as they are.

Leave the `:hover, :focus-visible` rule exactly as written — it already delivers `opacity: 1`, the `#f4cde6` colour, and the matching border colour. Add no bespoke focus outline: `App.vue` already gives `button:focus-visible` the accent ring.

**Out of scope — do not touch:**
- `src/views/GameProjects.vue`. Its `mounted()` deep-link handler stays for backwards compatibility with any shared link, even though nothing generates one after this change.
- `src/components/ProjectDetailsOverlay.vue`, `src/components/ProjectsList.vue`, `src/router/index.ts`, `src/views/OnePage.vue`.
- The uncommitted `cpp-sokoban` edits in `src/data/GameProjectsData.ts` — neither revert nor stage them.
  </action>
  <verify>
    <!-- planner-discipline-allow: opacity: 0.5 -->
    <automated>cd "D:/Kodning/Portfolio/gamedev-portfolio" && grep -c 'ProjectDetailsOverlay' src/views/Resume.vue && grep -c 'GameProjectsData' src/views/Resume.vue && grep -c 'showPopup' src/views/Resume.vue && grep -c 'popupContent' src/views/Resume.vue && grep -c 'class="project-entry-link"' src/views/Resume.vue && grep -c '@click="showDetails(project.id)"' src/views/Resume.vue && grep -c 'opacity: 0.5' src/views/Resume.vue && grep -c 'color: inherit' src/views/Resume.vue && grep -c 'Selected Projects' src/views/Resume.vue && grep -c 'Beyond the Code' src/views/Resume.vue && grep -c '<h1>Resume</h1>' src/views/Resume.vue && test $(grep -c 'game-projects?project=' src/views/Resume.vue) -eq 0 && test $(grep -c '\$route' src/views/Resume.vue) -eq 0 && test $(git diff --name-only -- src/views/GameProjects.vue src/components/ProjectDetailsOverlay.vue src/components/ProjectsList.vue src/router/index.ts src/views/OnePage.vue | wc -l) -eq 0 && grep -c 'query.project' src/views/GameProjects.vue && npm run build && npm run lint</automated>
    <human-check>On `#/one-page`, scroll down to the Resume section and click "Dispater" under Selected Projects. The write-up opens as a dialog over the one-page scroll, the address bar still reads `#/one-page`, and closing it puts you back on the Resume section exactly where you were — not at the top of the projects section.</human-check>
  </verify>
  <done>`Resume.vue` owns four popup properties, a `showDetails(id)` method that resolves ids against `GameProjectsData` and no-ops on a miss, and one `ProjectDetailsOverlay` instance; the Selected Projects names are buttons with no routed link and no router usage anywhere in the file; the scoped `.project-entry-link` rule restores the anchor's colour and resting opacity; `GameProjects.vue` and the other listed files are unmodified; build and lint pass.</done>
</task>

<task type="checkpoint:human-verify" gate="blocking">
  <what-built>
Resume's Selected Projects entries now open the project write-up in place instead of navigating. `Resume.vue` holds its own overlay state and its own `ProjectDetailsOverlay` instance — the same pattern `GameProjects.vue` and `ProjectsList.vue` already use — so the behaviour no longer depends on which route the resume is being rendered in. The names changed from links to buttons, restyled to look exactly as they did.

`GameProjects.vue` was left alone on purpose: its old query-parameter handler still works, so any deep link you previously shared or bookmarked keeps opening the right project, even though nothing on the site generates one now.

Deliberately **not** done, flag it here if you want it: the resume's own `meta` and `summary` copy for each project is still hand-written separately from the project data — only the overlay content is shared. And the page behind the overlay still is not scroll-locked (pre-existing, same as on the projects page).
  </what-built>
  <how-to-verify>
Run `npm run serve` and check both contexts — the whole point is that they now behave the same:

1. **The actual bug.** Go to `#/one-page`, scroll down into the Resume section, and click a project name under Selected Projects. It must open the write-up as a dialog on top of the one-page scroll. The address bar must still read `#/one-page` — you must not be thrown onto the projects page.
2. **Position preserved.** Close that dialog (X, the bottom Close button, and Escape — try all three). Each time you should be looking at the Resume section right where you clicked, with no scroll jump.
3. **The header nav on one-page.** After opening and closing an overlay from the resume section, the sticky section nav should still highlight "Resume" and the mascot should still be the resume one — the observer state should not have been disturbed.
4. **Standalone, no regression.** Go to `#/resume` directly and click each of the four project names. Each opens its own correct write-up in place, URL stays `#/resume`, and closing returns you to the same spot.
5. **Content correctness.** Open Drag Rush from the resume and confirm it is the full write-up — screenshots, videos, and the collapsible Technical Overview / Postmortem sections all rendering with their usual styling, identical to opening it from the projects timeline. Check that Floor Zero opens Floor Zero and not a neighbour.
6. **The links still look right.** Compare the Selected Projects names against how they looked before: same font, same size, same underline, same dimmed-until-hover feel. Hover one — it should brighten to the pink accent. Tab to one with the keyboard — you should get the accent focus ring, and Enter/Space should open the dialog.
7. **Nothing else moved.** The projects timeline's own "View Details" buttons, thumbnails, and titles still work as before, on both `#/game-projects` and inside `#/one-page`.
8. **Narrow window.** Shrink the browser below 620px and repeat step 1 — the button should still sit correctly in the entry header row next to its meta text.
  </how-to-verify>
  <resume-signal>Type "approved" or describe what looks wrong</resume-signal>
</task>

</tasks>

<threat_model>
## Trust Boundaries

| Boundary | Description |
|----------|-------------|
| Static data → DOM | Author-written `htmlDescription` strings from `GameProjectsData.ts` are injected with `v-html` inside the shared overlay, now also from a Resume-owned instance |
| URL → app | Pre-existing: a visitor-controlled project query value is read by `GameProjects.vue`'s `mounted()`. This plan removes the only in-app producer of that value but leaves the consumer intact |

## STRIDE Threat Register

| Threat ID | Category | Component | Severity | Disposition | Mitigation Plan |
|-----------|----------|-----------|----------|-------------|-----------------|
| T-NMZ-01 | Tampering | `v-html` render path in `ProjectDetailsOverlay.vue`, instantiated from `Resume.vue` | low | accept | Content is author-written static markup compiled into the bundle, never visitor input. This adds a second caller of an existing render path; it does not widen the boundary or introduce a new sink. |
| T-NMZ-02 | Elevation of privilege | `showDetails(id)` lookup in `Resume.vue` | low | mitigate | The id originates from a hardcoded local array, is used only as an equality key in an array `find` against a fixed dataset, and is never evaluated, used to build a URL, or written to the DOM. An unmatched id returns early and renders nothing. |
| T-NMZ-03 | Information disclosure | Removal of the query-string deep link | low | mitigate | Project selection stops appearing in the URL from the resume path, so nothing project-specific is written to browser history or referrer headers by these entries. Net reduction in exposure. |
| T-NMZ-SC | Tampering | npm/pip/cargo installs | low | accept | No package-manager installs in this plan — no new dependencies added, no lockfile change. |
</threat_model>

<verification>
- `npm run build` completes without errors
- `npm run lint` reports no new errors
- `git diff --name-only` lists `src/views/Resume.vue` as the only changed file under `src/views/` and `src/components/` (`src/data/GameProjectsData.ts` stays dirty from unrelated prior work and is expected)
- `grep -c 'query.project' src/views/GameProjects.vue` is non-zero — the legacy deep-link handler survived
- Manual browser pass per the checkpoint above, covering both `#/resume` and `#/one-page`
</verification>

<success_criteria>
- Clicking a Selected Projects entry opens the project overlay in place with no route change, from both `#/resume` and the resume section of `#/one-page`
- Closing the overlay returns the visitor to the exact scroll position they clicked from, in both contexts
- Overlay content is sourced from `GameProjectsData` so it matches the projects timeline exactly, with no duplicated write-up copy in Resume
- An id with no matching project opens nothing instead of an empty dialog
- The Selected Projects entries are visually and interactively indistinguishable from before: dimmed at rest, accent on hover, accent focus ring on keyboard focus, Enter/Space activates
- `GameProjects.vue`, `ProjectDetailsOverlay.vue`, `ProjectsList.vue`, `router/index.ts`, and `OnePage.vue` are unmodified, and the legacy query-param deep link still works
- No store, no new route, no new dependency introduced
- Unrelated uncommitted edits in `src/data/GameProjectsData.ts` survive intact
- Human-verify checkpoint approved
</success_criteria>

<output>
Create `.planning/quick/260802-nmz-fix-resume-project-links-to-work-correct/260802-nmz-SUMMARY.md` when done
</output>
