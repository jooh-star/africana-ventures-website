// Use a single DOMContentLoaded event listener to avoid duplicates
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeServices);
} else {
    initializeServices();
}

function initializeServices() {
    console.log("Services JS Loaded");
    
    // Initialize AOS (Animate On Scroll)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: false,
            mirror: true,
            disable: 'mobile' // Disable on mobile for better performance
        });
    }
    
    // Initialize all components
    initSlider();
    initParallaxEffects();
    initApproachCardsAnimations();
    initExpertiseCarousel();
}

function initExpertiseCarousel() {
    const showcaseSection = document.getElementById('expertise-showcase');
    if (!showcaseSection) {
        console.log("No expertise showcase section found");
        return;
    }
    
    console.log("Initializing expertise carousel");
    
    // Get all carousel elements
    const cards = showcaseSection.querySelectorAll('.expertise-card');
    const indicators = showcaseSection.querySelectorAll('.expertise-indicator');
    const prevBtn = showcaseSection.querySelector('.expertise-prev');
    const nextBtn = showcaseSection.querySelector('.expertise-next');
    const cardsWrapper = showcaseSection.querySelector('.expertise-cards-wrapper');
    
    if (cards.length === 0) {
        console.log("No expertise cards found");
        return;
    }
    
    let currentIndex = 0;
    const totalCards = cards.length;
    
    // Initialize card positions
    updateCardPositions();
    
    // Initialize parallax effect for card images
    initCardParallax();
    
    // Add event listeners for navigation
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            navigateCards('prev');
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            navigateCards('next');
        });
    }
    
    // Add event listeners for indicators
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            goToCard(index);
        });
    });
    
    // Add keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (isElementInViewport(showcaseSection)) {
            if (e.key === 'ArrowLeft') {
                navigateCards('prev');
            } else if (e.key === 'ArrowRight') {
                navigateCards('next');
            }
        }
    });
    
    // Add text animations to active card
    animateActiveCardText();
    
    // Function to navigate cards
    function navigateCards(direction) {
        if (direction === 'prev') {
            currentIndex = (currentIndex - 1 + totalCards) % totalCards;
        } else {
            currentIndex = (currentIndex + 1) % totalCards;
        }
        
        goToCard(currentIndex);
    }
    
    // Function to go to a specific card
    function goToCard(index) {
        currentIndex = index;
        updateCardPositions();
        updateIndicators();
        animateActiveCardText();
    }
    
    // Function to update card positions based on current index
    function updateCardPositions() {
        cards.forEach((card, index) => {
            // Remove all position classes
            card.classList.remove('active', 'prev', 'next');
            card.classList.add('invisible');
            card.classList.remove('opacity-100');
            card.classList.add('opacity-0');
            
            // Add appropriate position class
            if (index === currentIndex) {
                card.classList.add('active', 'visible', 'opacity-100');
                card.classList.remove('invisible', 'opacity-0');
            } else if (index === (currentIndex - 1 + totalCards) % totalCards) {
                card.classList.add('prev', 'visible', 'opacity-100');
                card.classList.remove('invisible', 'opacity-0');
            } else if (index === (currentIndex + 1) % totalCards) {
                card.classList.add('next', 'visible', 'opacity-100');
                card.classList.remove('invisible', 'opacity-0');
            }
        });
    }
    
    // Function to update indicator states
    function updateIndicators() {
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentIndex);
            indicator.classList.toggle('bg-gold', index === currentIndex);
            indicator.classList.toggle('w-12', index === currentIndex);
            indicator.classList.toggle('bg-dark-green/30', index !== currentIndex);
            indicator.classList.toggle('w-3', index !== currentIndex);
        });
    }
    
    // Function to initialize parallax effect for card images
    function initCardParallax() {
        const parallaxWrappers = showcaseSection.querySelectorAll('.expertise-card-media');
        
        parallaxWrappers.forEach(wrapper => {
            const parallaxImage = wrapper.querySelector('.expertise-parallax-image');
            
            if (parallaxImage) {
                wrapper.addEventListener('mousemove', (e) => {
                    // Only apply effect to active card
                    if (!wrapper.closest('.expertise-card').classList.contains('active')) return;
                    
                    const rect = wrapper.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    
                    const xPercent = x / rect.width;
                    const yPercent = y / rect.height;
                    
                    // Calculate movement (smaller values for subtle effect)
                    const moveX = (xPercent - 0.5) * 20;
                    const moveY = (yPercent - 0.5) * 20;
                    
                    // Apply transform
                    parallaxImage.style.transform = `translate(${moveX}px, ${moveY}px)`;
                });
                
                wrapper.addEventListener('mouseleave', () => {
                    // Reset position on mouse leave
                    parallaxImage.style.transform = 'translate(0, 0)';
                    parallaxImage.style.transition = 'transform 0.5s ease-out';
                });
                
                wrapper.addEventListener('mouseenter', () => {
                    parallaxImage.style.transition = 'transform 0.1s ease-out';
                });
            }
        });
    }
    
    // Function to animate text in active card
    function animateActiveCardText() {
        const activeCard = showcaseSection.querySelector('.expertise-card.active');
        if (!activeCard) return;
        
        const title = activeCard.querySelector('.expertise-title');
        const description = activeCard.querySelector('.expertise-description');
        const features = activeCard.querySelectorAll('.expertise-feature');
        
        // Reset animations
        if (title) title.style.opacity = '0';
        if (description) description.style.opacity = '0';
        features.forEach(feature => feature.style.opacity = '0');
        
        // Animate title
        if (title) {
            setTimeout(() => {
                title.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
                title.style.opacity = '1';
                title.style.transform = 'translateY(0)';
            }, 300);
        }
        
        // Animate description
        if (description) {
            setTimeout(() => {
                description.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
                description.style.opacity = '1';
                description.style.transform = 'translateY(0)';
            }, 500);
        }
        
        // Animate features with staggered delay
        features.forEach((feature, index) => {
            setTimeout(() => {
                feature.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
                feature.style.opacity = '1';
                feature.style.transform = 'translateY(0)';
            }, 700 + (index * 200));
        });
    }
    
    // Helper function to check if element is in viewport
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.bottom >= 0
        );
    }
    
    // Auto-rotate cards every 5 seconds
    let autoRotateInterval = setInterval(() => {
        if (!document.hidden && isElementInViewport(showcaseSection)) {
            navigateCards('next');
        }
    }, 5000);
    
    // Clear interval when user interacts with carousel
    const clearAutoRotate = () => {
        clearInterval(autoRotateInterval);
        // Restart after 10 seconds of inactivity
        setTimeout(() => {
            autoRotateInterval = setInterval(() => {
                if (!document.hidden && isElementInViewport(showcaseSection)) {
                    navigateCards('next');
                }
            }, 5000);
        }, 10000);
    };
    
    // Add event listeners to clear auto-rotate
    prevBtn.addEventListener('click', clearAutoRotate);
    nextBtn.addEventListener('click', clearAutoRotate);
    indicators.forEach(indicator => {
        indicator.addEventListener('click', clearAutoRotate);
    });
    
    // Add floating animation to decorative elements
    const floatingElements = showcaseSection.querySelectorAll('.floating-element, .floating-element-reverse, .floating-element-slow, .floating-element-slow-reverse');
    floatingElements.forEach(element => {
        // Animation is handled by CSS
    });
}

