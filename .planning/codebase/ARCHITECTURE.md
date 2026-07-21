<!-- refreshed: 2026-07-21 -->
# Architecture

**Analysis Date:** 2026-07-21

## System Overview

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                         Vue Router (SPA Navigation)                          │
│                    Routes: /game-projects, /other-projects,                  │
│                         /resume, /contact, /404                              │
└────────────────────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                            App.vue (Root)                                    │
│                `src/App.vue` - Layout wrapper with transitions              │
│                         Header | Router-view | Footer                        │
└────────────────────────────────────────────────────────────────────────────┘
         │
    ┌────┼────────────────────┐
    │    │                    │
    ▼    ▼                    ▼
┌──────┐ ┌────────────────┐ ┌──────────┐
│Header│ │  Page Views    │ │  Footer  │
│      │ │  `src/views/`  │ │          │
└──────┘ │                │ └──────────┘
         │ • GameProjects │
         │ • OtherProjects│
         │ • Resume       │
         │ • Contact      │
         │ • 404          │
         └────────────────┘
              │
              ├─ ProjectDetailsOverlay (modal)
              ├─ ProjectsList (grid)
              └─ Data imports
                 `src/data/`
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

**Overall:** Single Page Application with Component-Based Architecture

**Key Characteristics:**
- Client-side routing with Vue Router (no server-side navigation)
- Lazy-loaded page views via webpack code splitting
- Reusable presentational components (ProjectsList, ProjectDetailsOverlay)
- TypeScript for type safety across Vue components and utilities
- Responsive design with mobile-first breakpoint at 620px
- LESS preprocessing for styling with centralized color variables
- Image preloading optimization for project assets

## Layers

**Presentation Layer:**
- Purpose: Render UI components and handle user interactions
- Location: `src/components/`, `src/views/`
- Contains: Vue single-file components (.vue files with template, script, style)
- Depends on: Data layer (via imports), Router, Helpers
- Used by: App.vue root component, directly rendered by router

**Routing Layer:**
- Purpose: Client-side navigation and page transitions
- Location: `src/router/index.ts`
- Contains: Route definitions, lazy-loaded page imports
- Depends on: View components
- Used by: App.vue via router-view, Header navigation

**Data Layer:**
- Purpose: Store project metadata and site content
- Location: `src/data/`
- Contains: ProjectData class, project arrays (GameProjectsData, OtherProjectsData)
- Depends on: ProjectData model class
- Used by: View components (GameProjects, OtherProjects)

**Utilities Layer:**
- Purpose: Shared helper functions
- Location: `src/helpers.ts`
- Contains: Image preloading functions
- Depends on: Browser APIs (Image constructor)
- Used by: App.vue, project views

**Styling Layer:**
- Purpose: Centralized theming and component styles
- Location: `src/css/` (variables.less, projects.less)
- Contains: LESS variables (colors), global styles, component scoped styles
- Depends on: None
- Used by: All components via scoped style blocks and @import

## Data Flow

### Primary Request Path: View a Game Project

1. User clicks on GameProjects nav link → Router.push('/game-projects') (`src/router/index.ts:18`)
2. Router lazy-loads GameProjects view component (`src/views/GameProjects.vue`)
3. GameProjects component mounts with data from gameProjectsData import (`src/views/GameProjects.vue:69`)
4. GameProjects renders timeline with project rows, each showing:
   - Project image/video (from project.iconUrl)
   - Project title (from project.name)
   - Summary text (hardcoded in component data, not from ProjectData)
5. User clicks project title or image → showDetails() method executes (`src/views/GameProjects.vue:99`)
6. showDetails() sets popup state:
   - popupTitle ← project.name
   - popupColor ← project.accentColor
   - popupContent ← project.htmlDescription
   - showPopup ← true
7. ProjectDetailsOverlay component becomes visible with modal backdrop
8. User clicks close → showPopup ← false → overlay unmounts

### Secondary Request Path: View Other Projects Grid

1. User navigates to /other-projects
2. Router loads OtherProjects view component (`src/views/OtherProjects.vue:14`)
3. OtherProjects imports otherProjectsData and passes via props to ProjectsList (`src/views/OtherProjects.vue:24`)
4. ProjectsList renders grid of project items with:
   - Background image (project.iconUrl)
   - Title bar with accent color (project.accentColor)
   - Project name (project.name)
