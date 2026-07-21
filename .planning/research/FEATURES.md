# Feature Research

**Domain:** Game developer portfolio website (job-search / recruiter-facing), redesign of an existing 4-project site
**Researched:** 2026-07-21
**Confidence:** MEDIUM (web-search sourced, cross-checked across multiple independent articles; no single canonical/official source exists for "portfolio best practices" — this is community consensus, not a spec)

## Feature Landscape

### Table Stakes (Users Expect These)

Features a recruiter or technical lead assumes exist. Missing these makes the portfolio feel amateurish or gets it closed within seconds.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Strongest project shown first / immediately visible | Recruiters give a portfolio well under 30 seconds before deciding to keep scrolling or close the tab; the first thing seen sets the whole impression | LOW | Timeline already exists — verify ordering puts the most impressive/polished game (visually + technically) first, not chronological-only order |
| Clean, uncluttered, fast-scanning layout | Minimalist layout with clear navigation keeps focus on the work itself; clutter reads as unprofessional | MEDIUM | This IS the current "visual polish pass" active requirement — spacing/title styling/image sizing |
| Explicit "my role" per project (especially team projects) | The single most-cited recruiter complaint is "I can't tell what this person personally did" — this is the #1 fix cited across sources | LOW | Drag Rush and Dispater (Yrgo school projects) read as likely team projects but current blurbs don't state role/team size/what was individually built vs. teammates. Floor 0 and SwingSpace already say "first solo project" / "my first solo project" — good, keep that pattern explicit everywhere |
| Per-project "about this game" technical substance (engine, dev time, one technical challenge) | Technical leads want evidence of problem-solving and technical decision-making, not just gameplay footage, but explicitly do NOT want to read raw code | LOW–MEDIUM | Already implemented per project and already in Active requirements — this maps directly onto documented best practice ("Problem → Decision → Outcome" style beats a feature list) |
| Fast, low-friction media (no giant downloads, quick-loading visuals) | Recruiters won't download 2GB .exe files or wait on unoptimized media; friction = closed tab | MEDIUM | Out of scope for this researcher's file but flagged here because it interacts with "About this game" section placement — don't let heavy hero media push the blurb below the fold |
| No unmuted autoplay audio/video | Recurring, strongly-cited anti-pattern; unexpected sound causes immediate tab closes | LOW | Verify embedded YouTube iframes (Drag Rush) and `<video>` tags (SwingSpace) don't autoplay with sound — current markup uses `controls` without `autoplay`, which is correct; keep it that way |
| Scannable text (short blocks, no walls of text) | Long unbroken paragraphs cause fatigue and get skipped; bullet-like short lines with breaks are the norm | LOW | Current `<br/>`-separated short-line style in "About this game" blocks already follows this pattern — preserve it in the new hero copy rewrite too |
| Working link to play/experience the game where possible | Lets recruiters "experience the work firsthand" rather than take gifs on faith, reduces skepticism | LOW | Already present for Drag Rush and Dispater (itch.io links); Floor 0 and SwingSpace currently lack a play link — worth flagging as a gap even though out of scope for this milestone |
| Resume that is fast to scan and easy to skim | Same 10-second-scan logic applies to the resume page as to the project timeline | LOW | Active requirement already covers replacing hand-coded resume with a single image — see Anti-Features below for the tradeoff this introduces |

### Differentiators (Competitive Advantage)

Not required, but this is exactly where a polished redesign can pull ahead of the median student/solo-dev portfolio, and it aligns directly with this project's stated Core Value (credible + memorable + personality without code).

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Consistent "Problem → Decision/Approach → Outcome" phrasing in each technical blurb | This specific structure is called out repeatedly as what separates a generic feature-list blurb from one that reads as genuine technical credibility, without needing code | LOW | Current blurbs are close (e.g. "Custom made 'Beat Conductor'") but read as a feature list, not problem→solution framing. Light copy tightening (not restructuring) could lift this from "good" to "differentiated" |
| Distinct personality carried consistently (mascot + warm copy tone) | Mixed audience (recruiter scan + technical closer look) rewards a portfolio that's memorable, not just competent — this is explicitly the project's stated differentiation angle | LOW–MEDIUM | Already the plan (Guy/Guy2 mascot, "Hello there!" hero rewrite) — research supports this is a genuine differentiator *as long as* professionalism is held (see Anti-Features: overdesign) |
| Visual/timeline presentation instead of generic grid | A bespoke alternating-row timeline (already built) is inherently more memorable than a plain project grid — most competing student portfolios use a grid | LOW (already built) | No new work needed; just don't regress this into something more generic during the polish pass |
| Optional external link/repo per project as a secondary, low-emphasis affordance | Gives technical reviewers who *do* want to dig deeper a path to do so, without putting code on the page itself — satisfies both audiences without compromising the "no code" design decision | LOW | Matches the Key Decision already logged ("short tech blurb + optional link per project") — only add this where a genuine public repo/build exists; do not force it for projects that don't have one |

