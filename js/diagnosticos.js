document.addEventListener("DOMContentLoaded", () => {
    const diagnosisCreateForm = document.getElementById("diagnosis-create-form");
    const readBtn = document.getElementById("read-btn");
    const updateBtn = document.getElementById("update-btn");
    const diagnosisTable = document.getElementById("diagnosis-table").getElementsByTagName('tbody')[0];
    const readOutput = document.getElementById("read-output");
    const updatediaG_IDSelect = document.getElementById("update-diag-id");
    const diagnosSection = document.getElementById("diagnosticos");
    const diagBtn = document.getElementById("diag-btn"); // Selecciona el botón de diagnósticos

    // Otras secciones que pueden estar visibles
    const groupsSection = document.getElementById("groups");
    const foliosSection = document.getElementById("folios");
    const headquartersSection = document.getElementById("headquarters");
    const incomesSection = document.getElementById("incomes");
    const medicationsSection = document.getElementById("medications");
    const permissionsGroupsSection = document.getElementById("permissions-groups");
    const permissionsSection = document.getElementById("permissions");
    const staffSection = document.getElementById("staff");
    const tipdocsSection = document.getElementById("tipdocs");
    const usersSection = document.getElementById("users");
    const logsSection = document.getElementById("logs");
    const scoreSection = document.getElementById("score");






    function hideAllSections() {
        if (groupsSection) groupsSection.style.display = "none";
        if (foliosSection) foliosSection.style.display = "none";
        if (headquartersSection) headquartersSection.style.display = "none";
        if (incomesSection) incomesSection.style.display = "none";
        if (medicationsSection) medicationsSection.style.display = "none";
        if (permissionsGroupsSection) permissionsGroupsSection.style.display = "none";
        if (permissionsSection) permissionsSection.style.display = "none";
        if (staffSection) staffSection.style.display = "none";
        if (tipdocsSection) tipdocsSection.style.display = "none";
        if (usersSection) usersSection.style.display = "none";
        if (logsSection) logsSection.style.display = "none";
        if (scoreSection) scoreSection.style.display = "none";




        diagnosSection.style.display = "none";
    }

        // Evento en el botón para mostrar solo la sección de grupos
        diagBtn.addEventListener("click", () => {
            hideAllSections(); // Oculta todas las secciones
            diagnosSection.style.display = "block"; // Muestra solo la sección de grupos
            loadDiagnoses(); // Cargar la lista de grupos
        });

    // Función para cargar Diagnósticos
    function loadDiagnoses() {
        fetch('https://nursenotes.somee.com/apiDiagnosis') // Cambia esta URL a tu API
            .then(response => response.json())
            .then(data => {
                diagnosisTable.innerHTML = ""; // Limpiar tabla
                updatediaG_IDSelect.innerHTML = ""; // Limpiar select para actualización
                data.forEach(diagnosis => {
                    const row = diagnosisTable.insertRow();
                    row.innerHTML = `
                        <td>${diagnosis.diaG_ID}</td>
                        <td>${diagnosis.diagdsc}</td>
                        <td>
                            <button onclick="confirmRemoveRow(this)">Eliminar</button>
                        </td>
                    `;

                    // Agregar opción al select de actualización
                    const option = document.createElement("option");
                    option.value = diagnosis.diaG_ID;
                    option.textContent = `${diagnosis.diaG_ID} - ${diagnosis.diagdsc}`;
                    updatediaG_IDSelect.appendChild(option);
                });
            });
    }

    // Función para confirmar y eliminar una fila visualmente
    window.confirmRemoveRow = function (button) {
        if (confirm("¿Estás seguro de que deseas eliminar este diagnóstico?")) {
            const row = button.closest("tr"); // Selecciona la fila del botón "Eliminar"
            row.remove(); // Elimina la fila visualmente
        }
    }

    // Crear Diagnóstico
    diagnosisCreateForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const diagdsc = document.getElementById("diag-dsc").value;

        fetch('https://nursenotes.somee.com/apiDiagnosis', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    diagdsc: diagdsc
                }),
            })
            .then(() => {
                loadDiagnoses(); // Recargar la lista después de guardar
                diagnosisCreateForm.reset(); // Limpiar el formulario
            });
    });

    // Leer Diagnóstico
    readBtn.addEventListener("click", () => {
        const diaG_ID = document.getElementById("read-diag-id").value;

        fetch(`https://nursenotes.somee.com/apiDiagnosis/${diaG_ID}`)
            .then(response => response.json())
            .then(data => {
                if (data) {
                    readOutput.innerHTML = `<p>ID: ${data.diaG_ID}, Descripción: ${data.diagdsc}</p>`;
                } else {
                    readOutput.innerHTML = `<p>No se encontró el diagnóstico con ID: ${diaG_ID}</p>`;
                }
            });
    });

    // Actualizar Diagnóstico
    updateBtn.addEventListener("click", () => {
        const diaG_ID = updatediaG_IDSelect.value;
        const diagdsc = document.getElementById("update-diag-dsc").value;

        fetch(`https://nursenotes.somee.com/apiDiagnosis/${diaG_ID}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    DIAG_ID: diaG_ID,
                    DIAGDSC: diagdsc
                }),
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al actualizar el diagnóstico');
                }
                return response.json();
            })
            .then(() => {
                loadDiagnoses();
                updatediaG_IDSelect.selectedIndex = 0;
                document.getElementById("update-diag-dsc").value = "";
            })
            .catch(error => {
                console.error('Hubo un problema con la actualización:', error);
            });
    });

    // Evento para mostrar la sección diagnósticos
    diagBtn.addEventListener("click", () => {
        diagnosSection.style.display = "block";
        loadDiagnoses();
    });
});