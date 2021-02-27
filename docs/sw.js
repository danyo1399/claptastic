
console.log('service worker init V1.0.11');
self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open('claptastic-store').then((cache) => cache.addAll([
            '/claptastic/index.html',
            '/claptastic/main.js',
            '/claptastic/styles.css',
'https://unpkg.com/tailwindcss@%5E2/dist/tailwind.min.css',
            '/claptastic/audio.mp3',
            '/claptastic/',
            '/claptastic/icon/hand-icon-192.png',
            '/claptastic/icon/hand-icon-512.png',
            //'/claptastic/icon/hand-icon-1024.png',
        ])),
    );
});

self.addEventListener('fetch', (e) => {

    e.respondWith(
        caches.match(e.request).then((response) => {
            if(!response) {
                console.log(e.request.url);
            }
            return response || fetch(e.request)

        }),
    );
});
