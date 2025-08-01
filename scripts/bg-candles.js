const canvas = document.getElementById("bgCandles");
const ctx = canvas.getContext("2d");

const candleWidth = 10;
const candleSpacing = 4;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// 👉 Nur EINMAL definieren
const totalCandles = Math.ceil(window.innerWidth / (candleWidth + candleSpacing)) + 50;

let candles = [];
for (let i = 0; i < totalCandles; i++) {
  candles.push(generateCandle(canvas.height / 2));
}


function generateCandle(prevY) {
  const drift = (Math.random() - 0.5) * 40;
  const open = prevY + drift;
  const close = open + (Math.random() - 0.5) * 30;
  const high = Math.max(open, close) + Math.random() * 15;
  const low = Math.min(open, close) - Math.random() * 15;

  return {
    open: clamp(open, 20, canvas.height - 20),
    close: clamp(close, 20, canvas.height - 20),
    high: clamp(high, 20, canvas.height - 20),
    low: clamp(low, 20, canvas.height - 20)
  };
}

function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

function drawCandles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  let x = canvas.width - (candles.length * (candleWidth + candleSpacing));


  for (let c of candles) {
    const isBull = c.close > c.open;
    ctx.strokeStyle = isBull ? "#00ff99" : "#ff5555";
    ctx.fillStyle = ctx.strokeStyle;

    // Docht
    ctx.beginPath();
    ctx.moveTo(x + candleWidth / 2, c.high);
    ctx.lineTo(x + candleWidth / 2, c.low);
    ctx.stroke();

    // Body
    const bodyTop = Math.min(c.open, c.close);
    const bodyHeight = Math.abs(c.open - c.close);
    ctx.fillRect(x, bodyTop, candleWidth, Math.max(2, bodyHeight));

    x += candleWidth + candleSpacing;
  }
}

function animate() {
  candles.shift(); // Entferne erste
  const last = candles[candles.length - 1];
  candles.push(generateCandle(last.close)); // Füge neue hinzu
  drawCandles();
  requestAnimationFrame(() => setTimeout(animate, 100));
}

animate(); 