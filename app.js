/* =========================================================================
   Dávidova cesta — logika (Fáza 2: stavový model + localStorage + odomknutie)
   Dátami riadený návrh: 1 konfigurácia dní + odvodené stavy + 1 automat odomknutia.

   ANTI-SPOILER (BR-003): symbol ANI názov lokácie sa NEVLOŽÍ do DOM, kým deň nie je
   dokončený. Heslá a názvy sú len tu v JS zdroji (jediný domov faktu), nikdy nie na
   obrazovke pred odomknutím. Modál na heslo je neutrálny (neukazuje, ktorá lokácia to je).
   ========================================================================= */

"use strict";

/* =========================================================================
   ⚠ TEST REŽIM — PRED GO-LIVE PREPNÚŤ NA false! ⚠
   true = heslá sa NEkontrolujú: „Odomknúť" (aj Enter) odomkne deň aj s prázdnym
   poľom — na rýchle preklikanie celého toku pri testovaní. Kým je zapnutý, na
   obrazovke svieti štítok „TEST" (poistka, aby sa nezabudol vypnúť na tábore).
   ========================================================================= */
var TEST_REZIM_BEZ_HESIEL = true;

/* =========================================================================
   Zvuk (Fáza 6)
   Filozofia (BRS sekcia 10): harfa `ambient` hrá nepretržito v slučke; ostatné
   zvuky sú efekty/podklady ponad ňu. Tvrdé pravidlá: všetko lokálne (offline);
   chýbajúci/nefunkčný mp3 = TICHO, žiadny pád (EC-005); pri nesprávnom hesle sa
   žiadny zvuk NEprehrá (BRS zákaz); ambient štartuje až pri prvom kliku vedúceho
   (prehliadače blokujú autoplay pred interakciou).

   Per-zvuk hlasitosti (Jakub, ladenie v prehliadači): harfa je jemný podklad,
   `water` bol prisilný (prehlušoval harfu) → dole; `cave` bol slabý → hore.
   Počas odomknutia (zámok + „wow") sa harfa stlmí na 0 a po návrate na mapu vráti,
   aby zámok a wow vynikli. Zvuky prostredia dňa (birds/wind/leaves/cave/market)
   hrajú v SLUČKE — NIE pri clue, ale až po odhalení symbolu (po „wow" light_reveal),
   kým sa pergamen nezavrie (návrat na mapu). Zastavenie rieši zavriHeslo→zastavProstredie
   (pokrýva dokončenie aj skip/Escape/reset).
   ========================================================================= */

/* Cieľové hlasitosti 0..1 pre každý zvuk (chýbajúci kľúč = 1,0). Jediný domov
   vyváženia — ladí sa tu, nie roztrúsene po volaniach. */
var HLASITOSTI = {
  ambient: 0.45,        // jemný podklad
  water: 0.35,          // (už nenapojený — rezerva; hodnota ponechaná)
  cave: 1.0,            // bol slabý → naplno
  birds: 0.9,           // prostredia zhlasnené (0.7→0.9), nech vyniknú spolu so symbolom
  sheep: 0.7,           // ovce hrajú spolu s vtákmi (D1) → o čosi tichšie, nech sa neprehlušia
  wind: 1.0,            // prostredie D2 (Prak) — naplno (vietor je slabý zvuk, strácal sa)
  leaves: 0.9,
  market: 0.7,          // ruch trhu = prostredie D5 (Jeruzalem) — hlasitosť OK, nechaná
  seal_crack: 1.0,
  light_reveal: 1.0,
  celebration: 1.0,
  whoosh: 1.0,          // dlhý prelet cez celú vlnu — naplno, nech vynikne nad harfou
  mystery: 0.9,
  tick: 0.8,            // tikanie počas lúštenia šifry
  kroky: 0.9,           // putovanie počas kreslenia cesty (mäkký zvuk, nech ho vidno nad harfou)
  pergamen: 0.8         // rozbalenie zvitku (otvorenie clue) + zrolovanie (zatvorenie)
};

/* Ambient smie hrať až po prvom geste vedúceho. Kým je false, prehraj() efekty
   preskočí — bez interakcie by ich prehliadač aj tak odmietol (a robili by hluk). */
var zvukOdomknuty = false;

/* Globálne stíšenie z menu („Vypnúť zvuk"), uložené v localStorage (prežije reštart). */
var STORAGE_ZVUK_KLUC = "davidovaCesta.zvuk";
var zvukVypnuty = nacitajZvukVypnuty();

/** @returns {boolean} či má byť zvuk vypnutý (z localStorage; default zapnutý). */
function nacitajZvukVypnuty() {
  try {
    return window.localStorage.getItem(STORAGE_ZVUK_KLUC) === "off";
  } catch (e) {
    return false;                       // úložisko blokované → default zapnutý
  }
}

/**
 * Vráti cieľovú hlasitosť zvuku so zohľadnením globálneho vypnutia.
 * @param {string} nazov - kľúč zvuku.
 * @returns {number} 0..1 (0 keď je zvuk vypnutý cez menu).
 */
function cielovaHlasitost(nazov) {
  if (zvukVypnuty) return 0;
  return typeof HLASITOSTI[nazov] === "number" ? HLASITOSTI[nazov] : 1;
}

/** Nastaví hlasitosť daného <audio> na cieľovú (ticho pri chýbajúcom elemente). */
function nastavHlasitost(nazov) {
  try {
    var el = document.getElementById("zvuk-" + nazov);
    if (el) el.volume = cielovaHlasitost(nazov);
  } catch (e) {
    // element nedostupný → ticho, appka beží ďalej
  }
}

/** Prehrá zvuk (efekt aj loop) po nastavení hlasitosti; spoločné jadro. */
function spustiZvuk(nazov, odZaciatku) {
  if (!zvukOdomknuty) return;           // pred prvým gestom vedúceho žiadny zvuk
  try {
    var el = document.getElementById("zvuk-" + nazov);
    if (!el) return;
    el.volume = cielovaHlasitost(nazov);
    if (odZaciatku) el.currentTime = 0;
    var p = el.play();
    // play() vracia promise; na file:// / pri chýbajúcom súbore je rejected → prehltni
    if (p && typeof p.catch === "function") p.catch(function () {});
  } catch (e) {
    // element/audio nedostupné → ticho, appka beží ďalej
  }
}

/**
 * Prehrá krátky JEDNORAZOVý efekt ponad harfu (napr. seal_crack, light_reveal).
 * @param {string} nazov - kľúč zvuku (bez prefixu "zvuk-").
 */
function prehraj(nazov) {
  spustiZvuk(nazov, true);
}

/* Ktoré zvuky prostredia práve hrajú v slučke (prázdne = žiadny). Pole, lebo deň smie
   mať viac súčasných prostredí (D1 = ovce + vtáky). Držíme ich, aby sme ich pri zavretí
   pergamenu vedeli všetky zastaviť. Loop rieši `loop` atribút na <audio>. */
var zvukyProstrediaHraju = [];

/**
 * Spustí zvuk(y) prostredia dňa v slučke (hrajú po odhalení symbolu do zavretia pergamenu).
 * @param {string|string[]} nazvy - kľúč zvuku prostredia, alebo pole kľúčov (viac naraz).
 */
function spustiProstredie(nazvy) {
  zastavProstredie();                   // istota: začíname z čistého stavu (žiadne duplicity)
  var pole = Array.isArray(nazvy) ? nazvy : [nazvy];
  for (var i = 0; i < pole.length; i++) {
    zvukyProstrediaHraju.push(pole[i]);
    spustiZvuk(pole[i], true);
  }
}

/** Zastaví daný <audio> (pauza + presun na začiatok). Ticho pri chýbajúcom elemente. */
function zastavZvuk(nazov) {
  try {
    var el = document.getElementById("zvuk-" + nazov);
    if (el) { el.pause(); el.currentTime = 0; }
  } catch (e) {
    // element nedostupný → ticho
  }
}

/** Zastaví všetky bežiace zvuky prostredia (pri zavretí pergamenu, resete). */
function zastavProstredie() {
  zrusFadeProstredia();                 // istota: ak práve beží fade, zastav ho (žiadny „duch")
  for (var i = 0; i < zvukyProstrediaHraju.length; i++) {
    zastavZvuk(zvukyProstrediaHraju[i]);
  }
  zvukyProstrediaHraju = [];
}

/* Bežiaci fade-out prostredia (interval id) — držíme ho, aby ho reset/skip vedeli zrušiť. */
var fadeProstrediaInterval = null;
var TRVANIE_FADE_PROSTREDIA_MS = 800;   // ako dlho prostredie postupne stíchne pred návratom harfy
var KROK_FADE_MS = 50;                  // ako často znižujeme hlasitosť (plynulosť fade)

/** Zruší prebiehajúci fade-out prostredia (bez dokončenia). Ticho pri žiadnom fade. */
function zrusFadeProstredia() {
  if (fadeProstrediaInterval !== null) {
    window.clearInterval(fadeProstrediaInterval);
    fadeProstrediaInterval = null;
  }
}

/**
 * Postupne stíši všetky bežiace prostredia na 0, potom zavolá hotovo(). Jemný prechod
 * prostredie → (ticho) → harfa: harfa sa vracia až v hotovo(). Ak práve žiadne prostredie
 * nehrá, zavolá hotovo() hneď (netreba nič stišovať).
 * @param {Function} hotovo - callback po dobehnutí fade (vráti harfu, zavrie pergamen).
 */
