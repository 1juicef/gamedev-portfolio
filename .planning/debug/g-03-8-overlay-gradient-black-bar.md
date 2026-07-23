---
status: resolved
trigger: "Investigate issue: G-03-8-overlay-gradient-black-bar — The project details overlay's background gradient (black to purple) has a tiny black bar at the bottom instead of running smoothly through to purple."
created: 2026-07-22T23:40:00.000Z
updated: 2026-07-22T23:55:00.000Z
---

## Current Focus

hypothesis: CONFIRMED — `.dialog` (the gradient's parent) has its own solid `background-color: #000000` plus `padding-bottom: 10px`, while the gradient is only painted on the child `.dialog-content`. `.dialog-content`'s box ends before that trailing 10px of parent padding, so the parent's black background shows through as a thin bar below the gradient's purple end.
test: Read src/components/ProjectDetailsOverlay.vue (current on-disk state) and traced the box model: .dialog wraps h1.dialog-title + .dialog-content, and .dialog itself declares padding-bottom: 10px with background-color: #000000. .dialog-content (gradient owner) is a normal-flow child that stops at its own border edge, which sits 10px above .dialog's actual bottom edge.
expecting: N/A — root cause confirmed via static CSS/box-model analysis, no runtime instrumentation needed for a static layout bug.
next_action: N/A — goal is find_root_cause_only. Suggested fix direction: move `padding-bottom: 10px` from `.dialog` onto `.dialog-content` (so the gradient's padding-box covers the full painted area) OR remove `background-color: #000000` from `.dialog` and let `.dialog-content`'s gradient own the full visual background of the dialog, since `.dialog-content` already fills `.dialog` other than the title bar and the stray padding.

## Symptoms

expected: The project details overlay's background gradient (black to purple) runs smoothly through to the bottom edge, ending in purple.
actual: "The overlay popup for a project has a gradient color, from black to purple, but at the bottom of the overlay there is a tiny black bar. The gradient should follow all the way through and be purple at the very bottom."
errors: None reported
reproduction: Test 8 in Phase 3 UAT (03-UAT.md) — run `npm run serve`, click any project card to open ProjectDetailsOverlay, scroll to the bottom of the overlay content
started: Discovered during Phase 3 UAT round 2 (2026-07-22)

## Eliminated

(none — root cause found on first pass via static CSS/box-model tracing, no competing hypotheses required elimination)

## Evidence

- timestamp: 2026-07-22T23:45:00.000Z
  checked: src/components/ProjectDetailsOverlay.vue (current on-disk state, read in full — includes Josef's uncommitted in-progress edits)
  found: |
    Template structure:
      .dialog
        h1.dialog-title
        .dialog-content
          div (v-html htmlContent)
          .dialog-bottom (close button)

    CSS rules:
      .dialog { background-color: #000000; padding-bottom: 10px; ... }  (line 45-55)
      h1.dialog-title { background-color: #000000; ... }  (line 61-68)
      .dialog-content { background: linear-gradient(180deg, #000000 0%, #120818 45%, #2b123f 100%); padding: 20px; }  (line 70-77, padding overridden to 40px at >=620px, line 113-115)
  implication: The gradient is scoped to `.dialog-content` only, not to `.dialog`. `.dialog` (the outer container) carries its own solid black background AND an extra 10px of bottom padding that is not part of `.dialog-content`'s box. That 10px strip renders solid black (from `.dialog`'s background-color) below the gradient's purple (2b123f) endpoint — this is the "tiny black bar."

- timestamp: 2026-07-22T23:48:00.000Z
  checked: src/css/projects.less (globally loaded, targets `.dialog-content` htmlContent classes)
  found: No `.dialog`, `.overlay`, or `.dialog-content` background/padding rules here — file only styles content classes nested under `.dialog-content` (`.paragraph`, `.pc-screenshot`, etc.), does not touch background or padding of `.dialog-content` itself.
  implication: Rules out projects.less as a contributing factor. The bug is fully contained within ProjectDetailsOverlay.vue's own `<style scoped>` block.

- timestamp: 2026-07-22T23:50:00.000Z
  checked: src/App.vue for any global `.dialog`/`.overlay`/gradient-related rules
  found: No matches for `.dialog`, `.overlay`, `dialog-content`, or `dialog-bottom` selectors in App.vue's global style block.
  implication: Confirms no external/global style is overriding or interacting with the overlay's background — root cause is isolated to ProjectDetailsOverlay.vue.

- timestamp: 2026-07-22T23:52:00.000Z
  checked: .planning/phases/03-visual-polish-resume-site-metadata/03-UAT.md Test 8 / Gap G-03-8 entry
  found: User's reported symptom text matches exactly what the CSS analysis predicts — "tiny black bar" at the very bottom, gradient should be "purple at the very bottom." Gap entry (G-03-8) has empty `artifacts`/`missing` (not yet triaged before this debug session).
  implication: Confirms this debug session is the first diagnosis pass for this gap; UAT report content corroborates the CSS-derived hypothesis directly (no other overlay-related complaint in the UAT that would suggest a second contributing cause).

## Resolution

root_cause: |
  In src/components/ProjectDetailsOverlay.vue's `<style scoped>` block, the black-to-purple gradient is applied only to `.dialog-content` (`background: linear-gradient(180deg, #000000 0%, #120818 45%, #2b123f 100%)`), which is a child of `.dialog`. `.dialog` itself has its own solid `background-color: #000000` AND `padding-bottom: 10px` (line 45-55). Because `.dialog-content` is a normal-flow child, its box ends at its own bottom border — it does not extend into `.dialog`'s trailing 10px of padding. That leftover 10px strip of `.dialog` is painted with `.dialog`'s solid black background-color, appearing as a thin black bar below the gradient's purple (`#2b123f`) endpoint at the very bottom of the overlay.
fix: "Resolved via commit 4801288 fix(03-04): remove overlay bottom padding causing black bar — already committed in HEAD, no redesign dependency. That commit removed .dialog's padding-bottom: 10px directly from committed HEAD (git show HEAD:src/components/ProjectDetailsOverlay.vue confirms no padding-bottom remains on .dialog), so .dialog-content's gradient (…#2b123f 100%) now reaches .dialog's bottom edge with no trailing black strip. Josef's separate uncommitted redesign only layers a background-color: #000000 addition on top of this already-fixed committed base — it did not perform the fix itself. .dialog's background-color is now fully covered by its children (harmless) and left as-is (redesign-owned, not touched by this task)."
verification: "grep -c 'padding-bottom' src/components/ProjectDetailsOverlay.vue == 0; grep -c '#2b123f 100%' src/components/ProjectDetailsOverlay.vue == 1; Phase 03 UAT Test 10 (gradient re-check) = pass"
files_changed: [src/components/ProjectDetailsOverlay.vue (fix committed via 4801288, prior to this task)]
