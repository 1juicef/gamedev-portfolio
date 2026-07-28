---
phase: quick-260728-mvn
plan: 01
type: execute
wave: 1
depends_on: []
autonomous: false
requirements: [QUICK-260728-MVN]
files_modified:
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

must_haves:
  truths:
    - "No request for a nonexistent stylesheet or an unused Google webfont is made on page load."
    - "Every interactive control on the site (project cards, modal close controls) is reachable and activatable by keyboard alone."
    - "The project detail modal announces itself as a dialog, is labelled by its title, and closes on Escape."
    - "Heading levels inside project detail content descend without skipping a level."
    - "Keyboard focus is visually distinguishable from resting and hover states on links and buttons."
    - "Every anchor that opens a new tab uses a well-formed target with rel noopener noreferrer."
    - "The resume image and hero avatar reserve their space before load (no layout shift)."
    - "The /other-projects route renders without console errors after placeholder projects are removed."
    - "The project detail modal remains fully readable and scrollable to its Close button on both mobile and desktop widths."
    - "npm run build succeeds and npm run lint reports no new errors."
  artifacts:
    - src/components/ProjectDetailsOverlay.vue
    - src/components/ProjectsList.vue
    - src/App.vue
    - src/data/OtherProjectsData.ts
  key_links:
    - "ProjectDetailsOverlay scoped selectors h1.dialog-title / a.dialog-close-button must be retargeted when those tags change, or the dialog loses its styling."
    - "projects.less .dialog-content h3 must be retargeted to h2 with h3's UA metrics, or the About-this-game heading changes size."
    - "The .dialog rule switching from absolute to fixed removes document-scroll access to long modal content unless the dialog scrolls internally."
    - "OtherProjectsData must keep its ProjectData import in use, or lint/TS flags an unused import."
---

<objective>
Fix 12 HTML/CSS/accessibility defects found in a senior-dev review of the portfolio, grouped into atomic commits by concern, without changing any real project copy or touching the 404 page.

Purpose: Remove dead requests, make every interactive control keyboard-operable, correct heading semantics, and eliminate layout shift — the "professional within a 10-second scan" bar in PROJECT.md applies to keyboard and assistive-tech users too.
Output: 8 focused commits across 11 files, verified by a clean `npm run build`, a clean `npm run lint`, and a browser pass.
</objective>

<execution_context>
@$HOME/.claude/gsd-core/workflows/execute-plan.md
</execution_context>

<context>
@.planning/STATE.md
@CLAUDE.md
@.claude/CLAUDE.md
</context>

<facts_established_during_planning>
These were verified against the working tree during planning. Trust them; do not re-derive.

- `src/data/GameProjectsData.ts` contains exactly four project-content headings — `<h3>About this game</h3>` at lines 27, 146, 220, 289. There are **no `<h4>` tags anywhere in the file**, so no h4-to-h5 bump is needed. The "Postmortem" and "Technical Overview" section headers are `<summary>` elements inside `<details>`, not headings — leave them alone.
- `src/css/projects.less` has exactly one heading selector: `.dialog-content h3 { text-align: center; }` at line 189.
- Browser UA defaults: `h3` is `font-size: 1.17em; margin: 1em 0`, `h2` is `font-size: 1.5em; margin: 0.83em 0`. Both are bold. A bare h3-to-h2 swap therefore **enlarges** the heading unless the h3 metrics are re-applied.
- `src/App.vue` global `h1 { font-size: 2.5em; margin-*: ...; line-height: 1.1em; }` currently applies to the modal title. The scoped rule `h1.dialog-title` overrides font-size and margin but **not** `line-height`. Retagging the title to `h2` therefore drops `line-height: 1.1em` unless it is added back explicitly.
- The modal's "Close" text control is currently an `<a>`, so it inherits the global `a { opacity: 0.5 }` and `a:hover { opacity: 1 }`. A `<button>` does not — those must be replicated to keep the look identical.
- Real image dimensions: `public/img/actualResume.png` is **2478x3522**; `public/img/avatar.png` is **512x512**.
- `@accentColor` is `#6C3BAA` (`src/css/variables.less`). At full strength it is too dark for a focus ring against the near-black page gradient, so the ring uses `lighten(@accentColor, 25%)`.
- `Footer.vue` already uses the `<style scoped lang="less">` + `@import '../css/variables.less';` pattern — reuse it if a component stylesheet needs a variable.
- Anchors that open new tabs and still lack `rel`: `Footer.vue:4` (which also has the malformed target value), `Contact.vue:11,15,19,23`, `GameProjectsData.ts:35,156,227` (itch.io badges). The two game-jam anchors in `GameProjects.vue:56-67` and the six screenshot anchors in `GameProjectsData.ts` already have `rel` — leave them.
- `src/data/OtherProjectsData.ts` is 100% template boilerplate (project-6 through project-9) and is the **only** consumer of `ProjectsList.vue`. Deleting its entries makes `/other-projects` render zero cards, so the `ProjectsList.vue` changes in Tasks 3 and 8 are code-level/build-verified only, not visually verifiable.
- No source file references the `M PLUS 1` webfont — the `public/index.html` Google Fonts link is dead. The Font Awesome CDN link in the same file **is** live (`fa fa-times`, `fa fa-linkedin`, ...) — keep it.
- `vue-cli-service lint` **auto-fixes files in place** by default. Always run the check as `npm run lint -- --no-fix` so verification does not silently rewrite source.
</facts_established_during_planning>

