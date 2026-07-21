# Pitfalls Research

**Domain:** Recruiter-facing game developer portfolio website (redesign of an existing Vue 2 static site)
**Researched:** 2026-07-21
**Confidence:** MEDIUM (web-search-derived guidance, cross-checked across multiple independent sources; project-specific findings below are HIGH confidence — verified directly against files in this repo)

## Critical Pitfalls

### Pitfall 1: The "thumbnail GIF" is the single biggest load-time risk on this site — and the planned fix doesn't fix it

**What goes wrong:**
An oversized GIF used as a project's always-visible timeline thumbnail loads on first paint for every visitor, regardless of whether they ever click into that project. This is different from screenshots inside the click-to-open overlay, which only enter the DOM when opened (this codebase already gates overlay content behind `v-if="visible"` in `ProjectDetailsOverlay.vue` — good). The timeline thumbnail (`iconUrl`) has no such gate.

**Project-specific evidence (verified against files on disk):**
- `public/img/projects/SwingSpaceGIF.gif` — **18.5 MB**, currently wired as the SwingSpace project's `iconUrl` in `GameProjectsData.ts`.
- `public/img/projects/SwingSpaceGIF3.gif` — **17.98 MB** — the file the active requirements say to swap *to* as the new thumbnail. This is essentially the same problem restated: swapping one ~18 MB GIF for another ~18 MB GIF does not address load time at all.
- For reference, the other project thumbnails are static PNGs in the 0.7–2.3 MB range (still large for PNG — see Pitfall 2 — but an order of magnitude smaller than the GIF).
- Web research confirms: a single unoptimized hero/thumbnail GIF in the multi-MB range can dominate total page weight and add multiple seconds of load time on mobile connections; images (including GIFs) are the largest driver of poor Largest Contentful Paint (LCP) on the vast majority of pages measured.

**Why it happens:**
GIF is a poor codec for video-like content (no inter-frame compression), so a screen-capture GIF of gameplay balloons in size very quickly, especially at full resolution/frame rate. It's easy to swap "GIF for GIF" during an asset refresh without re-evaluating the format itself.

**How to avoid:**
- Convert `SwingSpaceGIF3.gif` (and any other gameplay-clip GIF used as a *thumbnail*, not inside an already-lazy overlay) to an autoplaying, muted, looping `<video>` (WebM primary + MP4 fallback) instead of shipping it as a GIF. Research shows this typically yields 85–95% size reduction with equal or better visual quality (a 3.7 MB GIF example dropped to 551 KB MP4 / 341 KB WebM).
- If a GIF must be kept for `<img>` simplicity, at minimum: trim to the display resolution actually rendered by the timeline card (not full source resolution), cap duration to a few seconds, and reduce frame rate/palette — target well under 1–2 MB, not 18 MB.
- Since `iconUrl` values are rendered directly as `<img>` in the timeline (not inside the `v-if`-gated overlay), consider `loading="lazy"` on timeline thumbnails below the fold, and audit `Helpers.preloadImages()` in `App.vue` to make sure nothing this heavy is ever added to the eager-preload list.

**Warning signs:**
- Any file in `public/img/projects/` over ~1–2 MB that is referenced as a project's `iconUrl` (always-visible) rather than only inside `htmlDescription` (click-to-reveal).
- Slow first paint / long blank-timeline period when testing on throttled mobile connection (Chrome DevTools "Slow 4G").

**Phase to address:**
Asset/media optimization phase — should run before or alongside the SwingSpace thumbnail swap task already in scope, since doing the swap without also converting/compressing the asset just relocates the same problem.

---

### Pitfall 2: Screenshot PNGs are shipped at multi-megabyte size across every project

**What goes wrong:**
All four projects' in-overlay screenshots are raw PNGs in the 0.7–2.3 MB range each (e.g. `DispaterSC1.png` 2.2 MB, `DragrushSC3.png` 2.2 MB, `Floor0SC1.png` 1.4 MB). With 4–5 screenshots per project, opening a single overlay can pull in 5–10+ MB of images at once. Because these load on-demand (gated by `v-if`), this doesn't hurt initial page load, but it does hurt the perceived responsiveness of the "click a project → see the goods" moment that is the core interaction of this site.

**Why it happens:**
Screenshots exported directly from OS screenshot tools or game engines are typically saved as lossless PNG at full display resolution with no re-encoding pass. PNG is a poor choice for photographic/rendered-game content (better suited to WebP/optimized JPEG).

