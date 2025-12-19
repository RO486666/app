/* ==========================================================================
   1. DOM-REFERENZEN & KONFIGURATION
   ========================================================================== */

// UI Elemente
const sessionText = document.getElementById("sessionText");
const sessionProgressEl = document.getElementById("sessionProgressDisplay");
const sessionInfoEl = document.getElementById("sessionInfo");
const sessionDetailsBox = document.getElementById("sessionDetailsBox");
const progressBar = document.getElementById("progressBar");
const progressContainer = document.querySelector(".progress-container");
const daySummaryEl = document.getElementById("daySummary");
const dayDetailsEl = document.getElementById("dayDetails");

// DST Settings Elemente
const dstPanel = document.getElementById("panel-settings-dst");
const dstButtons = document.querySelectorAll("#panel-settings-dst .dst-switch button");
const dstInfo = document.getElementById("dstInfo");
const dstClose = document.querySelector("#panel-settings-dst .dst-close");

// State Variablen
let lastActiveSessionState = "";
let isFirstLoad = true;

// Farben-Konfiguration
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

/* =========================================================
   🧠 SESSION-DEFINITIONEN (Basisdaten, DST-frei)
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
   2. HELPER FUNKTIONEN
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

/* ==========================================================================
   3. DST / ZEITMODUS LOGIK
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
    const mode = localStorage.getItem("dstMode");
    if (mode === "summer") return 60; 
    if (mode === "winter") return 0;  
    return isSummerTimeEU() ? 60 : 0;
}

function getDSTLabel() {
    const mode = localStorage.getItem("dstMode");
    return (mode === "summer" || mode === "winter") ? (mode === "summer" ? "Sommer" : "Winter") : "Auto";
}

function setDSTMode(mode) {
    if (mode === "auto") localStorage.removeItem("dstMode");
    else localStorage.setItem("dstMode", mode);
    location.reload();
}

/* ==========================================================================
   5. CORE SESSION LOGIK
   ========================================================================== */

