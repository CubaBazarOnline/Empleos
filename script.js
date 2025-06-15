document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const holographicContainer = document.querySelector('.holographic-container');
    const holographicCards = document.querySelectorAll('.holographic-card');
    const affiliateForm = document.getElementById('affiliateForm');
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    
    // Variables de estado
    let isMouseMoving = false;
    let mouseMoveTimeout;
    let isFormSubmitting = false;
    
    // Crear modal de forma accesible
    modalOverlay.setAttribute('role', 'dialog');
    modalOverlay.setAttribute('aria-modal', 'true');
    modalOverlay.setAttribute('aria-labelledby', 'modal-title');
    modalOverlay.tabIndex = -1;
    
    modalOverlay.innerHTML = `
        <div class="modal-content">
            <button class="modal-close" aria-label="Cerrar modal">&times;</button>
            <h3 id="modal-title" class="modal-title">¡Solicitud enviada!</h3>
            <p class="modal-message">Gracias por tu interés en el programa de afiliados de CHP. Nos pondremos en contacto contigo en las próximas 24 horas.</p>
            <button class="cta-button modal-confirm">Aceptar</button>
        </div>
    `;
    document.body.appendChild(modalOverlay);
    
    const modalClose = document.querySelector('.modal-close');
    const modalConfirm = document.querySelector('.modal-confirm');
    const modalTitle = document.getElementById('modal-title');
    
    // Efecto holográfico 3D optimizado
    function handleMouseMove(e) {
        if (isMouseMoving) return;
        
        isMouseMoving = true;
        clearTimeout(mouseMoveTimeout);
        
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        
        // Usar requestAnimationFrame para mejor rendimiento
        requestAnimationFrame(() => {
            // Efecto en el contenedor principal
            holographicContainer.style.transform = `
                rotateX(${(y - 0.5) * 5}deg)
                rotateY(${(x - 0.5) * -5}deg)
            `;
            
            // Efecto en las tarjetas individuales
            holographicCards.forEach((card, index) => {
                const offset = (index + 1) * 0.1;
                const rotX = (y - 0.5) * 15 * offset;
                const rotY = (x - 0.5) * -15 * offset;
                
                card.style.transform = `
                    rotateX(${rotX}deg)
                    rotateY(${rotY}deg)
                    translateZ(${index * 5}px)
                `;
                
                // Brillo dinámico optimizado
                const glowX = x * 100;
                const glowY = y * 100;
                card.style.boxShadow = `
                    ${rotY * 2}px ${rotX * 2}px 30px rgba(0, 204, 153, 0.3),
                    ${glowX - 50}px ${glowY - 50}px 100px rgba(0, 204, 153, 0.1)
                `;
            });
            
            mouseMoveTimeout = setTimeout(() => {
                isMouseMoving = false;
            }, 100);
        });
    }
    
    // Resetear posición optimizado
    function handleMouseOut() {
        requestAnimationFrame(() => {
            holographicContainer.style.transform = 'rotateX(0) rotateY(0)';
            holographicCards.forEach(card => {
                card.style.transform = 'rotateX(0) rotateY(0) translateZ(0)';
                card.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.12)';
            });
        });
    }
    
    // Validación de formulario mejorada
    function validateForm() {
        let isValid = true;
        const nameInput = document.getElementById('name');
        const phoneInput = document.getElementById('phone');
        const emailInput = document.getElementById('email');
        
        // Validar nombre
        if (nameInput.value.trim() === '') {
            showError(nameInput, 'name-error', 'Por favor ingresa tu nombre completo');
            isValid = false;
        } else {
            hideError(nameInput, 'name-error');
        }
        
        // Validar teléfono
        const phoneRegex = /^[0-9]{8,15}$/;
        if (!phoneRegex.test(phoneInput.value.trim())) {
            showError(phoneInput, 'phone-error', 'Por favor ingresa un número de teléfono válido');
            isValid = false;
        } else {
            hideError(phoneInput, 'phone-error');
        }
        
        // Validar email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value.trim())) {
            showError(emailInput, 'email-error', 'Por favor ingresa un correo electrónico válido');
            isValid = false;
        } else {
            hideError(emailInput, 'email-error');
        }
        
        return isValid;
    }
    
    function showError(input, errorId, message) {
        input.classList.add('invalid');
        const errorElement = document.getElementById(errorId);
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
    
    function hideError(input, errorId) {
        input.classList.remove('invalid');
        const errorElement = document.getElementById(errorId);
        errorElement.classList.remove('show');
    }
    
    // Manejar el envío del formulario mejorado
    async function handleFormSubmit(e) {
        e.preventDefault();
        
        if (isFormSubmitting) return;
        
        // Validar formulario
        if (!validateForm()) {
            return;
        }
        
        isFormSubmitting = true;
        
        const submitButton = e.target.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.querySelector('.button-text').textContent;
        submitButton.querySelector('.button-text').textContent = 'Enviando...';
        submitButton.disabled = true;
        
        const formData = new FormData(affiliateForm);
        const data = {
            name: formData.get('name').trim(),
            phone: formData.get('phone').trim(),
            email: formData.get('email').trim(),
            timestamp: new Date().toISOString()
        };
        
        try {
            // Enviar SMS (simulado - en producción usar API real)
            await sendSMSNotification(data);
            
            // Mostrar modal de confirmación
            showModal();
            
            // Resetear formulario
            affiliateForm.reset();
            
            // Enviar datos a un webhook o backend (opcional)
            // await sendToBackend(data);
            
        } catch (error) {
            console.error('Error al enviar la solicitud:', error);
            showErrorModal('Hubo un error al enviar tu solicitud. Por favor intenta nuevamente.');
        } finally {
            submitButton.querySelector('.button-text').textContent = originalButtonText;
            submitButton.disabled = false;
            isFormSubmitting = false;
        }
    }
    
    // Función para "enviar" SMS (simulación optimizada)
    function sendSMSNotification(data) {
        return new Promise((resolve) => {
            // En un entorno real, aquí se usaría una API de SMS como Twilio
            console.log(`SMS enviado a +5350369270: 
                Nuevo afiliado CHP:
                Nombre: ${data.name}
                Teléfono: ${data.phone}
                Email: ${data.email}
                Quiere unirse al programa de afiliados.
            `);
            
            // Simular retraso de red
            setTimeout(resolve, 1500);
        });
    }
    
    // Mostrar modal mejorado
    function showModal() {
        modalOverlay.classList.add('active');
        modalOverlay.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        modalClose.focus();
        
        // Atrapar foco dentro del modal para accesibilidad
        trapFocus(modalOverlay);
    }
    
    // Mostrar modal de error
    function showErrorModal(message) {
        modalTitle.textContent = 'Error al enviar';
        document.querySelector('.modal-message').textContent = message;
        showModal();
    }
    
    // Cerrar modal mejorado
    function closeModal() {
        modalOverlay.classList.remove('active');
        modalOverlay.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        
        // Enfocar el botón de enviar después de cerrar el modal
        const submitButton = affiliateForm.querySelector('button[type="submit"]');
        submitButton.focus();
    }
    
    // Función para atrapar el foco en el modal (accesibilidad)
    function trapFocus(element) {
        const focusableElements = element.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstFocusableElement = focusableElements[0];
        const lastFocusableElement = focusableElements[focusableElements.length - 1];
        
        element.addEventListener('keydown', function(e) {
            if (e.key !== 'Tab') return;
            
            if (e.shiftKey) {
                if (document.activeElement === firstFocusableElement) {
                    lastFocusableElement.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastFocusableElement) {
                    firstFocusableElement.focus();
                    e.preventDefault();
                }
            }
        });
    }
    
    // Event listeners optimizados
    function setupEventListeners() {
        // Efectos holográficos
        if (window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
            document.addEventListener('mousemove', handleMouseMove, { passive: true });
            document.addEventListener('mouseout', handleMouseOut);
        }
        
        // Formulario
        affiliateForm.addEventListener('submit', handleFormSubmit);
        
        // Validación en tiempo real
        document.getElementById('name').addEventListener('input', function() {
            if (this.value.trim() !== '') {
                hideError(this, 'name-error');
            }
        });
        
        document.getElementById('phone').addEventListener('input', function() {
            const phoneRegex = /^[0-9]{8,15}$/;
            if (phoneRegex.test(this.value.trim())) {
                hideError(this, 'phone-error');
            }
        });
        
        document.getElementById('email').addEventListener('input', function() {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (emailRegex.test(this.value.trim())) {
                hideError(this, 'email-error');
            }
        });
        
        // Modal
        modalClose.addEventListener('click', closeModal);
        modalConfirm.addEventListener('click', closeModal);
        modalOverlay.addEventListener('click', function(e) {
            if (e.target === modalOverlay) closeModal();
        });
        
        // Cerrar modal con ESC
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
                closeModal();
            }
        });
    }
    
    // Inicialización
    function init() {
        setupEventListeners();
        
        // Efecto de carga inicial
        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 100);
    }
    
    init();
});