document.addEventListener("DOMContentLoaded", () => {
    const toggleButton = document.getElementById('theme-toggle');
    const moonIcon = toggleButton.querySelector('.moon-icon');
    const sunIcon = toggleButton.querySelector('.sun-icon');

    let darkMode = localStorage.getItem('darkMode') === 'enabled' ||
                   (localStorage.getItem('darkMode') === null &&
                    window.matchMedia('(prefers-color-scheme: dark)').matches);

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
            document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#121212');
        } else {
            document.body.classList.remove('darkmode');
            moonIcon.style.display = 'block';
            sunIcon.style.display = 'none';
            localStorage.setItem('darkMode', 'disabled');
            document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#33af4a');
        }
    }

    if (window.matchMedia) {
        const systemDarkMode = window.matchMedia('(prefers-color-scheme: dark)');
        systemDarkMode.addEventListener('change', (e) => {
            if (localStorage.getItem('darkMode') === null) {
                darkMode = e.matches;
                updateTheme();
            }
        });
    }

    const loginModal = document.getElementById('loginModal');
    const signupModal = document.getElementById('signupModal');
    const loginTrigger = document.getElementById('loginTrigger');
    const signupTrigger = document.getElementById('signupTrigger');
    const closeButtons = document.querySelectorAll('.auth-modal__close');

    function openModal(modal) {
        modal.removeAttribute('hidden');
        modal.classList.add('show');
        animateModal(modal);
        const focusTarget = modal.querySelector('input, button:not(.auth-modal__close)');
        focusTarget?.focus();
    }

    function closeModal(modal) {
        modal.classList.remove('show');
        modal.setAttribute('hidden', '');
    }

    function closeAllModals() {
        closeModal(loginModal);
        closeModal(signupModal);
    }

    loginTrigger.addEventListener('click', () => openModal(loginModal));
    signupTrigger.addEventListener('click', () => openModal(signupModal));

    closeButtons.forEach((button) => {
        button.addEventListener('click', () => {
            closeAllModals();
        });
    });

    window.addEventListener('click', (e) => {
        if (e.target === loginModal) closeModal(loginModal);
        if (e.target === signupModal) closeModal(signupModal);
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeAllModals();
    });

    document.querySelectorAll('[data-switch-modal]').forEach((button) => {
        button.addEventListener('click', () => {
            const targetId = button.getAttribute('data-switch-modal');
            closeAllModals();
            const targetModal = document.getElementById(targetId);
            if (targetModal) openModal(targetModal);
        });
    });

    const faqItems = document.querySelectorAll('.faq_item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq_question');

        question.addEventListener('click', () => {
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });

            item.classList.toggle('active');
        });
    });

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

    const animateElements = document.querySelectorAll('.company_card, .mindguide_card, .sound_card, .plan_card, .faq_item');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        observer.observe(el);
    });

    function typeWriter(element) {
        element.classList.add('typewriter');
    }

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

    const navLinks = document.querySelectorAll('.header_nav_link');
    navLinks.forEach((link, index) => {
        link.style.opacity = '0';
        link.style.animation = `slideIn 0.5s ease forwards ${index * 0.1}s`;
    });

    function animateModal(modal) {
        modal.querySelector('.modal-content')?.classList.add('animate-scale-in');
    }
});
