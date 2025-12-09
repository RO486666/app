/* ============================================================
   🔥 SUMMARY Gruppen
   ============================================================ */
const confGroups = {
  weekly: 0,
  daily: 0,
  h4: 0,
  intraday: 0,
  lower: 0,
  entry: 0,
  aoi: 0
};


/* ============================================================
   Hilfsfunktion
   ============================================================ */
function setAll(id, text) {
  document.querySelectorAll(`#${id}`).forEach(el => el.textContent = text);
}


/* ============================================================
   ACTIVE STATE BOXES
   ============================================================ */
function toggleActiveBox(id, value) {
  document.querySelectorAll(`#${id}`).forEach(el => {
    let box = el.closest(".conf-box");
    if (!box) return;
    if (value > 0) box.classList.add("active");
    else box.classList.remove("active");
  });
}


/* ============================================================
   7-LEVEL LOGIK (0–178 %)
   ============================================================ */
function getLevelData(total) {

  if (total < 45) {
    return { label: "❌ No Trade",   class: "lvl0", color: "#ff3333" };
  }
  if (total < 90) {
    return { label: "⚠️ Weak",       class: "lvl1", color: "#ff884d" };
  }
  if (total < 135) {
    return { label: "🟡 Moderate",   class: "lvl2", color: "#ffdd55" };
  }
  if (total < 150) {
    return { label: "🟢 Good",        class: "lvl3", color: "#44ff88" };
  }
  if (total < 165) {
    return { label: "🔵 Strong",      class: "lvl4", color: "#33bbff" };
  }
  if (total < 178) {
    return { label: "🟣 High Prob.",  class: "lvl5", color: "#bb55ff" };
  }

  return { label: "💎 Premium",       class: "lvl6", color: "#00ffe0" };
}


/* ============================================================
   🔥 SCORE BERECHNUNG
   ============================================================ */
function updateConfluenceScore() {

  // RESET
  Object.keys(confGroups).forEach(key => confGroups[key] = 0);

  // PUNKTE SAMMELN
  document.querySelectorAll(".conf-check").forEach(box => {
    if (!box.checked) return;

    const pts = Number(box.dataset.points || 0);
    const g1 = box.dataset.group;
    const g2 = box.dataset.group2;

    if (g1 && confGroups[g1] !== undefined) confGroups[g1] += pts;
    if (g2 && confGroups[g2] !== undefined) confGroups[g2] += pts;
  });

  // SUMMARY OBEN
  setAll("sum_weekly",    confGroups.weekly + "%");
  setAll("sum_daily",     confGroups.daily + "%");
  setAll("sum_h4",        confGroups.h4 + "%");
  setAll("sum_intraday",  confGroups.intraday + "%");
  setAll("sum_lower",     confGroups.lower + "%");
  setAll("sum_entry",     confGroups.entry + "%");

  toggleActiveBox("sum_weekly",   confGroups.weekly);
  toggleActiveBox("sum_daily",    confGroups.daily);
  toggleActiveBox("sum_h4",       confGroups.h4);
  toggleActiveBox("sum_intraday", confGroups.intraday);
  toggleActiveBox("sum_lower",    confGroups.lower);
  toggleActiveBox("sum_entry",    confGroups.entry);

  // Pflichtbedingungen
  const biasTotal = confGroups.weekly + confGroups.daily + confGroups.h4;
  const aoiTotal  = confGroups.aoi;

  const scoreBox   = document.getElementById("confTotalBox");
  const totalValue = document.getElementById("confTotalValue");
  const totalText  = document.getElementById("confTotalText");

  scoreBox.classList.remove("lvl0","lvl1","lvl2","lvl3","lvl4","lvl5","lvl6","glow-error");

  // BIAS Pflicht
  if (biasTotal === 0) {
    totalValue.textContent = "❌";
    totalText.textContent  = "Missing Bias";
    totalValue.style.color = "#ff5050";
    scoreBox.classList.add("glow-error");
    return;
  }

  // AOI Pflicht
  if (aoiTotal === 0) {
    totalValue.textContent = "❌";
    totalText.textContent  = "Missing AOI";
    totalValue.style.color = "#ff5050";
    scoreBox.classList.add("glow-error");
    return;
  }

  /* ============================================================
     TOTAL SCORE (AOI zählt NICHT zum Score!)
     ============================================================ */
  let total =
    confGroups.weekly +
    confGroups.daily +
    confGroups.h4 +
    confGroups.intraday +
    confGroups.lower +
    confGroups.entry;

  // Unser echtes Maximum ist ~178 % (deine Kriterien)
  if (total > 178) total = 178;

  totalValue.textContent = total + "%";

  // Level bestimmen
  const L = getLevelData(total);

  scoreBox.classList.add(L.class);
  totalValue.style.color = L.color;
  totalText.textContent = L.label;
}




/* ============================================================
   INIT
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".conf-check").forEach(b =>
    b.addEventListener("change", updateConfluenceScore)
  );
  updateConfluenceScore();
});
