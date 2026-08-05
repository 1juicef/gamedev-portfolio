---
phase: quick-260805-pzm
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - public/img/resume-photo.jpg
  - src/views/Resume.vue
autonomous: false
requirements: [QUICK-260805-pzm]

must_haves:
  truths:
    - "Visiting /resume shows Josef's profile photo in the resume header, sitting alongside the name 'Josef Ubaka' and the 'Game Programmer' title, with the Download button still on the right."
    - "The image the browser downloads is a web-sized derivative well under 200KB — the raw ~13MB source is never requested by the page."
    - "The published photo carries no EXIF metadata (no GPS coordinates or device fingerprint leak from the original phone/camera file)."
    - "The header layout holds at desktop width and below the repo's 620px mobile breakpoint — nothing overflows, the Download button stays reachable, and the photo does not dominate the page."
    - "The user's original source photos (resume-pic.jpg, resume-pic2.jpg, resume-pic3.jpg) are byte-for-byte untouched and are NOT swept into any commit, and neither are the other unrelated working-tree changes."
    - "The GameProjects hero avatar (img/avatar.png in .hero-photo) is completely unchanged."
  artifacts:
    - "public/img/resume-photo.jpg — web-optimized JPEG derivative, long edge <= 700px, <= 200KB, EXIF stripped, tracked in git"
    - "src/views/Resume.vue — .resume-photo img element inside the resume header plus its scoped LESS rules (desktop + 620px breakpoint)"
  key_links:
    - "Resume.vue img src must be the root-relative path 'img/resume-photo.jpg' (this repo's public/ asset convention). A leading slash is tolerated by the dev server but '@/assets/...' or a bundler import would break the build; pointing at the raw source file would ship a 13MB request."
    - "public/img/resume-photo.jpg must be git-tracked — .gitignore lists specific unconverted media paths under /public/img/projects/, and this new file is NOT matched by any of them (verified during planning: git check-ignore exits 1). If it were left untracked, a fresh clone / deployed build would render a broken image."
    - ".resume-photo styles must live inside Resume.vue's existing scoped <style scoped lang=\"less\"> block so they cannot leak onto GameProjects' .hero-photo avatar."
    - "The photo element must sit inside the existing .resume-header flex row (which is display:flex + justify-content:space-between). Inserting a third direct flex child would push the Download button out of position — group the photo and .resume-heading into one wrapper child instead."
---

<objective>
Add a profile photo to the Resume page header, generated as a web-sized derivative of the user's raw camera portrait.

Purpose: The resume page currently opens with a bare name + title. A portrait makes it read as a real CV at a glance, which is the core "polished and professional within a 10-second scan" value. The raw source the user dropped in (`public/img/resume-pic.jpg`, 4752x7128, ~13MB) is unusable on the web as-is, so this plan produces an optimized derivative first and wires only that into the page.

Output: `public/img/resume-photo.jpg` (small, EXIF-free) plus a styled photo element in `src/views/Resume.vue`, in two atomic, tightly-scoped commits.
</objective>

<execution_context>
@$HOME/.claude/gsd-core/workflows/execute-plan.md
@$HOME/.claude/gsd-core/templates/summary.md
</execution_context>

<context>
@.planning/STATE.md
@CLAUDE.md
@.claude/CLAUDE.md

@src/views/Resume.vue
</context>

<discovery_findings>
Verified during planning — trust these, do not re-derive:

