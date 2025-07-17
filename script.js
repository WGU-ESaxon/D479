// Navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get all navigation links and sections
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');

    // Function to show a specific section
    function showSection(targetId) {
        // Hide all sections
        sections.forEach(section => {
            section.classList.remove('active');
        });

        // Remove active class from all nav links
        navLinks.forEach(link => {
            link.classList.remove('active');
        });

        // Show target section
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            targetSection.classList.add('active');
        }

        // Add active class to clicked nav link
        const activeLink = document.querySelector(`[href="#${targetId}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }

        // Scroll to top
        window.scrollTo(0, 0);
    }

    // Add click event listeners to navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            showSection(targetId);
        });
    });

    // Search functionality (basic)
    const searchBtn = document.querySelector('.search-btn');
    const searchBar = document.querySelector('.search-bar');

    if (searchBtn && searchBar) {
        searchBtn.addEventListener('click', function() {
            const searchTerm = searchBar.value.toLowerCase().trim();
            if (searchTerm) {
                alert(`Search functionality would look for: "${searchTerm}"`);
                // In a real implementation, this would search through content
            }
        });

        searchBar.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchBtn.click();
            }
        });
    }

    // Contact form submission
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(this);
            const name = formData.get('name');
            const email = formData.get('email');
            const subject = formData.get('subject');
            const message = formData.get('message');

            // Basic validation
            if (!name || !email || !message) {
                alert('Please fill in all required fields.');
                return;
            }

            // Simulate form submission
            alert(`Thank you, ${name}! Your message has been sent. We'll get back to you at ${email} soon.`);

            // Reset form
            this.reset();
        });
    }

    // CTA button interactions
    const ctaButtons = document.querySelectorAll('.cta-btn');
    ctaButtons.forEach(button => {
        button.addEventListener('click', function() {
            const buttonText = this.textContent.trim();

            // Handle different CTA actions
            switch(buttonText) {
                case 'Book Now':
                    alert('Booking system would open here');
                    break;
                case 'Explore Activities':
                    showSection('activities');
                    break;
                case 'View Accommodations':
                    showSection('accommodations');
                    break;
                case 'Check Availability':
                    alert('Availability checker would open here');
                    break;
                case 'Download Map':
                    alert('Map download would start here');
                    break;
                default:
                    if (buttonText.includes('View')) {
                        alert(`${buttonText} functionality would open here`);
                    }
                    break;
            }
        });
    });

    // Language selector
    const languageSelector = document.querySelector('.language-selector');
    if (languageSelector) {
        languageSelector.addEventListener('change', function() {
            const selectedLang = this.value;
            alert(`Language would change to: ${selectedLang}`);
            // In a real implementation, this would change the site language
        });
    }

    // Add hover effects to cards
    const cards = document.querySelectorAll('.highlight-card, .accommodation-card, .dining-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Smooth scrolling for better UX
    document.documentElement.style.scrollBehavior = 'smooth';

    // Initialize with home section active
    showSection('home');
});

// Utility function to simulate loading states
function showLoading(element) {
    const originalText = element.textContent;
    element.textContent = 'Loading...';
    element.disabled = true;

    setTimeout(() => {
        element.textContent = originalText;
        element.disabled = false;
    }, 1500);
}

// Add loading states to certain buttons
document.addEventListener('DOMContentLoaded', function() {
    const loadingButtons = document.querySelectorAll('[data-loading]');
    loadingButtons.forEach(button => {
        button.addEventListener('click', function() {
            showLoading(this);
        });
    });
});