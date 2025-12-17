// ============================================================
// pairsData.js – Zentrale Datenbank
// Sortiert & Aktualisiert (NZD/CAD added)
// ============================================================

// 🔹 Live-Preise
const livePrices = {
  // === Forex Majors ===
  "AUD/USD": 0.6660,
  "EUR/USD": 1.1740,
  "GBP/USD": 1.3377,
  "NZD/USD": 0.5810,
  "USD/CAD": 1.3755,
  "USD/CHF": 0.7965,
  "USD/JPY": 155.90,

  // === Forex Crosses ===
  "AUD/CAD": 0.9170,
  "AUD/CHF": 0.5305,
  "AUD/JPY": 103.85,
  "AUD/NZD": 1.1465,
  "CAD/JPY": 113.35,
  "EUR/AUD": 1.7630,
  "EUR/GBP": 0.8775,
  "EUR/JPY": 183.05,
  "GBP/AUD": 2.0085,
  "GBP/CAD": 1.8400,
  "GBP/CHF": 1.0655,
  "GBP/JPY": 208.55,
  "GBP/NZD": 2.3138,
  "NZD/CAD": 0.7965, // Added
  "NZD/JPY": 90.05,

  // === Indizes ===
  "GER30": 24237.76,
  "NAS100": 25196.73,
  "SPX500": 6851.00,
  "UK100": 9710.50,
  "US30": 48626.00,

  // === Metalle ===
  "XAG/USD": 61.93,
  "XAU/USD": 4298.71,

  // === Energie ===
  "BRENT": 61.40,

  // === Krypto ===
  "BTC/USD": 89836.24,
  "ETH/USD": 3115.50,
  "XRP/USD": 2.0610
};

// 🔸 Pip-Werte (Standard 1 Lot)
const pipValues = {
  // Forex Majors
  "AUD/USD": 10,
  "EUR/USD": 10,
  "GBP/USD": 10,
  "NZD/USD": 10,
  "USD/CAD": 10,
  "USD/CHF": 10,
  "USD/JPY": 9.17,

  // Forex Crosses
  "AUD/CAD": 10,
  "AUD/CHF": 10,
  "AUD/JPY": 9.17,
  "AUD/NZD": 10,
  "CAD/JPY": 9.17,
  "EUR/AUD": 10,
  "EUR/GBP": 10,
  "EUR/JPY": 9.17,
  "GBP/AUD": 10,
  "GBP/CAD": 10,
  "GBP/CHF": 10,
  "GBP/JPY": 9.17,
  "GBP/NZD": 10,
  "NZD/CAD": 10, // Added
  "NZD/JPY": 9.17,

  // Indizes
  "GER30": 0.1,
  "NAS100": 0.1,
  "SPX500": 0.1,
  "UK100": 0.1,
  "US30": 1,

  // Metalle
  "XAG/USD": 50,
  "XAU/USD": 10,

  // Energie
  "BRENT": 0.1,

  // Krypto
  "BTC/USD": 1,
  "ETH/USD": 0.1,
  "XRP/USD": 0.0001
};

// 🔸 Kontraktgrößen
const basisWerte = {
  // Forex Majors
  "AUD/USD": 100000,
  "EUR/USD": 100000,
  "GBP/USD": 100000,
  "NZD/USD": 100000,
  "USD/CAD": 100000,
  "USD/CHF": 100000,
  "USD/JPY": 100000,

  // Forex Crosses
  "AUD/CAD": 100000,
  "AUD/CHF": 100000,
  "AUD/JPY": 100000,
  "AUD/NZD": 100000,
  "CAD/JPY": 100000,
  "EUR/AUD": 100000,
  "EUR/GBP": 100000,
  "EUR/JPY": 100000,
  "GBP/AUD": 100000,
  "GBP/CAD": 100000,
  "GBP/CHF": 100000,
  "GBP/JPY": 100000,
  "GBP/NZD": 100000,
  "NZD/CAD": 100000, // Added
  "NZD/JPY": 100000,

  // Indizes
  "GER30": 1,
  "NAS100": 1,
  "SPX500": 1,
  "UK100": 1,
  "US30": 1,

  // Metalle
  "XAG/USD": 5000,
  "XAU/USD": 100,

  // Energie
  "BRENT": 1,

  // Krypto
  "BTC/USD": 1,
  "ETH/USD": 1,
  "XRP/USD": 100000
};

// 🔹 Kategorien (Sortiert für Dropdown)
const categories = {
  "🌍 Forex (Majors)": [
    "AUD/USD", "EUR/USD", "GBP/USD", "NZD/USD", 
    "USD/CAD", "USD/CHF", "USD/JPY"
  ],
  "🔀 Forex (Crosses)": [
    "AUD/CAD", "AUD/CHF", "AUD/JPY", "AUD/NZD",
    "CAD/JPY", 
    "EUR/AUD", "EUR/GBP", "EUR/JPY",
    "GBP/AUD", "GBP/CAD", "GBP/CHF", "GBP/JPY", "GBP/NZD",
    "NZD/CAD", "NZD/JPY"
  ],
  "📊 Indizes": [
    "GER30", "NAS100", "SPX500", "UK100", "US30"
  ],
  "🥇 Metalle": [
    "XAG/USD", "XAU/USD"
  ],
  "🛢️ Energie": [
    "BRENT"
  ],
  "🪙 Krypto": [
    "BTC/USD", "ETH/USD", "XRP/USD"
  ]
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