/* Verificar si el usuario inició sesión */
function requireAuth(req, res, next){
    if(req.session.user){
        next();
    }else{
        res.redirect('/');
    }
}
/* Verificar si el usuario es oficial */
function requireOfficer(req, res, next){
    if(req.session.user == null){
        return res.redirect('/');
    }
    if(req.session.user.role == "compliance_officer"){
        next();
    }else{
        res.redirect('/dashboard');
    }
}
/* Exportar funciones */
module.exports = {
    requireAuth,
    requireOfficer
};