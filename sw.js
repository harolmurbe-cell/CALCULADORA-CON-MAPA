// Service worker: la app funciona sin señal una vez abierta con conexión.
// Cambie VERSION cada vez que publique cambios para forzar la actualización.
var VERSION = "eofbc-v3.1";
var APP = ["./", "./index.html", "./ruta_arauca.js", "./manifest.json", "./icon-192.png", "./icon-512.png",
           "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css", "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"];
var TILES = "eofbc-tiles";
var MAX_TILES = 1500;

self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(VERSION).then(function (c) { return c.addAll(APP); }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== VERSION && k !== TILES; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

function esTile(url) { return /arcgisonline\.com|tile\.openstreetmap\.org/.test(url); }

function recortar(cache) {
  cache.keys().then(function (k) { if (k.length > MAX_TILES) for (var i = 0; i < k.length - MAX_TILES; i++) cache.delete(k[i]); });
}

self.addEventListener("fetch", function (e) {
  if (e.request.method !== "GET") return;
  var url = e.request.url;
  if (esTile(url)) {
    // Mosaicos del mapa: primero caché, luego red (se guardan los que ya se vieron)
    e.respondWith(caches.open(TILES).then(function (cache) {
      return cache.match(e.request).then(function (hit) {
        if (hit) return hit;
        return fetch(e.request).then(function (res) { cache.put(e.request, res.clone()); recortar(cache); return res; });
      });
    }));
    return;
  }
  // App: red primero (para recibir actualizaciones), caché si no hay señal
  e.respondWith(fetch(e.request).then(function (res) {
    var copia = res.clone();
    caches.open(VERSION).then(function (c) { c.put(e.request, copia); });
    return res;
  }).catch(function () { return caches.match(e.request, { ignoreSearch: true }); }));
});
