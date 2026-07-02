# STATUS.md — Dávidova cesta current state
_Update at the end of every material session. Facts only. Keep it small enough that
one Read call ingests it (move old detail to session notes when it grows)._

## Recent sessions (rolling window)

- **S9 (2026-07-02)** — **Vizuálne doladenie 5 symbolov na mape** (Jakub, prehliadač; iteratívne, mimo plánu —
  NIE Fáza 7). Pridaná **per-deň mechanika `mapa`** v `DNI[]` (`velkost`/`fit`/`orez`/`posunX`/`posunY`) → prepisuje
  vzhľad symbolu cez CSS premenné (`--sym-*`) novým helperom `nastavMapuSymbolu`; CSS default = staré správanie
  (86 %/cover/kruh). **Oprava elipsy:** `.zastavka` z `width:15%+aspect-ratio:1/1` na `15cqw×15cqw` (rozmer viazaný
  na šírku javiska → vždy presný kruh). **Kruh ako maska:** `overflow:hidden` na `.stav-dokoncena` (nie na `.zastavka`
  → pulzujúci krúžok aktívnej NIE je orezaný; box-shadow žiara prežíva, kreslí sa mimo boxu). **Nové obrázky (Pillow,
  originály nedotknuté):** `PASTIER_chlapec.png` (orezaný len chlapec+ovečka, bez stromu/stáda, centrovaný), `PRAK_blizko.png`
  (prak+kamene prisunuté k sebe + sýtosť 1,40/kontrast 1,15), `JONATAN_sat.png`+`jask_sat.png` (sýtosť 1,30/kontrast 1,10),
  `JERUZALEM_sat.png` (jemnejšie 1,15/1,06 — silnejšie pôsobilo digitálne). „Luk" v zadaní = D3 Jonatán (strom s lukom+tulcom).
  Cold review (15 kat.): **0 reálnych defektov**, 1 kozmetika (kat.11: `orez` je jednohodnotový flag, `orez:true` sa nikde
  nenastavuje — ponechané ako zámerne minimálne API). Otestované v prehliadači (Jakub): všetkých 5 symbolov OK.
- **S8 (2026-07-02)** — **Fáza 6 (zvuk) — postavená a otestovaná** (Jakub, prehliadač; 3 dávky podľa jeho
  spätnej väzby). Zvukový modul v `app.js` (jediný domov hlasitostí `HLASITOSTI`, `spustiZvuk` jadro,
  `prehraj`/`spustiProstredie`/`zastavProstredie`/`stlmHarfu`/`prepniZvuk`). **Napojenie:** harfa `ambient`
  loop, štart až na 1. klik vedúceho (autoplay policy, jednorazový `once` listener); zvuky prostredia D1–D5
  hrajú **v slučke do „Ďalej"** — D1 birds, D2 water, D3 leaves, D4 cave, **D5 `market` (ruch trhu na clue
  karte Jeruzalema)**; `seal_crack`+`light_reveal` pri odomknutí (**harfa sa vtedy stlmí na 0 a po dokončení
  vráti** — obnova na každej ceste vrátane skip/Escape/reset); `whoosh` (**4,2 s prelet cez celú svetelnú
  vlnu, NIE loop** — presne dĺžka vlny); `mystery` (prekvapenie + odhalenie šifry) + `tick` (loop tikanie
  počas lúštenia, stop pri kóde); `celebration` fanfára pri truhlici (zakaždým). **Nesprávne heslo = ticho**
  (BRS zákaz). **Menu „Vypnúť zvuk"** (prepínač, uložený v samostatnom kľúči `davidovaCesta.zvuk`).
  **Chýbajúci mp3 = ticho, žiadny pád** (EC-005, try/catch + `p.catch`). **Všetkých 13 mp3 dodaných**
  (Janka doplnila market/whoosh/tick/mystery). 3× cold review (15 kat. + invarianty loop-stop/harfa-obnova):
  **0 reálnych defektov** (jediné opakované FOUND = `zvuk-wind` bez volajúceho — zámerná rezerva).
