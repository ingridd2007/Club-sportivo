// =========================
// SOCIOS DE PRUEBA
// =========================

const socios = [
    {
        id: 1,
        nombre: "Tamara",
        apellido: "Moyano",
        dni: "12345678",
        cuotaAlDia: true
    },

    {
        id: 2,
        nombre: "Claudio",
        apellido: "Lezcano",
        dni: "87654321",
        cuotaAlDia: false
    },

    {
        id: 3,
        nombre: "Ingrid",
        apellido: "Torres",
        dni: "48129563",
        cuotaAlDia: true
    }
];


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

    const estado = socioEncontrado.cuotaAlDia
        ? "Cuota al día"
        : "Cuota pendiente";

    const icono = socioEncontrado.cuotaAlDia
        ? "🟢"
        : "🔴";

    const ingreso = socioEncontrado.cuotaAlDia
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


            <span class="estado-socio estado-activo">
                Activo
            </span>

        `;

        listaSocios.appendChild(tarjeta);

    });

}

// Mostrar todos los socios al entrar
mostrarSocios(socios);

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