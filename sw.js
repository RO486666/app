const CACHE_NAME = "trade-app-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  // Hier weitere Assets eintragen, z.B. CSS, JS, Bilder
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('my-cache-name').then(cache => {
      return cache.addAll([
        '/',
        '/index.html',
        '/styles.css',
        '/script.js',
        '/icons/icon-192.png',  // <- häufige Fehlerquelle
        // weitere Ressourcen...
      ]);
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
