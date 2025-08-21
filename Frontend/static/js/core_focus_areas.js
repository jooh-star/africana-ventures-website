// Initialize AOS
AOS.init({
    duration: 1000,
    once: true,
    mirror: false
});

// GSAP ScrollTrigger for parallax and zoom effects
gsap.registerPlugin(ScrollTrigger);

document.querySelectorAll('.core-focus-block-image').forEach(image => {
    gsap.to(image, {
        backgroundPositionY: '20%', // Parallax effect
        scale: 1.03, // Zoom effect
        ease: 'none',
        scrollTrigger: {
            trigger: image,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
        }
    });
});

// Subtle tilt on hover for content cards (using CSS for simplicity, GSAP can be more complex)
// This is handled by the CSS :hover pseudo-class for transform and box-shadow