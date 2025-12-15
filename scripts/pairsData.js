// ============================================================
// pairsData.js – Zentrale Datenbank (Stand: heute, live aktualisiert)
// ============================================================

// 🔹 Live-Preise
const livePrices = {
  // === Forex Majors & Minors ===
  "EUR/USD": 1.1740,
  "GBP/USD": 1.3377,
  "AUD/USD": 0.6660,
  "NZD/USD": 0.5810,
  "USD/CHF": 0.7965,
  "USD/CAD": 1.3755,
  "USD/JPY": 155.90,

  // === Crosses (Forex) ===
  "EUR/JPY": 183.05,
  "GBP/JPY": 208.55,
  "AUD/JPY": 103.85,
  "CAD/JPY": 113.35,
  "NZD/JPY": 90.05,
  "EUR/GBP": 0.8775,
  "AUD/CAD": 0.9170,
  "GBP/CAD": 1.8400,
  "GBP/CHF": 1.0655,
  "NZD/CAD": 0.7965,
  "AUD/NZD": 1.1465,
  "GBP/AUD": 2.0085,
  "AUD/CHF": 0.5305,
  "EUR/AUD": 1.7630,
  "GBP/NZD": 2.3138,           // Neu hinzugefügt (Live-Wert)

  // === Indizes ===
  "US30": 48626.00,          // Live-Update
  "NAS100": 25196.73,        // Live-Update
  "SPX500": 6851.00,         // Live-Update
  "GER30": 24237.76,         // Umbenannt von GER40 & Live-Update
  "UK100": 9710.50,

  // === Metalle ===
  "XAU/USD": 4298.71,
  "XAG/USD": 61.93,

  // === Energie ===
  "BRENT": 61.40,

  // === Krypto ===
  "BTC/USD": 89836.24,
  "ETH/USD": 3115.50,
  "XRP/USD": 2.0610
};

// 🔸 Pip-Werte
const pipValues = {
  "XAU/USD": 10,
  "XAG/USD": 50,
  "BRENT": 0.1,
  "BTC/USD": 1,
  "ETH/USD": 0.1,
  "XRP/USD": 0.0001,

  "US30": 1,
  "NAS100": 0.1,
  "SPX500": 0.1,
  "GER30": 0.1,  // Umbenannt
  "UK100": 0.1,

  "EUR/USD": 10,
  "GBP/USD": 10,
  "AUD/USD": 10,
  "NZD/USD": 10,
  "USD/CHF": 10,
  "USD/CAD": 10,
  "USD/JPY": 9.17,

  "EUR/JPY": 9.17,
  "GBP/JPY": 9.17,
  "AUD/JPY": 9.17,
  "CAD/JPY": 9.17,
  "NZD/JPY": 9.17,
  "EUR/GBP": 10,
  "AUD/CAD": 10,
  "GBP/CAD": 10,
  "GBP/CHF": 10,
  "AUD/NZD": 10,
  "GBP/AUD": 10,
  "AUD/CHF": 10,
  "EUR/AUD": 10,
  "GBP/NZD": 10   // Neu hinzugefügt
};

// 🔸 Kontraktgrößen
const basisWerte = {
  "XAU/USD": 100,
  "XAG/USD": 5000,
  "BRENT": 1,

  "BTC/USD": 1,
  "ETH/USD": 1,
  "XRP/USD": 100000,

  "US30": 1,
  "NAS100": 1,
  "SPX500": 1,
  "GER30": 1,  // Umbenannt
  "UK100": 1,

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
  "AUD/CHF": 100000,
  "EUR/AUD": 100000,
  "GBP/NZD": 100000 // Neu hinzugefügt
};

// 🔹 Kategorien
const categories = {
  "🌍 Forex (Majors)": ["EUR/USD", "GBP/USD", "AUD/USD", "NZD/USD", "USD/CHF", "USD/CAD", "USD/JPY"],
  "🔀 Forex (Crosses)": [
    "EUR/JPY", "GBP/JPY", "AUD/JPY", "CAD/JPY", "NZD/JPY",
    "EUR/GBP", "EUR/AUD", "AUD/CAD", "GBP/CAD", "GBP/CHF",
    "NZD/CAD", "AUD/NZD", "GBP/AUD", "AUD/CHF", "GBP/NZD" // Neu
  ],
  "📊 Indizes": ["US30", "NAS100", "SPX500", "GER30", "UK100"], // GER40 -> GER30
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