5. User clicks any item → ProjectsList.showDetails() executes
6. ProjectsList emits 'close' event to parent when overlay close button clicked
7. Data flow matches GameProjects path from step 5 onwards

**State Management:**
- All state is local to individual components (Vue data properties)
- No global store (Vuex not used)
- Component communication via props (parent→child) and events (child→parent)
- Modal state (showPopup, popupTitle, popupColor, popupContent) managed in each view
- No server-side data fetching; all data statically imported

## Key Abstractions

**ProjectData:**
- Purpose: Type-safe model for project metadata and content
- Examples: `src/data/ProjectData.ts`, instances in GameProjectsData.ts and OtherProjectsData.ts
- Pattern: Class with typed properties (id, name, htmlDescription, iconUrl, accentColor, isWide, isHigh)
- Used by: GameProjects, OtherProjects, ProjectsList to render project information

**Project Arrays:**
- Purpose: Provide data for views without database/API
- Examples: `src/data/GameProjectsData.ts` (array of ProjectData), `src/data/OtherProjectsData.ts`
- Pattern: Default export of array of ProjectData instances with inline HTML descriptions
- Benefit: Static data means no runtime data loading, faster initial load

**Router Config:**
- Purpose: Define application routes and lazy loading strategy
- Example: `src/router/index.ts` defines routes with component splitting
- Pattern: All routes lazy-loaded via dynamic import with webpack chunk naming
- Benefit: Initial page load only includes current route code

## Entry Points

**Application Entry:**
- Location: `src/main.ts`
- Triggers: Page load - executed by index.html script tag
- Responsibilities: Create Vue instance, mount router, render App component to #app div

**Route Entry Points (lazy-loaded):**
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

**What happens:** GameProjects view maintains a separate `summaries` object with text that duplicates project information (`src/views/GameProjects.vue:90-95`)

**Why it's wrong:** Summary text and ProjectData are in two places. If a project name changes, summary must be updated separately, creating sync errors and maintenance burden.

**Do this instead:** Add a `summary` property to ProjectData class (`src/data/ProjectData.ts`), initialize it in constructor, and access via `project.summary` in GameProjects template.

### HTML Content in TypeScript Strings

**What happens:** Project detailed descriptions are embedded as HTML strings in ProjectData constructor calls (`src/data/GameProjectsData.ts` - multiple instances with template literals containing HTML)

**Why it's wrong:** HTML is not syntax-highlighted, hard to edit, breaks linting rules, and mixes presentation (HTML) with data (TypeScript). Changes to HTML structure require code review.

**Do this instead:** Move HTML descriptions to separate `.html` files in `src/data/descriptions/` and import them, or create a component for each project details view rather than inline HTML strings.

### No Separation of Game vs Other Projects Logic

**What happens:** GameProjects and OtherProjects views implement similar project display logic (popup on click, modal overlay) but separately, with different template structures (timeline vs grid)

**Why it's wrong:** Duplicated event handling, popup state management, and modal rendering logic. Changes to modal behavior must be made in multiple places.

**Do this instead:** Extract shared modal/popup logic into a composable or mixin (e.g., `src/composables/useProjectDetails.ts` or `src/mixins/ProjectDetailsMixin.ts`). Create a single container component `ProjectsView.vue` that accepts layout type and projects array as props.

## Error Handling

**Strategy:** Minimal error handling. No try-catch blocks observed in code.

**Patterns:**
- 404 route catches undefined paths and redirects to NotFound page
- No error boundaries or error state management
- Image load failures silently fail (no alt text fallback text)
- Modal close via event emitter (no error state if close fails)

## Cross-Cutting Concerns

**Logging:** None observed. No console.log() or logging library present.

**Validation:** None observed. Component props have TypeScript types but no runtime prop validation.

**Authentication:** None - portfolio site is public, no auth needed.

**Navigation:** Handled via Vue Router; transitions controlled by fade animation in App.vue

---

*Architecture analysis: 2026-07-21*
