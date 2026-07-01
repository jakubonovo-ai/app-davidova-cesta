# STATUS.md — Dávidova cesta current state
_Update at the end of every material session. Facts only. Keep it small enough that
one Read call ingests it (move old detail to session notes when it grows)._

## Recent sessions (rolling window)

- **S3 (2026-07-01)** — **Fáza 1 (kostra INTRO+MAPA)** + **Fáza 2 (stavový model + `localStorage`
  + odomknutie heslom + burger menu s resetom)**. Cold review oboch fáz (0 reálnych defektov v
  review). **Oprava reálnej chyby:** `.skryta` bola prebitá neskorším `.modal{display:grid}` →
  okno na heslo sa zobrazovalo cez celú mapu a blokovalo kliky → `display:none !important`
  (pridaná deepreview kategória 15 = CSS cascade). **Heslo D1 zmenené** na „Hospodin hľadí na
  tvoje srdce" (BRS uvádza staré → over s Jankou; D1 clue slová treba nové – Fáza 3). Otestované
  v prehliadači: odomknutie D1/D2 + reset OK.
- **S2 (2026-07-01)** — Plánovanie + **Fáza 0 audit assetov**. Prečítaný celý `BRS_fixed.docx`;
  plán uložený do `memory/project_build_plan.md`. Obrázky overené na vlastné oči: symboly D1–D5 +
  truhlica + TOTEM (obr.12) + SIFRA (obr.13) sedia; „LOCK_*" nepoužiť (odhaľujú symbol → BR-003);
  mapa = **prázdna `MAPA.jfif`** (postupné odhaľovanie). Prepnuté na **slovenčinu** (global aj
  projektový CLAUDE.md). **Zmazaný** zastaraný anglický BRS + opravené odkazy. App kód zatiaľ nie.
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
- ✅ Planning session + build plan (`memory/project_build_plan.md`)
- ✅ Fáza 0 — audit assetov (obrázky overené voči BRS)
- ✅ Fáza 1 — kostra (INTRO + MAPA, 5 zastávok, 3 stavy)
- ✅ Fáza 2 — stavový model + `localStorage` + odomknutie heslom + reset (menu)
- ⬜ Fáza 3 — pergameny (clue + heslo + nesprávne) + obsah 5 dní — NEXT
- ⬜ Offline verification (open index.html with no internet)
- ⬜ Camp-ready hand-off to the leader

## System / data state

- Stack: static HTML/CSS/JS, offline-first, progress in `localStorage`. No server,
  no DB, no network, no secrets.
- Tests: none yet.
- Assets present: `app_images/` (mapa, 5 symbolov, TOTEM=obr.12, SIFRA=obr.13, pergamen,
  pečať, svetlo, truhlica; „LOCK_*" sa NEpoužijú — odhaľujú symbol). BRS: jediný spec
  `BRS_fixed.docx` (zastaraný anglický zmazaný). Audit: viď `memory/project_build_plan.md`.
- Environment on this machine: Python is `py` (bare `python` is the broken Store
  stub); **Node is NOT installed**; `gh` CLI 2.95.0 installed at
  `C:\Program Files\GitHub CLI\gh.exe`, authed as **jakubonovo-ai**.

## Open decisions
- Final camp delivery method: Pages URL needs internet; the camp room is likely
  offline, so plan to also hand the leader the files to open `index.html` directly.
  Confirm in planning.
- Whether to keep large binary assets (`app_images/`) in git or manage separately.
- **Chýba (od Janky/produkcia):** zvuk (mp3), „táborový denníček" (referencia štýlu, DOD-3).
  Font: štýl z `INTRO.png` (Janka, S2) — nájdem voľný ekvivalent so SK diakritikou.
- Verejný repo = heslá budú viditeľné → nechať public alebo dať private?
- Mapa rozhodnutá: **prázdna `MAPA.jfif`** + postupné odhaľovanie (nie popísaná „ChatGPT" mapa).
- **Heslo D1** „Hospodin hľadí na tvoje srdce" — **odsúhlasené Jankou (S3, 2026-07-01).** Zmena je
  v `app.js` + `project_build_plan.md`; `BRS_fixed.docx` má ešte staré heslo (appka je autoritatívna).
  **Otvorené:** nové clue slová pre D1 (Fáza 3), staré „BOH, VIDÍ, TVOJE, SRDCE" už nesedia.
- **Pozície zastávok / veľkosť textu** — zatiaľ orientačné (cqw), doladiť v prehliadači keď bude čas.

## Critical rules (not derivable from code)
- **Never reveal locked/future content** (spoilers) — a hard BRS business rule.
- Locations unlock strictly in sequence; exactly one unlock per day; no scoring.
