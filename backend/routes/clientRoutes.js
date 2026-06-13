import express from 'express';
import { registrarCliente, listarClientes } from '../controllers/clienteController.js';
import { verificarToken, verificarRolAdmin, verificarNoEmpleado} from '../middleware/authMiddleware.js'; // Importamos el candado

const router = express.Router();

// Verificación de token
router.get('/', verificarToken, verificarNoEmpleado, listarClientes);
router.post('/', verificarToken, verificarRolAdmin, registrarCliente);

export default router;