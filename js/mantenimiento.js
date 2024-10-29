document.addEventListener('DOMContentLoaded', function() {
    const showMoreBtn = document.getElementById('mnt-btn');

    if (showMoreBtn) {
        showMoreBtn.addEventListener('click', function() {
            // Mostrar la sección "more-options"
            const moreOptions = document.getElementById('mantadmin');
            const heroContainer = document.querySelector('.hero_container');
            const loginSection = document.getElementById('login-section');
            const actionButtons = document.getElementById('action-buttons');

            // Ocultar secciones
            heroContainer.style.display = 'none';
            loginSection.style.display = 'none';
            actionButtons.style.display = 'none';
            
            // Mostrar "more-options"
            moreOptions.style.display = 'block';
        });
    }
});
