---
phase: 04-game-jams-section
reviewed: 2026-07-23T00:00:00Z
depth: standard
files_reviewed: 1
files_reviewed_list:
  - src/views/GameProjects.vue
findings:
  critical: 0
  warning: 1
  info: 2
  total: 3
status: issues_found
---

# Phase 04: Code Review Report

**Reviewed:** 2026-07-23T00:00:00Z
**Depth:** standard
**Files Reviewed:** 1
**Status:** issues_found

## Summary

Reviewed the single additive change in this phase: a new `<section class="game-jams">` block in `src/views/GameProjects.vue` (an `<h2>` subheading plus two hardcoded `<a target="_blank" rel="noopener noreferrer">` links to itch.io) and its four accompanying scoped CSS classes. No `<script>` changes were made — the diff is template markup + CSS only, so the logic-bug surface is small.

Cross-checked the markup against `04-01-PLAN.md`'s locked requirements: placement (after `.project-timeline`, before `<ProjectDetailsOverlay>`), exact link text (`The Eldritch Keeper`, `Mas-Q`), exact `href` values, `target="_blank"` + `rel="noopener noreferrer"` on both anchors, and the prohibition against `ProjectData`/card/overlay/media markup. All of these match — no divergence from spec, no injected/dynamic `href`, no missing tabnabbing mitigation.

Both itch.io URLs were verified live (HTTP 200 for `https://juice-f.itch.io/the-eldritch-keeper` and `https://superguardian.itch.io/mas-q`) — not dead or mistyped links.

No Critical issues found. One Warning (accessibility) and two Info items (maintainability/consistency) below — none are functional or security defects.

## Warnings

### WR-01: New-tab external links give no accessible indication they open in a new tab

**File:** `src/views/GameProjects.vue:56-67`
**Issue:** Both `.game-jam-link` anchors use `target="_blank"` but expose no visual or assistive-technology cue (visually-hidden text, `aria-label` suffix, or icon) that activating them opens a new browser tab. Screen-reader users and users relying on back-button expectations get no warning before the context changes unexpectedly. This is a recognized accessibility guideline (WCAG 3.2.5 / G201). Since this is new code introduced in this phase (not a pre-existing link left untouched), it's reasonable to hold it to this bar even though other pre-existing links in the codebase (see IN-02) share a related gap.
**Fix:** Add visually-hidden text (or an `aria-label`) indicating the new-tab behavior, e.g.:
```html
<a
  class="game-jam-link"
  href="https://juice-f.itch.io/the-eldritch-keeper"
  target="_blank"
  rel="noopener noreferrer"
>The Eldritch Keeper<span class="visually-hidden"> (opens in a new tab)</span></a>
```
with a standard `.visually-hidden` clip-based utility class (`position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0,0,0,0);`).

## Info

### IN-01: Near-duplicate anchor markup could be array-driven

**File:** `src/views/GameProjects.vue:56-67`
**Issue:** The two `<a class="game-jam-link">` blocks are structurally identical, differing only in `href` and visible text. This same file already establishes an array/object-driven pattern for repeated per-project content (`thumbVideos`, `thumbPosters`, `summaries`, `projectRows`, all keyed and rendered via `v-for`). Hardcoding two links directly in markup is a defensible simplification at this size (the plan explicitly scoped this as static markup, not a `ProjectData`-style treatment), but if a third jam is added later, the pattern will require copy-pasting another near-identical block by hand.
**Fix:** No action required at 2 items. If a third link is added, consider a small local array rendered with `v-for`:
```ts
gameJams: [
  { name: "The Eldritch Keeper", url: "https://juice-f.itch.io/the-eldritch-keeper" },
  { name: "Mas-Q", url: "https://superguardian.itch.io/mas-q" },
]
```

### IN-02: `rel` attribute inconsistency across the codebase (context, not a regression)

**File:** `src/views/GameProjects.vue:59-60, 65-66`
**Issue:** The new links correctly use `rel="noopener noreferrer"`, which actually highlights that several pre-existing external links elsewhere (`src/views/Contact.vue:11,15,19,23`, `src/data/GameProjectsData.ts:35,66,93`, `src/data/OtherProjectsData.ts`) use `target="_blank"` without any `rel` attribute — a real (if minor) tabnabbing/referrer-leak gap on those older links. Flagging for visibility only; those files are outside this phase's diff and were not touched, so no fix is required as part of this review.
**Fix:** N/A for this phase. Consider a follow-up pass to add `rel="noopener noreferrer"` to all existing `target="_blank"` links site-wide for consistency.

---

_Reviewed: 2026-07-23T00:00:00Z_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
