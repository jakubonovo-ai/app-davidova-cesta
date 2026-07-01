# project_build_plan.md — Plán stavby „Dávidova cesta"
_Vytvorené v plánovacej relácii S2 (2026-07-01). WHAT = `BRS_fixed.docx` (jediný spec).
Tento súbor je HOW (plán stavby). Aktualizuj pri zmene rozhodnutí._

## Cieľ
Offline HTML/CSS/JS appka premietaná na stenu; vedúci ovláda; 5 lokácií sa odomyká
postupne (1/deň), stav v `localStorage`, musí bežať offline. Simplicita, spoľahlivosť.

## Rozhodnutia (potvrdené)
- **Jazyk:** celý UI + komunikácia + komentáre po slovensky s diakritikou; identifikátory v kóde EN.
- **Mapa:** základ = **prázdna `MAPA.jfif`**; 5 klikacích bodov umiestnime my; symboly sa odhaľujú
  postupne. „ChatGPT" popísaná mapa = len referencia pozícií (v appke NEpoužiť — spoiler).
- **Anti-spoiler (BR-003):** uzamknutá aj aktívna-ešte-neodomknutá zastávka = **len CSS hmla +
  neutrálna ikona zámku; symbol NIE je v DOM**. Dodané „LOCK_*" **nepoužiť** (odhaľujú symbol).
- **Súbory:** `index.html` + `style.css` + `app.js` (klasické `<link>`/`<script>`, bez modulov/
  fetch, relatívne cesty). **Dátami riadený návrh** (5 konfigurácií + 1 vykresľovač + 1 automat).
- **localStorage:** kľúč `davidovaCesta.v1`, tvar `{verzia:1, dokonceneDni:0, koniecVideny:false}`;
  ukladať pri správnom hesle (pred animáciou); shim pre incognito; skrytý **reset postupu**.