// Helper function to create text reveal animation
function createTextRevealAnimation(element) {
    if (!element) return;
    
    try {
        const text = element.textContent;
        if (!text) return;
        
        // Store original text for accessibility
        element.setAttribute('data-original-text', text);
        element.textContent = '';
        element.style.opacity = '1';
        
        // Create observer to trigger animation when element is in view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    try {
                        // Animate each character with a delay
                        for (let i = 0; i < text.length; i++) {
                            const span = document.createElement('span');
                            span.textContent = text[i];
                            span.style.opacity = '0';
                            span.style.display = 'inline-block';
                            span.style.transform = 'translateY(20px)';
                            span.style.transition = `opacity 0.3s ease, transform 0.3s ease`;
                            span.style.transitionDelay = `${i * 30}ms`;
                            
                            element.appendChild(span);
                            
                            // Trigger animation after a small delay
                            setTimeout(() => {
                                if (span && span.style) {
                                    span.style.opacity = '1';
                                    span.style.transform = 'translateY(0)';
                                }
                            }, 100 + (i * 30));
                        }
                    } catch (animError) {
                        console.error('Error during character animation:', animError);
                        // Fallback: restore original text
                        element.textContent = text;
                    }
                    
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(element);
    } catch (error) {
        console.error('Error in text reveal animation:', error);
        // Don't leave element empty if there's an error
        if (element.getAttribute('data-original-text')) {
            element.textContent = element.getAttribute('data-original-text');
        }
    }
}

