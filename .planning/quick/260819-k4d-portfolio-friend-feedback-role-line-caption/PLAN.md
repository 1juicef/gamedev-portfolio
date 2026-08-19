---
type: quick
slug: portfolio-friend-feedback-role-line-caption
date: 2026-08-19
---

# Quick: Portfolio friend-feedback pass

Three fixes from friend review of the live portfolio.

## Task 1 — Contribution line on timeline cards
Friend could not tell what Josef himself did without opening the overlay and scrolling.
Add a short role/stack line under `.project-summary` in `src/views/GameProjects.vue`
(both the WIP row and the timeline rows), fed by a new `roles` map in `data()`.
Content sourced from the existing "About this game" blocks in `GameProjectsData.ts` — no invented facts.
Style added in the same file's scoped block.

## Task 2 — De-AI the tech captions
Friend read the `tech-caption` copy in `src/data/GameProjectsData.ts` as ChatGPT-written.
Rewrite all 15 captions in first person, explaining why the thing was done, keeping the same
technical content. No "X instead of Y" boast framing.

## Task 3 — Backdrop click closes overlay
`src/components/ProjectDetailsOverlay.vue`: `.overlay` backdrop has no click handler.
Add `@click="$emit('close')"`. Dialog is a sibling of the backdrop, so no propagation guard needed.

## Verification
`npm run lint` clean, `npm run serve` renders all three changes.
