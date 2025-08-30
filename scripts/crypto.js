// scripts/crypto.js – übernimmt nur am Wochenende (Sa/So) ALLE UI-Felder
// Unter der Woche macht session.js alles; keine Überschneidung.

(function () {
  // ---- nur am Wochenende aktivieren ----
  const isWeekend = (d = new Date()) => {
    const wd = d.getDay(); // So=0, Mo=1,... Sa=6
    return wd === 0 || wd === 6;
  };
  if (!isWeekend()) return; // Werktage: komplett inert

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

  // ---- Weekend-"Sessions" (nur für Anzeige/Details) ----
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
  "Samstag": `
🪙 <strong>Krypto (Samstag)</strong><br>
• Sehr geringe Liquidität – Institutionelle sind raus.<br>
• Markt bewegt sich oft in engen Ranges → Range-Trading ideal.<br>
• BTC/ETH reagieren meist nur auf Retail-Struktur (Range-Edges, Liquidity Sweeps).<br>
• Daytrading-Setup: <br>
&nbsp;&nbsp;– Fokus auf Range-High/Low, Mean-Reversion, kleine Scalps.<br>
&nbsp;&nbsp;– Kein aggressives Trendtrading – Breakouts scheitern oft.<br>
• Zusatz: Samstag eignet sich gut für <em>Backtesting, Journal & Watchlist-Updates</em>.<br>
`,

  "Sonntag": `
🪙 <strong>Krypto (Sonntag)</strong><br>
• Vormittag: Sehr ruhiger Markt, kaum Volumen.<br>
• Nachmittag/Abend (ab 18–20 Uhr): „Pre-Move“ der neuen Woche setzt oft ein.<br>
• Smart Money positioniert sich → häufig Fakeouts oder Liquidity Sweeps vor dem Montag.<br>
• Daytrading-Setup: <br>
&nbsp;&nbsp;– Fokus auf BTC/ETH an wichtigen Levels kurz vor Forex-Open.<br>
&nbsp;&nbsp;– Typisch: schnelle Moves Sonntagabend → oft Richtungsanzeige für Montag.<br>
• Zusatz: Keine Overnights ohne Plan – am Montag kann alles kippen.<br>
`
};


  // ---- UI: Day-Summary + klickbare Details ----
  function updateDaySummaryWeekend() {
    if (!daySummaryEl) return;
    const days = ["Sonntag","Montag","Dienstag","Mittwoch","Donnerstag","Freitag","Samstag"];
    const now = new Date(); 
    const dayName = days[now.getDay()];

    daySummaryEl.textContent = `🗓️ ${dayName} – Krypto 24/7 aktiv (Forex geschlossen)`;

    daySummaryEl.onclick = () => {
      if (!dayDetailsEl) return;
      const raw = dayDetailsMap[dayName] || "📘 Krypto aktiv. Dokumentation & Vorbereitung.";
      const wrap = `
        <div class="crypto-details-card">
          <div class="crypto-details-title">📅 ${dayName}</div>
          <div>${raw}</div>
        </div>`;
      const vis = dayDetailsEl.style.display === "block";
      dayDetailsEl.style.display = vis ? "none" : "block";
      if (!vis) dayDetailsEl.innerHTML = wrap;
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

    // Detailbox (Markup ohne Inline-Styles)
    if (sessionDetailsBox) {
      let weekDaysHtml = "<ul>";
      s.weekDaysInfo?.forEach(({day, text}) => { weekDaysHtml += `<li><strong>${day}:</strong> ${text}</li>`; });
      weekDaysHtml += "</ul>";

      sessionDetailsBox.innerHTML = `
        <strong>🪙 ${s.name}</strong><br>
        📅 Start: ${formatHM(s.start)} Uhr<br>
        🕓 Ende: ${formatHM(s.end)} Uhr<br>
        ℹ️ ${s.info}
        ${weekDaysHtml}
      `;
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
