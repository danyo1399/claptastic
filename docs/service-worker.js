const version = "1.0.37";
console.log("service worker init V" + version);
const appkey = "claptastic";
const immutableUrls = [/tailwind/i];

const cacheName = `${appkey}-store-${version}`;

function log(msg, args) {
    if(args) console.log("[sw] " + msg, args);
    else console.log("[sw] " + msg);
}

function isImmutableResource(url) {
  return immutableUrls.some((x) => x.test(url));
}

self.addEventListener("activate", (e) => {
  log("activating", e);

  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (cacheName !== key) {
            log("deleting cache", key);
            return caches.delete(key);
          }
        })
      );
    })
  );
});

self.addEventListener("install", (e) => {
  self.skipWaiting();
  // log("installing", filesToCache);
  // e.waitUntil(
  //   caches.open(cacheName).then((cache) => cache.addAll(filesToCache))
  // );
});

// Fetching content using Service Worker
self.addEventListener("fetch", (fetchEvent) => {
  fetchEvent.respondWith(
    (async () => {
      const cache = await caches.open(cacheName);
      let fetchResponse;
      const url = fetchEvent.request.url;
      try {


        if (isImmutableResource(url)) {
          const cachedResponse = await cache.match(fetchEvent.request);
          if (cachedResponse) {
            log("returning immutable cached resource: " + url);
            return cachedResponse;
          }
        }
          log("fetching: " + url);
        fetchResponse = await fetch(fetchEvent.request);
        if (!fetchResponse.ok) {
          throw  fetchResponse;
        }
        log(`updating cache: ${url}`);
        await cache.put(fetchEvent.request, fetchResponse.clone());
      } catch (err) {
        log(
          `Error fetching response. Last chance find a local cache version: ${url}`,err
        );
        const cachedResponse = cache.match(fetchEvent.request);
        if (cachedResponse) return cachedResponse;
      }

      return fetchResponse;
    })()
  );
});
