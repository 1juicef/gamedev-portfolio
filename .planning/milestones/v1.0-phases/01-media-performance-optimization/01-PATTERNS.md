# Phase 1: Media & Performance Optimization - Pattern Map

**Mapped:** 2026-07-21
**Files analyzed:** 7 (2 new, 5 modified) plus config/tooling files
**Analogs found:** 6 / 7

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|--------------------|------|-----------|-----------------|----------------|
| `scripts/convert-media.js` | utility (build/dev-time script) | file-I/O (batch transform) | none in-repo (first Node script in project) | no analog — use RESEARCH.md Code Examples |
| `src/components/LazyVideoThumbnail.vue` | component | event-driven (IntersectionObserver → DOM mutation) | `src/components/ProjectDetailsOverlay.vue` | role-match (nearest existing standalone, prop-driven, non-scoped-state-free component) |
| `src/views/GameProjects.vue` | view/controller (template + component composition) | request-response (click → overlay open) | itself (modified in place) | exact — edit existing file |
| `src/data/GameProjectsData.ts` | model/data (static content array) | CRUD (in the sense of static "read" content records) | itself (modified in place) | exact — edit existing file |
| `src/data/ProjectData.ts` | model | CRUD | itself (no schema change expected — reuse existing `iconUrl`/`htmlDescription` fields) | exact — no new fields needed per CONTEXT.md code_context note |
| `src/App.vue` (preload call site) | config/provider (app bootstrap) | batch (eager preload list) | itself (modified in place) | exact — edit existing file |
| `package.json` | config | N/A | itself (modified in place) | exact — add `sharp` devDependency |

## Pattern Assignments

### `scripts/convert-media.js` (utility, file-I/O/batch transform)

**Analog:** None in-repo — this is the first Node-side tooling script in the project (`src/helpers.ts` is browser-side only, not a comparable analog for `child_process`/`fs` usage). Use RESEARCH.md's `Code Examples` section directly as the template; it is already tailored to this codebase's exact file paths and CONTEXT.md's locked decisions (D-01/D-02/D-12).

**Reference implementation to copy from RESEARCH.md** (01-RESEARCH.md lines 344-385):
- ffmpeg GIF→MP4 invocation (lines 318-335): CRF 28, veryslow preset, even-dimension scale filter, `-an`, `-movflags +faststart`.
- ffmpeg poster-frame extraction (lines 337-342): `-vframes 1` on the source GIF.
- sharp WebP pipeline (lines 344-364): `sharp(input).webp({ quality: 82, effort: 4 }).toFile(output)`.
- Safe `child_process.execFile` wrapper (lines 366-385): argument array, no shell string concatenation.