function fadeOutProstredia(hotovo) {
  zrusFadeProstredia();
  if (zvukyProstrediaHraju.length === 0) { if (hotovo) hotovo(); return; }
  var krokov = Math.max(1, Math.round(TRVANIE_FADE_PROSTREDIA_MS / KROK_FADE_MS));
  var zostava = krokov;
  fadeProstrediaInterval = window.setInterval(function () {
    zostava--;
    var podiel = Math.max(0, zostava / krokov);   // 1 → 0 lineárne
    for (var i = 0; i < zvukyProstrediaHraju.length; i++) {
      var el = document.getElementById("zvuk-" + zvukyProstrediaHraju[i]);
      if (el) { try { el.volume = cielovaHlasitost(zvukyProstrediaHraju[i]) * podiel; } catch (e) {} }
    }
    if (zostava <= 0) { zrusFadeProstredia(); if (hotovo) hotovo(); }
  }, KROK_FADE_MS);
}

/** Zastaví svišťanie svetelnej vlny (po dobehnutí vlny alebo pri ukončení finále). */
function zastavVlnu() {
  zastavZvuk("whoosh");
}

/** Zastaví tikanie šifry (pri prechode na kód/truhlicu alebo ukončení finále). */
function zastavTikanie() {
  zastavZvuk("tick");
}

/* Znížená hlasitosť harfy počas clue + zadávania hesla — jemnejší podklad, nech dlhé
   lúštenie neruší. Pretrváva od otvorClue až po odomknutie/zavretie pergamenu. */
var HLASITOST_HARFY_CLUE = 0.20;

/**
 * Stlmí/obnoví harfu. Používa sa počas odomknutia (zámok + „wow") aj počas clue.
 * @param {boolean|number} stlm - true = na 0; false = späť na cieľovú hlasitosť;
 *   číslo 0..1 = harfa priamo na túto úroveň (ale nie hlasnejšie než jej cieľová).
 */
function stlmHarfu(stlm) {
  try {
    var el = document.getElementById("zvuk-ambient");
    if (!el) return;
    var ciel = cielovaHlasitost("ambient");
    if (stlm === true) el.volume = 0;
    else if (stlm === false) el.volume = ciel;
    else el.volume = Math.min(stlm, ciel);   // číselná úroveň, nikdy nad cieľovú (rešpektuje vypnutý zvuk)
  } catch (e) {
    // harfa nedostupná → ticho
  }
}

/**
 * Naštartuje harfu na pozadí (slučka). Volá sa raz, pri prvom geste vedúceho.
 * Idempotentné: opakované volanie na už hrajúcej harfe nič nepokazí.
 */
function spustiAmbient() {
  nastavHlasitost("ambient");
  spustiZvuk("ambient", false);
}

/**
 * Odomkne zvuk pri prvom geste vedúceho a naštartuje harfu. Naviaže sa v start()
 * ako JEDNORAZOVý poslucháč (once) na celý dokument, takže zafunguje nech je prvý
 * klik kdekoľvek (Začať, mapa, menu…). Druhýkrát sa už nevolá → harfa sa nereštartuje.
 */
function odomkniZvuk() {
  if (zvukOdomknuty) return;
  zvukOdomknuty = true;
  spustiAmbient();
}

/**
 * Prepne globálne vypnutie zvuku (menu). Uloží stav, stlmí/obnoví harfu aj bežiace
 * prostredie hneď. Ak sa práve zapol a harfa ešte nehrá (nikto neklikol), naštartuje ju.
 */
function prepniZvuk() {
  zvukVypnuty = !zvukVypnuty;
  try {
    window.localStorage.setItem(STORAGE_ZVUK_KLUC, zvukVypnuty ? "off" : "on");
  } catch (e) {
    // úložisko blokované → aspoň v tomto behu platí premenná
  }
  nastavHlasitost("ambient");           // okamžite premietni na hrajúcu harfu
  for (var i = 0; i < zvukyProstrediaHraju.length; i++) {
    nastavHlasitost(zvukyProstrediaHraju[i]);   // aj na všetky bežiace prostredia
  }
  if (!zvukVypnuty) odomkniZvuk();      // zapnutie z menu ráta ako gesto → rozohrá harfu
  obnovMenuZvuk();
}

/** Zosúladí ikonu zvuku (reproduktor ↔ preškrtnutý) a jej popis s aktuálnym stavom. */
function obnovMenuZvuk() {
  var el = document.getElementById("tlacidlo-zvuk");
  if (!el) return;
  el.classList.toggle("zvuk-vypnuty", zvukVypnuty);        // CSS prepne, ktoré SVG je viditeľné
  el.setAttribute("aria-label", zvukVypnuty ? "Zapnúť zvuk" : "Vypnúť zvuk");
}

/* --- Vizuálne stavy zastávky (odvodené zo stavu, nie natvrdo) --- */
var STAV = {
  DOKONCENA: "dokoncena",
  AKTIVNA: "aktivna",
  UZAMKNUTA: "uzamknuta"
};

/*
  Konfigurácia 5 dní — JEDINÝ domov hesiel, symbolov, pozícií a clue slov (single-source).
  x/y   = STRED bodu na mape v % šírky/výšky javiska (orientačné, ladíme v prehliadači).
  heslo = zámerne tu (bráni odomknutiu); do DOM sa nikdy nedostane pred odomknutím.
  clue  = položky na clue pergamene (obr.3). Každá má vlastné cx/cy v % PERGAMENU —
          voľné, „artové" rozmiestnenie (FR-017: nie riadok/stĺpec/logické poradie).
          Pozície sú NAPEVNO (žiadny náhodný generátor) → offline a opakovateľné.
  Obsah dní podľa BRS sekcie 7; D1 heslo+clue je potvrdená odchýlka od BRS (S3, Jakub):
  BRS uvádza „BOH VIDÍ TVOJE SRDCE" — appka používa „Hospodin hľadí na tvoje srdce".
*/
var DNI = [
  { id: "D1", nazov: "Pastier",   symbol: "app_images/PASTIER_chlapec.png",  heslo: "Hospodin hľadí na tvoje srdce", x: 11, y: 71,
    zvuk: ["birds", "sheep"],  // Pastier: ovce + vtáky spolu = atmosféra lúky (viac zvukov naraz)
    // Medzibody cesty D1→D2 (kľukatá cesta cez mostík v pozadí mapy), v % javiska. Vyladené v ladenie-cesty.html.
    body: [{ x: 21, y: 71.3 }, { x: 25, y: 75 }, { x: 30.5, y: 72.7 }, { x: 34.8, y: 68.3 }],
    // Pastier: orezaný výrez len chlapca + ovečky pri pravej nohe (PASTIER_chlapec.png, bez
    // stromu a stáda), centrovaný v kruhu (contain). Veľkosť zladená s jaskyňou (nie príliš veľký).
    mapa: { velkost: "86%", fit: "contain", posunX: "6%", posunY: "-6%" },
    clue: [
      { text: "HOSPODIN", cx: 34, cy: 16 },
      { text: "TVOJE",    cx: 70, cy: 40 },
      { text: "SRDCE",    cx: 38, cy: 74 },
      { text: "HĽADÍ",    cx: 66, cy: 60 },
      { text: "NA",       cx: 20, cy: 52 }
    ] },
  { id: "D2", nazov: "Prak",      symbol: "app_images/PRAK_blizko.png",      heslo: "ODVAHA", x: 37, y: 54,
    zvuk: "wind",              // prak = kameň letiaci vzduchom → vietor (nie voda)
    // Medzibody cesty D2→D3, v % javiska. Vyladené v ladenie-cesty.html.
    body: [{ x: 44.7, y: 46.8 }, { x: 48, y: 43.3 }],
    // Prak+kamene: prekomponované, prak a kamene priložené tesne k sebe (PRAK_blizko.png,
    // bez veľkej medzery) → väčšie a výraznejšie v kruhu. Contain, bez orezu, rámik ostáva.
    // Zmenšený, aby sa prak+kamene zmestili do kruhu bez orezu bokov (obsah ide od kraja po kraj).
    mapa: { velkost: "74%", fit: "contain", orez: false },
    clue: [
      { text: "A", cx: 28, cy: 16 },
      { text: "H", cx: 68, cy: 22 },
      { text: "O", cx: 20, cy: 54 },
      { text: "V", cx: 52, cy: 44 },
      { text: "D", cx: 78, cy: 58 },
      { text: "A", cx: 40, cy: 74 }
    ] },
  { id: "D3", nazov: "Jonatán",   symbol: "app_images/JONATAN_sat.png",  heslo: "PRIATEĽ MILUJE V KAŽDOM ČASE", x: 52, y: 30,
    zvuk: "leaves",
    // Medzibody cesty D3→D4, v % javiska. Vyladené v ladenie-cesty.html.
    body: [{ x: 57.3, y: 50.2 }, { x: 59, y: 51.6 }, { x: 57, y: 60.1 }, { x: 52.5, y: 63.8 },
           { x: 51.6, y: 69.3 }, { x: 58, y: 74.4 }, { x: 61.3, y: 79 }, { x: 64, y: 76.7 }],
    // Jonatán (strom s lukom a tulcom): sýtejšia/kontrastnejšia verzia — výraznejší voči mape.
    // Zmenšený vnútri kruhu, aby bol zladený s ostatnými symbolmi (najmä jaskyňou).
    mapa: { velkost: "82%", fit: "contain", orez: false },
    clue: [
      { text: "MILUJE",  cx: 30, cy: 18 },
      { text: "PRIATEĽ", cx: 62, cy: 40 },
      { text: "V",       cx: 22, cy: 52 },
      { text: "ČASE",    cx: 72, cy: 64 },
      { text: "KAŽDOM",  cx: 40, cy: 74 }
    ] },
  { id: "D4", nazov: "Jaskyňa",   symbol: "app_images/jask_sat.png",      heslo: "JASKYŇA", x: 70, y: 60,
    zvuk: "cave",
    // Medzibody cesty D4→D5, v % javiska. Vyladené v ladenie-cesty.html.
    body: [{ x: 77.5, y: 45.9 }, { x: 79.8, y: 41.1 }, { x: 83.9, y: 39.7 }],
    // Jaskyňa: sýtejšia/kontrastnejšia verzia (jask_sat.png) — výraznejšia voči pozadiu mapy.
    // Zväčšená, aby veľkostne sadla k ostatným (pozor: príliš veľké contain oreže boky kruhom).
    mapa: { velkost: "102%", fit: "contain", orez: false },
    clue: [
      { text: "netopier",  cx: 32, cy: 16 },
      { text: "ozvena",    cx: 68, cy: 32 },
      { text: "stalagmit", cx: 46, cy: 52 },
      { text: "tma",       cx: 24, cy: 70 },
      { text: "zima",      cx: 72, cy: 74 }
    ] },
  { id: "D5", nazov: "Jeruzalem", symbol: "app_images/JERUZALEM_sat.png", heslo: "BOH MA VIEDOL CELÚ CESTU", x: 88, y: 22,
    zvuk: "market",
    // Jeruzalem: sýtejšia/kontrastnejšia verzia (JERUZALEM_sat.png) — výraznejší voči pozadiu mapy.
    mapa: { velkost: "96%", fit: "contain", orez: false },
    clue: [
      { text: "VIEDOL", cx: 32, cy: 18 },
      { text: "BOH",    cx: 68, cy: 30 },
      { text: "CELÚ",   cx: 26, cy: 60 },
      { text: "CESTU",  cx: 66, cy: 74 },
      { text: "MA",     cx: 48, cy: 46 }
    ] }
];

