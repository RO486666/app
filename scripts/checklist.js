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
  document.querySelectorAll(`#${id}`).forEach(el => (el.textContent = text));
}

/* ============================================================
   ACTIVE STATE BOXES
   ============================================================ */
function toggleActiveBox(id, value) {
  document.querySelectorAll(`#${id}`).forEach(el => {
    const box = el.closest(".conf-box");
    if (!box) return;
    box.classList.toggle("active", value > 0);
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
    🔥 SCORE CALCULATION - FULLY INTERACTIVE UI
   ============================================================ */
function updateConfluenceScore() {
  Object.keys(confGroups).forEach(k => (confGroups[k] = 0));

  // 1. Basis-Punkte sammeln
  document.querySelectorAll(".conf-check").forEach(box => {
    if (!box.checked) return;
    const pts = Number(box.dataset.points || 0);
    const g1 = box.dataset.group;
    const g2 = box.dataset.group2;
    if (g1) confGroups[g1] += pts;
    if (g2) confGroups[g2] += pts;
  });

  // 2. Summary Teilbereiche aktualisieren
  const areas = ["weekly", "daily", "h4", "intraday", "entry"];
  areas.forEach(area => setAll(`sum_${area}`, confGroups[area] + "%"));

  // UI-Elemente referenzieren
  const scoreBox = document.getElementById("confTotalBox");
  const totalValue = document.getElementById("confTotalValue");
  const totalText = document.getElementById("confTotalText");
  
  // Die 4H Validierungs-Elemente
  const h4Card = document.getElementById("h4ValidationCard");
  const h4Status = document.getElementById("h4ValidationStatus");
  const h4Mult = document.getElementById("h4MultiplierDisplay");
  const h4Desc = document.getElementById("h4ValidationText");

  if (!scoreBox || !totalValue || !totalText) return;

  // 3. BASIS-SCORE berechnen
  let total = confGroups.weekly + confGroups.daily + confGroups.h4 + confGroups.intraday + confGroups.entry;

  // --- 4H BIAS CHECK (LOGIK + UI UPDATE) ---
  const h4RadioChecked = document.querySelector('input[name="h4_htf"]:checked');
  let isH4PenaltyActive = false;

  if (!h4RadioChecked) {
    total -= 50; 
    isH4PenaltyActive = true;
    
    // UI auf Rot / Missing setzen
    if(h4Card) h4Card.style.borderColor = "#ff3333";
    if(h4Status) { h4Status.textContent = "MISSING"; h4Status.style.color = "#ff3333"; }
    if(h4Mult) { h4Mult.textContent = "-50 PTS"; h4Mult.style.color = "#ff3333"; }
    if(h4Desc) h4Desc.textContent = "Kein HL/LH bestätigt (Pflicht!)";
  } else {
    // UI auf Grün / Confirmed setzen
    if(h4Card) h4Card.style.borderColor = "#44ff88";
    if(h4Status) { h4Status.textContent = "CONFIRMED"; h4Status.style.color = "#44ff88"; }
    if(h4Mult) { h4Mult.textContent = "OK"; h4Mult.style.color = "#44ff88"; }
    if(h4Desc) h4Desc.textContent = "4H Struktur-Vorgabe erfüllt.";
  }

  // 4. NEWS RISK Abzug (-20)
  const majorNews = document.getElementById("majorNews");
  if (majorNews && majorNews.checked) total -= 40; 

  // Score deckeln
  if (total > 200) total = 200;

  // 5. FINALES UI STYLING (Die "Ehrliche" Skala)
  totalValue.textContent = Math.round(total) + "%"; 
  const L = getLevelData(total);

  if (total < 0) {
    totalValue.style.color = "#ff3333";
    scoreBox.className = "conf-total-box lvl0";
    totalText.innerHTML = `<div style="color:#ff3333; font-weight:bold;">❌ INVALID SETUP</div>`;
  } else {
    // Nutzt die Farbe des Scores (auch wenn 4H fehlt)
    totalValue.style.color = L.color;
    scoreBox.className = "conf-total-box " + L.class;

    let warningHtml = isH4PenaltyActive 
      ? `<div style="color:#ffcc00; font-weight:bold; font-size:12px; margin-top:2px;">⚠️ 4H BIAS MISSING (-50)</div>` 
      : "";

    totalText.innerHTML = `
      <div style="font-weight:bold;">${L.label}</div>
      ${warningHtml}
      <small style="opacity:0.75; display:block; margin-top:2px;">${L.sub}</small>
    `;
  }

  syncFloatingScore(
    Math.round(total) + "%", 
    isH4PenaltyActive ? `MISSING 4H (${L.label})` : L.label, 
    total < 0 ? "#ff3333" : L.color
  );
}
/* ============================================================
   🔥 MINI-FLOATING SCORE – SYNC
   ============================================================ */
function syncFloatingScore(value, label, color) {
  const fv = document.getElementById("floatingScoreValue");
  const fl = document.getElementById("floatingScoreLabel");
  if (!fv || !fl) return;

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
  const isOutOfView = rect.bottom < 0 || rect.top > window.innerHeight;

  floatBox.classList.toggle("hidden", !isOutOfView);
}

window.addEventListener("scroll", handleFloatingScore);

document.addEventListener("DOMContentLoaded", () => {
  const targetElement = document.querySelector(".conf-total-box");
  const floatingBar = document.querySelector(".floating-score");
  if (!targetElement || !floatingBar) return;

  const observerOptions = {
    root: null,
    threshold: 0,
    rootMargin: "-100px 0px 0px 0px"
  };

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      floatingBar.classList.toggle("slide-up", !entry.isIntersecting);
    });
  }, observerOptions);

  observer.observe(targetElement);
});

