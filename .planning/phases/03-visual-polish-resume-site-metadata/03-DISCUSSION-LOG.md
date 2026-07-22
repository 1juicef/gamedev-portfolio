# Phase 3: Visual Polish, Resume & Site Metadata - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-07-22
**Phase:** 3-Visual Polish, Resume & Site Metadata
**Areas discussed:** Fold pending todos, Timeline layout polish direction, Resume image sizing/presentation, Site metadata content

---

## Fold pending todos?

| Option | Description | Selected |
|--------|-------------|----------|
| Timeline title click affordance | Fits POLISH-01's domain directly | ✓ |
| Swap Dispater timeline/project gif | Content/media swap, still touches the timeline | ✓ |
| None — keep both deferred | Stay tightly scoped | |

**User's choice:** Fold both.

---

## Timeline Layout Polish

**Q1: Biggest thing bothering you about the current look?**
Options: Too much spacing/whitespace imbalance / Title styling feels plain/heavy / Image sizing/proportions / Nothing specific — you decide
**Answer:** Nothing specific — you decide.

**Q2: Keep alternating rows or move to uniform layout?**
Options: Keep alternating rows (Recommended) / Switch to uniform single-side layout
**Answer:** Keep alternating rows.

**Notes:** General restraint pass, Claude's discretion on specifics (D-01). Signature alternating layout stays (D-02).

---

## Resume Presentation

**Q1: How should actualResume.png be displayed?**
Options: Full-width, capped max-width, centered (Recommended) / Smaller/contained with border/shadow / You decide
**Answer:** You decide.

**Q2: Static display, or clickable/downloadable?**
Options: Static display only (Recommended) / Add click-to-enlarge or download link
**Answer:** Static display only.

**Notes:** Discovered during codebase scout that `src/views/Resume.vue` already implements exactly this treatment (centered, full-width capped, static `<img>`) — flagged in CONTEXT.md D-06 as "verify, don't rebuild."

---

## Site Metadata Content

**Q1: What should site title/description say?**
Options: Simple & direct (Recommended: "Josef — Game Developer Portfolio" / short description) / You decide / I'll give exact wording
**Answer:** Simple & direct.

**Q2: What image for og:image?**
Options: Josef's avatar photo (img/avatar.png) / A game screenshot/collage / You decide
**Answer:** Josef's avatar photo.

**Follow-up (real URL):** Initial question about the deployed URL was rejected by the user for clarification. User asked for a naming recommendation (juicef vs. josefubaka vs. other) — Claude recommended `josefubaka` for recruiter-facing credibility/searchability as a placeholder direction. User then asked whether `https://josefubaka.github.io` would actually work once deployed — Claude explained GitHub Pages root-domain pages require a repo literally named `<username>.github.io` matching the real GitHub account, and asked for the actual username. User provided `https://github.com/1juicef`. Claude then ran `git remote -v`, confirming the repo is `1juicef/gamedev-portfolio`, and corrected the URL to the real project-page path: `https://1juicef.github.io/gamedev-portfolio/` (D-08).

---

## Claude's Discretion

- Exact spacing/title-weight/image-sizing values for the timeline restraint pass.
- Exact final meta description wording (within the simple/direct style given).
- Exact click-affordance treatment for timeline titles (underline vs. icon vs. persistent style).

## Deferred Ideas

- Add two Game Jam games to timeline — remains deferred to a future phase (Phase 4+), reaffirmed as out of Phase 3's domain, not re-discussed this session.
