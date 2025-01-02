const CACHE_NAME = 'webmap-cache-v1';
const urlsToCache = [
  '/',
  '/staticfiles',
  //'/static/js/scripts.js',
  // Add other URLs to cache
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});