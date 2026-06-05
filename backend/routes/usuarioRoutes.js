import express from 'express';
import { crearUsuario } from '../controllers/usuarioController.js';
import { verificarToken, verificarAdminAbsoluto } from '../middleware/authMiddleware.js';

const router = express.Router();

// SOLO un Admin logueado puede disparar esta ruta
router.post('/', verificarToken, verificarAdminAbsoluto, crearUsuario);

export default router;