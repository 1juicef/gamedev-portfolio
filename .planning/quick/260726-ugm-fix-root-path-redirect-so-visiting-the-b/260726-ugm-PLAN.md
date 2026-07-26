---
phase: quick-260726-ugm
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - src/router/index.ts
  - src/components/Header.vue
autonomous: true
requirements: [QT-260726-ugm-mount-game-projects-at-root-instead-of-redirecting]

must_haves:
  truths:
    - Loading the bare domain renders the game projects timeline with the address bar left exactly as typed — no hash fragment gets appended
    - The route table contains exactly one redirect entry, the catch-all to /404
    - Visiting /game-projects (or its hash-mode equivalent) still renders the same timeline, so every previously shared or indexed deep link keeps working
    - The router is still constructed with only a routes option — hash mode remains the default, publicPath is untouched
    - Both root and /game-projects resolve to the same lazily-imported GameProjects.vue chunk
    - Header and Footer mascot images are unchanged on the landing page because both switch statements fall through to the same asset their /game-projects case returns
    - The Header's Projects nav-link targets "/" (not "/game-projects"), so the nav underline is correctly active on the landing page (user's explicit choice, accepting that an old bookmarked #/game-projects deep link won't show the underline)
  artifacts:
    - src/router/index.ts (root route becomes a component mount)
  key_links:
    - The root route and the /game-projects route both point at ../views/GameProjects.vue via the same webpackChunkName "about" comment, so they share one chunk and there is no second download
    - Header.vue and Footer.vue read this.$route.path; their default branches already return the /game-projects assets, so the new / path needs no case added
---

<objective>
Mount GameProjects.vue directly on the root path so the bare domain renders content without the router rewriting the URL into a hash fragment.

Purpose: Today the root route redirects to /game-projects. Under the default hash-mode router that redirect turns a clean `www.josefubaka.com` into `www.josefubaka.com/#/game-projects` the instant the page loads — the first thing a recruiter sees is a URL that looks broken. Mounting the component at root removes the redirect, so nothing is rewritten.
Output: One route object changed in one file. No component edits, no style edits, no router-mode change.

One task by design: this is a four-line edit to a single route object, and the risk is entirely in what it might tempt someone to change alongside it.
</objective>

<execution_context>
@$HOME/.claude/gsd-core/workflows/execute-plan.md
</execution_context>

<context>
Verified before planning — do not re-derive these, they were read from source:

- `src/router/index.ts` is 47 lines, seven route objects. No `mode` option is passed to the VueRouter constructor, so vue-router 3 defaults to hash mode. That is deliberate and documented in STATE.md Blockers/Concerns: hash mode and the default `publicPath: '/'` stay untouched, because changing either silently breaks deep links and the live URL. **This plan works inside that constraint, not around it** — a component mounted at `/` needs no server rewrite rule and is safe on GitHub Pages exactly as-is.
- Every route in the file uses the identical lazy-import form with a `webpackChunkName: "about"` magic comment. All views therefore share one chunk. Reusing the same comment on the new root route means root and `/game-projects` cost one download between them.
- Two redirects exist today: the root one (being removed) and the catch-all `*` to `/404` (staying).
- `src/components/Header.vue` — `mascotSrc` switches on `this.$route.path`; its `default` branch returns `img/projects/Guy.gif`, byte-identical to what its `/game-projects` case returns. Landing at `/` therefore shows the same mascot. No change needed.
- `src/components/Footer.vue` — same pattern; `default` returns `img/projects/Guy2.gif`, identical to its `/game-projects` case. No change needed.
- `src/views/About.vue` links to `/game-projects`, but About is not in the route table and is unreachable. Irrelevant here.
- One genuine behaviour change was found in Header.vue — see the deviation flag below. It is **out of scope for this plan** and must not be fixed inside it.

Ponytail check: the whole fix is deleting a redirect and pointing the existing route object at the component the redirect was heading to anyway. Nothing to add, nothing to configure, no router mode to migrate, no build setting to touch. The shortest correct diff is also the safest one.
</context>

