// ========================================
// UPDATE CHECKER - Sistema de Verificação de Atualizações
// ========================================
// Este arquivo verifica se há novas versões disponíveis e gerencia o processo de atualização

class UpdateChecker {
    constructor() {
        this.currentVersion = null;
        this.latestVersion = null;
        this.isUpdating = false;
        this.init();
    }

    async init() {
        try {
            // Verificar se há uma versão salva no localStorage
            this.currentVersion = localStorage.getItem('dinamus_version');
            
            // Buscar a versão mais recente do version.json
            await this.checkForUpdates();
            
            // Se não há versão salva, salvar a atual
            if (!this.currentVersion) {
                this.saveCurrentVersion();
            }
        } catch (error) {
            console.error('Erro ao inicializar UpdateChecker:', error);
        }
    }

    async checkForUpdates() {
        try {
            // Buscar o arquivo version.json com timestamp para evitar cache
            const response = await fetch(`version.json?t=${Date.now()}`);
            if (!response.ok) {
                throw new Error('Falha ao buscar version.json');
            }
            
            const versionData = await response.json();
            this.latestVersion = versionData.version;
            
            // Verificar se há uma nova versão
            if (this.currentVersion && this.currentVersion !== this.latestVersion) {
                this.showUpdateModal();
            }
        } catch (error) {
            console.error('Erro ao verificar atualizações:', error);
        }
    }

    showUpdateModal() {
        // Criar o modal de atualização ultra-simplificado
        const modal = document.createElement('div');
        modal.id = 'updateModal';
        modal.className = 'fixed inset-0 z-[9999] bg-black bg-opacity-50 flex items-center justify-center';
        modal.innerHTML = `
            <div class="text-center gap-2 flex flex-col items-center justify-center">
                <p class="text-white text-xl font-bold">Nova versão disponível</p>
                <div class="flex flex-row items-center justify-center gap-3 mt-2">
                    <div class="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent mx-auto mb-0.5"></div>
                    <p class="text-white text-sm">Atualizando...</p>
                </div>
            </div>
        `;

        // Adicionar o modal ao DOM
        document.body.appendChild(modal);
        
        // Iniciar o processo de atualização
        this.startUpdate();
    }

    async startUpdate() {
        this.isUpdating = true;
        
        try {
            // Aguardar um pouco para mostrar o modal
            await this.delay(1500);
            
            // Limpar todos os caches possíveis
            await this.clearAllCaches();
            
            // Salvar a nova versão
            this.saveCurrentVersion();
            
            // Recarregar a página
            window.location.reload();
            
        } catch (error) {
            console.error('Erro durante a atualização:', error);
            // Em caso de erro, recarregar mesmo assim
            window.location.reload();
        }
    }

    async clearAllCaches() {
        try {
            // 1. Limpar cache do Service Worker
            if ('serviceWorker' in navigator) {
                const registrations = await navigator.serviceWorker.getRegistrations();
                for (let registration of registrations) {
                    await registration.unregister();
                }
            }

            // 2. Limpar caches do navegador (incluindo JS, CSS e imagens)
            if ('caches' in window) {
                const cacheNames = await caches.keys();
                
                for (let cacheName of cacheNames) {
                    const cache = await caches.open(cacheName);
                    const requests = await cache.keys();
                    
                    // Verificar e remover recursos específicos
                    let jsCount = 0, cssCount = 0, imgCount = 0;
                    for (let request of requests) {
                        const url = request.url;
                        if (url.includes('.js')) jsCount++;
                        if (url.includes('.css')) cssCount++;
                        if (url.includes('.jpg') || url.includes('.png') || url.includes('.webp') || url.includes('.gif')) imgCount++;
                    }
                    
                    await caches.delete(cacheName);
                }
            }

            // 3. Limpar localStorage (exceto a versão)
            const version = localStorage.getItem('dinamus_version');
            const localStorageKeys = Object.keys(localStorage);
            localStorage.clear();
            if (version) {
                localStorage.setItem('dinamus_version', version);
            }

            // 4. Limpar sessionStorage
            const sessionStorageKeys = Object.keys(sessionStorage);
            sessionStorage.clear();

            // 5. Forçar recarregamento de recursos
            this.forceResourceReload();
            
        } catch (error) {
            console.error('❌ Erro ao limpar caches:', error);
        }
    }

    forceResourceReload() {
        // 1. Forçar recarregamento de CSS
        const cssLinks = document.querySelectorAll('link[rel="stylesheet"]');
        let cssUpdated = 0;
        cssLinks.forEach(link => {
            if (link.href.includes('css/') || link.href.includes('styles-min.css')) {
                const originalHref = link.href.split('?')[0];
                link.href = `${originalHref}?v=${this.latestVersion}&t=${Date.now()}`;
                cssUpdated++;
            }
        });
        
        // 2. Forçar recarregamento de JavaScript
        const jsScripts = document.querySelectorAll('script[src]');
        let jsUpdated = 0;
        jsScripts.forEach(script => {
            if (script.src.includes('js/') && !script.src.includes('cdn')) {
                const originalSrc = script.src.split('?')[0];
                script.src = `${originalSrc}?v=${this.latestVersion}&t=${Date.now()}`;
                jsUpdated++;
            }
        });
        
        // 3. Forçar recarregamento de imagens (se necessário)
        const images = document.querySelectorAll('img[src*="img/"]');
        let imgUpdated = 0;
        images.forEach(img => {
            if (img.src.includes('img/')) {
                const originalSrc = img.src.split('?')[0];
                img.src = `${originalSrc}?v=${this.latestVersion}&t=${Date.now()}`;
                imgUpdated++;
            }
        });
    }

    saveCurrentVersion() {
        if (this.latestVersion) {
            localStorage.setItem('dinamus_version', this.latestVersion);
            this.currentVersion = this.latestVersion;
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Método público para verificar atualizações manualmente
    async manualCheck() {
        await this.checkForUpdates();
    }
}

// Inicializar o UpdateChecker quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    window.updateChecker = new UpdateChecker();
    
            // Escutar mensagens do Service Worker para atualizações
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.addEventListener('message', event => {
                if (event.data && event.data.type === 'CACHE_UPDATED') {
                    // Verificar se há nova versão disponível
                    if (window.updateChecker) {
                        window.updateChecker.checkForUpdates();
                    }
                }
            });
        }
});