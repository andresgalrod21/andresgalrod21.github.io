document.addEventListener('DOMContentLoaded', function() {
    // Botón de prueba para simular login exitoso
    const loginButton = document.getElementById('test-login-btn');
    const loginSection = document.getElementById('login-section');
    const actionButtons = document.getElementById('action-buttons');

    // Verifica que los elementos existen antes de agregar el event listener
    if (loginButton && loginSection && actionButtons) {
        loginButton.addEventListener('click', function() {
            // Ocultar el formulario de login
            loginSection.style.display = 'none';
            loginButton.style.display = 'none';
            
            // Mostrar la sección con los botones de acción
            actionButtons.style.display = 'block';
        });
    }
});