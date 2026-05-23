import { peticionProtegida } from '../api/apiClient.js';

let reportesTotales = [];

document.addEventListener('DOMContentLoaded', async () => {
    
    // 1. Configuración de Sesión
    const nombreUsuario = document.getElementById('nombre-usuario');
    if (nombreUsuario) {
        nombreUsuario.textContent = localStorage.getItem('usuario_nombre') || 'Usuario Autorizado';
    }

    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            localStorage.clear();
            window.location.href = 'login.html';
        });
    }

    // 2. Extracción de Datos
    try {
        console.log("Iniciando petición a la bóveda de reportes...");
        reportesTotales = await peticionProtegida('/reportes');
        console.log("Datos recibidos del backend:", reportesTotales);

        // 3. Actualización de Tarjetas (Con escudos por si algún ID cambió en el HTML)
        const cardTotal = document.getElementById('card-total');
        const cardClientes = document.getElementById('card-clientes');
        const cardAlertas = document.getElementById('card-alertas');

        if (cardTotal) cardTotal.textContent = reportesTotales.length;
        
        if (cardClientes) {
            // Extraemos los clientes únicos
            const clientesUnicos = new Set(reportesTotales.map(r => r.nombre_cliente).filter(n => n));
            cardClientes.textContent = clientesUnicos.size;
        }

        if (cardAlertas) {
            // Asumimos que los reportes de esta tabla vienen de alertas
            cardAlertas.textContent = reportesTotales.length; 
        }

        // 4. Renderizamos la tabla
        renderizarTabla(reportesTotales);

    } catch (error) {
        console.error("Fallo crítico al cargar la vista de reportes:", error);
        const cuerpoTabla = document.getElementById('tabla-reportes-body');
        if (cuerpoTabla) {
            cuerpoTabla.innerHTML = `<tr><td colspan="6" style="color:red; font-weight:bold;">Error de conexión: ${error.message || 'El backend no respondió.'}</td></tr>`;
        }
    }
});

// ==========================================
// FUNCIONES DE INTERFAZ Y DESCARGA
// ==========================================

function renderizarTabla(datos) {
    const cuerpo = document.getElementById('tabla-reportes-body');
    if (!cuerpo) return;

    cuerpo.innerHTML = '';

    if (!datos || datos.length === 0) {
        cuerpo.innerHTML = '<tr><td colspan="6" style="text-align:center;">No hay reportes en la bóveda. Ve a Alertas para generar uno.</td></tr>';
        return;
    }

    datos.forEach((r, index) => {
        const tr = document.createElement('tr');
        
        // Mapeo con las nuevas columnas limpias de la BD
        let fechaLimpia = "Sin fecha";
        if (r.fecha_generacion) {
            fechaLimpia = new Date(r.fecha_generacion).toLocaleDateString('es-MX', { timeZone: 'UTC' });
        }
        
        tr.innerHTML = `
            <td><strong>R-00${r.id}</strong></td>
            <td>${r.descripcion || 'Reporte Regulatorio'}</td>
            <td>${r.nombre_cliente || 'Cliente no especificado'}</td>
            <td style="text-transform: capitalize;">${r.periodo || 'N/A'}</td>
            <td>${fechaLimpia}</td>
            <td>
                <button class="btn-descargar" data-index="${index}" style="background: #0d6efd; color: white; border: none; padding: 6px 12px; border-radius: 4px; font-weight: bold; cursor: pointer; font-size: 12px;">
                    📥 XML
                </button>
            </td>
        `;
        cuerpo.appendChild(tr);
    });

    // Evento de Descarga usando la columna 'contenido_xml'
    document.querySelectorAll('.btn-descargar').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = e.target.getAttribute('data-index');
            const reporte = datos[index];
            
            const contenidoXML = reporte.contenido_xml || '<?xml version="1.0"?><Error>Vacío</Error>';

            const blob = new Blob([contenidoXML], { type: 'application/xml' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `Reporte_CNBV_R00${reporte.id}.xml`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
    });
}