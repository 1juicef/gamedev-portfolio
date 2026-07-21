# Architecture Research

**Domain:** Game developer portfolio site — information architecture / content structure (not software architecture)
**Researched:** 2026-07-21
**Confidence:** MEDIUM (cross-checked across multiple independent portfolio/hiring guides; no single authoritative spec exists for this domain — best practice is convention, not standard)

## Standard Architecture

This is a content-structure problem, not a code-structure problem. The "system" here is the page's information hierarchy: what a visitor sees in the first few seconds, what they see on scroll, and what only appears after a click. The existing codebase already has the right technical shape for this (`GameProjects.vue` timeline + `ProjectDetailsOverlay.vue` detail view) — the redesign work is about *what content lives at each layer*, not new components.

### System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│  LAYER 0 — Above the fold (0-5 sec scan)                         │
│  ┌───────────────────────────┐  ┌──────────────────────────┐    │
│  │ Hero: name + role + tone  │  │ Avatar / mascot            │    │
│  │ ("Hello there! I'm Josef, │  │ (personality anchor)       │    │
│  │  a Game Dev...")          │  │                            │    │
│  └───────────────────────────┘  └──────────────────────────┘    │
├───────────────────────────────────────────────────────────────────┤
│  LAYER 1 — Scroll scan (5-30 sec, the "recruiter pass")           │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐             │
│  │ Project │  │ Project │  │ Project │  │ Project │             │
│  │ Card 1  │  │ Card 2  │  │ Card 3  │  │ Card 4  │             │
│  │ (best   │  │         │  │         │  │         │             │
│  │  first) │  │         │  │         │  │         │             │
│  └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘             │
│  each card: hero image/gif, title, 1-2 sentence hook,            │
│  role/one-line stack chip                                        │
├───────────────────────────────────────────────────────────────────┤
│  LAYER 2 — Click-through detail (30 sec+, the "technical pass")   │
│  ┌───────────────────────────────────────────────────────────┐   │
│  │ ProjectDetailsOverlay: gallery/video, "About this game"    │   │
│  │ blurb (engine/tools, timeframe, one technical challenge),  │   │
│  │ optional link out (itch.io/repo)                           │   │
│  └───────────────────────────────────────────────────────────┘   │
├───────────────────────────────────────────────────────────────────┤
│  LAYER 3 — Supporting pages (intent-driven navigation, not scroll)│
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                       │
│  │ Resume   │  │ Contact  │  │ (About,  │                       │
│  │ (image)  │  │          │  │  merged  │                       │
│  │          │  │          │  │  into    │
│  │          │  │          │  │  hero)   │                       │
│  └──────────┘  └──────────┘  └──────────┘                       │
└─────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Layer/Component | Responsibility | Typical Implementation |
|-----------------|-----------------|-------------------------|
| Hero | Establish identity, tone, and "who is this person" in under 5 seconds; bridge personality and professionalism | Name + one-line role + short warm intro paragraph + avatar/mascot; no project detail here |
| Project card (scroll layer) | Let a recruiter judge quality and range without clicking anything | Best visual asset (gif/screenshot) + title + 1-2 sentence hook + implicit or explicit "what kind of game is this" — this is the layer that must carry 80% of the impression |
| Project detail (click layer) | Reward a technical reviewer who wants substance without reading code | Media gallery, "About this game" blurb (engine/tools, dev timeframe, one interesting technical challenge), optional outbound link (itch.io, repo, video) |
| Resume | Serve the recruiter who wants the formal credentials/timeline in one artifact | Single image or PDF, reachable via nav, not embedded inline in the scroll |
| Contact | Remove friction for a recruiter who is ready to reach out | Persistent in nav/footer, not buried behind other content |
| Mascot/personality thread | Carry tone across pages without stealing attention from project content | Small recurring animation in header/footer, consistent everywhere, never inside the project detail layer |

## Recommended Content Boundaries

This maps directly onto the existing `GameProjects.vue` / `ProjectDetailsOverlay.vue` split — the split is correct, the question is what content belongs on each side of it.

```
Scroll (GameProjects.vue timeline)      Click (ProjectDetailsOverlay.vue)
├── Hero copy (identity, tone)          ├── Full media gallery (all screenshots/gifs/video)
├── Project title                       ├── "About this game" blurb:
├── Best single image/gif per project   │     - engine/tools used
├── 1-2 sentence hook/summary           │     - dev timeframe
└── (nothing else — keep it light)      │     - one interesting technical challenge
                                         ├── Optional outbound link (itch.io/repo/video)
                                         └── (no code snippets — ever, per Out of Scope)
```

**Rule of thumb from research:** the scroll layer's job is to make someone *want* to click; the detail layer's job is to *reward* the click with just enough technical substance to satisfy a technical reviewer, without turning into documentation. If a fact would only matter to another engineer reading source code, it doesn't belong on the site at all (consistent with the project's explicit "no code shown" constraint).

