let socios = [];

// =========================
// OBTENER SOCIOS DESDE EL BACKEND
// =========================

async function obtenerSocios() {

    try {

        const respuesta = await fetch("http://localhost:3000/api/socios");

        socios = await respuesta.json();

        mostrarSocios(socios);

    } catch (error) {

        console.error("Error al obtener los socios:", error);

    }
}

// =========================
// ELEMENTOS DEL HTML
// =========================

const formulario = document.getElementById("searchForm");
const buscador = document.getElementById("searchInput");
const resultado = document.getElementById("resultado");


// =========================
// BUSCAR SOCIO
// =========================

formulario.addEventListener("submit", function (evento) {

    // Evita que la página se recargue
    evento.preventDefault();

    const busqueda = buscador.value.trim().toLowerCase();

    // Si no escribió nada
    if (busqueda === "") {
        resultado.innerHTML = `
            <h3>Resultado</h3>

            <div class="empty-result">
                <span>⚠️</span>
                <p>Ingresá un DNI o nombre para buscar.</p>
            </div>
        `;

        return;
    }

    // Buscar por DNI, nombre o apellido
    const socioEncontrado = socios.find(function (socio) {

        const nombreCompleto =
            `${socio.nombre} ${socio.apellido}`.toLowerCase();

        return (
            socio.dni.includes(busqueda) ||
            nombreCompleto.includes(busqueda) ||
            socio.nombre.toLowerCase().includes(busqueda) ||
            socio.apellido.toLowerCase().includes(busqueda)
        );
    });


    // =========================
    // MOSTRAR RESULTADO
    // =========================

    if (socioEncontrado) {

    const estado = socioEncontrado.estado || "Sin estado";

    const estaActivo = socioEncontrado.estado === "Activo";

    const icono = estaActivo
        ? "🟢"
        : "🔴";

    const ingreso = estaActivo
        ? "✓ Ingreso habilitado"
        : "✕ Ingreso no habilitado";


    resultado.innerHTML = `
        <h3>Resultado</h3>

        <div class="socio-result">

            <div>
                <h4>
                    ${socioEncontrado.nombre}
                    ${socioEncontrado.apellido}
                </h4>

                <p>
                    DNI: ${socioEncontrado.dni}
                </p>
            </div>

            <div class="estado">

                <span>${icono}</span>

                <strong>
                    ${estado}
                </strong>

                <small>
                    ${ingreso}
                </small>

            </div>

        </div>
    `;
    } else {

        resultado.innerHTML = `
            <h3>Resultado</h3>

            <div class="empty-result">
                <span>❌</span>
                <p>No encontramos ningún socio.</p>
            </div>
        `;
    }
});

// =========================
// LISTADO DE SOCIOS
// =========================

const listaSocios = document.getElementById("listaSocios");


function mostrarSocios(lista) {

    listaSocios.innerHTML = "";

    if (lista.length === 0) {

        listaSocios.innerHTML = `
            <div class="empty-result">

                <span>🔎</span>

                <p>
                    No encontramos socios.
                </p>

            </div>
        `;

        return;
    }


    lista.forEach(function (socio) {

        const estadoClase =
            socio.estado === "Activo"
                ? "estado-activo"
                : "estado-inactivo";

        const textoEstado =
            socio.estado || "Sin estado";

        const tarjeta = document.createElement("div");

        tarjeta.classList.add("socio-card");

        tarjeta.innerHTML = `

            <div class="socio-info">

                <h4>
                    ${socio.nombre}
                    ${socio.apellido}
                </h4>

                <p>
                    DNI: ${socio.dni}
                </p>

            </div>


            <span class="estado-socio ${estadoClase}">
                ${textoEstado}
            </span>

            <button
                type="button"
                class="btn-estado"
                data-id="${socio.id}"
                data-estado="${socio.estado}"
            >
                ${socio.estado === "Activo"
                    ? "Pasar a inactivo"
                    : "Activar socio"}
            </button>

        `;

        listaSocios.appendChild(tarjeta);

    });

}

// =========================
// CAMBIAR ESTADO DEL SOCIO
// =========================

