import { peticionProtegida } from '../api/apiClient.js';

// Variables globales para mantener los datos en la RAM y poder filtrarlos
let clientesTotales = [];

document.addEventListener('DOMContentLoaded', async () => {
    
    // Seguridad y Nombre
    const token = localStorage.getItem('token_sentinel');
    if (!token) return window.location.href = 'login.html';
    
    // El Empleado no tiene acceso a Clientes
    const rolUsuario = (localStorage.getItem('usuario_rol') || '').toLowerCase().trim();
    if (rolUsuario === 'empleado') return window.location.href = 'operaciones.html';
    
    document.getElementById('nombre-usuario').textContent = localStorage.getItem('usuario_nombre') || 'Usuario';
    
    document.getElementById('btn-logout').addEventListener('click', () => {
        localStorage.clear();
        window.location.href = 'login.html';
    });

    // Cargar Datos del Servidor

    try {
        clientesTotales = await peticionProtegida('/clientes');
        actualizarTarjetas(clientesTotales);
        renderizarTabla(clientesTotales);

        // DETECCIÓN DE ENLACE DIRECTO DESDE EL PANEL DE ALERTAS
        const urlParams = new URLSearchParams(window.location.search);
        const clienteIdParam = urlParams.get('cliente_id');
        
        if (clienteIdParam) {
            const idParaAbrir = parseInt(clienteIdParam);
            // Pequeño delay de 100ms para asegurar que el DOM esté listo antes de abrirlo
            setTimeout(() => {
                abrirModalCliente(idParaAbrir);
            }, 100);
        }
        // =======================================================

    } catch (error) {
        document.getElementById('tabla-clientes-body').innerHTML = `<tr><td colspan="4" style="color:red">Error al cargar clientes</td></tr>`;
}

    // EVENTOS DE BÚSQUEDA Y FILTRO
    document.getElementById('input-busqueda').addEventListener('input', aplicarFiltros);
    document.getElementById('select-riesgo').addEventListener('change', aplicarFiltros);

    // EVENTOS DEL MODAL
    document.getElementById('btn-cerrar-modal').addEventListener('click', cerrarModal);
});

// ==========================================
// FUNCIONES DE INTERFAZ
// ==========================================

function actualizarTarjetas(datos) {
    const total = datos.length;
    const pep = datos.filter(c => c.es_pep).length;
    const normal = total - pep;

    document.getElementById('card-total').textContent = total;
    document.getElementById('card-normal').textContent = normal;
    document.getElementById('card-revision').textContent = pep;
}

function renderizarTabla(datosFiltrados) {
    const cuerpo = document.getElementById('tabla-clientes-body');
    cuerpo.innerHTML = '';

    if (datosFiltrados.length === 0) {
        cuerpo.innerHTML = '<tr><td colspan="4" style="text-align:center;">No se encontraron clientes</td></tr>';
        return;
    }

    datosFiltrados.forEach(c => {
        const etiquetaRiesgo = c.es_pep 
            ? '<span style="color: red; font-weight: bold;">ALTO (PEP)</span>' 
            : '<span style="color: green;">BAJO</span>';

        // Creamos la fila
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${c.nombre_completo}</strong></td>
            <td>${c.rfc}</td>
            <td>${etiquetaRiesgo}</td>
            <td>
                <button class="btn-ver" data-id="${c.id}">Ver Detalle</button>
            </td>
        `;
        cuerpo.appendChild(tr);
    });

    // Agregar el "listener" a todos los botones "Ver" que acabamos de crear
    const botonesVer = document.querySelectorAll('.btn-ver');
    botonesVer.forEach(boton => {
        boton.addEventListener('click', (e) => {
            const idCliente = parseInt(e.target.getAttribute('data-id'));
            abrirModalCliente(idCliente);
        });
    });
}

function aplicarFiltros() {
    const texto = document.getElementById('input-busqueda').value.toLowerCase();
    const riesgo = document.getElementById('select-riesgo').value;

    const filtrados = clientesTotales.filter(c => {
        const pasaTexto = c.nombre_completo.toLowerCase().includes(texto) || c.rfc.toLowerCase().includes(texto);
        
        let pasaRiesgo = true;
        if (riesgo === 'ALTO') pasaRiesgo = c.es_pep === true;
        if (riesgo === 'BAJO') pasaRiesgo = c.es_pep === false;

        return pasaTexto && pasaRiesgo;
    });

    renderizarTabla(filtrados);
}

// ==========================================
// LÓGICA DEL MODAL MAESTRO-DETALLE
// ==========================================

function abrirModalCliente(id) {
    // Buscamos el cliente exacto en nuestra memoria RAM
    const cliente = clientesTotales.find(c => c.id === id);
    if (!cliente) return;

    // 1. ESCUDO PARA LA FECHA: Evita el "Invalid Date"
    let fechaSegura = 'No registrada';
    if (cliente.fecha_nacimiento) {
        // Al usar timeZone 'UTC' evitamos que el día se recorra por cambios de horario
        const fechaObj = new Date(cliente.fecha_nacimiento);
        if (!isNaN(fechaObj)) {
            fechaSegura = fechaObj.toLocaleDateString('es-MX', { timeZone: 'UTC' });
        } else {
            fechaSegura = cliente.fecha_nacimiento; // Fallback texto crudo
        }
    }

    const modalBody = document.getElementById('modal-detalles-body');
    
    // 2. INYECCIÓN DEL HTML (Usando el operador || para ocultar los "undefined")
    modalBody.innerHTML = `
        <div class="info-grid">
            <div class="info-item">
                <span class="info-label">Nombre Completo</span>
                <span class="info-value">${cliente.nombre_completo || 'No registrado'}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Estatus de Riesgo</span>
                <span class="info-value" style="color: ${cliente.es_pep ? 'red' : 'green'}; font-weight: bold;">
                    ${cliente.es_pep ? 'Alto (PEP)' : 'Riesgo Normal'}
                </span>
            </div>
            <div class="info-item">
                <span class="info-label">RFC</span>
                <span class="info-value">${cliente.rfc || 'No registrado'}</span>
            </div>
            <div class="info-item">
                <span class="info-label">CURP</span>
                <span class="info-value">${cliente.curp || 'No registrado'}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Fecha de Nacimiento</span>
                <span class="info-value">${fechaSegura}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Género</span>
                <span class="info-value">${cliente.genero || 'No especificado'}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Nacionalidad</span>
                <span class="info-value">${cliente.nacionalidad || 'No registrada'}</span>
            </div>
            <div class="info-item">
                <span class="info-label">País de Nacimiento</span>
                <span class="info-value">${cliente.pais_nacimiento || 'No registrado'}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Estado Civil</span>
                <span class="info-value">${cliente.estado_civil || 'No especificado'}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Correo Electrónico</span>
                <span class="info-value">${cliente.correo || 'No registrado'}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Teléfono Celular</span>
                <span class="info-value">${cliente.tel_celular || 'No registrado'}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Teléfono Fijo</span>
                <span class="info-value">${cliente.tel_fijo || 'No registrado'}</span>
            </div>
            <div class="info-item" style="grid-column: span 2;">
                <span class="info-label">Naturaleza de la Cuenta</span>
                <span class="info-value" style="font-weight: bold;">
                    ${cliente.actua_cuenta_propia ? 'Actúa por cuenta propia' : 'Actúa a nombre de un tercero'}
                </span>
            </div>
        </div>
    `;

    // Mostramos el modal
    document.getElementById('modal-cliente').classList.add('activo');
}

function cerrarModal() {
    document.getElementById('modal-cliente').classList.remove('activo');
}