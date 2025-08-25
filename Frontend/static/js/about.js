document.addEventListener('DOMContentLoaded', function() {
    console.log('About.js loaded');
    
    // Initialize AOS if available
    if (typeof AOS !== 'undefined') {
        console.log('AOS is defined');
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true
        });
    } else {
        console.log('AOS is not defined');
    }
    
    // Hero Section Animations
    const heroSection = document.getElementById('hero-about');
    if (heroSection) {
        console.log('Hero section found');
        
        // Text animations
        const heroTitle = heroSection.querySelector('h1');
        if (heroTitle) {
            heroTitle.style.opacity = '0';
            heroTitle.style.transform = 'translateY(20px)';
            setTimeout(() => {
                heroTitle.style.transition = 'opacity 1s ease, transform 1s ease';
                heroTitle.style.opacity = '1';
                heroTitle.style.transform = 'translateY(0)';
            }, 500);
        }
        
        const heroParagraph = heroSection.querySelector('p');
        if (heroParagraph) {
            heroParagraph.style.opacity = '0';
            heroParagraph.style.transform = 'translateY(20px)';
            setTimeout(() => {
                heroParagraph.style.transition = 'opacity 1s ease, transform 1s ease';
                heroParagraph.style.opacity = '1';
                heroParagraph.style.transform = 'translateY(0)';
            }, 700);
        }
        
        const heroButton = heroSection.querySelector('a');
        if (heroButton) {
            heroButton.style.opacity = '0';
            heroButton.style.transform = 'translateY(20px)';
            setTimeout(() => {
                heroButton.style.transition = 'opacity 1s ease, transform 1s ease';
                heroButton.style.opacity = '1';
                heroButton.style.transform = 'translateY(0)';
            }, 900);
        }
        
        // Parallax effect on mouse move
        heroSection.addEventListener('mousemove', (e) => {
            const { clientX: x, clientY: y } = e;
            const { offsetWidth: width, offsetHeight: height } = heroSection;
            const xPercent = (x / width - 0.5) * 2;
            const yPercent = (y / height - 0.5) * 2;
            
            const bgElement = heroSection.querySelector('.absolute.inset-0.bg-cover');
            if (bgElement) {
                bgElement.style.transform = `translateX(${xPercent * 10}px) translateY(${yPercent * 10}px) scale(1.1)`;
            }
        });
        
        heroSection.addEventListener('mouseleave', () => {
            const bgElement = heroSection.querySelector('.absolute.inset-0.bg-cover');
            if (bgElement) {
                bgElement.style.transition = 'transform 0.5s ease-out';
                bgElement.style.transform = 'translateX(0) translateY(0) scale(1.1)';
            }
        });
    } else {
        console.error('Hero section not found');
    }
    
    // Initialize Swiper for testimonials if it exists
    const testimonialsSwiper = document.querySelector('.testimonials-slider');
    if (testimonialsSwiper && typeof Swiper !== 'undefined') {
        console.log('Initializing testimonials slider');
        new Swiper('.testimonials-slider', {
            slidesPerView: 1,
            spaceBetween: 30,
            loop: true,
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            autoplay: {
                delay: 5000,
            },
        });
    }
    
    // Join Us section parallax effect on scroll
    const joinUsSection = document.getElementById('join-us');
    if (joinUsSection) {
        window.addEventListener('scroll', () => {
            const scrollPosition = window.scrollY;
            const sectionTop = joinUsSection.offsetTop;
            const sectionHeight = joinUsSection.offsetHeight;
            
            // Only apply effect when section is in viewport
            if (scrollPosition > sectionTop - window.innerHeight && 
                scrollPosition < sectionTop + sectionHeight) {
                const scrollPercentage = (scrollPosition - (sectionTop - window.innerHeight)) / 
                                        (sectionHeight + window.innerHeight);
                joinUsSection.style.backgroundPositionY = `${20 + (scrollPercentage * 10)}%`;
            }
        });
    }

    // Continuous Horizontal Scroll for Partner Logos
    const marquee = document.querySelector('.logo-marquee');
    if (marquee) {
        console.log('Marquee found');
        const marqueeWidth = marquee.scrollWidth / 2; // Because we duplicated content
        let scrollPosition = 0;
        let animationId;
        let isPaused = false;
        
        function scrollMarquee() {
            if (!isPaused) {
                scrollPosition -= 1; // Adjust speed here
                if (Math.abs(scrollPosition) >= marqueeWidth) {
                    scrollPosition = 0;
                }
                marquee.style.transform = `translateX(${scrollPosition}px)`;
            }
            animationId = requestAnimationFrame(scrollMarquee);
        }
        
        // Start the animation
        scrollMarquee();
        
        // Pause/Resume on hover
        marquee.addEventListener('mouseenter', () => {
            isPaused = true;
        });
        
        marquee.addEventListener('mouseleave', () => {
            isPaused = false;
        });
    }

    // Timeline Animations with Intersection Observer
    const timelineItems = document.querySelectorAll('.timeline-item');
    if (timelineItems.length > 0) {
        console.log('Timeline items found:', timelineItems.length);
        
        const timelineObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    
                    // Animate the icon
                    const icon = entry.target.querySelector('.timeline-item-icon');
                    if (icon) {
                        icon.style.transform = 'scale(1)';
                    }
                    
                    // Animate the content
                    const content = entry.target.querySelector('.timeline-item-content');
                    if (content) {
                        content.style.opacity = '1';
                        content.style.transform = 'translateY(0)';
                    }
                } else {
                    entry.target.classList.remove('in-view');
                    
                    // Reset animations when out of view
                    const icon = entry.target.querySelector('.timeline-item-icon');
                    if (icon) {
                        icon.style.transform = 'scale(0)';
                    }
                    
                    const content = entry.target.querySelector('.timeline-item-content');
                    if (content) {
                        content.style.opacity = '0';
                        content.style.transform = 'translateY(20px)';
                    }
                }
            });
        }, { threshold: 0.2 });
        
        // Set initial styles and observe each timeline item
        timelineItems.forEach(item => {
            const icon = item.querySelector('.timeline-item-icon');
            if (icon) {
                icon.style.transform = 'scale(0)';
                icon.style.transition = 'transform 0.5s ease-out';
            }
            
            const content = item.querySelector('.timeline-item-content');
            if (content) {
                content.style.opacity = '0';
                content.style.transform = 'translateY(20px)';
                content.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            }
            
            timelineObserver.observe(item);
        });
    }
    // Counter Animation
    const counters = document.querySelectorAll('.counter');
    if (counters.length > 0) {
        console.log('Counters found:', counters.length);
        
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.getAttribute('data-target'));
                    let count = 0;
                    const duration = 2000; // 2 seconds
                    const interval = 50; // Update every 50ms
                    const steps = duration / interval;
                    const increment = target / steps;
                    
                    const updateCounter = () => {
                        count += increment;
                        if (count < target) {
                            counter.innerText = Math.ceil(count);
                            setTimeout(updateCounter, interval);
                        } else {
                            counter.innerText = target;
                        }
                    };
                    
                    updateCounter();
                    // Only observe once
                    counterObserver.unobserve(counter);
                }
            });
        }, { threshold: 0.5 });
        
        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    }

    // Team Section Parallax (Floating Cards)
    const teamMemberCards = document.querySelectorAll('.team-member-card');
    if (teamMemberCards.length > 0) {
        console.log('Team member cards found:', teamMemberCards.length);
        
        teamMemberCards.forEach(card => {
            // Generate random values for animation
            const amplitude = Math.random() * 20; // Random float between 0-20
            const duration = 2 + Math.random() * 2; // Random duration between 2-4 seconds
            const startPosition = Math.random() * 100; // Random starting position in the animation
            
            // Set initial position
            card.style.transition = 'none';
            card.style.transform = `translateY(0px)`;
            
            // Create animation function
            function animateCard(timestamp) {
                if (!card.animationStartTime) {
                    card.animationStartTime = timestamp - startPosition * 100; // Random start time
                }
                
                const elapsed = timestamp - card.animationStartTime;
                const position = amplitude * Math.sin((elapsed / (duration * 1000)) * (2 * Math.PI));
                
                card.style.transform = `translateY(${position}px)`;
                card.animationId = requestAnimationFrame(animateCard);
            }
            
            // Start animation
            card.animationId = requestAnimationFrame(animateCard);
        });
    }
    // Initialize Swiper for Testimonials Carousel
    const testimonialsCarousel = document.querySelector('.testimonials-carousel');
    if (testimonialsCarousel && typeof Swiper !== 'undefined') {
        console.log('Initializing testimonials carousel');
        new Swiper('.testimonials-carousel', {
            slidesPerView: 1,
            spaceBetween: 30,
            loop: true,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            breakpoints: {
                768: {
                    slidesPerView: 2,
                },
                1024: {
                    slidesPerView: 3,
                },
            },
        });
    }
    
    // Counter Animation for stat-number elements
    const statNumbers = document.querySelectorAll('.stat-number');
    if (statNumbers.length > 0) {
        console.log('Stat numbers found:', statNumbers.length);
        
        const statNumberObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.getAttribute('data-target') || counter.innerText);
                    let count = 0;
                    const duration = 2000; // 2 seconds
                    const interval = 50; // Update every 50ms
                    const steps = duration / interval;
                    const increment = target / steps;

                    const updateCounter = () => {
                        count += increment;
                        if (count < target) {
                            counter.innerText = Math.ceil(count);
                            setTimeout(updateCounter, interval);
                        } else {
                            counter.innerText = target;
                        }
                    };
                    
                    updateCounter();
                    // Only observe once
                    statNumberObserver.unobserve(counter);
                }
            });
        }, { threshold: 0.5 });
        
        statNumbers.forEach(counter => {
            statNumberObserver.observe(counter);
        });
    }

    // Vanilla Tilt initialization for cards
    if (typeof VanillaTilt !== 'undefined') {
        console.log('Initializing VanillaTilt');
        VanillaTilt.init(document.querySelectorAll('.tilt-card'), {
            max: 15,
            speed: 400,
            glare: true,
            'max-glare': 0.2,
        });
    } else {
        console.log('VanillaTilt is not defined');
    }

    // Note: Marquee animation is already implemented above

            

    // Note: Timeline animations are already implemented above using Intersection Observer
    
    // Team Section Parallax (Floating Cards)
    const teamCards = document.querySelectorAll('.team-member-card');
    if (teamCards.length > 0) {
        console.log('Team cards found:', teamCards.length);
        
        teamCards.forEach(card => {
            // Generate random values for animation
            const amplitude = Math.random() * 20; // Random float between 0-20
            const duration = 2 + Math.random() * 2; // Random duration between 2-4 seconds
            const startPosition = Math.random() * 100; // Random starting position in the animation
            
            // Set initial position
            card.style.transition = 'none';
            card.style.transform = `translateY(0px)`;
            
            // Create animation function
            function animateCard(timestamp) {
                if (!card.animationStartTime) {
                    card.animationStartTime = timestamp - startPosition * 100; // Random start time
                }
                
                const elapsed = timestamp - card.animationStartTime;
                const position = amplitude * Math.sin((elapsed / (duration * 1000)) * (2 * Math.PI));
                
                card.style.transform = `translateY(${position}px)`;
                card.animationId = requestAnimationFrame(animateCard);
            }
            
            // Start animation
            card.animationId = requestAnimationFrame(animateCard);
        });
    }

    // Vanilla Tilt initialization for data-tilt elements
    if (typeof VanillaTilt !== 'undefined') {
        console.log('Initializing VanillaTilt for data-tilt elements');
        VanillaTilt.init(document.querySelectorAll("[data-tilt]"), {
            max: 10,
            speed: 400,
            glare: true,
            "max-glare": 0.2,
        });
    }

    // FAQ Accordion
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    if (accordionHeaders.length > 0) {
        console.log('Accordion headers found:', accordionHeaders.length);
        accordionHeaders.forEach(button => {
            button.addEventListener('click', () => {
                const accordionContent = button.nextElementSibling;
                const icon = button.querySelector('i');

                // Close other open accordions
                document.querySelectorAll('.accordion-content').forEach(content => {
                    if (content !== accordionContent && content.classList.contains('block')) {
                        content.classList.remove('block');
                        content.classList.add('hidden');
                        content.previousElementSibling.querySelector('i').classList.remove('rotate-180');
                    }
                });

                // Toggle current accordion
                accordionContent.classList.toggle('hidden');
                accordionContent.classList.toggle('block');
                icon.classList.toggle('rotate-180');
            });
        });
    }

    // Contact Form Floating Labels
    const formInputs = document.querySelectorAll('.form-group input, .form-group textarea');
    if (formInputs.length > 0) {
        console.log('Form inputs found:', formInputs.length);
        formInputs.forEach(input => {
            const label = input.nextElementSibling;
            // Initial check for pre-filled fields
            if (input.value.trim() !== '') {
                label.classList.add('active');
            }

            input.addEventListener('focus', () => {
                label.classList.add('active');
            });

            input.addEventListener('blur', () => {
                if (input.value.trim() === '') {
                    label.classList.remove('active');
                }
            });
        });
    }
    
    // Testimonials Slider
    const testimonials = [
        {
            name: 'Aisha Khan',
            role: 'Lead Agronomist',
            quote: 'The innovative approach of Africana Ventures has transformed our farming practices. We have seen a significant increase in yield and a reduction in our environmental footprint.',
            photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        },
        {
            name: 'Bello Adebayo',
            role: 'Logistics Partner',
            quote: 'Their seamless logistics network ensures that our produce reaches the market fresh and on time. A truly reliable and professional partner.',
            photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        },
        {
            name: 'Chidinma Okeke',
            role: 'Community Leader',
            quote: 'Africana Ventures has empowered our community by providing training and resources. We are now more self-sufficient and prosperous than ever before.',
            photo: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?q=80&w=1886&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        },
        {
            name: 'Daniel Mwangi',
            role: 'Tech Innovator',
            quote: 'The integration of technology in agriculture by Africana Ventures is revolutionary. It has brought precision and efficiency to our farming methods.',
            photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        }
    ];

    const stackContainer = document.querySelector('.testimonial-stack');
    const nextBtn = document.getElementById('next-btn');
    const prevBtn = document.getElementById('prev-btn');
    const dotsContainer = document.getElementById('dot-indicators');

    let currentIndex = 0;

    function initSlider() {
        if (!stackContainer) {
            console.log('Testimonial stack container not found');
            return;
        }
        console.log('Initializing testimonial slider');
        stackContainer.innerHTML = '';
        if (dotsContainer) dotsContainer.innerHTML = '';

        testimonials.forEach((testimonial, index) => {
            // Create card
            const card = document.createElement('div');
            card.classList.add('testimonial-card', 'p-8', 'flex', 'flex-col', 'items-center', 'text-center');
            card.innerHTML = `
                <img src="${testimonial.photo}" alt="${testimonial.name}" class="w-24 h-24 rounded-full object-cover border-4 border-white/50 shadow-lg mb-4">
                <p class="text-gray-800 text-lg italic mb-4">"${testimonial.quote}"</p>
                <div>
                    <h3 class="font-bold text-xl text-gray-900">${testimonial.name}</h3>
                    <p class="text-gray-700">${testimonial.role}</p>
                </div>
            `;
            stackContainer.appendChild(card);

            // Create dot indicator
            if (dotsContainer) {
                const dot = document.createElement('button');
                dot.classList.add('w-3', 'h-3', 'rounded-full', 'transition-all', 'duration-300');
                dot.dataset.index = index;
                dotsContainer.appendChild(dot);
            }
        });

        updateSlider();
        addCardHoverEffect();
    }

    function updateSlider() {
        const cards = document.querySelectorAll('.testimonial-card');
        const dots = document.querySelectorAll('#dot-indicators button');

        cards.forEach((card, index) => {
            card.classList.remove('active', 'prev', 'next');
            if (index === currentIndex) {
                card.classList.add('active');
            } else if (index === (currentIndex - 1 + testimonials.length) % testimonials.length) {
                card.classList.add('prev');
            } else {
                card.classList.add('next');
            }
        });

        dots.forEach((dot, index) => {
            if (index === currentIndex) {
                dot.classList.add('bg-gray-800');
                dot.classList.remove('bg-gray-400');
            } else {
                dot.classList.add('bg-gray-400');
                dot.classList.remove('bg-gray-800');
            }
        });
    }

    function addCardHoverEffect() {
        const cards = document.querySelectorAll('.testimonial-card');
        if (cards.length === 0) {
            console.log('No testimonial cards found for hover effect');
            return;
        }
        console.log('Adding hover effect to testimonial cards');
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const { left, top, width, height } = card.getBoundingClientRect();
                const x = e.clientX - left - width / 2;
                const y = e.clientY - top - height / 2;
                const rotateX = (y / height) * -30;
                const rotateY = (x / width) * 30;
                card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
                card.style.boxShadow = '0 30px 50px rgba(0, 0, 0, 0.2)';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'rotateX(0) rotateY(0) scale(1)';
                card.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.1)';
            });
        });
    }

    // Add event listeners for testimonial navigation
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % testimonials.length;
            updateSlider();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
            updateSlider();
        });
    }

    if (dotsContainer) {
        dotsContainer.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON') {
                currentIndex = parseInt(e.target.dataset.index);
                updateSlider();
            }
        });
    }

    // Initialize the testimonial slider
    initSlider();

    // Overlapping Principle Cards Interaction
    const principles = {
        integrity: {
            title: 'Integrity',
            description: 'Upholding the highest ethical standards in all our interactions, fostering trust and transparency with every partner, farmer, and community member we serve.'
        },
        sustainability: {
            title: 'Sustainability',
            description: 'Committed to environmentally sound and economically viable practices that create lasting positive impact for both our planet and future generations.'
        },
        inclusivity: {
            title: 'Inclusivity',
            description: 'Empowering all members of the community, ensuring equitable access to opportunities regardless of gender, age, or background.'
        },
        innovation: {
            title: 'Innovation',
            description: 'Continuously seeking new and better ways to solve agricultural challenges through cutting-edge technology and creative problem-solving.'
        },
        passion: {
            title: 'Passion',
            description: 'Driven by a deep commitment to our mission and an unwavering dedication to transforming lives in agricultural communities across East Africa.'
        },
        empowerment: {
            title: 'Empowerment',
            description: 'Equipping individuals and communities with the knowledge, tools, and resources they need to achieve self-reliance and sustainable prosperity.'
        }
    };

    // Handle overlapping principle cards
    const principleCards = document.querySelectorAll('.principle-card');
    const principleDescriptionEnhanced = document.getElementById('principle-description-enhanced');
    const principleTitleEnhanced = document.getElementById('principle-title-enhanced');
    const principleDescriptionText = document.getElementById('principle-description-text');

    if (principleCards.length > 0) {
        console.log('Initializing overlapping principle cards interaction');
        
        principleCards.forEach((card, index) => {
            // Add subtle animations to each card
            card.style.animationDelay = `${index * 0.2}s`;
            
            card.addEventListener('mouseenter', () => {
                // Reset all cards z-index
                principleCards.forEach(c => {
                    c.classList.remove('active');
                    c.style.zIndex = '';
                });
                
                // Bring current card to top
                card.classList.add('active');
                card.style.zIndex = '100';
                
                const principleKey = card.dataset.principle;
                const principle = principles[principleKey];
                
                if (principle && principleTitleEnhanced && principleDescriptionText) {
                    principleTitleEnhanced.textContent = principle.title;
                    principleDescriptionText.textContent = principle.description;
                    
                    // Add animation to description container
                    if (principleDescriptionEnhanced) {
                        principleDescriptionEnhanced.style.transform = 'scale(1.02)';
                        principleDescriptionEnhanced.style.boxShadow = '0 25px 50px rgba(218, 165, 32, 0.3)';
                    }
                }
            });
            
            card.addEventListener('mouseleave', () => {
                // Reset card state
                card.classList.remove('active');
                card.style.zIndex = '';
                
                // Reset description container
                if (principleDescriptionEnhanced) {
                    principleDescriptionEnhanced.style.transform = 'scale(1)';
                    principleDescriptionEnhanced.style.boxShadow = '0 20px 40px rgba(0,0,0,0.2)';
                    
                    // Reset to default text after a short delay
                    setTimeout(() => {
                        if (!document.querySelector('.principle-card:hover')) {
                            principleTitleEnhanced.textContent = 'Explore Our Values';
                            principleDescriptionText.textContent = 'Hover over or click our principle cards to discover the core values that drive our mission to transform agricultural communities across East Africa.';
                        }
                    }, 100);
                }
            });
            
            // Add click functionality for mobile
            card.addEventListener('click', () => {
                // Reset all cards z-index
                principleCards.forEach(c => {
                    c.classList.remove('active');
                    c.style.zIndex = '';
                });
                
                // Bring current card to top
                card.classList.add('active');
                card.style.zIndex = '100';
                
                const principleKey = card.dataset.principle;
                const principle = principles[principleKey];
                
                if (principle && principleTitleEnhanced && principleDescriptionText) {
                    principleTitleEnhanced.textContent = principle.title;
                    principleDescriptionText.textContent = principle.description;
                }
            });
        });
        
        // Set initial state
        if (principleTitleEnhanced && principleDescriptionText) {
            principleTitleEnhanced.textContent = 'Explore Our Values';
            principleDescriptionText.textContent = 'Hover over or click our principle cards to discover the core values that drive our mission to transform agricultural communities across East Africa.';
        }
    }

    // Hero Section Background Parallax on Mousemove
    const heroAboutSection = document.getElementById('hero-about');
    const heroBgDiv = heroAboutSection ? heroAboutSection.querySelector('.absolute.inset-0.bg-cover') : null;

    if (heroAboutSection && heroBgDiv) {
        console.log('Setting up hero section parallax effect');
        heroAboutSection.addEventListener('mousemove', (e) => {
            const { left, top, width, height } = heroAboutSection.getBoundingClientRect();
            const x = (e.clientX - left) / width; // 0 to 1
            const y = (e.clientY - top) / height; // 0 to 1

            // Adjust these values for desired parallax intensity
            const moveX = (x - 0.5) * 10; // -5 to 5
            const moveY = (y - 0.5) * 10; // -5 to 5

            heroBgDiv.style.backgroundPosition = `calc(50% + ${moveX}%) calc(50% + ${moveY}%)`;
        });

        heroAboutSection.addEventListener('mouseleave', () => {
            // Reset background position when mouse leaves
            heroBgDiv.style.backgroundPosition = '50% 50%';
        });
    }

    console.log('About page animations initialized successfully');
});