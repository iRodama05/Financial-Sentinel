document.addEventListener('DOMContentLoaded', () => {
    // 1. Leemos quién eres
    const rawRol = localStorage.getItem('usuario_rol') || '';
    const rolUsuario = rawRol.toLowerCase().trim(); 

    // 2. Buscamos los botones restringidos en el HTML
    const menuUsuarios = document.getElementById('menu-usuarios');
    const menuCsv = document.getElementById('menu-csv');
    const menuBitacora  = document.getElementById('menu-bitacora');
    const menuDenuncias  = document.getElementById('menu-denuncias');
    const btnImportarCsv = document.getElementById('btn-importar-csv');

    // 3. Encendemos los botones según tu nivel de acceso
    if (rolUsuario === 'admin' || rolUsuario === 'administrador') {
        if (menuUsuarios) menuUsuarios.style.display = 'block';
        if (menuCsv) menuCsv.style.display = 'block';
        if (menuBitacora)   menuBitacora.style.display   = 'block';
        if (menuDenuncias)  menuDenuncias.style.display  = 'block';
        if (btnImportarCsv) btnImportarCsv.style.display = 'inline-block';
        
    } else if (rolUsuario === 'oficial' || rolUsuario === 'oficial de cumplimiento') {
        if (menuCsv) menuCsv.style.display = 'block';
        if (menuBitacora)   menuBitacora.style.display   = 'block';
        if (menuDenuncias)  menuDenuncias.style.display  = 'block';
        if (btnImportarCsv) btnImportarCsv.style.display = 'inline-block';
    
    } else if (rolUsuario === 'empleado') {
        const paginasPermitidas = ['operaciones.html', 'denuncia-anonima.html'];
        document.querySelectorAll('.nav-item').forEach((item) => {
            const href = (item.getAttribute('href') || '').toLowerCase();
            if (href && !paginasPermitidas.includes(href)) {
                item.style.display = 'none';
            }
        });
    }
});