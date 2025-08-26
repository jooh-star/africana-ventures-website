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

    // Simple hover effects for expertise cards
    const expertiseCards = document.querySelectorAll('[data-card-index]');
    if (expertiseCards.length > 0) {
        expertiseCards.forEach((card, index) => {
            card.addEventListener('mouseenter', () => {
                card.style.transition = 'transform 0.3s ease';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transition = '';
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

    // Simple Expertise Carousel with Tailwind CSS
    function initializeExpertiseCards() {
        const track = document.getElementById('expertiseCarouselTrack');
        const prevBtn = document.getElementById('expertisePrevBtn');
        const nextBtn = document.getElementById('expertiseNextBtn');
        const dots = document.querySelectorAll('[data-slide]');
        const cards = document.querySelectorAll('[data-card-index]');
        
        if (!track || cards.length === 0) {
            console.log('Carousel elements not found');
            return;
        }
        
        let currentSlide = 0;
        let cardsPerView = getCardsPerView();
        const totalCards = cards.length;
        const maxSlide = Math.max(0, totalCards - cardsPerView);
        
        console.log('Initializing Tailwind carousel with', totalCards, 'cards');
        
        // Get responsive cards per view
        function getCardsPerView() {
            if (window.innerWidth >= 1280) return 4; // xl: show 4 cards
            if (window.innerWidth >= 1024) return 3; // lg: show 3 cards  
            if (window.innerWidth >= 768) return 2;  // md: show 2 cards
            if (window.innerWidth >= 480) return 2;  // sm: show 2 cards
            return 1; // xs: show 1 card
        }
        
        // Update carousel position
        function updateCarousel() {
            const cardWidth = 100 / cardsPerView;
            const translateX = -(currentSlide * cardWidth);
            track.style.transform = `translateX(${translateX}%)`;
            
            // Update dots
            dots.forEach((dot, index) => {
                if (index === currentSlide) {
                    dot.classList.add('bg-gold', 'shadow-md', 'shadow-gold/50');
                    dot.classList.remove('bg-white/30');
                } else {
                    dot.classList.remove('bg-gold', 'shadow-md', 'shadow-gold/50');
                    dot.classList.add('bg-white/30');
                }
            });
            
            // Update button states
            prevBtn.disabled = currentSlide === 0;
            nextBtn.disabled = currentSlide >= maxSlide;
        }
        
        // Navigate to specific slide
        function goToSlide(slideIndex) {
            currentSlide = Math.max(0, Math.min(slideIndex, maxSlide));
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
            if (currentSlide < maxSlide) {
                goToSlide(currentSlide + 1);
            }
        }
        
        // Event listeners
        if (prevBtn) {
            prevBtn.addEventListener('click', prevSlide);
            console.log('Previous button listener added');
        }
        if (nextBtn) {
            nextBtn.addEventListener('click', nextSlide);
            console.log('Next button listener added');
        }
        
        // Dot navigation
        dots.forEach((dot) => {
            dot.addEventListener('click', () => {
                const slideIndex = parseInt(dot.dataset.slide);
                goToSlide(slideIndex);
            });
        });
        
        // Handle window resize
        function handleResize() {
            const newCardsPerView = getCardsPerView();
            if (newCardsPerView !== cardsPerView) {
                cardsPerView = newCardsPerView;
                const newMaxSlide = Math.max(0, totalCards - cardsPerView);
                if (currentSlide > newMaxSlide) {
                    currentSlide = newMaxSlide;
                }
                updateCarousel();
            }
        }
        
        window.addEventListener('resize', handleResize);
        
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
            
            if (Math.abs(diffX) > 50) { // Minimum swipe distance
                if (diffX > 0) {
                    nextSlide(); // Swipe left - next slide
                } else {
                    prevSlide(); // Swipe right - previous slide
                }
            }
            
            isDragging = false;
        });
        
        // Mouse drag support
        track.addEventListener('mousedown', (e) => {
            startX = e.clientX;
            isDragging = true;
            track.style.cursor = 'grabbing';
        });
        
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
        });
        
        document.addEventListener('mouseup', (e) => {
            if (!isDragging) return;
            
            const endX = e.clientX;
            const diffX = startX - endX;
            
            if (Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
            }
            
            isDragging = false;
            track.style.cursor = 'grab';
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                prevSlide();
            } else if (e.key === 'ArrowRight') {
                nextSlide();
            }
        });
        
        // Auto-play (optional)
        let autoPlayInterval;
        function startAutoPlay() {
            autoPlayInterval = setInterval(() => {
                if (currentSlide >= maxSlide) {
                    goToSlide(0); // Loop back to start
                } else {
                    nextSlide();
                }
            }, 5000); // Change slide every 5 seconds
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
    
    // Initialize expertise carousel
    initializeExpertiseCards();
    
    // Initialize methodology section with random positioning
    initializeMethodologySection();
    
    // Initialize mobile methodology
    initializeMobileMethodology();
    
    // Initialize split-screen slideshow
    initializeSplitScreenSlideshow();
    
    // Dynamic Rectangular Grid Methodology Section with Enhanced Positioning
    function initializeMethodologySection() {
        const methodologyGrid = document.getElementById('methodologyRectGrid');
        const gridCards = document.querySelectorAll('.methodology-grid-card');
        const centralHub = document.getElementById('centralHubCard');
        const shuffleTrigger = document.getElementById('shuffleTrigger');
        const statusDot = document.getElementById('gridStatusDot');
        const statusText = document.getElementById('gridStatusText');
        
        if (!methodologyGrid || gridCards.length === 0) {
            console.log('Rectangular grid methodology elements not found');
            return;
        }
        
        console.log('Initializing rectangular grid methodology with', gridCards.length, 'surrounding cards');
        
        // Define 8 rectangular grid positions around the center (responsive)
        const rectangularPositions = [
            // Top row
            { top: '10%', left: '15%', description: 'Top-Left' },
            { top: '10%', left: '50%', transform: 'translateX(-50%)', description: 'Top-Center' },
            { top: '10%', right: '15%', description: 'Top-Right' },
            
            // Middle row (sides only, center is occupied by hub)
            { top: '50%', left: '5%', transform: 'translateY(-50%)', description: 'Mid-Left' },
            { top: '50%', right: '5%', transform: 'translateY(-50%)', description: 'Mid-Right' },
            
            // Bottom row
            { bottom: '10%', left: '15%', description: 'Bottom-Left' },
            { bottom: '10%', left: '50%', transform: 'translateX(-50%)', description: 'Bottom-Center' },
            { bottom: '10%', right: '15%', description: 'Bottom-Right' }
        ];
        
        let currentPositions = [...Array(gridCards.length).keys()]; // [0,1,2,3,4,5,6,7]
        let isShuffling = false;
        let shuffleCount = 0;
        
        // Position cards in rectangular grid
        function positionCardsInGrid() {
            gridCards.forEach((card, index) => {
                const positionIndex = currentPositions[index] % rectangularPositions.length;
                const position = rectangularPositions[positionIndex];
                
                // Apply position styles
                Object.keys(position).forEach(key => {
                    if (key !== 'description') {
                        card.style[key] = position[key];
                    }
                });
                
                // Clear conflicting positioning
                if (position.left) card.style.right = 'auto';
                if (position.right) card.style.left = 'auto';
                if (position.top) card.style.bottom = 'auto';
                if (position.bottom) card.style.top = 'auto';
                
                // Add position attribute for debugging
                card.setAttribute('data-current-position', position.description);
            });
        }
        
        // Shuffle positions with premium animations
        function shuffleGridPositions() {
            if (isShuffling) return;
            
            isShuffling = true;
            shuffleCount++;
            
            // Update status
            if (statusDot) statusDot.classList.add('bg-yellow-400', 'animate-spin');
            if (statusText) statusText.textContent = 'Shuffling Grid...';
            
            // Create shuffled array
            const newPositions = [...currentPositions];
            for (let i = newPositions.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [newPositions[i], newPositions[j]] = [newPositions[j], newPositions[i]];
            }
            
            currentPositions = newPositions;
            
            // Add staggered shuffle animation to each card
            gridCards.forEach((card, index) => {
                // Enhanced transition timing
                card.style.transition = 'all 1.5s cubic-bezier(0.4, 0, 0.2, 1)';
                
                setTimeout(() => {
                    // Apply new position
                    const positionIndex = currentPositions[index] % rectangularPositions.length;
                    const position = rectangularPositions[positionIndex];
                    
                    // Pre-animation effect
                    card.style.transform = 'scale(0.9) rotate(10deg)';
                    card.style.opacity = '0.7';
                    
                    setTimeout(() => {
                        // Apply final position
                        Object.keys(position).forEach(key => {
                            if (key !== 'description') {
                                card.style[key] = position[key];
                            }
                        });
                        
                        // Clear conflicting positioning
                        if (position.left) card.style.right = 'auto';
                        if (position.right) card.style.left = 'auto';
                        if (position.top) card.style.bottom = 'auto';
                        if (position.bottom) card.style.top = 'auto';
                        
                        // Reset transform and opacity
                        card.style.transform = '';
                        card.style.opacity = '1';
                        
                        // Update position attribute
                        card.setAttribute('data-current-position', position.description);
                        
                        // Add landing effect
                        card.style.animation = 'pulse 0.6s ease-out';
                        setTimeout(() => {
                            card.style.animation = '';
                        }, 600);
                    }, 200); // Micro delay for smooth transition
                    
                }, index * 150); // Staggered delay based on specification
            });
            
            // Central hub pulse effect during shuffle
            if (centralHub) {
                centralHub.style.animation = 'pulse 2s ease-in-out';
                setTimeout(() => {
                    centralHub.style.animation = '';
                }, 2000);
            }
            
            // Reset shuffling state and status
            setTimeout(() => {
                isShuffling = false;
                
                if (statusDot) {
                    statusDot.classList.remove('bg-yellow-400', 'animate-spin');
                    statusDot.classList.add('bg-gold');
                }
                if (statusText) statusText.textContent = 'Active & Dynamic';
                
                // Remove transition styles
                gridCards.forEach(card => {
                    card.style.transition = '';
                });
                
                console.log(`Grid shuffle #${shuffleCount} completed!`);
            }, 2500);
        }
        
        // Enhanced interactive effects for grid cards
        gridCards.forEach((card, index) => {
            // Magnetic hover effect
            card.addEventListener('mouseenter', () => {
                card.style.zIndex = '30';
                card.style.filter = 'brightness(1.15) contrast(1.2) drop-shadow(0 15px 25px rgba(218, 165, 32, 0.5))';
                
                // Reset other cards z-index
                gridCards.forEach((otherCard, otherIndex) => {
                    if (otherIndex !== index) {
                        otherCard.style.zIndex = '10';
                    }
                });
                
                // Add magnetic mouse tracking
                const handleMouseMove = (e) => {
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left - rect.width / 2;
                    const y = e.clientY - rect.top - rect.height / 2;
                    
                    const rotateX = (y / rect.height) * -8; // Max 8 degrees
                    const rotateY = (x / rect.width) * 8;
                    
                    card.style.transform = `
                        perspective(1000px) 
                        rotateX(${rotateX}deg) 
                        rotateY(${rotateY}deg) 
                        scale(1.1) 
                        translateZ(30px)
                    `;
                };
                
                card.addEventListener('mousemove', handleMouseMove);
                card._handleMouseMove = handleMouseMove;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.zIndex = '10';
                card.style.filter = '';
                card.style.transform = '';
                
                // Remove mouse move listener
                if (card._handleMouseMove) {
                    card.removeEventListener('mousemove', card._handleMouseMove);
                    delete card._handleMouseMove;
                }
            });
            
            // Click animation
            card.addEventListener('click', () => {
                card.style.animation = 'pulse 0.8s ease-out';
                setTimeout(() => {
                    card.style.animation = '';
                }, 800);
                
                console.log(`Grid card clicked: ${card.querySelector('h3').textContent} at position ${card.getAttribute('data-current-position')}`);
            });
        });
        
        // Central hub interactive effects
        if (centralHub) {
            centralHub.addEventListener('mouseenter', () => {
                centralHub.style.zIndex = '50';
                centralHub.style.filter = 'brightness(1.2) drop-shadow(0 20px 40px rgba(218, 165, 32, 0.7))';
            });
            
            centralHub.addEventListener('mouseleave', () => {
                centralHub.style.zIndex = '20';
                centralHub.style.filter = '';
            });
            
            // Central hub click triggers immediate shuffle
            centralHub.addEventListener('click', () => {
                shuffleGridPositions();
                centralHub.style.animation = 'pulse 1.5s ease-in-out';
                setTimeout(() => {
                    centralHub.style.animation = '';
                }, 1500);
                
                console.log('Central hub clicked - triggering grid shuffle!');
            });
        }
        
        // Manual shuffle trigger button
        if (shuffleTrigger) {
            shuffleTrigger.addEventListener('click', () => {
                shuffleGridPositions();
                shuffleTrigger.style.animation = 'pulse 1s ease-out';
                setTimeout(() => {
                    shuffleTrigger.style.animation = '';
                }, 1000);
            });
        }
        
        // Auto-shuffle every 8 seconds (as per specification)
        const autoShuffleInterval = setInterval(() => {
            if (!document.hidden && !isShuffling) {
                shuffleGridPositions();
            }
        }, 8000);
        
        // Pause auto-shuffle when page is not visible
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                console.log('Page hidden - pausing auto-shuffle');
            } else {
                console.log('Page visible - resuming auto-shuffle');
            }
        });
        
        // Responsive handling
        window.addEventListener('resize', () => {
            if (window.innerWidth >= 768) { // Only for desktop
                positionCardsInGrid();
            }
        });
        
        // Initialize grid positioning
        positionCardsInGrid();
        
        console.log('Rectangular grid methodology initialized with:');
        console.log('- Central hub card with fixed position');
        console.log('- 8 surrounding cards in rectangular grid');
        console.log('- Auto-shuffle every 8 seconds');
        console.log('- Enhanced interactive effects');
        console.log('- Staggered animations with 150ms delays');
    }
    
    // Enhanced Mobile Methodology Section
    function initializeMobileMethodology() {
        const mobileCards = document.querySelectorAll('.methodology-mobile-card');
        const centralHubMobile = document.getElementById('centralHubMobile');
        
        if (mobileCards.length === 0) {
            console.log('Mobile methodology cards not found');
            return;
        }
        
        console.log('Initializing mobile methodology with', mobileCards.length, 'cards');
        
        let mobileShuffling = false;
        
        // Mobile card shuffle animation
        function shuffleMobileCards() {
            if (mobileShuffling) return;
            
            mobileShuffling = true;
            
            // Create array of cards for shuffling
            const cardsArray = Array.from(mobileCards);
            const container = cardsArray[0].parentNode;
            
            // Add shuffling animation to each card
            cardsArray.forEach((card, index) => {
                card.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
                card.style.transform = 'translateX(-100%) scale(0.8)';
                card.style.opacity = '0.5';
                
                setTimeout(() => {
                    // Remove card from DOM temporarily
                    card.remove();
                }, index * 100);
            });
            
            // Shuffle array and re-append
            setTimeout(() => {
                // Fisher-Yates shuffle
                for (let i = cardsArray.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [cardsArray[i], cardsArray[j]] = [cardsArray[j], cardsArray[i]];
                }
                
                // Re-append shuffled cards with animation
                cardsArray.forEach((card, index) => {
                    setTimeout(() => {
                        container.appendChild(card);
                        
                        // Reset and animate in
                        card.style.transform = 'translateX(100%) scale(0.8)';
                        card.style.opacity = '0.5';
                        
                        setTimeout(() => {
                            card.style.transform = 'translateX(0) scale(1)';
                            card.style.opacity = '1';
                        }, 50);
                        
                        // Update position attribute
                        card.setAttribute('data-mobile-position', index);
                    }, index * 150);
                });
                
                setTimeout(() => {
                    mobileShuffling = false;
                    // Reset transition styles
                    cardsArray.forEach(card => {
                        card.style.transition = '';
                    });
                    console.log('Mobile cards shuffle completed!');
                }, cardsArray.length * 150 + 500);
            }, cardsArray.length * 100 + 300);
        }
        
        // Enhanced mobile card interactions
        mobileCards.forEach((card, index) => {
            card.addEventListener('click', () => {
                card.style.animation = 'pulse 0.6s ease-out';
                setTimeout(() => {
                    card.style.animation = '';
                }, 600);
                
                console.log(`Mobile card clicked: ${card.querySelector('h3').textContent}`);
            });
        });
        
        // Central hub mobile interactions
        if (centralHubMobile) {
            centralHubMobile.addEventListener('click', () => {
                shuffleMobileCards();
                centralHubMobile.style.animation = 'pulse 1.2s ease-in-out';
                setTimeout(() => {
                    centralHubMobile.style.animation = '';
                }, 1200);
                
                console.log('Mobile central hub clicked - triggering mobile shuffle!');
            });
        }
        
        // Auto-shuffle for mobile every 10 seconds (slightly longer for mobile)
        const mobileShuffleInterval = setInterval(() => {
            if (!document.hidden && !mobileShuffling && window.innerWidth < 768) {
                shuffleMobileCards();
            }
        }, 10000);
        
        console.log('Mobile methodology initialized with auto-shuffle every 10 seconds');
    }
    
    // Simple Split-Screen Slideshow
    function initializeSplitScreenSlideshow() {
        const slideshow = document.getElementById('splitScreenSlideshow');
        const slides = document.querySelectorAll('.slideshow-image');
        const indicators = document.querySelectorAll('.slide-indicator');
        
        if (!slideshow || slides.length === 0) {
            console.log('Split-screen slideshow elements not found');
            return;
        }
        
        let currentSlide = 0;
        const totalSlides = slides.length;
        
        console.log('Initializing split-screen slideshow with', totalSlides, 'slides');
        
        // Show specific slide
        function showSlide(index) {
            // Hide all slides
            slides.forEach(slide => {
                slide.classList.remove('opacity-100');
                slide.classList.add('opacity-0');
            });
            
            // Show current slide
            slides[index].classList.remove('opacity-0');
            slides[index].classList.add('opacity-100');
            
            // Update indicators
            indicators.forEach((indicator, i) => {
                if (i === index) {
                    indicator.classList.remove('bg-white/30');
                    indicator.classList.add('bg-white/80');
                } else {
                    indicator.classList.remove('bg-white/80');
                    indicator.classList.add('bg-white/30');
                }
            });
            
            currentSlide = index;
        }
        
        // Next slide
        function nextSlide() {
            const nextIndex = (currentSlide + 1) % totalSlides;
            showSlide(nextIndex);
        }
        
        // Add click listeners to indicators
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                showSlide(index);
            });
        });
        
        // Auto-advance slideshow every 5 seconds
        let slideshowInterval = setInterval(nextSlide, 5000);
        
        // Pause on hover
        slideshow.addEventListener('mouseenter', () => {
            clearInterval(slideshowInterval);
        });
        
        // Resume on mouse leave
        slideshow.addEventListener('mouseleave', () => {
            slideshowInterval = setInterval(nextSlide, 5000);
        });
        
        // Initialize first slide
        showSlide(0);
    }
    
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
