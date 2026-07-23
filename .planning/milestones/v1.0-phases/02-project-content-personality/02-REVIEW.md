---
phase: 02-project-content-personality
reviewed: 2026-07-23T00:00:00Z
depth: standard
files_reviewed: 4
files_reviewed_list:
  - src/components/ProjectDetailsOverlay.vue
  - src/css/projects.less
  - src/data/GameProjectsData.ts
  - src/views/GameProjects.vue
findings:
  critical: 0
  warning: 4
  info: 3
  total: 7
status: issues_found
---

# Phase 02: Code Review Report

**Reviewed:** 2026-07-23
**Depth:** standard
**Files Reviewed:** 4
**Status:** issues_found

## Summary

Reviewed the 4 files in scope as they exist on disk. Cross-referenced each finding against `02-01-SUMMARY.md` and `02-03-SUMMARY.md` to separate this phase's actual edits (attribution copy, typo fixes, Floor 0 itch.io link, hero grammar fixes, close-button color, `.dialog-content h3` centering) from Josef's separate in-progress redesign work sitting uncommitted in the same files (overlay gradient, swing-space video/grid CSS, `LazyVideoThumbnail` timeline layout).

The lines phase 02 itself authored (checked via `git show` on each of the phase's commits: `f5bec8f`, `7c50e54`, `4bdb743`, `1ad254a`, `b05f177`) are clean — no typos reintroduced, no broken HTML, no lint errors, and the CSS-specificity math behind the two 02-03 fixes (`.dialog-content h3` centering, white `a.dialog-close-button`) checks out against `App.vue`'s global `h3` rule and `projects.less`'s `.dialog-content a` rule.

The issues below are all in code paths phase 02 touched or extended, but most predate this phase's specific edits (present since the original template fork or earlier phases) and are called out with that context so they aren't mis-attributed. One item (missing `rel="noopener"`) was freshly introduced by this phase when Floor 0's itch.io link was added in 02-01, copying an already-insecure sibling pattern.

## Warnings

### WR-01: `target="_blank"` links missing `rel="noopener noreferrer"` (reverse tabnabbing)

**File:** `src/data/GameProjectsData.ts:35,66,87`
**Issue:** All three itch.io links (Drag Rush, Dispater, and Floor Zero) open with `target="_blank"` but no `rel="noopener"`. Without `rel="noopener"`, the opened page gets a `window.opener` reference back to the portfolio tab and can navigate it to an arbitrary URL (reverse tabnabbing) — a well-known, easily-fixed class of vulnerability. The Floor Zero instance (line 87) was newly added by this phase (commit `7c50e54`, plan 02-01), copying the already-present insecure pattern from the Drag Rush/Dispater sibling links rather than fixing it.
**Fix:**
```html
<a href="https://juice-f.itch.io/floorzero" target="_blank" rel="noopener noreferrer">
```
Apply the same `rel` attribute to all three links.

### WR-02: `accentColor` / `color` prop is threaded through but never applied

**File:** `src/components/ProjectDetailsOverlay.vue:27,45-54` (also `src/views/GameProjects.vue:58,112`, `src/data/GameProjectsData.ts` accentColor args)
**Issue:** `ProjectData.accentColor` is documented as "color of title bar" (`src/data/ProjectData.ts:8`), `GameProjects.vue` reads `item.accentColor` into `popupColor` (line 112) and passes it to `<ProjectDetailsOverlay :color="popupColor" ...>` (line 58), and `ProjectDetailsOverlay` declares a `color: String` prop (line 27) — but nothing in the component's template or scoped style ever reads `color`. The `.dialog` background is hardcoded to `#000000` (line 53). Checking the original template commit (`b5b1424`) confirms `.dialog` used to bind `:style="{ 'background-color': color }"`; that binding is gone in the current file, so the whole per-project accent-color feature is dead even though its data plumbing is fully intact and looks functional at a glance.
**Fix:** Either restore the binding (e.g. `<div class="dialog" :style="{ 'background-color': color }">`) if per-project accent color is still wanted, or remove the now-pointless `color`/`accentColor` prop chain (prop, `popupColor` data field, and constructor arg) if it's intentionally retired — leaving it half-wired invites someone to "fix" the wrong end of it later.

### WR-03: Hand-maintained per-project maps in `GameProjects.vue` must stay in sync with `GameProjectsData.ts` by hand, with no fallback if they drift

**File:** `src/views/GameProjects.vue:76-108`
**Issue:** `projectRows`, `thumbVideos`, `thumbPosters`, and `summaries` are four separate object literals keyed by `project.id`, maintained independently of the `gameProjectsData` array they're rendered alongside. If a project is added to (or an id is renamed in) `GameProjectsData.ts` without updating all four maps, `thumbVideos[project.id]` / `thumbPosters[project.id]` come back `undefined` and are passed straight into `LazyVideoThumbnail`'s `required: true` string props (`src`, `poster`) — Vue will only warn to the console, and `summaries[project.id]` silently renders an empty `<p>`. This directly contradicts the "data-driven, single source of truth" pattern the rest of the codebase follows (per `CLAUDE.md`: "GameProjects.vue ... does not reuse ProjectsList.vue" and has its own hand-written per-project data).
**Fix:** At minimum, add a guard/fallback (e.g. `thumbVideos[project.id] || fallbackVideo`) or move `rowSide`/`summary`/`thumbVideo`/`thumbPoster` onto `ProjectData` itself (or a small lookup keyed off the existing array) so there's one place to update per project instead of four.

### WR-04: Overlay close controls are not keyboard-accessible

**File:** `src/components/ProjectDetailsOverlay.vue:8,12`
**Issue:** The X close icon is a `<div @click="$emit('close')" class="dialog-close">` with no `tabindex`, `role="button"`, or keydown handler, and the "Close" link is `<a @click="$emit('close')" class="dialog-close-button">Close</a>` with no `href` — anchors without `href` are excluded from the default tab order in most browsers. A keyboard-only user who opens a project overlay has no way to close it without a mouse.
**Fix:**
```html
<button type="button" @click="$emit('close')" class="dialog-close" aria-label="Close">
  <i class="fa fa-times fa-lg fa-fw"></i>
</button>
...
<button type="button" @click="$emit('close')" class="dialog-close-button">Close</button>
```
(Restyle as needed; `<button>` is focusable and Enter/Space-activated by default, removing the need for manual `tabindex`/keydown wiring.)

## Info

### IN-01: `v-html` renders `htmlContent` with no sanitization

**File:** `src/components/ProjectDetailsOverlay.vue:10`
**Issue:** `<div v-html="htmlContent"></div>` injects raw HTML with no escaping. Currently safe because every `htmlDescription` string is a static, developer-authored template literal in `GameProjectsData.ts`/`OtherProjectsData.ts` — there's no user input or external data source in the chain. Flagging only so this isn't forgotten if project copy is ever sourced from a CMS, a form, or any other non-static-file input in the future, at which point this would become a real stored-XSS vector.
**Fix:** No action needed today; if content ever becomes dynamic, sanitize with a library such as `dompurify` before binding.

### IN-02: `iconUrl` / `isHigh` / `isWide` arguments are dead for every `GameProjectsData.ts` entry

**File:** `src/data/GameProjectsData.ts:4,38,69,90`
**Issue:** Each `new ProjectData(id, name, iconUrl, html, accentColor, isHigh, isWide)` call supplies a real `iconUrl` (e.g. `img/projects/swing-space/SwingSpaceGIF.gif`, an 18MB file) and `false, false` for the grid-sizing flags, but `GameProjects.vue`'s bespoke timeline layout never reads `project.iconUrl`, `project.isHigh`, or `project.isWide` — those fields only matter to `ProjectsList.vue`'s grid layout, which `GameProjects.vue` doesn't use. The arguments are inert for this view, which makes the data file read as if changing them would affect the timeline thumbnails when it wouldn't.
**Fix:** No functional change required; consider a short comment at the top of `GameProjectsData.ts` noting that `iconUrl`/`isHigh`/`isWide` are vestigial for this array (real thumbnails come from `GameProjects.vue`'s `thumbVideos`/`thumbPosters` maps), so future edits aren't misdirected at the wrong field.

### IN-03: Duplicate `.dialog-content` selector blocks

**File:** `src/components/ProjectDetailsOverlay.vue:69-76`
**Issue:** `.dialog-content { padding: 20px; }` (line 69) and `.dialog-content { background: ...; color: #fff; }` (line 73) are two separate rule blocks for the same selector in the same `<style>` block (present since the original template fork). Harmless — CSS merges them at compute time — but it reads as an unintentional split and is easy to lose track of when editing one and forgetting the other exists a few lines down.
**Fix:** Merge into a single `.dialog-content { padding: 20px; background: ...; color: #ffffff; }` block.

---

_Reviewed: 2026-07-23_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
