# Stack Research

**Domain:** Static Vue 2 portfolio — custom-domain GitHub Pages deploy + in-page code/screenshot snippets
**Researched:** 2026-07-23
**Confidence:** HIGH

> Supersedes the stack research section of this file from the 2026-07-21 pass (v1.0/v1.1 scope: GIF conversion, resume PDF, contact form, analytics). Those topics are out of scope for this milestone (v1.2) and already resolved/shipped; this file is scoped only to the two new v1.2 stack questions: (a) custom-domain GitHub Pages deploy, (b) code/Blueprint snippets in a new "Technical Overview" overlay section.

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| `gh-pages` (npm) | 6.3.0 | Pushes `dist/` to a `gh-pages` branch on demand | One dependency, one `npm run deploy` script, zero YAML. For a personal portfolio that changes rarely, an on-demand push beats standing up a CI pipeline for something that will run a handful of times a year. |
| Native `<details>`/`<summary>` (HTML5) | n/a (browser built-in) | Collapsible "Technical Overview" section | Already accessible (keyboard + screen reader), needs zero JS and zero new dependency. It's literally what a "click a heading, content folds out" spec describes — no reason to write a custom toggle component for this. |
| Plain `<pre><code>` + Less rules in `projects.less` | n/a | Rendering 2-3 code/blueprint snippets per project | Fits the existing `v-html` raw-HTML-string pattern exactly (same pattern already used for `.pc-video`, `.itch-badge`, etc.). No JS execution needed at all — it's just marked-up text. |

### Supporting Libraries

None required for either feature. See "What NOT to Use" below — this is the point where the ladder says stop.

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| GitHub Pages (Settings → Pages) | Hosting config | Source: "Deploy from a branch", branch `gh-pages`, folder `/ (root)`. Enter the custom domain in the "Custom domain" field once DNS is live, then enable "Enforce HTTPS" after the padlock/DNS check goes green (can take up to ~24h for cert issuance). |
| `public/CNAME` (plain text file, no extension) | Tells GitHub Pages which custom domain to serve | Content is exactly `www.josefubaka.com` (one line, no protocol, no trailing slash). Vue CLI copies everything in `public/` verbatim to the root of `dist/` on every build — so committing this file once means every future `gh-pages -d dist` deploy carries it automatically. **Do not** rely on typing the domain into the Settings UI alone: that writes the CNAME straight onto the `gh-pages` branch, and the next `gh-pages -d dist` push (which replaces the whole branch content) will silently wipe it if it isn't also in `public/`. |

## Installation

```bash
# Core
npm install -D gh-pages

# No other packages needed for either (a) or (b) — see "What NOT to Use"
```

Add to `package.json` scripts:
```json
"deploy": "npm run build && gh-pages -d dist"
```

## Integration Details

### (a) GitHub Pages custom domain deploy

**Why no `vue.config.js` change is needed:** the site currently has no `vue.config.js`, so `publicPath` defaults to `/`. That default is correct for a custom domain — GitHub Pages serves a custom-domained project page as if it were at the domain root, not under `/gamedev-portfolio/`. (If the custom domain is ever dropped and the site reverts to the un-domained `1juicef.github.io/gamedev-portfolio/` URL, `publicPath: '/gamedev-portfolio/'` would be needed — but don't add that now, it's the wrong setting for this milestone.)

**Steps:**
1. `public/CNAME` → single line `www.josefubaka.com`, commit it.
2. `npm install -D gh-pages`, add the `deploy` script above.
3. Namecheap → domain → Advanced DNS → add a **CNAME Record**: Host `www`, Value `1juicef.github.io.` (trailing dot as Namecheap expects), TTL Automatic. Leave existing records (MX, etc.) untouched — this only adds/edits the `www` host entry.
   - Apex (`josefubaka.com` without `www`) is out of scope for this milestone since the target is specifically `www.josefubaka.com`, but if apex should also resolve later, add four **A Records** on `@` pointing to GitHub's Pages IPs: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`, plus a Namecheap **URL Redirect Record** forwarding apex → `www`.
