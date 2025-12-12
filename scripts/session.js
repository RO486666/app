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
   info: `
🟦 <strong>Sydney Session</strong><br><br>

<strong>📌 Charakter & Zweck:</strong><br>
Übergangsphase aus der Deadzone. Markt erwacht langsam, Commitment fehlt. Sydney dient primär dem Aufbau von Liquidity und ersten Range-Grenzen – nicht der Trendsetzung.<br><br>

<strong>🧠 Typisches Marktverhalten:</strong><br>
• Sehr geringe Volumen-Tiefe.<br>
• Viele kleine Pushes ohne Follow-Through.<br>
• Fake-Structure (Mini HL/LH) extrem häufig.<br>
• Range-Highs/Lows entstehen, die später von Tokyo oder London geholt werden.<br><br>

<strong>⚠️ Typische Fallen:</strong><br>
• Frühe Breakouts sind zu 90% Fake.<br>
• Struktur wirkt „sauber“, ist aber unreif.<br>
• Entries ohne höheres AOI fast immer Noise.<br><br>

<strong>🎯 Trading-Relevanz:</strong><br>
Kein aktiver Trading-Fokus. Optimal für:<br>
• Mapping (Asia-Range vorbereiten)<br>
• Liquidity-Pools identifizieren<br>
• Bias-Vorarbeit für Tokyo/London<br><br>

<strong>✅ Erlaubte Aktionen:</strong><br>
• Levels markieren (Range High / Low).<br>
• HTF-AOI beobachten, aber nicht aggressiv handeln.<br>
• Geduld. Sydney traden = statistischer Nachteil.<br><br>

<strong>🧠 Mentales Playbook:</strong><br>
Nicht gierig werden. Sydney ist Vorbereitung, kein Spielfeld.
`

  },

  {
    name: "Tokyo",
    start: 60,
    end: 600,
    info: `
🟦 <strong>Tokyo Session</strong><br><br>

<strong>📌 Charakter & Zweck:</strong><br>
Strukturbildende Session. Tokyo formt das Asia-High/Low und etabliert oft die erste verwertbare Intraday-Struktur – besonders in JPY-Paaren.<br><br>

<strong>🧠 Typisches Marktverhalten:</strong><br>
• Saubere HL/LH-Sequenzen auf LTF.<br>
• Geringe, aber konstante Volatilität.<br>
• Range-Erweiterung statt Explosion.<br>
• Markt respektiert Levels sehr präzise.<br><br>

<strong>⚠️ Typische Fallen:</strong><br>
• Späte Breakouts kurz vor London werden oft gesweept.<br>
• „Zu perfekte“ Strukturen enden häufig als Liquidity für London.<br><br>

<strong>🎯 Trading-Relevanz:</strong><br>
• Sehr gut für Struktur-Lesung & Bias-Building.<br>
• Scalps möglich bei klarer AOI + Rejection.<br>
• Ideale Vorbereitung für London Sweep & Expansion.<br><br>

<strong>✅ Best Practice:</strong><br>
• Asia-High/Low sauber definieren.<br>
• Struktur dokumentieren, nicht überhandeln.<br>
• Gewinne klein halten – Tokyo ist kein Expansion-Markt.<br><br>

<strong>🧠 Mentales Playbook:</strong><br>
Diszipliniert, ruhig, technisch. Tokyo belohnt Geduld, nicht Aggression.
`

  },

  {
    name: "London",
    start: 540,
    end: 1020,
    info: `
🟦 <strong>London Session</strong><br><br>

<strong>📌 Charakter & Zweck:</strong><br>
Primäre Trend- und Entscheidungs-Session. London entscheidet, ob Asia respektiert oder gebrochen wird. Hier entsteht Directional Bias für den gesamten Tag.<br><br>

<strong>🧠 Typisches Marktverhalten:</strong><br>
• Liquidity-Grab über Asia-H/L fast immer vorhanden.<br>
• Danach impulsive Expansion oder klare Reversals.<br>
• Struktur-Shift (MSS/CHOCH) sehr sauber erkennbar.<br><br>

<strong>⚠️ Typische Fallen:</strong><br>
• Direkt in den ersten Push springen = Stop-Hunt.<br>
• Kein vorheriger Sweep → Setup statistisch schwach.<br><br>

<strong>🎯 Trading-Relevanz:</strong><br>
• Beste Session für Daytrading & Intraday-Swings.<br>
• Perfekt für ICT-Setups (Sweep → MSS → Entry).<br>
• HTF-Bias MUSS alignen.<br><br>

<strong>✅ Best Practice:</strong><br>
• Erst Sweep abwarten, dann handeln.<br>
• Entries nach Struktur-Shift, nicht im Impuls.<br>
• RR 2R+ realistisch erreichbar.<br><br>

<strong>🧠 Mentales Playbook:</strong><br>
Geduldig bleiben, dann entschlossen handeln. London verzeiht keine Ungeduld.
`

  },

  {
    name: "New York",
    start: 870,
    end: 1380,
   info: `
🟦 <strong>New York Session</strong><br><br>

<strong>📌 Charakter & Zweck:</strong><br>
Volumen- und Finalisierungsphase. New York entscheidet, ob London fortgesetzt oder komplett neutralisiert wird. Besonders aggressiv bei Gold & Indizes.<br><br>

<strong>🧠 Typisches Marktverhalten:</strong><br>
• Sehr häufige Sweeps über London Highs/Lows.<br>
• Erst Manipulation, dann echter Move.<br>
• Starker Volumenwechsel nach NY-Open.<br><br>

<strong>⚠️ Typische Fallen:</strong><br>
• London-Continuation blind handeln = Todesurteil.<br>
• Market Orders im News-Flow verbrennen Konten.<br><br>

<strong>🎯 Trading-Relevanz:</strong><br>
• Sehr stark für Reversals & Deep Pullbacks.<br>
• Gold & NAS100 extrem technisch bei AOI-Reaktion.<br>
• News-Context zwingend erforderlich.<br><br>

<strong>✅ Best Practice:</strong><br>
• London-Struktur kritisch hinterfragen.<br>
• Sweep + klare Rejection abwarten.<br>
• Weniger Trades, höhere Qualität.<br><br>

<strong>🧠 Mentales Playbook:</strong><br>
Respekt vor Volatilität. NY bestraft Overconfidence brutal.
`

  },

  {
    name: "London Killzone",
    start: 420,
    end: 660,
  info: `
🟥 <strong>London Killzone</strong><br><br>

<strong>📌 Charakter & Zweck:</strong><br>
Manipulationsphase vor der London-Expansion. Ziel dieser Zone ist es, Asia-Liquidity gezielt zu holen und schwache Marktteilnehmer aus dem Markt zu drücken, bevor die eigentliche Richtung startet.<br><br>

<strong>🧠 Typisches Marktverhalten:</strong><br>
• Sehr häufige Sweeps über Asia-Highs/Lows.<br>
• Fake-Breakouts auf M1–M5.<br>
• Schnelle Pushes ohne Follow-Through.<br>
• Danach klarer Strukturbruch (MSS/CHOCH) auf LTF.<br><br>

<strong>⚠️ Typische Fallen:</strong><br>
• Breakout-Trades direkt nach Session-Open.<br>
• Entries ohne vorherigen Liquidity-Grab.<br>
• „Early Entries“ vor bestätigtem Shift.<br><br>

<strong>🎯 Trading-Relevanz:</strong><br>
• Beste Zone für präzise ICT-Entries.<br>
• Reversal-Setups nach Sweep + MSS extrem valide.<br>
• Expansion startet meist NACH der Killzone.<br><br>

<strong>✅ Best Practice:</strong><br>
• Sweep → Pause → Struktur-Shift abwarten.<br>
• Entry nur an klarer AOI (OB / FVG / EQ).<br>
• Kleine Stops, saubere RR-Struktur (2R+).<br><br>

<strong>🧠 Mentales Playbook:</strong><br>
Nicht der Erste sein. Der Markt zeigt dir hier bewusst falsche Richtungen.
`

  },

  {
    name: "New York Killzone",
    start: 810,
    end: 1020,
   info: `
🟥 <strong>New York Killzone</strong><br><br>

<strong>📌 Charakter & Zweck:</strong><br>
Übergang von London zu US-Volumen. Diese Killzone entscheidet, ob London fortgesetzt oder komplett neutralisiert wird. Extrem aggressiv bei Gold & Indizes.<br><br>

<strong>🧠 Typisches Marktverhalten:</strong><br>
• Sehr häufige Sweeps über London Highs/Lows.<br>
• Volumenwechsel exakt zum NY-Open.<br>
• Tiefe Pullbacks vor echter Expansion.<br>
• News-Impulse verstärken Manipulation.<br><br>

<strong>⚠️ Typische Fallen:</strong><br>
• London-Trend blind weiterhandeln.<br>
• Market Orders während News.<br>
• Zu enge Stops im Volumen-Shift.<br><br>

<strong>🎯 Trading-Relevanz:</strong><br>
• Perfekt für Reversal oder Trend-Continuation NACH Sweep.<br>
• Gold (XAUUSD) reagiert besonders technisch.<br>
• Indizes zeigen saubere AOI-Reaktionen.<br><br>

<strong>✅ Best Practice:</strong><br>
• London-Struktur kritisch prüfen.<br>
• Erst Liquidity-Grab, dann Entry.<br>
• Weniger Trades, maximale Präzision.<br><br>

<strong>🧠 Mentales Playbook:</strong><br>
Respekt vor Volumen. New York bestraft Ungeduld kompromisslos.
`

  },

  {
    name: "Deadzone",
    start: 1380,
    end: 0,
    info: `
⬛ <strong>Deadzone</strong><br><br>

<strong>📌 Charakter & Zweck:</strong><br>
Niedrigste Liquiditätsphase des Tages. Markt pausiert, Algo-gesteuerte Mean-Reversion dominiert. Kein institutionelles Commitment.<br><br>

<strong>🧠 Typisches Marktverhalten:</strong><br>
• Extrem enge Ranges.<br>
• Zufällige Spikes ohne Struktur.<br>
• Keine Follow-Through-Moves.<br>
• Stops werden technisch „abgeholt“, nicht aus Versehen.<br><br>

<strong>⚠️ Typische Fallen:</strong><br>
• Scalping aus Langeweile.<br>
• Breakouts handeln.<br>
• Struktur interpretieren, wo keine existiert.<br><br>

<strong>🎯 Trading-Relevanz:</strong><br>
• Kein Trading empfohlen.<br>
• Nur Mapping & Vorbereitung für Asia/Sydney.<br>
• Algo-Noise, keine Edge.<br><br>

<strong>✅ Erlaubte Aktionen:</strong><br>
• Levels markieren.<br>
• Vorherige Session auswerten.<br>
• Bias-Notizen vorbereiten.<br><br>

<strong>🧠 Mentales Playbook:</strong><br>
Deadzone ist Schlafzeit. Wer hier tradet, zahlt Lerngebühren.
`

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
  infoText =
    minutes >= 1380
      ? "🌙 Sydney startet – Übergang aus der Deadzone, Liquidity-Aufbau, kein Trend-Commitment."
      : minutes < 180
      ? "🦘 Sydney aktiv – enge Ranges, Fake-Struktur häufig, Mapping statt Trading."
      : "🌅 Späte Sydney – Range steht, Vorbereitung für Tokyo-Sweeps.";
}

