# Coding Conventions

**Analysis Date:** 2026-07-21

## Naming Patterns

**Files:**
- Vue components: PascalCase (e.g., `ProjectDetailsOverlay.vue`, `GameProjects.vue`)
- TypeScript data/utility files: PascalCase (e.g., `ProjectData.ts`, `GameProjectsData.ts`)
- LESS/CSS files: kebab-case (e.g., `variables.less`, `projects.less`)
- Router configuration: `index.ts`

**Functions:**
- camelCase for all function and method names
- Example patterns from `src/helpers.ts`:
  ```typescript
  static preloadImages = (urls: string[]) => { ... }
  private static preloadImage = (url: string) => { ... }
  ```
- Example from Vue components (e.g., `src/views/GameProjects.vue`):
  ```typescript
  showDetails: function (item: ProjectData) { ... }
  ```

**Variables:**
- camelCase for all variable declarations
- Example patterns:
  ```typescript
  projects: gameProjectsData
  projectRows: { "drag-rush": "normal", ... }
  popupTitle: ""
  htmlContent: ""
  ```

**Classes:**
- PascalCase for class names
- Example: `ProjectData`, `Helpers`
- Constructor-based property initialization:
  ```typescript
  export default class ProjectData {
    id: string;
    name: string;
    constructor(id: string, name: string, ...) {
      this.id = id;
      this.name = name;
      ...
    }
  }
  ```

**CSS/LESS Classes:**
- kebab-case for all style class names
- Examples: `.project-details`, `.nav-bar`, `.hero-photo`, `.dialog-close-button`, `.project-title-link`
- BEM-inspired modifier classes: `.project-image--swing-space`, `.project-row--reverse`

## Code Style

**Formatting:**
- No Prettier configuration found; manual formatting adhered to
- 4-space indentation (observed throughout codebase)
- No semicolons required but used inconsistently in source
- Consistent spacing around operators and keywords

**Linting:**
- Tool: ESLint with Vue plugin and TypeScript support
- Config file: `.eslintrc.js`
- Extends:
  - `plugin:vue/essential` - Vue best practices
  - `eslint:recommended` - Base ESLint rules
  - `@vue/typescript/recommended` - TypeScript-specific rules
- Key rules:
  - `no-console`: warn in production, off in development
  - `no-debugger`: warn in production, off in development
- Parser: `@typescript-eslint/parser` with ecmaVersion 2020

**TypeScript Configuration:**
- `strict: true` - All strict type-checking options enabled
- `target: es5` - Output ECMAScript 5
- `module: esnext` - ESNext module format
- `skipLibCheck: true` - Skip type checking for declaration files
- `sourceMap: true` - Generate source maps for debugging

## Import Organization

**Order:**
1. Framework imports (Vue, Vue Router)
2. Component imports (local .vue files)
3. Data/utility imports (TypeScript files)

**Path Aliases:**
- `@/` resolves to `src/` directory
- Configured in `tsconfig.json` paths: `"@/*": ["src/*"]`
- Usage example from `src/views/GameProjects.vue`:
  ```typescript
  import ProjectDetailsOverlay from "@/components/ProjectDetailsOverlay.vue";
  import gameProjectsData from "@/data/GameProjectsData.ts";
  import ProjectData from "@/data/ProjectData.ts";
  ```

**Lazy Loading:**
- Used for route components with webpack chunk names
- Example from `src/router/index.ts`:
  ```typescript
  component: () => import(/* webpackChunkName: "about" */ '../views/Resume.vue')
  ```

## Error Handling

**Current Approach:**
- Minimal explicit error handling observed
- No try-catch blocks found in sample code
- Console methods controlled by environment:
  - Development: `console.*` methods allowed
  - Production: `console.log` warns, `debugger` warns
- No custom error classes or centralized error handling mechanism

**When Errors Occur:**
- Runtime errors fall through to browser console
- No error boundaries or exception handling layers implemented
- Suitable for a portfolio/demonstration app; would need hardening for production

## Logging

**Framework:** Browser console (no dedicated logging library)

**Patterns:**
- Direct use of `console.log`, `console.error`, etc.
- ESLint allows console in development (`no-console: 'off'`)
- ESLint warns about console in production builds
- No structured logging or log levels implemented

## Comments

**When to Comment:**
- Inline comments for non-obvious logic or workarounds
- Example from `src/App.vue` (line 118):
  ```css
  margin-left: -2px; // hack to make it "seem" more aligned with smaller text content
  ```
- Property comments on TypeScript class fields
- Example from `src/data/ProjectData.ts`:
  ```typescript
  htmlDescription: string;
  iconUrl: string; // used as thumnail
  isWide: boolean; // thumbnail will take 2 cols in the grid view
  ```

**JSDoc/TSDoc:**
- Minimal usage observed
- Not required for this project
- Vue component `name` properties used for identification

## Function Design

**Size:** No strict limits observed; functions kept reasonably small (10-30 lines typical)

**Parameters:**
- Typed parameters in TypeScript (with type annotations)
- Use of default parameters in constructors
- Example from `src/data/ProjectData.ts`:
  ```typescript
  constructor(id: string, name: string, iconUrl: string, html: string, 
              accentColor = "#000000", isHigh = false, isWide = false)
  ```

**Return Values:**
- Explicitly typed in TypeScript
- Arrow functions commonly used in Vue components:
  ```typescript
  showDetails: function (item: ProjectData) { ... }
  ```

## Module Design

**Exports:**
- Default exports for Vue components (using `Vue.extend()`)
- Default exports for data arrays/classes
- Named exports rarely used
- Example from `src/main.ts`:
  ```typescript
  import router from './router'
  ```

**Barrel Files:**
- Not used; imports done directly from specific files
- Router configuration serves as main export point for routing logic

## Vue Component Structure

**Pattern:** Vue 2 with Options API and TypeScript

**Typical Structure:**
```typescript
export default Vue.extend({
  name: "ComponentName",
  components: { ChildComponent },
  props: { visible: Boolean, color: String },
  data: function() {
    return { /* reactive data */ }
  },
  methods: { /* component methods */ }
})
```

**Styling:**
- Scoped styles with `<style scoped>` for component isolation
- LESS language preferred
- Media queries for responsive design (breakpoint at 620px)
- CSS variables defined in `src/css/variables.less`

---

*Convention analysis: 2026-07-21*
