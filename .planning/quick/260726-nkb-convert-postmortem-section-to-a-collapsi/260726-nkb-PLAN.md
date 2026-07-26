---
phase: quick-260726-nkb
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - src/css/projects.less
  - src/data/GameProjectsData.ts
autonomous: true
requirements: [QT-260726-nkb-convert-postmortem-to-collapsible-and-fix-arrow-glyph]

must_haves:
  truths:
    - Opening the Drag Rush overlay shows "Postmortem" as a collapsed toggle (same look as Technical Overview) instead of a static h3 heading with always-visible prose
    - Clicking the Postmortem toggle expands the four sub-sections (Scope & goals / What went well? / What went wrong? / Takeaways) with their prose unchanged word-for-word
    - The Postmortem toggle sits between the itch.io badge and the Technical Overview toggle, as the static section did
    - Every collapsible toggle on the site (Drag Rush Technical Overview, SwingSpace Technical Overview, new Postmortem) shows a monochrome CSS-drawn triangle that cannot be substituted with a color emoji glyph by a mobile OS font stack
    - The triangle still rotates 90 degrees when its details element is open
    - The file still parses — `npm run lint` passes (template literal not broken)
  artifacts:
    - src/css/projects.less (`.tech-overview summary::before` redrawn with borders)
    - src/data/GameProjectsData.ts (Drag Rush postmortem markup wrapped in a details element)
  key_links:
    - The arrow fix lives in exactly ONE rule in projects.less and is inherited by all `.tech-overview` blocks — it must not be duplicated per project
    - The new Postmortem block reuses the existing `.tech-overview` / `.tech-overview-content` selectors — zero new CSS class names
    - Markup renders through `v-html` in ProjectDetailsOverlay.vue; `<details>`/`<summary>` is native HTML, so no JS toggle logic is needed
---

<objective>
Convert the Drag Rush Postmortem from an always-open static section into a native `<details>` collapsible matching the existing Technical Overview pattern, and replace the toggle arrow's unicode triangle character with a pure-CSS border triangle so mobile browsers cannot render it as a colorful emoji.

Purpose: The Drag Rush overlay currently front-loads four long prose blocks before the reader reaches anything else; collapsing them puts the reader in control. The arrow glyph fix is a site-wide rendering bug that would otherwise ship alongside a third collapsible.
Output: One rule rewritten in projects.less, one markup block re-nested in GameProjectsData.ts. No new components, no new CSS classes, no new assets, no JS.

Two tasks by design: the CSS rule is global and independent of the markup change, so it lands first and the markup change inherits it. Neither task is a layer of the other.
</objective>

<execution_context>
@$HOME/.claude/gsd-core/workflows/execute-plan.md
</execution_context>

<context>
Verified before planning:
- `src/css/projects.less` lines 63-95 already define `.tech-overview`, `.tech-overview summary`, `.tech-overview summary::-webkit-details-marker { display: none }`, `.tech-overview summary::before`, `.tech-overview[open] summary::before`, and `.tech-overview-content`. The only rule that changes is `summary::before`.
- `.tech-overview summary` sets `list-style: none` and the webkit marker is already hidden, so the `::before` pseudo-element is the sole disclosure indicator — no native marker will reappear.
- `rotate(90deg)` currently appears exactly once in projects.less (the `[open]` rule). It stays byte-identical; a border-drawn triangle rotates the same way a glyph does.
- `src/data/GameProjectsData.ts` Drag Rush entry, current order: intro/media/About (lines ~5-33) → itch.io badge paragraph (lines 34-36) → static `<div class="paragraph center"><h3>Postmortem</h3></div>` (lines 37-39) → four `<div class="paragraph">` blocks (lines 40-55) → `<details class="tech-overview">` Technical Overview (line 56+).
- `<details class="tech-overview">` and `<div class="tech-overview-content">` each appear twice today (Drag Rush line 56/58, SwingSpace line 206/208) — 4 matching lines total. After this change: 6.
- The postmortem prose contains no backticks and no `${` — safe to re-indent inside the TS template literal.
- `currentColor` inherits the overlay text color, so the triangle matches the existing glyph's color with no new variable.

