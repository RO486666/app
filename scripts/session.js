/* =========================================================
   📌 DOM-REFERENZEN (zentrale UI-Elemente)
   Zweck: Einmal selektieren → überall wiederverwenden
   ========================================================= */

const sessionText = document.getElementById("sessionText");                 // Obere Session-Zeitanzeige
const sessionProgressEl = document.getElementById("sessionProgressDisplay"); // Fortschrittsanzeige je Session
const sessionInfoEl = document.getElementById("sessionInfo");               // Kurzinfo zur aktiven Session
const sessionDetailsBox = document.getElementById("sessionDetailsBox");     // Ausklappbare Detailansicht
const alertBox = document.getElementById("alertBox");                       // Alert-/Hinweisbox
const progressBar = document.getElementById("progressBar");                 // Tagesfortschrittsbalken
const progressContainer = document.querySelector(".progress-container");    // Container für Progress-Bar



/* =========================================================
   📌 Session-Details Toggle (Click auf Uhrzeit)
   Zweck: Details nur bei Bedarf rendern (Performance)
   ========================================================= */

sessionText.addEventListener("click", () => {
  const visible = sessionDetailsBox.style.display === "block";

  // Toggle Anzeige
  sessionDetailsBox.style.display = visible ? "none" : "block";

  // Details nur neu bauen, wenn geöffnet wird
  if (!visible) {
    buildSessionDetails();
  }
});



/* =========================================================
   🌍 DST / ZEITMODUS (AUTO | WINTER | SOMMER)
   ========================================================= */

/**
 * Prüft, ob aktuell europäische Sommerzeit (MESZ) aktiv ist
 * Logik: letzter Sonntag im März bis letzter Sonntag im Oktober
 */
function isSummerTimeEU(date = new Date()) {
  const year = date.getFullYear();

  // Letzter Sonntag im März
  const march = new Date(year, 2, 31);
  march.setDate(march.getDate() - march.getDay());

  // Letzter Sonntag im Oktober
  const october = new Date(year, 9, 31);
  october.setDate(october.getDate() - october.getDay());

  return date >= march && date < october;
}

/**
 * Ermittelt den Zeit-Offset in Minuten basierend auf:
 * - Manuellem User-Override (localStorage)
 * - Automatischer Sommerzeit-Erkennung
 */
function getDSTOffsetMinutes() {
  const mode = localStorage.getItem("dstMode"); // null | winter | summer

  if (mode === "summer") return 60; // MESZ erzwingen
  if (mode === "winter") return 0;  // MEZ erzwingen

  // AUTO-Modus
  return isSummerTimeEU() ? 60 : 0;
}

/**
 * Gibt alle Sessions mit angewendetem DST-Offset zurück
 * Basisdaten bleiben unverändert → saubere Trennung
 */
function getShiftedSessions() {
  const offset = getDSTOffsetMinutes();

  return sessions.map(s => {
    let start = s.start + offset;
    let end   = s.end + offset;

    // Tagesüberlauf korrigieren
    if (start >= 1440) start -= 1440;
    if (end >= 1440) end -= 1440;

    return { ...s, start, end };
  });
}



/* =========================================================
   🎨 Session-Text Styling (Glow / Farbe)
   Zweck: Aktive Session visuell hervorheben
   ========================================================= */

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



/* =========================================================
   🕓 Zeitformatierung
   Zweck: Minuten → HH:MM Anzeige
   ========================================================= */

function formatHM(mins) {
  const h = Math.floor(mins / 60) % 24;
  const m = mins % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}



/* =========================================================
   🎨 Session-Farben (zentrale Definition)
   ========================================================= */

const sessionColors = {
  "Sydney": "#3388ff",
  "Tokyo": "#00aaff",
  "London": "#ffd700",
  "New York": "#ff4500",
  "London Killzone": "#ccff00",
  "New York Killzone": "#ff8800",
  "Deadzone": "#333333",
};



/* =========================================================
   🧠 SESSION-DEFINITIONEN (Basisdaten, DST-frei)
   start/end = Minuten ab 00:00 MEZ
   ========================================================= */

