'use strict';

// IBAN fixo - ALTERE AQUI
const IBAN = 'PT50 0023 0000 45717538317 94';

// Função simples para copiar
function copyIBAN() {
    const copyBtn = document.getElementById('copyBtn');
    const successMessage = document.getElementById('successMessage');
    
    // Copiar IBAN fixo (não o conteúdo do DOM)
    navigator.clipboard.writeText(IBAN).then(function() {
        // Feedback visual
        successMessage.classList.add('show');
        copyBtn.innerHTML = '<i class="fas fa-check"></i> Copiado!';
        copyBtn.classList.add('copied');
        
        // Reset após 3 segundos
        setTimeout(function() {
            successMessage.classList.remove('show');
            copyBtn.innerHTML = '<i class="fas fa-copy"></i> Copiar IBAN';
            copyBtn.classList.remove('copied');
        }, 3000);
        
    }).catch(function(err) {
        console.error('Erro ao copiar: ', err);
        alert('Erro ao copiar o IBAN. Tente novamente.');
    });
}

// Proteção simples: sempre mostrar o IBAN correto
function ensureCorrectIBAN() {
    const ibanElement = document.getElementById('ibanDisplay');
    if (ibanElement.textContent !== IBAN) {
        ibanElement.textContent = IBAN;
    }
}

// Verificar a cada segundo (simples e eficaz)
setInterval(ensureCorrectIBAN, 1000);

// Verificar ao carregar a página
document.addEventListener('DOMContentLoaded', function() {
    ensureCorrectIBAN();
});

// Proteção básica contra clique direito
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});

// Proteção básica contra teclas de debug
document.addEventListener('keydown', function(e) {
    if (e.key === 'F12' || 
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        (e.ctrlKey && e.key === 'u')) {
        e.preventDefault();
    }
});
