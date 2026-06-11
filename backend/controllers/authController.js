import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as AuthModel from '../models/authModel.js';

export const login = async (req, res) => {
    try {
        const { correo, password } = req.body;

        if (!correo || !password) {
            return res.status(400).json({ error: "Faltan credenciales" });
        }

        // Verificamos si el usuario existe
        const usuario = await AuthModel.obtenerUsuarioPorCorreo(correo);
        if (!usuario) {
            return res.status(401).json({ error: "Correo o contraseña incorrectos" });
        }

        // Verificamos si el usuario está activo
        if (!usuario.activo) {
            return res.status(403).json({ error: "Usuario inactivo. Contacte al administrador." });
        }

        // Comparamos la contraseña encriptada
        const passwordValido = await bcrypt.compare(password, usuario.password_hash);
        if (!passwordValido) {
            return res.status(401).json({ error: "Correo o contraseña incorrectos" });
        }

        // Dentro de tu función de login, cuando firmas el token:
        const token = jwt.sign(
            { 
                id: usuario.id, 
                email: usuario.correo, 
                rol: usuario.rol
            }, 
            process.env.JWT_SECRET, 
            { expiresIn: '8h' }
        );

        // Respondemos con éxito
        res.status(200).json({
            mensaje: "Login exitoso",
            token: token,
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                rol: usuario.rol
            }
        });

    } catch (error) {
        console.error("Error en login:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// Función auxiliar para registrar al primer administrador desde Postman <Sección de IA>
export const registrarPrimerUsuario = async (req, res) => {
    try {
        const { nombre, correo, password, rol } = req.body;

        // Encriptamos la contraseña con un salto de 10 niveles de seguridad
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const nuevoUsuario = await AuthModel.crearUsuario(nombre, correo, passwordHash, rol || 'Administrador');
        res.status(201).json({ mensaje: "Usuario creado", usuario: nuevoUsuario });
    } catch (error) {
        res.status(500).json({ error: "Error al registrar", detalle: error.message });
    }
};