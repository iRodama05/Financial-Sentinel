import express from 'express';
import { getResumen } from '../controllers/dashboardController.js';
import { verificarToken, verificarNoEmpleado} from '../middleware/authMiddleware.js';

const router = express.Router();
router.get('/', verificarToken, verificarNoEmpleado, getResumen);

export default router;