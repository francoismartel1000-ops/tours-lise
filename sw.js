const CACHE_NAME = 'tours-lise-v4.2';
const ASSETS = ['./index.html','./style.css','./app.js','./data.js','./manifest.json'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(c => c.addAll(ASSETS))
  );
  // Forcer l'activation immédiate sans attendre la fermeture de l'app
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  // Prendre le contrôle de toutes les pages immédiatement
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    // Réseau d'abord, cache en fallback — garantit la version la plus récente
    fetch(e.request)
      .then(response => {
        // Mettre à jour le cache avec la nouvelle version
        const clone = response.clone();
        caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
        return response;
      })
      .catch(() => caches.match(e.request))
  );
});
