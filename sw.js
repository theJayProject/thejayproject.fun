
const CACHE_VERSION = 'project-log-v2';

const SHELL = [
  '/',
  '/index.html',
  '/project.html',
  '/css/site.css',
  '/js/site.js',
  '/manifest.webmanifest'
];


// INSTALL: Download the latest website files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then(cache => cache.addAll(SHELL))
      .then(() => self.skipWaiting())
  );
});


// ACTIVATE: Remove old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys =>
        Promise.all(
          keys
            .filter(key => key !== CACHE_VERSION)
            .map(key => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});


// FETCH: Always check online first
self.addEventListener('fetch', event => {

  const request = event.request;

  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Only handle this website
  if (url.origin !== self.location.origin) return;

  // Never cache admin pages or API requests
  if (
    url.pathname.startsWith('/admin') ||
    url.pathname.startsWith('/api/')
  ) {
    return;
  }

  // Network-first strategy
  event.respondWith(
    fetch(request)
      .then(response => {

        if (response.ok) {

          const copy = response.clone();

          caches.open(CACHE_VERSION)
            .then(cache => cache.put(request, copy));

        }

        return response;

      })
      .catch(async () => {

        // If offline, use the cached version
        const cached = await caches.match(request);

        if (cached) return cached;

        // Offline fallback for homepage
        if (request.mode === 'navigate') {
          const homepage = await caches.match('/index.html');

          if (homepage) return homepage;
        }

        return new Response('You are offline and this page is not cached.', {
          status: 503,
          headers: {
            'Content-Type': 'text/plain'
          }
        });

      })
  );

});
