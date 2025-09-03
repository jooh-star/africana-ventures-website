document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        mirror: false,
        offset: 120
    });

    // Hero Video Carousel with Curtain-Style Sliding Transitions
    function initializeHeroVideoCarousel() {
        const videos = document.querySelectorAll('.hero-video');
        const messages = document.querySelectorAll('.hero-message');
        const slideIndicators = document.querySelectorAll('.slide-indicator');
        const heroSection = document.querySelector('#home');
        
        if (videos.length === 0 || messages.length === 0) return;
        
        let currentIndex = 0;
        let autoplayInterval;
        let isTransitioning = false;
        let allPhasesCompleted = false;
        const intervalDuration = 6000; // 6 seconds per slide
        let scrollAccumulator = 0;
        const scrollThreshold = 100; // More responsive
        let isPreviewMode = false;
        
        // Preload videos with performance optimization
        videos.forEach((video, index) => {
            if (index !== 0) {
                video.load();
            }
            // Add error handling for better fallback
            video.addEventListener('error', () => {
                console.log(`Video ${index + 1} failed to load, using fallback image`);
            });
            
            // Optimize video playback
            video.addEventListener('canplay', () => {
                console.log(`Video ${index + 1} is ready to play`);
            });
        });
        
        function updateSlideIndicators() {
            slideIndicators.forEach((indicator, index) => {
                indicator.classList.toggle('active', index === currentIndex);
            });
        }
        
        function switchToSlide(index, triggeredBy = 'auto', animate = true) {
            if (isTransitioning || index < 0 || index >= videos.length) return;
            
            // Allow navigation in both directions at any time
            isTransitioning = true;
            isPreviewMode = false;
            
            const oldIndex = currentIndex;
            currentIndex = index;
            
            // Reset all message states
            messages.forEach(msg => {
                msg.classList.remove('active', 'slide-out', 'preview-next', 'preview-prev');
            });
            
            // Set the new active message with curtain animation
            if (animate) {
                // Current message slides out
                if (messages[oldIndex]) {
                    messages[oldIndex].classList.add('slide-out');
                }
                
                // New message slides in with enhanced animation
                setTimeout(() => {
                    messages[index].classList.add('active');
                    // Trigger content animation
                    const content = messages[index].querySelector('.content');
                    if (content) {
                        content.style.animation = 'none';
                        content.offsetHeight; // Trigger reflow
                        content.style.animation = 'contentFadeIn 0.8s ease-out both';
                    }
                }, 50);
            } else {
                messages[index].classList.add('active');
            }
            
            // Update slide indicators
            updateSlideIndicators();
            
            // Switch videos with enhanced performance
            videos.forEach((video, i) => {
                if (i === index) {
                    video.classList.add('active');
                    video.currentTime = 0;
                    // Preload next video for smoother transitions
                    if (index < videos.length - 1) {
                        videos[index + 1].preload = 'metadata';
                    }
                    video.play().catch(() => {
                        console.log('Video autoplay failed, using fallback image');
                    });
                } else {
                    video.classList.remove('active');
                    video.pause();
                    // Reset preload to save bandwidth
                    if (i !== index + 1) {
                        video.preload = 'none';
                    }
                }
            });
            
            // Handle scroll indicator and autoplay based on current phase
            const scrollIndicator = document.getElementById('scroll-indicator');
            if (index === videos.length - 1) {
                // On final phase - show scroll indicator and stop autoplay
                if (!allPhasesCompleted) {
                    setTimeout(() => {
                        allPhasesCompleted = true;
                        stopAutoplay();
                        if (scrollIndicator) {
                            scrollIndicator.style.opacity = '1';
                        }
                        console.log('Final phase reached - normal scrolling enabled');
                    }, 1000);
                }
            } else {
                // Not on final phase - hide scroll indicator and ensure autoplay can resume
                if (scrollIndicator) {
                    scrollIndicator.style.opacity = '0';
                }
                // Reset completion status if going back from final phase
                if (allPhasesCompleted) {
                    allPhasesCompleted = false;
                    console.log('Moved back from final phase - phase navigation restored');
                }
            }
            
            setTimeout(() => {
                isTransitioning = false;
            }, 800);
            
            console.log(`Curtain transition to slide ${index + 1} (triggered by: ${triggeredBy})`);
        }
        
        function nextSlide(triggeredBy = 'auto') {
            if (currentIndex < videos.length - 1) {
                switchToSlide(currentIndex + 1, triggeredBy);
            }
        }
        
        function prevSlide(triggeredBy = 'scroll') {
            if (currentIndex > 0) {
                switchToSlide(currentIndex - 1, triggeredBy);
            }
        }
        
        function startAutoplay() {
            if (!allPhasesCompleted) {
                autoplayInterval = setInterval(() => {
                    if (!allPhasesCompleted && currentIndex < videos.length - 1) {
                        nextSlide('timer');
                    }
                }, intervalDuration);
            }
        }
        
        function stopAutoplay() {
            if (autoplayInterval) {
                clearInterval(autoplayInterval);
                autoplayInterval = null;
            }
        }
        
        // Curtain-style scroll behavior with horizontal slide preview
        function handleScroll(e) {
            // Check if we're in the hero section area
            const heroRect = heroSection.getBoundingClientRect();
            const isInHeroArea = heroRect.top <= 0 && heroRect.bottom > 0;
            
            // If not in hero area, allow normal scrolling
            if (!isInHeroArea) {
                return true;
            }
            
            // Allow normal scrolling only when on final phase AND scrolling down
            if (allPhasesCompleted && currentIndex === videos.length - 1) {
                const delta = e.deltaY || e.detail || -e.wheelDelta;
                if (delta < 0) {
                    // Scrolling up from final phase - allow going back to previous phase
                    e.preventDefault();
                    e.stopPropagation();
                } else {
                    // Scrolling down from final phase - allow normal page scrolling
                    return true;
                }
            } else if (currentIndex < videos.length - 1) {
                // Not on final phase - prevent normal scrolling only in hero area
                e.preventDefault();
                e.stopPropagation();
            }
            
            if (isTransitioning) return false;
            
            // Get scroll direction and amount
            const delta = e.deltaY || e.detail || -e.wheelDelta;
            scrollAccumulator += delta;
            
            // Calculate curtain progress (0 to 1)
            const progress = Math.abs(scrollAccumulator) / scrollThreshold;
            const clampedProgress = Math.min(progress, 1);
            
            // Enable preview mode for real-time curtain feedback
            isPreviewMode = true;
            
            if (scrollAccumulator > 0 && currentIndex < videos.length - 1) {
                // Scrolling down - curtain preview next slide
                const nextIndex = currentIndex + 1;
                
                // Reset all message states
                messages.forEach(msg => {
                    msg.classList.remove('preview-next', 'preview-prev');
                });
                
                // Show curtain effect: next slide sliding in from right
                const curtainOffset = 100 - (clampedProgress * 100); // Start at 100%, slide to 0%
                messages[nextIndex].style.setProperty('--preview-offset', `${curtainOffset}%`);
                messages[nextIndex].classList.add('preview-next');
                
                // Current slide starts sliding out to left
                const currentOffset = -(clampedProgress * 100); // Start at 0%, slide to -100%
                messages[currentIndex].style.setProperty('--preview-offset', `${currentOffset}%`);
                messages[currentIndex].classList.add('preview-prev');
                
                // Visual feedback on indicators
                if (slideIndicators[nextIndex]) {
                    slideIndicators[nextIndex].style.opacity = 0.5 + (clampedProgress * 0.5);
                }
                
                if (Math.abs(scrollAccumulator) >= scrollThreshold) {
                    stopAutoplay();
                    nextSlide('scroll');
                    scrollAccumulator = 0;
                    setTimeout(startAutoplay, 3000);
                }
            } else if (scrollAccumulator < 0 && currentIndex > 0) {
                // Scrolling up - curtain preview previous slide (works from any phase)
                const prevIndex = currentIndex - 1;
                
                // Reset all message states
                messages.forEach(msg => {
                    msg.classList.remove('preview-next', 'preview-prev');
                });
                
                // Show curtain effect: previous slide sliding in from left
                const curtainOffset = -100 + (clampedProgress * 100); // Start at -100%, slide to 0%
                messages[prevIndex].style.setProperty('--preview-offset', `${curtainOffset}%`);
                messages[prevIndex].classList.add('preview-prev');
                
                // Current slide starts sliding out to right
                const currentOffset = clampedProgress * 100; // Start at 0%, slide to 100%
                messages[currentIndex].style.setProperty('--preview-offset', `${currentOffset}%`);
                messages[currentIndex].classList.add('preview-next');
                
                // Visual feedback on indicators
                if (slideIndicators[prevIndex]) {
                    slideIndicators[prevIndex].style.opacity = 0.5 + (clampedProgress * 0.5);
                }
                
                if (Math.abs(scrollAccumulator) >= scrollThreshold) {
                    stopAutoplay();
                    prevSlide('scroll');
                    scrollAccumulator = 0;
                    setTimeout(startAutoplay, 3000);
                }
            } else {
                // Reset to current position if at boundaries
                if (Math.abs(scrollAccumulator) > 30) {
                    resetCurtainPreview();
                    scrollAccumulator = 0;
                }
            }
            
            // Reset scroll accumulator if not moving in valid direction
            if ((scrollAccumulator > 0 && currentIndex >= videos.length - 1) || 
                (scrollAccumulator < 0 && currentIndex <= 0)) {
                scrollAccumulator = 0;
                resetCurtainPreview();
            }
            
            return false;
        }
        
        // Reset curtain preview to normal state
        function resetCurtainPreview() {
            isPreviewMode = false;
            messages.forEach(msg => {
                msg.classList.remove('preview-next', 'preview-prev');
                msg.style.removeProperty('--preview-offset');
            });
            
            // Reset indicator opacities
            slideIndicators.forEach(indicator => {
                indicator.style.opacity = '';
            });
        }
        
        // Reset scroll accumulator with curtain cleanup
        let scrollTimeout;
        function resetScrollAccumulator() {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                if (!isTransitioning && Math.abs(scrollAccumulator) > 0 && Math.abs(scrollAccumulator) < scrollThreshold) {
                    scrollAccumulator = 0;
                    resetCurtainPreview();
                }
            }, 150);
        }
        
        // Add click handlers for slide indicators
        slideIndicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                if (!isTransitioning && index !== currentIndex) {
                    stopAutoplay();
                    switchToSlide(index, 'indicator');
                    setTimeout(startAutoplay, 3000);
                }
            });
        });
        
        // Initialize first slide
        switchToSlide(0, 'init', false);
        
        // Start autoplay
        startAutoplay();
        
        // Add scroll event listeners with position monitoring
        const wheelHandler = (e) => {
            handleScroll(e);
            resetScrollAccumulator();
        };

        // Monitor scroll position to ensure normal scrolling is restored
        let scrollPositionMonitor;
        const checkScrollPosition = () => {
            const heroRect = heroSection.getBoundingClientRect();
            const isWellPastHero = heroRect.bottom < -100; // 100px past hero section
            
            if (isWellPastHero && !allPhasesCompleted) {
                // Force completion if user somehow scrolled past hero
                allPhasesCompleted = true;
                stopAutoplay();
                console.log('Scroll past hero detected - enabling normal scrolling');
            }
        };
        
        window.addEventListener('wheel', wheelHandler, { passive: false });
        window.addEventListener('DOMMouseScroll', wheelHandler, { passive: false }); // Firefox
        
        // Monitor scroll position every 100ms
        scrollPositionMonitor = setInterval(checkScrollPosition, 100);
        
        // Touch events for mobile with curtain effect
        let touchStartY = 0;
        let touchCurrentY = 0;
        let isTouching = false;
        
        window.addEventListener('touchstart', (e) => {
            // Allow touch interaction from any phase, including final phase for backward navigation
            if (!allPhasesCompleted || currentIndex === videos.length - 1) {
                touchStartY = e.touches[0].clientY;
                touchCurrentY = touchStartY;
                isTouching = true;
            }
        }, { passive: true });
        
        window.addEventListener('touchmove', (e) => {
            // Allow touch interaction from any phase, including backward from final phase
            if ((!allPhasesCompleted || currentIndex === videos.length - 1) && isTouching) {
                e.preventDefault();
                touchCurrentY = e.touches[0].clientY;
                const diff = touchStartY - touchCurrentY;
                
                // Create curtain preview effect
                const progress = Math.abs(diff) / 100;
                const clampedProgress = Math.min(progress, 1);
                
                if (diff > 0 && currentIndex < videos.length - 1) {
                    // Swiping up - next slide curtain
                    const nextIndex = currentIndex + 1;
                    const curtainOffset = 100 - (clampedProgress * 100);
                    
                    messages.forEach(msg => msg.classList.remove('preview-next', 'preview-prev'));
                    messages[nextIndex].style.setProperty('--preview-offset', `${curtainOffset}%`);
                    messages[nextIndex].classList.add('preview-next');
                    
                    const currentOffset = -(clampedProgress * 100);
                    messages[currentIndex].style.setProperty('--preview-offset', `${currentOffset}%`);
                    messages[currentIndex].classList.add('preview-prev');
                } else if (diff < 0 && currentIndex > 0) {
                    // Swiping down - previous slide curtain (works from any phase)
                    const prevIndex = currentIndex - 1;
                    const curtainOffset = -100 + (clampedProgress * 100);
                    
                    messages.forEach(msg => msg.classList.remove('preview-next', 'preview-prev'));
                    messages[prevIndex].style.setProperty('--preview-offset', `${curtainOffset}%`);
                    messages[prevIndex].classList.add('preview-prev');
                    
                    const currentOffset = clampedProgress * 100;
                    messages[currentIndex].style.setProperty('--preview-offset', `${currentOffset}%`);
                    messages[currentIndex].classList.add('preview-next');
                }
                
                if (Math.abs(diff) > 100) {
                    if (diff > 0 && currentIndex < videos.length - 1) {
                        stopAutoplay();
                        nextSlide('touch');
                        setTimeout(startAutoplay, 3000);
                    } else if (diff < 0 && currentIndex > 0) {
                        stopAutoplay();
                        prevSlide('touch');
                        setTimeout(startAutoplay, 3000);
                    }
                    isTouching = false;
                }
            }
        }, { passive: false });
        
        window.addEventListener('touchend', () => {
            if ((!allPhasesCompleted || currentIndex === videos.length - 1) && isTouching) {
                resetCurtainPreview();
                isTouching = false;
            }
        }, { passive: true });
        
        // Pause autoplay on hover
        if (heroSection) {
            heroSection.addEventListener('mouseenter', stopAutoplay);
            heroSection.addEventListener('mouseleave', () => {
                if (!allPhasesCompleted) startAutoplay();
            });
        }
        
        // Handle video errors (fallback to images)
        videos.forEach((video, index) => {
            video.addEventListener('error', () => {
                console.log(`Video ${index + 1} failed to load, using fallback image`);
            });
            
            video.addEventListener('canplay', () => {
                console.log(`Video ${index + 1} is ready to play`);
            });
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.target.tagName.toLowerCase() === 'input' || e.target.tagName.toLowerCase() === 'textarea') {
                return;
            }
            
            switch(e.key) {
                case 'ArrowRight':
                case ' ': // Spacebar
                    if (currentIndex < videos.length - 1) {
                        stopAutoplay();
                        nextSlide('keyboard');
                        setTimeout(startAutoplay, 3000);
                    }
                    break;
                case 'ArrowLeft':
                    // Allow going back from any phase
                    if (currentIndex > 0) {
                        stopAutoplay();
                        prevSlide('keyboard');
                        setTimeout(startAutoplay, 3000);
                    }
                    break;
                case 'ArrowDown':
                    if (allPhasesCompleted && currentIndex === videos.length - 1) {
                        // Smooth scroll to next section only from final phase
                        const nextSection = heroSection.nextElementSibling;
                        if (nextSection) {
                            nextSection.scrollIntoView({ behavior: 'smooth' });
                        }
                    }
                    break;
            }
        });
        
        // Pause videos when page is not visible
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                stopAutoplay();
                videos.forEach(video => video.pause());
            } else {
                videos[currentIndex].play().catch(() => {});
                if (!allPhasesCompleted) startAutoplay();
            }
        });
        
        console.log('Hero swipe carousel initialized:', videos.length, 'videos,', messages.length, 'messages');
    }

    // Enhanced hero parallax effect
    function initializeHeroParallax() {
        const hero = document.querySelector('#home');
        if (!hero) return;
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallax = scrolled * 0.5;
            
            const heroBackground = hero.querySelector('.bg-cover');
            if (heroBackground) {
                heroBackground.style.transform = `translateY(${parallax}px)`;
            }
        });
    }

    // Mission and Vision cards hover effects
    function initializeMissionVisionCards() {
        const cards = document.querySelectorAll('.mission-vision-card');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-10px) scale(1.02)';
                card.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
            });
        });
    }

    // Value cards interactive effects
    function initializeValueCards() {
        const valueCards = document.querySelectorAll('.value-card');
        
        valueCards.forEach((card, index) => {
            // Staggered hover effects
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-15px) scale(1.05)';
                card.style.boxShadow = '0 25px 50px rgba(218, 165, 32, 0.3)';
                card.style.borderColor = '#DAA520';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
                card.style.boxShadow = '';
                card.style.borderColor = 'rgba(218, 165, 32, 0.2)';
            });
            
            // Click animation
            card.addEventListener('click', () => {
                card.style.animation = 'pulse 0.6s ease-out';
                setTimeout(() => {
                    card.style.animation = '';
                }, 600);
            });
        });
    }

    // Core focus cards enhanced interactions
    function initializeCoreFocusCards() {
        const focusCards = document.querySelectorAll('.core-focus-card');
        
        focusCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                // Enhanced hover effect
                card.style.transform = 'translateY(-15px) scale(1.05)';
                card.style.boxShadow = '0 30px 60px rgba(218, 165, 32, 0.4)';
                
                // Glow effect for the icon
                const icon = card.querySelector('.icon-tag');
                if (icon) {
                    icon.style.boxShadow = '0 0 20px rgba(218, 165, 32, 0.8)';
                    icon.style.transform = 'translateY(-50%) translateX(-50%) scale(1.1)';
                }
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(-10px)';
                card.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.2)';
                
                const icon = card.querySelector('.icon-tag');
                if (icon) {
                    icon.style.boxShadow = '';
                    icon.style.transform = 'translateY(-50%) translateX(-50%) scale(1)';
                }
            });
        });
    }

    // Service cards enhanced hover effects
    function initializeServiceCards() {
        const serviceCards = document.querySelectorAll('.service-card');
        
        serviceCards.forEach(card => {
            const initialContent = card.querySelector('.initial-content');
            const hoverContent = card.querySelector('.hover-content');
            
            if (initialContent && hoverContent) {
                // Set initial states
                hoverContent.style.opacity = '0';
                hoverContent.style.transform = 'translateY(20px)';
                hoverContent.style.transition = 'all 0.4s ease';
                
                card.addEventListener('mouseenter', () => {
                    initialContent.style.opacity = '0';
                    initialContent.style.transform = 'translateY(-20px)';
                    
                    hoverContent.style.opacity = '1';
                    hoverContent.style.transform = 'translateY(0)';
                    
                    card.style.transform = 'translateY(-15px) scale(1.03)';
                });
                
                card.addEventListener('mouseleave', () => {
                    initialContent.style.opacity = '1';
                    initialContent.style.transform = 'translateY(0)';
                    
                    hoverContent.style.opacity = '0';
                    hoverContent.style.transform = 'translateY(20px)';
                    
                    card.style.transform = 'translateY(0) scale(1)';
                });
            }
        });
    }

    // Statistics cards counter animation
    function initializeStatsAnimation() {
        const statsCards = document.querySelectorAll('.float-animation');
        
        // Intersection Observer for counter animation
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const numberElement = entry.target.querySelector('.font-bold');
                    if (numberElement) {
                        animateCounter(numberElement);
                    }
                }
            });
        }, { threshold: 0.5 });
        
        statsCards.forEach(card => {
            observer.observe(card);
        });
    }
    
    function animateCounter(element) {
        const target = element.textContent;
        const isPlus = target.includes('+');
        const number = parseInt(target.replace(/[^0-9]/g, ''));
        const duration = 2000;
        const increment = number / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= number) {
                current = number;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current) + (isPlus ? '+' : '');
        }, 16);
    }

    // Product hero cards parallax effect
    function initializeProductCards() {
        const productCards = document.querySelectorAll('.product-hero-card');
        
        productCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                const overlay = card.querySelector('.product-hero-overlay');
                if (overlay) {
                    overlay.style.background = 'rgba(0, 0, 0, 0.4)';
                }
                
                card.style.transform = 'scale(1.05)';
                card.style.transition = 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            });
            
            card.addEventListener('mouseleave', () => {
                const overlay = card.querySelector('.product-hero-overlay');
                if (overlay) {
                    overlay.style.background = 'rgba(0, 0, 0, 0.2)';
                }
                
                card.style.transform = 'scale(1)';
            });
        });
    }

    // Partners logo hover effects
    function initializePartnersAnimation() {
        const partnerCards = document.querySelectorAll('.partner-logo-card');
        
        partnerCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                const img = card.querySelector('img');
                if (img) {
                    img.style.filter = 'grayscale(0) brightness(1.1)';
                    img.style.transform = 'scale(1.1)';
                }
                
                card.style.boxShadow = '0 15px 30px rgba(218, 165, 32, 0.3)';
                card.style.borderColor = '#DAA520';
            });
            
            card.addEventListener('mouseleave', () => {
                const img = card.querySelector('img');
                if (img) {
                    img.style.filter = 'grayscale(1)';
                    img.style.transform = 'scale(1)';
                }
                
                card.style.boxShadow = '';
                card.style.borderColor = 'transparent';
            });
        });
    }

    // Smooth scrolling for anchor links
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

    // CTA buttons glow effect
    function initializeCTAEffects() {
        const ctaButtons = document.querySelectorAll('.cta-glow');
        
        ctaButtons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                button.style.boxShadow = '0 0 30px rgba(218, 165, 32, 1), 0 0 60px rgba(218, 165, 32, 0.5)';
                button.style.transform = 'scale(1.05) translateY(-2px)';
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.boxShadow = '0 0 5px rgba(218, 165, 32, 0.5)';
                button.style.transform = 'scale(1) translateY(0)';
            });
        });
    }

    // Page scroll progress indicator
    function initializeScrollProgress() {
        const progressBar = document.createElement('div');
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: linear-gradient(90deg, #012d18, #DAA520);
            z-index: 9999;
            transition: width 0.3s ease;
        `;
        document.body.appendChild(progressBar);
        
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            
            progressBar.style.width = scrollPercent + '%';
        });
    }

    // Initialize all components
    initializeHeroVideoCarousel();
    initializeHeroParallax();
    initializeMissionVisionCards();
    initializeValueCards();
    initializeCoreFocusCards();
    initializeServiceCards();
    initializeStatsAnimation();
    initializeProductCards();
    initializePartnersAnimation();
    initializeSmoothScrolling();
    initializeCTAEffects();
    initializeScrollProgress();

    console.log('Index page enhanced JavaScript initialized successfully!');
});