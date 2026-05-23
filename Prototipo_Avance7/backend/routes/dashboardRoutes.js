import express from 'express';
import { getResumen } from '../controllers/dashboardController.js';
import { verificarToken } from '../middleware/authMiddleware.js';

const router = express.Router();
router.get('/', verificarToken, getResumen);

export default router;