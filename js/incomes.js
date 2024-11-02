document.addEventListener("DOMContentLoaded", () => {
    // Elementos y botones del DOM
    const incomeCreateForm = document.getElementById("income-create-form");
    const searchIncomeBtn = document.getElementById("search-income-btn");
    const updateIncomeBtn = document.getElementById("update-income-btn");
    const incomesTable = document.getElementById("incomes-table").getElementsByTagName('tbody')[0];
    const incomeSearchOutput = document.getElementById("income-search-output");
    const updateIncomeIDSelect = document.getElementById("update-income-id");
    const incomesSection = document.getElementById("incomes"); // Sección de Ingresos
    const incomesBtn = document.getElementById("income-btn"); // Botón de Ingresos

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
  incomesBtn.addEventListener("click", () => {
    hideAllSections();
    incomesSection.style.display = "block";
    loadIncomes();
  });
    // Función para cargar Ingresos
    function loadIncomes() {
        fetch('https://nursenotes.somee.com/apiIncomes')
            .then(response => response.json())
            .then(data => {
                incomesTable.innerHTML = ""; // Limpiar tabla
                updateIncomeIDSelect.innerHTML = ""; // Limpiar select para actualización
                data.forEach(income => {
                    const row = incomesTable.insertRow();
                    row.innerHTML = `
                        <td>${income.incomE_ID}</td>
                        <td>${income.tipdoC_ID}</td>
                        <td>${income.patienT_ID}</td>
                        <td>${income.usR_ID}</td>
                        <td>
                            <button onclick="confirmRemoveIncomeRow(this)">Eliminar</button>
                        </td>
                    `;
                    
                    // Agregar opción al select de actualización
                    const option = document.createElement("option");
                    option.value = income.incomE_ID;
                    option.textContent = `${income.incomE_ID} - ${income.tipdoC_ID}`;
                    updateIncomeIDSelect.appendChild(option);
                });
            });
    }

    // Función para confirmar y eliminar una fila visualmente
    window.confirmRemoveIncomeRow = function(button) {
        if (confirm("¿Estás seguro de que deseas eliminar este ingreso?")) {
            const row = button.closest("tr");
            row.remove();
        }
    };

    // Crear Ingreso
    incomeCreateForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const incomeData = {
            tipdoC_ID: parseInt(document.getElementById("income-tipdoc-id").value),
            patienT_ID: parseInt(document.getElementById("income-patient-id").value),
            usR_ID: parseInt(document.getElementById("income-user-id").value),
        };

        fetch('https://nursenotes.somee.com/apiIncomes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(incomeData),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al crear el ingreso');
            }
            return response.json();
        })
        .then(() => {
            loadIncomes();
            incomeCreateForm.reset();
        })
        .catch(error => console.error('Error en la creación del ingreso:', error));
    });

    // Buscar Ingreso por ID
    searchIncomeBtn.addEventListener("click", () => {
        const incomE_ID = document.getElementById("search-income-id").value;

        fetch(`https://nursenotes.somee.com/apiIncomes/${incomE_ID}`)
            .then(response => response.json())
            .then(data => {
                incomeSearchOutput.innerHTML = data
                    ? `<p>ID: ${data.incomE_ID}, ID Usuario: ${data.usR_ID}</p>`
                    : `<p>No se encontró el ingreso con ID: ${incomE_ID}</p>`;
            })
            .catch(error => console.error('Error al buscar ingreso:', error));
    });

    // Actualizar Ingreso
    updateIncomeBtn.addEventListener("click", () => {
        const incomE_ID = updateIncomeIDSelect.value;
        const incomeData = {
            tipdoC_ID: parseInt(document.getElementById("update-income-tipdoc-id").value),
            patienT_ID: parseInt(document.getElementById("update-income-patient-id").value),
            usR_ID: parseInt(document.getElementById("update-income-user-id").value),
        };

        fetch(`https://nursenotes.somee.com/apiIncomes/${incomE_ID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(incomeData),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al actualizar el ingreso');
            }
            return response.json();
        })
        .then(() => {
            loadIncomes();
            updateIncomeIDSelect.selectedIndex = 0;
            document.getElementById("update-income-tipdoc-id").value = "";
            document.getElementById("update-income-patient-id").value = "";
            document.getElementById("update-income-user-id").value = "";
        })
        .catch(error => console.error('Error en la actualización del ingreso:', error));
    });
});