/* --- Perzistencia postupu --------------------------------------------- */
var STORAGE_KLUC = "davidovaCesta.v1";
var VYCHODZI_STAV = { verzia: 1, dokonceneDni: 0, koniecVideny: false };

/*
  Záložná kópia stavu v pamäti pre prípad, že localStorage je zablokovaný
  (incognito / prísne nastavenia). Vtedy postup vydrží aspoň počas behu.
*/
var pamatovyStav = null;

/** @returns {Object} plytká kópia stavu (aby sa vonkajší VYCHODZI_STAV nemenil). */
function kopiaStavu(s) {
  return { verzia: 1, dokonceneDni: s.dokonceneDni, koniecVideny: !!s.koniecVideny };
}

/**
 * Načíta postup z localStorage. Guard: dokonceneDni musí byť celé číslo 0..5,
 * inak (poškodený/cudzí zápis) padáme na východzí stav.
 * @returns {Object} stav {verzia, dokonceneDni, koniecVideny}.
 */
function nacitajStav() {
  try {
    var raw = window.localStorage.getItem(STORAGE_KLUC);
    if (!raw) return kopiaStavu(VYCHODZI_STAV);
    var s = JSON.parse(raw);
    if (typeof s.dokonceneDni !== "number" ||
        s.dokonceneDni < 0 || s.dokonceneDni > DNI.length) {
      return kopiaStavu(VYCHODZI_STAV);
    }
    return kopiaStavu(s);
  } catch (e) {
    // localStorage nedostupné alebo poškodený JSON → pamäťový/východzí stav
    return kopiaStavu(pamatovyStav || VYCHODZI_STAV);
  }
}

/**
 * Uloží postup. Vždy najprv do pamäte (fallback), potom skús localStorage.
 * @param {Object} stav - stav na uloženie.
 */
function ulozStav(stav) {
  pamatovyStav = kopiaStavu(stav);
  try {
    window.localStorage.setItem(STORAGE_KLUC, JSON.stringify(pamatovyStav));
  } catch (e) {
    // úložisko blokované → beží sa aspoň z pamäťového stavu, appka nespadne
  }
}

/* --- Odvodenie vizuálneho stavu zastávky zo stavu postupu -------------- */
/**
 * @param {number} index - poradie dňa (0..4).
 * @param {Object} stav - stav postupu.
 * @returns {string} STAV.DOKONCENA | STAV.AKTIVNA | STAV.UZAMKNUTA.
 */
function stavZastavky(index, stav) {
  if (index < stav.dokonceneDni) return STAV.DOKONCENA;
  if (index === stav.dokonceneDni && index < DNI.length) return STAV.AKTIVNA;
  return STAV.UZAMKNUTA;
}

/* --- Normalizácia hesla ------------------------------------------------ */
/**
 * Zjednotí heslo na porovnanie: bez diakritiky, malé písmená, bez nadbytočných
 * a okrajových medzier. Aplikuje sa na zadané aj na uložené heslo rovnako.
 * @param {string} text - vstupný text.
 * @returns {string} normalizovaný tvar.
 */
function normalizujHeslo(text) {
  return String(text)
    .normalize("NFD")
    .replace(/\p{M}/gu, "")             // odstráni diakritické znamienka (Unicode kategória Mark)
    .toLowerCase()
    .replace(/\s+/g, " ")               // zlúči viacnásobné medzery
    .trim();
}

/* =========================================================================
   Vykreslenie mapy
   ========================================================================= */

/** Vytvorí neutrálnu ikonu zámku (inline SVG — deterministická, offline). */
function vytvorZamok() {
  var obal = document.createElement("span");
  obal.className = "zamok";
  obal.innerHTML =
    '<svg viewBox="0 0 24 24" aria-hidden="true">' +
    '<rect x="5" y="10" width="14" height="10" rx="2" fill="currentColor"></rect>' +
    '<path d="M8 10V7a4 4 0 0 1 8 0v3" fill="none" stroke="currentColor" stroke-width="2"></path>' +
    "</svg>";
  return obal;
}

/** Vytvorí pulzujúci bod pre aktívnu zastávku (bez symbolu — žiadny spoiler). */
function vytvorMarker() {
  var bod = document.createElement("span");
  bod.className = "marker";
  return bod;
}

/**
 * Poistka proti nenačítanému obrázku (Fáza 7, EC — rozbitá ikona na stene).
 * Ak sa `src` nepodarí načítať (chýbajúci súbor, iná veľkosť písmen na Pages),
 * `<img>` sa SKRYJE → ostane neutrálny čierny podklad javiska/pergamenu, nikdy
 * rozbitá ikona ani prázdny alt rámik. Žiadny náhradný obrázok/text → žiadny
 * spoiler (BR-003). `onload` element zas zobrazí, aby striedané pozadia
 * (`heslo-pozadie` pregamen↔ODOMKNUTIE) po jednej chybe nezhasli natrvalo.
 * @param {HTMLImageElement} img - element, ktorý sa má chrániť.
 */
function pripravFallbackObrazka(img) {
  if (!img) { return; }
  img.addEventListener("error", function () { img.style.visibility = "hidden"; });
  img.addEventListener("load", function () { img.style.visibility = ""; });
  // Statický obrázok mohol zlyhať už PRED naviazaním poslucháča (event sa
  // znova nespustí). complete && naturalWidth===0 = načítanie skončilo chybou.
  if (img.getAttribute("src") && img.complete && img.naturalWidth === 0) {
    img.style.visibility = "hidden";
  }
}

/**
 * Aplikuje voliteľné per-deň doladenie symbolu na mape cez CSS premenné.
 * Bez `mapa` sa nič nenastaví → platí default z CSS (cover + kruh, veľkosť 86 %).
 * @param {HTMLImageElement} img - element symbolu.
 * @param {Object} [mapa] - { velkost, fit, orez, posunX, posunY } — všetky voliteľné.
 */
function nastavMapuSymbolu(img, mapa) {
  if (!mapa) { return; }
  if (mapa.velkost) { img.style.setProperty("--sym-velkost", mapa.velkost); }
  if (mapa.fit)     { img.style.setProperty("--sym-fit", mapa.fit); }
  if (mapa.orez === false) { img.style.setProperty("--sym-radius", "0"); }
  if (mapa.posunX)  { img.style.setProperty("--sym-posun-x", mapa.posunX); }
  if (mapa.posunY)  { img.style.setProperty("--sym-posun-y", mapa.posunY); }
}

/**
 * Vykreslí jednu zastávku podľa jej stavu.
 * Symbol/názov sa vloží IBA pri DOKONCENA (BR-003). Aktívna je klikateľná.
 * @param {Object} den - konfigurácia dňa.
 * @param {string} stav - vizuálny stav.
 * @param {number} index - poradie dňa (pre obsluhu kliku).
 * @param {boolean} [prechodCesty] - true = práve sa kreslí cesta k aktívnemu bodu →
 *   aktívny bod dostane prekrytie `zamok-kryt` (vyzerá ďalej uzamknuto, hmla + zámok);
 *   po príchode cesty ho CSS rozplynie a bod „ožije" (záblesk + pulz).
 * @returns {HTMLElement} element zastávky.
 */
