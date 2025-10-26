document.addEventListener('DOMContentLoaded', function() {
    initECGAnimation();
    initFormAnimations();
    initInputValidation();
    initHeartbeatDots();
});

function initECGAnimation() {
    const ecgContainer = document.querySelector('.ecg-line-container');
    if (!ecgContainer) return;

    const createECGLine = (yOffset = 0, delay = 0) => {
        const lineDiv = document.createElement('div');
        lineDiv.className = 'ecg-line';

        if (yOffset !== 0) {
            lineDiv.style.top = `${yOffset}%`;
        }

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 1200 200');
        svg.setAttribute('preserveAspectRatio', 'none');

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');

        const ecgPath = generateECGPath();
        path.setAttribute('d', ecgPath);

        if (delay > 0) {
            path.style.animationDelay = `${delay}s`;
        }

        svg.appendChild(path);
        lineDiv.appendChild(svg);

        return lineDiv;
    };

    ecgContainer.appendChild(createECGLine(50, 0));
    ecgContainer.appendChild(createECGLine(25, 1));
    ecgContainer.appendChild(createECGLine(75, 2));
}

function generateECGPath() {
    const width = 1200;
    const centerY = 100;
    const segments = 6;
    const segmentWidth = width / segments;

    let path = `M 0 ${centerY}`;

    for (let i = 0; i < segments; i++) {
        const x = i * segmentWidth;

        path += ` L ${x + segmentWidth * 0.3} ${centerY}`;

        path += ` L ${x + segmentWidth * 0.35} ${centerY - 5}`;
        path += ` L ${x + segmentWidth * 0.4} ${centerY + 30}`;
        path += ` L ${x + segmentWidth * 0.45} ${centerY - 50}`;
        path += ` L ${x + segmentWidth * 0.5} ${centerY + 10}`;
        path += ` L ${x + segmentWidth * 0.52} ${centerY - 8}`;
        path += ` L ${x + segmentWidth * 0.55} ${centerY}`;

        path += ` L ${x + segmentWidth} ${centerY}`;
    }

    return path;
}

function initHeartbeatDots() {
    const ecgLines = document.querySelectorAll('.ecg-line');

    ecgLines.forEach((line, index) => {
        const dot = document.createElement('div');
        dot.className = 'heartbeat-dot';
        dot.style.top = '50%';
        dot.style.animationDelay = `${index}s`;
        line.appendChild(dot);
    });
}

function initFormAnimations() {
    const inputs = document.querySelectorAll('.form-input');

    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            const label = this.previousElementSibling;
            if (label && label.classList.contains('form-label')) {
                label.style.color = 'var(--primary-blue)';
            }

            this.parentElement.style.transform = 'translateX(5px)';
        });

        input.addEventListener('blur', function() {
            const label = this.previousElementSibling;
            if (label && label.classList.contains('form-label')) {
                label.style.color = '';
            }

            this.parentElement.style.transform = '';
        });

        input.addEventListener('input', function() {
            if (this.value) {
                this.style.borderColor = 'var(--primary-blue)';
            } else {
                this.style.borderColor = '';
            }
        });
    });

    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', function(e) {
            const button = this.querySelector('.btn-primary');
            if (button && !button.disabled) {
                button.disabled = true;
                const originalText = button.textContent;
                button.innerHTML = '<span class="loading-spinner"></span>' + originalText;

                setTimeout(() => {
                    if (button.disabled) {
                        button.disabled = false;
                        button.textContent = originalText;
                    }
                }, 5000);
            }
        });
    }
}

function initInputValidation() {
    const emailInputs = document.querySelectorAll('input[type="email"]');
    const passwordInputs = document.querySelectorAll('input[type="password"]');

    emailInputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value && !isValidEmail(this.value)) {
                this.style.borderColor = '#DC2626';
                showInputError(this, 'Por favor ingresa un email válido');
            } else {
                this.style.borderColor = '';
                removeInputError(this);
            }
        });

        input.addEventListener('input', function() {
            if (this.value && isValidEmail(this.value)) {
                this.style.borderColor = '#10B981';
                removeInputError(this);
            }
        });
    });

    passwordInputs.forEach(input => {
        input.addEventListener('input', function() {
            if (this.value.length > 0) {
                if (this.value.length >= 8) {
                    this.style.borderColor = '#10B981';
                } else {
                    this.style.borderColor = '#F59E0B';
                }
            } else {
                this.style.borderColor = '';
            }
        });
    });

    const confirmPasswordInput = document.querySelector('input[name="password_confirmation"]');
    const passwordInput = document.querySelector('input[name="password"]');

    if (confirmPasswordInput && passwordInput) {
        confirmPasswordInput.addEventListener('input', function() {
            if (this.value) {
                if (this.value === passwordInput.value) {
                    this.style.borderColor = '#10B981';
                    removeInputError(this);
                } else {
                    this.style.borderColor = '#F59E0B';
                }
            } else {
                this.style.borderColor = '';
            }
        });
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showInputError(input, message) {
    removeInputError(input);

    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.setAttribute('data-validation-error', 'true');

    input.parentElement.appendChild(errorDiv);
}

function removeInputError(input) {
    const existingError = input.parentElement.querySelector('[data-validation-error]');
    if (existingError) {
        existingError.remove();
    }
}

function addPulseToButton() {
    const buttons = document.querySelectorAll('.btn-primary');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px) scale(1.02)';
        });

        button.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
}

addPulseToButton();

document.addEventListener('livewire:navigated', function() {
    initECGAnimation();
    initFormAnimations();
    initInputValidation();
    initHeartbeatDots();
    addPulseToButton();
});
