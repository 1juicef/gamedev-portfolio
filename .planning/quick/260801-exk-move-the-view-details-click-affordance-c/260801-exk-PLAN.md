---
phase: quick-260801-exk
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - src/views/GameProjects.vue
autonomous: false
requirements: [QUICK-260801-exk]

must_haves:
  truths:
    - The "View Details" affordance renders inside `.project-copy` directly after the summary paragraph, never on top of the video thumbnail
    - Clicking or tapping the cue opens the same details overlay as the card title and the thumbnail
    - The cue still takes its border, glow, and arrow colour from the project's own `accentColor`
    - The cue is a real focusable control with a keyboard focus indicator and an unambiguous accessible name
    - The cue label renders in the site font at the site font size, not the browser's default button font
    - No CSS rule still targets the cue as a descendant of the image button
  artifacts:
    - src/views/GameProjects.vue (template + scoped styles modified)
  key_links:
    - "`--project-accent` on `.project-row`/`.wip-row` -> `.project-copy` -> `.project-cue` border/glow/arrow (the cue stays inside the row, so the custom property still cascades — no re-plumbing)"
    - "cue button `@click` -> `showDetails(project)` -> `ProjectDetailsOverlay`"
    - "global `button:focus-visible` rule in `App.vue` -> keyboard focus ring on the new cue button"
    - "`font-family: inherit` on the cue button -> Lekton instead of the UA stylesheet's Arial"
---

<objective>
Move the "View Details" cue in `GameProjects.vue` out of the video thumbnail and into the text column, placed after the project summary, converting it from a decorative overlay span into its own clickable button.

Purpose: the cue shipped in quick task 260801-cp6 sits on top of the video, which the user has now seen live and does not want. The affordance still has to do its original job — a mobile-visible, non-hover signal that the card is clickable — so this is a relocation plus a restyle, not a removal or a downgrade to decorative text.
Output: modified `src/views/GameProjects.vue` (template + `<style scoped>`); no new files, no new dependencies, no data-file changes.
</objective>

<execution_context>
@$HOME/.claude/gsd-core/workflows/execute-plan.md
@$HOME/.claude/gsd-core/templates/summary.md
</execution_context>

<context>
@.planning/STATE.md
@CLAUDE.md
@.claude/CLAUDE.md
@src/views/GameProjects.vue
@.planning/quick/260801-cp6-add-always-visible-click-affordance-to-g/260801-cp6-PLAN.md
</context>

<key_facts>
Established and verified before planning — do not re-derive:

- `--project-accent` is bound on `.project-row` / `.wip-row`, and `.project-copy` is a child of that row. Moving the cue into `.project-copy` keeps it inside the same cascade, so the accent wiring needs **no** change. This is why the move is cheap.
- **`<button>` does not inherit `font-family`.** `#app` sets Lekton (`src/App.vue` line 84) but the UA stylesheet overrides buttons to ~13.3px Arial. `.project-title-link` only looks correct because `App.vue` lines 93-99 name that class explicitly in the Russo One rule. The relocated cue becomes a `<button>` and **must** set `font-family: inherit` or it will silently render in Arial. Today it is a `<span>`, so this problem does not exist yet.
- `src/App.vue` line 114 already defines `a:focus-visible, button:focus-visible { outline: 2px solid ...; outline-offset: 3px; }` globally. The new cue button therefore gets a keyboard focus ring for free — do **not** suppress the outline on it.
- `LazyVideoThumbnail`'s scoped styles contain a single rule (`.lazy-video-thumb`, `display: block`) with nothing absolutely positioned. Once the cue leaves, the relative positioning on `.project-image-button` anchors nothing and is safe to delete.
- `aria-hidden="true"` cannot stay on the cue once it is focusable — an aria-hidden focusable control is an accessibility violation (hidden from assistive tech yet reachable by keyboard). The cue needs a real accessible name instead.
- Contrast math from 260801-cp6 still applies: white on `#E08E32` (the WIP accent) is 2.6:1 and fails AA. Do **not** switch to accent-as-fill with a white label. Keep the dark translucent fill + white label + accent border/glow/arrow.
- Repo precedent from quick task 260726-nkb: unicode triangle glyphs render badly on mobile and were banned. The arrow stays CSS-drawn.
- `wipProject` currently returns `undefined`, so the WIP row does not render — but its markup is a duplicate of the timeline row and must receive the identical change so it is correct when un-hidden.
- There is no test suite in this repo. `npm run lint` plus structural checks are the only automated gates.
</key_facts>

<tasks>

<task type="tracer">
  <name>Task 1: Relocate the cue into the copy column as its own button</name>
  <files>src/views/GameProjects.vue</files>
  <action>
Move the affordance end-to-end — markup, click wiring, styling, and cleanup of the rules it leaves behind — in the timeline row first, then apply the identical change to the WIP row.

