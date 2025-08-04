function updateTabButtonColors(activeSessionNames) {
  const sessionColors = {
    "Sydney": "#3388ff",
    "Tokyo": "#00aaff",
    "London": "#ffd700",
    "New York": "#ff4500",
    "London Killzone": "#ccff00",
    "New York Killzone": "#ff8800",
    "Deadzone": "#333333",
    "Crypto": "#9900ff"
  };

  const btns = [
    document.getElementById("btn-calc-pos"),
    document.getElementById("btn-calc-dawn"),
    document.getElementById("btn-calc-taxpro")
  ];

  const colorQueue = activeSessionNames
    .filter(name => sessionColors[name])
    .map(name => sessionColors[name]);

  if (colorQueue.length === 0) return;

  btns.forEach((btn, i) => {
    const color = colorQueue[i % colorQueue.length];
    if (!btn) return;

    btn.style.transition = "all 0.4s ease";
    btn.style.background = color;
    btn.style.setProperty('--glow-color', color);
    btn.style.color = (["#ffd700", "#ccff00"].includes(color)) ? "#111" : "#fff";
    btn.style.animation = "glowPulse 2s ease-in-out infinite";
  });
}
