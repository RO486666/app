// =========================================================
// 🚀 SERVICE WORKER & NOTIFICATIONS (ALPHAOS EDITION)
// =========================================================

let lastNotifiedSession = null;

// 1. Service Worker registrieren + UPDATE-DETECTOR
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./sw.js") // Relativer Pfad funktioniert lokal und auf GitHub Pages
      .then(reg => {
        console.log("✅ SW registriert:", reg.scope);

        // Sucht sofort aktiv nach der neuen Version aus der Update.bat
        reg.update();

        // Prüft bei jedem Tab-Fokus, ob ein Update hochgeladen wurde
        document.addEventListener("visibilitychange", () => {
          if (document.visibilityState === "visible") {
            reg.update();
          }
        });

        // 🔔 UPDATE-TRIGGER: Wenn Update.bat einen neuen Cache-Namen erzeugt hat
        reg.addEventListener("updatefound", () => {
          const newWorker = reg.installing;
          if (!newWorker) return;

          newWorker.addEventListener("statechange", () => {
            // Neuer Service Worker ist fertig heruntergeladen und wartet
            if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
              
              // System-Push-Banner für das Update feuern
              sendNotification(
                "⚡ AlphaOS Update verfügbar!",
                "Neueste Version geladen. Die App wird jetzt aktualisiert..."
              );

              // Alten Worker sofort ablösen
              newWorker.postMessage("SKIP_WAITING");
            }
          });
        });
      })
      .catch(err => console.error("❌ SW Fehler:", err));
  });

  // Sobald der neue Service Worker die Kontrolle übernimmt -> Seite neu laden
  let refreshing = false;
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (!refreshing) {
      refreshing = true;
      window.location.reload();
    }
  });
}

// 2. Permission beim Start abfragen
document.addEventListener("DOMContentLoaded", () => {
  if ("Notification" in window && Notification.permission === "default") {
    Notification.requestPermission().then(permission => {
      if (permission === "granted") {
        console.log("🔐 Benachrichtigungen erlaubt!");
      }
    });
  }
});

// 3. Universelle Sendefunktion für Sessions & Updates
function sendNotification(title, body) {
  if (!("Notification" in window) || Notification.permission !== "granted") return;

  navigator.serviceWorker.getRegistration().then(reg => {
    if (reg) {
      reg.showNotification(title, {
        body: body,
        icon: "./icon-192.png",
        badge: "./icon-192.png",
        vibrate: [200, 100, 200],
        tag: "alphaos-alert",
        renotify: true
      });
    } else {
      new Notification(title, { body: body, icon: "./icon-192.png" });
    }
  });
}

// 4. ⏰ SESSION CHECK-LOOP
setInterval(() => {
  if (typeof getCurrentSessions !== "function" || typeof getMinutesNow !== "function") return;

  const minutes = getMinutesNow();
  const activeSessions = getCurrentSessions(minutes);

  if (activeSessions && activeSessions.length > 0) {
    const currentSessionName = activeSessions[0].name;

    if (lastNotifiedSession !== currentSessionName) {
      const isKillzone = currentSessionName.includes("Killzone");
      const title = isKillzone ? `🔥 ${currentSessionName} START!` : `🔔 ${currentSessionName} gestartet`;
      const msg = "Prüfe deine Setups und Confluences.";

      sendNotification(title, msg);
      lastNotifiedSession = currentSessionName;
    }
  } else {
    lastNotifiedSession = null;
  }
}, 60000);