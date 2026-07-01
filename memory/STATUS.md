# STATUS.md — Dávidova cesta current state
_Update at the end of every material session. Facts only. Keep it small enough that
one Read call ingests it (move old detail to session notes when it grows)._

## Recent sessions (rolling window)

- **S1 (2026-07-01)** — Installed the agentic starter kit as a **lean adapted spine**
  (global `~/.claude/CLAUDE.md`; project CLAUDE.md; memory MEMORY/INDEX/STATUS + 12
  feedback seeds; tasks ACTIVE/BACKLOG/PARKED; `newsession`/`endsession`/`prever`/
  `deepreview` skills; adapted `.claude/settings.json`; `.gitignore`). Skipped the
  Python syntax hook + pre-commit guard scripts + audit/tasktodo/innovate/explain
  (wrong stack / solo / very simple app — see CLAUDE.md "tooling scope"). Initialized
  local git and set up GitHub. **No app code written yet.**

## Phase / milestone status

- ⬜ Planning session (turn the BRS into a concrete build plan) — NEXT
- ⬜ App build (map, 5 locations, password, unlock animation, progress, audio)
- ⬜ Offline verification (open index.html with no internet)
- ⬜ GitHub Pages deploy
- ⬜ Camp-ready hand-off to the leader

## System / data state

- Stack: static HTML/CSS/JS, offline-first, progress in `localStorage`. No server,
  no DB, no network, no secrets.
- Tests: none yet.
- Assets present: `app_images/` (map, 5 locations + their locks, symbols, seal,
  parchment, light, fog-ish pieces). BRS present as two `.docx` files.
- Environment on this machine: Python is `py` (bare `python` is the broken Store
  stub); **Node is NOT installed**; `gh` CLI status: see session notes.

## Open decisions
- GitHub Pages vs offline-only for camp delivery — Pages set up for distribution, but
  the camp runs offline. Confirm the final delivery method in planning.
- Whether to keep large binary assets (`app_images/`) in git or manage separately.

## Critical rules (not derivable from code)
- **Never reveal locked/future content** (spoilers) — a hard BRS business rule.
- Locations unlock strictly in sequence; exactly one unlock per day; no scoring.