4. `npm run deploy` once to create/populate the `gh-pages` branch.
5. GitHub repo → Settings → Pages: confirm Source is `gh-pages` branch, `/ (root)`; enter `www.josefubaka.com` in "Custom domain" and Save (this validates DNS and, once propagated, unlocks "Enforce HTTPS").
6. Update `og:url` / `og:image` in `public/index.html` (currently hardcoded to `https://1juicef.github.io/gamedev-portfolio/...`) to the new domain, and re-check the social preview card — PROJECT.md explicitly calls this out as closing a long-deferred Phase 3 UAT gap.

**GitHub Actions — deliberately not recommended for this milestone.** `actions/upload-pages-artifact` + `actions/deploy-pages` would auto-deploy on every push to `main`, but that solves a problem this project doesn't have (infrequent manual updates, no existing CI in the repo today). Revisit only if updates become frequent enough that "forgetting to run `npm run deploy`" becomes an actual recurring problem.

### (b) Technical Overview: code/Blueprint snippets in the overlay

**Markup pattern** (goes straight into a project's `htmlDescription` string in `GameProjectsData.ts`, same file/pattern every other overlay section already uses):

```html
<details class="tech-overview">
  <summary>Technical Overview</summary>
  <p class="paragraph">One or two sentences of rationale...</p>
  <pre class="code-snippet"><code>private void OnCollisionEnter(Collision col) {
    if (col.gameObject.CompareTag("Hazard"))
        TriggerRespawn();
}</code></pre>
  <img class="blueprint-shot" src="/img/projects/drag-rush/blueprint-1.png" alt="Blueprint graph for respawn logic" />
</details>
```

Add matching rules to `src/css/projects.less` (globally loaded, unscoped — same reason the other project-content classes live there and not in `ProjectDetailsOverlay.vue`'s `<style scoped>`):

```less
.tech-overview {
    margin: 20px 0;

    summary {
        cursor: pointer;
        font-weight: bold;
    }
}

.code-snippet {
    background: #1a0e22;
    border: 1px solid #4a2a5c;
    border-radius: 4px;
    padding: 12px;
    overflow-x: auto;
    font-family: monospace;
    font-size: 0.85em;
    white-space: pre;
}

.blueprint-shot {
    width: 100%;
    max-width: 500px;
}
```

**HTML-escaping the C# snippets is the one real gotcha.** Because these are raw HTML strings, any `<`, `>`, or `&` in the actual C# source (generics, comparisons, `&&`) must be written as `&lt;`, `&gt;`, `&amp;` in the TypeScript string literal, or the browser will try to parse them as tags. With only ~2-3 snippets × 2 Unity/C# projects (Drag Rush, SwingSpace — Floor Zero and Dispater are Blueprint screenshots, no text to escape), hand-escaping when pasting each snippet in is the lazy-correct move — don't add an HTML-escaping library for this. If it gets tedious, a 3-line helper in `helpers.ts` (`Helpers.escapeHtml(str)` using `.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')`) covers it without a dependency.

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|--------------------------|
| `gh-pages` npm package (manual `npm run deploy`) | GitHub Actions (`actions/configure-pages` + `actions/deploy-pages`) | If deploys become frequent/automatic-on-merge is actually wanted, or multiple contributors need deploys without local build access. |
| Native `<details>`/`<summary>` | Vue-driven toggle (`v-if`/`v-show` + click handler in a component) | Only if the fold-out needs to be driven by more complex state than "open/closed" (e.g. syncing scroll position, analytics on open) — not the case here. |
| Plain `<pre><code>` + Less | Prism.js (core ~2KB gzip + 1 language grammar + 1 theme, loaded via CDN `<script>`, call `Prism.highlightAll()` after the overlay mounts) | If syntax coloring (keywords/strings in different colors) is specifically wanted and a bit more visual complexity per snippet is acceptable. Reasonable and still lightweight — but adds a script tag, a `nextTick()`/`updated()` re-highlight call after `v-html` renders, and one more thing that can silently stop working. Given this is ~6-8 short static Unity/C# snippets that never change, monospace + background/border reads clean without it. |
| Plain `<pre><code>` + Less | `highlight.js` | Same tradeoff as Prism, heavier default bundle (auto-detects language, pulls in more of its language grammar set unless manually trimmed) — no reason to reach for this over Prism if syntax coloring is wanted, and no reason to want either given the low snippet count here. |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|--------------|
| Full syntax-highlighter bundle (Prism/highlight.js) for ~2-3 snippets/project | Adds a script dependency, a post-`v-html`-render re-highlight step, and visual complexity for content that's read once per project click — the "heavy dependency for a personal portfolio" anti-pattern this milestone explicitly wants to avoid | Plain `<pre><code>` + monospace font + subtle background/border via `projects.less` |
| Custom JS accordion/collapse library or hand-rolled Vue toggle component | Reinvents what `<details>`/`<summary>` gives for free, including keyboard and screen-reader support | Native `<details>`/`<summary>` |
| GitHub Actions CI/CD workflow for deploy | More moving parts (YAML, permissions, artifact upload/download steps) than a personal portfolio with infrequent, manual updates needs right now | `gh-pages` npm package + `npm run deploy` |
| Static-site-generator swap (Nuxt/VitePress/etc.) or SSR | Explicitly out of scope per CLAUDE.md — "this is a content/design polish pass, not a re-platform" | Keep vue-cli-service as-is |
| `vue.config.js` `publicPath` change to `/gamedev-portfolio/` | Wrong for a custom domain — that path prefix is only correct for the un-domained `username.github.io/repo/` URL | Leave `publicPath` at its default `/` |
| Relying on GitHub's Settings UI alone to set the CNAME | The `gh-pages` package overwrites the entire branch content on every deploy; a CNAME added only through Settings (not committed to `public/`) gets wiped on the next `npm run deploy` | Commit `public/CNAME` to the repo |
| An HTML-escaping npm package (e.g. `he`, `lodash.escape`) for the code snippets | Overkill for ~6-8 static, hand-authored snippets that are pasted once and never regenerated | Hand-escape `<`/`>`/`&` when pasting, or a 3-line helper function if it gets tedious |

## Stack Patterns by Variant

**If Josef later wants syntax coloring after seeing the plain version:**
- Add Prism.js via a CDN `<script>` tag in `public/index.html` (core + a C# language component + a generic theme), call `Prism.highlightAll()` in the overlay's `updated()` hook after `v-html` content changes.
- Because it's opt-in progressive enhancement — the plain version already works and looks acceptable, so this becomes a "nice to have" polish task, not a blocking dependency choice now.

**If the apex domain (`josefubaka.com` without `www`) needs to resolve too:**
- Add four A records on `@` to GitHub's Pages IPs, plus a Namecheap URL Redirect Record forwarding apex → `www`.
- Because GitHub Pages custom-domain config only lists one primary domain in the `CNAME` file/Settings field; the apex needs to either redirect to it or be configured as a second target, and a redirect is simpler than dual DNS+CNAME juggling.

## Version Compatibility

| Package A | Compatible With | Notes |
|-----------|-----------------|-------|
| `gh-pages@6.3.0` | Node.js >=10 | No conflict with the project's existing Node/webpack setup; it's a standalone CLI that just runs `git` commands against a `dist/` folder, doesn't touch webpack config or `vue.config.js` at all. |
| `public/CNAME` | Vue CLI 4.5.0 public-folder copy behavior | Vue CLI copies everything under `public/` to the root of the build output unmodified (except `index.html`, which is templated) — existing, unconfigured default behavior, nothing new to set up. |
| `<details>`/`<summary>` | All evergreen browsers (Chrome, Firefox, Edge, Safari) | No polyfill needed for a job-search portfolio's realistic browser mix. |

## Sources

- GitHub Docs — "Managing a custom domain for your GitHub Pages site" (official, HIGH confidence) — verified A-record IPs, CNAME record pattern for `www` subdomain, Settings → Pages custom-domain flow
- GitHub Docs — "Troubleshooting custom domains and GitHub Pages" (official, HIGH confidence) — verified HTTPS enforcement timing/requirements
- npm registry (`npm view gh-pages version` / `engines`) — confirmed current version 6.3.0, `engines.node >=10` (direct registry check, HIGH confidence)
- Existing codebase inspection (`src/css/projects.less`, `src/data/ProjectData.ts`, `ProjectDetailsOverlay.vue`, `package.json`, absence of `vue.config.js`) — confirmed the `v-html` raw-string + globally-loaded `projects.less` pattern that (b) needs to slot into, and confirmed no `vue.config.js`/`gh-pages`/CI config exists today (HIGH confidence, direct file read)

---
*Stack research for: static Vue 2 portfolio — custom-domain deploy + code/screenshot snippet display (v1.2 milestone)*
*Researched: 2026-07-23*
