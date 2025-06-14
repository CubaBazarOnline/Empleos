document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const holographicContainer = document.querySelector('.holographic-container');
    const holographicCards = document.querySelectorAll('.holographic-card');
    const affiliateForm = document.getElementById('affiliateForm');
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    
    // Crear modal
    modalOverlay.innerHTML = `
        <div class="modal-content">
            <button class="modal-close">&times;</button>
            <h3 class="modal-title">¡Solicitud enviada!</h3>
            <p class="modal-message">Gracias por tu interés en el programa de afiliados de CBO. Nos pondremos en contacto contigo en las próximas 24 horas.</p>
            <button class="cta-button modal-confirm">Aceptar</button>
        </div>
    `;
    document.body.appendChild(modalOverlay);
    
    const modalClose = document.querySelector('.modal-close');
    const modalConfirm = document.querySelector('.modal-confirm');
    
    // Efecto holográfico 3D con movimiento del mouse
    function handleMouseMove(e) {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        
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
            
            // Brillo dinámico
            const glowX = x * 100;
            const glowY = y * 100;
            card.style.boxShadow = `
                ${rotY * 2}px ${rotX * 2}px 30px rgba(0, 204, 153, 0.3),
                ${glowX - 50}px ${glowY - 50}px 100px rgba(0, 204, 153, 0.1)
            `;
        });
    }
    
    // Resetear posición cuando el mouse sale
    function handleMouseOut() {
        holographicContainer.style.transform = 'rotateX(0) rotateY(0)';
        holographicCards.forEach(card => {
            card.style.transform = 'rotateX(0) rotateY(0) translateZ(0)';
            card.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.12)';
        });
    }
    
    // Manejar el envío del formulario
    async function handleFormSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(affiliateForm);
        const data = {
            name: formData.get('name'),
            phone: formData.get('phone'),
            email: formData.get('email'),
            timestamp: new Date().toISOString()
        };
        
        try {
            // Enviar SMS (simulado - en producción usar API real)
            await sendSMSNotification(data);
            
            // Mostrar modal de confirmación
            modalOverlay.classList.add('active');
            
            // Resetear formulario
            affiliateForm.reset();
            
            // Enviar datos a un webhook o backend (opcional)
            // await sendToBackend(data);
            
        } catch (error) {
            console.error('Error al enviar la solicitud:', error);
            alert('Hubo un error al enviar tu solicitud. Por favor intenta nuevamente.');
        }
    }
    
    // Función para "enviar" SMS (simulación)
    function sendSMSNotification(data) {
        return new Promise((resolve) => {
            // En un entorno real, aquí se usaría una API de SMS como Twilio
            console.log(`SMS enviado a +5350369270: 
                Nuevo afiliado CBO:
                Nombre: ${data.name}
                Teléfono: ${data.phone}
                Email: ${data.email}
                Quiere unirse al programa de afiliados.
            `);
            
            // Simular retraso de red
            setTimeout(resolve, 1500);
        });
    }
    
    // Cerrar modal
    function closeModal() {
        modalOverlay.classList.remove('active');
    }
    
    // Event listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseout', handleMouseOut);
    affiliateForm.addEventListener('submit', handleFormSubmit);
    modalClose.addEventListener('click', closeModal);
    modalConfirm.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', function(e) {
        if (e.target === modalOverlay) closeModal();
    });
    
    // Efecto de carga inicial
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});