function vytvorZastavku(den, stav, index, prechodCesty) {
  var el = document.createElement("div");
  el.className = "zastavka stav-" + stav;
  el.style.left = den.x + "%";
  el.style.top = den.y + "%";
  el.style.setProperty("--poradie", index);   // oneskorenie svetelnej vlny finále (D1→D5)

  if (stav === STAV.DOKONCENA) {
    var img = document.createElement("img");
    img.className = "symbol";
    pripravFallbackObrazka(img);         // poistka pred priradením src (Fáza 7)
    img.src = den.symbol;
    img.alt = den.nazov;                 // názov smie byť v DOM len po dokončení
    nastavMapuSymbolu(img, den.mapa);    // voliteľné per-deň doladenie (veľkosť/orez/posun)
    el.appendChild(img);
    if (index === DNI.length - 1) {
      // Dokončený Jeruzalem = všetko odomknuté → klik prehrá finále znova.
      // stopPropagation: ten istý klik by inak prebublal na mapu, ktorej handler
      // vlny by čerstvo spustené finále hneď preskočil na záverečnú obrazovku.
      el.classList.add("klikatelna");
      el.addEventListener("click", function (e) {
        e.stopPropagation();
        spustiFinale();
      });
    }
  } else if (stav === STAV.AKTIVNA) {
    el.classList.add("klikatelna");
    el.appendChild(vytvorMarker());
    if (prechodCesty) {
      // Kým cesta „putuje" k bodu, bod vyzerá ako doteraz — uzamknutý (hmla + zámok).
      // Prekrytie je position:absolute (mimo grid toku, neposunie marker). Po príchode
      // cesty ho CSS rozplynie (zmiznutieKrytu) a bod sa prebudí (prebudenieKruhu).
      var kryt = document.createElement("span");
      kryt.className = "zamok-kryt";
      kryt.appendChild(vytvorZamok());
      el.appendChild(kryt);
    }
    el.addEventListener("click", function () { otvorClue(index); });
  } else {
    el.appendChild(vytvorZamok());       // uzamknutá: hmla + zámok, nič viac
  }
  return el;
}

// Polomer kruhu zastávky = 7,5 % ŠÍRKY javiska (CSS `.zastavka { width: 15cqw }`,
// t.j. priemer 15 % šírky). Single source: ak sa v CSS zmení 15cqw, zmeň aj toto.
var POLOMER_ZASTAVKY_SIRKA = 0.075;
// Malá medzera navyše, aby sa čiara okraja kruhu nedotýkala (v px javiska).
var MEDZERA_CESTY_PX = 6;
// Rozmery bodkovej cesty ako POMER k šírke javiska (nie pevné px), aby bodky vyzerali
// rovnako veľké pri každej veľkosti okna aj na projektore (inak sú na veľkej mape drobné).
// Ladené voči šírke ~950 px (pôvodné px: core 4, halo 8, dash 3/13).
var HRUBKA_JADRA_SIRKA = 0.0042;     // core stroke-width (≈ 4 px pri 950)
var HRUBKA_HALO_SIRKA = 0.0084;      // halo stroke-width (≈ 8 px)
var BODKA_SIRKA = 0.0032;            // dĺžka bodky v dash (≈ 3 px)
var MEDZERA_BODIEK_SIRKA = 0.0137;   // medzera medzi bodkami (≈ 13 px)

/**
 * Vykreslí zlatú prerušovanú „cestu" po zastávkach až k práve aktívnemu (blikajúcemu) bodu.
 * BR-003 (žiadny spoiler): cesta smie končiť najviac pri AKTÍVNOM bode — ten už svoju
 * polohu ukazuje blikaním, takže cesta k nemu neprezradí nič navyše (symbol ostáva skrytý).
 * Nikdy sa NEkreslí k UZAMKNUTÉMU bodu (index > dokonceneDni) — to by odhalilo jeho polohu.
 * Počet segmentov = `min(dokonceneDni, DNI.length-1)` (po D5 už žiadny aktívny nie je).
 *
 * Každý segment sa skráti o polomer kruhu (+ malá medzera) na oboch koncoch, aby
 * čiara končila PRI OKRAJI zastávky, nie v jej strede (Janka: nech neprechádza cez kruh).
 * Skracovanie sa počíta v PIXELOCH javiska — % na osi X a Y majú rôznu dĺžku (16:9),
 * takže odsun v % by dal na každej osi inú medzeru. Súradnice bodov ostávajú v % (DNI[].x/y).
 *
 * Ak `animujPosledny` je true, POSLEDNÝ (najnovší) segment sa vykreslí cez `vytvorAnimovanuCestu`
 * — maska ho postupne odkryje po dĺžke trasy (sleduje ohyby cesty). Staré segmenty sú
 * vždy hneď plné. Volá sa tak len po odomknutí dňa.
 * @param {Object} stav - stav s poľom `dokonceneDni`.
 * @param {boolean} [animujPosledny] - animovať najnovší segment (default false = všetko staticky).
 */
function vykresliCestu(stav, animujPosledny) {
  var svg = document.getElementById("cesta");
  svg.innerHTML = "";
  var rect = svg.getBoundingClientRect();
  var W = rect.width, H = rect.height;
  // Ak je mapa skrytá/pred layoutom, rect je 0×0 → odsun 0 a všetky súradnice 0;
  // guard `dlzka <= 2*odsun` (0<=0) potom preskočí všetky segmenty → nenakreslí sa
  // nič a nedôjde k deleniu nulou. Cesta sa dokreslí, keď je mapa viditeľná.
  var odsun = (W > 0) ? POLOMER_ZASTAVKY_SIRKA * W + MEDZERA_CESTY_PX : 0;
  // Cesta vedie od dokončených bodov až k práve AKTÍVNEMU (blikajúcemu) bodu — ten už
  // svoju polohu ukazuje blikaním, takže cesta k nemu neprezradí nič navyše (symbol
  // ostáva skrytý). Nikdy sa NEkreslí k uzamknutému bodu (index > dokonceneDni) — to by
  // odhalilo jeho polohu (BR-003). Posledný spájaný index = aktívny bod, teda dokonceneDni
  // (ak ešte existuje; po D5 už žiadny aktívny nie je → hranica je posledný dokončený).
  var poslednyBod = Math.min(stav.dokonceneDni, DNI.length - 1);
  var poslednyIndex = poslednyBod - 1;         // i posledného segmentu (spája i a i+1)

  // Segment i spája bod i a i+1, kde i+1 <= poslednyBod (posledný smie byť aktívny, nie uzamknutý).
  for (var i = 0; i + 1 <= poslednyBod; i++) {
    // Zoznam bodov cesty v px: zastávka A → voliteľné medzibody (DNI[i].body) → zastávka B.
    // Medzibody (kľukatá cesta cez mostíky) sú v % javiska; prázdne pole = rovná čiara.
    var body = [{ x: DNI[i].x / 100 * W, y: DNI[i].y / 100 * H }];
    (DNI[i].body || []).forEach(function (b) {
      body.push({ x: b.x / 100 * W, y: b.y / 100 * H });
    });
    body.push({ x: DNI[i + 1].x / 100 * W, y: DNI[i + 1].y / 100 * H });

    // Skráť oba konce o polomer kruhu (+ medzera) v smere k susednému bodu, aby cesta
    // končila PRI OKRAJI zastávky, nie v jej strede. Skracuje sa voči prvému/poslednému
    // medzibodu (nie voči celkovému smeru), lebo cesta môže zo zastávky vychádzať šikmo.
    if (!skratKoniec(body, 0, 1, odsun)) { continue; }               // začiatok pri A
    if (!skratKoniec(body, body.length - 1, body.length - 2, odsun)) { continue; }  // koniec pri B

    var d = cestaZBodov(body);                                       // hladká krivka cez body
    // Variant D: dve krivky na segment — tmavý obrys (halo) POD zlatým jadrom (core).
    var halo = vytvorSegment(d, "halo", W);
    var core = vytvorSegment(d, "core", W);

    if (animujPosledny && i === poslednyIndex && W > 0) {
      // Najnovší segment sa animuje: bodky sa odkrývajú PO DĹŽKE trasy (sledujú každý ohyb
      // kľukatej cesty — dole, potom doprava…), nie jedným smerom. Technika: SVG maska =
      // plná biela čiara pozdĺž tej istej trasy, ktorá sa „kreslí" cez stroke-dashoffset;
      // maska postupne odkrýva bodkovaný segment presne v poradí od zastávky A po B.
      var anim = vytvorAnimovanuCestu(d, halo, core, W);
      svg.appendChild(anim.g);
      // Dĺžku merať AŽ po pripojení do DOM (getTotalLength je tak spoľahlivý v každom
      // prehliadači, nezávisle od podpory merania na odpojenom uzle) → potom spustiť animáciu.
      var dlzka = anim.maskaCiara.getTotalLength();
      anim.maskaCiara.style.setProperty("--dlzka-cesty", dlzka);
      // Kroky spusti až keď sa kreslenie REÁLNE začne (animationstart vystrelí po
      // uplynutí CSS pauzy --cesta-pauza) → zvuk presne sedí s pohybom. Ak prekreslenie
      // mapy element odstráni ešte pred štartom, udalosť nevznikne → žiadny zvuk navyše.
      anim.maskaCiara.addEventListener("animationstart", function () { prehraj("kroky"); });
      anim.maskaCiara.classList.add("kresli");
    } else {
      svg.appendChild(halo);
      svg.appendChild(core);
    }
  }
}

