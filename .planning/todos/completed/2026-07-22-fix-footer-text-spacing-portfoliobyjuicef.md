---
created: 2026-07-22T09:01:07.468Z
title: Fix footer text spacing PortfolioByJuicef
area: ui
files:
  - src/components/Footer.vue
completed: 2026-07-22
resolved_by: "Quick task 260722-ot7 (spacing rollback) + follow-up fix c1d7afe (CSS margin, since inline-flex was collapsing the text-node space)"
---

## Problem

Footer currently displays the text "PortfolioByJuicef" with no spacing between the words — reads as one run-together word instead of "Portfolio By Juicef" (or similar).

## Solution

Locate the footer text string in `Footer.vue` and add spacing (either fix the literal string to "Portfolio By Juicef", or adjust CSS letter/word-spacing if the run-together look is unintentional from styling rather than the text itself — check which before editing).
