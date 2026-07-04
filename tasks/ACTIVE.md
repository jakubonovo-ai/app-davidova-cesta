# ACTIVE.md — Dávidova cesta
_The ONE task this session is doing, plus the ordered next-pick queue. Read on
bootstrap. NOT a history log — shipped cards leave here entirely._

## NOW
**Camp-ready hand-off vedúcemu.**
- Súbory na priame otvorenie `index.html` (offline balík — celý priečinok, nie len jeden súbor)
  + krátky návod pre vedúceho (ovládanie: klik, Escape, reset, zvuk; heslá dní).
- Na mieste (tábor): doladiť hlasitosti na projektorovej aparatúre — všetko v `HLASITOSTI`
  (`app.js`); posledný zvyšný bod go-live checklistu zo S14.
- ~~Rozhodnutie push/public~~ **VYRIEŠENÉ (S16, Jakub):** repo ostáva PUBLIC, všetko pushnuté
  na GitHub (`13ba891`) — Pages funguje ako záložná online verzia; riziko čitateľných hesiel
  prijaté (offline tábor, deti 6–11).

## NEXT (ordered next-pick queue)
1. Camp-ready hand-off — viď NOW.

## Recently shipped
- **Fáza 8 — testovanie + go-live (S16):** offline audit čistý (0 sieťových odkazov; 12 obrázkov +
  17 mp3 case-match s diskom → Pages-safe), normalizácia hesiel overená (funguje bez diakritiky),
  TEST režim VYPNUTÝ (`TEST_REZIM_BEZ_HESIEL=false`), TS-002 offline test + TS-007 generálka
  s reálnymi heslami prešli (Jakub, vrátane preklepu/Enter/prázdneho poľa/slučky harfy/celého finále).
- Slávnostný zvuk `zaver` na záverečnej obrazovke finále (S15): hrá pri Jeruzaleme v zlate, stopne sa
  pri prekliku na totem/Escape/resete; oprava „Vypnúť zvuk" — stlmenie sa teraz premietne na VŠETKY
  zvuky vrátane znejúcich jednorazových. `zaver.mp3` dodala Janka, otestované (Jakub).
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
