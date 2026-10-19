---
quick_id: 261019-hb4
status: complete
commit: c192afd
---

# Summary: SGA New Talent Best Audio nominee badge

- Logo: `public/img/projects/dispater/sga-new-talent-2026.png` (480x202, official colour SGA New Talent mark, transparent).
- Timeline card: badge (logo | "NOMINEE / Best Audio") under the Dispater title, driven by new `awards` map in `GameProjects.vue` so other projects can get badges by adding an entry.
- Overlay: same badge, linked to https://www.swedishgameawards.se/nominees-new-talent-2026, placed above the itch.io badge.
- Styles: `.award-badge*` in `src/css/projects.less` (global so they apply in both card and overlay); `.dialog-content a.award-badge` removes the overlay link underline.
- Verified: `npm run lint` clean, dev server type-check clean, visually checked card and overlay in Chrome.
