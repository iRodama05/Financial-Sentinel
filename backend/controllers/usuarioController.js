import pool from '../db/connection.js';
import bcrypt from 'bcrypt';

export const crearUsuario = async (req, res) => {
    try {
        // 1. Datos que enviará el Frontend
        const { nombre, correo, password, rol } = req.body;

        // 2. Validación de campos vacíos
        if (!nombre || !correo || !password || !rol) {
            return res.status(400).json({ error: "Faltan campos obligatorios para el registro." });
        }

        // 3. Salting y Hashing
        const salt = await bcrypt.genSalt(10);
        // Hasheamos la contraseña plana que llegó del body
        const password_hash = await bcrypt.hash(password, salt);

        // 4. Inserción en la Base de Datos
        const query = `
            INSERT INTO usuarios (nombre, correo, password_hash, rol, activo) 
            VALUES ($1, $2, $3, $4, $5) 
            RETURNING id, nombre, correo, rol, activo;
        `;
        
        // Pasamos el password_hash en lugar del texto plano
        const result = await pool.query(query, [nombre, correo, password_hash, rol, true]);
        
        // 5. Respuesta exitosa devolviendo los datos
        res.status(201).json({ 
            mensaje: "Usuario creado exitosamente.", 
            usuario: result.rows[0] 
        });

    } catch (error) {
        console.error("Error al crear usuario:", error);
        
        // Manejo de Error: 23505 es el código de Postgres para "Violación de llave única"
        if (error.code === '23505') {
            return res.status(400).json({ error: "Este correo ya se encuentra registrado en el sistema." });
        }

        res.status(500).json({ error: "Error interno procesando la solicitud." });
    }
};