document.addEventListener("DOMContentLoaded", () => {
    const scoreSection = document.getElementById("score"); // Sección de Puntajes
    const scoreTable = document.getElementById("score-table").getElementsByTagName("tbody")[0];
    const scoreBtn = document.getElementById("score-btn"); // Botón para mostrar la sección de puntajes

    // Otras secciones que deben ocultarse
    const diagnosSection = document.getElementById("diagnosticos");
    const groupsSection = document.getElementById("groups");
    const foliosSection = document.getElementById("folios");
    const headquartersSection = document.getElementById("headquarters");
    const incomesSection = document.getElementById("incomes");
    const medicationsSection = document.getElementById("medications");
    const permissionsGroupsSection = document.getElementById("permissions-groups");
    const permissionsSection = document.getElementById("permissions");
    const specialitiesSection = document.getElementById("specialities");
    const usersSection = document.getElementById("users");
    const logsSection = document.getElementById("logs");

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
        if (specialitiesSection) specialitiesSection.style.display = "none";
        if (usersSection) usersSection.style.display = "none";
        if (logsSection) logsSection.style.display = "none";

        scoreSection.style.display = "none";
    }

    // Evento para mostrar solo la sección de puntajes
    scoreBtn.addEventListener("click", () => {
        hideAllSections();
        scoreSection.style.display = "block";
        loadScores(); // Cargar lista de puntajes
    });

    // Función para cargar Puntajes de Jugadores
    function loadScores() {
        fetch("https://nursenotes.somee.com/apiScores")
            .then((response) => {
                console.log("Response status:", response.status); // Log para estado de respuesta
                return response.json();
            })
            .then((data) => {
                console.log("Data received:", data); // Log para ver los datos
                scoreTable.innerHTML = ""; // Limpiar tabla
                data.forEach((score) => {
                    const row = scoreTable.insertRow();
                    row.innerHTML = `
                        <td>${score.scorE_ID}</td>
                        <td>${score.playername}</td>
                        <td>${score.age}</td>
                        <td>${score.gender}</td>
                        <td>${score.score}</td>
                    `;
                });
            })
            .catch((error) => console.error("Error al cargar los puntajes:", error));
    }
});
