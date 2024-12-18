document.addEventListener("DOMContentLoaded", () => {
    // Elementos y botones del DOM
    const tipdocCreateForm = document.getElementById("tipdoc-create-form");
    const searchTipDocBtn = document.getElementById("search-tipdoc-btn");
    const updateTipDocBtn = document.getElementById("update-tipdoc-btn");

    const tipdocsTable = document.getElementById("tipdocs-table").getElementsByTagName("tbody")[0];
    const tipdocSearchOutput = document.getElementById("tipdoc-search-output");
    const updateTipDocIDSelect = document.getElementById("update-tipdoc-id");
    const tipdocsSection = document.getElementById("tipdocs"); // Sección de Tipo Documentos
    const tipdocsBtn = document.getElementById("tipdoc-btn"); // Botón de Tipo Documentos

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
  tipdocsBtn.addEventListener("click", () => {
    hideAllSections();
    tipdocsSection.style.display = "block";
    loadTipDocs();
  });

    // Función para cargar Tipo Documentos
    function loadTipDocs() {
        fetch("https://nursenotes.somee.com/apiTipDocs")
            .then((response) => response.json())
            .then((data) => {
                tipdocsTable.innerHTML = ""; // Limpiar tabla
                updateTipDocIDSelect.innerHTML = ""; // Limpiar select para actualización
                data.forEach((tipdoc) => {
                    const row = tipdocsTable.insertRow();
                    row.innerHTML = `
                        <td>${tipdoc.tipdoC_ID}</td>
                        <td>${tipdoc.tipdocdsc}</td>
                        <td>
                            <button onclick="confirmRemoveTipDocRow(this)">Eliminar</button>
                        </td>
                    `;

                    // Agregar opción al select de actualización
                    const option = document.createElement("option");
                    option.value = tipdoc.tipdoC_ID;
                    option.textContent = `${tipdoc.tipdoC_ID} - ${tipdoc.tipdocdsc}`;
                    updateTipDocIDSelect.appendChild(option);
                });
            });
    }

    // Función para confirmar y eliminar una fila visualmente
    window.confirmRemoveTipDocRow = function (button) {
        if (confirm("¿Estás seguro de que deseas eliminar este tipo de documento?")) {
            const row = button.closest("tr");
            row.remove();
        }
    };

    // Crear Tipo Documento
    tipdocCreateForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const tipdocData = {
            tipdocdsc: document.getElementById("tipdoc-desc").value,
        };

        fetch("https://nursenotes.somee.com/apiTipDocs", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(tipdocData),
            })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Error al crear el tipo de documento");
                }
                return response.json();
            })
            .then(() => {
                loadTipDocs();
                tipdocCreateForm.reset();
            })
            .catch((error) =>
                console.error("Error en la creación del tipo de documento:", error)
            );
    });

    // Buscar Tipo Documento por ID
    searchTipDocBtn.addEventListener("click", () => {
        const tipdoC_ID = document.getElementById("search-tipdoc-id").value;

        fetch(`https://nursenotes.somee.com/apiTipDocs/${tipdoC_ID}`)
            .then((response) => response.json())
            .then((data) => {
                tipdocSearchOutput.innerHTML = data ?
                    `<p>ID: ${data.tipdoC_ID}, Descripción: ${data.tipdocdsc}</p>` :
                    `<p>No se encontró el tipo de documento con ID: ${tipdoC_ID}</p>`;
            })
            .catch((error) => console.error("Error al buscar tipo de documento:", error));
    });

    // Actualizar Tipo Documento
    updateTipDocBtn.addEventListener("click", () => {
        const tipdoC_ID = updateTipDocIDSelect.value;
        const tipdocData = {
            tipdoC_ID: parseInt(tipdoC_ID),
            tipdocdsc: document.getElementById("update-tipdoc-desc").value,
        };

        fetch(`https://nursenotes.somee.com/apiTipDocs/${tipdoC_ID}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(tipdocData),
            })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Error al actualizar el tipo de documento");
                }
                return response.json();
            })
            .then(() => {
                loadTipDocs();
                updateTipDocIDSelect.selectedIndex = 0;
                document.getElementById("update-tipdoc-desc").value = "";
            })
            .catch((error) =>
                console.error("Error en la actualización del tipo de documento:", error)
            );
    });
});
