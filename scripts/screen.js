<!-- 🔍 Ergebnisbox für erkannte Daten -->
<div id="ocrResultBox" style="display:none; margin-top:15px; padding:15px; background:#222; border-radius:10px; color:#0f0; font-family:monospace;"></div>

<script src="https://unpkg.com/tesseract.js@v4.0.2/dist/tesseract.min.js"></script>
<script>
document.getElementById("screenshotUpload").addEventListener("change", async function (event) {
  const file = event.target.files[0];
  if (!file) return;

  const resultBox = document.getElementById("ocrResultBox");
  resultBox.style.display = "block";
  resultBox.innerHTML = "⏳ Erkenne Text im Screenshot...";

  try {
    const { data: { text } } = await Tesseract.recognize(file, 'eng');
    console.log("📄 OCR-Rohtext:", text);

    const values = parseTradeText(text);
    resultBox.innerHTML = `
      <strong>✅ Erkannte Werte:</strong><br>
      Symbol: ${values.symbol || "-"}<br>
      Richtung: ${values.direction || "-"}<br>
      Lotgröße: ${values.lot || "-"}<br>
      Entry: ${values.entry || "-"}<br>
      SL: ${values.sl || "-"}<br>
      TP: ${values.tp || "-"}<br>
    `;
  } catch (err) {
    console.error("❌ OCR-Fehler:", err);
    resultBox.innerHTML = "❌ Fehler beim Erkennen des Textes.";
  }
});

function parseTradeText(text) {
  return {
    symbol: (text.match(/(NZDUSD|EURUSD|XAUUSD|US30|GBPJPY|BTCUSD)/i) || [])[1],
    direction: /Short/i.test(text) ? "Short" : (/Long|Buy/i.test(text) ? "Long" : ""),
    lot: parseFloat((text.match(/Lot\s*Größe.*?([0-9.]+)/i) || [])[1]),
    entry: parseFloat((text.match(/Einstieg.*?([0-9.]{5,})/i) || [])[1]),
    tp: parseFloat((text.match(/Profit.*?([0-9.]{5,})/i) || [])[1]),
    sl: parseFloat((text.match(/Stop.*?([0-9.]{5,})/i) || [])[1]),
  };
}
</script>
