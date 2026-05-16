import pool from '../db/connection.js';

export const obtenerContratosPorCliente = async (clienteId) => {
    const query = `
        SELECT co.id, co.fecha_apertura, co.estatus, p.nombre_producto 
        FROM contratos co
        JOIN productos p ON co.producto_id = p.id
        WHERE co.cliente_id = $1;
    `;
    const result = await pool.query(query, [clienteId]);
    return result.rows;
};

export const obtenerTodosLosContratos = async () => {
    const query = `
        SELECT co.id, cl.nombre_completo as nombre_cliente, p.nombre_producto, co.estatus
        FROM contratos co
        JOIN clientes cl ON co.cliente_id = cl.id
        JOIN productos p ON co.producto_id = p.id;
    `;
    const result = await pool.query(query);
    return result.rows;
};