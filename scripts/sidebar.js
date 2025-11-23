 
document.addEventListener("DOMContentLoaded", () => {

  /* ==============================
     🎯 Quiz initialisieren
     ============================== */
  const quizContent = document.getElementById("quizContent");
  if (quizContent && window.TradingQuiz && typeof TradingQuiz.mount === "function") {
    TradingQuiz.mount(quizContent);
  }

 /* ==============================
     🎯 Panels registrieren
     ============================== */
  const panels = [
    "panel-dashboard",
    "calc-pos",
    "calc-taxpro",
    "calc-pairProfile",
    "panel-rules",
    "panel-quiz",
	"panel-confluence",
  ]
    .map(id => document.getElementById(id))
    .filter(Boolean);

  const showPanel = (id) => {
    panels.forEach(panel => {
      panel.style.display = panel.id === id ? "block" : "none";
    });
  };

  // Default: Dashboard anzeigen
  showPanel("panel-dashboard");

  /* ==============================
     🎯 Sidebar Navigation
     ============================== */
  const navButtons = document.querySelectorAll(".sidebar-nav button");

  navButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.panel;
      if (!target) return;

      // Confluence-Overlay öffnen
      if (target === "open-confluence") {
        if (typeof openConfluence === "function") openConfluence();
        
        // Sidebar schließen (mobile)
        document.getElementById("sidebar").classList.remove("sidebar-open");
        return;
      }

      // Panels wechseln
      showPanel(target);

      // Active-State setzen
      navButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      // Sidebar nach Klick schließen (mobile)
      document.getElementById("sidebar").classList.remove("sidebar-open");
    });
  });

  /* ==============================
     🎯 Sidebar Toggle (Hamburger)
     ============================== */
  const sidebar = document.getElementById("sidebar");
  const sidebarToggle = document.getElementById("sidebarToggle");

  sidebarToggle.addEventListener("click", () => {
    sidebar.classList.toggle("sidebar-open");
  });
});