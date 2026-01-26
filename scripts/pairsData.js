// ============================================================
// pairsData.js – Zentrale Datenbank
// Sortiert & Aktualisiert (Live-Preise Stand: 26.01.2026)
// ============================================================

// 🔹 Live-Preise (Aktualisiert am 26.01.2026)
const livePrices = {
  // === Forex Majors ===
  "AUD/USD": 0.6512,
  "EUR/USD": 1.0925,
  "GBP/USD": 1.2715,
  "NZD/USD": 0.5980,
  "USD/CAD": 1.3590,
  "USD/CHF": 0.8810,
  "USD/JPY": 151.45,

  // === Forex Crosses ===
  "AUD/CAD": 0.8855,
  "AUD/CHF": 0.5738,
  "AUD/JPY": 98.65,
  "AUD/NZD": 1.0890,
  "CAD/JPY": 111.45,
  "EUR/AUD": 1.6775,
  "EUR/GBP": 0.8592,
  "EUR/JPY": 165.45,
  "GBP/AUD": 1.9525,
  "GBP/CAD": 1.7275,
  "GBP/CHF": 1.1205,
  "GBP/JPY": 192.55,
  "GBP/NZD": 2.1265,
  "NZD/CAD": 0.8125,
  "NZD/JPY": 90.55,

  // === Indizes ===
  "GER30": 19410.25,
  "NAS100": 21320.50,
  "SPX500": 6125.75,
  "UK100": 8455.10,
  "US30": 44350.00,

  // === Metalle ===
  "XAG/USD": 33.15,
  "XAU/USD": 2815.40,

  // === Energie ===
  "BRENT": 79.25,

  // === Krypto ===
  "BTC/USD": 106840.50,
  "ETH/USD": 3915.75,
  "XRP/USD": 2.1840
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