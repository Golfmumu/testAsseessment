// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Contact form submission
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Get form data
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value
        };

        // Validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            formStatus.textContent = 'Please enter a valid email address.';
            formStatus.classList.remove('success');
            formStatus.classList.add('error');
            setTimeout(() => {
                formStatus.classList.remove('success', 'error');
                formStatus.textContent = '';
            }, 5000);
            return;
        }

        try {
            // Try to send form data to backend
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData),
                timeout: 5000
            });

            const data = await response.json();

            if (response.ok) {
                formStatus.textContent = 'Message sent successfully! Thank you for contacting me.';
                formStatus.classList.remove('error');
                formStatus.classList.add('success');
                contactForm.reset();
            } else {
                throw new Error(data.message || 'Failed to send message');
            }
        } catch (error) {
            // Fallback: Store message locally if backend is unavailable
            let messages = JSON.parse(localStorage.getItem('messages') || '[]');
            messages.push({
                ...formData,
                timestamp: new Date().toISOString()
            });
            localStorage.setItem('messages', JSON.stringify(messages));
            
            formStatus.textContent = 'Message saved locally! (Backend server is not running)';
            formStatus.classList.remove('error');
            formStatus.classList.add('success');
            contactForm.reset();
        }

        // Clear status message after 5 seconds
        setTimeout(() => {
            formStatus.classList.remove('success', 'error');
            formStatus.textContent = '';
        }, 5000);
    });
}

// Add active class to navigation links on scroll
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});
