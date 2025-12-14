/* ============================================================
   🔥 SUMMARY Gruppen
   ============================================================ */
const confGroups = {
  weekly: 0,
  daily: 0,
  h4: 0,
  intraday: 0,
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
   LEVEL SCALE (0–200) – Professional Version with subtext
   ============================================================ */
function getLevelData(total) {

  if (total < 30)
    return { 
      label: "❌ No Trade",
      sub: "Setup unzureichend – keine verwertbare Struktur.",
      class: "lvl0",
      color: "#ff3333"
    };

  if (total < 70)
    return { 
      label: "⚠️ Low Quality",
      sub: "Zu wenig Konfluenz – Risiko nicht gerechtfertigt.",
      class: "lvl1",
      color: "#ff884d"
    };

  if (total < 90)
    return { 
      label: "🟡 Moderate Setup",
      sub: "Handelbar, aber mit erhöhter Unsicherheit.",
      class: "lvl2",
      color: "#ffdd55"
    };

  if (total < 110)
    return { 
      label: "🟢 Valid Setup",
      sub: "Solide Grundlage – mehrere Faktoren greifen.",
      class: "lvl3",
      color: "#44ff88"
    };

  if (total < 135)
    return { 
      label: "🔵 Strong Setup",
      sub: "Technisch sauber – klare Struktur & gute Wahrscheinlichkeit.",
      class: "lvl4",
      color: "#33bbff"
    };

  if (total < 150)
    return { 
      label: "🟣 High Probability",
      sub: "Überdurchschnittlich stark – geringe Fehlerrate.",
      class: "lvl5",
      color: "#bb55ff"
    };

  return { 
    label: "💎 Premium / Optimal",
    sub: "Maximaler Konfluenzgrad – statistisch sehr hohe Qualität.",
    class: "lvl6",
    color: "#00ffe0"
  };
}



/* ============================================================
   🔥 SCORE CALCULATION
   ============================================================ */
function updateConfluenceScore() {

  Object.keys(confGroups).forEach(k => confGroups[k] = 0);

  document.querySelectorAll(".conf-check").forEach(box => {
    if (!box.checked) return;

    const pts = Number(box.dataset.points || 0);
    const g1 = box.dataset.group;
    const g2 = box.dataset.group2;

    if (g1) confGroups[g1] += pts;
    if (g2) confGroups[g2] += pts;
  });

  // SUMMARY UPDATE
  setAll("sum_weekly",    confGroups.weekly + "%");
  setAll("sum_daily",     confGroups.daily + "%");
  setAll("sum_h4",        confGroups.h4 + "%");
  setAll("sum_intraday",  confGroups.intraday + "%");
  setAll("sum_entry",     confGroups.entry + "%");

  toggleActiveBox("sum_weekly",    confGroups.weekly);
  toggleActiveBox("sum_daily",     confGroups.daily);
  toggleActiveBox("sum_h4",        confGroups.h4);
  toggleActiveBox("sum_intraday",  confGroups.intraday);
  toggleActiveBox("sum_entry",     confGroups.entry);

  // REQUIRED: Bias + AOI
  const biasTotal = confGroups.weekly + confGroups.daily + confGroups.h4;
  const aoiTotal  = confGroups.aoi;

  const scoreBox   = document.getElementById("confTotalBox");
  const totalValue = document.getElementById("confTotalValue");
  const totalText  = document.getElementById("confTotalText");

  scoreBox.className = "conf-total-box";

  if (biasTotal === 0) {
    totalValue.textContent = "❌";
    totalText.innerHTML = `<div>Missing Bias</div>`;
    totalValue.style.color = "#ff5050";
    syncFloatingScore("❌", "Missing Bias", "#ff5050");
    return;
  }

  if (aoiTotal === 0) {
    totalValue.textContent = "❌";
    totalText.innerHTML = `<div>Missing AOI</div>`;
    totalValue.style.color = "#ff5050";
    syncFloatingScore("❌", "Missing AOI", "#ff5050");
    return;
  }

  // TOTAL (Base Score)
  let total =
    confGroups.weekly +
    confGroups.daily +
    confGroups.h4 +
    confGroups.intraday +
    confGroups.entry;

  // 🔴 MAJOR NEWS RISK MULTIPLIER
  const majorNews = document.getElementById("majorNews");
  if (majorNews && majorNews.checked) {
    total = total - 40; // −40 % brutal cut
  }

  if (total > 200) total = 200;




  totalValue.textContent = total + "%";

  const L = getLevelData(total);

  scoreBox.className = "conf-total-box " + L.class;
  totalValue.style.color = L.color;

  // Label + Subtext
  totalText.innerHTML = `
    <div>${L.label}</div>
    <small style="opacity:0.75; font-size:12px;">${L.sub}</small>
  `;

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
   🔥 FLOATING SCORE VISIBILITY
   ============================================================ */
function handleFloatingScore() {
  const bigBox = document.getElementById("confTotalBox");
  const floatBox = document.getElementById("floatingScore");
  if (!bigBox || !floatBox) return;

  const rect = bigBox.getBoundingClientRect();

  const isOutOfView =
    rect.bottom < 0 || rect.top > window.innerHeight;

  floatBox.classList.toggle("hidden", !isOutOfView);
}

window.addEventListener("scroll", handleFloatingScore);

document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Die Elemente holen
    const targetElement = document.querySelector('.conf-total-box'); // Die große Box im Content
    const floatingBar = document.querySelector('.floating-score');   // Die neue Bottom-Bar
    
    // Sicherheitscheck
    if (!targetElement || !floatingBar) return;

    // 2. Observer Optionen definieren
    const observerOptions = {
        root: null,   // Viewport
        threshold: 0, // Sobald 0% vom Element sichtbar sind -> Trigger
        rootMargin: "-100px 0px 0px 0px" // Optional: Trigger etwas früher/später justieren
    };

    // 3. Der Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // Logik: 
            // Wenn target NICHT im Bild ist (!isIntersecting) -> Bar hochfahren (.slide-up)
            // Wenn target im Bild IST (isIntersecting) -> Bar einfahren (Klasse weg)
            
            if (!entry.isIntersecting) {
                // Target ist weggescrollt -> Zeige Bar
                floatingBar.classList.add('slide-up');
            } else {
                // Target ist sichtbar -> Verstecke Bar
                floatingBar.classList.remove('slide-up');
            }
        });
    }, observerOptions);

    // 4. Start Monitoring
    observer.observe(targetElement);
});


