---
name: prever
description: Skeptical self-review of YOUR OWN most recent answer / plan / recommendation
  before the user acts on it. Lists the load-bearing assumptions, verifies each against
  ground truth (read the actual code/data/docs or run a READ-ONLY probe — measure, don't
  assert), names what was not considered, and states what changed. Read-only; never writes
  or POSTs. NOT the same as /deepreview (that reviews shipped CODE) — /prever re-examines
  ANY recent answer or plan and verifies it empirically. User-invoked; runs inline so it
  has the full conversation context.
argument-hint: "(optional) a specific claim or area — omit to review the last substantive answer"
---

# /prever — Skeptical review of my own conclusion before acting on it

> The name is the original Slovak ("prever" = "verify it"); rename freely. Translate
> the body to your working language if you like — the mechanism is what matters.

**Workflow position:** `/prever` is **BEAT 1c** of the 4-beat cycle — between 1a/1b (verify-plan + value-challenge) and the owner's "go". It empirically verifies the **load-bearing assumptions** of a plan/recommendation before anyone acts on it. Full trigger patterns: `memory/feedback_verify_plan_before_coding.md` § "BEAT 1c". Also user-invokable any time outside BEAT 1c.

**Complementary relationship:** `/prever` (warm, **before** action — a plan/recommendation) ↔ `/deepreview` (cold subagent, **after** ship, before declare-done — code). Shared discipline: artifact-grounded evidence, measure-don't-assert.

## Step 0 — Is there anything to review?
If there is NO prior substantive answer/plan in the conversation (the skill was invoked cold), **stop and ask**: "What should I verify? Give me a claim, a plan, or an area." Don't invent something.

## Step 1 — Name the target
In one sentence, state what is being verified (which conclusion or planned action is under the microscope).

## Step 2 — List the LOAD-BEARING assumptions
Only the claims that, **if wrong, change the conclusion or the action.** Ignore cosmetics. The test: *would it change what we do next if this were false?* Don't verify trivia.

## Step 3 — Verify each assumption against reality
For each: read the REAL code / data / doc, or run a **read-only** probe (SELECT / read only). **Measure, don't assert.** Mark:
- **VERIFIED** (+ evidence: file:line, query result)
- **FALSE** (+ how it actually is)
- **STILL AN ASSUMPTION** (+ why it couldn't be verified now and what would resolve it)

SAFETY: read only. No write / UPDATE / DELETE, no external POST, never run the project's blocked actions (the MUST-STOP list in `CLAUDE.md`).

## Step 4 — What did I NOT consider?
Name 3-5 concrete gaps through these lenses (drop any that genuinely don't fit): edge cases · downstream impact (blast radius) · irreversibility · a cheaper alternative · the **opposite hypothesis** to the one I argued.

## Step 5 — State what changed
- If verification flips or weakens the conclusion → say so explicitly and correct the answer.
- If nothing changes → **say so plainly.** Don't manufacture doubt or "findings" to look thorough.

## Output format
```
## /prever — <target>

**Verified load-bearing assumptions:**
| Assumption | Verdict | Evidence |
|---|---|---|

**What I did not consider:** <3-5 bullets>

**Verdict:** <what changed, or "no change — the original conclusion holds">
```

## Anti-patterns
- Verifying trivia, or re-running the whole prior analysis.
- Inventing findings / sycophantic doubt when the answer was fine.
- Any write/POST. This skill only reads.
