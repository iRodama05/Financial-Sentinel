import express from 'express';
import { login, registrarPrimerUsuario } from '../controllers/authController.js';

const router = express.Router();

router.post('/login', login);
// router.post('/registro-inicial', registrarPrimerUsuario); // Comentado por seguridad

export default router;