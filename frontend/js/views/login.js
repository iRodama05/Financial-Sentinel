// frontend/js/views/login.js
import { iniciarSesion } from '../api/authApi.js';

document.addEventListener('DOMContentLoaded', () => {
    const formLogin = document.getElementById('form-login');
    const mensajeError = document.getElementById('mensaje-error'); // Un div oculto en tu HTML para errores

    if (formLogin) {
        formLogin.addEventListener('submit', async (e) => {
            e.preventDefault(); // Evita que la página recargue

            const correo = document.getElementById('correo').value;
            const password = document.getElementById('password').value;

            try {
                // Limpiamos mensajes anteriores
                if(mensajeError) mensajeError.style.display = 'none';

                // Llamamos al backend
                const respuesta = await iniciarSesion(correo, password);

                // Si pasamos, guardamos el gafete (Token)
                localStorage.setItem('token_sentinel', respuesta.token);
                localStorage.setItem('usuario_nombre', respuesta.usuario.nombre);
                localStorage.setItem('usuario_rol', respuesta.usuario.rol);

                // Redirigimos al panel de control
                window.location.href = 'dashboard.html';

            } catch (error) {
                // Si el backend nos rebota (ej. contraseña incorrecta)
                if(mensajeError) {
                    mensajeError.textContent = error.message;
                    mensajeError.style.display = 'block';
                    mensajeError.style.color = 'red';
                } else {
                    alert(error.message);
                }
            }
        });
    }
});