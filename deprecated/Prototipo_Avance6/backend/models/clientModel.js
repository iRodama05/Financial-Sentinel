import pool from '../db/connection.js';

// Crear un nuevo cliente
export const createCliente = async (clienteData) => {
    const {
        rfc, curp, nombre_completo, fecha_nacimiento,
        nacionalidad, pais_nacimiento, genero, estado_civil,
        tel_celular, tel_fijo, correo, es_pep, actua_cuenta_propia
    } = clienteData;

    const query = `
        INSERT INTO clientes (
            rfc, curp, nombre_completo, fecha_nacimiento, 
            nacionalidad, pais_nacimiento, genero, estado_civil, 
            tel_celular, tel_fijo, correo, es_pep, actua_cuenta_propia
        ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13
        ) RETURNING id, rfc, nombre_completo;
    `;

    const values = [
        rfc, curp, nombre_completo, fecha_nacimiento,
        nacionalidad, pais_nacimiento, genero, estado_civil,
        tel_celular, tel_fijo, correo, 
        es_pep || false, // Asignamos false por defecto si viene vacío
        actua_cuenta_propia !== undefined ? actua_cuenta_propia : true // <Línea con IA>
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
};

// Obtener todos los clientes
export const getAllClientes = async () => {
    const query = `
        SELECT id, rfc, curp, nombre_completo, correo, es_pep 
        FROM clientes 
        ORDER BY id DESC;
    `;
    const result = await pool.query(query);
    return result.rows;
};