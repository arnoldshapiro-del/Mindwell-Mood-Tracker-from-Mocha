const CACHE_NAME = 'mindwell-cache-v1';
const urlsToCache = ['/', '/index.html', '/manifest.json'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(urlsToCache)).catch(err => console.log(err))); self.skipWaiting(); });
self.addEventListener('fetch', e => { e.respondWith(fetch(e.request).then(r => { const rc = r.clone(); caches.open(CACHE_NAME).then(c => { if (e.request.method === 'GET') c.put(e.request, rc); }); return r; }).catch(() => caches.match(e.request))); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(n => Promise.all(n.filter(x => x !== CACHE_NAME).map(x => caches.delete(x))))); self.clients.claim(); });
