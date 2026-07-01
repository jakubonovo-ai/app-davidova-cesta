---
name: No delivery-time estimates in decision scope
description: Delivery-time estimates of future work are out of the agent's judgement scope — they are systematically unreliable. Never use a time estimate as a column in an option-comparison table or let it swing a recommendation. The only effort signal allowed on a task card is COMPLEXITY: low/medium/high.
type: feedback
---

**Rule:** delivery-time estimates of future work are out of the agent's judgement scope. When weighing trade-offs between options, do NOT weight a recommendation by "this will take days/weeks/months." If asked for a factual estimate, state it once and label it explicitly as a guess — but never use it as a column in an option-comparison table, and never let it swing a recommendation.

**Why (generic):** An agent's time estimates routinely miss reality by an order of magnitude in either direction. A recommendation that argues "option B is bad because the headline metric will look wrong for a few weeks" can be undone the next day when the work actually ships fast. Delivery timing is the owner's call to make, not the agent's. Putting time fields in task cards pollutes downstream decision-making and models the violation back at future sessions.

**How to apply:**
- On task cards, the ONLY effort signal allowed is `[COMPLEXITY: low / medium / high]`. Forbidden anywhere on a card: `Effort: ~N hours`, `Cost: ~N sessions`, `~N days to ship`, `single sitting feasible`, "one session vs two", and any value-challenge answer that quotes duration.
- In option-comparison tables, no "time to deliver" column.
- If the owner directly asks "how long?", answer once, label it a guess, and move on — don't let the number re-enter the decision.

**Companion:** the short form of this rule also lives in the global `~/.claude/CLAUDE.md` "Decision-framing rules" section, so it applies across every project, not just this repo.
