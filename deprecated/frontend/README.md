# 🎨 Guía de Arquitectura Frontend - Financial Sentinel

Este documento define la estructura y las reglas de desarrollo para la interfaz de usuario de la SOFOM. Al usar HTML, CSS y JavaScript puro (Vanilla JS), es sumamente fácil generar "código espagueti". Para evitarlo, este proyecto utiliza un sistema estricto de **Módulos de JavaScript** y **Separación de Responsabilidades**.

---

## Inicio Rápido (Cómo visualizar el proyecto)

Dado que no estamos usando un framework como React, no necesitas compilar el código. Sin embargo, debido a que usamos módulos de JS (`type="module"`), no puedes simplemente abrir el archivo `index.html` con doble clic (el navegador bloqueará los scripts por seguridad CORS).

1. **Instala una extensión de servidor local:** En VS Code, instala la extensión **Live Server**.
2. **Abre el proyecto:** Haz clic derecho sobre el archivo `frontend/index.html`.
3. **Ejecuta:** Selecciona la opción **"Open with Live Server"**. Esto abrirá tu navegador en un puerto local (usualmente `http://127.0.0.1:5500`) y recargará la página automáticamente cuando guardes cambios.

---

## Arquitectura de Directorios y el Por Qué de Cada Uno

Prohibido crear un archivo global `script.js` de miles de líneas. Todo el código debe estar segmentado según su propósito.

| Carpeta / Archivo | Propósito | ¿Qué va aquí? |
| :--- | :--- | :--- |
| **`index.html`** | Esqueleto Base | Contiene solo la estructura. **Cero lógica JavaScript y cero estilos en línea.** |
| **`css/`** | Estilos Visuales | Archivos `.css`. Aquí se definen colores, flexbox, grid y tipografías. |
| **`js/main.js`** | Archivo Raíz (Entry Point) | El único script que se conecta al HTML. Su único trabajo es importar e inicializar las vistas. |
| **`js/api/`** | Conexiones al Servidor | Funciones `fetch()` que hablan con nuestro backend en Node. Nadie más hace peticiones a la base de datos. |
| **`js/views/`** | Lógica de Pantallas | Controladores por página (ej. `dashboard.js`, `login.js`). Manejan lo que el usuario ve en ese momento. |
| **`js/components/`** | Elementos Reutilizables | Lógica de partes que se repiten en varias pantallas (ej. `sidebar.js`, `modalAlerta.js`). |

---

## Separación de Responsabilidades

Cualquier Pull Request que rompa estas tres reglas será rechazado:

### 1. El HTML es solo para estructura
Prohibido usar eventos en línea como `onclick=""` o atributos `style=""`. Todo se maneja desde archivos externos.
* ❌ **MAL:** `<button onclick="borrarCliente()" style="color: red;">Borrar</button>`
* ✅ **BIEN:** `<button class="btn-rojo" data-action="borrar-cliente">Borrar</button>`

### 2. Uso obligatorio de `data-attributes`
No selecciones elementos en JavaScript usando clases de CSS (`.class`), ya que si el diseño cambia, el código se rompe. Usa identificadores `data-` para la lógica.
* ❌ **MAL:** `document.querySelector('.btn-rojo')`
* ✅ **BIEN:** `document.querySelector('[data-action="borrar-cliente"]')`

### 3. El CSS pinta, el JS reacciona
No uses JavaScript para inyectar colores o modificar píxeles directamente. JS solo debe agregar o quitar clases.
* ❌ **MAL:** `elemento.style.display = 'none';`
* ✅ **BIEN:** `elemento.classList.add('oculto');`

---

## Conexión Frontend - Backend

Para evitar que las URLs del servidor estén regadas por todo el proyecto, todas las llamadas al backend deben pasar por la carpeta `js/api/`.

1. **Definir la petición (`js/api/apiClient.js`):**
   ```javascript
   const API_URL = 'http://localhost:3000/api';

   export const obtenerAlertas = async () => {
       const response = await fetch(`${API_URL}/alertas`);
       if (!response.ok) throw new Error('Error al cargar alertas');
       return await response.json();
   };
   ```

2. **Usar la petición en la vista (`js/views/dashboard.js`):**
   ```javascript
   import { obtenerAlertas } from '../api/apiClient.js';

   const cargarDashboard = async () => {
       try {
           const alertas = await obtenerAlertas();
           // Lógica para pintar las alertas en el HTML
       } catch (error) {
           console.error(error);
       }
   };
   ```

---

## 🌿 Flujo de Trabajo en Git

1. **Actualiza tu local:** `git pull origin main`.
2. **Crea tu rama de trabajo:** `git checkout -b feature/maquetado-dashboard`.
3. **Trabaja y haz commits atómicos:** `git commit -m "feat: agrega estructura html de la tabla de alertas"`.
4. **Sube tu rama:** `git push origin feature/maquetado-dashboard`.
5. **Crea un Pull Request en GitHub.**
