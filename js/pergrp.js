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

  // Evento para mostrar solo la sección de notas de enfermería
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
            })
            .catch(error => console.error("Error al cargar permisos por grupo:", error));
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
       
        // Obtener los valores de los inputs
        const grP_ID = parseInt(document.getElementById("permission-group-grp-id").value);
        const peR_ID = parseInt(document.getElementById("permission-group-per-id").value);

        // Validar que solo se estén enviando IDs válidos
        if (isNaN(grP_ID) || isNaN(peR_ID)) {
            alert("Por favor ingrese valores de ID válidos para Grupo y Permiso.");
            return;
        }
       
        // Crear el objeto de datos para la solicitud con descripciones en blanco
        const permissionGroupData = {
            pG_ID: 0,
            grP_ID: grP_ID,
            peR_ID: peR_ID,
            groups: {
                grP_ID: grP_ID,
                grpdsc: "" // Descripción en blanco
            },
            permitions: {
                peR_ID: peR_ID,
                perdsc: "" // Descripción en blanco
            }
        };

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
        const pG_ID = parseInt(updatePermissionGroupIDSelect.value);
        const grP_ID = parseInt(document.getElementById("update-permission-group-grp-id").value);
        const peR_ID = parseInt(document.getElementById("update-permission-group-per-id").value);

        // Crear el objeto de datos para la solicitud de actualización con descripciones en blanco
        const permissionGroupData = {
            pG_ID: pG_ID,
            grP_ID: grP_ID,
            peR_ID: peR_ID,
            groups: {
                grP_ID: grP_ID,
                grpdsc: "" // Descripción en blanco
            },
            permitions: {
                peR_ID: peR_ID,
                perdsc: "" // Descripción en blanco
            }
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