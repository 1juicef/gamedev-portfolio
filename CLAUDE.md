# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A static Vue 2 + TypeScript portfolio site template (originally forked from https://github.com/schouffy/gamedev-portfolio-template) for showcasing visual project work, customized here as Josef's game development portfolio. Content is edited directly in `.vue` files for static pages, and via TypeScript data files for the projects pages.

## Commands

- `npm run serve` — start dev server with hot reload
- `npm run build` — production build to `dist/`
- `npm run lint` — run ESLint (vue-cli-service lint) over `.ts`/`.vue` files

There is no test suite configured in this project.

Note: scripts wrap the underlying vue-cli-service commands with `NODE_OPTIONS=--openssl-legacy-provider` (needed for older webpack/OpenSSL compat on newer Node versions). If `npm run serve`/`build` fail with an OpenSSL error when invoking the underlying tool directly, set that env var.

## Architecture

**Stack**: Vue 2 (Options API, `Vue.extend`), vue-router 3, TypeScript, Less for styles, vue-cli-service/webpack build.

**Routing** (`src/router/index.ts`): a small fixed set of routes — `/` redirects to `/game-projects`, plus `/resume`, `/game-projects`, `/other-projects`, `/contact`, and a `/404` catch-all. All view components are lazy-loaded via dynamic `import()`.

**Data-driven project pages**: `GameProjects.vue` and `OtherProjects.vue` don't hardcode project content — they render from arrays of `ProjectData` instances defined in `src/data/GameProjectsData.ts` and `src/data/OtherProjectsData.ts`. Each `ProjectData` (`src/data/ProjectData.ts`) holds an `id`, `name`, thumbnail `iconUrl`, an `accentColor`, grid-sizing flags (`isWide`/`isHigh`), and a raw `htmlDescription` string that gets rendered with `v-html` inside `ProjectDetailsOverlay.vue` when a project card is clicked. To add/edit a project, edit the relevant data file only — no component changes needed. Any custom CSS classes used inside a project's `htmlDescription` HTML must have their styles added to `src/css/projects.less` (that stylesheet is loaded globally, not scoped, so those class names apply to overlay content).

**Two project list layouts**: `ProjectsList.vue` is a generic reusable grid component (used by `OtherProjects.vue`) that lays out project cards in a responsive grid and opens `ProjectDetailsOverlay` on click. `GameProjects.vue` instead implements its own bespoke "timeline" layout (alternating left/right rows per project, defined by the `projectRows` map in its `data()`) with hand-written per-project summaries — it does not reuse `ProjectsList.vue`.

**Static pages**: `About` (redirect target notwithstanding, not in current routes but present), `Resume`, `Contact`, `404` are plain static templates — edit their `.vue` files directly rather than through a data layer.

**Styling**: global styles/fonts/gradient background live in `App.vue`'s `<style lang="less">` block plus `src/css/variables.less` (color variables) and `src/css/projects.less` (styles for dynamic project HTML content, plus shared project-related component styles). Most components use `<style scoped>` for component-local CSS; note some components mix `scoped` with plain `<style>` conventions inconsistently — check each file.

**Assets**: static images/gifs/videos/fonts/downloadables go in `public/` (referenced by root-relative paths like `img/projects/...`, not `@/assets/...`). `Helpers.preloadImages` (`src/helpers.ts`) is called in `App.vue` to eagerly preload specific heavy images/gifs listed by hand so they're ready before a user navigates to the tab that shows them — when adding large new media referenced by a data file, consider adding it to that preload list.

**Site metadata**: `.env` holds site metadata; changes to it require restarting `npm run serve` to take effect. `public/index.html` currently has metadata (title, `og:` tags) hardcoded rather than templated from env — check both places when updating site metadata/social preview info.
