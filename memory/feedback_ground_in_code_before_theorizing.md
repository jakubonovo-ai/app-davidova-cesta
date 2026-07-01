---
name: Ground in the running system before theorizing — and calibrate the answer's weight
description: Anchor every non-trivial answer in the actual code/data FIRST — check what the system already does before proposing theory/options, and sweep code+tests+docs for any fact you change. Lead with the simplest correct answer; ceremony only when the decision genuinely forks.
type: feedback
---

# Rule

Before answering a non-trivial question, **anchor in the running system (code + data) first** — then calibrate the weight of the answer to the real complexity of the problem.

Two failure directions, one root:
- **Under-doing it:** change a fact in one place and leave the same fact stale elsewhere (especially in re-runnable code).
- **Over-doing it:** theorize / present a multi-option decision framework for a problem the system already solves with an existing feature.

The common root is the same: **not grounding in the concrete system before acting.**

**Why (generic):** A reviewer who wants the correct, grounded answer does not want an elaborate analysis. On a fully-specified problem, "more effort" spent on theory and option tables produces a *more elaborate wrong answer*, not a better one. The levers are **direction and calibration**, not horsepower — even a top model on maximum effort fails here if it skips grounding.

# How to apply

1. **Verify against ground truth before concluding.** Grep the feature / read the function / probe the data. Do not reason from docs or memory about how the system behaves — read the code.
2. **Check whether the system already does this.** Before proposing a design or textbook solution, look for an existing mechanism. If one exists, the answer is "here is the existing mechanism + why it didn't fire," NOT a new design. Theory is a footnote, never the headline, when a built feature exists.
3. **When you change a fact/number, sweep all occurrences — code, tests, docs — and fix them together.** A fact must never be right in one place and stale in another. Never offer "leave the stale copy" as an acceptable option.
4. **Lead with the single simplest correct answer.** Present A/B/C options, comparison tables, or canon citations ONLY when the choice genuinely changes what gets done. Match response weight to problem complexity.

One-sentence version: **show what the system really does, then the simplest fix; nuance only when it changes the decision.**

# Related rules
- [[feedback_stop_the_discovery_loop]] — the over-doing sibling on the *execution* side (don't scope-creep mid-card); this rule is the *analysis* side.
- [[feedback_verify_plan_before_coding]] — BEAT-1 grounding; "measure, don't assert."