- **Heslo:** porovnanie bez diakritiky/veľkosti/nadbytočných medzier (NFD + strip + lower + trim).
- **Bez dátumovej brány** (vyžadujú to testy TS-001 a generálka TS-007 — prehrajú 5 naraz).
- **Zvuk:** neskorší voliteľný layer, tichý fallback, štart pri prvom kliku (autoplay policy).
- **Projektor:** stage 16:9, hlavné texty ≥48px, vysoký kontrast; pomery strán podľa obrazovky.
- **Font:** použiť **štýl fontu z `INTRO.png`** (ozdobný serif) — Janka, S2. Z obrázka sa presný
  font nedá vytiahnuť → nájdem voľne šíriteľný ekvivalent so slovenskou diakritikou, zabalený
  offline; vzorku ukázať Jakubovi pred zafixovaním. (Titulky sú v INTRO zapečené → font treba
  hlavne pre pole hesla, tlačidlá, správy, clue slová, „13177".)

## Obsah 5 dní (BRS sekcia 7)
| Deň | Lokácia | Heslo | Clue na pergamene | Číslica |
|---|---|---|---|---|
| D1 | PASTIER | `BOH VIDÍ TVOJE SRDCE` | BOH, VIDÍ, TVOJE, SRDCE | 1 |
| D2 | PRAK | `ODVAHA` | O,D,V,A,H,A | 3 |
| D3 | JONATÁN | `PRIATEĽ MILUJE V KAŽDOM ČASE` | V, MILUJE, KAŽDOM, PRIATEĽ, ČASE | 1 |
| D4 | JASKYŇA | `JASKYŇA` | netopier, stalagmit, tma, zima, ozvena | 7 |
| D5 | JERUZALEM | `BOH MA VIEDOL CELÚ CESTU` | MA, CELÚ, VIEDOL, BOH, CESTU | 7 |

Kód truhlice: **13177** (zoradené D1→D5: ovca 1, prak 3, luk 1, jaskyňa 7, koruna 7).

## 15 obrazoviek (BRS sekcia 8)
1 INTRO · 2 MAPA · 3 CLUE PERGAMEN · 4 HESLO PERGAMEN · 5 NESPRÁVNE · 6 ODOMKNUTIE ·
7 ODHALENIE SYMBOLU · 8 NÁVRAT NA MAPU · 9 POKRAČOVANIE ZAJTRA · + len D5: 10 FINÁLNA MAPA ·
11 ZÁVEREČNÁ · 12 MYSTERY CIRCLE · 13 SYMBOLY+ČÍSLICE · 14 KÓD 13177 · 15 TRUHLICA.

## Register assetov (overený audit, S2 — videné na vlastné oči)
| Súbor | Rola | Stav / poznámka |
|---|---|---|
| MAPA.jfif | základ mapy (obr.2) | ✅ prázdna krajina ~16:9; zastávky doplníme my |
| INTRO.png | obr.1 | ✅ titulka + ZAČAŤ zapečené (titul „Dobrodružstvo s Dávidom" ≠ BRS); prekryť klikacou zónou |
| PASTIER.jfif | symbol D1 | ✅ pastier+ovce+strom, priehľadné |
| PRAK.png | symbol D2 | ✅ prak+kamene; čierne pozadie |
| JONATAN.jfif | symbol D3 | ✅ luk+túl+strom, bez terča; bez plášťa |
| jask.png | symbol D4 | ✅ jaskyňa+fakľa, priehľadné |
| JERUZALEM.jfif | symbol D5 | ✅ opevnené mesto; bez zreteľnej koruny |
| TRUHLICA.jfif | obr.15 | ✅ otvorená truhlica |
| TOTEM.jfif | obr.12 (mystery circle) | ✅ podstavec s „?" + fakle |
| SIFRA.jfif | obr.13 (symboly+číslice) | ✅ 5 medailónov s číslicami → 13177 |
| pregamen.png | pozadie pergamenov (obr.3,4) | ⚠️ čierne pozadie; má „D" pečať (celú) |
| pecat.png | animácia prasknutia | ⚠️ len rozbitá polovica (celá pečať je na pregamene) |
| svetlo.png | svetelný efekt (obr.6) | ✅ zlatá žiara, priehľadné |
| ODOMKNUTIE.png | obr.6 | ✅ otvorený zámok + svetlo |
| LOCK_* (5×) | — | ❌ NEPOUŽIŤ — odhaľujú symbol (proti BR-003) |
| 3× „ChatGPT Image…" | podklady | ⚠️ mapa=referencia; dok+storyboard = mimo app_images |

**Chýba (od Janky/produkcia):** zvuk (mp3), „táborový denníček" (štýl, DOD-3). Font: štýl z `INTRO.png` (Janka) — nájdem voľný ekvivalent so SK diakritikou.

## Pozície zastávok (referencia z „ChatGPT" mapy — doladiť na MAPA.jfif vo Fáze 1)
1 Pastier vľavo dole · 2 Prak dole-stred · 3 Jonatán hore-stred · 4 Jaskyňa vpravo-stred ·
5 Jeruzalem vpravo hore. Presné % podľa reálnej MAPA.jfif.

## Otvorené otázky
- Zvuk (mp3) — kto/kedy vyrobí. · „Denníček" (štýl).
- Koruna pre D5 (v symbole nie je; je v SIFRA medailóne). · INTRO titul ≠ BRS — použiť ako-je?
- Verejný repo = heslá viditeľné → public/private? · KRIK obrazovka (OQ-004).
- Hygiena assetov: medzery v názvoch, veľké PNG, prevod `.jfif`→`.png` — dotýka sa `app_images/` (len s potvrdením).

## Fázy stavby (každá vlastná relácia, 4-beat, po potvrdení)
- **Fáza 0 — audit assetov ✅ (S2).**
- **Fáza 1 — kostra:** INTRO (klikacia zóna ZAČAŤ) + MAPA s 5 pozíciami; vizuál stavov
  (hmla+zámok / aktívny marker / dokončený symbol) bez logiky hesla.
- **Fáza 2 — stav:** stavový model + localStorage + 1 odomknutie (klik → pergamen → heslo → OK/zle).
- **Fáza 3 — pergameny:** obr.3 clue + obr.4 heslo + obr.5 nesprávne; obsah 5 dní.
- **Fáza 4 — animácie:** obr.6 odomknutie + obr.7 symbol + obr.8 návrat + obr.9 zajtra.
- **Fáza 5 — D5 špeciál:** obr.10–15 (finálna mapa, záverečná, TOTEM „?", SIFRA, 13177, TRUHLICA).
- **Fáza 6 — zvuk:** mp3 + tichý fallback.
- **Fáza 7 — polish:** hmla/žiara cesty, ambient, projektor, edge cases EC-001…010.
- **Fáza 8 — test:** offline (TS-002) + generálka (TS-007).

## Technické gotchas
- `file://` blokuje ES moduly a fetch/XHR → klasické `<script>`/`<link>`, `<img>`/`url()`, relatívne cesty.
- `.jfif` je JPEG (v prehliadači OK); môj `Read` ho nevidí → audit cez `.jpg` kópie v scratchpade.
- Autoplay: hudba až pri prvom kliku. · Dvojklik ODOMKNÚŤ: tlačidlo deaktivovať; prázdne pole = nič.
- Refresh počas animácie: stav uložený PRED animáciou → obnova na dokončenú mapu (EC-003).
- Pages je case-sensitive (`MAPA.jfif` ≠ `mapa.jfif`) — otestovať na Pages pred táborom.
