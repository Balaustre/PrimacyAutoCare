// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Navigation menu toggle for mobile
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    // Toggle mobile menu
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on a nav link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    
    // Header scroll effect
    const header = document.querySelector('#header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Active navigation link based on scroll position
    const sections = document.querySelectorAll('section');
    
    function setActiveLink() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', setActiveLink);
    
    // Form submission with webhook
    const bookingForm = document.getElementById('booking-form');
    
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(bookingForm);
            const formDataObject = {};
            
            formData.forEach((value, key) => {
                formDataObject[key] = value;
            });
            
            // Send data to webhook
            fetch(bookingForm.action, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formDataObject)
            })
            .then(response => {
                if (response.ok) {
                    showFormMessage('Agendamento enviado com sucesso! Entraremos em contato em breve.', 'success');
                    bookingForm.reset();
                } else {
                    showFormMessage('Ocorreu um erro ao enviar o formulário. Por favor, tente novamente.', 'error');
                }
            })
            .catch(error => {
                showFormMessage('Ocorreu um erro ao enviar o formulário. Por favor, tente novamente.', 'error');
                console.error('Erro:', error);
            });
        });
    }
    
    // Form message display
    function showFormMessage(message, type) {
        // Remove any existing message
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create message element
        const messageElement = document.createElement('div');
        messageElement.className = `form-message ${type}`;
        messageElement.textContent = message;
        
        // Insert after form
        bookingForm.parentNode.insertBefore(messageElement, bookingForm.nextSibling);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            messageElement.remove();
        }, 5000);
    }
    
    // Add form message styles
    const style = document.createElement('style');
    style.textContent = `
        .form-message {
            padding: 1rem;
            margin-top: 1rem;
            border-radius: 5px;
            text-align: center;
            font-weight: 600;
        }
        
        .form-message.success {
            background-color: #d1fae5;
            color: #065f46;
            border: 1px solid #10b981;
        }
        
        .form-message.error {
            background-color: #fee2e2;
            color: #b91c1c;
            border: 1px solid #ef4444;
        }
    `;
    document.head.appendChild(style);
    
    // Date validation - prevent past dates
    const dateInput = document.getElementById('date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }
    
    // Simple form validation
    const formInputs = document.querySelectorAll('#booking-form input, #booking-form select, #booking-form textarea');
    
    formInputs.forEach(input => {
        if (input.hasAttribute('required')) {
            input.addEventListener('invalid', function(e) {
                e.preventDefault();
                this.classList.add('invalid');
            });
            
            input.addEventListener('input', function() {
                this.classList.remove('invalid');
            });
        }
    });
    
    // Add validation styles
    const validationStyle = document.createElement('style');
    validationStyle.textContent = `
        .invalid {
            border-color: #ef4444 !important;
        }
        
        .invalid:focus {
            box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.3) !important;
        }
    `;
    document.head.appendChild(validationStyle);
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('#header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});
