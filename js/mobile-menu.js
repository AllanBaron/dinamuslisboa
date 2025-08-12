// ========================================
// MOBILE-MENU.JS - Menu Mobile Moderno
// ========================================
// Este arquivo contém a funcionalidade do menu mobile que é usada em TODAS as páginas

// ========================================
// MOBILE MENU - Toggle Moderno
// ========================================
function initializeMobileMenu() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const hamburgerMenu = document.querySelector('.hamburger-menu');

    if (mobileMenuButton && mobileMenu && hamburgerMenu) {
        let isMenuOpen = false;
        
        mobileMenuButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            isMenuOpen = !isMenuOpen;
            
            // Toggle hamburger animation
            hamburgerMenu.classList.toggle('active');
            
            // Toggle menu visibility
            mobileMenu.classList.toggle('active');
            
            // Toggle body scroll
            document.body.classList.toggle('menu-open');
            
            // Add/remove event listener for closing menu on escape
            if (isMenuOpen) {
                document.addEventListener('keydown', handleEscapeKey);
            } else {
                document.removeEventListener('keydown', handleEscapeKey);
            }
        });
        
        // Close menu when clicking on a link
        const mobileMenuLinks = mobileMenu.querySelectorAll('a');
        
        mobileMenuLinks.forEach((link) => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                const target = link.getAttribute('target');
                
                // Allow external links (like Instagram) to work normally
                if (href.startsWith('http') || target === '_blank') {
                    // Don't prevent default for external links
                    // Just close the menu and let the link work
                    closeMobileMenu();
                    return;
                }
                
                // For internal links, prevent default and handle navigation
                e.preventDefault();
                e.stopPropagation();
                
                // Close menu first
                closeMobileMenu();
                
                // Handle navigation after menu closes
                setTimeout(() => {
                    if (href.startsWith('#')) {
                        const targetElement = document.querySelector(href);
                        if (targetElement) {
                            const targetPosition = targetElement.offsetTop - 80;
                            smoothScrollTo(targetPosition, 800);
                        }
                    } else if (!href.startsWith('http')) {
                        window.location.href = href;
                    }
                }, 300);
            });
        });
        
        // Close menu when clicking outside
        mobileMenu.addEventListener('click', (e) => {
            if (e.target === mobileMenu) {
                closeMobileMenu();
            }
        });
        
        function closeMobileMenu() {
            isMenuOpen = false;
            hamburgerMenu.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
            document.removeEventListener('keydown', handleEscapeKey);
        }
        
        function handleEscapeKey(e) {
            if (e.key === 'Escape') {
                closeMobileMenu();
            }
        }
    }
}

// Custom smooth scroll function with easing
function smoothScrollTo(targetPosition, duration = 800) {
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    // Add visual feedback - disable scroll during animation
    document.body.style.overflow = 'hidden';

    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = easeInOutCubic(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) {
            requestAnimationFrame(animation);
        } else {
            // Re-enable scroll after animation
            document.body.style.overflow = '';
        }
    }

    requestAnimationFrame(animation);
}

// Easing function for smooth animation
function easeInOutCubic(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t * t + b;
    t -= 2;
    return c / 2 * (t * t * t + 2) + b;
}

// Initialize mobile menu when DOM is ready
document.addEventListener('DOMContentLoaded', initializeMobileMenu);

// ========================================
// API DO MENU MOBILE - Funções expostas
// ========================================
window.MobileMenu = {
    initializeMobileMenu,
    smoothScrollTo,
    easeInOutCubic
}; 