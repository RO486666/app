

let currentMonthOffset = 0;
function onRuleChanged() {
  updateRuleCount();
  updateSetupScoreDisplay(); // 🔁 Kein Delay mehr
}
function saveJournalEntry() {
  const files = document.getElementById("screenshotInput")?.files || [];
  const manualDate = document.getElementById("journalManualDate")?.value;
  const tradingMode = document.getElementById("tradingMode")?.value || "day";
  const editId = document.getElementById("saveJournalEntryButton").dataset.editId;
  const allEntries = JSON.parse(localStorage.getItem("journalData") || "[]");
  const selectedBiasFrames = Array.from(document.querySelectorAll('#biasTimeframes input:checked'))
    .map(cb => cb.value);

  // ✏️ Wenn Bearbeitung → alten Eintrag holen und überschreiben
  let entry;
  if (editId) {
    const existing = allEntries.find(e => e.id == editId);
    entry = {
      ...existing,
      id: parseInt(editId),
      date: manualDate ? new Date(manualDate).toISOString() : new Date().toISOString(),
      images: existing.images || { before: [], after: [] }  // ⬅️ beibehalten
    };
  } else {
    entry = {
      id: Date.now(),
      date: manualDate ? new Date(manualDate).toISOString() : new Date().toISOString(),
      images: { before: [], after: [] }  // ⬅️ neu
    };
  }

  // 🧠 Immer updaten
  Object.assign(entry, {
    pair: document.getElementById("journalSymbol").value.trim(),
    direction: document.getElementById("journalDirection").value.toLowerCase(),
    entry: parseFloat(document.getElementById("journalEntry").value),
    exit: parseFloat(document.getElementById("journalExit").value),
    lots: parseFloat(document.getElementById("journalLots").value),
    pnl: parseFloat(document.getElementById("journalPnL").value.replace(",", ".")),
    emotionBefore: parseInt(document.getElementById("emotionBefore").value),
    emotionAfter: parseInt(document.getElementById("emotionAfter").value),
    tradingMode,
    biasTimeframes: selectedBiasFrames,
    ruleAOI: document.getElementById("ruleAOI")?.checked || false,
    ruleEntry: document.getElementById("ruleEntry")?.checked || false,
    rulePsych: document.getElementById("rulePsych")?.checked || false,
    ruleSession: document.getElementById("ruleSession")?.checked || false,
    ruleRR: document.getElementById("ruleRR")?.checked || false,
    ruleLTFShift: document.getElementById("ruleLTFShift")?.checked || false,
    ruleEntrySignal: document.getElementById("ruleEntrySignal")?.checked || false,
    notesBefore: document.getElementById("journalNotesBefore")?.value.trim(),
    notesAfter: document.getElementById("journalNotesAfter")?.value.trim()
  });

  // 📸 Bildzuweisung
  if (files.length === 0) {
    finishSave(entry, editId, allEntries);
  } else {
    const targetArray = editId ? entry.images.after : entry.images.before;
    let loaded = 0;
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = function (e) {
        const base64 = e.target.result;
        const imageId = "img_" + Date.now() + "_" + Math.floor(Math.random() * 100000);
        saveImageToIndexedDB(base64, imageId);
        targetArray.push(imageId);
        loaded++;
        if (loaded === files.length) {
          finishSave(entry, editId, allEntries);
        }
      };
      reader.readAsDataURL(file);
    });
  }
}



function finishSave(entry, editId, allEntries) {
  if (editId) {
    const index = allEntries.findIndex(e => e.id == editId);
    if (index !== -1) allEntries[index] = entry;
    delete document.getElementById("saveJournalEntryButton").dataset.editId;
  } else {
    allEntries.push(entry);
  }

  localStorage.setItem("journalData", JSON.stringify(allEntries));
  buildJournalCalendar(currentMonthOffset || 0);
  document.getElementById("calc-journal").style.display = "none";
  alert("✅ Journal-Eintrag gespeichert!");
}







function populateLotOptions() {
  const lotSelect = document.getElementById("journalLots");
  lotSelect.innerHTML = ""; // leeren

  const add = (val) => {
    const opt = document.createElement("option");
    opt.value = val.toFixed(2);
    opt.textContent = val.toFixed(2);
    lotSelect.appendChild(opt);
  };

  // Mikrolots (0.01 – 0.09)
  for (let i = 1; i <= 9; i++) add(i / 100);

  // Mini bis Standardlots (0.10 – 1.00)
  for (let i = 10; i <= 100; i += 5) add(i / 100);

  // Größere Schritte (1.00 – 10.00)
  for (let i = 2; i <= 10; i++) add(i);

  // Noch größere Schritte (15 – 100)
  for (let i = 15; i <= 100; i += 5) add(i);
}

function populateLotSuggestions() {
  const datalist = document.getElementById("lotOptions");
  datalist.innerHTML = "";

  const add = (val) => {
    const opt = document.createElement("option");
    opt.value = val.toFixed(2);
    datalist.appendChild(opt);
  };

  // 0.01 – 0.10 (Scalping)
  for (let i = 1; i <= 10; i++) add(i / 100);

  // 0.10 – 1.00 in 0.10er Schritten
  for (let i = 2; i <= 10; i++) add(i / 10);

  // 1.00 – 10.00 in 1er Schritten
  for (let i = 1; i <= 10; i++) add(i);

  // 15 – 100 in 5er Schritten
  for (let i = 15; i <= 100; i += 5) add(i);
}




