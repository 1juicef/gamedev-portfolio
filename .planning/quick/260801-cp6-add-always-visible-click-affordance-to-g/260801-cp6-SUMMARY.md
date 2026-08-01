---
quick_id: 260801-cp6
status: complete
date: 2026-08-01
---

# Quick Task 260801-cp6: Mobile-safe click affordance for timeline cards

## What was built

Added an always-visible "View Details" cue to every game project timeline card in
`src/views/GameProjects.vue`, plus tap/focus/hover response states — so the
affordance works without relying on `:hover`, which touch devices never fire.

- **Always-visible cue**: a pill (accent-coloured border, glow, CSS-drawn arrow,
  white label on a dark translucent fill) rendered over every `.project-image-button`,
  including the hidden WIP row. Fill/label stay hue-agnostic (not accent-filled) because
  a fixed white-on-accent pill fails contrast for lighter `accentColor` values
  (e.g. `cpp-sokoban`'s `#E08E32`).
- **Accent wiring**: each project's `accentColor` (already on `ProjectData`) is piped
  into a `--project-accent` CSS custom property on `.project-row`, so cue border/glow
  and the active/focus ring pick it up per project.
- **Tap/press feedback**: `:active` triggers a scale-down + accent ring + brighten
  on the cue, so a tap visibly registers with no grey browser tap flash.
- **Keyboard parity**: `:focus-visible` gets the same accent ring — this also closes
  a pre-existing gap where `.project-image-button` had no focus style at all.
- **Desktop hover enhancement**: image scale-up layered on top, gated to non-touch/hover-capable viewports.
- **Reduced motion**: `prefers-reduced-motion` keeps colour/glow feedback but drops the scale transforms.

## Commits

- `9dfd617` feat(quick-260801-cp6): add always-visible accent-tied View Details cue
- `439db6e` feat(quick-260801-cp6): add tap, focus, and desktop-hover response states
- merged into `add-game-projects` via `e089843` (merge commit; worktree branch deleted after merge)

## Outstanding: human-verify checkpoint (Task 3 of the plan)

This needs a real device/browser check before calling the feature done — no code
changes are pending on it, it's a visual/tactile judgement call:

1. `npm run serve`, open `/game-projects`.
2. Desktop, mouse away from any card: confirm the "View Details" pill shows over the
   bottom-right of every thumbnail, legible against moving video, including the
   narrower SwingSpace card.
3. Narrow to ~375px (or a real phone on the LAN address): confirm the pill is visible
   with no hover on every card, and stays inside the SwingSpace thumbnail (46% width)
   without spilling past its edge.
4. Touch/emulated touch: press and hold a card image — should shrink slightly, gain a
   purple ring, pill brightens, no grey browser tap flash. Release — details overlay
   should still open.
5. Tab to a card image with the keyboard — same purple ring should appear.
6. Judgement call: does the pill read as deliberate design at a 10-second scan, or a
   sticker bolted on top? Report either way — wording, size, and placement are all
   cheap to change.
