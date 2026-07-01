---
name: Stop the discovery loop (no scope-creep via investigation)
description: When investigation reveals a deeper problem than the card scoped, STOP scope-extending. Default to "ship the planned scope; spawn a separate card for the deeper finding." Override only when the deeper finding makes the original card useless (rare).
type: feedback
---

# Rule

When verify-before-code or in-session investigation reveals a problem deeper than the card scoped, **STOP scope-extending.** Default: ship the originally-scoped work; spawn a separate card for the deeper finding. Override ONLY when the deeper finding makes the original card useless (rare).

**Why (generic):** Scope creep via investigation is the root cause of the patches nobody wants. Each "while we're in here, let me also fix..." touches code with its own design and tests. Multiple half-fixes layered together become the patches the next refactor has to peel back.

# How to apply

- **Time-box deep-dive analysis to about an hour.** If a decision isn't in reach, the right answer is "ship the smallest useful thing + spawn a follow-up card with the discovery written into its body." Don't spend a second hour designing the perfect comprehensive fix inside the original card's session.
- **Override only when the deeper finding makes the original card useless** (its premise is refuted; the planned fix won't work for anything). State the override in one sentence: "I am extending scope because X makes the original card useless." If you can't make that case in one sentence, don't extend.
- **When you spawn the follow-up card**, include the discovery context + a pointer to whatever surfaced it, so a cold next session can pick it up without re-running the analysis.
- **Pause and surface** when scope-extension is tempting on a HIGH/critical-path card — patches there are more expensive than elsewhere.
- **Distinguish "patching" from "completing the planned scope":** the dividing line is "did the original spec contemplate this?" If yes → finish the work. If no → spawn a card. (Example: the spec said "add tests for the sparse case" and the synthetic data needs a longer span than first written — that is COMPLETING scope. The spec said "fix the detector" and investigation shows a gate also needs lowering — that is PATCHING, out of scope.)

# Related rules
- [[feedback_verify_plan_before_coding]] — BEAT 1a surfaces the deeper problem; this rule governs what to do about it.
- [[feedback_beat1_value_challenge]] — BEAT 1b gate at card start; this applies during execution.
- [[feedback_ground_in_code_before_theorizing]] — the *analysis*-side sibling (don't theorize past the grounded answer).
