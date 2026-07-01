---
name: Deep-review evidence standard — cold subagent, artifact-grounded
description: Post-ship deep-dive review (BEAT 3) must be a COLD-SUBAGENT mechanism with ARTIFACT-grounded evidence (grep / file:line / command output), NOT a warm parent-walk with logical-argument evidence. Self-review by the agent that wrote the code is a known weak signal.
type: feedback
---

**Rule:** the post-ship deep-dive review (BEAT 3 of the 4-beat task cycle) must be a **cold-subagent** mechanism with **artifact-grounded** evidence. The warm parent-walk design is retired.

**Why (generic + canonical):** On one ship, a warm parent-walk produced a full "all CLEAN, declare done" verdict. The *same model in the same session*, when asked the cold-context prompt "what else did you not check when you shipped?", surfaced **6 real gaps in two minutes** — several mapping to existing error categories (cross-consumer drift, invariant breakage). The CLEAN claims had been backed by *logical arguments* ("all three callers benefit identically", "the invariant is documented") instead of *artifacts* (the actual grep, the actual file:line read this turn). That is not "the review missed a few things" — it is "the review was net negative": it cost time, produced false confidence, and only a human's direct challenge surfaced what was missed. The ritual was theater.

**How to apply:**

1. **`/deepreview` spawns a COLD subagent** (`Agent` tool, `subagent_type=general-purpose`). The parent does NOT walk the categories itself.
2. **The subagent briefing MUST embed** the full git diff + the canonical error categories verbatim from [[feedback_senior_dev_deep_dive]] + the evidence standard below + the adversarial framing (default verdict = FOUND-UNCERTAIN; CLEAN must be *earned* by an artifact). The subagent has no memory access — it only knows what the briefing tells it.
3. **Evidence standard (verbatim, no paraphrase):**
   > For every category mark one of:
   > - **NOT APPLICABLE** + one-line reason
   > - **CLEAN** + an *artifact*: a grep command + its actual output, OR a file:line you read this turn + the relevant excerpt, OR a command output. **Logical arguments alone do NOT count as evidence.** Mark FOUND-UNCERTAIN if you cannot produce an artifact.
   > - **FOUND** + file:line + one-line description of the defect.
4. **Parent agent adjudicates** the subagent's table. Cold findings are *evidence*, not orders. Parent verifies real-vs-false-positive, fixes the real ones, documents false positives so the next subagent doesn't re-flag them.
5. **Do NOT re-spawn the cold subagent after small fixes** (tokens aren't free; one round + tests-pass suffices for typical fixes). Second round only when fixes are large (new module, schema change, many files).

**High-stakes escalation (optional extra layer):** for a card touching an irreversible external write, money, or a schema migration, run a second independent review pass on the diff in addition to `/deepreview` — they catch different classes (correctness vs simplification/efficiency/reuse, and an independent orchestration is not "the same reviewer again"). Do NOT escalate every card — that is the meta-tooling bloat [[feedback_meta_tooling_yagni]] warns against. For ordinary cards, `/deepreview` alone is the close.

**What this rule does NOT change:** BEAT 1 (verify plan, value challenge), BEAT 2 (senior-dev style + the categories as a code-shape guide while writing), and BEAT 4 (`/endsession`) are unchanged. `/audit` was already cold-subagent-based; this converges `/deepreview` to the same mechanism — the two now differ only on scope (just-shipped diff vs pre-existing code).

**Companions:** [[feedback_senior_dev_deep_dive]] (the canonical category source of truth) · [[feedback_meta_tooling_yagni]] (this rewrite is itself justified by a concrete regression — the 6-gap warm-walk failure) · [[feedback_stop_the_discovery_loop]] (when subagent findings open new scope, surface a follow-up card, don't expand the in-flight card).