/* ============================================================
   RADIO UNCHECK FIX
   ============================================================ */
document.querySelectorAll('input[type="radio"]').forEach(radio => {
  radio.addEventListener('click', function () {

    if (this.previousChecked) {
      this.checked = false;
      this.dispatchEvent(new Event("change", { bubbles: true }));
    }

    this.previousChecked = this.checked;
  });
});


function getCurrentConfluenceResult() {
  const totalValue = document.getElementById("confTotalValue");
  if (!totalValue) return null;

  const raw = totalValue.textContent.replace("%", "");
  const score = parseInt(raw, 10);

  if (isNaN(score)) return null;

  const level = getLevelData(score);

  return {
    score,              // z.B. 150
    label: level.label, // "High Probability"
    class: level.class, // lvl5
    color: level.color  // Farbe
  };
}

function saveConfluence() {
  const result = getCurrentConfluenceResult();
  if (!result) return;

  const trades = getDashboardTrades();
  if (!trades.length) {
    alert("Keine Trades im Dashboard vorhanden.");
    return;
  }

  openConfluenceAssignPopup(trades, result);
}

function getDashboardTrades() {
  try {
    const raw = localStorage.getItem("weeklyPairPlan_v1");
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function openConfluenceAssignPopup(trades, result) {
  const overlay = document.createElement("div");
  overlay.className = "conf-assign-overlay";

  overlay.innerHTML = `
    <div class="conf-assign-modal">
      <h3>Confluence speichern</h3>
      <p><strong>${result.score}%</strong> – welchem Trade zuweisen?</p>

      <div class="conf-assign-list">
        ${trades.map((t, i) => `
          <button onclick="assignConfluenceFromChecklist(${i})">
            ${t.symbol} · ${t.bias.toUpperCase()} · Prio ${t.priority}
          </button>
        `).join("")}
      </div>

      <button class="cancel-btn" onclick="closeConfluenceAssignPopup()">Abbrechen</button>
    </div>
  `;

  overlay.dataset.result = JSON.stringify(result);
  document.body.appendChild(overlay);
}

function assignConfluenceFromChecklist(tradeIndex) {
  const overlay = document.querySelector(".conf-assign-overlay");
  if (!overlay) return;

  const result = JSON.parse(overlay.dataset.result);

  window.assignConfluenceToTrade?.({
    tradeIndex,
    confluence: result
  });

  closeConfluenceAssignPopup();
  resetConfluenceChecklist();
}

function closeConfluenceAssignPopup() {
  const overlay = document.querySelector(".conf-assign-overlay");
  if (overlay) overlay.remove();
}


function resetConfluenceChecklist() {
  document.querySelectorAll(".conf-check").forEach(c => {
    c.checked = false;
    c.previousChecked = false;
  });

  updateConfluenceScore();
}


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
