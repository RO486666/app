// scripts/ticker.js
(function () {
  const el = document.getElementById("tickerContent");
  const box = el?.parentElement;
  if (!el || !box) return;

  // Sessionfarben
  const SESSION_COLORS = {
    "Sydney":   "#00bcd4",
    "Tokyo":    "#9c27b0",
    "London":   "#ffd700",
    "New York": "#ff5722",
    "Crypto":   "#7e57c2"
  };

  // Tages-Fallback
  const focusPairsByDay = {
    0: ["BTC/USD","ETH/USD","SOL/USD","XRP/USD","LTC/USD","ADA/USD","BCH/USD","XAU/USD","XAG/USD","US30","NAS100","SPX500","GER40","UK100"],
    1: ["EUR/USD","GBP/USD","AUD/USD","NZD/USD","USD/CHF","USD/CAD","EUR/JPY","GBP/JPY","XAU/USD","BTC/USD"],
    2: ["USD/JPY","EUR/JPY","GBP/JPY","AUD/JPY","NZD/JPY","BTC/USD","ETH/USD"],
    3: ["US30","NAS100","SPX500","GER40","UK100","EUR/GBP","GBP/AUD"],
    4: ["GBP/USD","GBP/JPY","XAU/USD","XAG/USD","WTI/USD","BRENT/USD"],
    5: ["XAU/USD","XAG/USD","BTC/USD","ETH/USD","US30","NAS100"],
    6: ["ETH/USD","SOL/USD","XRP/USD","BTC/USD"]
  };

  // Wichtige Paare je Session
  const focusBySessionDay = {
    "London":   { "*": ["EUR/USD","GBP/USD","XAU/USD","GER40"] },
    "New York": { "*": ["XAU/USD","NAS100","SPX500","USD/JPY","EUR/USD"] },
    "Tokyo":    { "*": ["USD/JPY","GBP/JPY","AUD/JPY"] },
    "Crypto":   { "*": ["BTC/USD","ETH/USD","XRP/USD"] }
  };

  const dayNameDE = ["Sonntag","Montag","Dienstag","Mittwoch","Donnerstag","Freitag","Samstag"];

  // aktive Session aus session.js
  function getActiveSessionName() {
    if (!window.sessions) return null;
    const now = new Date();
    const m = now.getHours() * 60 + now.getMinutes();
    const active = window.sessions.filter(s => {
      const { start, end } = s;
      return start > end ? (m >= start || m < end) : (m >= start && m < end);
    });
    return (active.find(s => s.name !== "Crypto") || active[0] || {}).name || null;
  }

  // setzt CSS-Var --session-accent
  function setSessionAccent(sessionName) {
    const color = SESSION_COLORS[sessionName] || "#ffcc00";
    document.documentElement.style.setProperty("--session-accent", color);
  }

  // Symbol-Klassifizierung
  function classify(symbol) {
    if (/BTC|ETH|SOL|XRP|ADA|LTC|BCH|LINK|USDT/i.test(symbol)) return "is-crypto";
    if (/XAU|XAG|XPT|XPD|COPPER|ALUMINIUM/i.test(symbol))        return "is-metal";
    if (/US30|NAS100|SPX500|GER40|UK100|DAX/i.test(symbol))      return "is-index";
    return "";
  }

  // HTML bauen
  function buildLineHTML() {
    const now = new Date();
    const d = now.getDay();
    const dayPairs = focusPairsByDay[d] || [];

    const session = getActiveSessionName();
    setSessionAccent(session);

    const imp = session && focusBySessionDay[session]
      ? (focusBySessionDay[session][dayNameDE[d]] || focusBySessionDay[session]["*"] || [])
      : [];

    // Merge: wichtige zuerst, dann Rest – ohne Duplikate
    const seen = new Set();
    const merged = [...imp, ...dayPairs].filter(p => {
      if (seen.has(p)) return false;
      seen.add(p);
      return true;
    });

    // HTML: wichtige mit .highlight
    return merged.map((p, i) => {
      const cls = `pair ${imp.includes(p) ? "highlight" : ""} ${classify(p)}`;
      const span = `<span class="${cls}">${p}</span>`;
      return i < merged.length - 1 ? `${span}<span class="sep">•</span>` : span;
    }).join("");
  }

function adaptTickerSpeed() {
  requestAnimationFrame(() => {
    const contentWidth = el.scrollWidth;
    const boxWidth = box.offsetWidth;

    // Start: komplett rechts draußen = Boxbreite
    const start = `${boxWidth}px`;
    // End: komplett links draußen = -(Contentbreite)
    const end = `-${contentWidth}px`;

    // Dauer: abhängig von Gesamtstrecke
    const total = contentWidth + boxWidth;
    const pxPerSec = 80; // langsamer → kleiner Wert
    const duration = Math.max(20, Math.round(total / pxPerSec));

    box.style.setProperty("--marquee-duration", `${duration}s`);
    el.style.setProperty("--start", start);
    el.style.setProperty("--end", end);

    // nach kurzem Delay sichtbar machen
    setTimeout(() => { el.style.opacity = "1"; }, 100);
  });
}


  function render() {
    el.innerHTML = buildLineHTML();
    adaptTickerSpeed();
  }

  // 🚀 Start
  document.addEventListener("DOMContentLoaded", () => {
    render();
    // Refresh alle 5 Min (Session-/Tageswechsel)
    setInterval(render, 5 * 60 * 1000);
    document.addEventListener("visibilitychange", () => { if (!document.hidden) render(); });
    window.addEventListener("resize", adaptTickerSpeed);
  });
})();
