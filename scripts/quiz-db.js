/* ================================================
   📚 Trading-Quiz Datenbank
   - Struktur: window.QUIZ_DB = { topics: { "<Thema>": [ {id, q, a[], correct, explain} ] } }
   - Du kannst beliebig Themen ergänzen und Fragen anhängen.
   ================================================= */

window.QUIZ_DB = {
  topics: {
    // === SMC / ICT ===
    "SMC/ICT": [
      { id: "ICT01", q: "Welche Sequenz beschreibt einen intakten Aufwärtstrend?", a: ["HH + HL", "LH + LL", "HH + LH"], correct: 0, explain: "Aufwärtstrend = Higher Highs & Higher Lows." },
      { id: "ICT02", q: "Ein Lower High (LH) im Abwärtstrend signalisiert …", a: ["Fortsetzung", "Reversal", "Seitwärtsphase"], correct: 0, explain: "LH bestätigt bärischen Markt, Verkäufer dominieren." },
      { id: "ICT03", q: "Ein Break of Structure (BoS) tritt auf, wenn …", a: ["Der Preis ein altes Hoch/Tief mit Schlusskurs bricht","Ein Doji erscheint","MA-Linien sich kreuzen"], correct: 0, explain: "BoS = Bruch markanter Strukturpunkte (HH/LL) → Trend-Fortsetzung." },
      { id: "ICT04", q: "Ein Change of Character (ChoCH) bedeutet …", a: ["Erster Bruch gegen den bisherigen Trend","Der Markt läuft seitwärts","Der RSI wechselt unter 50"], correct: 0, explain: "ChoCH = Erste Marktstruktur-Änderung → mögliches Reversal." },
      { id: "ICT05", q: "Equal Highs (EQH) sind …", a: ["Zwei oder mehr Hochs auf gleichem Level","Ein tieferes Hoch","Ein bullischer Engulf"], correct: 0, explain: "EQH = gestapelte Buy-Stop-Liquidity über den Hochs." },
      { id: "ICT06", q: "Buy-Side Liquidity liegt …", a: ["Über den Highs","Unter den Lows","Am 50%-Level"], correct: 0, explain: "Stops von Shorts + Breakout-Buys = über den Highs." },
      { id: "ICT07", q: "Sell-Side Liquidity liegt …", a: ["Unter den Lows","Über den Highs","Bei Pivot-Punkten"], correct: 0, explain: "Stops von Longs + Breakout-Sells = unter den Lows." },
      { id: "ICT08", q: "Ein bullischer FVG entsteht, wenn …", a: ["Kerze1 High < Kerze3 Low","Kerze2 ein Doji ist","Kerze3 RSI > 70"], correct: 0, explain: "Drei-Kerzen-Struktur → Ineffizienz zwischen Kerze1 & Kerze3." },
      { id: "ICT09", q: "Warum kehrt der Preis oft in FVG zurück?", a: ["Um Ineffizienz zu füllen","Wegen News","Weil Händler pausieren"], correct: 0, explain: "FVG = unausgeglichener Orderflow → Markt füllt meist nach." },
      { id: "ICT10", q: "Ein Orderblock ist …", a: ["Die letzte Akkumulations-/Distributions-Kerze vor impulsivem Bruch","Ein RSI-Level","Eine Trendlinie"], correct: 0, explain: "OB = Ursprungsbereich des Moves (Smart Money)." },
      { id: "ICT11", q: "Welcher OB ist statistisch stärker?", a: ["Frischer OB mit Imbalance danach","Mehrfach getesteter OB","OB in Deadzone"], correct: 0, explain: "Frisch & ungefüllt > ausgelutscht." },
      { id: "ICT12", q: "Mitigation bedeutet …", a: ["Smart Money gleicht alte Orders aus","Händler wechseln Broker","Stop-Loss wird enger"], correct: 0, explain: "OB wird erneut angetestet, um alte Restorders abzuarbeiten." },
      { id: "ICT13", q: "Ein Breaker Block entsteht …", a: ["Wenn ein alter OB gebrochen und dann als Level genutzt wird","Wenn zwei OBs sich überschneiden","Bei FVG-Füllung"], correct: 0, explain: "Alter OB → gebrochen → Level wechselt." },
      { id: "ICT14", q: "London Killzone (ca. 8–10 Uhr) ist bekannt für …", a: ["Starke Liquiditätssweeps über Asia H/L","Nur Seitwärtsphasen","Geringstes Volumen"], correct: 0, explain: "London jagt Asia-Range → Einstiegstrigger für Smart Money." },
      { id: "ICT15", q: "New York Killzone (13–15 Uhr) fällt oft mit …", a: ["US News & Volatilität auf USD/Gold","Asia Session","Sydney Open"], correct: 0, explain: "NY-KZ = viele US-Daten → starke Moves." },
      { id: "ICT16", q: "Wann setzt sich oft das Wochenhoch/-tief?", a: ["Montag/Dienstag","Donnerstag/Freitag","Sonntagabend"], correct: 0, explain: "Frühe Woche = High/Low, später → Trend." },
      { id: "ICT17", q: "Asia H/L dient oft als …", a: ["Liquidity-Pool für London","Support-Zone","Indikator für Volumen"], correct: 0, explain: "Asia Range = Ziel für London-Stop-Hunt." },
      { id: "ICT18", q: "Ein typischer Sweep passiert …", a: ["Kurz vor Session-Open","Am Wochenende","Nach Deadzone"], correct: 0, explain: "London & NY sweepen oft Asia/Pre-Session Level." },
      { id: "ICT19", q: "Premium Zone liegt …", a: ["Über dem 50% EQ einer Range","Unter 50%","Seitwärts"], correct: 0, explain: "Premium = oberhalb 50%, Discount = unterhalb 50%." },
      { id: "ICT20", q: "SMT Divergence erkennt man, wenn …", a: ["Ein Markt HH macht, der andere aber nicht","RSI > 70","Ein OB gefüllt wird"], correct: 0, explain: "Relative Divergenzen zeigen Smart-Money-Manipulation." },
      { id: "ICT21", q: "Set & Forget bedeutet …", a: ["Entry platzieren und Trade laufen lassen","SL nachziehen","Trade ohne SL"], correct: 0, explain: "Kein Eingreifen nach Entry → Vertrauen ins Setup." },
      { id: "ICT22", q: "Was ist ein Liquidity Void?", a: ["Ein Preisbereich ohne effiziente Orders (meist große Kerze ohne Gegenseite)","Eine Zone ohne Indikatoren","Ein Bereich mit zu vielen gleichzeitigen Orders"], correct: 0, explain: "Liquidity Void = schneller Move mit fehlendem Gegengewicht → oft Rückkehr." },
      { id: "ICT23", q: "Internal vs. External Liquidity bedeutet …", a: ["Interne = innerhalb Range, Externe = über Range-Extremen","Interne = Forex, Externe = Krypto","Interne = kleiner TF, Externe = großer TF"], correct: 0, explain: "Internal = im Range; External = über EQH/EQL." },
      { id: "ICT24", q: "Was ist ein Judas Swing?", a: ["Ein Fake-Move zu Session-Start","Eine Kerze mit langer Lunte","Ein RSI-Signal"], correct: 0, explain: "Judas Swing = absichtlicher Stop-Hunt → danach echte Richtung." },
      { id: "ICT25", q: "Das OTE liegt typischerweise …", a: ["Zwischen 61.8 % und 79 % Fibo","Genau bei 50 %","Unterhalb jeder Asia Range"], correct: 0, explain: "OTE = Retracement-Zone (61.8–79 %)." },
      { id: "ICT26", q: "Ein Balanced Price Range (BPR) entsteht, wenn …", a: ["Ein bullischer und bärischer OB sich überlappen","Ein OB zweimal getestet wird","Zwei Sessions sich überschneiden"], correct: 0, explain: "BPR = Overlap von Buy- und Sell-OBs." },
      { id: "ICT27", q: "Consequent Encroachment (CE) ist …", a: ["Das 50%-Level eines FVG oder OB","Ein Retest nach BoS","Ein Teil der RSI-Berechnung"], correct: 0, explain: "CE = 50 % einer Ineffizienz → Reaktionslevel." },
      { id: "ICT28", q: "Welcher Wochentag ist oft ein Midweek-Reversal?", a: ["Mittwoch","Montag","Freitag"], correct: 0, explain: "Mittwoch = typischer ICT-Reversal-Tag." },
      { id: "ICT29", q: "Wann wird häufig das Wochenhoch/-tief gebildet?", a: ["Mo–Di","Fr–Sa","So Abend"], correct: 0, explain: "Oft Montag oder Dienstag → Richtung danach klar." },
      { id: "ICT30", q: "Buy-to-Sell (B2S) Muster bedeutet …", a: ["Smart Money pusht Kurs hoch, um Shorts zu füllen","Kurs fällt und bleibt unten","Nur Käufe ohne Verkäufe"], correct: 0, explain: "Manipulativer Push hoch → dann Shorts platzieren." },
      { id: "ICT31", q: "Sell-to-Buy (S2B) Muster bedeutet …", a: ["Smart Money drückt Kurs runter, um Longs zu füllen","Trend ohne Liquidität","Reine Short-Trades"], correct: 0, explain: "Manipulativer Push runter → dann Longs platzieren." }
          { id: "ICT32", q: "Was ist ein Inversion Fair Value Gap (IFVG)?", a: ["Ein gefülltes FVG, das später als Support/Resistance dient","Ein nicht geschlossenes Gap im höheren Timeframe","Ein Liquiditäts-Pool zwischen EQH/EQL"], correct: 0, explain: "IFVG = FVG, das nach Füllung seine Rolle wechselt und als Support/Resistance-Level fungiert." },
      { id: "ICT33", q: "Wie nutzt Smart Money den 'Asia Range Judas Swing'?", a: ["Erst falscher Ausbruch → danach Entry in echte Richtung","Nur als Volumen-Indikator","Zur Bestimmung der Deadzone"], correct: 0, explain: "Der Judas Swing sweept Asia High/Low und gibt danach die echte Richtung (London Move)." },
      { id: "ICT34", q: "Welche Rolle spielt 'Time of Day' nach ICT?", a: ["Bestimmte Uhrzeiten bestimmen Bias und Entry-Zonen","Zeit hat keine Relevanz, nur Preis zählt","Nur News-Events sind zeitrelevant"], correct: 0, explain: "ICT = Time & Price Theory: Uhrzeit (Killzones, Session-Wechsel) ist Schlüssel für Entry." },
      { id: "ICT35", q: "Was bedeutet 'Displacement' in der Marktstruktur?", a: ["Ein impulsiver, starker Move mit Imbalance","Ein Seitwärtsbereich im Markt","Ein schwaches Retest-Signal"], correct: 0, explain: "Displacement = impulsiver Bruch mit Imbalance → zeigt Smart-Money-Intent." },
      { id: "ICT36", q: "Woran erkennt man einen High Probability Orderblock?", a: ["Frisch, im Premium/Discount, mit Displacement & Imbalance danach","Mehrfach getesteter Orderblock ohne Imbalance","Beliebiger Orderblock im Seitwärtsmarkt"], correct: 0, explain: "High Probability OB: frisch, ungefüllt, mit starkem Displacement + Imbalance." },
      { id: "ICT37", q: "Was ist ein 'Liquidity Grab to CE'?", a: ["Sweep + Rücklauf bis Consequent Encroachment","Ein Gap zwischen Asia und London","Eine News-getriebene Bewegung"], correct: 0, explain: "Typisches Muster: Stop-Hunt (Liquidity Grab) → Rücklauf bis CE (50 % der Ineffizienz)." },
      { id: "ICT38", q: "Wie unterscheidet sich 'Internal Range Liquidity' von 'External Range Liquidity'?", a: ["Internal = Zwischen High/Low der Range, External = über High/Low hinaus","Internal = kleine TFs, External = große TFs","Internal = Indizes, External = Forex"], correct: 0, explain: "Internal = innerhalb der Range, External = über EQH/EQL → Hauptziele für Smart Money." },
      { id: "ICT39", q: "Was ist ein 'Repricing Move'?", a: ["Ein schneller, aggressiver Preiswechsel mit starkem FVG","Ein kleiner Pullback innerhalb einer Range","Eine Retest-Kerze ohne Volumen"], correct: 0, explain: "Repricing = starker Impuls, Markt 'fair valued' neu und hinterlässt FVGs." },
      { id: "ICT40", q: "Wozu dient 'Intermarket Analysis' nach ICT?", a: ["Vergleich verschiedener Märkte (z. B. DXY vs. EUR/USD), um Divergenzen/Liquidity zu erkennen","Nur Chartanalyse eines Marktes","Ein Indikator-basiertes System"], correct: 0, explain: "ICT nutzt Intermarket Analysis → z. B. DXY + EUR/USD Divergenzen zeigen Manipulation." },
      { id: "ICT41", q: "Was ist ein 'Breaker Retest'?", a: ["Retest eines gebrochenen OBs, der nun als Entry-Level dient","Test eines unberührten FVG","Pullback auf EQH/EQL"], correct: 0, explain: "Breaker Block → nach Bruch retestet → Entry in neue Richtung." },
      { id: "ICT42", q: "Wann wird das wöchentliche Hoch/Tief laut ICT am häufigsten gebildet?", a: ["Mo–Di","Do–Fr","So Abend"], correct: 0, explain: "Meist Montag oder Dienstag → danach läuft Markt in Trendrichtung." },
      { id: "ICT43", q: "Welche Zone ist optimal für Shorts in einer Range?", a: ["Premium Zone (über 50 %)","Discount Zone (unter 50 %)","Genau beim 50 % Level"], correct: 0, explain: "Premium Zone = ideal für Shorts, Discount Zone = für Longs." },
      { id: "ICT44", q: "Was ist ein 'Power of 3' (PO3)?", a: ["Accumulation → Manipulation → Distribution","Drei gleiche Hochs","Ein Dreieck-Pattern"], correct: 0, explain: "PO3 = ICT-Marktmodell: Accumulation, Manipulation, Distribution." },
      { id: "ICT45", q: "Wann sind FVGs besonders relevant?", a: ["Nach starkem Displacement und in Killzones","Immer im Daily","Nur bei Asia Range"], correct: 0, explain: "Nur mit Displacement & Session-Kontekst = high probability." },
      { id: "ICT46", q: "Was ist eine 'Session Liquidity Pool Targeting'? ", a: ["Stop-Jagd typischerweise auf Asia H/L durch London","Stops im NY Killzone-Bereich","Stops in Deadzone"], correct: 0, explain: "London & NY jagen oft Asia-Range-Level als Liquidity-Pool." },
      { id: "ICT47", q: "Was ist ein 'OTE Entry' nach ICT?", a: ["Retracement zwischen 61.8 % und 79 % Fibo","Genau bei 50 % Fibo","Nur bei 88.6 % Fibo"], correct: 0, explain: "OTE-Zone = 61.8–79 % Retracement für Entry." },
      { id: "ICT48", q: "Was bedeutet 'Relative Equal Highs'?", a: ["Fast identische Hochs, die Buy-Side Liquidity markieren","Nur ein Hoch im Daily","Zwei Hochs in völlig verschiedenen TFs"], correct: 0, explain: "Relative Equal Highs = leicht ungleich, aber Liquidity oben sichtbar." },
      { id: "ICT49", q: "Wie entsteht ein 'Liquidity Void'?", a: ["Durch schnellen Move ohne Gegenorders","Durch News-Indikator","Durch Overnight-Gaps"], correct: 0, explain: "Liquidity Void = ineffizienter Bereich (oft große Kerze ohne Gegenseite)." },
      { id: "ICT50", q: "Was beschreibt das Modell 'Accumulation – Manipulation – Distribution'?", a: ["Smart Money sammelt → fake move → echte Richtung","Trendaufbau über Wochen","Indikator-gestützter Entry"], correct: 0, explain: "Das ist das klassische PO3/ICT-Modell: Akkumulation, Fakeout, Distribution." },
      { id: "ICT51", q: "Was zeigt 'SMT Divergence' an?", a: ["Eine Marktdivergenz zwischen korrelierenden Paaren (z. B. EUR/USD vs. GBP/USD)","Nur RSI-Divergenz","Ein Spread zwischen Futures"], correct: 0, explain: "Wenn ein Markt HH macht, ein anderer aber nicht → Manipulation sichtbar." }

	],



  "Technik": [
  // === Candlestick-Formationen ===
  { id: "TA01", q: "Eine Pin Bar signalisiert oft …", a: ["Rejection / Ablehnung", "Trendfortsetzung", "Kein Signal"], correct: 0, explain: "Lange Lunte/Docht = Markt lehnt Preislevel ab." },
  { id: "TA02", q: "Welche Candle gilt als starkes Umkehrsignal?", a: ["Bullish/Bearish Engulfing", "Marubozu", "Inside Bar"], correct: 0, explain: "Engulfing = vollständiges Verschlucken der vorherigen Kerze." },
  { id: "TA03", q: "Ein Doji zeigt …", a: ["Unentschlossenheit", "Trendfortsetzung", "Starken Trend"], correct: 0, explain: "Doji = Open ≈ Close, Markt unentschlossen." },
  { id: "TA04", q: "Ein Marubozu (Kerze ohne Dochte) signalisiert …", a: ["Starkes Momentum", "Ruhige Seitwärtsphase", "Umkehr"], correct: 0, explain: "Ohne Lunte → Käufer/Verkäufer dominieren komplett." },
  { id: "TA05", q: "Eine Inside Bar bedeutet …", a: ["Konsolidierung / Range", "Trendfortsetzung", "Marktumkehr"], correct: 0, explain: "Inside Bar = im Range der vorherigen Kerze → Markt sammelt Orders." },
  { id: "TA26", q: "Ein Hammer (unten langer Docht, kleiner Körper oben) signalisiert …", a: ["Bullische Reversal-Chance", "Bärische Fortsetzung", "Kein klares Signal"], correct: 0, explain: "Hammer = Käufer lehnen tiefere Preise ab, Umkehr nach oben möglich." },
  { id: "TA27", q: "Ein Shooting Star (oben langer Docht) deutet auf …", a: ["Bärische Umkehr", "Bullische Fortsetzung", "Volumenanstieg"], correct: 0, explain: "Shooting Star = Rejection höherer Preise → oft Trendwende nach unten." },
  { id: "TA28", q: "Morning Star Pattern entsteht durch …", a: ["Drei-Kerzen-Formation, starkes bullisches Umkehrsignal","Zwei gleich große Kerzen","Eine Marubozu-Kerze"], correct: 0, explain: "Morning Star = starker Reversal nach Downtrend (3 Candles)." },
  { id: "TA29", q: "Evening Star ist das Gegenteil von …", a: ["Morning Star","Hammer","Engulfing"], correct: 0, explain: "Evening Star = starkes bärisches Umkehrmuster." },
  { id: "TA30", q: "Ein Spinning Top Candle zeigt …", a: ["Unentschlossenheit des Marktes","Starke Trendrichtung","Breakout"], correct: 0, explain: "Kleine Körper, lange Dochte → Markt ohne klare Richtung." },

  // === Chartmuster ===
  { id: "TA06", q: "Head & Shoulders Formation deutet oft auf …", a: ["Reversal", "Trendfortsetzung", "Seitwärtsphase"], correct: 0, explain: "Kopf-Schulter-Muster = klassisches Umkehrsignal." },
  { id: "TA07", q: "Ein Double Top signalisiert …", a: ["Bärische Umkehr", "Bullische Fortsetzung", "Kein Signal"], correct: 0, explain: "Doppeltes Hoch = Widerstand bestätigt, oft Umkehr." },
  { id: "TA08", q: "Ein Double Bottom signalisiert …", a: ["Bullische Umkehr", "Trendfortsetzung abwärts", "Seitwärtsmarkt"], correct: 0, explain: "Doppeltes Tief = Support bestätigt, oft Trendwechsel nach oben." },
  { id: "TA09", q: "Bullische Flaggen deuten oft auf …", a: ["Trendfortsetzung", "Reversal", "Unentschlossenheit"], correct: 0, explain: "Flaggen = Konsolidierung im Trend → Breakout meist in Trendrichtung." },
  { id: "TA10", q: "Wedges (Keile) enden oft mit …", a: ["Breakout", "Seitwärtsbewegung", "Trendlosigkeit"], correct: 0, explain: "Wedge = sich verengende Struktur → Ausbruch meist stark." },
  { id: "TA31", q: "Ein Rising Wedge im Aufwärtstrend signalisiert oft …", a: ["Bärische Umkehr","Bullische Fortsetzung","Seitwärtsphase"], correct: 0, explain: "Steigender Keil = Schwäche, oft Break nach unten." },
  { id: "TA32", q: "Ein Falling Wedge im Abwärtstrend signalisiert oft …", a: ["Bullische Umkehr","Bärische Fortsetzung","Keine Relevanz"], correct: 0, explain: "Fallender Keil = Schwäche Bären, Break nach oben möglich." },
  { id: "TA33", q: "Symmetrische Dreiecke deuten auf …", a: ["Ausbruch in beide Richtungen möglich","Immer bullisch","Immer bärisch"], correct: 0, explain: "Triangle = Konsolidierung → Breakout unklar, aber meist stark." },
  { id: "TA34", q: "Ein Rectangle (Seitwärtsrange) signalisiert …", a: ["Konsolidierung, Ausbruch erwartet","Trendstärke","Volumenanstieg"], correct: 0, explain: "Rectangle = Range-Markt, Breakout → Richtung." },
  { id: "TA35", q: "Cup & Handle Formation ist oft …", a: ["Bullisches Fortsetzungsmuster","Bärisches Reversal","Neutral"], correct: 0, explain: "Cup & Handle → meist bullische Fortsetzung nach Break." },

  // === Trendlinien & Kanäle ===
  { id: "TA11", q: "Trendlinien verbinden …", a: ["Mehrere HH/LL oder HL/LH", "Kerzenkörper", "Indikatorenwerte"], correct: 0, explain: "Trendlinie = geometrische Verbindung signifikanter Hochs/Tiefs." },
  { id: "TA12", q: "Kanäle bestehen aus …", a: ["Zwei parallelen Trendlinien", "Einem OB", "Einer FVG"], correct: 0, explain: "Channel = Range mit parallelen Linien." },
  { id: "TA36", q: "Trendlinien sind am zuverlässigsten, wenn …", a: ["Mindestens 3 Punkte verbunden sind","Nur 2 Punkte verbunden sind","Sie zufällig gezogen sind"], correct: 0, explain: "3 Berührungen = bestätigte Trendlinie." },
  { id: "TA37", q: "Ein Kanalbruch nach oben bedeutet oft …", a: ["Bullische Fortsetzung","Bärische Umkehr","Kein Signal"], correct: 0, explain: "Channel Breakout = Momentum in Ausbruchsrichtung." },
  { id: "TA38", q: "Ein 'Parallel Channel' dient oft als …", a: ["Trendfortsetzungs-Tool","Reversal-Indikator","Volumenmesser"], correct: 0, explain: "Channel → Breakouts = Entries, Mitte = Pullbacks." },

  // === Support & Resistance ===
  { id: "TA13", q: "Support ist …", a: ["Ein Preislevel, an dem Nachfrage dominiert", "Ein RSI-Level", "Ein Moving Average"], correct: 0, explain: "Support = Käufer treten stark auf, Preis dreht oft nach oben." },
  { id: "TA14", q: "Resistance ist …", a: ["Ein Preislevel, an dem Angebot dominiert", "Eine Fibonacci-Zahl", "Ein OB"], correct: 0, explain: "Widerstand = Verkäufer aktiv → Preis dreht oft nach unten." },
  { id: "TA15", q: "Je öfter ein Support/Resistance getestet wird …", a: ["Desto schwächer wird er", "Desto stärker wird er", "Unverändert"], correct: 0, explain: "Mehr Tests = mehr Orders absorbiert = Level bricht leichter." },
  { id: "TA39", q: "Psychologische Levels (z. B. 1.2000) sind …", a: ["Starke S/R-Zonen","Nur auf Daily sichtbar","Unwichtig"], correct: 0, explain: "Runde Zahlen wirken wie Magnet → Trader platzieren Orders dort." },
  { id: "TA40", q: "Ein Flip-Level bedeutet …", a: ["Support wird zu Resistance oder umgekehrt","Falscher Ausbruch","Ein Fibonacci-Level"], correct: 0, explain: "Flip = Rolle von Support und Resistance wechselt." },
  { id: "TA41", q: "Welche Timeframes geben die stärksten S/R-Level?", a: ["Daily & Weekly","1-Minute","Nur 5-Minuten"], correct: 0, explain: "HTF-Support & Resistance = viel stärker respektiert." },

  // === Fibonacci ===
  { id: "TA16", q: "Welches Fibo-Level gilt als wichtigstes Retracement?", a: ["61.8%", "23.6%", "161.8%"], correct: 0, explain: "61.8 % = „goldener Schnitt“ → starkes Reaktionslevel." },
  { id: "TA17", q: "Welche Levels gelten als Extensions?", a: ["127%, 161.8%", "23.6%, 38.2%", "50%, 61.8%"], correct: 0, explain: "Extensions > 100 %, Retracements < 100 %." },
  { id: "TA18", q: "Was zeigt das 50%-Level oft an?", a: ["Premium/Discount EQ", "Umkehrsignal", "Support"], correct: 0, explain: "50 % = Equilibrium → magnetisch für Preis." },
  { id: "TA42", q: "Das 78.6%-Level wird genutzt für …", a: ["Tiefe Retracements (OTE)","Extensions","Indikatoren-Filter"], correct: 0, explain: "78.6 % = tiefer Retracement-Punkt → OTE Entry." },
  { id: "TA43", q: "Fibonacci Extensions werden genutzt für …", a: ["Take-Profit-Ziele","Stop-Loss","Einstiegs-Level"], correct: 0, explain: "127 %, 161.8 % → Zielzonen für TP." },
  { id: "TA44", q: "Das 38.2%-Retracement signalisiert …", a: ["Flache Korrektur, starker Trend","Tiefe Korrektur","Keine Relevanz"], correct: 0, explain: "38.2 % = flacher Pullback, Trend bleibt stark." },

  // === Indikatoren ===
  { id: "TA19", q: "RSI > 70 bedeutet …", a: ["Überkauft", "Überverkauft", "Neutral"], correct: 0, explain: "RSI > 70 = überkauft, < 30 = überverkauft." },
  { id: "TA20", q: "MACD-Crossover (Signal > MACD) bedeutet …", a: ["Mögliche Trendwende", "Seitwärtsphase", "Volumenanstieg"], correct: 0, explain: "Kreuzung = Momentumwechsel → häufiges Einstiegssignal." },
  { id: "TA21", q: "Moving Averages sind …", a: ["Nachlaufende Indikatoren", "Führende Indikatoren", "Volumenmessungen"], correct: 0, explain: "MAs = geglättete Preisdaten → zeigen Trendrichtung." },
  { id: "TA22", q: "Bollinger Bands messen …", a: ["Volatilität", "Liquidität", "Orderblock-Größe"], correct: 0, explain: "Bänder weiten sich bei hoher Volatilität, ziehen sich bei Ruhe zusammen." },
  { id: "TA45", q: "RSI < 30 bedeutet …", a: ["Überverkauft","Überkauft","Neutral"], correct: 0, explain: "RSI < 30 = Markt stark gefallen → Reversal möglich." },
  { id: "TA46", q: "Bollinger Band Breakouts passieren oft bei …", a: ["Volatilitätsanstieg","Volumenrückgang","Kein Signal"], correct: 0, explain: "Band-Expansion = Breakout bevorstehend." },
  { id: "TA47", q: "EMA 200 wird oft genutzt für …", a: ["Langfristige Trendrichtung","Scalping Entries","Volumen"], correct: 0, explain: "EMA 200 = institutioneller Trendfilter." },
  { id: "TA48", q: "Stochastic > 80 bedeutet …", a: ["Überkauft","Überverkauft","Neutral"], correct: 0, explain: "Stochastik zeigt Überkauft/Überverkauft ähnlich RSI." },

  // === Volumen ===
  { id: "TA23", q: "OBV (On Balance Volume) zeigt …", a: ["Kauf- und Verkaufsdruck anhand Volumenfluss", "RSI-Level", "Fibonacci-Level"], correct: 0, explain: "OBV = kumuliertes Volumen → Trendstärke." },
  { id: "TA24", q: "Volume Profile zeigt …", a: ["Volumenverteilung auf Preisleveln", "Volumen pro Zeiteinheit", "Nur Durchschnittsvolumen"], correct: 0, explain: "VP = horizontale Volumenbalken → zeigt POC, HVN, LVN." },
  { id: "TA25", q: "VWAP (Volume Weighted Average Price) ist …", a: ["Durchschnittspreis gewichtet nach Volumen", "Ein OB-Level", "Ein FVG-Level"], correct: 0, explain: "VWAP = vielgenutzter Referenzwert institutioneller Trader." },
  { id: "TA49", q: "Hoher Volumenanstieg bei Breakouts bedeutet …", a: ["Breakout ist bestätigt","Breakout ist Fake","Kein Signal"], correct: 0, explain: "Volumen + Breakout = starke Bestätigung." },
  { id: "TA50", q: "Low Volume Nodes (LVN) im Volume Profile bedeuten …", a: ["Preis wird oft schnell durchlaufen","Starke Unterstützung","Starker Widerstand"], correct: 0, explain: "LVN = dünn gehandelt → Preis rauscht oft durch." },
  { id: "TA51", q: "High Volume Nodes (HVN) im Volume Profile bedeuten …", a: ["Starke Preis-Akzeptanz","Keine Relevanz","Schnelle Moves"], correct: 0, explain: "HVN = Markt akzeptiert Level, Preis verweilt dort." },
  { id: "TA52", q: "Steigendes Volumen im Abwärtstrend deutet auf …", a: ["Starke Verkäuferdominanz","Umkehr","Neutral"], correct: 0, explain: "Hoher Volumendruck nach unten → Trend bestätigt." }
],


"Fundamentals": [
  // === Zinsentscheide ===
  { id: "FA01", q: "Was passiert typischerweise bei einem Zinserhöhungs-Beschluss der Fed?", a: ["USD stärkt sich oft","USD schwächt sich","Gold steigt automatisch"], correct: 0, explain: "Höhere Zinsen machen USD-Anlagen attraktiver → Kapital fließt in den Dollar." },
  { id: "FA02", q: "Welche Zentralbank ist für den EUR entscheidend?", a: ["EZB","Fed","BoJ"], correct: 0, explain: "Die Europäische Zentralbank (EZB) setzt die Leitzinsen für die Eurozone." },
  { id: "FA03", q: "Welche Zentralbank beeinflusst vor allem den JPY?", a: ["BoJ","BoE","SNB"], correct: 0, explain: "Bank of Japan (BoJ) steuert den Yen – bekannt für ultra-lockere Geldpolitik." },
  { id: "FA17", q: "Was bedeutet 'Zinsdifferenz' zwischen zwei Währungen?", a: ["Der Unterschied der Leitzinsen beider Länder","Der Unterschied der Inflationsraten","Die Differenz im Handelsbilanzsaldo"], correct: 0, explain: "Zinsdifferenz = Treiber im Forex → höhere Zinsen ziehen Kapital an." },
  { id: "FA18", q: "Carry Trades basieren auf …", a: ["Zinsdifferenzen","Volumenprofil","Orderblöcken"], correct: 0, explain: "Investoren leihen sich in Low-Yield-Währungen (z. B. JPY) und investieren in High-Yield-Währungen (z. B. AUD, NZD)." },

  // === CPI / Inflation ===
  { id: "FA04", q: "Ein höher als erwarteter CPI-Wert (USA) ist …", a: ["USD-positiv","USD-negativ","Neutral"], correct: 0, explain: "Mehr Inflation → Fed könnte Zinsen anheben → USD stärker." },
  { id: "FA05", q: "Sinkende Inflation führt oft zu …", a: ["Lockerung der Geldpolitik","Erhöhung der Zinsen","Automatischem Börsencrash"], correct: 0, explain: "Weniger Druck → Zentralbank könnte Zinsen senken." },
  { id: "FA19", q: "Der PCE-Index (Personal Consumption Expenditures) ist für die Fed …", a: ["Der wichtigste Inflationsindikator","Unwichtig","Nur für EU relevant"], correct: 0, explain: "Die Fed bevorzugt PCE > CPI, da er breiter ist und Konsumverhalten abbildet." },
  { id: "FA20", q: "Hohe Inflation wirkt sich oft wie auf Gold aus?", a: ["Gold steigt","Gold fällt","Neutral"], correct: 0, explain: "Gold gilt als Inflationsschutz → bei starker Inflation oft Nachfrage nach Gold." },

  // === NFP / Arbeitsmarkt ===
  { id: "FA06", q: "Was misst der US-NFP?", a: ["Veränderung der Beschäftigtenzahlen ohne Landwirtschaft","Alle Jobs inklusive Landwirtschaft","Nur Arbeitslosenquote"], correct: 0, explain: "Non-Farm Payrolls = wichtigste Arbeitsmarktdaten der USA." },
  { id: "FA07", q: "Ein starker NFP-Wert (mehr Jobs) ist für USD …", a: ["Bullisch","Bärisch","Neutral"], correct: 0, explain: "Starke Daten = gesunde Wirtschaft → Fed eher hawkish → USD bullisch." },
  { id: "FA21", q: "Was bedeutet 'Average Hourly Earnings'?", a: ["Durchschnittliche Stundenlöhne, wichtiger Inflationsindikator","Produktionskosten","Nur Aktiengewinne"], correct: 0, explain: "Löhne beeinflussen Kaufkraft → höhere Löhne = Inflationstreiber." },
  { id: "FA22", q: "Ein schwacher Arbeitsmarktbericht führt meist zu …", a: ["Währungsschwäche","Währungsstärke","Neutralität"], correct: 0, explain: "Schwache Jobs = schwache Wirtschaft → Währung oft unter Druck." },

  // === GDP, PMI, Arbeitslosenquote ===
  { id: "FA08", q: "GDP steht für …", a: ["Bruttoinlandsprodukt","Preisindex","Zinsdifferenz"], correct: 0, explain: "Gross Domestic Product = Maß für die Wirtschaftsleistung." },
  { id: "FA09", q: "PMI (Purchasing Managers Index) misst …", a: ["Stimmung im verarbeitenden Gewerbe","Inflation","Arbeitslosenquote"], correct: 0, explain: "PMI = Frühindikator für wirtschaftliche Aktivität." },
  { id: "FA10", q: "Steigende Arbeitslosenquote ist für die Währung meist …", a: ["Schwach","Stark","Neutral"], correct: 0, explain: "Mehr Arbeitslose = schwächere Wirtschaft = Währung unter Druck." },
  { id: "FA23", q: "Ein PMI über 50 bedeutet …", a: ["Expansion","Rezession","Neutral"], correct: 0, explain: "PMI > 50 = Wirtschaft wächst, < 50 = Schrumpfung." },
  { id: "FA24", q: "Ein negatives GDP-Wachstum über zwei Quartale gilt als …", a: ["Rezession","Boom","Deflation"], correct: 0, explain: "Technische Definition einer Rezession." },

  // === Zentralbank-Reden ===
  { id: "FA11", q: "Warum sind Zentralbank-Reden (z. B. Powell, Lagarde) so wichtig?", a: ["Sie deuten künftige Geldpolitik an","Sie bewegen keine Märkte","Sie enthalten nur Rückblicke"], correct: 0, explain: "Forward Guidance → Märkte reagieren stark auf den Tonfall." },
  { id: "FA12", q: "Ein hawkisher Tonfall bedeutet …", a: ["Tendenz zu Zinserhöhungen","Tendenz zu Zinssenkungen","Keine Änderung"], correct: 0, explain: "Hawkish = restriktiv, Fokussierung auf Inflation, höhere Zinsen möglich." },
  { id: "FA25", q: "Ein dovisher Tonfall bedeutet …", a: ["Lockerung, Tendenz zu Zinssenkungen","Mehr Zinserhöhungen","Neutral"], correct: 0, explain: "Dovish = expansive Geldpolitik, lockerer Kurs." },
  { id: "FA26", q: "Forward Guidance bedeutet …", a: ["Hinweise der Zentralbank auf künftige Politik","Aktuelle Marktdaten","Technische Analyse"], correct: 0, explain: "Kommunikation = Signal für Zinskurs → extrem marktbewegend." },

  // === Geopolitische Ereignisse ===
  { id: "FA13", q: "Kriege/Krisen führen bei Gold typischerweise zu …", a: ["Steigenden Kursen (Safe Haven)","Fallenden Kursen","Keiner Bewegung"], correct: 0, explain: "Gold = klassischer sicherer Hafen in Krisenzeiten." },
  { id: "FA14", q: "Ein Ölpreisschock (starker Anstieg) wirkt oft …", a: ["Inflationstreibend","Deflationär","Neutral"], correct: 0, explain: "Teures Öl verteuert Produktion/Transport → Inflationsschub." },
  { id: "FA27", q: "Wie reagiert der JPY oft auf geopolitische Krisen?", a: ["JPY stärkt sich (Safe Haven)","JPY schwächt sich","Keine Reaktion"], correct: 0, explain: "Der Yen gilt wie der CHF als sicherer Hafen." },
  { id: "FA28", q: "Welche Währung gilt ebenfalls als sicherer Hafen neben Gold?", a: ["CHF","AUD","NZD"], correct: 0, explain: "Schweizer Franken wird in Krisenzeiten stark nachgefragt." },

  // === Unternehmensdaten (Aktien) ===
  { id: "FA15", q: "Welche Daten bewegen Aktienkurse stark?", a: ["Quartalszahlen (Earnings)","RSI-Indikatoren","Forex-Sessions"], correct: 0, explain: "Umsatz & Gewinnberichte (Earnings Season) → starke Volatilität." },
  { id: "FA16", q: "Ein besser als erwartetes EPS (Earnings per Share) ist für die Aktie …", a: ["Positiv","Negativ","Neutral"], correct: 0, explain: "Übertrifft Firma die Schätzungen → oft Kursanstieg." },
  { id: "FA29", q: "Ein schlechter Ausblick (Guidance) trotz guter Earnings führt oft zu …", a: ["Fallenden Kursen","Steigenden Kursen","Neutralität"], correct: 0, explain: "Guidance wichtiger als aktuelle Zahlen → Markt preist Zukunft ein." },
  { id: "FA30", q: "Dividendenkürzungen wirken auf Aktienkurse …", a: ["Negativ","Positiv","Neutral"], correct: 0, explain: "Kürzungen = Vertrauensverlust → Aktie fällt oft." },
  { id: "FA31", q: "Ein steigendes P/E-Ratio (KGV) bei gleichbleibendem Gewinn bedeutet …", a: ["Überbewertung","Unterbewertung","Neutral"], correct: 0, explain: "Höheres KGV = Aktie wird teurer bewertet." },

  // === Rohstoffe / Sonstiges ===
  { id: "FA32", q: "Ein starker USD wirkt auf Ölpreise oft …", a: ["Dämpfend","Steigernd","Neutral"], correct: 0, explain: "Öl wird in USD gehandelt → starker USD = Öl für andere Länder teurer → Nachfrage sinkt." },
  { id: "FA33", q: "OPEC-Entscheidungen beeinflussen …", a: ["Ölpreise","Goldpreise","Zinsen"], correct: 0, explain: "Fördermengen-Kürzungen/Erhöhungen → direkte Auswirkung auf Öl." },
  { id: "FA34", q: "Ein steigender VIX (Volatilitätsindex) zeigt …", a: ["Mehr Angst am Markt","Optimismus","Neutralität"], correct: 0, explain: "VIX = Fear Index, steigt in Krisen." },
  { id: "FA35", q: "Ein Handelsbilanzüberschuss wirkt auf die Währung …", a: ["Stärkend","Schwächend","Neutral"], correct: 0, explain: "Mehr Exporte als Importe → Nachfrage nach Landeswährung steigt." }
],



 "Risk Management": [
  // === Lot Size Berechnung ===
  { id: "RM01", q: "Die Lot Size Berechnung dient dazu …", a: ["das Risiko pro Trade zu kontrollieren","die Gewinne zu verdoppeln","den Spread zu reduzieren"], correct: 0, explain: "Lot Size = so groß wählen, dass Risiko (z. B. 1–2 % vom Konto) nicht überschritten wird." },
  { id: "RM02", q: "Welche Angaben sind nötig zur Lot Size Berechnung?", a: ["Kontogröße, Risiko %, Stop-Loss in Pips","Nur Kontogröße","Nur Risiko %"], correct: 0, explain: "Alle drei Faktoren bestimmen die Positionsgröße." },

  // === Risiko pro Trade ===
  { id: "RM03", q: "Welcher Risikoanteil pro Trade gilt als Standard für Profis?", a: ["1–2 %","10–15 %","0,01 %"], correct: 0, explain: "Klein halten → Kapitalschutz, 1–2 % pro Trade üblich." },
  { id: "RM04", q: "Was passiert bei 10 % Risiko pro Trade?", a: ["Schon wenige Verluste können das Konto ruinieren","Das Konto wächst schneller","Es passiert nichts"], correct: 0, explain: "Zu hohes Risiko → Drawdown steigt, Konto schnell gefährdet." },

  // === Max Drawdown ===
  { id: "RM05", q: "Drawdown beschreibt …", a: ["den maximalen prozentualen Kontoverlust vom Peak","die Anzahl offener Trades","den Unterschied zwischen Bid/Ask"], correct: 0, explain: "Drawdown = Abstand höchster Kontostand → niedrigster Punkt." },
  { id: "RM06", q: "Welcher Drawdown gilt als kritisch?", a: ["> 30–40 %","5 %","2 %"], correct: 0, explain: "Ab ~30 % DD schwer wieder aufzuholen → Kapitalschutz entscheidend." },
  { id: "RM14", q: "Ein Drawdown von 50 % erfordert …", a: ["100 % Gewinn, um Break-even zu erreichen","50 % Gewinn","25 % Gewinn"], correct: 0, explain: "Je tiefer der DD, desto exponentiell schwerer → 50 % Verlust = 100 % Gewinn nötig." },

  // === Risk-to-Reward (RR) ===
  { id: "RM07", q: "Ein RR von 1:3 bedeutet …", a: ["Risiko = 1, Chance = 3","Risiko = 3, Chance = 1","Nur Scalper nutzen das"], correct: 0, explain: "1:3 → für 1 € Risiko sind 3 € Gewinnziel geplant." },
  { id: "RM08", q: "Warum ist RR so wichtig?", a: ["Man kann auch mit niedriger Trefferquote profitabel sein","Es zeigt nur den Spread","Es macht Trades automatisch profitabel"], correct: 0, explain: "Schon bei 30 % Trefferquote kann man mit 1:3 RR im Plus sein." },
  { id: "RM15", q: "Ein Trader mit RR 1:2 braucht …", a: ["≥ 34 % Trefferquote für Profit","≥ 50 % Trefferquote","≥ 70 % Trefferquote"], correct: 0, explain: "Mit RR 1:2 reicht schon 34 % Winrate für Break-even." },

  // === Diversifikation ===
  { id: "RM09", q: "Diversifikation im Trading bedeutet …", a: ["Risiko auf mehrere Märkte/Strategien verteilen","Gleichzeitig alle JPY-Paare shorten","Nur Aktien kaufen"], correct: 0, explain: "Diversifikation reduziert Risiko durch Streuung." },
  { id: "RM16", q: "Warum ist Über-Diversifikation problematisch?", a: ["Fokus & Qualität der Trades sinkt","Das Risiko steigt extrem","Man kann keine Lot Size berechnen"], correct: 0, explain: "Zu viele Trades/Assets = fehlende Kontrolle & sinkende Effizienz." },

  // === Hebel & Margin ===
  { id: "RM10", q: "Ein Hebel von 1:500 bedeutet …", a: ["1 € Eigenkapital kontrolliert 500 € Marktvolumen","Man darf nur 500 € einzahlen","Spread wird 500x kleiner"], correct: 0, explain: "Hoher Hebel verstärkt Chancen und Risiken." },
  { id: "RM11", q: "Margin ist …", a: ["das Sicherheitskapital, das für offene Trades geblockt wird","die Handelsgebühr","das verfügbare Guthaben"], correct: 0, explain: "Margin = hinterlegtes Kapital zur Absicherung deiner Position." },
  { id: "RM17", q: "Margin Call bedeutet …", a: ["Broker fordert Nachschuss oder schließt Positionen","Spread steigt","Gewinn wird automatisch ausgezahlt"], correct: 0, explain: "Margin Call = wenn Equity zu gering → Broker schließt Trades." },
  { id: "RM18", q: "Freie Margin ist …", a: ["Kapital, das für neue Trades verfügbar ist","Der Kontostand","Swap-Guthaben"], correct: 0, explain: "Freie Margin = Equity – gebundene Margin." },

  // === Swap / Overnight Fees ===
  { id: "RM12", q: "Swap-Gebühren entstehen …", a: ["beim Halten von Positionen über Nacht","nur bei Krypto-Trades","beim Platzieren von Limit Orders"], correct: 0, explain: "Übernachtfinanzierungskosten → können positiv oder negativ sein." },
  { id: "RM13", q: "Wann sind Swaps oft höher?", a: ["Mittwochs (3-fach Berechnung)","Montags","Immer gleich hoch"], correct: 0, explain: "Mittwoch = 3-fach Swap (Ausgleich fürs Wochenende)." },
  { id: "RM19", q: "Swap-Free Accounts (Islamic Accounts) bedeuten …", a: ["Keine Übernachtgebühren, oft dafür höhere Kommissionen","Komplett kostenloses Trading","Hebel ohne Risiko"], correct: 0, explain: "Swap-Free = keine Finanzierungskosten, aber Broker gleicht es über Fees aus." },

  // === Money Management & Psychologie ===
  { id: "RM20", q: "Warum ist Konsistenz im Risiko pro Trade entscheidend?", a: ["Es verhindert chaotisches Wachstum & zu hohe Drawdowns","Es steigert die Trefferquote","Es reduziert den Spread"], correct: 0, explain: "Immer gleiches Risiko → verlässliche Equity-Kurve & bessere Kontrolle." },
  { id: "RM21", q: "Was passiert, wenn man Risiko nach Gewinnen erhöht (Martingale)?", a: ["Sehr riskant, Konto kann schnell implodieren","Sichere Wachstumsstrategie","Kein Effekt"], correct: 0, explain: "Martingale kann kurzfristig pushen, aber langfristig extrem gefährlich." },
  { id: "RM22", q: "Ein stabiler Risk Plan führt zu …", a: ["Langfristigem Überleben am Markt","Schnellen 1000 % Gewinnen","Keinem Unterschied"], correct: 0, explain: "Risikomanagement > Strategie → entscheidend für Survival." },
  { id: "RM23", q: "Was ist die wichtigste Regel im Risk Management?", a: ["Kapitalerhalt vor Profit","Maximale Lots handeln","Kein Stop-Loss setzen"], correct: 0, explain: "Survival first → Profit kommt nur mit Kapitalerhalt." }
],


  
"Psychologie": [
  // === FOMO ===
  { id: "PSY01", q: "FOMO im Trading bedeutet …", a: ["Fear of Missing Out – Angst, eine Chance zu verpassen","Focus on Market Orders","Financial Over Management Operations"], correct: 0, explain: "FOMO = unüberlegte Entries, weil man Angst hat, etwas zu verpassen." },
  { id: "PSY02", q: "Wie vermeidet man FOMO am besten?", a: ["Klare Regeln & nur geplante Setups handeln","Jeden Markt gleichzeitig beobachten","Sofort jedem Move hinterherspringen"], correct: 0, explain: "Plan + Regeln + Geduld → FOMO kontrollieren." },

  // === Revenge Trading ===
  { id: "PSY03", q: "Revenge Trading bedeutet …", a: ["Nach einem Verlust sofort unüberlegt wieder traden","Einen Trade doppelt absichern","Gewinne feiern"], correct: 0, explain: "Revenge Trading = emotionales Handeln nach Verlust → führt oft zu noch größeren Verlusten." },
  { id: "PSY04", q: "Wie verhindert man Revenge Trading?", a: ["Trading-Pause einlegen & Regeln befolgen","Position verdoppeln","Noch aggressiver einsteigen"], correct: 0, explain: "Pause + Disziplin = Schutz vor impulsiven Fehltrades." },

  // === Overtrading ===
  { id: "PSY05", q: "Overtrading bedeutet …", a: ["Zu viele Trades ohne valide Setups","Mehrere Konten gleichzeitig nutzen","Sehr große Lot Size"], correct: 0, explain: "Overtrading = aus Langeweile oder Gier permanent traden." },
  { id: "PSY06", q: "Folge von Overtrading ist oft …", a: ["Kontoverlust durch Fees & schlechte Entries","Mehr Geduld","Bessere Trefferquote"], correct: 0, explain: "Zu viele Trades = mehr Fehler & Kosten → Konto leidet." },

  // === Geduld & Disziplin ===
  { id: "PSY07", q: "Disziplin im Trading bedeutet …", a: ["Regeln und Setup-Checklisten strikt einhalten","Immer News handeln","Gefühl nachgehen"], correct: 0, explain: "Disziplin = Plan einhalten, nicht Emotionen." },
  { id: "PSY08", q: "Geduld ist wichtig, weil …", a: ["Nur wenige Stunden am Tag valide Setups entstehen","Der Markt 24/7 läuft","Man immer alles handeln sollte"], correct: 0, explain: "Geduld = auf A-Setups warten statt jeden Move zu traden." },
  { id: "PSY13", q: "Warum brechen Trader oft ihre eigenen Regeln?", a: ["Emotionen überwiegen die Logik","Weil die Strategie schlecht ist","Weil Broker es verlangen"], correct: 0, explain: "Angst und Gier sind stärker als rationale Regeln, wenn man sie nicht kontrolliert." },
  { id: "PSY14", q: "Ein klares Regelwerk hilft …", a: ["Emotionen auszuschalten","Mehr Trades zu machen","Spreadkosten zu senken"], correct: 0, explain: "Je fester die Regeln → desto weniger Raum für impulsive Entscheidungen." },

  // === Journaling ===
  { id: "PSY09", q: "Warum ist ein Trading-Journal wichtig?", a: ["Man erkennt Muster & eigene Fehler","Es macht Spaß","Broker verlangen es"], correct: 0, explain: "Nur wer dokumentiert, kann seine Stärken/Schwächen analysieren." },
  { id: "PSY10", q: "Was sollte ein Journal-Eintrag enthalten?", a: ["Setup, Entry/SL/TP, Emotionen, Ergebnis","Nur PnL","Nichts, wenn es ein Verlust war"], correct: 0, explain: "Je detaillierter → desto mehr Lerneffekt." },

  // === Emotionen vor/nach dem Trade ===
  { id: "PSY11", q: "Warum ist es wichtig, Emotionen vor dem Trade zu bewerten?", a: ["Um impulsive Entries zu vermeiden","Um mehr Trades zu machen","Um Broker zu beeindrucken"], correct: 0, explain: "Selbstkontrolle vor Entry = entscheidend für Disziplin." },
  { id: "PSY12", q: "Emotionen nach dem Trade zu notieren hilft …", a: ["Muster in Verhalten & Psychologie zu erkennen","Nächsten Entry sofort zu finden","Verluste zu verstecken"], correct: 0, explain: "Reflexion → verbessert Mindset & Trading-Prozess." },
  { id: "PSY15", q: "Wut nach einem Verlust führt oft zu …", a: ["Revenge Trading","Besserer Disziplin","Neutralem Verhalten"], correct: 0, explain: "Unkontrollierte Emotionen → impulsives Handeln." },
  { id: "PSY16", q: "Übermäßige Euphorie nach Gewinnen führt oft zu …", a: ["Größeren Risiken & Fehlern","Mehr Disziplin","Pause vom Markt"], correct: 0, explain: "Overconfidence ist genauso gefährlich wie Angst." },

  // === Stress & Mindset ===
  { id: "PSY17", q: "Was ist der häufigste Grund für Fehlentscheidungen im Trading?", a: ["Emotionale Impulse","Zu wenige Indikatoren","Zu hohe Rechenlast"], correct: 0, explain: "Emotionen dominieren → Logik & Strategie treten in den Hintergrund." },
  { id: "PSY18", q: "Warum ist ausreichend Schlaf für Trader entscheidend?", a: ["Konzentration & emotionale Stabilität","Man verpasst keine Setups","Broker verlangen es"], correct: 0, explain: "Übermüdung = mehr Fehler & impulsives Verhalten." },
  { id: "PSY19", q: "Welche Rolle spielt Selbstvertrauen im Trading?", a: ["Wichtig, aber darf nicht in Übermut kippen","Gar keine","Ersetzt jede Strategie"], correct: 0, explain: "Gesundes Selbstvertrauen = klare Entscheidungen, aber Balance halten." },
  { id: "PSY20", q: "Ein stabiler Tagesrhythmus wirkt sich auf Trading wie aus?", a: ["Fördert Disziplin & Konzentration","Macht Märkte berechenbarer","Hat keinen Einfluss"], correct: 0, explain: "Routine = weniger impulsive Fehler." },

  // === Selbstsabotage & Gier ===
  { id: "PSY21", q: "Gier zeigt sich im Trading oft durch …", a: ["Zu große Positionsgrößen & fehlendes TP","Mehr Geduld","Kein Trading"], correct: 0, explain: "Gier = Hauptgrund für Überhebelung & unnötige Verluste." },
  { id: "PSY22", q: "Selbstsabotage passiert, wenn …", a: ["Trader bewusst Regeln brechen trotz besseren Wissens","Man nur kleine Lots handelt","Man Nachrichten ignoriert"], correct: 0, explain: "Viele Verluste sind selbstverschuldet → durch Missachtung eigener Regeln." },
  { id: "PSY23", q: "Warum ist 'Break-even-Trading' oft ein Problem?", a: ["Angst verhindert, Trades laufen zu lassen","Es schützt Kapital perfekt","Es erhöht RR"], correct: 0, explain: "Zu frühes Absichern → Gewinne laufen nicht → Mindset von Angst dominiert." },
  { id: "PSY24", q: "Das Gefühl 'ich muss mein Geld zurückholen' ist …", a: ["Revenge Trading","Gute Disziplin","Rational"], correct: 0, explain: "Revenge Trading = emotionaler Fehler." },

  // === Perfektionismus & Erwartungshaltung ===
  { id: "PSY25", q: "Warum ist Perfektionismus im Trading gefährlich?", a: ["Kein Setup wirkt gut genug, man verpasst Chancen","Es sorgt für bessere Ergebnisse","Es reduziert Fehler"], correct: 0, explain: "Perfektionismus blockiert Entscheidungen & sorgt für FOMO." },
  { id: "PSY26", q: "Realistische Erwartung im Trading bedeutet …", a: ["Langfristiges Wachstum mit kontrolliertem Risiko","Jeden Monat 100 % Profit","Immer 100 % Trefferquote"], correct: 0, explain: "Realismus = Kapitalerhalt, 2–5 % pro Monat kann schon Top sein." },
  { id: "PSY27", q: "Warum sind unrealistische Gewinnziele gefährlich?", a: ["Sie führen zu Überhebelung & Fehlern","Sie motivieren mehr","Sie reduzieren Drawdowns"], correct: 0, explain: "Zu hohe Ziele = Druck → Fehler & Risikoexplosion." },

  // === Disziplin im Alltag ===
  { id: "PSY28", q: "Warum hilft Sport & Ausgleich beim Trading?", a: ["Reduziert Stress & verbessert Fokus","Erhöht Trefferquote automatisch","Hat keinen Einfluss"], correct: 0, explain: "Mentale Fitness = direkt verbunden mit Trading-Performance." },
  { id: "PSY29", q: "Warum ist eine feste Routine vor dem Trading wichtig?", a: ["Klares Mindset, weniger Impulsivität","Man verpasst News","Broker verlangen es"], correct: 0, explain: "Rituale/Routinen = psychologische Stabilität." },
  { id: "PSY30", q: "Was ist ein Zeichen mentaler Stärke im Trading?", a: ["Verlusttage akzeptieren ohne Rache-Impulse","Nie Verluste machen","Jeden Tag traden müssen"], correct: 0, explain: "Akzeptanz & Kontrolle der Emotionen = wahre Stärke." }
],


"Märkte & Instrumente": [
  // === Forex Majors ===
  { id: "MI01", q: "Welches Paar zählt zu den Forex Majors?", a: ["EUR/USD","EUR/GBP","XAU/USD"], correct: 0, explain: "Majors = Paare mit USD: EUR/USD, GBP/USD, USD/JPY, USD/CHF, AUD/USD, NZD/USD, USD/CAD." },
  { id: "MI02", q: "Warum sind Majors meist günstiger zu traden?", a: ["Hohe Liquidität = enge Spreads","Sie haben immer gleiche Volatilität","Broker verlangen keine Gebühren"], correct: 0, explain: "Majors = höchstes Volumen → kleinste Kosten." },

  // === Crosses ===
  { id: "MI03", q: "Cross-Paare sind …", a: ["Paare ohne USD (z. B. EUR/GBP, GBP/JPY)","Nur exotische Währungen","Indizes mit FX-Bezug"], correct: 0, explain: "Crosses = alle FX-Paare ohne USD." },
  { id: "MI04", q: "Ein typisches Yen-Cross ist …", a: ["GBP/JPY","USD/JPY","EUR/USD"], correct: 0, explain: "Yen-Crosses = GBP/JPY, EUR/JPY, AUD/JPY usw." },
  { id: "MI19", q: "Exotics im Forex sind …", a: ["Paare mit schwachen/emerging Markt-Währungen (z. B. USD/TRY, USD/ZAR)","Alle Paare mit USD","Nur Krypto-Paare"], correct: 0, explain: "Exotics = geringere Liquidität, höhere Spreads, mehr Risiko." },
  { id: "MI20", q: "Warum haben Exotics höhere Spreads?", a: ["Weniger Liquidität & höheres Risiko","Weil Broker es wollen","Sie sind immer manipuliert"], correct: 0, explain: "Geringes Volumen + Risiko für Broker = breitere Spreads." },

  // === Metalle ===
  { id: "MI05", q: "XAU/USD bezeichnet …", a: ["Gold gegen US-Dollar","Silber gegen USD","Öl gegen USD"], correct: 0, explain: "XAU = Gold, XAG = Silber." },
  { id: "MI06", q: "Warum gilt Gold oft als Safe Haven?", a: ["Wertzuwachs in Krisen & Inflation","Es korreliert immer mit EUR/USD","Weil es volatil ist"], correct: 0, explain: "Gold = Krisenschutz & Inflations-Hedge." },
  { id: "MI21", q: "XAG/USD ist …", a: ["Silber gegen US-Dollar","Kupfer","Platin"], correct: 0, explain: "XAG = Silber, oft ähnlich wie Gold gehandelt, aber volatiler." },
  { id: "MI22", q: "Platin & Palladium werden stark beeinflusst durch …", a: ["Autoindustrie (Katalysatoren)","Zentralbankzinsen","Krypto-Märkte"], correct: 0, explain: "Beide Metalle werden für Autokatalysatoren gebraucht." },

  // === Indizes ===
  { id: "MI07", q: "Der US30 entspricht …", a: ["Dow Jones (30 US-Unternehmen)","NASDAQ 100","S&P500"], correct: 0, explain: "US30 = Dow Jones Index." },
  { id: "MI08", q: "Der NAS100 enthält …", a: ["100 größte US-Tech-Aktien","100 Forex-Paare","100 Rohstoffe"], correct: 0, explain: "NASDAQ 100 = Tech-lastiger Index." },
  { id: "MI09", q: "SPX500 steht für …", a: ["S&P500 Index","Euro Stoxx 50","DAX 40"], correct: 0, explain: "SPX500 = 500 größte US-Unternehmen." },
  { id: "MI10", q: "GER40 ist …", a: ["Deutscher Leitindex DAX","FTSE 100","S&P Europe"], correct: 0, explain: "GER40 = DAX mit 40 größten DE-Unternehmen." },
  { id: "MI23", q: "UK100 steht für …", a: ["FTSE 100 (London)","Euro Stoxx 50","S&P 100"], correct: 0, explain: "UK100 = 100 größte Unternehmen in UK." },
  { id: "MI24", q: "Hong Kong Index (HK50) ist …", a: ["Hang Seng Index","Shanghai Composite","Nikkei 225"], correct: 0, explain: "HK50 = Hang Seng, spiegelt chinesische Wirtschaft mit." },
  { id: "MI25", q: "Warum reagieren Indizes stark auf Zinsentscheidungen?", a: ["Zinsen beeinflussen Finanzierung & Investitionen","Weil Fibonacci-Level brechen","Weil der Spread größer wird"], correct: 0, explain: "Höhere Zinsen = weniger Aktiennachfrage, Indizes fallen oft." },

  // === Krypto ===
  { id: "MI11", q: "BTC/USD steht für …", a: ["Bitcoin gegen US-Dollar","Binance Coin","Britisches Pfund"], correct: 0, explain: "BTC/USD = Bitcoin Preis in Dollar." },
  { id: "MI12", q: "ETH gilt als …", a: ["Plattform für Smart Contracts","Reines Zahlungsmittel wie BTC","Stablecoin"], correct: 0, explain: "Ethereum = Basis für DeFi, Smart Contracts, NFTs." },
  { id: "MI13", q: "Altcoins sind …", a: ["Alle Coins außer Bitcoin","Stablecoins","NFT-Projekte"], correct: 0, explain: "Altcoins = alternative Coins (ETH, ADA, SOL etc.)." },
  { id: "MI26", q: "Stablecoins (z. B. USDT, USDC) sind …", a: ["An USD gekoppelte Coins","Mining-basierte Tokens","NFT-Projekte"], correct: 0, explain: "Stablecoins sind digitale Dollar-Äquivalente." },
  { id: "MI27", q: "Warum ist Krypto-Handel am Wochenende riskanter?", a: ["Geringere Liquidität, höhere Volatilität","Weil Forex geschlossen ist","Weil Broker keine Gebühren verlangen"], correct: 0, explain: "Weniger Volumen = größere Moves möglich." },

  // === Rohstoffe ===
  { id: "MI14", q: "WTI bezeichnet …", a: ["West Texas Intermediate (US-Öl)","Weizenpreis","Kupfer"], correct: 0, explain: "WTI = US-Ölsorte." },
  { id: "MI15", q: "Brent ist …", a: ["Nordsee-Öl","US-Gas","Australisches Gold"], correct: 0, explain: "Brent = europäische Ölsorte (Nordsee)." },
  { id: "MI16", q: "Gaspreise sind stark abhängig von …", a: ["Geopolitik & Lieferketten","Fibonacci Levels","RSI-Signalen"], correct: 0, explain: "Energiepreise reagieren massiv auf geopolitische Krisen." },
  { id: "MI28", q: "Welche Rohstoffe gelten als Soft Commodities?", a: ["Agrarprodukte wie Kaffee, Zucker, Baumwolle","Öl & Gas","Edelmetalle"], correct: 0, explain: "Softs = Agrarprodukte, oft saisonal geprägt." },
  { id: "MI29", q: "Kupfer wird oft als … bezeichnet?", a: ["Dr. Copper – Wirtschaftsindikator","Safe Haven","Inflationsschutz"], correct: 0, explain: "Kupfer = stark konjunkturabhängig, Indikator für Wirtschaft." },

  // === Anleihen ===
  { id: "MI17", q: "US-Treasuries sind …", a: ["US-Staatsanleihen","Aktien","Krypto-ETFs"], correct: 0, explain: "Treiber für Zinsmärkte, beeinflussen USD stark." },
  { id: "MI18", q: "Steigende Anleiherenditen bedeuten oft …", a: ["Stärkeren USD","Schwächeren USD","Keine Auswirkung"], correct: 0, explain: "Höhere Renditen ziehen Kapital an → USD profitiert." },
  { id: "MI30", q: "Warum korrelieren Bond-Yields oft invers mit Aktien?", a: ["Höhere Zinsen machen Bonds attraktiver als Aktien","Weil Aktien Fibonacci brechen","Weil Bondmärkte geschlossen sind"], correct: 0, explain: "Kapital rotiert → steigende Renditen = Druck auf Aktien." },
  { id: "MI31", q: "Die 10y US-Treasury Yield gilt als …", a: ["Benchmark für globale Finanzmärkte","Unwichtig","Nur für Krypto relevant"], correct: 0, explain: "10-jährige Rendite = global wichtigster Zinsindikator." }
],


"Deine Regeln": [
  // === AOI/POI ===
  { id: "DR01", q: "AOI/POI im Trading bedeutet …", a: ["Area/Point of Interest – markanter Bereich im Chart","Automatischer Order Indikator","Preis ohne Einfluss"], correct: 0, explain: "AOI/POI = Bereich, wo Smart Money reagiert → Grundlage für Entry-Suche." },
  { id: "DR02", q: "Welche AOIs sind bei dir Pflicht für Trades?", a: ["Weekly & Daily AOIs","Nur 5M Zonen","Zufällige Levels"], correct: 0, explain: "Haupt-AOIs = Weekly & Daily. Kleinere TFs dienen nur Entry-Bestätigung." },

  // === Multi-Timeframe Bias ===
  { id: "DR03", q: "Was beschreibt dein Multi-Timeframe Bias?", a: ["Richtung auf mehreren TFs (z. B. Weekly, Daily, 4H)","Nur die Kerzenfarbe","Den Spread eines Brokers"], correct: 0, explain: "Bias = Haupttrend über mehrere TFs bestimmen, bevor Entry gesucht wird." },
  { id: "DR04", q: "Wie viele Bias-TFs brauchst du mindestens für einen gültigen Entry?", a: ["Mindestens 2 bestätigte TFs","Nur 1 TF reicht","Bias ist egal"], correct: 0, explain: "Mindestens 2 TFs im Einklang = valide Grundlage für Trade." },

  // === Entry-Trigger ===
  { id: "DR05", q: "Welche Entry-Triggers nutzt du?", a: ["Rejection, Struktur-Shift, Liquidity Grab","RSI über 70","Nur Zufall"], correct: 0, explain: "Nur A-Setups mit klaren Triggern handeln." },
  { id: "DR06", q: "Ein Liquidity Grab ist für dich …", a: ["Sweep über markantes High/Low und Reversal","Wenn Markt keine Liquidität hat","Ein Spread-Test"], correct: 0, explain: "Stops über/unter EQH/EQL werden geholt, danach Umkehr." },

  // === TP/SL Regeln ===
  { id: "DR07", q: "Wo setzt du deinen Stop-Loss (SL)?", a: ["An dem Punkt, wo die Idee ungültig wird","Immer fix 30 Pips","Nie einen SL"], correct: 0, explain: "SL = dort, wo Setup invalid ist, nicht fix." },
  { id: "DR08", q: "Take-Profit (TP) setzt du …", a: ["Am nächsten Strukturpunkt (Kerzenkörper) oder Liquidity-Pool","Immer bei 100 Pips","Zufällig"], correct: 0, explain: "TP an Strukturpunkten oder Liquidity, angepasst an Setup." },
  { id: "DR15", q: "Wo kann der SL alternativ platziert werden?", a: ["Am Top/Bottom des Struktur-Shifts (15M–1H) + 5–7 Pips","Immer 1 Pip unter dem Entry","SL ist optional"], correct: 0, explain: "Alternative Regel: SL am Extrem des Shifts, mit kleinem Sicherheitsabstand." },
  { id: "DR16", q: "TP1 liegt bei Weekly-AOI-Entry …", a: ["Am Strukturpunkt (Kerzenkörper des HH/LL)","Immer bei 2R","An beliebiger Stelle"], correct: 0, explain: "Deine Regel: TP1 am Strukturpunkt, wenn Weekly AOI Entry." },

  // === Setup-Checkliste ===
  { id: "DR09", q: "Wozu dient deine Setup-Checkliste?", a: ["Disziplin & Qualitätsprüfung jedes Entries","Sie macht Trades automatisch profitabel","Nur für Backtests"], correct: 0, explain: "Checkliste = Regelwerk prüfen → valide oder nicht." },
  { id: "DR10", q: "Wie viele Regeln müssen mindestens erfüllt sein?", a: ["Mindestens 2 Bias-TFs + weitere Setup-Kriterien","Keine, solange du willst","Nur 1 beliebige Regel"], correct: 0, explain: "Mind. 2 Bias-TFs plus zusätzliche Regeln = gültiger Entry." },

  // === Day vs Swing ===
  { id: "DR11", q: "Unterschied zwischen Day- und Swing-Regeln ist …", a: ["Andere Pflicht-TFs & AOIs","Es gibt keinen Unterschied","Swing nutzt nur Indikatoren"], correct: 0, explain: "Day: kleiner TF Bias (1H/4H AOI), Swing: großer TF Bias (D1/W1 AOI)." },
  { id: "DR12", q: "Swing-Trades hältst du …", a: ["Mehrere Tage bis Wochen","Nur 5 Minuten","Immer Overnight"], correct: 0, explain: "Swing = längere Haltedauer, größere AOIs & größere Stops." },
  { id: "DR17", q: "Daytrading nutzt als AOI-Pflicht …", a: ["1H / 4H Zonen","Weekly AOI","Nur 5M Charts"], correct: 0, explain: "Day: Fokus auf kleinere AOIs für Entry-Bestätigung." },

  // === Set & Forget Pflicht ===
  { id: "DR13", q: "Set & Forget in deinem Regelwerk bedeutet …", a: ["Nach Entry nichts mehr anfassen","SL permanent nachjustieren","Trade ohne SL laufen lassen"], correct: 0, explain: "Setup vertrauen = kein Eingreifen nach Entry." },
  { id: "DR14", q: "Warum ist Set & Forget für dich Pflicht?", a: ["Um Emotionen rauszuhalten","Weil der Broker es verlangt","Weil es Trades größer macht"], correct: 0, explain: "Disziplin: Nicht eingreifen, Vertrauen ins Regelwerk." },
  { id: "DR18", q: "Was ist die Hauptidee hinter Set & Forget?", a: ["Emotionen ausschalten & Regelwerk vertrauen","Mehr Trades generieren","Risiko erhöhen"], correct: 0, explain: "Emotionen killen Performance → Vertrauen ins Setup schützt dich." },

  // === Confluence-Regeln ===
  { id: "DR19", q: "Wie bewertest du deinen Markt-Bias?", a: ["Weekly/Daily/4H mit Werten 1–3","Nur M5/M15","Zufällig nach Candlefarbe"], correct: 0, explain: "Bias = Bewertungsstufen (1 = weit weg, 2 = unterwegs, 3 = in AOI)." },
  { id: "DR20", q: "Eine Daily Rejection erkennst du …", a: ["An AOI oder psychologischem Level (00/50)","Am RSI","Am Spread"], correct: 0, explain: "Daily Rejection = Candle-Reversal an AOI oder psychologischem Level." },
  { id: "DR21", q: "Was gilt als Entry-Signal laut Confluence-Regeln?", a: ["Bullisches/bärisches Candle-Muster im 1H/2H/4H","Jede Doji-Candle","Jeder Spread-Sprung"], correct: 0, explain: "Entry nur mit Candle-Bestätigung im höheren TF." }
],

   
  }
};