/* ============================================================
   RADIO UNCHECK FIX
   ============================================================ */
document.querySelectorAll('input[type="radio"]').forEach(radio => {
  radio.addEventListener("click", function () {
    if (this.previousChecked) {
      this.checked = false;
      this.dispatchEvent(new Event("change", { bubbles: true }));
    }
    this.previousChecked = this.checked;
  });
});

/* ============================================================
   SAVE / LOAD HELPERS
   ============================================================ */
function getCurrentConfluenceResult() {
  const totalValue = document.getElementById("confTotalValue");
  if (!totalValue) return null;

  const raw = totalValue.textContent.replace("%", "");
  const score = parseInt(raw, 10);

  if (isNaN(score)) return null;

  const level = getLevelData(score);

  return {
    score,
    label: level.label,
    class: level.class,
    color: level.color
  };
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

/* ============================================================
   SAVE CONFLUENCE
   ============================================================ */
function saveConfluence() {
  const result = getCurrentConfluenceResult();
  if (!result) return;

  const trades = getDashboardTrades();
  if (!trades.length) return;

  const state = getChecklistState();

  openConfluenceAssignPopup(trades, {
    ...result,
    groups: { ...confGroups },
    checklistState: state,
    editedAt: Date.now()
  });
}

/* ============================================================
   SAVE CONFLUENCE POPUP (Mit Datum & Score Anzeige)
   ============================================================ */
function openConfluenceAssignPopup(trades, result) {
  const overlay = document.createElement("div");
  overlay.className = "conf-assign-overlay";

  // Datum formatieren für Anzeige
  const nowStr = new Date().toLocaleTimeString("de-DE", { hour: '2-digit', minute: '2-digit' });

  overlay.innerHTML = `
    <div class="conf-assign-modal">
      <h3>Confluence speichern</h3>
      <p>
        Aktueller Score: <strong style="color:${result.color}">${result.score}%</strong><br>
        <span style="font-size:12px; opacity:0.6;">Erfasst um ${nowStr} Uhr</span>
      </p>
      
      <div style="margin-bottom:10px; font-size:13px; opacity:0.8;">
        Welchem Trade zuweisen?
      </div>

      <div class="conf-assign-list">
        ${trades.map((t, i) => {
            // Prüfen, ob für diesen Trade schon Daten existieren
            const hasData = t.confluence && t.confluence.score !== undefined;
            
            // Score holen oder Platzhalter
            const oldScore = hasData ? t.confluence.score + "%" : "Neu";
            const scoreColor = hasData ? t.confluence.color : "#888";

            // Datum holen und schön formatieren (z.B. "14.12. 10:30")
            let dateStr = "";
            if (hasData && t.confluence.editedAt) {
              const d = new Date(t.confluence.editedAt);
              dateStr = d.toLocaleDateString("de-DE", { 
                day: "2-digit", 
                month: "2-digit" 
              }) + " " + d.toLocaleTimeString("de-DE", { 
                hour: "2-digit", 
                minute: "2-digit" 
              });
            } else {
              dateStr = "—";
            }

            return `
              <button onclick="assignConfluenceFromChecklist(${i})" style="display:flex; justify-content:space-between; align-items:center; text-align:left; gap:10px;">
                
                <div style="display:flex; flex-direction:column;">
                  <span style="font-weight:bold; font-size:14px;">${t.symbol}</span>
                  <span style="font-size:11px; opacity:0.7;">${t.bias.toUpperCase()} · Prio ${t.priority}</span>
                </div>

                <div style="text-align:right;">
                  <div style="font-weight:bold; color:${scoreColor}; font-size:14px;">${oldScore}</div>
                  <div style="font-size:10px; opacity:0.5;">${dateStr}</div>
                </div>

              </button>
            `;
          }).join("")}
      </div>

      <button class="cancel-btn" onclick="closeConfluenceAssignPopup()">Abbrechen</button>
    </div>
  `;

  // Daten für Save-Logik anhängen
  overlay.dataset.result = JSON.stringify({
    score: result.score,
    label: result.label,
    class: result.class,
    color: result.color,
    checklistState: result.checklistState,
    editedAt: result.editedAt,
    groups: result.groups
  });

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

  const news = document.getElementById("majorNews");
  if (news) news.checked = false;

  updateConfluenceScore();
}

function getChecklistState() {
  return {
    checkedIds: Array.from(document.querySelectorAll(".conf-check:checked")).map(
      el => el.id
    ),
    majorNews: document.getElementById("majorNews")?.checked || false
  };
}

/* ============================================================
   LOAD CONFLUENCE (Restore FULL state)
   ============================================================ */
function loadConfluenceState(confluence) {
  resetConfluenceChecklist();
  if (!confluence) return;

  // 1) Checkboxes + News wiederherstellen
  if (confluence.checklistState) {
    const { checkedIds, majorNews } = confluence.checklistState;

    // Checkboxen anhaken
    checkedIds?.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.checked = true;
        // Wichtig für Radio-Buttons (Fix state)
        el.previousChecked = true; 
      }
    });

    // News Switch
    const news = document.getElementById("majorNews");
    if (news) news.checked = !!majorNews;
  }

  // 2) Groups laden (Initialwerte setzen)
  if (confluence.groups) {
    Object.keys(confGroups).forEach(k => {
      confGroups[k] = Number(confluence.groups[k] || 0);
    });
  }

  // 3) Total Box Info setzen (Text & Farbe)
  const scoreBox = document.getElementById("confTotalBox");
  const totalValue = document.getElementById("confTotalValue");
  const totalText = document.getElementById("confTotalText");

  if (scoreBox && totalValue && totalText) {
    // Visuelle Darstellung aus dem Save übernehmen
    totalValue.textContent = confluence.score + "%";
    totalValue.style.color = confluence.color;
    scoreBox.className = "conf-total-box " + confluence.class;

    totalText.innerHTML = `
      <div>${confluence.label}</div>
      <small style="opacity:0.75;font-size:12px;">
        Geladen · ${new Date(confluence.editedAt || Date.now()).toLocaleString("de-DE")}
      </small>
    `;

    syncFloatingScore(confluence.score + "%", confluence.label, confluence.color);
  }

  // 4) WICHTIG: Einmal alles neu berechnen, damit Active-States 
  // und Checkboxen visuell synchron sind.
  updateConfluenceScore();
}

