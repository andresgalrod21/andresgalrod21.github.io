(function() {
    document.addEventListener('DOMContentLoaded', function() {
        // Verifica si el formulario de login y la sección de botones de acción existen
        const loginForm = document.querySelector('.login-form');
        const loginSection = document.getElementById('login-section');
        const actionButtons = document.getElementById('action-buttons');
        const backButton1 = document.getElementById('back-button-1'); // Selecciona el primer botón oculto

        if (loginForm && loginSection && actionButtons && backButton1) {
            // Captura el evento submit del formulario de login
            loginForm.addEventListener('submit', function(event) {
                event.preventDefault(); // Evita el envío automático del formulario

                const username = document.getElementById('username').value;
                const password = document.getElementById('password').value;

                // Definimos las credenciales según los nombres de campo que el backend espera
                const credentials = {
                    username: username,
                    password: password
                };

                // Realiza la solicitud fetch a la API del backend
                fetch('https://nursenotes.somee.com/api/Auth/login', { // Usa http o https según el backend
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(credentials)
                })
                .then(response => {
                    // Verifica si la respuesta no es exitosa y lanza un error con detalles
                    if (!response.ok) {
                        return response.json().then(errorData => {
                            throw new Error(`Error ${response.status}: ${errorData.message || 'Solicitud incorrecta'}`);
                        });
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.success) {
                        // Oculta el formulario de login y muestra los botones de acción
                        loginSection.style.display = 'none';
                        actionButtons.style.display = 'block';
                        backButton1.style.display = 'block'; // Muestra el primer botón oculto
                    } else {
                        // Muestra un mensaje de error en caso de fallo en la autenticación
                        alert('Login fallido: ' + (data.message || 'Credenciales incorrectas'));
                    }
                })
                .catch(error => {
                    // Captura errores en la solicitud y muestra un mensaje detallado
                    console.error('Error en la solicitud:', error);
                    alert(`Error en la solicitud: ${error.message}.`);
                });
            });
        }
    });
})();
