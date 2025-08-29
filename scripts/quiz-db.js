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
    ],


  "Technik": [
  // === Candlestick-Formationen ===
  { id: "TA01", q: "Eine Pin Bar signalisiert oft …", a: ["Rejection / Ablehnung", "Trendfortsetzung", "Kein Signal"], correct: 0, explain: "Lange Lunte/Docht = Markt lehnt Preislevel ab." },
  { id: "TA02", q: "Welche Candle gilt als starkes Umkehrsignal?", a: ["Bullish/Bearish Engulfing", "Marubozu", "Inside Bar"], correct: 0, explain: "Engulfing = vollständiges Verschlucken der vorherigen Kerze." },
  { id: "TA03", q: "Ein Doji zeigt …", a: ["Unentschlossenheit", "Trendfortsetzung", "Starken Trend"], correct: 0, explain: "Doji = Open ≈ Close, Markt unentschlossen." },
  { id: "TA04", q: "Ein Marubozu (Kerze ohne Dochte) signalisiert …", a: ["Starkes Momentum", "Ruhige Seitwärtsphase", "Umkehr"], correct: 0, explain: "Ohne Lunte → Käufer/Verkäufer dominieren komplett." },
  { id: "TA05", q: "Eine Inside Bar bedeutet …", a: ["Konsolidierung / Range", "Trendfortsetzung", "Marktumkehr"], correct: 0, explain: "Inside Bar = im Range der vorherigen Kerze → Markt sammelt Orders." },

  // === Chartmuster ===
  { id: "TA06", q: "Head & Shoulders Formation deutet oft auf …", a: ["Reversal", "Trendfortsetzung", "Seitwärtsphase"], correct: 0, explain: "Kopf-Schulter-Muster = klassisches Umkehrsignal." },
  { id: "TA07", q: "Ein Double Top signalisiert …", a: ["Bärische Umkehr", "Bullische Fortsetzung", "Kein Signal"], correct: 0, explain: "Doppeltes Hoch = Widerstand bestätigt, oft Umkehr." },
  { id: "TA08", q: "Ein Double Bottom signalisiert …", a: ["Bullische Umkehr", "Trendfortsetzung abwärts", "Seitwärtsmarkt"], correct: 0, explain: "Doppeltes Tief = Support bestätigt, oft Trendwechsel nach oben." },
  { id: "TA09", q: "Bullische Flaggen deuten oft auf …", a: ["Trendfortsetzung", "Reversal", "Unentschlossenheit"], correct: 0, explain: "Flaggen = Konsolidierung im Trend → Breakout meist in Trendrichtung." },
  { id: "TA10", q: "Wedges (Keile) enden oft mit …", a: ["Breakout", "Seitwärtsbewegung", "Trendlosigkeit"], correct: 0, explain: "Wedge = sich verengende Struktur → Ausbruch meist stark." },

  // === Trendlinien & Kanäle ===
  { id: "TA11", q: "Trendlinien verbinden …", a: ["Mehrere HH/LL oder HL/LH", "Kerzenkörper", "Indikatorenwerte"], correct: 0, explain: "Trendlinie = geometrische Verbindung signifikanter Hochs/Tiefs." },
  { id: "TA12", q: "Kanäle bestehen aus …", a: ["Zwei parallelen Trendlinien", "Einem OB", "Einer FVG"], correct: 0, explain: "Channel = Range mit parallelen Linien." },

  // === Support & Resistance ===
  { id: "TA13", q: "Support ist …", a: ["Ein Preislevel, an dem Nachfrage dominiert", "Ein RSI-Level", "Ein Moving Average"], correct: 0, explain: "Support = Käufer treten stark auf, Preis dreht oft nach oben." },
  { id: "TA14", q: "Resistance ist …", a: ["Ein Preislevel, an dem Angebot dominiert", "Eine Fibonacci-Zahl", "Ein OB"], correct: 0, explain: "Widerstand = Verkäufer aktiv → Preis dreht oft nach unten." },
  { id: "TA15", q: "Je öfter ein Support/Resistance getestet wird …", a: ["Desto schwächer wird er", "Desto stärker wird er", "Unverändert"], correct: 0, explain: "Mehr Tests = mehr Orders absorbiert = Level bricht leichter." },

  // === Fibonacci ===
  { id: "TA16", q: "Welches Fibo-Level gilt als wichtigstes Retracement?", a: ["61.8%", "23.6%", "161.8%"], correct: 0, explain: "61.8 % = „goldener Schnitt“ → starkes Reaktionslevel." },
  { id: "TA17", q: "Welche Levels gelten als Extensions?", a: ["127%, 161.8%", "23.6%, 38.2%", "50%, 61.8%"], correct: 0, explain: "Extensions > 100 %, Retracements < 100 %." },
  { id: "TA18", q: "Was zeigt das 50%-Level oft an?", a: ["Premium/Discount EQ", "Umkehrsignal", "Support"], correct: 0, explain: "50 % = Equilibrium → magnetisch für Preis." },

  // === Indikatoren ===
  { id: "TA19", q: "RSI > 70 bedeutet …", a: ["Überkauft", "Überverkauft", "Neutral"], correct: 0, explain: "RSI > 70 = überkauft, < 30 = überverkauft." },
  { id: "TA20", q: "MACD-Crossover (Signal > MACD) bedeutet …", a: ["Mögliche Trendwende", "Seitwärtsphase", "Volumenanstieg"], correct: 0, explain: "Kreuzung = Momentumwechsel → häufiges Einstiegssignal." },
  { id: "TA21", q: "Moving Averages sind …", a: ["Nachlaufende Indikatoren", "Führende Indikatoren", "Volumenmessungen"], correct: 0, explain: "MAs = geglättete Preisdaten → zeigen Trendrichtung." },
  { id: "TA22", q: "Bollinger Bands messen …", a: ["Volatilität", "Liquidität", "Orderblock-Größe"], correct: 0, explain: "Bänder weiten sich bei hoher Volatilität, ziehen sich bei Ruhe zusammen." },

  // === Volumen ===
  { id: "TA23", q: "OBV (On Balance Volume) zeigt …", a: ["Kauf- und Verkaufsdruck anhand Volumenfluss", "RSI-Level", "Fibonacci-Level"], correct: 0, explain: "OBV = kumuliertes Volumen → Trendstärke." },
  { id: "TA24", q: "Volume Profile zeigt …", a: ["Volumenverteilung auf Preisleveln", "Volumen pro Zeiteinheit", "Nur Durchschnittsvolumen"], correct: 0, explain: "VP = horizontale Volumenbalken → zeigt POC, HVN, LVN." },
  { id: "TA25", q: "VWAP (Volume Weighted Average Price) ist …", a: ["Durchschnittspreis gewichtet nach Volumen", "Ein OB-Level", "Ein FVG-Level"], correct: 0, explain: "VWAP = vielgenutzter Referenzwert institutioneller Trader." }
],