/**
 * Skráti koniec cesty: posunie bod na indexe `kon` o `odsun` px smerom k susedovi `sused`,
 * aby cesta začínala/končila pri OKRAJI kruhu zastávky. Mutuje pole `body`.
 * @returns {boolean} false ak je úsek kratší než odsun (cesta by sa obrátila) → nekresliť.
 */
function skratKoniec(body, kon, sused, odsun) {
  var dx = body[sused].x - body[kon].x, dy = body[sused].y - body[kon].y;
  var dl = Math.sqrt(dx * dx + dy * dy);
  if (dl <= odsun) { return false; }
  body[kon] = { x: body[kon].x + dx / dl * odsun, y: body[kon].y + dy / dl * odsun };
  return true;
}

/**
 * Zostaví SVG `d` atribút hladkej krivky prechádzajúcej VŠETKÝMI bodmi (Catmull-Rom →
 * kubické Bézier). Pri dvoch bodoch je to rovná čiara; pri viacerých plynulý oblúk cez ne.
 * @param {Array<{x:number,y:number}>} p - body cesty v px (min. 2).
 * @returns {string} hodnota atribútu `d`.
 */
function cestaZBodov(p) {
  var d = "M " + p[0].x + " " + p[0].y;
  for (var i = 0; i < p.length - 1; i++) {
    var p0 = p[i - 1] || p[i], p1 = p[i], p2 = p[i + 1], p3 = p[i + 2] || p2;
    // Catmull-Rom → Bézier ovládacie body (napätie 1/6 = štandardná hladkosť).
    var c1x = p1.x + (p2.x - p0.x) / 6, c1y = p1.y + (p2.y - p0.y) / 6;
    var c2x = p2.x - (p3.x - p1.x) / 6, c2y = p2.y - (p3.y - p1.y) / 6;
    d += " C " + c1x + " " + c1y + " " + c2x + " " + c2y + " " + p2.x + " " + p2.y;
  }
  return d;
}

/**
 * Vytvorí jeden SVG `<path>` cesty daného CSS druhu (halo/core) z hotového `d` atribútu.
 * Hrúbka a bodkovanie sa počítajú ako pomer k šírke javiska `W` → bodky vyzerajú rovnako
 * veľké pri každej veľkosti mapy (na projektore aj v malom okne). Farba je z CSS.
 * @returns {SVGPathElement}
 */
function vytvorSegment(d, trieda, W) {
  var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("class", trieda);
  path.setAttribute("d", d);
  var hrubka = (trieda === "halo" ? HRUBKA_HALO_SIRKA : HRUBKA_JADRA_SIRKA) * W;
  path.setAttribute("stroke-width", hrubka);
  path.setAttribute("stroke-dasharray", (BODKA_SIRKA * W) + " " + (MEDZERA_BODIEK_SIRKA * W));
  return path;
}

// Namespace pre SVG uzly (createElementNS je len identifikátor, nie sieťové volanie — file:// OK).
var SVG_NS = "http://www.w3.org/2000/svg";

/**
 * Zostaví skupinu s maskou, ktorá odkryje bodkovaný segment (halo+core) PO DĹŽKE trasy.
 * Maska = plná biela čiara pozdĺž tej istej krivky `d`. Vráti aj samotnú čiaru masky, aby
 * volajúci po PRIPOJENÍ do DOM zmeral jej dĺžku (`getTotalLength`) a spustil animáciu
 * pridaním triedy `.kresli` — meranie po pripojení je spoľahlivé v každom prehliadači.
 * @param {string} d - `d` atribút krivky segmentu.
 * @param {SVGPathElement} halo - bodkovaný obrys (už vytvorený).
 * @param {SVGPathElement} core - bodkové jadro (už vytvorené).
 * @param {number} W - šírka javiska v px (na škálovanie šírky masky).
 * @returns {{g: SVGGElement, maskaCiara: SVGPathElement}}
 */
function vytvorAnimovanuCestu(d, halo, core, W) {
  var maskaCiara = document.createElementNS(SVG_NS, "path");
  maskaCiara.setAttribute("d", d);
  maskaCiara.setAttribute("class", "cesta-maska-ciara");
  maskaCiara.setAttribute("fill", "none");
  maskaCiara.setAttribute("stroke", "#fff");
  // Maska musí byť aspoň taká hrubá ako halo, aby odkryla celé bodky (+ malá rezerva).
  maskaCiara.setAttribute("stroke-width", HRUBKA_HALO_SIRKA * W * 1.6);
  maskaCiara.setAttribute("stroke-linecap", "round");

  var maska = document.createElementNS(SVG_NS, "mask");
  var maskId = "cesta-odkryv";
  maska.setAttribute("id", maskId);
  maska.appendChild(maskaCiara);

  var g = document.createElementNS(SVG_NS, "g");
  g.appendChild(maska);
  var obsah = document.createElementNS(SVG_NS, "g");
  obsah.setAttribute("mask", "url(#" + maskId + ")");
  obsah.appendChild(halo);
  obsah.appendChild(core);
  g.appendChild(obsah);
  return { g: g, maskaCiara: maskaCiara };
}

/**
 * Prekreslí všetkých 5 zastávok podľa aktuálneho stavu.
 * @param {Object} stav - stav s poľom `dokonceneDni`.
 * @param {boolean} [animujCestu] - animovať najnovší segment cesty (len po odomknutí dňa).
 *   Pauza pred kreslením + samotné odkrytie sú v CSS (`.cesta-maska-ciara`), takže sa
 *   prekreslením mapy (reset/ďalší deň) čisto zrušia bez JS časovača.
 *
 * Poradie deja po odomknutí (Jakub): najprv sa „dôjde" po novej ceste k ďalšiemu bodu,
 * AŽ POTOM tento bod ožije. Keď sa reálne kreslí segment (existuje aspoň 1 dokončený
 * deň → cesta k aktívnemu bodu), pridá sa trieda `.cesta-kresli` na `#zastavky` a aktívny
 * bod dostane prekrytie `zamok-kryt` (vyzerá ďalej uzamknuto — hmla + zámok, žiadna
 * nespojitosť). Po príchode cesty CSS prekrytie rozplynie a bod sa prebudí (záblesk +
 * pulz). Štart appky (bez `animujCestu`) nič z toho nedostane → aktívny bod bliká hneď.
 * Všetko zaniká prekreslením mapy (žiadny JS časovač).
 */
function vykresliZastavky(stav, animujCestu) {
  vykresliCestu(stav, animujCestu);
  var box = document.getElementById("zastavky");
  box.innerHTML = "";
  // Cesta k práve aktívnemu bodu sa kreslí už po 1. dokončenom dni (Pastier→Prak). Vtedy
  // oddialime blikanie toho bodu, kým cesta nedobehne. Po D5 už aktívny bod nie je, ale
  // trieda neškodí (žiadny `.stav-aktivna` element, ktorý by ovplyvnila).
  var kresliSaCesta = animujCestu === true && stav.dokonceneDni >= 1;
  box.classList.toggle("cesta-kresli", kresliSaCesta);
  for (var i = 0; i < DNI.length; i++) {
    box.appendChild(vytvorZastavku(DNI[i], stavZastavky(i, stav), i, kresliSaCesta));
  }
}

/* =========================================================================
   Obrazovky + modál na heslo
   ========================================================================= */

/**
 * Prepne viditeľnú obrazovku (INTRO ↔ MAPA).
 * @param {string} idObrazovky - id sekcie, ktorá má byť viditeľná.
 */
function ukazObrazovku(idObrazovky) {
  var obrazovky = document.querySelectorAll(".obrazovka");
  for (var i = 0; i < obrazovky.length; i++) {
    obrazovky[i].classList.toggle("skryta", obrazovky[i].id !== idObrazovky);
  }
}

/* Ktorý deň sa práve zadáva (index do DNI); null = žiadny pergamen nie je otvorený. */
var aktivnyIndex = null;

/**
 * Zobrazí/skryje jeden pergamen podľa id. Skrytie je OKAMŽITÉ (strih) — používa sa
 * na výmenu clue→heslo (opticky ten istý zvitok, žiadny zvuk). Skutočné zatvorenie
 * (návrat na mapu) rieši skryPergameny s plynulým vymiznutím.
 * @param {string} id - "clue-pergamen" alebo "heslo-pergamen".
 * @param {boolean} zobraz - true = ukáž, false = skry.
 */
function ukazPergamen(id, zobraz) {
  var el = document.getElementById(id);
  if (zobraz) el.classList.remove("zatvara");   // otvorenie ruší prípadné miznutie
  el.classList.toggle("skryta", !zobraz);
}

/**
 * Plynulo zatvorí jeden pergamen: trieda `zatvara` spustí CSS fade (zladený so zvukom
 * zrolovania — obraz nemizne strihom, kým zvuk ešte hrá), po dobehnutí sa pridá
 * `skryta` (display:none). Už skrytý pergamen preskočí (na display:none animácia
 * nebeží a `animationend` by nikdy neprišiel).
 * POZOR: obsah pergamenu sa počas miznutia NESMIE meniť (symbol by preskočil na
 * formulár hesla — „preklik") → upratanie obsahu príde až v `poSkryti`.
 * @param {string} id - "clue-pergamen" alebo "heslo-pergamen".
 * @param {Function} [poSkryti] - zavolá sa, keď je pergamen NEVIDITEĽNÝ (po fade,
 *   alebo hneď, ak už bol skrytý) — bezpečné miesto na reset obsahu.
 */
