---
phase: quick-260726-vfp
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - src/data/GameProjectsData.ts
autonomous: true
requirements: [QUICK-260726-vfp]

must_haves:
  truths:
    - "All 12 specified grammar/typo errors are gone from the four Postmortem sections."
    - "Every other word in every edited paragraph is byte-identical to before."
    - "No HTML tag, attribute, class name, or CSS is added, removed, or altered."
    - "The overlay content still renders exactly as before, only with corrected prose."
  artifacts:
    - "src/data/GameProjectsData.ts (modified, 10 lines changed, no lines added or removed)"
  key_links:
    - "htmlDescription template literals stay syntactically valid — no stray backtick or ${ introduced, file still parses as TypeScript."
    - "Postmortem <details class=\"tech-overview\"> block structure unchanged for all four projects."
---

<objective>
Proofreading pass: apply 12 exact, non-overlapping text substitutions inside the four Postmortem sections of `src/data/GameProjectsData.ts` (Drag Rush, Dispater, Floor Zero, SwingSpace).

Purpose: The Postmortem prose is user-facing narrative on a portfolio aimed at game-industry hiring. Typos and agreement errors undercut the "polished and professional in a 10-second scan" core value.
Output: `src/data/GameProjectsData.ts` with exactly 10 lines changed, zero markup changes.

## Fix Table (authoritative — executor applies these verbatim)

Each row is FIND (exact current text) → REPLACE. All 12 are independent, single-occurrence, in-place substitutions. Nothing else in the surrounding paragraph may change.

