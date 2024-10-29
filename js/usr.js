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

    // Función para codificar en Base64
    function encodeBase64(str) {
        return btoa(str);
    }

    // Función para obtener la fecha y hora actual en formato ISO
    function getCurrentDateTimeISO() {
        return new Date().toISOString();
    }

    // Función para ocultar todas las secciones
    function hideAllSections() {
        const sections = [
            "diagnosticos", "groups", "folios", "headquarters", "incomes", "medications",
            "permissions-groups", "permissions", "staff", "tipdocs", "logs", "score", "users"
        ];
        sections.forEach(id => {
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
                updateUserIDSelect.innerHTML = "";
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

    // Crear Usuario
    userCreateForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = document.getElementById("user-name").value;
        const lastname = document.getElementById("user-lastname").value;
        const tipdoc = document.getElementById("user-tipdoc").value;
        const numdoc = parseInt(document.getElementById("user-numdoc").value);
        const usrpsw = document.getElementById("user-usrpsw").value; // Cifra en Base64
        const usr = document.getElementById("user-usr").value;
        const grP_ID = parseInt(document.getElementById("user-grp-id").value);
        const fchcreation = getCurrentDateTimeISO(); // Fecha y hora actual en ISO

        const userData = {
            usR_ID: 0,
            name: name,
            lastname: lastname,
            tipdoc: tipdoc,
            numdoc: numdoc,
            usrpsw: usrpsw,
            usr: usr,
            fchcreation: fchcreation,
            grP_ID: grP_ID,
            group: {
                grP_ID: 0,
                grpdsc: ""
            }
        };

        fetch("https://nursenotes.somee.com/apiUsers", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData),
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(errorData => {
                        console.error("Error en la respuesta del servidor:", errorData);
                        throw new Error("Error al crear el usuario");
                    });
                }
                return response.json();
            })
            .then(data => {
                console.log("Usuario creado con éxito:", data);
                loadUsers();
                userCreateForm.reset();
            })
            .catch(error => console.error("Error en la creación del usuario:", error));
    });

    // Actualizar Usuario
    updateUserBtn.addEventListener("click", (e) => {
        e.preventDefault(); // Evita la recarga de página

        const usR_ID = updateUserIDSelect.value;
        const userData = {
            usR_ID: parseInt(usR_ID),
            name: document.getElementById("update-user-name").value,
            lastname: document.getElementById("update-user-lastname").value,
            tipdoc: document.getElementById("update-user-tipdoc").value,
            numdoc: parseInt(document.getElementById("update-user-numdoc").value),
            usr: document.getElementById("update-user-usr").value,
            usrpsw: encodeBase64(document.getElementById("update-user-usrpsw").value),
            grP_ID: parseInt(document.getElementById("update-user-grp-id").value),
            fchcreation: getCurrentDateTimeISO(), // Asegurando formato de fecha
            group: {
                grP_ID: parseInt(document.getElementById("update-user-grp-id").value),
                grpdsc: "" // Deja en blanco si no es necesario un valor específico
            }
        };

        console.log("Datos enviados al backend:", userData);

        fetch(`https://nursenotes.somee.com/apiUsers/${usR_ID}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData),
        })
            .then((response) => {
                if (!response.ok) {
                    return response.json().then((errorData) => {
                        console.error("Error en la respuesta del servidor:", errorData);
                        if (errorData.errors) {
                            // Mostrar errores específicos de validación
                            for (const [field, messages] of Object.entries(errorData.errors)) {
                                console.error(`Error en el campo ${field}: ${messages.join(", ")}`);
                            }
                        }
                        throw new Error("Error al actualizar el usuario");
                    });
                }
                return response.json();
            })
            .then(() => {
                loadUsers(); // Recargar la lista de usuarios
                updateUserIDSelect.selectedIndex = 0;
                document.getElementById("update-user-name").value = "";
                document.getElementById("update-user-lastname").value = "";
                document.getElementById("update-user-tipdoc").value = "";
                document.getElementById("update-user-numdoc").value = "";
                document.getElementById("update-user-usr").value = "";
                document.getElementById("update-user-usrpsw").value = "";
                document.getElementById("update-user-grp-id").value = "";
            })
            .catch((error) => console.error("Error en la actualización del usuario:", error));
    });
});