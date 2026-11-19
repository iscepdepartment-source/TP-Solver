'use strict';

// Bump this version whenever you deploy changes so installed apps pick up the new files.
const CACHE = 'tp-solver-v6';

const APP_SHELL = [
  './',
  'index.html',
  'style.css',
  'lcm.js',
  'app.js',
  'practice.js',
  'practice-extra.js',
  'install.js',
  'buddy-theme.js',
  'manifest.webmanifest',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/icon-maskable-512.png',
  'icons/apple-touch-icon.png'
];

// Third-party files the app needs that are safe to cache for offline use.
const CACHEABLE_CDNS = ['cdn.jsdelivr.net', 'cdnjs.cloudflare.com'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE)
      // Fetch straight from the network (skip the browser's HTTP cache) so a new version never stores old files.
      .then((cache) => cache.addAll(APP_SHELL.map((path) => new Request(path, { cache: 'reload' }))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  const sameOrigin = url.origin === self.location.origin;
  // Anything else (for example the Noupe chat assistant) goes straight to the network.
  if (!sameOrigin && !CACHEABLE_CDNS.includes(url.hostname)) return;

  if (sameOrigin) {
    // The app's own files: always try the network first (revalidating, so a new deploy shows
    // immediately and pages never mix old and new files). Use the saved copy only when offline.
    const key = request.mode === 'navigate' ? 'index.html' : request;
    event.respondWith(
      fetch(request, { cache: 'no-cache' })
        .then((response) => {
          if (response && response.ok) {
            const copy = response.clone();
            caches.open(CACHE).then((cache) => cache.put(key, copy));
          }
          return response;
        })
        .catch(() => caches.match(key).then((cached) => cached || caches.match('index.html')))
    );
    return;
  }

  // Third-party libraries (Bootstrap, html2pdf): they rarely change, so serve the saved copy first.
  event.respondWith(
    caches.match(request).then((cached) => {
      const refresh = fetch(request)
        .then((response) => {
          if (response && (response.ok || response.type === 'opaque')) {
            const copy = response.clone();
            caches.open(CACHE).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => cached);
      return cached || refresh;
    })
  );
});
