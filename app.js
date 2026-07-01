/* =========================================================================
   Dávidova cesta — logika (Fáza 1: kostra INTRO + MAPA)
   Zámerne BEZ hesiel, BEZ localStorage, BEZ odomykania — to prídu ďalšie fázy.
   Dátami riadený návrh: 1 konfigurácia zastávok + 1 vykresľovač.

   ANTI-SPOILER (BR-003): pri stave 'uzamknuta' a 'aktivna' sa symbol ANI názov
   lokácie NEVLOŽÍ do DOM. Názvy sú tu iba v konfigurácii pre neskoršie fázy;
   do obrazovky ich vypíšeme až keď je deň dokončený.
   ========================================================================= */

"use strict";

/* --- Demo stavy pre Fázu 1 (natvrdo). Reálne stavy určí Fáza 2 z localStorage. --- */
var STAV = {
  DOKONCENA: "dokoncena",
  AKTIVNA: "aktivna",
  UZAMKNUTA: "uzamknuta"
};

/*
  Konfigurácia 5 zastávok. x/y = STRED bodu v % šírky/výšky javiska.
  Pozície sú orientačné (podľa MAPA.jfif) — jemné doladenie prebehne v prehliadači.
*/
var ZASTAVKY = [
  { id: "D1", nazov: "Pastier",   symbol: "app_images/PASTIER.jfif",  x: 11, y: 70, stav: STAV.DOKONCENA },
  { id: "D2", nazov: "Prak",      symbol: "app_images/PRAK.png",      x: 34, y: 82, stav: STAV.AKTIVNA },
  { id: "D3", nazov: "Jonatán",   symbol: "app_images/JONATAN.jfif",  x: 52, y: 30, stav: STAV.UZAMKNUTA },
  { id: "D4", nazov: "Jaskyňa",   symbol: "app_images/jask.png",      x: 70, y: 60, stav: STAV.UZAMKNUTA },
  { id: "D5", nazov: "Jeruzalem", symbol: "app_images/JERUZALEM.jfif", x: 88, y: 22, stav: STAV.UZAMKNUTA }
];

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

/**
 * Vytvorí neutrálnu ikonu zámku (inline SVG — deterministická, offline, bez emoji).
 * @returns {HTMLElement} obal so SVG zámkom.
 */
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

/**
 * Vykreslí jednu zastávku podľa jej stavu.
 * Symbol/názov sa vloží IBA pri dokončenom dni (anti-spoiler BR-003).
 * @param {Object} z - konfigurácia zastávky.
 * @returns {HTMLElement} element zastávky.
 */
function vytvorZastavku(z) {
  var el = document.createElement("div");
  el.className = "zastavka stav-" + z.stav;
  el.style.left = z.x + "%";
  el.style.top = z.y + "%";

  if (z.stav === STAV.DOKONCENA) {
    var img = document.createElement("img");
    img.className = "symbol";
    img.src = z.symbol;
    img.alt = z.nazov;            // názov smie byť v DOM len keď je deň dokončený
    el.appendChild(img);
  } else if (z.stav === STAV.AKTIVNA) {
    var bod = document.createElement("span");
    bod.className = "marker";     // pulzujúci bod, žiadny symbol ani názov
    el.appendChild(bod);
  } else {
    el.appendChild(vytvorZamok()); // uzamknutá: hmla + zámok, nič viac
  }
  return el;
}

/** Vykreslí všetkých 5 zastávok na mapu z konfigurácie ZASTAVKY. */
function vykresliZastavky() {
  var box = document.getElementById("zastavky");
  box.innerHTML = "";
  for (var i = 0; i < ZASTAVKY.length; i++) {
    box.appendChild(vytvorZastavku(ZASTAVKY[i]));
  }
}

/** Naviazanie udalostí a prvé vykreslenie po načítaní stránky. */
function start() {
  var tlacidloZacat = document.getElementById("tlacidlo-zacat");
  tlacidloZacat.addEventListener("click", function () {
    ukazObrazovku("obrazovka-mapa");
  });

  vykresliZastavky();
}

document.addEventListener("DOMContentLoaded", start);
