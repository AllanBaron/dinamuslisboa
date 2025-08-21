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
        this.cookieName = 'conferenciaModalClosed';
        this.cookieExpiryMinutes = 5; // Mudar para minutos
        
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
    
    // Método para definir cookie
    setCookie(name, value, minutes) { // Mudar parâmetro para minutes
        const expires = new Date();
        expires.setTime(expires.getTime() + (minutes * 60 * 1000)); // Calcular em minutos
        document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
    }
    
    // Método para obter cookie
    getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }
    
    // Método para verificar se deve mostrar o modal
    shouldShowModal() {
        const cookieValue = this.getCookie(this.cookieName);
        if (!cookieValue) return true;
        
        const closedTime = parseInt(cookieValue);
        const currentTime = Date.now();
        const minutesSinceClosed = (currentTime - closedTime) / (1000 * 60); // Calcular em minutos
        
        return minutesSinceClosed >= this.cookieExpiryMinutes; // Comparar com minutos
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
        
        // Definir cookie com timestamp atual
        this.setCookie(this.cookieName, Date.now().toString(), this.cookieExpiryMinutes); // Usar minutos
        
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
        // Verificar se deve mostrar o modal baseado no cookie
        if (this.shouldShowModal()) {
            // Mostrar modal automaticamente após 5 segundos
            setTimeout(() => {
                this.open();
            }, 5000);
        }
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
    
    // Método para limpar o cookie (útil para testes)
    clearCookie() {
        this.setCookie(this.cookieName, '', -1);
    }
}

// Inicializar modal quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    window.conferenciaModal = new ConferenciaModal();
});

// Exportar para uso global
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ConferenciaModal;
}
