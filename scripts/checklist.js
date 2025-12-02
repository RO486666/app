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
  aoi: 0  // NEU
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
   🔥 Hauptberechnung + Pflichtlogik integriert
   ============================================================ */
function updateConfluenceScore() {

    // Reset
    Object.keys(confGroups).forEach(g => confGroups[g] = 0);

    // Checkboxen einsammeln
    document.querySelectorAll(".conf-check").forEach(box => {
        if (box.checked) {
            const pts = Number(box.dataset.points || 0);
            const g1 = (box.dataset.group || "").trim();
            const g2 = (box.dataset.group2 || "").trim();

            if (g1 && confGroups[g1] !== undefined) confGroups[g1] += pts;
            if (g2 && confGroups[g2] !== undefined) confGroups[g2] += pts;
        }
    });

    // Summary Update
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

    // Untergruppen-Summe
    document.querySelectorAll(".conf-acc-item").forEach(item => {
        const accId = item.querySelector(".conf-acc-header").dataset.target;
        const body = document.getElementById(accId);
        const sumEl = document.getElementById(accId + "_sum");
        if (!body || !sumEl) return;

        let sum = 0;
        body.querySelectorAll(".conf-check").forEach(box => {
            if (box.checked) sum += Number(box.dataset.points || 0);
        });

        sumEl.textContent = sum + "%";
    });

    // Score Elemente
    const scoreBox   = document.getElementById("confTotalBox");
    const totalValue = document.getElementById("confTotalValue");
    const totalText  = document.getElementById("confTotalText");

    scoreBox.classList.remove("glow-low", "glow-moderate", "glow-valid", "glow-strong", "glow-error");

    /* ----------------------------------------
       🔥 Pflichtlogik – Bias → AOI
       ---------------------------------------- */

    const biasTotal = confGroups.weekly + confGroups.daily + confGroups.h4;
    const aoiTotal = confGroups.aoi;

    // 1. BIAS Pflicht
    if (biasTotal === 0) {
        scoreBox.classList.add("glow-error");
        totalValue.textContent = "❌";
        totalText.textContent  = "Missing Bias";
        return;
    }

    // 2. AOI Pflicht
    if (aoiTotal === 0) {
        scoreBox.classList.add("glow-error");
        totalValue.textContent = "❌";
        totalText.textContent  = "Missing AOI";
        return;
    }

    // Normaler Score
    let total = Object.values(confGroups).reduce((a, b) => a + b, 0);
    if (total > 135) total = 135;

    totalValue.textContent = total + "%";

    if (total < 40) {
        totalText.textContent = "Low Confluence";
        scoreBox.classList.add("glow-low");
    }
    else if (total < 80) {
        totalText.textContent = "Moderate Confluence";
        scoreBox.classList.add("glow-moderate");
    }
    else if (total < 110) {
        totalText.textContent = "Valid Confluence";
        scoreBox.classList.add("glow-valid");
    }
    else {
        totalText.textContent = "Strong Confluence";
        scoreBox.classList.add("glow-strong");
    }
}

/* ============================================================
   🔥 INIT (Final)
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {

    // Alle Checkboxen/Radios triggern Score
    document.querySelectorAll(".conf-check").forEach(b => {
        b.addEventListener("change", updateConfluenceScore);
    });

    // Accordion öffnen/schließen
    document.querySelectorAll(".conf-acc-header").forEach(header => {
        header.addEventListener("click", () => {
            header.parentElement.classList.toggle("open");
        });
    });

    // Erste Berechnung nach Laden
    updateConfluenceScore();
});
