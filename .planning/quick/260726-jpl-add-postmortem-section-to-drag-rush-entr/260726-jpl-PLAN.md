---
phase: quick-260726-jpl
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - src/data/GameProjectsData.ts
autonomous: true
requirements: [QT-260726-jpl-add-postmortem-section-to-drag-rush-entry]

must_haves:
  truths:
    - Opening the Drag Rush overlay shows a centered "Postmortem" heading positioned below the itch.io badge and above the Technical Overview toggle
    - All four sub-sections (Scope & goals / What went well? / What went wrong? / Takeaways) render as left-aligned body paragraphs with a bold label line
    - The prose matches Josef's authored text word-for-word apart from the nine listed typo fixes
    - The file still parses — `npm run lint` passes (template literal not broken)
  artifacts:
    - src/data/GameProjectsData.ts (Drag Rush htmlDescription extended)
  key_links:
    - New markup uses ONLY existing selectors from src/css/projects.less (`.paragraph`, `.center`, `.dialog-content h3`, `strong`, `br`) — zero new CSS classes, zero edits to projects.less
    - Block lives inside the Drag Rush ProjectData htmlDescription template literal, rendered via `v-html` in ProjectDetailsOverlay.vue
---

<objective>
Add a Postmortem section to the Drag Rush entry in `src/data/GameProjectsData.ts`, using Josef's own written text with only typo fixes applied.

Purpose: Drag Rush already shows *what* the game is (intro, media, About) and *how* it was built (Technical Overview code snippets). The Postmortem adds the reflective layer — scope decisions, the desync bug, and personal growth — in the user's own voice.
Output: One markup block inserted into one template literal. No new components, no new CSS, no new assets.

Single-task by design: this file→overlay path is one layer deep, so the task IS the full vertical slice — a separate tracer task would be byte-identical to this one.
</objective>

<execution_context>
@$HOME/.claude/gsd-core/workflows/execute-plan.md
</execution_context>

<context>
Verified before planning:
- `src/css/projects.less` already styles `.paragraph` (20px vertical margin), `.center` (text-align center), and globally centers `.dialog-content h3`. Nothing new is needed.
- `</strong><br/>` appears **zero** times in the current file — existing `<strong>` uses are inline (`<strong>Drag Rush</strong>`, `<strong>"Good morning rookie!"</strong>`, `<strong>Floor Zero</strong>`). This makes it a safe count-based verify token.
- The inserted text contains no backticks and no `${` — safe inside the TS template literal.
- No new media files → no change needed to `Helpers.preloadImages` in `App.vue`.

Voice constraint (explicit user instruction): Josef rejected a tightened/punchier rewrite in favor of this longer, more personal version. Do **not** rephrase for concision, tone, or "polish".
</context>

## Content to insert (verbatim)

Copy this block exactly as written. Do not retype from memory, do not re-wrap the prose, do not adjust the wording.

```html
    <div class="paragraph center">
        <h3>Postmortem</h3>
    </div>
    <div class="paragraph">
        <strong>Scope &amp; goals</strong><br/>
        The original pitch of Drag Rush was a rhythm / racing game where the player gets further up the leaderboard by defeating opponents. The original idea was that enemies would have different types of weapons the player would be able to pick up and switch between. This was cut due to scope, we felt somewhere along the line that it's more important to have one very satisfying weapon, rather than multiple weapons feeling "meh" and unbalanced.
    </div>
    <div class="paragraph">
        <strong>What went well?</strong><br/>
        The global beat conductor and a beat object were implemented from the very start and made a great foundation of the game. From that point, all objects that we wanted to follow the beat could easily inherit from the beat object interface and start to bounce on the beats we choose. 1/8, 1/4, 1/2 beats did not matter, the object would dance!
    </div>
    <div class="paragraph">
        <strong>What went wrong?</strong><br/>
        On week 6 we started to notice that the longer the game went on, the more the game went in and out of sync with the beat. Unity does not have any default BPM converter, so we had to build our own. It was difficult to decipher where the issue originated because of this. Finally we figured it out. After building a metronome helper function, and doing some more research, it basically came down to that we had to switch all our floats to doubles and start using dsp.Time to get a more precise count on the beats.
    </div>
    <div class="paragraph">
        <strong>Takeaways</strong><br/>
        This was my first ever real game project, not only in group, but overall as well. Previous to this, I had made a simple Snake Game in raylib, but that was it. We had learnt some basics in C# and Unity in previous lectures, but I was still really nervous that I was not going to be able to perform to the degree I wanted to. We were three programmers during this project, Billy and Elmer and me. Both of them had previous experience in programming, which was very comforting. This group project went as smooth as it could have for a group of programmer and artist newbies. We were very coordinated and everyone put their best foot forward and tried their absolute best to get this game to where we wanted. This project made my confidence in my programming and logical thinking skills grow a lot.
    </div>
```