function zatvorPergamenPlynulo(id, poSkryti) {
  var el = document.getElementById(id);
  if (el.classList.contains("skryta")) {
    if (poSkryti) poSkryti();
    return;
  }
  el.classList.add("zatvara");
  var dokonci = function (e) {
    // animationend BUBLÁ aj z detí (napr. zjavenie symbolu pri preskočení) — reaguj
    // len na fade samotného obalu, inak by sa pergamen skryl predčasne.
    if (e.target !== el) return;
    el.removeEventListener("animationend", dokonci);
    el.classList.add("skryta");
    el.classList.remove("zatvara");
    if (poSkryti) poSkryti();
  };
  el.addEventListener("animationend", dokonci);
}

/** Skryje oba pergameny (spoločné zatvorenie — reset, zrušenie, po odomknutí).
    Heslo pergamen sa uprace až po zmiznutí (obsah počas fade ostáva zamrznutý). */
function skryPergameny() {
  zatvorPergamenPlynulo("clue-pergamen");
  zatvorPergamenPlynulo("heslo-pergamen", resetOdomknutie);
}

/** @param {string} text - správa pod poľom hesla (prázdny = nič). */
function nastavSpravu(text) {
  document.getElementById("sprava-heslo").textContent = text;
}

/**
 * Vykreslí clue slová dňa na clue pergamen podľa napevno zadaných pozícií.
 * Voľné rozmiestnenie (FR-017) — pozície sú v DNI[].clue, nie generované.
 * @param {Object} den - konfigurácia dňa (s poľom clue).
 */
function vykresliClue(den) {
  var box = document.getElementById("clue-slova");
  box.innerHTML = "";
  var clue = den.clue || [];            // deň bez clue (napr. budúci špeciál) → prázdny pergamen, nie pád
  for (var i = 0; i < clue.length; i++) {
    var polozka = clue[i];
    var span = document.createElement("span");
    span.className = "clue-slovo";
    span.style.left = polozka.cx + "%";
    span.style.top = polozka.cy + "%";
    span.textContent = polozka.text;
    box.appendChild(span);
  }
}

/**
 * Klik na aktívnu zastávku → otvorí CLUE pergamen (obr.3) pre daný deň.
 * Neutrálne: neukazuje názov lokácie, len clue slová (BR-003).
 * @param {number} index - poradie dňa (0..4).
 */
function otvorClue(index) {
  aktivnyIndex = index;
  vykresliClue(DNI[index]);
  ukazPergamen("clue-pergamen", true);
  prehraj("pergamen");               // rozbalenie zvitku (hmatový moment otvorenia)
  stlmHarfu(HLASITOST_HARFY_CLUE);   // harfa jemnejšie počas lúštenia (nie ticho); vráti sa v otvorHeslo/zavriHeslo
  // Zvuk prostredia sa už NEspúšťa tu — hrá až po odhalení symbolu (viď ukazOdomknutie).
}

/** ĎALEJ z clue pergamenu → HESLO pergamen (obr.4). Pole je čisté a zaostrené. */
function otvorHeslo() {
  if (aktivnyIndex === null) return;
  // Poistka: východzí vzhľad (pečať + formulár, žiadny starý symbol) tesne PRED
  // zobrazením — kryje aj prípad, že predošlý fade zrušilo rýchle znovu-otvorenie
  // (animationend vtedy nepríde a odložený reset zo skryPergameny sa nespustí).
  resetOdomknutie();
  // Harfa ostáva tichá aj počas zadávania hesla (nevraciame ju) — stlmenie z otvorClue
  // pretrváva až po odomknutie/zavretie. Vráti ju dokonciOdomknutie alebo zavriHeslo.
  var pole = document.getElementById("pole-heslo");
  pole.value = "";
  nastavSpravu("");
  ukazPergamen("clue-pergamen", false);
  ukazPergamen("heslo-pergamen", true);
  // Zvuk rozbalenia tu NEhrá (Jakub): pergamen je opticky stále „ten istý" zvitok,
  // rozbalenie zaznelo pri clue; zrolovanie zaznie až pri zatvorení (zavriHeslo).
  pole.focus();
}

/**
 * Zavrie oba pergameny a vráti heslo pergamen do východzieho vzhľadu
 * (zapečatená pečať, žiadny shake, symbol skrytý). Volá sa pri Zrušiť/Escape/
 * resete aj po dokončení odomknutia — vždy necháva pergamen pripravený na ďalší
 * deň. Zruší aj prípadné bežiace časovače odomknutia (žiadny „duch" po zavretí).
 */
function zavriHeslo() {
  // Zrolovanie zvitku — len ak bol nejaký pergamen naozaj otvorený (reset bez
  // otvoreného pergamenu by inak pustil zvuk „z ničoho"). Kontrola PRED skrytím.
  var bolOtvoreny =
    !document.getElementById("clue-pergamen").classList.contains("skryta") ||
    !document.getElementById("heslo-pergamen").classList.contains("skryta");
  if (bolOtvoreny) prehraj("pergamen");
  aktivnyIndex = null;
  zastavProstredie();                   // pergamen sa zatvára → zvuk prostredia (po odhalení symbolu) končí
  stlmHarfu(false);                     // istota: ak sa zatvára počas odomknutia (reset), vráť harfu
  zrusOdomkCasovace();
  sekvenciaHotovo = null;
  // resetOdomknutie sa tu už NEvolá — počas fade by prepol obsah na formulár hesla
  // („preklik"). Obsah ostáva zamrznutý; uprace ho skryPergameny až po zmiznutí
  // a poistka v otvorHeslo tesne pred ďalším zobrazením.
  document.getElementById("heslo-pergamen-panel").classList.remove("trasie");
  skryPergameny();
}

/** Krátko zatrasie heslo pergamenom pri nesprávnom hesle (obr.5). */
function zatrasPergamenom() {
  var panel = document.getElementById("heslo-pergamen-panel");
  panel.classList.remove("trasie");
  // vynúti reflow, aby sa animácia dala spustiť znova pri každom omyle
  void panel.offsetWidth;
  panel.classList.add("trasie");
}

/* Cesty k pozadiam heslo pergamenu (single-source) + časovanie krokov odomknutia. */
var POZADIE_ZAPECATENE = "app_images/pregamen.png";
var POZADIE_ODOMKNUTE = "app_images/ODOMKNUTIE.png";
var TRVANIE_ZAMKU_MS = 1500;          // ako dlho vidno odopnutý zámok (obr.6) pred symbolom
var TRVANIE_SYMBOLU_MS = 6000;        // ako dlho vidno symbol + názov (obr.7) pred návratom na mapu (viac priestoru pre zvuk prostredia)

/*
  Bežiace časovače odomknutia a callback po jeho dokončení. Držíme ich, aby klik/
  Escape (preskočenie) aj reset vedeli zrušiť naplánované kroky a dobehnúť/prerušiť
  bez duplikácie. sekvenciaHotovo != null znamená „odomknutie práve beží".
*/
var odomkCasovace = [];
var sekvenciaHotovo = null;

/** Zruší všetky naplánované kroky odomknutia (pri preskočení alebo resete). */
function zrusOdomkCasovace() {
  for (var i = 0; i < odomkCasovace.length; i++) {
    window.clearTimeout(odomkCasovace[i]);
  }
  odomkCasovace = [];
}

/**
 * Odomknutie na heslo pergamene v dvoch krokoch:
 *   obr.6 — schová zadávanie, vymení pozadie za ODOMKNUTIE.png (odopnutý zámok);
 *   obr.7 — po TRVANIE_ZAMKU_MS ukáže symbol dňa + jeho názov na pergamene;
 *   po TRVANIE_SYMBOLU_MS zavolá hotovo() (zavrie pergamen, prekreslí mapu).
 * Symbol/názov sa do DOM vkladá AŽ tu (po uložení stavu) — žiadny spoiler (BR-003).
 * @param {Object} den - konfigurácia práve odomknutého dňa.
 * @param {Function} hotovo - callback po dobehnutí (prekreslí mapu, zavrie pergamen).
 */
function ukazOdomknutie(den, hotovo) {
  sekvenciaHotovo = hotovo;
  stlmHarfu(true);                     // harfa na 0 → zámok a „wow" vyniknú (obnoví dokonciOdomknutie)
  document.getElementById("heslo-obsah").classList.add("skryta");
  document.getElementById("heslo-pozadie").src = POZADIE_ODOMKNUTE;   // obr.6 — odopnutý zámok
  prehraj("seal_crack");               // zvuk odomknutia vintage zámku (súčasne s obr.6)

  odomkCasovace.push(window.setTimeout(function () {
    // Zámok zmizne: pozadie späť na obyčajný pergamen, aby ostal vidieť len symbol.
    document.getElementById("heslo-pozadie").src = POZADIE_ZAPECATENE;
    prehraj("light_reveal");           // „wow" tón v okamihu zjavenia symbolu dňa
    if (den.zvuk) spustiProstredie(den.zvuk);   // po „wow" nabehne zvuk prostredia v slučke (do zavretia pergamenu)
    var obr = document.getElementById("heslo-symbol-obr");
    obr.src = den.symbol;
    obr.alt = den.nazov;                 // názov smie byť v DOM až po odomknutí (BR-003)
    document.getElementById("heslo-symbol-nazov").textContent = den.nazov;
    var blok = document.getElementById("heslo-symbol");
    blok.classList.remove("skryta");
    void blok.offsetWidth;               // reflow → nábeh opacity od 0, nie skokom
    blok.classList.add("zjav");
  }, TRVANIE_ZAMKU_MS));

  // Prirodzené dobehnutie (časovač vypršal) → fade prostredia + návrat harfy (bez „okamžite").
  odomkCasovace.push(window.setTimeout(function () { dokonciOdomknutie(false); }, TRVANIE_ZAMKU_MS + TRVANIE_SYMBOLU_MS));
}

