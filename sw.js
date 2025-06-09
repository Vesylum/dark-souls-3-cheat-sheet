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
  './vendor/bootstrap.min.css',
  './vendor/bootstrap.min.js',
  './vendor/jets.min.js',
  'https://maxcdn.bootstrapcdn.com/bootswatch/3.4.1/cosmo/bootstrap.min.css',
  'https://maxcdn.bootstrapcdn.com/bootswatch/3.4.1/cyborg/bootstrap.min.css',
  'https://maxcdn.bootstrapcdn.com/bootswatch/3.4.1/darkly/bootstrap.min.css',
  'https://maxcdn.bootstrapcdn.com/bootswatch/3.4.1/flatly/bootstrap.min.css',
  'https://maxcdn.bootstrapcdn.com/bootswatch/3.4.1/journal/bootstrap.min.css',
  'https://maxcdn.bootstrapcdn.com/bootswatch/3.4.1/lumen/bootstrap.min.css',
  'https://maxcdn.bootstrapcdn.com/bootswatch/3.4.1/paper/bootstrap.min.css',
  'https://maxcdn.bootstrapcdn.com/bootswatch/3.4.1/readable/bootstrap.min.css',
  'https://maxcdn.bootstrapcdn.com/bootswatch/3.4.1/sandstone/bootstrap.min.css',
  'https://maxcdn.bootstrapcdn.com/bootswatch/3.4.1/simplex/bootstrap.min.css',
  'https://maxcdn.bootstrapcdn.com/bootswatch/3.4.1/slate/bootstrap.min.css',
  'https://maxcdn.bootstrapcdn.com/bootswatch/3.4.1/spacelab/bootstrap.min.css',
  'https://maxcdn.bootstrapcdn.com/bootswatch/3.4.1/superhero/bootstrap.min.css',
  'https://maxcdn.bootstrapcdn.com/bootswatch/3.4.1/united/bootstrap.min.css',
  'https://maxcdn.bootstrapcdn.com/bootswatch/3.4.1/yeti/bootstrap.min.css'
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
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