| # | Location (line) | FIND | REPLACE |
|---|---|---|---|
| 1 | Drag Rush · Scope & goals (~L42) | `This was cut due to scope, we felt somewhere along the line that it's more important` | `This was cut due to scope — we felt somewhere along the line that it's more important` |
| 2 | Dispater · Scope & goals (~L163) | `The upmost goal of this project was to make a 3D game Unreal Engine.` | `The utmost goal of this project was to make a 3D game in Unreal Engine.` |
| 3 | Dispater · What went well? (~L167) | `be able to listen to previous task to know when to activate itself` | `be able to listen to previous tasks to know when to activate itself` |
| 4 | Dispater · What went wrong? (~L171) | `One big takeaway from me, is that if you are going to build a system` | `One big takeaway for me is that if you are going to build a system` |
| 5 | Dispater · Takeaways (~L175) | `Audio and sound is a big passion of mine.` | `Audio and sound are a big passion of mine.` |
| 6 | Floor Zero · What went wrong? (~L219) | `Instead of just falling, I wanted to make this objects actual get destroyed.` | `Instead of just falling, I wanted to make these objects actually get destroyed.` |
| 7 | Floor Zero · What went wrong? (~L219, same line as #6) | `that which would swap itself out with the original mesh in runtime` | `that would swap itself out with the original mesh in runtime` |
| 8 | Floor Zero · Takeaways (~L223) | `that they are not that far from your standard programming practise` | `that they are not that far from your standard programming practice` |
| 9 | SwingSpace · Scope & goals (~L255) | `First game that came to mind was OneMoreLine` | `The first game that came to mind was OneMoreLine` |
| 10 | SwingSpace · What went wrong? (~L263) | `The answer: a leaderboard though Firebase.` | `The answer: a leaderboard through Firebase.` |
| 11 | SwingSpace · Takeaways (~L267) | `what i procrastinate on doing` | `what I procrastinate on doing` |
| 12 | SwingSpace · Takeaways (~L267, same line as #11) | `which I much rather prefer working with` | `which I much prefer working with` |

Note: the em dash in fix #1 is U+2014, matching the em-dash style already used elsewhere in this file (e.g. `A team of 6 — 3 programmers, 3 artists.`).

Note: fix #2 now corrects two errors in the same sentence in one substitution — `upmost`→`utmost` (as originally scoped) plus a missing `in` (`3D game Unreal Engine`→`3D game in Unreal Engine`), added per explicit user request after the plan was first drafted. Row count stays at 12 since both land in the same FIND/REPLACE pair; the "10 distinct lines" line-count arithmetic is unaffected.

Line-count arithmetic: fixes #6/#7 share one source line and #11/#12 share one source line, so 12 fixes land on exactly **10 distinct lines** — this is the structural assertion the verify step leans on.
</objective>

<execution_context>
@$HOME/.claude/gsd-core/workflows/execute-plan.md
@$HOME/.claude/gsd-core/templates/summary.md
</execution_context>

<context>
@.planning/STATE.md
@CLAUDE.md
@src/data/GameProjectsData.ts
</context>

<tasks>

<task type="auto">
  <name>Task 1: Apply the 12 Fix Table substitutions to the Postmortem prose</name>
  <files>src/data/GameProjectsData.ts</files>
  <precondition>`git diff --numstat -- src/data/GameProjectsData.ts` prints nothing (file has no uncommitted changes) — the verify step's 10/10 line-count assertion is only meaningful from a clean baseline. If it prints anything, halt and report.</precondition>
  <action>
    Apply every row of the Fix Table in the `<objective>` above, in order, as exact string replacements using the Edit tool — one Edit call per row, matching the FIND column byte-for-byte and substituting the REPLACE column byte-for-byte.

    This is a proofreading pass, not a rewrite. Do not rephrase, re-punctuate, re-capitalize, or "improve" anything outside the FIND spans, including obvious remaining awkwardness in the same sentence (e.g. row 2's phrasing is intentionally left as-is apart from the single flagged word). If an Edit reports a non-unique or missing match, stop and report which row failed rather than guessing at a looser match.

    Touch no HTML: no tag, attribute, class name, entity, `<br/>`, or `<strong>` boundary moves. Touch no CSS file. Add no comments to the file. Every replacement stays inside the prose of an existing `<div class="paragraph">` within a `<details class="tech-overview">` Postmortem block, so each edit lands on exactly one existing line and adds no new lines.
  </action>
  <verify>
    <automated>
cd "D:/Kodning/Portfolio/gamedev-portfolio" &amp;&amp; F=src/data/GameProjectsData.ts &amp;&amp; fail=0 &amp;&amp;
echo "--- structural: exactly 10 lines changed, one file, no lines added/removed ---" &amp;&amp;
STAT=$(git diff --numstat -- "$F") &amp;&amp; echo "$STAT" &amp;&amp;
[ "$STAT" = "$(printf '10\t10\t%s' "$F")" ] || { echo "FAIL structural: expected '10 10 $F'"; fail=1; } &amp;&amp;
echo "--- corrected text present exactly once each ---" &amp;&amp;
while IFS= read -r s; do [ -z "$s" ] &amp;&amp; continue; n=$(grep -cF -- "$s" "$F"); [ "$n" = "1" ] || { echo "FAIL present($n): $s"; fail=1; }; done &lt;&lt;'NEW'
cut due to scope — we felt somewhere
The utmost goal of this project was to make a 3D game in Unreal Engine.
listen to previous tasks to know when
One big takeaway for me is that if you
Audio and sound are a big passion of mine.
I wanted to make these objects actually get destroyed.
mesh (geometry collection) that would swap itself out
your standard programming practice
The first game that came to mind was OneMoreLine
a leaderboard through Firebase.
what I procrastinate on doing
which I much prefer working with
NEW
echo "--- uncorrected text fully gone ---" &amp;&amp;
while IFS= read -r s; do [ -z "$s" ] &amp;&amp; continue; n=$(grep -cF -- "$s" "$F"); [ "$n" = "0" ] || { echo "FAIL stale present($n): $s"; fail=1; }; done &lt;&lt;'OLD'
scope, we felt
upmost
game Unreal Engine
previous task to know
takeaway from me
sound is a big passion
this objects actual
that which would swap
programming practise
mobile. First game
 though Firebase
what i procrastinate
much rather prefer
OLD
echo "--- markup untouched: tag/class counts identical to HEAD ---" &amp;&amp;
for pat in '&lt;div class="paragraph"' '&lt;details class="tech-overview"&gt;' '&lt;summary&gt;' '&lt;strong&gt;' '&lt;br/&gt;' '&lt;/div&gt;' '&lt;/details&gt;'; do
  a=$(grep -oF -- "$pat" "$F" | wc -l); b=$(git show HEAD:"$F" | grep -oF -- "$pat" | wc -l);
  [ "$a" = "$b" ] || { echo "FAIL markup drift for $pat: now=$a was=$b"; fail=1; };
done &amp;&amp;
echo "--- file still parses / lints ---" &amp;&amp; npm run lint -- --no-fix 2&gt;&amp;1 | tail -5 &amp;&amp;
[ "$fail" = "0" ] &amp;&amp; echo "ALL CHECKS PASSED"
    </automated>
    <human-check>Open the site, expand the Postmortem dropdown on each of the four projects, and confirm the paragraphs still render as normal prose blocks with bold headings intact (no raw HTML leaking, no collapsed formatting).</human-check>
  </verify>
  <done>
    `git diff --numstat -- src/data/GameProjectsData.ts` reports exactly `10	10`; all 12 corrected phrases each appear exactly once; all 12 uncorrected fragments appear zero times; every checked markup pattern has the same count as `HEAD`; lint passes; verify script prints `ALL CHECKS PASSED`.
  </done>
</task>

</tasks>

<threat_model>
## Trust Boundaries

| Boundary | Description |
|----------|-------------|
| `htmlDescription` string → `v-html` in `ProjectDetailsOverlay.vue` | Pre-existing boundary: static author-written HTML is injected unescaped into the DOM. No untrusted or runtime input crosses it. |

## STRIDE Threat Register

| Threat ID | Category | Component | Severity | Disposition | Mitigation Plan |
|-----------|----------|-----------|----------|-------------|-----------------|
| T-vfp-01 | Tampering | `htmlDescription` rendered via `v-html` | low | accept | Edits are prose-only substitutions containing no `<`, `>`, `&`, or `${`; the markup-count check against `HEAD` in Task 1's verify proves zero tag/entity drift, so the existing static-content-only assumption at the `v-html` boundary is preserved. |
| T-vfp-02 | Denial of Service | `GameProjectsData.ts` template literal | low | accept | A stray backtick or `${` would break the build; caught by the `npm run lint` step and by the 10/10 numstat assertion. No runtime exposure. |
| T-vfp-SC | Tampering | npm/pip/cargo installs | n/a | accept | No package-manager install tasks in this plan — no new dependencies added. Package Legitimacy Gate not applicable. |
</threat_model>

<verification>
Run Task 1's automated verify block. It is the whole verification: structural line-count assertion, 12 positive assertions, 12 negative assertions, 7 markup-count assertions against `HEAD`, and lint.

Optional eyeball: `git diff -- src/data/GameProjectsData.ts` should read as 10 sentence-level prose tweaks and nothing else.
</verification>

<success_criteria>
- 12 substitutions applied exactly as specified in the Fix Table
- Exactly one file changed, exactly 10 lines modified, 0 lines added, 0 removed
- Zero markup/CSS/structural changes
- All other prose byte-identical to the previous commit
</success_criteria>

<output>
Create `.planning/quick/260726-vfp-apply-12-grammar-typo-fixes-across-the-f/260726-vfp-SUMMARY.md` when done.
</output>
