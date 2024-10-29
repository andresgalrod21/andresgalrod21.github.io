document.addEventListener("DOMContentLoaded", () => {
    // Elementos y botones del DOM
    const permissionGroupCreateForm = document.getElementById("permission-group-create-form");
    const searchPermissionGroupBtn = document.getElementById("search-permission-group-btn");
    const updatePermissionGroupBtn = document.getElementById("update-permission-group-btn");
    const permissionsGroupsTable = document.getElementById("permissions-groups-table").getElementsByTagName('tbody')[0];
    const permissionGroupSearchOutput = document.getElementById("permission-group-search-output");
    const updatePermissionGroupIDSelect = document.getElementById("update-permission-group-id");
    const permissionsGroupsSection = document.getElementById("permissions-groups");
    const permissionsGroupsBtn = document.getElementById("pergrp-btn");

    // Otras secciones que deben ocultarse al ver la sección Permisos por Grupo
    const diagnosSection = document.getElementById("diagnosticos");
    const groupsSection = document.getElementById("groups");
    const foliosSection = document.getElementById("folios");
    const headquartersSection = document.getElementById("headquarters");
    const incomesSection = document.getElementById("incomes");
    const medicationsSection = document.getElementById("medications");
    const permissionsSection = document.getElementById("permissions");
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
        if (permissionsSection) permissionsSection.style.display = "none";
        if (specialitiesSection) specialitiesSection.style.display = "none";
        if (staffSection) staffSection.style.display = "none";
        if (tipdocsSection) tipdocsSection.style.display = "none";
        if (usersSection) usersSection.style.display = "none";
        if (logsSection) logsSection.style.display = "none";
        if (scoreSection) scoreSection.style.display = "none";

        medicationsSection.style.display = "none";
    }

    // Evento para mostrar solo la sección de permisos por grupo
    permissionsGroupsBtn.addEventListener("click", () => {
        hideAllSections();
        permissionsGroupsSection.style.display = "block";
        loadPermissionsGroups();
    });

    // Función para cargar Permisos por Grupo
    function loadPermissionsGroups() {
        fetch('https://nursenotes.somee.com/apiPerXGroups')
            .then(response => response.json())
            .then(data => {
                permissionsGroupsTable.innerHTML = "";
                updatePermissionGroupIDSelect.innerHTML = "";
                data.forEach(permissionGroup => {
                    const row = permissionsGroupsTable.insertRow();
                    row.innerHTML = `
                        <td>${permissionGroup.pG_ID}</td>
                        <td>${permissionGroup.grP_ID}</td>
                        <td>${permissionGroup.peR_ID}</td>
                        <td><button onclick="confirmRemovePermissionGroupRow(this)">Eliminar</button></td>
                    `;
                    
                    const option = document.createElement("option");
                    option.value = permissionGroup.pG_ID;
                    option.textContent = `${permissionGroup.pG_ID} - Grupo ${permissionGroup.grP_ID}`;
                    updatePermissionGroupIDSelect.appendChild(option);
                });
            });
    }

    // Función para confirmar y eliminar una fila visualmente
    window.confirmRemovePermissionGroupRow = function(button) {
        if (confirm("¿Estás seguro de que deseas eliminar este permiso por grupo?")) {
            const row = button.closest("tr");
            row.remove();
        }
    };

    // Crear Permiso por Grupo
    permissionGroupCreateForm.addEventListener("submit", (e) => {
        e.preventDefault();
       
        // Obtener los valores de los inputs (sin crear registros en otras tablas)
        const grP_ID = parseInt(document.getElementById("permission-group-grp-id").value);
        const peR_ID =parseInt(document.getElementById("permission-group-per-id").value);
         // Reemplaza con los datos correctos
       
 
        // Validar que solo se estén enviando IDs
        if (isNaN(grP_ID) || isNaN(peR_ID)) {
            alert("Por favor ingrese valores de ID válidos para Grupo y Permiso.");
            return;
        }
       
 
        // Crear el objeto de datos para la solicitud
        const permissionGroupData = {
            pG_ID: 0,
            grP_ID: grP_ID,
            peR_ID: peR_ID,
            groups: {
                grP_ID: 0,
                grpdsc: ""
            },
            permitions: {
                peR_ID: 0,
                perdsc: ""
            }
        };
        console.log("Enviando IDs local a la API:", permissionGroupData);
 
        fetch('https://nursenotes.somee.com/apiPerXGroups', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(permissionGroupData),
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(errorData => {
                    console.error("Detalles del error en la respuesta del servidor:", errorData);
                    throw new Error(`Error al crear el permiso por grupo: ${errorData.title}`);
                });
            }
            return response.json();
        })
        .then(() => {
            console.log("Permiso por grupo creado exitosamente");
            loadPermissionsGroups();
            permissionGroupCreateForm.reset();
        })
        .catch(error => console.error("Error en la creación del permiso por grupo:", error));
    });
    
    // Actualizar Permiso por Grupo
    updatePermissionGroupBtn.addEventListener("click", () => {
        const pG_ID = updatePermissionGroupIDSelect.value;
        const permissionGroupData = {
            pG_ID: parseInt(pG_ID),
            grP_ID: parseInt(document.getElementById("update-permission-group-grp-id").value),
            peR_ID: parseInt(document.getElementById("update-permission-group-per-id").value),
        };

        fetch(`https://nursenotes.somee.com/apiPerXGroups/${pG_ID}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(permissionGroupData),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al actualizar el permiso por grupo');
            }
            return response.json();
        })
        .then(() => {
            loadPermissionsGroups();
            updatePermissionGroupIDSelect.selectedIndex = 0;
            document.getElementById("update-permission-group-grp-id").value = "";
            document.getElementById("update-permission-group-per-id").value = "";
        })
        .catch(error => console.error('Error en la actualización del permiso por grupo:', error));
    });
});