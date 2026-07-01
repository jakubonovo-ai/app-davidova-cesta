---
name: Senior developer approach — cleanest, future-proof, deep-dive every task
description: Engineering rule — for every non-trivial task, write code like a senior developer would, choose the cleanest approach (often revert-and-restart over patching a wrong design), and run a cold-subagent deep-dive review for future-proofing gaps. Includes an explicit checklist of named error categories — name them, don't just hope for them.
type: feedback
---

For every non-trivial task: write code like a senior developer would, pick the structurally cleanest approach (which often means reverting wrong-headed work and restarting from a verified spec rather than patching the existing scaffolding), and run a critical deep-dive review BEFORE declaring done. The deep-dive must explicitly NAME the categories of future error it reviews against — not "I'll think about edge cases" but "here are the specific error patterns I'm checking, here's whether each applies, here's the verdict."

**Workflow location — this is BEAT 2 + 3 of the 4-beat cycle:**
```
1. Verify plan       → feedback_verify_plan_before_coding.md
2. Write code        → senior-dev style per THIS memory (the categories below)
3. Deep-dive review  → /deepreview (spawns a COLD subagent)
4. Declare done      → only after the parent has adjudicated the cold review
```

**BEAT 3 mechanism:** `/deepreview` does NOT walk the categories in the parent context. It spawns a cold subagent with: the git diff + the categories below verbatim + the evidence standard (artifact required; logical argument insufficient) + the adversarial framing (default verdict = FOUND-UNCERTAIN; CLEAN must be earned by an artifact). The parent adjudicates. **Self-review by the agent that wrote the code is a known weak signal** — see [[feedback_deepreview_evidence_standard]].

The categories below are the **canonical source of truth.** `/deepreview` embeds them verbatim in the subagent briefing every invocation (the subagent has no memory access — only the briefing). `/audit` references them as a category lens. When categories evolve, update THIS file first.

---

## How to apply

For every non-trivial task — anything beyond a single-file edit or single-function fix:

1. **Verify the plan against the spec before any code** (per [[feedback_verify_plan_before_coding]]). Don't trust the spec uncritically — challenge it.
2. **Write code in the senior-developer style** — see § Code-shape guidance below.
3. **After tests pass, run the deep-dive against the named-error checklist.** Walk every category; mark applicable / not; record findings.
4. **Surface findings as a structured list** before declaring done. The pattern is "here are N categories the cold subagent checked, M had findings, here's what I changed and why."
5. **If a category surfaces a real issue, it's almost always cheaper to revert and restart from the verified spec than to patch the wrong-headed scaffolding** — provided the work is uncommitted and has no callers. Clean architecture > preserved work.
6. **Repeat until clean.** Multiple deep-dive passes per task is normal; each surfaces the next layer.

---

## Named error categories to review against (the explicit checklist)

Each answers "what kind of future bug does this prevent?" Walk them all on every
non-trivial task. Mark applicable / not; record findings.

**Tailored to the Dávidova cesta stack** (offline HTML + CSS + JS app projected on a
wall at a kids' camp; no server, no build, no framework, no network; progress in
`localStorage`; 5 locations unlock strictly in sequence, one per day). Last reviewed
2026-07-01.

### Anti-spoiler / content sequencing (the project's north-star risk)

