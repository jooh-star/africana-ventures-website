// Contact and Testimonial Form Handling

document.addEventListener('DOMContentLoaded', function() {
    // Contact Form Handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleContactForm(this);
        });
    }

    // Testimonial Form Handling
    const testimonialForm = document.getElementById('testimonialForm');
    if (testimonialForm) {
        testimonialForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleTestimonialForm(this);
        });
    }
});

// Handle Contact Form Submission
function handleContactForm(form) {
    const submitBtn = form.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    submitBtn.classList.add('loading');

    // Get form data
    const formData = new FormData(form);

    // Send AJAX request
    fetch('/submit_contact', {
        method: 'POST',
        headers: {
            'X-CSRFToken': formData.get('csrf_token')
        },
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        const container = form.closest('.contact-form-container') || form;
        if (data.success) {
            showAlert('success', data.message, container);
            form.reset();
        } else {
            showAlert('danger', data.message, container);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        const container = form.closest('.contact-form-container') || form;
        showAlert('danger', 'An error occurred. Please try again.', container);
    })
    .finally(() => {
        // Reset button state
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
    });
}

// Handle Testimonial Form Submission
function handleTestimonialForm(form) {
    const submitBtn = form.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
    submitBtn.disabled = true;
    submitBtn.classList.add('loading');

    // Get form data
    const formData = new FormData(form);

    // Send AJAX request
    fetch('/submit_testimonial', {
        method: 'POST',
        headers: {
            'X-CSRFToken': formData.get('csrf_token')
        },
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        const container = form.closest('.testimonial-form-container') || form;
        if (data.success) {
            showAlert('success', data.message, container);
            form.reset();
        } else {
            showAlert('danger', data.message, container);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        const container = form.closest('.testimonial-form-container') || form;
        showAlert('danger', 'An error occurred. Please try again.', container);
    })
    .finally(() => {
        // Reset button state
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
    });
}

// Show Alert Message
function showAlert(type, message, containerEl) {
    const container = containerEl || document.body;
    // Remove existing alerts in this container
    container.querySelectorAll('.alert').forEach(a => a.remove());
    // Create new alert (Bootstrap 5 markup)
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-triangle'}"></i>
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    container.insertBefore(alertDiv, container.firstChild);
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 5000);
}

// Form Validation
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    let isValid = true;

    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.classList.add('is-invalid');
            isValid = false;
        } else {
            input.classList.remove('is-invalid');
            input.classList.add('is-valid');
        }
    });

    // Email validation
    const emailInput = form.querySelector('input[type="email"]');
    if (emailInput && emailInput.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value)) {
            emailInput.classList.add('is-invalid');
            isValid = false;
        } else {
            emailInput.classList.remove('is-invalid');
            emailInput.classList.add('is-valid');
        }
    }

    return isValid;
}

// Real-time validation
document.addEventListener('DOMContentLoaded', function() {
    const forms = document.querySelectorAll('#contactForm, #testimonialForm');
    
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                if (this.classList.contains('is-invalid')) {
                    validateField(this);
                }
            });
        });
    });
});

// Validate individual field
function validateField(field) {
    const value = field.value.trim();
    
    // Remove existing validation classes
    field.classList.remove('is-valid', 'is-invalid');
    
    // Check if required field is empty
    if (field.hasAttribute('required') && !value) {
        field.classList.add('is-invalid');
        return false;
    }
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            field.classList.add('is-invalid');
            return false;
        }
    }
    
    // Phone validation (basic)
    if (field.type === 'tel' && value) {
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
        if (!phoneRegex.test(value)) {
            field.classList.add('is-invalid');
            return false;
        }
    }
    
    // If we get here, field is valid
    if (value) {
        field.classList.add('is-valid');
    }
    
    return true;
}

// File upload preview for testimonial photos
document.addEventListener('DOMContentLoaded', function() {
    const photoInput = document.getElementById('testimonialPhoto');
    if (photoInput) {
        photoInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                // Validate file type
                const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
                if (!allowedTypes.includes(file.type)) {
                    showAlert('danger', 'Please select a valid image file (JPG, PNG, or GIF).');
                    this.value = '';
                    return;
                }
                
                // Validate file size (5MB max)
                const maxSize = 5 * 1024 * 1024; // 5MB
                if (file.size > maxSize) {
                    showAlert('danger', 'Image file size must be less than 5MB.');
                    this.value = '';
                    return;
                }
                
                // Show preview (optional)
                const reader = new FileReader();
                reader.onload = function(e) {
                    // You can add preview functionality here
                    console.log('Photo selected:', file.name);
                };
                reader.readAsDataURL(file);
            }
        });
    }
});

// Smooth scrolling for anchor links
document.addEventListener('DOMContentLoaded', function() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// FAQ Accordion functionality
document.addEventListener('DOMContentLoaded', function() {
    const accordionButtons = document.querySelectorAll('.accordion-button');
    
    accordionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const target = this.getAttribute('data-bs-target');
            const targetElement = document.querySelector(target);
            
            if (targetElement) {
                const isCollapsed = targetElement.classList.contains('show');
                
                // Close all other accordion items
                document.querySelectorAll('.accordion-collapse').forEach(item => {
                    item.classList.remove('show');
                });
                
                // Toggle current item
                if (!isCollapsed) {
                    targetElement.classList.add('show');
                }
            }
        });
    });
});