const sessions = [
  {
    name: "Sydney",
    start: 1380,
    end: 480,
    info: "Ruhiger Start in den globalen Handel. Liquidity-Aufbau, Range-Bildung.",
    weekDaysInfo: [
      { day: "Montag", text: "🌏 Asia-Opening → AUD/NZD setzen die Wochenrange." },
      { day: "Mittwoch", text: "🔄 Klare Struktur in AUD/JPY & AUD/USD (saubere HL/LH Bewegungen)." },
      { day: "Freitag", text: "📌 Vorbereitungsphase für London – AUD/NZD bleiben technisch sauber." },
    ],
  },

  {
    name: "Tokyo",
    start: 60,
    end: 600,
    info: "Klare Struktur, häufig Trendbeginn für JPY-Paare. Ruhige, aber saubere Moves.",
    weekDaysInfo: [
      { day: "Dienstag", text: "📈 Tokyo setzt häufig den JPY-Wochentrend (USD/JPY, GBP/JPY)." },
      { day: "Donnerstag", text: "🎯 JPY-Paare reagieren technisch stark (HL/LH sehr sauber)." },
      { day: "Freitag", text: "⚡ Positionsglättung → frühe Volatilität in Yen-Paaren." },
    ],
  },

  {
    name: "London",
    start: 540,
    end: 1020,
    info: "Stärkste Liquidität. Hauptsession des gesamten Forex-Marktes.",
    weekDaysInfo: [
      { day: "Montag", text: "📉 Wochenrange formt sich – EUR/GBP/JPY bewegen sich technisch." },
      { day: "Dienstag", text: "📈 Trendaufbau – London definiert die Tagesrichtung sehr klar." },
      { day: "Donnerstag", text: "⚡ Starke directional Moves → Positionsanpassungen vor Freitag." },
      { day: "Freitag", text: "📅 Gewinnmitnahmen → schnelle Sweeps & Reversals möglich." },
    ],
  },

  {
    name: "New York",
    start: 870,
    end: 1380,
    info: "Hohe Volatilität. US-Liquidität bestimmt die Gesamttrendstärke.",
    weekDaysInfo: [
      { day: "Montag", text: "🔄 Häufig träge oder fehlausbruchsanfällig – Vorsicht bei Gold & Indizes." },
      { day: "Mittwoch", text: "⚡ Midweek Momentum – starke Moves in USD/JPY, XAU/USD & NAS100." },
      { day: "Freitag", text: "🔥 Weekend-Pricing → Gold & NAS100 extrem volatil." },
    ],
  },

  {
    name: "London Killzone",
    start: 420,
    end: 660,
    info: "Liquidity-Grabs, Sweeps, Pre-London Manipulation. Optimal für ICT Entries.",
    weekDaysInfo: [
      { day: "Montag", text: "⚠️ Wochenstart-Liquidity wird gejagt – Sweeps auf GBP/USD & EUR/JPY." },
      { day: "Mittwoch", text: "🔥 Midweek Sweep → perfekte MSS/FVG Setups, sehr saubere Entries." },
    ],
  },

  {
    name: "New York Killzone",
    start: 810,
    end: 1020,
    info: "Erster US-Impuls. Trendsetzung oder Reversal, starker Volume Shift.",
    weekDaysInfo: [
      { day: "Dienstag", text: "📈 Starke US-Liquidität → XAU/USD & NAS100 bewegen sauber." },
      { day: "Donnerstag", text: "⚡ Häufig Trendwechsel → perfekte Pullback-Trades." },
    ],
  },

  {
    name: "Deadzone",
    start: 1380,
    end: 0,
    info: "Niedrige Liquidität. Range, Mean-Reversion, kaum Trend.",
    weekDaysInfo: [
      { day: "Täglich", text: "😴 Seitwärts → Scalping vermeiden, Markt pausiert." },
    ],
  },
];

let lastAlertSession = null;



/* =========================================================
   ⏱️ Zeit-Hilfsfunktionen
   ========================================================= */

/**
 * Aktuelle Uhrzeit in Minuten seit Tagesbeginn
 */
function getMinutesNow() {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
}

/**
 * Liefert alle aktuell aktiven Sessions
 * Berücksichtigt Sessions über Mitternacht
 */
function getCurrentSessions(minNow) {
  const shifted = getShiftedSessions();

  return shifted.filter(s => {
    if (s.start > s.end) {
      return minNow >= s.start || minNow < s.end;
    } else {
      return minNow >= s.start && minNow < s.end;
    }
  });
}

/* =========================================================
   📊 Progress-Bar (Tages- & Sessionfarben)
   ========================================================= */

