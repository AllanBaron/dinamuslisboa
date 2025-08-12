// ========================================
// MAIN.JS - Funcionalidades da Página Principal
// ========================================
// Este arquivo contém funcionalidades ESPECÍFICAS da página index.html

document.addEventListener('DOMContentLoaded', function() {
    initializeVideoManagement();
    initializeGoogleMaps();
    initializeActiveMenu();
    initializeWhatsApp();
    initializeCardInteractions();
});

// ========================================
// VÍDEO HERO - Gerenciamento e fallback
// ========================================
function initializeVideoManagement() {
    const video = document.getElementById('hero-video');
    const videoFallback = document.getElementById('video-fallback');
    
    if (!video || !videoFallback) return;
    
    let videoLoaded = false;
    let autoplayAttempted = false;

    // Detectar se é Safari com método mais robusto
    const isSafari = (() => {
        const ua = navigator.userAgent.toLowerCase();
        return ua.includes('safari') && !ua.includes('chrome') && !ua.includes('android');
    })();
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    
    // Debug info
    console.log('Detecção de navegador:', {
        userAgent: navigator.userAgent,
        isSafari: isSafari,
        isIOS: isIOS,
        videoElement: video
    });

    // Função para tentar reproduzir o vídeo
    async function attemptAutoplay() {
        if (autoplayAttempted) return;
        autoplayAttempted = true;

        console.log('Tentando autoplay...');

        try {
            // Para Safari e iOS, tentar com configurações específicas
            if (isSafari || isIOS) {
                console.log('Configurando vídeo para Safari/iOS...');
                video.muted = true;
                video.playsInline = true;
                video.autoplay = true;
                video.setAttribute('webkit-playsinline', 'true');
                
                // Tentar reproduzir programaticamente
                const playPromise = video.play();
                if (playPromise !== undefined) {
                    await playPromise;
                    console.log('Vídeo reproduzido com sucesso no Safari/iOS');
                }
            } else {
                // Para outros navegadores, usar autoplay normal
                console.log('Tentando autoplay normal...');
                await video.play();
                console.log('Vídeo reproduzido com sucesso');
            }
        } catch (error) {
            console.log('Autoplay falhou:', error.message);
            console.log('Tipo de erro:', error.name);
            handleAutoplayFailure();
        }
    }

    // Função para lidar com falha do autoplay
    function handleAutoplayFailure() {
        console.log('Implementando fallback para autoplay...');
        
        // Mostrar fallback de imagem
        videoFallback.classList.remove('hidden');
        
        // Criar botão de play manual se não existir
        if (!document.getElementById('play-video-btn')) {
            const playButton = document.createElement('button');
            playButton.id = 'play-video-btn';
            playButton.innerHTML = '<i class="fas fa-play"></i> Reproduzir Vídeo';
            playButton.className = 'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white bg-opacity-90 text-black px-6 py-3 rounded-lg font-semibold hover:bg-opacity-100 transition-all z-20';
            
            // Adicionar evento de clique
            playButton.addEventListener('click', async () => {
                console.log('Botão de play clicado, tentando reproduzir...');
                try {
                    video.muted = true;
                    video.playsInline = true;
                    video.setAttribute('webkit-playsinline', 'true');
                    await video.play();
                    playButton.style.display = 'none';
                    videoFallback.classList.add('hidden');
                    console.log('Vídeo reproduzido manualmente');
                } catch (error) {
                    console.log('Falha ao reproduzir manualmente:', error.message);
                }
            });
            
            // Adicionar ao container do vídeo
            const videoContainer = video.parentElement;
            if (videoContainer) {
                videoContainer.appendChild(playButton);
                console.log('Botão de play adicionado ao DOM');
            }
        }
    }

    // Verificar se o vídeo carregou com sucesso
    video.addEventListener('loadeddata', () => {
        console.log('Vídeo carregou dados');
        videoLoaded = true;
        videoFallback.classList.add('hidden');
        
        // Tentar autoplay após o carregamento
        if (!autoplayAttempted) {
            setTimeout(attemptAutoplay, 100);
        }
    });

    // Verificar se o vídeo falhou ao carregar
    video.addEventListener('error', (e) => {
        console.log('Erro ao carregar vídeo:', e);
        videoFallback.classList.remove('hidden');
    });

    // Verificar se o vídeo pode ser reproduzido
    video.addEventListener('canplay', () => {
        console.log('Vídeo pode ser reproduzido');
        videoLoaded = true;
        videoFallback.classList.add('hidden');
        
        // Tentar autoplay se ainda não foi tentado
        if (!autoplayAttempted) {
            setTimeout(attemptAutoplay, 100);
        }
    });

    // Eventos específicos para Safari/iOS
    if (isSafari || isIOS) {
        console.log('Configurando eventos específicos para Safari/iOS...');
        
        // Tentar autoplay quando a página se torna visível
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden && !autoplayAttempted) {
                console.log('Página tornou-se visível, tentando autoplay...');
                setTimeout(attemptAutoplay, 200);
            }
        });

        // Tentar autoplay quando a janela ganha foco
        window.addEventListener('focus', () => {
            if (!autoplayAttempted) {
                console.log('Janela ganhou foco, tentando autoplay...');
                setTimeout(attemptAutoplay, 200);
            }
        });

        // Tentar autoplay quando o usuário interage com a página
        document.addEventListener('touchstart', () => {
            if (!autoplayAttempted) {
                console.log('Touch detectado, tentando autoplay...');
                setTimeout(attemptAutoplay, 100);
            }
        }, { once: true });

        document.addEventListener('click', () => {
            if (!autoplayAttempted) {
                console.log('Clique detectado, tentando autoplay...');
                setTimeout(attemptAutoplay, 100);
            }
        }, { once: true });
    }

    // Fallback para navegadores que não suportam vídeo
    if (video.readyState === 0) {
        setTimeout(() => {
            if (!videoLoaded) {
                console.log('Timeout atingido, mostrando fallback');
                videoFallback.classList.remove('hidden');
            }
        }, 3000); // Aguarda 3 segundos antes de mostrar fallback
    }

    // Tentar autoplay inicial
    setTimeout(attemptAutoplay, 500);
}

