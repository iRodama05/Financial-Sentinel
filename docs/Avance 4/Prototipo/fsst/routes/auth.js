const express = require('express');
const router = express.Router();
const { users } = require('../data');
const path = require('path');

router.get('/', (req, res) => {
  if (req.session.user) return res.redirect('/dashboard');
  res.sendFile(path.join(__dirname, '../public/pages/login.html'));
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    req.session.user = { email: user.email, role: user.role, name: user.name };
    return res.redirect('/dashboard');
  }
  res.redirect('/?error=1');
});

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
