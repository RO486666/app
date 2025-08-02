function simulateDawnDeath() {
  let capital = parseFloat(document.getElementById("dawnCapital").value);
  const lossPercent = parseFloat(document.getElementById("dawnLoss").value);
  const result = document.getElementById("dawnDeathResult");

  if (isNaN(capital) || isNaN(lossPercent) || capital <= 0 || lossPercent <= 0) {
    result.innerHTML = "❌ Bitte gültige Werte eingeben!";
    result.style.color = "#f44";
    return;
  }

  let count = 0;
  const history = [];

  while (capital > 1) {
    capital *= (1 - lossPercent / 100);
    count++;
    history.push(capital.toFixed(2));
    if (count > 5000) break; // Sicherheitsbremse
  }

  result.innerHTML = `💀 Du kannst maximal <strong>${count}</strong> Dawn-Verluste von <strong>${lossPercent}%</strong> überleben, bevor dein Konto aufgebraucht ist.<br><br>
  📉 Letzter Stand: <strong>${capital.toFixed(2)} €</strong>`;
  result.style.color = "#ffcc00";
}
