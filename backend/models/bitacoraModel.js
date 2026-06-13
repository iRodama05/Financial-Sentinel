import pool from '../db/connection.js';

export const getAllBitacora = async () => {
    const query = `
        SELECT
            b.id, b.operacion, b.cliente_id,
            b.datos_anteriores, b.datos_nuevos,
            b.usuario_db, b.fecha,
            COALESCE(c.nombre_completo, b.datos_anteriores->>'nombre_completo') AS nombre_cliente
        FROM  bitacora_clientes b
        LEFT  JOIN clientes c ON c.id = b.cliente_id
        ORDER BY b.fecha DESC;
    `;
    return (await pool.query(query)).rows;
};

export const getBitacoraByCliente = async (clienteId) => {
    const query = `
        SELECT id, operacion, cliente_id, datos_anteriores, datos_nuevos, usuario_db, fecha
        FROM   bitacora_clientes
        WHERE  cliente_id = $1
        ORDER BY fecha DESC;
    `;
    return (await pool.query(query, [clienteId])).rows;
};