Ponytail check: `<details>`/`<summary>` is the native platform feature; no JS, no library, no new class. The CSS triangle is 6 lines and removes a font-dependency instead of adding one. Nothing further to cut.
</context>

<tasks>

<task type="auto">
  <name>Task 1: Redraw the disclosure arrow with CSS borders instead of a text glyph</name>
  <files>src/css/projects.less</files>
  <read_first>src/css/projects.less (lines 63-95 — the `.tech-overview` rule group)</read_first>
  <action>
Rewrite the `.tech-overview summary::before` rule so the disclosure indicator is drawn entirely from CSS borders and carries no text character at all. The rule must set `content` to an empty string, `display: inline-block`, zero width and height, transparent top and bottom borders of 5px, a left border of 6px in `currentColor`, `margin-right: 8px`, and keep the existing `transition: transform 0.15s ease` untouched.

Rationale: the previous value was a U+25B6 BLACK RIGHT-POINTING TRIANGLE text character. Mobile font stacks (notably iOS and some Android browsers) can resolve that codepoint to an emoji-presentation glyph, rendering a colored triangle instead of a monochrome one. A zero-box element with three borders has no codepoint and therefore no font fallback path.

Leave `.tech-overview[open] summary::before { transform: rotate(90deg); }` exactly as it is — a border triangle rotates identically to a glyph, so the open state still points downward. Do not add any width/height beyond 0, and do not add a `vertical-align` unless the human check shows the triangle sitting off the text baseline.

Do NOT touch: any other rule in projects.less (including `.tech-overview`, `.tech-overview summary`, the webkit marker rule, `.tech-overview-content`, `.tech-snippet*`, `.tech-caption`), any `.vue` file, or any data file. Do NOT duplicate this fix into a per-project or per-component stylesheet — the single global rule is the point.
  </action>
  <verify>
    <automated>grep -c "border-left: 6px solid currentColor" src/css/projects.less # expect 1</automated>
    <automated>grep -c "border-top: 5px solid transparent" src/css/projects.less # expect 1</automated>
    <automated>grep -c "rotate(90deg)" src/css/projects.less # expect 1 (open-state rule preserved)</automated>
    <automated>grep -c "transition: transform 0.15s ease" src/css/projects.less # expect 1 (animation preserved)</automated>
    <automated>grep -vc '^\s*//' src/css/projects.less >/dev/null; grep -P '\xe2\x96\xb6' src/css/projects.less; test $? -eq 1 && echo "PASS: no U+25B6 glyph remains"</automated>
    <automated>git diff --stat -- src/data/GameProjectsData.ts # expect empty output (this task touches CSS only)</automated>
    <automated>npm run lint</automated>
  </verify>
  <done>`.tech-overview summary::before` draws a border triangle with an empty `content`, no U+25B6 codepoint exists anywhere in projects.less, the `[open]` rotate rule and the transform transition are unchanged, and no other file was modified.</done>
</task>

<task type="auto">
  <name>Task 2: Wrap the Drag Rush Postmortem in a details/summary collapsible</name>
  <files>src/data/GameProjectsData.ts</files>
  <read_first>src/data/GameProjectsData.ts (lines 34-58 — itch.io badge through the opening of the Technical Overview details element)</read_first>
  <action>
In the Drag Rush `ProjectData` htmlDescription template literal only:

1. Delete the static heading wrapper — the `paragraph center` div whose sole child is the `h3` reading "Postmortem".
2. Open a `<details class="tech-overview">` in its place, with a `<summary>` containing the plain text Postmortem (no h3, no nested markup), followed by a `<div class="tech-overview-content">`.
3. Move the four existing `<div class="paragraph">` blocks (Scope & goals / What went well? / What went wrong? / Takeaways) inside that content div, then close the content div and the details element.

Copy the four prose blocks verbatim from the file you just read — do not retype the postmortem text from memory, do not re-wrap lines mid-sentence, do not fix, tighten, or rephrase anything. This is a structural change only. Keep the escaped ampersand entity in the Scope label escaped. Re-indenting the moved lines by one level is the only permitted edit to their content.

