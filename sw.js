const CACHE_NAME = "alphaos-v20260916-221128";

// Basis-Dateien cachen (ohne Datenfeeds)
const urlsToCache = [
  "./",
  "./index.html"
];

// 1. Installieren
self.addEventListener('install', event => {
  self.skipWaiting(); // Neue Version sofort erzwingen
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache).catch(err => console.log("Caching Warnung:", err));
    })
  );
});

// 2. Fetch-Handler mit Network-First Bypass für Trading-Feeds
self.addEventListener("fetch", (event) => {
  const reqUrl = event.request.url;

  // WICHTIG: MT5-Datenfeed NIEMALS aus dem alten Cache laden!
  if (reqUrl.includes("journal_data.js") || reqUrl.includes("journal_import.json")) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Standard-Cache für statische App-Dateien
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

// 3. Aufräumen (Alte Versionen sofort löschen)
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
    ).then(() => self.clients.claim())
  );
});

// 🔔 PUSH NOTIFICATION & MESSAGES
self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then(clientList => {
      for (const client of clientList) {
        if (client.url.includes("app") && "focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow("./");
      }
    })
  );
});

self.addEventListener("message", (event) => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting();
    return;
  }
  const { title, options } = event.data || {};
  if (title) {
    self.registration.showNotification(title, options);
  }
});
