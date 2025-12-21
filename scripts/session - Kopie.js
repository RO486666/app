"use strict";

/* =============================================================
   🧠 Session Engine — Clean Refactor
   - Fixes: Crypto-Weekend button color, stray braces, duplicates
   - Safer DOM access, single color util, guard calls
   - Consistent styling hooks (classes + inline styles where needed)
   ============================================================= */

// ============ DOM refs (late-bound + guards) ============
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

const sessionText        = $("#sessionText");
const sessionProgressEl  = $("#sessionProgressDisplay");
const sessionInfoEl      = $("#sessionInfo");
const sessionDetailsBox  = $("#sessionDetailsBox");
const alertBox           = $("#alertBox");
const progressBar        = $("#progressBar");
const progressContainer  = $(".progress-container");

// Defensive: bail early if core elements missing
if (!sessionText || !sessionInfoEl || !sessionDetailsBox || !progressBar || !progressContainer) {
  console.warn("[session.js] Required DOM elements missing. Check HTML structure.");
}

// ============ Constants ============
const SESSION_COLORS = {
  "Sydney":           "#3388ff",
  "Tokyo":            "#00aaff",
  "London":           "#ffd700",
  "New York":         "#ff4500",
  "London Killzone":  "#ccff00",
  "New York Killzone": "#ff8800",
  "Deadzone":         "#333333",
  "Crypto":           "#9900ff"
};

const SESSIONS = [
  { name: "Sydney", start: 1380, end: 480, info: "Ruhiger Markt, geringere Liquidität, Vorbereitung auf Asien.",
    weekDaysInfo: [
      { day: "Sonntag", text: "🛠️ Vorbereitung auf neue Woche" },
      { day: "Montag", text: "🌏 Asien-Session startet – AUD/USD, NZD/USD im Fokus" },
      { day: "Mittwoch", text: "📊 Wirtschaftsdaten Australien – AUD/CAD, AUD/JPY interessant" },
      { day: "Freitag", text: "📅 Wöchentliche Analyse & Planung – AUD/NZD Moves möglich" }
    ] },
  { name: "Tokyo", start: 60, end: 600, info: "Moderate Volatilität, Fokus auf JPY/AUD/NZD, Breakouts möglich.",
    weekDaysInfo: [
      { day: "Dienstag", text: "🏦 BoJ Pressekonferenz – EUR/JPY, GBP/JPY sehr aktiv" },
      { day: "Donnerstag", text: "📈 Japan BIP-Daten – USD/JPY, CAD/JPY im Blick behalten" },
      { day: "Freitag", text: "🇺🇸 US NFP wirkt oft nach – Yen-Paare volatil: USD/JPY, GBP/JPY" }
    ] },
  { name: "London", start: 540, end: 1020, info: "Hohe Liquidität, starke Bewegungen, europäische Wirtschaftsdaten.",
    weekDaysInfo: [
      { day: "Montag", text: "📉 EU Handelsdaten – EUR/USD, EUR/JPY, DAX" },
      { day: "Dienstag", text: "🏛️ Zinsentscheidungen der EZB – EUR/USD, EUR/GBP, EUR/CHF" },
      { day: "Donnerstag", text: "📊 Inflationsdaten UK – GBP/USD, GBP/JPY, FTSE100" },
      { day: "Freitag", text: "📅 Arbeitsmarktdaten UK – GBP/USD, EUR/GBP" }
    ] },
  { name: "New York", start: 870, end: 1380, info: "Hohe Volatilität, US-Daten dominieren, Trendfortsetzungen möglich.",
    weekDaysInfo: [
      { day: "Mittwoch", text: "🏦 Fed Zinsentscheidungen – USD/JPY, EUR/USD, Gold (XAU/USD)" },
      { day: "Freitag", text: "📊 US NFP Arbeitsmarktdaten – XAU/USD, NAS100, USD/CHF" },
      { day: "Freitag", text: "📈 Wöchentliche Arbeitslosenmeldung – EUR/USD, USD/CAD" }
    ] },
  { name: "London Killzone", start: 420, end: 660, info: "Volatile Phase vor London-Open, Stop-Hunts möglich.",
    weekDaysInfo: [
      { day: "Montag", text: "⚡ Hohe Volatilität durch Marktöffnung – GBP/USD, EUR/JPY" },
      { day: "Mittwoch", text: "🔥 Breakouts oft möglich – GBP/JPY, DAX, EUR/USD" }
    ] },
  { name: "New York Killzone", start: 810, end: 1020, info: "Start der NY Session, hohe Aktivität, gute Chancen für Daytrader.",
    weekDaysInfo: [
      { day: "Dienstag", text: "⚡ Erhöhte Volatilität durch US-Daten – XAU/USD, NAS100" },
      { day: "Donnerstag", text: "🎙️ Fed Reden & Daten – USD/JPY, Gold, SPX500" }
    ] },
  { name: "Deadzone", start: 1380, end: 0, info: "Niedrige Volatilität, Seitwärtsbewegungen, Ruhephase.",
    weekDaysInfo: [ { day: "Täglich", text: "😴 Markt ruhig, kaum Bewegung – Scalping-Pause empfohlen" } ] },
  { name: "Crypto", start: 0, end: 1440, info: "Krypto läuft 24/7 – Spitzenvolumen oft bei Überschneidung mit NY & Asien.",
    weekDaysInfo: [
      { day: "Montag",   text: "🚀 Reaktion auf Wochenstart – Gap-Moves checken – BTC/USD, ETH/USD" },
      { day: "Mittwoch", text: "📉 Midweek-Reversal bei BTC häufig – BTC/USD, SOL/USDT" },
      { day: "Freitag",  text: "💸 Ausbruch vor Wochenende, dann Flat Market – ETH/USD, XRP/USD" },
      { day: "Samstag",  text: "🧘 Wenig Volumen – Fokus auf Konsolidierungen – BTC, ETH" },
      { day: "Sonntag",  text: "⏳ Pre-Move für Montag oft sichtbar – BTC/USD, LINK/USDT" }
    ] }
];

