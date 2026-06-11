import { peticionProtegida } from '../api/apiClient.js';

const token = localStorage.getItem('token_sentinel');
if (!token) window.location.href = 'index.html';

document.getElementById('btn-logout').addEventListener('click', () => {
    localStorage.clear();
    window.location.href = 'index.html';
});

// Drag & drop zone
const dropZone = document.getElementById('drop-zone-denuncia');
const inputArchivo = document.getElementById('archivo-denuncia');
const nombreArchivo = document.getElementById('nombre-archivo');

dropZone.addEventListener('click', () => inputArchivo.click());

dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.style.borderColor = '#21409A';
});

dropZone.addEventListener('dragleave', () => {
    dropZone.style.borderColor = '#ddd';
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.style.borderColor = '#ddd';
    const file = e.dataTransfer.files[0];
    validarYMostrarArchivo(file);
});

inputArchivo.addEventListener('change', () => {
    validarYMostrarArchivo(inputArchivo.files[0]);
});

function validarYMostrarArchivo(file) {
    if (!file) return;
    if (file.type !== 'application/pdf') {
        mostrarError('Solo se aceptan archivos PDF.');
        inputArchivo.value = '';
        nombreArchivo.textContent = '';
        return;
    }
    if (file.size > 5 * 1024 * 1024) {
        mostrarError('El archivo no puede superar 5MB.');
        inputArchivo.value = '';
        nombreArchivo.textContent = '';
        return;
    }
    nombreArchivo.textContent = `📄 ${file.name}`;
}

document.getElementById('btn-cancelar').addEventListener('click', () => {
    document.getElementById('tipo-denuncia').value = '';
    document.getElementById('asunto-denuncia').value = '';
    document.getElementById('descripcion-denuncia').value = '';
    inputArchivo.value = '';
    nombreArchivo.textContent = '';
    ocultarMensajes();
});

document.getElementById('btn-enviar-denuncia').addEventListener('click', async () => {
    ocultarMensajes();

    const tipo = document.getElementById('tipo-denuncia').value;
    const asunto = document.getElementById('asunto-denuncia').value.trim();
    const descripcion = document.getElementById('descripcion-denuncia').value.trim();

    if (!tipo) return mostrarError('Seleccione el tipo de denuncia.');
    if (!asunto) return mostrarError('El asunto es obligatorio.');
    if (!descripcion) return mostrarError('La descripción es obligatoria.');

    try {
        const btn = document.getElementById('btn-enviar-denuncia');
        btn.disabled = true;
        btn.textContent = 'Enviando...';

        // Si hay archivo, convertir a base64
        let archivo_url = null;
        const file = inputArchivo.files[0];
        if (file) {
            archivo_url = await archivoABase64(file);
        }

        await peticionProtegida('/denuncias', {
            method: 'POST',
            body: JSON.stringify({ tipo, asunto, descripcion, archivo_url })
        });

        document.getElementById('panel-exito').style.display = 'block';
        document.getElementById('tipo-denuncia').value = '';
        document.getElementById('asunto-denuncia').value = '';
        document.getElementById('descripcion-denuncia').value = '';
        inputArchivo.value = '';
        nombreArchivo.textContent = '';

    } catch (err) {
        mostrarError(err.message);
    } finally {
        const btn = document.getElementById('btn-enviar-denuncia');
        btn.disabled = false;
        btn.textContent = 'Enviar denuncia';
    }
});

function archivoABase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

function mostrarError(msg) {
    const panel = document.getElementById('panel-error');
    panel.textContent = msg;
    panel.style.display = 'block';
}

function ocultarMensajes() {
    document.getElementById('panel-exito').style.display = 'none';
    document.getElementById('panel-error').style.display = 'none';
}
