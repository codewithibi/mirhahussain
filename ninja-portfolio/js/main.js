// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Mobile navigation toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            toggleMenuAnimation();
        });
    }
    
    // Toggle hamburger menu animation
    function toggleMenuAnimation() {
        const spans = menuToggle.querySelectorAll('span');
        spans.forEach(span => span.classList.toggle('active'));
        
        if (spans[0].classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (navLinks.classList.contains('active') && !event.target.closest('.main-nav')) {
            navLinks.classList.remove('active');
            if (menuToggle) toggleMenuAnimation();
        }
    });
    
    // Sticky header
    const header = document.querySelector('.header');
    const scrollWatcher = () => {
        if (window.scrollY > 50) {
            header.style.padding = '0.5rem 0';
            header.style.backgroundColor = 'rgba(10, 10, 10, 0.98)';
        } else {
            header.style.padding = '1rem 0';
            header.style.backgroundColor = 'rgba(10, 10, 10, 0.95)';
        }
    };
    
    window.addEventListener('scroll', scrollWatcher);
    
    // Smooth scrolling for navigation links
    const scrollLinks = document.querySelectorAll('a[href^="#"]');
    
    scrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Close mobile menu if open
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                if (menuToggle) toggleMenuAnimation();
            }
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = document.querySelector('.header').offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Active navigation link based on scroll position
    const sections = document.querySelectorAll('section[id]');
    
    function highlightNavLink() {
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-links a[href="#${sectionId}"]`);
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                document.querySelectorAll('.nav-links a').forEach(link => {
                    link.classList.remove('active');
                });
                navLink.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', highlightNavLink);
    
    // Form handling with Web3Forms
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('form-status');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const submitBtn = contactForm.querySelector('.submit-btn');
            
            // Change button text while submitting
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
            
            // Display status message
            formStatus.innerHTML = '<div class="sending-message">Sending your message...</div>';
            formStatus.style.display = 'block';
            
            // Show network status
            formStatus.innerHTML = '<div class="sending-message">Checking network connection...</div>';

            // First check if we have a network connection
            if (!navigator.onLine) {
                formStatus.innerHTML = '<div class="error-message">You appear to be offline. Please check your internet connection and try again.</div>';
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send Message';
                return;
            }

            formStatus.innerHTML = '<div class="sending-message">Sending your message...</div>';
            
            // Submit the form using traditional method as fallback
            try {
                // Use XMLHttpRequest as a fallback to fetch
                const xhr = new XMLHttpRequest();
                xhr.open('POST', contactForm.action, true);
                xhr.setRequestHeader('Accept', 'application/json');
                xhr.timeout = 15000; // 15 seconds timeout
                
                xhr.onload = function() {
                    try {
                        if (xhr.status >= 200 && xhr.status < 300) {
                            const data = JSON.parse(xhr.responseText);
                            console.log("Form submission response:", data);
                            
                            if (data.success) {
                                formStatus.innerHTML = '<div class="success-message">Message sent successfully! We will get back to you soon. Check your spam folder if you don\'t see the email.</div>';
                                contactForm.reset();
                                console.log("Form submitted successfully with ID:", data.message_id);
                            } else {
                                formStatus.innerHTML = '<div class="error-message">Something went wrong! Error: ' + (data.message || "Unknown error") + '</div>';
                                console.error("Form submission error:", data);
                            }
                        } else {
                            formStatus.innerHTML = '<div class="error-message">Server error: ' + xhr.status + ' - ' + xhr.statusText + '</div>';
                            console.error("Server error:", xhr.status, xhr.statusText);
                        }
                    } catch (err) {
                        formStatus.innerHTML = '<div class="error-message">Error processing response: ' + err.message + '</div>';
                        console.error("Error processing response:", err);
                    }
                    
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Send Message';
                };
                
                xhr.ontimeout = function() {
                    formStatus.innerHTML = '<div class="error-message">Request timed out. Server may be down or your connection is slow.</div>';
                    console.error("Request timed out");
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Send Message';
                };
                
                xhr.onerror = function() {
                    formStatus.innerHTML = '<div class="error-message">Network error occurred. This could be due to CORS restrictions or the API being unavailable.</div>';
                    console.error("Network error occurred");
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Send Message';
                };
                
                xhr.send(formData);
            } catch (error) {
                console.error("Form submission exception:", error);
                formStatus.innerHTML = '<div class="error-message">Error: ' + error.message + '</div>';
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send Message';
            }
            
            // Hide status message after 5 seconds on success
            setTimeout(() => {
                if (formStatus.querySelector('.success-message')) {
                    formStatus.style.display = 'none';
                }
            }, 5000);
        });
    }
    
    // Animations for elements when they come into view
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.about-image, .about-content, .contact-info, .contact-form');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - 100) {
                element.classList.add('animated');
            }
        });
    };
    
    window.addEventListener('scroll', animateOnScroll);
    
    // Call once to check for elements already in view when page loads
    animateOnScroll();

    // Add animation class to elements
    document.querySelectorAll('.about-image, .about-content, .contact-info, .contact-form').forEach(el => {
        el.classList.add('fade-in');
    });
}); 