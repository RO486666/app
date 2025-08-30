
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

  // 💡 Nur wenn es aufgeklappt wird → Inhalt erzeugen
  if (!visible) {
    buildSessionDetails();
  }
});




//Obere INFO Sessions

function updateSessionTextStyle(activeSessionName) {
  const el = document.getElementById("sessionText");
  const color = sessionColors[activeSessionName] || "#ffffff";

  if (!el) return;

  el.style.setProperty("--session-text-color", color);
  el.style.setProperty("--session-border", `${color}66`);
  el.style.setProperty("--session-box-shadow1", `${color}40`);
  el.style.setProperty("--session-box-shadow2", `${color}20`);
  el.style.setProperty("--session-box-shadow3", `${color}30`);
  el.style.setProperty("--session-text-shadow1", `${color}66`);
  el.style.setProperty("--session-text-shadow2", `${color}33`);
}

//Über den blaken 

function formatHM(mins) {
  const h = Math.floor(mins / 60) % 24;
  const m = mins % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

const sessionColors = {
  "Sydney": "#3388ff",
  "Tokyo": "#00aaff",
  "London": "#ffd700",
  "New York": "#ff4500",
  "London Killzone": "#ccff00",
  "New York Killzone": "#ff8800",
  "Deadzone": "#333333",
};



//Alle Sessions

const sessions = [
  {
    name: "Sydney",
    start: 1380,
    end: 480,
    info: "Ruhiger Markt, geringere Liquidität, Vorbereitung auf Asien.",
    weekDaysInfo: [
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
	 if (isCryptoWeekend()) return; // 🚀 Killt Werktags-Logik am Wochenende
	
  const now = new Date();
  const weekday = now.getDay(); // Sonntag = 0, Samstag = 6
  const hours = String(now.getHours()).padStart(2, "0");
  const mins = String(now.getMinutes()).padStart(2, "0");
  const minutes = now.getHours() * 60 + now.getMinutes();
  const percent = (minutes / 1439) * 100;

  // Fortschrittsbalken immer aktualisieren
  progressBar.style.width = `${percent}%`;
progressBar.style.background = "linear-gradient(270deg, #00ffcc, #ff00cc, #9900ff)";
progressContainer.style.boxShadow = "0 0 14px 4px rgba(153, 0, 255, 0.4)";

  
  // ⏬ Werktag-Session-Logik
  const activeSessions = getCurrentSessions(minutes);
const names = activeSessions.map(s => s.name);
updateTabButtonColors(names);
if (names.length > 0) {
  applyStatsBoxGlow(names[0]); // Nur erste aktive Session verwenden
}
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
  }  else if (minutes >= 720 && minutes < 840) {
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
updateSessionTextStyle(name);
}



// === Master: Day Details Map (Mo–So) – Swing & Day getrennt, einheitliche Sektionen ===
const dayDetailsMap = {
  "Montag": `
🟦 <strong>Montag</strong><br><br>

🌀 <strong>Swing</strong><br>
<strong>📌 Setup:</strong><br>
Wochenstart – häufiges Setzen von Wochenhoch/-tief, unreife Struktur, Liquidity-Traps typisch.<br><br>
<strong>✅ Strategie:</strong><br>
Kein aggressiver Einstieg. Max. kleine Probe-Position nach London-Open (09:00–10:00), Hauptfokus: Level-Mapping (Vorwochen-H/L, Weekly/D1/H4 POIs).<br><br>
<strong>🕓 Marktverhalten:</strong><br>
Volumen niedrig, Fakeouts über Asia-H/L, viele warten auf Dienstag.<br><br>
<strong>📊 Wirtschaftsdaten:</strong><br>
<ul>
  <li>🇪🇺 EU-Sentiment/Handelsdaten</li>
  <li>🇺🇸 selten starke US-Daten → NY träge</li>
</ul><br>
<strong>🧠 Mentaler Fokus:</strong><br>
Geduld. Heute Analyst > Trader. Keine FOMO.<br><br>
<strong>🧾 To-do:</strong><br>
<ul>
  <li>🗺️ Wochen-H/L & Vorwochen-H/L markieren</li>
  <li>📈 Weekly/D1/H4 Bias festhalten</li>
  <li>💧 Liquidity-Pools/FVG/Breaker notieren</li>
</ul><br>
<strong>🪙 Krypto-Notiz:</strong><br>
BTC/ETH oft lethargisch bis Abend; Range & erste Reaktionszonen beobachten.
<hr style="opacity:.15;">

⚡ <strong>Daytrading</strong><br>
<strong>📌 Setup:</strong><br>
Range-Bildung; Sweeps über Asia-High/Low sehr häufig.<br><br>
<strong>✅ Strategie:</strong><br>
Nur saubere Reversals nach Liquidity-Grab (M1–M5); enge SL, kleine Size, keine Swing-Halts.<br><br>
<strong>🕓 Marktverhalten:</strong><br>
London bringt ersten Impuls, NY oft flach/fehlausbruchsanfällig.<br><br>
<strong>📊 Wirtschaftsdaten:</strong><br>
Kaum US-Katalysatoren → technisch/getragen von Liquidity.<br><br>
<strong>🧠 Mentaler Fokus:</strong><br>
Dokumentieren statt forcieren. Qualität > Anzahl.<br><br>
<strong>🧾 To-do:</strong><br>
<ul>
  <li>🕘 Asia-H/L & London-Open Reaktion loggen</li>
  <li>🎯 Intraday POIs (IB, FVG, Orderblocks) markieren</li>
</ul><br>
<strong>🪙 Krypto-Notiz:</strong><br>
Scalps möglich, aber mean-reverting; Altcoins meist später dran.
`,

  "Dienstag": `
🟩 <strong>Dienstag</strong><br><br>

🌀 <strong>Swing</strong><br>
<strong>📌 Setup:</strong><br>
Montag-Level wird angetestet/gebrochen → erste echte Wochenrichtung formt sich.<br><br>
<strong>✅ Strategie:</strong><br>
Haupt-Einstiegstag: Confirmation auf H1/H4 (MSS/CHOCH + Retest) handeln; Pyramiding erlaubt, wenn Struktur sauber.<br><br>
<strong>🕓 Marktverhalten:</strong><br>
Volumen steigt deutlich; Expansion beginnt.<br><br>
<strong>📊 Wirtschaftsdaten:</strong><br>
<ul>
  <li>🇺🇸 Frühindikatoren/Reden möglich</li>
  <li>🇬🇧/🇪🇺 Daten-Cluster nicht selten</li>
</ul><br>
<strong>🧠 Mentaler Fokus:</strong><br>
Konsequent, aber nicht gierig. Plan handeln, nicht raten.<br><br>
<strong>🧾 To-do:</strong><br>
<ul>
  <li>🧭 Entry-Zonen vom Montag priorisieren</li>
  <li>📐 SL/TP aus Struktur (swing points, FVG) ableiten</li>
</ul><br>
<strong>🪙 Krypto-Notiz:</strong><br>
BTC/ETH häufig „Wake-up“-Move; Alts beginnen mitzuziehen.
<hr style="opacity:.15;">

⚡ <strong>Daytrading</strong><br>
<strong>📌 Setup:</strong><br>
Klarere Marktstruktur; Breakout→Retest & Trend-Pullbacks wirken besser.<br><br>
<strong>✅ Strategie:</strong><br>
London & NY Killzones aktiv handeln; 1–3 A-Setups genügen.<br><br>
<strong>🕓 Marktverhalten:</strong><br>
Saubere Impulse, weniger Fakeouts als Montag.<br><br>
<strong>📊 Wirtschaftsdaten:</strong><br>
News können Moves beschleunigen – Uhrzeiten respektieren.<br><br>
<strong>🧠 Mentaler Fokus:</strong><br>
Keine Overtrades – nach 2–3 Qualitäts-Trades Schluss.<br><br>
<strong>🧾 To-do:</strong><br>
<ul>
  <li>🧪 Montagsthese validieren/invalidieren</li>
  <li>📊 Teilgewinnregeln festsetzen</li>
</ul><br>
<strong>🪙 Krypto-Notiz:</strong><br>
FVG/Breaker-Einstiege mit Momentum solide.
`,

  "Mittwoch": `
🟨 <strong>Mittwoch</strong><br><br>

🌀 <strong>Swing</strong><br>
<strong>📌 Setup:</strong><br>
Midweek High/Low; Liquidity-Runs gefolgt von Reversal oder Expansion 2.<br><br>
<strong>✅ Strategie:</strong><br>
Nach Sweep gegen Trendkante Entry auf Bestätigung; bestehende Swings managen/aufstocken.<br><br>
<strong>🕓 Marktverhalten:</strong><br>
Volatilität hoch; Richtungswechsel möglich (bes. bei FOMC-Wochen).<br><br>
<strong>📊 Wirtschaftsdaten:</strong><br>
<ul>
  <li>🏦 FOMC/Fed Minutes/Inflation oft mittwochs</li>
  <li>🛢️ Öl-Lagerbestände</li>
</ul><br>
<strong>🧠 Mentaler Fokus:</strong><br>
Flexibel bleiben; Bias darf kippen, Regeln bleiben.<br><br>
<strong>🧾 To-do:</strong><br>
<ul>
  <li>🔁 Midweek-Review: bin ich im Hauptmove?</li>
  <li>🧮 Risiko neu kalibrieren</li>
</ul><br>
<strong>🪙 Krypto-Notiz:</strong><br>
„Decision Day“: Nach Sweep entscheidet sich oft die Wochenrichtung.
<hr style="opacity:.15;">

⚡ <strong>Daytrading</strong><br>
<strong>📌 Setup:</strong><br>
Reversal- und Continuation-Setups gleichermaßen präsent.<br><br>
<strong>✅ Strategie:</strong><br>
Erst Reaktion abwarten; nach News nur strukturierte Pullbacks handeln.<br><br>
<strong>🕓 Marktverhalten:</strong><br>
Starke Spikes möglich; Spread/Slippage beachten.<br><br>
<strong>📊 Wirtschaftsdaten:</strong><br>
News-zentriert – Uhrzeiten zwingend im Plan.<br><br>
<strong>🧠 Mentaler Fokus:</strong><br>
Keine Egoscalps gegen den ersten bestätigten Shift.<br><br>
<strong>🧾 To-do:</strong><br>
<ul>
  <li>🧷 SL breiter planen oder Positionsgröße anpassen</li>
  <li>🗂️ News-Plan visuell parat</li>
</ul><br>
<strong>🪙 Krypto-Notiz:</strong><br>
Nachmittags-/Abend-Impulse häufig richtungsweisend.
`,

  "Donnerstag": `
🟧 <strong>Donnerstag</strong><br><br>

🌀 <strong>Swing</strong><br>
<strong>📌 Setup:</strong><br>
Continuation-Tag; letzte saubere Entries für Wochenmove.<br><br>
<strong>✅ Strategie:</strong><br>
Nur mit bestätigter Richtung addieren; keine neuen Gegentrend-Ideen starten.<br><br>
<strong>🕓 Marktverhalten:</strong><br>
Stark, teils „messy“ wegen Gewinnsicherungen vor Freitag.<br><br>
<strong>📊 Wirtschaftsdaten:</strong><br>
<ul>
  <li>🇺🇸 GDP/PCE/CPI/Claims-Cluster möglich</li>
</ul><br>
<strong>🧠 Mentaler Fokus:</strong><br>
Pragmatismus: Gewinne sichern schlägt „perfekten Exit jagen“.<br><br>
<strong>🧾 To-do:</strong><br>
<ul>
  <li>💼 Teilverkäufe/Trail-Logik aktivieren</li>
  <li>📝 Plan für Freitag (falls flat nötig) anlegen</li>
</ul><br>
<strong>🪙 Krypto-Notiz:</strong><br>
Alts „catch-up“ häufig; Dominance-Shifts beobachten.
<hr style="opacity:.15;">

⚡ <strong>Daytrading</strong><br>
<strong>📌 Setup:</strong><br>
Trendtage mit kräftigen Pullbacks; News-Spikes häufig.<br><br>
<strong>✅ Strategie:</strong><br>
NY-Killzone bevorzugt; nach Spike → strukturierter Retest statt Market-Chase.<br><br>
<strong>🕓 Marktverhalten:</strong><br>
Volatil & ergiebig, aber Fehler werden teuer.<br><br>
<strong>📊 Wirtschaftsdaten:</strong><br>
News-Filter zwingend – 15–30 Min. Pre/Post-News-Regel.<br><br>
<strong>🧠 Mentaler Fokus:</strong><br>
Execution diszipliniert; weniger Trades, bessere Qualität.<br><br>
<strong>🧾 To-do:</strong><br>
<ul>
  <li>🎯 Nur A-/A+ Setups</li>
  <li>⏱️ Time-in-Trade begrenzen</li>
</ul><br>
<strong>🪙 Krypto-Notiz:</strong><br>
NY-Overlap oft beste Dynamik der Woche.
`,

  "Freitag": `
🟥 <strong>Freitag</strong><br><br>

🌀 <strong>Swing</strong><br>
<strong>📌 Setup:</strong><br>
Profit-Taking, Wochenrange nahezu vollendet; neue Swings riskant.<br><br>
<strong>✅ Strategie:</strong><br>
Bestehende Positionen managen/abbauen; neue Swings nur bei außergewöhnlich klarem Setup.<br><br>
<strong>🕓 Marktverhalten:</strong><br>
Vormittag brauchbar, ab Nachmittag Liquidität dünn; Stop-Runs vor Close.<br><br>
<strong>📊 Wirtschaftsdaten:</strong><br>
<ul>
  <li>📈 Arbeitsmarktdaten/NFP (14:30) – selektiv</li>
</ul><br>
<strong>🧠 Mentaler Fokus:</strong><br>
Schutz des Wochen-PnL vor Hero-Trades.<br><br>
<strong>🧾 To-do:</strong><br>
<ul>
  <li>📊 Wochenstatistik & Screens sichern</li>
  <li>🧮 Equity-Update & Learnings notieren</li>
</ul><br>
<strong>🪙 Krypto-Notiz:</strong><br>
Pre-Weekend-Positionierung beginnt; Vorsicht vor späten Sweeps.
<hr style="opacity:.15;">

⚡ <strong>Daytrading</strong><br>
<strong>📌 Setup:</strong><br>
Scalp-/Intraday-Fokus; Trendläufe seltener.<br><br>
<strong>✅ Strategie:</strong><br>
Nur glasklare Liquidity-Jagden; keine Blind-Breakouts; früher Feierabend erlaubt.<br><br>
<strong>🕓 Marktverhalten:</strong><br>
Nach 13–15 Uhr abnehmend; US-Close ruhig/erratisch.<br><br>
<strong>📊 Wirtschaftsdaten:</strong><br>
NFP & Co. nur mit klaren Regeln.<br><br>
<strong>🧠 Mentaler Fokus:</strong><br>
PnL schützen, nicht maximieren.<br><br>
<strong>🧾 To-do:</strong><br>
<ul>
  <li>🗂️ Journal abschließen, Montag vorbereiten</li>
</ul><br>
<strong>🪙 Krypto-Notiz:</strong><br>
BTC oft Pre-Move für Samstagabend/Sonntag.
`,

  "Samstag": `
⬛ <strong>Samstag</strong> (Forex geschlossen • Krypto offen)<br><br>

🌀 <strong>Swing</strong><br>
<strong>📌 Setup:</strong><br>
Illiquide; größere Swings unzuverlässig.<br><br>
<strong>✅ Strategie:</strong><br>
Kein Swing-Einstieg; nur Vorbereitung & Backtesting.<br><br>
<strong>🧾 To-do:</strong><br>
<ul>
  <li>📚 Markups pflegen, Monats-/Wochenreview</li>
  <li>🧭 Setup-Library aktualisieren</li>
</ul><br>
<strong>🪙 Krypto-Notiz:</strong><br>
Mean-reversion/Range dominiert; geringe Size, klare Grenzen.
<hr style="opacity:.15;">

⚡ <strong>Daytrading</strong><br>
<strong>📌 Setup:</strong><br>
Kleine Ranges; Algos dominieren.<br><br>
<strong>✅ Strategie:</strong><br>
Nur saubere Range-Edges; hartes Risk-Management.<br><br>
<strong>🕓 Marktverhalten:</strong><br>
Dünn & sprunghaft; Slippage möglich.<br><br>
<strong>🧠 Mentaler Fokus:</strong><br>
Wenn unsicher: Pause > Zocken.<br><br>
<strong>🧾 To-do:</strong><br>
<ul>
  <li>🗒️ Watchlist & Alarme für Sonntag/Montag setzen</li>
</ul>
`,

  "Sonntag": `
⬛ <strong>Sonntag</strong> (Forex vor Weekly Open • Krypto aktiv)<br><br>

🌀 <strong>Swing</strong><br>
<strong>📌 Setup:</strong><br>
Weekly-Open-Pegel entsteht; Pre-Move definiert erste Liquidität.<br><br>
<strong>✅ Strategie:</strong><br>
Keine Swings vor stabiler Montag-Struktur; nur Levelplanung.<br><br>
<strong>🧾 To-do:</strong><br>
<ul>
  <li>📅 Wochenziele, Risikolimits, News-Kalender setzen</li>
  <li>🗺️ Key-Levels für Mo/Di finalisieren</li>
</ul><br>
<strong>🪙 Krypto-Notiz:</strong><br>
BTC/ETH zeigen oft Richtung für Wochenstart; Dominance beobachten.
<hr style="opacity:.15;">

⚡ <strong>Daytrading</strong><br>
<strong>📌 Setup:</strong><br>
Sehr dünn bis US-Abend; Pre-Open Moves sind häufig trügerisch.<br><br>
<strong>✅ Strategie:</strong><br>
Nur dokumentieren/alarme; Handel optional & klein.<br><br>
<strong>🕓 Marktverhalten:</strong><br>
Späte Impulse können Montag-Asia/London prägen.<br><br>
<strong>🧠 Mentaler Fokus:</strong><br>
Vorbereitung > Execution.<br><br>
<strong>🧾 To-do:</strong><br>
<ul>
  <li>🛠️ Plattform-Checks, Alarme, Templates laden</li>
</ul>
`
};


function hexToRgba(hex, opacity) {
  const bigint = parseInt(hex.replace("#", ""), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

function updateDaySummary() {
	 if (isCryptoWeekend()) return; // 🚀 Killt Werktags-Logik am Wochenende
  const days = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];
  const infos = {
    "Montag": `🚀 Start in die Woche – neue Impulse, frische Trends möglich.\n🪙 Krypto oft ruhig nach Sonntag – Fokus auf BTC-Reaktion.`,
    "Dienstag": `📈 Trend-Fortsetzung oder technische Korrekturen im Forex.\n🪙 BTC & Altcoins reagieren oft auf Marktstimmung.`,
    "Mittwoch": `⚠️ Midweek-Reversal möglich – Vorsicht bei Trendwechseln.\n🪙 BTC häufig impulsiv – Fakeouts nicht selten.`,
    "Donnerstag": `📊 News-Donnerstag – viele Wirtschaftsreleases.\n🪙 Volatile Altcoins – gute Chancen für Breakouts.`,
    "Freitag": `📅 Wochenabschluss – Gewinne sichern, keine Paniktrades.\n🪙 Abends oft BTC-Volatilität vor dem Krypto-Wochenende.`,
    
  };



  const now = new Date();
  const minutesNow = now.getHours() * 60 + now.getMinutes();
  const activeSessions = sessions.filter(s => {
    const start = s.start;
    const end = s.end;
    return start > end
      ? minutesNow >= start || minutesNow < end
      : minutesNow >= start && minutesNow < end;
  });

  const dominantSession = activeSessions.find(s => s.name !== "Crypto") || activeSessions[0];
  const sessionColor = sessionColors[dominantSession?.name] || "#00ffcc";

  const dayIndex = now.getDay();
  const dayName = days[dayIndex];
  const info = infos[dayName] || "📆 Trading-Tag";

  const el = document.getElementById("daySummary");
  if (el) {
    el.textContent = `🗓️ ${dayName} – ${info}`;
    el.style.background = sessionColor + "22";
    el.style.color = sessionColor;
    el.style.border = `1px solid ${sessionColor}88`;
    el.style.boxShadow = `0 0 8px ${sessionColor}`;
    el.style.textShadow = `0 0 3px ${sessionColor}`;
    el.style.cursor = "pointer";

    el.onclick = () => {
      const dayDetailsEl = document.getElementById("dayDetails");
      if (!dayDetailsEl) return;

      const raw = dayDetailsMap[dayName] || "📆 Keine Details verfügbar.";
      const glow = `0 0 5px ${sessionColor}, 0 0 12px ${hexToRgba(sessionColor, 0.5)}`;

      const wrapped = `
        <div style="
          padding: 16px;
          margin: 15px;
          border-left: 4px solid ${sessionColor};
          border-radius: 10px;
          background: rgba(255,255,255,0.02);
          box-shadow: inset 0 0 8px ${hexToRgba(sessionColor, 0.3)};
          color: #ccc;
          line-height: 1.6;
          font-size: 14px;
        ">
          <div style="font-size: 17px; font-weight: bold; color: ${sessionColor}; text-shadow: ${glow}; margin-bottom: 8px;">
            📅 ${dayName}
          </div>
          <div style="color:#ccc;">
            ${raw.replaceAll("<strong>", `<strong style=\"color:${sessionColor}; text-shadow:${glow};\">`)}
          </div>
        </div>
      `;

      const isVisible = dayDetailsEl.style.display === "block";
      dayDetailsEl.style.display = isVisible ? "none" : "block";
      if (!isVisible) dayDetailsEl.innerHTML = wrapped;
    };
  }
}

document.addEventListener("DOMContentLoaded", () => {
  updateDaySummary();
});


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
    
  };

  const baseColor = {
    "Sydney": "#0a0e1a",
    "Tokyo": "#0a1018",
    "London": "#1b1a0e",
    "New York": "#1a0e0e",
    "London Killzone": "#12160a",
    "New York Killzone": "#1a1408",
    
  };

  const sessionColorClassMap = {
    "Sydney": "session-sydney",
    "Tokyo": "session-tokyo",
    "London": "session-london",
    "New York": "session-ny",
    "London Killzone": "session-killzone",
    "New York Killzone": "session-killzone",
    
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

  setInterval(() => {
  if (sessionDetailsBox.style.display === "block") {
    buildSessionDetails();
  }
}, 30000); // alle 30 Sekunden neu rendern

});