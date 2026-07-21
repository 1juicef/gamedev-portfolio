# Codebase Concerns

**Analysis Date:** 2026-07-21

## Security Concerns

### XSS Vulnerability via v-html

**Risk:** Potential cross-site scripting (XSS) attack vector

**Files:** `src/components/ProjectDetailsOverlay.vue` (line 10)

**Current mitigation:** None detected. The `htmlContent` prop receives raw HTML from project data and renders it unsanitized via `v-html`.

**Attack vector:** If project descriptions are ever sourced from untrusted input or user-generated content, malicious scripts could be injected and executed.

**Recommendations:** 
- Use `vue-dompurify` or implement HTML sanitization before rendering
- Or migrate to a safer templating approach (component-based instead of HTML strings)
- If HTML is trusted (only developer-controlled), document this explicitly and add a comment explaining the trust boundary

## Tech Debt

### Vue 2 End of Life

**Issue:** Vue 2.6 reached official end-of-life on September 18, 2024

**Files:** `package.json`, `src/**/*.vue`, entire codebase uses Vue 2 composition

**Impact:** 
- No security patches or bug fixes available
- Ecosystem tooling increasingly dropping Vue 2 support
- New team members expect Vue 3+
- Dependency vulnerabilities may not be addressed

**Fix approach:**
- Plan gradual migration to Vue 3 (breaking change, high effort)
- Start by upgrading Vue CLI and TypeScript to unblock other updates
- Consider using `@vitejs/plugin-vue2` as transitional step to Vite
- Alternatively, freeze codebase if maintenance mode is acceptable

### Severely Outdated Dependencies

**Issue:** Major version gaps across all development tooling

**Files:** `package.json`

**Current state:**
- TypeScript 3.9.7 → Latest 7.0 (4 major versions behind)
- ESLint 6.8.0 → Latest 10.7.0 (4 major versions behind)
- Vue CLI plugins 4.5.6 → Latest 5.0.9 (minor, but incompatible with current setup)
- Webpack 4 (via Vue CLI 4) → Webpack 5 available

**Impact:**
- No access to modern language features or type checking improvements
- Missing recent security patches
- Incompatibility with modern Node.js versions (hence `NODE_OPTIONS=--openssl-legacy-provider` workaround)
- Limits ability to add new features with modern tooling

**Fix approach:**
- Upgrade TypeScript incrementally (3.9 → 5.x → 7.x), testing after each step
- Update ESLint to ^10.0, configure new rule sets
- Update Vue CLI to 5.x or migrate to Vite (major effort)
- Remove `NODE_OPTIONS` hack once dependencies updated

### NODE_OPTIONS Legacy Provider Workaround

**Issue:** Build requires `NODE_OPTIONS=--openssl-legacy-provider` flag

**Files:** `package.json` (lines 6-7)

**Impact:** 
- Breaks on modern Node.js versions (18+) without workaround
- Indicates incompatibility with current Node ecosystem
- Workaround is temporary; OpenSSL 1.1 support will be removed

**Fix approach:**
- Update Vue CLI and dependencies to versions compatible with OpenSSL 3.0
- Once dependencies updated, NODE_OPTIONS can be removed
- Consider using `nvm` or `.nvmrc` to lock Node version if immediate upgrade not possible

## Code Quality Issues

### Unused and Commented Code

**Issue:** Dead code cluttering codebase

**Files:** 
- `src/components/ProjectsList.vue` (lines 54-56): Commented event handler and console.log
- `src/components/Header.vue` (lines 17-19): Commented out props definition

**Impact:** Creates confusion about intended functionality, increases maintenance burden

**Fix approach:** Delete all commented code; use git history if needed for reference

### CSS Architecture Issues

**Issue:** CSS loaded in template via link tag instead of proper import

**Files:** `src/App.vue` (line 4)

**Impact:** 
- Not subject to build optimization
- CSS not tree-shaken or minified by build tools
- Breaks in components if CSS is scoped
- Causes FOUC (Flash of Unstyled Content)

**Recommendation:** 
```typescript
// Instead of: <link rel="stylesheet" href="@/assets/projects/projects.css" type="text/css">
// Do this in <script>:
import '@/assets/projects/projects.css';
```

### CSS Hack Comment

**Issue:** Visual alignment hack using negative margin

**Files:** `src/App.vue` (line 118)

**Current code:**
```css
margin-left: -2px; // hack to make it "seem" more aligned with smaller text content
```

**Fix approach:** 
- Investigate root cause (likely kerning or font rendering)
- Use proper CSS alignment technique (e.g., `letter-spacing`, `transform: scaleX()`)
- Remove hack comment once proper solution found

### Duplicate CSS Rules

**Issue:** `.dialog-content` style block defined twice

**Files:** `src/components/ProjectDetailsOverlay.vue` (lines 70-77)

**Impact:** Second rule overrides first; confusing for maintainers

**Fix approach:** Merge both rules into single block

## Type Safety Issues

### Untyped Prop Definition

**Issue:** Props accept `Array` without type parameter

**Files:** `src/components/ProjectsList.vue` (line 42)

**Current code:**
```typescript
props: {
  projects: Array
}
```

**Fix approach:**
```typescript
props: {
  projects: {
    type: Array as PropType<ProjectData[]>,
    required: true
  }
}
```

## Performance Concerns

### Large Unoptimized Image Assets

**Issue:** Project screenshots are large uncompressed PNGs

**Files:** `public/img/projects/` (total ~50MB)

**Current state:**
- Individual images: 1.4MB - 2.2MB each
- No WebP/AVIF fallbacks
- No lazy loading
- No responsive sizing (same image loaded on mobile as desktop)

