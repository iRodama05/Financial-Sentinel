/* Importar módulos */
const express = require('express');
const router = express.Router();
const data = require('../data');
const path = require('path');

/* Mostrar login */
router.get('/', function(req, res){
    if(req.session.user){
        return res.redirect('/dashboard');
    }

    res.sendFile(path.join(__dirname, '../public/pages/login.html'));
});

/* Validar login */
router.post('/login', function(req, res){
    let email = req.body.email;
    let password = req.body.password;
    let user = null;

    for(let i = 0; i < data.users.length; i++){
        if(data.users[i].email == email && data.users[i].password == password){
            user = data.users[i];
            break;
        }
    }

    if(user != null){
        req.session.user = {
            email: user.email,
            role: user.role,
            name: user.name
        };

        return res.redirect('/dashboard');
    }

    res.redirect('/?error=1');
});

/* Cerrar sesión */
router.get('/logout', function(req, res){
    req.session.destroy();
    res.redirect('/');
});

/* Exportar rutas */
module.exports = router;