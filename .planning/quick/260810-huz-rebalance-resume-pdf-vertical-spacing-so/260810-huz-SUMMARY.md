---
id: 260810-huz
title: Rebalance resume PDF vertical spacing so content fills page evenly
mode: quick
status: complete
completed: 2026-08-10
commit: 2bbae75
---

# Quick Task 260810-huz — Summary

## What changed

`src/css/print.less` only (all inside `@media print` — the on-screen `/resume`
route is untouched), plus the regenerated `public/downloads/Josef-Ubaka-Resume.pdf`.

| Lever | Before | After |
|---|---|---|
| `@page` margin | 10mm 10mm | 13mm 12mm |
| `#app` line-height | 1.2 | 1.24 |
| `.resume-section` margin-top | 3px | 8px |
| `.resume-section h2` margin / padding-bottom | 0 0 1px / 0 | 0 0 4px / 2px |
| `.project-entries` gap | 2px | 5px |
| `.entry` margin-bottom | 2px | 5px |
| `.resume-footer` margin-top / padding-top | 3px / 2px | 9px / 5px |
| `.contact-row` margin-top | 2px | 6px |
| `.summary` margin-top | 2px | 6px |
| `.project-entry-summary` / `.entry-detail` margin-top | 1px | 3px |
| `.languages` margin-top | 4px | 8px |
| `.tech-chip` padding / `.tech-chips` gap | 1px 6px / 3px | 2px 7px / 4px |

## Measured result

Measurement was done by inflating the exported PDF's content stream and reading
ink extents (Chrome emits CSS-px content units after its `.24`/`3.125` `cm`
pair), so page count and whitespace are verified numbers, not eyeballed.

| | Before | After |
|---|---|---|
| pages | 1 | 1 |
| printable box | 740 x 980 px | 725 x 958 px |
| ink span | y 20..866 | y 20..943 |
| gap above ink | 5.3mm | 5.3mm |
| gap below ink | 30.2mm | 4.0mm |
| vertical fill | 88.4% | 98.4% |

Paper-edge whitespace is now ~18.3mm top / ~17.0mm bottom instead of 15.3mm top
/ 40.2mm bottom. Rendered PDF was also visually checked in Chrome's viewer: one
page, footer sits just above the bottom margin, no mid-page gaps.

## Notes for future work

An intermediate iteration (line-height 1.28, `.resume-section` 10px,
`.project-entries`/`.entry` 6px, footer 12/6px) spilled onto a second page —
the current values sit ~15px below the one-page ceiling. Any content added to
`Resume.vue`'s PDF variant will need a matching trim here, and the print
stylesheet now carries a comment saying so.
