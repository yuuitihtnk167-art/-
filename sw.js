self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('v1').then((cache) => {
      return cache.addAll([
        '/cub.html',
        '/index.html',
        '/manifest.webmanifest',
        '/path/to/your/icon.png',
        '/path/to/your/other/assets.js',
        '/path/to/your/other/styles.css',
      ]);
    })
  );
});

self.addEventListener('activate', (event) => {
  // サービスワーカーの古いキャッシュを削除
  const cacheWhitelist = ['v1'];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request);
    })
  );
});
