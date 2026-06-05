import express from 'express';
import { registrarCliente, listarClientes } from '../controllers/clienteController.js';
import { verificarToken, verificarRolAdmin } from '../middleware/authMiddleware.js'; // Importamos el candado

const router = express.Router();

// Verificación de token
router.get('/', verificarToken, listarClientes);
router.post('/', verificarToken, verificarRolAdmin, registrarCliente);

export default router;