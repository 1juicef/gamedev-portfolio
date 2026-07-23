# Phase 5: Dark Theme Redesign - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-07-23
**Phase:** 5-Dark Theme Redesign
**Areas discussed:** Overlay link color, Color token strategy

---

## Overlay link color

| Option | Description | Selected |
|--------|-------------|----------|
| Light color | Change to a light/white-ish color so links stay legible against the new dark gradient — matches the redesign's white body text | ✓ |
| Accent purple | Use the existing @accentColor (#6C3BAA) or a lighter tint, tying links into the site's established purple brand color | |
| Leave it, land exactly what's written | Don't touch projects.less at all — ship only the two files already changed, even if overlay links end up hard to read | |

**User's choice:** Light color (Recommended)
**Notes:** Exact shade left to Claude's discretion.

---

## Color token strategy

| Option | Description | Selected |
|--------|-------------|----------|
| Formalize as variables | Add the new gradient stops + text color as named Less variables in variables.less, update App.vue/ProjectDetailsOverlay.vue to reference them | ✓ |
| Leave as literals | Land the diff exactly as currently written (hardcoded hex/gradient values in the two files) | |

**User's choice:** Formalize as variables (Recommended)
**Notes:** Motivated by Phase 6 needing a clean, named reference for the dark palette (code-block backgrounds) rather than copy-pasting hex values.

---

## Claude's Discretion

- Exact light shade for the overlay link color (D-01)
- Exact Less variable names for the new palette tokens (D-02)
- Whether Header.vue/Footer.vue need any touch-up (scanned during discussion — no hardcoded colors found, no action expected)

## Deferred Ideas

- Untracked new media assets (additional gifs/screenshots for all 4 projects) — explicitly out of this milestone's scope per the original `/gsd-new-milestone` conversation, not re-raised here.
- "Deploy portfolio to custom domain" pending todo — matched Phase 5 by weak keyword overlap but already correctly tagged `resolves_phase: 7`; confirmed as a false-positive match, not folded into Phase 5.
