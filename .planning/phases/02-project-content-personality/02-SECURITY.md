---
phase: 02
slug: project-content-personality
status: verified
# threats_open = count of OPEN threats at or above workflow.security_block_on severity (the blocking gate)
threats_open: 0
asvs_level: 1
created: 2026-07-23
---

# Phase 02 — Security

> Per-phase security contract: threat register, accepted risks, and audit trail.

---

## Trust Boundaries

| Boundary | Description | Data Crossing |
|----------|-------------|---------------|
| author content → rendered DOM | Author-authored HTML strings in `GameProjectsData.ts` rendered via `v-html` in `ProjectDetailsOverlay` | Static, author-controlled — no user input crosses this boundary |
| site → external site (itch.io) | Outbound `target="_blank"` links from project overlays to third-party itch.io pages | Link navigation only, no data sent |
| (none new) | 02-02 (checkpoint) and 02-03 (gap closure) introduce no new inputs, endpoints, or dependencies | N/A |

---

## Threat Register

| Threat ID | Category | Component | Severity | Disposition | Mitigation | Status |
|-----------|----------|-----------|----------|-------------|------------|--------|
| T-02-01 (02-01) | Tampering (XSS via v-html) | `GameProjectsData.ts` `htmlDescription` rendered with `v-html` | low | accept | Content is author-controlled static string literals — no user input crosses the boundary; reuses the identical v-html pattern already shipping for all 4 existing blocks | closed |
| T-02-02 (02-01) | Tampering (reverse tabnabbing) | Floor 0's new `<a target="_blank">` without `rel="noopener"` | low | accept | Locked to match the existing Drag Rush/Dispater link pattern exactly per D-07 (consistency requirement); modern browsers imply `noopener` for `target=_blank` since 2021; explicitly deferred to a future polish phase — also flagged as WR-01 in 02-REVIEW.md, same disposition | closed |
| T-02-03 (02-02) | Information (impression risk, not a security threat) | Full-page personality read-through checkpoint | low | accept | Checkpoint itself adds no attack surface; catches tone/boundary regressions pre-ship | closed |
| T-02-01 (02-03) | Tampering | Scoped CSS specificity additions (G-02-3/G-02-4) | low | accept | Overrides are additive and scoped; automated grep + re-UAT confirm intended rules apply without altering global App.vue / shared `.dialog-content a` rules — no injectable surface | closed |

*Status: open · closed · open — below `high` threshold (non-blocking)*
*Severity: critical > high > medium > low — only open threats at or above workflow.security_block_on (`high`) count toward threats_open*
*Disposition: mitigate (implementation required) · accept (documented risk) · transfer (third-party)*

All 4 threats across plans 02-01–02-03 carry an `accept` disposition documented at plan-authoring time, all severity `low` (below the `high` block threshold). Register authored at plan time for all 3 plans (ASVS level 1 — grep-depth verification sufficient; no auditor spawn required per short-circuit rule). T-02-02's reverse-tabnabbing acceptance was independently re-surfaced by 02-REVIEW.md (WR-01) — same disposition holds; not a new finding.

---

## Accepted Risks Log

| Risk ID | Threat Ref | Rationale | Accepted By | Date |
|---------|------------|-----------|-------------|------|
| AR-02-01 | T-02-01, T-02-02 (02-01) | Author-controlled v-html content; `rel="noopener"` gap matches existing sibling-link pattern, deferred to a future polish phase | Plan-time (02-01-PLAN.md) | 2026-07-22 |
| AR-02-02 | T-02-03 (02-02) | Checkpoint-only plan, no code changes, no new attack surface | Plan-time (02-02-PLAN.md) | 2026-07-22 |
| AR-02-03 | T-02-01 (02-03) | Scoped CSS specificity additions, no injectable surface | Plan-time (02-03-PLAN.md) | 2026-07-23 |

---

## Security Audit Trail

| Audit Date | Threats Total | Closed | Open | Run By |
|------------|---------------|--------|------|--------|
| 2026-07-23 | 4 | 4 | 0 | Claude (gsd-secure-phase, short-circuit: threats_open=0, register_authored_at_plan_time=true, asvs_level=1) |

---

## Sign-Off

- [x] All threats have a disposition (mitigate / accept / transfer)
- [x] Accepted risks documented in Accepted Risks Log
- [x] `threats_open: 0` confirmed
- [x] `status: verified` set in frontmatter

**Approval:** verified 2026-07-23
