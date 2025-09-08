function calculateMaxPositions() {
  const accountSize = parseFloat(document.getElementById("maxposAccountSize").value);
  const riskPercent = parseFloat(document.getElementById("maxposRiskPercent").value);
  const stopLossPips = parseFloat(document.getElementById("maxposStopLoss").value);
  const leverage = parseFloat(document.getElementById("maxposLeverage").value);
  const symbol = document.getElementById("maxposSymbol").value; // ✅ Symbol aus Dropdown
  const lotMain = parseFloat(document.getElementById("lotMain").value);
  const lotAlt = parseFloat(document.getElementById("lotAlt").value);
  const resultBox = document.getElementById("maxposResults");

  if (!accountSize || !riskPercent || !stopLossPips || !leverage || !lotMain || !symbol) {
    resultBox.style.display = "block";
    resultBox.className = "result-box risk-extreme";
    resultBox.innerHTML = "❌ Bitte alle Pflichtfelder ausfüllen!";
    return;
  }

  // ✅ Daten aus pairsData.js ziehen
  const { price, pip, contract } = getSymbolData(symbol);

  if (!pip || !contract) {
    resultBox.style.display = "block";
    resultBox.className = "result-box risk-extreme";
    resultBox.innerHTML = "❌ Ungültiges Symbol oder fehlende Datenbankwerte!";
    return;
  }

  const pipValueStandard = pip;
  const contractSize = contract;
  const currentPrice = price || 1;

  const maxLots = (accountSize * leverage) / (currentPrice * contractSize);

  // Session-Glow
  let sessionClass = "";
  if (typeof activeSessionName !== "undefined" && activeSessionName) {
    sessionClass = "session-" + activeSessionName.toLowerCase();
  }

  let html = `
    📊 Symbol: <strong>${symbol}</strong><br>
    📏 Maximal erlaubt bei ${leverage}x Hebel: 
    <strong>${maxLots.toFixed(2)} Lots</strong><br><br>
  `;

  function renderLotBlock(lot, label) {
    if (!lot || lot <= 0) return "";
    const maxPos = Math.floor(maxLots / lot);
    const risikoEuro = stopLossPips * (pipValueStandard * lot);
    const risikoProzent = (risikoEuro / accountSize) * 100;

    let comment = "";
    if (risikoProzent <= 2) comment = "✅ Sehr konservativ – langfristig stabil.";
    else if (risikoProzent <= 5) comment = "🟡 Moderat – akzeptabel bei A/B-Setups.";
    else if (risikoProzent <= 10) comment = "🟠 Hoch – nur bei A+ Setups.";
    else comment = "🔴 Extrem – Overleveraged, kaum empfehlenswert!";

    return `
      <div class="risk-box">
        📌 <strong>${label}</strong><br>
        Lotgröße: <strong>${lot.toFixed(2)}</strong><br>
        ➡️ Max. Positionen möglich: <strong>${maxPos}</strong><br>
        📉 Risiko pro Position: 
        <span>${risikoEuro.toFixed(2)} € (${risikoProzent.toFixed(2)} %)</span><br>
        💡 <em>${comment}</em>
      </div><br>
    `;
  }

  html += renderLotBlock(lotMain, "Pflicht-Lotgröße");
  if (!isNaN(lotAlt) && lotAlt > 0) {
    html += renderLotBlock(lotAlt, "Alternative Lotgröße");
  }

  // Profi-Empfehlungen dynamisch nach Risiko%
  const riskBase = riskPercent / 100;
  const rec1 = ((accountSize * riskBase) / (stopLossPips * pipValueStandard)).toFixed(2);
  const rec2 = ((accountSize * riskBase * 2) / (stopLossPips * pipValueStandard)).toFixed(2);
  const rec3 = ((accountSize * riskBase * 3) / (stopLossPips * pipValueStandard)).toFixed(2);

  html += `
    <hr>
    🎯 <strong>Empfehlungen basierend auf ${riskPercent}% Risiko:</strong><br>
    • Konservativ (${riskPercent}%): <strong>${rec1} Lots</strong><br>
    • Moderat (${riskPercent * 2}%): <strong>${rec2} Lots</strong><br>
    • Aggressiv (${riskPercent * 3}%): <strong>${rec3} Lots</strong><br>
  `;

  resultBox.style.display = "block";
  resultBox.className = "result-box " + sessionClass;
  resultBox.innerHTML = html;
}

// ✅ Dropdown beim Laden mit Symbolen befüllen
window.addEventListener("DOMContentLoaded", () => {
  populateSymbolDropdown("maxposSymbol");
});
