document.addEventListener('DOMContentLoaded', function() {

    // Navbar scroll effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }
    });

    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });

    // Core Focus Area Image Overlay Effect
    const coreFocusSection = document.getElementById('core-focus-area');
    const coreFocusImageOverlay = document.getElementById('core-focus-image-overlay');

    if (coreFocusSection && coreFocusImageOverlay) {
        const observerOptions = {
            root: null, // Use the viewport as the root
            rootMargin: '0px',
            threshold: 0.1 // Trigger when 10% of the section is visible
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    coreFocusImageOverlay.classList.remove('opacity-100');
                    coreFocusImageOverlay.classList.add('opacity-0');
                } else {
                    coreFocusImageOverlay.classList.remove('opacity-0');
                    coreFocusImageOverlay.classList.add('opacity-100');
                }
            });
        }, observerOptions);

        observer.observe(coreFocusSection);
    }

});