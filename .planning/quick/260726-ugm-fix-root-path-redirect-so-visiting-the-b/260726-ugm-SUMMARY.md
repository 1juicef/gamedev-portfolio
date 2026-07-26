---
phase: quick-260726-ugm
plan: 01
subsystem: routing
tags: [router, navigation, vue-router]
dependency-graph:
  requires: []
  provides: [QT-260726-ugm-mount-game-projects-at-root-instead-of-redirecting]
  affects: [src/router/index.ts, src/components/Header.vue]
tech-stack:
  added: []
  patterns: [vue-router direct component mount at root path, shared lazy-import chunk across two route entries]
key-files:
  created: []
  modified:
    - src/router/index.ts
    - src/components/Header.vue
decisions:
  - Root route mounts GameProjects.vue directly (same lazy import/webpackChunkName as /game-projects) instead of redirecting, so the bare domain no longer rewrites the URL to a hash fragment under hash-mode routing.
  - Header's Projects nav-link retargeted from "/game-projects" to "/" so the active-link underline highlights correctly on the landing page (user's explicit choice; accepted tradeoff that old /#/game-projects bookmarks won't show the underline).
metrics:
  duration: ~10 min
  completed: 2026-07-26
status: complete
---

# Phase quick-260726-ugm Plan 01: Fix root path redirect so visiting the bare domain no longer rewrites to a hash URL Summary

Mounted `GameProjects.vue` directly at the root route (reusing the `/game-projects` route's identical lazy import and `webpackChunkName`) instead of redirecting, and retargeted the Header's Projects nav-link from `/game-projects` to `/` so the nav underline stays correct.

## What Was Built

**Task 1 — Mount GameProjects at the root path** (`src/router/index.ts`)
The root route object (`path: '/'`) previously had `redirect: '/game-projects'`. It now has `name: 'Game Projects'` and `component: () => import(/* webpackChunkName: "about" */ '../views/GameProjects.vue')` -- the exact same lazy-import line used by the existing `/game-projects` route, so both paths share one webpack chunk. The `/game-projects` route itself, the catch-all `*` -> `/404` redirect, the `VueRouter` constructor (still receiving only `routes`, no `mode`/`base`), and every other route were left untouched.

**Task 2 — Point the Header's Projects link at root** (`src/components/Header.vue`)
Changed `<router-link to="/game-projects">Projects</router-link>` to `<router-link to="/">Projects</router-link>`. This was flagged during planning as a necessary follow-up: without it, `.router-link-exact-active` would no longer match once the timeline rendered at `/` instead of `/game-projects`, silently dropping the nav underline on the landing page.

## Deviations from Plan

None -- plan executed exactly as written, including the pre-resolved deviation flag (Task 2) that the user had already decided on before execution began.

## Deviation Flag Carried Forward (from planning, resolved by user before execution)

**Accepted tradeoff:** the Header's Projects link now targets `/` instead of `/game-projects`. A visitor arriving via an old bookmarked or externally-linked `/#/game-projects` URL will land on the correct timeline content but will NOT see the Projects nav item underlined (since the current path `/game-projects` no longer matches the link's `to="/"`). This was an explicit user choice and is not considered a bug.

## Verification

- `grep -v '//' src/router/index.ts | grep -c redirect` -> 1 (only the `/404` catch-all remains)
- `grep -v '//' src/router/index.ts | grep -c "mode"` -> 0
- `grep -v '//' src/router/index.ts | grep -c "base"` -> 0
- `grep -c "GameProjects.vue" src/router/index.ts` -> 2
- `grep -c "path:" src/router/index.ts` -> 7
- `grep -c "webpackChunkName" src/router/index.ts` -> 6
- `git diff --stat` (combined across both task commits) -> exactly `src/router/index.ts` and `src/components/Header.vue` changed
- `grep -c 'router-link to="/"' src/components/Header.vue` -> 1
- `grep -c 'router-link to="/game-projects"' src/components/Header.vue` -> 0
- `grep -c 'router-link to="/resume"' src/components/Header.vue` -> 1
- `grep -c 'router-link to="/contact"' src/components/Header.vue` -> 1
- `npm run lint` -> passed after both tasks ("DONE No lint errors found!")

Human-check steps in the plan (visually confirming the dev-server behavior in a browser) were not run by the automated executor -- recommended follow-up before considering this fully confirmed, though all structural/behavioral automated checks passed.

## Self-Check: PASSED

- FOUND: src/router/index.ts (modified, root route now mounts component)
- FOUND: src/components/Header.vue (modified, Projects link now targets "/")
- FOUND commit 28629d7 (Task 1: mount GameProjects at root path)
- FOUND commit cc45e4d (Task 2: point Header Projects link at root path)

---
*Phase: quick-260726-ugm*
*Completed: 2026-07-26*
