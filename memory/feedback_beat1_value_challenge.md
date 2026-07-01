---
name: BEAT 1 final gate — three-question value challenge before coding
description: At the END of BEAT 1 (after design-verification, before any code), run the explicit 3-question value challenge. Refuse cards that fail the test instead of building them and parking the result.
type: feedback
---

At the end of BEAT 1 (after the design-verification pass per [[feedback_verify_plan_before_coding]] has produced a clean plan), and BEFORE writing any production code, run the explicit 3-question value challenge:

1. **What benefit will this bring?** — name the concrete outcome the work produces. Vague "we'll know what's used" or "future ML might want this" answers fail. Concrete answers cite a specific decision the work unlocks.
2. **Is it worth it?** — name the cost (build + maintenance + UX risk) AND the alternative use of that effort. If the alternative is "ask the stakeholder directly in 5 minutes," the build is almost never worth it.
3. **Is this scaled to THIS project, or is it enterprise feature-creep?** — does the feature fit the actual scale (single user / single customer / pilot), or is it an instrumentation pattern that only earns its keep at multi-tenant / multi-operator / regulated scale?

**Why (generic):** Enterprise-grade instrumentation, telemetry, audit pages, and digest emails are easy to justify in the abstract and almost always wrong for a small single-user system — the cost of the missing feature at that scale is near zero, and the same answer is usually available from a 5-minute conversation. Codifying the three questions as an explicit gate kills feature-creep cards at intake instead of at commit.

**How to apply:**
1. After the plan is clean, do NOT immediately ask "ready to code?" — run the 3 questions as a separate, explicit block. Three numbered answers.
2. **If any answer is weak**, call it out and propose: (a) DELETE the card (preferred), (b) replace it with a smaller alternative that addresses the real underlying need, or (c) accept the weak answer and proceed with eyes open. Surface the disposition choice to the owner.
3. **Distinguish DELETE from PARK.** Park is for "genuinely can't finish now" (waiting on data / scheduling / a dependency). Delete is for "this doesn't fit our scale and never will." Parked cards carry maintenance cost (re-evaluation, drift); deleted ones don't. When in doubt, delete — a future need earns a fresh card with a fresh value-challenge.
4. **Applies to NEW cards too**, not just queue triage. Run the 3 questions before promoting any card to READY.
5. **Don't smuggle answers.** Sometimes the honest answer to "what benefit" is "this is enterprise pattern-matching, not a real need here" — say it.

**Workflow location:** this is the final step of BEAT 1 (verify-plan → THIS gate → write code → `/deepreview` → `/endsession`).
