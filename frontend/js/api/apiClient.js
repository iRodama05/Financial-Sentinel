// frontend/js/api/apiClient.js
const API_BASE_URL = 'http://s9ddf9px2u662rwatb5mq860.198.211.99.43.sslip.io/api';
export const peticionProtegida = async (endpoint, options = {}) => {
    const token = localStorage.getItem('token_sentinel');
    
    const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
    };

    const config = {
        ...options,
        headers
    };

    try {
        const respuesta = await fetch(`${API_BASE_URL}${endpoint}`, config);
        const data = await respuesta.json();

        if (!respuesta.ok) {
            const rolUsuario = (localStorage.getItem('usuario_rol') || '').toLowerCase().trim();
            if (respuesta.status === 403 && rolUsuario === 'empleado') {
                if (!window.location.pathname.endsWith('operaciones.html')) {
                    window.location.href = 'operaciones.html';
                }
                return null;
            }

            throw new Error(data.error || 'Error desconocido del servidor');
        }

        return data;
    } catch (error) {
        console.error(`[API Error en ${endpoint}]:`, error.message);
        throw error; // Lanzamos el error para que la Vista lo atrape y muestre una alerta
    }
};