// Rex-25 Service Worker
// Strategy:
//   - app shell: cache-first
//   - APIs (/api/, localhost:9023): network-first, fallback to cache
//   - lightning invoices: network-only (never cache)
//   - icons/fonts: cache-first long TTL

const VERSION = 'rex25-v1';
const SHELL_CACHE = `${VERSION}-shell`;
const API_CACHE   = `${VERSION}-api`;

const SHELL_ASSETS = [
  '/rex25/',
  '/rex25/index.html',
  '/rex25/styles.css',
  '/rex25/app.js',
  '/rex25/install-prompt.js',
  '/rex25/manifest.json',
  '/rex25/icons/192.png',
  '/rex25/icons/512.png',
  '/rex25/icons/maskable-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE)
      .then((c) => c.addAll(SHELL_ASSETS).catch(() => null))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((k) => !k.startsWith(VERSION)).map((k) => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  if (req.method !== 'GET') return;

  if (url.pathname.includes('/lightning/') || url.pathname.includes('/invoice')) {
    event.respondWith(fetch(req));
    return;
  }

  const isApi = url.pathname.startsWith('/api/')
             || url.hostname === 'localhost'
             || url.port === '9023';
  if (isApi) {
    event.respondWith(networkFirst(req));
    return;
  }

  event.respondWith(cacheFirst(req));
});

async function cacheFirst(req) {
  const cached = await caches.match(req);
  if (cached) return cached;
  try {
    const res = await fetch(req);
    if (res && res.ok && new URL(req.url).origin === self.location.origin) {
      const cache = await caches.open(SHELL_CACHE);
      cache.put(req, res.clone());
    }
    return res;
  } catch (e) {
    return caches.match('/rex25/index.html');
  }
}

async function networkFirst(req) {
  try {
    const res = await fetch(req);
    if (res && res.ok) {
      const cache = await caches.open(API_CACHE);
      cache.put(req, res.clone());
    }
    return res;
  } catch (e) {
    const cached = await caches.match(req);
    if (cached) return cached;
    return new Response(JSON.stringify({error: 'offline', cached: false}), {
      status: 503,
      headers: {'Content-Type': 'application/json'}
    });
  }
}
