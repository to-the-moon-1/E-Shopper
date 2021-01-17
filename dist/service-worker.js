(() => {
    const staticCacheName = `static-cache-v${new Date().getTime()}`;
    const filesToCache = [
        '/index.html',
    ];

    // Cache on install
    self.addEventListener('install', event => {
        this.skipWaiting();

        event.waitUntil(caches.open(staticCacheName).then(cache => cache.addAll(filesToCache)));
    });

    // Clear cache on activate
    self.addEventListener('activate', event => {
        event.waitUntil(
            caches.keys().then(cacheNames =>
                Promise.all(
                    cacheNames
                        .filter(cacheName => cacheName.startsWith('static-cache-'))
                        .filter(cacheName => cacheName !== staticCacheName)
                        .map(cacheName => caches.delete(cacheName)),
                ),
            ),
        );

        this.clients.claim();
    });

    // Serve from Cache
    self.addEventListener('fetch', event => {
        event.respondWith(
            caches
                .match(event.request)
                .then(response => response || fetch(event.request))
                .catch(() => caches.match('offline')),
        );
    });
})();