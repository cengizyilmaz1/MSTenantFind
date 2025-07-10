const CACHE_NAME = 'ms-tenant-finder-v1.0.0';
const STATIC_CACHE_NAME = 'ms-tenant-static-v1.0.0';
const DYNAMIC_CACHE_NAME = 'ms-tenant-dynamic-v1.0.0';

// Assets to cache during installation
const STATIC_ASSETS = [
  '/mstenant-find/',
  '/mstenant-find/index.html',
  '/mstenant-find/manifest.json',
  '/mstenant-find/favicon.svg',
  '/mstenant-find/favicon.ico',
  '/mstenant-find/logo.svg',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE_NAME).then((cache) => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      }),
      caches.open(DYNAMIC_CACHE_NAME)
    ]).then(() => {
      console.log('Service Worker: Installation complete');
      self.skipWaiting();
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE_NAME && 
              cacheName !== DYNAMIC_CACHE_NAME &&
              cacheName.startsWith('ms-tenant-')) {
            console.log('Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker: Activation complete');
      return self.clients.claim();
    })
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension and other non-http requests
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // Handle different types of requests
  if (isStaticAsset(request)) {
    event.respondWith(cacheFirstStrategy(request, STATIC_CACHE_NAME));
  } else if (isAPIRequest(request)) {
    event.respondWith(networkFirstStrategy(request, DYNAMIC_CACHE_NAME));
  } else if (isNavigationRequest(request)) {
    event.respondWith(navigationStrategy(request));
  } else {
    event.respondWith(staleWhileRevalidateStrategy(request, DYNAMIC_CACHE_NAME));
  }
});

// Cache strategies
async function cacheFirstStrategy(request, cacheName) {
  try {
    const cache = await caches.open(cacheName);
    const cached = await cache.match(request);
    
    if (cached) {
      return cached;
    }
    
    const response = await fetch(request);
    if (response.status === 200) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.error('Cache first strategy failed:', error);
    return new Response('Network error', { status: 408 });
  }
}

async function networkFirstStrategy(request, cacheName) {
  try {
    const response = await fetch(request);
    if (response.status === 200) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.log('Network failed, trying cache:', error);
    const cache = await caches.open(cacheName);
    const cached = await cache.match(request);
    return cached || new Response('Offline', { status: 503 });
  }
}

async function staleWhileRevalidateStrategy(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  
  const fetchPromise = fetch(request).then((response) => {
    if (response.status === 200) {
      cache.put(request, response.clone());
    }
    return response;
  }).catch(() => cached);
  
  return cached || fetchPromise;
}

async function navigationStrategy(request) {
  try {
    const response = await fetch(request);
    return response;
  } catch (error) {
    // Return cached index.html for navigation requests when offline
    const cache = await caches.open(STATIC_CACHE_NAME);
    return cache.match('/mstenant-find/index.html');
  }
}

// Helper functions
function isStaticAsset(request) {
  const url = new URL(request.url);
  return url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/);
}

function isAPIRequest(request) {
  const url = new URL(request.url);
  return url.hostname.includes('api.') || 
         url.pathname.includes('/api/') ||
         url.hostname.includes('graph.microsoft.com');
}

function isNavigationRequest(request) {
  return request.mode === 'navigate' || 
         (request.method === 'GET' && request.headers.get('accept').includes('text/html'));
}

console.log('Service Worker: Script loaded'); 