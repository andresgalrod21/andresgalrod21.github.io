document.addEventListener("DOMContentLoaded", () => {
    // Elementos y botones del DOM
    const groupCreateForm = document.getElementById("group-create-form");
    const searchGroupBtn = document.getElementById("search-group-btn");
    const updateGroupBtn = document.getElementById("update-group-btn");
    const groupsTable = document.getElementById("groups-table").getElementsByTagName('tbody')[0];
    const groupSearchOutput = document.getElementById("group-search-output");
    const updateGroupIDSelect = document.getElementById("update-group-id");
    const groupsSection = document.getElementById("groups"); // Sección de Grupos
    const groupsBtn = document.getElementById("groups-btn"); // Botón de Grupos

    // Otras secciones que pueden estar visibles
    const diagnosSection = document.getElementById("diagnosticos");
    const foliosSection = document.getElementById("folios");
    const headquartersSection = document.getElementById("headquarters");
    const incomesSection = document.getElementById("incomes");
    const medicationsSection = document.getElementById("medications");
    const permissionsGroupsSection = document.getElementById("permissions-groups");
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
        if (foliosSection) foliosSection.style.display = "none";
        if (headquartersSection) headquartersSection.style.display = "none";
        if (incomesSection) incomesSection.style.display = "none";
        if (medicationsSection) medicationsSection.style.display = "none";
        if (permissionsGroupsSection) permissionsGroupsSection.style.display = "none";
        if (permissionsSection) permissionsSection.style.display = "none";
        if (specialitiesSection) specialitiesSection.style.display = "none";
        if (staffSection) staffSection.style.display = "none";
        if (tipdocsSection) tipdocsSection.style.display = "none";
        if (usersSection) usersSection.style.display = "none";
        if (logsSection) logsSection.style.display = "none";
        if (scoreSection) scoreSection.style.display = "none";


        groupsSection.style.display = "none";
    }

    // Evento en el botón para mostrar solo la sección de grupos
    groupsBtn.addEventListener("click", () => {
        hideAllSections(); // Oculta todas las secciones
        groupsSection.style.display = "block"; // Muestra solo la sección de grupos
        loadGroups(); // Cargar la lista de grupos
    });

    // Función para cargar Grupos
    function loadGroups() {
        fetch('http://nursenotes.somee.com/apiGroups') // Cambia esta URL a la API de tu backend
            .then(response => response.json())
            .then(data => {
                groupsTable.innerHTML = ""; // Limpiar tabla
                updateGroupIDSelect.innerHTML = ""; // Limpiar select para actualización
                data.forEach(group => {
                    const row = groupsTable.insertRow();
                    row.innerHTML = `
                        <td>${group.grP_ID}</td>
                        <td>${group.grpdsc}</td>
                        <td>
                            <button onclick="confirmRemoveGroupRow(this)">Eliminar</button>
                        </td>
                    `;
                    
                    // Agregar opción al select de actualización
                    const option = document.createElement("option");
                    option.value = group.grP_ID;
                    option.textContent = `${group.grP_ID} - ${group.grpdsc}`;
                    updateGroupIDSelect.appendChild(option);
                });
            });
    }

    // Función para confirmar y eliminar una fila visualmente
    window.confirmRemoveGroupRow = function(button) {
        if (confirm("¿Estás seguro de que deseas eliminar este grupo?")) {
            const row = button.closest("tr"); // Selecciona la fila del botón "Eliminar"
            row.remove(); // Elimina la fila visualmente
        }
    }

    // Crear Grupo
    groupCreateForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const grpdsc = document.getElementById("group-desc").value;

        fetch('https://nursenotes.somee.com/apiGroups', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ grpdsc: grpdsc }), // Cambiado a "grpdsc"
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al crear el grupo');
            }
            return response.json();
        })
        .then(() => {
            loadGroups(); // Recargar la lista después de guardar
            groupCreateForm.reset(); // Limpiar el formulario
        })
        .catch(error => {
            console.error('Hubo un problema con la creación del grupo:', error);
        });
    });

    // Buscar Grupo por ID
    searchGroupBtn.addEventListener("click", () => {
        const grP_ID = document.getElementById("search-group-id").value;

        fetch(`http://nursenotes.somee.com/apiGroups/${grP_ID}`)
            .then(response => response.json())
            .then(data => {
                if (data) {
                    groupSearchOutput.innerHTML = `<p>ID: ${data.grP_ID}, Descripción: ${data.grpdsc}</p>`;
                } else {
                    groupSearchOutput.innerHTML = `<p>No se encontró el grupo con ID: ${grP_ID}</p>`;
                }
            });
    });

    // Actualizar Grupo
    updateGroupBtn.addEventListener("click", () => {
        const grP_ID = updateGroupIDSelect.value;
        const grpdsc = document.getElementById("update-group-desc").value;
    
        fetch(`http://nursenotes.somee.com/apiGroups/${grP_ID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                grP_ID: grP_ID, // Cambiado a "grP_ID"
                grpdsc: grpdsc // Cambiado a "grpdsc"
            }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al actualizar el grupo');
            }
            return response.json();
        })
        .then(() => {
            loadGroups();
            updateGroupIDSelect.selectedIndex = 0;
            document.getElementById("update-group-desc").value = "";
        })
        .catch(error => {
            console.error('Hubo un problema con la actualización:', error);
        });
    });
});
