// ========================================
// GLOBAL.JS - Funcionalidades Globais
// ========================================
// Este arquivo contém funcionalidades que são usadas em TODAS as páginas

// Performance optimization - defer non-critical operations
document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
});

// ========================================
// LAZY LOADING - Imagens
// ========================================
const lazyImages = document.querySelectorAll('.lazy-image');
const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.add('loaded');
            observer.unobserve(img);
        }
    });
});

lazyImages.forEach(img => imageObserver.observe(img));

// ========================================
// ANIMAÇÕES DE SCROLL - Intersection Observer
// ========================================
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            console.log('🎯 Seção visível:', entry.target);
            
            // Use requestAnimationFrame for better performance
            requestAnimationFrame(() => {
                entry.target.classList.add('fade-in-section');
                console.log('✨ Adicionada classe fade-in-section para:', entry.target);
                
                // Trigger animations for child elements if they have specific delays
                const childElements = entry.target.querySelectorAll('[style*="animation-delay"]');
                childElements.forEach(child => {
                    const delay = child.style.animationDelay || '0s';
                    const delayValue = parseFloat(delay) * 1000; // Convert to milliseconds
                    
                    setTimeout(() => {
                        child.style.opacity = '1';
                        child.style.transform = 'translateY(0)';
                        console.log('🎬 Animação ativada para elemento filho:', child);
                    }, delayValue);
                });
            });
        }
    });
}, { threshold: 0.1, rootMargin: '50px' });

// Initialize observer when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Observar todas as seções para animações
    const observeSections = document.querySelectorAll('.observe-section');
    console.log('🔍 Encontradas seções para observar:', observeSections.length);
    
    observeSections.forEach((section, index) => {
        observer.observe(section);
        console.log(`📱 Observando seção ${index + 1}:`, section);
    });
});

// ========================================
// NAVBAR - Background on scroll
// ========================================
const navbar = document.getElementById('navbar');
if (navbar) {
    const handleScroll = debounce(() => {
        if (window.scrollY > 50) {
            navbar.classList.add('bg-black', 'bg-opacity-90', 'shadow-lg');
        } else {
            navbar.classList.remove('bg-black', 'bg-opacity-90', 'shadow-lg');
        }
    }, 10);

    window.addEventListener('scroll', handleScroll);
}

// ========================================
// MOBILE MENU - Toggle Moderno
// ========================================
// Moved to mobile-menu.js for better separation of concerns

// ========================================
// SMOOTH SCROLLING - Para todos os links internos
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    // Initialize smooth scroll polyfill
    if (typeof smoothscroll !== 'undefined') {
        smoothscroll.polyfill();
    }

    // Smooth scrolling for all anchor links (excluding mobile menu links)
    document.querySelectorAll('a[href^="#"]:not(.mobile-menu-link)').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const mobileMenu = document.getElementById('mobile-menu');
            const hamburgerMenu = document.querySelector('.hamburger-menu');
            const targetId = this.getAttribute('href');

            // Close mobile menu if it's open
            if (mobileMenu && mobileMenu.classList.contains('active')) {
                if (hamburgerMenu) {
                    hamburgerMenu.classList.remove('active');
                }
                mobileMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            }

            // If link is just "#", scroll to top
            if (targetId === '#') {
                if (window.MobileMenu && window.MobileMenu.smoothScrollTo) {
                    window.MobileMenu.smoothScrollTo(0, 800);
                } else {
                    window.scrollTo(0, 0);
                }
                return;
            }

            // For other links, scroll to the element
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const targetPosition = targetElement.offsetTop - 80; // Offset for fixed header
                if (window.MobileMenu && window.MobileMenu.smoothScrollTo) {
                    window.MobileMenu.smoothScrollTo(targetPosition, 800);
                } else {
                    window.scrollTo(0, targetPosition);
                }
            }
        });
    });
});

// ========================================
// UTILITÁRIOS - Funções auxiliares
// ========================================

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Smooth scroll functions moved to mobile-menu.js for better organization

