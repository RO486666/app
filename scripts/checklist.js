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
   7 LEVEL – DEINE SKALA (0–178)
   ============================================================ */
function getLevelData(total) {

  if (total < 33) {
    return { label: "❌ No Trade", class: "lvl0", color: "#ff3333" };
  }
  if (total < 78) {
    return { label: "⚠️ Wacklig", class: "lvl1", color: "#ff884d" };
  }
  if (total < 101) {
    return { label: "🟡 Valider Entry", class: "lvl2", color: "#ffdd55" };
  }
  if (total < 127) {
    return { label: "🟢 Guter Trade", class: "lvl3", color: "#44ff88" };
  }
  if (total < 149) {
    return { label: "🔵 Sehr gut", class: "lvl4", color: "#33bbff" };
  }
  if (total < 170) {
    return { label: "🟣 High Prob.", class: "lvl5", color: "#bb55ff" };
  }

  return { label: "💎 Perfect Trade", class: "lvl6", color: "#00ffe0" };
}


/* ============================================================
   🔥 SCORE BERECHNUNG
   ============================================================ */
function updateConfluenceScore() {

  // RESET
  Object.keys(confGroups).forEach(key => confGroups[key] = 0);

  // CHECKBOXES AUSLESEN
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

  // PFLICHTEN
  const biasTotal = confGroups.weekly + confGroups.daily + confGroups.h4;
  const aoiTotal  = confGroups.aoi;

  const scoreBox   = document.getElementById("confTotalBox");
  const totalValue = document.getElementById("confTotalValue");
  const totalText  = document.getElementById("confTotalText");

  // Alle Klassen resetten
  scoreBox.className = "conf-total-box";

  // Pflichtfehler – BIAS
  if (biasTotal === 0) {
    totalValue.textContent = "❌";
    totalText.textContent  = "Missing Bias";
    totalValue.style.color = "#ff5050";

    syncFloatingScore("❌", "Missing Bias", "#ff5050");
    return;
  }

  // Pflichtfehler – AOI
  if (aoiTotal === 0) {
    totalValue.textContent = "❌";
    totalText.textContent  = "Missing AOI";
    totalValue.style.color = "#ff5050";

    syncFloatingScore("❌", "Missing AOI", "#ff5050");
    return;
  }

  /* ============================================================
     TOTAL SCORE berechnen
     ============================================================ */
  let total =
    confGroups.weekly +
    confGroups.daily +
    confGroups.h4 +
    confGroups.intraday +
    confGroups.lower +
    confGroups.entry;

  if (total > 178) total = 178;

  totalValue.textContent = total + "%";

  const L = getLevelData(total);

  // Level Klasse setzen
  scoreBox.className = "conf-total-box " + L.class;

  // Text + Farbe
  totalValue.style.color = L.color;
  totalText.innerHTML = L.label;

  // Mini-Score updaten
  syncFloatingScore(total + "%", L.label, L.color);
}


/* ============================================================
   🔥 MINI-FLOATING SCORE – SYNC
   ============================================================ */
function syncFloatingScore(value, label, color) {
  const fv = document.getElementById("floatingScoreValue");
  const fl = document.getElementById("floatingScoreLabel");

  fv.textContent = value;
  fv.style.color = color;

  fl.textContent = label;
  fl.style.color = color;
}


/* ============================================================
   🔥 FLOATING SCORE VISIBILITY (SIDEBAR-MODE)
   ============================================================ */
function handleFloatingScore() {
  const bigBox = document.getElementById("confTotalBox");
  const floatBox = document.getElementById("floatingScore");

  const rect = bigBox.getBoundingClientRect();

  // ist die große Box aus dem View?
  if (rect.bottom < 0 || rect.top > window.innerHeight) {
    floatBox.classList.remove("hidden");
  } else {
    floatBox.classList.add("hidden");
  }
}

window.addEventListener("scroll", handleFloatingScore);


/* ============================================================
   INIT
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {

  document.querySelectorAll(".conf-check").forEach(b =>
    b.addEventListener("change", updateConfluenceScore)
  );

  updateConfluenceScore();
  handleFloatingScore();
});
