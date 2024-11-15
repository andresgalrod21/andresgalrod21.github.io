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
  groupsBtn.addEventListener("click", () => {
    hideAllSections();
    groupsSection.style.display = "block";
    loadGroups();
  });
    // Función para cargar Grupos
    function loadGroups() {
        fetch('https://nursenotes.somee.com/apiGroups') // Cambia esta URL a la API de tu backend
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

        fetch(`https://nursenotes.somee.com/apiGroups/${grP_ID}`)
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
    
        fetch(`https://nursenotes.somee.com/apiGroups/${grP_ID}`, {
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
