# MEMORY.md — Dávidova cesta pointer file
_Auto-loaded by the harness every session. Keep <= 30 lines. This is a POINTER, not
a store — detail lives in STATUS.md and session notes. One line per session in
"Last session", never paragraphs._

## Where to read next (in this order)

1. **`memory/STATUS.md`** — current state: what's built, phase grid, key decisions.
2. **`memory/INDEX.md`** — pointers to topic-memory files + the BRS/asset paths.
3. **`tasks/ACTIVE.md`** — the single next task.

## Standing context
- Offline HTML/CSS/JS app for a 5-day kids' camp (13–17 July 2026). Leader-operated
  on a projector; 5 locations unlock in sequence, one per day; progress in
  `localStorage`. Deployed via GitHub Pages but MUST work offline. Simplicity first.
- Stack overrides the global Python default — this is a static web app (see CLAUDE.md).
- Public repo: github.com/jakubonovo-ai/app-davidova-cesta · Pages:
  jakubonovo-ai.github.io/app-davidova-cesta · BRS .docx are git-ignored (local-only).

## Last session
_Newest first. ONE line per session: outcome headline + (resume: next action) if paused._

- **S13 (2026-07-03)** — **Zvuk — úprava správania + UI** (Jakub, prehliadač, mimo plánu). Prostredie sa presunulo
  z clue na **odhalenie symbolu** (po `light_reveal`, do zavretia pergamenu) s **jemným fade-out prechodom** na harfu;
  D2 Prak **`water`→`wind`**; D1 Pastier **ovce+vtáky spolu** (`spustiProstredie` prerobené na POLE, nový `sheep.mp3`);
  harfa počas clue+hesla stlmená (0.20); symbol dlhšie (6 s); `cave.mp3` vymenené. **Burger menu → 2 ikonky vpravo dole**
  (reset + zvuk reproduktor/preškrtnutý). 3× cold review: 0 defektov (+1 CSS špecifickosť bug opravený). (resume: Fáza 8 — offline test TS-002 + generálka TS-007).
- **S10 (2026-07-03)** — **Fáza 7 — polish hotová** (Jakub, prehliadač). `onerror`/`onload` fallback pre `<img>`
  (`pripravFallbackObrazka` v `app.js`): nenačítaný obrázok sa skryje na neutrálny podklad (žiadna rozbitá ikona
  na stene, žiadny spoiler BR-003), `onload` ho zas zobrazí. (resume: Fáza 8 — offline test TS-002 + generálka TS-007).
- **S9 (2026-07-02)** — Vizuálne doladenie 5 symbolov na mape (per-deň `mapa{}` mechanika, oprava elipsy). Detail v STATUS.md.
- **S8 (2026-07-02)** — Fáza 6 (zvuk) postavená — 13 mp3 napojených (S13 neskôr zmenil, kedy hrá prostredie). Detail v STATUS.md.
