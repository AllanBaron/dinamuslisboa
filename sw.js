// Service Worker com versionamento dinâmico baseado em version.json
let CACHE_NAME = 'dinamus-lisboa-v2.2.0'; // Versão padrão (será sobrescrita pelo version.json)
let urlsToCache = [
  '/',
  '/index.html',
  '/grupos-conexao.html',
  '/css/styles-min.css',
  '/js/script.min.js',
  '/img/dnms-logo.png',
  '/img/favicon/favicon.ico',
  '/img/encontros/culto.webp',
  '/img/encontros/culto.jpg',
  '/img/encontros/grupos-conexao.webp',
  '/img/encontros/grupos-conexao.jpg',
  '/img/encontros/sala-de-oracao.webp',
  '/img/encontros/sala-de-oracao.jpg',
  '/img/encontros/hangout.webp',
  '/img/encontros/hangout.jpg',
  '/img/gc/huios.webp',
  '/img/gc/huios.jpg',
  '/img/gc/ekballo.webp',
  '/img/gc/ekballo.jpg',
  '/img/gc/os-valentes.webp',
  '/img/gc/os-valentes.jpg',
  '/img/gc/shammah.webp',
  '/img/gc/shammah.jpg',
  'https://fonts.googleapis.com/css2?family=Caprasimo&family=Poppins:wght@300;400;600&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css'
];

// Função para carregar configurações de versão
async function loadVersionConfig() {
  try {
    const response = await fetch('/version.json');
    const config = await response.json();
    
    // Atualizar nome do cache com versão atual
    CACHE_NAME = `dinamus-lisboa-v${config.version}`;
    
    return config;
  } catch (error) {
    return null;
  }
}

// Install event - cache resources
self.addEventListener('install', event => {
  event.waitUntil(
    loadVersionConfig().then(() => {
      return caches.open(CACHE_NAME);
    }).then(cache => {
      return cache.addAll(urlsToCache);
    }).catch(error => {
      // Erro silencioso para produção
    })
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', event => {
  // Forçar atualização de recursos críticos
  if (event.request.url.includes('styles-min.css') || 
      event.request.url.includes('main.js') || 
      event.request.url.includes('global.js') ||
      event.request.url.includes('mobile-menu.js') ||
      event.request.url.includes('update-checker.js')) {
    
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Atualizar cache com nova versão
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
          return response;
        })
        .catch(() => {
          // Fallback para cache se falhar
          return caches.match(event.request);
        })
    );
  } else {
    // Para outros recursos, usar estratégia cache-first
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          return response || fetch(event.request);
        })
    );
  }
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  // Forçar atualização da página
  event.waitUntil(
    self.clients.claim().then(() => {
      return self.clients.matchAll().then(clients => {
        clients.forEach(client => {
          client.postMessage({
            type: 'CACHE_UPDATED',
            version: CACHE_NAME,
            cacheName: CACHE_NAME
          });
        });
      });
    })
  );
});

// Message event - para comunicação com a página principal
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({
      version: CACHE_NAME,
      cacheName: CACHE_NAME
    });
  }
}); 