import express from 'express';
import { generarReporteXML, listarReportes } from '../controllers/reporteController.js';

const router = express.Router();
router.post('/generar', generarReporteXML);
router.get('/', listarReportes);

export default router;