<tasks>

<task type="auto">
  <name>Task 1: Remove the dead stylesheet request and the unused webfont</name>
  <files>src/App.vue, public/index.html</files>
  <action>
In `src/App.vue`, delete the stray stylesheet `<link>` element sitting in the template at line 4 (its href points into a nonexistent `assets` path that webpack aliases never resolve inside template attribute strings, so it 404s on every page load) along with the blank line above it. The stylesheet it pretends to load is already correctly imported in the `<style>` block at line 40 — nothing replaces it.

In `public/index.html`, delete the Google Fonts `<link>` at line 10 (the M PLUS 1 webfont). It is render-blocking and no rule in the codebase uses that family; the site self-hosts Lekton and Russo One via `@font-face`. Keep the Font Awesome CDN `<link>` immediately below it — its icons are in active use.

Commit as `chore(quick-260728-mvn): remove dead stylesheet link and unused webfont`.
  </action>
  <verify>
    <automated>cd "D:/Kodning/Portfolio/gamedev-portfolio" && test "$(grep -c 'assets/projects' src/App.vue)" = "0" && test "$(grep -c 'googleapis' public/index.html)" = "0" && test "$(grep -c 'font-awesome' public/index.html)" = "1" && echo PASS</automated>
  </verify>
  <done>Neither file requests a nonexistent stylesheet or the M PLUS 1 webfont; the Font Awesome link is intact.</done>
</task>

<task type="auto">
  <name>Task 2: Delete placeholder /other-projects content</name>
  <files>src/data/OtherProjectsData.ts</files>
  <action>
Per explicit user decision, remove all four template-boilerplate entries (`project-6` "Sultans Of Sing", `project-7` "Drew Blood", `project-8` "The Art of Walking", `project-9` "Nikolable") — fake copy, dead `github.com/yourself` links, and broken `fakeimg.pl` screenshot URLs.

Replace the file body with an empty but still-typed export so the `ProjectData` import stays in use (an unused import would trip lint/TS strict):

- keep the existing `import ProjectData from '@/data/ProjectData.ts'` line verbatim
- declare `const otherProjects: ProjectData[] = []`
- `export default otherProjects`

Do **not** add empty-state UI, and do **not** edit the intro copy in `src/views/OtherProjects.vue`. A `v-for` over an empty array renders nothing, so no guard is required — only add one if the browser check in Task 9 surfaces an actual error.

Leave the now-orphaned placeholder images in `public/img/projects/` untouched (asset cleanup was not requested).

Commit as `chore(quick-260728-mvn): remove placeholder other-projects entries`.
  </action>
  <verify>
    <automated>cd "D:/Kodning/Portfolio/gamedev-portfolio" && test "$(grep -c 'new ProjectData' src/data/OtherProjectsData.ts)" = "0" && test "$(grep -c 'fakeimg' src/data/OtherProjectsData.ts)" = "0" && grep -q 'ProjectData\[\]' src/data/OtherProjectsData.ts && grep -q "import ProjectData" src/data/OtherProjectsData.ts && npm run lint -- --no-fix</automated>
  </verify>
  <done>OtherProjectsData exports a typed empty array, no placeholder entries or fake image URLs remain, and lint passes with the import still used.</done>
