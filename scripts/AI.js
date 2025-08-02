document.getElementById("ocrUpload").addEventListener("change", function (event) {
  const file = event.target.files[0];
  const resultBox = document.getElementById("ocrResultBox");

  if (!file) {
    resultBox.innerHTML = "❌ Kein Bild ausgewählt.";
    return;
  }

  resultBox.innerHTML = "⏳ Bild wird analysiert...";

  Tesseract.recognize(file, "eng", {
    logger: m => console.log(m)
  }).then(({ data: { text } }) => {
    console.log("📸 Erkannter Text:", text);

    // 🔧 1. Text normalisieren
    const clean = text.replace(/\s+/g, " ").toUpperCase();

    // 🔎 2. Symbol-Erkennung (z. B. BTCUSD, XAUUSD, EURUSD, USD/JPY)
    const symbolMatch = clean.match(/\b([A-Z]{3}\/?[A-Z]{3})\b/);
    const symbol = symbolMatch ? symbolMatch[1].replace("/", "") : "❓";

    // 🧠 Alle erkannten Zahlen für Fallback
    const allNumbers = (clean.match(/\b\d{1,6}(?:[.,]\d{1,6})?\b/g) || []).map(n => parseFloat(n.replace(",", ".")));

    // 💰 3. Einstiegspreis (klassisch: ENTRY etc.)
    let entryMatch = clean.match(/(?:ENTRY|EINSTIEGSPREIS|KAUFEN|VERKAUFEN|PREIS|ÖFFNEN)[^0-9\-]*([\d.,]{3,10})/i);
    let entry = entryMatch ? parseFloat(entryMatch[1].replace(",", ".")) : null;

    if (!entry) {
      // Fallback: erste Zahl über 100 (für BTC, Gold, etc.)
      entry = allNumbers.find(n => n > 100 && n < 999999) || "❓";
    }

    // 📦 4. Lotgröße (klassisch: LOT, Volumen, usw.)
    let lotMatch = clean.match(/(?:LOT(?:S)?|VOLUMEN|POSITIONSGRÖSSE|ANZAHL)[^0-9\-]*([\d.,]{1,5})/i);
    let lot = lotMatch ? parseFloat(lotMatch[1].replace(",", ".")) : null;

    if (!lot) {
      // Fallback: erste Zahl zwischen 0.01 und 10
      lot = allNumbers.find(n => n >= 0.01 && n <= 10) || "❓";
    }

    // 🖨️ 5. Ausgabe anzeigen
    resultBox.innerHTML = `
      <b>🔍 Erkannte Werte:</b><br>
      Symbol: <b>${symbol}</b><br>
      Entry: <b>${entry}</b><br>
      Lot: <b>${lot}</b><br><br>
      <details><summary>📄 Volltext</summary><pre>${text}</pre></details>
    `;

    console.log("📥 Gefiltert:", { symbol, entry, lot });
  }).catch(err => {
    resultBox.innerHTML = "❌ Fehler bei der Texterkennung";
    console.error(err);
  });
});
