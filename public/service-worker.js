console.log("Hi from your service-worker.js file!");

// Service Worker install
self.addEventListener('install', (event) => {
    console.log('service worker install ...');
});

// Service Worker activate
self.addEventListener('activate', (event) => {
  console.info('activate', event);
});

self.addEventListener('fetch', (event) => {
    console.log('service worker fetch ... ' + event.request);
});



const version = 'v1';

// インストール時にキャッシュする
self.addEventListener('install', (event) => {
  console.log('service worker install ...');

  // キャッシュ完了までインストールが終わらないように待つ
  event.waitUntil(
    caches.open('v1').then((cache) => {
      return cache.addAll([
        '/',
        '/manifest.json',
        '/index.html',
        '/index.js',
        '/styles.css',
        '/icon_192x192.png',
        '/icon_512x512.png',
      ]);
    })
  );
});


self.addEventListener('activate', (event) => {
  console.info('activate', event);
});

self.addEventListener('fetch', function(event) {
  console.log('fetch', event.request.url);

  event.respondWith(
    // リクエストに一致するデータがキャッシュにあるかどうか
    caches.match(event.request).then(function(cacheResponse) {
      // キャッシュがあればそれを返す、なければリクエストを投げる
      return cacheResponse || fetch(event.request).then(function(response) {
        return caches.open('v1').then(function(cache) {
          // レスポンスをクローンしてキャッシュに入れる
          cache.put(event.request, response.clone());
          // オリジナルのレスポンスはそのまま返す
          return response;
        });  
      });
    })
  );
});