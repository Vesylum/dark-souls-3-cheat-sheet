const CACHE_NAME = 'ds3-checklist-v2';
const urlsToCache = [
  './',
  './index.html',
  './js/main.js',
  './js/jquery.min.js',
  './js/jquery.highlight.js',
  './css/main.css',
  './img/favicon.ico',
  './img/favicon-152.png',
  './img/pinned-tab-icon.svg',
  './js/jstorage.min.js',
  './css/vendor/bootstrap/bootstrap.min.css',
  './css/vendor/bootswatch/cosmo.min.css',
  './css/vendor/bootswatch/cyborg.min.css',
  './css/vendor/bootswatch/darkly.min.css',
  './css/vendor/bootswatch/flatly.min.css',
  './css/vendor/bootswatch/journal.min.css',
  './css/vendor/bootswatch/lumen.min.css',
  './css/vendor/bootswatch/paper.min.css',
  './css/vendor/bootswatch/readable.min.css',
  './css/vendor/bootswatch/sandstone.min.css',
  './css/vendor/bootswatch/simplex.min.css',
  './css/vendor/bootswatch/slate.min.css',
  './css/vendor/bootswatch/spacelab.min.css',
  './css/vendor/bootswatch/superhero.min.css',
  './css/vendor/bootswatch/united.min.css',
  './css/vendor/bootswatch/yeti.min.css'
];
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
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
    )
  );
});
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
