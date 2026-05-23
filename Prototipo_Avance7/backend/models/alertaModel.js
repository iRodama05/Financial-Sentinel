import pool from '../db/connection.js';

// 1. Obtener alertas incluyendo obligatoriamente el cliente_id
export const obtenerTodasAlertas = async () => {
    const query = `
        SELECT 
            a.id, 
            a.cliente_id, -- INCLUSIÓN CRUCIAL: Permite el redireccionamiento directo
            a.estatus, 
            a.fecha_generacion, 
            c.nombre_completo AS nombre_cliente, 
            r.nombre_regla 
        FROM alertas a
        LEFT JOIN clientes c ON a.cliente_id = c.id
        LEFT JOIN reglas r ON a.regla_id = r.id
        ORDER BY a.id DESC;
    `;
    const result = await pool.query(query);
    return result.rows;
};

// 2. Ejecutar la actualización del estatus en la base de datos
export const actualizarEstatusAlerta = async (id, estatus) => {
    const query = `
        UPDATE alertas 
        SET estatus = $1 
        WHERE id = $2 
        RETURNING *;
    `;
    const result = await pool.query(query, [estatus, id]);
    return result.rows[0];
};