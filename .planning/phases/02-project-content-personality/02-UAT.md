---
status: complete
phase: 02-project-content-personality
source: [02-01-SUMMARY.md, 02-02-SUMMARY.md]
started: 2026-07-23T11:35:00.000Z
updated: 2026-07-23T12:10:00.000Z
mvp_mode: true
user_story: "As a recruiter or technical lead browsing the portfolio, I want to see accurate, warm, technically substantive project information without ever seeing code, so that personality comes through within a deliberate, professional boundary."
---

## Current Test

[testing complete]

## Tests

### 1. Hero section read-through
expected: Open /game-projects and read the hero section top to bottom. It should read warm and personal ("Hello there!"), while staying short and professional — no grammar issues, no code shown anywhere.
result: issue
reported: "if you could swap out Resident Evil to Arkham Horror, would be great. Besides that, pass."
severity: minor

### 2. Drag Rush overlay — attribution wording
expected: Click Drag Rush's project card to open its overlay, read the "About this game" section. It should state a team of 6 (3 programmers, 3 artists) and name Josef's vehicle animation trees + Beat Conductor contribution, reading natural and appropriately technical for a recruiter — no code shown.
result: issue
reported: "Remove the line \"Custom made beat conductor\" since it already states above that we made one."
severity: minor

### 3. Dispater overlay — attribution wording
expected: Click Dispater's project card, read the "About this game" section. It should state a team of 7 (3 programmers, 4 artists) and name Josef's dialogue/task/interaction systems + audio engineering contribution, reading natural — no code shown.
result: issue
reported: "\"About this game\" title should be centered above the text, goes for all overlays not only dispater. And change the color of Close text to white instead of gray, all overlays."
severity: cosmetic

### 4. Floor 0 + SwingSpace overlays — general content read
expected: Click through Floor 0 and SwingSpace's overlays too. Content should read accurate and technically substantive, free of typos, no code shown anywhere.
result: pass

### 5. Full personality-boundary read-through (mascot + tone + no-code guarantee)
expected: Across the whole site (hero, all 4 overlays, header, footer), the mascot (Guy.gif) appears only in the header and footer — nowhere else. Overall tone stays warm but within a professional boundary throughout. No source code is visible anywhere on the site. This is the real visual confirmation Josef gave only a provisional phone-based approval for previously (02-02) — this test replaces that provisional approval with an actual one.
result: issue
reported: "FloorZero is missing a dot on the sentence Guaranteed no sleeo for a week minimum"
severity: minor

**Coverage auto-passed entries:**

### 6. All 4 projects' About blocks free of known misspellings, Floor 0 closing line tightened
expected: No occurrences of "rythmgame", "enviroment", "intergration", or "sleep less for days" remain in project copy.
result: pass
source: automated
coverage_id: D3

### 7. Floor 0 has a working "Play on itch.io" link
expected: Floor 0's overlay links to https://juice-f.itch.io/floorzero using the same pattern as sibling projects.
result: pass
source: automated
coverage_id: D4

## Summary

total: 7
passed: 3
issues: 5
pending: 0
skipped: 0

## Gaps

- gap_id: G-02-1
  truth: "Hero section reads warm and personal while staying short and professional; no code shown anywhere."
  status: failed
  reason: "User reported: if you could swap out Resident Evil to Arkham Horror, would be great. Besides that, pass."
  severity: minor
  test: 1
  artifacts:
    - path: "src/views/GameProjects.vue"
      issue: "Hero bio line 11 says 'I love Resident Evil, dogs and working out' — user wants 'Resident Evil' swapped to 'Arkham Horror'"
  missing:
    - "Replace 'Resident Evil' with 'Arkham Horror' in the hero bio sentence in src/views/GameProjects.vue, no other wording changes"
- gap_id: G-02-2
  truth: "Drag Rush About block states team of 6 and names Josef's vehicle animation trees + Beat Conductor contribution, reading natural for a recruiter."
  status: failed
  reason: "User reported: Remove the line \"Custom made beat conductor\" since it already states above that we made one."
  severity: minor
  test: 2
  artifacts:
    - path: "src/data/GameProjectsData.ts"
      issue: "Drag Rush About block has a redundant bullet line 'Custom made \"Beat Conductor\".' (line 32) now duplicating the new attribution line 'I mainly built the vehicle animation trees and helped finalize the Beat Conductor.' (line 30)"
  missing:
    - "Delete the redundant 'Custom made \"Beat Conductor\".<br/>' bullet line from Drag Rush's About block; leave the attribution line and all other bullets untouched"
- gap_id: G-02-3
  truth: "N/A — visual polish request: 'About this game' heading should be centered above its text, in every project overlay (not Dispater-specific)."
  status: failed
  reason: "User reported: \"About this game\" title should be centered above the text, goes for all overlays not only dispater."
  severity: cosmetic
  test: 3
  root_cause: "src/App.vue's global style block sets 'h1, h2, h3, h4, h5 { text-align: left; }' (line 100-102). This rule directly targets the h3 element itself, which overrides the text-align:center inherited from its ancestor '.paragraph.center' div (a directly-matching rule on the element always wins over an inherited value, regardless of the ancestor selector's specificity). Confirmed via grep — no other h3-specific rule exists in projects.less to counteract it."
  artifacts:
    - path: "src/App.vue"
      issue: "Global 'h1, h2, h3, h4, h5 { text-align: left; }' rule forces every h3 (including 'About this game') to left-align, even inside a '.paragraph center' wrapper"
  missing:
    - "Add a scoped override in src/css/projects.less (e.g. '.dialog-content h3 { text-align: center; }') rather than touching the global App.vue rule, which affects headings sitewide (project titles, nav, etc.) — must stay scoped to the overlay only"
- gap_id: G-02-4
  truth: "N/A — visual polish request: overlay's 'Close' button/link should be white, not gray, in every project overlay."
  status: failed
  reason: "User reported: change the color of Close text to white instead of gray, all overlays."
  severity: cosmetic
  test: 3
  root_cause: "The 'Close' link (a.dialog-close-button in src/components/ProjectDetailsOverlay.vue) has no explicit color rule of its own, so it inherits src/css/projects.less's globally-loaded '.dialog-content a { color: #696969; ... }' rule (gray) since it renders inside .dialog-content."
  artifacts:
    - path: "src/components/ProjectDetailsOverlay.vue"
      issue: "a.dialog-close-button has no explicit color declaration, inherits gray (#696969) from projects.less's '.dialog-content a' rule"
  missing:
    - "Add 'color: #ffffff;' to the 'a.dialog-close-button' rule in ProjectDetailsOverlay.vue's scoped style block (overrides the inherited gray without touching the shared '.dialog-content a' rule used by other in-content links)"
- gap_id: G-02-5
  truth: "Floor 0's About block text is free of typos/grammar issues."
  status: failed
  reason: "User reported: FloorZero is missing a dot on the sentence Guaranteed no sleeo for a week minimum"
  severity: minor
  test: 5
  artifacts:
    - path: "src/data/GameProjectsData.ts"
      issue: "Floor 0 About block line 'Guaranteed no sleep for a week minimum' (line 85) has no trailing period"
  missing:
    - "Add a trailing period to 'Guaranteed no sleep for a week minimum' in Floor 0's About block, no other wording changes"
