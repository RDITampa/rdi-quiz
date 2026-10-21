// Offline cache. Bump VERSION whenever files change (e.g. new episode) so phones get the update.
const VERSION = "rdi-v2";
const FILES = ["./", "index.html", "app.css", "app.js", "episodes.js", "storage.js", "config.js",
  "manifest.webmanifest", "icon-192.png", "icon-512.png", "icon-512-maskable.png", "apple-touch-icon.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener("activate", e => e.waitUntil(caches.keys().then(ks =>
  Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim())));
// Network-first for app files (fresh episodes), cache fallback offline. Never cache the database API.
self.addEventListener("fetch", e => {
  const u = new URL(e.request.url);
  if (e.request.method !== "GET" || u.origin !== location.origin) return;
  e.respondWith(fetch(e.request).then(r => { const c = r.clone(); caches.open(VERSION).then(x => x.put(e.request, c)); return r; })
    .catch(() => caches.match(e.request).then(r => r || caches.match("index.html"))));
});
