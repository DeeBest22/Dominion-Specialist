
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu elements
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    const body = document.body;
    
    // Create overlay element
    const overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    body.appendChild(overlay);
    
    // Mobile menu state
    let isMobileMenuOpen = false;
    
    // Function to open mobile menu
    function openMobileMenu() {
        isMobileMenuOpen = true;
        sidebar.classList.add('mobile-open');
        overlay.classList.add('active');
        body.style.overflow = 'hidden'; // Prevent background scrolling
        
        // Update toggle button icon to X
        mobileMenuToggle.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
        `;
        
        // Add escape key listener
        document.addEventListener('keydown', handleEscapeKey);
    }
    
    // Function to close mobile menu
    function closeMobileMenu() {
        isMobileMenuOpen = false;
        sidebar.classList.remove('mobile-open');
        overlay.classList.remove('active');
        body.style.overflow = ''; // Restore scrolling
        
        // Update toggle button icon back to hamburger
        mobileMenuToggle.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
        `;
        
        // Remove escape key listener
        document.removeEventListener('keydown', handleEscapeKey);
    }
    
    // Toggle mobile menu
    function toggleMobileMenu() {
        if (isMobileMenuOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    }
    
    // Handle escape key
    function handleEscapeKey(event) {
        if (event.key === 'Escape') {
            closeMobileMenu();
        }
    }
    
    // Event listeners
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    }
    
    // Close menu when clicking overlay
    overlay.addEventListener('click', closeMobileMenu);
    
    // Close menu when clicking sidebar links (for better UX)
    const sidebarLinks = document.querySelectorAll('.sidebar-nav-link');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', () => {
            // Only close on mobile
            if (window.innerWidth < 1024 && isMobileMenuOpen) {
                closeMobileMenu();
            }
        });
    });
    
    // Handle window resize
    function handleResize() {
        // Close mobile menu if window becomes large
        if (window.innerWidth >= 1024 && isMobileMenuOpen) {
            closeMobileMenu();
        }
    }
    
    // Throttled resize handler for better performance
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(handleResize, 100);
    });
    
    // Initial check for mobile menu visibility
    handleResize();
    
    // ================================
    // DARK MODE TOGGLE
    // ================================
    
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    // Set initial theme
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    // Update toggle text
    function updateDarkModeToggle() {
        const theme = document.documentElement.getAttribute('data-theme');
        if (darkModeToggle) {
            darkModeToggle.textContent = theme === 'dark' ? 'Light Mode' : 'Dark Mode';
        }
    }
    
    updateDarkModeToggle();
    
    // Dark mode toggle handler
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', function(e) {
            e.preventDefault();
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateDarkModeToggle();
        });
    }
    
    // ================================
    // SMOOTH ANIMATIONS & INTERACTIONS
    // ================================
    
    // Add loading states to buttons
    function addLoadingState(button, originalText) {
        button.disabled = true;
        button.innerHTML = `
            <svg class="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 12a9 9 0 11-6.219-8.56"/>
            </svg>
            Loading...
        `;
        
        // Remove loading state after 2 seconds (adjust as needed)
        setTimeout(() => {
            button.disabled = false;
            button.textContent = originalText;
        }, 2000);
    }
    
    // Enhanced form submission with loading states
    const submitButton = document.getElementById('submit-article');
    if (submitButton) {
        const originalText = submitButton.textContent;
        submitButton.addEventListener('click', function(e) {
            // Only add loading state if form is valid
            const form = document.getElementById('article-form');
            if (form && form.checkValidity()) {
                addLoadingState(this, originalText);
            }
        });
    }
    
    // Add smooth hover effects to cards and interactive elements
    const interactiveElements = document.querySelectorAll('.btn, .sidebar-nav-link, .form-control');
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-1px)';
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // ================================
    // ENHANCED FORM FUNCTIONALITY
    // ================================
    
    // Auto-resize textarea content
    const editorContent = document.getElementById('article-content');
    if (editorContent) {
        editorContent.addEventListener('input', function() {
            // Sync with hidden input
            const hiddenInput = document.getElementById('article-content-hidden');
            if (hiddenInput) {
                hiddenInput.value = this.innerHTML;
            }
        });
    }
    
    // File upload preview functionality
    const mediaUpload = document.getElementById('media-upload');
    const mediaPreview = document.getElementById('media-preview');
    
    if (mediaUpload && mediaPreview) {
        mediaUpload.addEventListener('change', function(e) {
            const files = Array.from(e.target.files);
            mediaPreview.innerHTML = ''; // Clear existing previews
            
            files.forEach((file, index) => {
                if (file.type.startsWith('image/')) {
                    const img = document.createElement('img');
                    img.src = URL.createObjectURL(file);
                    img.alt = `Preview ${index + 1}`;
                    img.style.opacity = '0';
                    img.onload = () => {
                        img.style.transition = 'opacity 0.3s ease';
                        img.style.opacity = '1';
                    };
                    mediaPreview.appendChild(img);
                } else if (file.type.startsWith('video/')) {
                    const video = document.createElement('video');
                    video.src = URL.createObjectURL(file);
                    video.controls = true;
                    video.style.opacity = '0';
                    video.onloadedmetadata = () => {
                        video.style.transition = 'opacity 0.3s ease';
                        video.style.opacity = '1';
                    };
                    mediaPreview.appendChild(video);
                }
            });
        });
    }
    
    // ================================
    // ACCESSIBILITY ENHANCEMENTS
    // ================================
    
    // Trap focus in mobile menu when open
    function trapFocus(element) {
        const focusableElements = element.querySelectorAll(
            'a[href], button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled])'
        );
        
        const firstFocusableElement = focusableElements[0];
        const lastFocusableElement = focusableElements[focusableElements.length - 1];
        
        element.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstFocusableElement) {
                        lastFocusableElement.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastFocusableElement) {
                        firstFocusableElement.focus();
                        e.preventDefault();
                    }
                }
            }
        });
    }
    
    // Apply focus trap when mobile menu is open
    sidebar.addEventListener('transitionend', function() {
        if (isMobileMenuOpen) {
            trapFocus(sidebar);
            // Focus first link in sidebar
            const firstLink = sidebar.querySelector('.sidebar-nav-link');
            if (firstLink) {
                firstLink.focus();
            }
        }
    });
    
    // ================================
    // PERFORMANCE OPTIMIZATIONS
    // ================================
    
    // Lazy load images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    // Debounced scroll handler for performance
    let scrollTimeout;
    const handleScroll = () => {
        const header = document.querySelector('.header');
        const scrollY = window.scrollY;
        
        if (scrollY > 10) {
            header.style.boxShadow = 'var(--shadow-lg)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.boxShadow = 'var(--shadow-sm)';
            header.style.backdropFilter = 'none';
        }
    };
    
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(handleScroll, 10);
    }, { passive: true });
    
    // ================================
    // TOUCH GESTURES FOR MOBILE
    // ================================
    
    let touchStartX = 0;
    let touchEndX = 0;
    
    // Swipe to open/close sidebar on mobile
    document.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    document.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipeGesture();
    }, { passive: true });
    
    function handleSwipeGesture() {
        const swipeThreshold = 50;
        const swipeDistance = touchEndX - touchStartX;
        
        // Only handle swipes on mobile
        if (window.innerWidth < 1024) {
            // Swipe right to open menu (from left edge)
            if (swipeDistance > swipeThreshold && touchStartX < 50 && !isMobileMenuOpen) {
                openMobileMenu();
            }
            // Swipe left to close menu
            else if (swipeDistance < -swipeThreshold && isMobileMenuOpen) {
                closeMobileMenu();
            }
        }
    }
    
    // ================================
    // FORM VALIDATION ENHANCEMENTS
    // ================================
    
    // Real-time form validation
    const formInputs = document.querySelectorAll('.form-control');
    formInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            // Clear error state on input
            this.classList.remove('error');
            const errorMsg = this.parentNode.querySelector('.field-error');
            if (errorMsg) {
                errorMsg.remove();
            }
        });
    });
    
    function validateField(field) {
        let isValid = true;
        let errorMessage = '';
        
        // Remove existing error
        field.classList.remove('error');
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
        
        // Required field validation
        if (field.hasAttribute('required') && !field.value.trim()) {
            isValid = false;
            errorMessage = 'This field is required';
        }
        
        // Email validation
        if (field.type === 'email' && field.value && !isValidEmail(field.value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
        
        // Show error if invalid
        if (!isValid) {
            field.classList.add('error');
            const errorDiv = document.createElement('div');
            errorDiv.className = 'field-error';
            errorDiv.textContent = errorMessage;
            errorDiv.style.color = 'var(--color-error)';
            errorDiv.style.fontSize = '0.75rem';
            errorDiv.style.marginTop = 'var(--space-1)';
            field.parentNode.appendChild(errorDiv);
        }
        
        return isValid;
    }
    
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    
    // Add CSS for error states
    const style = document.createElement('style');
    style.textContent = `
        .form-control.error {
            border-color: var(--color-error) !important;
            box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
        }
        
        .animate-spin {
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);

});
