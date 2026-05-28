## 1. Reglas Generales de Conexión

* **Formato de envío:** Todas las peticiones `POST` y `PUT` deben llevar el header `Content-Type: application/json` y enviar un JSON estricto en el body.
* **Seguridad:** Salvo el Login, **todas** las rutas requieren enviar el Token de sesión en los headers de la petición: `Authorization: Bearer [TU_TOKEN]`.

---

## 2. Mapa de Endpoints

### Autenticación (Login)

* **¿Qué hace?** Valida al usuario y devuelve el Token necesario para usar el resto del sistema.
* **Endpoint:** `POST /api/auth/login`
* **Body requerido:** `{"correo": "admin@sentinel.com", "password": "Password123!"}`
* **Acción en Frontend:** Deben guardar el `token` devuelto en el `localStorage` o `sessionStorage`.

### Dashboard

* **¿Qué hace?** Devuelve los totales para pintar las tarjetas principales en una sola petición.
* **Endpoint:** `GET /api/dashboard`
* **Body requerido:** N/A.

### Clientes

* **¿Quieres pintar la tabla con todos los clientes?**
* **Endpoint:** `GET /api/clientes`


* **¿Quieres registrar un cliente nuevo desde un formulario?**
* **Endpoint:** `POST /api/clientes`
* **Body requerido:** `{"rfc": "...", "curp": "...", "nombre_completo": "...", "fecha_nacimiento": "YYYY-MM-DD", "nacionalidad": "...", "pais_nacimiento": "...", "genero": "...", "estado_civil": "...", "tel_celular": "...", "tel_fijo": "...", "correo": "...", "es_pep": false, "actua_cuenta_propia": true}`
* *Nota interna:* El backend creará automáticamente su perfil transaccional. No necesitan programar eso.



### Alertas

* **¿Quieres llenar la tabla de alertas?**
* **Endpoint:** `GET /api/alertas`
* *Nota:* El JSON devuelto ya trae el nombre del cliente y de la regla rotos cruzados por SQL.


* **¿Quieres cambiar el estatus de una alerta (Dictaminar)?**
* **Endpoint:** `PUT /api/alertas/:id/estatus` *(Ej. `/api/alertas/5/estatus`)*
* **Body requerido:** `{"estatus": "Investigando"}`
* *Valores permitidos:* `Nueva`, `Investigando`, `Falsa Alarma`, `Reportada a CNBV`.



### 💰 Operaciones

* **¿Quieres ver el historial de transacciones recientes?**
* **Endpoint:** `GET /api/operaciones/recientes`


* **¿Quieres registrar un nuevo depósito o retiro?**
* **Endpoint:** `POST /api/operaciones`
* **Body requerido:** `{"contrato_id": 1, "monto": 50000.00, "tipo_movimiento": "Deposito"}`



### 📄 Contratos (Dependencia para Menús)

* **¿Quieres llenar un menú `<select>` con las cuentas de un cliente para poder registrarle una operación?**
* **Endpoint:** `GET /api/contratos?cliente_id=ID_DEL_CLIENTE` *(Ej. `/api/contratos?cliente_id=3`)*



---

## 3. Código Base

Usen esta función en sus archivos de JavaScript para no repetir código en cada llamada al backend. Automáticamente inyecta el token y parsea el JSON.

```javascript
async function peticionProtegida(ruta, metodo = 'GET', cuerpo = null) {
    const token = localStorage.getItem('token_sentinel'); // Ajusten la llave según como lo guarden
    
    const opciones = {
        method: metodo,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    };

    if (cuerpo) {
        opciones.body = JSON.stringify(cuerpo);
    }

    try {
        const respuesta = await fetch(`http://localhost:3000${ruta}`, opciones);
        const data = await respuesta.json();
        
        if (!respuesta.ok) {
            console.error("El backend rechazó la petición:", data.error);
            alert(data.error); // O mostrar en un modal
            return null;
        }
        
        return data;
    } catch (error) {
        console.error("Error de red o servidor caído:", error);
    }
}

// ==========================================
// EJEMPLOS DE USO DIRECTO EN SUS VISTAS (UI):
// ==========================================

// Para cargar el Dashboard:
// const totales = await peticionProtegida('/api/dashboard');

// Para cambiar estatus de alerta ID 12:
// await peticionProtegida('/api/alertas/12/estatus', 'PUT', { estatus: "Falsa Alarma" });

```

---

## 4. Directorio Interno

Si tienen duda de por qué una petición falla (ej. Error 400 Bad Request), no modifiquen el código, solo lean estos archivos en la carpeta `backend/` para entender qué está exigiendo el servidor:

* `routes/`: Entren aquí si no están seguros de cuál es la URL exacta o el método (GET/POST/PUT) de un endpoint.
* `controllers/`: Entren aquí si necesitan ver exactamente qué llaves y nombres de variables exige el `req.body`.
* `models/`: Aquí están los queries SQL directos. (No modificar).

```
C:.
│   README.md
│
├───backend
│   │   .env
│   │   .gitignore
│   │   package-lock.json
│   │   package.json
│   │   server.js
│   │
│   ├───controllers
│   │       alertaController.js
│   │       authController.js
│   │       clienteController.js
│   │       contratoController.js
│   │       dashboardController.js
│   │       operacionController.js
│   │
│   ├───db
│   │       connection.js
│   │
│   ├───middleware
│   │       authMiddleware.js
│   │
│   ├───models
│   │       alertaModel.js
│   │       authModel.js
│   │       clientModel.js
│   │       contratoModel.js
│   │       dashboardModel.js
│   │       operacionModel.js
│   │       perfilModel.js
│   │
│   └───routes
│           alertaRoutes.js
│           authRoutes.js
│           clientRoutes.js
│           contratoRoutes.js
│           dashboardRoutes.js
│           operacionRoutes.js
│
└───frontend
    │   alertas.html
    │   clientes.html
    │   dashboard.html
    │   login.html
    │
    ├───css
    │       components.css
    │       layout.css
    │       variables.css
    │
    └───js
        ├───api
        │       alertasApi.js
        │       apiClient.js
        │       authApi.js
        │       clientesApi.js
        │       contratosApi.js
        │       dashboardApi.js
        │       operacionesApi.js
        │
        ├───components
        │       modales.js
        │       sidebar.js
        │
        └───views
                alertas.js
                clients.js
                dashboard.js
                login.js
```