</task>

<task type="auto">
  <name>Task 3: Make /other-projects grid cards keyboard-operable</name>
  <files>src/components/ProjectsList.vue</files>
  <action>
The `.project-item` wrapper is a `<div>` with `@click` — no tabindex, no role, no keydown handler, so it is unreachable by keyboard. Convert it to a real `<button>`, matching the precedent already set in `src/views/GameProjects.vue` (`<button class="project-image-button">` / `<button class="project-title-link">`).

Template: change the opening `<div ... class="project-item" ...>` (lines 5-9) to a `<button>` carrying `type="button"` plus the identical `:key`, `@click="showDetails(project)"`, `class="project-item"` and `:class` bindings, and change its matching closing tag (line 17) to `</button>`. Leave the nested `.project-item-image` / `.title-bar` markup and the `showDetails` method untouched.

Styles: add a minimal reset to the existing `.project-item` rule so it renders identically to the old div — `border: none; background: none; padding: 0; display: block; color: inherit; text-align: left;` and `font: inherit;`. The last one is essential: without it `.title-text` falls back to the browser's default button font and size. Keep every existing declaration in that rule and in the desktop media-query override exactly as-is (including `height: 300px`, `width: 100%`, `margin-bottom: 20px`, `cursor: pointer`, `position: relative`, `overflow: hidden`).

Do **not** add a per-component `:focus-visible` rule — a shared global focus ring covering links and buttons lands in Task 6.

Note: `/other-projects` renders zero cards after Task 2, so this change is verified by build and code inspection rather than visually.

Commit as `fix(quick-260728-mvn): make project grid cards keyboard-accessible`.
  </action>
  <verify>
    <automated>cd "D:/Kodning/Portfolio/gamedev-portfolio" && test "$(grep -c '<button' src/components/ProjectsList.vue)" = "1" && test "$(grep -c '</button>' src/components/ProjectsList.vue)" = "1" && grep -q 'font: inherit' src/components/ProjectsList.vue && npm run lint -- --no-fix</automated>
  </verify>
  <done>The project card is a `<button type="button">` with the same classes, click behavior and rendered appearance; lint passes.</done>
</task>

<task type="auto">
  <name>Task 4: Fix project modal semantics, close controls, and Escape handling</name>
  <files>src/components/ProjectDetailsOverlay.vue</files>
  <action>
Template changes:
- Add `role="dialog"`, `aria-modal="true"` and `aria-labelledby="dialog-title"` to the outer `.dialog` element (line 6).
- Retag the title (line 7) from `<h1 class="dialog-title">` to `<h2 id="dialog-title" class="dialog-title">` — the page underneath already owns the `<h1>`. Keep the class name unchanged.
- Replace the icon close control (line 8), currently a clickable `<div>`, with `<button type="button" class="dialog-close" aria-label="Close" @click="$emit('close')">` wrapping the same unchanged `<i class="fa fa-times fa-lg fa-fw"></i>`.
- Replace the bottom close control (line 12), currently an `<a>` with no href, with `<button type="button" class="dialog-close-button" @click="$emit('close')">Close</button>`.

Script changes (Vue 2 Options API, keep `Vue.extend`): add an `onKeydown(event: KeyboardEvent)` method that emits `close` when `event.key` is `Escape`; add a `watch` on the `visible` prop that attaches that handler to `document` on `keydown` when it becomes true and detaches it when it becomes false; add a `beforeDestroy` hook that detaches it as well. The component stays mounted while hidden (the `v-if` lives inside its own template), so a mounted-only listener would fire while the modal is closed — the watcher is what scopes it to the open state.

