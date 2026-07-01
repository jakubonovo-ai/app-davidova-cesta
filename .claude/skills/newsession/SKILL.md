---
name: newsession
description: Bootstrap a new session — read project docs in order, declare the next task, flag overdue maintenance, wait for confirmation before writing any code.
argument-hint: task name
---

NEW SESSION BOOTSTRAP

If a task name is provided in $ARGUMENTS, focus on that task. Otherwise check what's already done vs what's still missing and skeptically pick the next READY task — `tasks/ACTIVE.md` first, then `tasks/BACKLOG.md` if ACTIVE is empty/stale.

## Read files in this exact order — do not skip any

If any file is missing: **skip silently and continue.** Do not glob, do not `ls`, do not spelunk. Note it in the bootstrap report and move on.

1. `CLAUDE.md` — T0 commandments (auto-loaded; just confirm read)
2. `memory/STATUS.md` — current state (what's built, phase grid, key decisions). Keep it small enough to load in one Read call.
3. `memory/INDEX.md` — topic-memory pointers + canonical doc paths. Coverage is kept up manually in this lean setup (no guard script).
4. `tasks/ACTIVE.md` — current task spec + ordered next-pick queue. If the top has an `## IN PROGRESS — resume thread` block, that is the load-bearing handoff: a previous session paused mid-task and the resume action is spelled out there.

**Stop investigating after step 4.** Do not open additional docs, do not re-read STATUS.md with different offsets, do not grep for next-task hints. If your declaration genuinely needs a fact you don't have, ask ONE specific question instead of hunting.

## Branch hygiene — solo, work on main

Before declaring the task:

1. Check current branch: `git branch --show-current`
2. If NOT on `main`: switch back with `git checkout main`. If that fails (e.g. uncommitted changes), report the error and ask Jakub — do NOT force-checkout or discard changes.

Solo project on a single machine: work directly on `main`; no feature branches, and no need to pull unless you know a push happened from elsewhere.

Open T1 docs only when the task needs them (architecture, schema, conventions, env vars, gotchas, full agentic rules, business rules, decision log, backlog/parked, past session writeups) — see the "Where to find more" table in `CLAUDE.md`.

## After reading, tell the owner

- "The next task is [X]. We're doing this because [business reason in one sentence]. My plan: [1. … 2. … 3. …]. Ready — please confirm."
- Challenge your choice and double-check it.
- **"What else did we not consider?"** — before asking for confirmation, run an explicit critique pass against your own plan. List 3-5 things a sharp reviewer would question: cost assumptions, edge cases, downstream impact, irreversibility, single-person dependencies, untested assumptions, things the plan quietly omits. Surface these BEFORE the owner confirms — not after.
- **(Optional) Reconcile against your domain canon.** If the project has a reference doc for the relevant theory (a `reference_*.md` memory), state in one line whether the plan CONFORMS to it or deliberately DIVERGES (with the justified reason for this project's scale). If a load-bearing premise is an assumption — especially "the textbook-ideal data source/method exists here" — verify it (read/probe) instead of asserting it.
- If anything about the task is unclear: state it before Jakub confirms.

## Task-graph reconciliation — one glance

This is **not** spelunking — the "stop investigating after step 4" rule still governs *task-picking*. One semantic glance (no deep reads, uses files already loaded): does the next-pick card in `tasks/ACTIVE.md`/`BACKLOG.md` contradict what `STATUS.md` already says is done? Does BACKLOG still hold a card that already shipped? If so, flag it before declaring the task — **don't auto-fix; surface it.** Otherwise say "task-graph reconciliation: clean" and continue.

**WAIT for Jakub's explicit confirmation before writing any code.**

---

## After confirmation — the 4-beat task cycle (MANDATORY for every non-trivial task)

"Non-trivial" = anything that changes production logic, adds/removes files, or alters
behaviour. Single-line typo fixes are exempt.

Owner says "confirm" → you MUST run the beats IN ORDER before `/endsession`. Do NOT
skip beats. Do NOT start BEAT 2 before BEAT 1 is complete. The beats are:

### BEAT 1 — Verify before coding (NO Edit/Write calls until this beat is done)

1. **1a. Deep-dive plan verification** — walk the checklist from
   `memory/feedback_verify_plan_before_coding.md`: spec fidelity, design-choice
   ambiguities, schema/API refs, edge cases, aggregation semantics, failure modes,
   adjacent asks, forward-proofing. Surface findings.
2. **1b. 3-question value challenge** — per `memory/feedback_beat1_value_challenge.md`:
   (i) What benefit does this bring? (ii) Is it worth it? (iii) Scaled to THIS project?
   If any answer is weak, propose DELETE/replace/accept.
3. **1c. `/prever`** — verify the plan's load-bearing assumptions empirically (read
   code/data, run read-only probes). Measure, don't assert. Auto-invoke if the plan
   contains a diagnostic hypothesis, causal claim, predictive estimate, or
   external-system claim. Skip ONLY if the plan is purely mechanical.

**Gate:** BEAT 1 is complete when 1a findings are surfaced, 1b passes (or the owner
accepts a weak answer), and 1c assumptions are verified. THEN proceed to BEAT 2.

### BEAT 2 — Write code (senior-dev style)

Write production code against the named error-category checklist in
`memory/feedback_senior_dev_deep_dive.md`. Walk the applicable categories DURING
implementation, not after.

### BEAT 3 — `/deepreview` (post-ship cold-subagent review)

After code is written and tests pass, run `/deepreview`. This spawns a COLD subagent
(no conversation context) that adversarially reviews the diff against the error-category
checklist. Every CLEAN claim must be backed by a tool-output artifact (file:line, grep
result, command output). Fix any real findings before proceeding.

### BEAT 4 — `/endsession`

Only after BEAT 3 is clean. Commit, push, update docs per the endsession skill.

---

## Rules
- Sessions end when you stop, not when a task completes — multiple small things in one session is normal. Run `/endsession` if anything material changed.
- Confirmation = hard stop. Do not infer consent from silence or prior approvals.
- Uncertainty goes up, not down. Declare anything unclear and find data-driven answers before starting work.
