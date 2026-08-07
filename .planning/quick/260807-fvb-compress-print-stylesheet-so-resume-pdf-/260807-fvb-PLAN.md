---
phase: quick-260807-fvb
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - src/css/print.less
  - public/downloads/Josef-Ubaka-Resume.pdf
autonomous: false
requirements: [QUICK-260807-fvb]

must_haves:
  truths:
    - "public/downloads/Josef-Ubaka-Resume.pdf is exactly one page — the PDF page tree reports /Count 1."
    - "Every section that is on the resume today is still on the resume: name/title, contact row, summary blockquote, Selected Projects (all 4), Experience (both), Education (both), Tech & Language, Beyond the Code (all 5 rows), footer."
    - "The one-page PDF still reads as a professional document, not a wall of microtype — body text stays at or above 9pt with line-height at or above 1.2 and page margins at or above 10mm."
    - "On-screen /resume (and every other route) is visually unchanged — all edits live inside the existing @media print block in print.less."
    - "The PDF is reproducible from source with the existing one-command pipeline (`npm run export:resume-pdf`) — no new npm dependency, no change to the export script's logic."
  artifacts:
    - "src/css/print.less — tightened @media print density rules (type scale, vertical rhythm, page margins)"
    - "public/downloads/Josef-Ubaka-Resume.pdf — regenerated, single-page"
  key_links:
    - "print.less is imported by App.vue's GLOBAL <style lang=\"less\"> block, so its rules can override Resume.vue's <style scoped> rules — but only where print.less actually names the selector. Scoped values it never mentions (notably `.resume-section h2 { margin: 0 0 20px; padding-bottom: 12px }`) still apply at their on-screen size and are the single biggest untapped source of vertical space."
    - "Chrome's --print-to-pdf reads @media print from the SERVED dist/ build, not from src/. Every measurement cycle must go through a build (`npm run export:resume-pdf` chains build + export) or the PDF reflects the previous CSS."
    - "`page-break-inside: avoid` on .resume-section/.entry/.project-entry/.personal-entry inflates page count non-linearly: content only slightly taller than one page pushes an entire section to page 2. Page count therefore drops in steps, not smoothly — do not read a stalled /Count as 'the lever did nothing'."
    - "`.personal-label { flex: 0 0 180px }` (Resume.vue scoped, min-width 620px) is sized for a full-width row. If .personal-entries is ever forced into a 2-column print grid, that 180px basis must be overridden too or the label column swallows each half."
---

<objective>
Compress the existing `@media print` block in `src/css/print.less` until the exported resume PDF fits on exactly one page, down from three.

Purpose: a resume that spans three pages reads badly to a hiring manager — a one-page resume is the professional norm and the whole point of having built the PDF export pipeline.
Output: a denser print stylesheet and a regenerated single-page `public/downloads/Josef-Ubaka-Resume.pdf`, with all current resume content intact.
</objective>

<execution_context>
@$HOME/.claude/gsd-core/workflows/execute-plan.md
@$HOME/.claude/gsd-core/templates/summary.md
</execution_context>

<context>
@.planning/STATE.md
@CLAUDE.md

@src/css/print.less
@src/views/Resume.vue
@scripts/export-resume-pdf.js
</context>

<constraints>
This is a **density** fix, not a content cut. `src/views/Resume.vue` must end the task byte-identical to how it started — no sections removed, no sentences shortened, no entries dropped. If the readability floors below are reached and the PDF is still two pages, STOP and report rather than deleting content; the human checkpoint decides what gives.

**Readability floors (hard limits, do not cross):**
- `#app` print `font-size` >= 9pt (currently 10.5pt)
- `#app` print `line-height` >= 1.2 (currently 1.45)
- `@page` margin >= 10mm on every side (currently 14mm/15mm)

**Lever priority — spend cheap space before expensive space.** Whitespace cuts are invisible to a reader; type-size cuts are not. Work down this list, re-measuring as you go, and stop as soon as the page count hits 1:
1. Vertical rhythm (free): section margins, h2 margin/padding, entry margins, grid gaps, footer/summary/contact spacing.
2. Heading scale (cheap): `.resume-name` 1.9em and the print `.project-entry-link` 1.15em are oversized for paper.
3. Page margins down toward the 10mm floor.
4. `line-height` down toward the 1.2 floor.
5. Base `font-size` down toward the 9pt floor — last resort.
6. Optional, only if 1-5 are exhausted: give `.personal-entries` a 2-column print grid. If you do, override `.personal-label`'s 180px flex-basis (see key_links) or the labels will crowd out the details.
</constraints>

