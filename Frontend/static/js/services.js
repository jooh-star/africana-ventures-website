<script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.9.1/gsap.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.9.1/ScrollTrigger.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/vanilla-tilt/1.7.2/vanilla-tilt.min.js"></script>
    <script src="https://unpkg.com/swiper/swiper-bundle.min.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', function() {

            // AOS initialization removed, using GSAP ScrollTrigger instead

            // GSAP ScrollTrigger for various animations
            gsap.registerPlugin(ScrollTrigger);

            // Hero Section Animations
            gsap.from("#hero-services h1", {
                y: 50,
                opacity: 0,
                duration: 1.2,
                ease: "power3.out",
                delay: 0.5
            });
            gsap.from("#hero-services p", {
                y: 50,
                opacity: 0,
                duration: 1.2,
                ease: "power3.out",
                delay: 0.7
            });
            gsap.from("#hero-services a", {
                y: 50,
                opacity: 0,
                duration: 1.2,
                ease: "power3.out",
                delay: 0.9
            });

            // Hero Section Parallax
            gsap.to("#hero-services video", {
                y: "-20%",
                ease: "none",
                scrollTrigger: {
                    trigger: "#hero-services",
                    start: "top top",
                    end: "bottom top",
                    scrub: true
                }
            });

            // Expertise Ecosystem Entrance Animation
            gsap.from(".expertise-cell", {
                opacity: 0,
                scale: 0.8,
                y: 50,
                duration: 1,
                ease: "power3.out",
                stagger: 0.1,
                scrollTrigger: {
                    trigger: "#expertise-ecosystem",
                    start: "top center",
                    toggleActions: "play reverse play reverse",
                }
            });

            // Expertise Cell Hover Effects
            document.querySelectorAll('.expertise-cell').forEach(cell => {
                const cellContent = cell.querySelector('.cell-content');

                // Store original clip-path for reversion
                const originalClipPath = cell.style.clipPath;

                cell.addEventListener('mouseenter', () => {
                    // Cell Mitosis / Morphing Shape
                    gsap.to(cell, {
                        clipPath: "polygon(20% 0%, 80% 0%, 100% 50%, 80% 100%, 20% 100%, 0% 50%)", // More organic/amoeba-like shape
                        duration: 0.5,
                        ease: "power2.out",
                        overwrite: true
                    });

                    // Reality Inversion (subtle filter change)
                    gsap.to(cell, {
                        filter: "blur(0px) contrast(1.5)",
                        backdropFilter: "brightness(0.8)",
                        duration: 0.3,
                        ease: "power1.out",
                        overwrite: true
                    });

                    // Content bleed (simple scale for now)
                    gsap.to(cellContent, {
                        scale: 1.05,
                        duration: 0.3,
                        ease: "power1.out",
                        overwrite: true
                    });

                    // Image fade and text prominence
                    gsap.to(cell.querySelector('img'), { opacity: 0.1, duration: 0.3 });
                    gsap.to(cellContent.querySelector('h3'), { y: -10, duration: 0.3 });
                    gsap.to(cellContent.querySelector('p'), { y: -10, duration: 0.3 });
                });

                cell.addEventListener('mouseleave', () => {
                    // Revert Cell Mitosis / Morphing Shape
                    gsap.to(cell, {
                        clipPath: originalClipPath, // Revert to original hexagonal shape
                        duration: 0.5,
                        ease: "power2.out",
                        overwrite: true
                    });

                    // Revert Reality Inversion
                    gsap.to(cell, {
                        filter: "blur(0.5px) contrast(1.2)",
                        backdropFilter: "brightness(1.1)",
                        duration: 0.3,
                        ease: "power1.out",
                        overwrite: true
                    });

                    // Revert Content bleed
                    gsap.to(cellContent, {
                        scale: 1,
                        duration: 0.3,
                        ease: "power1.out",
                        overwrite: true
                    });

                    // Revert Image fade and text prominence
                    gsap.to(cell.querySelector('img'), { opacity: 1, duration: 0.3 });
                    gsap.to(cellContent.querySelector('h3'), { y: 0, duration: 0.3 });
                    gsap.to(cellContent.querySelector('p'), { y: 0, duration: 0.3 });
                });
            });

            // Vertical Timeline Scroll
            document.querySelectorAll('.timeline-item-wrapper').forEach((item, i) => {
                const line = item.closest('.timeline-container').querySelector('.timeline-line');
                const dot = item.querySelector('.timeline-dot');
                const content = item.querySelector('.timeline-item');

                gsap.fromTo(dot, 
                    { scale: 0 }, 
                    { 
                        scale: 1, 
                        duration: 0.5, 
                        ease: "back.out(1.7)",
                        scrollTrigger: {
                            trigger: item,
                            start: "top center",
                            toggleActions: "play none none reverse",
                        }
                    }
                );

                gsap.fromTo(content, 
                    { opacity: 0, x: i % 2 === 0 ? -50 : 50 }, 
                    { 
                        opacity: 1, 
                        x: 0, 
                        duration: 0.8, 
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: item,
                            start: "top center",
                            toggleActions: "play reverse play reverse", // Animate in and out
                        }
                    }
                );

                gsap.fromTo(item.querySelector('img'),
                    { scale: 0.8, opacity: 0 },
                    {
                        scale: 1,
                        opacity: 1,
                        duration: 0.6,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: item,
                            start: "top center",
                            toggleActions: "play reverse play reverse",
                        }
                    }
                );

                // Line filling animation (conceptual, actual implementation might vary based on line structure)
                gsap.to(line, {
                    height: "100%", // This will be controlled by scrollTrigger
                    ease: "none",
                    scrollTrigger: {
                        trigger: ".timeline-container",
                        start: "top center",
                        end: "bottom center",
                        scrub: true,
                    }
                });
            });

            

            // Split-Screen Interactive Section
            if (document.querySelector('.split-screen-slider')) {
                new Swiper('.split-screen-slider', {
                    slidesPerView: 1,
                    loop: true,
                    autoplay: {
                        delay: 4000,
                        disableOnInteraction: false,
                    },
                    pagination: {
                        el: '.swiper-pagination',
                        clickable: true,
                    },
                });
            }

            // Split-Screen Text Slide-in
            gsap.from(".split-screen-right h2, .split-screen-right p, .split-screen-right a", {
                x: 100,
                opacity: 0,
                stagger: 0.2,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: ".split-screen-right",
                    start: "top 80%",
                    toggleActions: "play none none reverse"
                }
            });

            // Split-Screen Photo Parallax/Rotation
            gsap.to(".split-screen-left img", {
                y: "-10%",
                rotation: "2deg",
                ease: "none",
                scrollTrigger: {
                    trigger: ".split-screen-section",
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true
                }
            });

            // Bottom CTA / Shared Contact Section - Mouse Movement Effect
            const ctaSection = document.getElementById('contact-cta-bottom');
            if (ctaSection) {
                ctaSection.addEventListener('mousemove', (e) => {
                    const rect = ctaSection.getBoundingClientRect();
                    const x = (e.clientX - rect.left) / rect.width - 0.5;
                    const y = (e.clientY - rect.top) / rect.height - 0.5;

                    gsap.to(ctaSection, {
                        backgroundPositionX: `${-x * 20}px`,
                        backgroundPositionY: `${-y * 20}px`,
                        duration: 0.5,
                        ease: "power1.out"
                    });
                });
            }

            // Vanilla Tilt initialization
            VanillaTilt.init(document.querySelectorAll("[data-tilt]"), {
                max: 10,
                speed: 400,
                glare: true,
                "max-glare": 0.2,
            });
        });
    </script>