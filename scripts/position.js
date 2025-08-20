
function calculatePositionSize() {
  const accountSize = parseFloat(document.getElementById("accountSize").value);
  const riskPercent = parseFloat(document.getElementById("riskPercent").value);
  const stopLossPips = parseFloat(document.getElementById("stopLossPips").value);
  const leverage = parseFloat(document.getElementById("leverage").value);
  const symbol = document.getElementById("symbolSelector").value;
  const manualLots = parseFloat(document.getElementById("manualLots")?.value);
  const resultEl = document.getElementById("positionSizeResult");

 
  const pipValueStandard = pipValues[symbol];
  const basis = basisWerte[symbol] || 100000;

  if (
    isNaN(accountSize) || isNaN(riskPercent) || isNaN(stopLossPips) ||
    isNaN(leverage) || accountSize <= 0 || riskPercent <= 0 ||
    stopLossPips <= 0 || leverage <= 0 || !pipValueStandard
  ) {
    resultEl.innerHTML = "❌ Bitte alle Felder korrekt ausfüllen!";
    resultEl.style.color = "#f44";
    return;
  }

  const riskAmount = accountSize * (riskPercent / 100);
  let baseLot = riskAmount / (stopLossPips * pipValueStandard);
  const price = getCurrentPrice(symbol); // aktueller Marktpreis vom Symbol
const contractSize = basisWerte[symbol]; // Lot-Größe (z.B. 100000 bei Forex, 1 bei BTC)
const maxLots = (accountSize * leverage) / (price * contractSize);

  let output = "";

  if (0.01 > maxLots) {
    resultEl.innerHTML = `❌ Mit diesem Hebel kannst du dir keine <strong>0.01 Lots</strong> leisten.<br>
      📏 Maximal erlaubt bei ${leverage}x Hebel: <strong>${maxLots.toFixed(4)} Lots</strong><br><br>
      Bitte Hebel oder Kapital erhöhen.`;
    resultEl.style.color = "#f44";
    return;
  }

  const originalLot = baseLot;
  if (baseLot < 0.01) {
    output += `⚠️ Empfohlene Größe: <strong>${baseLot.toFixed(4)}</strong> Lots (unter 0.01)<br>`;
    output += `🔒 Mindestgröße: 0.01 Lots – Risiko kleiner als erwartet.<br><br>`;
    baseLot = 0.01;
  }

  const pipValueActual = pipValueStandard * baseLot;
  const risikoEuroEmpfohlen = stopLossPips * pipValueActual;
  const risikoProzentEmpfohlen = (risikoEuroEmpfohlen / accountSize) * 100;

  function getRiskComment(riskPercent) {
    if (riskPercent < 1) return "✅ Sehr konservativ";
    if (riskPercent < 2) return "🟢 Konservativ";
    if (riskPercent < 5) return "🟡 Neutral";
    if (riskPercent < 10) return "🟠 Erhöhtes Risiko";
    if (riskPercent < 20) return "🔴 Sehr hohes Risiko";
    return "🔥 Extrem riskant – nur für Profis!";
  }

  output += `<br>${getRiskComment(risikoProzentEmpfohlen)}<br><br>`;

  let risikoTitel = "📉 Dein Risiko:";
  if (risikoProzentEmpfohlen >= 10) risikoTitel = "⚠️ Dein Risiko (nicht empfohlen):";
  else if (risikoProzentEmpfohlen >= 5) risikoTitel = "🟠 Dein Risiko (grenzwertig):";
  else if (risikoProzentEmpfohlen >= 2) risikoTitel = "🟡 Dein Risiko (moderat):";
  else risikoTitel = "✅ Dein Risiko (empfohlen):";

  output += `<strong>${risikoTitel}</strong><br>`;
  output += `💸 <strong>${risikoEuroEmpfohlen.toFixed(2)} €</strong> (${risikoProzentEmpfohlen.toFixed(2)} % von ${accountSize} €)<br><br>`;

  const steps = [1, 2, 3, 4, 5];
  output += `✅ Empfohlen: <strong>${(baseLot * steps[0]).toFixed(2)}</strong> Lots<br>`;
  output += `🟡 Riskant: ${(baseLot * steps[1]).toFixed(2)} Lots (Risiko ${(risikoProzentEmpfohlen * steps[1]).toFixed(1)}%)<br>`;
  output += `🟡 Riskant: ${(baseLot * steps[2]).toFixed(2)} Lots (Risiko ${(risikoProzentEmpfohlen * steps[2]).toFixed(1)}%)<br>`;
  output += `🔥 Hoch: ${(baseLot * steps[3]).toFixed(2)} Lots (Risiko ${(risikoProzentEmpfohlen * steps[3]).toFixed(1)}%)<br>`;
  output += `🧮 Sehr hoch: ${(baseLot * steps[4]).toFixed(2)} Lots (Risiko ${(risikoProzentEmpfohlen * steps[4]).toFixed(1)}%)<br>`;
  output += `⚠️ Mehr als ${(baseLot * steps[4]).toFixed(2)} Lots = über deinem Risiko-Limit<br><hr>`;
  output += `📏 Maximal erlaubt bei ${leverage}x Hebel: <strong>${maxLots.toFixed(2)} Lots</strong><br>`;

  if (!isNaN(manualLots) && manualLots > 0) {
    const pipValueManuell = pipValueStandard * manualLots;
    const risikoEuroManuell = stopLossPips * pipValueManuell;
    const risikoProzentManuell = (risikoEuroManuell / accountSize) * 100;

    output += `<hr><strong>📉 Risiko bei manueller Lotgröße (${manualLots}):</strong><br>`;
    output += `💸 <strong>${risikoEuroManuell.toFixed(2)} €</strong> (${risikoProzentManuell.toFixed(2)} % von ${accountSize} €)<br>`;
  }

  resultEl.innerHTML = output;
  resultEl.style.color = "#0f0";
}

