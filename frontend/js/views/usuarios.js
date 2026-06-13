document.addEventListener('DOMContentLoaded', () => {
    const rolUsuario = localStorage.getItem('usuario_rol');
    const token = localStorage.getItem('token_sentinel');

    const seccionFormulario = document.getElementById('seccion-formulario-usuarios');
    const bloqueoAdmin = document.getElementById('bloqueo-admin');
    const form = document.getElementById('form-alta-usuario');
    const btnCrear = document.getElementById('btn-crear-usuario');
    const feedback = document.getElementById('usuario-feedback');

    // Verificación de rango de seguridad
    if (rolUsuario !== 'Administrador' || !token) {
        seccionFormulario.style.display = 'none';
        bloqueoAdmin.style.display = 'block';
        return;
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        btnCrear.disabled = true;
        btnCrear.textContent = 'Escribiendo en registro y cifrando hash...';
        mostrarMsg('', false);

        // Deconstrucción de los elementos del formulario
        const payload = {
            nombre: document.getElementById('txt-nombre').value.trim(),
            correo: document.getElementById('txt-correo').value.trim(),
            password: document.getElementById('txt-password').value,
            rol: document.getElementById('select-rol').value
        };

        try {
            const respuesta = await fetch('http://s9ddf9px2u662rwatb5mq860.198.211.99.43.sslip.io/api/usuarios', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const datos = await respuesta.json();

            if (respuesta.ok) {
                mostrarMsg(`${datos.mensaje}. Nombre: <strong>${datos.usuario.nombre}</strong> con perfil de [${datos.usuario.rol}].`, false);
                form.reset();
            } else {
                mostrarMsg(datos.error || 'Ocurrió un error al registrar al usuario.', true);
            }
        } catch (error) {
            console.error(error);
            mostrarMsg('Error crítico: El backend de identidades no responde.', true);
        } finally {
            btnCrear.disabled = false;
            btnCrear.textContent = 'Dar de Alta Usuario';
        }
    });

    function mostrarMsg(texto, esError) {
        if (!texto) {
            feedback.style.display = 'none';
            return;
        }
        feedback.style.display = 'block';
        feedback.className = `alerta ${esError ? 'alerta-error' : 'alerta-exito'}`;
        feedback.innerHTML = texto;
    }
});
