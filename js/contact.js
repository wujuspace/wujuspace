// Contact Page - Character Head Cursor Tracking & Form Interactions
(function() {
    'use strict';

    function initContact() {
        const characterLeft = document.getElementById('contact-character-left');
        const characterRight = document.getElementById('contact-character-right');
        const characterBottom = document.getElementById('contact-character-bottom');
        const contactHero = document.querySelector('.contact-hero');
        const contactForm = document.getElementById('contact-form');
        const body = document.body;

        // Cursor tracking variables
        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let isMouseMoving = false;

        // Character head positions
        let leftHeadX = 0;
        let leftHeadY = 0;
        let rightHeadX = 0;
        let rightHeadY = 0;
        let bottomHeadX = 0;
        let bottomHeadY = 0;
        
        // Store original eye positions
        const originalEyePositions = {
            left: { eye1: 80, eye2: 120 },
            right: { eye1: 80, eye2: 120 },
            bottom: { eye1: 80, eye2: 120 }
        };

        // Lerp function for smooth interpolation
        function lerp(start, end, factor) {
            return start + (end - start) * factor;
        }

        // Update mouse position
        function updateMousePosition(e) {
            mouseX = e.clientX;
            mouseY = e.clientY;
            isMouseMoving = true;
        }

        // Track cursor movement
        body.addEventListener('mousemove', updateMousePosition);
        
        // Reset when mouse stops moving
        let mouseMoveTimeout;
        body.addEventListener('mousemove', () => {
            clearTimeout(mouseMoveTimeout);
            mouseMoveTimeout = setTimeout(() => {
                isMouseMoving = false;
            }, 100);
        });

        // Animate character heads to look at cursor
        function animateCharacters() {
            if (characterLeft) {
                const rect = characterLeft.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                
                const deltaX = mouseX - centerX;
                const deltaY = mouseY - centerY;
                
                // Reduced movement (from 0.1 to 0.05) and increased rotation
                leftHeadX = lerp(leftHeadX, deltaX * 0.05, 0.08);
                leftHeadY = lerp(leftHeadY, deltaY * 0.05, 0.08);
                
                // Calculate rotation based on cursor position
                const rotation = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
                
                // Apply transform with reduced movement and rotation
                characterLeft.style.transform = `translate(${leftHeadX}px, ${leftHeadY}px) rotateZ(${rotation * 0.15}deg)`;
                
                // Eye tracking (move eyes within the head)
                const eyes = characterLeft.querySelectorAll('circle');
                if (eyes.length >= 2 && isMouseMoving) {
                    const eyeMovement = Math.min(4, Math.abs(deltaX) * 0.02);
                    const eyeDir = deltaX > 0 ? 1 : -1;
                    eyes[0].setAttribute('cx', originalEyePositions.left.eye1 + (eyeMovement * eyeDir));
                    eyes[1].setAttribute('cx', originalEyePositions.left.eye2 + (eyeMovement * eyeDir));
                } else if (eyes.length >= 2) {
                    // Reset to original positions
                    eyes[0].setAttribute('cx', originalEyePositions.left.eye1);
                    eyes[1].setAttribute('cx', originalEyePositions.left.eye2);
                }
            }

            if (characterRight) {
                const rect = characterRight.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                
                const deltaX = mouseX - centerX;
                const deltaY = mouseY - centerY;
                
                // Reduced movement and increased rotation
                rightHeadX = lerp(rightHeadX, deltaX * 0.05, 0.08);
                rightHeadY = lerp(rightHeadY, deltaY * 0.05, 0.08);
                
                // Calculate rotation based on cursor position
                const rotation = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
                
                characterRight.style.transform = `translate(${rightHeadX}px, ${rightHeadY}px) rotateZ(${rotation * 0.15}deg)`;
                
                const eyes = characterRight.querySelectorAll('circle');
                if (eyes.length >= 2 && isMouseMoving) {
                    const eyeMovement = Math.min(4, Math.abs(deltaX) * 0.02);
                    const eyeDir = deltaX > 0 ? 1 : -1;
                    eyes[0].setAttribute('cx', originalEyePositions.right.eye1 + (eyeMovement * eyeDir));
                    eyes[1].setAttribute('cx', originalEyePositions.right.eye2 + (eyeMovement * eyeDir));
                } else if (eyes.length >= 2) {
                    // Reset to original positions
                    eyes[0].setAttribute('cx', originalEyePositions.right.eye1);
                    eyes[1].setAttribute('cx', originalEyePositions.right.eye2);
                }
            }

            if (characterBottom) {
                const rect = characterBottom.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                
                const deltaX = mouseX - centerX;
                const deltaY = mouseY - centerY;
                
                // Reduced movement and increased rotation
                bottomHeadX = lerp(bottomHeadX, deltaX * 0.05, 0.08);
                bottomHeadY = lerp(bottomHeadY, deltaY * 0.05, 0.08);
                
                // Calculate rotation based on cursor position
                const rotation = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
                
                characterBottom.style.transform = `translate(${bottomHeadX}px, ${bottomHeadY}px) rotateZ(${rotation * 0.15}deg)`;
                
                const eyes = characterBottom.querySelectorAll('circle');
                if (eyes.length >= 2 && isMouseMoving) {
                    const eyeMovement = Math.min(4, Math.abs(deltaX) * 0.02);
                    const eyeDir = deltaX > 0 ? 1 : -1;
                    eyes[0].setAttribute('cx', originalEyePositions.bottom.eye1 + (eyeMovement * eyeDir));
                    eyes[1].setAttribute('cx', originalEyePositions.bottom.eye2 + (eyeMovement * eyeDir));
                } else if (eyes.length >= 2) {
                    // Reset to original positions
                    eyes[0].setAttribute('cx', originalEyePositions.bottom.eye1);
                    eyes[1].setAttribute('cx', originalEyePositions.bottom.eye2);
                }
            }

            requestAnimationFrame(animateCharacters);
        }

        // Start animation loop
        animateCharacters();

        // Form validation and submission handling
        if (contactForm) {
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const messageInput = document.getElementById('message');
            const submitBtn = document.getElementById('submit-btn');
            
            // Function to validate form
            function validateForm() {
                const nameValid = nameInput.value.trim().length >= 2;
                const emailValid = emailInput.value.trim().length > 0 && 
                                 emailInput.validity.valid;
                const messageValid = messageInput.value.trim().length >= 10;
                
                return nameValid && emailValid && messageValid;
            }
            
            // Function to update button state
            function updateButtonState() {
                if (validateForm()) {
                    submitBtn.disabled = false;
                    submitBtn.classList.add('enabled');
                } else {
                    submitBtn.disabled = true;
                    submitBtn.classList.remove('enabled');
                }
            }
            
            // Validate on input
            nameInput.addEventListener('input', updateButtonState);
            emailInput.addEventListener('input', updateButtonState);
            messageInput.addEventListener('input', updateButtonState);
            
            // Initial validation
            updateButtonState();
            
            // Form submission handling
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                if (!validateForm()) {
                    return;
                }
                
                const originalText = submitBtn.textContent;
                
                // Get form data
                const formData = {
                    name: nameInput.value.trim(),
                    email: emailInput.value.trim(),
                    message: messageInput.value.trim()
                };

                // Disable button and show loading state
                submitBtn.disabled = true;
                submitBtn.classList.remove('enabled');
                submitBtn.textContent = 'Sending...';
                submitBtn.style.opacity = '0.7';
                submitBtn.style.cursor = 'not-allowed';

                // Simulate form submission (replace with actual API call)
                setTimeout(() => {
                    // Success state
                    contactForm.classList.add('success');
                    submitBtn.textContent = 'Message Sent! ✓';
                    submitBtn.style.background = '#10b981';
                    
                    // Reset form after 3 seconds
                    setTimeout(() => {
                        contactForm.reset();
                        contactForm.classList.remove('success');
                        submitBtn.textContent = originalText;
                        submitBtn.style.background = '';
                        submitBtn.style.opacity = '1';
                        submitBtn.disabled = true;
                        submitBtn.classList.remove('enabled');
                        updateButtonState();
                    }, 3000);
                }, 1500);
            });

            // Input focus animations
            const inputs = contactForm.querySelectorAll('.form-input');
            inputs.forEach((input, index) => {
                input.addEventListener('focus', function() {
                    this.parentElement.style.transform = 'scale(1.02)';
                    this.parentElement.style.transition = 'transform 0.3s ease';
                });

                input.addEventListener('blur', function() {
                    this.parentElement.style.transform = 'scale(1)';
                });

                // Character head reaction to input focus (optional - can be removed if not needed)
                // Removed to simplify
            });
        }

        // Reset character positions when mouse leaves window
        document.addEventListener('mouseleave', function() {
            isMouseMoving = false;
        });
    }

    // Initialize on DOMContentLoaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initContact);
    } else {
        initContact();
    }
})();

