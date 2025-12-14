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
    localStorage.setItem(WEEKLY_PAIR_STORAGE_KEY, JSON.stringify(weeklyPairPlan));
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

  if (!weeklyPairPlan.length) {
    container.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <p style="opacity:.6">📭 Keine Paare für diese Woche geplant.</p>
        <button onclick="openWeeklyPairEditor()">✏️</button>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;">
      <h4 style="margin-bottom:10px;">📌 Weekly Pair Plan</h4>
      <button onclick="openWeeklyPairEditor()">✏️</button>
    </div>

    ${[...weeklyPairPlan]
      .sort((a, b) => b.priority - a.priority)
      .map(p => `
        <div class="weekly-pair-item ${p.bias} prio-${p.priority}">
          <span>${p.symbol}</span>
          <span>${p.bias.toUpperCase()}</span>
          <span>${"🔥".repeat(p.priority)}</span>
        </div>
      `)
      .join("")}
  `;
}

/* ============================================================
   🧩 OPTIONS (Dropdown wie im Rechner – via pairsData.js categories)
   Voraussetzung: categories + pipValues existieren global (aus pairsData.js)
   ============================================================ */

function buildWeeklyPairOptions() {
  if (typeof categories === "undefined" || typeof pipValues === "undefined") {
    console.warn("categories/pipValues fehlen – pairsData.js nicht geladen?");
    return "";
  }

  return Object.entries(categories)
    .map(([groupName, syms]) => `
      <optgroup label="${groupName}">
        ${syms
          .filter(sym => pipValues[sym] !== undefined)
          .map(sym => `<option value="${sym}">${sym}</option>`)
          .join("")}
      </optgroup>
    `)
    .join("");
}

/* ============================================================
   🛠️ EDITOR
   ============================================================ */

function openWeeklyPairEditor() {
  const container = document.getElementById("weeklyPairPlan");
  if (!container) return;

  container.innerHTML = `
    <h4>🛠️ Weekly Pair Setup</h4>

    <div style="display:grid;grid-template-columns:1.5fr 1fr 1fr auto;gap:8px;">
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

      <button onclick="addWeeklyPair()">➕</button>
    </div>

    <div style="margin-top:14px;">
      ${[...weeklyPairPlan]
        .sort((a, b) => b.priority - a.priority)
        .map(p => `
          <div 
            class="weekly-pair-item ${p.bias} prio-${p.priority}"
            onclick="removeWeeklyPairBySymbol('${p.symbol}')"
            title="Klicken zum Löschen"
          >
            <span>${p.symbol}</span>
            <span>${p.bias.toUpperCase()}</span>
            <span>${"🔥".repeat(p.priority)}</span>
          </div>
        `)
        .join("")}
    </div>

    <button style="margin-top:16px;" onclick="renderWeeklyPairPlan()">
      ✅ Fertig
    </button>
  `;
}

/* ============================================================
   ➕➖ ADD / REMOVE (AUTO SAVE)
   ============================================================ */

function addWeeklyPair() {
  const symbol = document.getElementById("wpSymbol").value;
  const bias = document.getElementById("wpBias").value;
  const priority = parseInt(document.getElementById("wpPriority").value, 10);

  if (!symbol || !bias || !priority) return;
  if (!pipValues?.[symbol]) return;
  if (weeklyPairPlan.some(p => p.symbol === symbol)) return;

  weeklyPairPlan.push({ symbol, bias, priority });

  saveWeeklyPairPlan();
  openWeeklyPairEditor();
}

function removeWeeklyPairBySymbol(symbol) {
  const ok = confirm(`Pair ${symbol} wirklich löschen?`);
  if (!ok) return;

  weeklyPairPlan = weeklyPairPlan.filter(p => p.symbol !== symbol);

  saveWeeklyPairPlan();
  renderWeeklyPairPlan();
}

/* ============================================================
   🚀 INIT
   ============================================================ */

window.addEventListener("DOMContentLoaded", () => {
  loadWeeklyPairPlan();
  renderWeeklyPairPlan();
});
