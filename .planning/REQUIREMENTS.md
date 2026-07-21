# Requirements: Josef's Game Dev Portfolio

**Defined:** 2026-07-21
**Core Value:** The portfolio must read as aesthetically polished and professional within a 10-second scan, while still carrying a distinct sense of personality — without ever needing to show a line of code to prove the work is real.

## v1 Requirements

Requirements for this redesign pass. Each maps to roadmap phases.

### Media & Performance

- [ ] **MEDIA-01**: SwingSpace and Floor 0 timeline thumbnails are delivered as compressed/optimized assets (converted from oversized GIFs to muted, looping video) instead of shipping multi-MB GIFs as always-visible thumbnails
- [ ] **MEDIA-02**: All project screenshots (Drag Rush, Dispater, Floor 0, SwingSpace) are compressed/re-encoded (e.g. to WebP) for faster overlay loading
- [ ] **MEDIA-03**: `loading="lazy"` is applied to every project image, including images hand-authored inside `v-html` description strings and below-fold timeline thumbnails

### Project Content

- [ ] **CONT-01**: Floor 0 screenshots are swapped to the new `Floor0SC1-4.png` files, replacing the old `floor-0-1..4.png` references
- [ ] **CONT-02**: Drag Rush and Dispater project blurbs include an explicit team/role-attribution line (team size + what was personally built)
- [ ] **CONT-03**: Hero section copy is rewritten to be warmer/more personal while staying short and professional
- [ ] **CONT-04**: "About this game" blurb (engine, dev timeframe, one technical challenge) is finalized/confirmed on all 4 projects
- [ ] **CONT-05**: Floor 0 gets a "Play on itch.io" link to `https://juice-f.itch.io/floorzero`, matching the pattern already used by Drag Rush/Dispater
- [ ] **CONT-07**: Floor 0 timeline thumbnail switched from the old placeholder icon to `Floor0gif1.gif` (delivered per MEDIA-01 as a converted video, not the raw GIF)

### Visual Polish

- [ ] **POLISH-01**: Timeline layout (spacing, title styling, image sizing) gets a polish pass favoring restraint over added decoration
- [ ] **POLISH-02**: Personality stays within an explicit boundary: mascot confined to header/footer, hero copy warm but short — verified via a full-page read-through before shipping

### Resume

- [ ] **RESUME-01**: Resume page shows the single resume image (`actualResume.png`) — no additional accessibility/PDF mitigation this pass (explicit tradeoff, accepted as-is)

### Metadata

- [ ] **META-01**: Placeholder OG tags in `public/index.html` (`mywebsite.com`, nonexistent `avatar-og.png`) are replaced with real site info and a real image, so links shared to recruiters render a correct social preview

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Media & Performance

- **MEDIA-04**: SwingSpace GitHub repo cleaned up and linked from the project overlay as an optional, low-emphasis link

### Project Content

- **CONT-06**: Play/build link for SwingSpace — currently mobile-only with no web/PC build; revisit if a web build is ever produced

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| SwingSpace play/build link (itch.io or otherwise) | Game is mobile-only with no web/PC-playable build — itch.io isn't a good fit without one |
| SwingSpace repo link | Repo needs cleanup first; that's separate work from this redesign pass |
| Resume accessibility mitigation (downloadable PDF companion, `alt` text overhaul) | Explicitly accepted tradeoff — image-only resume is intentional for this pass |
| New/additional game projects beyond the current 4 | Deferred — not part of this redesign pass (see PROJECT.md) |
| `Guy3.gif` / `Guy4.gif` | Leftover assets, not being wired in |
| Code snippets or embedded code on the page | Recruiters don't read code; tech blurb + optional link covers technical reviewers instead |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| MEDIA-01 | TBD | Pending |
| MEDIA-02 | TBD | Pending |
| MEDIA-03 | TBD | Pending |
| CONT-01 | TBD | Pending |
| CONT-02 | TBD | Pending |
| CONT-03 | TBD | Pending |
| CONT-04 | TBD | Pending |
| CONT-05 | TBD | Pending |
| CONT-07 | TBD | Pending |
| POLISH-01 | TBD | Pending |
| POLISH-02 | TBD | Pending |
| RESUME-01 | TBD | Pending |
| META-01 | TBD | Pending |

**Coverage:**
- v1 requirements: 13 total
- Mapped to phases: 0 (roadmap not yet created)
- Unmapped: 13 ⚠️

---
*Requirements defined: 2026-07-21*
*Last updated: 2026-07-21 after initial definition*
