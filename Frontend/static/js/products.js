document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS with custom settings
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        mirror: false,
        offset: 120
    });

    const productListContainer = document.getElementById('product-list');
    const categoryBtns = document.querySelectorAll('.morph-category');

    // Function to generate and render product cards
    function renderProductCards(productsToRender) {
        productListContainer.innerHTML = ''; // Clear existing products

        if (productsToRender.length === 0) {
            productListContainer.innerHTML = '<p class="text-cream text-center col-span-full">No products found for this category.</p>';
            return;
        }

        productsToRender.forEach((product, index) => {
            // Construct image URL; prefer url_path if provided, else build from relative_path
            const imageUrl = product.url_path ? `/static/${product.url_path}` : `/static/uploads/${product.relative_path}`;
            const productTitle = product.description || 'Product';
            const productDescription = product.usage_context || '';
            const productAltText = product.alt_text || productTitle;
            const categorySlug = (product.subsection_name || '').toLowerCase();
            const categoryMap = {
                'horticulture': 'Horticulture',
                'cereals': 'Cereals & Legumes',
                'oilseeds': 'Oilseeds & Nuts',
                'inputs': 'Farm Inputs'
            };
            const categoryLabel = categoryMap[categorySlug] || 'All Products';
            const productCategoryData = categorySlug || 'uncategorized';

            // Card template inspired by provided design (Tailwind classes)
            const inStock = (product.stock_status || '').toLowerCase() === 'in stock';
            const stockBadge = inStock
              ? '<span class="ml-2 rounded bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">In Stock</span>'
              : '<span class="ml-2 rounded bg-rose-100 px-2.5 py-0.5 text-xs font-semibold text-rose-700">Out of Stock</span>';

            const productCardHtml = `
                <div class="product-card relative flex w-full flex-col overflow-hidden rounded-lg border border-gray-100 bg-white shadow-md" data-category="${productCategoryData}">
                  <a class="relative mx-3 mt-3 flex h-60 overflow-hidden rounded-xl" href="/contact?product=${encodeURIComponent(productTitle)}">
                    <img class="object-cover w-full h-full" src="${imageUrl}" alt="${productAltText}" loading="lazy" sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" />
                    <span class="absolute top-0 left-0 m-2 rounded-full bg-black/80 px-2 text-center text-xs font-medium text-white">${categoryLabel}</span>
                  </a>
                  <div class="mt-4 px-5 pb-5">
                    <a href="/contact?product=${encodeURIComponent(productTitle)}">
                      <h5 class="text-lg sm:text-xl tracking-tight text-slate-900">${productTitle}</h5>
                    </a>
                    ${productDescription ? `<p class=\"mt-1 text-sm text-slate-600\">${productDescription}</p>` : ''}
                    <div class="mt-3 mb-4 flex items-center justify-between">
                      <div class="flex items-center">
                        <svg aria-hidden="true" class="h-5 w-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                        <svg aria-hidden="true" class="h-5 w-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                        <svg aria-hidden="true" class="h-5 w-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                        <svg aria-hidden="true" class="h-5 w-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                        <svg aria-hidden="true" class="h-5 w-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                        <span class="ml-2 rounded bg-yellow-200 px-2.5 py-0.5 text-xs font-semibold">5.0</span>
                        ${stockBadge}
                      </div>
                      <div></div>
                    </div>
                    <a href="/contact?product=${encodeURIComponent(productTitle)}" class="flex items-center justify-center rounded-md bg-slate-900 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-300">
                      <svg xmlns="http://www.w3.org/2000/svg" class="mr-2 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      Add to cart
                    </a>
                  </div>
                </div>
            `;
            productListContainer.insertAdjacentHTML('beforeend', productCardHtml);
        });

        // Re-apply AOS to newly rendered cards
        AOS.refresh();
        // Re-attach event listeners to newly rendered cards
        attachProductCardEventListeners();

        // Reveal newly rendered cards with a staggered animation
        const newlyRenderedCards = document.querySelectorAll('#product-list .product-card');
        newlyRenderedCards.forEach((card, idx) => {
            setTimeout(() => {
                card.classList.add('visible');
            }, 100 + idx * 100);
        });
    }

    // Function to attach event listeners to product cards
    function attachProductCardEventListeners() {
        const currentProductCards = document.querySelectorAll('.product-card');
        currentProductCards.forEach(card => {
            // Add hover effect with micro-interactions
            card.addEventListener('mouseenter', function() {
                const img = this.querySelector('img');
                const title = this.querySelector('h3');
                const learnMore = this.querySelector('button');
                
                if (img) {
                    img.style.transform = 'scale(1.05)';
                }
                if (title) {
                    title.style.color = '#DAA520';
                }
                if (learnMore) {
                    learnMore.style.transform = 'translateX(5px)';
                }
            });
            
            card.addEventListener('mouseleave', function() {
                const img = this.querySelector('img');
                const title = this.querySelector('h3');
                const learnMore = this.querySelector('button');
                
                if (img) {
                    img.style.transform = 'scale(1)';
                }
                if (title) {
                    title.style.color = '#F5F5DC'; // Revert to original color
                }
                if (learnMore) {
                    learnMore.style.transform = 'translateX(0)';
                }
            });

            // Add click animation
            card.addEventListener('click', function() {
                this.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
            });
        });
    }

    // Category Filter Functionality
    categoryBtns.forEach(categoryBtn => {
        categoryBtn.addEventListener('click', () => {
            const selectedCategory = categoryBtn.dataset.category;
            
            // Update active category button
            categoryBtns.forEach(btn => {
                btn.classList.remove('active');
                btn.classList.remove('bg-dark-green', 'text-cream'); // Remove active styles
                btn.classList.add('bg-transparent', 'border-dark-green', 'text-dark-green'); // Add default styles
            });
            categoryBtn.classList.add('active');
            categoryBtn.classList.remove('bg-transparent', 'border-dark-green', 'text-dark-green'); // Remove default styles
            categoryBtn.classList.add('bg-dark-green', 'text-cream'); // Add active styles

            // Filter products and re-render
            let filteredProducts = [];
            if (selectedCategory === 'all') {
                filteredProducts = productImagesData;
            } else {
                filteredProducts = productImagesData.filter(product => product.subsection_name === selectedCategory);
            }
            renderProductCards(filteredProducts);

            // Ensure visibility class is applied after filtering render
            const filteredCards = document.querySelectorAll('#product-list .product-card');
            filteredCards.forEach((card, idx) => {
                setTimeout(() => card.classList.add('visible'), 80 + idx * 80);
            });
        });
    });

    // Initial render of all products on page load
    renderProductCards(productImagesData);

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Scroll reveal effect for quality cards
    const revealElements = document.querySelectorAll('.scroll-reveal');
    
    const revealOnScroll = () => {
        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('revealed');
            }
        });
    };
    
    // Initial check
    revealOnScroll();
    
    // Check on scroll
    window.addEventListener('scroll', revealOnScroll);

    // Search functionality (if search input exists) - needs to be updated for dynamic cards
    // const searchInput = document.querySelector('#product-search');
    // if (searchInput) {
    //     searchInput.addEventListener('input', function() {
    //         const searchTerm = this.value.toLowerCase();
            
    //         productCards.forEach(card => {
    //             const title = card.querySelector('h3').textContent.toLowerCase();
    //             const description = card.querySelector('p').textContent.toLowerCase();
                
    //             if (title.includes(searchTerm) || description.includes(searchTerm)) {
    //                 card.style.display = 'block';
    //                 card.style.opacity = '1';
    //             } else {
    //                 card.style.opacity = '0.3';
    //             }
    //         });
    //     });
    // }

    // Add loading animation for images - needs to be updated for dynamic cards
    // const productImages = document.querySelectorAll('.product-card img');
    // productImages.forEach(img => {
    //     img.addEventListener('load', function() {
    //         this.style.opacity = '1';
    //         this.style.transform = 'scale(1)';
    //     });
        
    //     // Set initial state
    //     img.style.opacity = '0';
    //     img.style.transform = 'scale(0.9)';
    //     img.style.transition = 'all 0.5s ease-out';
    // });

    // Parallax effect for hero section
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const heroSection = document.querySelector('.hero-section'); // Changed to .hero-section
        
        if (heroSection) {
            const speed = 0.5;
            heroSection.style.transform = `translateY(${scrolled * speed}px)`;
        }
    });

    // Add floating animation to hero elements
    const floatingElements = document.querySelectorAll('.floating-element'); // Changed to .floating-element
    floatingElements.forEach((element, index) => {
        element.style.animationDelay = `${index * 0.5}s`;
    });

    // Counter animation for statistics
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const increment = target / 100;
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.ceil(current);
                setTimeout(updateCounter, 20);
            } else {
                counter.textContent = target;
            }
        };
        
        // Start counter when element is in view
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCounter();
                    counterObserver.unobserve(entry.target);
                }
            });
        });
        
        counterObserver.observe(counter);
    });

    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('button, .btn, a[class*="bg-"]');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Enhanced category button animations
    // This part is now handled by the categoryBtn click listener for active state
    // and the CSS for hover effects.

    // Lazy loading for images
    const lazyImages = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));

    console.log('Products page JavaScript initialized successfully!');
});

// CSS for ripple effect (injected via JavaScript)
const style = document.createElement('style');
style.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background-color: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    @keyframes bounce {
        0%, 20%, 53%, 80%, 100% {
            transform: translate3d(0,0,0);
        }
        40%, 43% {
            transform: translate3d(0,-30px,0);
        }
        70% {
            transform: translate3d(0,-15px,0);
        }
        90% {
            transform: translate3d(0,-4px,0);
        }
    }
`;
document.head.appendChild(style);