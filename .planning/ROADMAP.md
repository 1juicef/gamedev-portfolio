# Roadmap: Josef's Game Dev Portfolio

## Overview

This redesign pass takes the existing 4-project Vue 2 portfolio from "already working" to "reads as polished and professional within a 10-second scan, without ever showing code." The work moves in three stages: first fix what silently undermines every other change (multi-megabyte GIF/PNG assets slowing the page), then land the content and personality decisions that give the site its voice (team attribution, tech blurbs, hero tone, personality boundary), and finally apply the mechanical, low-risk finishing touches (layout polish, resume image, site metadata) once the copy it depends on is settled.

## Phases

**Phase Numbering:**

- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Media & Performance Optimization** - Convert oversized GIF thumbnails to video and compress/lazy-load all project images so the site loads fast and lean
- [ ] **Phase 2: Project Content & Personality** - Land team attribution, finalized tech blurbs, warm hero copy, and a checked personality boundary
- [ ] **Phase 3: Visual Polish, Resume & Site Metadata** - Polish the timeline layout, ship the resume as an image, and fix shared-link metadata

## Phase Details

### Phase 1: Media & Performance Optimization

**Goal**: As a recruiter or technical lead browsing the portfolio, I want to see project media load fast and lean, so that multi-megabyte GIFs and PNGs no longer slow down my first impression.
**Mode:** mvp
**Depends on**: Nothing (first phase)
**Requirements**: MEDIA-01, MEDIA-02, MEDIA-03
**Success Criteria** (what must be TRUE):

  1. SwingSpace and Floor 0 timeline thumbnails play as muted, looping video clips instead of shipping as multi-MB GIFs
  2. Project screenshots across all 4 projects (Drag Rush, Dispater, Floor 0, SwingSpace) load as compressed WebP images in the overlay
  3. Every project image — including images inside hand-authored description HTML and below-fold timeline thumbnails — loads lazily, keeping initial site weight low

**Plans:** 3/3 plans executed, 1 gap closure plan pending

Plans:
**Wave 1**

- [x] 01-01-PLAN.md — Media conversion pipeline: install ffmpeg + sharp, write convert-media.js, produce 4 MP4s + 4 posters + 16 WebP screenshots (Wave 1)

**Wave 2** *(blocked on Wave 1 completion)*

- [x] 01-02-PLAN.md — Fast timeline: LazyVideoThumbnail.vue + rewire GameProjects.vue to viewport-gated video thumbnails for all 4 projects (Wave 2)
- [x] 01-03-PLAN.md — Fast overlays: lazy WebP screenshots, Floor 0 reference fix, Dispater trailer embed, App.vue preload cleanup (Wave 2)

**Gap Closure** *(from 01-UAT.md G-01-5)*

- [ ] 01-04-PLAN.md — Trim Floor 0 timeline video thumbnail to ~12.5s (gap closure, addresses G-01-5)

### Phase 2: Project Content & Personality

**Goal**: Visitors get accurate, warm, technically substantive project information — team attribution, engine/tech blurbs, hero tone — without ever seeing code, and personality stays inside a deliberate boundary.
**Mode:** mvp
**Depends on**: Phase 1
**Requirements**: CONT-01, CONT-02, CONT-03, CONT-04, CONT-05, CONT-07, POLISH-02
**Success Criteria** (what must be TRUE):

  1. Floor 0's overlay shows the updated Floor0SC1-4.png screenshots, its timeline thumbnail plays the converted Floor0gif1.gif clip, and a "Play on itch.io" link opens the correct itch.io page
  2. Drag Rush and Dispater blurbs each state team size and what Josef personally built
  3. The hero section reads warm and personal ("Hello there!" tone) while staying short and professional
  4. Each of the 4 projects shows a finalized "About this game" blurb naming the engine, dev timeframe, and one technical challenge
  5. A full top-to-bottom read-through confirms personality (mascot, tone) stays within its intended boundary without tipping into a "quirky hobby project" impression

**Plans**: TBD

Plans:

- [ ] 02-01: TBD (defined during /gsd-plan-phase)

### Phase 3: Visual Polish, Resume & Site Metadata

**Goal**: The timeline layout reads restrained and premium, the resume page shows a single polished image, and shared links render accurate site metadata.
**Mode:** mvp
**Depends on**: Phase 2
**Requirements**: POLISH-01, RESUME-01, META-01
**Success Criteria** (what must be TRUE):

  1. The timeline layout (spacing, title styling, image sizing) reads more restrained and premium when scanned top to bottom
  2. The resume page displays actualResume.png as the resume
  3. Sharing the site link shows the correct site title, description, and a real preview image instead of placeholder mywebsite.com/avatar-og.png values

**Plans**: TBD
**UI hint**: yes

Plans:

- [ ] 03-01: TBD (defined during /gsd-plan-phase)

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Media & Performance Optimization | 2/3 | In Progress|  |
| 2. Project Content & Personality | 0/TBD | Not started | - |
| 3. Visual Polish, Resume & Site Metadata | 0/TBD | Not started | - |
