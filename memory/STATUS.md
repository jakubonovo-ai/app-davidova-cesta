# STATUS.md — Dávidova cesta current state
_Update at the end of every material session. Facts only. Keep it small enough that
one Read call ingests it (move old detail to session notes when it grows)._

## Recent sessions (rolling window)

- **S14 (2026-07-04)** — **Dramaturgia večera (poradie animácií + zvuky) + TEST režim** (Jakub, prehliadač,
  iteratívne; 3× cold review). **(1) Nové poradie po odomknutí:** symbol → cesta → AŽ POTOM ožije ďalší bod
  (trieda `.cesta-kresli` na `#zastavky`; časovanie výhradne CSS, bez JS časovačov). **(2) Cesta vedie až k práve
  AKTÍVNEMU (blikajúcemu) bodu** (`poslednyBod = min(dokonceneDni, DNI.length-1)` vo `vykresliCestu`) — BR-003
  reinterpretácia odsúhlasená Jakubom: blikajúci bod polohu aj tak ukazuje, symbol ostáva skrytý; k UZAMKNUTÉMU
  bodu cesta nikdy nevedie (cold review: tabuľka pre dokonceneDni 0–5, žiadny únik). **(3) Prebudenie bodu:**
  počas kreslenia je ďalší bod maskovaný ako uzamknutý (`zamok-kryt` prekrytie — replika hmly+zámku; kruh
  priehľadný cez `prebudenieKruhu` from-frame), po príchode cesty sa hmla rozplynie + záblesk + pulz (pulz perióda
  1.8s literál — NIE `--cesta-kreslenie`, oprava z review). **(4) Finále bez re-kreslenia cesty** (cesta existuje
  už od D4): statická mapa → nádych `PAUZA_PRED_VLNOU_MS=2500` → whoosh; podfáza „kreslenie" +
  `TRVANIE_KRESLENIA_CESTY_MS` ODSTRÁNENÉ, nová podfáza `finaleFaza="pauza"` (klik = preskočiť na vlnu).
  **(5) Nové zvuky (16 mp3):** `kroky` (cez `animationstart` masky — presná synchronizácia so štartom kreslenia,
  0.9) a `pergamen` (0.8; rozbalenie LEN pri otvorení clue; zrolovanie pri každom reálnom zatvorení — guard
  `bolOtvoreny` proti zvuku „z ničoho" pri resete; clue→heslo bez zvuku). **(6) Pauzy zladené:** `--cesta-pauza`
  0.7→1.7 s (zrolovanie doznie pred krokmi); časovanie kreslenia má JEDINÝ domov v CSS `:root`
  (`--cesta-pauza`/`--cesta-kreslenie`/`--cesta-hotova`). **(7) Pergamen mizne fadeom** (0.8 s, `zatvorPergamenPlynulo`
  + trieda `zatvara`): obsah počas fade ZAMRZNUTÝ — `resetOdomknutie` až po skrytí (`poSkryti` callback) + poistka
  v `otvorHeslo` (oprava „prekliku" na formulár hesla); `animationend` filtrovaný na obal (bublanie detí).
  **(8) ⚠ TEST REŽIM:** `TEST_REZIM_BEZ_HESIEL=true` v `app.js` (heslá sa nekontrolujú, prázdne pole odomkne)
  + červený štítok „TEST — heslá vypnuté" vľavo dole — **pred go-live prepnúť na false** (karta v ACTIVE.md).
  Otestované v prehliadači (Jakub): celý tok D1–D5 + finále + zvuky OK.
- **S13 (2026-07-03)** — **Zvuk — úprava správania + UI ovládania** (Jakub, prehliadač, iteratívne; mimo plánu,
  NIE Fáza 8). **(1) Prostredie sa presunulo z clue na odhalenie symbolu:** už NEhrá pri clue pergamene, ale
  spustí sa až po `light_reveal` (po zjavení symbolu dňa) a hrá v slučke do zavretia pergamenu
  (`spustiProstredie` presunuté do `ukazOdomknutie`). **(2) D2 Prak: `water`→`wind`** (vietor, prak = kameň
  vzduchom; `water` sa stal nenapojenou rezervou; `wind` bola dovtedy nevyužitá rezerva, teraz napojená na 1.0
  bo bol slabý). **(3) Harfa počas clue+hesla stlmená na 0.20** (`HLASITOST_HARFY_CLUE`; `stlmHarfu` rozšírená na
  boolean|number, `Math.min` s cieľovou — rešpektuje vypnutý zvuk); vráti sa v `dokonciOdomknutie`/`zavriHeslo`.
  **(4) Symbol dlhšie:** `TRVANIE_SYMBOLU_MS` 4000→6000. **(5) Prostredie zhlasnené** 0.7→0.9 (birds/leaves),
  wind 1.0. **(6) D1 Pastier = ovce + vtáky spolu** (`DNI[0].zvuk=["birds","sheep"]`): `spustiProstredie`/
  `zastavProstredie`/`prepniZvuk` prerobené zo skalára na POLE (viac prostredí naraz); nový `sheep.mp3` +
  `<audio id="zvuk-sheep">`, `sheep:0.7`. **(7) Jemný prechod prostredie→harfa:** `fadeOutProstredia` (setInterval,
  800 ms fade-out) pred návratom harfy; `dokonciOdomknutie(okamzite)` — prirodzené dobehnutie = fade, preskočenie
  vedúcim (klik/Escape) = okamžite. **(8) `cave.mp3` vymenené** (Janka, silnejšia nahrávka; problém bola len cache).
  **(9) Burger menu ZRUŠENÉ** → dve samostatné ikonky vpravo DOLE (`.ovladanie`): reset (kruhová šípka) + zvuk
  (reproduktor↔preškrtnutý cez `.zvuk-vypnuty` triedu); `prepniMenu`/`zavriMenu` odstránené, `obnovMenuZvuk`
  prepína ikonu+aria-label. 3× cold review (fade race, pole vs skalár, náhrada menu): **0 defektov**; 1 CSS špecifickosť
  bug (obe zvuk-ikony naraz) opravený (`.ovlad-tlacidlo svg.ikona-*`). Otestované v prehliadači (Jakub): všetko OK.
- **S12 (2026-07-03)** — **TASK MAPA.1: spojovacia „cesta" medzi zastávkami na mape** (Jakub, prehliadač,
  iteratívne; commit `88f1883`). **Zlatá bodková cesta** (variant D: tmavý obrys `.halo` + zlaté jadro
  `.core`) medzi dokončenými bodmi; SVG `#cesta` medzi `.pozadie` a `#zastavky`. **BR-003:** kreslí sa len
  segment `i` keď `i+1 < dokonceneDni` (oba konce dokončené) → nikdy k uzamknutému bodu (5× cold review,
  0 defektov). **Zakončenie pri okraji kruhu** (`skratKoniec`, odsun = polomer 7,5 % šírky + 6 px).
  **Kľukaté trasy cez mostíky:** `DNI[i].body` = pole medzibodov v % javiska (D1:4, D2:2, D3:8, D4:3 body),
  hladká **Catmull-Rom** krivka (`cestaZBodov`); vyladené interaktívnym ladítkom (zmazané). **Animácia
  kreslenia** najnovšieho segmentu **PO DĹŽKE trasy** — SVG `<mask>` s bielou čiarou + `stroke-dashoffset`
  (`vytvorAnimovanuCestu`); dĺžka meraná **až po pripojení do DOM** + trieda `.kresli` (spoľahlivé v každom
  prehliadači — poistka z reviewu). Sleduje každý ohyb (dole, potom doprava). **Škálovanie bodiek** podľa
  šírky mapy (pomery `HRUBKA_*`/`BODKA_*`/`MEDZERA_BODIEK_SIRKA` × W, nie px → rovnaká veľkosť na projektore).
  **Resize listener** prekreslí cestu pri zmene okna (debounce 150 ms). **Finále:** nová podfáza
  `finaleFaza="kreslenie"` — cesta jaskyňa→Jeruzalem sa najprv dokreslí (`TRVANIE_KRESLENIA_CESTY_MS=2700`),
  AŽ POTOM `spustiVlnu()` (svetelná vlna). **Zvýraznenie zlatých kruhov** (zanikali v mape): okraj+žiara
  škálované `cqw` (intenzita „J1") + vnútorný tmavý obrys „O1" (`inset` box-shadow) na dokončenej/aktívnej;
  uzamknutá ostáva šedá (BR-003). Otestované v prehliadači (Jakub): všetkých 5 ciest + animácie + finále OK.
- **S11 (2026-07-03)** — **Doladenie veľkostí/pozícií 5 symbolov na mape (pokračovanie S9)** (Jakub, prehliadač,
  iteratívne). Len hodnoty v `DNI[].mapa{}` + `x/y` (žiadny zásah do pixelov, plne reverzibilné): **D1 Pastier**
  kruh doprava+hore (`x:8→11, y:73→71`) lebo vyčnieval z mapy + postava menšia (`92%→86%`); **D2 Prak** menší
  (`82%→74%`) — obsah ide od kraja po kraj štvorca, kruh orezával boky, zmenšenie ho usadilo do stredu bez orezu
  kameňov; **D3 Jonatán** menší (`96%→82%`) — strom bol neprimerane väčší než ostatné; **D4 Jaskyňa** väčšia
  (`96%→102%`, `overflow:hidden` rodiča oreže pretečenie — čisto vizuálne). D5 bez zmeny. **Farba praku** —
  vyrobené 4 sýtostné varianty na porovnanie (scratchpad), Janka zvolila **ponechať originál** (bez zmeny pixelov).
  Bod „spojovacia cesta medzi bodmi" (dizajnérsky návrh) **zaparkovaný do BACKLOG ako TASK MAPA.1** (pozor: postupné
  odhaľovanie kvôli BR-003). Cold review (5 úloh, file:line artefakty): **0 defektov** — poradie D1–D5 nedotknuté,
  žiadny spoiler. Otestované v prehliadači (Jakub, `dokonceneDni:5` test režim): všetkých 5 symbolov vyrovnaných.
- **S10 (2026-07-03)** — **Fáza 7 — polish (`onerror` fallback pre `<img>`)** (Jakub, prehliadač). Nový helper
  `pripravFallbackObrazka(img)` v `app.js`: na `error` skryje `<img>` (`visibility:hidden` → neutrálny čierny
  podklad, žiadna rozbitá ikona na stene, žiadny spoiler BR-003), na `load` zas zobrazí (`visibility:""` →
  striedané pozadia `heslo-pozadie` pregamen↔ODOMKNUTIE po jednej chybe nezhasnú natrvalo). Rieši aj
  už-zlyhaný-pred-naviazaním prípad (`getAttribute("src") && complete && naturalWidth===0`). Naviazané RAZ v
  `start()` na všetky `.stage img` (pozadia INTRO/MAPA, pergameny, dynamické ciele symbol/finále — tie nemajú
  `src` v HTML → startup guard ich preskočí, `onload` ich neskôr zobrazí) + priamo na dynamický symbol mapy vo
  `vytvorZastavku` (pred priradením `src`). `visibility` nie je nikde v `style.css` → žiadny konflikt s `.skryta`
  (tá používa `display`, ortogonálne). Cold review (15 kat. + 4 rizikové trace): **0 reálnych defektov**.
  Otestované v prehliadači (Jakub, premenovaný obrázok → čistý podklad namiesto rozbitej ikony). EC-katalóg
  BRS (EC-001…010) po dohode neriešený ako neaplikovateľný na offline appku na stene.
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
- ✅ Fáza 7 — polish (`onerror`/`onload` fallback pre `<img>` — rozbitá ikona sa skryje, žiadny spoiler) (S10)
- ✅ Zvuk — úprava správania (prostredie po odhalení symbolu, fade prechod, D2 vietor, D1 ovce+vtáky) +
  UI ovládanie (burger → 2 ikonky vpravo dole: reset + zvuk) (S13)
- ✅ Dramaturgia večera — poradie symbol→cesta→prebudenie bodu, cesta k aktívnemu bodu, finále s nádychom,
  zvuky kroky+pergamen, pergamen fade (S14)
- ⬜ Fáza 8 — test: offline verification (TS-002) + generálka (TS-007 s REÁLNYMI heslami) + go-live checklist
  (vypnúť TEST režim!) — NEXT
- ⬜ Camp-ready hand-off to the leader

## System / data state

- Stack: static HTML/CSS/JS, offline-first, progress in `localStorage`. No server,
  no DB, no network, no secrets. **localStorage kľúče: `davidovaCesta.v1`** (postup) +
  **`davidovaCesta.zvuk`** (vypnutie zvuku „off"/"on" — od S8, oddelený od postupu).
  **S12 localStorage NEZMENENÝ** (kľúč aj tvar `{verzia,dokonceneDni,koniecVideny}` netknutý —
  cesta je čisto vizuálna vrstva čítajúca `dokonceneDni`).
- **Mapa – cesta (S12, prerobené S14):** per-segment medzibody `DNI[i].body` (pole `{x,y}` v % javiska,
  voliteľné = rovná čiara). Cesta = SVG `#cesta` (variant D bodky, škálované cqw/pomer k W). Animácia po
  dĺžke (SVG maska + `stroke-dashoffset`). Kruhy `.stav-*` majú J1 zvýraznenie + O1 inset obrys (cqw).
  **S14:** cesta vedie až k AKTÍVNEMU bodu (nikdy k uzamknutému); časovanie kreslenia má jediný domov
  v CSS `:root` (`--cesta-pauza` 1.7s / `--cesta-kreslenie` 1.8s / `--cesta-hotova`); po odomknutí je ďalší
  bod maskovaný (`zamok-kryt`) a prebudí sa po príchode cesty; finále cestu NErekreslí (nádych 2.5s → vlna).
- **⚠ TEST režim (S14):** `TEST_REZIM_BEZ_HESIEL=true` v `app.js` — heslá vypnuté na testovanie, na
  obrazovke štítok „TEST". **Go-live vyžaduje prepnúť na false** (karta v ACTIVE.md).
- Tests: none yet.
- Assets present: `audio/` — **16 mp3** (S8 dodal 13, S13 pridal `sheep` + vymenil `cave`, **S14 pridal
  `kroky` + `pergamen`**: kroky = putovanie pri kreslení cesty cez `animationstart`, 0.9; pergamen =
  rozbalenie pri otvorení clue + zrolovanie pri zatvorení, 0.8). Prostredie sa
  od **S13** už NEspúšťa pri clue, ale **až po odhalení symbolu** (`light_reveal`) a hrá do zavretia pergamenu;
  na konci **jemný fade-out** (`fadeOutProstredia`, 800 ms) pred návratom harfy (preskočenie vedúcim = okamžite).
  Zvuky prostredia dní: **D1 `birds`+`sheep` (spolu — pole)**, **D2 `wind`** (S13: z `water`), D3 `leaves`,
  D4 `cave` (S13 silnejšia nahrávka), D5 `market`. Ostatné: `ambient` (harfa, loop; počas clue+hesla stlmená
  na 0.20), `seal_crack`, `light_reveal`, `celebration`, `whoosh` (4,2 s, nie loop), `tick` (loop), `mystery`.
  **`water` = teraz nenapojená rezerva** (S13). Hlasitosti v `HLASITOSTI` (`app.js`): prostredia 0.9, wind/cave 1.0,
  sheep 0.7. `spustiProstredie` prijíma string ALEBO pole (viac prostredí naraz). Generované cez ElevenLabs.
- Assets present: `app_images/` — **5 symbolov mapy má od S9 nové vizuálne verzie** (staré originály ponechané, nedotknuté):
  D1 `PASTIER_chlapec.png` (orezaný chlapec+ovečka), D2 `PRAK_blizko.png` (prekomponovaný+sýtejší), D3 `JONATAN_sat.png`,
  D4 `jask_sat.png`, D5 `JERUZALEM_sat.png` (sýtejšie). **Veľkosti na mape doladené S11** (`DNI[].mapa.velkost`):
  D1 86 %, D2 74 %, D3 82 %, D4 102 %, D5 default. Napojené v `DNI[]` (single-source; `JERUZALEM_sat` sa cez
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