- **S7 (2026-07-02)** — **Príprava assetov pre Fázu 6 (zvuk) — bez kódu.** Preštudovaný Assets Register
  v BRS (sekcia audio); pre každý z 9 zvukov napísaný AI-generátorový prompt (odporúčaný **ElevenLabs
  Sound Effects**, hudba ako záloha Suno). **Obsahová zmena (Janka OK):** `seal_crack.mp3` už NIE je
  prasknutie pečate, ale **zvuk odomknutia vintage zámku** (názov súboru ostáva kvôli kódu). Janka
  vygenerovala a dodala **všetkých 9 mp3**; ja som ich premenoval z ElevenLabs názvov na cieľové
  (`ambient/seal_crack/light_reveal/birds/wind/water/leaves/cave/celebration.mp3`) v `audio/`. **Fáza 6
  tým prestala byť blokovaná produkciou.** Otvorený bod: `ambient.mp3` bol generovaný bez zapnutého
  Loop-u → pri teste overiť seamless loop, prípadne pregenerovať. Kód appky sa nemenil.
- **S6 (2026-07-02)** — **Fáza 5 (D5 finálna sekvencia, obr.10–15).** Po odomknutí Jeruzalema (D5) sa
  namiesto štandardného návratu na mapu spustí finále: obr.10 **finálna mapa** (svetelná vlna — dokončené
  zastávky sa postupne rozžiaria D1→D5 cez `--poradie`) → obr.11 **záverečná** (Jeruzalem v zlate + „Dávidova
  cesta sa skončila…" / „Ale tvoja cesta s Bohom pokračuje.") → obr.12 **PREKVAPENIE** (kamenný TOTEM s „?",
  klik naň) → obr.13 **šifra** (SIFRA pergamen, Ďalej) → obr.14 **kód 13177** (objaví sa V šifrovej obrazovke —
  pergamen len stmavne, `.sifra-stlmena`; žiadny presvit mapy) → obr.15 **truhlica** (koniec, obrazovka ostáva).
  **Klik na dokončený Jeruzalem prehrá finále znova** (Jakub S6 — poistka pri prerušení; `stopPropagation` proti
  bublaniu na mapu). **`koniecVideny=true`** sa uloží pri zobrazení truhlice (dovtedy nevyužité pole). Escape
  finále ukončí (mapa ostáva), reset ho zruší aj s časovačmi (`zavriFinale`). **Nový automat** `finaleFaza` +
  `finaleCasovace` (lineárny, dátami neriadený — 6 krokov). **TOTEM/SIFRA/TRUHLICA** prevedené z `.jfif` na
  **priehľadné PNG** (šachovnica zapečená v JPEG odstránená flood-fillom + čistením osamelých pixelov; `.jfif`
  originály nedotknuté). Cold review (15 kat.): **0 FOUND**, 2 FOUND-UNCERTAIN → oba vyriešené (onerror =
  parkované Fáza 7 ako všade; 13177 single-source v `KOD_TRUHLICE` overené). Odstránený dvojitý render mapy
  po D5. Otestované v prehliadači (Jakub): tok OK, totem čistý, prechod na kód plynulý.
- **S5 (2026-07-01)** — **Fáza 4 (odhalenie symbolu po odomknutí).** Po správnom hesle: obr.6
  pergamen ukáže `ODOMKNUTIE.png` (odopnutý zámok, 1,5 s) → obr.7 zámok zmizne (pozadie späť na
  `pregamen.png`) + na pergamene sa objaví **symbol dňa + jeho názov** (4 s, jemný fade) → zavrie
  pergamen + prekreslí mapu s novým symbolom. **Prerušiteľné** klikom na pergamen (okrem tlačidla/
  pola) alebo Escape = skok na koniec; reset počas animácie ju zruší (`sekvenciaHotovo` + zrušené
  časovače). Prvý pokus (celoplošný overlay + svetlo.png) **zahodený** — Jakub žiadal jednoduchosť
  na pergamene; svetlo.png sa nepoužilo (nevhodné). **Menu zdvihnuté nad pergamen** (z-index 40>30)
  → dostupné aj počas hesla/animácie (Jakub OK). **Symboly D1/D3/D5 prepnuté .jfif→.png**: staré
  `.jfif` mali biele/šachovnicové pozadie zapečené v JPEG → Jakub zmazal .jfif, ja som skriptom
  (Pillow, flood-fill+neutrálne pozadie) odstránil pozadie z dodaných PNG → RGBA. D2/D4 už mali alfu.
  Cold review (22 kat.): 0 FOUND, 2 FOUND-UNCERTAIN (img `onerror` → Fáza 7; reset nad prekryvom =
  zámer). Otestované v prehliadači (Jakub): tok OK.
