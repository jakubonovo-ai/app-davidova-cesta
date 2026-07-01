---
name: endsession
description: Lightweight session close — update only the docs whose state actually changed; commit only if there's something coherent to commit. No mandatory ritual; no session journal for trivial work.
argument-hint: optional context
---

The close is conditional. Most sessions touch 1-2 lines of state. **Skip every row whose state didn't change.** Do NOT run every step out of habit.

> **Source of truth:** the doc-update matrix below IS the source of truth for this kit. If your project later grows a fuller agentic-rules doc (`docs/AGENTIC_RULES.md`), keep that and this skill in sync — and if they ever drift, fix the doc first, then sync the skill row, never the other way around.

---

## Always runs (1 thing)

**Update `memory/MEMORY.md` "Last session" block** — prepend a new session entry: what a cold `/newsession` needs to resume (outcome headline, load-bearing restructures, key decisions). To keep the file under ~30 lines, trim the OLDEST entry — its detail already lives in STATUS.md. **Keep it to ~one line per session;** a 30-line file that is byte-heavy still costs context every session.

---

## Blast-radius pass — run BEFORE the conditional rows (it tells you which fire)

The conditional table answers *"I changed X, which doc owns X?"*. This step answers the bigger question: *"what did this change ripple INTO?"* — the gap that leaves cards misfiled for weeks. **Scale it to the change:**

- **Trivial** (typo / cosmetic / untracked cleanup) → skip; go to the conditional rows.
- **Standard** (one card/feature, no schema/production change) → name only the surfaces that are FULL or PARTIAL.
- **Structural** (production behaviour · schema/migration · a decision that blocks/unblocks/obsoletes/re-scopes a card · a measurement-baseline change) → score the full matrix.

Score the change against **seven surfaces** (FULL / PARTIAL / NONE + a one-line "so what"): **Production behaviour · Data/schema · Measurement validity · Task graph (BACKLOG/PARKED/ACTIVE) · Single-source-of-truth docs · Launch readiness · External dependencies.**

**Load-bearing:** a FULL/PARTIAL on *Task graph* means you reconcile the **whole** BACKLOG/PARKED/ACTIVE this close (propagate the decision to every card it unblocks/obsoletes/re-scopes), not just the card you touched. The FULL/PARTIAL surfaces become the list of conditional rows that must fire below.

---

## Conditional — touch only if state actually changed

| Touch this | Only if… |
|---|---|
| `tasks/ACTIVE.md` | The active task changed status, or a task was picked up / put down. **Never write a "just shipped" history block here** — that goes to `TASKS_ARCHIVE.md`. ACTIVE.md is for the *current* task + the *next pick* only. |
| `tasks/BACKLOG.md` / `tasks/PARKED.md` | **(a) shipped / refuted / deleted / superseded** — remove the entire card from BACKLOG.md (no stub, no breadcrumb; the full spec lives in `TASKS_ARCHIVE.md`). **(b) parked from BACKLOG** — move the entire card body to PARKED.md, prepended with `⏸ PARKED Session N, YYYY-MM-DD — <reason>` + a `**Reopen trigger (any of):**` block; remove it from BACKLOG. **(c) unparked** — move it back the same way. Keep this discipline manually (no guard script in this lean setup): don't leave shipped/parked markers sitting in BACKLOG. |
| `docs/TASKS_ARCHIVE.md` | **Any non-trivial card shipped** — append the full ship spec (title, ✅ DONE date + session, what shipped, falsifier, decisions, decision-record link). **Do NOT include an effort/time line** — time estimates are out of judgement scope ([[feedback_no_delivery_time]] / the global decision-framing rule). |
| `memory/STATUS.md` | What's built, phase grid, or key facts changed. Keep it small enough for one Read call. When it grows large, MOVE the oldest rolling-window entry into a `STATUS_HISTORY.md` (create on first overflow) rather than deleting words. |
| Plan docs (roadmap / launch plan / strategic plan) | A milestone/keystone card shipped / was refuted / re-scoped. Update ONLY the derived "what remains" summary + re-check the exit gate — never add a per-session ship log (STATUS.md owns ship status; the plan DERIVES from it). |
| `memory/INDEX.md` | A topic-memory file was created, renamed, or deleted. Add/rename/remove its pointer in the matching section (User / Project / Reference / Feedback). Keep it up manually — every memory file should have a pointer here so a cold session can find it. |
| `docs/sessions/YYYY-MM-DD_S{NN}_{slug}.md` | **Always write unless trivial.** Trivial = single-line typo fixes, doc cosmetics, untracked-file cleanup. Everything else gets a stub journal. Stub format: `## Scope`, `## Files touched`, `## Tests`, `## Falsifier`, `## Note to future-self`. |
| `docs/MAINTENANCE.md` | A maintenance action ran, a known weakness was identified, a parameter changed, or a new scheduled item was added with a due date. |
| `~/.claude/MAINTENANCE.md` | A cross-project (global) maintenance item was silenced, completed, added, or rescheduled. Keep entries date-anchored so `/newsession` can flag overdue items. |
| Domain docs (`SCHEMA.md` / `ENVIRONMENT.md` / `GOTCHAS.md` / `DECISIONS.md` / `ARCHITECTURE.md` / `CONVENTIONS.md` / `PROJECT_CONTEXT.md`) | The fact that doc owns actually changed. |

