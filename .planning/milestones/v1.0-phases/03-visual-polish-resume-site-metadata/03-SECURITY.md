---
phase: 03
slug: visual-polish-resume-site-metadata
status: verified
# threats_open = count of OPEN threats at or above workflow.security_block_on severity (the blocking gate)
threats_open: 0
asvs_level: 1
created: 2026-07-23
---

# Phase 03 — Security

> Per-phase security contract: threat register, accepted risks, and audit trail.

---

## Trust Boundaries

| Boundary | Description | Data Crossing |
|----------|-------------|---------------|
| author source → v-html overlay | Dispater `htmlDescription` (hand-authored TS string) rendered via `v-html` in `ProjectDetailsOverlay` | Static, author-controlled HTML — no user or runtime input |
| dev-machine build pipeline | `scripts/convert-media.js` runs ffmpeg/sharp locally at build time | Local media files only, build-time, not part of shipped runtime |
| public metadata → external consumers | `public/index.html` `<head>` metadata served publicly, scraped by social/link-preview crawlers | Intentionally-public marketing metadata (title, description, deploy URL, avatar) |
| static asset → shipped bundle | `Resume.vue`, `App.vue`, `ProjectDetailsOverlay.vue` render static images/CSS from `public/` | No user input, no data fetching |
| (none introduced) | Pure static CSS value changes (03-03, 03-04) | No new input handling, network, or data flow |

---

## Threat Register

| Threat ID | Category | Component | Severity | Disposition | Mitigation | Status |
|-----------|----------|-----------|----------|-------------|------------|--------|
| T-03-01 (03-01) | Tampering | v-html render of Dispater `htmlDescription` (video embed added, later removed by 03-04/G-03-9) | low | accept | Content is a hand-authored static string in TS source, not user-supplied input — no injection vector introduced; mirrors pre-existing SwingSpace overlay pattern | closed |
| T-03-02 (03-01) | Tampering | `scripts/convert-media.js` (ffmpeg/sharp) | low | accept | No new dependency added — manifest-entry addition reusing already-vetted Phase 1 tooling; build-time only, no runtime exposure | closed |
| T-03-SC (03-01) | Tampering | package installs | low | accept | No package installs in this plan | closed |
| T-03-03 (03-02) | Information Disclosure | `public/index.html` OG metadata (site URL, avatar image) | low | accept | Exposed values are intentionally-public marketing metadata — publishing them is the feature; no secrets/PII/credentials in `<head>` | closed |
| T-03-04 (03-02) | Spoofing / Tampering | `og:url` / `og:image` absolute URLs | low | accept | URLs are the confirmed canonical project URL per D-08; `og:image` points at a controlled first-party asset | closed |
| T-03-SC (03-02) | Tampering | package installs | low | accept | No package installs in this plan | closed |
| T-03-01 (03-03) | Tampering | `src/App.vue`, `src/views/Resume.vue` | low | accept | Cosmetic CSS-only edits (`padding-top`, `max-width`); no new attack surface, no packages installed | closed |
| T-03-01 (03-04) | Tampering | `ProjectDetailsOverlay.vue` v-html / `GameProjectsData.ts` htmlDescription | low | accept | Edits are build-time, author-controlled static content (delete one CSS declaration, delete one `<video>` block); no user-input path introduced or widened | closed |

*Status: open · closed · open — below `high` threshold (non-blocking)*
*Severity: critical > high > medium > low — only open threats at or above workflow.security_block_on (`high`) count toward threats_open*
*Disposition: mitigate (implementation required) · accept (documented risk) · transfer (third-party)*

All 8 threats across plans 03-01–03-04 carry an `accept` disposition documented at plan-authoring time, all severity `low` (below the `high` block threshold). No `mitigate`-disposition threats were left unimplemented. Register authored at plan time for all 4 plans (ASVS level 1 — grep-depth verification sufficient; no auditor spawn required per short-circuit rule).

---

## Accepted Risks Log

| Risk ID | Threat Ref | Rationale | Accepted By | Date |
|---------|------------|-----------|-------------|------|
| AR-03-01 | T-03-01, T-03-02, T-03-SC (03-01) | Static, author-controlled HTML/build-tooling changes; no injection vector, no new dependency | Plan-time (03-01-PLAN.md) | 2026-07-22 |
| AR-03-02 | T-03-03, T-03-04, T-03-SC (03-02) | Publicly-intended marketing metadata; no secrets/PII exposed | Plan-time (03-02-PLAN.md) | 2026-07-22 |
| AR-03-03 | T-03-01 (03-03) | Cosmetic CSS-only value changes | Plan-time (03-03-PLAN.md) | 2026-07-22 |
| AR-03-04 | T-03-01 (03-04) | Cosmetic CSS/markup deletions, build-time author-controlled content | Plan-time (03-04-PLAN.md) | 2026-07-23 |

---

## Security Audit Trail

| Audit Date | Threats Total | Closed | Open | Run By |
|------------|---------------|--------|------|--------|
| 2026-07-23 | 8 | 8 | 0 | Claude (gsd-secure-phase, short-circuit: threats_open=0, register_authored_at_plan_time=true, asvs_level=1) |

---

## Sign-Off

- [x] All threats have a disposition (mitigate / accept / transfer)
- [x] Accepted risks documented in Accepted Risks Log
- [x] `threats_open: 0` confirmed
- [x] `status: verified` set in frontmatter

**Approval:** verified 2026-07-23
