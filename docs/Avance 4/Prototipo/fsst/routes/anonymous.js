const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/pages/anonymous.html'));
});

router.post('/submit', (req, res) => {
  // In a real system, save to DB here
  res.sendFile(path.join(__dirname, '../public/pages/anonymous-success.html'));
});

module.exports = router;
