---
type: quick-summary
slug: portfolio-friend-feedback-role-line-caption
date: 2026-08-19
status: complete
---

# Summary — Portfolio friend-feedback pass

Three fixes from an outside review of the live site.

| Fix | File | Commit |
|---|---|---|
| Backdrop click closes overlay | `src/components/ProjectDetailsOverlay.vue` | f56614b |
| Captions rewritten in first person (15) | `src/data/GameProjectsData.ts` | 1caea93 |
| Role/stack line on timeline cards | `src/views/GameProjects.vue` | 9852878 |

## Notes
- `--project-accent` is `#2C3D7A` on four of five projects — too dark for text on
  the dark background. Role line uses `#f4cde6` at 0.85 opacity instead.
- Role text is derived only from the existing "About this game" blocks; nothing invented.
- Caption rewrite keeps every technical claim, changes register only.

## Verification
- `npm run lint` — clean.
- `npm run serve` — compiles, dev server answers 200 on :8080. Visual check pending with user.
