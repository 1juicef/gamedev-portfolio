# Pitfalls Research

**Domain:** Static Vue 2 SPA — GitHub Pages + custom domain deploy, and `v-html`-rendered code/collapsible content
**Researched:** 2026-07-23
**Confidence:** MEDIUM (deployment/DNS mechanics verified against official GitHub docs + cross-checked community sources; `v-html`/router/publicPath findings are HIGH confidence — directly read from this repo's actual source, not general advice)

## Critical Pitfalls

### Pitfall 1: `publicPath` already mismatched with the live github.io URL, and nobody is watching it

**What goes wrong:**
There is no `vue.config.js` in this repo, so Vue CLI's `publicPath` defaults to `/`. But `public/index.html` currently hardcodes `og:url` as `https://1juicef.github.io/gamedev-portfolio/` — a **project page** subpath, not a user page. A default build (`publicPath: '/'`) emits asset references like `/js/app.xxx.js`, which is wrong for a `1juicef.github.io/gamedev-portfolio/` deployment (would need `/gamedev-portfolio/`) but exactly right for `www.josefubaka.com/`. In other words: the current config is already inconsistent with the currently-documented live URL, and the fix for the *new* domain (do nothing, since root-path default is correct for a custom domain) is invisible until you actually diff the two deploy targets side by side.

**Why it happens:**
`vue.config.js` doesn't exist, so there's no explicit record of what publicPath assumption is "in production" today — it's tribal knowledge, not committed config. Anyone testing an interim github.io build during the domain cutover, or anyone who "helpfully" adds a `vue.config.js` with `publicPath: '/gamedev-portfolio/'` to fix the github.io case, will silently break the custom-domain deploy the moment the CNAME goes live (or vice versa).

**How to avoid:**
Do not add a `publicPath` override. Leave it as default (`/`) — that's correct for `www.josefubaka.com` root. If you need one last working github.io build during the DNS propagation window, build with an explicit override at build time only (`vue-cli-service build --publicPath /gamedev-portfolio/`), never commit that as the default in `vue.config.js`. Treat the custom-domain root config as the only one that ships.

**Warning signs:**
Blank page or 404s on `/js/*.js`, `/css/*.css` after a deploy; DevTools Network tab shows requests resolving to the wrong path (e.g., `1juicef.github.io/js/app.js` instead of `1juicef.github.io/gamedev-portfolio/js/app.js`).

**Phase to address:** domain-deploy

---

### Pitfall 2: DNS records misconfigured on Namecheap (leftover parking records, wrong CNAME target)

**What goes wrong:**
Namecheap domains ship with default "Parking Page" host records (often a `CNAME @` to a Namecheap parking service, or a URL Redirect record) that silently conflict with GitHub Pages' required records. Two distinct mistakes compound here: (1) not deleting Namecheap's default records before adding GitHub's, so both exist and DNS resolution is unpredictable; (2) pointing the `www` CNAME at the custom domain itself (`www.josefubaka.com`) instead of at `1juicef.github.io`, which either loops or simply fails GitHub's domain verification.

**Why it happens:**
Namecheap's Advanced DNS UI shows pre-populated rows that look inert but aren't; GitHub's own docs list the exact records needed but don't mention "also delete these other rows first."

**How to avoid:**
In Namecheap Advanced DNS: delete any existing parking/redirect records for `@` and `www`. Add four `A` records for `@` pointing to GitHub Pages' IPs (185.199.108.153, .109.153, .110.153, .111.153) and a `CNAME` for `www` pointing to `1juicef.github.io` (no `https://`, no trailing slash). In the repo's GitHub Pages settings, the "Custom domain" field must contain the exact string that will actually resolve — `www.josefubaka.com` per this milestone's target — matching the `CNAME` file content byte-for-byte.

**Warning signs:**
`dig www.josefubaka.com` or `dig josefubaka.com` returns unexpected records (Namecheap parking IPs, or nothing); GitHub Pages settings shows a red "DNS check unsuccessful" banner.

**Phase to address:** domain-deploy

---

### Pitfall 3: `CNAME` file placement/survival and repeated domain-field edits reset HTTPS cert issuance

**What goes wrong:**
Two related traps: (a) the `CNAME` file must live at `public/CNAME` (not repo root, not manually dropped into `dist/`) so Vue CLI copies it into every build output — if it's added directly to a `gh-pages` branch by hand instead, the next automated/rebuilt deploy that doesn't carry it forward will silently drop the custom domain and GitHub Pages reverts to serving the default `.github.io` URL only. (b) GitHub only enables "Enforce HTTPS" once its automatic Let's Encrypt cert issuance completes, which requires DNS to already be correct — repeatedly retyping/saving the custom-domain field while troubleshooting DNS (common during a fumbled first attempt) restarts domain verification and cert issuance each time, so "it's been 20 minutes and HTTPS still isn't available" is often self-inflicted from re-triggering, not slow propagation.

**Why it happens:**
The `public/` → `dist/` copy behavior isn't obvious if you're used to manually editing a `gh-pages` branch; and GitHub's UI doesn't warn that re-saving the domain field resets the cert clock.

**How to avoid:**
Commit `public/CNAME` (single line, just `www.josefubaka.com`) so it's part of every build, never a manual post-build step. Get DNS records correct *before* typing the domain into GitHub's Pages settings at all, so it only needs to be set once. If troubleshooting is needed, wait for DNS to actually propagate (check with `dig`) rather than re-saving the field repeatedly.

**Warning signs:**
Pages settings shows custom domain reverting to blank after a deploy; "Enforce HTTPS" checkbox stays greyed out well past 24 hours after DNS looks correct via `dig`.

**Phase to address:** domain-deploy

---

### Pitfall 4: Router is hash-mode by default (undocumented) — don't "clean up" the URLs without adding a 404 fallback

**What goes wrong:**
`src/router/index.ts` has no `mode` option set, so Vue Router 3 defaults to **hash mode** (`/#/game-projects`). This is actually *why* deep links currently survive a GitHub Pages reload with zero server config — hash fragments never hit the server as a path. If the redesign or domain work quietly switches to `mode: 'history'` for nicer-looking URLs, any direct load of `/resume`, `/contact`, `/other-projects`, or a shared social link to a specific page will 404 at the GitHub Pages/CDN level, because GitHub Pages has no server-side rewrite rule — the app's own internal `/404` catch-all route never gets a chance to run since the request never reaches the SPA's JS.

**Why it happens:**
History mode looks more "professional" and is an easy incidental change to make while touching `router/index.ts` for unrelated reasons (e.g., during the redesign pass). The current hash-mode behavior is invisible/undocumented — nothing marks it as intentional.

**How to avoid:**
Leave router mode as-is (hash) unless someone explicitly commits to adding the classic SPA-on-GitHub-Pages fallback (a `public/404.html` that redirects back into the app, decoded by a small script in `index.html`). Don't change `mode` as a drive-by edit during the dark-theme or domain work.

**Warning signs:**
URLs shift from `#/resume`-style to bare `/resume`; sharing a direct link to any non-root route returns GitHub's plain 404 page instead of the app.

**Phase to address:** redesign (most likely to touch `router/index.ts` incidentally) and domain-deploy (verify deep links after cutover)

---

### Pitfall 5: `v-html` does not escape or compile anything — code snippets need manual entity-escaping and can break the TS template literal itself

**What goes wrong:**
`ProjectDetailsOverlay.vue` renders `htmlContent` via `v-html`, and that string is hand-authored raw HTML inside a JS/TS template literal in `GameProjectsData.ts` (and equivalents for the other 3 projects). Two separate failure modes when pasting real code/Blueprint pseudocode in as a snippet:
1. **HTML injection, not display.** `v-html` performs zero escaping (unlike `{{ }}` interpolation). A snippet containing `List<GameObject>` or `if (x < y)` will have `<GameObject>` or `< y>` parsed as literal (bogus) HTML tags — the angle-bracket content silently vanishes from the rendered output instead of displaying as code text.
2. **Template literal breakage.** The whole `htmlDescription` is itself a backtick (`` ` ``) string in TypeScript. C# interpolated strings (`` $"Player: {name}" ``) or a stray literal backtick anywhere in pasted code will either truncate the TS string early or fail to compile, and the error surfaces in the *data file*, far from the code that "looks fine" pasted into an editor.

**Why it happens:**
The existing pattern (images, iframes, plain prose) never needed entity-escaping because none of that content contains `<`/`>`/`&`/backticks as literal text. Code snippets are the first content type in this codebase that does.

**How to avoid:**
Before embedding any snippet, run it through an HTML-entity escape (`&` → `&amp;`, `<` → `&lt;`, `>` → `&gt;`) — a tiny helper in `src/helpers.ts` (already the home for shared utilities) that a plan can call at authoring time, or just do the escaping by hand for the 2-3 snippets per project since volume is small. Separately, backslash-escape any literal backtick or `${` sequence in the source TS string, and avoid pasting C# interpolated strings verbatim without checking for this.

**Warning signs:**
Code block renders with chunks of text missing (the "vanished" content is usually a whole line that looked like a tag); a `tsc`/lint error pointing at an unrelated later line in `GameProjectsData.ts` after adding a snippet (classic sign of a broken template literal).

**Phase to address:** tech-overview

---

### Pitfall 6: Collapsible must be built with native `<details>`/`<summary>` inside the v-html string — Vue directives inside `v-html` content do nothing

**What goes wrong:**
Vue never compiles templates/directives inside `v-html` — it's raw `innerHTML`. If the Technical Overview fold-out is built expecting `@click`/`v-if`/`v-show` to toggle visibility *inside* the `htmlContent` string, nothing happens: no error, no console warning, just a dead click. This is an easy trap specifically because the rest of the overlay component (the Close button, the `visible` prop) *does* use real Vue reactivity — it's easy to assume the pattern carries into the injected HTML too.

**Why it happens:**
The distinction between "real Vue template" (works) and "`v-html` string" (static, inert) isn't visually obvious in the data file — it's all just HTML-looking markup either way.

**How to avoid:**
Use the native `<details><summary>Technical Overview</summary>...</details>` element directly inside each project's `htmlDescription` string. It requires zero JS/Vue — the browser handles expand/collapse natively, matching this codebase's existing "plain data string" pattern with the least new code (no custom Vue subcomponent needed for something a native HTML element already solves).

**Warning signs:**
Clicking the "Technical Overview" heading does nothing; no console error at all (the quiet failure mode makes it easy to miss in a quick check).

**Phase to address:** tech-overview

---

### Pitfall 7: Expand/collapse layout shift inside a non-scroll-contained, `position:absolute` modal

**What goes wrong:**
`.dialog` in `ProjectDetailsOverlay.vue` is `position: absolute` and sized by content — there's no fixed-height scroll container. A `<details>` toggle that changes several hundred pixels of height will reflow everything below it (the Close button, and on mobile potentially the whole page scroll position) with a visible jump if anything animates height via `display:none`/`block` toggling rather than the browser's own native (instant, non-animated) `<details>` behavior.

**Why it happens:**
It's tempting to add a smooth height transition for polish, but animating `height`/`max-height` on an element whose parent has no defined height forces a full layout recalculation on every frame, and native `<details>` doesn't support a CSS transition on open/close out of the box.

**How to avoid:**
Default to native `<details>` with no added animation (instant open/close) — this is the lazy, zero-risk answer for 2-3 snippets and matches the constraint that this is a scoped content addition, not a component rebuild. If animation is truly wanted later, it needs a wrapping `overflow:hidden` element with a `max-height`/`grid-template-rows` transition, added deliberately, not the default `<details>` behavior — treat that as a separate, explicit follow-up, not bundled in silently.

**Warning signs:**
Visible jump/flash when toggling on a real device; Close button appears to "jump" position after expanding a snippet section above it.

**Phase to address:** tech-overview

---

### Pitfall 8: Code blocks overflow horizontally on mobile and can widen the whole modal

**What goes wrong:**
Existing `projects.less` classes (`.pc-screenshot`, `.pc-video`, `iframe.youtube`) all assume `width: 100%` content that naturally wraps or scales. Code text does not wrap by default inside `<pre>` (`white-space: pre`), so a single long C# line or Blueprint node-graph caption can force the `<pre>` block wider than its container — and because `.dialog`/`.dialog-content` have no explicit horizontal-overflow containment today, that can push the *entire modal* wider than the viewport on a phone, not just clip the code block.

**Why it happens:**
Every existing content type in `projects.less` (images, iframes, prose) is inherently no-wider-than-container; code is the first content type that can organically exceed it.

**How to avoid:**
Add a dedicated class (e.g. `.tech-snippet` or `.code-block`) to `src/css/projects.less` — the correct home per this repo's convention, since it's globally-loaded unscoped CSS for dynamic `v-html` content — with `overflow-x: auto; max-width: 100%;` on the `<pre>` itself, so only the code block scrolls horizontally, never the modal.

**Warning signs:**
On a phone-width viewport, the whole overlay dialog scrolls sideways instead of just the code snippet.

**Phase to address:** tech-overview

---

### Pitfall 9: Code text unreadable against the dark gradient without an explicit background/foreground pair

**What goes wrong:**
`.dialog-content` already uses a near-black-to-purple gradient background with white text. If a code snippet is pasted with inline syntax-highlight colors copied straight out of an IDE/Blueprint export (common — these tools often export spans with dark-on-light colors baked in), those inline styles can render near-invisible against the dark gradient, or the surrounding `color: #fff` inheritance can wash out a snippet that expected a light background.

**Why it happens:**
Copy-paste from Rider/Visual Studio/Unreal's Blueprint screenshot-with-syntax-highlighting tooling assumes a light editor background; nobody notices until it's viewed live against the dark theme.

**How to avoid:**
Give the code block its own explicit background (e.g., a solid dark panel a shade different from the gradient, like `#1a1a1a` or similar) and explicit text color in `projects.less`, rather than relying on inherited page colors — and strip any inline `style="color:..."` spans from pasted snippets before embedding, keeping snippets as plain escaped text rather than "rich" syntax-highlighted HTML.

**Warning signs:**
A code snippet that "looks fine in the editor" renders with barely-visible or mismatched-color text once live.

**Phase to address:** tech-overview (must be checked together with redesign, since the gradient background is the redesign's deliverable)

---

### Pitfall 10: Collapsed-by-default and visibly "clickable" styling is what keeps the 10-second-scan Core Value intact — don't let it default open or look like body text

**What goes wrong:**
The whole point of putting code "behind a fold" (explicitly reversing the prior "no code shown" scope decision) is that the default view a recruiter scans in 10 seconds still shows *no code*. If `<details>` is left `open` by default, or the `<summary>` heading isn't visually distinct from the surrounding prose (no disclosure marker, no hover/cursor affordance), the feature either (a) shows code immediately to every visitor, defeating the stated intent, or (b) is invisible/undiscoverable to the technical leads it's meant for.

**Why it happens:**
It's the easiest implementation to leave `<details>` un-styled and un-audited — the native element technically satisfies "collapsible" without anyone checking the *default state* or *affordance clarity* against the Core Value.

**How to avoid:**
Never add the `open` attribute. Style `<summary>` explicitly (cursor: pointer, a visible marker, maybe an accent-color heading matching `@accentColor`) in `projects.less` so it clearly reads as an optional expandable, not a heading you're supposed to read as part of the main scan. Treat "collapsed by default, obviously clickable" as an explicit acceptance check for this feature, not an assumption.

**Warning signs:**
Loading a project overlay shows code content immediately without clicking anything; user testing shows technical reviewers not noticing the fold-out exists at all.

**Phase to address:** tech-overview

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|--------------------|-----------------|------------------|
| Manually building `dist/` and pushing to a `gh-pages` branch by hand instead of a CI workflow | Fast for a one-time launch | Every future content edit needs a manual rebuild+push; easy to forget `CNAME`/`.nojekyll` on a later push and silently break the live site | Only for the very first cutover verification build; add a workflow before ongoing edits resume |
| Leaving syntax-highlighted rich-HTML code snippets (inline color spans) instead of escaped plain text | Looks closer to an IDE screenshot | Breaks under dark theme (Pitfall 9), bloats the TS data file, harder to maintain/update later | Never — plain escaped text in a styled `<pre>` is simpler and safer |
| Overriding `publicPath` in `vue.config.js` to patch an interim github.io test build | Unblocks a quick sanity check before DNS is live | Easy to forget to revert before the real custom-domain build ships (Pitfall 1) | Only as a throwaway `--publicPath` CLI flag, never committed |

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|------------------|--------------------|
| Namecheap DNS → GitHub Pages | Leaving default parking/redirect host records alongside new A/CNAME records | Delete Namecheap's default `@`/`www` records first, then add GitHub's 4 A records + `www` CNAME to `1juicef.github.io` |
| GitHub Pages custom domain field ↔ `public/CNAME` | Domain typed into repo Settings doesn't exactly match `CNAME` file content (protocol, trailing slash, www vs apex) | Keep them byte-identical: `www.josefubaka.com`, no scheme, no trailing slash |
| `.env` / `public/index.html` metadata | Updating one but not the other — `.env`'s `VUE_APP_PRODUCTION_URL` and index.html's hardcoded `og:url`/`og:image` are two separate places (per CLAUDE.md, index.html is NOT templated from `.env`) | Update both in the same commit when the domain goes live; grep both files for the old `1juicef.github.io` string to confirm nothing's missed |
| vue-router hash mode ↔ GitHub Pages (no server rewrites) | Switching to `history` mode without a `404.html` SPA-redirect shim | Keep hash mode, or add the shim deliberately as its own scoped task if history mode is wanted |

## Security Mistakes

| Mistake | Risk | Prevention |
|---------|------|------------|
| Shipping the stray uncommitted `.env` line (`DEBUG=true`) seen in the current working tree diff | Baked into the production build permanently until a full rebuild+redeploy (`.env` values are build-time, not runtime, per CLAUDE.md) | Review `git diff .env` before any commit that touches deploy; strip debug-only lines before shipping |
| Pasting real project source snippets without reviewing for secrets/keys | Unity/Unreal source dirs may contain hardcoded API keys, internal URLs, or other team members' names/emails not meant for public display | Manually review each of the 2-3 chosen snippets per project before embedding; this is hand-curated content, not automated extraction, so review is a one-time human pass, not tooling |
| Enabling "Enforce HTTPS" before cert issuance completes, or leaving it off after | Mixed content warnings / cert errors for early visitors if toggled prematurely; unencrypted traffic if forgotten afterward | Wait for GitHub's cert to actually issue (checkbox becomes clickable), then enable, then re-verify the OG social-preview card over `https://` |

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-------------------|
| Code snippet section defaults open or reads as ordinary text | Recruiters see code in the first scan, defeating the stated Core Value | Collapsed-by-default `<details>` with a clearly styled, clickable `<summary>` (Pitfall 10) |
| Modal jumps/scrolls unexpectedly when a snippet expands | Feels janky, undermines "polished" redesign goal | Native `<details>` with no forced animation (Pitfall 7) |
| Code block causes sideways scroll on mobile | Breaks the whole overlay's mobile layout, not just the snippet | `overflow-x: auto` scoped to the `<pre>` only (Pitfall 8) |
| Sharing a direct link (e.g. to `/resume`) 404s after an incidental router-mode change | Broken links look unprofessional to exactly the recruiter audience this site targets | Don't change router mode without an explicit GitHub Pages 404-fallback plan (Pitfall 4) |

## "Looks Done But Isn't" Checklist

- [ ] **Custom domain deploy:** Often missing the `public/CNAME` file being committed (vs. manually added to a `gh-pages` branch once) — verify it reappears in `dist/` after every fresh `npm run build`
- [ ] **Custom domain deploy:** Often missing an updated `og:url`/`og:image` in `public/index.html` — verify by grepping for the old `1juicef.github.io` string after cutover
- [ ] **Technical Overview:** Often missing entity-escaping on angle brackets/ampersands in pasted code — verify by rendering each snippet and confirming no text has silently vanished
- [ ] **Technical Overview:** Often missing a collapsed-by-default state — verify by loading the overlay fresh and confirming no code is visible before clicking
- [ ] **Technical Overview:** Often missing mobile overflow handling — verify by viewing at ≤620px (this codebase's existing breakpoint) and confirming no sideways scroll
- [ ] **Dark theme redesign:** Often missing a check that newly-added code-block styling (from the tech-overview work) actually reads against the finished gradient background, not just against whatever background existed when each was built independently

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|-----------------|------------------|
| `publicPath`/asset-path mismatch after deploy | LOW | Confirm `vue.config.js` has no override, rebuild, redeploy — no code logic changes needed |
| DNS misconfigured on Namecheap | LOW | Fix host records in Advanced DNS; propagation delay (up to ~24h) is the only real cost, no rollback needed |
| Escaped-code snippet renders broken/vanished text | LOW | Fix the entity-escaping in the one affected `GameProjectsData.ts`/other data-file string; isolated to that project's entry |
| Router mode incidentally changed to `history`, deep links 404 on GitHub Pages | MEDIUM | Revert `mode` in `router/index.ts`, or add the `404.html` SPA-redirect shim — either is a small, contained fix but needs to be caught in review |
| HTTPS cert stuck due to repeated domain-field edits during troubleshooting | LOW | Stop editing the field, wait it out (or remove and re-add the domain once, then leave it alone) |

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|-------------------|----------------|
| `publicPath` mismatch vs. live URL | domain-deploy | Load the deployed site fresh (not cached), confirm no 404s in Network tab for JS/CSS chunks |
| Namecheap DNS misconfiguration | domain-deploy | `dig www.josefubaka.com` / `dig josefubaka.com` matches GitHub's documented A/CNAME records |
| `CNAME` file placement + repeated domain-field edits | domain-deploy | `dist/CNAME` present after a clean build; GitHub Pages settings shows "Enforce HTTPS" enabled and domain field stable |
| Router hash-mode regression | redesign, domain-deploy | Direct-load (not client nav) each route (`/resume`, `/contact`, `/other-projects`) on the live deployed URL after any router-touching change |
| `v-html` escaping / template-literal breakage | tech-overview | Visual check of each of the 4 projects' rendered snippets for missing/vanished text; `npm run build` succeeds with no TS syntax errors |
| Vue directives inert inside `v-html` | tech-overview | Manual click-test of every Technical Overview toggle on all 4 projects |
| Layout shift / CLS on expand | tech-overview | Manual toggle test, confirm no visible jump of the Close button or page scroll position |
| Mobile code overflow | tech-overview | View each project overlay at ≤620px viewport width, confirm no horizontal page scroll |
| Code contrast against dark gradient | tech-overview, redesign | Visual check after both are complete — do this check last, since it depends on both features being finished |
| Default-open / low-affordance collapsible | tech-overview | Fresh page load shows zero code visible pre-click; `<summary>` has a visible pointer/marker affordance |

## Sources

- [Managing a custom domain for your GitHub Pages site — GitHub Docs](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site) — MEDIUM confidence (official docs, cross-checked against community sources)
- [Troubleshooting custom domains and GitHub Pages — GitHub Docs](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/troubleshooting-custom-domains-and-github-pages) — MEDIUM confidence
- [How do I link my domain to GitHub Pages — Namecheap Knowledgebase](https://www.namecheap.com/support/knowledgebase/article.aspx/9645/2208/how-do-i-link-my-domain-to-github-pages/) — MEDIUM confidence
- [GitHub Pages with Namecheap custom domain (gist)](https://gist.github.com/plembo/84f80c920bb5ac6f19e53fe6f8db1ff7) — MEDIUM confidence (corroborates official docs)
- Direct repo inspection (HIGH confidence, not general advice): `src/router/index.ts` (no `mode` set → hash-mode default), absence of `vue.config.js` (→ `publicPath` default `/`), `public/index.html` current hardcoded `og:url`/`og:image` pointing at `1juicef.github.io/gamedev-portfolio/`, `src/components/ProjectDetailsOverlay.vue` (`v-html` usage, no scroll containment on `.dialog`), `src/css/projects.less` and `src/css/variables.less` (existing global unscoped class conventions and color variables), `src/data/GameProjectsData.ts` (template-literal `htmlDescription` pattern), uncommitted `.env` diff (stray `DEBUG=true` line)

---
*Pitfalls research for: adding a Technical Overview collapsible, dark-theme redesign, and custom-domain launch to an existing static Vue 2 portfolio*
*Researched: 2026-07-23*