**Impact:**
- Slow initial page load
- High bandwidth usage
- Poor performance on slow networks
- Mobile users download unnecessarily large assets

**Improvement path:**
1. Compress all PNGs using ImageOptim or equivalent (target 30-40% reduction)
2. Convert to WebP with PNG fallback
3. Implement lazy loading (`loading="lazy"` on img tags)
4. Generate multiple image sizes for responsive loading
5. Consider using image CDN or build-time optimization tool

### Preloading Outdated Image Paths

**Issue:** App.vue preloads images that no longer exist or match old naming

**Files:** `src/App.vue` (lines 30-34)

**Current paths referenced:**
- `img/projects/project-1-icon.png`
- `img/projects/project-2-icon.png`
- `img/projects/project-3-icon.png`

**Impact:** Loads unused images, wasting bandwidth

**Fix approach:** 
- Remove preloading or update to actual image filenames used in GameProjectsData.ts
- Only preload critical images shown on initial view

### Hardcoded Image Preloading Without Error Handling

**Issue:** Image preloading in `src/helpers.ts` creates Image objects without error handling

**Files:** `src/helpers.ts` (lines 9-12)

**Impact:** Failed image loads are silently ignored; no feedback to user or developer

**Fix approach:**
```typescript
private static preloadImage = (url: string) => {
  const image = new Image();
  image.onerror = () => console.warn(`Failed to preload: ${url}`);
  image.src = url;
}
```

### Window API Direct Usage

**Issue:** Direct calls to `window.scrollTo()` in component methods

**Files:**
- `src/views/GameProjects.vue` (line 104)
- `src/components/ProjectsList.vue` (line 61)

**Impact:**
- Not testable in unit tests without mocking window
- Breaks in server-side rendering context
- Side effects mixed with business logic

**Fix approach:** Wrap window calls in methods, or use Vue lifecycle hooks more strategically

## Architectural Issues

### Webpack Chunk Name Collision

**Issue:** All route lazy-loads use identical chunk name

**Files:** `src/router/index.ts` (lines 14, 19, 24, 29, 34)

**Current code:**
```typescript
component: () => import(/* webpackChunkName: "about" */ '../views/Resume.vue')
component: () => import(/* webpackChunkName: "about" */ '../views/GameProjects.vue')
component: () => import(/* webpackChunkName: "about" */ '../views/OtherProjects.vue')
// All use "about"
```

**Impact:** Code splitting doesn't work; all routes bundled into single chunk defeating lazy-load benefits

**Fix approach:**
```typescript
component: () => import(/* webpackChunkName: "resume" */ '../views/Resume.vue')
component: () => import(/* webpackChunkName: "game-projects" */ '../views/GameProjects.vue')
component: () => import(/* webpackChunkName: "other-projects" */ '../views/OtherProjects.vue')
```

### HTML Content in TypeScript Data Files

**Issue:** Full HTML markup embedded in TypeScript/data layer

**Files:** `src/data/GameProjectsData.ts`, `src/data/OtherProjectsData.ts`

**Impact:**
- Mixing presentation and data concerns
- HTML editing requires code review/TypeScript knowledge
- Difficult to test or validate HTML independently
- Not developer-friendly for non-technical content updates

**Better approach:**
- Store HTML in separate `.html` files or Markdown
- Load via imports or use rich text editor
- Or use component-based structure instead of HTML strings

## Testing Gaps

### Zero Test Coverage

**Issue:** No test files, test frameworks, or test infrastructure configured

**Files:** No `*.test.ts`, `*.spec.ts`, no `jest.config.js`, `vitest.config.ts`, or test scripts

**Risk areas without tests:**
- `src/router/index.ts`: Navigation routing logic untested
- `src/components/ProjectDetailsOverlay.vue`: XSS-vulnerable component not tested
- `src/data/` files: Data structure consistency not verified
- `src/helpers.ts`: Preloading logic never validated

**Impact:** 
- Changes risk breaking functionality silently
- Refactoring is risky and expensive
- New features can't be validated before merge
- Technical debt compounds with each change

**Priority:** HIGH - Set up testing infrastructure and add tests for data layer and XSS-vulnerable components

**Recommended setup:**
```json
{
  "devDependencies": {
    "vitest": "^1.0",
    "vue-test-utils": "^1.3",
    "@testing-library/vue": "^5.0"
  }
}
```

## Known Issues

### Placeholder Content in About Page

**Issue:** About page contains placeholder "John Matrix" content, not actual user info

**Files:** `src/views/About.vue` (line 7)

**Current state:** Generic template content remains in production

**Fix approach:** Replace with actual bio before launch

## Scalability Concerns

### Hardcoded Project Data

**Issue:** Projects stored in TypeScript arrays with embedded HTML

**Files:** `src/data/GameProjectsData.ts`, `src/data/OtherProjectsData.ts`

**Current capacity:** 4 game projects hardcoded

**Scalability limit:** Adding new projects requires code changes and rebuild

**Future-proofing approach:**
- Move data to JSON files or API
- Use CMS or static site generator
- If staying in codebase, use data files instead of TS classes

## Dependencies at Risk

### Missing DOMPurify

**Risk:** XSS vulnerability in ProjectDetailsOverlay not addressed

**Current status:** `package.json` has no HTML sanitization dependency

**Resolution:**
```bash
npm install vue-dompurify
# or
npm install dompurify
```

Then use in template:
```vue
<div v-dompurify="htmlContent"></div>
```

---

*Concerns audit: 2026-07-21*
