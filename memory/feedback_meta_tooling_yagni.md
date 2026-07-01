---
name: Meta-tooling YAGNI — require a concrete past regression
description: Default YAGNI on framework / process / enforcement / skill-ritual work; require a concrete past regression before building meta-tooling; for no-code / no-decision sessions, skip the full close ritual and do a minimal pointer update only.
type: feedback
---

**Rule:** Default YAGNI on framework / process / enforcement / skill-ritual / audit-of-the-process work. Before proposing any meta-tooling (a new skill step, a new pre-commit hook, a new check script, an audit of your own process), name the **concrete past regression** the tool would have caught. A gap that exists only on paper is not enough.

For sessions that ship no code, no data change, and no externally-visible decision: **skip the full `/endsession` ritual.** Minimum viable close = update `memory/MEMORY.md` "Last session" line + (optionally) save one feedback memory. No journal, no STATUS churn, no task-file rewrite.

**Inverse rule (when a journal IS required):** the same conditions, inverted, gate journal-writing in `/endsession` — a stub journal is required if any of: (a) a DB write / migration applied, (b) an externally-visible decision recorded, (c) test delta over a small threshold; plus a judgment catch-all (any non-trivial decision worth replaying later). Both rules use the SAME trigger so they cannot drift apart — change one, change the other.

**Why (generic):** It is easy to spend several sessions hardening hypotheticals — guards for files nobody was about to bloat, checks for a discipline nobody had actually broken. The honest split: *structural* cleanup that pays back every session (file splits, size discipline, deduplication) is load-bearing and worth it; *speculative* enforcement that guards a problem that has never occurred is pure cost with zero return. Running a full close ritual on a session that changed two lines is the same anti-pattern at smaller scale.

**How to apply:**
- Tempted to add a framework / hook / enforcement script / new skill step? Name the specific past regression it would have caught. If you can't, don't build it — pivot to product work or end the session.
- When an audit finds gaps in earlier meta-tooling, default to PARKED with a "reopen if a real regression happens" trigger — don't auto-spawn cards to close hypothetical gaps.
- Structural cleanup (file splits, size discipline, doc dedup) IS still high-value. The lesson is not "no infrastructure" — it's "no infrastructure that hardens a hypothetical."
- No-code / no-decision session → don't run the full close. Update the MEMORY.md pointer line and stop.
