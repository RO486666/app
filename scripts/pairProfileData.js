/* ==========================================================
   📘 PAIR PROFILE DATABASE – FINAL SMC VERSION
   Optimized for Killzone-Filtering & Institutional Orderflow
   ========================================================== */

const pairProfileDB = {

  /* ==========================================================
      🔥 MAJORS
  ========================================================== */

"EUR/USD": {
  behavior: "Liquidestes Paar. Respektiert PD-Arrays (Premium/Discount) extrem genau.",
  bestSessions: ["London", "London Killzone", "NY", "NY Killzone"],
  bestDays: ["Dienstag", "Mittwoch", "Donnerstag"],
  volatility: "Mittel",
  riskLevel: "Niedrig",
  notes: [
    "🔎 ICT-Verhalten:",
    "• Klassischer Judas Swing: London 08:00–09:00 oder NY 13:30–14:30",
    "• OTE (Optimal Trade Entry) funktioniert hier am besten",
    "• Sweep von Asia High/Low ist oft der Startschuss",
    "• SMT Divergenz mit DXY (Dollar Index) ist das stärkste Signal",

    "🕒 Tagesstruktur:",
    "• 07:00–10:00 — London Killzone (Setup & Expansion)",
    "• 10:00–12:00 — Konsolidierung",
    "• 13:30–16:00 — NY Killzone & News",

    "🌍 Sessions:",
    "• London Killzone — Die echte Richtung wird oft hier gesetzt",
    "• NY Killzone — Sucht Liquidität (Sweeps) und setzt Trend fort",

    "⚠️ Gefahrzonen:",
    "• 14:30 US News (Tödliche Spikes)",
    "• EZB Zinsentscheide (Donnerstag)",

    "🎯 Ideal-Setups:",
    "• London Killzone FVG Entry",
    "• Breaker Block Retest nach Asia-Sweep",
    "• 15M Orderflow Continuation"
  ]
},

"GBP/USD": {
  behavior: "Das 'Cable'. Volatil, aggressiv, liebt tiefe Stop-Hunts.",
  bestSessions: ["London", "London Killzone", "NY", "NY Killzone"],
  bestDays: ["Dienstag", "Mittwoch", "Donnerstag"],
  volatility: "Mittel–Hoch",
  riskLevel: "Mittel–Hoch",
  notes: [
    "🔎 ICT-Verhalten:",
    "• Macht oft tiefere Retracements als EUR/USD",
    "• Aggressive Sweeps an psychologischen Levels (1.2500)",
    "• Turtle Soup Setups (False Breakouts) sind sehr häufig",
    "• Reagiert explosiv auf GBP CPI und US NFP",

    "🕒 Tagesstruktur:",
    "• 08:00–10:00 — London Killzone (Große Moves)",
    "• 14:00–16:30 — NY Killzone & Reversals",

    "🌍 Sessions:",
    "• London — Hier passiert die Magie",
    "• NY — Oft komplette Umkehr des London-Trends",

    "⚠️ Gefahrzonen:",
    "• 08:00 London Open (Fakeout Gefahr)",
    "• Bank of England (BoE) News",

    "🎯 Ideal-Setups:",
    "• London Open Judas Swing",
    "• Power of 3 (Accumulation-Manipulation-Distribution)",
    "• FVG + Breaker Combo nach Liquiditätsabgriff"
  ]
},

"AUD/USD": {
  behavior: "Commodity-Währung. Hängt an Gold. Ruhiger Trend.",
  bestSessions: ["Tokyo", "Sydney", "London"],
  bestDays: ["Dienstag", "Mittwoch", "Donnerstag"],
  volatility: "Niedrig–Mittel",
  riskLevel: "Niedrig",
  notes: [
    "🔎 ICT-Verhalten:",
    "• Respektiert 15M/1H Orderblocks sehr sauber",
    "• Weniger 'fiese' Wicks als GBP",
    "• Korreliert oft positiv mit Gold (XAU/USD)",
    "• Asia Session ist hier oft keine Range, sondern Trend!",

    "🕒 Tagesstruktur:",
    "• 01:00–06:00 — Echter Trend möglich (Sydney/Tokyo)",
    "• 09:00–11:00 — London Fortsetzung",

    "🌍 Sessions:",
    "• Sydney/Tokyo — Hauptvolumen",
    "• London — Gut für Retracements",

    "⚠️ Gefahrzonen:",
    "• RBA Zinsentscheide (Nachts!)",
    "• China Wirtschaftsdaten",

    "🎯 Ideal-Setups:",
    "• Asia Breakout & Retest",
    "• Trendfolge im 15M Chart",
    "• Swing Trading"
  ]
},

"NZD/USD": {
  behavior: "Der kleine Bruder vom AUD. Sehr sauber, aber weniger Volumen.",
  bestSessions: ["Tokyo", "Sydney"],
  bestDays: ["Dienstag", "Mittwoch", "Donnerstag"],
  volatility: "Niedrig",
  riskLevel: "Niedrig",
  notes: [
    "🔎 ICT-Verhalten:",
    "• Extrem technische Marktstruktur (Higher Highs / Lower Lows)",
    "• Liquiditäts-Sweeps sind meist sehr präzise",
    "• Reagiert stark auf Daily Bias",

    "🕒 Tagesstruktur:",
    "• 00:00–06:00 — Hauptbewegung",
    "• 08:00–11:00 — London Fade",

    "🌍 Sessions:",
    "• Tokyo — Beste Chancen",
    "• London/NY — Nur bei US News interessant",

    "⚠️ Gefahrzonen:",
    "• Geringe Liquidität (Slippage möglich)",
    "• RBNZ News",

    "🎯 Ideal-Setups:",
    "• Tokyo Session Trends",
    "• 4H Orderblock Rejections"
  ]
},

"USD/CHF": {
  behavior: "Der 'Swissy'. Negativ korreliert zu EUR/USD.",
  bestSessions: ["London", "NY"],
  bestDays: ["Dienstag", "Mittwoch", "Donnerstag"],
  volatility: "Niedrig",
  riskLevel: "Sehr niedrig",
  notes: [
    "🔎 ICT-Verhalten:",
    "• Spiegelbild zu EUR/USD (EUR hoch = CHF runter)",
    "• Wirft oft lange Dojis / Wicks in Ranges",
    "• Sehr gut für Hedging geeignet",
    "• Safe Haven Währung",

    "🕒 Tagesstruktur:",
    "• 08:00–11:00 — London Struktur",
    "• 14:00–16:00 — US Volatilität",

    "🌍 Sessions:",
    "• London & NY dominieren",
    "• Tokyo irrelevant",

    "⚠️ Gefahrzonen:",
    "• SNB Interventionen (selten, aber extrem)",
    "• Generell oft 'zäher' Markt",

    "🎯 Ideal-Setups:",
    "• SMT Divergenz mit EUR/USD suchen!",
    "• Range Trading"
  ]
},

"USD/CAD": {
  behavior: "Der 'Loonie'. Hängt stark am Ölpreis (WTI).",
  bestSessions: ["NY", "NY Killzone"],
  bestDays: ["Mittwoch", "Donnerstag", "Freitag"],
  volatility: "Mittel",
  riskLevel: "Mittel",
  notes: [
    "🔎 ICT-Verhalten:",
    "• Jagt Liquidität oft erst SPÄT (ab 14:30/16:00)",
    "• Korreliert invers zum Ölpreis (Öl hoch = USD/CAD runter)",
    "• Viele 'V-Form' Reversals in der NY Session",

    "🕒 Tagesstruktur:",
    "• 10:00–13:00 — Vorgeplänkel",
    "• 14:30 — US/CAD News Release",
    "• 16:00 — London Close + WTI Settlement",

    "🌍 Sessions:",
    "• NY Killzone ist King",

    "⚠️ Gefahrzonen:",
    "• WTI Öl Inventories (Mittwoch 16:30)",
    "• CAD Arbeitsmarktdaten",

    "🎯 Ideal-Setups:",
    "• NY Killzone Reversal",
    "• Breaker Blocks nach Öl-News"
  ]
},

"USD/JPY": {
  behavior: "Das Biest. Wenn es trendet, dann ohne Rücksicht.",
  bestSessions: ["Tokyo", "NY", "NY Killzone"],
  bestDays: ["Dienstag", "Mittwoch", "Donnerstag"],
  volatility: "Hoch",
  riskLevel: "Hoch",
  notes: [
    "🔎 ICT-Verhalten:",
    "• Läuft stark mit US 10-Year Treasury Yields",
    "• Macht oft kaum Pullbacks in starken Trends (Runaway)",
    "• Asiatische Session baut oft die Liquidität für London auf",
    "• Stop Hunts finden meist am Tageshoch/-tief statt",

    "🕒 Tagesstruktur:",
    "• 01:00–06:00 — Tokyo Momentum",
    "• 14:30–17:00 — NY Yield Reaktion",

    "🌍 Sessions:",
    "• Tokyo & NY sind die Haupttreiber",

    "⚠️ Gefahrzonen:",
    "• BoJ (Bank of Japan) Interventionen (Warnung!)",
    "• Yen Flash Crashes",

    "🎯 Ideal-Setups:",
    "• Break & Retest (klassisch)",
    "• Asia High/Low Sweep → Continuation",
    "• 5M FVG im starken Momentum"
  ]
},

  /* ==========================================================
      🔥 CROSSES
  ========================================================== */

"GBP/JPY": {
  behavior: "The Widowmaker. Riesige Range, extrem profitabel oder tödlich.",
  bestSessions: ["London", "London Killzone", "NY", "NY Killzone"],
  bestDays: ["Dienstag", "Mittwoch", "Donnerstag"],
  volatility: "Extrem",
  riskLevel: "Extrem",
  notes: [
    "🔎 ICT-Verhalten:",
    "• Vereint Volatilität von GBP und JPY",
    "• Respektiert Zonen, aber 'overshoots' (Wicks) sind riesig",
    "• Orderblocks müssen im HTF (1H/4H) gewählt werden",
    "• Perfekt für 'Catch the falling Knife' an Key Levels",

    "🕒 Tagesstruktur:",
    "• 08:00–10:00 — London Explosion (oft 50+ Pips)",
    "• 14:30–16:30 — NY Volatilität",

    "🌍 Sessions:",
    "• London Killzone ist die beste Zeit",

    "⚠️ Gefahrzonen:",
    "• ALLES. Stops müssen weiter weg gesetzt werden.",
    "• Spread-Ausweitung bei News",

    "🎯 Ideal-Setups:",
    "• London Killzone Breakout",
    "• Asia Range Sweep + MSB (Market Structure Break)",
    "• Große HTF Reversals"
  ]
},

"EUR/JPY": {
  behavior: "Der kleine Bruder von GBP/JPY. Sauberer, strukturierter.",
  bestSessions: ["Tokyo", "London", "London Killzone"],
  bestDays: ["Dienstag", "Mittwoch", "Donnerstag"],
  volatility: "Mittel–Hoch",
  riskLevel: "Mittel",
  notes: [
    "🔎 ICT-Verhalten:",
    "• Trendet schöner als GBP/JPY (weniger wilde Spikes)",
    "• Hält sich gut an Fibonacci Levels",
    "• Asia Session oft schon trendig",

    "🕒 Tagesstruktur:",
    "• 02:00–06:00 — Tokyo Trend",
    "• 08:00–11:00 — London Boost",

    "🌍 Sessions:",
    "• Tokyo & London",

    "⚠️ Gefahrzonen:",
    "• BoJ News",
    "• EZB Pressekonferenzen",

    "🎯 Ideal-Setups:",
    "• Trend Continuation Patterns",
    "• 15M OB Rejection",
    "• Tokyo High/Low Retest"
  ]
},

"EUR/GBP": {
  behavior: "Der Grinder. Langsam, zäh, aber extrem technisch.",
  bestSessions: ["London", "London Killzone"],
  bestDays: ["Dienstag", "Mittwoch", "Donnerstag"],
  volatility: "Niedrig",
  riskLevel: "Niedrig",
  notes: [
    "🔎 ICT-Verhalten:",
    "• Bewegt sich oft nur 30-50 Pips am Tag",
    "• Orderblocks werden auf den Punkt genau getroffen",
    "• Wenig Fakeouts (ideal für Anfänger)",

    "🕒 Tagesstruktur:",
    "• 09:00–12:00 — Hauptbewegung",

    "🌍 Sessions:",
    "• Nur London ist relevant",

    "⚠️ Gefahrzonen:",
    "• Zeitgleiche UK/EU News",

    "🎯 Ideal-Setups:",
    "• Range Trading (Buy Low, Sell High)",
    "• Precision Entries am 1H OB"
  ]
},

"AUD/NZD": {
  behavior: "Range-Monster. Extrem ruhige Struktur.",
  bestSessions: ["Tokyo", "Sydney"],
  bestDays: ["Dienstag", "Mittwoch", "Donnerstag"],
  volatility: "Niedrig",
  riskLevel: "Niedrig",
  notes: [
    "🔎 ICT-Verhalten:",
    "• Sehr stabile Trendstruktur in der Asia Session",
    "• Premium/Discount reagiert sauber",
    "• Wenig Manipulation durch große Player",

    "🕒 Tagesstruktur:",
    "• 01:00–05:00 — Saubere Asia-Trends",
    "• 12:00+ — Sehr ruhig (Dead Zone)",

    "🌍 Sessions:",
    "• Tokyo & Sydney",

    "⚠️ Gefahrzonen:",
    "• RBA & RBNZ News",
    "• Sehr niedrige Liquidität (Spread beachten)",

    "🎯 Ideal-Setups:",
    "• Asia Sweep → Continuation",
    "• Pullback Entries an Premium/Discount Levels"
  ]
},

"GBP/AUD": {
  behavior: "Volatiles Cross-Pair. Große Impulse.",
  bestSessions: ["London", "London Killzone", "NY"],
  bestDays: ["Dienstag", "Donnerstag"],
  volatility: "Hoch",
  riskLevel: "Sehr hoch",
  notes: [
    "🔎 ICT-Verhalten:",
    "• News-getriebene Sweeps durch UK + AUS",
    "• Sehr starke MSS Bewegungen im 5M/15M",
    "• FVG Entries extrem effektiv",

    "🕒 Tagesstruktur:",
    "• 08:00–10:00 — London Killzone Impuls",
    "• 15:30 — NY Open Sweeps",

    "🌍 Sessions:",
    "• London & NY",

    "⚠️ Gefahrzonen:",
    "• UK News & AUD News",
    "• Spread höher als Major-Paare",

    "🎯 Ideal-Setups:",
    "• London Sweep → MSS → Displacement",
    "• Breaker Block Reentries"
  ]
},

  /* ==========================================================
      🔥 METALLE
  ========================================================== */

"XAU/USD": {
  behavior: "Gold. Der König der Liquidity Grabs.",
  bestSessions: ["London Killzone", "NY", "NY Killzone"],
  bestDays: ["Dienstag", "Mittwoch", "Donnerstag"],
  volatility: "Sehr hoch",
  riskLevel: "Extrem",
  notes: [
    "🔎 ICT-Verhalten:",
    "• Holt IMMER Stops auf beiden Seiten, bevor der echte Move kommt",
    "• 13:30 (Pre-Market) & 14:30 sind Schlüsselzeiten",
    "• Reagiert perfekt auf Daily/Weekly Orderblocks",
    "• Korreliert negativ zu DXY und US-Yields",

    "🕒 Tagesstruktur:",
    "• 08:00–11:00 — London (oft Setup für NY)",
    "• 13:30–16:00 — NY Killzone (Der echte Move)",
    "• 18:00+ — Oft Retracement",

    "🌍 Sessions:",
    "• NY Killzone ist für Gold entscheidend",

    "⚠️ Gefahrzonen:",
    "• ALLE US-News (NFP, CPI, PPI, FOMC)",
    "• Geopolitische Schlagzeilen (Kriegsangst = Gold steigt)",

    "🎯 Ideal-Setups:",
    "• NY Killzone Sweep + MSB",
    "• 'Trap Moves' (Falle für Breakout Trader)",
    "• 15M FVG im Trend"
  ]
},

"XAG/USD": {
  behavior: "Silber. Gold auf Steroiden. Chaotisch.",
  bestSessions: ["NY", "NY Killzone"],
  bestDays: ["Dienstag", "Mittwoch", "Donnerstag"],
  volatility: "Extrem+",
  riskLevel: "Extrem",
  notes: [
    "🔎 ICT-Verhalten:",
    "• Gleiche Struktur wie Gold, aber viel längere Wicks",
    "• Kann Konten in Sekunden sprengen",
    "• Stops müssen viel weiter weg (ATR beachten)",
    "• Läuft oft nach, wenn Gold schon gestartet ist",

    "🕒 Tagesstruktur:",
    "• Siehe Gold, aber komprimierter auf NY Open",

    "🌍 Sessions:",
    "• NY Only (für Sicherheit)",

    "⚠️ Gefahrzonen:",
    "• Geringere Liquidität als Gold = Slippage",
    "• Industrielle Nachfrage",

    "🎯 Ideal-Setups:",
    "• Nur mit reduzierter Position Size handeln!",
    "• Catch-up Plays zu Gold"
  ]
},

  /* ==========================================================
      🔥 INDIZES
  ========================================================== */

"NAS100": {
  behavior: "Tech-Monster. Schnell, sauber, trendstark.",
  bestSessions: ["NY", "NY Killzone"],
  bestDays: ["Dienstag", "Mittwoch", "Donnerstag"],
  volatility: "Extrem",
  riskLevel: "Hoch",
  notes: [
    "🔎 ICT-Verhalten:",
    "• Respektiert ICT-Konzepte am besten von allen Indizes",
    "• 09:30 EST (15:30 DE) Open: Typischer 'Judas' Fake-Move",
    "• 09:50–10:10 EST (15:50–16:10 DE): 'Silver Bullet' Zeitfenster",
    "• FVG im 1M/5M funktionieren hier extrem gut",

    "🕒 Tagesstruktur:",
    "• 14:30 — Futures Volatilität",
    "• 15:30 — NY Killzone Stock Open (Chaos)",
    "• 16:00 — Der echte Trend etabliert sich",
    "• 20:00 — 'Power Hour'",

    "🌍 Sessions:",
    "• NY Killzone (Alles davor ist Vorgeplänkel)",

    "⚠️ Gefahrzonen:",
    "• Earnings von Big Tech (Apple, Nvidia, Microsoft)",
    "• FOMC Meetings",

    "🎯 Ideal-Setups:",
    "• NY AM Silver Bullet (10:00–11:00 EST)",
    "• Opening Range Breakout & Retest",
    "• 15M MSS nach Liquidity Grab"
  ]
},

"US30": {
  behavior: "Der Dow Jones. 'Dumb Money' Index. Unsauber.",
  bestSessions: ["NY", "NY Killzone"],
  bestDays: ["Dienstag", "Mittwoch", "Donnerstag"],
  volatility: "Extrem",
  riskLevel: "Extrem",
  notes: [
    "🔎 ICT-Verhalten:",
    "• Macht oft tiefere, 'hässliche' Sweeps als NAS100",
    "• Dochte (Wicks) sind oft 50-100 Punkte lang",
    "• Manipuliert Hochs/Tiefs aggressiver",
    "• SMT Divergenz mit NAS100 ist hier Gold wert",

    "🕒 Tagesstruktur:",
    "• Siehe NAS100, aber oft volatiler beim Open",

    "🌍 Sessions:",
    "• NY Killzone",

    "⚠️ Gefahrzonen:",
    "• 15:30 DE — Stop Hunt garantiert",
    "• Bewegt sich oft irrational in Ranges",

    "🎯 Ideal-Setups:",
    "• SMT Divergenz (Wenn NAS Higher High macht, US30 aber nicht → Short)",
    "• Große Liquiditätspools im 1H Chart"
  ]
},

"GER40": {
  behavior: "Der DAX. Liebt Gaps und V-Reversals.",
  bestSessions: ["London", "London Killzone"],
  bestDays: ["Dienstag", "Mittwoch", "Donnerstag"],
  volatility: "Hoch",
  riskLevel: "Hoch",
  notes: [
    "🔎 ICT-Verhalten:",
    "• 08:00 (Frankfurt) Open Gap ist oft Ziel",
    "• 09:00 (Xetra) Open bringt Volumen und Richtung",
    "• Reagiert technisch sauber auf Fibonacci Retracements",
    "• Korreliert oft mit US-Futures, läuft aber vor",

    "🕒 Tagesstruktur:",
    "• 08:00–10:00 — Beste Zeit (Frankfurt/London Overlap)",
    "• 11:30–13:00 — Mittagspause (Finger weg)",
    "• 15:30 — Reagiert auf US Open",

    "🌍 Sessions:",
    "• London & London Killzone",

    "⚠️ Gefahrzonen:",
    "• 09:00 Xetra Eröffnung (Vola-Spike)",
    "• EZB News",

    "🎯 Ideal-Setups:",
    "• Frankfurt Open Breakout",
    "• Gap Close Strategien",
    "• London Session Continuation"
  ]
},

"UK100": {
  behavior: "Ruhiger Index, reagiert gut auf Levels.",
  bestSessions: ["London", "London Killzone"],
  bestDays: ["Mittwoch", "Donnerstag"],
  volatility: "Niedrig–Mittel",
  riskLevel: "Niedrig",
  notes: [
    "🔎 ICT-Verhalten:",
    "• Weniger manipulativ als DAX oder US-Indizes",
    "• Liquidity Sweeps sauber und langsam",
    "• Ideal für ruhige Intraday Trades",

    "🕒 Tagesstruktur:",
    "• 09:00–10:00 — London Killzone",

    "🌍 Sessions:",
    "• London",

    "⚠️ Gefahrzonen:",
    "• UK News 08:00–10:30",

    "🎯 Ideal-Setups:",
    "• Swing-Reaktionen an 1H Levels",
    "• FVG Trendfolge"
  ]
},

  /* ==========================================================
      🔥 KRYPTOS
  ========================================================== */

"BTC/USD": {
  behavior: "24/7 Asset. Institutionelles Geld steuert den Preis.",
  bestSessions: ["NY", "NY Killzone"],
  bestDays: ["Montag", "Dienstag", "Mittwoch", "Donnerstag"],
  volatility: "Mittel–Hoch",
  riskLevel: "Hoch",
  notes: [
    "🔎 ICT-Verhalten:",
    "• Weekend Manipulation: 'Sunday Scam Pump' wird Montag oft korrigiert",
    "• CME Futures Gaps sind Magneten",
    "• Reagiert auf US-Tech (NAS100) Korrelation",
    "• Asia Highs/Lows sind extrem wichtige Liquiditätsziele",

    "🕒 Tagesstruktur:",
    "• 02:00–04:00 — Asia Volatilität",
    "• 14:00–17:00 — NY Killzone (ETF Flows)",
    "• Sonntagabend — CME Open Volatilität",

    "🌍 Sessions:",
    "• NY (wegen ETFs & Wall Street)",
    "• Asia (Retail & Mining)",

    "⚠️ Gefahrzonen:",
    "• Niedrige Liquidität am Wochenende (Fake Moves)",
    "• SEC / Regulierungs-News",

    "🎯 Ideal-Setups:",
    "• Monday Range Manipulation",
    "• CME Gap Close",
    "• 4H Orderblock Retest"
  ]
},

"ETH/USD": {
  behavior: "Beta zu BTC. Läuft oft sauberer, aber volatiler.",
  bestSessions: ["NY", "NY Killzone"],
  bestDays: ["Dienstag", "Mittwoch", "Donnerstag"],
  volatility: "Mittel–Hoch",
  riskLevel: "Mittel",
  notes: [
    "🔎 ICT-Verhalten:",
    "• Struktur ist oft klarer als bei BTC",
    "• Liquiditäts-Pools sind leichter zu identifizieren",
    "• 'Altcoin Season' Indikator",

    "🕒 Tagesstruktur:",
    "• Folgt BTC mit leichter Verzögerung oder Übertreibung",

    "🌍 Sessions:",
    "• NY Killzone",

    "⚠️ Gefahrzonen:",
    "• BTC Dominanz steigt (ETH fällt gegen BTC)",
    "• Gas Fees Spikes",

    "🎯 Ideal-Setups:",
    "• ETH/BTC Chart Analyse für Stärke/Schwäche",
    "• Klassische SMC Setups"
  ]
},

  /* ==========================================================
      🔥 ROHSTOFFE
  ========================================================== */

"BRENT": {
  behavior: "Das schwarze Gold. Geopolitik & Inventories.",
  bestSessions: ["London", "NY", "NY Killzone"],
  bestDays: ["Mittwoch", "Freitag"],
  volatility: "Hoch",
  riskLevel: "Extrem",
  notes: [
    "🔎 ICT-Verhalten:",
    "• Trendphasen sind lang und impulsiv (Momentum)",
    "• Respektiert Supply/Demand Zonen im 4H/Daily sehr gut",
    "• Reagiert extrem auf Headlines (Krieg, OPEC)",

    "🕒 Tagesstruktur:",
    "• 09:00–11:00 — London",
    "• 14:30–17:00 — NY Killzone & Inventories",

    "🌍 Sessions:",
    "• London & NY",

    "⚠️ Gefahrzonen:",
    "• Mittwoch 16:30 (Inventories) = Casino",
    "• OPEC Meetings",
    "• Freitagabend (Profit Taking)",

    "🎯 Ideal-Setups:",
    "• Inventory-Sweep & Reversal",
    "• Break & Retest von psychologischen Levels"
  ]
}

};