function initSlider() {
    const slider = document.getElementById('slider');
    if (!slider) {
        console.error("Slider element not found");
        return;
    }
    const slides = slider.querySelectorAll('.slide');
    const prevBtn = document.getElementById('prev-slide');
    const nextBtn = document.getElementById('next-slide');
    const heroSection = document.getElementById('hero-section');

    let currentSlide = 0;
    let slideInterval;

    function showSlide(index) {
        console.log(`Showing slide ${index}`);
        slides.forEach((slide, i) => {
            slide.style.opacity = i === index ? '1' : '0';
        });
    }

    function nextSlide() {
        console.log("Next slide");
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    function prevSlide() {
        console.log("Previous slide");
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    }

    function startSlider() {
        console.log("Starting slider");
        slideInterval = setInterval(nextSlide, 10000);
    }

    function stopSlider() {
        console.log("Stopping slider");
        clearInterval(slideInterval);
    }

    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            stopSlider();
            prevSlide();
            startSlider();
        });

        nextBtn.addEventListener('click', () => {
            stopSlider();
            nextSlide();
            startSlider();
        });
    } else {
        console.error("Prev or Next button not found");
    }
    
    startSlider();
    showSlide(currentSlide);
}

function initParallaxEffects() {
    const heroSection = document.getElementById('hero-section');
    const slider = document.getElementById('slider');
    
    if (!heroSection || !slider) {
        console.error("Hero section or slider not found");
        return;
    }
    
    const slides = slider.querySelectorAll('.slide');
    
    if (heroSection) {
        heroSection.addEventListener('mousemove', (e) => {
            const { clientX: x, clientY: y } = e;
            const { offsetWidth: width, offsetHeight: height } = heroSection;
            const xPercent = (x / width - 0.5) * 2;
            const yPercent = (y / height - 0.5) * 2;

            // Find the active slide (the one with opacity 1)
            let activeSlide = null;
            slides.forEach(slide => {
                if (window.getComputedStyle(slide).opacity === '1') {
                    activeSlide = slide;
                }
            });

            if (activeSlide) {
                const bgCover = activeSlide.querySelector('.bg-cover');
                if (bgCover) {
                    bgCover.style.transform = `translateX(${xPercent * 10}px) translateY(${yPercent * 10}px) scale(1.1)`;
                }
            }
        });
        
        heroSection.addEventListener('mouseleave', () => {
            slides.forEach(slide => {
                const bgCover = slide.querySelector('.bg-cover');
                if (bgCover) {
                    bgCover.style.transform = 'translateX(0) translateY(0) scale(1.05)';
                }
            });
        });
    } else {
        console.error("Hero section not found");
    }
}

function initApproachCardsAnimations() {
    // Get all approach cards
    const approachCards = document.querySelectorAll('.approach-card');
    
    if (approachCards.length === 0) {
        console.log("No approach cards found");
        return;
    }
    
    console.log(`Found ${approachCards.length} approach cards`);
    
    // Add scroll-triggered animations
    approachCards.forEach((card, index) => {
        // Add staggered entrance animation
        setTimeout(() => {
            card.classList.add('visible');
        }, index * 200);
        
        // Add hover effect for image zoom
        const image = card.querySelector('img');
        if (image) {
            card.addEventListener('mouseenter', () => {
                image.style.transform = 'scale(1.1)';
            });
            
            card.addEventListener('mouseleave', () => {
                image.style.transform = 'scale(1.0)';
            });
        }
    });
    
    // Add parallax effect to approach section
    const approachSection = document.getElementById('approach-services');
    if (approachSection) {
        window.addEventListener('scroll', () => {
            const scrollPosition = window.scrollY;
            const sectionTop = approachSection.offsetTop;
            const sectionHeight = approachSection.offsetHeight;
            
            // Only apply effect when section is in viewport
            if (scrollPosition > sectionTop - window.innerHeight && 
                scrollPosition < sectionTop + sectionHeight) {
                
                const scrollPercentage = (scrollPosition - (sectionTop - window.innerHeight)) / 
                                         (sectionHeight + window.innerHeight);
                
                // Move decorative elements based on scroll
                const leafPattern1 = approachSection.querySelector('.leaf-pattern-1');
                const leafPattern2 = approachSection.querySelector('.leaf-pattern-2');
                
                if (leafPattern1) {
                    leafPattern1.style.transform = `translateY(${scrollPercentage * 100}px) rotate(${scrollPercentage * 30}deg)`;
                }
                
                if (leafPattern2) {
                    leafPattern2.style.transform = `translateY(${-scrollPercentage * 100}px) rotate(${-scrollPercentage * 30}deg)`;
                }
            }
        });
    }
}