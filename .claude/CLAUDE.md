<!-- GSD:project-start source:PROJECT.md -->

## Project

**Josef's Game Dev Portfolio**

A static Vue 2 + TypeScript portfolio site showcasing Josef's shipped game projects (Drag Rush, Dispater, Floor 0, SwingSpace) for game-industry job applications. Visitors scroll a timeline of project cards, click through to media-rich overlays, and can view a resume — no code is shown anywhere on the site.

**Core Value:** The portfolio must read as aesthetically polished and professional within a 10-second scan, while still carrying a distinct sense of personality — without ever needing to show a line of code to prove the work is real.

### Constraints

- **Tech stack**: Vue 2 + TypeScript + Less, vue-cli-service build — fixed; this is a content/design polish pass, not a re-platform
- **Assets**: Screenshots/gifs/videos are already produced by the user and live in `public/img/projects/`; work here is data-file, component, and style edits — not new asset production
- **Timeline**: No firm deadline — quality prioritized over speed

<!-- GSD:project-end -->

<!-- GSD:stack-start source:codebase/STACK.md -->

## Technology Stack

## Languages

- TypeScript 3.9.3 - Application logic, routing, component definition, type safety
- Vue 2.6.11 - UI framework (single-file components with Options API)
- Less 3.12.2 - Stylesheet language, compiled to CSS
- HTML5 - Template markup within `.vue` single-file components
- CSS3 - Generated from Less files and inline in component styles

## Runtime

- Node.js - Development and build time only
- Browser - Client-side execution (ES5 transpiled target via Webpack)
- npm - Dependency management
- Lockfile: `package-lock.json` present

## Frameworks

- Vue 2.6.11 - Progressive JavaScript framework using Options API; components defined via `Vue.extend()`
- Vue Router 3.4.3 - Client-side routing with lazy-loaded views
- Vue CLI 4.5.0 - Development server (`vue-cli-service serve`) and production build (`vue-cli-service build`)
- Webpack - Module bundler (underlying build system, wrapped by Vue CLI)
- ESLint 6.7.2 - Code linting for Vue/TypeScript
- @vue/cli-plugin-typescript 4.5.0 - TypeScript support for Vue CLI
- @vue/cli-plugin-eslint 4.5.0 - ESLint integration
- @vue/cli-plugin-router 4.5.6 - Vue Router plugin for scaffolding
- TypeScript Compiler - Configured in `tsconfig.json` with strict mode enabled, ES5 target, ESNext modules

## Key Dependencies

- vue 2.6.11 - Core framework dependency
- vue-router 3.4.3 - Routing library, enables SPA navigation between `/resume`, `/game-projects`, `/other-projects`, `/contact`
- typescript 3.9.3 - Language and type system
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

- Metadata configured in `.env` file (site title, OG tags placeholders, site URLs)
- Environment variables injected at build time via Vue CLI
- Note: `.env` file contents are not read at runtime; metadata is baked into the build
- TypeScript configuration: `tsconfig.json` (strict mode, ES5 target, ESNext modules, path aliases for `@/*`)
- ESLint configuration: `.eslintrc.js` (extends Vue essentials, TypeScript recommended, parser set to `@typescript-eslint/parser`)
- Vue CLI configuration: Implicit (uses Vue CLI defaults for webpack configuration)
- `npm run serve` — Starts webpack dev server with hot module reload (requires `NODE_OPTIONS=--openssl-legacy-provider`)
- `npm run build` — Production build to `dist/` folder
- `npm run lint` — Runs ESLint on TypeScript/Vue files

## Platform Requirements

- Node.js (version not pinned in package.json, but scripts use `cross-env` wrapper for Windows compatibility)
- npm (version not specified)
- Windows PowerShell note: May require `$env:NODE_OPTIONS = '--openssl-legacy-provider'` due to OpenSSL compatibility with older Webpack/Node versions
- Static file hosting (GitHub Pages, Netlify, Vercel, or any web server capable of serving static assets)
- No server-side processing or database required
- `dist/` folder contents deployed as-is

## Asset Management

- Located in `public/` directory (referenced with root-relative paths like `/img/projects/...` and `/fonts/...`)
- Includes: PNG/GIF images, MP4 videos, TTF font files (Lekton, Russo One)
- Image preloading: `Helpers.preloadImages()` called in `App.vue` to eagerly load heavy images/GIFs before navigation
- Global styles in `App.vue` (`<style lang="less">` block) — gradient background, font setup, core layout rules
- Component-scoped styles via `<style scoped>` in most Vue components
- Shared variables in `src/css/variables.less` (color constants: `@bodyBgColor`, `@textColor`, `@accentColor`, etc.)
- Project-specific styles (for dynamic HTML content rendered in overlay dialogs) in `src/css/projects.less` (globally loaded, not scoped)

