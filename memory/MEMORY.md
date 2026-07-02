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

- **S9 (2026-07-02)** — **Vizuálne doladenie 5 symbolov na mape** (Jakub, prehliadač; mimo plánu, nie Fáza 7).
  Nová per-deň mechanika `mapa{velkost/fit/orez/posunX/posunY}` v `DNI[]` → CSS premenné (`nastavMapuSymbolu`);
  `.zastavka` z `width:15%+aspect-ratio` na `15cqw×15cqw` (oprava elipsy); `.stav-dokoncena` maskuje `overflow:hidden`.
  Nové obrázky: `PASTIER_chlapec.png` (orezaný chlapec+ovečka), `PRAK_blizko.png` (prak+kamene pri sebe, sýtejšie),
  `JONATAN_sat.png`/`jask_sat.png`/`JERUZALEM_sat.png` (sýtejšie farby). Originály nedotknuté. Cold review: 0 reálnych
  defektov (1 kozmetika kat.11 = `orez` jednohodnotový flag, ponechané). (resume: Fáza 7 — polish, `onerror` pre `<img>`).
- **S8 (2026-07-02)** — **Fáza 6 (zvuk) hotová a otestovaná** (Jakub, prehliadač): harfa `ambient` loop
  (štart na 1. klik), zvuky prostredia D1–D5 v slučke do „Ďalej" (D5 = `market` ruch trhu), `seal_crack`+
  `light_reveal` pri odomknutí (harfa sa vtedy stlmí na 0 a vráti), `whoosh` (4,2 s prelet cez svetelnú vlnu,
  nie loop), `mystery`+`tick` (loop) pri šifre, `celebration` fanfára pri truhlici. Menu „Vypnúť zvuk"
  (uložené v `davidovaCesta.zvuk`). Chýbajúci mp3 = ticho (EC-005). **Všetkých 13 mp3 dodaných.** 3× cold
  review: 0 reálnych defektov. (resume: Fáza 7 — polish, `onerror` fallback pre `<img>`).
- **S7 (2026-07-02)** — **Zvukové assety pre Fázu 6 dodané** (bez kódu): 9 mp3 (ElevenLabs) do `audio/`.
  `seal_crack.mp3` = ZMENA na zvuk odomknutia zámku (nie pečate, Janka OK). Fáza 6 odblokovaná.