### Anti-Features (Commonly Requested, Often Problematic)

Things that look like good ideas for this kind of portfolio but create more problems than they solve — flagged specifically against this project's current direction.

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|------------------|-------------|
| Pasting real code snippets into the project overlay | Feels like "proof" of technical skill | Recruiters don't read code and will skip it; for the few technical reviewers who would read it, an out-of-context snippet without the surrounding architecture is unconvincing rather than impressive — and it's explicitly called out as a common portfolio mistake | Keep the current decision: prose "about this game" blurb (engine, timeframe, one named technical system/challenge) plus an optional link to a repo/build for anyone who wants to go deeper |
| Autoplaying background video/audio on load ("cinematic" hero) | Feels premium, used on some agency/design portfolios | Strongly and repeatedly cited as a trust-destroying anti-pattern in this exact context — causes immediate tab closes when sound is unexpected | Keep video/audio user-triggered (`controls`, no `autoplay`) as the current SwingSpace video already does |
| Long narrative game-story text on the project cards (heavy lore/world-building copy) | Feels natural for a game with strong narrative (e.g. Dispater) to want to "sell" the story | Recruiters scan, they don't read fiction; walls of text are explicitly cited as fatigue-inducing and get skipped, working against the 10-second-scan goal | Keep story to 1–2 short evocative lines (current pattern is close to right — e.g. Dispater's "Good morning rookie!" hook) and let screenshots/video carry the atmosphere |
| Resume-as-image with no text fallback at all | Feels simpler and guarantees pixel-perfect resume formatting matches the "actual" resume file | An image-only resume is not selectable/copyable text and is invisible to any ATS/keyword scanning or basic accessibility tooling (screen readers) — a real risk this project is walking into with the "single resume image" decision | If feasible without expanding scope: keep the image as the primary visual and add a plain-text/PDF download link alongside it, or at minimum make sure the underlying PDF/image has extractable text layer, rather than a flat raster-only image |
| Overdesigned/highly stylized timeline (heavy animation, decorative flourishes competing with the game media) | Wanting the "personality" and "premium feel" goals to show up as more visual flourish | Explicitly cited pattern: an overdesigned/"kaleidoscopic" portfolio is worse received than a plain one — visual noise competes with and undermines the actual work being showcased | Keep the personality budget concentrated in a few deliberate touches (mascot, copy tone, accent color) and spend the "polish pass" on spacing/sizing/typography restraint, not added decoration |
| Vague/omitted team-project attribution ("we made a game about...") | Easier to write, avoids awkwardness about what teammates did | This is the single most commonly cited portfolio complaint from recruiters — cannot tell what the applicant personally did, which actively damages credibility for exactly the team-built projects (Drag Rush, Dispater) that most need it | Add an explicit line to team projects following the pattern already used for the solo ones ("first solo project" style) — e.g. state team size/roles and which specific system(s) were built individually vs. by teammates |

## Feature Dependencies

```
"About this game" blurb (engine/timeframe/challenge)
    └──requires──> Project already has enough real technical substance to name a specific system
                       (all 4 projects qualify: Beat Conductor, hex-grid movement, behaviour-tree AI, Firebase highscores)

Explicit "my role" line on team projects
    └──enhances──> "About this game" blurb credibility
                       (turns a feature list into a credible individual-contribution claim)

Optional repo/build link
    └──requires──> A real public build or repo existing for that project
                       (do not add a link with nothing behind it — an empty/dead link is worse than no link)

Hero copy rewrite ("Hello there!" warmer tone)
    └──conflicts (mildly) with──> Keeping copy scannable/short
                       (warmth must be achieved in fewer, better words — not more words)

Resume-as-image
    └──conflicts with──> ATS/accessibility scannability
                       (mitigate with a parallel text/PDF version, not by reverting the decision)
```

### Dependency Notes