<tasks>

<task type="tracer">
  <name>Task 1: Vertical-rhythm pass through the full export pipeline, measured end to end</name>
  <files>src/css/print.less, public/downloads/Josef-Ubaka-Resume.pdf</files>
  <action>
Prove the whole edit-to-measurement loop on the highest-yield, zero-readability-cost lever before touching type sizes.

Inside the existing `@media print` block only, tighten vertical rhythm. The dominant win is the section-heading spacing that print.less never overrides today: add a `.resume-section h2` rule cutting its bottom margin (20px on screen) and bottom padding (12px on screen) to roughly a quarter of those values — there are five such headings, so this alone reclaims well over a hundred pixels. Then tighten the values print.less already sets: `.resume-section` top margin (22px), `.project-entries` gap (14px), `.entry` bottom margin (14px), `.resume-footer` top margin and top padding (28px/14px), `.contact-row` top margin (14px), `.summary` top margin (18px). Also cut `.project-entry-summary` and `.entry-detail` top margins and `.personal-entries` gap, none of which print.less currently names.

Rough budget for calibration: usable A4 column height at the current 14mm margins is about 760px, and current content runs roughly 1030px of actual ink — so this pass needs to reclaim on the order of 270px, which the spacing cuts above comfortably cover on paper. Treat that as a sanity check on your numbers, not as a target to hit precisely.

Do not change `src/views/Resume.vue`. Do not change `scripts/export-resume-pdf.js`. Do not add rules outside the `@media print` block.

Then run the real pipeline end to end: `npm run export:resume-pdf` (it chains `npm run build` and the export script, and already wraps the openssl-legacy-provider flag via cross-env). Measure the result.
  </action>
  <verify>
    <automated>cd "D:/Kodning/Portfolio/gamedev-portfolio" && npm run export:resume-pdf && grep -ao "/Count [0-9]*" public/downloads/Josef-Ubaka-Resume.pdf | sort -u</automated>
  </verify>
  <done>`npm run export:resume-pdf` completes without error, the page-count grep prints a single distinct value, and that value is lower than the starting `/Count 3`. Reaching `/Count 1` already in this pass is a fine outcome — skip straight to Task 3 if so.</done>
</task>

<task type="auto">
  <name>Task 2: Iterate remaining levers until the page tree reports exactly one page</name>
  <files>src/css/print.less, public/downloads/Josef-Ubaka-Resume.pdf</files>
  <action>
Converge on one page. Expect several cycles — this is a measure-adjust-measure loop, not a single edit.

Each cycle: apply the next lever from the priority list in the plan's constraints block, re-run `npm run export:resume-pdf`, re-run the page-count grep, and record the value. Because the `page-break-inside: avoid` rules make page count drop in steps rather than smoothly, a cycle that leaves the count unchanged has still moved you closer — keep going rather than over-correcting with a large jump.

Optional accelerator if the full build cycle feels slow: the export script reads `dist/` and never builds, so you may tune candidate values directly against the compiled stylesheet in `dist/css/` and re-run only `node scripts/export-resume-pdf.js` to measure. If you use this, the settled values MUST be written back into `src/css/print.less` and the final measurement MUST come from a clean full `npm run export:resume-pdf`, so the committed PDF provably derives from committed source.

Respect the readability floors. If you reach all three floors and the count is still above 1, stop, leave the stylesheet at the best readable setting you found, and report the situation for the checkpoint — do not start cutting resume content.

Leave the `.resume-columns` two-column print grid in place; it is load-bearing for horizontal density.
  </action>
  <verify>
    <automated>cd "D:/Kodning/Portfolio/gamedev-portfolio" && npm run export:resume-pdf && grep -ao "/Count [0-9]*" public/downloads/Josef-Ubaka-Resume.pdf | sort -u && grep -v '^[[:space:]]*//' src/css/print.less | grep -c '@media print' && git diff --name-only -- src/views/Resume.vue scripts/export-resume-pdf.js | wc -l</automated>
  </verify>
  <done>
