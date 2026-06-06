import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const verificarToken = (req, res, next) => {
    // Busca el token
    const authHeader = req.headers['authorization'];
    
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: "Acceso denegado: No se proporcionó un token de seguridad." });
    }

    try {
        // Desencriptar token
        const usuarioDecodificado = jwt.verify(token, process.env.JWT_SECRET);
        
        req.usuario = usuarioDecodificado;
        
        next();
    } catch (error) {
        // Si el token es inventado, caducó, o tiene una letra mal:
        return res.status(403).json({ error: "Acceso denegado: Token inválido o expirado." });
    }
};

    export const verificarRolAdmin = (req, res, next) => {
    // Si el usuario es un visor, le cortamos el paso inmediatamente
    if (req.usuario && req.usuario.rol === 'Visor') {
        return res.status(403).json({ 
            error: "Acceso denegado: Tu perfil es de solo lectura. No puedes modificar registros." 
        });
    }

    next();
};

export const verificarAdminAbsoluto = (req, res, next) => {
    // Si no es admin, lo rebotamos instantáneamente
    if (req.usuario && req.usuario.rol !== 'Administrador') {
        return res.status(403).json({ 
            error: "Acceso denegado: Operación clasificada. Solo administradores pueden gestionar usuarios." 
        });
    }
    next();
};

export const verificarEmpleado = (req, res, next) => {
    // Si no es admin, lo rebotamos instantáneamente
    if (req.usuario && req.usuario.rol !== 'Empleado') {
        return res.status(403).json({ 
            error: "Acceso denegado: Tu perfil solo permite denuncias anónimas y consulta de operaciones." 
        });
    }
    next();
};