**How to avoid:**
- Re-encode all `*SC*.png` screenshots as WebP (or well-compressed JPEG for older-browser safety) at the actual max display width used by `ProjectDetailsOverlay`. This alone typically cuts file size 60–80% with no visible quality loss for photographic content.
- Since `htmlDescription` is raw HTML injected via `v-html`, add `loading="lazy"` directly on the `<img>` tags inside each project's description string in `GameProjectsData.ts` so images below the fold within an open overlay don't all fetch simultaneously.

**Warning signs:**
- Overlay feels sluggish/janky on open, especially on first click of a session (cold cache) or on mobile data.
- Any project screenshot exceeding ~300–500 KB post-optimization should be treated as a regression.

**Phase to address:**
Same asset/media optimization phase as Pitfall 1 — do a blanket pass over every asset in `public/img/projects/`, not just the GIF.

---

### Pitfall 3: Resume-as-image trades away searchability and accessibility for visual control

**What goes wrong:**
The active requirement to replace the hand-coded Resume page with a single `actualResume.png` image is a reasonable design simplification, but it has a real, documented cost: a flat image has no underlying text layer. Screen readers cannot read it, and — more importantly for a job-search site — a visitor cannot select/copy/search the text (e.g. Ctrl+F for a keyword, or copy-pasting contact info into a form). If this image is ever repurposed as an upload for an ATS (applicant tracking system), it will be parsed as a blank page.

**Why it happens:**
Image-as-resume is chosen because it's visually exact (matches a designed PDF/graphic 1:1) and trivial to implement (one `<img>` tag), whereas a text-based/HTML resume requires more careful styling to look equally polished.

**How to avoid:**
- Treat the resume image as a *visual preview*, not the only artifact: keep a genuine downloadable PDF (with a real text layer, not a flattened scan/export-as-image) alongside the on-page image, and link it prominently ("Download PDF").
- At minimum, give the `<img>` a thorough, accurate `alt` text summarizing name/role/key skills so screen readers and SEO crawlers get something, and ensure page `<title>`/meta still contain the person's name and role for searchability even though the resume content itself isn't crawlable.
- Since this is a portfolio site (not itself an ATS submission), the accessibility cost matters more than the ATS cost here — a visually-impaired recruiter or a colleague relying on a screen reader should not hit a dead end.

**Warning signs:**
- No downloadable/copyable resume artifact exists anywhere on the site other than the embedded image.
- Empty or generic `alt` attribute on the resume `<img>`.

**Phase to address:**
Resume page redesign phase — decide the PDF-alongside-image approach as part of that phase's plan, not as an afterthought.

---

### Pitfall 4: "Personality" elements (mascot, hero copy tone) creep past the professional line without a clear boundary

**What goes wrong:**
Sources consistently note that personality overreach — forced humor, over-the-top animation, cutesy copy that reads as scripted rather than natural — is what makes an otherwise-professional portfolio feel unserious to a recruiter doing a fast scan. This project's own stated core value explicitly asks for both traits simultaneously ("read as aesthetically polished and professional within a 10-second scan, while still carrying a distinct sense of personality"), which is inherently a balancing act with no automatic safety net — nothing in the code currently enforces where that line is.

**Why it happens:**
Personality features (an animated running-character mascot, warmer hero copy like "Hello there!") are added incrementally and evaluated in isolation, not against the full page at once, so it's easy to not notice that mascot + gif thumbnails + casual copy + hand-drawn accents compound into an overall tone shift the individual pieces don't show alone.

**How to avoid:**
- Keep personality confined to a small number of deliberate, consistent touches (the mascot in header/footer, one warm opening line) rather than letting it spread into every copy block or visual element — research confirms consistent, restrained personal touches read as more credible than pervasive novelty.
- Do a "recruiter scan" gut check after each personality-adjacent change: view the full page top-to-bottom and ask whether the *dominant* impression in the first 10 seconds is "credible/polished" or "cute/quirky." If quirky wins, dial back.
- Treat the mascot as decorative, not load-bearing for information — never rely on the mascot animation to communicate anything a recruiter needs to understand the projects or resume.

**Warning signs:**
- Copy read-through where humor/cuteness appears in more than the hero and/or footer.
- Any interactive/animated element that blocks or delays a recruiter reaching the core content (project list, resume link).