<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->

## Conventions

## Naming Patterns

- Vue components: PascalCase (e.g., `ProjectDetailsOverlay.vue`, `GameProjects.vue`)
- TypeScript data/utility files: PascalCase (e.g., `ProjectData.ts`, `GameProjectsData.ts`)
- LESS/CSS files: kebab-case (e.g., `variables.less`, `projects.less`)
- Router configuration: `index.ts`
- camelCase for all function and method names
- Example patterns from `src/helpers.ts`:
- Example from Vue components (e.g., `src/views/GameProjects.vue`):
- camelCase for all variable declarations
- Example patterns:
- PascalCase for class names
- Example: `ProjectData`, `Helpers`
- Constructor-based property initialization:
- kebab-case for all style class names
- Examples: `.project-details`, `.nav-bar`, `.hero-photo`, `.dialog-close-button`, `.project-title-link`
- BEM-inspired modifier classes: `.project-image--swing-space`, `.project-row--reverse`

## Code Style

- No Prettier configuration found; manual formatting adhered to
- 4-space indentation (observed throughout codebase)
- No semicolons required but used inconsistently in source
- Consistent spacing around operators and keywords
- Tool: ESLint with Vue plugin and TypeScript support
- Config file: `.eslintrc.js`
- Extends:
- Key rules:
- Parser: `@typescript-eslint/parser` with ecmaVersion 2020
- `strict: true` - All strict type-checking options enabled
- `target: es5` - Output ECMAScript 5
- `module: esnext` - ESNext module format
- `skipLibCheck: true` - Skip type checking for declaration files
- `sourceMap: true` - Generate source maps for debugging

## Import Organization

- `@/` resolves to `src/` directory
- Configured in `tsconfig.json` paths: `"@/*": ["src/*"]`
- Usage example from `src/views/GameProjects.vue`:
- Used for route components with webpack chunk names
- Example from `src/router/index.ts`:

## Error Handling

- Minimal explicit error handling observed
- No try-catch blocks found in sample code
- Console methods controlled by environment:
- No custom error classes or centralized error handling mechanism
- Runtime errors fall through to browser console
- No error boundaries or exception handling layers implemented
- Suitable for a portfolio/demonstration app; would need hardening for production

## Logging

- Direct use of `console.log`, `console.error`, etc.
- ESLint allows console in development (`no-console: 'off'`)
- ESLint warns about console in production builds
- No structured logging or log levels implemented

## Comments

- Inline comments for non-obvious logic or workarounds
- Example from `src/App.vue` (line 118):
- Property comments on TypeScript class fields
- Example from `src/data/ProjectData.ts`:
- Minimal usage observed
- Not required for this project
- Vue component `name` properties used for identification

## Function Design

- Typed parameters in TypeScript (with type annotations)
- Use of default parameters in constructors
- Example from `src/data/ProjectData.ts`:
- Explicitly typed in TypeScript
- Arrow functions commonly used in Vue components:

## Module Design

- Default exports for Vue components (using `Vue.extend()`)
- Default exports for data arrays/classes
- Named exports rarely used
- Example from `src/main.ts`:
- Not used; imports done directly from specific files
- Router configuration serves as main export point for routing logic

## Vue Component Structure

- Scoped styles with `<style scoped>` for component isolation
- LESS language preferred
- Media queries for responsive design (breakpoint at 620px)
- CSS variables defined in `src/css/variables.less`

<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->

## Architecture

## System Overview

```text

```

## Component Responsibilities

| Component | Responsibility | File |
|-----------|----------------|------|
| App | Root wrapper, layout structure, global styles, theme, page transitions | `src/App.vue` |
| Header | Navigation bar with router links | `src/components/Header.vue` |
| Footer | Footer content (referenced in App but no file shown) | `src/components/Footer.vue` |
| GameProjects | Timeline view of game projects with hero section | `src/views/GameProjects.vue` |
| OtherProjects | Grid layout view of other projects | `src/views/OtherProjects.vue` |
| ProjectsList | Reusable grid component for displaying projects | `src/components/ProjectsList.vue` |
| ProjectDetailsOverlay | Modal dialog for project details | `src/components/ProjectDetailsOverlay.vue` |
| Resume | Display resume as image | `src/views/Resume.vue` |
| Contact | Contact information and social links | `src/views/Contact.vue` |
| SkillRate | Skill rating component (exists but not actively used) | `src/components/SkillRate.vue` |

## Pattern Overview

- Client-side routing with Vue Router (no server-side navigation)
- Lazy-loaded page views via webpack code splitting
- Reusable presentational components (ProjectsList, ProjectDetailsOverlay)
- TypeScript for type safety across Vue components and utilities
- Responsive design with mobile-first breakpoint at 620px
- LESS preprocessing for styling with centralized color variables
- Image preloading optimization for project assets

