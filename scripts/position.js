
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

  // ❌ Fehlerprüfung
  if (
    isNaN(accountSize) || isNaN(riskPercent) || isNaN(stopLossPips) ||
    isNaN(leverage) || accountSize <= 0 || riskPercent <= 0 ||
    stopLossPips <= 0 || leverage <= 0 || !pipValueStandard
  ) {
    resultEl.style.display = "block";
    resultEl.className = "result-box risk-extreme"; 
    resultEl.innerHTML = "❌ Bitte alle Felder korrekt ausfüllen!";
    return;
  }

  const riskAmount = accountSize * (riskPercent / 100);
  let baseLot = riskAmount / (stopLossPips * pipValueStandard);
  const price = getCurrentPrice(symbol);
  const contractSize = basisWerte[symbol];
  const maxLots = (accountSize * leverage) / (price * contractSize);

  let output = "";

  if (0.01 > maxLots) {
    resultEl.style.display = "block";
    resultEl.className = "result-box risk-extreme";
    resultEl.innerHTML = `❌ Mit diesem Hebel kannst du dir keine <strong>0.01 Lots</strong> leisten.<br>
      📏 Maximal erlaubt bei ${leverage}x Hebel: <strong>${maxLots.toFixed(4)} Lots</strong><br><br>
      Bitte Hebel oder Kapital erhöhen.`;
    return;
  }

  if (baseLot < 0.01) {
    output += `<div class="risk-mid">⚠️ Empfohlene Größe: <strong>${baseLot.toFixed(4)}</strong> Lots (unter 0.01)<br>
               🔒 Mindestgröße: 0.01 Lots – Risiko kleiner als erwartet.</div><br>`;
    baseLot = 0.01;
  }

  const pipValueActual = pipValueStandard * baseLot;
  const risikoEuroEmpfohlen = stopLossPips * pipValueActual;
  const risikoProzentEmpfohlen = (risikoEuroEmpfohlen / accountSize) * 100;

  // Hilfsfunktion für Risiko-Klassen
  function getRiskClass(riskPercent) {
    if (riskPercent < 2) return "risk-low";
    if (riskPercent < 5) return "risk-mid";
    if (riskPercent < 10) return "risk-high";
    return "risk-extreme";
  }
  

  // 🌍 Session-Glow
  let sessionClass = "";
  if (typeof activeSessionName !== "undefined" && activeSessionName) {
    sessionClass = "session-" + activeSessionName.toLowerCase();
  }

  // 📊 Risiko-Hauptinfo
  const risikoClass = getRiskClass(risikoProzentEmpfohlen);
  output += `<div class="${risikoClass}">
               💸 Dein Risiko: ${risikoEuroEmpfohlen.toFixed(2)} € 
               (${risikoProzentEmpfohlen.toFixed(2)} % von ${accountSize} €)
             </div><br>`;

  // 📈 Verschiedene Szenarien
const steps = [
  { mult: 1, label: "✅ Empfohlen", cls: "low1" },
  { mult: 2, label: "🟡 Riskant",   cls: "low2" },
  { mult: 3, label: "🟡 Riskant",   cls: "mid1" },
  { mult: 4, label: "🔥 Hoch",      cls: "mid2" },
  { mult: 5, label: "🧮 Sehr hoch", cls: "high" },
];

steps.forEach(s => {
  const lot = (baseLot * s.mult).toFixed(2);
  const risk = (risikoProzentEmpfohlen * s.mult).toFixed(1);
  output += `<div class="risk-step ${s.cls}">
               ${s.label}: ${lot} Lots (Risiko ${risk}%)
             </div>`;
});

// ⚠️ Limit-Zeile dunkelrot
const limitLots = (baseLot * steps[4].mult).toFixed(2);
output += `<div class="risk-step extreme">
             ⚠️ Mehr als ${limitLots} Lots = über deinem Risiko-Limit
           </div>`;


  // 📏 Hebel-Limit
  output += `<div class="risk-mid">📏 Maximal erlaubt bei ${leverage}x Hebel: <strong>${maxLots.toFixed(2)} Lots</strong></div>`;

  // 🔧 Manuelle Lots
  if (!isNaN(manualLots) && manualLots > 0) {
    const pipValueManuell = pipValueStandard * manualLots;
    const risikoEuroManuell = stopLossPips * pipValueManuell;
    const risikoProzentManuell = (risikoEuroManuell / accountSize) * 100;
    const manualClass = getRiskClass(risikoProzentManuell);

    output += `<hr><div class="${manualClass}">
                 📉 Risiko bei manueller Lotgröße (${manualLots}): 
                 ${risikoEuroManuell.toFixed(2)} € 
                 (${risikoProzentManuell.toFixed(2)} % von ${accountSize} €)
               </div>`;
  }

  // ✅ Ausgabe einblenden
  resultEl.style.display = "block";
  resultEl.className = "result-box " + sessionClass;
  resultEl.innerHTML = output;
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

