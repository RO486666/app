// ============================================================
// pairsData.js – Zentrale Datenbank (Stand: 12.11.2025)
// Hinweis: Live-Preise werden manuell gepflegt oder per API ersetzt.
// Pip-Werte & Kontraktgrößen NICHT ändern, außer du sagst es.
// ============================================================

// 🔹 Live-Preise (aus deiner TradingView-Liste + aktuelle Marktdaten)
const livePrices = {
  // === Forex Majors & Minors ===
  "EUR/USD": 1.1562,
  "GBP/USD": 1.3130,
  "AUD/USD": 0.6542,
  "NZD/USD": 0.5660,
  "USD/CHF": 0.7868,
  "USD/CAD": 1.4007,
  "USD/JPY": 153.967,

  // === Crosses (aus Majors berechnet) ===
  "EUR/JPY": 178.02,
  "GBP/JPY": 202.16,
  "AUD/JPY": 100.73,
  "CAD/JPY": 109.92,
  "NZD/JPY": 87.15,
  "EUR/GBP": 0.8806,
  "AUD/CAD": 0.9163,
  "GBP/CAD": 1.8391,
  "GBP/CHF": 1.0331,
  "NZD/CAD": 0.7928,
  "AUD/NZD": 1.1558,
  "GBP/AUD": 2.0076, // ✅ Neu hinzugefügt

  // === Indizes (Broker/CFD-Werte können leicht abweichen)
  "US30": 47927.96,
  "NAS100": 25533.49,
  "SPX500": 6846.61,
  "GER40": 24396.23,
  "UK100": 9902.23,

  // === Metalle (Spot)
  "XAU/USD": 4129.17,
  "XAG/USD": 51.60,

  // === Energie
  "BRENT": 64.54,

  // === Krypto
  "BTC/USD": 104879.46,
  "ETH/USD": 3455.92,
  "XRP/USD": 2.42
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
  "GBP/AUD": 10       // ✅ Neu hinzugefügt
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
  "GBP/AUD": 100000    // ✅ Neu hinzugefügt
};

// 🔹 Kategorien (für Dropdown-Gruppierung)
const categories = {
  "🌍 Forex (Majors)": ["EUR/USD", "GBP/USD", "AUD/USD", "NZD/USD", "USD/CHF", "USD/CAD", "USD/JPY"],
  "🔀 Forex (Crosses)": [
    "EUR/JPY", "GBP/JPY", "AUD/JPY", "CAD/JPY", "NZD/JPY",
    "EUR/GBP", "AUD/CAD", "GBP/CAD", "GBP/CHF",
    "NZD/CAD", "AUD/NZD", "GBP/AUD"  // ✅ Neu hinzugefügt
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
