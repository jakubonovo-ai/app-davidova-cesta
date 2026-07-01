# STATUS.md — Dávidova cesta current state
_Update at the end of every material session. Facts only. Keep it small enough that
one Read call ingests it (move old detail to session notes when it grows)._

## Recent sessions (rolling window)

- **S1 (2026-07-01)** — Installed the agentic starter kit as a **lean adapted spine**
  (global `~/.claude/CLAUDE.md`; project CLAUDE.md; memory MEMORY/INDEX/STATUS + 12
  feedback seeds; tasks ACTIVE/BACKLOG/PARKED; `newsession`/`endsession`/`prever`/
  `deepreview` skills; adapted `.claude/settings.json`; `.gitignore`). Skipped the
  Python syntax hook + pre-commit guard scripts + audit/tasktodo/innovate/explain
  (wrong stack / solo / very simple app — see CLAUDE.md "tooling scope"). Set up git
  and a **public GitHub repo** (github.com/jakubonovo-ai/app-davidova-cesta) with
  **GitHub Pages** on `main` → https://jakubonovo-ai.github.io/app-davidova-cesta/ .
  The BRS `.docx` files are **git-ignored (local-only)** because the repo is public.
  **No app code written yet** — only a placeholder index.html.

## Phase / milestone status

- ✅ Repo + GitHub Pages set up (placeholder page only)
- ⬜ Planning session (turn the BRS into a concrete build plan) — NEXT
- ⬜ App build (map, 5 locations, password, unlock animation, progress, audio)
- ⬜ Offline verification (open index.html with no internet)
- ⬜ Camp-ready hand-off to the leader

## System / data state

- Stack: static HTML/CSS/JS, offline-first, progress in `localStorage`. No server,
  no DB, no network, no secrets.
- Tests: none yet.
- Assets present: `app_images/` (map, 5 locations + their locks, symbols, seal,
  parchment, light, fog-ish pieces). BRS present as two `.docx` files.
- Environment on this machine: Python is `py` (bare `python` is the broken Store
  stub); **Node is NOT installed**; `gh` CLI 2.95.0 installed at
  `C:\Program Files\GitHub CLI\gh.exe`, authed as **jakubonovo-ai**.

## Open decisions
- Final camp delivery method: Pages URL needs internet; the camp room is likely
  offline, so plan to also hand the leader the files to open `index.html` directly.
  Confirm in planning.
- Whether to keep large binary assets (`app_images/`) in git or manage separately.

## Critical rules (not derivable from code)
- **Never reveal locked/future content** (spoilers) — a hard BRS business rule.
- Locations unlock strictly in sequence; exactly one unlock per day; no scoring.
