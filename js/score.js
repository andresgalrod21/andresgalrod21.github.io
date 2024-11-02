document.addEventListener("DOMContentLoaded", () => {
    const scoreSection = document.getElementById("score"); // Sección de Puntajes
    const scoreTable = document.getElementById("score-table").getElementsByTagName("tbody")[0];
    const scoreBtn = document.getElementById("score-btn"); // Botón para mostrar la sección de puntajes

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
  scoreBtn.addEventListener("click", () => {
    hideAllSections();
    scoreSection.style.display = "block";
    loadScores();
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