If none of the conditional rows fire, the close is just the MEMORY.md line + (optionally) a commit. That is a valid full close.

---

## Single-source-of-truth check (only when STATUS or domain docs were touched)
Skip on docs-only or trivial sessions. Run only if you updated STATUS.md or a domain doc:
- Same test count in two files? → STATUS.md owns it.
- Same phase status in `tasks/*` and STATUS.md? → STATUS.md owns it.
- Decision repeated in `TASKS_ARCHIVE.md` and `DECISIONS.md`? → DECISIONS.md owns it.

---

## Newsession resume check — ALWAYS run before the commit gate
The acceptance test for the handoff. Simulate a cold `/newsession` that has read NOTHING else: open the first paragraph of the new MEMORY.md block, the top of `tasks/ACTIVE.md`, the top of `memory/STATUS.md`. From those three views ALONE, answer in one sentence each:
- **What was the outcome of the previous session?** (from the MEMORY.md headline)
- **What is the next task and why?** (from ACTIVE.md NOW/NEXT)
- **Are we paused mid-task with any open thread?** (from an `IN PROGRESS — resume thread` block if present; absent = no pause = fine)

If any answer is *"I'd have to dig further"* — the handoff is broken. Fix the file that owns the missing fact, not the check. Re-run.

### Gate-freshness check (ALWAYS — the one fact-category worth re-verifying)
Blocking-state is the only fact-category that decides what work gets picked next. A stale "waiting on X" hides work that's actually unblocked, and every later bootstrap inherits it. So regardless of which rows fired:
1. Scan `tasks/ACTIVE.md` (NOW/NEXT + blocked/gated) and any STATUS "awaiting / pending / blocked on" line.
2. For each gate, ask: *did the thing it waits on happen?* (a reply arrived, a prerequisite shipped — including THIS session's ship). Check this session's events first; when in doubt about an older gate, verify against the source rather than copy the claim forward.
3. If a gate cleared → flip the status to the real reason (which may be "now pickable" OR "still blocked, but on Y not X"). Never propagate a known-stale "awaiting" line.

Do NOT generalise this into "re-verify every fact" — only blocking-state. Counts/dates drift cheaply; gates don't.

---

## Git commit + push — only if `git status` is dirty
Run `git status`. If clean, print "Working tree clean — nothing to commit" and stop. If dirty:

1. **Pre-commit safety scan — abort and warn if any of these appear in the diff:**
   - `.env` (any path)
   - filenames matching `*credentials*`, `*.key`, `*.pem`, `*token*` (excluding `tokenizer*`)
   - any file containing the word "secret"
2. **Flag (don't abort) any binary file > 1 MB** about to be committed.
3. **Default to one commit.** Bundle related changes; split only if two genuinely distinct units shipped.
4. **Show the proposal:** `git diff --stat HEAD` + the safety-scan result + subject + body (omit if subject is self-explanatory) + a `Co-Authored-By` trailer using the session's ACTUAL model string (do NOT hardcode a version).
5. **Wait for typed `CONFIRM`** before `git commit`. Verify with `git log -1 --oneline`.
6. **Push to `main` on GitHub** after successful commit: `git push origin main`. If push fails (no remote, auth error), report the error but do not retry — the commit is safe locally.

---

## Rules
- **Always work on `main`** — no feature branches or PRs while solo. Reintroduce when colleagues join.
- **No pre-commit hooks in this lean setup.** If you add them later, never bypass with `--no-verify`.
- **No "one task per session" rule.** Sessions end when you stop.
- **Mid-task pause hygiene** — the load-bearing handoff when work isn't done. Do all three: (1) prefix the task title in `tasks/ACTIVE.md` with `IN PROGRESS:`; (2) add an `## IN PROGRESS — resume thread` block at the top of ACTIVE.md capturing *what was tried* (last attempt + outcome), *where we stopped* (file + line/step), *next concrete action* (one imperative sentence); (3) mirror a one-line `(resume: <next action>)` clause into the MEMORY.md entry. Remove the prefix + block when the task finishes in a later session.
- **No mandatory steps.** This is a checklist, not a ritual. If the table doesn't fire a row, don't make work for yourself.
