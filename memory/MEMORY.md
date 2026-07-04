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
- Public repo: github.com/davidova-cesta/davidova-cesta.github.io (od S16 v organizácii
  `davidova-cesta`; presun z jakubonovo-ai) · Pages: **https://davidova-cesta.github.io/** ·
  BRS .docx are git-ignored (local-only).

## Last session
_Newest first. ONE line per session: outcome headline + (resume: next action) if paused._

- **S17 (2026-07-04)** — **Hand-off H2 časť: tlačiteľný návod + oprava thumbnailu/Pages.** (1) `navod.html` —
  jedna A4, po slovensky (spustenie, tabuľka 5 hesiel+indícií, ovládanie, riešenie problémov, varovanie pred
  resetom); **git-ignored** (obsahuje heslá = spoiler, NESMIE na public GitHub). (2) **Thumbnail nefungoval** —
  príčina: po presune repa do org sa **Pages deploy rozbil** (3 buildy errored/cancelled, nasadený ostal starý
  `de67911` bez obrázka → og-nahlad.jpg 404). Oprava: vyžiadaný build cez API (`POST .../pages/builds`) →
  postavil najnovší `99a6955`, obrázok teraz 200. **Prevádzkový nález:** GitHub Pages sa po presune repa
  neopravil sám — pri budúcom zaseknutom deployi reštartnúť build cez API. Kód appky nezmenený.
  (3) **Prepis rolí na Janku HOTOVÝ** (`ef10d41`): Janka = jediná rola (vlastníčka/prevádzka/obsah/vývoj),
  komunikácia s Jankou; Jakub mimo aktívnych rolí (len v historických záznamoch). Zmenené `CLAUDE.md` +
  `project_build_plan.md`; STATUS.md história zámerne nedotknutá. (4) **Globálne 2 profily** v
  `~/.claude/CLAUDE.md` (mimo repa): **Janka = default vlastníčka VŠETKÝCH projektov**, Jakub platí len keď
  repo výslovne uvedie „Owner: Jakub" (samostatná sekcia). (resume: Janka schváli `navod.html` v prehliadači +
  over WA náhľad cez `?x=1` → potom H1 balík/ZIP, H3 generálka, H4 odovzdanie.)
- **S16 (2026-07-04)** — **Fáza 8 HOTOVÁ (TS-002+TS-007 prešli, TEST režim vypnutý) + pushnuté (public prijaté)
  + repo presunuté na `davidova-cesta/davidova-cesta.github.io`** (Pages: davidova-cesta.github.io). Security
  posudok: jediné reálne riziká = spoilery v public repe (prijaté), táborové údaje v docs (prijaté, mená OK),
  e-mail v git autorstve (odstraňuje sa) + odporučené 2FA. OG náhľad pre WA/Messenger (`og-nahlad.jpg` 1200×630).
  Hand-off H0 uzavreté, H1–H4 zakartované. Git história prepísaná bez e-mailu + force push (CONFIRM Jakub;
  hashe commitov sa zmenili — staré odkazy v docs sú len historické). (resume: nová session → hand-off H1.)
- **S15 (2026-07-04)** — **Slávnostný zvuk `zaver` na záverečnej obrazovke finále** (17. mp3, dodala Janka; hrá pri
  Jeruzaleme v zlate, stop pri prekliku/Escape/resete) + oprava „Vypnúť zvuk" — stlmenie na VŠETKY `<audio>`.
