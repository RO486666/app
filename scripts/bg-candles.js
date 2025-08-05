const canvas = document.getElementById("bgCandles");
const ctx = canvas.getContext("2d");

const candleWidth = 8;
const candleSpacing = 5;
const maxCandles = 80;
let candles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

function generateCandle() {
  const x = Math.random() * canvas.width;
  const y = Math.random() * canvas.height;
  const open = y + (Math.random() - 0.5) * 40;
  const close = open + (Math.random() - 0.5) * 30;
  const high = Math.max(open, close) + Math.random() * 15;
  const low = Math.min(open, close) - Math.random() * 15;

  return {
    x,
    open: clamp(open, 10, canvas.height - 10),
    close: clamp(close, 10, canvas.height - 10),
    high: clamp(high, 10, canvas.height - 10),
    low: clamp(low, 10, canvas.height - 10),
    lifetime: Math.random() * 200 + 100,
    chartPattern: generateChartPattern(x) // Neues Feld
  };
}

// 🎯 Zufälliges Mikro-Chart-Muster generieren (Zickzack-Linie)
function generateChartPattern(baseX) {
  const points = [];
  const steps = 5 + Math.floor(Math.random() * 5);
  let y = Math.random() * canvas.height;
  for (let i = 0; i < steps; i++) {
    const dx = baseX + i * (candleWidth / 2);
    y += (Math.random() - 0.5) * 20;
    y = clamp(y, 10, canvas.height - 10);
    points.push({ x: dx, y });
  }
  return points;
}

function drawChartPattern(pattern) {
  ctx.beginPath();
  ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
  for (let i = 0; i < pattern.length - 1; i++) {
    ctx.moveTo(pattern[i].x, pattern[i].y);
    ctx.lineTo(pattern[i + 1].x, pattern[i + 1].y);
  }
  ctx.stroke();
}

function drawCandles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  candles.forEach(c => {
    drawChartPattern(c.chartPattern); // Erst das Chart-Muster

    const isBull = c.close > c.open;
    ctx.strokeStyle = isBull ? "#00ff99" : "#ff5555";
    ctx.fillStyle = ctx.strokeStyle;

    // Docht
    ctx.beginPath();
    ctx.moveTo(c.x + candleWidth / 2, c.high);
    ctx.lineTo(c.x + candleWidth / 2, c.low);
    ctx.stroke();

    // Body
    const bodyTop = Math.min(c.open, c.close);
    const bodyHeight = Math.abs(c.open - c.close);
    ctx.fillRect(c.x, bodyTop, candleWidth, Math.max(2, bodyHeight));
  });
}

function animate() {
  candles.forEach(c => c.lifetime--);
  candles = candles.filter(c => c.lifetime > 0);

  while (candles.length < maxCandles) {
    candles.push(generateCandle());
  }

  drawCandles();
  requestAnimationFrame(animate);
}

animate();
