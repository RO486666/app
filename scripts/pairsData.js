// ============================================================
// pairsData.js – Zentrale Datenbank (Stand: 20.11.2025)
// Hinweis: Live-Preise werden manuell gepflegt oder per API ersetzt.
// Pip-Werte & Kontraktgrößen NICHT ändern, außer du sagst es.
// ============================================================

// 🔹 Live-Preise (aus deiner TradingView-Liste + aktuelle Marktdaten)
const livePrices = {
// === Forex Majors & Minors ===
"EUR/USD": 1.1519,
"GBP/USD": 1.3068,
"AUD/USD": 0.6477,
"NZD/USD": 0.5611,
"USD/CHF": 0.8060,
"USD/CAD": 1.4057,
"USD/JPY": 157.23,

// === Crosses (aus Majors berechnet) ===
"EUR/JPY": 181.13,
"GBP/JPY": 205.49,
"AUD/JPY": 101.86,
"CAD/JPY": 111.85,
"NZD/JPY": 88.22,
"EUR/GBP": 0.8814,
"AUD/CAD": 0.9105,
"GBP/CAD": 1.8370,
"GBP/CHF": 1.0533,
"NZD/CAD": 0.7887,
"AUD/NZD": 1.1543,
"GBP/AUD": 2.0176,
"AUD/CHF": 0.5220, // ✅ korrigiert

// === Indizes (Broker/CFD-Werte können leicht abweichen)
"US30": 46439.00,
"NAS100": 22564.23,
"SPX500": 6642.16,
"GER40": 23418.15,
"UK100": 9577.50,

// === Metalle (Spot)
"XAU/USD": 4057.72,
"XAG/USD": 50.6430,

// === Energie
"BRENT": 63.86,

// === Krypto
"BTC/USD": 92376.00,
"ETH/USD": 3036.90,
"XRP/USD": 2.1363
};

// 🔸 Pip-Werte (pro 1 Lot / pro Pip)
const pipValues = {
// Metalle
"XAU/USD": 10,
"XAG/USD": 50,

// Energie
"BRENT": 0.1,

// Krypto
"BTC/USD": 1,
"ETH/USD": 0.1,
"XRP/USD": 0.0001,

// Indizes
"US30": 1,
"NAS100": 0.1,
"SPX500": 0.1,
"GER40": 0.1,
"UK100": 0.1,

// Forex – Majors
"EUR/USD": 10,
"GBP/USD": 10,
"AUD/USD": 10,
"NZD/USD": 10,
"USD/CHF": 10,
"USD/CAD": 10,
"USD/JPY": 9.17,

// Forex – Crosses
"EUR/JPY": 9.17,
"GBP/JPY": 9.17,
"AUD/JPY": 9.17,
"CAD/JPY": 9.17,
"NZD/JPY": 9.17,
"EUR/GBP": 10,
"AUD/CAD": 10,
"GBP/CAD": 10,
"GBP/CHF": 10,
"NZD/CAD": 10,
"AUD/NZD": 10,
"GBP/AUD": 10,
"AUD/CHF": 10
};

// 🔸 Kontraktgrößen (Contract Size pro 1 Lot)
const basisWerte = {
// Metalle
"XAU/USD": 100,
"XAG/USD": 5000,

// Energie
"BRENT": 1,

// Krypto
"BTC/USD": 1,
"ETH/USD": 1,
"XRP/USD": 100000,

// Indizes
"US30": 1,
"NAS100": 1,
"SPX500": 1,
"GER40": 1,
"UK100": 1,

// Forex
"EUR/USD": 100000,
"GBP/USD": 100000,
"AUD/USD": 100000,
"NZD/USD": 100000,
"USD/CHF": 100000,
"USD/CAD": 100000,
"USD/JPY": 100000,
"EUR/JPY": 100000,
"GBP/JPY": 100000,
"AUD/JPY": 100000,
"CAD/JPY": 100000,
"NZD/JPY": 100000,
"EUR/GBP": 100000,
"AUD/CAD": 100000,
"GBP/CAD": 100000,
"GBP/CHF": 100000,
"NZD/CAD": 100000,
"AUD/NZD": 100000,
"GBP/AUD": 100000,
"AUD/CHF": 100000
};

// 🔹 Kategorien (für Dropdown-Gruppierung)
const categories = {
"🌍 Forex (Majors)": ["EUR/USD", "GBP/USD", "AUD/USD", "NZD/USD", "USD/CHF", "USD/CAD", "USD/JPY"],
"🔀 Forex (Crosses)": [
"EUR/JPY", "GBP/JPY", "AUD/JPY", "CAD/JPY", "NZD/JPY",
"EUR/GBP", "AUD/CAD", "GBP/CAD", "GBP/CHF",
"NZD/CAD", "AUD/NZD", "GBP/AUD", "AUD/CHF"
],
"📊 Indizes": ["US30", "NAS100", "SPX500", "GER40", "UK100"],
"🥇 Metalle": ["XAU/USD", "XAG/USD"],
"🛢️ Energie": ["BRENT"],
"🪙 Krypto": ["BTC/USD", "ETH/USD", "XRP/USD"]
};

// === Hilfsfunktionen (unverändert) ===
function getAllSymbolsSorted() {
  return Object.keys(pipValues).sort((a, b) => a.localeCompare(b));
}

function getSymbolData(symbol) {
  return {
    price: livePrices[symbol] ?? null,
    pip: pipValues[symbol] ?? null,
    contract: basisWerte[symbol] ?? null
  };
}

function populateSymbolDropdown(selectId) {
  const select = document.getElementById(selectId);
  if (!select) return;
  select.innerHTML = "";

  Object.entries(categories).forEach(([groupName, syms]) => {
    const optgroup = document.createElement("optgroup");
    optgroup.label = groupName;
    syms.forEach(sym => {
      if (pipValues[sym] !== undefined) {
        const opt = document.createElement("option");
        opt.value = sym;
        opt.textContent = sym;
        optgroup.appendChild(opt);
      }
    });
    select.appendChild(optgroup);
  });
}

function getCurrentPrice(symbol) {
  return livePrices[symbol] ?? null;
}

// ✅ Dropdowns beim Laden befüllen
document.addEventListener("DOMContentLoaded", () => {
  populateSymbolDropdown("symbolSelector");     // Positionsgrößenrechner
  populateSymbolDropdown("pipSymbolSelector");  // Pip-Rechner
});
