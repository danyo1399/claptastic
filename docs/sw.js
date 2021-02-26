console.log('service worker init');
self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open('claptastic-store').then((cache) => cache.addAll([
            '/index.html',
            '/main.js',
            '/styles.css',
'https://unpkg.com/tailwindcss@%5E2/dist/tailwind.min.css',
            'audio.mp3',
            'favicon.ico',
            '/'
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
