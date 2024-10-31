document.addEventListener("DOMContentLoaded", function() {
    const patientCreateForm = document.getElementById("patient-create-form");
    const searchPatientBtn = document.getElementById("search-patient-btn");
    const updatePatientBtn = document.getElementById("update-patient-btn");

    const patientsTable = document.getElementById("patients-table").getElementsByTagName("tbody")[0];
    const patientSearchOutput = document.getElementById("patient-search-output");
    const updatePatientIDSelect = document.getElementById("update-patient-id");
    const patientsSection = document.getElementById("patients");
    const patientsBtn = document.getElementById("pacientes-btn");

    // Validar email
    function isValidEmail(email) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    }

    // Función para ocultar todas las secciones
    function hideAllSections() {
        const sections = [
            "diagnosticos", "groups", "folios", "headquarters", "incomes", "medications",
            "permissions-groups", "permissions", "staff", "tipdocs", "logs", "score", "users", "patients", "patient-records",
            "signs", "supplies-patients"
        ];
        sections.forEach(id => {
            const section = document.getElementById(id);
            if (section) section.style.display = "none";
        });
    }

    // Evento para mostrar solo la sección de pacientes
    patientsBtn.addEventListener("click", () => {
        hideAllSections();
        patientsSection.style.display = "block";
        loadPatients();
    });

    // Función para cargar Pacientes
    function loadPatients() {
        fetch("https://nursenotes.somee.com/apiPatients")
            .then(response => response.json())
            .then(data => {
                patientsTable.innerHTML = "";
                updatePatientIDSelect.innerHTML = '<option value="">Seleccione un paciente</option>';
                data.forEach(patient => {
                    const row = patientsTable.insertRow();
                    row.innerHTML = `
                        <td>${patient.patienT_ID}</td>
                        <td>${patient.name}</td>
                        <td>${patient.lastname}</td>
                        <td>${patient.tipdoC_ID}</td>
                        <td>${patient.numdoc}</td>
                        <td>${patient.age}</td>
                        <td>${patient.numcontact}</td>
                        <td>${patient.mail}</td>
                        <td><button onclick="confirmRemovePatientRow(this)">Eliminar</button></td>
                    `;

                    const option = document.createElement("option");
                    option.value = patient.patienT_ID;
                    option.textContent = `${patient.patienT_ID} - ${patient.name} ${patient.lastname}`;
                    updatePatientIDSelect.appendChild(option);
                });
            });
    }

    // Función para confirmar y eliminar una fila visualmente
    window.confirmRemovePatientRow = function(button) {
        if (confirm("¿Estás seguro de que deseas eliminar este paciente?")) {
            const row = button.closest("tr");
            row.remove();
        }
    };

    // Crear Paciente
    patientCreateForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = document.getElementById("patient-name").value;
        const lastname = document.getElementById("patient-lastname").value;
        const tipdocID = parseInt(document.getElementById("patient-tipdoc-id").value);
        const numdoc = parseInt(document.getElementById("patient-numdoc").value);
        const age = parseInt(document.getElementById("patient-age").value);
        const numcontact = parseInt(document.getElementById("patient-numcontact").value);
        const mail = document.getElementById("patient-mail").value;

        // Validaciones
        if (isNaN(numcontact)) {
            alert("El número de contacto debe ser numérico.");
            return;
        }
        if (!isValidEmail(mail)) {
            alert("Por favor ingrese un correo electrónico válido.");
            return;
        }

        const patientData = {
            patienT_ID: 0,
            name: name,
            lastname: lastname,
            tipdoC_ID: tipdocID,
            numdoc: numdoc,
            age: age,
            numcontact: numcontact,
            mail: mail,
            tipDocs: {
                tipdoC_ID: tipdocID,
                tipdocdsc: ""
            }
        };

        fetch("https://nursenotes.somee.com/apiPatients", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(patientData),
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(errorData => {
                        console.error("Error en la respuesta del servidor:", errorData);
                        throw new Error("Error al crear el paciente");
                    });
                }
                return response.json();
            })
            .then(data => {
                console.log("Paciente creado con éxito:", data);
                loadPatients();
                patientCreateForm.reset();
            })
            .catch(error => console.error("Error en la creación del paciente:", error));
    });

    // Llenar campos de actualización automáticamente al seleccionar un paciente
    updatePatientIDSelect.addEventListener("change", () => {
        const selectedPatientId = updatePatientIDSelect.value;
        if (!selectedPatientId) return; // Si no hay selección, salir

        fetch(`https://nursenotes.somee.com/apiPatients/${selectedPatientId}`)
            .then(response => response.json())
            .then(patient => {
                document.getElementById("update-patient-name").value = patient.name;
                document.getElementById("update-patient-lastname").value = patient.lastname;
                document.getElementById("update-patient-tipdoc-id").value = patient.tipdoC_ID;
                document.getElementById("update-patient-numdoc").value = patient.numdoc;
                document.getElementById("update-patient-age").value = patient.age;
                document.getElementById("update-patient-numcontact").value = patient.numcontact;
                document.getElementById("update-patient-mail").value = patient.mail;
            })
            .catch(error => console.error("Error al cargar los datos del paciente:", error));
    });

    // Actualizar Paciente
    updatePatientBtn.addEventListener("click", (e) => {
        e.preventDefault();

        const patienT_ID = parseInt(updatePatientIDSelect.value);
        const name = document.getElementById("update-patient-name").value;
        const lastname = document.getElementById("update-patient-lastname").value;
        const tipdocID = parseInt(document.getElementById("update-patient-tipdoc-id").value);
        const numdoc = parseInt(document.getElementById("update-patient-numdoc").value);
        const age = parseInt(document.getElementById("update-patient-age").value);
        const numcontact = parseInt(document.getElementById("update-patient-numcontact").value);
        const mail = document.getElementById("update-patient-mail").value;

        // Validaciones
        if (isNaN(numcontact)) {
            alert("El número de contacto debe ser numérico.");
            return;
        }
        if (!isValidEmail(mail)) {
            alert("Por favor ingrese un correo electrónico válido.");
            return;
        }

        const patientData = {
            patienT_ID: patienT_ID,
            name: name,
            lastname: lastname,
            tipdoC_ID: tipdocID,
            numdoc: numdoc,
            age: age,
            numcontact: numcontact,
            mail: mail,
            tipDocs: {
                tipdoC_ID: tipdocID,
                tipdocdsc: ""
            }
        };

        fetch(`https://nursenotes.somee.com/apiPatients/${patienT_ID}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(patientData),
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(errorData => {
                        console.error("Error en la respuesta del servidor:", errorData);
                        throw new Error("Error al actualizar el paciente");
                    });
                }
                return response.json();
            })
            .then(() => {
                loadPatients();
                updatePatientIDSelect.selectedIndex = 0;
                document.getElementById("update-patient-name").value = "";
                document.getElementById("update-patient-lastname").value = "";
                document.getElementById("update-patient-tipdoc-id").value = "";
                document.getElementById("update-patient-numdoc").value = "";
                document.getElementById("update-patient-age").value = "";
                document.getElementById("update-patient-numcontact").value = "";
                document.getElementById("update-patient-mail").value = "";
            })
            .catch(error => console.error("Error en la actualización del paciente:", error));
    });
});
