# Stack Research

**Domain:** Game-dev job-search portfolio — static Vue 2 site, supporting technical additions only (no re-platform)
**Researched:** 2026-07-21
**Confidence:** MEDIUM (web-search-derived, cross-checked against this repo's actual files/asset sizes where possible; no HIGH-confidence curated-doc source was available for these niche/ecosystem questions)

## Scope note

The stack is fixed: **Vue 2.6 (Options API) + vue-router 3 + TypeScript + Less + vue-cli-service 4 (webpack 4)**. This document does not propose changing any of that. It only recommends lightweight additions/techniques layered on top, evaluated against what actually already exists in this repo (checked directly: `public/img/projects/`, `helpers.ts`, `public/index.html`).

**Grounding fact that shapes every recommendation below:** the actual media files in this repo are large — `SwingSpaceGIF.gif` is 18.1MB, `SwingSpaceGIF3.gif` (the one the active requirements say to wire in next) is 17.5MB, and each project screenshot PNG is 0.7–2.2MB uncompressed. This is the single biggest performance risk on the site today, and it drives the top two recommendations below.

## Recommended Stack

### Core Technologies (unchanged — for reference only)

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Vue | 2.6.11 | UI framework | Fixed by project constraint — not re-evaluated |
| vue-router | 3.4.3 | Routing | Fixed by project constraint — not re-evaluated |
| vue-cli-service | 4.5.x (webpack 4) | Build | Fixed by project constraint — not re-evaluated |

### Supporting Techniques/Libraries (the actual recommendations)

| Addition | Version/Approach | Purpose | When to Use |
|----------|---------|---------|-------------|
| GIF → MP4/WebM conversion | ffmpeg (one-time, offline; no npm dep) | Cut `SwingSpaceGIF*.gif` and any future gif-based screenshots from 17–18MB to realistically 0.5–1.5MB | Any looping gameplay-preview clip currently stored as `.gif`. This is the single highest-leverage change available — confirmed 80–96% size reduction converting GIF→MP4/WebM for equivalent looping content (web.dev/Lighthouse guidance). Replace `<img src="....gif">` with `<video autoplay loop muted playsinline><source src="x.webm" type="video/webm"><source src="x.mp4" type="video/mp4"></video>`. `SwingSpaceVid.mp4`/`SwingSpaceVid2.mp4` already exist in the repo at ~3.5–4.1MB each, proving this conversion path is already partially done for this project — just needs the same treatment applied to the GIF-only assets and wired into the data layer instead of raw `.gif` references. |
| Native `loading="lazy"` on `<img>` | Browser built-in, zero dependency | Defer offscreen screenshot loading in `GameProjects.vue` timeline and `ProjectDetailsOverlay.vue` | Default choice for this project's scale (4 project cards, ~20 screenshots total). No IntersectionObserver polyfill needed for target audience (recruiters/devs on modern browsers) |
| Manual pre-compression of PNG screenshots | Squoosh.app or TinyPNG (no npm dep, done once per asset before commit) | Bring 0.7–2.2MB PNGs down to typically 150–400KB (WebP or optimized PNG) without visible quality loss | Every screenshot added to `public/img/projects/`. Matches the existing project workflow where "assets are already produced by the user" (per CLAUDE.md) — a build-time webpack image plugin would be solving a problem this project doesn't have (few, hand-placed images, not a CMS pipeline) |
| Downloadable text-based PDF resume alongside `actualResume.png` | No dependency — just add a static `.pdf` file + a `<a download>` link | The in-page resume-as-image (already an Active requirement) is good for fast visual scanning, but image-only resumes are **not ATS-parseable** and give technical/recruiter reviewers no copyable text | Ship both: `actualResume.png` for in-page display (matches the "short and to the point" design decision already made) + a plain-text-layer PDF export of the same resume for the download/print action, so anyone who forwards it into an ATS or copy-pastes contact info isn't blocked |
| Per-view `document.title` set in `mounted()` | Zero dependency | Give each of the 5 routes (`/resume`, `/game-projects`, `/other-projects`, `/contact`, `/404`) a distinct browser tab title instead of the single hardcoded `<title>Portfolio</title>` in `public/index.html` | Cheap SEO/UX win; do NOT add `vue-meta` for this (see below) |
| Fix placeholder OG tags in `public/index.html` | Zero dependency, manual edit | `og:url` is currently `https://mywebsite.com` and `og:image` points to a non-existent `avatar-og.png` — this means any link shared to a recruiter (Slack, email, LinkedIn) currently renders a broken/wrong social preview | Update to the real deployed domain + a real preview image before the site is shared externally. This is a correctness fix, not a new tool |
| Web3Forms (or Formspree) for the Contact page form | Free tier, `<form>` + `fetch()` POST, no backend | Turns the static Contact page's form into a working mailer without spinning up any server | Only if `Contact.vue` doesn't already have a working form backend — verify current implementation before adding. Web3Forms' free tier (250 submissions/mo) comfortably covers a personal portfolio's volume |
| Plausible or GoatCounter (optional) | Single `<script>` tag in `public/index.html` | Lightweight (1–3.5KB), cookieless traffic counting to see if recruiters are actually visiting/how they found the site | Optional — only add if the user wants visit data; not required for the core "look good to a recruiter" goal. Skip Google Analytics (45KB+ script, cookie-banner obligations, overkill for a 5-page personal site) |
| Cloudflare Pages for hosting (if not already decided) | Free tier | Unlimited bandwidth on free tier vs Netlify/Vercel's 100GB/month cap — relevant specifically because this site's media (gifs/mp4/screenshots) is heavy | Only relevant if hosting is still undecided; if the site is already deployed somewhere working, this is not worth a migration for a portfolio's traffic level |
| itch.io iframe embed / YouTube iframe embed | Plain `<iframe>` inside `htmlDescription` strings | Let a project's overlay show a playable itch.io build or a YouTube trailer instead of only static screenshots/gifs | Optional differentiator, not required. Works today with zero new dependency since `ProjectDetailsOverlay.vue` already renders `htmlDescription` via `v-html` — an `<iframe>` string just needs its target class styled in `projects.less` if custom-sized |

## Installation

No new npm dependencies are required for the core recommendations (GIF→video conversion, image pre-compression, native lazy-loading, manual OG/meta fixes, PDF resume) — they are either build-free static-asset changes or already-available browser features.

```bash
# Only if adding a contact form and it isn't already wired:
# (no install needed — Web3Forms/Formspree work via a plain <form action="https://api.web3forms.com/submit" method="POST">)

# Only if adding analytics:
# (no install needed — single <script> tag from Plausible/GoatCounter dashboard)
```

If a build-time image pipeline is ever wanted later (not recommended now):
```bash
npm install -D image-minimizer-webpack-plugin
```

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|--------------------------|
| ffmpeg manual GIF→MP4/WebM conversion | `vue-lazyload` / `v-lazy-image` npm packages for video | These solve *lazy-loading* delivery, not *file-size*. The 17-18MB GIF problem is a compression problem, not a loading-order problem — converting format matters far more than adding a lazy-load library here |
| Native `loading="lazy"` | `v-lazy-image` (npm, 2.1.1) or `vue-lazyload` (npm, 3.0.0) | Use a library only if fine-grained control is needed (fade-in transitions, placeholder blur-up) — for this project's small, fixed set of images, the added dependency isn't justified |
| Manual pre-compression (Squoosh/TinyPNG) | `image-minimizer-webpack-plugin` in the webpack build | Use the build-time plugin only if the project moves to a CMS-driven or frequently-changing asset pipeline where manual compression before each commit becomes a burden |
| Per-view `document.title` in `mounted()` | `vue-meta` (npm, 2.4.0) | `vue-meta` was the Vue 2 standard, but has had no stable release in ~4 years and never shipped Vue 3 support — not worth the dependency for a 5-route site whose OG tags don't vary by route anyway |
| Web3Forms | Formspree | Formspree if a polished dashboard, team accounts, or Slack/Sheets integrations are wanted — Formspree's free tier is smaller and paid tiers start ~$10/mo, more than this project needs |
| Cloudflare Pages | Netlify / Vercel | Netlify or Vercel if the project ever needs serverless functions, preview-deploy-per-PR workflows, or a team is collaborating — both are fine for this project's actual traffic, and either is a lateral move if hosting is already working today |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| Shipping resume as image-only (no PDF) | Image-only resumes cannot be parsed by ATS software and can't be copy-pasted by a recruiter — actively harmful for the job-search goal this site exists for | Keep `actualResume.png` for in-page display, add a real text-layer PDF as the downloadable artifact |
| `vue-meta` | Unmaintained relative to current needs (no stable release in years, no Vue 3 path), adds a dependency to solve a problem 5 static routes don't really have | Set `document.title` per view manually; keep OG tags static in `index.html` |
| `image-minimizer-webpack-plugin` / any imagemin webpack plugin right now | Solves a "many images changing often" problem this project doesn't have (per CLAUDE.md, assets are hand-produced and placed once); adds webpack build complexity and build-time cost for no real benefit at this asset count | Pre-compress the handful of screenshots manually with Squoosh/TinyPNG before committing |
| Google Analytics / GA4 | ~45KB+ script payload, requires a cookie-consent banner under GDPR, wildly overkill telemetry for a personal 5-page site | Plausible or GoatCounter if visit data is wanted at all, otherwise skip analytics entirely |
| Leaving `SwingSpaceGIF*.gif` as raw animated GIFs in production | Confirmed 17–18MB file sizes in this repo today — this alone can dominate the page's total load weight and directly hurts the "10-second scan" success metric from PROJECT.md | Convert to muted/looping MP4+WebM `<video>`, following the pattern already used for `SwingSpaceVid.mp4` |
| Leaving OG tags as `mywebsite.com` placeholders | Any link shared to a recruiter today produces a broken/generic social preview card | Update `og:url` and `og:image` in `public/index.html` to the real domain and a real preview image before sharing the link externally |

## Stack Patterns by Variant

**If the Contact page form does not yet post anywhere (verify current `Contact.vue` implementation before assuming):**
- Wire it to Web3Forms via a plain `<form action="https://api.web3forms.com/submit" method="POST">` with a hidden access-key input
- Because it requires no backend, no new npm dependency, and fits directly into the existing static-page pattern (`Contact.vue` edited directly, no data layer)

**If the user wants visit/traffic data:**
- Add a single Plausible or GoatCounter `<script>` tag to `public/index.html`
- Because both are cookieless (no GDPR banner needed) and add negligible page weight (1–3.5KB) compared to Google Analytics

**If a project's overlay content would benefit from a playable build or trailer, not just static media:**
- Drop an `<iframe>` (itch.io widget or YouTube embed) directly into that project's `htmlDescription` string in `GameProjectsData.ts`, styling its wrapper class in `projects.less`
- Because `ProjectDetailsOverlay.vue` already renders arbitrary HTML via `v-html` — no new rendering path needed

## Version Compatibility

| Package/Approach | Compatible With | Notes |
|-----------|-----------------|-------|
| Native `loading="lazy"` | All evergreen browsers (Chrome, Firefox, Edge, Safari 16+) | No polyfill needed for a job-search portfolio's realistic browser mix |
| `<video autoplay loop muted playsinline>` | All evergreen browsers | `muted` + `playsinline` are required for autoplay to work on mobile Safari/Chrome |
| `v-lazy-image@2.1.1` (if chosen instead of native lazy) | Vue 2.6 and Vue 3 | Confirmed via npm registry; no peer-dependency conflicts with this project's `vue@^2.6.11` |
| `vue-lazyload@3.0.0` (if chosen instead of native lazy) | Vue 2 | Confirmed via npm registry; more actively used historically for Vue 2 apps but less actively maintained than `v-lazy-image` |
| `vue-meta@2.4.0` (not recommended, listed for completeness) | Vue 2 only | Confirmed via npm registry: latest stable is 4 years old; the 3.0.0-alpha series (not recommended) targets Vue 3/Unhead-era patterns and is not stable |
| `image-minimizer-webpack-plugin` (only if ever needed later) | webpack 4 (what vue-cli-service 4.5.x uses) via `chainWebpack` in `vue.config.js` | Would require adding a `vue.config.js` build hook — not currently present in this repo |

## Sources

- [Video performance | web.dev](https://web.dev/learn/performance/video-performance) — GIF-to-video guidance, MEDIUM confidence (web search, cross-checked against multiple independent results)
- [Use video formats for animated content | Lighthouse | Chrome for Developers](https://developer.chrome.com/docs/lighthouse/performance/efficient-animated-content) — 80-96% size reduction figures, MEDIUM confidence
- [Lazy Loading Images with Vue.js Directives and Intersection Observer | CSS-Tricks](https://css-tricks.com/lazy-loading-images-with-vue-js-directives-and-intersection-observer/) — MEDIUM confidence
- npm registry direct queries (`npm view v-lazy-image`, `npm view vue-lazyload`, `npm view vue-meta`) — direct registry data for version numbers, treated as MEDIUM confidence per verification protocol
- [Vue Meta official site / GitHub](https://github.com/nuxt/vue-meta) — maintenance status, MEDIUM confidence
- [Formspree vs. Web3Forms Usage and Pricing Comparison](https://www.wmtips.com/technologies/compare/formspree-vs-web3forms/) — MEDIUM confidence
- [GoatCounter – open source web analytics](https://www.goatcounter.com/) / [Plausible Analytics](https://plausible.io/) — MEDIUM confidence
- [Embed Itch.io Games – Documentation – Portfoliobox](https://www.portfoliobox.com/learn/embed-itch-games) — LOW confidence (single third-party source, not itch.io's own docs directly fetched)
- [6 best free static website hosting services compared - Appwrite](https://appwrite.io/blog/post/best-free-static-website-hosting) — MEDIUM confidence
- [Can ATS Read PDF Resumes? 2026 Format Guide - Smallpdf](https://smallpdf.com/blog/do-applicant-tracking-systems-prefer-resumes-in-pdf-format) — MEDIUM confidence
- Direct repo inspection (`public/img/projects/` file sizes via `ls -la`, `public/index.html`, `src/helpers.ts`) — HIGH confidence, ground truth from this codebase

---
*Stack research for: game-dev job-search portfolio (Vue 2 static site, supporting technical additions)*
*Researched: 2026-07-21*
