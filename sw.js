const CACHE_NAME = "trade-app-cache-v1";
const urlsToCache = [
  "/app/",
  "/app/index.html",
  "/app/styles.css",
  "/app/script.js",
  "/app/icon-192.png",
  "/app/icon-512.png"
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

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
    )
  );
});

// ✅ NEU: Push Notification direkt im Service Worker (für `registration.showNotification`)
self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: "window" }).then(clientList => {
      for (const client of clientList) {
        if (client.url === "/" && "focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow("/app/");
      }
    })
  );
});

// ✅ NEU: Direkt auf Message-Basis Notification erlauben
self.addEventListener("message", (event) => {
  const { title, options } = event.data || {};
  if (title) {
    self.registration.showNotification(title, options);
  }
});