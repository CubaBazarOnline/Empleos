document.addEventListener('DOMContentLoaded', () => {
    // Efectos holográficos con carga diferida
    const container = document.querySelector('.holographic-container');
    
    const setupHolographicEffects = () => {
        container.addEventListener('mousemove', (e) => {
            const x = e.clientX / window.innerWidth;
            const y = e.clientY / window.innerHeight;
            
            container.style.transform = `
                rotateX(${(y - 0.5) * 5}deg)
                rotateY(${(x - 0.5) * -5}deg)
            `;
        }, {passive: true});

        container.addEventListener('mouseleave', () => {
            container.style.transform = '';
        });
    };

    // Carga diferida de efectos
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                setupHolographicEffects();
                observer.disconnect();
            }
        }, {threshold: 0.1});
        
        observer.observe(container);
    } else {
        setupHolographicEffects();
    }

    // Manejo del formulario
    const form = document.getElementById('affiliateForm');
    form.addEventListener('submit', handleFormSubmit);

    // Validación en tiempo real
    form.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', () => {
            if (input.value.trim() !== '') {
                hideError(input);
            }
        });
    });
});

// Validación del formulario
function validateForm(form) {
    let isValid = true;
    const name = form.elements.name;
    const phone = form.elements.phone;
    const email = form.elements.email;

    // Validar nombre
    if (name.value.trim() === '') {
        showError(name, 'Por favor ingresa tu nombre completo');
        isValid = false;
    }

    // Validar teléfono
    const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    if (!phoneRegex.test(phone.value.trim())) {
        showError(phone, 'Ingresa un número de teléfono válido');
        isValid = false;
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value.trim())) {
        showError(email, 'Ingresa un correo electrónico válido');
        isValid = false;
    }

    return isValid;
}

function showError(input, message) {
    const errorElement = input.nextElementSibling;
    input.classList.add('invalid');
    errorElement.textContent = message;
    errorElement.classList.add('show');
}

function hideError(input) {
    const errorElement = input.nextElementSibling;
    input.classList.remove('invalid');
    errorElement.classList.remove('show');
}

// Envío del formulario
async function handleFormSubmit(e) {
    e.preventDefault();
    const form = e.target;
    
    if (!validateForm(form)) return;
    
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    submitButton.disabled = true;
    submitButton.innerHTML = 'Enviando... <span class="spinner"></span>';
    
    try {
        // Simular envío a backend
        await sendFormData(new FormData(form));
        
        // Mostrar modal de éxito
        showModal(
            '¡Registro exitoso!', 
            'Te hemos enviado un correo con acceso al portal de afiliados y tu enlace único de referidos.'
        );
        
        form.reset();
    } catch (error) {
        showModal(
            'Error', 
            'Hubo un problema al enviar tu registro. Por favor intenta nuevamente.'
        );
    } finally {
        submitButton.disabled = false;
        submitButton.innerHTML = originalText;
    }
}

// Simular envío de datos
function sendFormData(formData) {
    return new Promise((resolve) => {
        console.log('Datos enviados:', {
            name: formData.get('name'),
            phone: formData.get('phone'),
            email: formData.get('email'),
            experience: formData.get('experience')
        });
        
        // Simular tiempo de red
        setTimeout(resolve, 1500);
    });
}

// Modal
function showModal(title, message) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay active';
    modal.innerHTML = `
        <div class="modal-content">
            <button class="modal-close" aria-label="Cerrar modal">&times;</button>
            <h3>${title}</h3>
            <p>${message}</p>
            <button class="cta-button modal-confirm">Entendido</button>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Cerrar modal
    const closeModal = () => {
        modal.remove();
        document.body.style.overflow = '';
    };
    
    modal.querySelector('.modal-close').addEventListener('click', closeModal);
    modal.querySelector('.modal-confirm').addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    
    // Cerrar con ESC
    document.addEventListener('keydown', function handleEsc(e) {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', handleEsc);
        }
    });
}