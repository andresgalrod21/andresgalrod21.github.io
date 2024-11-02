document.addEventListener('DOMContentLoaded', function() {
    const backButton1 = document.getElementById('back-button-1');
    const backButton2 = document.getElementById('back-button-2');
    const backButton3 = document.getElementById('back-button-3');
    const actionButtons = document.getElementById('action-buttons');
    
    // Lista de todas las secciones a ocultar
    const sections = [
        "diagnosticos", "groups", "folios", "headquarters", "incomes", "medications",
        "permissions-groups", "permissions", "staff", "tipdocs", "logs", "score", "users", 
        "patients", "supplies-patients", "signs", "nurse-note-section", "patient-records", "mantadmin", "notasenf"
    ];

    // Función para ocultar todas las secciones
    function hideAllSections() {
        sections.forEach(id => {
            const section = document.getElementById(id);
            if (section) section.style.display = 'none';
        });
    }

    // Mostrar la sección de botones de acción después de ocultar todas las secciones
    function showActionButtons() {
        hideAllSections();
        actionButtons.style.display = 'block';
        backButton2.style.display = 'none';
        backButton3.style.display = 'none';
        backButton1.style.display = 'block';
    }

    // Evento para refrescar la página en el botón 1
    if (backButton1) {
        backButton1.addEventListener('click', function() {
            location.reload(); // Refresca la página
        });
    }

    // Agregar evento al botón 2
    if (backButton2) {
        backButton2.addEventListener('click', function() {
            showActionButtons();
        });
    }

    // Agregar evento al botón 3
    if (backButton3) {
        backButton3.addEventListener('click', function() {
            showActionButtons();
        });
    }
});