"Fundamentals": [
  // === Zinsentscheide ===
  { id: "FA01", q: "Was passiert typischerweise bei einem Zinserhöhungs-Beschluss der Fed?", a: ["USD stärkt sich oft","USD schwächt sich","Gold steigt automatisch"], correct: 0, explain: "Höhere Zinsen machen USD-Anlagen attraktiver → Kapital fließt in den Dollar." },
  { id: "FA02", q: "Welche Zentralbank ist für den EUR entscheidend?", a: ["EZB","Fed","BoJ"], correct: 0, explain: "Die Europäische Zentralbank (EZB) setzt die Leitzinsen für die Eurozone." },
  { id: "FA03", q: "Welche Zentralbank beeinflusst vor allem den JPY?", a: ["BoJ","BoE","SNB"], correct: 0, explain: "Bank of Japan (BoJ) steuert den Yen – bekannt für ultra-lockere Geldpolitik." },

  // === CPI / Inflation ===
  { id: "FA04", q: "Ein höher als erwarteter CPI-Wert (USA) ist …", a: ["USD-positiv","USD-negativ","Neutral"], correct: 0, explain: "Mehr Inflation → Fed könnte Zinsen anheben → USD stärker." },
  { id: "FA05", q: "Sinkende Inflation führt oft zu …", a: ["Lockerung der Geldpolitik","Erhöhung der Zinsen","Automatischem Börsencrash"], correct: 0, explain: "Weniger Druck → Zentralbank könnte Zinsen senken." },

  // === NFP ===
  { id: "FA06", q: "Was misst der US-NFP?", a: ["Veränderung der Beschäftigtenzahlen ohne Landwirtschaft","Alle Jobs inklusive Landwirtschaft","Nur Arbeitslosenquote"], correct: 0, explain: "Non-Farm Payrolls = wichtigste Arbeitsmarktdaten der USA." },
  { id: "FA07", q: "Ein starker NFP-Wert (mehr Jobs) ist für USD …", a: ["Bullisch","Bärisch","Neutral"], correct: 0, explain: "Starke Daten = gesunde Wirtschaft → Fed eher hawkish → USD bullisch." },

  // === GDP, PMI, Arbeitslosenquote ===
  { id: "FA08", q: "GDP steht für …", a: ["Bruttoinlandsprodukt","Preisindex","Zinsdifferenz"], correct: 0, explain: "Gross Domestic Product = Maß für die Wirtschaftsleistung." },
  { id: "FA09", q: "PMI (Purchasing Managers Index) misst …", a: ["Stimmung im verarbeitenden Gewerbe","Inflation","Arbeitslosenquote"], correct: 0, explain: "PMI = Frühindikator für wirtschaftliche Aktivität." },
  { id: "FA10", q: "Steigende Arbeitslosenquote ist für die Währung meist …", a: ["Schwach","Stark","Neutral"], correct: 0, explain: "Mehr Arbeitslose = schwächere Wirtschaft = Währung unter Druck." },

  // === Zentralbank-Reden ===
  { id: "FA11", q: "Warum sind Zentralbank-Reden (z. B. Powell, Lagarde) so wichtig?", a: ["Sie deuten künftige Geldpolitik an","Sie bewegen keine Märkte","Sie enthalten nur Rückblicke"], correct: 0, explain: "Forward Guidance → Märkte reagieren stark auf den Tonfall." },
  { id: "FA12", q: "Ein hawkisher Tonfall bedeutet …", a: ["Tendenz zu Zinserhöhungen","Tendenz zu Zinssenkungen","Keine Änderung"], correct: 0, explain: "Hawkish = restriktiv, Fokussierung auf Inflation, höhere Zinsen möglich." },

  // === Geopolitische Ereignisse ===
  { id: "FA13", q: "Kriege/Krisen führen bei Gold typischerweise zu …", a: ["Steigenden Kursen (Safe Haven)","Fallenden Kursen","Keiner Bewegung"], correct: 0, explain: "Gold = klassischer sicherer Hafen in Krisenzeiten." },
  { id: "FA14", q: "Ein Ölpreisschock (starker Anstieg) wirkt oft …", a: ["Inflationstreibend","Deflationär","Neutral"], correct: 0, explain: "Teures Öl verteuert Produktion/Transport → Inflationsschub." },

  // === Unternehmensdaten (Aktien) ===
  { id: "FA15", q: "Welche Daten bewegen Aktienkurse stark?", a: ["Quartalszahlen (Earnings)","RSI-Indikatoren","Forex-Sessions"], correct: 0, explain: "Umsatz & Gewinnberichte (Earnings Season) → starke Volatilität." },
  { id: "FA16", q: "Ein besser als erwartetes EPS (Earnings per Share) ist für die Aktie …", a: ["Positiv","Negativ","Neutral"], correct: 0, explain: "Übertrifft Firma die Schätzungen → oft Kursanstieg." }
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

  // === Risk-to-Reward (RR) ===
  { id: "RM07", q: "Ein RR von 1:3 bedeutet …", a: ["Risiko = 1, Chance = 3","Risiko = 3, Chance = 1","Nur Scalper nutzen das"], correct: 0, explain: "1:3 → für 1 € Risiko sind 3 € Gewinnziel geplant." },
  { id: "RM08", q: "Warum ist RR so wichtig?", a: ["Man kann auch mit niedriger Trefferquote profitabel sein","Es zeigt nur den Spread","Es macht Trades automatisch profitabel"], correct: 0, explain: "Schon bei 30 % Trefferquote kann man mit 1:3 RR im Plus sein." },

  // === Diversifikation ===
  { id: "RM09", q: "Diversifikation im Trading bedeutet …", a: ["Risiko auf mehrere Märkte/Strategien verteilen","Gleichzeitig alle JPY-Paare shorten","Nur Aktien kaufen"], correct: 0, explain: "Diversifikation reduziert Risiko durch Streuung." },

  // === Hebel & Margin ===
  { id: "RM10", q: "Ein Hebel von 1:500 bedeutet …", a: ["1 € Eigenkapital kontrolliert 500 € Marktvolumen","Man darf nur 500 € einzahlen","Spread wird 500x kleiner"], correct: 0, explain: "Hoher Hebel verstärkt Chancen und Risiken." },
  { id: "RM11", q: "Margin ist …", a: ["das Sicherheitskapital, das für offene Trades geblockt wird","die Handelsgebühr","das verfügbare Guthaben"], correct: 0, explain: "Margin = hinterlegtes Kapital zur Absicherung deiner Position." },

  // === Swap / Overnight Fees ===
  { id: "RM12", q: "Swap-Gebühren entstehen …", a: ["beim Halten von Positionen über Nacht","nur bei Krypto-Trades","beim Platzieren von Limit Orders"], correct: 0, explain: "Übernachtfinanzierungskosten → können positiv oder negativ sein." },
  { id: "RM13", q: "Wann sind Swaps oft höher?", a: ["Mittwochs (3-fach Berechnung)","Montags","Immer gleich hoch"], correct: 0, explain: "Mittwoch = 3-fach Swap (Ausgleich fürs Wochenende)." }
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

  // === Journaling ===
  { id: "PSY09", q: "Warum ist ein Trading-Journal wichtig?", a: ["Man erkennt Muster & eigene Fehler","Es macht Spaß","Broker verlangen es"], correct: 0, explain: "Nur wer dokumentiert, kann seine Stärken/Schwächen analysieren." },
  { id: "PSY10", q: "Was sollte ein Journal-Eintrag enthalten?", a: ["Setup, Entry/SL/TP, Emotionen, Ergebnis","Nur PnL","Nichts, wenn es ein Verlust war"], correct: 0, explain: "Je detaillierter → desto mehr Lerneffekt." },

  // === Emotionen vor/nach dem Trade ===
  { id: "PSY11", q: "Warum ist es wichtig, Emotionen vor dem Trade zu bewerten?", a: ["Um impulsive Entries zu vermeiden","Um mehr Trades zu machen","Um Broker zu beeindrucken"], correct: 0, explain: "Selbstkontrolle vor Entry = entscheidend für Disziplin." },
  { id: "PSY12", q: "Emotionen nach dem Trade zu notieren hilft …", a: ["Muster in Verhalten & Psychologie zu erkennen","Nächsten Entry sofort zu finden","Verluste zu verstecken"], correct: 0, explain: "Reflexion → verbessert Mindset & Trading-Prozess." }
],

