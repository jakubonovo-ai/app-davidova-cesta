---
name: deepreview
description: Post-ship deep-dive review — spawns a COLD subagent (fresh-context Claude) to walk the canonical error categories from `memory/feedback_senior_dev_deep_dive.md` against just-shipped code. The subagent must back every CLEAN claim with a tool-output artifact (grep / file:line / command). The parent agent judges the findings, fixes the real ones, then runs `/endsession`. Cold-subagent design — warm self-review by the author is a known weak signal.
---

# /deepreview — Cold-Subagent Post-Ship Review

## What this skill is

The mechanical home for the **post-ship deep-dive** beat of the 4-beat task cycle:
```
1. verify plan       → memory/feedback_verify_plan_before_coding.md
2. write code        → senior-dev style per memory/feedback_senior_dev_deep_dive.md
3. /deepreview       → THIS SKILL (cold subagent)
4. declare done      → only after the parent has fixed the real findings
```
The canonical named-error categories live in `memory/feedback_senior_dev_deep_dive.md`. This skill **spawns a cold subagent** to walk them against just-shipped code, because warm self-review by the agent that wrote the code is a known weak signal (see `memory/feedback_deepreview_evidence_standard.md`).

## When to use
After tests are green for non-trivial code (new feature, migration, helper, schema change, refactor across consumers), and BEFORE declaring the task done or running `/endsession`.

## When NOT to use
- Single-line edits, typo fixes, comment additions — proportionate review only.
- Probe scripts / one-off queries — speed over rigour.
- Tests themselves (they ARE the verification).
- Cold review of pre-existing scope you didn't write this session — use `/audit` (same cold-subagent mechanism, different scope: existing code vs just-shipped diff).

## How to invoke
`/deepreview` — no arguments. The skill reads `git status` + `git diff` to scope the change, loads the canonical categories, then delegates the review to a cold subagent.

---

## Step 1 — Scope the change (parent agent)
1. `git status` — list modified / added / deleted files this session.
2. `git diff` — capture the actual change (parent must read this; the subagent gets it via the briefing).
3. Identify migrations applied + test-count delta if known.
Write a one-paragraph scope summary for the briefing.

## Step 2 — Load canonical categories (parent agent)
Read `memory/feedback_senior_dev_deep_dive.md` ("Named error categories to review against"). Extract the list verbatim — including any new categories. **Do not rely on a hardcoded count in this skill; the memory is the source of truth.** The skill MUST embed the full category text in the briefing (the subagent has no memory access).

## Step 3 — Spawn the cold subagent (parent agent)
Use the `Agent` tool with `subagent_type=general-purpose`. The briefing MUST include:
1. **Scope summary** (Step 1): files touched, tests added, migrations applied.
2. **The full git diff** of this session's changes — pasted inline, not referenced.
3. **All categories verbatim** from the memory — pasted inline.
4. **The BEAT 1 critique notes** (the pre-coding self-challenge), so the subagent can verify each named concern was followed through.
5. **The evidence standard (verbatim, no paraphrase):**
   > For every category mark one of:
   > - **NOT APPLICABLE** + one-line reason
   > - **CLEAN** + an *artifact*: a grep command + its actual output, OR a file:line you read this turn + the relevant excerpt, OR a command output. **Logical arguments alone do NOT count as evidence.** Mark FOUND-UNCERTAIN if you cannot produce an artifact.
   > - **FOUND** + file:line + one-line description of the defect.
6. **The output contract:** a markdown table, one row per category, plus a verdict line. No prose summary — the parent does the synthesis.
7. **The adversarial framing:** the subagent's job is to *falsify* CLEAN claims, not produce them. Default verdict = FOUND-UNCERTAIN; CLEAN must be earned by an artifact.
8. **Read-only constraint:** the subagent must NOT modify files, run writes, commit, push, or call external services. It can read, grep, run read-only probes / SELECTs / test collection. Anything else is a violation.

## Step 4 — Receive the table (parent agent)
The parent's job is **NOT to rubber-stamp** it. For each row:
- **NOT APPLICABLE** → accept.
- **CLEAN with artifact** → accept.
- **FOUND-UNCERTAIN** → parent verifies (real defect / false positive / insufficient info). If real, treat as FOUND; if false, document why so the next subagent doesn't re-flag.
- **FOUND** → parent verifies the defect exists, decides fix-now vs queue-as-follow-up, then acts.
The parent is the **judge**; the subagent is the **investigator**. Findings are evidence to weigh, not orders.

## Step 5 — Fix real findings (parent agent)
- **Data-integrity / audit-log / downstream-data-effect categories** (the ones your project marks as core — e.g. destructive writes, retry-overwrite, cross-consumer drift, invariant breakage, audit-log gap, downstream data-effect) → **DO NOT declare done.** Fix-now or spawn a follow-up card with the owner's explicit confirmation.
- **Other categories** → triage with the owner: fix-now / defer / accept.
Re-run targeted tests after fixes. **Do NOT re-spawn the cold subagent** unless the fixes are large (new module, schema change, many files) — for typical small fixes the parent's eyes + the suite suffice.

## Step 6 — Surface + declare done
Show the owner: the subagent's findings table (evidence of the pass), the parent's adjudication (accepted / false-positive + why / fixed in-session), and the decision: DECLARE DONE / FIX-NOW BEFORE DECLARE / QUEUE-AS-FOLLOW-UP. Then run `/endsession` if the decision is DECLARE DONE.

---

## Anti-patterns
- **DO NOT walk the categories yourself in the parent context.** If you find yourself writing "Cat 3 — CLEAN — three callers benefit identically", STOP and spawn the subagent. Logical-argument evidence in the parent's voice is exactly the failure mode this skill exists to prevent.
- **DO NOT skip the briefing artifacts.** Subagent without the diff = useless; without the categories = generic; without the evidence standard = warm-walk-quality output.
- **DO NOT rubber-stamp the table.** Step 4 (parent judgement) is the value-add — a subagent can be wrong (false positives, hallucinated file:line refs).
- **DO NOT spawn a second cold subagent after small fixes.** One cold review + tests-pass is sufficient for typical fixes.
- **DO NOT run on trivial work.**
