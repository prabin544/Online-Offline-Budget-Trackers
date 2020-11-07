const filesToCache = [
    "/",
    "/index.html",
    "/manifest.json",
    "/style.css",
    "/icons/icon-152x152.png",
    "/icons/icon-192x192.png",
];

const staticCacheName = 'static-cache-v1';

self.addEventListener('install', event => {
console.log('Attempting to install service worker and cache static assets');
event.waitUntil(
    caches.open(staticCacheName)
    .then(cache => {
    return cache.addAll(filesToCache);
    })
);
});

self.addEventListener("activate", function(evt) {
    evt.waitUntil(
      caches.keys().then(keyList => {
        return Promise.all(
          keyList.map(key => {
            if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
              console.log("Removing old cache data", key);
              return caches.delete(key);
            }
          })
        );
      })
    );
    self.clients.claim();
});

//fetch
self.addEventListener('fetch', event => {
console.log('Fetch event for ', event.request.url);
event.respondWith(
    caches.match(event.request)
    .then(response => {
    if (response) {
        console.log('Found ', event.request.url, ' in cache');
        return response;
    }
    console.log('Network request for ', event.request.url);
    return fetch(event.request)

    // TODO 4 - Add fetched files to the cache

    }).catch(error => {

    // TODO 6 - Respond with custom offline page

    })
);
});