1. **Future-content leak into the DOM (BR-003)** — a location that is NOT yet completed
   (states `uzamknuta`/`aktivna`) must never inject its symbol image, its location name,
   or any `alt`/`title`/text revealing it. **The location names ARE the passwords**
   (day 4's location "Jaskyňa" is literally the password `JASKYŇA`), so a leaked name is a
   leaked answer. Check every render branch: for a non-completed stop, prove no `img.src`,
   `alt`, `title`, or text node carries the name/symbol. This is the single most important
   category — a spoiler is a real defect here.
2. **Sequence-integrity** — locations unlock strictly in order, exactly one per day, no
   scoring. Check: can any state path (demo hardcode, localStorage value, off-by-one) mark
   day N+1 active/done while day N is still locked? The "active" stop is the ONLY unlockable
   one; all later stops stay locked.

### Offline / `file://` robustness

3. **`file://` incompatibility** — the app must run by double-clicking `index.html` with no
   server and no internet. Check: no ES modules (`type="module"`), no `fetch`/XHR, no CDN or
   absolute `http(s)` URLs, no web-font pulled from the network — only relative paths and
   local assets. Anything that needs a server is a defect.
4. **Asset-path exactness (case-sensitive)** — every `src`/`url()` must match the real
   filename in `app_images/` exactly, including case and extension (GitHub Pages is
   case-sensitive: `MAPA.jfif` ≠ `mapa.jfif`). A typo shows a broken image on the wall.
   Check: grep every asset reference and confirm the file exists with that exact name.

### State & persistence (`localStorage`)

5. **Storage key/shape stability** — the key `davidovaCesta.v1` and its object shape
   (`{verzia, dokonceneDni, koniecVideny}`) must not silently change once the leader has real
   saved progress; any shape change needs an explicit versioned migration. Save must happen
   BEFORE the unlock animation so a refresh mid-animation restores a consistent state (EC-003).
6. **Storage-unavailable fallback** — `localStorage` can throw or be blocked (incognito,
   privacy settings). Reads/writes must be guarded (try/catch or in-memory shim) so the app
   never crashes on the projector. Check: is every `localStorage` access wrapped?

### Password matching

7. **Password-normalization correctness** — comparison must ignore diacritics, case, and
   extra/edge whitespace (NFD + strip marks + lowercase + trim + collapse inner spaces), so a
   correct answer is never rejected for cosmetic reasons. Boundary: empty field submits
   nothing; double-click / repeated Enter must not double-fire the unlock.

### Projector / display

8. **16:9 integrity & legibility** — the stage must stay exactly 16:9 without distortion or
   crop across window sizes (backing images are 1672×941 = 16:9, so `object-fit: fill` is
   distortion-free ONLY while the stage is truly 16:9 — verify the scaling math). Key text
   ≥48px, high contrast, readable from across a room.

### Code shape

9. **Data-driven, not copy-pasted per day** — the 5 days are one config array rendered by one
   renderer + one state machine. Check: no per-day duplicated branch that can drift when one
   day's password/symbol/position changes.
10. **Naming collisions / clarity** — a local variable colliding with a config field name or a
    DOM `id`. When ambiguous, rename or comment the distinction.
11. **Premature abstraction** — YAGNI. Config keys, flags, or helpers for features not yet
    built (sound layer, later phases) are dead weight until they have a consumer. Flag stubs
    with no caller in shipped code.

### Boundary / robustness

12. **Boundary / empty / null / missing-element safety** — for any modified function, walk the
    boundary inputs: `getElementById` returning `null` (id typo / element on the other screen),
    an asset that fails to load (`onerror`), empty password field, refresh mid-animation, rapid
    double-click on unlock. For each, name the safety net (guard / default / disabled button) by
    file:line, or prove the existing one still catches it.

### Cross-task / phasing

13. **Phase dependency documented, not implicit** — if a later phase depends on this phase's
    output (the config shape, the state-machine states, the `localStorage` keys), that
    dependency belongs in the `tasks/` card body, not memory-only, so a future session doesn't
    ship the dependent phase against a changed contract.
14. **Single-sourced facts** — a fact that lives in two places drifts. Passwords, the chest code
    `13177`, the day↔symbol↔digit mapping, and stop positions must each have ONE home; when a
    value changes, grep every occurrence and update together.

---

## Code-shape guidance — how a senior dev writes this

- **Pure-function core, I/O wrapper.** Test the pure function in isolation with synthetic data; the wrapper handles fetch/orchestration/I-O.
- **Test-driven for the pure function.** Write the tests first; they prove the contract before orchestration is built around it.
- **Reuse existing dependencies before adding new ones.**
- **Single responsibility per helper.** Audit-log, state-transition, and snapshot are three concerns → three helpers.
- **No CLI flags for hypothetical use cases.** If the script always writes the report, it always writes it; don't add `--no-report` on speculation.
- **No module-level constants for things that should be fields.** A dataclass self-documents; sentinel strings don't.
- **Defensive guards only at system boundaries.** Internal code trusts internal invariants.
- **Update the spec FIRST when scope changes.** The spec is the source of truth, not the chat history.
- **Revert-and-restart over patch-wrong-design** when work is uncommitted with no callers. Sunk cost on a wrong design isn't real cost.
- **No comments stating WHAT the code does** — the names say what. Comments are for WHY: the hidden constraint, the historical reason, the workaround.

---

## When this rule does NOT apply
- Single-line edits, typo fixes, comment additions — proportionate review only.
- Probe scripts, one-off queries, experimental analysis — speed over rigour.
- Tests themselves — write what's needed.
- Mid-task pivots when the owner course-corrects — follow the new direction, re-apply on the next non-trivial unit.

The rule is for non-trivial production code that other consumers will call.
