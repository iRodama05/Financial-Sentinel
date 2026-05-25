/* Importar módulos */
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const vista = require('../views/layout');
const data = require('../data');

/* Mostrar reportes */
router.get('/', auth.requireAuth, function(req, res){

    let user = req.session.user;

    if(user.role != "compliance_officer"){

        let content = `
<h2>Acceso restringido</h2>
<p>Solo el Oficial de Cumplimiento puede ver los reportes.</p>
<a href="/dashboard">Regresar</a>
`;

        return res.send(vista.layout(user, 'Reportes', '/dashboard/reports', content));
    }

    let filas = "";

    for(let i = 0; i < data.reports.length; i++){
        filas += `
<tr>
<td>${data.reports[i].id}</td>
<td>${data.reports[i].description}</td>
<td>${data.reports[i].period}</td>
<td>${data.reports[i].date}</td>
<td>${data.reports[i].format}</td>
</tr>`;
    }

    let content = `
<h2>Reportes</h2>
<p>Lista de reportes generados.</p>

<table border="1" cellpadding="5">
<tr>
<th>ID</th>
<th>Descripción</th>
<th>Período</th>
<th>Fecha</th>
<th>Formato</th>
</tr>
${filas}
</table>
`;

    res.send(vista.layout(user, 'Reportes', '/dashboard/reports', content));

});

/* Exportar rutas */
module.exports = router;