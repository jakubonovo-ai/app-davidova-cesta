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

**Tailored to the ICS SAQ Reviewer stack** (single-user batch Excel processor +
AI calls via AWS Bedrock + Streamlit UI). Last reviewed 2026-06-17.

### Data integrity (silent misclassification)

1. **Cross-consumer drift after a semantics change** — when a constant, config key, or column name's meaning shifts, every consumer reading it may now be wrong. Grep ALL consumers (batch_processor, Streamlit pages, test_prompt_v2, config_manager), decide per site whether new or old semantics is wanted, and coalesce or rename.
2. **Invariant breakage** — a formerly-true relationship that no longer holds (e.g., "follow_up_col is always one of these N strings", "_extract_assessment_type always returns a key in assessment_rules.json"). Document the invariant change at the affected constant/column.
3. **String-matching fragility** — the system relies on substring `in` checks for assessment types, answer values, and comment keywords. A changed upstream string (GCP export format change, new answer option, trailing whitespace) silently misclassifies. Check: any new or modified string match — is it tested with boundary variants (case, whitespace, partial overlap)?

### Excel I/O robustness

4. **Excel column position drift** — the system assumes specific column indices (K=10, L=11) and exact column names from GCP export. If the upstream export changes column order or renames headers, processing silently writes to wrong cells or crashes. Check: does the change add a new hardcoded column index or name? Is the fallback explicit?
5. **Config file staleness** — scoping matrix, manager mapping, and assessment rules are year-specific JSON files (e.g., `le_scoping_2025.json`). If code references a file that doesn't exist for the current year, it may fail silently or with a cryptic error. Check: does the change add a new config dependency? Is the fallback path explicit and logged?

### AI integration

6. **AI prompt regression** — any change near the AI call path (reviewer, prompt text, pre/post-processing of AI results) could shift acceptance rates unpredictably (v2.3 lesson). Check: does this change touch anything in the chain `_build_prompt()` → `review_entry()` → result parsing → follow_up mapping? If yes, integration test (`scripts/test_prompt_v2.py`) MUST run with live API before shipping.
7. **AI error path handling** — when the AI call fails (timeout, SSO expiry, parse error, unexpected response shape), the row must still get a safe status (flagged for Human Review, never silently pass as OK). Check: what happens to Column K/L when `review_entry()` throws or returns garbage? Grep for `try/except` around the AI call and verify the fallback writes HUMAN_REVIEW.

### Code shape

8. **Naming collisions** — a local variable sharing a name with a constant or column name (e.g., `status` the local vs `StatusValue.OK` the constant vs `'Status'` the column header). When ambiguous, rename the local or comment the distinction.
9. **Premature abstraction** — module-level constants for things that should be fields, config entries for hypothetical use cases, stubs for unbuilt features. YAGNI. If it has no consumer in production or test code, it's dead weight.

### Documentation consistency

10. **Follow-up action message consistency** — Column K messages are consumed by auditors who need to act on them. Every `FollowUpAction` constant must appear in all three docs: `docs/guides/TROUBLESHOOTING.md`, `docs/guides/USAGE.md`, and `docs/validation/VALIDATION_RULES_v2.0.md`. Check: grep for the new string in all three; if missing, add it.

### Test correctness

11. **Mock attribute auto-creation hides false positives** — on a default MagicMock, `obj.new_field` is a truthy mock, NOT None. Tests that branch on `is None` or check truthiness silently take the wrong path. Set fixture defaults explicitly for fields the code branches on.
12. **Shared test fixtures need mass updates** — when test files share a helper like `_make_test_df`, adding a new required column or changing a constant means updating every helper. Grep the fixtures after every field/constant addition.

### Cross-task / phasing

13. **Task dependency chain documented, not implicit** — if card B depends on card A's output (columns, constants, config keys), the dependency must be in card B's body in `tasks/`, not memory-only. Otherwise a future session ships B without A.

### Measurement-system validity

14. **Evaluation-system validity** — the prompt v2.2 metrics (acceptance rate, agreement rate) are the decision-making measurements for this project. When a falsifier claims "metric X improves by Y%", BEAT 1 must verify: is the test harness scoring the same thing production runs? Is the sample representative? Red-flag heuristic: wins >= 20% on a mature metric are suspicious. Full rule: [[feedback_measurement_validity_first]].

### Boundary / robustness

15. **Boundary / zero / empty / null input safety** — for any modified function, walk the boundary inputs: empty string, `"nan"` as text, `None`, NaN (pandas), single-row DataFrame, question with no assessment type prefix, answer with trailing whitespace. For each, identify the safety net (guard / default / fallback) by file:line, or confirm the existing one still catches it. The point is to *prove* the boundary case is covered, not assert it.

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
