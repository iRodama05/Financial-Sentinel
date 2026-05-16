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