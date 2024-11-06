document.addEventListener('DOMContentLoaded', function() {
    const showMoreBtn = document.getElementById('mnt-btn');
    const firstBackButton = document.getElementById('back-button-1');
    const secondBackButton = document.getElementById('back-button-2');
    

    if (showMoreBtn) {
        showMoreBtn.addEventListener('click', function() {
            // Mostrar la sección "more-options"
            const moreOptions = document.getElementById('mantadmin');
            const heroContainer = document.querySelector('.hero_container');
            const loginSection = document.getElementById('login-section');
            const actionButtons = document.getElementById('action-buttons');
            const creasimple = document.getElementById('crea-simple');

            // Ocultar secciones
            heroContainer.style.display = 'none';
            loginSection.style.display = 'none';
            actionButtons.style.display = 'none';
            creasimple.style.display = "none";

            
            // Mostrar "more-options"
            moreOptions.style.display = 'block';

            // Ocultar el primer botón y mostrar el segundo
            if (firstBackButton && secondBackButton) {
                firstBackButton.style.display = 'none';
                secondBackButton.style.display = 'block';
            }
        });
    }
});
