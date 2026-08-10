---
id: 260810-huz
title: Rebalance resume PDF vertical spacing so content fills page evenly
mode: quick
status: planned
created: 2026-08-10
---

# Quick Task 260810-huz: Rebalance resume PDF vertical spacing

## Problem

The exported one-page resume PDF looks cramped at the top and leaves a large
empty band at the bottom. Measured on the committed
`public/downloads/Josef-Ubaka-Resume.pdf`:

- printable box (10mm margins): 740 x 980 px
- ink spans y = 20..866 px
- gap above ink: 5.3mm (inside the 10mm margin)
- gap below ink: 30.2mm
- vertical fill: 88.4%

Cause: `src/css/print.less` was compressed hard during earlier "fit on one page"
passes (line-height 1.2, section margins 3px, entry gaps 2px, heading margins
1px). The content now fits with ~30mm to spare, so the compression is no longer
needed and all of the slack pools at the bottom.

## Approach

Relax the print-only spacing levers in `src/css/print.less` until the ink fills
the printable box with a balanced top/bottom gap, while staying on ONE page.
Screen styles are untouched — every edit stays inside `@media print`.

Levers, in order of preference:
1. `@page` margin — raise vertical margin so the paper edge gap is balanced
2. `#app` line-height — the largest single lever (applies to ~35 text lines)
3. Block rhythm — `.resume-section` margin-top, `.resume-section h2`
   margin/padding, `.project-entries` gap, `.entry` margin-bottom,
   `.resume-footer` margin/padding, `.contact-row`, `.summary`,
   `.project-entry-summary`, `.entry-detail`, `.languages`, `.tech-chip` padding

Measurement is empirical: a scratchpad script inflates the PDF content stream and
reports page count plus ink extents, so each iteration is verified against real
output rather than eyeballed.

## Tasks

### Task 1 — Rebalance print spacing

- **files:** `src/css/print.less`
- **action:** Raise `@page` vertical margin and increase the compressed spacing
  values / line-height so ink fills the printable box evenly.
- **verify:** `npm run build && node scripts/export-resume-pdf.js`, then measure
  the produced PDF: `pages: 1`, gap above and below ink within ~3mm of each other,
  fill >= 97% of the printable box.
- **done:** PDF is one page with balanced top/bottom whitespace.

### Task 2 — Regenerate the committed PDF

- **files:** `public/downloads/Josef-Ubaka-Resume.pdf`
- **action:** Commit the regenerated export so the download link serves the
  rebalanced version.
- **verify:** `git status` shows the PDF modified; measurement script reports the
  same numbers as Task 1's final iteration.
- **done:** Committed.

## Must haves

- Exported PDF stays exactly ONE page
- Top and bottom whitespace visually balanced
- No change to the on-screen `/resume` route (all edits inside `@media print`)
