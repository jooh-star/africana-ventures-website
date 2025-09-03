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

    // Testimonial Modal Functionality
    const testimonialModal = document.getElementById('testimonialModal');
    const openTestimonialModal = document.getElementById('openTestimonialModal');
    const closeTestimonialModal = document.getElementById('closeTestimonialModal');
    const testimonialForm = document.getElementById('testimonialForm');
    const testimonialSuccess = document.getElementById('testimonialSuccess');
    const testimonialError = document.getElementById('testimonialError');
    const closeSuccessMessage = document.getElementById('closeSuccessMessage');
    const retryTestimonial = document.getElementById('retryTestimonial');

    const modalContent = testimonialModal.querySelector('.relative.bg-white');

    // Open modal
    if (openTestimonialModal && testimonialModal && modalContent) {
        openTestimonialModal.addEventListener('click', () => {
            testimonialModal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
            
            // Animate modal in
            setTimeout(() => {
                modalContent.classList.remove('opacity-0', 'scale-95');
            }, 50); // Small delay to ensure transition is applied

            const firstInput = modalContent.querySelector('input');
            if (firstInput) firstInput.focus();
        });
    }

    // Close modal function
    const closeTestimonialModalFunc = () => {
        if (testimonialModal && modalContent) {
            // Animate modal out
            modalContent.classList.add('opacity-0', 'scale-95');
            
            setTimeout(() => {
                testimonialModal.classList.add('hidden');
                document.body.style.overflow = '';

                // Reset form and messages
                testimonialForm.classList.remove('hidden');
                testimonialSuccess.classList.add('hidden');
                testimonialError.classList.add('hidden');
                testimonialForm.reset();
                
                // Reset rating stars visual state
                const ratingLabels = document.querySelectorAll('label[for^="rating"]');
                ratingLabels.forEach(label => {
                    label.classList.remove('text-gold');
                    label.classList.add('text-gray-300');
                });
                
                // Uncheck all rating inputs
                const ratingInputs = document.querySelectorAll('input[name="rating"]');
                ratingInputs.forEach(input => {
                    input.checked = false;
                });
            }, 300); // Match transition duration
        }
    };

    // Close modal events
    if (closeTestimonialModal) {
        closeTestimonialModal.addEventListener('click', closeTestimonialModalFunc);
    }

    if (closeSuccessMessage) {
        closeSuccessMessage.addEventListener('click', closeTestimonialModalFunc);
    }

    // Close when clicking outside
    if (testimonialModal) {
        testimonialModal.addEventListener('click', (e) => {
            if (e.target === testimonialModal) {
                closeTestimonialModalFunc();
            }
        });
    }

    // Handle form submission
    if (testimonialForm) {
        testimonialForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(testimonialForm);
            
            try {
                const response = await fetch('/submit-testimonial', {
                    method: 'POST',
                    body: formData
                });
                
                const result = await response.json();
                
                if (result.success) {
                    // Show success message
                    testimonialForm.classList.add('hidden');
                    testimonialSuccess.classList.remove('hidden');
                } else {
                    // Show error message
                    testimonialForm.classList.add('hidden');
                    testimonialError.classList.remove('hidden');
                }
            } catch (error) {
                // Show error message
                testimonialForm.classList.add('hidden');
                testimonialError.classList.remove('hidden');
            }
        });
    }

    // Retry button
    if (retryTestimonial) {
        retryTestimonial.addEventListener('click', () => {
            testimonialError.classList.add('hidden');
            testimonialForm.classList.remove('hidden');
        });
    }

    // Rating stars functionality
    const ratingInputs = document.querySelectorAll('input[name="rating"]');
    const ratingLabels = document.querySelectorAll('label[for^="rating"]');
    
    if (ratingLabels.length > 0) {
        ratingLabels.forEach((label, index) => {
            label.addEventListener('click', () => {
                // Get the value of the clicked star
                const input = document.getElementById(label.getAttribute('for'));
                const value = parseInt(input.value);
                
                // Update all stars up to the clicked one
                for (let i = 0; i < ratingLabels.length; i++) {
                    const currentInput = document.getElementById(ratingLabels[i].getAttribute('for'));
                    const currentValue = parseInt(currentInput.value);
                    
                    if (currentValue <= value) {
                        ratingLabels[i].classList.remove('text-gray-300');
                        ratingLabels[i].classList.add('text-gold');
                    } else {
                        ratingLabels[i].classList.remove('text-gold');
                        ratingLabels[i].classList.add('text-gray-300');
                    }
                }
                
                // Check the corresponding radio input
                input.checked = true;
            });
            
            label.addEventListener('mouseover', () => {
                // Get the value of the hovered star
                const input = document.getElementById(label.getAttribute('for'));
                const value = parseInt(input.value);
                
                // Highlight stars up to the hovered one
                for (let i = 0; i < ratingLabels.length; i++) {
                    const currentInput = document.getElementById(ratingLabels[i].getAttribute('for'));
                    const currentValue = parseInt(currentInput.value);
                    
                    if (currentValue <= value) {
                        ratingLabels[i].classList.remove('text-gray-300');
                        ratingLabels[i].classList.add('text-gold');
                    } else {
                        ratingLabels[i].classList.remove('text-gold');
                        ratingLabels[i].classList.add('text-gray-300');
                    }
                }
            });
            
            label.addEventListener('mouseout', () => {
                // Reset to actual selection on mouseout
                ratingInputs.forEach((input, i) => {
                    if (input.checked) {
                        const value = parseInt(input.value);
                        for (let j = 0; j < ratingLabels.length; j++) {
                            const currentInput = document.getElementById(ratingLabels[j].getAttribute('for'));
                            const currentValue = parseInt(currentInput.value);
                            
                            if (currentValue <= value) {
                                ratingLabels[j].classList.remove('text-gray-300');
                                ratingLabels[j].classList.add('text-gold');
                            } else {
                                ratingLabels[j].classList.remove('text-gold');
                                ratingLabels[j].classList.add('text-gray-300');
                            }
                        }
                    }
                });
                
                // If no rating is selected, reset all stars
                const checkedInput = document.querySelector('input[name="rating"]:checked');
                if (!checkedInput) {
                    ratingLabels.forEach(label => {
                        label.classList.remove('text-gold');
                        label.classList.add('text-gray-300');
                    });
                }
            });
        });
    }

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && testimonialModal && !testimonialModal.classList.contains('hidden')) {
            closeTestimonialModalFunc();
        }
    });

});