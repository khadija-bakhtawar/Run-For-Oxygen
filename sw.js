const CACHE_NAME = "stickman-runner-v1.0";
const ASSETS_TO_CACHE = [
  "./",
  "./index.html",
  "./styles.css",
  "./game.js",
  "./assets/stickman.png",
  "./assets/trash.png",
];

// Install: Cache essential files
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  // Activate new version immediately
  self.skipWaiting();
});

// Activate: Remove old cache versions
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );

  self.clients.claim();
});

// Fetch: Serve cached files first (offline support)
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedFile) => {
      return (
        cachedFile ||
        fetch(event.request).catch(() => caches.match("./index.html"))
      );
    })
  );
});
