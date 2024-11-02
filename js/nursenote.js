
document.addEventListener("DOMContentLoaded", function() {
    const nurseNoteCreateForm = document.getElementById("nurse-note-create-form");
    const searchNurseNoteBtn = document.getElementById("search-nurse-note-btn");
    const updateNurseNoteBtn = document.getElementById("update-nurse-note-btn");

    const nurseNotesTable = document.getElementById("nurse-notes-table").getElementsByTagName("tbody")[0];
    const nurseNoteSearchOutput = document.getElementById("nurse-note-search-output");
    const updateNurseNoteIDSelect = document.getElementById("update-nurse-note-id");
    const nurseNotesSection = document.getElementById("nurse-note-section");
    const nurseNotesBtn = document.getElementById("notas-enfermeria-btn");

    // Función para ocultar todas las secciones
    function hideAllSections() {
        const sections = [
            "diagnosticos", "groups", "folios", "headquarters", "incomes", "medications",
            "permissions-groups", "permissions", "staff", "tipdocs", "logs", "score", "users", "patients", "supplies-patients", 
            "nurse-note-section", "signs", "patient-records"
        ];
        sections.forEach(id => {
            const section = document.getElementById(id);
            if (section) section.style.display = "none";
        });
    }

    // Evento para mostrar solo la sección de notas de enfermería
    nurseNotesBtn.addEventListener("click", () => {
        hideAllSections();
        nurseNotesSection.style.display = "block";
        loadNurseNotes();
    });

    // Función para cargar Notas de Enfermería
    function loadNurseNotes() {
        fetch("https://nursenotes.somee.com/apiNurseNote")
            .then(response => response.json())
            .then(data => {
                nurseNotesTable.innerHTML = "";
                updateNurseNoteIDSelect.innerHTML = '<option value="">Seleccione una nota</option>';
                data.forEach(nurseNote => {
                    const row = nurseNotesTable.insertRow();
                    row.innerHTML = `
                        <td>${nurseNote.notE_ID}</td>
                        <td>${nurseNote.incomE_ID}</td>
                        <td>${nurseNote.patienT_ID}</td>
                        <td>${nurseNote.reasoncons}</td>
                        <td>${nurseNote.diaG_ID}</td>
                        <td>${nurseNote.speC_ID}</td>
                        <td>${nurseNote.usR_ID}</td>
                        <td>${nurseNote.stafF_ID}</td>
                        <td><button onclick="confirmRemoveNurseNoteRow(this)">Eliminar</button></td>
                    `;

                    const option = document.createElement("option");
                    option.value = nurseNote.notE_ID;
                    option.textContent = `ID: ${nurseNote.notE_ID} - Motivo: ${nurseNote.reasoncons}`;
                    updateNurseNoteIDSelect.appendChild(option);
                });
            });
    }

    // Función para confirmar y eliminar una fila visualmente
    window.confirmRemoveNurseNoteRow = function(button) {
        if (confirm("¿Estás seguro de que deseas eliminar esta nota?")) {
            const row = button.closest("tr");
            row.remove();
        }
    };

    // Crear Nota de Enfermería
    nurseNoteCreateForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const incomE_ID = parseInt(document.getElementById("nurse-income-id").value);
        const patienT_ID = parseInt(document.getElementById("nurse-patient-id").value);
        const reasoncons = document.getElementById("nurse-reason-consult").value;
        const diaG_ID = parseInt(document.getElementById("nurse-diagnosis-id").value);
        const speC_ID = parseInt(document.getElementById("nurse-specialty-id").value);
        const usR_ID = parseInt(document.getElementById("nurse-user-id").value);
        const stafF_ID = parseInt(document.getElementById("nurse-staff-id").value);

        const nurseNoteData = {
            notE_ID: 0,
            incomE_ID: incomE_ID,
            patienT_ID: patienT_ID,
            reasoncons: reasoncons,
            diaG_ID: diaG_ID,
            speC_ID: speC_ID,
            usR_ID: usR_ID,
            stafF_ID: stafF_ID,
        };

        fetch("https://nursenotes.somee.com/apiNurseNote", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(nurseNoteData),
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(errorData => {
                        console.error("Error en la respuesta del servidor:", errorData);
                        throw new Error("Error al crear la nota de enfermería");
                    });
                }
                return response.json();
            })
            .then(data => {
                console.log("Nota de enfermería creada con éxito:", data);
                loadNurseNotes();
                nurseNoteCreateForm.reset();
            })
            .catch(error => console.error("Error en la creación de la nota de enfermería:", error));
    });

    // Llenar campos de actualización automáticamente al seleccionar una nota
    updateNurseNoteIDSelect.addEventListener("change", () => {
        const selectedNoteId = updateNurseNoteIDSelect.value;
        if (!selectedNoteId) return;

        fetch(`https://nursenotes.somee.com/apiNurseNote/${selectedNoteId}`)
            .then(response => response.json())
            .then(nurseNote => {
                document.getElementById("update-nurse-income-id").value = nurseNote.incomE_ID;
                document.getElementById("update-nurse-patient-id").value = nurseNote.patienT_ID;
                document.getElementById("update-nurse-reason-consult").value = nurseNote.reasoncons;
                document.getElementById("update-nurse-diagnosis-id").value = nurseNote.diaG_ID;
                document.getElementById("update-nurse-specialty-id").value = nurseNote.speC_ID;
                document.getElementById("update-nurse-user-id").value = nurseNote.usR_ID;
                document.getElementById("update-nurse-staff-id").value = nurseNote.stafF_ID;
            })
            .catch(error => console.error("Error al cargar los datos de la nota de enfermería:", error));
    });

    // Actualizar Nota de Enfermería
    updateNurseNoteBtn.addEventListener("click", (e) => {
        e.preventDefault();

        const notE_ID = parseInt(updateNurseNoteIDSelect.value);
        const incomE_ID = parseInt(document.getElementById("update-nurse-income-id").value);
        const patienT_ID = parseInt(document.getElementById("update-nurse-patient-id").value);
        const reasoncons = document.getElementById("update-nurse-reason-consult").value;
        const diaG_ID = parseInt(document.getElementById("update-nurse-diagnosis-id").value);
        const speC_ID = parseInt(document.getElementById("update-nurse-specialty-id").value);
        const usR_ID = parseInt(document.getElementById("update-nurse-user-id").value);
        const stafF_ID = parseInt(document.getElementById("update-nurse-staff-id").value);

        const nurseNoteData = {
            notE_ID: notE_ID,
            incomE_ID: incomE_ID,
            patienT_ID: patienT_ID,
            reasoncons: reasoncons,
            diaG_ID: diaG_ID,
            speC_ID: speC_ID,
            usR_ID: usR_ID,
            stafF_ID: stafF_ID,
        };

        fetch(`https://nursenotes.somee.com/apiNurseNote/${notE_ID}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(nurseNoteData),
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(errorData => {
                        console.error("Error en la respuesta del servidor:", errorData);
                        throw new Error("Error al actualizar la nota de enfermería");
                    });
                }
                return response.json();
            })
            .then(() => {
                loadNurseNotes();
                updateNurseNoteIDSelect.selectedIndex = 0;
                document.getElementById("update-nurse-income-id").value = "";
                document.getElementById("update-nurse-patient-id").value = "";
                document.getElementById("update-nurse-reason-consult").value = "";
                document.getElementById("update-nurse-diagnosis-id").value = "";
                document.getElementById("update-nurse-specialty-id").value = "";
                document.getElementById("update-nurse-user-id").value = "";
                document.getElementById("update-nurse-staff-id").value = "";
            })
            .catch(error => console.error("Error en la actualización de la nota de enfermería:", error));
    });
});
