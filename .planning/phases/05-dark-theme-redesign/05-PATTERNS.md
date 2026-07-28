# Phase 5: Dark Theme Redesign - Pattern Map

**Mapped:** 2026-07-23
**Files analyzed:** 4
**Analogs found:** 4 / 4 (all self-referential — this phase formalizes literals already in the target files themselves; `variables.less` is the pattern to extend, not a separate analog)

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|--------------------|------|-----------|-----------------|---------------|
| `src/css/variables.less` | config (style tokens) | transform (literal → named var) | itself (existing token list) | exact |
| `src/App.vue` (`<style lang="less">` block) | component (global style) | transform (literal → var reference) | itself (existing uncommitted diff) + `variables.less` convention | exact |
| `src/components/ProjectDetailsOverlay.vue` (`<style scoped>`) | component (modal style) | transform (literal → var reference) | itself (existing uncommitted diff) + `variables.less` convention | exact |
| `src/css/projects.less` | utility (global unscoped style for `v-html` content) | transform (single color-value fix) | itself (`.dialog-content a` rule, lines 63-67) | exact |

No other files in the codebase need touching for this phase — confirmed via CONTEXT.md D-03/D-04 (no full-site QA pass, no router-mode check) and the Header/Footer scan already done during discussion (no hardcoded colors there).

## Pattern Assignments

### `src/css/variables.less` (config, transform)

**Analog:** itself — current full contents (4 lines):
```less
@bodyBgColor: #000000;
@contentBgColor: #434348;
@textColor: #ffffff;
@skillRateCircleColor: #ffffff;
@accentColor: #6C3BAA;
```

**Naming convention to follow:** `@camelCaseNoun` + `Color` suffix, one variable per line, no grouping/comments. Add new tokens in the same flat style, e.g.:
```less
@gradientStart: #2b123f;
@gradientMid: #120818;
@gradientEnd: #000000;
@dialogBgColor: #000000;
```
(Exact names are Claude's discretion per D-02 — keep the `Color`/descriptive-noun pattern; gradient stops don't need `Color` suffix since they're used as literal stops, but should stay consistent with whatever naming the planner picks.)

**Do not** introduce nesting, maps, or a `@import` restructure — this file is intentionally a flat variable list; match that.

---

### `src/App.vue` (global style block, lines 38-161)

**Analog:** itself — the diff already exists uncommitted; this is a refactor-in-place, not new construction.

**Import pattern already present** (lines 40-41):
```less
@import './css/projects.less';
@import './css/variables.less';
```
`@textColor` is already consumed here (line 81, 105) — this is the existing convention: reference `variables.less` tokens directly by `@name`, no re-declaration.

**Literal to replace** (line 74):
```less
background: linear-gradient(180deg, #2b123f 0%, #120818 45%, #000000 100%);
```
→ becomes (once new tokens exist):
```less
background: linear-gradient(180deg, @gradientStart 0%, @gradientMid 45%, @gradientEnd 100%);
```

**Existing correct-already usage to mirror** (lines 81, 105):
```less
color: @textColor;
```

---

### `src/components/ProjectDetailsOverlay.vue` (`<style scoped>`, lines 34-119)

**Analog:** itself — same refactor-in-place as App.vue. Note: this file currently has **no** `@import './variables.less'` — needs adding since it's a scoped block referencing global Less variables (confirm this resolves correctly under vue-cli-service's less-loader; if not already global via `additionalData`/global less config, add the import at top of the `<style>` block, matching how `App.vue` imports it).

**Literals to replace:**
- Line 53: `background-color: #000000;` (`.dialog`) → `@dialogBgColor` (or reuse `@bodyBgColor` if identical intent — planner's call)
- Line 65-66: `color: #ffffff; background-color: #000000;` (`.dialog-title`) → `@textColor` / `@dialogBgColor`
- Line 74: `background: linear-gradient(180deg, #000000 0%, #120818 45%, #2b123f 100%);` (`.dialog-content` — note reversed stop order vs. App.vue's body gradient) → `linear-gradient(180deg, @gradientEnd 0%, @gradientMid 45%, @gradientStart 100%)` using the same three tokens as App.vue, reversed
- Line 75: `color: #ffffff;` → `@textColor`
- Line 98: `color: #ffffff;` (`.dialog-close-button`) → `@textColor`

---

### `src/css/projects.less` (global unscoped, `.dialog-content a` rule)

**Analog:** itself, lines 63-67 — single targeted fix, no structural change:
```less
a {
    color:#696969;
    opacity: 1;
    text-decoration: underline;
}

a:hover {
    opacity: 0.6;
}
```
**Fix:** change `#696969` to a light color per D-01 (Claude's discretion: pure white `@textColor` or an off-white e.g. `#e0e0e0`). Do **not** use `@accentColor` (`#6C3BAA`) — explicitly excluded by D-01. If reusing `@textColor`, this file needs `@import './variables.less';` added at the top (currently has no imports — check whether App.vue's global `@import` already makes these vars available across all Less files compiled together; if less-loader doesn't share scope across separate `@import`-ed partials this way, add the import here explicitly). Simplest/laziest option: hardcode a literal off-white here (this is a one-off content-styling file, not a component reusing the shared palette elsewhere) — only pull in `@textColor` if the planner wants strict token consistency.

---

## Shared Patterns

### Less variable convention
**Source:** `src/css/variables.less` (all 5 existing lines)
**Apply to:** `App.vue`, `ProjectDetailsOverlay.vue`, optionally `projects.less`
Flat `@camelCaseColor: #hex;` declarations, no nesting/maps. New tokens for the dark palette must follow this exact style.

### Global vs. scoped Less import
**Source:** `src/App.vue` lines 40-41
**Apply to:** `ProjectDetailsOverlay.vue` if it needs `@import './css/variables.less';` added to resolve its scoped-style variable references (verify during execution — Vue CLI's less-loader may already inject shared variables globally via `vue.config.js`; check for that before assuming an explicit import is needed).

## No Analog Found

None — all 4 files are self-contained refactors of existing uncommitted diffs or single-line fixes; no external codebase pattern search was needed beyond `variables.less` itself.

## Metadata

**Analog search scope:** `src/App.vue`, `src/components/ProjectDetailsOverlay.vue`, `src/css/variables.less`, `src/css/projects.less` (all 4 target files read directly; no broader Glob/Grep search required since CONTEXT.md fully scoped the file list and these files' own current content is the pattern source)
**Files scanned:** 4
**Pattern extraction date:** 2026-07-23
