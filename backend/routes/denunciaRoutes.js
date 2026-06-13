import express from 'express';
import { enviarDenuncia, listarDenuncias } from '../controllers/denunciaController.js';
import { verificarToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Pública — cualquiera puede enviar una denuncia (sin token)
router.post('/', enviarDenuncia);

// Solo oficial o admin pueden ver las denuncias
router.get('/', verificarToken, (req, res, next) => {
    const rol = (req.usuario?.rol || '').toLowerCase();
    const correo = req.usuario?.correo || '';
    if (rol === 'administrador' || correo === 'oficial@fsst.com') return next();
    return res.status(403).json({ error: 'Acceso denegado: Solo el Oficial de Cumplimiento puede ver las denuncias.' });
}, listarDenuncias);

export default router;