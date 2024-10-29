document.addEventListener("DOMContentLoaded", () => {
    const logsSection = document.getElementById("logs"); // Sección de Logs
    const logsTable = document.getElementById("logs-table").getElementsByTagName("tbody")[0];
    const logsBtn = document.getElementById("logs-btn"); // Botón para mostrar la sección de logs

    // Otras secciones que deben ocultarse
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
        if (scoreSection) scoreSection.style.display = "none";

        logsSection.style.display = "none";
    }
    // Evento para mostrar solo la sección de logs
    logsBtn.addEventListener("click", () => {
        hideAllSections();
        logsSection.style.display = "block";
        loadLogs(); // Cargar lista de logs
    });

    // Función para cargar Logs de Usuario
    function loadLogs() {
        fetch("https://nursenotes.somee.com/apiUsersLogs")
            .then((response) => response.json())
            .then((data) => {
                logsTable.innerHTML = ""; // Limpiar tabla
                data.forEach((log) => {
                    const row = logsTable.insertRow();
                    row.innerHTML = `
                        <td>${log.loG_ID}</td>
                        <td>${log.usR_ID}</td>
                        <td>${new Date(log.fchmod).toLocaleString()}</td>
                        <td>${log.usrmod}</td>
                    `;
                });
            })
            .catch((error) => console.error("Error al cargar los logs de usuario:", error));
    }
});
