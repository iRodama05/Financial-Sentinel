import { peticionProtegida } from '../api/apiClient.js';

const token = localStorage.getItem('token_sentinel');
if (!token) window.location.href = 'index.html';

const rolUsuario = (localStorage.getItem('usuario_rol') || '').toLowerCase().trim();
document.getElementById('nombre-usuario').textContent =
    localStorage.getItem('usuario_nombre') || 'Usuario';

document.getElementById('btn-logout').addEventListener('click', () => {
    localStorage.clear();
    window.location.href = 'index.html';
});

if (rolUsuario !== 'administrador' && rolUsuario !== 'admin') {
    document.getElementById('bloqueo-acceso').style.display = 'block';
} else {
    document.getElementById('seccion-bitacora').style.display = 'block';
    cargarBitacora();
}

function fmtFecha(iso) {
    return new Date(iso).toLocaleString('es-MX', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
}

function badgeOp(op) {
    return `<span class="badge-op badge-${op}">${op}</span>`;
}

async function cargarBitacora() {
    try {
        const datos = await peticionProtegida('/bitacora');
        const tbody = document.getElementById('tabla-bitacora-body');

        if (!datos || datos.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="bitacora-estado">No hay registros en la bitácora.</td></tr>';
            actualizarKpis([]);
            return;
        }

        actualizarKpis(datos);

        tbody.innerHTML = datos.map((r, i) => `
            <tr>
                <td>${r.id}</td>
                <td>${badgeOp(r.operacion)}</td>
                <td>${r.nombre_cliente || '—'}</td>
                <td>${fmtFecha(r.fecha)}</td>
                <td>${r.usuario_db || '—'}</td>
                <td><button class="btn-accion" onclick='verDetalle(${JSON.stringify(r)})'>Ver</button></td>
            </tr>
        `).join('');
    } catch (err) {
        document.getElementById('tabla-bitacora-body').innerHTML =
            `<tr><td colspan="6" class="bitacora-estado">Error al cargar: ${err.message}</td></tr>`;
    }
}

function actualizarKpis(datos) {
    document.getElementById('card-total').textContent  = datos.length;
    document.getElementById('card-insert').textContent = datos.filter(r => r.operacion === 'INSERT').length;
    document.getElementById('card-update').textContent = datos.filter(r => r.operacion === 'UPDATE').length;
    document.getElementById('card-delete').textContent = datos.filter(r => r.operacion === 'DELETE').length;
}

window.verDetalle = function(r) {
    document.getElementById('modal-titulo').textContent =
        `${r.operacion} — ${r.nombre_cliente || 'Cliente #' + r.cliente_id} — ${fmtFecha(r.fecha)}`;
    document.getElementById('modal-contenido').innerHTML = `
        ${r.datos_anteriores ? `<p><strong>Antes:</strong></p><pre>${JSON.stringify(r.datos_anteriores, null, 2)}</pre>` : ''}
        ${r.datos_nuevos     ? `<p><strong>Después:</strong></p><pre>${JSON.stringify(r.datos_nuevos, null, 2)}</pre>` : ''}
    `;
    document.getElementById('modal-detalle').classList.add('activo');
};

window.cerrarModal = function() {
    document.getElementById('modal-detalle').classList.remove('activo');
};
