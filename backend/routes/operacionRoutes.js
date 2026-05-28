import express from 'express';
import { listarOperaciones } from '../controllers/operacionController.js';
import { verificarToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// 2. Coloca al guardia EN MEDIO
router.get('/', verificarToken, listarOperaciones);

export default router;