// ============================================================
// pairsData.js – Zentrale Datenbank (Stand: 20.10.2025)
// Hinweis: Live-Preise werden manuell gepflegt oder per API ersetzt.
// Pip-Werte & Kontraktgrößen NICHT ändern, außer du sagst es.
// ============================================================

// 🔹 Live-Preise (aus deiner TradingView-Liste + aktuelle Marktdaten)
const livePrices = {
  // === Forex Majors & Minors ===
  "EUR/USD": 1.1656,
  "GBP/USD": 1.3430,
  "AUD/USD": 0.6511,
  "NZD/USD": 0.5729,
  "USD/CHF": 0.7929,
  "USD/CAD": 1.4030,
  "USD/JPY": 150.81,

  // === Crosses (aus Majors berechnet) ===
  "EUR/JPY": 175.78,
  "GBP/JPY": 202.54,
  "AUD/JPY": 98.19,
  "CAD/JPY": 107.49,
  "NZD/JPY": 86.398,
  "EUR/GBP": 0.8679,
  "AUD/CAD": 0.9135,
  "GBP/CAD": 1.8842,
  "GBP/CHF": 1.0649,
  "NZD/CAD": 0.8038,

  // === Indizes ===
  "US30": 46190.61,
  "NAS100": 24817.95,
  "SPX500": 6664.01,
  "GER40": 24035.19,
  "UK100": 9385.25,

  // === Metalle ===
  "XAU/USD": 4254.59,
  "XAG/USD": 51.97,

  // === Energie ===
  "BRENT": 61.01,

  // === Krypto ===
  "BTC/USD": 110961.00,
  "ETH/USD": 4052.51,
  "XRP/USD": 2.4733
};

// 🔸 Pip-Werte (pro 1 Lot / pro Pip). Unverändert beibehalten & ergänzt.
const pipValues = {
  // Metalle
  "XAU/USD": 10,         // 1 Pip = 0.10 USD
  "XAG/USD": 50,         // 1 Pip = 0.01 USD

  // Energie (CFD – konservativ)
  "BRENT": 0.1,          // 0.1 pro Pip je Lot (anpassbar, falls Broker-spezifisch)

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
  "GBP/CAD": 10,    // Fix
  "GBP/CHF": 10,
  "NZD/CAD": 10
};

// 🔸 Kontraktgrößen (Contract Size pro 1 Lot). Unverändert & ergänzt.
const basisWerte = {
  // Metalle
  "XAU/USD": 100,
  "XAG/USD": 5000,

  // Energie
  "BRENT": 1,           // häufig brokerabhängig; bei Bedarf anpassen

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

  // Forex – Standard
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
  "GBP/CAD": 100000,   // Fix
  "GBP/CHF": 100000,
  "NZD/CAD": 100000
};

// 🔹 Kategorien (für Dropdown-Gruppierung)
const categories = {
  "🌍 Forex (Majors)": ["EUR/USD", "GBP/USD", "AUD/USD", "NZD/USD", "USD/CHF", "USD/CAD", "USD/JPY"],
  "🔀 Forex (Crosses)": [
    "EUR/JPY", "GBP/JPY", "AUD/JPY", "CAD/JPY", "NZD/JPY",
    "EUR/GBP", "AUD/CAD", "GBPCAD", "GBP/CHF", "NZD/CAD", "USD/NZD"
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
