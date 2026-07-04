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

- **S14 (2026-07-04)** — **Dramaturgia večera + 2 nové zvuky + TEST režim** (Jakub, prehliadač, iteratívne). Nové poradie:
  symbol → cesta putuje **až k blikajúcemu bodu** (BR-003 reinterpretácia, Jakub OK — bod polohu aj tak ukazuje) → bod sa
  **prebudí** (maskovaný ako zamknutý `zamok-kryt`, po príchode cesty záblesk+pulz). Finále bez re-kreslenia cesty (nádych
  2,5 s → whoosh). Zvuky `kroky` (animationstart) + `pergamen` (otvorenie clue/zrolovanie pri zavretí); pauzy zladené
  (`--cesta-pauza` 1,7 s). Pergamen mizne fadeom (obsah zamrznutý — reset až po skrytí; oprava prekliku). **⚠ TEST_REZIM_BEZ_HESIEL=true**
  (heslá vypnuté + štítok) — **pred go-live prepnúť na false!** 3× cold review. (resume: Fáza 8 — offline TS-002 + generálka TS-007 s reálnymi heslami).
- **S13 (2026-07-03)** — **Zvuk — úprava správania + UI**: prostredie po odhalení symbolu (fade-out na harfu), D2 wind,
  D1 ovce+vtáky (pole), burger → 2 ikonky vpravo dole. 3× cold review: 0 defektov. Detail v STATUS.md.
- **S10 (2026-07-03)** — Fáza 7 — `onerror`/`onload` fallback pre `<img>` (žiadna rozbitá ikona/spoiler). Detail v STATUS.md.