else if (name === "Tokyo") {
  infoText =
    minutes < 180
      ? "🌏 Tokyo eröffnet – Asia-High/Low formt sich, erste saubere Struktur."
      : minutes < 360
      ? "🇯🇵 Tokyo aktiv – HL/LH möglich, Expansion begrenzt, Liquidity für London."
      : "🛑 Späte Tokyo – Bewegungen oft nur Liquidity vor London.";
}

else if (name === "London Killzone") {
  infoText =
    "⚠️ London Killzone – Asia-Liquidity wird geholt, Fake-Breakouts vor echter Direction.";
}

else if (name === "London") {
  infoText =
    minutes < 720
      ? "💷 London aktiv – nach Sweep folgt Direction, beste Phase für strukturierte Entries."
      : minutes < 840
      ? "😴 London Mittag – Volumen raus, Chop & Pullbacks dominieren."
      : "📈 Späte London – Positionierung vor NY, Breakouts kritisch prüfen.";
}

else if (name === "New York Killzone") {
  infoText =
    "🔥 NY Killzone – London-Liquidity wird gesweept, Manipulation vor echtem Move.";
}

else if (name === "New York") {
  infoText =
    minutes < 1080
      ? "🇺🇸 NY aktiv – Volumenwechsel, Reversal oder Continuation nach London-Sweep."
      : minutes < 1200
      ? "⚠️ Post-NY-Open – Struktur läuft, keine späten Breakouts jagen."
      : "🌃 Späte NY – Gewinnmitnahmen, Struktur wird instabil.";
}