"Märkte & Instrumente": [
  // === Forex Majors ===
  { id: "MI01", q: "Welches Paar zählt zu den Forex Majors?", a: ["EUR/USD","EUR/GBP","XAU/USD"], correct: 0, explain: "Majors = Paare mit USD: EUR/USD, GBP/USD, USD/JPY, USD/CHF, AUD/USD, NZD/USD, USD/CAD." },
  { id: "MI02", q: "Warum sind Majors meist günstiger zu traden?", a: ["Hohe Liquidität = enge Spreads","Sie haben immer gleiche Volatilität","Broker verlangen keine Gebühren"], correct: 0, explain: "Majors = höchstes Volumen → kleinste Kosten." },

  // === Crosses ===
  { id: "MI03", q: "Cross-Paare sind …", a: ["Paare ohne USD (z. B. EUR/GBP, GBP/JPY)","Nur exotische Währungen","Indizes mit FX-Bezug"], correct: 0, explain: "Crosses = alle FX-Paare ohne USD." },
  { id: "MI04", q: "Ein typisches Yen-Cross ist …", a: ["GBP/JPY","USD/JPY","EUR/USD"], correct: 0, explain: "Yen-Crosses = GBP/JPY, EUR/JPY, AUD/JPY usw." },

  // === Metalle ===
  { id: "MI05", q: "XAU/USD bezeichnet …", a: ["Gold gegen US-Dollar","Silber gegen USD","Öl gegen USD"], correct: 0, explain: "XAU = Gold, XAG = Silber." },
  { id: "MI06", q: "Warum gilt Gold oft als Safe Haven?", a: ["Wertzuwachs in Krisen & Inflation","Es korreliert immer mit EUR/USD","Weil es volatil ist"], correct: 0, explain: "Gold = Krisenschutz & Inflations-Hedge." },

  // === Indizes ===
  { id: "MI07", q: "Der US30 entspricht …", a: ["Dow Jones (30 US-Unternehmen)","NASDAQ 100","S&P500"], correct: 0, explain: "US30 = Dow Jones Index." },
  { id: "MI08", q: "Der NAS100 enthält …", a: ["100 größte US-Tech-Aktien","100 Forex-Paare","100 Rohstoffe"], correct: 0, explain: "NASDAQ 100 = Tech-lastiger Index." },
  { id: "MI09", q: "SPX500 steht für …", a: ["S&P500 Index","Euro Stoxx 50","DAX 40"], correct: 0, explain: "SPX500 = 500 größte US-Unternehmen." },
  { id: "MI10", q: "GER40 ist …", a: ["Deutscher Leitindex DAX","FTSE 100","S&P Europe"], correct: 0, explain: "GER40 = DAX mit 40 größten DE-Unternehmen." },

  // === Krypto ===
  { id: "MI11", q: "BTC/USD steht für …", a: ["Bitcoin gegen US-Dollar","Binance Coin","Britisches Pfund"], correct: 0, explain: "BTC/USD = Bitcoin Preis in Dollar." },
  { id: "MI12", q: "ETH gilt als …", a: ["Plattform für Smart Contracts","Reines Zahlungsmittel wie BTC","Stablecoin"], correct: 0, explain: "Ethereum = Basis für DeFi, Smart Contracts, NFTs." },
  { id: "MI13", q: "Altcoins sind …", a: ["Alle Coins außer Bitcoin","Stablecoins","NFT-Projekte"], correct: 0, explain: "Altcoins = alternative Coins (ETH, ADA, SOL etc.)." },

  // === Rohstoffe ===
  { id: "MI14", q: "WTI bezeichnet …", a: ["West Texas Intermediate (US-Öl)","Weizenpreis","Kupfer"], correct: 0, explain: "WTI = US-Ölsorte." },
  { id: "MI15", q: "Brent ist …", a: ["Nordsee-Öl","US-Gas","Australisches Gold"], correct: 0, explain: "Brent = europäische Ölsorte (Nordsee)." },
  { id: "MI16", q: "Gaspreise sind stark abhängig von …", a: ["Geopolitik & Lieferketten","Fibonacci Levels","RSI-Signalen"], correct: 0, explain: "Energiepreise reagieren massiv auf geopolitische Krisen." },

  // === Anleihen ===
  { id: "MI17", q: "US-Treasuries sind …", a: ["US-Staatsanleihen","Aktien","Krypto-ETFs"], correct: 0, explain: "Treiber für Zinsmärkte, beeinflussen USD stark." },
  { id: "MI18", q: "Steigende Anleiherenditen bedeuten oft …", a: ["Stärkeren USD","Schwächeren USD","Keine Auswirkung"], correct: 0, explain: "Höhere Renditen ziehen Kapital an → USD profitiert." }
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

  // === Setup-Checkliste ===
  { id: "DR09", q: "Wozu dient deine Setup-Checkliste?", a: ["Disziplin & Qualitätsprüfung jedes Entries","Sie macht Trades automatisch profitabel","Nur für Backtests"], correct: 0, explain: "Checkliste = Regelwerk prüfen → valide oder nicht." },
  { id: "DR10", q: "Wie viele Regeln müssen mindestens erfüllt sein?", a: ["Mindestens 2 Bias-TFs + weitere Setup-Kriterien","Keine, solange du willst","Nur 1 beliebige Regel"], correct: 0, explain: "Mind. 2 Bias-TFs plus zusätzliche Regeln = gültiger Entry." },

  // === Day vs Swing ===
  { id: "DR11", q: "Unterschied zwischen Day- und Swing-Regeln ist …", a: ["Andere Pflicht-TFs & AOIs","Es gibt keinen Unterschied","Swing nutzt nur Indikatoren"], correct: 0, explain: "Day: kleiner TF Bias (1H/4H AOI), Swing: großer TF Bias (D1/W1 AOI)." },
  { id: "DR12", q: "Swing-Trades hältst du …", a: ["Mehrere Tage bis Wochen","Nur 5 Minuten","Immer Overnight"], correct: 0, explain: "Swing = längere Haltedauer, größere AOIs & größere Stops." },

  // === Set & Forget Pflicht ===
  { id: "DR13", q: "Set & Forget in deinem Regelwerk bedeutet …", a: ["Nach Entry nichts mehr anfassen","SL permanent nachjustieren","Trade ohne SL laufen lassen"], correct: 0, explain: "Setup vertrauen = kein Eingreifen nach Entry." },
  { id: "DR14", q: "Warum ist Set & Forget für dich Pflicht?", a: ["Um Emotionen rauszuhalten","Weil der Broker es verlangt","Weil es Trades größer macht"], correct: 0, explain: "Disziplin: Nicht eingreifen, Vertrauen ins Regelwerk." }
]

   
  }
};
