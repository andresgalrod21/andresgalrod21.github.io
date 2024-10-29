document.addEventListener("DOMContentLoaded", () => {
    // Elementos y botones del DOM
    const specialityCreateForm = document.getElementById("speciality-create-form");
    const searchSpecialityBtn = document.getElementById("search-speciality-btn");
    const updateSpecialityBtn = document.getElementById("update-speciality-btn");

    const specialitiesTable = document
        .getElementById("specialities-table")
        .getElementsByTagName("tbody")[0];
    const specialitySearchOutput = document.getElementById("speciality-search-output");
    const updateSpecialityIDSelect = document.getElementById("update-speciality-id");
    const specialitiesSection = document.getElementById("specialities"); // Sección de Especialidades
    const specialitiesBtn = document.getElementById("espe-btn"); // Botón de Especialidades

    // Otras secciones que deben ocultarse al ver la sección Especialidades
    const diagnosSection = document.getElementById("diagnosticos");
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
        if (staffSection) staffSection.style.display = "none";
        if (tipdocsSection) tipdocsSection.style.display = "none";
        if (usersSection) usersSection.style.display = "none";
        if (logsSection) logsSection.style.display = "none";
        if (scoreSection) scoreSection.style.display = "none";

        specialitiesSection.style.display = "none";
    }

    // Evento para mostrar solo la sección de especialidades
    specialitiesBtn.addEventListener("click", () => {
        hideAllSections();
        specialitiesSection.style.display = "block";
        loadSpecialities(); // Cargar lista de especialidades
    });

    // Función para cargar Especialidades
    function loadSpecialities() {
        fetch("https://nursenotes.somee.com/apiSpecialities")
            .then((response) => response.json())
            .then((data) => {
                specialitiesTable.innerHTML = ""; // Limpiar tabla
                updateSpecialityIDSelect.innerHTML = ""; // Limpiar select para actualización
                data.forEach((speciality) => {
                    const row = specialitiesTable.insertRow();
                    row.innerHTML = `
                        <td>${speciality.speC_ID}</td>
                        <td>${speciality.specdsc}</td>
                        <td>
                            <button onclick="confirmRemoveSpecialityRow(this)">Eliminar</button>
                        </td>
                    `;

                    // Agregar opción al select de actualización
                    const option = document.createElement("option");
                    option.value = speciality.speC_ID;
                    option.textContent = `${speciality.speC_ID} - ${speciality.specdsc}`;
                    updateSpecialityIDSelect.appendChild(option);
                });
            });
    }

    // Función para confirmar y eliminar una fila visualmente
    window.confirmRemoveSpecialityRow = function (button) {
        if (confirm("¿Estás seguro de que deseas eliminar esta especialidad?")) {
            const row = button.closest("tr");
            row.remove();
        }
    };

    // Crear Especialidad
    specialityCreateForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const specialityData = {
            specdsc: document.getElementById("speciality-desc").value,
        };

        fetch("https://nursenotes.somee.com/apiSpecialities", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(specialityData),
            })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Error al crear la especialidad");
                }
                return response.json();
            })
            .then(() => {
                loadSpecialities();
                specialityCreateForm.reset();
            })
            .catch((error) =>
                console.error("Error en la creación de la especialidad:", error)
            );
    });

    // Buscar Especialidad por ID
    searchSpecialityBtn.addEventListener("click", () => {
        const speC_ID = document.getElementById("search-speciality-id").value;

        fetch(`https://nursenotes.somee.com/apiSpecialities/${speC_ID}`)
            .then((response) => response.json())
            .then((data) => {
                specialitySearchOutput.innerHTML = data ?
                    `<p>ID: ${data.speC_ID}, Descripción: ${data.specdsc}</p>` :
                    `<p>No se encontró la especialidad con ID: ${speC_ID}</p>`;
            })
            .catch((error) => console.error("Error al buscar especialidad:", error));
    });

    // Actualizar Especialidad
    updateSpecialityBtn.addEventListener("click", () => {
        const speC_ID = updateSpecialityIDSelect.value;
        const specialityData = {
            speC_ID: parseInt(speC_ID),
            specdsc: document.getElementById("update-speciality-desc").value,
        };

        fetch(`https://nursenotes.somee.com/apiSpecialities/${speC_ID}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(specialityData),
            })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Error al actualizar la especialidad");
                }
                return response.json();
            })
            .then(() => {
                loadSpecialities();
                updateSpecialityIDSelect.selectedIndex = 0;
                document.getElementById("update-speciality-desc").value = "";
            })
            .catch((error) =>
                console.error("Error en la actualización de la especialidad:", error)
            );
    });
});
