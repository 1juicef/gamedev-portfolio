# Testing Patterns

**Analysis Date:** 2026-07-21

## Test Framework

**Runner:** Not configured
- No Jest, Vitest, or other test runner detected
- No test configuration files present
- No testing dependencies in `package.json`

**Assertion Library:** Not configured
- No testing libraries detected

**Run Commands:** Not available
- No test scripts in `package.json`
- Testing infrastructure is not yet implemented

## Test File Organization

**Location:** Not established
- No `tests/` or `__tests__/` directories found
- No `.test.ts`, `.spec.ts`, or `.test.vue` files in codebase
- Current structure does not accommodate tests

**Naming Convention:** Not defined
- Recommend: `[ComponentName].test.ts` or `[ComponentName].spec.ts` co-located with source

**Directory Structure:** Recommended for future implementation
```
src/
├── components/
│   ├── Header.vue
│   ├── Header.test.ts          # or Header.spec.ts
│   └── ...
├── views/
│   ├── GameProjects.vue
│   ├── GameProjects.test.ts    # or GameProjects.spec.ts
│   └── ...
└── ...
```

## Test Structure

**Suite Organization:** No examples available in codebase

**Recommended Pattern for Vue components:**
```typescript
describe('GameProjects.vue', () => {
  let wrapper;
  
  beforeEach(() => {
    // Setup test component
  });
  
  afterEach(() => {
    // Cleanup
  });
  
  describe('showDetails', () => {
    it('should update popup state', () => {
      // Test implementation
    });
  });
});
```

**Patterns to establish:**
- Use `describe()` blocks to group related tests
- Use `beforeEach()` for component setup/mounting
- Use `afterEach()` for cleanup
- Follow AAA pattern: Arrange, Act, Assert

## Mocking

**Framework:** Not configured
- No mocking library in place (would recommend `jest.mock()` or `vitest` built-in)

**Patterns to establish:**
- Mock Vue Router for navigation-related components
- Mock child components in unit tests to isolate component behavior
- Mock data classes when testing Vue components (inject test data)

**What to Mock:**
- Router links and navigation (`router-link`)
- Child components in isolation tests
- API calls (none currently, but recommended for future)
- External dependencies

**What NOT to Mock:**
- Component props and events (test integration)
- CSS/styling behavior (CSS testing tools instead)
- Core TypeScript utility classes unless testing in isolation

## Fixtures and Factories

**Test Data:** No fixtures established

**Recommended Pattern:**
```typescript
// fixtures/projectData.ts
export const mockProjectData = () => ({
  id: 'test-project',
  name: 'Test Project',
  iconUrl: 'test.png',
  htmlDescription: '<div>Test</div>',
  accentColor: '#000000',
  isWide: false,
  isHigh: false
});
```

**Location:** Recommend `tests/fixtures/` or `src/__fixtures__/` for test data factories

## Coverage

**Requirements:** None enforced
- No coverage thresholds defined
- No coverage reports generated

**Recommended Setup:**
- Target: 80% statement coverage for critical paths
- Configure with Jest/Vitest: `--coverage` flag
- Generate coverage reports before merging

**View Coverage:** To be implemented
- Once testing framework is added: `npm run test:coverage`

## Test Types

**Unit Tests:** Not currently implemented

**Recommended Approach:**
- Test individual utility functions (e.g., `Helpers.preloadImages`)
- Test Vue component methods in isolation
- Test TypeScript class constructors and property initialization
- Example utility to test: `src/helpers.ts`
  ```typescript
  describe('Helpers', () => {
    describe('preloadImages', () => {
      it('should preload each image in array', () => {
        // Test that Image constructor called for each URL
      });
    });
  });
  ```

**Integration Tests:** Not currently implemented

**Recommended Approach:**
- Test Vue components with router and data integration
- Test component state changes from user interactions
- Test component prop passing and event emissions
- Example to test: `src/views/GameProjects.vue`
  ```typescript
  describe('GameProjects.vue', () => {
    it('should display project details overlay on click', () => {
      // Mount component, click project, verify overlay visible
    });
  });
  ```

**E2E Tests:** Not configured
- Not needed for current portfolio site
- Could add with Cypress/Playwright if needed for future features

## Critical Testable Areas

**High Priority (if adding tests):**

1. **Route Handling** (`src/router/index.ts`):
   - Verify all routes are properly configured
   - Test redirect logic (`/` redirects to `/game-projects`)
   - Test 404 catch-all route

2. **ProjectData Class** (`src/data/ProjectData.ts`):
   - Constructor properly assigns all properties
   - Default parameter values work correctly

3. **Helpers Utility** (`src/helpers.ts`):
   - `preloadImages()` creates Image objects
   - `preloadImage()` sets correct src attribute

4. **GameProjects Component** (`src/views/GameProjects.vue`):
   - Renders project list from data
   - `showDetails()` method updates popup state
   - Popup displays correct content based on clicked project

5. **ProjectDetailsOverlay Component** (`src/components/ProjectDetailsOverlay.vue`):
   - Displays when `visible` prop is true
   - Emits 'close' event on close button click
   - Renders dynamic content with `v-html`

## No Test Infrastructure Found

**Current State:**
- This codebase has no testing infrastructure set up
- No test runner, assertion library, or test files
- All code is untested

**Recommendation for Next Phase:**
- Add Jest or Vitest as dev dependency
- Create `jest.config.js` or `vitest.config.ts`
- Establish test directory structure
- Start with unit tests for utility functions
- Progress to component integration tests
- Target: 80%+ coverage for critical paths

**Setup Steps (when ready):**
1. Install testing framework: `npm install --save-dev vitest @vitest/ui`
2. Add Vue test utils: `npm install --save-dev @vue/test-utils`
3. Create `vitest.config.ts` configuration
4. Add `test` script to `package.json`
5. Create first test file following patterns above

---

*Testing analysis: 2026-07-21*
