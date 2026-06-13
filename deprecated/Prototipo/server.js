/* Importar módulos */
const express = require('express');
const session = require('express-session');
const path = require('path');

/* Crear servidor */
const app = express();

/* Middleware */
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

/* Sesión */
app.use(session({
    secret: '12345',
    resave: false,
    saveUninitialized: false
}));

/* Importar rutas */
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const clientsRoutes = require('./routes/clients');
const operationsRoutes = require('./routes/operations');
const alertsRoutes = require('./routes/alerts');
const reportsRoutes = require('./routes/reports');
const anonymousRoutes = require('./routes/anonymous');

/* Usar rutas */
app.use('/', authRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/dashboard/clients', clientsRoutes);
app.use('/dashboard/operations', operationsRoutes);
app.use('/dashboard/alerts', alertsRoutes);
app.use('/dashboard/reports', reportsRoutes);
app.use('/anonymous-report', anonymousRoutes);

/* Ruta no encontrada */
app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, 'public', 'pages', '404.html'));
});

/* Encender servidor */
app.listen(3000, () => {
    console.log('Servidor iniciado');
});