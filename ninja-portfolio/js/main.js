// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Supabase client
    const supabaseUrl = 'https://ywlxsnsxolmaymjqhbjx.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl3bHhzbnN4b2xtYXltanFoYmp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0MTgyMzEsImV4cCI6MjA2ODk5NDIzMX0.tY4TocIZWHrCwaW1thX-76VvJzY3Qv3Gf-s-_p7wCp4';
    const supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);
    
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
    
    // Form handling with Supabase
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('form-status');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            const submitBtn = contactForm.querySelector('.submit-btn');
            
            // Change button text while submitting
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
            
            // Display status message
            formStatus.innerHTML = '<div class="sending-message">Sending your message...</div>';
            formStatus.style.display = 'block';
            
            // Check if we have a network connection
            if (!navigator.onLine) {
                formStatus.innerHTML = '<div class="error-message">You appear to be offline. Please check your internet connection and try again.</div>';
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send Message';
                return;
            }
            
            try {
                // Insert the form data into Supabase
                const { data, error } = await supabaseClient
                    .from('contact_messages')
                    .insert([
                        { 
                            name: name,
                            email: email,
                            subject: subject,
                            message: message,
                            created_at: new Date().toISOString()
                        }
                    ]);
                
                if (error) {
                    console.error("Supabase error:", error);
                    
                    // Provide more specific error messages based on the error code
                    if (error.code === "42P01") {
                        formStatus.innerHTML = '<div class="error-message">Database table not found. Please make sure you\'ve set up the contact_messages table in Supabase.</div>';
                    } else if (error.code === "23505") {
                        formStatus.innerHTML = '<div class="error-message">A duplicate entry was detected.</div>';
                    } else if (error.code === "23502") {
                        formStatus.innerHTML = '<div class="error-message">Please fill in all required fields.</div>';
                    } else if (error.code === "42501" || error.code === "42803") {
                        formStatus.innerHTML = '<div class="error-message">Permission denied. Please check your Supabase RLS policies.</div>';
                    } else if (error.message.includes("Failed to fetch")) {
                        formStatus.innerHTML = '<div class="error-message">Network error. Please check your internet connection or if Supabase is accessible.</div>';
                    } else {
                        formStatus.innerHTML = '<div class="error-message">Error: ' + error.message + '</div>';
                    }
                    
                    throw error;
                }
                
                // Success
                formStatus.innerHTML = '<div class="success-message">Message sent successfully! We will get back to you soon.</div>';
                contactForm.reset();
                console.log("Form submitted successfully to Supabase");
            } catch (error) {
                console.error("Form submission error:", error);
                
                // Handle network or other errors not caught by Supabase
                if (!formStatus.querySelector('.error-message')) {
                    if (error.message.includes("Failed to fetch") || error.message.includes("NetworkError")) {
                        formStatus.innerHTML = '<div class="error-message">Network error. Please check your internet connection or if Supabase is accessible.</div>';
                    } else {
                        formStatus.innerHTML = '<div class="error-message">Error: ' + error.message + '</div>';
                    }
                }
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send Message';
                
                // Hide status message after 5 seconds on success
                setTimeout(() => {
                    if (formStatus.querySelector('.success-message')) {
                        formStatus.style.display = 'none';
                    }
                }, 5000);
            }
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