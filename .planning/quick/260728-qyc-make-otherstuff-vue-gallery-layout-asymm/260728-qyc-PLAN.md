---
phase: quick-260728-qyc
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - src/views/OtherStuff.vue
autonomous: true
requirements: [QUICK-260728-QYC]

must_haves:
  truths:
    - "Each gallery item renders at its own real aspect ratio — portrait clips are tall, the two 900x900 designs are square, WDLog is wide — instead of every tile sharing one 4:3 box."
    - "The gallery reads as an asymmetric masonry wall: neighbouring items have different heights and do not line up into uniform rows."
    - "No media is cropped — object-fit stays contain, and no item is sliced across a column break."
    - "Column count steps down as the viewport narrows and collapses to a single column at or below 620px."
    - "npm run build and npm run lint both pass."
  artifacts:
    - "src/views/OtherStuff.vue — media array entries each carry real intrinsic width/height numbers"
    - "src/views/OtherStuff.vue — scoped style block uses a CSS multi-column container instead of a CSS grid"
  key_links:
    - "media array width/height fields -> inline :style aspect-ratio binding on .other-stuff-cell. If the binding is missing or the field names mismatch, every cell loses its reserved height and collapses."
    - ".other-stuff-cell break-inside: avoid -> the multi-column container. Without it a tall video is sliced in half across a column boundary."
    - "620px media query -> single-column override. Without it phones get two or three cramped columns."
---

<objective>
Replace the uniform 4:3 CSS grid in the Other Stuff gallery with an asymmetric CSS multi-column (masonry) layout where every item is sized by its own real media aspect ratio.

Purpose: The user shipped the gallery, then asked for it to be "more asymmetrical" and for each media item to keep its own aspect ratio rather than being letterboxed into a shared 4:3 tile. Five of the seven items are portrait, so honouring true ratios is what produces the asymmetry.
Output: A single modified file, `src/views/OtherStuff.vue`, with per-item intrinsic dimensions in the data array and a multi-column masonry container in the scoped styles.
</objective>

<execution_context>
@$HOME/.claude/gsd-core/workflows/execute-plan.md
@$HOME/.claude/gsd-core/templates/summary.md
</execution_context>

<context>
@CLAUDE.md
@.claude/CLAUDE.md
@src/views/OtherStuff.vue

Current state of the file (85 lines): a `media` array of 7 entries with `type`/`src`/`alt` fields, rendered by `v-for` into `.other-stuff-cell` divs inside `.other-stuff-grid`. The grid is `display: grid` with auto-fill minmax(280px, 1fr) columns and a 16px gap; every cell is pinned to a shared 4:3 ratio, and `.other-stuff-media` fills the cell with `object-fit: contain`. One media query at 620px collapses to a single column.

**Measured intrinsic dimensions (verified via ffprobe / PNG header — use these exact numbers, do NOT re-derive or guess):**

| src | width | height | shape |
|-----|-------|--------|-------|
| `img/other-stuff/110001-0265.mp4` | 1080 | 1920 | portrait |
| `img/other-stuff/Crouch%20walking1.mp4` | 720 | 1280 | portrait |
| `img/other-stuff/Dog%20jacket%20w%20buckle.png` | 900 | 900 | square |
| `img/other-stuff/WDLog.jpg` | 2048 | 1152 | landscape |
| `img/other-stuff/jeans%20boot%20cut%204.png` | 900 | 900 | square |
| `img/other-stuff/natiDraken.mp4` | 606 | 1050 | portrait |
| `img/other-stuff/pattern%2008%20render.png` | 2048 | 2897 | portrait |

**Locked implementation direction — implement it, do not re-litigate it:**
- Pure-CSS masonry via multi-column (`columns` / `column-gap`, items `break-inside: avoid` + `margin-bottom`). No JS masonry library, no layout measurement code.
- Per-item ratio comes from the item's own numbers via an inline `:style` binding — not a shared CSS rule.
- Keep `object-fit: contain` (this is design work; cropping it is unacceptable).
- 620px stays the only hard breakpoint in the file — it is the only media-query breakpoint used anywhere in this codebase.
- Do not touch `img`/`video`/`source` markup semantics: `loading="lazy"`, `controls`, `preload="metadata"`, `:alt` / `:aria-label`, and the fallback text all stay exactly as they are.
- Do not reorder the `media` array; the multi-column algorithm balances heights on its own.
</context>