function getSetupScore(entry) {
  const tfList = entry.biasTimeframes || [];
  const mode = entry.tradingMode || "day";

  // ❗ Mindestens 2 Bias-TFs erforderlich → kein gültiger Entry
  if (tfList.length < 2) return { score: 0, valid: false };

  let score = 0;

  // ✅ Bias Timeframes (max 30 %)
  score += Math.min(tfList.length, 3) * 10;

  // AOI (10 %)
  if (entry.ruleAOI) score += 10;

  // AOI-Zeitframe korrekt (10 %)
  const isAOICorrect =
    (mode === "swing" && tfList.includes("4H") && tfList.includes("D1")) ||
    (mode === "day" && tfList.includes("1H"));
  if (isAOICorrect) score += 10;

  // Entry Confirmation (10 %)
  if (entry.ruleEntry) score += 10;

  // Psychologische Levels (5 %)
  if (entry.rulePsych) score += 5;

  // Session-Zeitfenster (5 %)
  if (entry.ruleSession) score += 5;

  // CRV erfüllt (5 %)
  if (entry.ruleRR) score += 5;
  
  if (entry.ruleLTFShift) score += 10;
if (entry.ruleEntrySignal) score += 10;

  return {
    score: Math.min(score, 95),
    valid: true
  };
}


function openLightbox(src) {
  const overlay = document.getElementById("lightboxOverlay");
  const img = document.getElementById("lightboxImage");
  img.src = src;
  overlay.style.display = "flex";
}

function closeLightbox() {
  const overlay = document.getElementById("lightboxOverlay");
  const img = document.getElementById("lightboxImage");
  overlay.style.display = "none";
  img.src = "";
}

function updateBiasOptions() {
  const mode = document.getElementById("tradingMode")?.value || "day";
  const allowed = mode === "day" ? ["1H", "4H", "D1"] : ["4H", "D1", "W1"];

  document.querySelectorAll('#biasTimeframes input').forEach(cb => {
    const tf = cb.value;
    const label = cb.closest("label");
    if (allowed.includes(tf)) {
      label.style.display = "inline-flex";
    } else {
      cb.checked = false; // abwählen falls nicht erlaubt
      label.style.display = "none";
    }
  });

  updateSetupScoreDisplay(); // gleich aktualisieren
}


function getLiveSetupScoreFromForm() {
  const tfList = Array.from(document.querySelectorAll('#biasTimeframes input:checked')).map(cb => cb.value);
  const mode = document.getElementById("tradingMode")?.value || "day";

  let score = 0;

  // 📌 Bias-Timeframes (max 3 TFs à 10 %)
  score += Math.min(tfList.length, 3) * 10;

  // 📌 AOI (Area of Interest)
  if (document.getElementById("ruleAOI")?.checked) score += 10;

  // 📌 AOI-Timeframe korrekt (je nach Modus)
  const hasValidAOITF =
    (mode === "swing" && tfList.includes("4H") && tfList.includes("D1")) ||
    (mode === "day" && tfList.includes("1H"));
  if (hasValidAOITF) score += 10;

  // 📌 Weitere Regelpunkte
  if (document.getElementById("ruleEntry")?.checked) score += 10;       // Entry Confirmation
  if (document.getElementById("rulePsych")?.checked) score += 5;        // Psych Level
  if (document.getElementById("ruleSession")?.checked) score += 5;      // Session
  if (document.getElementById("ruleRR")?.checked) score += 5;           // Risk:Reward
  if (document.getElementById("ruleLTFShift")?.checked) score += 10;    // LTF Shift
  if (document.getElementById("ruleEntrySignal")?.checked) score += 10; // Signal

  // 📌 Endscore (A+ bei Day schon ab 85 %)
  const cappedScore = Math.min(score, 95); // Maximal 95 %
  const validBias = tfList.length >= 2;    // mindestens 2 Bias-TFs erforderlich

  return {
    score: cappedScore,
    validBias
  };
}





