// 🔝 Direkt am Anfang:
const sessionColors = {
  "Sydney": "#00bcd4",
  "Tokyo": "#9c27b0",
  "London": "#2196f3",
  "New York": "#f44336",
  "Crypto": "#9900ff" // 💜 Crypto-Farbe
};

// 🔧 Hilfsfunktion
function hexToRgba(hex, alpha = 1) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// 🎨 Hauptfunktion
function applySessionBackground(name, isCryptoWeekend = false) {
  let baseColor = "#111";
  let overlayColor = "rgba(0, 0, 0, 0.0)"; // fallback

  if (isCryptoWeekend) {
    baseColor = "#111";
    overlayColor = "rgba(137, 0, 255, 0.06)"; // weich-violett-blau
  } else if (sessionColors[name]) {
    baseColor = "#111";
    overlayColor = hexToRgba(sessionColors[name], 0.06);
  }

  document.body.style.setProperty('--session-bg-color', baseColor);
  document.body.style.setProperty('--session-overlay', overlayColor);

  document.body.style.backgroundImage = `
    radial-gradient(circle, var(--session-overlay, transparent) 0%, transparent 80%),
    linear-gradient(0deg, rgba(255,255,255,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
  `;
  document.body.style.backgroundSize = "300px 300px, 40px 40px, 40px 40px";
  document.body.style.animation = "bgScroll 40s linear infinite";
}

function hexToRgba(hex, alpha = 1) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}


// 🚀 Automatisch beim Laden
document.addEventListener("DOMContentLoaded", () => {
  const now = new Date();
  const minutes = now.getHours() * 60 + now.getMinutes();
  const weekday = now.getDay();

  const isCryptoWeekend =
    (weekday === 6) || // Samstag
    (weekday === 0) || // Sonntag
    (weekday === 5 && minutes >= 1380); // Freitag ab 23:00

  let activeSession = "New York"; // Später dynamisch ersetzen

  applySessionBackground(activeSession, isCryptoWeekend);
});
