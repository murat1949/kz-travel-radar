const CACHE_NAME = 'kz-travel-radar-v8';
const APP_SHELL = [
  './',
  './index.html',
  './landing.html',
  './manifest.webmanifest',
  './pwa-install.js',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './photos/charyn-1.jpg',
  './photos/charyn-2.jpg',
  './photos/charyn-3.jpg',
  './photos/0373408_charyn-canyon-in-south-east-kazakhstan-taken-in-august-2018taken-in-hdr-taken-in-hdr_800.jpeg',
  './photos/%D1%871.png',
  './photos/Kolsai-Lakes-1.jpg',
  './photos/thumb-charyn.jpg',
  './photos/thumb-kolsai.jpg',
  './photos/cover-bg-ru.jpg',
  './photos/cover-bg-en.jpg',
  './photos/city-almaty.jpg',
  './photos/city-astana.jpg',
  './photos/city-turkistan.jpg',
  './photos/city-shymkent.jpg',
  './photos/guide-header.jpg',
  './images/hero-phone-ru.jpg',
  'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      Promise.allSettled(APP_SHELL.map((url) => cache.add(url)))
    )
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return response;
      })
      .catch(() =>
        caches.match(event.request).then((cached) => cached || caches.match('./index.html'))
      )
  );
});
