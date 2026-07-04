# ACTIVE.md — Dávidova cesta
_The ONE task this session is doing, plus the ordered next-pick queue. Read on
bootstrap. NOT a history log — shipped cards leave here entirely._

## NOW
**Fáza 8 — test: offline verification + generálka + go-live checklist.**
- TS-002: otvoriť `index.html` bez internetu (z `file://`) a overiť všetko bez siete (obrázky, zvuk
  vrátane nových `kroky.mp3`/`pergamen.mp3` zo S14, localStorage). Prípadne aj GitHub Pages
  (case-sensitivity `.jfif`).
- TS-007 generálka: prehrať 5 dní naraz vrátane zvuku (bez dátumovej brány).

**Go-live checklist (S14 — POVINNÉ pred odovzdaním, poradie záväzné):**
1. ⚠ **`TEST_REZIM_BEZ_HESIEL = false`** v `app.js` (hore v súbore) — heslá sa zas kontrolujú,
   štítok „TEST" zmizne. Bez tohto NEODOVZDAŤ.
2. Generálku (TS-007) prehrať **s reálnymi heslami** (diakritika, preklepy, Enter) — testy v S14
   bežali s vypnutými heslami.
3. Overiť plynulosť slučky harfy `ambient.mp3` (otvorený bod zo S7 — generovaná bez loop režimu).
4. Hlasitosti doladiť na mieste (projektorová aparatúra ≠ PC reproduktory) — všetko v `HLASITOSTI`.

## NEXT (ordered next-pick queue)
1. Fáza 8 — viď NOW.
2. Camp-ready hand-off vedúcemu (súbory na priame otvorenie `index.html` + krátky návod).

## Recently shipped
- Dramaturgia večera (S14): poradie symbol→cesta→prebudenie ďalšieho bodu; cesta vedie k blikajúcemu
  bodu (BR-003 reinterpretácia, Jakub OK); finále bez re-kreslenia (nádych→whoosh); zvuky kroky+pergamen;
  pergamen mizne fadeom (obsah zamrznutý, oprava prekliku); TEST režim bez hesiel (⚠ viď checklist v NOW).
- Fáza 7 — polish: `onerror`/`onload` fallback pre `<img>` (`pripravFallbackObrazka`) — nenačítaný obrázok
  (chýbajúci súbor / case-mismatch na Pages) sa skryje na neutrálny podklad, žiadna rozbitá ikona na stene,
  žiadny spoiler (BR-003). Naviazané na všetky `.stage img` + dynamický symbol mapy. Cold review: 0 defektov — S10.
- Fáza 6 — zvuk (13 mp3 napojených): harfa loop + zvuky prostredia D1–D5 v slučke do „Ďalej" (D5 = trh),
  seal_crack+light_reveal pri odomknutí (harfa sa stlmí a vráti), whoosh cez svetelnú vlnu, mystery+tick
  pri šifre, celebration fanfára; menu „Vypnúť zvuk" (uložené); tichý fallback (EC-005) — S8.
- Fáza 5 — D5 finálna sekvencia (finálna mapa so svetelnou vlnou, záverečná, PREKVAPENIE/TOTEM, šifra,
  kód 13177 v šifrovej obrazovke, truhlica; replay klikom na Jeruzalem; `koniecVideny` sa ukladá) — S6.
