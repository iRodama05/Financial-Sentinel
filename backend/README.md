# Guía de Arquitectura Backend

Este documento es la referencia técnica definitiva para el desarrollo del servidor de la SOFOM. Su objetivo es garantizar que el código se mantenga escalable, seguro y libre de antipatrones. Todo el equipo debe adherirse estrictamente a las reglas descritas aquí.

## 1. Secuencia de Inicialización Local

Para levantar el servidor en tu entorno de desarrollo, sigue este procedimiento al pie de la letra:

1. **Instalación de Dependencias:** Ejecuta `npm install` en la raíz de la carpeta `backend/`. Esto leerá el archivo `package.json` y descargará Node modules críticos (Express, pg, dotenv, cors).

2. **Configuración de Variables de Entorno:** Crea un archivo llamado exactamente `.env` (sin nombre antes del punto) en la raíz de `backend/`. **Este archivo está ignorado por Git y jamás debe ser subido al repositorio.**
   ```env
   PORT=3000
   DB_URL=tu_cadena_de_conexion_postgresql
   DB_KEY=tu_llave_anon_supabase

3. **Arranque del Servidor:** * **Desarrollo:** Ejecuta `npm run dev`. Este comando utiliza el flag nativo `--watch` de Node, lo que significa que el servidor se reiniciará automáticamente cada vez que guardes un archivo con tu editor.
   * **Producción/Pruebas en frío:** Ejecuta `npm start`.

---

## 2. Arquitectura de Directorios

El proyecto utiliza una separación estricta de responsabilidades (Separation of Concerns). Mezclar responsabilidades (ej. escribir consultas SQL dentro de un archivo de rutas) será motivo de rechazo en el Pull Request, así que estén atentos.

### `server.js` (El Archivo Raíz)
* **Función:** Es el punto de entrada de la aplicación.
* **El "Por qué":** Necesitamos un lugar único para inicializar Express, inyectar middlewares globales (como CORS para permitir peticiones del frontend y JSON parser) y montar las rutas maestras. Aquí no va ninguna lógica de negocio, solo configuración de arranque.

### `db/` (Capa de Persistencia)
* **Función:** Contiene `connection.js`, el cual inicializa el pool de conexiones a PostgreSQL/Supabase.
* **El "Por qué":** Crear una conexión a la base de datos por cada petición del usuario saturaría el servidor y colapsaría la memoria. Al aislarlo aquí, creamos un único "Pool" de conexiones que se reutiliza de forma eficiente en toda la aplicación.

### `routes/` (Los Semáforos)
* **Función:** Define las URLs (endpoints) a las que el frontend puede hacer peticiones HTTP (GET, POST, PUT, DELETE).
* **El "Por qué":** Un archivo de rutas solo debe actuar como un mapa. Lee la URL solicitada, verifica qué método HTTP es, y redirige el tráfico a la función correspondiente en `controllers/`. **Prohibido escribir queries SQL o lógica de validación aquí.**

### `controllers/` (El Cerebro)
* **Función:** Contiene la lógica de negocio.
* **El "Por qué":** Aquí es donde la "magia" ocurre. Un controlador recibe los datos del frontend (el *request*), valida que la información sea correcta, se comunica con la base de datos para extraer o insertar información, formatea los resultados y envía la respuesta (el *response*) de vuelta al usuario. Aislarlos permite probar la lógica financiera sin necesidad de simular peticiones web completas.

### `middleware/` (Los Guardias de Seguridad)
* **Función:** Funciones intermedias que se ejecutan *antes* de que la petición llegue al controlador.
* **El "Por qué":** Si 10 rutas diferentes requieren que el usuario sea un "Oficial de Cumplimiento" logueado, no vas a escribir la validación del token 10 veces. Escribes un middleware `verificarOficial.js` y se lo inyectas a la ruta. Si el middleware detecta que no hay permisos, corta la petición y devuelve un error 403, protegiendo al controlador.

---

## 3. Flujo de Ejecución de una Petición

Para entender cómo interactúan las carpetas, este es el ciclo de vida de una petición cuando el frontend pide ver las alertas:

1. **Frontend envía:** `GET http://localhost:3000/api/alertas`
2. **`server.js` intercepta:** Pasa la petición por los middlewares globales (CORS, JSON).
3. **`routes/alertasRoutes.js` mapea:** Detecta que es un GET a `/` y la manda a `obtenerAlertas()`.
4. **`middleware/auth.js` filtra:** Verifica el token del usuario. Si es válido, lo deja pasar.
5. **`controllers/alertasController.js` procesa:** Toma el control, invoca un query SQL a través de `db/connection.js`.
6. **`db/connection.js` ejecuta:** Va a PostgreSQL, obtiene los datos y los regresa al controlador.
7. **Controlador responde:** Formatea los datos en JSON y hace un `res.status(200).json(datos)`.

---

## 4. Estándares de Código

### Sintaxis ESM (EcmaScript Modules)
El proyecto está configurado para usar ESM (`"type": "module"` en `package.json`).
* ❌ **MAL:** `const express = require('express');`
* ✅ **BIEN:** `import express from 'express';`

### Manejo de Promesas y Errores
Toda interacción con la base de datos es asíncrona. Si no usas `try/catch`, una falla en la red tirará todo el servidor.
* ❌ **MAL:**
  ```javascript
  const datos = await db.query('SELECT * FROM clientes');
  res.json(datos);
  ```
* ✅ **BIEN:**
  ```javascript
  try {
      const result = await pool.query('SELECT * FROM clientes');
      res.status(200).json(result.rows);
  } catch (error) {
      console.error("Error en base de datos:", error);
      res.status(500).json({ error: "Fallo interno del servidor" });
  }
  ```

### Códigos de Estado HTTP Correctos
El frontend depende de estos números para saber qué hacer en la interfaz:
* `200 OK`: Petición exitosa (GET/PUT).
* `201 Created`: Recurso creado exitosamente (POST).
* `400 Bad Request`: El frontend envió datos incompletos o mal formateados.
* `401 Unauthorized`: No hay token de sesión o es inválido.
* `403 Forbidden`: Tiene token, pero no tiene nivel de permisos para esta acción.
* `500 Internal Server Error`: Falló algo de nuestro lado (código mal escrito o base de datos caída).

---

## 5. Protocolo de Git y Ramas

Para evitar colisiones catastróficas en el código, el trabajo se gestiona bajo el modelo **Feature Branch**.

1. **Actualiza tu local:** Siempre, antes de empezar tu día, corre `git pull origin main`.
2. **Aísla tu trabajo:** Nunca programes en `main`. Crea una rama descriptiva:  
   `git checkout -b feature/crear-endpoint-alertas`  
   *(Usa prefijos como `feature/`, `fix/` o `refactor/`)*.
3. **Commits atómicos:** Guarda tu progreso con mensajes claros de lo que hace el bloque de código, no mensajes vagos como "cambios js".  
   `git commit -m "feat: agrega controlador para crear nuevos clientes"`
4. **Fusión mediante Pull Request (PR):** Sube tu rama a Dev y abre un PR en GitHub. Ningún código entra a `main` ni a `Dev` sin que al menos un integrante distinto al autor lo haya revisado.
5. **PR a Main**: Una vez que, al combinar las aportaciones de todos los integrantes del equipo en la rama de `Dev` y validar de que el código unificado funciona sin problemas, se puede hacer el PR a `main`. Solo se sube a `Main` una vez verificado que todo funciona correctamente.
```
