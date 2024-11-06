document.addEventListener("DOMContentLoaded", () => {
    // Elementos y botones del DOM
    const userCreateForm = document.getElementById("user-create-form");
    const searchUserBtn = document.getElementById("search-user-btn");
    const updateUserBtn = document.getElementById("update-user-btn");

    const usersTable = document.getElementById("users-table").getElementsByTagName("tbody")[0];
    const userSearchOutput = document.getElementById("user-search-output");
    const updateUserIDSelect = document.getElementById("update-user-id");
    const usersSection = document.getElementById("users");
    const usersBtn = document.getElementById("usr-btn");

    // Establecer estilo para scroll en la tabla de usuarios
    document.getElementById("users-table").style.cssText = `
        display: block;
        max-height: 200px;
        overflow-y: scroll;
        width: 100%;
    `;

    // Función para obtener la fecha y hora actual en formato ISO
    function getCurrentDateTimeISO() {
        return new Date().toISOString();
    }

    // Validar contraseña
    function validatePassword(password) {
        const passwordPattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        return passwordPattern.test(password);
    }

    // Validar correo
    function validateEmail(email) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    }

    // Validar todos los datos de usuario
    function validateUserData(user) {
        if (!validateEmail(user.mail)) {
            alert("Por favor ingrese un correo electrónico válido.");
            return false;
        }
        if (!validatePassword(user.usrpsw)) {
            alert("La contraseña debe tener al menos 8 caracteres, incluir una letra mayúscula, una letra minúscula y un número.");
            return false;
        }
        return true;
    }

    // Función para ocultar todas las secciones
    function hideAllSections() {
        const sections = [
            "diagnosticos", "groups", "headquarters", "incomes", "medications",
            "permissions-groups", "permissions", "specialities", "staff", "tipdocs",
            "users", "logs", "score", "patients", "patient-records", "signs",
            "supplies-patients", "folios", "nurse-note-section"
        ];
        sections.forEach((id) => {
            const section = document.getElementById(id);
            if (section) section.style.display = "none";
        });
    }

    // Evento para mostrar solo la sección de usuarios
    usersBtn.addEventListener("click", () => {
        hideAllSections();
        usersSection.style.display = "block";
        loadUsers();
    });

    // Función para cargar Usuarios
    function loadUsers() {
        fetch("https://nursenotes.somee.com/apiUsers")
            .then(response => response.json())
            .then(data => {
                usersTable.innerHTML = "";
                updateUserIDSelect.innerHTML = '<option value="">Seleccione un usuario</option>';
                data.forEach((user) => {
                    const row = usersTable.insertRow();
                    row.innerHTML = `
                        <td>${user.usR_ID}</td>
                        <td>${user.name}</td>
                        <td>${user.lastname}</td>
                        <td>${user.tipdoc}</td>
                        <td>${user.numdoc}</td>
                        <td>${user.usr}</td>
                        <td>${user.grP_ID}</td>
                        <td>${user.group ? user.group.grpdsc : ''}</td>
                        <td><button onclick="confirmRemoveUserRow(this)">Eliminar</button></td>
                    `;

                    const option = document.createElement("option");
                    option.value = user.usR_ID;
                    option.textContent = `${user.usR_ID} - ${user.name} ${user.lastname}`;
                    updateUserIDSelect.appendChild(option);
                });
            });
    }

    // Función para confirmar y eliminar una fila visualmente
    window.confirmRemoveUserRow = function (button) {
        if (confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
            const row = button.closest("tr");
            row.remove();
        }
    };

    // Función para enviar datos de usuario al servidor
    function sendUserData(url, method, userData) {
        return fetch(url, {
            method: method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData),
        })
        .then(async (response) => {
            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error en la respuesta del servidor:", errorData);
                if (errorData.errors) {
                    const validationMessages = Object.values(errorData.errors).flat().join('\n');
                    alert(`Error de validación:\n${validationMessages}`);
                } else {
                    alert(`Error ${response.status}: ${errorData.title || 'No se pudo completar la operación'}`);
                }
                throw new Error("Error en la solicitud");
            }
            return response.json();
        });
    }

    // Crear Usuario
    userCreateForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const userData = {
            usR_ID: 0,
            name: document.getElementById("user-name").value,
            lastname: document.getElementById("user-lastname").value,
            tipdoc: document.getElementById("user-tipdoc").value,
            numdoc: parseInt(document.getElementById("user-numdoc").value),
            usrpsw: document.getElementById("user-usrpsw").value,
            usr: document.getElementById("user-usr").value,
            mail: document.getElementById("user-email").value,
            fchcreation: getCurrentDateTimeISO(),
            grP_ID: parseInt(document.getElementById("user-grp-id").value),
            group: { grP_ID: parseInt(document.getElementById("user-grp-id").value), grpdsc: "" }
        };

        if (!validateUserData(userData)) return;

        sendUserData("https://nursenotes.somee.com/apiUsers", "POST", userData)
            .then((data) => {
                alert("Usuario creado correctamente.");
                loadUsers();
                userCreateForm.reset();
            })
            .catch(error => console.error("Error en la creación del usuario:", error));
    });

    // Llenar campos de actualización automáticamente al seleccionar un usuario
    updateUserIDSelect.addEventListener("change", () => {
        const selectedUserId = updateUserIDSelect.value;
        if (!selectedUserId) return;

        fetch(`https://nursenotes.somee.com/apiUsers/${selectedUserId}`)
            .then(response => response.json())
            .then(user => {
                document.getElementById("update-user-name").value = user.name;
                document.getElementById("update-user-lastname").value = user.lastname;
                document.getElementById("update-user-tipdoc").value = user.tipdoc;
                document.getElementById("update-user-numdoc").value = user.numdoc;
                document.getElementById("update-user-usr").value = user.usr;
                document.getElementById("update-user-grp-id").value = user.grP_ID;
            })
            .catch(error => console.error("Error al cargar los datos del usuario:", error));
    });

    // Actualizar Usuario
    updateUserBtn.addEventListener("click", (e) => {
        e.preventDefault();

        const userData = {
            usR_ID: parseInt(updateUserIDSelect.value),
            name: document.getElementById("update-user-name").value,
            lastname: document.getElementById("update-user-lastname").value,
            tipdoc: document.getElementById("update-user-tipdoc").value,
            numdoc: parseInt(document.getElementById("update-user-numdoc").value),
            usr: document.getElementById("update-user-usr").value,
            usrpsw: document.getElementById("update-user-usrpsw").value,
            mail: document.getElementById("update-user-email").value,
            grP_ID: parseInt(document.getElementById("update-user-grp-id").value),
            group: { grP_ID: parseInt(document.getElementById("update-user-grp-id").value), grpdsc: "" }
        };

        if (!validateUserData(userData)) return;

        sendUserData(`https://nursenotes.somee.com/apiUsers/${userData.usR_ID}`, "PUT", userData)
            .then(() => {
                alert("Usuario actualizado correctamente.");
                loadUsers();
                updateUserIDSelect.selectedIndex = 0;
                document.getElementById("update-user-name").value = "";
                document.getElementById("update-user-lastname").value = "";
                document.getElementById("update-user-tipdoc").value = "";
                document.getElementById("update-user-numdoc").value = "";
                document.getElementById("update-user-usr").value = "";
                document.getElementById("update-user-usrpsw").value = "";
                document.getElementById("update-user-grp-id").value = "";
                document.getElementById("update-user-email").value = "";
            })
            .catch(error => console.error("Error en la actualización del usuario:", error));
    });
});
