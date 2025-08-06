// ✅ Service Worker Registrierung
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/app/sw.js", { scope: "/app/" })
      .then(reg => console.log("✅ SW registriert:", reg.scope))
      .catch(err => console.error("❌ SW Registrierung fehlgeschlagen:", err));
  });
}

// ✅ Direkt Notification-Permission abfragen
if ("Notification" in window && Notification.permission !== "granted") {
  Notification.requestPermission().then(result => {
    console.log("🔐 Notification permission:", result);
  });
}
// ✅ Funktion, um Notification über Service Worker zu zeigen
function showSessionStartNotification(sessionName, message) {
  if (Notification.permission !== "granted") return;

  navigator.serviceWorker.getRegistration().then(reg => {
    if (reg) {
      reg.showNotification(`📣 ${sessionName} Session`, {
        body: message,
        icon: "/app/icon-192.png",  // ggf. anpassen
        badge: "/app/icon-192.png",
        vibrate: [100, 50, 100],
        data: { dateOfArrival: Date.now() },
        tag: `session-${sessionName.toLowerCase()}`,
        requireInteraction: false
      });
    } else {
      console.warn("⚠️ Kein aktiver Service Worker gefunden.");
    }
  });
}

