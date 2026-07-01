# INDEX.md — Dávidova cesta memory pointers
_Stable. Update only when memory files are created, renamed, or deleted._
_Discipline (manual in this lean setup — no guard script installed): every
`feedback_*.md` / `project_*.md` / `reference_*.md` / `user_*.md` in `memory/`
should have a pointer line below, so a cold session can find it._

---

## State files (referenced by MEMORY.md — not auto-loaded)

- [STATUS.md](STATUS.md) — current state, rolling window.

---

## Topic memory files (NOT auto-loaded — read explicitly when relevant)

Four buckets. Add a one-line pointer per file under its bucket.

### User context  (`user_*.md` — who the user/org is)
- _(none yet)_

### Project context  (`project_*.md` — ongoing work, goals, constraints not in code/git)
- _(none yet — likely candidates after planning: `project_build_plan.md`,
  `project_camp_schedule.md`)_

### Reference data  (`reference_*.md` — pointers to canon, external resources)
- _(none yet — the BRS `.docx` files are the canonical spec; see CLAUDE.md table)_

### Feedback (process / preferences)  (`feedback_*.md` — dated, regression-anchored rules)
Shipped with the kit as the portable process spine. Keep them; add your own over time.
- [feedback_meta_tooling_yagni.md](feedback_meta_tooling_yagni.md) — default YAGNI on process/tooling; require a concrete past regression before building meta-tooling; skip the full close on no-code sessions.
- [feedback_no_allow_always.md](feedback_no_allow_always.md) — never "Allow Always"; prefer env-var substitution so no captured permission holds a literal secret.
- [feedback_senior_dev_deep_dive.md](feedback_senior_dev_deep_dive.md) — write like a senior dev; walk the named error-category checklist on every non-trivial task.
- [feedback_verify_plan_before_coding.md](feedback_verify_plan_before_coding.md) — verify the plan empirically before coding (BEAT 1a + the BEAT 1c `/prever` triggers).
- [feedback_beat1_value_challenge.md](feedback_beat1_value_challenge.md) — the 3-question value challenge at the end of BEAT 1; DELETE weak cards rather than park them.
- [feedback_deepreview_evidence_standard.md](feedback_deepreview_evidence_standard.md) — post-ship review must be a COLD subagent backed by artifacts; logical argument is not evidence.
- [feedback_ground_in_code_before_theorizing.md](feedback_ground_in_code_before_theorizing.md) — anchor answers in the running system before theorizing; sweep code+tests+docs when a fact changes.
- [feedback_audit_cards_become_tracked.md](feedback_audit_cards_become_tracked.md) — every audit finding lands in a tracked bucket or is deleted with a reason.
- [feedback_test_first_then_wire.md](feedback_test_first_then_wire.md) — new selectors/scoring rules ship probe-only first; production wiring is a separate approved card.
- [feedback_stop_the_discovery_loop.md](feedback_stop_the_discovery_loop.md) — ship the planned scope + spawn a follow-up card when investigation reveals a deeper problem; time-box deep dives.
- [feedback_measurement_validity_first.md](feedback_measurement_validity_first.md) — audit the measurement system before believing a measured improvement.
- [feedback_no_delivery_time.md](feedback_no_delivery_time.md) — delivery-time estimates are out of the agent's judgement scope; never a column in an option table.

### The 4-beat task cycle (what the feedback rules wire together)
On every non-trivial task:
1. **BEAT 1 — verify before coding:** 1a verify-plan + 1b 3-question value challenge + 1c `/prever`.
2. **BEAT 2 — write code** senior-dev style against the named error categories.
3. **BEAT 3 — `/deepreview`** cold-subagent post-ship review with artifact evidence.
4. **BEAT 4 — `/endsession`** declare done + commit, only after BEAT 3 is clean.

---

## Project docs (canonical paths)
- `BRS_fixed.docx` (Slovak, primary spec) · `DavidovaCesta_Enterprise_BRS_v1.0.docx`
  (English summary) · `app_images/` (assets). Mirror of the CLAUDE.md "Where to
  find more" table.