<tasks>

<task type="tracer" tdd="false">
  <name>Task 1: End-to-end true-ratio masonry — data dimensions, inline binding, multi-column container</name>
  <files>src/views/OtherStuff.vue</files>
  <read_first>src/views/OtherStuff.vue (all 85 lines — template, data array, scoped style block)</read_first>
  <action>
Wire one real aspect ratio from data through the template to rendered CSS, for every item at once, in the single file.

Data: add two numeric fields, `width` and `height`, to each of the 7 entries in the `media` array, using the exact measured numbers from the table in `<context>` (match by `src` — the encoded `%20` src strings are the join key). Format each entry on one line as `{ type: "...", src: "...", alt: "...", width: 1080, height: 1920 }`. Keep the existing key order and the existing array order; add nothing else and remove nothing.

Template: on the `.other-stuff-cell` div that carries the `v-for`, add an inline style binding `:style="{ aspectRatio: item.width + ' / ' + item.height }"`. Leave `class`, `v-for`, and `:key="item.src"` untouched, and leave the nested `img`/`video`/`source` elements byte-identical.

Styles: convert `.other-stuff-grid` from a CSS grid to a multi-column container — delete the old container declarations (the display mode line, the template-columns line, and the `gap` line) and replace them with `column-count: 3` plus `column-gap: 16px`, keeping `margin-top: 20px`. On `.other-stuff-cell`, delete the shared 4:3 ratio declaration (the per-item inline binding now supplies the ratio) and add `break-inside: avoid` plus `margin-bottom: 16px` so items do not split across a column boundary and rows get vertical separation. Keep the cell's background, border-radius, border, and `overflow: hidden` exactly as they are, and keep `.other-stuff-media` unchanged so `object-fit: contain` still guards against cropping. Do not add vendor-prefixed break-inside variants — a prior pass deliberately stripped dead prefixes from this codebase.
  </action>
  <verify>
    <automated>cd "$(git rev-parse --show-toplevel)" && test "$(grep -oE 'width: [0-9]+, height: [0-9]+' src/views/OtherStuff.vue | wc -l)" -eq 7 && test "$(grep -c 'aspectRatio' src/views/OtherStuff.vue)" -eq 1 && test "$(grep -c 'break-inside: avoid' src/views/OtherStuff.vue)" -eq 1 && test "$(grep -c 'object-fit: contain' src/views/OtherStuff.vue)" -eq 1 && test "$(grep -c 'display: grid' src/views/OtherStuff.vue)" -eq 0 && test "$(grep -c 'aspect-ratio: 4' src/views/OtherStuff.vue)" -eq 0 && npm run build</automated>
  </verify>
  <done>All 7 media entries carry their measured width/height; the cell div binds those to an inline aspect ratio; `.other-stuff-grid` is a 3-column multi-column container with 16px column gap; cells avoid column breaks and carry a 16px bottom margin; the shared 4:3 rule and the CSS-grid declarations are gone; `npm run build` succeeds.</done>
</task>

<task type="auto" tdd="false">
  <name>Task 2: Responsive column stepping down to single column at 620px</name>
  <files>src/views/OtherStuff.vue</files>
  <read_first>src/views/OtherStuff.vue (scoped style block only — the state left by Task 1)</read_first>
  <reversibility rating="reversible">Two CSS declarations in one scoped style block; `git revert` of this commit fully restores the prior layout.</reversibility>
  <action>
Make the column count step down as the viewport narrows without adding a second breakpoint.

In `.other-stuff-grid`, replace the fixed 3-column declaration from Task 1 with the shorthand `columns: 320px 3`. When both a column width and a column count are given, the count acts as a maximum: the browser fits as many ~320px columns as the container allows, capped at 3. This yields 3 columns on desktop, 2 on tablet-width viewports, and 1 on narrow ones, with zero new breakpoints — which matters because 620px is currently the only media-query breakpoint anywhere in this codebase. Keep `column-gap: 16px` and `margin-top: 20px` as they are.

