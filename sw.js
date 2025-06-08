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
  'https://cdn.jsdelivr.net/gh/andris9/jStorage@0.4.12/jstorage.min.js'
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
