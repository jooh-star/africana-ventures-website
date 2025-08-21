// Frontend/static/js/core-values.js

document.addEventListener('DOMContentLoaded', function() {
    const coreValuesSection = document.querySelector('.core-values-section');
    const valueCards = document.querySelectorAll('.value-card');

    if (coreValuesSection && valueCards.length > 0) {
        const observerOptions = {
            root: null, // Use the viewport as the root
            rootMargin: '0px',
            threshold: 0.5 // Trigger when 50% of the target is visible
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Corrected: Use dataset.bgColor for camelCase conversion from data-bg-color
                    const bgColor = entry.target.dataset.bgColor; 
                    if (bgColor) {
                        coreValuesSection.style.backgroundColor = bgColor;
                    }
                }
            });
        }, observerOptions);

        valueCards.forEach(card => {
            observer.observe(card);
        });
    }
});
