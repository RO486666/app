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
