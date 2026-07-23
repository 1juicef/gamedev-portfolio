---
created: 2026-07-22T20:32:32.313Z
title: Deploy portfolio to custom domain www.josefubaka.com
area: deployment
resolves_phase: 7
files:
  - public/index.html
---

## Problem

Josef purchased the custom domain www.josefubaka.com and wants the portfolio deployed there instead of (or in addition to) the GitHub Pages project URL. Phase 3 (META-01) already locked `og:url` and `og:image` in `public/index.html` to `https://1juicef.github.io/gamedev-portfolio/` per CONTEXT.md decisions D-08/D-09 — those values become stale once the custom domain goes live, and Phase 3's UAT test 3 (social-preview card rendering) was left `blocked` because there was no live URL to test against at all.

## Solution

TBD — likely: set up DNS (CNAME record) pointing www.josefubaka.com at the GitHub Pages host, add a `CNAME` file to the deploy output (or configure it in the repo's Pages settings), confirm GitHub Pages recognizes the custom domain, then update `public/index.html`'s `og:url` and `og:image` to the new domain and re-verify the social-preview card renders correctly (re-run Phase 3 UAT test 3 or a fresh manual check).
