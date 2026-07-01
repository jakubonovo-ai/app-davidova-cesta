---
name: Test-first, then wire (selectors / classifiers / scoring rules)
description: For new model selectors / classifiers / scoring rules / routing logic, default to a standalone probe-only Phase 1; production wiring is a separate, explicitly-confirmed later card after the owner reviews the evidence.
type: feedback
---

When a task introduces a new model selector, classifier, scoring function, or routing rule, default to building it as a **standalone probe-only artifact first**: a script that re-implements the rule, runs it against historical / cohort / live data **read-only**, and produces an impact report. NO migration. NO production-pipeline change. NO new permanent tests in the main suite. Production wiring (migration + code change + tests) is a separate, **explicitly-confirmed later card** after the owner reviews the probe's evidence.

**Why (generic):** Bundling "test + wire" into one card makes any "approve this card" answer silently mean "approve wiring into production" — which the owner may not have consented to, and which moots the whole point of staged evaluation. For ML-style work the *separation* between evaluation and deployment IS the point. It is especially dangerous when the system runs against a real user whose feedback loop is the QA mechanism: once new selector logic is live, the next run shows them a different result and reverting costs them a feedback cycle.

**How to apply** — when designing a card that adds a new selector / classifier / scoring rule / routing condition:

1. **Phase 1 (this card)** — a standalone probe script that:
   - re-implements the proposed rule as a function inside the probe (or a test helper, NOT in production modules),
   - evaluates against a frozen cohort, named cases, the full population, a threshold sweep,
   - produces an impact report under `docs_audits/YYYY-MM-DD/`,
   - is fully reversible by deleting the probe + its outputs — no data write, no pipeline change.
2. **Phase 2 — decision point.** The owner reads the report and decides whether to wire.
3. **Phase 3 (only if Phase 2 says yes)** — a separate card: migration + production rewrite + permanent tests + `/deepreview`.

Card titles must say it explicitly: Phase-1 cards say "**probe-only — no production wiring**"; Phase-3 cards say "**wires the Phase-1-validated rule into production**". Companion to [[feedback_stop_the_discovery_loop]] (that rule is about not expanding scope mid-session; this one is about not coupling test + wire in the card *design* in the first place).