- **S4 (2026-07-01)** — **Fáza 3 (pergameny + obsah 5 dní).** Odomknutie prestavané z 1 modálu na
  2-krokový pergamenový tok: klik → **CLUE pergamen** (voľne rozmiestnené clue slová dňa, ĎALEJ) →
  **HESLO pergamen** (pole + Odomknúť) → zhoda = **výmena pozadia za `ODOMKNUTIE.png`** (odopnutý
  zámok, ~1,8 s) → zavrie + odhalí symbol; omyl = shake + neutrálny text (FR-007 presné znenie).
  Obsah D2–D5 z BRS; **D1 heslo/clue** = potvrdená odchýlka od BRS (Jakub): „Hospodin hľadí na tvoje
  srdce", clue HOSPODIN/HĽADÍ/NA/TVOJE/SRDCE. Pergamen = zvitok `pregamen.png` na výšku (2:3). Cold
  review: 0 FOUND, 2 FOUND-UNCERTAIN → oba doriešené (guard `den.clue||[]`; kontrakt clue do plánu).
  Otestované v prehliadači (Jakub): tok OK.
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
- **S1 (2026-07-01)** — Agentic starter kit (lean adapted spine) + git + **public GitHub repo**
  (github.com/jakubonovo-ai/app-davidova-cesta) + **GitHub Pages** na `main` →
  https://jakubonovo-ai.github.io/app-davidova-cesta/ . BRS `.docx` **git-ignored** (repo je public).
  _(Detaily S1 v git histórii commitu dd287de.)_

## Phase / milestone status

