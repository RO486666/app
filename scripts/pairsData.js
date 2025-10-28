// ============================================================
// pairsData.js – Zentrale Datenbank (Stand: 20.10.2025)
// Hinweis: Live-Preise werden manuell gepflegt oder per API ersetzt.
// Pip-Werte & Kontraktgrößen NICHT ändern, außer du sagst es.
// ============================================================

// ============================================================
// pairsData.js – Zentrale Datenbank (Stand: 28.10.2025)
// Hinweis: Live-Preise werden manuell gepflegt oder per API ersetzt.
// Pip-Werte & Kontraktgrößen NICHT ändern, außer du sagst es.
// ============================================================

// 🔹 Live-Preise (aus deiner TradingView-Liste + aktuelle Marktdaten)
const livePrices = {
  // === Forex Majors & Minors ===
  "EUR/USD": 1.1660,
  "GBP/USD": 1.3276,
  "AUD/USD": 0.6589,
  "NZD/USD": 0.5784,
  "USD/CHF": 0.7932,
  "USD/CAD": 1.3940,
  "USD/JPY": 152.16,

  // === Crosses (aus Majors berechnet) ===
  "EUR/JPY": 177.42,
  "GBP/JPY": 202.01,
  "AUD/JPY": 100.26,
  "CAD/JPY": 109.15,
  "NZD/JPY": 88.01,
  "EUR/GBP": 0.8783,
  "AUD/CAD": 0.9185,
  "GBP/CAD": 1.8507,
  "GBP/CHF": 1.0531,
  "NZD/CAD": 0.8063,
  "AUD/NZD": 1.1392, // ✅ Neu

  // === Indizes (Broker/CFD-Werte können leicht abweichen)
  "US30": 47544.59,
  "NAS100": 26029.90,
  "SPX500": 5991.57,
  "GER40": 24275.00,
  "UK100": 9696.74,

  // === Metalle (Spot)
  "XAU/USD": 3957.40,
  "XAG/USD": 47.33,

  // === Energie
  "BRENT": 63.75,

  // === Krypto
  "BTC/USD": 115164.00,
  "ETH/USD": 4140.36,
  "XRP/USD": 2.67
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
  "NZD/CAD": 10,
  "AUD/NZD": 10     // ✅ Neu für Dropdowns & Rechner
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
  "NZD/CAD": 100000,
  "AUD/NZD": 100000    // ✅ Neu
};

// 🔹 Kategorien (für Dropdown-Gruppierung)
// ⚠️ Fixes:
// - "GBPCAD" → "GBP/CAD" (Tippfehler korrigiert)
// - "USD/NZD" entfernt (du nutzt NZD/USD); stattdessen "AUD/NZD" hinzugefügt
const categories = {
  "🌍 Forex (Majors)": ["EUR/USD", "GBP/USD", "AUD/USD", "NZD/USD", "USD/CHF", "USD/CAD", "USD/JPY"],
  "🔀 Forex (Crosses)": [
    "EUR/JPY", "GBP/JPY", "AUD/JPY", "CAD/JPY", "NZD/JPY",
    "EUR/GBP", "AUD/CAD", "GBP/CAD", "GBP/CHF", "NZD/CAD", "AUD/NZD"
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
