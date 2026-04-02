// Service Worker for PWA — Network-first (캐시 지연 최소화)
const CACHE_VERSION = 'v3';
const CACHE_NAME = `semophone-${CACHE_VERSION}`;

// 설치 시 즉시 활성화 (기존 캐시 무시)
self.addEventListener('install', (event) => {
  console.log('[SW] Installing...');
  self.skipWaiting();
});

// 활성화 시 이전 버전 캐시 모두 삭제
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating...');
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Fetch: Network-first + 오프라인 폴백
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // http/https만 처리
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return;
  // GET만 캐시
  if (request.method !== 'GET') return;
  // _next/data, API는 캐시 안 함 (항상 최신)
  if (url.pathname.startsWith('/api/') || url.pathname.includes('/_next/data/')) return;

  // Network-first: 네트워크 우선, 실패 시 캐시
  event.respondWith(
    fetch(request)
      .then((response) => {
        // 성공 응답만 캐시
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return response;
      })
      .catch(() => {
        return caches.match(request).then((cached) => {
          if (cached) return cached;
          // 페이지 네비게이션이면 오프라인 페이지
          if (request.mode === 'navigate') {
            return caches.match('/offline');
          }
        });
      })
  );
});
