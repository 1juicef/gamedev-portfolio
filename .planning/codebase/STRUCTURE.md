# Codebase Structure

**Analysis Date:** 2026-07-21

## Directory Layout

```
gamedev-portfolio/
├── .claude/                    # Claude Code configuration
├── .planning/                  # Generated planning documents
│   └── codebase/               # Codebase analysis docs (this directory)
├── .vscode/                    # VSCode settings
├── dist/                       # Build output (generated, not committed)
├── node_modules/               # Dependencies (generated, not committed)
├── public/                     # Static assets served directly
│   ├── d/                      # Documents directory (e.g., PDFs)
│   │   └── some-file.pdf
│   ├── fonts/                  # Custom web fonts
│   │   └── Lekton,Russo_One/   # Font family directory
│   ├── img/                    # Images and media
│   │   ├── avatar.png          # Profile image
│   │   ├── actualResume.png    # Resume image
│   │   └── projects/           # Project screenshots and videos
│   ├── favicon.ico
│   └── index.html              # HTML entry point
├── src/                        # Source code (TypeScript + Vue)
│   ├── main.ts                 # Application entry point
│   ├── App.vue                 # Root component (layout wrapper)
│   ├── helpers.ts              # Utility functions
│   ├── shims-vue.d.ts          # Vue type declarations
│   ├── shims-tsx.d.ts          # TSX type declarations
│   ├── components/             # Reusable components
│   │   ├── Header.vue          # Navigation header
│   │   ├── Footer.vue          # Footer component
│   │   ├── ProjectDetailsOverlay.vue  # Modal for project details
│   │   ├── ProjectsList.vue    # Grid component for projects
│   │   └── SkillRate.vue       # Skill rating component
│   ├── views/                  # Page-level components
│   │   ├── GameProjects.vue    # Main game projects page (timeline)
│   │   ├── OtherProjects.vue   # Other projects grid page
│   │   ├── Resume.vue          # Resume image display page
│   │   ├── Contact.vue         # Contact information page
│   │   ├── About.vue           # About page (template only)
│   │   └── 404.vue             # Not found page
│   ├── router/                 # Vue Router configuration
│   │   └── index.ts            # Route definitions, lazy loading
│   ├── data/                   # Data models and datasets
│   │   ├── ProjectData.ts      # ProjectData class definition
│   │   ├── GameProjectsData.ts # Array of game projects
│   │   └── OtherProjectsData.ts# Array of other projects
│   └── css/                    # Global styles
│       ├── variables.less      # Color and theme variables
│       └── projects.less       # Modal and project styling
├── package.json                # Project dependencies and scripts
├── package-lock.json           # Locked dependency versions
├── tsconfig.json               # TypeScript configuration
├── .eslintrc.js                # ESLint rules
└── .env                        # Environment variables (git-ignored)
```

## Directory Purposes

**`.claude/`:**
- Purpose: Claude Code configuration and tools
- Contains: Extension settings, launch configuration
- Key files: `launch.json`, `settings.local.json`

**`.planning/codebase/`:**
- Purpose: Generated codebase analysis documents
- Contains: Architecture, structure, conventions analysis
- Key files: ARCHITECTURE.md, STRUCTURE.md, CONVENTIONS.md (when generated)
- Generated: Yes, by `/gsd-map-codebase` command
- Committed: Yes, to track codebase evolution

**`public/`:**
- Purpose: Static assets served directly by web server
- Contains: HTML entry point, images, fonts, documents
- Served as-is to client browser
- Not processed by build pipeline

**`public/fonts/`:**
- Purpose: Custom web fonts
- Contains: Lekton and Russo One font families in TTF format
- Loaded in App.vue via @font-face rules

**`public/img/`:**
- Purpose: All images and media used in portfolio
- Contains: avatar.png (profile), project screenshots (.png), GIFs, videos (.mp4)
- Subdirectory `projects/` contains project-specific media

**`src/`:**
- Purpose: Application source code (development code)
- Contains: Vue components, TypeScript, styling, routing, data
- All files are compiled and bundled by Vue CLI build process

**`src/components/`:**
- Purpose: Reusable UI components used across multiple views
- Contains: Header, Footer, ProjectDetailsOverlay, ProjectsList, SkillRate
- Pattern: Single-file components (.vue) with scoped styles
- Note: Components are imported and used by views or App.vue

**`src/views/`:**
- Purpose: Page-level components corresponding to routes
- Contains: GameProjects, OtherProjects, Resume, Contact, About, 404
- Pattern: Each view is lazy-loaded by router and fills router-view outlet
- Note: Views may use components from `src/components/`

**`src/router/`:**
- Purpose: Vue Router configuration and route definitions
- Contains: Route array with component imports, router instance creation
- Key file: `index.ts` - defines all application routes

**`src/data/`:**
- Purpose: Data models and static datasets
- Contains: ProjectData class, arrays of project objects
- Pattern: Classes for type safety, arrays as default exports
- Usage: Imported by views and filled into component data

**`src/css/`:**
- Purpose: Global and shared styling
- Contains: LESS variables (colors), project/modal styles
- Pattern: Variables imported via @import in component styles
- Breakpoints: 620px mobile/desktop breakpoint

**`dist/`:**
- Purpose: Build output directory (generated)
- Contains: Compiled HTML, CSS, JavaScript bundles
- Generated: Yes, by `npm run build`
- Committed: No (git-ignored)

