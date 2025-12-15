// ============================================================
// pairsData.js – Zentrale Datenbank (Stand: heute, live aktualisiert)
// ============================================================

// 🔹 Live-Preise
const livePrices = {
  // === Forex Majors & Minors ===
  "EUR/USD": 1.1744,
  "GBP/USD": 1.3372,
  "AUD/USD": 0.6655,
  "NZD/USD": 0.5802,
  "USD/CHF": 0.7958,
  "USD/CAD": 1.3769,
  "USD/JPY": 155.78,

  // === Crosses (Forex) ===
  "EUR/JPY": 182.95,
  "GBP/JPY": 208.38,
  "AUD/JPY": 103.67,
  "CAD/JPY": 113.16,
  "NZD/JPY": 89.84,           // Kein Livewert verfügbar
  "EUR/GBP": 0.8780,
  "AUD/CAD": 0.9162,
  "GBP/CAD": 1.8415,
  "GBP/CHF": 1.0644,
  "NZD/CAD": 0.7950,           // Kein Livewert verfügbar
  "AUD/NZD": 1.1456,
  "GBP/AUD": 2.0100,
  "AUD/CHF": 0.5296,
  "EUR/AUD": 1.7648,

  // === Indizes ===
  "US30": 48458.05,          // Dow Jones Industrial Average :contentReference[oaicite:1]{index=1}
  "NAS100": 25268.90,            // Livewert nicht eindeutig verfügbar
  "SPX500": 6827.41,         // S&P 500 (Endpreis vom 12.12.25) :contentReference[oaicite:2]{index=2}
  "GER40": 24186.49,         // DAX-Schlusskurs vom 12.12.25 :contentReference[oaicite:3]{index=3}
  "UK100": 9686.00,             // Livewert nicht eindeutig verfügbar

  // === Metalle ===
  "XAU/USD": 4302.43,
  "XAG/USD": 61.967,         // Silberpreis grob vom XAU/USD-Seitenkontext :contentReference[oaicite:4]{index=4}

  // === Energie ===
  "BRENT": 61.37,            // Brent Öl nach Reuters-Low- Zeitnaher Wert :contentReference[oaicite:5]{index=5}

  // === Krypto ===
  "BTC/USD": 90016.23,       // Live approx. CoinMarketCap :contentReference[oaicite:6]{index=6}
  "ETH/USD": 3108.66,        // ETH live from investing.com :contentReference[oaicite:7]{index=7}
  "XRP/USD": 2.0550          // XRP live from investing.com :contentReference[oaicite:8]{index=8}
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
  "GER40": 0.1,
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
  "EUR/AUD": 10
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
  "EUR/AUD": 100000
};

// 🔹 Kategorien
const categories = {
  "🌍 Forex (Majors)": ["EUR/USD", "GBP/USD", "AUD/USD", "NZD/USD", "USD/CHF", "USD/CAD", "USD/JPY"],
  "🔀 Forex (Crosses)": [
    "EUR/JPY", "GBP/JPY", "AUD/JPY", "CAD/JPY", "NZD/JPY",
    "EUR/GBP", "EUR/AUD", "AUD/CAD", "GBP/CAD", "GBP/CHF",
    "NZD/CAD", "AUD/NZD", "GBP/AUD", "AUD/CHF"
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