// ========================================
// GOOGLE MAPS - Carregamento e integração
// ========================================
function initializeGoogleMaps() {
    // Lazy loading do Google Maps
    const mapPlaceholder = document.getElementById('map-placeholder');
    const googleMap = document.getElementById('google-map');
    
    if (mapPlaceholder && googleMap) {
        // Carregar mapa quando clicado
        mapPlaceholder.addEventListener('click', loadMap);
        
        // Carregar mapa automaticamente quando visível
        const mapObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(loadMap, 1000);
                    mapObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        const mapSection = document.querySelector('#visite');
        if (mapSection) {
            mapObserver.observe(mapSection);
        }
    }
}

function loadMap() {
    const mapPlaceholder = document.getElementById('map-placeholder');
    const googleMap = document.getElementById('google-map');
    
    if (mapPlaceholder && googleMap) {
        googleMap.src = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3111.012535180699!2d-9.303656799999999!3d38.763416500000005!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd1ece3f83ee0c79%3A0xf7a26d60b3ac74aa!2sR.%20da%20Bela%20Vista%2025%2C%202735-521%20Agualva-Cac%C3%A9m%2C%20Portugal!5e0!3m2!1spt-BR!2sbr!4v1752882291142!5m2!1spt-BR!2sbr";
        mapPlaceholder.classList.add('hidden');
        googleMap.classList.remove('hidden');
    }
}

// Função para abrir Google Maps
function openGoogleMaps() {
    const address = "R. da Bela Vista, 25, Cacém, Portugal";
    const encodedAddress = encodeURIComponent(address);
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
    window.open(mapsUrl, '_blank');
}

// ========================================
// WHATSAPP - Integração
// ========================================
function initializeWhatsApp() {
    // Função para abrir WhatsApp
    window.openWhatsApp = function() {
        const phoneNumber = "351912345678"; // Substitua pelo número real da igreja
        const message = "Olá! Gostaria de saber mais sobre os vossos encontros.";
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
        window.open(whatsappUrl, '_blank');
    };
}

