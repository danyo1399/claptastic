console.log("service worker init V1.0.23");
const cacheName = 'claptastic-store';
const filesToCache = [
  "/claptastic/index.html",
  "/claptastic/main.js",
  "/claptastic/styles.css",
  "/claptastic/tailwind.min.css",
  "/claptastic/audio.mp3",
  "/claptastic/",
  "/claptastic/icon/hand-icon-192.png",
  "/claptastic/icon/hand-icon-512.png",
  "localforage.min.js",
];


self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(cacheName).then((cache) => cache.addAll(filesToCache))
  );
});

// Fetching content using Service Worker
self.addEventListener('fetch', (e) => {
    e.respondWith((async () => {
        const r = await caches.match(e.request);
        console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
        if (r) return r;
        const response = await fetch(e.request);
        // Dont allow dynamic addition of files to cache
        // const cache = await caches.open(cacheName);
        // console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
        // cache.put(e.request, response.clone());
        return response;
    })());
});
