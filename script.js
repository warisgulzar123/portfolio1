document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const spinner = document.getElementById('spinner');
    const successIcon = document.getElementById('success-icon');
    const toastContainer = document.getElementById('toast-container');



    // Initialize AOS (Animate on Scroll)
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true
    });

    // Typed Text Animation for About Section
    const roles = ["Front-End Developer", "Graphic Designer", "Creative Thinker"];
    let index = 0, charIndex = 0, isDeleting = false;
    const typedText = document.getElementById("typed-text");

    function type() {
        const currentRole = roles[index];
        typedText.textContent = currentRole.substring(0, charIndex);

        if (!isDeleting && charIndex < currentRole.length) {
            charIndex++;
            setTimeout(type, 100);
        } else if (isDeleting && charIndex > 0) {
            charIndex--;
            setTimeout(type, 50);
        } else {
            isDeleting = !isDeleting;
            if (!isDeleting) {
                index = (index + 1) % roles.length;
            }
            setTimeout(type, isDeleting ? 1000 : 2000);
        }
    }

    if (typedText) {
        type(); // Start typing animation
    }

    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.remove('bg-transparent');
            navbar.classList.add('bg-gray-900', 'shadow-lg');
        } else {
            navbar.classList.add('bg-transparent');
            navbar.classList.remove('bg-gray-900', 'shadow-lg');
        }
    });
    // Initialize EmailJS with your actual Public Key
    emailjs.init('TvqEFT0bken_nUuNc'); // <-- yahan apni Public Key dalain

    // Validation rules (same as before)
    const validators = {
        email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Invalid email format',
    };

    ['email'].forEach(field => {
        const input = document.getElementById(field);
        input.addEventListener('submit', () => validateField(input));
        input.addEventListener('submit', () => validateField(input));
    });

    function validateField(input) {
        const error = validators[input.id](input.value);
        const errorEl = input.nextElementSibling;
        if (error) {
            input.classList.add('input-error');
            input.classList.remove('input-valid');
            errorEl.textContent = error;
            errorEl.classList.add('show');
        } else {
            input.classList.remove('input-error');
            input.classList.add('input-valid');
            errorEl.textContent = '';
            errorEl.classList.remove('show');
        }
        return !error;
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        let isValid = true;
        ['email'].forEach(field => {
            if (!validateField(document.getElementById(field))) {
                isValid = false;
            }
        });

        if (!isValid) return;

        submitBtn.disabled = true;
        btnText.textContent = 'Sending...';
        spinner.classList.remove('hidden');
        successIcon.classList.add('hidden');

        try {
            // Replace YOUR_SERVICE_ID and YOUR_TEMPLATE_ID with your actual IDs
            const response = await emailjs.send('service_4xep2r8', 'template_mpv3rxb', {
                from_name: document.getElementById('name').value,
                from_email: document.getElementById('email').value,
                message: document.getElementById('message').value,
                to_email: 'warisaligulzar123@gmail.com'
            });

            if (response.status === 200) {
                submitBtn.classList.add('success-state');
                btnText.textContent = 'Message Sent Successfully';
                spinner.classList.add('hidden');
                successIcon.classList.remove('hidden');
                showToast('Message sent successfully!', 'success');

                form.classList.add('opacity-50');
                setTimeout(() => {
                    form.reset();
                    ['name', 'email', 'message'].forEach(field => {
                        const input = document.getElementById(field);
                        input.classList.remove('input-valid', 'input-error');
                        input.nextElementSibling.classList.remove('show');
                    });
                    form.classList.remove('opacity-50');
                }, 300);

                setTimeout(() => {
                    submitBtn.classList.remove('success-state');
                    btnText.textContent = 'Send Message';
                    successIcon.classList.add('hidden');
                    submitBtn.disabled = false;
                }, 3000);
            } else {
                throw new Error(`Unexpected status: ${response.status}`);
            }
        } catch (error) {
            console.error('EmailJS Error:', error);
            if (!error.text || !error.text.includes('Public Key is invalid')) {
                showToast('Failed to send message. Please try again.', 'error');
            } else {
                console.warn('Please update the Public Key in emailjs.init() with a valid key from https://dashboard.emailjs.com/account');
            }
            submitBtn.disabled = false;
            btnText.textContent = 'Send Message';
            spinner.classList.add('hidden');
            successIcon.classList.add('hidden');
        }
    });

    function showToast(message, type) {
        toastContainer.innerHTML = '';
        const toast = document.createElement('div');
        toast.className = `toast ${type} show`;
        toast.textContent = message;
        toastContainer.appendChild(toast);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
});


