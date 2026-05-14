const cacheName = 'snake-edu-v1.0.3'; // Svaki put kad mijenjaš igru, povećaj ovaj broj
const assets = [
    './',
    'index.html',
    'manifest.json'
];

// Instalacija Service Workera i spremanje datoteka u cache
self.addEventListener('install', e => {
    self.skipWaiting(); // Prisili novi SW da preuzme kontrolu odmah
    e.waitUntil(
        caches.open(cacheName).then(cache => {
            return cache.addAll(assets);
        })
    );
});

// Aktiviranje i čišćenje SVIH starih verzija cachea
self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.map(key => {
                    if (key !== cacheName) {
                        return caches.delete(key);
                    }
                })
            );
        }).then(() => self.clients.claim()) // Preuzmi kontrolu nad svim tabovima odmah
    );
});

// Dohvaćanje datoteka (Offline rad)
self.addEventListener('fetch', e => {
    e.respondWith(
        caches.match(e.request).then(res => {
            return res || fetch(e.request);
        })
    );
});