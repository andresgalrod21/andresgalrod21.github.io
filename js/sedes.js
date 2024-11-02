document.addEventListener("DOMContentLoaded", () => {
    // Elementos y botones del DOM
    const headquarterCreateForm = document.getElementById("headquarter-create-form");
    const searchHeadquarterBtn = document.getElementById("search-headquarter-btn");
    const updateHeadquarterBtn = document.getElementById("update-headquarter-btn");
    const headquartersTable = document.getElementById("headquarters-table").getElementsByTagName('tbody')[0];
    const headquarterSearchOutput = document.getElementById("headquarter-search-output");
    const updateHeadquarterIDSelect = document.getElementById("update-headquarter-id");
    const headquartersSection = document.getElementById("headquarters"); // Sección de Sedes
    const headquartersBtn = document.getElementById("sedes-btn"); // Botón de Sedes

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
  headquartersBtn.addEventListener("click", () => {
    hideAllSections();
    headquartersSection.style.display = "block";
    loadHeadquarters();
  });

    // Función para cargar Sedes
    function loadHeadquarters() {
        fetch('https://nursenotes.somee.com/apiHeadquearters') // Cambia esta URL a la API de tu backend
            .then(response => response.json())
            .then(data => {
                headquartersTable.innerHTML = ""; // Limpiar tabla
                updateHeadquarterIDSelect.innerHTML = ""; // Limpiar select para actualización
                data.forEach(headquarter => {
                    const row = headquartersTable.insertRow();
                    row.innerHTML = `
                        <td>${headquarter.headQ_ID}</td>
                        <td>${headquarter.headqdsc}</td>
                        <td>
                            <button onclick="confirmRemoveHeadquarterRow(this)">Eliminar</button>
                        </td>
                    `;
                    
                    // Agregar opción al select de actualización
                    const option = document.createElement("option");
                    option.value = headquarter.headQ_ID;
                    option.textContent = `${headquarter.headQ_ID} - ${headquarter.headqdsc}`;
                    updateHeadquarterIDSelect.appendChild(option);
                });
            });
    }

    // Función para confirmar y eliminar una fila visualmente
    window.confirmRemoveHeadquarterRow = function(button) {
        if (confirm("¿Estás seguro de que deseas eliminar esta sede?")) {
            const row = button.closest("tr"); // Selecciona la fila del botón "Eliminar"
            row.remove(); // Elimina la fila visualmente
        }
    }

    // Crear Sede
    headquarterCreateForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const headqdsc = document.getElementById("headquarter-desc").value;

        fetch('https://nursenotes.somee.com/apiHeadquearters', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ headqdsc: headqdsc }), // Usando "headqdsc" como en el backend
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al crear la sede');
            }
            return response.json();
        })
        .then(() => {
            loadHeadquarters(); // Recargar la lista después de guardar
            headquarterCreateForm.reset(); // Limpiar el formulario
        })
        .catch(error => {
            console.error('Hubo un problema con la creación de la sede:', error);
        });
    });

    // Buscar Sede por ID
    searchHeadquarterBtn.addEventListener("click", () => {
        const headQ_ID = document.getElementById("search-headquarter-id").value;

        fetch(`https://nursenotes.somee.com/apiHeadquearters/${headQ_ID}`)
            .then(response => response.json())
            .then(data => {
                if (data) {
                    headquarterSearchOutput.innerHTML = `<p>ID: ${data.headQ_ID}, Descripción: ${data.headqdsc}</p>`;
                } else {
                    headquarterSearchOutput.innerHTML = `<p>No se encontró la sede con ID: ${headQ_ID}</p>`;
                }
            });
    });

    // Actualizar Sede
    updateHeadquarterBtn.addEventListener("click", () => {
        const headQ_ID = updateHeadquarterIDSelect.value;
        const headqdsc = document.getElementById("update-headquarter-desc").value;
    
        fetch(`https://nursenotes.somee.com/apiHeadquearters/${headQ_ID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                headQ_ID: headQ_ID, // Usando "headQ_ID"
                headqdsc: headqdsc // Usando "headqdsc"
            }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al actualizar la sede');
            }
            return response.json();
        })
        .then(() => {
            loadHeadquarters();
            updateHeadquarterIDSelect.selectedIndex = 0;
            document.getElementById("update-headquarter-desc").value = "";
        })
        .catch(error => {
            console.error('Hubo un problema con la actualización de la sede:', error);
        });
    });
});
