import pool from '../db/connection.js';

export const obtenerResumenGeneral = async () => {
    const query = `
        SELECT 
            (SELECT COUNT(*) FROM clientes) AS total_clientes,
            (SELECT COUNT(*) FROM alertas WHERE estatus = 'Nueva') AS alertas_pendientes,
            (SELECT SUM(monto) FROM operaciones) AS volumen_total_transaccionado,
            (SELECT COUNT(*) FROM reportes_internos) AS casos_en_investigacion
    `;
    const result = await pool.query(query);
    return result.rows[0];
};