function updateSetupScoreDisplay() {
  const result = getLiveSetupScoreFromForm();
  const score = result.score;
  const hasBias = result.validBias;

  let verdict = "❌ Nicht gültig (mind. 2 Bias-TFs)";
  let textColor = "#ff4444";

  if (hasBias && score >= 95) {
    verdict = "✅ Perfekt";
    textColor = "#33ff77";
  } else if (hasBias && score >= 80) {
    verdict = "🟢 Sehr stark";
    textColor = "#55ff88";
  } else if (hasBias && score >= 60) {
    verdict = "🟨 Solide";
    textColor = "#ffff66";
  } else if (hasBias && score >= 40) {
    verdict = "🟧 Mittelmäßig";
    textColor = "#ffcc66";
  } else if (hasBias && score >= 20) {
    verdict = "🟥 Schwach";
    textColor = "#ff8888";
  } else if (hasBias) {
    verdict = "🔴 Katastrophal";
    textColor = "#ff4444";
  }

  // 🔁 Farbverlauf für Box
  const wrapper = document.getElementById("setupBoxWrapper");
  if (score >= 95) {
    wrapper.style.background = "linear-gradient(135deg, #0d3c0d, #1f6b1f)";
    wrapper.style.borderColor = "#33aa33";
    wrapper.style.boxShadow = "0 0 8px rgba(50, 255, 100, 0.3)";
  } else if (score >= 80) {
    wrapper.style.background = "linear-gradient(135deg, #2f5e2f, #4cc94c)";
    wrapper.style.borderColor = "#55dd55";
    wrapper.style.boxShadow = "0 0 8px rgba(100, 255, 100, 0.25)";
  } else if (score >= 60) {
    wrapper.style.background = "linear-gradient(135deg, #706f1a, #a8d94c)";
    wrapper.style.borderColor = "#cccc55";
    wrapper.style.boxShadow = "0 0 8px rgba(220, 255, 100, 0.2)";
  } else if (score >= 40) {
    wrapper.style.background = "linear-gradient(135deg, #8f631a, #d9b24c)";
    wrapper.style.borderColor = "#ddaa55";
    wrapper.style.boxShadow = "0 0 8px rgba(255, 220, 100, 0.2)";
  } else if (score >= 20) {
    wrapper.style.background = "linear-gradient(135deg, #8f2f2f, #d94c4c)";
    wrapper.style.borderColor = "#cc5555";
    wrapper.style.boxShadow = "0 0 8px rgba(255, 100, 100, 0.2)";
  } else {
    wrapper.style.background = "linear-gradient(135deg, #3d1e1e, #6b2f2f)";
    wrapper.style.borderColor = "#aa3333";
    wrapper.style.boxShadow = "0 0 8px rgba(255, 50, 50, 0.25)";
  }

  let letterGrade = "F"; // Default

if (score >= 95) letterGrade = "A+";
else if (score >= 80) letterGrade = "A";
else if (score >= 60) letterGrade = "B";
else if (score >= 40) letterGrade = "C";
else if (score >= 20) letterGrade = "D";

// Ergebnis anzeigen mit Schatten
document.getElementById("setupScoreDisplay").innerHTML = `
  📊 Setup-Score: <strong style="color:${textColor}; text-shadow: 0 0 2px black, 1px 1px 1px black;">
    ${score}% (${letterGrade})
  </strong> – <span style="text-shadow: 0 0 2px black, 1px 1px 1px black;">${verdict}</span>
`;

}



updateSetupScoreDisplay();

function renderStars(value) {
  const v = Math.max(1, Math.min(10, parseInt(value) || 0));
  return "⭐".repeat(v) + "☆".repeat(10 - v) + ` (${v}/10)`;
}

function setupStarRating(containerId, inputId) {
  const container = document.getElementById(containerId);
  const input = document.getElementById(inputId);

  for (let i = 10; i >= 1; i--) {
    const star = document.createElement("span");
    star.innerHTML = "★";
    star.dataset.value = i;
    star.onclick = () => {
      input.value = i;
      updateStarVisuals(containerId, i);
    };
    container.appendChild(star);
  }

  updateStarVisuals(containerId, parseInt(input.value));
}

function updateStarVisuals(containerId, value) {
  const container = document.getElementById(containerId);
  const stars = container.querySelectorAll("span");
  stars.forEach(s => {
    s.classList.toggle("selected", parseInt(s.dataset.value) <= value);
  });

  // Textanzeige je nach Bewertung
  const labelMap = {
    1: "😵 Totale Unsicherheit / komplett unklar",
    2: "😣 Sehr unsicher – kein Vertrauen in Setup",
    3: "😕 Zweifelnd – nicht wirklich ready",
    4: "😐 Neutral – etwas unklar, leichte Unruhe",
    5: "🙂 Leicht fokussiert – Setup okay",
    6: "😌 Zunehmend sicher – aber noch vorsichtig",
    7: "😎 Gute Kontrolle – vertraue dem Plan",
    8: "🔥 Scharfer Fokus – Setup passt perfekt",
    9: "💪 Volles Vertrauen – komplett im Flow",
    10: "🧠 100 % Fokus – State of Zen / Maschinenmodus"
  };

  // Bestehendes Text-Element finden oder neu anlegen
  let description = container.querySelector(".star-description");
  if (!description) {
    description = document.createElement("div");
    description.className = "star-description";
    description.style.marginTop = "4px";
    description.style.color = "#ccc";
    description.style.fontSize = "13px";
    container.appendChild(description);
  }

  description.textContent = labelMap[value] || "";
}


const knownSymbols = [
  // 🔹 Forex
  "EUR/USD", "GBP/USD", "USD/JPY", "USD/CHF", "AUD/USD", "NZD/USD", "USD/CAD",
  "EUR/JPY", "GBP/JPY", "CHF/JPY", "AUD/JPY", "CAD/JPY", "EUR/GBP", "EUR/CHF",
  "GBP/CHF", "AUD/NZD", "EUR/AUD", "EUR/CAD", "GBP/CAD", "GBP/NZD", "NZD/JPY", "NZD/CAD",

  // 🔹 Krypto (CFDs)
  "BTC/USD", "ETH/USD", "SOL/USD", "XRP/USD", "LTC/USD", "ADA/USD", "BCH/USD",

  // 🔹 Metalle (Spot & Futures CFDs)
  "XAU/USD", // Gold
  "XAG/USD", // Silber
  "XPT/USD", // Platin
  "XPD/USD", // Palladium
  "COPPER/USD", // Kupfer
  "ALUMINIUM/USD",
  "LEAD/USD",
  "ZINC/USD",

  // 🔹 Energie/Rohstoffe
  "WTI/USD",       // WTI Crude Oil
  "BRENT/USD",     // Brent Crude Oil
  "NATGAS/USD",    // Natural Gas
  "SOYBEAN/USD",   // Sojabohnen
  "SUGAR/USD",     // Zucker

  // 🔹 Indizes (zur Orientierung – obwohl du nur 1–4 wolltest)
  "US30", "NAS100", "SPX500", "GER40", "UK100"
];


