document.addEventListener("DOMContentLoaded", () => {
    const diagnosisCreateForm = document.getElementById("diagnosis-create-form");
    const readBtn = document.getElementById("read-btn");
    const updateBtn = document.getElementById("update-btn");
    const diagnosisTable = document.getElementById("diagnosis-table").getElementsByTagName('tbody')[0];
    const readOutput = document.getElementById("read-output");
    const updatediaG_IDSelect = document.getElementById("update-diag-id");
    const diagnosSection = document.getElementById("diagnosticos");
    const diagBtn = document.getElementById("diag-btn"); // Selecciona el botón de diagnósticos

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
  diagBtn.addEventListener("click", () => {
    hideAllSections();
    diagnosSection.style.display = "block";
    loadDiagnoses();
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