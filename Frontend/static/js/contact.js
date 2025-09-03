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
                    const phonePattern = /^[\+]?[1-9][\d]{8,15}$/;
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
            
            // Validate form before submission
            let isValid = true;
            const requiredFields = contactForm.querySelectorAll('[required]');
            
            requiredFields.forEach(field => {
                if (!validateRequired(field.value)) {
                    isValid = false;
                    field.style.borderColor = '#ef4444';
                }
            });
            
            const emailField = contactForm.querySelector('input[type="email"]');
            if (emailField && emailField.value && !validateEmail(emailField.value)) {
                isValid = false;
                emailField.style.borderColor = '#ef4444';
            }
            
            const phoneField = contactForm.querySelector('input[type="tel"]');
            if (phoneField && phoneField.value && !validatePhone(phoneField.value)) {
                isValid = false;
                phoneField.style.borderColor = '#ef4444';
            }
            
            if (!isValid) {
                showNotification('Please correct the errors in the form before submitting.', 'error');
                return;
            }
            
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
            
            // Submit form via AJAX
            const formData = new FormData(contactForm);
            
            fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showNotification(data.message || 'Thank you for your message! We\'ll get back to you within 24 hours.', 'success');
                    // Reset form
                    contactForm.reset();
                    // Reset field styles
                    formFields.forEach(field => {
                        field.style.borderColor = '#e5e7eb';
                        field.style.backgroundColor = 'rgba(245, 245, 220, 0.3)';
                    });
                } else {
                    showNotification(data.message || 'There was an error sending your message. Please try again.', 'error');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showNotification('There was an error sending your message. Please try again.', 'error');
            })
            .finally(() => {
                // Reset button
                submitBtn.innerHTML = originalContent;
                submitBtn.disabled = false;
            });
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
    const contactCards = document.querySelectorAll('.contact-card');
    contactCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
            this.style.boxShadow = '0 25px 50px rgba(218, 165, 32, 0.3)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
        });
    });

    // Phone number formatting for Tanzania numbers
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(phoneInput => {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            // Handle Tanzania numbers
            if (value.startsWith('255')) {
                value = '+' + value;
            } else if (value.startsWith('0')) {
                value = '+255' + value.substring(1);
            } else if (value.startsWith('7') && value.length >= 9) {
                value = '+255' + value;
            }
            
            // Format as +255 XXX XXX XXX
            if (value.startsWith('+255') && value.length > 4) {
                value = value.substring(0, 4) + ' ' + 
                       value.substring(4, 7) + ' ' + 
                       value.substring(7, 10) + ' ' + 
                       value.substring(10, 13);
            }
            
            e.target.value = value.trim();
        });
    });

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
    // Remove any existing notifications
    const existingNotifications = document.querySelectorAll('.fixed.top-20.right-4');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `fixed top-20 right-4 z-[9999] max-w-md p-4 rounded-lg shadow-lg transform translate-x-full transition-transform duration-300 ${
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
        notification.style.transform = 'translateX(100%)';
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
    // Allow Tanzania phone numbers
    const pattern = /^(\+255|255)?[0-9]{9,12}$/;
    return pattern.test(phone.replace(/\s/g, ''));
}

function validateRequired(value) {
    return value && value.trim().length > 0;
}