## Layers

- Purpose: Render UI components and handle user interactions
- Location: `src/components/`, `src/views/`
- Contains: Vue single-file components (.vue files with template, script, style)
- Depends on: Data layer (via imports), Router, Helpers
- Used by: App.vue root component, directly rendered by router
- Purpose: Client-side navigation and page transitions
- Location: `src/router/index.ts`
- Contains: Route definitions, lazy-loaded page imports
- Depends on: View components
- Used by: App.vue via router-view, Header navigation
- Purpose: Store project metadata and site content
- Location: `src/data/`
- Contains: ProjectData class, project arrays (GameProjectsData, OtherProjectsData)
- Depends on: ProjectData model class
- Used by: View components (GameProjects, OtherProjects)
- Purpose: Shared helper functions
- Location: `src/helpers.ts`
- Contains: Image preloading functions
- Depends on: Browser APIs (Image constructor)
- Used by: App.vue, project views
- Purpose: Centralized theming and component styles
- Location: `src/css/` (variables.less, projects.less)
- Contains: LESS variables (colors), global styles, component scoped styles
- Depends on: None
- Used by: All components via scoped style blocks and @import

## Data Flow

### Primary Request Path: View a Game Project

### Secondary Request Path: View Other Projects Grid

- All state is local to individual components (Vue data properties)
- No global store (Vuex not used)
- Component communication via props (parent→child) and events (child→parent)
- Modal state (showPopup, popupTitle, popupColor, popupContent) managed in each view
- No server-side data fetching; all data statically imported

## Key Abstractions

- Purpose: Type-safe model for project metadata and content
- Examples: `src/data/ProjectData.ts`, instances in GameProjectsData.ts and OtherProjectsData.ts
- Pattern: Class with typed properties (id, name, htmlDescription, iconUrl, accentColor, isWide, isHigh)
- Used by: GameProjects, OtherProjects, ProjectsList to render project information
- Purpose: Provide data for views without database/API
- Examples: `src/data/GameProjectsData.ts` (array of ProjectData), `src/data/OtherProjectsData.ts`
- Pattern: Default export of array of ProjectData instances with inline HTML descriptions
- Benefit: Static data means no runtime data loading, faster initial load
- Purpose: Define application routes and lazy loading strategy
- Example: `src/router/index.ts` defines routes with component splitting
- Pattern: All routes lazy-loaded via dynamic import with webpack chunk naming
- Benefit: Initial page load only includes current route code

## Entry Points

- Location: `src/main.ts`
- Triggers: Page load - executed by index.html script tag
- Responsibilities: Create Vue instance, mount router, render App component to #app div
- `/` (root) → redirects to `/game-projects`
- `/game-projects` → GameProjects view (`src/views/GameProjects.vue`)
- `/other-projects` → OtherProjects view (`src/views/OtherProjects.vue`)
- `/resume` → Resume view (`src/views/Resume.vue`)
- `/contact` → Contact view (`src/views/Contact.vue`)
- `/*` (catch-all) → redirects to `/404` → NotFound view (`src/views/404.vue`)

## Architectural Constraints

- **Threading:** Single-threaded event loop (browser JavaScript execution model). Long operations block rendering.
- **Global state:** None (no Vuex or similar). All state is component-local.
- **Circular imports:** None detected. Imports flow from views → components → data/helpers.
- **Client-side only:** No server backend; all data and logic client-side; HTML descriptions embedded in TypeScript strings.
- **Image loading:** Synchronous - Project images loaded on demand via img tags. Preloading in App.ts only preloads specific hardcoded images.
- **Viewport breakpoint:** Fixed at 620px; layout switches from mobile (single column) to desktop (multi-column) at this threshold.

## Anti-Patterns

### Hardcoded Project Summaries

### HTML Content in TypeScript Strings

### No Separation of Game vs Other Projects Logic

## Error Handling

- 404 route catches undefined paths and redirects to NotFound page
- No error boundaries or error state management
- Image load failures silently fail (no alt text fallback text)
- Modal close via event emitter (no error state if close fails)

## Cross-Cutting Concerns

<!-- GSD:architecture-end -->

<!-- GSD:skills-start source:skills/ -->

## Project Skills

No project skills found. Add skills to any of: `.claude/skills/`, `.agents/skills/`, `.cursor/skills/`, `.github/skills/`, or `.codex/skills/` with a `SKILL.md` index file.
<!-- GSD:skills-end -->

<!-- GSD:workflow-start source:GSD defaults -->

## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:

- `/gsd-quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd-debug` for investigation and bug fixing
- `/gsd-execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->

<!-- GSD:profile-start -->

## Developer Profile

> Profile not yet configured. Run `/gsd-profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
