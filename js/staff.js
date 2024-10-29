document.addEventListener("DOMContentLoaded", () => {
    // Elementos y botones del DOM
    const staffCreateForm = document.getElementById("staff-create-form");
    const searchStaffBtn = document.getElementById("search-staff-btn");
    const updateStaffBtn = document.getElementById("update-staff-btn");

    const staffTable = document.getElementById("staff-table").getElementsByTagName("tbody")[0];
    const staffSearchOutput = document.getElementById("staff-search-output");
    const updateStaffIDSelect = document.getElementById("update-staff-id");
    const staffSection = document.getElementById("staff"); // Sección de Staff
    const staffBtn = document.getElementById("staff-btn"); // Botón de Staff

    // Otras secciones que deben ocultarse al ver la sección Staff
    const diagnosSection = document.getElementById("diagnosticos");
    const groupsSection = document.getElementById("groups");
    const foliosSection = document.getElementById("folios");
    const headquartersSection = document.getElementById("headquarters");
    const incomesSection = document.getElementById("incomes");
    const medicationsSection = document.getElementById("medications");
    const permissionsGroupsSection = document.getElementById("permissions-groups");
    const permissionsSection = document.getElementById("permissions");
    const tipdocsSection = document.getElementById("tipdocs");
    const usersSection = document.getElementById("users");
    const logsSection = document.getElementById("logs");
    const scoreSection = document.getElementById("score");



    // Función para ocultar todas las secciones
    function hideAllSections() {
        if (diagnosSection) diagnosSection.style.display = "none";
        if (groupsSection) groupsSection.style.display = "none";
        if (foliosSection) foliosSection.style.display = "none";
        if (headquartersSection) headquartersSection.style.display = "none";
        if (incomesSection) incomesSection.style.display = "none";
        if (medicationsSection) medicationsSection.style.display = "none";
        if (permissionsGroupsSection) permissionsGroupsSection.style.display = "none";
        if (permissionsSection) permissionsSection.style.display = "none";
        if (tipdocsSection) tipdocsSection.style.display = "none";
        if (usersSection) usersSection.style.display = "none";
        if (logsSection) logsSection.style.display = "none";
        if (scoreSection) scoreSection.style.display = "none";

        
        staffSection.style.display = "none";
    }

    // Evento para mostrar solo la sección de staff
    staffBtn.addEventListener("click", () => {
        hideAllSections();
        staffSection.style.display = "block";
        loadStaff(); // Cargar lista de staff
    });

    // Función para cargar Staff
    function loadStaff() {
        fetch("https://nursenotes.somee.com/apiStaff")
            .then((response) => response.json())
            .then((data) => {
                staffTable.innerHTML = ""; // Limpiar tabla
                updateStaffIDSelect.innerHTML = ""; // Limpiar select para actualización
                data.forEach((staff) => {
                    const row = staffTable.insertRow();
                    row.innerHTML = `
                        <td>${staff.stafF_ID}</td>
                        <td>${staff.medstaff}</td>
                        <td>${staff.speC_ID}</td>
                        <td>${staff.headQ_ID}</td>
                        <td>${staff.usR_ID}</td>
                        <td>
                            <button onclick="confirmRemoveStaffRow(this)">Eliminar</button>
                        </td>
                    `;

                    // Agregar opción al select de actualización
                    const option = document.createElement("option");
                    option.value = staff.stafF_ID;
                    option.textContent = `${staff.stafF_ID} - ${staff.medstaff}`;
                    updateStaffIDSelect.appendChild(option);
                });
            });
    }

    // Función para confirmar y eliminar una fila visualmente
    window.confirmRemoveStaffRow = function (button) {
        if (confirm("¿Estás seguro de que deseas eliminar este staff?")) {
            const row = button.closest("tr");
            row.remove();
        }
    };

    // Crear Staff
    staffCreateForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const staffData = {
            medstaff: document.getElementById("staff-medstaff").value,
            speC_ID: parseInt(document.getElementById("staff-spec-id").value),
            headQ_ID: parseInt(document.getElementById("staff-headquarter-id").value),
            usR_ID: parseInt(document.getElementById("staff-user-id").value),
        };

        fetch("https://nursenotes.somee.com/apiStaff", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(staffData),
            })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Error al crear el staff");
                }
                return response.json();
            })
            .then(() => {
                loadStaff();
                staffCreateForm.reset();
            })
            .catch((error) =>
                console.error("Error en la creación del staff:", error)
            );
    });

    // Buscar Staff por ID
    searchStaffBtn.addEventListener("click", () => {
        const stafF_ID = document.getElementById("search-staff-id").value;

        fetch(`https://nursenotes.somee.com/apiStaff/${stafF_ID}`)
            .then((response) => response.json())
            .then((data) => {
                staffSearchOutput.innerHTML = data ?
                    `<p>ID: ${data.stafF_ID}, Nombre: ${data.medstaff}, Especialidad: ${data.speC_ID}, Sede: ${data.headQ_ID}, Usuario: ${data.usR_ID}</p>` :
                    `<p>No se encontró el staff con ID: ${stafF_ID}</p>`;
            })
            .catch((error) => console.error("Error al buscar staff:", error));
    });

    // Actualizar Staff
    updateStaffBtn.addEventListener("click", () => {
        const stafF_ID = updateStaffIDSelect.value;
        const staffData = {
            stafF_ID: parseInt(stafF_ID),
            medstaff: document.getElementById("update-staff-medstaff").value,
            speC_ID: parseInt(document.getElementById("update-staff-spec-id").value),
            headQ_ID: parseInt(document.getElementById("update-staff-headquarter-id").value),
            usR_ID: parseInt(document.getElementById("update-staff-user-id").value),
        };

        fetch(`https://nursenotes.somee.com/apiStaff/${stafF_ID}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(staffData),
            })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Error al actualizar el staff");
                }
                return response.json();
            })
            .then(() => {
                loadStaff();
                updateStaffIDSelect.selectedIndex = 0;
                document.getElementById("update-staff-medstaff").value = "";
                document.getElementById("update-staff-spec-id").value = "";
                document.getElementById("update-staff-headquarter-id").value = "";
                document.getElementById("update-staff-user-id").value = "";
            })
            .catch((error) =>
                console.error("Error en la actualización del staff:", error)
            );
    });
});
