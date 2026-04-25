function requireAuth(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/');
  }
  next();
}

function requireOfficer(req, res, next) {
  if (!req.session.user) return res.redirect('/');
  if (req.session.user.role !== 'compliance_officer') {
    return res.redirect('/dashboard');
  }
  next();
}

module.exports = { requireAuth, requireOfficer };
