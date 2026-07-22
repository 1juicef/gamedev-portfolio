---
status: diagnosed
phase: 03-visual-polish-resume-site-metadata
source: [03-VERIFICATION.md]
started: 2026-07-22T22:10:00.000Z
updated: 2026-07-22T22:32:32.000Z
---

## Current Test

[testing complete]

## Tests

### 1. Timeline restraint + click-affordance read
expected: Run `npm run serve`, open /game-projects: rows read tighter/more restrained (48px desktop / 32px mobile row rhythm, 2.1em titles), project titles show a visible underline before hovering, and the underline brightens to #f4cde6 on hover/keyboard focus. Alternating left/right rows (Dispater, SwingSpace reversed) are intact.
result: pass

### 2. Dispater timeline/overlay asset swap playback
expected: On the timeline, hover/click Dispater's thumbnail, then click through to the overlay. Dispater's timeline thumbnail plays the DispaterGif content (not DispaterGif2). Opening the overlay shows the DispaterGif2 gameplay clip playing as a video alongside the existing screenshots and YouTube trailer.
result: pass
note: "Overlay video uses controls/click-to-play (matches existing SwingSpace pattern), not autoplay — confirmed intentional, not a bug."

### 3. Social-preview card rendering
expected: Once deployed, paste https://1juicef.github.io/gamedev-portfolio/ into a link-preview debugger (or share it in Discord/Slack). The card shows title "Josef — Game Developer Portfolio", the locked description, and the avatar image — not a broken/blank image or the old mywebsite.com placeholder.
result: blocked
blocked_by: other
reason: "Site not deployed yet — no live URL to test the social preview against. User also reported they purchased the custom domain www.josefubaka.com and wants to deploy there instead of the GitHub Pages project URL (D-08's og:url/og:image target); captured as a follow-up todo, not a Phase 3 gap."

### 3. Social-preview card rendering
expected: Once deployed, paste https://1juicef.github.io/gamedev-portfolio/ into a link-preview debugger (or share it in Discord/Slack). The card shows title "Josef — Game Developer Portfolio", the locked description, and the avatar image — not a broken/blank image or the old mywebsite.com placeholder.
result: [pending]

### 4. Resume page centered layout
expected: Run `npm run serve`, visit /resume. A single centered resume image (actualResume.png) fills the column up to its width cap, with no download button, no click-to-enlarge, and no extra chrome.
result: issue
reported: "The resume png should move down a little bit — it's currently too far up on the page."
severity: cosmetic

### 5. Site-wide horizontal spacing
expected: Page content reads with intentional, balanced horizontal margins — not excessive dead space on the left/right on any page.
result: issue
reported: "A bit too much dead space to the left and right of all pages."
severity: cosmetic

## Summary

total: 5
passed: 2
issues: 2
pending: 0
skipped: 0
blocked: 1

## Gaps

- gap_id: G-03-4
  truth: "A single centered resume image (actualResume.png) fills the column up to its width cap, with no download button, no click-to-enlarge, and no extra chrome."
  status: failed
  reason: "User reported: the resume png should move down a little bit — it's currently too far up on the page."
  severity: cosmetic
  test: 4
  root_cause: "src/views/Resume.vue's .resume-page uses align-items: flex-start with no top margin/padding on .resume-page or .resume-image at any breakpoint; combined with .main's zero top padding on desktop (src/App.vue), the image renders flush against the header with no vertical breathing room."
  artifacts:
    - path: "src/views/Resume.vue"
      issue: ".resume-page/.resume-image lack top spacing (align-items: flex-start, no margin-top/padding-top)"
  missing:
    - "Add top spacing scoped to the resume page only (e.g. margin-top on .resume-image, or padding-top/align-items: center on .resume-page) — do not touch global .main padding, which is shared by all routes"
  debug_session: .planning/debug/g-03-4-resume-image-position.md
- gap_id: G-03-5
  truth: "Page content reads with intentional, balanced horizontal margins — not excessive dead space on the left/right on any page."
  status: failed
  reason: "User reported: a bit too much dead space to the left and right of all pages."
  severity: cosmetic
  test: 5
  root_cause: "src/App.vue's desktop media query (min-width: 620px) applies '.main, .header, .footer { max-width: 1280px; margin: 0 auto; }' — one global rule capping every route's content at a fixed 1280px centered column, leaving large symmetric empty space on wider desktop viewports (~320px/side at 1920px). No decision log entry indicates 1280px was a deliberate choice for this milestone — reads as an inherited template default."
  artifacts:
    - path: "src/App.vue"
      issue: ".main, .header, .footer max-width: 1280px is too narrow for common desktop viewports, reads as excessive side margins"
  missing:
    - "Increase max-width (e.g. 1440-1600px range) and/or reconsider the fixed 48px side padding at the desktop breakpoint so the column reads balanced, not narrow-and-centered"
  debug_session: .planning/debug/g-03-5-sitewide-horizontal-spacing.md