function getShiftedSessions() {
    const offset = getDSTOffsetMinutes();
    return sessions.map(s => {
        let start = s.start + offset;
        let end = s.end + offset;
        // Tagesüberlauf korrigieren
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

function getMinutesToNextSession(minNow) {
    const shifted = getShiftedSessions();
    const futureStarts = shifted.map(s => s.start).filter(start => start > minNow);
    if (futureStarts.length === 0)
        return shifted[0].start + 1440 - minNow;
    return Math.min(...futureStarts) - minNow;
}

/* ==========================================================================
   6. UI FUNKTIONEN & STYLING
   ========================================================================== */

function updateSessionTextStyle(activeSessionName) {
    if (!sessionText) return;
    const color = sessionColors[activeSessionName] || "#ffffff";

    document.documentElement.style.setProperty("--session-accent", color);
    document.documentElement.style.setProperty("--session-color", color);
    document.documentElement.style.setProperty("--box-color", color);

    sessionText.style.setProperty("--session-text-color", color);
    sessionText.style.setProperty("--session-border", `${color}66`);
    sessionText.style.setProperty("--session-box-shadow1", `${color}40`);
    sessionText.style.setProperty("--session-box-shadow2", `${color}20`);
    sessionText.style.setProperty("--session-box-shadow3", `${color}30`);
    sessionText.style.setProperty("--session-text-shadow1", `${color}66`);
    sessionText.style.setProperty("--session-text-shadow2", `${color}33`);
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


/* ==========================================================================
   📌 HELPER: Zeit-Berechnungen für Countdown & Next Session
   ========================================================================== */

// 1. Formatiert Minuten in "HH:MM" (für Countdowns)
function formatDuration(totalMinutes) {
    if (totalMinutes < 0) totalMinutes = 0;
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

// 2. Berechnet Restzeit der aktuellen Session
function getSessionRemaining(session, minNow) {
    let targetEnd = session.end;
    
    // Spezialfall: Session geht über Mitternacht (z.B. 22:00 - 02:00)
    if (session.end < session.start) {
        // Wenn wir aktuell VOR Mitternacht sind (z.B. 23:00), ist das Ende "morgen" (+1440 Min)
        if (minNow >= session.start) {
            targetEnd += 1440;
        }
    }
    return targetEnd - minNow;
}

// 3. Findet die NÄCHSTE Session (für die untere Box)
function getNextSessionInfo(minNow) {
    const shifted = getShiftedSessions();
    // Sortieren, damit wir die zeitlich nächste finden
    shifted.sort((a, b) => a.start - b.start);

    // Suche die erste Session, die HEUTE noch startet
    let next = shifted.find(s => s.start > minNow);
    let diff = 0;

    if (next) {
        diff = next.start - minNow;
    } else {
        // Falls heute keine mehr kommt, nimm die allererste von morgen früh
        next = shifted[0];
        diff = (1440 - minNow) + next.start;
    }

    return { session: next, diff: diff };
}

/* ==========================================================================
   📌 HAUPTFUNKTION: Session Details (Smart Sort: Echtzeit-Reihenfolge)
   ========================================================================== */
function buildSessionDetails() {
    if (!sessionDetailsBox) return;
    
    const minutes = getMinutesNow();
    let activeSessions = getCurrentSessions(minutes);
    const nextInfo = getNextSessionInfo(minutes);

    // ✅ SMART SORT: Sortiert Sessions nach ihrem tatsächlichen Erscheinen im Tagesverlauf
    activeSessions.sort((a, b) => {
        // Wir berechnen den "relativen Startwert"
        // Wenn eine Session einen sehr hohen Startwert hat (z.B. Sydney 23:00), 
        // ziehen wir 1440 ab, damit sie als "früheste" Session des Zyklus gilt.
        let startA = a.start > 1200 ? a.start - 1440 : a.start;
        let startB = b.start > 1200 ? b.start - 1440 : b.start;
        
        // b - a sorgt dafür, dass der höchste Wert (die neueste Zeit) oben steht
        return startB - startA;
    });

    let htmlContent = `
    <div class="session-details-header">
        <span class="header-deco"></span>
        SESSION INTELLIGENCE
        <span class="header-deco"></span>
    </div>`;

    if (activeSessions.length > 0) {
        activeSessions.forEach((s) => {
            const label = s.name.includes("Killzone") ? "🔥" :
                s.name.includes("New York") ? "🇺🇸" :
                s.name.includes("London") ? "💷" :
                s.name.includes("Tokyo") ? "🌏" :
                s.name.includes("Sydney") ? "🌙" : "ℹ️";
            
            const color = sessionColors[s.name] || "#fff";
            const remainingMins = getSessionRemaining(s, minutes);
            const remainingStr = formatDuration(remainingMins);

            htmlContent += `
            <div class="session-box-clean collapsible-session" 
                 style="--box-color: ${color}; cursor: pointer; margin-bottom: 12px;" 
                 onclick="this.classList.toggle('expanded')">
                
                <div class="session-header-row">
                    <div class="session-title" style="color: ${color}; font-weight: bold;">
                        ${label} ${s.name}
                    </div>
                    <div class="session-timer-badge">${remainingStr} left</div>
                </div>

                <div class="session-meta-grid">
                    <div class="session-row"><strong>📅 Start:</strong> ${formatHM(s.start)} Uhr</div>
                    <div class="session-row"><strong>🕓 Ende:</strong> ${formatHM(s.end)} Uhr</div>
                </div>

                <div class="session-info-content">
                    <div class="info-divider"></div>
                    <div class="playbook-text">
                        ${s.info}
                    </div>
                </div>
                
                <div class="click-hint">KLICKE FÜR STRATEGIE-DETAILS</div>
            </div>`;
        });
    } else {
        htmlContent += `<div class="session-empty">Keine aktive Session – Fokus auf Mapping.</div>`;
    }

    if (nextInfo && nextInfo.session) {
        const nextName = nextInfo.session.name;
        const nextColor = sessionColors[nextName] || "#ffffff";
        htmlContent += `
        <div class="session-next">
            🔜 NÄCHSTE: 
            <span class="next-name" style="color: ${nextColor}; text-shadow: 0 0 10px ${nextColor};">
                ${nextName}
            </span> 
            in ${formatDuration(nextInfo.diff)}
        </div>`;
    }

    sessionDetailsBox.innerHTML = htmlContent;
}

// 📌 HAUPTFUNKTION: Aktualisiert die Real-Time Bar & Texte
function updateRealTimeBar() {
    const wd = new Date().getDay(); // Sonntag=0, Samstag=6
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

    // Externe Hooks (Sicherheitscheck)
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

    // Falls externe Progress-Funktion existiert
    if (document.getElementById("sessionProgressDisplay") && typeof showSessionProgress === "function") {
        showSessionProgress(activeSessions, minutes);
    }

    if (progressContainer) {
        progressContainer.style.boxShadow = colors.length > 0 ?
            `0 0 12px 6px ${hexToRgba(colors[0], 0.6)}` :
            "0 0 12px 6px rgba(0,0,0,0)";
    }

    const name = activeSessions.length > 0 ? activeSessions[0].name : "";
    let infoText = "Keine aktiven Sessions – Markt wahrscheinlich ruhig.";

    // Infotext Logik

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
    
    if (sessionInfoEl) {
        // Text nur setzen wenn leer oder geändert
        if (!sessionInfoEl.innerHTML.trim() || sessionInfoEl.textContent !== infoText) {
            sessionInfoEl.textContent = infoText;
        }

        // Info Style anpassen
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
   6. INITIALISIERUNG
   ========================================================================== */

window.addEventListener("load", () => {
    updateRealTimeBar();
    updateDaySummary(); 
    setInterval(updateRealTimeBar, 60000); 
    setInterval(updateDaySummary, 60000); 

    if (sessionText) {
        sessionText.addEventListener("click", () => {
            sessionDetailsBox.style.display = sessionDetailsBox.style.display === "block" ? "none" : "block";
            if (sessionDetailsBox.style.display === "block") buildSessionDetails();
        });
    }

    if (dstButtons) {
        dstButtons.forEach(btn => btn.addEventListener("click", () => setDSTMode(btn.dataset.dst)));
    }
});