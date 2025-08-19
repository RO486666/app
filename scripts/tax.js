let planMode = "steuer";

// 🔁 Umschalten zwischen Steuer- und Netto-Planer
function switchPlanMode() {
  const steuerDiv = document.getElementById("steuerMode");
  const nettoDiv = document.getElementById("nettoMode");
  const toggleBtn = document.getElementById("planToggleBtn");

  if (planMode === "steuer") {
    planMode = "netto";
    steuerDiv.style.display = "none";
    nettoDiv.style.display = "block";
    toggleBtn.textContent = "🔁 Zurück zum Steuerplaner";
  } else {
    planMode = "steuer";
    steuerDiv.style.display = "block";
    nettoDiv.style.display = "none";
    toggleBtn.textContent = "🔁 Zu Netto-Planer wechseln";
  }
}

// 🗂 Speicher für Trades
let trades = JSON.parse(localStorage.getItem("tradeHistory") || "[]");

// 📊 Steuerberechnung (ohne Auto-Speichern)
function berechneSteuern() {
  const jahresEinkommen = parseFloat(document.getElementById("jahresEinkommen").value) || 0;
  const tradingGewinn = parseFloat(document.getElementById("gewinnBetrag").value) || 0;

  const mitKirche = document.getElementById("kirchensteuer").checked;
  const mitSoli = document.getElementById("soliZuschlag").checked;
  const mitReserve = document.getElementById("reserveZehn").checked;
  const ausgabe = document.getElementById("steuerAusgabe");

  if (tradingGewinn <= 0) {
    ausgabe.innerHTML = "❌ Bitte Gewinn eingeben!";
    ausgabe.style.color = "#f44";
    return;
  }

  const gesamtEinkommen = jahresEinkommen + tradingGewinn;
  let estSatz = 0.25;
  if (gesamtEinkommen <= 11000) estSatz = 0.0;
  else if (gesamtEinkommen <= 62000) estSatz = 0.30;
  else if (gesamtEinkommen <= 277000) estSatz = 0.42;
  else estSatz = 0.45;

  let est = tradingGewinn * estSatz;
  const kirche = mitKirche ? est * 0.09 : 0;
  const soli = mitSoli ? est * 0.055 : 0;
  let steuerlast = est + kirche + soli;
  const vorauszahlung = steuerlast / 4;

  let reserve = 0;
  if (mitReserve) reserve = vorauszahlung;

  const netto = tradingGewinn - steuerlast - reserve;
  
    // 👉 Automatisch Werte in Netto-Planer übertragen
  document.getElementById("nettoBrutto").value = tradingGewinn.toFixed(2);
  document.getElementById("nettoSteuer").value = steuerlast.toFixed(2);
  document.getElementById("nettoReserve").value = reserve.toFixed(2); // Reserve extra Feld
  document.getElementById("nettoEntnommen").value = ""; // User trägt Entnahme ein
  document.getElementById("nettoAusgabe").innerHTML = ""; // Reset Ausgabe


  // Ergebnis + Speichern-Button
  ausgabe.innerHTML = `
    📈 <strong>Trading-Gewinn:</strong> ${tradingGewinn.toFixed(2)} €<br>
    💼 <strong>Jahreseinkommen (Job):</strong> ${jahresEinkommen.toFixed(2)} €<br>
    ⚖️ <strong>Gesamteinkommen:</strong> ${gesamtEinkommen.toFixed(2)} €<br>
    ➡️ <strong>Steuersatz:</strong> ${(estSatz * 100).toFixed(1)} %<br><br>
    💸 <strong>Steuer:</strong> ${est.toFixed(2)} €<br>
    ${mitKirche ? `✝️ Kirchensteuer: ${kirche.toFixed(2)} €<br>` : ""}
    ${mitSoli ? `💣 Soli: ${soli.toFixed(2)} €<br>` : ""}
    ${mitReserve ? `💥 Reserve (1 Quartal): ${reserve.toFixed(2)} €<br>` : ""}
    <br>📦 <strong>Gesamt zurücklegen:</strong> ${(steuerlast + reserve).toFixed(2)} €<br>
    💰 <strong>Verfügbarer Netto-Gewinn:</strong> ${netto.toFixed(2)} €<br><br>
    🔮 <strong>Vorauszahlung pro Quartal:</strong> ${vorauszahlung.toFixed(2)} €<br><br>

    <button onclick='speichereTrade(${tradingGewinn}, ${steuerlast}, ${reserve}, ${netto})' 
      style="padding:10px 15px; border:none; border-radius:8px; background:#00aa44; color:#fff; font-weight:bold; cursor:pointer;">
      💾 Speichern
    </button>
  `;
  ausgabe.style.color = "#0f0";

  // Eingabefeld nach Berechnung zurücksetzen
  document.getElementById("gewinnBetrag").value = "";
}