Style changes (all in the scoped block); the goal is pixel-identical rendering:
- Retarget `h1.dialog-title` to `h2.dialog-title` in **both** places — the base rule at line 60 and the desktop media-query rule at line 110.
- Add `line-height: 1.1em;` to the base `h2.dialog-title` rule. The title previously inherited that from the global `h1` rule in App.vue; as an `h2` it would otherwise fall back to the body's 1.6em/1.8em and grow taller.
- `.dialog-close`: add `background: none; border: none; padding: 0; color: inherit; font-family: inherit; line-height: inherit;`. Keep its existing `position`, `top`, `right`, `cursor`, `font-size: 1.2em`, `font-weight: 100` and `:hover` rule exactly as they are.
- Change the selector `a.dialog-close-button` to `.dialog-close-button` (drop the element qualifier). Add `background: none; border: none; padding: 0; font-family: inherit; line-height: inherit;` and keep `cursor: pointer`, `font-size: 1.4em`, `display: inline-block`, `margin: 0 auto`, `color: #ffffff`. Because it is no longer an anchor it loses the global `a { opacity: 0.5 }` / `a:hover { opacity: 1 }` treatment, so add `opacity: 0.5;` to the rule plus a `.dialog-close-button:hover { opacity: 1; }` rule to reproduce the current dimmed-at-rest, bright-on-hover look.

Do not add a per-component focus ring here either — Task 6 covers it globally.

Commit as `fix(quick-260728-mvn): give project modal real dialog semantics and keyboard close`.
  </action>
  <verify>
    <automated>cd "D:/Kodning/Portfolio/gamedev-portfolio" && f=src/components/ProjectDetailsOverlay.vue && grep -q 'role="dialog"' $f && grep -q 'aria-modal="true"' $f && grep -q 'aria-labelledby="dialog-title"' $f && grep -q 'id="dialog-title"' $f && test "$(grep -c 'h1' $f)" = "0" && test "$(grep -c 'type="button"' $f)" = "2" && grep -q 'Escape' $f && grep -q 'removeEventListener' $f && grep -q 'line-height: 1.1em' $f && npm run lint -- --no-fix</automated>
  </verify>
  <done>Both close controls are buttons that look unchanged, the dialog is labelled and announced as a modal, Escape closes it, the listener is removed on close and on destroy, and no h1 remains in the component.</done>
</task>

<task type="auto">
  <name>Task 5: Fix heading hierarchy in project detail content</name>
  <files>src/data/GameProjectsData.ts, src/css/projects.less</files>
  <action>
Each project's v-html content jumps from the dialog title straight to `<h3>`, skipping the h2 level. Change all four `<h3>About this game</h3>` occurrences (lines 27, 146, 220, 289) to `<h2>About this game</h2>`. Those are the only headings in the file — there are no h4 tags to bump, and the "Postmortem"/"Technical Overview" `<summary>` elements are not headings, so leave them untouched. Change nothing else in the four projects' written copy.

In `src/css/projects.less`, retarget the rule at line 189 from `.dialog-content h3` to `.dialog-content h2` and, in that same rule, pin the metrics the old h3 rendered at so the visual size does not change: keep `text-align: center;` and add `font-size: 1.17em;` and `margin: 1em 0;`. The browser default for h2 is 1.5em with 0.83em margins, which would visibly enlarge these headings. Replace the selector rather than duplicating it — after this change nothing in the app renders an h3 inside `.dialog-content`.

Commit as `fix(quick-260728-mvn): correct heading hierarchy in project detail content`.
  </action>
  <verify>
    <automated>cd "D:/Kodning/Portfolio/gamedev-portfolio" && test "$(grep -c '<h3>' src/data/GameProjectsData.ts)" = "0" && test "$(grep -c '<h2>About this game</h2>' src/data/GameProjectsData.ts)" = "4" && grep -q '.dialog-content h2' src/css/projects.less && test "$(grep -c '.dialog-content h3' src/css/projects.less)" = "0" && grep -A4 '.dialog-content h2' src/css/projects.less | grep -q '1.17em' && echo PASS</automated>
  </verify>
  <done>All four project sections use h2 for their first content heading, the stylesheet targets h2 with the previous h3 metrics, and no h3 remains in either file.</done>
</task>

<task type="auto">
  <name>Task 6: Link hygiene and a visible keyboard focus state</name>
  <files>src/components/Footer.vue, src/views/Contact.vue, src/data/GameProjectsData.ts, src/App.vue</files>
  <action>
