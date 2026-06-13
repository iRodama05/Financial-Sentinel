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

function getCorreoDelToken() {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.correo || '';
    } catch { return ''; }
}

const correo = getCorreoDelToken();
const esOficial = correo === 'oficial@fsst.com';
const esAdmin = rolUsuario === 'administrador' || rolUsuario === 'admin';

if (!esOficial && !esAdmin) {
    document.getElementById('bloqueo-acceso').style.display = 'block';
} else {
    document.getElementById('seccion-denuncias').style.display = 'block';
    cargarDenuncias();
}

function fmtFecha(iso) {
    return new Date(iso).toLocaleString('es-MX', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit'
    });
}

async function cargarDenuncias() {
    try {
        const datos = await peticionProtegida('/denuncias');
        const tbody = document.getElementById('tabla-denuncias-body');

        if (!datos || datos.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="bitacora-estado">No hay denuncias registradas.</td></tr>';
            actualizarKpis([]);
            return;
        }

        actualizarKpis(datos);

        tbody.innerHTML = datos.map(d => `
            <tr>
                <td>${d.id}</td>
                <td><span class="badge-op" style="background:#dbeafe;color:#1e40af;">${d.tipo}</span></td>
                <td>${d.asunto}</td>
                <td>${fmtFecha(d.fecha_envio)}</td>
                <td>${d.archivo_url
                    ? `<button class="btn-accion" onclick='verPDF(${JSON.stringify(d.archivo_url)})'>📄 Ver PDF</button>`
                    : '<span style="color:#94a3b8;font-size:0.85rem;">—</span>'
                }</td>
                <td><button class="btn-accion" onclick='verDetalle(${JSON.stringify(d)})'>Ver</button></td>
            </tr>
        `).join('');
    } catch (err) {
        document.getElementById('tabla-denuncias-body').innerHTML =
            `<tr><td colspan="6" class="bitacora-estado">Error al cargar: ${err.message}</td></tr>`;
    }
}

function actualizarKpis(datos) {
    document.getElementById('card-total').textContent   = datos.length;
    document.getElementById('card-con-pdf').textContent = datos.filter(d => d.archivo_url).length;
    document.getElementById('card-sin-pdf').textContent = datos.filter(d => !d.archivo_url).length;
}

window.verDetalle = function(d) {
    document.getElementById('modal-titulo').textContent = `${d.tipo} — ${fmtFecha(d.fecha_envio)}`;
    document.getElementById('modal-contenido').innerHTML = `
        <p><strong>Asunto:</strong> ${d.asunto}</p>
        <p style="margin-top:12px;"><strong>Descripción:</strong></p>
        <pre>${d.descripcion}</pre>
        ${d.archivo_url
            ? `<p style="margin-top:12px;"><button class="btn-accion" onclick='verPDF(${JSON.stringify(d.archivo_url)})'>📄 Abrir PDF adjunto</button></p>`
            : '<p style="margin-top:12px;color:#94a3b8;">Sin archivo adjunto.</p>'
        }
    `;
    document.getElementById('modal-denuncia').classList.add('activo');
};

window.verPDF = function(base64) {
    const win = window.open();
    win.document.write(`<iframe src="${base64}" style="width:100%;height:100vh;border:none;"></iframe>`);
};

window.cerrarModal = function() {
    document.getElementById('modal-denuncia').classList.remove('activo');
};