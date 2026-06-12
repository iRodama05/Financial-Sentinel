import express from 'express';
import { procesarCargaMasiva, procesarCargaOperaciones, uploadMiddleware } from '../controllers/cargaMasivaController.js';
import { verificarToken, verificarNoEmpleado } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/clientes', uploadMiddleware, verificarNoEmpleado, procesarCargaMasiva);
router.post('/operaciones', uploadMiddleware, verificarNoEmpleado, procesarCargaOperaciones);

export default router;