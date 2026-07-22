---
status: testing
phase: 03-visual-polish-resume-site-metadata
source: [03-VERIFICATION.md]
started: 2026-07-22T22:10:00.000Z
updated: 2026-07-22T22:10:00.000Z
---

## Current Test

number: 1
name: Timeline restraint + click-affordance read
expected: |
  Run `npm run serve`, open /game-projects: rows read tighter/more restrained (48px desktop / 32px mobile row rhythm, 2.1em titles), project titles show a visible underline before hovering, and the underline brightens to #f4cde6 on hover/keyboard focus. Alternating left/right rows (Dispater, SwingSpace reversed) are intact.
awaiting: user response

## Tests

### 1. Timeline restraint + click-affordance read
expected: Run `npm run serve`, open /game-projects: rows read tighter/more restrained (48px desktop / 32px mobile row rhythm, 2.1em titles), project titles show a visible underline before hovering, and the underline brightens to #f4cde6 on hover/keyboard focus. Alternating left/right rows (Dispater, SwingSpace reversed) are intact.
result: [pending]

### 2. Dispater timeline/overlay asset swap playback
expected: On the timeline, hover/click Dispater's thumbnail, then click through to the overlay. Dispater's timeline thumbnail plays the DispaterGif content (not DispaterGif2). Opening the overlay shows the DispaterGif2 gameplay clip playing as a video alongside the existing screenshots and YouTube trailer.
result: [pending]

### 3. Social-preview card rendering
expected: Once deployed, paste https://1juicef.github.io/gamedev-portfolio/ into a link-preview debugger (or share it in Discord/Slack). The card shows title "Josef — Game Developer Portfolio", the locked description, and the avatar image — not a broken/blank image or the old mywebsite.com placeholder.
result: [pending]

### 4. Resume page centered layout
expected: Run `npm run serve`, visit /resume. A single centered resume image (actualResume.png) fills the column up to its width cap, with no download button, no click-to-enlarge, and no extra chrome.
result: [pending]

## Summary

total: 4
passed: 0
issues: 0
pending: 4
skipped: 0
blocked: 0

## Gaps