The page-count grep prints exactly one distinct value and it is `/Count 1`; the print-block count prints `1` (all rules still live in a single print media block, nothing leaked to global scope); and the diff check prints `0` (Resume.vue and the export script are untouched). If the floors were hit before reaching one page, the count may remain above 1 — in that case the other two checks must still pass and the shortfall must be written up for the checkpoint.
  </done>
</task>

<task type="checkpoint:human-verify" gate="blocking">
  <name>Task 3: Confirm the one-page PDF still reads well and lost no content</name>
  <what-built>
`src/css/print.less` was tightened inside its `@media print` block — smaller vertical rhythm, trimmed heading scale, and (as needed) tighter page margins, line-height, and base type — and `public/downloads/Josef-Ubaka-Resume.pdf` was regenerated from source via `npm run export:resume-pdf`. Mechanical checks confirm the page tree reports one page and that neither `Resume.vue` nor the export script changed.
  </what-built>
  <how-to-verify>
The machine can count pages; it cannot tell you the resume still looks good. Please check by eye:

1. Open `public/downloads/Josef-Ubaka-Resume.pdf`. Confirm it is **one page** and that nothing spills to a stray second page.
2. Confirm it does not read as cramped — the text should look like a normal printed resume, not shrunk-to-fit. Flag it if the type feels too small or lines feel too tight; there is headroom to trade a little density back if you prefer.
3. Confirm every section survived: your name and title, the contact row, the italic summary, all four Selected Projects with their summaries, both Experience entries, both Education entries, Tech & Language chips plus the languages line, all five Beyond the Code rows, and the footer.
4. Run `npm run serve` and open `/resume` in the browser. Confirm the on-screen page looks exactly as it did before — the print rules should be invisible on screen.
  </how-to-verify>
  <resume-signal>Type "approved", or say what looks off (too dense / too small / a section reads badly / spills to page 2) and it will be tuned further.</resume-signal>
</task>

</tasks>

<threat_model>
## Trust Boundaries

| Boundary | Description |
|----------|-------------|
| local build -> committed binary artifact | The regenerated PDF is a binary committed to the repo and served publicly from `public/downloads/` |

## STRIDE Threat Register

| Threat ID | Category | Component | Severity | Disposition | Mitigation Plan |
|-----------|----------|-----------|----------|-------------|-----------------|
| T-fvb-01 | Information disclosure | `public/downloads/Josef-Ubaka-Resume.pdf` | low | mitigate | The PDF is generated from the already-public `/resume` route only; the human checkpoint visually confirms the document contains exactly the sections already published on the site and nothing extra. |
| T-fvb-02 | Tampering | committed PDF vs. source | low | mitigate | Final measurement is required to come from a clean full `npm run export:resume-pdf`, so the shipped binary provably derives from committed `print.less` rather than from hand-edited `dist/` CSS. |
| T-fvb-SC | Tampering | npm/pip/cargo installs | low | accept | No package installs occur in this task — it is a stylesheet edit plus a re-run of an existing script. No new dependency is introduced, so the package legitimacy gate does not apply. |
</threat_model>

<verification>
- `grep -ao "/Count [0-9]*" public/downloads/Josef-Ubaka-Resume.pdf | sort -u` prints exactly `/Count 1`
- `grep -v '^[[:space:]]*//' src/css/print.less | grep -c '@media print'` prints `1`
- `git diff --name-only -- src/views/Resume.vue scripts/export-resume-pdf.js | wc -l` prints `0`
- `npm run lint` passes
- Human checkpoint approved: PDF is one page, readable, content-complete, and on-screen `/resume` unchanged
</verification>

<success_criteria>
The committed `public/downloads/Josef-Ubaka-Resume.pdf` is a single page containing every section the three-page version contained, produced solely by density changes inside the `@media print` block of `src/css/print.less`, reproducible with `npm run export:resume-pdf`, with the on-screen resume untouched and the result approved by eye.
</success_criteria>

<output>
Create `.planning/quick/260807-fvb-compress-print-stylesheet-so-resume-pdf-/260807-fvb-SUMMARY.md` when done. Record the final density values landed on (base font, line-height, page margins) and the page-count reading from each iteration cycle, so a future tuning pass knows how much headroom was left.
</output>