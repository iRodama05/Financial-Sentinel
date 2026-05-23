import pool from '../db/connection.js';

// 1. Insertar en la nueva tabla dedicada
export const crearReporteRegulatorio = async (alerta_id, cliente_id, usuario_id, descripcion, periodo, xml_content) => {
    const query = `
        INSERT INTO reportes_regulatorios 
        (alerta_id, cliente_id, usuario_id, descripcion, periodo, contenido_xml) 
        VALUES ($1, $2, $3, $4, $5, $6) 
        RETURNING id;
    `;
    const result = await pool.query(query, [alerta_id, cliente_id, usuario_id, descripcion, periodo, xml_content]);
    return result.rows[0];
};

// 2. Obtener el historial cruzando con el nombre del cliente
export const obtenerTodosReportes = async () => {
    const query = `
        SELECT 
            r.id, 
            r.alerta_id,
            r.descripcion, 
            r.periodo, 
            r.fecha_generacion, 
            r.contenido_xml, 
            c.nombre_completo AS nombre_cliente 
        FROM reportes_regulatorios r
        LEFT JOIN clientes c ON r.cliente_id = c.id
        ORDER BY r.fecha_generacion DESC;
    `;
    const result = await pool.query(query);
    return result.rows;
};