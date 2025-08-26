document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        mirror: false,
        offset: 120
    });

    // Testimonial Carousel Functionality
    function initializeTestimonialCarousel() {
        const track = document.getElementById('testimonialTrack');
        const prevBtn = document.getElementById('testimonial-prev');
        const nextBtn = document.getElementById('testimonial-next');
        const dots = document.querySelectorAll('.testimonial-dot');
        const slides = document.querySelectorAll('.testimonial-slide');
        
        if (!track || slides.length === 0) {
            console.log('Testimonial carousel elements not found');
            return;
        }
        
        let currentSlide = 0;
        const totalSlides = slides.length;
        
        console.log('Initializing testimonial carousel with', totalSlides, 'slides');
        
        // Update carousel position
        function updateCarousel() {
            const translateX = -currentSlide * 100;
            track.style.transform = `translateX(${translateX}%)`;
            
            // Update dots
            dots.forEach((dot, index) => {
                if (index === currentSlide) {
                    dot.classList.add('active', 'bg-gold');
                    dot.classList.remove('bg-white/30');
                } else {
                    dot.classList.remove('active', 'bg-gold');
                    dot.classList.add('bg-white/30');
                }
            });
            
            // Update button states
            if (prevBtn) prevBtn.disabled = currentSlide === 0;
            if (nextBtn) nextBtn.disabled = currentSlide === totalSlides - 1;
        }
        
        // Navigate to specific slide
        function goToSlide(slideIndex) {
            currentSlide = Math.max(0, Math.min(slideIndex, totalSlides - 1));
            updateCarousel();
        }
        
        // Previous slide
        function prevSlide() {
            if (currentSlide > 0) {
                goToSlide(currentSlide - 1);
            }
        }
        
        // Next slide
        function nextSlide() {
            if (currentSlide < totalSlides - 1) {
                goToSlide(currentSlide + 1);
            }
        }
        
        // Event listeners
        if (prevBtn) {
            prevBtn.addEventListener('click', prevSlide);
        }
        if (nextBtn) {
            nextBtn.addEventListener('click', nextSlide);
        }
        
        // Dot navigation
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                goToSlide(index);
            });
        });
        
        // Touch/swipe support
        let startX = 0;
        let isDragging = false;
        
        track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
        });
        
        track.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
        });
        
        track.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            
            const endX = e.changedTouches[0].clientX;
            const diffX = startX - endX;
            
            if (Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
            }
            
            isDragging = false;
        });
        
        // Auto-play functionality
        let autoPlayInterval;
        function startAutoPlay() {
            autoPlayInterval = setInterval(() => {
                if (currentSlide >= totalSlides - 1) {
                    goToSlide(0); // Loop back to start
                } else {
                    nextSlide();
                }
            }, 8000); // Change slide every 8 seconds
        }
        
        function stopAutoPlay() {
            clearInterval(autoPlayInterval);
        }
        
        // Start auto-play and pause on hover
        startAutoPlay();
        track.addEventListener('mouseenter', stopAutoPlay);
        track.addEventListener('mouseleave', startAutoPlay);
        
        // Initialize
        updateCarousel();
    }

    // FAQ Accordion Functionality
    function initializeAccordion() {
        const accordionHeaders = document.querySelectorAll('.accordion-header');
        
        accordionHeaders.forEach(header => {
            header.addEventListener('click', () => {
                const content = header.nextElementSibling;
                const icon = header.querySelector('i');
                const isActive = !content.classList.contains('hidden');
                
                // Close all other accordions
                accordionHeaders.forEach(otherHeader => {
                    if (otherHeader !== header) {
                        const otherContent = otherHeader.nextElementSibling;
                        const otherIcon = otherHeader.querySelector('i');
                        otherContent.classList.add('hidden');
                        otherIcon.style.transform = 'rotate(0deg)';
                    }
                });
                
                // Toggle current accordion
                if (isActive) {
                    content.classList.add('hidden');
                    icon.style.transform = 'rotate(0deg)';
                } else {
                    content.classList.remove('hidden');
                    icon.style.transform = 'rotate(180deg)';
                }
            });
        });
    }

    // Timeline Animation on Scroll
    function initializeTimelineAnimation() {
        const timelineItems = document.querySelectorAll('.timeline-item');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '0px 0px -100px 0px'
        });
        
        timelineItems.forEach(item => {
            observer.observe(item);
        });
    }

    // Principle Cards Interactive Effects
    function initializePrincipleCards() {
        const principleCards = document.querySelectorAll('.principle-card');
        const descriptionContainer = document.getElementById('principle-description-enhanced');
        const titleElement = document.getElementById('principle-title-enhanced');
        const descriptionText = document.getElementById('principle-description-text');
        
        if (!descriptionContainer) return;
        
        const principleDescriptions = {
            innovation: {
                title: 'Innovation at Our Core',
                description: 'We embrace creativity and cutting-edge technology to develop forward-thinking solutions that transform the agricultural sector. Our innovative approach drives sustainable change and creates lasting impact for farming communities.'
            },
            integrity: {
                title: 'Unwavering Integrity',
                description: 'We conduct all our business with honesty, transparency, and a strong ethical foundation. Trust is the cornerstone of our relationships with farmers, partners, and stakeholders across East Africa.'
            },
            sustainability: {
                title: 'Environmental Stewardship',
                description: 'We are committed to promoting environmentally responsible practices that ensure long-term agricultural growth while protecting natural resources for future generations.'
            },
            empowerment: {
                title: 'Community Empowerment',
                description: 'We strive to equip smallholder farmers and communities with the tools, knowledge, and resources they need to succeed and thrive in the modern agricultural landscape.'
            },
            collaboration: {
                title: 'Collaborative Partnerships',
                description: 'We believe in building strong partnerships with farmers, stakeholders, and communities to achieve shared success and create meaningful, sustainable change.'
            },
            impact: {
                title: 'Creating Lasting Impact',
                description: 'Dedicated to transforming agriculture and creating meaningful, long-term positive change that benefits farmers, communities, and the broader agricultural ecosystem.'
            }
        };
        
        principleCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                const principle = card.dataset.principle;
                const info = principleDescriptions[principle];
                
                if (info && titleElement && descriptionText) {
                    titleElement.textContent = info.title;
                    descriptionText.textContent = info.description;
                    
                    // Add active state to card
                    principleCards.forEach(c => c.classList.remove('active'));
                    card.classList.add('active');
                }
            });
        });
        
        // Reset to default on mouse leave from container
        const principlesContainer = document.querySelector('.principles-container');
        if (principlesContainer) {
            principlesContainer.addEventListener('mouseleave', () => {
                if (titleElement && descriptionText) {
                    titleElement.textContent = 'Our Guiding Principles';
                    descriptionText.textContent = 'Hover over our value cards to discover the core principles that drive our mission to transform agricultural communities across East Africa. These values not only guide our daily interactions but also ensure that we remain focused on delivering meaningful, long-term impact.';
                }
                principleCards.forEach(c => c.classList.remove('active'));
            });
        }
    }

    // Partners Logo Marquee Animation
    function initializePartnersMarquee() {
        const marquee = document.querySelector('.logo-marquee');
        if (!marquee) return;
        
        // Add CSS animation for continuous scroll
        marquee.style.animation = 'scroll 30s linear infinite';
        
        // Add CSS keyframes if not already present
        if (!document.querySelector('#marquee-keyframes')) {
            const style = document.createElement('style');
            style.id = 'marquee-keyframes';
            style.textContent = `
                @keyframes scroll {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Pause on hover
        marquee.addEventListener('mouseenter', () => {
            marquee.style.animationPlayState = 'paused';
        });
        
        marquee.addEventListener('mouseleave', () => {
            marquee.style.animationPlayState = 'running';
        });
    }

    // Contact Form Enhancement
    function initializeContactForm() {
        const form = document.getElementById('contactForm');
        if (!form) return;
        
        const inputs = form.querySelectorAll('input, textarea');
        
        // Floating label effect
        inputs.forEach(input => {
            const label = input.nextElementSibling;
            if (!label) return;
            
            function updateLabel() {
                if (input.value.trim() !== '' || input === document.activeElement) {
                    label.style.transform = 'translateY(-1.5rem) scale(0.8)';
                    label.style.color = '#DAA520';
                } else {
                    label.style.transform = 'translateY(0) scale(1)';
                    label.style.color = 'rgba(255, 255, 255, 0.7)';
                }
            }
            
            input.addEventListener('focus', updateLabel);
            input.addEventListener('blur', updateLabel);
            input.addEventListener('input', updateLabel);
            
            // Initial state
            updateLabel();
        });
        
        // Form submission with loading state
        form.addEventListener('submit', (e) => {
            const submitBtn = form.querySelector('.submit-btn');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Sending...';
                
                // Re-enable after 3 seconds (adjust based on actual form processing)
                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = 'Send Message';
                }, 3000);
            }
        });
    }

    // Smooth Scrolling for Anchor Links
    function initializeSmoothScrolling() {
        const anchorLinks = document.querySelectorAll('a[href^="#"]');
        
        anchorLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    e.preventDefault();
                    
                    const offsetTop = targetElement.offsetTop - 80; // Account for fixed header
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // Business Model Cards Hover Effects
    function initializeBusinessModelCards() {
        const businessCards = document.querySelectorAll('.business-model-card');
        
        businessCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-10px) scale(1.02)';
                card.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.15)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
                card.style.boxShadow = '';
            });
        });
    }

    // Initialize all components
    initializeTestimonialCarousel();
    initializeAccordion();
    initializeTimelineAnimation();
    initializePrincipleCards();
    initializePartnersMarquee();
    initializeContactForm();
    initializeSmoothScrolling();
    initializeBusinessModelCards();

    console.log('About page JavaScript initialized successfully!');
});