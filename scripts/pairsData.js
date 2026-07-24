// ============================================================
// pairsData.js – Zentrale Datenbank
// Sortiert & Aktualisiert (Live-Preise Stand: 23.07.2026)
// ============================================================

// 🔹 Live-Preise
const livePrices = {
  // === Forex Majors ===
  "AUD/USD": 0.7018,
  "EUR/USD": 1.1413,
  "GBP/USD": 1.3388,
  "NZD/USD": 0.5819,
  "USD/CAD": 1.4064,
  "USD/CHF": 0.8132,
  "USD/JPY": 163.05,

  // === Forex Crosses ===
  "AUD/CAD": 0.9870,
  "AUD/CHF": 0.5707,
  "AUD/JPY": 114.43,
  "AUD/NZD": 1.2061,
  "CAD/JPY": 115.94,
  "EUR/AUD": 1.6263,
  "EUR/GBP": 0.8525,
  "EUR/JPY": 186.09,
  "GBP/AUD": 1.9077,
  "GBP/CAD": 1.8826,
  "GBP/CHF": 1.0886,
  "GBP/JPY": 218.29,
  "NZD/CAD": 0.8183,
  "NZD/JPY": 94.87,

  // === Indizes ===
  "GER40": 18450.00,
  "NAS100": 19800.00,
  "SPX500": 5520.00,
  "UK100": 8250.00,
  "US30": 41200.00,

  // === Metalle ===
  "XAG/USD": 59.85,
  "XAU/USD": 4127.80,

  // === Energie ===
  "BRENT": 82.50,

  // === Krypto ===
  "BTC/USD": 64250.00,
  "ETH/USD": 3450.00,
  "XRP/USD": 0.5850
};

// 🔸 Pip-/Point-Werte in EUR pro Einheitsbewegung (1 Standard-Lot)
// Werte angepasst an 1 TradingView-Point/Pip-Eingabe
const pipValues = {
  // === FOREX (Währungen: 1 Pip = 0.0001 bzw. 0.01 JPY) ===
  "AUD/USD": 8.60, "EUR/USD": 8.60, "GBP/USD": 8.60, "NZD/USD": 8.60,
  "USD/CAD": 8.60, "USD/CHF": 8.60, "USD/JPY": 8.50,
  "AUD/CAD": 8.60, "AUD/CHF": 8.60, "AUD/JPY": 8.50, "AUD/NZD": 8.60,
  "CAD/JPY": 8.50, "EUR/AUD": 8.60, "EUR/GBP": 10.00, "EUR/JPY": 8.50,
  "GBP/AUD": 8.60, "GBP/CAD": 8.60, "GBP/CHF": 8.60, "GBP/JPY": 8.50,
  "GBP/NZD": 8.60, "NZD/CAD": 8.60, "NZD/JPY": 8.50,

  // === INDIZES (1 Point = 1.0 Punkt) ===
  "SPX500": 0.86, 
  "NAS100": 0.86, 
  "US30": 0.86,   
  "GER40": 1.00,     
  "UK100": 1.10,

  // === METALLE ===
  // 1 Point in TradingView = 0.01$ Preisbewegung
  // Bei 1 Lot (100 Oz Gold) = 1.00$ Gegenwert ≈ 0.86 €
  "XAU/USD": 0.86,  
  // Bei 1 Lot (5000 Oz Silber) = 50.00$ Gegenwert pro $1.00 Movement = 0.50$ pro 0.01 Point ≈ 0.43 €
  "XAG/USD": 0.43,

  // === ENERGIE ===
  "BRENT": 0.86,

  // === KRYPTO ===
  "BTC/USD": 0.86,
  "ETH/USD": 0.86,
  "XRP/USD": 86.00
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