import pool from '../db/connection.js';

export const registrarTransaccion = async (datos) => {
    const { contrato_id, monto, tipo_movimiento } = datos;
    const query = `
        INSERT INTO operaciones (contrato_id, monto, tipo_movimiento)
        VALUES ($1, $2, $3)
        RETURNING *;
    `;
    const result = await pool.query(query, [contrato_id, monto, tipo_movimiento]);
    return result.rows[0];
};

export const listarUltimasOperaciones = async (limite = 10) => {
    const query = `
        SELECT o.*, c.id AS cliente_id, cl.nombre_completo
        FROM operaciones o
        JOIN contratos c ON o.contrato_id = c.id
        JOIN clientes cl ON c.cliente_id = cl.id
        ORDER BY o.fecha_operacion DESC
        LIMIT $1;
    `;
    const result = await pool.query(query, [limite]);
    return result.rows;
};