**Phase to address:**
Hero copy + mascot integration phase — explicitly define "how much personality" as an acceptance criterion (e.g. "mascot appears in header/footer only; hero copy warm but factual; no additional casual copy elsewhere") rather than leaving it to feel.

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|-----------------|------------------|
| Swap GIF-for-GIF (SwingSpaceGIF → GIF3) without re-encoding | Fast, zero new tooling needed | Load-time problem persists unchanged (~18 MB either way) | Never — do the format conversion as part of the same task |
| Ship resume only as a flattened image | Pixel-perfect visual control, one `<img>` tag | No searchable/copyable text, no screen-reader support | Acceptable only if a real text-bearing PDF is also linked alongside it |
| Leave PNG screenshots un-recompressed | No re-export work needed right now | Slower overlay opens, higher bandwidth cost for every visitor | Only acceptable for a very short-lived placeholder, never for final polish pass |
| Add `loading="lazy"` inconsistently (some `<img>` tags, not others) | Quick partial win | False sense of "it's handled"; heaviest assets (thumbnails, first overlay images) often the ones missed | Never — apply uniformly across all project images as a single pass |

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|-----------------|-------------------|
| `Helpers.preloadImages()` in `App.vue` | Adding a large asset (any current or future gif/video) to the hand-maintained eager preload list without checking its size first | Treat any addition to this list as requiring a size check (<~200 KB) before it's allowed in; the whole point of the list is fast-loading assets used across tabs, not heavy per-project media |
| `v-html` rendering of `htmlDescription` | Forgetting that attributes like `loading="lazy"` must be hand-authored into the raw HTML string in the data file (there's no Vue directive magic here) | Explicitly add `loading="lazy"` to every `<img>` tag written inside `GameProjectsData.ts` / `OtherProjectsData.ts` description strings |
| `<video>` elements for gameplay clips | Assuming `loading="lazy"` works on `<video>` the same as `<img>` | It doesn't — native lazy-loading attribute has no effect on `<video>`; if lazy-loading a video is needed, gate it with `v-if`/Intersection Observer instead (the existing overlay's `v-if="visible"` pattern already does this implicitly for anything only rendered on click) |

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|-----------------|
| Un-lazy, un-gated timeline thumbnails | Slow first paint, high total page weight even for visitors who never open an overlay | Keep thumbnails small (compressed WebP/short video) and add `loading="lazy"` for below-the-fold rows | Breaks immediately at current ~18 MB GIF; even a "moderate" 2–3 MB thumbnail per project starts to add up with 4 projects on one timeline |
| Screenshot floods on overlay open | Overlay feels janky/slow on click, especially on mobile data | Compress to WebP, lazy-load below-the-fold images within the overlay | Breaks once a project has more than ~3–4 uncompressed screenshots |
| Autoplaying muted video used broadly | Increased CPU/battery use if multiple looping videos are visible in viewport simultaneously | Pause videos not in view (Intersection Observer), keep to one or two autoplaying elements per screen | Becomes noticeable once more than 1-2 autoplaying loops are on-screen at once |

## Security Mistakes

Not a significant dimension for this project — static site, no user input, no auth, no backend. The one adjacent concern:

| Mistake | Risk | Prevention |
|---------|------|------------|
| Injecting untrusted/user-controlled content via `v-html` | XSS if description strings ever become editable by anyone other than the site owner | Not currently a risk since `htmlDescription` values are hardcoded by the developer in `GameProjectsData.ts` — keep it that way; never wire this to any external/user-submitted input |

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|--------------|-------------------|
| Heavy thumbnail delays the whole timeline rendering | Recruiter's "10-second scan" (the project's own stated success metric) is undermined by the very first thing that loads being the slowest asset on the page | Prioritize the lightest, fastest-loading assets for anything visible without interaction |
| Resume only viewable as an embedded image with no text selection | A recruiter can't quickly copy an email/phone number or search the page for a specific skill keyword | Pair the image with a real linked PDF/text alternative |
| Personality elements not gated behind a clear line | Recruiter's first impression skews "quirky hobby project" rather than "credible shipped work" | Define and stick to a short explicit list of where personality is allowed to appear |
| No visible loading state for heavy overlay content | Click-through feels broken/frozen for a moment on slower connections | Add a lightweight skeleton/spinner state while overlay images decode, especially once WebP/video swaps land |

## "Looks Done But Isn't" Checklist

