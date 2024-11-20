document.addEventListener("DOMContentLoaded", () => {
    const toggleButton = document.getElementById('theme-toggle');
    const moonIcon = toggleButton.querySelector('.moon-icon');
    const sunIcon = toggleButton.querySelector('.sun-icon');
    
    // Get stored theme preference or system preference
    let darkMode = localStorage.getItem('darkMode') === 'enabled' || 
                   (localStorage.getItem('darkMode') === null && 
                    window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    // Initial theme setup
    updateTheme();
    
    toggleButton.addEventListener('click', () => {
        darkMode = !darkMode;
        updateTheme();
    });
    
    function updateTheme() {
        if (darkMode) {
            document.body.classList.add('darkmode');
            moonIcon.style.display = 'none';
            sunIcon.style.display = 'block';
            localStorage.setItem('darkMode', 'enabled');
            
            // Update meta theme-color for mobile browsers
            document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#121212');
        } else {
            document.body.classList.remove('darkmode');
            moonIcon.style.display = 'block';
            sunIcon.style.display = 'none';
            localStorage.setItem('darkMode', 'disabled');
            
            // Reset meta theme-color
            document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#ffffff');
        }
    }

    // Listen for system theme changes
    if (window.matchMedia) {
        const systemDarkMode = window.matchMedia('(prefers-color-scheme: dark)');
        systemDarkMode.addEventListener('change', (e) => {
            if (localStorage.getItem('darkMode') === null) {
                darkMode = e.matches;
                updateTheme();
            }
        });
    }

    // Modal functionality
    const loginModal = document.getElementById('loginModal');
    const signupModal = document.getElementById('signupModal');
    const loginTrigger = document.getElementById('loginTrigger');
    const signupTrigger = document.getElementById('signupTrigger');
    const closeButtons = document.querySelectorAll('.close');

    // Open modals
    loginTrigger.addEventListener('click', () => {
        loginModal.classList.add('show');
        animateModal(loginModal);
    });

    signupTrigger.addEventListener('click', () => {
        signupModal.classList.add('show');
        animateModal(signupModal);
    });

    // Close modals
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            loginModal.classList.remove('show');
            signupModal.classList.remove('show');
        });
    });

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === loginModal) {
            loginModal.classList.remove('show');
        }
        if (e.target === signupModal) {
            signupModal.classList.remove('show');
        }
    });

    // Switch between modals
    window.switchModal = function(modalId) {
        loginModal.classList.remove('show');
        signupModal.classList.remove('show');
        document.getElementById(modalId).classList.add('show');
    };

    // Add this to your existing DOMContentLoaded event listener
    const faqItems = document.querySelectorAll('.faq_item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq_question');
        
        question.addEventListener('click', () => {
            // Close other open items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });

    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Elements to animate on scroll
    const animateElements = document.querySelectorAll('.company_card, .mindguide_card, .sound_card, .plan_card, .faq_item');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        observer.observe(el);
    });

    // Typewriter effect for titles
    function typeWriter(element) {
        element.classList.add('typewriter');
    }

    // Add typewriter effect to specific titles
    const titles = [
        document.querySelector('.company_text'),
        document.querySelector('.faq_title'),
        document.querySelector('#aboutus_title')
    ];

    titles.forEach(title => {
        if (title) {
            typeWriter(title);
        }
    });

    // Stagger animation for nav links
    const navLinks = document.querySelectorAll('.header_nav_link');
    navLinks.forEach((link, index) => {
        link.style.opacity = '0';
        link.style.animation = `slideIn 0.5s ease forwards ${index * 0.1}s`;
    });

    // Add animation to modal opening
    function animateModal(modal) {
        modal.querySelector('.modal-content').classList.add('animate-scale-in');
    }
});

  
    
  
  