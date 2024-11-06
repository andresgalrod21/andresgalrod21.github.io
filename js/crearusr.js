document.addEventListener("DOMContentLoaded", () => {
    const registerButton = document.getElementById("crea-simple");
    const simpleRegisterSection = document.getElementById("simple-register");
    const simpleRegisterForm = document.getElementById("simple-register-form");
    const dataAcceptanceSection = document.getElementById("data-acceptance-section");
    const acceptButton = document.getElementById("accept-data-usage");

    let userData = null; // Variable para almacenar los datos del usuario temporalmente

    // Función para ocultar todas las secciones y el botón de registro
    function showSimpleRegisterSection() {
        document.querySelectorAll("section").forEach(section => {
            section.style.display = "none";
        });

        registerButton.style.display = "none";
        simpleRegisterSection.style.display = "block";
    }

    // Función para validar el correo electrónico
    function isEmailValid(email) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    }

    // Función para validar la contraseña
    function isPasswordValid(password) {
        const passwordPattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        return passwordPattern.test(password);
    }

    // Mostrar la sección de registro simplificado al hacer clic en el botón de registro
    registerButton.addEventListener("click", (e) => {
        e.preventDefault();
        showSimpleRegisterSection();
    });

    // Evento para manejar el envío del formulario de registro simplificado
    simpleRegisterForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = document.getElementById("simple-user-name").value;
        const lastname = document.getElementById("simple-user-lastname").value;
        const email = document.getElementById("simple-user-email").value;
        const password = document.getElementById("simple-user-password").value;
        const confirmPassword = document.getElementById("simple-user-confirm-password").value;
        const username = document.getElementById("simple-user-usr").value;

        // Validación de campos
        if (!isEmailValid(email)) {
            alert("Por favor ingrese un correo electrónico válido.");
            return;
        }

        if (!isPasswordValid(password)) {
            alert("La contraseña debe tener al menos 8 caracteres, incluir una letra mayúscula, una letra minúscula y un número.");
            return;
        }

        if (password !== confirmPassword) {
            alert("Las contraseñas no coinciden.");
            return;
        }

        // Almacenar los datos temporalmente para su uso posterior
        userData = {
            usR_ID: 0,
            name: name,
            lastname: lastname,
            tipdoc: "N/A",
            numdoc: 0,
            usrpsw: password,
            usr: username,
            mail: email,
            fchcreation: new Date().toISOString(),
            grP_ID: 3,
            group: {
                grP_ID: 3,
                grpdsc: ""
            }
        };

        // Mostrar la sección de aceptación de datos
        simpleRegisterSection.style.display = "none"; // Ocultar formulario de registro
        dataAcceptanceSection.style.display = "block";
    });

    // Evento para crear el usuario al aceptar los términos de uso
    acceptButton.addEventListener("click", () => {
        dataAcceptanceSection.style.display = "none"; // Ocultar la sección de aceptación

        // Llamada a la API para crear el usuario
        fetch("https://nursenotes.somee.com/apiUsers", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userData),
        })
        .then(async response => {
            if (!response.ok) {
                const errorText = await response.text();
                console.error("Error en la respuesta del servidor:", errorText);

                alert(`Error ${response.status}: ${errorText || 'No se pudo crear el usuario'}`);
                throw new Error("Error al crear el usuario");
            }

            return response.json();
        })
        .then(data => {
            console.log("Usuario creado con éxito:", data);
            alert("Usuario creado correctamente.");
            location.reload(); // Recargar la página
        })
        .catch(error => {
            console.error("Error en la creación del usuario:", error);
            alert(`Ocurrió un error: ${error.message}`);
        });
    });
});
