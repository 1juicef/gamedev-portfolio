---
phase: quick-260807-fvb
plan: 01
subsystem: ui
tags: [css, less, print-stylesheet, pdf-export, resume]

requires:
  - phase: quick-260807-fe8
    provides: "print.less @media print stylesheet + scripts/export-resume-pdf.js headless-Chrome PDF export pipeline"
provides:
  - "Tightened @media print density rules in src/css/print.less (vertical rhythm, heading scale, page margins, line-height, base font-size all pushed toward or to their readability floors)"
  - "Regenerated public/downloads/Josef-Ubaka-Resume.pdf, reduced from 3 pages to 2 pages"
  - "Documentation of a Vue 2 scoped-CSS specificity bug that was silently defeating print.less overrides, and the !important fix pattern"
affects: [resume-pdf-export, print-stylesheet]

tech-stack:
  added: []
  patterns:
    - "Vue 2 scoped-style attribute selectors ([data-v-xxxx]) out-specificity plain global class selectors with the same selector text - any global override targeting a scoped component's own class must carry !important or it silently loses the cascade, even inside a more specific media query like @media print."
    - "CSS Grid `order` is valid for grid auto-placement (not just flexbox) - used to reflow visual row-pairing of fixed-order content without touching the DOM/template order."

key-files:
  created: []
  modified:
    - src/css/print.less
    - public/downloads/Josef-Ubaka-Resume.pdf

key-decisions:
  - "Diagnosed and fixed a root-cause CSS specificity bug: the original print.less density rules (and the pre-existing .project-entry-link font-size rule) were silently overridden by Resume.vue's higher-specificity scoped styles and were never actually taking effect, even before this task started. Added !important throughout the density overrides."
  - "Pushed all three explicit readability floors to their limit (font-size 9pt, line-height 1.2, page margin 10mm) after cheaper levers (vertical rhythm, heading scale) were insufficient alone."
  - "Applied the plan's optional lever 6 (2-column print grid for 'Beyond the Code'), but deliberately did NOT force the row (label-left/detail-right) layout the plan's key_links anticipated - measured that a narrow label+detail-column split wrapped the two long entries to more total lines than keeping each entry's natural stacked layout in a wider grid column."
  - "Used CSS `order` to pair the two long 'Beyond the Code' entries (Anime, Music) together and the two short ones (Esports, Current favorites) together in the 2-column grid, minimizing wasted row height - a presentation-only reflow; Resume.vue's DOM/content order is untouched."
  - "Stopped at /Count 2 (not the target /Count 1) after exhausting every lever in the plan's priority list plus two additional ones (order-based row pairing, tech-chip/column-ratio tuning) - the plan's own constraint explicitly permits this outcome once floors are hit, requiring the shortfall be written up for the checkpoint rather than cutting content."

requirements-completed: [QUICK-260807-fvb]

coverage:
  - id: D1
    description: "print.less density pass reduces PDF page count from 3 toward 1, staying within readability floors, with all content intact and on-screen /resume unaffected"
    requirement: QUICK-260807-fvb
    verification:
      - kind: other
        ref: "grep -ao \"/Count [0-9]*\" public/downloads/Josef-Ubaka-Resume.pdf | sort -u"
        status: fail
      - kind: other
        ref: "grep -v '^[[:space:]]*//' src/css/print.less | grep -c '@media print' (expect 1)"
        status: pass
      - kind: other
        ref: "git diff --name-only -- src/views/Resume.vue scripts/export-resume-pdf.js | wc -l (expect 0)"
        status: pass
      - kind: other
        ref: "npm run lint"
        status: pass
      - kind: automated_ui
        ref: "pdftotext -layout extraction confirms every section present, no truncation"
        status: pass
    human_judgment: true
    rationale: "Page count landed at /Count 2, not the plan's target /Count 1 - the machine check itself fails. Whether the 2-page result is an acceptable trade-off (vs. reverting density changes, or deliberately cutting resume content) is a judgment call belonging to the human checkpoint this plan explicitly reserves for that decision. Additionally, no interactive human was available in this execution; a human should still open the PDF and eyeball it before treating this as final, per the plan's Task 3."

duration: ~55min
completed: 2026-08-07
status: complete
---

# Quick Task 260807-fvb: Compress print stylesheet for resume PDF Summary

**Diagnosed a Vue 2 scoped-CSS specificity bug silently defeating print.less overrides, fixed it with `!important`, then exhausted every density lever (vertical rhythm, heading scale, page margins, line-height, base font-size, and an order-based 2-column reflow of "Beyond the Code") to bring the resume PDF from 3 pages to 2 — all three readability floors are now at their limit, and the plan's own contingency for that case (document the shortfall for the human checkpoint) applies.**

## Performance

- **Duration:** ~55 min
- **Completed:** 2026-08-07T09:50:00Z
- **Tasks:** 3 (Task 1 tracer, Task 2 iteration, Task 3 checkpoint — self-verified per orchestrator instruction since no interactive human is available this run)
- **Files modified:** 2 (`src/css/print.less`, `public/downloads/Josef-Ubaka-Resume.pdf`)

## Accomplishments

