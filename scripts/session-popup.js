// ✅ Permission anfordern (nur wenn nötig)
function requestNotificationPermission() {
  if ("Notification" in window && Notification.permission !== "granted") {
    Notification.requestPermission().then(permission => {
      console.log("🔐 Notification permission:", permission);
    });
  }
}

// ✅ Hauptfunktion: Push senden via Service Worker
function sendPushNotification(title, message) {
  if ("Notification" in window && Notification.permission === "granted" && "serviceWorker" in navigator) {
    navigator.serviceWorker.ready.then((registration) => {
      registration.showNotification(title, {
        body: message,
        icon: "/app/icon-192.png",
        vibrate: [200, 100, 200],
        tag: "session-alert",
        renotify: true
      });
    }).catch(err => {
      console.error("❌ Notification via SW fehlgeschlagen:", err);
    });
  } else {
    console.warn("❌ Keine Notification möglich – Erlaubnis oder SW fehlen.");
  }
}

// ✅ Wrapper für Session-Namen
function showSessionStartNotification(sessionName, message) {
  const title = `📣 ${sessionName}-Session gestartet!`;
  sendPushNotification(title, message);
}

// ✅ Optional: Diagnose-Check
function diagnoseNotifications() {
  let msg = "🔍 Notification-Status:\n";

  if (!("Notification" in window)) {
    msg += "❌ Nicht unterstützt.\n";
  } else {
    msg += `🔸 Status: ${Notification.permission}\n`;
  }

  alert(msg);
}

// ✅ Beim Start direkt Berechtigung anfordern
window.addEventListener("load", () => {
  requestNotificationPermission();
});
