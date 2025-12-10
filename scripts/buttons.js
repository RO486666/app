// ===============================================
// NEUE BUTTON MAP – Sidebar Icons bleiben dunkel
// Drawer-Links leuchten farbig
// ===============================================

function updateTabButtonColors(activeSessionNames) {

  const sessionColors = {
    "Sydney": "#3388ff",
    "Tokyo": "#00aaff",
    "London": "#ffd700",
    "New York": "#ff4500",
    "London Killzone": "#ccff00",
    "New York Killzone": "#ff8800",
    "Deadzone": "#333333",
    "Crypto": "#9900ff"
  };

  if (!activeSessionNames || activeSessionNames.length === 0) return;

  // Farbe(n) sammeln
  const colors = activeSessionNames
    .filter(s => sessionColors[s])
    .map(s => sessionColors[s]);

  if (colors.length === 0) return;

  // -----------------------------------------
  // 1. Sidebar Icons → sollen NICHT leuchten
  // -----------------------------------------
  // Wir resetten sie sogar explizit!
  const sidebarIcons = document.querySelectorAll("#sidebarLeft button");
  sidebarIcons.forEach(btn => {
    btn.style.background = "#1a1a1a";
    btn.style.boxShadow = "none";
    btn.style.color = "#fff";
    btn.style.animation = "none";
  });

  // -----------------------------------------
  // 2. Drawer Buttons → sollen leuchten
  // -----------------------------------------
  const drawerLinks = document.querySelectorAll(".drawer-link");

  drawerLinks.forEach((btn, i) => {
    const c = colors[i % colors.length];

    btn.style.transition = "all 0.35s ease";
    btn.style.background = c;
    btn.style.color = ["#ffd700", "#ccff00"].includes(c) ? "#111" : "#fff";
    btn.style.boxShadow = `0 0 12px ${c}, 0 0 22px ${c}`;
    btn.style.setProperty("--glow-color", c);
    btn.style.animation = "glowPulse 2s ease-in-out infinite";
  });
}




function applyStatsBoxGlow(sessionName) {
  const statsBoxes = document.querySelectorAll(".stats-box");

  const classMap = {
    "Sydney": "session-glow-sydney",
    "Tokyo": "session-glow-tokyo",
    "London": "session-glow-london",
    "New York": "session-glow-ny",
    "London Killzone": "session-glow-lk",
    "New York Killzone": "session-glow-nyk",
    "Deadzone": "session-glow-deadzone",
    "Crypto": "session-glow-crypto"
  };


  const sessionClass = classMap[sessionName] || "";

  statsBoxes.forEach(box => {
    Object.values(classMap).forEach(cls => box.classList.remove(cls));
    if (sessionClass) {
      box.classList.add(sessionClass);
      box.style.setProperty('--glow-color', sessionColors[sessionName] || "#fff");
    }
  });
}


function buildSessionDetails() {
  const minutes = getMinutesNow();
  const activeSessions = getCurrentSessions(minutes);

  // Header-Bereich
  let fullInfo = `
    <div class="session-details-header">
      🔹 AKTIVE SESSIONS
    </div>
  `;

  if (activeSessions.length > 0) {
    activeSessions.forEach((s) => {
      let start = s.start;
      let end = s.end;

      if (start > end) end += 1440;
      let nowMins = minutes;
      if (nowMins < start) nowMins += 1440;

      const timeLeft = end - nowMins;

      // Icons zuweisen
      const label = s.name.includes("Killzone") ? "🔥" :
                    s.name.includes("New York") ? "🇺🇸" :
                    s.name.includes("London") ? "💷" :
                    s.name.includes("Tokyo") ? "🌏" :
                    s.name.includes("Sydney") ? "🌙" :
                    s.name.includes("Crypto") ? "🪙" : "🟡";

      // 🎨 Farbe holen (Wichtig für das CSS Design!)
      // Falls 'sessionColors' nicht existiert, nutzen wir Türkis als Fallback
      const sColor = (typeof sessionColors !== 'undefined' && sessionColors[s.name]) 
                     ? sessionColors[s.name] 
                     : "#00ffcc";

      // Wochentage aufbauen
      let weekDaysHtml = "";
      if (s.weekDaysInfo) {
        weekDaysHtml = `
          <div class="session-weekdays">
            ${s.weekDaysInfo.map(({ day, text }) => `
              <div class="session-weekday-row">
                <strong>${day}:</strong> <span>${text}</span>
              </div>
            `).join("")}
          </div>
        `;
      }

      // HTML generieren (Hier wird die Farbe als Variable übergeben)
      fullInfo += `
        <div class="session-box-clean" style="--box-color: ${sColor}">
          <div class="session-title">
            ${label} ${s.name}
          </div>

          <div class="session-meta-grid">
             <div class="session-row">⏱️ Noch <strong>${formatHM(timeLeft)}</strong></div>
             <div class="session-row">📅 Start: <strong>${formatHM(s.start)} Uhr</strong></div>
             <div class="session-row">🕓 Ende: <strong>${formatHM(s.end)} Uhr</strong></div>
          </div>
          
          <div class="session-info-text">ℹ️ ${s.info}</div>

          ${weekDaysHtml}
        </div>
      `;
    });
  } else {
    fullInfo += `<div class="session-empty">⏱️ Aktuell keine Session aktiv</div>`;
  }

  // Nächste Session Logik
  const futureSessions = sessions
    .map(s => ({
      ...s,
      startMins: s.start > minutes ? s.start : s.start + 1440
    }))
    .sort((a, b) => a.startMins - b.startMins);

  if (futureSessions.length > 0) {
      const next = futureSessions[0];
      const minsToNext = next.startMins - minutes;
    
      fullInfo += `
        <div class="session-next">
          🔜 <strong>Nächste:</strong> <span class="next-name">${next.name}</span> in ${formatHM(minsToNext)}
        </div>
      `;
  }

  sessionDetailsBox.innerHTML = fullInfo;
}
