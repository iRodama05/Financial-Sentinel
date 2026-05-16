import express from 'express';
import { listarContratos } from '../controllers/contratoController.js';
import { verificarToken } from '../middleware/authMiddleware.js';

const router = express.Router();
router.get('/', verificarToken, listarContratos);

export default router;