function suggestSymbol() {
  const input = document.getElementById("journalSymbol");
  const suggestionsBox = document.getElementById("symbolSuggestions");
  const query = input.value.toUpperCase().trim();

  if (!query || query.length < 1) {
    suggestionsBox.style.display = "none";
    suggestionsBox.innerHTML = "";
    return;
  }

  const matches = knownSymbols.filter(sym => sym.includes(query));
  suggestionsBox.innerHTML = matches.map(sym => `
    <div style="padding:4px; cursor:pointer;" onclick="selectSymbol('${sym}')">${sym}</div>
  `).join("");
  suggestionsBox.style.display = matches.length ? "block" : "none";
}

function selectSymbol(symbol) {
  document.getElementById("journalSymbol").value = symbol;
  document.getElementById("symbolSuggestions").style.display = "none";
  document.getElementById("symbolSuggestions").innerHTML = "";
}

function getPnLStatsByDay(entries) {
  const daily = {};
  entries.forEach(entry => {
    const date = new Date(entry.date).toISOString().split("T")[0];
    daily[date] = (daily[date] || 0) + (parseFloat(entry.pnl) || 0);
  });
  return daily;
}

function buildJournalCalendar(monthOffset = 0) {
  const now = new Date();
  const currentMonth = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1);
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  currentMonthOffset = monthOffset;

  const titleEl = document.getElementById("calendarTitle");
  if (titleEl) {
    titleEl.textContent = `📅 ${currentMonth.toLocaleString("de-DE", { month: "long" })} ${year}`;
  }

  const entries = JSON.parse(localStorage.getItem("journalData") || "[]");
  const dailyStats = getPnLStatsByDay(entries);
  const days = {};
  entries.forEach(e => {
    const d = new Date(e.date).toISOString().split("T")[0];
    days[d] = (days[d] || 0) + parseFloat(e.pnl || 0);
  });

  const greenDays = Object.values(days).filter(pnl => pnl > 0).length;
  const redDays = Object.values(days).filter(pnl => pnl < 0).length;
  const totalDays = greenDays + redDays;
  const greenRate = totalDays ? (greenDays / totalDays * 100).toFixed(1) : null;

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const manualDateInput = document.getElementById("journalManualDate");

  let activeCalendarCell = null;
  const calendar = document.createElement("div");
  calendar.style.display = "grid";
  calendar.style.gridTemplateColumns = "repeat(7, 1fr)";

  calendar.style.gap = "5px";

  ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"].forEach(day => {
    const d = document.createElement("div");
    d.textContent = day;
    d.style.textAlign = "center";
    d.style.color = "#0ff";
    calendar.appendChild(d);
  });

  for (let i = 0; i < firstDay; i++) {
    calendar.appendChild(document.createElement("div"));
  }

for (let day = 1; day <= daysInMonth; day++) {
  const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  const pnl = dailyStats[dateStr] || 0;

  const cell = document.createElement("div");
  cell.textContent = day;
  cell.style.padding = "10px";
  cell.style.borderRadius = "6px";
  cell.style.textAlign = "center";
  cell.style.cursor = "pointer";
  cell.style.transition = "outline 0.2s ease";

  const tradesOnDay = entries.filter(e => e.date.startsWith(dateStr));

  const withPnL = tradesOnDay.filter(e =>
    e.pnl !== undefined && e.pnl !== null && e.pnl !== "" && !isNaN(parseFloat(e.pnl))
  );
  const openTrades = tradesOnDay.length - withPnL.length;

  const pnls = withPnL.map(e => parseFloat(e.pnl));
  const hasGain = pnls.some(v => v > 0);
  const hasLoss = pnls.some(v => v < 0);

  // 🎨 Farbentscheidung:
  if (openTrades > 0 && hasGain && hasLoss) {
    cell.style.background = "linear-gradient(135deg, #FFA500 33%, #228B22 33%, #228B22 66%, #B22222 66%)"; // Orange + Grün + Rot
  } else if (openTrades > 0 && hasGain) {
    cell.style.background = "linear-gradient(135deg, #FFA500 50%, #228B22 50%)"; // Orange + Grün
  } else if (openTrades > 0 && hasLoss) {
    cell.style.background = "linear-gradient(135deg, #FFA500 50%, #B22222 50%)"; // Orange + Rot
  } else if (openTrades > 0) {
    cell.style.background = "#FFA500"; // Nur offen
  } else if (hasGain && hasLoss) {
    cell.style.background = "linear-gradient(135deg, #228B22 50%, #B22222 50%)"; // Grün + Rot
  } else {
    const sum = pnls.reduce((a, b) => a + b, 0);
    cell.style.background = sum > 0 ? "#228B22" : (sum < 0 ? "#B22222" : "#777"); // Grün / Rot / Neutral
  }

  cell.style.color = "white";

  cell.onclick = () => {
    showEntriesForDate(dateStr);
    if (activeCalendarCell) activeCalendarCell.style.outline = "";
    cell.style.outline = "2px solid #3399ff";
    activeCalendarCell = cell;
    if (manualDateInput) manualDateInput.value = dateStr;

    const journalBox = document.getElementById("calc-journal");
    if (journalBox) {
      journalBox.style.display = "block";
      window.scrollTo({ top: journalBox.offsetTop - 40, behavior: "smooth" });
    }
  };

  calendar.appendChild(cell);
}



  document.getElementById("calendarContainer").innerHTML = "";
  document.getElementById("calendarContainer").appendChild(calendar);

  const currentMonthKey = `${year}-${String(month + 1).padStart(2, "0")}`;
  const monthlyEntries = entries
    .filter(e => e.date.startsWith(currentMonthKey))
    .sort((a, b) => new Date(a.date) - new Date(b.date));
