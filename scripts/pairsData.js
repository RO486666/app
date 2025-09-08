//  pairsData.js – Live-Preise & Daten aktualisiert auf Stand vom 8. September 2025

// Live-Preise (manuell oder optional per API regelmäßig aktualisieren)
const livePrices = {
  // Forex  
  "EUR/USD": 1.1160,
  "GBP/USD": 1.2920,
  "USD/JPY": 147.75,
  "EUR/JPY": 164.20,
  "GBP/JPY": 187.40,
  "CAD/JPY": 106.60,
  "AUD/JPY": 95.42,
  "NZD/JPY": 87.18,
  "AUD/CAD": 0.8950,
  "NZD/CAD": 0.8177,
  "GBP/CHF": 1.0890,

  // Indizes
  "US30": 38700.00,
  "NAS100": 16800.00,
  "SPX500": 5100.00,
  "GER40": 18400.00,
  "UK100": 8100.00,

  // Metalle – aktuelle Marktpreise
  "XAU/USD": 3600.00,  // ≈ Rekordhoch :contentReference[oaicite:2]{index=2}
  "XAG/USD": 30.20,

  // Krypto – aktuelle Preise
  "BTC/USD": 112000.00, // nahe aktuellen Bereich laut Barron’s
  "ETH/USD": 4300.00,
  "XRP/USD": 2.90
};

// Pip-Werte (pro 1 Lot / pro Pip im genannten Symbol)
const pipValues = {
  // Metalle – angepasst auf echte Marktwerte
  "XAU/USD": 10,        // 1 Pip = 0,10 USD → Lot-Pip-Wert: 10 USD
  "XAG/USD": 50,        // 1 Pip = 0,01 USD → Lot-Pip-Wert: 50 USD

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

  // Forex Haupt- und Cross-Paare
  "EUR/USD": 10,
  "GBP/USD": 10,
  "AUD/USD": 10,
  "NZD/USD": 10,
  "USD/CHF": 10,
  "USD/CAD": 10,
  "USD/JPY": 9.17,
  "EUR/JPY": 9.17,
  "GBP/JPY": 9.17,
  "EUR/GBP": 10,
  "AUD/CAD": 10
};

// Kontraktgrößen (Contract Size pro 1 Lot)
const basisWerte = {
  "XAU/USD": 100,
  "XAG/USD": 5000,
  "BTC/USD": 1,
  "ETH/USD": 1,
  "XRP/USD": 100000,
  "US30": 1,
  "NAS100": 1,
  "SPX500": 1,
  "GER40": 1,
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
  "EUR/GBP": 100000,
  "AUD/CAD": 100000
};

const categories = {
  "🌍 Forex": ["EUR/USD", "GBP/USD", "AUD/USD", "NZD/USD", "USD/CHF", "USD/CAD"],
  "💴 Yen-Paare": ["USD/JPY", "EUR/JPY", "GBP/JPY"],
  "📊 Indizes": ["US30", "NAS100", "SPX500", "GER40", "UK100"],
  "🥇 Metalle": ["XAU/USD", "XAG/USD"],
  "🪙 Krypto": ["BTC/USD", "ETH/USD", "XRP/USD"]
};

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



// ✅ Beim Laden beide Dropdowns mit Kategorien befüllen
document.addEventListener("DOMContentLoaded", () => {
  populateSymbolDropdown("symbolSelector");     // Positionsgrößenrechner
  populateSymbolDropdown("pipSymbolSelector");  // Pip-Rechner
});

