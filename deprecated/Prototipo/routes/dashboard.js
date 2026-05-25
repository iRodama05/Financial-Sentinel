/* Importar módulos */
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const vista = require('../views/layout');
const data = require('../data');

/* Mostrar dashboard */
router.get('/', auth.requireAuth, function(req, res){

    let user = req.session.user;
    let totalClientes = data.clients.length;
    let totalAlertas = data.alerts.length;

    let clientes = "";
    let alertas = "";

    /* Mostrar clientes */
    for(let i = 0; i < data.clients.length && i < 5; i++){
        clientes += `
<tr>
<td>${data.clients[i].id}</td>
<td>${data.clients[i].name}</td>
<td>${data.clients[i].risk}</td>
<td>${data.clients[i].alerts}</td>
</tr>`;
    }

    /* Mostrar alertas */
    for(let i = 0; i < data.alerts.length && i < 3; i++){
        alertas += `
<tr>
<td>${data.alerts[i].id}</td>
<td>${data.alerts[i].client}</td>
<td>${data.alerts[i].risk}</td>
</tr>`;
    }

    let content = `
<h2>Resumen general</h2>
<p>Total de clientes: ${totalClientes}</p>
<p>Total de alertas: ${totalAlertas}</p>
<hr>

<h3>Clientes</h3>
<table border="1" cellpadding="5">
<tr>
<th>ID</th>
<th>Nombre</th>
<th>Riesgo</th>
<th>Alertas</th>
</tr>
${clientes}
</table>

<br>

<h3>Alertas recientes</h3>
<table border="1" cellpadding="5">
<tr>
<th>ID</th>
<th>Cliente</th>
<th>Riesgo</th>
</tr>
${alertas}
</table>
`;

    res.send(vista.layout(user, 'Dashboard Principal', '/dashboard', content));

});

/* Exportar rutas */
module.exports = router;