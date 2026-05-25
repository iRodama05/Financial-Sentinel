/* Importar módulos */
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const vista = require('../views/layout');
const data = require('../data');

/* Lista de clientes */
router.get('/', auth.requireAuth, function(req, res){

    let user = req.session.user;
    let filas = "";

    for(let i = 0; i < data.clients.length; i++){
        filas += `
<tr>
<td>${data.clients[i].id}</td>
<td>${data.clients[i].name}</td>
<td>${data.clients[i].type}</td>
<td>${data.clients[i].risk}</td>
<td><a href="/dashboard/clients/${data.clients[i].id}">Ver</a></td>
</tr>`;
    }

    let content = `
<h2>Lista de Clientes</h2>
<table border="1" cellpadding="5">
<tr>
<th>ID</th>
<th>Nombre</th>
<th>Tipo</th>
<th>Riesgo</th>
<th>Acciones</th>
</tr>
${filas}
</table>
`;

    res.send(vista.layout(user, 'Clientes', '/dashboard/clients', content));
});

/* Detalle del cliente */
router.get('/:id', auth.requireAuth, function(req, res){

    let user = req.session.user;
    let cliente = null;

    for(let i = 0; i < data.clients.length; i++){
        if(data.clients[i].id == req.params.id){
            cliente = data.clients[i];
            break;
        }
    }

    if(cliente == null){
        return res.redirect('/dashboard/clients');
    }

    let content = `
<a href="/dashboard/clients">Regresar</a>

<h2>Detalle de Cliente</h2>
<p>ID: ${cliente.id}</p>
<p>Nombre: ${cliente.name}</p>
<p>Tipo: ${cliente.type}</p>
<p>Documento: ${cliente.doc}</p>
<p>Riesgo: ${cliente.risk}</p>
<p>Estado: ${cliente.status}</p>
<p>Email: ${cliente.email}</p>
<p>Teléfono: ${cliente.phone}</p>
<p>Operaciones: ${cliente.operations}</p>
<p>Alertas: ${cliente.alerts}</p>
`;

    res.send(vista.layout(user, 'Detalle de Cliente', '/dashboard/clients', content));
});

/* Exportar rutas */
module.exports = router;