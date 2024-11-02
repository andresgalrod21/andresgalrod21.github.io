document.addEventListener("DOMContentLoaded", () => {
    const logsSection = document.getElementById("logs"); // Sección de Logs
    const logsTable = document.getElementById("logs-table").getElementsByTagName("tbody")[0];
    const logsBtn = document.getElementById("logs-btn"); // Botón para mostrar la sección de logs

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
  logsBtn.addEventListener("click", () => {
    hideAllSections();
    logsSection.style.display = "block";
    loadLogs();
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
