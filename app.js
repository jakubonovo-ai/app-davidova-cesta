/* =========================================================================
   Dávidova cesta — logika (Fáza 2: stavový model + localStorage + odomknutie)
   Dátami riadený návrh: 1 konfigurácia dní + odvodené stavy + 1 automat odomknutia.

   ANTI-SPOILER (BR-003): symbol ANI názov lokácie sa NEVLOŽÍ do DOM, kým deň nie je
   dokončený. Heslá a názvy sú len tu v JS zdroji (jediný domov faktu), nikdy nie na
   obrazovke pred odomknutím. Modál na heslo je neutrálny (neukazuje, ktorá lokácia to je).
   ========================================================================= */

"use strict";

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
  { id: "D1", nazov: "Pastier",   symbol: "app_images/PASTIER.png",  heslo: "Hospodin hľadí na tvoje srdce", x: 11, y: 70,
    clue: [
      { text: "HOSPODIN", cx: 34, cy: 16 },
      { text: "TVOJE",    cx: 70, cy: 40 },
      { text: "SRDCE",    cx: 38, cy: 74 },
      { text: "HĽADÍ",    cx: 66, cy: 60 },
      { text: "NA",       cx: 20, cy: 52 }
    ] },
  { id: "D2", nazov: "Prak",      symbol: "app_images/PRAK.png",      heslo: "ODVAHA", x: 37, y: 54,
    clue: [
      { text: "A", cx: 28, cy: 16 },
      { text: "H", cx: 68, cy: 22 },
      { text: "O", cx: 20, cy: 54 },
      { text: "V", cx: 52, cy: 44 },
      { text: "D", cx: 78, cy: 58 },
      { text: "A", cx: 40, cy: 74 }
    ] },
  { id: "D3", nazov: "Jonatán",   symbol: "app_images/JONATAN.png",  heslo: "PRIATEĽ MILUJE V KAŽDOM ČASE", x: 52, y: 30,
    clue: [
      { text: "MILUJE",  cx: 30, cy: 18 },
      { text: "PRIATEĽ", cx: 62, cy: 40 },
      { text: "V",       cx: 22, cy: 52 },
      { text: "ČASE",    cx: 72, cy: 64 },
      { text: "KAŽDOM",  cx: 40, cy: 74 }
    ] },
  { id: "D4", nazov: "Jaskyňa",   symbol: "app_images/jask.png",      heslo: "JASKYŇA", x: 70, y: 60,
    clue: [
      { text: "netopier",  cx: 32, cy: 16 },
      { text: "ozvena",    cx: 68, cy: 32 },
      { text: "stalagmit", cx: 46, cy: 52 },
      { text: "tma",       cx: 24, cy: 70 },
      { text: "zima",      cx: 72, cy: 74 }
    ] },
  { id: "D5", nazov: "Jeruzalem", symbol: "app_images/JERUZALEM.png", heslo: "BOH MA VIEDOL CELÚ CESTU", x: 88, y: 22,
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
 * Vykreslí jednu zastávku podľa jej stavu.
 * Symbol/názov sa vloží IBA pri DOKONCENA (BR-003). Aktívna je klikateľná.
 * @param {Object} den - konfigurácia dňa.
 * @param {string} stav - vizuálny stav.
 * @param {number} index - poradie dňa (pre obsluhu kliku).
 * @returns {HTMLElement} element zastávky.
 */
function vytvorZastavku(den, stav, index) {
  var el = document.createElement("div");
  el.className = "zastavka stav-" + stav;
  el.style.left = den.x + "%";
  el.style.top = den.y + "%";
  el.style.setProperty("--poradie", index);   // oneskorenie svetelnej vlny finále (D1→D5)

  if (stav === STAV.DOKONCENA) {
    var img = document.createElement("img");
    img.className = "symbol";
    img.src = den.symbol;
    img.alt = den.nazov;                 // názov smie byť v DOM len po dokončení
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
    el.addEventListener("click", function () { otvorClue(index); });
  } else {
    el.appendChild(vytvorZamok());       // uzamknutá: hmla + zámok, nič viac
  }
  return el;
}

/** Prekreslí všetkých 5 zastávok podľa aktuálneho stavu. */
function vykresliZastavky(stav) {
  var box = document.getElementById("zastavky");
  box.innerHTML = "";
  for (var i = 0; i < DNI.length; i++) {
    box.appendChild(vytvorZastavku(DNI[i], stavZastavky(i, stav), i));
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
 * Zobrazí/skryje jeden pergamen podľa id.
 * @param {string} id - "clue-pergamen" alebo "heslo-pergamen".
 * @param {boolean} zobraz - true = ukáž, false = skry.
 */
function ukazPergamen(id, zobraz) {
  document.getElementById(id).classList.toggle("skryta", !zobraz);
}

/** Skryje oba pergameny (spoločné zatvorenie — reset, zrušenie, po odomknutí). */
function skryPergameny() {
  ukazPergamen("clue-pergamen", false);
  ukazPergamen("heslo-pergamen", false);
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
}

/** ĎALEJ z clue pergamenu → HESLO pergamen (obr.4). Pole je čisté a zaostrené. */
function otvorHeslo() {
  if (aktivnyIndex === null) return;
  var pole = document.getElementById("pole-heslo");
  pole.value = "";
  nastavSpravu("");
  ukazPergamen("clue-pergamen", false);
  ukazPergamen("heslo-pergamen", true);
  pole.focus();
}

/**
 * Zavrie oba pergameny a vráti heslo pergamen do východzieho vzhľadu
 * (zapečatená pečať, žiadny shake, symbol skrytý). Volá sa pri Zrušiť/Escape/
 * resete aj po dokončení odomknutia — vždy necháva pergamen pripravený na ďalší
 * deň. Zruší aj prípadné bežiace časovače odomknutia (žiadny „duch" po zavretí).
 */
function zavriHeslo() {
  aktivnyIndex = null;
  zrusOdomkCasovace();
  sekvenciaHotovo = null;
  resetOdomknutie();
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
var TRVANIE_SYMBOLU_MS = 4000;        // ako dlho vidno symbol + názov (obr.7) pred návratom na mapu

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
  document.getElementById("heslo-obsah").classList.add("skryta");
  document.getElementById("heslo-pozadie").src = POZADIE_ODOMKNUTE;   // obr.6 — odopnutý zámok

  odomkCasovace.push(window.setTimeout(function () {
    // Zámok zmizne: pozadie späť na obyčajný pergamen, aby ostal vidieť len symbol.
    document.getElementById("heslo-pozadie").src = POZADIE_ZAPECATENE;
    var obr = document.getElementById("heslo-symbol-obr");
    obr.src = den.symbol;
    obr.alt = den.nazov;                 // názov smie byť v DOM až po odomknutí (BR-003)
    document.getElementById("heslo-symbol-nazov").textContent = den.nazov;
    var blok = document.getElementById("heslo-symbol");
    blok.classList.remove("skryta");
    void blok.offsetWidth;               // reflow → nábeh opacity od 0, nie skokom
    blok.classList.add("zjav");
  }, TRVANIE_ZAMKU_MS));

  odomkCasovace.push(window.setTimeout(dokonciOdomknutie, TRVANIE_ZAMKU_MS + TRVANIE_SYMBOLU_MS));
}

/**
 * Dobehne (alebo preskočí) odomknutie: zruší časovače a zavolá uložený callback,
 * ktorý zavrie pergamen a prekreslí mapu. Idempotentná — druhé volanie (klik +
 * Escape + časovač naraz) po vynulovaní callbacku už nič nespraví.
 */
function dokonciOdomknutie() {
  zrusOdomkCasovace();
  var hotovo = sekvenciaHotovo;
  sekvenciaHotovo = null;
  if (hotovo) hotovo();
}

/**
 * Vráti heslo pergamen do východzieho vzhľadu (zapečatený, zadávanie viditeľné,
 * symbol skrytý a vyčistený). Volá zavriHeslo po dokončení aj reset postupu.
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
  if (zadane === "") return;

  if (zadane === normalizujHeslo(DNI[aktivnyIndex].heslo)) {
    var den = DNI[aktivnyIndex];
    var stav = nacitajStav();
    stav.dokonceneDni = aktivnyIndex + 1;   // ulož najprv (EC-003), potom odhaľ
    ulozStav(stav);
    aktivnyIndex = null;                     // zamkni ďalšie pokusy počas animácie
    ukazOdomknutie(den, function () {
      zavriHeslo();
      vykresliZastavky(stav);
      if (stav.dokonceneDni === DNI.length) spustiFinale();   // D5 → finálna sekvencia
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
  finaleFaza = null;
  skryFinaleObaly();
  document.getElementById("zastavky").classList.remove("vlna");
}

/**
 * Obr.10 — finálna mapa: všetkých 5 symbolov + svetelná vlna D1→D5.
 * Spúšťa sa po odomknutí D5 aj klikom na dokončený Jeruzalem (replay).
 */
function spustiFinale() {
  if (finaleFaza !== null) return;    // už beží — druhé spustenie by rozbilo časovače
  finaleFaza = "mapa";
  ukazObrazovku("obrazovka-mapa");
  vykresliZastavky(nacitajStav());
  document.getElementById("zastavky").classList.add("vlna");
  finaleCasovace.push(window.setTimeout(ukazZaverecnu, TRVANIE_VLNY_MS));
}

/** Obr.11 — záverečná obrazovka (Jeruzalem v zlatom svetle + texty). */
function ukazZaverecnu() {
  zrusFinaleCasovace();
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
}

/** Obr.13 — pergamen so symbolmi a číslicami (deti hádajú poradie). */
function ukazSifru() {
  finaleFaza = "sifra";
  skryFinaleObaly();
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
  var stav = nacitajStav();
  if (!stav.koniecVideny) {
    stav.koniecVideny = true;         // finále dopozerané až po truhlicu
    ulozStav(stav);
  }
}

/* =========================================================================
   Menu operátora + reset
   ========================================================================= */

/** Otvorí/zavrie burger menu. */
function prepniMenu() {
  var obsah = document.getElementById("menu-obsah");
  var jeSkryte = obsah.classList.toggle("skryta");
  document.getElementById("menu-tlacidlo")
    .setAttribute("aria-expanded", String(!jeSkryte));
}

/** Zavrie menu (po akcii). */
function zavriMenu() {
  document.getElementById("menu-obsah").classList.add("skryta");
  document.getElementById("menu-tlacidlo").setAttribute("aria-expanded", "false");
}

/** Vynuluje postup (za potvrdením) a vráti appku na INTRO — čistý štart. */
function vynulujPostup() {
  zavriMenu();
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
  document.getElementById("tlacidlo-zacat")
    .addEventListener("click", function () { ukazObrazovku("obrazovka-mapa"); });

  document.getElementById("menu-tlacidlo").addEventListener("click", prepniMenu);
  document.getElementById("tlacidlo-reset").addEventListener("click", vynulujPostup);

  document.getElementById("tlacidlo-dalej").addEventListener("click", otvorHeslo);
  document.getElementById("tlacidlo-odomknut").addEventListener("click", skusOdomknut);
  document.getElementById("tlacidlo-zrusit").addEventListener("click", zavriHeslo);

  // Klik na pergamen počas odomknutia = preskočiť na koniec (kontrola vedúceho).
  // Ignoruj klik na tlačidlo/pole: klik na „Odomknúť", ktorý sekvenciu SPUSTIL,
  // by inak bublou hneď preskočil na koniec (a odomknutie by nebolo vidno).
  document.getElementById("heslo-pergamen").addEventListener("click", function (e) {
    if (!sekvenciaHotovo) return;
    if (e.target.closest("button, input")) return;
    dokonciOdomknutie();
  });

  var pole = document.getElementById("pole-heslo");
  pole.addEventListener("keydown", function (e) {
    if (e.key === "Enter") skusOdomknut();
    else if (e.key === "Escape") zavriHeslo();
  });

  // Finále: klik = ďalej (automatické kroky sa dajú preskočiť, ostatné vedie vedúci).
  // Klik na mapu počas svetelnej vlny preskočí na záverečnú obrazovku.
  document.getElementById("obrazovka-mapa").addEventListener("click", function () {
    if (finaleFaza === "mapa") ukazZaverecnu();
  });
  document.getElementById("finale-zaverecna").addEventListener("click", ukazMystery);
  document.getElementById("mystery-totem").addEventListener("click", ukazSifru);
  document.getElementById("sifra-dalej").addEventListener("click", ukazKod);
  document.getElementById("kod-dalej").addEventListener("click", ukazTruhlicu);

  // Globálny Escape: počas odomknutia preskočí, počas finále ho ukončí (mapa ostáva;
  // klik na dokončený Jeruzalem finále prehrá znova), inak zavrie otvorený pergamen.
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    if (sekvenciaHotovo) dokonciOdomknutie();
    else if (finaleFaza !== null) zavriFinale();
    else if (aktivnyIndex !== null) zavriHeslo();
  });

  vykresliZastavky(nacitajStav());
}

document.addEventListener("DOMContentLoaded", start);
