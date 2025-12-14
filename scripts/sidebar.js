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
    const color = sessionColors[sessionName] || "#888"; // Fallback

    // === CSS Variablen global setzen ===
    document.documentElement.style.setProperty("--session-accent", color);
    document.documentElement.style.setProperty("--session-accent-soft", color + "33");
    document.documentElement.style.setProperty("--session-accent-border", color + "55");

    // === Drawer dynamisch einfärben ===
    drawer.style.borderLeft = `1px solid ${color}`;
    drawerTitle.style.color = color;
    if (drawerCloseBtn) {
        drawerCloseBtn.style.borderColor = color + "66";
        drawerCloseBtn.style.color = color;
    }

    // === Drawer-Links einfärben (wenn geöffnet) ===
    const links = drawer.querySelectorAll(".drawer-link");
    links.forEach(l => {
        l.style.borderColor = color + "33";
        l.style.color = color;
        l.onmouseenter = () => {
            l.style.borderColor = color;
            l.style.color = color;
            l.style.background = color + "11";
        };
        l.onmouseleave = () => {
            l.style.borderColor = color + "33";
            l.style.color = color;
            l.style.background = "transparent";
        };
    });

    // === Sidebar-Buttons einfärben ===
    const sidebarButtons = document.querySelectorAll("#sidebarLeft button");
    sidebarButtons.forEach(btn => {
        btn.style.setProperty("--btn-accent", color);

        btn.onmouseenter = () => {
            btn.style.borderColor = color;
            btn.style.color = color;
        };

        btn.onmouseleave = () => {
            btn.style.borderColor = "";
            btn.style.color = "";
        };
    });
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
