import { peticionProtegida } from '../api/apiClient.js';

let operacionesTotales = [];

document.addEventListener('DOMContentLoaded', async () => {
    
    // Seguridad y Nombre 
    const token = localStorage.getItem('token_sentinel');
    if (!token) return window.location.href = 'login.html';
    document.getElementById('nombre-usuario').textContent = localStorage.getItem('usuario_nombre') || 'Usuario';
    
    document.getElementById('btn-logout').addEventListener('click', () => {
        localStorage.clear();
        window.location.href = 'login.html';
    });

    // Cargar Datos del Servidor
    try {
        operacionesTotales = await peticionProtegida('/operaciones');
        actualizarTarjetas(operacionesTotales);
        renderizarTabla(operacionesTotales);
    } catch (error) {
        // Esto te dirá exactamente por qué rebotó la conexión
        console.error("Fallo crítico en la red:", error); 
        document.getElementById('tabla-operaciones-body').innerHTML = `<tr><td colspan="7" style="color:red">Error al conectar con el historial transaccional</td></tr>`;
    }

    // EVENTOS DE BÚSQUEDA Y FILTRO EN TIEMPO REAL
    document.getElementById('input-busqueda-ops').addEventListener('input', aplicarFiltros);
    document.getElementById('select-tipo-mov').addEventListener('change', aplicarFiltros);
});


function actualizarTarjetas(datos) {
    const totalMonto = datos.reduce((sum, o) => sum + parseFloat(o.monto), 0);
    const hoy = new Date().toISOString().split('T')[0];
    
    const opsHoy = datos.filter(o => o.fecha_operacion.startsWith(hoy));
    const depositosHoy = opsHoy.filter(o => o.tipo_movimiento === 'Deposito').length;
    const retirosHoy = opsHoy.filter(o => o.tipo_movimiento === 'Retiro').length;

    document.getElementById('card-monto-total').textContent = `$${totalMonto.toFixed(2)}`;
    document.getElementById('card-depositos').textContent = depositosHoy;
    document.getElementById('card-retiros').textContent = retirosHoy;
}

function renderizarTabla(datosFiltrados) {
    const cuerpo = document.getElementById('tabla-operaciones-body');
    cuerpo.innerHTML = '';

    if (datosFiltrados.length === 0) {
        cuerpo.innerHTML = '<tr><td colspan="7" style="text-align:center;">No se encontraron movimientos coincidiendo con los criterios</td></tr>';
        return;
    }

    datosFiltrados.forEach(o => {
        // Insignias visuales
        const badgeClass = o.tipo_movimiento === 'Deposito' ? 'badge-deposito' : 'badge-retiro';
        
        // Formateo seguro de fecha (UTC)
        const fechaLimpia = new Date(o.fecha_operacion).toLocaleDateString('es-MX', { timeZone: 'UTC' });

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>O-00${o.folio_operacion}</td>
            <td>${fechaLimpia}</td>
            <td><strong>${o.nombre_cliente}</strong></td>
            <td>C-00${o.contrato_folio}</td>
            <td><span class="badge ${badgeClass}">${o.tipo_movimiento}</span></td>
            <td>$${parseFloat(o.monto).toFixed(2)}</td>
            <td>
                <button class="btn-ver-perfil" data-cliente-id="${o.cliente_id}">Ver Expediente Cliente</button>
            </td>
        `;
        cuerpo.appendChild(tr);
    });

    // Activar los botones recién creados (Deep Linking)
    document.querySelectorAll('.btn-ver-perfil').forEach(boton => {
        boton.addEventListener('click', (e) => {
            const clienteId = parseInt(e.target.getAttribute('data-cliente-id'));
            // ==========================================================
            // DEEP LINKING: Redirige pasando el ID por la URL
            // ==========================================================
            window.location.href = `clientes.html?cliente_id=${clienteId}`;
        });
    });
}

function aplicarFiltros() {
    const texto = document.getElementById('input-busqueda-ops').value.toLowerCase();
    const tipo = document.getElementById('select-tipo-mov').value;

    const filtrados = operacionesTotales.filter(o => {
        // Búsqueda cruzada por múltiples campos
        const pasaTexto = o.nombre_cliente.toLowerCase().includes(texto) || 
                          o.contrato_folio.toString().includes(texto) ||
                          o.folio_operacion.toString().includes(texto);
        
        let pasaTipo = true;
        if (tipo !== 'TODOS') pasaTipo = o.tipo_movimiento === tipo;

        return pasaTexto && pasaTipo;
    });

    renderizarTabla(filtrados);
}