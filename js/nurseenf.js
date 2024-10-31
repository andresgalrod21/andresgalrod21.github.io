document.addEventListener('DOMContentLoaded', function() {
    const ntBtn = document.getElementById('nt-btn');

    if (ntBtn) {
        ntBtn.addEventListener('click', function() {
            // Mostrar la sección "notasenf"
            const notasEnfSection = document.getElementById('notasenf');
            const heroContainer = document.querySelector('.hero_container');
            const loginSection = document.getElementById('login-section');
            const actionButtons = document.getElementById('action-buttons');

            // Ocultar secciones
            heroContainer.style.display = 'none';
            loginSection.style.display = 'none';
            actionButtons.style.display = 'none';
            
            // Mostrar "notasenf"
            notasEnfSection.style.display = 'block';
        });
    }
});
