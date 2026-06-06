import express from 'express';
import { crearOperacion, getRecientes } from '../controllers/operacionController.js';
import { verificarToken } from '../middleware/authMiddleware.js';

const router = express.Router();
router.get('/recientes', verificarToken, getRecientes);
router.post('/', verificarToken, crearOperacion);

export default router;