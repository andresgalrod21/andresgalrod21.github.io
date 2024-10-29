document.addEventListener("DOMContentLoaded", () => {
    // Elementos y botones del DOM
    const permissionCreateForm = document.getElementById(
        "permission-create-form"
    );
    const searchPermissionBtn = document.getElementById("search-permission-btn");
    const updatePermissionBtn = document.getElementById("update-permission-btn");

    const permissionsTable = document
        .getElementById("permissions-table")
        .getElementsByTagName("tbody")[0];
    const permissionSearchOutput = document.getElementById(
        "permission-search-output"
    );
    const updatePermissionIDSelect = document.getElementById(
        "update-permission-id"
    );
    const permissionsSection = document.getElementById("permissions"); // Sección de Permisos
    const permissionsBtn = document.getElementById("per-btn"); // Botón de Permisos

    // Otras secciones que deben ocultarse al ver la sección Permisos
    const diagnosSection = document.getElementById("diagnosticos");
    const groupsSection = document.getElementById("groups");
    const foliosSection = document.getElementById("folios");
    const headquartersSection = document.getElementById("headquarters");
    const incomesSection = document.getElementById("incomes");
    const medicationsSection = document.getElementById("medications");
    const permissionsGroupsSection = document.getElementById("permissions-groups");
    const specialitiesSection = document.getElementById("specialities");
    const staffSection = document.getElementById("staff");
    const tipdocsSection = document.getElementById("tipdocs");
    const usersSection = document.getElementById("users");
    const logsSection = document.getElementById("logs");
    const scoreSection = document.getElementById("score");


    // Función para ocultar todas las secciones
    function hideAllSections() {
        if (diagnosSection) diagnosSection.style.display = "none";
        if (groupsSection) groupsSection.style.display = "none";
        if (foliosSection) foliosSection.style.display = "none";
        if (headquartersSection) headquartersSection.style.display = "none";
        if (incomesSection) incomesSection.style.display = "none";
        if (medicationsSection) medicationsSection.style.display = "none";
        if (permissionsGroupsSection) permissionsGroupsSection.style.display = "none";
        if (specialitiesSection) specialitiesSection.style.display = "none";
        if (staffSection) staffSection.style.display = "none";
        if (tipdocsSection) tipdocsSection.style.display = "none";
        if (usersSection) usersSection.style.display = "none";
        if (logsSection) logsSection.style.display = "none";
        if (scoreSection) scoreSection.style.display = "none";

        permissionsSection.style.display = "none";
    }

    // Evento para mostrar solo la sección de permisos
    permissionsBtn.addEventListener("click", () => {
        hideAllSections();
        permissionsSection.style.display = "block";
        loadPermissions(); // Cargar lista de permisos
    });

    // Función para cargar Permisos
    function loadPermissions() {
        fetch("https://nursenotes.somee.com/apiPermitions")
            .then((response) => response.json())
            .then((data) => {
                permissionsTable.innerHTML = ""; // Limpiar tabla
                updatePermissionIDSelect.innerHTML = ""; // Limpiar select para actualización
                data.forEach((permission) => {
                    const row = permissionsTable.insertRow();
                    row.innerHTML = `
                        <td>${permission.peR_ID}</td>
                        <td>${permission.perdsc}</td>
                        <td>
                            <button onclick="confirmRemovePermissionRow(this)">Eliminar</button>
                        </td>
                    `;

                    // Agregar opción al select de actualización
                    const option = document.createElement("option");
                    option.value = permission.peR_ID;
                    option.textContent = `${permission.peR_ID} - ${permission.perdsc}`;
                    updatePermissionIDSelect.appendChild(option);
                });
            });
    }

    // Función para confirmar y eliminar una fila visualmente
    window.confirmRemovePermissionRow = function (button) {
        if (confirm("¿Estás seguro de que deseas eliminar este permiso?")) {
            const row = button.closest("tr");
            row.remove();
        }
    };

    // Crear Permiso
    permissionCreateForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const permissionData = {
            perdsc: document.getElementById("permission-desc").value,
        };

        fetch("https://nursenotes.somee.com/apiPermitions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(permissionData),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Error al crear el permiso");
                }
                return response.json();
            })
            .then(() => {
                loadPermissions();
                permissionCreateForm.reset();
            })
            .catch((error) =>
                console.error("Error en la creación del permiso:", error)
            );
    });

    // Buscar Permiso por ID
    searchPermissionBtn.addEventListener("click", () => {
        const peR_ID = document.getElementById("search-permission-id").value;

        fetch(`https://nursenotes.somee.com/apiPermitions/${peR_ID}`)
            .then((response) => response.json())
            .then((data) => {
                permissionSearchOutput.innerHTML = data ?
                    `<p>ID: ${data.peR_ID}, Descripción: ${data.perdsc}</p>` :
                    `<p>No se encontró el permiso con ID: ${peR_ID}</p>`;
            })
            .catch((error) => console.error("Error al buscar permiso:", error));
    });

    // Actualizar Permiso por Grupo
    updatePermissionBtn.addEventListener("click", () => {
        const pG_ID = updatePermissionGroupIDSelect.value;
        const permissionGroupData = {
            pG_ID: parseInt(pG_ID),
            grP_ID: parseInt(
                document.getElementById("update-permission-group-grp-id").value
            ),
            peR_ID: parseInt(
                document.getElementById("update-permission-group-per-id").value
            ),
        };

        fetch(`https://nursenotes.somee.com/apiPermitions/${pG_ID}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(permissionGroupData),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Error al actualizar el permiso por grupo");
                }
                return response.json();
            })
            .then(() => {
                loadPermissionsGroups();
                updatePermissionGroupIDSelect.selectedIndex = 0;
                document.getElementById("update-permission-group-grp-id").value = "";
                document.getElementById("update-permission-group-per-id").value = "";
            })
            .catch((error) =>
                console.error("Error en la actualización del permiso por grupo:", error)
            );
    });
});