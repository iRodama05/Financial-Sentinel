import express from 'express';
import { generarReporteXML, listarReportes } from '../controllers/reporteController.js';
import { verificarToken, verificarRolAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/generar', verificarToken,  verificarRolAdmin, generarReporteXML);
router.get('/', verificarToken, listarReportes);

export default router;