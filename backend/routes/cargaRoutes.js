import express from 'express';
import { procesarCargaMasiva, procesarCargaOperaciones, uploadMiddleware } from '../controllers/cargaMasivaController.js';
import { verificarToken, verificarNoEmpleado } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/clientes',verificarToken, uploadMiddleware, verificarNoEmpleado, procesarCargaMasiva);
router.post('/operaciones',verificarToken, uploadMiddleware, verificarNoEmpleado, procesarCargaOperaciones);

export default router;