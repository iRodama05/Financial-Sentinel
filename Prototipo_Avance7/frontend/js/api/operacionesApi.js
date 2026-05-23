import express from 'express';
// Ajusta la cantidad de "../" dependiendo de cuántas carpetas debas subir 
// para llegar a la carpeta "controllers"
import { listarOperaciones } from '../controllers/operacionController.js';

const router = express.Router();

// Ruta base GET. Como en server.js le diremos que este archivo maneja '/api/operaciones',
// aquí solo necesitamos poner '/'
router.get('/', listarOperaciones);

export default router;