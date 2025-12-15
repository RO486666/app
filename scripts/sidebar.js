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
      { label: "Zeitmodus (DST)", panel: "panel-settings-dst" },
      { label: "🔔 Benachrichtigungen", panel: "panel-settings-notify" } // ✅ Korrekt verknüpft
    ]
  }
};

/* ============================================================
   SESSION → SIDEBAR & DRAWER COLOR SYNC
   ============================================================ */

function applySidebarDrawerSessionColor(sessionName) {
    // Hol die Farbe oder nimm Standard-Blau als Fallback
    // (sessionColors muss global verfügbar sein, z.B. aus session.js)
    const color = (typeof sessionColors !== "undefined" && sessionColors[sessionName]) ? sessionColors[sessionName] : "#007bff"; 

    // === 1. ZENTRALE VARIABLEN GLOBAL SETZEN ===
    document.documentElement.style.setProperty("--session-accent", color);
    document.documentElement.style.setProperty("--session-color", color);
    document.documentElement.style.setProperty("--box-color", color);

    // Optionale Hilfsvariablen für Transparenzen
    document.documentElement.style.setProperty("--session-accent-soft", color + "33");   
    document.documentElement.style.setProperty("--session-accent-border", color + "55"); 

    // === 2. SIDEBAR GLOW ERZWINGEN ===
    const sidebar = document.getElementById("sidebarLeft");
    if (sidebar) {
        // Desktop Glow (nach rechts)
        if (window.innerWidth > 900) {
            sidebar.style.boxShadow = `2px 0 10px rgba(0,0,0,0.5), 1px 0 20px -5px ${color}`;
            sidebar.style.borderRight = `1px solid ${color}44`; 
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
      // Hier passiert die Magie: Er sucht das Element mit der ID aus dem MENU
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
  if(btnDash) btnDash.classList.remove("active");
  if(btnTools) btnTools.classList.remove("active");
  if(btnRules) btnRules.classList.remove("active");
  if(btnSettings) btnSettings.classList.remove("active");
}

// ===============================
// ICON BUTTON EVENTS
// ===============================
if(btnDash) btnDash.onclick = () => {
  resetActive();
  btnDash.classList.add("active");
  openDrawer("dashboard");
};

if(btnTools) btnTools.onclick = () => {
  resetActive();
  btnTools.classList.add("active");
  openDrawer("tools");
};

if(btnRules) btnRules.onclick = () => {
  resetActive();
  btnRules.classList.add("active");
  openDrawer("rules");
};

if(btnSettings) btnSettings.onclick = () => {
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
  if (drawer && !drawer.contains(e.target) && !document.getElementById("sidebarLeft").contains(e.target)) {
    closeDrawer();
  }
}, true);