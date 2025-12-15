// =========================================================
// 🚀 SERVICE WORKER & NOTIFICATIONS
// =========================================================

let lastNotifiedSession = null; // Merkt sich, wofür wir schon gepiept haben

// 1. Service Worker registrieren
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/app/sw.js", { scope: "/app/" }) // Pfad muss stimmen!
      .then(reg => console.log("✅ SW registriert:", reg.scope))
      .catch(err => console.error("❌ SW Fehler:", err));
  });
}

// 2. Permission beim Start abfragen (Wichtig für Mobile!)
document.addEventListener("DOMContentLoaded", () => {
  if ("Notification" in window && Notification.permission !== "granted") {
    // Button oder automatischer Request
    Notification.requestPermission().then(permission => {
      if (permission === "granted") {
        console.log("🔐 Benachrichtigungen erlaubt!");
        // Test-Notification senden, um zu prüfen ob es geht
        new Notification("TradeMind aktiviert", { body: "Benachrichtigungen sind an." });
      }
    });
  }
});

// 3. Die eigentliche Sendefunktion (über Service Worker für Android Stabilität)
function sendNotification(title, body) {
  if (Notification.permission === "granted") {
    navigator.serviceWorker.getRegistration().then(reg => {
      if (reg) {
        reg.showNotification(title, {
          body: body,
          icon: "/app/icon-192.png", // Stelle sicher, dass das Icon existiert!
          vibrate: [200, 100, 200],  // Bzz-Bzz-Bzz
          tag: "session-alert",      // Verhindert Notification-Spam
          renotify: true             // Vibriert auch wenn alte Notification noch da ist
        });
      } else {
        // Fallback falls SW nicht bereit (z.B. Desktop)
        new Notification(title, { body: body });
      }
    });
  }
}

// 4. ⏰ DER CHECK-LOOP (Das Herzstück)
// Prüft jede Minute, ob eine Session aktiv ist und wir noch nicht gewarnt haben
setInterval(() => {
  // Wir greifen auf deine Funktionen aus session.js zu
  // Stelle sicher, dass session.js VOR pwa.js im HTML geladen wird!
  
  if (typeof getCurrentSessions !== "function") return; 

  const minutes = getMinutesNow();
  const activeSessions = getCurrentSessions(minutes);

  if (activeSessions.length > 0) {
    const currentSessionName = activeSessions[0].name;

    // Wenn wir diese Session noch nicht gemeldet haben -> FEUER!
    if (lastNotifiedSession !== currentSessionName) {
      
      // Spezialfall Killzone (klingt wichtiger)
      const isKillzone = currentSessionName.includes("Killzone");
      const title = isKillzone ? `🔥 ${currentSessionName} START!` : `🔔 ${currentSessionName} hat begonnen`;
      const msg = "Prüfe deine Levels und Setup-Regeln.";

      sendNotification(title, msg);
      
      // Merken, damit es nicht jede Minute bimmelt
      lastNotifiedSession = currentSessionName;
    }
  } else {
    // Reset wenn keine Session, damit beim nächsten Start wieder geklingelt wird
    lastNotifiedSession = null;
  }

}, 60000); // Checkt alle 60 Sekunden