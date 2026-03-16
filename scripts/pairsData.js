// ============================================================
// pairsData.js – Zentrale Datenbank
// Sortiert & Aktualisiert (Live-Preise Stand: 17.01.2026)
// ============================================================

// 🔹 Live-Preise
const livePrices = {
// === Forex Majors & Minors ===
"EUR/USD": 1.1476,
"GBP/USD": 1.3300,
"AUD/USD": 0.7016,
"NZD/USD": 0.5808,
"USD/CHF": 0.7900,
"USD/CAD": 1.3739,
"USD/JPY": 159.72,

// === Crosses (Forex) ===
"EUR/JPY": 182.71,
"GBP/JPY": 211.21,
"AUD/JPY": 112.06,
"CAD/JPY": 116.25,
"NZD/JPY": 91.18,
"EUR/GBP": 0.8600,
"AUD/CAD": 0.9665,
"GBP/CAD": 1.7228,
"GBP/CHF": 1.0500,
"NZD/CAD": 0.7832,
"AUD/NZD": 1.2260,
"GBP/AUD": 1.9485,
"AUD/CHF": 0.5511,
"EUR/AUD": 1.6334,

// === Indizes ===
"US30": 46916.84,
"NAS100": 24680.32,
"SPX500": 6698.92,
"GER40": 23591.39,
"UK100": 10334.88,

// === Metalle ===
"XAU/USD": 5001.96,
"XAG/USD": 80.66,

// === Energie ===
"BRENT": 101.48,

// === Krypto ===
"BTC/USD": 73597.97,
"ETH/USD": 2292.68,
"XRP/USD": 1.4869
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