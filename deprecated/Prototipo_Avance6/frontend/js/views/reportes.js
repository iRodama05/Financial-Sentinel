/* Obtener token y usuario */
const token = localStorage.getItem('token_sentinel');
const usuario = JSON.parse(localStorage.getItem('usuario_sentinel'));

/* Validar sesión */
if(!token){
    window.location.href = './login.html';
}

/* Mostrar usuario */
if(usuario){
    document.getElementById('usuarioTexto').textContent = 'Usuario: ' + usuario.nombre;
}

/* Datos de ejemplo mientras se conecta al backend */
let reportes = [
    {id:'R-001', descripcion:'Reporte mensual de operaciones', periodo:'Abril 2026', fecha:'2026-04-15', formato:'PDF'},
    {id:'R-002', descripcion:'Reporte de alertas internas', periodo:'Abril 2026', fecha:'2026-04-18', formato:'PDF'}
];

/* Variables */
const tablaReportes = document.querySelector('#reportsTable tbody');
const reportesGenerados = document.getElementById('reportesGenerados');
const clientesIncluidos = document.getElementById('clientesIncluidos');
const conAlerta = document.getElementById('conAlerta');

/* Mostrar reportes */
function mostrarReportes(lista){

    tablaReportes.innerHTML = '';

    lista.forEach(reporte => {

        tablaReportes.innerHTML += `
<tr>
<td>${reporte.id}</td>
<td>${reporte.descripcion}</td>
<td>${reporte.periodo}</td>
<td>${reporte.fecha}</td>
<td><span class="badge bg-danger">${reporte.formato}</span></td>
</tr>
`;

    });

    reportesGenerados.textContent = lista.length;
    clientesIncluidos.textContent = '4';
    conAlerta.textContent = '2';

}

/* Filtrar reportes */
function filtrarReportes(){

    const fechaInicio = document.getElementById('fechaInicio').value;
    const fechaFin = document.getElementById('fechaFin').value;

    const filtrados = reportes.filter(reporte => {

        let mostrar = true;

        if(fechaInicio){
            mostrar = mostrar && reporte.fecha >= fechaInicio;
        }

        if(fechaFin){
            mostrar = mostrar && reporte.fecha <= fechaFin;
        }

        return mostrar;

    });

    mostrarReportes(filtrados);

}

/* Evento del botón */
document.getElementById('btnFiltrarReportes').addEventListener('click', filtrarReportes);

/* Cerrar sesión */
document.getElementById('btnSalir').addEventListener('click', function(){

    localStorage.removeItem('token_sentinel');
    localStorage.removeItem('usuario_sentinel');

    window.location.href = './login.html';

});

/* Ejecutar función */
mostrarReportes(reportes);