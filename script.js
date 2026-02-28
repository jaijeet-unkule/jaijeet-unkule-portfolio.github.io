document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Navigation Toggle --- //
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Close mobile menu when a link is clicked
    const links = document.querySelectorAll('.nav-link');
    links.forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                menuToggle.querySelector('i').classList.replace('fa-times', 'fa-bars');
            }
        });
    });

    // --- Active Link Highlighting on Scroll --- //
    const sections = document.querySelectorAll('section[id], footer[id]');

    window.addEventListener('scroll', () => {
        let current = '';
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        links.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    // --- Scroll Animations (Intersection Observer) --- //
    const animationElements = document.querySelectorAll('.fade-in-up, .slide-in-left, .slide-in-right');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                obs.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    animationElements.forEach(el => {
        observer.observe(el);
    });

    // Animate Hero instantly
    setTimeout(() => {
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) heroContent.classList.add('is-visible');
    }, 100);

    // --- Projects Filtering & Slider Logic --- //
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectItems = Array.from(document.querySelectorAll('.project-item'));
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    if (filterBtns.length > 0 && projectItems.length > 0) {
        let visibleItems = [...projectItems];
        let currentIndex = Math.floor(visibleItems.length / 2); // Start with middle item
        let slideInterval;

        const updateSlider = () => {
            // Reset all items
            projectItems.forEach(item => {
                item.className = 'project-grid-card project-item'; // clear active/prev/next
                item.style.display = 'none';
            });

            if (visibleItems.length === 0) return;

            // Show visible items
            visibleItems.forEach(item => {
                item.style.display = 'flex';
            });

            if (visibleItems.length === 1) {
                visibleItems[0].classList.add('active');
                if (prevBtn) prevBtn.style.display = 'none';
                if (nextBtn) nextBtn.style.display = 'none';
                return;
            }

            if (prevBtn) prevBtn.style.display = 'flex';
            if (nextBtn) nextBtn.style.display = 'flex';

            // Wrap index safely
            if (currentIndex >= visibleItems.length) currentIndex = 0;
            if (currentIndex < 0) currentIndex = visibleItems.length - 1;

            let prevIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
            let nextIndex = (currentIndex + 1) % visibleItems.length;

            visibleItems[currentIndex].classList.add('active');

            if (visibleItems.length > 2) {
                visibleItems[prevIndex].classList.add('prev');
                visibleItems[nextIndex].classList.add('next');
            } else if (visibleItems.length === 2) {
                visibleItems[nextIndex].classList.add('next');
            }
        };

        const nextSlide = () => {
            if (visibleItems.length <= 1) return;
            currentIndex++;
            updateSlider();
            resetInterval();
        };

        const prevSlide = () => {
            if (visibleItems.length <= 1) return;
            currentIndex--;
            updateSlider();
            resetInterval();
        };

        const startInterval = () => {
            if (visibleItems.length > 1) {
                slideInterval = setInterval(nextSlide, 5000);
            }
        };

        const resetInterval = () => {
            clearInterval(slideInterval);
            startInterval();
        };

        if (nextBtn) nextBtn.addEventListener('click', nextSlide);
        if (prevBtn) prevBtn.addEventListener('click', prevSlide);

        projectItems.forEach((item) => {
            item.addEventListener('click', (e) => {
                if (e.target.closest('button')) return;

                if (item.classList.contains('prev')) {
                    prevSlide();
                } else if (item.classList.contains('next')) {
                    nextSlide();
                }
            });
        });

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(f => f.classList.remove('active'));
                btn.classList.add('active');

                const filterValue = btn.getAttribute('data-filter');

                if (filterValue === 'all') {
                    visibleItems = [...projectItems];
                } else {
                    visibleItems = projectItems.filter(item => item.getAttribute('data-category') === filterValue);
                }

                currentIndex = Math.floor(visibleItems.length / 2); // reset to middle
                updateSlider();
                resetInterval();
            });
        });

        // Initialize
        updateSlider();
        startInterval();
    }

    // --- Case Study Modal Logic --- //
    const modal = document.getElementById('case-study-modal');
    const closeModalBtn = document.querySelector('.close-modal-btn');
    const modalOverlay = document.querySelector('.modal-overlay');
    const viewButtons = document.querySelectorAll('.view-case-study-btn');
    const allCases = document.querySelectorAll('.case-study-content');

    const openModal = (caseId) => {
        // Hide all cases first
        allCases.forEach(c => c.style.display = 'none');

        // Show target case
        const targetCase = document.getElementById(`case-${caseId}`);
        if (targetCase) {
            targetCase.style.display = 'block';
            modal.style.display = 'flex'; // set display first
            // Add a tiny delay to allow display:flex to apply before transition
            setTimeout(() => {
                modal.classList.add('open');
                document.body.style.overflow = 'hidden'; // Prevent background scrolling
            }, 10);
        }
    };

    const closeModal = () => {
        modal.classList.remove('open');
        document.body.style.overflow = ''; // Restore scrolling
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300); // Wait for transition to finish
    };

    if (modal) {
        viewButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const caseId = btn.getAttribute('data-case');
                openModal(caseId);
            });
        });

        closeModalBtn.addEventListener('click', closeModal);
        modalOverlay.addEventListener('click', closeModal);

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('open')) {
                closeModal();
            }
        });
    }

    // --- Quick Snapshots Slider Logic --- //
    const snapshotWrappers = document.querySelectorAll('.snapshots-slider-wrapper');

    snapshotWrappers.forEach(wrapper => {
        const container = wrapper.querySelector('.snapshots-slider-container');
        const slides = wrapper.querySelectorAll('.snapshot-slide');
        const prevBtn = wrapper.querySelector('.prev-snapshot');
        const nextBtn = wrapper.querySelector('.next-snapshot');
        const dots = wrapper.querySelectorAll('.dot');

        let currentSlide = 0;
        const totalSlides = slides.length;

        if (totalSlides === 0) return;

        const updateSnapshotSlider = () => {
            container.style.transform = `translateX(-${currentSlide * 100}%)`;

            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentSlide);
            });
        };

        const nextSnapshot = () => {
            currentSlide = (currentSlide + 1) % totalSlides;
            updateSnapshotSlider();
        };

        const prevSnapshot = () => {
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            updateSnapshotSlider();
        };

        if (nextBtn) nextBtn.addEventListener('click', nextSnapshot);
        if (prevBtn) prevBtn.addEventListener('click', prevSnapshot);

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentSlide = index;
                updateSnapshotSlider();
            });
        });
    });
});
