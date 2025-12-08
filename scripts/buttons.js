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

  let fullInfo = `
    <div style="
      font-size: 18px;
      font-weight: bold;
      padding: 10px 15px;
      background: linear-gradient(to right, #222, #111);
      border-bottom: 1px solid #333;
      margin-bottom: 10px;
      letter-spacing: 1px;">
      🔹 Aktive Sessions
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

      const label = s.name.includes("Killzone") ? "🔥" :
                    s.name.includes("New York") ? "🇺🇸" :
                    s.name.includes("London") ? "💷" :
                    s.name.includes("Tokyo") ? "🌏" :
                    s.name.includes("Sydney") ? "🌙" :
                    s.name.includes("Crypto") ? "🪙" : "🟡";

      const color = sessionColors[s.name] || "#0cf";
      const glow = `0 0 5px ${color}, 0 0 12px ${hexToRgba(color, 0.5)}`;

      let weekDaysHtml = "";
      if (s.weekDaysInfo) {
        weekDaysHtml = "<div style='margin-top:8px;'>";
        s.weekDaysInfo.forEach(({ day, text }) => {
          weekDaysHtml += `
            <div style="margin-bottom:4px;">
              <strong style="color:${color}; text-shadow:${glow};">${day}:</strong>
              <span style="color:#ccc;"> ${text}</span>
            </div>
          `;
        });
        weekDaysHtml += "</div>";
      }

      fullInfo += `
        <div style="
          border-left: 4px solid ${color};
          padding: 12px 16px;
          margin: 12px 15px;
          background: rgba(255,255,255,0.02);
          border-radius: 10px;
          box-shadow: inset 0 0 6px ${hexToRgba(color, 0.3)};
          font-size: 14px;
          line-height: 1.6;
        ">
          <div style="font-size: 16px; font-weight: bold; color: ${color}; text-shadow: ${glow};">
            ${label} ${s.name}
          </div>
          ⏱️ Noch <strong style="color:${color}; text-shadow:${glow};">${formatHM(timeLeft)}</strong><br>
          📅 Start: <strong style="color:${color}; text-shadow:${glow};">${formatHM(s.start)} Uhr</strong><br>
          🕓 Ende: <strong style="color:${color}; text-shadow:${glow};">${formatHM(s.end)} Uhr</strong><br>
          ℹ️ <span style="color:${color}; text-shadow:${glow};">${s.info}</span>
          ${weekDaysHtml}
        </div>
      `;
    });
  } else {
    fullInfo += `<div style="padding:10px 15px;">⏱️ Aktuell <strong>keine Session aktiv</strong></div>`;
  }

  // 🔜 Nächste Session
  const futureSessions = sessions
    .map(s => ({
      ...s,
      startMins: s.start > minutes ? s.start : s.start + 1440
    }))
    .sort((a, b) => a.startMins - b.startMins);

  const next = futureSessions[0];
  const minsToNext = next.startMins - minutes;
  const nextColor = sessionColors[next.name] || "#999";
  const nextGlow = `0 0 5px ${nextColor}, 0 0 10px ${hexToRgba(nextColor, 0.4)}`;

  fullInfo += `
    <div style="
      font-size: 15px;
      margin: 18px 15px 10px 15px;
      color: ${nextColor};
      text-shadow: ${nextGlow};
    ">
      🔜 <strong>Nächste:</strong> ${next.name} in <strong>${formatHM(minsToNext)}</strong>
    </div>
  `;
if (activeSessions.length > 0) {
  applyStatsBoxGlow(activeSessions[0].name);
}

  sessionDetailsBox.innerHTML = fullInfo;
  
}
