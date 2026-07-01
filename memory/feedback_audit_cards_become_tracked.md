---
name: Audit cards become tracked
description: After an audit (or /tasktodo) produces findings, promote each into a tracked bucket (BACKLOG / PARKED) or archive/delete it — never leave cards staged only in the audit report folder. Stale cards get deleted after code-verification; live ones get re-scoped and kept.
type: feedback
---

After an audit produces task cards, each card must land in a **real tracked bucket** — `tasks/BACKLOG.md` (READY) or `tasks/PARKED.md` (deferred, with a reopen trigger) — or be archived/deleted. The report under `docs_audits/` stays the historical artifact + full spec; the bucket card is the tracked home and links back to it. Do NOT leave actionable cards living only in the report folder.

**Why (generic):** Staging cards only in the audit folder lets real work silently slip — a reconciliation later finds findings with no tracked home, invisible to the planning surface. Some backlog growth is preferable to losing track of findings. The anti-clutter mechanism is not "don't mirror" — it is "actively triage and delete stale cards."

**How to apply (triage every finding into exactly one):**
- **PROMOTE** → BACKLOG (READY) or PARKED (deferred + a condition-based reopen trigger, never a bare date), each with a one-line falsifier.
- **ARCHIVE** → if already shipped, record it in `docs/TASKS_ARCHIVE.md`.
- **DELETE / CLOSE** → if the premise is refuted by current code/data or solved differently. ALWAYS verify in code/data first, then close with a one-line reason.
- **RE-SCOPE + KEEP** → if the card carries a finding still true in code but its framing is stale, rewrite it as a clean tracked card.

This applies going forward to `/tasktodo` output too. A card with no bucket home silently slips; a card whose premise is already refuted should be closed with a reason, not promoted.
