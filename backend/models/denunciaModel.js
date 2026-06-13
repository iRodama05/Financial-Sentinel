import pool from '../db/connection.js';

export const crearDenuncia = async ({ tipo, asunto, descripcion, archivo_url }) => {
    const query = `
        INSERT INTO denuncias_anonimas (tipo, asunto, descripcion, archivo_url)
        VALUES ($1, $2, $3, $4)
        RETURNING id, fecha_envio;
    `;
    const result = await pool.query(query, [tipo, asunto, descripcion, archivo_url || null]);
    return result.rows[0];
};

export const getAllDenuncias = async () => {
    const query = `SELECT * FROM denuncias_anonimas ORDER BY fecha_envio DESC;`;
    return (await pool.query(query)).rows;
};
