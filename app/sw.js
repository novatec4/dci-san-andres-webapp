// =============================================================================
// SW.JS — Service Worker Oficial PWA (Ayuda en Acción / ESPOCH)
// Plataforma DCI San Andrés — Versión v2.6.0 Oficial
// Proporciona soporte offline completo, pre-caché de activos y estrategia Network-First
// =============================================================================

const CACHE_NAME = 'cgpi-dci-cache-v2.6.2';

const PRECACHE_ASSETS = [
  './',
  './index.html',
  './verificar.html',
  './manifest.json',
  './assets/img/favicon.svg',
  './AEA-Imagotipo-naranja-ayuda-pantalla-4000x.png',
  './css/styles.css?v=2.6.2',
  './js/vendor/qrcode.min.js',
  './js/anthro_who.js?v=2.6.2',
  './js/data.js?v=2.6.2',
  './js/auth.js?v=2.6.2',
  './js/portal.js?v=2.6.2',
  './js/users.js?v=2.6.2',
  './js/kobo_sync.js?v=2.6.2',
  './js/protocols.js?v=2.6.2',
  './js/dashboard.js?v=2.6.2',
  './js/gis.js?v=2.6.2',
  './js/surveyors.js?v=2.6.2',
  './js/population.js?v=2.6.2',
  './js/reports.js?v=2.6.2',
  './js/credentials.js?v=2.6.2',
  './js/app.js?v=2.6.2',
  './data/brigadistas_espoch_dci.json',
  './data/gis/san_andres_limite.geojson',
  './data/gis/zonas_logisticas_san_andres.geojson',
  './data/gis/anillos_visita_san_andres.geojson',
  './data/gis/comunidades_oficiales_pdot_san_andres.geojson',
  './data/gis/san_andres_viviendas.geojson',
  './data/gis/puntos_interes_pois_san_andres.geojson'
];

// 1. Instalación: Pre-almacenar activos críticos en caché
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('📦 [PWA SW] Pre-almacenando archivos estáticos de la versión v2.6.0...');
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('⚠️ [PWA SW] Error en pre-caché selectivo (algunos archivos pueden cargarse dinámicamente):', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// 2. Activación: Limpieza de versiones obsoletas de caché
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME && name.startsWith('cgpi-dci-cache-')) {
            console.log('🧹 [PWA SW] Eliminando caché obsoleta:', name);
            return caches.delete(name);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. Estrategia de Fetch: Network-First con Fallback a Caché (Ideal para operaciones de campo offline)
self.addEventListener('fetch', (event) => {
  // Ignorar solicitudes que no sean GET o esquemas no soportados (ej. chrome-extension)
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);

  // No interceptar peticiones externas complejas ni APIs remotas si fallan
  if (!url.protocol.startsWith('http')) return;

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // Si la respuesta es válida, clonar y actualizar en caché
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // Sin conexión: Servir desde caché local
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // Fallback para navegación de página
          if (event.request.mode === 'navigate') {
            return caches.match('./index.html');
          }
        });
      })
  );
});