**Template.** Delete the cue span from inside `<button class="project-image-button">` in both the timeline row and the WIP row, leaving each image button containing only its `LazyVideoThumbnail`. Re-add the cue inside `.project-copy`, as the last child, immediately after the `<p class="project-summary">` element.

In its new home the cue is a `<button class="project-cue">` rather than a span, wired with `@click="showDetails(project)"` in the timeline row and `@click="showDetails(wipProject)"` in the WIP row — the same handler the title and thumbnail already call. Keep its two inner spans exactly as they are: `<span class="project-cue-label">View Details</span>` followed by the empty `<span class="project-cue-arrow"></span>`.

The old aria treatment does not survive the conversion. The cue was marked decorative because the surrounding image button already carried the accessible name; now it is its own control, so remove that decorative marking and give the button a real name via `:aria-label="'View details for ' + project.name"` (and the `wipProject` equivalent). Naming it this way rather than leaving the bare visible text keeps a screen reader's button list unambiguous when several cards are on the page, and the accessible name still contains the visible label text.

**Styles — `.project-cue`.** It is no longer overlaid on anything, so strip the overlay machinery: drop the absolute positioning together with its bottom/right offsets, drop the `calc()` max-width that fenced it inside the thumbnail, and drop the pointer-events suppression that made it click-through. That suppression in particular must go — with it in place the new button would be unclickable.

Then style it as a standalone control. Keep the pill identity that shipped in 260801-cp6: `display: inline-flex`, `align-items: center`, a small `gap`, `border-radius: 999px`, `white-space: nowrap`, uppercase text with slight `letter-spacing`, colour `#ffffff`, the existing dark translucent `rgba(0, 0, 0, 0.75)` fill, and — each preceded by an identical declaration using the literal `#6c3baa` fallback, matching the pattern already used throughout this stylesheet — `border: 2px solid var(--project-accent, #6c3baa)` and `box-shadow: 0 0 12px -2px var(--project-accent, #6c3baa)`.

Add what a button needs and a span did not: `font-family: inherit` (see key_facts — without it the label renders in Arial), `cursor: pointer`, `touch-action: manipulation`, and `-webkit-tap-highlight-color: transparent`, matching the treatment already on `.project-title-link`.

Size it as a genuine tap target rather than the small overlay badge it was: padding around `10px 16px`, `font-size: 0.78em`, `line-height: 1`, `min-height: 44px` with `box-sizing: border-box` so the 44px floor is honoured. Space it from the paragraph above with `margin: 20px 0 0` — the summary itself uses `margin: 16px 0 0`, so this reads as a deliberate step down rather than a crowded afterthought. Keep `transition: filter 0.14s ease, box-shadow 0.14s ease`.

The `.project-cue-label` rule existed only to ellipsis-truncate the label inside the narrow SwingSpace thumbnail. In the copy column there is no such constraint, so that rule can go; leave the span itself in the markup as the text wrapper.

Leave `.project-cue-arrow` untouched — the CSS-drawn triangle with its accent border-colour and literal fallback is still exactly right, and it must stay CSS-drawn rather than becoming a glyph.

**Styles — replace the rules that just went stale.** Two rules currently reach the cue through the image button: one brightens it while the image is pressed, the other strengthens its glow on desktop hover (inside the `@media (hover: hover) and (pointer: fine)` block). Neither can match anymore now that the cue is not a descendant. Delete both and give the cue its own equivalents: a `:active` state applying `filter: brightness(1.4)`, and inside that same desktop-only media query a `:hover` state applying `filter: brightness(1.15)` plus the stronger `box-shadow: 0 0 20px -2px var(--project-accent, #6c3baa)` glow (literal fallback declaration first, as everywhere else here). Use brightness rather than swapping the fill to the accent colour — brightening is hue-agnostic and preserves the white label's contrast against both the purple and orange accents.

Deliberately use no `transform` on the cue's press state. The image button's existing scale-down needs the `prefers-reduced-motion` block that already exists; keeping the cue's feedback to colour alone means that block needs no changes at all.

Do not add an `outline: none` or a bespoke focus ring to the cue — `App.vue` already gives every button a global `:focus-visible` outline, and suppressing it here would remove a working keyboard indicator.