listaSocios.addEventListener("click", async function (evento) {

    if (!evento.target.classList.contains("btn-estado")) {
        return;
    }

    const boton = evento.target;
    const id = boton.dataset.id;
    const estadoActual = boton.dataset.estado;

    const nuevoEstado =
        estadoActual === "Activo"
            ? "Inactivo"
            : "Activo";

    const confirmacion = confirm(
        nuevoEstado === "Inactivo"
            ? "¿Querés pasar este socio a Inactivo?"
            : "¿Querés volver a activar este socio?"
    );

    if (!confirmacion) {
        return;
    }

    try {

        const respuesta = await fetch(
            `http://localhost:3000/api/socios/${id}/estado`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    estado: nuevoEstado
                })
            }
        );

        const socioActualizado = await respuesta.json();

        if (!respuesta.ok) {
            alert(socioActualizado.mensaje || "No se pudo actualizar el estado");
            return;
        }

        const indice = socios.findIndex(
            socio => socio.id === socioActualizado.id
        );

        if (indice !== -1) {
            socios[indice] = socioActualizado;
        }

        mostrarSocios(socios);

    } catch (error) {

        console.error("Error al cambiar el estado:", error);

        alert("No se pudo conectar con el servidor");

    }

});

// Obtener socios desde el backend al entrar
obtenerSocios();

// =========================
// NAVEGACIÓN
// =========================

const navBuscar = document.getElementById("navBuscar");
const navSocios = document.getElementById("navSocios");
const navCuotas = document.getElementById("navCuotas");

const seccionBusqueda = document.getElementById("seccionBusqueda");
const seccionSocios = document.getElementById("seccionSocios");


// Mostrar búsqueda
navBuscar.addEventListener("click", function (evento) {

    evento.preventDefault();

    seccionBusqueda.classList.remove("hidden");
    seccionSocios.classList.add("hidden");

    navBuscar.classList.add("active");
    navSocios.classList.remove("active");
    navCuotas.classList.remove("active");

});


// Mostrar socios
navSocios.addEventListener("click", function (evento) {

    evento.preventDefault();

    seccionBusqueda.classList.add("hidden");
    seccionSocios.classList.remove("hidden");

    navBuscar.classList.remove("active");
    navSocios.classList.add("active");
    navCuotas.classList.remove("active");

});

// =========================
// NUEVO SOCIO
// =========================

const btnNuevoSocio = document.getElementById("btnNuevoSocio");
const formularioNuevoSocio = document.getElementById("formularioNuevoSocio");
const btnCancelarSocio = document.getElementById("btnCancelarSocio");

btnNuevoSocio.addEventListener("click", function () {

    formularioNuevoSocio.classList.remove("hidden");

});

btnCancelarSocio.addEventListener("click", function () {

    formularioNuevoSocio.classList.add("hidden");

});

// =========================
// GUARDAR NUEVO SOCIO
// =========================

const nuevoSocioForm = document.getElementById("nuevoSocioForm");

nuevoSocioForm.addEventListener("submit", async function (evento) {

    evento.preventDefault();

    const nuevoSocio = {
        nombre: document.getElementById("nombreSocio").value.trim(),
        apellido: document.getElementById("apellidoSocio").value.trim(),
        dni: document.getElementById("dniSocio").value.trim(),
        telefono: document.getElementById("telefonoSocio").value.trim(),
        email: document.getElementById("emailSocio").value.trim(),
        estado: document.getElementById("estadoSocio").value
    };

    try {

        const respuesta = await fetch("http://localhost:3000/api/socios", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(nuevoSocio)
        });

        const datos = await respuesta.json();

        if (!respuesta.ok) {

            alert(datos.mensaje || "No se pudo registrar el socio");

            return;
        }

        socios.push(datos);

        mostrarSocios(socios);

        nuevoSocioForm.reset();

        formularioNuevoSocio.classList.add("hidden");

        alert("Socio registrado correctamente");

    } catch (error) {

        console.error("Error al crear el socio:", error);

        alert("No se pudo conectar con el servidor");

    }

});

