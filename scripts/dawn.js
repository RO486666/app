// dawn.js

let dawnChart; // globale Chart-Referenz für Destroy/Update

function simulateDawnDeath() {
  const capitalInput = document.getElementById("dawnCapital");
  const lossInput = document.getElementById("dawnLoss");
  const result = document.getElementById("dawnDeathResult");

  let capital = parseFloat(capitalInput.value);
  const lossPercent = parseFloat(lossInput.value);

  if (isNaN(capital) || isNaN(lossPercent) || capital <= 0 || lossPercent <= 0) {
    result.innerHTML = "❌ Bitte gültige Werte eingeben!";
    result.style.color = "#f44";
    return;
  }

  const startCapital = capital;
  let count = 0;
  const history = [capital];

  // 📉 reine Verlust-Simulation (Prozent-Verluste nacheinander)
  while (capital > 1) {
    capital *= (1 - lossPercent / 100);
    count++;
    history.push(Number(capital.toFixed(2)));
    if (count > 5000) break; // Sicherheitsbremse
  }

  // 🔄 Recovery: wie viel % Gewinn braucht man, um einen Verlust von X% auszugleichen?
  // Formel: required% = loss% / (100 - loss%) * 100
  const recovery = (lossPercent / (100 - lossPercent) * 100).toFixed(1);

  // 📝 Ergebnis
  result.innerHTML = `
    💀 Du überlebst maximal <strong>${count}</strong> Dawn-Verluste à <strong>${lossPercent}%</strong>.<br><br>
    📉 Letzter Stand: <strong>${capital.toFixed(2)} €</strong><br><br>
    🔄 Um <strong>${lossPercent}%</strong> Verlust auszugleichen, brauchst du ca. <strong>${recovery}%</strong> Gewinn.
  `;
  result.style.color = "#ffcc00";

  // 📈 Chart zeichnen/aktualisieren (Chart.js muss in index.html geladen sein)
  const canvas = document.getElementById("dawnChart");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (dawnChart) dawnChart.destroy();

  dawnChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: history.map((_, i) => i), // 0,1,2,... (Anzahl Verluste)
      datasets: [{
        label: "Kapital-Verlauf",
        data: history,
        borderColor: "#ffcc00",
        backgroundColor: "rgba(255,204,0,0.20)",
        borderWidth: 2,
        fill: true,
        tension: 0.2,
        pointRadius: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      animation: false,
      scales: {
        x: {
          title: { display: true, text: "Anzahl Verluste" },
          ticks: { maxTicksLimit: 10 }
        },
        y: {
          title: { display: true, text: "Kapital (€)" },
          beginAtZero: true
        }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => `€ ${Number(ctx.parsed.y).toLocaleString("de-DE", { maximumFractionDigits: 2 })}`
          }
        }
      }
    }
  });
}
