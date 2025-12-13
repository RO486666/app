// scripts/crypto.js – übernimmt nur am Wochenende (Sa/So) ALLE UI-Felder
// Unter der Woche macht session.js alles; keine Überschneidung.

(function () {
  const isWeekend = (d = new Date()) => {
    const wd = d.getDay(); // Sonntag = 0, Montag = 1 … Samstag = 6
    return wd === 0 || wd === 6; // true nur Sa/So
  };

  if (!isWeekend()) return; // wenn kein Wochenende → Script sofort stoppen

  // ---- DOM Refs ----
  const $  = (s, r=document) => r.querySelector(s);
  const sessionText       = $("#sessionText");
  const sessionInfoEl     = $("#sessionInfo");
  const sessionDetailsBox = $("#sessionDetailsBox");
  const progressBar       = $("#progressBar");
  const daySummaryEl      = $("#daySummary");
  const dayDetailsEl      = $("#dayDetails");

  // ---- fehlende Helfer sicher abfangen (No-Op) ----
  window.updateTabButtonColors        ||= function(){};
  window.applyStatsBoxGlow            ||= function(){};
  window.showSessionProgress          ||= function(){};
  window.showAlert                    ||= function(){};
  window.showSessionStartNotification ||= function(){};
  window.buildSessionDetails          ||= function(){};

  // ---- Utils ----
  const pad2 = n => String(n).padStart(2,"0");
  const formatHM = mins => `${pad2(Math.floor(mins/60)%24)}:${pad2(mins%60)}`;

  // ---- Weekend-"Sessions" ----
  const weekendSessions = [
    {
      name: "Crypto 24/7",
      start: 0,
      end: 1440,
      info: "Krypto ist durchgehend offen. Am Wochenende dünnere Liquidität → Range/Mean-Reversion häufig.",
      weekDaysInfo: [
        { day: "Samstag", text: "Range-Edges & klare Level funktionieren gut. Enge SL." },
        { day: "Sonntag", text: "Abends oft Pre-Move für die neue Woche. Alarme & Watchlist." }
      ]
    }
  ];

// ---- Day-Details nur für Wochenende ----
const dayDetailsMap = { 
"Samstag":` 
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


// ---- UI: Day-Summary + klickbare Details ----
function updateDaySummaryWeekend() {
  if (!daySummaryEl || !dayDetailsEl) return;

  const days = ["Sonntag","Montag","Dienstag","Mittwoch","Donnerstag","Freitag","Samstag"];
  const now = new Date(); 
  const dayName = days[now.getDay()];

  daySummaryEl.textContent =
    `🗓️ ${dayName} – Krypto 24/7 aktiv (Forex geschlossen)`;

  daySummaryEl.onclick = () => {
    const raw =
      dayDetailsMap[dayName] ||
      "📘 Krypto aktiv. Dokumentation & Vorbereitung.";

    const isOpen = dayDetailsEl.style.display === "block";

    dayDetailsEl.style.display = isOpen ? "none" : "block";

    if (!isOpen) {
      dayDetailsEl.innerHTML = `
        📅 <strong>${dayName}</strong><br><br>
        ${raw}
      `;
    }
  };
}


  // ---- UI: Header/Info/Details/Progress (ohne Inline-Styles) ----
  function renderCrypto() {
    const now  = new Date();
    const mins = now.getHours()*60 + now.getMinutes();
    const percent = (mins / 1439) * 100;

    // Fortschrittsbalken-Breite via CSS-Variable
    if (progressBar) {
      progressBar.style.setProperty("--progress", `${percent}%`);
    }

    // Aktive "Session" (Crypto 24/7)
    const s = weekendSessions[0];

    // Kopfzeile (nur Text)
    if (sessionText) {
      sessionText.textContent = `🕒 ${pad2(now.getHours())}:${pad2(now.getMinutes())} | Aktive Session: ${s.name}`;
    }

    // Info (nur Text)
    if (sessionInfoEl) {
      sessionInfoEl.textContent = "Krypto-Wochenende: dünnere Liquidität, Range/Mean-Reversion bevorzugt. Vorsicht mit Slippage/Spreads.";
    }
  }

  function toggleWeekendClass() {
    if (isWeekend()) {
      document.body.classList.add("is-crypto-weekend");
    } else {
      document.body.classList.remove("is-crypto-weekend");
    }
  }

  // ---- Boot ----
  window.addEventListener("load", () => {
    toggleWeekendClass();
    updateDaySummaryWeekend();
    renderCrypto();
    setInterval(renderCrypto, 60_000); // minütlich
  });
})();
