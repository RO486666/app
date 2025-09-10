function switchPosMode(mode) {
  // Alle Subboxen innerhalb calc-pos verstecken
  document.querySelectorAll("#calc-pos .sub-box").forEach(box => {
    box.style.display = "none";
  });

  if (mode === "main") {
    document.getElementById("pos-mode-main").style.display = "block";
  } else if (mode === "max") {
    document.getElementById("pos-mode-max").style.display = "block";
  } else if (mode === "pips") {
    document.getElementById("pos-mode-pips").style.display = "block";
  }
}


function calculatePipsByLots() {
  const symbol = document.getElementById("pipSymbolSelector").value;
  const lots = parseFloat(document.getElementById("lots").value);
  const slPips = parseFloat(document.getElementById("slPips").value);
  const tp1 = parseFloat(document.getElementById("tp1Pips").value);
  const tp2 = parseFloat(document.getElementById("tp2Pips").value);
  const tp3 = parseFloat(document.getElementById("tp3Pips").value);
  const resultBox = document.getElementById("pipResult");

  // ❌ Fehlerprüfung
  if (!symbol || isNaN(lots) || lots <= 0 || isNaN(slPips) || slPips <= 0) {
    resultBox.style.display = "block";
    resultBox.className = "result-box risk-extreme"; // rot + Glow
    resultBox.innerHTML = "❌ Bitte Symbol, Lots und Stop-Loss korrekt eingeben!";
    return;
  }

  // ⬇️ Zugriff auf deine zentralen Daten
  const pipValue = pipValues[symbol] || 10;
  const price = getCurrentPrice(symbol) || 1;
  const contractSize = basisWerte[symbol] || 100000;

  // 📉 Stop-Loss Risiko in €
  const slMoney = slPips * pipValue * lots;

  // 👉 Risiko-Klasse bestimmen
  let riskClass = "risk-low";
  if (slMoney > 50 && slMoney <= 100) riskClass = "risk-mid";
  else if (slMoney > 100 && slMoney <= 200) riskClass = "risk-high";
  else if (slMoney > 200) riskClass = "risk-extreme";

  // 👉 Session-Glow bestimmen (aus session.js kommt activeSessionName)
  let sessionClass = "";
  if (typeof activeSessionName !== "undefined" && activeSessionName) {
    sessionClass = "session-" + activeSessionName.toLowerCase();
  }

// 📊 Ausgabe bauen
let output = `
  <div class="pip-box">
    <div class="risk-box ${riskClass}">
      📉 <strong>Stop-Loss:</strong><br>
      ${slPips} Pips → <span>${slMoney.toFixed(2)} €</span>
    </div>
    <br>
`;

// 🎯 Take Profits
[tp1, tp2, tp3].forEach((tp, i) => {
  if (!isNaN(tp) && tp > 0) {
    const tpMoney = tp * pipValue * lots;
    output += `
      <div class="risk-box risk-low">
        🎯 <strong>TP${i + 1}:</strong><br>
        ${tp} Pips → <span>+${tpMoney.toFixed(2)} €</span>
      </div>
      <br>
    `;
  }
});

// ℹ️ Basisdaten
output += `
    <hr>
    <div class="risk-mid">
      ℹ️ <strong>Basisdaten</strong><br>
      Pip = ${pipValue}<br>
      Preis = ${price}<br>
      Kontrakt = ${contractSize}
    </div>
  </div>
`;

  // ✅ Ergebnisbox sichtbar machen + Klassen setzen
  resultBox.style.display = "block";
  resultBox.className = "result-box " + riskClass + " " + sessionClass;
  resultBox.innerHTML = output;

  document.getElementById("pipResult").innerHTML = output;
}


