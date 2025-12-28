/* ============================================================
   📌 WEEKLY PAIR PLAN – FINAL VERSION (MIT EDIT-FUNKTION)
   ============================================================ */

const WEEKLY_PAIR_STORAGE_KEY = "weeklyPairPlan_v1";
let weeklyPairPlan = [];

/* ============================================================
   💾 STORAGE
   ============================================================ */

function saveWeeklyPairPlan() {
  try {
    localStorage.setItem(
      WEEKLY_PAIR_STORAGE_KEY,
      JSON.stringify(weeklyPairPlan)
    );
  } catch (e) {
    console.error("Fehler beim Speichern:", e);
  }
}

function loadWeeklyPairPlan() {
  try {
    const raw = localStorage.getItem(WEEKLY_PAIR_STORAGE_KEY);
    if (!raw) return;

    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) weeklyPairPlan = parsed;
  } catch (e) {
    console.error("Fehler beim Laden:", e);
    weeklyPairPlan = [];
  }
}

/* ============================================================
   🖥️ RENDER – DASHBOARD
   ============================================================ */

function renderWeeklyPairPlan() {
  const container = document.getElementById("weeklyPairPlan");
  if (!container) return;

  container.classList.remove("edit-mode");

  // Fall: Leer
  if (!weeklyPairPlan.length) {
    container.innerHTML = `
      <div class="weekly-pair-header">
        <p class="weekly-pair-empty">Keine Paare geplant</p>
        <button class="weekly-edit-toggle" onclick="openWeeklyPairEditor()">+</button>
      </div>
    `;
    return;
  }

  // Fall: Liste anzeigen (Sortiert Prio 5 -> 1)
  container.innerHTML = `
    <div class="weekly-pair-header">
      <h4>Weekly Pair Plan</h4>
      <button class="weekly-edit-toggle" onclick="openWeeklyPairEditor()">✎</button>
    </div>

    <div class="weekly-pair-list">
      ${[...weeklyPairPlan]
        .sort((a, b) => b.priority - a.priority)
        .map((p) => `
          <div class="weekly-pair-item ${p.bias} prio-${p.priority}">
            <span>${p.symbol}</span>
            <span>${p.bias.toUpperCase()}</span>
            
            <span class="pair-priority"></span>

            ${
              p.confluence
                ? `<div class="pair-confluence ${p.confluence.class}"
                        style="color:${p.confluence.color}">
                     ${p.confluence.score}%
                   </div>`
                : ""
            }
          </div>
        `)
        .join("")}
    </div>
  `;
}

/* ============================================================
   🧩 OPTIONS
   ============================================================ */

function buildWeeklyPairOptions() {
  if (typeof categories === "undefined" || typeof pipValues === "undefined") {
    return `<option value="">Daten fehlen...</option>`;
  }

  return Object.entries(categories)
    .map(
      ([groupName, syms]) => `
      <optgroup label="${groupName}">
        ${syms
          .filter(sym => pipValues[sym] !== undefined)
          .map(sym => `<option value="${sym}">${sym}</option>`)
          .join("")}
      </optgroup>
    `
    )
    .join("");
}

/* ============================================================
   🛠️ EDITOR (Box-Ansicht mit Buttons unten)
   ============================================================ */

