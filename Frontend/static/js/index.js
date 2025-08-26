document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        mirror: false,
        offset: 120
    });

    // Hero Video Carousel
    function initializeHeroVideoCarousel() {
        const videos = document.querySelectorAll('.hero-video');
        const messages = document.querySelectorAll('.hero-message');
        const indicators = document.querySelectorAll('.hero-indicators .indicator');
        
        if (videos.length === 0 || messages.length === 0) return;
        
        let currentIndex = 0;
        let autoplayInterval;
        const intervalDuration = 6000; // 6 seconds per slide
        
        // Preload videos
        videos.forEach((video, index) => {
            if (index !== 0) {
                video.load();
            }
        });
        
        function switchToSlide(index) {
            // Remove active classes from all elements
            videos.forEach(v => v.classList.remove('active'));
            messages.forEach(m => m.classList.remove('active'));
            indicators.forEach(i => i.classList.remove('active'));
            
            // Add active class to current elements
            if (videos[index]) videos[index].classList.add('active');
            if (messages[index]) messages[index].classList.add('active');
            if (indicators[index]) indicators[index].classList.add('active');
            
            // Play current video and pause others
            videos.forEach((video, i) => {
                if (i === index) {
                    video.currentTime = 0;
                    video.play().catch(() => {
                        console.log('Video autoplay failed, using fallback image');
                    });
                } else {
                    video.pause();
                }
            });
            
            currentIndex = index;
        }
        
        function nextSlide() {
            const nextIndex = (currentIndex + 1) % videos.length;
            switchToSlide(nextIndex);
        }
        
        function startAutoplay() {
            autoplayInterval = setInterval(nextSlide, intervalDuration);
        }
        
        function stopAutoplay() {
            if (autoplayInterval) {
                clearInterval(autoplayInterval);
            }
        }
        
        // Initialize first slide
        switchToSlide(0);
        
        // Start autoplay
        startAutoplay();
        
        // Indicator click handlers
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                stopAutoplay();
                switchToSlide(index);
                // Restart autoplay after 3 seconds
                setTimeout(startAutoplay, 3000);
            });
        });
        
        // Pause autoplay on hover
        const heroSection = document.querySelector('#home');
        if (heroSection) {
            heroSection.addEventListener('mouseenter', stopAutoplay);
            heroSection.addEventListener('mouseleave', startAutoplay);
        }
        
        // Handle video errors (fallback to images)
        videos.forEach((video, index) => {
            video.addEventListener('error', () => {
                console.log(`Video ${index + 1} failed to load, using fallback image`);
                // The fallback image is already set in the HTML
            });
            
            video.addEventListener('canplay', () => {
                console.log(`Video ${index + 1} is ready to play`);
            });
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.target.tagName.toLowerCase() === 'input' || e.target.tagName.toLowerCase() === 'textarea') {
                return; // Don't interfere with form inputs
            }
            
            switch(e.key) {
                case 'ArrowLeft':
                    stopAutoplay();
                    const prevIndex = (currentIndex - 1 + videos.length) % videos.length;
                    switchToSlide(prevIndex);
                    setTimeout(startAutoplay, 3000);
                    break;
                case 'ArrowRight':
                    stopAutoplay();
                    nextSlide();
                    setTimeout(startAutoplay, 3000);
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
                startAutoplay();
            }
        });
        
        console.log('Hero video carousel initialized with', videos.length, 'videos');
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