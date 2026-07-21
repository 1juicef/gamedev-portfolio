# Technology Stack

**Analysis Date:** 2026-07-21

## Languages

**Primary:**
- TypeScript 3.9.3 - Application logic, routing, component definition, type safety
- Vue 2.6.11 - UI framework (single-file components with Options API)
- Less 3.12.2 - Stylesheet language, compiled to CSS

**Secondary:**
- HTML5 - Template markup within `.vue` single-file components
- CSS3 - Generated from Less files and inline in component styles

## Runtime

**Environment:**
- Node.js - Development and build time only
- Browser - Client-side execution (ES5 transpiled target via Webpack)

**Package Manager:**
- npm - Dependency management
- Lockfile: `package-lock.json` present

## Frameworks

**Core:**
- Vue 2.6.11 - Progressive JavaScript framework using Options API; components defined via `Vue.extend()`
- Vue Router 3.4.3 - Client-side routing with lazy-loaded views

**Build/Dev:**
- Vue CLI 4.5.0 - Development server (`vue-cli-service serve`) and production build (`vue-cli-service build`)
- Webpack - Module bundler (underlying build system, wrapped by Vue CLI)
- ESLint 6.7.2 - Code linting for Vue/TypeScript
- @vue/cli-plugin-typescript 4.5.0 - TypeScript support for Vue CLI
- @vue/cli-plugin-eslint 4.5.0 - ESLint integration
- @vue/cli-plugin-router 4.5.6 - Vue Router plugin for scaffolding

**Type Checking:**
- TypeScript Compiler - Configured in `tsconfig.json` with strict mode enabled, ES5 target, ESNext modules

## Key Dependencies

**Critical:**
- vue 2.6.11 - Core framework dependency
- vue-router 3.4.3 - Routing library, enables SPA navigation between `/resume`, `/game-projects`, `/other-projects`, `/contact`
- typescript 3.9.3 - Language and type system

**Tooling:**
- vue-template-compiler 2.6.11 - Compiles `.vue` single-file component templates
- less 3.12.2 - Preprocesses LESS stylesheets to CSS
- less-loader 7.0.1 - Webpack loader for `.less` files
- eslint 6.7.2 - JavaScript/TypeScript linter
- @typescript-eslint/parser 2.33.0 - TypeScript parser for ESLint
- @typescript-eslint/eslint-plugin 2.33.0 - ESLint rules for TypeScript
- @vue/eslint-config-typescript 5.0.2 - Vue + TypeScript ESLint configuration
- eslint-plugin-vue 6.2.2 - ESLint rules for Vue SFCs
- cross-env 7.0.3 - Cross-platform environment variable setting (used to set `NODE_OPTIONS=--openssl-legacy-provider` for Node/OpenSSL compatibility)

## Configuration

**Environment:**
- Metadata configured in `.env` file (site title, OG tags placeholders, site URLs)
- Environment variables injected at build time via Vue CLI
- Note: `.env` file contents are not read at runtime; metadata is baked into the build

**Build:**
- TypeScript configuration: `tsconfig.json` (strict mode, ES5 target, ESNext modules, path aliases for `@/*`)
- ESLint configuration: `.eslintrc.js` (extends Vue essentials, TypeScript recommended, parser set to `@typescript-eslint/parser`)
- Vue CLI configuration: Implicit (uses Vue CLI defaults for webpack configuration)

**Development:**
- `npm run serve` — Starts webpack dev server with hot module reload (requires `NODE_OPTIONS=--openssl-legacy-provider`)
- `npm run build` — Production build to `dist/` folder
- `npm run lint` — Runs ESLint on TypeScript/Vue files

## Platform Requirements

**Development:**
- Node.js (version not pinned in package.json, but scripts use `cross-env` wrapper for Windows compatibility)
- npm (version not specified)
- Windows PowerShell note: May require `$env:NODE_OPTIONS = '--openssl-legacy-provider'` due to OpenSSL compatibility with older Webpack/Node versions

**Production:**
- Static file hosting (GitHub Pages, Netlify, Vercel, or any web server capable of serving static assets)
- No server-side processing or database required
- `dist/` folder contents deployed as-is

## Asset Management

**Static Assets:**
- Located in `public/` directory (referenced with root-relative paths like `/img/projects/...` and `/fonts/...`)
- Includes: PNG/GIF images, MP4 videos, TTF font files (Lekton, Russo One)
- Image preloading: `Helpers.preloadImages()` called in `App.vue` to eagerly load heavy images/GIFs before navigation

**Styling Strategy:**
- Global styles in `App.vue` (`<style lang="less">` block) — gradient background, font setup, core layout rules
- Component-scoped styles via `<style scoped>` in most Vue components
- Shared variables in `src/css/variables.less` (color constants: `@bodyBgColor`, `@textColor`, `@accentColor`, etc.)
- Project-specific styles (for dynamic HTML content rendered in overlay dialogs) in `src/css/projects.less` (globally loaded, not scoped)

---

*Stack analysis: 2026-07-21*
