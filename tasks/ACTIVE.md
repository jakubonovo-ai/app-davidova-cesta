# ACTIVE.md — Dávidova cesta
_The ONE task this session is doing, plus the ordered next-pick queue. Read on
bootstrap. NOT a history log — shipped cards leave here entirely._

## IN PROGRESS — resume thread
**H2 návod: hotový, čaká na schválenie v prehliadači (Janka).**
- **Čo urobené (S17):** `navod.html` vytvorený (jedna A4, po slovensky, tlač cez Ctrl+P), git-ignored kvôli
  spoileru (heslá). Fakty overené z kódu + cold review 0 defektov. **Prepis rolí na Janku HOTOVÝ (S17):**
  Janka = jediná rola (vlastníčka/prevádzka/obsah/vývoj), komunikácia s Jankou; Jakub mimo aktívnych rolí,
  ostáva len v historických záznamoch. Zmenené: `CLAUDE.md` (hlavička rolí + „WAIT for Janka" + komunikácia +
  „bez Jankinho potvrdenia") a `project_build_plan.md` (vzorku ukázať Janke). STATUS.md historické záznamy
  zámerne NEdotknuté.
- **Kde sme zastali:** návod treba otvoriť dvojklikom na `navod.html`, skontrolovať obsah + náhľad tlače
  (Ctrl+P), a povedať čo upraviť / že je OK. Zvlášť: over WA/Messenger náhľad cez `?x=1` (Pages deploy
  opravený v S17 — thumbnail teraz 200).
- **Ďalší konkrétny krok:** po schválení návodu → pokračovať H1 (balík/ZIP), H3 (generálka), H4 (odovzdanie).

## NOW
**Hand-off vedúcemu — fázy H1–H4 (H2 návod rozrobený, viď resume thread hore).**
Zadanie H0 uzavreté (S16): stroj tábora = TENTO MSI notebook (Jankin); návod = tlačiteľná A4
+ súbor v balíku; distribúcia = e-mail/cloud vopred + USB záloha.
- **H1 — balík:** čistý priečinok len s runtime súbormi (`index.html`, `app.js`, `style.css`,
  `app_images/`, `audio/`) bez pracovných dokumentov; z neho ZIP. Kritérium: funguje offline
  z iného miesta na disku.
- **H2 — návod A4 (po slovensky):** spustenie, tabuľka hesiel, ovládanie (klik/Enter/Escape,
  ikonky reset+zvuk), riešenie problémov („zvuk až po prvom kliknutí" nie je chyba). Súčasť:
  prepis rolí na Janku (majiteľka/prevádzkovateľka — rozhodnuté S16; historické záznamy sessions
  sa NEprepisujú, mená Jakub/Janka smú ostať aj verejne — rozhodnuté S16).
- **H3 — generálka odovzdania:** rozbaliť ZIP inde + prejsť D1 len podľa návodu.
- **H4 — odovzdanie + uzávierka** (na mieste tábora ešte: hlasitosti na aparatúre — `HLASITOSTI`).

## NEXT (ordered next-pick queue)
1. Hand-off H1–H4 — viď NOW.
2. **Bezpečnosť účtu:** zapnúť 2FA na GitHub účte `jakubonovo-ai` (manuálny krok, ~5 min,
   github.com/settings/security). Odporučené v S16 security posudku.

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
