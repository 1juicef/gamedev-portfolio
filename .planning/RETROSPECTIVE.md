# Project Retrospective

*A living document updated after each milestone. Lessons feed forward into future planning.*

## Milestone: v1.0 — MVP

**Shipped:** 2026-07-23
**Phases:** 3 | **Plans:** 11 | **Sessions:** ~3 (2026-07-21 → 2026-07-23)

### What Was Built
- A reusable ffmpeg+sharp media pipeline (`scripts/convert-media.js`) converting oversized GIF/PNG masters into compressed, lazy-loaded video thumbnails and WebP screenshots across all 4 projects
- Finalized project content and personality (team attribution, tech blurbs, warm hero copy) within a validated mascot/tone boundary
- A visual polish pass on the timeline, resume page, and overlay, plus real social-preview metadata
- Post-requirements quick-task polish: itch.io badges, a Phase-1 CSS completeness fix, refreshed SwingSpace media, and a new Floor Zero gameplay video

### What Worked
- Reusing the pipeline's exported `gifToMp4`/`extractPoster`/`toWebp` functions directly for one-off asset regenerations (gap closures, post-close media swaps) instead of re-running the full manifest — avoided wasted re-encoding of untouched assets every time
- Hand-built git object staging (`hash-object --no-filters` + `update-index --cacheinfo`) to land a scoped fix inside a file that also had unrelated uncommitted work sitting in the working tree, without disturbing that other work
- Quick tasks (`/gsd-quick`) handled all post-requirements polish cleanly outside the phase/plan structure — no need to open a Phase 4 for small, well-specified follow-ups
- Explicit scope guards in every quick-task plan/executor prompt (naming exactly which files must never be staged) reliably kept an unrelated in-progress redesign out of milestone commits across 3 separate quick tasks

### What Was Inefficient
- Three debug sessions (g-03-4, g-03-5, g-03-8) were diagnosed but never marked resolved, and sat that way through the rest of Phase 3 and into milestone-close — the pre-close audit is what caught this, but it should have been closed the same session the fix landed, not discovered at close time
- A Phase-1 completeness gap (`.pc-video`/`.swing-space-*` CSS referenced in `GameProjectsData.ts` since commit `78090d8` but never styled) went unnoticed for two full phases; it was only found incidentally while investigating an unrelated media-swap request, not by any planned verification step
- `.planning/STATE.md` accumulated uncommitted edits across a milestone-close pause (deferred items note) that a subsequent quick-task executor correctly declined to touch, but that meant a manual follow-up commit was needed — worth an explicit "is STATE.md clean" check before delegating to an executor mid-close

### Patterns Established
- When editing a file that also has unrelated uncommitted changes the user wants preserved, verify the *specific diff content* before assuming it's redesign-entangled — one of this milestone's CSS fixes turned out to be 100% unrelated to the redesign it was initially lumped in with, and would have been wrongly left uncommitted
- Independently re-verify a planning subagent's factual claims about "already fixed" or "already committed" code via direct grep/git-log before acting on them — one quick-task plan misattributed a fix's origin (redesign vs. a separate prior commit), caught and corrected before execution

### Key Lessons
1. Close diagnosed-but-unfixed debug sessions the same session the fix lands — don't let "diagnosed" rot into a silent gap that only surfaces at milestone-close audit
2. A CSS class referenced by a data file needs its stylesheet rule verified in the same commit/plan — "referenced" is not "styled," and this gap survived two phases undetected
3. When an unrelated in-progress change shares a file with a needed fix, diff-audit that file specifically before deciding the whole file is off-limits — the fix may be fully separable

### Cost Observations
- Model mix: opus (planning), sonnet (execution), haiku (checking) — standard GSD quick-task profile throughout
- Sessions: 1 extended session covering phases 1-3 execution/UAT/gap-closure plus milestone close
- Notable: post-requirements quick tasks (itch.io badges, debug closure, media refresh, Floor Zero video) added real value without ever touching ROADMAP.md or opening a new phase — the quick-task path scaled well for this kind of trailing polish

