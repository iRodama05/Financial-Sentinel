import express from 'express';
import { registrarCliente, listarClientes } from '../controllers/clienteController.js';
import { verificarToken } from '../middleware/authMiddleware.js'; // Importamos el candado

const router = express.Router();

// Verificación de token
router.get('/', verificarToken, listarClientes);
router.post('/', verificarToken, registrarCliente);

export default router;