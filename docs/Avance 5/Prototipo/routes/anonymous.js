/* Importar módulos */
const express = require('express');
const router = express.Router();
const path = require('path');

/* Mostrar formulario anónimo */
router.get('/', function(req, res){
    res.sendFile(path.join(__dirname, '../public/pages/anonymous.html'));
});

/* Recibir formulario */
router.post('/submit', function(req, res){
    /* Aquí se guardarían los datos */
    res.sendFile(path.join(__dirname, '../public/pages/anonymous-success.html'));
});

/* Exportar rutas */
module.exports = router;