/**
 * Dobehne (alebo preskočí) odomknutie: zruší časovače a zavolá uložený callback,
 * ktorý zavrie pergamen a prekreslí mapu. Idempotentná — druhé volanie (klik +
 * Escape + časovač naraz) po vynulovaní callbacku už nič nespraví.
 * @param {boolean} okamzite - true = preskočenie vedúcim (bez fade, hneď zavri);
 *   false/undefined = prirodzené dobehnutie (prostredie jemne stíchne, potom harfa).
 */
function dokonciOdomknutie(okamzite) {
  zrusOdomkCasovace();
  var hotovo = sekvenciaHotovo;
  sekvenciaHotovo = null;
  var vrat = function () {
    stlmHarfu(false);                   // harfa späť na cieľovú hlasitosť
    if (hotovo) hotovo();               // zavrie pergamen (→ zastavProstredie zvyšok stíši)
  };
  // Preskočenie vedúcim = okamžite (kontrola vedúceho, žiadne čakanie). Prirodzené
  // dobehnutie = jemný prechod: prostredie postupne stíchne, AŽ POTOM sa vráti harfa.
  if (okamzite === true) vrat();
  else fadeOutProstredia(vrat);
}

/**
 * Vráti heslo pergamen do východzieho vzhľadu (zapečatený, zadávanie viditeľné,
 * symbol skrytý a vyčistený). NIKDY sa nevolá na viditeľnom pergamene (preklik!) —
 * volá ho skryPergameny AŽ PO zmiznutí (fade) a otvorHeslo tesne PRED zobrazením.
 * Symbol.src sa vyprázdni, aby ďalší deň neblikol starým obrázkom pred vložením.
 */
function resetOdomknutie() {
  document.getElementById("heslo-pozadie").src = POZADIE_ZAPECATENE;
  document.getElementById("heslo-obsah").classList.remove("skryta");
  var blok = document.getElementById("heslo-symbol");
  blok.classList.add("skryta");
  blok.classList.remove("zjav");
  document.getElementById("heslo-symbol-obr").removeAttribute("src");
  document.getElementById("heslo-symbol-nazov").textContent = "";
}

/**
 * Overí zadané heslo. Pri zhode uloží postup PRED akýmkoľvek odhalením (EC-003),
 * až potom prehrá zlomenie pečate a prekreslí mapu. Prázdne pole nič nerobí.
 * aktivnyIndex sa vynuluje hneď po zhode, takže druhý klik/Enter počas animácie
 * už neodomkne znova. Pri omyle: shake + neutrálny text (FR-007).
 */
function skusOdomknut() {
  if (aktivnyIndex === null) return;
  var zadane = normalizujHeslo(document.getElementById("pole-heslo").value);
  // TEST režim: prázdne pole nezastaví a heslo sa nekontroluje (rýchle preklikanie).
  if (zadane === "" && !TEST_REZIM_BEZ_HESIEL) return;

  if (TEST_REZIM_BEZ_HESIEL || zadane === normalizujHeslo(DNI[aktivnyIndex].heslo)) {
    var den = DNI[aktivnyIndex];
    var stav = nacitajStav();
    stav.dokonceneDni = aktivnyIndex + 1;   // ulož najprv (EC-003), potom odhaľ
    ulozStav(stav);
    aktivnyIndex = null;                     // zamkni ďalšie pokusy počas animácie
    ukazOdomknutie(den, function () {
      zavriHeslo();
      if (stav.dokonceneDni === DNI.length) {
        spustiFinale();               // D5 → finálna sekvencia (sama prekreslí mapu s vlnou)
      } else {
        // Symbol je odhalený → mapa sa objaví so symbolom + starou cestou; najnovší
        // segment cesty sa po krátkej pauze animovane nakreslí (v smere putovania).
        vykresliZastavky(stav, true);
      }
    });
  } else {
    nastavSpravu("Skúste ešte raz. Niektorá z indícií vám možno unikla.");
    zatrasPergamenom();
  }
}

/* =========================================================================
   Fáza 5 — D5 finálna sekvencia (obr.10–15)
   Po odomknutí Jeruzalema: finálna mapa (svetelná vlna) → záverečná obrazovka →
   mystery circle (klik na otáznik) → šifra (Ďalej) → kód 13177 (Ďalej) → truhlica.
   Obrázky a kód sa do DOM vkladajú až tu (BR-003 — žiadny budúci obsah vopred).
   Klik na dokončený Jeruzalem prehrá finále znova (poistka pri prerušení — Jakub S6).
   ========================================================================= */

var FINALE_OBRAZKY = {
  totem: "app_images/TOTEM.png",
  sifra: "app_images/SIFRA.png",
  truhlica: "app_images/TRUHLICA.png"
};
var KOD_TRUHLICE = "13177";           // číslice symbolov D1→D5 (zdroj: project_build_plan.md)
var TRVANIE_VLNY_MS = 4200;           // 5 zastávok × 0,55 s rozostup + dosvit poslednej
var TRVANIE_ZAVERECNEJ_MS = 9000;     // čas na prečítanie záverečných textov
// Nádych pred vlnou: zrolovanie pergamenu (~1,5 s) doznie + symbol Jeruzalema chvíľu
// „sedí" na mape, až potom whoosh (Jakub: zvuky sa nesmú prelínať).
var PAUZA_PRED_VLNOU_MS = 2500;

/*
  finaleFaza != null znamená „finále beží" (hodnota = aktuálna obrazovka).
  Automatické prechody (mapa→záverečná→mystery) držia časovač v finaleCasovace,
  aby ich klik (preskočenie) aj Escape/reset vedeli zrušiť bez „duchov".
*/
var finaleFaza = null;
var finaleCasovace = [];

var FINALE_OBALY = ["finale-zaverecna", "finale-mystery", "finale-sifra",
                    "finale-truhlica"];

/** Zruší naplánované automatické prechody finále. */
function zrusFinaleCasovace() {
  for (var i = 0; i < finaleCasovace.length; i++) {
    window.clearTimeout(finaleCasovace[i]);
  }
  finaleCasovace = [];
}

/** Skryje všetky finálne obrazovky (medzi krokmi aj pri ukončení). */
function skryFinaleObaly() {
  for (var i = 0; i < FINALE_OBALY.length; i++) {
    document.getElementById(FINALE_OBALY[i]).classList.add("skryta");
  }
}

/**
 * Ukončí finále (Escape alebo reset) — zruší časovače, skryje obrazovky a nechá
 * mapu. Finále sa dá kedykoľvek prehrať znova klikom na dokončený Jeruzalem.
 */
function zavriFinale() {
  zrusFinaleCasovace();
  zastavVlnu();                         // istota: ak sa finále ukončí počas vlny, whoosh doznie
  zastavTikanie();                      // istota: ak sa ukončí počas šifry, tikanie doznie
  finaleFaza = null;
  skryFinaleObaly();
  document.getElementById("zastavky").classList.remove("vlna");
}

/**
 * Obr.10 — finálna mapa. Cesta k Jeruzalemu sa nakreslila už po odomknutí D4 (cesta vedie
 * k blikajúcemu bodu), takže tu sa mapa len staticky prekreslí — objaví sa odhalený symbol
 * Jeruzalema na hotovej ceste. Potom NÁDYCH (zrolovanie pergamenu doznie, symbol chvíľu
 * sedí na mape) a až potom svetelná vlna cez všetkých 5 symbolov — zvuky sa neprelínajú.
 * Spúšťa sa po odomknutí D5 aj klikom na dokončený Jeruzalem (replay).
 */
function spustiFinale() {
  if (finaleFaza !== null) return;    // už beží — druhé spustenie by rozbilo časovače
  finaleFaza = "pauza";               // drží guard + klik počas nádychu preskočí na vlnu
  ukazObrazovku("obrazovka-mapa");
  vykresliZastavky(nacitajStav());    // staticky: celá cesta + symbol D5, žiadna animácia
  finaleCasovace.push(window.setTimeout(spustiVlnu, PAUZA_PRED_VLNOU_MS));
}

/** Svetelná vlna cez všetkých 5 symbolov (whoosh). Volaná po nádychu zo spustiFinale. */
function spustiVlnu() {
  zrusFinaleCasovace();
  finaleFaza = "mapa";                 // teraz beží vlna — klik na mapu preskočí na záverečnú
  document.getElementById("zastavky").classList.add("vlna");
  prehraj("whoosh");                    // svišťanie v slučke počas celej svetelnej vlny
  finaleCasovace.push(window.setTimeout(ukazZaverecnu, TRVANIE_VLNY_MS));
}

/** Obr.11 — záverečná obrazovka (Jeruzalem v zlatom svetle + texty). */
function ukazZaverecnu() {
  zrusFinaleCasovace();
  zastavVlnu();                         // vlna dobehla (alebo preskočená klikom) → svišťanie stop
  document.getElementById("zastavky").classList.remove("vlna");
  finaleFaza = "zaverecna";
  skryFinaleObaly();
  // Jeruzalem je v tejto chvíli vždy odomknutý — symbol už nie je spoiler
  document.getElementById("zaverecna-obr").src = DNI[DNI.length - 1].symbol;
  document.getElementById("finale-zaverecna").classList.remove("skryta");
  finaleCasovace.push(window.setTimeout(ukazMystery, TRVANIE_ZAVERECNEJ_MS));
}

