const API_BASE_URL = 'http://localhost:3000/api';

export const fetchClientes = async () => {
    // Si tienes el candado de seguridad activo, saca el token del almacenamiento
    const token = localStorage.getItem('token_sentinel') || '';
    
    try {
        const respuesta = await fetch(`${API_BASE_URL}/clientes`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!respuesta.ok) {
            throw new Error(`El backend rechazó la petición con código: ${respuesta.status}`);
        }

        // Retorna el JSON limpio que se construyó en el backend
        return await respuesta.json(); 
        
    } catch (error) {
        console.error("Error en la capa de red:", error);
        return []; // Retorna un arreglo vacío para que la vista no colapse
    }
};