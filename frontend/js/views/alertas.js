import { peticionProtegida } from '../api/apiClient.js';

let alertasTotales = [];
let alertaActualSeleccionada = null;

document.addEventListener('DOMContentLoaded', async () => {
    
    // Verificación de sesión
    const token = localStorage.getItem('token_sentinel');
    if (!token) return window.location.href = 'login.html';
    
    document.getElementById('nombre-usuario').textContent = localStorage.getItem('usuario_nombre') || 'Usuario Autorizado';
    document.getElementById('btn-logout').addEventListener('click', () => {
        localStorage.clear();
        window.location.href = 'login.html';
    });

    document.getElementById('btn-generar-xml').addEventListener('click', async () => {
    if (!alertaActualSeleccionada) return;
    
    const btn = document.getElementById('btn-generar-xml');
    btn.textContent = 'Generando...';
    btn.disabled = true;

    try {
        await peticionProtegida('/reportes/generar', {
            method: 'POST',
            body: JSON.stringify({ 
                alerta_id: alertaActualSeleccionada.id,
                cliente_id: alertaActualSeleccionada.cliente_id 
            })
        });
        alert('✅ Reporte XML generado. Ve a la pestaña de Reportes para descargarlo.');
    } catch (e) {
        alert('Error al generar: ' + e.message);
    } finally {
        btn.textContent = 'Generar XML CNBV';
        btn.disabled = false;
    }
});

    // Cargar datos
    await cargarAlertas();

    // Eventos del modal
    document.getElementById('btn-cerrar-modal').addEventListener('click', cerrarModal);
    document.getElementById('btn-guardar-estatus').addEventListener('click', guardarNuevoEstatus);
    document.getElementById('btn-ver-perfil').addEventListener('click', () => {
        if (alertaActualSeleccionada && alertaActualSeleccionada.cliente_id) {
            window.location.href = `clientes.html?cliente_id=${alertaActualSeleccionada.cliente_id}`;
        } else {
            window.location.href = 'clientes.html';
        }
    });
});

async function cargarAlertas() {
    try {
        alertasTotales = await peticionProtegida('/alertas');
        
        // Actualizar tarjetas resumen
        document.getElementById('card-nuevas').textContent = alertasTotales.filter(a => a.estatus === 'Nueva').length;
        document.getElementById('card-investigando').textContent = alertasTotales.filter(a => a.estatus === 'Investigando').length;
        document.getElementById('card-cerradas').textContent = alertasTotales.filter(a => a.estatus === 'Falsa Alarma' || a.estatus === 'Reportada a CNBV').length;

        // Dibujar tabla
        const cuerpo = document.getElementById('tabla-alertas-body');
        cuerpo.innerHTML = '';

        if (alertasTotales.length === 0) {
            cuerpo.innerHTML = '<tr><td colspan="5" style="text-align:center;">No hay alertas en el sistema.</td></tr>';
            return;
        }

        alertasTotales.forEach(a => {
            let claseBadge = 'badge-cerrada';
            if (a.estatus === 'Nueva') claseBadge = 'badge-nueva';
            if (a.estatus === 'Investigando') claseBadge = 'badge-investigando';

            // Forzamos el UTC para no desfaser fechas por la zona horaria local
            const fechaLimpia = new Date(a.fecha_generacion).toLocaleDateString('es-MX', { timeZone: 'UTC' });

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${a.nombre_cliente || 'Desconocido'}</td>
                <td>${a.nombre_regla || 'Evaluación General de Riesgo'}</td>
                <td>${fechaLimpia}</td>
                <td><span class="badge ${claseBadge}">${a.estatus}</span></td>
                <td>
                    <button class="btn-dictamen" data-id="${a.id}">Dictaminar</button>
                </td>
            `;
            cuerpo.appendChild(tr);
        });

        // Habilitar los botones de la tabla
        document.querySelectorAll('.btn-dictamen').forEach(boton => {
            boton.addEventListener('click', (e) => {
                abrirModal(parseInt(e.target.getAttribute('data-id')));
            });
        });

    } catch (error) {
        document.getElementById('tabla-alertas-body').innerHTML = `<tr><td colspan="5" style="color:red">Error al cargar el motor de alertas</td></tr>`;
    }
}

function abrirModal(id) {
    const alerta = alertasTotales.find(a => a.id === id);
    if (!alerta) return;

    alertaActualSeleccionada = alerta;

    document.getElementById('modal-cliente-nombre').textContent = alerta.nombre_cliente || 'Desconocido';
    document.getElementById('select-nuevo-estatus').value = alerta.estatus;
    
    document.getElementById('modal-alerta').classList.add('activo');
}

function cerrarModal() {
    document.getElementById('modal-alerta').classList.remove('activo');
    alertaActualSeleccionada = null;
}

async function guardarNuevoEstatus() {
    if (!alertaActualSeleccionada) return;

    const nuevoEstatus = document.getElementById('select-nuevo-estatus').value;
    const botonGuardar = document.getElementById('btn-guardar-estatus');

    try {
        botonGuardar.textContent = 'Guardando...';
        botonGuardar.disabled = true;

        await peticionProtegida(`/alertas/${alertaActualSeleccionada.id}/estatus`, {
            method: 'PUT',
            body: JSON.stringify({ estatus: nuevoEstatus })
        });

        cerrarModal();
        await cargarAlertas(); 

    } catch (error) {
        alert("Fallo la base de datos: " + error.message);
    } finally {
        botonGuardar.textContent = 'Guardar Cambios';
        botonGuardar.disabled = false;
    }
}