- **"My role" line enhances the "About this game" blurb:** Without it, Drag Rush/Dispater blurbs read as a feature list ("Custom made Beat Conductor") that could be read as either a personal achievement or a team achievement — recruiters default to skepticism when it's ambiguous. Adding one line naming team size and the applicant's specific contribution removes that ambiguity for near-zero added length.
- **Optional link requires a real target:** This project's Key Decision already scopes the link as optional per project — research confirms this is the right call; only Drag Rush and Dispater currently have itch.io links, so don't force one onto Floor 0/SwingSpace unless a genuine playable build exists.
- **Hero copy warmth conflicts with scannability if not disciplined:** The redesign's "warmer, more personal" hero goal is validated as a genuine differentiator, but the same research that supports personality also warns against walls of text — the rewrite should aim for fewer, better-chosen words, not more copy.
- **Resume-as-image conflicts with ATS/accessibility scannability:** This is a real tradeoff the project has already decided to accept (Key Decision: "Resume page shows a single resume image... Simpler, matches short and to the point"). Research doesn't argue against the decision, but flags it as an anti-feature-adjacent risk worth a cheap mitigation (parallel text or a PDF with a real text layer) rather than pure raster image, if that's low-cost within the current scope.

## MVP Definition

Framed against this project's *redesign* scope (not a from-scratch build) — these map to what's already in `.planning/PROJECT.md` Active requirements, prioritized by what research says matters most.

### Launch With (v1 — this redesign pass)

- [ ] Explicit "my role"/team-attribution line added to Drag Rush and Dispater blurbs (team projects) — closes the #1 most-cited recruiter complaint; cheap, high-value, currently missing
- [ ] "About this game" blurb kept on all 4 projects with engine/timeframe/one technical challenge (already in progress) — directly matches what technical leads look for beyond footage
- [ ] Hero copy rewrite, kept short and scannable even while warmer — already active, just hold the line on length
- [ ] Visual polish pass on timeline (spacing/sizing/typography) — already active, and research confirms restraint (not added decoration) is the right target
- [ ] Verify no autoplay-with-sound anywhere in existing media embeds (YouTube iframe, `<video>` tags) — nearly free to check, protects against the single most damaging anti-pattern found

### Add After Validation (v1.x — reasonable near-term follow-ups, not blocking this pass)

- [ ] Add a play/build link for Floor 0 and SwingSpace if/when a public build exists (currently only Drag Rush/Dispater have itch.io links)
- [ ] Add a lightweight text or real-text-layer PDF companion to the new resume image, to offset the ATS/accessibility tradeoff being accepted now

### Future Consideration (v2+ — explicitly out of scope per PROJECT.md)

- [ ] Additional shipped projects beyond the current 4 — deferred by explicit decision, not a gap in this research
- [ ] Deeper case-study format (diagrams, before/after design iteration, playtesting notes) — valuable per research but a meaningfully bigger content-production effort than "one blurb per project," reasonable to defer past this polish pass

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| "My role"/team attribution line (Drag Rush, Dispater) | HIGH | LOW | P1 |
| "About this game" blurb (engine/time/challenge) — all projects | HIGH | LOW | P1 |
| Hero copy rewrite, short + warm | MEDIUM | LOW | P1 |
| Timeline visual polish (spacing/sizing/typography restraint) | MEDIUM | MEDIUM | P1 |
| Verify no autoplay audio/video | HIGH (risk avoidance) | LOW | P1 |
| Resume as image + accessibility/ATS mitigation | MEDIUM | LOW | P2 |
| Play/build links for Floor 0 + SwingSpace | MEDIUM | MEDIUM (depends on builds existing) | P2 |
| Optional repo link per project (where applicable) | LOW–MEDIUM | LOW | P2 |
| Deeper case-study content (diagrams, iteration notes) | MEDIUM | HIGH | P3 |

**Priority key:**
- P1: Must have for this redesign pass to land its stated goal
- P2: Should have, reasonable near-term follow-up
- P3: Nice to have, defer past this milestone

## Competitor Feature Analysis

Direct competitor products don't exist in the traditional sense (this is a personal job-search site, not a market product), so this compares against the *documented conventions* of the game-dev-portfolio genre as surfaced in research, rather than named competitor sites.

