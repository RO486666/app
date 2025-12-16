/* ==========================================================================
   1. DOM-REFERENZEN & KONFIGURATION
   ========================================================================== */

// UI Elemente
const sessionText = document.getElementById("sessionText");
const sessionProgressEl = document.getElementById("sessionProgressDisplay");
const sessionInfoEl = document.getElementById("sessionInfo");
const sessionDetailsBox = document.getElementById("sessionDetailsBox");
const alertBox = document.getElementById("alertBox");
const progressBar = document.getElementById("progressBar");
const progressContainer = document.querySelector(".progress-container");
const daySummaryEl = document.getElementById("daySummary");
const dayDetailsEl = document.getElementById("dayDetails");

// DST Settings Elemente
const dstPanel = document.getElementById("panel-settings-dst");
const dstButtons = document.querySelectorAll("#panel-settings-dst .dst-switch button");
const dstInfo = document.getElementById("dstInfo");
const dstClose = document.querySelector("#panel-settings-dst .dst-close");

// Audio
const alertSound = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');

// State Variablen
let lastAlertSession = null;
let lastActiveSessionState = "";
let isFirstLoad = true; // <--- NEU: Damit wir den Start erkennen

// Farben-Konfiguration
const sessionColors = {
    "Sydney": "#3388ff",
    "Tokyo": "#00aaff",
    "London": "#ffd700",
    "New York": "#ff4500",
    "London Killzone": "#ccff00",
    "New York Killzone": "#ff8800",
    "Deadzone": "#333333",
    // Fallback für DaySummary, falls nötig
    "Crypto": "#9900ff" 
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
`
};

/* ==========================================================================
   2. EINSTELLUNGEN & ALARME (JETZT MIT ZEIT-AUSWAHL)
   ========================================================================== */

// Einstellungen laden
let currentNotifyMode = localStorage.getItem("alphaNotifyMode") || "all";
let warningMinutes = parseInt(localStorage.getItem("alphaWarningTime")) || 5; // Standard: 5 Min

// Modus setzen (Alles an, Push, etc.)
function setNotifyMode(mode) {
    currentNotifyMode = mode;
    localStorage.setItem("alphaNotifyMode", mode);
    updateNotifyUI();
    
    const modeNames = { 'all': "🔊 Alles an", 'push': "📳 Nur Push", 'sound': "🔈 Nur Ton", 'off': "🔕 Stumm" };
    showAlert(`✅ ${modeNames[mode]}`);

    // Audio Test
    if ((mode === 'all' || mode === 'sound') && alertSound) {
        alertSound.volume = 1.0;
        alertSound.currentTime = 0;
        alertSound.play().catch(e => console.log("Audio Autoplay blockiert"));
    }
    // Push Test
    if (mode === 'all' || mode === 'push') {
        if (navigator.vibrate) navigator.vibrate([50, 50, 50]);
        if (Notification.permission === "granted" && navigator.serviceWorker.controller) {
            navigator.serviceWorker.ready.then(reg => {
                reg.showNotification("🔔 Test erfolgreich!", {
                    body: `Modus: ${modeNames[mode]}`,
                    icon: "/app/icon-192.png",
                    vibrate: [50, 50, 50],
                    tag: "test-feedback"
                });
            });
        }
    }
}

// ⏳ Vorwarnzeit setzen (5, 10, 30, 60)
function setWarningTime(mins) {
    warningMinutes = mins;
    localStorage.setItem("alphaWarningTime", mins);
    updateNotifyUI();
    
    if(navigator.vibrate) navigator.vibrate(30);
    console.log(`Vorwarnzeit gesetzt auf: ${mins} Minuten`);
}

// UI Aktualisieren
function updateNotifyUI() {
    // 1. Modus Buttons
    const btns = document.querySelectorAll(".btn-notify");
    btns.forEach(btn => {
        if (btn.dataset.mode === currentNotifyMode) {
            btn.classList.add("active");
            btn.style.border = "2px solid #00ffcc";
            btn.style.background = "rgba(0, 255, 204, 0.1)";
        } else {
            btn.classList.remove("active");
            btn.style.border = "1px solid #333";
            btn.style.background = "transparent";
        }
    });

    // 2. Zeit Buttons
    const timeBtns = document.querySelectorAll(".btn-time");
    timeBtns.forEach(btn => {
        if (parseInt(btn.dataset.time) === warningMinutes) {
            btn.classList.add("active");
            btn.style.border = "1px solid #00ffcc";
            btn.style.background = "rgba(0, 255, 204, 0.15)";
            btn.style.color = "#00ffcc";
        } else {
            btn.classList.remove("active");
            btn.style.border = "1px solid #444";
            btn.style.background = "transparent";
            btn.style.color = "#fff";
        }
    });
}

function closeNotifySettings() {
    const p = document.getElementById("panel-settings-notify");
    if(p) p.classList.add("hidden");
}

/* ==========================================================================
   3. HELPER FUNKTIONEN (Zentralisiert & Bereinigt)
   ========================================================================== */

// Konvertiert Hex (#RRGGBB) zu RGBA mit Opacity
function hexToRgba(hex, opacity) {
    hex = hex.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

// Formatiert Minuten (z.B. 600) zu "HH:MM"
function formatHM(mins) {
    const h = Math.floor(mins / 60) % 24;
    const m = mins % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

// Holt aktuelle Minuten seit Mitternacht
function getMinutesNow() {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes();
}

function requestNotificationPermission() {
    if ("Notification" in window && Notification.permission !== "granted") {
        Notification.requestPermission().then(permission => {
            console.log("🔐 Notification permission:", permission);
        });
    }
}

function showAlert(msg) {
    if (alertBox) {
        alertBox.textContent = msg;
        alertBox.style.display = "block";
        setTimeout(() => { alertBox.style.display = "none"; }, 5000);
    }
    console.log(msg);
}

/* ==========================================================================
   4. NOTIFICATION LOGIK (Robust & "Unkaputtbar")
   ========================================================================== */

// 🔥 SESSION START
function showSessionStartNotification(name, info) {
    if (currentNotifyMode === 'off') return;

    const title = `AlphaOS: ${name} gestartet!`;
    const cleanInfo = info.replace(/<[^>]*>/g, "").substring(0, 100) + "...";

    // Prüfen, ob wir überhaupt dürfen
    if (Notification.permission === "granted") {
        
        // VERSUCH 1: Über Service Worker (Besser für Handy-Vibration)
        if (navigator.serviceWorker && navigator.serviceWorker.controller) {
            navigator.serviceWorker.ready.then(registration => {
                registration.showNotification(title, {
                    body: cleanInfo,
                    icon: "/app/icon-192.png",
                    vibrate: [200, 100, 200, 100, 400],
                    tag: "session-start",
                    renotify: true,
                    requireInteraction: true // Zwingt User zum Klicken
                });
            }).catch(e => {
                // Falls SW fehlschlägt -> Fallback sofort auslösen
                new Notification(title, { body: cleanInfo, icon: "/app/icon-192.png" });
            });
        } 
        // VERSUCH 2: Direkte Benachrichtigung (Der "Sicherheits-Fallback")
        else {
            console.log("⚠️ SW nicht aktiv, sende Standard-Notification");
            try {
                const notif = new Notification(title, {
                    body: cleanInfo,
                    icon: "/app/icon-192.png",
                    vibrate: [200, 100, 200, 100, 400],
                    tag: "session-start"
                });
            } catch (e) {
                console.error("Notification Error:", e);
            }
        }
    }

    // AUDIO (Unabhängig von Push)
    if ((currentNotifyMode === 'all' || currentNotifyMode === 'sound') && alertSound) {
        alertSound.volume = 1.0;
        alertSound.currentTime = 0;
        alertSound.play().catch(e => console.log("Audio braucht Interaktion"));
    }
}

// 🔥 SESSION ENDE
function showSessionEndNotification(name) {
    if (currentNotifyMode === 'off') return;

    const title = `AlphaOS: ${name} Beendet`;
    const bodyText = "Liquidität sinkt. Risk Management prüfen.";

    if (Notification.permission === "granted") {
        // Versuch 1: SW
        if (navigator.serviceWorker && navigator.serviceWorker.controller) {
            navigator.serviceWorker.ready.then(registration => {
                registration.showNotification(title, {
                    body: bodyText,
                    icon: "/app/icon-192.png",
                    vibrate: [100, 50, 100], 
                    tag: "session-end",
                    renotify: true
                });
            });
        } 
        // Versuch 2: Standard
        else {
            new Notification(title, {
                body: bodyText,
                icon: "/app/icon-192.png", 
                vibrate: [100, 50, 100]
            });
        }
    }

    if ((currentNotifyMode === 'all' || currentNotifyMode === 'sound') && alertSound) {
        alertSound.volume = 0.5;
        alertSound.currentTime = 0;
        alertSound.play().catch(e => {});
    }
}

// 🔥 VORWARNUNG
function showSessionWarningNotification(name, minutes) {
    if (currentNotifyMode === 'off') return;
    const title = `AlphaOS: ${name} bald!`;
    const bodyText = `Startet in ${minutes} Minuten.`;

    if ((currentNotifyMode === 'all' || currentNotifyMode === 'push') && Notification.permission === "granted") {
        if (navigator.serviceWorker && navigator.serviceWorker.controller) {
            navigator.serviceWorker.ready.then(reg => {
                reg.showNotification(title, {
                    body: bodyText,
                    icon: "/app/icon-192.png",
                    vibrate: [50, 50],
                    tag: "session-warning"
                });
            });
        } else {
            new Notification(title, { body: bodyText, vibrate: [50, 50] });
        }
    }
    
    if ((currentNotifyMode === 'all' || currentNotifyMode === 'sound') && alertSound) {
        alertSound.volume = 0.3; 
        alertSound.currentTime = 0;
        alertSound.play().catch(e => {});
    }
}
/* =========================================================
   🧪 TEST-TOOLS (Für Simulation)
   ========================================================= */

function testSessionStart() {
    const selector = document.getElementById("testSessionSelect");
    if (!selector) return;
    
    const sessionName = selector.value;
    const sessionObj = sessions.find(s => s.name === sessionName);
    const infoText = sessionObj ? sessionObj.info : "Test-Simulation gestartet.";

    console.log(`⏳ Timer gestartet: Start von ${sessionName} in 5s...`);
    showAlert(`⏳ Warte 5s... (${sessionName} Start)`);

    setTimeout(() => {
        console.log(`🚀 FEUER: Simuliere Start von ${sessionName}`);
        showSessionStartNotification(sessionName, infoText);
    }, 5000);
}

function testSessionEnd() {
    const selector = document.getElementById("testSessionSelect");
    if (!selector) return;
    
    const sessionName = selector.value;

    console.log(`⏳ Timer gestartet: Ende von ${sessionName} in 5s...`);
    showAlert(`⏳ Warte 5s... (${sessionName} Ende)`);

    setTimeout(() => {
        console.log(`🏁 FEUER: Simuliere Ende von ${sessionName}`);
        showSessionEndNotification(sessionName);
    }, 5000);
}

/* ==========================================================================
   5. DST / ZEITMODUS LOGIK
   ========================================================================== */

function isSummerTimeEU(date = new Date()) {
    const year = date.getFullYear();
    const march = new Date(year, 2, 31);
    march.setDate(march.getDate() - march.getDay());
    const october = new Date(year, 9, 31);
    october.setDate(october.getDate() - october.getDay());
    return date >= march && date < october;
}

function getDSTOffsetMinutes() {
    const mode = localStorage.getItem("dstMode"); // null | winter | summer
    if (mode === "summer") return 60; 
    if (mode === "winter") return 0;  
    return isSummerTimeEU() ? 60 : 0;
}

function getDSTLabel() {
    const mode = localStorage.getItem("dstMode");
    if (mode === "summer") return "Sommer";
    if (mode === "winter") return "Winter";
    return isSummerTimeEU() ? "Auto" : "Auto";
}

function setDSTMode(mode) {
    if (mode === "auto") {
        localStorage.removeItem("dstMode");
    } else {
        localStorage.setItem("dstMode", mode);
    }
    location.reload();
}

/* ==========================================================================
   6. CORE SESSION LOGIK
   ========================================================================== */

function getShiftedSessions() {
    const offset = getDSTOffsetMinutes();
    return sessions.map(s => {
        let start = s.start + offset;
        let end = s.end + offset;
        if (start >= 1440) start -= 1440;
        if (end >= 1440) end -= 1440;
        return { ...s, start, end };
    });
}

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

// ⚠️ BUGFIX: Sortierung hinzugefügt, um sicherzustellen, dass 'next' korrekt ist
function getMinutesToNextSession(minNow) {
    const shifted = getShiftedSessions();
    shifted.sort((a, b) => a.start - b.start);
    
    // Suche Startzeiten in der Zukunft
    const futureStarts = shifted.map(s => s.start).filter(start => start > minNow);
    
    if (futureStarts.length === 0) {
        // Wenn heute nichts mehr kommt, nimm die allererste von morgen
        return (1440 - minNow) + shifted[0].start;
    }
    return Math.min(...futureStarts) - minNow;
}

/* ==========================================================================
   7. UI FUNKTIONEN & STYLING
   ========================================================================== */

function updateSessionTextStyle(activeSessionName) {
    if (!sessionText) return;
    const color = sessionColors[activeSessionName] || "#ffffff";

    document.documentElement.style.setProperty("--session-accent", color);
    document.documentElement.style.setProperty("--session-color", color);
    document.documentElement.style.setProperty("--box-color", color);
    // Schatten-Variablen hier aktualisieren wie im Original...
    sessionText.style.setProperty("--session-text-color", color);
}

function updateGradientBar(colors) {
    if (!progressBar || !progressContainer) return;
    if (!colors || colors.length === 0) return;

    const lastColor = colors[colors.length - 1];

    if (colors.length === 1) {
        const c = colors[0];
        progressBar.style.background = c;
        progressBar.style.boxShadow = `0 0 15px ${c}`;
    } else {
        const gradientString = colors.join(", ");
        progressBar.style.background = `linear-gradient(90deg, ${gradientString})`;
        progressBar.style.boxShadow = `0 0 20px ${lastColor}`;
    }
    progressContainer.style.boxShadow = `0 0 15px ${lastColor}44`;
    progressContainer.style.borderColor = `${lastColor}44`;
}

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
        "Sydney": "#0a0e1a", "Tokyo": "#0a1018", "London": "#1b1a0e",
        "New York": "#1a0e0e", "London Killzone": "#12160a", "New York Killzone": "#1a1408",
    };

    const sessionColorClassMap = {
        "Sydney": "session-sydney", "Tokyo": "session-tokyo", "London": "session-london",
        "New York": "session-ny", "London Killzone": "session-killzone", "New York Killzone": "session-killzone",
    };

    if (sessionDetailsBox) {
        sessionDetailsBox.className = "session-details-box"; // Reset
        if (sessionColorClassMap[sessionName]) {
            sessionDetailsBox.classList.add(sessionColorClassMap[sessionName]);
        }
    }

    document.body.style.setProperty("--session-glow", glowMap[sessionName] || "radial-gradient(ellipse at bottom, rgba(255,255,255,0.1) 0%, transparent 70%)");
    document.body.style.setProperty("--session-bg-color", baseColor[sessionName] || "#111");
}

function applySidebarDrawerSessionColor(sessionName) {
    const color = sessionColors[sessionName] || "#ffffff";
    document.documentElement.style.setProperty("--session-color", color);
}

// Helper: Zeitformatierung für Countdown
function formatDuration(totalMinutes) {
    if (totalMinutes < 0) totalMinutes = 0;
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

// Helper: Restzeit berechnen
function getSessionRemaining(session, minNow) {
    let targetEnd = session.end;
    if (session.end < session.start) {
        if (minNow >= session.start) {
            targetEnd += 1440;
        }
    }
    return targetEnd - minNow;
}

// Helper: Nächste Session finden (Bugfix inkludiert)
function getNextSessionInfo(minNow) {
    const shifted = getShiftedSessions();
    shifted.sort((a, b) => a.start - b.start);

    // Suche die erste Session, die HEUTE noch startet
    let next = shifted.find(s => s.start > minNow);
    let diff = 0;

    if (next) {
        diff = next.start - minNow;
    } else {
        next = shifted[0];
        diff = (1440 - minNow) + next.start;
    }

    return { session: next, diff: diff };
}


/* ==========================================================================
   📌 HAUPTFUNKTION: Session Details (Mit Countdown & Next Box)
   ========================================================================== */

function buildSessionDetails() {
    if (!sessionDetailsBox) return;
    
    const minutes = getMinutesNow();
    const activeSessions = getCurrentSessions(minutes);
    const nextInfo = getNextSessionInfo(minutes); 

    let htmlContent = "";

    // 1. HEADER
    htmlContent += `
    <div class="session-details-header">
        <span class="header-deco"></span>
        SESSION INTELLIGENCE
        <span class="header-deco"></span>
    </div>`;

    if (activeSessions.length > 0) {
        activeSessions.forEach(s => {
            const label = s.name.includes("Killzone") ? "🔥" :
                s.name.includes("New York") ? "🇺🇸" :
                s.name.includes("London") ? "💷" :
                s.name.includes("Tokyo") ? "🌏" :
                s.name.includes("Sydney") ? "🌙" : "ℹ️";
            
            const color = sessionColors[s.name] || "#fff";
            const remainingMins = getSessionRemaining(s, minutes);
            const remainingStr = formatDuration(remainingMins);

            htmlContent += `
            <div class="session-box-clean" style="--box-color: ${color}">
                <div class="session-title">${label} ${s.name}</div>
                <div class="session-meta-grid">
                    <div class="session-row" style="color: #ffcc00;">
                        <strong>⏱️ Noch:</strong> ${remainingStr}
                    </div>
                    <div class="session-row">
                        <strong>📅 Start:</strong> ${formatHM(s.start)} Uhr
                    </div>
                    <div class="session-row">
                        <strong>🕓 Ende:</strong> ${formatHM(s.end)} Uhr
                    </div>
                </div>
                <div class="session-info-text">${s.info}</div>
            </div>`;
        });
    } else {
        htmlContent += `
        <div class="session-empty">
            Keine aktive Session – Markt ist ruhig.<br>
            Bereite dich auf die nächste Phase vor.
        </div>`;
    }

    // 2. FOOTER: NÄCHSTE SESSION BOX
    if (nextInfo && nextInfo.session) {
        const nextName = nextInfo.session.name;
        const nextColor = sessionColors[nextName] || "#ffffff";
        
        htmlContent += `
        <div class="session-next">
            🔜 Nächste: 
            <span class="next-name" style="
                color: ${nextColor}; 
                text-shadow: 0 0 10px ${nextColor}, 0 0 20px ${nextColor}44;
                font-weight: 800;
                text-transform: uppercase;">
                ${nextName}
            </span> 
            in ${formatDuration(nextInfo.diff)}
        </div>`;
    }

    sessionDetailsBox.innerHTML = htmlContent;
}

// 📌 HAUPTFUNKTION: Aktualisiert die Real-Time Bar & Texte
function updateRealTimeBar() {
    const wd = new Date().getDay(); 
    if (wd === 0 || wd === 6) {
        console.log("⏹️ Session.js deaktiviert (Wochenende).");
        return;
    }

    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const mins = String(now.getMinutes()).padStart(2, "0");
    const minutes = now.getHours() * 60 + now.getMinutes();
    const percent = (minutes / 1439) * 100;

    // Progress Bar
    if (progressBar) {
        progressBar.style.width = `${percent}%`;
        progressBar.style.background = "linear-gradient(270deg, #00ffcc, #ff00cc, #9900ff)";
    }
    if (progressContainer) {
        progressContainer.style.boxShadow = "0 0 14px 4px rgba(153, 0, 255, 0.4)";
    }

    // Sessions ermitteln
    const activeSessions = getCurrentSessions(minutes);
    const names = activeSessions.map(s => s.name);

    if (typeof updateTabButtonColors === "function") updateTabButtonColors(names);
    if (names.length > 0 && typeof applyStatsBoxGlow === "function") {
        applyStatsBoxGlow(names[0]);
    }

    const activeNames = names.length > 0 ? `| Aktive Session: ${names.join(" + ")}` : "| Keine Session aktiv";
    if (sessionText) {
        sessionText.textContent = `🕒 ${hours}:${mins} (${getDSTLabel()}) ${activeNames}`;
    }

    const colors = names.map(n => sessionColors[n] || "#666");
    updateGradientBar(colors);

    // Progress Hook
    if (document.getElementById("sessionProgressDisplay") && typeof showSessionProgress === "function") {
        showSessionProgress(activeSessions, minutes);
    }

    const name = activeSessions.length > 0 ? activeSessions[0].name : "";
    let infoText = "Keine aktiven Sessions – Markt wahrscheinlich ruhig.";

    // Infotext Logik (Gekürzt für Übersicht, Logik bleibt gleich)
    if (name === "Sydney") {
        infoText = minutes >= 1380 ? "🌙 Sydney startet – Übergang aus der Deadzone." : 
                   minutes < 180 ? "🦘 Sydney aktiv – enge Ranges." : "🌅 Späte Sydney.";
    }
    else if (name === "Tokyo") {
        infoText = minutes < 180 ? "🌏 Tokyo eröffnet – Asia-High/Low." : 
                   minutes < 360 ? "🇯🇵 Tokyo aktiv – Strukturaufbau." : "🛑 Späte Tokyo.";
    }
    else if (name === "London Killzone") infoText = "⚠️ London Killzone – Manipulation vor Direction.";
    else if (name === "London") {
        infoText = minutes < 720 ? "💷 London aktiv – Expansion." : 
                   minutes < 840 ? "😴 London Mittag – Chop." : "📈 Späte London.";
    }
    else if (name === "New York Killzone") infoText = "🔥 NY Killzone – Aggressive Sweeps.";
    else if (name === "New York") {
        infoText = minutes < 1080 ? "🇺🇸 NY aktiv – Volumen & Reversal." : 
                   minutes < 1200 ? "⚠️ Post-NY-Open – Struktur läuft." : "🌃 Späte NY – Close.";
    }
    else if (minutes >= 720 && minutes < 840) infoText = "😴 Mittagliche Deadzone.";
    else if (minutes >= 1380 || minutes < 60) {
        if (activeSessions.length === 0) infoText = "🌙 Nacht-Deadzone – Algo-Noise.";
    }

    updateBodyBackground(name);
    
    if (sessionInfoEl) {
        if (!sessionInfoEl.innerHTML.trim() || sessionInfoEl.textContent !== infoText) {
            sessionInfoEl.textContent = infoText;
        }
        if (sessionColors[name]) {
            const infoColor = sessionColors[name];
            sessionInfoEl.style.background = hexToRgba(infoColor, 0.07);
            sessionInfoEl.style.color = infoColor;
            sessionInfoEl.style.textShadow = `0 0 2px ${infoColor}, 0 0 6px ${hexToRgba(infoColor, 0.3)}`;
            sessionInfoEl.style.boxShadow = `inset 0 0 6px ${hexToRgba(infoColor, 0.15)}`;
        } else {
            sessionInfoEl.style.background = "transparent";
            sessionInfoEl.style.color = "#ccc";
            sessionInfoEl.style.textShadow = "none";
            sessionInfoEl.style.boxShadow = "none";
        }
    }

    updateSessionTextStyle(name);
    applySidebarDrawerSessionColor(name);

    // ============================================================
    // ⏰ ALERT LOGIK
    // ============================================================
    const currentNamesList = activeSessions.map(s => s.name);
    const currentSessionString = currentNamesList.join(",");
    const lastNamesList = lastActiveSessionState ? lastActiveSessionState.split(",").filter(n => n) : [];

    // 1. Session START & ENDE Alarme
    if (isFirstLoad) {
        lastActiveSessionState = currentSessionString;
        isFirstLoad = false; 
    } else if (currentSessionString !== lastActiveSessionState) {
        const newSession = activeSessions.find(s => !lastNamesList.includes(s.name));
        if (newSession) {
            showSessionStartNotification(newSession.name, newSession.info);
            showAlert(`🚀 START: ${newSession.name}`);
        }
        const endedSessionName = lastNamesList.find(name => !currentNamesList.includes(name));
        if (endedSessionName) {
            showSessionEndNotification(endedSessionName);
            showAlert(`🏁 ENDE: ${endedSessionName}`);
        }
        lastActiveSessionState = currentSessionString;
    }

    // 2. 🔥 VORWARNUNG
    const minutesToNext = getMinutesToNextSession(minutes);
    
    if (minutesToNext <= warningMinutes && minutesToNext > 0) {
        const nextInfo = getNextSessionInfo(minutes);
        if (nextInfo && nextInfo.session) {
            const warningKey = `warn-${nextInfo.session.name}-${warningMinutes}`;
            if (lastAlertSession !== warningKey) {
                showAlert(`⚠️ Achtung: ${nextInfo.session.name} startet in ${minutesToNext} Min!`);
                showSessionWarningNotification(nextInfo.session.name, minutesToNext);
                lastAlertSession = warningKey;
            }
        }
    } else {
        if (minutesToNext > warningMinutes) lastAlertSession = null;
    }
}

// Update Day Summary (Wochentag-Anzeige)
function updateDaySummary() {
    const now = new Date();
    const wd = now.getDay();

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

    const activeSessions = getCurrentSessions(minutes);
    const dominantSession = activeSessions.find(s => s.name !== "Crypto") || activeSessions[0];
    const sessionColor = sessionColors[dominantSession?.name] || "#00ffcc";

    if (!daySummaryEl) return;

    daySummaryEl.textContent = `🗓️ ${dayName} – ${dayText}`;
    daySummaryEl.style.background = sessionColor + "22";
    daySummaryEl.style.color = sessionColor;
    daySummaryEl.style.border = `1px solid ${sessionColor}88`;
    daySummaryEl.style.boxShadow = `0 0 8px ${sessionColor}`;
    daySummaryEl.style.textShadow = `0 0 3px ${sessionColor}`;
    daySummaryEl.style.cursor = "pointer";

    // Click Handler für Day Details
    daySummaryEl.onclick = () => {
        if (!dayDetailsEl) return;
        const raw = dayDetailsMap?.[dayName] || "📆 Keine Details verfügbar.";
        const wrapped = `
      <div class="day-details-wrapper" style="--day-color:${sessionColor}">
        <div class="day-details-title">📅 ${dayName}</div>
        <div class="day-details-content">
          ${raw.replaceAll("<strong>", `<strong class="day-strong">`)}
        </div>
      </div>`;

        const isVisible = dayDetailsEl.style.display === "block";
        dayDetailsEl.style.display = isVisible ? "none" : "block";
        if (!isVisible) dayDetailsEl.innerHTML = wrapped;
    };
}


/* ==========================================================================
   8. INITIALISIERUNG & EVENT LISTENERS
   ========================================================================== */

// DST UI Management
function openDSTSettings() {
    if (!dstPanel) return;
    dstPanel.classList.remove("hidden");
    syncDSTUI();
}

function closeDSTSettings() {
    if (!dstPanel) return;
    dstPanel.classList.add("hidden");
}

function syncDSTUI() {
    const mode = localStorage.getItem("dstMode") || "auto";
    if (dstButtons) {
        dstButtons.forEach(btn => {
            btn.classList.toggle("active", btn.dataset.dst === mode);
        });
    }
    if (dstInfo) {
        dstInfo.textContent =
            mode === "summer" ? "🌞 Sommerzeit (MESZ) manuell aktiv" :
            mode === "winter" ? "❄️ Winterzeit (MEZ) manuell aktiv" :
            "🧠 Automatische Umstellung aktiv (empfohlen)";
    }
}

// Session Details Toggle
if (sessionText) {
    sessionText.addEventListener("click", () => {
        if (!sessionDetailsBox) return;
        const visible = sessionDetailsBox.style.display === "block";
        sessionDetailsBox.style.display = visible ? "none" : "block";
        if (!visible) {
            buildSessionDetails();
        }
    });
}

// DST Listeners
if (dstButtons) {
    dstButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            setDSTMode(btn.dataset.dst);
            syncDSTUI();
        });
    });
}
if (dstClose) dstClose.addEventListener("click", closeDSTSettings);
if (dstPanel) {
    dstPanel.addEventListener("click", e => {
        if (e.target === dstPanel) closeDSTSettings();
    });
}

// Main Load
window.addEventListener("load", () => {
    requestNotificationPermission();
    updateRealTimeBar();
    
    // HIER DIE STRICHE WEGMACHEN:
    updateDaySummary(); 
    
    updateNotifyUI();

    setInterval(updateRealTimeBar, 60000); 
    
    // HIER AUCH STRICHE WEGMACHEN:
    setInterval(updateDaySummary, 60000); 

    setInterval(() => {
        if (sessionDetailsBox && sessionDetailsBox.style.display === "block") {
            buildSessionDetails();
        }
    }, 30000);
});