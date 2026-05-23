import pool from '../db/connection.js';

// Busca a un usuario por su correo
export const obtenerUsuarioPorCorreo = async (correo) => {
    const query = 'SELECT id, nombre, correo, password_hash, rol, activo FROM usuarios_sistema WHERE correo = $1';
    const result = await pool.query(query, [correo]);
    return result.rows[0]; // Retorna el usuario o undefined si no existe
};

// Crea un usuario
export const crearUsuario = async (nombre, correo, passwordHash, rol) => {
    const query = `
        INSERT INTO usuarios_sistema (nombre, correo, password_hash, rol) 
        VALUES ($1, $2, $3, $4) 
        RETURNING id, nombre, correo, rol;
    `;
    const result = await pool.query(query, [nombre, correo, passwordHash, rol]);
    return result.rows[0];
};