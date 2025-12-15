const CACHE_NAME = "alphaos-mobile-final-v1";

// ✅ KORRIGIERT: Nur die Basis-Dateien cachen. 
// Keine CSS/JS Dateien hier angeben, wenn man sich beim Pfad unsicher ist!
const urlsToCache = [
  "./",
  "./index.html"
];

// 1. Installieren (Mit Sicherheitsnetz)
self.addEventListener('install', event => {
  self.skipWaiting(); // Zwingt das Handy, den neuen SW sofort zu nehmen
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      // .catch verhindert, dass der Service Worker abstürzt, wenn eine Datei fehlt!
      return cache.addAll(urlsToCache).catch(err => console.log("Caching Warnung (nicht schlimm):", err));
    })
  );
});

// 2. Fetch (Offline Modus)
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

// 3. Aufräumen (Alte Versionen löschen)
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((keyList) =>
      Promise.all(
        keyList.map((key) => {
          if (!cacheWhitelist.includes(key)) {
            return caches.delete(key);
          }
        })
      )
    ).then(() => self.clients.claim()) // Sofort die Kontrolle übernehmen
  );
});

// ==========================================
// 🔔 PUSH NOTIFICATION LOGIK (Robust)
// ==========================================

self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then(clientList => {
      // 1. Prüfen ob App schon offen ist
      for (const client of clientList) {
        // Wir suchen nach "app", das ist sicherer als "/"
        if (client.url.includes("app") && "focus" in client) {
          return client.focus();
        }
      }
      // 2. Wenn nicht, neu öffnen
      if (clients.openWindow) {
        return clients.openWindow("/app/");
      }
    })
  );
});

// Empfängt Befehle direkt vom Dashboard (z.B. für Tests)
self.addEventListener("message", (event) => {
  const { title, options } = event.data || {};
  if (title) {
    self.registration.showNotification(title, options);
  }
});