- Root-caused why the plan's Task 1 vertical-rhythm pass had **zero** measurable effect on first attempt: Vue 2's scoped-style attribute selector (`.foo[data-v-xxxx]`) out-specifies a plain global class selector `.foo` with identical text, so print.less's un-`!important` overrides — including the pre-existing `.project-entry-link { font-size: 1.15em; }` rule that predates this task — were silently losing the cascade to Resume.vue's on-screen scoped values, even inside `@media print`. Fixed by adding `!important` throughout.
- Reduced the PDF from `/Count 3` to `/Count 2` via, in order: fixed vertical rhythm (section/heading margins and padding, entry/gap spacing, footer/contact/summary margins — all `!important`), heading scale (name 1.9em→1.3em, section h2 1.2em→1em, project link 1.3em→1em), page margins (14mm/15mm→10mm/10mm, the floor), line-height (1.45→1.2, the floor), base font-size (10.5pt→9pt, the floor), and the plan's optional lever 6 (2-column grid for the 5 "Beyond the Code" rows).
- Found and fixed a second, unrelated instance of the same specificity bug: `.languages` had an un-overridden 16px scoped top margin that print.less never touched.
- Improved on the plan's lever-6 sketch: tested the plan's suggested row layout (label-left, narrow detail-column) for the 2-column personal-entries grid and measured it *increased* total wrapped-line count for the two long entries (Anime, Music) versus keeping each entry's natural stacked (label-above-detail) layout in a wider column — used the latter instead. Used CSS `order` (valid for grid auto-placement) to pair the two long entries together and the two short ones together, saving further wasted row height without touching Resume.vue's DOM order.
- Verified via `page-break-inside: avoid` removal experiment (test-only, reverted) that the remaining `/Count 2` result is a genuine content-volume overflow (~10 lines / ~140px short even after every optimization applied) — not a leftover cheap-lever opportunity.

## Task Commits

1. **Task 1: Vertical-rhythm pass through the full export pipeline, measured end to end** - `03a328e` (fix) — includes the `!important` specificity fix, since the un-`!important` version measured zero effect
2. **Task 2: Iterate remaining levers until the page tree reports exactly one page** - `fcbdbe4` (fix) — heading scale, floors (margin/line-height/font-size), `.languages` fix, 2-column personal-entries grid with `order`-based pairing, tech-chip/column-ratio tuning

**Plan metadata:** (pending — orchestrator handles the docs commit)

## Files Created/Modified

- `src/css/print.less` — Tightened `@media print` block: vertical rhythm, heading scale, page margins (10mm floor), line-height (1.2 floor), base font-size (9pt floor), 2-column `.personal-entries` grid with `order`-based row pairing, tech-chip density tuning, wider `.resume-columns` ratio. All changes live inside the single existing `@media print` block; verified `grep -c '@media print'` still returns `1`.
- `public/downloads/Josef-Ubaka-Resume.pdf` — Regenerated via `npm run export:resume-pdf` from the committed `src/css/print.less`, page count 3 → 2.

## Decisions Made

