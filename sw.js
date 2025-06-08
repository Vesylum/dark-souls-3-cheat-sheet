const CACHE_NAME = 'ds3-checklist-v1';
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
  './manifest.json',
];
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
