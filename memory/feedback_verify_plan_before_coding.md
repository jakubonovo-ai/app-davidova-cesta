---
name: Verify the task plan before writing any code
description: For every non-trivial task, run a deep-dive critical verification of the plan BEFORE writing code — surface design choices, ambiguities, scope-vs-spec drift, and missing concerns; then verify the load-bearing assumptions empirically (BEAT 1c, /prever). Wait for go-ahead on the verified plan.
type: feedback
---

For any non-trivial task (anything beyond a single small edit), do NOT start coding until you have run a deep-dive critical verification of the plan and surfaced findings. The verification covers:

- **Spec fidelity** — what does the card spec actually say? Where does my plan drift (scope, tests, deliverable shape)?
- **Design-choice ambiguities** — every priority order, classification preference, fallback chain, default value. List each, justify each, flag the ones with real ambiguity.
- **Schema / API references** — verify every column / field / endpoint name exists in current code, not from memory.
- **Edge cases** — None / 0 / negative / divide-by-zero / state-machine corner / concurrency / multi-tab. Per input.
- **Aggregation semantics** — when summing/averaging: what unit / time-window / NULL handling? State it.
- **Failure modes** — dependency missing, output dir missing, encoding, store unavailable. Per failure.
- **What the user might want that the spec doesn't say** — common adjacent asks. List them, mark in/out of scope.
- **Forward-proofing** — naming collisions, invariant changes, future query-shape gotchas.

Surface all findings as a structured list **before** writing any production code. Wait for go-ahead on the verified plan. Tests + small infrastructure (a probe script, a one-off query) are exempt — those ARE the verification step.

**Why (generic):** Shipping code from an unverified plan repeatedly costs hours of follow-up: a second destructive write-site missed, a retry path that silently overwrites a snapshot, an over-deduction that only surfaces when someone asks "is anything uncertain here?" mid-session. The verification costs ~30 minutes; shipping wrongly-scoped code costs hours plus the risk of latent silent bugs. Do not assume the spec is complete or correct — challenge it.

---

## BEAT 1c — `/prever` between the verified plan and the go-ahead

BEAT 1 splits into three steps so the load-bearing-assumption check has a formal home:
- **1a.** Spec-fidelity / design-choices / schema-refs / edge-cases / failure-modes / forward-proofing (this memory).
- **1b.** 3-question value challenge ([[feedback_beat1_value_challenge]]).
- **1c.** `/prever` — verify the plan's **load-bearing assumptions** empirically against ground truth (read code / data / docs, run read-only probes). **Measure, don't assert.**

The point of 1c: 1a names the plan's design choices, but it does NOT verify that the plan's load-bearing *factual claims* are true. A recommendation often rests on an unverified hypothesis ("the root cause is X", "this approach would fix it") sitting right next to verified facts — 1c flags the hypothesis as STILL-AN-ASSUMPTION before anyone acts on it.

**Auto-invoke 1c when the plan contains any of these patterns:**
- *Diagnostic hypothesis* — "the root cause is X" / "this happens because of Y"
- *Causal claim* — "this would work because Z" / "if we change A, B follows"
- *Predictive estimate* — any forward-looking number
- *Delivery-time-suggesting estimate* — time estimates are out of judgement scope; extra scrutiny if one slips in
- *Measurement-validity claim* — "the metric improves by N%", "cost drops by Z" (see [[feedback_measurement_validity_first]])
- *External-system claim* — "the API returns field F" without a verify-in-API check this session

If none fire and the plan is purely mechanical (a one-line filter fix), 1c is OPTIONAL — skip without ceremony.

**Mechanism:** 1c stays WARM (parent agent inline) by design — naming the load-bearing assumptions of a *specific* recommendation needs conversational context a cold subagent would lose. The empirical verification step (read code / run probe) is mechanical. **BUT** the parent SHOULD spawn a cold subagent for a single named assumption-verification when the action is irreversible (external write, schema migration, data mutation) OR when a load-bearing causal CONCLUSION will drive a card/fix/launch decision — because a warm parent invested in its own conclusion can talk itself in a circle. Briefing: *"verify load-bearing claim X against ground truth — file:line / query-output evidence required; default verdict = NOT VERIFIED."*

Output goes to the owner BEFORE they confirm — never after, since by then the verification is academic.