/** Obr.12 — mystery circle: čaká na klik vedúceho na otáznik (žiadny časovač). */
function ukazMystery() {
  zrusFinaleCasovace();
  finaleFaza = "mystery";
  skryFinaleObaly();
  document.getElementById("mystery-obr").src = FINALE_OBRAZKY.totem;
  document.getElementById("finale-mystery").classList.remove("skryta");
  prehraj("mystery");                  // tajomný tón prekvapenia
}

/** Obr.13 — pergamen so symbolmi a číslicami (deti hádajú poradie). */
function ukazSifru() {
  finaleFaza = "sifra";
  skryFinaleObaly();
  prehraj("mystery");                  // tajomný tón pri odhalení šifry
  prehraj("tick");                     // po ňom tikanie v slučke počas lúštenia (stop pri kóde)
  document.getElementById("sifra-obr").src = FINALE_OBRAZKY.sifra;
  // Pri (opätovnom) vstupe do šifry: kód skrytý, pergamen v plnom jase, tlačidlo Ďalej späť.
  document.getElementById("kod-blok").classList.add("skryta");
  document.getElementById("sifra-obr").classList.remove("sifra-stlmena");
  document.getElementById("sifra-dalej").classList.remove("skryta");
  document.getElementById("finale-sifra").classList.remove("skryta");
}

/**
 * Obr.14 — potvrdenie kódu 13177. Pergamen (obr.13) NEZMIZNE — len sa stlmí a kód
 * sa naň prekryje v tej istej obrazovke → plynulý prechod bez presvitu mapy (S6).
 */
function ukazKod() {
  finaleFaza = "kod";
  zastavTikanie();                     // kód odhalený → napätie (tikanie) končí
  document.getElementById("sifra-obr").classList.add("sifra-stlmena");   // pergamen do pozadia
  document.getElementById("sifra-dalej").classList.add("skryta");        // jeho Ďalej nahradí Ďalej v kód-bloku
  document.getElementById("kod-cislo").textContent = KOD_TRUHLICE;
  document.getElementById("kod-blok").classList.remove("skryta");
}

/** Obr.15 — otvorená truhlica: koniec aplikácie, obrazovka ostáva. */
function ukazTruhlicu() {
  finaleFaza = "truhlica";
  skryFinaleObaly();
  document.getElementById("truhlica-obr").src = FINALE_OBRAZKY.truhlica;
  document.getElementById("finale-truhlica").classList.remove("skryta");
  prehraj("celebration");              // jediná povolená fanfára — zakaždým, aj pri replay
  var stav = nacitajStav();
  if (!stav.koniecVideny) {
    stav.koniecVideny = true;         // finále dopozerané až po truhlicu
    ulozStav(stav);
  }
}

/* =========================================================================
   Ovládanie operátora (zvuk + reset)
   ========================================================================= */

/** Vynuluje postup (za potvrdením) a vráti appku na INTRO — čistý štart. */
function vynulujPostup() {
  if (!window.confirm("Naozaj vynulovať celý postup? Appka sa vráti na začiatok.")) return;
  zavriHeslo();                 // zavrie pergamen + zruší bežiace odomknutie (žiadne prekreslenie starým stavom)
  zavriFinale();                // ukončí prípadné bežiace finále (obrazovky + časovače)
  var stav = kopiaStavu(VYCHODZI_STAV);
  ulozStav(stav);
  vykresliZastavky(stav);
  ukazObrazovku("obrazovka-intro");
}

/* =========================================================================
   Štart
   ========================================================================= */

/** Naviazanie udalostí a prvé vykreslenie zo stavu. */
function start() {
  // Poistka rozbitých obrázkov (Fáza 7): každý statický <img> v tele appky
  // dostane onerror/onload → pri nenačítaní sa skryje (neutrálny podklad, žiadna
  // rozbitá ikona na stene). Kryje pozadia (INTRO/MAPA), pergameny aj cieľové
  // <img>, ktorým app.js priradí src neskôr (symbol, finále). Symboly mapy sa
  // tvoria dynamicky → chránené priamo vo vytvorZastavku. Robí sa RAZ na začiatku,
  // poslucháče prežijú opakované zmeny src.
  var obrazky = document.querySelectorAll(".stage img");
  for (var oi = 0; oi < obrazky.length; oi++) { pripravFallbackObrazka(obrazky[oi]); }

  // TEST režim: viditeľný štítok, kým sú heslá vypnuté — poistka proti tomu, aby
  // appka omylom išla na tábor bez kontroly hesiel (prepínač hore v súbore).
  if (TEST_REZIM_BEZ_HESIEL) {
    var testStitok = document.createElement("div");
    testStitok.className = "test-stitok";
    testStitok.textContent = "TEST — heslá vypnuté";
    document.querySelector(".stage").appendChild(testStitok);
  }

  // Autoplay policy: harfa smie štartovať až po prvom geste vedúceho. Jednorazový
  // (once) poslucháč na celom dokumente → zafunguje nech je prvý klik kdekoľvek
  // (Začať, mapa, menu…) a už sa neopakuje (harfa sa nereštartuje). Zvuk je doplnok
  // — ak by odomknutie zlyhalo, appka beží ďalej ticho (EC-005).
  document.addEventListener("click", odomkniZvuk, { once: true });

  document.getElementById("tlacidlo-zacat")
    .addEventListener("click", function () {
      ukazObrazovku("obrazovka-mapa");
      // Prekresli až keď je mapa VIDITEĽNÁ: pri štarte (start) beží render ešte na
      // skrytej mape (getBoundingClientRect=0 → cesta sa neskráti/nenakreslí). Bez
      // tohto by cesta chýbala až do prvého ďalšieho odomknutia.
      vykresliZastavky(nacitajStav());
    });

  document.getElementById("tlacidlo-reset").addEventListener("click", vynulujPostup);
  document.getElementById("tlacidlo-zvuk").addEventListener("click", prepniZvuk);

  document.getElementById("tlacidlo-dalej").addEventListener("click", otvorHeslo);
  document.getElementById("tlacidlo-odomknut").addEventListener("click", skusOdomknut);
  document.getElementById("tlacidlo-zrusit").addEventListener("click", zavriHeslo);

  // Klik na pergamen počas odomknutia = preskočiť na koniec (kontrola vedúceho).
  // Ignoruj klik na tlačidlo/pole: klik na „Odomknúť", ktorý sekvenciu SPUSTIL,
  // by inak bublou hneď preskočil na koniec (a odomknutie by nebolo vidno).
  document.getElementById("heslo-pergamen").addEventListener("click", function (e) {
    if (!sekvenciaHotovo) return;
    if (e.target.closest("button, input")) return;
    dokonciOdomknutie(true);            // preskočenie vedúcim = okamžite (bez fade)
  });

  var pole = document.getElementById("pole-heslo");
  pole.addEventListener("keydown", function (e) {
    if (e.key === "Enter") skusOdomknut();
    else if (e.key === "Escape") zavriHeslo();
  });

  // Finále: klik = ďalej (automatické kroky sa dajú preskočiť, ostatné vedie vedúci).
  // Počas nádychu pred vlnou preskočí klik rovno na vlnu; počas vlny na záverečnú.
  document.getElementById("obrazovka-mapa").addEventListener("click", function () {
    if (finaleFaza === "pauza") spustiVlnu();
    else if (finaleFaza === "mapa") ukazZaverecnu();
  });
  document.getElementById("finale-zaverecna").addEventListener("click", ukazMystery);
  document.getElementById("mystery-totem").addEventListener("click", ukazSifru);
  document.getElementById("sifra-dalej").addEventListener("click", ukazKod);
  document.getElementById("kod-dalej").addEventListener("click", ukazTruhlicu);

  // Globálny Escape: počas odomknutia preskočí, počas finále ho ukončí (mapa ostáva;
  // klik na dokončený Jeruzalem finále prehrá znova), inak zavrie otvorený pergamen.
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    if (sekvenciaHotovo) dokonciOdomknutie(true);   // Escape = preskočenie vedúcim = okamžite
    else if (finaleFaza !== null) zavriFinale();
    else if (aktivnyIndex !== null) zavriHeslo();
  });

  // Zmena veľkosti okna: cesta sa počíta v px javiska, takže po preškálovaní treba
  // segmenty prepočítať (inak vedú mimo kruhov). Prekresľujeme len keď je mapa
  // viditeľná; bez animácie (nie je to odomknutie). Debounce, nech neprekresľuje pri
  // každom pixeli ťahania okna.
  var resizeCasovac = null;
  window.addEventListener("resize", function () {
    if (resizeCasovac) window.clearTimeout(resizeCasovac);
    resizeCasovac = window.setTimeout(function () {
      var mapaSkryta = document.getElementById("obrazovka-mapa").classList.contains("skryta");
      if (!mapaSkryta) vykresliZastavky(nacitajStav());
    }, 150);
  });

  obnovMenuZvuk();                      // ikona zvuku (reproduktor/preškrtnutý) podľa uloženého stavu
  vykresliZastavky(nacitajStav());
}

document.addEventListener("DOMContentLoaded", start);
