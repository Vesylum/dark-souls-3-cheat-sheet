const CACHE_NAME = 'ds3-checklist-v1.0.0-1749487360887';
const urlsToCache = [
  './',
  '/',
  './index.html',
  './js/main.js',
  './js/jquery.min.js',
  './js/jquery.highlight.js',
  './css/main.css',
  './manifest.json',
  './img/favicon.ico',
  './img/favicon-152.png',
  './img/pinned-tab-icon.svg',
  './js/jstorage.min.js',
  './vendor/bootstrap/bootstrap.min.css',
  './vendor/bootstrap/cosmo.min.css',
  './vendor/bootstrap/cyborg.min.css',
  './vendor/bootstrap/darkly.min.css',
  './vendor/bootstrap/flatly.min.css',
  './vendor/bootstrap/journal.min.css',
  './vendor/bootstrap/lumen.min.css',
  './vendor/bootstrap/paper.min.css',
  './vendor/bootstrap/readable.min.css',
  './vendor/bootstrap/sandstone.min.css',
  './vendor/bootstrap/simplex.min.css',
  './vendor/bootstrap/slate.min.css',
  './vendor/bootstrap/spacelab.min.css',
  './vendor/bootstrap/superhero.min.css',
  './vendor/bootstrap/united.min.css',
  './vendor/bootstrap/yeti.min.css',
  './vendor/bootstrap/bootstrap.min.js',
  './vendor/jets.min.js'
];
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return Promise.all(
        urlsToCache.map(url =>
          cache.add(url).catch(err => {
            console.warn('Cache add failed for', url, err);
          })
        )
      );
    })
  );
});
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      )
    ).then(() => self.clients.claim())
  );
});
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cacheRes =>
      cacheRes ||
        fetch(event.request).catch(() => caches.match('./index.html'))
    )
  );
});