let validSetups = 0;
let shakySetups = 0;
let failedSetups = 0;

monthlyEntries.forEach(e => {
  const result = getSetupScore(e);
  const score = result?.score ?? 0;
  const valid = result?.valid ?? false;

  if (!valid) {
    failedSetups++;
  } else if (score >= 40) {
    validSetups++;
  } else if (score >= 20) {
    shakySetups++;
  } else {
    failedSetups++;
  }
});



  // 📈 Equity-Kurve
  let equity = 0;
  let peak = 0;
  let maxDrawdown = 0;
  const equityData = [0];
  const labels = ['Start'];

  monthlyEntries.forEach((e, i) => {
    equity += parseFloat(e.pnl || 0);
    equityData.push(equity);
    labels.push(`#${i + 1}`);
    if (equity > peak) peak = equity;
    const dd = ((peak - equity) / peak) * 100;
    if (dd > maxDrawdown) maxDrawdown = dd;
  });

  const ctx = document.getElementById("calendarEquityChart").getContext("2d");
  if (window.calendarEquityChartInstance) window.calendarEquityChartInstance.destroy();
  window.calendarEquityChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Equity-Kurve',
        data: equityData,
        borderWidth: 2,
        borderColor: '#00ff99',
        backgroundColor: 'rgba(0,255,153,0.1)',
        fill: true,
        tension: 0.3,
        pointRadius: 0
      }]
    },
    options: {
      responsive: true,
      scales: {
        x: { title: { display: true, text: 'Trades im Monat' } },
        y: { title: { display: true, text: 'Kumulierte Performance (€)' } }
      },
      plugins: { legend: { display: false } }
    }
  });

  // 📊 Statistik
  const pnlPerDay = Object.values(days);
  const winTrades = monthlyEntries.filter(e => parseFloat(e.pnl) > 0);
  const lossTrades = monthlyEntries.filter(e => parseFloat(e.pnl) < 0);
  const totalWin = winTrades.reduce((sum, t) => sum + parseFloat(t.pnl || 0), 0);
  const totalLoss = lossTrades.reduce((sum, t) => sum + parseFloat(t.pnl || 0), 0);
  const avgPerDay = pnlPerDay.length ? pnlPerDay.reduce((a, b) => a + b, 0) / pnlPerDay.length : 0;
  const bestDay = pnlPerDay.length ? Math.max(...pnlPerDay) : null;
  const worstDay = pnlPerDay.length ? Math.min(...pnlPerDay) : null;
  const profitFactor = totalLoss !== 0 ? Math.abs(totalWin / totalLoss).toFixed(2) : "∞";
  const winRate = monthlyEntries.length > 0 ? (winTrades.length / monthlyEntries.length * 100).toFixed(1) : "–";

// 🔍 Klassifikationstage vorbereiten
const rulesByDay = {}; // { "2025-07-23": [true, false, true] }

monthlyEntries.forEach(e => {
  const day = new Date(e.date).toISOString().split("T")[0];
  if (!rulesByDay[day]) rulesByDay[day] = [];
  rulesByDay[day].push([
    e.ruleBias ?? false,
    e.ruleSession ?? false,
    e.ruleSetupValid ?? false
  ]);
});

// Tagesklassifikation
let perfectDays = 0;
let shakyDays = 0;
let failDays = 0;

for (const ruleSets of Object.values(rulesByDay)) {
  let merged = [false, false, false];
  ruleSets.forEach(rules => {
    for (let i = 0; i < 3; i++) {
      merged[i] = merged[i] || rules[i]; // irgendeine Regel erfüllt zählt
    }
  });
  const count = merged.filter(x => x).length;
  if (count === 3) perfectDays++;
  else if (count >= 1) shakyDays++;
  else failDays++;
}


