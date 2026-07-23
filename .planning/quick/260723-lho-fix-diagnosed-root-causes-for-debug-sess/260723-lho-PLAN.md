---
phase: quick
plan: 260723-lho
type: execute
wave: 1
depends_on: []
files_modified:
  - .planning/debug/g-03-4-resume-image-position.md
  - .planning/debug/g-03-5-sitewide-horizontal-spacing.md
  - .planning/debug/g-03-8-overlay-gradient-black-bar.md
  - .planning/phases/03-visual-polish-resume-site-metadata/03-UAT.md
autonomous: true
requirements: []
---

<objective>
Confirm-and-reconcile the three diagnosed Phase 03 gaps (g-03-4 resume position, g-03-5 sitewide horizontal spacing, g-03-8 overlay gradient black bar), then flip their debug-session and UAT statuses to reflect closure.

⚠ PREMISE CORRECTION (verified against the repo before planning): **all three code fixes are already applied on disk.** The task was framed as "root cause confirmed, no fix applied yet," but that is stale:
- **g-03-4** — `src/views/Resume.vue` already has `padding-top: 48px` on `.resume-page` (clean/committed, matches HEAD). Prior gap-closure plan 03-03. Nothing to edit.
- **g-03-5** — `src/App.vue` desktop media query already has `max-width: 1600px` on `.main, .header, .footer` (committed in HEAD; unchanged on disk). Prior gap-closure plan 03-03 raised 1280px→1600px. Nothing to edit. (The constraint anticipated this: "confirm current state and either close as already-fixed or specify what still needs adjusting" → **closing as already-fixed**.)
- **g-03-8** — `src/components/ProjectDetailsOverlay.vue` `.dialog` no longer carries `padding-bottom: 10px` (grep count 0), so the trailing strip that produced the black bar is gone; the `.dialog-content` gradient ends in purple `#2b123f 100%` and its box now reaches `.dialog`'s bottom edge. This fix currently lives **inside Josef's uncommitted redesign** of that file. Per the scope guard, DO NOT touch the redesign — verify only, and flag that the fix ships when the redesign is committed.

Because the code is already correct, this plan does **zero source edits**. It records grep evidence, then updates the stale planning docs. No changes to `src/`.

Purpose: Stop the "diagnosed-but-never-closed" rot — reflect reality in the debug sessions and Phase 03 UAT so the milestone books can close honestly.
Output: 3 debug-session files flipped `diagnosed → resolved`; 03-UAT.md gaps/tests confirmed reconciled.

Scope guard: NO edits to `src/App.vue` or `src/components/ProjectDetailsOverlay.vue` (uncommitted redesign — leave untouched). If a future step ever needs to touch the same CSS property the redesign owns, flag the conflict instead of overwriting.
</objective>

<execution_context>
@$HOME/.claude/gsd-core/workflows/execute-plan.md
@$HOME/.claude/gsd-core/templates/summary.md
</execution_context>

<context>
@.planning/STATE.md
@.planning/debug/g-03-4-resume-image-position.md
@.planning/debug/g-03-5-sitewide-horizontal-spacing.md
@.planning/debug/g-03-8-overlay-gradient-black-bar.md
@.planning/phases/03-visual-polish-resume-site-metadata/03-UAT.md
</context>

<tasks>

<task type="auto">
  <name>Task 1: Confirm g-03-4 + g-03-5 fixes present, close their debug sessions</name>
  <files>.planning/debug/g-03-4-resume-image-position.md, .planning/debug/g-03-5-sitewide-horizontal-spacing.md</files>
  <action>Do NOT edit any source file. First prove both fixes are present with grep (see verify). Then update the two debug-session markdown files to reflect closure. In `g-03-4-resume-image-position.md`: set frontmatter `status: resolved`; in the `## Resolution` block set `fix:` to "src/views/Resume.vue .resume-page already carries padding-top: 48px (scoped to /resume only, no change to global .main padding) — applied by gap-closure plan 03-03, committed in HEAD", set `verification:` to "grep -c 'padding-top: 48px' src/views/Resume.vue == 1; Phase 03 UAT Test 6 (resume top-spacing re-check) = pass", and set `files_changed: [src/views/Resume.vue]`. In `g-03-5-sitewide-horizontal-spacing.md`: set frontmatter `status: resolved`; set `fix:` to "src/App.vue desktop (min-width:620px) media query already caps .main/.header/.footer at max-width: 1600px (raised from the diagnosed 1280px by gap-closure plan 03-03) — committed in HEAD and preserved on disk under the uncommitted redesign", set `verification:` to "grep -c 'max-width: 1600px' src/App.vue == 1; Phase 03 UAT Test 7 (column-width re-check) = pass", and set `files_changed: [src/App.vue]`. Keep every other line of both files intact.</action>
  <verify>
    <automated>grep -c 'padding-top: 48px' src/views/Resume.vue; grep -c 'max-width: 1600px' src/App.vue; grep -c 'status: resolved' .planning/debug/g-03-4-resume-image-position.md; grep -c 'status: resolved' .planning/debug/g-03-5-sitewide-horizontal-spacing.md</automated>
  </verify>
  <done>Both source greps return 1 (fixes confirmed present, unchanged). Both debug-session files show `status: resolved` with filled `fix`/`verification`/`files_changed`. No `src/` file was modified.</done>
</task>

