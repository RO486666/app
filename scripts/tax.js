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

// 📊 Steuerberechnung (Präzise CFD-Abgeltungsteuer)
function berechneSteuern() {
  const jahresEinkommen = parseFloat(document.getElementById("jahresEinkommen").value) || 0;
  const tradingGewinn = parseFloat(document.getElementById("gewinnBetrag").value) || 0;

  const mitKirche = document.getElementById("kirchensteuer").checked;
  const mitSoli = document.getElementById("soliZuschlag").checked;
  const mitReserve = document.getElementById("reserveZehn").checked;
  const ausgabe = document.getElementById("steuerAusgabe");

  ausgabe.className = "result-box";
  ausgabe.style.display = "block";

  if (tradingGewinn <= 0) {
    ausgabe.innerHTML = "❌ Bitte Gewinn eingeben!";
    ausgabe.classList.add("risk-extreme");
    return;
  }

  const gesamtEinkommen = jahresEinkommen + tradingGewinn;

  // 👉 Freibetrag einrechnen
  const sparerPauschbetrag = 1000.00;
  const zuVersteuern = Math.max(0, tradingGewinn - sparerPauschbetrag);

  // 👉 CFD Abgeltungsteuer-Berechnung unter Berücksichtigung des Kirchensteuerprivilegs
  let kaufstSatz = 0.25; // 25% Flat-Tax
  let soliSatz = mitSoli ? 0.055 : 0;
  let kistSatz = mitKirche ? 0.09 : 0;

  // Mathematisch exakte Formel für effektive Steuersätze mit Kirchensteueranrechnung
  let divisor = 1 + (kistSatz * 0.25);
  let effKaufstSatz = kaufstSatz / divisor;
  let effKistSatz = (kaufstSatz * kistSatz) / divisor;
  let effSoliSatz = (kaufstSatz * soliSatz) / divisor;

  let est = zuVersteuern * effKaufstSatz;
  let kirche = zuVersteuern * effKistSatz;
  let soli = zuVersteuern * effSoliSatz;
  let steuerlast = est + kirche + soli;

  // 👉 Liquiditäts-Reserve (Vorauszahlung) als freiwilliger Puffer für Folgetrades
  let reserve = 0;
  if (mitReserve) {
    reserve = steuerlast; // Puffer in Höhe der Steuerschuld
  }

  // Korrektur: Die Reserve schmälert NICHT das reale Netto dieses Jahres, da sie Vermögen bleibt.
  const netto = tradingGewinn - steuerlast;
  const gesamtZuruecklegen = steuerlast + reserve;

  // Auto-Übertragung in Netto-Planer
  document.getElementById("nettoBrutto").value = tradingGewinn.toFixed(2);
  document.getElementById("nettoSteuer").value = steuerlast.toFixed(2);
  document.getElementById("nettoReserve").value = reserve.toFixed(2);
  document.getElementById("nettoEntnommen").value = "";
  document.getElementById("nettoAusgabe").innerHTML = "";

  // 👉 Ausgabe
  ausgabe.innerHTML = `
    📈 <strong>Trading-Gewinn (CFD):</strong> ${tradingGewinn.toFixed(2)} €<br>
    💼 <strong>Jahreseinkommen (Job):</strong> ${jahresEinkommen.toFixed(2)} €<br>
    ⚖️ <strong>Gesamteinkommen (Info):</strong> ${gesamtEinkommen.toFixed(2)} €<br>
    ➡️ <strong>Steuersatz (Flat-Tax):</strong> 25.0 % (zzgl. Soli/KiSt)<br><br>
    💸 <strong>Abgeltungsteuer:</strong> ${est.toFixed(2)} € ${zuVersteuern < tradingGewinn ? `<em>(nach 1k Freibetrag)</em>` : ""}<br>
    ${mitKirche ? `✝️ Kirchensteuer (angerechnet): ${kirche.toFixed(2)} €<br>` : ""}
    ${mitSoli ? `💣 Solidaritätszuschlag: ${soli.toFixed(2)} €<br>` : ""}
    ${mitReserve ? `💥 Empfohlene Liquiditätsreserve: ${reserve.toFixed(2)} €<br>` : ""}

    <hr>
    📦 <strong>Gesamte Steuerlast (Anlage KAP):</strong> ${steuerlast.toFixed(2)} €<br>
    💰 <strong>Verfügbares Reales Netto:</strong> ${netto.toFixed(2)} €<br>
    ${mitReserve ? `<small style="color:#aaa;">ℹ️ Bei Abzug der optionalen Reserve verbleiben temporär: ${(netto - reserve).toFixed(2)} €</small><br><br>` : "<br>"}

    <button onclick='speichereTrade(${tradingGewinn}, ${steuerlast}, ${reserve}, ${netto})' 
      style="padding:10px 15px; border:none; border-radius:8px; background:#00aa44; color:#fff; font-weight:bold; cursor:pointer;">
      💾 Speichern
    </button>
  `;
  ausgabe.style.color = "#0f0";
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

  ausgabe.className = "result-box";
  ausgabe.style.display = "block";

  if ([brutto, steuer, entnommen].some(v => isNaN(v))) {
    ausgabe.innerHTML = "❌ Bitte alle Felder korrekt ausfüllen!";
    ausgabe.classList.add("risk-extreme");
    return;
  }

  // Korrektur: Das tatsächliche Netto berechnet sich rein aus Brutto abzüglich Steuer.
  const netto = brutto - steuer;
  
  // Für das Budgeting (Verfügbarkeit auf dem Girokonto) ziehen wir den gewählten Puffer ab
  const verfuegbaresBudget = netto - reserve;
  const differenz = entnommen - verfuegbaresBudget;

  if (differenz > 0) {
    ausgabe.innerHTML = `
      📦 Reales Netto-Gewinn (nach Steuer): <strong>${netto.toFixed(2)} €</strong><br>
      💸 Abzüge: ${steuer.toFixed(2)} € Abgeltungsteuer<br>
      🛡️ Puffer-Reserve auf Konto belassen: ${reserve.toFixed(2)} €<br>
      🏦 Zur Entnahme geplant: ${entnommen.toFixed(2)} €<br><br>
      ⚠️ Warnung: Du entnimmst <strong>${differenz.toFixed(2)} €</strong> mehr als dein sicheres Budget erlaubt.<br>
      💡 Empfehlung: Reduziere die Entnahme oder passe deine Liquidität an.
    `;
    ausgabe.classList.add("risk-high");
  } else {
    ausgabe.innerHTML = `
      📦 Reales Netto-Gewinn (nach Steuer): <strong>${netto.toFixed(2)} €</strong><br>
      💸 Abzüge: ${steuer.toFixed(2)} € Abgeltungsteuer<br>
      🛡️ Puffer-Reserve auf Konto belassen: ${reserve.toFixed(2)} €<br>
      🏦 Zur Entnahme geplant: ${entnommen.toFixed(2)} €<br><br>
      ✅ Entnahme im grünen Bereich. Die gewählte Reserve ist gesichert.
    `;
    ausgabe.classList.add("risk-low");
  }

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