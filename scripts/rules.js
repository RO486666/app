function toggleRules() {
  const box = document.getElementById("rulesBox");
  if (!box) return;

  const isHidden = box.style.display === "none";
  box.style.display = isHidden ? "block" : "none";

  if (isHidden) {
    setTimeout(() => {
      const swing = document.getElementById("swingRules");
      const day = document.getElementById("dayRules");
      let target = box;

      if (swing && swing.style.display !== "none") {
        target = document.getElementById("rulePageSwing1")?.style.display !== "none"
          ? document.getElementById("rulePageSwing1")
          : document.getElementById("rulePageSwing2");
      } else if (day && day.style.display !== "none") {
        target = document.getElementById("rulePageDay1")?.style.display !== "none"
          ? document.getElementById("rulePageDay1")
          : document.getElementById("rulePageDay2");
      }

      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }
}

function showPage(page) {
  const swingVisible = document.getElementById("swingRules")?.style.display !== "none";
  const dayVisible = document.getElementById("dayRules")?.style.display !== "none";

  const btnPrev = document.getElementById("prevPageBtn");
  const btnNext = document.getElementById("nextPageBtn");

  // Swing-Modus
  const pageSwing1 = document.getElementById("rulePageSwing1");
  const pageSwing2 = document.getElementById("rulePageSwing2");

  if (swingVisible && pageSwing1 && pageSwing2) {
    if (page === 1) {
      pageSwing1.style.display = "block";
      pageSwing2.style.display = "none";
      btnPrev.style.display = "none";
      btnNext.style.display = "inline-block";
      setTimeout(() => pageSwing1.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    } else {
      pageSwing1.style.display = "none";
      pageSwing2.style.display = "block";
      btnPrev.style.display = "inline-block";
      btnNext.style.display = "none";
      setTimeout(() => pageSwing2.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    }
  }

  // Day-Modus
  const pageDay1 = document.getElementById("rulePageDay1");
  const pageDay2 = document.getElementById("rulePageDay2");

  if (dayVisible && pageDay1 && pageDay2) {
    if (page === 1) {
      pageDay1.style.display = "block";
      pageDay2.style.display = "none";
      btnPrev.style.display = "none";
      btnNext.style.display = "inline-block";
      setTimeout(() => pageDay1.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    } else {
      pageDay1.style.display = "none";
      pageDay2.style.display = "block";
      btnPrev.style.display = "inline-block";
      btnNext.style.display = "none";
      setTimeout(() => pageDay2.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    }
  }
}

function switchMode() {
  const swing = document.getElementById("swingRules");
  const day = document.getElementById("dayRules");
  const btn = document.getElementById("switchModeBtn");

  const isSwingVisible = swing.style.display !== "none";

  if (isSwingVisible) {
    swing.style.display = "none";
    day.style.display = "block";
    btn.textContent = "🔄 Zu Swing-Regeln wechseln";
  } else {
    swing.style.display = "block";
    day.style.display = "none";
    btn.textContent = "🔄 Zu Day-Trading Regeln wechseln";
  }

  // bei jedem Wechsel auf Seite 1 zurücksetzen
  showPage(1);
}
