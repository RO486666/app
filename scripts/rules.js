function toggleRules() {
  const box = document.getElementById("rulesBox");
  if (!box) return;

  const isHidden = box.style.display === "none";
  box.style.display = isHidden ? "block" : "none";

  // 🔽 Smooth scroll nur beim Öffnen
  if (isHidden) {
    setTimeout(() => {
      box.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }
}
