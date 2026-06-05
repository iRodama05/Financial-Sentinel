document.addEventListener('DOMContentLoaded', () => {
    // 1. Leemos quién eres
    const rawRol = localStorage.getItem('usuario_rol') || '';
    const rolUsuario = rawRol.toLowerCase().trim(); 

    // 2. Buscamos los botones restringidos en el HTML
    const menuUsuarios = document.getElementById('menu-usuarios');
    const menuCsv = document.getElementById('menu-csv');
    const btnImportarCsv = document.getElementById('btn-importar-csv');

    // 3. Encendemos los botones según tu nivel de acceso
    if (rolUsuario === 'admin' || rolUsuario === 'administrador') {
        if (menuUsuarios) menuUsuarios.style.display = 'block';
        if (menuCsv) menuCsv.style.display = 'block';
        if (btnImportarCsv) btnImportarCsv.style.display = 'inline-block';
        
    } else if (rolUsuario === 'oficial' || rolUsuario === 'oficial de cumplimiento') {
        if (menuCsv) menuCsv.style.display = 'block';
        if (btnImportarCsv) btnImportarCsv.style.display = 'inline-block';
    }
});