// ============ Utils ============
const pad2 = (n) => String(n).padStart(2, "0");
const formatHM = (mins) => `${pad2(Math.floor(mins / 60) % 24)}:${pad2(mins % 60)}`;

function hexToRgba(hex, alpha = 1) {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16); // ✅ fixed bug (was 0,2)
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

function getMinutesNow() {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
}

function getCurrentSessions(minNow) {
  return SESSIONS.filter((s) => {
    const start = s.start;
    const end = s.end;
    return start > end ? (minNow >= start || minNow < end) : (minNow >= start && minNow < end);
  });
}

function getMinutesToNextSession(minNow) {
  const futureStarts = SESSIONS.map((s) => s.start).filter((start) => start > minNow);
  if (futureStarts.length === 0) return SESSIONS[0].start + 1440 - minNow;
  return Math.min(...futureStarts) - minNow;
}

function updateGradientBar(colors) {
  if (!progressBar) return;
  if (colors.length === 0) {
    progressBar.style.background = "#444";
    progressBar.style.backgroundImage = "";
    return;
  }
  const svg = `
    <svg xmlns='http://www.w3.org/2000/svg' width='100%' height='100%'>
      <defs>
        <linearGradient id='g' x1='0%' y1='0%' x2='100%' y2='0%'>
          ${colors.map((c, i) => `<stop offset='${(i / (colors.length - 1)) * 100}%' stop-color='${c}'/>`).join("")}
        </linearGradient>
      </defs>
      <rect x='0' y='0' width='100%' height='100%' fill='url(#g)'/>
    </svg>`;
  const base64 = btoa(svg);
  progressBar.style.backgroundImage = `url("data:image/svg+xml;base64,${base64}")`;
}

function setCryptoBarMode(on) {
  if (!progressBar || !progressContainer) return;
  progressBar.classList.toggle("crypto-bar", on);
  progressContainer.classList.toggle("crypto-glow", on);
}

// ============ Notifications ============
const alertSound = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
function requestNotificationPermission() {
  if ("Notification" in window && Notification.permission !== "granted") {
    Notification.requestPermission().catch(() => {});
  }
}

// ============ UI helpers ============
function updateSessionTextStyle(activeSessionName) {
  if (!sessionText) return;

  // Crypto → animated gradient text style
  if (activeSessionName === "Crypto") {
    sessionText.style.background = "linear-gradient(270deg, #00ffcc, #ff00cc, #9900ff)";
    sessionText.style.backgroundSize = "200% 100%";
    sessionText.style.webkitBackgroundClip = "text";
    sessionText.style.webkitTextFillColor = "transparent";
    sessionText.classList.add("crypto-weekend");
    return;
  }

  // Normal sessions → solid color text/glow
  const color = SESSION_COLORS[activeSessionName] || "#ffffff";
  sessionText.classList.remove("crypto-weekend");
  sessionText.style.background = "";
  sessionText.style.webkitBackgroundClip = "initial";
  sessionText.style.webkitTextFillColor = "initial";
  sessionText.style.color = color;
  sessionText.style.textShadow = `0 0 2px ${color}, 0 0 6px ${hexToRgba(color, 0.35)}`;
}

