# Phase 2: Project Content & Personality - Pattern Map

**Mapped:** 2026-07-22
**Files analyzed:** 2
**Analogs found:** 2 / 2 (both self-referential — the pattern to copy lives inside the same file, in sibling project blocks)

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|--------------------|------|-----------|-----------------|---------------|
| `src/data/GameProjectsData.ts` | model (static content data) | transform (string content edit, no logic change) | itself — Drag Rush/Dispater's existing "About this game" + itch.io blocks are the analog for the Floor 0 itch.io link and for the attribution-line style | exact (in-file sibling pattern) |
| `src/views/GameProjects.vue` | component (view template) | request-response (static render, no data flow) | itself — existing `.hero-copy` block (lines 4-16) is the analog if any wording polish is needed | exact (no structural change expected per D-05) |

This phase is pure content/copy editing inside two already-existing files — there is no new file being created and no new component/service/pattern being introduced. The "pattern to copy" in every case is the sibling block already present in the same file.

## Pattern Assignments

### `src/data/GameProjectsData.ts` (model, transform)

**Analog:** itself — Drag Rush's and Dispater's own `htmlDescription` blocks (this file, full contents already read — no re-read needed)

**Overall structure** (repeats per project, e.g. Drag Rush lines 4-36):
```html
<div class="paragraph">
    <strong>Drag Rush</strong> is a rhythm-action racing game set in a sci-fi universe of cosmic bloodsports.
</div>
<div class="paragraph">
    ...flavor copy with <br/> line breaks...
</div>
<div class="paragraph center">
    <iframe class="youtube" ...></iframe>
</div>
<div class="paragraph center">
    <img class="pc-screenshot" loading="lazy" src="..." alt="..." />
    ...
</div>
<div class="paragraph center">
    <h3>About this game</h3>
    Built in Unity (8 weeks).<br/>
    Unique twist between a racing- and rythmgame.<br/>
    Custom made "Beat Conductor".<br/>
    Fast-paced, satisfying and a "ok, one more try!" hook.
</div>
<div class="paragraph center">
    <a href="https://yrgo.itch.io/drag-rush" target="_blank">Play on itch.io</a>
</div>
```

**"About this game" bullet-line pattern (CONT-02, CONT-04)** — every project's block is a `<h3>About this game</h3>` followed by `<br/>`-terminated one-line bullets inside a single `<div class="paragraph center">`. New attribution lines (D-01, D-02) must be added as additional `<br/>`-terminated bullet lines inside this same block, matching the terse, punchy, single-sentence style already used (e.g. "Custom made \"Beat Conductor\"." / "Heavy narrative."). Do not introduce a separate `<div>`, a new heading, or a differently formatted credits section (per D-03).

- Drag Rush block: lines 27-32 (`GameProjectsData.ts`) — this is where the team-of-6 / vehicle-animation-trees / beat-conductor attribution line goes, and where "rythmgame" → "rhythm game" typo fix (D-06) applies (line 29).
- Dispater block: lines 55-61 — this is where the team-of-7 / dialogue-task-interaction-systems / audio-engineering attribution line goes; also fix "enviroment" → "environment" (line 59).
- Floor 0 block: lines 77-82 — no attribution needed (solo project); tighten "Will leave you sleep less for days." (line 81) per D-06.
- SwingSpace block: lines 99-104 — fix "intergration" → "integration" (line 102); no attribution needed (solo project).

**Itch.io link pattern (CONT-05)** — exact copy source is Drag Rush's block (lines 33-35) and Dispater's block (lines 62-64):
```html
<div class="paragraph center">
    <a href="https://yrgo.itch.io/drag-rush" target="_blank">Play on itch.io</a>
</div>
```
For Floor 0, per D-07, add immediately after the existing "About this game" block (after line 82, before the closing template literal backtick at line 83):
```html
<div class="paragraph center">
    <a href="https://juice-f.itch.io/floorzero" target="_blank">Play on itch.io</a>
</div>
```
Same classes (`paragraph center`), same `target="_blank"` attribute — only the `href` and label text stay identical (label is always literally "Play on itch.io"), only the URL differs per project.

**No error handling / validation / auth applicable** — this file is a static plain-data array (`ProjectData` instances) with no functions, no async operations, and no user input. Edits are purely string-literal changes to the `htmlDescription` template literals passed into each `new ProjectData(...)` constructor call.

---

### `src/views/GameProjects.vue` (component, request-response)

**Analog:** itself — `.hero-copy` block, lines 4-16 (already read in full — no re-read needed)

```html
<div class="hero-copy">
  <h1>Hello there!</h1>
  <div class="intro">
    Welcome to my slice of the internet!
  </div>

  <div class="intro">
    My name is Josef and I am a Game Developer student residing in Gothenburg, Sweden. I have a background in fashion, retail and have previously ran a clothing brand for five years. I love Resident Evil, dogs and working out (almost equally).
  </div>

  <div class="intro secondary">
    Here are some projects that I have made solo or in team:
  </div>
</div>
```

Per D-05, this content is already considered a strong existing draft — this phase's scope for this file is **wording polish only, if requested at UAT**, not restructuring. If Josef requests a wording tweak, edit text inside the existing `<div class="intro">` elements in place; do not add new `<div>` wrappers or change the `.hero` / `.hero-copy` / `.hero-photo` layout structure (styles at lines 125-148, 225-231 are unaffected by copy-only changes).

---

## Shared Patterns

### "About this game" bullet block (CONT-02 / CONT-04)
**Source:** `src/data/GameProjectsData.ts`, all 4 existing blocks (lines 26-32, 54-61, 76-82, 98-104)
**Apply to:** Drag Rush and Dispater attribution additions, and all 4 projects' typo/wording fixes
```html
<div class="paragraph center">
    <h3>About this game</h3>
    Line one.<br/>
    Line two.<br/>
    Line three.<br/>
    Final line (no trailing <br/> on the last line).
</div>
```

### Itch.io external link (CONT-05)
**Source:** `src/data/GameProjectsData.ts` lines 33-35 (Drag Rush) and 62-64 (Dispater)
**Apply to:** Floor 0's new itch.io block
```html
<div class="paragraph center">
    <a href="<PROJECT_ITCH_URL>" target="_blank">Play on itch.io</a>
</div>
```

## No Analog Found

None — both files already contain the exact pattern needed (sibling project blocks in `GameProjectsData.ts`; existing `.hero-copy` markup in `GameProjects.vue`). No cross-file or cross-codebase analog search was necessary since this is a self-contained content-editing phase per CONTEXT.md's `<code_context>` section.

## Metadata

**Analog search scope:** `src/data/GameProjectsData.ts`, `src/views/GameProjects.vue` (both fully read; no other files touched this phase per CONTEXT.md D-04, D-05, D-06, D-07)
**Files scanned:** 2
**Pattern extraction date:** 2026-07-22
