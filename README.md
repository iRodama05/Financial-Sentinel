# Financial Sentinel (Sistema SVA)
Financial Sentinel es una plataforma web Full-Stack diseñada para la gestión de identidades, control de acceso basado en roles (RBAC) y la ingesta masiva de datos (CSV) orientada al cumplimiento normativo (PLD).

## Arquitectura del Sistema
El proyecto está dividido en dos módulos principales para facilitar su despliegue y escalabilidad:
- Frontend: Vanilla JavaScript (ES6 Modules), HTML5 y CSS3 puro. Sin frameworks pesados.
- Backend: Node.js con Express.js.
- Base de Datos: PostgreSQL (Alojado en Supabase).
- Requisitos Previos
- Para correr este proyecto en un entorno local, necesitas tener instalado:
- Node.js (v16.0 o superior)
- Git


## 1. Instalación y Ejecución del Backend
El motor del sistema maneja la seguridad, la conexión a la base de datos y el procesamiento en memoria de archivos binarios (CSV).

### Paso 1.1: Instalar dependencias
Abre tu terminal, navega a la carpeta del backend y descarga las librerías necesarias:
```
cd backend
npm install
```
*(Nota: Si no tienes el archivo package.json actualizado, puedes forzar la instalación con: npm install express cors dotenv pg bcryptjs jsonwebtoken multer csv-parser)*

**Librerías utilizadas:**
- express: Framework del servidor web.
- cors: Permite peticiones desde el frontend.
- pg: Driver de conexión para PostgreSQL.
- bcryptjs: Cifrado y hashing de contraseñas.
- jsonwebtoken: Generación de "gafetes" de sesión (JWT).
- multer: Procesamiento de archivos subidos (Multipart/form-data) en Memoria RAM.
- csv-parser: Conversión de archivos CSV binarios a objetos JSON.
- dotenv: Manejo de variables de entorno seguras.

### Paso 1.2: Variables de Entorno
Crea un archivo llamado .env en la raíz de la carpeta backend y configura tus credenciales:

```
PORT=3000
DB_USER=postgres
DB_PASSWORD=tu_password_de_supabase
DB_HOST=aws-0-us-east-1.pooler.supabase.com
DB_PORT=6543
DB_NAME=postgres
JWT_SECRET=escribe_aqui_una_frase_secreta_muy_larga
```

### Paso 1.3: Iniciar el servidor
```
npm start
```
*O alternativamente: node server.js*

Verás un mensaje indicando: Servidor corriendo en el puerto 3000.

## 2. Instalación y Ejecución del Frontend
Como el frontend utiliza módulos nativos de JavaScript (type="module"), no puede abrirse simplemente dándole doble clic al archivo HTML. Requiere un servidor local estático para evitar bloqueos de seguridad (CORS de protocolo file://).
### Paso 3.1: Enlace con el Backend
Abre los archivos js/api/authApi.js, js/views/usuarios.js y js/views/cargaMasiva.js.
Asegúrate de que las URLs apunten a tu servidor local para pruebas:
```
// Cambiar URL de producción a Localhost
const url = 'http://localhost:3000/api/...'; 
```

### Paso 3.2: Levantar el servidor frontal
Abre una nueva terminal, navega a la carpeta del frontend y levanta un servidor estático. Puedes usar la herramienta nativa de Node (http-server):
```
cd frontend
npx http-server -p 8080
```
*(Alternativa: Usar la extensión "Live Server" en Visual Studio Code).*

Abre tu navegador en http://localhost:8080 y la aplicación estará operativa.