/* ============================================================
   LOAD CONFLUENCE POPUP (Mit Datum & Score Anzeige)
   ============================================================ */
function loadConfluenceFromDashboard() {
  const trades = getDashboardTrades();
  if (!trades.length) return;

  const overlay = document.createElement("div");
  overlay.className = "conf-assign-overlay";

  overlay.innerHTML = `
    <div class="conf-assign-modal">
      <h3>Confluence laden</h3>
      <p style="opacity:0.8; margin-bottom:15px;">
        Welchen Trade möchtest du in die Checklist laden?
      </p>

      <div class="conf-assign-list">
        ${trades.map((t, i) => {
            // Prüfen, ob Daten da sind
            const hasData = t.confluence && t.confluence.score !== undefined;

            // Score Anzeige (oder "Leer")
            const scoreDisplay = hasData ? t.confluence.score + "%" : "Leer";
            const scoreColor = hasData ? t.confluence.color : "#888";

            // Datum formatieren
            let dateStr = "—";
            if (hasData && t.confluence.editedAt) {
              const d = new Date(t.confluence.editedAt);
              dateStr = d.toLocaleDateString("de-DE", { 
                day: "2-digit", 
                month: "2-digit" 
              }) + " " + d.toLocaleTimeString("de-DE", { 
                hour: "2-digit", 
                minute: "2-digit" 
              });
            }

            return `
          <button onclick="loadTradeIntoChecklist(${i})" style="display:flex; justify-content:space-between; align-items:center; text-align:left; gap:10px;">
            
            <div style="display:flex; flex-direction:column;">
              <span style="font-weight:bold; font-size:14px;">${t.symbol}</span>
              <span style="font-size:11px; opacity:0.7;">${t.bias.toUpperCase()} · Prio ${t.priority}</span>
            </div>

            <div style="text-align:right;">
              <div style="font-weight:bold; color:${scoreColor}; font-size:14px;">${scoreDisplay}</div>
              <div style="font-size:10px; opacity:0.5;">${dateStr}</div>
            </div>

          </button>
        `;
          })
          .join("")}
      </div>

      <button class="cancel-btn" onclick="closeConfluenceAssignPopup()">
        Abbrechen
      </button>
    </div>
  `;

  document.body.appendChild(overlay);
}

