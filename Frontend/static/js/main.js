document.addEventListener('DOMContentLoaded', function() {

    // Navbar scroll effect (transparent -> dark green)
    const navbar = document.getElementById('navbar');
    if (navbar) {
        const applyNavbarState = () => {
            const scrolled = window.scrollY > 50;
            navbar.classList.toggle('bg-dark-green', scrolled);
            navbar.classList.toggle('shadow-lg', scrolled);
            navbar.classList.toggle('bg-transparent', !scrolled);
        };
        // Set initial state and listen to scroll
        applyNavbarState();
        window.addEventListener('scroll', applyNavbarState, { passive: true });
    }

    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

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