function updateGradientBar(colors) {
  if (colors.length === 0) {
    progressBar.style.background = "#444";
    progressBar.style.backgroundImage = "";
    return;
  }
  
  
  // SVG-Gradient für saubere Übergänge
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
  const shifted = getShiftedSessions();
  const futureStarts = shifted.map(s => s.start).filter(start => start > minNow);

  if (futureStarts.length === 0)
    return shifted[0].start + 1440 - minNow;

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
	const wd = new Date().getDay(); // Sonntag=0, Montag=1 ... Samstag=6
if (wd === 0 || wd === 6) {
  console.log("⏹️ Session.js deaktiviert (Wochenende).");
  return;
}
	
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
  sessionText.textContent = `🕒 ${hours}:${mins} (${getDSTLabel()}) ${activeNames}`;

	
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
  <div class="session-box">

    <div class="session-box-title">
      ${label} ${s.name}
    </div>

    <div class="session-box-row">📅 Start: ${formatHM(s.start)} Uhr</div>
    <div class="session-box-row">🕓 Ende: ${formatHM(s.end)} Uhr</div>
    <div class="session-box-row">ℹ️ ${s.info}</div>

    ${s.weekDaysInfo ? `
      <ul class="session-box-days">
        ${s.weekDaysInfo.map(d => `
          <li><strong>${d.day}:</strong> ${d.text}</li>
        `).join("")}
      </ul>
    ` : ""}

    <hr class="session-box-divider">

  </div>
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
applySidebarDrawerSessionColor(name);

}


