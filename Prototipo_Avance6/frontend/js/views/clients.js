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

/* Variables */
const tablaClientes = document.querySelector('#clientsTable tbody');
const totalClientes = document.getElementById('totalClientes');
const clientesActivos = document.getElementById('clientesActivos');
const clientesRevision = document.getElementById('clientesRevision');

const searchInput = document.getElementById('clientSearch');
const statusFilter = document.getElementById('statusFilter');

/* Guardar clientes */
let clientesData = [];

/* Cargar clientes */
async function cargarClientes(){

    const respuesta = await fetch('http://localhost:3000/api/clientes', {

        method: 'GET',

        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        }

    });

    const data = await respuesta.json();

    if(respuesta.ok){

        clientesData = data;

        mostrarClientes(clientesData);

    }else{

        window.location.href = './login.html';

    }

}

/* Mostrar clientes en tabla */
function mostrarClientes(clientes){

    tablaClientes.innerHTML = '';

    let activos = 0;
    let revision = 0;

    totalClientes.textContent = clientes.length;

    clientes.forEach(cliente => {

        let estado = 'Activo';

        if(cliente.es_pep){
            estado = 'Revisión';
            revision++;
        }else{
            activos++;
        }

        tablaClientes.innerHTML += `
<tr>
<td>${cliente.id}</td>
<td>${cliente.nombre_completo}</td>
<td>${cliente.rfc}</td>
<td>${cliente.correo}</td>
<td>${estado}</td>
</tr>
`;

    });

    clientesActivos.textContent = activos;
    clientesRevision.textContent = revision;

}

/* Filtrar clientes */
function filtrarClientes(){

    const texto = searchInput.value.toLowerCase();
    const estado = statusFilter.value;

    const clientesFiltrados = clientesData.filter(cliente => {

        let nombre = cliente.nombre_completo.toLowerCase();

        let estadoCliente = 'Activo';

        if(cliente.es_pep){
            estadoCliente = 'Revisión';
        }

        let coincideBusqueda = nombre.includes(texto);

        let coincideEstado = estado == 'Todos' || estado == estadoCliente;

        return coincideBusqueda && coincideEstado;

    });

    mostrarClientes(clientesFiltrados);

}

/* Eventos */
searchInput.addEventListener('input', filtrarClientes);

statusFilter.addEventListener('change', filtrarClientes);

/* Cerrar sesión */
document.getElementById('btnSalir').addEventListener('click', function(){

    localStorage.removeItem('token_sentinel');
    localStorage.removeItem('usuario_sentinel');

    window.location.href = './login.html';

});

/* Ejecutar función */
cargarClientes();