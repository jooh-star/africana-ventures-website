document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        mirror: false,
        offset: 120
    });

    // Hero Section Slider Functionality
    let currentSlide = 0;
    const slides = document.querySelectorAll('.slide');
    const totalSlides = slides.length;
    const prevButton = document.getElementById('prev-slide');
    const nextButton = document.getElementById('next-slide');

    // Initialize slider
    function initializeSlider() {
        if (slides.length === 0) return;
        
        // Hide all slides initially
        slides.forEach((slide, index) => {
            slide.style.opacity = index === 0 ? '1' : '0';
            slide.style.zIndex = index === 0 ? '10' : '1';
        });
    }

    // Show specific slide
    function showSlide(index) {
        if (slides.length === 0) return;
        
        // Hide current slide
        slides[currentSlide].style.opacity = '0';
        slides[currentSlide].style.zIndex = '1';
        
        // Update current slide index
        currentSlide = (index + totalSlides) % totalSlides;
        
        // Show new slide
        slides[currentSlide].style.opacity = '1';
        slides[currentSlide].style.zIndex = '10';
        
        // Add slide-in animation
        slides[currentSlide].style.transform = 'translateX(0)';
    }

    // Auto-advance slider
    function autoAdvanceSlider() {
        showSlide(currentSlide + 1);
    }

    // Initialize slider
    initializeSlider();

    // Event listeners for navigation buttons
    if (prevButton) {
        prevButton.addEventListener('click', () => {
            showSlide(currentSlide - 1);
        });
    }

    if (nextButton) {
        nextButton.addEventListener('click', () => {
            showSlide(currentSlide + 1);
        });
    }

    // Auto-advance every 5 seconds
    setInterval(autoAdvanceSlider, 5000);

    // Parallax effect for hero background images
    function addParallaxEffect() {
        const heroImages = document.querySelectorAll('.slide .bg-cover');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallax = scrolled * 0.5;
            
            heroImages.forEach(image => {
                image.style.transform = `translateY(${parallax}px) scale(1.1)`;
            });
        });
    }

    // Initialize parallax effect
    addParallaxEffect();

    // Add hover effects for expertise cards
    const expertiseCards = document.querySelectorAll('.expertise-card');
    if (expertiseCards.length > 0) {
        expertiseCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.classList.add('shadow-gold/30');
                card.style.transform = 'scale(1.05) rotateY(5deg)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.classList.remove('shadow-gold/30');
                card.style.transform = 'scale(1) rotateY(0deg)';
            });
        });
    }

    // Add hover effects for approach cards
    const approachCards = document.querySelectorAll('.approach-cards-container .group');
    if (approachCards.length > 0) {
        approachCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-10px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
            });
        });
    }

    // Initialize Swiper for split-screen section
    if (typeof Swiper !== 'undefined') {
        const splitScreenSwiper = new Swiper('.split-screen-slider', {
            slidesPerView: 1,
            spaceBetween: 0,
            loop: true,
            autoplay: {
                delay: 4000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            effect: 'fade',
            fadeEffect: {
                crossFade: true
            }
        });
    }

    // Floating elements animation
    function initFloatingAnimations() {
        const floatingElements = document.querySelectorAll('.floating-element, .floating-element-reverse, .floating-element-slow, .floating-element-slow-reverse');
        
        floatingElements.forEach(element => {
            let direction = 1;
            let position = 0;
            const speed = element.classList.contains('slow') ? 0.5 : 1;
            
            function animate() {
                position += direction * speed;
                
                if (position > 20 || position < -20) {
                    direction *= -1;
                }
                
                if (element.classList.contains('reverse')) {
                    element.style.transform = `translateY(${-position}px) rotate(${position * 2}deg)`;
                } else {
                    element.style.transform = `translateY(${position}px) rotate(${-position * 2}deg)`;
                }
                
                requestAnimationFrame(animate);
            }
            
            animate();
        });
    }

    // Initialize floating animations
    initFloatingAnimations();

    // CTA button glow effect
    const ctaButtons = document.querySelectorAll('.cta-button-glow');
    ctaButtons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            button.style.boxShadow = '0 0 30px rgba(218, 165, 32, 1)';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.boxShadow = '0 0 15px rgba(218, 165, 32, 0.7)';
        });
    });

    // Smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Simple Expertise Cards Functionality
    function initializeExpertiseCards() {
        const expertiseCards = document.querySelectorAll('.expertise-card');
        
        if (expertiseCards.length === 0) {
            console.log('No expertise cards found');
            return;
        }
        
        console.log('Initializing expertise cards:', expertiseCards.length);
        
        expertiseCards.forEach((card, index) => {
            // Add staggered animation delay
            card.style.animationDelay = `${index * 0.1}s`;
            
            // Enhanced hover effects
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-8px) scale(1.02)';
                card.style.zIndex = '10';
                
                // Add glow effect
                card.style.boxShadow = `
                    0 20px 40px rgba(147, 51, 234, 0.3),
                    0 10px 20px rgba(219, 39, 119, 0.2),
                    inset 0 1px 0 rgba(255, 255, 255, 0.1)
                `;
                
                // Rotate the icon
                const icon = card.querySelector('.group-hover\\:rotate-12');
                if (icon) {
                    icon.style.transform = 'rotate(12deg)';
                }
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
                card.style.zIndex = '';
                card.style.boxShadow = '';
                
                // Reset icon rotation
                const icon = card.querySelector('.group-hover\\:rotate-12');
                if (icon) {
                    icon.style.transform = 'rotate(0deg)';
                }
            });
            
            // Button interaction
            const button = card.querySelector('button');
            if (button) {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    console.log(`Clicked on ${card.querySelector('h3')?.textContent || 'Unknown'} expertise`);
                    
                    // Add click animation
                    button.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        button.style.transform = 'scale(1)';
                    }, 150);
                });
            }
        });
    }
    
    // Initialize expertise cards
    initializeExpertiseCards();
    
    // Enhanced scroll animations
    function initializeScrollAnimations() {
        const cards = document.querySelectorAll('.expertise-card');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                } else {
                    entry.target.style.opacity = '0.3';
                    entry.target.style.transform = 'translateY(20px)';
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        });
        
        cards.forEach(card => {
            // Set initial state
            card.style.opacity = '0.3';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            
            observer.observe(card);
        });
    }
    
    // Initialize scroll animations
    setTimeout(initializeScrollAnimations, 500);

    console.log('Services page animations initialized successfully!');
});
