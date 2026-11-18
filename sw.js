// Service worker for the Thumbs Up Friday app.
// Network first: you always get the latest plans when you're online, and the
// last copy it saw when you're not (so the app still opens with no signal).
// It only touches the app's own files, so /admin and the rest of the site are
// left completely alone.

const CACHE = 'tuf-app-v3';
const APP_FILES = [
  '/app.html',
  '/manifest.webmanifest',
  '/content/week.json',
  '/content/people.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/apple-touch-icon.png'
];

function isAppFile(url) {
  return APP_FILES.indexOf(url.pathname) !== -1;
}

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE).then(function (cache) {
      // add each file separately so one missing file can't break the install
      return Promise.all(APP_FILES.map(function (f) { return cache.add(f).catch(function () {}); }));
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (event) {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin || !isAppFile(url)) return;

  event.respondWith(
    fetch(req).then(function (res) {
      if (res && res.ok) {
        const copy = res.clone();
        caches.open(CACHE).then(function (cache) { cache.put(req, copy); });
      }
      return res;
    }).catch(function () {
      return caches.match(req, { ignoreSearch: true });
    })
  );
});
