import express from 'express';
import { generarReporteXML, listarReportes } from '../controllers/reporteController.js';
import { verificarToken, verificarRolAdmin, verificarNoEmpleado} from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/generar', verificarToken,  verificarRolAdmin, generarReporteXML);
router.get('/', verificarToken, verificarNoEmpleado, listarReportes);

export default router;