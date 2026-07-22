---
created: 2026-07-22T09:01:07.468Z
title: Make timeline title click affordance more visible
area: ui
files:
  - src/views/GameProjects.vue
  - src/css/projects.less
---

## Problem

On the GameProjects timeline, each project title is a clickable link (`.project-title-link`) that opens the project's detail overlay, but visitors have no visual cue that the title itself is clickable — it currently doesn't read as an interactive element.

## Solution

TBD — options to consider when this is planned: underline-on-hover, a subtle persistent underline, a cursor-pointer + color-shift affordance, or a small icon (e.g. arrow/expand glyph) next to the title. Should match the site's existing accentColor-per-project styling convention rather than introducing a new generic link color.