New-tab link hygiene:
- `src/components/Footer.vue` line 4: the Portfolio anchor's `target` attribute value is missing its leading underscore, so it opens a window literally named "blank" instead of a new tab. Correct the value to `_blank` and add `rel="noopener noreferrer"`.
- `src/views/Contact.vue` lines 11, 15, 19, 23: add `rel="noopener noreferrer"` to all four anchors (LinkedIn, mailto, GitHub, itch.io). Leave their hrefs and targets otherwise unchanged.
- `src/data/GameProjectsData.ts` lines 35, 156, 227: add `rel="noopener noreferrer"` to the three itch.io badge anchors. The six blueprint-screenshot anchors in the same file already carry it — do not touch them.
- `src/views/GameProjects.vue` game-jam anchors already carry it — do not touch them.

Global focus state in `src/App.vue`, added directly after the existing `a:hover, .router-link-exact-active` rule:

- selector `a:focus-visible, button:focus-visible`
- declarations `opacity: 1;`, `outline: 2px solid lighten(@accentColor, 25%);`, `outline-offset: 3px;`

Use `:focus-visible` (not `:focus`) so mouse clicks do not draw a ring. Lightening the accent is deliberate: raw `@accentColor` (`#6C3BAA`) sits too close to the near-black page gradient to read as a focus indicator. Do **not** change the resting `a { opacity: 0.5 }` or the hover rule. Covering `button` here is what gives the Task 3 grid cards, the Task 4 modal close controls, and the existing GameProjects title buttons a keyboard indicator without per-component CSS.

Commit as `fix(quick-260728-mvn): harden new-tab links and add visible focus state`.
  </action>
  <verify>
    <automated>cd "D:/Kodning/Portfolio/gamedev-portfolio" && node -e 'const fs=require("fs");const files=["src/components/Footer.vue","src/views/Contact.vue","src/views/GameProjects.vue","src/data/GameProjectsData.ts","src/data/OtherProjectsData.ts"];let bad=0;for(const f of files){const src=fs.readFileSync(f,"utf8");for(const m of src.match(/<a\b[^>]*>/g)||[]){const flat=m.replace(/\s+/g," ");if(/target=/.test(flat)&&!(/target="_blank"/.test(flat)&&/rel="noopener noreferrer"/.test(flat))){console.log("BAD",f,flat);bad++;}}}if(bad){process.exit(1)}console.log("PASS")' && grep -q 'focus-visible' src/App.vue && grep -q 'lighten(@accentColor' src/App.vue</automated>
  </verify>
  <done>Every anchor with a target attribute across those files uses a well-formed `_blank` plus rel noopener noreferrer, and App.vue defines a focus-visible ring for links and buttons.</done>
</task>

<task type="auto">
  <name>Task 7: Eliminate image layout shift and add font-display swap</name>
  <files>src/views/Resume.vue, src/views/GameProjects.vue, src/App.vue</files>
  <action>
Add intrinsic dimensions so the browser reserves space before the bitmap loads (both images currently rely on CSS alone, which causes visible reflow):
- `src/views/Resume.vue` line 3: add `width="2478"` and `height="3522"` to the `.resume-image` img (real file dimensions of `public/img/actualResume.png`).
- `src/views/GameProjects.vue` line 20: add `width="512"` and `height="512"` to the hero-photo img (real dimensions of `public/img/avatar.png`).
Leave both stylesheets untouched — the existing `width: 100%; height: auto` rules stay authoritative for rendered size, while the attributes supply the aspect ratio used to reserve space.

In `src/App.vue`, add `font-display: swap;` to each of the four `@font-face` blocks (lines 43-69: Lekton regular, Lekton bold, Lekton italic, Russo One) so text paints in the fallback face instead of staying invisible while the TTFs download.

Commit as `perf(quick-260728-mvn): reserve image space and swap fonts on load`.
  </action>
  <verify>
    <automated>cd "D:/Kodning/Portfolio/gamedev-portfolio" && grep -q 'width="2478"' src/views/Resume.vue && grep -q 'height="3522"' src/views/Resume.vue && grep -q 'width="512"' src/views/GameProjects.vue && grep -q 'height="512"' src/views/GameProjects.vue && test "$(grep -c 'font-display: swap' src/App.vue)" = "4" && echo PASS</automated>
  </verify>
  <done>Both images declare their real intrinsic dimensions while keeping responsive CSS, and all four font faces use swap.</done>
