/* Obtener token y usuario guardado */
const token = localStorage.getItem('token_sentinel');
const usuario = JSON.parse(localStorage.getItem('usuario_sentinel'));

/* Validar si hay sesión */
if(!token){
    window.location.href = './login.html';
}

/* Mostrar usuario */
if(usuario){
    document.getElementById('usuarioTexto').textContent = 'Usuario: ' + usuario.nombre;
}

/* Cargar datos del dashboard */
async function cargarDashboard(){

    const respuesta = await fetch('http://localhost:3000/api/dashboard', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        }
    });

    const data = await respuesta.json();

    if(respuesta.ok){
        document.getElementById('totalClientes').textContent = data.total_clientes;
        document.getElementById('alertasPendientes').textContent = data.alertas_pendientes;
        document.getElementById('volumenTotal').textContent = '$' + data.volumen_total_transaccionado;
        document.getElementById('casosInvestigacion').textContent = data.casos_en_investigacion;
    }else{
        window.location.href = './login.html';
    }
}

/* Cerrar sesión */
document.getElementById('btnSalir').addEventListener('click', function(){
    localStorage.removeItem('token_sentinel');
    localStorage.removeItem('usuario_sentinel');
    window.location.href = './login.html';
});

/* Ejecutar función */
cargarDashboard();