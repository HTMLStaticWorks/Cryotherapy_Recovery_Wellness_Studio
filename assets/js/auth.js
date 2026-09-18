/**
 * auth.js - Interactive behavior for CyroCore Login & Signup
 * Features:
 * - Password visibility toggling (eye / eye-slash)
 * - Real-time input validation & instant error clearing
 * - Client-side form submission & redirection
 * - Interactive social auth simulation
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Password Visibility Toggles
    const toggleButtons = document.querySelectorAll('.auth-password-toggle');
    
    toggleButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const wrapper = btn.closest('.auth-input-wrapper');
            if (!wrapper) return;
            
            const input = wrapper.querySelector('input');
            const icon = btn.querySelector('i');
            if (!input || !icon) return;

            if (input.type === 'password') {
                input.type = 'text';
                icon.className = 'ph ph-eye-slash';
                btn.setAttribute('aria-label', 'Hide password');
            } else {
                input.type = 'password';
                icon.className = 'ph ph-eye';
                btn.setAttribute('aria-label', 'Show password');
            }
        });
    });

    // 2. Clear invalid states when user types
    const inputs = document.querySelectorAll('.auth-input, .auth-checkbox');
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            input.classList.remove('is-invalid');
            const wrapper = input.closest('.auth-form-group') || input.closest('.auth-terms-row');
            if (wrapper) {
                const msg = wrapper.querySelector('.auth-invalid-msg');
                if (msg) msg.style.display = 'none';
            }
        });
    });

    // 3. Login Form Handler
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const emailInput = document.getElementById('loginEmail');
            const passwordInput = document.getElementById('loginPassword');
            const submitBtn = loginForm.querySelector('.auth-submit-btn');
            let isValid = true;

            // Validate email
            if (!emailInput.value.trim() || !validateEmail(emailInput.value.trim())) {
                setInvalid(emailInput, 'Please enter a valid email address');
                isValid = false;
            }

            // Validate password
            if (!passwordInput.value.trim()) {
                setInvalid(passwordInput, 'Please enter your password');
                isValid = false;
            }

            if (isValid) {
                // Simulate authentication
                submitBtn.disabled = true;
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="ph ph-circle-notch ph-spin"></i> ACCESSING PORTAL...';
                
                showToast('Welcome back! Logging into your recovery portal...');
                
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1000);
            }
        });
    }

    // 4. Signup Form Handler
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const nameInput = document.getElementById('signupName');
            const emailInput = document.getElementById('signupEmail');
            const passwordInput = document.getElementById('signupPassword');
            const confirmInput = document.getElementById('signupConfirmPassword');
            const termsInput = document.getElementById('signupTerms');
            const submitBtn = signupForm.querySelector('.auth-submit-btn');
            let isValid = true;

            // Validate name
            if (!nameInput.value.trim()) {
                setInvalid(nameInput, 'Please enter your full name');
                isValid = false;
            }

            // Validate email
            if (!emailInput.value.trim() || !validateEmail(emailInput.value.trim())) {
                setInvalid(emailInput, 'Please enter a valid email address');
                isValid = false;
            }

            // Validate password (min 8 chars)
            if (!passwordInput.value || passwordInput.value.length < 8) {
                setInvalid(passwordInput, 'Password must be at least 8 characters');
                isValid = false;
            }

            // Validate confirm password
            if (passwordInput.value !== confirmInput.value) {
                setInvalid(confirmInput, 'Passwords do not match');
                isValid = false;
            }

            // Validate terms
            if (!termsInput.checked) {
                setInvalid(termsInput, 'You must agree to the Terms & Privacy Policy');
                isValid = false;
            }

            if (isValid) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="ph ph-circle-notch ph-spin"></i> CREATING ACCOUNT...';
                
                showToast('Account created successfully! Redirecting...');
                
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1200);
            }
        });
    }

    // 5. Social Auth Buttons Simulation
    const socialButtons = document.querySelectorAll('.auth-social-btn');
    socialButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const provider = btn.dataset.provider || 'Provider';
            showToast(`Connecting with ${provider}...`);
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 900);
        });
    });

    // Helpers
    function setInvalid(input, message) {
        input.classList.add('is-invalid');
        const wrapper = input.closest('.auth-form-group') || input.closest('.auth-terms-row');
        if (wrapper) {
            let msg = wrapper.querySelector('.auth-invalid-msg');
            if (msg) {
                msg.textContent = message;
                msg.style.display = 'block';
            }
        }
    }

    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function showToast(message) {
        let toast = document.querySelector('.auth-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'auth-toast';
            document.body.appendChild(toast);
        }
        toast.innerHTML = `<i class="ph-fill ph-check-circle auth-toast-icon"></i> <span>${message}</span>`;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3200);
    }
});