</task>

<task type="auto">
  <name>Task 8: CSS cleanup — dead vendor prefixes and modal positioning</name>
  <files>src/components/ProjectsList.vue, src/components/ProjectDetailsOverlay.vue</files>
  <action>
In `src/components/ProjectsList.vue`, delete the `-webkit-transform` and `-ms-transform` declarations from `.project-item-image:hover`, keeping only the unprefixed `transform: scale(1.1);`. Both prefixes target browsers this project does not support.

In `src/components/ProjectDetailsOverlay.vue`, the `.overlay` backdrop is `position: fixed` while the `.dialog` it belongs to is `position: absolute` — an inconsistency that leaves the dialog anchored to the document rather than the viewport. Change the `.dialog` rule to `position: fixed;` and normalize the `.overlay` declaration to the spaced form `position: fixed;` for consistency. Keep `top: 0px; left: 0px; right: 0px;` and `margin: 20px` on the dialog so its on-screen position and width are unchanged at scroll-top.

Critical companion change: once fixed, the dialog no longer grows with the document, so the project write-ups (which run far past one viewport) would be cut off with no way to reach the Postmortem, Technical Overview or Close button. Give the dialog its own scroll:
- base `.dialog` rule: add `max-height: calc(100vh - 40px);` (its 20px top plus 20px bottom margin) and `overflow-y: auto;`
- desktop media-query `.dialog` rule (min-width 620px, where the margins are 80px top and 40px bottom): add `max-height: calc(100vh - 120px);`

This intentionally moves long-content scrolling from the page to inside the modal — flag it during the Task 9 browser pass. Do not add any vendor-prefixed scroll properties.

Commit as `style(quick-260728-mvn): drop dead vendor prefixes and fix modal positioning`.
  </action>
  <verify>
    <automated>cd "D:/Kodning/Portfolio/gamedev-portfolio" && test "$(grep -c 'webkit-transform' src/components/ProjectsList.vue)" = "0" && test "$(grep -c 'ms-transform' src/components/ProjectsList.vue)" = "0" && test "$(grep -c 'transform: scale' src/components/ProjectsList.vue)" = "1" && test "$(grep -Ec 'position: ?fixed' src/components/ProjectDetailsOverlay.vue)" = "2" && test "$(grep -Ec 'position: ?absolute' src/components/ProjectDetailsOverlay.vue)" = "1" && test "$(grep -c 'max-height: calc' src/components/ProjectDetailsOverlay.vue)" = "2" && grep -q 'overflow-y: auto' src/components/ProjectDetailsOverlay.vue && echo PASS</automated>
  </verify>
  <done>Only the unprefixed transform remains; the overlay and dialog are both fixed (the close button keeps its absolute positioning) and the dialog scrolls internally at both breakpoints.</done>
</task>

<task type="auto">
  <name>Task 9: Full build and lint verification</name>
  <files>(no source changes — verification only)</files>
  <action>
Run the production build and the linter from the repo root. On Windows the npm scripts already wrap the underlying tool with `cross-env NODE_OPTIONS=--openssl-legacy-provider`, so invoke them through npm rather than calling vue-cli-service directly.

Run lint with `-- --no-fix` so it reports rather than silently rewriting files. If lint surfaces a pre-existing warning unrelated to these 12 fixes, record it in the summary and leave it alone; only new errors introduced by this task block completion.

If the build fails, fix forward in the offending task's file and amend that task's commit rather than adding a new one.

Do not commit anything in this task unless a fix was required.
  </action>
  <verify>
    <automated>cd "D:/Kodning/Portfolio/gamedev-portfolio" && npm run build && npm run lint -- --no-fix</automated>
  </verify>
  <done>`npm run build` exits 0 with output in `dist/`, and `npm run lint -- --no-fix` reports no new errors.</done>
</task>

<task type="checkpoint:human-verify" gate="blocking">
  <what-built>
Twelve HTML/CSS/accessibility fixes: dead stylesheet and webfont requests removed, project cards and modal close controls converted to real buttons, dialog semantics plus Escape-to-close added, project-content headings demoted to h2 with their old visual metrics preserved, a keyboard focus ring added globally, new-tab links hardened, image dimensions and font-display swap added, placeholder /other-projects entries deleted, and the modal switched to fixed positioning with internal scrolling.
  </what-built>
  <how-to-verify>
