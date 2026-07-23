---
status: resolved
trigger: "G-03-5-sitewide-horizontal-spacing: Too much dead space on the left and right sides across all pages of the site."
created: 2026-07-22T00:00:00.000Z
updated: 2026-07-22T00:00:00.000Z
---

## Current Focus

hypothesis: The `.main, .header, .footer { max-width: 1280px; margin: 0 auto; }` rule in src/App.vue (desktop breakpoint, >=620px) caps content width well below typical desktop viewport widths (1440px/1920px), and this gap combined with 48px horizontal padding is being perceived as "dead space" on left/right.
test: Confirm max-width/padding values in App.vue are the only global horizontal-layout constraint (no other wrapping container caps width further), and calculate dead space at common viewport widths (1440, 1920).
expecting: max-width 1280px centered on a 1920px viewport leaves 320px unused per side (368px including padding) — enough to read as "too much dead space" per UAT report.
next_action: CONFIRMED — no other wrapping container caps width further (Header.vue/Footer.vue only set width:100% within the same App.vue-imposed 1280px column). Root cause confirmed, diagnosis returned to caller (find_root_cause_only mode).

## Symptoms

expected: Page content reads with intentional, balanced horizontal margins — not excessive dead space on the left/right on any page.
actual: "A bit too much dead space to the left and right of all pages."
errors: None reported
reproduction: Test 5 in Phase 3 UAT (03-UAT.md) — run `npm run serve`, browse any page (/, /game-projects, /other-projects, /resume, /contact) on a typical desktop viewport
started: Discovered during Phase 3 UAT (2026-07-22)

## Eliminated

## Evidence

- timestamp: 2026-07-22T00:00:00.000Z
  checked: src/App.vue style block
  found: |
    `.main { padding: 16px 20px 40px; }` (mobile, <620px)
    `@media (min-width: 620px) { .main { padding: 0 48px 40px; } .main, .header, .footer { max-width: 1280px; margin: 0 auto; } }`
    This is the ONLY place `max-width` is set for the top-level layout containers, and it applies site-wide (App.vue wraps every route via <router-view> inside `.main`, plus Header/Footer siblings get the same cap).
  implication: On any viewport wider than 1280px + margins, content is centered in a fixed 1280px column, producing symmetric dead space that grows linearly with viewport width. At 1920px viewport this is ~320px per side outside the capped column (before the 48px inner padding is even counted).

- timestamp: 2026-07-22T00:00:00.000Z
  checked: src/css/variables.less
  found: Only color variables defined (@bodyBgColor, @contentBgColor, @textColor, @skillRateCircleColor, @accentColor). No width/spacing tokens.
  implication: No competing/overriding width variable exists elsewhere; 1280px in App.vue is the single source of truth for the site's content column width.

- timestamp: 2026-07-22T00:00:00.000Z
  checked: .planning/phases/03-visual-polish-resume-site-metadata/03-UAT.md and STATE.md
  found: G-03-5 gap confirms issue is sitewide ("all pages"), cosmetic severity, reported directly by user after visual read-through. No prior phase decision recorded that intentionally set 1280px as a deliberate/reviewed choice for this milestone (only content/media decisions logged).
  implication: 1280px cap looks like a template default carried over from the forked repo, not a considered decision for this portfolio's typical viewport usage — consistent with hypothesis that it's simply too narrow relative to common desktop widths.

- timestamp: 2026-07-22T00:00:00.000Z
  checked: src/components/Header.vue and src/components/Footer.vue style blocks
  found: |
    Header.vue: `.header { width: 100%; }` — no max-width/margin of its own.
    Footer.vue: `.footer { width: 100%; }` — no max-width/margin of its own.
  implication: Neither component adds or overrides width constraints; both simply fill whatever width their parent (App.vue, which applies `max-width: 1280px; margin: 0 auto;` via the shared `.main, .header, .footer` selector) gives them. This rules out any compounding/duplicate width cap elsewhere and confirms App.vue's rule is the single sitewide source of the dead space.

## Resolution

root_cause: "src/App.vue's desktop (>=620px) media query caps `.main`, `.header`, and `.footer` at `max-width: 1280px; margin: 0 auto;` — the single sitewide layout-width rule. On common desktop viewports (1440px, 1920px, ultrawide), this leaves large symmetric empty columns on both sides of the centered content (e.g. ~320px per side at 1920px width, before the 48px inner .main padding is even counted), which reads as excessive dead space. This is a single global rule affecting every route since all views render inside `.main` and Header/Footer share the same selector."
fix: "src/App.vue desktop (min-width:620px) media query already caps .main/.header/.footer at max-width: 1600px (raised from the diagnosed 1280px by gap-closure plan 03-03) — committed in HEAD and preserved on disk under the uncommitted redesign"
verification: "grep -c 'max-width: 1600px' src/App.vue == 1; Phase 03 UAT Test 7 (column-width re-check) = pass"
files_changed: [src/App.vue]