// 💾 Manuelles Speichern
function speichereTrade(gewinn, steuer, reserve, netto) {
  const trade = {
    id: Date.now(),
    datum: new Date().toLocaleString(),
    gewinn, steuer, reserve, netto
  };
  trades.push(trade);
  localStorage.setItem("tradeHistory", JSON.stringify(trades));
  updateTradeTable();

  // Übernahme für Netto-Planer
  document.getElementById("nettoBrutto").value = gewinn.toFixed(2);
  document.getElementById("nettoSteuer").value = steuer.toFixed(2);
  document.getElementById("nettoEntnommen").value = "";
  document.getElementById("nettoAusgabe").innerHTML = "";
}

// ❌ Einzelnen Trade löschen
function loescheTrade(id) {
  trades = trades.filter(t => t.id !== id);
  localStorage.setItem("tradeHistory", JSON.stringify(trades));
  updateTradeTable();
}

// ❌ Alle Trades löschen
function loescheAlleTrades() {
  if (!confirm("⚠️ Wirklich alle gespeicherten Trades löschen?")) return;
  trades = [];
  localStorage.removeItem("tradeHistory");
  updateTradeTable();
}

// 📊 Tabelle rendern
function updateTradeTable() {
  const tableDiv = document.getElementById("tradeTable");
  if (!tableDiv) return;

  if (trades.length === 0) {
    tableDiv.innerHTML = "Noch keine Trades gespeichert.";
    return;
  }

  let rows = trades.map(t => `
    <tr>
      <td>${t.datum}</td>
      <td>${t.gewinn.toFixed(2)} €</td>
      <td>${t.steuer.toFixed(2)} €</td>
      <td>${t.reserve.toFixed(2)} €</td>
      <td>${t.netto.toFixed(2)} €</td>
      <td><button onclick="loescheTrade(${t.id})" class="delete-btn">🗑️</button></td>
    </tr>`).join("");

  const sumGewinn = trades.reduce((a, t) => a + t.gewinn, 0);
  const sumSteuer = trades.reduce((a, t) => a + t.steuer, 0);
  const sumReserve = trades.reduce((a, t) => a + t.reserve, 0);
  const sumNetto = trades.reduce((a, t) => a + t.netto, 0);

  tableDiv.innerHTML = `
    <table class="trade-table">
      <thead>
        <tr><th>Datum</th><th>Gewinn</th><th>Steuer</th><th>Reserve</th><th>Netto</th><th>Aktion</th></tr>
      </thead>
      <tbody>
        ${rows}
        <tr class="sum-row">
          <td>Σ Summe</td>
          <td>${sumGewinn.toFixed(2)} €</td>
          <td>${sumSteuer.toFixed(2)} €</td>
          <td>${sumReserve.toFixed(2)} €</td>
          <td>${sumNetto.toFixed(2)} €</td>
          <td></td>
        </tr>
      </tbody>
    </table>
    <button onclick="loescheAlleTrades()" class="delete-all-btn">❌ Alle löschen</button>
  `;
}

// 👉 Beim Laden alte Tabelle laden
window.addEventListener("DOMContentLoaded", updateTradeTable);

// 🧮 Netto-Berechnung + Entnahmeprüfung
function berechneNettoPlan() {
  const brutto = parseFloat(document.getElementById("nettoBrutto").value);
  const steuer = parseFloat(document.getElementById("nettoSteuer").value);
  const reserve = parseFloat(document.getElementById("nettoReserve").value) || 0;
  const entnommen = parseFloat(document.getElementById("nettoEntnommen").value);
  const ausgabe = document.getElementById("nettoAusgabe");

  if ([brutto, steuer, entnommen].some(v => isNaN(v))) {
    ausgabe.innerHTML = "❌ Bitte alle Felder korrekt ausfüllen!";
    ausgabe.style.color = "#f44";
    return;
  }

  // Netto nach Steuer & Reserve
  const netto = brutto - steuer - reserve;
  const differenz = entnommen - netto;

  let output = `
    📦 Netto-Gewinn (nach Steuer + Reserve): <strong>${netto.toFixed(2)} €</strong><br>
    💸 Abzüge: ${steuer.toFixed(2)} € Steuer + ${reserve.toFixed(2)} € Reserve<br>
    🏦 Entnommen: ${entnommen.toFixed(2)} €<br><br>
  `;

  if (differenz > 0) {
    output += `
      ⚠️ Du hast <strong>${differenz.toFixed(2)} €</strong> zu viel entnommen.<br>
      💡 Empfehlung: Beim nächsten Gewinn mindestens <strong>${differenz.toFixed(2)} €</strong> zurücklegen.
    `;
    ausgabe.style.color = "#ffaa00";
  } else {
    output += `✅ Entnahme im Rahmen. Kein Ausgleich nötig.`;
    ausgabe.style.color = "#0f0";
  }

  ausgabe.innerHTML = output;

  // 💾 Netto-Auswertung speichern
  localStorage.setItem("nettoPlanMemory", JSON.stringify({
    brutto, steuer, reserve, entnommen, differenz,
    timestamp: new Date().toISOString()
  }));
}


// 🧹 Beim Laden: Nettofelder leeren
window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("nettoBrutto").value = "";
  document.getElementById("nettoSteuer").value = "";
  document.getElementById("nettoEntnommen").value = "";
  document.getElementById("nettoAusgabe").innerHTML = "";
});