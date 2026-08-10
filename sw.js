const CACHE_NAME = 'future-gauge-v3';

const ASSETS = [
'./index.html',
'./manifest.webmanifest',
'./431~2.jpg'
];

self.addEventListener('install', (event) => {
event.waitUntil(
caches.open(CACHE_NAME).then((cache) => {
return cache.addAll(ASSETS);
})
);

self.skipWaiting();
});

self.addEventListener('activate', (event) => {
event.waitUntil(
caches.keys().then((keys) => {
return Promise.all(
keys.map((key) => {
if (key !== CACHE_NAME) {
return caches.delete(key);
}
})
);
}).then(() => self.clients.claim())
);
});

self.addEventListener('fetch', (event) => {
event.respondWith(
fetch(event.request)
.then((response) => {
const copy = response.clone();

    caches.open(CACHE_NAME).then((cache) => {
      cache.put(event.request, copy);
    });

    return response;
  })
  .catch(() => {
    return caches.match(event.request);
  })

);
});