| Feature | Common convention (student/solo-dev portfolios) | Common convention (programmer-heavy portfolios) | This project's approach |
|---------|--------------------------------------------------|--------------------------------------------------|--------------------------|
| Technical proof | Screenshots/video + short blurb | Often a linked GitHub repo, sometimes inline code walkthroughs | Blurb only, optional link — deliberately splits the difference for a mixed recruiter/technical-lead audience |
| Role attribution on team work | Frequently omitted or vague ("we made...") — cited as the most common flaw | Usually explicit, since programmer portfolios are evaluated more on individual system ownership | Currently inconsistent (present for solo projects, missing for team projects) — closing this gap is the single highest-value change this research surfaced |
| Personality/tone | Usually generic/corporate-safe, rarely distinctive | Usually minimal, technical, terse | Deliberately distinctive (mascot, warm hero copy) — matches this project's stated differentiation strategy |
| Media weight | Often heavy/unoptimized (large gifs, uncompressed video) | N/A (less media-heavy) | Out of scope for this file, but interacts with scan-speed table stakes — flagged for awareness |

## Sources

- [How to Make a Game Design Portfolio That Gets You Hired?](https://gamedesignskills.com/game-design/portfolio/) — web, MEDIUM confidence
- [Build a Game Developer Portfolio That Stands Out (Algoryte)](https://www.algoryte.com/news/build-a-game-developer-portfolio-that-stands-out/) — web, MEDIUM confidence
- [Game Developer Portfolios: Showcasing Your Skills (MoldStud)](https://moldstud.com/articles/p-game-developer-portfolios-showcasing-your-skills) — web, MEDIUM confidence
- [How to Build a Game Developer Portfolio That Gets You Hired (2026) — GeneralistProgrammer](https://generalistprogrammer.com/tutorials/game-developer-portfolio-and-resume-guide) — web, MEDIUM confidence
- [Game Development Portfolio: Complete Professional Guide 2025 — GeneralistProgrammer](https://generalistprogrammer.com/tutorials/game-development-portfolio-complete-professional-guide-2025) — web, MEDIUM confidence
- [What should I put into my video game programming portfolio? (Game Industry Career Guide)](https://www.gameindustrycareerguide.com/what-should-i-put-into-my-video-game-programming-portfolio/) — web, MEDIUM confidence
- [Top 10 Most Common Game Art Portfolio Mistakes (ArtStation)](https://www.artstation.com/blogs/nvalchev/9AMA0/top-7-most-common-game-art-portfolio-mistakes-and-how-to-avoid-them) — web, MEDIUM confidence
- [5 Portfolio Mistakes You Must Avoid (Students/Artists in Games) — Medium](https://medium.com/@etiennebadia/5-portfolio-mistakes-you-must-avoid-students-artists-in-games-47f133138a96) — web, MEDIUM confidence
- [6 Job-killing Mistakes You Are Making in your Game UI UX Design Portfolio](https://thewingless.com/index.php/2022/05/08/6-job-killing-mistakes-you-are-making-in-your-game-ui-ux-design-portfolio/) — web, MEDIUM confidence
- [Documenting Group Projects for Your Portfolio (Cirkled In)](https://www.cirkledin.com/library/resume-and-portfolio-building/group-project-resume-portfolio-contribution/) — web, MEDIUM confidence
- [What are the best game portfolio examples that impressed hiring managers? (LinkedIn Advice)](https://www.linkedin.com/advice/0/what-best-game-portfolio-examples-impressed-hiring-hxpuf) — web, MEDIUM confidence
- Cross-project source: `D:\Kodning\Portfolio\gamedev-portfolio\src\data\GameProjectsData.ts` (current site content, read directly) — HIGH confidence (primary source, own codebase)
- Cross-project source: `D:\Kodning\Portfolio\gamedev-portfolio\.planning\PROJECT.md` (project scope/decisions, read directly) — HIGH confidence (primary source, own project doc)

**Confidence note:** All web-sourced claims are MEDIUM confidence (cross-checked across 3+ independent articles per topic per the `classify-confidence --verified` seam) rather than HIGH, because this domain has no single authoritative/official spec — "game portfolio best practices" is aggregated community consensus from career-advice blogs and forums, not a standards body. Recurring, independently-repeated claims (10-second scan, explicit "my role" line, no autoplay audio, avoid walls of text) are the most reliable; single-source claims (e.g. specific "60–90 second showreel" number) are noted as directional rather than precise.

---
*Feature research for: Game developer portfolio website (job-search, recruiter + technical-lead audience)*
*Researched: 2026-07-21*
