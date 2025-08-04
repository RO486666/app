const sessionText = document.getElementById("sessionText");
const sessionProgressEl = document.getElementById("sessionProgressDisplay");
const sessionInfoEl = document.getElementById("sessionInfo");
const sessionDetailsBox = document.getElementById("sessionDetailsBox");
const alertBox = document.getElementById("alertBox");
const progressBar = document.getElementById("progressBar");
const progressContainer = document.querySelector(".progress-container");

sessionText.addEventListener("click", () => {
  const visible = sessionDetailsBox.style.display === "block";
  sessionDetailsBox.style.display = visible ? "none" : "block";

  if (!visible) {
    const minutes = getMinutesNow();
    const activeSessions = getCurrentSessions(minutes);

    let fullInfo = "";

    // 🔹 Headline
    fullInfo += `
      <div style="
        font-size: 18px;
        font-weight: bold;
        padding: 10px 15px;
        background: linear-gradient(to right, #222, #111);
        border-bottom: 1px solid #333;
        margin-bottom: 10px;
        letter-spacing: 1px;
      ">
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

    const name = activeSessions.length > 0 ? activeSessions[0].name : "";
if (name) {
  updateBodyBackground(name);
  manualSessionOverride = name; // optional, wenn du später resetten willst
}

sessionDetailsBox.innerHTML = fullInfo;

  }
});





function formatHM(mins) {
  const h = Math.floor(mins / 60) % 24;
  const m = mins % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

const sessionColors = {
  Sydney: "#3388ff",
  Tokyo: "#00aaff",
  London: "#ffd700",
  "New York": "#ff4500",
  "London Killzone": "#ccff00",
  "New York Killzone": "#ff8800",
  Deadzone: "#333",
  Crypto: "#9900ff"  // 🔥 Jetzt mit Farbe!
};


const sessions = [
  {
    name: "Sydney",
    start: 1380,
    end: 480,
    info: "Ruhiger Markt, geringere Liquidität, Vorbereitung auf Asien.",
    weekDaysInfo: [
      { day: "Sonntag", text: "🛠️ Vorbereitung auf neue Woche" },
      { day: "Montag", text: "🌏 Asien-Session startet – AUD/USD, NZD/USD im Fokus" },
      { day: "Mittwoch", text: "📊 Wirtschaftsdaten Australien – AUD/CAD, AUD/JPY interessant" },
      { day: "Freitag", text: "📅 Wöchentliche Analyse & Planung – AUD/NZD Moves möglich" }
    ],
  },
  {
    name: "Tokyo",
    start: 60,
    end: 600,
    info: "Moderate Volatilität, Fokus auf JPY/AUD/NZD, Breakouts möglich.",
    weekDaysInfo: [
      { day: "Dienstag", text: "🏦 BoJ Pressekonferenz – EUR/JPY, GBP/JPY sehr aktiv" },
      { day: "Donnerstag", text: "📈 Japan BIP-Daten – USD/JPY, CAD/JPY im Blick behalten" },
      { day: "Freitag", text: "🇺🇸 US NFP wirkt oft nach – Yen-Paare volatil: USD/JPY, GBP/JPY" }
    ],
  },
  {
    name: "London",
    start: 540,
    end: 1020,
    info: "Hohe Liquidität, starke Bewegungen, europäische Wirtschaftsdaten.",
    weekDaysInfo: [
      { day: "Montag", text: "📉 EU Handelsdaten – EUR/USD, EUR/JPY, DAX" },
      { day: "Dienstag", text: "🏛️ Zinsentscheidungen der EZB – EUR/USD, EUR/GBP, EUR/CHF" },
      { day: "Donnerstag", text: "📊 Inflationsdaten UK – GBP/USD, GBP/JPY, FTSE100" },
      { day: "Freitag", text: "📅 Arbeitsmarktdaten UK – GBP/USD, EUR/GBP" }
    ],
  },
  {
    name: "New York",
    start: 870,
    end: 1380,
    info: "Hohe Volatilität, US-Daten dominieren, Trendfortsetzungen möglich.",
    weekDaysInfo: [
      { day: "Mittwoch", text: "🏦 Fed Zinsentscheidungen – USD/JPY, EUR/USD, Gold (XAU/USD)" },
      { day: "Freitag", text: "📊 US NFP Arbeitsmarktdaten – XAU/USD, NAS100, USD/CHF" },
      { day: "Freitag", text: "📈 Wöchentliche Arbeitslosenmeldung – EUR/USD, USD/CAD" }
    ],
  },
  {
    name: "London Killzone",
    start: 420,
    end: 660,
    info: "Volatile Phase vor London-Open, Stop-Hunts möglich.",
    weekDaysInfo: [
      { day: "Montag", text: "⚡ Hohe Volatilität durch Marktöffnung – GBP/USD, EUR/JPY" },
      { day: "Mittwoch", text: "🔥 Breakouts oft möglich – GBP/JPY, DAX, EUR/USD" }
    ],
  },
  {
    name: "New York Killzone",
    start: 810,
    end: 1020,
    info: "Start der NY Session, hohe Aktivität, gute Chancen für Daytrader.",
    weekDaysInfo: [
      { day: "Dienstag", text: "⚡ Erhöhte Volatilität durch US-Daten – XAU/USD, NAS100" },
      { day: "Donnerstag", text: "🎙️ Fed Reden & Daten – USD/JPY, Gold, SPX500" }
    ],
  },
  {
    name: "Deadzone",
    start: 1380,
    end: 0,
    info: "Niedrige Volatilität, Seitwärtsbewegungen, Ruhephase.",
    weekDaysInfo: [
      { day: "Täglich", text: "😴 Markt ruhig, kaum Bewegung – Scalping-Pause empfohlen" }
    ],
  },
  {
    name: "Crypto",
    start: 0,
    end: 1440,
    info: "Krypto läuft 24/7 – Spitzenvolumen oft bei Überschneidung mit NY & Asien.",
    weekDaysInfo: [
      { day: "Montag", text: "🚀 Reaktion auf Wochenstart – Gap-Moves checken – BTC/USD, ETH/USD" },
      { day: "Mittwoch", text: "📉 Midweek-Reversal bei BTC häufig – BTC/USD, SOL/USDT" },
      { day: "Freitag", text: "💸 Ausbruch vor Wochenende, dann Flat Market – ETH/USD, XRP/USD" },
      { day: "Samstag", text: "🧘 Wenig Volumen – Fokus auf Konsolidierungen – BTC, ETH" },
      { day: "Sonntag", text: "⏳ Pre-Move für Montag oft sichtbar – BTC/USD, LINK/USDT" }
    ],
  }
];




let lastAlertSession = null;

function getMinutesNow() {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
}

function getCurrentSessions(minNow) {
  return sessions.filter((s) => {
    const start = s.start;
    const end = s.end;
    if (start > end) {
      return minNow >= start || minNow < end;
    } else {
      return minNow >= start && minNow < end;
    }
  });
}

function updateGradientBar(colors) {
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

function hexToRgba(hex, alpha) {
  hex = hex.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

function getMinutesToNextSession(minNow) {
  const futureStarts = sessions.map((s) => s.start).filter((start) => start > minNow);
  if (futureStarts.length === 0) return sessions[0].start + 1440 - minNow;
  return Math.min(...futureStarts) - minNow;
}

const alertSound = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');

function requestNotificationPermission() {
  if ("Notification" in window && Notification.permission !== "granted") {
    Notification.requestPermission().then(permission => {
      console.log("🔐 Notification permission:", permission);
    });
  }
}



function updateRealTimeBar() {
	
  const now = new Date();
  const weekday = now.getDay(); // Sonntag = 0, Samstag = 6
  const hours = String(now.getHours()).padStart(2, "0");
  const mins = String(now.getMinutes()).padStart(2, "0");
  const minutes = now.getHours() * 60 + now.getMinutes();
  const percent = (minutes / 1439) * 100;

  // Fortschrittsbalken immer aktualisieren
  progressBar.style.width = `${percent}%`;
progressBar.style.background = "linear-gradient(270deg, #00ffcc, #ff00cc, #9900ff)";
progressBar.style.animation = "cryptoBarShift 8s linear infinite";
progressContainer.style.boxShadow = "0 0 14px 4px rgba(153, 0, 255, 0.4)";

  

  // ✅ Definiere echten Krypto-Wochenende-Zeitraum
  const isCryptoWeekend =
    (weekday === 6) || // Samstag
    (weekday === 0) || // Sonntag
    (weekday === 5 && minutes >= 1380); // Freitag ab 23:00

  if (isCryptoWeekend) {
    sessionText.textContent = `🕒 ${hours}:${mins} | Krypto-Wochenende aktiv`;
    sessionInfoEl.innerHTML = `
      📴 Forex & Indizes geschlossen –
      <span class="crypto-animate">
        <span class="coin">🪙</span> Krypto 24/7!
      </span>
    `;
    sessionProgressEl.innerHTML = "🟢 Aktive Crypto-Session – Trade BTC, ETH & Co. jederzeit!";
sessionInfoEl.style.background = "linear-gradient(135deg, rgba(255,0,204,0.15), rgba(0,255,255,0.15))";
sessionInfoEl.style.textShadow = "0 0 4px #ff00cc, 0 0 8px #00ffff";
sessionInfoEl.style.boxShadow = "inset 0 0 10px rgba(153, 0, 255, 0.25), 0 0 6px rgba(0, 255, 255, 0.15)";
sessionInfoEl.style.color = "#ffffff";


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

    sessionDetailsBox.innerHTML = weekendInfo;
    return; // 👉 Verhindert normale Session-Anzeige
  }


  // ⏬ Werktag-Session-Logik
  const activeSessions = getCurrentSessions(minutes);
  const names = activeSessions
  .map(s => s.name)
  .filter(n => n !== "Crypto"); // 🔥 Crypto wird vom Balken ausgeschlossen
updateTabButtonColors(names);
  const activeNames = names.length > 0 ? `| Aktive Session: ${names.join(" + ")}` : "| Keine Session aktiv";
  sessionText.textContent = `🕒 ${hours}:${mins} ${activeNames}`;

  const colors = names.map(n => sessionColors[n] || "#666");
  updateGradientBar(colors);
  if (document.getElementById("sessionProgressDisplay")) {
  showSessionProgress(activeSessions, minutes);
}


  progressContainer.style.boxShadow = colors.length > 0
    ? `0 0 12px 6px ${hexToRgba(colors[0], 0.6)}`
    : "0 0 12px 6px rgba(0,0,0,0)";

  const name = activeSessions.length > 0 ? activeSessions[0].name : "";
  let infoText = "Keine aktiven Sessions – Markt wahrscheinlich ruhig.";
  

if (name === "Sydney") {
  infoText = minutes >= 1380 ? "🌙 Sydney startet – ruhiger Handelsbeginn, Fokus auf AUD/NZD." :
              minutes < 180 ? "🦘 Sydney aktiv – geringe Volatilität, Setups oft technisch." :
              "🌅 Späte Sydney-Phase – Übergang zu Tokyo beginnt.";
} else if (name === "Tokyo") {
    infoText = minutes < 180 ? "🌏 Tokyo eröffnet – erste Bewegungen durch asiatische Händler." :
                minutes < 360 ? "🇯🇵 Asiatische Volatilität aktiv – mögliche Bewegungen bei JPY." :
                "🛑 Tokyo flacht ab – Fokus wechselt langsam nach Europa.";
  } else if (name === "London Killzone") {
    infoText = "⚠️ London Killzone – hohe Volatilität & starke Bewegungen möglich.";
	
  } else if (name === "London") {
    infoText = minutes < 720 ? "💷 London Session – Markt in Bewegung, europäische Daten entscheidend." :
                minutes < 840 ? "😴 Mittagliche Deadzone – Markt konsolidiert häufig, Vorsicht bei Entries." :
                "📈 London-Teilnehmer bleiben aktiv – Vorbereitung auf NY.";
  } else if (name === "New York Killzone") {
    infoText = "🔥 New York Killzone – starke Reaktionen auf US-News & Breakouts möglich.";
  } else if (name === "New York") {
    infoText = minutes < 1080 ? "🇺🇸 New York Session – starker US-Einfluss, Trendfortsetzungen möglich." :
                minutes < 1200 ? "📉 New York flacht ab – Markt beruhigt sich langsam." :
                "🌃 New York Session endet – geringe Bewegung, Vorsicht bei Entries.";
  } else if (name === "Crypto") {
    if (weekday === 6) {
      infoText = "🧘 Samstag – ruhige Konsolidierungen, optimal für Range-Trading.";
    } else if (weekday === 0) {
      infoText = minutes < 1080 ? "😴 Sonntagvormittag – flacher Markt, aber Pre-Move kann sich aufbauen." :
                  "⏳ Sonntagabend – mögliche Pre-Moves vor dem Forex-Start.";
    } else if (weekday === 5 && minutes >= 1080) {
      infoText = "💸 Freitagabend – letzte Volatilität, oft BTC-Ausbrüche vor dem Wochenende.";
    } else {
      infoText = "🪙 Krypto läuft 24/7 – typischer Fokus: BTC/ETH & News-getriebene Altcoins.";
    }
  } else if (minutes >= 720 && minutes < 840) {
    infoText = "😴 Mittagliche Deadzone – Markt konsolidiert häufig, Vorsicht bei Entries.";
 } else if (minutes >= 1380 || minutes < 60) {
  if (activeSessions.length === 0) {
    infoText = "🌙 Nacht-Deadzone – Markt ist extrem ruhig, keine relevanten Bewegungen.";
  }
}

updateBodyBackground(name);
  sessionInfoEl.textContent = infoText;

  // 📋 Aktive Session-Details + Wochentagstexte
  if (activeSessions.length > 0) {
    let fullInfo = "";

    activeSessions.forEach(s => {
      let weekDaysHtml = "";
      if (s.weekDaysInfo) {
        weekDaysHtml = "<ul style='margin-left:18px; margin-top:4px;'>";
        s.weekDaysInfo.forEach(({ day, text }) => {
          weekDaysHtml += `<li><strong>${day}:</strong> ${text}</li>`;
        });
        weekDaysHtml += "</ul>";
      }

      const label = s.name.includes("Killzone") ? "🔥" :
                    s.name.includes("New York") ? "🇺🇸" :
                    s.name.includes("London") ? "💷" :
                    s.name.includes("Tokyo") ? "🌏" :
                    s.name.includes("Sydney") ? "🌙" :
                    s.name.includes("Crypto") ? "🪙" : "🟡";

      fullInfo += `
        <strong>${label} ${s.name}</strong><br>
        📅 Start: ${formatHM(s.start)} Uhr<br>
        🕓 Ende: ${formatHM(s.end)} Uhr<br>
        ℹ️ ${s.info}
        ${weekDaysHtml}
        <hr style="border: none; border-top: 1px solid #444; margin: 10px 0;">
      `;
    });

    sessionDetailsBox.innerHTML = fullInfo;
  } else {
    sessionDetailsBox.innerHTML = "Keine aktive Session – Markt ist ruhig.";
  }

  // ⏰ Session-Wechsel-Warnung
  const minutesToNext = getMinutesToNextSession(minutes);
  if (minutesToNext <= 5 && minutesToNext > 0) {
    const currentActive = sessionText.textContent;
    if (lastAlertSession !== currentActive) {
      showAlert(`⚠️ Session-Wechsel in 5 Minuten!`);
      lastAlertSession = currentActive;

      if (activeSessions.length > 0) {
        const s = activeSessions[0];
        showSessionStartNotification(s.name, s.info);
      }
    }
  } else {
    lastAlertSession = null;
  }
// ✅ Nur setzen, wenn noch nichts drinsteht (Backup)
if (!sessionInfoEl.innerHTML.trim()) {
  sessionInfoEl.textContent = infoText;
}


// 🎨 Farbe aus aktiver Session übernehmen
if (sessionColors[name]) {
  const infoColor = sessionColors[name];
  sessionInfoEl.style.background = hexToRgba(infoColor, 0.07);
  sessionInfoEl.style.color = infoColor;
  sessionInfoEl.style.textShadow = `0 0 2px ${infoColor}, 0 0 6px ${hexToRgba(infoColor, 0.3)}`;
  sessionInfoEl.style.boxShadow = `inset 0 0 6px ${hexToRgba(infoColor, 0.15)}`;
} else {
  // Standard-Fallback
  sessionInfoEl.style.background = "transparent";
  sessionInfoEl.style.color = "#ccc";
  sessionInfoEl.style.textShadow = "none";
  sessionInfoEl.style.boxShadow = "none";
}

}



function updateDaySummary() {
  const days = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];
  const infos = {
    "Montag": `
🚀 Start in die Woche – neue Impulse, frische Trends möglich.
🪙 Krypto oft ruhig nach Sonntag – Fokus auf BTC-Reaktion.
    `,
    "Dienstag": `
📈 Trend-Fortsetzung oder technische Korrekturen im Forex.
🪙 BTC & Altcoins reagieren oft auf Marktstimmung.
    `,
    "Mittwoch": `
⚠️ Midweek-Reversal möglich – Vorsicht bei Trendwechseln.
🪙 BTC häufig impulsiv – Fakeouts nicht selten.
    `,
    "Donnerstag": `
📊 News-Donnerstag – viele Wirtschaftsreleases.
🪙 Volatile Altcoins – gute Chancen für Breakouts.
    `,
    "Freitag": `
📅 Wochenabschluss – Gewinne sichern, keine Paniktrades.
🪙 Abends oft BTC-Volatilität vor dem Krypto-Wochenende.
    `,
    "Samstag": `
📴 Forex geschlossen – Markt schläft.
🪙 Nur Krypto aktiv – ideale Zeit für Range-Trading & Analyse.
    `,
    "Sonntag": `
🛠️ Vorbereitung auf neue Woche – Forex inaktiv.
🪙 BTC Pre-Move oft ab 18–20 Uhr – Setup planen!
    `
  };


  const now = new Date();
  const dayIndex = now.getDay();
  const dayName = days[dayIndex];
  const info = infos[dayName] || "📆 Trading-Tag";

  const el = document.getElementById("daySummary");
  el.textContent = `🗓️ ${dayName} – ${info}`;
}
function getSessionColor(sessionName) {
  const sessionColors = {
    "London": "#FFD700",
    "New York": "#FF4500",
    "Tokyo": "#00c8ff",
    "Sydney": "#0070ff",
    "Crypto": "#9900ff"
  };
  return sessionColors[sessionName] || "#0cf";
}

function hexToRgba(hex, opacity) {
  const bigint = parseInt(hex.replace("#", ""), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

document.addEventListener("DOMContentLoaded", () => {
  const daySummaryEl = document.getElementById("daySummary");
  const dayDetailsEl = document.getElementById("dayDetails");
const dayDetailsMap = {
  "Montag": `
🔵 <strong>Montag</strong><br><br>
<strong>📌 Setup:</strong><br>
Wochenstart – noch keine klare Richtung. Fokus auf erste Liquiditätsreaktionen.<br><br>

<strong>✅ Strategie:</strong><br>
Vorsichtiger Einstieg nach London-Open (09:00–10:00 Uhr)<br><br>

<strong>🕓 Marktverhalten:</strong><br>
Volumen steigt langsam an – viele Trader warten auf Dienstag.<br><br>

<strong>📊 Wirtschaftsdaten:</strong><br>
<ul>
  <li>🇪🇺 EU-Handelsdaten, Sentiment-Indikatoren</li>
  <li>💬 Kaum US-Daten – NY-Session eher träge</li>
</ul><br>

<strong>🧠 Mentaler Fokus:</strong><br>
Geduldig bleiben – erste Impulse beobachten.<br><br>

<strong>🧾 To-do am Montag:</strong><br>
<ul>
  <li>📅 Wochenziele notieren</li>
  <li>📈 H1/H4 Bias eintragen</li>
</ul><br>

<strong>🪙 Krypto-Notiz:</strong><br>
BTC reagiert oft träge nach dem Wochenende – Strukturaufbau bis Montagabend.<br>
ETH/BTC-Paare zeigen erste Signale für Volatilität der Woche.
`,

  "Dienstag": `
🟢 <strong>Dienstag</strong><br><br>
<strong>📌 Setup:</strong><br>
Intraday-Trading meist am klarsten – oft Trendfortsetzung oder Retest.<br><br>

<strong>✅ Strategie:</strong><br>
Nutze saubere Marktstruktur → Breakouts + Retest möglich.<br><br>

<strong>🕓 Marktverhalten:</strong><br>
Konstant – London & NY liefern gute Bewegungen.<br><br>

<strong>📊 Wirtschaftsdaten:</strong><br>
<ul>
  <li>🇪🇺 EZB oder UK Reden möglich</li>
  <li>🇺🇸 US-Einstiegsdaten</li>
</ul><br>

<strong>🧠 Mentaler Fokus:</strong><br>
Keine Hektik – Struktur traden.<br><br>

<strong>🧾 To-do am Dienstag:</strong><br>
<ul>
  <li>⚙️ Trade-Log abgleichen</li>
  <li>📓 Swing-Kandidaten markieren</li>
</ul><br>

<strong>🪙 Krypto-Notiz:</strong><br>
BTC/ETH ziehen meist am Dienstag an – viele Altcoins folgen.<br>
Guter Tag für FVG/Breaker-Entry in Krypto.
`,

  "Mittwoch": `
🟡 <strong>Mittwoch</strong><br><br>
<strong>📌 Setup:</strong><br>
Midweek-Reversal – viele Fehlausbrüche möglich.<br><br>

<strong>✅ Strategie:</strong><br>
Reversal-Potenziale beachten, Killzones gezielt handeln.<br><br>

<strong>🕓 Marktverhalten:</strong><br>
Volatilität steigt – Intraday-Highs/Lows werden geholt.<br><br>

<strong>📊 Wirtschaftsdaten:</strong><br>
<ul>
  <li>🏦 FOMC/Fed Minutes</li>
  <li>🇪🇺 EU/UK Inflationsdaten</li>
</ul><br>

<strong>🧠 Mentaler Fokus:</strong><br>
Flexibel bleiben – Bias kann kippen.<br><br>

<strong>🧾 To-do am Mittwoch:</strong><br>
<ul>
  <li>📈 Midweek-Revue</li>
</ul><br>

<strong>🪙 Krypto-Notiz:</strong><br>
BTC macht oft genau am Mittwoch seine Wochenrichtung klar oder Fake-Move – Fokus auf Liquiditätszonen.
`,

  "Donnerstag": `
🟠 <strong>Donnerstag</strong><br><br>
<strong>📌 Setup:</strong><br>
Momentum-Tag – viele Impulse durch News.<br><br>

<strong>✅ Strategie:</strong><br>
NY-Killzone aktiv handeln – Fokus auf USD, Gold, NAS100.<br><br>

<strong>🕓 Marktverhalten:</strong><br>
London & NY klar – guter Trend-Tag.<br><br>

<strong>📊 Wirtschaftsdaten:</strong><br>
<ul>
  <li>🇺🇸 GDP, PCE, CPI</li>
</ul><br>

<strong>🧠 Mentaler Fokus:</strong><br>
Mutig, aber sauber – Reaktionen abwarten.<br><br>

<strong>🧾 To-do am Donnerstag:</strong><br>
<ul>
  <li>🧠 Gewinne sichern</li>
</ul><br>

<strong>🪙 Krypto-Notiz:</strong><br>
Donnerstag ist oft der „Catch-up-Tag“ für Altcoins – hohe Dynamik bei Krypto-Volumen im NY-Overlap.
`,

  "Freitag": `
🔴 <strong>Freitag</strong><br><br>
<strong>📌 Setup:</strong><br>
Scalping & Intraday – große Bewegungen meist vorbei.<br><br>

<strong>✅ Strategie:</strong><br>
Nur Liquiditätsjagden handeln – keine blind Breakouts.<br><br>

<strong>🕓 Marktverhalten:</strong><br>
Ruhiger ab 13:00 Uhr – Positionsschließung dominiert.<br><br>

<strong>📊 Wirtschaftsdaten:</strong><br>
<ul>
  <li>📈 US-Arbeitsmarktdaten (oft 14:30 Uhr)</li>
</ul><br>

<strong>🧠 Mentaler Fokus:</strong><br>
Kein FOMO, kein Revenge-Trading.<br><br>

<strong>🧾 To-do am Freitag:</strong><br>
<ul>
  <li>📊 Wochenstatistik eintragen</li>
</ul><br>

<strong>🪙 Krypto-Notiz:</strong><br>
Ab 18:00 Uhr: BTC beginnt Pre-Move für Wochenende.<br>
BTC/ETH brechen oft vor dem „Krypto-Samstag“ aus – Watchlist ready machen.
`,

  "Samstag": `
📴 <strong>Samstag</strong><br><br>
Kein Handel in Forex – aber Krypto läuft.<br><br>

<strong>🪙 Krypto-Notiz:</strong><br>
• Wenig Volumen – ideal für Struktur-Analyse<br>
• Range-Trading auf BTC/ETH sehr effektiv<br>
• Vorbereitung auf Sonntag → Pre-Move beachten
`,

  "Sonntag": `
📴 <strong>Sonntag</strong><br><br>
Noch kein Handel in Forex – aber wichtigster Vorbereitungstag.<br><br>

<strong>🪙 Krypto-Notiz:</strong><br>
• Ab 18:00 Uhr: BTC/ETH zeigen oft erste Richtung<br>
• Pre-Move für die Woche sichtbar<br>
• Setups validieren & Einstiegslevel berechnen
`
};


  if (daySummaryEl && dayDetailsEl) {
  daySummaryEl.addEventListener("click", () => {
  const now = new Date();
  const dayName = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"][now.getDay()];
  const rawContent = dayDetailsMap[dayName] || "📆 Keine Details für diesen Tag.";

  // Session-Name zu Tag zuordnen
  const sessionMap = {
    "Montag": "London",
    "Dienstag": "London",
    "Mittwoch": "Tokyo",
    "Donnerstag": "New York",
    "Freitag": "New York",
    "Samstag": "Crypto",
    "Sonntag": "Crypto"
  };

  const color = getSessionColor(sessionMap[dayName]);
  const glow = `0 0 5px ${color}, 0 0 12px ${hexToRgba(color, 0.5)}`;

  const wrappedContent = `
    <div style="
      padding: 16px;
      margin: 15px;
      border-left: 4px solid ${color};
      border-radius: 10px;
      background: rgba(255,255,255,0.02);
      box-shadow: inset 0 0 8px ${hexToRgba(color, 0.3)};
      color: #ccc;
      line-height: 1.6;
      font-size: 14px;
    ">
      <div style="font-size: 17px; font-weight: bold; color: ${color}; text-shadow: ${glow}; margin-bottom: 8px;">
        📅 ${dayName}
      </div>
      <div style="color:#ccc;">
        ${rawContent.replaceAll("<strong>", `<strong style="color:${color}; text-shadow:${glow};">`)}
      </div>
    </div>
  `;

  const visible = dayDetailsEl.style.display === "block";
  dayDetailsEl.style.display = visible ? "none" : "block";
  if (!visible) dayDetailsEl.innerHTML = wrappedContent;
});

  }

  updateDaySummary();
});

function updateBodyBackground(sessionName) {
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

  const sessionColorClassMap = {
    "Sydney": "session-sydney",
    "Tokyo": "session-tokyo",
    "London": "session-london",
    "New York": "session-ny",
    "London Killzone": "session-killzone",
    "New York Killzone": "session-killzone",
    "Crypto": "session-crypto"
  };

  // ✅ Korrektur: Parameter `sessionName` statt `name`
  sessionDetailsBox.className = "session-details-box";
  if (sessionColorClassMap[sessionName]) {
    sessionDetailsBox.classList.add(sessionColorClassMap[sessionName]);
  }

  document.body.style.setProperty("--session-glow", glowMap[sessionName] || "radial-gradient(ellipse at bottom, rgba(255,255,255,0.1) 0%, transparent 70%)");
  document.body.style.setProperty("--session-bg-color", baseColor[sessionName] || "#111");
}





window.addEventListener("load", () => {
  requestNotificationPermission();
  updateRealTimeBar();

  updateDaySummary(); // 📅 Wochentag-Anzeige aktualisieren

  setInterval(updateRealTimeBar, 60000);
});