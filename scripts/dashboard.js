/* ============================================================
   📌 WEEKLY PAIR PLAN – STATE & STORAGE
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
    console.error("WeeklyPairPlan konnte nicht gespeichert werden", e);
  }
}

function loadWeeklyPairPlan() {
  try {
    const raw = localStorage.getItem(WEEKLY_PAIR_STORAGE_KEY);
    if (!raw) return;

    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) weeklyPairPlan = parsed;
  } catch (e) {
    console.error("WeeklyPairPlan konnte nicht geladen werden", e);
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

  if (!weeklyPairPlan.length) {
    container.innerHTML = `
      <div class="weekly-pair-header">
        <p class="weekly-pair-empty">Keine Paare für diese Woche geplant</p>
        <button class="weekly-edit-toggle"
                onclick="openWeeklyPairEditor()"
                aria-label="Add Trade"></button>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="weekly-pair-header">
      <h4>Weekly Pair Plan</h4>
      <button class="weekly-edit-toggle"
              onclick="openWeeklyPairEditor()"
              aria-label="Add Trade"></button>
    </div>

    <div class="weekly-pair-list">
      ${[...weeklyPairPlan]
        .sort((a, b) => b.priority - a.priority)
        .map((p, i) => `
  <div class="weekly-pair-item ${p.bias} prio-${p.priority}">
    <span>${p.symbol}</span>
    <span>${p.bias.toUpperCase()}</span>

    <!-- 🔥 PRIORITY INDICATOR -->
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
    console.warn("pairsData.js fehlt");
    return "";
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
   🛠️ EDITOR
   ============================================================ */

function openWeeklyPairEditor() {
  const container = document.getElementById("weeklyPairPlan");
  if (!container) return;

  container.classList.add("edit-mode");

  container.innerHTML = `
    <h4>Weekly Pair Setup</h4>

    <div class="weekly-pair-editor-row">
      <select id="wpSymbol">
        <option value="">Pair wählen…</option>
        ${buildWeeklyPairOptions()}
      </select>

      <select id="wpBias">
        <option value="">Bias</option>
        <option value="long">Long</option>
        <option value="short">Short</option>
      </select>

      <select id="wpPriority">
        <option value="">Prio</option>
        <option value="1">Low</option>
        <option value="2">Mid</option>
        <option value="3">High</option>
      </select>

      <button class="add-pair-btn" onclick="addWeeklyPair()">+</button>
    </div>

    <div class="weekly-pair-list">
      ${weeklyPairPlan
        .map(
          p => `
        <div class="weekly-pair-item ${p.bias} prio-${p.priority}"
             onclick="removeWeeklyPairBySymbol('${p.symbol}')">
          <span>${p.symbol}</span>
          <span>${p.bias.toUpperCase()}</span>
        </div>
      `
        )
        .join("")}
    </div>

    <button class="finish-btn" onclick="renderWeeklyPairPlan()">DONE</button>
  `;
}

/* ============================================================
   ➕➖ ADD / REMOVE
   ============================================================ */

function addWeeklyPair() {
  const symbol = document.getElementById("wpSymbol").value;
  const bias = document.getElementById("wpBias").value;
  const priority = parseInt(
    document.getElementById("wpPriority").value,
    10
  );

  if (!symbol || !bias || !priority) return;
  if (weeklyPairPlan.some(p => p.symbol === symbol)) return;

  weeklyPairPlan.push({
    symbol,
    bias,
    priority,
    confluence: null // ⬅️ WICHTIG
  });

  saveWeeklyPairPlan();
  openWeeklyPairEditor();
}

function removeWeeklyPairBySymbol(symbol) {
  if (!confirm(`Pair ${symbol} wirklich löschen?`)) return;

  weeklyPairPlan = weeklyPairPlan.filter(p => p.symbol !== symbol);
  saveWeeklyPairPlan();
  renderWeeklyPairPlan();
}

/* ============================================================
   🧹 CLEAR ALL TRADES
   ============================================================ */

function clearAllWeeklyPairs() {
  if (!weeklyPairPlan.length) return;

  const ok = confirm(
    "Alle Trades wirklich löschen?\n\nDieser Schritt kann nicht rückgängig gemacht werden."
  );
  if (!ok) return;

  weeklyPairPlan = [];
  localStorage.removeItem(WEEKLY_PAIR_STORAGE_KEY);

  renderWeeklyPairPlan();
}


/* ============================================================
   🔗 CONFLUENCE BRIDGE (Checklist → Dashboard)
   ============================================================ */
window.assignConfluenceToTrade = function ({ tradeIndex, confluence }) {
  if (tradeIndex == null) return;
  if (!weeklyPairPlan[tradeIndex]) return;

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
