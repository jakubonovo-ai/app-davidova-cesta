# Dávidova cesta

Offline HTML application projected on a wall during the 5-day Christian children's
camp *"Dobrodružstvo s Dávidom"* (13–17 July 2026, Evanjelická fara Petržalka).
The camp leader operates it; kids solve a daily password; David's journey reveals on
a map, one of five locations unlocking per day. **Offline-first, no server, no
database, no accounts.** Simplicity and reliability over effects.

## Stack
Plain static **HTML + CSS + JavaScript**. Progress is saved in the browser's
`localStorage`. No build step, no framework, no dependencies.

## Run it
- **Camp / offline:** open `index.html` in a browser (no internet needed).
- **Local dev with a server:** `py -m http.server 8000`, then open
  http://localhost:8000
- **Online:** via GitHub Pages (for distribution/testing only).

> The app is **not built yet** — `index.html` is a placeholder. Build follows the
> planning session. Requirements: `BRS_fixed.docx` (Slovak, primary) and
> `DavidovaCesta_Enterprise_BRS_v1.0.docx` (English summary).

## Working practice
This repo uses a lean adaptation of an agentic starter kit: see `CLAUDE.md` for the
project rules, `memory/` for state and process memory, `tasks/` for the task
queue, and the `newsession` / `endsession` / `prever` / `deepreview` skills in
`.claude/skills/`.