function loadTradeIntoChecklist(index) {
  const trades = getDashboardTrades();
  const trade = trades[index];

  if (!trade?.confluence) {
    alert("Dieser Trade hat noch keine gespeicherte Confluence.");
    return;
  }

  // Ziel für nächstes Save (überschreibt diesen Trade)
  window.confluenceTarget = { tradeIndex: index };

  // FULL Restore
  loadConfluenceState(trade.confluence);

  closeConfluenceAssignPopup();
}

/* ============================================================
   Expose for inline onclick
   ============================================================ */
window.saveConfluence = saveConfluence;
window.loadConfluenceFromDashboard = loadConfluenceFromDashboard;
window.loadTradeIntoChecklist = loadTradeIntoChecklist;
window.assignConfluenceFromChecklist = assignConfluenceFromChecklist;
window.closeConfluenceAssignPopup = closeConfluenceAssignPopup;

/* ============================================================
   INIT
   ============================================================ */
/* ============================================================
   INIT & AUTO-ID FIX
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  // 1. Automatisch IDs verteilen, falls im HTML vergessen
  document.querySelectorAll(".conf-check").forEach((el, index) => {
    if (!el.id) {
      el.id = `conf_auto_${index}`;
    }
  });

  // 2. Event Listener hinzufügen
  document.querySelectorAll(".conf-check").forEach(b =>
    b.addEventListener("change", updateConfluenceScore)
  );

  // 3. Initiale Berechnung
  updateConfluenceScore();
  handleFloatingScore();

  // 4. Observer für Floating Score
  const targetElement = document.querySelector(".conf-total-box");
  const floatingBar = document.querySelector(".floating-score");
  if (targetElement && floatingBar) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        floatingBar.classList.toggle("slide-up", !entry.isIntersecting);
      });
    }, { rootMargin: "-100px 0px 0px 0px" });
    observer.observe(targetElement);
  }
});