else if (minutes >= 720 && minutes < 840) {
  infoText =
    "😴 Mittagliche Deadzone – geringes Volumen, Chop, statistisch schlechter Entry-Bereich.";
}

else if (minutes >= 1380 || minutes < 60) {
  if (activeSessions.length === 0) {
    infoText =
      "🌙 Nacht-Deadzone – extrem niedrige Liquidität, Algo-Noise, kein Trading empfohlen.";
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
  const now = new Date();
  const wd = now.getDay();

  // Wochenende ausblenden
  if (wd === 0 || wd === 6) {
    console.log("⏹️ DaySummary deaktiviert (Wochenende).");
    return;
  }

  const days = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];
  const dayName = days[wd];

  const minutes = now.getHours() * 60 + now.getMinutes();

  // 🔹 Tagesphasen (Zeitlogik, keine Asset-Wiederholungen)
const infos = {
  "Montag": [
    { end: 600,  text: "🧭 Wochenstart – Markt tastet sich ab, Strukturaufbau dominiert." },      // 00:00–10:00
    { end: 960,  text: "📉 Vormittag – frühe Ranges & Liquidity-Sweeps, Trend noch unreif." },   // 10:00–16:00
    { end: 1440, text: "📊 Später Montag – Commitment gering, keine erzwungenen Trends." }       // 16:00–24:00
  ],

  "Dienstag": [
    { end: 600,  text: "📈 Früher Dienstag – Wochenbias wird aktiviert." },                      // 00:00–10:00
    { end: 960,  text: "🚀 Hauptphase – saubere Expansion & Trendfortsetzung." },               // 10:00–16:00
    { end: 1440, text: "⚖️ Spätphase – Struktur steht, Pullbacks dominieren." }                 // 16:00–24:00
  ],

  "Mittwoch": [
    { end: 600,  text: "⚠️ Midweek – Markt prüft bestehende Strukturen." },                      // 00:00–10:00
    { end: 960,  text: "🔥 Entscheidungsphase – Reversal oder Beschleunigung sehr typisch." },  // 10:00–16:00
    { end: 1440, text: "📉 Später Mittwoch – Richtung meist bestätigt, Volumen sinkt." }        // 16:00–24:00
  ],

  "Donnerstag": [
    { end: 600,  text: "🔥 Vorbereitung – Markt positioniert sich für Expansion." },            // 00:00–10:00
    { end: 960,  text: "🚀 Haupttrend-Phase – stärkste Moves der Woche." },                     // 10:00–16:00
    { end: 1440, text: "⚖️ Spätphase – Trends laufen, neue Entries selektiv." }                // 16:00–24:00
  ],

  "Freitag": [
    { end: 600,  text: "📅 Wochenfinale – Fokus auf saubere Abschlüsse." },                      // 00:00–10:00
    { end: 960,  text: "⚠️ Hauptphase – Gewinnmitnahmen & schnelle Reversals." },               // 10:00–16:00
    { end: 1440, text: "🛑 Später Freitag – Struktur zerfällt, Risiko stark erhöht." }           // 16:00–24:00
  ]
};


  const phases = infos[dayName];
  if (!phases) return;

  const phase = phases.find(p => minutes < p.end);
  const dayText = phase ? phase.text : "";

  // 🔹 Session-Farbe bestimmen
  const activeSessions = getCurrentSessions(minutes);
  const dominantSession =
    activeSessions.find(s => s.name !== "Crypto") || activeSessions[0];
  const sessionColor = sessionColors[dominantSession?.name] || "#00ffcc";

  // 🔹 UI setzen
  const el = document.getElementById("daySummary");
  if (!el) return;

  el.textContent = `🗓️ ${dayName} – ${dayText}`;
  el.style.background = sessionColor + "22";
  el.style.color = sessionColor;
  el.style.border = `1px solid ${sessionColor}88`;
  el.style.boxShadow = `0 0 8px ${sessionColor}`;
  el.style.textShadow = `0 0 3px ${sessionColor}`;
  el.style.cursor = "pointer";

  // 🔹 Klick → Detailansicht
  el.onclick = () => {
    const dayDetailsEl = document.getElementById("dayDetails");
    if (!dayDetailsEl) return;

    const raw = dayDetailsMap?.[dayName] || "📆 Keine Details verfügbar.";

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

// 🔹 Initialisierung
document.addEventListener("DOMContentLoaded", () => {
  updateDaySummary();
  setInterval(updateDaySummary, 60000); // jede Minute aktualisieren
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