### Typo fixes already applied above (the only deviations from the source text)

| Source | Corrected | Kind |
|--------|-----------|------|
| its more important | it's more important | contraction |
| beat object interface start to bounce | beat object interface and start to bounce | missing word (sentence did not parse) |
| build or own one | build our own | word swap |
| were the issue originated | where the issue originated | homophone |
| the degree I wanted too | the degree I wanted to | homophone |
| group of program and artist newbies | group of programmer and artist newbies | truncated word |
| tried to their absolute best | tried their absolute best | stray word |
| confidence in mt programming | confidence in my programming | keyslip |
| beat object was implemented | beat object were implemented | subject-verb agreement |

Everything else — including "the beats we choose", "We had learnt", "Previous to this" — stays exactly as Josef wrote it. These are voice, not typos.

<tasks>

<task type="auto">
  <name>Task 1: Insert the Postmortem block into the Drag Rush entry</name>
  <files>src/data/GameProjectsData.ts</files>
  <read_first>src/data/GameProjectsData.ts (lines 4-106 — the Drag Rush ProjectData entry)</read_first>
  <action>
In the Drag Rush `ProjectData` htmlDescription template literal, insert the block from the "Content to insert (verbatim)" section of this plan file.

Placement: immediately after the closing tag of the paragraph div that holds the itch.io badge anchor, and immediately before the opening tag of the tech-overview details element. Resulting order within the entry: intro → trailer → screenshots → About this game → itch.io badge → Postmortem → Technical Overview. Rationale: the itch.io call-to-action stays close to the summary, and the two long-form deep-dive sections sit together at the bottom.

Indentation: 4 spaces on the div lines and 8 on their children, matching the surrounding literal.

Do NOT touch: any other project entry, the Drag Rush intro/media/About/badge blocks, src/css/projects.less, Helpers.preloadImages in App.vue, or ProjectDetailsOverlay.vue. No new CSS class names are introduced — reuse of the existing paragraph, center and h3 styling is deliberate.

The heading text uses an escaped ampersand entity in the Scope label; leave it escaped.
  </action>
  <verify>
    <automated>grep -cE 'h3.Postmortem' src/data/GameProjectsData.ts # expect 1</automated>
    <automated>grep -cE 'strong.*br/' src/data/GameProjectsData.ts # expect 4 (the four bold label lines; zero such lines exist today)</automated>
    <automated>grep -Fc 'the object would dance!' src/data/GameProjectsData.ts # expect 1</automated>
    <automated>grep -Fc 'confidence in my programming and logical thinking skills grow a lot.' src/data/GameProjectsData.ts # expect 1</automated>
    <automated>git diff --stat -- src/css/projects.less # expect empty output (no CSS changes)</automated>
    <automated>npm run lint</automated>
    <human-check>Run `npm run serve`, open /game-projects, click the Drag Rush card. Confirm: "Postmortem" heading is centered and sits between the itch.io badge and the Technical Overview toggle; the four bold labels each start their own left-aligned paragraph; text reads as Josef wrote it.</human-check>
  </verify>
  <done>The Drag Rush overlay renders a Postmortem section with four labelled paragraphs between the itch.io badge and Technical Overview; all greps return their expected counts; `npm run lint` passes; `src/css/projects.less` is untouched.</done>
</task>

</tasks>

<threat_model>
## Trust Boundaries

| Boundary | Description |
|----------|-------------|
| htmlDescription string → `v-html` in ProjectDetailsOverlay.vue | Raw HTML is injected into the DOM without sanitization |

## STRIDE Threat Register

| Threat ID | Category | Component | Severity | Disposition | Mitigation Plan |
|-----------|----------|-----------|----------|-------------|-----------------|
| T-QUICK-01 | Tampering (XSS sink) | `v-html` render of GameProjectsData htmlDescription | low | accept | Inserted markup is build-time-static and developer-authored: no script tags, no inline event handler attributes, no href/src, no externally-sourced or user-supplied input reaches this string. Pre-existing sink, not widened by this change. ASVS L1 — accepted. |

No package-manager installs in this plan, so the package legitimacy gate does not apply.
</threat_model>

<success_criteria>
- Drag Rush entry contains the Postmortem block, positioned between the itch.io badge and the Technical Overview details element
- Prose is verbatim Josef, with only the nine table-listed typo fixes applied
- Zero new CSS classes; `src/css/projects.less` unmodified
- No other project entry changed
- `npm run lint` passes
</success_criteria>

<output>
Create `.planning/quick/260726-jpl-add-postmortem-section-to-drag-rush-entr/260726-jpl-SUMMARY.md` when done.
</output>
