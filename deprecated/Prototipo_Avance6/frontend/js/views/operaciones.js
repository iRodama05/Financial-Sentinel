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
const tablaOperaciones = document.querySelector('#operationsTable tbody');
const totalOperaciones = document.getElementById('totalOperaciones');
const montoTotal = document.getElementById('montoTotal');
const clientesRegistrados = document.getElementById('clientesRegistrados');

/* Cargar operaciones */
async function cargarOperaciones(){

    const respuesta = await fetch('http://localhost:3000/api/operaciones/recientes',{
        method:'GET',
        headers:{
            'Authorization':'Bearer ' + token,
            'Content-Type':'application/json'
        }
    });

    const data = await respuesta.json();

    if(respuesta.ok){
        mostrarOperaciones(data);
    }else{
        window.location.href = './login.html';
    }

}

/* Mostrar operaciones */
function mostrarOperaciones(operaciones){

    tablaOperaciones.innerHTML = '';

    let total = 0;
    let monto = 0;
    let clientes = [];

    operaciones.forEach(operacion => {

        total++;
        monto += Number(operacion.monto);

        if(!clientes.includes(operacion.cliente_id)){
            clientes.push(operacion.cliente_id);
        }

        tablaOperaciones.innerHTML += `
<tr>
<td>${operacion.id}</td>
<td>${operacion.nombre_completo}</td>
<td>${operacion.tipo_movimiento}</td>
<td>$${operacion.monto}</td>
<td>${operacion.fecha_operacion}</td>
</tr>
`;

    });

    totalOperaciones.textContent = total;
    montoTotal.textContent = '$' + monto;
    clientesRegistrados.textContent = clientes.length;

}

/* Cerrar sesión */
document.getElementById('btnSalir').addEventListener('click', function(){

    localStorage.removeItem('token_sentinel');
    localStorage.removeItem('usuario_sentinel');

    window.location.href = './login.html';

});

/* Ejecutar función */
cargarOperaciones();