function colorizeMainButtons(colors) {
  // 👉 Wenn buttons.js geladen ist → dortige Logik verwenden
  if (typeof updateTabButtonColors === "function") {
    updateTabButtonColors(colors);
    return;
  }

  // 👉 Fallback (nur wenn updateTabButtonColors nicht existiert)
  const btns = [
    document.getElementById("btn-calc-pos"),
    document.getElementById("btn-calc-dawn"),
    document.getElementById("btn-calc-taxpro")
  ].filter(Boolean);

  if (!btns.length || !colors.length) return;

  const c = colors[0]; // eine Farbe für alle

  btns.forEach((btn) => {
    if (!btn) return;

    // 🟣 Crypto = einfarbig lila
    if (c === SESSION_COLORS.Crypto || c === "#9900ff") {
      btn.style.background = c;
      btn.style.color = "#fff";
      btn.style.boxShadow = `0 0 12px ${c}`;
    } else {
      // Standardfarben
      btn.style.background = c;
      btn.style.color = (["#ffd700", "#ccff00"].includes(c)) ? "#111" : "#fff";
      btn.style.boxShadow = `0 0 10px ${c}`;
    }

    btn.style.border = "none";
    btn.style.transition = "all .3s ease";
    btn.style.animation = "glowPulse 2s ease-in-out infinite";
  });
}




function applyStatsBoxGlow(sessionName) {
  const boxes = $$(".stats-box");
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

  boxes.forEach((box) => {
    Object.values(classMap).forEach(cls => box.classList.remove(cls));
    if (sessionClass) box.classList.add(sessionClass);
  });
}

function updateBodyBackground(sessionName) {
  if (!sessionDetailsBox) return;
  const glowMap = {
    "Sydney": "radial-gradient(ellipse at bottom, rgba(0, 128, 255, 0.15) 0%, transparent 70%)",
    "Tokyo": "radial-gradient(ellipse at bottom, rgba(0, 200, 255, 0.15) 0%, transparent 70%)",
    "London": "radial-gradient(ellipse at bottom, rgba(255, 215, 0, 0.1) 0%, transparent 70%)",
    "New York": "radial-gradient(ellipse at bottom, rgba(255, 69, 0, 0.1) 0%, transparent 70%)",
    "London Killzone": "radial-gradient(ellipse at bottom, rgba(204, 255, 0, 0.15) 0%, transparent 70%)",
    "New York Killzone": "radial-gradient(ellipse at bottom, rgba(255, 136, 0, 0.15) 0%, transparent 70%)",
    "Crypto": "radial-gradient(ellipse at bottom, rgba(153, 0, 255, 0.2) 0%, transparent 70%)"
  };
  const baseColor = {
    "Sydney": "#0a0e1a",
    "Tokyo": "#0a1018",
    "London": "#1b1a0e",
    "New York": "#1a0e0e",
    "London Killzone": "#12160a",
    "New York Killzone": "#1a1408",
    "Crypto": "#1b0e1e"
  };

  sessionDetailsBox.className = "session-details-box"; // reset
  const mapClass = {
    "Sydney": "session-sydney",
    "Tokyo": "session-tokyo",
    "London": "session-london",
    "New York": "session-ny",
    "London Killzone": "session-killzone",
    "New York Killzone": "session-killzone",
    "Crypto": "session-crypto"
  }[sessionName];
  if (mapClass) sessionDetailsBox.classList.add(mapClass);

  document.body.style.setProperty("--session-glow", glowMap[sessionName] || "radial-gradient(ellipse at bottom, rgba(255,255,255,0.1) 0%, transparent 70%)");
  document.body.style.setProperty("--session-bg-color", baseColor[sessionName] || "#111");
}

// ============ Main tick ============
let lastAlertSession = null;