---

## Milestone: v1.1 — Game Jams Section

**Shipped:** 2026-07-23
**Phases:** 1 | **Plans:** 1 | **Sessions:** 1 (same day as v1.0 close)

### What Was Built
- A "Game Jams" subheading + two plain-text itch.io hyperlinks (The Eldritch Keeper, Mas-Q) appended below the existing project timeline in `GameProjects.vue` — one additive template block + scoped styles, no new files/components/data

### What Worked
- Skipping discuss-phase and research entirely for this phase (trivial, exact-string/exact-URL requirements already fully specified in REQUIREMENTS.md) produced zero rework — the plan, execution, and verification all matched on the first pass
- The spec-less edge-probe fallback (no SPEC.md existed) correctly surfaced all 5 generic probe items as explicit flagged assumptions rather than forcing artificial edge-case coverage onto a phase with no real data-structure edges
- Security review short-circuited cleanly at ASVS L1 (plan-time threat register + `threats_open: 0`) without needing to spawn the security-auditor agent — a plain grep confirmed the one real mitigation (`rel="noopener noreferrer"`) was present

### What Was Inefficient
- The `resolves_phase`-tagged pending todo for this feature was NOT auto-closed by execute-phase's `close_phase_todos` step, because verification returned `human_needed` and the phase completed via the UAT → `/gsd-verify-work` → transition path instead of execute-phase's own direct-completion path (which is the only path that runs that step). It was only caught by the milestone-close `audit-open` scan and had to be closed manually.
- The `/gsd-code-review --fix` agent hit the session's usage limit mid-run (right after creating its worktree, before any edits), leaving one non-blocking WCAG 3.2.5 finding (missing "opens in new tab" cue) unfixed. No harm done — the worktree was empty and cleanly removed — but the fix is now carried forward as a PROJECT.md Active item instead of landing same-session.

### Patterns Established
- For a phase whose requirements are already locked to exact strings/URLs (no design ambiguity), autonomous (`yolo` mode) skipping of discuss-phase and research is a safe default — reserve research for phases with real architectural or domain uncertainty

### Key Lessons
1. A `resolves_phase`-tagged todo is only auto-closed on execute-phase's direct-completion path — any phase that goes through human-verification/UAT instead needs its pending todos checked manually at milestone close (or via `audit-open`) rather than assumed closed
2. Subagent fixer/executor runs can be terminated mid-task by the session's own usage limit — check for partial worktrees/commits before retrying, and don't treat a failed fix as a code problem

### Cost Observations
- Model mix: opus (planner, security-auditor when spawned), sonnet (executor, code-reviewer, verifier), haiku (plan-checker) — standard GSD profile
- Sessions: 1 (phase planned, executed, reviewed, verified, security-checked, UAT'd, and milestone-closed in a single continuous session)
- Notable: the code-review `--fix` pass failed on a session usage-limit hit, not a logic error — first occurrence of this failure mode recorded in this project's history

---

## Cross-Milestone Trends

### Process Evolution

| Milestone | Sessions | Phases | Key Change |
|-----------|----------|--------|------------|
| v1.0 | ~3 | 3 | Established the media pipeline + quick-task-driven post-close polish pattern |
| v1.1 | 1 | 1 | First milestone to fully exercise the security-review (ASVS L1) and spec-less probe fallback gates end-to-end |

### Cumulative Quality

| Milestone | Tests | Coverage | Zero-Dep Additions |
|-----------|-------|----------|-------------------|
| v1.0 | 11 UAT scenarios (Phase 3) | N/A (no automated test suite) | ffmpeg, sharp (both dev-only, not shipped to browser) |
| v1.1 | 2 UAT scenarios (Phase 4) | N/A (no automated test suite) | None |

### Top Lessons (Verified Across Milestones)

1. Close diagnosed debug sessions immediately — don't defer status updates to milestone-close audits
2. `resolves_phase`-tagged todos aren't guaranteed auto-closed on every completion path — verify at milestone close, don't assume
