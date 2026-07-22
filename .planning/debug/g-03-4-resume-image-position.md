---
status: diagnosed
trigger: "G-03-4-resume-image-position: Resume page image (actualResume.png) sits too far up on the page — user wants it to move down a bit."
created: 2026-07-22T00:00:00.000Z
updated: 2026-07-22T00:00:00.000Z
---

## Current Focus

hypothesis: CONFIRMED — `.resume-page` in src/views/Resume.vue uses `align-items: flex-start` with no top spacing (margin/padding) on the flex container or the `.resume-image`, and `.main` in App.vue supplies no top padding on desktop (`padding: 0 48px 40px`) / minimal 16px on mobile. The image therefore renders flush against the top of the `.main` content area.
test: Read src/views/Resume.vue and src/App.vue directly — no runtime reproduction needed, this is static CSS.
expecting: n/a — confirmed by direct code read.
next_action: none — diagnose-only mode, returning root cause to caller.

## Symptoms

expected: A single centered resume image fills the column up to its width cap, positioned with reasonable vertical breathing room (not jammed against the top of the viewport).
actual: "The resume png should move down a little bit — it's currently too far up on the page."
errors: None reported
reproduction: Test 4 in Phase 3 UAT (03-UAT.md) — run `npm run serve`, visit /resume
started: Discovered during Phase 3 UAT (2026-07-22)

## Eliminated

(none — root cause found on first read, no false hypotheses)

## Evidence

- timestamp: 2026-07-22
  checked: src/views/Resume.vue (full file, 34 lines)
  found: |
    .resume-page { display: flex; justify-content: center; align-items: flex-start; width: 100%; }
    .resume-image { width: 100%; height: auto; display: block; max-width: 1100px; }
    (desktop media query only raises max-width to 1200px, no vertical spacing added anywhere)
  implication: align-items: flex-start pins the image to the top edge of the flex container with zero top margin/padding — this is the direct cause of the image sitting "too far up."

- timestamp: 2026-07-22
  checked: src/App.vue .main / #app rules
  found: |
    .main { padding: 16px 20px 40px; }  (mobile)
    @media (min-width: 620px) { .main { padding: 0 48px 40px; } }  (desktop — zero top padding)
  implication: Desktop specifically has NO top padding on `.main`, so the resume image (flex-start aligned, no own top margin) sits immediately below the Header with no breathing room. Confirms symptom is worst on desktop viewport.

## Resolution

root_cause: >
  In src/views/Resume.vue, `.resume-page` uses `align-items: flex-start` and neither the
  `.resume-page` container nor `.resume-image` has any top margin/padding. Combined with
  `.main`'s zero top padding on desktop (App.vue, min-width:620px media query), the resume
  image renders flush against the top of the content column with no vertical breathing room.
fix: (not applied — goal is find_root_cause_only)
verification: (not applicable — diagnose-only mode)
files_changed: []