function switchCalcTab(tab) {
  document.querySelectorAll(".calc-box").forEach(box => {
    box.style.display = "none";
  });

  const target = document.getElementById("calc-" + tab);
  if (target) target.style.display = "block";

  document.querySelectorAll(".tab-buttons .btn").forEach(btn => btn.classList.remove("active"));
  const btn = document.getElementById("btn-calc-" + tab);
  if (btn) btn.classList.add("active");
}
function calculateMaxPositions() {
  const accountSize = parseFloat(document.getElementById("maxposAccountSize").value);
  const riskPercent = parseFloat(document.getElementById("maxposRiskPercent").value);
  const stopLossPips = parseFloat(document.getElementById("maxposStopLoss").value);
  const leverage = parseFloat(document.getElementById("maxposLeverage").value);
  const lotFrom = parseFloat(document.getElementById("lotFrom").value);
  const lotTo = parseFloat(document.getElementById("lotTo").value);

  if (!accountSize || !riskPercent || !stopLossPips || !leverage || !lotFrom || !lotTo) {
    document.getElementById("maxposResults").innerHTML = "❌ Bitte alle Felder ausfüllen!";
    return;
  }

  // Standardwerte für Forex
  const pipValueStandard = 10; // $10 pro Pip pro 1 Lot
  const basis = 100000; // Standard Kontraktgröße

  // Maximale Lots nach Margin-Bedingung
  const maxLots = (accountSize * leverage) / basis;

  let html = `📏 Maximal erlaubt bei ${leverage}x Hebel: <strong>${maxLots.toFixed(2)} Lots</strong><br><br>`;

  [lotFrom, lotTo].forEach(lot => {
    const maxPos = Math.floor(maxLots / lot);
    const risikoEuro = stopLossPips * (pipValueStandard * lot);
    const risikoProzent = (risikoEuro / accountSize) * 100;
    const risikoText = getRiskComment(risikoProzent);

    html += `Lotgröße ${lot.toFixed(2)} → max. ${maxPos} Positionen 
             <input type="number" min="0" max="${maxPos}" 
                    onchange="updateTotalRisk(${risikoEuro}, ${accountSize})" 
                    style="width:60px; margin-left:10px;"> 
             <br>📉 Risiko pro Position: ${risikoEuro.toFixed(2)} € (${risikoProzent.toFixed(2)} %) – ${risikoText}<br><br>`;
  });

  html += `<div id="totalRiskDisplay" style="margin-top:10px;"></div>`;
  document.getElementById("maxposResults").innerHTML = html;
}

function updateTotalRisk(riskPerPos, accountSize) {
  const inputs = document.querySelectorAll('#maxposResults input[type="number"]');
  let totalRisk = 0;
  inputs.forEach(inp => {
    const val = parseInt(inp.value) || 0;
    totalRisk += val * riskPerPos;
  });
  const totalRiskPercent = (totalRisk / accountSize) * 100;
  document.getElementById("totalRiskDisplay").innerHTML =
    `📉 Risiko gesamt für deine Auswahl: ${totalRisk.toFixed(2)} € (${totalRiskPercent.toFixed(2)} %) – ${getRiskComment(totalRiskPercent)}`;
}

function getRiskComment(percent) {
  if (percent < 1) return "✅ Sehr konservativ";
  if (percent < 2) return "🟢 Konservativ";
  if (percent < 5) return "🟡 Moderat";
  if (percent < 10) return "🟠 Erhöht";
  return "🔴 Hoch";
}


function switchPosMode() {
  const posBox = document.querySelector("#calc-pos .stats-box");
  const maxPosBox = document.getElementById("calc-maxpos");

  if (posBox.style.display !== "none") {
    posBox.style.display = "none";
    maxPosBox.style.display = "block";
  } else {
    posBox.style.display = "block";
    maxPosBox.style.display = "none";
  }
}



window.addEventListener("DOMContentLoaded", () => {
  if (typeof initPipPairSelect === "function") initPipPairSelect();
});

