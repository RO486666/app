// ============================================================
// pairsData.js – Zentrale Datenbank
// Sortiert & Aktualisiert (Live-Preise Stand: 17.01.2026)
// ============================================================

// 🔹 Live-Preise (Aktualisiert am 17.01.2026)
const livePrices = {
  // === Forex Majors ===
  "AUD/USD": 0.6482,
  "EUR/USD": 1.0845,
  "GBP/USD": 1.2630,
  "NZD/USD": 0.5915,
  "USD/CAD": 1.3640,
  "USD/CHF": 0.8875,
  "USD/JPY": 149.25,

  // === Forex Crosses ===
  "AUD/CAD": 0.8842,
  "AUD/CHF": 0.5753,
  "AUD/JPY": 96.75,
  "AUD/NZD": 1.0958,
  "CAD/JPY": 109.42,
  "EUR/AUD": 1.6730,
  "EUR/GBP": 0.8587,
  "EUR/JPY": 161.85,
  "GBP/AUD": 1.9485,
  "GBP/CAD": 1.7228,
  "GBP/CHF": 1.1210,
  "GBP/JPY": 188.50,
  "GBP/NZD": 2.1352,
  "NZD/CAD": 0.8068,
  "NZD/JPY": 88.28,

  // === Indizes ===
  "GER30": 19245.50,
  "NAS100": 21150.25,
  "SPX500": 6085.75,
  "UK100": 8420.30,
  "US30": 44120.00,

  // === Metalle ===
  "XAG/USD": 32.45,
  "XAU/USD": 2785.60,

  // === Energie ===
  "BRENT": 78.40,

  // === Krypto ===
  "BTC/USD": 104250.80,
  "ETH/USD": 3845.20,
  "XRP/USD": 2.1450
};

// 🔸 Pip-Werte (Der "Zauber-Faktor" für TradingView-Eingaben)
const pipValues = {
  // === INDIZES (SPX, NAS, US30) ===
  "SPX500": 0.0086, 
  "NAS100": 0.0086, 
  "US30": 0.0086,   
  "GER30": 0.01,     
  "UK100": 0.011,

  // === METALLE (Gold) ===
  "XAU/USD": 0.86,  
  "XAG/USD": 0.43,

  // === FOREX (Währungen) ===
  "AUD/USD": 8.60, "EUR/USD": 8.60, "GBP/USD": 8.60, "NZD/USD": 8.60,
  "USD/CAD": 8.60, "USD/CHF": 8.60, "USD/JPY": 8.50,
  "AUD/CAD": 8.60, "AUD/CHF": 8.60, "AUD/JPY": 8.50, "AUD/NZD": 8.60,
  "CAD/JPY": 8.50, "EUR/AUD": 8.60, "EUR/GBP": 10.00, "EUR/JPY": 8.50,
  "GBP/AUD": 8.60, "GBP/CAD": 8.60, "GBP/CHF": 8.60, "GBP/JPY": 8.50,
  "GBP/NZD": 8.60, "NZD/CAD": 8.60, "NZD/JPY": 8.50,

  // === KRYPTO ===
  "BTC/USD": 1,
  "ETH/USD": 0.1,
  "XRP/USD": 0.0001,

  // Metalle (Redundant entries from original file kept as instructed)
  "XAG/USD": 0.09,
  "XAU/USD": 0.086,

  // Energie
  "BRENT": 0.1
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
  "NZD/CAD": 100000,
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

// === Hilfsfunktionen ===
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
  populateSymbolDropdown("symbolSelector");     
  populateSymbolDropdown("pipSymbolSelector");  
});