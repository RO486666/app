// ✅ Zentrale Datenbank für Symbole, Pip-Werte & Kontraktgrößen

// 🔹 Live-Preise (manuell alle 1–2 Wochen aktualisieren)
const livePrices = {
  // Forex
  "EUR/USD": 1.16610,
  "GBP/USD": 1.3497,
  "USD/JPY": 147.747,
  "EUR/JPY": 172.29,
  "GBP/JPY": 199.424,
  "CAD/JPY": 106.60,
  "AUD/JPY": 95.42,
  "NZD/JPY": 87.188,
  "AUD/CAD": 0.89504,
  "NZD/CAD": 0.81775,
  "GBP/CHF": 1.08905,

  // Indizes
  "US30": 44946.50,
  "NAS100": 23483.80,
  "SPX500": 6426.10,

  // Metalle
  "XAU/USD": 3325.17,
  "XAG/USD": 27.13,

  // Krypto
  "BTC/USD": 114014.24,
  "ETH/USD": 4206.08,
  "XRP/USD": 2.9484
};

// 🔹 Pip-Werte
const pipValues = {
  "XAU/USD": 1,
  "XAG/USD": 0.01,

  "BTC/USD": 1,
  "ETH/USD": 1,
  "XRP/USD": 0.0001,

  "US30": 1, "NAS100": 1, "SPX500": 1, "GER40": 1, "UK100": 1,

  "EUR/USD": 10, "GBP/USD": 10, "AUD/USD": 10, "NZD/USD": 10,
  "USD/CHF": 9.26, "USD/CAD": 7.94,
  "USD/JPY": 9.17, "EUR/JPY": 9.17, "GBP/JPY": 9.17,
  "CHF/JPY": 9.17, "AUD/JPY": 9.17, "NZD/JPY": 9.17, "CAD/JPY": 9.17,
  "EUR/GBP": 10, "EUR/AUD": 10, "EUR/CAD": 10,
  "GBP/AUD": 10, "GBP/CAD": 10, "AUD/CAD": 7.94
};

// 🔹 Kontraktgrößen (Lot)
const basisWerte = {
  "XAU/USD": 100,
  "XAG/USD": 5000,

  "BTC/USD": 1,
  "ETH/USD": 1,
  "XRP/USD": 100000,

  "US30": 1, "NAS100": 1, "SPX500": 1, "GER40": 1, "UK100": 1,

  "EUR/USD": 100000, "GBP/USD": 100000, "AUD/USD": 100000, "NZD/USD": 100000,
  "USD/CAD": 100000, "USD/CHF": 100000, "USD/JPY": 100000,
  "EUR/JPY": 100000, "GBP/JPY": 100000, "CHF/JPY": 100000,
  "AUD/JPY": 100000, "NZD/JPY": 100000, "CAD/JPY": 100000,
  "EUR/GBP": 100000, "EUR/AUD": 100000, "EUR/CAD": 100000,
  "GBP/AUD": 100000, "GBP/CAD": 100000, "AUD/CAD": 100000
};

// ✅ Zentrale Funktion: sortierte Symbol-Liste holen
function getAllSymbolsSorted() {
  // Nimm ALLE Keys aus pipValues
  return Object.keys(pipValues).sort((a, b) => a.localeCompare(b));
}

// ✅ Zentrale Funktion → liefert alles für ein Symbol
function getSymbolData(symbol) {
  return {
    price: livePrices[symbol] || null,
    pip: pipValues[symbol] || null,
    contract: basisWerte[symbol] || null
  };
}

// ✅ Kategorien festlegen (einmal zentral)
const categories = {
  "🌍 Forex Standard": ["EUR/USD", "GBP/USD", "AUD/USD", "NZD/USD", "USD/CHF", "USD/CAD"],
  "💴 Yen-Paare": ["USD/JPY", "EUR/JPY", "GBP/JPY", "CHF/JPY", "AUD/JPY", "NZD/JPY", "CAD/JPY"],
  "🔁 Cross-Paare": ["EUR/GBP", "EUR/AUD", "EUR/CAD", "GBP/AUD", "GBP/CAD", "AUD/CAD"],
  "📊 Indizes": ["US30", "NAS100", "SPX500", "GER40", "UK100"],
  "🥇 Metalle": ["XAU/USD", "XAG/USD"],
  "🪙 Krypto": ["BTC/USD", "ETH/USD", "XRP/USD"]
};

// ✅ Generische Funktion für Dropdowns mit Kategorien
// ✅ Generische Funktion für Dropdowns mit Kategorien
function populateSymbolDropdown(selectId) {
  const select = document.getElementById(selectId);
  if (!select) return;

  select.innerHTML = ""; // Reset

  Object.keys(categories).forEach(groupName => {
    const group = document.createElement("optgroup");
    group.label = groupName;

    categories[groupName].forEach(symbol => {
      if (pipValues[symbol]) {  // nur gültige Symbole
        const opt = document.createElement("option");
        opt.value = symbol;
        opt.textContent = symbol;
        group.appendChild(opt);
      }
    });

    select.appendChild(group);
  });
}

function getCurrentPrice(symbol) {
  return livePrices[symbol] || null;
}


// ✅ Beim Laden beide Dropdowns mit Kategorien befüllen
document.addEventListener("DOMContentLoaded", () => {
  populateSymbolDropdown("symbolSelector");     // Positionsgrößenrechner
  populateSymbolDropdown("pipSymbolSelector");  // Pip-Rechner
});

