AOS.init({
    duration: 1000,
    once: true,
});

// Initialize Swiper for Product Categories
var swiper = new Swiper('.product-carousel', {
    slidesPerView: 1,
    spaceBetween: 30,
    loop: true,
    autoplay: {
        delay: 3500,
        disableOnInteraction: false,
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
        type: 'bullets',
    },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    breakpoints: {
        640: {
            slidesPerView: 2,
            spaceBetween: 20,
        },
        1024: {
            slidesPerView: 3,
            spaceBetween: 30,
        },
    },
});

// Scoped parallax for Solutions hero (no HTML changes required)
(function() {
    const hero = document.getElementById('solutions-hero');
    if (!hero) return;
    const img = hero.querySelector('img.absolute.object-cover');
    if (!img) return;
    const dampen = 30;
    const onScroll = () => {
        const rect = hero.getBoundingClientRect();
        if (rect.bottom <= 0 || rect.top >= window.innerHeight) return;
        const offset = rect.top * -1 / dampen;
        img.style.transform = `translateY(${offset}px) scale(1.05)`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
})();

// Magnetic buttons inside Solutions page CTAs
(function() {
    const candidates = document.querySelectorAll('#solutions-hero a, #general-cta a');
    const strength = 20;
    candidates.forEach((btn) => {
        const reset = () => { btn.style.transform = 'translate3d(0,0,0)'; };
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const relX = e.clientX - rect.left - rect.width / 2;
            const relY = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate3d(${relX/strength}px, ${relY/strength}px, 0)`;
        });
        btn.addEventListener('mouseleave', reset);
    });
})();

// Reveal-on-scroll using IntersectionObserver
(function() {
    const nodes = document.querySelectorAll('[data-reveal]');
    if (!nodes.length) return;
    const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    nodes.forEach((el) => io.observe(el));
})();