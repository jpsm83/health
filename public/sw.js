// Placeholder service worker to avoid routing to the app and breaking locale resolution.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', () => self.clients.claim());

