# CLAUDE.md — Dávidova cesta
# Project T0 commandments — loaded every session (auto-loaded by the harness).
# Keep this file SHORT (aim <= 180 lines). Detail lives in the BRS + memory files.

---

## What this system does

**Dávidova cesta** ("David's Journey") is an **offline HTML application projected on
a wall** during a 5-day Christian children's camp *"Dobrodružstvo s Dávidom"*
(13–17 July 2026, Evanjelická fara Petržalka, Bratislava; ~30 kids aged 6–11).

The **camp leader operates it** on a projector. During the day kids collect clue
words; in the evening they guess the daily password together and watch David's
journey reveal on a map. There are **5 locations that unlock strictly in sequence,
one per day**. Each unlock plays an animation and reveals a symbol. Progress is
saved between launches. It is **not a game** — the goal is a shared emotional
experience of the story unfolding.

Guiding principle (from the BRS): **simplicity over effects; reliability first;
offline first.**

**Owner / developer:** Jakub (beginner developer — see global `~/.claude/CLAUDE.md`).
**Product Owner (content):** Janka. **Primary user:** the camp leader.
**Repository:** Git with a **GitHub remote + GitHub Pages** deployment. Commit
locally; push to `main` (Jakub approves pushes). **Push na GitHub aj session
journal robíme až na KONCI, keď bude appka hotová** — dovtedy len lokálne commity, ktoré robím **rovno, bez pýtania `CONFIRM`**. Pages is for distribution/testing —
**the app must still run fully offline** (open `index.html` directly, no internet).

**Current state:** Pre-build. The BRS is written; the app is **not yet built**. A
planning session is pending before any app code is written. Single source of truth
for current state is `memory/STATUS.md`.

---

## Jazyk — všetko po slovensky

- Celý text aplikácie (nadpisy, heslá, správy) je v **odbornej slovenčine s diakritikou**.
- Komunikácia s Jakubom po slovensky. V kóde: identifikátory (názvy premenných/funkcií) môžu
  ostať po anglicky (konvencia); UI text, komentáre a dokumentácia po slovensky.
- Jediný platný spec je slovenský `BRS_fixed.docx` (staršia anglická verzia bola zmazaná).

---

## The stack (this project OVERRIDES the global Python default)

- **Plain static HTML + CSS + JavaScript.** No server, no database, no build step,
  no framework required, no network calls, no accounts, no secrets.
- **Progress persistence:** the browser's `localStorage`.
- **Why not Python:** the app must run offline by opening a file in a browser, and
  GitHub Pages only serves static files. Python would add a runtime + server = more
  to break, against the BRS's "minimize operator workload".
- Python's only possible role is optional local dev tooling, invoked as `py`
  (the bare `python` command is the broken Windows Store stub on this machine).

---

## Where to find more

| Topic | File |
|---|---|
| Business requirements (WHAT to build) — jediný platný spec (po slovensky) | `BRS_fixed.docx` |
| Image assets (map, locations, locks, symbols, seal) | `app_images/` |
| Current-state facts (phase grid, what's built) | `memory/STATUS.md` |
| Topic-memory index (feedback/project/reference/user) | `memory/INDEX.md` |
| Session pointer (read-next + last session) | `memory/MEMORY.md` |
| The single next task | `tasks/ACTIVE.md` |
| Ready backlog / parked tasks | `tasks/BACKLOG.md` · `tasks/PARKED.md` |

> One owner per fact — never let the same fact live in two files.

---

## Session bootstrap — read these on every session start, in this order

1. `CLAUDE.md` — this file (auto-loaded)
2. `memory/MEMORY.md` — pointer file (<= 30 lines)
3. `memory/STATUS.md` — current state
4. `memory/INDEX.md` — topic-memory pointers
5. `tasks/ACTIVE.md` — the current task spec

After reading, declare the next task + plan + uncertainties; **WAIT for Jakub's
confirmation before writing code.** Run `/newsession` to do this automatically.
After material work, run `/endsession`.

---

## ❌ Claude Code MUST STOP and ask before

This app is offline with no money/data/API surface, so the irreversible actions are
different from a typical backend — they are mostly about assets, spoilers, and git:

- **Deleting or overwriting anything in `app_images/`** — these are the only copies
  of the camp's artwork.
- **Deleting or overwriting the BRS `.docx` source files** — they are the spec.
- **Revealing future/locked content early** in the app (spoilers). The BRS makes
  "future content must never be revealed" a hard business rule — treat any change
  that could leak a not-yet-unlocked location/symbol as a STOP-and-ask.
- **`git push --force` / history rewrites** on the GitHub remote.
- **Deleting the browser progress logic** or changing the `localStorage` key/shape
  after the camp has real saved progress on the leader's machine.
- **Enabling/changing GitHub Pages settings or making the repo public** — confirm,
  since Pages publishes the content to a public URL.

---

## Never do

- Reveal locked/future content in the UI (spoiler = a real defect here).
- Commit `.env` or any secret (there should be none in this project).
- Auto-correct or silently skip errors — log and surface them.
- Bypass git hooks (`--no-verify`).
- Add a framework, build tool, server, or dependency without Jakub confirming —
  the whole point is a single set of static files that just open.

---

## Behavioral Guidelines

1. **Think before coding.** State assumptions; if uncertain, ask. If a simpler
   approach exists, say so.
2. **Simplicity first.** No features beyond what was asked. No abstractions for
   single-use code. This project's north star is literally simplicity.
3. **Surgical changes.** Don't "improve" adjacent code or formatting. Every changed
   line should trace to the request.
4. **Goal-driven.** Define success criteria, then verify against a real browser.

---

## Answer from the running system, then calibrate

Before any non-trivial answer: verify against the actual code/BRS/assets — don't
theorize about what the app "should" do. Lead with the simplest correct answer.
When you change a fact/number, fix every occurrence together.

---

## Quick Commands

| Command | Purpose |
|---------|---------|
| `start index.html` | Open the app in the default browser (once it exists) |
| `py -m http.server 8000` | Serve the folder locally, then open http://localhost:8000 |
| `git status` | See what changed |

> The camp itself needs NO command — the leader just opens `index.html`.

---

## Note on tooling scope

This project installed a **lean adapted spine** of the agentic starter kit. The
Python-specific PostToolUse syntax hook and the pre-commit guard scripts were
intentionally skipped (wrong stack + solo + very simple app). The 4-beat workflow
disciplines (verify → write → cold review → close) are still active via the
`newsession` / `endsession` / `prever` / `deepreview` skills, enforced by habit,
not by scripts. Add the guards later if a real regression justifies them.
