---
phase: 04
slug: game-jams-section
status: verified
# threats_open = count of OPEN threats at or above workflow.security_block_on severity (the blocking gate)
threats_open: 0
asvs_level: 1
created: 2026-07-23
---

# Phase 04 — Security

> Per-phase security contract: threat register, accepted risks, and audit trail.

---

## Trust Boundaries

| Boundary | Description | Data Crossing |
|----------|-------------|---------------|
| site → external site (itch.io) | Two new outbound `target="_blank"` links from `/game-projects` to third-party itch.io pages, opened in a user-controlled new tab | Outbound navigation only — no data sent, no params, no user input involved |

---

## Threat Register

| Threat ID | Category | Component | Severity | Disposition | Mitigation | Status |
|-----------|----------|-----------|----------|-------------|------------|--------|
| T-04-01 | Tampering (reverse tabnabbing) | New `<a target="_blank">` Game Jam links in `src/views/GameProjects.vue` | low | mitigate | `rel="noopener noreferrer"` added to both anchors, preventing the opened tab from accessing `window.opener`. Verified: `grep -Fc 'rel="noopener noreferrer"' src/views/GameProjects.vue` → 2. | closed |
| T-04-02 | Injection / Tampering (arbitrary href) | The two itch.io `href` values | low | accept | Both `href` values are hardcoded string literals authored directly in the template (`href="https://juice-f.itch.io/the-eldritch-keeper"`, `href="https://superguardian.itch.io/mas-q"`) — no `:href` binding, no route param, no dynamic interpolation, no user-controllable input. | closed |

*Status: open · closed · open — below high threshold (non-blocking)*
*Severity: critical > high > medium > low — only open threats at or above workflow.security_block_on (high) count toward threats_open*
*Disposition: mitigate (implementation required) · accept (documented risk) · transfer (third-party)*

---

## Accepted Risks Log

| Risk ID | Threat Ref | Rationale | Accepted By | Date |
|---------|------------|-----------|-------------|------|
| AR-04-01 | T-04-02 | Arbitrary-href risk accepted: both itch.io URLs are locked string literals with no dynamic interpolation or user input path — there is no mechanism by which this href could be redirected to an attacker-controlled destination. | gsd-secure-phase (register authored at plan time, L1 short-circuit) | 2026-07-23 |

*Accepted risks do not resurface in future audit runs.*

---

## Security Audit Trail

| Audit Date | Threats Total | Closed | Open | Run By |
|------------|---------------|--------|------|--------|
| 2026-07-23 | 2 | 2 | 0 | gsd-secure-phase (L1 short-circuit — register authored at plan time, threats_open: 0, asvs_level: 1; no auditor spawn required per protocol) |

---

## Sign-Off

- [x] All threats have a disposition (mitigate / accept / transfer)
- [x] Accepted risks documented in Accepted Risks Log
- [x] `threats_open: 0` confirmed
- [x] `status: verified` set in frontmatter

**Approval:** verified 2026-07-23