- **sharp is installed and loadable:** `require('sharp')` works from the repo root; version 0.34.5. No `npm install` is needed, so no package-legitimacy checkpoint applies to this plan.
- **Source image facts:** `public/img/resume-pic.jpg` is 4752x7128 JPEG, 13,289,666 bytes, `orientation` metadata undefined. It is **tracked** in git and currently shows as `M` (modified) in the working tree — the user replaced a previously-committed file. It is referenced **nowhere** in `src/`, `public/index.html`, or `.env`.
- **Sibling sources:** `public/img/resume-pic2.jpg` (~11.7MB) and `resume-pic3.jpg` (~13.3MB) are untracked. All three stay exactly as they are.
- **Not gitignored:** `git check-ignore -v public/img/resume-photo.jpg` exits 1 — the new derivative is committable. `.gitignore` only names specific files under `/public/img/projects/`.
- **Existing header markup** (`src/views/Resume.vue` lines 4-13): `<header class="resume-header">` contains exactly two children — `<div class="resume-heading">` (holding `.resume-name` h2 and `.resume-title` div) and the `.download-button` anchor. Its CSS is `display:flex; flex-wrap:wrap; align-items:flex-start; justify-content:space-between; gap:16px`.
- **Repo asset convention:** root-relative, no leading slash, no bundler import — `GameProjects.vue` uses `<img src="img/avatar.png" ... width="512" height="512" />`. Match that shape.
- **Breakpoint convention:** `@media only screen and (min-width: 620px)` — Resume.vue already has two such blocks at the end of its style section.
- **Dirty working tree (pre-existing, NOT ours):** modified `.planning/quick/260728-rml-.../260728-rml-SUMMARY.md` and `public/img/resume-pic.jpg`; untracked `.claude/launch.json`, `.continue/`, `.planning/quick/260803-f3o-.../260803-f3o-SUMMARY.md`, `public/Postmortum descriptions.txt`, `public/img/projects/cpp-sokoban/*.gif`, `public/img/resume-pic2.jpg`, `public/img/resume-pic3.jpg`, `skills-lock.json`. Two prior commits in this repo accidentally swept unrelated files in. **Never** use `git add -A`, `git add .`, `git add public/img`, or `git commit -a` in this plan — stage explicit file paths only.
</discovery_findings>

<tasks>

<task type="auto">
  <name>Task 1: Generate the web-optimized profile photo derivative</name>
  <files>public/img/resume-photo.jpg</files>
  <action>
