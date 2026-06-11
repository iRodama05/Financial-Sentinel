import express from 'express';
import { enviarDenuncia, listarDenuncias } from '../controllers/denunciaController.js';
import { verificarToken, verificarAdminAbsoluto } from '../middleware/authMiddleware.js';

const router = express.Router();

// Pública — cualquiera puede enviar una denuncia (sin token)
router.post('/', enviarDenuncia);

// Solo admin puede ver las denuncias
router.get('/', verificarToken, verificarAdminAbsoluto, listarDenuncias);

export default router;
