import pool from '../db/connection.js';

// Obtiene todas las alertas cruzando datos con Clientes y Reglas
export const obtenerAlertas = async () => {
    const query = `
        SELECT 
            a.id, 
            c.nombre_completo AS nombre_cliente, 
            c.rfc,
            a.operacion_id, 
            r.nombre_regla, 
            a.estatus, 
            a.fecha_generacion 
        FROM alertas a
        LEFT JOIN clientes c ON a.cliente_id = c.id
        LEFT JOIN reglas_monitoreo r ON a.regla_id = r.id
        ORDER BY a.fecha_generacion DESC;
    `;
    const result = await pool.query(query);
    return result.rows;
};

// Permite a un Oficial cambiar el estatus
export const actualizarEstatusAlerta = async (id, nuevoEstatus) => {
    const query = `
        UPDATE alertas 
        SET estatus = $1 
        WHERE id = $2 
        RETURNING id, estatus;
    `;
    const result = await pool.query(query, [nuevoEstatus, id]);
    return result.rows[0];
};