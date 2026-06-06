document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token_sentinel');

    if (!token) {
        window.location.href = 'index.html';
        return;
    }

    const nombreUsuario = localStorage.getItem('usuario_nombre') || 'Usuario';
    document.getElementById('nombre-usuario').textContent = nombreUsuario;

    const btnLogout = document.getElementById('btn-logout');
    btnLogout.addEventListener('click', () => {
        localStorage.clear();
        window.location.href = 'index.html';
    });

    const btnEnviar = document.getElementById('btn-enviar-denuncia');
    const mensaje = document.getElementById('mensaje-denuncia');

    btnEnviar.addEventListener('click', () => {
        const tipo = document.getElementById('tipo-denuncia').value;
        const asunto = document.getElementById('asunto').value;
        const involucrado = document.getElementById('involucrado').value;
        const fecha = document.getElementById('fecha').value;
        const descripcion = document.getElementById('descripcion').value;

        if (asunto === '' || involucrado === '' || fecha === '' || descripcion === '') {
            mensaje.textContent = 'Completa los campos obligatorios antes de enviar la denuncia.';
            mensaje.style.color = 'red';
            return;
        }

        mensaje.textContent = 'Denuncia enviada correctamente. La información será revisada por el área correspondiente.';
        mensaje.style.color = 'green';

        document.getElementById('tipo-denuncia').value = 'Fraude';
        document.getElementById('asunto').value = '';
        document.getElementById('involucrado').value = '';
        document.getElementById('fecha').value = '';
        document.getElementById('descripcion').value = '';
        document.getElementById('evidencia').value = '';
    });
});