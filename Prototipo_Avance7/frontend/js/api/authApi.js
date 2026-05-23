// frontend/js/api/authApi.js
import { peticionProtegida } from './apiClient.js';

export const iniciarSesion = async (correo, password) => {
    return await peticionProtegida('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ correo, password })
    });
};