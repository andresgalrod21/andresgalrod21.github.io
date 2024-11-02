

document.addEventListener("DOMContentLoaded", function() {
    const recordCreateForm = document.getElementById("patient-record-create-form");
    const searchRecordBtn = document.getElementById("search-record-btn");
    const updateRecordBtn = document.getElementById("update-record-btn");

    const recordsTable = document.getElementById("patient-records-table").getElementsByTagName("tbody")[0];
    const recordSearchOutput = document.getElementById("record-search-output");
    const updateRecordIDSelect = document.getElementById("update-record-id");
    const recordsSection = document.getElementById("patient-records");
    const recordsBtn = document.getElementById("datos-pacientes-btn");

    // Función para ocultar todas las secciones
    function hideAllSections() {
        const sections = [
            "diagnosticos", "groups", "folios", "headquarters", "incomes", "medications",
            "permissions-groups", "permissions", "staff", "tipdocs", "logs", "score", "users", "patients", "patient-records",
            "signs", "supplies-patients", "folios", "nurse-note-section"
        ];
        sections.forEach(id => {
            const section = document.getElementById(id);
            if (section) section.style.display = "none";
        });
    }

    // Evento para mostrar solo la sección de registros de pacientes
    recordsBtn.addEventListener("click", () => {
        hideAllSections();
        recordsSection.style.display = "block";
        loadRecords();
    });

    // Función para cargar Registros de Pacientes
    function loadRecords() {
        fetch("https://nursenotes.somee.com/apiPatientRecords")
            .then(response => response.json())
            .then(data => {
                recordsTable.innerHTML = "";
                updateRecordIDSelect.innerHTML = '<option value="">Seleccione un registro</option>';
                data.forEach(record => {
                    const row = recordsTable.insertRow();
                    row.innerHTML = `
                        <td>${record.patR_ID}</td>
                        <td>${record.rh}</td>
                        <td>${record.allergies ? "Sí" : "No"}</td>
                        <td>${record.allerG_DSC}</td>
                        <td>${record.surgeries ? "Sí" : "No"}</td>
                        <td>${record.surgeR_DSC}</td>
                        <td>${record.incomE_ID}</td>
                        <td><button onclick="confirmRemoveRecordRow(this)">Eliminar</button></td>
                    `;

                    const option = document.createElement("option");
                    option.value = record.patR_ID;
                    option.textContent = `${record.patR_ID} - RH: ${record.rh}`;
                    updateRecordIDSelect.appendChild(option);
                });
            });
    }

    // Función para confirmar y eliminar una fila visualmente
    window.confirmRemoveRecordRow = function(button) {
        if (confirm("¿Estás seguro de que deseas eliminar este registro de paciente?")) {
            const row = button.closest("tr");
            row.remove();
        }
    };

    // Crear Registro de Paciente
    recordCreateForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const rh = document.getElementById("record-rh").value;
        const allergies = document.getElementById("record-allergies").value === "true";
        const allerG_DSC = document.getElementById("record-allerG_DSC").value;
        const surgeries = document.getElementById("record-surgeries").value === "true";
        const surgeR_DSC = document.getElementById("record-surgeR_DSC").value;
        const incomE_ID = parseInt(document.getElementById("record-income-id").value);

        const recordData = {
            patR_ID: 0,
            rh: rh,
            allergies: allergies,
            allerG_DSC: allerG_DSC,
            surgeries: surgeries,
            surgeR_DSC: surgeR_DSC,
            incomE_ID: incomE_ID,
            incomes: {
                incomE_ID: incomE_ID,
                tipdoC_ID: 0,
                patienT_ID: 0,
                fchincome: "",
                usR_ID: 0,
                tipDocs: { tipdoC_ID: 0, tipdocdsc: "" },
                patients: {
                    patienT_ID: 0,
                    name: "",
                    lastname: "",
                    tipdoC_ID: 0,
                    numdoc: 0,
                    age: 0,
                    numcontact: 0,
                    mail: ""
                },
                users: {
                    usR_ID: 0,
                    name: "",
                    lastname: "",
                    tipdoc: "",
                    numdoc: 0,
                    usrpsw: "",
                    usr: "",
                    fchcreation: ""
                }
            }
        };

        fetch("https://nursenotes.somee.com/apiPatientRecords", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(recordData),
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(errorData => {
                        console.error("Error en la respuesta del servidor:", errorData);
                        throw new Error("Error al crear el registro de paciente");
                    });
                }
                return response.json();
            })
            .then(data => {
                console.log("Registro de paciente creado con éxito:", data);
                loadRecords();
                recordCreateForm.reset();
            })
            .catch(error => console.error("Error en la creación del registro de paciente:", error));
    });

    // Llenar campos de actualización automáticamente al seleccionar un registro
    updateRecordIDSelect.addEventListener("change", () => {
        const selectedRecordId = updateRecordIDSelect.value;
        if (!selectedRecordId) return; // Si no hay selección, salir

        fetch(`https://nursenotes.somee.com/apiPatientRecords/${selectedRecordId}`)
            .then(response => response.json())
            .then(record => {
                document.getElementById("update-record-rh").value = record.rh;
                document.getElementById("update-record-allergies").value = record.allergies ? "true" : "false";
                document.getElementById("update-record-allerG_DSC").value = record.allerG_DSC;
                document.getElementById("update-record-surgeries").value = record.surgeries ? "true" : "false";
                document.getElementById("update-record-surgeR_DSC").value = record.surgeR_DSC;
                document.getElementById("update-record-income-id").value = record.incomE_ID;
            })
            .catch(error => console.error("Error al cargar los datos del registro de paciente:", error));
    });

    // Actualizar Registro de Paciente
    updateRecordBtn.addEventListener("click", (e) => {
        e.preventDefault();

        const patR_ID = parseInt(updateRecordIDSelect.value);
        const rh = document.getElementById("update-record-rh").value;
        const allergies = document.getElementById("update-record-allergies").value === "true";
        const allerG_DSC = document.getElementById("update-record-allerG_DSC").value;
        const surgeries = document.getElementById("update-record-surgeries").value === "true";
        const surgeR_DSC = document.getElementById("update-record-surgeR_DSC").value;
        const incomE_ID = parseInt(document.getElementById("update-record-income-id").value);

        const recordData = {
            patR_ID: patR_ID,
            rh: rh,
            allergies: allergies,
            allerG_DSC: allerG_DSC,
            surgeries: surgeries,
            surgeR_DSC: surgeR_DSC,
            incomE_ID: incomE_ID,
            incomes: {
                incomE_ID: incomE_ID,
                tipdoC_ID: 0,
                patienT_ID: 0,
                fchincome: "",
                usR_ID: 0,
                tipDocs: { tipdoC_ID: 0, tipdocdsc: "" },
                patients: {
                    patienT_ID: 0,
                    name: "",
                    lastname: "",
                    tipdoC_ID: 0,
                    numdoc: 0,
                    age: 0,
                    numcontact: 0,
                    mail: ""
                },
                users: {
                    usR_ID: 0,
                    name: "",
                    lastname: "",
                    tipdoc: "",
                    numdoc: 0,
                    usrpsw: "",
                    usr: "",
                    fchcreation: ""
                }
            }
        };

        fetch(`https://nursenotes.somee.com/apiPatientRecords/${patR_ID}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(recordData),
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(errorData => {
                        console.error("Error en la respuesta del servidor:", errorData);
                        throw new Error("Error al actualizar el registro de paciente");
                    });
                }
                return response.json();
            })
            .then(() => {
                loadRecords();
                updateRecordIDSelect.selectedIndex = 0;
                document.getElementById("update-record-rh").value = "";
                document.getElementById("update-record-allergies").value = "false";
                document.getElementById("update-record-allerG_DSC").value = "";
                document.getElementById("update-record-surgeries").value = "false";
                document.getElementById("update-record-surgeR_DSC").value = "";
                document.getElementById("update-record-income-id").value = "";
            })
            .catch(error => console.error("Error en la actualización del registro de paciente:", error));
    });
});