function updateRealTimeBar() {
  const now = new Date();
  const weekday = now.getDay(); // 0=Sonntag, 6=Samstag
  const minutes = now.getHours() * 60 + now.getMinutes();
  const hoursStr = pad2(now.getHours());
  const minsStr  = pad2(now.getMinutes());

  // Progress line width
  if (progressBar) {
    const percent = (minutes / 1439) * 100;
    progressBar.style.width = `${percent}%`;
  }

  // Crypto weekend detection
  const isCryptoWeekend = (weekday === 6) || (weekday === 0) || (weekday === 5 && minutes >= 1380);

  if (isCryptoWeekend) {
    setCryptoBarMode(true);
    if (typeof applySessionBackground === "function") applySessionBackground("Crypto", true);

    // Crypto headline + info
    if (sessionText) sessionText.textContent = `🕒 ${hoursStr}:${minsStr} | Krypto-Wochenende aktiv`;
    if (sessionInfoEl) {
      sessionInfoEl.innerHTML = `📴 Forex & Indizes geschlossen – <span class="crypto-animate"><span class="coin">🪙</span> Krypto 24/7!</span>`;
      sessionInfoEl.classList.add("crypto-weekend");
      sessionInfoEl.style.color = "#fff";
      sessionInfoEl.style.border = "1px solid rgba(0, 255, 204, 0.3)";
      sessionInfoEl.style.borderRadius = "10px";
      sessionInfoEl.style.textShadow = "0 0 4px rgba(0, 255, 204, 0.4), 0 0 8px rgba(255, 0, 204, 0.35), 0 0 14px rgba(153, 0, 255, 0.25)";
      sessionInfoEl.style.boxShadow = "0 0 8px rgba(0, 255, 204, 0.25), 0 0 18px rgba(255, 0, 204, 0.2), inset 0 0 8px rgba(0, 255, 204, 0.1)";
    }
    if (sessionProgressEl) sessionProgressEl.innerHTML = "🟢 Aktive Crypto-Session – Trade BTC, ETH & Co. jederzeit!";

    // ❗️Buttons lila färben (use buttons.js if present, else fallback)
    const cryptoColor = SESSION_COLORS["Crypto"];
    if (typeof updateTabButtonColors === "function") {
      updateTabButtonColors(["Crypto"]);
    } else {
      colorizeMainButtons([cryptoColor]);
    }

    // Weekend info box
    let weekendInfo = "";
    if (weekday === 5 && minutes >= 1380) {
      weekendInfo = `
        <strong>🪙 Krypto ist aktiv (24/7)</strong><br>
        📅 <strong>Freitagabend:</strong><br>
        • 🕖 Letzte Volatilität vor dem Wochenschluss (18–22 Uhr)<br>
        • 🔁 Take-Profits & Wochenschluss-Spikes<br>
        • 📉 BTC oft rückläufig durch Positionsschließungen<br>
        • ⚠️ Fakeouts & Liquiditätsgrabs vor der Ruhephase<br><br>
        🚀 Bereite deine Watchlist fürs Wochenende vor!
      `;
    } else if (weekday === 6) {
      weekendInfo = `
        <strong>🪙 Krypto ist aktiv (24/7)</strong><br>
        📅 <strong>Samstag:</strong><br>
        • 😴 Niedriges Volumen – kaum Institutionelle aktiv<br>
        • 🔄 Meist Seitwärtsphasen → ideal für Range-Trading<br>
        • ❄️ Impulsarme Märkte, gute Zeit für technische Analyse<br>
        • 📐 Setups vorbereiten & Trading-Journal pflegen<br><br>
        🧘 Fokus auf Klarheit statt Action – perfekter Analyse-Tag.
      `;
    } else if (weekday === 0) {
      weekendInfo = `
        <strong>🪙 Krypto ist aktiv (24/7)</strong><br>
        📅 <strong>Sonntag:</strong><br>
        • ⏳ Pre-Move-Phase startet oft ab 18–20 Uhr<br>
        • 🧠 Smart Money beginnt Positionierung für Montag<br>
        • 🪤 False Breakouts oder „Liquidity Sweeps“ typisch<br>
        • 🔥 Volumen steigt spürbar, besonders vor News-Wochen<br><br>
        🚀 Nutze den Sonntagabend für Setup-Feintuning & Ausblick!
      `;
    }
    if (sessionDetailsBox) sessionDetailsBox.innerHTML = weekendInfo;

    // Text style
    updateSessionTextStyle("Crypto");
    // Glow on boxes
    applyStatsBoxGlow("Crypto");
    updateBodyBackground("Crypto");

    return; // Do not execute weekday logic
  }

  // Weekday logic (normal)
  setCryptoBarMode(false);
  if (typeof applySessionBackground === "function") applySessionBackground(undefined, false);

  const activeSessions = getCurrentSessions(minutes);
  const nonCryptoNames = activeSessions.map(s => s.name).filter(n => n !== "Crypto");

  // Colorize buttons by active session(s)
  if (typeof updateTabButtonColors === "function") {
    updateTabButtonColors(nonCryptoNames);
  } else {
    colorizeMainButtons(nonCryptoNames.map(n => SESSION_COLORS[n] || "#666"));
  }

  // Text headline
  const activeNamesText = nonCryptoNames.length ? `| Aktive Session: ${nonCryptoNames.join(" + ")}` : "| Keine Session aktiv";
  if (sessionText) sessionText.textContent = `🕒 ${hoursStr}:${minsStr} ${activeNamesText}`;

  // Progress bar colors
  updateGradientBar(nonCryptoNames.map(n => SESSION_COLORS[n] || "#666"));

  // Info line text
  const name = activeSessions.length ? activeSessions[0].name : "";
  let infoText = "Keine aktiven Sessions – Markt wahrscheinlich ruhig.";
  if (name === "Sydney") {
    infoText = minutes >= 1380 ? "🌙 Sydney startet – ruhiger Handelsbeginn, Fokus auf AUD/NZD." :
               minutes < 180 ?   "🦘 Sydney aktiv – geringe Volatilität, Setups oft technisch." :
                                  "🌅 Späte Sydney-Phase – Übergang zu Tokyo beginnt.";
  } else if (name === "Tokyo") {
    infoText = minutes < 180 ?  "🌏 Tokyo eröffnet – erste Bewegungen durch asiatische Händler." :
               minutes < 360 ?  "🇯🇵 Asiatische Volatilität aktiv – mögliche Bewegungen bei JPY." :
                                 "🛑 Tokyo flacht ab – Fokus wechselt langsam nach Europa.";
  } else if (name === "London Killzone") {
    infoText = "⚠️ London Killzone – hohe Volatilität & starke Bewegungen möglich.";
  } else if (name === "London") {
    infoText = minutes < 720 ?  "💷 London Session – Markt in Bewegung, europäische Daten entscheidend." :
               minutes < 840 ?  "😴 Mittagliche Deadzone – Markt konsolidiert häufig, Vorsicht bei Entries." :
                                 "📈 London-Teilnehmer bleiben aktiv – Vorbereitung auf NY.";
  } else if (name === "New York Killzone") {
    infoText = "🔥 New York Killzone – starke Reaktionen auf US-News & Breakouts möglich.";
  } else if (name === "New York") {
    infoText = minutes < 1080 ? "🇺🇸 New York Session – starker US-Einfluss, Trendfortsetzungen möglich." :
               minutes < 1200 ? "📉 New York flacht ab – Markt beruhigt sich langsam." :
                                "🌃 New York Session endet – geringe Bewegung, Vorsicht bei Entries.";
  }

  if (sessionInfoEl) {
    sessionInfoEl.textContent = infoText;
    if (name && SESSION_COLORS[name]) {
      const c = SESSION_COLORS[name];
      sessionInfoEl.style.background = hexToRgba(c, 0.07);
      sessionInfoEl.style.color = c;
      sessionInfoEl.style.textShadow = `0 0 2px ${c}, 0 0 6px ${hexToRgba(c, 0.3)}`;
      sessionInfoEl.style.boxShadow = `inset 0 0 6px ${hexToRgba(c, 0.15)}`;
    } else {
      sessionInfoEl.style.background = "transparent";
      sessionInfoEl.style.color = "#ccc";
      sessionInfoEl.style.textShadow = "none";
      sessionInfoEl.style.boxShadow = "none";
    }
  }

  // Details box of current sessions
  if (sessionDetailsBox) {
    if (activeSessions.length) {
      let fullInfo = "";
      activeSessions.forEach((s) => {
        const label = s.name.includes("Killzone") ? "🔥" :
                      s.name.includes("New York") ? "🇺🇸" :
                      s.name.includes("London")   ? "💷" :
                      s.name.includes("Tokyo")    ? "🌏" :
                      s.name.includes("Sydney")   ? "🌙" :
                      s.name.includes("Crypto")   ? "🪙" : "🟡";
        const color = SESSION_COLORS[s.name] || "#0cf";
        const glow  = `0 0 5px ${color}, 0 0 12px ${hexToRgba(color, 0.5)}`;

        let weekDaysHtml = "";
        if (s.weekDaysInfo) {
          weekDaysHtml = "<ul style='margin-left:18px; margin-top:4px;'>" +
            s.weekDaysInfo.map(({day, text}) => `<li><strong style='color:${color}; text-shadow:${glow};'>${day}:</strong> ${text}</li>`).join("") +
          "</ul>";
        }

        fullInfo += `
          <strong>${label} ${s.name}</strong><br>
          📅 Start: ${formatHM(s.start)} Uhr<br>
          🕓 Ende: ${formatHM(s.end)} Uhr<br>
          ℹ️ ${s.info}
          ${weekDaysHtml}
          <hr style="border:none;border-top:1px solid #444;margin:10px 0;">
        `;
      });
      sessionDetailsBox.innerHTML = fullInfo;
    } else {
      sessionDetailsBox.innerHTML = "Keine aktive Session – Markt ist ruhig.";
    }
  }

  // Heads-up before next session
  const minutesToNext = getMinutesToNextSession(minutes);
  if (minutesToNext <= 5 && minutesToNext > 0) {
    const currentActive = sessionText ? sessionText.textContent : "";
    if (lastAlertSession !== currentActive) {
      if (typeof showAlert === "function") showAlert("⚠️ Session-Wechsel in 5 Minuten!");
      lastAlertSession = currentActive;
      if (activeSessions.length > 0 && typeof showSessionStartNotification === "function") {
        const s = activeSessions[0];
        showSessionStartNotification(s.name, s.info);
      }
    }
  } else {
    lastAlertSession = null;
  }

  // Update decorative bits
  updateSessionTextStyle(name);
  applyStatsBoxGlow(name);
  updateBodyBackground(name);
}

