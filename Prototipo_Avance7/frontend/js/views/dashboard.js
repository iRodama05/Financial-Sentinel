import { peticionProtegida } from '../api/apiClient.js';

document.addEventListener('DOMContentLoaded', async () => {
    
    // 1. CONTROL DE ACCESO (Muro de seguridad)
    const token = localStorage.getItem('token_sentinel');
    if (!token) {
        window.location.href = 'login.html'; // Lo pateamos al login si no tiene gafete
        return;
    }

    // Mostrar el nombre del usuario logueado
    const nombreUsuario = localStorage.getItem('usuario_nombre') || 'Usuario Autorizado';
    document.getElementById('nombre-usuario').textContent = nombreUsuario;

    // Configurar el botón de cerrar sesión
    document.getElementById('btn-logout').addEventListener('click', () => {
        localStorage.removeItem('token_sentinel');
        localStorage.removeItem('usuario_nombre');
        window.location.href = 'login.html';
    });

    try {
        // 2. OBTENER DATOS DE LA API (Hacemos las 3 peticiones en paralelo para mayor velocidad)
        const [resumen, clientes, alertas] = await Promise.all([
            peticionProtegida('/dashboard'),
            peticionProtegida('/clientes'),
            peticionProtegida('/alertas')
        ]);

        // 3. PINTAR TARJETAS DE RESUMEN
        document.getElementById('total-clientes').textContent = resumen.total_clientes || 0;
        document.getElementById('total-alertas').textContent = resumen.alertas_pendientes || 0;

        // 4. PINTAR TABLA DE CLIENTES (Solo mostramos los 5 más recientes en el dashboard)
        const cuerpoClientes = document.getElementById('tabla-clientes-body');
        cuerpoClientes.innerHTML = ''; 
        
        const topClientes = clientes.slice(0, 5); // Cortamos el array
        
        if (topClientes.length === 0) {
            cuerpoClientes.innerHTML = '<tr><td colspan="4" style="text-align:center;">No hay clientes</td></tr>';
        } else {
            topClientes.forEach(c => {
                cuerpoClientes.innerHTML += `
                    <tr>
                        <td>C-00${c.id}</td>
                        <td>${c.nombre_completo}</td>
                        <td>${c.rfc}</td>
                        <td>${c.correo}</td>
                    </tr>
                `;
            });
        }

        // 5. PINTAR TABLA DE ALERTAS (Solo mostramos las 5 más recientes)
        const cuerpoAlertas = document.getElementById('tabla-alertas-body');
        cuerpoAlertas.innerHTML = '';

        const topAlertas = alertas.slice(0, 5);

        if (topAlertas.length === 0) {
            cuerpoAlertas.innerHTML = '<tr><td colspan="4" style="text-align:center;">No hay alertas pendientes</td></tr>';
        } else {
            topAlertas.forEach(a => {
                cuerpoAlertas.innerHTML += `
                    <tr>
                        <td>A-00${a.id}</td>
                        <td><strong>${a.nombre_cliente}</strong></td>
                        <td>${a.nombre_regla || 'Regla General'}</td>
                        <td><span style="color: ${a.estatus === 'Nueva' ? 'red' : 'orange'}">${a.estatus}</span></td>
                    </tr>
                `;
            });
        }

    } catch (error) {
        console.error("Fallo al cargar el dashboard:", error);
        alert("Tu sesión caducó o hubo un error al conectar con el servidor.");
        // Si el token es inválido, forzamos salida
        localStorage.removeItem('token_sentinel');
        window.location.href = 'login.html';
    }
});