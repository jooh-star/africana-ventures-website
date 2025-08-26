document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS with custom settings
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        mirror: false,
        offset: 120
    });

    // Enhanced form functionality
    const contactForm = document.querySelector('form[method="POST"]');
    
    if (contactForm) {
        // Form field animations and validation
        const formFields = contactForm.querySelectorAll('input, select, textarea');
        
        formFields.forEach(field => {
            // Add floating label effect
            field.addEventListener('focus', function() {
                this.parentElement.classList.add('field-focused');
                this.style.transform = 'scale(1.02)';
            });
            
            field.addEventListener('blur', function() {
                this.parentElement.classList.remove('field-focused');
                this.style.transform = 'scale(1)';
                
                // Add validation styling
                if (this.value.trim() !== '') {
                    this.style.borderColor = '#DAA520';
                    this.style.backgroundColor = 'rgba(218, 165, 32, 0.1)';
                } else if (this.hasAttribute('required')) {
                    this.style.borderColor = '#e5e7eb';
                    this.style.backgroundColor = 'rgba(245, 245, 220, 0.3)';
                }
            });

            // Real-time validation feedback
            field.addEventListener('input', function() {
                if (this.type === 'email') {
                    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (emailPattern.test(this.value)) {
                        this.style.borderColor = '#22c55e';
                    } else if (this.value.length > 0) {
                        this.style.borderColor = '#ef4444';
                    }
                }
                
                if (this.type === 'tel') {
                    const phonePattern = /^[\+]?[1-9][\d]{0,15}$/;
                    if (phonePattern.test(this.value.replace(/\s/g, ''))) {
                        this.style.borderColor = '#22c55e';
                    } else if (this.value.length > 0) {
                        this.style.borderColor = '#ef4444';
                    }
                }
            });
        });

        // Enhanced form submission
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalContent = submitBtn.innerHTML;
            
            // Show loading state
            submitBtn.innerHTML = `
                <span class="flex items-center justify-center">
                    <svg class="animate-spin -ml-1 mr-3 h-6 w-6 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending Message...
                </span>
            `;
            submitBtn.disabled = true;
            
            // Simulate form submission (in real implementation, this would be an AJAX call)
            setTimeout(() => {
                // Show success message
                showNotification('Thank you for your message! We\'ll get back to you within 24 hours.', 'success');
                
                // Reset form
                contactForm.reset();
                
                // Reset button
                submitBtn.innerHTML = originalContent;
                submitBtn.disabled = false;
                
                // Reset field styles
                formFields.forEach(field => {
                    field.style.borderColor = '#e5e7eb';
                    field.style.backgroundColor = 'rgba(245, 245, 220, 0.3)';
                });
            }, 2000);
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80; // Account for header
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Contact info card interactions
    const contactCards = document.querySelectorAll('.bg-white\\/10');
    contactCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
            this.style.boxShadow = '0 20px 40px rgba(218, 165, 32, 0.3)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
        });
    });

    // Parallax effect for hero section
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('section');
        
        if (hero) {
            const speed = 0.5;
            hero.style.transform = `translateY(${scrolled * speed}px)`;
        }
    });

    // Phone number formatting
    const phoneInput = document.querySelector('input[type="tel"]');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.startsWith('254')) {
                value = '+' + value;
            } else if (value.startsWith('0')) {
                value = '+254' + value.substring(1);
            }
            
            // Format as +254 XXX XXX XXX
            if (value.length > 4) {
                value = value.substring(0, 4) + ' ' + 
                       value.substring(4, 7) + ' ' + 
                       value.substring(7, 10) + ' ' + 
                       value.substring(10, 13);
            }
            
            e.target.value = value.trim();
        });
    }

    // Character counter for message field
    const messageField = document.querySelector('textarea[name="message"]');
    if (messageField) {
        const maxLength = 1000;
        const counter = document.createElement('div');
        counter.className = 'text-sm text-gray-500 text-right mt-2';
        counter.innerHTML = `0/${maxLength} characters`;
        messageField.parentNode.appendChild(counter);
        
        messageField.addEventListener('input', function() {
            const length = this.value.length;
            counter.innerHTML = `${length}/${maxLength} characters`;
            
            if (length > maxLength * 0.9) {
                counter.style.color = '#ef4444';
            } else if (length > maxLength * 0.7) {
                counter.style.color = '#f59e0b';
            } else {
                counter.style.color = '#6b7280';
            }
        });
    }

    console.log('Contact page JavaScript initialized successfully!');
});

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-20 right-4 z-50 max-w-md p-4 rounded-lg shadow-lg transform translate-x-full transition-transform duration-300 ${
        type === 'success' ? 'bg-green-500 text-white' : 
        type === 'error' ? 'bg-red-500 text-white' : 
        'bg-blue-500 text-white'
    }`;
    
    notification.innerHTML = `
        <div class="flex items-center justify-between">
            <div class="flex items-center">
                <svg class="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    ${type === 'success' ? 
                        '<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>' :
                        '<path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>'
                    }
                </svg>
                <span>${message}</span>
            </div>
            <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-white hover:text-gray-200">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
                </svg>
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Slide in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(full)';
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 300);
    }, 5000);
}

// Contact form validation utilities
function validateEmail(email) {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
}

function validatePhone(phone) {
    const pattern = /^[\+]?[1-9][\d]{8,14}$/;
    return pattern.test(phone.replace(/\s/g, ''));
}

function validateRequired(value) {
    return value && value.trim().length > 0;
}