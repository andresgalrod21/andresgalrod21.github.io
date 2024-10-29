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

    // Otras secciones que pueden estar visibles
    const diagnosSection = document.getElementById("diagnosticos");
    const groupsSection = document.getElementById("groups");
    const foliosSection = document.getElementById("folios");
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
        if (groupsSection) groupsSection.style.display = "none";
        if (foliosSection) foliosSection.style.display = "none";
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

        headquartersSection.style.display = "none";
    }

    // Evento en el botón para mostrar solo la sección de sedes
    headquartersBtn.addEventListener("click", () => {
        hideAllSections(); // Oculta todas las secciones
        headquartersSection.style.display = "block"; // Muestra solo la sección de sedes
        loadHeadquarters(); // Cargar la lista de sedes
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
