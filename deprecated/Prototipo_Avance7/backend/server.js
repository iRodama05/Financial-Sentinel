import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './db/connection.js';
import clientRoutes from './routes/clientRoutes.js';
import authRoutes from './routes/authRoutes.js';
import alertaRoutes from './routes/alertaRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import operacionRoutes from './routes/operacionRoutes.js';
import contratoRoutes from './routes/contratoRoutes.js';
import bcrypt from 'bcrypt';
import clienteRoutes from './routes/clientRoutes.js';
import reporteRoutes from './routes/reporteRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ===================[MIDDLEWARES]===================
// <Inicia IA>
app.use(cors()); 

app.use(express.json()); 
// <Termina IA>

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
app.use('/api/clientes', clienteRoutes);
app.use('/api/alertas', alertaRoutes);
app.use('/api/operaciones', operacionRoutes);
app.use('/api/reportes', reporteRoutes);


// RUTA TEMPORAL PARA GENERAR REGLAS PERFILADAS Y ALERTAS
app.get('/api/semilla-alertas', async (req, res) => {
    try {
        // 1. Buscamos al primer cliente válido
        const cliente = await pool.query('SELECT id, nombre_completo FROM clientes LIMIT 1');
        
        if (cliente.rows.length === 0) {
            return res.status(400).send("❌ Debes registrar al menos un cliente en el frontend primero.");
        }
        
        const idCliente = cliente.rows[0].id;
        const nombreCliente = cliente.rows[0].nombre_completo;

        // 2. Le creamos su regla personalizada a ESTE cliente
        const insertReglaQuery = `
            INSERT INTO reglas (cliente_id, nombre_regla, umbral_monto, activa) 
            VALUES ($1, $2, $3, $4) 
            RETURNING id
        `;
        const reglaResult = await pool.query(insertReglaQuery, [
            idCliente, 
            'Depósito inusual para su perfil', 
            50000.00, // Su límite personal
            true
        ]);
        
        const idRegla = reglaResult.rows[0].id;

        // 3. Generamos las alertas amarrando el cliente y SU regla recién creada
        const insertAlertaQuery = `
            INSERT INTO alertas (cliente_id, operacion_id, regla_id, estatus, fecha_generacion) 
            VALUES ($1, NULL, $2, $3, NOW())
        `;

        await pool.query(insertAlertaQuery, [idCliente, idRegla, 'Nueva']);
        await pool.query(insertAlertaQuery, [idCliente, idRegla, 'Investigando']);
        await pool.query(insertAlertaQuery, [idCliente, idRegla, 'Falsa Alarma']);

        res.send(`✅ ¡Éxito! Se creó una regla personalizada para ${nombreCliente} y 3 alertas derivadas de esa regla.`);
    } catch (error) {
        console.error("Fallo estructural en la semilla:", error);
        res.status(500).send("Error en la base de datos: " + error.message);
    }
});

// ===============[INICIO DEL SERVIDOR]===============
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en el puerto ${PORT}`);
    console.log(`Prueba de salud: http://localhost:${PORT}/api/health`);
});