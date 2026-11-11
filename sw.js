const VERSION = 'np-leads-v1';
const CDN = /(cdn\.jsdelivr\.net|unpkg\.com|tessdata\.projectnaptha\.com|fonts\.googleapis\.com|fonts\.gstatic\.com)/;
self.addEventListener('install', e => { e.waitUntil(caches.open(VERSION).then(c => c.addAll(['./', './index.html'])).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const req = e.request; if (req.method !== 'GET') return;
  const url = new URL(req.url); if (/script\.google/.test(url.host)) return;
  if (CDN.test(url.host)) { e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(res => { const c = res.clone(); caches.open(VERSION).then(x => x.put(req, c)); return res; }))); return; }
  if (url.origin === location.origin) { e.respondWith(fetch(req).then(res => { const c = res.clone(); caches.open(VERSION).then(x => x.put(req, c)); return res; }).catch(() => caches.match(req, { ignoreSearch: true }).then(h => h || caches.match('./index.html')))); }
});