const dayDetailsMap = {

"Montag": `
🟦 <strong>Montag</strong><br><br>

🌀 <strong>Swing</strong><br>

<strong>📌 Setup:</strong><br>
Wochenstart: Markt baut erst Struktur. Liquidity-Traps häufig, HL/LH oft unklar, Trend noch unreif.<br><br>

<strong>🎯 Regel- & Checklist-Relevanz:</strong><br>
• AOI-Pflicht (Weekly/D1).<br>
• Rejection MUSS da sein (Struktur/EMA/psych Level).<br>
• HL/LH meist noch nicht bestätigt → Entries nur bei klarer MSS/CHOCH.<br>
• Engulfing im H1/H4 selten → Bestätigung streng prüfen.<br><br>

<strong>✅ Strategie:</strong><br>
Kein aktiver Trading-Tag → Fokus auf Mapping & Bias-Building.<br>
Probe-Position nur bei kompletter Regel-Konformität.<br><br>

<strong>🕓 Marktverhalten:</strong><br>
Niedriges Volumen, Sweeps über Asia-H/L typisch. Markt testet Wochenbereiche an.<br><br>

<strong>📊 Wirtschaftsdaten:</strong><br>
<ul>
  <li>🗓️ Tagesrelevanz abhängig vom aktuellen Kalender</li>
  <li>🔍 Frühe EU/US-Daten prüfen → können Trendbrokern auslösen</li>
</ul><br>

<strong>🧠 Mentaler Fokus:</strong><br>
Geduld. Montag = Analyse. Nicht erzwingen.<br><br>

<strong>🧾 To-do:</strong><br>
<ul>
  <li>🗺️ Wochen-H/L & Vorwochenlevels markieren</li>
  <li>📈 Weekly/D1/H4 Bias festlegen (Checklist Weekly/Daily)</li>
  <li>💧 Liquidity-Pools, Breaker, FVGs notieren</li>
  <li>📉 HL/LH-Potenzial dokumentieren</li>
</ul><br>

<strong>🪙 Krypto-Notiz:</strong><br>
BTC/ETH häufig träge – Range & Strukturaufbau dominieren.<br>

<hr style="opacity:.15;">

⚡ <strong>Daytrading</strong><br>

<strong>📌 Setup:</strong><br>
Range Day. Asia sweeps → London reagiert. Montag produziert viele Fakeouts.<br><br>

<strong>🎯 Regel-Integration:</strong><br>
• AOI (Daily/4H) MUSS bestätigt sein.<br>
• Rejection = Pflicht (OB/EMA/SR).<br>
• Struktur-Shift (M5–M15) muss zuerst kommen, dann Engulfing.<br>
• RR 1.5–2.0 gemäß Entry-Regel.<br><br>

<strong>✅ Strategie:</strong><br>
Nur Reversal-Confluence handeln nach Liquidity-Grab.<br>
Keine Breakouts → Montag 80% Fake-Breakouts.<br><br>

<strong>🕓 Marktverhalten:</strong><br>
London-Impuls solide, NY oft korrektiv und schwer strukturiert.<br><br>

<strong>📊 Wirtschaftsdaten:</strong><br>
<ul>
  <li>🔍 Kalender checken – Montag kann ruhig oder hochvolatil sein</li>
</ul><br>

<strong>🧠 Mentaler Fokus:</strong><br>
Dokumentieren & beobachten. Qualität > Anzahl.<br><br>

<strong>🧾 To-do:</strong><br>
<ul>
  <li>Asia-H/L & London-Reaktion loggen</li>
  <li>Intraday POIs (IB, OB, FVG, Shift-Zonen) markieren</li>
  <li>Checklist prüfen: AOI + Shift + Rejection</li>
</ul><br>

<strong>🪙 Krypto-Notiz:</strong><br>
Mean-reversion aktiv – Alts erwachen spät.
`,


"Dienstag": `
🟩 <strong>Dienstag</strong><br><br>

🌀 <strong>Swing</strong><br>

<strong>📌 Setup:</strong><br>
Erste echte Wochenrichtung entsteht. Montag-Levels werden validiert oder gebrochen.<br><br>

<strong>🎯 Regeln & Checklist:</strong><br>
• H1/H4 MSS/CHOCH = Haupttrigger.<br>
• AOI-Test + Rejection = Pflicht.<br>
• HL/LH bestätigt? Dann permission für Swing-Entry.<br>
• Engulfing validiert den Retest.<br><br>

<strong>✅ Strategie:</strong><br>
Heute ist Execution-Day: Trendfortsetzung oder Reversal klarer.<br>
Pyramiding möglich bei sauberer Struktur.<br><br>

<strong>🕓 Marktverhalten:</strong><br>
Höheres Volumen, Expansion beginnt.<br><br>

<strong>📊 Wirtschaftsdaten:</strong><br>
<ul><li>Kalender prüfen – Dienstag bietet oft moderate EU/US-Daten</li></ul><br>

<strong>🧠 Mentaler Fokus:</strong><br>
Plan + Regeln handeln. Keine Gier, kein Raten.<br><br>

<strong>🧾 To-do:</strong><br>
<ul>
  <li>Montagsthese validieren/invalidieren</li>
  <li>Entry-Zonen priorisieren</li>
  <li>SL/TP aus reiner Struktur ableiten</li>
</ul><br>

<strong>🪙 Krypto-Notiz:</strong><br>
BTC/ETH zeigen oft ersten impulsiven Wochenmove.<br>

<hr style="opacity:.15;">

⚡ <strong>Daytrading</strong><br>

<strong>📌 Setup:</strong><br>
Struktur viel sauberer als Montag. Breakout→Retest funktioniert wieder.<br><br>

<strong>🎯 Regel-Integration:</strong><br>
• Daily/4H AOI wichtigste Variable.<br>
• HL/LH + M15 Shift liefern High-Probability Entries.<br>
• Engulfing im 1H bestätigt Stärke.<br><br>

<strong>✅ Strategie:</strong><br>
London + NY Killzones aktiv nutzen.<br>
2–3 A-Setups reichen völlig.<br><br>

<strong>🕓 Marktverhalten:</strong><br>
Klares Intraday-Trending, weniger Fakeouts.<br><br>

<strong>📊 Wirtschaftsdaten:</strong><br>
<ul><li>Daten können Trendbeschleuniger sein – Uhrzeiten prüfen</li></ul><br>

<strong>🧠 Mentaler Fokus:</strong><br>
Keine Overtrades → Dienstag ist profitabler, wenn man nicht übertreibt.<br><br>

<strong>🧾 To-do:</strong><br>
<ul>
  <li>Bias-Abgleich mit Swing-Struktur</li>
  <li>Teilgewinnstrategie vorbereiten</li>
</ul><br>

<strong>🪙 Krypto-Notiz:</strong><br>
FVG/Breaker-Entries besonders sauber.
`,


"Mittwoch": `
🟨 <strong>Mittwoch</strong><br><br>

🌀 <strong>Swing</strong><br>

<strong>📌 Setup:</strong><br>
Midweek High/Low → Liquidity Run → Reversal oder zweite Trend-Expansion.<br><br>

<strong>🎯 Regeln & Checklist:</strong><br>
• Der wichtigste HL/LH-Tag.<br>
• AOI-Test meist entscheidend für Wochenrichtung.<br>
• Rejection + MSS nach Sweep = A+-Setup.<br>
• Engulfing in H1/H4 besonders relevant.<br><br>

<strong>✅ Strategie:</strong><br>
Positionen managen, skalieren oder drehen – aber nur regelkonform.<br><br>

<strong>🕓 Marktverhalten:</strong><br>
Hohe Volatilität. Midweek Reversals häufig.<br><br>

<strong>📊 Wirtschaftsdaten:</strong><br>
<ul><li>Mittwoch oft News-lastig → Timeslots zwingend prüfen</li></ul><br>

<strong>🧠 Mentaler Fokus:</strong><br>
Flexibel, aber regelgetreu.  
Bias darf kippen – Regeln nicht.<br><br>

<strong>🧾 To-do:</strong><br>
<ul>
  <li>Midweek-Review: liege ich im Hauptmove?</li>
  <li>Risikokalibrierung aktualisieren</li>
</ul><br>

<strong>🪙 Krypto-Notiz:</strong><br>
BTC entscheidet oft hier die Wochenrichtung.<br>

<hr style="opacity:.15;">

⚡ <strong>Daytrading</strong><br>

<strong>📌 Setup:</strong><br>
Reversal & Continuation gleichzeitig möglich – der trickreichste Tag.<br><br>

<strong>🎯 Regel-Integration:</strong><br>
• Erst Reaktion abwarten → dann Shift → dann Entry.<br>
• HL/LH + MSS = Pflicht für Trendcatch.<br>
• Spread & Slippage wegen News beachten.<br><br>

<strong>🕓 Marktverhalten:</strong><br>
Viele Spikes, Liquiditäts-Jagden, Stop-Hunts.<br><br>

<strong>📊 Wirtschaftsdaten:</strong><br>
<ul><li>News-Cluster möglich – nach Kalender handeln</li></ul><br>

<strong>🧠 Mentaler Fokus:</strong><br>
Keine Ego-Entries. Kein Kampf gegen ersten klaren Shift.<br><br>

<strong>🧾 To-do:</strong><br>
<ul>
  <li>SL etwas breiter oder Size kleiner</li>
  <li>News-Zeiten visuell markieren</li>
</ul><br>

<strong>🪙 Krypto-Notiz:</strong><br>
Nachmittags/Abend-Moves richtungsstark.
`,


"Donnerstag": `
🟧 <strong>Donnerstag</strong><br><br>

🌀 <strong>Swing</strong><br>

<strong>📌 Setup:</strong><br>
Continuation-Day. Die letzten stabilen Wochen-Entries.<br><br>

<strong>🎯 Regeln & Checklist:</strong><br>
• Kein Gegentrend-Start mehr.<br>
• AOI + Rejection + HL/LH = perfekte Swing-Confluence.<br>
• TP-Logik aktiv: Teilgewinne sichern.<br><br>

<strong>✅ Strategie:</strong><br>
Trend mitnehmen oder bestehende Trades managen.<br><br>

<strong>🕓 Marktverhalten:</strong><br>
Oft starke Moves, aber „messy“ wegen Gewinnmitnahmen.<br><br>

<strong>📊 Wirtschaftsdaten:</strong><br>
<ul><li>Donnerstag häufig datenintensiv – Kalender prüfen</li></ul><br>

<strong>🧠 Mentaler Fokus:</strong><br>
Pragmatisch: Gewinne sichern > perfekten Exit jagen.<br><br>

<strong>🧾 To-do:</strong><br>
<ul>
  <li>Teilgewinne & Trailing aktivieren</li>
  <li>Plan für Freitag vorbereiten (Drawdown-Schutz)</li>
</ul><br>

<strong>🪙 Krypto-Notiz:</strong><br>
Alts holen oft auf – Struktur prüfen.<br>

<hr style="opacity:.15;">

⚡ <strong>Daytrading</strong><br>

<strong>📌 Setup:</strong><br>
Donnerstag = Momentum-Tag. Trend-Pullbacks extrem stark.<br><br>

<strong>🎯 Regeln integriert:</strong><br>
• News-Spikes nur mit Retest handeln.<br>
• Shift + Engulfing Pflicht vor Entry.<br>
• AOI/OB Rejection sehr zuverlässig.<br><br>

<strong>🕓 Marktverhalten:</strong><br>
Hohe Volatilität, aber gut handelbar für strukturierte Trader.<br><br>

<strong>📊 Wirtschaftsdaten:</strong><br>
<ul><li>Vor & nach News 15–30 Min. Regel anwenden</li></ul><br>

<strong>🧠 Mentaler Fokus:</strong><br>
Weniger Trades, dafür A+ Qualität.<br><br>

<strong>🧾 To-do:</strong><br>
<ul>
  <li>Nur A-/A+ Setups handeln</li>
  <li>Time-in-Trade begrenzen</li>
</ul><br>

<strong>🪙 Krypto-Notiz:</strong><br>
NY-Overlap mit hoher Dynamik.
`,


"Freitag": `
🟥 <strong>Freitag</strong><br><br>

🌀 <strong>Swing</strong><br>

<strong>📌 Setup:</strong><br>
Profit-Taking-Day. Neue Swings meist unvorteilhaft.<br><br>

<strong>🎯 Regeln & Checklist:</strong><br>
• Nur Management bestehender Trades.<br>
• Kein neuer Swing ohne extrem starke Confluence.<br>
• AOI/HL/LH müssen absolut klar sein – selten am Freitag.<br><br>

<strong>✅ Strategie:</strong><br>
PnL schützen. Nicht versuchen, „die Woche zu retten“.<br><br>

<strong>🕓 Marktverhalten:</strong><br>
Vormittag brauchbar, Nachmittag illiquide.<br>
Stop-Runs vor Close häufig.<br><br>

<strong>📊 Wirtschaftsdaten:</strong><br>
<ul><li>Freitag = hoher News-Faktor (z. B. 14:30 Timeslot) – Kalender prüfen</li></ul><br>

<strong>🧠 Mentaler Fokus:</strong><br>
Risiko rausnehmen, Gewinne sichern.<br><br>

<strong>🧾 To-do:</strong><br>
<ul>
  <li>Wochenstatistik & Markups sichern</li>
  <li>Equity-Update machen</li>
</ul><br>

<strong>🪙 Krypto-Notiz:</strong><br>
Pre-Weekend Positioning – mögliche Sweeps am Abend.<br>

<hr style="opacity:.15;">

⚡ <strong>Daytrading</strong><br>

<strong>📌 Setup:</strong><br>
Scalping Day. Große Moves selten, Liquidity Grabs häufig.<br><br>

<strong>🎯 Regelintegration:</strong><br>
• Nur Rejection- & Liquidity-Trades.<br>
• Kein Blind-Breakout.<br>
• RR konservativ (1.0–2.0).<br><br>

<strong>🕓 Marktverhalten:</strong><br>
NY früh stark → dann abfallend.<br><br>

<strong>📊 Wirtschaftsdaten:</strong><br>
<ul><li>News-Zeiten ernst nehmen – Freitag ist unberechenbar</li></ul><br>

<strong>🧠 Mentaler Fokus:</strong><br>
Disziplin. Kein Revenge. Früh Schluss möglich.<br><br>

<strong>🧾 To-do:</strong><br>
<ul>
  <li>Journal abschließen & Montag planen</li>
</ul><br>

<strong>🪙 Krypto-Notiz:</strong><br>
BTC oft Pre-Move fürs Wochenende.
`,


"Samstag": `
⬛ <strong>Samstag</strong> – Forex geschlossen, Krypto aktiv<br><br>

🌀 <strong>Swing</strong><br>

<strong>📌 Setup:</strong><br>
Illiquide. Keine Swing-Entries.<br><br>

<strong>🎯 Regeln:</strong><br>
• Kein Trading – nur Vorbereitung & Backtesting.<br><br>

<strong>🧾 To-do:</strong><br>
<ul>
  <li>Markups & Review</li>
  <li>Setup-Bibliothek pflegen</li>
</ul><br>

<strong>🪙 Krypto-Notiz:</strong><br>
Mean-Reversion / Range. Kleine Size, klarer SL.<br>

<hr style="opacity:.15;">

⚡ <strong>Daytrading</strong><br>

<strong>📌 Setup:</strong><br>
Kleine, algorithmische Ranges.<br><br>

<strong>🎯 Strategie:</strong><br>
Nur Range-Edges traden. Kein Overtrading.<br><br>

<strong>🧠 Mentaler Fokus:</strong><br>
Wenn unsicher → pause.<br><br>

<strong>🧾 To-do:</strong><br>
<ul>
  <li>Alarme für Sonntag/Montag setzen</li>
</ul>
`,


"Sonntag": `
⬛ <strong>Sonntag</strong> – Weekly Open Vorbereitung<br><br>

🌀 <strong>Swing</strong><br>

<strong>📌 Setup:</strong><br>
Pre-Open Struktur: Weekly Levels formen sich.<br><br>

<strong>🎯 Regeln:</strong><br>
• Keine Swings ohne Montag-Struktur.<br>
• Heute nur Vorbereitung.<br><br>

<strong>🧾 To-do:</strong><br>
<ul>
  <li>Wochenziele, Risikolimits, Kalender setzen</li>
  <li>Key-Levels für Mo/Di finalisieren</li>
</ul><br>

<strong>🪙 Krypto-Notiz:</strong><br>
BTC/ETH zeigen oft ersten Wochen-Richtungsimpuls.<br>

<hr style="opacity:.15;">

⚡ <strong>Daytrading</strong><br>

<strong>📌 Setup:</strong><br>
Dünne Liquidität. Pre-Open Moves oft trügerisch.<br><br>

<strong>🎯 Strategie:</strong><br>
Optional traden, sehr kleine Größe.<br>
Fokus auf Dokumentation & Vorbereitung.<br><br>

<strong>🕓 Marktverhalten:</strong><br>
US-Abend kann Montag-Asia beeinflussen.<br><br>

<strong>🧠 Mentaler Fokus:</strong><br>
Vorbereitung > Execution.<br><br>

<strong>🧾 To-do:</strong><br>
<ul>
  <li>Alarme, Templates & Charts vorbereiten</li>
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
	   const wd = new Date().getDay();

  if (wd === 0 || wd === 6) {
    console.log("⏹️ DaySummary deaktiviert (Wochenende).");
    return;
  }

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
const activeSessions = getCurrentSessions(minutesNow);



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

    // Sauberer HTML-Block
    const wrapped = `
      <div class="day-details-wrapper" style="--day-color:${sessionColor}">
        <div class="day-details-title">📅 ${dayName}</div>
        <div class="day-details-content">
          ${raw.replaceAll("<strong>", `<strong class="day-strong">`)}
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

function applySidebarDrawerSessionColor(sessionName) {
  const color = sessionColors[sessionName] || "#ffffff";
  document.documentElement.style.setProperty("--session-color", color);
}


function setDSTMode(mode) {
  if (mode === "auto") {
    localStorage.removeItem("dstMode");
  } else {
    localStorage.setItem("dstMode", mode);
  }
  location.reload();
}

function getDSTLabel() {
  const mode = localStorage.getItem("dstMode");
  if (mode === "summer") return "Sommer";
  if (mode === "winter") return "Winter";
  return isSummerTimeEU() ? "auto" : "auto";
}

/* =========================================================
   🌍 DST POPUP UI (Open/Close + Active-State)
   ========================================================= */

const dstPanel = document.getElementById("panel-settings-dst");
const dstButtons = document.querySelectorAll("#panel-settings-dst .dst-switch button");
const dstInfo = document.getElementById("dstInfo");
const dstClose = document.querySelector("#panel-settings-dst .dst-close");

// Öffnen (z. B. über dein Sidebar Settings-Menü)
function openDSTSettings() {
  if (!dstPanel) return;
  dstPanel.classList.remove("hidden");
  syncDSTUI();
}

// Schließen
function closeDSTSettings() {
  if (!dstPanel) return;
  dstPanel.classList.add("hidden");
}

// UI Sync
function syncDSTUI() {
  const mode = localStorage.getItem("dstMode") || "auto";

  dstButtons.forEach(btn => {
    btn.classList.toggle("active", btn.dataset.dst === mode);
  });

  if (dstInfo) {
    dstInfo.textContent =
      mode === "summer" ? "🌞 Sommerzeit (MESZ) manuell aktiv" :
      mode === "winter" ? "❄️ Winterzeit (MEZ) manuell aktiv" :
      "🧠 Automatische Umstellung aktiv (empfohlen)";
  }
}

// Buttons → setDSTMode + UI Sync
dstButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    setDSTMode(btn.dataset.dst);
    syncDSTUI();
  });
});

// Close Button
if (dstClose) dstClose.addEventListener("click", closeDSTSettings);

// Klick auf Overlay (außerhalb Popup) → Close
if (dstPanel) {
  dstPanel.addEventListener("click", e => {
    if (e.target === dstPanel) closeDSTSettings();
  });
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