document.getElementById("calendarStats").innerHTML = `
  <div id="monthlyOverview" style="margin-bottom:15px;">
    📅 Monat ${currentMonthKey} – <strong style="color:${equity >= 0 ? '#0f0' : '#f44'}">${equity.toFixed(2)} €</strong><br>
    💚 Bester Tag: <strong>${bestDay !== null ? bestDay.toFixed(2) : "–"} €</strong><br>
    💔 Schlechtester Tag: <strong>${worstDay !== null ? worstDay.toFixed(2) : "–"} €</strong><br>
    📉 Max Drawdown: <strong>${maxDrawdown.toFixed(2)}%</strong><br>
    📈 Trades: <strong>${monthlyEntries.length}</strong><br>
    🧾 Gewinn-Trades: <strong>${winTrades.length}</strong> / Verlust-Trades: <strong>${lossTrades.length}</strong><br>
    🧮 Ø/Tag: <strong>${avgPerDay.toFixed(2)} €</strong><br>
    ⚖️ Profitfaktor: <strong>${profitFactor}</strong><br>
    🎯 Trefferquote: <strong>${winRate}%</strong><br><br>


    🧠 <strong>Setup-Auswertung:</strong><br>
    ✅ Valide Setups: <strong>${validSetups}</strong><br>
    ⚠️ Wacklige Setups: <strong>${shakySetups}</strong><br>
    ❌ Regelbruch-Setups: <strong>${failedSetups}</strong>
  </div>
`;

}

function changeMonth(offset) {
  currentMonthOffset += offset;
  buildJournalCalendar(currentMonthOffset);
}

function editEntry(entryId) {
  const all = JSON.parse(localStorage.getItem("journalData") || "[]");
  const entry = all.find(e => e.id === entryId);
  if (!entry) return alert("❌ Eintrag nicht gefunden.");

  // 🧠 Werte ins Formular laden
  document.getElementById("journalManualDate").value = entry.date.split("T")[0];
  document.getElementById("journalSymbol").value = entry.pair;
  document.getElementById("journalDirection").value = entry.direction?.toLowerCase();
  document.getElementById("journalEntry").value = entry.entry;
  document.getElementById("journalExit").value = entry.exit;
  document.getElementById("journalLots").value = entry.lots;
  document.getElementById("journalPnL").value = entry.pnl;
  document.getElementById("emotionBefore").value = entry.emotionBefore;
  document.getElementById("emotionAfter").value = entry.emotionAfter;

  // ⭐ Update Sternanzeige richtig anzeigen
  updateStarVisuals("starsBefore", parseInt(entry.emotionBefore));
  updateStarVisuals("starsAfter", parseInt(entry.emotionAfter));

  // 📋 Regeln (Checkliste) setzen
  ["AOI", "Entry", "Psych", "Session", "RR", "LTFShift", "EntrySignal"].forEach(id => {
    const el = document.getElementById("rule" + id);
    if (el) el.checked = !!entry["rule" + id];
  });

  // Bias-TFs
  document.querySelectorAll('#biasTimeframes input').forEach(cb => {
    cb.checked = entry.biasTimeframes?.includes(cb.value) || false;
  });

  // Trading Mode
  document.getElementById("tradingMode").value = entry.tradingMode || "day";
  updateBiasOptions();

  // Setup-Score berechnen
  updateSetupScoreDisplay();

  // 🧠 Signal zum Überschreiben statt neu anlegen
  document.getElementById("saveJournalEntryButton").dataset.editId = entryId;

  // 🖊️ Formular anzeigen & hervorheben
  const formEl = document.getElementById("calc-journal");
  formEl.style.display = "block";

  // 🔽 Smooth scroll zum Formular mit Abstand (für Sticky Header etc.)
  const topOffset = formEl.getBoundingClientRect().top + window.scrollY - 60;
  window.scrollTo({ top: topOffset, behavior: "smooth" });

  // ✨ Visuelles Highlight für Feedback
  formEl.style.transition = "box-shadow 0.3s ease";
  formEl.style.boxShadow = "0 0 12px 4px #0077cc";
  setTimeout(() => {
    formEl.style.boxShadow = "none";
  }, 1000);
}


