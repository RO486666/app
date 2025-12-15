/* ======================
   SIDEBAR v0.2 HYBRID LOGIK
   ====================== */

const drawer = document.getElementById("drawer");
const drawerTitle = document.getElementById("drawerTitle");
const drawerLinks = document.getElementById("drawerLinks");
const mainWrapper = document.getElementById("mainWrapper");

// Nur Top-Level-Panels im <main>
const panels = document.querySelectorAll("main > section.panel");

// Buttons (Icons)
const btnDash = document.getElementById("btnDash");
const btnTools = document.getElementById("btnTools");
const btnRules = document.getElementById("btnRules");
const btnSettings = document.getElementById("btnSettings");



// ===============================
// MENU DEFINITIONEN
// ===============================
const MENU = {
  dashboard: {
    title: "Dashboard",
    items: [
      { label: "Dashboard", panel: "panel-dashboard" }
    ]
  },
  tools: {
    title: "Rechner",
    items: [
      { label: "Rechner", panel: "calc-pos" },
      { label: "Steuern / Netto", panel: "calc-taxpro" },
      { label: "Pair Profil", panel: "calc-pairProfile" }
    ]
  },
  rules: {
    title: "Regeln & Wissen",
    items: [
      { label: "Regeln", panel: "panel-rules" },
      { label: "Theorie-Test", panel: "panel-quiz" },
      { label: "Confluence", panel: "panel-confluence" }
    ]
  },
  settings: {
    title: "Einstellungen",
    items: [
      { label: "Zeitmodus (DST)", panel: "panel-settings-dst" }
    ]
  }
};



/* ============================================================
   SESSION → SIDEBAR & DRAWER COLOR SYNC
   ============================================================ */

function applySidebarDrawerSessionColor(sessionName) {
    // Hol die Farbe oder nimm Standard-Blau als Fallback
    const color = sessionColors[sessionName] || "#007bff"; 

    // === 1. ZENTRALE VARIABLEN GLOBAL SETZEN ===
    // Damit weiß das gesamte CSS (Sidebar, Drawer, Texte) sofort Bescheid
    document.documentElement.style.setProperty("--session-accent", color);
    document.documentElement.style.setProperty("--session-color", color);
    document.documentElement.style.setProperty("--box-color", color); // Auch für die Boxen oben

    // Optionale Hilfsvariablen für Transparenzen
    document.documentElement.style.setProperty("--session-accent-soft", color + "33");   // 20% Deckkraft
    document.documentElement.style.setProperty("--session-accent-border", color + "55"); // 33% Deckkraft

    // === 2. SIDEBAR GLOW ERZWINGEN (Sicherheitsnetz) ===
    // Falls das CSS die Variable nicht schnell genug greift, setzen wir den Glow direkt
    const sidebar = document.getElementById("sidebarLeft");
    if (sidebar) {
        // Desktop Glow (nach rechts)
        if (window.innerWidth > 900) {
            sidebar.style.boxShadow = `2px 0 10px rgba(0,0,0,0.5), 1px 0 20px -5px ${color}`;
            sidebar.style.borderRight = `1px solid ${color}44`; // Leicht transparent
            sidebar.style.borderTop = "none";
        } 
        // Mobile Glow (nach oben)
        else {
            sidebar.style.boxShadow = `0 -4px 15px rgba(0,0,0,0.5), 0 -5px 25px -8px ${color}`;
            sidebar.style.borderTop = `1px solid ${color}44`;
            sidebar.style.borderRight = "none";
        }
    }

    // === 3. DRAWER STYLE ===
    // (Der Rest wird eigentlich über CSS var(--session-accent) geregelt, 
    // aber das hier hilft für die dynamischen Rahmen)
    const drawer = document.getElementById("drawer");
    if (drawer) {
        drawer.style.borderLeftColor = color;
        drawer.style.borderRightColor = color;
    }
}
// ===============================
// PANELS AUSBLENDEN
// ===============================
function hideAllPanels() {
  panels.forEach(p => p.classList.add("hidden"));
}


// ===============================
// DRAWER SCHLIESSEN (universell)
// ===============================
function closeDrawer() {
  drawer.classList.remove("open");

  // Desktop → Push-Mode raus
  if (window.innerWidth > 900) {
    mainWrapper.classList.remove("drawer-open");
  }

  resetActive();
}


// ===============================
// DRAWER ÖFFNEN
// ===============================
function openDrawer(cat) {
  const def = MENU[cat];
  if (!def) return;

  drawerTitle.textContent = def.title;
  drawerLinks.innerHTML = "";


  // --- Untermenü erzeugen ---
  def.items.forEach(item => {
    const div = document.createElement("div");
    div.className = "drawer-link";
    div.textContent = item.label;

    div.onclick = () => {
      hideAllPanels();
      const panel = document.getElementById(item.panel);
      if (panel) panel.classList.remove("hidden");

      closeDrawer();
    };

    drawerLinks.appendChild(div);
  });

  // Drawer öffnen
  drawer.classList.add("open");

  // Desktop → Push-Mode
  if (window.innerWidth > 900) {
    mainWrapper.classList.add("drawer-open");
  }
}


// ===============================
// ACTIVE-ZUSTAND RESET
// ===============================
function resetActive() {
  btnDash.classList.remove("active");
  btnTools.classList.remove("active");
  btnRules.classList.remove("active");
  btnSettings.classList.remove("active");
}


// ===============================
// ICON BUTTON EVENTS
// ===============================
btnDash.onclick = () => {
  resetActive();
  btnDash.classList.add("active");
  openDrawer("dashboard");
};

btnTools.onclick = () => {
  resetActive();
  btnTools.classList.add("active");
  openDrawer("tools");
};

btnRules.onclick = () => {
  resetActive();
  btnRules.classList.add("active");
  openDrawer("rules");
};

btnSettings.onclick = () => {
  resetActive();
  btnSettings.classList.add("active");
  openDrawer("settings");
};



// ===============================
// CLOSE BUTTON IM DRAWER
// ===============================
const drawerCloseBtn = document.getElementById("drawerCloseBtn");
if (drawerCloseBtn) {
  drawerCloseBtn.onclick = () => closeDrawer();
}


// ===============================
// AUTO-SCHLIESSEN BEI KLICK AUSSERHALB
// ===============================
document.addEventListener("click", e => {
  if (
    !drawer.contains(e.target) &&
    !document.getElementById("sidebarLeft").contains(e.target)
  ) {
    closeDrawer();
  }
}, true);
