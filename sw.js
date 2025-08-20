// Service Worker com versionamento dinâmico baseado em version.json
let CACHE_NAME = 'dinamus-lisboa-v1.0.1'; // Versão padrão
let urlsToCache = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/js/global.js',
  '/js/main.js',
  '/js/mobile-menu.js',
  '/img/dnms-logo.png',
  '/img/encontros/culto.jpg',
  '/img/encontros/grupos-conexao.jpg',
  '/img/encontros/sala-de-oracao.jpg',
  '/img/encontros/hangout.jpg',
  'https://fonts.googleapis.com/css2?family=Caprasimo&family=Poppins:wght@300;400;600&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css',
  'https://cdn.jsdelivr.net/npm/smoothscroll-polyfill@0.4.4/dist/smoothscroll.min.js'
];

// Função para carregar configurações de versão
async function loadVersionConfig() {
  try {
    const response = await fetch('/version.json');
    const config = await response.json();
    
    // Atualizar nome do cache com versão atual
    CACHE_NAME = `dinamus-lisboa-v${config.version}`;
    
    // Atualizar URLs com versões específicas
    urlsToCache = urlsToCache.map(url => {
      if (url.includes('/css/styles.css')) {
        return `/css/styles.css?v=${config.version}`;
      }
      if (url.includes('/js/global.js')) {
        return `/js/global.js?v=${config.version}`;
      }
      if (url.includes('/js/main.js')) {
        return `/js/main.js?v=${config.version}`;
      }
      if (url.includes('/js/mobile-menu.js')) {
        return `/js/mobile-menu.js?v=${config.version}`;
      }
      return url;
    });
    
    console.log('Configuração de versão carregada:', config);
    console.log('Cache atualizado para:', CACHE_NAME);
    
    return config;
  } catch (error) {
    console.error('Erro ao carregar version.json, usando configuração padrão:', error);
    return null;
  }
}

// Install event - cache resources
self.addEventListener('install', event => {
  console.log('Service Worker instalando...');
  event.waitUntil(
    loadVersionConfig().then(() => {
      console.log('Instalando nova versão:', CACHE_NAME);
      return caches.open(CACHE_NAME);
    }).then(cache => {
      console.log('Cache aberto:', CACHE_NAME);
      return cache.addAll(urlsToCache);
    }).catch(error => {
      console.error('Erro ao instalar cache:', error);
    })
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', event => {
  // Forçar atualização de recursos críticos
  if (event.request.url.includes('styles.css') || 
      event.request.url.includes('main.js') || 
      event.request.url.includes('global.js') ||
      event.request.url.includes('mobile-menu.js')) {
    
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
  console.log('Service Worker ativando nova versão:', CACHE_NAME);
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deletando cache antigo:', cacheName);
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