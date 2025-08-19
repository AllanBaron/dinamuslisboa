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
            // Use requestAnimationFrame for better performance
            requestAnimationFrame(() => {
                entry.target.classList.add('fade-in-section');
                
                // Trigger animations for child elements if they have specific delays
                const childElements = entry.target.querySelectorAll('[style*="animation-delay"]');
                childElements.forEach(child => {
                    const delay = child.style.animationDelay || '0s';
                    const delayValue = parseFloat(delay) * 1000; // Convert to milliseconds
                    
                    setTimeout(() => {
                        child.style.opacity = '1';
                        child.style.transform = 'translateY(0)';
                    }, delayValue);
                });
            });
        }
    });
}, { threshold: 0.1, rootMargin: '50px' });

// Initialize observer when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.observe-section').forEach(section => {
        observer.observe(section);
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
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// ========================================
// API GLOBAL - Funções expostas para uso
// ========================================
window.GlobalUtils = {
    debounce
}; 