function showEntriesForDate(dateStr) {
  const entries = JSON.parse(localStorage.getItem("journalData") || "[]");
  const filtered = entries.filter(e => e.date.startsWith(dateStr));
  const list = document.getElementById("journalEntryList");
  list.innerHTML = `<h4>📅 ${dateStr} – ${filtered.length} Eintrag(e)</h4>`;

  if (filtered.length === 0) {
    list.innerHTML += "<p>❌ Keine Einträge gefunden.</p>";
    return;
  }

  filtered.forEach(entry => {
    const result = getSetupScore(entry);
    const score = result.score;
    const valid = result.valid;

    let verdict = "❌ Regelbruch";
    if (!valid) verdict = "❌ Nicht gültig (Bias fehlt)";
    else if (score >= 95) verdict = "✅ Perfekt";
    else if (score >= 80) verdict = "🟢 Sehr stark";
    else if (score >= 60) verdict = "🟨 Solide";
    else if (score >= 40) verdict = "🟧 Mittelmäßig";
    else if (score >= 20) verdict = "🟥 Schwach";

    const biasStr = entry.biasTimeframes?.join(" + ") || "–";
    const modeStr = entry.tradingMode || "–";

    const colorBox = entry.direction === "Long"
      ? "linear-gradient(135deg, #1e3d1e, #2f6b2f)"
      : "linear-gradient(135deg, #4a1e1e, #8b2f2f)";

    let pnlDisplay = "⏳ Offen";
    let pnlSummaryColor = "#aa5500";
    if (typeof entry.pnl === "number" && !isNaN(entry.pnl)) {
      pnlDisplay = `${entry.pnl} €`;
      pnlSummaryColor = entry.pnl > 0 ? "#1e5721" : entry.pnl < 0 ? "#8b2f2f" : "#666666";
    }

// 🔽 Bilder laden (getrennt nach Vorher/Nachher)
let imageHTML = "";

// Neue Struktur mit "before"/"after"
if (entry.images?.before?.length > 0 || entry.images?.after?.length > 0) {
  if (entry.images.before?.length > 0) {
    const beforeId = "img_before_" + entry.id;
    imageHTML += `
      <div style="margin-top: 10px;">
        <strong>📸 Vor dem Trade:</strong>
        <div id="${beforeId}" style="display: flex; flex-wrap: wrap; gap: 10px; margin-top: 5px;"></div>
      </div>
    `;
    setTimeout(() => {
      const el = document.getElementById(beforeId);
      if (el) {
        entry.images.before.forEach(id => {
          const box = document.createElement("div");
          box.textContent = "⏳";
          el.appendChild(box);
          loadImageFromIndexedDB(id, base64 => {
            box.innerHTML = `<img src="${base64}" style="max-width: 120px; border-radius: 6px; cursor: pointer;" onclick="showLightbox('${base64}')" />`;
          });
        });
      }
    }, 0);
  }

  if (entry.images.after?.length > 0) {
    const afterId = "img_after_" + entry.id;
    imageHTML += `
      <div style="margin-top: 10px;">
        <strong>📸 Nach dem Trade:</strong>
        <div id="${afterId}" style="display: flex; flex-wrap: wrap; gap: 10px; margin-top: 5px;"></div>
      </div>
    `;
    setTimeout(() => {
      const el = document.getElementById(afterId);
      if (el) {
        entry.images.after.forEach(id => {
          const box = document.createElement("div");
          box.textContent = "⏳";
          el.appendChild(box);
          loadImageFromIndexedDB(id, base64 => {
            box.innerHTML = `<img src="${base64}" style="max-width: 120px; border-radius: 6px; cursor: pointer;" onclick="showLightbox('${base64}')" />`;
          });
        });
      }
    }, 0);
  }
}

// 🔙 Fallback für alte Struktur (wenn entry.imageIds noch genutzt wird)
if (!entry.images && entry.imageIds?.length > 0) {
  const fallbackId = "img_fallback_" + entry.id;
  imageHTML += `
    <div style="margin-top: 10px;">
      <strong>📸 Bilder:</strong>
      <div id="${fallbackId}" style="display: flex; flex-wrap: wrap; gap: 10px; margin-top: 5px;"></div>
    </div>
  `;
  setTimeout(() => {
    const el = document.getElementById(fallbackId);
    if (el) {
      entry.imageIds.forEach(id => {
        const box = document.createElement("div");
        box.textContent = "⏳";
        el.appendChild(box);
        loadImageFromIndexedDB(id, base64 => {
          box.innerHTML = `<img src="${base64}" style="max-width: 120px; border-radius: 6px; cursor: pointer;" onclick="showLightbox('${base64}')" />`;
        });
      });
    }
  }, 0);
}






    list.innerHTML += `
      <details class="trade-box" style="margin-top: 10px; border-radius: 8px; overflow: hidden; background: ${colorBox};">
        <summary style="background: ${pnlSummaryColor}; color:#fff; padding: 8px 12px; font-weight: bold; cursor: pointer;">
          ${entry.pair} (${entry.direction}) – 💰 ${pnlDisplay}
        </summary>
        <div class="trade-details" style="background:#1a1a1a; color:#eee; padding: 12px;">
          ${renderStars(entry.emotionBefore)} Fokus<br>
          ${renderStars(entry.emotionAfter)} Nach dem Trade<br>
          🧭 Modus: <strong>${modeStr}</strong><br>
          📐 Bias-TFs: <strong>${biasStr}</strong><br>
          📊 Setup Score: <strong>${score}%</strong> – ${verdict}<br><br>

          <strong>📝 Kommentar vor dem Trade:</strong><br>
          ${entry.notesBefore || "–"}<br><br>

          <strong>📝 Kommentar nach dem Trade:</strong><br>
          ${entry.notesAfter || "–"}<br><br>

          ${imageHTML}

          <div style="display:flex; gap:10px; margin-top: 10px;">
            <button onclick="editEntry(${entry.id})"
              style="background:#0077cc; color:white; border:none; padding:4px 8px; border-radius:4px; cursor:pointer;">
              ✏️ Bearbeiten
            </button>
            <button onclick="deleteEntry(${entry.id})"
              style="background:#cc3333; color:white; border:none; padding:4px 8px; border-radius:4px; cursor:pointer;">
              🗑️ Löschen
            </button>
          </div>
        </div>
      </details>
    `;
  });
}

function loadImageFromIndexedDB(id, callback) {
  const request = indexedDB.open("TradeAppDB", 1);
  request.onsuccess = function(event) {
    const db = event.target.result;
    const tx = db.transaction("images", "readonly");
    const store = tx.objectStore("images");
    const getReq = store.get(id);
    getReq.onsuccess = () => {
      if (getReq.result) callback(getReq.result.image);
    };
  };
}

function showLightbox(src) {
  const overlay = document.getElementById("lightboxOverlay");
  const image = document.getElementById("lightboxImage");
  image.src = src;
  overlay.style.display = "flex";
}

function closeLightbox() {
  document.getElementById("lightboxOverlay").style.display = "none";
}