## Architectural Patterns

### Pattern 1: Best-work-first ordering

**What:** Order projects so the strongest/most polished project appears first in the scroll, not chronologically.
**When to use:** Always, for a portfolio with a small, curated project count (3-5 projects, matching this project's 4 games).
**Trade-offs:** Slightly less "narrative" than a timeline-by-date ordering, but every source consistently found this is what matters for the 5-30 second recruiter scan — a recruiter who bounces after project 1 should have seen your best work, not your oldest.
**Confidence:** MEDIUM (cross-checked: general portfolio guidance + MY.GAMES recruiter-specific advice both independently converge on this).

### Pattern 2: Scannable card -> case-study detail split

**What:** Two-tier content structure — a lightweight, image-forward card in the main scroll, and a denser "case study" style expansion behind a click (overlay, modal, or dedicated page).
**When to use:** Whenever the audience splits into a fast-scanning group (recruiters/HR) and a slower, detail-seeking group (technical leads) — exactly this project's stated audience split.
**Trade-offs:** Requires discipline to *not* let scroll-layer copy grow (e.g., don't add the tech blurb to the timeline row — it dilutes the scan). The existing codebase already separates these two concerns (`summaries` object in `GameProjects.vue` vs `htmlDescription` in `GameProjectsData.ts`) — the redesign should preserve this separation and add the new "About this game" content to the overlay layer, not the timeline layer.
**Confidence:** MEDIUM (recurring pattern across professional portfolio guidance, framed as "PRDO"/case-study structure in one source).

### Pattern 3: Identity-first hero, project-agnostic

**What:** The hero section establishes who the person is (name, role, one warm personal line, tone-setting) and explicitly hands off to the project list ("Here are some projects...") rather than trying to sell any single project.
**When to use:** Small personal portfolios where the person *is* the differentiator (vs. large studio portfolios where the catalog is the point).
**Trade-offs:** Risks feeling generic if the personal line is too vague; the project's existing hero copy ("I have a background in fashion, retail...dogs and working out") is a good example of the "personality without unprofessionalism" balance being pursued — keep this pattern, just tighten pacing.
**Confidence:** MEDIUM.

## Data Flow (Information Flow)

### Visitor attention flow

```
Land on page
    ↓
Hero (identity + tone, ~5 sec) — "who is this and is it worth continuing?"
    ↓
Scroll timeline (~5-30 sec) — "is the work good and is there range?"
    ↓ (per project, optional)
Click title/image → Overlay detail — "what's the substance behind this?"
    ↓ (optional, intent-driven)
Nav → Resume — "what's the formal credential trail?"
    ↓ (optional, intent-driven)
Nav → Contact — "how do I reach this person?"
```

### Key flows

1. **Fast-scan flow (recruiter):** Hero → scroll past all 4 project cards without clicking → decision made from images + titles + one-line hooks alone. This flow must be fully satisfying on its own — a recruiter who never clicks anything should still walk away with a clear impression. This is why project ordering (best-first) and card content (best asset + hook) matter more than anything in the detail layer.
2. **Deep-dive flow (technical lead):** Hero → scroll → click into 1-2 projects that caught their eye → read "About this game" blurb → optionally follow an outbound link (itch.io/repo). This flow is only reached by a subset of visitors, so the detail layer can afford more density, but should still be skimmable (short blurb, not a wall of text).
3. **Credential-check flow (either audience, later in the process):** Nav → Resume, decoupled from the project scroll entirely. Treat Resume as a "second artifact," not a continuation of the story — hence the decision to make it a single image rather than woven into the narrative.

## Content Priority Ranking (informs build order)

Ranked by how much it affects the "under a minute, clear impression" success metric from PROJECT.md:

1. **Project ordering + card content (scroll layer)** — highest leverage; this is what 100% of visitors see. Get best-first ordering and hook copy right before anything else.
2. **Hero copy tone** — second highest leverage; sets the frame for everything after. Cheap to iterate (it's just copy).
3. **"About this game" blurb (detail layer)** — serves the technical-reviewer half of the audience; only reached by visitors who click, but directly addresses the stated core requirement (engine/tools, timeframe, technical challenge).
4. **Visual polish pass (spacing/sizing/title styling)** — amplifies whatever content is already there; sequence *after* content/copy is finalized, since polishing a layout that's about to have its copy rewritten wastes effort.
5. **Resume-as-image swap, asset swaps** — mechanical, low-risk, no information-architecture decisions involved; safe to do any time, doesn't block or get blocked by the above.

## Anti-Patterns

### Anti-Pattern 1: Front-loading technical detail into the scroll layer

**What people do:** Put engine/tools/challenge blurbs directly in the timeline summary text (visible without clicking), reasoning "more info is more thorough."
**Why it's wrong:** Every source on recruiter scanning behavior converges on speed — a recruiter's pass is 5-30 seconds across the *whole* page, not per project. Dense technical copy in the scroll layer slows the scan for the majority audience (recruiters) to serve a minority audience (technical reviewers) who would have clicked anyway.
**Do this instead:** Keep the scroll-layer `summaries` short (current 1-2 sentence hooks in `GameProjects.vue` are already correctly scoped — don't grow them). Put the new "About this game" content in `ProjectDetailsOverlay.vue` via `htmlDescription`.

### Anti-Pattern 2: Chronological project ordering

**What people do:** Order projects by date made (oldest first or most recent first by default) rather than by quality/impressiveness.
**Why it's wrong:** A recruiter who doesn't scroll to the end never sees your best work if it happens to be older or buried.
**Do this instead:** Explicitly rank the 4 games by "how impressive/polished is this" and order the timeline accordingly, independent of when each was made.

### Anti-Pattern 3: Treating Resume as a continuation of the project narrative

**What people do:** Build Resume as a hand-authored page that re-explains the same projects in prose, duplicating the timeline's content.
**Why it's wrong:** Creates redundant maintenance (two places to update project info) and doesn't serve either audience better than the projects page already does.
**Do this instead:** This project's own decision (single resume image) already avoids this trap — keep Resume as a separate, self-contained credential artifact (image/PDF), not a narrative page.

## Sources

- [What are the best game portfolio examples that impressed hiring managers?](https://www.linkedin.com/advice/0/what-best-game-portfolio-examples-impressed-hiring-hxpuf) — MEDIUM
- [Portfolios for gamedev artists: getting recruiter attention (MY.GAMES / Medium)](https://medium.com/my-games-company/portfolios-for-gamedev-artists-getting-recruiter-attention-5dd4b7e2ec80) — MEDIUM, fetched directly, recruiter-sourced advice on scroll-preview behavior, card content, and best-work-first ordering
- [Developer Portfolio Guide 2026 (Hakia)](https://hakia.com/skills/building-portfolio/) — MEDIUM, general dev portfolio structure (top-loaded impression, 30-second hiring-manager attention window)
- [How to Make a Great Game Design Portfolio (Alexia Mandeville / Medium)](https://alexiamandeville.medium.com/how-to-make-a-great-game-design-portfolio-14169d6838fb) — LOW, single-source, general framing
- [Game Design Portfolio Guide (gamedesignskills.com)](https://gamedesignskills.com/game-design/portfolio/) — referenced in search summary (PRDO case-study structure: Problem/Role/Decisions/Outcome); direct fetch blocked (403), so treated as LOW/unverified beyond the search snippet
- Internal: `D:\Kodning\Portfolio\gamedev-portfolio\src\views\GameProjects.vue`, `.planning\PROJECT.md` — HIGH (primary source, current codebase state)

---
*Architecture research for: game developer portfolio information architecture*
*Researched: 2026-07-21*
