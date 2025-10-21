// ===== Integrierter Swap-Rechner im Pip-Rechner ============================

(function initSwapInPip() {
  document.addEventListener("DOMContentLoaded", () => {
    hydratePipSymbols();

    const sym = document.getElementById("pipSymbolSelector");
    const btn = document.getElementById("swapCalcBtn");

    sym?.addEventListener("change", () => {
      localStorage.setItem("swap:lastSymbol", sym.value);
    });

    btn?.addEventListener("click", calculateSwapFromPip);

    const last = localStorage.getItem("swap:lastSymbol");
    if (last && sym) sym.value = last;
  });
})();

// ---- Dummy-Symbole (nur Fallback, wenn keine DB) --------------------------
function hydratePipSymbols() {
  const sel = document.getElementById("pipSymbolSelector");
  if (!sel || sel.options.length > 0) return;
  ["EUR/USD", "GBP/USD", "USD/JPY", "XAU/USD"].forEach((s) => {
    const opt = document.createElement("option");
    opt.value = s;
    opt.textContent = s;
    sel.appendChild(opt);
  });
}

// ---- Punktbasierte Hauptberechnung ----------------------------------------
function calculateSwapFromPip() {
  const symbol = document.getElementById("pipSymbolSelector")?.value;
  const lots = parseFloat(document.getElementById("lots")?.value);
  const longPts = parseFloat(document.getElementById("swapLongPts")?.value);
  const shortPts = parseFloat(document.getElementById("swapShortPts")?.value);
  const tripleDay = !!document.getElementById("swapTripleDay")?.checked;
  const showWeek = !!document.getElementById("swapShowWeek")?.checked;
  const box = document.getElementById("swapResult");

  if (!symbol || isNaN(lots) || isNaN(longPts) || isNaN(shortPts)) {
    box.style.display = "block";
    box.className = "result-box risk-extreme";
    box.innerHTML = "❌ Bitte Symbol, Lots und Swap-Werte korrekt eingeben.";
    return;
  }

  // 💶 Fixe Basis
  const usdToEur = 0.92;           // fixer Kurs (vereinfacht)
  const pipValueUSD = 10;          // 1 Lot Pip-Wert in USD
  const pipValueEUR = pipValueUSD * usdToEur;

  // 🧠 Punkte → Pips Umrechnung (Broker arbeitet in Punkten!)
  const pointFactor = symbol.includes("JPY") ? 100 : 10; 
  // JPY-Paare haben 2 Nachkommastellen -> 100 Punkte = 1 Pip
  // sonst Standard: 10 Punkte = 1 Pip (Forex, Gold, etc.)

  const longPerDay = (longPts / pointFactor) * pipValueEUR * lots;
  const shortPerDay = (shortPts / pointFactor) * pipValueEUR * lots;
  const tripleLong = tripleDay ? longPerDay * 3 : longPerDay;
  const tripleShort = tripleDay ? shortPerDay * 3 : shortPerDay;

  let weekLong = null, weekShort = null;
  if (showWeek) {
    weekLong = longPerDay * 4 + tripleLong;
    weekShort = shortPerDay * 4 + tripleShort;
  }

  // === Gerendertes Ergebnis ===
  box.style.display = "block";
  box.className = "result-box swap-visible";
  box.innerHTML = `
    <div class="swap-wrapper">
      <div class="swap-head">💎 Swap-Ergebnis (EUR)</div>
      <div class="swap-line">
        📉 <strong>Long pro Tag:</strong>
        <span class="swap-val ${longPerDay >= 0 ? "pos" : "neg"}">${longPerDay.toFixed(2)} €</span>
      </div>
      <div class="swap-line">
        📈 <strong>Short pro Tag:</strong>
        <span class="swap-val ${shortPerDay >= 0 ? "pos" : "neg"}">${shortPerDay.toFixed(2)} €</span>
      </div>
      ${tripleDay ? `<div class="swap-line">
        📆 Triple-Tag (Mittwoch): Long ${tripleLong.toFixed(2)} € | Short ${tripleShort.toFixed(2)} €
      </div>` : ""}
      ${showWeek ? `<div class="swap-line">
        🗓️ Woche (inkl. 3× Mittwoch): Long ${weekLong.toFixed(2)} € | Short ${weekShort.toFixed(2)} €
      </div>` : ""}
      <div class="swap-small">
        <small>
          Pip-Wert (1 Lot): ${pipValueEUR.toFixed(2)} €<br>
          1 Pip = ${pointFactor} Punkte
        </small>
      </div>
    </div>
  `;
}

// ---- Swap-Rechner Ein-/Ausblenden ----------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  const openBtn = document.getElementById("openSwapBtn");
  const closeBtn = document.getElementById("closeSwapBtn");
  const swapBox = document.getElementById("swap-calc");

  if (!openBtn || !closeBtn || !swapBox) return;

  openBtn.addEventListener("click", () => {
    swapBox.style.display = "block";
    openBtn.style.display = "none";
  });

  closeBtn.addEventListener("click", () => {
    swapBox.style.display = "none";
    openBtn.style.display = "block";
  });
});