function openWeeklyPairEditor() {
  const container = document.getElementById("weeklyPairPlan");
  if (!container) return;

  container.classList.add("edit-mode");

  container.innerHTML = `
    <h4>Plan Bearbeiten</h4>

    <div class="weekly-pair-editor-row">
      <select id="wpSymbol">
        <option value="">Pair...</option>
        ${buildWeeklyPairOptions()}
      </select>

      <select id="wpBias">
        <option value="">Bias</option>
        <option value="long">Long 🟢</option>
        <option value="short">Short 🔴</option>
      </select>

      <select id="wpPriority">
        <option value="">Prio</option>
        <option value="1">1 - Low</option>
        <option value="2">2 - Mid</option>
        <option value="3">3 - High</option>
        <option value="4">4 - Extreme</option>
        <option value="5">5 - MAX 🔥</option>
      </select>

      <button class="add-pair-btn" onclick="addWeeklyPair()">💾</button>
    </div>

    <div class="weekly-pair-list">
      ${weeklyPairPlan
        .map(
          p => `
        <div class="weekly-pair-item ${p.bias} prio-${p.priority}">
          
          <div style="text-align:center; margin-top: -10px;">
             <span style="display:block; margin-bottom:2px;">${p.symbol}</span>
             <span style="font-size:9px; opacity:0.8;">${p.bias.toUpperCase()} (Prio ${p.priority})</span>
          </div>

          <div class="weekly-pair-actions">
            <button onclick="editWeeklyPair('${p.symbol}')" class="edit-action" title="Bearbeiten">
               ✏️
            </button>
            <button onclick="removeWeeklyPairBySymbol('${p.symbol}')" class="delete-action" title="Löschen">
               🗑️
            </button>
          </div>

        </div>
      `
        )
        .join("")}
    </div>

    <div class="weekly-pair-editor-buttons">
        <button class="finish-btn" onclick="renderWeeklyPairPlan()">FERTIG</button>
        <button class="clear-btn" onclick="clearAllWeeklyPairs()">Alles löschen</button>
    </div>
  `;
}

/* ============================================================
   ➕➖ ADD / EDIT / REMOVE LOGIK
   ============================================================ */

function addWeeklyPair() {
  const symbolInput = document.getElementById("wpSymbol");
  const biasInput = document.getElementById("wpBias");
  const prioInput = document.getElementById("wpPriority");

  const symbol = symbolInput.value;
  const bias = biasInput.value;
  const priority = parseInt(prioInput.value, 10);

  if (!symbol || !bias || !priority) {
    alert("Bitte alle Felder ausfüllen!");
    return;
  }

  // Check auf Duplikate
  if (weeklyPairPlan.some(p => p.symbol === symbol)) {
    alert("Pair ist bereits in der Liste! Nutze den ✏️ Stift zum Bearbeiten.");
    return;
  }

  weeklyPairPlan.push({
    symbol,
    bias,
    priority,
    confluence: null
  });

  saveWeeklyPairPlan();
  openWeeklyPairEditor(); // Refresh
}

// ✏️ FUNKTION: Lädt Trade in Inputs und entfernt ihn aus der Liste
function editWeeklyPair(symbol) {
  const pair = weeklyPairPlan.find(p => p.symbol === symbol);
  if (!pair) return;

  // 1. Aus Liste entfernen (damit kein Duplikat entsteht)
  weeklyPairPlan = weeklyPairPlan.filter(p => p.symbol !== symbol);
  saveWeeklyPairPlan();

  // 2. Editor neu laden (Liste aktualisieren)
  openWeeklyPairEditor();

  // 3. Werte in die Input-Felder schreiben
  document.getElementById("wpSymbol").value = pair.symbol;
  document.getElementById("wpBias").value = pair.bias;
  document.getElementById("wpPriority").value = pair.priority;
}

// 🗑️ FUNKTION: Löscht Trade komplett
function removeWeeklyPairBySymbol(symbol) {
  if (!confirm(`${symbol} wirklich löschen?`)) return;

  weeklyPairPlan = weeklyPairPlan.filter(p => p.symbol !== symbol);
  saveWeeklyPairPlan();
  openWeeklyPairEditor();
}

function clearAllWeeklyPairs() {
  if (!confirm("Alles löschen?")) return;
  weeklyPairPlan = [];
  localStorage.removeItem(WEEKLY_PAIR_STORAGE_KEY);
  renderWeeklyPairPlan();
}

/* ============================================================
   🔗 CONFLUENCE BRIDGE
   ============================================================ */
window.assignConfluenceToTrade = function ({ tradeIndex, confluence }) {
  if (tradeIndex == null || !weeklyPairPlan[tradeIndex]) return;
  weeklyPairPlan[tradeIndex].confluence = confluence;
  saveWeeklyPairPlan();
  renderWeeklyPairPlan();
};

/* ============================================================
   🚀 INIT
   ============================================================ */
window.addEventListener("DOMContentLoaded", () => {
  loadWeeklyPairPlan();
  renderWeeklyPairPlan();
});