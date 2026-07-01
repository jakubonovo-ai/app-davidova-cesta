---
name: Audit the measurement system before believing the measurement
description: Before believing any measured improvement in a cohort/accuracy/benchmark report, audit the measurement infrastructure itself. Wins >= 20% on a mature system are red flags, not green lights.
type: feedback
---

Before believing any measured improvement reported by a cohort report, accuracy benchmark, A/B test, or any quantitative artifact, audit the measurement infrastructure itself. Treat the evaluation system as a probe subject to its own scope-vs-production discipline — not as ground truth.

## How to apply

At **BEAT 1** of any card whose falsifier reads "metric X improves by Y%" or "cost drops by Z" or "accuracy lifts by N":

1. **Identify the measurement system** that will validate the falsifier — the report generator, the backtest, a probe script, a benchmark log.
2. **Ask: does it score the same thing production actually does?** Three common failure modes:
   - **Substitution:** the backtest fits/uses a different model or path than production decides (e.g. a gate misfires and a proxy model is scored instead of the routed one).
   - **Scope mismatch:** the probe's eligibility filter is narrower than production's actual population, so the verdict doesn't generalise.
   - **Loss-function mismatch:** the metric being optimised is not the business cost — two valid metrics can rank the same options in opposite order.
3. **Spot-check the run log** for fallback / proxy / fail events. If a `warning(...fallback...)` fires hundreds of times per run and nobody summarises it, the system is silently degrading in plain sight. A quick `grep -c "fallback"` on the log catches it.
4. **Be skeptical of large wins.** A >= 20% single-card improvement to a *mature* metric (one tuned for weeks) is a red flag. Real wins on well-tuned systems tend to be 2-8%; anything bigger needs an "is this real?" probe BEFORE celebrating.

## Why (canonical, generic)

A celebrated "−26%" improvement once turned out to be measured against a backtest where ~70% of the scored value came from a *proxy* model substituted in when a gate misfired on sparse data — so the by-model comparison was crediting the proxy's numbers to the routed models. The directional finding may have held, but the *magnitude was synthetic*. It surfaced only when someone asked "are we heading the right direction?" and grepped the run log. Several earlier cards had measured their wins against the same contaminated backtest and none re-examined validity.

## How NOT to misapply
- **Don't paralyse on every metric.** Refactors, doc changes, and bug fixes that touch no measurement system are unaffected.
- **Don't re-audit endlessly.** Once a measurement system is audited and the fix shipped, trust it until something material changes (a new model, a new metric, a new routing rule).
- **Don't conflate this with full code review.** This rule is narrowly "does the metric measure what I think it measures." Code-shape review is `/deepreview`'s job.

Pairs with [[feedback_verify_plan_before_coding]] (extends the BEAT-1 walk for any metric-falsifier card) and surfaces as a named category in [[feedback_senior_dev_deep_dive]].
