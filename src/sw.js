// DONT USE THIS. TRYING TO FIX FILE RENAME IN V1.0.12
// Any old installations would be orphaned if they were initialised with V1.0.12 or prior.

const version = process.env.version;

const appkey = "claptastic";
const immutableUrls = [/tailwind/i];

const cacheName = `${appkey}-store-${version}`;

import logger from "./utils/logger";
const { error, debug, log, warn } = logger("sw");

log("loading service worker");

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
  log("installing");
  self.skipWaiting();
  // log("installing", filesToCache);
  // e.waitUntil(
  //   caches.open(cacheName).then((cache) => cache.addAll(filesToCache))
  // );
});

// Fetching content using Service Worker
self.addEventListener("fetch", (fetchEvent) => {
  const url = fetchEvent.request.url;
  if (url.toLowerCase().includes("/claptastic/") === false) {
    log("Bypassing fetch as url is not local");
    return false;
  }
  fetchEvent.respondWith(
    (async () => {
      const cache = await caches.open(cacheName);
      let fetchResponse;

      try {
        if (isImmutableResource(url)) {
          const cachedResponse = await cache.match(fetchEvent.request);
          if (cachedResponse) {
            log("returning immutable cached resource: " + url);
            return cachedResponse;
          }
        }
        debug("fetching: " + url);
        fetchResponse = await fetch(fetchEvent.request);
        if (!fetchResponse.ok) {
          throw fetchResponse;
        }
        debug(`updating cache: ${url}`);
        await cache.put(fetchEvent.request, fetchResponse.clone());
      } catch (err) {
        warn(
          `Error fetching response. Last chance find a local cache version: ${url}`,
          err
        );
        const cachedResponse = cache.match(fetchEvent.request);
        if (cachedResponse) return cachedResponse;
      }

      return fetchResponse;
    })()
  );
});
