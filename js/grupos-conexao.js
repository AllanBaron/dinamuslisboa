// Variáveis globais
let todosGrupos = [];
let gruposFiltrados = [];
let filtroAtual = 'all';

// Verificar se as funções já estão definidas (para evitar conflitos com scripts.min.js)
if (typeof window.carregarGrupos !== 'undefined') {
    // Funções já estão definidas, pulando inicialização
} else {
    // Dados estáticos como fallback
    const dadosEstaticos = {
        "grupos": [
            {
                "id": "gc-huios",
                "titulo": "Huios",
                "local": "Lisboa - Loures",
                "dia": "Sexta-feira",
                "hora": "20:30",
                "regiao": "lisboa",
                "imagem": "img/gc/huios.webp",
                "imagemFallback": "img/gc/huios.jpg",
                "whatsapp": "351932819689",
                "descricao": "Grupo de Jovens"
            },
            {
                "id": "gc-ekballo",
                "titulo": "Ekballo",
                "local": "Sintra - Oeiras",
                "dia": "Sábado",
                "hora": "17:00",
                "regiao": "sintra",
                "imagem": "img/gc/ekballo.webp",
                "imagemFallback": "img/gc/ekballo.jpg",
                "whatsapp": "351910459745",
                "descricao": "Grupo de Jovens e Adolescentes"
            },
            {
                "id": "os-valentes-benfica",
                "titulo": "Os Valentes",
                "local": "Lisboa - Benfica",
                "dia": "Quinta-feira",
                "hora": "20:00",
                "regiao": "lisboa",
                "imagem": "img/gc/os-valentes.webp",
                "imagemFallback": "img/gc/os-valentes.jpg",
                "whatsapp": "351938070194",
                "descricao": "Grupo de Adultos e Casais"
            },
            {
                "id": "shammah",
                "titulo": "Shammah",
                "local": "Sintra - Cacém",
                "dia": "Sexta-feira",
                "hora": "20:00",
                "regiao": "sintra",
                "imagem": "img/gc/shammah.webp",
                "imagemFallback": "img/gc/shammah.jpg",
                "whatsapp": "351925677525",
                "descricao": "Grupo de Adultos e Casais"
            }
        ]
    };

    // Carregar dados dos grupos
    function carregarGrupos() {
        try {
            // Usar dados estáticos diretamente
            todosGrupos = dadosEstaticos.grupos;
            gruposFiltrados = [...todosGrupos];
            
            // Verificar se o DOM está pronto antes de criar filtros
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => {
                    criarFiltrosDinamicos();
                    renderizarGrupos();
                    inicializarObservadores();
                });
            } else {
                // DOM já está pronto
                criarFiltrosDinamicos();
                renderizarGrupos();
                inicializarObservadores();
            }
        } catch (error) {
            console.error('Erro ao carregar grupos:', error);
        }
    }

    // Criar filtros dinâmicos baseados nas regiões disponíveis
    function criarFiltrosDinamicos() {
        try {
            const filtrosContainer = document.querySelector('.flex.flex-wrap.justify-center.gap-2');
            
            // Verificar se o container existe
            if (!filtrosContainer) {
                return;
            }
            
            const filtroTodos = filtrosContainer.querySelector('[data-filter="all"]');
            
            // Verificar se o filtro "Todos" existe
            if (!filtroTodos) {
                return;
            }
            
            // Limpar filtros existentes (exceto "Todos")
            const filtrosExistentes = filtrosContainer.querySelectorAll('[data-filter]:not([data-filter="all"])');
            filtrosExistentes.forEach(filtro => filtro.remove());
            
            // Obter regiões únicas dos grupos
            const regioes = [...new Set(todosGrupos.map(grupo => grupo.regiao))];
            
            // Criar botões de filtro para cada região
            regioes.forEach(regiao => {
                const nomeRegiao = obterNomeRegiao(regiao);
                const botaoFiltro = document.createElement('button');
                botaoFiltro.className = 'filter-btn bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-all text-sm';
                botaoFiltro.setAttribute('data-filter', regiao);
                botaoFiltro.textContent = nomeRegiao;
                
                botaoFiltro.addEventListener('click', () => {
                    aplicarFiltro(regiao);
                });
                
                filtrosContainer.appendChild(botaoFiltro);
            });
        } catch (error) {
            console.error('Erro ao criar filtros dinâmicos:', error);
        }
    }

    // Obter nome amigável da região
    function obterNomeRegiao(regiao) {
        const nomes = {
            'lisboa': 'Lisboa',
            'sintra': 'Sintra',
            'margem-sul': 'Margem Sul'
        };
        return nomes[regiao] || regiao;
    }

    // Aplicar filtro por região
    function aplicarFiltro(regiao) {
        try {
            filtroAtual = regiao;
            
            // Atualizar classes dos botões de filtro
            const filterBtns = document.querySelectorAll('.filter-btn');
            if (filterBtns.length > 0) {
                filterBtns.forEach(btn => {
                    btn.classList.remove('active', 'bg-primary', 'text-white');
                    btn.classList.add('bg-gray-300', 'text-gray-700');
                });
            }
            
            const botaoAtivo = document.querySelector(`[data-filter="${regiao}"]`);
            if (botaoAtivo) {
                botaoAtivo.classList.remove('bg-gray-300', 'text-gray-700');
                botaoAtivo.classList.add('active', 'bg-primary', 'text-white');
            }
            
            // Filtrar grupos
            if (regiao === 'all') {
                gruposFiltrados = [...todosGrupos];
            } else {
                gruposFiltrados = todosGrupos.filter(grupo => grupo.regiao === regiao);
            }
            
            // Aplicar busca se houver texto no campo de busca
            const searchInput = document.getElementById('search-grupos');
            if (searchInput) {
                const termoBusca = searchInput.value.trim();
                if (termoBusca) {
                    aplicarBusca(termoBusca);
                } else {
                    renderizarGrupos();
                }
            } else {
                renderizarGrupos();
            }
        } catch (error) {
            console.error('Erro ao aplicar filtro:', error);
        }
    }

    // Aplicar busca por texto
    function aplicarBusca(termo) {
        try {
            const termoLower = termo.toLowerCase();
            
            gruposFiltrados = todosGrupos.filter(grupo => {
                // Se há um filtro de região ativo, aplicar primeiro
                if (filtroAtual !== 'all' && grupo.regiao !== filtroAtual) {
                    return false;
                }
                
                // Buscar em título, local, dia, hora e descrição
                return grupo.titulo.toLowerCase().includes(termoLower) ||
                       grupo.local.toLowerCase().includes(termoLower) ||
                       grupo.dia.toLowerCase().includes(termoLower) ||
                       grupo.hora.toLowerCase().includes(termoLower) ||
                       grupo.descricao.toLowerCase().includes(termoLower);
            });
            
            renderizarGrupos();
        } catch (error) {
            console.error('Erro ao aplicar busca:', error);
        }
    }

    // Renderizar grupos com animação cascata otimizada
    function renderizarGrupos() {
        try {
            const grid = document.getElementById('grupos-grid');
            
            // Verificar se o grid existe
            if (!grid) {
                return;
            }
            
            if (gruposFiltrados.length === 0) {
                grid.innerHTML = `
                    <div class="col-span-full text-center py-12">
                        <i class="fas fa-search text-4xl text-gray-400 mb-4"></i>
                        <p class="text-gray-500 text-lg">Nenhum grupo encontrado com os critérios selecionados.</p>
                        <button onclick="limparFiltros()" class="mt-4 text-primary hover:underline">
                            Limpar filtros
                        </button>
                    </div>
                `;
                return;
            }
            
            // Limpar grid primeiro
            grid.innerHTML = '';
            
            // Criar e adicionar cards um por vez com classe cascade
            gruposFiltrados.forEach((grupo, index) => {
                const card = document.createElement('div');
                card.className = 'grupo-card cascade';
                card.setAttribute('data-categoria', grupo.regiao);
                
                card.innerHTML = `
                    <!-- Imagem do card com picture element -->
                    <div class="card-image">
                        <picture>
                            <!-- WebP para navegadores modernos -->
                            <source srcset="${grupo.imagem}" type="image/webp">
                            <!-- JPEG como fallback -->
                            <img src="${grupo.imagemFallback}" 
                                 alt="Grupo ${grupo.titulo} - ${grupo.descricao} da Dinamus Lisboa" 
                                 class="w-full h-full object-cover"
                                 loading="lazy"
                                 width="300"
                                 height="280">
                        </picture>
                    </div>
                    
                    <!-- Conteúdo do card -->
                    <div class="card-content">
                        <!-- Título e Descrição -->
                        <div class="grupo-header">
                            <h3 class="grupo-titulo">${grupo.titulo}</h3>
                            <p class="grupo-descricao">${grupo.descricao}</p>
                        </div>
                        
                        <!-- Local -->
                        <div class="info-item">
                            <div class="info-icon">
                                <i class="fas fa-map-marker-alt"></i>
                            </div>
                            <div class="info-text">
                                <div class="info-value">${grupo.local}</div>
                            </div>
                        </div>
                        
                        <!-- Dia e Hora -->
                        <div class="info-item">
                            <div class="info-icon">
                                <i class="fas fa-calendar-alt"></i>
                            </div>
                            <div class="info-text">
                                <div class="info-value">${grupo.dia} às ${grupo.hora}</div>
                            </div>
                        </div>
                        
                        <!-- Frequência dos Encontros -->
                        <div class="info-item">
                            <div class="info-icon">
                                <i class="fas fa-info-circle"></i>
                            </div>
                            <div class="info-text">
                                <div class="info-value">Encontros quinzenais</div>
                            </div>
                        </div>
                        
                        <!-- Botão WhatsApp -->
                        <div class="whatsapp-btn">
                            <a href="https://wa.me/${grupo.whatsapp}?text=Olá! Gostaria de saber mais sobre o grupo ${grupo.titulo}" 
                               target="_blank">
                                <i class="fab fa-whatsapp"></i>
                                Entrar em Contacto
                            </a>
                        </div>
                    </div>
                `;
                
                // Adicionar o card ao grid
                grid.appendChild(card);
                
                // Adicionar tratamento de erro para a imagem
                const cardImage = card.querySelector('.card-image img');
                if (cardImage) {
                    cardImage.onerror = function() {
                        // Se a imagem falhar, tentar usar o fallback
                        console.log(`Imagem falhou, tentando fallback: ${grupo.imagemFallback}`);
                        this.src = grupo.imagemFallback;
                    };
                }
                
                // Forçar reflow para garantir que o DOM seja atualizado
                card.offsetHeight;
            });
            
            // Iniciar animação cascata após um delay maior para estabilizar
            setTimeout(() => {
                iniciarAnimacaoCascata();
            }, 200);
        } catch (error) {
            console.error('Erro ao renderizar grupos:', error);
        }
    }

    // Função para iniciar a animação cascata com timing otimizado
    function iniciarAnimacaoCascata() {
        try {
            const cards = document.querySelectorAll('.grupo-card.cascade');
            
            if (cards.length > 0) {
                cards.forEach((card, index) => {
                    setTimeout(() => {
                        // Adicionar classe visible para ativar a animação
                        card.classList.add('visible');
                    }, index * 200); // Delay maior (200ms) para animação mais suave
                });
            }
        } catch (error) {
            console.error('Erro ao iniciar animação cascata:', error);
        }
    }

    // Limpar todos os filtros
    function limparFiltros() {
        try {
            filtroAtual = 'all';
            gruposFiltrados = [...todosGrupos];
            
            // Limpar campo de busca
            const searchInput = document.getElementById('search-grupos');
            if (searchInput) {
                searchInput.value = '';
            }
            
            // Resetar botões de filtro
            const filterBtns = document.querySelectorAll('.filter-btn');
            if (filterBtns.length > 0) {
                filterBtns.forEach(btn => {
                    btn.classList.remove('active', 'bg-primary', 'text-white');
                    btn.classList.add('bg-gray-300', 'text-gray-700');
                });
            }
            
            const botaoTodos = document.querySelector('[data-filter="all"]');
            if (botaoTodos) {
                botaoTodos.classList.remove('bg-gray-300', 'text-gray-700');
                botaoTodos.classList.add('active', 'bg-primary', 'text-white');
            }
            
            renderizarGrupos();
        } catch (error) {
            console.error('Erro ao limpar filtros:', error);
        }
    }

    // Tornar função acessível globalmente
    window.limparFiltros = limparFiltros;

    // Inicializar observadores de animação para seções gerais (não cards)
    function inicializarObservadores() {
        try {
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // Adicionar classe animate para ativar as animações
                        entry.target.classList.add('animate');
                        
                        // Remover o observador após a animação
                        observer.unobserve(entry.target);
                    }
                });
            }, observerOptions);

            // Observar apenas seções gerais (FAQ, CTA, etc.) - não cards
            const sections = document.querySelectorAll('.observe-section:not(.animate)');
            if (sections.length > 0) {
                sections.forEach(section => {
                    observer.observe(section);
                });
            }
        } catch (error) {
            console.error('Erro ao inicializar observadores:', error);
        }
    }

    // Inicializar quando o DOM estiver carregado
    document.addEventListener('DOMContentLoaded', function() {
        try {
            // Carregar grupos
            carregarGrupos();
            
            // Event listener para busca
            const searchInput = document.getElementById('search-grupos');
            if (searchInput) {
                let timeoutId;
                
                searchInput.addEventListener('input', (e) => {
                    clearTimeout(timeoutId);
                    timeoutId = setTimeout(() => {
                        const termo = e.target.value.trim();
                        if (termo) {
                            aplicarBusca(termo);
                        } else {
                            // Se não há termo de busca, aplicar apenas o filtro de região
                            aplicarFiltro(filtroAtual);
                        }
                    }, 300); // Debounce de 300ms
                });
            }
            
            // Event listener para filtro "Todos"
            const botaoTodos = document.querySelector('[data-filter="all"]');
            if (botaoTodos) {
                botaoTodos.addEventListener('click', () => {
                    aplicarFiltro('all');
                });
            }
            
            // Mobile menu is now handled by mobile-menu.js
            
            // Highlight active menu item for Grupos de Conexão page
            highlightActiveMenu();
            
            // Atualizar ano no footer
            const yearElement = document.getElementById('year');
            if (yearElement) {
                yearElement.textContent = new Date().getFullYear();
            }
        } catch (error) {
            console.error('Erro durante a inicialização dos grupos de conexão:', error);
        }
    });

    // Function to highlight the active menu item
    function highlightActiveMenu() {
        try {
            // Remove active class from all mobile menu links
            const mobileMenuLinks = document.querySelectorAll('.mobile-menu-link');
            if (mobileMenuLinks.length > 0) {
                mobileMenuLinks.forEach(link => {
                    link.classList.remove('text-accent', 'font-semibold');
                    link.classList.add('text-white');
                });
            }
            
            // Add active class to Grupos de Conexão link (mobile)
            const gruposMobileLink = document.querySelector('.mobile-menu-link[href="grupos-conexao.html"]');
            if (gruposMobileLink) {
                gruposMobileLink.classList.remove('text-white');
                gruposMobileLink.classList.add('text-accent', 'font-semibold');
            }
        } catch (error) {
            console.error('Erro ao destacar menu ativo:', error);
        }
    }
}
