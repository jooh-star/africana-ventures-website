/**
 * Admin Panel JavaScript
 * Clean, focused scripts for admin functionality without frontend interference
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // Auto-dismiss all notifications after 5 seconds
    function initializeFlashMessages() {
        // Initialize dismissal time for all existing flash messages
        const flashMessages = document.querySelectorAll('.flash-message');
        flashMessages.forEach(message => {
            if (!message.dataset.dismissalStarted) {
                message.dataset.dismissalStarted = Date.now();
            }
        });
        
        dismissAllNotifications();
    }
    
    // Periodically check for new notifications and dismiss them
    function setupNotificationWatcher() {
        setInterval(() => {
            dismissAllNotifications();
        }, 1000); // Check every second
    }
    
    // Dismiss all notifications that have been visible for more than 5 seconds
    function dismissAllNotifications() {
        // Handle flash messages (server-side notifications)
        const flashMessages = document.querySelectorAll('.flash-message');
        
        flashMessages.forEach(message => {
            // Check if this message was created recently (within the last 5 seconds)
            if (!message.dataset.dismissalStarted) {
                message.dataset.dismissalStarted = Date.now();
            }
            
            const timeSinceCreation = Date.now() - parseInt(message.dataset.dismissalStarted);
            if (timeSinceCreation > 5000) { // 5 seconds
                if (message.parentElement && message.style.opacity !== '0') {
                    message.style.transition = 'all 0.3s ease';
                    message.style.opacity = '0';
                    message.style.transform = 'translateX(100%)';
                    setTimeout(() => {
                        if (message.parentElement) {
                            message.remove();
                        }
                    }, 300);
                }
            }
        });
        
        // Handle custom notifications (JavaScript-created notifications)
        const customNotifications = document.querySelectorAll('.admin-notification');
        customNotifications.forEach(notification => {
            // Check if this notification was created recently (within the last 5 seconds)
            if (!notification.dataset.dismissalStarted) {
                notification.dataset.dismissalStarted = Date.now();
            }
            
            const timeSinceCreation = Date.now() - parseInt(notification.dataset.dismissalStarted);
            if (timeSinceCreation > 5000) { // 5 seconds
                if (notification.parentElement && notification.style.opacity !== '0') {
                    notification.style.transition = 'all 0.3s ease';
                    notification.style.opacity = '0';
                    notification.style.transform = 'translateX(100%)';
                    setTimeout(() => {
                        if (notification.parentElement) {
                            notification.remove();
                        }
                    }, 300);
                }
            }
        });
    }
    
    // Enhanced table interactions
    function initializeTableInteractions() {
        const tables = document.querySelectorAll('table');
        
        tables.forEach(table => {
            const rows = table.querySelectorAll('tbody tr');
            
            rows.forEach(row => {
                row.addEventListener('mouseenter', function() {
                    this.style.backgroundColor = 'rgba(59, 130, 246, 0.05)';
                });
                
                row.addEventListener('mouseleave', function() {
                    this.style.backgroundColor = '';
                });
            });
        });
    }
    
    // Form validation enhancements
    function initializeFormValidation() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
            
            if (submitBtn) {
                form.addEventListener('submit', function() {
                    submitBtn.disabled = true;
                    const originalText = submitBtn.textContent;
                    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Processing...';
                    
                    // Re-enable after 5 seconds as fallback
                    setTimeout(() => {
                        submitBtn.disabled = false;
                        submitBtn.textContent = originalText;
                    }, 5000);
                });
            }
        });
    }
    
    // Confirmation dialogs for delete actions
    function initializeDeleteConfirmations() {
        const deleteButtons = document.querySelectorAll('a[href*="delete"], button[data-action="delete"]');
        
        deleteButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                const itemName = this.dataset.itemName || 'this item';
                const confirmMessage = `Are you sure you want to delete ${itemName}? This action cannot be undone.`;
                
                if (!confirm(confirmMessage)) {
                    e.preventDefault();
                    return false;
                }
            });
        });
    }
    
    // File upload progress indicators
    function initializeFileUploadProgress() {
        const fileInputs = document.querySelectorAll('input[type="file"]');
        
        fileInputs.forEach(input => {
            input.addEventListener('change', function() {
                const file = this.files[0];
                if (file) {
                    const maxSize = 16 * 1024 * 1024; // 16MB
                    
                    if (file.size > maxSize) {
                        alert('File size must be less than 16MB');
                        this.value = '';
                        return;
                    }
                    
                    // Show file info
                    const fileInfo = document.createElement('div');
                    fileInfo.className = 'text-sm text-gray-600 mt-2';
                    fileInfo.innerHTML = `
                        <i class="fas fa-file mr-2"></i>
                        Selected: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)
                    `;
                    
                    // Remove existing file info
                    const existingInfo = this.parentNode.querySelector('.file-info');
                    if (existingInfo) {
                        existingInfo.remove();
                    }
                    
                    fileInfo.classList.add('file-info');
                    this.parentNode.appendChild(fileInfo);
                }
            });
        });
    }
    
    // Search functionality
    function initializeSearch() {
        const searchInputs = document.querySelectorAll('input[type="search"], input[placeholder*="Search"]');
        
        searchInputs.forEach(input => {
            let searchTimeout;
            
            input.addEventListener('input', function() {
                clearTimeout(searchTimeout);
                const searchTerm = this.value.toLowerCase();
                
                searchTimeout = setTimeout(() => {
                    const searchableElements = document.querySelectorAll('[data-searchable]');
                    
                    searchableElements.forEach(element => {
                        const text = element.textContent.toLowerCase();
                        const isVisible = text.includes(searchTerm);
                        
                        element.style.display = isVisible ? '' : 'none';
                    });
                }, 300);
            });
        });
    }
    
    // Sidebar active state management
    function initializeSidebar() {
        const sidebarLinks = document.querySelectorAll('.sidebar-link');
        const currentPath = window.location.pathname;
        
        sidebarLinks.forEach(link => {
            const href = link.getAttribute('href');
            
            if (href && currentPath.includes(href) && href !== '/') {
                link.classList.add('active');
            }
        });
    }
    
    // Statistics animations (for dashboard)
    function initializeStatisticsAnimation() {
        const statNumbers = document.querySelectorAll('[data-stat-number]');
        
        statNumbers.forEach(element => {
            const finalValue = parseInt(element.dataset.statNumber);
            const duration = 2000; // 2 seconds
            const increment = finalValue / (duration / 16); // 60fps
            let currentValue = 0;
            
            const updateCounter = () => {
                currentValue += increment;
                if (currentValue >= finalValue) {
                    element.textContent = finalValue;
                } else {
                    element.textContent = Math.floor(currentValue);
                    requestAnimationFrame(updateCounter);
                }
            };
            
            // Start animation when element is visible
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        updateCounter();
                        observer.unobserve(entry.target);
                    }
                });
            });
            
            observer.observe(element);
        });
    }
    
    // Dropdown menus
    function initializeDropdowns() {
        const dropdownToggles = document.querySelectorAll('[data-dropdown-toggle]');
        
        dropdownToggles.forEach(toggle => {
            const targetId = toggle.dataset.dropdownToggle;
            const dropdown = document.getElementById(targetId);
            
            if (dropdown) {
                toggle.addEventListener('click', (e) => {
                    e.stopPropagation();
                    dropdown.classList.toggle('hidden');
                });
                
                // Close dropdown when clicking outside
                document.addEventListener('click', () => {
                    dropdown.classList.add('hidden');
                });
                
                dropdown.addEventListener('click', (e) => {
                    e.stopPropagation();
                });
            }
        });
    }
    
    // Modal management
    function initializeModalManagement() {
        const modals = document.querySelectorAll('[id*="Modal"]');
        
        modals.forEach(modal => {
            // Close modal on outside click
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    modal.classList.add('hidden');
                    document.body.style.overflow = ''; // Restore scrolling
                }
            });
            
            // Close modal on escape key
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
                    modal.classList.add('hidden');
                    document.body.style.overflow = ''; // Restore scrolling
                }
            });
        });
        
        // Handle modal open buttons
        const modalTriggers = document.querySelectorAll('[data-modal-target]');
        modalTriggers.forEach(trigger => {
            trigger.addEventListener('click', function() {
                const targetModal = document.getElementById(this.dataset.modalTarget);
                if (targetModal) {
                    targetModal.classList.remove('hidden');
                    document.body.style.overflow = 'hidden'; // Prevent background scrolling
                }
            });
        });
        
        // Handle modal close buttons
        const closeButtons = document.querySelectorAll('[data-modal-close]');
        closeButtons.forEach(button => {
            button.addEventListener('click', function() {
                const modal = this.closest('[id*="Modal"]');
                if (modal) {
                    modal.classList.add('hidden');
                    document.body.style.overflow = ''; // Restore scrolling
                }
            });
        });
    }
    
    // Smooth scrolling for admin content
    function initializeAdminScrolling() {
        // Smooth scroll to top button
        const scrollToTopBtn = document.createElement('button');
        scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
        scrollToTopBtn.className = 'fixed bottom-6 right-6 w-12 h-12 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 opacity-0 pointer-events-none z-50';
        scrollToTopBtn.setAttribute('aria-label', 'Scroll to top');
        document.body.appendChild(scrollToTopBtn);
        
        // Show/hide scroll to top button
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                scrollToTopBtn.classList.remove('opacity-0', 'pointer-events-none');
            } else {
                scrollToTopBtn.classList.add('opacity-0', 'pointer-events-none');
            }
        });
        
        // Scroll to top functionality
        scrollToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        // Smooth scroll for anchor links within admin
        const anchorLinks = document.querySelectorAll('a[href^="#"]');
        anchorLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    e.preventDefault();
                    const offsetTop = targetElement.offsetTop - 80; // Account for header
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    // Mobile sidebar functionality
    function initializeMobileSidebar() {
        const mobileMenuButton = document.getElementById('mobileMenuButton');
        const mobileSidebar = document.getElementById('mobileSidebar');
        const closeMobileSidebar = document.getElementById('closeMobileSidebar');
        const mainContent = document.querySelector('main');
        
        if (mobileMenuButton && mobileSidebar) {
            mobileMenuButton.addEventListener('click', function(e) {
                e.stopPropagation();
                mobileSidebar.classList.add('open');
                document.querySelector('.sidebar-mobile').classList.add('open');
                // Prevent body scrolling when sidebar is open
                document.body.style.overflow = 'hidden';
            });
        }
        
        if (closeMobileSidebar) {
            closeMobileSidebar.addEventListener('click', function() {
                mobileSidebar.classList.remove('open');
                document.querySelector('.sidebar-mobile').classList.remove('open');
                // Restore body scrolling
                document.body.style.overflow = '';
            });
        }
        
        // Close sidebar when clicking on overlay
        if (mobileSidebar) {
            mobileSidebar.addEventListener('click', function(e) {
                if (e.target === mobileSidebar) {
                    mobileSidebar.classList.remove('open');
                    document.querySelector('.sidebar-mobile').classList.remove('open');
                    // Restore body scrolling
                    document.body.style.overflow = '';
                }
            });
        }
        
        // Close sidebar when clicking on main content
        if (mainContent) {
            mainContent.addEventListener('click', function() {
                if (mobileSidebar && mobileSidebar.classList.contains('open')) {
                    mobileSidebar.classList.remove('open');
                    document.querySelector('.sidebar-mobile').classList.remove('open');
                    // Restore body scrolling
                    document.body.style.overflow = '';
                }
            });
        }
    }
    
    // Initialize all components
    initializeFlashMessages();
    setupNotificationWatcher(); // Start watching for notifications
    initializeTableInteractions();
    initializeFormValidation();
    initializeDeleteConfirmations();
    initializeFileUploadProgress();
    initializeSearch();
    initializeSidebar();
    initializeStatisticsAnimation();
    initializeDropdowns();
    initializeModalManagement();
    initializeAdminScrolling();
    initializeMobileSidebar(); // Added mobile sidebar initialization
    
    console.log('Admin panel JavaScript initialized successfully');
});

// Utility functions for admin operations
window.AdminUtils = {
    
    // Show loading state
    showLoading: function(element, message = 'Loading...') {
        const originalContent = element.innerHTML;
        element.dataset.originalContent = originalContent;
        element.innerHTML = `<i class="fas fa-spinner fa-spin mr-2"></i>${message}`;
        element.disabled = true;
    },
    
    // Hide loading state
    hideLoading: function(element) {
        if (element.dataset.originalContent) {
            element.innerHTML = element.dataset.originalContent;
            delete element.dataset.originalContent;
        }
        element.disabled = false;
    },
    
    // Show notification
    showNotification: function(message, type = 'info') {
        // Check if a notification with the same message already exists to avoid duplicates
        const existingNotifications = document.querySelectorAll('.admin-notification, .flash-message');
        for (let i = 0; i < existingNotifications.length; i++) {
            const notificationText = existingNotifications[i].querySelector('span');
            if (notificationText && notificationText.textContent.includes(message)) {
                // Update existing notification instead of creating a new one
                if (existingNotifications[i].classList.contains('admin-notification')) {
                    existingNotifications[i].className = `admin-notification fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${this.getNotificationClasses(type)}`;
                }
                // Reset the creation time so it gets 5 more seconds
                existingNotifications[i].dataset.dismissalStarted = Date.now();
                return;
            }
        }
        
        const notification = document.createElement('div');
        notification.className = `admin-notification fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${this.getNotificationClasses(type)}`;
        notification.dataset.dismissalStarted = Date.now(); // Track when this notification was created
        notification.innerHTML = `
            <div class="flex items-center">
                <i class="fas ${this.getNotificationIcon(type)} mr-3"></i>
                <span>${message}</span>
                <button type="button" class="ml-4 text-gray-400 hover:text-gray-600 focus:outline-none" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        document.body.appendChild(notification);
    },

    getNotificationClasses: function(type) {
        const classes = {
            success: 'bg-green-50 border border-green-200 text-green-800',
            error: 'bg-red-50 border border-red-200 text-red-800',
            warning: 'bg-yellow-50 border border-yellow-200 text-yellow-800',
            info: 'bg-blue-50 border border-blue-200 text-blue-800'
        };
        return classes[type] || classes.info;
    },
    
    getNotificationIcon: function(type) {
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };
        return icons[type] || icons.info;
    }
};