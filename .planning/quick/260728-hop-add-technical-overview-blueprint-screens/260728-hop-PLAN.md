---
phase: quick-260728-hop
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - src/css/projects.less
  - src/data/GameProjectsData.ts
autonomous: true
requirements: [QUICK-260728-HOP]

must_haves:
  truths:
    - "Opening the Floor Zero project overlay shows a collapsible 'Technical Overview' section directly below the existing 'Postmortem' section."
    - "Expanding that section reveals three blueprint screenshots, each with an italic caption underneath, styled like the Technical Overview sections on Drag Rush and SwingSpace."
    - "Clicking any of the three screenshots opens the full-resolution PNG in a new browser tab, where the browser's native image viewer provides zoom and pan."
    - "The three screenshots render at the same width as the surrounding overlay content and do not overflow the overlay on mobile."
  artifacts:
    - "src/data/GameProjectsData.ts — Floor Zero entry ends with a `<details class=\"tech-overview\">` Technical Overview block containing three `.tech-snippet` items"
    - "src/css/projects.less — a `.tech-bp-screenshot` rule inside the existing `.project-details` block"
  key_links:
    - "Each `.tech-bp-screenshot` image is wrapped in an `<a>` whose `href` points at the same `img/projects/floor-0/*.png` path as its `src` — if the href and src drift apart, click-to-zoom silently opens the wrong asset."
    - "The new `<details>` block sits inside the Floor Zero template literal only (between the Postmortem `</details>` and the closing backtick on the `new ProjectData(\"floor-0\", ...)` call) — misplacement puts a Floor Zero section into a different project's overlay."
    - "`.tech-bp-screenshot` must live inside the same `.project-details` wrapper block in projects.less as `.tech-snippet`, since that stylesheet is global and the overlay content is rendered with `v-html` (unscoped)."
---

<objective>
Add a "Technical Overview" collapsible section to the Floor Zero entry, showing three Unreal Blueprint / Behavior Tree screenshots with captions, matching the Technical Overview sections that already exist on Drag Rush and SwingSpace.

Purpose: Floor Zero is the only Unreal project on the site and currently has no technical section. These three screenshots prove the AI and interaction systems described in the "About this game" and Postmortem copy are real work — without showing code, which the site never does.

Output: One new `<details class="tech-overview">` block in the Floor Zero `htmlDescription`, plus one new CSS rule (`.tech-bp-screenshot`) in `src/css/projects.less`.

Carried-over spec — implement as written, do not re-derive:
- Zoom/pan is handled by wrapping each image in a plain `<a target="_blank">` pointing at the full-res PNG. The browser's native image viewer is the whole solution. Do NOT build a lightbox, modal, or any JS image viewer.
- Exactly these three screenshots. Do NOT add the key/door system or breakable-geometry screenshots.
- Reuse the existing `.tech-overview` / `.tech-overview-content` / `.tech-snippet` / `.tech-caption` classes. `.tech-bp-screenshot` is the only new class.
- Unlike the other projects' Technical Overview sections, these snippets contain images instead of `<pre><code>` blocks — Unreal work is visual and there is no source text to paste.

One deliberate addition beyond the carried-over spec: the three anchors carry `rel="noopener noreferrer"` alongside `target="_blank"`, matching the convention established for the Phase 4 Game Jam links. This changes no behavior and does not alter the agreed no-JS approach.
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

<task type="tracer">
  <name>Task 1: Wire one screenshot end-to-end — CSS rule plus the Technical Overview block with the Ghost AI snippet</name>
  <files>src/css/projects.less, src/data/GameProjectsData.ts</files>
  <precondition>All three PNG files exist on disk: `public/img/projects/floor-0/BT_Ghost.png`, `public/img/projects/floor-0/BP_BaseInteractable.png`, `public/img/projects/floor-0/BP_BaseDropable.png`. Verified present at plan time; assert with `ls public/img/projects/floor-0/` before editing and halt if any is missing.</precondition>
  <read_first>
    - `src/css/projects.less` lines 98-126 — the existing `.tech-overview-content`, `.tech-snippet`, `.tech-snippet pre`, `.tech-snippet code`, `.tech-caption` rules. The new rule goes immediately after `.tech-snippet code` and must sit inside the same enclosing `.project-details` block.
    - `src/data/GameProjectsData.ts` lines 271-300 — the SwingSpace Technical Overview block, for exact indentation and nesting of `details` / `summary` / `div.tech-overview-content` / `div.tech-snippet` / `p.tech-caption`.
    - `src/data/GameProjectsData.ts` lines 206-227 — the Floor Zero Postmortem block. The new block is inserted after its closing `</details>` on line 226 and before the closing backtick on line 227.
  </read_first>
  <action>