function deleteEntry(entryId) {
  if (!confirm("❌ Diesen Eintrag wirklich löschen?")) return;

  const all = JSON.parse(localStorage.getItem("journalData") || "[]");
  const updated = all.filter(e => e.id !== entryId);

  localStorage.setItem("journalData", JSON.stringify(updated));
  buildJournalCalendar(currentMonthOffset);
  document.getElementById("journalEntryList").innerHTML = "";
  alert("🗑️ Eintrag gelöscht.");
}



function resetCurrentMonth() {
  const entries = JSON.parse(localStorage.getItem("journalData") || "[]");
  const now = new Date();
  const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const filtered = entries.filter(e => !e.date.startsWith(monthKey));

  localStorage.setItem("journalData", JSON.stringify(filtered));
  buildJournalCalendar(currentMonthOffset);
  document.getElementById("journalEntryList").innerHTML = "";
  alert(`✅ Alle Einträge für ${monthKey} wurden gelöscht.`);
}

function resetSelectedDay() {
  const selectedDate = document.getElementById("journalManualDate")?.value;
  if (!selectedDate) {
    alert("⚠️ Kein Tag ausgewählt.");
    return;
  }

  const entries = JSON.parse(localStorage.getItem("journalData") || "[]");
  const filtered = entries.filter(e => !e.date.startsWith(selectedDate));

  localStorage.setItem("journalData", JSON.stringify(filtered));
  buildJournalCalendar(currentMonthOffset);
  document.getElementById("journalEntryList").innerHTML = "";
  alert(`📅 Alle Einträge für ${selectedDate} wurden gelöscht.`);
}

function resetAllJournal() {
  if (confirm("⚠️ Bist du sicher, dass du ALLES löschen willst?")) {
    localStorage.removeItem("journalData");
    localStorage.removeItem("manualNotes");

    buildJournalCalendar(currentMonthOffset);
    document.getElementById("journalEntryList").innerHTML = "";
    document.getElementById("calc-journal").style.display = "none";

    alert("🗑️ Journal vollständig gelöscht.");
  }
}

window.addEventListener("DOMContentLoaded", () => {
  buildJournalCalendar();
  setupStarRating("starsBefore", "emotionBefore");
  setupStarRating("starsAfter", "emotionAfter");
  populateLotOptions();
  populateLotSuggestions();

  // Initial Setup-Score anzeigen, falls Bias ausgewählt ist
  if (document.querySelector('#biasTimeframes input:checked')) {
    updateSetupScoreDisplay();
  }
});

//jornal

document.getElementById("journalEntry").addEventListener("input", autoCalculateExit);
document.getElementById("journalDirection").addEventListener("change", autoCalculateExit);

function autoCalculateExit() {
  const entryInput = document.getElementById("journalEntry");
  const exitInput = document.getElementById("journalExit");
  const direction = document.getElementById("journalDirection")?.value?.toLowerCase() || "long";

  let entry = parseFloat(entryInput.value.replace(",", "."));
  if (isNaN(entry)) return;

  const decimals = (entry.toString().split(".")[1] || "").length;
  const step = Math.pow(10, -decimals || 1); // fallback auf 0.1

  const exit = direction === "short"
    ? entry - step
    : entry + step;

  exitInput.value = exit.toFixed(decimals);
}

function saveJournalEntryWithImages(imageIds) {
  const entries = JSON.parse(localStorage.getItem("journalData") || []);

  const newEntry = {
    id: Date.now(),
    date: new Date().toISOString().slice(0, 10),
    comment: document.getElementById("journalComment")?.value || "",
    result: document.getElementById("resultSelect")?.value || "neutral",
    images: {
      before: imageIds,
      after: [] // vorerst leer
    }
  };

  entries.push(newEntry);
  localStorage.setItem("journalData", JSON.stringify(entries));
  alert("✅ Journal gespeichert mit Bildern!");
  buildJournalCalendar(); // ⬅️ Kalender aktualisieren
}


document.getElementById("screenshotInput").addEventListener("change", function (event) {
  const previewBox = document.getElementById("imagePreviewBox");
  if (!previewBox) return;

  previewBox.innerHTML = ""; // leeren
  Array.from(event.target.files).forEach(file => {
    const reader = new FileReader();
    reader.onload = function (e) {
      const img = document.createElement("img");
      img.src = e.target.result;
      img.style.maxWidth = "100px";
      img.style.margin = "5px";
      img.style.borderRadius = "6px";
      previewBox.appendChild(img);
    };
    reader.readAsDataURL(file);
  });
});


function showLightbox(src) {
  const overlay = document.getElementById("lightboxOverlay");
  const image = document.getElementById("lightboxImage");
  image.src = src;
  overlay.style.display = "flex";
}

function closeLightbox() {
  document.getElementById("lightboxOverlay").style.display = "none";
}
function saveImageToIndexedDB(base64, id) {
  const request = indexedDB.open("TradeAppDB", 1);
  request.onupgradeneeded = function(event) {
    const db = event.target.result;
    if (!db.objectStoreNames.contains("images")) {
      db.createObjectStore("images", { keyPath: "id" });
    }
  };
  request.onsuccess = function(event) {
    const db = event.target.result;
    const tx = db.transaction("images", "readwrite");
    const store = tx.objectStore("images");
    store.put({ id, image: base64 });
  };
}
