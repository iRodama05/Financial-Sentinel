/* Importar módulos */
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const vista = require('../views/layout');
const data = require('../data');

/* Mostrar operaciones */
router.get('/', auth.requireAuth, function(req, res){

    let user = req.session.user;
    let filas = "";

    for(let i = 0; i < data.clients.length; i++){
        filas += `
<tr>
<td>${data.clients[i].id}</td>
<td>${data.clients[i].name}</td>
<td>${data.clients[i].operations}</td>
<td>${data.clients[i].alerts}</td>
<td>${data.clients[i].risk}</td>
<td><a href="/dashboard/clients/${data.clients[i].id}">Ver cliente</a></td>
</tr>`;
    }

    let content = `
<h2>Operaciones</h2>
<p>Resumen de operaciones por cliente.</p>

<table border="1" cellpadding="5">
<tr>
<th>ID</th>
<th>Cliente</th>
<th>Operaciones</th>
<th>Alertas</th>
<th>Riesgo</th>
<th>Acciones</th>
</tr>
${filas}
</table>
`;

    res.send(vista.layout(user, 'Operaciones', '/dashboard/operations', content));

});

/* Exportar rutas */
module.exports = router;