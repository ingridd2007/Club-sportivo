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