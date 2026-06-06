import express from 'express';
import { procesarCargaMasiva, uploadMiddleware } from '../controllers/cargaMasivaController.js';

const router = express.Router();

router.post('/clientes', uploadMiddleware, procesarCargaMasiva);

export default router;