Placement is unchanged: the new details element occupies exactly the span the static section did — immediately after the closing tag of the itch.io badge paragraph div, immediately before the opening `<details class="tech-overview">` of the Technical Overview. The overlay order stays: intro → media → About → itch.io badge → Postmortem → Technical Overview.

Do NOT touch: the Dispater, Floor Zero, or SwingSpace entries; the Drag Rush intro/media/About/badge blocks; the Drag Rush Technical Overview details element and its snippets; src/css/projects.less; App.vue; ProjectDetailsOverlay.vue. Introduce no new CSS class names — `.tech-overview` and `.tech-overview-content` are reused as-is, which is why this task ships zero stylesheet changes.
  </action>
  <verify>
    <automated>grep -Fc '&lt;summary&gt;Postmortem&lt;/summary&gt;' src/data/GameProjectsData.ts # expect 1</automated>
    <automated>grep -c 'h3.Postmortem' src/data/GameProjectsData.ts # expect 0 (static heading gone)</automated>
    <automated>grep -c 'tech-overview' src/data/GameProjectsData.ts # expect 6 (was 4: two details + two content lines, now three of each)</automated>
    <automated>grep -Fc '&lt;summary&gt;Technical Overview&lt;/summary&gt;' src/data/GameProjectsData.ts # expect 2 (both existing toggles untouched)</automated>
    <automated>grep -cE 'strong.*br/' src/data/GameProjectsData.ts # expect 4 (all four labelled sub-sections survived the move)</automated>
    <automated>grep -Fc 'the object would dance!' src/data/GameProjectsData.ts # expect 1 (prose intact)</automated>
    <automated>grep -Fc 'confidence in my programming and logical thinking skills grow a lot.' src/data/GameProjectsData.ts # expect 1 (prose intact)</automated>
    <automated>git diff --stat -- src/css/projects.less # expect empty output relative to the Task 1 commit (no further CSS changes)</automated>
    <automated>npm run lint</automated>
    <human-check>Run `npm run serve`, open /game-projects, click the Drag Rush card. Confirm: Postmortem renders as a collapsed toggle below the itch.io badge and above Technical Overview, styled identically to it; clicking expands the four labelled paragraphs and rotates the triangle downward; clicking again collapses it. Then open the same overlay on a phone (or device-mode) and confirm both triangles are flat monochrome shapes, not colored emoji.</human-check>
  </verify>
  <done>The Drag Rush overlay renders Postmortem as a `<details class="tech-overview">` toggle in the old section's position, expanding to the four unmodified prose blocks; no `h3` Postmortem heading remains; the two Technical Overview toggles and all other project entries are unchanged; `npm run lint` passes.</done>
</task>

</tasks>

<threat_model>
## Trust Boundaries

| Boundary | Description |
|----------|-------------|
| htmlDescription string → `v-html` in ProjectDetailsOverlay.vue | Raw HTML is injected into the DOM without sanitization |

## STRIDE Threat Register

| Threat ID | Category | Component | Severity | Disposition | Mitigation Plan |
|-----------|----------|-----------|----------|-------------|-----------------|
| T-QUICK-01 | Tampering (XSS sink) | `v-html` render of GameProjectsData htmlDescription | low | accept | Markup is build-time-static and developer-authored: no script tags, no inline event handler attributes, no href/src added, no externally-sourced or user-supplied input reaches this string. `<details>`/`<summary>` are inert layout elements. Pre-existing sink, not widened by this change. ASVS L1 — accepted. |

No package-manager installs in this plan, so the package legitimacy gate does not apply.
</threat_model>

<success_criteria>
- `.tech-overview summary::before` uses an empty `content` plus border-drawn triangle; zero U+25B6 codepoints remain in projects.less
- The `[open]` 90-degree rotation and the transform transition behave exactly as before
- The arrow fix exists once, globally, and applies to all three collapsibles
- Drag Rush Postmortem is a `<details class="tech-overview">` toggle positioned between the itch.io badge and Technical Overview
- Postmortem prose is byte-identical apart from indentation
- Zero new CSS class names; no other project entry or CSS rule modified
- `npm run lint` passes
</success_criteria>

<output>
Create `.planning/quick/260726-nkb-convert-postmortem-section-to-a-collapsi/260726-nkb-SUMMARY.md` when done.
</output>
