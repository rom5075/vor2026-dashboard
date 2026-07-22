// Service worker дашборда VOR 2026: офлайн-копия страницы и статики.
// Страница отдаётся network-first (онлайн всегда свежая, офлайн — из кэша),
// статика — из кэша с фоновым обновлением, поэтому менять VERSION при каждой
// публикации не нужно; поднимайте её только при изменении списка ASSETS.
const VERSION = 'v1';
const CACHE = 'vor2026-' + VERSION;
const ASSETS = [
  './',
  'manifest.webmanifest',
  'favicon.svg',
  'favicon.ico',
  'favicon-32.png',
  'favicon-16.png',
  'apple-touch-icon.png',
  'icon-192.png',
  'icon-512.png',
  'icon-maskable-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k.startsWith('vor2026-') && k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;

  // Навигация (сам дашборд): сеть в приоритете, офлайн — кэш.
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req).then(r => {
        const copy = r.clone();
        caches.open(CACHE).then(c => c.put('./', copy));
        return r;
      }).catch(() => caches.match('./'))
    );
    return;
  }

  // Статика: из кэша сразу, обновление в фоне.
  e.respondWith(
    caches.match(req).then(hit => {
      const net = fetch(req).then(r => {
        if (r && r.ok) {
          const copy = r.clone();
          caches.open(CACHE).then(c => c.put(req, copy));
        }
        return r;
      }).catch(() => hit);
      return hit || net;
    })
  );
});