// ========================================
// MENU ATIVO - Highlight do menu atual
// ========================================
function initializeActiveMenu() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu-link[href^="#"]');

    // Function to update active menu item
    function updateActiveMenu(currentId) {
        // Remove active class from all nav links (desktop)
        navLinks.forEach(link => {
            link.classList.remove('text-accent', 'font-semibold');
            link.classList.add('text-white');
        });
        
        // Remove active class from all mobile menu links
        mobileMenuLinks.forEach(link => {
            link.classList.remove('text-accent', 'font-semibold');
            link.classList.add('text-white');
        });
        
        // Add active class to current nav link (desktop)
        const activeLink = document.querySelector(`nav a[href="#${currentId}"]`);
        if (activeLink) {
            activeLink.classList.remove('text-white');
            activeLink.classList.add('text-accent', 'font-semibold');
        }
        
        // Add active class to current mobile menu link
        const activeMobileLink = document.querySelector(`.mobile-menu-link[href="#${currentId}"]`);
        if (activeMobileLink) {
            activeMobileLink.classList.remove('text-white');
            activeMobileLink.classList.add('text-accent', 'font-semibold');
        }
    }

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const currentId = entry.target.getAttribute('id');
                updateActiveMenu(currentId);
            }
        });
    }, { threshold: 0.3, rootMargin: '-100px 0px -60% 0px' });

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // Unified scroll handler for all sections
    window.addEventListener('scroll', GlobalUtils.debounce(() => {
        const scrollY = window.scrollY;
        const heroSection = document.getElementById('hero');
        const encontrosSection = document.getElementById('encontros');
        const visiteSection = document.getElementById('visite');
        
        if (heroSection && encontrosSection && visiteSection) {
            const encontrosTop = encontrosSection.offsetTop;
            const visiteTop = visiteSection.offsetTop;
            
            // Determine which section we're in based on scroll position
            if (scrollY < encontrosTop - 200) {
                updateActiveMenu('hero');
            } else if (scrollY < visiteTop - 200) {
                updateActiveMenu('encontros');
            } else {
                updateActiveMenu('visite');
            }
        }
    }, 10));

    // Set initial active menu on page load
    setTimeout(() => {
        const scrollY = window.scrollY;
        const encontrosSection = document.getElementById('encontros');
        
        if (encontrosSection && scrollY < encontrosSection.offsetTop - 200) {
            updateActiveMenu('hero');
        }
    }, 100);
    
    // Check if we're on grupos-conexao page and highlight the menu item
    if (window.location.pathname.includes('grupos-conexao.html')) {
        // Remove active class from all nav links (desktop)
        navLinks.forEach(link => {
            link.classList.remove('text-accent', 'font-semibold');
            link.classList.add('text-white');
        });
        
        // Remove active class from all mobile menu links
        mobileMenuLinks.forEach(link => {
            link.classList.remove('text-accent', 'font-semibold');
            link.classList.add('text-white');
        });
        
        // Add active class to Grupos de Conexão link (desktop)
        const gruposDesktopLink = document.querySelector('nav a[href="grupos-conexao.html"]');
        if (gruposDesktopLink) {
            gruposDesktopLink.classList.remove('text-white');
            gruposDesktopLink.classList.add('text-accent', 'font-semibold');
        }
        
        // Add active class to Grupos de Conexão link (mobile)
        const gruposMobileLink = document.querySelector('.mobile-menu-link[href="grupos-conexao.html"]');
        if (gruposMobileLink) {
            gruposMobileLink.classList.remove('text-white');
            gruposMobileLink.classList.add('text-accent', 'font-semibold');
        }
    }
}

// ========================================
// CARD INTERACTIONS - Hover e Clique
// ========================================
function initializeCardInteractions() {
    const cards = document.querySelectorAll('.image-card');
    
    cards.forEach(card => {
        // Adicionar evento de clique no card
        card.addEventListener('click', function(e) {
            // Não ativar se clicou no botão
            if (e.target.tagName === 'A' || e.target.closest('a')) {
                return;
            }
            
            // Se o card já está ativo, desativá-lo
            if (this.classList.contains('active')) {
                this.classList.remove('active');
            } else {
                // Desativar todos os outros cards primeiro
                cards.forEach(otherCard => {
                    otherCard.classList.remove('active');
                });
                // Ativar apenas o card clicado
                this.classList.add('active');
            }
        });
    });
    
    // Adicionar evento de clique fora dos cards para desativar
    document.addEventListener('click', function(e) {
        // Se clicou fora de qualquer card
        if (!e.target.closest('.image-card')) {
            cards.forEach(card => {
                card.classList.remove('active');
            });
        }
    });
    
    // Adicionar evento de clique no ESC para desativar
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            cards.forEach(card => {
                card.classList.remove('active');
            });
        }
    });
}

// ========================================
// API DA PÁGINA PRINCIPAL - Funções expostas
// ========================================
window.MainPage = {
    loadMap,
    openGoogleMaps,
    openWhatsApp: function() {
        if (window.openWhatsApp) {
            window.openWhatsApp();
        }
    }
}; 