**Styles — `.project-image-button`.** Its relative positioning existed solely to anchor the cue and now anchors nothing (verified: `LazyVideoThumbnail`'s scoped styles position nothing absolutely), so remove that one declaration. Everything else on the image button stays: it keeps its own press scale-down, accent ring, focus-visible ring, and desktop hover scale — the thumbnail remains clickable exactly as it is today.
  </action>
  <verify>
    <automated>cd "$(git rev-parse --show-toplevel)" &amp;&amp; npm run lint &amp;&amp; node -e 'const t=require("fs").readFileSync("src/views/GameProjects.vue","utf8");const m=t.match(/class="project-summary"(?:(?!project-image-button)[\s\S])*?class="project-cue"/g)||[];process.exit(m.length===2?0:1)' &amp;&amp; test "$(grep -c 'showDetails' src/views/GameProjects.vue)" -eq 8 &amp;&amp; test "$(grep -c 'View details for' src/views/GameProjects.vue)" -ge 2 &amp;&amp; grep -q 'font-family: inherit' src/views/GameProjects.vue &amp;&amp; grep -q 'border-width: 4px 0 4px 6px' src/views/GameProjects.vue &amp;&amp; test "$(grep -Ec 'position: (absolute|relative)|pointer-events: none' src/views/GameProjects.vue)" -eq 0 &amp;&amp; test "$(grep -Ec 'project-image-button:[a-z-]+ \.project-cue' src/views/GameProjects.vue)" -eq 0</automated>
  </verify>
  <done>Lint passes. In both the timeline row and the WIP row the cue renders inside `.project-copy` after the summary paragraph and no longer inside the image button. Each cue is a button wired to `showDetails` with a project-specific accessible name, renders in the site font, and keeps its accent border, glow, and CSS-drawn arrow. No overlay positioning, no click-through suppression, and no rule targeting the cue through the image button remains.</done>
</task>

<task type="checkpoint:human-verify" gate="blocking">
  <name>Task 2: Confirm the relocated cue reads right on desktop and mobile</name>
  <what-built>The "View Details" pill moved off the video thumbnail and into the text column, sitting under each project's summary paragraph as its own tappable button — same accent border, glow, and CSS arrow, now sized as a proper 44px-minimum tap target, opening the same details overlay as the title and the thumbnail.</what-built>
  <how-to-verify>
Run `npm run serve` and open `/game-projects`.

Desktop: every project card now shows the pill beneath its summary text, with nothing overlaying the video. Confirm the label renders in the site's Lekton font at a sensible size — if it looks like small Arial, the font inheritance fix did not land. Hover the pill: it should brighten and its glow should strengthen. Click it: the details overlay opens, same as clicking the title or the thumbnail.

Check the alternating rows — cards alternate which side the image sits on, so confirm the pill sits correctly under the copy in both orientations, including the narrower SwingSpace card.

Narrow the browser to roughly 375px (or use a real phone on the LAN address the dev server prints). The rows stack image-then-text, so the pill should land at the bottom of each card. Confirm it is comfortably tappable and that pressing it brightens it before the overlay opens.

Tab through the page with the keyboard: the pill should be reachable and show a visible focus outline. Note that each card now exposes three controls in tab order (thumbnail, title, pill) — tell me if that feels like too much.

Judgement call for you: under the text, does it still read as an obvious "this card is clickable" signal, or has it lost the pull it had sitting on the video? Size, spacing, wording, and placement within the copy block are all cheap to change.
  </how-to-verify>
  <resume-signal>Type "approved", or describe what looks wrong (size, spacing, wording, font, or how strongly it reads)</resume-signal>
</task>

</tasks>

<threat_model>
## Trust Boundaries

| Boundary | Description |
|----------|-------------|
| data file -> DOM style attribute | `ProjectData.accentColor` reaches a CSS custom property via Vue's `:style` binding (unchanged by this task) |
| data file -> DOM attribute | `project.name` is interpolated into the new cue button's `aria-label` |
| none other | Static site, no user input, no network calls, no auth, no new dependencies |

## STRIDE Threat Register

| Threat ID | Category | Component | Severity | Disposition | Mitigation Plan |
|-----------|----------|-----------|----------|-------------|-----------------|
| T-exk-01 | Tampering | `:aria-label` binding on the cue button | low | accept | `project.name` originates solely from the developer-authored `GameProjectsData.ts`; Vue attribute binding escapes the value and cannot introduce markup. The same value is already bound into the image button's `aria-label` today. |
| T-exk-02 | Elevation of privilege | new focusable control | low | accept | The cue button invokes `showDetails`, the exact handler two existing controls on the same card already call. It grants no capability that was not already reachable. |
| T-exk-SC | Tampering | package-manager installs | low | accept | No package installs in this task. `package.json` and `package-lock.json` must remain unmodified. |
</threat_model>

<verification>
- `npm run lint` passes with no new warnings
- `git diff --stat` shows `src/views/GameProjects.vue` as the only changed file; `package.json` and `package-lock.json` untouched
- The cue's visibility is not gated behind any `@media` or `:hover` rule — it renders at the default width, unconditionally
- Human checkpoint approved
</verification>

<success_criteria>
- The "View Details" affordance renders under the summary text in the copy column, not over the video thumbnail, in both the timeline row and the WIP row
- The affordance is clickable and opens the same overlay as the title and the thumbnail
- It keeps its per-project accent colouring via `--project-accent`, its CSS-drawn arrow, and its no-hover-required visibility
- It is keyboard focusable with a visible focus indicator and renders in the site font
- Only `src/views/GameProjects.vue` changed
</success_criteria>

<output>
Create `.planning/quick/260801-exk-move-the-view-details-click-affordance-c/260801-exk-SUMMARY.md` when done
</output>
