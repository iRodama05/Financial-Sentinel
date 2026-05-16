import pool from '../db/connection.js';

export const crearPerfilBase = async (clienteId) => {
    const query = `
        INSERT INTO perfiles_transaccionales (
            cliente_id, ocupacion_profesion, ingreso_mensual_promedio, nivel_riesgo_calculado
        ) VALUES ($1, 'Por definir', 0, 1)
        RETURNING *;
    `;
    const result = await pool.query(query, [clienteId]);
    return result.rows[0];
};