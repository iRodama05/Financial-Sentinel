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
const tablaAlertas = document.querySelector('#alertsTable tbody');

/* Cargar alertas */
async function cargarAlertas(){

    const respuesta = await fetch('http://localhost:3000/api/alertas',{
        method:'GET',
        headers:{
            'Authorization':'Bearer ' + token,
            'Content-Type':'application/json'
        }
    });

    const data = await respuesta.json();

    if(respuesta.ok){
        mostrarAlertas(data);
    }else{
        window.location.href = './login.html';
    }

}

/* Mostrar alertas */
function mostrarAlertas(alertas){

    tablaAlertas.innerHTML = '';

    alertas.forEach(alerta => {

        tablaAlertas.innerHTML += `
<tr>
<td>${alerta.id}</td>
<td>${alerta.nombre_cliente}</td>
<td>${alerta.nombre_regla}</td>
<td>${alerta.rfc}</td>
<td>${alerta.fecha_generacion}</td>
<td>${alerta.estatus}</td>
</tr>
`;

    });

}

/* Cerrar sesión */
document.getElementById('btnSalir').addEventListener('click', function(){

    localStorage.removeItem('token_sentinel');
    localStorage.removeItem('usuario_sentinel');

    window.location.href = './login.html';

});

/* Ejecutar función */
cargarAlertas();