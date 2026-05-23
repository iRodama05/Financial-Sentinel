import express from 'express';
import { listarOperaciones } from '../controllers/operacionController.js';

const router = express.Router();

router.get('/', listarOperaciones);

export default router;