// ============ Day Summary (compact) – DETAILED PER DAY ============
const DAY_DETAILS = {
  "Montag": `
🔵 <strong>Montag</strong><br><br>

<strong>🕒 Sessions & Zeiten (MEZ/CEST):</strong><br>
• London: 09:00–17:00 · New York: 14:30–22:00<br>
• Killzones: London 07:00–11:00 · New York 13:30–17:00<br><br>

<strong>📈 Forex – typisches Verhalten:</strong><br>
• Wochenstart → Liquidität baut sich erst auf, Asien-Handel schwächer.<br>
• Oft Range bis London-Open, danach erste Directional Move.<br>
• EUR/GBP/JPY‑Paare reagieren auf EU/UK Morning Data & London-Flow.<br><br>

<strong>🥇 Gold (XAU/USD):</strong><br>
• Häufig zögerlicher Start; echte Impulse oft erst mit NY‑Futures (~14:30).<br>
• Montagmorgen Fakeouts an Freitagsschluss‑Levels möglich (Liquidity Sweeps).<br>
• Beobachte DXY/US10Y – inverse Korrelation zu Gold.<br><br>

<strong>🪙 Krypto:</strong><br>
• Nach Sonntag Pre‑Move oft ruhiger Beginn; BTC/ETH bilden Wochenrange.<br>
• Alts verhalten, Fokus auf Struktur/HTF Zonen (H4/D1).<br><br>

<strong>🗞️ News/Hotspots:</strong><br>
• EU/UK Sentiment/PMIs → London Impuls.<br>
• US‑Agenda meist leicht → NY kann flatterig sein.<br><br>

<strong>🎯 Trade‑Ideen:</strong><br>
• Range‑Break nach London‑Open, Retest‑Entry.<br>
• XAUUSD: NY Killzone für Impuls, keine Overtrades am Morgen.<br>
`,

  "Dienstag": `
🟢 <strong>Dienstag</strong><br><br>

<strong>🕒 Sessions & Zeiten:</strong><br>
• London 09:00–17:00 · New York 14:30–22:00 · Killzones wie Montag<br><br>

<strong>📈 Forex – typisches Verhalten:</strong><br>
• „Trend‑Validation Day“: Klarere Struktur als Montag, mehr Follow‑Through.<br>
• EUR/USD, GBP/USD und JPY‑Kreuze liefern oft saubere Intraday‑Waves.<br><br>

<strong>🥇 Gold (XAU/USD):</strong><br>
• Meist sauberere NY‑Moves als Montag, besonders bei Daten/Fed‑Speak.<br>
• London‑Fake → NY‑Continuation ist ein klassisches Pattern.<br><br>

<strong>🪙 Krypto:</strong><br>
• Risiko‑On/Off in Equities färbt ab; Alts reagieren stärker als BTC.<br>
• Breakout + Retest Setups auf M15‑H1 gut planbar.<br><br>

<strong>🗞️ News/Hotspots:</strong><br>
• EU/UK Arbeits-/Inflationsdaten möglich · US‑Second‑tier Data.<br><br>

<strong>🎯 Trade‑Ideen:</strong><br>
• London Impuls → Pullback → NY Fortsetzung.<br>
• XAUUSD: NY‑Open Momentum nach Dollar‑Move antizipieren.<br>
`,

  "Mittwoch": `
🟡 <strong>Mittwoch</strong><br><br>

<strong>🕒 Sessions & Zeiten:</strong><br>
• London 09:00–17:00 · New York 14:30–22:00<br><br>

<strong>📈 Forex – typisches Verhalten:</strong><br>
• <em>Midweek Reversal</em> häufig: Wochenhigh/‑low werden angetestet/gesweept.<br>
• Bei FOMC/Fed‑Minutes: erhöhte USD‑Volatilität, Spikes & Mean Reversion.<br><br>

<strong>🥇 Gold (XAU/USD):</strong><br>
• Starke Reaktionen auf US‑Renditen/Realzinsen; Whipsaws möglich.<br>
• Erstreaktion handeln? Nur mit klaren Zonen; sonst Retest abwarten.<br><br>

<strong>🪙 Krypto:</strong><br>
• BTC‑Richtung oft sichtbar (oder Fake‑Move). Liquiditätsgrabs an Weekly Levels.<br>
• Funding/Perp‑Bias checken, um Squeezes nicht zu erwischen.<br><br>

<strong>🗞️ News/Hotspots:</strong><br>
• OPEC/Öl‑Daten (Einfluss auf risk sentiment) · US‑Crude 16:30.<br>
• FOMC/Fed‑Speak oft mittwochs – Dollar/Gold im Fokus.<br><br>

<strong>🎯 Trade‑Ideen:</strong><br>
• Reversal‑Setups an Wochenniveaus · Killzone‑Breakouts mit schneller Absicherung.<br>
• XAUUSD: Erst Impuls → dann strukturierten Retest handeln.<br>
`,

  "Donnerstag": `
🟠 <strong>Donnerstag</strong><br><br>

<strong>🕒 Sessions & Zeiten:</strong><br>
• Starke NY‑Killzone (13:30–17:00) durch viele US‑Releases.<br><br>

<strong>📈 Forex – typisches Verhalten:</strong><br>
• Momentum‑Tag: CPI/PCE/GDP/Claims treiben USD‑Paare & Indizes.<br>
• Saubere Trends möglich; Pullbacks werden gekauft/verkauft.<br><br>

<strong>🥇 Gold (XAU/USD):</strong><br>
• News‑getriebene Impulse; DXY‑Spike → Gegenrichtung bei Gold.<br>
• Trendtage: 1–2 gute Entries reichen, nicht „chasing“.<br><br>

<strong>🪙 Krypto:</strong><br>
• „Catch‑up“ zu TradFi‑Risk‑Moves; Alts zeigen Beta (stärker als BTC).<br>
• Afternoon‑Continuation häufig, wenn US‑Aktien trendig sind.<br><br>

<strong>🗞️ News/Hotspots:</strong><br>
• US Kern‑Inflation/PCE · GDP · Jobless Claims · Fed‑Speaker.<br><br>

<strong>🎯 Trade‑Ideen:</strong><br>
• Pre‑News Plan: Szenarien + Levels; nach Erstimpuls den Retest handeln.<br>
• XAUUSD: NY‑Trend bis 18–19 Uhr möglich – Teilgewinne staffeln.<br>
`,

  "Freitag": `
🔴 <strong>Freitag</strong><br><br>

<strong>🕒 Sessions & Zeiten:</strong><br>
• London 09:00–14:00 aktiv · NY früh stark, später Positionsabbau.<br><br>

<strong>📈 Forex – typisches Verhalten:</strong><br>
• Vormittag letzte klare Moves, ab Mittag oft „fade“. NFP‑Freitage = Ausnahme (14:30).<br>
• Gewinnmitnahmen dominieren; Wicks/Stop‑Hunts nahe Wochenlevels.<br><br>

<strong>🥇 Gold (XAU/USD):</strong><br>
• Früh volatil, nach US‑Mittag häufig Ausdünnung/Mean Reversion.<br>
• Wochenclose‑Magnet: Levels vom Montag/Freitagsschluss sind wichtig.<br><br>

<strong>🪙 Krypto:</strong><br>
• Abends Pre‑Move fürs Wochenende: BTC‑Ausbrüche oder Liquiditätsgrabs.<br>
• Risiko: dünneres Orderbook, schnellere Squeezes.<br><br>

<strong>🗞️ News/Hotspots:</strong><br>
• NFP/Jobs (falls Termin) · PMI/Verbraucherstimmung · Fed‑Talk.<br><br>

<strong>🎯 Trade‑Ideen:</strong><br>
• Früh handeln, später reduzieren. Keine „Last‑Minute“ Revenge Trades.<br>
• XAUUSD: Nach News Retest‑Entry, freitags aggressives Trailing vermeiden.<br>
`,

  "Samstag": `
📴 <strong>Samstag</strong><br><br>

<strong>📈 Forex:</strong> geschlossen (Interbankenmarkt).<br><br>

<strong>🥇 Gold (XAU/USD):</strong><br>
• Kein Spot‑Handel; Analyse HTF (D1/W1) und Levels für nächste Woche vorbereiten.<br><br>

<strong>🪙 Krypto:</strong><br>
• Geringe Liquidität/Volumen → Range‑Trading, Mean‑Reversion‑Setups.<br>
• Gefahr von wickigen Moves auf Alts; BTC/ETH meist ruhiger.<br><br>

<strong>🧰 To‑Do:</strong><br>
• Journal updaten · Statistiken · Watchlist & Alerts für Sonntagabend/Montag setzen.<br>
`,

  "Sonntag": `
📴 <strong>Sonntag</strong><br><br>

<strong>📈 Forex:</strong> geschlossen – aber Vorbereitungs‑Tag.<br><br>

<strong>🥇 Gold (XAU/USD):</strong><br>
• Keine Spot‑Ausführung; HTF‑Bias & Key‑Zones festlegen (Vorwoche/Monats‑Open).<br><br>

<strong>🪙 Krypto:</strong><br>
• Abends (18–22 Uhr) häufiger Pre‑Move für Montag (BTC/ETH).<br>
• Sweeps an Wochenrange‑Grenzen → Montag wird oft in diese Richtung eröffnet.<br><br>

<strong>🧰 To‑Do:</strong><br>
• Wirtschaftskalender der Woche checken (CPI, PCE, GDP, Zentralbanken).<br>
• Alerts an HTF‑Levels · Risiko‑Plan + erste Szenarien skizzieren.<br>
`
};