Two edits, in this order.

First, in `src/css/projects.less`, add a single new rule `.tech-bp-screenshot` directly after the existing `.tech-snippet code` rule, inside the same `.project-details` wrapper block, using the file's 4-space indentation. The rule sets the image to `display: block` and `width: 100%` so it fills the snippet width and picks up no inline baseline gap; `border-radius: 4px` and `border: 1px solid rgba(255, 255, 255, 0.1)` and `background: rgba(0, 0, 0, 0.5)` to match the framing of `.tech-snippet pre`; and `cursor: zoom-in` to signal that clicking opens the full-resolution image. Do not touch any other rule in the file.

Second, in `src/data/GameProjectsData.ts`, inside the Floor Zero template literal only, insert a new `details` element with class `tech-overview` immediately after the Postmortem `details` element's closing tag and immediately before the closing backtick of that template literal — it becomes the last element of the Floor Zero description. Its `summary` text is `Technical Overview`. Inside it, a `div` with class `tech-overview-content`, and inside that, one `div` with class `tech-snippet` containing:
  - an `a` element with `href` of `img/projects/floor-0/BT_Ghost.png`, `target` of `_blank`, and `rel` of `noopener noreferrer`;
  - inside that anchor, an `img` with class `tech-bp-screenshot`, `loading` of `lazy`, `src` of `img/projects/floor-0/BT_Ghost.png`, and `alt` of `Ghost AI behavior tree`;
  - after the anchor, a `p` with class `tech-caption` whose text is exactly: One Selector at the root branches on a single Blackboard state value, so the Ghost's Roam, Chase, Follow, Attack, Lost and Death behaviours are all just states to switch between rather than conditions tangled across the tree.

Match the surrounding indentation of the Floor Zero literal. Write the apostrophe in "Ghost's" as the HTML entity `&#39;` so the character can never terminate a quoted attribute or confuse the template literal; leave `&amp;`-style escaping alone elsewhere. Paths are root-relative with no leading slash, matching every other asset reference in this file. Do not convert these PNGs to WebP and do not add them to the `Helpers.preloadImages` list — they sit behind a collapsed `details` and are lazy-loaded on purpose.
  </action>
  <verify>
    <automated>grep -c 'tech-bp-screenshot' src/css/projects.less  # expect 1
grep -c 'BT_Ghost.png' src/data/GameProjectsData.ts  # expect 2 (href + src)
grep -c 'Technical Overview' src/data/GameProjectsData.ts  # expect 3 (Drag Rush, SwingSpace, Floor Zero)
npm run lint</automated>
  </verify>
  <done>`src/css/projects.less` contains a `.tech-bp-screenshot` rule inside the `.project-details` block; the Floor Zero entry ends with a Technical Overview `details` block holding one `.tech-snippet` whose image links to `img/projects/floor-0/BT_Ghost.png` in a new tab; `npm run lint` exits 0.</done>
</task>

<task type="auto">
  <name>Task 2: Add the two remaining blueprint snippets</name>
  <files>src/data/GameProjectsData.ts</files>
  <action>
Inside the Technical Overview `div.tech-overview-content` created in Task 1, append two more `div` elements with class `tech-snippet`, in this order, each structured identically to the first (anchor with `target` of `_blank` and `rel` of `noopener noreferrer`, wrapping an `img` with class `tech-bp-screenshot` and `loading` of `lazy`, followed by a `p` with class `tech-caption`). For each, `href` and `src` are the same path.

Second snippet — path `img/projects/floor-0/BP_BaseInteractable.png`, alt `Base interactable object blueprint`, caption text exactly: A shared base actor owns the hover outline and the Interact-on-E path, both gated behind a valid-player-component check, so any actor inheriting from it becomes interactable without writing new logic.

