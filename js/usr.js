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
        max-height: 200px; /* Ajusta el tamaño según tu preferencia */
        overflow-y: scroll;
        width: 100%;
    `;

    // Función para codificar en Base64
    function encodeBase64(str) {
        return btoa(str);
    }

    // Función para obtener la fecha y hora actual en formato ISO
    function getCurrentDateTimeISO() {
        return new Date().toISOString();
    }

    // Validar contraseña
    function isPasswordValid(password) {
        const passwordPattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        return passwordPattern.test(password);
    }

      // Función para ocultar todas las secciones
      function hideAllSections() {
        const sections = [
          "diagnosticos",
        "groups",
        "headquarters",
        "incomes",
        "medications",
        "permissions-groups",
        "permissions",
        "specialities",
        "staff",
        "tipdocs",
        "users",
        "logs",
        "score",
        "patients",
        "patient-records",
        "signs",
        "supplies-patients",
        "folios",
        "nurse-note-section"
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

    // Llenar campos de actualización automáticamente al seleccionar un usuario
    updateUserIDSelect.addEventListener("change", () => {
        const selectedUserId = updateUserIDSelect.value;
        if (!selectedUserId) return; // Si no hay selección, salir

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

    // Crear Usuario
    userCreateForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = document.getElementById("user-name").value;
        const lastname = document.getElementById("user-lastname").value;
        const tipdoc = document.getElementById("user-tipdoc").value;
        const numdoc = parseInt(document.getElementById("user-numdoc").value);
        const usrpsw = document.getElementById("user-usrpsw").value;
        const usr = document.getElementById("user-usr").value;
        const grP_ID = parseInt(document.getElementById("user-grp-id").value);
        const fchcreation = getCurrentDateTimeISO();

        // Validar contraseña
        if (!isPasswordValid(usrpsw)) {
            alert("La contraseña debe tener al menos 8 caracteres, incluir una letra mayúscula, una letra minúscula y un número.");
            return;
        }

        const userData = {
            usR_ID: 0,
            name: name,
            lastname: lastname,
            tipdoc: tipdoc,
            numdoc: numdoc,
            usrpsw: encodeBase64(usrpsw),
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
        e.preventDefault();

        const usR_ID = updateUserIDSelect.value;
        const updatePassword = document.getElementById("update-user-usrpsw").value;

        // Validar contraseña en la actualización
        if (updatePassword && !isPasswordValid(updatePassword)) {
            alert("La contraseña debe tener al menos 8 caracteres, incluir una letra mayúscula, una letra minúscula y un número.");
            return;
        }

        const userData = {
            usR_ID: parseInt(usR_ID),
            name: document.getElementById("update-user-name").value,
            lastname: document.getElementById("update-user-lastname").value,
            tipdoc: document.getElementById("update-user-tipdoc").value,
            numdoc: parseInt(document.getElementById("update-user-numdoc").value),
            usr: document.getElementById("update-user-usr").value,
            usrpsw: encodeBase64(updatePassword),
            grP_ID: parseInt(document.getElementById("update-user-grp-id").value),
            fchcreation: getCurrentDateTimeISO(),
            group: {
                grP_ID: parseInt(document.getElementById("update-user-grp-id").value),
                grpdsc: ""
            }
        };

        fetch(`https://nursenotes.somee.com/apiUsers/${usR_ID}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData),
        })
            .then((response) => {
                if (!response.ok) {
                    return response.json().then((errorData) => {
                        console.error("Error en la respuesta del servidor:", errorData);
                        throw new Error("Error al actualizar el usuario");
                    });
                }
                return response.json();
            })
            .then(() => {
                loadUsers();
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
