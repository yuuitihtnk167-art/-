const CACHE_NAME = 'cub-fuel-cache-v1'; // キャッシュの名前を指定します
const urlsToCache = [
  '/',
  '/cub.html',
  '/manifest.webmanifest',
  '/path/to/icon.png',  // アイコンのパス（適切に設定してください）
  '/style.css',         // スタイルシート（適切に設定してください）
  '/script.js'          // 必要なJSファイル
];

// インストール時にリソースをキャッシュ
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// フェッチイベント：キャッシュを返す
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // キャッシュが存在する場合はキャッシュを返し、なければネットワークから取得
      return cachedResponse || fetch(event.request);
    })
  );
});

// アクティベート時に古いキャッシュを削除
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // 使用していないキャッシュを削除
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