**Naming/style convention to follow (per CLAUDE.md/`.claude/CLAUDE.md` Conventions section):**
- camelCase function names (`gifToMp4`, `toWebp`, matching existing `preloadImages`/`preloadImage` camelCase style in `src/helpers.ts`).
- 4-space indentation, consistent with rest of codebase.
- No TypeScript required for this script (project's `tsconfig.json` targets `src/`; a plain Node CLI script run via `node scripts/convert-media.js` outside the Vue CLI build is idiomatic here — CONTEXT.md's Claude's Discretion note explicitly allows either a standalone script or inline commands).

---

### `src/components/LazyVideoThumbnail.vue` (component, event-driven)

**Analog:** `src/components/ProjectDetailsOverlay.vue` (closest existing standalone, prop-driven, `Vue.extend()`-based component with `<style scoped>`).

**Imports pattern** (ProjectDetailsOverlay.vue lines 20-22):
```typescript
import Vue from "vue";

export default Vue.extend({
  name: "ProjectDetailsOverlay",
  props: {
    visible: Boolean,
    color: String,
    title: String,
    htmlContent: String,
  },
});
```
Copy this `Vue.extend({ name: ..., props: {...} })` shape for `LazyVideoThumbnail`'s `src`/`poster` props — same convention (plain `Boolean`/`String` prop shorthand is used elsewhere in this codebase's simpler components; RESEARCH.md's fuller `{ type: String, required: true }` object form is also acceptable and slightly stricter — either matches project conventions since both styles appear across the codebase).

**Core pattern:** Use RESEARCH.md's `Pattern 1: Viewport-gated video autoplay` (01-RESEARCH.md lines 173-254) verbatim as the component skeleton — it is already written in this project's exact Options API + `Vue.extend()` + TypeScript style (`data()` returning typed fields, `mounted()`/`beforeDestroy()` lifecycle hooks, `methods: {}` block). No structural changes needed; it matches:
- `data: function () { return {...} }` shape (matches `GameProjects.vue` lines 77-97 and `ProjectDetailsOverlay.vue`'s absence-of-data — but the function-return style is the established convention seen in `GameProjects.vue`).
- Method definitions as `methodName: function (...) {...}` (matches `GameProjects.vue` lines 98-106 `showDetails: function (item: ProjectData) {...}`).

**Style block convention:** `<style scoped>` — every existing component (`GameProjects.vue` line 110, `ProjectDetailsOverlay.vue` line 34) uses `<style scoped>` for component-local CSS. `LazyVideoThumbnail.vue` should follow the same, with any classes needed inside `v-html` overlay content instead added to the *global* `src/css/projects.less` (per the project's documented split — scoped for component templates, `projects.less` only for `v-html` content).

---

### `src/views/GameProjects.vue` (view, request-response — MODIFIED)

**Analog:** Itself — edit in place, removing the special-cased branch.

**Pattern to remove** (lines 31-43, the `v-if`/`v-else` YouTube-iframe special case for drag-rush/dispater):
```html
<div class="project-image-wrap">
  <button class="project-image-button" @click="showDetails(project)" v-if="project.id !== 'drag-rush' && project.id !== 'dispater'">
    <img class="project-image" :class="{ 'project-image--swing-space': project.id === 'swing-space' }" :src="project.iconUrl" :alt="project.name + ' image'" />
  </button>
  <div class="project-image-wrap-video" v-else>
    <iframe class="youtube" :src="..." frameborder="0" allowfullscreen></iframe>
  </div>
</div>
```

**Pattern to converge on (per D-08):** All 4 projects use one identical `<button @click="showDetails(project)">` wrapper containing `<LazyVideoThumbnail>` instead of the conditional `<img>`/`<iframe>` split. Preserve the existing `showDetails(project)` click handler (lines 98-105) unchanged — no new click-handling logic needed, only the thumbnail markup inside the button changes.

**Existing click/state pattern to reuse as-is** (lines 98-105):
```typescript
showDetails: function (item: ProjectData) {
  this.popupTitle = item.name;
  this.popupColor = item.accentColor;
  this.popupContent = item.htmlDescription;
  this.showPopup = true;
  window.scrollTo(0, 0);
},
```

**CSS classes to retire/adapt:** `.project-image-wrap-video` and `.project-image-wrap-video iframe` (lines 172-187, the 16:9 padding-bottom trick for the iframe) are no longer needed for the timeline thumbnail once D-08 is applied — a similar or reused padding-bottom wrapper technique may still be useful for `LazyVideoThumbnail`'s aspect-ratio box, so treat this as a pattern to relocate into `LazyVideoThumbnail.vue`'s own scoped styles rather than deleting the technique outright.

**iframe convention to preserve elsewhere (per D-09):** The trailer iframe markup (`<iframe class="youtube" src="..." frameborder="0" allowfullscreen></iframe>`, line 36-40 style) moves into `GameProjectsData.ts`'s `htmlDescription` for Drag Rush (already present, see below) and gets added fresh for Dispater — copy the exact attribute set (`class="youtube"`, `frameborder="0"`, `allowfullscreen`) for consistency with the global `.youtube` class already styled in `src/css/projects.less` lines 13-16, 67-70.

---

### `src/data/GameProjectsData.ts` (model/data — MODIFIED)

**Analog:** Itself — every project entry follows the same `new ProjectData(id, name, iconUrl, htmlDescriptionTemplateString, accentColor, isHigh, isWide)` constructor call pattern (lines 4, 37, 63, 81).

**Existing trailer-iframe pattern to copy for Dispater** (Drag Rush, lines 16-18):
```html
<div class="paragraph center">
    <iframe class="youtube" src="https://www.youtube.com/embed/L5YWz2i434E" frameborder="0" allowfullscreen></iframe>
</div>
```
For Dispater, add an equivalent block using video id `ihPEcIQ_PwI` (per D-09), inserted in the same relative position (after the intro paragraph, before screenshots) as Drag Rush's.

**Existing screenshot `<img>` pattern** (lines 20-24, Drag Rush; same shape repeated for Dispater lines 45-49, Floor 0 lines 68-71 — currently broken paths, SwingSpace lines 92-93):
```html
<img class="pc-screenshot" src="img/projects/drag-rush/DragrushSC1.png" alt="Drag Rush Screenshot" />
```
**Required transform per MEDIA-02/MEDIA-03 + Pattern 2 (attribute order):** every occurrence becomes:
```html
<img class="pc-screenshot" loading="lazy" src="img/projects/drag-rush/DragrushSC1.webp" alt="Drag Rush Screenshot" />
```
Note `loading="lazy"` is inserted **before** `src` (per RESEARCH.md Pattern 2 / Pitfall 3 — Firefox attribute-order bug), and `.png` → `.webp` extension swap (per D-12/D-13, no `<picture>` fallback).

**Floor 0 fix (D-14 / Pitfall 4):** lines 68-71 currently reference non-existent `img/projects/floor-0-1.png` .. `floor-0-4.png`. Replace with the real, reorganized files: `img/projects/floor-0/Floor0SC1.webp` through `Floor0SC4.webp` (converted per MEDIA-02), each with `loading="lazy"` inserted before `src` as above.

**Thumbnail (`iconUrl`) convention change:** Currently `iconUrl` is a plain image path string consumed generically by `<img :src="project.iconUrl">` in `GameProjects.vue` (see role-match note above). Since all 4 projects converge on video thumbnails, either (a) repurpose `iconUrl` to hold the `.mp4` path and add a new field (e.g. `posterUrl`) to `ProjectData.ts`, or (b) pass explicit per-project video/poster paths directly in `GameProjects.vue`'s template via a small lookup map (mirroring the existing `projectRows`/`summaries` per-id lookup-object convention already used at lines 80-95 of `GameProjects.vue`). The lookup-object convention (`projectRows: { "drag-rush": "normal", ... }`) is the more consistent in-codebase pattern to copy from if avoiding a `ProjectData.ts` schema change is preferred (per CONTEXT.md's code_context note: "no schema change needed... but a convention will be needed").

**Per-project source assets to wire in** (per D-10/D-11/D-15):
- Drag Rush: `img/projects/drag-rush/DragRushGif.gif` → `.mp4` + poster
- Dispater: `img/projects/dispater/DispaterGif2.gif` → `.mp4` + poster
- Floor 0: `img/projects/floor-0/Floor0gif1.gif` → `.mp4` + poster
- SwingSpace: `img/projects/swing-space/SwingSpaceGIF3.gif` → `.mp4` + poster (per D-15, overriding RESEARCH.md's Pitfall 5 default of `SwingSpaceGIF.gif`)

---

### `src/App.vue` (config/provider — MODIFIED, low-priority cleanup)

**Analog:** Itself. Current preload call (lines 30-34):
```javascript
Helpers.preloadImages([
  "img/projects/project-1-icon.png",
  "img/projects/project-2-icon.png",
  "img/projects/project-3-icon.png"
]);
```
These 3 paths are stale/dead-weight per CONTEXT.md's code_context note (unused elsewhere in the current codebase after the D-06/D-07 reorg — `project-1/2/3-icon.png` were only ever used as thumbnail placeholders, and thumbnails are being converted to video). Not an explicit phase requirement, but flagged as worth revisiting during this performance pass — planner's discretion whether to prune this list to zero-length, remove the call and `Helpers` import entirely, or leave it (it's a no-op if the paths genuinely aren't referenced anywhere by end of phase).

---

### `package.json` (config — MODIFIED)

**Analog:** Itself. Add to `devDependencies` (alongside existing dev tooling like `less-loader`, `typescript`):
```json
"sharp": "^0.34.0"
```
Per D-01/Pitfall 1 — must NOT use `latest`/unpinned (would resolve to `0.35.x`, incompatible with this machine's Node 18.20.4). No new npm script needed for `scripts/convert-media.js` — it's a one-time dev-run script (`node scripts/convert-media.js`), not a build-time step, consistent with CONTEXT.md's Claude's Discretion note.

---

## Shared Patterns

### Options API / Vue.extend() component shape
**Source:** `src/components/ProjectDetailsOverlay.vue` lines 20-31, `src/views/GameProjects.vue` lines 66-108
**Apply to:** `LazyVideoThumbnail.vue` (new)
```typescript
import Vue from "vue";

export default Vue.extend({
  name: "ComponentName",
  props: { /* ... */ },
  data: function () { return { /* ... */ }; },
  methods: { methodName: function () { /* ... */ } },
});
```

### Scoped styles convention
**Source:** every existing `.vue` file (`GameProjects.vue` line 110, `ProjectDetailsOverlay.vue` line 34)
**Apply to:** `LazyVideoThumbnail.vue` — use `<style scoped>`; only classes rendered inside `v-html` (i.e. inside `ProjectDetailsOverlay`'s `htmlContent`) belong in the global, non-scoped `src/css/projects.less`.

### `loading="lazy"` attribute placement in hand-authored HTML strings
**Source:** RESEARCH.md Pattern 2 (01-RESEARCH.md lines 256-267), applies to every `<img>` in `src/data/GameProjectsData.ts`
**Apply to:** All 16+ screenshot `<img>` tags across all 4 projects' `htmlDescription` strings.
```html
<img class="pc-screenshot" loading="lazy" src="img/projects/<project>/<Name>.webp" alt="..." />
```
`loading` must appear before `src` in the tag's attribute order (Firefox Bugzilla #1647077).

### Per-project id-keyed lookup object (existing convention)
**Source:** `src/views/GameProjects.vue` lines 80-95 (`projectRows`, `summaries`)
**Apply to:** Any new per-project video/poster path mapping needed in `GameProjects.vue`, if the planner chooses not to add fields to `ProjectData.ts`.
```typescript
projectRows: {
  "drag-rush": "normal",
  dispater: "reverse",
  "floor-0": "normal",
  "swing-space": "reverse",
},
```

### Safe child_process invocation (new pattern, no in-repo precedent)
**Source:** RESEARCH.md Code Examples (01-RESEARCH.md lines 366-385)
**Apply to:** `scripts/convert-media.js`
```javascript
const { execFile } = require("child_process");
const { promisify } = require("util");
const execFileAsync = promisify(execFile);
// always pass args as an array, never a concatenated string
```

## No Analog Found

| File | Role | Data Flow | Reason |
|------|------|-----------|--------|
| `scripts/convert-media.js` | utility | file-I/O/batch | First Node-side dev-tooling script in this repo (`src/helpers.ts` is browser-only). Use RESEARCH.md's Code Examples section (already tailored to this repo's exact paths and CONTEXT.md decisions) as the template instead of an in-repo analog. |

## Metadata

**Analog search scope:** `src/components/`, `src/views/`, `src/data/`, `src/`, `public/img/projects/`, project root config files
**Files scanned:** `GameProjects.vue`, `GameProjectsData.ts`, `ProjectData.ts`, `ProjectDetailsOverlay.vue`, `helpers.ts`, `App.vue`, `package.json`, `src/css/projects.less`
**Pattern extraction date:** 2026-07-21
