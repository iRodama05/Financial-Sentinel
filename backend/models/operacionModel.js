import pool from '../db/connection.js';

// AQUÍ ESTÁ LA MAGIA: El nombre debe ser exactamente "obtenerTodasOperaciones"
export const obtenerTodasOperaciones = async () => {
    const query = `
        SELECT 
            o.id AS folio_operacion, 
            o.fecha_operacion, 
            c.id AS contrato_folio, 
            cli.nombre_completo AS nombre_cliente, 
            cli.id AS cliente_id, 
            o.tipo_movimiento, 
            o.monto 
        FROM operaciones o
        LEFT JOIN contratos c ON o.contrato_id = c.id
        LEFT JOIN clientes cli ON c.cliente_id = cli.id
        ORDER BY o.fecha_operacion DESC;
    `;
    
    const result = await pool.query(query);
    return result.rows;
};