<deviation_flag>
## Found during planning — resolved by user before execution

**Header nav underline would have disappeared on the landing page.**

`Header.vue` styles its active nav item with `.router-link-exact-active`, and its Projects link targeted `/game-projects`. vue-router 3 only applies the exact-active class when the current path matches the link target exactly. Today the redirect means a visitor is always on `/game-projects` when the timeline is showing, so the Projects item is underlined. After Task 1 alone, a visitor landing on the bare domain would sit on `/` while the link still targeted `/game-projects`, leaving the Projects nav item unlined.

User decision: **Option A** — point the Header link at `/` instead of `/game-projects`. Landing page underlines correctly; anyone arriving on an older `/#/game-projects` link sees no underline instead (accepted tradeoff). This is now Task 2 below.
</deviation_flag>

<tasks>

<task type="auto">
  <name>Task 1: Mount GameProjects at the root path</name>
  <files>src/router/index.ts</files>
  <read_first>src/router/index.ts (whole file, 47 lines — note the shared lazy-import form and magic-comment style used by every existing route)</read_first>
  <action>
Rewrite the first route object in the `routes` array — the one whose `path` is `/` — so that instead of forwarding to another path it mounts a component directly.

Give it three properties, in the same order and formatting the neighbouring route objects use: the same `path` value it already has, a `name` of `Game Projects`, and a `component` that is the identical lazy `import()` arrow function the `/game-projects` route uses, including the same `webpackChunkName` magic comment so both routes resolve to one shared chunk. Copy that import line character for character from the route below it rather than retyping it.

Leave the array's remaining six route objects byte-identical, including the `/game-projects` route — it stays a separate, independently resolving entry, and both it and the root entry will render the same component. Two routes sharing one `name` is accepted here; nothing in this codebase performs named-route navigation.

Change nothing else in the file: no `mode` option on the VueRouter constructor, no `base` option, no scroll behaviour, no import reordering, no touching the catch-all entry at the bottom of the array. Do not open `vue.config.js`, `public/index.html`, or any `.vue` file — in particular do not adjust `Header.vue`, whose nav-underline behaviour is a known, deliberately deferred item recorded in this plan's deviation flag.