// ========================================
// SERVICE WORKER - Para cache
// ========================================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Carregar configuração de versão antes de registrar o SW
        loadVersionConfig().then(config => {
            if (config) {
                console.log('Versão carregada:', config.version);
                // Registrar SW com versão atual
                return navigator.serviceWorker.register(`/sw.js?v=${config.version}`);
            } else {
                // Fallback para versão padrão
                return navigator.serviceWorker.register('/sw.js?v=1.0.1');
            }
        }).then(registration => {
            console.log('SW registrado com sucesso:', registration);
            
            // Verificar atualizações
            registration.addEventListener('updatefound', () => {
                console.log('Nova versão do Service Worker disponível');
            });
        }).catch(registrationError => {
            console.log('Falha no registro do SW:', registrationError);
        });
    });
    
    // Escutar mensagens do Service Worker
    navigator.serviceWorker.addEventListener('message', event => {
        if (event.data && event.data.type === 'CACHE_UPDATED') {
            console.log('Cache atualizado para versão:', event.data.version);
            // Forçar recarregamento da página se necessário
            if (confirm('Uma nova versão está disponível. Deseja recarregar a página?')) {
                window.location.reload();
            }
        }
    });
}

// ========================================
// CONFIGURAÇÃO DE VERSÃO - Centralizada
// ========================================
let currentVersion = '1.0.1'; // Versão padrão
let versionConfig = null;

// Função para carregar configuração de versão
async function loadVersionConfig() {
    try {
        const response = await fetch('/version.json');
        const config = await response.json();
        
        currentVersion = config.version;
        versionConfig = config;
        
        console.log('Configuração de versão carregada:', config);
        
        // Atualizar versões dos arquivos CSS e JS dinamicamente
        updateResourceVersions(config);
        
        return config;
    } catch (error) {
        console.error('Erro ao carregar version.json, usando versão padrão:', error);
        return null;
    }
}

// Função para atualizar versões dos recursos
function updateResourceVersions(config) {
    // Atualizar CSS
    const cssLink = document.querySelector('link[href*="styles.css"]');
    if (cssLink) {
        cssLink.href = `/css/styles.css?v=${config.version}`;
    }
    
    // Atualizar JS (se necessário)
    const jsScripts = document.querySelectorAll('script[src*=".js"]');
    jsScripts.forEach(script => {
        if (script.src.includes('global.js')) {
            script.src = `/js/global.js?v=${config.version}`;
        } else if (script.src.includes('main.js')) {
            script.src = `/js/main.js?v=${config.version}`;
        } else if (script.src.includes('mobile-menu.js')) {
            script.src = `/js/mobile-menu.js?v=${config.version}`;
        }
    });
}

// Função para obter versão atual
window.getCurrentVersion = function() {
    return currentVersion;
};

// Função para obter configuração completa
window.getVersionConfig = function() {
    return versionConfig;
};

// ========================================
// LIMPEZA DE CACHE - Funções manuais
// ========================================
window.clearAllCaches = async function() {
    if ('caches' in window) {
        try {
            const cacheNames = await caches.keys();
            await Promise.all(
                cacheNames.map(cacheName => caches.delete(cacheName))
            );
            console.log('Todos os caches foram limpos');
            
            // Recarregar a página para aplicar mudanças
            if (confirm('Cache limpo! Deseja recarregar a página?')) {
                window.location.reload();
            }
        } catch (error) {
            console.error('Erro ao limpar cache:', error);
        }
    }
};

window.forceReload = function() {
    // Forçar recarregamento sem cache
    window.location.reload(true);
};

window.checkCacheVersion = async function() {
    if ('caches' in window) {
        try {
            const cacheNames = await caches.keys();
            console.log('Caches ativos:', cacheNames);
            
            // Obter versão atual do SW se disponível
            if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
                const messageChannel = new MessageChannel();
                messageChannel.port1.onmessage = event => {
                    console.log('Versão do SW:', event.data);
                    alert(`Caches ativos: ${cacheNames.join(', ')}\nVersão SW: ${event.data.version}`);
                };
                
                navigator.serviceWorker.controller.postMessage({
                    type: 'GET_VERSION'
                }, [messageChannel.port2]);
            } else {
                alert(`Caches ativos: ${cacheNames.join(', ')}\nVersão atual: ${currentVersion}`);
            }
        } catch (error) {
            console.error('Erro ao verificar caches:', error);
        }
    }
};

// Adicionar botões de debug no console (apenas em desenvolvimento)
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('🔧 Funções de debug disponíveis:');
    console.log('- clearAllCaches() - Limpa todos os caches');
    console.log('- forceReload() - Recarrega a página forçadamente');
    console.log('- checkCacheVersion() - Verifica versões dos caches');
    console.log('- getCurrentVersion() - Retorna versão atual');
    console.log('- getVersionConfig() - Retorna configuração completa');
}

// ========================================
// API GLOBAL - Funções expostas para uso
// ========================================
window.GlobalUtils = {
    debounce,
    loadVersionConfig,
    getCurrentVersion,
    getVersionConfig
}; 