In the existing `@media only screen and (max-width: 620px)` block, replace the grid-era single-column rule with `columns: 1;` so phones get a guaranteed single column regardless of container width. Do not change the 620px value and do not add any additional media query.
  </action>
  <verify>
    <automated>cd "$(git rev-parse --show-toplevel)" && test "$(grep -c 'columns: 320px 3' src/views/OtherStuff.vue)" -eq 1 && test "$(grep -c 'columns: 1;' src/views/OtherStuff.vue)" -eq 1 && test "$(grep -c 'max-width: 620px' src/views/OtherStuff.vue)" -eq 1 && test "$(grep -cE '@media' src/views/OtherStuff.vue)" -eq 1 && test "$(grep -c '1fr' src/views/OtherStuff.vue)" -eq 0 && npm run lint && npm run build</automated>
    <human-check>Run `npm run serve`, open `/other-stuff`, and confirm at a wide window: 3 uneven columns, portrait clips visibly taller than the square design tiles, no letterboxing bars, no item sliced across a column. Narrow the window past ~900px (expect 2 columns) and past 620px (expect 1 column). Play one video to confirm controls still work.</human-check>
  </verify>
  <done>The gallery caps at 3 columns and steps to 2 then 1 as the viewport narrows; the 620px query forces a single column; only one media query remains in the file; `npm run lint` and `npm run build` both pass.</done>
</task>

</tasks>

<threat_model>
## Trust Boundaries

| Boundary | Description |
|----------|-------------|
| (none crossed) | All gallery data is static, author-controlled, compiled into the bundle at build time. No user input, no network fetch, no runtime data source is introduced by this change. |

## STRIDE Threat Register

| Threat ID | Category | Component | Severity | Disposition | Mitigation Plan |
|-----------|----------|-----------|----------|-------------|-----------------|
| T-QYC-01 | Tampering | Inline `:style` binding on `.other-stuff-cell` | low | accept | Bound values are integers from a hardcoded array in the same file, interpolated into a CSS aspect-ratio value. Vue 2 style bindings are set via `el.style`, not parsed as markup, so there is no injection surface. No `v-html` is added. |
| T-QYC-02 | Information Disclosure | `public/img/other-stuff/` media | low | accept | The seven media files are already public and already tracked in git (quick task 260728-ql5); this change alters only their layout. |

**Package legitimacy gate: N/A.** This plan installs no npm/pip/cargo packages — it modifies one existing source file only.
</threat_model>

<source_audit>
No ROADMAP/REQUIREMENTS/RESEARCH/CONTEXT artifacts exist for a quick task, so the audit runs against the locked direction items in the task brief.

| # | Source item | Status | Where covered |
|---|-------------|--------|---------------|
| 1 | Replace CSS grid with CSS multi-column (`column-count` + `column-gap`, `break-inside: avoid`, `margin-bottom`) | COVERED | Task 1 (styles), Task 2 (`columns` shorthand) |
| 2 | Per-item aspect ratio from real w/h added to the `media` array | COVERED | Task 1 (data) |
| 3 | Ratio applied via inline `:style` binding on the cell, not a shared rule | COVERED | Task 1 (template) |
| 4 | Keep `object-fit: contain` (no cropping) | COVERED | Task 1 (`.other-stuff-media` untouched; verified by grep gate) |
| 5 | Responsive step-down 3 -> 2 -> 1, keeping 620px, no new breakpoints | COVERED | Task 2 |
| 6 | Keep img/video/source markup, alt text, lazy-loading as-is | COVERED | Task 1 action constraint; single `@media` + markup untouched |
| 7 | Single file changed: `src/views/OtherStuff.vue` only | COVERED | `files_modified` frontmatter; both tasks scoped to that file |

No MISSING items. No deferrals.
</source_audit>

<verification>
- `npm run lint` passes with no new warnings.
- `npm run build` completes to `dist/`.
- `git diff --name-only` lists exactly one file: `src/views/OtherStuff.vue`.
- All 7 media entries carry the measured intrinsic dimensions; none of the numbers were guessed or recomputed.
</verification>

<success_criteria>
- The Other Stuff gallery renders as an asymmetric masonry wall where item heights vary by their real media proportions.
- No item is letterboxed into a 4:3 box, cropped, or split across a column break.
- Column count is 3 at desktop width, 2 at tablet width, 1 at or below 620px.
- Lint and build pass; exactly one source file changed.
</success_criteria>

<output>
Create `.planning/quick/260728-qyc-make-otherstuff-vue-gallery-layout-asymm/260728-qyc-SUMMARY.md` when done.
</output>
