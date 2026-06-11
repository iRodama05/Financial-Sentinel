document.addEventListener('DOMContentLoaded', () => {
    const rolUsuario = localStorage.getItem('usuario_rol'); 
    const token = localStorage.getItem('token_sentinel');

    const seccionCarga = document.getElementById('seccion-carga');
    const vistaBloqueada = document.getElementById('vista-bloqueada');

    if (rolUsuario === 'visor' || !token) {
        seccionCarga.style.display = 'none';
        vistaBloqueada.style.display = 'block';
        return; // Detiene la ejecución del script
    }

    // Variables del DOM para la carga de archivos
    const dropZone = document.getElementById('drop-zone-csv');
    const fileInput = document.getElementById('input-file-csv');
    const btnEnviar = document.getElementById('btn-enviar-csv');
    const archivoSeleccionadoTxt = document.getElementById('archivo-seleccionado');
    const feedback = document.getElementById('panel-feedback');
    const form = document.getElementById('form-carga-masiva');
    const tipoCarga = document.getElementById('tipo-carga');

    // Forzar el click al input oculto cuando se toca la zona
    dropZone.addEventListener('click', () => fileInput.click());

    // Manejo visual del Drag & Drop
    fileInput.addEventListener('change', () => actualizarArchivoSeleccionado(fileInput.files[0]));
    
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('drop-zone--over');
    });

    ['dragleave', 'dragend'].forEach(type => {
        dropZone.addEventListener(type, () => dropZone.classList.remove('drop-zone--over'));
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('drop-zone--over');
        if (e.dataTransfer.files.length) {
            fileInput.files = e.dataTransfer.files;
            actualizarArchivoSeleccionado(e.dataTransfer.files[0]);
        }
    });

    function actualizarArchivoSeleccionado(file) {
        if (file && file.name.endsWith('.csv')) {
            archivoSeleccionadoTxt.textContent = `Archivo listo: ${file.name} (${(file.size/1024).toFixed(2)} KB)`;
            btnEnviar.disabled = false;
            mostrarMensaje('', false);
        } else {
            archivoSeleccionadoTxt.textContent = '';
            btnEnviar.disabled = true;
            mostrarMensaje('Error: Por favor selecciona un archivo con extensión .csv válido.', true);
        }
    }

    // Envío de datos binarios al Servidor
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        btnEnviar.disabled = true;
        btnEnviar.textContent = 'Procesando líneas del archivo...';

        const formData = new FormData();
        // El nombre 'archivo_csv' debe coincidir exactamente con el de upload.single() en el backend
        formData.append('archivo_csv', fileInput.files[0]); 

        try {
            let endpoint = 'http://s9ddf9px2u662rwatb5mq860.198.211.99.43.sslip.io/api/carga/clientes';

            if (tipoCarga.value === 'operaciones') {
            endpoint = 'http://s9ddf9px2u662rwatb5mq860.198.211.99.43.sslip.io/api/carga/operaciones';
            }

            const respuesta = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            const resultado = await respuesta.json();

            if (respuesta.ok) {
                mostrarMensaje(resultado.mensaje, false);
                form.reset();
                archivoSeleccionadoTxt.textContent = '';
            } else {
                mostrarMensaje(resultado.error || 'Fallo estructural en la carga.', true);
            }
        } catch (error) {
            console.error(error);
            mostrarMensaje('Error crítico: Sin comunicación con el servidor de ingesta.', true);
        } finally {
            btnEnviar.textContent = 'Iniciar Ingesta Masiva';
        }
    });

    function mostrarMensaje(texto, esError) {
        if (!texto) {
            feedback.style.display = 'none';
            return;
        }
        feedback.style.display = 'block';
        feedback.className = `alerta ${esError ? 'alerta-error' : 'alerta-exito'}`;
        feedback.innerHTML = texto;
    }
});
