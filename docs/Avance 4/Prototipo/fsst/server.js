const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'fsst-secret-key-2026',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 8 } // 8 horas
}));

// Rutas
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const clientsRoutes = require('./routes/clients');
const operationsRoutes = require('./routes/operations');
const alertsRoutes = require('./routes/alerts');
const reportsRoutes = require('./routes/reports');
const anonymousRoutes = require('./routes/anonymous');

app.use('/', authRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/dashboard/clients', clientsRoutes);
app.use('/dashboard/operations', operationsRoutes);
app.use('/dashboard/alerts', alertsRoutes);
app.use('/dashboard/reports', reportsRoutes);
app.use('/anonymous-report', anonymousRoutes);

// 404
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', 'pages', '404.html'));
});

app.listen(PORT, () => {
  console.log(`\n🛡️  FSST - Financial Sentinel System`);
  console.log(`📡 Servidor corriendo en: http://localhost:${PORT}`);
  console.log(`\n👤 Credenciales de prueba:`);
  console.log(`   Oficial: oficial@fsst.com / admin123`);
  console.log(`   Viewer:  viewer@fsst.com  / viewer123\n`);
});
