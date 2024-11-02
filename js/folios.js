
document.addEventListener("DOMContentLoaded", function() {
    const folioCreateForm = document.getElementById("folio-create-form");
    const searchFolioBtn = document.getElementById("search-folio-btn");
    const updateFolioBtn = document.getElementById("update-folio-btn");

    const foliosTable = document.getElementById("folios-table").getElementsByTagName("tbody")[0];
    const folioSearchOutput = document.getElementById("folio-search-output");
    const updateFolioIDSelect = document.getElementById("update-folio-id");
    const foliosSection = document.getElementById("folios");
    const foliosBtn = document.getElementById("folios-btn");

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
      foliosBtn.addEventListener("click", () => {
        hideAllSections();
        foliosSection.style.display = "block";
        loadFolios();
      });

    // Función para cargar Folios
    function loadFolios() {
        fetch("https://nursenotes.somee.com/apiFolios")
            .then(response => response.json())
            .then(data => {
                foliosTable.innerHTML = "";
                updateFolioIDSelect.innerHTML = '<option value="">Seleccione un folio</option>';
                data.forEach(folio => {
                    const row = foliosTable.insertRow();
                    row.innerHTML = `
                        <td>${folio.foliO_ID}</td>
                        <td>${folio.incomE_ID}</td>
                        <td>${folio.notE_ID}</td>
                        <td>${folio.suP_ID}</td>
                        <td>${folio.usR_ID}</td>
                        <td>${folio.evolution}</td>
                        <td><button onclick="confirmRemoveFolioRow(this)">Eliminar</button></td>
                    `;

                    const option = document.createElement("option");
                    option.value = folio.foliO_ID;
                    option.textContent = `ID: ${folio.foliO_ID} - Evolución: ${folio.evolution.substring(0, 10)}...`;
                    updateFolioIDSelect.appendChild(option);
                });
            });
    }

    // Función para confirmar y eliminar una fila visualmente
    window.confirmRemoveFolioRow = function(button) {
        if (confirm("¿Estás seguro de que deseas eliminar este folio?")) {
            const row = button.closest("tr");
            row.remove();
        }
    };

    // Crear Folio
    folioCreateForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const incomE_ID = parseInt(document.getElementById("folio-income-id").value);
        const notE_ID = parseInt(document.getElementById("folio-note-id").value);
        const suP_ID = parseInt(document.getElementById("folio-sup-id").value);
        const usR_ID = parseInt(document.getElementById("folio-user-id").value);
        const evolution = document.getElementById("folio-evolution").value;

        const folioData = {
            foliO_ID: 0,
            incomE_ID: incomE_ID,
            notE_ID: notE_ID,
            suP_ID: suP_ID,
            usR_ID: usR_ID,
            evolution: evolution,
            incomes: {
                incomE_ID: incomE_ID,
                tipdoC_ID: 0,
                patienT_ID: 0,
                fchincome: "",
                usR_ID: 0
            },
            nurseNote: {
                notE_ID: notE_ID,
                incomE_ID: incomE_ID,
                patienT_ID: 0,
                reasoncons: ""
            },
            suppliesPatients: {
                suP_ID: suP_ID,
                cantsup: 0,
                incomE_ID: incomE_ID,
                meD_ID: 0
            },
            users: {
                usR_ID: usR_ID,
                name: "",
                lastname: ""
            }
        };

        fetch("https://nursenotes.somee.com/apiFolios", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(folioData),
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(errorData => {
                        console.error("Error en la respuesta del servidor:", errorData);
                        throw new Error("Error al crear el folio");
                    });
                }
                return response.json();
            })
            .then(data => {
                console.log("Folio creado con éxito:", data);
                loadFolios();
                folioCreateForm.reset();
            })
            .catch(error => console.error("Error en la creación del folio:", error));
    });

    // Llenar campos de actualización automáticamente al seleccionar un folio
    updateFolioIDSelect.addEventListener("change", () => {
        const selectedFolioId = updateFolioIDSelect.value;
        if (!selectedFolioId) return;

        fetch(`https://nursenotes.somee.com/apiFolios/${selectedFolioId}`)
            .then(response => response.json())
            .then(folio => {
                document.getElementById("update-folio-income-id").value = folio.incomE_ID;
                document.getElementById("update-folio-note-id").value = folio.notE_ID;
                document.getElementById("update-folio-sup-id").value = folio.suP_ID;
                document.getElementById("update-folio-user-id").value = folio.usR_ID;
                document.getElementById("update-folio-evolution").value = folio.evolution;
            })
            .catch(error => console.error("Error al cargar los datos del folio:", error));
    });

    // Actualizar Folio
    updateFolioBtn.addEventListener("click", (e) => {
        e.preventDefault();

        const foliO_ID = parseInt(updateFolioIDSelect.value);
        const incomE_ID = parseInt(document.getElementById("update-folio-income-id").value);
        const notE_ID = parseInt(document.getElementById("update-folio-note-id").value);
        const suP_ID = parseInt(document.getElementById("update-folio-sup-id").value);
        const usR_ID = parseInt(document.getElementById("update-folio-user-id").value);
        const evolution = document.getElementById("update-folio-evolution").value;

        const folioData = {
            foliO_ID: foliO_ID,
            incomE_ID: incomE_ID,
            notE_ID: notE_ID,
            suP_ID: suP_ID,
            usR_ID: usR_ID,
            evolution: evolution,
            incomes: {
                incomE_ID: incomE_ID,
                tipdoC_ID: 0,
                patienT_ID: 0,
                fchincome: "",
                usR_ID: 0
            },
            nurseNote: {
                notE_ID: notE_ID,
                incomE_ID: incomE_ID,
                patienT_ID: 0,
                reasoncons: ""
            },
            suppliesPatients: {
                suP_ID: suP_ID,
                cantsup: 0,
                incomE_ID: incomE_ID,
                meD_ID: 0
            },
            users: {
                usR_ID: usR_ID,
                name: "",
                lastname: ""
            }
        };

        fetch(`https://nursenotes.somee.com/apiFolios/${foliO_ID}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(folioData),
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(errorData => {
                        console.error("Error en la respuesta del servidor:", errorData);
                        throw new Error("Error al actualizar el folio");
                    });
                }
                return response.json();
            })
            .then(() => {
                loadFolios();
                updateFolioIDSelect.selectedIndex = 0;
                document.getElementById("update-folio-income-id").value = "";
                document.getElementById("update-folio-note-id").value = "";
                document.getElementById("update-folio-sup-id").value = "";
                document.getElementById("update-folio-user-id").value = "";
                document.getElementById("update-folio-evolution").value = "";
            })
            .catch(error => console.error("Error en la actualización del folio:", error));
    });
});
