---
created: 2026-07-22T09:01:07.468Z
title: Swap Dispater timeline gif and project page gif
area: content
files:
  - src/data/GameProjectsData.ts
  - public/img/projects/dispater/DispaterGif.gif
  - public/img/projects/dispater/DispaterGif2.gif
---

## Problem

Dispater currently uses `DispaterGif2.gif` (or whichever is currently wired) as its timeline thumbnail. Josef wants to swap which gif shows on the timeline vs. which shows on the project detail/overlay page: put the other gif (`DispaterGif.gif`) on the timeline, and move `DispaterGif2.gif` to the project overlay page instead.

## Solution

- Check current wiring in `GameProjectsData.ts` / `GameProjects.vue` (LazyVideoThumbnail) for which Dispater gif is used where
- Swap: timeline thumbnail → `DispaterGif.gif`, overlay/project page → `DispaterGif2.gif`
- Note: Phase 1 (01-03-PLAN) already repointed Dispater's overlay screenshots to lazy WebP and added its YouTube trailer — check this todo doesn't conflict with that work before implementing
