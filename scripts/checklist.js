/* ============================================================
   🔥 SUMMARY Gruppen
   ============================================================ */
const confGroups = {
  weekly: 0,
  daily: 0,
  h4: 0,
  intraday: 0,
  lower: 0,
  entry: 0
};

/* ============================================================
   🔥 Kategorie-Limits (max 135%)
   ============================================================ */
const accLimits = {
  acc_bias: 40,
  acc_aoi: 35,
  acc_struktur: 35,
  acc_entry: 15,
  acc_rr: 5,
  acc_psy: 5
};

/* ============================================================
   🔥 Summary Glow – stabil
   ============================================================ */
function toggleActiveBox(id, value) {
    const el = document.getElementById(id);
    if (!el) return;

    let box = el.parentElement;
    while (box && !box.classList.contains("conf-box")) {
        box = box.parentElement;
    }
    if (!box) return;

    if (value > 0) box.classList.add("active");
    else box.classList.remove("active");
}

/* ============================================================
   🔥 Hauptberechnung
   ============================================================ */
function updateConfluenceScore() {

    // Reset
    Object.keys(confGroups).forEach(g => confGroups[g] = 0);

    // Inputs lesen
    document.querySelectorAll(".conf-check").forEach(box => {
        if (box.checked) {
            const pts = Number(box.dataset.points || 0);
            const g1 = (box.dataset.group || "").trim();
            const g2 = (box.dataset.group2 || "").trim();

            if (g1 && confGroups[g1] !== undefined) confGroups[g1] += pts;
            if (g2 && confGroups[g2] !== undefined) confGroups[g2] += pts;
        }
    });

    // Summary update
    document.getElementById("sum_weekly").textContent   = confGroups.weekly + "%";
    document.getElementById("sum_daily").textContent    = confGroups.daily + "%";
    document.getElementById("sum_h4").textContent       = confGroups.h4 + "%";
    document.getElementById("sum_intraday").textContent = confGroups.intraday + "%";
    document.getElementById("sum_lower").textContent    = confGroups.lower + "%";
    document.getElementById("sum_entry").textContent    = confGroups.entry + "%";

    toggleActiveBox("sum_weekly",   confGroups.weekly);
    toggleActiveBox("sum_daily",    confGroups.daily);
    toggleActiveBox("sum_h4",       confGroups.h4);
    toggleActiveBox("sum_intraday", confGroups.intraday);
    toggleActiveBox("sum_lower",    confGroups.lower);
    toggleActiveBox("sum_entry",    confGroups.entry);

    // Kategorien
    Object.keys(accLimits).forEach(accId => {
      const container = document.getElementById(accId);
      const sumEl = document.getElementById(accId + "_sum");
      if (!container || !sumEl) return;

      let sum = 0;
      container.querySelectorAll(".conf-check").forEach(box => {
        if (box.checked) sum += Number(box.dataset.points || 0);
      });

      if (sum > accLimits[accId]) sum = accLimits[accId];
      sumEl.textContent = sum + "%";
    });

    // Total
    let total = Object.values(confGroups).reduce((a,b) => a+b, 0);
    if (total > 135) total = 135;

    document.getElementById("confTotalValue").textContent = total + "%";

    const txt = document.getElementById("confTotalText");
    if (total < 40) txt.textContent = "Low Confluence";
    else if (total < 80) txt.textContent = "Moderate Confluence";
    else if (total < 110) txt.textContent = "Valid Confluence";
    else txt.textContent = "Strong Confluence";
}

/* ============================================================
   🔥 Popup
   ============================================================ */
function openConfluence() {
    document.getElementById("confOverlay").style.display = "flex";
    document.getElementById("confPopup").style.display = "block";
    document.body.style.overflow = "hidden";
}

function closeConfluence() {
    document.getElementById("confOverlay").style.display = "none";
    document.getElementById("confPopup").style.display = "none";
    document.body.style.overflow = "";
}

/* ============================================================
   🔥 INIT – EINZIGER Listener
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {

    // Checkbox Listener
    document.querySelectorAll(".conf-check").forEach(b => {
        b.addEventListener("change", updateConfluenceScore);
    });

    // Close
    document.getElementById("confCloseBtn").addEventListener("click", closeConfluence);

    // Overlay click
    document.getElementById("confOverlay").addEventListener("click", (e) => {
        if (e.target.id === "confOverlay") closeConfluence();
    });

    // ESC close
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeConfluence();
    });

    // Akkordeon
    document.querySelectorAll(".conf-acc-header").forEach(header => {
        header.addEventListener("click", () => {
            header.parentElement.classList.toggle("open");
        });
    });

    updateConfluenceScore();
});