Add no explanatory comments to the file. The existing magic comments are the only comments this file should contain when you are finished.
  </action>
  <verify>
    <automated>grep -v '//' src/router/index.ts | grep -c redirect # expect 1 — only the catch-all entry survives</automated>
    <automated>grep -v '//' src/router/index.ts | grep -c "mode" # expect 0 — hash mode still implicit</automated>
    <automated>grep -v '//' src/router/index.ts | grep -c "base" # expect 0</automated>
    <automated>grep -c "GameProjects.vue" src/router/index.ts # expect 2 — root and /game-projects</automated>
    <automated>grep -c "path:" src/router/index.ts # expect 7 — no route added or lost</automated>
    <automated>grep -c "webpackChunkName" src/router/index.ts # expect 6 — five original component routes plus the new root one</automated>
    <automated>git diff --stat # expect exactly one file changed: src/router/index.ts</automated>
    <automated>npm run lint</automated>
    <human-check>Run `npm run serve` and open the dev server root (e.g. http://localhost:8080) with a fresh/hard-reloaded tab. Confirm the address bar still reads the bare host with NO `#/game-projects` appended, and that the game projects timeline renders with the header mascot and footer mascot both looking exactly as they did before. Then click Resume, then Projects, and confirm you land on `#/game-projects` and the timeline renders identically. Finally paste `http://localhost:8080/#/game-projects` directly and confirm it still resolves. Expected and accepted on the root page only: the Projects nav item has no underline — that is the flagged Header.vue behaviour, leave it alone.</human-check>
  </verify>
  <done>The root route mounts GameProjects.vue via the same lazily-imported chunk as `/game-projects`; the only remaining redirect is the catch-all to /404; the VueRouter constructor still receives nothing but `routes`; `/game-projects` still resolves; loading the root URL appends no hash fragment; `npm run lint` passes; `git diff --stat` shows one changed file.</done>
</task>

<task type="auto">
  <name>Task 2: Point the Header's Projects link at the root path</name>
  <files>src/components/Header.vue</files>
  <read_first>src/components/Header.vue (whole file, 93 lines)</read_first>
  <action>
Change the single `<router-link to="/game-projects">Projects</router-link>` in the template to `<router-link to="/">Projects</router-link>`. Do not touch the `/resume` or `/contact` links, the `mascotSrc` computed property, or any style block.

This makes the nav underline (`.router-link-exact-active`) correctly highlight "Projects" when a visitor lands on the bare domain, since Task 1 mounts the timeline directly at `/`. Accepted tradeoff (user's explicit choice): a visitor arriving via an old bookmarked `/#/game-projects` URL will not see the Projects item underlined, since the link now targets `/` rather than `/game-projects`.
  </action>
  <verify>
    <automated>grep -c 'router-link to="/"' src/components/Header.vue # expect 1</automated>
    <automated>grep -c 'router-link to="/game-projects"' src/components/Header.vue # expect 0</automated>
    <automated>grep -c 'router-link to="/resume"' src/components/Header.vue # expect 1</automated>
    <automated>grep -c 'router-link to="/contact"' src/components/Header.vue # expect 1</automated>
    <automated>git diff --stat -- src/components/Header.vue # expect exactly one line changed</automated>
    <automated>npm run lint</automated>
    <human-check>With the dev server running, load the bare root URL and confirm "Projects" is underlined. Click Resume then Contact and confirm those underline correctly and Projects loses its underline while on them. Click Projects and confirm it navigates to `/` (not `/game-projects`) and re-underlines.</human-check>
  </verify>
  <done>The Header's Projects link targets "/"; the nav underline is correct on the landing page and when navigating between all three sections; `npm run lint` passes; only Header.vue changed in this task.</done>
</task>

</tasks>

<threat_model>
## Trust Boundaries

| Boundary | Description |
|----------|-------------|
| Browser address bar → vue-router route resolution | User-controlled URL selects which lazily-imported view component renders |

## STRIDE Threat Register

| Threat ID | Category | Component | Severity | Disposition | Mitigation Plan |
|-----------|----------|-----------|----------|-------------|-----------------|
| T-QUICK-01 | Information disclosure | Root route now mounting a view instead of redirecting | low | accept | The component mounted at `/` is the same one previously reached one hop later via the redirect. No route is added, no previously unreachable view becomes reachable, and no data is fetched — every view is static build-time content. Attack surface is identical before and after. |
| T-QUICK-02 | Denial of service (broken deep links) | `/game-projects` and all other routes | low | mitigate | The `/game-projects` route object is left byte-identical and the catch-all `*` to `/404` is untouched, so previously shared and search-indexed hash URLs keep resolving. Verified by an explicit grep on route count plus a human-check that pastes the legacy URL directly. Hash mode and `publicPath` stay untouched per the STATE.md constraint, so no server rewrite rule becomes a new dependency. |

No package-manager installs in this plan, so the package legitimacy gate does not apply.
</threat_model>

<success_criteria>
- Loading the bare host renders the timeline with zero URL rewriting and no hash fragment appended
- `src/router/index.ts` contains exactly one redirect: the catch-all to /404
- `/game-projects` still resolves and renders the same view; its route object is unchanged
- The VueRouter constructor still receives only `routes` — no mode, no base; `publicPath` and `public/index.html` untouched
- Root and `/game-projects` share one webpack chunk via the same magic comment
- Exactly one file changed across the whole plan; no `.vue` file, config file, or stylesheet touched
- The Header nav-underline finding is left unfixed and carried forward as a flagged item, not silently absorbed
- `npm run lint` passes
</success_criteria>

<output>
Create `.planning/quick/260726-ugm-fix-root-path-redirect-so-visiting-the-b/260726-ugm-SUMMARY.md` when done. Record the Header nav-underline deviation flag in the summary so it survives into STATE.md as an open item.
</output>
