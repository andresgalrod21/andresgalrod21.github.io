
document.addEventListener("DOMContentLoaded", function() {
    const signCreateForm = document.getElementById("signs-create-form");
    const searchSignBtn = document.getElementById("search-sign-btn");
    const updateSignBtn = document.getElementById("update-sign-btn");

    const signsTable = document.getElementById("signs-table").getElementsByTagName("tbody")[0];
    const signSearchOutput = document.getElementById("sign-search-output");
    const updateSignIDSelect = document.getElementById("update-sign-id");
    const signsSection = document.getElementById("signs");
    const signsBtn = document.getElementById("signos-btn");

    // Función para ocultar todas las secciones
    function hideAllSections() {
        const sections = [
            "diagnosticos", "groups", "folios", "headquarters", "incomes", "medications",
            "permissions-groups", "permissions", "staff", "tipdocs", "logs", "score", "users", "patients", "patient-records",
            "signs", "supplies-patients"
        ];
        sections.forEach(id => {
            const section = document.getElementById(id);
            if (section) section.style.display = "none";
        });
    }

    // Evento para mostrar solo la sección de signos
    signsBtn.addEventListener("click", () => {
        hideAllSections();
        signsSection.style.display = "block";
        loadSigns();
    });

    // Función para cargar Signos
    function loadSigns() {
        fetch("https://nursenotes.somee.com/apiSigns")
            .then(response => response.json())
            .then(data => {
                signsTable.innerHTML = "";
                updateSignIDSelect.innerHTML = '<option value="">Seleccione un signo</option>';
                data.forEach(sign => {
                    const row = signsTable.insertRow();
                    row.innerHTML = `
                        <td>${sign.sigN_ID}</td>
                        <td>${sign.notE_ID}</td>
                        <td>${sign.temperature}</td>
                        <td>${sign.pulse}</td>
                        <td><button onclick="confirmRemoveSignRow(this)">Eliminar</button></td>
                    `;

                    const option = document.createElement("option");
                    option.value = sign.sigN_ID;
                    option.textContent = `${sign.sigN_ID} - Nota ID: ${sign.notE_ID}`;
                    updateSignIDSelect.appendChild(option);
                });
            });
    }

    // Función para confirmar y eliminar una fila visualmente
    window.confirmRemoveSignRow = function(button) {
        if (confirm("¿Estás seguro de que deseas eliminar este signo?")) {
            const row = button.closest("tr");
            row.remove();
        }
    };

    // Crear Signo
    signCreateForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const notE_ID = parseInt(document.getElementById("sign-note-id").value);
        const temperature = parseFloat(document.getElementById("sign-temperature").value);
        const pulse = document.getElementById("sign-pulse").value;

        const signData = {
            sigN_ID: 0,
            notE_ID: notE_ID,
            temperature: temperature,
            pulse: pulse,
            nurseNote: {
                notE_ID: notE_ID,
                incomE_ID: 0,
                patienT_ID: 0,
                reasoncons: "",
                diaG_ID: 0,
                speC_ID: 0,
                usR_ID: 0,
                stafF_ID: 0
            }
        };

        fetch("https://nursenotes.somee.com/apiSigns", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(signData),
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(errorData => {
                        console.error("Error en la respuesta del servidor:", errorData);
                        throw new Error("Error al crear el signo");
                    });
                }
                return response.json();
            })
            .then(data => {
                console.log("Signo creado con éxito:", data);
                loadSigns();
                signCreateForm.reset();
            })
            .catch(error => console.error("Error en la creación del signo:", error));
    });

    // Llenar campos de actualización automáticamente al seleccionar un signo
    updateSignIDSelect.addEventListener("change", () => {
        const selectedSignId = updateSignIDSelect.value;
        if (!selectedSignId) return; // Si no hay selección, salir

        fetch(`https://nursenotes.somee.com/apiSigns/${selectedSignId}`)
            .then(response => response.json())
            .then(sign => {
                document.getElementById("update-sign-note-id").value = sign.notE_ID;
                document.getElementById("update-sign-temperature").value = sign.temperature;
                document.getElementById("update-sign-pulse").value = sign.pulse;
            })
            .catch(error => console.error("Error al cargar los datos del signo:", error));
    });

    // Actualizar Signo
    updateSignBtn.addEventListener("click", (e) => {
        e.preventDefault();

        const sigN_ID = parseInt(updateSignIDSelect.value);
        const notE_ID = parseInt(document.getElementById("update-sign-note-id").value);
        const temperature = parseFloat(document.getElementById("update-sign-temperature").value);
        const pulse = document.getElementById("update-sign-pulse").value;

        const signData = {
            sigN_ID: sigN_ID,
            notE_ID: notE_ID,
            temperature: temperature,
            pulse: pulse,
            nurseNote: {
                notE_ID: notE_ID,
                incomE_ID: 0,
                patienT_ID: 0,
                reasoncons: "",
                diaG_ID: 0,
                speC_ID: 0,
                usR_ID: 0,
                stafF_ID: 0
            }
        };

        fetch(`https://nursenotes.somee.com/apiSigns/${sigN_ID}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(signData),
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(errorData => {
                        console.error("Error en la respuesta del servidor:", errorData);
                        throw new Error("Error al actualizar el signo");
                    });
                }
                return response.json();
            })
            .then(() => {
                loadSigns();
                updateSignIDSelect.selectedIndex = 0;
                document.getElementById("update-sign-note-id").value = "";
                document.getElementById("update-sign-temperature").value = "";
                document.getElementById("update-sign-pulse").value = "";
            })
            .catch(error => console.error("Error en la actualización del signo:", error));
    });
});
