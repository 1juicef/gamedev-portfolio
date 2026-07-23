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

## Cross-Milestone Trends

### Process Evolution

| Milestone | Sessions | Phases | Key Change |
|-----------|----------|--------|------------|
| v1.0 | ~3 | 3 | Established the media pipeline + quick-task-driven post-close polish pattern |

### Cumulative Quality

| Milestone | Tests | Coverage | Zero-Dep Additions |
|-----------|-------|----------|-------------------|
| v1.0 | 11 UAT scenarios (Phase 3) | N/A (no automated test suite) | ffmpeg, sharp (both dev-only, not shipped to browser) |

### Top Lessons (Verified Across Milestones)

1. Close diagnosed debug sessions immediately — don't defer status updates to milestone-close audits
