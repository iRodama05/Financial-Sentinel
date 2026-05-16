import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import pool from './db/connection.js';
import clientRoutes from './routes/clientRoutes.js';
import authRoutes from './routes/authRoutes.js';
import alertaRoutes from './routes/alertaRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import operacionRoutes from './routes/operacionRoutes.js';
import contratoRoutes from './routes/contratoRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

/* Ruta del frontend */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendPath = path.join(__dirname, '../frontend');

// ===================[MIDDLEWARES]===================
// <Inicia IA>
app.use(cors());

app.use(express.json());
// <Termina IA>

/* Archivos estáticos del frontend */
app.use(express.static(frontendPath));

/* Ruta principal */
app.get('/', (req, res) => {
    res.sendFile(path.join(frontendPath, 'login.html'));
});

// ======================[RUTAS]======================
app.get('/api/health', (req, res) => {
    res.status(200).json({ mensaje: 'El API de Sentinel está vivo y respirando (yey).' });
});

app.use('/api/clientes', clientRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/alertas', alertaRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/operaciones', operacionRoutes);
app.use('/api/clientes', clientRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/alertas', alertaRoutes);
app.use('/api/contratos', contratoRoutes);

// ===============[INICIO DEL SERVIDOR]===============
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en el puerto ${PORT}`);
    console.log(`Prueba de salud: http://localhost:${PORT}/api/health`);
});