Write a throwaway CommonJS script at the repo root named `tmp-resize-resume-photo.cjs` (root placement is required so Node resolves `sharp` from the project's `node_modules`). It should run a single sharp pipeline: read `public/img/resume-pic.jpg`, call `.rotate()` with no arguments (applies any EXIF orientation, then drops it), `.resize({ width: 700, height: 700, fit: 'inside', withoutEnlargement: true })` so the long edge lands at 700px with aspect ratio preserved (expect roughly 467x700), `.jpeg({ quality: 80, mozjpeg: true })`, and `.toFile('public/img/resume-photo.jpg')`. Log the resulting width, height, and byte size.

Do **not** call `.withMetadata()` — sharp strips EXIF by default, and that default is exactly the mitigation for T-pzm-02 (the source is a phone/camera file that may carry GPS coordinates and device identifiers into a publicly deployed site).

Do **not** crop to a square here. The derivative keeps the full portrait; the circular framing is done in CSS in Task 2, which leaves the framing adjustable via a single `object-position` value during the checkpoint instead of requiring a re-run of this script.

Run it with `node tmp-resize-resume-photo.cjs` from the repo root, confirm the logged dimensions and size, then **delete the script**.

Write output to the new filename only. The three `resume-pic*.jpg` source files must not be modified, renamed, moved, or deleted — the user may want to pick a different one later.

Record the exact output dimensions the script logs; Task 2 needs them for the img `width`/`height` attributes.

Commit with exactly: `git add public/img/resume-photo.jpg` then commit as `chore(quick-260805-pzm): add web-optimized resume profile photo`. Stage nothing else — the working tree holds several unrelated modified and untracked files (see discovery findings), including two multi-megabyte source photos.
  </action>
  <verify>
    <automated>node -e "const fs=require('fs');const p='public/img/resume-photo.jpg';const b=fs.statSync(p).size;const o=fs.statSync('public/img/resume-pic.jpg').size;require('sharp')(p).metadata().then(m=>{console.log(m.width+'x'+m.height,b+'B','exif='+!!m.exif,'source='+o);if(b>204800||Math.max(m.width,m.height)>700||Math.min(m.width,m.height)<300||m.exif||o!==13289666)process.exit(1);});" && test ! -f tmp-resize-resume-photo.cjs && test -z "$(git status --porcelain public/img/resume-pic2.jpg public/img/resume-pic3.jpg | grep -v '^??')"</automated>
  </verify>
  <done>`public/img/resume-photo.jpg` exists at <= 700px on its long edge, <= 200KB, with no EXIF block; `public/img/resume-pic.jpg` is still exactly 13,289,666 bytes; `tmp-resize-resume-photo.cjs` is gone; the derivative is committed alone.</done>
</task>

<task type="auto">
  <name>Task 2: Wire and style the photo into the Resume header</name>
  <files>src/views/Resume.vue</files>
  <action>
Edit `src/views/Resume.vue` only. Do not touch `GameProjects.vue`, `App.vue`, or `src/css/*.less`.

**Template** — restructure the existing `<header class="resume-header">` so it still has exactly two direct flex children (preserving the `space-between` push of the Download button to the right edge):
1. Wrap the existing `.resume-heading` div and a new `<img>` together in a new `<div class="resume-identity">`, photo first, heading second.
2. The img: `class="resume-photo"`, `src="img/resume-photo.jpg"` (root-relative, no leading slash, no `@/assets`, no bundler import — matching `GameProjects.vue`'s `img/avatar.png`), `alt="Portrait photo of Josef Ubaka"`, and `width`/`height` attributes set to the real pixel dimensions Task 1 logged.
3. Leave the `.download-button` anchor as the second direct child of `.resume-header`, unchanged.
4. Change nothing else in the template — the `<h1>Resume</h1>`, `.contact-row`, `.summary`, and everything below stay as-is.

Do not name the raw source file anywhere inside `Resume.vue` — not in markup, not in a comment. The page references the derivative only. <!-- planner-discipline-allow: resume-pic -->

**Styles** — add rules to the existing `<style scoped lang="less">` block (kebab-case class names, 2-space indent, matching the file's current formatting):
- `.resume-identity`: `display:flex`, `align-items:center`, `gap:16px`, `min-width:0` so long content can shrink rather than overflow on narrow screens.
- `.resume-photo`: `flex:0 0 auto`, `display:block`, `width:84px`, `height:84px`, `border-radius:50%`, `object-fit:cover`, `object-position:center 20%` (portrait faces sit in the upper third of a full-body phone photo — this is the one knob the checkpoint may adjust), and a subtle `border: 1px solid rgba(255, 255, 255, 0.18)` matching the muted white-alpha borders already used in this file.
- Inside a new (or the existing final) `@media only screen and (min-width: 620px)` block, bump `.resume-photo` to `width:116px; height:116px`.

Do not introduce new colors or touch the gradient/theme — the palette redesign is a separate future task.

Verify with `npm run lint` (this project wraps vue-cli-service with `NODE_OPTIONS=--openssl-legacy-provider`; if invoking tooling directly ever fails on OpenSSL, set that env var).

Commit with exactly: `git add src/views/Resume.vue` then commit as `feat(quick-260805-pzm): show profile photo in resume header`. Stage nothing else.
  </action>
  <verify>
    <automated>npm run lint && test "$(grep -c 'img/resume-photo.jpg' src/views/Resume.vue)" = "1" && test "$(grep -c 'resume-pic' src/views/Resume.vue)" = "0" && test "$(grep -c 'resume-identity' src/views/Resume.vue)" = "2" && test -z "$(git status --porcelain src/views/GameProjects.vue)"</automated>
  </verify>
  <done>Lint passes; `Resume.vue` references `img/resume-photo.jpg` exactly once and the raw source zero times; `.resume-identity` appears in both template and styles; `GameProjects.vue` is untouched; the change is committed alone.</done>
</task>

<task type="checkpoint:human-verify" gate="blocking">
  <what-built>A circular profile photo in the Resume page header, left of the name "Josef Ubaka" / "GAME PROGRAMMER", generated as a ~700px-long-edge, sub-200KB, EXIF-stripped derivative of the user's raw 13MB portrait. The three original `resume-pic*.jpg` files are untouched, and the GameProjects hero avatar is unchanged.</what-built>
  <how-to-verify>
1. Run `npm run serve` and open the dev server URL, then navigate to the Resume tab (also check it inside `/one-page`, which stacks the Resume view).
2. Confirm the photo shows the intended framing — the face should be centered in the circle. If the crop sits too high or too low, the fix is a single value: `object-position: center 20%` in `.resume-photo` (lower the percentage to show more of the top, raise it to show more of the bottom). Say which way it should move.
3. Confirm the size feels right for a resume header (116px circle on desktop, 84px on mobile) and that the Download button is still flush right on the same row.
4. Narrow the browser window below 620px: the photo + name group should stay side by side, nothing should overflow horizontally, and the Download button should wrap cleanly below.
5. Confirm this is the photo you wanted — `resume-pic2.jpg` and `resume-pic3.jpg` are still available as alternatives if you'd rather use one of those instead.
6. Confirm the Projects tab hero avatar is unchanged.
  </how-to-verify>
  <resume-signal>Type "approved", or describe the adjustment (framing direction, size, or a different source photo).</resume-signal>
</task>

</tasks>

<threat_model>
## Trust Boundaries

| Boundary | Description |
|----------|-------------|
| local source photo → publicly deployed static asset | A personal phone/camera file crosses from the user's machine into a world-readable static site |
| repo → git history | A binary added here is permanent and public in the repository |

## STRIDE Threat Register

| Threat ID | Category | Component | Severity | Disposition | Mitigation Plan |
|-----------|----------|-----------|----------|-------------|-----------------|
| T-pzm-01 | Information Disclosure | `public/img/resume-photo.jpg` EXIF payload | medium | mitigate | Generate via sharp without `.withMetadata()` (EXIF/GPS/device tags dropped by default) and gate on `metadata().exif === undefined` in Task 1's automated verify |
| T-pzm-02 | Denial of Service (self-inflicted, client bandwidth) | Resume page image request | medium | mitigate | Never reference the 13MB source from markup; hard size gate of 200KB and 700px long edge in Task 1 verify, plus a grep gate in Task 2 asserting the raw filename appears zero times in `Resume.vue` |
| T-pzm-03 | Tampering | git working tree / commit scope | high | mitigate | Explicit `git add <path>` per task; `git add -A` / `git add .` / `git add public/img` / `git commit -a` forbidden; Task 1 verify asserts the source file's byte size is unchanged and that the sibling sources are not staged |
| T-pzm-SC | Tampering | npm/pip/cargo installs | high | mitigate | Not applicable — no packages are installed by this plan; `sharp` 0.34.5 is already a resolved project dependency (verified loadable during planning) |
</threat_model>

<verification>
- `public/img/resume-photo.jpg` is committed, <= 200KB, <= 700px long edge, EXIF-free.
- `public/img/resume-pic.jpg` byte size is still 13,289,666; `resume-pic2.jpg` and `resume-pic3.jpg` remain untracked and unmodified.
- `npm run lint` passes.
- `git log --stat -2` shows exactly two commits touching exactly two files total — no `.continue/`, `skills-lock.json`, `launch.json`, `Postmortum descriptions.txt`, cpp-sokoban gifs, or `resume-pic*.jpg` swept in.
- Human checkpoint approved.
</verification>

<success_criteria>
The Resume page opens with a correctly-framed circular portrait beside the name and title, at both desktop and sub-620px widths; the page loads a sub-200KB image; the theme, the GameProjects avatar, and every original source photo are untouched; two clean scoped commits.
</success_criteria>

<output>
Create `.planning/quick/260805-pzm-add-resume-pic-jpg-as-profile-photo-on-r/260805-pzm-SUMMARY.md` when done
</output>
