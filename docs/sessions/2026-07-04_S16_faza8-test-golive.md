# S16 — 2026-07-04 — Fáza 8: testovanie + go-live (appka hotová)

## Scope
Fáza 8 podľa `tasks/ACTIVE.md`: kódový offline audit, vypnutie TEST režimu,
TS-002 (offline test) a TS-007 (generálka s reálnymi heslami).

## Files touched
- `app.js` — jediná zmena kódu: `TEST_REZIM_BEZ_HESIEL = true → false` (riadok 18,
  commit `2e3d13c`). Heslá sa opäť kontrolujú; štítok „TEST" sa už nevytvára
  (bol podmienený tým istým prepínačom).
- Memory/task docs (STATUS, MEMORY, ACTIVE) — uzavretie fázy.

## Tests
- **Kódový offline audit (read-only, Claude):** grep na sieťové odkazy — jediné
  `http` v kóde sú SVG namespace konštanty (nie sieť). Všetkých 12 odkazov na
  obrázky + 17 na mp3 porovnaných s výpisom disku: zhoda 1:1 vrátane veľkosti
  písmen (bezpečné pre case-sensitive GitHub Pages).
- **Normalizácia hesla overená v kóde** (`normalizujHeslo`, app.js:436): NFD +
  odstránenie diakritiky + lowercase + zlúčenie medzier + trim, aplikované na
  zadané AJ uložené heslo.
- **TS-002 (Jakub, manuálne):** Wi-Fi vypnutá, `index.html` z `file://` —
  obrázky, zvuky, localStorage OK.
- **TS-007 generálka (Jakub, manuálne, bez internetu):** všetkých 5 dní
  s reálnymi heslami; test bez diakritiky (prešlo), s preklepom (neprešlo,
  ticho + shake), Enter, prázdne pole (nič — nové správanie po vypnutí TEST
  režimu); slučka harfy bez počuteľného švu; celé finále dobehlo. Výsledok:
  **všetko funguje**.

## Falsifier
Keby generálka s reálnymi heslami zlyhala na diakritike/preklepe, alebo keby
offline chýbal čo i len jeden asset, fáza by neprešla. Nič také nenastalo.

## Note to future-self
- Zo go-live checklistu (S14) ostáva JEDINÝ bod: hlasitosti doladiť na mieste
  na táborovej aparatúre (`HLASITOSTI` v `app.js`).
- Pred pushom rozhodnúť: repo je PUBLIC a heslá dní sú čitateľné v `app.js`
  (aj cez Pages). Nechať public vs. prepnúť na private — rozhodnutie Jakuba.
- Offline test na Windows nemôže odhaliť case-mismatch (FS je case-insensitive);
  preto sa case kontroloval staticky proti výpisu disku — držať tento zvyk pri
  každom novom assete.
