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

  if (!symbol || isNaN(lots) || isNaN(slPips)) {
    document.getElementById("pipResult").innerHTML = "❌ Bitte Symbol, Lots und SL-Pips eingeben!";
    return;
  }

  // ⬇️ Zugriff auf deine zentralen Daten
  const pipValue = pipValues[symbol] || 10;
  const price = getCurrentPrice(symbol) || 1;
  const contractSize = basisWerte[symbol] || 100000;

  // 🔹 SL in Geld
  const slMoney = slPips * pipValue * lots;
  let output = `📉 Stop-Loss: ${slPips} Pips (≈ ${slMoney.toFixed(2)} €)<br>`;

  // 🔹 TPs berechnen
  [tp1, tp2, tp3].forEach((tp, i) => {
    if (!isNaN(tp) && tp > 0) {
      const tpMoney = tp * pipValue * lots;
      output += `🎯 TP${i+1}: ${tp} Pips (≈ ${tpMoney.toFixed(2)} €)<br>`;
    }
  });

  // Debug: zeig die genutzten Werte mit an
  output += `<br><small>ℹ️ Basis: Pip=${pipValue}, Preis=${price}, Kontrakt=${contractSize}</small>`;

  document.getElementById("pipResult").innerHTML = output;
}


