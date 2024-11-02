

document.addEventListener("DOMContentLoaded", function() {
    const supplyCreateForm = document.getElementById("supplies-create-form");
    const searchSupplyBtn = document.getElementById("search-supply-btn");
    const updateSupplyBtn = document.getElementById("update-supply-btn");

    const suppliesTable = document.getElementById("supplies-table").getElementsByTagName("tbody")[0];
    const supplySearchOutput = document.getElementById("supply-search-output");
    const updateSupplyIDSelect = document.getElementById("update-supply-id");
    const suppliesSection = document.getElementById("supplies-patients");
    const suppliesBtn = document.getElementById("medicamentos-paciente-btn");

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

    // Evento para mostrar solo la sección de suministros a pacientes
    suppliesBtn.addEventListener("click", () => {
        hideAllSections();
        suppliesSection.style.display = "block";
        loadSupplies();
    });

    // Función para cargar Suministros a Pacientes
    function loadSupplies() {
        fetch("https://nursenotes.somee.com/apiSuppliesPatients")
            .then(response => response.json())
            .then(data => {
                suppliesTable.innerHTML = "";
                updateSupplyIDSelect.innerHTML = '<option value="">Seleccione un suministro</option>';
                data.forEach(supply => {
                    const row = suppliesTable.insertRow();
                    row.innerHTML = `
                        <td>${supply.suP_ID}</td>
                        <td>${supply.cantsup}</td>
                        <td>${supply.incomE_ID}</td>
                        <td>${supply.meD_ID}</td>
                        <td><button onclick="confirmRemoveSupplyRow(this)">Eliminar</button></td>
                    `;

                    const option = document.createElement("option");
                    option.value = supply.suP_ID;
                    option.textContent = `ID: ${supply.suP_ID} - Cantidad: ${supply.cantsup}`;
                    updateSupplyIDSelect.appendChild(option);
                });
            });
    }

    // Función para confirmar y eliminar una fila visualmente
    window.confirmRemoveSupplyRow = function(button) {
        if (confirm("¿Estás seguro de que deseas eliminar este suministro?")) {
            const row = button.closest("tr");
            row.remove();
        }
    };

    // Crear Suministro a Paciente
    supplyCreateForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const cantsup = parseInt(document.getElementById("supply-cantsup").value);
        const incomE_ID = parseInt(document.getElementById("supply-income-id").value);
        const meD_ID = parseInt(document.getElementById("supply-med-id").value);

        const supplyData = {
            suP_ID: 0,
            cantsup: cantsup,
            incomE_ID: incomE_ID,
            meD_ID: meD_ID,
            incomes: {
                incomE_ID: incomE_ID,
                tipdoC_ID: 0,
                patienT_ID: 0,
                fchincome: "",
                usR_ID: 0
            },
            medications: {
                meD_ID: meD_ID,
                meddsc: "",
                stock: 0
            }
        };

        fetch("https://nursenotes.somee.com/apiSuppliesPatients", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(supplyData),
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(errorData => {
                        console.error("Error en la respuesta del servidor:", errorData);
                        throw new Error("Error al crear el suministro");
                    });
                }
                return response.json();
            })
            .then(data => {
                console.log("Suministro creado con éxito:", data);
                loadSupplies();
                supplyCreateForm.reset();
            })
            .catch(error => console.error("Error en la creación del suministro:", error));
    });

    // Llenar campos de actualización automáticamente al seleccionar un suministro
    updateSupplyIDSelect.addEventListener("change", () => {
        const selectedSupplyId = updateSupplyIDSelect.value;
        if (!selectedSupplyId) return; // Si no hay selección, salir

        fetch(`https://nursenotes.somee.com/apiSuppliesPatients/${selectedSupplyId}`)
            .then(response => response.json())
            .then(supply => {
                document.getElementById("update-supply-cantsup").value = supply.cantsup;
                document.getElementById("update-supply-income-id").value = supply.incomE_ID;
                document.getElementById("update-supply-med-id").value = supply.meD_ID;
            })
            .catch(error => console.error("Error al cargar los datos del suministro:", error));
    });

    // Actualizar Suministro a Paciente
    updateSupplyBtn.addEventListener("click", (e) => {
        e.preventDefault();

        const suP_ID = parseInt(updateSupplyIDSelect.value);
        const cantsup = parseInt(document.getElementById("update-supply-cantsup").value);
        const incomE_ID = parseInt(document.getElementById("update-supply-income-id").value);
        const meD_ID = parseInt(document.getElementById("update-supply-med-id").value);

        const supplyData = {
            suP_ID: suP_ID,
            cantsup: cantsup,
            incomE_ID: incomE_ID,
            meD_ID: meD_ID,
            incomes: {
                incomE_ID: incomE_ID,
                tipdoC_ID: 0,
                patienT_ID: 0,
                fchincome: "",
                usR_ID: 0
            },
            medications: {
                meD_ID: meD_ID,
                meddsc: "",
                stock: 0
            }
        };

        fetch(`https://nursenotes.somee.com/apiSuppliesPatients/${suP_ID}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(supplyData),
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(errorData => {
                        console.error("Error en la respuesta del servidor:", errorData);
                        throw new Error("Error al actualizar el suministro");
                    });
                }
                return response.json();
            })
            .then(() => {
                loadSupplies();
                updateSupplyIDSelect.selectedIndex = 0;
                document.getElementById("update-supply-cantsup").value = "";
                document.getElementById("update-supply-income-id").value = "";
                document.getElementById("update-supply-med-id").value = "";
            })
            .catch(error => console.error("Error en la actualización del suministro:", error));
    });
});
