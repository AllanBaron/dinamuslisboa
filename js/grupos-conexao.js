// Variáveis globais
let todosGrupos = [];
let gruposFiltrados = [];
let filtroAtual = 'all';

// Dados estáticos como fallback
const dadosEstaticos = {
    "grupos": [
        {
            "id": "gc-huios",
            "titulo": "GC Huios",
            "local": "Lisboa - Odivelas",
            "dia": "Sexta-feira",
            "hora": "20:00",
            "regiao": "lisboa",
            "imagem": "img/gc_huios.png",
            "whatsapp": "351912345678",
            "descricao": "Grupo de estudo bíblico e comunhão"
        },
        {
            "id": "gc-bemfica",
            "titulo": "GC Bemfica",
            "local": "Lisboa - Bemfica",
            "dia": "Sexta-feira",
            "hora": "19:30",
            "regiao": "lisboa",
            "imagem": "img/gc_huios.png",
            "whatsapp": "351912345679",
            "descricao": "Grupo de jovens e adultos"
        },
        {
            "id": "gc-sintra-centro",
            "titulo": "GC Sintra Centro",
            "local": "Sintra - Centro",
            "dia": "Quinta-feira",
            "hora": "19:30",
            "regiao": "sintra",
            "imagem": "img/gc_huios.png",
            "whatsapp": "351912345679",
            "descricao": "Grupo de jovens e adultos"
        },
    ]
};

// Carregar dados dos grupos
function carregarGrupos() {
    // Usar dados estáticos diretamente
    todosGrupos = dadosEstaticos.grupos;
    gruposFiltrados = [...todosGrupos];
    
    console.log('✅ Dados carregados dos dados estáticos');
    
    // Criar filtros dinâmicos baseados nas regiões disponíveis
    criarFiltrosDinamicos();
    
    // Renderizar grupos
    renderizarGrupos();
    
    // Inicializar observadores de animação
    inicializarObservadores();
}

// Criar filtros dinâmicos baseados nas regiões disponíveis
function criarFiltrosDinamicos() {
    const filtrosContainer = document.querySelector('.flex.flex-wrap.justify-center.gap-2');
    const filtroTodos = filtrosContainer.querySelector('[data-filter="all"]');
    
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
    filtroAtual = regiao;
    
    // Atualizar classes dos botões de filtro
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active', 'bg-primary', 'text-white');
        btn.classList.add('bg-gray-300', 'text-gray-700');
    });
    
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
    const termoBusca = document.getElementById('search-grupos').value.trim();
    if (termoBusca) {
        aplicarBusca(termoBusca);
    } else {
        renderizarGrupos();
    }
}

// Aplicar busca por texto
function aplicarBusca(termo) {
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
}

// Renderizar grupos na grid
function renderizarGrupos() {
    const grid = document.getElementById('grupos-grid');
    
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
    
    grid.innerHTML = gruposFiltrados.map(grupo => `
        <div class="bg-white rounded-lg shadow-lg overflow-hidden observe-section grupo-card flex flex-col" data-categoria="${grupo.regiao}">
            <div class="h-48 bg-cover bg-center" style="background-image: url('${grupo.imagem}');"></div>
            <div class="p-6 flex flex-col flex-grow">
                <div class="flex-grow">
                    <h3 class="font-display text-2xl text-main mb-2">${grupo.titulo}</h3>
                    <p class="text-gray-600 mb-4">
                        <i class="fas fa-map-marker-alt text-primary mr-2"></i>
                        ${grupo.local}
                    </p>
                    <p class="text-gray-600 mb-4">
                        <i class="fas fa-calendar-alt text-primary mr-2"></i>
                        ${grupo.dia} - ${grupo.hora}
                    </p>
                    <p class="text-gray-500 text-sm mb-4">${grupo.descricao}</p>
                </div>
                <div class="mt-auto pt-4">
                    <a href="https://wa.me/${grupo.whatsapp}?text=Olá! Gostaria de saber mais sobre o ${grupo.titulo}" 
                       target="_blank" 
                       class="inline-flex items-center justify-center w-full bg-green-500 text-white font-semibold px-4 py-3 rounded-lg hover:bg-green-600 transition-all transform hover:scale-105">
                        <i class="fab fa-whatsapp mr-2"></i>
                    </a>
                </div>
            </div>
        </div>
    `).join('');
    
    // Reinicializar observadores após renderizar
    inicializarObservadores();
}

// Limpar todos os filtros
function limparFiltros() {
    filtroAtual = 'all';
    gruposFiltrados = [...todosGrupos];
    
    // Limpar campo de busca
    document.getElementById('search-grupos').value = '';
    
    // Resetar botões de filtro
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active', 'bg-primary', 'text-white');
        btn.classList.add('bg-gray-300', 'text-gray-700');
    });
    
    const botaoTodos = document.querySelector('[data-filter="all"]');
    if (botaoTodos) {
        botaoTodos.classList.remove('bg-gray-300', 'text-gray-700');
        botaoTodos.classList.add('active', 'bg-primary', 'text-white');
    }
    
    renderizarGrupos();
}

// Tornar função acessível globalmente
window.limparFiltros = limparFiltros;

// Inicializar observadores de animação
function inicializarObservadores() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.observe-section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
}

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    // Carregar grupos
    carregarGrupos();
    
    // Event listener para busca
    const searchInput = document.getElementById('search-grupos');
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
});

// Function to highlight the active menu item
function highlightActiveMenu() {
    // Remove active class from all mobile menu links
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu-link');
    mobileMenuLinks.forEach(link => {
        link.classList.remove('text-accent', 'font-semibold');
        link.classList.add('text-white');
    });
    
    // Add active class to Grupos de Conexão link (mobile)
    const gruposMobileLink = document.querySelector('.mobile-menu-link[href="grupos-conexao.html"]');
    if (gruposMobileLink) {
        gruposMobileLink.classList.remove('text-white');
        gruposMobileLink.classList.add('text-accent', 'font-semibold');
    }
} 