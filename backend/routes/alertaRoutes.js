import express from 'express';
import { listarAlertas, dictaminarAlerta } from '../controllers/alertaController.js';
import { verificarToken, verificarRolAdmin, verificarNoEmpleado} from '../middleware/authMiddleware.js';

const router = express.Router();

// GET: Para llenar la tabla del Dashboard
router.get('/', verificarToken, verificarNoEmpleado, listarAlertas);

// PUT: Para cuando el usuario le dé clic al botón de "Cambiar Estatus"
router.put('/:id/estatus', verificarToken, verificarRolAdmin, dictaminarAlerta);

export default router;