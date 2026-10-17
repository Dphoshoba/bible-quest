/* Bible Quest service worker: offline use for the app itself.
 * - App shell and stories/quizzes live in the JS bundle, so once visited they work offline.
 * - Only same-origin GET requests are handled. Stripe, the API on Render and Firebase are never touched.
 * - Narration audio is not cached (browsers request audio in byte ranges); it needs a connection.
 * Bump VERSION to force every device to drop old caches.
 */
const VERSION = 'v1';
const STATIC_CACHE = `bq-static-${VERSION}`; // hashed build files: safe to keep forever
const PAGES_CACHE = `bq-pages-${VERSION}`;   // the HTML shell
const MEDIA_CACHE = `bq-media-${VERSION}`;   // avatars, story pictures, sounds, icons
const KEEP = [STATIC_CACHE, PAGES_CACHE, MEDIA_CACHE];

// Download every JS/CSS file of this build (listed in CRA's asset-manifest.json) so all pages
// work offline after the first visit. Best effort: a failure here must not block the install.
function precacheBuildFiles() {
  return fetch('/asset-manifest.json', { cache: 'no-store' })
    .then((res) => res.json())
    .then((manifest) => {
      const files = Object.values(manifest.files || {}).filter(
        (f) => typeof f === 'string' && f.startsWith('/static/') && !f.endsWith('.map')
      );
      return caches.open(STATIC_CACHE).then((cache) => cache.addAll(files));
    })
    .catch(() => {});
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(PAGES_CACHE)
      .then((cache) => cache.addAll(['/', '/manifest.json', '/icon-192.png']))
      .then(precacheBuildFiles)
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((names) => Promise.all(names.filter((n) => !KEEP.includes(n)).map((n) => caches.delete(n))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (req.headers.has('range')) return; // audio/video range requests go straight to the network
  if (url.pathname.startsWith('/audio/')) return;
  if (url.pathname === '/sw.js') return;

  // Page loads: network first so deploys show up straight away, cached shell when offline.
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(PAGES_CACHE).then((c) => c.put('/', copy));
          return res;
        })
        .catch(() => caches.match('/').then((r) => r || Response.error()))
    );
    return;
  }

  // Hashed build files never change under the same name: cache first.
  if (url.pathname.startsWith('/static/')) {
    event.respondWith(
      caches.match(req).then(
        (hit) =>
          hit ||
          fetch(req).then((res) => {
            if (res.ok) {
              const copy = res.clone();
              caches.open(STATIC_CACHE).then((c) => c.put(req, copy));
            }
            return res;
          })
      )
    );
    return;
  }

  // Pictures, sounds and icons: show the cached copy fast, refresh it in the background.
  if (/\.(png|jpe?g|webp|svg|ico|mp3|json)$/i.test(url.pathname)) {
    event.respondWith(
      caches.open(MEDIA_CACHE).then((cache) =>
        cache.match(req).then((hit) => {
          const refresh = fetch(req)
            .then((res) => {
              if (res.ok) cache.put(req, res.clone());
              return res;
            })
            .catch(() => hit);
          return hit || refresh;
        })
      )
    );
  }
});
