/// <reference lib="webworker" />
import assetCacheList from './asset-cache-list.json';

const swSelf = self as unknown as ServiceWorkerGlobalScope;

const CACHE_NAME = 'ordle-cache-v1';
const urlsToCache = [
  '/ordle/',
  '/ordle/index.html',
  '/ordle/manifest.json',
  '/ordle/owl_icon.png',
  ...assetCacheList,
];

swSelf.addEventListener('install', (event) => {
  (event as ExtendableEvent).waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) =>
        Promise.all(
          urlsToCache.map((url) =>
            fetch(url, {
              cache: 'no-cache',
            })
              .then((response) => {
                if (response.ok) {
                  return cache.put(url, response.clone());
                } else {
                  console.error('Failed to cache:', url, response.status);
                }
              })
              .catch((err) => {
                console.error('Failed to fetch:', url, err);
              })
          )
        )
      )
      .then(() => {
        swSelf.skipWaiting();
      })
  );
});

swSelf.addEventListener('fetch', (event) => {
  const fetchEvent = event as FetchEvent;
  const url = new URL(fetchEvent.request.url);

  // Runtime cache for /ordle/assets/ files
  if (url.pathname.startsWith('/ordle/assets/')) {
    fetchEvent.respondWith(
      caches.match(fetchEvent.request).then((response) => {
        return (
          response ||
          fetch(fetchEvent.request).then((networkResponse) => {
            if (networkResponse.ok) {
              return caches.open(CACHE_NAME).then((cache) => {
                cache.put(fetchEvent.request, networkResponse.clone());
                return networkResponse;
              });
            }
            // If fetch fails or response is not ok, just return the network response (don't cache)
            return networkResponse;
          })
        );
      })
    );
    return;
  }

  // Default cache strategy for other requests
  fetchEvent.respondWith(
    caches
      .match(fetchEvent.request)
      .then((response) => response || fetch(fetchEvent.request))
  );
});

swSelf.addEventListener('activate', (event) => {
  (event as ExtendableEvent).waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => swSelf.clients.claim())
  );
});
