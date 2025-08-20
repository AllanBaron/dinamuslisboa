/**
 * Modal da Conferência de Inauguração
 * Gerencia a exibição e comportamento do modal pop-up
 */

class ConferenciaModal {
    constructor() {
        this.modal = document.getElementById('conferenciaModal');
        this.modalContent = document.getElementById('modalContent');
        this.modalOverlay = document.getElementById('modalOverlay');
        this.closeButton = document.getElementById('closeModal');
        this.isOpen = false;
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.setupAutoShow();
    }
    
    bindEvents() {
        // Fechar modal com botão X
        this.closeButton.addEventListener('click', () => this.close());
        
        // Fechar modal clicando no overlay
        this.modalOverlay.addEventListener('click', () => this.close());
        
        // Fechar modal com tecla ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });
        
        // Prevenir scroll do body quando modal estiver aberto
        this.modal.addEventListener('wheel', (e) => {
            if (this.isOpen) {
                e.preventDefault();
            }
        });
        
        // Listener global para botões que abrem o modal
        document.addEventListener('click', (e) => {
            if (e.target.id === 'showConferenciaModal' || e.target.id === 'showConferenciaModalMobile') {
                this.open();
            }
        });
    }
    
    open() {
        if (this.isOpen) return;
        
        this.isOpen = true;
        this.modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        
                    // Animar entrada com delay para suavizar
            setTimeout(() => {
                this.modalContent.classList.remove('scale-90', 'opacity-0');
                this.modalContent.classList.add('scale-100', 'opacity-100');
            }, 100);
        
        // Adicionar classe para animação CSS
        this.modalContent.classList.add('modal-enter');
        
        // Focar no modal para acessibilidade
        this.modal.setAttribute('aria-hidden', 'false');
        this.closeButton.focus();
        
        // Disparar evento customizado
        this.modal.dispatchEvent(new CustomEvent('modalOpened'));
    }
    
    close() {
        if (!this.isOpen) return;
        
        this.isOpen = false;
        
        // Animar saída
        this.modalContent.classList.add('scale-90', 'opacity-0');
        this.modalContent.classList.remove('scale-100', 'opacity-100');
        
        // Adicionar classe para animação CSS
        this.modalContent.classList.add('modal-exit');
        
        setTimeout(() => {
            this.modal.classList.add('hidden');
            document.body.style.overflow = 'auto';
            this.modalContent.classList.remove('modal-enter', 'modal-exit');
        }, 700);
        
        // Atualizar acessibilidade
        this.modal.setAttribute('aria-hidden', 'true');
        
        // Disparar evento customizado
        this.modal.dispatchEvent(new CustomEvent('modalClosed'));
    }
    
    setupAutoShow() {
        // Mostrar modal automaticamente após 5 segundos
        setTimeout(() => {
            this.open();
        }, 5000);
        
        // Mostrar modal após scroll de 50% da página (opcional, para casos onde o modal foi fechado)
        let hasShownOnScroll = false;
        window.addEventListener('scroll', () => {
            if (!hasShownOnScroll && !this.isOpen) {
                const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
                if (scrollPercent > 50) {
                    this.open();
                    hasShownOnScroll = true;
                }
            }
        });
    }
    
    hasUserInteracted() {
        // Verificar se o usuário já clicou, scrollou ou digitou
        return sessionStorage.getItem('userInteracted') === 'true';
    }
    
    // Método público para abrir o modal programaticamente
    show() {
        this.open();
    }
    
    // Método público para fechar o modal programaticamente
    hide() {
        this.close();
    }
    
    // Método para verificar se o modal está aberto
    isModalOpen() {
        return this.isOpen;
    }
}

// Marcar interação do usuário
['click', 'scroll', 'keydown', 'touchstart'].forEach(event => {
    document.addEventListener(event, () => {
        sessionStorage.setItem('userInteracted', 'true');
    }, { once: true });
});

// Inicializar modal quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    window.conferenciaModal = new ConferenciaModal();
});

// Exportar para uso global
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ConferenciaModal;
}