- Fixed the scoped-CSS specificity bug with `!important` rather than restructuring Resume.vue's scoped styles (out of scope — Resume.vue must stay byte-identical per the plan's constraints) or moving rules to unscoped global CSS (would affect on-screen appearance, also forbidden).
- Chose stacked label-above-detail layout over row layout for the 2-column "Beyond the Code" grid after measuring both — row layout with a narrow detail column produced more total wrapped lines for the long entries, which would have been counterproductive.
- Used `.personal-entry:nth-child(N) { order: ... }` to reorder visual row-pairing rather than leaving default DOM-order pairing, since the two long entries (source positions 3 and 5) were not adjacent and would otherwise each pair with a short entry, wasting a row's height twice instead of once.
- Stopped pushing further once all three explicit readability floors (9pt font, 1.2 line-height, 10mm margin) were reached and the `page-break-inside: avoid` experiment confirmed a genuine ~10-line content overflow remained. The plan's own `<done>` criteria for Task 2 explicitly anticipates this outcome ("If the floors were hit before reaching one page, the count may remain above 1... the shortfall must be written up for the checkpoint") — did not cut resume content or violate a floor to force `/Count 1`.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed Vue 2 scoped-CSS specificity bug defeating print.less overrides**
- **Found during:** Task 1 (first measurement after the vertical-rhythm pass showed zero change in page count, contradicting the plan's expectation of "well over a hundred pixels" reclaimed)
- **Issue:** Vue 2's `<style scoped>` compiler appends a `[data-v-xxxx]` attribute selector to each of a component's own rules, raising their specificity above a plain global class selector with identical selector text. Every un-`!important` override in print.less targeting a Resume.vue scoped class or property (including the pre-existing `.project-entry-link { font-size: 1.15em; }` rule, unrelated to this task's edits) was silently losing the cascade to the on-screen scoped value, even inside `@media print`.
- **Fix:** Added `!important` to every density-affecting override (`margin`, `padding`, `gap`, `font-size`) that targets a class also styled in Resume.vue's `<style scoped>` block. Documented the reason inline in print.less so future editors don't reintroduce the bug.
- **Files modified:** `src/css/print.less`
- **Verification:** Re-measured after the fix — page count dropped 3→2 (previously unchanged at 3 with the same spacing values sans `!important`).
- **Committed in:** `03a328e` (Task 1 commit)

**2. [Rule 1 - Bug] Fixed `.languages` un-overridden 16px scoped top margin**
- **Found during:** Task 2, while auditing for other properties competing with scoped rules
- **Issue:** Same specificity bug as above, on a property print.less had never named at all (not merely missing `!important` — the selector wasn't present in print.less prior to this task).
- **Fix:** Added `.languages { margin-top: 4px !important; }` to `@media print`.
- **Files modified:** `src/css/print.less`
- **Verification:** Confirmed present in the built `dist/css/app.*.css` `@media print` block after rebuild.
- **Committed in:** `fcbdbe4` (Task 2 commit)

---

**Total deviations:** 2 auto-fixed (both Rule 1 - bugs blocking the plan's stated density-reduction goal)
**Impact on plan:** Both fixes were necessary for the plan's core mechanism (print.less overrides) to function at all. No scope creep — no rules were added outside `@media print`, and Resume.vue/`scripts/export-resume-pdf.js` remain untouched (confirmed via `git diff --name-only -- src/views/Resume.vue scripts/export-resume-pdf.js | wc -l` = `0`).

## Issues Encountered

- **Page count plateaued at `/Count 2` despite exhausting every lever in the plan's priority list.** Diagnosed via a temporary (test-only, reverted) removal of `page-break-inside: avoid` from `.resume-section`: with the whole-section atomicity constraint removed, everything up through the "Beyond the Code" heading fit on page 1, but the entire personal-entries block + footer (~10 lines / ~140px) still overflowed to page 2. This confirmed the shortfall is a genuine content-volume overflow at the readability floors, not a page-break-inside:avoid step artifact or a leftover cheap-lever opportunity. Restored `page-break-inside: avoid` on `.resume-section` afterward (an orphaned heading alone at the bottom of page 1 reads worse than the section moving as a whole).
- **PDF visual rendering could not be captured as a screenshot in this sandboxed run.** Chrome's headless mode does not render its built-in PDF viewer plugin when given a `file://...pdf` URL with `--screenshot` (produces a blank/dark placeholder regardless of `--virtual-time-budget`) — this is a known Chrome headless limitation, not specific to this task. Substituted `pdftotext -layout` full-document text extraction (confirmed every expected section present: name/title, contact row, summary, all 4 Selected Projects, both Experience entries, both Education entries, Tech & Language chips + languages line, all 5 Beyond the Code rows, footer — no truncation, no missing sections) plus a screenshot of the on-screen `/resume` route via the dev server (confirmed visually unchanged — full spacing, no print-density leakage) as the closest available automated proxy for the human visual check. **A human should still open `public/downloads/Josef-Ubaka-Resume.pdf` directly and eyeball it** before treating this as fully verified, per the plan's Task 3 checkpoint intent.

## Known Stubs

None.

## Threat Flags

None — no new network endpoints, auth paths, file access patterns, or schema changes introduced. The threat model's two `mitigate` items (T-fvb-01 visual content confirmation, T-fvb-02 clean-pipeline provenance) are addressed: content confirmed complete via `pdftotext` extraction (T-fvb-01, pending final human eyeball), and the final measurement came from a clean `npm run export:resume-pdf` run against committed `src/css/print.less` (T-fvb-02).

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

**This plan did not reach its stated `/Count 1` success criterion.** The PDF is currently 2 pages, down from the starting 3. All three explicit readability floors (font-size 9pt, line-height 1.2, page margin 10mm) are at their limit, and content-volume analysis confirms roughly 10 lines / ~140px of genuine overflow remains — not further extractable without either cutting resume content (out of scope per the plan's constraints) or violating a floor.

**Open decision for a human:** whether to (a) accept the 2-page PDF as-is, (b) selectively trim resume content (e.g., shorten the "Anime" or "Music" Beyond-the-Code entries, which are the two longest and the direct cause of the remaining overflow) to reach 1 page, or (c) accept a denser-than-preferred single page by trading back some of the margin/line-height/font-size floors set in this plan. This decision was explicitly reserved for the plan's Task 3 human checkpoint and could not be made autonomously.

**Also outstanding:** a direct visual open of `public/downloads/Josef-Ubaka-Resume.pdf` — this run substituted text-extraction and on-screen-route screenshot checks (see Issues Encountered) because PDF-viewer screenshots are not renderable in this sandboxed headless-Chrome environment, but neither check is a substitute for eyeballing the actual rendered PDF pages.

## Self-Check: PASSED

- FOUND: `src/css/print.less`
- FOUND: `public/downloads/Josef-Ubaka-Resume.pdf`
- FOUND: `.planning/quick/260807-fvb-compress-print-stylesheet-so-resume-pdf-/260807-fvb-SUMMARY.md`
- FOUND commit: `03a328e`
- FOUND commit: `fcbdbe4`

---
*Phase: quick-260807-fvb*
*Completed: 2026-08-07*