- ✅ Repo + GitHub Pages set up (placeholder page only)
- ✅ Planning session + build plan (`memory/project_build_plan.md`)
- ✅ Fáza 0 — audit assetov (obrázky overené voči BRS)
- ✅ Fáza 1 — kostra (INTRO + MAPA, 5 zastávok, 3 stavy)
- ✅ Fáza 2 — stavový model + `localStorage` + odomknutie heslom + reset (menu)
- ✅ Fáza 3 — pergameny (clue + heslo + nesprávne) + obsah 5 dní (S4)
- ✅ Fáza 4 — odhalenie symbolu po odomknutí (zámok → symbol+názov na pergamene, prerušiteľné) (S5)
- ✅ Fáza 5 — D5 finálna sekvencia (finálna mapa + záverečná + TOTEM + SIFRA + 13177 + truhlica) (S6)
- ✅ Fáza 6 — zvuk (13 mp3 napojených + tichý fallback + menu „Vypnúť zvuk") (S8)
- ⬜ Fáza 7 — polish (edge cases; napr. `onerror` fallback pre `<img>`) — NEXT
- ⬜ Offline verification (open index.html with no internet)
- ⬜ Camp-ready hand-off to the leader

## System / data state

- Stack: static HTML/CSS/JS, offline-first, progress in `localStorage`. No server,
  no DB, no network, no secrets. **localStorage kľúče: `davidovaCesta.v1`** (postup) +
  **`davidovaCesta.zvuk`** (vypnutie zvuku „off"/"on" — od S8, oddelený od postupu).
- Tests: none yet.
- Assets present: `audio/` — **13 zvukových mp3 dodaných a napojených (S8)**: `ambient` (harfa, loop),
  `seal_crack` (odomknutie zámku), `light_reveal` („wow"), `birds` D1, `water` D2, `leaves` D3, `cave` D4,
  `market` D5 (ruch trhu), `celebration` (fanfára truhlica), `whoosh` (prelet svetelnej vlny, 4,2 s, nie loop),
  `tick` (loop tikanie šifry), `mystery` (prekvapenie + šifra). `wind` = zámerná NEnapojená rezerva.
  Generované cez ElevenLabs Sound Effects. Loop `ambient` overený OK (Jakub, S8). Hlasitosti vyvážené
  v `HLASITOSTI` (`app.js`). Pozn.: `cave`/whoosh boli slabé — riešiteľné len hlasnejším súborom (kód púšťa 1.0).
- Assets present: `app_images/` — **5 symbolov mapy má od S9 nové vizuálne verzie** (staré originály ponechané, nedotknuté):
  D1 `PASTIER_chlapec.png` (orezaný chlapec+ovečka), D2 `PRAK_blizko.png` (prekomponovaný+sýtejší), D3 `JONATAN_sat.png`,
  D4 `jask_sat.png`, D5 `JERUZALEM_sat.png` (sýtejšie). Napojené v `DNI[]` (single-source; `JERUZALEM_sat` sa cez
  `DNI[last].symbol` prejaví aj vo finálnej záverečnej obrazovke). Ďalej: (mapa, finále: `TOTEM.png`=obr.12,
  `SIFRA.png`=obr.13, `TRUHLICA.png`=obr.15 — všetky priehľadné PNG od S6; pergamen, pečať, svetlo, ODOMKNUTIE;
  „LOCK_*" sa NEpoužijú — odhaľujú symbol). BRS: jediný spec `BRS_fixed.docx`. Audit: viď `project_build_plan.md`.
  Symboly D1/D3/D5 (S5) aj TOTEM/SIFRA/TRUHLICA (S6) boli JPEG(.jfif) so zapečeným pozadím → nahradené
  priehľadnými `.png` (skript Pillow flood-fill + čistenie); pôvodné `.jfif` v app_images/ ostávajú (nedotknuté).
- Environment on this machine: Python is `py` (bare `python` is the broken Store
  stub); **Node is NOT installed**; `gh` CLI 2.95.0 installed at
  `C:\Program Files\GitHub CLI\gh.exe`, authed as **jakubonovo-ai**.

## Open decisions
- Final camp delivery method: Pages URL needs internet; the camp room is likely
  offline, so plan to also hand the leader the files to open `index.html` directly.
  Confirm in planning.
- Whether to keep large binary assets (`app_images/`) in git or manage separately.
- **Chýba (od Janky/produkcia):** ~~zvuk (mp3)~~ **DODANÉ + NAPOJENÉ S8 (13 mp3 v `audio/`)**; „táborový
  denníček" (referencia štýlu, DOD-3). Font: štýl z `INTRO.png` (Janka, S2) — nájdem voľný ekvivalent so SK diakritikou.
- Verejný repo = heslá budú viditeľné → nechať public alebo dať private?
- Mapa rozhodnutá: **prázdna `MAPA.jfif`** + postupné odhaľovanie (nie popísaná „ChatGPT" mapa).
- **Heslo D1** „Hospodin hľadí na tvoje srdce" + clue HOSPODIN/HĽADÍ/NA/TVOJE/SRDCE —
  **odsúhlasené Jakubom, v appke (S4).** `BRS_fixed.docx` má ešte staré „BOH VIDÍ TVOJE SRDCE"
  (appka je autoritatívna). **Otvorené:** raz zosúladiť BRS s appkou (drift spec↔kód).
- **Pozície zastávok / clue slov / veľkosti textu** — orientačné (cqw / % plochy), doladiť
  v prehliadači; clue `cx/cy` sú % písacej plochy pergamenu (kontrakt v `project_build_plan.md`).

## Critical rules (not derivable from code)
- **Never reveal locked/future content** (spoilers) — a hard BRS business rule.
- Locations unlock strictly in sequence; exactly one unlock per day; no scoring.
