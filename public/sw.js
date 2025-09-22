// Basic service worker to prevent browser errors
self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  event.respondWith(fetch(event.request));
  // Let the browser handle all requests normally
  return;
});