<task type="auto">
  <name>Task 2: Confirm g-03-8 fix present in the uncommitted redesign, close its debug session</name>
  <files>.planning/debug/g-03-8-overlay-gradient-black-bar.md</files>
  <action>Do NOT edit `src/components/ProjectDetailsOverlay.vue` — it holds Josef's uncommitted redesign and the scope guard forbids touching it. Prove the black bar is gone with grep (see verify): `.dialog` no longer has `padding-bottom` (count 0), and the `.dialog-content` gradient still ends in purple `#2b123f 100%` (count 1). The diagnosed root cause was `.dialog`'s `padding-bottom: 10px` exposing its solid `background-color: #000000` below the gradient; the redesign removed that padding, so `.dialog-content`'s gradient box now reaches `.dialog`'s bottom edge and no black strip remains. The residual `background-color: #000000` still on `.dialog` is now fully covered by its children (harmless) — do NOT remove it, that is redesign territory. Update `g-03-8-overlay-gradient-black-bar.md`: set frontmatter `status: resolved`; in `## Resolution` set `fix:` to "Resolved inside the uncommitted ProjectDetailsOverlay.vue redesign: .dialog no longer declares padding-bottom:10px, so .dialog-content's gradient (…#2b123f 100%) reaches the dialog's bottom edge — no trailing black strip. .dialog's residual background-color:#000000 is now fully covered by its children and left as-is (redesign-owned). No isolated commit is possible because HEAD's overlay has no gradient at all — the fix ships when Josef commits his redesign.", set `verification:` to "grep -c 'padding-bottom' src/components/ProjectDetailsOverlay.vue == 0; grep -c '#2b123f 100%' src/components/ProjectDetailsOverlay.vue == 1; Phase 03 UAT Test 10 (gradient re-check) = pass", and set `files_changed: [src/components/ProjectDetailsOverlay.vue (uncommitted redesign — not committed by this task)]`. Leave all other lines intact.</action>
  <verify>
    <automated>test $(grep -c 'padding-bottom' src/components/ProjectDetailsOverlay.vue) -eq 0 && echo PADBOTTOM_OK; grep -c '#2b123f 100%' src/components/ProjectDetailsOverlay.vue; grep -c 'status: resolved' .planning/debug/g-03-8-overlay-gradient-black-bar.md; git diff --name-only -- src/components/ProjectDetailsOverlay.vue src/App.vue src/views/Resume.vue | grep -qv . && echo NO_NEW_SRC_EDITS || echo "check: only pre-existing redesign edits should remain"</automated>
  </verify>
  <done>`padding-bottom` count is 0 and gradient endpoint `#2b123f 100%` count is 1 (black bar gone, gradient reaches bottom). Debug file shows `status: resolved` with the redesign-carried note. `src/components/ProjectDetailsOverlay.vue` was NOT edited by this task (only Josef's pre-existing uncommitted redesign remains in its diff).</done>
</task>

<task type="auto">
  <name>Task 3: Reconcile 03-UAT.md gap + test statuses</name>
  <files>.planning/phases/03-visual-polish-resume-site-metadata/03-UAT.md</files>
  <action>Reconcile only — this file already marks G-03-4, G-03-5, G-03-8 as `status: resolved` and re-check Tests 6/7/10 as `pass`, so this is mostly a consistency pass, not a rewrite. Verify each of G-03-4, G-03-5, G-03-8 still reads `status: resolved` with a `resolved_by` and a `debug_session` reference. If (and only if) any of the three still reads `issue`/`open`/unresolved, flip it to `status: resolved`, matching the existing pattern used by the already-resolved entries in this same file (frontmatter-style `status:`/`resolved_by:`/`resolved_at:` keys). Do NOT invent new gaps, do NOT alter G-03-9 or any passing test. Add one line to the `## Current Test` section noting closure confirmation, e.g. "Quick task 260723-lho confirmed g-03-4/g-03-5/g-03-8 fixes present on disk (g-03-4/5 committed via 03-03; g-03-8 carried in the uncommitted overlay redesign) and closed the three debug sessions." Leave the `## Summary` counts as-is unless a status flip actually changed them, in which case recount.</action>
  <verify>
    <automated>test $(grep -c 'status: resolved' .planning/phases/03-visual-polish-resume-site-metadata/03-UAT.md) -ge 4; grep -c '260723-lho' .planning/phases/03-visual-polish-resume-site-metadata/03-UAT.md</automated>
  </verify>
  <done>All three target gaps (G-03-4/5/8) read `status: resolved` in 03-UAT.md; a closure-confirmation note referencing this quick task is present; no unrelated gap/test entry was altered; Summary counts remain internally consistent.</done>
</task>

</tasks>

<verification>
- Source fixes confirmed present, unchanged: `grep -c 'padding-top: 48px' src/views/Resume.vue` = 1; `grep -c 'max-width: 1600px' src/App.vue` = 1; `grep -c 'padding-bottom' src/components/ProjectDetailsOverlay.vue` = 0; `grep -c '#2b123f 100%' src/components/ProjectDetailsOverlay.vue` = 1
- No new edits to `src/`: `git diff` for Resume.vue/App.vue/ProjectDetailsOverlay.vue shows only Josef's pre-existing uncommitted redesign (Resume.vue stays clean), nothing added by this task
- Three debug sessions read `status: resolved`; 03-UAT.md G-03-4/5/8 read `status: resolved` with a 260723-lho closure note
</verification>

<success_criteria>
- Zero source-code edits (fixes were already applied; scope guard on the uncommitted redesign honored)
- g-03-4, g-03-5, g-03-8 debug sessions flipped `diagnosed → resolved` with accurate fix/verification/files_changed
- 03-UAT.md reflects all three gaps closed, consistent with the phase's prior gap-closure pattern
- The g-03-8 caveat (fix lives in uncommitted redesign, no isolated commit possible, ships with the redesign) is recorded, not silently assumed
</success_criteria>

<output>
Create `.planning/quick/260723-lho-fix-diagnosed-root-causes-for-debug-sess/260723-lho-SUMMARY.md` when done.
</output>
