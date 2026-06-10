import express from 'express';
import { procesarCargaMasiva, procesarCargaOperaciones, uploadMiddleware } from '../controllers/cargaMasivaController.js';

const router = express.Router();

router.post('/clientes', uploadMiddleware, procesarCargaMasiva);
router.post('/operaciones', uploadMiddleware, procesarCargaOperaciones);

export default router;