- [ ] **SwingSpace thumbnail swap:** Often "done" once the file reference changes in `GameProjectsData.ts` — verify the *new* file (`SwingSpaceGIF3.gif` or its replacement) is actually optimized/converted, not just renamed-in at the same ~18 MB size.
- [ ] **Screenshot refresh (Floor0SC1-4):** Often done once file paths point to the new PNGs — verify the new files were also compressed, not just swapped in at native export size.
- [ ] **Resume-as-image:** Often considered done once the image renders on the page — verify `alt` text is meaningful and a real downloadable/searchable resume artifact still exists somewhere.
- [ ] **Lazy loading:** Often assumed "handled" because it's applied to a few images — verify every `<img>`/heavy asset across both timeline thumbnails and overlay descriptions has it, since `v-html` strings need it hand-authored per tag.
- [ ] **Mascot/personality tone pass:** Often evaluated per-component (just the header, just the hero copy) — verify by reading the full page in one pass, since personality overreach usually only becomes visible in aggregate.

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|-----------------|-------------------|
| Oversized GIF shipped to production | LOW | Re-encode/convert with ffmpeg (`gif → webm/mp4`, or re-export a trimmed/lower-fps gif), swap the reference in the data file; no structural changes needed |
| Uncompressed screenshots shipped | LOW | Batch re-export all `public/img/projects/*.png` to WebP with a script/tool, update extensions in data files |
| Resume image shipped with no accessible alternative | LOW-MEDIUM | Add a linked PDF export and meaningful `alt` text; no redesign required |
| Personality tips into unprofessional after launch | MEDIUM | Requires subjective re-review and copy/animation trims across multiple files (hero copy, mascot placement) — cheaper to catch before shipping via the "full page read-through" check above |

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|-------------------|----------------|
| Oversized GIF thumbnail (SwingSpace) | Asset/media optimization phase | Confirm final SwingSpace thumbnail asset is well under 2 MB (ideally a short muted looping video) and page loads fast on throttled mobile test |
| Uncompressed screenshot PNGs | Asset/media optimization phase | Spot-check file sizes of every `public/img/projects/*SC*.png`/`.webp` post-optimization; all should be well under 500 KB |
| Resume-as-image accessibility/searchability | Resume page redesign phase | Confirm a real text-bearing resume artifact (PDF or equivalent) is linked, and `alt` text is descriptive |
| Personality/tone overreach | Hero copy + mascot integration phase | Full-page read-through check: does the first-10-seconds impression stay "credible/professional" with personality as an accent, not the dominant note? |
| Missing lazy-loading on `v-html`-injected images | Visual polish / timeline layout phase | Confirm `loading="lazy"` present on every below-the-fold `<img>` across data files and timeline thumbnails |

## Sources

- [Replace animated GIFs with video – web.dev](https://web.dev/articles/replace-gifs-with-videos)
- [Improve Animated GIF Performance With HTML5 Video — Smashing Magazine](https://www.smashingmagazine.com/2018/11/gif-to-video/)
- [Use video formats for animated content — Chrome for Developers / Lighthouse](https://developer.chrome.com/docs/lighthouse/performance/efficient-animated-content)
- [Reducing the Size of Animated GIFs and Converting Them to WebM or MP4 — Cloudinary](https://cloudinary.com/blog/reduce_size_of_animated_gifs_automatically_convert_to_webm_and_mp4)
- [Optimising GIFs for the Web — bitsofco.de](https://bitsofco.de/optimising-gifs/)
- [Animated GIF Best Practices — SVGator](https://www.svgator.com/blog/animated-gif-best-practices-to-optimize-gifs-like-pros/)
- [Optimize images for Core Web Vitals — corewebvitals.io](https://www.corewebvitals.io/pagespeed/optimize-images-for-core-web-vitals)
- [Accessible Resume Formatting — Recruiteze](https://recruiteze.com/accessible-resume-formatting/)
- [Why PDF Resumes Sometimes Fail in Online Submissions — Resumly](https://www.resumly.ai/blog/why-pdf-resumes-sometimes-fail-in-online-submissions)
- [Can ATS Read PDF Resumes? — Smallpdf](https://smallpdf.com/blog/do-applicant-tracking-systems-prefer-resumes-in-pdf-format)
- [How to Build a Game Developer Portfolio That Gets You Hired — Generalist Programmer](https://generalistprogrammer.com/tutorials/game-developer-portfolio-and-resume-guide)
- [6 Job-killing Mistakes in Game UI/UX Design Portfolios — The Wingless](https://thewingless.com/index.php/2022/05/08/6-job-killing-mistakes-you-are-making-in-your-game-ui-ux-design-portfolio/)
- [How to Add Personality to your Website — Hersted Hertz](https://www.herstedhertz.com/blog/website-personality)
- [4 Ways To Personalize Your Portfolio — Twine](https://www.twine.net/blog/4-ways-personalize-portfolio/)
- Direct file inspection of this repository's `public/img/projects/` directory and `src/App.vue`, `src/data/GameProjectsData.ts`, `src/components/ProjectDetailsOverlay.vue` (HIGH confidence — first-party verification)

---
*Pitfalls research for: recruiter-facing game developer portfolio site redesign*
*Researched: 2026-07-21*
