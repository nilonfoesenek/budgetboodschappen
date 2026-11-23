// App-schil offline beschikbaar; prijzen en aanbiedingen altijd eerst vers van het netwerk.
const C = 'bb-v1';
const SHELL = ['./', 'index.html', 'match.js', 'manifest.webmanifest', 'icons/logo.svg', 'icons/apple-touch-icon.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(C).then(c => c.addAll(SHELL))); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== C).map(k => caches.delete(k))))); self.clients.claim(); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;
  // netwerk eerst, cache als terugval (ook voor de app zelf, zodat updates direct zichtbaar zijn)
  e.respondWith(fetch(e.request).then(r => { const k = r.clone(); caches.open(C).then(c => c.put(e.request, k)); return r; }).catch(() => caches.match(e.request)));
});