Third snippet — path `img/projects/floor-0/BP_BaseDropable.png`, alt `Interactable target detection blueprint`, caption text exactly: A sphere trace gathers candidates first, then a line trace resolves which one the player actually means. Every hit is validated through the shared interactable interface, so aiming stays forgiving without ever grabbing something that was never interactable.

Do not add a fourth snippet. Do not modify the Postmortem block, the screenshot row above it, or any other project entry.
  </action>
  <verify>
    <automated>grep -c 'tech-bp-screenshot' src/data/GameProjectsData.ts  # expect 3
grep -c 'tech-caption' src/data/GameProjectsData.ts  # expect 9 (3 Drag Rush + 3 SwingSpace + 3 Floor Zero)
grep -c 'BP_BaseInteractable.png' src/data/GameProjectsData.ts  # expect 2
grep -c 'BP_BaseDropable.png' src/data/GameProjectsData.ts  # expect 2
npm run build</automated>
    <human-check>Run `npm run serve`, open the Floor Zero card on /game-projects, scroll to the bottom of the overlay. Confirm: a "Technical Overview" dropdown sits below "Postmortem"; expanding it shows three blueprint screenshots each with an italic caption; clicking a screenshot opens the full-res PNG in a new tab where it can be zoomed and panned; the images do not overflow the overlay at a narrow (&lt;620px) window width.</human-check>
  </verify>
  <done>The Floor Zero Technical Overview contains exactly three `.tech-snippet` items in the order BT_Ghost, BP_BaseInteractable, BP_BaseDropable, each with a matching `href`/`src` pair and a caption; `npm run build` completes without errors.</done>
</task>

</tasks>

<threat_model>
## Trust Boundaries

| Boundary | Description |
|----------|-------------|
| author → `v-html` | The Floor Zero `htmlDescription` string is rendered unescaped by `ProjectDetailsOverlay.vue` via `v-html`. |
| site → new browser tab | The three new anchors open a same-origin static image in a new tab. |

## STRIDE Threat Register

| Threat ID | Category | Component | Severity | Disposition | Mitigation Plan |
|-----------|----------|-----------|----------|-------------|-----------------|
| T-QT-01 | Tampering | New `target="_blank"` anchors in the Floor Zero entry | low | mitigate | Each anchor carries `rel="noopener noreferrer"`, matching the Phase 4 Game Jam link convention. Targets are same-origin static PNGs with no script context, so exposure is nil either way. |
| T-QT-02 | Tampering / Injection | `v-html` render of `htmlDescription` | low | accept | The added markup is an author-written compile-time string literal in a TypeScript source file. No user input, query param, or network data reaches this string. Accepting is consistent with every existing project entry. |
| T-QT-03 | Information Disclosure | Blueprint screenshots published publicly | low | accept | Screenshots are of the author's own portfolio project, intentionally published as proof of work. No credentials, keys, or third-party IP visible in the captured graphs. |

No package-manager installs, dependency changes, or new network calls in this task, so no supply-chain (T-*-SC) threat applies.
</threat_model>

<verification>
1. `npm run lint` exits 0.
2. `npm run build` completes without errors.
3. `grep -c 'tech-bp-screenshot' src/data/GameProjectsData.ts` returns 3 and `grep -c 'tech-bp-screenshot' src/css/projects.less` returns 1.
4. Each of the three image paths appears exactly twice in `src/data/GameProjectsData.ts` (once as `href`, once as `src`).
5. `git diff --stat` shows exactly two files changed: `src/css/projects.less` and `src/data/GameProjectsData.ts`.
</verification>

<success_criteria>
- Floor Zero's overlay ends with a "Technical Overview" dropdown that is visually indistinguishable in framing from the Drag Rush and SwingSpace ones.
- Three screenshots, three captions, in the specified order, each click-through opening its full-resolution PNG in a new tab.
- Exactly one new CSS class introduced (`.tech-bp-screenshot`); all other styling reuses existing classes.
- No JS, no lightbox component, no new dependency, no changes to any other project entry.
</success_criteria>

<output>
Create `.planning/quick/260728-hop-add-technical-overview-blueprint-screens/260728-hop-SUMMARY.md` when done
</output>