function updateDaySummary() {
  const el = $("#daySummary");
  const details = $("#dayDetails");
  if (!el) return;

  const days = ["Sonntag","Montag","Dienstag","Mittwoch","Donnerstag","Freitag","Samstag"];
  const now = new Date();
  const dName = days[now.getDay()];
  const minutesNow = now.getHours() * 60 + now.getMinutes();
  const isWeekendLike =
    (dName === "Samstag") ||
    (dName === "Sonntag") ||
    (dName === "Freitag" && minutesNow >= 1380);

  // Text
  el.textContent = `🗓️ ${dName} — Tip: ` + (
    dName === "Montag"     ? "Allmählicher Volumenaufbau." :
    dName === "Dienstag"   ? "Saubere Struktur traden." :
    dName === "Mittwoch"   ? "Reversal-Gefahr beachten." :
    dName === "Donnerstag" ? "News & Momentum nutzen." :
    dName === "Freitag"    ? "Gewinne sichern, kein FOMO." :
    dName === "Samstag"    ? "Analyse & Vorbereitung." :
                              "Pre-Move im Blick behalten."
  );

  if (isWeekendLike) el.classList.add("crypto-weekend"); else el.classList.remove("crypto-weekend");

  // 🎯 dominante Session bestimmen
  const weekday = now.getDay(); // 0=So, 6=Sa
  const isCryptoWeekend = (weekday === 6) || (weekday === 0) || (weekday === 5 && minutesNow >= 1380);

  let active = [];
  if (typeof getCurrentSessions === "function") {
    active = getCurrentSessions(minutesNow);
  } else if (Array.isArray(sessions)) {
    active = sessions.filter(s => {
      return s.start > s.end
        ? minutesNow >= s.start || minutesNow < s.end
        : minutesNow >= s.start && minutesNow < s.end;
    });
  }

  const dominant = isCryptoWeekend
    ? { name: "Crypto" }
    : (active.find(s => s.name !== "Crypto") || active[0] || { name: "London" });

  // 🎨 Farbe holen (ohne Hardcode „London“)
  const c = (SESSION_COLORS && SESSION_COLORS[dominant?.name]) || "#00ffcc";

  // Styles wie zuvor
  el.style.background = hexToRgba(c, 0.12);
  el.style.color = c;
  el.style.border = `1px solid ${hexToRgba(c, 0.5)}`;
  el.style.boxShadow = `0 0 8px ${hexToRgba(c, 0.5)}`;
  el.style.textShadow = `0 0 3px ${hexToRgba(c, .7)}`;
  el.style.cursor = "pointer";

  // Klick-Details
  el.onclick = () => {
    if (!details) return;
    const raw = DAY_DETAILS[dName] || "📆 Keine Details verfügbar.";
    const wrap = `
      <div style="padding:16px;margin:15px;border-left:4px solid ${c};border-radius:10px;background:rgba(255,255,255,0.02);box-shadow:inset 0 0 8px ${hexToRgba(c, 0.3)};color:#ccc;line-height:1.6;font-size:14px;">
        <div style="font-size:17px;font-weight:bold;color:${c};text-shadow:0 0 5px ${c};margin-bottom:8px;">📅 ${dName}</div>
        <div style="color:#ccc;">${raw}</div>
      </div>`;
    const show = details.style.display === "block";
    details.style.display = show ? "none" : "block";
    if (!show) details.innerHTML = wrap;
  };
}




// ============ Event wiring ============
if (sessionText && sessionDetailsBox) {
  sessionText.addEventListener("click", () => {
    const visible = sessionDetailsBox.style.display === "block";
    sessionDetailsBox.style.display = visible ? "none" : "block";
  });
}

window.addEventListener("load", () => {
  requestNotificationPermission();
  updateDaySummary();
  updateRealTimeBar();
  // keep details fresh while open
  setInterval(() => {
    updateRealTimeBar();
    const open = sessionDetailsBox && sessionDetailsBox.style.display === "block";
    if (open) updateDaySummary();
  }, 30_000);
});
