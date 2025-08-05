let planMode = "steuer";

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

function berechneSteuern() {
  const betrag = parseFloat(document.getElementById("gewinnBetrag").value);
  const estSatz = parseFloat(document.getElementById("einkommenSteuer").value);
  const mitKirche = document.getElementById("kirchensteuer").checked;
  const mitSoli = document.getElementById("soliZuschlag").checked;
  const mitReserve = document.getElementById("reserveZehn").checked;
  const ausgabe = document.getElementById("steuerAusgabe");

  if (isNaN(betrag) || isNaN(estSatz) || betrag <= 0 || estSatz <= 0) {
    ausgabe.innerHTML = "❌ Bitte Gewinn & Steuersatz korrekt eingeben!";
    ausgabe.style.color = "#f44";
    return;
  }

  const est = betrag * (estSatz / 100);
  const kirche = mitKirche ? est * 0.09 : 0;
  const soli = mitSoli ? est * 0.055 : 0;
  const reserve = mitReserve ? betrag * 0.10 : 0;

  const steuerlast = est + kirche + soli;
  const netto = betrag - steuerlast;
  const vorauszahlung = steuerlast / 4;

  let output = "";
  output += `📊 <strong>Summe Gewinne:</strong> ${betrag.toFixed(2)} €<br>`;
  output += `💸 <strong>Einkommensteuer:</strong> ${est.toFixed(2)} €<br>`;
  if (mitKirche) output += `✝️ Kirchensteuer: ${kirche.toFixed(2)} €<br>`;
  if (mitSoli) output += `💣 Soli: ${soli.toFixed(2)} €<br>`;
  if (mitReserve) output += `💥 Reserve: ${reserve.toFixed(2)} €<br>`;
  output += `<br>📦 <strong>Gesamtsteuerlast:</strong> ${steuerlast.toFixed(2)} €<br>`;
  output += `💰 <strong>Netto-Gewinn:</strong> ${netto.toFixed(2)} €<br><br>`;
  output += `🔮 <strong>Vorauszahlung nächstes Jahr (vierteljährlich):</strong> ${vorauszahlung.toFixed(2)} €`;

  ausgabe.innerHTML = output;
  ausgabe.style.color = "#0f0";

  // 💾 Nur Steuerplan speichern
  localStorage.setItem("lastTaxPlan", JSON.stringify({
    betrag, est, kirche, soli, reserve, steuerlast, netto, vorauszahlung,
    timestamp: new Date().toISOString()
  }));

  // 🔁 Nur live Netto-Werte setzen (nicht speichern)
  document.getElementById("nettoBrutto").value = betrag.toFixed(2);
  document.getElementById("nettoSteuer").value = steuerlast.toFixed(2);
  document.getElementById("nettoEntnommen").value = "";
  document.getElementById("nettoAusgabe").innerHTML = "";
}



function berechneNettoPlan() {
  const brutto = parseFloat(document.getElementById("nettoBrutto").value);
  const steuer = parseFloat(document.getElementById("nettoSteuer").value);
  const entnommen = parseFloat(document.getElementById("nettoEntnommen").value);
  const ausgabe = document.getElementById("nettoAusgabe");

  if ([brutto, steuer, entnommen].some(v => isNaN(v))) {
    ausgabe.innerHTML = "❌ Bitte alle Felder korrekt ausfüllen!";
    ausgabe.style.color = "#f44";
    return;
  }

  const netto = brutto - steuer;
  const differenz = entnommen - netto;

  let output = `📦 Netto-Gewinn (nach Steuer): <strong>${netto.toFixed(2)} €</strong><br>`;
  output += `🏦 Entnommen: ${entnommen.toFixed(2)} €<br><br>`;

  if (differenz > 0) {
    output += `⚠️ Du hast <strong>${differenz.toFixed(2)} €</strong> zu viel entnommen.<br>`;
    output += `💡 Empfehlung: Beim nächsten Gewinn mindestens <strong>${differenz.toFixed(2)} €</strong> zurücklegen.`;
    ausgabe.style.color = "#ffaa00";
  } else {
    output += `✅ Entnahme im Rahmen. Kein Ausgleich nötig.`;
    ausgabe.style.color = "#0f0";
  }

  ausgabe.innerHTML = output;

  // 🔁 Rücklagen-Merkung speichern
  localStorage.setItem("nettoPlanMemory", JSON.stringify({
    brutto, steuer, entnommen, differenz,
    timestamp: new Date().toISOString()
  }));
}


function switchCalcTab(tab) {
  document.querySelectorAll(".calc-box").forEach(box => box.style.display = "none");
  const target = document.getElementById("calc-" + tab);
  if (target) target.style.display = "block";

  document.querySelectorAll(".tab-buttons .btn").forEach(btn => btn.classList.remove("active"));
  const btn = document.getElementById("btn-calc-" + tab);
  if (btn) btn.classList.add("active");
}

window.addEventListener("DOMContentLoaded", () => {
  // Steuerplan NICHT automatisch in Netto übernehmen
  document.getElementById("nettoBrutto").value = "";
  document.getElementById("nettoSteuer").value = "";
  document.getElementById("nettoEntnommen").value = "";
  document.getElementById("nettoAusgabe").innerHTML = "";
});