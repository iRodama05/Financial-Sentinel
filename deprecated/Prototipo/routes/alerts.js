/* Importar módulos */
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const vista = require('../views/layout');
const data = require('../data');

/* Mostrar alertas */
router.get('/', auth.requireAuth, function(req, res){

    let user = req.session.user;
    let filas = "";

    for(let i = 0; i < data.alerts.length; i++){
        filas += `
<tr>
<td>${data.alerts[i].id}</td>
<td>${data.alerts[i].client}</td>
<td>${data.alerts[i].type}</td>
<td>${data.alerts[i].risk}</td>
<td>${data.alerts[i].date}</td>
<td>${data.alerts[i].status}</td>
</tr>`;
    }

    let content = `
<h2>Alertas</h2>
<p>Lista de alertas registradas.</p>

<table border="1" cellpadding="5">
<tr>
<th>ID</th>
<th>Cliente</th>
<th>Tipo</th>
<th>Riesgo</th>
<th>Fecha</th>
<th>Estado</th>
</tr>
${filas}
</table>
`;

    res.send(vista.layout(user, 'Alertas', '/dashboard/alerts', content));

});

/* Exportar rutas */
module.exports = router;