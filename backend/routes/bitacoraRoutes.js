import express from 'express';
import { listarBitacora, listarBitacoraCliente } from '../controllers/bitacoraController.js';
import { verificarToken, soloOficial } from '../middleware/authMiddleware.js';

const router = express.Router();

// Ambas rutas protegidas con doble candado: token + correo oficial@fsst.com
router.get('/',             verificarToken, soloOficial, listarBitacora);
router.get('/cliente/:id',  verificarToken, soloOficial, listarBitacoraCliente);

export default router;