Start the dev server (`npm run serve`) and check, in a browser with DevTools open:

1. **Modal (highest risk — the positioning change).** Go to `/game-projects`, open **Drag Rush** (the longest write-up). Confirm: the title bar looks exactly as before (same size, same vertical rhythm); "About this game" is the same size it used to be, not larger; you can scroll *inside* the dialog all the way down through Postmortem and Technical Overview to the "Close" button. Repeat at a narrow/mobile width (DevTools device toolbar) — nothing should be clipped or unreachable.
2. **Closing.** Press `Escape` — the modal closes. Reopen, click the X — closes. Reopen, click "Close" — closes. The "Close" text should still look dimmed at rest and brighten on hover, exactly as before.
3. **Keyboard.** From the top of the page, press `Tab` repeatedly: a purple focus ring should appear on nav links, project thumbnails, project title buttons, game-jam links, and (with the modal open) both close controls. Confirm the ring does *not* appear on plain mouse clicks.
4. **Other projects.** Visit `/other-projects` — heading and intro text render, no cards, and the Console shows no errors or warnings.
5. **Resume.** Visit `/resume`, hard-reload — the image should occupy its space immediately rather than snapping the page down when it loads.
6. **Network tab.** Hard-reload any page: no 404 for a `projects.css` request, and no request to Google Fonts. Font Awesome icons still render.

Note for your decision, not a defect: `/other-projects` now has intro copy ("here are some other stuff I've made") with nothing beneath it. Removing that route from the nav, or rewriting the copy, was out of scope for this task — say the word and it becomes a follow-up.
  </how-to-verify>
  <resume-signal>Type "approved" or describe what looks wrong</resume-signal>
</task>

</tasks>

<threat_model>
## Trust Boundaries

| Boundary | Description |
|----------|-------------|
| site → third-party origin | Anchors opening new tabs hand a window reference to an external page |
| author content → DOM | Project write-ups are injected with `v-html` |
| browser → CDN | Font Awesome stylesheet loaded from an external CDN |

## STRIDE Threat Register

| Threat ID | Category | Component | Severity | Disposition | Mitigation Plan |
|-----------|----------|-----------|----------|-------------|-----------------|
| T-mvn-01 | Tampering | New-tab anchors in Footer.vue, Contact.vue, GameProjectsData.ts | medium | mitigate | Task 6 adds `rel="noopener noreferrer"` to every `target="_blank"` anchor, cutting the `window.opener` reverse-tabnabbing path and referrer leakage |
| T-mvn-02 | Elevation of Privilege | `v-html` in ProjectDetailsOverlay | low | accept | Content is static, author-authored TypeScript compiled into the bundle — no user or network input reaches `v-html`; this task adds no new injection source |
| T-mvn-03 | Tampering | Font Awesome CDN link in public/index.html | low | accept | Pre-existing dependency, unchanged by this task; SRI hardening is out of scope and tracked separately if desired |

No package-manager installs occur in this task, so no package legitimacy gate applies.
</threat_model>

<verification>
- `npm run build` exits 0 (Task 9).
- `npm run lint -- --no-fix` reports no new errors (Task 9).
- Per-task automated greps pass (Tasks 1-8).
- Browser pass on modal scrolling/closing, keyboard focus, empty /other-projects, resume layout stability, and absence of dead network requests (checkpoint).
- `src/views/404.vue` is untouched: `git diff --stat` must not list it.
- The four real projects' written copy is unchanged apart from heading tag levels: `git diff src/data/GameProjectsData.ts` should show only h3-to-h2 tag edits and three `rel` attribute additions.
</verification>

<success_criteria>
- All 12 reported issues are fixed, in 8 atomic commits grouped by concern.
- No visual regression in the modal title, the About-this-game headings, the modal Close control, or the project grid cards.
- Keyboard-only users can open a project, read all of it, and close it three different ways.
- Build and lint are clean; 404.vue and the real project copy are untouched.
</success_criteria>

<output>
Create `.planning/quick/260728-mvn-fix-html-css-accessibility-issues-from-s/260728-mvn-SUMMARY.md` when done.
</output>