**`node_modules/`:**
- Purpose: Installed npm dependencies
- Generated: Yes, by `npm install`
- Committed: No (git-ignored)

## Key File Locations

**Entry Points:**
- `public/index.html`: HTML entry point that loads the app
- `src/main.ts`: TypeScript entry point that creates Vue instance
- `src/App.vue`: Root Vue component

**Configuration:**
- `package.json`: Dependencies, npm scripts (serve, build, lint)
- `tsconfig.json`: TypeScript compiler options (strict mode, baseUrl, path aliases)
- `.eslintrc.js`: ESLint linting rules
- `src/router/index.ts`: Vue Router configuration with all routes

**Core Logic:**
- `src/views/GameProjects.vue`: Main portfolio page (game projects timeline)
- `src/views/OtherProjects.vue`: Secondary portfolio section
- `src/components/ProjectDetailsOverlay.vue`: Modal popup for project details
- `src/data/GameProjectsData.ts`: Project dataset (103 lines)
- `src/data/ProjectData.ts`: Data model/class

**Styling:**
- `src/css/variables.less`: LESS variables (colors: @textColor, @bodyBgColor, @accentColor)
- `src/css/projects.less`: Shared project and modal styles
- `src/App.vue`: Global styles (fonts, layout, transitions)

**Testing:**
- No test files detected in codebase

## Naming Conventions

**Files:**
- Components: `PascalCase.vue` (e.g., `Header.vue`, `ProjectsList.vue`)
- Views: `PascalCase.vue` (e.g., `GameProjects.vue`, `Resume.vue`)
- Data files: `camelCase.ts` (e.g., `projectData.ts`) or `PascalCase.ts` (e.g., `GameProjectsData.ts`)
- Styles: `camelCase.less` (e.g., `variables.less`, `projects.less`)
- Utilities: `camelCase.ts` (e.g., `helpers.ts`)
- Routes: kebab-case in URL (e.g., `/game-projects`), PascalCase for component names

**Directories:**
- Feature/layer directories: lowercase plural (components, views, router, data, css)
- No nested feature directories (flat structure for small app)

**Functions:**
- Methods: camelCase (e.g., `showDetails()`, `preloadImages()`)
- Vue methods: camelCase (e.g., `showDetails()`)
- Static helpers: camelCase (e.g., `preloadImage()`)

**Variables:**
- Component data properties: camelCase (e.g., `showPopup`, `popupTitle`, `projects`)
- Props: camelCase (e.g., `visible`, `htmlContent`, `projects`)
- Emitted events: kebab-case (e.g., `@close` instead of `@onClose`)

**Types/Classes:**
- TypeScript classes: PascalCase (e.g., `ProjectData`)
- Interfaces: PascalCase with `I` prefix or no prefix (only ProjectData class observed, no interfaces)

## Where to Add New Code

**New Feature (e.g., new portfolio section):**
- Primary code: Create new view in `src/views/NewFeature.vue`
- Register route: Add entry to routes array in `src/router/index.ts`
- Data: Create new data file in `src/data/NewFeatureData.ts` if needed
- Components: Extract reusable parts to `src/components/` if needed
- Tests: Create test files alongside components (pattern not yet established)

**New Component (reusable across views):**
- Implementation: `src/components/ComponentName.vue`
- Follow existing pattern: template → script lang="ts" → scoped styles
- Use TypeScript for component class
- Define props for data input, emit events for parent communication
- Import color variables via `@import '@/css/variables.less'` in styles

**New Utility Function:**
- Shared helpers: `src/helpers.ts` (currently contains image preloading)
- If file grows, split into `src/utils/` directory with one file per concern
- Export as static methods or named functions
- Use TypeScript types

**New Page/View:**
- File: `src/views/PageName.vue` (PascalCase matching route name)
- Structure: Import data, components, define component with data() method
- Route: Add to routes array in `src/router/index.ts` with lazy import
- Data file: Create `src/data/PageNameData.ts` if needed

**New Styles:**
- Component styles: Scoped style block in .vue files
- Shared styles: Add to `src/css/projects.less` or create new .less file
- Variables: Add to `src/css/variables.less` if reusable across components

**Static Assets:**
- Images: Place in `public/img/` subdirectory (e.g., `public/img/projects/`)
- Fonts: Place in `public/fonts/` and register via @font-face in App.vue
- Documents: Place in `public/d/`
- Reference paths in components as `/img/...` or `img/...` (relative to public/)

## Special Directories

**`public/`:**
- Purpose: Static files served without processing
- Generated: No
- Committed: Yes
- Note: All files are copied to build output root during build

**`dist/`:**
- Purpose: Build output (compiled and bundled code)
- Generated: Yes, by `npm run build`
- Committed: No (git-ignored)
- Clean with: `rm -rf dist`

**`node_modules/`:**
- Purpose: Installed npm packages
- Generated: Yes, by `npm install`
- Committed: No (git-ignored)
- Recreate with: `npm install`

**`.planning/codebase/`:**
- Purpose: Generated analysis documents
- Generated: Yes, by `/gsd-map-codebase` command
- Committed: Yes, to track architectural decisions and patterns
- Contains: ARCHITECTURE.md, STRUCTURE.md, CONVENTIONS.md, etc.

---

*Structure analysis: 2026-07-21*
