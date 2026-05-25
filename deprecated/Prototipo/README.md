# 🛡️ FSST — Financial Sentinel System

Sistema de Cumplimiento y Prevención — Node.js + Express + HTML/CSS puro.

## Estructura del proyecto

```
fsst/
├── server.js               # Servidor principal Express
├── data.js                 # Datos mock (clientes, alertas, reportes)
├── package.json
├── middleware/
│   └── auth.js             # Middleware de autenticación
├── routes/
│   ├── auth.js             # Login / Logout
│   ├── dashboard.js        # Dashboard principal
│   ├── clients.js          # Lista y detalle de clientes
│   ├── operations.js       # Operaciones
│   ├── alerts.js           # Alertas
│   ├── reports.js          # Reportes (solo oficial)
│   └── anonymous.js        # Denuncia anónima
├── views/
│   └── layout.js           # Layout con sidebar (generador HTML)
└── public/
    ├── css/
    │   ├── main.css         # Estilos principales
    │   ├── layout.css       # Sidebar y topbar
    │   └── login.css        # Página de login
    ├── js/
    │   └── main.js          # JavaScript del cliente
    └── pages/
        ├── login.html
        ├── anonymous.html
        ├── anonymous-success.html
        └── 404.html
```

## Instalación y uso

```bash
npm install
npm start
# o para desarrollo con auto-reload:
npm run dev
```

Abre: http://localhost:3000

## Credenciales de prueba

| Rol                    | Email              | Contraseña |
|------------------------|--------------------|------------|
| Oficial de Cumplimiento | oficial@fsst.com   | admin123   |
| Visualizador           | viewer@fsst.com    | viewer123  |

## Rutas disponibles

| Ruta                         | Descripción                        | Acceso       |
|------------------------------|------------------------------------|--------------|
| `/`                          | Login                              | Público      |
| `/anonymous-report`          | Denuncia anónima                   | Público      |
| `/dashboard`                 | Dashboard principal                | Auth         |
| `/dashboard/clients`         | Lista de clientes                  | Auth         |
| `/dashboard/clients/:id`     | Detalle de cliente                 | Auth         |
| `/dashboard/operations`      | Operaciones por cliente            | Auth         |
| `/dashboard/alerts`          | Alertas de cumplimiento            | Auth         |
| `/dashboard/reports`         | Generador de reportes              | Solo oficial |
| `/logout`                    | Cerrar sesión                      | Auth         |
