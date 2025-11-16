/* ==========================================================
   📘 PAIR PROFILE DATABASE – by Roman
   ========================================================== */

const pairProfileDB = {

  /* ==========================================================
     🔥 MAJORS
  ========================================================== */

"EUR/USD": {
  behavior: "Liquidestes Paar. Ruhiger Flow. Sehr sauberer Trendverlauf.",
  bestSessions: ["London"],
  bestDays: ["Mittwoch", "Freitag"],
  volatility: "Mittel",
  riskLevel: "Niedrig–Mittel",
  notes: [
    "🔎 ICT-Verhalten:",
    "• Typischer London Judas 7:55–8:15",
    "• Perfekt für Liquidity Grab → Displacement",
    "• Sehr zuverlässige Fair Value Gaps in 5M, 15M",
    "• Häufiger Sweep der Asia High/Low vor Trendstart",

    "🕒 Tagesstruktur:",
    "• 07:00–10:00 — Strukturaufbau (HL/LH)",
    "• 10:00–13:00 — Trendphase",
    "• 15:00–17:00 — NY Retracement",
    "• 18:00+ — Momentum fällt stark",

    "🌍 Sessions:",
    "• London — Haupttrendrichtung + sauberste Moves",
    "• NY — kleinere Sweeps + Erweiterung/Continuation",
    "• Tokyo — Range, guter Manipulations-Bereich",

    "⚠️ Gefahrzonen:",
    "• 10:00 EU News → harte Spikes",
    "• 14:30 US News → Volatilitätsschock",
    "• 15:30 NY Open → Fakeouts möglich",

    "🎯 Ideal-Setups:",
    "• London Killzone — FVG Entry",
    "• Breaker Block nach Asia Sweep",
    "• NY Retracement in Discount/Premium Zone"
  ]
},


"GBP/USD": {
  behavior: "Sehr volatil in London & NY. Viele Sweeps und starke Impulse.",
  bestSessions: ["London", "NY Overlap"],
  bestDays: ["Dienstag", "Donnerstag"],
  volatility: "Mittel–Hoch",
  riskLevel: "Hoch",
  notes: [
    "🔎 ICT-Verhalten:",
    "• Extrem ausgeprägter Judas Move (London 8:00–9:00)",
    "• Häufig Stop-Hunts an psychologischen Levels (00/50)",
    "• Reagiert brutal auf Liquidity Pools",
    "• Sehr impulsive MSS Moves",

    "🕒 Tagesstruktur:",
    "• 08:00–10:00 — London Engine Move",
    "• 11:00–13:00 — Konsolidierung",
    "• 15:00–17:00 — Zweite Trendwelle",

    "🌍 Sessions:",
    "• London — größte Moves des Tages",
    "• NY Overlap — oft Reversals",
    "• Tokyo — kaum relevant",

    "⚠️ Gefahrzonen:",
    "• 10:30 UK News (CPI, PMI) → Explosion",
    "• 14:30 US News → Killerbewegungen",
    "• 15:30 NY Open → Sweeps garantiert",

    "🎯 Ideal-Setups:",
    "• London Liquidity Grab → Continuation",
    "• NY Overlap Reversal Setups",
    "• FVG + Breaker Combo nach Sweep"
  ]
},


 "AUD/USD": {
  behavior: "Ruhiger Trend. Saubere Bewegungen, reagiert auf Sydney/Tokyo.",
  bestSessions: ["Tokyo", "Sydney"],
  bestDays: ["Dienstag", "Mittwoch"],
  volatility: "Niedrig–Mittel",
  riskLevel: "Niedrig",
  notes: [
    "🔎 ICT-Verhalten:",
    "• Sehr strukturierter Flow, wenig Chaos",
    "• FVGs im LTF werden fast immer respektiert",
    "• Reagiert stark auf Asia Range Liquidity",

    "🕒 Tagesstruktur:",
    "• 01:00–06:00 — Trendaufbau",
    "• 07:00–10:00 — Manipulation",
    "• 10:00–14:00 — London Fortsetzung",

    "🌍 Sessions:",
    "• Tokyo — sauberster Trend",
    "• London — trendverstärkend",
    "• NY — oft Range",

    "⚠️ Gefahrzonen:",
    "• RBA News → große Spikes",
    "• Asia Session High/Low Sweeps",

    "🎯 Ideal-Setups:",
    "• Asia Breakout → London Continuation",
    "• HL/LH im LTF mit FVG",
    "• Swing Structure Entries"
  ]
},


"NZD/USD": {
  behavior: "Sehr sauberer Trend. Ähnlich zu AUD/USD.",
  bestSessions: ["Tokyo", "Sydney"],
  bestDays: ["Dienstag", "Donnerstag"],
  volatility: "Niedrig–Mittel",
  riskLevel: "Niedrig",
  notes: [
    "🔎 ICT-Verhalten:",
    "• Sehr gute Trendstruktur",
    "• Liquidity Sweeps extrem sauber",
    "• Reagiert stark auf Premium/Discount Levels",

    "🕒 Tagesstruktur:",
    "• 01:00–06:00 — Haupttrend",
    "• 10:00–13:00 — London Retracement",
    "• 15:00–17:00 — NY Auslaufen",

    "🌍 Sessions:",
    "• Tokyo — beste Moves",
    "• London — Pullbacks",
    "• NY — langsam",

    "⚠️ Gefahrzonen:",
    "• RBNZ News → harte Bewegungen",
    "• Geringe Liquidität → Slippage möglich",

    "🎯 Ideal-Setups:",
    "• Tokyo HL/LH → Entry",
    "• LTF MSS nach Sweep",
    "• FVG Trendfortsetzung"
  ]
},


  "USD/CHF": {
  behavior: "Sehr ruhiges Paar. Wenig Fakeouts. Gute Pullbacks.",
  bestSessions: ["London", "NY"],
  bestDays: ["Mittwoch"],
  volatility: "Niedrig",
  riskLevel: "Sehr niedrig",
  notes: [
    "🔎 ICT-Verhalten:",
    "• Sehr 'saubere' Liquidity Runs",
    "• Kaum Judas Moves",
    "• Reagiert stark auf HTF Levels",

    "🕒 Tagesstruktur:",
    "• 07:00–12:00 — Haupttrend",
    "• 14:00–16:00 — US Nachrichten",
    "• 17:00+ — Stillstand",

    "🌍 Sessions:",
    "• London — beste Struktur",
    "• NY — solider Trendfortsatz",
    "• Tokyo — tot",

    "⚠️ Gefahrzonen:",
    "• News (FOMC etc.) können stärkeren Impact haben",

    "🎯 Ideal-Setups:",
    "• Pullback an HTF Block",
    "• MSS nach Sweep",
    "• Trendfolgende FVG Entries"
  ]
},


"USD/CAD": {
  behavior: "News-Sensibel wegen Ölpreis. Viele Sweeps.",
  bestSessions: ["NY"],
  bestDays: ["Mittwoch", "Freitag"],
  volatility: "Mittel–Hoch",
  riskLevel: "Mittel–Hoch",
  notes: [
    "🔎 ICT-Verhalten:",
    "• Liquidity Sweeps extrem häufig",
    "• Trendwechsel oft nach Öl-News",
    "• Oft Judas Move 14:30 NY Zeit",

    "🕒 Tagesstruktur:",
    "• 10:00–13:00 — NY Pre-Open",
    "• 14:30 — Riesige Bewegungen",
    "• 16:00 — Umkehrpunkte",

    "🌍 Sessions:",
    "• NY — beste Moves",
    "• London — chaotisch",
    "• Tokyo — uninteressant",

    "⚠️ Gefahrzonen:",
    "• Ölpreis News (WTI)",
    "• CAD CPI, Rate Decisions",

    "🎯 Ideal-Setups:",
    "• Liquidity Grab → MSS",
    "• 14:30 FVG Entry",
    "• Breaker nach News-Sweep"
  ]
},

"USD/JPY": {
  behavior: "Explosiv in Tokyo & NY. Extrem starke Momentum-Phasen.",
  bestSessions: ["Tokyo", "NY"],
  bestDays: ["Dienstag", "Donnerstag"],
  volatility: "Hoch",
  riskLevel: "Hoch",
  notes: [
    "🔎 ICT-Verhalten:",
    "• Sehr schnelle Displacements",
    "• Trendmonster — läuft oft 300+ Pips",
    "• Sweeps typisch am Tageshoch/-tief",

    "🕒 Tagesstruktur:",
    "• 01:00–05:00 — starke Trendphasen",
    "• 15:30 — NY Open Spikes",
    "• Abends — Konsolidierung",

    "🌍 Sessions:",
    "• Tokyo — stärkste Moves",
    "• NY — zweite Trendwelle",
    "• London — Zufall",

    "⚠️ Gefahrzonen:",
    "• BoJ News → tödliche Volatilität",
    "• Interventionen → 500 Pip Kerzen",

    "🎯 Ideal-Setups:",
    "• Trendfortsetzung nach FVG",
    "• MSS + Displacement",
    "• Asia Sweep → London Run"
  ]
},


  /* ==========================================================
     🔥 CROSSES
  ========================================================== */

"EUR/JPY": {
  behavior: "Sehr sauberer Trend. Weniger Fakeouts als GBP/JPY.",
  bestSessions: ["Tokyo", "London"],
  bestDays: ["Dienstag", "Donnerstag"],
  volatility: "Mittel–Hoch",
  riskLevel: "Mittel",
  notes: [
    "🔎 ICT-Verhalten:",
    "• Sehr strukturierter Flow, perfekt für HL/LH Entries",
    "• Liquidity Sweeps sauber und häufig am Asia High/Low",
    "• Trendfortsetzung läuft oft extrem sauber",
    "• Respektiert FVGs im 5M/15M fast perfekt",

    "🕒 Tagesstruktur:",
    "• 01:00–05:00 — Tokyo Trendphase",
    "• 07:00–10:00 — London Breakout",
    "• 15:00–17:00 — NY Counter-Move möglich",

    "🌍 Sessions:",
    "• Tokyo — Haupttrend, sehr sauber",
    "• London — Pullbacks + Trendbeschleunigung",
    "• NY — Konter oder zweite Bewegung",

    "⚠️ Gefahrzonen:",
    "• BoJ News → extrem starke Volatilität",
    "• 10:00 EU News → schnelle Sweeps",
    "• 15:30 NY Open → Chaos möglich",

    "🎯 Ideal-Setups:",
    "• Tokyo HL/LH + FVG Entry",
    "• Asia Sweep → London Trendmove",
    "• Breaker Blocks an 1H Zonen",
    "• NY Retracement → Continuation"
  ]
},


"GBP/JPY": {
  behavior: "König der Volatilität. Riesige Impulse. Sweeps überall.",
  bestSessions: ["London", "NY"],
  bestDays: ["Dienstag", "Donnerstag"],
  volatility: "Extrem",
  riskLevel: "Extrem",
  notes: [
    "🔎 ICT-Verhalten:",
    "• EXTREM cleaner Asia Sweep → London Explosion",
    "• Reagiert hypersensibel auf Liquidity Pools",
    "• MSS ist oft gewaltig (große 15M Kerzen)",
    "• Fair Value Gaps werden schnell gefillt",

    "🕒 Tagesstruktur:",
    "• 01:00–03:00 — Asia Manipulation",
    "• 08:00–10:00 — London Engine",
    "• 14:00–17:00 — NY Zweite Trendwelle",
    "• Abends — Mini-Range oder harte Umkehr",

    "🌍 Sessions:",
    "• Tokyo — Setup-Phase, HL/LH Struktur",
    "• London — Hauptmove, riesige Kerzen",
    "• NY — hohe Wahrscheinlichkeit für Reversal oder Extension",

    "⚠️ Gefahrzonen:",
    "• 10:30 UK News (CPI!)",
    "• JPY Intervention → 300–1000 Pips möglich",
    "• London Open Spikes sind tödlich",
    "• 15:30 NY Open → MASSIVE Sweeps",

    "🎯 Ideal-Setups:",
    "• Asia Sweep → London Displacement",
    "• MSS + FVG Entry (sehr stark!)",
    "• Breaker Block nach News-Sweep",
    "• Counter-Trend Elliott Liquidity Grab"
  ]
},


"AUD/JPY": {
  behavior: "Ruhig während Tokyo → ideal für strukturierte HL/LH Moves.",
  bestSessions: ["Tokyo"],
  bestDays: ["Dienstag"],
  volatility: "Mittel",
  riskLevel: "Niedrig–Mittel",
  notes: [
    "🔎 ICT-Verhalten:",
    "• Einer der saubersten Asia-Trendpaare",
    "• Perfekte HL/LH Struktur",
    "• FVG Respekt extrem hoch",
    "• Sehr klarer Liquidity Flow",

    "🕒 Tagesstruktur:",
    "• 01:00–05:00 — starke Trendbewegung",
    "• 07:00–10:00 — London macht kleine Manipulationen",
    "• 15:00–17:00 — NY ruhiger, aber saubere Reversals",

    "🌍 Sessions:",
    "• Tokyo — beste Zeit zum Traden",
    "• London — kleine Sweeps",
    "• NY — oft Range",

    "⚠️ Gefahrzonen:",
    "• BoJ Eingriffe → unberechenbar",
    "• RBA News wirken manchmal verstärkt",

    "🎯 Ideal-Setups:",
    "• HL/LH im 5M–15M",
    "• Asia Sweep → Trendfortsetzung",
    "• LTF MSS nach Premium/Discount Touch"
  ]
},


 "CAD/JPY": {
  behavior: "Trendstark. Weniger extrem als GBP/JPY. Sehr saubere Bewegungen.",
  bestSessions: ["Tokyo", "NY"],
  bestDays: ["Mittwoch"],
  volatility: "Mittel",
  riskLevel: "Mittel",
  notes: [
    "🔎 ICT-Verhalten:",
    "• Sehr saubere Liquidity Runs",
    "• Respektiert Marktstruktur",
    "• MSS eindeutig sichtbar",
    "• FVGs werden regelmäßig gefillt",

    "🕒 Tagesstruktur:",
    "• 01:00–05:00 — japanische Trendphase",
    "• 14:00–16:00 — CAD News → starker Impuls",
    "• 17:00 — oft klare Umkehrpunkte",

    "🌍 Sessions:",
    "• Tokyo — Trendbeginn",
    "• London — kleine Manipulationen",
    "• NY — große Impulse (Öl-News)",

    "⚠️ Gefahrzonen:",
    "• CAD News (CPI, BOC)",
    "• Ölpreisbewegungen beeinflussen stark",
    "• Japanische Interventionen",

    "🎯 Ideal-Setups:",
    "• NY Reversal nach Oil-Driven Spike",
    "• London Sweep → Tokyo Continuation",
    "• LTF MSS + FVG"
  ]
},


"NZD/JPY": {
  behavior: "Sauberes Trendverhalten. Ruhig & stabil.",
  bestSessions: ["Tokyo"],
  bestDays: ["Dienstag"],
  volatility: "Niedrig–Mittel",
  riskLevel: "Niedrig",
  notes: [
    "🔎 ICT-Verhalten:",
    "• Sehr klare Premium/Discount Reaktionen",
    "• Wenig Fakeouts",
    "• Struktur extrem sauber, perfekt für Anfänger",
    "• MSS sichtbar und stabil",

    "🕒 Tagesstruktur:",
    "• 01:00–05:00 — konstante Trendphase",
    "• 07:00–10:00 — kleiner Sweep",
    "• 15:00–17:00 — leichte Gegenbewegung",

    "🌍 Sessions:",
    "• Tokyo — bestes Setup-Potential",
    "• London — meist ruhig",
    "• NY — schwach",

    "⚠️ Gefahrzonen:",
    "• RBNZ News",
    "• Japan Interventionsgerüchte",

    "🎯 Ideal-Setups:",
    "• Trend-Einstieg im 5M/15M nach HL/LH",
    "• FVG Continuation Trades",
    "• Asia Sweep → Reentry"
  ]
},


"EUR/GBP": {
  behavior: "Langsames Paar. Wenig Impulse. Gut vorhersehbar.",
  bestSessions: ["London"],
  bestDays: ["Dienstag", "Mittwoch"],
  volatility: "Niedrig",
  riskLevel: "Niedrig",
  notes: [
    "🔎 ICT-Verhalten:",
    "• Sehr langsamer Markt, perfekte Struktur",
    "• Liquidity Zonen funktionieren außergewöhnlich gut",
    "• FVGs sind klein aber präzise",
    "• MSS verläuft oft kontrolliert und langsam",

    "🕒 Tagesstruktur:",
    "• 08:00–12:00 — smoother Flow",
    "• 14:30 — kleinerer USD-Impact",
    "• Nachmittags — Range",

    "🌍 Sessions:",
    "• London — einzige wichtige Session",
    "• NY — kaum Relevanz",
    "• Tokyo — tot",

    "⚠️ Gefahrzonen:",
    "• UK/EU News gleichzeitig → kurze starke Moves",

    "🎯 Ideal-Setups:",
    "• HL/LH im LTF",
    "• Range Breakouts → Retest Entry",
    "• Liquidity Grab an klaren Swing Points"
  ]
},


"AUD/CAD": {
  behavior: "Stabiler Trend. Wenig Fakeouts.",
  bestSessions: ["Tokyo", "London"],
  bestDays: ["Dienstag"],
  volatility: "Niedrig–Mittel",
  riskLevel: "Niedrig",
  notes: [
    "🔎 ICT-Verhalten:",
    "• Sehr ruhiges Paar, extrem strukturtreu",
    "• LTF MSS ist fast immer sauber",
    "• Liquidity Sweeps selten heftig",

    "🕒 Tagesstruktur:",
    "• 01:00–05:00 — Asia Trend Move",
    "• 09:00–12:00 — London leichte Manipulation",
    "• 15:00–17:00 — NY Auslaufen",

    "🌍 Sessions:",
    "• Tokyo — beste Trendphase",
    "• London — konsolidiert häufiger",
    "• NY — kaum relevant",

    "⚠️ Gefahrzonen:",
    "• CAD News",
    "• RBA News",

    "🎯 Ideal-Setups:",
    "• HL/LH Trendsetups",
    "• Asia Breakout → London Retest",
    "• Sehr saubere FVG-Einstiege"
  ]
},


"GBP/CHF": {
  behavior: "Volatil, aber nicht so verrückt wie GBP/JPY.",
  bestSessions: ["London"],
  bestDays: ["Donnerstag"],
  volatility: "Mittel–Hoch",
  riskLevel: "Mittel",
  notes: [
    "🔎 ICT-Verhalten:",
    "• Liquidity Sweeps typisch (00/50 Levels)",
    "• Sehr reaktionsfreudig auf HTF Zones",
    "• MSS oft sauber sichtbar",
    "• Perfekt für Premium/Discount Setups",

    "🕒 Tagesstruktur:",
    "• 08:00–10:00 — London Impulse",
    "• 11:00–14:00 — Retracement",
    "• 15:00+ — kleinerer Spike möglich",

    "🌍 Sessions:",
    "• London — höchste Qualität",
    "• NY — wenig relevant",
    "• Tokyo — tot",

    "⚠️ Gefahrzonen:",
    "• UK News",
    "• CHF Safe-Haven Spikes",

    "🎯 Ideal-Setups:",
    "• MSS nach Sweep",
    "• FVG Entries (sehr stark)",
    "• Rejection an HTF Block"
  ]
},


"NZD/CAD": {
  behavior: "Sehr ruhiges Paar. Wenig Whipsaws.",
  bestSessions: ["Tokyo"],
  bestDays: ["Mittwoch"],
  volatility: "Niedrig",
  riskLevel: "Niedrig",
  notes: [
    "🔎 ICT-Verhalten:",
    "• Extrem ruhiger, sauberer Flow",
    "• FVG und Block-Respekt sehr hoch",
    "• Perfekte Struktur für Anfänger",

    "🕒 Tagesstruktur:",
    "• 01:00–05:00 — Haupttrend",
    "• 10:00 — kleiner London Sweep",
    "• NY — kaum Aktivitäten",

    "🌍 Sessions:",
    "• Tokyo — beste Chancen",
    "• London — leichter Umschwung",
    "• NY — vernachlässigbar",

    "⚠️ Gefahrzonen:",
    "• RBNZ News",
    "• CAD News",

    "🎯 Ideal-Setups:",
    "• Strukturierte HL/LH Setups",
    "• Asia Sweep → Entry",
    "• Saubere FVG Trades"
  ]
},


"EUR/AUD": {
  behavior: "Richtungsstark. Große Bewegungen, aber sauber.",
  bestSessions: ["London"],
  bestDays: ["Donnerstag"],
  volatility: "Hoch",
  riskLevel: "Hoch",
  notes: [
    "🔎 ICT-Verhalten:",
    "• Sehr impulsiver Markt nach Liquidity Sweeps",
    "• FVGs extrem stark",
    "• Häufig asynchron zu AUD/USD & EUR/USD",
    "• MSS oft gewaltig",

    "🕒 Tagesstruktur:",
    "• 07:00–10:00 — Setup Phase",
    "• 10:00–12:00 — Breakout",
    "• 14:00–16:00 — große US-Impulsbewegung",

    "🌍 Sessions:",
    "• London — Haupttrend",
    "• NY — starke Newsbewegungen",
    "• Tokyo — Setup-Range",

    "⚠️ Gefahrzonen:",
    "• EU News",
    "• RBA + AUD News",
    "• Cross-Flow Chaos möglich",

    "🎯 Ideal-Setups:",
    "• Liquidity Grab → Displacement",
    "• Breaker Block Reentries",
    "• FVG Continuation Trades"
  ]
},


  /* ==========================================================
     🔥 METALLE
  ========================================================== */

"XAU/USD": {
  behavior: "Extrem News-driven. Brutale Impulse. Stop-Hunt Maschine.",
  bestSessions: ["NY Killzone", "NY Open"],
  bestDays: ["Mittwoch", "Freitag"],
  volatility: "Sehr hoch",
  riskLevel: "Extrem",
  notes: [
    "🔎 ICT-Verhalten:",
    "• Krassester Judas Move im gesamten Markt (NY 13:30–14:30)",
    "• Sehr klare Liquidity Sweeps über Asia High/Low",
    "• Displacement-Kerzen enorm groß – perfekt für FVG Entries",
    "• Reagiert extrem sauber auf Premium/Discount Levels (1H/4H)",

    "🕒 Tagesstruktur:",
    "• 02:00–06:00 — Asia Range (Manipulation Zone)",
    "• 08:00–11:00 — London Setup Phase",
    "• 13:30 — US Big News (CPI, PPI, Retail Sales)",
    "• 14:30 — Hauptmove! Explosiver Trendstart",
    "• 15:30 — NY Stock Open = höchster Liquidity Grab",
    "• 17:00 — Reversal oder Auslaufen",

    "🌍 Sessions:",
    "• Tokyo — Range, oft Sweep des Vortages",
    "• London — langsam, aber gute HL/LH Struktur",
    "• NY — alle großen Moves entstehen hier",

    "⚠️ Gefahrzonen:",
    "• 14:30 (US News) → tödliche Spikes",
    "• 15:30 (NY Open) → komplett unberechenbar",
    "• FOMC, NFP → 300+ Pip Moves in Sekunden",
    "• Jede Kerze kann manipuliert sein – Gold jagt immer Stopps!",

    "🎯 Ideal-Setups:",
    "• NY Killzone Liquidity Grab → FVG Entry",
    "• Sweeps über Asia High/Low → MSS → Displacement",
    "• CPI/NFP Fake Move → Reversal",
    "• 1H/4H OB Rejection mit LTF Confirmation",

    "📌 Besondere Eigenschaften:",
    "• Gold hat eine 100% berechenbare Stop Hunt Struktur täglich",
    "• Ideal für ICT Modelle (FVG, Breaker, Displacement)",
    "• News-Volatilität kann SL extrem schnell auslösen",
    "• Heatmap & Dollar-Index spielen große Rolle"
  ]
},


"XAG/USD": {
  behavior: "Silber: ähnlich wie Gold, aber chaotischer und explosiver.",
  bestSessions: ["NY"],
  bestDays: ["Dienstag"],
  volatility: "Sehr hoch",
  riskLevel: "Extrem",
  notes: [
    "🔎 ICT-Verhalten:",
    "• Super schnelle Sweeps – noch stärker als Gold",
    "• Extrem gefährlich vor US News",
    "• FVG Entries funktionieren gut, aber SL muss breiter sein",
    "• Charakteristisch: 1–3 Sekunden Liquiditätspicks",

    "🕒 Tagesstruktur:",
    "• 02:00–06:00 — Chaotische Asia Range",
    "• 08:00–10:00 — London Mini-Moves",
    "• 14:30 — Explosion sicher",
    "• 15:30 — Reversal-Spike oder Trendfortsetzung",
    "• 17:00 — Full Stabilization",

    "🌍 Sessions:",
    "• Tokyo — super messy",
    "• London — erste Richtungsfindung",
    "• NY — Haupt-Volatilität",

    "⚠️ Gefahrzonen:",
    "• US News (CPI, NFP, PPI) → GIGANTISCHE Sweeps",
    "• Silber reagiert stärker als Gold",
    "• Spread kann stark steigen",
    "• Spikes von 50–200 Pips in Sekunden",

    "🎯 Ideal-Setups:",
    "• Nur NY Killzone traden",
    "• FVG + MSS Combo",
    "• Asia High/Low Sweep → Entry in Richtung NY Trend",
    "• Trend-Einstiege nach 14:30 Manipulation",

    "📌 Besondere Eigenschaften:",
    "• Silber ist das unberechenbarste Metall",
    "• Liquidity räumt SILBER IMMER ab – keine Ausnahme",
    "• Sehr großes RR Potenzial (1:10 bis 1:30 möglich)",
    "• Trader mit schwachen Nerven dürfen Silber NICHT handeln"
  ]
},


  /* ==========================================================
     🔥 INDIZES
  ========================================================== */

"NAS100": {
  behavior: "Ultra-volatil. Technologietrends beeinflussen stark.",
  bestSessions: ["NY Open"],
  bestDays: ["Dienstag", "Donnerstag"],
  volatility: "Extrem",
  riskLevel: "Extrem",
  notes: [
    "🔎 ICT-Verhalten:",
    "• Krassester Judas Move aller Indizes",
    "• 14:30 und 15:30 sind Manipulationsmaschinen",
    "• Jeder Move beginnt mit Liquiditätssweep",
    "• MSS + Displacement funktioniert extrem gut",
    "• FVGs werden fast immer respektiert (besonders 5M–15M)",
    "• Premium/Discount auf 1H/4H fast 100% sauber",

    "🕒 Tagesstruktur:",
    "• 08:00–12:00 → Vorbereitungsphase, langsame HL/LH",
    "• 14:30 → US News Kickstart",
    "• 15:30 → New York Stock Open (maximale Gewalt!)",
    "• 16:00–17:00 → Trendfortsetzung",
    "• 19:00–21:00 → Reversal oder langsamer Abbau",

    "🌍 Sessions:",
    "• London — schwach, Vorbereitung",
    "• NY — alle Hauptmoves",
    "• Nachbörslich — Reversal Moves",

    "⚠️ Gefahrzonen:",
    "• 14:30 (CPI, PPI, FOMC)",
    "• 15:30 (Stock Market Open!)",
    "• FOMC → absolutes Chaos",
    "• Earnings Season → unberechenbar",

    "🎯 Ideal-Setups:",
    "• NY Open Liquidity Grab → FVG Entry",
    "• Asia Range Sweep → Trendmove in NY",
    "• 1H OB Rejection + 5M MSS",
    "• Breaker-Block Entries extrem stark",

    "📌 Besondere Eigenschaften:",
    "• NAS100 = sauberste technische Struktur aller Indizes",
    "• Sehr schnelle Moves → perfekt für kleine SL",
    "• FVG werden fast immer gefüllt",
    "• Extrem manipulative Liquidity Sweeps (besonders 15:28–15:32)"
  ]
},


"US30": {
  behavior: "Dümmste Impulse im Markt. Riesige Sweeps. Für Anfänger brutal.",
  bestSessions: ["NY Open", "NY Killzone"],
  bestDays: ["Mittwoch", "Freitag"],
  volatility: "Extrem",
  riskLevel: "Extrem",
  notes: [
    "🔎 ICT-Verhalten:",
    "• US30 liebt 100–300 Pip Sweeps",
    "• Judas Move kurz vor NY Open fast garantiert",
    "• Oben & unten Liquidität wird IMMER geholt",
    "• Sehr sauber mit Orderblocks in 1H/4H",
    "• Displacement Kerzen gigantisch → SL muss groß genug sein",

    "🕒 Tagesstruktur:",
    "• 08:00–12:00 — ruhiger Aufbau",
    "• 14:30 — erste Explosion",
    "• 15:30 — absoluter Wahnsinn (größte Sweeps)",
    "• 16:00–17:00 — echte Trendrichtung",
    "• 18:00 — Reversal",

    "🌍 Sessions:",
    "• London — oft Fake-Moves",
    "• NY — Haupttrend & größte Manipulation",
    "• Nachbörslich — unklar, oft illiquide",

    "⚠️ Gefahrzonen:",
    "• 15:30 (NY Open!) → SL wird oft in 1 Sekunde geholt",
    "• US News → 200+ Pip Kerzen",
    "• Mehrfach Fake-Einbrüche vor echten Moves",

    "🎯 Ideal-Setups:",
    "• Liquidity Grab an Daily/4H High/Low",
    "• FVG Entry nach Displacement",
    "• Breaker-Block nach harter Manipulation",
    "• 15:30 Sweep → MSS → Entry",

    "📌 Besondere Eigenschaften:",
    "• Chaotischster Index der Welt",
    "• Perfekt für schnelle Scalps",
    "• Sehr große FVGs → bombastisches RR",
    "• Funktioniert extrem gut mit ICT Killzones"
  ]
},


"SPX500": {
  behavior: "Ruhiger als NAS100. Saubere Bewegungen.",
  bestSessions: ["NY"],
  bestDays: ["Mittwoch"],
  volatility: "Mittel–Hoch",
  riskLevel: "Mittel",
  notes: [
    "🔎 ICT-Verhalten:",
    "• Sehr saubere Liquidity Sweeps",
    "• Weniger Chaos als NAS & US30",
    "• FVG respektiert wie ein Schulbuch",
    "• MSS → Displacement → Entry ideal",

    "🕒 Tagesstruktur:",
    "• 08:00–13:00 — ruhige Akkumulation",
    "• 14:30 — Impuls",
    "• 15:30 — Follow-through",
    "• 17:00 — Trend-Finish",

    "🌍 Sessions:",
    "• London — oft nutzlos",
    "• NY — alles passiert hier",

    "⚠️ Gefahrzonen:",
    "• CPI & FOMC → SPX kann 30 Punkte instant bewegen",
    "• Tech Earnings beeinflussen SPX stark",

    "🎯 Ideal-Setups:",
    "• 1H OB Rejection",
    "• 5M FVG Entry",
    "• Killzone Trades",

    "📌 Besondere Eigenschaften:",
    "• Klarster Trend unter allen US-Indizes",
    "• Am freundlichsten für Anfänger",
    "• Füllt FVGs fast immer"
  ]
},


"GER40": {
  behavior: "Volatil in Frankfurt + London. Viele Sweeps.",
  bestSessions: ["Frankfurt", "London"],
  bestDays: ["Dienstag", "Donnerstag"],
  volatility: "Hoch",
  riskLevel: "Hoch",
  notes: [
    "🔎 ICT-Verhalten:",
    "• Frankfurt Open = Mini NAS100",
    "• Sweep + Fake Move sehr typisch",
    "• Range → impulsiver Breakout",
    "• Reagiert gut auf 1H Levels",

    "🕒 Tagesstruktur:",
    "• 08:00–09:00 — Frankfurt Chaos",
    "• 09:00–10:00 — Trendübersicht",
    "• 10:30–12:00 — beste HL/LH Struktur",
    "• Nachmittag = ruhiger",

    "🌍 Sessions:",
    "• Frankfurt — Hauptmanipulation",
    "• London — Trendfortsetzung",
    "• NY — weniger Einfluss",

    "⚠️ Gefahrzonen:",
    "• 09:00 Eröffnung",
    "• Deutsche News",

    "🎯 Ideal-Setups:",
    "• Sweep Frankfurt High/Low",
    "• OB Rejection",
    "• FVG Entry 5M",

    "📌 Besonderes:",
    "• Sehr abhängig von EU Wirtschaftsdaten",
    "• Charakteristisch: lange Wicks"
  ]
},


"UK100": {
  behavior: "Ruhiger Index, reagiert gut auf Levels.",
  bestSessions: ["London"],
  bestDays: ["Mittwoch"],
  volatility: "Niedrig–Mittel",
  riskLevel: "Niedrig–Mittel",
  notes: [
    "🔎 ICT-Verhalten:",
    "• Weniger manipulativ",
    "• FVG Respekt extrem hoch",
    "• Liquidity Sweeps sauber und langsam",
    "• Ideal für ruhige Intraday Trades",

    "🕒 Tagesstruktur:",
    "• 09:00–10:00 — beste Zeit",
    "• Nachmittag wird schnell langweilig",

    "🌍 Sessions:",
    "• London — Hauptvolumen",
    "• NY — kaum Einfluss",

    "⚠️ Gefahrzonen:",
    "• UK News 08:00–10:30",

    "🎯 Ideal-Setups:",
    "• Swing-Reaktionen an 1H Levels",
    "• FVG Trendfolge",
    "• Rejection an psychologischen Levels",

    "📌 Besonderes:",
    "• Sehr angenehm für Anfänger",
    "• Perfekt für konservative Trader"
  ]
},


  /* ==========================================================
     🔥 KRYPTOS
  ========================================================== */

"BTC/USD": {
  behavior: "24/7 Markt. Hohe Abhängigkeit vom Sentiment.",
  bestSessions: ["NY Overlap", "Crypto Evening Move"],
  bestDays: ["Dienstag", "Freitag", "Sonntag Abend"],
  volatility: "Mittel–Hoch",
  riskLevel: "Hoch",
  notes: [
    "🔎 ICT-Verhalten:",
    "• Perfekte Liquidity Sweeps über Asia High/Low",
    "• 80% aller Moves starten mit einem Judas Move",
    "• Sehr klarer MSS → Displacement → FVG Entry (15M–1H)",
    "• Premium/Discount extrem zuverlässig",
    "• BTC reagiert sauber auf 1H/4H OB",
    "• Weekend Liquidity Hunt typisch (Samstag/Sonntag)",

    "🕒 Tagesstruktur:",
    "• 02:00–05:00 — Asia Accumulation",
    "• 09:00–12:00 — EU Liquidity Grab",
    "• 14:00–17:00 — NY Trend Move",
    "• 20:00–23:00 — Crypto Evening Move (zweite Chance)",
    "• Sonntag 18:00–23:00 — Wochenstart-Move",

    "🌍 Sessions:",
    "• London — oft Fake Moves",
    "• NY — Haupttrend",
    "• Evening — Reversal/Continuation",

    "⚠️ Gefahrzonen:",
    "• FOMC (BTC reagiert wie NAS100)",
    "• Silicon Valley News",
    "• Elon Tweets (weniger geworden, aber möglich)",
    "• Sonntag → fiese Stop Hunts",

    "🎯 Ideal-Setups:",
    "• Asia High/Low Sweep → NY Killzone Entry",
    "• 1H OB Rejection",
    "• 15M MSS → Displacement → Entry",
    "• Liquidity Sweep vor 20:00 Evening Reversal",

    "📌 Besonderheiten:",
    "• BTC ist technisch wie NAS100, aber 24/7",
    "• Extrem gut für FVG Trader",
    "• Überraschend sauber im Trend",
    "• Perfekt für SMC weil Liquidität klar sichtbar ist"
  ]
},


"ETH/USD": {
  behavior: "Ruhiger als BTC, aber cleaner Trend.",
  bestSessions: ["NY", "Crypto Abend"],
  bestDays: ["Mittwoch", "Freitag"],
  volatility: "Mittel",
  riskLevel: "Mittel",
  notes: [
    "🔎 ICT-Verhalten:",
    "• Kleinerer Judas Move als BTC",
    "• Trendstruktur sehr sauber",
    "• FVG in 5M–15M extrem respektiert",
    "• Weniger Noise als BTC",
    "• Premium/Discount greift perfekt",

    "🕒 Tagesstruktur:",
    "• 01:00–05:00 — ruhige Asia Range",
    "• 09:00–11:00 — EU Trend follow",
    "• 14:00–17:00 — NY Hauptmove",
    "• 20:00–22:30 — Evening Reversal",

    "🌍 Sessions:",
    "• London → Trendrichtung wird gesetzt",
    "• NY → Volumen explodiert",
    "• Evening → Korrekturen",

    "⚠️ Gefahrzonen:",
    "• Ethereum News (Updates, Upgrades)",
    "• Bitcoin Dominanz Veränderungen",
    "• Liquidity Dumps höher als bei BTC",

    "🎯 Ideal-Setups:",
    "• 15M FVG Entry",
    "• 1H OB → LTF Shift",
    "• Weekend Sweep → Monday Trend",
    "• Liquidity Hunt an psychologischen Levels (2000, 2500 etc.)",

    "📌 Besonderheiten:",
    "• ETH ist viel klarer im Preisverhalten",
    "• Weniger manipulative Spikes",
    "• Sehr saubere Intraday-Setups"
  ]
},

"XRP/USD": {
  behavior: "Sehr chaotisch. Plötzliche Spikes.",
  bestSessions: ["NY", "Crypto Evening"],
  bestDays: ["Mittwoch"],
  volatility: "Extrem",
  riskLevel: "Hoch",
  notes: [
    "🔎 ICT-Verhalten:",
    "• Stärkste Sweeps im gesamten Kryptomarkt",
    "• Fast jeder Move ist ein Liquidity Grab",
    "• FVG funktioniert, aber muss schnell genommen werden",
    "• Extrem schnelle MSS-Formation",
    "• Plötzliche Manipulationskerzen typisch",

    "🕒 Tagesstruktur:",
    "• 03:00–05:00 — Asia Fake Moves",
    "• 09:00–11:00 — EU Sweep",
    "• 14:00–17:00 — NY Main Move",
    "• Abend — absolute Chaosphase (Pump & Dump)",

    "🌍 Sessions:",
    "• London — Sweeps",
    "• NY — Trend",
    "• Evening — PnD",

    "⚠️ Gefahrzonen:",
    "• SEC News → instant 5–20% Moves",
    "• Listing/Delisting",
    "• Social Media Pumps",

    "🎯 Ideal-Setups:",
    "• Nur NY Killzone handeln",
    "• FVG nach Manipulationskerze",
    "• 1H Sweep → 5M Entry",
    "• Range Breakouts (sehr profitabel)",

    "📌 Besonderheiten:",
    "• XRP ist für Anfänger brandgefährlich",
    "• Aber → Wenn du SMC beherrschst → beste RR-Möglichkeiten",
    "• Viele Fakeouts → SL muss clever sitzen"
  ]
},


};
