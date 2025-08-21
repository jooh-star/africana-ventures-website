<script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.9.1/gsap.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.9.1/ScrollTrigger.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/vanilla-tilt/1.7.2/vanilla-tilt.min.js"></script>
    <script src="https://unpkg.com/swiper/swiper-bundle.min.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', function() {

            // AOS initialization removed, using GSAP ScrollTrigger for specific animations

            // Initialize Swiper for Testimonials Carousel
            if (document.querySelector('.testimonials-carousel')) {
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

            // Counter Animation
            const counters = document.querySelectorAll('.stat-number');
            const animateCounter = (counter) => {
                const target = parseInt(counter.getAttribute('data-target'));
                const duration = 2000;
                let start = 0;
                let startTime = null;

                const step = (timestamp) => {
                    if (!startTime) startTime = timestamp;
                    const progress = Math.min((timestamp - startTime) / duration, 1);
                    counter.textContent = Math.floor(progress * target).toLocaleString();
                    if (progress < 1) {
                        requestAnimationFrame(step);
                    } else {
                        counter.textContent = target.toLocaleString();
                    }
                };
                requestAnimationFrame(step);
            };

            const counterObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateCounter(entry.target);
                        counterObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });

            counters.forEach(counter => {
                counterObserver.observe(counter);
            });

            // GSAP ScrollTrigger for various animations
            gsap.registerPlugin(ScrollTrigger);

            // Hero Section Animations
            gsap.from("#hero h1 span", {
                y: 50,
                opacity: 0,
                stagger: 0.2,
                duration: 1,
                ease: "power3.out",
                delay: 0.5
            });
            gsap.from("#hero p span", {
                y: 50,
                opacity: 0,
                stagger: 0.2,
                duration: 1,
                ease: "power3.out",
                delay: 0.7
            });
            gsap.from("#hero a", {
                y: 50,
                opacity: 0,
                duration: 1,
                ease: "power3.out",
                delay: 0.9
            });

            // Parallax for Hero and CTA sections
            gsap.to("#hero", {
                backgroundPositionY: "20%",
                ease: "none",
                scrollTrigger: {
                    trigger: "#hero",
                    start: "top top",
                    end: "bottom top",
                    scrub: true
                }
            });

            // Partnership Ecosystem Entrance Animation removed, implementing Vibrant Orbit Dance animations

            gsap.to("#join-us", {
                backgroundPositionY: "20%",
                ease: "none",
                scrollTrigger: {
                    trigger: "#join-us",
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true
                }
            });

            // Continuous Horizontal Scroll for Partner Logos
            const marquee = document.querySelector('.logo-marquee');
            if (marquee) {
                const marqueeWidth = marquee.scrollWidth / 2; // Because we duplicated content

                gsap.to(marquee, {
                    x: -marqueeWidth,
                    duration: 30, // Adjust duration for speed
                    ease: "none",
                    repeat: -1,
                    modifiers: {
                        x: gsap.utils.unitize(x => parseFloat(x) % marqueeWidth) // Seamless loop
                    }
                });

                // Pause/Resume on hover
                marquee.addEventListener('mouseenter', () => gsap.to(marquee, { timeScale: 0 }));
                marquee.addEventListener('mouseleave', () => gsap.to(marquee, { timeScale: 1 }));
            }

            

            // Timeline Animations (GSAP ScrollTrigger)
            document.querySelectorAll('.timeline-item').forEach((item, i) => {
                gsap.fromTo(item.querySelector('.timeline-item-icon'), 
                    { scale: 0 }, 
                    { 
                        scale: 1, 
                        duration: 0.5, 
                        ease: "back.out(1.7)",
                        scrollTrigger: {
                            trigger: item,
                            start: "top 80%",
                            toggleActions: "play none none reverse",
                            onEnter: () => item.classList.add('in-view'),
                            onLeaveBack: () => item.classList.remove('in-view')
                        }
                    }
                );
                gsap.fromTo(item.querySelector('.timeline-item-content'), 
                    { opacity: 0, y: 20 }, 
                    { 
                        opacity: 1, 
                        y: 0, 
                        duration: 0.6, 
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: item,
                            start: "top 80%",
                            toggleActions: "play none none reverse"
                        }
                    }
                );
                gsap.fromTo(item.querySelector('.timeline-item::before'), 
                    { scaleY: 0 }, 
                    { 
                        scaleY: 1, 
                        duration: 0.8, 
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: item,
                            start: "top 80%",
                            toggleActions: "play none none reverse"
                        }
                    }
                );
            });

            // Team Section Parallax (Floating Cards)
            document.querySelectorAll('.team-member-card').forEach(card => {
                gsap.to(card, {
                    y: () => Math.random() * 20 - 10, // Random float effect
                    ease: "none",
                    scrollTrigger: {
                        trigger: card,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: true
                    }
                });
            });

            // Vanilla Tilt initialization
            VanillaTilt.init(document.querySelectorAll("[data-tilt]"), {
                max: 10,
                speed: 400,
                glare: true,
                "max-glare": 0.2,
            });

            // FAQ Accordion
            document.querySelectorAll('.accordion-header').forEach(button => {
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

            // Contact Form Floating Labels
            document.querySelectorAll('.form-group input, .form-group textarea').forEach(input => {
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
                if (!stackContainer) return;
                stackContainer.innerHTML = '';
                dotsContainer.innerHTML = '';

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
                    const dot = document.createElement('button');
                    dot.classList.add('w-3', 'h-3', 'rounded-full', 'transition-all', 'duration-300');
                    dot.dataset.index = index;
                    dotsContainer.appendChild(dot);
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

            initSlider();

            const principles = {
                integrity: {
                    title: 'Integrity',
                    description: 'Upholding the highest ethical standards in all our interactions, fostering trust and transparency.'
                },
                sustainability: {
                    title: 'Sustainability',
                    description: 'Committed to environmentally sound and economically viable practices for long-term impact.'
                },
                inclusivity: {
                    title: 'Inclusivity',
                    description: 'Empowering all members of the community, ensuring equitable access to opportunities.'
                },
                innovation: {
                    title: 'Innovation',
                    description: 'Continuously seeking new and better ways to solve challenges and drive progress.'
                },
                passion: {
                    title: 'Passion',
                    description: 'Driven by a deep commitment to our mission and the communities we serve.'
                },
                empowerment: {
                    title: 'Empowerment',
                    description: 'Equipping individuals and communities with the resources to achieve self-reliance.'
                }
            };

            const honeycombCells = document.querySelectorAll('.honeycomb-cell');
            const principleTitle = document.getElementById('principle-title');
            const principleDescription = document.getElementById('principle-description');

            if (honeycombCells.length > 0 && principleTitle && principleDescription) {
                honeycombCells.forEach(cell => {
                    cell.addEventListener('mouseenter', () => {
                        const principleKey = cell.dataset.principle;
                        const principle = principles[principleKey];

                        principleTitle.textContent = principle.title;
                        principleDescription.textContent = principle.description;
                    });
                });

                // Set initial description
                const initialPrinciple = principles[honeycombCells[0].dataset.principle];
                principleTitle.textContent = initialPrinciple.title;
                principleDescription.textContent = initialPrinciple.description;
            }
        });
    </script>